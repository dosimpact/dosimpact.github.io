---
sidebar_position: 5
---

# 5: Tool Use (ko)

## 패턴 요약

Tool Use(함수 호출)은 에이전트가 텍스트 생성만으로는 할 수 없는 일을 외부 함수, API, 데이터베이스, 서비스, 코드 실행 환경, 검색 도구, 다른 전문 에이전트 호출로 확장하는 방식이다. 장에서는 툴 사용을 LLM 추론과 동적 정보, 확정 계산, 비공개 데이터 접근, 실제 액션을 잇는 다리로 본다.

표준 제어 루프는 다음과 같다: 명확한 이름/설명/파라미터 스키마를 가진 도구 정의 → 모델이 필요 여부 판단 → 구조화된 도구 요청 파싱 → 오케스트레이션 레이어에서 도구 실행 → 관측 결과 반환 → 최종 응답 또는 추가 도구 호출 결정.

구현 시 도구 사용은 제약 없는 모델 능력이 아니라 통제된 액션 루프여야 한다. 범위를 넘어선 도구명·인자 실행을 금지하고, 관측값을 보존하며, 도구 오류를 명시 처리하고, 반복 호출 횟수를 제한해 실패시 결과를 지어내지 않아야 한다.

## 패턴 설명

### 개념 개요

Tool Use는 LLM이 내부적으로 가지지 못한 능력을 제어된 방식으로 부여한다. 요청이 실시간 날씨, 주가, DB 조회, 계산, 코드 실행 결과를 필요로 할 때 모델이 판단만 하고, 실제 실행은 오케스트레이션 계층이 담당한다.

장에서는 좁은 의미의 function calling과 넓은 의미의 tool calling을 구분한다. tool은 Python 함수, API 엔드포인트, DB 쿼리, 검색 provider, 코드 인터프리터, Vertex AI extension, 또는 다른 에이전트에 대한 요청일 수 있다. 모델은 구조화된 action을 제안하고, 시스템이 실행 여부/방법을 결정한다.

### 문제

LLM은 정적 지식, 산술 신뢰성 한계, 비공개 시스템 접근성, 외부 액션 트리거 능력 부족을 가진다. 최신 데이터/전용 데이터/결정론적 계산/부작용이 필요한 경우 메모리 기반 답변은 위험하다. Tool Use는 이러한 부분을 명시적 외부 기능을 통해 수행하고 결과를 다시 워크플로에 반영한다.

### 사용해야 할 때

- 실시간 또는 외부 정보가 필요한 질문(날씨, 주식, 재고, 주문 상태, 검색 결과)
- DB/API 작업이 필요한 작업
- 모델 단독 추론보다 결정적 계산/분석/코드 실행이 신뢰도 높을 때
- 메시지 전송, 연결 시스템 제어 등 외부 액션을 수행해야 할 때
- 범용 LLM보다 특정 도구/에이전트가 잘하는 하위 업무가 있을 때

### 사용하지 말아야 할 때

- 단순 질문을 모델만으로 안전하게 답할 수 있을 때
- 요청 실행을 맡길 신뢰 가능한 도구/권한 경계가 없을 때
- 되돌릴 수 없는 고위험 액션을 확인 없이 자동 실행하면 안 될 때
- 스키마가 모호한 넓은 도구를 노출하면 모델이 unsafe/오류 인자를 넣을 수 있으므로 피한다.
- 도구는 설계 대체재가 아니다. 도구 호출도 검증·오류 처리·관측성이 필요하다.

### 작동 방식

1. 사용 가능한 도구를 이름, 설명, 입력 스키마, 핸들러와 함께 등록한다.
2. 모델은 사용자 요청 및 도구 정의를 받아 직접 응답 또는 하나 이상의 도구 호출 중 하나를 결정한다.
3. 모델은 tool name과 arguments를 담은 구조화 도구 호출을 반환한다.
4. 오케스트레이션은 레지스트리/스키마를 기준으로 요청을 검증한다.
5. 도구 핸들러가 모델 외부에서 실행되어 관측치 또는 구조화된 오류를 반환한다.
6. 관측치는 상태에 추가되어 모델에 다시 전달된다.
7. 모델은 최종 응답을 하거나 추가 도구 호출을 요청한다(최대 호출 정책으로 제한).

### 트레이드오프

| 이점 | 비용 또는 위험 |
| --- | --- |
| 에이전트가 동적 데이터/외부 시스템에 접근한다. | 도구 실행은 잘못된 인자, 서비스 비가용성, 권한, 타임아웃, rate limit로 실패할 수 있다. |
| 계산, 코드 실행, 비공개 조회의 신뢰성을 높인다. | 스키마 검증/입력 정제/안전 제한이 필수이다. |
| 에이전트의 행위성을 높인다. | 루프 상한/종료 조건이 없으면 비용과 수행이 폭증할 수 있다. |
| 도구 실행을 중간 산출물로 관측 가능하게 한다. | 민감한 입력/출력이 노출되지 않도록 로깅 설계가 필요. |
| LangChain/CrewAI/Google ADK/Vertex AI 확장 등 여러 프레임워크와 호환. | 프레임워크마다 실행 위치가 달라 경계가 명확해야 한다. |

### 최소 예시

```text
User: "What is the current simulated price of AAPL and the gain on 100 shares bought at 150?"

Agent decides: call get_stock_price({"ticker": "AAPL"})
Tool result: 178.15
Agent decides: call calculate_expression({"expression": "(178.15 - 150) * 100"})
Tool result: 2815.0
Agent final answer: "AAPL is 178.15. The simulated gain is 2815.00."
```

### LangGraph 매핑

| 패턴 개념 | LangGraph 요소 |
| --- | --- |
| 사용자 요청 및 대화 맥락 | `input`, `normalized_input`, `messages` 상태 필드 |
| 도구 정의 | `validate_tool_call`, `execute_tool`에서 쓰는 정적 레지스트리 |
| 답변/도구 호출 결정 | `decide_next_action` 노드 |
| 구조화된 함수 호출 | `pending_tool_call` 상태 필드 |
| 스키마/권한 검사 | `validate_tool_call` 노드 |
| 외부 도구 실행 | `execute_tool` 노드 |
| 도구 관측 | reducer 기반 `tool_results` |
| 반복 도구 사용 루프 | `record_observation`에서 `decide_next_action`으로 조건부 복귀 |
| 최종 답변 | `synthesize_response` 노드 |
| 실패/검토 상태 | `handle_tool_error`, `handle_failure` 노드 |

## LangGraph 구현 목표

`tool_use_assistant` 예제를 만들어 사용자 요청을 처리할 때 도구 호출이 필요한지 판단하고, 등록된 도구를 호출하거나 직접 응답한다. 테스트를 위해 결정론적 로컬 도구만 사용한다.

- `search_information(query: str) -> str` : 시뮬레이션 사실 조회, Chapter의 LangChain 검색 예시와 대응.
- `get_stock_price(ticker: str) -> float` : 주가 시뮬레이션 조회, CrewAI 주식 예시와 대응.
- `calculate_expression(expression: str) -> float` : 산술 계산, 코드 실행/계산기 설명과 대응(초기에는 제한적 산술 평가 사용).

그래프는 다음 순환을 보여야 한다: 모델/도구 결정 → 구조화된 호출 생성 → 검증 → 실행 → 관측 반영 → 최종 응답. 테스트는 fake 모델 결정 함수를 주입해 direct answer, 유효/무효 도구 호출, 다단계 호출까지 모두 검증해야 한다.

## 상태 형태

그래프가 필요로 하는 상태 필드를 정리한다.

| 필드 | 타입 | 목적 |
| --- | --- | --- |
| `input` | `str` | 원본 사용자 요청. |
| `normalized_input` | `str` | 모델 판단/검증에 쓰일 정규화된 요청. |
| `messages` | `list[dict]` | 사용자 입력, 모델 결정, 도구 관측, 최종 답변을 담는 대화형 추적. |
| `available_tools` | `list[str]` | 실행 런에서 등록된 도구 이름 목록. |
| `raw_model_decision` | `dict \| str \| None` | 모델/테스트 더블의 raw 출력. |
| `action` | `Literal["answer", "tool_call", "failure"] \| None` | `decide_next_action`의 정규화된 다음 동작. |
| `pending_tool_call` | `dict \| None` | `name`, `arguments` 필드를 가진 구조화된 호출. |
| `tool_results` | `list[dict]` | 실행된 도구 결과(도구명, 인자, 결과, 상태) 순차 목록. |
| `tool_errors` | `list[dict]` | 검증/실행 오류(가능하면 도구명 포함). |
| `tool_call_count` | `int` | 현재 실행의 도구 실행 시도 횟수. |
| `max_tool_calls` | `int` | 비정상 반복을 막는 상한. |
| `requires_confirmation` | `bool` | 다음 요청 도구 액션이 실행 전 확인이 필요한지 여부. |
| `requires_human_review` | `bool` | 자동 완료가 안전하지 않을 때 사람 리뷰 필요 여부. |
| `status` | `Literal["ok", "needs_tool", "needs_confirmation", "needs_review", "failed"]` | 현재 워크플로 상태. |
| `final_output` | `str \| None` | 그래프 종료 시 사용자 대상 응답. |
| `metadata` | `dict` | 모델명, 실행 ID, 타이밍, 레지스트리 버전, 테스트 메타데이터. |

## 노드

| 노드 | 책임 |
| --- | --- |
| `prepare_input` | 입력 존재 검증, 공백 정규화, 추적 필드 초기화, 도구 목록 등록, `max_tool_calls` 설정. |
| `decide_next_action` | LLM 또는 결정론적 테스트 더블로 직접 응답/도구 호출 여부를 결정. |
| `normalize_model_decision` | 모델 출력에서 `action`, `pending_tool_call` 정규화, prose-only 호출 거부. |
| `validate_tool_call` | 도구명 존재, 필수 인자, 타입, 정책 허용, 호출 제한 초과 여부 검증. |
| `execute_tool` | 등록된 로컬 핸들러를 호출해 성공/예외를 구조화해 기록. |
| `record_observation` | `messages`와 `tool_results`에 관측 결과 추가, `pending_tool_call` 제거, `tool_call_count` 증가. |
| `synthesize_response` | 요청과 누적 관측을 바탕으로 최종 답변 생성, 누락된 도구 결과를 추측하지 않음. |
| `request_confirmation` | 부작용/고위험 도구 실행 전 중단 후 확인-oriented 응답. |
| `handle_tool_error` | 검증 실패, 도구 예외, 권한 오류, 재시도 초과를 제어 상태로 변환. |
| `handle_failure` | 빈 입력, invalid 결정, unsafe 요청, 반복 실패에서 종료. |

## 엣지

그래프 흐름을 조건부 분기 포함해 설명한다.

```text
START -> prepare_input -> decide_next_action -> normalize_model_decision

normalize_model_decision -> synthesize_response -> END
normalize_model_decision -> validate_tool_call
normalize_model_decision -> handle_failure -> END

validate_tool_call -> execute_tool
validate_tool_call -> request_confirmation -> END
validate_tool_call -> handle_tool_error

execute_tool -> record_observation -> decide_next_action
execute_tool -> handle_tool_error

handle_tool_error -> decide_next_action
handle_tool_error -> synthesize_response -> END
handle_tool_error -> handle_failure -> END
```

조건부 엣지 요구사항:

- `normalize_model_decision`에서 `action == "answer"`일 때 `synthesize_response`로 이동.
- `action == "tool_call"`이며 구조화된 `pending_tool_call`이 있으면 `validate_tool_call`으로 이동.
- malformed/빈/지원되지 않는 모델 결정은 `handle_failure` 또는 bounded 재시도 정책으로 라우팅.
- side-effect/고위험 호출은 `request_confirmation`으로 이동. 초기 로컬 도구들은 보통 필요 없음.
- `validate_tool_call`에서 unknown tool, 인자 누락, 스키마 오류, 거부된 도구, `tool_call_count >= max_tool_calls`면 `handle_tool_error`로 이동.
- `execute_tool`은 성공 시 `record_observation`, 예외 시 `handle_tool_error`.
- `record_observation`에서 `decide_next_action`으로 되돌아가 관측 반영 응답/추가 호출 결정.
- 안전하게 완료 가능할 때만 `synthesize_response`로 종료, 불가 시 `handle_failure`.

## 입력과 출력

- 입력: 실시간 조회/결정론적 계산이 필요한 자연어 요청(예: `"What is the capital of France?"`, `"What is the simulated AAPL price?"`, `"What is the gain on 100 AAPL shares bought at 150 if the current price is AAPL's simulated price?"`)
- 출력: `final_output`, `status`, 실행된 `tool_results`, `tool_errors`
- 중간 산출물:
  - 정규화된 사용자 입력
  - raw 모델 결정
  - 정규화된 action
  - pending 호출명/인자
  - 검증 결과
  - 도구 관측
  - 테스트용 모델 입력/최종 합성 입력

예시 입력 형태:

```json
{
  "input": "What is the gain on 100 AAPL shares bought at 150 if the current price is AAPL's simulated price?"
}
```

성공 출력 형태 예시:

```json
{
  "status": "ok",
  "final_output": "The simulated stock price for AAPL is 178.15.",
  "tool_results": [
    {
      "name": "get_stock_price",
      "arguments": {"ticker": "AAPL"},
      "result": 178.15,
      "status": "ok"
    }
  ],
  "tool_errors": []
}
```

## 실패 사례

예상 실패, 재시도, 폴백, 인간 검토 포인트를 문서화한다.

- 빈 입력은 `prepare_input`에서 모델/도구 호출 전에 실패.
- unknown tool은 `validate_tool_call`에서 거부. 임의 함수 동적 import/실행 금지.
- 인자 누락/초과/타입 불일치 시 schema 오류를 기록하고 실행하지 않음.
- 모델이 직접 답변이 가능한데도 도구 호출을 요청할 수 있는데, 유효하고 예산 이내이면 허용 가능. 다만 direct answer 경로도 있어야 함.
- 도구 처리기에서 알려지지 않은 티커 등 오류가 나면 오류 기록 후 한 번 회복 시도하거나 명확한 실패 응답 합성.
- 향후 통합에서 타임아웃/비가용성은 structured timeout으로 다루고 이전 관측값을 잃지 않게 함.
- 모델이 반복적으로 도구를 호출하려 하면 `max_tool_calls`로 가드하고 실패/검토로 종료.
- 이메일·결제·재고 갱신·기기 제어 같은 side-effect 도구는 확인이나 human review가 필요.
- 코드 실행 도구는 고위험이므로 초기에는 안전한 산술 평가만 사용. 향후 도구는 샌드박싱 필요.
- 도구 출력에 민감 데이터가 있을 수 있으므로 로그/메타데이터에 비밀을 저장하지 않는다.
- 도구 사용 시 최종 응답은 도구 관측에 근거해야 한다. 필요한 도구가 실패했으면 추측 없이 실패를 명시.

## 테스트 아이디어

- fake 모델이 `action = "answer"`일 때 툴이 실행되지 않는 direct-answer 경로 검증.
- `search_information`의 `"capital of France"` 단일 도구 정상 경로 검증.
- `get_stock_price`에서 `"AAPL"` 정상 경로 검증.
- `get_stock_price` 후 관측 기록, 그 다음 `calculate_expression` 호출, 최종 synthesis의 다단계 정상 경로 검증.
- unknown tool명이 실행 없이 거부되는지 검증.
- 인자 누락/타입 오류가 검증 오류를 발생시키는지 검증.
- unknown ticker로 도구 오류를 내고 결과에 명확한 오류 응답이 반환되는지 확인.
- `tool_call_count`가 실행 시도 후에만 증가하고 `max_tool_calls`를 넘지 않는지 검증.
- `tool_results`가 실행 순서를 보존하고 도구명/인자/결과/상태를 포함하는지 검증.
- side-effect 시뮬레이션 도구 추가 시 `requires_confirmation`이 `request_confirmation`으로 라우팅되는지 검증.
- fake model 결정과 결정론적 로컬 도구를 사용하고 네트워크/키 미사용.

## 열린 질문

- TOC는 Chapter 5를 논리 페이지 `71-90`으로 기록하지만 추출 범위는 PDF 인덱스 `78-98`(21페이지)이다. TOC 논리 범위를 계속 쓰면서 추출 라벨을 병기할지 결정 필요.
- 장은 LangChain, CrewAI, Google ADK, Vertex AI 예시를 제시하지만 LangGraph 구현은 직접 제공하지 않는다. 따라서 결정/검증/실행/합성 노드로 패턴 매핑.
- 장의 예시는 이메일/기기 제어 같은 side-effect 도구도 포함한다. 첫 구현은 확인 정책이 있지 않다면 도구를 read-only 또는 결정론적으로 제한.
- 실제 모델 네이티브 tool call output vs provider-중립 구조화 결정 프롬프트 중 무엇을 표준 채택할지, 테스트는 fake decision 사용.
