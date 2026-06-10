---
sidebar_position: 10.5
title: Sec 22 AI Agents & Workflows 강의 필기
---

# Sec 22 AI Agents & Workflows 강의 필기

## 강의 범위
- 섹션 번호: 261 ~ 288
- 주제: AI Agent의 기본 원리부터 LangGraph 기반 자동화, Tool 연동, Memory, Human-in-the-Loop, Finance Agent까지의 전체 파이프라인
- 핵심 축: `단일 LLM 호출` → `도구 기반 반복 추론` → `그래프 기반 상태 오케스트레이션`

---

## 1) AI 에이전트의 핵심 개념

### 1-1. 에이전트의 본질
AI Agent는 단순 챗봇이 아니라 목표 달성을 위해 다음을 수행하는 시스템이다.

- 자율성: 사람 개입 없이 루프를 수행한다.
- 학습·적응: 환경과 상호작용하며 성능을 개선한다(강의에서는 이론/직접 구현은 생략).
- 환경 상호작용: DB/API/도구/사용자와 상호작용.
- 목표 중심성: 입력보다 목적(task) 달성에 맞춰 판단한다.

### 1-2. 대표 사용 사례
- 고객 서비스 챗봇
- 개인 비서
- 데이터 분석 보조
- 스마트 홈 자동화
- 내부 업무 자동화 및 리포트 생성

---

## 2) 프로젝트 초기화와 기본 LLM 통신

### 2-1. 개발 환경 구성
강의 초반에 제시된 기준은 다음이다.

- 프로젝트: `AI agent`
- `data/` 폴더 생성
- 가상환경 생성·활성화
- `.env`에 API Key 보관 (`OPENAI_API_KEY`)
- 의존성
  - `openai`
  - `langchain`
  - `python-dotenv`
  - 이후 단계별 추가: `langgraph`, `langchain-openai`, `tavily-python`, `langchain-community`

### 2-2. `simple_agent.py`의 첫 번째 단계
- OpenAI client 생성
- 기본 메시지 형식으로 `chat.completions.create()` 호출
- 시스템 프롬프트 + 사용자 질의 전송
- `response.choices[0].message.content`로 응답 추출

이 단계의 목표는 에이전트 구현이 아니라 **API 통신 확인**이다.

---

## 3) Agent 클래스 직접 설계

강의는 첫 자동화 토대를 다음 구조로 잡는다.

1. `__init__`
   - 시스템 프롬프트 저장
   - `self.messages` 초기화
2. `call()`
   - user 메시지를 추가
   - `execute()` 호출
   - assistant 응답을 messages에 append
3. `execute()`
   - `temperature=0`
   - 누적 메시지로 LLM 호출

### 메시지 스택의 의미
- `system`, `human`, `assistant`, `observation`이 순차 축적되어 상태(State/Memory)처럼 동작
- 동일 대화에서 맥락을 추적할 수 있는 기반을 제공

---

## 4) ReAct(Reason + Act) 패턴과 Tool Use

강의에서 반복되는 핵심 루프는 다음이다.

- Thought: 문제 분해/접근 전략
- Action: 호출할 tool 결정
- Pause: 실행 전 중단(수동 루프에서는 실제 수행 대기)
- Observation: tool 결과 반영
- Answer: 최종 답변

### 왜 ReAct가 필요한가
- LLM의 단일 추론만으로 충분치 않은 경우
- 다단계 판단이나 외부 데이터 의존이 필요한 경우
- tool을 통해 외부 연산/조회로 정확도 및 범용성 확보

### 구현된 Tool 예시
- `calculate(expr)`: 수치 계산
- `planet_mass(name)`: 행성 질량 조회

### 매핑
- ReAct의 Action 문자열 ↔ 실제 함수 매핑
- `known_actions = {"calculate": calculate, "planet_mass": planet_mass}`
- 핵심: LLM은 제안만 하고 실제 실행은 host code가 수행

---

## 5) 수동 에이전트 루프 실습

### 예시 1: 단일 질량 질의
- 질의: `What is the mass of the Earth?`
- LLM:
  - Thought/Action(`planet_mass Earth`)
- 수동으로 tool 실행 후 Observation 전달
- 재호출 시 Answer 출력

### 예시 2: 복합 질의
- 질의: `What is the combined mass of Earth and Mars?`
- Planet mass 조회 두 번 + calculate 호출 1회
- 반복 루프를 수동으로 사람이 중간 중간 조작

### 핵심 한계
- 자동 tool 실행 및 반복 없음
- 사람이 매 단계 관여
- 교육 목적상 구조를 투명하게 이해하는 단계

---

## 6) 자동화 루프 구현 및 대화형 CLI

수동 루프를 거친 뒤 엔진화:

- `query_interactive()` 설계
- `max_turns`, 사용자 질의 입력
- 루프 내부에서
  - LLM 출력 파싱
  - Action 발견 시 자동 tool 실행
  - Observation 주입
  - 최종 Answer 시 종료

### 포인트
- 메시지 스택 누적은 유지
- LLM은 사고 엔진, Tools는 실행 장치
- 반복 자동화가 추가되면서 Agent가 “진짜 도구 기반 추론 체계”로 발전

---

## 7) LangGraph 도입 배경

강의의 전환점은 “상태 전이 자체를 그래프로 모델링”한다는 것.

### 기존 수동 방식 한계
- 직접 loop, 상태관리, action 파싱 구현
- 조건 분기와 예외 처리를 매번 수동 작성

### LangGraph의 장점
- Node/Edge 기반으로 실행 흐름 구조화
- 순환(cycle) 처리 용이
- 조건 기반 분기(clear)
- 상태(state) 유지 메커니즘 내장

---

## 8) LangGraph 핵심 개념

- Node: 실행 단위(함수/에이전트/도구 단계)
- Edge: 노드 간 전이
- Conditional Edge: 조건분기
- Entry Point: 시작 노드
- End: 종료 노드
- 상태 머신 관점: 시작 → 전이 → 조건 판단 → 루프/종료

### 단순 에이전트 기준 그래프 예시
- Entry → bot → (조건) tool? → tool_node → bot → … → End

---

## 9) LangGraph 기본 에이전트 구축

### 상태 설계
- `State = TypedDict`
- 메시지 누적 필드(`messages: List`)
- `add_messages` 개념으로 **덮어쓰기 금지, append 중심**

### 구현 순서
1. `StateGraph(State)` 생성
2. `graph_builder.add_node("bot", bot)`
3. `graph_builder.set_entry_point("bot")`
4. `graph_builder.set_finish_point("bot")` (단순 버전)
5. `graph = graph_builder.compile()`

### 실행 방식
- `graph.invoke({...})`
- 상태 기반 메시지 유지 확인

---

## 10) LangGraph 인터랙티브 앱 + 스트리밍

- `while True` 콘솔 루프 구성
- `quit/exit/q` 종료 처리
- `stream()` 사용으로 단계별 이벤트 확인
  - 어떤 노드에서 무슨 메시지가 생성되는지 실시간 가시성 확보
- Hallucination 대응 필요성 제시
  - 단순 모델 기반 응답은 최신정보 부족 가능성 존재

---

## 11) Tool 통합(웹 검색)과 자율성 강화

### Tavily 연동
- 계정 생성 후 API 키 환경변수 등록
- `pip install tavily-python`, `langchain-community`
- `TavilySearch` 준비 및 tool invocation 테스트

### LLM + Tool 바인딩
- `model_with_tools = model.bind_tools([tavily])`
- LLM은 tool 호출 의도만 생성
- 실제 실행은 ToolNode/호스트 코드가 수행

### 기본 확장 흐름
- bot 실행
- tool 필요 시 tool 호출
- tool 실행 결과(ToolMessage)
- bot이 최종 응답

---

## 12) ToolNode + Conditional Edge 표준 패턴

강의에서는 사용자 정의 `BasicToolNode`보다 prebuilt 사용을 권장한다.

- `ToolNode(tools)`
- `add_conditional_edges("bot", tools_condition)`
- 조건:
  - tool_call 있으면 `tools`
  - 없으면 `END`
- tool 실행 뒤 bot으로 되돌아가는 반복 구조 생성

### 핵심 정리
- LLM이 직접 도구를 실행하지 않는다
- ToolNode가 실행/결과 포맷팅/반환을 담당
- graph가 호출 흐름을 제어

---

## 13) 대화 메모리: Checkpointer와 Thread

### 문제
LangGraph 초반엔 tool 사용은 되지만 대화 맥락이 유지되지 않음.

### 해결
- Checkpointer 적용 (`SqliteSaver`)
- `thread_id` 기반 분리된 대화 상태 저장
- `graph.stream(..., config={"configurable": {"thread_id": "1"}}...)`

### 효과
- 장기 대화 가능
- 같은 thread_id는 이전 context 연속, 다른 thread_id는 새 세션
- `get_state(config)`로 누적 상태 확인 가능

---

## 14) Human-in-the-Loop(HITL)

### 목적
- tool 실행 전 위험한 액션/오류를 줄이기
- 높은 중요도 작업에서 검증 포인트 제공

### 구현
- `compile(checkpointer=memory, interrupt_before=["tools"])`
- 실행 시 tools 노드 직전 중단
- 필요 시 tool name, args, tool_call_id 검토
- 승인 후 resume

### 확장
- 특정 노드별 인터럽트
- 자동+수동 승인 혼합 운영
- 감사 로그/통제 포인트 확보

---

## 15) Finance Agent: 멀티스텝 특화 워크플로우

강의 후반부의 핵심 실무 예시.

### 15-1. 상태 설계 (`AgentState`)
- task, competitors
- financial_data, analysis, comparison
- report
- revision_number, max_revisions

### 15-2. 노드 정의
1. Gather Financials
   - CSV를 pandas로 읽고 문자열화
   - 수치 데이터 task와 결합
2. Analyze Data
   - 내부 재무 분석
3. Research Competitors
   - `with_structured_output`으로 검색 쿼리 생성
   - 각 competitor에 대해 검색 수행
4. Compare Performance
   - 분석 + 경쟁사 데이터 비교
   - `revision_number` 업데이트
5. Research Critique
   - 초안 비평, 보완 정보 검색
6. Write Report
   - 최종 초안/보고서 작성
7. Should Continue
   - `revision_number > max_revisions`면 종료, 아니면 feedback 루프

### 15-3. 그래프 연결
- gather → analyze → research_competitors → compare
- compare → should_continue → (종료 or collect_feedback)
- feedback → research_critique → compare
- 반복 후 write_report

### 핵심 아이디어
- 단순 채팅이 아닌 **문서 생성형 자동화 시스템**
- tool+state+loop를 도메인 파이프라인으로 결합

---

## 16) 성능/비용/안정성 최적화

강의에서 제시한 실무 최적화 포인트

- 모델 전략
  - 간단 작업: 경량 모델
  - 복잡 분석: 고성능 모델
- 양자화(Quantization)
- 파인튜닝(도메인 특화)
- 병렬 처리(competitor 병렬 검색)
- 배치 처리
- 캐싱(TTL 기반)
- 전처리
  - 컬럼 정리, 중복 제거, 불필요 토큰 축소

### Finance Agent 적용 예시
- Gather 단계: 필요 컬럼 필터링
- Research: 병렬 검색 + 캐시
- Compare: 불필요 데이터 제거 후 전달
- Report: 요약 모델 분리 사용

---

## 17) 전체 아키텍처 요약

1) 기본
- API 호출 이해 + Agent 클래스
- 메시지 상태관리

2) 추론-행동 통합
- ReAct(Thought/Action/Observation/Answer)
- Tool 설계와 루프 자동화

3) LangGraph 정형화
- Node/Edge/Conditional/Loop
- 상태 머신 형태로 관리

4) 확장
- 웹 검색 Tool
- Memory(Thread+Checkpointer)
- Human-in-the-Loop

5) 도메인 실무화
- Finance Agent: 수집→분석→연구→비교→비평→재작성→종료
- 실전 사용 가능한 구조로 발전

---

## 마지막 정리
- AI Agent는 “좋은 프롬프트” + “메시지 상태 관리” + “도구 연동” + “상태 기반 흐름 제어”의 결합이다.
- 수동 루프에서 시작해 LangGraph 기반으로 옮길수록 확장성, 추적성, 운영 안정성이 좋아진다.
- 이 구조를 바탕으로 리서치, 법률, 의료, 내부 데이터 분석 등으로 즉시 이식 가능한 패턴이 형성된다.
