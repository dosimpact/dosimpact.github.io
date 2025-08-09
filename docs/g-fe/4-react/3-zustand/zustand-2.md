---
sidebar_position: 2
---

# 2.Zustand Patterns  

- [2.Zustand Patterns](#2zustand-patterns)
  - [Typing](#typing)
    - [State, Actions 을 분리해서 타입 정의](#state-actions-을-분리해서-타입-정의)
    - [내부 로직 추상화](#내부-로직-추상화)
    - [람다 활용](#람다-활용)
    - [유틸성 공통 로직 재사용](#유틸성-공통-로직-재사용)
    - [액션 in 액션 재사용](#액션-in-액션-재사용)
    - [immer 불편성 관리 middleware](#immer-불편성-관리-middleware)


## Typing  

### State, Actions 을 분리해서 타입 정의  

- 타입 자체를 분리해서 상태와 행동을 구분    
- store가 많이 커지면 행동 객체를 분리  
  - action, builder, validator 등  

```js
// Todo 항목 타입
export type TodoItem = {
  id: TodoId;
  title?: string | null;
  completed?: boolean | null;
  ownerId?: string | null;
};
export type TodoId = string;

---

export type TodoStoreState = {
  // 로그인한 유저 
  loggedUserId: string;
  // 서버에서 불러온 리스트  
  originalTodos: Record<TodoId, TodoItem>;
  // 변경한 리스트  
  todos: Record<TodoId, TodoItem>;
};
-- 

export interface TodoStoreAction {
  // 조회
  getTodoById: (id: TodoId, fromOriginal?: boolean) => TodoItem | undefined;
  getIsChangedTodo: (id: TodoId) => boolean;
  getIsAnyChangedTodo: () => boolean;

  // 수정
  setTodoById: (id: TodoId, next: TodoItem) => void;
  setTodosByIds: (ids: TodoId[], patch: TodoItem) => void;
  setLoggedUserId: (userId: string) => void;
  deleteTodosByIds: (ids: TodoId[]) => void;

  // 동기화
  refreshTodos: (list: TodoItem[]) => void;

  // DTO & Validation
  buildUpsertTodoRequestDto: (args: { targetId: string; userId: string }) => {
    targetId: string;
    todos: Partial<TodoItem>[];
  };
  validateTodo: (id: TodoId) => string[];
  validateAllTodos: () => { validateResult: Record<TodoId, string[]>; hasError: boolean };
}



// 확실하게 구분 하는 다른 방법. (참고)  

import { create } from 'zustand'

export const useCountStore = create<{
  count: number
  actions: {
    increase: () => void
    decrease: () => void
  }
}>(set => ({
  count: 1,
  actions: {
    increase: () => set(state => ({ count: state.count + 1 })),
    decrease: () => set(state => ({ count: state.count - 1 }))
  }
}))

```


### 내부 로직 추상화

```js
import * as R from 'ramda';
import type { TodoItem } from './todo.store';

// 모든 주요 필드가 비어있으면 true
export const isTodoFieldsFalsy = (todo: TodoItem) => !todo.title && R.isNil(todo.completed);

export const isStrictEqual = (a: unknown, b: unknown) => a === b;

export const isChangedTodo = (asis?: TodoItem, tobe?: TodoItem) => {
  const Falsy = (v: boolean) => v === false;
  
  if (!R.isNil(asis) && !R.isNil(tobe)) {
    return [
      isStrictEqual(asis?.title, tobe?.title),
      isStrictEqual(asis?.completed, tobe?.completed),
    ].some(Falsy);
  }

  // 둘 중 하나가 다른경우 = True, Nil로 같은 경우 = False  
  return R.isNil(asis) !== R.isNil(tobe);
};
---
export const useTodoStore = create<TodoStoreState & TodoStoreAction>()(
  devtools((set, get) => ({
    ...
    getIsChangedTodo: (id) => {
      const original = get().originalTodos[id];
      const current = get().todos[id];
      return isChangedTodo(original, current);
    },
  }))
);
```


### 람다 활용  

```js
export const useTodoStore = create<TodoStoreState & TodoStoreAction>()(
  devtools((set, get) => ({
    // --- Remeda 파이프 유지: values -> filter -> map -> mapValues -> pick ---
    buildUpsertTodoRequestDto: ({ targetId, userId }) => {
      const todosObj = get().todos;

      const todos = pipe(
        todosObj as Record<string, TodoItem>,
        values,
        filter((t) => {
          const isChanged = get().getIsChangedTodo(t.id);
          const isEditable = t?.ownerId ? t.ownerId === userId : true;
          // 변경된 것 + 본인 소유만 포함
          return isChanged && isEditable;
        }),
        map((t) => {
          const id = t.id;
          return {
            ...t,
            // 원본과 비교해 상태가 필요하다면 계산해서 포함 (필요 없으면 제거)
            todoStatus: getTodoStatus(get().getTodoById(id, true), t),
          };
        }),
        map(
          // placeholder 값 제거
          mapValues((v) => (isNullish(v) || v === '' ? null : v))
        ),
        map(
          pick(['id', 'title', 'note', 'completed', 'isPrimary']) // 필요 필드만 전송
        )
      );

      return { targetId, todos };
    },
  }))
);
```



### 유틸성 공통 로직 재사용

```js
// --- 공통 로직 (권한 체크) ---
const canEdit = (state: TodoStoreState, id: TodoId) => {...};
// isPrimary 중복 제거 (true는 하나만)
const removeDuplicatedPrimary = (state: TodoStoreState, next: Partial<TodoItem>) => {...};

// --- store ---
export const useTodoStore = create<TodoStoreState & TodoStoreAction>()(
  devtools((set, get) => ({
    // 단건 업데이트
    setTodoById: (id, patch) => {
      set(_prev => {
        let prev = R.clone(_prev) as TodoStoreState;

        // 📌 공통로직 - 메인 체크
        prev = removeDuplicatedPrimary(prev, { ...patch, id }); 

        // 📌 공통로직 - 권한 체크
        if (!canEdit(prev, id)) return prev;

        const next = {
          todos: {
            ...prev.todos,
            [id]: { id, ...(prev.todos[id] ?? {}), ...patch },
          },
        };
        return next;
      });
    },

    // 다건 업데이트
    setTodosByIds: (ids, patch) => {
      set(_prev => {
        let prev = R.clone(_prev) as TodoStoreState;

        const repId = ids[ids.length - 1];
        // 📌 공통로직 - 메인 체크
        prev = removeDuplicatedPrimary(prev, { ...patch, id: repId }); 

        const updated = R.clone(prev.todos);

        ids.forEach(id => {
          // 📌 공통로직 - 권한 체크
          if (!canEdit(prev, id)) return;

          updated[id] = {
            id,
            ...(updated[id] ?? {}),
            ...patch,
          };
        });

        return { todos: updated };
      });
    },
  }))
);
```


### 액션 in 액션 재사용  

- todo 하나를 검증하는 액션을 만들면, todo list를 검증하는 액션에 재활용 가능하다.  

```js
// 6.액션 in 액션 재사용
// --- store ---
export const useTodoStore = create<TodoStoreState & TodoStoreAction>()(
  devtools((set, get) => ({
    todos: {},
    // (정의) 단일 항목 검증
    validateTodoData: (id) => {
      const data = get().todos[id];
      if (!data) return [];
      const parsed = createTodoErrorSchema().safeParse(data);
      if (parsed.success) return [];
      return parsed.error.issues.map(i => i.message);
    },

    // (호출) 전체 검증: 액션 안에서 액션 재사용
    validateAllTodoData: () => {
      const todos = get().todos;
      const result: Record<TodoId, string[]> = {};

      Object.keys(todos).forEach((id) => {
        result[id as TodoId] = get().validateTodoData(id as TodoId); // 재사용!
      });

      const hasError = Object.values(result).some(errors => errors.length > 0);
      return { validateResult: result, hasError };
    },
  }))
);
```



### immer 불편성 관리 middleware


```js
// useTodoStore.immer.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export const useTodoStore = create<TodoStore>()(
  devtools(
    immer<TodoStore>((set) => ({
      // --- State ---
      todos: {},
      isReadOnly: false,
      editorModalOpen: false,
      currentEditingId: undefined,
      filter: 'all',

      // --- Actions ---
      addTodo: (title) =>
        set((state) => {
          const id = crypto.randomUUID?.() ?? String(Date.now());
          state.todos[id] = { id, title, completed: false };
        }),

      updateTodo: (id, patch) =>
        set((state) => {
          const t = state.todos[id];
          if (!t) return;
          if (patch.title !== undefined) t.title = patch.title;
          if (patch.completed !== undefined) t.completed = patch.completed;
        }),

      toggleTodo: (id) =>
        set((state) => {
          const t = state.todos[id];
          if (t) t.completed = !t.completed;
        }),

      removeTodo: (id) =>
        set((state) => {
          delete state.todos[id];
        }),

      // UI/설정
      setIsReadOnly: (v) =>
        set((state) => {
          state.isReadOnly = v;
        }),

      setEditorModalOpen: (open, id) =>
        set((state) => {
          state.editorModalOpen = open;
          state.currentEditingId = open ? id : undefined;
        }),

      setFilter: (f) =>
        set((state) => {
          state.filter = f;
        }),
    })),
    {
      name: 'todoStore',
      enabled: process.env.NODE_ENV !== 'production',
    }
  )
);

```
