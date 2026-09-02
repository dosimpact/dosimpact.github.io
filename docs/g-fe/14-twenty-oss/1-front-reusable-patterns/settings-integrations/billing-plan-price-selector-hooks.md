# Billing Plan/Price Selector Hooks

Billing plan payload를 한 번 조회하고, plan key, price id, interval 같은 caller-friendly selector hook으로 좁혀 쓰는 패턴이다.

핵심은 `Fetch the catalog once, expose small lookup hooks`다.

## 1. 모듈 코드

- `src/modules/settings/billing/hooks/usePlans.ts`: `listPlans` query 결과를 loaded guard와 throwing accessor로 감싼다.
- `src/modules/settings/billing/hooks/usePlanByPlanKey.ts`: plan key로 plan을 찾는 selector hook을 제공한다.
- `src/modules/settings/billing/hooks/useAllBillingPrices.ts`: base/resource-credit/metered products의 prices를 하나의 flat list로 합친다.
- `src/modules/settings/billing/hooks/usePriceAndBillingUsageByPriceId.ts`: Stripe price id로 licensed/metered price와 usage type을 함께 찾는다.
- `src/modules/settings/billing/hooks/useBaseLicensedPriceByPlanKeyAndInterval.ts`: plan key와 interval로 base licensed price를 고른다.

```tsx
// 큰 흐름: Billing plan payload를 한 번 조회하고, plan key, price id, interval 같은 caller-friendly selector hook으로 좁혀 쓰는 패턴이다.
// 핵심 기준: `Fetch the catalog once, expose small lookup hooks`다.

// filepath: src/modules/settings/billing/hooks/usePlans.ts
import { useQuery } from '@apollo/client/react';
import { ListPlansDocument } from '~/generated-metadata/graphql';
import { isDefined } from 'twenty-shared/utils';

type UsePlansOptions = {
  skip?: boolean;
};

export const usePlans = (options?: UsePlansOptions) => {
  const { data, loading, error, refetch } = useQuery(ListPlansDocument, {
    skip: options?.skip,
  });

  const isPlansLoaded = isDefined(data?.listPlans);

  const listPlans = () => {
    if (!data) throw new Error('plans is undefined');
    return data.listPlans;
  };

  return { loading, error, isPlansLoaded, listPlans, refetch };
};

// filepath: src/modules/settings/billing/hooks/usePlanByPlanKey.ts
import { type BillingPlanKey } from '~/generated-metadata/graphql';
import { findOrThrow } from 'twenty-shared/utils';
import { usePlans } from './usePlans';

export const usePlanByPlanKey = () => {
  const { listPlans } = usePlans();

  const getPlanByPlanKey = (planKey: BillingPlanKey) =>
    findOrThrow(
      listPlans(),
      (plan) => plan.planKey === planKey,
      new Error(`Plan ${planKey} not found`),
    );

  return { getPlanByPlanKey };
};

// filepath: src/modules/settings/billing/hooks/useAllBillingPrices.ts
import { usePlans } from '@/settings/billing/hooks/usePlans';
import {
  type BillingPriceLicensed,
  type BillingPriceMetered,
} from '~/generated-metadata/graphql';

export const useAllBillingPrices = () => {
  const { listPlans } = usePlans();

  const allBillingPrices = listPlans()
    .map(({ baseProducts, resourceCreditProducts, meteredProducts }) => {
      return [
        ...baseProducts,
        ...resourceCreditProducts,
        ...meteredProducts,
      ].map(({ prices }) => prices);
    })
    .flat(2) as Array<BillingPriceLicensed | BillingPriceMetered>;

  return { allBillingPrices };
};

// filepath: src/modules/settings/billing/hooks/usePriceAndBillingUsageByPriceId.ts
import { isDefined } from 'twenty-shared/utils';
import {
  type BillingPriceLicensed,
  type BillingPriceMetered,
  BillingUsageType,
} from '~/generated-metadata/graphql';
import { useAllBillingPrices } from './useAllBillingPrices';

export const usePriceAndBillingUsageByPriceId = () => {
  const { allBillingPrices } = useAllBillingPrices();

  const getPriceAndBillingUsageByPriceId = (
    priceId: string,
  ):
    | { price: BillingPriceLicensed; billingUsage: BillingUsageType.LICENSED }
    | { price: BillingPriceMetered; billingUsage: BillingUsageType.METERED } => {
    const licensed = allBillingPrices.find(
      (price) =>
        price.priceUsageType === BillingUsageType.LICENSED &&
        price.stripePriceId === priceId,
    ) as BillingPriceLicensed | undefined;

    if (isDefined(licensed)) {
      return { price: licensed, billingUsage: BillingUsageType.LICENSED };
    }

    const metered = allBillingPrices.find(
      (price) =>
        price.priceUsageType === BillingUsageType.METERED &&
        price.stripePriceId === priceId,
    ) as BillingPriceMetered | undefined;

    if (isDefined(metered)) {
      return { price: metered, billingUsage: BillingUsageType.METERED };
    }

    throw new Error('Price not found');
  };

  return { getPriceAndBillingUsageByPriceId };
};

// filepath: src/modules/settings/billing/hooks/useBaseLicensedPriceByPlanKeyAndInterval.ts
import {
  type SubscriptionInterval,
  type BillingPlanKey,
} from '~/generated-metadata/graphql';
import { findOrThrow } from 'twenty-shared/utils';
import { useBaseProductByPlanKey } from '@/settings/billing/hooks/useBaseProductByPlanKey';

export const useBaseLicensedPriceByPlanKeyAndInterval = () => {
  const { getBaseProductByPlanKey } = useBaseProductByPlanKey();

  const getBaseLicensedPriceByPlanKeyAndInterval = (
    planKey: BillingPlanKey,
    interval: SubscriptionInterval,
  ) => {
    const baseProduct = getBaseProductByPlanKey(planKey);

    if (!baseProduct.prices) throw new Error('Product prices is undefined.');

    return findOrThrow(
      baseProduct.prices,
      (price) => price.recurringInterval === interval,
      new Error('Base licensed price not found'),
    );
  };

  return { getBaseLicensedPriceByPlanKeyAndInterval };
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Billing Plan/Price Selector Hooks 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/settings/billing/components/SettingsBillingPlansContent.tsx
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { SettingsBillingPlansWithSubscription } from '@/settings/billing/components/internal/SettingsBillingPlansWithSubscription';
import { SettingsBillingPlansWithoutSubscription } from '@/settings/billing/components/internal/SettingsBillingPlansWithoutSubscription';
import { useFormatPrices } from '@/settings/billing/hooks/useFormatPrices';
import { type SettingsBillingPlanInterval } from '@/settings/billing/types/settingsBillingPlanComparison.type';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useState } from 'react';
import { isDefined } from 'twenty-shared/utils';
import {
  BillingPlanKey,
  SubscriptionInterval,
} from '~/generated-metadata/graphql';

const parseCurrentPlanKey = (plan: unknown): BillingPlanKey | undefined => {
  if (plan === BillingPlanKey.PRO || plan === BillingPlanKey.ENTERPRISE) {
    return plan;
  }

  return undefined;
};

export const SettingsBillingPlansContent = () => {
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);
  const { formatPrices: planPrices } = useFormatPrices();
  const [billingInterval, setBillingInterval] =
    useState<SettingsBillingPlanInterval>(SubscriptionInterval.Year);

  const currentPlanKey = parseCurrentPlanKey(
    currentWorkspace?.currentBillingSubscription?.metadata?.['plan'],
  );

  if (
    !isDefined(currentPlanKey) ||
    !isDefined(currentWorkspace?.currentBillingSubscription)
  ) {
    return (
      <SettingsBillingPlansWithoutSubscription
        billingInterval={billingInterval}
        onBillingIntervalChange={setBillingInterval}
        planPrices={planPrices}
      />
    );
  }

  return (
    <SettingsBillingPlansWithSubscription
      billingInterval={billingInterval}
      currentPlanKey={currentPlanKey}
      onBillingIntervalChange={setBillingInterval}
      planPrices={planPrices}
    />
  );
};
```
