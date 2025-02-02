"use strict";(self.webpackChunkdosimpact_blog=self.webpackChunkdosimpact_blog||[]).push([[6183],{3905:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>k});var a=n(67294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=a.createContext({}),u=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},s=function(e){var t=u(e.components);return a.createElement(p.Provider,{value:t},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,p=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),c=u(n),m=r,k=c["".concat(p,".").concat(m)]||c[m]||d[m]||l;return n?a.createElement(k,o(o({ref:t},s),{},{components:n})):a.createElement(k,o({ref:t},s))}));function k(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,o=new Array(l);o[0]=m;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i[c]="string"==typeof e?e:r,o[1]=i;for(var u=2;u<l;u++)o[u]=n[u];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},39772:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>o,default:()=>d,frontMatter:()=>l,metadata:()=>i,toc:()=>u});var a=n(87462),r=(n(67294),n(3905));const l={sidebar_position:2},o="NextJS Essential 1 - AppRouter,Rendering",i={unversionedId:"g-fe/next/next2-1-AppRouter",id:"g-fe/next/next2-1-AppRouter",title:"NextJS Essential 1 - AppRouter,Rendering",description:"- NextJS Essential 1 - AppRouter,Rendering",source:"@site/docs/g-fe/5-next/next2-1-AppRouter.md",sourceDirName:"g-fe/5-next",slug:"/g-fe/next/next2-1-AppRouter",permalink:"/docs/g-fe/next/next2-1-AppRouter",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/g-fe/5-next/next2-1-AppRouter.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"frontEnd",previous:{title:"NextJS Essential TS, Etc",permalink:"/docs/g-fe/next/next002-4"},next:{title:"NextJS Essential 2 - ServerLevel",permalink:"/docs/g-fe/next/next2-2-ServerLevel"}},p={},u=[{value:"Goal",id:"goal",level:2},{value:"AppRouter",id:"approuter",level:2},{value:"\ub514\ub809\ud130\ub9ac \uad6c\uc870",id:"\ub514\ub809\ud130\ub9ac-\uad6c\uc870",level:3},{value:"RSC, SSR \uc774\ud574",id:"rsc-ssr-\uc774\ud574",level:2},{value:"Client vs Server Component",id:"client-vs-server-component",level:3},{value:"File Conventions",id:"file-conventions",level:3},{value:"RCS + AppRouter fullPage,subPage \uc758 \ub3d9\uc791\uc774\ud574",id:"rcs--approuter-fullpagesubpage-\uc758-\ub3d9\uc791\uc774\ud574",level:3},{value:"ref",id:"ref",level:3},{value:"hydration\uc774 \ub05d\ub0ac\ub294\uc9c0 \uc54c \uc218 \uc788\ub294 \ubc29\ubc95",id:"hydration\uc774-\ub05d\ub0ac\ub294\uc9c0-\uc54c-\uc218-\uc788\ub294-\ubc29\ubc95",level:3},{value:"revalidate",id:"revalidate",level:3},{value:"Routing",id:"routing",level:2},{value:"Loading UI and Streaming",id:"loading-ui-and-streaming",level:3},{value:"Redirecting",id:"redirecting",level:3},{value:"Route Groups",id:"route-groups",level:3},{value:"Dynamic Routes",id:"dynamic-routes",level:3},{value:"Parallel Routes",id:"parallel-routes",level:3},{value:"Intercepting Routes",id:"intercepting-routes",level:3},{value:"refs",id:"refs",level:2}],s={toc:u},c="wrapper";function d(e){let{components:t,...n}=e;return(0,r.kt)(c,(0,a.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"nextjs-essential-1---approuterrendering"},"NextJS Essential 1 - AppRouter,Rendering"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#nextjs-essential-1---approuterrendering"},"NextJS Essential 1 - AppRouter,Rendering"),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#goal"},"Goal")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#approuter"},"AppRouter"),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#%EB%94%94%EB%A0%89%ED%84%B0%EB%A6%AC-%EA%B5%AC%EC%A1%B0"},"\ub514\ub809\ud130\ub9ac \uad6c\uc870")))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#rsc-ssr-%EC%9D%B4%ED%95%B4"},"RSC, SSR \uc774\ud574"),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#client-vs-server-component"},"Client vs Server Component")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#file-conventions"},"File Conventions")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#rcs--approuter-fullpagesubpage-%EC%9D%98-%EB%8F%99%EC%9E%91%EC%9D%B4%ED%95%B4"},"RCS + AppRouter fullPage,subPage \uc758 \ub3d9\uc791\uc774\ud574")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#ref"},"ref")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#hydration%EC%9D%B4-%EB%81%9D%EB%82%AC%EB%8A%94%EC%A7%80-%EC%95%8C-%EC%88%98-%EC%9E%88%EB%8A%94-%EB%B0%A9%EB%B2%95"},"hydration\uc774 \ub05d\ub0ac\ub294\uc9c0 \uc54c \uc218 \uc788\ub294 \ubc29\ubc95")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#revalidate"},"revalidate")))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#routing"},"Routing"),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#loading-ui-and-streaming"},"Loading UI and Streaming")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#redirecting"},"Redirecting")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#route-groups"},"Route Groups")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#dynamic-routes"},"Dynamic Routes")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#parallel-routes"},"Parallel Routes")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#intercepting-routes"},"Intercepting Routes")))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#refs"},"refs"))))),(0,r.kt)("h2",{id:"goal"},"Goal"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"AppRouter\ub780?  "),(0,r.kt)("li",{parentName:"ul"},"AppRouter \ub514\ub809\ud130\ub9ac \uad6c\uc870 \uc7a1\uae30  "),(0,r.kt)("li",{parentName:"ul"},"\uc11c\ubc84\ucef4\ud3ec\ub10c\ud2b8 \ud074\ub77c\uc774\uc5b8\ud2b8 \ucc28\uc774 \uc774\ud574  "),(0,r.kt)("li",{parentName:"ul"},"AppRouter\uc758 \ub79c\ub354\ub9c1 \ubc29\uc2dd \uc774\ud574  "),(0,r.kt)("li",{parentName:"ul"},"hydration \uc774\ud574  ")),(0,r.kt)("h2",{id:"approuter"},"AppRouter"),(0,r.kt)("p",null,"NextJS\uc5d0\uc11c\ub294 app \ub514\ub809\ud130\ub9ac \uad6c\uc870\uac00 \uc6f9\ud398\uc774\uc9c0 \uc804\uccb4 \uad6c\uc870\ub97c \ud45c\ud604\ud558\ub2e4.  "),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"app \ub514\ub809\ud130\ub9ac = \uc6f9 \ud398\uc774\uc9c0 \uc0ac\uc774\ud2b8 \ub9f5\uacfc \uc720\uc0ac\ud55c \ud615\ud0dc  ")),(0,r.kt)("h3",{id:"\ub514\ub809\ud130\ub9ac-\uad6c\uc870"},"\ub514\ub809\ud130\ub9ac \uad6c\uc870"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"\uac04\ub2e8\ud558\uac8c \uc9da\uace0 \ub118\uc5b4\uac00\uc790.  ")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"Min.ver\nlayout + page + loading + error\n.\n\u251c\u2500\u2500 (site)\n\u251c\u2500\u2500 error.tsx\n\u251c\u2500\u2500 favicon.ico\n\u251c\u2500\u2500 globals.css\n\u251c\u2500\u2500 layout.tsx\n\u2502   \u251c\u2500\u2500 components\n\u2502   \u2502   \u2514\u2500\u2500 category.jsx\n\u2502   \u251c\u2500\u2500 error.tsx\n\u2502   \u251c\u2500\u2500 layout.tsx\n\u2502   \u251c\u2500\u2500 loading.tsx\n\u2502   \u2514\u2500\u2500 page.tsx\n\u251c\u2500\u2500 channel\n\u2502   \u2514\u2500\u2500 [id]\n\u2502       \u251c\u2500\u2500 components\n\u2502       \u251c\u2500\u2500 error.tsx\n\u2502       \u251c\u2500\u2500 layout.tsx\n\u2502       \u251c\u2500\u2500 loading.tsx\n\u2502       \u2514\u2500\u2500 page.tsx\n\u2514\u2500\u2500 playlist\n    \u251c\u2500\u2500 components\n    \u251c\u2500\u2500 error.tsx\n    \u251c\u2500\u2500 layout.tsx\n    \u251c\u2500\u2500 loading.tsx\n    \u2514\u2500\u2500 page.tsx\n---\nFull.ver\n.\n\u251c\u2500\u2500 actions : next server actions \uae30\ub2a5  \n\u251c\u2500\u2500 app : AppRouter\n\u2502   \u251c\u2500\u2500 api : api Handler  \n\u2502   \u2502   \u251c\u2500\u2500 create-checkout-session\n\u2502   \u2502   \u2502   \u2514\u2500\u2500 route.ts\n\u2502   \u2502   \u2514\u2500\u2500 webhooks\n\u2502   \u2502       \u2514\u2500\u2500 route.ts\n\u2502   \u251c\u2500\u2500 (site)\n\u2502   \u2502   \u251c\u2500\u2500 error.tsx\n\u2502   \u2502   \u251c\u2500\u2500 loading.tsx\n\u2502   \u2502   \u2514\u2500\u2500 page.tsx\n\u2502   \u251c\u2500\u2500 error.tsx\n\u2502   \u251c\u2500\u2500 favicon.ico\n\u2502   \u251c\u2500\u2500 globals.css\n\u2502   \u251c\u2500\u2500 layout.tsx\n\u2502   \u251c\u2500\u2500 loading.tsx\n\u2502   \u251c\u2500\u2500 account\n\u2502   \u2502   \u251c\u2500\u2500 components\n\u2502   \u2502   \u251c\u2500\u2500 error.tsx\n\u2502   \u2502   \u251c\u2500\u2500 loading.tsx\n\u2502   \u2502   \u2514\u2500\u2500 page.tsx\n\u2502   \u2514\u2500\u2500 search\n\u2502       \u251c\u2500\u2500 components\n\u2502       \u2502   \u2514\u2500\u2500 SearchContent.tsx\n\u2502       \u251c\u2500\u2500 error.tsx\n\u2502       \u251c\u2500\u2500 loading.tsx\n\u2502       \u2514\u2500\u2500 page.tsx\n\u251c\u2500\u2500 components : \uacf5\ud1b5 \ucef4\ud3ec\ub10c\ud2b8 \ub77c\uc774\ube0c\ub7ec\ub9b4 \n\u251c\u2500\u2500 hooks : \uacf5\ud1b5 \ud6c5\n\u251c\u2500\u2500 providers : Context \ubaa8\uc74c\n\u251c\u2500\u2500 libs : \uc678\ubd80 \ub77c\uc774\ube0c\ub7ec\ub9ac \uc11c\ube44\uc2a4 (stripe,supaBase \ub4f1)\n\u251c\u2500\u2500 public : \uc815\uc801 \ub9ac\uc18c\uc2a4 \n\u251c\u2500\u2500 database.sql : DB Modal\n\u251c\u2500\u2500 middleware.ts\n\u251c\u2500\u2500 next.config.js\n\u251c\u2500\u2500 package-lock.json\n\u251c\u2500\u2500 package.json\n\u251c\u2500\u2500 postcss.config.js\n\u251c\u2500\u2500 tailwind.config.js\n\u251c\u2500\u2500 tsconfig.json\n\u251c\u2500\u2500 types.ts\n\u2514\u2500\u2500 types_db.ts\n")),(0,r.kt)("h2",{id:"rsc-ssr-\uc774\ud574"},"RSC, SSR \uc774\ud574"),(0,r.kt)("p",null,"RSC : \ub9ac\uc561\ud2b8 \uc11c\ubc84 \ucef4\ud3ec\ub10c\ud2b8",(0,r.kt)("br",{parentName:"p"}),"\n","SSR : Server Side Rendering    "),(0,r.kt)("h3",{id:"client-vs-server-component"},"Client vs Server Component"),(0,r.kt)("p",null,"\ub9ac\uc561\ud2b8\ub9cc \uc0ac\uc6a9\ud588\ub358 \uc0ac\ub78c\uc774\ub77c\uba74, \uc11c\ubc84\ucef4\ud3ec\ub10c\ud2b8\uc5d0 \uc775\uc219\ud558\uc9c0 \uc54a\uc744 \uc218 \uc788\ub2e4.   "),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"\uc11c\ubc84 \ucef4\ud3ec\ub10c\ud2b8\ub294 \ub9d0 \uadf8\ub300\ub85c \uc11c\ubc84\uc5d0\uc11c \uc791\ub3d9\ub418\ub294 \ucef4\ud3ec\ub10c\ud2b8\uc774\uba70,  "),(0,r.kt)("li",{parentName:"ul"},"\ucd08\ubc8c\uad6c\uc774 \uac19\uc740 \ub290\ub08c\uc73c\ub85c , HTML \uc815\uc801 \ub9ac\uc18c\uc2a4\ub97c \ubbf8\ub9ac \ucef4\ud30c\uc77c \ud574\uc11c Browser\uc5d0 \ub118\uaca8\uc900\ub2e4.  "),(0,r.kt)("li",{parentName:"ul"},"\uadf8 \uc774\ud6c4\uc5d0 hydration \uacfc\uc815\uc744 \uac70\uccd0\uc11c \ud074\ub77c\uc774\uc5b8\ud2b8 \ucef4\ud3ec\ub10c\ud2b8\uac00 \uc791\ub3d9\ub41c\ub2e4.  ")),(0,r.kt)("p",null,"1.NextJS\uc5d0\uc11c \ucef4\ud3ec\ub10c\ud2b8\ub294 \uae30\ubcf8\uc801\uc73c\ub85c \uc11c\ubc84\ucef4\ud3ec\ub10c\ud2b8\uc774\ub2e4.  "),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Client Component \uc120\uc5b8\uc744 \uc704\ud574\uc11c 'use client'\uc744 \ud30c\uc77c\uc704\uc5d0 \uc801\uc5b4\uc900\ub2e4.    "),(0,r.kt)("li",{parentName:"ul"},"Client Component\uc5d0\uc11c import\ud558\ub294 \ud558\uc704 \ucef4\ud3ec\ub10c\ud2b8\ub294 \ubaa8\ub450 Client Component \uc774\ub2e4.   "),(0,r.kt)("li",{parentName:"ul"},"Client Component\uc5d0\uc11c useState \ub4f1\uc758 \ub9ac\uc561\ud2b8 lifecycle hook\uc744 \uc0ac\uc6a9\ud560 \uc218 \uc788\ub2e4.  ")),(0,r.kt)("p",null,"\ub9cc\uc57d\uc5d0 useClient\uc744 \uc548\uc801\ub294\ub2e4\uba74?  "),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"useState, useMemo \ub4f1 \uc0ac\uc6a9\uc774 \ubd88\uac00\ub2a5\ud558\ub2e4.  "),(0,r.kt)("li",{parentName:"ul"},"\ucef4\ud30c\uc77c \uacbd\uace0\uac00 \ub098\uc628\ub2e4. \uadf8\ub807\uc9c0 \uc54a\ub294 \uacbd\uc6b0\ub3c4 \uc788\ub2e4.  "),(0,r.kt)("li",{parentName:"ul"},"\uc560\ub2c8\uba54\uc774\uc158\uc774 \uc788\ub294 Loading\uacfc \uac19\uc740 \ucef4\ud3ec\ub10c\ud2b8\ub294 \uc560\ub2c8\uba54\uc774\uc158\uc774 \ub3d9\uc791\uc548\ud560 \uc218 \uc788\ub2e4.  ")),(0,r.kt)("p",null,"2.NextJS\uc5d0\uc11c \uc11c\ubc84\ucef4\ud3ec\ub10c\ud2b8\ub294 \uc11c\ubc84\uc5d0\uc11c \ub79c\ub354\ub9c1 \ub41c\ub2e4.  "),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"AppRouter\ub294 Page\ub97c FullPage, SubPage\ub85c \uad6c\ubd84\ud55c\ub2e4.  ")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"FullPage \uc694\uccad > (\uc0c8\ub85c\uace0\uce68, \ucd5c\ucd08\uc694\uccad)\uc5d0\ub294 SSR\uc774 \uc801\uc6a9\ub41c\ub2e4.  "),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"use client")," \uc9c0\uc2dc\uc5b4\ub97c \uc0ac\uc6a9\ud588\uc5b4\ub3c4, SSR\uc5d0 \ud3ec\ud568\ub41c\ub2e4.  "),(0,r.kt)("li",{parentName:"ul"},"useState \uac19\uc740 \uacbd\uc6b0 default \uac12\uc73c\ub85c HTML\uc774 \uad6c\uc6cc\uc838\uc11c \ub098\uc628\ub2e4.  "),(0,r.kt)("li",{parentName:"ul"},"\uadf8 \uc774\ud6c4 hydration \uacfc\uc815\uc744 \uac70\uce5c\ub2e4.  "))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"SubPage\ub85c \ub77c\uc6b0\ud305 \ub418\uba74, \ud544\uc694\ud55c \ubd80\ubd84\ub9cc \uc11c\ubc84\uc5d0\uc11c \ub79c\ub354\ub9c1 \ub41c\ub2e4.  "),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"RooLayout\uc5d0\uc11c context \uc640 \uac19\uc740 \ud074\ub77c\uc774\uc5b8\ud2b8 \uc0c1\ud0dc\ub294 \uc720\uc9c0\ub41c\ub2e4.  "),(0,r.kt)("li",{parentName:"ul"},"\ud2b9\uc815 subPage\uac00 \uc11c\ubc84\ucef4\ud3ec\ub10c\ud2b8\ub85c SSR\uc774 \uac00\ub2a5\ud558\uba74 \uadf8 \ubd80\ubd84\ub9cc \ucef4\ud30c\uc77c \ub41c\ub2e4.   "),(0,r.kt)("li",{parentName:"ul"},"\uadf8 \uc774\ud6c4 hydration \uacfc\uc815\uc744 \uac70\uce5c\ub2e4.  ")))),(0,r.kt)("p",null,"3.\ud074\ub77c\uc774\uc5b8\ud2b8 \uacbd\uacc4 "),(0,r.kt)("p",null,"\uc11c\ubc84, \ud074\ub77c\uc774\uc5b8\ud2b8 \ucef4\ud3ec\ub10c\ud2b8\uac00 \uc11e\uc5ec\uc11c \ubcf5\uc7a1\ud574 \ubcf4\uc774\uc9c0\ub9cc, \uacb0\uad6d \ubaa9\uc801\uc740 \ucd5c\ub300\ud55c \uc11c\ubc84\uc5d0\uc11c \ucc98\ub9ac\ud560 \uc218 \uc788\ub294\ubd80\ubd84\uc740 \ucc98\ub9ac\ud558\uace0 \ub098\uba38\uc9c0\ub294 \ud074\ub77c\uc774\uc5b8\ud2b8\uc5d0 \ub358\uc838\uc8fc\uae30 \uc704\ud568.  "),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"RSC, RCC \uac00 \ud63c\ud569\ub418\uc9c0\ub9cc, \uacb0\uad6d \uc77c\ubd80 \ub79c\ub354 \ud2b8\ub9ac\ub294 \ud074\ub77c\uc774\uc5b8\ud2b8 \ub2e8\uc5d0\uc11c \ucc98\ub9ac\uac00 \ud544\uc694.  "),(0,r.kt)("li",{parentName:"ul"},"SSR\uc774 \uac00\ub2a5\ud55c \ubd80\ubd84\uacfc \uadf8\ub807\uc9c0 \uc54a\uc740 \ubd80\ubd84\uc744 nextjs\uac00 \uad6c\ubd84\ud574\uc11c \ucd5c\uc801\ud654 \ud55c\ub2e4.   "),(0,r.kt)("li",{parentName:"ul"},"\ucd5c\ub300\ud55c SSR\uc5d0\uc11c \ucc98\ub9ac\ud558\uace0 \ub098\uba38\uc9c0 \ubd80\ubd84\uc740 browser\uc5d0\uc11c \ucc98\ub9ac\ud560 \uc218 \uc788\ub3c4\ub85d \ub9cc\ub4dc\ub294\uac83\uc774 \ubaa9\ud45c\uc774\ub2e4.  "),(0,r.kt)("li",{parentName:"ul"},"\ud074\ub77c\uc774\uc5b8\ud2b8\uc758 \uacbd\uacc4\ub97c \uad6c\ubd84\uc9d3\uae30 \uc704\ud55c \uacb0\uacfc\ub2e4."),(0,r.kt)("li",{parentName:"ul"},"\ucef4\ud3ec\ub10c\ud2b8\uac00 \uc544\ub2cc \ud30c\uc77c \ub2e8\uc704\uc758 Tree \uad6c\uc870\ub97c \uba38\ub9ac\uc18d\uc5d0 \uadf8\ub824\uc57c \ud55c\ub2e4.   ")),(0,r.kt)("h3",{id:"file-conventions"},"File Conventions"),(0,r.kt)("p",null,"ref : ",(0,r.kt)("a",{parentName:"p",href:"https://nextjs.org/docs/app/api-reference/file-conventions"},"https://nextjs.org/docs/app/api-reference/file-conventions"),"  "),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"# File Conventions\npage  :  Unique UI of a route and make routes publicly accessible (SSR)\nloading :  Loading UI for a segment and its children (use client)\nerror :  Error UI for a segment and its children (use client)\nlayout  :  Shared UI for a segment and its children\n\nnot-found :  Not found UI for a segment and its children\nglobal-error  :  Global Error UI\nroute :  Server-side API endpoint\ntemplate  :  Specialized re-rendered Layout UI\ndefault :  Fallback UI for Parallel Routes\n\n# check Component Hierarchy  \n- \ud30c\uc77c \ucee8\ubca4\uc158\uc5d0 \ub530\ub77c\uc11c \ub9ac\uc561\ud2b8 \ucef4\ud3ec\ub10c\ud2b8\ub97c \ub9cc\ub4e4\uc5c8\ub2e4.  \n- \uadf8 \ucef4\ud3ec\ub10c\ud2b8 \uc0ac\uc774\uc5d0\ub294 \uc57d\uc18d\ub41c Tree\uac00 \uc0dd\uc131 \ub41c\ub2e4. \n")),(0,r.kt)("p",null,"ref : ",(0,r.kt)("a",{parentName:"p",href:"https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts"},"https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts")),(0,r.kt)("h3",{id:"rcs--approuter-fullpagesubpage-\uc758-\ub3d9\uc791\uc774\ud574"},"RCS + AppRouter fullPage,subPage \uc758 \ub3d9\uc791\uc774\ud574"),(0,r.kt)("p",null,"NextJS\uc5d0\uc11c RootLayout\uc758 \ub85c\ub529 \uc2dc\uac04\uc744 \uc904\uc774\ub294\uac83\uc740 \ub9e4\uc6b0 \uc911\uc694\ud558\ub2e4.  "),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"RootLayout 2\ucd08 + Home 2\ucd08 => \ud398\uc774\uc9c0 \ucd5c\ucd08 \ub85c\ub529 2\ucd08"),(0,r.kt)("li",{parentName:"ul"},"RootLayout 4\ucd08 + Home 2\ucd08 => \ud398\uc774\uc9c0 \ucd5c\ucd08 \ub85c\ub529 4\ucd08 : Root\uac00 \ub290\ub9ac\uba74 \ub2e4 \uac19\uc774 \ub290\ub824\uc9c4\ub2e4.  "),(0,r.kt)("li",{parentName:"ul"},"RootLayout 2\ucd08 + Home 4\ucd08 => \ud398\uc774\uc9c0 \ucd5c\ucd08 \ub85c\ub529 2\ucd08 + Home \ub808\uc774\uc6c3\uc740 loading.tsx \ub178\ucd9c  ")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'export default async function RootLayout({\n  children,\n}: {\n  children: React.ReactNode;\n}) {\n  console.log("--\x3e start");\n  await sleep(4000);\n  console.log("--\x3e end");\n  return (\n    <html lang="en">\n      <body className={inter.className}>\n        {children}\n        <ToasterProvider />\n      </body>\n    </html>\n  );\n}\n---\nexport default async function Home() {\n  console.log("--\x3e Home start");\n  await sleep(2000);\n  console.log("--\x3e Home end");\n\n  return (\n    <div>\n      {/* <Box>Home box</Box> */}\n      <Loader />\n    </div>\n  );\n')),(0,r.kt)("h3",{id:"ref"},"ref"),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://yozm.wishket.com/magazine/detail/2271/"},"https://yozm.wishket.com/magazine/detail/2271/"),(0,r.kt)("br",{parentName:"p"}),"\n",(0,r.kt)("a",{parentName:"p",href:"https://reactnext-central.xyz/blog/8-things-you-shold-konw-about-nextjs-13#1-react-%EC%84%9C%EB%B2%84-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8-rsc"},"https://reactnext-central.xyz/blog/8-things-you-shold-konw-about-nextjs-13#1-react-%EC%84%9C%EB%B2%84-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8-rsc"),(0,r.kt)("br",{parentName:"p"}),"\n",(0,r.kt)("a",{parentName:"p",href:"https://github.com/reactwg/react-18/discussions/37"},"https://github.com/reactwg/react-18/discussions/37"),"  "),(0,r.kt)("h3",{id:"hydration\uc774-\ub05d\ub0ac\ub294\uc9c0-\uc54c-\uc218-\uc788\ub294-\ubc29\ubc95"},"hydration\uc774 \ub05d\ub0ac\ub294\uc9c0 \uc54c \uc218 \uc788\ub294 \ubc29\ubc95"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"useEffect\uac00 \uc791\ub3d9\ub418\uba74, CSR\uc774 \uac00\ub2a5\ud55c \uc0c1\ud0dc\uc774\ub2e4.  "),(0,r.kt)("li",{parentName:"ul"},"\uc544\ub798 \ubaa8\ub2ec\ucc3d\uc740 SSR\ub9cc\uc73c\ub85c\ub294 UI\uac00 \uc2ec\ud558\uac8c \uae68\uc838\uc11c hydration\uc774\ud6c4 \ud654\uba74\uc744 \uadf8\ub9ac\ub3c4\ub85d \ud588\ub2e4.  ")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'"use client";\n\nimport { useEffect, useState } from "react";\n\nimport AuthModal from "@/components/AuthModal";\nimport SubscribeModal from "@/components/SubscribeModal";\nimport UploadModal from "@/components/UploadModal";\nimport { ProductWithPrice } from "@/types";\n\ninterface ModalProviderProps {\n  products: ProductWithPrice[];\n}\n\nconst ModalProvider: React.FC<ModalProviderProps> = ({\n  products\n}) => {\n  const [isMounted, setIsMounted] = useState(false);\n\n  useEffect(() => {\n    setIsMounted(true);\n  }, []);\n\n  if (!isMounted) {\n    return null;\n  }\n\n  return (\n    <>\n      <AuthModal />\n      <SubscribeModal products={products} />\n      <UploadModal />\n    </>\n  );\n}\n\nexport default ModalProvider;\n\n')),(0,r.kt)("h3",{id:"revalidate"},"revalidate"),(0,r.kt)("p",null,"\uc11c\ubc84\ucef4\ud3ec\ub10c\ud2b8\uc5d0\uc11c \ubb34\uc870\uac74 \uc0c8\ub85c\uc6b4 \ub370\uc774\ud130\ub85c\ub9cc SSR\uc744 \uc218\ud589\ud558\uace0\uc790 \ud560 \ub54c"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"// 0 \uc740 \uc694\uccad\uc774 \ub4e4\uc5b4\uc624\uba74 \ud398\uc774\uc9c0\uac00 \ub2e4\uc2dc \uc0dd\uc131\ub41c\ub2e4\ub294 \uc758\ubbf8\uc774\ub2e4.  \n// 60 \uc774\ub77c\uba74, 60\ucd08\ub9c8\ub2e4 \ud398\uc774\uc9c0\ub97c \ub2e4\uc2dc \uc0dd\uc131 \ud55c\ub2e4, \uc815\uc801\ud398\uc774\uc9c0\uc758 \ub0b4\uc6a9\uc744 \uc8fc\uae30\uc801\uc73c\ub85c \uc5c5\ub370\uc774\ud2b8\ud558\uace0 \ucd5c\uc2e0\ub370\uc774\ud130\ub97c \uc720\uc9c0\ud55c\ub2e4.  \nexport const revalidate = 0;\n")),(0,r.kt)("h2",{id:"routing"},"Routing"),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://nextjs.org/docs/app/building-your-application/routing"},"Routing Fundamentals")),(0,r.kt)("h3",{id:"loading-ui-and-streaming"},"Loading UI and Streaming"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"streaming-with-suspense : suspense\ub97c \uc774\uc6a9\ud574\uc11c UI \uc2a4\ud2b8\ub9ac\ubc0d \ud558\uae30   ",(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://nextjs.org/docs/14/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense"},"https://nextjs.org/docs/14/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense"))))),(0,r.kt)("h3",{id:"redirecting"},"Redirecting"),(0,r.kt)("p",null,"2.Optimizing data lookup performance  "),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Bloom Filter\ub97c \uc0ac\uc6a9\ud574\uc11c \ud2b9\uc815 url\uc5d0\ub294 \ud655\uc2e4\ud558\uac8c \ub370\uc774\ud130\uac00 \uc5c6\ub294\uc9c0 \ud310\ub2e8\ud560 \uc218 \uc788\ub2e4.  "),(0,r.kt)("li",{parentName:"ul"},"Bloom Filter\uc758 \uc6d0\ub9ac\ub294 \uc694\uc18c\ub97c \ud574\uc2dc\ud654 \ud558\uc5ec \ub9c8\ud0b9\uc744 \ud558\ub294 \uc6d0\ub9ac\uc774\ub2e4. \uc0bd\uc785,\uac80\uc0c9 = O(k), k\ub294 \ud574\uc2dc \ud568\uc218 \uac1c\uc218   ")),(0,r.kt)("h3",{id:"route-groups"},"Route Groups"),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"URL\uacbd\ub85c \ub9e4\ucee4\ub2c8\uc998\uc5d0 \uc601\ud5a5\uc5c6\uc774, \ub514\ub809\ud130\ub9ac\ub97c \uc815\ub9ac\ud558\uace0 \uc2f6\uc744\ub54c  "),(0,r.kt)("ul",{parentName:"blockquote"},(0,r.kt)("li",{parentName:"ul"},"\uc608\ub97c\ub4e4\uc5b4 \uc778\uc99d\ud55c \uc0ac\uc6a9\uc790\ub9cc \uc811\uadfc\ud558\ub294 \ub514\ub809\ud130\ub9ac, \ubaa8\ub450\uac00 \uc811\uadfc \uac00\ub2a5\ud55c \ub514\ub809\ud130\ub9ac, \ubbf8\uc778\uc99d \uc0ac\uc6a9\uc790\ub9cc \uc811\uadfc \uac00\ub2a5\ud55c \ub514\ub809\ud130\ub9ac  "))),(0,r.kt)("h3",{id:"dynamic-routes"},"Dynamic Routes"),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"\ub3d9\uc801 \uacbd\ub85c\uc5d0 \ub300\ud55c \ucc98\ub9ac,"),(0,r.kt)("ul",{parentName:"blockquote"},(0,r.kt)("li",{parentName:"ul"},"Generating Static Params : \uc138\uadf8\uba3c\ud2b8\uc5d0 \ub300\ud574\uc11c \uc815\uc801 \ud398\uc774\uc9c0\ub97c \uc0dd\uc131\ud558\ub294 \ub85c\uc9c1 "))),(0,r.kt)("h3",{id:"parallel-routes"},"Parallel Routes"),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"Streaming UI\ub97c app router\uc5d0 \uad6c\ud604\ud588\ub2e4. @slot \ucee8\ubca4\uc158\uc744 \uc0ac\uc6a9\ud55c\ub2e4.  ")),(0,r.kt)("h3",{id:"intercepting-routes"},"Intercepting Routes"),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"\uc0ac\uc9c4 \uce74\ub4dc\ub97c \ud074\ub9ad\ud574\uc11c \ubaa8\ub2ec\ucc3d\uc5d0 \uc0ac\uc9c4 UI\uc744 \ubcf4\uc5ec\uc900\ub2e4. \ud558\uc9c0\ub9cc \ud604\uc7ac \ub9c1\ud06c\ub97c \ub2e4\uc2dc \ube0c\ub77c\uc6b0\uc800\uc5d0 \ub123\uc73c\uba74 \uc0ac\uc9c4 \ud398\uc774\uc9c0\ub85c \uc774\ub3d9\ud558\uace0 \uc2f6\uc744\ub54c    ")),(0,r.kt)("h2",{id:"refs"},"refs"),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating"},"Data Fetching, Caching, and Revalidating"),"   "),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://cat-minzzi.tistory.com/104"},"Next.js \uc5d0\uc13c\uc15c: Next.js \uc6f9\uc571\uc5d0\uc11c Client Side Rendering\uc744 \ucd94\uad6c\ud558\uba74 \uc548\ub418\ub294\uac78\uae4c?  ")))}d.isMDXComponent=!0}}]);