---
sidebar_position: 20
---

# React Optimization

- [React Optimization](#react-optimization)
  - [Code Splitting](#code-splitting)
  - [Memoization](#memoization)
  - [Lifting Up Component](#lifting-up-component)


## Code Splitting

- Suspense, lazy
```jsx
import { Link, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import LazyLoader from "./components/lazy-loader";

const Home = lazy(() => import("./components/home"));
const About = lazy(() => import("./components/about"));
const Contact = lazy(() => import("./components/contact"));


function App() {
  return (
    <>
      <>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </>
      <Suspense fallback={<LazyLoader show delay={500} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;

```

lazy-loader.jsx  
- 바로 로딩을 보여주면 깜빡이는 문제가 발생한다. 이를 방지하기 위해서 다음처럼 지연 로딩을 구현한다.  

```jsx
import { useEffect, useState } from "react";

const LazyLoader = ({ show = false, delay = 0 }) => {
  const [showLoader, setShowLoader] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!show) {
      setShowLoader(false);
      return;
    }
    if (delay === 0) {
      setShowLoader(true);
    } else {
      timeoutRef.current = setTimeout(() => setShowLoader(true), delay);
    }
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [show, delay, timeoutRef]);

  return showLoader ? <h3>Loading...</h3> : null;
};

export default LazyLoader;

```


## Memoization

- memo를 통해서 부모가 리렌더링 되어도 props가 변경되지 않으면 리렌더링 되지 않는다.  
- 이떄 props 변경은 얇은 비교를 통해서 이루어진다.  
  - useCallback => 매번함수가 재생성 방지  
  - useMemo => 매번 객체가 재생성 방지  

```jsx

```

## Lifting Up Component  

📌 Before
- 문제 : Root 컴포넌트, Depth1, Depth2 컴포넌트가 있는 상황 
  - Depth1 리렌더링은 Depth2 리렌더링을 트리거링함.  
  - 만약 Root 컴포넌트까지 Depth2 컴포넌트를 끌어올린다면 리렌더링 줄일 수 있다.  

📌 After
- App 컴포넌트 리랜더링 > Ingredients 컴포넌트 리랜더링  

```jsx
function App() {
  return (
    <>
      {/* Before */}
      <Ingredients />
      {/* After */}
      <Ingredients
        ingredientsInfoHelper={<IngredientsInfoHelper />} // 렌더링된 컴포넌트를 Prop으로 전달
      />
    </>
  );
}

---

const Ingredients = (props) => {
    // ... Ingredients 관련 이벤트 핸들러 로직 
  return (
    <StyledContainer>
      <div>
        {/* Before */}
        <IngredientsInfoHelper />
        {/* After */}
        {props?.ingredientsInfoHelper}
      </div>
    </StyledContainer>
  );
};

```