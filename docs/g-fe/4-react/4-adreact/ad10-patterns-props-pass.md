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
- `<Element />` 형태로 호출 (반환값은 Element)     

2.Element : 리액트 요소의 형태, 컴포넌트 함수를 호출 한 결과    
- `const sub = <div>o</div>` 형태
- React.createElement, React.cloneElement의 결과값  

📌 3가지 유형으로 전달 가능 

1.ComponentType 전달  
2.Element 전달  
3.Render Props 전달    

```
type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;

-> 클래스 컴포넌트, 함수형 컴포넌트 참조 자체를 래퍼런스로 넘겨주는 목적   
장점 : 추가적인 컴포넌트의 조작 없이, 참조를 그대로 넘긴다.     
```

```
type FunctionComponent<P = {}> = (props: P) => ReactElement | null;

-> 인라인 방식으로 컴포넌트를 정의하여 넘겨줄 수 있다.  
장점 : 컴포넌트 합성이 가능  
- 루트 컴포넌트는 props를 전달해주고. 받은 props로 컴포넌트 정의 가능.  
- 루트 컴포넌트는 전달받은 depth1 컴포넌트로 자유롭게 위치 배정, 컴포넌트 복제가 가능.    
```

```
type Slot = React.ReactNode | null

-> (인라인) 엘리먼트를 넘겨주는 목적  
장점 : props로 엘리먼트를 전달받아, 적절한 위치에 배치 가능.  
```

📌 React 컴포넌트 합성에 자주 사용되는 함수들  

```js
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

```jsx
import React from 'react';

function Wrapper({ children }) {
  // 1. React.Children.map: 각 자식에 props 추가 (key 유지)
  const mappedChildren = React.Children.map(children, (child, index) => {
    // 유효한 React 엘리먼트일 경우에만 props를 복제하고 추가
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { 
        index: index, 
        style: { color: index % 2 === 0 ? 'blue' : 'red' } 
      });
    }
    return child;
  });

  // 2. React.Children.count: 자식의 개수 세기
  const childCount = React.Children.count(children);

  // 3. React.Children.toArray: 자식들을 배열로 변환 후 순서 뒤집기
  const reversedChildren = React.Children.toArray(children).reverse();
  
  // 4. React.Children.forEach: 각 자식에 대한 로그 출력 (부수 효과)
  console.log('--- React.Children.forEach 출력 ---');
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      console.log(`Child type: ${child.type}`);
    } else {
      console.log(`Child content: ${child}`);
    }
  });
  console.log('---------------------------------');

  // 5. React.Children.only: (예외 발생 가능성이 있어 주석 처리)
  // const onlyOne = React.Children.only(children); // 자식이 하나가 아니면 에러 발생

  return (
    <div style={{ border: '1px solid gray', padding: '10px' }}>
      <h3>총 자식 수: {childCount}</h3>
      
      <h4>1. map 결과 (스타일 적용):</h4>
      <div>{mappedChildren}</div>
      
      <h4>2. toArray 결과 (순서 뒤집기):</h4>
      <div>{reversedChildren}</div>
    </div>
  );
}

// 사용 예시
function App() {
  return (
    <Wrapper>
      <div>첫 번째 아이템</div>
      <span>두 번째 아이템</span>
      {'텍스트 노드'}
      {null} {/* null/undefined는 무시되지만, map/forEach는 'null'로 순회할 수 있음 */}
    </Wrapper>
  );
}

```


```jsx
import React from 'react';

// 1. React.createElement: JSX 없이 엘리먼트 생성
// <h1 className="main-title">Hello, React!</h1> 와 동일
const headerElement = React.createElement(
  'h1', 
  { className: 'main-title' }, 
  'Hello, ',
  React.createElement('span', { style: { color: 'green' } }, 'React!')
);

function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}

// 사용 예시
function ComponentManipulator() {
  const customButton = <Button onClick={() => alert('Original Click')}>Original Text</Button>;
  
  // 2. React.cloneElement: props 병합
  const clonedButton = React.cloneElement(
    customButton,
    { 
      onClick: () => alert('Cloned Click!'), // onClick props 덮어쓰기
      style: { backgroundColor: 'yellow' } // 새로운 props 추가
    },
    'Cloned Text' // children 덮어쓰기
  );

  // 3. React.isValidElement: 엘리먼트 검증
  const isHeaderValid = React.isValidElement(headerElement); // true
  const isStringValid = React.isValidElement('Hello');      // false

  console.log(`Is headerElement a valid React Element? ${isHeaderValid}`);
  console.log(`Is 'Hello' a valid React Element? ${isStringValid}`);

  return (
    <div>
      {headerElement}
      <p>Original Button:</p>
      {customButton}
      <p>Cloned Button (props와 children이 변경됨):</p>
      {clonedButton}
    </div>
  );
}
```

## Render Props 패턴

📌 Render props to chilren
- children에게 props를 전달하여 컴포넌트를 합성시키는 방식  

```jsx
import type React from 'react';
import { useState } from 'react';

// Render Props children
interface RenderPropsChildProps {
  // children의 props를 타이핑  
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