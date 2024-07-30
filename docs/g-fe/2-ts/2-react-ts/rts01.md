---
sidebar_position: 01
---
# React Typescript   

## ReactNode vs ReactElement

ReactNode는 ReactElement를 포함하는 더 큰 개념입니다.  
- 심지어는 null, undefined도 올 수 있습니다.  
- 이는 리액트 컴포넌트에서 null도 리턴할 수 있음을 의미합니다.  
- 반면 ReactElement는 <></> 혹은 <div/> 등의 JSX를 리턴하는 함수입니다. createElement 함수라고도 볼수있습니다.  

```js
    type ReactNode =
        | ReactElement
        | string
        | number
        | Iterable<ReactNode>
        | ReactPortal
        | boolean
        | null
        | undefined
        | DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES[
            keyof DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES
        ];
```


## ReactNode vs ()=> React.ReactNode

```js
import React from "react";

const MyComponent = () => <div>Hello, World!</div>;

// 예시 1: {Component} 사용
// ReactNode를 인자로 받는다. 슬롯패턴처럼 컴포넌트를 {}으로 넣어야 한다.
const AppWithComponentReference = ({
  Component,
}: {
  Component: React.ReactNode;
}) => (
  <div>
    <h1>Using Component Reference</h1>
    {Component} {/* 단순히 컴포넌트 타입을 삽입 */}
  </div>
);

// 예시 2: <Component /> 사용
// 리액트 컴포넌트를 인자로 받는다. JSX를 리턴해야 한다. ()=>React.ReactNode;
const AppWithComponentInstance = ({
  Component,
}: {
  Component: React.ComponentType; // React.ComponentType; // () => React.ReactNode;
}) => (
  <div>
    <h1>Using Component Instance</h1>
    <Component /> {/* 실제로 컴포넌트를 렌더링 */}
  </div>
);

// 실제 렌더링
export const Test01 = () => {
  return (
    <>
      <div>
        <AppWithComponentReference Component={<MyComponent />} />
        <AppWithComponentInstance Component={MyComponent} />
      </div>
    </>
  );
};

```