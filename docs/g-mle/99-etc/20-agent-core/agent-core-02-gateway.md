---
sidebar_position: 2
title: Agent Core Gateway
description: Agent Core Gateway가 기존 API, Lambda, SaaS API를 MCP 도구로 변환해 에이전트와 연결하는 방식을 정리합니다.
---

## 강의 요약: Agent Core Gateway

## 1. Gateway의 목적

**Agent Core Gateway는 기존 API를 MCP 형태의 도구로 바꿔서 에이전트가 쉽게 호출하게 해주는 컴포넌트**입니다. 

쉽게 말하면:

> 기존 REST API, Lambda, SaaS API 등을 에이전트가 사용할 수 있는 **표준 도구 인터페이스(MCP)** 로 변환해주는 계층입니다.

## 2. 왜 MCP가 필요한가

MCP 이전에는 에이전트가 외부 시스템을 호출하려면 매번 별도 연결 코드를 만들어야 했습니다.

| 기존 문제    | 설명                          |
| -------- | --------------------------- |
| REST API | HTTP wrapper 직접 구현 필요       |
| DB       | SQL wrapper 필요              |
| 실시간 응답   | WebSocket, SSH 등 별도 프로토콜 필요 |
| SDK      | 공급자별 SDK 설치·연동 필요           |
| 보안       | 인증, 권한, 토큰 처리를 직접 구현        |
| 확장성      | 도구가 늘수록 통합 복잡도 증가           |

문제는 **N × M 통합 문제**입니다.

예를 들어:

* 데이터 소스 10개
* AI 앱 10개

이면 총 **100개 통합**을 관리해야 합니다.

MCP는 이 문제를 해결하기 위해 등장했습니다.

## 3. MCP의 핵심 개념

MCP는 AI 앱과 도구 사이의 표준 연결 방식입니다.

강의에서는 MCP를 **AI 애플리케이션을 위한 USB-C**에 비유합니다.

| 구성         | 역할                |
| ---------- | ----------------- |
| MCP Client | 에이전트 쪽 호출자        |
| MCP Server | 도구를 표준 방식으로 감싼 서버 |
| MCP Tool   | 실제 호출 가능한 기능      |

즉, 도구들이 MCP라는 같은 언어를 쓰게 되면, 에이전트는 여러 시스템을 동일한 방식으로 호출할 수 있습니다.

## 4. MCP 통신 방식

MCP에는 대표적으로 두 가지 통신 방식이 있습니다.

| 방식              | 사용 상황                    |
| --------------- | ------------------------ |
| Standard IO     | 클라이언트와 서버가 같은 머신에서 실행될 때 |
| Streamable HTTP | 클라이언트와 서버가 다른 머신에 있을 때   |

운영 환경에서는 보통 에이전트와 MCP 서버가 서로 다른 위치에 있기 때문에 **Streamable HTTP**가 중요합니다.

Agent Core Gateway는 MCP 서버를 **원격 호출 가능한 Streamable HTTP Endpoint**로 만들어줍니다.

## 5. Gateway의 전체 구조

기본 흐름은 다음과 같습니다.

1. 사용자가 Agent Core Runtime의 에이전트를 호출
2. 에이전트가 도구 호출 필요성을 판단
3. 에이전트가 Gateway 호출
4. Gateway가 인증 확인
5. Gateway가 연결된 Target API 호출
6. 결과를 MCP 형식으로 에이전트에 반환

핵심 구조는 다음과 같습니다.

```text
User
 → Agent Core Runtime
 → Agent Core Gateway
 → Target API / Lambda / SaaS / AWS Service
```

## 6. Target이란?

**Target은 Gateway 뒤에 연결되는 실제 시스템**입니다.

Gateway는 여러 종류의 Target을 MCP 도구로 바꿀 수 있습니다.

| Target 종류           | 설명                               |
| ------------------- | -------------------------------- |
| Lambda Function     | AWS Lambda를 MCP 도구로 변환           |
| REST API            | OpenAPI Spec 기반으로 MCP화           |
| AWS Services        | Smithy 모델 기반으로 AWS 서비스 연결        |
| SaaS                | Slack, Salesforce, Jira, Asana 등 |
| Existing MCP Server | 기존 MCP 서버를 Gateway에 묶기           |

## 7. Lambda Target

기존 Lambda Function이 있다면 Gateway에 Target으로 연결할 수 있습니다.

예를 들어:

```text
Gateway
 → Lambda Function
 → DynamoDB / 다른 Lambda / 내부 서비스
```

주의할 점은 LLM이 도구를 잘 선택할 수 있도록 다음 정보를 명확히 작성해야 한다는 것입니다.

| 항목              | 중요성             |
| --------------- | --------------- |
| Tool name       | LLM이 읽고 판단하는 이름 |
| Description     | 도구의 역할 설명       |
| Parameters      | 입력값 구조          |
| Required fields | 필수 입력값 정의       |

도구 이름과 설명이 부정확하면 에이전트가 잘못된 도구를 선택할 수 있습니다.

## 8. REST API Target

기존 REST API도 Gateway에 연결할 수 있습니다.

핵심은 **OpenAPI Spec**입니다.

즉, REST API를 MCP로 바꾸려면:

1. REST API 준비
2. OpenAPI Spec 작성
3. Gateway Target으로 연결
4. 에이전트가 MCP 도구처럼 호출

내부 API뿐 아니라 외부 파트너사의 API도 연결할 수 있습니다.

## 9. 인증 구조: Inbound Auth와 Outbound Auth

Gateway 보안은 크게 두 단계입니다.

| 구분            | 의미                                     |
| ------------- | -------------------------------------- |
| Inbound Auth  | 에이전트가 Gateway를 호출할 권한이 있는지 확인          |
| Outbound Auth | Gateway가 실제 Target API를 호출할 권한이 있는지 확인 |

즉, 인증은 한 번이 아니라 **두 번** 생각해야 합니다.

```text
Agent → Gateway: Inbound Auth
Gateway → Target: Outbound Auth
```

## 10. Inbound Auth 옵션

Gateway로 들어오는 호출은 다음 방식으로 인증할 수 있습니다.

| 방식    | 설명                 |
| ----- | ------------------ |
| IAM   | AWS 내부 권한 기반 인증    |
| OAuth | JWT/OAuth 토큰 기반 인증 |

OAuth 방식에서는 Gateway가 Identity Provider와 연동해 토큰의 서명을 검증합니다.

토큰이 유효하면 호출을 허용하고, 유효하지 않으면 차단합니다.

## 11. Outbound Auth 옵션

Gateway가 Target을 호출할 때는 다음 인증 방식을 사용할 수 있습니다.

| 방식      | 사용 예                          |
| ------- | ----------------------------- |
| IAM     | Lambda, DynamoDB 등 AWS 서비스 호출 |
| API Key | 외부 REST API 호출                |
| OAuth   | 사용자 또는 앱 권한 기반 외부 API 호출      |
| RPC     | 특정 API 호출 방식 지원               |

중요한 보안 원칙은 다음입니다.

> API Key, OAuth Client Secret을 코드나 환경변수에 넣지 말고 Agent Core Identity Vault에 저장해야 합니다.

강의에서는 Secrets Manager를 직접 쓰지 않아도 Agent Core Identity가 이를 관리해준다고 설명합니다.

## 12. Smithy 모델

AWS 서비스는 Smithy 모델을 통해 MCP로 변환할 수 있습니다.

예를 들어 DynamoDB의:

* `GetItem`
* `PutItem`
* 기타 API

를 MCP Endpoint로 바꿀 수 있습니다.

이때 필요한 것은 해당 AWS 서비스에 맞는 **IAM Permission**입니다.

## 13. One-click Integration

Gateway는 일부 SaaS와 원클릭 통합을 지원합니다.

예시:

| SaaS       | 가능 작업 예시      |
| ---------- | ------------- |
| Slack      | 메시지 전송, 채널 읽기 |
| Salesforce | CRM 데이터 접근    |
| Jira       | 이슈 조회·관리      |
| Asana      | 할 일 조회        |

따라서 새로 직접 구현하기 전에 **원클릭 통합이 있는지 먼저 확인하는 것이 좋습니다.**

## 14. 도구가 많아질 때의 문제

도구가 수십~수백 개로 늘어나면 문제가 생깁니다.

| 문제     | 설명                    |
| ------ | --------------------- |
| 느려짐    | LLM이 많은 도구 목록을 검토해야 함 |
| 비용 증가  | 도구 설명이 많아져 토큰 사용량 증가  |
| 정확도 하락 | 잘못된 도구를 선택할 가능성 증가    |
| 누락 위험  | 중요한 도구를 놓칠 수 있음       |

이 문제를 해결하는 기능이 **Semantic Search**입니다.

## 15. Semantic Search 기능

Semantic Search를 켜면 Gateway가 먼저 관련 도구만 찾아줍니다.

흐름은 다음과 같습니다.

1. 에이전트가 Gateway에 작업 요청
2. Gateway가 의미 기반 검색으로 관련 도구만 추림
3. 에이전트는 작은 도구 목록만 보고 선택
4. 정확도와 속도 개선
5. 비용 감소

특히 **수백 개 도구를 가진 에이전트**에서는 매우 중요합니다.

단, Semantic Search는 Gateway 생성 시 설정해야 하며, 생성 후 변경할 수 없습니다.

## 16. Gateway 생성 흐름

Gateway를 만드는 기본 절차는 다음과 같습니다.

1. 사용할 도구 정의
2. 도구가 어디에 있는지 확인

   * Lambda
   * REST API
   * SaaS
   * 기존 MCP Server
3. Gateway 생성
4. Target 연결
5. Outbound Auth 설정
6. Gateway URL 확인
7. Agent Runtime 코드에 Gateway URL 설정
8. 에이전트가 MCP 방식으로 Gateway 호출

## 17. Gateway URL과 Tool Naming

Gateway를 만들면 고유 URL이 생성됩니다.

이 URL을 Agent Core Runtime에 설정하면 에이전트가 Gateway를 호출할 수 있습니다.

도구 이름은 보통 다음 구조를 가집니다.

```text
TargetName___ToolName
```

예를 들어 날씨 API가 Target이고 예보 조회 도구가 있다면:

```text
weather_service___get_forecast
```

이런 식으로 구분됩니다.

## 18. 변경 가능한 것과 불가능한 것

Gateway 생성 후에도 바꿀 수 있는 것과 없는 것이 있습니다.

| 구분    | 항목                                     |
| ----- | -------------------------------------- |
| 변경 가능 | 이름, Target 추가·삭제, Target 설정 변경         |
| 변경 불가 | Gateway ID, Region, Semantic Search 설정 |

Region을 바꾸려면 기존 Gateway를 삭제하고 새 Region에 다시 만들어야 합니다.

## 19. Best Practices

강의에서 강조한 모범 사례는 다음입니다.

| 항목              | 권장 사항                                    |
| --------------- | ---------------------------------------- |
| Semantic Search | 도구가 많아질 경우 반드시 고려                        |
| Tool 설명         | LLM이 이해하기 쉽게 명확히 작성                      |
| Credential 관리   | 코드·환경변수에 저장 금지                           |
| Vault 사용        | Agent Core Identity Vault 사용             |
| Inbound Auth    | IAM 또는 OAuth 활성화 권장                      |
| 권한              | 최소 권한 원칙 적용                              |
| OAuth/API Key   | 주기적 로테이션                                 |
| VPC Endpoint    | AWS 내부 리소스는 인터넷 우회 없이 private network 사용 |
| Logging         | 반드시 활성화                                  |

## 20. 비용 구조

Gateway 비용은 주로 다음 요소에 따라 달라집니다.

| 비용 요소         | 설명                      |
| ------------- | ----------------------- |
| Gateway 호출 수  | 요청 횟수 기반                |
| Search API    | Semantic Search 사용 시 발생 |
| Tool Indexing | 등록된 도구 수에 따라 발생         |
| Target API 비용 | 뒤쪽 API 호출 비용은 별도        |

강의 예시에서는 하루 10회 요청 기준 약 월 $1.5 수준의 예시가 나왔지만, 실제 비용은 최신 AWS 가격표와 Cost Calculator로 확인해야 합니다.

## 21. 실습에서 다룰 내용

실습에서는 다음 구조를 사용합니다.

```text
Agent Core Runtime
 → Agent Core Gateway
 → 외부 API들
```

사용할 예시는 다음과 같습니다.

| API               | 역할           |
| ----------------- | ------------ |
| Weather API       | 도시별 현재 날씨 조회 |
| Exchange Rate API | 환율 조회        |
| Live Flight API   | 항공편 조회       |

또한 Inbound/Outbound Auth와 API Key 기반 인증도 함께 다룹니다.

## 22. 핵심 결론

* **Gateway는 API를 MCP 도구로 변환하는 계층**이다.
* MCP는 에이전트와 도구 사이의 표준 인터페이스다.
* Gateway는 REST API, Lambda, AWS Service, SaaS, 기존 MCP Server를 Target으로 연결할 수 있다.
* 인증은 **Inbound Auth + Outbound Auth**로 나누어 생각해야 한다.
* 도구가 많아지면 Semantic Search가 중요하다.
* Credential은 코드나 환경변수에 두지 말고 Agent Core Identity Vault에 저장해야 한다.
* Gateway는 Agent Core Runtime과 함께 사용하면 운영 가능한 에이전트 아키텍처의 핵심 도구 연결 계층이 된다.
