"use strict";(self.webpackChunkdosimpact_blog=self.webpackChunkdosimpact_blog||[]).push([[2295],{3905:(e,t,r)=>{r.d(t,{Zo:()=>i,kt:()=>d});var n=r(67294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function p(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var u=n.createContext({}),s=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},i=function(e){var t=s(e.components);return n.createElement(u.Provider,{value:t},e.children)},m="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},f=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,u=e.parentName,i=p(e,["components","mdxType","originalType","parentName"]),m=s(r),f=o,d=m["".concat(u,".").concat(f)]||m[f]||c[f]||a;return r?n.createElement(d,l(l({ref:t},i),{},{components:r})):n.createElement(d,l({ref:t},i))}));function d(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,l=new Array(a);l[0]=f;var p={};for(var u in t)hasOwnProperty.call(t,u)&&(p[u]=t[u]);p.originalType=e,p[m]="string"==typeof e?e:o,l[1]=p;for(var s=2;s<a;s++)l[s]=r[s];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}f.displayName="MDXCreateElement"},77513:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>u,contentTitle:()=>l,default:()=>c,frontMatter:()=>a,metadata:()=>p,toc:()=>s});var n=r(87462),o=(r(67294),r(3905));const a={sidebar_position:3},l="TS 3",p={unversionedId:"g-fe/ts/typescript/ts03",id:"g-fe/ts/typescript/ts03",title:"TS 3",description:"- TS 3",source:"@site/docs/g-fe/2-ts/0-typescript/ts03.md",sourceDirName:"g-fe/2-ts/0-typescript",slug:"/g-fe/ts/typescript/ts03",permalink:"/docs/g-fe/ts/typescript/ts03",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/g-fe/2-ts/0-typescript/ts03.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"frontEnd",previous:{title:"TS 5 - Generic",permalink:"/docs/g-fe/ts/typescript/ts05-generic"},next:{title:"tsc",permalink:"/docs/category/tsc"}},u={},s=[{value:"re-export",id:"re-export",level:2},{value:"1. Named Exports \uc7ac\uc218\ucd9c",id:"1-named-exports-\uc7ac\uc218\ucd9c",level:3},{value:"2. Export * as",id:"2-export--as",level:3},{value:"3. Export All from",id:"3-export-all-from",level:3},{value:"4. Export\uc640 \ud568\uaed8 \uc7ac\uc218\ucd9c",id:"4-export\uc640-\ud568\uaed8-\uc7ac\uc218\ucd9c",level:3},{value:"5. Re-exporting as Default Export",id:"5-re-exporting-as-default-export",level:3},{value:"6. Aggregating Multiple Modules",id:"6-aggregating-multiple-modules",level:3},{value:"import type vs \uc77c\ubc18 import",id:"import-type-vs-\uc77c\ubc18-import",level:2}],i={toc:s},m="wrapper";function c(e){let{components:t,...r}=e;return(0,o.kt)(m,(0,n.Z)({},i,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"ts-3"},"TS 3"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#ts-3"},"TS 3"),(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#re-export"},"re-export"),(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#1-named-exports-%EC%9E%AC%EC%88%98%EC%B6%9C"},"1. Named Exports \uc7ac\uc218\ucd9c")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#2-export--as"},"2. Export ","*"," as")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#3-export-all-from"},"3. Export All from")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#4-export%EC%99%80-%ED%95%A8%EA%BB%98-%EC%9E%AC%EC%88%98%EC%B6%9C"},"4. Export\uc640 \ud568\uaed8 \uc7ac\uc218\ucd9c")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#5-re-exporting-as-default-export"},"5. Re-exporting as Default Export")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#6-aggregating-multiple-modules"},"6. Aggregating Multiple Modules")))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#import-type-vs-%EC%9D%BC%EB%B0%98-import"},"import type vs \uc77c\ubc18 import"))))),(0,o.kt)("h2",{id:"re-export"},"re-export"),(0,o.kt)("h3",{id:"1-named-exports-\uc7ac\uc218\ucd9c"},"1. Named Exports \uc7ac\uc218\ucd9c"),(0,o.kt)("p",null,"\uae30\uc874 \ubaa8\ub4c8\uc5d0\uc11c \ud2b9\uc815 \uc774\ub984\uc73c\ub85c \ub0b4\ubcf4\ub0b8 \ud56d\ubaa9\uc744 \uc7ac\uc218\ucd9c\ud558\uba70, default export\ub3c4 \ud3ec\ud568\ud569\ub2c8\ub2e4."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},"// moduleA.ts\nexport const foo = () => { /* ... */ };\nexport const bar = () => { /* ... */ };\nconst defaultFunction = () => { /* ... */ };\nexport default defaultFunction;\n\n// moduleB.ts\nexport { foo, bar } from './moduleA';\nexport { default as defaultFunction } from './moduleA';\n\n// \ub2e4\ub978 \ud30c\uc77c\uc5d0\uc11c \uc0ac\uc6a9\ud560 \ub54c\nimport { foo, bar, defaultFunction } from './moduleB';\n")),(0,o.kt)("h3",{id:"2-export--as"},"2. Export * as"),(0,o.kt)("p",null,"\ubaa8\ub4e0 \ub0b4\ubcf4\ub0b4\uae30 \ud56d\ubaa9\uc744 \ud558\ub098\uc758 \ub124\uc784\uc2a4\ud398\uc774\uc2a4\ub85c \uc7ac\uc218\ucd9c\ud558\uba70, default export\ub3c4 \ud3ec\ud568\ud569\ub2c8\ub2e4."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},"// moduleA.ts\nexport const foo = () => { /* ... */ };\nexport const bar = () => { /* ... */ };\nconst defaultFunction = () => { /* ... */ };\nexport default defaultFunction;\n\n// moduleB.ts\nexport * as A from './moduleA';\n\n// \ub2e4\ub978 \ud30c\uc77c\uc5d0\uc11c \uc0ac\uc6a9\ud560 \ub54c\nimport { A } from './moduleB';\nA.default(); // defaultFunction \ud638\ucd9c\nA.foo();\nA.bar();\n")),(0,o.kt)("h3",{id:"3-export-all-from"},"3. Export All from"),(0,o.kt)("p",null,"\ubaa8\ub4e0 \ub0b4\ubcf4\ub0b4\uae30 \ud56d\ubaa9\uc744 \uc7ac\uc218\ucd9c\ud558\uba70, default export\ub3c4 \ud3ec\ud568\ud569\ub2c8\ub2e4."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},"// moduleA.ts\nexport const foo = () => { /* ... */ };\nexport const bar = () => { /* ... */ };\nconst defaultFunction = () => { /* ... */ };\nexport default defaultFunction;\n\n// moduleB.ts\nexport * from './moduleA';\nexport { default } from './moduleA';\n\n// \ub2e4\ub978 \ud30c\uc77c\uc5d0\uc11c \uc0ac\uc6a9\ud560 \ub54c\nimport defaultFunction, { foo, bar } from './moduleB';\n")),(0,o.kt)("h3",{id:"4-export\uc640-\ud568\uaed8-\uc7ac\uc218\ucd9c"},"4. Export\uc640 \ud568\uaed8 \uc7ac\uc218\ucd9c"),(0,o.kt)("p",null,"\ub2e4\ub978 \ubaa8\ub4c8\uc758 \ub0b4\ubcf4\ub0b4\uae30 \ud56d\ubaa9\uc744 \ud3ec\ud568\ud558\uc5ec \uc0c8\ub85c\uc6b4 \ud56d\ubaa9\uc744 \ucd94\uac00\ub85c \ub0b4\ubcf4\ub0b4\uba70, default export\ub3c4 \ud3ec\ud568\ud569\ub2c8\ub2e4."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},"// moduleA.ts\nexport const foo = () => { /* ... */ };\nexport const bar = () => { /* ... */ };\nconst defaultFunction = () => { /* ... */ };\nexport default defaultFunction;\n\n// moduleB.ts\nexport * from './moduleA';\nexport { default } from './moduleA';\nexport const baz = () => { /* ... */ };\n\n// \ub2e4\ub978 \ud30c\uc77c\uc5d0\uc11c \uc0ac\uc6a9\ud560 \ub54c\nimport defaultFunction, { foo, bar, baz } from './moduleB';\n")),(0,o.kt)("h3",{id:"5-re-exporting-as-default-export"},"5. Re-exporting as Default Export"),(0,o.kt)("p",null,"\ud2b9\uc815 \ud56d\ubaa9\uc744 \uae30\ubcf8 \ub0b4\ubcf4\ub0b4\uae30\ub85c \uc7ac\uc218\ucd9c\ud558\uba70, \uae30\uc874 default export\ub3c4 \ud3ec\ud568\ud569\ub2c8\ub2e4."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},"// moduleA.ts\nconst foo = () => { /* ... */ };\nexport default foo;\n\n// moduleB.ts\nconst bar = () => { /* ... */ };\nexport default bar;\n\n// moduleC.ts\nexport { default as foo } from './moduleA';\nexport { default as bar } from './moduleB';\n\n// \ub2e4\ub978 \ud30c\uc77c\uc5d0\uc11c \uc0ac\uc6a9\ud560 \ub54c\nimport { foo, bar } from './moduleC';\n")),(0,o.kt)("h3",{id:"6-aggregating-multiple-modules"},"6. Aggregating Multiple Modules"),(0,o.kt)("p",null,"\uc5ec\ub7ec \ubaa8\ub4c8\uc744 \ud55c \uacf3\uc5d0\uc11c \uc7ac\uc218\ucd9c\ud558\uba70, default export\ub3c4 \ud3ec\ud568\ud569\ub2c8\ub2e4."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},"// moduleA.ts\nexport const foo = () => { /* ... */ };\nconst defaultFunctionA = () => { /* ... */ };\nexport default defaultFunctionA;\n\n// moduleB.ts\nexport const bar = () => { /* ... */ };\nconst defaultFunctionB = () => { /* ... */ };\nexport default defaultFunctionB;\n\n// index.ts\nexport { foo } from './moduleA';\nexport { default as defaultFunctionA } from './moduleA';\nexport { bar } from './moduleB';\nexport { default as defaultFunctionB } from './moduleB';\n\n// \ub2e4\ub978 \ud30c\uc77c\uc5d0\uc11c \uc0ac\uc6a9\ud560 \ub54c\nimport { foo, bar, defaultFunctionA, defaultFunctionB } from './index';\n")),(0,o.kt)("p",null,"\uc774 \uc608\uc81c\ub4e4\uc740 default export\ub97c \uace0\ub824\ud558\uc5ec \uac01 \ubc29\ubc95\uc5d0 \ub9de\uac8c \uc218\uc815\ub41c \ubc84\uc804\uc785\ub2c8\ub2e4."),(0,o.kt)("h2",{id:"import-type-vs-\uc77c\ubc18-import"},"import type vs \uc77c\ubc18 import"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"import type")),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"\uc21c\uc218\ud558\uac8c \ud0c0\uc785 \uc815\ubcf4\ub9cc \uac00\uc838\uc624\uba70, \ub7f0\ud0c0\uc784\uc5d0\ub294 \uc644\uc804\ud788 \uc81c\uac70(\ud0c0\uc785 \uccb4\ud0b9\uc744 \uc704\ud55c \ucef4\ud30c\uc77c \ud0c0\uc784\uc5d0\ub9cc \uc0ac\uc6a9)  "),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("blockquote",{parentName:"li"},(0,o.kt)("p",{parentName:"blockquote"},"\ubc88\ub4e4 \ud06c\uae30 \uac10\uc18c   ")))),(0,o.kt)("ol",{start:2},(0,o.kt)("li",{parentName:"ol"},"\uc77c\ubc18 import")),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"\uc2e4\uc81c \uac12\uacfc \ud0c0\uc785 \uc815\ubcf4 \ubaa8\ub450\ub97c \uac00\uc838\uc634 > \ub7f0\ud0c0\uc784\uc5d0\ub3c4 \ucf54\ub4dc\uac00 \ub0a8\uc544\uc788\ub2e4.  "),(0,o.kt)("li",{parentName:"ul"},"\uc2e4\uc81c \uad6c\ud604\uc774 \ud544\uc694\ud55c \uacbd\uc6b0 \uc0ac\uc6a9\ud569\ub2c8\ub2e4")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},'// \ud0c0\uc785\uc73c\ub85c\ub9cc \uc0ac\uc6a9\ub420 \uacbd\uc6b0\nimport type { Message } from "ai";\nconst messages: Message[] = []; // OK\nconst message = new Message(); // \ucef4\ud30c\uc77c \uc5d0\ub7ec! Message\ub294 \ud0c0\uc785\uc73c\ub85c\ub9cc \uc874\uc7ac  \n\n// \uc2e4\uc81c \uad6c\ud604\uc774 \ud544\uc694\ud55c \uacbd\uc6b0\nimport { Message } from "ai";\nconst messages: Message[] = []; // OK\nconst message = new Message(); // OK, \uc2e4\uc81c \uad6c\ud604\uccb4\ub97c \uc0ac\uc6a9\ud560 \uc218 \uc788\uc74c  \n\n// \uc77c\ubd80\ub9cc type\uc73c\ub85c \uac00\uc838\uc624\ub294 \uacbd\uc6b0  \nimport { useEffect, useRef, type RefObject } from "react";\n\n')))}c.isMDXComponent=!0}}]);