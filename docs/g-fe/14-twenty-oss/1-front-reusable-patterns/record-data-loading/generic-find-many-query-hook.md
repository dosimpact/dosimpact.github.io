# Generic Find Many Query Hook

object name, filter, sort, pagination, field selection을 받아 metadata 기반 list query와 cursor state를 한 hook으로 감싸는 패턴이다.

핵심은 `caller passes object intent, hook owns GraphQL document and pagination state`다.

## 1. 모듈 코드

- `src/modules/object-record/hooks/useFindManyRecords.ts`: metadata, permissions, soft-delete filter, query execution, completion/error handling, fetchMore wrapper를 묶는다.
- `src/modules/object-record/hooks/useFindManyRecordsQuery.ts`: object metadata와 requested fields로 find-many GraphQL document를 memoize한다.
- `src/modules/object-record/hooks/useHandleFindManyRecordsCompleted.ts`: connection 결과를 records로 풀고 cursor/hasNextPage atom state를 갱신한다.

```tsx
// filepath: src/modules/object-record/hooks/useFindManyRecords.ts
export const useFindManyRecords = <T extends ObjectRecord = ObjectRecord>({
  objectNameSingular,
  filter,
  orderBy,
  skip,
  recordGqlFields,
  fetchPolicy,
  onError,
  onCompleted,
  cursorFilter,
  limit = QUERY_DEFAULT_LIMIT_RECORDS,
  withSoftDeleted = false,
}: UseFindManyRecordsParams<T>) => {
  const { objectMetadataItem } = useObjectMetadataItem({ objectNameSingular });
  const apolloCoreClient = useApolloCoreClient();

  const { findManyRecordsQuery } = useFindManyRecordsQuery({
    objectNameSingular,
    recordGqlFields,
    cursorDirection: cursorFilter?.cursorDirection,
  });

  const withSoftDeleteFilter = withSoftDeleted
    ? {
        and: [
          ...(filter ? [filter] : []),
          { or: [{ deletedAt: { is: 'NULL' } }, { deletedAt: { is: 'NOT_NULL' } }] },
        ],
      }
    : filter;

  const queryIdentifier = getQueryIdentifier({
    objectNameSingular,
    filter: withSoftDeleteFilter,
    orderBy,
    limit,
  });

  const { handleFindManyRecordsCompleted } = useHandleFindManyRecordsCompleted({
    objectMetadataItem,
    queryIdentifier,
    onCompleted,
  });

  const { handleFindManyRecordsError } = useHandleFindManyRecordsError({
    objectMetadataItem,
    handleError: onError,
  });

  const objectPermissions = useObjectPermissionsForObject(objectMetadataItem.id);

  const { data, loading, error, fetchMore, refetch } =
    useQuery<RecordGqlOperationFindManyResult>(findManyRecordsQuery, {
      skip:
        skip ||
        !isDefined(objectMetadataItem) ||
        !objectPermissions.canReadObjectRecords,
      variables: {
        filter: withSoftDeleteFilter,
        orderBy,
        lastCursor: cursorFilter?.cursor ?? undefined,
        limit,
      },
      fetchPolicy,
      client: apolloCoreClient,
    });

  useEffect(() => {
    if (data) {
      handleFindManyRecordsCompleted(data);
    }
  }, [data, handleFindManyRecordsCompleted]);

  useEffect(() => {
    if (error) {
      handleFindManyRecordsError(error);
    }
  }, [error, handleFindManyRecordsError]);

  const { fetchMoreRecords, records, hasNextPage } =
    useFetchMoreRecordsWithPagination<T>({
      objectNameSingular,
      filter: withSoftDeleteFilter,
      orderBy,
      limit,
      fetchMore,
      data,
      error,
      objectMetadataItem,
    });

  return {
    objectMetadataItem,
    records,
    totalCount: data?.[objectMetadataItem.namePlural]?.totalCount,
    loading,
    error,
    fetchMoreRecords,
    queryIdentifier,
    hasNextPage,
    pageInfo: data?.[objectMetadataItem.namePlural]?.pageInfo,
    refetch,
  };
};

// filepath: src/modules/object-record/hooks/useFindManyRecordsQuery.ts
export const useFindManyRecordsQuery = ({
  objectNameSingular,
  recordGqlFields,
  computeReferences,
  cursorDirection = 'after',
}: {
  objectNameSingular: string;
  recordGqlFields?: RecordGqlOperationGqlRecordFields;
  computeReferences?: boolean;
  cursorDirection?: QueryCursorDirection;
}) => {
  const { objectMetadataItem } = useObjectMetadataItem({ objectNameSingular });
  const objectMetadataItems = useAtomStateValue(objectMetadataItemsSelector);
  const { objectPermissionsByObjectMetadataId } = useObjectPermissions();

  const findManyRecordsQuery = useMemo(
    () =>
      generateFindManyRecordsQuery({
        objectMetadataItem,
        objectMetadataItems,
        recordGqlFields,
        computeReferences,
        cursorDirection,
        objectPermissionsByObjectMetadataId,
      }),
    [
      objectMetadataItem,
      objectMetadataItems,
      recordGqlFields,
      computeReferences,
      cursorDirection,
      objectPermissionsByObjectMetadataId,
    ],
  );

  return { findManyRecordsQuery };
};

// filepath: src/modules/object-record/hooks/useHandleFindManyRecordsCompleted.ts
export const useHandleFindManyRecordsCompleted = <T>({
  queryIdentifier,
  onCompleted,
  objectMetadataItem,
}: {
  queryIdentifier: string;
  objectMetadataItem: EnrichedObjectMetadataItem;
  onCompleted?: OnFindManyRecordsCompleted<T>;
}) => {
  const store = useStore();

  const handleFindManyRecordsCompleted = useCallback(
    (data: RecordGqlOperationFindManyResult) => {
      const pageInfo = data?.[objectMetadataItem.namePlural]?.pageInfo;
      const records = getRecordsFromRecordConnection({
        recordConnection: data?.[objectMetadataItem.namePlural],
      }) as T[];

      onCompleted?.(records, {
        pageInfo,
        totalCount: data?.[objectMetadataItem.namePlural]?.totalCount,
      });

      if (isDefined(data?.[objectMetadataItem.namePlural])) {
        store.set(cursorFamilyState.atomFamily(queryIdentifier), pageInfo.endCursor ?? '');
        store.set(
          hasNextPageFamilyState.atomFamily(queryIdentifier),
          pageInfo.hasNextPage ?? false,
        );
      }
    },
    [objectMetadataItem.namePlural, onCompleted, queryIdentifier, store],
  );

  return { handleFindManyRecordsCompleted };
};
```

## 2. 사용 예제

```tsx
// filepath: src/modules/object-record/record-index/hooks/useRecordIndexTableQuery.ts
export const useRecordIndexTableQuery = (objectNameSingular: string) => {
  const params = useFindManyRecordIndexTableParams(objectNameSingular);
  const { objectMetadataItem } = useObjectMetadataItem({ objectNameSingular });
  const recordGqlFields = useRelevantRecordsGqlFields({ objectMetadataItem });

  const {
    records,
    hasNextPage,
    queryIdentifier,
    loading,
    error,
    totalCount,
    fetchMoreRecords,
  } = useFindManyRecords({
    ...params,
    recordGqlFields,
  });

  return {
    records,
    loading,
    error,
    hasNextPage,
    queryIdentifier,
    totalCount,
    fetchMoreRecords,
  };
};

// filepath: src/modules/object-record/record-list/components/RecordListRecordGroup.tsx
export const RecordListRecordGroup = () => {
  const { objectNameSingular } = useRecordListContextOrThrow();

  const { records, loading, error, hasNextPage, fetchMoreRecords } =
    useRecordIndexTableQuery(objectNameSingular);

  return (
    <RecordListRecords
      records={records}
      loading={loading}
      error={error}
      hasNextPage={hasNextPage}
      fetchMoreRecords={fetchMoreRecords}
      isVisible
    />
  );
};
```
