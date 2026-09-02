# Expandable List Overflow Dropdown

Inline chips render until the row overflows, then a compact `+N` chip opens a dropdown with the full list.

핵심은 `inline display is capped by layout, expanded display keeps all children`이다.

## 1. 모듈 코드

- `src/modules/ui/layout/expandable-list/components/ExpandableList.tsx`: child overflow를 감지해 inline children과 hidden count/dropdown을 조합한다.
- `src/modules/ui/layout/expandable-list/components/ExpandableListResizeEffect.tsx`: container resize가 settle된 뒤 overflow 계산을 초기화한다.
- `src/modules/ui/layout/expandable-list/components/ExpandedListDropdown.tsx`: anchor 기준 floating dropdown에 전체 children을 렌더링한다.
- `src/modules/ui/layout/expandable-list/utils/isFirstOverflowingChildElement.ts`: 첫 overflow child index를 DOM width로 판정한다.

```tsx
// 큰 흐름: Inline chips render until the row overflows, then a compact `+N` chip opens a dropdown with the full list.
// 핵심 기준: `inline display is capped by layout, expanded display keeps all children`이다.

// filepath: src/modules/ui/layout/expandable-list/components/ExpandableList.tsx
export const ExpandableList = ({
  children,
  isChipCountDisplayed: isChipCountDisplayedFromProps,
  maxInlineCount,
}: {
  children: ReactElement[];
} & ExpandableListProps) => {
  const cappedChildren = isDefined(maxInlineCount)
    ? children.slice(0, maxInlineCount)
    : children;

  const [isChipCountDisplayedInternal, setIsChipCountDisplayedInternal] =
    useState(false);
  const isChipCountDisplayed = isDefined(isChipCountDisplayedFromProps)
    ? isChipCountDisplayedFromProps
    : isChipCountDisplayedInternal;

  const [isListExpanded, setIsListExpanded] = useState(false);
  const [childrenContainerElement, setChildrenContainerElement] =
    useState<HTMLDivElement | null>(null);
  const [previousChildrenContainerWidth, setPreviousChildrenContainerWidth] =
    useState(childrenContainerElement?.clientWidth ?? 0);

  const containerRef = useRef<HTMLDivElement>(null);
  const [firstHiddenChildIndex, setFirstHiddenChildIndex] = useState(
    cappedChildren.length,
  );

  const hiddenChildrenCount = children.length - firstHiddenChildIndex;
  const canDisplayChipCount = isChipCountDisplayed && hiddenChildrenCount > 0;
  const visibleChildren = isChipCountDisplayed
    ? cappedChildren.slice(0, firstHiddenChildIndex)
    : cappedChildren;

  const resetFirstHiddenChildIndex = useCallback(() => {
    setFirstHiddenChildIndex(cappedChildren.length);
  }, [cappedChildren.length]);

  useEffect(() => {
    resetFirstHiddenChildIndex();
  }, [isChipCountDisplayed, cappedChildren.length, resetFirstHiddenChildIndex]);

  const handleClickOutside = () => {
    setIsListExpanded(false);

    if (
      childrenContainerElement?.clientWidth !== previousChildrenContainerWidth
    ) {
      resetFirstHiddenChildIndex();
      setPreviousChildrenContainerWidth(
        childrenContainerElement?.clientWidth ?? 0,
      );
    }
  };

  return (
    <StyledContainer
      ref={containerRef}
      onMouseEnter={
        isChipCountDisplayedFromProps
          ? undefined
          : () => setIsChipCountDisplayedInternal(true)
      }
      onMouseLeave={
        isChipCountDisplayedFromProps
          ? undefined
          : () => setIsChipCountDisplayedInternal(false)
      }
    >
      {isChipCountDisplayed && (
        <ExpandableListResizeEffect
          containerRef={containerRef}
          onContainerWidthChange={resetFirstHiddenChildIndex}
        />
      )}

      <StyledChildrenContainer ref={setChildrenContainerElement}>
        {visibleChildren.map((child, index) => (
          <StyledChildContainer
            key={index}
            ref={
              isChipCountDisplayed
                ? (childElement) => {
                    if (
                      index > 0 &&
                      isFirstOverflowingChildElement({
                        containerElement: childrenContainerElement,
                        childElement,
                      })
                    ) {
                      setFirstHiddenChildIndex(index);
                    }
                  }
                : undefined
            }
          >
            {child}
          </StyledChildContainer>
        ))}
      </StyledChildrenContainer>

      {canDisplayChipCount && (
        <AnimatedContainer>
          <StyledUnShrinkableContainer
            onClick={(event) => {
              event.stopPropagation();
              setIsListExpanded(true);
            }}
          >
            <OverflowingTextWithTooltip text={`+${hiddenChildrenCount}`} />
          </StyledUnShrinkableContainer>
        </AnimatedContainer>
      )}

      {isListExpanded && (
        <ExpandedListDropdown
          anchorElement={containerRef.current ?? undefined}
          onClickOutside={handleClickOutside}
        >
          {children}
        </ExpandedListDropdown>
      )}
    </StyledContainer>
  );
};

// filepath: src/modules/ui/layout/expandable-list/components/ExpandableListResizeEffect.tsx
export const ExpandableListResizeEffect = ({
  containerRef,
  onContainerWidthChange,
}: ExpandableListResizeEffectProps) => {
  useEffect(() => {
    const containerElement = containerRef.current;

    if (!isDefined(containerElement)) {
      return;
    }

    let previousWidth = containerElement.clientWidth;
    let settleTimeoutId: ReturnType<typeof setTimeout> | undefined;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!isDefined(entry)) {
        return;
      }

      const newWidth = entry.contentRect.width;

      if (Math.abs(newWidth - previousWidth) <= RESIZE_THRESHOLD_PX) {
        return;
      }

      previousWidth = newWidth;
      clearTimeout(settleTimeoutId);
      settleTimeoutId = setTimeout(
        onContainerWidthChange,
        RESIZE_SETTLE_DELAY_MS,
      );
    });

    resizeObserver.observe(containerElement);

    return () => {
      clearTimeout(settleTimeoutId);
      resizeObserver.disconnect();
    };
  }, [containerRef, onContainerWidthChange]);

  return null;
};

// filepath: src/modules/ui/layout/expandable-list/utils/isFirstOverflowingChildElement.ts
export const isFirstOverflowingChildElement = ({
  containerElement,
  childElement,
}: {
  containerElement: HTMLElement | null;
  childElement: HTMLElement | null;
}) =>
  isDefined(containerElement) &&
  isDefined(childElement) &&
  isDefined(childElement.previousElementSibling) &&
  containerElement.scrollWidth > containerElement.clientWidth &&
  childElement.offsetLeft + childElement.offsetWidth >
    containerElement.clientWidth &&
  (childElement.previousElementSibling as HTMLElement).offsetLeft <
    containerElement.clientWidth;

// filepath: src/modules/ui/layout/expandable-list/components/ExpandedListDropdown.tsx
export const ExpandedListDropdown = ({
  anchorElement,
  children,
  onClickOutside,
}: ExpandedListDropdownProps) => {
  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',
    middleware: [offset({ mainAxis: -9, crossAxis: -7 }), shift()],
    elements: { reference: anchorElement },
  });

  useListenClickOutside({
    refs: [refs.domReference],
    callback: () => {
      onClickOutside?.();
    },
    listenerId: 'expandable-list',
  });

  const dropdownContentWidth = anchorElement
    ? Math.max(220, anchorElement.getBoundingClientRect().width)
    : undefined;

  return (
    <FloatingPortal>
      <StyledDropdownContentContainer
        ref={refs.setFloating}
        style={floatingStyles}
      >
        <OverlayContainer>
          <DropdownContent widthInPixels={dropdownContentWidth}>
            <StyledExpandedListContainer>
              {children}
            </StyledExpandedListContainer>
          </DropdownContent>
        </OverlayContainer>
      </StyledDropdownContentContainer>
    </FloatingPortal>
  );
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Expandable List Overflow Dropdown 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/ui/field/display/components/EmailsDisplay.tsx
const emails = useMemo(
  () =>
    [
      value?.primaryEmail ? value.primaryEmail : null,
      ...(value?.additionalEmails ?? []),
    ].filter(isDefined),
  [value?.primaryEmail, value?.additionalEmails],
);

return isFocused ? (
  <ExpandableList isChipCountDisplayed>
    {emails.map((email, index) => (
      <RoundedLink
        key={index}
        label={email}
        href={`mailto:${email}`}
        onClick={(event) => onEmailClick?.(email, event)}
      />
    ))}
  </ExpandableList>
) : (
  <StyledContainer>
    {emails.map((email, index) => (
      <RoundedLink
        key={index}
        label={email}
        href={`mailto:${email}`}
        onClick={(event) => onEmailClick?.(email, event)}
      />
    ))}
  </StyledContainer>
);

// filepath: src/modules/ui/field/display/components/FilesDisplay.tsx
<ExpandableList>
  {value.map((file) => (
    <FileChip
      key={file.fileId}
      file={file}
      onClick={handlePreview}
      forceDisableClick={forceDisableClick}
    />
  ))}
</ExpandableList>;
```
