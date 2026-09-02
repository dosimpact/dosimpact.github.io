# View Filter/Sort Apply-Save Pipeline

화면의 임시 record filter/sort state와 persisted view metadata를 서로 적용하고 저장하는 패턴이다.

## 1. 모듈 코드

- `src/modules/views/hooks/useApplyCurrentViewFiltersToCurrentRecordFilters.ts`: current view의 persisted filters를 현재 화면 record filter state로 되돌린다.
- `src/modules/views/hooks/useApplyCurrentViewSortsToCurrentRecordSorts.ts`: current view의 persisted sorts를 현재 화면 record sort state로 되돌린다.
- `src/modules/views/hooks/useSaveRecordFiltersAndGroupFiltersToViewFiltersAndGroupFilters.ts`: 현재 화면 filter/group state를 view filter/group metadata와 diff한 뒤 create/update/destroy로 저장한다.
- `src/modules/views/hooks/useSaveRecordSortsToViewSorts.ts`: 현재 화면 sort state를 view sort metadata와 diff한 뒤 create/update/destroy로 저장한다.
- `src/modules/views/hooks/useSaveCurrentViewFiltersAndSorts.ts`: sort, filter/group, any-field filter 저장 순서를 하나의 save command로 묶는다.

```tsx
// 큰 흐름: 화면의 임시 record filter/sort state와 persisted view metadata를 서로 적용하고 저장하는 패턴이다.

// filepath: src/modules/views/hooks/useApplyCurrentViewFiltersToCurrentRecordFilters.ts
export const useApplyCurrentViewFiltersToCurrentRecordFilters = () => {
  const contextStoreCurrentViewId = useAtomComponentStateValue(
    contextStoreCurrentViewIdComponentState,
  );
  const setCurrentRecordFilters = useSetAtomComponentState(
    currentRecordFiltersComponentState,
  );
  const { mapViewFiltersToRecordFilters } = useMapViewFiltersToFilters();
  const store = useStore();

  const applyCurrentViewFiltersToCurrentRecordFilters = useCallback(() => {
    const currentView = store.get(
      viewFromViewIdFamilySelector.selectorFamily({
        viewId: contextStoreCurrentViewId ?? '',
      }),
    );

    if (isDefined(currentView)) {
      setCurrentRecordFilters(
        mapViewFiltersToRecordFilters(currentView.viewFilters),
      );
    }
  }, [contextStoreCurrentViewId, mapViewFiltersToRecordFilters, setCurrentRecordFilters, store]);

  return { applyCurrentViewFiltersToCurrentRecordFilters };
};

// filepath: src/modules/views/hooks/useApplyCurrentViewSortsToCurrentRecordSorts.ts
export const useApplyCurrentViewSortsToCurrentRecordSorts = () => {
  const contextStoreCurrentViewId = useAtomComponentStateValue(
    contextStoreCurrentViewIdComponentState,
  );
  const currentView = useAtomFamilySelectorValue(viewFromViewIdFamilySelector, {
    viewId: contextStoreCurrentViewId ?? '',
  });
  const setCurrentRecordSorts = useSetAtomComponentState(
    currentRecordSortsComponentState,
  );

  const applyCurrentViewSortsToCurrentRecordSorts = () => {
    if (isDefined(currentView)) {
      setCurrentRecordSorts(
        currentView.viewSorts.map(({ viewId: _viewId, ...recordSort }) => recordSort),
      );
    }
  };

  return { applyCurrentViewSortsToCurrentRecordSorts };
};

// filepath: src/modules/views/hooks/useSaveRecordFiltersAndGroupFiltersToViewFiltersAndGroupFilters.ts
export const useSaveRecordFiltersAndGroupFiltersToViewFiltersAndGroupFilters = () => {
  const { canPersistChanges } = useCanPersistViewChanges();
  const { currentView } = useGetCurrentViewOnly();
  const store = useStore();
  const { performViewFilterGroupAPICreate, performViewFilterGroupAPIUpdate, performViewFilterGroupAPIDestroy } =
    usePerformViewFilterGroupAPIPersist();
  const { performViewFilterAPICreate, performViewFilterAPIUpdate, performViewFilterAPIDestroy } =
    usePerformViewFilterAPIPersist();

  const saveRecordFiltersAndGroupFiltersToViewFiltersAndGroupFilters = useCallback(async () => {
    if (!canPersistChanges || !isDefined(currentView)) return;

    const currentViewFilterGroups = currentView.viewFilterGroups ?? [];
    const currentRecordFilterGroups = store.get(currentRecordFilterGroupsCallbackState);
    const newViewFilterGroups = currentRecordFilterGroups.map((recordFilterGroup) =>
      mapRecordFilterGroupToViewFilterGroup({ recordFilterGroup, view: currentView }),
    );

    const viewFilterGroupsToCreate = getViewFilterGroupsToCreate(currentViewFilterGroups, newViewFilterGroups);
    const viewFilterGroupsToDelete = getViewFilterGroupsToDelete(currentViewFilterGroups, newViewFilterGroups);
    const viewFilterGroupsToUpdate = getViewFilterGroupsToUpdate(currentViewFilterGroups, newViewFilterGroups);
    const viewFilterGroupIdsToDestroy = viewFilterGroupsToDelete.map((viewFilterGroup) => viewFilterGroup.id);

    if ((await performViewFilterGroupAPICreate(viewFilterGroupsToCreate, currentView)).status === 'failed') return;
    if ((await performViewFilterGroupAPIUpdate(viewFilterGroupsToUpdate)).status === 'failed') return;

    const currentViewFilters = currentView.viewFilters ?? [];
    const currentRecordFilters = store.get(currentRecordFiltersCallbackState);
    const newViewFilters = currentRecordFilters.map(mapRecordFilterToViewFilter);

    const viewFiltersToCreate = getViewFiltersToCreate(currentViewFilters, newViewFilters);
    const viewFiltersToDelete = getViewFiltersToDelete(currentViewFilters, newViewFilters).filter(
      (viewFilter) =>
        !isDefined(viewFilter.viewFilterGroupId) ||
        !viewFilterGroupIdsToDestroy.includes(viewFilter.viewFilterGroupId),
    );
    const viewFiltersToUpdate = getViewFiltersToUpdate(currentViewFilters, newViewFilters);

    if ((await performViewFilterAPICreate(toCreateViewFilterInputs(viewFiltersToCreate, currentView.id))).status === 'failed') return;
    if ((await performViewFilterAPIUpdate(toUpdateViewFilterInputs(viewFiltersToUpdate))).status === 'failed') return;
    if ((await performViewFilterAPIDestroy(toDestroyViewFilterInputs(viewFiltersToDelete))).status === 'failed') return;
    if ((await performViewFilterGroupAPIDestroy(viewFilterGroupIdsToDestroy)).status === 'failed') return;

    // DB cascade removes filters for destroyed groups, so the local metadata store mirrors it.
    removeCascadeDeletedViewFiltersFromStore(viewFilterGroupIdsToDestroy);
  }, [canPersistChanges, currentView, store]);

  return { saveRecordFiltersAndGroupFiltersToViewFiltersAndGroupFilters };
};

// filepath: src/modules/views/hooks/useSaveRecordSortsToViewSorts.ts
export const useSaveRecordSortsToViewSorts = () => {
  const { canPersistChanges } = useCanPersistViewChanges();
  const { currentView } = useGetCurrentViewOnly();
  const { performViewSortAPICreate, performViewSortAPIUpdate, performViewSortAPIDestroy } =
    usePerformViewSortAPIPersist();
  const store = useStore();

  const saveRecordSortsToViewSorts = useCallback(async () => {
    if (!canPersistChanges || !isDefined(currentView)) return;

    const currentViewSorts = currentView.viewSorts ?? [];
    const currentRecordSorts = store.get(currentRecordSortsCallbackState);
    const newViewSorts = currentRecordSorts.map(mapRecordSortToViewSort);

    const viewSortsToCreate = getViewSortsToCreate(currentViewSorts, newViewSorts);
    const viewSortsToDelete = getViewSortsToDelete(currentViewSorts, newViewSorts);
    const viewSortsToUpdate = getViewSortsToUpdate(currentViewSorts, newViewSorts);

    if ((await performViewSortAPICreate(toCreateViewSortInputs(viewSortsToCreate, currentView.id))).status === 'failed') return;
    if ((await performViewSortAPIUpdate(toUpdateViewSortInputs(viewSortsToUpdate))).status === 'failed') return;
    if ((await performViewSortAPIDestroy(toDestroyViewSortInputs(viewSortsToDelete))).status === 'failed') return;
  }, [canPersistChanges, currentView, store]);

  return { saveRecordSortsToViewSorts };
};

// filepath: src/modules/views/hooks/useSaveCurrentViewFiltersAndSorts.ts
export const useSaveCurrentViewFiltersAndSorts = () => {
  const { saveRecordFiltersAndGroupFiltersToViewFiltersAndGroupFilters } =
    useSaveRecordFiltersAndGroupFiltersToViewFiltersAndGroupFilters();
  const { saveRecordSortsToViewSorts } = useSaveRecordSortsToViewSorts();
  const { saveAnyFieldFilterToView } = useSaveAnyFieldFilterToView();

  const saveCurrentViewFilterAndSorts = async () => {
    await saveRecordSortsToViewSorts();
    await saveRecordFiltersAndGroupFiltersToViewFiltersAndGroupFilters();
    await saveAnyFieldFilterToView();
  };

  return { saveCurrentViewFilterAndSorts };
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: View Filter/Sort Apply-Save Pipeline 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/views/components/ViewBarDetails.tsx
export const ViewBarDetails = () => {
  const { viewFilterGroupsAreDifferentFromRecordFilterGroups } =
    useAreViewFilterGroupsDifferentFromRecordFilterGroups();
  const { viewFiltersAreDifferentFromRecordFilters } =
    useAreViewFiltersDifferentFromRecordFilters();
  const { viewSortsAreDifferentFromRecordSorts } =
    useAreViewSortsDifferentFromRecordSorts();

  const { applyCurrentViewFilterGroupsToCurrentRecordFilterGroups } =
    useApplyCurrentViewFilterGroupsToCurrentRecordFilterGroups();
  const { applyCurrentViewFiltersToCurrentRecordFilters } =
    useApplyCurrentViewFiltersToCurrentRecordFilters();
  const { applyCurrentViewSortsToCurrentRecordSorts } =
    useApplyCurrentViewSortsToCurrentRecordSorts();

  const handleCancelClick = () => {
    applyCurrentViewFilterGroupsToCurrentRecordFilterGroups();
    applyCurrentViewFiltersToCurrentRecordFilters();
    applyCurrentViewSortsToCurrentRecordSorts();
    applyCurrentViewAnyFieldFilterToAnyFieldFilter();
    toggleSoftDeleteFilterState(false);
  };

  const canResetView =
    (viewFiltersAreDifferentFromRecordFilters ||
      viewSortsAreDifferentFromRecordSorts ||
      viewFilterGroupsAreDifferentFromRecordFilterGroups) &&
    !hasFiltersQueryParams;

  return (
    <ViewBarSaveAndCancel
      canResetView={canResetView}
      onCancel={handleCancelClick}
      onSave={saveCurrentViewFilterAndSorts}
    />
  );
};
```
