---
sidebar_position: 10
---

# React-Query with Next.js SSR

- [React-Query with Next.js SSR](#react-query-with-nextjs-ssr)
  - [📌 Install](#-install)
  - [📌 Nextjs Suspense Streaming](#-nextjs-suspense-streaming)
  - [📌 Nextjs App Prefetching](#-nextjs-app-prefetching)


## 📌 Install

```
yarn add @tanstack/react-query @tanstack/react-query-devtools @tanstack/react-query-next-experimental

*추후 experimental 이 빨리 사라졌으면 한다.  
```

```js
// lib/query/get-query-client.ts
import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
```

```js
// app/query-provider.tsx
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as React from "react";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { getQueryClient } from "@/lib/query/get-query-client";

export function QueryProviders(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        {props.children}
      </ReactQueryStreamedHydration>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
---
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProviders>
          {children}
        </QueryProviders>
      </body>
    </html>
  );
}

```

## 📌 Nextjs Suspense Streaming  

```js
//MyComponent.tsx
"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

function useWaitQuery(props: { wait: number }) {
  const query = useSuspenseQuery({
    queryKey: ["wait", props.wait],
    queryFn: async () => {
      const path = `/api/wait?wait=${props.wait}`;
      const url = "http://localhost:3000" + path;

      const res: string = await (
        await fetch(url, {
          cache: "no-store",
        })
      ).json();
      return res;
    },
  });

  return [query.data as string, query] as const;
}

export function MyComponent(props: { wait: number }) {
  const [data] = useWaitQuery(props);

  return <div>result: {data}</div>;
}

export function ConditionalShow(props: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);

  return (
    <div>
      {show ? props.children : null}
      <button onClick={() => setShow(true)}>Show</button>
    </div>
  );
}

```


흐름
- 1.`useSuspenseQuery` 을 이용하기 위해 Suspense 컴포넌트로 감싼다.  
- 2.`Suspense` 스트리밍 랜더링의 플로우를 따른다.  
- 3.React-Query도 위 스트리밍 랜더링의 플로우를 따르면서 데이터 패칭 및 캐시 라이프 싸이클 관리가 된다. 

```js
//app/test/query-test/page.tsx
import { getQueryClient } from "@/lib/query/get-query-client";
import { Suspense } from "react";
import { ConditionalShow, MyComponent } from "./components/MyComponent";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function MyPage() {
  return (
    <>
      <MyComponent wait={100} />

      <Suspense fallback={<div>waiting 100....</div>}>
        <MyComponent wait={100} />
      </Suspense>
      <Suspense fallback={<div>waiting 200....</div>}>
        <MyComponent wait={200} />
      </Suspense>
      <Suspense fallback={<div>waiting 300....</div>}>
        <MyComponent wait={300} />
      </Suspense>
      <Suspense fallback={<div>waiting 400....</div>}>
        <MyComponent wait={400} />
      </Suspense>
      <Suspense fallback={<div>waiting 500....</div>}>
        <MyComponent wait={500} />
      </Suspense>
      <Suspense fallback={<div>waiting 600....</div>}>
        <MyComponent wait={600} />
      </Suspense>
      <ConditionalShow>
          <Suspense fallback={<div>waiting 5000....</div>}>
            <MyComponent wait={5000} />
          </Suspense>
      </ConditionalShow>

      <fieldset>
        <legend>
          combined <code>Suspense</code>-container
        </legend>
        <Suspense
          fallback={
            <>
              <div>waiting 800....</div>
              <div>waiting 900....</div>
              <div>waiting 8000....</div>
            </>
          }
        >
          <MyComponent wait={800} />
          <MyComponent wait={900} />
          <MyComponent wait={8000} />
        </Suspense>
      </fieldset>
    </>
  );
}
```

## 📌 Nextjs App Prefetching    

흐름
- 1.`const queryClient = getQueryClient();` 쿼리 클라이언트를 가져와서
- 2.`await queryClient.prefetchQuery` 프리패칭을 한다.  
- 3.`<HydrationBoundary state={dehydrate(queryClient)}>`  dehydrate 으로 서버 사이드의 데이터패칭을 재활용한다.
- *client-side-query-client에 주입  
- 결과로 waiting 5000 없이 바로 랜더링 된다.   
- 4. HydrationBoundary 바운더리 외에서도 queryClient의 데이터를 재활용 할수 있다.  

장점  
- SEO에 데이터 노출됨. 그 노출된 데이터를 재사용한다.  
- (prefetch - dehydrate ) 과정이 없다면 API를 2번 호출하겠지.  

```js
import { getQueryClient } from "@/lib/query/get-query-client";
import { Suspense } from "react";
import { ConditionalShow, MyComponent } from "./components/MyComponent";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function MyPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["wait", 5000],
    queryFn: async () => {
      return "waited 5000ms";
    },
  });

  return (
    <>
      <MyComponent wait={100} />
        ....
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ConditionalShow>
          <Suspense fallback={<div>waiting 5000....</div>}>
            <MyComponent wait={5000} />
          </Suspense>
        </ConditionalShow>
      </HydrationBoundary>
      ...
    </>
  );
}
```
