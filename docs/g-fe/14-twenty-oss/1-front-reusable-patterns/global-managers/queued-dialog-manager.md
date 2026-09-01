# Queued Dialog Manager

전역 dialog queue를 component instance state에 저장하고, manager 컴포넌트가 queue를 렌더링하는 패턴이다.

핵심은 `caller enqueues, manager renders and closes`다.

## 1. 모듈 코드

- `src/modules/ui/feedback/dialog-manager/states/dialogInternalComponentState.ts`: dialog queue와 max queue를 instance-scoped atom state로 정의한다.
- `src/modules/ui/feedback/dialog-manager/hooks/useDialogManager.ts`: `enqueueDialog`와 `closeDialog` 명령형 API를 제공한다.
- `src/modules/ui/feedback/dialog-manager/components/DialogManager.tsx`: queue에 들어있는 dialog들을 실제 UI로 렌더링한다.

```tsx
// filepath: src/modules/ui/feedback/dialog-manager/states/dialogInternalComponentState.ts
import { DialogComponentInstanceContext } from '@/ui/feedback/dialog-manager/contexts/DialogComponentInstanceContext';
import { createAtomComponentState } from '@/ui/utilities/state/jotai/utils/createAtomComponentState';
import { type DialogOptions } from '@/ui/feedback/dialog-manager/types/DialogOptions';

type DialogState = {
  maxQueue: number;
  queue: DialogOptions[];
};

export const dialogInternalComponentState =
  createAtomComponentState<DialogState>({
    key: 'dialogInternalComponentState',
    defaultValue: {
      maxQueue: 2,
      queue: [],
    },
    componentInstanceContext: DialogComponentInstanceContext,
  });

// filepath: src/modules/ui/feedback/dialog-manager/hooks/useDialogManager.ts
import { useCallback } from 'react';
import { v4 } from 'uuid';

import { DIALOG_FOCUS_ID } from '@/ui/feedback/dialog-manager/constants/DialogFocusId';
import { DialogComponentInstanceContext } from '@/ui/feedback/dialog-manager/contexts/DialogComponentInstanceContext';
import { dialogInternalComponentState } from '@/ui/feedback/dialog-manager/states/dialogInternalComponentState';
import { type DialogOptions } from '@/ui/feedback/dialog-manager/types/DialogOptions';
import { useRemoveFocusItemFromFocusStackById } from '@/ui/utilities/focus/hooks/useRemoveFocusItemFromFocusStackById';
import { useAvailableComponentInstanceIdOrThrow } from '@/ui/utilities/state/component-state/hooks/useAvailableComponentInstanceIdOrThrow';
import { useStore } from 'jotai';

export const useDialogManager = () => {
  const componentInstanceId = useAvailableComponentInstanceIdOrThrow(
    DialogComponentInstanceContext,
  );
  const store = useStore();
  const { removeFocusItemFromFocusStackById } =
    useRemoveFocusItemFromFocusStackById();

  const closeDialog = useCallback(
    (id: string) => {
      store.set(
        dialogInternalComponentState.atomFamily({ instanceId: componentInstanceId }),
        (prevState) => ({
          ...prevState,
          queue: prevState.queue.filter((dialog) => dialog.id !== id),
        }),
      );

      removeFocusItemFromFocusStackById({ focusId: DIALOG_FOCUS_ID });
    },
    [componentInstanceId, removeFocusItemFromFocusStackById, store],
  );

  const enqueueDialog = (options?: Omit<DialogOptions, 'id'>) => {
    store.set(
      dialogInternalComponentState.atomFamily({ instanceId: componentInstanceId }),
      (prev) => ({
        ...prev,
        queue:
          prev.queue.length >= prev.maxQueue
            ? [...prev.queue.slice(1), { id: v4(), ...options }]
            : [...prev.queue, { id: v4(), ...options }],
      }),
    );
  };

  return { closeDialog, enqueueDialog };
};

// filepath: src/modules/ui/feedback/dialog-manager/components/DialogManager.tsx
import { Dialog } from '@/ui/feedback/dialog-manager/components/Dialog';
import { DialogManagerEffect } from '@/ui/feedback/dialog-manager/components/DialogManagerEffect';
import { useDialogManager } from '@/ui/feedback/dialog-manager/hooks/useDialogManager';
import { dialogInternalComponentState } from '@/ui/feedback/dialog-manager/states/dialogInternalComponentState';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';

export const DialogManager = ({ children }: React.PropsWithChildren) => {
  const dialogInternal = useAtomComponentStateValue(
    dialogInternalComponentState,
  );
  const { closeDialog } = useDialogManager();

  return (
    <>
      <DialogManagerEffect />
      {children}
      {dialogInternal.queue.map(({ buttons, children, id, message, title }) => (
        <Dialog
          key={id}
          {...{ title, message, buttons, id, children }}
          onClose={() => closeDialog(id)}
        />
      ))}
    </>
  );
};
```

## 2. 사용 예제

```tsx
import { useDialogManager } from '@/ui/feedback/dialog-manager/hooks/useDialogManager';

export const DeleteButton = () => {
  const { enqueueDialog } = useDialogManager();

  return (
    <button
      onClick={() =>
        enqueueDialog({
          title: 'Delete record',
          message: 'This action cannot be undone.',
          buttons: [
            { title: 'Cancel' },
            { title: 'Delete', accent: 'danger', onClick: deleteRecord },
          ],
        })
      }
    >
      Delete
    </button>
  );
};
```
