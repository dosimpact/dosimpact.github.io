---
sidebar_position: 2
---

# NextJS Essential 1 - AppRouter,Rendering  

- [NextJS Essential 1 - AppRouter,Rendering](#nextjs-essential-1---approuterrendering)
  - [Goal](#goal)
  - [AppRouter](#approuter)
    - [디렉터리 구조](#디렉터리-구조)
  - [RSC, SSR 이해](#rsc-ssr-이해)
    - [Client vs Server Component](#client-vs-server-component)
    - [File Conventions](#file-conventions)
    - [RCS + AppRouter fullPage,subPage 의 동작이해](#rcs--approuter-fullpagesubpage-의-동작이해)
    - [ref](#ref)
    - [hydration이 끝났는지 알 수 있는 방법](#hydration이-끝났는지-알-수-있는-방법)
    - [revalidate](#revalidate)
  - [refs](#refs)

## Goal

- AppRouter란?  
- AppRouter 디렉터리 구조 잡기  
- 서버컴포넌트 클라이언트 차이 이해  
- AppRouter의 랜더링 방식 이해  
- hydration 이해  

## AppRouter

NextJS에서는 app 디렉터리 구조가 웹페이지 전체 구조를 표현하다.  
- app 디렉터리 = 웹 페이지 사이트 맵과 유사한 형태  

### 디렉터리 구조

- 간단하게 짚고 넘어가자.  

```
Min.ver
layout + page + loading + error
.
├── (site)
├── error.tsx
├── favicon.ico
├── globals.css
├── layout.tsx
│   ├── components
│   │   └── category.jsx
│   ├── error.tsx
│   ├── layout.tsx
│   ├── loading.tsx
│   └── page.tsx
├── channel
│   └── [id]
│       ├── components
│       ├── error.tsx
│       ├── layout.tsx
│       ├── loading.tsx
│       └── page.tsx
└── playlist
    ├── components
    ├── error.tsx
    ├── layout.tsx
    ├── loading.tsx
    └── page.tsx
---
Full.ver
.
├── actions : next server actions 기능  
├── app : AppRouter
│   ├── api : api Handler  
│   │   ├── create-checkout-session
│   │   │   └── route.ts
│   │   └── webhooks
│   │       └── route.ts
│   ├── (site)
│   │   ├── error.tsx
│   │   ├── loading.tsx
│   │   └── page.tsx
│   ├── error.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── account
│   │   ├── components
│   │   ├── error.tsx
│   │   ├── loading.tsx
│   │   └── page.tsx
│   └── search
│       ├── components
│       │   └── SearchContent.tsx
│       ├── error.tsx
│       ├── loading.tsx
│       └── page.tsx
├── components : 공통 컴포넌트 라이브러릴 
├── hooks : 공통 훅
├── providers : Context 모음
├── libs : 외부 라이브러리 서비스 (stripe,supaBase 등)
├── public : 정적 리소스 
├── database.sql : DB Modal
├── middleware.ts
├── next.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── types.ts
└── types_db.ts
```

## RSC, SSR 이해

RSC : 리액트 서버 컴포넌트   
SSR : Server Side Rendering    

### Client vs Server Component  

리액트만 사용했던 사람이라면, 서버컴포넌트에 익숙하지 않을 수 있다.   
- 서버 컴포넌트는 말 그대로 서버에서 작동되는 컴포넌트이며,  
- 초벌구이 같은 느낌으로 , HTML 정적 리소스를 미리 컴파일 해서 Browser에 넘겨준다.  
- 그 이후에 hydration 과정을 거쳐서 클라이언트 컴포넌트가 작동된다.  


1.NextJS에서 컴포넌트는 기본적으로 서버컴포넌트이다.  
- Client Component 선언을 위해서 'use client'을 파일위에 적어준다.    
- Client Component에서 import하는 하위 컴포넌트는 모두 Client Component 이다.   
- Client Component에서 useState 등의 리액트 lifecycle hook을 사용할 수 있다.  

만약에 useClient을 안적는다면?  
- useState, useMemo 등 사용이 불가능하다.  
- 컴파일 경고가 나온다. 그렇지 않는 경우도 있다.  
- 애니메이션이 있는 Loading과 같은 컴포넌트는 애니메이션이 동작안할 수 있다.  


2.NextJS에서 서버컴포넌트는 서버에서 랜더링 된다.  
- AppRouter는 Page를 FullPage, SubPage로 구분한다.  
  
- FullPage 요청 > (새로고침, 최초요청)에는 SSR이 적용된다.  
  - `use client` 지시어를 사용했어도, SSR에 포함된다.  
  - useState 같은 경우 default 값으로 HTML이 구워져서 나온다.  
  - 그 이후 hydration 과정을 거친다.  

- SubPage로 라우팅 되면, 필요한 부분만 서버에서 랜더링 된다.  
  - RooLayout에서 context 와 같은 클라이언트 상태는 유지된다.  
  - 특정 subPage가 서버컴포넌트로 SSR이 가능하면 그 부분만 컴파일 된다.   
  - 그 이후 hydration 과정을 거친다.  


3.클라이언트 경계 

서버, 클라이언트 컴포넌트가 섞여서 복잡해 보이지만, 결국 목적은 최대한 서버에서 처리할 수 있는부분은 처리하고 나머지는 클라이언트에 던져주기 위함.  
- RSC, RCC 가 혼합되지만, 결국 일부 랜더 트리는 클라이언트 단에서 처리가 필요.  
- SSR이 가능한 부분과 그렇지 않은 부분을 nextjs가 구분해서 최적화 한다.   
- 최대한 SSR에서 처리하고 나머지 부분은 browser에서 처리할 수 있도록 만드는것이 목표이다.  
- 클라이언트의 경계를 구분짓기 위한 결과다.
- 컴포넌트가 아닌 파일 단위의 Tree 구조를 머리속에 그려야 한다.   

### File Conventions

ref : https://nextjs.org/docs/app/api-reference/file-conventions  


```js
# File Conventions
page  :  Unique UI of a route and make routes publicly accessible (SSR)
loading :  Loading UI for a segment and its children (use client)
error :  Error UI for a segment and its children (use client)
layout  :  Shared UI for a segment and its children

not-found :  Not found UI for a segment and its children
global-error  :  Global Error UI
route :  Server-side API endpoint
template  :  Specialized re-rendered Layout UI
default :  Fallback UI for Parallel Routes

# check Component Hierarchy  
- 파일 컨벤션에 따라서 리액트 컴포넌트를 만들었다.  
- 그 컴포넌트 사이에는 약속된 Tree가 생성 된다. 
```

ref : https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts

### RCS + AppRouter fullPage,subPage 의 동작이해  

NextJS에서 RootLayout의 로딩 시간을 줄이는것은 매우 중요하다.  

- RootLayout 2초 + Home 2초 => 페이지 최초 로딩 2초
- RootLayout 4초 + Home 2초 => 페이지 최초 로딩 4초 : Root가 느리면 다 같이 느려진다.  
- RootLayout 2초 + Home 4초 => 페이지 최초 로딩 2초 + Home 레이웃은 loading.tsx 노출  


```js
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("--> start");
  await sleep(4000);
  console.log("--> end");
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}
---
export default async function Home() {
  console.log("--> Home start");
  await sleep(2000);
  console.log("--> Home end");

  return (
    <div>
      {/* <Box>Home box</Box> */}
      <Loader />
    </div>
  );
```

### ref

https://yozm.wishket.com/magazine/detail/2271/  
https://reactnext-central.xyz/blog/8-things-you-shold-konw-about-nextjs-13#1-react-%EC%84%9C%EB%B2%84-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8-rsc  
https://github.com/reactwg/react-18/discussions/37  


### hydration이 끝났는지 알 수 있는 방법 

- useEffect가 작동되면, CSR이 가능한 상태이다.  
- 아래 모달창은 SSR만으로는 UI가 심하게 깨져서 hydration이후 화면을 그리도록 했다.  

```js
"use client";

import { useEffect, useState } from "react";

import AuthModal from "@/components/AuthModal";
import SubscribeModal from "@/components/SubscribeModal";
import UploadModal from "@/components/UploadModal";
import { ProductWithPrice } from "@/types";

interface ModalProviderProps {
  products: ProductWithPrice[];
}

const ModalProvider: React.FC<ModalProviderProps> = ({
  products
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AuthModal />
      <SubscribeModal products={products} />
      <UploadModal />
    </>
  );
}

export default ModalProvider;

```

### revalidate

서버컴포넌트에서 무조건 새로운 데이터로만 SSR을 수행하고자 할 때

```js
// 0 은 요청이 들어오면 페이지가 다시 생성된다는 의미이다.  
// 60 이라면, 60초마다 페이지를 다시 생성 한다, 정적페이지의 내용을 주기적으로 업데이트하고 최신데이터를 유지한다.  
export const revalidate = 0;
```



## refs

[Data Fetching, Caching, and Revalidating](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)   

[Next.js 에센셜: Next.js 웹앱에서 Client Side Rendering을 추구하면 안되는걸까?  ](https://cat-minzzi.tistory.com/104)  