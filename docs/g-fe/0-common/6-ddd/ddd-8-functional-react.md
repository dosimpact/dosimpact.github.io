---
sidebar_position: 8
title: 함수형 DDD와 React 적용
description: DDD의 Entity, Aggregate, Repository, Use Case를 불변 데이터와 순수 함수로 표현하고 React에 연결하는 방법을 알아본다.
---

# 함수형 DDD와 React 적용

DDD 예제는 Java나 C#을 기반으로 한 경우가 많아 `Entity class`, `Aggregate method`, `Repository interface` 같은 객체지향 패턴으로 보이기 쉽다. 하지만 DDD의 핵심은 객체지향이 아니라 다음 세 가지다.

1. 비즈니스 언어를 코드에 반영한다.
2. 모델과 일관성의 경계를 명확히 나눈다.
3. 비즈니스 규칙을 한곳에 응집한다.

따라서 함수형 TypeScript와 React에서도 DDD를 적용할 수 있다. 차이는 규칙을 객체의 메서드에 넣느냐, 불변 데이터에 적용되는 순수 함수로 표현하느냐에 있다.

DDD의 기본 개념을 먼저 보고 싶다면 [DDD 핵심 개념과 실전 설계 흐름](../../../g-be/0-common/domain-driven-design/ddd-core-concepts-and-design-flow.md)을 참고한다.

## 1. OOP와 함수형 DDD 비교

| DDD 개념 | 객체지향 표현 | 함수형 표현 |
| --- | --- | --- |
| Entity | 식별자를 가진 class | 식별자를 가진 불변 데이터 |
| Value Object | 불변 class | `Readonly` record 또는 branded type |
| Aggregate | 상태와 메서드를 가진 객체 | 상태 타입과 상태 전이 함수의 묶음 |
| Domain Behavior | `campaign.activate()` | `activateCampaign(campaign)` |
| Domain Service | service 또는 policy class | 순수한 policy 함수 |
| Repository | interface와 구현 class | 함수 타입 또는 함수 레코드 |
| Domain Event | event class | 판별 유니온 데이터 |
| Use Case | application service class | 의존성을 인자로 받는 함수 |

표현 방식은 달라도 “어떤 상태가 유효한가”, “어떤 변경이 허용되는가”, “어디까지 함께 일관성을 지켜야 하는가”라는 질문은 같다.

```text
OOP
상태 + 객체 메서드 + 캡슐화

함수형
불변 상태 + 순수 함수 + 타입으로 제한된 상태 전이
```

## 2. Entity와 Value Object를 불변 데이터로 표현하기

### 2.1 Entity

class를 사용하지 않아도 식별자와 생명주기를 가진 데이터는 Entity다.

```ts
type CampaignId = string;

type CampaignStatus =
  | "DRAFT"
  | "ACTIVE"
  | "PAUSED";

type Campaign = Readonly<{
  id: CampaignId;
  status: CampaignStatus;
  budget?: Money;
  schedule?: Schedule;
}>;
```

Campaign의 속성이 변경되어도 같은 `id`를 기준으로 추적한다. Entity인지 여부는 class 사용 여부가 아니라 **정체성의 필요성**으로 판단한다.

### 2.2 Value Object

Value Object는 식별자가 아니라 값 전체가 의미를 결정한다.

```ts
type Currency = "KRW" | "USD";

type Money = Readonly<{
  amount: number;
  currency: Currency;
}>;

function isSameMoney(
  left: Money,
  right: Money,
): boolean {
  return left.amount === right.amount
    && left.currency === right.currency;
}
```

외부에서 아무 값이나 만들 수 없게 해야 한다면 생성 함수를 둔다.

```ts
type MoneyError =
  | { type: "INVALID_AMOUNT" }
  | { type: "UNSUPPORTED_CURRENCY" };

type Result<T, E> =
  | Readonly<{ ok: true; value: T }>
  | Readonly<{ ok: false; error: E }>;

function createMoney(
  amount: number,
  currency: string,
): Result<Money, MoneyError> {
  if (!Number.isSafeInteger(amount) || amount < 0) {
    return { ok: false, error: { type: "INVALID_AMOUNT" } };
  }

  if (currency !== "KRW" && currency !== "USD") {
    return {
      ok: false,
      error: { type: "UNSUPPORTED_CURRENCY" },
    };
  }

  return {
    ok: true,
    value: { amount, currency },
  };
}
```

TypeScript의 구조적 타입에서는 호출자가 객체 리터럴을 직접 만들 수 있다. 생성 경로를 더 강하게 제한해야 한다면 branded type, 모듈의 export 범위, 런타임 스키마 검증을 함께 사용한다.

## 3. Aggregate 행동을 순수 함수로 표현하기

객체지향 Aggregate는 자신의 상태를 변경한다.

```ts
campaign.activate();
```

함수형 Aggregate는 기존 입력을 변경하지 않고 새로운 상태 또는 오류를 반환한다.

```ts
type ActivationError =
  | { type: "BUDGET_REQUIRED" }
  | { type: "SCHEDULE_REQUIRED" }
  | { type: "ALREADY_ACTIVE" };

function activateCampaign(
  campaign: Campaign,
): Result<Campaign, ActivationError> {
  if (campaign.status === "ACTIVE") {
    return {
      ok: false,
      error: { type: "ALREADY_ACTIVE" },
    };
  }

  if (!campaign.budget) {
    return {
      ok: false,
      error: { type: "BUDGET_REQUIRED" },
    };
  }

  if (!campaign.schedule) {
    return {
      ok: false,
      error: { type: "SCHEDULE_REQUIRED" },
    };
  }

  return {
    ok: true,
    value: {
      ...campaign,
      status: "ACTIVE",
    },
  };
}
```

함수형 DDD에서 Aggregate는 다음 조합으로 이해할 수 있다.

> Aggregate = 유효한 상태를 표현하는 타입 + 그 상태를 안전하게 변경하는 순수 함수

이 함수는 같은 입력에 같은 결과를 반환하며 DB, HTTP, React 상태를 직접 다루지 않는다. 따라서 업무 규칙만 빠르고 결정적으로 테스트할 수 있다.

## 4. 유효하지 않은 상태를 타입으로 제거하기

하나의 타입에 모든 상태를 선택적 필드로 넣으면 비즈니스상 불가능한 조합도 표현할 수 있다.

```ts
type LooseCampaign = Readonly<{
  status: "DRAFT" | "ACTIVE";
  budget?: Money;
  schedule?: Schedule;
}>;

const invalidCampaign: LooseCampaign = {
  status: "ACTIVE",
  // 활성 상태인데 budget과 schedule이 없다.
};
```

상태별 타입을 판별 유니온으로 분리하면 가능한 조합을 더 정확하게 제한할 수 있다.

```ts
type DraftCampaign = Readonly<{
  type: "DRAFT";
  id: CampaignId;
  budget?: Money;
  schedule?: Schedule;
}>;

type ActiveCampaign = Readonly<{
  type: "ACTIVE";
  id: CampaignId;
  budget: Money;
  schedule: Schedule;
  activatedAt: Date;
}>;

type TypedCampaign = DraftCampaign | ActiveCampaign;
```

활성화 함수는 단순히 `status`를 바꾸는 것이 아니라 `DraftCampaign`에서 `ActiveCampaign`으로 전이한다.

```ts
function activateDraftCampaign(
  campaign: DraftCampaign,
  now: Date,
): Result<ActiveCampaign, ActivationError> {
  if (!campaign.budget) {
    return {
      ok: false,
      error: { type: "BUDGET_REQUIRED" },
    };
  }

  if (!campaign.schedule) {
    return {
      ok: false,
      error: { type: "SCHEDULE_REQUIRED" },
    };
  }

  return {
    ok: true,
    value: {
      type: "ACTIVE",
      id: campaign.id,
      budget: campaign.budget,
      schedule: campaign.schedule,
      activatedAt: now,
    },
  };
}
```

반환된 `ActiveCampaign`에는 Budget과 Schedule이 항상 존재한다. 이후 로직에서 같은 검증을 반복할 필요가 없다.

> Make illegal states unrepresentable: 유효하지 않은 상태를 애초에 표현하기 어렵게 만든다.

모든 상태를 타입으로 세분화하면 타입 수와 변환 코드도 증가한다. 오류 비용이 큰 핵심 상태 전이에 우선 적용하고, 단순한 편집 중 폼 상태까지 과도하게 모델링하지 않는다.

## 5. Domain Event를 데이터로 표현하기

Domain Event도 class가 아니라 판별 가능한 불변 데이터로 표현할 수 있다.

```ts
type CampaignEvent =
  | Readonly<{
      type: "CAMPAIGN_ACTIVATED";
      campaignId: CampaignId;
      occurredAt: Date;
    }>
  | Readonly<{
      type: "CAMPAIGN_PAUSED";
      campaignId: CampaignId;
      reason: string;
      occurredAt: Date;
    }>;
```

상태 전이 함수가 새 상태와 발생한 이벤트를 함께 반환할 수 있다.

```ts
type Transition<State, Event> = Readonly<{
  state: State;
  events: readonly Event[];
}>;

function activateWithEvent(
  campaign: DraftCampaign,
  now: Date,
): Result<
  Transition<ActiveCampaign, CampaignEvent>,
  ActivationError
> {
  const activated = activateDraftCampaign(campaign, now);

  if (!activated.ok) {
    return activated;
  }

  return {
    ok: true,
    value: {
      state: activated.value,
      events: [
        {
          type: "CAMPAIGN_ACTIVATED",
          campaignId: campaign.id,
          occurredAt: now,
        },
      ],
    },
  };
}
```

순수 Domain 함수는 이벤트를 **결정**하고 반환한다. 이벤트를 Event Bus나 서버 API로 실제 전달하는 부수 효과는 Application 또는 Infrastructure 계층이 담당한다.

## 6. Repository와 Use Case를 함수로 구성하기

### 6.1 함수 레코드로 만든 Repository Port

Repository는 반드시 interface와 class로 만들 필요가 없다.

```ts
type CampaignRepository = Readonly<{
  findById: (
    id: CampaignId,
  ) => Promise<TypedCampaign | null>;

  save: (
    campaign: TypedCampaign,
  ) => Promise<void>;
}>;
```

각 연산을 별도 함수 타입으로 나눌 수도 있다.

```ts
type FindCampaignById = (
  id: CampaignId,
) => Promise<TypedCampaign | null>;

type SaveCampaign = (
  campaign: TypedCampaign,
) => Promise<void>;
```

Use Case는 자신에게 필요한 최소한의 Port만 의존성으로 받는다.

### 6.2 고차 함수로 만든 Use Case

```ts
type ActivateCampaignDependencies = Readonly<{
  findCampaignById: FindCampaignById;
  saveCampaign: SaveCampaign;
  publishEvents: (
    events: readonly CampaignEvent[],
  ) => Promise<void>;
  now: () => Date;
}>;

type UseCaseError =
  | { type: "CAMPAIGN_NOT_FOUND" }
  | { type: "CAMPAIGN_NOT_DRAFT" }
  | ActivationError;

function createActivateCampaignUseCase(
  dependencies: ActivateCampaignDependencies,
) {
  return async function execute(
    campaignId: CampaignId,
  ): Promise<Result<ActiveCampaign, UseCaseError>> {
    const campaign =
      await dependencies.findCampaignById(campaignId);

    if (!campaign) {
      return {
        ok: false,
        error: { type: "CAMPAIGN_NOT_FOUND" },
      };
    }

    if (campaign.type !== "DRAFT") {
      return {
        ok: false,
        error: { type: "CAMPAIGN_NOT_DRAFT" },
      };
    }

    const transition = activateWithEvent(
      campaign,
      dependencies.now(),
    );

    if (!transition.ok) {
      return transition;
    }

    await dependencies.saveCampaign(transition.value.state);
    await dependencies.publishEvents(transition.value.events);

    return {
      ok: true,
      value: transition.value.state,
    };
  };
}
```

`now()`를 직접 호출하지 않고 주입했기 때문에 테스트에서 시간을 고정할 수 있다. Repository와 Event Publisher도 테스트 대역으로 교체할 수 있다.

```text
Use Case 함수
├── Port를 통해 데이터 조회
├── 순수 Domain 함수 호출
├── Port를 통해 새 상태 저장
└── Port를 통해 Event 전달
```

## 7. React는 Domain의 UI Adapter다

React의 주요 책임은 사용자 입력을 수집하고, Use Case를 실행하고, 결과를 화면에 표시하는 것이다.

```text
React Component / Hook
          ↓
Application Use Case
          ↓
Pure Domain Function
          ↑
Repository Port
          ↑
HTTP/API Adapter
```

React 컴포넌트가 Domain 규칙과 서버 통신을 모두 소유하면 같은 규칙이 다른 화면에 복제되기 쉽다.

### 7.1 컴포넌트에 규칙이 섞인 형태

```tsx
function ActivateButton({ campaign }: Props) {
  const handleClick = async () => {
    if (!campaign.budget) {
      alert("예산이 필요합니다.");
      return;
    }

    if (!campaign.schedule) {
      alert("일정이 필요합니다.");
      return;
    }

    await api.activateCampaign(campaign.id);
  };

  return <button onClick={handleClick}>활성화</button>;
}
```

이 컴포넌트는 UI 이벤트, 비즈니스 판단, 오류 메시지, API 호출을 모두 담당한다.

### 7.2 Hook과 Domain을 분리한 형태

```tsx
function ActivateButton({ campaign }: Props) {
  const activation = useActivateCampaign();
  const activationPreview = previewActivation(campaign);

  const handleClick = () => {
    activation.mutate(campaign.id);
  };

  return (
    <button
      disabled={!activationPreview.ok || activation.isPending}
      onClick={handleClick}
    >
      활성화
    </button>
  );
}
```

```ts
function useActivateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activateCampaignApi,
    onSuccess: (campaign) => {
      queryClient.setQueryData(
        ["campaign", campaign.id],
        campaign,
      );
    },
  });
}
```

여기서 역할은 다음과 같이 구분된다.

| 요소 | 책임 |
| --- | --- |
| `previewActivation` | UI에서 즉시 보여 줄 수 있는 순수한 도메인 판단 |
| `ActivateButton` | 사용자 입력과 렌더링 |
| `useActivateCampaign` | React Query 생명주기와 캐시 연결 |
| `activateCampaignApi` | HTTP 요청과 DTO 변환 |
| 서버 Domain | 신뢰할 수 있는 최종 비즈니스 검증과 상태 변경 |

## 8. 프런트엔드 검증과 서버 검증

프런트엔드에 Domain 모델이 있어도 서버 검증을 생략할 수 없다. 브라우저 상태는 오래되었거나 조작될 수 있고, 다른 클라이언트가 같은 API를 호출할 수도 있다.

```text
프런트엔드 Domain 검증
= 빠른 피드백, 버튼 상태, 입력 안내, 요청 전 오류 감소

서버 Domain 검증
= 권한 확인, 최신 데이터 기준 판단, 데이터 무결성 보장
```

프런트엔드와 서버에 같은 규칙이 존재하면 중복처럼 보일 수 있다. 이때 두 구현의 목적이 다르다는 점을 명확히 하고, 변경이 잦은 정책은 서버 응답이나 공유 가능한 계약에서 가져오는 방식을 검토한다. 패키지를 공유하더라도 서버가 최종 권한이라는 원칙은 유지한다.

## 9. 추천 디렉터리 구조

React 프로젝트에서는 Bounded Context 또는 기능 단위로 코드를 배치하고 그 안에서 역할을 나눌 수 있다.

```text
src/
├── campaign/
│   ├── domain/
│   │   ├── campaign.ts
│   │   ├── campaign-rules.ts
│   │   └── campaign-event.ts
│   ├── application/
│   │   └── activate-campaign.ts
│   ├── infrastructure/
│   │   └── campaign-api-repository.ts
│   └── ui/
│       ├── ActivateCampaignButton.tsx
│       └── useActivateCampaign.ts
└── reporting/
    ├── domain/
    ├── application/
    ├── infrastructure/
    └── ui/
```

핵심은 폴더 이름보다 의존성 방향이다.

- Domain은 React, TanStack Query, Zustand, Axios를 import하지 않는다.
- Application은 업무 흐름을 조율하지만 React 생명주기를 모른다.
- Infrastructure는 HTTP DTO와 내부 Domain 모델을 변환한다.
- UI는 Domain 판단 결과와 Use Case를 사용자 상호작용에 연결한다.

프로젝트가 작다면 `domain`, `application` 폴더를 기계적으로 모두 만들 필요는 없다. 순수한 규칙 파일 하나를 컴포넌트 밖으로 분리하는 것부터 시작할 수 있다.

## 10. 함수형 DDD가 유용한 프런트엔드

다음과 같은 애플리케이션에서는 함수형 DDD의 효과가 크다.

- 복잡한 폼과 단계별 상태 전이가 있다.
- 권한과 상태에 따라 가능한 행동이 달라진다.
- 결제, 주문, 예약, 에디터처럼 클라이언트 규칙이 많다.
- 오프라인 동작이나 optimistic update가 필요하다.
- 여러 화면이 동일한 비즈니스 규칙을 공유한다.
- 프런트엔드 자체가 복잡한 업무 애플리케이션이다.

반면 단순한 조회 화면이나 얇은 CRUD UI에서 모든 필드를 Value Object로 감싸고 모든 요청을 Use Case로 만드는 것은 비용이 더 클 수 있다.

| 복잡도 | 우선 적용할 구조 |
| --- | --- |
| 단순 화면 | 서버 상태와 UI 컴포넌트 |
| 복잡한 사용자 흐름 | 명시적인 Use Case와 상태 모델 |
| 복잡한 비즈니스 규칙 | 순수 Domain 함수와 도메인 타입 |
| 독립적인 여러 업무 영역 | Bounded Context 또는 feature 경계 |

## 11. 적용 체크리스트

1. React 이벤트 핸들러에 같은 비즈니스 조건이 반복되는가?
2. API DTO, 폼 상태, Domain 모델을 같은 타입 하나로 사용하고 있는가?
3. 선택적 필드 때문에 유효하지 않은 상태를 만들 수 있는가?
4. 상태 변경 함수가 입력을 직접 변경하지 않고 새 상태를 반환하는가?
5. Domain 함수가 React나 네트워크 라이브러리에 의존하지 않는가?
6. Use Case가 부수 효과의 실행 순서를 명시적으로 조율하는가?
7. 프런트엔드의 사전 검증과 서버의 최종 검증을 구분했는가?
8. 현재 비즈니스 복잡도가 도입할 추상화 비용보다 큰가?

## 마무리

함수형 DDD는 다음 요소로 도메인을 표현한다.

```text
불변 데이터 타입
+ 판별 유니온
+ 순수한 상태 전이 함수
+ Result 타입
+ 함수 형태의 Repository Port
+ 데이터 형태의 Domain Event
```

`campaign.activate()`과 `activateCampaign(campaign)`은 문법과 상태 변경 방식이 다르지만, 둘 다 “캠페인을 활성화한다”라는 보편 언어와 규칙을 코드에 보존할 수 있다.

중요한 것은 class와 함수 중 어느 쪽을 선택했느냐가 아니다. **비즈니스 규칙과 경계가 코드에 명확히 드러나고, UI와 기술 세부사항으로부터 보호되는가**가 핵심이다.
