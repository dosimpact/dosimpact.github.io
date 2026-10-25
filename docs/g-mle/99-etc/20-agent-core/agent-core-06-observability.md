---
sidebar_position: 6
title: Agent Core Observability
description: Agent Core Observability가 CloudWatch, OpenTelemetry, 로그, 메트릭, 트레이스로 에이전트 운영 상태를 추적하는 방식을 정리합니다.
---

## 강의 요약: Agent Core Observability

## 1. Observability의 목적

**Agent Core Observability는 운영 환경에서 에이전트가 어떻게 동작하는지 투명하게 확인하기 위한 모니터링 계층**입니다.

POC 단계에서는 직접 테스트해보면 되지만, 운영 환경에서는 수십~수백 개 에이전트가 동시에 동작할 수 있습니다.
따라서 다음을 실시간으로 파악해야 합니다.

| 관점  | 확인할 것                     |
| --- | ------------------------- |
| 안정성 | 에러 발생 여부, 재시도 성공 여부       |
| 성능  | 응답 속도, 지연시간               |
| 비용  | 호출 수, 토큰 사용량, CPU/메모리 사용량 |
| 사용량 | 사용자 피크 시간, 활성 세션 수        |
| 디버깅 | 어떤 Tool이 호출됐고 어디서 실패했는지   |

## 2. Observability가 필요한 이유

운영 환경에서는 단순히 “에이전트가 잘 답변하는지”만 보면 부족합니다.

확인해야 할 것:

* 최근 10분간 400/500 에러가 반복되는가?
* 특정 Tool 호출이 실패하고 있는가?
* LLM 호출이 느려지고 있는가?
* 사용자가 몰리는 피크 시간이 언제인가?
* 비용이 어느 컴포넌트에서 증가하는가?
* 에이전트가 예상한 Tool을 실제로 호출했는가?

즉, Observability는 **운영 가능한 에이전트 시스템을 만들기 위한 필수 기능**입니다.

## 3. Agent Core Observability의 두 가지 방식

Agent Core Observability는 두 방식으로 사용할 수 있습니다.

| 방식                   | 설명                                                      |
| -------------------- | ------------------------------------------------------- |
| AWS CloudWatch 기본 연동 | Agent Core 로그·메트릭·대시보드를 CloudWatch에서 바로 확인              |
| Third-party Tool 연동  | OpenTelemetry로 Datadog, Dynatrace, IBM Instana 등으로 내보내기 |

기본적으로는 **CloudWatch Dashboard가 자동 생성**됩니다.

## 4. 기본 제공 기능

Agent Core는 각 컴포넌트별로 로그와 메트릭을 자동 수집합니다.

대상 컴포넌트:

| 컴포넌트           | 관찰 대상                        |
| -------------- | ---------------------------- |
| Runtime        | 에이전트 실행 상태                   |
| Memory         | 메모리 저장·조회                    |
| Gateway        | Tool/API 호출                  |
| Tools          | Browser, Code Interpreter 실행 |
| Identity       | 인증·토큰 접근                     |
| LLM Invocation | 모델 호출 속도와 토큰 사용량             |

개발자가 별도로 코드에 모니터링 로직을 많이 넣지 않아도 기본 지표가 수집됩니다.

## 5. Logs, Metrics, Traces

Observability의 핵심 데이터는 세 가지입니다.

| 항목      | 의미                 |
| ------- | ------------------ |
| Logs    | 상세 실행 기록           |
| Metrics | 수치화된 지표            |
| Traces  | 요청이 시스템을 지나간 전체 경로 |

각각의 역할은 다릅니다.

* **Logs**: 디버깅용 상세 기록
* **Metrics**: 대시보드와 알람용 수치
* **Traces**: 어느 단계에서 시간이 걸리거나 실패했는지 확인

## 6. Trace 구조

Agent Core에서 Trace는 에이전트 작업 흐름을 단계별로 보여줍니다.

구조는 다음과 같습니다.

```text id="cnac9j"
Session
 └─ Trace
     ├─ Span: User Prompt
     ├─ Span: LLM Invocation
     ├─ Span: Tool Call
     └─ Span: Final Response
```

| 단위      | 설명                  |
| ------- | ------------------- |
| Session | 사용자와 에이전트의 전체 대화 세션 |
| Trace   | 하나의 사용자 요청 처리 흐름    |
| Span    | Trace 안의 세부 작업 단위   |

예를 들어 사용자가 “현재 날씨 알려줘”라고 하면, 하나의 Trace 안에 LLM 호출, Weather Tool 호출, 최종 응답 생성이 Span으로 기록됩니다.

## 7. Trace가 중요한 이유

Trace를 보면 다음을 확인할 수 있습니다.

| 확인 항목      | 예시                           |
| ---------- | ---------------------------- |
| Tool 호출 여부 | 날씨 질문인데 Weather Tool을 호출했는가  |
| 병목 지점      | Tool Call이 500ms 걸리는가        |
| 에러 위치      | LLM 호출 실패인지, Tool 호출 실패인지    |
| 최적화 지점     | Cold Start를 줄이면 전체 응답이 빨라지는가 |
| 누락된 단계     | 호출되어야 할 Tool Span이 없는가       |

즉, Trace는 **에이전트 디버깅과 성능 최적화의 핵심 도구**입니다.

## 8. 운영 모니터링의 4대 축

강의에서는 Production Monitoring의 핵심 축을 다음 네 가지로 설명합니다.

| 축           | 핵심 지표                  |
| ----------- | ---------------------- |
| Performance | Latency, 처리 시간         |
| Cost        | 호출 수, 토큰 수, CPU/Memory |
| Reliability | 에러율, 실패율, Throttling   |
| Usage       | 활성 세션, 사용자 피크 시간       |

## 9. Performance 모니터링

성능 관점에서는 다음을 봐야 합니다.

| 지표                    | 의미                    |
| --------------------- | --------------------- |
| LLM Latency           | 모델 호출 속도              |
| Tool Latency          | 도구 호출 속도              |
| Total Processing Time | 요청 전체 처리 시간           |
| Cold Start Time       | Runtime 또는 Tool 시작 지연 |
| Region별 Latency       | 지역별 응답 속도             |

예를 들어 Weather Tool 호출이 500ms 걸린다면, 이를 100ms로 줄여 전체 응답 속도를 개선할 수 있습니다.

## 10. Cost 모니터링

비용 관점에서는 다음을 봐야 합니다.

| 지표                | 의미                           |
| ----------------- | ---------------------------- |
| Daily Invocations | 하루 호출 수                      |
| Token Usage       | LLM 입력·출력 토큰 사용량             |
| Runtime Usage     | Runtime 사용 시간                |
| CPU/Memory Usage  | 실행 환경 자원 사용량                 |
| Tool Usage        | Browser/Code Interpreter 사용량 |

특히 LLM 기반 시스템은 토큰 비용이 크기 때문에 **토큰 사용량 추적**이 중요합니다.

## 11. Reliability 모니터링

신뢰성 관점에서는 다음을 봐야 합니다.

| 지표            | 의미            |
| ------------- | ------------- |
| Error Rate    | 전체 요청 중 실패 비율 |
| 4xx Error     | 클라이언트 요청 문제   |
| 5xx Error     | 서버/서비스 문제     |
| Retry Success | 재시도 후 성공 여부   |
| Throttling    | 호출 제한 발생 여부   |

예를 들어 LLM 호출이 throttling되거나 Runtime 호출이 실패하면 알람을 받아야 합니다.

## 12. Usage 모니터링

사용량 관점에서는 다음을 봐야 합니다.

| 지표              | 의미              |
| --------------- | --------------- |
| Active Sessions | 현재 활성 세션 수      |
| Peak Time       | 사용자 요청이 몰리는 시간  |
| Region Usage    | 지역별 사용량         |
| User Tier Usage | 무료/유료/파워유저별 사용량 |

이 데이터는 단순 운영뿐 아니라 **요금제 설계, 리소스 계획, 멀티 리전 전략**에도 필요합니다.

## 13. CloudWatch Dashboard

Agent Core는 CloudWatch와 기본 통합됩니다.

CloudWatch에서 확인할 수 있는 것:

* Agent Core 컴포넌트별 메트릭
* 로그
* Trace
* 자동 생성된 Observability Dashboard
* 알람 구성
* 성능·비용·에러 추이

장점은 별도 모니터링 시스템을 처음부터 구축하지 않아도 된다는 것입니다.

## 14. Third-party Tool 연동

이미 조직에서 Datadog, Dynatrace, IBM Instana 등을 쓰고 있다면 Agent Core 데이터를 외부로 보낼 수 있습니다.

핵심 표준은 **OpenTelemetry**입니다.

```text id="5oau5l"
Agent Core Observability
 → OpenTelemetry
 → Datadog / Dynatrace / IBM Instana / 기타 도구
```

즉, AWS CloudWatch만 강제되는 것이 아니라 기존 관측성 스택과 통합할 수 있습니다.

## 15. 알람이 필요한 경우

운영 환경에서는 대시보드만 보는 것이 아니라 알람이 필요합니다.

알람 예시:

| 조건                | 알람 이유           |
| ----------------- | --------------- |
| 5xx 에러 급증         | 서버 장애 가능성       |
| LLM latency 증가    | 모델 응답 지연        |
| Tool call 실패 반복   | 외부 API 장애 가능성   |
| Token 사용량 급증      | 비용 폭증 가능성       |
| Throttling 발생     | 한도 초과 또는 트래픽 증가 |
| Active Session 급증 | 스케일링 필요         |

## 16. Lab에서 할 내용

이번 Lab에서는 이미 만든 Agent Core 기반 솔루션에 Observability를 적용합니다.

실습 내용:

1. AWS Console 접속
2. CloudWatch Observability Dashboard 확인
3. Runtime, Gateway, Memory, Tools, Identity 메트릭 확인
4. 로그와 Trace 확인
5. 성능·사용량·에러 지표 분석
6. 필요 시 Third-party Tool 연동 구조 이해

## 17. 핵심 결론

* Observability는 운영 환경의 에이전트 시스템에 필수다.
* Agent Core는 Runtime, Gateway, Memory, Tools, Identity의 메트릭과 로그를 자동 수집한다.
* CloudWatch Dashboard가 기본 제공된다.
* OpenTelemetry를 통해 Datadog, Dynatrace, IBM Instana 등과 연동할 수 있다.
* 핵심 관점은 **Performance, Cost, Reliability, Usage**다.
* Trace는 에이전트의 요청 처리 과정을 Session → Trace → Span 구조로 보여준다.
* Trace를 통해 Tool 호출 누락, 병목, 에러 위치를 디버깅할 수 있다.
* 운영에서는 Dashboard뿐 아니라 알람 설정까지 필요하다.
