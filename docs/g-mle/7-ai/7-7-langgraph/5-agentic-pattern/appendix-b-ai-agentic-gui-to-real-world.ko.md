---
sidebar_position: 102
---

# 요구사항: 부록 B: AI Agentic Interactions: GUI에서 실세계 환경으로

## 출처

- PDF: `Agentic_Design_Patterns.pdf`
- 섹션: `Appendix B - AI Agentic Interactions: From GUI to Real World environment`
- 페이지 범위: `docs/agentic-design-patterns-toc.md` 기준 논리 페이지 `358-363`
- 추출 참고: Appendix B 제목은 PDF 페이지 라벨 `378` / 파일 1-based 페이지 `378` / 0 기반 인덱스 `377`에서 발견되었고, 다음 부록 Appendix C는 라벨 `385` / 인덱스 `384`에서 발견된다. 따라서 추출 범위는 PDF 인덱스 `377-383`, 파일 페이지 `378-384`, 부록 내부 페이지 `1-7`이다. TOC 범위는 6페이지이므로 오프셋 불일치가 있다.

## 패턴 요약

Appendix B는 텍스트/API 중심이 아닌 GUI와 유사 실세계 환경에서 동작하는 에이전트에 대해 다룬다. Agent-Computer Interface는 화면을 인지하고 상호작용 가능한 GUI 요소를 식별한 뒤, 작업 맥락에서 해석하고 마우스·키보드 동작을 제어하며 변경되는 인터페이스의 시각적 피드백을 추적하는 연결 고리로 설명된다.

같은 상호작용 루프는 카메라, 마이크, 음성, 화면 공유를 사용하는 멀티모달 물리 환경으로 확장된다. 에이전트는 주변 상황을 이해해 실시간 지원을 제공한다. 또한 온라인/다중 앱 실행 위험성이 있어, 명시적 권한, 안전 필터링, 피드백, 반복 정제가 필수임을 지적한다.

첫 LangGraph 예제는 제한된 GUI/환경 상호작용 컨트롤러를 구현해야 한다. 그래프는 사용자 작업과 시뮬레이션된 관측값을 받아, 인터페이스 요소 인식, 다음 동작 선택, 안전/승인 필요성 확인, 주입 가능한 환경 어댑터 실행, 피드백 관측, 일반 실패 복구, 추적 가능한 완료 보고서를 반환해야 한다.

## 패턴 설명

### 개념 개요

이 패턴은 에이전트를 환경의 배우로 본다. 정해진 인수의 정적 API 호출 대신 현재 보이는 상태를 읽고, 어떤 요소가 실행 가능할지 추론한 뒤, 다음 동작을 결정해 실행하고, 환경이 기대대로 변했는지 확인한다.

Appendix B는 웹사이트, 데스크톱 앱, 폼, 팝업, 대시보드, 문서처럼 시각 인터페이스 뒤에 남아 있는 실제 워크플로를 강조한다. 또한 멀티모달 입력(카메라 이미지, 음성, 공유 화면)으로 구동되는 실세계 상호작용으로의 확장을 제시한다.

### 문제

전통 자동화는 고정 셀렉터/API 가정이나 인터페이스 불변성 가정에 취약하다. 실제 사용자 흐름은 다중 앱 이동, 로딩 상태, 팝업, 시각 해석, 민감 동작의 사전 승인 필요 등으로 이뤄진다.

본 패턴은 이런 문제를 한 번에 큰 모델 응답으로 감추지 않고, 관찰(현재 환경)→실행 가능 요소 이해→작은 다음 단계 계획→안전 실행→재확인 루프를 명시함으로써 불확실성, 차단 상태, 승인 지점을 노출한다.

### 사용해야 할 때

- GUI/브라우저/데스크톱/모바일/멀티모달 환경에서 작업을 완료해야 할 때.
- API가 없거나 부정확하거나 사용자의 실제 흐름을 충분히 반영하지 못할 때.
- 화면 변경, 팝업, 로딩, 검증 오류, 다단계 폼에 반응해야 할 때.
- 여러 도구를 넘나들며 한 화면의 값을 다른 화면에 입력하는 작업이 있을 때.
- 관측 상태, 실행 동작, 안전 승인 이력을 추적해야 할 때.
- 민감하거나 되돌리기 어려운 동작을 명시적 승인 게이트 뒤에 두어야 할 때.

### 사용하지 말아야 할 때

- 안정된 API/DB 작업이 더 안전하고 결정론적으로 충분한 경우.
- 실세계 제어를 높은 위험으로 수행해야 하나 검증된 액추에이터, 강한 안전 한계, 인간 감독이 없어도 되는 경우.
- 신뢰할 수 있는 스크린샷/접근성 트리/멀티모달 관측 확보가 불가능한 경우.
- 개인 데이터를 접근하거나 저장할 수 없는 환경.
- 원샷 답변, 단순 검색흐름, 단일 도구 호출이면 충분한 작업.
- 승인 없는 구매·메시지·금전거래·계정 변경·파괴적 조작을 자동으로 수행해서는 안 되는 경우.

### 작동 방식

1. 사용자 작업, 대상 환경 유형, 제약, 안전 정책을 받는다.
2. 스크린샷 텍스트, 접근성 노드, DOM 유사 요소, 멀티모달 노트 등 현재 관측값을 취득/수신한다.
3. 버튼/필드/링크/대화상자/라벨/경고/비활성 제어 등 후보 GUI/환경 요소를 인식한다.
4. 그 요소들을 작업 맥락으로 해석해 어떤 동작이 사용자의 목표와 관련 있는지 판단한다.
5. 클릭/입력/스크롤/드래그/대기/clarification 요청/승인 요청 같은 작은 동작 1개 이상을 계획한다.
6. 다음 동작을 안전 규칙, 신뢰도 임계값, 권한 요구와 대조해 검토한다.
7. 승인된 동작을 환경 어댑터로 실행 후 결과 피드백을 관측한다.
8. 환경 변화·요소 누락·검증 오류·동작 실패 시 복구 경로로 전환한다.
9. 목표 완료, 차단, 위험, 승인 필요, 스텝 상한 초과 시 종료한다.

### 트레이드오프

| 이점 | 비용 또는 위험 |
| --- | --- |
| 안정 API가 없는 워크플로도 자동화 가능 | GUI 관측이 노이즈가 있어 오해 가능 |
| 동작 후 관측으로 동적 화면 대응 | 반복 observe-act가 지연/비용 증가 |
| 다중 앱/표면 간 작업 처리 가능 | 앱 간 흐름은 개인정보, 권한, 감사 난이도 증가 |
| 기존 소프트웨어 사용성에 적합한 인간형 상호작용 | GUI 동작은 구조화 도구 호출보다 덜 결정론적 |
| 안전 게이트로 민감 동작 격리 | 정책 누락/애매성 시 위험 동작 통과 가능 |
| 실행 추적으로 거동 점검 용이 | 추적 로그 자체가 민감 화면 데이터를 포함할 수 있음 |

### 최소 예시

```text
입력:
  task: "이 결제 페이지에서 청구 금액을 찾아 환급 폼에 넣어라."
  observation:
    - 청구서 테이블이 있는 브라우저 페이지
    - 다른 시뮬레이션 앱에 개방된 환급 폼
  safety_policy:
    - 제출 전 사용자 승인 필요

흐름:
  observe_environment -> 페이지와 폼이 보임
  recognize_elements -> 총액 셀, 금액 입력 필드, 제출 버튼
  interpret_context -> 총액을 금액 필드에 복사
  plan_next_action -> 금액 필드에 "$248.90" 입력
  safety_review_action -> 허용
  execute_action -> 금액 필드 업데이트
  observe_feedback -> 폼에 값 반영
  plan_next_action -> 제출 버튼 클릭
  safety_review_action -> 승인 필요
  request_human_approval -> 제출 전 정지

출력:
  status: "needs_approval"
  pending_action: "submit reimbursement form"
  action_trace: observed, typed amount, verified field value
```

### LangGraph 매핑

| 패턴 개념 | LangGraph 요소 |
| --- | --- |
| 사용자 작업과 환경 목표 | 상태 필드 `input`, `task_goal`, `environment_type`, `constraints` |
| 시각/멀티모달 인지 | 노드 `observe_environment`, 상태 `observations`, `current_observation` |
| GUI 요소 인식 | 노드 `recognize_elements`, 상태 `recognized_elements` |
| 맥락 해석 | 노드 `interpret_context`, 상태 `task_context`, `element_interpretations` |
| 단계적 동작 계획 | 노드 `plan_next_action`, 상태 `action_plan`, `pending_action`, `step_count` |
| 안전 및 권한 게이트 | 노드 `review_action_safety`, 상태 `safety_policy`, `safety_findings`, `needs_approval` |
| 민감 동작 승인 | 노드 `request_human_approval`, 상태 `human_approval` |
| 마우스/키보드/브라우저/환경 동작 | 노드 `execute_action`, 상태 `action_result`, `action_trace` |
| 동작 후 동적 피드백 | 노드 `observe_feedback`, 상태 `feedback_observation`, `environment_events` |
| UI 변경 복구 | 노드 `recover_from_failure`, 상태 `recovery_attempts`, `errors` |
| 완료/차단 종료 | 노드 `finalize_interaction_report`, 상태 `interaction_report` |

## LangGraph 구현 목표

GUI/환경 상호작용 컨트롤러의 LangGraph 예제를 구축한다. 사용자는 작업 목표, 환경 유형, 초기 관측치, 선택적 제약, 안전 정책, 스텝 상한을 제공한다. 그래프는 반복적으로 관측→요소 인식→다음 동작 계획→허용 여부 검사→주입 가능한 어댑터 실행→결과 기록한다.

1차 구현은 로컬/결정론적/안전해야 한다. 실제 데스크톱·브라우저·폰·카메라·마이크·결제 사이트·물리 장치는 제어하지 않는다. 환경 어댑터는 테스트용 fake 또는 메모리 시뮬레이터를 사용하고, 모델 동작은 주입 가능해야 한다.

예상 결과:

- 작업/관측 존재성 검증.
- 원시 관측을 인식 요소와 과제 관련 해석으로 변환.
- 긴 스크립트 대신 한 번에 하나의 바운드 동작 계획.
- 민감 동작은 차단하거나 승인 경유.
- 각 동작 후 피드백을 보고 계속/복구/도움 요청/중단 판단.
- 최종 `interaction_report`에 상태, 완료 동작, 대기 승인, 실패, 관측, 안전 이슈 포함.

## 상태 형태

| 필드 | 타입 | 목적 |
| --- | --- | --- |
| `input` | `str` | 원본 사용자 작업 설명 |
| `task_goal` | `str` | GUI/환경에서 달성해야 할 구체적 목표 |
| `environment_type` | `str` | 대상 표면: `browser`, `desktop`, `mobile`, `multimodal`, `simulated_physical` |
| `constraints` | `dict[str, Any]` | 범위 제한, 금지 동작, 허용 앱, 출력 요구, 마스킹 규칙 |
| `safety_policy` | `dict[str, Any]` | 민감 동작/승인 게이트/차단 도메인/개인정보/최대 자율성 규칙 |
| `initial_observation` | `dict[str, Any]` | 시작 화면, DOM 유사 스냅샷, 접근성 트리, 이미지 설명, 환경 노트 |
| `current_observation` | `dict[str, Any] \| None` | 계획에 사용되는 최신 관측 |
| `observations` | `list[dict[str, Any]]` | 시간/스텝 기준의 관측 이력 |
| `recognized_elements` | `list[dict[str, Any]]` | 후보 버튼/필드/링크/라벨/대화상자/경고/비활성 요소 |
| `element_interpretations` | `list[dict[str, Any]]` | 인식 요소의 과제 관점 의미, 신뢰도, 수행 가능성 |
| `task_context` | `dict[str, Any]` | 전송할 값, 대상 필드, 페이지 상태, 가정 등 수행에 필요한 사실 |
| `action_plan` | `list[dict[str, Any]]` | 동작 유형/대상/값/근거/예상 효과/위험 수준 |
| `pending_action` | `dict[str, Any] \| None` | 안전 검토·실행을 위해 선택된 다음 동작 |
| `action_result` | `dict[str, Any] \| None` | 실행 후 환경 어댑터 결과 |
| `action_trace` | `list[dict[str, Any]]` | 계획·승인·실행·실패·건너뜀·차단의 감사 추적 |
| `environment_events` | `list[dict[str, Any]]` | 로딩, 팝업, 검증 메시지, 내비게이션 변경 등 피드백 이벤트 |
| `safety_findings` | `list[dict[str, Any]]` | 위험/개인정보/불가역/금지 동작 정책 판정 |
| `needs_approval` | `bool` | 계속 진행 전 승인 필요 여부 |
| `human_approval` | `dict[str, Any] \| None` | 대기 동작에 대한 승인/거부/수정/추가 제약 |
| `step_count` | `int` | 완료한 observe-plan-act 반복 수 |
| `max_steps` | `int` | 자율 반복의 하드 캡 |
| `recovery_attempts` | `int` | 누락 요소·실패·예기치 않은 피드백 후 복구 시도 수 |
| `max_recovery_attempts` | `int` | 복구 루프 하드 캡 |
| `interaction_status` | `str` | `ready`, `running`, `needs_approval`, `completed`, `blocked`, `failed` |
| `errors` | `list[str]` | 검증/인지/계획/실행/안전/복구 오류 |
| `interaction_report` | `dict[str, Any] \| None` | 최종 구조화 보고서 |

## 노드

| 노드 | 책임 |
| --- | --- |
| `prepare_interaction_task` | 필수 필드 검증, 기본값 정규화, 카운터·트레이스 목록 초기화, 상태 설정 |
| `observe_environment` | 초기 관측 로드 또는 어댑터에서 최신 관측 요청 |
| `recognize_elements` | 원시 관측을 구조화된 GUI/환경 요소와 신뢰도 점수로 변환 |
| `interpret_context` | 과제 목표에 따라 중요한 요소·사실을 판별 |
| `plan_next_action` | 다음 바운드 동작과 기대 피드백 선택 또는 완료/차단 판단 |
| `review_action_safety` | `pending_action`을 정책·위험도·개인정보·승인 요구와 교차 검토 |
| `request_human_approval` | 승인 요청 메시지를 띄워 `human_approval` 반영 |
| `execute_action` | 주입 가능한 가짜 또는 실제 어댑터 인터페이스로 승인 동작 실행 및 결과 기록 |
| `observe_feedback` | 실행 후 내비게이션 변경/검증 메시지/팝업/오류 추출 |
| `decide_next_step` | 다음 동작/복구/승인/완료/차단/실패로 라우팅 |
| `recover_from_failure` | 대기/재관측/무해 팝업 닫기/스크롤/명확화 요청 같은 bounded 복구 |
| `finalize_interaction_report` | 상태, 액션 추적, 관측, 승인 대기, 안전 판정, 오류를 포함한 보고서 생성 |

## 엣지

```text
START
  -> prepare_interaction_task
  -> observe_environment
  -> recognize_elements
  -> interpret_context
  -> plan_next_action
  -> review_action_safety

review_action_safety -> execute_action
review_action_safety -> request_human_approval
review_action_safety -> finalize_interaction_report

request_human_approval -> execute_action
request_human_approval -> finalize_interaction_report

execute_action
  -> observe_feedback
  -> decide_next_step

decide_next_step -> observe_environment
decide_next_step -> recover_from_failure -> observe_environment
decide_next_step -> request_human_approval
decide_next_step -> finalize_interaction_report

finalize_interaction_report -> END
```

조건부 엣지 요구사항:

- `review_action_safety`에서 정책 위반이면 `interaction_status: "blocked"`로 `finalize_interaction_report` 이동.
- 동작이 민감/불가역/외부 가시/거래성/낮은 신뢰도면 `request_human_approval`로 이동.
- 승인 시에만 `request_human_approval`에서 `execute_action`로 이동.
- 승인 없음이면 `interaction_status: "needs_approval"`, 거부면 `blocked`로 `finalize_interaction_report` 이동.
- 직전 동작 성공 후 미완료 작업이면 `decide_next_step`에서 `observe_environment`.
- 환경 예기치 변화, 대상 누락, 검증 오류, 결과 불확실 시 `recover_from_failure` 경로.
- 복구에 민감·불명확 동작이 필요하면 `request_human_approval`.
- 완료/차단/실패 또는 `step_count >= max_steps`면 `finalize_interaction_report`.

## 입력 및 출력

- 입력: 작업 목표, 환경 유형, 초기 관측, 선택적 제약, 안전 정책, 최대 스텝, 최대 복구 시도, 선택적 승인.
- 출력: `interaction_report`로, 상태, 요약, 완료 동작, 건너뛴/차단 동작, 대기 승인, 최종 관측, 안전 판정, 오류, 추적 포함.
- 중간 산출물: 인식 요소, 해석, 과제 맥락, 액션 플랜, 대기 동작, 액션 결과, 관측 이력, 환경 이벤트, 복구 시도.

예시 출력:

```json
{
  "status": "needs_approval",
  "summary": "Copied the invoice total into the reimbursement form and paused before submission.",
  "completed_actions": [
    {
      "type": "type",
      "target": "amount_field",
      "value": "$248.90",
      "verified": true
    }
  ],
  "pending_action": {
    "type": "click",
    "target": "submit_button",
    "reason": "Submitting the reimbursement form is externally visible."
  },
  "safety_findings": [
    {
      "policy": "approval_required_for_form_submission",
      "severity": "medium"
    }
  ],
  "errors": []
}
```

## 실패 사례

- `task_goal` 또는 `initial_observation`이 없으면 액션 실행 없이 `interaction_status: "failed"`와 검증 오류.
- 빈 관측/낮은 신뢰도 인식은 제한된 재관측 또는 명확화 요청 후 실패로 전환.
- 대상 요소 누락은 스크롤/대기/재관측/clarification으로 복구 시도.
- 로딩 상태는 제한된 대기 후 재관측 경로를 사용.
- 예상치 못한 팝업은 분류 후 처리; 결제/권한/동의/계정 다이얼로그는 인간 리뷰.
- 입력/제출 이후 검증 오류는 `environment_events`에 기록하고 계획/복구로 라우팅.
- 금지 동작은 실행 전 차단하고 `safety_findings`에 기록.
- 구매/제출/계정 변경/메시지/업로드/다운로드/파괴 편집은 명시적 승인 필요.
- `max_steps` 또는 `max_recovery_attempts` 도달 시 trace 보존하며 `failed` 또는 `blocked` 종료.
- 환경 어댑터 예외는 관측/이력 손실 없이 구조화 오류로 변환.

## 테스트 아이디어

- 필드 인식 → 입력 → 반영 확인 → 완료의 정상 흐름 검증.
- 제출/구매 동작이 실행 전 `request_human_approval`로 가는지 검증.
- 승인 거부 시 `interaction_status: "blocked"`로 종료되는지 검증.
- 요소 누락 시 제한된 복구 후 새 관측에서 요소가 나타나면 성공하는지 검증.
- 로딩 이벤트가 안전하지 않은 액션 증가 없이 대기/재관측으로 처리되는지 검증.
- `max_steps`가 미완료 작업을 추적 가능한 트레이스와 함께 중단하는지 검증.
- 요소 인식·동작 계획이 결정론적 fake로 테스트되는지 검증.
- 가짜 어댑터가 승인 동작만 받는지 검증.
- 제약에서 요구 시 민감 필드가 redaction 되는지 검증.

## 열린 질문

- TOC는 Appendix B를 `358-363`으로 표시하나 추출은 파일 라벨 `378-384`(local `1-7`)로 나타난다.
- progress 파일 제목은 `Appendix B: AI Agentic From GUI to Real world environment`로, 추출 제목은 `Appendix B - AI Agentic Interactions: From GUI to Real World environment`이다.
- 본문은 특정 제품/프로젝트 예시를 들지만, 구현은 현재 외부 서비스 가용성이나 동작에 의존하지 않는다.
