---
sidebar_position: 4
title: Agent Core Identity
description: Agent Core Identity가 에이전트 신원, Token Vault, Credential Provider, OAuth 권한 위임을 관리하는 방식을 정리합니다.
---

## 강의 요약: Agent Core Identity

## 1. Identity의 목적

**Agent Core Identity는 에이전트의 신원, 권한, 토큰, API Key를 안전하게 관리하는 컴포넌트**입니다. 

핵심은 다음입니다.

> “이 에이전트가 누구인지, 어떤 사용자 대신 행동하는지, 어떤 외부 시스템에 접근할 수 있는지”를 관리한다.

## 2. 왜 Identity가 필요한가

에이전트가 외부 API를 호출하려면 인증이 필요합니다.

예를 들어 에이전트가 다음 작업을 한다고 가정합니다.

* Google Drive 문서 검색
* Gmail 이메일 조회
* LinkedIn 글 작성
* 내부 API 호출
* 외부 SaaS API 호출

이때 필요한 것은 다음입니다.

| 필요 요소         | 설명                             |
| ------------- | ------------------------------ |
| 인증            | 호출자가 누구인지 확인                   |
| 권한            | 무엇을 할 수 있는지 확인                 |
| 토큰 관리         | Access Token, Refresh Token 저장 |
| Credential 보관 | API Key, Client Secret 안전 저장   |
| 감사 로그         | 어떤 에이전트가 어떤 토큰에 접근했는지 추적       |

이 역할을 Agent Core Identity가 담당합니다.

## 3. Agent Core Identity의 3대 구성요소

| 구성요소                | 역할                                             |
| ------------------- | ---------------------------------------------- |
| Agent Identity      | 에이전트별 고유 신원                                    |
| Token Vault         | API Key, OAuth Token, Secret 저장소               |
| Credential Provider | Cognito, Auth0, Microsoft Entra 등 외부 인증 제공자 연동 |

## 4. Agent Identity

**Agent Identity는 에이전트마다 부여되는 장기 신원**입니다.

중요한 점은 Runtime Session에 묶이지 않는다는 것입니다.

즉, 세션이 끝나도 에이전트의 Identity는 유지됩니다.

활용 예시는 다음과 같습니다.

| 활용                | 설명                           |
| ----------------- | ---------------------------- |
| 권한 범위 지정          | 특정 에이전트만 특정 API 호출 허용        |
| Token Vault 접근 제어 | 어떤 에이전트가 어떤 토큰을 가져갈 수 있는지 제어 |
| 감사 추적             | 어떤 에이전트가 어떤 작업을 했는지 확인       |
| 멀티테넌트 구조          | tenant별 agent identity 구성 가능 |

## 5. Token Vault

**Token Vault는 API Key, OAuth Token, Client Secret을 안전하게 저장하는 공간**입니다.

특징은 다음과 같습니다.

| 특징               | 설명                    |
| ---------------- | --------------------- |
| 암호화 저장           | 저장 시 암호화              |
| Access Token 저장  | OAuth Access Token 보관 |
| Refresh Token 저장 | 만료 시 토큰 자동 갱신 가능      |
| API Key 저장       | 외부 API Key 안전 보관      |
| CloudTrail 로깅    | 접근 이력 감사 가능           |

중요한 원칙:

> API Key나 OAuth Secret을 코드, 환경변수, 하드코딩으로 관리하지 말고 Token Vault에 저장해야 한다.

## 6. Credential Provider

Credential Provider는 외부 인증 시스템과 연결하는 역할입니다.

지원 가능한 예시는 다음과 같습니다.

| Provider              | 설명                    |
| --------------------- | --------------------- |
| Amazon Cognito        | AWS 기본 사용자 인증         |
| Auth0                 | 외부 OAuth Provider     |
| Microsoft Entra       | 기업용 SSO               |
| Custom OAuth Provider | OAuth 2.0 호환 자체 인증 서버 |

이를 통해 기존 사용자 풀과 SSO 구조를 재사용할 수 있습니다.

## 7. OAuth의 핵심 개념

OAuth는 비밀번호를 직접 공유하지 않고 토큰으로 권한을 위임하는 표준 방식입니다.

핵심 구성요소는 다음입니다.

| 구성요소               | 역할                               |
| ------------------ | -------------------------------- |
| User               | 실제 사용자                           |
| Application Server | 사용자가 호출하는 앱/에이전트                 |
| OAuth Server       | 로그인과 동의 처리                       |
| Resource Server    | Google Drive, Gmail 같은 실제 데이터 서버 |
| Access Token       | 리소스 접근용 토큰                       |
| Refresh Token      | Access Token 갱신용 토큰              |

핵심은 다음입니다.

> 사용자는 비밀번호를 에이전트에 주지 않고, OAuth Server에서 로그인한 뒤 토큰만 위임한다.

## 8. OAuth 흐름 예시: Google Drive 접근

예시: 사용자가 에이전트에게 “내 Google Drive 파일 목록 보여줘”라고 요청하는 경우.

흐름은 다음과 같습니다.

```text id="mmnnsy"
User
 → Agent Core Runtime
 → Agent Core Identity
 → OAuth Server
 → Google Drive
```

상세 흐름:

1. 사용자가 에이전트에게 Google Drive 파일 조회 요청
2. Runtime이 Identity 설정을 확인
3. 사용자에게 인증 URL 반환
4. 사용자가 Google OAuth 서버에서 로그인
5. 사용자가 권한 동의
6. OAuth Server가 Authorization Code 반환
7. Identity가 Code를 Access Token / Refresh Token으로 교환
8. Token Vault에 토큰 저장
9. Access Token으로 Google Drive 호출
10. 결과를 에이전트가 사용자에게 반환

## 9. Two-legged OAuth와 Three-legged OAuth

강의의 핵심 구분은 **2-legged OAuth**와 **3-legged OAuth**입니다.

| 구분                 | 의미                       | 사용 상황                            |
| ------------------ | ------------------------ | -------------------------------- |
| Two-legged OAuth   | Machine-to-Machine 인증    | 내부 API, 자동화 Job                  |
| Three-legged OAuth | User + App + Resource 인증 | 개인 Google Drive, Gmail, Calendar |

## 10. Two-legged OAuth

**Two-legged OAuth는 사용자 동의 없이 시스템 간 인증을 하는 방식**입니다.

사용 예시:

| 상황            | 설명                    |
| ------------- | --------------------- |
| 내부 API 호출     | 회사 내부 데이터 조회          |
| 자동 리포트 Job    | 백그라운드에서 주기 실행         |
| 공용 시스템 데이터 접근 | 특정 사용자 개인 데이터가 아님     |
| 서버 간 통신       | Machine-to-Machine 패턴 |

즉, 특정 사용자의 개인 데이터가 아니라 **시스템 수준의 데이터**를 다룰 때 적합합니다.

## 11. Three-legged OAuth

**Three-legged OAuth는 사용자의 동의가 필요한 인증 방식**입니다.

사용 예시:

| 상황               | 설명          |
| ---------------- | ----------- |
| Google Drive 접근  | 개인 파일 접근    |
| Gmail 조회         | 개인 이메일 접근   |
| Calendar 조회      | 개인 일정 접근    |
| 사용자별 SaaS 데이터 접근 | 개인화된 리소스 접근 |

즉, 에이전트가 **사용자 대신 행동**해야 할 때 필요합니다.

## 12. 선택 기준

| 질문                    | 선택           |
| --------------------- | ------------ |
| 사용자 개인 데이터인가?         | Three-legged |
| 사용자가 현재 플로우에 참여하는가?   | Three-legged |
| 이메일, 캘린더, 개인 Drive인가? | Three-legged |
| 시스템 공용 데이터인가?         | Two-legged   |
| 백그라운드 Job인가?          | Two-legged   |
| 사용자 상호작용이 없는 자동화인가?   | Two-legged   |

간단히 정리하면:

```text id="230zgt"
개인 데이터 + 사용자 동의 필요 → Three-legged OAuth
시스템 데이터 + 자동화 작업 → Two-legged OAuth
```

## 13. Workload Access Token

Agent Core Identity는 **Workload Access Token**을 사용해 호출 주체를 확인합니다.

이 토큰에는 다음 정보가 포함됩니다.

| 정보             | 의미                 |
| -------------- | ------------------ |
| Agent Identity | 어떤 에이전트가 호출했는지     |
| User Identity  | 어떤 사용자 대신 호출하는지    |
| AWS Signature  | AWS가 서명한 신뢰 가능한 토큰 |

이를 통해 Identity는 다음을 판단합니다.

> “이 에이전트 + 이 사용자 조합이 이 토큰에 접근해도 되는가?”

## 14. Outbound Auth와 Identity

이 장에서는 특히 **Outbound Authentication**을 깊게 다룹니다.

Outbound Auth는 다음 흐름입니다.

```text id="rabm6i"
Agent Core Runtime
 → Agent Core Identity
 → 외부 API / SaaS / Google Drive
```

즉, 에이전트가 외부 시스템을 호출할 때 필요한 인증입니다.

가능한 방식은 다음입니다.

| 방식      | 사용 예                      |
| ------- | ------------------------- |
| API Key | 단순 외부 API                 |
| OAuth   | Google Drive, Gmail, SaaS |
| IAM     | AWS 내부 서비스                |

## 15. 감사 로그와 보안

Agent Core Identity 호출은 **AWS CloudTrail에 기록**됩니다.

따라서 다음을 추적할 수 있습니다.

| 추적 항목                | 설명                  |
| -------------------- | ------------------- |
| 어떤 에이전트가 호출했는지       | Agent Identity      |
| 어떤 Vault에 접근했는지      | Token Vault 접근      |
| 어떤 Credential을 사용했는지 | API Key/OAuth Token |
| 언제 접근했는지             | 시간 기록               |
| 권한 위반 시도 여부          | 보안 감사               |

운영 환경에서는 반드시 감사 로그를 확인할 수 있어야 합니다.

## 16. Lab에서 할 내용

실습에서는 기존 에이전트에 **Google Drive 연결**을 추가합니다.

구조는 다음과 같습니다.

```text id="ltz3p6"
User
 → Agent Core Runtime
 → Agent Core Gateway
 → Agent Core Identity
 → Google OAuth Server
 → Google Drive
```

실습 목표:

* Google OAuth 설정
* 개인 Google Drive 접근 권한 부여
* Agent Core Identity에 Credential Provider 연결
* Token Vault에 토큰 저장
* 에이전트가 Google Drive 파일을 조회하거나 저장

## 17. 핵심 결론

* Agent Core Identity는 에이전트의 신원과 인증 정보를 관리한다.
* 주요 구성은 **Agent Identity, Token Vault, Credential Provider**다.
* OAuth는 비밀번호 공유 없이 토큰으로 접근 권한을 위임하는 방식이다.
* 개인 데이터 접근은 **Three-legged OAuth**가 필요하다.
* 시스템 간 자동화는 **Two-legged OAuth**가 적합하다.
* Token Vault는 API Key, Access Token, Refresh Token을 안전하게 저장한다.
* Workload Access Token은 “어떤 에이전트가 어떤 사용자 대신 호출하는지”를 검증한다.
* 모든 접근은 CloudTrail로 감사 가능하다.
* Identity는 Agent Core에서 보안성과 운영 안정성을 담당하는 핵심 컴포넌트다.
