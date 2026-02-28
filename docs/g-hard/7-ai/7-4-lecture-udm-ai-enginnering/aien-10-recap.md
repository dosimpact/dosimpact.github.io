---
sidebar_position: 10
---

# Sec 22 AI Agents & Workflows  


## AI 에이전트의 핵심 특징

1, 자율성
- 사람의 지속적인 개입 없이 스스로 작업을 수행하도록 설계됨
- Human in the loop : 필요 시 사람이 루프에 개입 가능, 오류가 난 경우 등  

2, 학습 및 적응  
- 적응 : 경험을 통해 학습하고 시간이 지남에 따라 행동을 개선  
- 목표 중심성 : 특정 목표나 작업을 달성하기 위해 설계됨

3, 환경과의 상호작용  
- 상호작용은 필수 요소 : 다른 소프트웨어, 데이터베이스, 디바이스, 인간과 상호작용
- 자연어 처리 API, 데이터베이스 쿼리 등 다양한 인터페이스 활용


주요 사용 사례 : 고객 서비스 챗봇, 개인 비서, 데이터 분석, 스마트 홈 시스템  


## AI 에이전트 클래스를 직접 구현 1.simple_agent.py    

목적 
- AI 에이전트 클래스를 직접 구현  

1, 메시지 상태 관리 : LLM 호출 후 이전의 메시지를 기록  

2, LLM 호출 부분 : 모델 설정, 온도 등  

3, ReAct 프롬프트
- 모델 자체의 추론 능력이 뛰어나서 스스로 추론을 잘 해서 원하는 결과를 끌어내면 ReAct 패턴 필요없다. 
- 그렇지 못한 경우 ReAct 패턴의 프롬프트로 LLM을 여러번 호출을 루프하며 조정하는 것이다.  
- **CoT(Chain of Thought)**: 모델이 내부 추론을 텍스트로 펼치는 방식 중심.
- ReAct 프롬프트로 인해 에이전트는 다음 루프를 따름 
  - Thought → Action → Observation → Answer 루프  
    - Thought: 질문에 대해 어떻게 접근할지 설명
    - Action: 사용 가능한 도구 호출
    - Observation: 도구 실행 결과 확인
- 마지막에 Answer 출력 - 즉, 프롬프트로 에이전트의 “행동 프로토콜”을 정의  
- 위 과정을 반복  

4, 도구(Tools) 구현   
- LLM은 직접 계산을 잘 못함 외부 함수(도구)를 통해 정확한 계산(작업) 수행  
- 1️⃣ `calculate` 전달된 수식을 Python으로 평가 계산 결과 반환
- 2️⃣ `planet_mass` 행성 이름 입력 - 사전(dictionary)에서 질량 조회
  - “Planet X has mass Y × 10^24” 형식 반환  
- 딕셔너리 형태로 Known Actions 매핑 후 LLM 설정 넘기기 

### 예시  

```
  - 1️⃣ 질문 전달
    - Earth와 Mars의 질량 합은?
    - 메시지는 기존 리스트에 append됨 (덮어쓰기 아님)

  - 2️⃣ Thought 단계
    - 각 행성의 질량을 각각 구해야 함 인식
    - planet_mass 도구 사용 결정

  - 3️⃣ Action → Pause
    - `planet_mass Earth`
    - 일시정지 (수동 개입 필요)

  - 4️⃣ Observation 전달
    - Earth 질량을 계산 후
    - `"Observation: Earth has mass ..."` 전달
    - 에이전트 재호출

  - 5️⃣ 다음 Action
    - `planet_mass Mars`
    - 다시 Pause

  - 6️⃣ Mars Observation 전달
    - Mars 질량 반환
    - 에이전트 재호출

  - 7️⃣ 최종 Action
    - `calculate (Earth + Mars)`
    - 합산 계산 수행

  - 8️⃣ Final Answer 생성
    - LLM이 최종 결과 문장 생성
```


### 구현 디테일  

1, ReAct 루프는 시스템 프롬프트로 작성한다.  
- 액션이 필요한 경우는 `Action: planet_mass: Mars` 처럼 출력한다.  
- 그러면 LLM응답을 정규식으로 파싱해서 Action이 필요한지 알 수 있다.  
- Action에 넘어가는 함수 및 인자는 planet_mass: Mars으로 정규식 파싱한다.  
- *이 방법은 정규식 파싱 오류 및 코드 인젝션 리스크가 있다.  

2, Action이 파싱되면 함수를 호출하고 난 다음 LLM을 또 다시 호출한다.  
- 이때 메시지는 알아서 Agent 객체에서 연장되면서 이전 대화 기록까지 보낸다.  


의사 코드  

```
Agent 객체:
- 생성자 __init__(system):
  - system 프롬프트를 저장한다.
  - messages 리스트를 만든다.
  - system 프롬프트가 있으면 첫 메시지로 추가한다.
- 호출 __call__(message):
  - 사용자 메시지를 messages에 추가한다.
  - execute()로 LLM을 호출한다.
  - 받은 응답을 assistant 메시지로 저장한다.
  - 응답 텍스트를 반환한다.
- execute():
  - 현재까지 누적된 messages를 모델에 보낸다.
  - temperature=0으로 결정적 응답을 유도한다.
  - 첫 번째 응답 텍스트를 반환한다.

시스템 프롬프트:
- 에이전트는 Thought -> Action -> PAUSE -> Observation 루프로 동작하라고 지시한다.
- 사용 가능한 액션은 calculate, planet_mass 두 가지다.
- Earth/Mars 질량 합 예시를 통해 원하는 출력 형식을 보여준다.

액션 함수:
- calculate(식):
  - 식 문자열을 계산해 숫자를 반환한다.
- planet_mass(행성명):
  - 미리 정의된 질량 딕셔너리에서 값을 찾아
  - "<행성> has a mass of <값> × 10^24 kg" 문자열을 반환한다.

액션 매핑:
- known_actions:
  - "calculate" -> calculate 함수
  - "planet_mass" -> planet_mass 함수
- Action 파싱용 정규식:
  - "Action: <action_name>: <action_input>" 형식을 찾는다.

메인 루프 query_interactive():
- 새 Agent를 생성한다.
- 최대 턴 수를 사용자에게 입력받는다(기본 10).
- 턴 반복:
  - 사용자 질문을 입력받는다.
  - 빈 입력이면 종료한다.
  - bot(질문)으로 LLM 응답을 받는다.
  - 응답 텍스트에서 Action 줄을 찾는다.
  - Action이 있으면:
    - action 이름과 인자를 파싱한다.
    - known_actions에 있으면 해당 함수를 실행한다.
    - 결과를 "Observation: ..." 형태로 다시 bot에 보낸다.
    - bot의 다음 응답을 출력한다.
  - Action이 없으면 현재 턴 루프를 종료한다.
- OpenAI 연결 오류(APIConnectionError)가 나면 안내 로그를 출력하고 종료한다.

```


```python
prompt = """
You run in a loop of Thought, Action, PAUSE, Observation.
At the end of the loop you output an Answer.
Use Thought to describe your thoughts about the question you have been asked.
Use Action to run one of the actions available to you - then return PAUSE.
Observation will be the result of running those actions.

Your available actions are:

calculate:
e.g. calculate: 4 - 7 / 3
Runs a calculation and returns the number - uses Python so be sure to use floating point syntax if necessary

planet_mass:
e.g. planet_mass: Earth
returns the mass of a planet in the solar system

Example session:

Question: What is the combined mass of Earth and Mars?
Thought: I should find the mass of each planet using planet_mass.
Action: planet_mass: Earth
PAUSE

You will be called again with this:

Observation: Earth has a mass of 5.972 × 10^24 kg

You then output:

Answer: Earth has a mass of 5.972 × 10^24 kg

Next, call the agent again with:

Action: planet_mass: Mars
PAUSE

Observation: Mars has a mass of 0.64171 × 10^24 kg

You then output:

Answer: Mars has a mass of 0.64171 × 10^24 kg

Finally, calculate the combined mass.

Action: calculate: 5.972 + 0.64171
PAUSE

Observation: The combined mass is 6.61371 × 10^24 kg

Answer: The combined mass of Earth and Mars is 6.61371 × 10^24 kg
""".strip()
```

## LangGraph 개요 

AI 에이전트 워크플로우를 “그래프 구조”로 표현하고 오케스트레이션하는 프레임워크

LangGraph는 LangChain의 확장 모듈
- Graph 기반 상태 관리 지원  
- Cyclic Graph 지원
- Thought–Action–Observation 반복 구조에 최적

1, 복잡한 에이전트 로직을 구조적으로 관리 가능 
- 수동으로 구현한 Agent 루프를 → 노드(Node) + 엣지(Edge) 구조로 추상화 : 
  - Node = 작업 단위 (상태 또는 함수 실행 지점), 예: LLM 호출, Tool 실행, 판단 단계
  - Edge = 노드 간 연결, 실행 흐름 연결하며 조건 기반 분기 가능
  - 예:  
    - Query 노드  
    - System + Query 결합 노드  
    - LLM 호출 노드 
    - Decision 노드 (Action 판단)  
    - Tool 실행 노드  
  - 최종 Answer 노드  
    → 에이전트 전체 흐름이 하나의 Directed Graph로 표현됨  

2, 상태(State) 관리 기능  
- 실행 중 상태를 지속(persist) 가능
- 이전 대화 내용 유지, 컨텍스트 기반 추론 가능
- 장기 기억 구현 가능  

3, Human-in-the-Loop 지원
- 워크플로우 중 특정 노드에서 정지 가능 = 인간 피드백 대기

4, 핵심 노드 및 간선

- Nodes
  - 그래프의 기본 단위
  - Agent, Tool, 처리 함수 등 작업 단위
  - 하나의 상태 또는 실행 단계 의미

- Edges
  - 노드 간 연결하여 실행 흐름을 정의
  - 한 노드에서 다음 노드로 이동하는 경로

- Conditional Edges
  - 조건에 따라 다음 노드 결정
  - 의사결정 지점이며  조건 충족 시 특정 노드로 이동
  - 조건 불충족 시 다른 노드 또는 종료 노드로 이동

- Entry Point Node
  - 워크플로우 시작 지점 = 그래프 실행의 출발점

- End Node
  - 워크플로우 종료 지점 = 조건 충족 후 루프 탈출 시 도달

- 상태 머신(State Machine) 구조
  - 시작 상태 존재 -> 조건 기반 상태 전이
  - 순환 구조 가능 (Cyclic Graph) -> 종료 상태 존재

기본 흐름 예시
  - Entry Node → Agent Node → Conditional Edge
    - 조건 참 → Tool 실행 → Agent로 복귀
    - 조건 거짓 → End Node 이동


## 

2.simple_agent_lngraph.py
3.simple_agent_lngraph_tools.py  