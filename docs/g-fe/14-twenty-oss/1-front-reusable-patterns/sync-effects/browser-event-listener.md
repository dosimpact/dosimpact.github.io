# Browser Event Listener

브라우저 `CustomEvent`를 typed dispatch/listen hook으로 감싸고, feature hook에서 entity와 operation filter를 붙이는 패턴이다.

핵심은 `dispatch generic event, listen through typed filters`다.

## 1. 모듈 코드

- `src/modules/browser-event/utils/dispatchBrowserEvent.ts`: event name과 optional detail을 받아 `window.dispatchEvent`를 실행한다.
- `src/modules/browser-event/hooks/useListenToBrowserEvent.ts`: `CustomEvent.detail`을 callback으로 넘기는 renderless listener hook이다.
- `src/modules/browser-event/utils/dispatchObjectRecordOperationBrowserEvent.ts`: object record operation 전용 event name으로 dispatch한다.
- `src/modules/browser-event/hooks/useListenToObjectRecordOperationBrowserEvent.ts`: object metadata id와 operation type으로 object record event를 필터링한다.
- `src/modules/browser-event/hooks/useListenToMetadataOperationBrowserEvent.ts`: metadata name과 operation type으로 metadata event를 필터링한다.

```tsx
// filepath: src/modules/browser-event/utils/dispatchBrowserEvent.ts
import { isDefined } from 'twenty-shared/utils';

export const dispatchBrowserEvent = <T>(eventName: string, detail?: T) => {
  if (isDefined(detail)) {
    window.dispatchEvent(new CustomEvent<T>(eventName, { detail }));
  } else {
    window.dispatchEvent(new CustomEvent(eventName));
  }
};

// filepath: src/modules/browser-event/hooks/useListenToBrowserEvent.ts
import { useEffect } from 'react';

export const useListenToBrowserEvent = <T>({
  onBrowserEvent,
  eventName,
}: {
  onBrowserEvent: (detail?: T) => void;
  eventName: string;
}) => {
  useEffect(() => {
    const handleWindowDOMEvent = (event: CustomEvent<T>) => {
      onBrowserEvent(event.detail);
    };

    window.addEventListener(eventName, handleWindowDOMEvent as EventListener);

    return () => {
      window.removeEventListener(
        eventName,
        handleWindowDOMEvent as EventListener,
      );
    };
  }, [eventName, onBrowserEvent]);
};

// filepath: src/modules/browser-event/utils/dispatchObjectRecordOperationBrowserEvent.ts
import { OBJECT_RECORD_OPERATION_BROWSER_EVENT_NAME } from '@/browser-event/constants/ObjectRecordOperationBrowserEventName';
import { type ObjectRecordOperationBrowserEventDetail } from '@/browser-event/types/ObjectRecordOperationBrowserEventDetail';

export const dispatchObjectRecordOperationBrowserEvent = (
  detail: ObjectRecordOperationBrowserEventDetail,
) => {
  window.dispatchEvent(
    new CustomEvent(OBJECT_RECORD_OPERATION_BROWSER_EVENT_NAME, {
      detail,
    }),
  );
};

// filepath: src/modules/browser-event/hooks/useListenToObjectRecordOperationBrowserEvent.ts
import { OBJECT_RECORD_OPERATION_BROWSER_EVENT_NAME } from '@/browser-event/constants/ObjectRecordOperationBrowserEventName';
import { type ObjectRecordOperationBrowserEventDetail } from '@/browser-event/types/ObjectRecordOperationBrowserEventDetail';
import { type ObjectRecordOperation } from '@/object-record/types/ObjectRecordOperation';
import { useEffect } from 'react';
import { isDefined, isNonEmptyArray } from 'twenty-shared/utils';

export const useListenToObjectRecordOperationBrowserEvent = ({
  onObjectRecordOperationBrowserEvent,
  objectMetadataItemId,
  operationTypes,
}: {
  onObjectRecordOperationBrowserEvent: (
    detail: ObjectRecordOperationBrowserEventDetail,
  ) => void;
  objectMetadataItemId?: string;
  operationTypes?: ObjectRecordOperation['type'][];
}) => {
  useEffect(() => {
    const handleObjectRecordOperationEvent = (event: Event) => {
      const detail = (
        event as CustomEvent<ObjectRecordOperationBrowserEventDetail>
      ).detail;

      if (
        isDefined(objectMetadataItemId) &&
        detail.objectMetadataItem.id !== objectMetadataItemId
      ) {
        return;
      }

      if (
        isNonEmptyArray(operationTypes) &&
        !operationTypes.includes(detail.operation.type)
      ) {
        return;
      }

      onObjectRecordOperationBrowserEvent(detail);
    };

    window.addEventListener(
      OBJECT_RECORD_OPERATION_BROWSER_EVENT_NAME,
      handleObjectRecordOperationEvent,
    );

    return () => {
      window.removeEventListener(
        OBJECT_RECORD_OPERATION_BROWSER_EVENT_NAME,
        handleObjectRecordOperationEvent,
      );
    };
  }, [
    objectMetadataItemId,
    onObjectRecordOperationBrowserEvent,
    operationTypes,
  ]);
};

// filepath: src/modules/browser-event/hooks/useListenToMetadataOperationBrowserEvent.ts
export const useListenToMetadataOperationBrowserEvent = <
  T extends Record<string, unknown>,
>({
  onMetadataOperationBrowserEvent,
  metadataName,
  operationTypes,
  skip = false,
}: {
  onMetadataOperationBrowserEvent: (
    detail: MetadataOperationBrowserEventDetail<T>,
  ) => void;
  metadataName?: BroadcastEntityName;
  operationTypes?: MetadataOperation<T>['type'][];
  skip?: boolean;
}) => {
  useEffect(() => {
    if (skip) {
      return;
    }

    const handleMetadataOperationEvent = (
      event: CustomEvent<MetadataOperationBrowserEventDetail<T>>,
    ) => {
      const detail = event.detail;

      if (isDefined(metadataName) && detail.metadataName !== metadataName) {
        return;
      }

      if (
        isNonEmptyArray(operationTypes) &&
        !operationTypes.includes(detail.operation.type)
      ) {
        return;
      }

      onMetadataOperationBrowserEvent(detail);
    };

    window.addEventListener(
      METADATA_OPERATION_BROWSER_EVENT_NAME,
      handleMetadataOperationEvent as EventListener,
    );

    return () => {
      window.removeEventListener(
        METADATA_OPERATION_BROWSER_EVENT_NAME,
        handleMetadataOperationEvent as EventListener,
      );
    };
  }, [metadataName, onMetadataOperationBrowserEvent, operationTypes, skip]);
};
```

## 2. 사용 예제

```tsx
import { dispatchBrowserEvent } from '@/browser-event/utils/dispatchBrowserEvent';
import { useListenToBrowserEvent } from '@/browser-event/hooks/useListenToBrowserEvent';

const RECORD_SAVED_EVENT_NAME = 'record-saved';

export const SaveButton = ({ recordId }: { recordId: string }) => {
  const handleSave = async () => {
    await saveRecord(recordId);
    dispatchBrowserEvent(RECORD_SAVED_EVENT_NAME, { recordId });
  };

  return <button onClick={handleSave}>Save</button>;
};

export const RecordSavedEffect = () => {
  useListenToBrowserEvent<{ recordId: string }>({
    eventName: RECORD_SAVED_EVENT_NAME,
    onBrowserEvent: (detail) => {
      if (!detail) {
        return;
      }

      refreshRecord(detail.recordId);
    },
  });

  return null;
};
```
