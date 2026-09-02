# Component Instance State

같은 atom state 정의를 여러 UI 인스턴스가 독립적으로 쓰도록 `instanceId`별 atom family로 분리하는 패턴이다.

핵심은 `one state definition, many isolated instances`다.

## 1. 모듈 코드

- `src/modules/ui/utilities/state/component-state/utils/createComponentInstanceContext.ts`: subtree에서 component instance id를 전달할 Context를 만든다.
- `src/modules/ui/utilities/state/component-state/hooks/useAvailableComponentInstanceIdOrThrow.ts`: props로 받은 id를 우선하고, 없으면 context id를 사용한다.
- `src/modules/ui/utilities/state/jotai/utils/createAtomComponentState.ts`: `instanceId`마다 별도 Jotai atom을 캐싱해서 반환한다.

```tsx
// 큰 흐름: 같은 atom state 정의를 여러 UI 인스턴스가 독립적으로 쓰도록 `instanceId`별 atom family로 분리하는 패턴이다.
// 핵심 기준: `one state definition, many isolated instances`다.

// filepath: src/modules/ui/utilities/state/component-state/utils/createComponentInstanceContext.ts
import { type ComponentInstanceStateContext } from '@/ui/utilities/state/component-state/types/ComponentInstanceStateContext';
import { type ComponentStateKey } from '@/ui/utilities/state/component-state/types/ComponentStateKey';
import { createContext } from 'react';

export const createComponentInstanceContext = <
  T extends ComponentStateKey = ComponentStateKey,
>(
  initialValue?: T,
) => {
  return createContext<T | null>(
    initialValue ?? null,
  ) as ComponentInstanceStateContext<T>;
};

// filepath: src/modules/ui/utilities/state/component-state/hooks/useAvailableComponentInstanceIdOrThrow.ts
import { useComponentInstanceStateContext } from '@/ui/utilities/state/component-state/hooks/useComponentInstanceStateContext';
import { type ComponentInstanceStateContext } from '@/ui/utilities/state/component-state/types/ComponentInstanceStateContext';
import { isNonEmptyString } from '@sniptt/guards';

export const useAvailableComponentInstanceIdOrThrow = <
  T extends { instanceId: string },
>(
  Context: ComponentInstanceStateContext<T>,
  instanceIdFromProps?: string,
): string => {
  const instanceStateContext = useComponentInstanceStateContext(Context);
  const instanceIdFromContext = instanceStateContext?.instanceId;

  if (isNonEmptyString(instanceIdFromProps)) {
    return instanceIdFromProps;
  } else if (isNonEmptyString(instanceIdFromContext)) {
    return instanceIdFromContext;
  } else {
    throw new Error(
      'Instance id is not provided and cannot be found in context.',
    );
  }
};

// filepath: src/modules/ui/utilities/state/jotai/utils/createAtomComponentState.ts
import { type ComponentInstanceStateContext } from '@/ui/utilities/state/component-state/types/ComponentInstanceStateContext';
import { type ComponentStateKey } from '@/ui/utilities/state/component-state/types/ComponentStateKey';
import { globalComponentInstanceContextMap } from '@/ui/utilities/state/component-state/utils/globalComponentInstanceContextMap';
import { type ComponentState } from '@/ui/utilities/state/jotai/types/ComponentState';
import { atom } from 'jotai';
import { isDefined } from 'twenty-shared/utils';

export const createAtomComponentState = <ValueType>({
  key,
  defaultValue,
  componentInstanceContext,
}: {
  key: string;
  defaultValue: ValueType;
  componentInstanceContext: ComponentInstanceStateContext<any> | null;
}): ComponentState<ValueType> => {
  if (isDefined(componentInstanceContext)) {
    globalComponentInstanceContextMap.set(key, componentInstanceContext);
  }

  const atomCache = new Map<
    string,
    ReturnType<ComponentState<ValueType>['atomFamily']>
  >();

  const familyFunction = ({
    instanceId,
  }: ComponentStateKey): ReturnType<
    ComponentState<ValueType>['atomFamily']
  > => {
    const existing = atomCache.get(instanceId);

    if (existing !== undefined) {
      return existing;
    }

    const baseAtom = atom(defaultValue);
    baseAtom.debugLabel = `${key}__${instanceId}`;
    atomCache.set(instanceId, baseAtom);

    return baseAtom;
  };

  return {
    type: 'ComponentState',
    key,
    atomFamily: familyFunction,
  };
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Component Instance State 패턴을 실제 호출부에서 조합한다.

import { createComponentInstanceContext } from '@/ui/utilities/state/component-state/utils/createComponentInstanceContext';
import { createAtomComponentState } from '@/ui/utilities/state/jotai/utils/createAtomComponentState';
import { useAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useAtomComponentState';

export const PanelComponentInstanceContext = createComponentInstanceContext();

export const panelIsOpenComponentState = createAtomComponentState<boolean>({
  key: 'panelIsOpenComponentState',
  defaultValue: false,
  componentInstanceContext: PanelComponentInstanceContext,
});

export const Panel = ({
  panelInstanceId,
}: {
  panelInstanceId: string;
}) => {
  return (
    <PanelComponentInstanceContext.Provider
      value={{ instanceId: panelInstanceId }}
    >
      <PanelContent />
    </PanelComponentInstanceContext.Provider>
  );
};

export const PanelContent = () => {
  const [isOpen, setIsOpen] = useAtomComponentState(panelIsOpenComponentState);

  return (
    <button onClick={() => setIsOpen(!isOpen)}>
      {isOpen ? 'Close' : 'Open'}
    </button>
  );
};
```
