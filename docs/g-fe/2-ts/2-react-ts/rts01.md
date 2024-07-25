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
