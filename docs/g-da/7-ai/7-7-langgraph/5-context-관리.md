

## Langgraph에서 LLM context management  

- [Langgraph에서 LLM context management](#langgraph에서-llm-context-management)
  - [1, 현재 대화 context는 graph state(messages 필드)에 둔다.](#1-현재-대화-context는-graph-statemessages-필드에-둔다)
  - [2, Context 저장은 thread별 checkpointer로 한다.](#2-context-저장은-thread별-checkpointer로-한다)
  - [3, LLM에 넣는 context는 매번 state 전체가 아니라 상황에 맞게 넣는다.](#3-llm에-넣는-context는-매번-state-전체가-아니라-상황에-맞게-넣는다)
  - [4, 장기 기억은 graph state가 아니라 store에 넣는다.](#4-장기-기억은-graph-state가-아니라-store에-넣는다)
  - [주의점](#주의점)
  - [1, stream 이벤트로 AIMessageChunk가 나올 수 있다.](#1-stream-이벤트로-aimessagechunk가-나올-수-있다)


### 1, 현재 대화 context는 graph state(messages 필드)에 둔다.   
- 과거의 대화 기록을 messages에 누적하는것이 기본이다. 
- 문제는 대화가 너무 길어지면 컨텍스트 용량에 한계에 부딪힌다.  
  - 최근 N개의 대화의 메시지만 누적해서 넣는다.  
  - 오래된 메시지는 summary 압축해서 같는다.  
  - RAG 문서는 별도의 state에 두고 필요한것만 주입.  
  
### 2, Context 저장은 thread별 checkpointer로 한다.
- InMemorySaver, Redis, Postgres에 graph 자체를 저장.  

### 3, LLM에 넣는 context는 매번 state 전체가 아니라 상황에 맞게 넣는다.  
- llm.invoke()에서는 state 일부를 prompt에 넣어야 하는 경우가 많다. llm.invoke 마다 케이스가 다르다.  
- *최소로 필요한 컨텍스트만 넘기는게 원칙.  
  - 1. 사용자 프로필/선호도 반영 : 언어, UX톤 
  - 2. 현재 작업 상태 조회 : `state["task_goal"], state["plan"]`  
  - 3. 이전 노드의 실행 결과를 llm 호출에 넣어줄 때  
  - 4. RAG 검색 결과 주입  
  - 5. 도구 실행 결과 반영, 출력 형식 및 스키마 생성
  - 6. 라우팅 분기 판단
  - 7. 장기 기억 넣기, 보안 컴플라이언스 규칙, 멀티에이전트 handoff  
- *직접 설계 필요 : state -> user side / internal side | llm context도 마찬가지.   


### 4, 장기 기억은 graph state가 아니라 store에 넣는다.  
- 사용자 프로필, 선호도 등 thread, graph과 별개로 관리한다.  



### 주의점  

### 1, stream 이벤트로 AIMessageChunk가 나올 수 있다.

문제상황 : state에 llm messages을 저장안했는데 메시지가 흘러나와요.   
```py
  def classify_node(state):
      result = llm.invoke([
          SystemMessage(content="Classify intent."),
          state["messages"][-1],
      ])

      return {
          "private": {
              "intent": result.content
          }
      }
```
- state : state["messages"]에 저장되는 메시지 -> 여기에는 저장안되고 있음.  
- graph.stream(..., stream_mode="messages")로 흘러나오는 토큰/청크가 문제.  

해결방법 1. stream output layer에서 필터링  
```py
  for chunk, metadata in graph.stream(...)
      if metadata.get("langgraph_node") == "classify_node":
          continue
      yield chunk
```

해결방법 2. 내부 LLM 호출은 streaming 끄기  
```py
internal_llm = ChatOpenAI(model="...", streaming=False)
```