"use strict";(self.webpackChunkdosimpact_blog=self.webpackChunkdosimpact_blog||[]).push([[7370],{3905:(e,t,n)=>{n.d(t,{Zo:()=>l,kt:()=>d});var r=n(67294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),c=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},l=function(e){var t=c(e.components);return r.createElement(p.Provider,{value:t},e.children)},u="mdxType",f={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,p=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),u=c(n),m=a,d=u["".concat(p,".").concat(m)]||u[m]||f[m]||o;return n?r.createElement(d,i(i({ref:t},l),{},{components:n})):r.createElement(d,i({ref:t},l))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=m;var s={};for(var p in t)hasOwnProperty.call(t,p)&&(s[p]=t[p]);s.originalType=e,s[u]="string"==typeof e?e:a,i[1]=s;for(var c=2;c<o;c++)i[c]=n[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},83295:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>i,default:()=>f,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var r=n(87462),a=(n(67294),n(3905));const o={sidebar_position:2},i="NextJS Essential 4 - API Reference",s={unversionedId:"g-fe/next/next2-4-api-reference",id:"g-fe/next/next2-4-api-reference",title:"NextJS Essential 4 - API Reference",description:"https://nextjs.org/docs/14/app/api-reference",source:"@site/docs/g-fe/5-next/next2-4-api-reference.md",sourceDirName:"g-fe/5-next",slug:"/g-fe/next/next2-4-api-reference",permalink:"/docs/g-fe/next/next2-4-api-reference",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/g-fe/5-next/next2-4-api-reference.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"frontEnd",previous:{title:"NextJS Essential 3 - Navigating",permalink:"/docs/g-fe/next/next2-3-Navigating"},next:{title:"NextJS Clone Spotify",permalink:"/docs/g-fe/next/next3-spotify-stack"}},p={},c=[{value:"File Conventions",id:"file-conventions",level:2}],l={toc:c},u="wrapper";function f(e){let{components:t,...n}=e;return(0,a.kt)(u,(0,r.Z)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"nextjs-essential-4---api-reference"},"NextJS Essential 4 - API Reference"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://nextjs.org/docs/14/app/api-reference"},"https://nextjs.org/docs/14/app/api-reference")),(0,a.kt)("h2",{id:"file-conventions"},"File Conventions"),(0,a.kt)("p",null,"default.js",(0,a.kt)("br",{parentName:"p"}),"\n","error.js",(0,a.kt)("br",{parentName:"p"}),"\n","instrumentation.js",(0,a.kt)("br",{parentName:"p"}),"\n","layout.js\nloading.js",(0,a.kt)("br",{parentName:"p"}),"\n","middleware.js\nnot-found.js  "),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"route segment \uc5d0\uc11c notFound \ud568\uc218\uac00 \ud638\ucd9c\ub418\uba74 \ubcf4\uc5ec\uc9c0\ub294 \ud654\uba74  "),(0,a.kt)("li",{parentName:"ul"},"app router \ub8e8\ud2b8\uc5d0 \uc704\uce58\ud55c\ub2e4.  ")),(0,a.kt)("p",null,"page.js  "),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-Js"},"export default function Page({\n  params,\n  searchParams,\n}: {\n  params: { slug: string }\n  searchParams: { [key: string]: string | string[] | undefined }\n}) {\n  return <h1>My Page</h1>\n}\n")),(0,a.kt)("p",null,"route.js\nRoute Segment Config",(0,a.kt)("br",{parentName:"p"}),"\n","template.js",(0,a.kt)("br",{parentName:"p"}),"\n","Metadata Files"))}f.isMDXComponent=!0}}]);