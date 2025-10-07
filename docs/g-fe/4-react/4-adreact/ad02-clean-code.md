---
sidebar_position: 2
---

# React Clean Code  


## Optimized Context API

Before
- 문제점 : React Context API를 사용하면 불필요한 리렌더링이 많이 발생한다.  
- 본인이 구독하는 컨텍스트 필드가 아니더라도 다른 필드가 변경되면 리렌더링 발생함.  

```jsx
// After
type State = {
  count: number;
};

type Action = {
  type: "INCREMENT" | "DECREMENT";
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    default:
      throw new Error("Provide a valid action.");
  }
}

type StateContext = { count: number };
type DispatchContext = Dispatch<Action>;

export const StateContext = createContext<StateContext | null>(null);
export const DispatchContext = createContext<DispatchContext | null>(null);

type CartProviderProps = {
  children: ReactNode;
};
// ✅ Dispatch Context, State Context 두개를 나눠서 사용하면 불필요한 리렌더링을 방지
export const CartProvider = ({ children }: CartProviderProps) => {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export function useStateContext() {
  const value = useContext(StateContext);

  if (value === null) {
    throw new Error("Must be wrapped inside Context.Provider");
  }

  return value;
}

export function useDispatchContext() {
  const value = useContext(DispatchContext);

  if (value === null) {
    throw new Error("Must be wrapped inside Context.Provider");
  }

  return value;
}

```

확인하기 : 불필요한 리렌더링 제거되었는지 체크.  


## Chain of useEffect Anti-Pattern   

문제점 
- useEffect 가 또 다른 useEffect를 부르는 체이닝 패턴은 불필요한 렌더링 횟수 증가와, 무한 렌더링 가능성 높임.   

우선 useEffect 언제 사용하는지 명확히 해야 함.  
- 리액트에서는 렌더링 코드, 이벤트 핸들러가 주를 이룬다.  
- 외부시스템과 연동 (Web API, AJAX, Storage 연결 등)이 필요한 경우가 있다.  
- 이벤트 핸들러로 외부 시스템 연동이 가능하지만, 초기화 등의 상황에서는 이벤트 없이 연동해야 한다.  
- 이때 useEffect를 사용한다.
- *정리 : 주요 렌더링 코드와 상관없이, 이벤트 없이 외부 시스템 연동 하는 경우에 useEffect를 사용한다.*      


useEffect를 줄이는 패턴 (다른말로 안티패턴임)  
- 장바구니 추가되었어요.! 토스트 : useState의 state를 감지해서 toast를 보여주는 경우 -> 이벤트 핸들러로 처리 가능    
- 모달창 열리면 로그 API 호출 : useState의 isOpen state를 감지해서 AJAX 쏘는 경우 -> 이벤트 핸들러로 처리 가능   
- computed field를 useEffect에서 계산하는 경우 -> useMemo 혹은 그냥 필드로 처리 가능     '

```jsx
const [products, setProducts] = useState([]);
const [productCount, setProductCount] = useState(0);
// ❌ Anti-Pattern
useEffect(() => {
  setProductCount(products.length);
}, [products]);

return (
  <div>
    <h1>Product Count: {productCount}</h1>
  </div>
)
```

