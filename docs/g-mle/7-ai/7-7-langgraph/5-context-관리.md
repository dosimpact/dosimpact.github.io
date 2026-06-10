---
sidebar_position: 5
---

## Langgraph에서 LLM context management  

- [Langgraph에서 LLM context management](#langgraph에서-llm-context-management)
  - [1, 현재 대화 context는 graph state(messages 필드)에 둔다.](#1-현재-대화-context는-graph-statemessages-필드에-둔다)
  - [2, Context 저장은 thread별 checkpointer로 한다.](#2-context-저장은-thread별-checkpointer로-한다)
  - [3, LLM에 넣는 context는 매번 state 전체가 아니라 상황에 맞게 넣는다.](#3-llm에-넣는-context는-매번-state-전체가-아니라-상황에-맞게-넣는다)
  - [4, 장기 기억은 graph state가 아니라 store에 넣는다.](#4-장기-기억은-graph-state가-아니라-store에-넣는다)
  - [5, state 저장 / LLM 입력 / 사용자 노출은 분리한다.](#5-state-저장--llm-입력--사용자-노출은-분리한다)
  - [주의점](#주의점)
  - [1, stream 이벤트로 AIMessageChunk가 나올 수 있다.](#1-stream-이벤트로-aimessagechunk가-나올-수-있다)
  - [2, prebuilt agent와 ToolNode는 messages에 자동 누적될 수 있다.](#2-prebuilt-agent와-toolnode는-messages에-자동-누적될-수-있다)
- [보강해야 할 내용.](#보강해야-할-내용)


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

### 5, state 저장 / LLM 입력 / 사용자 노출은 분리한다.

- LangGraph state에 값이 있다고 해서 자동으로 LLM context window에 들어가는 것은 아니다.
- LLM context window에 들어가는 것은 `llm.invoke(...)`에 실제로 넘긴 메시지/텍스트뿐이다.
- 사용자에게 보이는 정보도 별도다. state에 저장되어도 stream/output layer에서 내보내지 않으면 사용자에게 보이지 않는다.

```text
LangGraph state
  -> 그래프가 저장하고 이어가기 위한 상태

LLM input
  -> 특정 llm.invoke에서 판단/생성에 필요한 최소 context

User output
  -> 사용자에게 보여도 되는 message/status/event
```

예를 들어 작업 진행상태는 세 곳 모두에 들어갈 수 있다.

```text
state.public_status
  -> "SQL 조회 완료, 결과 분석 중"

LLM context
  -> "Current status: SQL query completed. Analyze result next."

User output
  -> "조회가 끝났고, 결과를 분석하고 있습니다."
```

반면 SQL 원본 결과는 보통 state와 LLM context까지만 쓰고, 사용자에게는 최종 요약만 보여준다.

```text
state.artifacts.sql_rows
  -> raw rows 저장

state.context.sql_summary
  -> LLM에게 넣기 위한 정제된 요약

user message
  -> 최종 자연어 답변 또는 필요한 표만 표시
```

추천하는 state 분리 방식:

```py
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]  # 사용자 대화로 남겨도 되는 메시지
    public_status: str                       # 사용자에게 보여도 되는 진행상태
    context: dict                            # LLM 입력 조립용 정제 context
    private: dict                            # 사용자에게 직접 노출하지 않는 내부 상태
    artifacts: dict                          # SQL rows, 파일, tool raw result 같은 원본 산출물
```

피해야 할 패턴:

```py
# state 전체를 그대로 LLM에 넣지 않는다.
response = llm.invoke(str(state))

# raw tool result를 messages에 바로 넣지 않는다.
return {"messages": [AIMessage(content=f"SQL result: {rows}")]}
```

원칙:

```text
이 정보가 사용자에게 보여져도 되는가?
이 정보가 이번 LLM 호출에 꼭 필요한가?
```

이 두 질문은 별개로 판단한다.



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

- 내부 LLM 호출은 보통 streaming을 끄는 것이 낫다.
- intent classification, routing, SQL 생성, validation, memory extraction, 짧은 summarization은 사용자에게 중간 토큰을 보여줄 이유가 거의 없다.
- 최종 답변 생성, 긴 보고서/초안 생성처럼 사용자에게 토큰 단위 진행을 보여줄 가치가 있을 때만 streaming을 켠다.

```py
public_llm = ChatOpenAI(model="...", streaming=True)
internal_llm = ChatOpenAI(model="...", streaming=False)
```

💡 설계 포인트  
- Need to consider streaming output whitelist by langgraph_node  

### 2, prebuilt agent와 ToolNode는 messages에 자동 누적될 수 있다.

직접 만든 node에서는 `return {"messages": [response]}`를 하지 않으면 state의 `messages`에 쌓이지 않는다.

```py
def classify_node(state):
    result = internal_llm.invoke([
        SystemMessage(content="Classify intent."),
        state["messages"][-1],
    ])

    return {
        "private": {
            "intent": result.content,
        }
    }
```

하지만 `create_react_agent` 같은 prebuilt agent나 기본 `ToolNode`를 쓰면 LLM 응답, tool call, `ToolMessage`가 `messages`에 누적되는 흐름을 탄다.

SQL 결과처럼 크거나 민감한 tool 결과를 `messages`에 남기고 싶지 않다면 기본 ToolNode 대신 custom node로 실행한다.

```py
def run_sql_node(state):
    rows = db.execute(state["private"]["sql"])

    return {
        "artifacts": {
            "sql_rows": rows,
        },
        "context": {
            "sql_summary": summarize_rows(rows),
        },
        "public_status": "데이터 조회를 완료했습니다.",
    }
```

이후 답변 node에서 LLM에게는 정제된 요약만 넘긴다.

```py
def answer_node(state):
    response = public_llm.invoke([
        SystemMessage(content="Answer based on verified database results."),
        *trim_messages(state["messages"], max_tokens=3000),
        HumanMessage(content=state["context"]["sql_summary"]),
    ])

    return {"messages": [response]}
```

이미 `messages`에 들어간 내용을 LLM 입력에서 제외하고 싶다면 `pre_model_hook`에서 `llm_input_messages`를 따로 만든다.

```py
def pre_model_hook(state):
    clean_messages = [
        m for m in state["messages"]
        if not is_private_tool_message(m)
    ]

    return {
        "llm_input_messages": clean_messages,
    }
```

단, 이 방식은 LLM 입력을 정리하는 것이고 state의 `messages`에 저장되는 것 자체를 막는 것은 아니다.


## 보강해야 할 내용.

- [ ] state schema 설계 예시
- [ ] reducer와 `add_messages` 동작 방식
- [ ] `RemoveMessage`로 messages 정리하는 방법
- [ ] `pre_model_hook`과 `llm_input_messages` 사용법
- [ ] custom ToolNode 설계 패턴
- [ ] SQL 결과와 tool raw result 비공개 처리
- [ ] stream event와 state update 차이
- [ ] public/private message filtering 기준
- [ ] short-term memory와 long-term memory 분리
- [ ] checkpointer와 store의 역할 차이
