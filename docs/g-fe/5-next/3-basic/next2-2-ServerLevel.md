---
sidebar_position: 2
---

# NextJS Essential 2 - ServerLevel

- [NextJS Essential 2 - ServerLevel](#nextjs-essential-2---serverlevel)
  - [Server Level Goal](#server-level-goal)
  - [1.Router handler](#1router-handler)
    - [Conventions](#conventions)
    - [GET](#get)
      - [header, cookies](#header-cookies)
      - [Route Segments Paramters, Query Parameters](#route-segments-paramters-query-parameters)
      - [CORS](#cors)
    - [POST](#post)
  - [2.Middleware](#2middleware)
      - [Basic](#basic)
      - [eg) supaServerClientMiddleware](#eg-supaserverclientmiddleware)
      - [eg) cookie counter](#eg-cookie-counter)
  - [3.Server actions](#3server-actions)
    - ['use server'](#use-server)
    - [use server vs server-only](#use-server-vs-server-only)
  - [4.RSC](#4rsc)
    - [RSC with server actions](#rsc-with-server-actions)
  - [metadata](#metadata)
  - [directory custome convention](#directory-custome-convention)


## Server Level Goal  

- 1.Router handler : 정적 URL 처리    
- 2.middleware : 미들웨어  
- 3.Server actions : 동적 URL 처리  
- 4.RSC : with server actions ...  

![Alt text](image-1.png)

- Best Practice를 찾으면 좋겠으나, next.js를 서버의 관점에서 본다면  
- 위 그림처럼 대하는게 편하다..  
- 중앙의 Controller의 확장 개념으로, Renderer 를 본다.  
- gRPC, GraphQL, webSocket 등 요청의 시작 포인트 Level  

## 1.Router handler

### Conventions

언제 사용하는가?  
- Next.js 에 REST API 정의 (정적 URL에 요청을 보낼 때)    
- 예) webhook, callback  

용법  
- 정의 : app/api 디렉터리에 위치    
- 네이밍 규칙 : route.js|ts
- GET과 같은 method 이름 정의된 함수를 export 해야한다.  
- * GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS  

ref : https://nextjs.org/docs/app/building-your-application/routing/route-handlers

test in chrome  
- https://chromewebstore.google.com/detail/aejoelaoggembcahagimdiliamlcdmfm


### GET 

```js
// TS : app/api/hello/route.ts
import { NextResponse } from "next/server";

export const GET = async () => {
  // json resposne
  return NextResponse.json({
    hello: "true",
  });
};

```

#### header, cookies

```js
import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

export const GET = async () => {
  const sig = headers().get("signature"); // get from header 
  const token = cookies().get("token"); // get from client cookies

  // text message resposne
  return new NextResponse("ok", {
    status: 200, // status code
    headers: {
      foo: "bar", // header
      "Set-Cookie": `token=${token?.value ? "visited + 1" : "visited"}`, // header(cookie)
    },
  });
};
```

#### Route Segments Paramters, Query Parameters

```js
// TS : app/api/hello/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";

interface GetParams {
  params: {
    id: string;
  };
}

// api/hello/123?name=do
export const GET = async (request: NextRequest, { params }: GetParams) => {
  // 1. Dynamic Route Segments > params 
  const searchParams = request.nextUrl.searchParams;
  // 2. URL Query Parameters
  const name = searchParams.get("name");

  return NextResponse.json({
    hello: params.id,
    name,
  });
};

```

#### CORS 

```js
export const dynamic = 'force-dynamic' // defaults to auto
 
export async function GET(request: Request) {
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
```

### POST

```js

// form data
export async function POST(request: Request) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  return NextResponse.json({ name, email });
}

// json parsing
export async function PATCH(request: Request) {
  const formData = await request.json();
  const { name, email } = formData;
  return NextResponse.json({ name, email });
}

```

## 2.Middleware

>https://nextjs.org/docs/app/building-your-application/routing/middleware#convention

middleware 활용법 : [The user experience of the Frontend Cloud](https://vercel.com/blog/the-user-experience-of-the-frontend-cloud#edge-functions-and-middleware)


![alt](https://vercel.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F7aSNr7ss5428amGZULhEK8%2F7c9e27a2f990ab84ca1e7643b29a9407%2Fimage.png&w=1920&q=75&dpl=dpl_uYiozXFSsKjgQmLucVaDvW7A2jtG)

#### Basic  

- 모든 요청을 통과하는 미들웨어 입니다.  

```js
// Use the file middleware.ts (or .js) in the root  
import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  console.log("middleware passed : reqeust pathname", req.nextUrl.pathname);
  return res;
}

export const config = {2
  matcher: [
    "/", // only root
    "/api/(.*)"
  ]  
};
```

#### eg) supaServerClientMiddleware  

```js
import { NextResponse, NextRequest } from "next/server";
import { createServerSideMiddleware } from "./lib/supabase/supabase";
import { User } from "@supabase/supabase-js";

export interface AuthedNextRequest extends NextRequest {
  user?: User | undefined;
}

export async function middleware(req: AuthedNextRequest) {
  const res = NextResponse.next();

  const supabase = await createServerSideMiddleware(req, res);
  const userResponse = await supabase.auth.getUser();

  // req.user = user , 이런 방식으로 조작한 req 객체를 뒷단에 전달할수 없다. 
  if (userResponse?.data?.user) {
    res.headers.set("x-authenticated", "1"); // 비표준 헤더는 x-를 붙이는 컨벤션  
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * BlackListing
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
```

#### eg) cookie counter

cookie 조작해보기 

```
  request.cookies.delete("vercel");
  request.cookies.get("vercel");
  request.cookies.getAll();
  request.cookies.has("vercel");
  request.cookies.set("vercel", "slow");

  response.cookies.delete("vercel");
  response.cookies.get("vercel");
  response.cookies.getAll();
  response.cookies.has("vercel");
  response.cookies.set("vercel", "slow");
```


```js
import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (request.cookies.get("cookie-counter")?.value) {
    const prev = request.cookies.get("cookie-counter")?.value;
    response.cookies.set("cookie-counter", `${Number(prev) + 1}`);
  } else {
    response.cookies.set("cookie-counter", "1");
  }

  return response;
}

export const config = {
  matcher: "/",
};

```


## 3.Server actions  

"use server"가 필요한 경우:  
- 서버에서만 실행되어야 하는 함수 (예: 데이터베이스 접근, 파일 시스템 접근)
- 클라이언트에서 호출되는 서버 액션

"use server"가 불필요한 경우:
- 단순한 유틸리티 함수, 환경변수 반환, 계산 로직  

"use server" 지시어     
- "use server" 지시어가 있는 파일은 비동기함수만 export 해야 한다.  
- server 에서만 작동하는 로직임을 보장해준다.  
- 모듈(파일) Level, 인라인 함수 Level에서 사용 가능하다만, 모듈Level에서만 쓰고 싶다.    

사례  
- 예를들어 todo정보를 DB에 저장해야하는 경우  
- 기존에는 클라이언트에서만 처리하는 로직 + 서버에서 처리하는 로직 2개를 짜야 했음.  
- 근데 next의 server actions 사용하면 후자만 작성하고 이를 클라이언트에서 호출하면 된다.    

주의  
- "use server" 지시어를 쓰고 상수를 export하면 안된다. 이는 잠재적으로 클라이언트에서 문자열을 가져올수있다? 라는 오류이다.  

### 'use server'
- 'use server'라는 지시어를 파일 위에 적어주자.  

1.RouterHandler 에서 사용 : 당연히 서버에서만 동작된다.  
2.미들웨어 에서 사용 : ok  
3.액션에서 사용 : ok, 서버에서 다른 서버 함수를 쓰는건 무리 없음.   
4.1 서버컴포넌트 에서 사용 : ok  
4.2 클라이언트 컴포넌트에서 사용 : 가능  
  - 하지만 클라이언트 컴포넌트는 async가 불가능 하다.  
  - 그래서 useEffect 등의 라이프 싸이클 메서드나 이벤트로 호출해야 함.  
  - 브라우저에서 알아서 API가 만들어져서 서버로 갔다 온다.  

```js
"use server";
const todoList = [
  {
    id: 1,
    content: "actions first todo",
  },
];

// actions 는 모두 비동기여야 한다.
export const getTodos = async () => {
  return todoList;
};

export const insertTodo = async (todo) => {
  todoList.push(todo);
  return todoList;
};

export const deleteTodo = async (id) => {
  const idx = todoList.findIndex((e) => e?.id === id);
  if (idx >= 0) todoList.splice(idx, 1);
  return todoList;
};

```


### use server vs server-only

"use server" for allowing client to call the function to be turned into an endpoint.
- 서버 액션으로 함수를 사용하려면 'use server' 디렉티브를 사용해야 한다.  
- 1.함수를 클라이언트에서 원격으로 부를 수 있도록 뚫어주는 역할을 하면서,  
- 2.함수를 클라이언트에서 서버로 옮기는 기능으로도 보여진다.    

"server-only" prevents it being shared to the client if imported.   
- import "server-only" 모듈로 반드시 서버에서만 동작하는 모듈을 정의한다.  



## 4.RSC 


### RSC with server actions

클라이언트 컴포넌트에서 사용 : 가능  
  - 하지만 클라이언트 컴포넌트는 async가 불가능 하다.  
  - 그래서 useEffect 등의 라이프 싸이클 메서드나 이벤트로 호출해야 함.  
  - 브라우저에서 알아서 API가 만들어져서 서버로 갔다 온다.  


```js
"use client";
import React, { useEffect, useState } from "react";
import { getTodos, insertTodo, deleteTodo } from "@/store/actions/todo.repo";

const Todo = () => {
  const [todoList, setTodoList] = useState([]);

  const clickGetTodo = async () => {
    const todoList = await getTodos();
    console.log("-->[clickGetTodo] todoList", todoList);
    setTodoList(todoList);
  };

  return (
    <div>
      Todo
      <button className=" bg-pink-400" onClick={clickGetTodo}>
        get todo
      </button>
      <div>
        <pre>{JSON.stringify(todoList, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Todo;

```

---

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



