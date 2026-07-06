---
sidebar_position: 3
title: Agent Core Memory
description: Agent Core Memory의 단기 메모리, 장기 메모리, Memory ID, Session ID, Namespace 구조를 정리합니다.
---

## 강의 요약: Agent Core Memory

## 1. Memory의 목적

**Agent Core Memory는 에이전트가 이전 대화, 사용자 선호, 과거 작업 내용을 기억하게 해주는 기능**입니다. 

기존 LLM은 대화가 끝나거나 컨텍스트 윈도우를 벗어나면 정보를 잊습니다.
Memory는 이 한계를 보완해 **개인화된 에이전트 경험**을 만들기 위한 컴포넌트입니다.

## 2. 왜 Memory가 필요한가

LLM은 기본적으로 **컨텍스트 윈도우 안의 정보만 기억**합니다.

문제는 다음과 같습니다.

| 문제      | 설명                   |
| ------- | -------------------- |
| 컨텍스트 제한 | 모든 과거 대화를 매번 넣을 수 없음 |
| 비용 증가   | 토큰이 많아질수록 호출 비용 증가   |
| 속도 저하   | 긴 컨텍스트는 응답 속도를 늦춤    |
| 개인화 부족  | 사용자의 과거 선호를 기억하지 못함  |

따라서 운영 환경의 에이전트는 별도 저장소와 메모리 관리가 필요합니다.

## 3. Agent Core Memory가 해주는 일

Agent Core Memory는 직접 DB나 벡터 저장소를 만들지 않아도 다음을 처리해줍니다.

| 기능           | 설명                     |
| ------------ | ---------------------- |
| 대화 저장        | 사용자와 에이전트의 메시지 저장      |
| 도구 호출 저장     | Tool invocation과 결과 저장 |
| 단기 메모리       | 세션 단위 대화 이력 저장         |
| 장기 메모리       | 선호, 요약, 지식, 학습 내용 추출   |
| 비동기 분석       | 과거 대화를 분석해 장기 기억 생성    |
| Namespace 관리 | 사용자별·세션별 메모리 분리        |

## 4. Short-term Memory

**Short-term Memory는 사용자와 에이전트의 실제 상호작용 기록**입니다.

저장되는 항목은 다음과 같습니다.

| 항목             | 예시               |
| -------------- | ---------------- |
| User message   | 사용자의 질문          |
| Agent response | 에이전트 답변          |
| Tool call      | 호출한 도구           |
| Tool result    | 도구에서 반환된 구조화 데이터 |

보관 기간은 **7일~365일** 사이에서 설정할 수 있습니다.

즉, Short-term Memory는 “이전에 어떤 대화를 했는가?”를 그대로 저장하는 영역입니다.

## 5. Long-term Memory

**Long-term Memory는 Short-term Memory를 분석해 중요한 정보만 추출한 기억**입니다.

예를 들어:

```text id="ykt8ri"
사용자: 나는 ANA 항공을 선호하고, 호텔은 조용한 곳을 좋아해.
```

Short-term Memory에는 이 문장이 그대로 저장됩니다.

Long-term Memory에는 다음처럼 구조화될 수 있습니다.

```json
{
  "airline_preference": ["ANA"],
  "hotel_preference": "quiet hotel"
}
```

즉, Long-term Memory는 단순 대화 로그가 아니라 **재사용 가능한 지식·선호·요약 정보**입니다.

## 6. Memory의 주요 ID 개념

Agent Core Memory에서는 다음 ID 구조를 이해해야 합니다.

| 개념         | 의미              |
| ---------- | --------------- |
| Memory ID  | 사용자별 큰 메모리 버킷   |
| Session ID | 특정 대화 세션        |
| Actor ID   | 메시지 작성자 구분      |
| Event      | 저장되는 상호작용 단위    |
| Namespace  | 장기 메모리 저장 경로 구조 |

## 7. Memory ID

**Memory ID는 특정 사용자에게 연결된 큰 메모리 공간**입니다.

예를 들어 사용자 A가 여러 번 에이전트와 대화했다면, 그 모든 세션의 단기·장기 메모리가 하나의 Memory ID 아래에 저장됩니다.

```text id="nyl7ap"
Memory ID: user_123
 ├─ Session 1
 ├─ Session 2
 └─ Session 3
```

## 8. Session ID

**Session ID는 하나의 대화 흐름을 구분하는 값**입니다.

사용자가 오늘 한 대화와 다음 주에 한 대화는 서로 다른 Session ID를 가질 수 있습니다.

```text id="v07htq"
User A
 ├─ session_001: 오늘 대화
 ├─ session_002: 내일 대화
 └─ session_003: 다음 주 대화
```

## 9. Actor ID

**Actor ID는 메시지가 누구에게서 왔는지 구분합니다.**

보통 다음 두 가지입니다.

| Actor | 의미          |
| ----- | ----------- |
| User  | 사용자가 보낸 메시지 |
| Agent | 에이전트가 보낸 응답 |

이 구분이 있어야 나중에 장기 메모리를 만들 때 **사용자의 선호**와 **에이전트의 답변**을 구분할 수 있습니다.

## 10. Event

**Event는 메모리에 저장되는 기본 단위**입니다.

예를 들어:

* 사용자 메시지 1개
* 에이전트 응답 1개
* 도구 호출 1개
* 도구 결과 1개

를 각각 Event로 저장할 수 있습니다.

다만 비용 최적화를 위해 매번 하나씩 저장하기보다 **Batching**이 중요합니다.

## 11. Batching이 중요한 이유

Agent Core Memory의 단기 메모리 비용은 Event 수에 영향을 받습니다.

따라서 모든 메시지를 개별 Event로 저장하면 비용이 커집니다.

예를 들어:

| 방식              | 설명    |
| --------------- | ----- |
| 메시지마다 Event 생성  | 비용 증가 |
| 세션 단위로 Batch 저장 | 비용 절감 |

강의 예시에서는 세션의 20개 턴을 하나씩 저장하는 대신, 하나의 Event로 묶으면 단기 메모리 비용을 약 **20분의 1**로 줄일 수 있다고 설명합니다.

## 12. Long-term Memory 생성 방식

Long-term Memory는 Short-term Memory를 기반으로 비동기 Job이 생성합니다.

흐름은 다음과 같습니다.

1. 사용자와 에이전트가 대화
2. Short-term Memory에 Event 저장
3. Agent Core가 비동기 Job 실행
4. LLM이 과거 대화를 분석
5. 선호, 요약, 지식 등을 추출
6. Long-term Memory에 저장

개발자가 직접 분석 파이프라인을 만들 필요가 없습니다.

## 13. Long-term Memory 전략

Agent Core Memory는 여러 장기 메모리 전략을 제공합니다.

| 전략              | 설명              | 예시                 |
| --------------- | --------------- | ------------------ |
| Semantic        | 의미 기반 지식 조각 저장  | 과거 해결된 지원 티켓       |
| Summary         | 대화 요약 저장        | 이전 프로젝트 논의 요약      |
| User Preference | 사용자 선호 저장       | 선호 항공사, 연락 방식      |
| Episodic        | 경험·학습·반성까지 저장   | 이전 상호작용에서 얻은 교훈    |
| Custom          | 직접 정의한 추출·저장 방식 | JSON 스키마 기반 선호 구조화 |

## 14. Semantic Memory

**Semantic Memory는 의미 기반 지식 저장에 적합**합니다.

예를 들어 고객 지원 에이전트에서 과거에 해결했던 문제를 저장해두면, 비슷한 문제가 다시 들어왔을 때 빠르게 해결책을 찾을 수 있습니다.

```text id="5tvfmd"
이전 티켓에서 해결된 문제 → 다음 유사 티켓에 재사용
```

## 15. Summary Memory

**Summary Memory는 이전 대화 내용을 요약해 저장**합니다.

사용자가 다시 돌아와서 “지난번에 하던 프로젝트 이어서 해줘”라고 할 때 유용합니다.

전체 대화 로그를 다시 넣지 않고도 핵심 내용을 불러올 수 있습니다.

## 16. User Preference Memory

**User Preference Memory는 사용자의 선호를 저장**합니다.

예시:

| 도메인  | 저장 가능한 선호      |
| ---- | -------------- |
| 여행   | 선호 항공사, 호텔 스타일 |
| 쇼핑   | 좋아하는 브랜드, 가격대  |
| 고객지원 | 선호 연락 방식       |
| 피트니스 | 식단 제한, 운동 스타일  |

개인화 에이전트에 가장 직접적으로 필요한 전략입니다.

## 17. Episodic Memory

**Episodic Memory는 단순 정보 저장을 넘어, 과거 상호작용에서 배운 점까지 저장**합니다.

강의에서는 이를 “사용자만을 위한 자동 생성 위키피디아”에 비유합니다.

특징은 다음과 같습니다.

| 특징            | 설명                   |
| ------------- | -------------------- |
| Semantic 포함   | 의미 있는 지식 저장          |
| Summary 포함    | 대화 요약 저장             |
| Reflection 포함 | 무엇을 배웠는지 반성          |
| Future-use 중심 | 다음 상호작용에 도움 되는 학습 저장 |

## 18. Custom Memory

기본 전략으로 부족하면 **Custom Memory**를 만들 수 있습니다.

Custom Memory에서는 두 가지 Prompt를 정의합니다.

| Prompt               | 역할             |
| -------------------- | -------------- |
| Extraction Prompt    | 어떤 정보를 뽑을지 정의  |
| Consolidation Prompt | 어떤 구조로 저장할지 정의 |

예를 들어 여행 에이전트라면 다음처럼 저장할 수 있습니다.

```json
{
  "airline_preferences": {
    "international": ["JAL", "ANA"],
    "domestic": ["Delta"]
  },
  "hotel_preferences": {
    "style": "quiet",
    "priority": "high"
  },
  "confidence": 0.87
}
```

장점은 downstream 시스템에서 바로 쓰기 좋은 구조로 저장할 수 있다는 점입니다.

## 19. Namespace 구조

Namespace는 장기 메모리를 정리하는 폴더 구조입니다.

보통 다음처럼 구성됩니다.

```text id="pg1e19"
/strategy_id/actor_id/session_id
```

예시:

```text id="y2e8y2"
/summary/user_123/session_001
/preference/user_123/session_002
/semantic/user_123/session_003
```

Namespace를 잘 설계하면 다음이 가능합니다.

| 조회 방식     | 예시                         |
| --------- | -------------------------- |
| 사용자 전체 조회 | user_123의 모든 장기 기억         |
| 특정 세션 조회  | session_001의 요약            |
| 전략별 조회    | preference만 조회             |
| 전체 사용자 조회 | 모든 사용자의 semantic memory 조회 |

단, Namespace 권한 설계를 잘못하면 다른 사용자의 메모리에 접근할 위험이 있으므로 주의해야 합니다.

## 20. 비용 구조

Agent Core Memory 비용은 크게 세 부분입니다.

| 비용 항목               | 기준                 |
| ------------------- | ------------------ |
| Short-term Memory   | Event 저장·조회 수      |
| Long-term Memory 저장 | Memory record 저장 수 |
| Long-term Memory 조회 | Memory record 조회 수 |

강의 예시:

| 항목                  | 예시 가격               |
| ------------------- | ------------------- |
| Short-term Memory   | 1,000 Event당 $0.25  |
| Long-term Memory 저장 | 1,000 Record당 $0.75 |
| Long-term Memory 조회 | 1,000 Record당 $0.50 |

Custom Strategy는 기본 저장 비용이 더 낮을 수 있지만, 별도 LLM 호출 토큰 비용이 추가됩니다.

## 21. 비용 최적화 포인트

가장 중요한 최적화는 **Event Batching**입니다.

예시 시나리오:

| 조건        | 값      |
| --------- | ------ |
| 사용자 수     | 1,000명 |
| 사용자당 월 세션 | 10개    |
| 세션당 메시지 턴 | 20개    |

메시지마다 Event를 만들면 단기 메모리 비용이 커집니다.
세션 단위로 묶어 저장하면 Event 수가 줄어 비용을 크게 낮출 수 있습니다.

## 22. 실제 사용 사례: 고객지원 에이전트

고객지원 에이전트에서는 다음처럼 사용할 수 있습니다.

| 메모리 종류            | 저장 내용               |
| ----------------- | ------------------- |
| Short-term Memory | 고객과 상담 에이전트의 이전 대화  |
| Long-term Memory  | 고객 선호, 지원 등급, 과거 문제 |

예시:

* 이 고객은 전화보다 이메일을 선호한다.
* 이 고객은 프리미엄 지원 플랜을 사용한다.
* 이 고객은 특정 제품에서 반복 문제가 있었다.

이런 정보가 있으면 고객이 매번 같은 내용을 설명하지 않아도 됩니다.

## 23. Memory를 써야 하는 경우

Memory가 필요한 경우는 다음과 같습니다.

| 상황                  | Memory 필요 |
| ------------------- | --------- |
| 개인화가 필요함            | 필요        |
| 이전 대화를 이어가야 함       | 필요        |
| 사용자 선호를 저장해야 함      | 필요        |
| 과거 문제를 재사용해야 함      | 필요        |
| 여러 에이전트가 기억을 공유해야 함 | 필요 가능     |

## 24. Memory가 필요 없는 경우

다음 경우에는 굳이 Memory를 쓰지 않아도 됩니다.

| 상황           | 이유           |
| ------------ | ------------ |
| 단발성 질의응답     | 기억 불필요       |
| Stateless 작업 | 이전 맥락 필요 없음  |
| 비용을 최소화해야 함  | 메모리 저장 비용 절약 |
| 개인화가 전혀 없음   | 장기 기억 필요 없음  |

예를 들어 단순 번역, 단발성 계산, 단일 API 호출에는 Memory가 과할 수 있습니다.

## 25. Capstone 프로젝트에서의 적용

강의 실습에서는 기존 Agent Core Runtime 기반 에이전트에 Memory를 추가합니다.

구조는 다음과 같습니다.

```text id="4nq0al"
User
 → Agent Core Runtime
 → Agent Core Memory
```

에이전트는 Memory를 호출해 이전 대화, 사용자 선호, 장기 기억을 가져오고, 이를 현재 프롬프트와 결합해 더 개인화된 답변을 생성합니다.

## 26. 핵심 결론

* LLM은 기본적으로 컨텍스트 윈도우 밖의 내용을 기억하지 못한다.
* Agent Core Memory는 에이전트에 단기·장기 기억을 추가한다.
* Short-term Memory는 실제 대화와 도구 호출 로그를 저장한다.
* Long-term Memory는 대화에서 선호, 요약, 지식, 경험을 추출한다.
* 핵심 ID는 **Memory ID, Session ID, Actor ID, Event, Namespace**다.
* 장기 메모리 전략은 **Semantic, Summary, User Preference, Episodic, Custom**으로 나눌 수 있다.
* 비용 최적화를 위해 Event를 세션 단위로 Batch 처리하는 것이 중요하다.
* 개인화, 이전 대화 이어가기, 사용자 선호 반영이 필요한 에이전트라면 Memory가 핵심 컴포넌트다.
