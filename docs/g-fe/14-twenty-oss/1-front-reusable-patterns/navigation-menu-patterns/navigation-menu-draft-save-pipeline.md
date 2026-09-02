# Navigation Menu Draft Save Pipeline

workspace navigation customization을 local draft로 편집한 뒤, save 시 create/delete/recreate/update mutation으로 persisted state에 반영하는 패턴이다.

핵심은 `edit draft locally, persist the diff on save`다.

## 1. 모듈 코드

- `src/modules/navigation-menu-item/edit/hooks/useNavigationMenuItemsDraftState.ts`: customization mode에서는 draft를 화면 source of truth로 사용하고 dirty 여부를 계산한다.
- `src/modules/navigation-menu-item/edit/hooks/useNavigationMenuItemEditController.ts`: workspace는 draft에 쓰고 favorites는 즉시 mutation을 실행하는 edit facade다.
- `src/modules/navigation-menu-item/edit/hooks/useSaveNavigationMenuItemsDraft.ts`: draft와 persisted workspace items를 비교해 delete/create/update를 실행한다.
- `src/modules/navigation-menu-item/edit/utils/buildUpdateInputsFromDraft.ts`: persisted item과 draft item의 변경된 필드만 update payload로 만든다.

```tsx
// 큰 흐름: workspace navigation customization을 local draft로 편집한 뒤, save 시 create/delete/recreate/update mutation으로 persisted state에 반영하는 패턴이다.
// 핵심 기준: `edit draft locally, persist the diff on save`다.

// filepath: src/modules/navigation-menu-item/edit/hooks/useNavigationMenuItemsDraftState.ts
export const useNavigationMenuItemsDraftState = () => {
  const isLayoutCustomizationModeEnabled = useAtomStateValue(
    isLayoutCustomizationModeEnabledState,
  );
  const navigationMenuItems = useAtomStateValue(navigationMenuItemsSelector);
  const navigationMenuItemsDraft = useAtomStateValue(
    navigationMenuItemsDraftState,
  );

  const workspaceNavigationMenuItemsFromState =
    filterWorkspaceNavigationMenuItems(navigationMenuItems);

  const workspaceNavigationMenuItems =
    isLayoutCustomizationModeEnabled && isDefined(navigationMenuItemsDraft)
      ? navigationMenuItemsDraft
      : workspaceNavigationMenuItemsFromState;

  const isDirty =
    isLayoutCustomizationModeEnabled &&
    isDefined(navigationMenuItemsDraft) &&
    !isDeeplyEqual(
      navigationMenuItemsDraft,
      workspaceNavigationMenuItemsFromState,
    );

  return { workspaceNavigationMenuItems, isDirty };
};

// filepath: src/modules/navigation-menu-item/edit/hooks/useNavigationMenuItemEditController.ts
export const useNavigationMenuItemEditController = () => {
  const navigationMenuItemEditSection = useAtomStateValue(
    navigationMenuItemEditSectionState,
  );
  const { navigationMenuItems, workspaceNavigationMenuItems } =
    useNavigationMenuItemsData();
  const setNavigationMenuItemsDraft = useSetAtomState(
    navigationMenuItemsDraftState,
  );

  const isDraftMode = navigationMenuItemEditSection === 'workspace';
  const currentItems = isDraftMode
    ? workspaceNavigationMenuItems
    : navigationMenuItems;

  const createItem = (
    input: NewNavigationMenuItemInput,
    { targetFolderId, targetIndex }: CreateItemOptions = {},
  ): string => {
    const { flatIndex, position } = computeInsertIndexAndPosition(
      currentItems,
      targetFolderId ?? null,
      targetIndex ?? currentItems.length,
    );
    const newItem = buildDraftNavigationMenuItem(input, position);

    if (isDraftMode) {
      setNavigationMenuItemsDraft((draft) => {
        const current = draft ?? currentItems;
        return [
          ...current.slice(0, flatIndex),
          newItem,
          ...current.slice(flatIndex),
        ];
      });
      return newItem.id;
    }

    void createManyNavigationMenuItems([
      buildCreateNavigationMenuItemInput(newItem, (value) => value),
    ]);

    return newItem.id;
  };

  const updateItem = async (id: string, update: Partial<NavigationMenuItem>) => {
    if (isDraftMode) {
      setNavigationMenuItemsDraft((draft) =>
        draft?.map((item) => (item.id === id ? { ...item, ...update } : item)),
      );
      return;
    }

    await updateManyNavigationMenuItems([{ id, update }]);
  };

  const deleteItems = async (ids: string[]) => {
    if (isDraftMode) {
      setNavigationMenuItemsDraft((draft) =>
        draft?.filter((item) => !ids.includes(item.id)),
      );
      return;
    }

    await deleteManyNavigationMenuItems(ids);
  };

  return { currentItems, isDraftMode, createItem, updateItem, deleteItems };
};

// filepath: src/modules/navigation-menu-item/edit/hooks/useSaveNavigationMenuItemsDraft.ts
export const useSaveNavigationMenuItemsDraft = () => {
  const saveDraft = useCallback(async () => {
    const draft = store.get(navigationMenuItemsDraftState.atom);
    const currentItems = store.get(navigationMenuItemsSelector.atom);
    if (!draft) return;

    const workspaceItems = filterWorkspaceNavigationMenuItems(currentItems);
    const draftIds = new Set(draft.map((item) => item.id));
    const currentIds = new Set(workspaceItems.map((item) => item.id));
    const workspaceItemsById = new Map(
      workspaceItems.map((item) => [item.id, item]),
    );

    await deleteManyNavigationMenuItems(
      workspaceItems
        .filter((workspaceItem) => !draftIds.has(workspaceItem.id))
        .map((workspaceItem) => workspaceItem.id),
    );

    const itemsToCreate = draft.filter((item) => !currentIds.has(item.id));
    const idsToRecreate = draft.filter((item) => {
      const original = workspaceItemsById.get(item.id);
      return (
        isDefined(original) &&
        (original.viewId !== item.viewId ||
          original.targetObjectMetadataId !== item.targetObjectMetadataId ||
          original.targetRecordId !== item.targetRecordId)
      );
    });

    await deleteManyNavigationMenuItems(idsToRecreate.map((item) => item.id));
    await createManyNavigationMenuItems(
      [...itemsToCreate, ...idsToRecreate].map((draftItem) =>
        buildCreateNavigationMenuItemInput(draftItem, (folderId) => folderId),
      ),
    );
    await updateManyNavigationMenuItems(
      buildUpdateInputsFromDraft({
        draft,
        workspaceItemsById,
        idsToRecreateSet: new Set(idsToRecreate.map((item) => item.id)),
        resolveFolderId: (folderId) => folderId,
      }),
    );
  }, [createManyNavigationMenuItems, deleteManyNavigationMenuItems, updateManyNavigationMenuItems, store]);

  return { saveDraft };
};

// filepath: src/modules/navigation-menu-item/edit/utils/buildUpdateInputsFromDraft.ts
export const buildUpdateInputsFromDraft = ({
  draft,
  workspaceItemsById,
  idsToRecreateSet,
  resolveFolderId,
}: {
  draft: NavigationMenuItem[];
  workspaceItemsById: Map<string, NavigationMenuItem>;
  idsToRecreateSet: Set<string>;
  resolveFolderId: (draftFolderId: string) => string;
}): UpdateOneNavigationMenuItemInput[] => {
  const updateInputs = [];

  for (const draftItem of draft) {
    const original = workspaceItemsById.get(draftItem.id);
    if (!original || idsToRecreateSet.has(draftItem.id)) continue;

    const updatePayload: UpdateOneNavigationMenuItemInput['update'] = {};
    if (original.position !== draftItem.position) {
      updatePayload.position = draftItem.position;
    }
    if ((original.folderId ?? null) !== (draftItem.folderId ?? null)) {
      updatePayload.folderId = isDefined(draftItem.folderId)
        ? resolveFolderId(draftItem.folderId)
        : null;
    }
    if (isNavigationMenuItemLink(draftItem) && original.link !== draftItem.link) {
      updatePayload.link = ensureAbsoluteUrl(draftItem.link ?? '');
    }
    if (Object.keys(updatePayload).length > 0) {
      updateInputs.push({ id: draftItem.id, update: updatePayload });
    }
  }

  return updateInputs;
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Navigation Menu Draft Save Pipeline 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/navigation-menu-item/edit/side-panel/components/SidePanelEditOrganizeActions.tsx
export const SidePanelEditOrganizeActions = ({ itemId }: Props) => {
  const { updateItem, deleteItems } = useNavigationMenuItemEditController();
  const { isDirty } = useNavigationMenuItemsDraftState();
  const { saveDraft } = useSaveNavigationMenuItemsDraft();

  return (
    <>
      <MenuItem onClick={() => updateItem(itemId, { name: 'Renamed item' })} />
      <MenuItem onClick={() => deleteItems([itemId])} />
      <Button disabled={!isDirty} onClick={saveDraft} />
    </>
  );
};
```
