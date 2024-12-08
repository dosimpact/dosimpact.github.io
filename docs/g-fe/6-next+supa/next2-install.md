---
sidebar_position: 9
---

# Supabase install

- [Supabase install](#supabase-install)
  - [create supabase project](#create-supabase-project)
  - [db connection with DBeaver](#db-connection-with-dbeaver)
  - [Install with Nextjs AppRouter](#install-with-nextjs-approuter)
    - [env settings](#env-settings)
    - [next + @supabase/ssr setup](#next--supabasessr-setup)
    - [1.주의사항](#1주의사항)
    - [2.주의사항](#2주의사항)
    - [supabase클라이언트는 여러버전 만들어야 한다.](#supabase클라이언트는-여러버전-만들어야-한다)
    - [createBrowserClient](#createbrowserclient)
    - [createServerClient](#createserverclient)
      - [미들웨어 createServerSideClientRSC 따로 만든 이유](#미들웨어-createserversideclientrsc-따로-만든-이유)
      - [미들웨어 createServerClient 따로 만든 이유](#미들웨어-createserverclient-따로-만든-이유)
    - [트러블슈팅](#트러블슈팅)

## create supabase project  

- 비밀번호는 초기에 한번 셋팅 가능하니 잘 기억해 둘 것  
- 직접 db connection 할 때 사용된다.  

## db connection with DBeaver  

Settings > Database Settings  
```
host, port, user(username), password 입력 후 DBeaver 로컬에서 연결해 보기  
with PostgreSQL JDBC Driver    
```


## Install with Nextjs AppRouter  

```js
// javascript 클라이언트
yarn add @supabase/supabase-js // 통합 SDK

// next에서는 통합 SDK 대신 아래 사용
yarn add @supabase/ssr
- yarn add @supabase/auth-helpers-nextjs 대신 yarn add @supabase/ssr 사용할 것  
- 싱글톤 패턴 등 제공  

// react에서는 통합 SDK 대신 아래 사용
yarn add @supabase/auth-helpers-react

// 로그인 도와주는 유틸 라이브러리  
yarn add @supabase/auth-ui-react // 로그인 UI제공
yarn add @supabase/auth-ui-shared // 테마 제공 
- https://www.npmjs.com/package/@supabase/auth-helpers-nextjs

```

### env settings

Settings > API  
- Project URL : A RESTful endpoint for querying and managing your database    
- Project API keys > anon, public : 테이블에 대해 행 수준 보안을 활성화하고 정책을 구성한 경우 이 키는 브라우저에서 사용해도 안전합니다.   
- Project API keys > service_role(secret) :  > 이 키에는 행 수준 보안을 우회하는 기능이 있습니다. 절대 공개적으로 공유하지 마세요.   


```

# Update these with your Supabase details from your project settings > API
NEXT_PUBLIC_SUPABASE_URL=xxxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
SUPABASE_SERVICE_ROLE_KEY=xxxx
```


### next + @supabase/ssr setup

![Alt text](image-2.png)  
- 참고 : https://www.youtube.com/watch?v=XIj7nmIYtbo

### 1.주의사항

- yarn add @supabase/auth-helpers-nextjs 대신 yarn add @supabase/ssr 사용할 것   
- @supabase/ssr 패키지는 next.js뿐 아니라 Nuxt, Remix 사용 가능한 좀 더 일반화된 패키지이다.  
- 그래서 쿠키 설정같은 부분을 직접 해야하는 번거로움이 존재하긴 함.  
- 공식문서에서 제시한 방향이니 따라가자.  


### 2.주의사항 

- *supabase를 사용하는 next 서버, 브라우저 모두 클라이언트(상대적)    
- @supabase/supabase-js 에서도 클라이언트 만들 수 있음.   
- @supabase/ssr 에서도 서버, 브라우저 클라이언트 만들 수 있음.  
- 하지만 ssr 패키지가 싱글톤 패턴으로, createBrowserClient 마음껏 해도 괜찮음.  


### supabase클라이언트는 여러버전 만들어야 한다.

아래는 next.js 기능을 크게 나눈 것   
- 1.Router handler : 정적 URL 처리      
- 2.middleware : 미들웨어    
- 3.Server actions : 동적 URL 처리    
- 4.RSC : 리액트 서버 컴포넌트  
- 5.RCC : 리액트 클라이언트 컴포넌트  

```
- 1.Router handler : createServerClient (createServerSideClient)
- 2.middleware : createServerClient (createServerSideClientMiddleware)
- 3.Server actions : createServerClient (createServerSideClient)
- 4.RSC : createServerClient (createServerSideClientRSC)
- 5.RCC : createBrowserClient (createSupabaseBrowserClient)
```

### createBrowserClient

```js
// lib/client/supabase.ts
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/supabase";

export const createSupabaseBrowserClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

```

### createServerClient

```js
// lib/supabase.ts
"use server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getCookie, setCookie } from "cookies-next";
import { NextResponse, NextRequest } from "next/server";
import { Database } from "@/types/supabase";

// RouterHandler, RSC, Middleware, ServerActions
// - ServerActions, RouterHandler
export const createServerSideClient = async (serverComponent = false) => {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => cookies().get(key)?.value,
        set: (key, value, options) => {
          if (serverComponent) return;
          cookies().set(key, value, options);
        },
        remove: (key, options) => {
          if (serverComponent) return;
          cookies().set(key, "", options);
        },
      },
    }
  );
};

// RouterHandler, RSC, Middleware, ServerActions
//  - RSC
export const createServerSideClientRSC = async () => {
  return createServerSideClient(true);
};

// RouterHandler, RSC, Middleware, ServerActions
// - Middleware
// - npm i cookies-next
export const createServerSideClientMiddleware = async (
  req: NextRequest,
  res: NextResponse
) => {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => getCookie(key, { req, res }),
        set: (key, value, options) => {
          setCookie(key, value, { req, res, ...options });
        },
        remove: (key, options) => {
          setCookie(key, "", { req, res, ...options });
        },
      },
    }
  );
};

```
#### 미들웨어 createServerSideClientRSC 따로 만든 이유  

- next.js에서 서버측 로직의 마지막 부분인 리액트 서버 컴포넌트 로직 처리 단계에서는   
- 쿠키를 조작(set) 하는것이 불가능하다.   

#### 미들웨어 createServerClient 따로 만든 이유  

미들웨어에서는 쿠키를 request객체안에서 까야한다.  
- import { cookies } from "next/headers"; 에서 가져올 수 없음.. 
- 이 라이브러리 참고 : https://www.npmjs.com/package/cookies-next
- 위 라이브러리 쓰면 어디서든 쿠키를 조작할 수 있다.  
- before code : https://supabase.com/docs/guides/auth/server-side/creating-a-client?environment=middleware


### 트러블슈팅 

- 서버액션을 사용하는데, SSR 과정에서 쿠키를 조작했다.  
- 서버액션을 이곳저곳에서 사용해서 그렇다. ctx라는 변수를 주자.  

```
 ⨯ unhandledRejection: td [Error]: Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value-options
    at Proxy.callable (/Users/dodonet-2/workspace/projects/supabase-next-poc/node_modules/next/dist/compiled/next-server/app-page.runtime.dev.js:36:12724)
```