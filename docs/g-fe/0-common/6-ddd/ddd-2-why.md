---
sidebar_position: 2
---

# DDD가 필요한 이유

DDD(Domain-Driven Design)는 모든 화면에 적용하는 코드 구성 기법이 아니다. 비즈니스 규칙이 자주 바뀌고 같은 데이터도 업무 맥락에 따라 다르게 해석될 때, 소프트웨어의 중심을 화면이나 API가 아니라 **도메인 지식**에 두는 설계 방식이다.

이 문서에서는 마케팅 담당자가 Google Ads 검색 캠페인의 목표, 입찰 전략, 일일 예산, 집행 기간을 설정하고 초안을 게시하는 과정을 하나의 연속 예제로 사용한다. 실제 Google Ads 정책을 재현하는 예제가 아니라 프런트엔드 DDD를 설명하기 위한 축소 모델이다.

## 1. 핵심 키워드 및 개념

### 1.1 핵심 용어 빠르게 보기

| 키워드 | 핵심 개념 |
| --- | --- |
| Domain | 소프트웨어가 해결하려는 업무 영역과 그 안의 지식, 규칙, 용어 |
| Domain Model | 도메인의 상태와 행동, 제약 조건을 코드로 표현한 모델 |
| Domain Policy | 여러 도메인 값이나 객체를 함께 판단하며 자주 변경되는 업무 정책 |
| Business Rule | 목표·입찰 전략·예산·상태처럼 업무 의미를 함께 해석해야 하는 규칙 |
| Use Case | 캠페인 생성이나 게시처럼 사용자의 하나의 목표를 실행하는 애플리케이션 흐름 |
| Port | Use Case가 저장소나 외부 API에 요구하는 기능을 정의한 인터페이스 |
| Adaptor | Port을 실제 구현하는 구현체. '어떻게'을 만든다. Rest API, DB Query든 실제 구현이 담김. |
| 점진적 도입 | 전체를 한 번에 재설계하지 않고 복잡도가 높은 업무 흐름부터 DDD로 전환하는 전략 |

## 2. 비즈니스 복잡성 발견

### 2.1 필드 검증과 도메인 규칙 구분

목적 : 입력 폼에 흩어진 조건문이 단순 UI 검증인지, 독립적으로 보존할 비즈니스 규칙인지 구분한다.

상세 로직

1. 판단 기준 및 적용 조건
   - required, 문자열 길이처럼 표현 형식에 관한 조건은 UI 검증에 가깝다.
   - 목표와 입찰 전략의 조합, 예산과 게시 상태처럼 여러 값과 업무 상태를 함께 해석해야 하는 조건은 도메인 규칙이다.
   - 같은 조건이 저장, 미리보기, 게시, 일괄 편집에서 반복되면 화면 밖으로 꺼낼 신호다.

2. 실행 절차 및 구현 규칙
   - 컴포넌트가 API 호출 직전에 검사하는 조건을 자연어 규칙으로 먼저 적는다.
   - UI 이벤트와 무관하게 참과 거짓을 판단할 수 있는 규칙부터 도메인 연산으로 옮긴다.

**AS-IS — DDD 적용 전:** 다음 코드는 캠페인 규칙이 제출 이벤트에 섞인 초기 구현이다.

~~~tsx
type CampaignForm = {
  // 편집 중인 값과 게시에 필요한 업무 값을 하나의 타입이 모두 담당한다.
  biddingStrategy: "MAXIMIZE_CONVERSIONS" | "TARGET_CPA";
  dailyBudgetWon: number;
  targetCpaWon?: number;
  startDate: string;
  endDate: string;
};

function PublishButton({ form }: { form: CampaignForm }) {
  const submit = async () => {
    // 업무 규칙이 UI 이벤트 안에 있어 다른 게시 화면에서 재사용하기 어렵다.
    if (form.dailyBudgetWon <= 0) {
      alert("일일 예산은 0원보다 커야 합니다.");
      return;
    }
    if (form.biddingStrategy === "TARGET_CPA" && !form.targetCpaWon) {
      alert("목표 CPA를 입력해야 합니다.");
      return;
    }
    if (form.startDate > form.endDate) {
      alert("종료일은 시작일보다 빨라서는 안 됩니다.");
      return;
    }
    await fetch("/api/campaigns", {
      method: "POST",
      body: JSON.stringify(form),
    });
  };

  return <button onClick={submit}>캠페인 게시</button>;
}
~~~

코드 해설

- 컴포넌트가 입력 상태, 도메인 판단, 오류 문구, 서버 통신을 모두 소유한다.
- 다른 화면에서도 게시할 수 있게 되면 세 조건을 복사하게 되고 규칙이 서로 달라지기 쉽다.
- 날짜 비교가 문자열 형식에 우연히 의존하며 잘못된 조합도 자유롭게 만들 수 있다.

### 2.2 DTO와 도메인 모델 구분

목적 : API 응답이나 폼 상태를 그대로 업무 모델로 사용하는 데이터 중심 설계의 한계를 이해한다.

상세 로직

1. 판단 기준 및 적용 조건
   - DTO는 전송 형식, 폼 상태는 편집 형식, 도메인 모델은 유효한 상태와 행위를 표현하는 형식이다.
   - 모든 필드가 선택적이고 string 또는 number로만 구성되면 저장 구조가 업무 의미를 대신하고 있을 가능성이 크다.
   - 서버 스키마 변경이 컴포넌트 전체로 전파되면 변환 경계가 필요하다.

2. 실행 절차 및 구현 규칙
   - 외부 DTO를 애플리케이션 경계에서 명시적인 도메인 값으로 변환한다.
   - 통화 단위, 날짜 범위, 상태처럼 오해하기 쉬운 값은 생성 시 검증한다.

**TO-BE — 변환 경계 적용 후:** DTO를 그대로 사용하지 않고, 경계에서 검증된 도메인 값으로 변환한다.

~~~ts
type CampaignDto = {
  // 서버와 주고받는 외부 계약이므로 전송 단위와 문자열 표현을 유지한다.
  id: string;
  dailyBudgetMicros: string;
  currencyCode: string;
  startDate: string;
  endDate: string;
};

type CampaignSnapshot = Readonly<{
  // 내부에서는 의미와 유효성이 보장된 도메인 타입만 사용한다.
  id: CampaignId;
  dailyBudget: Money;
  schedule: CampaignSchedule;
}>;

function toCampaignSnapshot(dto: CampaignDto): CampaignSnapshot {
  // 서버 표현을 해석하는 지식을 이 변환 함수 한 곳에 모은다.
  return {
    id: CampaignId.from(dto.id),
    dailyBudget: Money.fromMicros(
      BigInt(dto.dailyBudgetMicros),
      dto.currencyCode,
    ),
    schedule: CampaignSchedule.between(dto.startDate, dto.endDate),
  };
}
~~~

코드 해설

- CampaignDto는 외부 계약이므로 문자열 기반 전송 형식을 그대로 보존한다.
- 변환 함수가 통화 단위와 날짜를 해석하는 단일 진입점이 된다.
- 이후 코드에서는 dailyBudgetMicros의 단위나 날짜 비교 방식을 반복해서 알 필요가 없다.

## 3. 도메인 모델로 규칙 보호

### 3.1 값 객체와 엔티티로 유효한 상태 만들기

목적 : 캠페인의 핵심 규칙을 값 객체(Value Object)와 엔티티(Entity)의 생성·변경 연산에 모은다.

상세 로직

1. 판단 기준 및 적용 조건
   - 값의 정체성보다 내용과 불변 조건이 중요하면 값 객체로 표현한다.
   - 캠페인처럼 수정 전후에도 같은 식별자를 유지하는 개념은 엔티티로 표현한다.
   - 불가능한 조합을 타입으로 제거할 수 있으면 판별 유니온을 우선한다.

2. 실행 절차 및 구현 규칙
   - 생성자를 직접 열기보다 검증하는 팩터리 메서드를 제공한다.
   - 필드를 외부에서 직접 바꾸지 않고 업무 의미가 드러나는 행위로 변경한다.

**TO-BE — 도메인 모델 적용 후:** 생성과 상태 변경을 도메인 연산으로 제한해 잘못된 상태를 만들기 어렵게 한다.

~~~ts
class DomainRuleError extends Error {}

class Money {
  private constructor(
    readonly micros: bigint,
    readonly currency: string,
  ) {}

  static fromMicros(micros: bigint, currency: string): Money {
    // 유효하지 않은 금액은 객체가 되기 전에 차단한다.
    if (micros <= 0n) {
      throw new DomainRuleError("금액은 0보다 커야 합니다.");
    }
    return new Money(micros, currency);
  }
}

class CampaignSchedule {
  private constructor(
    readonly startDate: Date,
    readonly endDate: Date,
  ) {}

  static between(start: string, end: string): CampaignSchedule {
    // 문자열 날짜를 Date로 해석하고 기간의 선후 관계까지 함께 검증한다.
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (
      Number.isNaN(startDate.valueOf()) ||
      Number.isNaN(endDate.valueOf()) ||
      startDate > endDate
    ) {
      throw new DomainRuleError("집행 기간이 올바르지 않습니다.");
    }
    return new CampaignSchedule(startDate, endDate);
  }
}

type Bidding =
  // TARGET_CPA일 때만 targetCpa가 존재하도록 가능한 조합을 타입으로 제한한다.
  | { type: "MAXIMIZE_CONVERSIONS" }
  | { type: "TARGET_CPA"; targetCpa: Money };

class CampaignDraft {
  private publishingStatus: "DRAFT" | "PUBLISHED" = "DRAFT";

  constructor(
    readonly id: CampaignId,
    private dailyBudget: Money,
    private schedule: CampaignSchedule,
    private bidding: Bidding,
  ) {}

  changeBudget(nextBudget: Money): void {
    // 필드 직접 변경 대신 업무 행위를 통해 상태 전이 규칙을 통과시킨다.
    this.assertDraft();
    this.dailyBudget = nextBudget;
  }

  changeBidding(nextBidding: Bidding): void {
    this.assertDraft();
    this.bidding = nextBidding;
  }

  publish(): void {
    this.assertDraft();
    this.publishingStatus = "PUBLISHED";
  }

  private assertDraft(): void {
    if (this.publishingStatus !== "DRAFT") {
      throw new DomainRuleError(
        "게시된 캠페인의 설정은 직접 변경할 수 없습니다.",
      );
    }
  }
}
~~~

코드 해설

- Money와 CampaignSchedule은 생성된 뒤에는 항상 유효하므로 하위 로직이 검증을 반복하지 않는다.
- Bidding은 TARGET_CPA일 때만 targetCpa가 존재하도록 타입으로 조합을 제한한다.
- changeBudget, changeBidding, publish는 setter가 아니라 업무 언어로 표현한 행위다.
- 실제 제품에서는 시간대와 외부 Google Ads 정책을 정책 객체와 어댑터에서 더 정교하게 다뤄야 한다.

**함수형 TO-BE — 불변 데이터와 순수 상태 전이:** 같은 규칙을 클래스 내부 변경 없이 `Readonly` 데이터와 `Result`로 표현한다.

~~~ts
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

type DomainError = Readonly<{
  code: "INVALID_MONEY" | "INVALID_SCHEDULE" | "NOT_DRAFT";
  message: string;
}>;

type MoneyValue = Readonly<{ micros: bigint; currency: string }>;
type ScheduleValue = Readonly<{ startDate: Date; endDate: Date }>;
type BiddingValue =
  | Readonly<{ type: "MAXIMIZE_CONVERSIONS" }>
  | Readonly<{ type: "TARGET_CPA"; targetCpa: MoneyValue }>;

function createMoney(
  micros: bigint,
  currency: string,
): Result<MoneyValue, DomainError> {
  if (micros <= 0n) {
    return {
      ok: false,
      error: { code: "INVALID_MONEY", message: "금액은 0보다 커야 합니다." },
    };
  }
  return { ok: true, value: Object.freeze({ micros, currency }) };
}

function createSchedule(
  start: string,
  end: string,
): Result<ScheduleValue, DomainError> {
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (
    Number.isNaN(startDate.valueOf()) ||
    Number.isNaN(endDate.valueOf()) ||
    startDate > endDate
  ) {
    return {
      ok: false,
      error: { code: "INVALID_SCHEDULE", message: "집행 기간이 올바르지 않습니다." },
    };
  }
  return { ok: true, value: Object.freeze({ startDate, endDate }) };
}

type CampaignDraftData = Readonly<{
  id: CampaignId;
  dailyBudget: MoneyValue;
  schedule: ScheduleValue;
  // 함수형 Value Object만 참조해 OOP Money 구현과 결합하지 않는다.
  bidding: BiddingValue;
  publishingStatus: "DRAFT" | "PUBLISHED";
}>;

function publishDraft(
  campaign: CampaignDraftData,
): Result<CampaignDraftData, DomainError> {
  if (campaign.publishingStatus !== "DRAFT") {
    return {
      ok: false,
      error: { code: "NOT_DRAFT", message: "초안만 게시할 수 있습니다." },
    };
  }

  // 원본을 변경하지 않고 게시된 새 값을 반환한다.
  return {
    ok: true,
    value: { ...campaign, publishingStatus: "PUBLISHED" },
  };
}
~~~

함수형 표현에서도 Entity의 식별자와 Value Object의 불변식은 유지된다. 차이는 상태와 행위를 객체에 캡슐화하는 대신, 유효한 불변 데이터와 그 데이터를 변환하는 순수 함수로 분리한다는 점이다.

### 3.2 유스케이스와 포트로 변경 방향 제어

목적 : React와 네트워크 코드는 교체할 수 있게 두고 캠페인 게시 순서와 도메인 규칙은 안정적으로 유지한다.

상세 로직

1. 판단 기준 및 적용 조건
   - 저장소, 분석 로그, 외부 API가 도메인 객체 안으로 들어가면 테스트와 교체가 어려워진다.
   - 하나의 사용자 행동이 조회, 규칙 실행, 저장을 조정하면 유스케이스가 필요하다.
   - 도메인은 프레임워크를 import하지 않고 외부 의존성은 포트 인터페이스 뒤에 둔다.

2. 실행 절차 및 구현 규칙
   - 유스케이스는 식별자로 엔티티를 조회하고 도메인 행위를 호출한 뒤 저장한다.
   - React는 사용자의 의도를 명령으로 전달하고 성공·실패 상태만 표현한다.

~~~tsx
// Output Port: Application이 저장 기술에 요구하는 최소 계약이다.
interface CampaignRepository {
  findDraft(id: CampaignId): Promise<CampaignDraft>;
  save(campaign: CampaignDraft): Promise<void>;
}

class PublishCampaign {
  constructor(private readonly campaigns: CampaignRepository) {}

  async execute(rawId: string): Promise<void> {
    // Use Case는 조회 → 도메인 행위 → 저장 순서만 조정한다.
    const campaign = await this.campaigns.findDraft(
      CampaignId.from(rawId),
    );
    campaign.publish();
    await this.campaigns.save(campaign);
  }
}

function PublishCampaignButton({
  campaignId,
  publishCampaign,
}: {
  campaignId: string;
  publishCampaign: PublishCampaign;
}) {
  const [error, setError] = useState<string>();
  const [isPending, setPending] = useState(false);

  const publish = async () => {
    // React는 사용자 입력과 진행·오류 표시만 담당한다.
    setPending(true);
    try {
      await publishCampaign.execute(campaignId);
    } catch (cause) {
      setError(
        cause instanceof DomainRuleError
          ? cause.message
          : "캠페인을 게시하지 못했습니다.",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <div>
      <button disabled={isPending} onClick={publish}>
        {isPending ? "게시 중" : "캠페인 게시"}
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
~~~

코드 해설

- PublishCampaign은 React, fetch, Google Ads SDK를 모른 채 게시라는 업무 흐름만 조정한다.
- 저장 방식은 CampaignRepository 구현체가 담당하므로 메모리 저장소로 유스케이스를 테스트할 수 있다.
- 버튼은 규칙을 재구현하지 않고 사용자의 의도를 유스케이스에 전달한다.

**함수형 TO-BE — Port를 함수 묶음으로 주입:** Domain 함수는 순수하게 유지하고 조회·저장은 Use Case 경계에서만 실행한다.

~~~ts
type CampaignRepositoryPort = Readonly<{
  findDraft: (id: CampaignId) => Promise<CampaignDraftData | null>;
  save: (campaign: CampaignDraftData) => Promise<void>;
}>;

type PublishError =
  | DomainError
  | Readonly<{ code: "CAMPAIGN_NOT_FOUND" }>;

function createPublishCampaign(port: CampaignRepositoryPort) {
  return async function publishCampaign(
    id: CampaignId,
  ): Promise<Result<void, PublishError>> {
    // 부수 효과는 이 경계 함수에 모으고 Domain 계산은 publishDraft에 위임한다.
    const campaign = await port.findDraft(id);
    if (!campaign) {
      return { ok: false, error: { code: "CAMPAIGN_NOT_FOUND" } };
    }

    const published = publishDraft(campaign);
    if (!published.ok) return published;

    await port.save(published.value);
    return { ok: true, value: undefined };
  };
}

const publishCampaign = createPublishCampaign(httpCampaignRepository);
~~~

클래스의 `interface`와 생성자 주입은 함수 타입과 클로저로 대응된다. React는 반환된 오류 코드를 사용자 문구로 바꾸며, Domain과 Use Case는 React 상태나 `fetch`를 알지 않는다.

### 3.3 자주 바뀌는 정책을 분리하기

목적 : 캠페인 정책을 하나의 명시적인 규칙으로 관리해 화면과 어댑터의 연쇄 수정을 막는다.

상세 로직

1. 판단 기준 및 적용 조건
   - 릴리스마다 기준값이나 허용 조합이 바뀌면 엔티티에 숫자를 하드코딩하지 않는다.
   - 조직 정책과 외부 플랫폼 정책을 구분해 변경 주기와 소유자를 드러낸다.
   - 정책은 도메인 값을 받아 판단하고 UI 타입이나 DTO를 받지 않는다.

2. 실행 절차 및 구현 규칙
   - 정책 인터페이스를 정의하고 게시 직전에 현재 정책을 만족하는지 검사한다.
   - 실패를 구조화된 코드로 반환해 UI가 표현 문구를 선택하게 한다.

~~~ts
// UI 문구 대신 안정적인 오류 코드와 관련 도메인 값을 반환한다.
type PolicyViolation =
  | { code: "BUDGET_TOO_LOW"; minimum: Money }
  | { code: "UNSUPPORTED_BIDDING"; bidding: Bidding["type"] };

interface CampaignPublishingPolicy {
  validate(campaign: CampaignDraft): PolicyViolation[];
}

class PublishCampaign {
  constructor(
    private readonly campaigns: CampaignRepository,
    private readonly policy: CampaignPublishingPolicy,
  ) {}

  async execute(id: CampaignId): Promise<PolicyViolation[]> {
    const campaign = await this.campaigns.findDraft(id);
    // 외부 저장 전에 현재 게시 정책을 먼저 평가한다.
    const violations = this.policy.validate(campaign);
    if (violations.length > 0) return violations;

    campaign.publish();
    await this.campaigns.save(campaign);
    return [];
  }
}
~~~

코드 해설

- CampaignPublishingPolicy 구현만 교체하면 엔티티와 React 화면을 유지하면서 정책을 바꿀 수 있다.
- 오류 코드는 도메인 판단 결과이고 사용자 문구는 프레젠테이션 계층에서 현지화할 수 있다.
- 외부 Google Ads 정책 조회는 포트를 통해 수행하되 유스케이스 흐름은 유지한다.

**함수형 TO-BE — Policy를 순수 함수로 주입:** 정책 평가 결과와 상태 전이를 값으로 합성하고, 성공한 경우에만 저장한다.

~~~ts
type PublishingPolicy = (
  campaign: CampaignDraftData,
) => ReadonlyArray<PolicyViolation>;

function createPublishWithPolicy(
  repository: CampaignRepositoryPort,
  validatePolicy: PublishingPolicy,
) {
  return async function publishWithPolicy(
    id: CampaignId,
  ): Promise<Result<void, PublishError | ReadonlyArray<PolicyViolation>>> {
    const campaign = await repository.findDraft(id);
    if (!campaign) {
      return { ok: false, error: { code: "CAMPAIGN_NOT_FOUND" } };
    }

    // 정책은 같은 입력에 같은 위반 목록을 반환하는 순수 함수다.
    const violations = validatePolicy(campaign);
    if (violations.length > 0) {
      return { ok: false, error: violations };
    }

    const published = publishDraft(campaign);
    if (!published.ok) return published;

    await repository.save(published.value);
    return { ok: true, value: undefined };
  };
}
~~~

외부 정책 조회가 필요하면 먼저 Adapter에서 정책 입력을 가져온 뒤 순수한 `validatePolicy`를 구성한다. 네트워크 호출 자체를 Domain Policy 안에 넣지 않는 것이 핵심이다.

## 4. DDD 적용 범위 결정

### 4.1 복잡성에 비례해 선택적으로 적용

목적 : 단순 CRUD에 과도한 추상화를 만들지 않고 지식 손실과 변경 비용이 큰 영역부터 DDD를 적용한다.

상세 로직

1. 판단 기준 및 적용 조건
   - 규칙의 상호작용, 용어의 모호성, 부서 간 해석 차이, 변경 빈도가 높을수록 DDD의 효용이 크다.
   - 필드를 저장하고 다시 보여 주는 수준이면 DTO와 폼 스키마만으로 충분할 수 있다.
   - 한 제품 안에서도 캠페인 게시에는 풍부한 모델을, 설명 문구 편집에는 단순 CRUD를 사용할 수 있다.

2. 실행 절차 및 구현 규칙
   - 가장 자주 실패하거나 논의가 긴 유스케이스 하나를 선택한다.
   - 그 규칙만 도메인 타입과 행위로 옮기고 나머지는 기존 구조를 유지한다.
   - 조건문 중복, 테스트 용이성, 정책 변경 파일 수로 효과를 검증한다.

~~~ts
// 단순 CRUD: 별도 업무 규칙이 없는 설명 문구 저장은 그대로 유지한다.
async function updateCampaignDescription(
  campaignId: string,
  description: string,
): Promise<void> {
  await campaignApi.patch(campaignId, { description });
}

// DDD 적용 대상: 여러 값과 상태가 결합되는 게시 게이트만 모델링한다.
async function publishCampaign(campaignId: CampaignId): Promise<void> {
  const campaign = await campaignRepository.findDraft(campaignId);
  publishingPolicy.ensureSatisfiedBy(campaign);
  campaign.publish();
  await campaignRepository.save(campaign);
}
~~~

코드 해설

- DDD는 모든 함수를 클래스와 값 객체로 바꾸는 규칙이 아니다.
- 설명 문구에는 현재 보호할 불변식이 없으므로 단순하게 유지한다.
- 캠페인 게시는 예산, 기간, 입찰, 상태가 결합되는 핵심 영역이므로 모델에 투자한다.

### 4.2 작은 수직 범위에서 점진적으로 도입

목적 : 전체 프런트엔드를 재작성하지 않고 하나의 사용자 행동을 기준으로 DDD의 효과를 검증한다.

상세 로직

1. 판단 기준 및 적용 조건
   - 기존 코드와 공존해야 할 때는 폴더 전체가 아니라 유스케이스 하나를 전환 단위로 삼는다.
   - 도메인 코드가 React, 전역 상태 라이브러리, API 응답 타입을 import하면 경계가 아직 섞여 있다.
   - 최초 범위는 입력부터 저장까지 테스트 가능한 작은 수직 절편이어야 한다.

2. 실행 절차 및 구현 규칙
   - 캠페인 게시의 용어와 규칙을 합의하고 도메인 모델을 만든다.
   - 기존 API 앞에 저장소 어댑터를 붙이고 React 버튼에서 새 유스케이스를 호출한다.
   - 안정화 후 예산 변경과 입찰 변경 같은 인접 행동을 이동한다.

~~~ts
// features/campaign-setup/index.ts
// 새 기능의 공개 진입점만 노출해 내부 구조에 대한 직접 의존을 막는다.
export type {
  PublishCampaignResult,
} from "./application/publishCampaign";
export {
  createPublishCampaign,
} from "./composition/createPublishCampaign";

// pages/campaigns/[id].tsx
import {
  createPublishCampaign,
} from "@/features/campaign-setup";

// 기존 API를 Adapter로 재사용하면서 새 Use Case를 조립한다.
const publishCampaign = createPublishCampaign({ campaignApi });
~~~

코드 해설

- 공개 진입점은 다른 기능이 도메인 내부 파일에 직접 의존하는 것을 막는다.
- 기존 campaignApi는 어댑터 안에서 계속 사용할 수 있어 서버와 화면을 동시에 재작성할 필요가 없다.
- 호출부가 “초안을 찾고, 정책을 확인하고, 게시하고, 저장한다”는 업무 문장처럼 읽히는지가 좋은 최종 점검 기준이다.
