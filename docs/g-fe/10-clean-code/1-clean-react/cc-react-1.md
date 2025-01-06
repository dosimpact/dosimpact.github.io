---
sidebar_position: 1
---

# 클린코드 리액트 1     

## 1.State  

## 초기값 설정은 반드시  

초기값도 UI에 보이는 값  
- 초기 렌더링에 순간적으로 보이는 값이다.  

초기값이 없다면?  
- 타입불일치 이슈 
- undefined로 런타임 애러  
- 렌더링 이슈 혹은 무한 루프  
- 원상태로 어떻게 복구 할지 명시  
- null 방어 코드 줄이기  


```js
const MyComponent = () => {
    const [items, setItems] = useState(); // 초기값 설정 없음

    return (
        <ul>
            {items.map(item => (
                <li key={item.id}>{item.name}</li>
            ))}
        </ul>
    );
};
```

## 렌더링 싸이클에 걸리지 않는 변수는 컴포넌트 외부로  

```js
// 컴포넌트 외부에 변수를 정의
let externalVariable = 0;

const MyComponent = () => {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        setCount(count + 1);
        externalVariable += 1; // 외부 변수를 업데이트
    };

    return (
        <div>
            <p>Count: {count}</p>
            <p>External Variable: {externalVariable}</p>
            <button onClick={handleClick}>Increment</button>
        </div>
    );
};
```

## 불필요한 상태 제거하기  

useState, useEffect는 줄일 수 있다.  
- computed field를 사용하는 것 ( 단, 리렌더링 전제 )   

1.플래그 상태로 바꾸기

```js
const MyComponent = () => {
    const [isLogin, setIsLogin] = useState(0);

    useEffect(()=>{
        if(a) setIsLogin(true);
        if(b) setIsLogin(true);
    },[a,b])
};
---
const MyComponent = () => {
   const isLogin = a || b  
};
```

2.불필요한 상태 제거하기

```js
const MyComponent = () => {
    const [userList, setUserList] = useState([]);
    const [activeUserList, setActiveUserList] = useState([]);

    useEffect(()=>{
        const filteredUserList = userList.filter(...)
        setActiveUserList(filteredUserList)
    },[userList])
};
---
const MyComponent = () => {
    const [userList, setUserList] = useState([]);
    const activeUserList = userList.filter(...)
};
```


## useState 대신 useRef  

- useRef는 컴포넌트 라이프싸이클 동안 유지되는 static 성격의 값이다. (가변 컨테이너)  
  - useRef 값이 변경되어도 리렌더링을 발생시키지 않는다.  
  - useRef에 의한 computedValue 값이 변경되어도 리렌더링을 발생시키지 않는다.  
  - useState, props의 변화에 의해 변경된 useRef 값, computedValue이 UI에 반영된다.  

```js
import React, { useRef, useState } from 'react';

export function App() {
  const valueRef = useRef(10); // 기본값 설정
  const computedValue = valueRef.current * 2; // 계산된 값

  const [state, setState] = useState(0);

  const updateRef = () => {
    valueRef.current += 5; // 값 증가
    console.log('valueRef:', valueRef.current, 'computedValue:', computedValue);
  };

  const forceRender = () => {
    setState(prev => prev + 1);
  };

  return (
    <div>
      <p>현재 값: {valueRef.current}</p>
      <p>Computed 값: {computedValue}</p>
      <button onClick={updateRef}>useRef 값 변경</button>
      <button onClick={forceRender}>리렌더링 강제 실행</button>
    </div>
  );
}
// Log to console
console.log('Hello console');
```

```js
export const component = ()=>{
    const isMount = useRef(false);
    useEffect(()=>{
        isMount.current = true;
        return ()=> isMount.current = false;
    },[])
}
```

### 연관된 상태 단순화하기   

1.연관된 상태, sequence 같은 상태는 enum 묶어서 처리할 수 있는 방법이 있다.    
2.연관된 상태, state diagram 같은 상태는 object 묶어서 처리할 수 있는 방법이 있다.    
3.이러한 연관된 상태는 useReducer로 리팩터링 가능하다.  

### 커스텀 훅 추출하기  

1.로직에 따라서 커스텀 훅 추출하기  
- filter hook, pagination hook
2.역할에 따라서 커스텀 훅 추출하기  
- 역할 : state, computed field, function, useEffect  

### 이전 상태 활용하기  

- 아래 예시처럼 핸들러 함수 내 state를 직접 참조하는것은 예상치 못한 버그가 발생할 수 있다.    

```js
export function App() {
  const [state, setState] = useState(0);

  const handler1 = () => {
    setState(state + 1)
     // =>setState(prev => prev + 1)
  };

  const handler2 = () => {
    setState(state + 1)
  };
}
```
