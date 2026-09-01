# Instance-scoped Dropdown

`dropdownId`를 component instance id로 삼아 dropdown open state, focus stack, active dropdown focus를 분리하는 패턴이다.

핵심은 `anchor and content share an instance id`다.

## 1. 모듈 코드

- `src/modules/ui/layout/dropdown/contexts/DropdownComponentInstanceContext.ts`: dropdown subtree에서 현재 dropdown instance id를 공유한다.
- `src/modules/ui/layout/dropdown/states/isDropdownOpenComponentState.ts`: dropdown open 여부를 instance-scoped atom state로 정의한다.
- `src/modules/ui/layout/dropdown/hooks/useOpenDropdown.ts`: context 또는 props의 dropdown id로 특정 dropdown을 연다.
- `src/modules/ui/layout/dropdown/hooks/useCloseDropdown.ts`: context 또는 props의 dropdown id로 특정 dropdown을 닫는다.

```tsx
// filepath: src/modules/ui/layout/dropdown/contexts/DropdownComponentInstanceContext.ts
import { createComponentInstanceContext } from '@/ui/utilities/state/component-state/utils/createComponentInstanceContext';

export const DropdownComponentInstanceContext =
  createComponentInstanceContext();

// filepath: src/modules/ui/layout/dropdown/states/isDropdownOpenComponentState.ts
import { DropdownComponentInstanceContext } from '@/ui/layout/dropdown/contexts/DropdownComponentInstanceContext';
import { createAtomComponentState } from '@/ui/utilities/state/jotai/utils/createAtomComponentState';

export const isDropdownOpenComponentState = createAtomComponentState<boolean>({
  key: 'isDropdownOpenComponentState',
  defaultValue: false,
  componentInstanceContext: DropdownComponentInstanceContext,
});

// filepath: src/modules/ui/layout/dropdown/hooks/useOpenDropdown.ts
import { DropdownComponentInstanceContext } from '@/ui/layout/dropdown/contexts/DropdownComponentInstanceContext';
import { useSetActiveDropdownFocusIdAndMemorizePrevious } from '@/ui/layout/dropdown/hooks/useSetFocusedDropdownIdAndMemorizePrevious';
import { isDropdownOpenComponentState } from '@/ui/layout/dropdown/states/isDropdownOpenComponentState';
import { useWorkspaceSurfaceScopedComponentInstanceIdResolver } from '@/ui/layout/hooks/useWorkspaceSurfaceScopedComponentInstanceId';
import { usePushFocusItemToFocusStack } from '@/ui/utilities/focus/hooks/usePushFocusItemToFocusStack';
import { FocusComponentType } from '@/ui/utilities/focus/types/FocusComponentType';
import { useAvailableComponentInstanceId } from '@/ui/utilities/state/component-state/hooks/useAvailableComponentInstanceId';
import { useStore } from 'jotai';
import { useCallback } from 'react';
import { isDefined } from 'twenty-shared/utils';

export const useOpenDropdown = () => {
  const store = useStore();
  const { pushFocusItemToFocusStack } = usePushFocusItemToFocusStack();
  const { setActiveDropdownFocusIdAndMemorizePrevious } =
    useSetActiveDropdownFocusIdAndMemorizePrevious();
  const resolveComponentInstanceId =
    useWorkspaceSurfaceScopedComponentInstanceIdResolver();
  const dropdownComponentInstanceIdFromContext =
    useAvailableComponentInstanceId(DropdownComponentInstanceContext);

  const openDropdown = useCallback(
    (dropdownComponentInstanceIdFromProps?: string) => {
      const rawDropdownComponentInstanceId =
        dropdownComponentInstanceIdFromProps ??
        dropdownComponentInstanceIdFromContext;

      if (!isDefined(rawDropdownComponentInstanceId)) {
        throw new Error('Dropdown component instance ID is not defined');
      }

      const dropdownComponentInstanceId = resolveComponentInstanceId(
        rawDropdownComponentInstanceId,
      );

      store.set(
        isDropdownOpenComponentState.atomFamily({
          instanceId: dropdownComponentInstanceId,
        }),
        true,
      );

      setActiveDropdownFocusIdAndMemorizePrevious(dropdownComponentInstanceId);
      pushFocusItemToFocusStack({
        focusId: dropdownComponentInstanceId,
        component: {
          type: FocusComponentType.DROPDOWN,
          instanceId: dropdownComponentInstanceId,
        },
      });
    },
    [
      dropdownComponentInstanceIdFromContext,
      pushFocusItemToFocusStack,
      resolveComponentInstanceId,
      setActiveDropdownFocusIdAndMemorizePrevious,
      store,
    ],
  );

  return { openDropdown };
};

// filepath: src/modules/ui/layout/dropdown/hooks/useCloseDropdown.ts
import { DropdownComponentInstanceContext } from '@/ui/layout/dropdown/contexts/DropdownComponentInstanceContext';
import { useGoBackToPreviousDropdownFocusId } from '@/ui/layout/dropdown/hooks/useGoBackToPreviousDropdownFocusId';
import { isDropdownOpenComponentState } from '@/ui/layout/dropdown/states/isDropdownOpenComponentState';
import { useWorkspaceSurfaceScopedComponentInstanceIdResolver } from '@/ui/layout/hooks/useWorkspaceSurfaceScopedComponentInstanceId';
import { useRemoveFocusItemFromFocusStackById } from '@/ui/utilities/focus/hooks/useRemoveFocusItemFromFocusStackById';
import { useAvailableComponentInstanceId } from '@/ui/utilities/state/component-state/hooks/useAvailableComponentInstanceId';
import { useStore } from 'jotai';
import { useCallback } from 'react';
import { isDefined } from 'twenty-shared/utils';

export const useCloseDropdown = () => {
  const store = useStore();
  const { goBackToPreviousDropdownFocusId } =
    useGoBackToPreviousDropdownFocusId();
  const { removeFocusItemFromFocusStackById } =
    useRemoveFocusItemFromFocusStackById();
  const resolveComponentInstanceId =
    useWorkspaceSurfaceScopedComponentInstanceIdResolver();
  const dropdownComponentInstanceIdFromContext =
    useAvailableComponentInstanceId(DropdownComponentInstanceContext);

  const closeDropdown = useCallback(
    (dropdownComponentInstanceIdFromProps?: string) => {
      const rawDropdownComponentInstanceId =
        dropdownComponentInstanceIdFromProps ??
        dropdownComponentInstanceIdFromContext;

      if (!isDefined(rawDropdownComponentInstanceId)) {
        throw new Error('Dropdown component instance ID is not defined');
      }

      const dropdownComponentInstanceId = resolveComponentInstanceId(
        rawDropdownComponentInstanceId,
      );

      store.set(
        isDropdownOpenComponentState.atomFamily({
          instanceId: dropdownComponentInstanceId,
        }),
        false,
      );

      removeFocusItemFromFocusStackById({ focusId: dropdownComponentInstanceId });
      goBackToPreviousDropdownFocusId();
    },
    [
      dropdownComponentInstanceIdFromContext,
      goBackToPreviousDropdownFocusId,
      removeFocusItemFromFocusStackById,
      resolveComponentInstanceId,
      store,
    ],
  );

  return { closeDropdown };
};
```

## 2. 사용 예제

```tsx
import { DropdownComponentInstanceContext } from '@/ui/layout/dropdown/contexts/DropdownComponentInstanceContext';
import { useCloseDropdown } from '@/ui/layout/dropdown/hooks/useCloseDropdown';
import { useOpenDropdown } from '@/ui/layout/dropdown/hooks/useOpenDropdown';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { isDropdownOpenComponentState } from '@/ui/layout/dropdown/states/isDropdownOpenComponentState';

const DROPDOWN_ID = 'record-actions-dropdown';

export const RecordActionsDropdown = () => {
  const { openDropdown } = useOpenDropdown();
  const { closeDropdown } = useCloseDropdown();
  const isOpen = useAtomComponentStateValue(
    isDropdownOpenComponentState,
    DROPDOWN_ID,
  );

  return (
    <DropdownComponentInstanceContext.Provider value={{ instanceId: DROPDOWN_ID }}>
      <button onClick={() => openDropdown(DROPDOWN_ID)}>Actions</button>
      {isOpen ? (
        <DropdownContent>
          <button onClick={() => closeDropdown(DROPDOWN_ID)}>Close</button>
        </DropdownContent>
      ) : null}
    </DropdownComponentInstanceContext.Provider>
  );
};
```
