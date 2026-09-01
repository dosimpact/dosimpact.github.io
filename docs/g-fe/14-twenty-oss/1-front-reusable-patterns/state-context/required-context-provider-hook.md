# Required Context Provider Hook

Provider 밖에서 hook을 호출하면 즉시 에러를 던지는 required context 패턴이다.

핵심은 `createRequiredContext`가 Provider와 `useXxxOrThrow` hook을 한 번에 만든다는 점이다.

## 1. 모듈 코드

- `src/utils/createRequiredContext.ts`: required context용 Provider와 hook을 생성한다.
- `src/modules/object-record/record-index/contexts/RecordIndexContext.ts`: record index 화면에서 필요한 큰 context value를 required context로 정의한다.
- `src/modules/ui/layout/side-panel/contexts/SidePanelContext.tsx`: side panel 여부처럼 작은 값도 같은 방식으로 정의한다.

```tsx
// src/utils/createRequiredContext.ts
import React, { useContext } from 'react';

export const createRequiredContext = <TContext>(debugName: string) => {
  const Context = React.createContext<TContext | undefined>(undefined);
  Context.displayName = `${debugName}Provider`;

  const useRequiredContextOrThrow = (): TContext => {
    const context = useContext(Context);

    if (context === undefined) {
      throw new Error(
        `${debugName} Context not found. Please wrap your component tree with <${Context.displayName}> before using use${debugName}OrThrow().`,
      );
    }

    return context;
  };

  return [Context.Provider, useRequiredContextOrThrow] as const;
};

// filepath: src/modules/object-record/record-index/contexts/RecordIndexContext.ts
import { type FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { type RecordField } from '@/object-record/record-field/types/RecordField';
import { type FieldMetadata } from '@/object-record/record-field/ui/types/FieldMetadata';
import { type ColumnDefinition } from '@/object-record/record-table/types/ColumnDefinition';
import { type ObjectPermissions } from 'twenty-shared/types';
import { createRequiredContext } from '~/utils/createRequiredContext';

export type RecordIndexContextValue = {
  indexIdentifierUrl: (recordId: string) => string;
  onIndexRecordsLoaded: () => void;
  objectNamePlural: string;
  objectNameSingular: string;
  objectMetadataItem: EnrichedObjectMetadataItem;
  objectPermissionsByObjectMetadataId: Record<
    string,
    ObjectPermissions & { objectMetadataId: string }
  >;
  recordIndexId: string;
  viewBarInstanceId: string;
  recordFieldByFieldMetadataItemId: Record<string, RecordField>;
  labelIdentifierFieldMetadataItem: FieldMetadataItem | undefined;
  fieldMetadataItemByFieldMetadataItemId: Record<string, FieldMetadataItem>;
  fieldDefinitionByFieldMetadataItemId: Record<
    string,
    ColumnDefinition<FieldMetadata>
  >;
  recordLimit?: number;
};

export const [RecordIndexContextProvider, useRecordIndexContextOrThrow] =
  createRequiredContext<RecordIndexContextValue>('RecordIndexContext');

// filepath: src/modules/ui/layout/side-panel/contexts/SidePanelContext.tsx
import { createRequiredContext } from '~/utils/createRequiredContext';

type SidePanelContextType = {
  isInSidePanel: boolean;
};

export const [SidePanelProvider, useIsInSidePanelOrThrow] =
  createRequiredContext<SidePanelContextType>('SidePanel');
```

## 2. 사용 예제

```tsx
// Provider 사용
<RecordIndexContextProvider
  value={{
    recordIndexId,
    viewBarInstanceId,
    objectNamePlural,
    objectNameSingular,
    objectMetadataItem,
    objectPermissionsByObjectMetadataId,
    recordFieldByFieldMetadataItemId,
    labelIdentifierFieldMetadataItem,
    fieldMetadataItemByFieldMetadataItemId,
    fieldDefinitionByFieldMetadataItemId,
    indexIdentifierUrl,
    onIndexRecordsLoaded,
  }}
>
  <RecordIndexContainer />
</RecordIndexContextProvider>;

// Consumer 사용
import { useRecordIndexContextOrThrow } from '@/object-record/record-index/contexts/RecordIndexContext';

export const RecordIndexContainer = () => {
  const { recordIndexId, objectMetadataItem, objectNameSingular } =
    useRecordIndexContextOrThrow();

  return (
    <RecordBoardContainer
      recordBoardId={recordIndexId}
      viewBarId={recordIndexId}
      objectNameSingular={objectNameSingular}
    />
  );
};
```
