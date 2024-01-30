---
sidebar_position: 2
---

# NextJS Essential

- [NextJS Essential](#nextjs-essential)
  - [AppRouter](#approuter)
  - [디렉터리 전략](#디렉터리-전략)
  - [RCS, SSR 이해](#rcs-ssr-이해)
    - [Client, Server Component](#client-server-component)
    - [revalidate](#revalidate)
    - [ref](#ref)
  - [Server Level](#server-level)
  - [Server actions](#server-actions)
  - [Server router handler](#server-router-handler)
    - [Middleware](#middleware)
  - [etc](#etc)
  - [metadata](#metadata)
  - [directory custome convention](#directory-custome-convention)
  - [hydration이 끝났는지 알 수 있는 방법](#hydration이-끝났는지-알-수-있는-방법)


## AppRouter

```
# File Conventions

layout  :  Shared UI for a segment and its children
page  :  Unique UI of a route and make routes publicly accessible
loading :  Loading UI for a segment and its children
not-found :  Not found UI for a segment and its children
error :  Error UI for a segment and its children
global-error  :  Global Error UI
route :  Server-side API endpoint
template  :  Specialized re-rendered Layout UI
default :  Fallback UI for Parallel Routes

# check Component Hierarchy  
- 파일 컨벤션에 따라서 리액트 컴포넌트를 만들었다.  
- 그 컴포넌트 사이에는 약속된 Tree가 생성 된다. 

```

ref : https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts


## 디렉터리 전략

```
.
├── actions : next server actions 기능  
├── app : AppRouter
│   ├── api : api Handler  
│   │   ├── create-checkout-session
│   │   │   └── route.ts
│   │   ├── create-portal-link
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

## RCS, SSR 이해

### Client, Server Component 

1.NextJS에서 컴포넌트는 기본적으로 서버컴포넌트이다.  
- Client Component 선언을 위해서 'use client'을 파일위에 적어준다.    
- Client Component에서 import하는 하위 컴포넌트는 모두 Client Component 이다.   
- Client Component에서 useState 등의 리액트 lifecycle hook을 사용할 수 있다.  

2.NextJS에서 서버컴포넌트는 서버에서 랜더링 된다.  
- AppRouter구조 상 FullPage, SubPage로 구분된다.  
- FullPage 요청 (새로고침, 최초요청)에는 SSR이 적용된다.  
  - `use client` 지시어를 사용했어도, SSR에 포함될 수 있다.  
- SubPage로 라우팅 되면, 필요한 부분만 서버에서 랜더링 된다.  
  - RooLayout에서 context 와 같은 클라이언트 상태는 유지된다.  
  - 특정 subPage가 서버컴포넌트로 SSR이 가능하면 그 부분만 컴파일 된다.   

3.클라이언트 경계라는 개념 
- RSC, RCC 가 혼합되지만, 결국 일부 랜더 트리는 클라이언트 단에서 처리가 필요.  
- 최대한 SSR이 가능한 부분과 그렇지 않은 부분을 nextjs가 구분해서 최적화 한다.   

### revalidate

서버컴포넌트에서 무조건 새로운 데이터로만 SSR을 수행하고자 할 때
```js
// 0 은 요청이 들어오면 페이지가 다시 생성된다는 의미이다.  
// 60 이라면, 60초마다 페이지를 다시 생성 한다, 정적페이지의 내용을 주기적으로 업데이트하고 최신데이터를 유지한다.  
export const revalidate = 0;
```
ref : https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating


### ref
https://yozm.wishket.com/magazine/detail/2271/
https://reactnext-central.xyz/blog/8-things-you-shold-konw-about-nextjs-13#1-react-%EC%84%9C%EB%B2%84-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8-rsc
https://github.com/reactwg/react-18/discussions/37


---

## Server Level  

- Server actions : 동적 URL 처리  
- Server router handler : 정적 URL 처리   

## Server actions

## Server router handler

### Middleware

```js
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  /* 사용자 세션을 가져와야 서버컴포넌트에서 object에 접근할 수 있다. */
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();
  return res;
}

```

## etc

## metadata

- icons (TODO)

```js
// layout.tsx
export const metadata: Metadata = {
  title: "Spotify",
  description: "Listen to music",
};
```

## directory custome convention

```
actions : server actions 들을 넣는 폴더  
app : Next App Router
hooks : hook 모음, 더 세분화 해도 괜찮을 듯  
components : 공통 컴포넌트 모음, 더 세분화 해도 괜찮을 듯  
libs : Server Side Module, Utils 등 > 더 세분화 해도 괜찮을 듯
- server 에서 사용하는 모듈이라는 명시를 하면 좋을 듯 
- server/utils, server/libs
- 여기서도 `use server` 사용이 가능한가? 
public : 정적파일 리소스  
constants

```


## hydration이 끝났는지 알 수 있는 방법 

- useEffect가 작동되면, CSR이 가능한 상태이다.  
- Modal같은 경우가 대표적인 예시  
- 만약에 mounted 코드가 없다면? SSR에 modal이 포함되어 나오는가?  

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