---
sidebar_position: 1.5
---

# React로 이해하는 도메인 주도 개발

Google Ads 캠페인 설정을 예제로 DDD의 출발점과 프런트엔드의 경계 질문을 정리한다. DDD의 목적은 클래스를 늘리는 것이 아니라, 중요한 업무 판단이 UI와 API 코드에 흩어져 서로 달라지는 문제를 막는 데 있다.

## 1. 첫 번째 이야기: DDD가 필요한 이유

### 1.1 비즈니스 복잡성에서 Domain 규칙 찾기

목적 : 화면과 전송 기술에 섞인 업무 판단을 찾아 하나의 모델로 보호한다.

상세 로직

1. 판단 기준 및 적용 조건
   - Domain은 소프트웨어가 해결하는 업무 영역과 그 안의 지식, 규칙, 용어다. Domain Model은 상태와 행동, 제약을 코드로 표현한다.
   - 같은 조건이 게시, 미리보기, 일괄 편집, API 처리에서 반복되면 Domain 규칙으로 옮길 신호다.
   - 단순 조회·CRUD라면 DDD의 추상화 비용이 더 클 수 있다.

2. 실행 절차 및 구현 규칙
   - 조건문을 먼저 “유효한 예산과 기간을 가진 초안만 게시할 수 있다” 같은 업무 문장으로 바꾼다.
   - 필드 직접 변경보다 `publish()`, `changeBudget()`처럼 업무 행동이 드러나는 API로 표현한다.
   - Entity부터 만들지 말고 중요한 업무 판단이 무엇이며 어디에 흩어져 있는지 확인한다.

```ts
class Campaign {
  private status: "DRAFT" | "PUBLISHED" = "DRAFT";

  changeBudget(nextBudget: Money): void {
    if (this.status !== "DRAFT") {
      throw new Error("초안 상태에서만 예산을 변경할 수 있습니다.");
    }
    this.budget = nextBudget;
  }

  publish(): void {
    if (this.status !== "DRAFT") {
      throw new Error("초안 상태에서만 게시할 수 있습니다.");
    }
    this.status = "PUBLISHED";
  }
}
```

같은 규칙을 함수형으로 표현하면 상태는 불변 데이터로 두고, 행위는 성공한 새 상태나 구조화된 실패를 반환하는 순수 함수가 된다.

```ts
type Campaign = Readonly<{
  status: "DRAFT" | "PUBLISHED";
  budget: Money;
}>;

type CampaignError =
  | { code: "BUDGET_CHANGE_NOT_ALLOWED" }
  | { code: "PUBLISH_NOT_ALLOWED" };

type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function changeBudget(
  campaign: Campaign,
  nextBudget: Money,
): Result<Campaign, CampaignError> {
  if (campaign.status !== "DRAFT") {
    return { ok: false, error: { code: "BUDGET_CHANGE_NOT_ALLOWED" } };
  }

  // 기존 값을 변경하지 않고 변경된 캠페인을 새 값으로 만든다.
  return { ok: true, value: { ...campaign, budget: nextBudget } };
}

function publish(
  campaign: Campaign,
): Result<Campaign, CampaignError> {
  if (campaign.status !== "DRAFT") {
    return { ok: false, error: { code: "PUBLISH_NOT_ALLOWED" } };
  }

  return { ok: true, value: { ...campaign, status: "PUBLISHED" } };
}
```

### 1.2 UI, Application, Domain 검증 결합하기

목적 : 검증을 분리하면서 한 작업 안에서 조합하고 불필요한 Validator 클래스를 늘리지 않는다.

상세 로직

1. 판단 기준 및 적용 조건
   - UI는 필수값, 숫자 형식, 길이처럼 빠른 피드백을 담당하고 Domain은 상태 전이와 업무 불변식을 최종 보호한다.
   - Application Use Case는 제3의 Validator가 아니라 입력을 Domain 값으로 바꾸고 행동과 저장을 조정하는 경계다.
   - 같은 `amount > 0` 검사라도 UI는 사용자 경험, Domain은 무결성을 위한 것이므로 목적이 다르다.

2. 실행 절차 및 구현 규칙
   - `Form → UI schema → Use Case command → Value Object/Entity → Repository` 순서로 결합한다.
   - UI는 Zod schema, Use Case는 함수나 클래스, Domain은 Value Object·Entity·Policy로 표현한다. 세 경계가 세 클래스를 뜻하지는 않는다.
   - UI는 우회될 수 있으므로 핵심 불변식은 Domain에서도 반드시 검사한다.

```ts
const budgetFormSchema = z.object({
  // Draft에는 0원을 저장할 수 있고 게시 시 최소 예산은 Domain Policy가 판단한다.
  dailyBudgetWon: z.coerce.number().int().min(0),
});

async function changeCampaignBudget(
  command: { campaignId: string; dailyBudgetWon: number },
  repository: CampaignRepository,
): Promise<void> {
  const campaign = await repository.findById(command.campaignId);
  if (!campaign) throw new CampaignNotFound(command.campaignId);

  campaign.changeBudget(Money.won(command.dailyBudgetWon));
  await repository.save(campaign);
}
```

함수형 Use Case는 저장소를 함수 인자로 주입하고, Domain 계산과 저장 부수 효과를 구분한다.

```ts
type CampaignRepository = Readonly<{
  findById: (id: string) => Promise<Campaign | null>;
  save: (campaign: Campaign) => Promise<void>;
}>;

type ChangeBudgetError =
  | { code: "CAMPAIGN_NOT_FOUND"; campaignId: string }
  | CampaignError;

function createChangeCampaignBudget(repository: CampaignRepository) {
  return async function changeCampaignBudgetUseCase(
    command: Readonly<{ campaignId: string; dailyBudgetWon: number }>,
  ): Promise<Result<void, ChangeBudgetError>> {
    // 조회와 저장은 경계 함수에 남기고 상태 전이는 순수 함수에 맡긴다.
    const campaign = await repository.findById(command.campaignId);
    if (!campaign) {
      return {
        ok: false,
        error: { code: "CAMPAIGN_NOT_FOUND", campaignId: command.campaignId },
      };
    }

    const changed = changeBudget(
      campaign,
      Money.won(command.dailyBudgetWon),
    );
    if (!changed.ok) return changed;

    await repository.save(changed.value);
    return { ok: true, value: undefined };
  };
}
```

### 1.3 DTO를 Domain Model로 복원할지 판단하기

목적 : 네트워크 표현과 업무 모델을 구분하되 단순 조회까지 변환하는 과설계를 피한다.

상세 로직

1. 판단 기준 및 적용 조건
   - API 응답은 서버 Domain Entity에서 만들어져도 네트워크를 통과한 순간 행동과 prototype이 없는 DTO다.
   - `response.json() as Campaign`은 타입 단언일 뿐 `publish()` 같은 행동이나 생성 불변식을 복원하지 않는다.
   - 조회·표시만 하면 DTO 또는 View Model을 사용하고, 클라이언트가 상태 전이와 업무 판단을 하면 Domain Model로 복원한다.

2. 실행 절차 및 구현 규칙
   - Mapper에서 ID, 통화 단위, 날짜, 외부 상태 값을 해석하고 잘못된 값을 경계에서 차단한다.
   - 초기에는 `toCampaign(dto)` 함수로 시작하고 차이가 커질 때 별도 Mapper로 확장한다.
   - DTO와 Domain Model의 모양이 같더라도 전송 계약과 업무 모델이라는 책임까지 같다고 간주하지 않는다.

```ts
type CampaignDto = {
  id: string;
  dailyBudgetMicros: string;
  currencyCode: string;
  status: "DRAFT" | "PUBLISHED";
};

function toCampaign(dto: CampaignDto): Campaign {
  return Campaign.restore({
    id: CampaignId.from(dto.id),
    budget: Money.fromMicros(BigInt(dto.dailyBudgetMicros), dto.currencyCode),
    status: CampaignStatus.from(dto.status),
  });
}
```

함수형 모델에서는 복원 과정도 예외 대신 `Result`를 반환한다. 네트워크 값의 해석 실패가 호출부의 타입에 드러난다.

```ts
type RestoreCampaignError = Readonly<{
  code: "INVALID_CAMPAIGN_DTO";
  reason: string;
}>;

function restoreCampaign(
  dto: CampaignDto,
): Result<Campaign, RestoreCampaignError> {
  const id = parseCampaignId(dto.id);
  const budget = parseMoney(dto.dailyBudgetMicros, dto.currencyCode);
  const status = parseCampaignStatus(dto.status);

  if (!id.ok) return id;
  if (!budget.ok) return budget;
  if (!status.ok) return status;

  // 검증된 값만 모아 불변 Domain 데이터를 구성한다.
  return {
    ok: true,
    value: Object.freeze({
      id: id.value,
      budget: budget.value,
      status: status.value,
    }),
  };
}
```

```text
서버 Domain Entity → JSON 직렬화 → API DTO → Mapper → 클라이언트 Domain Model
```

| 클라이언트 역할 | 권장 표현 |
| --- | --- |
| 조회 결과를 그대로 표시 | DTO 또는 View Model |
| 여러 화면에서 동일한 업무 규칙 실행 | Domain Model로 변환 |
| 상태 전이와 오프라인 판단 수행 | Domain Model로 변환 |
| 모든 업무 판단을 서버가 수행 | 프런트엔드 Domain을 가볍게 유지 |

---

## 2. 두 번째 이야기: 모두가 말하는 Campaign은 같은 Campaign인가

첫 번째 이야기에서 우리는 UI에 흩어진 게시 규칙을 Domain으로 옮겼다. 이제 `Campaign`, `publish`, `budget`처럼 업무 의미가 드러나는 이름도 생겼다. 그런데 회의에 들어가 보니 이상한 일이 벌어진다.

기획자는 “캠페인이 게시되었다”고 말하고, 광고 운영자는 같은 캠페인을 보며 “아직 게재할 수 없다”고 말한다. 데이터 분석가는 “지난달 캠페인은 종료됐지만 보고서에서는 계속 필요하다”고 말한다. 세 사람 모두 `Campaign`과 `status`라는 단어를 사용하지만 머릿속 의미는 서로 다르다.

```text
기획자: 캠페인이 PUBLISHED니까 설정이 끝났습니다.
운영자: 소재 승인이 안 났으니 아직 ELIGIBLE이 아닙니다.
분석가: 종료 여부와 관계없이 비용과 전환을 집계해야 합니다.
```

여기서 하나의 거대한 타입으로 모두를 만족시키려 하면 문제가 커진다.

```ts
// 모든 팀의 관점이 한 객체에 섞인 모델
type Campaign = {
  id: string;
  status: "DRAFT" | "PUBLISHED" | "ELIGIBLE" | "PAUSED" | "ENDED";
  dailyBudget: number;
  approvedCreativeCount?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
};
```

`PUBLISHED` 다음이 반드시 `ELIGIBLE`인지, `ENDED`인 캠페인을 리포팅에서 제거해야 하는지 이 타입만으로는 알 수 없다. 서로 다른 업무의 상태를 하나의 `status`에 넣었기 때문이다.

### 2.1 먼저 같은 행동을 같은 이름으로 부른다

DDD에서는 도메인 전문가와 개발자가 대화, 기획서, UI, 테스트, 코드에서 함께 사용하는 말을 **Ubiquitous Language**라고 한다. 이것은 번역표가 아니라 실제 작업에서 반복해서 사용하는 언어다.

설정 팀이 다음과 같이 합의했다고 해보자.

- `Draft`: 게시 조건을 아직 완성하지 않았거나 검토 중인 설정
- `Publish`: 유효한 Draft를 설정 Context 밖으로 공개하는 행동
- `Pause`: 게시 취소가 아니라 게재를 일시 중지하는 행동

이 합의가 생기면 코드도 같은 말을 사용한다.

```tsx
interface PublishCampaignUseCase {
  execute(draftId: CampaignId): Promise<void>;
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
      disabled={draft.publishingStatus !== "DRAFT"}
      onClick={() => publishCampaign.execute(draft.id)}
    >
      캠페인 게시
    </button>
  );
}
```

버튼은 “게시”, Use Case는 `PublishCampaign`, 상태는 `publishingStatus`다. `submit()`, `activate()`, `status`처럼 맥락을 숨기는 말이 사라졌다.

하지만 이름을 통일하는 것만으로 충분하지 않다. 운영 팀에서 말하는 `Pause`와 설정 팀에서 말하는 `Publish`는 애초에 서로 다른 상태 체계에 속한다. 같은 언어가 일관되게 유효한 범위를 정해야 한다.

### 2.2 의미가 달라지는 곳에 Bounded Context를 둔다

**Bounded Context**는 특정 모델과 용어가 하나의 의미로 유지되는 경계다. Google Ads 예제의 `Campaign`은 다음 세 Context에서 각각 다른 모델이 된다.

| Bounded Context | Campaign의 의미 | 핵심 질문 |
| --- | --- | --- |
| Campaign Setup | 목표, 예산, 기간을 편집하는 초안 | 게시 조건을 만족했는가? |
| Ad Delivery | 광고 게재 대상으로 등록된 단위 | 지금 게재할 수 있는가? |
| Performance Reporting | 비용과 전환을 집계하는 분석 기준 | 기간별 성과는 얼마인가? |

```ts
// Campaign Setup
type SetupCampaign = Readonly<{
  id: CampaignId;
  budget: Money;
  publishingStatus: "DRAFT" | "PUBLISHED";
}>;

// Ad Delivery
type DeliverableCampaign = Readonly<{
  campaignId: CampaignId;
  servingStatus: "ELIGIBLE" | "PAUSED" | "ENDED";
  approvedCreativeCount: number;
}>;

// Performance Reporting
type CampaignPerformance = Readonly<{
  campaignId: CampaignId;
  cost: Money;
  clicks: number;
  conversions: number;
}>;
```

세 모델은 `campaignId`로 연결되지만 객체를 공유하지 않는다. 설정 팀의 `PUBLISHED`는 “설정 완료”, 게재 팀의 `ELIGIBLE`은 “현재 집행 가능”을 뜻한다. 둘은 동시에 참일 수도, 하나만 참일 수도 있다.

Context를 나눴다고 서버도 세 개로 나눌 필요는 없다. Bounded Context는 먼저 **의미와 모델의 경계**다. 같은 저장소 안에서도 모듈과 Public API로 시작할 수 있고, Microservice 분리는 배포와 운영 필요가 생겼을 때 별도로 판단한다.

### 2.3 Context 사이에는 객체가 아니라 사실을 전달한다

Campaign Setup이 게시를 완료했다고 Ad Delivery의 내부 객체를 직접 수정하면 두 Context는 다시 결합된다. 대신 설정 팀은 자신에게 일어난 사실을 계약으로 공개한다.

```ts
type CampaignPublished = Readonly<{
  eventId: string;
  occurredAt: string;
  campaignId: string;
  dailyBudgetMicros: string;
  currencyCode: string;
}>;
```

`CampaignPublished`는 이미 일어난 사실이므로 과거형이다. Ad Delivery는 이 이벤트를 받아 자기 `DeliverableCampaign`을 만들고, Performance Reporting은 자기 집계 기준을 만든다. 어느 쪽도 Setup의 Entity를 직접 수정하지 않는다.

### 2.4 경계를 코드와 조직 변화 속에서 유지한다

Context 경계는 폴더를 한 번 나누는 것으로 완성되지 않는다. 경계를 정할 때는 화면 배치보다 **누가 규칙을 결정하는지**, **무엇 때문에 함께 변경되는지**, **권한과 장애 영향이 같은지**를 본다. 예산 추천이 Campaign Setup 화면에 표시되더라도 추천 정책을 별도 팀이 소유한다면 Budget Planning Context의 결과를 받아 조합하는 편이 자연스럽다.

Context 사이의 제공자와 소비자 관계는 **Context Map**으로 기록한다.

```text
Budget Planning --추천 응답--> Campaign Setup --CampaignPublishedV2--> Ad Delivery
                                              └--CampaignPublishedV2--> Performance Reporting
```

프런트엔드에서는 각 Context의 `index.ts`를 Public API로 사용하고 내부 Domain 파일의 직접 import를 막는다.

```ts
// features/campaign-setup/index.ts
export type {
  CampaignDraftView,
  PublishCampaignResult,
} from "./application/contracts";

export {
  createCampaignSetupFacade,
} from "./composition";

// 허용: Context가 공개한 진입점
import { createBudgetPlanningFacade } from "@/features/budget-planning";

// 금지: 다른 Context의 내부 정책에 직접 의존
// import { BudgetPolicy } from
//   "@/features/budget-planning/domain/BudgetPolicy";
```

한 페이지에서 여러 Context를 보여 주는 것은 가능하다. 페이지는 각 Facade의 읽기 모델을 배치하되 내부 Entity를 합치지 않고, 예산 추천 실패가 캠페인 편집 전체를 막지 않도록 로딩과 오류도 Context별로 격리한다.

Google Ads처럼 외부 모델이 내부 언어와 다르면 Adapter가 **Anti-Corruption Layer** 역할을 한다. 외부 SDK의 enum, resource name, 날짜 형식을 내부 Domain에 노출하지 않고 순수 Mapper에서 변환한다. 해석할 수 없는 값은 기본값으로 숨기지 않고 통합 오류로 반환한다.

경계도 업무 지식에 따라 바뀐다. 이벤트 계약을 변경할 때는 `CampaignPublishedV2`처럼 버전을 올려 소비자의 이전 기간을 제공하고, 다음 신호를 정기적으로 점검한다.

- 하나의 변경이 여러 Context 내부를 항상 동시에 수정한다면 계약이나 경계를 재검토한다.
- 두 Context가 늘 함께 바뀌고 독립된 언어가 없다면 과도하게 나눈 것일 수 있다.
- 용어가 바뀌면 UI, 타입, Use Case, 이벤트, 테스트와 Context Map을 함께 갱신한다.

### 2.5 Q&A: 비즈니스가 바뀌면 Context 경계도 다시 조립하는가

**질문**

조직의 도메인 비즈니스 로직이 변경되면 Context 경계가 다시 조립될 수 있는가? 그렇다면 코드 변경이 많아질 텐데 어떻게 대응해야 하는가?

**답변**

가능하다. Bounded Context는 영구히 고정하는 물리적 칸막이가 아니라 현재까지 이해한 도메인 지식을 반영한 모델의 의미 경계다. 새로운 책임과 언어를 발견하면 Context를 분리하거나 합치고, 일부 기능의 소유권을 다른 Context로 이동할 수 있다.

다만 모든 규칙 변경이 경계 변경을 뜻하지는 않는다. 다음은 Campaign Setup 내부 정책만 수정하면 되는 경우다.

```text
게시 최소 예산이 10,000원에서 20,000원으로 변경된다.
TARGET_CPA 게시 조건에 전환 추적 설정이 추가된다.
```

반면 다음과 같은 지식이 발견되면 Budget을 독립 Context로 분리할 수 있다.

```text
고액 예산에는 재무팀의 별도 승인이 필요하다.
하나의 Budget을 여러 채널의 Campaign이 공유한다.
예산 정책의 책임자, 권한, 변경 주기와 장애 영향이 Campaign Setup과 다르다.
```

```text
변경 전
Campaign Setup
└── Campaign
    └── Budget

변경 후
Campaign Setup ──budgetId──> Budget Management
```

경계 이동 자체의 코드 변경을 없앨 수는 없다. 대신 Context가 내부 Entity가 아닌 Public API, Port, Event 계약으로 연결되어 있으면 변경 범위를 Adapter와 조립 지점 주변으로 제한할 수 있다.

```ts
type BudgetApprovalRequest = Readonly<{
  campaignId: string;
  requestedDailyBudgetWon: number;
}>;

type BudgetApprovalResult =
  | { approved: true; approvalId: string }
  | { approved: false; reasons: readonly string[] };

interface BudgetApprovalPort {
  approve(
    request: BudgetApprovalRequest,
  ): Promise<BudgetApprovalResult>;
}
```

기존 Campaign API를 한 번에 제거하지 않고 새 Port 뒤에 Legacy Adapter로 감싼다.

```ts
class LegacyBudgetApprovalAdapter implements BudgetApprovalPort {
  async approve(
    request: BudgetApprovalRequest,
  ): Promise<BudgetApprovalResult> {
    return legacyCampaignApi.approveBudget({
      campaignId: request.campaignId,
      dailyBudgetWon: request.requestedDailyBudgetWon,
    });
  }
}
```

```text
1. 기존 Budget 규칙과 소비자를 찾는다.
2. 새 Context가 소유할 언어, 정책, 데이터와 권한을 정한다.
3. 소비자가 사용할 Port 또는 Event 계약을 먼저 만든다.
4. 기존 구현을 Legacy Adapter로 연결한다.
5. 새 Context 구현을 feature flag나 route 단위로 일부 요청에 적용한다.
6. 기존 경로와 결과, 오류, 성능을 비교한다.
7. 소비자를 점진적으로 이전한 뒤 Legacy Adapter를 제거한다.
```

이벤트 구조가 함께 바뀌면 `CampaignPublishedV1`과 `CampaignPublishedV2`를 일정 기간 함께 지원한다. 생산자와 모든 소비자를 동시에 배포하지 않고 호환 기간을 운영한 뒤 V1을 제거한다.

경계 변경의 안전망은 다음과 같다.

- 기존 동작을 고정하는 characterization test
- 모든 Adapter가 같은 Port 동작을 지키는 contract test
- V1과 V2 Event를 모두 해석하는 호환성 테스트
- 기존 경로와 새 경로의 결과를 비교하는 shadow test
- 다른 Context의 내부 경로 import를 막는 모듈 경계 검사

경계 이전 중에는 잠시 중복 코드가 생길 수 있다. 두 Context가 실제로 독립적인지 확인되기 전에 공통 모델로 묶는 것보다, 의도적인 중복을 허용하고 책임이 안정된 뒤 공통화를 판단하는 편이 안전하다.

핵심은 미래의 경계를 완벽하게 예측하는 것이 아니다.

```text
내부 Entity를 직접 공유하면 생산자와 모든 소비자를 동시에 수정한다.
Public API, Port, Event로 연결하면 경계 내부와 Adapter 중심으로 수정한다.
```

두 번째 이야기의 판단 기준은 간단하다.

```text
같은 의미라면 같은 말을 쓴다.
같은 말의 의미가 달라지면 Context를 나눈다.
Context 사이에는 내부 객체가 아니라 명시적인 계약을 전달한다.
```

---

## 3. 세 번째 이야기: 규칙을 어디에 놓아야 하는가

Context 경계를 나눈 설정 팀은 이제 자기 `Campaign`만 생각할 수 있게 됐다. 하지만 구현을 시작하자 또 다른 질문이 생긴다.

- `10,000 KRW`는 단순한 숫자인가?
- 이름과 예산이 바뀐 Campaign은 여전히 같은 Campaign인가?
- Campaign 안에 공유 Budget 객체를 통째로 넣어야 하는가?
- 두 객체를 함께 봐야 하는 게시 조건은 누가 판단해야 하는가?

DDD의 전술적 패턴은 이 질문들에 답하기 위한 도구다. 패턴 이름을 먼저 외우기보다 각 규칙이 무엇을 보호하는지 살펴보자.

### 3.1 값 자체가 중요하면 Value Object로 만든다

`dailyBudgetWon: number`만 사용하면 `-10000`, 소수 KRW, 서로 다른 통화 비교도 타입상 가능하다. 금액의 규칙을 호출자들의 관례에 맡긴 셈이다.

```ts
class Money {
  private constructor(
    readonly amount: number,
    readonly currency: "KRW",
  ) {}

  static won(amount: number): Money {
    if (!Number.isSafeInteger(amount) || amount < 0) {
      throw new Error("KRW 금액은 0 이상의 정수여야 합니다.");
    }
    return new Money(amount, "KRW");
  }

  isAtLeast(other: Money): boolean {
    return this.amount >= other.amount;
  }
}
```

`Money.won(10_000)` 두 개는 생성 위치가 달라도 같은 값이다. 식별자가 아니라 속성 값과 불변식이 중요한 개념이 **Value Object**다. 함수형으로는 검증 생성 함수가 `Result<Money, MoneyError>`를 반환하게 해 같은 목적을 달성할 수 있다.

### 3.2 시간이 지나도 같은 대상이면 Entity로 만든다

캠페인의 이름과 예산은 바뀌어도 ID가 같다면 같은 캠페인이다. 이런 정체성과 생명주기를 가진 모델이 **Entity**다.

```ts
class Campaign {
  private status: CampaignStatus = "DRAFT";

  constructor(
    readonly id: CampaignId,
    readonly budgetId: CampaignBudgetId,
  ) {}

  submitForReview(): void {
    if (this.status !== "DRAFT") throw new Error("초안만 심사할 수 있습니다.");
    this.status = "UNDER_REVIEW";
  }

  publish(decision: PublicationDecision): void {
    if (
      this.status !== "UNDER_REVIEW" ||
      decision.campaignId !== this.id ||
      !decision.approved
    ) {
      throw new Error("게시 승인이 필요합니다.");
    }
    this.status = "PUBLISHED";
  }
}
```

`campaign.status = "PUBLISHED"` 같은 setter를 열지 않고 업무 행동만 공개한다. 함수형 모델이라면 같은 ID를 유지한 새 상태를 반환한다.

```ts
function submitForReview(campaign: CampaignState): Result<CampaignState, Error> {
  if (campaign.status !== "DRAFT") return { ok: false, error: "INVALID_STATUS" };
  return { ok: true, value: { ...campaign, status: "UNDER_REVIEW" } };
}
```

새 객체를 반환해도 ID가 같으므로 동일한 Entity의 다음 상태다. 클래스냐 함수냐보다 허용된 상태 전이만 통과시키는지가 중요하다.

### 3.3 함께 바뀌어야 하는 범위가 Aggregate다

처음에는 Campaign 안에 Budget 객체를 넣고 싶어진다. 하지만 여러 Campaign이 하나의 Budget을 공유하고 Budget이 독립적으로 변경된다면 둘은 한 번에 저장해야 할 일관성 단위가 아니다.

```text
Campaign Aggregate       CampaignBudget Aggregate
- campaignId             - budgetId
- budgetId ------------> - dailyLimit
- publishingStatus
```

**Aggregate**는 관련 객체를 모두 담는 큰 객체 그래프가 아니라, 한 변경에서 즉시 일관성을 보장할 경계다. 외부는 그 경계를 대표하는 **Aggregate Root**를 통해서만 변경한다.

Campaign은 `CampaignBudgetId`만 참조하고, Application이 두 Repository에서 각각 복원한다. 이 선택은 거대한 저장과 잠금 범위를 피하고 공유 Budget의 생명주기를 독립시킨다.

### 3.4 여러 Aggregate의 규칙은 Domain Policy가 판단한다

게시 조건은 Campaign과 CampaignBudget을 함께 봐야 한다.

```text
Campaign이 UNDER_REVIEW인가?
Campaign이 참조한 Budget인가?
일 예산이 10,000 KRW 이상인가?
```

이 규칙을 어느 한 Entity에 억지로 넣기보다 무상태 **Domain Policy**로 표현한다.

```ts
function evaluatePublication(
  campaign: CampaignState,
  budget: CampaignBudgetState,
): PublicationDecision {
  const reasons: PublicationRejectionReason[] = [];

  if (campaign.status !== "UNDER_REVIEW") {
    reasons.push("CAMPAIGN_NOT_UNDER_REVIEW");
  }
  if (campaign.budgetId !== budget.id) reasons.push("BUDGET_MISMATCH");
  if (budget.dailyLimit.amount < 10_000) reasons.push("DAILY_BUDGET_TOO_LOW");

  return {
    campaignId: campaign.id,
    approved: reasons.length === 0,
    reasons,
  };
}
```

Policy는 판정만 하고 저장하거나 상태를 변경하지 않는다. 실제 상태 전이는 승인 결과를 받은 Campaign이 수행한다.

세 번째 이야기의 요점은 역할 배치다.

| 질문 | 모델 |
| --- | --- |
| 값과 생성 불변식이 중요한가? | Value Object |
| ID와 생명주기가 중요한가? | Entity |
| 한 번에 일관되어야 하는 변경 범위인가? | Aggregate |
| 여러 모델에 걸친 무상태 규칙인가? | Domain Policy |

---

## 4. 네 번째 이야기: React가 Domain의 주인이 되지 않게 하라

Domain Model을 만들었지만 React 컴포넌트가 Repository를 생성하고, API를 호출하고, Entity 상태까지 바꾼다면 규칙은 다시 UI에 묶인다. 다음 요구가 들어오면 문제가 드러난다.

> 캠페인 게시를 React 화면뿐 아니라 관리자 일괄 작업과 자동 스케줄에서도 실행해 주세요.

게시 로직이 Hook 안에 있다면 세 진입점이 같은 코드를 복사해야 한다. Domain의 안쪽과 기술의 바깥쪽을 연결하는 구조가 필요하다.

### 4.1 의존성 화살표를 안쪽으로 향하게 한다

Hexagonal Architecture의 핵심은 육각형 그림이 아니라 의존성 방향이다.

```text
React ─┐
HTTP ──┼─> Adapter ─> Application ─> Domain
DB ────┘             └─ Port <──── Adapter 구현
```

- Domain은 React, HTTP, Zod를 import하지 않는다.
- Application은 사용자 목표를 조정하고 외부 기능을 Port로 요구한다.
- Adapter는 Port를 HTTP, 저장소, React 이벤트 같은 기술로 구현한다.

```ts
type CampaignRepository = Readonly<{
  findById: (id: CampaignId) => Promise<CampaignState | null>;
  save: (campaign: CampaignState) => Promise<void>;
}>;

function createChangeBudget(repository: CampaignRepository) {
  return async (command: ChangeBudgetCommand) => {
    const campaign = await repository.findById(command.campaignId);
    if (!campaign) return { ok: false, error: "CAMPAIGN_NOT_FOUND" } as const;

    const changed = changeBudget(campaign, Money.won(command.dailyBudgetWon));
    if (!changed.ok) return changed;

    await repository.save(changed.value);
    return { ok: true, value: undefined } as const;
  };
}
```

Port는 서버 endpoint의 복사본이 아니라 Use Case가 필요한 최소 기능이다. HTTP Adapter와 InMemory Adapter가 같은 Port를 구현하면 Application은 실행 기술을 알 필요가 없다.

### 4.2 구체 구현은 Composition Root에서 조립한다

Domain이나 Use Case가 `new HttpCampaignRepository()`를 호출하면 추상화가 깨진다. 가장 바깥의 시작점에서 구현체를 선택해 주입한다.

```ts
const campaigns = createHttpCampaignRepository({ baseUrl: "/api" });

export const campaignApplication = {
  changeBudget: createChangeBudget(campaigns),
};
```

테스트에서는 같은 자리에 InMemory Repository를 넣는다. 클래스 생성자 주입을 사용해도 되고 함수 팩터리와 클로저를 사용해도 된다. 중요한 것은 안쪽이 구체 기술을 선택하지 않는다는 점이다.

### 4.3 React는 입력 Adapter로 남는다

React Query는 서버 상태의 캐시, 재요청, loading/error 상태를 관리한다. React Hook Form과 Zod는 입력 형식과 사용자 피드백을 관리한다. 이 도구들이 게시 정책을 소유해서는 안 된다.

```tsx
function useChangeCampaignBudget(campaignId: CampaignId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: campaignApplication.changeBudget,
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["campaigns", "detail", campaignId],
    }),
  });
}
```

Mutation은 Use Case를 호출하고 성공 후 서버의 확정 상태를 다시 읽는다. React Query 캐시를 Domain Entity처럼 직접 조작하지 않는다.

```text
React Hook Form: 사용자가 무엇을 입력했는가?
Zod: 명령으로 변환 가능한 입력 형식인가?
Application: 사용자의 목표를 어떤 순서로 수행할까?
Domain: 이 변경이 업무적으로 허용되는가?
React Query: 서버 상태를 언제 다시 읽을까?
```

네 번째 이야기의 결론은 “폴더를 네 개 만든다”가 아니다. `domain`이 `react`, `fetch`, 외부 SDK를 import하지 않는지 확인하면 의존성 방향을 더 정확히 볼 수 있다.

---

## 5. 다섯 번째 이야기: 성공하는 코드보다 실패를 통제하는 코드

캠페인 설정 화면, Domain Model, Port와 Adapter까지 만들었다. 이제 게시 버튼을 실제 Google Ads에 연결한다. 행복한 경로만 보면 순서는 단순하다.

```text
캠페인 조회 → 규칙 검사 → Google Ads 생성 → PUBLISHED 저장
```

그러나 외부 시스템이 들어오는 순간 현실적인 질문이 생긴다.

- 사용자가 응답을 받지 못해 게시 버튼을 다시 누르면 캠페인이 두 개 생기는가?
- Budget 생성 후 Campaign 생성이 실패하면 남은 Budget은 누가 치우는가?
- Google Ads 등록은 실패했는데 로컬 상태만 `PUBLISHED`가 될 수 있는가?

DDD의 실전 적용은 정상 흐름을 예쁘게 만드는 것보다 이런 실패를 어디에서 책임질지 정하는 일에 가깝다.

### 5.1 Draft 저장과 Publish 성공을 구분한다

여러 단계 폼은 미완성 상태로 저장할 수 있어야 한다. 반면 Publish는 모든 Domain 규칙과 외부 제약을 통과해야 한다.

```ts
async function publishCampaign(command: PublishCampaignCommand) {
  const campaign = await campaigns.findById(command.campaignId);
  if (!campaign) return { ok: false, error: "CAMPAIGN_NOT_FOUND" } as const;

  const budget = await budgets.findById(campaign.budgetId);
  if (!budget) return { ok: false, error: "BUDGET_NOT_FOUND" } as const;

  const decision = evaluatePublication(campaign, budget);
  if (!decision.approved) {
    return { ok: false, error: { type: "DOMAIN_REJECTED", reasons: decision.reasons } } as const;
  }

  const issues = await publisher.validate(campaign, budget);
  if (issues.length > 0) {
    return { ok: false, error: { type: "EXTERNAL_REJECTED", issues } } as const;
  }

  const external = await publisher.publish(campaign, budget, {
    idempotencyKey: command.idempotencyKey,
  });

  await campaigns.save({ ...campaign, status: "PUBLISHED" });
  return { ok: true, value: external } as const;
}
```

비용이 없는 Domain 검사를 먼저 하고, Google Ads 검증과 실제 생성을 뒤에 둔다. 외부 게시가 성공하기 전에는 로컬 상태를 `PUBLISHED`로 확정하지 않는다.

동일한 `idempotencyKey` 요청은 게시 원장에서 기존 결과를 반환해야 한다. 예산 생성 뒤 캠페인 생성이 실패하는 중간 상태는 기록해 reconciliation 작업이 삭제하거나 다시 연결할 수 있게 한다.

### 5.2 Google Ads 규칙은 서버 Adapter에서 번역한다

Domain의 `30,000 KRW`와 Google Ads가 요구하는 `amountMicros: "30000000000"`는 같은 금액이지만 표현이 다르다. 이 변환을 Domain에 넣으면 Google Ads가 바뀔 때 내부 모델도 함께 흔들린다. 서버 Adapter의 순수 Mapper가 vendor payload를 만든다.

```ts
function toGoogleAdsDraft(
  campaign: Readonly<{ name: string }>,
  budget: Readonly<{ dailyLimit: Money }>,
): GoogleAdsDraft {
  return {
    budget: {
      name: `${campaign.name} budget`,
      amountMicros: (
        BigInt(budget.dailyLimit.amount) * 1_000_000n
      ).toString(),
      deliveryMethod: "STANDARD",
    },
    campaign: {
      name: campaign.name,
      // 타기팅과 소재가 완성되기 전에 집행되지 않게 한다.
      status: "PAUSED",
      advertisingChannelType: "SEARCH",
    },
  };
}
```

Google Ads에서는 Budget을 먼저 만들고 반환된 resource name을 Campaign 생성 요청에 연결한다. 이 순서와 Google Ads 타입은 Adapter 안에 숨기며, 브라우저에는 자체 `/publish` Port만 노출한다. OAuth credential, developer token, customer ID 권한은 서버 밖으로 보내지 않는다.

실제 생성 전에 같은 payload로 `validate_only` dry-run을 실행한다.

```ts
async function validateDraft(draft: GoogleAdsDraft) {
  const result = await googleAdsApi.validateDraft(draft, {
    validateOnly: true,
  });
  return GoogleAdsErrorMapper.toIssues(result.errors);
}
```

검증 순서는 `Domain Policy → validate_only → 실제 mutate`다. Dry-run과 실제 요청 사이에 계정 상태가 달라질 수 있으므로 실제 mutate 오류도 같은 Mapper로 처리한다. Budget과 Campaign처럼 서로 참조하는 작업은 `partial_failure`로 중간 성공을 늘리기보다 전체 성공이 필요한 흐름으로 취급하고, 실패 원장과 reconciliation 절차를 준비한다.

### 5.3 검증과 테스트를 경계별로 배치한다

모든 것을 E2E 테스트로 확인하면 느리고 실패 원인을 찾기 어렵다. 각 계층이 아는 사실만 빠르게 검증한다.

| 테스트 경계 | 검증 대상 |
| --- | --- |
| Domain | Value Object 불변식, 상태 전이, Policy 결정 |
| Application | Port 호출 순서, 실패 시 외부 호출 차단, 저장 시점 |
| Adapter contract | DTO 매핑, 단위 변환, HTTP·SDK 계약 |
| React integration | 입력, 오류 메시지, Query 재조회 |
| External smoke | 제한된 테스트 계정의 실제 연동 |

```ts
it("Domain이 거절하면 외부 Publisher를 호출하지 않는다", async () => {
  let publishCount = 0;
  const publisher: CampaignPublisher = {
    validate: async () => [],
    publish: async () => {
      publishCount += 1;
      return { resourceName: "never-created" };
    },
  };

  const result = await createPublishCampaign({
    campaigns: fakeCampaigns.underReview(),
    budgets: fakeBudgets.withDailyLimit(9_999),
    publisher,
  })(validCommand);

  expect(result.ok).toBe(false);
  expect(publishCount).toBe(0);
});
```

Fake는 Google Ads SDK 전체를 흉내 내지 않고 Application이 소유한 Port만 구현한다. 테스트는 private 메서드보다 외부 게시 여부와 저장된 상태처럼 관찰 가능한 결과를 확인한다.

Mapper에는 실제 응답 fixture를 사용하는 contract test를 둔다. React 통합 테스트에서는 MSW로 자체 API만 가로채고, 사용자가 보는 label·오류 메시지·Mutation 후 Query 재조회를 검증한다. 실제 Google Ads 계정 테스트는 느리고 외부 상태를 만들기 때문에 제한된 테스트 계정과 정리 절차를 가진 별도 smoke test로 분리한다.

### 5.4 기존 프로젝트는 복잡한 한 흐름부터 교체한다

DDD를 도입한다고 전체 React 프로젝트를 한 번에 `domain/application/adapter/ui`로 옮기면 추상화 비용과 회귀 위험이 동시에 커진다.

먼저 다음 조건을 만족하는 흐름을 고른다.

- 같은 업무 조건문이 여러 화면에서 반복된다.
- 여러 API 호출의 순서와 실패 복구가 중요하다.
- 규칙 위반이나 중복 실행의 비용이 크다.
- 독립 테스트가 주는 가치가 크다.

Google Ads 예제에서는 조회 목록보다 `Publish Campaign`이 좋은 시작점이다. 공통 언어와 순수 Domain 규칙을 추출하고, Mapper와 Repository, Use Case, React Adapter 순서로 이동한다. 기존 경로는 feature flag로 유지하면서 성공률, 오류 유형, 중복 생성 여부를 비교한다.

```text
1. 반복되는 게시 규칙을 Domain으로 추출
2. 기존 Form/DTO를 새 모델로 번역하는 Mapper 추가
3. 외부 호출을 Port 뒤로 이동
4. Publish Use Case로 실행 순서 통합
5. React는 새 Use Case만 호출
6. 지표가 안정되면 legacy 경로 제거
```

다섯 번째 이야기까지의 최종 판단 기준은 폴더와 클래스 수가 아니다.

```text
업무 규칙이 한곳에서 같은 의미로 실행되는가?
기술과 외부 시스템이 바뀌어도 Domain 규칙이 남는가?
실패와 재시도를 예측하고 복구할 수 있는가?
중요한 규칙을 빠른 테스트로 설명할 수 있는가?
추상화 비용보다 변경 안전성이 실제로 커졌는가?
```

---

## 6. DDD가 적용된 전체 구조

### 6.1 Bounded Context와 Hexagonal Architecture를 directory tree에 반영하기

목적 : 프로젝트 전체를 기술 계층 하나로 나누지 않고, Bounded Context를 최상위 경계로 둔 다음 각 Context 내부에서 Domain 중심의 의존성 방향을 유지한다.

상세 로직

```text
src/
├── features/                              # Bounded Context 모음
│   ├── campaign-setup/                    # 캠페인 설정 Context
│   │   ├── domain/                        # 순수 업무 모델, 외부 기술 import 금지
│   │   │   ├── campaign/
│   │   │   │   ├── Campaign.ts            # Entity, 상태 전이
│   │   │   │   ├── CampaignId.ts          # 식별자 Value Object
│   │   │   │   ├── CampaignSchedule.ts    # 기간 Value Object
│   │   │   │   └── Campaign.test.ts
│   │   │   ├── budget/
│   │   │   │   ├── CampaignBudget.ts      # 별도 Aggregate Root
│   │   │   │   ├── Money.ts               # 금액 Value Object
│   │   │   │   └── Money.test.ts
│   │   │   ├── policies/
│   │   │   │   └── CampaignPublicationPolicy.ts
│   │   │   ├── events/
│   │   │   │   └── CampaignPublished.ts
│   │   │   └── index.ts                   # Context 내부 Domain 공개 범위
│   │   │
│   │   ├── application/                   # 사용자 목표와 실행 순서
│   │   │   ├── ports/                     # Application이 소유하는 외부 요구 계약
│   │   │   │   ├── CampaignRepository.ts
│   │   │   │   ├── CampaignBudgetRepository.ts
│   │   │   │   ├── CampaignPublisher.ts
│   │   │   │   └── DomainEventPublisher.ts
│   │   │   ├── use-cases/
│   │   │   │   ├── LoadCampaignSettings.ts
│   │   │   │   ├── ChangeCampaignDailyBudget.ts
│   │   │   │   └── PublishCampaign.ts
│   │   │   ├── contracts/                 # Command, Result, 읽기 모델
│   │   │   │   ├── CampaignCommands.ts
│   │   │   │   └── CampaignDraftView.ts
│   │   │   └── use-cases.test.ts
│   │   │
│   │   ├── adapters/                      # Port의 구체 구현과 외부 표현 번역
│   │   │   ├── http/
│   │   │   │   ├── CampaignDto.ts
│   │   │   │   ├── CampaignMapper.ts
│   │   │   │   ├── HttpCampaignRepository.ts
│   │   │   │   └── HttpCampaignBudgetRepository.ts
│   │   │   ├── events/
│   │   │   │   └── HttpDomainEventPublisher.ts
│   │   │   └── memory/                    # 테스트·Storybook용 Adapter
│   │   │       ├── InMemoryCampaignRepository.ts
│   │   │       └── FakeCampaignPublisher.ts
│   │   │
│   │   ├── ui/                            # React 입력 Adapter
│   │   │   ├── components/
│   │   │   │   ├── CampaignSettingsForm.tsx
│   │   │   │   └── PublishCampaignButton.tsx
│   │   │   ├── queries/
│   │   │   │   ├── campaignKeys.ts
│   │   │   │   └── useCampaignSettings.ts
│   │   │   ├── forms/
│   │   │   │   ├── campaignFormSchema.ts  # Zod 입력 형식 검증
│   │   │   │   └── toCampaignCommand.ts
│   │   │   └── CampaignSettingsPage.test.tsx
│   │   │
│   │   ├── composition/
│   │   │   └── createCampaignSetup.ts     # Port 구현과 Use Case 조립
│   │   └── index.ts                       # 다른 Context와 페이지용 Public API
│   │
│   ├── budget-planning/                   # 예산 추천 Context
│   │   ├── domain/
│   │   ├── application/
│   │   ├── adapters/
│   │   ├── ui/
│   │   ├── composition/
│   │   └── index.ts
│   │
│   ├── ad-delivery/                       # 광고 게재 Context
│   │   ├── domain/
│   │   │   └── DeliverableCampaign.ts
│   │   ├── application/
│   │   │   └── RegisterPublishedCampaign.ts
│   │   ├── adapters/
│   │   │   └── CampaignPublishedConsumer.ts
│   │   └── index.ts
│   │
│   └── performance-reporting/             # 성과 분석 Context
│       ├── domain/
│       │   └── CampaignPerformance.ts
│       ├── application/
│       ├── adapters/
│       ├── ui/
│       └── index.ts
│
├── pages/                                 # 여러 Context의 읽기 모델을 화면에 조합
│   └── CampaignWorkspacePage.tsx
│
├── server/                                # 브라우저에 노출하지 않는 서버 Adapter
│   ├── campaign-publication/
│   │   ├── publishCampaignRoute.ts         # 자체 /publish 입력 Adapter
│   │   └── PublicationLedger.ts            # idempotency 결과 원장
│   ├── google-ads/
│   │   ├── GoogleAdsCampaignMapper.ts      # Domain → vendor payload ACL
│   │   ├── GoogleAdsCampaignPublisher.ts   # validate_only, mutate
│   │   ├── GoogleAdsErrorMapper.ts
│   │   └── GoogleAdsCampaignPublisher.contract.test.ts
│   └── jobs/
│       └── ReconcileGoogleAdsCampaigns.ts  # 중간 실패와 상태 불일치 복구
│
└── shared/                                # 기술적으로만 공통인 최소 코드
    ├── result/
    │   └── Result.ts
    ├── clock/
    │   └── Clock.ts
    └── testing/
        └── fixtures.ts
```

1. 판단 기준 및 적용 조건
   - 최상위 분리 기준은 `domain`, `application`, `components`가 아니라 `campaign-setup`, `budget-planning` 같은 Bounded Context다.
   - 각 Context 내부에서는 `Domain ← Application ← Adapter/UI` 방향으로만 의존하며 Domain은 React, Zod, HTTP, Google Ads SDK를 import하지 않는다.
   - `shared/`에는 `Campaign`, `Money`, 업무 Policy처럼 특정 Context의 언어를 넣지 않고 `Result`, `Clock` 같은 기술적 기반만 둔다.

2. 실행 절차 및 구현 규칙
   - 다른 Context는 내부 경로가 아니라 각 Context의 `index.ts` Public API, Port, Event 계약만 사용한다.
   - `pages/`는 여러 Context의 읽기 모델과 UI를 배치할 수 있지만 Entity를 합치거나 Context 사이의 상태를 직접 변경하지 않는다.
   - Google Ads credential, developer token, `validate_only`, resource name과 micros 변환은 `server/google-ads/`에 격리한다.
   - 실제 폴더는 복잡도에 맞게 축소한다. 파일이 하나뿐이라면 계층별 폴더를 미리 만들지 말고 독립 규칙·교체·테스트 필요가 생길 때 분리한다.

의존성 방향을 요약하면 다음과 같다.

```text
React UI ───────┐
HTTP Route ─────┼─> Application Use Case ─> Domain Model
Scheduled Job ──┘             │
                              └─> Port <─ Repository / Google Ads Adapter

Campaign Setup ──CampaignPublishedV2──> Ad Delivery
                                      └> Performance Reporting
Budget Planning ──Recommendation──────> Campaign Setup
```
