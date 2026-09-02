# Reset Focus Stack To Item

복잡한 UI 전환 후 focus stack을 하나의 item으로 재초기화하는 패턴.

핵심은 이전 stack을 정리하면서 새 기준 focus item만 남겨 hotkey와 focused-element 판정을 예측 가능하게 만드는 것이다.

## 1. 모듈 코드

- `src/modules/ui/utilities/focus/hooks/useResetFocusStackToFocusItem.ts`: stack을 전달받은 focus item 하나로 바꾼다.
- `src/modules/ui/utilities/focus/hooks/useResetFocusStack.ts`: stack 전체를 비운다.
- `src/modules/ui/utilities/focus/types/FocusComponentType.ts`: stack item이 가리키는 UI component type 목록이다.

```tsx
// 큰 흐름: 복잡한 UI 전환 후 focus stack을 하나의 item으로 재초기화하는 패턴.
// 핵심 기준: 이전 stack을 정리하면서 새 기준 focus item만 남겨 hotkey와 focused-element 판정을 예측 가능하게 만드는 것이다.

// filepath: src/modules/ui/utilities/focus/hooks/useResetFocusStackToFocusItem.ts
import { useCallback } from 'react';

import { DEBUG_FOCUS_STACK } from '@/ui/utilities/focus/constants/DebugFocusStack';
import { focusStackState } from '@/ui/utilities/focus/states/focusStackState';
import { type FocusStackItem } from '@/ui/utilities/focus/types/FocusStackItem';
import { useStore } from 'jotai';
import { logDebug } from '~/utils/logDebug';

export const useResetFocusStackToFocusItem = () => {
  const store = useStore();

  const resetFocusStackToFocusItem = useCallback(
    ({ focusStackItem }: { focusStackItem: FocusStackItem }) => {
      store.set(focusStackState.atom, [focusStackItem]);

      if (DEBUG_FOCUS_STACK) {
        logDebug(`DEBUG: reset focus stack to focus item`, {
          focusStackItem,
        });
      }
    },
    [store],
  );

  return { resetFocusStackToFocusItem };
};

// filepath: src/modules/ui/utilities/focus/hooks/useResetFocusStack.ts
export const useResetFocusStack = () => {
  const store = useStore();

  const resetFocusStack = useCallback(() => {
    store.set(focusStackState.atom, []);
  }, [store]);

  return { resetFocusStack };
};

// filepath: src/modules/ui/utilities/focus/types/FocusComponentType.ts
export enum FocusComponentType {
  MODAL = 'modal',
  DROPDOWN = 'dropdown',
  SIDE_PANEL = 'side-panel',
  OPENED_FIELD_INPUT = 'opened-field-input',
  PAGE = 'page',
  RECORD_TABLE = 'record-table',
  RECORD_TABLE_ROW = 'record-table-row',
  RECORD_TABLE_CELL = 'record-table-cell',
  TEXT_AREA = 'text-area',
  TEXT_INPUT = 'text-input',
  FORM_FIELD_INPUT = 'form-field-input',
  RECORD_BOARD_CARD = 'record-board-card',
  ACTIVITY_RICH_TEXT_EDITOR = 'activity-rich-text-editor',
  STANDALONE_RICH_TEXT_WIDGET = 'standalone-rich-text-widget',
  KEYBOARD_SHORTCUT_MENU = 'keyboard-shortcut-menu',
  DIALOG = 'dialog',
}
```

## 2. 사용 예제

```tsx
// 사용 흐름: Reset Focus Stack To Item 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/ui/utilities/focus/hooks/__tests__/useResetFocusStackToFocusItem.test.tsx
const firstFocusItem = {
  focusId: 'first-focus-id',
  componentInstance: {
    componentType: FocusComponentType.TEXT_INPUT,
    componentInstanceId: 'first-component-instance-id',
  },
  globalHotkeysConfig: {
    enableGlobalHotkeysWithModifiers: true,
    enableGlobalHotkeysConflictingWithKeyboard: true,
  },
};

const secondFocusItem = {
  focusId: 'second-focus-id',
  componentInstance: {
    componentType: FocusComponentType.MODAL,
    componentInstanceId: 'second-component-instance-id',
  },
  globalHotkeysConfig: {
    enableGlobalHotkeysWithModifiers: false,
    enableGlobalHotkeysConflictingWithKeyboard: false,
  },
};

pushFocusItemToFocusStack({
  focusId: firstFocusItem.focusId,
  component: {
    type: firstFocusItem.componentInstance.componentType,
    instanceId: firstFocusItem.componentInstance.componentInstanceId,
  },
  globalHotkeysConfig: firstFocusItem.globalHotkeysConfig,
});

pushFocusItemToFocusStack({
  focusId: secondFocusItem.focusId,
  component: {
    type: secondFocusItem.componentInstance.componentType,
    instanceId: secondFocusItem.componentInstance.componentInstanceId,
  },
  globalHotkeysConfig: secondFocusItem.globalHotkeysConfig,
});

resetFocusStackToFocusItem({
  focusStackItem: firstFocusItem,
});
```
