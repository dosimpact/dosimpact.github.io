"use strict";(self.webpackChunkdosimpact_blog=self.webpackChunkdosimpact_blog||[]).push([[8986],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>g});var a=n(67294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),u=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=u(e.components);return a.createElement(l.Provider,{value:t},e.children)},c="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),c=u(n),d=r,g=c["".concat(l,".").concat(d)]||c[d]||m[d]||o;return n?a.createElement(g,i(i({ref:t},p),{},{components:n})):a.createElement(g,i({ref:t},p))}));function g(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[c]="string"==typeof e?e:r,i[1]=s;for(var u=2;u<o;u++)i[u]=n[u];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},40133:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>m,frontMatter:()=>o,metadata:()=>s,toc:()=>u});var a=n(87462),r=(n(67294),n(3905));const o={sidebar_position:2},i="NextJS Essential 3 - Navigating",s={unversionedId:"g-fe/next/next2-3-Navigating",id:"g-fe/next/next2-3-Navigating",title:"NextJS Essential 3 - Navigating",description:"- NextJS Essential 3 - Navigating",source:"@site/docs/g-fe/5-next/next2-3-Navigating.md",sourceDirName:"g-fe/5-next",slug:"/g-fe/next/next2-3-Navigating",permalink:"/docs/g-fe/next/next2-3-Navigating",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/g-fe/5-next/next2-3-Navigating.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"frontEnd",previous:{title:"NextJS Essential 2 - ServerLevel",permalink:"/docs/g-fe/next/next2-2-ServerLevel"},next:{title:"NextJS Clone Spotify",permalink:"/docs/g-fe/next/next3-spotify-stack"}},l={},u=[{value:"Linking and Navigating",id:"linking-and-navigating",level:2},{value:"Link Component",id:"link-component",level:3},{value:"useRouter",id:"userouter",level:3},{value:"Server",id:"server",level:2},{value:"redirect",id:"redirect",level:3},{value:"permanentRedirect",id:"permanentredirect",level:3},{value:"Client",id:"client",level:2},{value:"useRouter",id:"userouter-1",level:3},{value:"useParams",id:"useparams",level:3},{value:"usePathname, useSearchParams",id:"usepathname-usesearchparams",level:3},{value:"notfound",id:"notfound",level:3},{value:"Server Routes \ud0c0\uc785\ubcc4 \ub79c\ub354\ub9c1",id:"server-routes-\ud0c0\uc785\ubcc4-\ub79c\ub354\ub9c1",level:2},{value:"Dynamic Routes (SSR)",id:"dynamic-routes-ssr",level:3},{value:"generateStaticParams (SSG)",id:"generatestaticparams-ssg",level:3},{value:"Parallel Routes",id:"parallel-routes",level:3},{value:"Intercepting Routes",id:"intercepting-routes",level:3}],p={toc:u},c="wrapper";function m(e){let{components:t,...n}=e;return(0,r.kt)(c,(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"nextjs-essential-3---navigating"},"NextJS Essential 3 - Navigating"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#nextjs-essential-3---navigating"},"NextJS Essential 3 - Navigating"),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#linking-and-navigating"},"Linking and Navigating"),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#link-component"},"Link Component")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#userouter"},"useRouter")))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#server"},"Server"),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#redirect"},"redirect")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#permanentredirect"},"permanentRedirect")))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#client"},"Client"),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#userouter-1"},"useRouter")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#useparams"},"useParams")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#usepathname-usesearchparams"},"usePathname, useSearchParams")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#notfound"},"notfound")))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#server-routes-%ED%83%80%EC%9E%85%EB%B3%84-%EB%9E%9C%EB%8D%94%EB%A7%81"},"Server Routes \ud0c0\uc785\ubcc4 \ub79c\ub354\ub9c1"),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#dynamic-routes-ssr"},"Dynamic Routes (SSR)")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#generatestaticparams-ssg"},"generateStaticParams (SSG)")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#parallel-routes"},"Parallel Routes")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#intercepting-routes"},"Intercepting Routes"))))))),(0,r.kt)("hr",null),(0,r.kt)("h2",{id:"linking-and-navigating"},"Linking and Navigating"),(0,r.kt)("p",null,"ref : ",(0,r.kt)("a",{parentName:"p",href:"https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating"},"https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating")),(0,r.kt)("h3",{id:"link-component"},"Link Component"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"import Link from 'next/link'\n \nexport default function Page() {\n  return <Link href=\"/dashboard\">Dashboard</Link>\n}\n\n")),(0,r.kt)("h3",{id:"userouter"},"useRouter"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"'use client' \uc744 \uc368\uc57c \ub41c\ub2e4. > useRouter "))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"Server Components, you would redirect() instead."))),(0,r.kt)("li",{parentName:"ul"},"cf) next/router \uc740 \uc0ac\uc6a9\ud558\uc9c0 \uc54a\ub294\ub2e4.  ")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"'use client'\n\nimport { useRouter } from 'next/navigation'\n\nexport default function Page() {\n  const router = useRouter()\n \n  return (\n    <button type=\"button\" onClick={() => router.push('/dashboard')}>\n      Dashboard\n    </button>\n  )\n}\n")),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://nextjs.org/docs/app/api-reference/functions/use-router"},"https://nextjs.org/docs/app/api-reference/functions/use-router")),(0,r.kt)("h2",{id:"server"},"Server"),(0,r.kt)("p",null,"\uc11c\ubc84\uce21\uc5d0\uc11c Route \ubcc0\uacbd\ud560\ub54c\ub294 \uc544\ub798 \ud568\uc218\ub97c \uc0ac\uc6a9\ud55c\ub2e4.",(0,r.kt)("br",{parentName:"p"}),"\n","Server Components, Route Handlers, Server Actions \uc0ac\uc6a9 \uac00\ub2a5"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"redirect"),(0,r.kt)("li",{parentName:"ul"},"permanentRedirect ")),(0,r.kt)("h3",{id:"redirect"},"redirect"),(0,r.kt)("blockquote",null,(0,r.kt)("blockquote",{parentName:"blockquote"},(0,r.kt)("p",{parentName:"blockquote"},(0,r.kt)("a",{parentName:"p",href:"https://nextjs.org/docs/app/api-reference/functions/redirect"},"https://nextjs.org/docs/app/api-reference/functions/redirect")))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"// eg) \uc11c\ubc84 \ucef4\ud3ec\ub10c\ud2b8\uc5d0\uc11c \ub370\uc774\ud130\uac00 \uc5c6\ub294 \uacbd\uc6b0 redirect\nimport { redirect } from 'next/navigation'\n \nasync function fetchTeam(id) {\n  const res = await fetch('https://...')\n  if (!res.ok) return undefined\n  return res.json()\n}\n \nexport default async function Profile({ params }) {\n  const team = await fetchTeam(params.id)\n  if (!team) {\n    redirect('/login')\n  }\n}\n")),(0,r.kt)("h3",{id:"permanentredirect"},"permanentRedirect"),(0,r.kt)("blockquote",null,(0,r.kt)("blockquote",{parentName:"blockquote"},(0,r.kt)("p",{parentName:"blockquote"},(0,r.kt)("a",{parentName:"p",href:"https://nextjs.org/docs/app/api-reference/functions/permanentRedirect"},"https://nextjs.org/docs/app/api-reference/functions/permanentRedirect")))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"// eg) \uc0ac\uc6a9\uc790 \uc815\ubcf4 \uc5c5\ub370\uc774\ud2b8 > \uce90\uc2dc revalidate > redirect\n'use server'\nimport { permanentRedirect } from 'next/navigation'\nimport { revalidateTag } from 'next/cache'\n \nexport async function updateUsername(username: string, formData: FormData) {\n  try {\n    // Call database\n  } catch (error) {\n    // Handle errors\n  }\n \n  revalidateTag('username') // Update all references to the username\n  permanentRedirect(`/profile/${username}`) // Navigate to the new user profile\n}\n----\n// eg) DB, API \uc870\ud68c \ud6c4 \ub370\uc774\ud130\uac00 \uc5c6\uc73c\uba74 /\uc73c\ub85c \ub9ac\ub2e4\uc774\ub809\ud2b8 ( NOT FOUND \ub300\uc2e0 \ud648\uc73c\ub85c \uc774\ub3d9 \uc2dc\ud0a4\uace0 \uc2f6\uc740 \uacbd\uc6b0 ) \nexport default async function Playlist(props) {\n  const { params, searchParams } = props;\n  const playList = await getPlayListFromServer(searchParams?.list);\n  if (!playList) permanentRedirect(`/`); // Navigate to the new user profile\n  ...\n}\n")),(0,r.kt)("h2",{id:"client"},"Client"),(0,r.kt)("p",null,"\ud074\ub77c\uc774\uc5b8\ud2b8 \ucef4\ud3ec\ub10c\ud2b8\uc5d0\uc11c \uc0ac\uc6a9\ud560 \uc218 \uc788\ub294 \ud6c5\ub4e4\uc774\ub2e4.  "),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"useRouter"),(0,r.kt)("li",{parentName:"ul"},"useParams"),(0,r.kt)("li",{parentName:"ul"},"usePathname"),(0,r.kt)("li",{parentName:"ul"},"useSearchParams")),(0,r.kt)("h3",{id:"userouter-1"},"useRouter"),(0,r.kt)("blockquote",null,(0,r.kt)("blockquote",{parentName:"blockquote"},(0,r.kt)("p",{parentName:"blockquote"},(0,r.kt)("a",{parentName:"p",href:"https://nextjs.org/docs/app/api-reference/functions/use-router"},"https://nextjs.org/docs/app/api-reference/functions/use-router")))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"'use client'\nimport { useRouter } from 'next/navigation'\n \nexport default function Page() {\n  const router = useRouter()\n \n  return (\n    <button type=\"button\" onClick={() => router.push('/dashboard')}>\n      Dashboard\n    </button>\n  )\n}\n")),(0,r.kt)("h3",{id:"useparams"},"useParams"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"'use client'\n \nimport { useParams } from 'next/navigation'\n \nexport default function ExampleClientComponent() {\n  const params = useParams<{ tag: string; item: string }>()\n  // Route -> /shop/[tag]/[item]\n  // URL -> /shop/shoes/nike-air-max-97\n  // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }\n  console.log(params)\n \n  return <></>\n}\n")),(0,r.kt)("h3",{id:"usepathname-usesearchparams"},"usePathname, useSearchParams"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"'use client'\n\nimport { usePathname, useSearchParams } from 'next/navigation'\n \nfunction ExampleClientComponent() {\n  const pathname = usePathname()\n  // URL      >>. Returned value\n  // /dashboard?v=2  >>   '/dashboard'\n  // /blog/hello-world  >>  '/blog/hello-world'\n\n  function switchLocale(locale: string) {\n    // e.g. '/en/about' or '/fr/contact'\n    const newPath = `/${locale}${pathname}`\n    window.history.replaceState(null, '', newPath)\n  }\n\n  // URL -> `/dashboard?search=my-project`\n  // `search` -> 'my-project'\n  const searchParams = useSearchParams()\n  const search = searchParams.get('search')\n}\n")),(0,r.kt)("h3",{id:"notfound"},"notfound"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"\uc801\uc808\ud55c \ub9ac\uc18c\uc2a4\uac00 \uc5c6\ub294 \uacbd\uc6b0, 404 not found \ud398\uc774\uc9c0\ub85c \uc774\ub3d9\ud55c\ub2e4.  ")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'// [product-id]/not-found.tsx\nimport { Button } from "@/components/ui/button";\nimport Link from "next/link";\n\nexport default function NotFound() {\n  return (\n    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">\n      <h1 className="text-4xl font-bold mb-4">\ud398\uc774\uc9c0\ub97c \ucc3e\uc744 \uc218 \uc5c6\uc5b4\uc694</h1>\n      <p className="text-xl mb-8">\ucc3e\uace0 \uacc4\uc2e0 \ud398\uc774\uc9c0\uac00 \uc874\uc7ac\ud558\uc9c0 \uc54a\uc544\uc694.</p>\n      <Button asChild>\n        <Link href="/">\ud648\uc73c\ub85c \ub3cc\uc544\uac00\uae30</Link>\n      </Button>\n    </div>\n  );\n}\n\n---\n// [product-id]/page.tsx\nimport { notFound } from "next/navigation";\n\nexport default async function Page({ params }: PageProps) {\n  const productId = params?.["product-id"];\n  const product = await getProductById(Number(productId));\n\n  if (!product) notFound();\n\n  return (\n    <div>\n      <ProductDetail product={product} />\n    </div>\n  );\n}\n\n')),(0,r.kt)("h2",{id:"server-routes-\ud0c0\uc785\ubcc4-\ub79c\ub354\ub9c1"},"Server Routes \ud0c0\uc785\ubcc4 \ub79c\ub354\ub9c1"),(0,r.kt)("h3",{id:"dynamic-routes-ssr"},"Dynamic Routes (SSR)"),(0,r.kt)("blockquote",null,(0,r.kt)("blockquote",{parentName:"blockquote"},(0,r.kt)("p",{parentName:"blockquote"},(0,r.kt)("a",{parentName:"p",href:"https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#example"},"https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#example")))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'interface LibraryProps {\n  params: {\n    id: string;\n  };\n}\n\nconst sleep = async (ms) => new Promise((res) => setTimeout(res, ms));\n\nexport default async function Library({ params }: LibraryProps) {\n  console.log("--\x3eparams.id", params.id);\n  await sleep(2500);\n  console.log("--\x3e get some data from server");\n  return (<div />)\n}\n')),(0,r.kt)("h3",{id:"generatestaticparams-ssg"},"generateStaticParams (SSG)"),(0,r.kt)("blockquote",null,(0,r.kt)("blockquote",{parentName:"blockquote"},(0,r.kt)("p",{parentName:"blockquote"},(0,r.kt)("a",{parentName:"p",href:"https://nextjs.org/docs/app/api-reference/functions/generate-static-params"},"https://nextjs.org/docs/app/api-reference/functions/generate-static-params")))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"// app/blog/[slug]/page.js\n\n// Return a list of `params` to populate the [slug] dynamic segment\nexport async function generateStaticParams() {\n  const posts = await fetch('https://.../posts').then((res) => res.json())\n  return posts.map((post) => ({    slug: post.slug,  }))\n}\n \n// Multiple versions of this page will be statically generated\n// using the `params` returned by `generateStaticParams`\nexport default function Page({ params }) {\n  const { slug } = params\n  // ...\n}\n")),(0,r.kt)("h3",{id:"parallel-routes"},"Parallel Routes"),(0,r.kt)("blockquote",null,(0,r.kt)("blockquote",{parentName:"blockquote"},(0,r.kt)("p",{parentName:"blockquote"},(0,r.kt)("a",{parentName:"p",href:"https://nextjs.org/docs/app/building-your-application/routing/parallel-routes"},"https://nextjs.org/docs/app/building-your-application/routing/parallel-routes")))),(0,r.kt)("p",null,(0,r.kt)("img",{parentName:"p",src:"https://nextjs.org/_next/image?url=%2Fdocs%2Fdark%2Fparallel-routes.png&w=1920&q=75&dpl=dpl_9x7y4B6Nva5cXpJSPhtT4qqxdyr3",alt:"alt"})),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"")),(0,r.kt)("h3",{id:"intercepting-routes"},"Intercepting Routes"),(0,r.kt)("blockquote",null,(0,r.kt)("blockquote",{parentName:"blockquote"},(0,r.kt)("p",{parentName:"blockquote"},(0,r.kt)("a",{parentName:"p",href:"https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes"},"https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes")))))}m.isMDXComponent=!0}}]);