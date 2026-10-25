---
sidebar_position: 7
title: Agent Core Policy
description: Agent Core Policy가 Gateway를 통과하는 Tool Call을 Cedar 정책으로 검사하고 권한을 제어하는 방식을 정리합니다.
---

## Module 8: AgentCore Policy 요약 

### 1. 왜 Policy가 필요한가?

AI Agent는 **도구 호출을 스스로 결정**한다.

문제는 다음과 같다.

* 어떤 Tool을 호출할지 Agent가 결정
* 어떤 인자를 넣을지도 Agent가 결정
* Prompt Injection으로 LLM이 속을 수 있음
* 시스템 프롬프트의 비즈니스 규칙이 우회될 수 있음
* 하나의 Agent 침해가 큰 사고로 이어질 수 있음

예시:

| 위험 상황   | 설명                         |
| ------- | -------------------------- |
| 보험금 과지급 | 한도 $10,000인데 $50,000 지급    |
| PII 유출  | Prompt Injection으로 개인정보 유출 |
| 부적격 승인  | 자격 없는 고객을 승인               |

핵심은 **LLM 안쪽 규칙만으로는 부족하다**는 것.

---

### 2. AgentCore Policy란?

**AgentCore Policy = AgentCore Gateway를 지나는 모든 Tool Call을 검사하는 결정론적 권한 제어 레이어**

특징:

* AgentCore Gateway를 통과하는 Tool Call을 가로챔
* Cedar Policy로 허용/거부 판단
* LLM 바깥에서 동작
* Prompt Injection으로 우회 불가
* 모델 판단이 아니라 Policy Logic으로 결정

즉, Agent가 아무리 “이건 해도 된다”고 말해도
**Policy가 막으면 실행되지 않는다.**

---

### 3. 구조

흐름은 다음과 같다.

```text
User
→ AgentCore Runtime
→ AgentCore Gateway
→ AgentCore Policy 권한 검사
→ Tool/API 호출 허용 또는 차단
```

Policy는 Gateway 옆에서 동작하며, Tool 호출 전에 권한을 확인한다.

예:

```text
Agent가 Payment API 호출 요청
→ Policy Engine이 Cedar Policy 평가
→ PERMIT 또는 FORBID 결정
```

---

### 4. 기본 상태: Default Deny

가장 중요한 규칙:

| 규칙                  | 의미                         |
| ------------------- | -------------------------- |
| Default Deny        | 매칭되는 정책이 없으면 DENY          |
| At least one Permit | 최소 하나의 permit 정책이 필요       |
| Forbid Wins         | forbid가 하나라도 매칭되면 무조건 DENY |

핵심 공식:

```text
FORBID > PERMIT
```

즉, 허용 정책이 있어도 금지 정책이 걸리면 차단된다.

---

### 5. Cedar Policy 기본 구조

Cedar 정책은 3요소로 구성된다.

| 요소        | 의미           |
| --------- | ------------ |
| Effect    | 허용할지, 거부할지   |
| Scope     | 누가, 무엇을, 어디에 |
| Condition | 어떤 조건일 때     |

예시 구조:

```cedar
permit (
  principal,
  action,
  resource
)
when {
  context.input.amount < 500
};
```

의미:

> 특정 사용자가 특정 Tool을 호출할 때, 금액이 500 미만이면 허용한다.

---

### 6. Cedar는 무엇이 아닌가?

Cedar는 다음이 아니다.

* 프로그래밍 언어 아님

  * loop, state 없음
* IAM/SCP 같은 일반 API Gateway 정책 아님
* LLM Prompt 아님
* 확률적 판단이 아니라 결정론적 판단

즉, **Agent Tool 사용 권한을 명확히 제어하기 위한 정책 언어**다.

---

### 7. JWT Claim과 Policy 연결

사용자 정보는 JWT Claim으로 들어온다.

예:

```json
{
  "username": "refund-agent",
  "scope": "refund:write",
  "role": "admin",
  "department": "finance"
}
```

이 Claim은 Policy Entity Store에 저장되고, Cedar에서 다음처럼 사용된다.

```cedar
principal.hasTag("role") &&
principal.getTag("role") == "admin"
```

즉:

> IdP는 사용자의 Claim을 제공하고, Cedar는 그 Claim이 Tool 권한에서 어떤 의미인지 결정한다.

---

### 8. 자주 쓰는 Policy Pattern

| 패턴              | 용도              |
| --------------- | --------------- |
| Block All       | 전체 차단           |
| Disable Tool    | 특정 Tool 비활성화    |
| Disable User    | 특정 사용자 차단       |
| Numeric Check   | 금액, 수량 제한       |
| String Match    | 결제수단, 상태값 확인    |
| Set Membership  | 국가, 그룹 포함 여부    |
| Require Field   | 필수 필드 존재 여부     |
| Unless          | 조건이 아닐 때 차단     |
| RBAC            | 역할 기반 접근 제어     |
| OAuth Scope     | Scope 기반 접근 제어  |
| Multi-condition | 역할 + 부서 등 복합 조건 |

예:

```cedar
permit(...)
when {
  principal.getTag("role") == "senior-analyst" &&
  context.input.amount <= 1000000
};
```

의미:

> senior analyst는 최대 $1M까지 승인 가능.

---

### 9. Enforcement Mode

Policy 적용 방식은 2가지다.

| 모드       | 설명             | 사용 시점  |
| -------- | -------------- | ------ |
| LOG_ONLY | 평가만 하고 차단하지 않음 | 개발/테스트 |
| ENFORCE  | 실제로 허용/차단      | 운영 환경  |

권장 흐름:

```text
LOG_ONLY로 충분히 테스트
→ 로그에서 false deny 확인
→ 문제 없으면 ENFORCE 전환
```

---

### 10. NL2Cedar

자연어로 Cedar Policy를 생성할 수도 있다.

예:

```text
Allow all users to invoke the risk model tool 
when data governance approval is true.
```

이런 문장을 Cedar 정책으로 변환한다.

다만 운영에서는 반드시 리뷰가 필요하다.

---

### 11. Best Practices

| 항목              | 핵심                                 |
| --------------- | ---------------------------------- |
| LOG_ONLY 먼저 사용  | 최소 1개 비즈니스 사이클 테스트                 |
| CloudWatch 대시보드 | ALLOW/DENY 추적                      |
| IAM Role 분리     | Gateway 실행 role과 Policy 관리 role 분리 |
| Git 관리          | Cedar Policy도 코드처럼 버전 관리           |
| PR Review & CI  | 정책 변경 검토/검증                        |
| FORBID는 하드 경계   | 안전 제약은 forbid로 명시                  |

특히 중요한 점:

```text
FORBID는 LLM 출력으로 절대 우회할 수 없다.
```

---

### 12. 최종 핵심

AgentCore Policy의 본질은 이것이다.

> **Agent가 Tool을 실행하기 전에, LLM 바깥에서 결정론적으로 권한을 검사하는 보안/비즈니스 규칙 레이어**

한 줄 요약:

> **프롬프트로 막는 것이 아니라, Gateway 레벨에서 Tool Call을 정책으로 막는 구조다.**
