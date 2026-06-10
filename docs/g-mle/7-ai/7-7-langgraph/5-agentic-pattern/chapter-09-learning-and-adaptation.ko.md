---
sidebar_position: 9
---

# 9: Learning and Adaptation (ko)

## 패턴 요약

학습과 적응은 정적인 에이전트를 경험 기반으로 개선되는 시스템으로 바꿉니다. 장에서는 학습을 에이전트 내부 상태의 변화, 적응을 그 학습의 가시적 동작 변화로 구분합니다.

이 장은 강화학습, 지도학습, 비지도학습, few-shot/zero-shot 적응, 온라인 학습, 메모리 기반 학습 등을 정리하고, PPO/DPO 같은 정렬·학습 방식, 그리고 SICA, AlphaEvolve, OpenEvolve 같은 피드백 기반 자기 개선 루프를 예시로 듭니다.

초기 LangGraph 구현에서는 완전한 모델 학습, PPO/DPO, 위험한 소스 코드 자기 수정은 구현하지 말고, 조회된 경험 기반 선택, 산출물 생성, 평가, 경량 아카이브/전략 프로필 갱신, 조건부 재시도 또는 검토 라우팅으로 구성된 한정된 적응 루프를 구현해야 합니다.

## 패턴 설명

### 개념 개요

학습과 적응은 에이전트가 시간이 지남에 따라 변하도록 하는 장치입니다. 고정된 프롬프트/워크플로만 따르는 것이 아니라, 결과를 관측하고 유용한 경험을 저장해 다음 실행에서 더 나은 판단에 반영합니다.

이 장의 아이디어는 고전 ML부터 LLM 기반 셀프 임프로브 시스템까지 넓지만, 실제 LangGraph 그래프에서는 "각 실행에서 근거 데이터가 남고 다음 실행에서 전략 선택에 반영되는 관측 가능한 피드백 루프"로 단순화할 수 있습니다.

### 문제

환경 변화, 사용자 선호 변화, 초기 설계에서 다루지 못한 새로운 작업이 생기면 정적 에이전트는 성능이 떨어집니다. 실패 원인, 성공 방식, 평가 피드백이 누적되지 않아 같은 실수를 반복하기 쉽습니다.

학습·적응은 경험 수집, 결과 평가, 미래 동작 조정 메커니즘으로 이를 해결합니다.

### 사용 시점

- 반복 작업에서 과거 결과가 미래 성능에 유익할 때 사용합니다.
- 환경, 데이터, 도구, 사용자 선호가 시간이 지나며 바뀌는 경우 사용합니다.
- 신뢰 가능한 피드백(점수, 벤치마크, 평가자, 사람 리뷰)이 존재할 때 사용합니다.
- 사용자/팀 특성에 맞춰 동작이 바뀌어야 하는 개인화에서 사용합니다.
- 실패에서 재사용 가능한 교훈을 남기고 싶을 때 사용합니다.
- 감사 가능성을 위해 전략/버전/경험 아카이브가 필요한 경우 사용합니다.

### 사용하지 말아야 할 때

- 일회성 작업으로 영속/피드백이 이점이 거의 없을 때 피합니다.
- 신뢰할 수 없는 평가 신호만 있을 경우 잘못된 학습이 강화될 수 있어 사용하지 않습니다.
- 샌드박스, 리뷰, 롤백, 모니터링 없이 생산에서 자율 자기 수정은 피해야 합니다.
- 동의/삭제/보존 규칙이 불명확한 민감 데이터 저장은 피합니다.
- 안정성이 개선보다 중요한 경우 적응을 빈번하게 적용하지 않습니다.
- 경량 메모리 업데이트를 진정한 파인튜닝/강화학습과 동일시하면 안 됩니다.

### 작동 방식

1. 작업/요청 또는 환경 관측을 받습니다.
2. 이전의 성공 전략, 알려진 실패, 사용자 선호 같은 관련 경험을 조회합니다.
3. 전략 선택기가 현재 입력과 경험을 사용해 처리 전략을 결정합니다.
4. 선택된 전략으로 후보 응답/행동을 생성합니다.
5. 평가자가 점수표, 벤치마크, 사용자 피드백 또는 결정론 검증으로 결과를 평가합니다.
6. 입력 요약, 선택 전략, 출력 요약, 점수, 실패 원인, 학습 교훈을 담은 적응 이벤트를 기록합니다.
7. 판단 결과에 따라 최종화, 재시도/전략 수정, 추가 질문, 혹은 사람 검토로 분기합니다.
8. 다음 실행은 저장된 적응 기록을 조회해 행동을 조정할 수 있습니다.

### 트레이드오프

| 이점 | 비용 또는 위험 |
| --- | --- |
| 반복 작업에서 과거 결과를 반영해 행동이 개선됩니다. | 잘못되거나 편향된 피드백이 나쁜 행동을 강화할 수 있습니다. |
| 개인화와 변화하는 환경 대응을 지원합니다. | 영속 상태, 보존 정책, 가시성 구축이 필요합니다. |
| 실패를 교훈이나 전략 업데이트로 재활용합니다. | 경계 없는 적응은 의도한 동작에서 벗어날 수 있습니다. |
| SICA/AlphaEvolve 수준의 벤치마크형 개선을 워크플로에서 구현할 수 있습니다. | 진정한 모델 학습·자기 수정·보상 최적화는 훨씬 강한 안전 통제가 필요합니다. |
| 전략 선택과 점수의 감사 가능한 아카이브를 제공합니다. | 상태와 라우팅이 늘어나 구현/테스트 복잡도가 증가합니다. |

### 최소 예시

```text
사용자 지원 요청
  -> 유사 과거 사례 및 교훈 조회
  -> 응답 전략 선택
  -> 응답 초안 생성
  -> 루브릭 기반 평가
  -> 점수 높음: 성공 교훈 저장 후 완료
  -> 점수 낮음 + 재시도 남음: 전략 수정 후 재시도
  -> 반복 실패/안전성 이슈: 실패 교훈 저장 후 사람 검토 요청
```

### LangGraph 매핑

| 패턴 개념 | LangGraph 요소 |
| --- | --- |
| 현재 경험 | `input`, `task_category`, `normalized_input` 같은 상태 필드 |
| 과거 학습 | `experience_matches`와 선택적 LangGraph 스토어/주입 메모리 저장소 |
| 전략/정책 | `selected_strategy`, `strategy_reason`, `strategy_profile` |
| 전략 기반 실행 | `generate_response` 노드 |
| 보상·점수·피드백 | `evaluate_response` 노드와 `evaluation` 상태 필드 |
| 적응 업데이트 | `adapt_from_result` 노드가 `adaptation_record`와 `archive_update`를 기록 |
| 재시도/리뷰 판단 | `evaluate_response` 뒤 조건부 엣지 |
| 인간 안전 경계 | `mark_needs_review` 노드 |

## LangGraph 구현 목표

이전 해결 사례와 평가 피드백을 이용해 개선되는 적응형 지원 에이전트 예제를 만듭니다. 사용자가 기술 지원/문제해결 요청을 입력하면, 그래프가 과거 유사 사례를 조회하고 전략을 선택해 초안을 작성 후 평가하고, 가벼운 경험 아카이브를 갱신한 뒤 최종 답변을 반환합니다.

구현은 모델 가중치 학습이 아니라 워크플로 단계 적응만 다루며, 메모리 갱신은 상태 또는 스토어 쓰기로 명시하고, 평가기는 모킹 가능하게 하며, 그래프는 자체 소스코드를 수정하지 않습니다. 이 요구사항의 memory 기반 학습, 온라인 학습, SICA형 버전·점수 아카이브, AlphaEvolve/OpenEvolve형 생성-평가-선택 루프에 맞춥니다.

기대 동작:

- 관련 과거 사례가 있으면 이를 사용합니다.
- 성공과 실패 모두 적응 이벤트로 기록합니다.
- 낮은 점수는 한 번 재시도(한정)합니다.
- 낮은 점수/근거 없는/불안전 출력은 반복 시 사람 검토로 이동합니다.
- 최종 출력은 사용된 전략과 생성된 적응 기록을 명시합니다.

## 상태 형태

그래프가 필요로 하는 상태 필드를 나열합니다.

| 필드 | 타입 | 목적 |
| --- | --- | --- |
| `input` | `str` | 원본 사용자 지원 요청/작업 설명. |
| `user_id` | `str \| None` | 사용자 개인화 또는 메모리 네임스페이스 용도 선택 ID. |
| `normalized_input` | `str` | 검색/생성에 쓰기 전에 정제한 입력. |
| `task_category` | `str \| None` | `connectivity`, `account`, `software`, `hardware`, `unknown` 등의 대분류. |
| `experience_matches` | `list[dict]` | 현재 작업과 유사한 과거 사례, 교훈, 전략 기록, 사용자 선호. |
| `strategy_profile` | `dict[str, Any]` | 전략 성공 횟수·평균 점수·주요 함정 등을 담은 경량 정책 데이터. |
| `selected_strategy` | `str \| None` | 선택된 처리 전략(예: `reuse_known_solution`, `diagnostic_steps`, `clarify_first`, `escalate`). |
| `strategy_reason` | `str \| None` | 전략 선택 근거 요약. |
| `draft_output` | `str \| None` | 최종 확정 전 후보 응답. |
| `evaluation` | `dict[str, Any]` | 점수, 통과 여부, 루브릭 노트, 안전 플래그, 결측 정보. |
| `adaptation_record` | `dict[str, Any]` | 실행 요약/선택 전략/점수/결과/교훈을 구조화한 이벤트. |
| `archive_update` | `dict[str, Any] \| None` | 평가 후 경험 아카이브 또는 LangGraph 스토어에 저장할 업데이트 데이터. |
| `retry_count` | `int` | 현재 요청에서 수행한 적응 재시도 횟수. |
| `max_retries` | `int` | 재시도 최대 횟수. 기본값은 `1`. |
| `needs_human_review` | `bool` | 자동 적응을 중단하고 검토가 필요한지 여부. |
| `errors` | `list[str]` | 검증, 조회, 모델, 평가자, 영속화 오류 목록. |
| `final_output` | `dict[str, Any] \| None` | 응답, 상태, 전략, 점수, 적응 메타데이터를 포함한 사용자 결과. |

## 노드

| 노드 | 책임 |
| --- | --- |
| `preprocess_input` | 입력 비어있음 확인, 공백 정리, 재시도/오류/임계값 초기화. |
| `classify_task` | 안정적인 작업 분류 라벨을 생성해 조회/전략 선택에 사용. |
| `retrieve_experience` | 주입된 메모리 소스 또는 LangGraph 스토어에서 유사 사례/교훈/전략 결과/선호 조회. |
| `select_strategy` | 입력, 조회 경험, 전략 프로필 기반으로 처리 전략을 선택. |
| `generate_response` | 선택 전략과 관련 교훈을 활용해 후보 지원 응답을 생성. |
| `evaluate_response` | 결정론적 루브릭/가짜 평가자/LLM 판정기로 초안 점검. 지원 정보 누락, 근거 없는 주장, 안전 이슈 탐지. |
| `revise_strategy` | 평가 불량이며 재시도가 남으면 전략을 조정하고 `retry_count`를 증가. |
| `adapt_from_result` | 결과로부터 `adaptation_record`와 `archive_update` 생성(성공/실패 원인/점수/교훈 포함). |
| `persist_adaptation` | 저장이 설정돼 있으면 아카이브 업데이트를 영속화; 아니면 검사 가능한 상태로 유지. |
| `mark_needs_review` | 비안전/근거없음/반복 저점 출력에 대해 사람 검토 플래그 설정. |
| `finalize` | 최종 답변, 상태, 점수, 전략, 적응 메타데이터를 담은 `final_output` 생성. |

## 엣지

조건부 분기를 포함해 그래프 흐름을 설명합니다.

```text
START
  -> preprocess_input
  -> classify_task
  -> retrieve_experience
  -> select_strategy
  -> generate_response
  -> evaluate_response

evaluate_response -> adapt_from_result -> persist_adaptation -> finalize -> END
evaluate_response -> revise_strategy -> generate_response
evaluate_response -> mark_needs_review -> adapt_from_result -> persist_adaptation -> finalize -> END
```

조건부 엣지 요구사항:

- 점수가 임계값을 충족하고 안전 플래그가 없으면 `evaluate_response`에서 `adapt_from_result`로 이동합니다.
- 점수가 낮고 수정 가능 이슈가 있으며 `retry_count < max_retries`면 `evaluate_response`에서 `revise_strategy`로 이동합니다.
- 출력이 안전하지 않거나 입력/조회 경험 대비 근거가 부족하거나, 재시도 후에도 점수가 낮으면 `evaluate_response`에서 `mark_needs_review`로 이동합니다.
- `revise_strategy`는 반드시 `retry_count`를 증가시키고, `max_retries`를 초과해 루프하지 않아야 합니다.
- `persist_adaptation`는 저장 실패를 숨기면 안 되며 오류를 추가 후에도 `finalize`를 수행해야 합니다.
- 조회/영속은 테스트 가능하도록 주입 가능해야 하며 네트워크나 외부 DB 없이도 동작해야 합니다.

## 입력과 출력

- 입력: 자연어 기술지원/트러블슈팅 요청, 옵션으로 `user_id`, 과거 피드백, 테스트용 인메모리 아카이브.
- 출력: `final_output`으로 답변 또는 검토 요청, 선택 전략, 점수, 상태, 적응 메타데이터를 포함.
- 중간 산출물: 정규화 입력, 작업 카테고리, 조회 경험, 전략 프로필, 선택 전략, 초안, 평가 노트, 적응 기록, 아카이브 업데이트, 오류, 재시도 횟수.

예시 입력 형태:

```json
{
  "input": "My laptop connects to Wi-Fi but the internet stops working after a few minutes.",
  "user_id": "user-123"
}
```

성공 출력 예시:

```json
{
  "status": "ok",
  "answer": "Try forgetting the Wi-Fi network, restarting the router, and reconnecting. If the issue started after an update, also reset the network settings.",
  "selected_strategy": "diagnostic_steps",
  "strategy_reason": "Similar prior connectivity cases succeeded with a stepwise diagnostic checklist.",
  "evaluation": {
    "score": 0.86,
    "passed": true,
    "notes": ["clear steps", "no unsafe instruction"]
  },
  "adaptation_record": {
    "outcome": "success",
    "lesson": "For connectivity issues, start with reversible network diagnostics before escalation."
  }
}
```

## 실패 사례

예상 실패, 재시도, 폴백 동작, 사람 검토 지점을 문서화합니다.

- 빈 입력은 `preprocess_input`에서 모델 호출 없이 실패해야 합니다.
- 관련 경험이 없어도 그래프를 막지 않고, `select_strategy`는 일반 진단 또는 명확화 전략으로 대체해야 합니다.
- 조회 경험이 오래되거나 무관/상충할 수 있음을 고려해 근거로 참고만 하고 진실로 간주하지 않아야 합니다.
- 생성기가 근거 없는 주장을 만들 수 있으므로 `evaluate_response`에서 이를 식별해 재수정 또는 검토로 보냅니다.
- 평가자 출력이 손상되거나 점수 누락 시 오류를 기록하고 재평가 한 번 또는 검토 경로로 전환해야 합니다.
- 최대 재시도 후 점수가 낮으면 `mark_needs_review`로 종료하고 무한 적응 루프를 피해야 합니다.
- 아카이브 저장 실패 시 `archive_update`는 상태에 보존하고 오류를 최종 출력에 노출해야 합니다.
- 민감/개인정보를 보관/업데이트할 때 정책과 네임스페이스 범위가 없으면 저장하지 않습니다.
- 자가 수정은 범위 외 구현입니다. 전략 기록이나 메모리 업데이트까지만 허용하고, 리포지토리 파일/프롬프트/모델 가중치는 수정하지 않습니다.
- 보상 해킹 위험을 인지해야 하며, 점수만 높인 답변이 사용자에 불리해질 수 있으므로 테스트에 "높은 점수지만 근거 없는 답변 거부" 케이스가 필요합니다.

## 테스트 아이디어

- 과거 유사 사례가 조회되고 `diagnostic_steps`가 선택되어 평가 통과 후 적응 기록이 생성되는 정상 경로를 검증합니다.
- 메모리가 없는 cold-start에서도 일반 응답과 아카이브 갱신이 생성되는지 검증합니다.
- 낮은 점수가 `revise_strategy`를 거쳐 `retry_count` 증가 후 통과 시 완료되는지 검증합니다.
- 두 번째 낮은 점수에서 `max_retries` 초과 시 `mark_needs_review` 이동 검증.
- 안전/근거 부족이 있는 생성물은 점수가 있어도 사람 검토로 가는지 검증.
- 저장 실패가 `archive_update`를 잃지 않고 오류로 반환되는지 검증.
- 빈 입력이 조회/생성 전에 중단되는지 검증.
- 가짜 조회기, 생성기, 평가기, 영속 레이어를 주입해 테스트 가능해야 합니다.
- 최종 상태가 항상 `selected_strategy`, `evaluation`, `adaptation_record`, `retry_count`, `errors`, `final_output`을 포함하는지 검증.
- 개인화 시 `user_id` 또는 문서화된 기본 네임스페이스로 조회되는지 검증.

## 열린 질문

- `docs/agentic-design-patterns-toc.md`는 Chapter 9를 논리 페이지 `142-153`로 기록하지만, PDF 추출은 보이는 범위가 `154-166`(chapter-local `1-13`)입니다.
- 첫 구현에서 경험 아카이브를 LangGraph 영구 저장소/체크포인터로 둘지, 아니면 주입 인메모리 저장소로 둘지 결정이 필요합니다.
- 평가는 결정론적 휴리스틱, LLM 심사자, 또는 결정론 가짜를 지원하는 플러그형 인터페이스 중 어떤 것으로 시작할지 결정 필요합니다.
- 사용자별 적응 기록의 보존·개인정보 정책은 어떻게 둘지 정해야 합니다.
- 이후 적응 예제 전체에 공통 적용할 점수 임계값과 재시도 상한은 무엇으로 통일할지 정해야 합니다.
