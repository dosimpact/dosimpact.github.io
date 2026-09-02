# Record Table Virtualization Data Loader

large record table을 실제 row index와 고정된 virtual row 슬롯으로 분리하고, scroll overscan window에 필요한 page만 lazy fetch하는 패턴이다.

핵심은 `virtual rows render fixed slots, data loader maps real indexes to record ids`다.

## 1. 모듈 코드

- `src/modules/object-record/record-table/virtualization/components/RecordTableVirtualizedInitialDataLoadEffect.tsx`: view/filter/field 변화에 맞춰 initial lazy load를 트리거한다.
- `src/modules/object-record/record-table/virtualization/hooks/useTriggerInitialRecordTableDataLoad.ts`: virtual row state를 reset하고 첫 페이지 records를 store/index map에 적재한다.
- `src/modules/object-record/record-table/virtualization/hooks/useTriggerFetchPages.ts`: scroll overscan window에서 아직 loaded되지 않은 page만 offset query로 가져온다.
- `src/modules/object-record/record-table/virtualization/hooks/useLoadRecordsToVirtualRows.ts`: fetched records를 real index -> record id map과 row loading status에 반영한다.
- `src/modules/object-record/record-table/virtualization/components/RecordTableVirtualizedRowTreadmillEffect.tsx`: scroll 위치와 속도를 처리하고 필요한 page fetch를 예약한다.

```tsx
// 큰 흐름: large record table을 실제 row index와 고정된 virtual row 슬롯으로 분리하고, scroll overscan window에 필요한 page만 lazy fetch하는 패턴이다.
// 핵심 기준: `virtual rows render fixed slots, data loader maps real indexes to record ids`다.

// filepath: src/modules/object-record/record-table/virtualization/components/RecordTableVirtualizedInitialDataLoadEffect.tsx
export const RecordTableVirtualizedInitialDataLoadEffect = () => {
  const { recordTableId, objectNameSingular } = useRecordTableContextOrThrow();
  const { queryIdentifier } = useRecordIndexTableLazyQuery(objectNameSingular);
  const { triggerInitialRecordTableDataLoad } =
    useTriggerInitialRecordTableDataLoad();

  const visibleRecordFields = useAtomComponentSelectorValue(
    visibleRecordFieldsComponentSelector,
  );
  const [lastRecordTableQueryIdentifier, setLastRecordTableQueryIdentifier] =
    useAtomComponentState(lastRecordTableQueryIdentifierComponentState);
  const [
    lastContextStoreVirtualizedViewId,
    setLastContextStoreVirtualizedViewId,
  ] = useAtomComponentState(lastContextStoreVirtualizedViewIdComponentState);
  const [
    lastContextStoreVirtualizedVisibleRecordFields,
    setLastContextStoreVirtualizedVisibleRecordFields,
  ] = useAtomComponentState(
    lastContextStoreVirtualizedVisibleRecordFieldsComponentState,
  );
  const isFetchingMoreRecords = useAtomFamilyStateValue(
    isFetchingMoreRecordsFamilyState,
    recordTableId,
  );
  const { currentView } = useGetCurrentViewOnly();

  useEffect(() => {
    if (isEmpty(visibleRecordFields)) {
      return;
    }

    (async () => {
      if ((currentView?.id ?? null) !== lastContextStoreVirtualizedViewId) {
        setLastContextStoreVirtualizedViewId(currentView?.id ?? null);
        setLastRecordTableQueryIdentifier(queryIdentifier);
        setLastContextStoreVirtualizedVisibleRecordFields(visibleRecordFields);
        await triggerInitialRecordTableDataLoad();
      } else if (
        queryIdentifier !== lastRecordTableQueryIdentifier &&
        !isFetchingMoreRecords
      ) {
        setLastRecordTableQueryIdentifier(queryIdentifier);
        await triggerInitialRecordTableDataLoad();
      } else if (
        JSON.stringify(lastContextStoreVirtualizedVisibleRecordFields) !==
        JSON.stringify(visibleRecordFields)
      ) {
        const lastFields = lastContextStoreVirtualizedVisibleRecordFields ?? [];
        const currentFields = visibleRecordFields ?? [];

        setLastContextStoreVirtualizedVisibleRecordFields(visibleRecordFields);

        if (currentFields.length > lastFields.length) {
          await triggerInitialRecordTableDataLoad({
            shouldScrollToStart: isEmpty(lastFields),
          });
        }
      }
    })();
  }, [
    currentView,
    isFetchingMoreRecords,
    lastContextStoreVirtualizedViewId,
    lastContextStoreVirtualizedVisibleRecordFields,
    lastRecordTableQueryIdentifier,
    queryIdentifier,
    setLastContextStoreVirtualizedViewId,
    setLastContextStoreVirtualizedVisibleRecordFields,
    triggerInitialRecordTableDataLoad,
    visibleRecordFields,
  ]);

  return <></>;
};

// filepath: src/modules/object-record/record-table/virtualization/hooks/useTriggerInitialRecordTableDataLoad.ts
export const useTriggerInitialRecordTableDataLoad = () => {
  const { recordTableId, objectNameSingular } = useRecordTableContextOrThrow();
  const { recordLimit } = useRecordIndexContextOrThrow();
  const { findManyRecordsLazy } = useRecordIndexTableLazyQuery(objectNameSingular);
  const { upsertRecordsInStore } = useUpsertRecordsInStore();
  const { loadRecordsToVirtualRows } = useLoadRecordsToVirtualRows();
  const store = useStore();

  const triggerInitialRecordTableDataLoad = useCallback(
    async ({ shouldScrollToStart = true }: { shouldScrollToStart?: boolean } = {}) => {
      if (store.get(isInitializingVirtualTableDataLoadingComponentState)) {
        return;
      }

      store.set(isInitializingVirtualTableDataLoadingComponentState, true);

      try {
        store.set(isRecordTableInitialLoadingComponentState, true);
        resetTableFocuses();
        resetVirtualizedRowTreadmill();

        store.set(recordIdByRealIndexComponentState, new Map());
        store.set(dataLoadingStatusByRealIndexComponentState, new Map());
        store.set(recordIndexRecordIdsByGroupComponentFamilyState('no-record-group'), []);

        const { records, totalCount } = await findManyRecordsLazy();

        store.set(
          totalNumberOfRecordsToVirtualizeComponentState,
          isDefined(recordLimit) ? Math.min(totalCount, recordLimit) : totalCount,
        );

        if (isDefined(records)) {
          upsertRecordsInStore({ partialRecords: records });
          loadRecordsToVirtualRows({ records, startingRealIndex: 0 });
          reapplyRowSelection();
        }

        store.set(dataPagesLoadedComponentState, []);
        store.set(lastScrollPositionComponentState, 0);
        store.set(scrollAtRealIndexComponentState, 0);

        if (shouldScrollToStart) {
          scrollTableToPosition({ horizontalScrollInPx: 0, verticalScrollInPx: 0 });
        }
      } finally {
        store.set(isInitializingVirtualTableDataLoadingComponentState, false);
        store.set(isRecordTableInitialLoadingComponentState, false);
      }
    },
    [findManyRecordsLazy, loadRecordsToVirtualRows, recordLimit, recordTableId, store],
  );

  return { triggerInitialRecordTableDataLoad };
};

// filepath: src/modules/object-record/record-table/virtualization/hooks/useTriggerFetchPages.ts
export const useTriggerFetchPages = () => {
  const { objectNameSingular } = useRecordTableContextOrThrow();
  const { scrollWrapperHTMLElement } = useScrollWrapperHTMLElement();
  const { findManyRecordsLazyWithOffset } = useLazyFindManyRecordsWithOffset({
    objectNameSingular,
  });
  const { loadRecordsToVirtualRows } = useLoadRecordsToVirtualRows();
  const { upsertRecordsInStore } = useUpsertRecordsInStore();
  const store = useStore();

  const triggerFetchPagesWithoutDebounce = useCallback(async () => {
    if (store.get(lowDetailsActivatedComponentState)) {
      return;
    }

    const { overscanPageAtBottom, overscanPageAtTop } =
      getVirtualizationOverscanWindow(
        store.get(lastScrollPositionComponentState),
        scrollWrapperHTMLElement?.clientHeight ?? 0,
        store.get(totalNumberOfRecordsToVirtualizeComponentState) ?? 0,
      );

    const pagesAlreadyLoaded = store.get(dataPagesLoadedComponentState);
    const pagesToFetch = getContiguousIncrementalValues(
      overscanPageAtBottom - overscanPageAtTop,
      overscanPageAtTop,
    ).filter((pageNumber) => !pagesAlreadyLoaded.includes(pageNumber));

    if (pagesToFetch.length === 0) {
      return;
    }

    const startingRealIndexToFetch =
      (pagesToFetch.at(0) ?? 0) * TABLE_VIRTUALIZATION_NUMBER_OF_RECORDS_PER_PAGE;
    const numberOfRecordsToFetch =
      ((pagesToFetch.at(-1) ?? 0) + 1) *
        TABLE_VIRTUALIZATION_NUMBER_OF_RECORDS_PER_PAGE -
      startingRealIndexToFetch;

    const fetchResult = await findManyRecordsLazyWithOffset(
      numberOfRecordsToFetch,
      startingRealIndexToFetch,
    );

    if (isDefined(fetchResult.records)) {
      loadRecordsToVirtualRows({
        records: fetchResult.records,
        startingRealIndex: startingRealIndexToFetch,
      });
      upsertRecordsInStore({ partialRecords: fetchResult.records });
    }

    store.set(dataPagesLoadedComponentState, (currentLoadedPages) =>
      currentLoadedPages.concat(pagesToFetch).toSorted(),
    );
  }, [
    findManyRecordsLazyWithOffset,
    loadRecordsToVirtualRows,
    scrollWrapperHTMLElement,
    store,
    upsertRecordsInStore,
  ]);

  const triggerFetchPages = useDebouncedCallback(
    triggerFetchPagesWithoutDebounce,
    25,
    { maxWait: 2000 },
  );

  return { triggerFetchPages, triggerFetchPagesWithoutDebounce };
};

// filepath: src/modules/object-record/record-table/virtualization/hooks/useLoadRecordsToVirtualRows.ts
export const useLoadRecordsToVirtualRows = () => {
  const store = useStore();

  const loadRecordsToVirtualRows = useCallback(
    ({
      records,
      startingRealIndex,
    }: {
      records: ObjectRecord[];
      startingRealIndex: number;
    }) => {
      const newRecordIdMap = new Map(store.get(recordIdByRealIndexComponentState));
      const newStatusMap = new Map(
        store.get(dataLoadingStatusByRealIndexComponentState),
      );

      for (const [recordIndex, record] of records.entries()) {
        const realIndex = startingRealIndex + recordIndex;

        newRecordIdMap.set(realIndex, record.id);
        newStatusMap.set(realIndex, 'loaded');
      }

      store.set(recordIdByRealIndexComponentState, newRecordIdMap);
      store.set(dataLoadingStatusByRealIndexComponentState, newStatusMap);

      const recordIds = records.map((record) => record.id);
      const newAllRecordIds = store
        .get(recordIndexRecordIdsByGroupComponentFamilyState('no-record-group'))
        .concat();

      for (let index = 0; index < records.length; index++) {
        newAllRecordIds[index + startingRealIndex] = recordIds[index];
      }

      store.set(
        recordIndexRecordIdsByGroupComponentFamilyState('no-record-group'),
        newAllRecordIds,
      );
    },
    [store],
  );

  return { loadRecordsToVirtualRows };
};

// filepath: src/modules/object-record/record-table/virtualization/components/RecordTableVirtualizedRowTreadmillEffect.tsx
export const RecordTableVirtualizedRowTreadmillEffect = () => {
  const { scrollWrapperHTMLElement } = useScrollWrapperHTMLElement();
  const { triggerFetchPages } = useTriggerFetchPages();
  const { processTreadmillScrollTop } = useProcessTreadmillScrollTop();

  const handleScrollDebounced = useDebouncedCallback(
    processTreadmillScrollTop,
    20,
    { leading: true, trailing: true, maxWait: 20 },
  );

  const handleAfterLastScroll = useCallback(
    (scrollEvent: Event) => {
      processTreadmillScrollTop((scrollEvent.target as HTMLElement).scrollTop);
      triggerFetchPages();
    },
    [processTreadmillScrollTop, triggerFetchPages],
  );

  const handleScrollEvent = useCallback(
    (scrollEvent: Event) => {
      handleScrollDebounced((scrollEvent.target as HTMLElement).scrollTop);
      handleAfterLastScroll(scrollEvent);
    },
    [handleAfterLastScroll, handleScrollDebounced],
  );

  useEffect(() => {
    scrollWrapperHTMLElement?.addEventListener('scroll', handleScrollEvent);

    return () => {
      scrollWrapperHTMLElement?.removeEventListener('scroll', handleScrollEvent);
    };
  }, [scrollWrapperHTMLElement, handleScrollEvent]);

  return <></>;
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Record Table Virtualization Data Loader 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/object-record/record-table/components/RecordTableBodyEffectsWrapper.tsx
export const RecordTableBodyEffectsWrapper = ({ hasRecordGroups, tableBodyRef }) => {
  return (
    <>
      {hasRecordGroups ? (
        <RecordTableRecordGroupBodyEffects />
      ) : (
        <>
          <RecordTableEmptyHasNewRecordEffect />
          <RecordTableNoRecordGroupScrollToPreviousRecordEffect />
          <RecordTableVirtualizedInitialDataLoadEffect />
          <RecordTableVirtualizedFieldMetadataUpdateEffect />
        </>
      )}
      <RecordTableBodyFocusClickOutsideEffect tableBodyRef={tableBodyRef} />
    </>
  );
};

// filepath: src/modules/object-record/record-table/record-table-body/components/RecordTableNoRecordGroupBody.tsx
export const RecordTableNoRecordGroupBody = () => {
  const recordTableHasRecords = useAtomComponentSelectorValue(
    recordIndexHasRecordsComponentSelector,
  );
  const isRecordTableInitialLoading = useAtomComponentStateValue(
    isRecordTableInitialLoadingComponentState,
  );

  if (isRecordTableInitialLoading && !recordTableHasRecords) {
    return <RecordTableBodyLoading />;
  }

  return (
    <RecordTableNoRecordGroupBodyContextProvider>
      <RecordTableBodyNoRecordGroupDragDropContextProvider>
        <RecordTableBody>
          <RecordTableNoRecordGroupRows />
          <RecordTableCellPortals />
        </RecordTableBody>
        {!isRecordTableInitialLoading && recordTableHasRecords && (
          <RecordTableAggregateFooter />
        )}
        <RecordTableVirtualizedRowTreadmillEffect />
        <RecordTableVirtualizedDataChangedEffect />
        <RecordTableVirtualizedSSESubscribeEffect />
      </RecordTableBodyNoRecordGroupDragDropContextProvider>
    </RecordTableNoRecordGroupBodyContextProvider>
  );
};
```
