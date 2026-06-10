---
sidebar_position: 106
---

# Appendix F: Agents' Reasoning Engines (ko)

## 패턴 요약

Appendix F는 에이전트 추론 엔진의 내부를 다룬다. 본문이 누락/치환된 상태이므로, 구현 상 안전한 해석으로는 작업 분석→전략 선택→작업 메모리 갱신→선택적 도구 동작→자체평가→수정→종결을 수행하는 제어층으로 모델링한다.

LangGraph 예제는 Chapter 17의 추론 기법 전반을 재복제하지 말고, 상태 초기화, 직책한 전략 선택(직접 답변/분해/도구 루프/비판적 수정), 단계 평가, 예산 내 반복, 파이프라인 종료 제어를 노출한다. 최종 산출물은 답변, 사용자 안전형 추론 요약, 선택 전략, 단계 메타데이터, 근거/관측, 종료 이유를 포함한다.

본문이 부정확/누락됨을 감안해 외부 의존·제품 주장·미검증 세부는 피하고, 로컬 테스트 가능한 추론 엔진 시뮬레이터로 구현한다.

## 패턴 설명

### 개념 개요

추론 엔진은 에이전트가 답변이나 행동 전에 어떻게 생각할지 결정하는 부분이다. 단순 모델 호출이 아니라, 맥락 준비, 전략 선택, 도구 필요 판단, 중간 결과 저장, 품질 점검, 종료 조건 등 오케스트레이션 전반을 포함한다.

학습 측면에서는 상태 전이를 명시하면 추론 신뢰성이 좋아짐을 뜻한다. 구현 측면에서는 이런 전이를 관측 가능하고 bounded하게 만들고, 내부 추론은 비공개로 두되 간결한 근거 메타데이터만 노출하는 것이 핵심이다.

### 문제

단일 패스 에이전트는 접근법 선택·중간 상태 유지·증거 충분성 확인·불확실 단계 복구가 필요할 때 실패한다. 추론 엔진이 없으면 왜 직접 답했는지, 분해했는지, 도구 썼는지, 수정했는지, 예산 부족으로 멈췄는지 추적이 어렵다.

### 사용해야 할 때

- 단일 프롬프트가 아니라 여러 전략을 선택해야 할 때.
- 분해, 도구 사용, 비판, 검증, 다중 단계가 필요한 작업.
- 추적 가능성 요구가 높고 테스트로 경로를 검증해야 할 때.
- 비용/지연/스텝 수를 예산으로 제한해야 할 때.
- 최종 결과에 절차 요약이 필요하지만 내부 reasoning 텍스트 노출은 피해야 할 때.
- 다른 패턴 예제의 기반 제어 루프가 필요한 경우.

### 사용하지 말아야 할 때

- 단순 결정론 변환 함수나 단일 모델 호출이면 과도한 그래프 불필요.
- 의미 있는 전략 선택이 없는 작업에 불필요한 제어 추가는 비효율적.
- 무결한 결정론 가드 없이 nondeterministic 라우팅을 허용할 수 없다면 부적합.
- chain-of-thought 원문 노출은 금지.
- 종료 규칙 없는 무한 추론 루프는 위험.
- 엔진 추적을 정답 검증 근거로 과대 해석하지 말아야 한다.

### 작동 방식

1. 사용자 작업 수신 후 추론 예산, 빈 작업 메모리/트레이스/상태 초기화.
2. 복잡도, 지식 요구, 도구 필요, 위험도, 직접 응답 허용 여부 분석.
3. 전략(`direct`, `decompose`, `react_tool_loop`, `critique_and_revise`) 선택.
4. 입력, 제약, 허용 도구, 근거 fixture로 작업 메모리 준비.
5. 다음 단계 제안 후 LLM형 추론 노드나 주입 가능한 로컬 도구로 실행, 단계 요약 기록.
6. 단계 평가에서 개선/갭 탐지/오류/예산 소진 판단.
7. 라우팅: 추가 단계, 전략 변경, 초안 작성, 부분 마무리.
8. 초안은 비판 노드에서 작업·관측·제약과 대조 후 수정.
9. 최종 노드는 답변, 전략, 사용자 안전 추론 요약, 추적 메타데이터, 관측, 오류, 종료 이유 반환.

### 트레이드오프

| 이점 | 비용 또는 위험 |
| --- | --- |
| 상태 전이와 라우트 선택을 추적 가능하게 함 | 단일 모델 호출보다 제어 복잡도 증가 |
| 작업별 전략 분기 가능 | 잘못된 전략 선택은 테스트로 보완 필요 |
| 예산 제한으로 비용/지연 runaway 제어 | 엄격 예산은 최적 답변 전에 중단 가능 |
| 단계 요약은 디버깅/모니터링에 유용 | 요약이 근거 기반이 아니면 거짓 신뢰 형성 |
| 도구/비판 노드로 외부/불확실 태스크 강화 | 도구 실패와 얕은 비판은 별도 처리 필요 |
| 사용자 안전 요약으로 원시 추론 비노출 | 내부 관측은 여전히 테스트/디버깅용으로 유지 |

### 최소 예시

```text
입력:
  "두 주 안에 소형팀이 CSV 가져오기 기능을 배포할 수 있는지 추정해줘.
   제약: 엔지니어 2명, 기존 파서 라이브러리, 테스트 필수."

흐름:
  prepare_task
  analyze_task -> 복잡한 계획 질문, 네트워크 불필요
  select_reasoning_strategy -> decompose + critique_and_revise
  propose_next_step -> 작업 흐름 분해
  execute_reasoning_step -> 파싱, 검증, UI, 테스트, 릴리즈 리스크
  evaluate_step -> 구조는 충분, 리스크 체크 부족
  propose_next_step -> 리스크/가정 재평가
  evaluate_step -> 초안 준비
  draft_answer
  critique_answer -> 불확실성 표시, 과도 추정 삭제
  finalize_response
```

### LangGraph 매핑

| 패턴 개념 | LangGraph 요소 |
| --- | --- |
| 사용자 작업 | `input`, `normalized_input` |
| 엔진 설정 | `engine_config`, `available_strategies`, `reasoning_budget` |
| 작업 프로파일링 | `analyze_task` 노드, `task_profile` |
| 전략 선택 | `select_reasoning_strategy` 노드, `selected_strategy` |
| 작업 메모리 | `working_memory` |
| 다음 단계 제안 | `propose_next_step` 노드, `next_step` |
| 추론 단계 실행 | `execute_reasoning_step` 노드, `step_trace` |
| 도구 동작 | `run_tool_action` 노드, `tool_requests`, `observations` |
| 단계 평가 | `evaluate_progress` 노드, `knowledge_gaps`, `confidence`, `termination_reason` |
| 전략 전환/반복 | `evaluate_progress` 조건부 엣지, `route_decision` |
| 초안·비판 | `draft_answer`, `critique_answer`, `revise_answer` |
| 사용자 안전 요약 | `reasoning_summary` |
| 최종 산출 | `finalize_response` 노드, `final_output` |

## LangGraph 구현 목표

사용자 작업, 제약, 지역 근거(옵션), 허용 도구, 예산 오버라이드를 받아 추론 엔진 컨트롤러를 구성한다. 작업 분석 후 전략을 정하고 제한된 추론 루프를 돌리며, 허용 로컬 도구 호출, 진행도 평가, 초안 비판/수정 후 최종 응답을 반환한다.

테스트에서는 결정론성을 유지한다. 모델 호출은 fake 주입으로 감싼다. 도구는 네트워크 없는 로컬 fixture로 동작한다. 최종 출력은 모델의 내부 chain-of-thought이 아니라 통제 가능한 추론 메타데이터다.

예상:

- 단순 요청은 `direct`로 빠르게 종료.
- 다단계 요청은 `decompose`로 여러 단계 평가 후 완료.
- 도구가 필요한 요청은 허용 도구일 때만 `react_tool_loop`.
- 신뢰도 낮거나 초안 품질 미흡은 비판·수정 노드 거침.
- 예산 소진 시 불완전 항목과 종료 사유를 반환.

## 상태 형태

| 필드 | 타입 | 목적 |
| --- | --- | --- |
| `input` | `str` | 원본 사용자 작업/질문 |
| `normalized_input` | `str` | 정규화된 작업 텍스트 |
| `constraints` | `dict[str, Any]` | 범위/품질/도구/예산/출력 제약 |
| `engine_config` | `dict[str, Any]` | 허용 전략/기본 예산/도구 정책/신뢰 임계값 |
| `available_strategies` | `list[str]` | `direct`, `decompose`, `react_tool_loop`, `critique_and_revise` |
| `selected_strategy` | `str \| None` | 현재 작업 선택 전략 |
| `strategy_history` | `list[dict[str, Any]]` | 전략 선택/전환/근거 기록 |
| `task_profile` | `dict[str, Any]` | 복잡도/도메인/위험/도구·증거 필요/기대 출력 유형 |
| `reasoning_budget` | `dict[str, int]` | 단계/도구/비판/전략전환/모델 호출 한도 |
| `budget_used` | `dict[str, int]` | 사용된 단계/도구/비판/전략전환/모델 호출 수 |
| `working_memory` | `dict[str, Any]` | 하위목표/가정/임시 결론/미결정 사항 |
| `next_step` | `dict[str, Any] \| None` | 다음 추론/도구 단계 |
| `step_trace` | `list[dict[str, Any]]` | 실행 단계 요약(사용자 안전형) |
| `tool_requests` | `list[dict[str, Any]]` | 추론 루프에서 제안된 도구 요청 |
| `observations` | `list[dict[str, Any]]` | 로컬 도구/근거 fixture/검증 결과 |
| `knowledge_gaps` | `list[str]` | 확인되지 않은 정보/가정 |
| `errors` | `list[str]` | 검증/전략/도구/파싱/평가 오류 |
| `confidence` | `float` | 0.0~1.0 신뢰도 |
| `route_decision` | `str \| None` | 다음 라우트: `continue`, `use_tool`, `switch_strategy`, `draft`, `partial`, `fail` |
| `draft_answer` | `str \| None` | 임시 답변 |
| `critique` | `dict[str, Any] \| None` | 지원성·완성도·제약·명료성 검토 |
| `revised_answer` | `str \| None` | 비판 반영 수정본 |
| `reasoning_summary` | `str \| None` | 원시 추론 대신 공개 가능한 간결 요약 |
| `termination_reason` | `str \| None` | `answer_ready`, `budget_exhausted`, `invalid_input`, `tool_unavailable`, `insufficient_evidence` |
| `status` | `str` | `ok`, `partial`, `invalid_input`, `blocked`, `failed` |
| `final_output` | `dict[str, Any] \| None` | 최종 구조화 결과 |

## 노드

| 노드 | 책임 |
| --- | --- |
| `prepare_task` | 입력 검증, 필드 정규화, 기본 config/예산 설정, 빈 상태 초기화 |
| `analyze_task` | 복잡도/위험/증거/도구 필요/예상 출력 유형 분류 |
| `select_reasoning_strategy` | `available_strategies` 기반 초기 전략 선택 |
| `prepare_working_memory` | 하위목표/가정/미해결 질문/로컬 근거를 메모리에 정재 |
| `propose_next_step` | 전략·갭·신뢰도·예산 잔여 기준 다음 단계 제안 |
| `execute_reasoning_step` | 주입 가능한 추론 실행 및 `step_trace`에 요약 추가 |
| `run_tool_action` | 허용 로컬 도구/fixture 조회 실행, 관측 저장 |
| `evaluate_progress` | 초안 가능/추가 단계 필요/전략 전환/종료 판단 |
| `switch_strategy` | 정체 시 전략 전환(전환 예산 허용 시) |
| `draft_answer` | 작업 메모리/관측/근거 기반으로 임시 답변 생성 |
| `critique_answer` | 초안을 기준으로 요구사항·제약·관측과 대조 |
| `revise_answer` | 미지원 주장 제거 및 가정 정리해 최종 후보 생성 |
| `finalize_response` | 상태, 답변, 추론 요약, 전략 메타데이터, 추적 요약, 갭, 오류, 예산 사용량 집계 |

## 엣지

```text
START
  -> prepare_task
  -> analyze_task
  -> select_reasoning_strategy
  -> prepare_working_memory
  -> propose_next_step

propose_next_step -> execute_reasoning_step -> evaluate_progress
propose_next_step -> run_tool_action -> evaluate_progress

evaluate_progress -> propose_next_step
evaluate_progress -> switch_strategy -> propose_next_step
evaluate_progress -> draft_answer
evaluate_progress -> finalize_response

draft_answer -> critique_answer
critique_answer -> revise_answer
critique_answer -> finalize_response
revise_answer -> finalize_response

finalize_response -> END
```

조건부 엣지 요구사항:

- `prepare_task`에서 입력 공백 시 `status: "invalid_input"`로 종료.
- 도구 호출이 필요하고 예산이 남으면 `run_tool_action`, 아니면 추론 실행.
- `propose_next_step`은 분해/분석/비교/초안 준비 단계에서 `execute_reasoning_step`로 이동.
- 갭이 남고 단계 예산 있으면 `evaluate_progress`에서 다시 `propose_next_step`.
- 신뢰도 정체 또는 전략 불일치일 때 전환 예산 남으면 `switch_strategy`.
- 신뢰도 임계 충족 또는 유용한 추가 단계 없음이면 `draft_answer`.
- 예산 소진 후 미완성일 때 `status: "partial"`로 종료.
- 비판에서 보정 가능한 위반/부족/명확성 문제 시 `revise_answer`.
- 비판이 허용되거나 횟수 소진이면 즉시 최종.
- 단계/도구/비판/전략전환/모델 호출 예산 초과 금지.

## 입력 및 출력

- 입력: 자연어 작업, 선택적 제약, 지역 근거 fixture, 선택적 허용 도구, 선택적 `available_strategies`, 예산 오버라이드.
- 출력: `final_output`에 상태, 답변, 추론 요약, 선택 전략, 전략 이력, 종료 이유, 신뢰도, 갭, 추적 요약, 관측, 예산 사용량, 오류 포함.
- 중간 산출물: 작업 프로파일, 메모리, 다음 단계, 단계 추적, 도구 요청, 관측, 초안, 비판, 수정 초안.

예시 성공 출력:

```json
{
  "status": "ok",
  "answer": "A two-week CSV import feature is feasible only if the scope is limited to a known schema, server-side validation, error reporting, and automated tests. Custom mapping, background processing, or large-file optimization should be deferred.",
  "reasoning_summary": "The engine classified the request as a bounded planning task, decomposed the work into implementation and risk areas, checked assumptions, and revised the answer to mark unsupported scope as deferred.",
  "selected_strategy": "decompose",
  "strategy_history": [
    {"strategy": "decompose", "reason": "The task requires multi-step feasibility analysis."}
  ],
  "termination_reason": "answer_ready",
  "confidence": 0.82,
  "knowledge_gaps": [],
  "trace_summary": [
    {"step": "identify_workstreams", "result": "Found parser integration, validation, UI, tests, and release risks."},
    {"step": "check_assumptions", "result": "Marked schema stability and file size as key assumptions."}
  ],
  "budget_used": {
    "steps": 2,
    "tool_calls": 0,
    "critique_rounds": 1,
    "strategy_switches": 0,
    "model_calls": 4
  },
  "errors": []
}
```

예시 부분 출력:

```json
{
  "status": "partial",
  "answer": "I can outline the likely approach, but the configured budget ended before the graph could verify file-size and schema assumptions.",
  "reasoning_summary": "The engine decomposed the task and found unresolved assumptions before budget exhaustion.",
  "selected_strategy": "decompose",
  "termination_reason": "budget_exhausted",
  "confidence": 0.48,
  "knowledge_gaps": ["maximum expected CSV file size", "whether custom column mapping is in scope"],
  "budget_used": {
    "steps": 1,
    "tool_calls": 0,
    "critique_rounds": 0,
    "strategy_switches": 0,
    "model_calls": 2
  },
  "errors": []
}
```

## 실패 사례

- 빈 입력은 `prepare_task`에서 `invalid_input`.
- 모르는 전략명은 무시하거나 기본값으로 대체.
- 전략 선택 실패 시 단순은 `direct`, 복잡은 `partial`/`failed`.
- 사용 불가 도구 요청은 실행하지 않고 대체 경로 없으면 `tool_unavailable`.
- 도구 예외는 에러 수집·트레이스 기록하고 시도 횟수만 집계.
- 낮은 신뢰도 반복은 전환 예산 있을 때만 `switch_strategy`.
- 예산 소진 시 편집 없이 부분답과 갭 반환.
- 비판 실패는 초안을 삭제하지 않고 경고 및 신뢰도 하락 포함.
- raw chain-of-thought 비노출, 요약/근거 중심 출력.
- fake 모델이 영원히 추가 단계만 요청해도 결정론적으로 종료.
- Appendix F 본문 모호성은 내부 단정 회피와 generic 제어루프 테스트로 대응.

## 테스트 아이디어

- 단순 변환/포맷 요청이 `direct`로 1단계 이내인지 확인.
- 다단계 계획 요청이 `decompose`와 다중 단계 요약 후 `ok` 종료.
- 도구 요청이 허용된 경우만 `run_tool_action`.
- 금지 도구는 실행 없이 `partial` 또는 `failed`.
- 낮은 신뢰도로 전략 전환이 1회 이내로 제한되는지.
- 예산 소진 시 종료 사유가 `budget_exhausted`.
- 비판이 약한 주장 제거/경고 반영 후 최종 반영.
- `final_output` 필수 항목(`answer`, `reasoning_summary`, `selected_strategy`, `termination_reason`, `budget_used`, `errors`) 존재.
- raw chain-of-thought 노출 없음.
- fake 모델 무한 요청 시 루프 고정 종료.
- Appendix F 모호성으로 생긴 구현 가정이 외부 의존 없이 반영되는지.

## 열린 질문

- 본문 추출이 누락되어 TOC(`383-396`)와 실제 본문이 어긋난다.
- Appendix F 정규 위치가 없어서 다음에 나온 Glossary의 추론 용어 정의로만 보완 가능.
- 향후 보정 PDF/정본이 오면 본 요구사항은 그에 맞게 재작성되어야 한다.
