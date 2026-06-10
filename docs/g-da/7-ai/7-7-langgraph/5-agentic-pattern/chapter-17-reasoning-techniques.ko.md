---
sidebar_position: 17
---

# Requirement: Chapter 17: 추론 기법 (Reasoning Techniques)

## Source

- PDF: `Agentic_Design_Patterns.pdf`
- Section: `Chapter 17: Reasoning Techniques`
- Page range: `246-269` logical pages from `docs/agentic-design-patterns-toc.md`
- 추출 메모: 표시되는 Chapter 17 제목은 PDF 파일 페이지 `262`(zero-based index `261`)에서 확인되며, Chapter 18은 PDF 파일 페이지 `286`(zero-based index `285`)에서 시작합니다. 따라서 추출 구간은 PDF 인덱스 `261-284`, 파일 페이지 `262-285`, 장 내 페이지 카운트 `1-24`입니다. TOC의 논리 범위 `246-269`도 24페이지이지만 PDF 실제 페이지와 16페이지 차이가 있어 경계가 모호합니다. 텍스트 추출 시 공백 불규칙 삽입이 있어 헤딩의 정확 문자열 매칭이 불안정합니다.

## Pattern Summary

추론 기법은 에이전트가 복잡한 문제를 단일 패스 응답이 아니라 의도적으로 추론 단계를 소모하면서 해결하도록 합니다. 이 장에서는 중간 추론 과정을 노출하고 구조화하는 방식으로 추론을 분류합니다. Chain-of-Thought(CoT)는 작업을 단계로 분해하고, Tree-of-Thought(ToT)는 여러 경로를 탐색하며, self-correction은 초안을 검토해 수정하고, PALM은 계산 코드 실행을 통해 기호적 작업을 수행하며, ReAct는 추론과 외부 도구 사용을 교차 수행합니다.

또한 다중 에이전트 관점에서는 CoD, GoD, MASS와 같이 여러 에이전트 또는 주장 구조를 통해 서로 비판하고 검증하는 방식을 보여줍니다. Deep Research는 반복적으로 검색하고, 갭을 반성하며, 쿼리를 다듬고, 인용 보고서를 생성하는 장기형 에이전트 워크플로로 제시됩니다.

첫 LangGraph 예시는 bounded reasoning research 그래프입니다. 사용자 질문을 받아 분해하고, 여러 후보 추론/검색 경로를 탐색하며, 로컬 모의 검색/계산 도구를 사용해 증거를 수집하고, 누락 증거를 반성해서 보정한 뒤, 최종 근거 요약과 증거, 예산 메타데이터를 포함한 응답을 반환해야 합니다.

## Pattern Explanation

### Conceptual Overview

추론 기법은 에이전트를 즉시 답변을 생성하는 장치에서 “구조화된 문제 해결기”로 바꿉니다. 모델에게 즉답하지 말고, 분해·정보 필요성 판단·증거 수집·대안 비교·비판적 검토·최종 확정의 과정을 강제하는 것입니다.

이 장은 추론 깊이를 추론 시 자원으로 해석합니다. 어려운 문제일수록 더 많은 단계, 후보 브랜치, 도구 호출, 반성 루프, 토론이 필요합니다. 구현은 이런 작업량을 상태와 메타데이터로 명시하고, 사용자에는 내부 추론의 생 raw chain이 아니라 간결한 근거 요약만 노출합니다.

### Problem

단일 패스 LLM 응답은 다단계 논리, 외부 증거, 계산, 피드백 기반 수정이 필요한 작업에서 취약합니다. 암묵적 가정 누락, 근거 부족 사실 생성, 초기에 보이는 경로 고착, 부분 결함 등의 문제가 생길 수 있습니다.

이 패턴은 추론을 명시적 워크플로로 바꿉니다. 제한된 추론 예산을 배정하고 중간 산출물을 기록하며, 검색/계산/반성/수정 노드를 라우팅하고, 충분한 근거가 확보되거나 예산 소진 시 종료합니다.

### When to Use

- 분해, 다단계 추론, 전략적 계획이 필요한 작업
- 다수의 근거 또는 도구 호출 결합이 필요한 작업
- 계산, 코드 실행, 기호 조작으로 정밀성 검증이 가능한 작업
- 초안의 정확성·완전성·명확성을 리뷰해야 하는 작업
- 여러 대안 경로를 비교한 뒤 최종화해야 하는 작업
- 장기 연구 워크플로로 추가 탐색과 갱신이 필요한 작업
- 추론 시간 증가에 따른 품질 향상 여유가 있는 작업

### When Not to Use

- 단순 사실 조회/트랜잭션 요청처럼 즉시성 있는 직접답변이 충분한 경우
- 지연, 비용, 도구 쿼터가 추론 이득보다 우선되는 경우
- 내부 chain-of-thought를 그대로 노출해야 하는 요구(안전/보안상 위험)
- 도구가 불필요하거나 신뢰 불가한 환경
- 정해진 정지 조건 없이 분기/토론/반성 루프를 무제한 확장하는 경우
- 구조적 규칙/테스트로 검증 가능한 부분에서 self-correction으로만 대체하는 경우
- 중요도가 낮아 복잡성만 증가하는 다중 에이전트 토론

### How It Works

1. 그래프는 복잡한 질의를 받아 최대 분기 수, 검색 라운드, 도구 호출 수, 반성 라운드를 포함한 추론 예산을 초기화합니다.
2. 질문을 하위 질문·제약·가정·필요 증거로 분해합니다.
3. 브랜치 생성기는 대안 경로/검색 계획/해결 전략을 만듭니다(ToT).
4. 각 브랜치에 대해 ReAct 방식으로 증거 검색·계산 수행·관찰 반영·추가 필요성 판단을 반복합니다.
5. 반성 단계에서 현재 증거가 하위 질문을 충분히 커버하는지 점검하고, 갭이나 모순 발견 시 재루프하거나 종합 단계로 진행합니다.
6. 초안 생성 후 self-correction으로 질문·근거·반증을 재검토해 수정합니다.
7. 최종 응답에서 선택된 브랜치, 도구 사용, 예산 사용량 등의 메타데이터와 함께 답변·근거·요약을 반환합니다.

### Trade-offs

| 이점 | 비용/위험 |
| --- | --- |
| 다단계·증거중심·계산중심 과제의 품질 향상 | 지연, 토큰 사용, 도구 호출, 구현 복잡도 증가 |
| 상태/트레이스/결정 로깅으로 테스트 가능한 추론 아티팩트 | 내부 추론 노출은 오해를 유발할 수 있어 노출 제어 필요 |
| 후보 경로 간 비교·역추적 가능 | 예산/가지치기 없으면 분기 폭주 |
| ReAct는 도구 관찰에 적응 | 도구 실패·저품질 관찰이 후속 추론을 오도 가능 |
| self-correction으로 미지원 주장 선별 | 근거 기반 검증 없으면 피상적 비판에 그칠 수 있음 |
| PALM식 계산으로 수학/코드 작업 신뢰도 향상 | 실행 환경 샌드박스·검증 코드 필요 |
| 토론형 접근으로 편향 완화 | 다중 에이전트 비용 및 검증 난이도 상승 |

### Minimal Example

```text
사용자 요청: "고전 컴퓨터와 양자 컴퓨터를 비교하고 유용한 활용 사례 한 가지를 제시해줘"
  -> 분해: 차이점, 동작 원리, 활용사례
  -> 후보 경로 생성: 하드웨어 비교, 표현 방식, 사례 중심
  -> bits, qubits, 중첩, 얽힘, 약물발견 근거 검색
  -> 반성: 하위 질문 커버 충분성 확인
  -> 초안 작성
  -> self-correct로 미근거 주장 제거 및 간결화
  -> 근거와 추론 요약과 함께 최종 응답
```

### LangGraph Mapping

| 패턴 개념 | LangGraph 요소 |
| --- | --- |
| 복잡한 사용자 작업 | 상태 필드 `input` |
| 추론 시 예산 | 상태 필드 `reasoning_budget`, `budget_used`, `max_reflection_rounds`, `max_tool_calls` |
| CoT 분해 | 노드 `decompose_question`, 상태 `subquestions` |
| ToT 분기 탐색 | 노드 `generate_reasoning_branches`, 상태 `candidate_branches` |
| ReAct-액션-관찰 | 노드 `select_next_action`, `retrieve_evidence`, `execute_computation`, `record_observation` |
| PALM식 기호 계산 | 노드 `execute_computation` + 주입 가능한 로컬 계산 도구 |
| self-correction | 노드 `self_correct_answer`, 상태 `critique` |
| Deep Research 반성 루프 | 노드 `reflect_on_progress`, 조건부로 증거 수집 복귀 |
| 근거 기반 종합 | 노드 `synthesize_answer`, 상태 `supporting_evidence` |
| 사용자 안전 요약 | 상태 `reasoning_summary`(내부 CoT 비공개) |
| 종료 조건 | 조건부 엣지 `answer_ready`, `budget_exhausted`, `needs_more_evidence` |

## LangGraph Implementation Goal

복잡 질문을 처리하는 추론형 리서치 보조자 그래프를 구현합니다. 사용자 질문과 추론 깊이, 라운드 상한, 계산 허용 여부를 받습니다. 과제 분해 → 후보 경로 탐색 → 로컬 목 데이터 조회/선택적 계산 → 갭 반성 → 초안 보정 → 최종 근거 응답 순서로 동작해야 합니다.

네트워크 접근은 필요 없도록 하고, 검색은 메모리 내 지식베이스로 주입 가능합니다. 테스트에서는 증거 있음/없음/충돌/도구 실패 케이스를 재현해야 합니다. 계산은 선택적 로컬 실행으로 제한하고, 실제 검색 API 의존 없이 추론 메커니즘을 데모해야 합니다.

예상 동작:

- 단순 다단계 질문은 한 번의 분해+조회로 완료
- 복잡한 질문은 여러 브랜치 탐색 및 최소 1회 반성 루프
- 수치/기호 하위문제는 계산 노드로 라우팅
- 최종 응답은 내부 chain-of-thought 대신 간결한 근거 요약 제공
- 상태는 증거, 관찰, critique, 선택 브랜치, 예산 사용량 기록
- 증거나 예산이 부족하면 부정확 추정이 아닌 불완전/미지원 표시

## State Shape

| 필드 | 타입 | 용도 |
| --- | --- | --- |
| `input` | `str` | 원본 사용자 질문/작업 설명 |
| `normalized_input` | `str` | 정규화된 질문 문자열 |
| `reasoning_depth` | `str` | `standard`/`deep`/`minimal` |
| `reasoning_budget` | `dict[str, int]` | 분기 수, 반성 라운드, 도구/계산 호출 상한 |
| `budget_used` | `dict[str, int]` | 분기/반성/조회/계산/모델 호출 카운트 |
| `subquestions` | `list[dict[str, Any]]` | 분해된 하위문제·근거 필요성·계산 필요 여부 |
| `candidate_branches` | `list[dict[str, Any]]` | 대안적 추론 경로/계획/전략 |
| `selected_branch_id` | `str \| None` | 현재 평가/종합할 브랜치 ID |
| `action_plan` | `list[dict[str, Any]]` | retrieve/compute/compare/finalize 등의 액션 시퀀스 |
| `next_action` | `dict[str, Any] \| None` | 계획자(Planner)가 다음으로 선택한 액션 |
| `observations` | `list[dict[str, Any]]` | 조회·계산·반성 단계의 순차 결과 |
| `supporting_evidence` | `list[dict[str, Any]]` | 최종 주장에 사용된 근거 조각 |
| `contradictions` | `list[dict[str, Any]]` | 반성에서 발견된 충돌/저신뢰 근거 |
| `knowledge_gaps` | `list[str]` | 미해결 증거 부족 항목 |
| `computation_requests` | `list[dict[str, Any]]` | 계산 요청 목록 |
| `computation_results` | `list[dict[str, Any]]` | 검증된 계산 결과 |
| `draft_answer` | `str \| None` | 보정 전 초안 |
| `critique` | `dict[str, Any] \| None` | 정확성·완전성·근거·명확성 평가 |
| `revised_answer` | `str \| None` | critique 반영 후 답변 |
| `reasoning_summary` | `str \| None` | 사용자 표시용 주요 단계와 근거 요약 |
| `answer_ready` | `bool` | 충분한 근거 확보 여부 |
| `budget_exhausted` | `bool` | 예산 한도 도달 여부 |
| `status` | `str` | `ok`, `partial`, `insufficient_evidence`, `tool_error`, `invalid_input` |
| `errors` | `list[str]` | 검증/조회/계산/종합 오류 |
| `final_output` | `dict[str, Any] \| None` | 사용자 응답/근거 요약/메타데이터 포함 |

## Nodes

| Node | Responsibility |
| --- | --- |
| `prepare_question` | 빈 입력 검사, 정규화, 예산/카운터/상태 초기화 |
| `classify_reasoning_need` | 분해/조회/계산/브랜치 탐색 필요성 판정 |
| `decompose_question` | 하위질문·제약·가정·근거 필요성 분해 |
| `generate_reasoning_branches` | 대안 전략 생성 및 예산 상한 적용 |
| `select_next_action` | 현재 브랜치 기준 미해결 항목 및 예산 기반 다음 액션 결정 |
| `retrieve_evidence` | 주입 가능한 메모리 지식베이스 조회 및 관찰/근거 기록 |
| `execute_computation` | 산술/기호/코드형 하위문제 로컬 계산 실행 및 검증 |
| `record_observation` | 도구 출력 정규화, 카운트 갱신, 충돌 탐지 |
| `reflect_on_progress` | 하위 질문 커버리지 점검 및 answer_ready/예산 초과 판단 |
| `synthesize_answer` | 근거/계산 결과/선택 브랜치 기반 답변 초안 |
| `self_correct_answer` | 질의·근거·모순·제약으로 초안 비판 및 수정 |
| `finalize_response` | 최종 응답 객체 생성(답변/상태/요약/근거/갭/예산) |

## Edges

```text
START
  -> prepare_question
  -> classify_reasoning_need
  -> decompose_question
  -> generate_reasoning_branches
  -> select_next_action

select_next_action -> retrieve_evidence -> record_observation -> reflect_on_progress
select_next_action -> execute_computation -> record_observation -> reflect_on_progress
select_next_action -> synthesize_answer

reflect_on_progress -> select_next_action
reflect_on_progress -> synthesize_answer
reflect_on_progress -> finalize_response

synthesize_answer -> self_correct_answer -> finalize_response -> END
```

조건부 라우팅:

- `classify_reasoning_need`는 입력이 유효하고 단순하며 조회/계산/브랜치가 불필요할 때만 `synthesize_answer`로 즉시 이동
- `select_next_action`은 외부/근거 필요 하위문제면 `retrieve_evidence`로 이동
- 수치·기호·코드 검증 가능한 항목이 있고 계산 허용이면 `execute_computation`으로 이동
- 충분한 근거가 있으나 실행 가능 액션이 없으면 `synthesize_answer`로 이동
- `reflect_on_progress`는 갭이 남고 예산이 있으면 `select_next_action`로 복귀
- `answer_ready`면 `synthesize_answer`, 예산 소진이면 `finalize_response`
- 브랜치/반성/조회/계산 예산을 초과하지 않음
- 도구 노드는 테스트에서 성공/부족/충돌 케이스를 재현할 수 있도록 주입 가능

## Inputs and Outputs

- Input: 복잡한 자연어 질문, 선택적 `reasoning_depth`, 예산 오버라이드, 인메모리 KB 피팅치, 계산 사용 플래그
- Output: `final_output` (`status`, `answer`, `reasoning_summary`, `supporting_evidence`, `knowledge_gaps`, `contradictions`, `selected_branch_id`, `budget_used`, `errors`)
- 중간 산출물: 정규화 질문, 하위질문, 후보 브랜치, 액션 플랜, 관찰, 계산 요청/결과, 초안, critique, 수정 초안, 종료 플래그

예시 입력 형태:

```json
{
  "input": "Compare classical and quantum computers, then give one practical application of quantum computing.",
  "reasoning_depth": "standard",
  "allow_computation": true
}
```

성공 예시:

```json
{
  "status": "ok",
  "answer": "고전 컴퓨터는 0/1 비트 기반 처리, 양자 컴퓨터는 중첩 상태를 갖는 큐비트와 얽힘을 활용합니다. 유용한 응용 사례로 분자 시뮬레이션(신약 후보 탐색)이 있습니다.",
  "reasoning_summary": "질문을 표현 방식·처리 모델·적용 사례로 분해해 각 하위질문에 대한 근거를 확보했고, 최종 답변은 완전성 점검 후 정제했습니다.",
  "supporting_evidence": [
    {
      "id": "kb_quantum_bits",
      "claim": "고전 컴퓨팅은 비트, 양자 컴퓨팅은 큐비트를 사용한다."
    },
    {
      "id": "kb_quantum_applications",
      "claim": "분자 시뮬레이션은 양자컴퓨팅의 대표 응용 분야다."
    }
  ],
  "knowledge_gaps": [],
  "contradictions": [],
  "selected_branch_id": "branch_information_representation",
  "budget_used": {
    "branches": 2,
    "reflection_rounds": 1,
    "retrieval_calls": 2,
    "computation_calls": 0
  }
}
```

부분 응답 예시:

```json
{
  "status": "partial",
  "answer": "주요 계산 모델 비교는 할 수 있으나, 설정한 지식베이스에서 특정 응용 사례를 뒷받침할 근거가 부족합니다.",
  "reasoning_summary": "비교 항목은 확보되었으나 조회 예산이 소진되어 응용 사례 하위질문을 마무리하지 못했습니다.",
  "supporting_evidence": [
    {
      "id": "kb_quantum_bits",
      "claim": "고전 컴퓨팅은 비트, 양자 컴퓨팅은 큐비트를 사용한다."
    }
  ],
  "knowledge_gaps": ["양자 컴퓨팅의 구체적 적용 사례 근거"],
  "budget_used": {
    "branches": 1,
    "reflection_rounds": 2,
    "retrieval_calls": 3,
    "computation_calls": 0
  }
}
```

## Failure Cases

실패 케이스, 재시도, 폴백 동작, 사람 검토 포인트를 명시합니다.

- 빈 입력은 `prepare_question`에서 `status`를 `invalid_input`으로 처리하고 도구를 호출하지 않는다.
- 지원하지 않는 `reasoning_depth`는 `standard`로 폴백하거나 그래프 진행 전 검증 오류를 반환한다.
- 증거 누락은 `status`를 `partial` 또는 `insufficient_evidence`로 처리하고 임의 사실을 생성하지 않는다.
- 상충 근거는 `contradictions`에 기록하고, 추가 조회로 해결하거나 최종 출력에 공개한다.
- 조회 도구 실패는 오류를 추가하고, 시도한 호출만큼만 예산을 소모한 뒤 기존 근거만으로 종합한다.
- 계산 실패는 구조화된 오류로 기록하고, 검증되지 않은 수치/기호 결과를 최종 답변에 포함하지 않는다.
- 예산 소진 시 루프를 종료하고 근거 기반 최선 부분 결과를 반환한다.
- self-correction은 미근거 주장을 제거해야 하며, 주요 미근거가 남으면 최종 상태를 `ok`로 두지 않는다.
- 브랜치 생성은 설정 최대치 초과 생성 금지.
- 반성 루프는 무한반복 금지. 각 라운드는 `budget_used.reflection_rounds` 증가를 보장한다.
- 사용자 출력은 내부 CoT 원문 대신 간결한 근거 요약 및 메타데이터만 노출한다.
- 모든 후보 브랜치가 실패하면 `final_output`에서 해결되지 않은 갭을 설명하고 진단용 메타데이터를 제공한다.

## Test Ideas

- 복잡한 비교 질문이 하위질문으로 분해되어 증거가 모두 있으면 `finalize_response`에서 `status: ok`로 완료되는지 검증한다.
- 증거 누락 케이스가 반성 루프를 최소 1회 발생시킨 뒤 예산 소진 시 `status: partial`로 종료되는지 검증한다.
- 후보 브랜치 수가 `reasoning_budget`를 초과하지 않음을 검증한다.
- 수치형 질문이 계산 허용 시 `execute_computation` 경로를 타는지 검증한다.
- 계산 비활성 시 계산 노드가 스킵되거나 제어된 오류를 반환하는지 검증한다.
- 상충 증거가 기록되고 해소 전까지 근거 없는 `ok`를 만들지 못함을 검증한다.
- 조회 예외가 `errors`에 기록되더라도 그래프가 중단되지 않는지 검증한다.
- `self_correct_answer`가 `supporting_evidence`에 없는 주장을 제거하는지 검증한다.
- `final_output`에 `answer`, `reasoning_summary`, `supporting_evidence`, `knowledge_gaps`, `budget_used`, `status`가 모두 있는지 검증한다.
- 경로가 `max_reflection_rounds`, `max_tool_calls`, 최대 브랜치 수를 넘지 않음을 검증한다.

## Open Questions

- 페이지/인덱스 모호성: TOC는 Chapter 17을 논리 페이지 `246-269`로 보지만 실제 추출은 PDF 파일 페이지 `262-285`(zero-based `261-284`). 요구사항은 TOC 범위를 기준으로 하되 추출 범위를 별도 기록했다.
- 그림은 대부분 캡션(`Fig. 1: CoT prompt...`, `Fig.2: Example of Tree of Thoughts`, `Fig. 3: Reasoning and Act`, `Fig. 4: MASS Framework`, `Fig. 5: Google Deep Research`, `Fig. 6: DeepSearch`, `Fig. 7: Reasoning design pattern`)으로만 추출되어 내부 구조가 빠져 있다.
- 원문 예시의 외부 서비스 구현 예시는 현재 구현 범위를 벗어나므로, 로컬·결정론적 구현을 채택한다.
- 원문은 CoT 노출식 예시가 있으므로 사용자 응답에서는 내부 추론 raw 텍스트가 아닌 근거 메타데이터 중심으로 제한한다.
