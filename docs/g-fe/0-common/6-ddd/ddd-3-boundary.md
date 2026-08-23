---
sidebar_position: 3
---

# Ubiquitous Language와 Bounded Context로 비즈니스 경계 나누기

DDD의 모델은 개발자가 혼자 만드는 클래스 구조가 아니다. 기획자, 광고 운영자, 디자이너, 개발자가 같은 업무를 같은 말로 설명하고 그 말이 유효한 범위를 코드 경계로 만드는 과정이다.

이 문서는 앞 문서의 Google Ads 캠페인 설정 예제를 이어 간다. 마케팅 담당자가 캠페인 초안을 만들고 예산을 검토한 뒤 게시하면 게재와 성과 분석으로 정보가 전달된다.

## 1. 핵심 키워드 및 개념

### 1.1 핵심 용어 빠르게 보기

| 키워드 | 핵심 개념 |
| --- | --- |
| Ubiquitous Language | 도메인 전문가와 개발자가 대화, 화면, 테스트, 코드에서 함께 사용하는 공통 언어 |
| Bounded Context | 특정 도메인 모델과 용어의 의미가 일관되게 유지되는 명시적 경계 |
| Subdomain | 전체 비즈니스 도메인을 역할과 문제 영역에 따라 나눈 부분 |
| Context Map | Bounded Context 사이의 관계와 데이터 흐름, 의존성 방향을 표현한 지도 |
| Integration Contract | Context가 이벤트나 API로 교환하는 데이터의 명시적 계약 |
| Anti-Corruption Layer | 외부 시스템의 모델이 내부 도메인에 침투하지 않도록 번역하는 계층 |
| Public API | 다른 Context가 내부 구현에 직접 의존하지 않도록 공개한 최소 진입점 |
| Composition | 하나의 화면이 여러 Context의 조회 결과와 행동을 경계를 유지하며 조합하는 방식 |

## 2. Ubiquitous Language 만들기

### 2.1 업무 용어를 코드와 화면에 일치시키기

목적 : 회의에서 쓰는 말, UI 문구, 타입과 함수 이름이 같은 의미를 가리키게 해 번역 과정의 오해를 줄인다.

상세 로직

1. 판단 기준 및 적용 조건
   - data, item, process, submit처럼 맥락을 숨기는 이름이 많으면 공통 언어가 부족한 상태다.
   - 같은 행동을 기획서는 “게시”, UI는 “저장”, 코드는 activate로 부르면 서로 다른 상태 전이로 이해하기 쉽다.
   - 공통 언어는 용어 사전뿐 아니라 대화, 시나리오, 테스트, 코드에서 반복해 사용하는 언어다.

2. 실행 절차 및 구현 규칙
   - 도메인 전문가가 구분하는 명사, 상태, 행동, 규칙을 실제 예문과 함께 기록한다.
   - 코드에는 구현 방식보다 사용자의 의도가 드러나는 이름을 사용한다.
   - 용어가 바뀌면 UI, 이벤트, 테스트, 코드의 영향을 함께 검토한다.

캠페인 설정 팀은 “초안(Draft)”과 “게시(Publish)”를 핵심 용어로 합의했다고 가정한다.

~~~tsx
// 팀이 합의한 명사(Draft)와 행동(Publish)을 타입과 API 이름에 그대로 사용한다.
type CampaignDraft = {
  id: CampaignId;
  name: CampaignName;
  publishingStatus: "DRAFT" | "PUBLISHED";
};

interface PublishCampaignUseCase {
  execute(draftId: CampaignId): Promise<PublishCampaignResult>;
}

function PublishCampaignButton({
  draft,
  publishCampaign,
}: {
  draft: CampaignDraft;
  publishCampaign: PublishCampaignUseCase;
}) {
  return (
    <button
      // 게시된 캠페인은 UI에서도 같은 Publish 규칙에 따라 다시 실행하지 못하게 한다.
      disabled={draft.publishingStatus !== "DRAFT"}
      onClick={() => publishCampaign.execute(draft.id)}
    >
      캠페인 게시
    </button>
  );
}
~~~

코드 해설

- handleData, submit, status 대신 PublishCampaign, draftId, publishingStatus로 업무 의미를 드러낸다.
- 버튼 문구와 유스케이스 이름이 모두 “게시”를 사용하므로 같은 상태 전이를 가리킨다.
- publishingStatus처럼 관점을 이름에 포함하면 뒤에서 등장할 게재 상태와 구별할 수 있다.

### 2.2 구체적인 시나리오로 언어 검증하기

목적 : 용어 정의를 암기하는 데 그치지 않고 실제 캠페인 규칙을 예시와 테스트 문장으로 검증한다.

상세 로직

1. 판단 기준 및 적용 조건
   - 하나의 용어를 사람마다 다른 예로 설명하면 아직 합의되지 않은 것이다.
   - 정상 예, 경계값, 실패 예를 말할 수 있어야 코드로 옮길 만큼 구체적인 언어다.
   - 기술 용어가 업무 문장을 대신하면 도메인 전문가가 검증하기 어렵다.

2. 실행 절차 및 구현 규칙
   - “주어진 상황에서, 어떤 행동을 하면, 어떤 결과가 된다”는 예시를 작성한다.
   - 예시의 명사와 동사를 테스트 이름과 도메인 API에 그대로 사용한다.
   - 모호성이 발견되면 타입을 만들기 전에 용어와 상태 전이부터 다시 합의한다.

~~~ts
describe("캠페인 게시", () => {
  it("유효한 예산, 기간, 입찰 전략을 가진 초안을 게시한다", () => {
    // Given: 도메인 전문가가 말하는 '유효한 초안'을 준비한다.
    const draft = CampaignDraftFixture.valid();

    // When: 구현 용어가 아니라 업무 행동인 publish를 실행한다.
    draft.publish();

    // Then: 합의한 게시 상태로 전이했는지 확인한다.
    expect(draft.publishingStatus).toBe("PUBLISHED");
  });

  it("이미 게시된 캠페인은 다시 게시하지 않는다", () => {
    const publishedCampaign = CampaignDraftFixture.published();

    expect(() => publishedCampaign.publish()).toThrow(
      "이미 게시된 캠페인입니다.",
    );
  });
});
~~~

코드 해설

- 테스트 이름 자체가 도메인 전문가와 검토할 수 있는 규칙 문장이 된다.
- “API가 400을 반환한다”가 아니라 “이미 게시된 캠페인은 다시 게시하지 않는다”를 검증한다.
- 용어의 의미가 바뀌면 실패하는 테스트가 변경 지점을 알려 준다.

## 3. Bounded Context 식별

### 3.1 같은 단어의 서로 다른 의미 분리

목적 : 하나의 거대한 Campaign 모델에 모든 부서의 관점을 넣지 않고 언어와 규칙이 일관된 범위를 Bounded Context로 나눈다.

상세 로직

1. 판단 기준 및 적용 조건
   - 같은 Campaign이라도 설정, 게재, 성과 분석에서 필요한 속성과 상태가 다르다.
   - 한 용어의 정의가 대화 상대나 업무 단계에 따라 달라지면 컨텍스트 경계의 강한 후보다.
   - 데이터가 함께 보인다는 이유보다 규칙, 변경 이유, 업무 책임자가 같은지를 우선한다.

2. 실행 절차 및 구현 규칙
   - 각 업무가 캠페인에 묻는 질문과 수행하는 행동을 나열한다.
   - 컨텍스트마다 필요한 최소 모델을 독립적으로 정의한다.
   - 컨텍스트 이름을 코드 모듈과 팀 대화에서 함께 사용한다.

| Bounded Context | Campaign이 의미하는 것 | 대표 질문 |
| --- | --- | --- |
| Campaign Setup | 목표, 입찰, 예산, 기간을 편집하는 초안 | 게시 조건을 충족했는가? |
| Ad Delivery | 광고 게재 대상으로 등록된 단위 | 지금 게재 가능한가? |
| Performance Reporting | 클릭, 비용, 전환을 집계하는 분석 차원 | 기간별 ROAS는 얼마인가? |

~~~ts
// campaign-setup/domain/CampaignDraft.ts
// 설정 컨텍스트는 게시 준비에 필요한 값과 상태만 가진다.
export type SetupCampaign = {
  id: CampaignId;
  bidding: Bidding;
  dailyBudget: Money;
  schedule: CampaignSchedule;
  publishingStatus: "DRAFT" | "PUBLISHED";
};

// ad-delivery/domain/DeliverableCampaign.ts
// 게재 컨텍스트는 같은 campaignId를 자신만의 게재 관점으로 해석한다.
export type DeliverableCampaign = {
  campaignId: CampaignId;
  servingStatus: "ELIGIBLE" | "PAUSED" | "ENDED";
  approvedCreativeCount: number;
};

// performance-reporting/domain/CampaignPerformance.ts
// 리포팅 컨텍스트에는 편집 상태 대신 집계 지표가 필요하다.
export type CampaignPerformance = {
  campaignId: CampaignId;
  impressions: number;
  clicks: number;
  cost: Money;
  conversions: number;
};
~~~

코드 해설

- publishingStatus, servingStatus, 성과 지표는 서로 다른 이유로 바뀌므로 하나의 상태 열거형으로 합치지 않는다.
- SetupCampaign에는 클릭 수가 필요 없고 CampaignPerformance에는 폼 편집 상태가 필요 없다.
- CampaignId로 관계를 연결하되 한 컨텍스트의 객체를 다른 컨텍스트가 직접 수정하지 않는다.

### 3.2 조직 책임과 변경 이유에 맞춰 경계 정하기

목적 : 화면이나 데이터베이스 테이블이 아니라 업무 능력, 정책 소유자, 변경 주기에 따라 경계를 결정한다.

상세 로직

1. 판단 기준 및 적용 조건
   - 두 기능이 함께 변경되고 같은 전문가가 규칙을 결정하면 같은 컨텍스트일 가능성이 높다.
   - 배포 주기, 장애 영향, 권한, 정책 소유자가 다르면 분리할 이유가 강해진다.
   - 컴포넌트 하나에 보인다는 이유만으로 같은 컨텍스트라고 단정하지 않는다.

2. 실행 절차 및 구현 규칙
   - 각 규칙의 결정권자와 변경 원인을 기록한다.
   - 경계 안에서는 모델을 공유하고 경계 밖에는 명시적인 계약만 공개한다.
   - 확신이 없다면 모듈 경계로 시작하고 독립 배포는 운영 필요가 생겼을 때 검토한다.

예산 추천은 설정 화면에 표시되지만 사내 예산 정책 팀이 소유하는 Budget Planning 컨텍스트라고 가정한다.

~~~ts
// Campaign Setup이 Budget Planning에 묻는 질문만 Port로 공개한다.
export type BudgetRecommendationQuery = Readonly<{
  objective: "SALES" | "LEADS";
  channel: "SEARCH" | "DISPLAY";
  currency: string;
}>;

export type BudgetRecommendation = Readonly<{
  suggestedDailyBudgetMicros: bigint;
  explanation: string;
}>;

export interface BudgetRecommendationPort {
  recommend(
    query: BudgetRecommendationQuery,
  ): Promise<BudgetRecommendation>;
}
~~~

코드 해설

- Campaign Setup은 추천 알고리즘을 소유하지 않고 필요한 질문만 계약으로 선언한다.
- Budget Planning이 알고리즘을 바꿔도 계약이 유지되면 설정 도메인은 바뀌지 않는다.
- 별도 컨텍스트는 반드시 별도 서버를 뜻하지 않는다. 같은 저장소에서도 모듈과 공개 API로 경계를 만들 수 있다.

**함수형 TO-BE — 함수 타입을 Port로 사용:** 클래스나 `interface` 구현 없이도, 필요한 함수의 시그니처를 계약으로 선언하고 의존성을 인자로 전달할 수 있다.

~~~ts
type Result<T, E> =
  | Readonly<{ ok: true; value: T }>
  | Readonly<{ ok: false; error: E }>;

type BudgetRecommendationError =
  | "UNSUPPORTED_CHANNEL"
  | "POLICY_UNAVAILABLE";

// Port는 호출에 필요한 입력과 결과만 표현한다.
type RecommendBudget = (
  query: BudgetRecommendationQuery,
) => Promise<Result<BudgetRecommendation, BudgetRecommendationError>>;

// Application 함수는 구체적인 HTTP Client 대신 Port 함수를 인자로 받는다.
const createLoadBudgetRecommendation = (recommend: RecommendBudget) =>
  async (
    draft: Readonly<{
      objective: "SALES" | "LEADS";
      channel: "SEARCH" | "DISPLAY";
      currency: string;
    }>,
  ): Promise<Result<BudgetRecommendation, BudgetRecommendationError>> =>
    recommend({
      objective: draft.objective,
      channel: draft.channel,
      currency: draft.currency,
    });
~~~

함수형 코드 해설

- 함수 타입도 Port다. 핵심은 `interface` 문법이 아니라 내부가 요구하는 계약과 외부 구현을 분리하는 것이다.
- `createLoadBudgetRecommendation()`은 의존성을 클로저로 주입하지만, 생성자 주입 예제와 같은 의존성 방향을 만든다.
- 실패를 `Result`에 포함하므로 호출자는 추천 실패를 예외가 아닌 명시적인 분기로 처리한다.

## 4. Context Map과 통합 계약

### 4.1 컨텍스트 사이의 관계 명시

목적 : 어느 컨텍스트가 정보를 만들고 누가 소비하는지 드러내 암묵적인 양방향 의존을 막는다.

상세 로직

1. 판단 기준 및 적용 조건
   - 다른 모듈의 내부 객체를 직접 import하거나 수정하면 관계와 책임이 숨겨진다.
   - 업스트림은 의미 있는 사실이나 서비스를 제공하고 다운스트림은 자신의 모델로 해석한다.
   - 동기 응답이 필요한지 이미 일어난 사실을 비동기로 전달해도 되는지 구분한다.

2. 실행 절차 및 구현 규칙
   - 업스트림과 다운스트림, 전달 데이터, 실패 처리 방식을 Context Map에 기록한다.
   - 명령은 수행을 요청하는 동사로, 이벤트는 이미 일어난 사실의 과거형으로 이름 짓는다.
   - 이벤트에는 소비자에게 필요한 안정적인 최소 정보만 담는다.

~~~text
# 화살표는 정보의 제공자 → 소비자 방향이며, 화면 배치 순서가 아니다.
Budget Planning --추천 응답--> Campaign Setup --CampaignPublished--> Ad Delivery
                                              └--CampaignPublished--> Performance Reporting
~~~

~~~ts
// 이미 일어난 사실을 전달하므로 이벤트 이름은 과거형을 사용한다.
type CampaignPublished = Readonly<{
  eventId: string;
  occurredAt: string;
  campaignId: string;
  objective: "SALES" | "LEADS";
  dailyBudgetMicros: string;
  currencyCode: string;
  schedule: { startDate: string; endDate: string };
}>;

interface DomainEventPublisher {
  publish(event: CampaignPublished): Promise<void>;
}

class PublishCampaign {
  constructor(
    private readonly campaigns: CampaignRepository,
    private readonly events: DomainEventPublisher,
  ) {}

  async execute(id: CampaignId): Promise<void> {
    const campaign = await this.campaigns.findDraft(id);
    campaign.publish();
    await this.campaigns.save(campaign);
    // 내부 Entity 대신 소비자가 해석할 수 있는 안정적인 계약만 발행한다.
    await this.events.publish(campaign.toPublishedEvent());
  }
}
~~~

코드 해설

- CampaignPublished는 설정 컨텍스트에서 완료된 사실이며 게재와 리포팅은 각자의 모델로 변환한다.
- 이벤트에 Campaign Setup 클래스 인스턴스나 React 상태를 넣지 않는다.
- 실제 시스템에서는 저장과 이벤트 발행의 원자성, 중복 처리, 계약 버전 호환성을 함께 설계한다.

**함수형 TO-BE — 불변 상태에서 이벤트 만들기:** Aggregate를 변경한 뒤 메서드로 이벤트를 꺼내는 대신, 순수 전이 함수가 새 상태와 이벤트를 함께 반환할 수 있다.

~~~ts
type PublishError = "NOT_DRAFT";

type PublishTransition = Readonly<{
  campaign: PublishedCampaign;
  event: CampaignPublished;
}>;

type CampaignToPublish = Readonly<{
  id: string;
  publishingStatus: "DRAFT" | "PUBLISHED";
  objective: "SALES" | "LEADS";
  dailyBudgetMicros: string;
  currencyCode: string;
  schedule: Readonly<{ startDate: string; endDate: string }>;
}>;

type PublishedCampaign = Omit<CampaignToPublish, "publishingStatus"> &
  Readonly<{ publishingStatus: "PUBLISHED" }>;

function publishCampaign(
  campaign: CampaignToPublish,
  occurredAt: string,
): Result<PublishTransition, PublishError> {
  if (campaign.publishingStatus !== "DRAFT") {
    return { ok: false, error: "NOT_DRAFT" };
  }

  // 입력 객체를 수정하지 않고 새 상태와 외부에 공개할 사실을 함께 만든다.
  const published = {
    ...campaign,
    publishingStatus: "PUBLISHED" as const,
  };

  return {
    ok: true,
    value: {
      campaign: published,
      event: toCampaignPublished(published, occurredAt),
    },
  };
}

// 이벤트 변환도 같은 입력에 같은 결과를 만드는 순수 함수다.
function toCampaignPublished(
  campaign: PublishedCampaign,
  occurredAt: string,
): CampaignPublished {
  return {
    eventId: `campaign-published:${campaign.id}:${occurredAt}`,
    occurredAt,
    campaignId: campaign.id,
    objective: campaign.objective,
    dailyBudgetMicros: campaign.dailyBudgetMicros,
    currencyCode: campaign.currencyCode,
    schedule: campaign.schedule,
  };
}
~~~

함수형 코드 해설

- 현재 시각을 함수 안에서 읽지 않고 `occurredAt`으로 받아 순수성과 테스트 재현성을 유지한다.
- 상태 전이 실패는 `Result`로 표현하고, 성공한 경우에만 `PUBLISHED` 상태와 이벤트가 함께 존재한다.
- 저장과 실제 발행은 부수 효과이므로 이 순수 함수 바깥의 Application 계층에서 수행한다.

### 4.2 Anti-Corruption Layer로 외부 모델 번역

목적 : 외부 Google Ads API의 용어와 형식이 내부 Campaign Setup 모델을 지배하지 않도록 번역 계층을 둔다.

상세 로직

1. 판단 기준 및 적용 조건
   - 외부 API 열거형과 필드명이 도메인 전체에 퍼지면 외부 모델에 종속된 상태다.
   - 내부 개념과 외부 개념이 일대일로 대응하지 않을수록 Anti-Corruption Layer(ACL)가 필요하다.
   - 외부 응답의 누락, 단위, 버전 차이는 경계에서 처리한다.

2. 실행 절차 및 구현 규칙
   - 어댑터가 내부 명령을 외부 요청으로, 외부 응답을 내부 결과로 변환한다.
   - 매핑할 수 없는 값은 통과시키지 않고 명시적인 통합 오류로 반환한다.
   - 외부 SDK 타입은 어댑터 폴더 밖으로 export하지 않는다.

~~~ts
class GoogleAdsCampaignPublisher implements CampaignPublisherPort {
  constructor(private readonly client: GoogleAdsClient) {}

  async publish(
    campaign: PublishableCampaign,
  ): Promise<ExternalCampaignId> {
    // 내부 모델을 외부 SDK가 요구하는 이름과 날짜 형식으로 경계에서 번역한다.
    const operation: GoogleAdsCampaignOperation = {
      create: {
        name: campaign.name.value,
        advertisingChannelType: toGoogleChannel(campaign.channel),
        campaignBudget: campaign.budgetResourceName,
        startDate: formatGoogleAdsDate(campaign.schedule.startDate),
        endDate: formatGoogleAdsDate(campaign.schedule.endDate),
      },
    };

    const response = await this.client.mutateCampaigns([operation]);
    return ExternalCampaignId.from(
      response.results[0].resourceName,
    );
  }
}
~~~

코드 해설

- Google Ads 요청 타입과 날짜 포맷은 통합 어댑터 안에만 존재한다.
- 도메인은 advertisingChannelType이나 리소스 이름 형식을 알 필요가 없다.
- 외부 API 버전이 바뀌면 우선 어댑터와 계약 테스트를 수정하고 내부 모델 변경은 별도로 판단한다.

**함수형 TO-BE — 순수 ACL 변환과 효과 실행 분리:** 외부 요청 변환과 응답 해석은 순수 함수로 두고, 네트워크 호출만 Adapter 함수에 남긴다.

~~~ts
type GoogleAdsMappingError =
  | "UNSUPPORTED_CHANNEL"
  | "MISSING_RESOURCE_NAME";

function toGoogleAdsOperation(
  campaign: PublishableCampaign,
): Result<GoogleAdsCampaignOperation, GoogleAdsMappingError> {
  const channel = toGoogleChannelResult(campaign.channel);
  if (!channel.ok) return channel;

  // 내부 모델을 변경하지 않고 외부 SDK 전용 값을 새로 만든다.
  return {
    ok: true,
    value: {
      create: {
        name: campaign.name.value,
        advertisingChannelType: channel.value,
        campaignBudget: campaign.budgetResourceName,
        startDate: formatGoogleAdsDate(campaign.schedule.startDate),
        endDate: formatGoogleAdsDate(campaign.schedule.endDate),
      },
    },
  };
}

type MutateCampaigns = (
  operations: readonly GoogleAdsCampaignOperation[],
) => Promise<GoogleAdsMutateResponse>;

const createGoogleAdsCampaignPublisher = (mutate: MutateCampaigns) =>
  async (
    campaign: PublishableCampaign,
  ): Promise<Result<ExternalCampaignId, GoogleAdsMappingError>> => {
    const operation = toGoogleAdsOperation(campaign);
    if (!operation.ok) return operation;

    // 네트워크 부수 효과는 주입된 Adapter 함수 한곳에서만 실행한다.
    const response = await mutate([operation.value]);
    const resourceName = response.results[0]?.resourceName;

    return resourceName
      ? { ok: true, value: ExternalCampaignId.from(resourceName) }
      : { ok: false, error: "MISSING_RESOURCE_NAME" };
  };
~~~

함수형 코드 해설

- ACL의 번역 규칙을 순수 함수로 분리해 외부 Client 없이 단위 테스트할 수 있다.
- 외부 값이 매핑되지 않는 경우를 `GoogleAdsMappingError`로 제한해 SDK 예외가 Domain까지 새지 않게 한다.
- 고차 함수가 외부 호출 함수를 주입받으므로 클래스 기반 Adapter와 같은 교체 가능성을 제공한다.

## 5. 프런트엔드에 경계 반영

### 5.1 기능 모듈의 공개 API 제한

목적 : Bounded Context를 폴더 이름에만 표시하지 않고 import 규칙과 공개 진입점으로 강제한다.

상세 로직

1. 판단 기준 및 적용 조건
   - 다른 기능이 domain/entities 같은 내부 경로를 import하면 경계가 쉽게 무너진다.
   - 외부에는 유스케이스, 입력·출력 계약, 조립 함수처럼 협업에 필요한 요소만 공개한다.
   - 공용 폴더에는 기술적으로 재사용되는 코드만 두고 Campaign 같은 도메인 모델을 넣지 않는다.

2. 실행 절차 및 구현 규칙
   - 각 컨텍스트 루트에 index.ts를 만들고 공개 계약을 명시한다.
   - 린트의 import 제한이나 모듈 경계 테스트로 내부 경로 접근을 막는다.
   - React는 같은 컨텍스트의 유스케이스를 사용하고 다른 컨텍스트는 공개 API로만 호출한다.

~~~text
features/
├── campaign-setup/
│   ├── domain/
│   ├── application/
│   ├── adapters/
│   ├── ui/
│   └── index.ts
├── budget-planning/
│   └── index.ts
└── performance-reporting/
    └── index.ts
~~~

~~~ts
// features/campaign-setup/index.ts
// 다른 컨텍스트가 사용할 수 있는 공개 계약만 루트에서 export한다.
export type {
  CampaignDraftView,
  PublishCampaignResult,
} from "./application/contracts";
export {
  createCampaignSetupFacade,
} from "./composition";

// 허용: 다른 컨텍스트의 공개 API 사용
import {
  createBudgetPlanningFacade,
} from "@/features/budget-planning";

// 금지: 다른 컨텍스트의 내부 모델 직접 접근
// import { BudgetPolicy } from
//   "@/features/budget-planning/domain/BudgetPolicy";
~~~

코드 해설

- 폴더 트리는 물리적 위치를, index.ts는 논리적 공개 범위를 나타낸다.
- 공개 타입을 화면용 읽기 모델로 제한하면 다른 컨텍스트가 내부 엔티티를 수정할 수 없다.
- 조립 지점에서 어댑터를 주입하므로 도메인과 UI의 import 방향을 일정하게 유지한다.

### 5.2 하나의 화면에서 여러 컨텍스트 조합

목적 : 한 페이지에 보이는 모든 데이터를 하나의 도메인 모델로 합치지 않고 페이지 계층에서 읽기 모델을 조합한다.

상세 로직

1. 판단 기준 및 적용 조건
   - 캠페인 설정 화면에 예산 추천과 예상 성과가 함께 보여도 각 규칙의 소유권은 다를 수 있다.
   - 페이지는 여러 컨텍스트의 결과를 배치할 수 있지만 내부 객체를 서로 넘기지 않는다.
   - 사용자 동작의 트랜잭션 경계와 화면 레이아웃 경계를 구분한다.

2. 실행 절차 및 구현 규칙
   - 페이지가 각 컨텍스트의 파사드에서 읽기 모델을 조회한다.
   - 컨텍스트 사이에는 식별자와 명시적인 입력 계약만 전달한다.
   - 로딩과 오류 상태를 컨텍스트별로 구분해 한 기능의 실패가 전체 편집을 막지 않게 한다.

~~~tsx
function CampaignSetupPage({
  campaignId,
  campaignSetup,
  budgetPlanning,
}: CampaignSetupPageProps) {
  // Campaign Setup의 읽기 모델은 해당 컨텍스트의 Facade에서 조회한다.
  const draft = useQuery({
    queryKey: ["campaign-draft", campaignId],
    queryFn: () => campaignSetup.getDraft(campaignId),
  });

  // Budget Planning의 실패는 추천 카드에만 격리한다.
  const recommendation = useQuery({
    queryKey: ["budget-recommendation", campaignId],
    enabled: draft.data !== undefined,
    queryFn: () =>
      budgetPlanning.recommend({
        objective: draft.data!.objective,
        channel: draft.data!.channel,
        currency: draft.data!.currency,
      }),
  });

  if (draft.isPending) return <CampaignFormSkeleton />;
  if (draft.isError) return <CampaignLoadError />;

  return (
    <CampaignEditor draft={draft.data}>
      <BudgetRecommendationCard
        recommendation={recommendation.data}
        isUnavailable={recommendation.isError}
      />
    </CampaignEditor>
  );
}
~~~

코드 해설

- 페이지는 두 컨텍스트의 결과를 배치하지만 BudgetPolicy나 캠페인 엔티티를 직접 다루지 않는다.
- Budget Planning이 실패해도 캠페인 편집은 유지하고 추천 카드만 사용할 수 없게 표현한다.
- 한 화면에서 조합해도 모델의 소유권과 변경 규칙은 각 Bounded Context에 남는다.

## 6. 경계 유지와 점검

### 6.1 언어와 경계를 변화에 맞춰 갱신

목적 : 최초 설계를 고정된 정답으로 취급하지 않고 새 업무 지식에 따라 언어와 경계를 지속해서 다듬는다.

상세 로직

1. 판단 기준 및 적용 조건
   - 같은 용어를 설명하는 조건문이 컨텍스트마다 늘어나면 의미 분리가 필요하다.
   - 한 변경 요청이 여러 컨텍스트 내부를 동시에 수정하게 하면 통합 계약이나 경계를 재검토한다.
   - 두 컨텍스트가 늘 함께 바뀌고 독립된 언어가 없다면 과도하게 나눈 것일 수 있다.

2. 실행 절차 및 구현 규칙
   - 기획 대화와 회고에서 새 용어, 동의어, 충돌하는 정의를 수집한다.
   - 용어 변경 시 타입, 유스케이스, 이벤트, UI 문구, 테스트를 함께 검색한다.
   - Context Map의 제공자, 소비자, 계약 버전, 장애 책임을 코드 변화와 동기화한다.

~~~ts
// 계약 변경을 숨기지 않고 버전으로 소비자의 마이그레이션 기간을 확보한다.
type CampaignPublishedV2 = Readonly<{
  type: "CampaignPublished";
  version: 2;
  campaignId: string;
  objective: "SALES" | "LEADS";
  biddingStrategy:
    | { type: "MAXIMIZE_CONVERSIONS" }
    | { type: "TARGET_CPA"; targetCpaMicros: string };
  occurredAt: string;
}>;

function toDeliveryRegistration(
  event: CampaignPublishedV2,
): RegisterDeliverableCampaign {
  // Ad Delivery는 이벤트를 그대로 저장하지 않고 자신의 명령으로 번역한다.
  return {
    campaignId: event.campaignId,
    optimizationGoal: toDeliveryOptimizationGoal(
      event.objective,
      event.biddingStrategy,
    ),
  };
}
~~~

코드 해설

- 이벤트 버전은 업스트림 변경을 소비자에게 예고하고 호환 기간을 운영할 수 있게 한다.
- Ad Delivery는 이벤트를 그대로 모델로 쓰지 않고 자신의 등록 명령으로 번역한다.
- 번역 함수가 복잡해지는 현상은 두 컨텍스트의 언어 차이가 커졌다는 관찰 가능한 신호다.

### 6.2 실무 경계 체크리스트 적용

목적 : 새 캠페인 요구사항을 어느 컨텍스트가 소유해야 하는지 일관된 질문으로 판단한다.

상세 로직

1. 판단 기준 및 적용 조건
   - 누가 규칙을 결정하고 어떤 업무 결과를 책임지는가?
   - 기존 용어와 같은 정의를 사용하는가, 이름만 같고 의미는 다른가?
   - 같은 불변식과 트랜잭션 안에서 반드시 함께 변경되어야 하는가?
   - 다른 변경 주기, 권한, 장애 영향, 외부 시스템 의존성을 가지는가?

2. 실행 절차 및 구현 규칙
   - 답이 기존 컨텍스트와 일치하면 그 모델의 새 행위로 추가한다.
   - 의미와 책임이 다르면 새 컨텍스트 또는 기존 컨텍스트의 공개 계약으로 모델링한다.
   - 결정과 근거를 Context Map과 모듈 공개 API에 반영한다.

“성과가 낮으면 캠페인을 자동 중지한다”는 요구사항은 단순한 설정 필드 추가가 아니다.

~~~ts
// Performance Optimization이 성과를 판단한다.
type PauseCampaignRecommendation = Readonly<{
  campaignId: string;
  reason: "LOW_ROAS" | "BUDGET_EXHAUSTED";
  evaluatedAt: string;
}>;

// 생명주기 권한을 가진 컨텍스트에 명시적으로 요청한다.
interface CampaignLifecyclePort {
  requestPause(
    recommendation: PauseCampaignRecommendation,
  ): Promise<"ACCEPTED" | "REJECTED">;
}
~~~

코드 해설

- 성과 판단과 캠페인 생명주기 변경을 각 책임자에게 둔다.
- 추천 객체와 포트가 협업 계약을 드러내므로 성과 모델이 설정 모델 안으로 침투하지 않는다.
- 핵심 질문은 “어느 폴더가 편한가?”가 아니라 “누가 어떤 언어와 규칙을 책임지는가?”이다.
