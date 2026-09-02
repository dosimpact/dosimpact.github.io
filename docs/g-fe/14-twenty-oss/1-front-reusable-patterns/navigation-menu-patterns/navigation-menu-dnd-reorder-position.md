# Navigation Menu DnD Reorder Position

dnd-kit target을 navigation menu destination으로 변환하고, 주변 item의 `position` 사이값을 계산해 reorder를 저장하는 패턴이다.

핵심은 `drop destination decides folder, position is computed between neighbors`다.

## 1. 모듈 코드

- `src/modules/navigation-menu-item/display/dnd/utils/navigationMenuItemDndKitResolveDropTarget.ts`: dnd-kit target data를 app destination으로 변환한다.
- `src/modules/navigation-menu-item/display/dnd/utils/navigationMenuItemDndKitGetDestinationFromSortableTarget.ts`: folder 위 drop을 folder header destination으로 바꾼다.
- `src/modules/navigation-menu-item/common/utils/computeDndReorderPosition.ts`: source item을 제거한 list 기준으로 새 position을 계산한다.
- `src/modules/navigation-menu-item/display/dnd/hooks/useHandleNavigationMenuItemDragAndDrop.ts`: draft mode면 local draft를, favorites면 mutation을 갱신한다.

```tsx
// 큰 흐름: dnd-kit target을 navigation menu destination으로 변환하고, 주변 item의 `position` 사이값을 계산해 reorder를 저장하는 패턴이다.
// 핵심 기준: `drop destination decides folder, position is computed between neighbors`다.

// filepath: src/modules/navigation-menu-item/display/dnd/utils/navigationMenuItemDndKitResolveDropTarget.ts
export const resolveDropTarget = (
  target: {
    id?: unknown;
    group?: unknown;
    index?: unknown;
    data?: unknown;
  } | null,
  getNavItemById: GetNavItemById,
  navigationMenuItemSection: NavigationMenuItemSection,
): SortableTargetDestination | null => {
  if (target === null || target === undefined) return null;

  if (isDefined(target.group) && isDefined(target.index)) {
    return getDestinationFromSortableTarget(
      { id: target.id, group: target.group, index: target.index },
      getNavItemById,
      navigationMenuItemSection,
    );
  }

  if (isDroppableData(target.data)) {
    const { droppableId, index, insertBeforeItemId } = target.data;
    if (canNavigationMenuItemBeDroppedIn({ navigationMenuItemSection, droppableId })) {
      return {
        destination: { droppableId, index },
        effectiveDropTargetId: String(target.id),
        isTargetFolder: false,
        dropTargetId: String(target.id),
        insertBeforeItemId,
      };
    }
  }

  return null;
};

// filepath: src/modules/navigation-menu-item/display/dnd/utils/navigationMenuItemDndKitGetDestinationFromSortableTarget.ts
export const getDestinationFromSortableTarget = (
  target: { id: unknown; group?: unknown; index?: unknown },
  getNavItemById: GetNavItemById,
  navigationMenuItemSection: NavigationMenuItemSection,
): SortableTargetDestination | null => {
  const index = Number(target.index);
  const destDroppableId = String(target.group);
  const targetItem = getNavItemById(
    target.id != null ? String(target.id) : undefined,
  );
  const isTargetFolder =
    isDefined(targetItem) && isNavigationMenuItemFolder(targetItem);

  const { folderHeaderPrefix, orphanDroppableId } =
    NAVIGATION_MENU_ITEM_SECTION_DROPPABLE_CONFIG[navigationMenuItemSection];

  const destination =
    isTargetFolder && destDroppableId !== orphanDroppableId
      ? { droppableId: `${folderHeaderPrefix}${String(target.id)}`, index: 0 }
      : { droppableId: destDroppableId, index };

  return {
    destination,
    effectiveDropTargetId: isTargetFolder
      ? getDndKitDropTargetId(`${folderHeaderPrefix}${target.id}`, 0)
      : getDndKitDropTargetId(destDroppableId, index),
    isTargetFolder,
    dropTargetId: getDndKitDropTargetId(destDroppableId, index),
  };
};

// filepath: src/modules/navigation-menu-item/common/utils/computeDndReorderPosition.ts
export const computeDndReorderPosition = ({
  sortedList,
  draggableId,
  destinationIndex,
}: {
  sortedList: Array<{ id: string; position: number }>;
  draggableId: string;
  destinationIndex: number;
}): number => {
  const sourceIndexInList = sortedList.findIndex(
    (item) => item.id === draggableId,
  );

  if (sourceIndexInList >= 0) {
    const listWithoutDragged = sortedList.filter(
      (item) => item.id !== draggableId,
    );
    const adjustedIndex =
      sourceIndexInList < destinationIndex
        ? destinationIndex - 1
        : destinationIndex;
    const prevItem = listWithoutDragged[adjustedIndex - 1];
    const nextItem = listWithoutDragged[adjustedIndex];

    return getPositionBetween(prevItem?.position, nextItem?.position);
  }

  return getPositionBetween(
    sortedList[destinationIndex - 1]?.position,
    sortedList[destinationIndex]?.position,
  );
};

// filepath: src/modules/navigation-menu-item/display/dnd/hooks/useHandleNavigationMenuItemDragAndDrop.ts
export const useHandleNavigationMenuItemDragAndDrop = (
  section: NavigationMenuItemSection,
) => {
  const applyReorder = async (
    draggableId: string,
    newPosition: number,
    newFolderId?: string | null,
  ) => {
    const folderUpdate =
      newFolderId !== undefined ? { folderId: newFolderId } : {};

    if (isDraftMode) {
      setNavigationMenuItemsDraft((draft) =>
        draft?.map((item) =>
          item.id === draggableId
            ? { ...item, position: newPosition, ...folderUpdate }
            : item,
        ),
      );
      return;
    }

    await updateManyNavigationMenuItems([
      { id: draggableId, update: { position: newPosition, ...folderUpdate } },
    ]);
  };

  const handleNavigationMenuItemDragAndDrop = async (
    result: NavigationMenuItemDropResult,
  ) => {
    if (!result.destination) return;

    const destinationFolderId = extractFolderIdFromDroppableId(
      result.destination.droppableId,
      section,
    );
    const destinationList = getSortedItems().filter(
      (item) => (item.folderId ?? null) === destinationFolderId,
    );
    const newPosition = computeDndReorderPosition({
      sortedList: destinationList,
      draggableId: result.draggableId,
      destinationIndex: result.destination.index,
    });

    await applyReorder(result.draggableId, newPosition, destinationFolderId);
  };

  return { handleNavigationMenuItemDragAndDrop };
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Navigation Menu DnD Reorder Position 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/navigation-menu-item/display/dnd/hooks/useNavigationMenuItemDndKit.ts
export const useNavigationMenuItemDndKit = (section: NavigationSections) => {
  const { handleNavigationMenuItemDragAndDrop } =
    useHandleNavigationMenuItemDragAndDrop(sectionType);

  const handleDragEnd = (event: DragEndPayload) => {
    const resolved = resolveDropTarget(
      event.operation.target,
      getNavItemById,
      sectionType,
    );

    if (!resolved?.destination) return;

    handleNavigationMenuItemDragAndDrop({
      draggableId: String(event.operation.source?.id),
      source: {
        droppableId: event.operation.source?.data?.sourceDroppableId ?? '',
        index: event.operation.source?.data?.sourceIndex ?? 0,
      },
      destination: resolved.destination,
      insertBeforeItemId: resolved.insertBeforeItemId,
    });
  };

  return { handlers: { onDragEnd: handleDragEnd } };
};
```
