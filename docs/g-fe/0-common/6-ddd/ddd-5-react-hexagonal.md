---
sidebar_position: 5
---

# React와 도메인 연결하기

앞 장에서 만든 `Campaign`, `CampaignBudget`, 게시 상태 전이 규칙을 React에 연결한다. 핵심은 React를 도메인의 주인이 아니라 사용자의 입력을 전달하고 결과를 보여 주는 **입력 Adapter**로 두는 것이다.

## 1. 핵심 키워드 및 개념

### 1.1 핵심 용어 빠르게 보기

| 키워드 | 핵심 개념 |
| --- | --- |
| Hexagonal Architecture | Domain과 Application을 중심에 두고 외부 기술을 Port와 Adapter로 연결하는 구조 |
| Dependency Rule | React와 Infrastructure가 안쪽 계층을 의존하고 Domain은 바깥 기술을 모르게 하는 규칙 |
| Input Adapter | 사용자 입력을 Use Case 호출로 변환하는 React 컴포넌트나 Controller |
| Output Port | Application이 저장소나 외부 API에 요구하는 기능을 정의한 인터페이스 |
| Output Adapter | Port를 HTTP, Google Ads API, 브라우저 저장소 같은 기술로 구현한 객체 |
| Repository | Aggregate의 조회와 저장을 도메인 관점의 인터페이스로 추상화한 Port |
| Mapper | 외부 DTO와 내부 Domain Model 사이의 이름, 단위, 상태 값을 변환하는 객체 |
| Composition Root | 실제 Port 구현체를 생성하고 Use Case와 React에 연결하는 애플리케이션 시작점 |

## 2. Hexagonal Architecture의 경계

### 2.1 의존성 방향으로 역할 나누기

목적 : UI와 Google Ads API가 바뀌어도 캠페인 규칙을 다시 작성하지 않도록 비즈니스 중심의 의존성 방향을 만든다.

상세 로직

1. 판단 기준 및 적용 조건
  - `Domain`은 캠페인 규칙과 상태 전이만 알며 React, HTTP, Zod를 import하지 않는다.
  - `Application`은 하나의 사용자 목표를 조정하고, 외부 기능은 자신이 소유한 `Port` 인터페이스로 요구한다.
  - `Adapter`는 Port를 HTTP, 저장소, React 이벤트처럼 구체적인 기술로 번역한다.

2. 실행 절차 및 구현 규칙
  - 바깥 계층이 안쪽 계층을 import하게 하고, 구현체 선택은 애플리케이션 시작점인 Composition Root에서만 수행한다.
  - 폴더 이름보다 import 방향을 먼저 검사한다. `domain`이 `infrastructure`를 import한다면 폴더가 분리되어도 육각형 경계는 깨진 것이다.

```ts
// campaign/composition-root.ts
import {
  ChangeCampaignDailyBudget,
  LoadCampaignSettings,
} from "./application/use-cases";
import {
  HttpCampaignBudgetRepository,
  HttpCampaignRepository,
} from "./adapters/http-repositories";

// 구체 Adapter 생성은 바깥쪽 조립 지점 한 곳에서만 수행한다.
const campaignRepository = new HttpCampaignRepository("/api");
const campaignBudgetRepository = new HttpCampaignBudgetRepository("/api");

export const campaignApplication = {
  // 두 Use Case는 같은 Port 구현을 주입받지만 HTTP 구현 자체에는 의존하지 않는다.
  loadCampaignSettings: new LoadCampaignSettings(
    campaignRepository,
    campaignBudgetRepository,
  ),
  changeDailyBudget: new ChangeCampaignDailyBudget(
    campaignRepository,
    campaignBudgetRepository,
  ),
};
```

코드 해설

- `Domain`과 `Application`은 `HttpCampaignRepository`를 직접 생성하지 않는다. 가장 바깥의 Composition Root가 Port 구현체를 주입한다.
- 테스트에서는 같은 자리에 메모리 Repository를 넣을 수 있다. Use Case와 도메인 규칙은 바뀌지 않는다.
- React Context나 전역 DI 컨테이너는 선택 사항이다. 중요한 것은 객체 생성 위치가 아니라 안쪽 계층이 구체 기술을 모르는 것이다.

같은 조립을 함수형으로 표현하면 클래스 인스턴스 대신 **함수 레코드 Port**와 **Use Case 팩터리**를 연결한다. 의존성 방향은 OOP 예제와 동일하다.

```ts
// campaign/composition-root.functional.ts
// Adapter 팩터리가 함수 레코드 형태의 Port 구현을 만든다.
const campaignRepository = createHttpCampaignRepository({ baseUrl: "/api" });
const campaignBudgetRepository = createHttpCampaignBudgetRepository({
  baseUrl: "/api",
});

export const functionalCampaignApplication = {
  // Use Case 팩터리는 의존성을 한 번 받고 실제 실행 함수를 반환한다.
  changeDailyBudget: createChangeCampaignDailyBudget({
    campaigns: campaignRepository,
    budgets: campaignBudgetRepository,
  }),
};
```

함수형 Composition Root에서도 구체 HTTP 구현은 바깥에서만 선택한다. 차이는 `new`와 생성자 주입 대신 팩터리 함수와 클로저로 조립한다는 점이다.

## 3. Application Port와 외부 Adapter

### 3.1 Repository Port로 유스케이스 보호하기

목적 : 캠페인을 불러오고 저장하는 기술적 절차와 캠페인을 변경하는 업무 절차를 분리한다.

상세 로직

1. 판단 기준 및 적용 조건
  - Repository는 Aggregate 단위로 읽고 저장하며, 화면별 DTO나 React Query 캐시를 반환하지 않는다.
  - 앞 장의 `Campaign`과 공유 가능한 `CampaignBudget`은 서로 다른 Aggregate Root이므로 Repository도 둘로 나눈다.
  - Port는 이를 사용하는 `Application` 쪽에 둔다. 서버 응답 모양이 아니라 Use Case가 필요한 최소 기능을 표현해야 한다.

2. 실행 절차 및 구현 규칙
  - Use Case는 Campaign에서 `budgetId`를 찾고 CampaignBudget을 복원한 뒤 `changeDailyLimit()`을 호출한다.
  - 대상 부재는 `CampaignNotFound`, `CampaignBudgetNotFound`처럼 업무 의미가 있는 오류로 반환한다.

```ts
// campaign/application/ports/campaign-repositories.ts
import type {
  Campaign,
  CampaignBudget,
  CampaignBudgetId,
  CampaignId,
} from "../../domain/campaign";

export interface CampaignRepository {
  // API endpoint가 아니라 Use Case가 필요한 도메인 단위의 연산을 표현한다.
  findById(id: CampaignId): Promise<Campaign | null>;
  save(campaign: Campaign): Promise<void>;
}

export interface CampaignBudgetRepository {
  findById(id: CampaignBudgetId): Promise<CampaignBudget | null>;
  save(budget: CampaignBudget): Promise<void>;
}

// campaign/application/use-cases/change-campaign-daily-budget.ts
export type ChangeCampaignDailyBudgetCommand = {
  campaignId: CampaignId;
  dailyBudgetWon: number;
};

export class ChangeCampaignDailyBudget {
  constructor(
    private readonly campaigns: CampaignRepository,
    private readonly budgets: CampaignBudgetRepository,
  ) {}

  async execute(command: ChangeCampaignDailyBudgetCommand): Promise<void> {
    // React에 노출하지 않고 Application이 두 Aggregate의 조회 순서를 조정한다.
    const campaign = await this.campaigns.findById(command.campaignId);
    if (!campaign) throw new CampaignNotFound(command.campaignId);

    const budget = await this.budgets.findById(campaign.budgetId);
    if (!budget) throw new CampaignBudgetNotFound(campaign.budgetId);

    // 원시 입력을 Value Object로 바꾼 뒤 Aggregate Root의 행위를 호출한다.
    budget.changeDailyLimit(Money.won(command.dailyBudgetWon));
    await this.budgets.save(budget);
  }
}
```

코드 해설

- `ChangeCampaignDailyBudgetCommand`는 UI 상태가 아니라 Use Case의 입력 계약이다. input 이벤트 객체는 경계를 넘지 않는다.
- Campaign이 객체 참조 대신 `budgetId`만 가지므로 Application이 두 Repository를 조정한다. React 컴포넌트에는 이 순서를 노출하지 않는다.
- 변경된 Aggregate Root인 CampaignBudget만 저장한다. 게시 시 최소 `10,000 KRW`인지 여부는 앞 장의 `CampaignPublicationPolicy`가 별도로 판정한다.

함수형 구현에서는 Port를 메서드가 담긴 읽기 전용 레코드로 정의하고, Domain 변경 함수가 기존 값을 바꾸지 않고 새 값을 반환하게 한다.

```ts
// campaign/application/ports/campaign-repositories.functional.ts
// 함수형 Domain은 class Entity 대신 불변 상태 값을 사용한다.
export type CampaignState = Readonly<{
  id: CampaignId;
  name: string;
  budgetId: CampaignBudgetId;
  status: CampaignStatus;
}>;

export type CampaignBudgetState = Readonly<{
  id: CampaignBudgetId;
  dailyLimit: Money;
}>;

export type CampaignRepository = Readonly<{
  findById: (id: CampaignId) => Promise<CampaignState | null>;
  save: (campaign: CampaignState) => Promise<void>;
}>;

export type CampaignBudgetRepository = Readonly<{
  findById: (id: CampaignBudgetId) => Promise<CampaignBudgetState | null>;
  save: (budget: CampaignBudgetState) => Promise<void>;
}>;

type ChangeBudgetError =
  | { type: "CAMPAIGN_NOT_FOUND"; campaignId: CampaignId }
  | { type: "BUDGET_NOT_FOUND"; budgetId: CampaignBudgetId }
  | { type: "INVALID_DAILY_LIMIT" };

type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// Domain 함수: 입력 Aggregate를 수정하지 않고 변경된 복사본을 반환한다.
const changeDailyLimit = (
  budget: CampaignBudgetState,
  dailyLimit: Money,
): Result<CampaignBudgetState, ChangeBudgetError> =>
  dailyLimit.amount < 0
    ? { ok: false, error: { type: "INVALID_DAILY_LIMIT" } }
    : { ok: true, value: { ...budget, dailyLimit } };

// Application 팩터리: Port를 받아 명령 실행 함수를 반환한다.
export const createChangeCampaignDailyBudget = (dependencies: {
  campaigns: CampaignRepository;
  budgets: CampaignBudgetRepository;
}) => async (
  command: ChangeCampaignDailyBudgetCommand,
): Promise<Result<void, ChangeBudgetError>> => {
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

  const changed = changeDailyLimit(
    budget,
    Money.won(command.dailyBudgetWon),
  );
  if (!changed.ok) return changed;

  await dependencies.budgets.save(changed.value);
  return { ok: true, value: undefined };
};
```

OOP 예제의 예외는 함수형 예제에서 `Result`의 실패 값이 된다. 호출자는 `ok`를 확인해야 하므로 예상 가능한 업무 실패가 함수 시그니처에 드러난다.

### 3.2 DTO와 Mapper로 통신 표현 격리하기

목적 : `snake_case`, 숫자 단위, nullable 필드처럼 외부 API에 종속된 표현이 도메인 모델로 번지는 것을 막는다.

상세 로직

1. 판단 기준 및 적용 조건
  - DTO는 통신 계약이고 Domain Entity는 행동과 불변식을 가진 업무 모델이므로 같은 타입으로 재사용하지 않는다.
  - Mapper는 필드 이름, `null`, 통화 단위, enum 차이를 한 곳에서 변환하고 알 수 없는 값은 조용히 기본값으로 바꾸지 않는다.

2. 실행 절차 및 구현 규칙
  - 수신 DTO는 Mapper에서 `Campaign.restore`와 `CampaignBudget.restore`에 필요한 값으로 변환한다.
  - 송신 DTO는 Entity 전체가 아니라 해당 API가 허용한 변경 필드만 명시적으로 만든다.

**AS-IS — DTO 직접 사용:** 컴포넌트와 업무 코드가 `budget_id`, `daily_limit_won` 같은 서버 필드에 직접 의존한다.

**TO-BE — Mapper 적용:** 외부 표현은 HTTP Adapter에서 Domain Model로 변환하고, 내부 계층에는 노출하지 않는다.

```ts
// campaign/adapters/http-repositories.ts
type CampaignDto = {
  // DTO는 서버의 snake_case와 원시값 표현을 그대로 기술한다.
  id: string;
  name: string;
  budget_id: string;
  status: "DRAFT" | "UNDER_REVIEW" | "PUBLISHED" | "PAUSED";
};

type CampaignBudgetDto = {
  id: string;
  daily_limit_won: number;
};

const CampaignMapper = {
  toDomain(dto: CampaignDto): Campaign {
    // 수신 DTO를 유효한 Domain Entity 복원 인자로 번역한다.
    return Campaign.restore({
      id: dto.id,
      name: dto.name,
      budgetId: dto.budget_id,
      status: dto.status,
    });
  },

  toDto(campaign: Campaign): CampaignDto {
    // Domain Entity를 외부 계약에 맞는 전송 형식으로 번역한다.
    return {
      id: campaign.id,
      name: campaign.name,
      budget_id: campaign.budgetId,
      status: campaign.status,
    };
  },
};

const CampaignBudgetMapper = {
  toDomain(dto: CampaignBudgetDto): CampaignBudget {
    return CampaignBudget.restore({
      id: dto.id,
      dailyLimit: Money.won(dto.daily_limit_won),
    });
  },

  toDto(budget: CampaignBudget): CampaignBudgetDto {
    return {
      id: budget.id,
      daily_limit_won: budget.dailyLimit.amount,
    };
  },
};

export class HttpCampaignRepository implements CampaignRepository {
  constructor(private readonly baseUrl: string) {}

  async findById(id: CampaignId): Promise<Campaign | null> {
    // HTTP 상태 처리는 Adapter가 맡고 성공 응답만 Domain으로 변환한다.
    const response = await fetch(`${this.baseUrl}/campaigns/${id}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new CampaignTransportError(response.status);
    return CampaignMapper.toDomain(await response.json() as CampaignDto);
  }

  async save(campaign: Campaign): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/campaigns/${campaign.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(CampaignMapper.toDto(campaign)),
      },
    );
    if (!response.ok) throw new CampaignTransportError(response.status);
  }
}

export class HttpCampaignBudgetRepository
  implements CampaignBudgetRepository {
  constructor(private readonly baseUrl: string) {}

  async findById(id: CampaignBudgetId): Promise<CampaignBudget | null> {
    const response = await fetch(`${this.baseUrl}/campaign-budgets/${id}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new CampaignTransportError(response.status);
    return CampaignBudgetMapper.toDomain(
      await response.json() as CampaignBudgetDto,
    );
  }

  async save(budget: CampaignBudget): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/campaign-budgets/${budget.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(CampaignBudgetMapper.toDto(budget)),
      },
    );
    if (!response.ok) throw new CampaignTransportError(response.status);
  }
}
```

코드 해설

- DTO가 바뀌면 Mapper와 HTTP Adapter만 수정한다. Domain과 Use Case는 외부 필드명을 모른다.
- `restore`는 저장된 상태를 재구성하는 진입점이고, 새 캠페인을 만드는 `create`와 목적이 다르다.
- 예제의 `/api`는 자체 Backend for Frontend다. Google Ads 토큰과 developer token을 브라우저에 두지 않고 서버 Adapter에서 관리한다.

Mapper는 이미 입력을 출력으로 바꾸는 함수에 가깝다. 함수형 Adapter는 여기에 클래스 대신 객체 리터럴을 반환하는 팩터리를 사용한다.

```ts
// campaign/adapters/http-repositories.functional.ts
const toCampaignState = (dto: CampaignDto): CampaignState => Object.freeze({
  id: CampaignId.from(dto.id),
  name: dto.name,
  budgetId: CampaignBudgetId.from(dto.budget_id),
  status: dto.status,
});

const toCampaignDto = (campaign: CampaignState): CampaignDto => ({
  id: campaign.id,
  name: campaign.name,
  budget_id: campaign.budgetId,
  status: campaign.status,
});

export const createHttpCampaignRepository = (options: {
  baseUrl: string;
  fetcher?: typeof fetch;
}): CampaignRepository => {
  // fetch도 주입하면 Adapter 계약 테스트에서 네트워크 없이 교체할 수 있다.
  const fetcher = options.fetcher ?? fetch;

  return {
    findById: async (id) => {
      const response = await fetcher(`${options.baseUrl}/campaigns/${id}`);
      if (response.status === 404) return null;
      if (!response.ok) throw new CampaignTransportError(response.status);
      return toCampaignState(await response.json() as CampaignDto);
    },

    save: async (campaign) => {
      const response = await fetcher(
        `${options.baseUrl}/campaigns/${campaign.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(toCampaignDto(campaign)),
        },
      );
      if (!response.ok) throw new CampaignTransportError(response.status);
    },
  };
};
```

`CampaignRepository`라는 Port 계약은 그대로 유지되므로 Application은 이 구현이 클래스인지 객체 리터럴인지 알 필요가 없다.

## 4. React를 입력 Adapter로 사용하기

### 4.1 React Query는 서버 상태 수명주기만 관리하기

목적 : 캐시와 재요청은 React Query에 맡기되, 업무 변경 규칙과 저장 절차는 Use Case에 유지한다.

상세 로직

1. 판단 기준 및 적용 조건
  - Query key, stale time, loading/error 상태, invalidation은 UI Adapter의 관심사다.
  - Query 함수가 여러 API를 조합하거나 Entity 상태를 직접 변경하기 시작하면 Application Use Case로 이동시킨다.

2. 실행 절차 및 구현 규칙
  - Query는 조회 Use Case를 호출하고 Mutation은 명령 Use Case를 호출한다.
  - 성공 후에는 Entity를 수동으로 부분 병합하기보다 관련 key를 무효화해 서버의 확정 상태를 다시 읽는다.

```tsx
// campaign/ui/queries/use-campaign.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const campaignKeys = {
  // 캐시 식별 규칙은 UI Adapter의 관심사로 유지한다.
  all: ["campaigns"] as const,
  detail: (id: string) => [...campaignKeys.all, "detail", id] as const,
};

export function useCampaignSettings(campaignId: CampaignId) {
  return useQuery({
    queryKey: campaignKeys.detail(campaignId),
    queryFn: () =>
      campaignApplication.loadCampaignSettings.execute({ campaignId }),
  });
}

export function useChangeCampaignDailyBudget(campaignId: CampaignId) {
  const queryClient = useQueryClient();

  return useMutation({
    // Mutation은 API를 직접 호출하지 않고 명령 Use Case에 위임한다.
    mutationFn: (command: ChangeCampaignDailyBudgetCommand) =>
      campaignApplication.changeDailyBudget.execute(command),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: campaignKeys.detail(campaignId),
      }),
  });
}
```

코드 해설

- React Query는 `Campaign` 규칙을 구현하지 않는다. Use Case 실행 시점과 결과의 캐시 수명만 제어한다.
- key 생성 함수를 한 곳에 두면 상세, 목록, 통계 캐시를 잘못 무효화하는 실수를 줄일 수 있다.
- 낙관적 업데이트가 필요하면 되돌리기 가능한 UI 표현에만 적용하고, 게시처럼 외부 효과가 큰 명령은 서버 응답 후 확정한다.

React Hook 자체는 이미 함수이므로 Hook 전체를 함수형 버전으로 복제할 필요는 없다. 함수형 Application을 주입했다면 Mutation 경계에서 `Result`만 UI 오류로 번역한다.

```tsx
const mutation = useMutation({
  mutationFn: async (command: ChangeCampaignDailyBudgetCommand) => {
    const result =
      await functionalCampaignApplication.changeDailyBudget(command);

    // Domain/Application 오류를 React Query가 처리할 UI 오류로 변환한다.
    if (!result.ok) throw toUiError(result.error);
  },
});
```

React Query의 캐시 책임은 변하지 않는다. OOP에서는 `useCase.execute(command)`, 함수형에서는 `useCase(command)`를 호출한다는 표현 차이만 있다.

### 4.2 React Hook Form과 Zod의 검증 책임 제한하기

목적 : 빠른 입력 피드백과 영속적인 도메인 불변식을 중복된 하나의 규칙처럼 취급하지 않는다.

상세 로직

1. 판단 기준 및 적용 조건
  - React Hook Form은 입력값과 touched/error 상태를, Zod는 빈 문자열·숫자 형식·필수 입력 같은 폼 경계의 구조를 검증한다.
  - 예산 정책이나 게시 가능 조건은 우회할 수 없는 Domain에 둔다. Zod에 같은 검사를 추가하더라도 UX를 위한 복제이며 Domain 검증을 제거하지 않는다.

2. 실행 절차 및 구현 규칙
  - 폼 값을 그대로 Entity로 캐스팅하지 말고 명시적인 `toCommand` 함수로 Application 입력에 변환한다.
  - Domain 오류는 필드 오류 또는 폼 상단 오류로 번역하되, Domain이 React Hook Form의 오류 형식을 반환하게 만들지 않는다.

```tsx
// campaign/ui/campaign-settings-form.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const dailyBudgetSchema = z.object({
  // 폼 경계에서는 입력 가능한 숫자 형식만 빠르게 확인한다.
  dailyBudgetWon: z.coerce.number().int().min(0),
});

type DailyBudgetValues = z.infer<typeof dailyBudgetSchema>;

const toCommand = (
  campaignId: CampaignId,
  values: DailyBudgetValues,
): ChangeCampaignDailyBudgetCommand => (
  // UI 필드 이름을 Application의 명령 계약으로 명시적으로 변환한다.
  { campaignId, ...values }
);

export function CampaignBudgetForm(props: {
  campaign: Campaign;
  budget: CampaignBudget;
}) {
  const changeBudget = useChangeCampaignDailyBudget(props.campaign.id);
  const form = useForm<DailyBudgetValues>({
    resolver: zodResolver(dailyBudgetSchema),
    defaultValues: {
      dailyBudgetWon: props.budget.dailyLimit.amount,
    },
  });

  const submit = form.handleSubmit(async (values) => {
    try {
      // React는 업무 규칙을 재구현하지 않고 Use Case를 호출한다.
      await changeBudget.mutateAsync(toCommand(props.campaign.id, values));
    } catch (error) {
      form.setError("root", { message: toUserMessage(error) });
    }
  });

  return <form onSubmit={submit}>{/* 각 input과 오류 메시지 */}</form>;
}
```

코드 해설

- Zod 통과는 “입력 형태가 명령으로 변환 가능하다”는 뜻이지 “캠페인을 게시할 수 있다”는 뜻이 아니다.
- Zod에서는 `0` 이상의 정수인지만 검사한다. 게시 최소값 `10,000 KRW`는 Draft 저장 가능 여부와 다른 규칙이므로 `CampaignPublicationPolicy`에 남긴다.
- `toCommand`가 UI와 Application 사이의 작은 Anti-Corruption Layer 역할을 하므로 폼 필드가 바뀌어도 Use Case 계약을 보호할 수 있다.
- 서버 응답으로 CampaignBudget이 갱신되면 `reset` 여부를 명시적으로 결정한다. 렌더링 때마다 `defaultValues`를 덮어쓰면 사용자가 편집 중인 값이 사라질 수 있다.
