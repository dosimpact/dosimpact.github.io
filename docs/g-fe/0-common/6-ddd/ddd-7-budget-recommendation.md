---
sidebar_position: 7
---

# React DDD로 Google Ads 캠페인 예산 추천 설계하기

캠페인 수정 화면에서 여러 예산 추천을 계산하고, 우선순위와 묶음 규칙을 적용하며, 추천 선택 시 API Mutation과 웹 로깅을 실행하는 흐름을 함수형 Domain과 Hexagonal Architecture로 설계한다. A/B 실험으로 추천 타입이 5개에서 6개로 늘어나더라도 React와 Domain의 책임은 유지한다.

코드 예시는 계층의 책임과 의존성 방향을 보여 주는 축약 코드다. 실제 구현에서는 아래에 생략된 DTO 변환, 오류 타입, 인증 Context를 프로젝트 계약에 맞게 보완한다.

## 1. 모델과 경계

### 1.1 추천 규칙을 Domain으로 분리하기

목적 : 추천 타입, 금액, 점수, 정렬과 묶음 규칙을 React 렌더링이나 API 응답 형태와 분리해 하나의 업무 모델로 보호한다.

상세 로직

1. 판단 기준 및 적용 조건
   - 추천 금액과 순서가 업무 정책에 의해 결정되면 Domain 규칙이며, React의 `sort()`나 조건부 렌더링에 두지 않는다.
   - 예산 자체가 항상 1만 원 이상이어야 하면 `CampaignBudget` 불변식으로, 특정 행동에서만 필요한 최소 금액이면 해당 상태 전이 정책으로 검증한다.
   - 추천 타입은 문자열을 임의로 조합하지 않고 식별 가능한 Union으로 정의한다.

2. 실행 절차 및 구현 규칙
   - Domain은 `Readonly` 데이터와 순수 함수로 구성하고 React, `fetch`, A/B SDK, Analytics SDK를 import하지 않는다.
   - API DTO는 Adapter에서 `RecommendationCandidate`로 변환하고 Domain은 검증된 입력만 계산한다.
   - 같은 입력과 정책에는 항상 같은 추천 결과를 반환한다.

```ts
export type RecommendationType =
  | "PERFORMANCE_UP"
  | "TRAFFIC_UP"
  | "CONVERSION_UP"
  | "BUDGET_LIMITED"
  | "SEASONAL"
  | "EXPERIMENTAL_GROWTH";

export type RecommendationCandidate = Readonly<{
  type: RecommendationType;
  recommendedAmount: number;
  expectedConversions?: number;
  expectedRevenue?: number;
  confidence: number;
}>;

export type BudgetRecommendation = Readonly<{
  id: string;
  type: RecommendationType;
  recommendedAmount: number;
  // Unit 간 전체 우선순위를 결정하는 업무 점수다.
  score: number;
  // 함께 노출할 추천은 같은 groupId를 갖고 groupRank로 내부 순서를 정한다.
  groupId?: string;
  groupRank?: number;
  reason: string;
}>;

export function calculateRecommendation(
  candidate: RecommendationCandidate,
): BudgetRecommendation {
  // 타입별 추천 금액과 score 공식은 독립된 정책 함수에 둔다.
  switch (candidate.type) {
    case "PERFORMANCE_UP":
      return calculatePerformanceRecommendation(candidate);
    case "TRAFFIC_UP":
      return calculateTrafficRecommendation(candidate);
    case "CONVERSION_UP":
      return calculateConversionRecommendation(candidate);
    case "BUDGET_LIMITED":
      return calculateBudgetLimitedRecommendation(candidate);
    case "SEASONAL":
      return calculateSeasonalRecommendation(candidate);
    case "EXPERIMENTAL_GROWTH":
      return calculateExperimentalGrowthRecommendation(candidate);
    default:
      // 새 타입을 추가하면서 계산기를 빠뜨리면 TypeScript가 이 지점을 경고한다.
      return assertNever(candidate.type);
  }
}

function assertNever(value: never): never {
  throw new Error(`처리하지 않은 추천 타입: ${String(value)}`);
}
```

### 1.2 복합 추천을 Unit으로 모델링하기

목적 : 반드시 함께 나와야 하는 두 추천을 개별 항목으로 자르거나 서로 떨어뜨리지 않고, 전체 우선순위와 그룹 내부 우선순위를 각각 적용한다.

상세 로직

1. 판단 기준 및 적용 조건
   - 두 추천이 함께 노출되어야 의미가 완성되면 배열의 인접한 두 원소가 아니라 하나의 `RecommendationUnit`으로 취급한다.
   - 전체 목록의 `score`와 같은 그룹 안의 `innerPriority`는 서로 다른 규칙이므로 하나의 숫자로 합치지 않는다.
   - 최대 추천 개수가 카드 수인지 Unit 수인지 먼저 업무 용어로 확정한다.

2. 실행 절차 및 구현 규칙
   - 후보를 필터링한 뒤 추천별 점수를 계산하고, 관련 추천을 Unit으로 묶은 다음 Unit 간 정렬과 Unit 내부 정렬을 순서대로 실행한다.
   - 최대 개수를 적용할 때 그룹 일부만 잘리지 않도록 `slice()`가 아니라 완전한 Unit을 선택하는 함수를 사용한다.
   - 동점 결과가 요청마다 흔들리지 않도록 타입 우선순위나 안정적인 ID를 최종 비교 기준으로 둔다.

```ts
export type RecommendationUnit =
  | Readonly<{
      kind: "SINGLE";
      priority: number;
      items: readonly [BudgetRecommendation];
    }>
  | Readonly<{
      kind: "GROUP";
      groupId: string;
      priority: number;
      items: readonly [
        BudgetRecommendation,
        BudgetRecommendation,
      ];
    }>;

export function createBudgetRecommendations(
  candidates: readonly RecommendationCandidate[],
  policy: RecommendationPolicy,
): readonly BudgetRecommendation[] {
  // 실험 정책에서 허용한 추천 타입만 Domain 계산 대상으로 남긴다.
  const enabled = candidates.filter(({ type }) =>
    policy.enabledTypes.includes(type),
  );

  // 점수 계산 후 함께 노출해야 하는 추천을 먼저 Unit으로 묶는다.
  const recommendations = enabled.map(calculateRecommendation);
  const units = groupRecommendationsIntoUnits(recommendations);

  // Unit끼리 정렬한 뒤 그룹이 잘리지 않는 범위에서 노출 개수를 적용한다.
  const ranked = rankRecommendationUnits(units);
  return selectWholeUnits(ranked, policy.maximumVisibleCards)
    .flatMap(sortItemsWithinUnit);
}

export function selectWholeUnits(
  units: readonly RecommendationUnit[],
  maximumVisibleCards: number,
): readonly RecommendationUnit[] {
  const selected: RecommendationUnit[] = [];
  let selectedCardCount = 0;

  for (const unit of units) {
    // GROUP은 두 카드를 하나의 변경 단위로 계산한다.
    if (
      selectedCardCount + unit.items.length >
      maximumVisibleCards
    ) {
      // 남은 자리가 부족하면 그룹 일부를 자르지 않고 Unit 전체를 건너뛴다.
      continue;
    }

    selected.push(unit);
    selectedCardCount += unit.items.length;
  }

  return selected;
}

export function rankRecommendationUnits(
  units: readonly RecommendationUnit[],
): readonly RecommendationUnit[] {
  return [...units].sort((left, right) => {
    // 먼저 Unit의 업무 우선순위를 내림차순으로 비교한다.
    if (left.priority !== right.priority) {
      return right.priority - left.priority;
    }

    // 동점이면 안정적인 키를 사용해 요청마다 순서가 바뀌지 않게 한다.
    return unitStableKey(left).localeCompare(unitStableKey(right));
  });
}

function unitStableKey(unit: RecommendationUnit): string {
  // 그룹 ID와 추천 ID는 점수가 같을 때 사용하는 결정적 tie-breaker다.
  return unit.kind === "GROUP"
    ? `GROUP:${unit.groupId}`
    : `SINGLE:${unit.items[0].id}`;
}

export function sortItemsWithinUnit(
  unit: RecommendationUnit,
): readonly BudgetRecommendation[] {
  return [...unit.items].sort((left, right) => {
    // 같은 그룹 안에서는 전체 score가 아니라 별도의 groupRank가 우선한다.
    if ((left.groupRank ?? 0) !== (right.groupRank ?? 0)) {
      return (right.groupRank ?? 0) - (left.groupRank ?? 0);
    }

    // 내부 우선순위까지 같을 때만 score와 ID를 보조 기준으로 사용한다.
    if (left.score !== right.score) return right.score - left.score;
    return left.id.localeCompare(right.id);
  });
}
```

## 2. 실험 정책

### 2.1 A/B Variant를 Domain 정책으로 번역하기

목적 : 수정 페이지 진입 시 결정되는 A/B Variant가 Domain 내부의 SDK 의존성이나 분산된 실험 조건문으로 침투하지 않게 한다.

상세 로직

1. 판단 기준 및 적용 조건
   - 실험 SDK에서 Variant를 읽는 일은 외부 I/O이므로 `ExperimentProvider` Output Port와 Adapter가 담당한다.
   - Domain은 `CONTROL`, `TREATMENT` 같은 실험 도구의 개념보다 활성 추천 타입과 최대 노출 카드 수라는 업무 정책을 입력받는다.
   - 여섯 번째 추천도 실제로 계산하고 선택하는 업무 개념이면 `RecommendationType`에는 포함하되, 활성 여부만 정책으로 제어한다.

2. 실행 절차 및 구현 규칙
   - Application의 `recommendationPolicyForVariant()`가 Variant를 `RecommendationPolicy`로 변환해 Domain 함수에 전달한다.
   - 컴포넌트 곳곳에 `variant === "TREATMENT"` 조건을 작성하지 않는다.
   - 실험 종료 후에는 Policy 변환부와 비활성 분기만 제거할 수 있도록 변경 지점을 한 곳으로 모은다.

```ts
// domain/model/RecommendationPolicy.ts
export type RecommendationPolicy = Readonly<{
  enabledTypes: readonly RecommendationType[];
  maximumVisibleCards: number;
}>;

// application/experiments/recommendationPolicyForVariant.ts
export function recommendationPolicyForVariant(
  variant: "CONTROL" | "TREATMENT",
  maximumVisibleCards: number,
): RecommendationPolicy {
  // 대조군과 실험군이 공통으로 사용하는 기존 다섯 타입이다.
  const baseTypes: readonly RecommendationType[] = [
    "PERFORMANCE_UP",
    "TRAFFIC_UP",
    "CONVERSION_UP",
    "BUDGET_LIMITED",
    "SEASONAL",
  ];

  return {
    // 여섯 번째 타입의 활성 여부만 Variant가 결정한다.
    enabledTypes:
      variant === "TREATMENT"
        ? [...baseTypes, "EXPERIMENTAL_GROWTH"]
        : baseTypes,
    // 활성 타입 수와 실제 화면의 최대 카드 수는 서로 다른 정책이다.
    maximumVisibleCards,
  };
}
```

### 2.2 Variant 할당과 실제 노출을 구분하기

목적 : 실험 대상에 배정된 사건과 사용자가 추천 UI를 실제로 본 사건을 분리해 중복되거나 부정확한 노출 로그를 방지한다.

상세 로직

1. 판단 기준 및 적용 조건
   - Variant 조회는 할당이며 추천 Query 성공만으로 실제 노출을 의미하지 않을 수 있다.
   - React Strict Mode, Query 재시도, 화면 재진입은 같은 노출 로그를 여러 번 발행할 수 있다.
   - 실험 분석이 실제 UI 노출을 기준으로 한다면 추천 목록이 화면에 표시된 시점을 별도 사건으로 기록한다.

2. 실행 절차 및 구현 규칙
   - 실험 SDK의 공식 exposure API 또는 안정적인 `exposureId`를 사용해 멱등성을 보장한다.
   - `VARIANT_ASSIGNED`, `RECOMMENDATIONS_VIEWED`, `RECOMMENDATION_CLICKED`를 서로 다른 이벤트로 정의한다.
   - `ExperimentProvider.getVariant()`에는 `experimentKey`와 안정적인 `subjectId`를 전달하고, 일반적으로 분석 로그 실패는 핵심 작업과 분리한다.

## 3. Application 흐름

### 3.1 추천 조회 Use Case에서 외부 입력을 조정하기

목적 : 캠페인, 추천 후보, 실험 Variant를 외부에서 가져오고 Domain 계산에 필요한 입력으로 조립한다.

상세 로직

1. 판단 기준 및 적용 조건
   - 조회와 저장 같은 부수효과는 Application이 조정하고, 추천 가능 여부와 순위 계산은 Domain에 위임한다.
   - 서로 독립적인 캠페인 조회, 후보 조회, Variant 조회는 병렬 실행할 수 있다.
   - Use Case는 React Query의 캐시나 Form 상태를 알지 않는다.

2. 실행 절차 및 구현 규칙
   - `CampaignRepository`, `RecommendationSource`, `ExperimentProvider`를 Output Port로 주입한다.
   - Adapter가 외부 응답을 Domain 입력으로 변환한 뒤 `createBudgetRecommendations()`를 호출한다.
   - 반환값은 React가 표시하는 데 필요한 캠페인, 최종 추천 목록, Variant 식별자를 포함한다.

```ts
type GetBudgetRecommendationsQuery = Readonly<{
  campaignId: string;
  experimentSubjectId: string;
}>;

export function createGetBudgetRecommendations(deps: {
  campaignRepository: CampaignRepository;
  recommendationSource: RecommendationSource;
  experimentProvider: ExperimentProvider;
  maximumVisibleCards: number;
}) {
  return async function getBudgetRecommendations(
    query: GetBudgetRecommendationsQuery,
  ) {
    // 서로 의존하지 않는 외부 조회는 병렬로 실행해 진입 지연을 줄인다.
    const [campaign, candidates, variant] = await Promise.all([
      deps.campaignRepository.findById(query.campaignId),
      deps.recommendationSource.findCandidates(query.campaignId),
      deps.experimentProvider.getVariant({
        experimentKey: "budget_recommendation_v2",
        subjectId: query.experimentSubjectId,
        attributes: { campaignId: query.campaignId },
      }),
    ]);

    if (!campaign) {
      return { ok: false as const, error: { code: "CAMPAIGN_NOT_FOUND" } };
    }

    return {
      ok: true as const,
      value: {
        campaign,
        variant,
        // Application이 실험 용어를 Domain 정책으로 번역한 뒤 계산을 위임한다.
        recommendations: createBudgetRecommendations(
          candidates,
          recommendationPolicyForVariant(
            variant,
            // 화면 노출 수는 실험 타입 수가 아니라 제품 설정에서 주입한다.
            deps.maximumVisibleCards,
          ),
        ),
      },
    };
  };
}
```

### 3.2 추천 선택의 Mutation과 로깅 정책 정하기

목적 : 추천 클릭, Form 값 변경, API Mutation, 성공·실패 로깅을 하나의 사건으로 뭉개지 않고 필요한 순서와 실패 정책으로 조합한다.

상세 로직

1. 판단 기준 및 적용 조건
   - 클릭 즉시 서버 예산을 저장할지, Form에만 반영하고 최종 저장 버튼에서 Mutation할지 제품 흐름을 먼저 확정한다.
   - 클릭 로그와 적용 성공 로그는 의미가 다르므로 `RECOMMENDATION_CLICKED`, `APPLY_SUCCEEDED`, `APPLY_FAILED`로 구분한다.
   - Analytics 실패 때문에 성공한 예산 변경을 실패로 되돌리지 않는 것이 일반적이다.

2. 실행 절차 및 구현 규칙
   - 클릭 즉시 저장하는 경우 Application Command가 예산 생성 규칙을 확인하고 Repository Mutation을 실행한다.
   - 로그 전송은 `trackSafely()`에서 실패를 흡수하거나 재시도 큐에 넣고, API 결과와 혼합하지 않는다.
   - Form에만 반영하는 흐름이면 클릭 Use Case는 선택 로그만 기록하고 실제 Mutation은 저장 Use Case에서 실행한다.

```ts
export function createApplyBudgetRecommendation(deps: {
  campaignRepository: CampaignRepository;
  analyticsTracker: AnalyticsTracker;
  logger: Logger;
}) {
  async function trackSafely(event: AnalyticsEvent): Promise<void> {
    try {
      await deps.analyticsTracker.track(event);
    } catch (error) {
      // 분석 로그 실패가 예산 변경 결과를 뒤집지 않도록 여기서 흡수한다.
      deps.logger.warn("Analytics 전송 실패", { error, event });
    }
  }

  return async function apply(command: ApplyRecommendationCommand) {
    // 클릭 사실은 API 성공 여부와 별개의 사용자 행동으로 기록한다.
    void trackSafely({
      name: "RECOMMENDATION_CLICKED",
      campaignId: command.campaignId,
      recommendationId: command.recommendation.id,
      variant: command.variant,
    });

    // 외부 Mutation 전에 추천 금액을 Domain Value Object로 검증한다.
    const budget = createCampaignBudget(
      command.recommendation.recommendedAmount,
    );
    if (!budget.ok) return budget;

    try {
      // 예산 저장은 사용자의 핵심 작업이므로 완료 결과를 기다린다.
      await deps.campaignRepository.updateBudget(
        command.campaignId,
        budget.value,
      );
      void trackSafely({
        name: "APPLY_SUCCEEDED",
        campaignId: command.campaignId,
        recommendationId: command.recommendation.id,
      });
      return { ok: true as const, value: budget.value };
    } catch {
      // 실패 이벤트를 남기되 호출자에는 구조화된 업무 오류를 반환한다.
      void trackSafely({
        name: "APPLY_FAILED",
        campaignId: command.campaignId,
        recommendationId: command.recommendation.id,
      });
      return {
        ok: false as const,
        error: { code: "BUDGET_UPDATE_FAILED" as const },
      };
    }
  };
}
```

### 3.3 Port를 외부 기술이 아닌 필요한 능력으로 정의하기

목적 : Use Case가 HTTP, 실험 SDK, 웹 로깅 도구를 직접 알지 않고 Application 언어로 외부 기능을 요구하게 한다.

상세 로직

1. 판단 기준 및 적용 조건
   - Port는 Application이 호출할 계약이며 외부 API DTO나 SDK 고유 타입을 노출하지 않는다.
   - Campaign Aggregate가 없다면 `CampaignBudgetGateway`가 더 정확할 수 있지만, 이 예제는 조회·저장 Port라는 의미로 Repository 이름을 사용한다.
   - `AnalyticsTracker`는 제품 행동 분석, `Logger`는 기술 장애 진단이라는 서로 다른 목적을 가진다.

2. 실행 절차 및 구현 규칙
   - 함수형 Port는 메서드가 담긴 `Readonly` 객체 타입으로 선언한다.
   - 동시 수정은 `expectedVersion`, 중복 Mutation은 `idempotencyKey`, 실험 중복 노출은 `exposureId`로 구분한다.
   - 실제 HTTP·A/B·Analytics SDK 연결은 `adapters/outbound`에서 Port를 구현한다.

```ts
export type CampaignRepository = Readonly<{
  findBudgetById: (campaignId: string) => Promise<CampaignBudgetSnapshot | null>;
  updateBudget: (command: UpdateCampaignBudgetCommand) =>
    Promise<Result<CampaignBudgetSnapshot, UpdateBudgetError>>;
}>;

export type RecommendationSource = Readonly<{
  findCandidates: (campaignId: string) =>
    Promise<readonly RecommendationCandidate[]>;
}>;

export type ExperimentProvider = Readonly<{
  getVariant: (query: ExperimentQuery) => Promise<ExperimentAssignment>;
}>;

export type AnalyticsTracker = Readonly<{
  track: (event: BudgetRecommendationAnalyticsEvent) => Promise<void>;
}>;
```

## 4. React 연결

### 4.1 Hook을 Input Adapter로 사용하기

목적 : React가 페이지 생명주기, 서버 상태와 Form 상태를 관리하되 Domain 규칙을 직접 계산하지 않게 한다.

상세 로직

1. 판단 기준 및 적용 조건
   - Domain은 React Hook으로 구현하지 않으며 React가 Domain과 Application을 의존하는 방향만 허용한다.
   - 단순 `useEffect` 조회도 가능하지만 캐시, 중복 요청, 재시도, 취소가 필요하면 React Query로 Use Case를 감싼다.
   - 추천 목록 컴포넌트는 Domain이 반환한 순서를 그대로 렌더링한다.

2. 실행 절차 및 구현 규칙
   - `useBudgetRecommendations()`는 Query에서 조회 Use Case를 호출한다.
   - 조회된 캠페인 예산은 `useEffect`에서 Form 초기값으로 동기화하되, 이 Effect 안에서 Domain이나 Application Use Case를 호출하지 않는다.
   - 추천 클릭 즉시 저장한다면 `form.setValue()`의 optimistic update가 실패할 때 이전 예산으로 rollback하고, 중복 클릭은 Mutation 중 비활성화한다.
   - React는 로딩·네트워크 오류·업무 오류를 구분하되 추천 점수 계산, A/B 타입 필터링, 그룹 정렬을 다시 구현하지 않는다.

```tsx
type CampaignBudgetFormProps = Readonly<{
  campaignId: string;
  experimentSubjectId: string;
}>;

export function CampaignBudgetForm({
  campaignId,
  experimentSubjectId,
}: CampaignBudgetFormProps) {
  const recommendations = useBudgetRecommendations({
    campaignId,
    experimentSubjectId,
  });
  const applyRecommendation = useApplyBudgetRecommendation();
  const form = useForm<{ dailyBudget: number }>({
    defaultValues: { dailyBudget: 0 },
  });
  const resetForm = form.reset;

  useEffect(() => {
    if (!recommendations.data?.ok) return;

    // Query 결과를 Form의 편집 시작값으로 동기화한다.
    resetForm({
      dailyBudget: recommendations.data.value.campaign.budget.amount,
    });
  }, [recommendations.data, resetForm]);

  if (recommendations.isPending) {
    return <RecommendationSkeleton />;
  }
  if (recommendations.isError) {
    return <RecommendationError />;
  }
  if (!recommendations.data.ok) {
    return <RecommendationUnavailable />;
  }

  const { variant, recommendations: items } = recommendations.data.value;

  function selectRecommendation(item: BudgetRecommendation) {
    // 즉시 반영 UX를 위해 Mutation 전 값을 보관하고 Form을 먼저 갱신한다.
    const previousBudget = form.getValues("dailyBudget");

    function rollbackIfRecommendationIsStillVisible() {
      // 요청 중 사용자가 직접 고친 새 값까지 과거 값으로 덮어쓰지 않는다.
      if (form.getValues("dailyBudget") !== item.recommendedAmount) return;

      form.setValue("dailyBudget", previousBudget, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    form.setValue("dailyBudget", item.recommendedAmount, {
      shouldDirty: true,
      shouldValidate: true,
    });

    applyRecommendation.mutate(
      {
        campaignId,
        recommendation: item,
        variant,
      },
      {
        onSuccess(result) {
          if (!result.ok) {
            // Application이 실패 Result를 반환하면 이전 입력값으로 되돌린다.
            rollbackIfRecommendationIsStillVisible();
          }
        },
        onError() {
          // 예상하지 못한 네트워크·런타임 예외도 같은 rollback 정책을 적용한다.
          rollbackIfRecommendationIsStillVisible();
        },
      },
    );
  }

  return (
    <form>
      <input
        type="number"
        {...form.register("dailyBudget", { valueAsNumber: true })}
      />
      <BudgetRecommendationList
        recommendations={items}
        onSelect={selectRecommendation}
        disabled={applyRecommendation.isPending}
      />
    </form>
  );
}
```

### 4.2 의존성 방향과 디렉터리 유지하기

목적 : 기능이 확장되어도 Domain이 React, API, 실험 및 로깅 도구에 종속되지 않도록 물리적 구조와 조립 지점을 유지한다.

상세 로직

1. 판단 기준 및 적용 조건
   - `domain`은 순수 모델과 정책, `application`은 Use Case와 Port, `adapters`는 React와 외부 기술 구현을 가진다.
   - 실제 Adapter 생성과 Use Case 의존성 주입은 `composition`에서 수행한다.
   - 디렉터리 이름보다 `Adapters → Application → Domain` 의존성 방향이 중요하다.

2. 실행 절차 및 구현 규칙
   - Domain에서 React, HTTP client, SDK import가 발견되면 경계가 역전된 신호로 본다.
   - Output Port는 Application이 필요한 능력의 언어로 정의하고 HTTP DTO를 노출하지 않는다.
   - 추천 타입 추가 시 Domain 타입·정책·테스트를 먼저 변경하고 React는 가능한 한 변경 없이 결과를 렌더링한다.

```text
campaign-budget/
├─ domain/
│  ├─ CampaignBudget.value.ts
│  ├─ BudgetRecommendation.ts
│  └─ recommendationPolicies.ts
├─ application/
│  ├─ ports/
│  ├─ experiments/recommendationPolicyForVariant.ts
│  └─ use-cases/
│     ├─ getBudgetRecommendations.ts
│     └─ applyBudgetRecommendation.ts
├─ adapters/
│  ├─ inbound/react/
│  └─ outbound/
│     ├─ http/
│     ├─ experiment/
│     ├─ analytics/
│     └─ logging/
└─ composition/
   └─ campaignBudgetDependencies.ts
```

```text
React Hook
  → Application Use Case
    → Domain 순수 계산
    → Output Port
      ← HTTP · Experiment · Analytics Adapter
```

## 5. 검증

### 5.1 추천 정책의 불변식 테스트하기

목적 : 추천 타입 추가와 점수 변경이 기존 정렬, 그룹 완전성, 노출 개수 정책을 의도하지 않게 깨뜨리지 않도록 순수 Domain 규칙을 고정한다.

상세 로직

1. 판단 기준 및 적용 조건
   - 동일한 후보와 정책에는 추천 순서가 항상 같아야 한다.
   - `TREATMENT`는 여섯 번째 타입만 활성화하고 최대 노출 카드 수를 암묵적으로 변경하지 않는다.
   - 두 카드로 구성된 `GROUP`은 모두 선택되거나 모두 제외되어야 한다.

2. 실행 절차 및 구현 규칙
   - Domain 테스트에는 Repository, React, 실험 SDK를 사용하지 않고 값만 입력한다.
   - 점수가 같은 후보에는 타입 우선순위와 안정적인 ID를 적용한 예상 순서를 검증한다.
   - 경계값으로 빈 후보, 최대 카드 수 0, 그룹보다 작은 남은 자리를 포함한다.

```ts
it("실험군도 노출 카드 수를 자동으로 늘리지 않는다", () => {
  const control = recommendationPolicyForVariant("CONTROL", 3);
  const treatment = recommendationPolicyForVariant("TREATMENT", 3);

  // Variant는 활성 타입만 바꾸고 화면 수용량 정책은 유지한다.
  expect(control.maximumVisibleCards).toBe(3);
  expect(treatment.maximumVisibleCards).toBe(3);
  expect(control.enabledTypes.includes("EXPERIMENTAL_GROWTH")).toBe(false);
  expect(treatment.enabledTypes.includes("EXPERIMENTAL_GROWTH")).toBe(true);
});

it("남은 자리가 부족하면 그룹 전체를 제외한다", () => {
  const pair: RecommendationUnit = {
    kind: "GROUP",
    groupId: "PERFORMANCE_BUDGET_PAIR",
    priority: 100,
    items: [performanceRecommendation, budgetLimitedRecommendation],
  };

  // 한 자리만 허용할 때 두 카드 중 하나만 노출해서는 안 된다.
  expect(selectWholeUnits([pair], 1)).toEqual([]);
});
```

### 5.2 부수효과의 실패 경계 테스트하기

목적 : Analytics, API, React Form이 서로 다른 실패 정책을 유지하고 재시도나 중복 실행에도 사용자 상태가 어긋나지 않게 한다.

상세 로직

1. 판단 기준 및 적용 조건
   - Analytics 실패는 성공한 예산 Mutation을 실패로 바꾸지 않는다.
   - Repository 실패는 `BUDGET_UPDATE_FAILED`를 반환하고 `APPLY_FAILED` 이벤트를 시도한다.
   - React는 실패 Result와 예상하지 못한 예외 모두에서 이전 Form 값으로 rollback한다.

2. 실행 절차 및 구현 규칙
   - Use Case 테스트는 Port를 Test Double로 주입해 저장 결과와 이벤트 호출을 각각 검증한다.
   - React 통합 테스트는 Mutation 중 추천 버튼 비활성화와 실패 후 입력값 복원을 확인한다.
   - 노출 Adapter의 계약 테스트는 같은 `exposureId`가 재전송되어도 한 번만 집계되는지 검증한다.

```ts
it("Analytics가 실패해도 성공한 예산 변경을 유지한다", async () => {
  const campaignRepository = createCampaignRepositoryStub({ update: "SUCCESS" });
  const analyticsTracker = createAnalyticsTrackerStub({ track: "FAIL" });
  const apply = createApplyBudgetRecommendation({
    campaignRepository,
    analyticsTracker,
    logger: createLoggerSpy(),
  });

  // trackSafely가 로그 오류를 경계 안에서 처리하므로 핵심 작업은 성공한다.
  const result = await apply(command);

  expect(result.ok).toBe(true);
  expect(campaignRepository.updateBudget).toHaveBeenCalledOnce();
});
```

## 6. React 상태와 업무 경계

### 6.1 상태의 생명주기마다 소유자를 하나만 두기

목적 : React Query, React Hook Form, Zustand와 Domain 모델에 같은 예산을 중복 저장해 수동 동기화하는 문제를 방지한다.

상세 로직

1. 판단 기준 및 적용 조건
   - React Query는 캠페인 Snapshot·추천 목록·`version` 같은 서버 상태를 소유한다.
   - React Hook Form은 사용자가 편집 중인 예산과 선택한 추천 ID처럼 불완전할 수 있는 Draft를 소유한다.
   - Zustand는 여러 Route에 걸친 편집 세션, Undo/Redo, 오프라인 Draft처럼 지역 Form으로 해결할 수 없을 때만 사용한다.

2. 실행 절차 및 구현 규칙
   - Domain은 별도 저장소가 아니라 유효한 데이터 타입과 순수 변경 규칙이다.
   - Zustand에는 Domain 모델을 복제하지 말고 Domain 타입 그대로 또는 최소 편집 세션만 저장한다.
   - 서버 상태를 React Query와 Zustand에 동시에 복사하지 않고 실제 영구 상태의 최종 권한은 서버에 둔다.

```text
React Query     → 서버 Snapshot
React Hook Form → 입력 중인 Draft
useState        → 지역 선택 상태
Zustand         → 필요한 경우의 전역 편집 세션
Domain          → 상태의 의미와 순수 규칙
Server          → 영구 상태와 최종 검증
```

### 6.2 Form과 Query에서 필요한 값만 Command로 조합하기

목적 : React 상태 객체 전체를 Use Case에 넘기지 않고, Input Adapter가 한 작업에 필요한 최소 입력 계약을 만든다.

상세 로직

1. 판단 기준 및 적용 조건
   - Form에는 사용자가 바꿀 수 있는 `dailyBudgetWon`, `selectedRecommendationId` 같은 값만 둔다.
   - Query의 `campaignId`, `version`, 실험 할당은 서버 Snapshot이며 Form에 복사하지 않는다.
   - Command는 React와 Domain을 직접 연결하는 객체가 아니라 React가 Application Use Case를 호출하는 Input 계약이다.

2. 실행 절차 및 구현 규칙
   - Submit Handler가 Form Draft와 Query Snapshot에서 필요한 값만 선택해 Command를 만든다.
   - `UseFormReturn`, `QueryClient`, React event, Query 결과 객체 전체는 Command에 넣지 않는다.
   - Application은 원시 `amount`를 `createCampaignBudget()`으로 변환하고 서버는 권한·상태·추천 유효성을 최종 검증한다.

### 6.3 UI 상호작용 로그와 업무 사건을 구분하기

목적 : focus·click·submit 같은 브라우저 사건과 추천 채택처럼 실제 상태가 변경된 업무 사건을 같은 로그로 취급하지 않는다.

상세 로직

1. 판단 기준 및 적용 조건
   - 단순 input focus, hover, scroll은 React Adapter에서 기록하며 Domain이나 핵심 Use Case에 넣지 않는다.
   - focus가 편집 Lock이나 감사 기록을 시작하면 업무 언어의 Application Use Case로 변환한다.
   - Submit 시도와 실제 Adoption은 다르며 저장 실패 시 `SUBMITTED`는 발생하지만 `ADOPTED`는 발생하지 않는다.

2. 실행 절차 및 구현 규칙
   - `RECOMMENDATION_SUBMITTED`, `RECOMMENDATION_ADOPTED`, `ADOPTION_FAILED`를 별도 사건으로 기록한다.
   - 성공 로그는 Domain 검증과 Repository 저장이 모두 성공한 뒤 발행한다.
   - Analytics SDK는 Domain에서 호출하지 않고 React Adapter 또는 `AnalyticsTracker` Port 뒤에 둔다.

### 6.4 Adoption을 순수 Domain과 부수효과 Application으로 나누기

목적 : 추천 채택이 업무 규칙과 로깅을 함께 요구해도 Domain의 순수성을 유지한다.

상세 로직

1. 판단 기준 및 적용 조건
   - Domain의 `adoptBudgetRecommendation()`은 상태와 추천을 받아 채택 가능 여부와 적용할 예산만 계산한다.
   - 시간·ID가 필요하면 `Date.now()`나 `crypto`를 직접 호출하지 않고 Application이 값으로 전달한다.
   - Domain Event가 필요하면 실제 발행하지 않고 후속 처리할 불변 데이터로 결과에 포함한다.

2. 실행 절차 및 구현 규칙
   - Application Use Case는 조회 → 순수 Domain 판단 → Repository 저장 → 성공·실패 로그 순서를 조정한다.
   - Domain 검증 성공만으로 `ADOPTED`를 기록하지 않고 서버 저장 성공을 실제 채택 기준으로 삼는다.
   - 단순 웹 분석만 필요하면 Domain Event를 만들지 않고 Application 성공 분기에서 Analytics를 호출한다.

```text
React Submit
  → Application Use Case
    → adoptBudgetRecommendation()  # 순수 계산
    → CampaignRepository           # 저장 부수효과
    → AnalyticsTracker             # 로깅 부수효과
```

## 7. 권장 시작 디렉터리 구조

### 7.1 경계를 드러내고 관련 개념은 함께 배치하기

목적 : `Domain`, `Application`, `Port`, `Adapter`, `Composition`이라는 설계 경계는 디렉터리에서 명시하고, 같은 경계 안의 관련 타입은 과도하게 쪼개지 않는다.

상세 로직

1. 판단 기준 및 적용 조건
   - `campaign-budget`을 하나의 기능 경계로 두고 `domain`, `application`, `adapters`, `composition`을 명시한다.
   - Value Object가 적을 때는 별도 폴더 대신 `*.value.ts` 접미사로 역할을 드러낸다.
   - `RecommendationCandidate`, `RecommendationPolicy`, `RecommendationUnit`은 함께 사용되므로 초기에는 `BudgetRecommendation.ts`에 모은다.
   - `Campaign`이 자체 상태 전이를 보호하지 않고 추천 입력으로만 사용된다면 별도 Entity 파일을 만들지 않는다.

2. 실행 절차 및 구현 규칙
   - `ports`에는 Application이 외부에 요구하는 능력을, `adapters/inbound`와 `adapters/outbound`에는 실제 기술 연결을 둔다.
   - `composition`만 실제 Adapter를 생성하고 Application Use Case에 의존성을 주입한다.
   - 여러 기능이 공유하지 않는 추천 타입, 정책, Hook은 전역 `shared`로 이동하지 않는다.

```text
src/
├─ features/
│  └─ campaign-budget/                         # 캠페인 예산 추천 기능 경계
│     ├─ domain/                               # React와 외부 I/O를 모르는 업무 규칙
│     │  ├─ CampaignBudget.value.ts            # 예산 Value Object와 최소 금액 불변식
│     │  ├─ BudgetRecommendation.ts            # Candidate, Policy, Unit 등 추천 모델
│     │  ├─ recommendationPolicies.ts          # 계산, 그룹화, 정렬 순수 함수
│     │  └─ recommendationPolicies.test.ts     # 추천 순서와 그룹 불변식 테스트
│     │
│     ├─ application/                          # 외부 I/O와 Domain 계산을 조정
│     │  ├─ ports/                             # Application이 외부에 요구하는 계약
│     │  │  ├─ CampaignRepository.ts           # 캠페인 조회와 예산 저장 Port
│     │  │  ├─ RecommendationSource.ts         # 추천 후보 조회 Port
│     │  │  ├─ ExperimentProvider.ts           # A/B Variant 조회 Port
│     │  │  ├─ AnalyticsTracker.ts             # 행동·결과 로그 발행 Port
│     │  │  └─ Logger.ts                       # 기술 오류 기록 Port
│     │  ├─ use-cases/                         # 사용자 목표 단위의 실행 흐름
│     │  │  ├─ getBudgetRecommendations.ts     # 조회, 실험 결정, 추천 계산 조정
│     │  │  ├─ getBudgetRecommendations.test.ts
│     │  │  ├─ applyBudgetRecommendation.ts    # 추천 검증, 예산 Mutation, 로그 조정
│     │  │  └─ applyBudgetRecommendation.test.ts
│     │  └─ experiments/
│     │     ├─ recommendationPolicyForVariant.ts      # Variant를 Domain Policy로 번역
│     │     └─ recommendationPolicyForVariant.test.ts
│     │
│     ├─ adapters/                             # Port와 외부 기술 사이의 변환 계층
│     │  ├─ inbound/
│     │  │  └─ react/                          # 사용자 입력을 Use Case 호출로 변환
│     │  │     ├─ CampaignBudgetEditPage.tsx   # Query 결과와 화면 상태 조합
│     │  │     ├─ CampaignBudgetForm.tsx       # 입력값과 rollback UI 관리
│     │  │     ├─ BudgetRecommendationList.tsx # 계산된 추천을 순서대로 렌더링
│     │  │     ├─ useBudgetRecommendations.ts  # 조회 Use Case용 React Query Adapter
│     │  │     ├─ useApplyBudgetRecommendation.ts # Mutation Use Case용 Adapter
│     │  │     ├─ campaignBudgetFormSchema.ts  # 빠른 사용자 피드백용 UI 검증
│     │  │     └─ CampaignBudgetForm.test.tsx  # 선택, 비활성화, rollback 통합 테스트
│     │  └─ outbound/
│     │     ├─ http/                           # BFF DTO와 Domain 모델 변환
│     │     │  ├─ HttpCampaignRepository.ts    # CampaignRepository의 HTTP 구현
│     │     │  ├─ HttpRecommendationSource.ts  # RecommendationSource의 HTTP 구현
│     │     │  └─ httpAdapters.contract.test.ts
│     │     ├─ experiment/
│     │     │  └─ AbExperimentAdapter.ts       # 실험 SDK를 ExperimentProvider에 연결
│     │     ├─ analytics/
│     │     │  └─ WebAnalyticsAdapter.ts       # 웹 로깅 SDK를 AnalyticsTracker에 연결
│     │     └─ logging/
│     │        └─ BrowserLoggerAdapter.ts       # 브라우저 Logger 구현
│     │
│     ├─ composition/
│     │  └─ campaignBudgetDependencies.ts      # Adapter 생성과 Use Case 의존성 주입
│     └─ index.ts                              # 기능의 최소 Public API
│
├─ shared/                                     # 업무 의미가 없는 공통 기반 코드
│  ├─ domain/
│  │  └─ Result.ts                             # 공통 성공·실패 표현
│  ├─ infrastructure/
│  │  └─ http/
│  │     └─ httpClient.ts                      # 인증과 공통 HTTP 설정
│  └─ presentation/
│     └─ providers/
│        └─ QueryProvider.tsx                  # React Query 전역 Provider
│
└─ app/                                        # 기능들을 조립하는 애플리케이션 진입점
   ├─ App.tsx
   ├─ router.tsx                               # 수정 페이지 Route 연결
   └─ providers.tsx                            # 전역 Provider 조립
```

```text
CampaignBudgetEditPage.tsx
  → useBudgetRecommendations.ts
    → getBudgetRecommendations.ts
      → recommendationPolicyForVariant.ts
      → recommendationPolicies.ts
      → CampaignRepository · RecommendationSource · ExperimentProvider
        ← HTTP Adapter · A/B Experiment Adapter

BudgetRecommendationList.tsx
  → useApplyBudgetRecommendation.ts
    → applyBudgetRecommendation.ts
      → CampaignBudget.value.ts
      → CampaignRepository · AnalyticsTracker · Logger
        ← HTTP · Web Analytics · Browser Logger Adapter
```
