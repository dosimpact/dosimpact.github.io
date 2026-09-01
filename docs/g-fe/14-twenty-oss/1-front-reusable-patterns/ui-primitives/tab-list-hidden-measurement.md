# Tab List Hidden Measurement

Responsive tabs are measured off-screen first, then the visible row renders only the tabs that fit next to the overflow button.

핵심은 `measure hidden real controls, then render the fitted visible set`이다.

## 1. 모듈 코드

- `src/modules/ui/layout/tab-list/components/TabListHiddenMeasurements.tsx`: 실제 `TabButton`과 overflow/add button을 hidden layer에서 측정한다.
- `src/modules/ui/layout/tab-list/hooks/useTabListMeasurements.ts`: tab/container/more/add widths를 state로 모아 visible/hidden tab 목록을 계산한다.
- `src/modules/ui/layout/tab-list/utils/calculateVisibleTabCount.ts`: available width와 button widths로 몇 개 tab을 row에 남길지 결정한다.
- `src/modules/ui/layout/tab-list/components/TabList.tsx`: desktop에서는 계산된 tab만 렌더링하고 나머지는 overflow dropdown으로 보낸다.

```tsx
// filepath: src/modules/ui/layout/tab-list/components/TabListHiddenMeasurements.tsx
const StyledHiddenMeasurement = styled.div`
  display: flex;
  gap: ${TAB_LIST_GAP}px;
  pointer-events: none;
  position: absolute;
  top: -9999px;
  visibility: hidden;
`;

export const TabListHiddenMeasurements = ({
  visibleTabs,
  activeTabId,
  loading,
  onTabWidthChange,
  onMoreButtonWidthChange,
  onAddButtonWidthChange,
  addButtonMeasurement,
}: TabListHiddenMeasurementsProps) => {
  return (
    <StyledHiddenMeasurement>
      {visibleTabs.map((tab) => (
        <NodeDimension
          key={tab.id}
          onDimensionChange={onTabWidthChange(tab.id)}
        >
          <TabButton
            id={tab.id}
            title={tab.title}
            LeftIcon={tab.Icon}
            logo={tab.logo}
            active={tab.id === activeTabId}
            disabled={tab.disabled ?? loading}
            pill={tab.pill}
            disableTestId={true}
          />
        </NodeDimension>
      ))}

      <NodeDimension onDimensionChange={onMoreButtonWidthChange}>
        <TabMoreButton hiddenTabsCount={visibleTabs.length} active={false} />
      </NodeDimension>

      {onAddButtonWidthChange && (
        <NodeDimension onDimensionChange={onAddButtonWidthChange}>
          {addButtonMeasurement ?? (
            <TabButton
              id="tab-add-button"
              title="+"
              LeftIcon={IconPlus}
              disableTestId={true}
            />
          )}
        </NodeDimension>
      )}
    </StyledHiddenMeasurement>
  );
};

// filepath: src/modules/ui/layout/tab-list/hooks/useTabListMeasurements.ts
export const useTabListMeasurements = ({
  visibleTabs,
  hasAddButton = false,
  rightPadding = 0,
}: UseTabListMeasurementsOptions): UseTabListMeasurementsResult => {
  const [tabWidthsById, setTabWidthsById] = useState<TabWidthsById>({});
  const [containerWidth, setContainerWidth] = useState(0);
  const [moreButtonWidth, setMoreButtonWidth] = useState(0);
  const [addButtonWidth, setAddButtonWidth] = useState(0);

  const visibleTabCount = useMemo(() => {
    return calculateVisibleTabCount({
      visibleTabs,
      tabWidthsById,
      containerWidth,
      moreButtonWidth,
      addButtonWidth: hasAddButton ? addButtonWidth : 0,
      rightPadding,
    });
  }, [
    visibleTabs,
    tabWidthsById,
    containerWidth,
    moreButtonWidth,
    addButtonWidth,
    hasAddButton,
    rightPadding,
  ]);

  const hiddenTabs = useMemo(() => {
    return visibleTabs.slice(visibleTabCount);
  }, [visibleTabs, visibleTabCount]);

  return {
    visibleTabCount,
    hiddenTabs,
    hiddenTabsCount: hiddenTabs.length,
    hasHiddenTabs: hiddenTabs.length > 0,
    onTabWidthChange: (tabId) => (dimensions) => {
      setTabWidthsById((prev) =>
        prev[tabId] !== dimensions.width
          ? { ...prev, [tabId]: dimensions.width }
          : prev,
      );
    },
    onContainerWidthChange: (dimensions) => {
      setContainerWidth((prev) =>
        prev !== dimensions.width ? dimensions.width : prev,
      );
    },
    onMoreButtonWidthChange: (dimensions) => {
      setMoreButtonWidth((prev) =>
        prev !== dimensions.width ? dimensions.width : prev,
      );
    },
    onAddButtonWidthChange: (dimensions) => {
      setAddButtonWidth((prev) =>
        prev !== dimensions.width ? dimensions.width : prev,
      );
    },
  };
};

// filepath: src/modules/ui/layout/tab-list/utils/calculateVisibleTabCount.ts
export const calculateVisibleTabCount = ({
  visibleTabs,
  tabWidthsById,
  containerWidth,
  moreButtonWidth,
  addButtonWidth = 0,
  rightPadding = 0,
}: CalculateVisibleTabCountParams): number => {
  const measuredTabWidths = visibleTabs
    .map((tab) => tabWidthsById[tab.id])
    .filter(isDefined);

  if (measuredTabWidths.length === 0 || containerWidth === 0) {
    return visibleTabs.length;
  }

  const unmeasuredTabWidth = Math.max(...measuredTabWidths);
  const availableWidth =
    containerWidth -
    TAB_LIST_HORIZONTAL_PADDING -
    rightPadding -
    (addButtonWidth > 0 ? addButtonWidth + TAB_LIST_GAP : 0);

  let totalWidth = 0;

  for (let index = 0; index < visibleTabs.length; index++) {
    const tabWidth = tabWidthsById[visibleTabs[index].id] ?? unmeasuredTabWidth;
    totalWidth += index > 0 ? TAB_LIST_GAP + tabWidth : tabWidth;

    const overflowButtonWidth =
      index < visibleTabs.length - 1 ? TAB_LIST_GAP + moreButtonWidth : 0;

    if (totalWidth + overflowButtonWidth > availableWidth) {
      return index;
    }
  }

  return visibleTabs.length;
};

// filepath: src/modules/ui/layout/tab-list/components/TabList.tsx
export const TabList = ({ tabs, componentInstanceId, loading }: TabListProps) => {
  const visibleTabs = tabs.filter((tab) => !tab.hide);

  const {
    visibleTabCount,
    hiddenTabs,
    hiddenTabsCount,
    hasHiddenTabs,
    onTabWidthChange,
    onContainerWidthChange,
    onMoreButtonWidthChange,
  } = useTabListMeasurements({
    visibleTabs,
    hasAddButton: false,
  });

  const shouldScrollTabs = isMobile;
  const renderedTabs = shouldScrollTabs
    ? visibleTabs
    : visibleTabs.slice(0, visibleTabCount);

  return (
    <>
      {visibleTabs.length > 1 && !shouldScrollTabs && (
        <TabListHiddenMeasurements
          visibleTabs={visibleTabs}
          activeTabId={activeTabId}
          loading={loading}
          onTabWidthChange={onTabWidthChange}
          onMoreButtonWidthChange={onMoreButtonWidthChange}
        />
      )}

      <NodeDimension onDimensionChange={onContainerWidthChange}>
        {renderedTabs.map((tab) => (
          <TabButton key={tab.id} id={tab.id} title={tab.title} />
        ))}

        {hasHiddenTabs && !shouldScrollTabs && (
          <TabListDropdown
            overflow={{ hiddenTabsCount, isActiveTabHidden }}
            hiddenTabs={hiddenTabs}
          />
        )}
      </NodeDimension>
    </>
  );
};
```

## 2. 사용 예제

```tsx
// filepath: src/modules/ui/layout/tab-list/components/__stories__/Tablist.stories.tsx
const tabs = [
  { id: 'general', title: 'General', logo: AVATAR_URL_MOCK },
  { id: 'contacts', title: 'Contacts', Icon: IconUser },
  { id: 'messages', title: 'Messages', Icon: IconMail },
  { id: 'calls', title: 'Calls', Icon: IconPhone },
  { id: 'calendar', title: 'Calendar', Icon: IconCalendar },
  { id: 'sales', title: 'Sales', Icon: IconHome, disabled: true },
  { id: 'hidden', title: 'Hidden Tab', Icon: IconCheckbox, hide: true },
  { id: 'time', title: 'Time Tracking', logo: AVATAR_URL_MOCK },
  { id: 'favorites', title: 'Favorites', Icon: IconHeart },
  { id: 'reports', title: 'Reports', Icon: IconCheckbox },
];

const StyledInteractiveContainer = styled.div`
  max-width: 100%;
  min-width: 300px;
  overflow: auto;
  resize: horizontal;
  width: 600px;
`;

<StyledInteractiveContainer>
  <TabList tabs={tabs} componentInstanceId="resizable-tabs" />
</StyledInteractiveContainer>;

// filepath: src/modules/ui/layout/tab-list/components/TabListDropdown.tsx
<Dropdown
  dropdownId={dropdownId}
  dropdownPlacement="bottom-end"
  clickableComponent={
    <TabMoreButton
      hiddenTabsCount={overflow.hiddenTabsCount}
      active={overflow.isActiveTabHidden}
    />
  }
  dropdownComponents={
    <DropdownContent>
      <DropdownMenuItemsContainer>
        {hiddenTabs.map((tab) => (
          <MenuItemSelectAvatar
            key={tab.id}
            text={tab.title}
            avatar={<TabAvatar tab={tab} />}
            selected={tab.id === activeTabId}
            onClick={() => {
              onTabSelect(tab.id);
              onClose();
            }}
          />
        ))}
      </DropdownMenuItemsContainer>
    </DropdownContent>
  }
/>;
```
