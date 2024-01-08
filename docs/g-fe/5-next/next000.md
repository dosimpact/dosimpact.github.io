---
sidebar_position: 0
---
# NextJS 2024 FullStack

- [NextJS 2024 FullStack](#nextjs-2024-fullstack)
  - [MLP/MVP 등의 프로덕트를 빠르게 개발할 수 있는 기술 스택은 ?](#mlpmvp-등의-프로덕트를-빠르게-개발할-수-있는-기술-스택은-)
  - [1.Typescript + Javascript](#1typescript--javascript)
  - [2.Superbase (postgreSQL)](#2superbase-postgresql)
  - [3.NextJS 14의 강력한 기능](#3nextjs-14의-강력한-기능)
    - [Server API Level](#server-api-level)
    - [Server Rendering Level](#server-rendering-level)
      - [1.React Server Component 도입](#1react-server-component-도입)
      - [2.다양한 SSR(Server Side Rending) 사용](#2다양한-ssrserver-side-rending-사용)
  - [4.TailwindCSS 의 가능성](#4tailwindcss-의-가능성)
  - [5.전역 상태관리는 Zustand](#5전역-상태관리는-zustand)
  - [6.결제 시스템까지 처리하는 Backend NextJS!](#6결제-시스템까지-처리하는-backend-nextjs)


점점 더 개발 도구들이 발전한다.  
- 이러한 도구들을 이용하면 개발 속도가 빨라진다.  
- 빠르게 시장검증이 가능하다.  
- 사용자의 반응을 보고, PMF를 찾기 적절한 기술 풀스택을 정하자.  


## MLP/MVP 등의 프로덕트를 빠르게 개발할 수 있는 기술 스택은 ?

웹 풀스택 with NextJS   

NextJS 14 + TS + TailwindCSS + RadixUI + Zustand + Superbase(OAuth, CRUD, Storage) + Stripe   


## 1.Typescript + Javascript  

빠른 개발이 필요한 부분, 유연성이 필요한 부분은 JS를 통해서 개발하자. eg)UI개발  
안정성이 필요한 부분은 TS를 이용해서 개발하자. eg)DB 접근, API 정의, 결제시스템   

## 2.Superbase (postgreSQL)  

Superbase 를 사용하자.!  
- 내부적으로는 postgreSQL를 사용한다.  
- 오픈소스라서 직접 온프레미스로 docker를 활용해서 superbase를 구축할 수 있다.  
- 재미있을것 같지만 많은 부분들을 이해해야 해서 당장은 프리티어 플린으로 가자. 

빠르게 구현할 수 있는 기능들  
- DDL With Admin Tool  
- DML with Admin Tool  
- CRUD ORM with TypeGenerator  
- OAuth2 with Login UI Helper  
- Object Storage    
- EdgeFunctions  

## 3.NextJS 14의 강력한 기능  

### Server API Level  

1.Router Handler  
- 정적인 REST API 에 대한 처리가 가능하다.  
- 로그인 콜백, 결제 시스템 콜백, 웹훅 같은 기능은 NextJS의 api 디렉터리를 사용하자.  


2.Server Actions  
- 매번 API 경로를 따서, 브라우저에서 POST요청을 보내는것은 번거롭다.  
- ServerAction 기능을 사용하면 이를 해결 할 수 있다.  
- 랜덤한 해시 경로가 생성되며, 브라우저는 이러한 경로를 관리할 필요가 없다.  
- 그냥 서버의 함수 import 후 부르는것으로 개발자 경험이 향상된다.  


### Server Rendering Level  

#### 1.React Server Component 도입  
- 줄여서  RSC 라고 한다.  
- SSR 서버 사이드 랜더링과 함께 혼란스럽지만, 기존의 패러다임을 변화시킬것은 분명하다.  
- RSC을 이용해서 여러 SSR 전략을 사용할 수 있다.  
- NextJS은 기본적으로 서버컴포넌트 이므로, 클라이언트 컴포넌트와 같이 로직을 짜게 된다.  
- 클라이언트 컴포넌트는 `use client` 지시어를 사용하면 된다.  

- *서버컴포넌트 import하는 모듈이 클라이언트 컴포넌트라면, RSC는 RCC가 된다. 이는 클라이언트 경계를 구분짓기 위함.  
- *특정 클라이언트 컴포넌트도, RCS 처럼 작동한다.  

1.1 Full Page Loading  

새로운 경로 혹은 다른 라우터의 경로에 접근할 때 full page loading이 된다.  
- 서버에서는 compiling 이라는 메시지와 함께 서버 컴포넌트가 컴파일 된다.  
- 여기서 특정 클라이언트 컴포넌트들도 초기 랜더링에 포함된다.  
- 이후 hydration 과정을 거처 CSR이 완성된다.  


1.2 Sub Page Loading  
- 하위 경로에 대해서 NextJS는 필요한 부분만 랜더링 하게 된다.  
- RootLayout에서 클라이언트 컴포넌트는 유지 된다.  

---

#### 2.다양한 SSR(Server Side Rending) 사용  

2.1 SSR 종류 (구지 나누자면 )  

SSG : 정적사이트 생성  
- 앞으로 웹 페이지가 불변하다.  
- 서버컴포넌트, 클라이언트 컴포넌트가 모두 정적인 html파일로 변한다.  
- next를 이용해서도 react 결과물 처럼 정적파일만 만들어 낼 수 있다.  

ISR : Incremental Static Regeneration
- 주기적으로 정적사이트를 다시 생성한다.  
- 정적사이트의 들어가는 재료인, 데이터가 업데이트 되면 새로운 Static Site가 만들어진다.  
- 마치 Batch를 통해서 갱신하는 방법  

SSR : Dynamic Server Side Rendering  
- 요청할 떄, 항상 새로운 데이터를 바탕으로 랜더링 결과물을 만든다.  
- 항상 최신 데이터를 유지한다.  
- 성능상 캐싱을 사용할 수 있다.  
- eg) Revalidating
  - Time-based Revalidation: 
  - Time-based Revalidation: Route Handlers, Server Actions

Streaming : 스트리밍 랜더링  
- SSR은 full page loading 후 hyration이 일어난다.  
- 부분적으로 페이지를 로딩하고 hyration을 구역별로 할 수 없을까? 
- Streaming 방식으로 랜더링을 할 수 있다.  
- 이는 경계가 필요한데, React Suspense + RSC 조합으로 가능하다.   

CSR : 클라이언트 사이드 랜더링  
- 리액트와 동일하게 작동


2.2 RSC 을 이용한 다양한 랜더링 방식 구현

- RSC - 빌드 시점에서 데이터 Fetch 후 정적파일로 변환  
- RCC - 특정 컴포넌트 html 변환, UI단 리액트 처럼 작동  
- 위 조합으로 SSG / ISR / SSR / Streaming / CSR 작동  


## 4.TailwindCSS 의 가능성  

원래는 CSS만 아는것으로 만족했다.  
- 하지만 tailwind CSS를 보고 생산성이 올라가는것을 느꼈다.  
- 물론 tailwind like css 를 배우는데 러닝 커브가 있다.  
- 완적히 몸에 익혔을때는 마크업과 동시에 CSS까지 모두 처리하는 생산성을 보여준다.  


## 5.전역 상태관리는 Zustand  

서버컴포넌트와 서버사이드 랜더링 개념을 받아들이면서 전역상태를 관리하는게 이상했다.  
- Redux, Zustand 등 React의 Root Provder로 들어가는 Context 인데,
- 서버컴포넌트에 이를 사용하는게 이해가 되지 않았다.  
- 이는 컴포넌트 트리 관점에서 Import 모듈 관점에서 계층을 이해해야 한다.  

## 6.결제 시스템까지 처리하는 Backend NextJS!  

Stripe API를 도입하면 결제시스템을 쉽게 붙일 수 있다.  
- 다만 클라이언트 요청, 서버단의 처리, Stripe 서버의 처리  
- 등 3가지를 왔다갔다 해야 한다.  
- NextJS에서는 Stripe의 웹훅을 처리할 수 있다.  