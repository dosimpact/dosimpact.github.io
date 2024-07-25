---
sidebar_position: 1
---

# Basic React Testing 01

- [Basic React Testing 01](#basic-react-testing-01)
  - [준비사항](#준비사항)
      - [1.Mock Router](#1mock-router)
      - [2.Mock API with MSW](#2mock-api-with-msw)
      - [3.각 테스트의 시간 제한 걸기 Jest](#3각-테스트의-시간-제한-걸기-jest)
  - [Debuging](#debuging)
  - [테스트를 3단계로 진행합니다.](#테스트를-3단계로-진행합니다)
  - [DOM Testing Library](#dom-testing-library)
    - [Install](#install)
      - [getBy vs findBy vs queryBy](#getby-vs-findby-vs-queryby)
      - [DOM 요소를 가져오는 방식에는 2가지가 있습니다.](#dom-요소를-가져오는-방식에는-2가지가-있습니다)
    - [render](#render)
    - [screen](#screen)
      - [ByText 와 ByRole 의 중요한 차이점](#bytext-와-byrole-의-중요한-차이점)
    - [userEvent (async) (@testing-library/user-event)](#userevent-async-testing-libraryuser-event)
    - [fireEvent (@testing-library/react)](#fireevent-testing-libraryreact)
    - [Jest (DOM) Matcher](#jest-dom-matcher)
    - [route changed rerender](#route-changed-rerender)
    - [waitFor](#waitfor)
  - [Trouble Shooting](#trouble-shooting)
  - [React Router DOM](#react-router-dom)

## 준비사항  

#### 1.Mock Router 

1.라우터는 메모리 라우터로 테스트 합니다. 
- 이는 브라우저의 히스토리 저장소에 연동되지 않고, 메모리에서 라우터를 온전히 관리 합니다.   
- 테스트 중에 경로가 바뀐다면, 리랜더링을 통해서 다시 화면을 그려야 합니다.  

```js
// 1.Memory Router 이용
import { MemoryRouter } from 'react-router-dom';

  const { container } = render(
      <MemoryRouter initialEntries={['/start']}>
        <App />
      </MemoryRouter>
    );

// 2.history 객체를 직접 관리하며 Router에 바인딩  
// - history 객체를 더 커스터 마이징 가능.  
// - 컴포넌트 내부에서 history.push 등의 이벤트가 발생하면 rerender를 해야 한다.  

import App from 'App';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

    const history = createMemoryHistory({
      initialEntries: ['/start'],
    });

    const { container } = render(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    );
```

#### 2.Mock API with MSW

2.msw 서버를 셋업합니다.  
- Unit 테스트 환경에서 사용할 특정 경로에 대한 응답을 mocking 합니다.  
- browser 환경에서는 service worker로 msw를 실행 합니다.   
- 테스트 환경에서는 node 환경으로 msw를 실행 합니다.    

```js
// 특정 경로를 server.use를 사용하면 override 가능. 
  beforeAll(() => {
    server.use(
      rest.get('/api/mock-url', (_, res, ctx) => {
        return res(ctx.status(200), ctx.json({ mock:true }));
      })
    );
  });

```


#### 3.각 테스트의 시간 제한 걸기 Jest 

```js
  test('test stub', async () => {
    jest.setTimeout(20000);
  });
```

## Debuging  

```js
await screen.findByText(/text/);
screen.debug();
// <body> 태그를 포함한 전체 DOM출력한다.  
// 사용자가 마치 화면을 보는것과 같이 인터렉션.  
--- 
    const { container } = render(
      <MemoryRouter initialEntries={['/start']}>
        <App />
      </MemoryRouter>
    );
console.log(prettyDOM(container));
// redner대상의 컴포넌트만 DOM을 출력한다.  
// querySelector 등을 사용해서 요소에 접근 가능.  

```

## 테스트를 3단계로 진행합니다.  

1.given  
- 컴포넌트를 렌더링 합니다.  
  - ConfigeWrapper를 감싸는게 필요합니다.(router 등)  

2.when  
- 어떠한 유저의 액션
  - 클릭 이벤트 ( userEvent.click ) 
  - 입력 이벤트 ( fireEvent.change )

3.then  

3.1 존재성 확인 : 스크린에서 특정 텍스트가 있는지 확인
3.2 클릭 이벤트 확인 : 특정 버튼을 클릭했을때 정상 작동 해야 합니다. 
3.3 비동기 처리 대기, waitFor을 이용해서 비동기 처리에 대한 로직을 대기해야 합니다.   
3.4 입력 이벤트

## DOM Testing Library   


### Install 

```
yarn add @testing-library/react 
yarn add @testing-library/jest-dom  
yarn add @testing-library/user-event   

---
yarn add @testing-library/react 
- render, screen 함수 제공  

yarn add @testing-library/jest-dom  
- https://testing-library.com/docs/ecosystem-jest-dom/
- DOM element matchers 를 제공해준다.  
- 예) toBeEmptyDOMElement 비었는지? , toBeVisible 요소가 visible한지?

yarn add @testing-library/user-event   
- 예) await userEvent.click(await screen.findAllByText(/text/));  

```

#### getBy vs findBy vs queryBy
https://testing-library.com/docs/dom-testing-library/cheatsheet/#queries  

DOM에서 요소를 가져올때 크게 3가지 방식이 있다.  
1.getBy : await를 하지않고 바로 가져오려고 시도.
- getByRole 을 통해 접근성 트리를 이용하는것이 가장 좋다.  

2.findBy : await를 하며, 없다면 애러를 던진다. 
- waitFor 또는 findBy와 같은 Async API를 사용하여 DOM의 변경을 기다릴 수 있다.  
- API Call이 포함된 useEffect가 있다면 await + findBy를 사용할 것.  


3.queryBy : 요소가 없어도 애러를 던지지 않는다.(querySelector를 생각하면 될듯)   


#### DOM 요소를 가져오는 방식에는 2가지가 있습니다.  
- 1.getTextBy을 통해서 가져오는것은 실제 유저의 인식가 닮아있다.  
- 2.render 결과에서 querySelector을 이용해서 DOM을 직접가져옵니다. 
  - 이는 실제 유저가 아닌 컴퓨터의 로직으로 가져옵니다.  

### render

```js
const history = createMemoryHistory({ initialEntries: ['/home'] });

    const { container: app, rerender } = render(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    );
```

### screen

현재 DOM 전체에서 요소를 가져옵니다.  

```js
// 1.findByText (async)
await screen.findByText(/text/);
// visibility: 'hidden' 임에도 HTML요소가 있으면 PASS
expect(await screen.findByText(/text/)).toBeVisible();
// visibility: 'hidden' 인 경우 Fail  

// 2.findByRole (async)
await screen.findByRole('button', { name: /text/ })
await screen.findByRole('checkbox', { name: /i agree terms/i });

```

#### ByText 와 ByRole 의 중요한 차이점

```js
const btnEl = await screen.findByText(/버튼명/);
console.log('-->btnEl', prettyDOM(btnEl));
// 버튼을 반드시 가져오지 않는다. 버튼을 감싸는 span 태그 등의 내부 요소를 가져올 수 있다.  
// 그런경우라면 closest 등으로 부모 요소로 올라가야 한다.   

const btnEl = await screen.findByRole('button', { name: /버튼명/ });
console.log('-->btnEl', prettyDOM(btnEl));
// 사용자 입장에서 button을 가져온다. 이때 버튼명을 기준으로 가져온다. 설령 다른 태그로 감싸여 있더라도.  

```

### userEvent (async) (@testing-library/user-event)    

- https://testing-library.com/docs/dom-testing-library/api-events/ 
- 실제 사용자 상호작용을 더 잘 시뮬레이션.

```js
import userEvent from '@testing-library/user-event';

//1. userEvent.click
await userEvent.click(screen.getByRole('button', { name: /text/ }));
```

### fireEvent (@testing-library/react)  

- programatic 하게 이벤트의 모든 세부 사항을 직접 제어 가능  
- 실제 사용자 상호작용과 다를 수 있음.


```js
import { fireEvent } from '@testing-library/react';
fireEvent(node: HTMLElement, event: Event)
//1. click
// <button>Submit</button>
fireEvent(
  getByText(container, 'Submit'),
  new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  }),
)

//2. input
const inputs = Array.from(app.querySelectorAll('input'));
fireEvent.change(input, { target: { value: '' } });  

//3. keydown
fireEvent.keyDown(domNode, {key: 'Enter', code: 'Enter', charCode: 13})

//4. file
fireEvent.drop(getByLabelText(/drop files here/i), {
  dataTransfer: {
    files: [new File(['(⌐□_□)'], 'chucknorris.png', {type: 'image/png'})],
  },
})
```

### Jest (DOM) Matcher 

```js
// array with value check
expect([1,2]).toEqual([1,2])

---
expect(button).toBeInTheDocument(); 
// DOM Tree내부에 있는지 체크한다.  
expect(button).toBeVisible();
// DOM Tree내부에 있으며, 화면에 보이는지 체크한다.  
expect(button).toBeEmptyDOMElement();

expect(checkbox).not.toBeChecked();
// 체크박스

expect(button).toHaveAttribute('disabled');
// https://github.com/testing-library/jest-dom?tab=readme-ov-file#tohaveattribute

expect(button.closest('li')).toHaveClass('disabled');
//https://github.com/testing-library/jest-dom?tab=readme-ov-file#tohaveclass
```

### route changed rerender

```js
//3.테스트 시나리오 중 사용자의 액션으로 경로가 바뀌었다면 리랜더링 해야 한다.  
    const history = createMemoryHistory({
      initialEntries: ['/home-page'],
    });
    const { container, rerender } = render(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    );

    const startBtn = await screen.findByRole('button', { name: /text/ });
    expect(startBtn).toBeInTheDocument;
    await userEvent.click(startBtn);

    rerender(
      <Router location={history.location} navigator={history}>
        <App />
      </Router>
    );
    expect(history.location.pathname).toBe('/next-page');
```


### waitFor  
- 비동기 함수를 기다리는데 사용한다.  
  - 1.DOM 업데이트 useEffect를 기다릴 수 있다.  
  - 1.Fetch를 통해 데이터를 가져오는 경우를 기다릴 수 있다.  

```js
    await waitFor(
      async () => {
        const message = await screen.findByText(/text/);
        expect(message).toBeVisible();
        // 문구가 3초뒤 사라진다면
        await new Promise(_ => setTimeout(_, 3000));
        expect(message).not.toBeVisible();
      },
      { timeout: 5000 } // 최대 5초만 기다린다.  
    );
```

## Trouble Shooting

```js
1.render 를 안하고 screen.debug();를 호출하면 body 태그만 나온다.  

2.MemoryRouter의 initialEntries 에 route를 "/path" 대신 "path" 라고 입력하면 잘못된 경로로 들어간다.  

3.getByRole은 버튼 등의 요소 그 자체를 가져올 수 있으나, 버튼의 텍스트로 요소를 찾게되면 버튼이 아닌 span 태그가 올 수 있다.  

4.jest 설정  
- jest.config : 환경 설정 
- jest.setip : 테스트 런타임 준비 설정  

```

## React Router DOM

```js
### 기본 사용법

1. **BrowserRouter**: 전체 애플리케이션을 감싸서 라우팅을 활성화합니다.
2. **Route**: 특정 경로에 컴포넌트를 매핑합니다.
3. **Link**: 페이지 간의 이동을 위한 링크를 만듭니다.

import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

const Home = () => <h2>Home</h2>;
const About = () => <h2>About</h2>;
const Contact = () => <h2>Contact</h2>;

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
      </Switch>
    </Router>
  );
}

export default App;

주요 개념

- **Router**: 라우터 컴포넌트로, `BrowserRouter`, `HashRouter`, `MemoryRouter` 등이 있습니다.
- **Route**: 경로와 해당 경로에 렌더링할 컴포넌트를 정의합니다.
- **Link**: 애플리케이션 내에서 링크를 만들어 페이지를 이동합니다.
- **Switch**: 여러 경로 중 일치하는 첫 번째 경로만 렌더링합니다.

이렇게 설정하면 React 애플리케이션 내에서 다양한 페이지를 쉽게 관리하고 네비게이션할 수 있습니다.
```

render 함수에서 container를 가르키는건 DOM 이야? virtualDOM 이야?
- 해당 컴포넌트는 브라우저 환경에서와 동일하게 실제 DOM에 렌더링됩니다. 

container에서 querySelectorAll을 통해서 가져오는거랑 차이가 있어?  

```js
`container.querySelectorAll`
- CSS 선택자를 사용하여 DOM에서 요소를 선택합니다.
- 유연하고 강력한 선택 메커니즘을 제공합니다.
- 반환된 요소들이 반드시 렌더된 텍스트를 포함하지 않아도 됩니다.

`getByText`
- 특정 텍스트 콘텐츠를 포함하는 요소를 찾습니다.
- 텍스트 기반으로 요소를 선택하므로, 사람이 읽는 방식과 더 가깝습니다.
- React Testing Library에서 제공하는 접근성 중심의 쿼리 방법입니다.

비교
- **용도**: `querySelectorAll`은 일반적으로 DOM 구조를 탐색할 때 유용하고,   
  `getByText`는 텍스트 콘텐츠 기반으로 요소를 찾을 때 유용합니다.  
- **가독성**: `getByText`는 테스트의 가독성을 높여주며, 접근성 측면에서 더 직관적입니다.  
- **정확성**: `querySelectorAll`은 CSS 선택자에 의존하기 때문에 구조적 변경에 민감할 수 있습니다.      
  `getByText`는 텍스트를 기반으로 하므로 구조적 변경에 덜 민감할 수 있습니다.  
```

