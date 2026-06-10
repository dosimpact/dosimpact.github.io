---
sidebar_position: 13
---

# 요구사항: 13장 Human-in-the-Loop

## 출처

- PDF: `Agentic_Design_Patterns.pdf`
- 섹션: `Chapter 13: Human-in-the-Loop`
- 페이지 범위: `190-198` (`docs/agentic-design-patterns-toc.md`의 논리 페이지)
- 추출 참고: Chapter 13 헤딩은 PDF 라벨 `204` / 0 기반 인덱스 `203`에 있었고, Chapter 14는 PDF 라벨 `213` / 0 기반 인덱스 `212`에서 시작합니다. 추출 범위는 PDF 인덱스 `203-211`, 파일 페이지 `204-212`, 챕터 내부 페이지 `1-9`입니다. TOC의 논리 범위(`190-198`)는 9페이지지만 라벨은 14페이지 차이가 납니다.

## 패턴 요약

Human-in-the-Loop(HITL)는 완전 자동화가 안전하지 않거나 신뢰가 낮거나 윤리적으로 민감하거나 뉘앙스가 중요할 때 사람의 판단을 워크플로에 삽입하는 패턴입니다. 이 패턴은 에이전트가 규모 확장 가능한 계산/반복작업을 담당하고, 인간이 감독, 교정, 피드백, 최종 승인, 개입을 담당하는 협업 구조입니다.

챕터는 감독, 개입/교정, 학습용 피드백, 의사결정 보강, 인간-에이전트 협업, 에스컬레이션 정책을 포함한 여러 HITL 형태를 설명합니다. 또한 사람이 거시 정책을 세우고 에이전트가 경계 내에서 실행하는 "human-on-the-loop"도 함께 다룹니다.

실습 예제 구현은 기술지원 흐름을 한정해 구현해야 합니다. 먼저 정형화된 트러블슈팅을 시도하고, 필요 시 지원 티켓 생성, 민감하거나 복잡/애매/감정적 사건은 사람이 리뷰하도록 라우팅합니다. 인간 리뷰는 명시적으로 수행되어야 하며 테스트에서 모의 가능해야 하고, 리뷰 요청 생성 전에는 개인정보 마스킹이 되어야 합니다.

## 패턴 설명

### 개념 개요

HITL은 에이전트를 완전한 최종 결정권자로 보지 않고 첫 대응자(first-line worker)로 취급합니다. 에이전트는 맥락을 요약하고 도구를 실행하며 권고를 제시하고 단순 사안을 처리합니다. 판단·도메인 전문성·공감·정책 해석·책임이 필요한 경우에는 중단되거나 사람이 개입하도록 경로를 전환합니다.

13장은 안전, 윤리, 복잡 의사결정, 에스컬레이션과 밀접합니다. 따라서 구현 예제는 히든 프롬프트 대신 상태에 명시적으로 에스컬레이션 결정을 남겨야 합니다.

### 문제

완전 자동 에이전트는 애매하고 고위험/감정적으로 민감한 맥락에서 과신한 실수를 할 수 있습니다. 또 에스컬레이션 설계가 약하면 민감 정보를 무심코 리뷰어에 노출할 수 있습니다. 자동 경로만 쓰면 위험 케이스를 과소 판단하거나, 반대로 모든 케이스를 과도하게 에스컬레이션해 운영 효율이 떨어질 수 있습니다.

HITL은 언제 인간이 개입해야 하는지, 어떤 정보를 넘길지, 인간 결정의 적용 규칙을 정의해 이 문제를 구조화합니다.

### 사용해야 할 때

- 안전, 재무, 법률, 윤리, 평판 리스크가 있는 작업.
- 미묘한 판단, 공감, 도덕적 추론, 전문 지식이 필요한 작업.
- 에이전트가 분석/권고는 가능하나 최종 결정은 사람이 필요할 때.
- 모더레이션, 사기 알림, 법률 검토, 지원 에스컬레이션처럼 경계 케이스가 자주 발생할 때.
- 인간 피드백을 바탕으로 프롬프트/정책 개선이 필요한 경우.
- 사람 정책이 있어 자동 실행은 사람이 지시한 틀 내에서만 가능한 경우.

### 사용하지 말아야 할 때

- 단순 저위험 작업으로 사람 리뷰가 지연만 추가하는 경우.
- 더 나은 결정을 할 사람이 존재하지 않는 경우.
- 레드액션/동의/권한 통제가 없는데 원시 데이터 그대로 리뷰어에게 넘길 때.
- 높은 볼륨에서 큐 정렬/임계값/샘플링이 없으면 안 됩니다.
- HITL을 기본 방어로 쓰고 자동 가드레일을 생략할 때.
- 위험한 에이전트 출력을 사람 승인 하나로 정당화할 때.

### 동작 방식

1. 사용자 요청과 고객 정보, 과거 이력, 정책을 받습니다.
2. 작업을 이슈 유형, 위험도, 모호도, 감정 신호, 자동화 적합성으로 분류합니다.
3. 루틴 이슈는 허용된 도구(트러블슈팅/티켓 생성)로 처리 후 응답안을 초안 작성합니다.
4. 에스컬레이션 정책, 위험 신호, 도구 실패, 정보 누락, 감정 과도 상태 등을 기준으로 사람이 개입해야 하는지 판단합니다.
5. 개입이 필요하면 민감 정보를 마스킹한 리뷰 요청을 생성합니다.
6. 리뷰어는 승인/수정/거부/재에스컬레이션을 수행하고, 테스트에서는 모의 가능해야 합니다.
7. 리뷰 결과를 상태에 반영해 최종 응답/에스컬레이션 상태를 반환합니다.
8. 선택적 인간 피드백은 메타데이터로 보존해 이후 정책 개선에 사용합니다.

### 트레이드오프

| 장점 | 비용/위험 |
| --- | --- |
| 자동화가 위험한 영역에서 인간 판단을 추가합니다. | 지연 시간·운영 비용 상승. |
| 민감 도메인에서 책임있는 운영을 가능하게 합니다. | 리뷰 품질은 도메인 전문가의 숙련도와 가용성에 의존. |
| 에스컬레이션 정책을 테스트 가능하게 만듭니다. | 임계값 설정 실수는 과도한 에스컬레이션 또는 미조치 위험을 만듦. |
| 중요 의사결정에서 신뢰를 높입니다. | 리뷰어도 편향/일관성 부족 가능. |
| 피드백 루프를 통한 개선이 가능합니다. | 리뷰 payload가 프라이버시 유출 위험이 있어 제거/마스킹 필요. |
| 반복적 루틴은 에이전트가 처리하고 예외는 사람이 처리. | 대량에서 사람 큐 병목이 발생 가능. |

### 최소 예시

```text
고객이 노트북 배터리 팽윤 문제 신고
  -> 고객 정보/지원 이력 로드
  -> 하드웨어 + 안전 위험으로 분류
  -> 정규 트러블슈팅 생략
  -> 마스킹된 리뷰 요청 생성
  -> 전문 상담원이 "즉시 에스컬레이션" 선택
  -> 우선순위 critical로 티켓 생성
  -> 안전한 임시 조치와 에스컬레이션 상태로 응답
```

### LangGraph 매핑

| 패턴 개념 | LangGraph 요소 |
| --- | --- |
| 사용자 요청 및 컨텍스트 | `input`, `customer_id`, `customer_info`, `support_history` |
| 인간 감독 정책 | `escalation_policy`, `assess_handoff_need` |
| 루틴 자동 처리 | `troubleshoot_issue`, `create_ticket` |
| 개입/교정 | `request_human_review`, `human_response` |
| 결정 보강 | `agent_recommendation`, `review_request`, `escalation_reason` |
| 프라이버시 경계 | `redact_review_payload`, `redacted_review_request` |
| 에스컬레이션 정책 | `assess_handoff_need`의 조건 분기 |
| 학습용 피드백 | `human_feedback`, `record_review_outcome` |

## LangGraph 구현 목표

기술지원 보조 에이전트 예제를 구현합니다. 사용자 요청과 고객 문맥을 받아 일상적 지원 동작을 먼저 수행하고, 필요 시 인간 판단이 필요한 복잡·민감·애매·정서적 이슈를 인간 리뷰로 넘기는 흐름입니다.

현실 API 없이 구현해야 하며 트러블슈팅/티켓생성/에스컬레이션은 로컬 결정적 함수로 처리합니다. 인간 리뷰 노드는 LangGraph 인터럽트 또는 주입 가능한 리뷰 제공자(mock reviewer)로 구현해 테스트에서 시뮬레이션 가능합니다.

예상 결과:

- 루틴 이슈는 리뷰 없이 가이던스/티켓 처리.
- 복잡·위험·민감·애매·감정 과부하 이슈는 인간 리뷰 요청.
- 리뷰 요청은 마스킹 후 전송.
- 승인/수정/거부/에스컬레이션/추가 정보요청 결정이 명시적으로 적용.
- 최종 응답은 상태, 티켓/에스컬레이션 정보, 리뷰 실행 여부를 설명.

## 상태 형태

| 필드 | 타입 | 목적 |
| --- | --- | --- |
| `input` | `str` | 원본 지원 요청 또는 작업 설명 |
| `customer_id` | `str \| None` | 고객 식별자(선택), 고객 컨텍스트 조회용 |
| `customer_info` | `dict[str, Any]` | 이름/등급/구매품목/최근 구매내역 등 선택 정보 |
| `support_history` | `list[dict]` | 기존 티켓/이전 대응/미결 건 |
| `normalized_input` | `str` | 분류 및 도구 호출용 정규화 텍스트 |
| `issue_type` | `str \| None` | `software`, `hardware`, `billing`, `account`, `safety`, `unknown` 등 |
| `sentiment` | `str \| None` | `neutral`, `frustrated`, `angry`, `distressed` 등 |
| `risk_level` | `str` | `low`, `medium`, `high`, `critical` |
| `ambiguity_level` | `str` | 자동화 충분성: `low`, `medium`, `high` |
| `escalation_policy` | `dict[str, Any]` | 위험/애매도 임계치 등 사람이 개입할 규칙 |
| `agent_recommendation` | `dict[str, Any] \| None` | 에이전트 권고 액션/응답/티켓 |
| `troubleshooting_result` | `dict[str, Any] \| None` | 루틴 진단 결과 |
| `ticket` | `dict[str, Any] \| None` | 생성된 티켓 데이터 |
| `needs_human_review` | `bool` | 최종 응답 전 리뷰 필요 여부 |
| `escalation_reason` | `str \| None` | 리뷰가 필요한 이유 |
| `review_request` | `dict[str, Any] \| None` | 내부용 리뷰 요청 원본 |
| `redacted_review_request` | `dict[str, Any] \| None` | 민감 필드 마스킹 후 리뷰용 |
| `human_response` | `dict[str, Any] \| None` | 승인/수정/거부/기타 지시 |
| `human_feedback` | `dict[str, Any] \| None` | 추후 개선용 피드백 메타 |
| `review_status` | `str` | `not_required`, `requested`, `approved`, `edited`, `rejected`, `escalated` |
| `errors` | `list[str]` | 검증/도구/마스킹/리뷰 오류 |
| `final_output` | `dict[str, Any] \| None` | 응답 텍스트, 상태, 티켓/에스컬레이션, 리뷰 메타 |

## 노드

| 노드 | 책임 |
| --- | --- |
| `preprocess_input` | 입력 검증, 공백 정규화, 기본값/정책 초기화 |
| `load_customer_context` | 고객 정보와 지원 이력을 로드(주입 fixture 허용) |
| `classify_request` | 이슈 유형, 감정, 위험도, 모호도, 루틴 적합성 판정 |
| `troubleshoot_issue` | 저위험 루틴 케이스를 위한 정형 트러블슈팅 실행 |
| `create_ticket` | 후속 처리가 필요하거나 루틴 추적 필요 시 티켓 생성 |
| `assess_handoff_need` | 정책 기반으로 인간 개입 여부 판정 |
| `build_agent_recommendation` | 바로 최종화 또는 리뷰용 추천안 생성 |
| `redact_review_payload` | 리뷰 전달 전 민감 정보 마스킹 |
| `request_human_review` | LangGraph interrupt 또는 가상 리뷰 제공자 호출 |
| `apply_human_decision` | 승인/수정/거부/에스컬레이션/추가정보요청 반영 |
| `record_review_outcome` | 리뷰 노트 및 정책 개선용 피드백 저장 |
| `finalize` | 최종 출력(`answer`, 상태, 티켓, 에스컬레이션 상세) 생성 |

## 간선

```text
START
  -> preprocess_input
  -> load_customer_context
  -> classify_request
  -> troubleshoot_issue
  -> build_agent_recommendation
  -> assess_handoff_need

assess_handoff_need -> finalize
assess_handoff_need -> create_ticket -> finalize
assess_handoff_need -> redact_review_payload -> request_human_review
request_human_review -> apply_human_decision -> record_review_outcome -> finalize -> END
```

조건 간선 요구사항:

- low risk, 명확, 루틴, 진단 충분 시 `finalize`.
- 루틴이지만 비동기 후속이 필요하면 `create_ticket` 후 `finalize`.
- 높은 위험/안전/애매/감정 급증/법적·재무 민감/지원 불가/트러블슈팅 실패는 `redact_review_payload` 경유 리뷰.
- `request_human_review`는 테스트에서 실제 외부 큐를 호출하지 않고 인터럽트/모의 리뷰어 사용.
- `apply_human_decision`은 `approve`, `edit`, `reject`, `escalate`, `request_more_info` 지원.
- 인간에게 노출되기 전 항상 `redact_review_payload` 선행.
- 리뷰 대기 무한루프 방지, 리뷰어 없음은 `awaiting_human` 또는 `review_unavailable`.

## 입력/출력

- 입력: 자연어 지원 요청, 선택 `customer_id`, `customer_info`, `support_history`, 테스트용 mock 리뷰 응답.
- 출력: `final_output` (지원 응답/에스컬레이션 상태, 티켓, 리뷰 발생 여부, 사람 결정 요약, 안전 메타).
- 중간 산출물: 정규화 입력, 분류 결과, 감정·위험·애매도, 트러블슈팅 결과, 에스컬레이션 이유, 마스킹 요청, 리뷰 응답, 상태, 오류.

예시 입력 형태:

```json
{
  "input": "My laptop battery is swelling and the case is starting to separate. What should I do?",
  "customer_id": "customer-123"
}
```

사람 리뷰 출력 예시:

```json
{
  "status": "escalated",
  "answer": "안전 관련 가능성이 있어 인사이동 없이 하드웨어 전문가에게 즉시 에스컬레이션했습니다. 이 장치 사용을 중단하고 다음 지침을 기다려 주세요.",
  "ticket": {
    "ticket_id": "TICKET123",
    "priority": "critical"
  },
  "human_review": {
    "required": true,
    "status": "escalated",
    "decision": "escalate",
    "reason": "배터리 팽윤 가능성이 있어 전문 처리가 필요합니다."
  },
  "redaction_applied": true
}
```

## 실패 사례

- 빈 입력은 도구/리뷰 호출 없이 `preprocess_input` 단계에서 실패 처리.
- 고객 컨텍스트 누락은 기능 정지로 이어지지 않도록 완화 처리.
- 낮은 신뢰 분류는 `ambiguity_level`을 올리고 리뷰 또는 추가정보 요청.
- 트러블슈팅/티켓 생성 실패는 에러 추가 후 안전성 훼손 시 리뷰로 이동.
- 리뷰 요청에 민감 필드가 남아있으면 안 되며, 마스킹 실패 시 리뷰 중단 및 안전 오류 반환.
- 안전/재무/법률/계정/개인정보/프라이버시 관련 케이스는 항상 리뷰 우선.
- 감정이 격한 사용자 케이스는 자동응답보다 리뷰/에스컬레이션.
- 리뷰어 부재 시 승인 없이 정해진 대체 상태(`awaiting_human`, `review_unavailable`) 반환.
- 거부(reject)는 에이전트 추천을 승인처럼 반환하지 않음.
- 리뷰 수정은 최종 답변 반영 및 `human_feedback` 기록.
- 리뷰 지시와 정책 충돌 시 더 엄격한 정책을 우선하고 오류 또는 에스컬레이션 사유 기록.
- 리뷰 루프를 무한 반복하지 말고 케이스당 1개 리뷰 요청만 유지.

## 테스트 아이디어

- 루틴 저위험 이슈가 리뷰 없이 `finalize`로 끝나는지.
- 복잡/안전 이슈가 `request_human_review` 경로로 이동하는지.
- 모의 리뷰어가 승인/수정/거부/에스컬레이션 처리 가능한지.
- 마스킹이 고객 ID, 구매 상세 등 민감 필드를 제거하는지.
- 리뷰어 미할당 시 리뷰 요청을 유지한 채 `awaiting_human`/`review_unavailable` 반환.
- 도구 실패 시 자신 있게 자동 답변하지 않고 안전한 에스컬레이션이 되는지.
- 고모호도 이슈가 리뷰 또는 추가정보 요청으로 가는지.
- 최종 출력에 상태, 티켓/에스컬레이션, 리뷰 메타, 오류가 들어가는지.
- 인간 리뷰 대기에서 무한 루프가 없는지.

## 열린 질문

- TOC 논리 범위는 `190-198`이지만 추출은 PDF 라벨 `204-212`에서 이루어져 있습니다.
- 챕터 도표는 캡션(`Fig.1: Human in the loop design pattern`)만 추출되었고 내부 구조가 텍스트로 전환되지 않았습니다.
- human-on-the-loop(고위 정책은 사람, 즉시 실행은 에이전트)는 정책 기반 라우팅으로 반영했으나, 구현은 명시적 HITL 에스컬레이션을 우선한 것으로 제한합니다.
