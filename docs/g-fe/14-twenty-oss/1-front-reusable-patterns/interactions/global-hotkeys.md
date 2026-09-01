# Global Hotkeys

전역 단축키를 등록하되 현재 focus stack의 hotkey 정책을 통과한 경우에만 callback을 실행하는 패턴이다.

핵심은 `hotkeys are global, execution is focus-gated`다.

## 1. 모듈 코드

- `src/modules/ui/utilities/hotkey/hooks/useGlobalHotkeys.ts`: `react-hotkeys-hook`을 감싸고 pending hotkey와 기본 옵션을 처리한다.
- `src/modules/ui/utilities/hotkey/hooks/useGlobalHotkeysCallback.ts`: focus stack에서 현재 hotkey 실행 가능 여부를 판단한다.
- `src/modules/ui/utilities/hotkey/components/HotkeyEffect.tsx`: UI 없이 hotkey side effect만 붙이는 컴포넌트다.

```tsx
// filepath: src/modules/ui/utilities/hotkey/hooks/useGlobalHotkeys.ts
import { useGlobalHotkeysCallback } from '@/ui/utilities/hotkey/hooks/useGlobalHotkeysCallback';
import { pendingHotkeyState } from '@/ui/utilities/hotkey/states/internal/pendingHotkeysState';
import { useStore } from 'jotai';
import { useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { type HotkeyCallback, type Keys, type Options } from 'react-hotkeys-hook/dist/types';
import { isDefined } from 'twenty-shared/utils';

type UseHotkeysOptionsWithoutBuggyOptions = Omit<Options, 'enabled'>;

export const useGlobalHotkeys = ({
  keys,
  callback,
  containsModifier,
  dependencies,
  options,
}: {
  keys: Keys;
  callback: HotkeyCallback;
  containsModifier: boolean;
  dependencies?: unknown[];
  options?: UseHotkeysOptionsWithoutBuggyOptions;
}) => {
  const store = useStore();
  const callGlobalHotkeysCallback = useGlobalHotkeysCallback(dependencies);

  const preventDefault = isDefined(options?.preventDefault)
    ? options.preventDefault === true
    : true;

  const handleCallback = useCallback(
    (keyboardEvent: KeyboardEvent, hotkeysEvent: any) => {
      const pendingHotkey = store.get(pendingHotkeyState.atom);

      if (!isDefined(pendingHotkey)) {
        callback(keyboardEvent, hotkeysEvent);
      }

      store.set(pendingHotkeyState.atom, null);
    },
    [callback, store],
  );

  return useHotkeys(
    keys,
    (keyboardEvent, hotkeysEvent) => {
      callGlobalHotkeysCallback({
        keyboardEvent,
        hotkeysEvent,
        callback: () => handleCallback(keyboardEvent, hotkeysEvent),
        preventDefault,
        containsModifier,
      });
    },
    {
      enableOnContentEditable: options?.enableOnContentEditable ?? true,
      enableOnFormTags: options?.enableOnFormTags ?? true,
      eventListenerOptions: options?.eventListenerOptions,
      ignoreModifiers: options?.ignoreModifiers === true,
    },
    dependencies,
  );
};

// filepath: src/modules/ui/utilities/hotkey/hooks/useGlobalHotkeysCallback.ts
import { currentGlobalHotkeysConfigSelector } from '@/ui/utilities/focus/states/currentGlobalHotkeysConfigSelector';
import { useStore } from 'jotai';
import { useCallback } from 'react';
import { type Hotkey, type OptionsOrDependencyArray } from 'react-hotkeys-hook/dist/types';

export const useGlobalHotkeysCallback = (
  dependencies?: OptionsOrDependencyArray,
) => {
  const store = useStore();
  const dependencyArray = Array.isArray(dependencies) ? dependencies : [];

  return useCallback(
    ({
      callback,
      containsModifier,
      keyboardEvent,
      preventDefault,
    }: {
      keyboardEvent: KeyboardEvent;
      hotkeysEvent: Hotkey;
      containsModifier: boolean;
      callback: (keyboardEvent: KeyboardEvent, hotkeysEvent: Hotkey) => void;
      preventDefault?: boolean;
    }) => {
      const currentGlobalHotkeysConfig = store.get(
        currentGlobalHotkeysConfigSelector.atom,
      );

      if (
        containsModifier &&
        !currentGlobalHotkeysConfig.enableGlobalHotkeysWithModifiers
      ) {
        return;
      }

      if (
        !containsModifier &&
        !currentGlobalHotkeysConfig.enableGlobalHotkeysConflictingWithKeyboard
      ) {
        return;
      }

      if (preventDefault === true) {
        keyboardEvent.stopPropagation();
        keyboardEvent.preventDefault();
        keyboardEvent.stopImmediatePropagation();
      }

      return callback(keyboardEvent, hotkeysEvent);
    },
    [...dependencyArray, store],
  );
};

// filepath: src/modules/ui/utilities/hotkey/components/HotkeyEffect.tsx
import { useHotkeysOnFocusedElement } from '@/ui/utilities/hotkey/hooks/useHotkeysOnFocusedElement';
import { type Keys } from 'react-hotkeys-hook';

export const HotkeyEffect = ({
  hotkey,
  focusId,
  onHotkeyTriggered,
}: {
  hotkey: { key: Keys };
  onHotkeyTriggered: () => void;
  focusId: string;
}) => {
  useHotkeysOnFocusedElement({
    keys: hotkey.key,
    callback: onHotkeyTriggered,
    focusId,
    dependencies: [onHotkeyTriggered],
  });

  return <></>;
};
```

## 2. 사용 예제

```tsx
import { useGlobalHotkeys } from '@/ui/utilities/hotkey/hooks/useGlobalHotkeys';

export const CommandMenuHotkeys = ({ open }: { open: () => void }) => {
  useGlobalHotkeys({
    keys: 'meta+k',
    containsModifier: true,
    callback: open,
    dependencies: [open],
  });

  return null;
};
```
