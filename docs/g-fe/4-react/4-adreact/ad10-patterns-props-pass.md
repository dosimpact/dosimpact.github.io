---
sidebar_position: 10
---

# React Patterns 1 - Props Pass

- [React Patterns 1 - Props Pass](#react-patterns-1---props-pass)
  - [As props Pattern](#as-props-pattern)
  - [asChild Pattern](#aschild-pattern)
  - [Type of Pass](#type-of-pass)
  - [Render Props 패턴](#render-props-패턴)


## As props Pattern

```jsx
// 📌 Before
// 아래 버튼 컴포넌트를 a태그처럼 쓰고싶은데 확장이 어렵다.
<Button href="/" size="lg" >
Link
</Button>

// 📌 After
const Button = ({As = "button", size="lg", ...props})=>{
    // (size 와 같은 스타일 로직 있음)
    return (
        <As {...props} className={`${styles.button} ${styles[size]}`} />
    )
}
// 아래처럼 As Props를 통해서 Button의 스타일을 그대로 사용하면서 프리미티브 태그를 사용할 수 있다.
<Button As="a" size="lg" href="/">
Link
</Button>
```

## asChild Pattern

```jsx
const Button = ({ asChild, children, className, ...props }) => {
  if (asChild) {
    // 자식 요소를 클론하고 props를 병합
    return React.cloneElement(children, {
      ...props,
      className: `${styles.button} ${className || ''}`,
    });
  }

  // React.createElement(type, props, ...children)
  return React.createElement(
    'button',
    {
      className: `${styles.button} ${className || ''}`,
      ...props,
    },
    children,
  );
};
```


## Type of Pass 

📌 복습, Component vs Element    

1.Component : JSX를 리턴하는 함수형, 클래스형 컴포넌트  
- 호출이 가능하다.  
- `<Element />` 형태로 호출하며 그 결과 Element가 나온다.   

2.Element : 컴포넌트 함수를 깐 형태 혹은 요소의 형태  
- `const sub = <div>o</div>` 형태

📌 3가지 유형으로 전달 가능 

1.ComponentType 전달  
2.Element 전달  
3.Render Props 전달    

```
type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;

-> 래퍼런스를 넘겨주는 목적
장점 : 추가적인 컴포넌트의 조작 없이, 참조를 그대로 넘긴다.   
```

```
type FunctionComponent<P = {}> = (props: P) => ReactElement | null;

-> (인라인) 컴포넌트를 넘겨주는 목적  
장점 : 루트 컴포넌트는 props를 전달해주어 컴포넌트 합성이 가능. 루트는 자유롭게 전달받은 depth1 컴포넌트의 위치, 복제가 가능  
```

```
type Slot = React.ReactNode | null

-> (인라인) 엘리먼트를 넘겨주는 목적  
장점 : props로 엘리먼트를 전달받아, 적절한 위치에 배치 가능.  
```

📌 React 컴포넌트 합성에 사용하는 주요 함수들

```
- React.Children.map  
- React.Children.forEach  
- React.Children.count  
- React.Children.only  
- React.Children.toArray   

- React.createElement - JSX대신 직접 사용  
- React.cloneElement - props를 병합할때 사용  
- React.isValidElement - element 검증   

- React.Fragment  
- React.memo  
```

## Render Props 패턴

📌 Render props to chilren
- children에게 

```jsx
import type React from 'react';
import { useState } from 'react';

// Render Props children

interface RenderPropsChildProps {
  children: (props: {
    count: number;
    countUp: () => void;
    countDown: () => void;
    reset: () => void;
  }) => React.ReactElement;
}

function RenderPropsChild({ children }: RenderPropsChildProps) {
  const [count, setCount] = useState(0);

  const countUp = () => {
    setCount(count + 1);
  };

  const countDown = () => {
    setCount(count - 1);
  };
  const reset = () => {
    setCount(0);
  };

  return <div>{children({ count, countUp, countDown, reset })}</div>;
}

export default RenderPropsChild;
---

const LIST_ITEM_COUNT = 50;

function Widget() {
  return (
    <div>
      {/* 1. render props child */}
      <RenderPropsChild>
        {({ count, countUp, countDown, reset }) => {
          return (
            <div>
              <div>{count}</div>
              <button type="button" onClick={countUp}>
                +
              </button>
              <button type="button" onClick={countDown}>
                -
              </button>
              <button type="button" onClick={reset}>
                reset
              </button>
            </div>
          );
        }}
      </RenderPropsChild>
    </div>
  );
}

export default Widget;

```

📌 Render props to multiple props   
- chlidren props뿐 아니라 다른 요소로 렌더러 함수를 받아도 된다.  

```jsx
import { useState } from 'react';

import React from 'react';

function RenderPropsMultiple({
  children,
  titleRender,
  listItemRender,
  listItemCount,
}: {
  children: React.ReactElement;
  titleRender: (props: { onToogle: () => void }) => React.ReactElement;
  listItemRender: (props: {
    onToogle: () => void;
    index: number;
  }) => React.ReactElement;
  listItemCount: number;
}) {
  const [isHidden, setIsHidden] = useState(false);

  const onToogle = () => {
    setIsHidden((prev) => !prev);
  };

  return (
    <div>
      {/* 타이틀 렌더러 위치 지정, 토글 기능 제공 */}
      <h2>{titleRender({ onToogle })}</h2>
      {/* 스크롤 컨테이너 추가, 리스트 아이템 복사 횟수 조절 */}
      <div style={{ maxHeight: '200px', overflow: 'auto' }}>
        {!isHidden &&
          Array.from({ length: listItemCount }).map((_, index) => {
            if (!React.isValidElement(listItemRender({ onToogle, index }))) {
              return null;
            }
            return React.cloneElement(listItemRender({ onToogle, index }), {
              key: index,
            });
          })}
      </div>
      <hr />
      {children}
    </div>
  );
}

export default RenderPropsMultiple;
---
function Widget() {
  return (
    <div>

      {/* 2. render props multiple */}
      <RenderPropsMultiple
        listItemCount={LIST_ITEM_COUNT}
        titleRender={({ onToogle }) => (
          <h2>
            title{' '}
            <button type="button" onClick={onToogle}>
              toogle
            </button>{' '}
          </h2>
        )}
        listItemRender={({ onToogle, index }) => (
          <div>
            Item {index}
            {index === LIST_ITEM_COUNT - 1 && (
              <button type="button" onClick={onToogle}>
                x
              </button>
            )}
          </div>
        )}
      >
        <div>did it </div>
      </RenderPropsMultiple>
    </div>
  );
}
```