---
sidebar_position: 6
---

# LangGraph Prebuilt

- [LangGraph Prebuilt](#langgraph-prebuilt)
  - [prebuilt란?](#prebuilt란)
  - [한눈에 보기](#한눈에-보기)
  - [핵심 구성요소](#핵심-구성요소)
    - [create\_react\_agent](#create_react_agent)
      - [언제 사용하나?](#언제-사용하나)
  - [ToolNode](#toolnode)
      - [ToolNode가 필요한 이유](#toolnode가-필요한-이유)
      - [언제 사용하나?](#언제-사용하나-1)
  - [tools\_condition](#tools_condition)
      - [언제 사용하나?](#언제-사용하나-2)
  - [ValidationNode](#validationnode)
      - [예시 상황](#예시-상황)
      - [언제 사용하나?](#언제-사용하나-3)
  - [InjectedState](#injectedstate)
      - [예시: 모델에게 숨긴 상태 사용하기](#예시-모델에게-숨긴-상태-사용하기)
      - [언제 사용하나?](#언제-사용하나-4)
  - [InjectedStore](#injectedstore)
      - [예시: 사용자 선호도 저장하기](#예시-사용자-선호도-저장하기)
      - [언제 사용하나?](#언제-사용하나-5)
  - [ToolRuntime](#toolruntime)
      - [언제 사용하나?](#언제-사용하나-6)
  - [자주 쓰는 조합](#자주-쓰는-조합)
    - [빠르게 기본 에이전트 만들기](#빠르게-기본-에이전트-만들기)
    - [직접 ReAct 그래프 만들기](#직접-react-그래프-만들기)
    - [검증 단계를 추가한 그래프](#검증-단계를-추가한-그래프)
    - [human-in-the-loop과 함께 쓰기](#human-in-the-loop과-함께-쓰기)
  - [prebuilt를 언제 쓰나?](#prebuilt를-언제-쓰나)
  - [선택 기준](#선택-기준)
  - [핵심 정리](#핵심-정리)
  - [참고](#참고)


## prebuilt란?

LangGraph의 `prebuilt`는 자주 쓰는 에이전트 구성요소를 미리 만들어 둔 모듈이다.

LangGraph의 핵심은 직접 `StateGraph`를 만들고, 노드와 엣지를 연결해서 워크플로우를 설계하는 것이다. 그런데 LLM 에이전트에서 반복적으로 등장하는 패턴이 있다.

- 모델을 호출한다.
- 모델이 tool call을 만들었는지 확인한다.
- tool call이 있으면 도구를 실행한다.
- 도구 결과를 다시 모델에게 전달한다.
- 최종 답변이 나오면 종료한다.

이런 구조는 ReAct 스타일 에이전트에서 매우 자주 등장한다. LangGraph의 `prebuilt`는 이런 반복 패턴을 매번 처음부터 만들지 않도록 도와주는 기본 구성요소를 제공한다.

```python
from langgraph.prebuilt import create_react_agent, ToolNode, tools_condition
```

다만 `prebuilt`를 "LangGraph가 제공하는 완성형 에이전트 모음"이라고 이해하면 조금 부정확하다. 실제로는 **tool-calling agent를 빠르게 만들기 위한 그래프 부품 모음**에 가깝다.

## 한눈에 보기

| 구성요소 | 개념 | 언제 사용하나? |
|---|---|---|
| `create_react_agent` | ReAct agent 그래프를 한 번에 만들어주는 함수 | 빠르게 tool-calling agent를 실험할 때 |
| `ToolNode` | LLM이 만든 tool call을 실제 도구 실행으로 바꾸는 노드 | 직접 `StateGraph`를 만들면서 도구 실행만 표준 구현으로 처리할 때 |
| `tools_condition` | tool call이 있으면 도구 노드로, 없으면 종료로 보내는 조건 함수 | ReAct 루프의 분기 조건을 간단히 만들 때 |
| `ValidationNode` | tool call 인자가 schema에 맞는지 검증하는 노드 | 도구 실행 전 입력 검증이 중요할 때 |
| `InjectedState` | 현재 그래프 state를 도구 인자로 주입 | 도구가 대화 상태나 내부 state를 읽어야 할 때 |
| `InjectedStore` | LangGraph store를 도구 인자로 주입 | 장기 메모리나 사용자별 저장소를 도구에서 다룰 때 |
| `ToolRuntime` | 도구 실행 시점의 runtime 정보를 도구에 전달 | context, config, store 같은 실행 정보를 도구에서 함께 써야 할 때 |

가장 자주 쓰는 조합은 두 가지다.

- 빠른 실험: `create_react_agent(model, tools)`
- 직접 그래프 구성: `StateGraph` + `ToolNode` + `tools_condition`

## 핵심 구성요소

### create_react_agent

`create_react_agent`는 ReAct 스타일의 에이전트 그래프를 만들어주는 함수다.

ReAct는 **Reason + Act**의 줄임말이다. 모델이 답변만 바로 생성하는 것이 아니라, 필요한 경우 추론하고, 도구를 호출하고, 도구 결과를 보고, 다시 추론하는 방식이다.

동작 흐름은 대략 이렇다.

1. 사용자의 메시지를 받는다.
2. LLM을 호출한다.
3. LLM 응답에 `tool_calls`가 있으면 도구 실행 단계로 이동한다.
4. 도구 실행 결과를 메시지에 추가한다.
5. 다시 LLM을 호출한다.
6. 더 이상 tool call이 없으면 최종 응답으로 종료한다.

예시:

```python
from langgraph.prebuilt import create_react_agent


def get_weather(city: str) -> str:
    """Get weather for a city."""
    return f"{city}: sunny"


agent = create_react_agent(
    model="openai:gpt-4o-mini",
    tools=[get_weather],
)

result = agent.invoke(
    {"messages": [{"role": "user", "content": "서울 날씨 알려줘"}]}
)
```

이 함수는 빠르게 동작하는 기본 에이전트를 만들 때 편하다. 하지만 노드별 제어, 강제 순서, 복잡한 분기, 승인 단계, 커스텀 상태 관리가 필요하면 직접 `StateGraph`를 구성하는 편이 낫다.

#### 언제 사용하나?

`create_react_agent`는 다음 상황에 적합하다.

- LangGraph agent가 어떤 느낌으로 동작하는지 빠르게 확인할 때
- 모델 + 도구 목록만으로 기본 에이전트를 만들고 싶을 때
- 도구 호출 순서가 엄격하지 않을 때
- "필요하면 도구를 쓰고, 아니면 답변한다" 정도의 단순한 에이전트가 필요할 때
- 프로토타입이나 데모를 빠르게 만들 때

반대로 다음 상황에서는 직접 그래프를 짜는 편이 낫다.

- 도구 호출 순서를 강제해야 할 때
- 특정 도구 실행 전후에 검증, 승인, 로깅 단계를 넣어야 할 때
- 실패 시 재시도 경로를 직접 설계해야 할 때
- 여러 노드가 서로 다른 state를 업데이트해야 할 때
- multi-agent 구조를 명확히 설계해야 할 때

:::note
LangGraph의 `create_react_agent`는 최신 문서에서 deprecated로 표시된다. 현재 LangChain 쪽에서는 `langchain.agents.create_agent`를 권장하는 흐름이 있다. 이 `create_agent`도 내부적으로는 LangGraph 기반 그래프 런타임을 사용한다.
:::

```python
from langchain.agents import create_agent

agent = create_agent(
    model="openai:gpt-4o-mini",
    tools=[get_weather],
)
```

즉, 빠르게 에이전트를 만들고 싶으면 최신 LangChain의 `create_agent`를 보고, LangGraph 안에서 직접 그래프를 다루고 싶으면 `ToolNode`, `tools_condition` 같은 prebuilt 부품을 이해하는 것이 중요하다.

## ToolNode

`ToolNode`는 LLM이 생성한 tool call을 실제 도구 실행으로 바꿔주는 노드다.

LLM이 도구를 호출한다고 해서 실제 함수가 자동으로 실행되는 것은 아니다. 모델은 보통 다음과 비슷한 구조의 tool call을 만든다.

```json
{
  "name": "get_weather",
  "args": {
    "city": "Seoul"
  },
  "id": "tool_call_1"
}
```

`ToolNode`는 이 tool call을 읽고, 이름이 맞는 도구를 찾아 실행한 뒤, 결과를 `ToolMessage` 형태로 그래프 상태에 추가한다.

예시:

```python
from langgraph.prebuilt import ToolNode


def get_weather(city: str) -> str:
    """Get weather for a city."""
    return f"{city}: sunny"


tool_node = ToolNode([get_weather])
```

직접 그래프를 만들 때는 보통 이렇게 쓴다.

```python
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START
from langgraph.prebuilt import ToolNode, tools_condition


class State(TypedDict):
    messages: list


graph = StateGraph(State)
graph.add_node("agent", call_model)
graph.add_node("tools", ToolNode([get_weather]))

graph.add_edge(START, "agent")
graph.add_conditional_edges("agent", tools_condition)
graph.add_edge("tools", "agent")

app = graph.compile()
```

이 구조에서 `ToolNode`는 `"tools"` 노드 역할을 한다.

#### ToolNode가 필요한 이유

LLM의 tool call은 "함수를 실행하라"는 의도를 담은 메시지일 뿐이다. 실제 Python 함수를 실행하고, 결과를 LangGraph 메시지 상태에 다시 붙이는 일은 런타임 쪽에서 처리해야 한다.

직접 구현하면 다음 일을 모두 처리해야 한다.

- 마지막 AI 메시지에서 `tool_calls`를 꺼낸다.
- tool call의 `name`으로 실행할 함수를 찾는다.
- `args`를 함수 인자로 넘긴다.
- 실행 결과를 `ToolMessage`로 만든다.
- 원래 tool call의 `id`와 결과 메시지를 연결한다.
- 여러 tool call이 있을 때 각각 실행한다.
- 오류가 발생했을 때 처리한다.

`ToolNode`는 이 반복 작업을 표준 방식으로 처리한다.

#### 언제 사용하나?

`ToolNode`는 다음 상황에 적합하다.

- `create_react_agent`보다 직접 그래프를 제어하고 싶을 때
- 하지만 도구 실행 로직은 직접 만들고 싶지 않을 때
- 여러 tool을 한 노드에서 실행하고 싶을 때
- 모델이 만든 tool call 결과를 표준 `ToolMessage`로 다시 state에 넣고 싶을 때

즉, `ToolNode`는 LangGraph에서 직접 agent loop를 만들 때 가장 기본적으로 쓰는 prebuilt node다.

## tools_condition

`tools_condition`은 tool call 여부에 따라 다음 경로를 결정하는 조건 함수다.

ReAct 스타일 에이전트에서는 모델 호출 이후에 항상 다음 판단이 필요하다.

- 마지막 AI 메시지에 tool call이 있다면 도구 실행 노드로 간다.
- tool call이 없다면 최종 답변으로 보고 종료한다.

이 조건을 직접 매번 작성하지 않도록 도와주는 함수가 `tools_condition`이다.

```python
from langgraph.prebuilt import tools_condition

graph.add_conditional_edges("agent", tools_condition)
```

기본적으로 `tools_condition`은 state 안의 `messages`를 본다. 마지막 메시지가 AI 메시지이고, 그 안에 `tool_calls`가 있으면 `"tools"`로 라우팅한다. 없으면 `END`로 라우팅한다.

개념적으로는 다음 코드와 비슷하다.

```python
def tools_condition(state):
    last_message = state["messages"][-1]

    if last_message.tool_calls:
        return "tools"

    return "__end__"
```

실제 `tools_condition`은 여러 state 형태를 지원하고, LangGraph의 표준 메시지 구조에 맞춰 동작한다.

#### 언제 사용하나?

`tools_condition`은 다음 상황에 적합하다.

- 모델 응답 이후 tool call 여부만 보고 분기하면 될 때
- ReAct 루프를 직접 만들고 싶을 때
- `agent -> tools -> agent` 구조를 간단히 만들고 싶을 때
- `messages` 기반 state를 사용하고 있을 때

직접 조건 함수를 만들어야 하는 경우도 있다. 예를 들어 다음처럼 tool call 여부만으로는 부족한 경우다.

- 특정 tool call은 사람 승인 노드로 보내야 할 때
- 위험한 tool은 validation 노드를 먼저 거쳐야 할 때
- tool call 개수나 tool 이름에 따라 다른 노드로 보내야 할 때
- 에러 횟수에 따라 종료하거나 재시도해야 할 때

예를 들어 위험한 도구만 승인 노드로 보내고 싶다면 직접 조건 함수를 작성할 수 있다.

```python
def route_after_agent(state):
    last_message = state["messages"][-1]

    if not last_message.tool_calls:
        return "__end__"

    risky_tools = {"send_email", "delete_file", "run_payment"}
    called_tools = {call["name"] for call in last_message.tool_calls}

    if called_tools & risky_tools:
        return "human_approval"

    return "tools"
```

이처럼 `tools_condition`은 기본 ReAct 분기에는 좋지만, 정책 기반 라우팅이 필요하면 직접 조건 함수를 만드는 편이 낫다.

## ValidationNode

`ValidationNode`는 모델이 만든 tool call의 인자가 schema에 맞는지 검증하는 노드다.

LLM은 도구 호출 인자를 항상 정확하게 만들지 않는다. 예를 들어 도구가 `city: str`을 요구하는데 `city`가 빠졌거나, 숫자를 요구하는데 문자열을 넣을 수 있다.

`ValidationNode`는 도구를 실제로 실행하기 전에 tool call이 Pydantic schema를 만족하는지 확인하는 용도로 쓴다.

이런 경우에 유용하다.

- 도구 실행 전에 입력 검증을 강하게 하고 싶을 때
- 잘못된 tool call을 바로 실행하면 위험할 때
- 모델에게 잘못된 인자를 고쳐서 다시 tool call하도록 만들고 싶을 때
- SQL, 결제, 파일 수정처럼 부작용이 큰 도구를 다룰 때

`ToolNode`가 "도구 실행"에 집중한다면, `ValidationNode`는 "도구 실행 전 검증"에 집중한다.

#### 예시 상황

예를 들어 결제 도구가 있다고 해보자.

```python
from pydantic import BaseModel, Field


class PaymentInput(BaseModel):
    amount: int = Field(gt=0, le=100000)
    receiver_id: str
```

모델이 다음처럼 잘못된 tool call을 만들 수 있다.

```json
{
  "name": "send_payment",
  "args": {
    "amount": -5000,
    "receiver_id": "user_123"
  }
}
```

이런 경우 도구를 바로 실행하면 안 된다. `ValidationNode`를 앞에 두면 tool call 인자가 schema를 통과하는지 확인하고, 실패했을 때 모델에게 수정 기회를 주거나 별도 에러 경로로 보낼 수 있다.

#### 언제 사용하나?

`ValidationNode`는 특히 다음 도구에서 중요하다.

- 결제, 주문, 예약처럼 실제 부작용이 있는 도구
- SQL 실행, 파일 수정, 이메일 발송처럼 잘못 실행하면 문제가 되는 도구
- 입력 schema가 복잡한 도구
- 모델이 자주 잘못된 인자를 만드는 도구

## InjectedState

`InjectedState`는 도구 함수에 그래프의 현재 state를 주입할 때 사용한다.

중요한 점은 이 값이 모델이 직접 채우는 인자가 아니라는 것이다. 모델에게는 숨기고, LangGraph 런타임이 도구 실행 시점에 넣어준다.

예를 들어 도구가 현재 대화 상태나 사용자 프로필을 참고해야 한다고 해보자.

```python
from typing import Annotated
from langgraph.prebuilt import InjectedState


def summarize_current_state(
    state: Annotated[dict, InjectedState],
) -> str:
    """Summarize the current graph state."""
    return str(state)
```

이 경우 모델은 `state` 인자를 직접 만들 필요가 없다. LangGraph가 현재 그래프 state를 도구에 주입한다.

이 패턴은 다음 상황에서 유용하다.

- 도구가 현재 메시지 목록을 참고해야 할 때
- 사용자별 상태를 읽어야 할 때
- 모델에게 노출하고 싶지 않은 내부 상태가 있을 때
- tool call 인자를 단순하게 유지하고 싶을 때

#### 예시: 모델에게 숨긴 상태 사용하기

예를 들어 그래프 state 안에 `user_id`가 있지만, 모델에게 `user_id`를 직접 쓰게 하고 싶지 않을 수 있다.

```python
from typing import Annotated
from langgraph.prebuilt import InjectedState


def get_user_orders(
    state: Annotated[dict, InjectedState],
) -> str:
    """Get orders for the current user."""
    user_id = state["user_id"]
    return f"orders for {user_id}"
```

이 경우 모델은 `get_user_orders()`를 호출하기만 하면 된다. `user_id`는 모델이 생성하는 인자가 아니라 LangGraph가 현재 state에서 주입한다.

#### 언제 사용하나?

`InjectedState`는 다음 상황에 적합하다.

- 도구가 현재 사용자 정보가 필요할 때
- 도구가 지금까지의 메시지나 중간 결과를 읽어야 할 때
- 모델에게 내부 state 구조를 노출하고 싶지 않을 때
- tool schema를 단순하게 유지하고 싶을 때

## InjectedStore

`InjectedStore`는 도구 함수 안에서 LangGraph store에 접근할 수 있게 해준다.

store는 장기 메모리나 사용자별 저장소 같은 용도로 사용할 수 있다. 예를 들어 사용자의 선호도, 이전 대화에서 저장한 정보, 장기 기억 등을 저장하고 다시 조회할 수 있다.

```python
from typing import Annotated
from langgraph.prebuilt import InjectedStore


def save_preference(
    key: str,
    value: str,
    store: Annotated[object, InjectedStore],
) -> str:
    """Save a user preference."""
    store.put(("preferences",), key, value)
    return "saved"
```

`InjectedState`가 현재 실행 중인 graph state를 주입한다면, `InjectedStore`는 실행을 넘어 유지되는 저장소를 주입한다.

구분하면 다음과 같다.

| 구분 | 역할 |
|---|---|
| `InjectedState` | 현재 그래프 실행 상태를 도구에 전달 |
| `InjectedStore` | 장기 저장소를 도구에 전달 |

#### 예시: 사용자 선호도 저장하기

에이전트가 사용자의 선호도를 기억해야 한다고 해보자.

```python
from typing import Annotated
from langgraph.prebuilt import InjectedStore


def remember_preference(
    key: str,
    value: str,
    store: Annotated[object, InjectedStore],
) -> str:
    """Remember a user preference."""
    store.put(("preferences",), key, {"value": value})
    return "preference saved"
```

이 도구를 사용하면 모델은 `key`, `value`만 정하면 된다. 실제 저장소 객체는 LangGraph가 주입한다.

#### 언제 사용하나?

`InjectedStore`는 다음 상황에 적합하다.

- 사용자별 장기 메모리를 저장할 때
- 세션이 끝나도 유지되어야 하는 정보를 다룰 때
- 도구가 persistent store에 직접 읽기/쓰기를 해야 할 때
- memory tool을 직접 구현하고 싶을 때

## ToolRuntime

`ToolRuntime`은 도구 실행 시점의 런타임 정보를 도구에서 사용할 수 있게 해주는 타입이다.

도구가 단순히 입력값만 받아 실행되는 것이 아니라, 실행 중인 context, config, store 같은 정보를 함께 알아야 할 때가 있다.

예를 들어 다음과 같은 정보가 필요할 수 있다.

- 현재 사용자 ID
- 실행 환경 설정
- thread ID
- LangGraph store
- 런타임 context

이런 정보를 도구 인자로 자연스럽게 받도록 도와주는 개념이 `ToolRuntime`이다.

#### 언제 사용하나?

`ToolRuntime`은 `InjectedState`나 `InjectedStore`보다 더 넓은 실행 정보를 도구에서 다루고 싶을 때 사용한다.

예를 들어 이런 경우다.

- 같은 도구라도 사용자 권한에 따라 다르게 동작해야 할 때
- 런타임 context에 있는 `user_id`, `tenant_id`, `role`을 읽어야 할 때
- store와 context를 함께 써야 할 때
- tool 내부에서 현재 실행 설정을 참고해야 할 때

정리하면 `InjectedState`는 state, `InjectedStore`는 store, `ToolRuntime`은 도구 실행과 관련된 더 넓은 runtime 정보를 다루는 용도다.

## 자주 쓰는 조합

### 빠르게 기본 에이전트 만들기

가장 간단한 방식은 `create_react_agent`를 쓰는 것이다.

```python
from langgraph.prebuilt import create_react_agent

agent = create_react_agent(model, tools)
```

장점은 빠르다는 것이다. 단점은 그래프 구조를 세밀하게 제어하기 어렵다는 것이다.

### 직접 ReAct 그래프 만들기

실무에서는 `ToolNode`와 `tools_condition`을 조합해서 직접 그래프를 만드는 경우가 많다.

```python
from langgraph.graph import StateGraph, START
from langgraph.prebuilt import ToolNode, tools_condition

graph = StateGraph(State)

graph.add_node("agent", call_model)
graph.add_node("tools", ToolNode(tools))

graph.add_edge(START, "agent")
graph.add_conditional_edges("agent", tools_condition)
graph.add_edge("tools", "agent")

app = graph.compile()
```

이 구조는 다음처럼 읽으면 된다.

1. `agent` 노드에서 모델을 호출한다.
2. 모델이 tool call을 만들었는지 `tools_condition`으로 확인한다.
3. tool call이 있으면 `tools` 노드로 이동한다.
4. `ToolNode`가 실제 도구를 실행한다.
5. 도구 결과를 들고 다시 `agent` 노드로 돌아간다.
6. tool call이 없으면 종료한다.

이 패턴이 LangGraph에서 가장 기본적인 tool-calling agent 구조다.

### 검증 단계를 추가한 그래프

도구 실행 전에 입력 검증이 필요하면 `ValidationNode` 같은 검증 노드를 중간에 둘 수 있다.

개념적인 흐름은 다음과 같다.

```text
START
  -> agent
  -> validation
  -> tools
  -> agent
  -> END
```

이 구조는 모델이 tool call을 만들었을 때 바로 도구를 실행하지 않고, 먼저 인자가 안전한지 확인한다.

이런 패턴은 SQL agent, 결제 agent, 파일 수정 agent처럼 부작용이 큰 작업에서 중요하다.

### human-in-the-loop과 함께 쓰기

`tools_condition`을 그대로 쓰면 tool call이 있을 때 곧바로 `tools` 노드로 간다. 하지만 실무에서는 어떤 도구는 사람 승인을 받아야 할 수 있다.

예를 들어 다음처럼 나눌 수 있다.

```text
agent
  -> safe tools
  -> agent

agent
  -> human approval
  -> risky tools
  -> agent
```

이 경우에는 `tools_condition` 대신 직접 라우팅 함수를 작성해서 tool 이름에 따라 `tools` 또는 `human_approval`로 보내는 식으로 구성한다.

## prebuilt를 언제 쓰나?

`prebuilt`는 다음 경우에 적합하다.

- 빠르게 ReAct agent를 실험하고 싶을 때
- tool-calling 루프를 직접 구현하고 싶지 않을 때
- 직접 그래프를 만들되 도구 실행 노드는 표준 구현을 쓰고 싶을 때
- 모델의 tool call 여부에 따른 라우팅을 간단히 처리하고 싶을 때
- state나 store를 도구에 주입해야 할 때

반대로 다음 경우에는 prebuilt만으로 부족할 수 있다.

- 특정 도구를 반드시 먼저 호출해야 할 때
- 도구 호출 순서를 강제해야 할 때
- 승인 단계가 여러 개 들어갈 때
- 실패 시 다른 경로로 우회해야 할 때
- 여러 에이전트가 복잡하게 협업해야 할 때
- 각 노드의 프롬프트와 상태 업데이트를 세밀하게 제어해야 할 때

이런 경우에는 `prebuilt`를 출발점으로 삼되, 직접 `StateGraph`를 구성하는 것이 좋다.

## 선택 기준

실무에서는 다음 기준으로 선택하면 된다.

| 상황 | 추천 |
|---|---|
| 빠르게 tool-calling agent를 만들어 보고 싶다 | `create_react_agent` 또는 `langchain.agents.create_agent` |
| 그래프 구조를 직접 제어하고 싶다 | `StateGraph` + `ToolNode` + `tools_condition` |
| tool call 인자 오류가 자주 난다 | `ValidationNode` 추가 |
| 도구가 현재 state를 읽어야 한다 | `InjectedState` |
| 도구가 장기 저장소를 읽고 써야 한다 | `InjectedStore` |
| 도구가 context/config/store 등 실행 정보를 넓게 써야 한다 | `ToolRuntime` |
| 도구별 승인/분기 정책이 필요하다 | `tools_condition` 대신 커스텀 라우팅 함수 |

가장 중요한 기준은 **제어권이 얼마나 필요한가**다.

기본 에이전트가 필요하면 prebuilt agent를 쓰면 된다. 하지만 제품에 들어가는 에이전트는 보통 도구별 권한, 실패 처리, 승인 단계, 상태 업데이트가 필요하다. 이때는 prebuilt 부품을 가져와 직접 그래프를 짜는 방식이 더 적합하다.

## 핵심 정리

LangGraph의 `prebuilt`는 복잡한 에이전트를 모두 대신 만들어주는 고수준 프레임워크라기보다, **반복적으로 쓰이는 tool-calling agent 부품을 제공하는 모듈**이다.

가장 중요한 구성요소는 다음 세 가지다.

- `create_react_agent`: 기본 ReAct agent를 빠르게 만든다.
- `ToolNode`: 모델이 만든 tool call을 실제 도구 실행으로 바꾼다.
- `tools_condition`: tool call이 있으면 도구 노드로, 없으면 종료로 라우팅한다.

처음에는 `create_react_agent`로 감을 잡고, 이후에는 `ToolNode`와 `tools_condition`을 직접 `StateGraph`에 연결하는 방식으로 넘어가는 것이 좋다.

## 참고

- LangGraph prebuilt API: https://reference.langchain.com/python/langgraph.prebuilt/
- `tools_condition`: https://reference.langchain.com/python/langgraph.prebuilt/tool_node/tools_condition/
- LangGraph overview: https://langchain-ai.github.io/langgraph/reference/
