---
sidebar_position: 20
---

# React 공식문서 API 레퍼런스  

- [React 공식문서 API 레퍼런스](#react-공식문서-api-레퍼런스)
  - [createPortal](#createportal)
  - [useId](#useid)


## createPortal
>https://ko.react.dev/reference/react-dom/createPortal


```js
import { createPortal } from 'react-dom';
// ...
<div>
  <p>This child is placed in the parent div.</p>
  {createPortal(
    <p>This child is placed in the document body.</p>,
    document.body
  )}
</div>
```
1.createPortal 호출 당시 domNode가 선행적으로 존재해야한다.  
- domNode가 없다면 렌더링이 안된다.  
- domNode가 삭제되면 포털도 사라진다.
- domNode가 동적으로 변경되면 포털도 이동한다. (물론 변경 후 createPortal 재호출 )  

2.createPortal 반환값은 리액트 노드이다. 
- React가 렌더링 출력에서 이를 발견하면, 제공된 children을 제공된 domNode 안에 배치  

3.이벤트 전파
- DOM 트리가 아닌 React 트리에 따라 전파 

📌 3.Portal이 있는 모달 대화 상자 렌더링하기   

- createPortal 반환값을 렌더트리에 한번은 찔러 넣어야 한다.  

```js
import { createPortal } from 'react-dom';

export default function PortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Show modal using a portal
      </button>
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)} />,
        document.body
      )}
    </>
  );
}
```

📌 ant.design의 Static Modal Method는 ReactDOM.render 사용한다.  

https://ant.design/components/modal#why-i-can-not-access-context-redux-configprovider-localeprefixcls-in-modalxxx   

1.장점  
- provider를 제공하지 않아도 사용 가능한 static 함수이다.  
2.단점  
- 기존 렌더 트리의 context에 접근이 불가능 하다.  

📌 2.React 컴포넌트를 React가 아닌 서버 마크업으로 렌더링하기   

- `<div id="root">` 에 리액트 본래 렌더 트리를 넣는다.
- `<div class="sidebar">` 서버사이드의 특정 마크업을 넣는다.  
- `<div id="sidebar-content">` 에 리액트 포털을 이용해서 컴포넌트를 넣는다.  

```html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <h1>Welcome to my hybrid app</h1>
    <div class="parent">
      <div class="sidebar">
        This is server non-React markup
        <div id="sidebar-content"></div>
      </div>
      <div id="root"></div>
    </div>
  </body>
</html>
```

📌 3.React 컴포넌트를 React가 아닌 DOM 노드로 렌더링하기     

- 서드 파티 지도 라이브러리에 툴팁이 존재, 그곳에 DOM Node를 하나 만들어 리액트 컴포넌트 넣기.     
- ag grid에 제공하는 테이블 컴포넌트에 DOM Node를 하나 선택한다. 그곳에 리액트 컴포넌트 넣기.  
  - *차리리 순수 DOM을 직접 조작하는것이 나을 수 있다.  



## useId

언제 : 아래 예시처럼 컴포넌트 생성마다 고유한 id를 생성해서 접근성 관련 처리(label클릭 해서 input focus 처리 등) 해야 할 때    
주요 포인트  
- 1.useId는 hydration mismatch 문제를 해결해준다. 
  - useId는 부모의 렌더트리의 경로를 바탕으로 id가 만들어지므로, 서버든 클라이언트든 동일하게 id가 만들어진다.
  - ( SSR환경에서 useId대신 nextId++ 등의 아이디를 부여하면 안되는 이유이다. )  
- 2.랜더 트리 경로 기반으로 id를 만들기 때문에, 하나의 고유한 아이디에 suffix를 붙여서 사용 가능하다.  


```js
// 잘못된 예시: id가 중복되어 접근성에 문제가 생김
function MyInput() {
  return (
    <>
      <label htmlFor="my-input-id">이름</label>
      <input id="my-input-id" type="text" />
    </>
  );
}
---
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
<>
  <input type="password" aria-describedby={passwordHintId} />
  <p id={passwordHintId}>
</>
---
// 하나의 고유한 아이디에 suffix를 붙여서 사용 가능하다.  
   <form>
      <label htmlFor={id + '-firstName'}>First Name:</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>Last Name:</label>
      <input id={id + '-lastName'} type="text" />
    </form>
```