# Navigation Menu Tree Filter/Sort

navigation menu item을 active object/view/permission 기준으로 거르고, position 기준으로 정렬한 뒤 folder tree 표시용 flat list로 바꾸는 패턴이다.

핵심은 `raw items in, readable display tree out`이다.

## 1. 모듈 코드

- `src/modules/navigation-menu-item/common/utils/filterAndSortNavigationMenuItems.ts`: item type별 유효성을 검사하고 `position`으로 정렬한다.
- `src/modules/navigation-menu-item/display/hooks/useSortedNavigationMenuItems.ts`: raw navigation items와 workspace items에 같은 filter/sort를 적용한다.
- `src/modules/navigation-menu-item/display/hooks/useReadableNavigationMenuItems.ts`: 권한 없는 item과 빈 folder를 숨기되 customization mode에서는 그대로 보여준다.
- `src/modules/navigation-menu-item/display/hooks/useNavigationMenuItemSectionItems.ts`: orphan item과 folder children을 하나의 section display list로 평탄화한다.

```tsx
// filepath: src/modules/navigation-menu-item/common/utils/filterAndSortNavigationMenuItems.ts
export const filterAndSortNavigationMenuItems = (
  navigationMenuItems: NavigationMenuItem[],
  views: Pick<View, 'id' | 'objectMetadataId' | 'key'>[],
  objectMetadataItems: Pick<EnrichedObjectMetadataItem, 'id' | 'isActive'>[],
): NavigationMenuItem[] => {
  const activeObjectMetadataItems = objectMetadataItems.filter(
    (meta) => meta.isActive,
  );

  return navigationMenuItems
    .filter((item) => {
      if (item.type === NavigationMenuItemType.FOLDER) return true;
      if (item.type === NavigationMenuItemType.LINK) return true;
      if (item.type === NavigationMenuItemType.PAGE_LAYOUT) {
        return isDefined(item.pageLayoutId);
      }
      if (item.type === NavigationMenuItemType.OBJECT) {
        return (
          isDefined(item.targetObjectMetadataId) &&
          activeObjectMetadataItems.some(
            (meta) => meta.id === item.targetObjectMetadataId,
          )
        );
      }
      if (item.type === NavigationMenuItemType.VIEW) {
        const view = views.find((view) => view.id === item.viewId);
        return (
          isDefined(view) &&
          activeObjectMetadataItems.some(
            (meta) => meta.id === view.objectMetadataId,
          )
        );
      }
      if (item.type === NavigationMenuItemType.RECORD) {
        return (
          isDefined(item.targetRecordId) &&
          isDefined(item.targetObjectMetadataId) &&
          isDefined(item.targetRecordIdentifier) &&
          activeObjectMetadataItems.some(
            (meta) => meta.id === item.targetObjectMetadataId,
          )
        );
      }
      return false;
    })
    .sort((a, b) => a.position - b.position);
};

// filepath: src/modules/navigation-menu-item/display/hooks/useSortedNavigationMenuItems.ts
export const useSortedNavigationMenuItems = () => {
  const { navigationMenuItems, workspaceNavigationMenuItems } =
    useNavigationMenuItemsData();
  const views = useAtomStateValue(viewsSelector);
  const objectMetadataItems = useAtomStateValue(objectMetadataItemsSelector);

  const navigationMenuItemsSorted = useMemo(
    () =>
      filterAndSortNavigationMenuItems(
        navigationMenuItems,
        views,
        objectMetadataItems,
      ),
    [navigationMenuItems, views, objectMetadataItems],
  );

  const workspaceNavigationMenuItemsSorted = useMemo(
    () =>
      filterAndSortNavigationMenuItems(
        workspaceNavigationMenuItems,
        views,
        objectMetadataItems,
      ),
    [workspaceNavigationMenuItems, views, objectMetadataItems],
  );

  return { navigationMenuItemsSorted, workspaceNavigationMenuItemsSorted };
};

// filepath: src/modules/navigation-menu-item/display/hooks/useReadableNavigationMenuItems.ts
export const useReadableNavigationMenuItems = ({
  topLevelItems,
  folderChildrenById,
}: UseReadableNavigationMenuItemsArgs) => {
  const isLayoutCustomizationModeEnabled = useAtomStateValue(
    isLayoutCustomizationModeEnabledState,
  );

  const isItemReadable = (item: NavigationMenuItem) =>
    isNavigationMenuItemReadable({
      item,
      objectMetadataItems,
      views,
      objectPermissionsByObjectMetadataId,
    });

  const filteredFolderChildrenById = new Map<string, NavigationMenuItem[]>();
  for (const [folderId, children] of folderChildrenById) {
    filteredFolderChildrenById.set(folderId, children.filter(isItemReadable));
  }

  const filteredTopLevelItems = topLevelItems.filter((item) =>
    isNavigationMenuItemFolder(item)
      ? (filteredFolderChildrenById.get(item.id) ?? []).length > 0
      : isItemReadable(item),
  );

  return {
    displayTopLevelItems: isLayoutCustomizationModeEnabled
      ? topLevelItems
      : filteredTopLevelItems,
    displayFolderChildrenById: isLayoutCustomizationModeEnabled
      ? folderChildrenById
      : filteredFolderChildrenById,
  };
};

// filepath: src/modules/navigation-menu-item/display/hooks/useNavigationMenuItemSectionItems.ts
export const useNavigationMenuItemSectionItems = (): NavigationMenuItem[] => {
  const flatItems = getWorkspaceSidebarOrphanItemsInDisplayOrder({
    workspaceNavigationMenuItems,
    workspaceNavigationMenuItemsSorted,
    objectMetadataItems,
    views,
    objectPermissionsByObjectMetadataId,
    includeInaccessibleObjectBackedItems: isLayoutCustomizationModeEnabled,
  });

  return flattenNavigationMenuItemsWithFolderChildren(
    flatItems,
    workspaceNavigationMenuItemsByFolder,
  );
};
```

## 2. 사용 예제

```tsx
// filepath: src/modules/navigation-menu-item/display/sections/workspace/components/WorkspaceSectionListReadOnly.tsx
export const WorkspaceSectionListReadOnly = () => {
  const navigationMenuItems = useNavigationMenuItemSectionItems();

  return (
    <>
      {navigationMenuItems.map((item) => (
        <NavigationMenuItemDisplay key={item.id} item={item} />
      ))}
    </>
  );
};
```
