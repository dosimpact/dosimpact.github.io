# Instance-scoped Modal

`modalInstanceId`를 key로 modal open state를 분리하고, 어디서든 `openModal(id)`로 특정 modal을 여는 패턴이다.

핵심은 `state is keyed by instance id, wrapper owns rendering`이다.

## 1. 모듈 코드

- `src/modules/ui/layout/modal/states/isModalOpenedComponentState.ts`: modal open 여부를 instance-scoped atom state로 정의한다.
- `src/modules/ui/layout/modal/hooks/useModal.tsx`: `openModal`, `closeModal`, `toggleModal` 명령형 API를 제공한다.
- `src/modules/ui/layout/modal/components/ModalStatefulWrapper.tsx`: instance id에 해당하는 open state를 읽어 실제 modal을 렌더링한다.

```tsx
// 큰 흐름: `modalInstanceId`를 key로 modal open state를 분리하고, 어디서든 `openModal(id)`로 특정 modal을 여는 패턴이다.
// 핵심 기준: `state is keyed by instance id, wrapper owns rendering`이다.

// filepath: src/modules/ui/layout/modal/states/isModalOpenedComponentState.ts
import { ModalComponentInstanceContext } from '@/ui/layout/modal/contexts/ModalComponentInstanceContext';
import { createAtomComponentState } from '@/ui/utilities/state/jotai/utils/createAtomComponentState';

export const isModalOpenedComponentState = createAtomComponentState<boolean>({
  key: 'isModalOpenedComponentState',
  defaultValue: false,
  componentInstanceContext: ModalComponentInstanceContext,
});

// filepath: src/modules/ui/layout/modal/hooks/useModal.tsx
import { useWorkspaceSurfaceScopedComponentInstanceIdResolver } from '@/ui/layout/hooks/useWorkspaceSurfaceScopedComponentInstanceId';
import { isModalOpenedComponentState } from '@/ui/layout/modal/states/isModalOpenedComponentState';
import { FocusComponentType } from '@/ui/utilities/focus/types/FocusComponentType';
import { useStore } from 'jotai';
import { useCallback } from 'react';

export const useModal = () => {
  const store = useStore();
  const resolveComponentInstanceId =
    useWorkspaceSurfaceScopedComponentInstanceIdResolver();

  const closeModal = useCallback(
    (modalInstanceId: string) => {
      const scopedModalInstanceId = resolveComponentInstanceId(modalInstanceId);

      store.set(
        isModalOpenedComponentState.atomFamily({
          instanceId: scopedModalInstanceId,
        }),
        false,
      );
    },
    [store, resolveComponentInstanceId],
  );

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
      });
    },
    [store, resolveComponentInstanceId],
  );

  const toggleModal = useCallback(
    (modalInstanceId: string) => {
      const scopedModalInstanceId = resolveComponentInstanceId(modalInstanceId);
      const isModalOpen = store.get(
        isModalOpenedComponentState.atomFamily({
          instanceId: scopedModalInstanceId,
        }),
      );

      if (isModalOpen) {
        closeModal(modalInstanceId);
      } else {
        openModal(modalInstanceId);
      }
    },
    [store, closeModal, openModal, resolveComponentInstanceId],
  );

  return { closeModal, openModal, toggleModal };
};

// filepath: src/modules/ui/layout/modal/components/ModalStatefulWrapper.tsx
import { ModalComponentInstanceContext } from '@/ui/layout/modal/contexts/ModalComponentInstanceContext';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { isModalOpenedComponentState } from '@/ui/layout/modal/states/isModalOpenedComponentState';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { Modal } from 'twenty-ui/surfaces';

export const ModalStatefulWrapper = ({
  modalInstanceId,
  children,
}: {
  modalInstanceId: string;
  children: React.ReactNode;
}) => {
  const isModalOpened = useAtomComponentStateValue(
    isModalOpenedComponentState,
    modalInstanceId,
  );
  const { closeModal } = useModal();

  return (
    <ModalComponentInstanceContext.Provider value={{ instanceId: modalInstanceId }}>
      <Modal
        isOpen={isModalOpened}
        onClose={() => closeModal(modalInstanceId)}
      >
        {children}
      </Modal>
    </ModalComponentInstanceContext.Provider>
  );
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Instance-scoped Modal 패턴을 실제 호출부에서 조합한다.

import { ModalStatefulWrapper } from '@/ui/layout/modal/components/ModalStatefulWrapper';
import { useModal } from '@/ui/layout/modal/hooks/useModal';

const DELETE_MODAL_ID = 'delete-record-modal';

export const DeleteRecordModal = () => (
  <ModalStatefulWrapper modalInstanceId={DELETE_MODAL_ID}>
    <DeleteRecordForm />
  </ModalStatefulWrapper>
);

export const DeleteRecordButton = () => {
  const { openModal } = useModal();

  return (
    <button onClick={() => openModal(DELETE_MODAL_ID)}>
      Delete
    </button>
  );
};
```
