---
sidebar_position: 2
---

# NextJS Essential 1 - AppRouter,Rendering  

- [NextJS Essential 1 - AppRouter,Rendering](#nextjs-essential-1---approuterrendering)
  - [Goal](#goal)
  - [AppRouter](#approuter)
    - [디렉터리 구조](#디렉터리-구조)
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