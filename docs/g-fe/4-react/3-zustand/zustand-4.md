---
sidebar_position: 4
---

# Zustand Scoped Store

## 1. 상태 범위 설계

### 1.1 Scoped Store 선택 기준

목적 : 전역 상태가 불필요하게 오래 유지되거나 여러 컴포넌트 인스턴스 사이에서 섞이는 문제를 막는다.

상세 로직

1. 판단 기준 및 적용 조건
  - 같은 폼, 에디터, 모달, 위젯을 여러 개 렌더링하면서 각 인스턴스의 상태를 분리해야 할 때 사용한다.
  - 상태가 특정 컴포넌트 트리에서만 필요하고 Provider의 마운트·언마운트와 함께 생성·폐기되어야 할 때 적합하다.
  - 로그인 사용자, 테마처럼 애플리케이션 전체가 공유해야 하는 상태는 Global Store가 더 단순하다.

2. 실행 절차 및 구현 규칙
  - `createStore`로 Vanilla Store 생성 함수를 만들고 React Context로 Store API를 전달한다.
  - 하위 컴포넌트는 `useStore(store, selector)`로 가장 가까운 Provider의 Store를 구독한다.
  - Provider 인스턴스마다 Store가 하나씩 생성되므로 같은 컴포넌트라도 Provider가 다르면 상태를 공유하지 않는다.

| 구분 | Global Store | Scoped Store |
| --- | --- | --- |
| 생성 위치 | 모듈 스코프 | Provider 내부 |
| 공유 범위 | Store를 import한 전체 영역 | Provider 하위 컴포넌트 |
| 생명주기 | 애플리케이션 실행 기간 | Provider 생명주기 |
| Store 개수 | 일반적으로 하나 | Provider 인스턴스마다 하나 |

### 1.2 Provider 경계와 생명주기

목적 : 상태를 공유할 컴포넌트 범위와 상태가 초기화되는 시점을 Provider 위치로 명확하게 결정한다.

상세 로직

1. 판단 기준 및 적용 조건
  - 여러 컴포넌트가 같은 상태를 사용해야 한다면 공통 부모에 Provider 하나를 둔다.
  - 각 컴포넌트가 독립 상태를 가져야 한다면 컴포넌트 인스턴스마다 Provider를 둔다.
  - Provider가 언마운트된 뒤 다시 마운트되면 새로운 Store가 생성되고 상태가 초기화된다.

2. 실행 절차 및 구현 규칙
  - 상태를 유지해야 하는 화면 전환에서는 Provider를 전환으로 언마운트되지 않는 상위 레이아웃에 배치한다.
  - 상태를 화면과 함께 폐기해야 하는 모달이나 편집기에서는 해당 기능 경계 바로 위에 Provider를 배치한다.

```text
App
├─ CounterStoreProvider A → Counter Store A → Counter A
└─ CounterStoreProvider B → Counter Store B → Counter B
```

### 1.3 Scoped Store와 Slice 구분

목적 : Store의 공유 범위를 나누는 문제와 하나의 Store 코드를 기능별로 나누는 문제를 혼동하지 않는다.

상세 로직

1. 판단 기준 및 적용 조건
  - Scoped Store는 Store 인스턴스, 공유 범위, 생명주기를 분리하는 패턴이다.
  - Slice Pattern은 하나의 큰 Store를 여러 State Creator로 나누어 코드의 응집도를 관리하는 패턴이다.

2. 실행 절차 및 구현 규칙
  - 독립 상태가 필요하면 Provider마다 Store를 생성하고, 코드 분할만 필요하면 Slice를 사용한다.
  - Slice로 조합한 Store도 Provider 안에서 생성하면 Scoped Store로 운용할 수 있다.

## 2. 구현 패턴

### 2.1 Context 기반 Scoped Store 구성

목적 : Zustand의 Selector 구독을 유지하면서 Provider마다 독립적인 Counter Store를 제공한다.

상세 로직

1. 판단 기준 및 적용 조건
  - Context에는 `store.getState()` 결과가 아니라 `createStore`가 반환한 Store API를 저장한다.
  - 컴포넌트가 필요한 필드만 구독할 수 있도록 전용 Hook은 Selector를 인자로 받는다.
  - Context 기본값은 `null`로 두어 Provider 바깥의 잘못된 사용을 즉시 검출한다.

2. 실행 절차 및 구현 규칙
  - Store 생성 함수, Context, Provider, 전용 Hook을 하나의 모듈에 응집한다.
  - `useState(() => createCounterStore())`로 Provider 인스턴스당 Store를 한 번만 생성한다.
  - Consumer에서는 `useCounterStore((state) => state.count)`처럼 필요한 상태나 Action을 선택한다.

```tsx
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import { createStore, useStore } from 'zustand'

type CounterStore = {
  count: number
  increase: () => void
  decrease: () => void
}

const createCounterStore = () =>
  createStore<CounterStore>()((set) => ({
    count: 0,
    increase: () => set((state) => ({ count: state.count + 1 })),
    decrease: () => set((state) => ({ count: state.count - 1 })),
  }))

type CounterStoreApi = ReturnType<typeof createCounterStore>

const CounterStoreContext = createContext<CounterStoreApi | null>(null)

export function CounterStoreProvider({
  children,
}: {
  children: ReactNode
}) {
  const [store] = useState(() => createCounterStore())

  return (
    <CounterStoreContext.Provider value={store}>
      {children}
    </CounterStoreContext.Provider>
  )
}

export function useCounterStore<T>(
  selector: (state: CounterStore) => T,
): T {
  const store = useContext(CounterStoreContext)

  if (!store) {
    throw new Error(
      'useCounterStore must be used within CounterStoreProvider',
    )
  }

  return useStore(store, selector)
}
```

```tsx
function Counter() {
  const count = useCounterStore((state) => state.count)
  const increase = useCounterStore((state) => state.increase)
  const decrease = useCounterStore((state) => state.decrease)

  return (
    <section>
      <strong>{count}</strong>
      <button onClick={increase}>+1</button>
      <button onClick={decrease}>-1</button>
    </section>
  )
}

export default function App() {
  return (
    <>
      <CounterStoreProvider>
        <Counter />
      </CounterStoreProvider>

      <CounterStoreProvider>
        <Counter />
      </CounterStoreProvider>
    </>
  )
}
```

### 2.2 Props 기반 초깃값 주입

목적 : 재사용 컴포넌트가 외부 Props나 서버 데이터로 각 Store 인스턴스의 초기 상태를 결정하게 한다.

상세 로직

1. 판단 기준 및 적용 조건
  - 같은 Store 구조를 사용하지만 위젯마다 시작 값이 다를 때 Store 생성 함수의 인자로 초깃값을 전달한다.
  - 초기 Props는 Store가 처음 만들어질 때만 반영되며, Provider가 유지된 상태에서 Props가 바뀌어도 Store는 자동 초기화되지 않는다.

2. 실행 절차 및 구현 규칙
  - Provider의 지연 초기화 함수 안에서 `createCounterStore({ initialCount })`를 호출한다.
  - Props 변경을 상태에 계속 동기화해야 한다면 초기화와 구분되는 명시적 Action 또는 Provider `key` 변경 정책을 설계한다.

```tsx
type CounterStoreProps = {
  initialCount?: number
}

const createCounterStore = ({
  initialCount = 0,
}: CounterStoreProps = {}) =>
  createStore<CounterStore>()((set) => ({
    count: initialCount,
    increase: () => set((state) => ({ count: state.count + 1 })),
    decrease: () => set((state) => ({ count: state.count - 1 })),
  }))

type CounterStoreProviderProps = CounterStoreProps & {
  children: ReactNode
}

export function CounterStoreProvider({
  initialCount,
  children,
}: CounterStoreProviderProps) {
  const [store] = useState(() =>
    createCounterStore({ initialCount }),
  )

  return (
    <CounterStoreContext.Provider value={store}>
      {children}
    </CounterStoreContext.Provider>
  )
}
```

## 3. 검증과 유지보수

### 3.1 Store 정체성 검증

목적 : 렌더링 과정에서 Store가 재생성되어 상태와 구독이 예기치 않게 초기화되는 결함을 예방한다.

상세 로직

1. 판단 기준 및 적용 조건
  - Provider가 리렌더링되어도 같은 Store API 객체가 유지되어야 한다.
  - 서로 다른 Provider의 Store API 객체와 상태는 독립적이어야 한다.
  - Provider 밖에서 전용 Hook을 호출하면 의도한 오류가 발생해야 한다.

2. 실행 절차 및 구현 규칙
  - Provider의 JSX에서 `value={createCounterStore()}`처럼 Store를 직접 생성하지 않는다.
  - `useState`의 지연 초기화 또는 `useRef`로 Provider당 한 번만 Store를 생성한다.
  - 테스트에서는 한 Provider의 Action 실행이 다른 Provider의 렌더링 값에 영향을 주지 않는지 확인한다.

```tsx
// Bad: Provider가 렌더링될 때마다 새로운 Store가 만들어진다.
<CounterStoreContext.Provider value={createCounterStore()}>
  {children}
</CounterStoreContext.Provider>

// Good: Provider 인스턴스가 유지되는 동안 같은 Store를 사용한다.
const [store] = useState(() => createCounterStore())
```

### 3.2 공식 API 기준 유지

목적 : 폐기된 Context 전용 API 대신 현재 Zustand의 Vanilla Store와 React Hook 조합을 기준으로 구현을 유지한다.

상세 로직

1. 판단 기준 및 적용 조건
  - Store 생성은 `createStore`, React 구독은 `useStore`, 범위 주입은 React `createContext`를 사용한다.
  - 오래된 예제의 `zustand/context` API는 현재 구현의 기준으로 사용하지 않는다.

2. 실행 절차 및 구현 규칙
  - Zustand 버전을 변경할 때 `createStore`와 `useStore`의 타입 시그니처를 공식 문서에서 다시 확인한다.
  - 문서를 수정한 뒤 `yarn build`로 MDX 문법, 내부 링크, Docusaurus 페이지 생성을 검증한다.

- [Zustand useStore: Using scoped vanilla store in React](https://zustand.docs.pmnd.rs/reference/hooks/use-store)
- [Zustand: Initialize state with props](https://zustand.docs.pmnd.rs/learn/guides/initialize-state-with-props)
- [Zustand createStore API](https://zustand.docs.pmnd.rs/reference/apis/create-store)
