---
sidebar_position: 6
---

# 요구사항: Chapter 6: Planning

## 출처

- PDF: `Agentic_Design_Patterns.pdf`
- 섹션: `Chapter 6: Planning`
- 페이지 범위: `docs/agentic-design-patterns-toc.md` 기준 논리 페이지 `91-103`
- 추출 참고: 보이는 Chapter 6 제목은 PDF 페이지 라벨 `100` / 0 기반 인덱스 `99`에서 확인되며, Chapter 7은 PDF 라벨 `113` / 0 기반 인덱스 `112`에서 시작한다. 이 문서는 TOC 논리 범위를 유지하면서 추출 경계는 라벨 `100-112`를 따른다.

## 패턴 요약

Planning은 높은 수준의 목표를 실행 가능한 순서 있는 단계로 바꾸는 능력이다. 장에서는 반응형 동작에서 목표 지향 동작으로 이동하며, 초기 상태·목표 상태·제약·의존성·가능한 액션을 이해하고 목표에 이르는 순서 계획을 수립한다고 본다.

이미 절차가 안정적으로 정해져 있을 때는 고정 워크플로가 낫다. 반대로 과정이 미리 정해지지 않았거나 새 정보에 적응해야 하거나, 도구 조정/절차 변경이 필요한 경우 planning이 유용하다.

구현상 planning은 점검 가능한 plan-execute-replan 루프로 동작해야 한다. 구조화된 계획 생성, 검증, 의존성 순서 실행, 진행도 평가, 필요시 replanning, 최종 보고 생성(완료 항목과 미해결 격차 포함)을 수행해야 한다.

## 패턴 설명

### 개념 개요

Planning 에이전트는 스크립트가 아닌 목표를 받는다. 예: 오프사이트 기획, 온보딩, 연구 보고서 작성. 에이전트는 현재 상태에서 목표 상태로 가기 위한 행동 순서를 결정한다.

핵심은 적응성이다. 초기 계획이 영구적이어서는 안 된다. 장소가 불가하거나 출처가 부족하거나 하위 작업에서 새 제약이 생기면 실행을 멈추고 블라인드하게 진행하기보다 남은 계획을 갱신해야 한다.

### 문제

반응형 에이전트는 즉각 응답은 잘하지만, 복잡 업무에는 선행 탐색, 순차 의존성, 중간 체크, 제약 준수, 증거 확보가 필요하다. 계획 없이 진행하면 잘못된 순서 호출, 필수 단계 누락, 제한사항 위반, 증거 부족 상태의 최종 답변이 발생한다.

Planning은 실행 전 의도를 구조화하고, 새 관측에 따라 경로를 바꾸는 메커니즘으로 이를 해결한다.

### 사용해야 할 때

- 다단계로 종속된 작업이 요구될 때
- 고정 순서가 아니라 선택형 액션 시퀀스가 필요할 때
- 연구, 워크플로 자동화, 온보딩, 진단, 콘텐츠 계획, 내비게이션 등 중간 마일스톤이 있는 작업에서
- 실행 중 공백/장애/변경 제약이 생겨 replanning이 필요한 경우
- 계획을 리뷰/승인용으로 드러내야 할 때

### 사용하지 말아야 할 때

- 단순 1단계 변환/질문
- 절차가 이미 고정·감사 가능·반복적·안정적일 때 동적 계획은 피한다.
- 예측 불가능한 자율성이 안전/컴플라이언스 리스크를 크게 키울 때 피한다.
- 단계 결과 검증이 불가해 계획이 실제로 진전 중인지 확인할 수 없을 때 피한다.
- 안전하지 않은 실제 액션에 대해 승인/롤백이 명확하지 않을 때 피한다.

### 작동 방식

1. 사용자의 목표, 제약, 컨텍스트, 허용 도구를 캡처한다.
2. 목표 달성에 필요한 step, 의존성, 기대 결과, acceptance criteria를 포함한 구조화 계획 생성.
3. 계획의 완전성, 순서, 도구 가용성, 순환/불가능 의존성 검증.
4. 필요 시 실행 전 계획을 노출해 리뷰 또는 승인.
5. 다음 준비된 단계를 실행하고 관측·산출물·오류·증거를 저장.
6. 단계 성공 여부와 잔여 계획 적합성 평가.
7. 진행도/차단/재시도 조건 기반으로 계속 진행, 재계획 또는 중단.
8. 완료 단계/증거/미해결 갭을 바탕으로 최종 결과 합성.

### 트레이드오프

| 이점 | 비용 또는 위험 |
| --- | --- |
| 복잡한 작업을 관측 가능하게 만들고 단계 순서를 드러낸다. | 간단한 프롬프트보다 더 많은 오케스트레이션 상태가 필요. |
| 새 정보 변화에 적응할 수 있다. | 재계획이 약한 기준으로 루프/드리프트 발생 가능. |
| 도구·의존성·중간 산출물을 정리해 조율한다. | 단계 오류와 부분 결과를 명시 모델링해야 함. |
| 연구/자동화에 대한 감사 추적이 좋아진다. | 생성 계획이 그럴듯해 보여도 필수 단계를 놓칠 수 있다. |
| 실행 비용이 큰/부작용이 큰 단계에 실행 전 리뷰를 추가할 수 있다. | 사람 승인 포인트가 지연과 구현 복잡도를 증가. |

### 최소 예시

```text
Goal: 시장 트렌드에 대한 짧은 연구 브리프 작성

Plan:
1. 하위 질문 정의
2. 각 하위 질문의 관련 소스 노트 수집
3. 비교 및 공백 식별
4. 중요 공백이 있으면 계획 수정
5. 미해결 질문을 포함한 근거 기반 브리프 작성
```

### LangGraph 매핑

| 패턴 개념 | LangGraph 요소 |
| --- | --- |
| 사용자 목표/제약/컨텍스트 | `input`, `goal`, `constraints`, `source_notes` |
| 생성된 action sequence | `create_plan` 노드가 `plan` 리스트 작성 |
| 계획 유효성 검사 | `validate_plan` 노드 및 valid/repairable/failed 분기 |
| 선택적 계획 승인 | `review_plan` 노드 또는 실행 전 인터럽트 |
| 단계별 실행 | `select_next_step`, `execute_step` 노드 |
| 진행도 평가 | `assess_progress`가 `observations`, `knowledge_gaps`, 단계 상태 업데이트 |
| 적응적 계획 | `replan` 노드와 `validate_plan`으로의 조건부 복귀 |
| 최종 합성 | `synthesize_report` 노드가 `final_output` 생성 |
| 실패/불가 목표 | `mark_needs_review` 종료 노드 |

## LangGraph 구현 목표

`source_notes` 기반으로 소규모 연구 브리프를 계획·실행하는 LangGraph 예제를 구현한다. 사용자 요청은 높은 수준의 연구 목표와 선택적 제약(목표 독자, 길이, 비교 차원 등)이다. 그래프는 구조화된 계획 생성, 검증, 각 단계 실행(결정론적 로컬 코퍼스 또는 공급된 노트 사용), 누락 증거 확인, 필요 시 replanning, 그리고 최종 보고서와 실행 계획·증거 노트를 반환한다.

실시간 웹 검색에 의존하지 않도록 하고, 테스트에서 플래너/실행기를 mock할 수 있게 하되 계획 검증, 의존성 순서, replanning, 최종 합성을 검증한다.

## 상태 형태

그래프가 필요로 하는 상태 필드를 정리한다.

| 필드 | 타입 | 목적 |
| --- | --- | --- |
| `input` | `str` | 원본 사용자 작업/연구 요청. |
| `goal` | `str` | 입력에서 추출한 정규화 목표. |
| `constraints` | `dict` | 대상 독자, 길이, 필수 섹션, 허용 도구, 기한 등 제약. |
| `source_notes` | `list[dict]` | 실행기에 제공되는 공급 노트/fixture 기반 source snippet. |
| `plan` | `list[dict]` | 단계별 구조(`id`, `description`, `depends_on`, `tool`, `acceptance_criteria`, `status`). |
| `plan_errors` | `list[str]` | 필드 누락, 순환 의존성, 미지원 도구 같은 검증 오류. |
| `approved_plan` | `bool` | 실행 가능한 승인 상태. 테스트에서는 기본 true. |
| `current_step_id` | `str or None` | 현재 실행할 단계 ID. |
| `step_results` | `dict[str, dict]` | 완료된 각 단계의 결과 아티팩트. |
| `observations` | `list[str]` | 실행 중 수집된 사실/도구 출력/진행 노트. |
| `knowledge_gaps` | `list[str]` | 누락 증거, 미해결 질문, 미충족 acceptance criteria. |
| `execution_history` | `list[dict]` | 계획, 검증, 실행, 평가, 재계획 결정의 기록. |
| `replan_count` | `int` | 수행한 replanning 횟수. |
| `max_replans` | `int` | 허용 replanning 상한. |
| `max_steps` | `int` | 무한 실행 방지 가드. |
| `blocked_reason` | `str or None` | 자동 지속 불가 사유. |
| `final_report` | `str` | 실행 후 생성된 최종 브리프/답변. |
| `status` | `str` | `ok`, `needs_review`, `failed`. |
| `final_output` | `dict` | 상태, 최종 보고서, 계획, 증거, 갭을 담은 사용자 결과. |

## 노드

| 노드 | 책임 |
| --- | --- |
| `prepare_input` | 입력 정규화, 빈 목표 거부, 카운터 초기화, 기본 제약 로드. |
| `create_plan` | 모델에게 목표 기반 구조화된 dependency-aware plan 작성 요청. |
| `validate_plan` | 스키마/필수 필드/의존성 순서/도구 가용성/acceptance criteria를 검사. |
| `repair_plan` | `plan_errors` 기반으로 plan 수정 요청. |
| `review_plan` | 계획 승인 기록(초기 구현은 explicit false가 아니면 auto-approve). |
| `select_next_step` | 의존성이 완료된 다음 단계 선택. |
| `execute_step` | 선택 단계에 대해 로컬 소스 노트 또는 mock 도구 실행 및 결과 저장. |
| `assess_progress` | 단계 충족 여부 판단, 갭/블로커가 재계획 필요성 있는지 평가. |
| `replan` | 관측·갭·차단을 반영해 남은 계획 갱신(완료 항목은 보존). |
| `synthesize_report` | 완료 단계/증거/미해결 갭 기반 최종 브리프 생성. |
| `mark_needs_review` | 안전하게 계속할 수 없을 때 계획/이력/오류/갭을 보존해 종료. |

## 엣지

그래프 흐름을 조건부 분기 포함해 설명한다.

```text
START -> prepare_input -> create_plan -> validate_plan

validate_plan -> repair_plan -> validate_plan
validate_plan -> review_plan -> select_next_step
validate_plan -> mark_needs_review -> END

review_plan -> mark_needs_review -> END
select_next_step -> execute_step -> assess_progress
select_next_step -> synthesize_report -> END

assess_progress -> select_next_step
assess_progress -> replan -> validate_plan
assess_progress -> synthesize_report -> END
assess_progress -> mark_needs_review -> END
```

조건부 엣지 요구사항:

- `validate_plan`은 plan이 유효할 때 `review_plan`로.
- `validate_plan`은 repair 가능한 invalid plan일 때 `repair_plan`로.
- `validate_plan`은 불가능/안전하지 않음/지원 불가 또는 repair 후에도 invalid이면 `mark_needs_review`로.
- `review_plan`은 승인 시 `select_next_step`로.
- `review_plan`은 승인 거부/필요 수정 누락 시 `mark_needs_review`로.
- `select_next_step`은 모든 필수 단계 완료 또는 더 진행 필요 없으면 `synthesize_report`로.
- `assess_progress`는 step 성공 + 추가 단계 남음일 때 `select_next_step`.
- `assess_progress`는 recoverable blocker 또는 갭 발생하며 `replan_count < max_replans`이면 `replan`.
- `assess_progress`는 blocker 미복구/정지/재계획 소진이면 `mark_needs_review`.
- `assess_progress`는 핵심 증거가 충분하면 일부 갭이 남아 있어도 `synthesize_report`.

## 입력과 출력

- 입력: 연구/워크플로 목표와 선택적 제약, source notes.
- 출력: `status`, 완료된 plan, 단계 결과, 증거 노트, 미해결 갭을 포함한 최종 브리프/실행 결과.
- 중간 산출물: 정규화 목표, 생성된 계획, 검증 오류, 복구된 계획, 단계 출력, 관측, 갭 분석, 재계획 시도, execution history.

예시 입력 형태:

```json
{
  "input": "Create a short research plan for evaluating whether our team should adopt retrieval-augmented generation for customer support.",
  "constraints": {
    "max_steps": 4
  }
}
```

성공 출력 형태 예시:

```json
{
  "status": "ok",
  "final_report": "A concise research brief synthesized from the completed plan.",
  "plan": [
    {
      "id": "step_1",
      "description": "Identify the main sub-questions for the research goal.",
      "status": "complete"
    }
  ],
  "knowledge_gaps": [],
  "evidence": [
    {
      "source_id": "note_1",
      "summary": "Relevant source note used by the graph."
    }
  ]
}
```

## 실패 사례

예상 실패, 재시도, 폴백, 인간 검토 포인트를 기록한다.

- 입력이 비어 있거나 모호하면 `prepare_input`에서 실패 또는 `needs_review`로 보내기 전에 계획 호출하지 않음.
- 누락 필드, 미지원 도구, 과도한 단계 수, 순환 의존성 계획은 repair 시도 횟수 내에서 `repair_plan`로.
- 복구 실패 후 여전히 invalid이면 `mark_needs_review`.
- 의존성이 미완인 단계 선택은 오류 처리. 순서 위반 실행 금지.
- 단계 결과가 acceptance criteria를 못 맞추면 recoverable이면 `replan`.
- 출처 증거 부족은 `knowledge_gaps`로 기록하고 추측으로 보고서 작성 금지.
- replanning은 완료된 작업은 유지하고 plan 전체를 초기화하지 않음(근본적으로 못 쓰는 경우 제외).
- replanning 루프는 `max_replans`, `max_steps`로 상한 필요.
- side-effect 도구는 명시적 승인 없이는 실행 불가.
- 모델/도구 오류는 `execution_history`에 캡처되어 `final_output`에 반영.

## 테스트 아이디어

- 정상 경로: mock된 유효 plan이 모든 단계를 실행하고 `status: ok`로 최종 보고를 반환하는지 검증.
- invalid plan 스키마가 `repair_plan`을 거쳐 회복 후 계속 진행되는지 검증.
- 순환 의존성 또는 미지원 도구가 repair 실패 후 `needs_review`로 종료되는지 검증.
- 단계가 의존성 완료 후에만 실행되는지 검증.
- 복구 가능한 증거 부족이 `replan`을 호출하고 완료 결과를 유지하는지 검증.
- `replan_count`와 `max_steps`가 무한 루프를 막는지 검증.
- 계획/검증/실행/평가/재계획 이벤트가 `execution_history`에 기록되는지 검증.
- 최종 합성이 미해결 `knowledge_gaps`를 허위로 메우지 않는지 검증.
- plan 승인 거부가 `mark_needs_review`로 가는지 검증.
- 빈 입력이 planner 호출 전에 실패하는지 검증.

## 열린 질문

- TOC는 Chapter 6을 `91-103`으로 표시하지만 PDF 텍스트 추출의 장 경계는 라벨 `100-112`(인덱스 `99-111`)이다. 향후 요구사항에서 TOC 논리 페이지, 추출 라벨, 또는 둘 중 하나만 사용할지 결정 필요.
- 장의 Deep Research 예시는 실시간 웹 검색/외부 API를 포함한다. 예제는 테스트 가능하도록 결정론적 로컬 노트를 사용했는데, 추후 실 검색을 별도 도구 구성으로 추가할지 결정 필요.
- 장의 모델 이름 일부가 구형 예시이므로 하드코딩을 피하고 향후 repo 공통 모델 설정을 참조해야 한다.
