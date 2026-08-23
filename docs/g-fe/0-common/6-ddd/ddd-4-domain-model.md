---
sidebar_position: 4
---

# 도메인 모델 만들기

도메인 모델은 API 응답 형태를 그대로 옮긴 데이터 객체가 아니라, **업무 용어와 변경 규칙을 실행 가능한 코드로 표현한 모델**이다. 이 문서에서는 Google Ads 캠페인을 다음 흐름으로 모델링한다.

```text
Money로 유효한 일 예산을 표현한다.
  → Campaign이 자기 상태 전이를 보호한다.
  → 공유 가능한 CampaignBudget을 별도 Aggregate로 둔다.
  → CampaignPublicationPolicy가 두 Aggregate의 게시 조건을 판정한다.
```

예제의 게시 상태는 Google Ads API의 원본 enum을 복제한 값이 아니라, 제품 내부의 캠페인 게시 업무를 표현한 모델이다.

## 1. 핵심 키워드 및 개념

### 1.1 핵심 용어 빠르게 보기

| 키워드 | 핵심 개념 |
| --- | --- |
| Value Object | 식별자보다 값 자체가 중요하며 생성 시 유효성과 불변성을 보장하는 객체 |
| Entity | 식별자와 생명주기를 가지며 상태 변경 규칙을 행동으로 보호하는 객체 |
| Invariant | 객체가 생성되고 변경되는 모든 순간에 반드시 유지해야 하는 도메인 조건 |
| Aggregate | 하나의 트랜잭션에서 일관성을 함께 보장하는 Entity와 Value Object의 묶음 |
| Aggregate Root | Aggregate 외부에서 접근할 수 있는 유일한 진입점 |
| State Transition | Campaign의 Draft, Ready, Published처럼 허용된 순서에 따라 상태를 변경하는 규칙 |
| Domain Policy | 여러 Aggregate에 걸친 판단을 도메인 언어로 표현한 정책 객체 |
| Restore | 저장된 값을 불필요한 상태 전이 없이 유효한 도메인 객체로 복원하는 생성 경로 |

## 2. 값과 유효성

### 2.1 Value Object로 일 예산 표현하기

목적 : 금액처럼 식별자보다 값 자체가 중요한 개념을 불변 객체로 만들고, 잘못된 값을 도메인 안으로 들이지 않는다.

상세 로직

1. 판단 기준 및 적용 조건
   - Value Object는 속성 값이 같으면 같은 것으로 판단한다. `10,000 KRW`는 어느 요청에서 만들어졌든 같은 금액이다.
   - 생성 시 유효성을 검사하고 변경 메서드를 두지 않는다. 값이 달라져야 하면 새 객체를 만든다.

2. 실행 절차 및 구현 규칙
   - 이 예제에서는 음수와 소수 단위의 KRW를 거부한다.
   - 금액 비교는 원시 숫자를 꺼내 외부에서 계산하지 않고 `Money`가 담당한다.

**AS-IS — 원시값 사용:** number만 전달하면 단위와 유효성 검사가 호출부의 관례에 의존한다.

```ts
const dailyBudget = -10_000; // 타입은 허용하지만 업무적으로는 유효하지 않다.
```

**TO-BE — Value Object 적용:** 생성 시점에 단위와 불변식을 확인한 값만 Domain 안으로 들인다.

```ts title="src/domain/campaign/Money.ts"
export type Currency = "KRW";

export class Money {
  private constructor(
    readonly amount: number,
    readonly currency: Currency,
  ) {}

  static won(amount: number): Money {
    // private constructor의 유일한 진입점에서 정수·양수 규칙을 보장한다.
    if (!Number.isSafeInteger(amount) || amount < 0) {
      throw new Error("KRW 금액은 0 이상의 안전한 정수여야 합니다.");
    }

    return new Money(amount, "KRW");
  }

  equals(other: Money): boolean {
    // 금액뿐 아니라 통화까지 같아야 동일한 값으로 판단한다.
    return this.amount === other.amount && this.currency === other.currency;
  }

  isAtLeast(other: Money): boolean {
    this.assertSameCurrency(other);
    return this.amount >= other.amount;
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error("서로 다른 통화는 비교할 수 없습니다.");
    }
  }
}
```

코드 해설

- 생성자를 `private`으로 막아 `Money.won()`의 검증을 우회할 수 없게 했다.
- 모든 필드는 `readonly`이므로 값 변경은 기존 객체 수정이 아니라 새 `Money` 생성으로 표현한다.
- `equals()`와 `isAtLeast()`가 값의 동등성 및 비교 규칙을 한곳에 모은다.

**함수형 TO-BE — 불변 데이터와 스마트 생성 함수:** Value Object를 클래스가 아닌 `Readonly` 데이터로 표현하고, 검증을 통과한 값만 생성 함수로 반환할 수 있다.

```ts title="src/domain/campaign/money-functional.ts"
type Result<T, E> =
  | Readonly<{ ok: true; value: T }>
  | Readonly<{ ok: false; error: E }>;

type MoneyError = "INVALID_KRW_AMOUNT" | "CURRENCY_MISMATCH";

export type FunctionalMoney = Readonly<{
  amount: number;
  currency: "KRW";
}>;

export function won(
  amount: number,
): Result<FunctionalMoney, MoneyError> {
  if (!Number.isSafeInteger(amount) || amount < 0) {
    return { ok: false, error: "INVALID_KRW_AMOUNT" };
  }

  return { ok: true, value: { amount, currency: "KRW" } };
}

export function isAtLeast(
  left: FunctionalMoney,
  right: FunctionalMoney,
): Result<boolean, MoneyError> {
  if (left.currency !== right.currency) {
    return { ok: false, error: "CURRENCY_MISMATCH" };
  }

  return { ok: true, value: left.amount >= right.amount };
}
```

함수형 코드 해설

- 생성자는 없지만 `won()`을 Domain 진입점으로 사용해 유효한 값만 다음 계산으로 전달한다.
- 함수는 입력 `Money`를 변경하지 않으며, 같은 입력에 같은 `Result`를 반환한다.
- TypeScript의 구조적 타입만으로 생성 경로를 완전히 봉인하려면 branded type을 추가할 수 있다. 이 예제는 검증 흐름을 드러내는 데 집중한다.

테스트 예시

```ts title="src/domain/campaign/Money.test.ts"
import { describe, expect, it } from "vitest";
import { Money } from "./Money";

describe("Money", () => {
  it("같은 금액과 통화는 같은 값이다", () => {
    // Value Object는 객체 참조가 아니라 속성 값으로 동등성을 판단한다.
    expect(Money.won(10_000).equals(Money.won(10_000))).toBe(true);
  });

  it("음수 일 예산은 생성할 수 없다", () => {
    expect(() => Money.won(-1)).toThrow(
      "KRW 금액은 0 이상의 안전한 정수여야 합니다.",
    );
  });
});
```

## 3. 정체성과 생명주기

### 3.1 Entity가 Campaign 상태 전이를 보호하게 하기

목적 : 시간이 지나 속성이 바뀌어도 같은 캠페인으로 추적하고, 허용된 상태 전이만 일어나게 한다.

상세 로직

1. 판단 기준 및 적용 조건
   - Entity는 속성 전체가 아니라 `CampaignId`로 동일성을 판단한다.
   - 상태를 `public`으로 노출해 대입하지 않고, 도메인 용어인 `submitForReview()`, `publish()`, `pause()`로 변경한다.

2. 실행 절차 및 구현 규칙
   - 새 Campaign은 항상 `DRAFT`에서 시작하며 `DRAFT → UNDER_REVIEW → PUBLISHED → PAUSED` 순서만 허용한다.
   - `publish()`는 게시 정책이 발급한 승인 결과를 요구해, 상태만 임의로 `PUBLISHED`로 바꾸지 못하게 한다.

**AS-IS — 필드 직접 변경:** 호출자가 상태 전이 순서를 건너뛸 수 있다.

```ts
campaign.status = "PUBLISHED"; // 심사와 게시 정책을 우회한다.
```

**TO-BE — Entity 행위 적용:** 공개 메서드가 허용된 상태 전이만 수행한다.

```ts title="src/domain/campaign/Campaign.ts"
import type { PublicationDecision } from "./CampaignPublicationPolicy";

export type CampaignId = string;
export type CampaignBudgetId = string;
export type CampaignStatus =
  | "DRAFT"
  | "UNDER_REVIEW"
  | "PUBLISHED"
  | "PAUSED";

type CreateCampaignParams = {
  id: CampaignId;
  name: string;
  budgetId: CampaignBudgetId;
};

type RestoreCampaignParams = CreateCampaignParams & {
  status: CampaignStatus;
};

export class Campaign {
  private constructor(
    readonly id: CampaignId,
    readonly name: string,
    readonly budgetId: CampaignBudgetId,
    private currentStatus: CampaignStatus,
  ) {
    if (name.trim().length === 0) {
      throw new Error("캠페인 이름은 비어 있을 수 없습니다.");
    }
  }

  static create(params: CreateCampaignParams): Campaign {
    // 신규 Campaign은 언제나 DRAFT에서 시작한다.
    return new Campaign(params.id, params.name, params.budgetId, "DRAFT");
  }

  static restore(params: RestoreCampaignParams): Campaign {
    // 영속 상태 복원은 생성 규칙과 목적이 다르므로 진입점을 분리한다.
    return new Campaign(
      params.id,
      params.name,
      params.budgetId,
      params.status,
    );
  }

  get status(): CampaignStatus {
    return this.currentStatus;
  }

  sameIdentityAs(other: Campaign): boolean {
    return this.id === other.id;
  }

  submitForReview(): void {
    this.assertStatus("DRAFT");
    this.currentStatus = "UNDER_REVIEW";
  }

  publish(decision: PublicationDecision): void {
    // Policy 승인과 현재 상태를 모두 만족해야 게시 상태로 전이한다.
    this.assertStatus("UNDER_REVIEW");

    if (decision.campaignId !== this.id || !decision.approved) {
      throw new Error("게시 정책의 승인이 필요합니다.");
    }

    this.currentStatus = "PUBLISHED";
  }

  pause(): void {
    this.assertStatus("PUBLISHED");
    this.currentStatus = "PAUSED";
  }

  private assertStatus(expected: CampaignStatus): void {
    if (this.currentStatus !== expected) {
      throw new Error(
        `${expected} 상태에서만 실행할 수 있습니다. 현재: ${this.currentStatus}`,
      );
    }
  }
}
```

코드 해설

- `sameIdentityAs()`는 이름이나 예산이 바뀌어도 ID가 같으면 같은 Entity임을 드러낸다.
- 상태 setter를 제공하지 않으므로 호출자는 `campaign.status = "PUBLISHED"`처럼 규칙을 우회할 수 없다.
- `restore()`는 저장소가 기존 상태를 복원할 때 사용하는 named constructor다. 신규 생성 규칙인 `DRAFT` 초기화를 우회할 의도가 메서드 이름에 드러난다.
- `PublicationDecision`은 다음 절의 Policy가 만드는 결과다. Campaign은 승인 결과가 자기 ID에 대한 것인지 다시 확인한다.

**함수형 TO-BE — 상태 전이를 순수 함수로 표현:** Entity의 정체성은 불변 데이터에 유지하고, 행동은 기존 값을 수정하지 않는 함수로 표현한다.

```ts title="src/domain/campaign/campaign-functional.ts"
export type FunctionalCampaign = Readonly<{
  id: CampaignId;
  name: string;
  budgetId: CampaignBudgetId;
  status: CampaignStatus;
}>;

type CampaignTransitionError =
  | "EMPTY_NAME"
  | "INVALID_STATUS"
  | "PUBLICATION_NOT_APPROVED";

export function createCampaign(
  params: Readonly<CreateCampaignParams>,
): Result<FunctionalCampaign, CampaignTransitionError> {
  if (params.name.trim().length === 0) {
    return { ok: false, error: "EMPTY_NAME" };
  }

  return {
    ok: true,
    value: { ...params, status: "DRAFT" },
  };
}

export function submitForReview(
  campaign: FunctionalCampaign,
): Result<FunctionalCampaign, CampaignTransitionError> {
  if (campaign.status !== "DRAFT") {
    return { ok: false, error: "INVALID_STATUS" };
  }

  // 원본 campaign은 그대로 두고 상태가 바뀐 새 Entity 값을 반환한다.
  return {
    ok: true,
    value: { ...campaign, status: "UNDER_REVIEW" },
  };
}

export function publish(
  campaign: FunctionalCampaign,
  decision: PublicationDecision,
): Result<FunctionalCampaign, CampaignTransitionError> {
  if (campaign.status !== "UNDER_REVIEW") {
    return { ok: false, error: "INVALID_STATUS" };
  }

  if (decision.campaignId !== campaign.id || !decision.approved) {
    return { ok: false, error: "PUBLICATION_NOT_APPROVED" };
  }

  return { ok: true, value: { ...campaign, status: "PUBLISHED" } };
}
```

함수형 코드 해설

- `id`가 유지되므로 새 객체를 반환해도 같은 Campaign Entity의 다음 상태다.
- 가능한 실패가 반환 타입에 드러나며 호출자가 모든 오류 분기를 처리할 수 있다.
- OOP의 캡슐화된 메서드 대신 생성 함수와 전이 함수만 공개하는 모듈 경계로 규칙 우회를 제한한다.

테스트 예시

```ts title="src/domain/campaign/Campaign.test.ts"
import { describe, expect, it } from "vitest";
import { Campaign } from "./Campaign";

describe("Campaign", () => {
  it("초안 캠페인을 심사 대기 상태로 전환한다", () => {
    // 테스트는 private 구현이 아니라 외부에서 관찰 가능한 상태 전이를 검증한다.
    const campaign = Campaign.create({
      id: "campaign-1",
      name: "여름 프로모션",
      budgetId: "budget-1",
    });

    campaign.submitForReview();

    expect(campaign.status).toBe("UNDER_REVIEW");
  });

  it("초안 캠페인을 바로 일시 중지할 수 없다", () => {
    const campaign = Campaign.create({
      id: "campaign-1",
      name: "여름 프로모션",
      budgetId: "budget-1",
    });

    expect(() => campaign.pause()).toThrow(
      "PUBLISHED 상태에서만 실행할 수 있습니다.",
    );
  });
});
```

## 4. 일관성 경계

### 4.1 Aggregate와 Aggregate Root 경계 정하기

목적 : 한 트랜잭션에서 반드시 일관되어야 하는 객체 범위를 정하고, 외부가 그 경계를 대표하는 Aggregate Root만 변경하게 한다.

상세 로직

1. 판단 기준 및 적용 조건
   - Aggregate는 연관 객체를 모두 중첩하는 자료구조가 아니라 **즉시 일관성을 보장할 변경 단위**다.
   - Google Ads의 CampaignBudget은 여러 Campaign이 공유할 수 있고 독립적으로 수정되므로, Campaign 내부 객체가 아닌 별도 Aggregate Root로 모델링한다.

2. 실행 절차 및 구현 규칙
   - Campaign Aggregate는 `CampaignBudget` 객체 대신 `CampaignBudgetId`만 참조한다.
   - CampaignBudget 변경은 자기 메서드로 보호하며, 두 Aggregate를 함께 조회해야 하는 규칙은 다음 절의 Policy에서 판정한다.

```ts title="src/domain/campaign/CampaignBudget.ts"
import { Money } from "./Money";
import type { CampaignBudgetId } from "./Campaign";

type CreateCampaignBudgetParams = {
  id: CampaignBudgetId;
  dailyLimit: Money;
};

export class CampaignBudget {
  private constructor(
    readonly id: CampaignBudgetId,
    private limitPerDay: Money,
  ) {}

  static create(params: CreateCampaignBudgetParams): CampaignBudget {
    return new CampaignBudget(params.id, params.dailyLimit);
  }

  static restore(params: CreateCampaignBudgetParams): CampaignBudget {
    return new CampaignBudget(params.id, params.dailyLimit);
  }

  get dailyLimit(): Money {
    return this.limitPerDay;
  }

  changeDailyLimit(next: Money): void {
    // 하위 값을 직접 노출하지 않고 Aggregate Root를 통해서만 변경한다.
    if (next.equals(this.limitPerDay)) {
      return;
    }

    this.limitPerDay = next;
  }
}
```

코드 해설

- Campaign과 CampaignBudget은 각각 외부 변경의 진입점인 Aggregate Root다. Aggregate Root는 특별한 기반 클래스를 상속하는 객체가 아니라 경계의 대표 Entity다.
- Campaign은 `budgetId`로만 CampaignBudget을 참조하므로, 캠페인을 저장할 때 공유 예산까지 함께 저장하는 거대한 객체 그래프를 만들지 않는다.
- `Money`는 불변이므로 `dailyLimit` getter로 반환해도 외부에서 금액 자체를 변조할 수 없다.
- `restore()`는 이후 Repository Mapper가 영속 데이터로 Aggregate를 복원하는 진입점이다. 복원 로직이 생성자 접근 제한을 깨지 않게 한다.

**함수형 TO-BE — Aggregate Root를 새 값으로 갱신:** Aggregate Root를 불변 데이터로 두고, 변경 함수가 같은 ID를 가진 새 Aggregate를 반환하게 한다.

```ts title="src/domain/campaign/campaign-budget-functional.ts"
export type FunctionalCampaignBudget = Readonly<{
  id: CampaignBudgetId;
  dailyLimit: FunctionalMoney;
}>;

export function changeDailyLimit(
  budget: FunctionalCampaignBudget,
  next: FunctionalMoney,
): FunctionalCampaignBudget {
  if (
    budget.dailyLimit.amount === next.amount &&
    budget.dailyLimit.currency === next.currency
  ) {
    return budget;
  }

  // Root를 통하지 않은 부분 갱신 대신 완전한 새 Aggregate 값을 반환한다.
  return {
    ...budget,
    dailyLimit: next,
  };
}
```

함수형 코드 해설

- Aggregate 경계는 클래스 문법이 아니라 어떤 입력을 한 번에 검증하고 저장할지에 관한 규칙이다.
- `CampaignBudgetId`는 유지되고 `dailyLimit`만 바뀌므로 Entity의 정체성과 상태 변화가 구분된다.
- 저장소는 반환된 Aggregate 전체를 저장하며, 호출자는 내부 필드를 직접 대입하지 않는다.

테스트 예시

```ts title="src/domain/campaign/CampaignBudget.test.ts"
import { describe, expect, it } from "vitest";
import { CampaignBudget } from "./CampaignBudget";
import { Money } from "./Money";

describe("CampaignBudget Aggregate", () => {
  it("Aggregate Root의 메서드로 일 예산을 변경한다", () => {
    // 변경 전후에도 같은 Budget ID를 유지하는 Entity의 정체성을 확인한다.
    const budget = CampaignBudget.create({
      id: "budget-1",
      dailyLimit: Money.won(10_000),
    });

    budget.changeDailyLimit(Money.won(30_000));

    expect(budget.dailyLimit.equals(Money.won(30_000))).toBe(true);
  });
});
```

## 5. 여러 모델에 걸친 규칙

### 5.1 Domain Policy로 게시 조건 판정하기

목적 : Campaign과 CampaignBudget 두 Aggregate에 걸친 게시 규칙을 UI나 API 처리 코드가 아니라 도메인 언어로 명시한다.

상세 로직

1. 판단 기준 및 적용 조건
   - 하나의 Entity에 자연스럽게 속하지 않고 여러 도메인 객체가 필요한 무상태 규칙은 Domain Service 또는 Domain Policy로 분리한다.
   - `CampaignPublicationPolicy`는 데이터를 저장하거나 상태를 직접 바꾸지 않고 게시 가능 여부와 거절 사유만 계산한다.

2. 실행 절차 및 구현 규칙
   - 게시하려면 Campaign이 `UNDER_REVIEW`이고, 참조한 Budget ID가 일치하며, KRW 일 예산이 `10,000` 이상이어야 한다.
   - Policy의 결정 후에도 실제 상태 전이는 Campaign Aggregate Root의 `publish()`가 수행한다.

```ts title="src/domain/campaign/CampaignPublicationPolicy.ts"
import { Campaign, type CampaignId } from "./Campaign";
import { CampaignBudget } from "./CampaignBudget";
import { Money } from "./Money";

export type PublicationRejectionReason =
  | "CAMPAIGN_NOT_UNDER_REVIEW"
  | "BUDGET_MISMATCH"
  | "DAILY_BUDGET_TOO_LOW";

export type PublicationDecision = Readonly<{
  campaignId: CampaignId;
  approved: boolean;
  reasons: readonly PublicationRejectionReason[];
}>;

export class CampaignPublicationPolicy {
  private readonly minimumDailyBudget = Money.won(10_000);

  evaluate(
    campaign: Campaign,
    budget: CampaignBudget,
  ): PublicationDecision {
    // 여러 Aggregate에 걸친 위반 사유를 모두 수집해 한 번에 반환한다.
    const reasons: PublicationRejectionReason[] = [];

    if (campaign.status !== "UNDER_REVIEW") {
      reasons.push("CAMPAIGN_NOT_UNDER_REVIEW");
    }

    if (campaign.budgetId !== budget.id) {
      reasons.push("BUDGET_MISMATCH");
    }

    if (!budget.dailyLimit.isAtLeast(this.minimumDailyBudget)) {
      reasons.push("DAILY_BUDGET_TOO_LOW");
    }

    return Object.freeze({
      campaignId: campaign.id,
      approved: reasons.length === 0,
      reasons: Object.freeze(reasons),
    });
  }
}
```

코드 해설

- Policy는 첫 번째 실패에서 예외를 던지지 않고 모든 거절 사유를 반환해, 화면이 사용자에게 수정할 조건을 한 번에 알려 줄 수 있게 한다.
- 최소 예산은 `number`가 아니라 `Money`로 비교하므로 통화와 금액 규칙을 재사용한다.
- 이름이 비어 있지 않다는 조건은 `Campaign.create()`가 이미 보장한다. 항상 참인 규칙을 게시 시점에 중복 검증하지 않는다.

**함수형 TO-BE — Policy를 순수 판정 함수로 표현:** 상태를 가진 Policy 객체 대신, 필요한 정책 값을 인자로 받고 결정만 반환하는 함수로 작성할 수 있다.

```ts title="src/domain/campaign/publication-policy-functional.ts"
export function evaluatePublication(
  campaign: FunctionalCampaign,
  budget: FunctionalCampaignBudget,
  minimumDailyBudget: FunctionalMoney,
): PublicationDecision {
  const reasons: PublicationRejectionReason[] = [];

  if (campaign.status !== "UNDER_REVIEW") {
    reasons.push("CAMPAIGN_NOT_UNDER_REVIEW");
  }

  if (campaign.budgetId !== budget.id) {
    reasons.push("BUDGET_MISMATCH");
  }

  const budgetComparison = isAtLeast(
    budget.dailyLimit,
    minimumDailyBudget,
  );
  if (!budgetComparison.ok || !budgetComparison.value) {
    reasons.push("DAILY_BUDGET_TOO_LOW");
  }

  // 입력 Aggregate를 변경하지 않고 판정 결과만 새 값으로 반환한다.
  return {
    campaignId: campaign.id,
    approved: reasons.length === 0,
    reasons,
  };
}
```

함수형 코드 해설

- 최소 예산을 숨은 내부 상태로 두지 않고 명시적인 인자로 받아 테스트 조건을 쉽게 바꿀 수 있다.
- Policy는 저장, 상태 변경, 네트워크 호출을 하지 않아 같은 입력에 같은 결정을 반환한다.
- `evaluatePublication()`의 승인 결과를 앞 절의 `publish()`에 전달해야만 새 `PUBLISHED` Campaign을 얻을 수 있다.

테스트 예시

```ts title="src/domain/campaign/CampaignPublicationPolicy.test.ts"
import { describe, expect, it } from "vitest";
import { Campaign } from "./Campaign";
import { CampaignBudget } from "./CampaignBudget";
import { CampaignPublicationPolicy } from "./CampaignPublicationPolicy";
import { Money } from "./Money";

describe("CampaignPublicationPolicy", () => {
  it("심사를 마치고 최소 일 예산을 충족한 캠페인을 게시한다", () => {
    const campaign = Campaign.create({
      id: "campaign-1",
      name: "여름 프로모션",
      budgetId: "budget-1",
    });
    const budget = CampaignBudget.create({
      id: "budget-1",
      dailyLimit: Money.won(30_000),
    });
    const policy = new CampaignPublicationPolicy();
    campaign.submitForReview();

    // Policy는 판정하고, 실제 상태 변경은 Aggregate Root가 수행한다.
    const decision = policy.evaluate(campaign, budget);
    campaign.publish(decision);

    expect(decision).toEqual({
      campaignId: "campaign-1",
      approved: true,
      reasons: [],
    });
    expect(campaign.status).toBe("PUBLISHED");
  });

  it("최소 일 예산 미만이면 게시를 거절한다", () => {
    const campaign = Campaign.create({
      id: "campaign-1",
      name: "여름 프로모션",
      budgetId: "budget-1",
    });
    const budget = CampaignBudget.create({
      id: "budget-1",
      dailyLimit: Money.won(9_999),
    });
    const policy = new CampaignPublicationPolicy();
    campaign.submitForReview();

    const decision = policy.evaluate(campaign, budget);

    expect(decision.approved).toBe(false);
    expect(decision.reasons).toContain("DAILY_BUDGET_TOO_LOW");
    expect(() => campaign.publish(decision)).toThrow(
      "게시 정책의 승인이 필요합니다.",
    );
  });
});
```

Entity가 자기 상태 전이를 지키고, Aggregate Root가 변경 경계를 통제하며, Domain Policy가 경계 사이의 규칙을 판정한다. 이 역할 분리가 유지되면 UI, API, 저장소가 바뀌어도 캠페인 게시 규칙은 도메인 모델 안에 남는다.
