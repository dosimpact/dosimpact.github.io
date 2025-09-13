---
sidebar_position: 2
---

# Remeda 2 - Patterns

## Request Dto Builder  

```js
import { pipe, values, filter, map, mapValues, pick, isNullish } from 'remeda';

// --- store ---
export const useTodoStore = create<TodoStoreState & TodoStoreAction>()(
  devtools((set, get) => ({
    // --- Remeda 파이프 유지: values -> filter -> map -> mapValues -> pick ---
    buildUpsertTodoRequestDto: ({ vendorId, userId }) => {
      const todosObj = get().todos;

      const todos = pipe(
        // original data - 배열형태(원소는 객체)  
        todosObj as Record<string, TodoItem>,
        // iteration target : 이터레이션 대상이 객체  
        values, 
        // filter : 변경된 것 + 본인 소유만 포함
        filter((t) => {
          const isChanged = get().getIsChangedTodo(t.id);
          const isEditable = t?.ownerId ? t.ownerId === userId : true;
          return isChanged && isEditable;
        }),
        // computed fields : 상태업데이터
        map((t) => {
          const id = t.id;
          return {
            ...t,
            // 원본과 비교해 상태가 필요하다면 계산해서 포함 (필요 없으면 제거)
            todoStatus: getTodoStatus(get().getTodoById(id, true), t),
          };
        }),
        // map + mapValues : ( 2중 for문 )이터레이션 대상이 객체 필드이다.  
        map(
          mapValues((v) => (isNullish(v) || v === '' ? null : v))
        ),
        // Object fields picker  
        map(
          pick(['id', 'title', 'note', 'completed', 'isPrimary']) // 필요 필드만 전송
        )
      );

      return { vendorId, todos };
    },
  }))
);
```