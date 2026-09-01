---
sidebar_position: 5
---

# Zustand Scoped Store

[Zustand Scoped Store - 초심자 해설]

이번 문서에서 주목할 포인트 몇 가지를 짚어 보겠습니다.

## 포인트 1. Scoped Store는 상태를 필요한 컴포넌트 범위에만 둔다

일반적인 Zustand Store는 모듈 스코프에서 한 번 생성되고, 그 Store를 사용하는 모든 컴포넌트가 같은 상태를 공유합니다.

```tsx
import { create } from 'zustand'

export const useCounterStore = create<{
  count: number
  increase: () => void
}>()((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
}))
```

이 방식은 로그인 사용자나 테마처럼 애플리케이션 전체에서 공유해야 하는 상태에 잘 맞습니다. 하지만 동일한 폼, 모달, 에디터, 위젯을 한 화면에 여러 개 렌더링한다면 문제가 달라집니다. 각 인스턴스가 독립적인 상태를 가져야 하는데 하나의 전역 Store를 사용하면 상태가 서로 섞일 수 있습니다.

Scoped Store는 이 문제를 해결하기 위해 Store의 공유 범위를 특정 React 컴포넌트 트리로 제한합니다. 별도의 `ScopedStore` API가 있는 것은 아니며 다음 세 가지를 조합하는 설계 패턴입니다.

- `createStore`: React와 독립적인 Vanilla Store를 생성합니다.
- React Context: Store를 특정 컴포넌트 트리에 전달합니다.
- `useStore`: Context에서 받은 Store의 필요한 상태를 구독합니다.

핵심은 “전역 Store에서 데이터를 어떻게 나눌까?”가 아니라 “Store 인스턴스를 어디에서 만들고 누구와 공유할까?”입니다.

## 포인트 2. Provider의 위치가 상태의 공유 범위와 생명주기를 결정한다

Scoped Store에서는 Provider 하나가 Store 인스턴스 하나를 소유합니다. 따라서 Provider를 어디에 배치하는지가 곧 상태 설계가 됩니다.

```text
App
├─ CounterStoreProvider A → Counter Store A → Counter A
└─ CounterStoreProvider B → Counter Store B → Counter B
```

위 구조에서 첫 번째 Counter의 값을 변경해도 두 번째 Counter에는 영향을 주지 않습니다. 두 Provider가 각각 다른 Store를 만들었기 때문입니다.

반대로 하나의 Provider 아래에 여러 Counter를 넣으면 모두 같은 상태를 공유합니다.

```tsx
<CounterStoreProvider>
  <Counter />
  <Counter />
</CounterStoreProvider>
```

Provider는 상태의 생명주기도 결정합니다. Provider가 언마운트되면 그 Provider가 소유하던 Store도 더 이상 사용되지 않습니다. Provider가 다시 마운트되면 새로운 Store가 만들어지고 초기 상태부터 시작합니다.

따라서 다음 기준으로 Provider 위치를 선택합니다.

- 화면이 사라질 때 상태도 함께 버리려면 해당 화면이나 모달 가까이에 둡니다.
- 화면 전환 후에도 상태를 유지하려면 전환 중 언마운트되지 않는 상위 레이아웃에 둡니다.
- 여러 컴포넌트가 상태를 공유해야 한다면 그 컴포넌트들의 가장 가까운 공통 부모에 둡니다.

## 포인트 3. Context에는 상태 값이 아니라 Store API를 전달한다

Scoped Store를 만들 때 Context에 `store.getState()` 결과를 넣어서는 안 됩니다. Context에는 `createStore`가 반환한 Store API를 전달하고, 실제 상태 구독은 `useStore(store, selector)`가 담당하게 해야 합니다.

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

전용 Hook이 Selector를 받게 만들면 컴포넌트는 자신에게 필요한 상태만 구독할 수 있습니다.

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
```

Context의 기본값을 `null`로 두고 전용 Hook에서 오류를 발생시키는 것도 중요합니다. Provider가 없는 곳에서 Hook을 사용했을 때 조용히 잘못된 값으로 동작하지 않고 문제를 즉시 발견할 수 있습니다.

## 포인트 4. Store는 Provider가 처음 렌더링될 때 한 번만 생성한다

다음 코드는 Provider가 렌더링될 때마다 새로운 Store를 만듭니다.

```tsx
// Bad
<CounterStoreContext.Provider value={createCounterStore()}>
  {children}
</CounterStoreContext.Provider>
```

부모 컴포넌트의 리렌더링 때문에 Provider도 다시 렌더링되면 기존 상태와 구독을 가진 Store 대신 새 Store가 Context에 전달될 수 있습니다. 사용자는 아무 작업도 하지 않았는데 상태가 초기화된 것처럼 보이게 됩니다.

Store 인스턴스의 정체성을 유지하려면 `useState`의 지연 초기화나 `useRef`를 사용합니다.

```tsx
// Good
const [store] = useState(() => createCounterStore())
```

`useState`에 전달한 함수는 Provider가 처음 마운트될 때 실행됩니다. 이후 Provider가 리렌더링되어도 같은 Store API 객체가 유지됩니다.

검증할 때는 다음 세 가지를 확인하면 됩니다.

1. Provider가 리렌더링되어도 기존 상태가 유지되는가?
2. 서로 다른 Provider의 상태가 독립적인가?
3. Provider 밖에서 전용 Hook을 호출하면 명확한 오류가 발생하는가?

## 포인트 5. Props는 Store의 초깃값으로만 주입된다

Scoped Store는 컴포넌트 Props나 서버 데이터로 Store의 시작 상태를 결정하기 좋습니다. 예를 들어 Counter 인스턴스마다 다른 숫자에서 시작하게 만들 수 있습니다.

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

```tsx
<CounterStoreProvider initialCount={10}>
  <Counter />
</CounterStoreProvider>

<CounterStoreProvider initialCount={100}>
  <Counter />
</CounterStoreProvider>
```

여기서 `initialCount`는 말 그대로 초깃값입니다. Provider가 마운트된 뒤 `initialCount` Props가 바뀌더라도 이미 만들어진 Store의 `count`가 자동으로 변경되지는 않습니다.

Props 변경을 계속 Store에 반영해야 한다면 두 동작을 명확하게 구분해야 합니다.

- 현재 Store를 유지하면서 값을 바꾸려면 별도의 동기화 Action을 호출합니다.
- Store 전체를 새로 시작하려면 Provider의 `key`를 변경하여 다시 마운트합니다.

초기화와 동기화를 구분하지 않으면 사용자가 Store에서 수정한 값을 Props 변경이 예기치 않게 덮어쓸 수 있습니다.

## 포인트 6. Scoped Store와 Slice는 서로 다른 문제를 해결한다

Scoped Store와 Slice Pattern은 함께 언급되기 쉽지만 목적이 다릅니다.

| 패턴 | 해결하는 문제 | 판단 질문 |
| --- | --- | --- |
| Scoped Store | Store 인스턴스와 상태 공유 범위 분리 | 상태를 누구와 언제까지 공유할 것인가? |
| Slice Pattern | 하나의 큰 Store 코드를 기능별로 분리 | Store 구현을 어떻게 나누어 관리할 것인가? |

Store 코드가 너무 커졌지만 모든 화면이 같은 상태를 공유해야 한다면 Slice Pattern을 고려합니다. 반대로 코드의 크기와 관계없이 위젯마다 독립 상태가 필요하다면 Scoped Store를 고려합니다.

두 패턴은 함께 사용할 수도 있습니다. 여러 Slice를 조합해 Store 생성 함수를 만든 다음, 그 함수를 각 Provider에서 호출하면 기능별로 분리된 Scoped Store가 됩니다.

마지막으로 다음 체크리스트를 이용하면 Scoped Store가 필요한지 빠르게 판단할 수 있습니다.

- 같은 UI를 여러 개 만들었을 때 각 인스턴스의 상태가 독립적이어야 하는가?
- 상태를 특정 화면, 모달 또는 위젯의 생명주기와 함께 폐기해야 하는가?
- 각 인스턴스가 Props를 통해 서로 다른 초깃값을 받아야 하는가?
- 전역 Store를 사용했을 때 초기화와 정리 시점을 설명하기 어려운가?

대부분이 “예”라면 Scoped Store가 적합합니다. 애플리케이션 전체에서 하나의 상태를 공유해야 한다면 전역 Store가 더 단순할 수 있습니다.

## 포인트 7. 전체 예제로 Provider별 상태 공유와 분리를 확인한다

지금까지 설명한 내용을 하나의 실행 가능한 예제로 연결해 보겠습니다. 이 예제는 첫 번째 Provider 안의 두 Counter가 같은 상태를 공유하고, 두 번째 Provider의 Counter는 독립적인 상태를 가지는 것을 보여줍니다.

파일은 Store와 Provider를 정의하는 모듈, Store를 사용하는 컴포넌트, Provider 경계를 배치하는 App으로 나눕니다.

```text
src/
├─ stores/
│  └─ counter-store.tsx
├─ components/
│  └─ CounterPanel.tsx
└─ App.tsx
```

먼저 `counter-store.tsx`에 Store 생성 함수와 Context, Provider, 전용 Hook을 함께 정의합니다.

```tsx title="src/stores/counter-store.tsx"
import {
  createContext,
  useContext,
  useRef,
  type ReactNode,
} from 'react'
import { createStore, useStore } from 'zustand'

type CounterState = {
  count: number
}

type CounterActions = {
  increase: () => void
  decrease: () => void
  reset: () => void
}

type CounterStore = CounterState & CounterActions

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
    reset: () => set({ count: initialCount }),
  }))

type CounterStoreApi = ReturnType<typeof createCounterStore>

const CounterStoreContext = createContext<CounterStoreApi | null>(null)

type CounterStoreProviderProps = CounterStoreProps & {
  children: ReactNode
}

export function CounterStoreProvider({
  initialCount,
  children,
}: CounterStoreProviderProps) {
  const storeRef = useRef<CounterStoreApi | null>(null)

  if (storeRef.current === null) {
    storeRef.current = createCounterStore({ initialCount })
  }

  const store = storeRef.current

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

`createCounterStore()`는 호출할 때마다 새로운 Store API를 반환합니다. Provider에서는 `useRef`를 `null`로 초기화하고, `storeRef.current`가 비어 있을 때만 Store를 생성합니다. 따라서 Provider가 리렌더링되어도 같은 Store API 객체가 유지됩니다.

`useRef(createCounterStore({ initialCount }))`처럼 작성하면 사용되지 않을 Store 생성 함수가 렌더링마다 호출될 수 있으므로 사용하지 않습니다. 또한 `reset` Action은 Store가 최초 생성될 때 전달된 `initialCount`를 기억합니다.

다음으로 `CounterPanel`은 Context나 Store 생성 방법을 알지 않고 전용 Hook만 사용합니다.

```tsx title="src/components/CounterPanel.tsx"
import { useCounterStore } from '../stores/counter-store'

type CounterPanelProps = {
  label: string
}

export function CounterPanel({ label }: CounterPanelProps) {
  const count = useCounterStore((state) => state.count)
  const increase = useCounterStore((state) => state.increase)
  const decrease = useCounterStore((state) => state.decrease)
  const reset = useCounterStore((state) => state.reset)

  return (
    <section>
      <h2>{label}</h2>
      <p>현재 값: {count}</p>

      <button type="button" onClick={decrease}>
        -1
      </button>
      <button type="button" onClick={increase}>
        +1
      </button>
      <button type="button" onClick={reset}>
        초기화
      </button>
    </section>
  )
}
```

마지막으로 `App`에서 Provider 경계를 의도적으로 다르게 구성합니다.

```tsx title="src/App.tsx"
import { CounterPanel } from './components/CounterPanel'
import { CounterStoreProvider } from './stores/counter-store'

export default function App() {
  return (
    <main>
      <h1>Zustand Scoped Store</h1>

      <CounterStoreProvider initialCount={10}>
        <CounterPanel label="A-1 Counter" />
        <CounterPanel label="A-2 Counter" />
      </CounterStoreProvider>

      <CounterStoreProvider initialCount={100}>
        <CounterPanel label="B Counter" />
      </CounterStoreProvider>
    </main>
  )
}
```

브라우저에서 다음 순서로 동작을 확인합니다.

1. `A-1 Counter`에서 `+1`을 누르면 `A-2 Counter`도 함께 증가합니다. 두 컴포넌트가 같은 Provider의 Store를 구독하기 때문입니다.
2. `B Counter`에서 `+1`을 눌러도 A 영역의 값은 바뀌지 않습니다. B 영역은 별도의 Provider와 Store를 사용합니다.
3. A 영역에서 `초기화`를 누르면 두 A Counter가 `10`으로 돌아갑니다.
4. B 영역에서 `초기화`를 누르면 B Counter만 `100`으로 돌아갑니다.

이 예제에서 컴포넌트가 상태를 공유하는지는 컴포넌트 종류가 아니라 Provider 경계로 결정됩니다. 따라서 실제 폼이나 에디터에 적용할 때도 먼저 “어떤 인스턴스끼리 상태를 공유해야 하는가?”를 정한 다음 Provider를 배치하면 됩니다.

## 참고 자료

- [Zustand useStore: Using scoped vanilla store in React](https://zustand.docs.pmnd.rs/reference/hooks/use-store)
- [Zustand: Initialize state with props](https://zustand.docs.pmnd.rs/learn/guides/initialize-state-with-props)
- [Zustand createStore API](https://zustand.docs.pmnd.rs/reference/apis/create-store)
