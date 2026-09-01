# Focus Stack Push/Remove

Focus 대상이 되는 UI를 stack top으로 올리고, 닫힐 때 `focusId` 또는 component type으로 제거하는 패턴.

핵심은 `focusId`가 같은 item은 중복 push하지 않고 stack top으로 이동시키는 것이다.

## 1. 모듈 코드

- `src/modules/ui/utilities/focus/states/focusStackState.ts`: 현재 focus 가능한 UI item stack을 저장한다.
- `src/modules/ui/utilities/focus/hooks/usePushFocusItemToFocusStack.ts`: focus item을 stack top으로 추가하거나 이동한다.
- `src/modules/ui/utilities/focus/hooks/useRemoveFocusItemFromFocusStackById.ts`: 특정 `focusId` item을 제거한다.
- `src/modules/ui/utilities/focus/hooks/useRemoveFocusItemFromFocusStackByComponentType.ts`: 특정 component type의 마지막 item을 제거한다.

```tsx
// filepath: src/modules/ui/utilities/focus/states/focusStackState.ts
import { type FocusStackItem } from '@/ui/utilities/focus/types/FocusStackItem';
import { createAtomState } from '@/ui/utilities/state/jotai/utils/createAtomState';

export const focusStackState = createAtomState<FocusStackItem[]>({
  key: 'focusStackState',
  defaultValue: [],
});

// filepath: src/modules/ui/utilities/focus/hooks/usePushFocusItemToFocusStack.ts
const addOrMoveItemToTheTopOfTheStack = ({
  focusStackItem,
  currentFocusStack,
}: {
  focusStackItem: FocusStackItem;
  currentFocusStack: FocusStackItem[];
}) => [
  ...currentFocusStack.filter(
    (currentFocusStackItem) =>
      currentFocusStackItem.focusId !== focusStackItem.focusId,
  ),
  focusStackItem,
];

export const usePushFocusItemToFocusStack = () => {
  const store = useStore();

  const pushFocusItemToFocusStack = useCallback(
    ({
      focusId,
      component,
      globalHotkeysConfig,
    }: {
      focusId: string;
      component: {
        type: FocusComponentType;
        instanceId: string;
      };
      globalHotkeysConfig?: Partial<GlobalHotkeysConfig>;
    }) => {
      const focusStackItem: FocusStackItem = {
        focusId,
        componentInstance: {
          componentType: component.type,
          componentInstanceId: component.instanceId,
        },
        globalHotkeysConfig: {
          enableGlobalHotkeysWithModifiers:
            globalHotkeysConfig?.enableGlobalHotkeysWithModifiers ?? true,
          enableGlobalHotkeysConflictingWithKeyboard:
            globalHotkeysConfig?.enableGlobalHotkeysConflictingWithKeyboard ??
            true,
        },
      };

      const currentFocusStack = store.get(focusStackState.atom);

      store.set(
        focusStackState.atom,
        addOrMoveItemToTheTopOfTheStack({
          focusStackItem,
          currentFocusStack,
        }),
      );
    },
    [store],
  );

  return { pushFocusItemToFocusStack };
};

// filepath: src/modules/ui/utilities/focus/hooks/useRemoveFocusItemFromFocusStackById.ts
export const useRemoveFocusItemFromFocusStackById = () => {
  const store = useStore();

  const removeFocusItemFromFocusStackById = useCallback(
    ({ focusId }: { focusId: string }) => {
      const focusStack = store.get(focusStackState.atom);

      const removedFocusItem = focusStack.find(
        (focusStackItem) => focusStackItem.focusId === focusId,
      );

      if (!removedFocusItem) {
        return;
      }

      store.set(
        focusStackState.atom,
        focusStack.filter((focusStackItem) => focusStackItem.focusId !== focusId),
      );
    },
    [store],
  );

  return { removeFocusItemFromFocusStackById };
};

// filepath: src/modules/ui/utilities/focus/hooks/useRemoveFocusItemFromFocusStackByComponentType.ts
export const useRemoveLastFocusItemFromFocusStackByComponentType = () => {
  const store = useStore();

  const removeLastFocusItemFromFocusStackByComponentType = useCallback(
    ({ componentType }: { componentType: FocusComponentType }) => {
      const focusStack = store.get(focusStackState.atom);

      const lastMatchingIndex = focusStack.findLastIndex(
        (focusStackItem) =>
          focusStackItem.componentInstance.componentType === componentType,
      );

      if (lastMatchingIndex === -1) {
        return;
      }

      store.set(
        focusStackState.atom,
        focusStack.filter((_, index) => index !== lastMatchingIndex),
      );
    },
    [store],
  );

  return { removeLastFocusItemFromFocusStackByComponentType };
};
```

## 2. 사용 예제

```tsx
// filepath: src/modules/ui/layout/modal/hooks/useModal.tsx
const openModal = useCallback(
  (modalInstanceId: string) => {
    const scopedModalInstanceId = resolveComponentInstanceId(modalInstanceId);

    store.set(
      isModalOpenedComponentState.atomFamily({
        instanceId: scopedModalInstanceId,
      }),
      true,
    );

    pushFocusItemToFocusStack({
      focusId: scopedModalInstanceId,
      component: {
        type: FocusComponentType.MODAL,
        instanceId: scopedModalInstanceId,
      },
      globalHotkeysConfig: {
        enableGlobalHotkeysWithModifiers: false,
        enableGlobalHotkeysConflictingWithKeyboard: false,
      },
    });
  },
  [store, pushFocusItemToFocusStack, resolveComponentInstanceId],
);

const closeModal = useCallback(
  (modalInstanceId: string) => {
    const scopedModalInstanceId = resolveComponentInstanceId(modalInstanceId);

    removeFocusItemFromFocusStackById({
      focusId: scopedModalInstanceId,
    });

    store.set(
      isModalOpenedComponentState.atomFamily({
        instanceId: scopedModalInstanceId,
      }),
      false,
    );
  },
  [store, removeFocusItemFromFocusStackById, resolveComponentInstanceId],
);
```
