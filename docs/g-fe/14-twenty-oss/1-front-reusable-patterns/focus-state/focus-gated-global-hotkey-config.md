# Focus-Gated Global Hotkey Config

현재 focus item이 가진 `globalHotkeysConfig`로 전역 hotkey 실행 가능 여부를 제어하는 패턴.

핵심은 modal/dropdown처럼 keyboard 입력을 먹는 UI가 열릴 때 stack top에 더 엄격한 hotkey config를 올리는 것이다.

## 1. 모듈 코드

- `src/modules/ui/utilities/hotkey/constants/DefaultGlobalHotkeysConfig.ts`: focus가 없을 때의 전역 hotkey 기본 정책이다.
- `src/modules/ui/utilities/focus/states/currentGlobalHotkeysConfigSelector.ts`: 현재 focus item의 hotkey 정책을 읽는다.
- `src/modules/ui/utilities/hotkey/hooks/useGlobalHotkeysCallback.ts`: 현재 정책에 따라 전역 hotkey callback을 실행하거나 차단한다.
- `src/modules/ui/utilities/hotkey/hooks/useGlobalHotkeys.ts`: `react-hotkeys-hook`을 앱 정책으로 감싼다.

```tsx
// 큰 흐름: 현재 focus item이 가진 `globalHotkeysConfig`로 전역 hotkey 실행 가능 여부를 제어하는 패턴.
// 핵심 기준: modal/dropdown처럼 keyboard 입력을 먹는 UI가 열릴 때 stack top에 더 엄격한 hotkey config를 올리는 것이다.

// filepath: src/modules/ui/utilities/hotkey/constants/DefaultGlobalHotkeysConfig.ts
import { type GlobalHotkeysConfig } from '@/ui/utilities/hotkey/types/GlobalHotkeysConfig';

export const DEFAULT_GLOBAL_HOTKEYS_CONFIG: GlobalHotkeysConfig = {
  enableGlobalHotkeysWithModifiers: true,
  enableGlobalHotkeysConflictingWithKeyboard: true,
};

// filepath: src/modules/ui/utilities/focus/states/currentGlobalHotkeysConfigSelector.ts
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

// filepath: src/modules/ui/utilities/hotkey/hooks/useGlobalHotkeysCallback.ts
export const useGlobalHotkeysCallback = (
  dependencies?: OptionsOrDependencyArray,
) => {
  const store = useStore();
  const dependencyArray = Array.isArray(dependencies) ? dependencies : [];

  return useCallback(
    ({
      callback,
      containsModifier,
      hotkeysEvent,
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

// filepath: src/modules/ui/utilities/hotkey/hooks/useGlobalHotkeys.ts
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
  options?: Omit<Options, 'enabled'>;
}) => {
  const store = useStore();
  const callGlobalHotkeysCallback = useGlobalHotkeysCallback(dependencies);

  return useHotkeys(
    keys,
    (keyboardEvent, hotkeysEvent) => {
      callGlobalHotkeysCallback({
        keyboardEvent,
        hotkeysEvent,
        callback: () => {
          const pendingHotkey = store.get(pendingHotkeyState.atom);

          if (!isDefined(pendingHotkey)) {
            callback(keyboardEvent, hotkeysEvent);
          }

          store.set(pendingHotkeyState.atom, null);
        },
        preventDefault: options?.preventDefault ?? true,
        containsModifier,
      });
    },
    {
      enableOnContentEditable: options?.enableOnContentEditable ?? true,
      enableOnFormTags: options?.enableOnFormTags ?? true,
      ignoreModifiers: options?.ignoreModifiers === true,
    },
    dependencies,
  );
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Focus-Gated Global Hotkey Config 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/ui/layout/dropdown/hooks/useOpenDropdown.ts
pushFocusItemToFocusStack({
  focusId: dropdownComponentInstanceId,
  component: {
    type: FocusComponentType.DROPDOWN,
    instanceId: dropdownComponentInstanceId,
  },
  globalHotkeysConfig: {
    enableGlobalHotkeysConflictingWithKeyboard:
      args?.globalHotkeysConfig?.enableGlobalHotkeysConflictingWithKeyboard ??
      false,
    enableGlobalHotkeysWithModifiers:
      args?.globalHotkeysConfig?.enableGlobalHotkeysWithModifiers ?? false,
  },
});

// filepath: src/modules/ui/layout/modal/hooks/useModal.tsx
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

// filepath: src/modules/ui/layout/dropdown/components/OptionsDropdownMenu.tsx
<Dropdown
  dropdownId={dropdownId}
  globalHotkeysConfig={{
    enableGlobalHotkeysWithModifiers: true,
    enableGlobalHotkeysConflictingWithKeyboard: false,
  }}
>
  {children}
</Dropdown>;
```
