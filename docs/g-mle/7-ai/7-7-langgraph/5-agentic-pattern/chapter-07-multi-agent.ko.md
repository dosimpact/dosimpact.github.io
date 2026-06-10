---
sidebar_position: 7
---

# 7: Multi-Agent Collaboration (ko)

## 패턴 요약

멀티 에이전트 협업은 복잡한 목표를 여러 전문화된 에이전트가 담당하는 하위 과업으로 분해합니다. 각 에이전트는 역할, 목표, 도구 접근권한, 지식 범위를 갖고, 시스템은 에이전트 간 통신, 업무 인수인계, 충돌 해결, 산출물 통합 방식을 정의합니다.

이 장은 단일 거대한 에이전트가 다중 영역 작업을 전부 처리하려는 방식의 대안으로, 멀티 에이전트를 제시합니다. 순차적 인계, 병렬 처리, 토론과 합의, 계층형 상위-하위 구조, 전문가 팀, 비평/리뷰 워크플로, 에이전트-투-툴 구성 같은 형태를 사용할 수 있습니다. 핵심은 단순히 LLM 호출이 여러 번 일어나는 것이 아니라, 명확한 책임 분담과 협업이 신뢰로 작동하는 통신 규약입니다.

구현 관점에서 이 패턴은 조정된 팀 워크플로처럼 동작해야 합니다. 그래프는 각 에이전트의 과업, 입력, 출력, 리뷰 상태를 보존하고, 통신을 구조화하며, 미완성/충돌 출력은 재수정 또는 사람 검토 경로로 라우팅하고, 최종 답변에 어떤 에이전트가 기여했는지 추적 가능한 메타데이터를 남겨야 합니다.

## 패턴 설명

### 개념 개요

멀티 에이전트 협업은 하나의 광범위한 에이전트를 여러 개의 좁은 에이전트 팀으로 바꾸는 방식입니다. 상위 조정자 또는 워크플로가 각 전문가에게 업무를 배분하고, 각 전문가는 특정 과업을 수행한 뒤, 뒤이어 결과를 통합하거나 리뷰하는 단계로 넘깁니다.

이 장은 가치의 핵심을 전문화와 통신에서 찾습니다. 연구자, 분석가, 작성자, 리뷰어 에이전트가 서로 다른 프롬프트, 도구 세트, 평가 기준을 사용할 수 있고, 시스템이 이들의 결과를 정렬해 단일 일반 에이전트보다 더 강한 결과를 만들어냅니다.

### 문제

복합 작업은 종종 여러 종류의 전문성, 도구, 작업 단계가 필요합니다. 단일 모노리식 에이전트는 병목이 되거나 책임이 섞이거나 중간 근거를 잃어버리거나, 검증이 어려운 결과를 만들 수 있습니다. 멀티 에이전트 협업은 명시적 역할 분리와 역할 간 정보 교환 규칙을 통해 이를 완화합니다.

### 사용 시점

- 작업이 하나의 프롬프트나 하나의 도구 사용 에이전트로는 너무 광범위할 때 사용합니다.
- 연구·분석·작성·테스트·리뷰·에스컬레이션처럼 명확한 역할로 분해되는 목적일 때 사용합니다.
- 하위 작업마다 도구, 지식 기반, 정책, 모델 설정이 다를 때 사용합니다.
- 상호 확인, 비평, 토론, 전문가 리뷰로 품질이 높아질 때 사용합니다.
- 일부 작업을 병렬로 수행하고 이후에 통합해야 할 때 사용합니다.
- 역할 단위로 교체·테스트·확장이 가능한 모듈식 에이전트 구성이 필요할 때 사용합니다.

### 사용하지 말아야 할 때

- 단순 1단계 요청에는 사용하지 않습니다.
- 역할 간 구분이 모호해 책임을 명확히 나눌 수 없을 때 피합니다.
- 협업 오버헤드, 지연 시간, 모델 비용이 이점보다 클 때 피합니다.
- 조합 전에 출력을 검증할 구성요소가 없으면 사용하지 않습니다.
- 독립 에이전트가 상충된 목표, 도구, 권한을 가지는데 충돌 해결 규칙이 없으면 피해야 합니다.
- 반복/재귀적 동적 위임은 명시적 반복 제한과 가시성 없이는 피합니다.

### 작동 방식

1. 워크플로가 상위 목표를 수신하고, 멀티 에이전트 처리에 적합한지 확인합니다.
2. 감독자/기획자 또는 고정 워크플로가 목표를 역할별 과업으로 분해합니다.
3. 전문 에이전트가 제한된 입력, 도구, 출력 형식으로 과업을 수행합니다.
4. 에이전트 간 통신은 모호한 자유 형식 문맥이 아니라 구조화된 상태, 메시지, 인계 아티팩트를 통해 이뤄집니다.
5. 통합 단계에서 전문 결과를 합치고 누락/충돌/중복 정보를 정리합니다.
6. 리뷰어/비평 에이전트가 완성본의 완성도, 정합성, 정책 준수, 근거 부재 여부를 점검합니다.
7. 리뷰 승인 시 종료하거나, 한정된 재수정 루프를 돌거나, 사람 검토 플래그로 마무리합니다.

### 트레이드오프

| 이점 | 비용 또는 위험 |
| --- | --- |
| 전문화된 에이전트가 단일 범용 에이전트보다 초점이 맞는 작업을 만듭니다. | 에이전트 수 증가로 오케스트레이션·프롬프트·테스트 복잡도가 늘어납니다. |
| 모듈형 역할은 점검, 교체, 확장을 쉽게 만듭니다. | 인계 규약이 불명확하면 협업이 취약해집니다. |
| 독립 과업을 병렬 처리하면 지연을 낮출 수 있습니다. | 동시 에이전트는 rate limit 압력과 상태 병합 복잡도를 높일 수 있습니다. |
| 리뷰/비평/토론 구조가 환각 및 품질 이슈를 줄입니다. | 비평 루프는 지연을 늘리며, 재시도 상한이 없으면 정체될 수 있습니다. |
| 특정 전문 에이전트 장애가 전체 파이프를 즉시 실패시키지 않습니다. | 누락 산출물은 명확한 대체 정책이 있어야 합니다. |
| 계층적 위임은 명확한 조정 지점을 제공합니다. | 감독자 노드가 병목 또는 단일 실패 지점이 될 수 있습니다. |

### 최소 예시

```text
연구 질문
  -> 감독자가 과업 배정
  -> 연구자: 사실 수집
  -> 분석가: 함의와 위험 식별
  -> 작성자: 전문 결과로 요약문 작성
  -> 리뷰어: 초안 검토
  -> 필요 시 한 번 수정 후 종료 또는 사람 검토 요청
```

### LangGraph 매핑

| 패턴 개념 | LangGraph 요소 |
| --- | --- |
| 상위 목표 | 상태 필드 `input`와 정규화 필드 `objective` |
| 감독자/매니저 에이전트 | 노드 `supervisor_plan` |
| 전문 에이전트 | `research_agent`, `analysis_agent`, `writer_agent` 같은 노드 |
| 구조화된 통신 규약 | 상태 필드 `team_plan`, `agent_messages`, `agent_outputs`, `communication_contract` |
| 순차적 인계 | 한 전문 단계에서 다음 단계로의 일반 간선 |
| 전문 병렬 수행 | `supervisor_plan`에서 독립적인 전문 노드로의 여러 간선 |
| 비평-리뷰 워크플로 | `reviewer_agent` 노드와 조건부 수정 라우팅 |
| 한정된 보정 루프 | `reviewer_agent` -> `revise_draft` 조건부 간선, `retry_count < max_retries` |
| 사람 검토 또는 실패 폴백 | 종단 노드 `mark_needs_human_review` |

## LangGraph 구현 목표

연구 질문 또는 짧은 주제 브리프를 받아, 소규모 전문 에이전트 팀으로 간결한 연구 브리프를 생성하는 `multi_agent_research_team` 예제를 만듭니다. 초기 구현은 고정된 감독자 중심 팀으로 구성해 테스트가 간단하도록 합니다.

- `supervisor_plan`은 각 역할의 과업 계약과 예상 출력 형식을 정의합니다.
- `research_agent`는 주어진 주제와 선택적 소스 자료에서 사실 기반 요약/추출을 수행합니다.
- `analysis_agent`는 함의, 리스크, 트레이드오프, 미해결 이슈를 식별합니다.
- `writer_agent`는 전문 결과물을 일관된 짧은 브리프 문서로 바꿉니다.
- `reviewer_agent`는 초안을 전문 결과물과 대조해 승인하거나 수정 가능한 피드백을 남깁니다.

이 예제는 멀티 에이전트 협업 자체를 보여줘야 하며, 일반적인 단일 체인처럼 동작하면 안 됩니다. 각 에이전트는 고유한 역할을 갖고, 필요한 맥락만 받아들이며, 각자의 출력 필드를 채우고, 상태에 감사 가능한 메시지/아티팩트를 남겨야 합니다. 테스트는 네트워크/API 키 없이 동작하도록 결정론적 가짜 모델 함수를 사용합니다.

## 상태 형태

그래프가 필요로 하는 상태 필드를 나열합니다.

| 필드 | 타입 | 목적 |
| --- | --- | --- |
| `input` | `str` | 원래 사용자 연구 질문 또는 작업 설명입니다. |
| `objective` | `str` | 감독자와 전문 에이전트가 사용하는 정규화된 목표입니다. |
| `source_material` | `str \| None` | 사용자 제공 텍스트(선택). 연구 에이전트가 근거로 사용할 수 있는 자료입니다. |
| `team_plan` | `list[dict[str, Any]]` | 역할별 과업(역할명, 업무, 기대 출력, 의존성)을 담은 감독자 생성 계획. |
| `communication_contract` | `dict[str, Any]` | 에이전트 출력 스키마/인계 규칙(필수 필드, 인용/근거 요건 포함). |
| `agent_messages` | `list[dict[str, Any]]` | 에이전트 입력·출력·인계 노트를 순서대로 또는 reducer로 누적한 추적 목록입니다. |
| `agent_outputs` | `dict[str, Any]` | 에이전트명 키 기반 통합 출력. |
| `research_findings` | `list[dict[str, str]]` | `research_agent`가 만든 사실 탐색 결과/근거 노트. |
| `analysis_findings` | `list[dict[str, str]]` | `analysis_agent`가 만든 함의, 위험, 트레이드오프, 미해결 항목. |
| `context_bundle` | `dict[str, Any]` | 작성자에게 전달할 통합 전문 결과물. |
| `draft_report` | `str \| None` | 리뷰 전 작성자 초안. |
| `review_result` | `dict[str, Any] \| None` | 리뷰어 판정, 이슈, 근거 없는 주장, 누락 항목, 승인 여부. |
| `revision_notes` | `list[str]` | `revise_draft`에서 활용할 실행 가능한 수정 노트. |
| `retry_count` | `int` | 지금까지 수행한 초안 수정 횟수. |
| `max_retries` | `int` | 리뷰 주도 수정 상한 값. |
| `errors` | `list[dict[str, str]]` | 검증, 에이전트, 파싱, 모델 호출 등의 복구 가능한 오류. |
| `requires_human_review` | `bool` | 자동 협업으로 안전하게 완료할 수 없어 중단되었는지 표시. |
| `status` | `str` | 워크플로 상태: `ok`, `needs_revision`, `needs_human_review`, `failed`. |
| `final_output` | `dict[str, Any] \| None` | 사용자 결과: 상태, 최종 브리프, 리뷰 메타데이터, 핵심 에이전트 추적 정보. |
| `metadata` | `dict[str, Any]` | 모델명, 시간, 실행 ID, 기능 플래그, 테스트 오버라이드 등 선택적 메타 정보. |

병렬 노드는 서로 다른 상태 키를 쓰거나 `agent_messages`, `errors`처럼 reducer 기반 리스트 필드를 사용해 공유 추적을 안전하게 기록해야 합니다.

## 노드

| 노드 | 책임 |
| --- | --- |
| `prepare_objective` | 빈 입력 검사, 목표 정규화, 기본 상태 초기화, 지원되지 않는 설정을 거부합니다. |
| `supervisor_plan` | 역할 과업, 의존성, 기대 출력 스키마, 통신 규칙이 있는 팀 계획을 생성합니다. |
| `validate_team_plan` | 계획에 허용되지 않은 에이전트가 있는지, 순환 의존성 여부, 연구/분석/작성/리뷰 필수 과업 포함 여부를 확인합니다. |
| `research_agent` | `objective` 및 `source_material`에서 사실 기반 결과를 만들고 근거 노트를 포함하며 임의 발명을 피합니다. |
| `analysis_agent` | 입력 과 `research` 결과에서 함의, 위험, 트레이드오프, 미해결 질문을 추출합니다. |
| `synthesize_context` | 전문 결과물을 `context_bundle`로 통합하고, 누락·충돌 정보를 탐지해 작성자 컨텍스트를 준비합니다. |
| `writer_agent` | `context_bundle`와 과업 계약만 사용해 간결한 연구 브리프를 작성합니다. |
| `reviewer_agent` | 초안의 완성도, 정합성, 근거 없는 주장, 누락된 필수 섹션, 전문 결과물 정합성을 점검합니다. |
| `revise_draft` | 리뷰어 노트 적용으로 수정 초안을 생성하고 `retry_count`를 증가시킵니다. |
| `finalize` | 리뷰 승인 시 `final_output`을 생성합니다. |
| `mark_needs_human_review` | 필수 출력 누락, 충돌 미해결, 수정 한도 초과 시 안전하게 정지합니다. |
| `handle_failure` | 잘못된 입력, 잘못된 계획, 복구 불가 런타임 오류, 상태 손상 시 제어된 실패 결과를 만듭니다. |

## 엣지

조건부 분기를 포함해 그래프 흐름을 정의합니다.

```text
START -> prepare_objective -> supervisor_plan -> validate_team_plan

validate_team_plan -> research_agent
validate_team_plan -> analysis_agent

research_agent -> synthesize_context
analysis_agent -> synthesize_context

synthesize_context -> writer_agent -> reviewer_agent

reviewer_agent -> finalize -> END
reviewer_agent -> revise_draft -> reviewer_agent
reviewer_agent -> mark_needs_human_review -> END

prepare_objective -> handle_failure -> END
validate_team_plan -> handle_failure -> END
synthesize_context -> mark_needs_human_review -> END
```

조건부 엣지 요구사항:

- `prepare_objective`에서 입력이 비어있거나 설정이 유효하지 않으면 `handle_failure`로 이동합니다.
- `validate_team_plan`에서 알 수 없는 에이전트, 필수 역할 누락, 스키마 손상, 순환 의존성이 있으면 `handle_failure`로 이동합니다.
- `research_agent`와 `analysis_agent`는 객관 정보와 선택적 소스 기준으로 동시에 독립 실행할 수 있습니다.
- `synthesize_context`에서 필수 전문 출력 누락/충돌/약한 근거로 초안이 불가하면 `mark_needs_human_review`로 이동합니다.
- `reviewer_agent`는 초안이 승인되면 `finalize`로 이동합니다.
- `reviewer_agent`는 실행 가능한 이슈가 있고 `retry_count < max_retries`면 `revise_draft`로 이동합니다.
- `reviewer_agent`는 재시도 초과 또는 미해결 위험 이슈에서 `mark_needs_human_review`로 이동합니다.

## 입력과 출력

- 입력: 연구 질문 또는 브리프 주제, 선택적으로 `source_material`, `max_retries`, 모델/테스트 구성.
- 출력: `final_output`으로, JSON 호환 딕셔너리에 `status`, 최종 연구 브리프, 핵심 에이전트 결과, 리뷰 상태, 추적 메타데이터를 포함.
- 중간 산출물: 정규화된 목표, 팀 계획, 통신 계약, 전문 결과, 컨텍스트 묶음, 초안, 리뷰 결과, 수정 노트, 에이전트 메시지, 복구 가능한 오류.

예시 입력 형태:

```json
{
  "input": "Prepare a concise research brief on the benefits and risks of using AI coding assistants in a small engineering team.",
  "source_material": "Internal pilot notes and public vendor documentation are available."
}
```

성공 출력 예시:

```json
{
  "status": "ok",
  "brief": "A concise research brief generated from specialist outputs.",
  "review": {
    "approved": true,
    "issues": []
  },
  "agents": {
    "research_agent": "completed",
    "analysis_agent": "completed",
    "writer_agent": "completed",
    "reviewer_agent": "approved"
  }
}
```

## 실패 사례

예상 실패, 재시도, 폴백 동작, 사람 검토 지점을 문서화합니다.

- 공백 입력은 `prepare_objective`에서 모델 호출 없이 실패해야 합니다.
- 감독자 계획에 알 수 없는 에이전트명, 순환 의존성, 필수 역할 누락, 스키마 손상이 있으면 `handle_failure`로 라우팅합니다.
- 전문 에이전트가 잘못된 출력형식을 내면 `errors`에 기록하고, 필수 출력 누락일 경우 임의 생성 대신 `mark_needs_human_review`로 이동합니다.
- 전문 간 충돌은 `context_bundle`에 보존하고 리뷰어가 해결하거나 사람 검토로 에스컬레이션해야 합니다.
- 작성자는 `research_findings`/`analysis_findings`를 벗어난 근거 없는 주장을 만들어선 안 됩니다. 리뷰어는 이를 잡아 수정 라우팅해야 합니다.
- 리뷰 재거부가 반복되면 `max_retries`에서 중단하고 `status`를 `needs_human_review`로 설정합니다.
- 병렬 전문 분기에서 서로의 출력이 덮어쓰지 않거나 공유 상태에 안전하게 append해야 합니다.
- 모델/도구/파싱 오류는 에이전트명과 함께 `errors`에 기록되고 최종 출력에 노출되어야 합니다.
- 고위험 주제, 정책 민감 추천, 외부 검증이 필요한 출력은 `requires_human_review = true`로 설정해야 합니다.
- 이후 동적 위임을 추가할 경우 무한 위임/비용 폭증을 막는 엄격한 상한이 필요합니다.

## 테스트 아이디어

- 정상 경로에서 최종 브리프가 생성되고 감독자·연구자·분석자·작성자·리뷰어의 완료 상태가 기록되는지 검증합니다.
- `prepare_objective`가 빈 입력을 특수 모델 호출 없이 거부하는지 검증합니다.
- `validate_team_plan`이 알 수 없는 에이전트명을 거부하고 `handle_failure`로 라우팅하는지 검증합니다.
- `research_agent`와 `analysis_agent`가 서로 다른 상태 키를 쓰며 fan-out/fan-in 중 충돌하지 않는지 검증합니다.
- 필수 전문 결과 누락 시 `mark_needs_human_review`로 이동하는지 검증합니다.
- 리뷰어 승인 시 `finalize`로 이동하는지 검증합니다.
- 리뷰어 거부 후 `revise_draft`로 수정 후 승인되면 최종화하는지 검증합니다.
- 재시도 제한 초과 후 리뷰 요청으로 상태가 바뀌는지 검증합니다.
- 초안의 근거 없는 주장들이 `review_result.issues`로 남는지 검증합니다.
- 최종 상태에 항상 `status`, `final_output`, `agent_outputs`, `agent_messages`, `errors`가 있는지 검증합니다.
- 단위 테스트가 네트워크 없이 가짜 모델 함수만으로 결정론적으로 동작하는지 검증합니다.
