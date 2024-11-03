"use strict";(self.webpackChunkdosimpact_blog=self.webpackChunkdosimpact_blog||[]).push([[5842],{3905:(r,e,t)=>{t.d(e,{Zo:()=>p,kt:()=>m});var s=t(67294);function n(r,e,t){return e in r?Object.defineProperty(r,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):r[e]=t,r}function o(r,e){var t=Object.keys(r);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(r);e&&(s=s.filter((function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable}))),t.push.apply(t,s)}return t}function a(r){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?o(Object(t),!0).forEach((function(e){n(r,e,t[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(t,e))}))}return r}function i(r,e){if(null==r)return{};var t,s,n=function(r,e){if(null==r)return{};var t,s,n={},o=Object.keys(r);for(s=0;s<o.length;s++)t=o[s],e.indexOf(t)>=0||(n[t]=r[t]);return n}(r,e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(r);for(s=0;s<o.length;s++)t=o[s],e.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(r,t)&&(n[t]=r[t])}return n}var c=s.createContext({}),l=function(r){var e=s.useContext(c),t=e;return r&&(t="function"==typeof r?r(e):a(a({},e),r)),t},p=function(r){var e=l(r.components);return s.createElement(c.Provider,{value:e},r.children)},u="mdxType",f={inlineCode:"code",wrapper:function(r){var e=r.children;return s.createElement(s.Fragment,{},e)}},d=s.forwardRef((function(r,e){var t=r.components,n=r.mdxType,o=r.originalType,c=r.parentName,p=i(r,["components","mdxType","originalType","parentName"]),u=l(t),d=n,m=u["".concat(c,".").concat(d)]||u[d]||f[d]||o;return t?s.createElement(m,a(a({ref:e},p),{},{components:t})):s.createElement(m,a({ref:e},p))}));function m(r,e){var t=arguments,n=e&&e.mdxType;if("string"==typeof r||n){var o=t.length,a=new Array(o);a[0]=d;var i={};for(var c in e)hasOwnProperty.call(e,c)&&(i[c]=e[c]);i.originalType=r,i[u]="string"==typeof r?r:n,a[1]=i;for(var l=2;l<o;l++)a[l]=t[l];return s.createElement.apply(null,a)}return s.createElement.apply(null,t)}d.displayName="MDXCreateElement"},9790:(r,e,t)=>{t.r(e),t.d(e,{assets:()=>c,contentTitle:()=>a,default:()=>f,frontMatter:()=>o,metadata:()=>i,toc:()=>l});var s=t(87462),n=(t(67294),t(3905));const o={sidebar_position:2},a="TS 4 - Asserts",i={unversionedId:"g-fe/ts/typescript/ts04-assert",id:"g-fe/ts/typescript/ts04-assert",title:"TS 4 - Asserts",description:"asserts",source:"@site/docs/g-fe/2-ts/0-typescript/ts04-assert.md",sourceDirName:"g-fe/2-ts/0-typescript",slug:"/g-fe/ts/typescript/ts04-assert",permalink:"/docs/g-fe/ts/typescript/ts04-assert",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/g-fe/2-ts/0-typescript/ts04-assert.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"frontEnd",previous:{title:"TS 2",permalink:"/docs/g-fe/ts/typescript/ts02"},next:{title:"TS 5 - Generic",permalink:"/docs/g-fe/ts/typescript/ts05-generic"}},c={},l=[{value:"asserts",id:"asserts",level:2},{value:"asserts condition",id:"asserts-condition",level:3},{value:"asserts error is AxiosError",id:"asserts-error-is-axioserror",level:3}],p={toc:l},u="wrapper";function f(r){let{components:e,...t}=r;return(0,n.kt)(u,(0,s.Z)({},p,t,{components:e,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"ts-4---asserts"},"TS 4 - Asserts"),(0,n.kt)("h2",{id:"asserts"},"asserts"),(0,n.kt)("p",null,"1.\ud0c0\uc785\uc2a4\ud06c\ub9bd\ud2b8\uc5d0\uc11c \ud0c0\uc785\uc744 \uc881\ud788\uae30 \uc704\ud574\uc11c \uc0ac\uc6a9\ud55c\ub2e4.  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\ud504\ub9ac\ubbf8\ud2f0\ube0c \ud0c0\uc785 : asserts condition \ud568\uc218  "),(0,n.kt)("li",{parentName:"ul"},"\uac1d\uccb4 \ud0c0\uc785 : asserts error is AxiosError \ub4f1 \uad6c\ubb38 \uc0ac\uc6a9  ",(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"\uc608) try..catch \uc560\ub7ec\uc5d0\uc11c catch\ub41c \uc560\ub7ec\uc758 \uacbd\uc6b0\uc5d0\ub294 \ud0c0\uc785\uc774 unknown\uc774\ub2e4. \uc774\ub97c \uc704\ud574 assertion\uc744 \uc0ac\uc6a9\ud558\uba74 \ud0c0\uc785\uc744 \uc881\ud790 \uc218 \uc787\ub2e4.  ")))),(0,n.kt)("p",null,"2.Asserts\uc740 \ud654\uc0b4\ud45c \ud568\uc218 \ub300\uc2e0 '\ud568\uc218'\ub85c \uad6c\ud604\ud574\uc57c \ud55c\ub2e4.  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\ud568\uc218 \uc120\uc5b8\uacfc \ub2ec\ub9ac \ud0c0\uc785 \ucd94\ub860\uc774 \uc81c\ub300\ub85c \ub418\uc9c0 \uc54a\ub294\ub2e4.  ")),(0,n.kt)("h3",{id:"asserts-condition"},"asserts condition"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},"function assert(condition: boolean, message: string): asserts condition {\n    if (!condition) {\n        throw new Error(message);\n    }\n}\n---\nconst value: number | null = 5;\nassert(value !== null, 'Value should not be null');\n// \uc774\ud6c4\uc758 \ucf54\ub4dc\uc5d0\uc11c\ub294 value\uac00 null\uc774 \uc544\ub2d8\uc744 \ubcf4\uc7a5\ubc1b\uc2b5\ub2c8\ub2e4.\nconsole.log(value.toFixed(2));\n")),(0,n.kt)("h3",{id:"asserts-error-is-axioserror"},"asserts error is AxiosError"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},"export function assertAxiosError(err: unknown): asserts err is AxiosError {\n  if (typeof err === 'object' && err !== null && 'isAxiosError' in err) {\n    return;\n  }\n  throw err;\n}\n\n---\nimport axios, { AxiosError } from 'axios';\n\nfunction assertIsAxiosError(error: any): asserts error is AxiosError {\n    if (!axios.isAxiosError(error)) {\n        throw new Error('The error is not an AxiosError');\n    }\n}\n---\n     async function fetchData(url: string) {\n         try {\n             const response = await axios.get(url);\n             console.log(response.data);\n         } catch (error) {\n             assertIsAxiosError(error); // \uc5ec\uae30\uc11c error\uac00 AxiosError\uc784\uc744 \ud655\uc778\n             console.error('Axios error message:', error.message);\n             console.error('Axios error config:', error.config);\n             // \uc774\ud6c4\uc5d0\ub294 error\uac00 AxiosError \ud0c0\uc785\uc784\uc744 \ubcf4\uc7a5\ubc1b\uc2b5\ub2c8\ub2e4.\n         }\n     }\n\nfetchData('https://jsonplaceholder.typicode.com/posts');\n")))}f.isMDXComponent=!0}}]);