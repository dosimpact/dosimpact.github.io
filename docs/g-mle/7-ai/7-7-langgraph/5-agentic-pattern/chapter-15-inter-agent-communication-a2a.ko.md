---
sidebar_position: 15
---

# 15: Inter-Agent Communication (A2A) (ko)

## 패턴 요약

Inter-Agent Communication(A2A)은 독립적인 AI 에이전트가 공통 프로토콜로 협력하게 하는 패턴입니다. 하나의 거대한 에이전트가 전 기능을 담당하는 대신, A2A 클라이언트가 원격 에이전트를 검색하고, Agent Card로 능력을 확인한 뒤, 태스크 위임·메시지 교환·산출물 수집을 수행합니다.

챕터는 LangGraph, CrewAI, Google ADK 등 서로 다른 프레임워크를 잇는 HTTP 기반 오픈 표준으로 A2A를 설명합니다. 핵심 액터, Agent Card, 발견(discovery), 비동기 상태, 메시지/산물 파트, 동기/스트리밍 모드, 푸시 알림, 보안, MCP와의 차이를 다룹니다.

구현 목표는 A2A 코디네이터입니다. 소수의 mock 원격 Agent Card를 탐지하고, 사용자 요청에 맞는 원격 스킬을 선택한 뒤, 작업 요청을 A2A 유사 JSON-RPC로 만들어 주입 가능한 fake transport으로 전송하고, 동기/폴링/스트리밍/입력요청 상태를 처리한 뒤 산물을 종합해 최종 응답합니다.

## 패턴 설명

### 개념 개요

A2A에서 각 에이전트는 내부 구조는 감추고 `무슨 일을 할 수 있는지`를 표준 계약으로 노출합니다. 클라이언트는 원격 에이전트의 프레임워크/프롬프트보다 Agent Card의 endpoint, 지원 모드, 인증, 스킬 리스트에 의존해 협력합니다.

이는 단일 그래프 안에 노드를 늘리는 방식과 다릅니다. A2A는 외부 오케스트레이션을 전제로 한 표준화된 작업·상태 교환입니다.

### 문제

복잡한 시스템은 서로 다른 런타임/프레임워크/팀 경계에서 동작하는 전문 에이전트를 필요로 합니다. 표준이 없으면 각 조합마다 수동 통합이 필요하고, 장기 작업의 상태 관리가 어려워집니다.

A2A는 식별, 발견, 작업 표현, 결과 반환, 다회 주기 맥락 관리까지 표준화해 이 문제를 해결합니다.

### 사용해야 할 때

- 서로 다른 프레임워크/서비스 경계를 넘는 다중 전문 에이전트 협업이 필요할 때.
- 하드코딩 목록이 아니라 Agent Card 기반 동적 탐색이 필요한 경우.
- 작업이 장기화되어 태스크 ID, 상태 조회, 스트리밍 업데이트가 필요한 경우.
- 원격 에이전트를 불투명한 시스템으로 다루고 계약만 신뢰할 때.
- 하나의 거대한 에이전트보다 모듈형 아키텍처가 유리할 때.
- LangGraph, ADK, CrewAI 등 상호운영성이 핵심 요건일 때.

### 사용하지 말아야 할 때

- 단일 내부 프로세스에서 바로 tool 노드로 처리하면 충분한 간단한 워크플로.
- 저지연 결정형 처리에서 네트워크형 위임 오버헤드가 과도할 때.
- 인증/권한/전송 보안/감사 경계가 미정일 때.
- 규제가 강해 허가되지 않은 원격 에이전트가 허용되지 않는 경우.
- A2A를 MCP와 혼동해 도구 접근 계층으로 오인하는 경우.

### 동작 방식

1. 사용자 요청을 받으면 A2A 코디네이터가 시작됩니다.
2. 정해진 Agent Card URL/레지스트리/설정에서 원격 에이전트를 탐색.
3. Agent Card를 검증(엔드포인트, 버전, 입출력 모드, 스킬, 인증 요구사항).
4. 사용자 요청을 충족할 스킬을 매핑.
5. 작업 메시지(메타, 컨텐츠 파트, 출력 모드, 세션 ID 등)를 구성.
6. 짧은 작업은 동기 호출로 즉시 결과 수신.
7. 장기 작업은 task ID 관리 후 polling/stream/webhook 형태로 대기.
8. 작업 상태(working/input-required/completed/failed)와 산물을 수신해 처리.
9. 실패/재입력/완료별로 사용자 질의, 대기, 집계, 폴백 수행.
10. 감사 로그를 남기고 민감 정보는 마스킹한 뒤, 사용된 원격 능력을 설명한 응답 생성.

### 트레이드오프

| 장점 | 비용/위험 |
| --- | --- |
| 서로 다른 프레임워크 간 협업 가능 | 발견·전송·상태 관리 복잡도 증가 |
| 전문성 모듈화를 통해 분산 배포 | 원격 의존성으로 인해 지연/가용성 리스크 |
| Agent Card로 능력 투명성 확보 | 잘못된 카드가 잘못된 위임/안전 문제 유발 |
| 동기/폴링/스트리밍/웹훅 대응 | 모드별 타임아웃/재시도 로직 필요 |
| 원격 에이전트를 불투명 서비스로 취급 | 디버깅이 어려워 추적메타가 중요 |
| MCP와 역할 구분이 분명 | 과도한 분산으로 경계가 모호해질 수 있음 |
| 독립 호스팅 에이전트 기반 확장성 | 인증, 자격증명, 데이터 공유 정책 필수 |

### 최소 예시

```text
사용자: "내일 오후에 가능한 시간과 날씨를 확인해 회의 잡아줘."
코디네이터:
  -> Agent Card 탐색
  -> Calendar Agent의 check_availability 선택
  -> WeatherBot의 get_forecast 선택
  -> 두 A2A 작업 전송
  -> 둘 다 완료될 때까지 poll/stream
  -> 반환 산물 집계
  -> 사용 가능 시간, 날씨, 처리 오류를 함께 설명
```

### LangGraph 매핑

| 패턴 개념 | LangGraph 요소 |
| --- | --- |
| 사용자 요청 | `input` |
| A2A 클라이언트 | LangGraph 코디네이터 그래프 |
| 원격 A2A 서버 | `remote_agents`에 주입되는 fake transport 대상 |
| Agent Card | `agent_cards`, `validated_agent_cards`, `discover_agent_cards` |
| 발견 전략 | `discovery_mode`, `discover_agent_cards` |
| 스킬 선택 | `plan_remote_delegation`, `delegation_plan` |
| A2A 작업 | `a2a_tasks`, `task_statuses` |
| 메시지/산물 파트 | `task_messages`, `remote_artifacts`, `stream_events` |
| 컨텍스트 연속성 | `session_id`, `context_id` |
| 동기/폴링/스트리밍/webhook | `choose_interaction_mode` 및 조건 분기 |
| 인증 선언 | `auth_requirements`, `credential_status` |
| 감사성 | `audit_log`, `record_audit_event` |
| 입력 요구/실패 처리 | `handle_input_required`, `handle_task_failure` |

## LangGraph 구현 목표

회의 준비 지원 코디네이터를 구현합니다. 사용자 요청에서 달력 가용성과 날씨를 받아야 하므로 서로 다른 두 원격 에이전트(캘린더/기상)를 위임합니다.

실제 HTTP 서버·자격증명·웹훅 없이 mock transport를 통해 통신을 모델링합니다. 하지만 교육 목적상 Agent Card, 발견, 스킬 매핑, 태스크 ID, 상태, 메시지 파트, 동기/폴링/스트리밍, 인증 메타, 실패 처리까지 반영해야 합니다.

예상 결과:

- 작업 시작 전 Agent Card 발견.
- 사용자 요구에 맞는 스킬을 선택.
- A2A 유사 요청(JSON-RPC 유사 형식) 구성 후 전송.
- 동기 완료와 비동기 polling/streaming 둘 다 처리.
- `input-required`, `failed`, timeout, 미지원 모드, 인증 실패를 명시적으로 처리.
- 최종 출력은 사용된 에이전트·스킬·태스크 ID·모드 요약 포함.

## 상태 형태

| 필드 | 타입 | 목적 |
| --- | --- | --- |
| `input` | `str` | 사용자 요청 |
| `normalized_input` | `str` | 정규화 요청 |
| `session_id` | `str` | 세션 식별자 |
| `context_id` | `str \| None` | 멀티턴 맥락 식별자 |
| `discovery_mode` | `str` | `direct_config`, `registry`, `well_known_uri` |
| `agent_cards` | `dict[str, dict]` | 후보 Agent Card 원본 |
| `validated_agent_cards` | `dict[str, dict]` | 스키마/역량/모드/보안 검증 통과 카드 |
| `remote_agents` | `dict[str, Any]` | fake A2A 서버/픽스처 메타 |
| `candidate_skills` | `list[dict]` | 매칭 가능한 원격 스킬 |
| `delegation_plan` | `list[dict]` | 호출 순서·모드·이유를 담은 위임 계획 |
| `auth_requirements` | `dict[str, dict]` | 선택 스킬이 요구하는 인증 정보 |
| `credential_status` | `dict[str, str]` | `available`, `missing`, `invalid` 상태 |
| `a2a_tasks` | `dict[str, dict]` | 작업 요청 payload (키별 태스크 ID 포함) |
| `task_statuses` | `dict[str, str]` | `submitted`, `working`, `input-required`, `completed`, `failed`, `timeout` |
| `task_messages` | `dict[str, list[dict]]` | 송수신 메시지 |
| `remote_artifacts` | `dict[str, list[dict]]` | 반환 산물(텍스트/JSON 등) |
| `interaction_modes` | `dict[str, str]` | `sync`, `polling`, `streaming`, `webhook_mock` |
| `poll_attempts` | `dict[str, int]` | 태스크별 폴링 횟수 |
| `stream_events` | `dict[str, list[dict]]` | 스트리밍 업데이트 |
| `pending_user_questions` | `list[str]` | `input-required` 시 추가질문 |
| `aggregation_result` | `dict[str, Any] \| None` | 통합 결과 |
| `audit_log` | `list[dict]` | 비민감 탐색/위임/상태 변경 추적 |
| `errors` | `list[str]` | 검증/전송/인증/상태/타임아웃 오류 |
| `final_output` | `dict[str, Any] \| None` | 사용자 응답, 사용 에이전트/스킬, 상태, 산물 요약, 오류 |

## 노드

| 노드 | 책임 |
| --- | --- |
| `preprocess_request` | 입력 검증, 정규화, session_id 생성, 기본값 초기화 |
| `discover_agent_cards` | 설정 또는 registry에서 Agent Card 로드 |
| `validate_agent_cards` | 필수 필드와 모드/스킬/인증 스키마 검증 |
| `plan_remote_delegation` | 사용자 의도에 맞는 스킬 매핑 |
| `check_credentials` | 요구 자격 증명 존재 여부 선검증 |
| `choose_interaction_mode` | 작업 유형/지속성에 따른 모드 선택 |
| `build_a2a_tasks` | task id, session id, 메시지 파트, 출력 모드 포함 요청 생성 |
| `dispatch_sync_task` | 동기 작업 즉시 실행 후 결과 수집 |
| `start_async_task` | 긴 작업을 제출하고 task id 초기 상태 저장 |
| `poll_async_task` | polling으로 완료/실패/input-required/timeout 판정 |
| `consume_stream_updates` | 스트리밍 이벤트 누적 수집 |
| `handle_input_required` | 사용자 추가 질문 생성 및 중단/재개 상태 처리 |
| `process_remote_artifacts` | 반환 메시지/산물 유효성 검증 및 정규화 |
| `aggregate_remote_results` | 다중 원격 산물 통합 |
| `handle_task_failure` | 실패 상태·지원 모드 불일치·인증/전송 오류 처리 |
| `record_audit_event` | 탐색/위임/상태 전환 이력 기록 |
| `finalize_response` | 최종 응답 생성 |

## 간선

```text
START
  -> preprocess_request
  -> discover_agent_cards
  -> validate_agent_cards
  -> plan_remote_delegation
  -> check_credentials
  -> choose_interaction_mode
  -> build_a2a_tasks

build_a2a_tasks -> dispatch_sync_task -> process_remote_artifacts
build_a2a_tasks -> start_async_task -> poll_async_task -> process_remote_artifacts
build_a2a_tasks -> start_async_task -> consume_stream_updates -> process_remote_artifacts

poll_async_task -> handle_input_required -> finalize_response -> END
consume_stream_updates -> handle_input_required -> finalize_response -> END
dispatch_sync_task -> handle_task_failure -> finalize_response -> END
poll_async_task -> handle_task_failure -> finalize_response -> END
consume_stream_updates -> handle_task_failure -> finalize_response -> END

process_remote_artifacts -> aggregate_remote_results -> finalize_response -> END
```

조건 간선 요구사항:

- `validate_agent_cards`에서 유효 카드가 없으면 `finalize_response`.
- `plan_remote_delegation`에서 매칭 스킬이 없으면 `finalize_response`.
- `check_credentials`에서 누락/무효 자격시 `handle_task_failure`.
- `build_a2a_tasks`에서 빠른 동기 작업은 `dispatch_sync_task`.
- 장기 작업 + polling은 `start_async_task -> poll_async_task`.
- 스트리밍 지원 시 `start_async_task -> consume_stream_updates`.
- 어떤 작업이라도 `input-required`면 `handle_input_required`로 이동.
- `failed`, timeout, 잘못된 응답, 인증 실패, 전송 실패는 `handle_task_failure`.
- 필수 작업 완료 후에만 집계 실행(또는 정책상 partial 허용).
- polling/streaming은 최대 시도 횟수로 루프 제한.

## 입력/출력

- 입력: 자연어 요청, 선택 discovery mode, Agent Card 레지스트리, fake 원격 에이전트 픽스처, 자격 증명 별칭.
- 출력: `final_output`으로 상태, 사용 원격 에이전트/스킬, task id, 상태, 모드, 산물 요약, 감사 요약, 대기 질문, 오류 제공.
- 중간 산출물: 검증된 Agent Card, 후보 스킬, 위임 계획, 작업 payload, 메시지, 스트림, poll 횟수, 산물, 집계 결과, 인증 상태.

예시 입력 형태:

```json
{
  "input": "Ask the travel agent to draft a two-day Seoul itinerary and return the result as a summary.",
  "discovery_mode": "fixture"
}
```

정상 응답 예시:

```json
{
  "status": "ok",
  "answer": "내일 오후에는 회의 가능 시간은 13:00~17:00이고 날씨는 맑음(강수확률 낮음)입니다.",
  "agents_used": [
    {
      "name": "Calendar Agent",
      "skill": "check_availability",
      "task_id": "task-calendar-001",
      "mode": "sync",
      "status": "completed"
    },
    {
      "name": "WeatherBot",
      "skill": "get_forecast",
      "task_id": "task-weather-001",
      "mode": "polling",
      "status": "completed"
    }
  ],
  "artifact_summary": {
    "calendar": "13:00~17:00 이용 가능",
    "weather": "맑음, 22°C, 강수 위험 낮음"
  },
  "errors": []
}
```

입력 요구 응답 예시:

```json
{
  "status": "input_required",
  "answer": "캘린더 에이전트가 가용 시간 확인을 위해 날짜를 다시 요청했습니다.",
  "pending_user_questions": [
    "몇월 며칠에 대한 확인이 필요한가요?"
  ],
  "agents_used": [
    {
      "name": "Calendar Agent",
      "skill": "check_availability",
      "task_id": "task-calendar-002",
      "mode": "polling",
      "status": "input-required"
    }
  ],
  "errors": []
}
```

## 실패 사례

- 빈 입력은 도구/원격 위임 전 `preprocess_request`에서 중단.
- 발견 설정 누락 시 크래시 없이 `no_agents_available` 같은 명시적 상태 반환.
- 잘못된 Agent Card는 스킬 선택 전 거부 및 오류 기록.
- 필수 필드 누락(`name`, URL, version, skills, input/output modes) 카드는 사용 금지.
- 지원하지 않는 입출력 모드로 dispatch 금지 및 이유 기록.
- 자격증명 누락/무효는 실제 원격 호출 전 차단.
- 매칭 스킬 없으면 즉시 이유를 반환.
- 전송 실패는 endpoint 불가, 페이로드 무효, 전송 거부 모두 반영.
- polling/streaming은 최대 시도 제한.
- `input-required`는 임의 값 생성 없이 사용자 재질문 제안.
- `failed` 상태는 task id, 원격 오류, 스킬 정보 유지.
- 스트리밍 중단/비정상 이벤트는 유효 이벤트만 유지해 부분 또는 실패 상태 반환.
- webhook은 모의로 처리하고 실제 콜백 미존재가 테스트를 막지 않음.
- 산물 손상/과다/출력모드 불일치 시 버림.
- 감사 로그는 자격 증명/토큰 같은 비밀값을 넣지 않음.
- 한 원격이 실패해도 다른 하나가 성공했다면, 정책에 따라 부분 결과 처리.

## 테스트 아이디어

- Calendar/WeatherBot 카드 발견 후 동시 위임 및 집계 성공.
- 동기 작업이 task id, 세션 id, message part, 출력 모드, 스킬 메타를 포함했는지 확인.
- polling이 working→completed로 제한 횟수 내 도달.
- streaming 모드 이벤트 누적 및 polling과 동일 정규화 산물.
- `input-required` 시 사용자 질문 생성 및 값 조작 없음.
- 형식 불량 Agent Card 거부.
- 매칭 스킬 없음 경로의 명확한 종료.
- 자격 증명 부족 시 dispatch 차단 및 인증 오류 기록.
- failed 상태에서 `handle_task_failure`.
- timeout 후의 최종 처리 안정성.
- 출력 모드 미지원 시 요청 단계에서 차단.
- malformed artifact 필터링 및 집계 제외.
- 부분 성공 시 미해결 의존성 표기.
- `audit_log`에 탐색/위임/상태 메타 존재.

## 열린 질문

- TOC 논리 범위 `216-230`과 실제 라벨 `231-245` 간의 위치 차이.
- 본문이 `sendTask/sendTaskSubscribe`와 `tasks/send/tasks/sendSubscribe`를 혼용. 내부 transport에서 메서드 매핑 표준화 필요.
- `google-a2a/a2a-samples` 및 `a2aproject/a2a-samples` 레퍼런스가 혼재되어 실제 구현 스펙은 분리 필요.
- 도식은 캡션(`Fig.2: A2A inter-agent communication pattern`)만 추출됨.
- 챕터가 언급하는 mTLS, OAuth, API Key, HTTP 헤더는 예제 구현에서 mock로 대체하고 실제 비밀처리는 후속 단계.
