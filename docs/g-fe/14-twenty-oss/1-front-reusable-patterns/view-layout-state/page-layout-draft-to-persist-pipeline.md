# Page Layout Draft-To-Persist Pipeline

Page layout을 instance-scoped draft state로 편집하고, 저장 시 GraphQL update input으로 변환해 persisted state를 갱신하는 패턴이다.

## 1. 모듈 코드

- `src/modules/page-layout/states/pageLayoutDraftComponentState.ts`: layout instance별 편집용 draft snapshot을 보관한다.
- `src/modules/page-layout/states/pageLayoutPersistedComponentState.ts`: layout instance별 서버 기준 persisted snapshot을 보관한다.
- `src/modules/page-layout/components/PageLayoutInitializationQueryEffect.tsx`: 서버 layout을 persisted, draft, current grid layouts state에 초기 주입한다.
- `src/modules/page-layout/hooks/usePageLayoutDraftState.ts`: draft, setter, dirty, canSave를 하나의 hook으로 노출한다.
- `src/modules/page-layout/hooks/useSavePageLayout.ts`: pending widget view 생성, draft sanitize, update input 변환, mutation, persisted state 갱신을 수행한다.
- `src/modules/page-layout/hooks/useResetDraftPageLayoutToPersistedPageLayout.ts`: cancel/reset 시 persisted snapshot으로 draft와 부가 widget draft state를 되돌린다.

```tsx
// filepath: src/modules/page-layout/states/pageLayoutDraftComponentState.ts
export const pageLayoutDraftComponentState =
  createAtomComponentState<DraftPageLayout>({
    key: 'pageLayoutDraftComponentState',
    defaultValue: {
      id: '',
      name: '',
      type: PageLayoutType.DASHBOARD,
      objectMetadataId: null,
      tabs: [],
      defaultTabToFocusOnMobileAndSidePanelId: null,
      isFirstTabPinned: true,
    },
    componentInstanceContext: PageLayoutComponentInstanceContext,
  });

// filepath: src/modules/page-layout/states/pageLayoutPersistedComponentState.ts
export const pageLayoutPersistedComponentState = createAtomComponentState<
  PageLayout | undefined
>({
  key: 'pageLayoutPersistedComponentState',
  defaultValue: undefined,
  componentInstanceContext: PageLayoutComponentInstanceContext,
});

// filepath: src/modules/page-layout/components/PageLayoutInitializationQueryEffect.tsx
export const PageLayoutInitializationQueryEffect = ({ pageLayoutId }: Props) => {
  const pageLayout = useBasePageLayout(pageLayoutId);
  const [pageLayoutIsInitialized, setPageLayoutIsInitialized] =
    useAtomComponentState(pageLayoutIsInitializedComponentState);
  const { setIsPageLayoutInEditMode } = useSetIsPageLayoutInEditMode(pageLayoutId);
  const store = useStore();

  const initializePageLayout = useCallback((layout: PageLayout) => {
    const currentPersisted = store.get(pageLayoutPersistedComponentCallbackState);

    if (!isDeeplyEqual(layout, currentPersisted)) {
      store.set(pageLayoutPersistedComponentCallbackState, layout);
    }

    store.set(pageLayoutDraftComponentCallbackState, toDraftPageLayout(layout));
    store.set(pageLayoutCurrentLayoutsComponentCallbackState, convertPageLayoutToTabLayouts(layout));

    if (layout.type === PageLayoutType.DASHBOARD) {
      setIsPageLayoutInEditMode(isPageLayoutEmpty(layout));
    }
  }, [setIsPageLayoutInEditMode, store]);

  useEffect(() => {
    if (!pageLayoutIsInitialized && isDefined(pageLayout)) {
      initializePageLayout(pageLayout);
      setPageLayoutIsInitialized(true);
    }
  }, [initializePageLayout, pageLayoutIsInitialized, pageLayout, setPageLayoutIsInitialized]);

  return null;
};

// filepath: src/modules/page-layout/hooks/usePageLayoutDraftState.ts
export const usePageLayoutDraftState = (pageLayoutIdFromProps?: string) => {
  const pageLayoutId = useAvailableComponentInstanceIdOrThrow(
    PageLayoutComponentInstanceContext,
    pageLayoutIdFromProps,
  );

  const [pageLayoutDraft, setPageLayoutDraft] = useAtomComponentState(
    pageLayoutDraftComponentState,
    pageLayoutId,
  );
  const pageLayoutPersisted = useAtomComponentStateValue(
    pageLayoutPersistedComponentState,
    pageLayoutId,
  );

  const isDirty = pageLayoutPersisted
    ? !isDeeplyEqual(pageLayoutDraft, toDraftPageLayout(pageLayoutPersisted))
    : pageLayoutDraft.name.trim().length > 0 || pageLayoutDraft.tabs.length > 0;

  const canSave = pageLayoutDraft.name?.trim().length > 0;

  return { pageLayoutDraft, setPageLayoutDraft, isDirty, canSave };
};

// filepath: src/modules/page-layout/utils/convertPageLayoutDraftToUpdateInput.ts
export const convertPageLayoutDraftToUpdateInput = (
  pageLayoutDraft: DraftPageLayout,
): UpdatePageLayoutWithTabsInput => ({
  name: pageLayoutDraft.name,
  type: pageLayoutDraft.type,
  objectMetadataId: pageLayoutDraft.objectMetadataId ?? null,
  isFirstTabPinned: pageLayoutDraft.isFirstTabPinned,
  tabs: pageLayoutDraft.tabs
    .filter((tab) => tab.isActive)
    .map((tab) => ({
      id: tab.id,
      title: tab.title,
      position: tab.position,
      icon: tab.icon ?? null,
      layoutMode: tab.layoutMode,
      widgets: tab.widgets.map((widget, widgetIndex) => ({
        id: widget.id,
        pageLayoutTabId: widget.pageLayoutTabId,
        title: widget.title,
        type: widget.type,
        objectMetadataId: widget.objectMetadataId ?? null,
        position: buildWidgetPosition(widget, widgetIndex, tab.layoutMode ?? PageLayoutTabLayoutMode.GRID),
        configuration: widget.configuration ?? null,
        conditionalAvailabilityExpression: widget.conditionalAvailabilityExpression ?? null,
      })),
    })),
});

// filepath: src/modules/page-layout/hooks/useSavePageLayout.ts
export const useSavePageLayout = (pageLayoutIdFromProps: string) => {
  const pageLayoutId = useAvailableComponentInstanceIdOrThrow(
    PageLayoutComponentInstanceContext,
    pageLayoutIdFromProps,
  );
  const { updatePageLayoutWithTabsAndWidgets } = useUpdatePageLayoutWithTabsAndWidgets();
  const { createPendingFieldsWidgetViews } = useCreatePendingFieldsWidgetViews();
  const { createPendingRecordTableWidgetViews } = useCreatePendingRecordTableWidgetViews();
  const store = useStore();

  const savePageLayout = useCallback(async () => {
    await createPendingFieldsWidgetViews(pageLayoutId);
    await createPendingRecordTableWidgetViews(pageLayoutId);

    const pageLayoutDraft = store.get(pageLayoutDraftCallbackState);
    const sanitizedPageLayoutDraft = sanitizeChartFiltersInPageLayoutDraft({
      pageLayoutDraft,
      validFieldMetadataIdsByObjectMetadataId,
    });
    const updateInput = convertPageLayoutDraftToUpdateInput(sanitizedPageLayoutDraft);
    const result = await updatePageLayoutWithTabsAndWidgets(pageLayoutId, updateInput);

    if (result.status === 'successful') {
      const updatedPageLayout = result.response.data?.updatePageLayoutWithTabsAndWidgets;

      if (isDefined(updatedPageLayout)) {
        const persistedLayout = transformPageLayout(updatedPageLayout);
        store.set(pageLayoutPersistedCallbackState, persistedLayout);
        store.set(pageLayoutCurrentLayoutsCallbackState, convertPageLayoutToTabLayouts(persistedLayout));
      }
    }

    return result;
  }, [createPendingFieldsWidgetViews, createPendingRecordTableWidgetViews, pageLayoutId, store]);

  return { savePageLayout };
};

// filepath: src/modules/page-layout/hooks/useResetDraftPageLayoutToPersistedPageLayout.ts
export const useResetDraftPageLayoutToPersistedPageLayout = ({ pageLayoutId, tabListInstanceId }: Props) => {
  const store = useStore();

  const resetDraftPageLayoutToPersistedPageLayout = useCallback(() => {
    const pageLayoutPersisted = store.get(pageLayoutPersistedState);

    if (isDefined(pageLayoutPersisted)) {
      keepActiveTabInsidePersistedTabs(pageLayoutPersisted, tabListInstanceId);

      store.set(pageLayoutDraftState, toDraftPageLayout(pageLayoutPersisted));
      store.set(pageLayoutCurrentLayoutsState, convertPageLayoutToTabLayouts(pageLayoutPersisted));
      store.set(fieldsWidgetGroupsDraftState, store.get(fieldsWidgetGroupsPersistedState));
      store.set(fieldsWidgetUngroupedFieldsDraftState, store.get(fieldsWidgetUngroupedFieldsPersistedState));
      store.set(fieldsWidgetEditorModeDraftState, store.get(fieldsWidgetEditorModePersistedState));
      store.set(recordTableWidgetViewDraftState, store.get(recordTableWidgetViewPersistedState));
    }
  }, [store, tabListInstanceId]);

  return { resetDraftPageLayoutToPersistedPageLayout };
};
```

## 2. 사용 예제

```tsx
// filepath: src/modules/page-layout/widgets/components/DashboardWidgetPlaceholder.tsx
export const DashboardWidgetPlaceholder = ({ pageLayoutId }: Props) => {
  const { setIsPageLayoutInEditMode } = useSetIsPageLayoutInEditMode(pageLayoutId);

  return (
    <Button
      Icon={IconPlus}
      title={t`Add widget`}
      onClick={() => setIsPageLayoutInEditMode(true)}
    />
  );
};

// filepath: src/modules/page-layout/components/PageLayoutTabSettingsNavigation.tsx
export const PageLayoutTabSettingsNavigation = ({ pageLayoutId, tabListInstanceId }: Props) => {
  const { isDirty, canSave } = usePageLayoutDraftState(pageLayoutId);
  const { savePageLayout } = useSavePageLayout(pageLayoutId);
  const { resetDraftPageLayoutToPersistedPageLayout } =
    useResetDraftPageLayoutToPersistedPageLayout({ pageLayoutId, tabListInstanceId });

  return (
    <SaveAndCancelButtons
      onSave={savePageLayout}
      onCancel={resetDraftPageLayoutToPersistedPageLayout}
      isSaveDisabled={!isDirty || !canSave}
    />
  );
};
```
