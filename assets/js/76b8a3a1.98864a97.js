"use strict";(self.webpackChunkdosimpact_blog=self.webpackChunkdosimpact_blog||[]).push([[1144],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>k});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var i=r.createContext({}),u=function(e){var t=r.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},p=function(e){var t=u(e.components);return r.createElement(i.Provider,{value:t},e.children)},c="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,i=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),c=u(n),d=a,k=c["".concat(i,".").concat(d)]||c[d]||m[d]||o;return n?r.createElement(k,s(s({ref:t},p),{},{components:n})):r.createElement(k,s({ref:t},p))}));function k(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,s=new Array(o);s[0]=d;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l[c]="string"==typeof e?e:a,s[1]=l;for(var u=2;u<o;u++)s[u]=n[u];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},7818:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>i,contentTitle:()=>s,default:()=>m,frontMatter:()=>o,metadata:()=>l,toc:()=>u});var r=n(7462),a=(n(7294),n(3905));const o={sidebar_position:2},s="NextJS Essential 2 - ServerLevel",l={unversionedId:"g-fe/next/next002-2",id:"g-fe/next/next002-2",title:"NextJS Essential 2 - ServerLevel",description:"- NextJS Essential 2 - ServerLevel",source:"@site/docs/g-fe/5-next/next002-2.md",sourceDirName:"g-fe/5-next",slug:"/g-fe/next/next002-2",permalink:"/docs/g-fe/next/next002-2",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/g-fe/5-next/next002-2.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"frontEnd",previous:{title:"NextJS Essential 1 - AppRouter,Rendering",permalink:"/docs/g-fe/next/next002-1"},next:{title:"NextJS Essential 3 - Navigating",permalink:"/docs/g-fe/next/next002-3"}},i={},u=[{value:"Server Level Goal",id:"server-level-goal",level:2},{value:"1.Router handler",id:"1router-handler",level:2},{value:"Conventions",id:"conventions",level:3},{value:"GET",id:"get",level:3},{value:"header, cookies",id:"header-cookies",level:4},{value:"Route Segments Paramters, Query Parameters",id:"route-segments-paramters-query-parameters",level:4},{value:"CORS",id:"cors",level:4},{value:"POST",id:"post",level:3},{value:"2.middleware",id:"2middleware",level:2},{value:"3.Server actions",id:"3server-actions",level:2},{value:"&#39;use server&#39;",id:"use-server",level:3},{value:"4.RSC",id:"4rsc",level:2},{value:"RSC with server actions",id:"rsc-with-server-actions",level:3},{value:"metadata",id:"metadata",level:2},{value:"directory custome convention",id:"directory-custome-convention",level:2}],p={toc:u},c="wrapper";function m(e){let{components:t,...n}=e;return(0,a.kt)(c,(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"nextjs-essential-2---serverlevel"},"NextJS Essential 2 - ServerLevel"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#nextjs-essential-2---serverlevel"},"NextJS Essential 2 - ServerLevel"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#server-level-goal"},"Server Level Goal")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#1router-handler"},"1.Router handler"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#conventions"},"Conventions")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#get"},"GET"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#header-cookies"},"header, cookies")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#route-segments-paramters-query-parameters"},"Route Segments Paramters, Query Parameters")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#cors"},"CORS")))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#post"},"POST")))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#2middleware"},"2.middleware")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#3server-actions"},"3.Server actions"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#use-server"},"'use server'")))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#4rsc"},"4.RSC"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#rsc-with-server-actions"},"RSC with server actions")))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#metadata"},"metadata")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#directory-custome-convention"},"directory custome convention"))))),(0,a.kt)("h2",{id:"server-level-goal"},"Server Level Goal"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"1.Router handler : \uc815\uc801 URL \ucc98\ub9ac    "),(0,a.kt)("li",{parentName:"ul"},"2.middleware : \ubbf8\ub4e4\uc6e8\uc5b4  "),(0,a.kt)("li",{parentName:"ul"},"3.Server actions : \ub3d9\uc801 URL \ucc98\ub9ac  "),(0,a.kt)("li",{parentName:"ul"},"4.RSC : with server actions ...  ")),(0,a.kt)("h2",{id:"1router-handler"},"1.Router handler"),(0,a.kt)("h3",{id:"conventions"},"Conventions"),(0,a.kt)("p",null,"\uc5b8\uc81c \uc0ac\uc6a9\ud558\ub294\uac00?  "),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Next.js \uc5d0 REST API \uc815\uc758 (\uc815\uc801 URL\uc5d0 \uc694\uccad\uc744 \ubcf4\ub0bc \ub54c)    "),(0,a.kt)("li",{parentName:"ul"},"\uc608) webhook, callback  ")),(0,a.kt)("p",null,"\uc6a9\ubc95  "),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\uc815\uc758 : app/api \ub514\ub809\ud130\ub9ac\uc5d0 \uc704\uce58    "),(0,a.kt)("li",{parentName:"ul"},"\ub124\uc774\ubc0d \uaddc\uce59 : route.js|ts"),(0,a.kt)("li",{parentName:"ul"},"GET\uacfc \uac19\uc740 method \uc774\ub984 \uc815\uc758\ub41c \ud568\uc218\ub97c export \ud574\uc57c\ud55c\ub2e4.  "),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS  ")))),(0,a.kt)("p",null,"ref : ",(0,a.kt)("a",{parentName:"p",href:"https://nextjs.org/docs/app/building-your-application/routing/route-handlers"},"https://nextjs.org/docs/app/building-your-application/routing/route-handlers")),(0,a.kt)("p",null,"test in chrome  "),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://chromewebstore.google.com/detail/aejoelaoggembcahagimdiliamlcdmfm"},"https://chromewebstore.google.com/detail/aejoelaoggembcahagimdiliamlcdmfm"))),(0,a.kt)("h3",{id:"get"},"GET"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'// TS : app/api/hello/route.ts\nimport { NextResponse } from "next/server";\n\nexport const GET = async () => {\n  // json resposne\n  return NextResponse.json({\n    hello: "true",\n  });\n};\n\n')),(0,a.kt)("h4",{id:"header-cookies"},"header, cookies"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'import { NextResponse } from "next/server";\nimport { cookies, headers } from "next/headers";\n\nexport const GET = async () => {\n  const sig = headers().get("signature"); // get from header \n  const token = cookies().get("token"); // get from client cookies\n\n  // text message resposne\n  return new NextResponse("ok", {\n    status: 200, // status code\n    headers: {\n      foo: "bar", // header\n      "Set-Cookie": `token=${token?.value ? "visited + 1" : "visited"}`, // header(cookie)\n    },\n  });\n};\n')),(0,a.kt)("h4",{id:"route-segments-paramters-query-parameters"},"Route Segments Paramters, Query Parameters"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'// TS : app/api/hello/[id]/route.ts\nimport { NextResponse, NextRequest } from "next/server";\n\ninterface GetParams {\n  params: {\n    id: string;\n  };\n}\n\n// api/hello/123?name=do\nexport const GET = async (request: NextRequest, { params }: GetParams) => {\n  // 1. Dynamic Route Segments > params \n  const searchParams = request.nextUrl.searchParams;\n  // 2. URL Query Parameters\n  const name = searchParams.get("name");\n\n  return NextResponse.json({\n    hello: params.id,\n    name,\n  });\n};\n\n')),(0,a.kt)("h4",{id:"cors"},"CORS"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"export const dynamic = 'force-dynamic' // defaults to auto\n \nexport async function GET(request: Request) {\n  return new Response('Hello, Next.js!', {\n    status: 200,\n    headers: {\n      'Access-Control-Allow-Origin': '*',\n      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',\n      'Access-Control-Allow-Headers': 'Content-Type, Authorization',\n    },\n  })\n}\n")),(0,a.kt)("h3",{id:"post"},"POST"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'\n// form data\nexport async function POST(request: Request) {\n  const formData = await request.formData();\n  const name = formData.get("name");\n  const email = formData.get("email");\n  return NextResponse.json({ name, email });\n}\n\n// json parsing\nexport async function PATCH(request: Request) {\n  const formData = await request.json();\n  const { name, email } = formData;\n  return NextResponse.json({ name, email });\n}\n\n')),(0,a.kt)("h2",{id:"2middleware"},"2.middleware"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'import { NextResponse, NextRequest } from "next/server";\n\nexport function middleware(req: NextRequest) {\n  const res = NextResponse.next();\n  console.log("middleware passed : reqeust pathname", req.nextUrl.pathname);\n  return res;\n}\n\nexport const config = {\n  matcher: "/",\n};\n// npm i cookies-next\n')),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'import { NextResponse, NextRequest } from "next/server";\nimport { supaServerClientMiddleware } from "./lib/supabase";\n\nexport function middleware(req: NextRequest) {\n  const res = NextResponse.next();\n\n  const supabase = supaServerClientMiddleware(req, res);\n  await supabase.auth.getSession();\n\n  return res;\n}\n\nexport const config = {\n  matcher: "/",\n};\n// npm i cookies-next\n')),(0,a.kt)("h2",{id:"3server-actions"},"3.Server actions"),(0,a.kt)("p",null,"\uc6a9\ubc95  "),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\ube44\ub3d9\uae30\ud568\uc218\ub85c \uc815\uc758\ud574\uc57c \ud55c\ub2e4."),(0,a.kt)("li",{parentName:"ul"},"server \uc5d0\uc11c\ub9cc \uc791\ub3d9\ud558\ub294 \ub85c\uc9c1\uc784\uc744 \ubcf4\uc7a5\ud574\uc900\ub2e4.  "),(0,a.kt)("li",{parentName:"ul"},"\ubaa8\ub4c8(\ud30c\uc77c) Level, \uc778\ub77c\uc778 \ud568\uc218 Level\uc5d0\uc11c \uc0ac\uc6a9 \uac00\ub2a5\ud558\ub2e4\ub9cc, \ubaa8\ub4c8Level\uc5d0\uc11c\ub9cc \uc4f0\uace0 \uc2f6\ub2e4.    ")),(0,a.kt)("p",null,"\ubaa9\uc801  "),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"todo\uc815\ubcf4\ub97c DB\uc5d0 \uc800\uc7a5\ud574\uc57c\ud568.  "),(0,a.kt)("li",{parentName:"ul"},"\uae30\uc874\uc5d0\ub294 \ud074\ub77c\uc774\uc5b8\ud2b8\uc5d0\uc11c\ub9cc \ucc98\ub9ac\ud558\ub294 \ub85c\uc9c1 + \uc11c\ubc84\uc5d0\uc11c \ucc98\ub9ac\ud558\ub294 \ub85c\uc9c1 2\uac1c\ub97c \uc9dc\uc57c \ud588\uc74c.  "),(0,a.kt)("li",{parentName:"ul"},"next\uc758 server actions \uc0ac\uc6a9\ud558\uba74 \ud6c4\uc790\ub9cc \uc791\uc131\ud558\uba74 \ub41c\ub2e4.  ")),(0,a.kt)("h3",{id:"use-server"},"'use server'"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"'use server'\ub77c\ub294 \uc9c0\uc2dc\uc5b4\ub97c \ud30c\uc77c \uc704\uc5d0 \uc801\uc5b4\uc8fc\uc790.  ")),(0,a.kt)("p",null,"1.RouterHandler \uc5d0\uc11c \uc0ac\uc6a9 : \ub2f9\uc5f0\ud788 \uc11c\ubc84\uc5d0\uc11c\ub9cc \ub3d9\uc791\ub41c\ub2e4.",(0,a.kt)("br",{parentName:"p"}),"\n","2.\ubbf8\ub4e4\uc6e8\uc5b4 \uc5d0\uc11c \uc0ac\uc6a9 : ok",(0,a.kt)("br",{parentName:"p"}),"\n","3.\uc561\uc158\uc5d0\uc11c \uc0ac\uc6a9 : ok, \uc11c\ubc84\uc5d0\uc11c \ub2e4\ub978 \uc11c\ubc84 \ud568\uc218\ub97c \uc4f0\ub294\uac74 \ubb34\ub9ac \uc5c6\uc74c.",(0,a.kt)("br",{parentName:"p"}),"\n","4.1 \uc11c\ubc84\ucef4\ud3ec\ub10c\ud2b8 \uc5d0\uc11c \uc0ac\uc6a9 : ok",(0,a.kt)("br",{parentName:"p"}),"\n","4.2 \ud074\ub77c\uc774\uc5b8\ud2b8 \ucef4\ud3ec\ub10c\ud2b8\uc5d0\uc11c \uc0ac\uc6a9 : \uac00\ub2a5  "),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\ud558\uc9c0\ub9cc \ud074\ub77c\uc774\uc5b8\ud2b8 \ucef4\ud3ec\ub10c\ud2b8\ub294 async\uac00 \ubd88\uac00\ub2a5 \ud558\ub2e4.  "),(0,a.kt)("li",{parentName:"ul"},"\uadf8\ub798\uc11c useEffect \ub4f1\uc758 \ub77c\uc774\ud504 \uc2f8\uc774\ud074 \uba54\uc11c\ub4dc\ub098 \uc774\ubca4\ud2b8\ub85c \ud638\ucd9c\ud574\uc57c \ud568.  "),(0,a.kt)("li",{parentName:"ul"},"\ube0c\ub77c\uc6b0\uc800\uc5d0\uc11c \uc54c\uc544\uc11c API\uac00 \ub9cc\ub4e4\uc5b4\uc838\uc11c \uc11c\ubc84\ub85c \uac14\ub2e4 \uc628\ub2e4.  ")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'"use server";\nconst todoList = [\n  {\n    id: 1,\n    content: "actions first todo",\n  },\n];\n\n// actions \ub294 \ubaa8\ub450 \ube44\ub3d9\uae30\uc5ec\uc57c \ud55c\ub2e4.\nexport const getTodos = async () => {\n  return todoList;\n};\n\nexport const insertTodo = async (todo) => {\n  todoList.push(todo);\n  return todoList;\n};\n\nexport const deleteTodo = async (id) => {\n  const idx = todoList.findIndex((e) => e?.id === id);\n  if (idx >= 0) todoList.splice(idx, 1);\n  return todoList;\n};\n\n\n')),(0,a.kt)("h2",{id:"4rsc"},"4.RSC"),(0,a.kt)("h3",{id:"rsc-with-server-actions"},"RSC with server actions"),(0,a.kt)("p",null,"\ud074\ub77c\uc774\uc5b8\ud2b8 \ucef4\ud3ec\ub10c\ud2b8\uc5d0\uc11c \uc0ac\uc6a9 : \uac00\ub2a5  "),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\ud558\uc9c0\ub9cc \ud074\ub77c\uc774\uc5b8\ud2b8 \ucef4\ud3ec\ub10c\ud2b8\ub294 async\uac00 \ubd88\uac00\ub2a5 \ud558\ub2e4.  "),(0,a.kt)("li",{parentName:"ul"},"\uadf8\ub798\uc11c useEffect \ub4f1\uc758 \ub77c\uc774\ud504 \uc2f8\uc774\ud074 \uba54\uc11c\ub4dc\ub098 \uc774\ubca4\ud2b8\ub85c \ud638\ucd9c\ud574\uc57c \ud568.  "),(0,a.kt)("li",{parentName:"ul"},"\ube0c\ub77c\uc6b0\uc800\uc5d0\uc11c \uc54c\uc544\uc11c API\uac00 \ub9cc\ub4e4\uc5b4\uc838\uc11c \uc11c\ubc84\ub85c \uac14\ub2e4 \uc628\ub2e4.  ")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'"use client";\nimport React, { useEffect, useState } from "react";\nimport { getTodos, insertTodo, deleteTodo } from "@/store/actions/todo.repo";\n\nconst Todo = () => {\n  const [todoList, setTodoList] = useState([]);\n\n  const clickGetTodo = async () => {\n    const todoList = await getTodos();\n    console.log("--\x3e[clickGetTodo] todoList", todoList);\n    setTodoList(todoList);\n  };\n\n  return (\n    <div>\n      Todo\n      <button className=" bg-pink-400" onClick={clickGetTodo}>\n        get todo\n      </button>\n      <div>\n        <pre>{JSON.stringify(todoList, null, 2)}</pre>\n      </div>\n    </div>\n  );\n};\n\nexport default Todo;\n\n')),(0,a.kt)("hr",null),(0,a.kt)("h2",{id:"metadata"},"metadata"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"icons (TODO)")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'// layout.tsx\nexport const metadata: Metadata = {\n  title: "Spotify",\n  description: "Listen to music",\n};\n')),(0,a.kt)("h2",{id:"directory-custome-convention"},"directory custome convention"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"actions : server actions \ub4e4\uc744 \ub123\ub294 \ud3f4\ub354  \napp : Next App Router\nhooks : hook \ubaa8\uc74c, \ub354 \uc138\ubd84\ud654 \ud574\ub3c4 \uad1c\ucc2e\uc744 \ub4ef  \ncomponents : \uacf5\ud1b5 \ucef4\ud3ec\ub10c\ud2b8 \ubaa8\uc74c, \ub354 \uc138\ubd84\ud654 \ud574\ub3c4 \uad1c\ucc2e\uc744 \ub4ef  \nlibs : Server Side Module, Utils \ub4f1 > \ub354 \uc138\ubd84\ud654 \ud574\ub3c4 \uad1c\ucc2e\uc744 \ub4ef\n- server \uc5d0\uc11c \uc0ac\uc6a9\ud558\ub294 \ubaa8\ub4c8\uc774\ub77c\ub294 \uba85\uc2dc\ub97c \ud558\uba74 \uc88b\uc744 \ub4ef \n- server/utils, server/libs\n- \uc5ec\uae30\uc11c\ub3c4 `use server` \uc0ac\uc6a9\uc774 \uac00\ub2a5\ud55c\uac00? \npublic : \uc815\uc801\ud30c\uc77c \ub9ac\uc18c\uc2a4  \nconstants\n\n")))}m.isMDXComponent=!0}}]);