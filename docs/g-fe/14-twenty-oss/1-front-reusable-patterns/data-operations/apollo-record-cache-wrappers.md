# Apollo Record Cache Wrappers

object metadata를 사용해 Apollo normalized cache의 fragment read/write/modify를 안전하게 감싸는 패턴이다.

핵심은 `cache access follows metadata, not hand-written fragments`다.

## 1. 모듈 코드

- `src/modules/object-record/cache/utils/getRecordFromCache.ts`: metadata 기반 fragment로 단일 record를 cache에서 읽는다.
- `src/modules/object-record/cache/utils/updateRecordFromCache.ts`: metadata 기반 fragment로 단일 record를 cache에 쓴다.
- `src/modules/object-record/cache/utils/modifyRecordFromCache.ts`: object typename/id를 계산한 뒤 `cache.modify`를 수행한다.

```tsx
// filepath: src/modules/object-record/cache/utils/getRecordFromCache.ts
export const getRecordFromCache = <TRecord extends ObjectRecord>({
  cache,
  objectMetadataItem,
  objectMetadataItems,
  recordId,
  recordGqlFields,
  objectPermissionsByObjectMetadataId,
}: {
  cache: ApolloCache<object>;
  objectMetadataItem: ObjectMetadataItem;
  objectMetadataItems: ObjectMetadataItem[];
  recordId: string;
  recordGqlFields: RecordGqlFields;
  objectPermissionsByObjectMetadataId: ObjectPermissionsByObjectMetadataId;
}) => {
  const fragment = gql`
    fragment ${capitalize(objectMetadataItem.nameSingular)}Fragment
    on ${capitalize(objectMetadataItem.nameSingular)}
    ${mapObjectMetadataToGraphQLQuery({
      objectMetadataItems,
      objectMetadataItem,
      recordGqlFields,
      objectPermissionsByObjectMetadataId,
    })}
  `;

  return cache.readFragment<TRecord>({
    id: cache.identify({
      __typename: capitalize(objectMetadataItem.nameSingular),
      id: recordId,
    }),
    fragment,
  });
};

// filepath: src/modules/object-record/cache/utils/updateRecordFromCache.ts
export const updateRecordFromCache = <TRecord extends ObjectRecord>({
  cache,
  objectMetadataItem,
  objectMetadataItems,
  record,
  recordGqlFields,
  objectPermissionsByObjectMetadataId,
}: {
  cache: ApolloCache<object>;
  objectMetadataItem: ObjectMetadataItem;
  objectMetadataItems: ObjectMetadataItem[];
  record: TRecord;
  recordGqlFields: RecordGqlFields;
  objectPermissionsByObjectMetadataId: ObjectPermissionsByObjectMetadataId;
}) => {
  const fragment = gql`
    fragment ${capitalize(objectMetadataItem.nameSingular)}Fragment
    on ${capitalize(objectMetadataItem.nameSingular)}
    ${mapObjectMetadataToGraphQLQuery({
      objectMetadataItems,
      objectMetadataItem,
      recordGqlFields,
      objectPermissionsByObjectMetadataId,
    })}
  `;

  cache.writeFragment({
    id: cache.identify({
      __typename: capitalize(objectMetadataItem.nameSingular),
      id: record.id,
    }),
    fragment,
    data: record,
  });
};

// filepath: src/modules/object-record/cache/utils/modifyRecordFromCache.ts
export const modifyRecordFromCache = ({
  cache,
  objectMetadataItem,
  recordId,
  fields,
}: {
  cache: ApolloCache<object>;
  objectMetadataItem: ObjectMetadataItem;
  recordId: string;
  fields: Modifiers;
}) => {
  cache.modify({
    id: cache.identify({
      __typename: capitalize(objectMetadataItem.nameSingular),
      id: recordId,
    }),
    fields,
  });
};
```

## 2. 사용 예제

```tsx
const cachedRecord = getRecordFromCache({
  cache: apolloCoreClient.cache,
  objectMetadataItem,
  objectMetadataItems,
  recordId,
  recordGqlFields,
  objectPermissionsByObjectMetadataId,
});

updateRecordFromCache({
  cache: apolloCoreClient.cache,
  objectMetadataItem,
  objectMetadataItems,
  record: {
    ...cachedRecord,
    name: 'Updated name',
  },
  recordGqlFields,
  objectPermissionsByObjectMetadataId,
});
```
