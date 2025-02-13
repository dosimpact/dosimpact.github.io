---
sidebar_position: 1
---

# Zustand Basic
- [Zustand Basic](#zustand-basic)
  - [Example](#example)
    - [Basic1 (create, set)](#basic1-create-set)
    - [State \& Action 분리 타이핑](#state--action-분리-타이핑)
    - [Counter](#counter)
    - [TodoList](#todolist)
    - [Fetch (create, AbortController, AxiosError, debouncedFetch)](#fetch-create-abortcontroller-axioserror-debouncedfetch)
    - [vanlia debounce, debounced state](#vanlia-debounce-debounced-state)
  - [ref](#ref)


## Example  

### Basic1 (create, set)  

```js
import { create } from 'zustand'

const useBearStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}))
---
function BearCounter() {
  const bears = useBearStore((state) => state.bears)
  return <h1>{bears} around here ...</h1>
}

function Controls() {
  const increasePopulation = useBearStore((state) => state.increasePopulation)
  return <button onClick={increasePopulation}>one up</button>
}

```


```js
// define store, setter
import { create } from 'zustand';

interface AuthModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useAuthModal = create<AuthModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useAuthModal;
---
  const authModal = useAuthModal();
  <Button onClick={authModal.onOpen} />

```

### State & Action 분리 타이핑  

```js
import { ReactNode } from "react";
import { create } from "zustand";

type ModalConfig = {
  title: string;
  description?: string;
  content?: ReactNode;
  footer: ReactNode;
};

type State = {
  open: boolean;
  config?: ModalConfig;
};

type Action = {
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
};

const useModalStore = create<State & Action>((set) => ({
  open: false,
  config: undefined,
  openModal: (config) => set({ open: true, config }),
  closeModal: () => set({ open: false, config: undefined }),
}));

export { useModalStore };
```

### Counter 

```js
import { create } from "zustand";
import { debounce } from "lodash-es";

interface CounterStoreProps {
  count: number;
  increaseCount: () => void;
  decreaseCount: () => void;
}

export const counterStore = create<CounterStoreProps>((set) => ({
  count: 0,
  increaseCount: () => set((state) => ({ count: state.count + 1 })),
  decreaseCount: () => set((state) => ({ count: state.count - 1 })),
}));
```

### TodoList  

- 객체 안의 객체(todoListArray)의 불변성을 지켜야한다. (for 리랜더링)  

```js
// todoList
interface TodoListProps {
  todoList: string[];
  addTodo: (content: string) => void;
  updateTodo: (id: number, updatedContent: string) => void;
  deleteTodo: (id: number) => void;
}

export const todoListStore = create<TodoListProps>((set) => ({
  todoList: [],
  addTodo: (content: string) =>
    set(({ todoList }) => {
      return { todoList: [...todoList, content] };
    }),
  updateTodo: (id: number, updatedContent: string) =>
    set(({ todoList }) => {
      todoList[id] = updatedContent;
      return { todoList: [...todoList] };
    }),
  deleteTodo: (id: number) =>
    set(({ todoList }) => {
      todoList.splice(id, 1);
      return { todoList: [...todoList] };
    }),
}));
```

### Fetch (create, AbortController, AxiosError, debouncedFetch)  

기존의 요청을 취소하고 새로운 요청을 보내는 로직.  
- abort를 호출했다면 AbortController를 다시 생성해야한다.  
- 그렇지 않으면, 기존요청 및 새로운 요청에 대해서 모두 취소 된다.  

```js
import { create } from "zustand";
import { debounce } from "lodash-es";
import axios, { AxiosError } from "axios";

// https://api.thecatapi.com/v1/images/search?limit=1
interface RandomCatState {
  id: string;
  url: string;
  width: number;
  height: number;
  loading: boolean;
  error: null | AxiosError;
  fetchData: (id?: string) => void;
  debouncedFetch: () => void;
}

export const useRandomCatStore = create<RandomCatState>((set, get) => {
  let controller = new AbortController();

  return {
    id: "0",
    url: "",
    width: 0,
    height: 0,
    loading: false,
    error: null,
    fetchData: async (id?: string) => {
      if (get().loading) controller.abort();

      controller = new AbortController();
      set({ loading: true });
      try {
        const result = await axios.get(
          "https://api.thecatapi.com/v1/images/search?limit=1",
          {
            signal: controller.signal,
          }
        );
        set({ ...result.data?.[0], loading: false });
      } catch (error) {
        assertAxiosError(error);
        if (error?.code === "ERR_CANCELED") {
          return;
        }
        set({ loading: false, error });
      }
    },
    debouncedFetch: debounce(() => get().fetchData(), 200), // debouncing
  };
});

```


### vanlia debounce, debounced state  

```js
export function debounce<T>(func: (args: T) => void, delay: number) {
  let timer: number;

  return (args: T) => {
    if (timer) clearTimeout(timer);

    timer = window.setTimeout(() => {
      func(args);
    }, delay);
  };
}
---
import { debounce } from "@/utils/debounce";
import { create } from "zustand";

interface SearchAreaStore {
  keywordInput: string;
  setKeywordInput: (keywordInput: string) => void;
  debouncedKeyword: string;
  setDebouncedKeyword: (keywordInput: string) => void;
  reset: () => void;
}

const defaultState: Pick<SearchAreaStore, "keywordInput" | "debouncedKeyword"> =
  {
    keywordInput: "",
    debouncedKeyword: "",
  };

export const useStoreSearchArea = create<SearchAreaStore>((set, get) => ({
  keywordInput: "",
  setKeywordInput: (keywordInput: string) => {
    set({ keywordInput });
    get().setDebouncedKeyword(keywordInput);
  },
  debouncedKeyword: "",
  setDebouncedKeyword: debounce((keywordInput: string) => {
    set({ debouncedKeyword: keywordInput });
  }, 500),
  reset: () => {
    set({ ...defaultState });
  },
}));

```


## ref  

- github : https://github.com/pmndrs/zustand  
- React 상태 관리 라이브러리 Zustand의 코드를 파헤쳐보자 : https://ui.toast.com/weekly-pick/ko_20210812  
- zustand deep dive : https://www.nextree.io/zustand/  



