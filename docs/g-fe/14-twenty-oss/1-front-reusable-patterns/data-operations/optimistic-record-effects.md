# Optimistic Record Effects

mutation 응답을 기다리지 않고 Apollo connection cache, grouped query cache, local record store를 먼저 갱신하는 패턴이다.

핵심은 `compute optimistic record, write cache, broadcast effect`다.

## 1. 모듈 코드

- `src/modules/object-record/utils/computeOptimisticRecordFromInput.ts`: record input을 cache에 쓸 수 있는 optimistic record shape로 변환한다.
- `src/modules/apollo/optimistic-effect/utils/triggerCreateRecordsOptimisticEffect.ts`: create된 record를 root query connection과 store에 반영한다.
- `src/modules/apollo/optimistic-effect/utils/triggerUpdateRecordOptimisticEffect.ts`: update된 record가 filter/order/group 조건에 맞게 남거나 빠지도록 cache를 동기화한다.

```tsx
// filepath: src/modules/object-record/utils/computeOptimisticRecordFromInput.ts
export const computeOptimisticRecordFromInput = ({
  cache,
  currentWorkspaceMember,
  objectMetadataItem,
  objectMetadataItems,
  objectPermissionsByObjectMetadataId,
  recordInput,
}: {
  cache: ApolloCache<object>;
  currentWorkspaceMember: WorkspaceMember;
  objectMetadataItem: ObjectMetadataItem;
  objectMetadataItems: ObjectMetadataItem[];
  objectPermissionsByObjectMetadataId: ObjectPermissionsByObjectMetadataId;
  recordInput: Record<string, unknown>;
}) => {
  return Object.fromEntries(
    Object.entries(recordInput).map(([fieldName, fieldValue]) => {
      return [
        fieldName,
        computeOptimisticFieldValue({
          cache,
          currentWorkspaceMember,
          fieldName,
          fieldValue,
          objectMetadataItem,
          objectMetadataItems,
          objectPermissionsByObjectMetadataId,
        }),
      ];
    }),
  );
};

// filepath: src/modules/apollo/optimistic-effect/utils/triggerCreateRecordsOptimisticEffect.ts
export const triggerCreateRecordsOptimisticEffect = ({
  cache,
  objectMetadataItem,
  recordsToCreate,
  objectMetadataItems,
  objectPermissionsByObjectMetadataId,
  upsertRecordsInStore,
}: {
  cache: ApolloCache<object>;
  objectMetadataItem: ObjectMetadataItem;
  recordsToCreate: ObjectRecord[];
  objectMetadataItems: ObjectMetadataItem[];
  objectPermissionsByObjectMetadataId: ObjectPermissionsByObjectMetadataId;
  upsertRecordsInStore: (records: ObjectRecord[]) => void;
}) => {
  upsertRecordsInStore(recordsToCreate);

  triggerUpdateRecordOptimisticEffectByBatch({
    cache,
    objectMetadataItem,
    recordsToCreate,
    objectMetadataItems,
    objectPermissionsByObjectMetadataId,
  });
};

// filepath: src/modules/apollo/optimistic-effect/utils/triggerUpdateRecordOptimisticEffect.ts
export const triggerUpdateRecordOptimisticEffect = ({
  cache,
  objectMetadataItem,
  currentRecord,
  updatedRecord,
  objectMetadataItems,
  objectPermissionsByObjectMetadataId,
  upsertRecordsInStore,
}: {
  cache: ApolloCache<object>;
  objectMetadataItem: ObjectMetadataItem;
  currentRecord: ObjectRecord;
  updatedRecord: ObjectRecord;
  objectMetadataItems: ObjectMetadataItem[];
  objectPermissionsByObjectMetadataId: ObjectPermissionsByObjectMetadataId;
  upsertRecordsInStore: (records: ObjectRecord[]) => void;
}) => {
  upsertRecordsInStore([updatedRecord]);

  triggerUpdateRecordOptimisticEffectByBatch({
    cache,
    objectMetadataItem,
    recordsToUpdate: [{ currentRecord, updatedRecord }],
    objectMetadataItems,
    objectPermissionsByObjectMetadataId,
  });
};
```

## 2. 사용 예제

```tsx
const optimisticRecord = computeOptimisticRecordFromInput({
  cache: apolloCoreClient.cache,
  currentWorkspaceMember,
  objectMetadataItem,
  objectMetadataItems,
  objectPermissionsByObjectMetadataId,
  recordInput: updateOneRecordInput,
});

triggerUpdateRecordOptimisticEffect({
  cache: apolloCoreClient.cache,
  objectMetadataItem,
  currentRecord: cachedRecordNode,
  updatedRecord: {
    ...cachedRecordNode,
    ...optimisticRecord,
  },
  objectMetadataItems,
  objectPermissionsByObjectMetadataId,
  upsertRecordsInStore,
});
```
