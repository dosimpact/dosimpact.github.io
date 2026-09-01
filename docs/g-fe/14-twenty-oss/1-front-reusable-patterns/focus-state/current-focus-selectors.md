# Current Focus Selectors

Focus stack의 마지막 item을 현재 focus source로 보고, id/item/global hotkey config를 selector로 파생하는 패턴.

핵심은 UI들이 stack을 직접 읽지 않고 selector를 통해 top focus만 구독하는 것이다.

## 1. 모듈 코드

- `src/modules/ui/utilities/focus/states/currentFocusIdSelector.ts`: stack top의 `focusId`를 반환한다.
- `src/modules/ui/utilities/focus/states/currentFocusedItemSelector.ts`: stack top의 전체 focus item을 반환한다.
- `src/modules/ui/utilities/focus/states/currentGlobalHotkeysConfigSelector.ts`: stack top의 hotkey 정책을 반환하고 focus가 없으면 기본값을 쓴다.
- `src/modules/ui/utilities/focus/types/FocusStackItem.ts`: focus item의 공통 shape를 정의한다.

```tsx
// filepath: src/modules/ui/utilities/focus/types/FocusStackItem.ts
import { type FocusComponentInstance } from '@/ui/utilities/focus/types/FocusComponentInstance';
import { type GlobalHotkeysConfig } from '@/ui/utilities/hotkey/types/GlobalHotkeysConfig';

export type FocusStackItem = {
  focusId: string;
  componentInstance: FocusComponentInstance;
  globalHotkeysConfig: GlobalHotkeysConfig;
};

// filepath: src/modules/ui/utilities/focus/states/currentFocusIdSelector.ts
import { createAtomSelector } from '@/ui/utilities/state/jotai/utils/createAtomSelector';
import { focusStackState } from './focusStackState';

export const currentFocusIdSelector = createAtomSelector<string | undefined>({
  key: 'currentFocusIdSelector',
  get: ({ get }) => {
    const focusStack = get(focusStackState);

    return focusStack.at(-1)?.focusId;
  },
});

// filepath: src/modules/ui/utilities/focus/states/currentFocusedItemSelector.ts
import { type FocusStackItem } from '@/ui/utilities/focus/types/FocusStackItem';
import { createAtomSelector } from '@/ui/utilities/state/jotai/utils/createAtomSelector';
import { focusStackState } from './focusStackState';

export const currentFocusedItemSelector = createAtomSelector<
  FocusStackItem | undefined
>({
  key: 'currentFocusedItemSelector',
  get: ({ get }) => {
    const focusStack = get(focusStackState);

    return focusStack.at(-1);
  },
});

// filepath: src/modules/ui/utilities/focus/states/currentGlobalHotkeysConfigSelector.ts
import { focusStackState } from '@/ui/utilities/focus/states/focusStackState';
import { DEFAULT_GLOBAL_HOTKEYS_CONFIG } from '@/ui/utilities/hotkey/constants/DefaultGlobalHotkeysConfig';
import { type GlobalHotkeysConfig } from '@/ui/utilities/hotkey/types/GlobalHotkeysConfig';
import { createAtomSelector } from '@/ui/utilities/state/jotai/utils/createAtomSelector';
import { isDefined } from 'twenty-shared/utils';

export const currentGlobalHotkeysConfigSelector =
  createAtomSelector<GlobalHotkeysConfig>({
    key: 'currentGlobalHotkeysConfigSelector',
    get: ({ get }) => {
      const focusStack = get(focusStackState);
      const lastFocusStackItem = focusStack.at(-1);

      if (!isDefined(lastFocusStackItem)) {
        return DEFAULT_GLOBAL_HOTKEYS_CONFIG;
      }

      return lastFocusStackItem.globalHotkeysConfig;
    },
  });
```

## 2. 사용 예제

```tsx
// filepath: src/modules/ui/utilities/hotkey/hooks/useHotkeysOnFocusedElementCallback.ts
const currentFocusId = store.get(currentFocusIdSelector.atom);

if (currentFocusId !== focusId) {
  return;
}

if (preventDefault === true) {
  keyboardEvent.stopPropagation();
  keyboardEvent.preventDefault();
  keyboardEvent.stopImmediatePropagation();
}

return callback(keyboardEvent, hotkeysEvent);

// filepath: src/modules/ui/layout/dropdown/hooks/useCloseAnyOpenDropdown.ts
const previousStack = store.get(previousDropdownFocusIdStackState.atom);
const activeDropdownFocusId = store.get(activeDropdownFocusIdState.atom);

if (isDefined(activeDropdownFocusId)) {
  closeDropdown(activeDropdownFocusId);
  removeFocusItemFromFocusStackById({
    focusId: activeDropdownFocusId,
  });
}
```
