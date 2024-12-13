---
sidebar_position: 2
---

# NextJS Essential 3 - Navigating

- [NextJS Essential 3 - Navigating](#nextjs-essential-3---navigating)
  - [Linking and Navigating](#linking-and-navigating)
    - [Link Component](#link-component)
  - [Server](#server)
    - [redirect](#redirect)
    - [permanentRedirect](#permanentredirect)
  - [Client](#client)
    - [useRouter](#userouter)
    - [useParams](#useparams)
    - [usePathname, useSearchParams](#usepathname-usesearchparams)
    - [notfound](#notfound)
  - [Window](#window)
    - [replaceState](#replacestate)
  - [Server Routes 타입별 랜더링](#server-routes-타입별-랜더링)
    - [Dynamic Routes (SSR)](#dynamic-routes-ssr)
    - [generateStaticParams (SSG)](#generatestaticparams-ssg)
    - [Parallel Routes](#parallel-routes)
    - [Intercepting Routes](#intercepting-routes)

---

## Linking and Navigating

ref : https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating



### Link Component

```js
import Link from 'next/link'
 
export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}

```


## Server

서버측에서 Route 변경할때는 아래 함수를 사용한다.   
Server Components, Route Handlers, Server Actions 사용 가능
- redirect
- permanentRedirect 

### redirect

>>https://nextjs.org/docs/app/api-reference/functions/redirect

```js
// eg) 서버 컴포넌트에서 데이터가 없는 경우 redirect
import { redirect } from 'next/navigation'
 
async function fetchTeam(id) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}
 
export default async function Profile({ params }) {
  const team = await fetchTeam(params.id)
  if (!team) {
    redirect('/login')
  }
}
```

### permanentRedirect

>>https://nextjs.org/docs/app/api-reference/functions/permanentRedirect

```js
// eg) 사용자 정보 업데이트 > 캐시 revalidate > redirect
'use server'
import { permanentRedirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'
 
export async function updateUsername(username: string, formData: FormData) {
  try {
    // Call database
  } catch (error) {
    // Handle errors
  }
 
  revalidateTag('username') // Update all references to the username
  permanentRedirect(`/profile/${username}`) // Navigate to the new user profile
}
----
// eg) DB, API 조회 후 데이터가 없으면 /으로 리다이렉트 ( NOT FOUND 대신 홈으로 이동 시키고 싶은 경우 ) 
export default async function Playlist(props) {
  const { params, searchParams } = props;
  const playList = await getPlayListFromServer(searchParams?.list);
  if (!playList) permanentRedirect(`/`); // Navigate to the new user profile
  ...
}
```


## Client 

클라이언트 컴포넌트에서 사용할 수 있는 훅들이다.  
- useRouter
- useParams
- usePathname
- useSearchParams

### useRouter

>> https://nextjs.org/docs/app/api-reference/functions/use-router

- * 'use client' 을 써야 된다. > useRouter 
- * Server Components, you would redirect() instead.
- cf) next/router 은 사용하지 않는다.  


```js
// eg) navigate another page 
'use client'
import { useRouter } from 'next/navigation'
 
export default function Page() {
  const router = useRouter()
  // router.push  
  // router.replace
  // router.back
  // router.
 
  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      Dashboard
    </button>
  )
}
```

```js
// eg) navigate external page
<Link
   className="font-medium underline underline-offset-4"
   href="https://github.com/vercel/ai-chatbot"
   target="_blank"
 >
   open source
 </Link>{" "}
```



### useParams

```js
'use client'
 
import { useParams } from 'next/navigation'
 
export default function ExampleClientComponent() {
  const params = useParams<{ tag: string; item: string }>()
  // Route -> /shop/[tag]/[item]
  // URL -> /shop/shoes/nike-air-max-97
  // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }
  console.log(params)
 
  return <></>
}
```

### usePathname, useSearchParams

```js
'use client'

import { usePathname, useSearchParams } from 'next/navigation'
 
function ExampleClientComponent() {
  const pathname = usePathname()
  // URL	  >>. Returned value
  // /dashboard?v=2	 >>   '/dashboard'
  // /blog/hello-world	>>  '/blog/hello-world'

  function switchLocale(locale: string) {
    // e.g. '/en/about' or '/fr/contact'
    const newPath = `/${locale}${pathname}`
    window.history.replaceState(null, '', newPath)
  }

  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
  const searchParams = useSearchParams()
  const search = searchParams.get('search')
}
```

### notfound
- 적절한 리소스가 없는 경우, 404 not found 페이지로 이동한다.  

```js
// [product-id]/not-found.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-4">페이지를 찾을 수 없어요</h1>
      <p className="text-xl mb-8">찾고 계신 페이지가 존재하지 않아요.</p>
      <Button asChild>
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </div>
  );
}

---
// [product-id]/page.tsx
import { notFound } from "next/navigation";

export default async function Page({ params }: PageProps) {
  const productId = params?.["product-id"];
  const product = await getProductById(Number(productId));

  if (!product) notFound();

  return (
    <div>
      <ProductDetail product={product} />
    </div>
  );
}

```

## Window

### replaceState

```js
window.history.replaceState({}, "", `/chat/${chatId}`);
```

## Server Routes 타입별 랜더링  

### Dynamic Routes (SSR)

>> https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#example

```js
interface LibraryProps {
  params: {
    id: string;
  };
}

const sleep = async (ms) => new Promise((res) => setTimeout(res, ms));

export default async function Library({ params }: LibraryProps) {
  console.log("-->params.id", params.id);
  await sleep(2500);
  console.log("--> get some data from server");
  return (<div />)
}
```

### generateStaticParams (SSG)

>>https://nextjs.org/docs/app/api-reference/functions/generate-static-params

```js
// app/blog/[slug]/page.js

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())
  return posts.map((post) => ({    slug: post.slug,  }))
}
 
// Multiple versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
export default function Page({ params }) {
  const { slug } = params
  // ...
}
```

### Parallel Routes

>> https://nextjs.org/docs/app/building-your-application/routing/parallel-routes

![alt](https://nextjs.org/_next/image?url=%2Fdocs%2Fdark%2Fparallel-routes.png&w=1920&q=75&dpl=dpl_9x7y4B6Nva5cXpJSPhtT4qqxdyr3)

```js

```


### Intercepting Routes

>> https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes



