---
sidebar_position: 1
---

# Basic Snippets

## ComponentReference vs ComponentInstance  

```js
import React from "react";
import { render } from "react-dom";

const MyComponent = () => <div>Hello, World!</div>;

// 예시 1: {Component} 사용
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
const AppWithComponentInstance = ({
  Component,
}: {
  Component: () => React.ReactNode;
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

1.
만약에 컴포넌트와 엘리먼트를 헷갈려서 잘못 쓴다면 아래와 같은 메시지를 보게된다.  
Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object.

2.
children 처럼 특별한 props는 리액트 Element이다. (React.ReactNode 로 타이핑)  
- React.Element 는 <></> 등 JSX의 결과물이다.   
- 반면 React.Node 는 JSX 뿐 아니라, string, null, number등도 가능하다.   

3.
컴포넌트는 Element를 리턴하는 함수이다.    
const element = <h1>Hello, World!</h1>;  
const component = ()=> <h1>Hello, World!</h1>;  

```

