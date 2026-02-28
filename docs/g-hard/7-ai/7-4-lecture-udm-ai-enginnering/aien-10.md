---
sidebar_position: 10
---

# Sec 22 AI Agents & Workflows  




## 274.  

* 목표
  * LangGraph를 사용해 매우 단순한 AI 에이전트 구축
  * 이전의 수동 방식이 아닌 그래프 기반 방식 적용

* LangGraph 설치
  * `pip install langgraph`
  * LLM 연결을 위해 `langchain-openai` 설치
  * OpenAI 대신 다른 LLM도 연결 가능 (프레임워크의 장점)

* 핵심 개념 복습
  * 메시지는 에이전트의 핵심 상태
  * 상태(State)를 통해 메시지를 누적 관리
  * 메시지를 덮어쓰지 않고 append 하는 구조가 중요

* State 정의
  * TypedDict 기반 State 클래스 생성
  * messages: List 타입
  * add_messages 어노테이션 사용
  * 목적
    * 기존 메시지 유지
    * 새로운 메시지 추가
    * 컨텍스트 지속성 확보

* Bot 정의
  * 클래스 대신 간단한 함수로 구현
  * 입력: state
  * 내부에서 ChatOpenAI 모델 생성
  * state["messages"]를 model.invoke()에 전달
  * 결과 반환

* Graph 생성 단계
  * 1️⃣ StateGraph 생성
    * graph_builder = StateGraph(State)

  * 2️⃣ Node 추가
    * 이름: "bot"
    * 실행 함수: bot
    * 노드 = 실행 단위

  * 3️⃣ Entry Point 설정
    * graph_builder.set_entry_point("bot")
    * 시작 노드 정의

  * 4️⃣ Finish Point 설정
    * graph_builder.set_finish_point("bot")
    * 종료 노드 정의

  * 5️⃣ Compile
    * graph = graph_builder.compile()
    * 실제 실행 가능한 그래프 완성

* 실행 예시
  * graph.invoke({ "messages": [("human", "Hello, how are you?")] })
  * 출력 결과
    * HumanMessage
    * AIMessage
    * 각각 고유 ID 포함
    * 토큰 사용량 정보 포함

* 중요한 구조적 차이
  * 이전 방식
    * 직접 루프 작성
    * 직접 상태 관리
    * 직접 액션 파싱

  * LangGraph 방식
    * 상태 관리 자동화
    * 메시지 누적 관리 내장
    * 노드 기반 구조화
    * 그래프 실행 엔진 사용

* 핵심 이해
  * State = 메모리
  * Node = 실행 단위
  * Entry / Finish = 시작과 종료
  * Graph = 전체 오케스트레이션 구조

* 의미
  * 매우 단순한 구조지만
  * 이미 완전한 그래프 기반 AI 에이전트
  * 확장 시
    * Tool 노드 추가
    * Conditional Edge 추가
    * 루프 추가
    * Human-in-the-loop 추가 가능

* 결론
  * LangGraph는
    * 에이전트의 상태 + 실행 흐름을 구조적으로 관리
    * 수동 구현 대비 확장성과 유지보수성 우수
    * 복잡한 자율형 에이전트 구축의 기반이 되는 프레임워크


## 275.  
* 목적
  * LangGraph 기반 에이전트를 콘솔 앱 형태로 확장
  * 실시간 상호작용 가능하도록 개선

* 콘솔 루프 구조
  * `while True` 사용
  * 사용자 입력 받기
  * `"quit"`, `"exit"`, `"q"` 입력 시 종료
  * 반복적으로 질문 가능

* `invoke()` 대신 `stream()` 사용
  * `stream()`은 실행 과정을 이벤트 단위로 반환
  * 단계별로 결과를 스트리밍
  * 내부 실행 흐름을 실시간으로 확인 가능

* 동작 흐름
  * 사용자 입력 → messages에 추가
  * graph.stream(...) 호출
  * 이벤트 발생 시 값 추출
  * assistant의 마지막 메시지 출력

* 메시지 구조 특징
  * HumanMessage와 AIMessage 객체 생성
  * 각 메시지에 고유 ID 존재
  * 이전 메시지 유지 (append 방식)
  * 상태(State)가 모든 메시지 보관

* Hallucination 예시
  * “LangChain”에 대한 잘못된 답변 발생
  * 원인
    * 모델 학습 시점 한계
    * 최신 정보 부족
  * 해결 방향
    * Tools 추가 필요
    * 외부 지식 연결 필요

* 상태(State)의 중요성
  * State = 메시지 저장소
  * 매 호출마다 state 전달
  * 컨텍스트 유지
  * 대화 일관성 확보

* Graph 구성 요약
  * StateGraph(State) 생성
  * 노드 추가
    * 이름: "bot"
    * 실행 함수: bot
  * Entry Point 설정
  * Finish Point 설정
  * compile()로 실행 그래프 생성

* 현재 구조의 한계
  * 단일 노드 구조
  * 외부 데이터 접근 불가
  * Tool 없음
  * 단순 LLM 응답 에이전트

* 다음 단계
  * Tools 추가
  * 에이전트 능력 확장
  * 외부 데이터 조회
  * 맞춤형 지식 활용
  * Tool 실행 → LLM → 응답 구조 구현

* 핵심 이해
  * LangGraph는 구조를 제공
  * State는 기억을 담당
  * Node는 실행 단위
  * Tools가 추가되면 진짜 에이전트로 발전

* 결론
  * 현재는 기본 대화형 에이전트
  * 다음 단계에서
    * 도구 기반 자율형 에이전트로 확장 예정

## 276.  

* 목표

  * LangGraph 기반 기본 에이전트에 Tools 추가
  * LLM 단독 응답 → 외부 검색 기반 응답 확장

* 구조 개념

  * Entry Point → Bot Node
  * 필요 시 Tool 호출
  * Tool 결과 반환
  * 다시 Bot으로 전달
  * 조건 충족 시 종료
  * 조건 미충족 시 반복

* 외부 검색 Tool 추가

  * Tavily 검색 엔진 사용
  * 목적

    * LLM을 웹과 연결
    * 최신 정보 검색 가능

* Tavily 준비 단계

  * 계정 생성
  * 대시보드에서 API Key 발급
  * 환경 변수에 저장

* 패키지 설치

  * `pip install tavily-python`
  * `pip install langchain-community`

* Tool 생성

  * `TavilySearch` import
  * Tool 객체 생성
  * `tool.invoke("질문")` 테스트
  * 검색 결과 정상 반환 확인

* Tools 리스트 구성

  * tools = [tavily]
  * 리스트 형태로 전달
  * 이유

    * 여러 Tool 확장 가능

* 모델에 Tool 연결

  * 기존 ChatOpenAI 모델 사용
  * `model.bind_tools(tools)`
  * Tool 기능이 포함된 모델 생성

* Tool 연결 확인 테스트

  * `model_with_tools.invoke("질문")`
  * 반환값 확인
  * JSON 구조 포함

    * function call 정보
    * call_id
    * response 데이터

* 핵심 이해

  * LLM은 Tool을 “직접 실행”하지 않음
  * LLM은 Tool 사용 요청만 생성
  * 실제 Tool 실행은 코드가 담당
  * Tool 결과를 다시 LLM에 전달

* 현재 상태

  * 모델 + Tool 연결 완료
  * 검색 기능 활성화
  * 하지만

    * 아직 Tool 사용 규칙 미설정
    * 에이전트에게 Tool 사용 방법 미지시

* 다음 단계

  * 프롬프트로 Tool 사용 방법 명시
  * Tool 호출 → 결과 처리 → 재전달 자동화
  * Conditional Edge 구성
  * 완전한 Tool 기반 자율 에이전트 완성

## 277

* 목표
  * 에이전트가 어떤 Tool을 실행해야 하는지 스스로 결정하도록 구성
  * Tool 실행을 별도 Node로 분리

* 핵심 개념
  * LLM은 Tool을 “직접 실행”하지 않음
  * LLM은 Tool 호출 요청(JSON payload) 생성
  * Tool 실행은 그래프의 Tool Node가 담당

* BasicToolNode 클래스 역할

  * 마지막 AI 메시지에서 Tool 호출 요청 확인
  * 어떤 Tool을 실행해야 하는지 판단
  * 해당 Tool 실행
  * 실행 결과를 ToolMessage 객체로 생성
  * Tool 결과를 다시 모델에 전달

* ToolMessage의 의미

  * Tool 실행 결과를 모델로 전달하는 메시지 객체
  * content 필드에 Tool 결과 포함
  * tool_call_id 포함
  * 모델이 이전 Tool 호출과 결과를 연결 가능

* 처리 흐름
  * AI 메시지에서 tool_call 추출
  * tool 이름 확인
  * 해당 tool 실행
  * Tool 결과 → ToolMessage 생성
  * 메시지 리스트에 추가

* Conditional Edge 추가
  * 목적
    * 상태에 따라 다음 Node 결정
  * route_tools 함수

    * Tool 호출 존재 → "tools" 노드로 이동
    * Tool 호출 없음 → END로 이동

* 그래프 구성 변화
  * Node 1: bot
  * Node 2: tools
  * Conditional Edge: bot → tools 또는 END
  * tools 실행 후 → 다시 bot으로 복귀
  * 루프 구조 형성

* Finish Point 제거 이유
  * Conditional Edge가 종료 조건을 처리
  * END 상태로 자동 전이

* 실행 결과 변화
  * 이전
    * LangChain 질문 시 환각(Hallucination) 발생
  * 현재
    * Tool 호출
    * Tavily 검색 실행
    * 검색 결과 기반 응답 생성

* 동작 예시
  * 질문: “Tell me about LangChain”
    * LLM → Tool 호출
    * Tavily 검색
    * 검색 결과 반환
    * LLM이 결과 정리 후 응답
  * 질문: “Tell me about the solar system”
    * 검색 실행
    * Wikipedia 기반 정보 반환
    * 응답 생성

* 핵심 이해
  * Node = 실행 단위
  * Tool Node = 외부 능력 확장 지점
  * Conditional Edge = 의사결정 엔진
  * State = 메시지 기억

* 구조 요약
  * User Input
  * → Bot Node
  * → Conditional Edge
    * Tool 필요 → Tools Node
    * Tool 불필요 → END
  * → Bot 재실행
  * → 최종 Answer

* 의미
  * 이제 에이전트는
    * 외부 웹 검색 가능
    * 최신 정보 활용 가능
    * 환각 감소
    * 반복적 Tool 호출 가능

* 결론
  * LangGraph + Tools + Conditional Edge
  * 완전한 Tool 기반 자율형 에이전트 구조 완성
  * 확장 시
    * 여러 Tool 추가 가능
    * 데이터베이스 연결 가능
    * API 연결 가능
    * 복잡한 Workflow 구성 가능

## 278  
* 코드 정리
  * 사용자 정의 `BasicToolNode` 제거
  * 사용자 정의 `route_tools` 제거
  * LangGraph prebuilt 사용
    * `ToolNode`
    * `tools_condition`

* ToolNode 사용 방식
  * `tool_node = ToolNode(tools)`
  * tools 리스트 전달
  * 별도 클래스 구현 불필요

* Conditional Edge 설정

  * `graph_builder.add_conditional_edges("bot", tools_condition)`
  * 의미

    * 마지막 메시지에 tool_call 존재 → tools 노드 이동
    * tool_call 없음 → END로 이동

* 모델과 Tool 연결 핵심

  * 반드시 `model.bind_tools(tools)` 사용
  * bot에서 반환 시 model_with_tools 사용
  * Tool이 바인딩되지 않으면 호출 불가

* 전체 흐름 구조

  * Entry → bot
  * bot 실행
  * Conditional Edge 판단

    * Tool 필요 → tools 노드
    * Tool 불필요 → END
  * tools 실행 후 → bot 복귀
  * 반복 후 종료

* 작동 예시

  * 질문: “Tell me about Microsoft”
  * LLM → tool_call 생성
  * Tavily 검색 실행
  * 결과 ToolMessage로 반환
  * bot 재실행
  * 최종 응답 생성

* 핵심 구성 요소 정리

  * Tools 정의
  * Tools 리스트 생성
  * Model에 bind_tools
  * ToolNode 생성
  * Conditional Edge 추가
  * Graph compile
  * stream() 실행

* 중요 포인트

  * Tool은 LLM이 “직접 실행”하지 않음
  * LLM은 Tool 호출 요청 생성
  * ToolNode가 실제 실행
  * Tool 결과는 다시 모델로 전달
  * State가 모든 메시지 유지

* 구조적 의미

  * Node = 실행 단위
  * ToolNode = 외부 능력 확장
  * Conditional Edge = 의사결정
  * State = 기억

* 결과

  * 단순 챗봇 → Tool 기반 에이전트
  * 웹 검색 가능
  * 최신 정보 활용
  * 환각 감소
  * 확장 가능 구조 확보

* 결론

  * LangGraph + ToolNode + tools_condition 조합으로
  * 코드 간결성 확보
  * 유지보수 용이
  * 실제 활용 가능한 AI 에이전트 구조 완성

## 279

* 문제

  * 현재 에이전트는 Tool은 사용 가능
  * 그러나 대화 기억(Memory) 없음
  * 이전 대화 맥락을 유지하지 못함
  * 일관된 대화 흐름 제한

* 해결 방법

  * Checkpointer를 이용해 Memory 추가
  * LangGraph의 Thread 기반 상태 저장 구조 활용

* Thread 개념

  * Thread = 대화 버킷
  * 각 Thread는 고유 ID 보유
  * 모든 메시지와 상태가 해당 Thread에 저장
  * 여러 대화를 ID 기반으로 분리 가능

* Checkpointer 역할

  * 각 노드 실행 사이 상태 저장
  * 실행 중 상태를 저장 및 복원 가능
  * 장점

    * 장기 실행 프로세스 지원
    * Fault tolerance
    * 분산 실행 가능
    * 실행 중단 후 재개 가능

* SQLiteSaver 사용

  * `from langgraph.checkpoint.sqlite import SqliteSaver`
  * `memory = SqliteSaver.from_conn_string("memory")`
  * compile 시 checkpointer 전달
  * `graph = builder.compile(checkpointer=memory)`

* Thread 설정

  * config 객체 생성
  * `{ "configurable": { "thread_id": "1" } }`
  * 모든 메시지는 해당 thread에 저장
  * stream 호출 시 config 전달

* stream 호출 방식 변경

  * `graph.stream(input, config=config, stream_mode="values")`
  * 두 번째 인자로 config 전달
  * 해당 thread에 상태 누적

* 동작 예시

  * 입력 1

    * “My name is Bond”

  * 입력 2

    * “Do you remember my name?”

  * 결과

    * 모델이 이름 기억

  * 입력 확장

    * “I have been happy for 100 years”
    * 이후
    * “How long have I been happy?”

  * 결과

    * 100년 정보 기억

* 핵심 이해

  * Memory는 자동으로 state에 저장
  * Checkpointer가 노드 간 상태를 지속 저장
  * Thread ID 기반으로 대화 구분
  * 동일 thread_id → 동일 기억 유지
  * 다른 thread_id → 새로운 대화 시작

* Snapshot 조회

  * `snapshot = graph.get_state(config)`
  * 현재 상태 확인 가능
  * 모든 누적 메시지 포함
  * 대화 전체 히스토리 확인 가능

* 구조 요약

  * State = 메시지 저장소
  * Checkpointer = 상태 저장 메커니즘
  * Thread = 대화 단위 컨테이너
  * Config = thread 연결 정보

* 결과

  * Tool 사용 가능
  * 대화 기억 가능
  * 장기 대화 가능
  * 맥락 기반 응답 가능
  * 실제 서비스 수준 구조 완성

* 최종 의미

  * LangGraph + Tool + Conditional Edge + Memory
  * 완전한 자율형 AI 에이전트 아키텍처 구현
  * 확장 시

    * 외부 DB 저장 가능
    * 멀티 사용자 세션 관리 가능
    * 장기 기억 시스템 구축 가능


## 280

* 목표
  * 에이전트에 Human-in-the-Loop 추가
  * Tool 실행 전에 인간 승인 가능하도록 구성

* 왜 Human-in-the-Loop가 필요한가
  * 에이전트는 LLM + Tool에 의존
  * Tool 오류 가능성 존재
  * 잘못된 검색 / 잘못된 실행 가능
  * 중요한 작업 전 인간 검증 필요

* 구현 방식
  * `compile()` 시 `interrupt_before` 사용
  * 예
    * `compile(checkpointer=memory, interrupt_before=["tools"])`
  * 의미
    * tools 노드 실행 전에 중단

* 동작 구조

  * User Input
  * → bot 노드
  * → Tool 호출 필요 판단
  * → tools 실행 직전 인터럽트 발생
  * → 인간 개입 가능
  * → 승인 후 계속 실행

* interrupt 옵션
  * `interrupt_before`
    * 특정 노드 실행 전에 중단
  * `interrupt_after`
    * 특정 노드 실행 후 중단

* 실행 흐름 설명
  * 입력
    * “Could you research astrology for me?”
  * LLM 판단
    * Tavily 검색 필요
  * tools 노드 직전 인터럽트 발생
  * `graph.get_state(config)`로 상태 확인
  * next step 정보 확인
  * 호출될 tool 확인 가능
  * tool name
  * tool arguments
  * tool_call_id

* 인터럽트 시 확인 가능한 정보
  * 호출될 tool 목록
  * 전달될 query
  * JSON payload 구조
  * 실행 전 검토 가능

* 승인 후 흐름
  * None 전달 → 계속 실행
  * Tool 실행
  * Tool 결과 반환
  * bot 재실행
  * 최종 응답 생성

* 구조 요약
  * State = 대화 기억
  * Checkpointer = 상태 저장
  * Conditional Edge = Tool 분기
  * ToolNode = Tool 실행
  * Interrupt = 인간 개입 지점

* 장점
  * 안전성 향상
  * 고위험 작업 전 승인 가능
  * 민감 데이터 접근 제어
  * 감사(Audit) 가능 구조

* 확장 가능성
  * 특정 Tool만 인터럽트
  * 특정 조건에서만 인터럽트
  * 자동 승인 + 수동 승인 혼합
  * 멀티 사용자 승인 시스템 구축

* 최종 이해
  * LangGraph는
    * 자율 에이전트 구현 가능
    * 메모리 추가 가능
    * Tool 확장 가능
    * Human-in-the-loop 삽입 가능
  * 즉
    * 완전 자동화 + 인간 감독 구조를
    * 동시에 설계할 수 있는 프레임워크


## 281

* 섹션 전체 요약

  * LangGraph 기반 AI 에이전트 직접 구현
  * 단순 구조 → 점진적 확장

* 단계별 발전 과정

  * 1️⃣ 기본 에이전트

    * Entry → Bot → End
    * 단순 LLM 응답 구조

  * 2️⃣ Tools 추가

    * Tavily 검색 연동
    * Conditional Edge 구성
    * ToolNode 사용
    * 외부 데이터 활용 가능

  * 3️⃣ Memory 추가

    * Checkpointer 사용
    * SQLiteSaver 적용
    * Thread 기반 상태 관리
    * 대화 맥락 유지

  * 4️⃣ Human-in-the-Loop 추가

    * interrupt_before 사용
    * Tool 실행 전 인간 개입 가능
    * 승인/검토 기반 실행 구조

* 핵심 개념 정리

  * State = 대화 및 실행 상태
  * Node = 실행 단위
  * Conditional Edge = 의사결정 로직
  * ToolNode = 외부 능력 확장
  * Checkpointer = 상태 저장
  * Thread = 대화 단위
  * Interrupt = 인간 개입 지점

* 구조적 이해

  * 단순 챗봇 →
  * Tool 기반 자율형 에이전트 →
  * Memory 기반 컨텍스트 에이전트 →
  * Human-in-the-loop 감독형 에이전트

* 의미

  * LangGraph는

    * 에이전트 구조를 체계적으로 설계 가능
    * 확장성과 안정성 확보 가능
    * 실제 서비스 수준 아키텍처 구현 가능

* 다음 단계

  * 실제 실무에 가까운
  * Full-fledged AI Agent 구축
  * Tools + Memory + Human-in-the-loop 통합
  * 현실 세계 문제 해결용 구조 구현

* 결론

  * 지금까지는 개념 + 구조 이해 단계
  * 다음 섹션에서

    * 실전형 에이전트 완성 단계로 진입

## 284

* 목표
  * Finance Agent의 전체 노드 구현
  * 단계별 워크플로우 구성
  * 분석 → 경쟁사 조사 → 비교 → 비평 → 수정 → 최종 보고서

* 구조 원칙
  * 모든 노드는 `state: AgentState` 입력
  * 각 노드는 상태를 읽고 수정
  * 결과를 다시 state에 저장
  * 그래프는 순환 구조

---

* 1️⃣ Gather Financials Node

  * 역할

    * CSV 파일을 Pandas로 로드
    * DataFrame → 문자열 변환 (`df.to_string()`)
    * 사용자 task + 재무 데이터 결합

  * 메시지 구성

    * System: “You are an expert financial analyst…”
    * Human: task + financial_data

  * 출력

    * 재무 요약 결과
    * state에 financial_data 업데이트

---

* 2️⃣ Analyze Data Node

  * 역할

    * 내부 재무 데이터 심층 분석
  * System: Analyze Data Prompt
  * Human: financial_data
  * 출력

    * analysis 결과
    * state.analysis 저장

---

* 3️⃣ Research Competitors Node

  * 역할

    * state.competitors 순회
    * 구조화 출력 사용 (`with_structured_output`)
    * Queries 모델 기반 쿼리 생성

  * 흐름

    * 각 competitor → 최대 3개 검색 쿼리 생성
    * Tavily 검색 수행
    * 결과 content 리스트에 append

  * 출력

    * competitor_data 저장

---

* 4️⃣ Compare Performance Node

  * 역할

    * 내부 분석 + 경쟁사 데이터 결합
    * 비교 분석 수행

  * 입력

    * task
    * analysis
    * competitor_data

  * System: Compare Performance Prompt

  * 출력

    * comparison 결과
    * revision_number + 1

---

* 5️⃣ Research Critique Node

  * 역할

    * 초안에 대한 비평 보완

  * Structured Output 사용

  * 최대 3개 쿼리 생성

  * Tavily 검색 반복

  * content 누적

  * 출력

    * 보완 데이터 업데이트

---

* 6️⃣ Write Report Node

  * 역할

    * 최종 보고서 작성

  * System: Write Report Prompt

  * Human:

    * analysis
    * comparison
    * critique 보완 결과

  * 출력

    * report 생성
    * state.report 저장

---

* 7️⃣ Should Continue Node

  * 역할

    * revision_number 확인
  * 조건

    * revision_number > max_revisions → END
    * 그렇지 않으면 → feedback 수집 후 루프

---

* 설계 핵심 포인트

  * 메시지를 append해야 하는 이유

    * 에이전트는 점진적으로 정보 축적
    * 이전 단계 정보 유지 필수
    * overwrite하면 컨텍스트 손실

  * Structured Output 사용 이유

    * 검색 쿼리 정확성
    * JSON 구조 강제
    * 안정적 Tool 호출

  * Cyclic 구조

    * Compare → Critique → Rewrite → Check
    * 조건 충족 시 종료

---

* 전체 흐름 요약

  * Gather Financials
  * → Analyze
  * → Research Competitors
  * → Compare
  * → Critique
  * → Rewrite
  * → Check Revision
  * → 반복 또는 종료

---

* 의미

  * 단순 챗봇이 아님
  * 도메인 특화 다단계 분석 시스템
  * 반복 수정 가능한 리포트 생성 에이전트
  * 실제 업무 자동화 구조

* 다음 단계

  * StateGraph 생성
  * 노드 추가
  * Conditional Edge 연결
  * 루프 구성
  * Full Finance Agent 완성

## 286  

* 목표
  * 모든 노드를 그래프에 연결
  * Finance Agent 전체 워크플로우 완성
  * 실제 실행 테스트

* Graph 생성
  * `builder = StateGraph(AgentState)`
  * AgentState에는
    * task
    * competitors
    * financial_data
    * analysis
    * comparison
    * report
    * revision_number
    * max_revisions 포함

* 노드 등록
  * gather_financials
  * analyze_data
  * research_competitors
  * compare_performance
  * collect_feedback
  * research_critique
  * write_report

* Entry Point 설정
  * 시작 노드: `gather_financials`
  * 첫 단계는 항상 CSV 분석

* Conditional Edge 설정
  * compare_performance → should_continue
  * 조건
    * revision_number > max_revisions → END
    * 아니면 → collect_feedback

* Edge 연결 흐름
  * gather_financials → analyze_data
  * analyze_data → research_competitors
  * research_competitors → compare_performance
  * collect_feedback → research_critique
  * research_critique → compare_performance
  * compare_performance → write_report

* Memory 추가
  * Checkpointer 적용
  * thread_id 기반 상태 저장
  * 전체 워크플로우 동안 상태 유지

* 실행 입력 구성
  * task:
    * “Analyze the financial performance…”
  * competitors:
    * Microsoft
    * Nvidia
    * Google
  * CSV 경로 전달
  * max_revisions 설정
  * revision_number 초기값 1

* 실행 결과 흐름
  * CSV 읽기
  * 재무 데이터 분석
  * CAGR 계산
  * 수익/비용 분석
  * 경쟁사 검색 (Tavily 활용)
  * 경쟁사 정보 수집
  * 비교 분석 수행
  * 보고서 초안 작성
  * 자체 비평 수행
  * 재검색 및 보완
  * 재작성
  * 반복 (revision loop)
  * 최종 보고서 생성

* 중요한 특징
  * 멀티스텝 분석
  * Tool 기반 외부 데이터 활용
  * 반복 수정 구조
  * 상태 기반 워크플로우
  * 자동 비평 루프 포함

* 구조적 의미
  * 단순 챗봇 아님
  * 자율 분석 시스템
  * 문서 생성 엔진
  * 반복 개선 알고리즘 내장

* 핵심 통찰
  * 패턴은 동일
    * State
    * Node
    * Edge
    * Conditional Edge
    * Loop
    * Tool
    * Memory
  * 도메인만 바뀌었을 뿐 구조는 동일

* 최종 의미
  * 실제 실무형 AI Agent 완성
  * CSV → 분석 → 경쟁사 비교 → 보고서 작성 자동화
  * 이 구조를 다른 도메인에 그대로 적용 가능
  * 확장성 매우 높음

* 다음 단계
  * UI 추가
  * 결과 시각화
  * 사용자 친화적 인터페이스 구축

* 결론
  * 이제 단순한 Agent 수준이 아님
  * 완전한 업무 자동화 AI 시스템
  * 구조를 이해하면 어떤 산업에도 적용 가능

## 287  


* 목표

  * AI Agent 성능 최적화 전략 이해
  * 비용 절감 + 속도 향상 + 안정성 개선

* 1️⃣ 모델 최적화

  * 작은 모델 사용

    * 단순 작업 → 경량 모델
    * 복잡 분석 → 대형 모델
  * 예

    * 요약 → 작은 모델
    * 심층 분석 → GPT-4
  * 장점

    * 비용 절감
    * 응답 속도 향상

* 2️⃣ 모델 양자화 (Quantization)

  * 모델 파라미터 압축
  * 모델 크기 감소
  * 추론 속도 개선
  * 정확도 손실 최소화
  * 온프레미스 환경에 특히 유리

* 3️⃣ 파인튜닝 (Fine-tuning)

  * 도메인 특화 데이터 학습
  * 재무 분석, 법률, 의료 등 특화 가능
  * 프롬프트 의존도 감소
  * 더 일관된 응답

* 4️⃣ 병렬 처리 (Parallel Processing)

  * 경쟁사 조사 노드에 적용 가능
  * 각 competitor 검색 병렬 실행
  * Spark, Dask 등 분산 프레임워크 활용
  * 대량 데이터 처리 시 효과적

* 5️⃣ 배치 처리 (Batch Processing)

  * 여러 요청을 묶어서 처리
  * API 호출 횟수 감소
  * 처리량 증가
  * 대규모 시스템에서 유리

* 6️⃣ 캐싱 (Caching)

  * TTLCache 사용 가능
  * 자주 조회되는 결과 저장
  * 중복 계산 제거
  * API 호출 비용 절감
  * 예

    * 동일 competitor 검색 결과 재사용

* 7️⃣ 전처리 (Pre-processing)

  * 불필요한 데이터 필터링
  * CSV 정리
  * 중복 제거
  * irrelevant 정보 제거
  * 모델 입력 토큰 감소

* Finance Agent에 적용 가능한 최적화 지점

  * Gather 단계

    * CSV 필터링
    * 필요한 컬럼만 전달
  * Research 단계

    * 병렬 검색
    * 검색 결과 캐싱
  * Compare 단계

    * 불필요 데이터 제거 후 전달
  * Report 단계

    * 요약 모델 분리 사용

* 구조적 최적화 전략

  * 작은 모델 + 큰 모델 혼합 사용
  * Tool 호출 최소화
  * 반복 루프 횟수 제한
  * revision 최소화

* 비용 최적화

  * 토큰 수 감소
  * 중복 검색 방지
  * 캐시 적극 활용
  * 구조화 출력 사용으로 재시도 감소

* 핵심 통찰

  * Agent 성능 =

    * 모델 선택
    * 데이터 품질
    * 병렬 처리
    * 캐싱 전략
    * 프롬프트 설계

* 결론

  * Agent는 “완성”이 아니라 “계속 최적화” 대상
  * 구조는 이미 완성
  * 이제는 효율, 비용, 확장성 개선 단계
  * 실무에서는 최적화가 곧 경쟁력

## 288

* 전체 과정 요약

* 1️⃣ 에이전트 기초

  * AI Agent 개념 이해
  * 핵심 특징 학습

    * 자율성
    * 목표 중심성
    * 학습 및 적응
  * 주요 활용 사례 분석

* 2️⃣ 수동 구현 단계

  * OpenAI API 기반 간단한 Agent 구현
  * Thought → Action → Observation 구조 이해
  * Tool 호출 로직 직접 구현
  * 루프 자동화 구조 설계

* 3️⃣ LangGraph 도입

  * 그래프 기반 에이전트 설계
  * Node
  * Edge
  * Conditional Edge
  * Entry / End 구조
  * 상태 머신 개념 이해

* 4️⃣ 기능 확장

  * Tool 추가

    * Tavily 검색 연결
    * ToolNode + Conditional routing

  * Memory 추가

    * Checkpointer 사용
    * Thread 기반 상태 저장
    * 대화 맥락 유지

  * Human-in-the-Loop

    * interrupt_before
    * Tool 실행 전 승인 가능

* 5️⃣ Full Finance Agent 구축

  * CSV 재무 데이터 분석
  * 경쟁사 검색
  * 비교 분석
  * 자동 비평 루프
  * 반복 수정 구조
  * 최종 보고서 생성

* 6️⃣ GUI 구현

  * Streamlit 기반 UI
  * 에이전트 실행 시각화
  * 실제 사용 가능한 인터페이스 구축

* 핵심 학습 포인트

  * 에이전트는 단순 챗봇이 아님
  * 구조화된 워크플로우 시스템
  * State 기반 설계 중요
  * Tool + Memory + Loop 조합이 핵심
  * 반복 개선 구조가 품질을 높임

* 가장 중요한 부분

  * Finance Agent 구조를 깊이 이해할 것
  * 해당 구조를

    * 조직
    * 개인 프로젝트
    * 특정 산업 도메인
      에 맞게 확장 가능

* 최종 메시지

  * 이제 기본기가 완성됨
  * 구조 이해 → 응용 가능
  * 도메인만 바꾸면

    * 리서치 Agent
    * 법률 분석 Agent
    * 의료 분석 Agent
    * 내부 데이터 분석 Agent
      모두 구축 가능

* 결론

  * 이것은 시작점
  * 이미 강력한 기반 확보
  * 이제는 확장, 최적화, 실제 문제 해결 단계
  * 스스로 Agent를 설계하고 개선할 수 있는 수준 도달
