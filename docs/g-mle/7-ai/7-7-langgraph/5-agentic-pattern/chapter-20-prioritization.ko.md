---
sidebar_position: 20
---

# Requirement: Chapter 20: 우선순위 설정 (Prioritization)

## Source

- PDF: `Agentic_Design_Patterns.pdf`
- Section: `Chapter 20: Prioritization`
- Page range: `307-316` logical pages from `docs/agentic-design-patterns-toc.md`
- 추출 메모: Chapter 20 제목은 PDF 라벨 `325`(zero-based `324`)에 있고 Chapter 21은 `335`(zero-based `334`)에서 시작합니다. 추출 구간은 PDF 인덱스 `324-333`, 파일 페이지 `325-334`, 장 내 페이지 `1-10`입니다. TOC의 논리 범위는 `307-316`으로 10쪽과 맞지만 실제 라벨은 18페이지 차이가 있습니다.

## Pattern Summary

우선순위 설정은 많은 대기 작업이 있을 때 자원과 시간 제약 안에서 “어떤 일을 먼저 할지”를 구조화하는 패턴입니다. 모든 요청을 동등하게 처리하지 않고 긴급성, 중요도, 의존성, 자원 가용성, 비용 대비 효과, 사용자 선호도를 반영해 점수화합니다.

챕터에서는 상위 목표 선택, 하위 작업 순서화, 즉시 행동 선택을 모두 다룹니다. 예시로는 PM 에이전트가 `P0/P1/P2` 우선순위를 부여하고, 작업자 배정 후 보드 형태로 정리하는 과정을 보여줍니다.

LangGraph 예제는 작업 triage/우선순위 그래프입니다. 신규 요청, 기존 백로그, 가용 작업자, 채점 기준을 받아 정규화·평가·정렬·할당한 뒤 우선순위 보드와 사유, 경고를 반환합니다.

## Pattern Explanation

### Conceptual Overview

에이전트는 더 이상 하나의 요청만 처리하는 존재가 아닙니다. 여러 작업이 동시에 경합하고, 일부는 시급하며, 일부는 다른 작업의 전제 조건입니다. 우선순위 패턴은 이러한 경쟁을 노출된 정책으로 결정을 내리게 합니다.

기준 정의 → 후보 평가 → 정렬 → 다음 행동 선택의 사이클을 수행하며, 긴급 이벤트나 자원 변경이 생기면 재우선순위를 수행합니다.

### Problem

우선순위 규칙이 없으면 자원이 중요한 일보다 덜 중요한 일에 낭비되거나, 선후 의존을 무시하고 실행하다가 막히는 문제가 생깁니다. 이 패턴은 정량/정성 판단과 제약 조건을 결합해 “왜 이 작업을 골랐는지”를 기록 가능한 상태로 남깁니다.

### When to Use

- 여러 작업을 동시에 관리해야 하는 에이전트
- 긴급성·중요도·위험이 다른 작업 집합
- 의존성, 마감기한, 자원(인력/도구/시간/예산) 제약이 있는 경우
- 동적 이벤트에 따라 우선순위 재조정이 필요한 경우
- 결과 출력이 선택 근거 설명을 요구할 때

### When Not to Use

- 하나의 작업만 있을 때
- 외부 스케줄러가 이미 확정 순서를 정해주는 경우
- 안전이 중요한 실시간 제어를 LLM 점수만으로 처리할 때
- 법·윤리·안전이 높고 사람이 판단해야 하는 영역
- 단순 규칙 FIFO/EDD가 충분한 경우
- 잦은 재정렬이 완료 지연을 초래하는 경우

### How It Works

1. 사용자 요청, 백로그, 시스템 알림, 하위 목표로 후보 작업 수집
2. 긴급성/중요도/의존성/자원/비용대비효율/사용자 선호 기준 설정
3. 각 작업 정규화(`id`, 설명, 상태, 마감일, 담당자, 의존성, 자원요구)
4. LLM(선택) 또는 규칙으로 점수 계산
5. 블록 상태, 자원부족, 라벨 오류, 의존성 순환 탐지
6. 정렬 및 `P0~P2` 라벨링
7. 다음 실행 가능한 작업 시퀀스 선택 및 작업자 배정
8. 중요한 이벤트 시 재평가/재정렬
9. 우선순위 보드와 rationale를 출력

### Trade-offs

| 이점 | 비용/위험 |
| --- | --- |
| 제한된 자원을 핵심 업무에 집중 | 기준/가중치 설계와 유지 비용 |
| 선택 이유를 추적 가능하게 만듦 | 가중치 설계가 모호하면 잘못된 정밀도 |
| 상충 목표, 마감, 의존성을 일관되게 처리 | 정렬의 강함이 대안 탐색을 가리는 위험 |
| 동적 환경 적응성 | 잦은 재우선순위로 마무리 지연 |
| 보드/할당/근거 같은 산출물 제공 | 단순 실행기 대비 상태 설계 복잡도 증가 |
| LLM+규칙 혼합 가능 | LLM 점수 일관성 보장 필요 |

### Minimal Example

```text
입력: "로그인 시스템 구현 작업을 생성해줘. 긴급이고 작업자 B가 담당해."
백로그: TASK-001: 마케팅 웹사이트 콘텐츠 리뷰(마감/담당 미정)

흐름:
  -> TASK-002 생성
  -> 긴급 키워드 추출
  -> urgent/ASAP/critical을 P0로 매핑
  -> Worker B 지정 반영
  -> 기존 작업은 기본 P1 적용
  -> TASK-002를 TASK-001보다 우선 배치
  -> 갱신된 보드와 근거 반환
```

### LangGraph Mapping

| 패턴 개념 | LangGraph 요소 |
| --- | --- |
| 후보 작업 수집 | `input`, `new_task_requests`, `existing_tasks`, 노드 `ingest_tasks` |
| 기준 정의 | `criteria_weights`, `priority_policy`, 노드 `prepare_prioritization_context` |
| 정규화 | 노드 `normalize_tasks`, 상태 `tasks` |
| 기준 평가 | 노드 `evaluate_task_criteria`, 상태 `task_evaluations` |
| 의존성·자원 검토 | 노드 `analyze_dependencies`, `check_resource_fit` |
| 우선순위 랭킹 | 노드 `rank_tasks`, 상태 `ranked_tasks`, `priority_labels` |
| 동적 재조정 | 노드 `decide_reprioritization`, 상태 `reprioritization_reason` |
| 작업자 배정 | 노드 `assign_selected_tasks`, 상태 `assignments` |
| 리뷰/보류 | 노드 `request_human_review`, 상태 `warnings`, `errors`, `needs_review` |
| 최종 보드 | 노드 `finalize_priority_plan`, 상태 `priority_plan`, `final_response` |

## LangGraph Implementation Goal

PM용 우선순위 에이전트를 구현합니다. 작업 요청, 기존 백로그, 작업자, 우선순위 정책을 받아 구조화된 작업 레코드를 만들고 점수화·정렬한 뒤 `P0/P1/P2` 라벨을 부여, 할당 가능한 항목을 지정하고 정렬된 보드를 반환합니다.

테스트용으로는 결정론 점수 기반이 기본이며, NL 작업 추출은 주입 가능한 모델/파서를 허용합니다. Chapter의 AgentExecutor 의존은 피하고 LangGraph 상태/노드/조건부 엣지로 재구성합니다.

예상 동작:

- 신규 작업이 구조화되어 ID 생성
- urgent/ASAP/critical은 정책상 `P0` 기본 매핑
- 우선순위/담당자 미지정은 기본값 적용(P1, Worker A 가용 시)
- 백로그와 신규 작업을 동일 정렬에 포함
- 의존성/자원 제약은 과제 완료 대신 차단 이유로 표기
- 출력은 정렬 리스트, 다음 실행 항목, 할당, 근거, 경고, 오류 포함

## State Shape

| 필드 | 타입 | 용도 |
| --- | --- | --- |
| `input` | `str` | 사용자 요청/일괄 요청 |
| `existing_tasks` | `list[dict[str, Any]]` | 기존 백로그 |
| `new_task_requests` | `list[str]` | 새 요청 문자열 |
| `tasks` | `list[dict[str, Any]]` | ID/설명/우선순위/담당자/상태/기한/의존성/자원요구 |
| `workers` | `list[dict[str, Any]]` | 작업자 목록 및 처리 용량 |
| `criteria_weights` | `dict[str, float]` | 긴급성/중요도/의존성/자원/비용효율/사용자 선호 가중치 |
| `priority_policy` | `dict[str, Any]` | 우선순위 규칙, 기본값, 긴급 키워드, tie-breaker |
| `environment_context` | `dict[str, Any]` | 마감 변경/사건/자원 변경/사용자 선호 |
| `task_evaluations` | `dict[str, dict[str, Any]]` | 작업별 점수/신호/근거 |
| `dependency_graph` | `dict[str, list[str]]` | 의존성 관계 |
| `blocked_tasks` | `list[dict[str, Any]]` | 의존성·자원부족·유효성 실패로 블록된 작업 |
| `resource_fit` | `dict[str, dict[str, Any]]` | 작업별 작업자/도구 가용성 점검 |
| `ranked_tasks` | `list[dict[str, Any]]` | 점수·제약·tie-break으로 정렬된 작업 |
| `selected_next_actions` | `list[dict[str, Any]]` | 즉시 실행/할당 대상 |
| `assignments` | `list[dict[str, Any]]` | 배정 상세 |
| `reprioritization_reason` | `str \| None` | 재우선순위 사유 |
| `needs_review` | `bool` | 실행 전 사람 확인 필요 여부 |
| `warnings` | `list[str]` | 비치명적 경고 |
| `errors` | `list[str]` | 치명적 검증/라우팅 오류 |
| `priority_plan` | `dict[str, Any] \| None` | 보드/할당/차단/근거 최종 구조 |
| `final_response` | `str \| None` | 사용자용 요약 보드 |

## Nodes

| Node | Responsibility |
| --- | --- |
| `prepare_prioritization_context` | 입력 검증, P0/P1/P2 정책/작업자 기본값/가중치 로드 |
| `ingest_tasks` | 사용자 요청+백로그에서 후보 작업 생성 |
| `normalize_tasks` | ID 누락 생성, 설명/우선순위/기한/담당자/의존성 정규화 |
| `evaluate_task_criteria` | 긴급성/중요도/의존성/자원/비용효과/선호도 점수 |
| `analyze_dependencies` | 의존성 그래프 생성 및 순환 탐지 |
| `check_resource_fit` | 자원·능력 기반 실행 가능성 검사 |
| `rank_tasks` | 점수 통합 후 P 라벨 부여 |
| `decide_reprioritization` | context 변경 시 재평가 필요 판정 |
| `assign_selected_tasks` | 상위 우선순위 실행 항목 작업자 할당(기본값 적용) |
| `request_human_review` | 모호/충돌/자원불일치 작업을 리뷰로 전환 |
| `finalize_priority_plan` | 최종 보드 및 텍스트 응답 작성 |

## Edges

```text
START
  -> prepare_prioritization_context
  -> ingest_tasks
  -> normalize_tasks
  -> evaluate_task_criteria
  -> analyze_dependencies
  -> check_resource_fit
  -> rank_tasks
  -> decide_reprioritization

decide_reprioritization -> evaluate_task_criteria
decide_reprioritization -> assign_selected_tasks

assign_selected_tasks -> request_human_review
assign_selected_tasks -> finalize_priority_plan

request_human_review -> finalize_priority_plan -> END
```

조건부 라우팅:

- 입력/백로그가 모두 없으면 경고와 함께 빈 보드로 `finalize_priority_plan`
- 정규화 실패가 심할 때는 `request_human_review`
- 의존성 순환 시 `request_human_review`
- 긴급 이벤트/마감/자원 변화/우선순위 오버라이드 시 재평가 노드로 루프
- `assign_selected_tasks`에서 P0 충돌·불가배정 시 리뷰로 이동
- 유효한 우선순위/할당/차단 사유가 있으면 바로 최종 출력
- 네트워크 호출 없이 실행, 모델 기반 점수는 주입/모의 허용

## Inputs and Outputs

- Input: 자연어 작업 요청, 기존 백로그, 작업자 목록, 가중치, 정책, 동적 context
- Output: `priority_plan` (정렬작업, 라벨, 다음 실행, 할당, 차단, 경고/오류, rationale)
- 중간 산출물: 정규화된 작업, 평가 결과, 의존성 그래프, 자원 적합성, 정렬 목록, 재조정 사유, 배정

예시 입력 형태:

```json
{
  "input": "Create a task to implement the login system. It is urgent and Worker B should own it.",
  "backlog": [
    {
      "id": "TASK-001",
      "description": "Review marketing website content"
    }
  ],
  "workers": ["Worker A", "Worker B"]
}
```

예시 출력:

```json
{
  "ranked_tasks": [
    {
      "id": "TASK-002",
      "description": "Implement a new login system",
      "priority": "P0",
      "assigned_to": "Worker B",
      "score": 0.94,
      "rationale": ["urgent request", "explicit assignee", "high product impact"]
    },
    {
      "id": "TASK-001",
      "description": "Review marketing website content",
      "priority": "P1",
      "assigned_to": "Worker A",
      "score": 0.48,
      "rationale": ["default priority", "default assignee", "no blocking dependency"]
    }
  ],
  "selected_next_actions": ["TASK-002"],
  "blocked_tasks": [],
  "warnings": ["TASK-001 used default priority and assignee."],
  "needs_review": false
}
```

## Failure Cases

- 입력이 비어있고 기존 백로그도 비면 실패로 처리하지 않고 빈 보드 + 경고 반환
- 잘못된 우선순위 라벨은 정책 허용 시 정규화, 아니면 리뷰 대기
- 우선순위 미기입은 정책 허용 시 P1 기본값 적용 및 기록
- 담당자 미기입은 Worker A 사용 가능 시 기본값 적용
- negation이 포함된 `not urgent` 같은 문구에 대한 파싱 오류를 테스트로 검증
- 의존성 순환은 자동 할당 멈추고 리뷰 경로로
- 자원부족은 할당에서 제거하지 않고 blocked로 유지
- 점수 동일 시 마감일/중요도/노력량/원 입력 순으로 안정 정렬
- 동적 재우선순위는 상한 횟수로 무한루프 방지
- 모델 추출/평가 실패 시 결정론 fallback 또는 review 플래그
- 보안/안전 민감 영역은 가중치보다 하드 제약 우선

## Test Ideas

- 긴급 로그인 요청 + Worker B 지정이 P0 + Worker B 배정되는지 검증
- 우선순위/담당자 미기입 시 기본값(P1, Worker A) 적용 검증
- 기존 백로그와 신규 긴급 작업이 함께 정렬되는지 검증
- 의존성 블록이 완료 전 선행조건 필요를 반영하는지 검증
- 의존성 순환 시 리뷰 라우팅 검증
- 작업자 가용성 변경 시 경고 생성 및 정책 동작 검증
- 긴급 이벤트로 재우선순위가 한 번 실행되어 순서 변경되는지 검증
