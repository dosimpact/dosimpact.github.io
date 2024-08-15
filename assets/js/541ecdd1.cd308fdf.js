"use strict";(self.webpackChunkdosimpact_blog=self.webpackChunkdosimpact_blog||[]).push([[4936],{3905:(e,n,t)=>{t.d(n,{Zo:()=>u,kt:()=>k});var r=t(67294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function l(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?l(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function o(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},l=Object.keys(e);for(r=0;r<l.length;r++)t=l[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)t=l[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var p=r.createContext({}),s=function(e){var n=r.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},u=function(e){var n=s(e.components);return r.createElement(p.Provider,{value:n},e.children)},c="mdxType",m={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,l=e.originalType,p=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),c=s(t),d=a,k=c["".concat(p,".").concat(d)]||c[d]||m[d]||l;return t?r.createElement(k,i(i({ref:n},u),{},{components:t})):r.createElement(k,i({ref:n},u))}));function k(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var l=t.length,i=new Array(l);i[0]=d;var o={};for(var p in n)hasOwnProperty.call(n,p)&&(o[p]=n[p]);o.originalType=e,o[c]="string"==typeof e?e:a,i[1]=o;for(var s=2;s<l;s++)i[s]=t[s];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},12046:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>p,contentTitle:()=>i,default:()=>m,frontMatter:()=>l,metadata:()=>o,toc:()=>s});var r=t(87462),a=(t(67294),t(3905));const l={sidebar_position:1},i="NextJS Install",o={unversionedId:"g-fe/next/next001",id:"g-fe/next/next001",title:"NextJS Install",description:"- NextJS Install",source:"@site/docs/g-fe/5-next/next001.md",sourceDirName:"g-fe/5-next",slug:"/g-fe/next/next001",permalink:"/docs/g-fe/next/next001",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/g-fe/5-next/next001.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"frontEnd",previous:{title:"NextJS 2024 FullStack",permalink:"/docs/g-fe/next/next000"},next:{title:"NextJS Essential 1 - AppRouter,Rendering",permalink:"/docs/g-fe/next/next002-1"}},p={},s=[{value:"goal",id:"goal",level:2},{value:"1. create-next-app",id:"1-create-next-app",level:2},{value:"eg",id:"eg",level:3},{value:"2. yarn berry migration",id:"2-yarn-berry-migration",level:2},{value:"2.1 \ubc31\uadf8\ub77c\uc6b4\ub4dc",id:"21-\ubc31\uadf8\ub77c\uc6b4\ub4dc",level:2},{value:"npm install yarn -g \uc744 \uc774\uc6a9\ud574\uc11c \uc124\uce58\ud558\uba74 yarn\uc740 \ucd5c\uc2e0\ubc84\uc804\uc774 \uc544\ub2c8\ub2e4.",id:"npm-install-yarn--g-\uc744-\uc774\uc6a9\ud574\uc11c-\uc124\uce58\ud558\uba74-yarn\uc740-\ucd5c\uc2e0\ubc84\uc804\uc774-\uc544\ub2c8\ub2e4",level:3},{value:"\ubaa8\ub4c8\uc744 \uc124\uce58\ud558\ub294 3\uac00\uc9c0 \ubc29\uc2dd",id:"\ubaa8\ub4c8\uc744-\uc124\uce58\ud558\ub294-3\uac00\uc9c0-\ubc29\uc2dd",level:3},{value:"zero install",id:"zero-install",level:3},{value:"yarn v4 \uc744 \uc0ac\uc6a9\ud558\uba74 \uc88b\uc740 \uc810",id:"yarn-v4-\uc744-\uc0ac\uc6a9\ud558\uba74-\uc88b\uc740-\uc810",level:3},{value:"2.2 yarn berry migration",id:"22-yarn-berry-migration",level:2},{value:"3.More config tip",id:"3more-config-tip",level:2},{value:"\ud2b9\uc815 \uacbd\ub85c\ub97c \ube4c\ub4dc\uc5d0\uc11c \ubb34\uc2dc\ud558\uae30",id:"\ud2b9\uc815-\uacbd\ub85c\ub97c-\ube4c\ub4dc\uc5d0\uc11c-\ubb34\uc2dc\ud558\uae30",level:3},{value:"ref",id:"ref",level:2}],u={toc:s},c="wrapper";function m(e){let{components:n,...t}=e;return(0,a.kt)(c,(0,r.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"nextjs-install"},"NextJS Install"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#nextjs-install"},"NextJS Install"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#goal"},"goal")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#1-create-next-app"},"1. create-next-app"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#eg"},"eg")))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#2-yarn-berry-migration"},"2. yarn berry migration")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#21-%EB%B0%B1%EA%B7%B8%EB%9D%BC%EC%9A%B4%EB%93%9C"},"2.1 \ubc31\uadf8\ub77c\uc6b4\ub4dc"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#npm-install-yarn--g-%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%B4%EC%84%9C-%EC%84%A4%EC%B9%98%ED%95%98%EB%A9%B4-yarn%EC%9D%80-%EC%B5%9C%EC%8B%A0%EB%B2%84%EC%A0%84%EC%9D%B4-%EC%95%84%EB%8B%88%EB%8B%A4"},"npm install yarn -g \uc744 \uc774\uc6a9\ud574\uc11c \uc124\uce58\ud558\uba74 yarn\uc740 \ucd5c\uc2e0\ubc84\uc804\uc774 \uc544\ub2c8\ub2e4.")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#%EB%AA%A8%EB%93%88%EC%9D%84-%EC%84%A4%EC%B9%98%ED%95%98%EB%8A%94-3%EA%B0%80%EC%A7%80-%EB%B0%A9%EC%8B%9D"},"\ubaa8\ub4c8\uc744 \uc124\uce58\ud558\ub294 3\uac00\uc9c0 \ubc29\uc2dd")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#zero-install"},"zero install")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#yarn-v4-%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%98%EB%A9%B4-%EC%A2%8B%EC%9D%80-%EC%A0%90"},"yarn v4 \uc744 \uc0ac\uc6a9\ud558\uba74 \uc88b\uc740 \uc810")))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#22-yarn-berry-migration"},"2.2 yarn berry migration")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#3more-config-tip"},"3.More config tip"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#%ED%8A%B9%EC%A0%95-%EA%B2%BD%EB%A1%9C%EB%A5%BC-%EB%B9%8C%EB%93%9C%EC%97%90%EC%84%9C-%EB%AC%B4%EC%8B%9C%ED%95%98%EA%B8%B0"},"\ud2b9\uc815 \uacbd\ub85c\ub97c \ube4c\ub4dc\uc5d0\uc11c \ubb34\uc2dc\ud558\uae30")))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#ref"},"ref"))))),(0,a.kt)("h2",{id:"goal"},"goal"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"nextjs \uc744 \uc2dc\uc791\ud558\ub294 \ubc29\ubc95    "),(0,a.kt)("li",{parentName:"ul"},"yarn berry\ub85c \ubcc0\uacbd\ud558\ub294 \ubc29\ubc95  ")),(0,a.kt)("h2",{id:"1-create-next-app"},"1. create-next-app"),(0,a.kt)("p",null,"docs : ",(0,a.kt)("a",{parentName:"p",href:"https://nextjs.org/docs/pages/api-reference/create-next-app"},"https://nextjs.org/docs/pages/api-reference/create-next-app")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"# npm\nnpx create-next-app@latest  \n\n# yarn\nyarn create next-app  \n")),(0,a.kt)("h3",{id:"eg"},"eg"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"}," npx create-next-app@latest next-13-crash\n\u2714 Would you like to use TypeScript? \u2026 No / Yes\n\u2714 Would you like to use ESLint? \u2026 No / Yes\n\u2714 Would you like to use Tailwind CSS? \u2026 No / Yes\n\u2714 Would you like to use `src/` directory? \u2026 No / Yes\n\u2714 Would you like to use App Router? (recommended) \u2026 No / Yes\n\u2714 Would you like to customize the default import alias? \u2026 No / Yes\n\u2714 What import alias would you like configured? \u2026 @/*\nCreating a new Next.js app in /Users/dosimpact/workspace/project/lectures_web/3.Next/lectures/next-13-crash.\n")),(0,a.kt)("h2",{id:"2-yarn-berry-migration"},"2. yarn berry migration"),(0,a.kt)("h2",{id:"21-\ubc31\uadf8\ub77c\uc6b4\ub4dc"},"2.1 \ubc31\uadf8\ub77c\uc6b4\ub4dc"),(0,a.kt)("h3",{id:"npm-install-yarn--g-\uc744-\uc774\uc6a9\ud574\uc11c-\uc124\uce58\ud558\uba74-yarn\uc740-\ucd5c\uc2e0\ubc84\uc804\uc774-\uc544\ub2c8\ub2e4"},"npm install yarn -g \uc744 \uc774\uc6a9\ud574\uc11c \uc124\uce58\ud558\uba74 yarn\uc740 \ucd5c\uc2e0\ubc84\uc804\uc774 \uc544\ub2c8\ub2e4."),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"yarn -v // 1.22.19  "),(0,a.kt)("li",{parentName:"ul"},"1.xx \ubc84\uc804\uc744 \uc720\uc9c0\ud558\ub294 \uc774\uc720\ub294 \uae30\uc874 \uc0dd\ud0dc\uacc4\uc758 \ud638\ud658\uc131\uc744 \uc704\ud574\uc11c\uc774\ub2e4.  "),(0,a.kt)("li",{parentName:"ul"},"\ucd5c\uc2e0\ubc84\uc804\uc73c\ub85c \uc5c5\ub370\uc774\ud2b8\ud558\uba74 \uc644\uc804 \ub2e4\ub978 \uc778\ud130\ud398\uc774\uc2a4\ub97c \ubcf4\uac8c\ub420 \uac83\uc774\ub2e4.  ")),(0,a.kt)("h3",{id:"\ubaa8\ub4c8\uc744-\uc124\uce58\ud558\ub294-3\uac00\uc9c0-\ubc29\uc2dd"},"\ubaa8\ub4c8\uc744 \uc124\uce58\ud558\ub294 3\uac00\uc9c0 \ubc29\uc2dd"),(0,a.kt)("p",null,"Install modes"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"nodeLinker: pnp : Plug'n'Play \uc774\uba70, node_modules\ub97c \uc0dd\uc131\ud558\uc9c0 \uc54a\ub294\ub2e4.  "),(0,a.kt)("li",{parentName:"ul"},"nodeLinker: pnpm : yarn\uacfc \uc720\uc0ac\ud55c \ubc29\uc2dd\uc758 \ud328\ud0a4\uc9c0 \ub9e4\ub2c8\uc800\uc758 \ubc29\uc2dd    "),(0,a.kt)("li",{parentName:"ul"},"nodeLinker: node-modules : node_modules\ub97c \ub9cc\ub4dc\ub294 \uc77c\ubc18\uc801\uc778 \ubc29\uc2dd   ")),(0,a.kt)("h3",{id:"zero-install"},"zero install"),(0,a.kt)("p",null,"1.yarn\uc758 pnp\ub97c \uc0ac\uc6a9\ud55c\ub2e4.",(0,a.kt)("br",{parentName:"p"}),"\n","2.pnp\ub97c git\uc73c\ub85c \ubc84\uc804\uad00\ub9ac\ud558\uc5ec, \uc758\uc874\uc131 \ubaa8\ub4c8\uc744 \uae43\ud5c8\ube0c\uc5d0 \uc62c\ub9b0\ub2e4. "),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\ub530\ub77c\uc11c git clone \ub9cc\uc73c\ub85c\ub3c4 \uc758\uc874\uc131 \ubaa8\ub4c8\uc774 \ub530\ub77c\uc628\ub2e4.  ")),(0,a.kt)("h3",{id:"yarn-v4-\uc744-\uc0ac\uc6a9\ud558\uba74-\uc88b\uc740-\uc810"},"yarn v4 \uc744 \uc0ac\uc6a9\ud558\uba74 \uc88b\uc740 \uc810"),(0,a.kt)("p",null,"Yarn Classic \ub77c\uc778(1.x)\uc740 JavaScript \uc0dd\ud0dc\uacc4\uc758 \ud575\uc2ec\uc73c\ub85c \ub0a8\uc544 \uc788\uc9c0\ub9cc \uac00\ub2a5\ud558\uba74 \uc5c5\uadf8\ub808\uc774\ub4dc\ud558\ub294 \uac83\uc774 \uc88b\uc2b5\ub2c8\ub2e4. \uc65c\uc8e0?  "),(0,a.kt)("p",null,"\uc548\uc815\uc131: Yarn Modern\uc740 \uc218\ub144\uac04 \uc758 Classic \uc720\uc9c0 \uacbd\ud5d8\uc744 \ubc14\ud0d5\uc73c\ub85c \ud0c4\uc0dd\ud588\uc2b5\ub2c8\ub2e4. \uadf8 \ub514\uc790\uc778\uc740 \uc6b0\ub9ac\uac00 \ubcf8 \ub2e8\uc810\uc744 \ubc18\uc601\ud588\uc73c\uba70 \uadf8 \uacb0\uacfc \uc18c\ud504\ud2b8\uc6e8\uc5b4\ub294 \uc774\uc804\ubcf4\ub2e4 \ud6e8\uc52c \ub354 \uc548\uc815\uc801\uc774\uc5c8\uc2b5\ub2c8\ub2e4.  "),(0,a.kt)("p",null,"\uc0c8\ub85c\uc6b4 \uae30\ub2a5: Yarn Modern\uc740 Yarn 1.x \ub610\ub294 \ud574\ub2f9 \ubb38\uc81c\uc5d0 \ub300\ud55c \ub2e4\ub978 \ud328\ud0a4\uc9c0 \uad00\ub9ac\uc790\uc5d0 \uc874\uc7ac\ud558\uc9c0 \uc54a\uc558\ub358 \ub9ce\uc740 \uc0c8\ub85c\uc6b4 \uae30\ub2a5\uc744 \uc81c\uacf5\ud569\ub2c8\ub2e4. \uc608\ub97c \ub4e4\uc5b4 \uc81c\uc57d \uc870\uac74\uc740 Yarn Modern\uc5d0\ub9cc \uc801\uc6a9\ub429\ub2c8\ub2e4.  "),(0,a.kt)("p",null,"\uc720\uc5f0\uc131: Yarn Modern\uc740 Yarn PnP, node_modules\ubc0f pnpm\uacfc \uac19\uc740 \ucf58\ud150\uce20 \uc8fc\uc18c \uc9c0\uc815 \uce90\uc2dc\ub97c \ud1b5\ud574 \uc138 \uac00\uc9c0 \uc124\uce58 \uc804\ub7b5\uc744 \ubaa8\ub450 \uc9c0\uc6d0\ud569\ub2c8\ub2e4. \uc5b4\ub290 \ucabd\uc744 \uc120\ud638\ud558\ub4e0 \ub9c8\uc74c\ub300\ub85c \uc0ac\uc6a9\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.  "),(0,a.kt)("p",null,"\ud655\uc7a5\uc131: Yarn Modern\uc758 \uc544\ud0a4\ud14d\ucc98\ub97c \uc0ac\uc6a9\ud558\uba74 \ud544\uc694\uc5d0 \ub530\ub77c \uace0\uc720\ud55c \uae30\ub2a5\uc744 \uad6c\ucd95\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4. \uc6d0\ud558\ub294 \uae30\ub2a5\uc774 \uad6c\ud604\ub420 \ub54c\uae4c\uc9c0 \uae30\ub2e4\ub9b4 \ud544\uc694\uac00 \uc5c6\uc2b5\ub2c8\ub2e4. \uc774\uc81c \uc790\uc2e0\uc758 \uc0ac\uc591\uc5d0 \ub530\ub77c \uc9c1\uc811 \uad6c\ud604\ud558\uace0 \ubc14\ub85c \uc0ac\uc6a9\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4! \uc9d1\uc911\ub41c \uc791\uc5c5 \uacf5\uac04, \ub9de\ucda4\ud615 \uc124\uce58, \ud504\ub85c\uc81d\ud2b8 \uac80\uc99d \ub4f1  "),(0,a.kt)("p",null,"\ubbf8\ub798 \ubcf4\uc7a5: Yarn Modern\uc740 Yarn Classic\uc5d0\uc11c \uc0c8\ub85c\uc6b4 \uae30\ub2a5\uc744 \uad6c\ucd95\ud558\ub294 \uac83\uc774 \uc5bc\ub9c8\ub098 \uc5b4\ub824\uc6b4\uc9c0, \ub300\ubd80\ubd84\uc758 \ubcc0\uacbd \uc0ac\ud56d\uc774 \uc608\uce21\ud560 \uc218 \uc5c6\ub294 \uacb0\uacfc\ub97c \uac00\uc838\uc624\ub294\uc9c0 \ud655\uc778\ud55c \ud6c4\uc5d0 \uad6c\ucd95\ub418\uc5c8\uc2b5\ub2c8\ub2e4. \uc9c0\ub09c \uba87 \ubc88\uc758 \uc8fc\uc694 \ub9b4\ub9ac\uc2a4\uc5d0\uc11c \ucd9c\uc2dc\ud55c \uae30\ub2a5 \ubaa9\ub85d\uc5d0\uc11c \uc54c \uc218 \uc788\ub4ef\uc774 \uc774\ub7ec\ud55c \uc815\uccb4 \ud604\uc0c1\uc740 \ud574\uacb0\ub418\uc5c8\uc2b5\ub2c8\ub2e4.  "),(0,a.kt)("h2",{id:"22-yarn-berry-migration"},"2.2 yarn berry migration"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"yarn create next-app \uc744 \ud1b5\ud574 \uc0dd\uc131\ud55c \ud504\ub85c\uc81d\ud2b8\uc774\ub2e4.  "),(0,a.kt)("li",{parentName:"ul"},"yarn berry\ub85c \ub9c8\uc774\uadf8\ub808\uc774\uc158 \ud574\ubcf4\uc790.  ")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},'# \ucd5c\uc2e0\ubc84\uc804\uc758 yarn(berry) \uc0ac\uc6a9 \uc124\uc815\nyarn set version stable\n\n# \ubc84\uc804 \ud655\uc778 - 4.0.2\nyarn -v\n\n# \ud328\ud0a4\uc9c0 \uc124\uce58\nyarn\n# package.json\uc5d0  "packageManager": "yarn@4.0.2" \uac00 \ucd94\uac00\ub41c\ub2e4.\n# .yarnrc.yml \ud30c\uc77c\uc774 \ucd94\uac00\ub418\uba70, nodeLinker: node-modules \uac00 \uae30\ubcf8\uc124\uc815\uc774\ub2e4. \n\n# \uac1c\ubc1c\ubaa8\ub4dc\ub85c \ub744\uc6cc\ubcf4\uae30\nyarn dev\n\n---\n# .gitignore \uc5d0 \ucd94\uac00\n.yarn/*\n!.yarn/cache\n!.yarn/patches\n!.yarn/plugins\n!.yarn/releases\n!.yarn/sdks\n!.yarn/versions\n\n---\n# Plug\'n\'Play \uc804\ud658\n# .yarnrc.yml \ud30c\uc77c\uc5d0\uc11c, nodeLinker: pnp\ub85c \ubcc0\uacbd\n# \ud328\ud0a4\uc9c0 \ub2e4\uc2dc\uc124\uce58\nyarn\n\n# \uac1c\ubc1c\ubaa8\ub4dc\ub85c \ub744\uc6cc\ubcf4\uae30\nyarn dev\n')),(0,a.kt)("hr",null),(0,a.kt)("h2",{id:"3more-config-tip"},"3.More config tip"),(0,a.kt)("h3",{id:"\ud2b9\uc815-\uacbd\ub85c\ub97c-\ube4c\ub4dc\uc5d0\uc11c-\ubb34\uc2dc\ud558\uae30"},"\ud2b9\uc815 \uacbd\ub85c\ub97c \ube4c\ub4dc\uc5d0\uc11c \ubb34\uc2dc\ud558\uae30"),(0,a.kt)("p",null,"\ub9cc\uc57d\uc5d0 supabase \uc11c\ube0c\ub514\ub809\ud130\ub9ac\uac00 \uc788\uace0, \uc774\ub294 nextjs\uc640 \ubb34\uad00\ud558\ub2e4\uba74 \uc774\ub97c \ube4c\ub4dc \uc2f8\uc774\ud074\uc5d0\uc11c \uc81c\uc678\ud574\uc57c \ud55c\ub2e4.  "),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"tsconfig, next build \ubaa8\ub450 \uc124\uc815\ud574\uc57c \ud55c\ub2e4.  "),(0,a.kt)("li",{parentName:"ul"},"\ubaa8\ub178\ub798\ud3ec\ub85c \ub9cc\ub4e4\uc5b4\ub3c4 \uc88b\uc744\uac83 \uac19\ub2e4.  ")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'#\nyarn add ignore-loader\n\n# tsconfig.json\n  "exclude": ["node_modules","supabase"]\n\n# next.config.js\n/** @type {import(\'next\').NextConfig} */\nconst nextConfig = {\n  webpack: (config, { isServer }) => {\n    config.module.rules.push({\n      test: /$\\/supabase\\/.*/, // \'supabase\' \ud3f4\ub354 \ubc0f \ud558\uc704 \uacbd\ub85c\ub97c \ubb34\uc2dc\ud558\ub3c4\ub85d \uc815\uaddc\uc2dd \uc9c0\uc815\n      use: "ignore-loader",\n    });\n    return config;\n  },\n};\n\nexport default nextConfig;\n')),(0,a.kt)("p",null,"\uc8fc\uc758 "),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"test: /supabase\\/.*/,"),"  -> @supabase/ssr \uacfc \uac19\uc740 \ubaa8\ub4c8\uc758 \uacbd\ub85c\ub3c4 \ubb34\uc2dc\ud558\ub294 \ud328\ud134\uc774\ub2e4.  "),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"test: /^\\/supabase\\/.*/,")," -> ignore-loader\uac00 supabase\ub77c\ub294  \uacbd\ub85c\ub85c \uc2dc\uc791\ud558\ub294 \ubaa8\ub4c8\uc758 \uacbd\uc6b0\ub97c \ubb34\uc2dc\ud55c\ub2e4.  ",(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"\ub2e4\ud589\uc774\ub3c4 @supabase\ub77c\ub294 \ub124\uc784\uc2a4\ud398\uc774\uc2a4 \ub54c\ubb38\uc5d0 \uc758\uc874\uc131\uc744 \uc0ac\uc6a9\ud560 \uc218 \uc788\ub2e4.  ")))),(0,a.kt)("h2",{id:"ref"},"ref"),(0,a.kt)("p",null,"Release: Yarn 4.0 \ud83e\ude84\u2697\ufe0f ",(0,a.kt)("a",{parentName:"p",href:"https://yarnpkg.com/blog/release/4.0"},"https://yarnpkg.com/blog/release/4.0"),"\n",(0,a.kt)("a",{parentName:"p",href:"https://velog.io/@creco/next.js-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0"},"https://velog.io/@creco/next.js-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0")))}m.isMDXComponent=!0}}]);