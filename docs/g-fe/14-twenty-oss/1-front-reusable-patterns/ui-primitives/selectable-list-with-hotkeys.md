# Selectable List With Hotkeys

Arrow-key navigation and Enter selection are attached to a list instance instead of each menu rebuilding the same keyboard state.

핵심은 `list owns selection state, item owns its Enter action`이다.

## 1. 모듈 코드

- `src/modules/ui/layout/selectable-list/components/SelectableList.tsx`: item id 배열 또는 2D matrix를 instance-scoped state에 등록하고 arrow hotkeys를 연결한다.
- `src/modules/ui/layout/selectable-list/components/SelectableListItem.tsx`: 현재 selected item이면 스크롤을 맞추고 Enter hotkey effect를 붙인다.
- `src/modules/ui/layout/selectable-list/hooks/internal/useSelectableListHotKeys.ts`: focused element에서 arrow key를 받아 다음 selected id를 계산한다.
- `src/modules/ui/layout/selectable-list/hooks/useSelectableList.ts`: 외부에서 selected item을 reset/set 할 수 있는 imperative hook을 제공한다.

```tsx
// filepath: src/modules/ui/layout/selectable-list/components/SelectableList.tsx
export const SelectableList = ({
  children,
  selectableItemIdArray,
  selectableItemIdMatrix,
  selectableListInstanceId,
  onSelect,
  focusId,
  shouldPreselectFirstItem,
}: SelectableListProps) => {
  const scopedSelectableListInstanceId =
    useWorkspaceSurfaceScopedComponentInstanceId(selectableListInstanceId);

  useSelectableListHotKeys(scopedSelectableListInstanceId, focusId, onSelect);

  const store = useStore();
  const { resetSelectedItem, setSelectedItemId } = useSelectableList(
    scopedSelectableListInstanceId,
  );

  const setSelectableItemIds = useSetAtomComponentState(
    selectableItemIdsComponentState,
    scopedSelectableListInstanceId,
  );

  useEffect(() => {
    if (!selectableItemIdArray && !selectableItemIdMatrix) {
      throw new Error(
        'Either selectableItemIdArray or selectableItemIdsMatrix must be provided',
      );
    }

    if (isDefined(selectableItemIdMatrix)) {
      setSelectableItemIds(selectableItemIdMatrix);
    }

    if (isDefined(selectableItemIdArray)) {
      setSelectableItemIds(arrayToChunks(selectableItemIdArray, 1));
    }

    if (shouldPreselectFirstItem !== true) {
      return;
    }

    const itemIds =
      selectableItemIdArray ?? selectableItemIdMatrix?.flat() ?? [];
    const firstItemId = itemIds[0];

    if (!isDefined(firstItemId)) {
      resetSelectedItem();
      return;
    }

    const selectedItemId = store.get(
      selectedItemIdComponentState.atomFamily({
        instanceId: scopedSelectableListInstanceId,
      }),
    );

    if (!isDefined(selectedItemId) || !itemIds.includes(selectedItemId)) {
      setSelectedItemId(firstItemId);
    }
  }, [
    selectableItemIdArray,
    selectableItemIdMatrix,
    scopedSelectableListInstanceId,
    setSelectableItemIds,
    shouldPreselectFirstItem,
    resetSelectedItem,
    setSelectedItemId,
    store,
  ]);

  return (
    <SelectableListComponentInstanceContext.Provider
      value={{ instanceId: scopedSelectableListInstanceId }}
    >
      <SelectableListContextProvider value={{ focusId }}>
        {children}
      </SelectableListContextProvider>
    </SelectableListComponentInstanceContext.Provider>
  );
};

// filepath: src/modules/ui/layout/selectable-list/hooks/internal/useSelectableListHotKeys.ts
type Direction = 'up' | 'down' | 'left' | 'right';

const findPosition = (
  selectableItemIds: string[][],
  selectedItemId?: string | null,
) => {
  if (!selectedItemId) {
    return;
  }

  for (let row = 0; row < selectableItemIds.length; row++) {
    const col = selectableItemIds[row].indexOf(selectedItemId);

    if (col !== -1) {
      return { row, col };
    }
  }
};

const computeNextId = ({
  selectableItemIds,
  selectedItemId,
  direction,
}: {
  selectableItemIds: string[][];
  selectedItemId?: string | null;
  direction: Direction;
}) => {
  const currentPosition = findPosition(selectableItemIds, selectedItemId);

  if (selectableItemIds.length === 0 || selectableItemIds[0]?.length === 0) {
    return;
  }

  if (!selectedItemId || !currentPosition) {
    return selectableItemIds[0][0];
  }

  const { row: currentRow, col: currentCol } = currentPosition;
  const isSingleRow = selectableItemIds.length === 1;

  switch (direction) {
    case 'up':
      return isSingleRow
        ? selectableItemIds[currentRow][Math.max(0, currentCol - 1)]
        : selectableItemIds[Math.max(0, currentRow - 1)][currentCol];
    case 'down':
      return isSingleRow
        ? selectableItemIds[currentRow][
            Math.min(selectableItemIds[currentRow].length - 1, currentCol + 1)
          ]
        : selectableItemIds[
            Math.min(selectableItemIds.length - 1, currentRow + 1)
          ][currentCol];
    case 'left':
      return selectableItemIds[currentRow][Math.max(0, currentCol - 1)];
    case 'right':
      return selectableItemIds[currentRow][
        Math.min(selectableItemIds[currentRow].length - 1, currentCol + 1)
      ];
  }
};

export const useSelectableListHotKeys = (
  instanceId: string,
  focusId: string,
  onSelect?: (itemId: string) => void,
) => {
  const store = useStore();

  const handleSelect = useCallback(
    (direction: Direction) => {
      const selectedItemId = store.get(
        selectedItemIdComponentState.atomFamily({ instanceId }),
      );
      const selectableItemIds = store.get(
        selectableItemIdsComponentState.atomFamily({ instanceId }),
      );

      const nextId = computeNextId({
        selectableItemIds,
        selectedItemId,
        direction,
      });

      if (isNonEmptyString(nextId) && selectedItemId !== nextId) {
        store.set(
          isSelectedItemIdComponentFamilyState.atomFamily({
            instanceId,
            familyKey: nextId,
          }),
          true,
        );
        store.set(
          selectedItemIdComponentState.atomFamily({ instanceId }),
          nextId,
        );
        onSelect?.(nextId);
      }

      if (isNonEmptyString(selectedItemId) && selectedItemId !== nextId) {
        store.set(
          isSelectedItemIdComponentFamilyState.atomFamily({
            instanceId,
            familyKey: selectedItemId,
          }),
          false,
        );
      }
    },
    [store, instanceId, onSelect],
  );

  useHotkeysOnFocusedElement({
    keys: Key.ArrowUp,
    callback: () => handleSelect('up'),
    focusId,
    dependencies: [handleSelect],
  });

  useHotkeysOnFocusedElement({
    keys: Key.ArrowDown,
    callback: () => handleSelect('down'),
    focusId,
    dependencies: [handleSelect],
  });

  useHotkeysOnFocusedElement({
    keys: Key.ArrowLeft,
    callback: () => handleSelect('left'),
    focusId,
    dependencies: [handleSelect],
    options: { enableOnFormTags: false },
  });

  useHotkeysOnFocusedElement({
    keys: Key.ArrowRight,
    callback: () => handleSelect('right'),
    focusId,
    dependencies: [handleSelect],
    options: { enableOnFormTags: false },
  });
};

// filepath: src/modules/ui/layout/selectable-list/components/SelectableListItem.tsx
export const SelectableListItem = ({
  itemId,
  children,
  onEnter,
  className,
}: SelectableListItemProps) => {
  const isSelectedItemId = useAtomComponentFamilyStateValue(
    isSelectedItemIdComponentFamilyState,
    itemId,
  );

  const listItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSelectedItemId || !listItemRef.current) {
      return;
    }

    listItemRef.current.scrollIntoView?.({
      behavior: 'auto',
      block: 'nearest',
    });
  }, [isSelectedItemId]);

  return (
    <>
      {isSelectedItemId && isDefined(onEnter) && (
        <SelectableListItemHotkeyEffect itemId={itemId} onEnter={onEnter} />
      )}
      <StyledListItemContainer ref={listItemRef} className={className}>
        {children}
      </StyledListItemContainer>
    </>
  );
};

// filepath: src/modules/ui/layout/selectable-list/hooks/useSelectableList.ts
export const useSelectableList = (instanceId?: string) => {
  const selectableListInstanceId = useWorkspaceSurfaceScopedComponentInstanceId(
    useAvailableComponentInstanceIdOrThrow(
      SelectableListComponentInstanceContext,
      instanceId,
    ),
  );

  const store = useStore();

  const resetSelectedItem = useCallback(() => {
    const selectedItemId = store.get(
      selectedItemIdComponentState.atomFamily({
        instanceId: selectableListInstanceId,
      }),
    );

    if (isDefined(selectedItemId)) {
      store.set(
        selectedItemIdComponentState.atomFamily({
          instanceId: selectableListInstanceId,
        }),
        null,
      );
      store.set(
        isSelectedItemIdComponentFamilyState.atomFamily({
          instanceId: selectableListInstanceId,
          familyKey: selectedItemId,
        }),
        false,
      );
    }
  }, [store, selectableListInstanceId]);

  const setSelectedItemId = useCallback(
    (itemId: string) => {
      resetSelectedItem();
      store.set(
        selectedItemIdComponentState.atomFamily({
          instanceId: selectableListInstanceId,
        }),
        itemId,
      );
      store.set(
        isSelectedItemIdComponentFamilyState.atomFamily({
          instanceId: selectableListInstanceId,
          familyKey: itemId,
        }),
        true,
      );
    },
    [store, selectableListInstanceId, resetSelectedItem],
  );

  return { resetSelectedItem, setSelectedItemId };
};
```

## 2. 사용 예제

```tsx
// filepath: src/modules/ui/input/components/Select.tsx
const selectableItemIdArray = filteredOptions.map((option) => option.label);

<SelectableList
  selectableListInstanceId={dropdownId}
  focusId={dropdownId}
  selectableItemIdArray={selectableItemIdArray}
>
  {filteredOptions.map((option) => (
    <SelectableListItem
      key={`${option.value}-${option.label}`}
      itemId={option.label}
      onEnter={() => {
        onChange?.(option.value);
        onBlur?.();
        closeDropdown(dropdownId);
      }}
    >
      <MenuItemSelect
        text={option.label}
        selected={controlSelectedOption.value === option.value}
        focused={selectedItemId === option.label}
        onClick={() => {
          onChange?.(option.value);
          onBlur?.();
          closeDropdown(dropdownId);
        }}
      />
    </SelectableListItem>
  ))}
</SelectableList>;

// filepath: src/modules/ui/input/components/IconPicker.tsx
<SelectableList
  selectableListInstanceId={selectableListInstanceId}
  selectableItemIdMatrix={iconKeys2d}
  focusId={dropdownId}
>
  {matchingSearchIconKeys.map((iconKey) => (
    <IconPickerIcon
      key={iconKey}
      iconKey={iconKey}
      onSelect={() => {
        onChange({ iconKey, Icon: getIcon(iconKey) });
        closeDropdown(dropdownId);
      }}
      focusedIconKey={focusedIconKey}
    />
  ))}
</SelectableList>;
```
