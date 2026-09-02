# Drag Drop Context Adapter

dnd-kit의 provider/event를 앱에서 쓰는 `source/destination` drop result로 변환하는 패턴이다.

핵심은 `dnd library events in, app drop result out`이다.

## 1. 모듈 코드

- `src/modules/ui/utilities/drag-and-drop/context/DragDropItemDndContext.tsx`: 현재 hover 중인 drop target index와 droppable id를 하위 컴포넌트에 공유한다.
- `src/modules/ui/layout/draggable-list/components/DraggableList.tsx`: dnd-kit provider를 감싸고 drag move/end를 앱의 reorder result로 변환한다.
- `src/modules/ui/utilities/drag-and-drop/components/DragDropItemSortableCell.tsx`: item을 sortable source로 등록하고 group/index metadata를 dnd data에 넣는다.

```tsx
// 큰 흐름: dnd-kit의 provider/event를 앱에서 쓰는 `source/destination` drop result로 변환하는 패턴이다.
// 핵심 기준: `dnd library events in, app drop result out`이다.

// filepath: src/modules/ui/utilities/drag-and-drop/context/DragDropItemDndContext.tsx
import { createContext } from 'react';

export type DragDropItemDndContextValue = {
  activeDropTargetIndex: number | null;
  activeDroppableId?: string | null;
};

export const DragDropItemDndContext =
  createContext<DragDropItemDndContextValue>({
    activeDropTargetIndex: null,
    activeDroppableId: null,
  });

// filepath: src/modules/ui/layout/draggable-list/components/DraggableList.tsx
import { DragDropProvider } from '@dnd-kit/react';
import { useMemo, useState } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { v4 } from 'uuid';

import { DraggableListGroupContext } from '@/ui/layout/draggable-list/contexts/DraggableListGroupContext';
import { type DraggableListDropResult } from '@/ui/layout/draggable-list/types/DraggableListDropResult';
import { DragDropItemDropTarget } from '@/ui/utilities/drag-and-drop/components/DragDropItemDropTarget';
import { DND_KIT_PROVIDER_PLUGINS_WITHOUT_DROP_ANIMATION } from '@/ui/utilities/drag-and-drop/constants/DndKitProviderPluginsWithoutDropAnimation';
import { DND_KIT_SENSORS } from '@/ui/utilities/drag-and-drop/constants/DndKitSensors';
import {
  DragDropItemDndContext,
  type DragDropItemDndContextValue,
} from '@/ui/utilities/drag-and-drop/context/DragDropItemDndContext';
import { getDestinationIndex } from '@/ui/utilities/drag-and-drop/utils/getDestinationIndex';
import { resolveDropFromPointer } from '@/ui/utilities/drag-and-drop/utils/resolveDropFromPointer';

type DraggableListItemDndData = {
  droppableId: string;
  index: number;
};

export const DraggableList = ({
  draggableItems,
  onDragEnd,
}: {
  draggableItems: React.ReactNode;
  onDragEnd: (result: DraggableListDropResult) => void;
}) => {
  const [group] = useState(() => v4());
  const [itemIndexByDraggableId] = useState(() => new Map<string, number>());
  const [trailingIndex, setTrailingIndex] = useState(0);
  const [activeDropTargetIndex, setActiveDropTargetIndex] = useState<
    number | null
  >(null);

  const groupContextValue = useMemo(
    () => ({
      group,
      registerItem: (draggableId: string, index: number) => {
        itemIndexByDraggableId.set(draggableId, index);
        setTrailingIndex(Math.max(...itemIndexByDraggableId.values()) + 1);
      },
      unregisterItem: (draggableId: string) => {
        itemIndexByDraggableId.delete(draggableId);
        setTrailingIndex(
          itemIndexByDraggableId.size === 0
            ? 0
            : Math.max(...itemIndexByDraggableId.values()) + 1,
        );
      },
    }),
    [group, itemIndexByDraggableId],
  );

  const handleDragMove = (event: DragDropProviderDragMoveEvent<DraggableListItemDndData>) => {
    const resolvedDrop = resolveDropFromPointer({
      target: event.operation.target,
      pointer: event.operation.position.current,
      defaultOrientation: 'horizontal',
      getDroppableItemCount: () => trailingIndex,
    });

    setActiveDropTargetIndex(resolvedDrop?.dropTargetIndex ?? null);
  };

  const handleDragEnd = (event: DragDropProviderDragEndEvent<DraggableListItemDndData>) => {
    setActiveDropTargetIndex(null);

    const source = event.operation.source;
    const sourceData = source?.data as DraggableListItemDndData | undefined;

    if (event.canceled || !isDefined(source) || sourceData?.droppableId !== group) {
      return;
    }

    const resolvedDrop = resolveDropFromPointer({
      target: event.operation.target,
      pointer: event.operation.position.current,
      defaultOrientation: 'horizontal',
      getDroppableItemCount: () => trailingIndex,
    });

    if (!isDefined(resolvedDrop) || resolvedDrop.droppableId !== group) {
      return;
    }

    const destinationIndex = getDestinationIndex({
      dropTargetIndex: resolvedDrop.dropTargetIndex,
      sourceIndex: sourceData.index,
      sourceDroppableId: group,
      destinationDroppableId: group,
    });

    if (destinationIndex !== sourceData.index) {
      onDragEnd({
        draggableId: String(source.id),
        source: { index: sourceData.index },
        destination: { index: destinationIndex },
      });
    }
  };

  const contextValues: DragDropItemDndContextValue = {
    activeDropTargetIndex,
    activeDroppableId: group,
  };

  return (
    <DragDropItemDndContext.Provider value={contextValues}>
      <DragDropProvider
        sensors={DND_KIT_SENSORS}
        plugins={DND_KIT_PROVIDER_PLUGINS_WITHOUT_DROP_ANIMATION}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        <DraggableListGroupContext.Provider value={groupContextValue}>
          {draggableItems}
          <DragDropItemDropTarget
            index={trailingIndex}
            droppableId={group}
            orientation="horizontal"
          />
        </DraggableListGroupContext.Provider>
      </DragDropProvider>
    </DragDropItemDndContext.Provider>
  );
};

// filepath: src/modules/ui/utilities/drag-and-drop/components/DragDropItemSortableCell.tsx
import { type UseSortableInput, useSortable } from '@dnd-kit/react/sortable';
import { DragDropItemSortableHandleRefContext } from '@/ui/utilities/drag-and-drop/context/DragDropItemSortableHandleRefContext';

export const DragDropItemSortableCell = ({
  children,
  data,
  disabled = false,
  group,
  id,
  index,
  type,
}: {
  children: React.ReactNode;
  data?: Record<string, unknown>;
  disabled?: boolean;
  group: string;
  id: string;
  index: number;
  type?: string;
}) => {
  const { handleRef, ref } = useSortable({
    id,
    index,
    group,
    type,
    data: {
      ...data,
      droppableId: group,
      index,
    },
    disabled,
  } satisfies UseSortableInput);

  return (
    <DragDropItemSortableHandleRefContext.Provider value={handleRef}>
      <div ref={ref}>{children}</div>
    </DragDropItemSortableHandleRefContext.Provider>
  );
};
```

## 2. 사용 예제

```tsx
// 사용 흐름: Drag Drop Context Adapter 패턴을 실제 호출부에서 조합한다.

import { DraggableList } from '@/ui/layout/draggable-list/components/DraggableList';
import { DragDropItemSortableCell } from '@/ui/utilities/drag-and-drop/components/DragDropItemSortableCell';

export const SortableFields = ({ fields, reorderFields }: Props) => {
  return (
    <DraggableList
      draggableItems={fields.map((field, index) => (
        <DragDropItemSortableCell
          key={field.id}
          id={field.id}
          index={index}
          group="fields"
        >
          <FieldRow field={field} />
        </DragDropItemSortableCell>
      ))}
      onDragEnd={({ source, destination }) => {
        reorderFields(source.index, destination.index);
      }}
    />
  );
};
```
