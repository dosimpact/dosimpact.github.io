---
sidebar_position: 3
---

# 3: Parallelization (ko)

## 패턴 요약

Parallelization은 독립적인 워크플로우 구성요소를 순차적으로 기다리지 않고 동시에 실행
- 요청이 여러 하위 작업으로 분해되고 각 하위 작업이 즉시 결과를 서로 필요로 하지 않을 때 유용하다
- (LLM 호출, 도구 호출, API 요청, DB 조회, 콘텐츠 생성 브랜치, 검증 체크, 모달리티별 프로세서 등).

- 이 패턴은 총 처리 시간이 아닌 병렬한 가장 긴 브랜치 기준 시간을 줄여 지연시간을 낮춘다.
- 다만 병렬 분기 결과를 합치기, 검증, 순위화, 통합하기 위한 순차적 수렴 단계는 필요
- 장에서는 비동기 실행이 동시성/반응성을 제공해 대기 작업에서 유리하나 CPU 병렬화와 동일한 개념은 아님을 강조한다.

각 독립 연산의 결과를 후행 집계 단계에서 모아야 하는 워크플로에서 사용한다. 의존성이 있는 단계나, 병렬 처리로 인해 복잡성/비용/디버깅 난이도/로그 추적이 커지는 경우에는 사용하지 않는다.

## 패턴 설명

### 문제

에이전트 시스템은 LLM, API, 검색기, 데이터베이스, 도구 같은 외부 호출에서 대기 시간이 많이 발생
- 독립 호출을 순차로 실행하면 불필요한 지연 발생.
- 병렬 처리하면 독립 작업을 동시에 처리하고 합성 단계에서 출력물을 결합해 시간을 줄인다.

### 개념 개요

Parallelization은 에이전트 워크플로의 독립 부분을 동시에 실행
- 한 LLM 호출이 끝날 때까지 다른 관련 없는 호출을 기다리지 않고, 그래프를 여러 브랜치로 확장한 뒤 다시 합쳐 통합한다.
- 핵심은 독립성이다. 한 브랜치가 시작되기 위해 다른 브랜치 결과를 기다릴 필요가 없어야 한다. 의존성이 있으면 순차 처리한다.


### 사용해야 할 때

- 동일한 입력에서 여러 하위 작업이 시작될 수 있을 때
- 브랜치 출력들이 독립적이면서도 후속 합성 단계에서 모두 유용할 때
- 지연이 중요하고 브랜치 작업이 I/O 바운드일 때
- 서로 다른 전문화된 분석자가 같은 문제를 다른 관점에서 볼 때

### 사용하지 말아야 할 때

- 각 단계가 이전 단계 출력에 의존할 때는 피한다.
- 병렬 호출이 rate limit이나 비용을 초과시킬 수 있을 때 피한다.
- 상태 병합 규칙이 불명확할 때 피한다.
- 병렬 오류 처리 디버깅 비용이 절감 이득보다 클 때 피한다.

### 작동 방식

1. 워크플로가 공유 입력 상태를 검증하고 초기화한다.
2. 그래프가 독립 브랜치 노드로 fan-out한다.
3. 각 브랜치는 공유 입력을 읽고 브랜치명으로 구분되는 staging 상태에 결과를 기록한다.
4. 브랜치 완료 후 명시적인 수집 노드로 fan-in한다.
5. 합성 노드는 수집된 출력물을 합치고, 누락 분기 처리, 누락 데이터 표시를 한다.

### 트레이드오프

| 이점 | 비용 또는 위험 |
| --- | --- |
| 독립 I/O 바운드 작업의 벽시계 지연을 줄인다. | 동시에 모델/도구를 더 많이 사용해 rate limit 압박이 커질 수 있다. |
| 다중 관점 분석을 가능하게 한다. | 상태 병합 규칙이 명확해야 한다. |
| 하나의 분기 실패해도 성공한 결과는 보존할 수 있다. | 관측성/디버깅이 순차 체인보다 복잡하다. |

### 최소 예시

```text
주제
  -> 주제 요약 생성
  -> 질문 생성
  -> 핵심 용어 추출
  -> 모든 브랜치 출력 통합
```

### LangGraph 매핑

| 패턴 개념 | LangGraph 요소 |
| --- | --- |
| 공유 입력 | 상태 필드 `input` |
| Fan-out | `fan_out_branches` 노드에서 여러 브랜치 노드로의 다중 엣지 |
| 독립 브랜치 | `summarize_topic`, `generate_questions`, `extract_key_terms` 노드 |
| 동시성 안정 출력 | dictionary merge reducer를 사용하는 브랜치명 기반 `branch_outputs` 상태 |
| Fan-in | 브랜치 노드가 `collect_branch_outputs`로 수렴한 뒤 `synthesize_answer`로 이동 |
| 부분 실패 정책 | `branch_errors`와 합성 노드의 조건부 처리 |

## LangGraph 구현 목표

`parallel_topic_analyzer`라는 LangGraph 예제를 만들어 사용자 주제를 입력받아 세 독립 분석 브랜치를 동시에 실행한다.

- 주제의 간결한 요약 생성
- 주제에 대한 추후 질문 생성
- 주제의 핵심 용어 추출

모든 브랜치 완료 후 합성 노드에서 브랜치 결과와 원래 주제를 하나의 구조화 응답으로 결합한다. 이 예제는 일반 순차 체인 대신 LangGraph fan-out/fan-in 토폴로지를 보여야 한다. 테스트는 결정론적 fake 모델/도구 함수를 사용해 네트워크나 API 키가 필요 없게 한다.

브랜치 독립성은 명시적이어야 한다. 각 병렬 노드는 원본 입력만 읽고, 성공 또는 실패 결과를 `branch_outputs[branch_name]`에 기록한다. 수집 노드는 여기서 `summary`, `questions`, `key_terms`, `completed_branches`, `branch_errors` 같은 사용자 지향 필드를 파생한다. 합성 노드는 이 fan-in 지점에서 가용 브랜치 출력이 정리된 뒤 실행되어야 한다.

## 상태 형태

그래프가 필요로 하는 상태 필드를 정리한다.

| 필드 | 타입 | 목적 |
| --- | --- | --- |
| `input` | `str` | 원본 사용자 주제/작업 설명. |
| `branch_outputs` | `dict[str, BranchResult]` | 브랜치명으로 구분되는 내부 staging 영역. dictionary merge reducer를 사용해 형제 브랜치 결과가 서로 덮어쓰지 않도록 한다. |
| `summary` | `str \| None` | 요약 브랜치가 만든 간결 요약. |
| `questions` | `list[str]` | 질문 브랜치가 만든 후속 질문 목록. |
| `key_terms` | `list[str]` | 핵심 용어 추출 브랜치 결과. |
| `branch_errors` | `list[dict]` | `branch_outputs`에서 파생되는 브랜치별 복구 가능한 오류(브랜치명, 메시지, 시도 횟수 포함). |
| `started_at` | `float \| None` | 전체 지연 측정을 위한 시작 타임스탬프. |
| `completed_branches` | `list[str]` | `branch_outputs`의 성공 결과에서 파생되는 완료 브랜치명. |
| `final_answer` | `str \| None` | fan-in 뒤의 최종 통합 응답. |
| `metadata` | `dict` | run ID, 타임아웃 값, 경과 시간 등 런타임 메타데이터. |

동적 fan-out 변형을 구현한다면 다음을 추가한다.

| 필드 | 타입 | 목적 |
| --- | --- | --- |
| `tasks` | `list[dict]` | 계획 노드가 생성한 독립 작업 명세. |
| `branch_results` | `list[dict]` | 동적 브랜치 결과의 reducer 기반 컬렉션. |

## 노드

| 노드 | 책임 |
| --- | --- |
| `initialize` | 입력 주제를 정규화하고 빈 결과/오류 필드를 초기화하며 런타임 메타데이터를 부착한다. |
| `fan_out_branches` | fan-out 지점을 Studio 그래프와 Trace에서 명확히 보이게 하는 no-op marker 노드. |
| `summarize_topic` | LLM 또는 결정론적 테스트 더블로 `input`에서 간결 요약 생성; 결과를 `branch_outputs["summary"]`에 기록. |
| `generate_questions` | LLM 또는 결정론적 테스트 더블로 `input`에서 후속 질문 생성; 결과를 `branch_outputs["questions"]`에 기록. |
| `extract_key_terms` | LLM 또는 결정론적 테스트 더블로 `input`에서 핵심 용어 추출; 결과를 `branch_outputs["key_terms"]`에 기록. |
| `collect_branch_outputs` | 명시적 fan-in 노드. `branch_outputs`에서 `summary`, `questions`, `key_terms`, `completed_branches`, `branch_errors`를 파생한다. |
| `synthesize_answer` | 수집된 브랜치 결과를 구조화된 응답으로 통합하고, 실패 브랜치의 누락 값을 명시 표시한다. |
| `handle_failure` | 필요 브랜치 실패, 입력 무효, 안전한 합성이 어려운 상황에서 제어된 오류 출력 생성. |

동적 변형(옵션):

| 노드 | 책임 |
| --- | --- |
| `plan_parallel_tasks` | 입력을 독립 작업 명세로 변환하고 상호 의존성이 있는 계획은 거부. |
| `run_parallel_task` | 작업 명세 하나당 동적 브랜치 실행 후 `branch_results`에 결과 추가. |

## 엣지

그래프 흐름을 조건부 분기 포함해 설명한다.

```text
START -> initialize

initialize -> fan_out_branches

fan_out_branches -> summarize_topic
fan_out_branches -> generate_questions
fan_out_branches -> extract_key_terms

summarize_topic -> collect_branch_outputs
generate_questions -> collect_branch_outputs
extract_key_terms -> collect_branch_outputs

collect_branch_outputs -> synthesize_answer

synthesize_answer -> END
```

필수 조건부 동작:

- `initialize`가 비어 있거나 잘못된 주제를 받으면 `handle_failure`로 이동.
- 브랜치 하나가 recoverable 오류로 실패하면 해당 브랜치의 `branch_outputs` 항목에 오류를 기록하고 fan-in은 허용.
- 필수 브랜치 누락으로 안전한 부분 합성이 불가하면 `synthesize_answer`에서 `handle_failure`로 이동.
- 필수 브랜치 결과가 모두 있으면 `synthesize_answer`에서 `END`로 이동.

동적 fan-out 변형:

```text
START -> initialize -> plan_parallel_tasks
plan_parallel_tasks -> run_parallel_task for each task in tasks
run_parallel_task -> synthesize_answer
synthesize_answer -> END
```

## 입력과 출력

- 입력: `"The history of space exploration"` 같은 주제 문자열이나 도메인 연구 질문.
- 출력: 요약, 관련 질문, 핵심 용어, 간단한 통합 결론을 포함한 구조화 응답.
- 중간 산출물:
  - 브랜치별 프롬프트/작업 명세
  - raw 브랜치 출력
  - 브랜치 완료 메타데이터
  - 브랜치 오류 기록
  - 독립 브랜치 실행이 실제로 동시였음을 보여주는 시간 데이터(선택)

예시 입력 형태:

```json
{
  "input": "The history of space exploration"
}
```

## 실패 사례

예상 실패, 재시도, 폴백 동작, 인간 검토 포인트를 문서화한다.

- 빈 문자열 또는 너무 짧은 입력은 fan-out 전에 실패하고 검증 오류 반환.
- 브랜치 타임아웃은 `branch_errors`에 기록; 멱등이고 재시도 예산이 있으면 한 번 재시도.
- 한 브랜치의 모델/도구 오류가 다른 브랜치 결과를 자동 폐기하지 않도록 한다.
- 합성 노드는 누락 데이터를 임의로 생성하지 않는다. 부분 합성이 허용된다면 누락 섹션을 명시.
- 병렬 실행 중 동일 키에 대한 동시 쓰기는 병합 충돌을 유발할 수 있다. 병렬 노드는 reducer-backed `branch_outputs` dictionary 아래의 브랜치별 항목에 기록한다.
- Studio thread 또는 checkpoint를 재사용할 때 이전 실행의 stale branch output이 현재 합성에 섞이지 않아야 한다. 브랜치 결과에 run ID를 포함하고 수집 단계에서 필터링한다.
- rate limit/API 장애는 순차 실행보다 병렬 실행을 더 취약하게 만들 수 있다. 구현에서 동시성 제한, 타임아웃, 재시도 예산을 설정 가능해야 한다.
- 실제로 독립적이지 않은 브랜치는 병렬 실행하면 안 된다. 동적 변형에서는 의존 관계는 순차로 두거나 계획 단계에서 거부.
- 병렬 실패가 발생하면 브랜치명/시작-종료 상태/오류 메타데이터를 로그로 남긴다.
- 대형 영향 응답에서 일부 출력만 사용한 합성이나 브랜치 간 충돌 시 인간 검토가 필요하다.

## 테스트 아이디어

- 정상 경로: 세 브랜치 모두 완료되고 `final_answer`가 `summary`, `questions`, `key_terms`를 반영하는지 검증.
- fan-out/fan-in 토폴로지: mocked 브랜치 함수들이 같은 초기 상태에서 겹치는 실행 구간 또는 병렬적 호출 기록을 갖는지 검증.
- 빈 입력이 branch 실행 없이 `handle_failure`로 라우팅되는지 검증.
- 한 브랜치 실패가 recoverable일 때도 다른 브랜치 결과를 유지하고 `branch_errors`를 기록하는지 검증.
- 부분 합성이 비활성일 때 필수 브랜치 실패가 `handle_failure`로 가는지 검증.
- 동시 상태 병합에서 `branch_outputs`의 형제 브랜치 항목이 덮어써지지 않는지 검증.
- 이전 실행의 stale `branch_outputs` 항목이 합성에서 무시되는지 검증.
- 동적 fan-out 구현 시 `run_parallel_task`가 독립 작업명세당 한 번씩 실행되고 결과가 집계되는지 검증.
- 최종 상태에 `input`, 브랜치 출력, `completed_branches`, `branch_errors`, `final_answer`가 포함되는지 검증.
- 테스트가 fake LLM/도구로 실행되어 네트워크/키가 필요하지 않음.

## 열린 질문

- TOC는 Chapter 3을 논리 페이지 `43-57`로 표시하지만 추출 본문은 PDF 파일 페이지 50-64에 있다. 문서에서는 TOC 논리 범위를 계속 인용하면서 추출 노트를 함께 남겨야 한다.
- 장의 소스는 LangGraph 코드보다 개념과 LangChain LCEL, Google ADK 예제를 보여준다. 따라서 LangGraph 상세 구현은 패턴에서 도출되어야 한다.
- 고정된 3개 브랜치 분석기와 동적 작업 계획 버전 중 무엇부터 구현할지 결정 필요. 고정형이 테스트는 쉬우며 동적형이 확장성과 팬아웃 시연에 유리.
- 한 브랜드가 실패했을 때 부분 합성을 허용할지, 아니면 모든 브랜치 완료를 필수로 할지 결정 필요.
