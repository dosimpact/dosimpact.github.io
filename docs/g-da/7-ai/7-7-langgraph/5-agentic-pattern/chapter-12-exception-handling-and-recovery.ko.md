---
sidebar_position: 12
---

# 요구사항: 12장 예외 처리와 복구

## 출처

- PDF: `Agentic_Design_Patterns.pdf`
- 섹션: `Chapter 12: Exception Handling and Recovery`
- 페이지 범위: `182-189` (`docs/agentic-design-patterns-toc.md`의 논리 페이지)
- 추출 참고: Chapter 12의 실제 헤딩은 PDF 라벨 `196` / 0 기반 인덱스 `195`에서 발견되었고, Chapter 13은 PDF 라벨 `204` / 0 기반 인덱스 `203`에서 시작합니다. 따라서 추출된 Chapter 12 범위는 PDF 인덱스 `195-202`, 파일 페이지 `196-203`, 챕터 내부 페이지 `1-8`입니다. TOC의 논리 범위 `182-189`도 8페이지지만 PDF 라벨과는 14페이지 차이가 있어 모호성이 있습니다.

## 패턴 요약

예외 처리와 복구(Exception Handling and Recovery)는 에이전트가 도구 실패, 서비스 오류, 입력 형식 문제, 환경 변화 같은 상황에 직면해도 중단되지 않고 계속 동작하게 만드는 패턴입니다. 챕터는 이 패턴을 단순 에러 핸들링이 아니라, 오류를 감지하고, 적절히 처리하며, 안전한 상태로 복구해 최종적으로 안정적으로 멈추는 흐름으로 설명합니다.

챕터의 구성은 세 단계로 나뉩니다: 오류 탐지, 오류 처리, 복구. 탐지에서는 도구 출력 검증, 상태 코드 확인, 타임아웃 감시, 비논리적 응답 탐지를 다룹니다. 처리는 로깅, 재시도 횟수 제한, 대체 전략, 점진적 성능 저하(degradation), 알림을 포함합니다. 복구는 롤백, 진단, 자기 수정(self-correction), 재계획, 사람/상위 시스템 에스컬레이션입니다.

LangGraph 구현 예제에서는 위치 조회 워크플로를 기반으로, 기본 정밀 조회(primary lookup) 실패 시 로그/진단을 남기고, 필요한 경우에만 재시도한 뒤 지역 조회(fallback)로 전환하고, 복구된 결과 또는 통제된 실패를 명확히 설명하는 최종 응답을 반환합니다.

## 패턴 설명

### 개념 개요

도구와 외부 서비스를 호출하는 에이전트는 결국 실패를 만납니다. 위치 API가 불안정하거나, DB 타임아웃이 발생하거나, 웹 페이지가 변경되거나, 모델이 잘못된 형식의 응답을 할 수 있습니다. 예외 처리와 복구는 문제를 감지하고 격리해 다음 안전 동작을 선택하게 해줍니다.

이 패턴은 단순히 코드 예외를 잡는 것이 아니라, 운영적 무결성을 유지하는 데 초점을 둡니다. 어떤 단계가 실패했는지, 일시적 오류인지 치명적 오류인지 구분하고, 복구 경로를 정한 뒤 사용자에게 현재 상태를 투명하게 전달해야 합니다.

### 문제

에이전트가 모든 단계에서 도구 호출/모델 응답이 정상일 것이라 가정하면, 한 번의 오류가 워크플로를 중단하거나 무의미한 무한 재시도를 유발하거나, 원인 은폐/잘못된 결과로 이어집니다.

이 패턴은 실패 상태를 그래프의 1급 상태로 다뤄 해결합니다. 어떤 일이 발생했는지 기록하고, 오류 유형에 따라 분기하며, 제한된 복구 동작을 수행하고, 복구 불가 시 명시적으로 에스컬레이션/품질 저하 처리합니다.

### 사용해야 할 때

- 도구, API, DB, 장치, 브라우저 등 외부 시스템 의존성이 큰 워크플로.
- 자동화보다 안정성/복원력이 중요한 경우.
- 실패를 일시적(transient), 입력 관련(invalid_input), 미사용 가능(service_unavailable), 부분 실패(partial), 중대 오류(severe)로 분류할 수 있을 때.
- 정밀 조회 실패 시에도 범용 지역 정보 제공이 가능한 경우.
- 사용자에게 성공/실패 및 조치 이력을 설명해야 하는 경우.
- 로그·진단·알림·에스컬레이션 기록이 추후 분석/운영에 필요한 경우.
- 실패 후 재분류·재계획으로 다음 시도를 개선하고 싶은 경우.

### 사용하지 말아야 할 때

- 의미 있는 외부 실패 모드가 거의 없는 단순 결정형 흐름.
- 비일시적 오류(무효한 자격 증명, 잔고 부족, 영업 종료 등)에 대해 자동 재시도만 수행하는 경우.
- 사용자 동의 없는 폴백으로 요청 내용을 은근히 변경할 때.
- 재시도 횟수를 제한하지 않아 루프 위험이 커지는 경우.
- 충분한 진단 정보 없이 자기 교정(self-correction)만 수행할 때.
- 본래 작업이 실패했는데 성공처럼 보이게 완화 결과만 반환할 때.

### 동작 방식

1. 사용자 요청을 검증하고 실패 추적 상태를 초기화합니다.
2. 기본 액션(대부분 툴 호출)을 실행합니다.
3. 예외, 상태코드, 타임아웃, 빈 결과, 잘못된 출력, 의심스러운 콘텐츠를 통해 오류를 탐지합니다.
4. 실패한 작업, 오류 카테고리, 메시지, 재시도 횟수를 상태에 기록합니다.
5. 조건 분기에서 다음 액션을 선택합니다: 성공 반환, 일시적 오류 재시도, 폴백, 완만한 품질 저하, 알림, 에스컬레이션.
6. 마지막 정상 데이터 유지, 부분 결과 롤백, 계획 조정, 또는 폴백 호출로 안정 상태를 복구합니다.
7. 최종적으로 사용자 응답과 복구 경로를 감사 가능한 형태로 마무리합니다.

### 트레이드오프

| 장점 | 비용/위험 |
| --- | --- |
| 실제 환경 장애에서 에이전트가 갑자기 멈추지 않습니다. | 모든 도구 의존 흐름에 상태·분기·테스트가 추가됩니다. |
| 운영 실패를 로그와 구조화 상태로 가시화할 수 있습니다. | 로깅 설계가 잘못되면 민감 정보 노출 또는 과도한 알림이 생깁니다. |
| 제한된 재시도/폴백으로 가치 회복이 가능합니다. | 잘못된 재시도는 비용과 지연, 외부 부하를 증가시킵니다. |
| 완전 성공이 어려운 경우에도 완만한 품질 저하를 제공합니다. | 사용자에게 폴백 결과가 분명히 설명되지 않으면 오해가 생깁니다. |
| 심각한 경우 사람 또는 상위 시스템으로 에스컬레이션할 수 있습니다. | 에스컬레이션은 그래프 외부 운영 프로세스 정비가 필요합니다. |
| 반성/재계획 루프와 결합 가능. | 진단이 약하면 자기 수정이 오히려 문제를 악화시킬 수 있습니다. |

### 최소 예시

```text
사용자가 주소에 대한 정밀 정보 요청
  -> 주소 요청 검증
  -> precise_location_lookup 호출
  -> 정밀 조회 성공: 정확한 결과 포맷
  -> 타임아웃/서버 오류이고 재시도 가능: 한 번 재시도
  -> 여전히 실패: city 추출 후 general_area_lookup 호출
  -> 폴백 성공: 일반 지역 데이터만 존재함을 설명
  -> 폴백 실패 또는 입력 불가: 에스컬레이션 또는 통제된 실패 반환
```

### LangGraph 매핑

| 패턴 개념 | LangGraph 요소 |
| --- | --- |
| 사용자 과제 및 현재 상태 | `input`, `normalized_query`, `address`, `city` |
| 오류 탐지 | `call_precise_lookup` 노드에서 툴 예외 포착 및 결과 검증 |
| 오류 분류 | `diagnose_failure` 노드에서 `error_category`, `recovery_action` 설정 |
| 로그/진단 | `tool_errors`, `event_log`, `last_error` |
| 제한된 재시도 | `diagnose_failure`에서 `retry_count < max_retries`일 때 `retry_precise_lookup`로의 조건부 간선 |
| 폴백 | `call_general_area_lookup` 노드 및 `fallback` 조건 분기 |
| 완만한 저하 응답 | `compose_degraded_response` 노드 (`fallback` 결과만 사용) |
| 에스컬레이션/알림 | `mark_for_review` 노드 (심각/반복/복구 불가 시) |
| 안정적 마무리 | `finalize_response` 노드가 `final_output` 생성 (상태·복구 메타데이터 포함) |

## LangGraph 구현 목표

정교한 위치 정보 보조 에이전트를 LangGraph로 구현합니다. 사용자 자연어 질의에 대해 우선 정밀 조회를 시도하고, 실패하면 분류 후 제한된 재시도, 폴백으로 이동합니다. 최종적으로 정밀 결과 성공, 제한된 폴백 성공, 또는 통제된 실패/리뷰 플래그를 반환해야 합니다.

이 구현은 외부 실제 서비스를 사용하지 않습니다. 정밀/일반 조회 도구는 주입 가능(mock/fake)으로 두어 테스트에서 성공·타임아웃·형식 오류·미발견·서비스 불가 케이스를 재현할 수 있어야 합니다.

예상 출력:

- 정밀 조회 성공은 정확한 위치 결과 반환.
- 일시적 1차 실패는 최대 1회 재시도.
- 비일시적 실패는 재시도 건너뛰고 폴백 또는 리뷰 처리.
- 폴백 성공 시에는 정밀이 아님을 명시한 완만한 응답.
- 반복/중대 실패는 통제된 실패 응답과 리뷰 마커.
- 최종 상태는 관측 가능한 진단 정보를 포함.

## 상태 형태

필요한 상태 필드:

| 필드 | 타입 | 목적 |
| --- | --- | --- |
| `input` | `str` | 원본 사용자 위치 요청 |
| `normalized_query` | `str` | 정규화된 질의 |
| `address` | `str \| None` | 정밀 조회용 주소/장소 문자열 |
| `city` | `str \| None` | 폴백에 사용할 도시/지역 |
| `primary_result` | `dict[str, Any] \| None` | 정밀 조회 결과 |
| `fallback_result` | `dict[str, Any] \| None` | 일반 지역 조회 결과 |
| `location_result` | `dict[str, Any] \| None` | 최종 응답에 사용할 최적 결과 |
| `primary_location_failed` | `bool` | 정밀 조회 실패 또는 부적절한 결과 여부 |
| `fallback_location_failed` | `bool` | 폴백 조회 실패 또는 부적절한 결과 여부 |
| `last_error` | `dict[str, Any] \| None` | 최근 오류(작업, 카테고리, 메시지, 재시도 가능 여부) |
| `tool_errors` | `list[dict[str, Any]]` | 발생한 도구 오류/검증 실패 이력 |
| `event_log` | `list[dict[str, Any]]` | 탐지·처리·복구·에스컬레이션 결정 추적 |
| `retry_count` | `int` | 수행한 정밀 조회 재시도 횟수 |
| `max_retries` | `int` | 최대 재시도 수(예제 기본값 1) |
| `error_category` | `str \| None` | `transient`, `not_found`, `invalid_input`, `malformed_output`, `service_unavailable`, `severe` |
| `recovery_action` | `str \| None` | `return_primary`, `retry`, `fallback`, `degrade`, `review`, `fail` |
| `needs_human_review` | `bool` | 리뷰/에스컬레이션 필요 여부 |
| `final_output` | `dict[str, Any] \| None` | 상태, 성공 여부, 결과 출처, 복구 경로, 진단 요약 |

## 노드

| 노드 | 책임 |
| --- | --- |
| `prepare_request` | 빈 입력 검증, 공백 정규화, 재시도/플래그/로그 초기화 |
| `parse_location_query` | 사용자 요청에서 주소와 상위 지역 추출 |
| `call_precise_lookup` | 정밀 조회 툴 호출, 예외 포착, 결과 검증, 성공/실패 상태 저장 |
| `diagnose_failure` | 실패 결과 분류 후 복구 액션 선택 |
| `retry_precise_lookup` | 재시도 횟수 증가 후 정밀 조회로 되돌림 |
| `call_general_area_lookup` | `city` 기준 폴백 조회 호출 및 검증 |
| `select_recovered_result` | 정밀 결과 우선 선택, 없으면 폴백(감점) 결과 선택 |
| `mark_for_review` | 중대/반복/복구 불가 실패를 리뷰 마커로 전환 |
| `finalize_response` | 최종 상태/메시지/복구 경로/진단 요약 구성 |

## 간선

그래프 흐름(조건 분기 포함):

```text
START
  -> prepare_request
  -> parse_location_query
  -> call_precise_lookup
  -> diagnose_failure

diagnose_failure -> select_recovered_result -> finalize_response -> END
diagnose_failure -> retry_precise_lookup -> call_precise_lookup
diagnose_failure -> call_general_area_lookup -> select_recovered_result -> finalize_response -> END
diagnose_failure -> mark_for_review -> finalize_response -> END
```

조건 간선 요구사항:

- `diagnose_failure`에서 `primary_result`가 유효하면 `select_recovered_result`로 이동.
- `diagnose_failure`에서 `error_category`가 `transient`이고 `retry_count < max_retries`이면 `retry_precise_lookup` 이동.
- 정밀 조회 실패 및 `city` 등 폴백 가능 영역이 있으면 `call_general_area_lookup` 이동.
- 입력 불가, 폴백 대상 없음, 심각 오류, 재시도/폴백 모두 실패한 경우 `mark_for_review` 이동.
- `retry_precise_lookup`는 `call_precise_lookup`로 반환하기 전에 `retry_count`를 증가시켜야 함.
- `call_general_area_lookup`는 실패해도 `select_recovered_result`로 이동해 통제된 실패를 반환 가능하게 함.
- 루프는 `max_retries`를 넘지 않아야 함.
- 툴은 주입 가능해야 하며, 네트워크 없이 각 경로를 테스트 가능해야 함.

## 입력/출력

- 입력: 자연어 위치 질의, 예: `"Find precise location details for 1600 Amphitheatre Parkway, Mountain View"` 또는 `"What area is this Paris address in?"`
- 출력: `final_output`으로 `status`, `message`, `result`, `result_source`, `recovery_path`, `needs_human_review`, 비민감 진단 요약 포함.
- 중간 산출물: 파싱된 주소/도시, 기본/폴백 결과, 구조화된 오류, 이벤트 로그, 재시도 횟수, 선택 복구 액션, 리뷰 플래그.

예시 입력 형태:

```json
{
  "input": "Find precise location details for 1600 Amphitheatre Parkway, Mountain View",
  "max_retries": 1
}
```

정밀 성공 출력 예시:

```json
{
  "status": "ok",
  "message": "요청한 주소의 정밀 위치 정보를 찾았습니다.",
  "result_source": "primary",
  "result": {
    "address": "1600 Amphitheatre Parkway, Mountain View, CA",
    "confidence": 0.94
  },
  "recovery_path": ["primary_success"],
  "needs_human_review": false
}
```

폴백 성공 출력 예시:

```json
{
  "status": "degraded",
  "message": "정밀 조회는 실패했지만 일반 지역 정보는 조회했습니다.",
  "result_source": "fallback",
  "result": {
    "city": "Mountain View",
    "summary": "Mountain View, CA의 일반 지역 정보"
  },
  "recovery_path": ["primary_failed", "fallback_success"],
  "needs_human_review": false
}
```

## 실패 사례

- 빈 입력은 `prepare_request`에서 즉시 실패 처리 후 도구 없이 리뷰 처리 또는 통제된 종료.
- 잘못된/불완전 질의는 반복 재시도하지 말고, 정정 안내 또는 리뷰로 전환.
- 타임아웃/일시적 서버 오류는 `transient`로 분류하고 `retry_count < max_retries`일 때만 재시도.
- 미발견(`not_found`)은 재시도 없이 폴백 가능 시 폴백.
- 형식 오류는 예외가 없어도 `tool_errors`로 기록.
- 폴백 실패는 크래시 없이 통제된 실패 반환.
- 중대 오류, 반복 실패, 폴백 데이터 부재, 상충 결과는 `needs_human_review`.
- 최종 응답에 스택 트레이스, 자격 증명, 민감 도구 페이로드 노출 금지.
- 이벤트 로깅 실패는 원본 오류를 가리지 말고 부가 오류로 기록 후 마무리.
- 재시도는 지원되지 않는 입력/자격 증명 오류/명백한 서비스 불가에서 반복하지 않음.

## 테스트 아이디어

- 정밀 조회 성공 시 폴백 없이 종료되는 정상 경로.
- 일시적 실패 1회 재시도 후 성공.
- 일시적 실패 2회 후 폴백 성공.
- `not_found`는 재시도 없이 폴백.
- 형식 오류가 `tool_errors`에 기록되는지.
- 폴백 실패 시 `status: "failed"` 또는 동등한 통제 실패가 그래프 예외 없이 반환되는지.
- 빈 입력에서 툴 호출 전단에서 차단되는지.
- 어느 경로도 `max_retries` 초과 여부 점검.
- 중대 오류에서 `needs_human_review` true 및 `last_error` 보존.
- 최종 상태에 `final_output`, `event_log`, `tool_errors`, `retry_count`, `recovery_action` 항상 포함.
- 주입 가능한 가짜 툴로 성공/타임아웃/미발견/형식오류/서비스불가/폴백 실패를 결정적으로 재현할 수 있는지.

## 열린 질문

- `docs/agentic-design-patterns-toc.md`는 Chapter 12를 논리 페이지 `182-189`로 표시하지만, 추출된 실제 PDF 헤딩은 라벨 `196-203`입니다.
- 챕터 예시의 `get_precise_location_info`, `get_general_area_info`는 스키마가 명시되지 않습니다. 구현 전 최소 타입 계약을 정의해야 합니다.
- 통제 실패를 즉시 `status: "failed"`로 반환할지, 아니면 Chapter 13 완료 후 항상 사람 개입 플로우로 연결할지는 결정 필요.
- 이벤트 로깅을 그래프 상태에 둘지, 향후 스캐폴딩 시 공용 관측성 인터페이스로 분리할지 판단 필요.
