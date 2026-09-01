# Object Record CRUD Hook

object name과 metadata를 기준으로 GraphQL mutation, optimistic cache update, record store update, aggregate refetch를 한 hook에 감싸는 패턴이다.

핵심은 `feature code calls CRUD, hook owns metadata/cache details`다.

## 1. 모듈 코드

- `src/modules/object-record/hooks/useCreateOneRecord.ts`: object metadata로 create mutation과 optimistic record/cache/store update를 처리한다.
- `src/modules/object-record/hooks/useUpdateOneRecord.ts`: update input을 sanitize하고 cached record와 optimistic record를 비교해 cache/store를 갱신한다.
- `src/modules/object-record/hooks/useDeleteOneRecord.ts`: delete를 `deletedAt` optimistic update로 반영하고 mutation 결과와 동기화한다.

```tsx
// filepath: src/modules/object-record/hooks/useCreateOneRecord.ts
import { useApolloCoreClient } from '@/object-metadata/hooks/useApolloCoreClient';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { useCreateOneRecordMutation } from '@/object-record/hooks/useCreateOneRecordMutation';
import { useObjectPermissions } from '@/object-record/hooks/useObjectPermissions';
import { useRefetchAggregateQueries } from '@/object-record/hooks/useRefetchAggregateQueries';
import { useUpsertRecordsInStore } from '@/object-record/record-store/hooks/useUpsertRecordsInStore';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { sanitizeRecordInput } from '@/object-record/utils/sanitizeRecordInput';
import { useState } from 'react';
import { v4 } from 'uuid';

export const useCreateOneRecord = <
  CreatedObjectRecord extends ObjectRecord = ObjectRecord,
>({
  objectNameSingular,
}: {
  objectNameSingular: string;
}) => {
  const apolloCoreClient = useApolloCoreClient();
  const { objectMetadataItem } = useObjectMetadataItem({ objectNameSingular });
  const { createOneRecordMutation } = useCreateOneRecordMutation({
    objectNameSingular,
  });
  const { objectPermissionsByObjectMetadataId } = useObjectPermissions();
  const { upsertRecordsInStore } = useUpsertRecordsInStore();
  const { refetchAggregateQueries } = useRefetchAggregateQueries();
  const [loading, setLoading] = useState(false);

  const createOneRecord = async (recordInput: Partial<CreatedObjectRecord>) => {
    setLoading(true);

    const idForCreation = recordInput.id ?? v4();
    const sanitizedInput = {
      ...sanitizeRecordInput({ objectMetadataItem, recordInput }),
      id: idForCreation,
    };

    try {
      const createdObject = await apolloCoreClient.mutate({
        mutation: createOneRecordMutation,
        variables: {
          data: sanitizedInput,
        },
      });

      upsertRecordsInStore([createdObject]);
      await refetchAggregateQueries({ objectMetadataItem });

      return createdObject;
    } finally {
      setLoading(false);
    }
  };

  return { createOneRecord, loading, objectPermissionsByObjectMetadataId };
};

// filepath: src/modules/object-record/hooks/useUpdateOneRecord.ts
import { useApolloCoreClient } from '@/object-metadata/hooks/useApolloCoreClient';
import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';
import { useRefetchAggregateQueries } from '@/object-record/hooks/useRefetchAggregateQueries';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { sanitizeRecordInput } from '@/object-record/utils/sanitizeRecordInput';

export const useUpdateOneRecord = () => {
  const apolloCoreClient = useApolloCoreClient();
  const { objectMetadataItems } = useObjectMetadataItems();
  const { refetchAggregateQueries } = useRefetchAggregateQueries();

  const updateOneRecord = async <
    UpdatedObjectRecord extends ObjectRecord = ObjectRecord,
  >({
    objectNameSingular,
    idToUpdate,
    updateOneRecordInput,
  }: {
    objectNameSingular: string;
    idToUpdate: string;
    updateOneRecordInput: Partial<Omit<UpdatedObjectRecord, 'id'>>;
  }) => {
    const objectMetadataItem = objectMetadataItems.find(
      (item) => item.nameSingular === objectNameSingular,
    );

    if (!objectMetadataItem) {
      throw new Error(`Object metadata item not found for ${objectNameSingular}`);
    }

    const sanitizedInput = sanitizeRecordInput({
      objectMetadataItem,
      recordInput: updateOneRecordInput,
    });

    const updatedObject = await apolloCoreClient.mutate({
      mutation: generateUpdateOneRecordMutation({ objectMetadataItem }),
      variables: {
        idToUpdate,
        data: sanitizedInput,
      },
    });

    await refetchAggregateQueries({ objectMetadataItem });

    return updatedObject;
  };

  return { updateOneRecord };
};

// filepath: src/modules/object-record/hooks/useDeleteOneRecord.ts
import { useApolloCoreClient } from '@/object-metadata/hooks/useApolloCoreClient';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { useDeleteOneRecordMutation } from '@/object-record/hooks/useDeleteOneRecordMutation';
import { useRefetchAggregateQueries } from '@/object-record/hooks/useRefetchAggregateQueries';
import { useCallback } from 'react';

export const useDeleteOneRecord = ({
  objectNameSingular,
}: {
  objectNameSingular: string;
}) => {
  const apolloCoreClient = useApolloCoreClient();
  const { objectMetadataItem } = useObjectMetadataItem({ objectNameSingular });
  const { deleteOneRecordMutation } = useDeleteOneRecordMutation({
    objectNameSingular,
  });
  const { refetchAggregateQueries } = useRefetchAggregateQueries();

  const deleteOneRecord = useCallback(
    async (idToDelete: string) => {
      const deletedRecord = await apolloCoreClient.mutate({
        mutation: deleteOneRecordMutation,
        variables: { idToDelete },
      });

      await refetchAggregateQueries({ objectMetadataItem });

      return deletedRecord;
    },
    [apolloCoreClient, deleteOneRecordMutation, objectMetadataItem, refetchAggregateQueries],
  );

  return { deleteOneRecord };
};
```

## 2. 사용 예제

```tsx
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { useDeleteOneRecord } from '@/object-record/hooks/useDeleteOneRecord';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';

export const CompanyActions = ({ companyId }: { companyId: string }) => {
  const { createOneRecord } = useCreateOneRecord({ objectNameSingular: 'company' });
  const { updateOneRecord } = useUpdateOneRecord();
  const { deleteOneRecord } = useDeleteOneRecord({ objectNameSingular: 'company' });

  return (
    <>
      <button onClick={() => createOneRecord({ name: 'New company' })}>
        Create
      </button>
      <button
        onClick={() =>
          updateOneRecord({
            objectNameSingular: 'company',
            idToUpdate: companyId,
            updateOneRecordInput: { name: 'Updated company' },
          })
        }
      >
        Update
      </button>
      <button onClick={() => deleteOneRecord(companyId)}>Delete</button>
    </>
  );
};
```
