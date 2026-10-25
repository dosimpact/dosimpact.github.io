---
sidebar_position: 8
title: Agent Core Evaluation
description: Agent Core Evaluation이 세션, 트레이스, 스팬 단위로 에이전트 품질과 안정성을 평가하는 방식을 정리합니다.
---

## 강의 요약: Agent Core Evaluation

## 1. Evaluation의 목적

**Agent Core Evaluation은 에이전트의 응답 품질, 안정성, 목표 달성 여부를 정량적으로 평가하는 기능**입니다. 

핵심은 다음입니다.

> “에이전트가 실제로 잘 동작하는가?”를 감이 아니라 **데이터로 검증**하는 것.

## 2. 왜 Evaluation이 필요한가

에이전트는 확률적 시스템입니다.
몇 번 테스트해서 잘 된다고 해서 항상 잘 된다는 보장이 없습니다.

문제가 생기는 이유:

| 원인        | 설명                |
| --------- | ----------------- |
| 비결정성      | 같은 질문에도 다른 답변 가능  |
| 모델 변경     | LLM 교체 시 품질 변동    |
| 프롬프트 수정   | 작은 수정도 정확도에 영향    |
| 실제 사용자 입력 | 개발자가 예상 못 한 입력 발생 |
| 도구 선택 오류  | 잘못된 Tool 호출 가능    |
| 안전성 문제    | 유해·편향·개인정보 노출 가능  |

따라서 운영 환경에서는 **반복적이고 체계적인 평가 파이프라인**이 필요합니다.

## 3. Vibe Testing이란?

**Vibe Testing은 감으로 테스트하는 방식**입니다.

예시:

1. 에이전트 개발
2. System Prompt 수정
3. 몇 번 직접 테스트
4. 원하는 답변이 나오면 “괜찮네” 하고 종료

문제는 이것이 운영 환경에서는 매우 위험하다는 점입니다.

에이전트가 90%는 잘 동작해도, 10~15%의 엣지 케이스에서 실패할 수 있습니다.
Evaluation은 이런 실패율을 정량적으로 확인하게 해줍니다.

## 4. Evaluation의 두 가지 모드

Agent Core Evaluation은 크게 두 가지 방식이 있습니다.

| 모드                   | 의미                | 사용 시점                 |
| -------------------- | ----------------- | --------------------- |
| On-demand Evaluation | 한 번 실행하는 평가       | 개발, 테스트, CI/CD, 장애 분석 |
| Online Evaluation    | 운영 트래픽을 지속 샘플링 평가 | 프로덕션 모니터링             |

간단히 정리하면:

```text id="3f0hk4"
개발·테스트·특정 시점 분석 → On-demand
운영 환경 지속 평가 → Online
```

## 5. Evaluation 데이터 흐름

Agent Core Evaluation은 Runtime을 직접 호출해서 데이터를 가져오지 않습니다.

흐름은 다음과 같습니다.

```text id="x2eq8u"
Agent Core Runtime
 → OpenTelemetry Export
 → CloudWatch
 → Agent Core Evaluation
 → Evaluation Result
 → CloudWatch
```

중요한 점:

* Runtime에서 OpenTelemetry Export를 켜야 함
* 데이터는 CloudWatch에 저장됨
* Evaluation은 CloudWatch의 로그·Trace 데이터를 기반으로 수행
* 평가 결과도 다시 CloudWatch에 저장됨

## 6. 평가 단위: Session, Trace, Span

Agent Core Evaluation은 세 가지 레벨에서 평가할 수 있습니다.

| 단위      | 의미                     | 평가 예시             |
| ------- | ---------------------- | ----------------- |
| Span    | 가장 작은 작업 단위            | Tool 선택, 파라미터 정확도 |
| Trace   | 사용자 요청 1개에 대한 전체 처리 흐름 | 응답 정확성, 안전성       |
| Session | 여러 턴으로 구성된 전체 대화       | 목표 달성률, 작업 완료율    |

## 7. Span 평가

**Span은 가장 세부적인 평가 단위**입니다.

주로 Tool 사용을 평가합니다.

| 평가 항목                   | 설명                |
| ----------------------- | ----------------- |
| Tool Selection Accuracy | 올바른 도구를 선택했는가     |
| Tool Parameter Accuracy | 도구 파라미터를 정확히 채웠는가 |
| Tool Latency            | 도구 실행 시간이 적절한가    |
| Tool Response           | 도구 결과가 정상인가       |

예를 들어 날씨 질문에 환율 도구를 호출했다면 Tool Selection Accuracy가 낮아집니다.

## 8. Trace 평가

**Trace는 사용자 질문 1개와 에이전트 응답 1개의 전체 흐름**입니다.

평가할 수 있는 항목:

| 평가 항목                 | 설명                 |
| --------------------- | ------------------ |
| Correctness           | 답변이 사실적으로 맞는가      |
| Completeness          | 필요한 정보를 빠짐없이 포함했는가 |
| Helpfulness           | 사용자에게 도움이 되는가      |
| Instruction Following | 지시사항을 잘 따랐는가       |
| Safety                | 유해·편향·개인정보 문제가 없는가 |

Trace는 단일 요청의 품질을 평가하는 데 적합합니다.

## 9. Session 평가

**Session은 사용자와 에이전트의 전체 대화 흐름**입니다.

여러 턴의 대화를 기반으로 평가합니다.

| 평가 항목                | 설명                |
| -------------------- | ----------------- |
| Goal Success Rate    | 사용자의 최종 목표를 달성했는가 |
| Task Completion      | 맡겨진 작업을 끝까지 완료했는가 |
| Conversation Quality | 전체 대화 흐름이 적절했는가   |

예를 들어 사용자가 “남프랑스 자동차 여행 일정을 짜줘”라고 하고 여러 번 수정 요청을 했다면, 최종적으로 완성도 높은 일정이 나왔는지를 Session 단위로 평가합니다.

## 10. On-demand Evaluation

**On-demand Evaluation은 특정 시점의 데이터를 골라 한 번 실행하는 평가**입니다.

사용 사례:

| 상황          | 설명              |
| ----------- | --------------- |
| 개발 중 테스트    | 새 프롬프트나 모델 테스트  |
| CI/CD 파이프라인 | 배포 전 품질 검증      |
| 장애 분석       | 특정 세션·Trace 재평가 |
| 회귀 테스트      | 변경 전후 품질 비교     |

장점은 특정 Session, Trace, Span을 직접 지정해 평가할 수 있다는 것입니다.

## 11. Online Evaluation

**Online Evaluation은 운영 트래픽을 샘플링해서 지속적으로 평가하는 방식**입니다.

특징:

| 항목                    | 설명                   |
| --------------------- | -------------------- |
| Sampling Rate         | 운영 트래픽 중 평가할 비율      |
| Continuous Loop       | 지속적으로 평가 수행          |
| Production Monitoring | 실제 사용자 데이터 기반 품질 확인  |
| Random Sampling       | 특정 세션 지정이 아니라 샘플링 기반 |

주의할 점:

> 운영 환경에서 100% 샘플링은 비용이 커질 수 있으므로 보통 10~20% 정도를 고려한다.

## 12. On-demand vs Online

| 구분     | On-demand                   | Online      |
| ------ | --------------------------- | ----------- |
| 실행 방식  | 한 번 실행                      | 지속 실행       |
| 사용 시점  | 개발·테스트·CI/CD                | 운영 환경       |
| 데이터 선택 | 특정 Session/Trace/Span 지정 가능 | 샘플링 기반      |
| 비용     | 실행할 때만 발생                   | 지속 발생       |
| 목적     | 품질 검증, 회귀 테스트               | 실시간 품질 모니터링 |

## 13. Built-in Evaluation Metrics

Agent Core Evaluation은 기본 평가 지표를 제공합니다.

## 14. Span-level Metrics

| Metric                  | 설명                 |
| ----------------------- | ------------------ |
| Tool Selection Accuracy | 적절한 Tool을 선택했는지    |
| Tool Parameter Accuracy | Tool 입력 파라미터가 정확한지 |

도구가 많아질수록 이 평가는 중요해집니다.
Tool이 50개 이상이면 에이전트가 잘못된 도구를 고를 가능성이 커지기 때문입니다.

## 15. Trace-level Safety Metrics

Safety 평가는 응답의 위험성을 확인합니다.

| Metric             | 설명                     |
| ------------------ | ---------------------- |
| Harmfulness        | 유해한 내용 포함 여부           |
| Stereotyping       | 고정관념·편향 표현 여부          |
| Refusal            | 거절이 필요한 상황에서 적절히 거절했는지 |
| Privacy Protection | 개인정보를 노출하지 않았는지        |
| Topic Adherence    | 주제에서 벗어나지 않았는지         |

특히 **Privacy Protection**은 중요합니다.
에이전트가 실수로 private data를 사용자에게 반환하지 않는지 확인해야 합니다.

## 16. Trace-level Response Quality Metrics

응답 품질 평가는 다음 항목을 봅니다.

| Metric                | 설명                 |
| --------------------- | ------------------ |
| Correctness           | 사실이 맞는가            |
| Completeness          | 필요한 정보가 빠짐없이 포함됐는가 |
| Faithfulness          | 근거와 일치하는가          |
| Helpfulness           | 실제로 도움이 되는가        |
| Instruction Following | 사용자·시스템 지시를 따랐는가   |

## 17. Session-level Metrics

| Metric            | 설명                |
| ----------------- | ----------------- |
| Goal Success Rate | 전체 대화에서 목표를 달성했는가 |

Session 평가는 단일 답변이 아니라 **전체 대화의 결과**를 봅니다.

## 18. Custom Evaluator

기본 지표로 부족하면 직접 평가 지표를 만들 수 있습니다.

두 가지 방식이 있습니다.

| 방식                   | 설명                  |
| -------------------- | ------------------- |
| LLM as a Judge       | LLM이 평가자가 되어 응답을 판단 |
| Code-based Evaluator | 코드로 정해진 규칙을 검사      |

## 19. LLM as a Judge

**LLM as a Judge는 Bedrock 모델과 커스텀 프롬프트를 사용해 평가하는 방식**입니다.

사용 상황:

| 상황        | 예시                |
| --------- | ----------------- |
| 도메인 특화 평가 | 장보기 카트가 적절한지      |
| 정성 평가     | 답변이 충분히 설득력 있는지   |
| 복합 기준 평가  | 정확성 + 친절함 + 형식 준수 |

설정할 것:

* 평가용 모델
* 평가 프롬프트
* 출력 형식

  * label
  * numeric score

## 20. Code-based Evaluator

**Code-based Evaluator는 규칙으로 판정 가능한 경우에 적합**합니다.

예시:

| 검사 방식              | 설명                 |
| ------------------ | ------------------ |
| Regex Matching     | 특정 패턴 포함 여부        |
| JSON Validation    | 응답이 JSON 스키마를 따르는지 |
| Exact Match        | 정확한 문자열 일치         |
| Numeric Comparison | 숫자 결과 비교           |
| Format Check       | 응답 형식 검증           |

정해진 규칙으로 평가할 수 있다면 LLM 평가보다 저렴하고 안정적일 수 있습니다.

## 21. Custom Evaluator 선택 기준

| 상황         | 추천 방식            |
| ---------- | ---------------- |
| 주관적·복합적 평가 | LLM as a Judge   |
| 명확한 정답 있음  | Code-based       |
| 특정 포맷 검증   | Code-based       |
| 도메인 판단 필요  | LLM as a Judge   |
| 비용 최적화 필요  | Code-based 우선 검토 |

## 22. Evaluation 결과

Evaluation 실행 후 다음 결과를 받을 수 있습니다.

| 항목          | 설명          |
| ----------- | ----------- |
| Label       | 평가 지표 이름    |
| Value       | 평가 점수 또는 결과 |
| Explanation | 자연어 설명      |
| Token Usage | 평가에 사용된 토큰량 |

Explanation이 있기 때문에 단순 점수뿐 아니라 **왜 그렇게 평가됐는지**도 확인할 수 있습니다.

## 23. 비용 구조

Agent Core Evaluation 비용은 크게 두 가지로 나뉩니다.

| 구분                 | 비용 구조                               |
| ------------------ | ----------------------------------- |
| Built-in Evaluator | 토큰 기반 과금                            |
| Custom Evaluator   | 1,000 evaluations 기준 비용 + LLM 호출 비용 |

주의할 점:

> Custom Evaluator는 Built-in보다 비용이 더 커질 수 있으므로 필요한 경우에만 써야 한다.

## 24. 실무 적용 패턴

실무에서는 다음 조합이 적절합니다.

| 단계        | 적용 방식                          |
| --------- | ------------------------------ |
| 개발 중      | On-demand Evaluation           |
| 배포 전      | CI/CD에서 On-demand Evaluation   |
| 운영 중      | Online Evaluation              |
| 장애 발생     | 특정 Session/Trace On-demand 재평가 |
| 도메인 품질 확인 | Custom Evaluator               |
| 비용 관리     | Sampling Rate 조정               |

## 25. Lab에서 할 내용

이번 Lab에서는 다음을 실습합니다.

1. Agent Core Runtime 준비
2. Observability와 CloudWatch 연결 확인
3. OpenTelemetry Export 활성화
4. On-demand Evaluation Job 생성
5. Online Evaluation Config 생성
6. Built-in Metrics 사용
7. Custom Evaluator 개념 확인
8. 평가 결과를 CloudWatch에서 확인

## 26. 핵심 결론

* Vibe Testing은 위험하다. 감이 아니라 데이터로 평가해야 한다.
* Agent Core Evaluation은 에이전트 품질을 정량적으로 검증한다.
* 평가 모드는 **On-demand**와 **Online**으로 나뉜다.
* 데이터는 Runtime에서 직접 가져오는 것이 아니라 **OpenTelemetry → CloudWatch**를 통해 수집된다.
* 평가 단위는 **Span, Trace, Session**이다.
* Span은 Tool 선택과 파라미터 정확도를 본다.
* Trace는 단일 응답의 정확성, 안전성, 도움 여부를 본다.
* Session은 전체 대화의 목표 달성 여부를 본다.
* 기본 제공 지표 외에 **LLM as a Judge** 또는 **Code-based** 커스텀 평가도 가능하다.
* 운영 환경에서는 Online Evaluation을 샘플링 기반으로 돌리는 것이 중요하다.
* CI/CD에는 On-demand Evaluation을 넣어 배포 전 품질 저하를 막을 수 있다.
