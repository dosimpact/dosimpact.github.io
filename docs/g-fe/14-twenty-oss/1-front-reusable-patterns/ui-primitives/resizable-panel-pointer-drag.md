# Resizable Panel Pointer Drag

A narrow edge or gap starts document-level pointer tracking, previews width through a CSS variable, then commits or collapses on release.

핵심은 `drag previews are cheap, final width is committed once`이다.

## 1. 모듈 코드

- `src/modules/ui/layout/resizable-panel/hooks/useResizablePanel.ts`: drag start, move, end lifecycle과 min/max clamp를 관리한다.
- `src/modules/ui/layout/resizable-panel/components/ResizablePanelEdge.tsx`: absolute positioned resize edge와 visual handle을 렌더링한다.
- `src/modules/ui/layout/resizable-panel/components/ResizablePanelGap.tsx`: visual gap과 grabbable area를 분리한 resize handle을 렌더링한다.
- `src/modules/ui/utilities/pointer-event/hooks/useTrackPointer.ts`: drag 중 document-level mouse/touch position을 hook callback으로 전달한다.
- `src/modules/ui/theme/utils/getUiZoom.ts`: root zoom 환경에서 pointer delta를 design-pixel width로 보정한다.

```tsx
// 큰 흐름: A narrow edge or gap starts document-level pointer tracking, previews width through a CSS variable, then commits or collapses on release.
// 핵심 기준: `drag previews are cheap, final width is committed once`이다.

// filepath: src/modules/ui/layout/resizable-panel/hooks/useResizablePanel.ts
const clampWidth = (width: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, width));

export const useResizablePanel = ({
  side,
  constraints,
  currentWidth,
  onWidthChange,
  onCollapse,
  cssVariableName,
  onResizeStart,
}: UseResizablePanelProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);
  const [startWidth, setStartWidth] = useState<number>(0);
  const [hasDragged, setHasDragged] = useState(false);
  const [dragUiZoom, setDragUiZoom] = useState(1);

  const handleResizeMove = useCallback<PointerEventListener>(
    ({ x }) => {
      if (startX === null) return;

      const deltaX = (x - startX) / dragUiZoom;

      if (!hasDragged && Math.abs(deltaX) > RESIZE_DRAG_THRESHOLD_PX) {
        setHasDragged(true);
        onResizeStart?.();
      }

      if (Math.abs(deltaX) > RESIZE_DRAG_THRESHOLD_PX) {
        const widthDelta = side === 'right' ? deltaX : -deltaX;
        const clampedWidth = clampWidth(
          startWidth + widthDelta,
          constraints.min,
          constraints.max,
        );

        if (cssVariableName !== undefined) {
          document.documentElement.style.setProperty(
            cssVariableName,
            `${clampedWidth}px`,
          );
        }
      }
    },
    [
      dragUiZoom,
      startX,
      startWidth,
      hasDragged,
      side,
      constraints.min,
      constraints.max,
      cssVariableName,
      onResizeStart,
    ],
  );

  const handleResizeEnd = useCallback<PointerEventListener>(
    ({ x }) => {
      if (startX === null) {
        setIsResizing(false);
        return;
      }

      const deltaX = (x - startX) / dragUiZoom;

      if (!hasDragged) {
        onCollapse();
      } else {
        const widthDelta = side === 'right' ? deltaX : -deltaX;
        const finalWidth = clampWidth(
          startWidth + widthDelta,
          constraints.min,
          constraints.max,
        );
        onWidthChange(finalWidth);
      }

      setStartX(null);
      setIsResizing(false);
    },
    [
      dragUiZoom,
      startX,
      startWidth,
      hasDragged,
      side,
      constraints.min,
      constraints.max,
      onCollapse,
      onWidthChange,
    ],
  );

  useTrackPointer({
    shouldTrackPointer: isResizing,
    onMouseMove: handleResizeMove,
    onMouseUp: handleResizeEnd,
  });

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setDragUiZoom(getUiZoom());
      setStartX(event.clientX);
      setStartWidth(currentWidth);
      setHasDragged(false);
      setIsResizing(true);
    },
    [currentWidth],
  );

  return {
    isHovered,
    isResizing,
    handleMouseDown,
    handleMouseEnter: () => setIsHovered(true),
    handleMouseLeave: () => setIsHovered(false),
  };
};

// filepath: src/modules/ui/layout/resizable-panel/components/ResizablePanelEdge.tsx
export const ResizablePanelEdge = ({
  side,
  constraints,
  currentWidth,
  onWidthChange,
  onCollapse,
  showHandle = true,
  cssVariableName,
  onResizeStart,
}: ResizablePanelEdgeProps) => {
  const {
    isHovered,
    isResizing,
    handleMouseDown,
    handleMouseEnter,
    handleMouseLeave,
  } = useResizablePanel({
    side,
    constraints,
    currentWidth,
    onWidthChange,
    onCollapse,
    cssVariableName,
    onResizeStart,
  });

  return (
    <StyledEdge
      side={side}
      isActive={isResizing}
      isHovered={isHovered}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showHandle && (
        <StyledHandle isActive={isResizing} isHovered={isHovered} />
      )}
    </StyledEdge>
  );
};

// filepath: src/modules/ui/layout/resizable-panel/components/ResizablePanelGap.tsx
export const ResizablePanelGap = ({
  side,
  constraints,
  currentWidth,
  onWidthChange,
  onCollapse,
  gapWidth,
  cssVariableName,
  onResizeStart,
}: ResizablePanelGapProps) => {
  const { handleMouseDown, handleMouseEnter, handleMouseLeave } =
    useResizablePanel({
      side,
      constraints,
      currentWidth,
      onWidthChange,
      onCollapse,
      cssVariableName,
      onResizeStart,
    });

  return (
    <StyledGap
      gapWidth={gapWidth}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};

// filepath: src/modules/ui/utilities/pointer-event/hooks/useTrackPointer.ts
export const useTrackPointer = ({
  shouldTrackPointer = true,
  onMouseMove,
  onMouseDown,
  onMouseUp,
}: {
  shouldTrackPointer?: boolean;
  onMouseMove?: PointerEventListener;
  onMouseDown?: PointerEventListener;
  onMouseUp?: PointerEventListener;
}) => {
  const extractPosition = useCallback((event: MouseEvent | TouchEvent) => {
    const clientX =
      'clientX' in event ? event.clientX : event.changedTouches[0].clientX;
    const clientY =
      'clientY' in event ? event.clientY : event.changedTouches[0].clientY;

    return { clientX, clientY };
  }, []);

  useEffect(() => {
    if (!shouldTrackPointer) {
      return;
    }

    const onInternalMouseMove = (event: MouseEvent | TouchEvent) => {
      const { clientX, clientY } = extractPosition(event);
      onMouseMove?.({ x: clientX, y: clientY, event });
    };

    const onInternalMouseUp = (event: MouseEvent | TouchEvent) => {
      const { clientX, clientY } = extractPosition(event);
      onMouseUp?.({ x: clientX, y: clientY, event });
    };

    document.addEventListener('mousemove', onInternalMouseMove);
    document.addEventListener('mouseup', onInternalMouseUp);

    return () => {
      document.removeEventListener('mousemove', onInternalMouseMove);
      document.removeEventListener('mouseup', onInternalMouseUp);
    };
  }, [shouldTrackPointer, extractPosition, onMouseMove, onMouseUp]);
};

// filepath: src/modules/ui/theme/utils/getUiZoom.ts
export const getUiZoom = (): number => {
  if (typeof document === 'undefined') {
    return 1;
  }

  const zoom = Number(getComputedStyle(document.documentElement).zoom);

  return Number.isFinite(zoom) && zoom > 0 ? zoom : 1;
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Resizable Panel Pointer Drag 패턴을 실제 호출부에서 조합한다.

// filepath: src/modules/ui/navigation/navigation-drawer/components/NavigationDrawer.tsx
const [isResizing, setIsResizing] = useState(false);
const [navigationDrawerWidth, setNavigationDrawerWidth] = useAtomState(
  navigationDrawerWidthState,
);

const handleCollapse = () => {
  setIsNavigationDrawerExpanded(false);
  setNavigationDrawerActiveTab(NAVIGATION_DRAWER_TABS.NAVIGATION_MENU);
  setIsResizing(false);
  setTableWidthResizeIsActive(true);
};

const handleWidthChange = (width: number) => {
  setNavigationDrawerWidth(width);
  setIsResizing(false);
  setTableWidthResizeIsActive(true);
};

const handleResizeStart = () => {
  setIsResizing(true);
  setTableWidthResizeIsActive(false);
};

<StyledAnimatedContainer
  isExpanded={isExpanded}
  isResizing={isResizing}
>
  <StyledContainer isExpanded={isExpanded}>{children}</StyledContainer>

  {isNavigationDrawerExpanded && !isMobile && !isSettingsDrawer && (
    <ResizablePanelEdge
      side="right"
      constraints={NAVIGATION_DRAWER_CONSTRAINTS}
      currentWidth={navigationDrawerWidth}
      onWidthChange={handleWidthChange}
      onCollapse={handleCollapse}
      showHandle={false}
      cssVariableName={NAVIGATION_DRAWER_WIDTH_VAR}
      onResizeStart={handleResizeStart}
    />
  )}
</StyledAnimatedContainer>;
```
