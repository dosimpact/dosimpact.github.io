---
sidebar_position: 1
---

# 1.Zustand Basic
- [1.Zustand Basic](#1zustand-basic)
  - [knowledge](#knowledge)
    - [핵심 원리](#핵심-원리)
  - [Basic](#basic)
    - [기본 카운터 예제](#기본-카운터-예제)
    - [To Do List](#to-do-list)
  - [devtools](#devtools)
  - [Ref](#ref)


## knowledge  

About Zustand  
- Zustand는 React 클라이언트 전역 상태 관리 라이브러리   
- 간단하면서도 강력한 API를 제공하여 전역 상태를 효율적으로 관리   
- Redux나 Context API보다 더 가볍고 직관적  


### 핵심 원리

📌 1.useSyncExternalStore  
- useSyncExternalStore는 외부 store를 구독할 수 있는 React Hook입니다. ( React 18+) 
- 상태는 React의 useState나 useReducer가 아닌, 외부 JavaScript 객체로 저장되고, 컴포넌트는 useStore 훅을 통해 해당 상태를 구독.  


📌 2.Tearing  

동기적(Sync) 렌더링
- 리액트의 렌더링 싸이클 로직이 수행될때, 블럭킹 방식으로 진행. 메인스레드를 점유하여 다른 작업 일시적으로 진행 불가.  

동시적(Concurrent) 렌더링
- React가 여러 업데이트를 동시에 처리갸능
- 우선순위가 높은 업데이트를 먼저 처리 가능
- 일부 컴포넌트가 아직 업데이트되지 않은 이전 상태를 참조하게 되면 Tearing이 발생 가능  

React 18의 useSyncExternalStore 
- 티어링 현상 해결을 위함.  
- 외부 상태(external store)를 React의 렌더링 사이클과 정확하게 동기화.  
- zustand는 React 16/17에서는 폴리필을 사용하지만, 완벽한 tearing 방지는 어렵습니다.  
- 따라서 리렌더링 자주 발생 + 동시성(Suspense, concurrent rendering) 주의. 
  - *동시성 관련 API : suspense, useTransition, useDefferredValue 등 이용하여 렌더링를 논블락킹 처리.


📌 Plus
- 전역 상태 관리로 Zustand 좋다. useState 수준의 문법. Redux의 복잡한 보일러 플레이트 코드 없음.   
- 객체에서 1 Depth 까지 객체의 불변성 지원을 해준다.   
- Zod, Remeda 같이 사용하기 좋다.  
- 상태 관리에 대한 응집도가 매우 좋음 ( 마치 완성된 클래스를 잘 정의한 느낌 ) 
- 필요한 컴포넌트만 리렌더링되도록 설계 → useContext의 리렌더링 이슈 해결.     
  - 1.스토어 단위 구독
  - 2.스토어 내 필드 단위 구독 ( useShallow ) 
- 스토리지 사용 (Persist) 미들웨어 제공 → 온보딩 툴팁 관련 코드 모아두어도 좋을듯 하다.  
- immer와 같은 미들웨어도 제공해준다.  
- Redux Devtools 지원


📌 Minus
- 전역 상태가 유지 되니 컴포넌트 라이프싸이클 관리를 잘 해야 한다. 
- ( 컴포넌트 재생성 싸이클 & 컴포넌트 리렌더링 싸이클과 Store 상태 싸이클과 결합을 잘 해야 함. )  
  - eg) Tab으로 Page를 관리하는 상황. 
  - useEffect에서 전역 상태 클린업 코드를 넣어둠 
  - → 새로운 페이지로 네비게이션 후 돌아옴 (Page Router)
  - → 컴포넌트 재생성으로 useEffect 가 작동되면서 클린업 기대
  - → 실상은 리렌더링으로 클린업 안됨. 

## Basic

### 기본 카운터 예제

```js
// 기본 카운터 예제  

import { create } from 'zustand'

interface CounterStore { 
  count: number
  increase: () => void
  decrease: () => void
}

export const useCountStore = create<CounterStore>(set => ({
  count: 1,
  increase: () => set(state => ({ count: state.count + 1 })),
  decrease: () => set(state => ({ count: state.count - 1 }))
}))

---
import { useCountStore } from './store/count'

export default function App() {
  // 스토어 단위 구독 
  const store = useCountStore(state => state)

  // 스토어의 필드 단위 구독  
  const increase = useCountStore(state => state.increase)
  const decrease = useCountStore(state => state.decrease)

  return (
    <>
      <h2>{store.count}</h2>
      <button onClick={increase}>+1</button>
      <button onClick={decrease}>-1</button>
    </>
  )
}
```


### To Do List  

- 객체 안의 객체(todoListArray)의 불변성을 지켜야한다. (for 리렌더링)  

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


## devtools  

- devtools 미들웨어로 redux devtools 사용가능.  

```js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useTodoStore = create<TodoStoreState & TodoStoreAction>()(
  devtools((set, get) => ({
    // --- state ---
    todos: {}, ... 
  }))
);
```

## Ref  

- github : https://github.com/pmndrs/zustand  
- React 상태 관리 라이브러리 Zustand의 코드를 파헤쳐보자 : https://ui.toast.com/weekly-pick/ko_20210812  
- zustand deep dive : https://www.nextree.io/zustand/  
- useSyncExternalStore : https://react.dev/reference/react/useSyncExternalStore
- https://www.heropy.dev/p/n74Tgc
- https://ingg.dev/zustand-work/ 

