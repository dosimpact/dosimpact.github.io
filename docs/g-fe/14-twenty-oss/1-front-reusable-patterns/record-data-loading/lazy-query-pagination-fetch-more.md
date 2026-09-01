# Lazy Query Pagination Fetch More

initial query 실행을 caller가 명령형으로 시작하고, 이후 cursor 기반 `fetchMore`를 같은 query identifier 상태로 이어가는 패턴이다.

핵심은 `lazy execute seeds cursor state, fetchMore appends unique edges`다.

## 1. 모듈 코드

- `src/modules/object-record/hooks/useLazyFindManyRecords.ts`: lazy query를 실행하고 결과 records, totalCount, cursor, hasNextPage를 반환한다.
- `src/modules/object-record/hooks/useLazyFetchMoreRecordsWithPagination.ts`: 저장된 cursor로 다음 페이지를 가져오고 connection edges를 중복 없이 병합한다.
- `src/modules/object-record/hooks/useFetchMoreRecordsWithPagination.ts`: non-lazy query에서 같은 pagination merge 계약을 제공한다.

```tsx
// filepath: src/modules/object-record/hooks/useLazyFindManyRecords.ts
export const useLazyFindManyRecords = <T extends ObjectRecord = ObjectRecord>({
  objectNameSingular,
  filter,
  orderBy,
  limit = QUERY_DEFAULT_LIMIT_RECORDS,
  recordGqlFields,
  fetchPolicy = 'cache-first',
}: UseLazyFindManyRecordsParams<T>) => {
  const store = useStore();
  const { objectMetadataItem } = useObjectMetadataItem({ objectNameSingular });
  const apolloCoreClient = useApolloCoreClient();

  const { findManyRecordsQuery } = useFindManyRecordsQuery({
    objectNameSingular,
    recordGqlFields,
  });

  const queryIdentifier = getQueryIdentifier({
    objectNameSingular,
    filter,
    orderBy,
    limit,
  });

  const objectPermissions = useObjectPermissionsForObject(objectMetadataItem.id);

  const [findManyRecords, { data, error, fetchMore }] =
    useLazyQuery<RecordGqlOperationFindManyResult>(findManyRecordsQuery, {
      fetchPolicy,
      client: apolloCoreClient,
    });

  const { fetchMoreRecordsLazy } = useLazyFetchMoreRecordsWithPagination<T>({
    objectNameSingular,
    filter,
    orderBy,
    limit,
    fetchMore,
    data,
    error,
    objectMetadataItem,
  });

  const findManyRecordsLazy = useCallback(async () => {
    if (!objectPermissions.canReadObjectRecords) {
      store.set(hasNextPageFamilyState.atomFamily(queryIdentifier), false);
      store.set(cursorFamilyState.atomFamily(queryIdentifier), '');

      return { data: null, records: null, totalCount: 0, hasNextPage: false };
    }

    const result = await findManyRecords({
      variables: { filter, limit, orderBy },
    }).retain();

    const connection = result?.data?.[objectMetadataItem.namePlural];
    const hasNextPage = connection?.pageInfo.hasNextPage ?? false;
    const lastCursor = connection?.pageInfo.endCursor ?? '';

    store.set(hasNextPageFamilyState.atomFamily(queryIdentifier), hasNextPage);
    store.set(cursorFamilyState.atomFamily(queryIdentifier), lastCursor);

    return {
      data: result?.data,
      records: getRecordsFromRecordConnection({
        recordConnection: {
          edges: connection?.edges ?? [],
          pageInfo: connection?.pageInfo ?? {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: '',
            endCursor: '',
          },
        },
      }),
      totalCount: connection?.totalCount ?? 0,
      hasNextPage,
      error: result?.error,
    };
  }, [
    objectPermissions.canReadObjectRecords,
    findManyRecords,
    filter,
    limit,
    orderBy,
    objectMetadataItem.namePlural,
    queryIdentifier,
    store,
  ]);

  return {
    findManyRecordsLazy,
    fetchMoreRecordsLazy,
    queryIdentifier,
  };
};

// filepath: src/modules/object-record/hooks/useLazyFetchMoreRecordsWithPagination.ts
export const useLazyFetchMoreRecordsWithPagination = <
  T extends ObjectRecord = ObjectRecord,
>({
  objectNameSingular,
  filter,
  orderBy,
  limit,
  error,
  fetchMore,
  objectMetadataItem,
}: UseFindManyRecordsStateParams<T>) => {
  const store = useStore();

  const queryIdentifier = getQueryIdentifier({
    objectNameSingular,
    filter,
    limit,
    orderBy,
  });

  const fetchMoreRecordsLazy = useCallback(
    async (limit = DEFAULT_SEARCH_REQUEST_LIMIT) => {
      const hasNextPage = store.get(
        hasNextPageFamilyState.atomFamily(queryIdentifier),
      );
      const lastCursor = store.get(cursorFamilyState.atomFamily(queryIdentifier));

      if (hasNextPage || (!isAggregationEnabled(objectMetadataItem) && !error)) {
        const { data: fetchMoreDataResult } = await fetchMore({
          variables: {
            limit,
            filter,
            orderBy,
            lastCursor: isNonEmptyString(lastCursor) ? lastCursor : undefined,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            const previousEdges = prev?.[objectMetadataItem.namePlural]?.edges;
            const nextEdges = fetchMoreResult?.[objectMetadataItem.namePlural]?.edges;

            const newEdges = isNonEmptyArray(nextEdges)
              ? filterUniqueRecordEdgesByCursor([
                  ...(previousEdges ?? []),
                  ...nextEdges,
                ])
              : (previousEdges ?? []);

            const pageInfo = fetchMoreResult?.[objectMetadataItem.namePlural]?.pageInfo;

            if (isDefined(pageInfo)) {
              store.set(cursorFamilyState.atomFamily(queryIdentifier), pageInfo.endCursor ?? '');
              store.set(
                hasNextPageFamilyState.atomFamily(queryIdentifier),
                pageInfo.hasNextPage ?? false,
              );
            }

            return {
              ...prev,
              [objectMetadataItem.namePlural]: {
                __typename: getConnectionTypename(objectMetadataItem.nameSingular),
                edges: newEdges,
                pageInfo,
                totalCount:
                  fetchMoreResult?.[objectMetadataItem.namePlural].totalCount,
              },
            } as RecordGqlOperationFindManyResult;
          },
        });

        return {
          data: fetchMoreDataResult?.[objectMetadataItem.namePlural],
          totalCount: fetchMoreDataResult?.[objectMetadataItem.namePlural]?.totalCount,
          records: getRecordsFromRecordConnection({
            recordConnection: fetchMoreDataResult?.[objectMetadataItem.namePlural],
          }) as T[],
        };
      }
    },
    [queryIdentifier, objectMetadataItem, error, fetchMore, filter, orderBy, store],
  );

  return { fetchMoreRecordsLazy };
};
```

## 2. 사용 예제

```tsx
// filepath: src/modules/object-record/record-index/hooks/useRecordIndexTableLazyQuery.ts
export const useRecordIndexTableLazyQuery = (objectNameSingular: string) => {
  const params = useFindManyRecordIndexTableParams(objectNameSingular);
  const { objectMetadataItem } = useObjectMetadataItem({ objectNameSingular });
  const recordGqlFields = useRelevantRecordsGqlFields({ objectMetadataItem });

  const { fetchMoreRecordsLazy, queryIdentifier, findManyRecordsLazy } =
    useLazyFindManyRecords({
      ...params,
      recordGqlFields,
    });

  return {
    findManyRecordsLazy,
    fetchMoreRecordsLazy,
    queryIdentifier,
  };
};

// filepath: src/modules/object-record/record-table/virtualization/hooks/useTriggerInitialRecordTableDataLoad.ts
const { findManyRecordsLazy } = useRecordIndexTableLazyQuery(objectNameSingular);

const triggerInitialRecordTableDataLoad = useCallback(async () => {
  const { records, totalCount } = await findManyRecordsLazy();

  store.set(totalNumberOfRecordsToVirtualizeComponentState, totalCount);

  if (isDefined(records)) {
    upsertRecordsInStore({ partialRecords: records });
    loadRecordsToVirtualRows({
      records,
      startingRealIndex: 0,
    });
  }
}, [findManyRecordsLazy, loadRecordsToVirtualRows, upsertRecordsInStore, store]);
```
