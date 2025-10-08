---
sidebar_position: 2
---

# React Clean Code 1

- [React Clean Code 1](#react-clean-code-1)
  - [Principal](#principal)
  - [Optimization](#optimization)
  - [Optimized Context API](#optimized-context-api)
  - [Anti-Pattern](#anti-pattern)
  - [Chain of useEffect](#chain-of-useeffect)


## Principal  

리액트 코드의 응집도, 결합도, 단일 책임 원칙  
- 응집도 : 유사한 기능을 하는 컴포넌트들은 뭉치면 좋다.  
- 결합도 : 서로 다른 역할을 가진 컴포넌트들의 응집도는 최소화 하며, 결합도를 높인다. (합성 패턴 등 사용 )  


🧠 Composition vs Compound

리액트가 추구하는 방향은 합성 패턴이다. = 컴포넌트의 확장은 상속이 아닌 합성(Composition) 사용 해라.  
- Controlled vs Uncontrolled component 
  - Controlled component : 부모 컴포넌트가 자식의 상태, 이벤트를 관리할 수 있다.  
  - Uncontrolled component : 부모 컴포넌트는 자식의 상태 관리 불가, 별도의 API를 통해 접근해야 한다.  

- Composition vs Compund  
  - Composition 컴포넌트 합성 : 기존의 컴포넌트는 유지하면서, 앞, 뒤, 혹은 감싸는 방식으로 컴포넌트를 확장하는 방식.   
    - 물리에서 합성물의 형태를 생각. -> 물리적 재결합  
    - 예) HoC, Render Props 패턴 등  
  - Compund 컴포넌트의 혼합 : 컴포넌트의 특성이 바뀌는 조작으로 컴포넌트들을 연결한다.  
    - 물리에서 결합물을 생각. -> 화학적 재결합  
    - 예) Context에 영향을 받는 컴포넌트들, Radix의 Namespace Patterned Component  

- 좋은 컴포넌트 설계
  - 컴포넌트의 props만으로도 어떤 데이터가 필요하고 어떤 데이터를 변경하는지 예측 가능 해야함.  
  - Composition 패턴을 사용 *(재사용성 높이기)* 하면서 Controlled Component로 *(에측 가능한)* 코드를 작성한다.   

- 특정한 목적을 가진 컴포넌트들들은 합성 대신 Compund를 사용해도 좋다.  
  - 대신 해당 컴포넌트를 사용하는 컨테이너 컴포넌트는 Composition 합성을 사용한다.  


🧠 역할 구분하기 - 도메인 로직이 있는것과 아닌 것  

도메인 로직이 없는 경우 : 재사용 가능한 컴포넌트로 뺄 수 있다.  
- 즉, 컴포넌트는 Composition 지원을 위해 Controlled component(or hybrid component)형태로 가야함.  
도메인 로직이 있는 경우 
  1.비즈니스 로직이 간단한 경우라면 컴포넌트의 Composition으로 끝내야 한다.    
  2.하지만 props drilling, props hell 등 굉장히 복잡해지는 경우가 있다.  
    - 한 화면에서 복잡한 데이터를 다루는 데스크탑 앱 코드 등..  
    - props drilling, props hell 을 해결하기 위해 컴포넌트간의 강결합(Compund)로 처리한다.
    - 주의, props 처리가 간단해지는 만큼 추후 재사용성은 기대하면 안된다.  
    - 팁, Context를 사용하면 좋지만 리렌더링 최소화를 위해 context-selector를 사용하면 좋다.  
    - 컨벤션, 강결합의 의미로 Namespace pattern을 의도적으로 사용하는것은 좋다.  

⚠️ Props Drilling을 줄이기 위한 방법  
- 1.Component Lifing-Up

Props Hell을 줄이기 위한 방법  
- 1.computed field, dto object 로 묶어서 관리하기  

## Optimization  

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

## Anti-Pattern 

안티패턴들 모음  

## Chain of useEffect   

문제점 
- useEffect 가 또 다른 useEffect를 부르는 체이닝 패턴은 불필요한 렌더링 횟수 증가와, 무한 렌더링 가능성 높임.   

우선 useEffect 언제 사용하는지 명확히 해야 함.  
- 리액트에서는 렌더링 코드, 이벤트 핸들러가 주를 이룬다.  
- 외부시스템과 연동 (Web API, AJAX, Storage 연결 등)이 필요한 경우가 있다.  
- 이벤트 핸들러로 외부 시스템 연동이 가능하지만, 초기화 등의 상황에서는 이벤트 없이 연동이 필요한 경우 있음.  
  - ->이때 useEffect를 사용한다.
- *즉 : 주요 렌더링 코드와 상관없이, 이벤트 없이 외부 시스템 연동 하는 경우에 useEffect를 사용한다.*   
  - 그 외 코드에서는 useEffect를 줄일 수 있는지 강력히 검토하자.  


useEffect를 줄이는 패턴 (다른 말로 안티패턴임)  
- 장바구니 추가되었어요.! 토스트 : useState의 state를 감지해서 toast를 보여주는 경우 
  - -> 이벤트 핸들러로 처리 가능    
- 모달창 열리면 로그 API 호출 : useState의 isOpen state를 감지해서 AJAX 쏘는 경우 
  - -> 이벤트 핸들러로 처리 가능   
- computed field를 useEffect에서 계산하는 경우 
  - -> useMemo 혹은 그냥 필드로 처리 가능     

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

