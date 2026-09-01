# Add-To-Navigation Drop Handler

외부 picker/search item을 navigation menu로 drag해서 draft item을 만들고, layout customization side panel을 바로 여는 패턴이다.

핵심은 `drag payload registry in, navigation draft item out`이다.

## 1. 모듈 코드

- `src/modules/navigation-menu-item/common/states/addToNavPayloadRegistryState.ts`: draggable id별 add-to-navigation payload를 저장한다.
- `src/modules/navigation-menu-item/display/dnd/components/AddToNavigationDragHandle.tsx`: source item에 drag handle과 payload를 붙인다.
- `src/modules/navigation-menu-item/display/dnd/hooks/useNavigationMenuItemDndKit.ts`: add-to-nav source면 fallback destination을 잡고 drop handler로 보낸다.
- `src/modules/navigation-menu-item/display/dnd/hooks/useHandleAddToNavigationDrop.ts`: payload type별 draft input을 만들고 edit side panel을 연다.

```tsx
// filepath: src/modules/navigation-menu-item/common/states/addToNavPayloadRegistryState.ts
export const addToNavPayloadRegistryState = createAtomState<
  Map<string, AddToNavigationDragPayload>
>({
  key: 'navigation-menu-item/addToNavPayloadRegistryState',
  defaultValue: new Map(),
});

// filepath: src/modules/navigation-menu-item/display/dnd/components/AddToNavigationDragHandle.tsx
export const AddToNavigationDragHandle = ({
  icon,
  customIconContent,
  payload,
  isHovered,
  disabled = false,
  disableDrag = false,
}: AddToNavigationDragHandleProps) => {
  const effectiveColor = getNavigationMenuItemColor(
    { type: payload.type as NavigationMenuItemType },
    payload.type === NavigationMenuItemType.OBJECT && payload.iconColor
      ? { nameSingular: '', color: payload.iconColor, isSystem: false }
      : undefined,
  );

  return (
    <StyledIconSlot
      $hasFixedSize={payload.type !== NavigationMenuItemType.RECORD}
      $disabled={disabled}
      $disableDrag={disableDrag}
    >
      {isHovered ? (
        <IconGripVertical />
      ) : customIconContent ? (
        customIconContent
      ) : icon ? (
        <TintedIconTile Icon={icon} color={effectiveColor} />
      ) : null}
    </StyledIconSlot>
  );
};

// filepath: src/modules/navigation-menu-item/display/dnd/hooks/useNavigationMenuItemDndKit.ts
export const useNavigationMenuItemDndKit = (section: NavigationSections) => {
  const { handleAddToNavigationDrop } = useHandleAddToNavigationDrop();

  const handleDragStart = (event: DragStartPayload) => {
    const sourceId = event.operation.source?.data?.sourceDroppableId ?? null;

    if (sourceId === ADD_TO_NAV_SOURCE_DROPPABLE_ID) {
      const defaultDestination = {
        droppableId: defaultOrphanDroppableId,
        index: orphanItemCount,
      };
      setAddToNavigationFallbackDestination(defaultDestination);
      setActiveDropTargetId(
        getDndKitDropTargetId(
          defaultDestination.droppableId,
          defaultDestination.index,
        ),
      );
    }
  };

  const handleDragEnd = (event: DragEndPayload) => {
    const source = event.operation.source;
    const resolved = resolveDropTarget(
      event.operation.target,
      getNavItemById,
      sectionType,
    );
    const destination =
      resolved?.destination ?? addToNavigationFallbackDestination;

    const dropResult = {
      draggableId: String(source?.id),
      source: {
        droppableId: source?.data?.sourceDroppableId ?? '',
        index: source?.data?.sourceIndex ?? 0,
      },
      destination,
      insertBeforeItemId: resolved?.insertBeforeItemId,
    };

    if (source?.data?.sourceDroppableId === ADD_TO_NAV_SOURCE_DROPPABLE_ID) {
      handleAddToNavigationDrop(dropResult);
    }
  };

  return { handlers: { onDragStart: handleDragStart, onDragEnd: handleDragEnd } };
};

// filepath: src/modules/navigation-menu-item/display/dnd/hooks/useHandleAddToNavigationDrop.ts
export const useHandleAddToNavigationDrop = () => {
  const handleAddToNavigationDrop = useCallback(
    (result: NavigationMenuItemDropResult) => {
      if (
        result.source.droppableId !== ADD_TO_NAV_SOURCE_DROPPABLE_ID ||
        !result.destination ||
        !canNavigationMenuItemBeDroppedIn({
          navigationMenuItemSection: 'workspace',
          droppableId: result.destination.droppableId,
        })
      ) {
        return;
      }

      const payload =
        store.get(addToNavPayloadRegistryState.atom).get(result.draggableId) ??
        null;
      if (!payload) return;

      const folderId = validateAndExtractWorkspaceFolderId(
        result.destination.droppableId,
      );
      if (payload.type === NavigationMenuItemType.FOLDER && folderId !== null) {
        return;
      }

      const addToWorkspaceAndOpenEdit = (
        input: NewNavigationMenuItemInput,
        pageOptions: Omit<
          Parameters<typeof openNavigationMenuItemInSidePanel>[0],
          'itemId'
        >,
      ) => {
        enterLayoutCustomizationMode();
        if (!store.get(isLayoutCustomizationModeEnabledState.atom)) return;

        const itemId = createItem(input, {
          targetFolderId: folderId,
          targetIndex: result.destination?.index,
        });
        openNavigationMenuItemInSidePanel({ ...pageOptions, itemId });
      };

      if (payload.type === NavigationMenuItemType.LINK) {
        addToWorkspaceAndOpenEdit(
          {
            type: NavigationMenuItemType.LINK,
            name: payload.name || t`Link label`,
            link: normalizeUrl(payload.link),
            color: DEFAULT_NAVIGATION_MENU_ITEM_COLOR_LINK,
          },
          { pageTitle: t`Edit link`, pageIcon: IconLink, focusTitleInput: true },
        );
      }
    },
    [createItem, enterLayoutCustomizationMode, openNavigationMenuItemInSidePanel, store],
  );

  return { handleAddToNavigationDrop };
};
```

## 2. 사용 예제

```tsx
// filepath: src/modules/navigation-menu-item/edit/side-panel/components/SidePanelNewSidebarItemPage.tsx
export const SidePanelNewSidebarItemPage = () => {
  return (
    <AddToNavigationDragHandle
      icon={IconLink}
      isHovered={isHovered}
      payload={{
        type: NavigationMenuItemType.LINK,
        name: 'Docs',
        link: 'https://example.com/docs',
      }}
    />
  );
};
```
