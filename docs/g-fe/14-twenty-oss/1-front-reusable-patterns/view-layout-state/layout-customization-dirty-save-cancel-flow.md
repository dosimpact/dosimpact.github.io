# Layout Customization Dirty/Save/Cancel Flow

여러 편집 영역의 draft state를 하나의 customization mode에서 열고, dirty 계산, save, cancel, exit을 통합하는 패턴이다.

## 1. 모듈 코드

- `src/modules/layout-customization/states/isLayoutCustomizationModeEnabledState.ts`: 전역 customization mode on/off 상태를 보관한다.
- `src/modules/layout-customization/states/activeCustomizationPageLayoutIdsState.ts`: customization session에서 변경 대상이 된 page layout id 목록을 보관한다.
- `src/modules/layout-customization/hooks/useEnterLayoutCustomizationMode.ts`: persisted navigation/command menu state를 draft로 seed하고 edit side panel을 전환한다.
- `src/modules/layout-customization/hooks/useIsLayoutCustomizationDirty.ts`: navigation, command menu, active page layouts의 draft와 persisted snapshot을 비교한다.
- `src/modules/layout-customization/hooks/useSaveLayoutCustomization.ts`: dirty 영역만 순서대로 저장하고 성공하면 customization mode를 종료한다.
- `src/modules/layout-customization/hooks/useCancelLayoutCustomization.ts`: active page layout draft들을 persisted snapshot으로 되돌리고 customization mode를 종료한다.
- `src/modules/layout-customization/hooks/useExitLayoutCustomizationMode.ts`: draft state, selection, side panel, mode flag를 정리한다.

```tsx
// 큰 흐름: 여러 편집 영역의 draft state를 하나의 customization mode에서 열고, dirty 계산, save, cancel, exit을 통합하는 패턴이다.

// filepath: src/modules/layout-customization/states/isLayoutCustomizationModeEnabledState.ts
export const isLayoutCustomizationModeEnabledState = createAtomState<boolean>({
  key: 'isLayoutCustomizationModeEnabledState',
  defaultValue: false,
});

// filepath: src/modules/layout-customization/states/activeCustomizationPageLayoutIdsState.ts
export const activeCustomizationPageLayoutIdsState = createAtomState<string[]>({
  key: 'activeCustomizationPageLayoutIdsState',
  defaultValue: [],
});

// filepath: src/modules/layout-customization/hooks/useEnterLayoutCustomizationMode.ts
export const useEnterLayoutCustomizationMode = () => {
  const store = useStore();
  const { navigateSidePanel } = useNavigateSidePanel();
  const { enqueueWarningSnackBar } = useSnackBar();
  const hasLayoutsPermission = useHasPermissionFlag(PermissionFlagType.LAYOUTS);

  const enterLayoutCustomizationMode = useCallback((): boolean => {
    if (!hasLayoutsPermission) return false;
    if (store.get(isLayoutCustomizationModeEnabledState.atom)) return true;

    const dashboardPageLayoutIdInEditMode = store.get(currentPageLayoutIdState.atom);
    if (isDefined(dashboardPageLayoutIdInEditMode)) {
      const isDashboardInEditMode = store.get(
        isDashboardInEditModeComponentState.atomFamily({ instanceId: dashboardPageLayoutIdInEditMode }),
      );

      if (isDashboardInEditMode) {
        enqueueWarningSnackBar({
          message: t`Save or cancel dashboard changes before editing the layout.`,
        });
        return false;
      }
    }

    const workspaceNavigationMenuItems = filterWorkspaceNavigationMenuItems(
      store.get(navigationMenuItemsSelector.atom),
    );
    store.set(navigationMenuItemsDraftState.atom, workspaceNavigationMenuItems);
    store.set(navigationMenuItemEditSectionState.atom, 'workspace');
    store.set(commandMenuItemsDraftState.atom, store.get(commandMenuItemsSelector.atom));
    store.set(activeCustomizationPageLayoutIdsState.atom, []);
    store.set(isLayoutCustomizationModeEnabledState.atom, true);

    if (shouldSwitchCommandMenuSidePanelToEdit(store)) {
      navigateSidePanel({
        page: SidePanelPages.CommandMenuEdit,
        pageTitle: t`Edit actions`,
        pageIcon: IconPencil,
        resetNavigationStack: true,
      });
    }

    return true;
  }, [enqueueWarningSnackBar, hasLayoutsPermission, navigateSidePanel, store]);

  return { enterLayoutCustomizationMode };
};

// filepath: src/modules/layout-customization/hooks/useIsLayoutCustomizationDirty.ts
export const useIsLayoutCustomizationDirty = () => {
  const { isDirty: isNavigationDirty } = useNavigationMenuItemsDraftState();
  const { isDirty: isCommandMenuItemsDirty } = useCommandMenuItemsDraftState();

  const isAnyPageLayoutDirtyAtom = useMemo(
    () =>
      atom((get) => {
        const activePageLayoutIds = get(activeCustomizationPageLayoutIdsState.atom);

        for (const pageLayoutId of activePageLayoutIds) {
          const draft = get(pageLayoutDraftComponentState.atomFamily({ instanceId: pageLayoutId }));
          const persisted = get(pageLayoutPersistedComponentState.atomFamily({ instanceId: pageLayoutId }));

          if (!isDefined(draft) || !isDefined(persisted)) continue;
          if (!isDeeplyEqual(draft, toDraftPageLayout(persisted))) return true;

          if (!isDeeplyEqual(
            get(fieldsWidgetGroupsDraftComponentState.atomFamily({ instanceId: pageLayoutId })),
            get(fieldsWidgetGroupsPersistedComponentState.atomFamily({ instanceId: pageLayoutId })),
          )) return true;

          if (!isDeeplyEqual(
            get(fieldsWidgetUngroupedFieldsDraftComponentState.atomFamily({ instanceId: pageLayoutId })),
            get(fieldsWidgetUngroupedFieldsPersistedComponentState.atomFamily({ instanceId: pageLayoutId })),
          )) return true;

          if (!isDeeplyEqual(
            get(recordTableWidgetViewDraftComponentState.atomFamily({ instanceId: pageLayoutId })),
            get(recordTableWidgetViewPersistedComponentState.atomFamily({ instanceId: pageLayoutId })),
          )) return true;
        }

        return false;
      }),
    [],
  );

  return {
    isDirty: isNavigationDirty || useAtomValue(isAnyPageLayoutDirtyAtom) || isCommandMenuItemsDirty,
  };
};

// filepath: src/modules/layout-customization/hooks/useSaveLayoutCustomization.ts
export const useSaveLayoutCustomization = () => {
  const [isSaving, setIsSaving] = useState(false);
  const store = useStore();
  const { saveDraft } = useSaveNavigationMenuItemsDraft();
  const { saveCommandMenuItemsDraft } = useSaveCommandMenuItemsDraft();
  const { isDirty: isCommandMenuItemsDirty } = useCommandMenuItemsDraftState();
  const { updatePageLayoutWithTabsAndWidgets } = useUpdatePageLayoutWithTabsAndWidgets();
  const { exitLayoutCustomizationMode } = useExitLayoutCustomizationMode();

  const save = useCallback(async () => {
    setIsSaving(true);

    try {
      if (isNavigationDraftDirty(store)) {
        await saveDraft();
      }

      if (isCommandMenuItemsDirty) {
        await saveCommandMenuItemsDraft();
      }

      let hasAnyFailure = false;

      for (const pageLayoutId of store.get(activeCustomizationPageLayoutIdsState.atom)) {
        await createPendingFieldsWidgetViews(pageLayoutId);
        await createPendingRecordTableWidgetViews(pageLayoutId);

        if (isPageLayoutStructureDirty(store, pageLayoutId)) {
          const draft = store.get(pageLayoutDraftComponentState.atomFamily({ instanceId: pageLayoutId }));
          const result = await updatePageLayoutWithTabsAndWidgets(
            pageLayoutId,
            convertPageLayoutDraftToUpdateInput(draft),
          );

          if (result.status === 'failed') {
            hasAnyFailure = true;
            continue;
          }

          syncPersistedPageLayoutStateFromResult(store, pageLayoutId, result);
        }

        await savePageLayoutWidgetsData(pageLayoutId);
      }

      if (!hasAnyFailure) {
        exitLayoutCustomizationMode();
      }
    } finally {
      setIsSaving(false);
    }
  }, [saveDraft, saveCommandMenuItemsDraft, isCommandMenuItemsDirty, updatePageLayoutWithTabsAndWidgets, store]);

  return { save, isSaving };
};

// filepath: src/modules/layout-customization/hooks/useCancelLayoutCustomization.ts
export const useCancelLayoutCustomization = () => {
  const store = useStore();
  const { exitLayoutCustomizationMode } = useExitLayoutCustomizationMode();

  const cancel = useCallback(() => {
    const activePageLayoutIds = store.get(activeCustomizationPageLayoutIdsState.atom);

    for (const pageLayoutId of activePageLayoutIds) {
      const persisted = store.get(pageLayoutPersistedComponentState.atomFamily({ instanceId: pageLayoutId }));

      if (isDefined(persisted)) {
        store.set(pageLayoutDraftComponentState.atomFamily({ instanceId: pageLayoutId }), toDraftPageLayout(persisted));
        store.set(pageLayoutCurrentLayoutsComponentState.atomFamily({ instanceId: pageLayoutId }), convertPageLayoutToTabLayouts(persisted));
      }

      store.set(fieldsWidgetGroupsDraftComponentState.atomFamily({ instanceId: pageLayoutId }), store.get(fieldsWidgetGroupsPersistedComponentState.atomFamily({ instanceId: pageLayoutId })));
      store.set(fieldsWidgetUngroupedFieldsDraftComponentState.atomFamily({ instanceId: pageLayoutId }), store.get(fieldsWidgetUngroupedFieldsPersistedComponentState.atomFamily({ instanceId: pageLayoutId })));
      store.set(fieldsWidgetEditorModeDraftComponentState.atomFamily({ instanceId: pageLayoutId }), store.get(fieldsWidgetEditorModePersistedComponentState.atomFamily({ instanceId: pageLayoutId })));
      store.set(recordTableWidgetViewDraftComponentState.atomFamily({ instanceId: pageLayoutId }), store.get(recordTableWidgetViewPersistedComponentState.atomFamily({ instanceId: pageLayoutId })));
    }

    exitLayoutCustomizationMode();
  }, [store, exitLayoutCustomizationMode]);

  return { cancel };
};

// filepath: src/modules/layout-customization/hooks/useExitLayoutCustomizationMode.ts
export const useExitLayoutCustomizationMode = () => {
  const store = useStore();
  const { closeSidePanelMenu } = useSidePanelMenu();

  const exitLayoutCustomizationMode = useCallback(() => {
    for (const pageLayoutId of store.get(activeCustomizationPageLayoutIdsState.atom)) {
      store.set(pageLayoutEditingWidgetIdComponentState.atomFamily({ instanceId: pageLayoutId }), null);
    }

    resetRecordIndexSelection();
    setNavigationMenuItemsDraft(null);
    setSelectedNavigationMenuItemIdInEditMode(null);
    store.set(commandMenuItemsDraftState.atom, null);
    setIsLayoutCustomizationModeEnabled(false);
    closeSidePanelMenu();
  }, [closeSidePanelMenu, store]);

  return { exitLayoutCustomizationMode };
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Layout Customization Dirty/Save/Cancel Flow 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/layout-customization/components/LayoutCustomizationBar.tsx
const LayoutCustomizationBarContent = () => {
  const { save, isSaving } = useSaveLayoutCustomization();
  const { cancel } = useCancelLayoutCustomization();
  const { isDirty } = useIsLayoutCustomizationDirty();

  return (
    <StyledContainer data-globally-prevent-click-outside="true">
      <StyledTitle>
        <IconPaint size={theme.icon.size.md} />
        {title}
      </StyledTitle>
      <SaveAndCancelButtons
        onSave={save}
        onCancel={cancel}
        isSaveDisabled={!isDirty || isSaving}
        isCancelDisabled={isSaving}
        isLoading={isSaving}
        inverted
        saveIcon={IconCheck}
      />
    </StyledContainer>
  );
};

export const LayoutCustomizationBar = () => {
  const isLayoutCustomizationModeEnabled = useAtomStateValue(
    isLayoutCustomizationModeEnabledState,
  );

  return (
    <AnimatePresence>
      {isLayoutCustomizationModeEnabled && <LayoutCustomizationBarContent />}
    </AnimatePresence>
  );
};
```
