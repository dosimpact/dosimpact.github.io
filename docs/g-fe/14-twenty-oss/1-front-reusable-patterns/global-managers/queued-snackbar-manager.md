# Queued Snack Bar Manager

전역 snackbar queue를 component instance state에 저장하고, provider가 fixed container에 알림을 렌더링하는 패턴이다.

핵심은 `caller enqueues a variant, provider owns the queue UI`다.

## 1. 모듈 코드

- `src/modules/ui/feedback/snack-bar-manager/states/snackBarInternalComponentState.ts`: snackbar queue와 max queue를 instance-scoped atom state로 정의한다.
- `src/modules/ui/feedback/snack-bar-manager/hooks/useSnackBar.ts`: success, info, warning, error snackbar enqueue API를 제공한다.
- `src/modules/ui/feedback/snack-bar-manager/components/SnackBarProvider.tsx`: queue를 fixed-position snackbar UI로 렌더링한다.

```tsx
// filepath: src/modules/ui/feedback/snack-bar-manager/states/snackBarInternalComponentState.ts
import { SnackBarComponentInstanceContext } from '@/ui/feedback/snack-bar-manager/contexts/SnackBarComponentInstanceContext';
import { type SnackBarProps } from '@/ui/feedback/snack-bar-manager/components/SnackBar';
import { createAtomComponentState } from '@/ui/utilities/state/jotai/utils/createAtomComponentState';

export type SnackBarOptions = SnackBarProps & {
  id: string;
};

export type SnackBarState = {
  maxQueue: number;
  queue: SnackBarOptions[];
};

export const snackBarInternalComponentState =
  createAtomComponentState<SnackBarState>({
    key: 'snackBarState',
    defaultValue: {
      maxQueue: 3,
      queue: [],
    },
    componentInstanceContext: SnackBarComponentInstanceContext,
  });

// filepath: src/modules/ui/feedback/snack-bar-manager/hooks/useSnackBar.ts
import { SnackBarVariant } from '@/ui/feedback/snack-bar-manager/components/SnackBar';
import { SnackBarComponentInstanceContext } from '@/ui/feedback/snack-bar-manager/contexts/SnackBarComponentInstanceContext';
import {
  snackBarInternalComponentState,
  type SnackBarOptions,
} from '@/ui/feedback/snack-bar-manager/states/snackBarInternalComponentState';
import { useAvailableComponentInstanceIdOrThrow } from '@/ui/utilities/state/component-state/hooks/useAvailableComponentInstanceIdOrThrow';
import { t } from '@lingui/core/macro';
import { useStore } from 'jotai';
import { useCallback } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { v4 as uuidv4 } from 'uuid';

export const useSnackBar = () => {
  const componentInstanceId = useAvailableComponentInstanceIdOrThrow(
    SnackBarComponentInstanceContext,
  );
  const store = useStore();

  const handleSnackBarClose = useCallback(
    (id: string) => {
      store.set(
        snackBarInternalComponentState.atomFamily({ instanceId: componentInstanceId }),
        (prevState) => ({
          ...prevState,
          queue: prevState.queue.filter((snackBar) => snackBar.id !== id),
        }),
      );
    },
    [componentInstanceId, store],
  );

  const setSnackBarQueue = useCallback(
    (newValue: SnackBarOptions) =>
      store.set(
        snackBarInternalComponentState.atomFamily({ instanceId: componentInstanceId }),
        (prev) => {
          if (
            isDefined(newValue.dedupeKey) &&
            prev.queue.some((snackBar) => snackBar.dedupeKey === newValue.dedupeKey)
          ) {
            return prev;
          }

          return {
            ...prev,
            queue:
              prev.queue.length >= prev.maxQueue
                ? [...prev.queue.slice(1), newValue]
                : [...prev.queue, newValue],
          };
        },
      ),
    [componentInstanceId, store],
  );

  const enqueueSuccessSnackBar = ({ message }: { message: string }) => {
    setSnackBarQueue({
      id: uuidv4(),
      message,
      variant: SnackBarVariant.Success,
    });
  };

  const enqueueErrorSnackBar = ({ message }: { message?: string }) => {
    setSnackBarQueue({
      id: uuidv4(),
      message: message ?? t`An error occurred.`,
      variant: SnackBarVariant.Error,
    });
  };

  return {
    handleSnackBarClose,
    enqueueSuccessSnackBar,
    enqueueErrorSnackBar,
  };
};

// filepath: src/modules/ui/feedback/snack-bar-manager/components/SnackBarProvider.tsx
import { SnackBar } from '@/ui/feedback/snack-bar-manager/components/SnackBar';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { snackBarInternalComponentState } from '@/ui/feedback/snack-bar-manager/states/snackBarInternalComponentState';
import { RootStackingContextZIndices } from '@/ui/layout/constants/RootStackingContextZIndices';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { styled } from '@linaria/react';
import { AnimatePresence, motion } from 'framer-motion';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledSnackBarContainer = styled.div`
  bottom: ${themeCssVariables.spacing[3]};
  display: flex;
  flex-direction: column;
  position: fixed;
  right: ${themeCssVariables.spacing[3]};
  z-index: ${RootStackingContextZIndices.SnackBar};
`;

export const SnackBarProvider = ({ children }: React.PropsWithChildren) => {
  const snackBarInternal = useAtomComponentStateValue(
    snackBarInternalComponentState,
  );
  const { handleSnackBarClose } = useSnackBar();

  return (
    <>
      {children}
      <StyledSnackBarContainer>
        <AnimatePresence>
          {snackBarInternal.queue.map(({ id, message, variant }) => (
            <motion.div key={id} initial="out" animate="in" exit="out" layout>
              <SnackBar
                message={message}
                variant={variant}
                onClose={() => handleSnackBarClose(id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </StyledSnackBarContainer>
    </>
  );
};
```

## 2. 사용 예제

```tsx
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';

export const SaveButton = () => {
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const handleSave = async () => {
    try {
      await saveRecord();
      enqueueSuccessSnackBar({ message: 'Record saved' });
    } catch {
      enqueueErrorSnackBar({ message: 'Could not save record' });
    }
  };

  return <button onClick={handleSave}>Save</button>;
};
```
