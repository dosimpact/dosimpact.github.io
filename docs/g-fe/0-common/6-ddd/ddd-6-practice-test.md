---
sidebar_position: 6
---

# Google Ads 캠페인 설정 실전 적용과 검증

앞 장의 Hexagonal Architecture에 Google Ads 캠페인 설정 흐름을 연결한다. 예제의 브라우저는 자체 Backend for Frontend만 호출하고, OAuth credential과 developer token이 필요한 Google Ads Adapter는 서버에서 실행된다고 가정한다.

## 1. 핵심 키워드 및 개념

### 1.1 핵심 용어 빠르게 보기

| 키워드 | 핵심 개념 |
| --- | --- |
| Draft | 게시 조건이 완성되기 전에도 단계별 입력을 안전하게 저장할 수 있는 캠페인 상태 |
| Publish Use Case | 도메인 사전 검증, 외부 API 호출, 로컬 상태 저장을 조정하는 애플리케이션 흐름 |
| Validation Layer | 입력 형식, 도메인 불변식, 외부 API 정책을 서로 다른 경계에서 검증하는 구조 |
| Idempotency | 같은 게시 요청이 재시도되어도 캠페인이 중복 생성되지 않게 하는 성질 |
| Reconciliation | 로컬 상태와 Google Ads의 실제 상태 차이를 주기적으로 탐지하고 복구하는 과정 |
| Test Double | 실제 Repository나 외부 API Adapter를 대신해 Use Case를 빠르게 검증하는 구현체 |
| Contract Test | Adapter가 Port와 외부 API의 데이터 계약을 올바르게 지키는지 확인하는 테스트 |
| Strangler Pattern | 기존 기능을 유지하면서 복잡한 업무 흐름부터 새 구조로 점진적으로 교체하는 전략 |

## 2. 캠페인 설정 흐름 통합

### 2.1 Draft에서 게시까지 하나의 업무 흐름으로 조정하기

목적 : 여러 단계 폼의 저장 성공과 실제 광고 게시 성공을 구분하고, 불완전한 설정이 집행되는 것을 막는다.

상세 로직

1. 판단 기준 및 적용 조건
  - 이름, 예산, 입찰, 전환 추적, 소재 입력은 임시 저장할 수 있지만 `publish`는 모든 게시 조건을 만족할 때만 허용한다.
  - 외부 시스템 등록은 실패와 재시도가 가능한 별도 단계다. 로컬 `PUBLISHED` 상태는 Google Ads가 성공 응답을 반환하기 전에 확정하지 않는다.

2. 실행 절차 및 구현 규칙
  - `configure`는 단계별 입력을 Aggregate에 반영하고 Draft로 저장하며, `publish`는 Domain 사전 검증 후 외부 Port를 호출한다.
  - 외부 생성 직후 상태는 `PAUSED`로 두고 타기팅과 광고 소재가 준비된 뒤 활성화한다. 이는 Google의 [Create Campaigns 가이드](https://developers.google.com/google-ads/api/docs/campaigns/create-campaigns)에서도 권장하는 안전한 기본값이다.

```ts
// campaign/application/use-cases/publish-campaign.ts
// 외부 플랫폼에 필요한 설정은 Domain Entity가 아니라 Application 계약에 둔다.
export type GoogleAdsLaunchSettings = {
  biddingStrategy: "MANUAL_CPC" | "MAXIMIZE_CONVERSIONS";
  conversionActionResourceName?: string;
};

export interface CampaignPublisher {
  // 실제 생성 전에 외부 계정·API 제약을 부작용 없이 검사한다.
  validate(
    campaign: Campaign,
    budget: CampaignBudget,
    settings: GoogleAdsLaunchSettings,
  ): Promise<ReadonlyArray<ExternalValidationIssue>>;
  publish(
    campaign: Campaign,
    budget: CampaignBudget,
    settings: GoogleAdsLaunchSettings,
    options: { idempotencyKey: string },
  ): Promise<{ resourceName: string }>;
}

export class PublishCampaign {
  constructor(
    private readonly campaigns: CampaignRepository,
    private readonly budgets: CampaignBudgetRepository,
    private readonly policy: CampaignPublicationPolicy,
    private readonly publisher: CampaignPublisher,
  ) {}

  async execute(command: {
    campaignId: CampaignId;
    launchSettings: GoogleAdsLaunchSettings;
    idempotencyKey: string;
  }): Promise<{ resourceName: string }> {
    // 1. 게시에 필요한 두 Aggregate를 각각 복원한다.
    const campaign = await this.campaigns.findById(command.campaignId);
    if (!campaign) throw new CampaignNotFound(command.campaignId);

    const budget = await this.budgets.findById(campaign.budgetId);
    if (!budget) throw new CampaignBudgetNotFound(campaign.budgetId);

    // 2. 비용이 드는 외부 호출보다 Domain 정책을 먼저 평가한다.
    const decision = this.policy.evaluate(campaign, budget);
    if (!decision.approved) {
      throw new CampaignPublicationRejected(decision.reasons);
    }

    // 3. 내부 모델만으로 알 수 없는 Google Ads 제약을 검사한다.
    const issues = await this.publisher.validate(
      campaign,
      budget,
      command.launchSettings,
    );
    if (issues.length > 0) throw new ExternalCampaignRejected(issues);

    // 4. 외부 게시가 성공한 뒤에만 로컬 상태를 PUBLISHED로 확정한다.
    const external = await this.publisher.publish(
      campaign,
      budget,
      command.launchSettings,
      { idempotencyKey: command.idempotencyKey },
    );
    campaign.publish(decision);
    await this.campaigns.save(campaign);
    return external;
  }
}
```

코드 해설

- `CampaignPublicationPolicy`는 `UNDER_REVIEW`, Budget ID 일치, 최소 `10,000 KRW`라는 앞 장의 규칙을 먼저 검사한다.
- `publisher.validate`는 Google Ads 계정 권한이나 vendor enum 조합처럼 외부 시스템만 판단할 수 있는 규칙을 검사한다.
- `MAXIMIZE_CONVERSIONS`와 전환 액션의 조합이 제품의 안정된 규칙이 되면 `GoogleAdsLaunchSettings`를 Domain Value Object로 승격하고 Policy에서 검증한다.
- 서버 Adapter는 `idempotencyKey`와 외부 `resourceName`을 별도 게시 원장에 저장해 응답 유실 후 재시도에서 중복 생성을 막는다.

같은 흐름을 함수형으로 구현하면 Domain의 게시 판단과 상태 전이는 순수 함수가 담당하고, Application 팩터리가 Port 호출 순서만 조정한다.

```ts
// campaign/application/use-cases/publish-campaign.functional.ts
// 함수형 Domain에서 사용할 불변 상태 표현이다.
type CampaignState = Readonly<{
  id: CampaignId;
  name: string;
  budgetId: CampaignBudgetId;
  status: CampaignStatus;
}>;

type CampaignBudgetState = Readonly<{
  id: CampaignBudgetId;
  dailyLimit: Money;
}>;

export type CampaignPublisher = Readonly<{
  validate: (
    campaign: CampaignState,
    budget: CampaignBudgetState,
    settings: GoogleAdsLaunchSettings,
  ) => Promise<ReadonlyArray<ExternalValidationIssue>>;
  publish: (
    campaign: CampaignState,
    budget: CampaignBudgetState,
    settings: GoogleAdsLaunchSettings,
    options: { idempotencyKey: string },
  ) => Promise<{ resourceName: string }>;
}>;

type PublishError =
  | { type: "CAMPAIGN_NOT_FOUND"; campaignId: CampaignId }
  | { type: "BUDGET_NOT_FOUND"; budgetId: CampaignBudgetId }
  | { type: "DOMAIN_REJECTED"; reasons: ReadonlyArray<string> }
  | { type: "EXTERNAL_REJECTED"; issues: ReadonlyArray<ExternalValidationIssue> };

type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// Domain 함수: 기존 Campaign을 변경하지 않고 게시된 새 Campaign을 만든다.
const publishCampaign = (
  campaign: CampaignState,
  decision: PublicationDecision,
): Result<CampaignState, PublishError> =>
  decision.approved
    ? { ok: true, value: { ...campaign, status: "PUBLISHED" } }
    : {
        ok: false,
        error: { type: "DOMAIN_REJECTED", reasons: decision.reasons },
      };

export const createPublishCampaign = (dependencies: {
  campaigns: CampaignRepository;
  budgets: CampaignBudgetRepository;
  evaluatePublication: (
    campaign: CampaignState,
    budget: CampaignBudgetState,
  ) => PublicationDecision;
  publisher: CampaignPublisher;
}) => async (command: {
  campaignId: CampaignId;
  launchSettings: GoogleAdsLaunchSettings;
  idempotencyKey: string;
}): Promise<Result<{ resourceName: string }, PublishError>> => {
  const campaign = await dependencies.campaigns.findById(command.campaignId);
  if (!campaign) {
    return {
      ok: false,
      error: { type: "CAMPAIGN_NOT_FOUND", campaignId: command.campaignId },
    };
  }

  const budget = await dependencies.budgets.findById(campaign.budgetId);
  if (!budget) {
    return {
      ok: false,
      error: { type: "BUDGET_NOT_FOUND", budgetId: campaign.budgetId },
    };
  }

  const decision = dependencies.evaluatePublication(campaign, budget);
  const publishedCampaign = publishCampaign(campaign, decision);
  if (!publishedCampaign.ok) return publishedCampaign;

  const issues = await dependencies.publisher.validate(
    campaign,
    budget,
    command.launchSettings,
  );
  if (issues.length > 0) {
    return { ok: false, error: { type: "EXTERNAL_REJECTED", issues } };
  }

  // 외부 성공 전까지 새 Campaign은 저장하지 않는다.
  const external = await dependencies.publisher.publish(
    campaign,
    budget,
    command.launchSettings,
    { idempotencyKey: command.idempotencyKey },
  );
  await dependencies.campaigns.save(publishedCampaign.value);
  return { ok: true, value: external };
};
```

OOP의 `campaign.publish(decision)`은 내부 상태를 변경하지만 함수형 `publishCampaign(campaign, decision)`은 새 값을 반환한다. 외부 API 같은 부수 효과는 순수 Domain 함수가 아니라 Application 함수에 남는다.

### 2.2 Google Ads 설정을 서버 Adapter에서 번역하기

목적 : 통화의 micros 단위와 Google Ads resource name을 도메인에서 제거하고, vendor 변경 범위를 Adapter로 제한한다.

상세 로직

1. 판단 기준 및 적용 조건
  - Google Ads의 `amountMicros`는 통화 1단위의 백만분율 표현이므로 원 단위 값에 `1_000_000`을 곱해 문자열로 전송한다.
  - 평균 일 예산과 캠페인은 별도 resource이며 캠페인이 budget resource name을 참조한다. 이 순서는 서버의 통합 Adapter가 감춘다.

2. 실행 절차 및 구현 규칙
  - Campaign, CampaignBudget, 출시 설정을 vendor payload로 변환하는 Mapper를 두고 새 캠페인의 status를 `PAUSED`로 고정한다.
  - 브라우저에는 자체 `/publish` Port만 노출하고 Google Ads access token, developer token, customer ID 권한 처리는 서버 경계 안에 둔다.

```ts
// server/google-ads/google-ads-campaign-mapper.ts
type GoogleAdsDraft = {
  budget: {
    name: string;
    amountMicros: string;
    deliveryMethod: "STANDARD";
  };
  campaign: {
    name: string;
    status: "PAUSED";
    advertisingChannelType: "SEARCH";
    campaignBudget?: string;
    maximizeConversions?: Record<string, never>;
    manualCpc?: Record<string, never>;
    networkSettings: {
      targetGoogleSearch: boolean;
      targetSearchNetwork: boolean;
      targetContentNetwork: boolean;
      targetPartnerSearchNetwork: boolean;
    };
  };
};

export function toGoogleAdsDraft(
  // Mapper가 실제로 읽는 최소 구조만 받으면 OOP Entity와 함수형 상태가 함께 사용한다.
  campaign: Readonly<{ name: string }>,
  budget: Readonly<{ dailyLimit: Money }>,
  settings: GoogleAdsLaunchSettings,
): GoogleAdsDraft {
  // 내부 입찰 전략을 Google Ads가 요구하는 상호 배타적 필드로 번역한다.
  const bidding = settings.biddingStrategy === "MAXIMIZE_CONVERSIONS"
    ? { maximizeConversions: {} }
    : { manualCpc: {} };

  return {
    budget: {
      name: `${campaign.name} budget`,
      // 원 단위 Domain 값을 Google Ads의 micros 문자열로 바꾼다.
      amountMicros: (BigInt(budget.dailyLimit.amount) * 1_000_000n).toString(),
      deliveryMethod: "STANDARD",
    },
    campaign: {
      name: campaign.name,
      // 생성 즉시 의도치 않게 집행되지 않도록 안전한 초기 상태를 사용한다.
      status: "PAUSED",
      advertisingChannelType: "SEARCH",
      ...bidding,
      networkSettings: {
        targetGoogleSearch: true,
        targetSearchNetwork: true,
        targetContentNetwork: false,
        targetPartnerSearchNetwork: false,
      },
    },
  };
}
```

코드 해설

- `BigInt`를 사용하면 큰 예산을 micros로 바꿀 때 JavaScript `number`의 안전 정수 범위를 넘는 문제를 피할 수 있다.
- `campaignBudget`은 예산 생성 결과로 받은 resource name을 서버 Adapter가 주입한다. Domain의 `CampaignBudget`은 이 외부 식별자를 알 필요가 없다.
- Google Ads는 평균 일 예산을 별도 `CampaignBudget`으로 생성한다. 세부 제약은 공식 [Campaign Budgets 가이드](https://developers.google.com/google-ads/api/docs/campaigns/budgets/create-budgets)를 기준으로 Adapter 계약 테스트에서 고정한다.

이 Mapper는 이미 순수 함수이므로 OOP와 함수형에서 그대로 재사용할 수 있다. 중요한 기준은 `class` 사용 여부보다 같은 입력에 같은 `GoogleAdsDraft`를 반환하고 외부 호출을 포함하지 않는다는 점이다.

## 3. 계층별 검증과 테스트

### 3.1 검증을 폼, Domain, 외부 API의 세 겹으로 배치하기

목적 : 같은 검사를 무작정 반복하지 않고 각 경계가 알 수 있는 오류를 가장 이른 시점에 발견한다.

상세 로직

1. 판단 기준 및 적용 조건
  - Zod는 필수값과 타입, Domain은 업무 불변식, Google Ads `validate_only`는 외부 계정과 API 제약을 담당한다.
  - 외부 검증 실패를 `name` 같은 폼 필드에 연결할 수 있으면 field path로 번역하고, 연결할 수 없으면 캠페인 수준 오류로 보여 준다.

2. 실행 절차 및 구현 규칙
  - 게시 버튼을 누르면 Domain 검증, 자체 서버 dry-run, 실제 mutate 순으로 실행한다.
  - Google Ads의 `validate_only`는 요청을 실행하지 않고 오류만 반환한다. 지원 여부와 요청 필드는 사용 중인 버전의 [MutateCampaignsRequest](https://developers.google.com/google-ads/api/reference/rpc/v25/MutateCampaignsRequest)에서 확인한다.

```ts
// server/google-ads/google-ads-campaign-publisher.ts
export class GoogleAdsCampaignPublisher implements CampaignPublisher {
  constructor(
    private readonly api: GoogleAdsApi,
    private readonly publicationLedger: PublicationLedger,
  ) {}

  async validate(
    campaign: Campaign,
    budget: CampaignBudget,
    settings: GoogleAdsLaunchSettings,
  ): Promise<ExternalValidationIssue[]> {
    // 실제 mutate와 동일한 Mapper를 사용해야 dry-run과 실요청의 형식이 같아진다.
    const draft = toGoogleAdsDraft(campaign, budget, settings);
    const result = await this.api.validateDraft(draft, { validateOnly: true });
    return GoogleAdsErrorMapper.toIssues(result.errors);
  }

  async publish(
    campaign: Campaign,
    budget: CampaignBudget,
    settings: GoogleAdsLaunchSettings,
    options: { idempotencyKey: string },
  ) {
    // 같은 요청의 재시도라면 기존 결과를 반환해 중복 캠페인 생성을 막는다.
    const previous = await this.publicationLedger.find(options.idempotencyKey);
    if (previous) return previous;

    const draft = toGoogleAdsDraft(campaign, budget, settings);
    // Google Ads의 참조 순서에 맞춰 Budget을 먼저 만들고 Campaign에 연결한다.
    const externalBudget = await this.api.createBudget(draft.budget);
    const result = await this.api.createCampaign({
      ...draft.campaign,
      campaignBudget: externalBudget.resourceName,
    });
    await this.publicationLedger.save(options.idempotencyKey, result);
    return result;
  }
}
```

코드 해설

- dry-run과 실제 생성은 시간 차이 때문에 결과가 달라질 수 있다. 실제 mutate 오류도 같은 `GoogleAdsErrorMapper`로 처리해야 한다.
- 예산 생성 후 캠페인 생성이 실패할 수 있으므로 실패 작업을 기록하고, 고아 예산 삭제 또는 재연결을 수행하는 reconciliation job을 둔다.
- 상호 의존하는 작업에 `partial_failure`를 켜면 중간 상태가 늘어난다. Google의 [Partial Failure 가이드](https://developers.google.com/google-ads/api/docs/best-practices/partial-failures)에 따라 서로 참조하는 작업은 전체 성공이 필요한 흐름으로 취급한다.

함수형 Adapter는 SDK와 게시 원장을 인자로 받아 `CampaignPublisher` 함수 레코드를 반환한다.

```ts
// server/google-ads/google-ads-campaign-publisher.functional.ts
export const createGoogleAdsCampaignPublisher = (dependencies: {
  api: GoogleAdsApi;
  publicationLedger: PublicationLedger;
}): CampaignPublisher => ({
  validate: async (campaign, budget, settings) => {
    // 순수 Mapper와 부수 효과가 있는 API 호출의 경계를 눈에 보이게 나눈다.
    const draft = toGoogleAdsDraft(campaign, budget, settings);
    const result = await dependencies.api.validateDraft(draft, {
      validateOnly: true,
    });
    return GoogleAdsErrorMapper.toIssues(result.errors);
  },

  publish: async (campaign, budget, settings, options) => {
    const previous = await dependencies.publicationLedger.find(
      options.idempotencyKey,
    );
    if (previous) return previous;

    const draft = toGoogleAdsDraft(campaign, budget, settings);
    const externalBudget = await dependencies.api.createBudget(draft.budget);
    const result = await dependencies.api.createCampaign({
      ...draft.campaign,
      campaignBudget: externalBudget.resourceName,
    });
    await dependencies.publicationLedger.save(options.idempotencyKey, result);
    return result;
  },
});
```

클래스의 private 필드는 클로저에 캡슐화된다. Port를 사용하는 쪽에서는 두 Adapter의 호출 방식이 동일하다.

### 3.2 Domain과 Use Case를 빠른 테스트로 고정하기

목적 : UI 렌더링이나 네트워크 없이 캠페인 정책과 게시 조정 순서를 검증한다.

상세 로직

1. 판단 기준 및 적용 조건
  - Domain 테스트는 “어떤 입력이 허용되는가”, Use Case 테스트는 “어떤 Port를 어떤 순서로 호출하는가”를 검증한다.
  - private 필드나 메서드 호출 횟수보다 상태 전이, 저장 결과, 외부 게시 여부 같은 관찰 가능한 행동을 단언한다.

2. 실행 절차 및 구현 규칙
  - Repository와 Publisher의 메모리 구현을 만들고 성공, Domain 거절, 외부 검증 거절, 재시도 시나리오를 테스트한다.
  - 시간, ID, idempotency key가 결과에 관여하면 생성기를 Port로 주입해 테스트를 결정적으로 만든다.

```ts
// campaign/application/use-cases/publish-campaign.test.ts
describe("PublishCampaign", () => {
  it("게시 가능한 Campaign을 외부에 등록한 뒤 PUBLISHED로 저장한다", async () => {
    const campaign = Campaign.create({
      id: "campaign-1",
      name: "여름 프로모션",
      budgetId: "budget-1",
    });
    campaign.submitForReview();
    const budget = CampaignBudget.create({
      id: "budget-1",
      dailyLimit: Money.won(30_000),
    });
    const campaigns = new InMemoryCampaignRepository([campaign]);
    const budgets = new InMemoryCampaignBudgetRepository([budget]);
    const publisher = new FakeCampaignPublisher({
      issues: [],
      resourceName: "customers/123/campaigns/456",
    });

    // 실제 네트워크 대신 InMemory Repository와 Fake Port로 흐름을 검증한다.
    const result = await new PublishCampaign(
      campaigns,
      budgets,
      new CampaignPublicationPolicy(),
      publisher,
    ).execute({
      campaignId: campaign.id,
      launchSettings: { biddingStrategy: "MANUAL_CPC" },
      idempotencyKey: "publish-request-1",
    });

    expect(publisher.publishedIds).toEqual([campaign.id]);
    expect((await campaigns.findById(campaign.id))?.status).toBe("PUBLISHED");
    expect(result.resourceName).toBe("customers/123/campaigns/456");
  });

  it("Domain 규칙을 위반하면 외부 Port를 호출하지 않는다", async () => {
    const campaign = Campaign.create({
      id: "campaign-1",
      name: "여름 프로모션",
      budgetId: "budget-1",
    });
    campaign.submitForReview();
    const budget = CampaignBudget.create({
      id: "budget-1",
      dailyLimit: Money.won(9_999),
    });
    const campaigns = new InMemoryCampaignRepository([campaign]);
    const budgets = new InMemoryCampaignBudgetRepository([budget]);
    const publisher = new FakeCampaignPublisher();

    // 정책 거절 시 외부 Publisher가 호출되지 않는 것도 중요한 관찰 결과다.
    await expect(
      new PublishCampaign(
        campaigns,
        budgets,
        new CampaignPublicationPolicy(),
        publisher,
      ).execute({
        campaignId: campaign.id,
        launchSettings: { biddingStrategy: "MANUAL_CPC" },
        idempotencyKey: "publish-request-2",
      }),
    ).rejects.toBeInstanceOf(CampaignPublicationRejected);
    expect(publisher.publishedIds).toHaveLength(0);
  });
});
```

코드 해설

- 첫 테스트는 외부 성공 뒤에만 `PUBLISHED`로 저장된다는 Application 규칙을 보호한다.
- 둘째 테스트는 Domain 거절이 비용과 부작용이 있는 Google Ads 호출보다 먼저 일어나는지 확인한다.
- Fake는 Google Ads SDK 모양을 흉내 내지 않고 Application Port인 `CampaignPublisher` 계약만 구현한다.

함수형 테스트에서는 Fake class 대신 테스트가 관찰할 배열을 닫아 두는 함수 레코드를 직접 주입할 수 있다.

```ts
// campaign/application/use-cases/publish-campaign.functional.test.ts
it("함수형 Use Case는 외부 게시 성공 뒤 새 Campaign을 저장한다", async () => {
  const original = CampaignFixture.underReview({
    id: "campaign-1",
    budgetId: "budget-1",
  });
  const budget = CampaignBudgetFixture.valid({ id: "budget-1" });
  const saved: CampaignState[] = [];
  const publishedIds: CampaignId[] = [];

  // Fake는 Port와 같은 함수 모양만 제공하며 SDK 구현을 흉내 내지 않는다.
  const campaigns: CampaignRepository = {
    findById: async (id) => id === original.id ? original : null,
    save: async (campaign) => { saved.push(campaign); },
  };
  const budgets: CampaignBudgetRepository = {
    findById: async (id) => id === budget.id ? budget : null,
    save: async () => undefined,
  };
  const publisher: CampaignPublisher = {
    validate: async () => [],
    publish: async (campaign) => {
      publishedIds.push(campaign.id);
      return { resourceName: "customers/123/campaigns/456" };
    },
  };

  const execute = createPublishCampaign({
    campaigns,
    budgets,
    evaluatePublication: (campaign) => ({
      campaignId: campaign.id,
      approved: true,
      reasons: [],
    }),
    publisher,
  });
  const result = await execute({
    campaignId: original.id,
    launchSettings: { biddingStrategy: "MANUAL_CPC" },
    idempotencyKey: "publish-request-1",
  });

  expect(result).toEqual({
    ok: true,
    value: { resourceName: "customers/123/campaigns/456" },
  });
  expect(publishedIds).toEqual([original.id]);
  expect(saved[0]).toEqual({ ...original, status: "PUBLISHED" });
  // 입력 객체는 그대로이므로 테스트 간 공유해도 상태가 새지 않는다.
  expect(original.status).toBe("UNDER_REVIEW");
});

it("함수형 Domain 거절은 Publisher 호출 없이 실패 값으로 반환한다", async () => {
  let publishCount = 0;
  const execute = createPublishCampaign({
    campaigns: fakeCampaignRepository(CampaignFixture.underReview()),
    budgets: fakeBudgetRepository(CampaignBudgetFixture.tooSmall()),
    evaluatePublication: () => ({
      campaignId: "campaign-1",
      approved: false,
      reasons: ["DAILY_BUDGET_TOO_LOW"],
    }),
    publisher: {
      validate: async () => [],
      publish: async () => {
        publishCount += 1;
        return { resourceName: "never-created" };
      },
    },
  });

  const result = await execute(PublishCampaignFixture.command());

  expect(result).toEqual({
    ok: false,
    error: {
      type: "DOMAIN_REJECTED",
      reasons: ["DAILY_BUDGET_TOO_LOW"],
    },
  });
  expect(publishCount).toBe(0);
});
```

테스트 대상이 받는 의존성 타입이 곧 Fake의 최소 구현 범위다. `Result`를 직접 단언하므로 예상 가능한 실패를 `rejects`로 검사할 필요도 없다.

### 3.3 Adapter 계약과 React 통합을 좁게 검증하기

목적 : 단위 테스트가 잡지 못하는 DTO 변환과 사용자 상호작용 오류를 적은 수의 경계 테스트로 보완한다.

상세 로직

1. 판단 기준 및 적용 조건
  - Mapper는 실제 응답 fixture로 contract test를 작성하고, React는 사용자가 보는 label과 오류 메시지를 기준으로 테스트한다.
  - Google Ads sandbox나 실제 계정을 사용하는 검증은 느리고 상태를 만들기 때문에 별도 smoke test로 분리한다.

2. 실행 절차 및 구현 규칙
  - MSW로 자체 API만 가로채 폼 제출 payload, 오류 매핑, Query invalidation을 검증한다.
  - CI에서는 Domain과 Application 테스트를 항상 실행하고, 외부 smoke test는 제한된 테스트 계정과 명시적 정리 절차로 실행한다.

```tsx
// campaign/ui/campaign-settings-form.test.tsx
it("유효한 설정을 저장하고 서버의 확정 값을 다시 조회한다", async () => {
  const user = userEvent.setup();
  renderCampaignSettingsPage({ campaign: CampaignFixture.draft() });

  // 구현 내부가 아니라 사용자가 실제로 수행하는 입력과 클릭을 재현한다.
  await user.clear(screen.getByLabelText("일 예산"));
  await user.type(screen.getByLabelText("일 예산"), "30000");
  await user.click(screen.getByRole("button", { name: "저장" }));

  await waitFor(() => {
    expect(apiLog.updateCampaignBudget).toHaveBeenCalledWith(
      expect.objectContaining({ daily_limit_won: 30_000 }),
    );
  });
  expect(await screen.findByText("저장됨")).toBeInTheDocument();
  expect(apiLog.getCampaign).toHaveBeenCalledTimes(2);
});
```

코드 해설

- 테스트는 React Hook Form의 내부 상태 대신 label 입력, 저장 동작, 확정 상태 재조회라는 사용자 관찰 결과를 검증한다.
- `getCampaign` 두 번째 호출은 Mutation 성공 후 detail query가 무효화되어 서버 상태를 다시 읽었음을 보여 준다.
- DTO의 정확한 필드 변환은 Mapper contract test에 두고, UI 테스트에서 모든 vendor 필드를 반복 검증하지 않는다.

React 통합 테스트는 OOP와 함수형에서 동일하다. Hook과 컴포넌트는 사용자가 관찰하는 입력·오류·재조회만 검증하고, 주입된 Application이 클래스 인스턴스인지 실행 함수인지는 테스트의 관심사가 아니다.

## 4. 기존 React 프로젝트에 점진적으로 도입하기

### 4.1 복잡도가 있는 경계부터 Strangler 방식으로 교체하기

목적 : 전체 프로젝트를 한 번에 계층화하지 않고 변경이 잦고 규칙 위반 비용이 큰 캠페인 게시 흐름부터 개선한다.

상세 로직

1. 판단 기준 및 적용 조건
  - 단순 조회·표시 화면은 기존 구조를 유지하고, 조건문이 반복되거나 여러 API의 순서와 실패 복구가 필요한 흐름을 우선 대상으로 고른다.
  - 계층마다 파일 하나를 의무적으로 만드는 식의 추상화는 피한다. 교체 가능성이나 독립 테스트 가치가 있을 때 Port를 만든다.

2. 실행 절차 및 구현 규칙
  - 공통 용어와 순수 Domain 규칙을 먼저 추출하고, 다음으로 Mapper와 Repository, Use Case, React Adapter 순서로 이동한다.
  - feature flag 또는 route 단위로 새 흐름을 열어 결과를 비교하고, 오류율과 중복 생성 여부가 안정된 뒤 legacy 경로를 제거한다.

**AS-IS와 TO-BE를 함께 운영하는 전환 단계:** feature flag의 두 분기가 기존 저장 경로와 새 Domain 경로를 명확히 보여 준다.

```ts
// campaign/migration/save-campaign.ts
export async function saveCampaign(
  input: LegacyCampaignForm,
  flags: { useCampaignDomain: boolean },
) {
  if (!flags.useCampaignDomain) {
    // AS-IS: 폼 데이터를 기존 API에 직접 전달한다.
    return legacyCampaignApi.save(input);
  }

  // TO-BE: 기존 폼을 명령으로 번역한 뒤 Application Use Case를 호출한다.
  return campaignApplication.changeDailyBudget.execute(
    legacyFormMapper.toCommand(input),
  );
}

// 단계별 완료 조건
export const campaignMigrationChecks = [
  "Domain이 React와 API DTO를 import하지 않는다",
  "동일한 게시 규칙이 폼마다 중복되지 않는다",
  "외부 재시도에 같은 idempotency key를 사용한다",
  "legacy와 새 흐름의 성공률 및 오류 유형을 비교한다",
] as const;
```

코드 해설

- `legacyFormMapper`를 Anti-Corruption Layer로 사용하면 기존 폼을 유지한 채 새 Use Case부터 검증할 수 있다.
- feature flag는 장기적인 분기점이 아니라 이행 도구다. 관찰 기간과 제거 조건을 작업에 함께 기록한다.
- 최종 기준은 폴더 수가 아니라 규칙의 단일성, 테스트 속도, 실패 복구 가능성이다. 추상화가 이 세 가지를 개선하지 않으면 단순한 구조가 낫다.
