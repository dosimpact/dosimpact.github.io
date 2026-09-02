# Click Outside Listener

document-level `mousedown/click/touch` 이벤트를 조합해 ref 바깥 클릭만 callback으로 전달하는 패턴이다.

핵심은 `mousedown starts the intent, click confirms outside`다.

## 1. 모듈 코드

- `src/modules/ui/utilities/pointer-event/hooks/useListenClickOutside.ts`: document event를 등록하고 ref/exclusion/activation state를 확인한다.
- `src/modules/ui/utilities/pointer-event/hooks/useClickOutsideListener.ts`: listener id별 activation state를 켜고 끈다.
- `src/modules/ui/utilities/pointer-event/contexts/ClickOutsideListenerContext.tsx`: modal/dropdown처럼 제외해야 하는 click outside id를 하위로 전달한다.

```tsx
// 큰 흐름: document-level `mousedown/click/touch` 이벤트를 조합해 ref 바깥 클릭만 callback으로 전달하는 패턴이다.
// 핵심 기준: `mousedown starts the intent, click confirms outside`다.

// filepath: src/modules/ui/utilities/pointer-event/hooks/useListenClickOutside.ts
import { clickOutsideListenerIsActivatedComponentState } from '@/ui/utilities/pointer-event/states/clickOutsideListenerIsActivatedComponentState';
import { clickOutsideListenerIsMouseDownInsideComponentState } from '@/ui/utilities/pointer-event/states/clickOutsideListenerIsMouseDownInsideComponentState';
import { clickOutsideListenerMouseDownHappenedComponentState } from '@/ui/utilities/pointer-event/states/clickOutsideListenerMouseDownHappenedComponentState';
import { useStore } from 'jotai';
import { useCallback, useEffect, type RefObject } from 'react';
import { isDefined } from 'twenty-shared/utils';

export type ClickOutsideListenerProps<T extends Element> = {
  refs: Array<RefObject<T | null>>;
  excludedClickOutsideIds?: string[];
  callback: (event: MouseEvent | TouchEvent) => void;
  listenerId: string;
  enabled?: boolean;
};

export const useListenClickOutside = <T extends Element>({
  refs,
  excludedClickOutsideIds,
  callback,
  listenerId,
  enabled = true,
}: ClickOutsideListenerProps<T>) => {
  const store = useStore();

  const handleMouseDown = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const isActivated = store.get(
        clickOutsideListenerIsActivatedComponentState.atomFamily({
          instanceId: listenerId,
        }),
      );

      store.set(
        clickOutsideListenerMouseDownHappenedComponentState.atomFamily({
          instanceId: listenerId,
        }),
        true,
      );

      if (!isActivated || !enabled) {
        return;
      }

      const isMouseDownInside = refs
        .filter((ref) => !!ref.current)
        .some((ref) => ref.current?.contains(event.target as Node));

      store.set(
        clickOutsideListenerIsMouseDownInsideComponentState.atomFamily({
          instanceId: listenerId,
        }),
        isMouseDownInside,
      );
    },
    [enabled, listenerId, refs, store],
  );

  const handleClickOutside = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const isActivated = store.get(
        clickOutsideListenerIsActivatedComponentState.atomFamily({
          instanceId: listenerId,
        }),
      );
      const isMouseDownInside = store.get(
        clickOutsideListenerIsMouseDownInsideComponentState.atomFamily({
          instanceId: listenerId,
        }),
      );
      const hasMouseDownHappened = store.get(
        clickOutsideListenerMouseDownHappenedComponentState.atomFamily({
          instanceId: listenerId,
        }),
      );

      const clickedElement = event.target as HTMLElement;
      let currentElement: HTMLElement | null = clickedElement;
      let isClickedOnExcluded = false;

      while (currentElement) {
        const clickOutsideId = currentElement.dataset?.clickOutsideId;
        const isGloballyExcluded =
          currentElement.dataset?.globallyPreventClickOutside === 'true';

        isClickedOnExcluded =
          isGloballyExcluded ||
          (isDefined(clickOutsideId) &&
            isDefined(excludedClickOutsideIds) &&
            excludedClickOutsideIds.includes(clickOutsideId));

        if (isClickedOnExcluded) {
          break;
        }

        currentElement = currentElement.parentElement;
      }

      const clickedOnRef = refs
        .filter((ref) => !!ref.current)
        .some((ref) => ref.current?.contains(event.target as Node));

      if (
        isActivated &&
        enabled &&
        hasMouseDownHappened &&
        !clickedOnRef &&
        !isMouseDownInside &&
        !isClickedOnExcluded
      ) {
        callback(event);
      }
    },
    [callback, enabled, excludedClickOutsideIds, listenerId, refs, store],
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown, { capture: true });
    document.addEventListener('click', handleClickOutside, { capture: true });
    document.addEventListener('touchstart', handleMouseDown, { capture: true });
    document.addEventListener('touchend', handleClickOutside, { capture: true });

    return () => {
      document.removeEventListener('mousedown', handleMouseDown, { capture: true });
      document.removeEventListener('click', handleClickOutside, { capture: true });
      document.removeEventListener('touchstart', handleMouseDown, { capture: true });
      document.removeEventListener('touchend', handleClickOutside, { capture: true });
    };
  }, [handleClickOutside, handleMouseDown]);
};

// filepath: src/modules/ui/utilities/pointer-event/hooks/useClickOutsideListener.ts
import { clickOutsideListenerIsActivatedComponentState } from '@/ui/utilities/pointer-event/states/clickOutsideListenerIsActivatedComponentState';
import { clickOutsideListenerMouseDownHappenedComponentState } from '@/ui/utilities/pointer-event/states/clickOutsideListenerMouseDownHappenedComponentState';
import { useStore } from 'jotai';
import { useCallback } from 'react';

export const useClickOutsideListener = (instanceId: string) => {
  const store = useStore();

  const toggleClickOutside = useCallback(
    (activated: boolean) => {
      store.set(
        clickOutsideListenerIsActivatedComponentState.atomFamily({ instanceId }),
        activated,
      );

      if (!activated) {
        store.set(
          clickOutsideListenerMouseDownHappenedComponentState.atomFamily({
            instanceId,
          }),
          false,
        );
      }
    },
    [instanceId, store],
  );

  return { toggleClickOutside };
};

// filepath: src/modules/ui/utilities/pointer-event/contexts/ClickOutsideListenerContext.tsx
import { createContext } from 'react';

type ClickOutsideListenerContextType = {
  excludedClickOutsideId: string | undefined;
};

export const ClickOutsideListenerContext =
  createContext<ClickOutsideListenerContextType>({
    excludedClickOutsideId: undefined,
  });
```

## 2. 사용 예제

```tsx
// 사용 흐름: Click Outside Listener 패턴을 실제 호출부에서 조합한다.

import { useClickOutsideListener } from '@/ui/utilities/pointer-event/hooks/useClickOutsideListener';
import { useListenClickOutside } from '@/ui/utilities/pointer-event/hooks/useListenClickOutside';
import { useEffect, useRef } from 'react';

const LISTENER_ID = 'record-picker';

export const RecordPicker = ({ closePicker }: { closePicker: () => void }) => {
  const pickerRef = useRef<HTMLDivElement>(null);
  const { toggleClickOutside } = useClickOutsideListener(LISTENER_ID);

  useEffect(() => {
    toggleClickOutside(true);
    return () => toggleClickOutside(false);
  }, [toggleClickOutside]);

  useListenClickOutside({
    refs: [pickerRef],
    listenerId: LISTENER_ID,
    callback: closePicker,
  });

  return <div ref={pickerRef}>...</div>;
};
```
