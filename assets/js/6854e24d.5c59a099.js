"use strict";(self.webpackChunkdosimpact_blog=self.webpackChunkdosimpact_blog||[]).push([[363],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>f});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=r.createContext({}),s=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},p=function(e){var t=s(e.components);return r.createElement(c.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,c=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=s(n),m=o,f=u["".concat(c,".").concat(m)]||u[m]||d[m]||i;return n?r.createElement(f,a(a({ref:t},p),{},{components:n})):r.createElement(f,a({ref:t},p))}));function f(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,a=new Array(i);a[0]=m;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l[u]="string"==typeof e?e:o,a[1]=l;for(var s=2;s<i;s++)a[s]=n[s];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},1812:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>a,default:()=>d,frontMatter:()=>i,metadata:()=>l,toc:()=>s});var r=n(7462),o=(n(7294),n(3905));const i={sidebar_position:1},a="\ud575\uc2ec \uc774\ub860 - 1",l={unversionedId:"g-be/nest/theory/th01",id:"g-be/nest/theory/th01",title:"\ud575\uc2ec \uc774\ub860 - 1",description:"Dependency Injection & Inversion of Control (\uc758\uc874\uc131 \uc8fc\uc785 & \uc81c\uc5b4\uc758 \uc5ed\uc804)",source:"@site/docs/g-be/1-nest/1-theory/th01.md",sourceDirName:"g-be/1-nest/1-theory",slug:"/g-be/nest/theory/th01",permalink:"/docs/g-be/nest/theory/th01",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/g-be/1-nest/1-theory/th01.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"backEnd",previous:{title:"\uc774\ub860",permalink:"/docs/category/\uc774\ub860"},next:{title:"NestJS \uc2dc\uc791",permalink:"/docs/g-be/nest/ne001"}},c={},s=[{value:"Dependency Injection &amp; Inversion of Control (\uc758\uc874\uc131 \uc8fc\uc785 &amp; \uc81c\uc5b4\uc758 \uc5ed\uc804)",id:"dependency-injection--inversion-of-control-\uc758\uc874\uc131-\uc8fc\uc785--\uc81c\uc5b4\uc758-\uc5ed\uc804",level:2},{value:"Module, Provider \uadf8\ub9ac\uace0 Inversion of Control \ucf54\ub4dc\ub85c \uc774\ud574\ud558\uae30",id:"module-provider-\uadf8\ub9ac\uace0-inversion-of-control-\ucf54\ub4dc\ub85c-\uc774\ud574\ud558\uae30",level:2},{value:"AppModule\uacfc main.ts \ud30c\uc77c",id:"appmodule\uacfc-maints-\ud30c\uc77c",level:2}],p={toc:s},u="wrapper";function d(e){let{components:t,...i}=e;return(0,o.kt)(u,(0,r.Z)({},p,i,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"\ud575\uc2ec-\uc774\ub860---1"},"\ud575\uc2ec \uc774\ub860 - 1"),(0,o.kt)("h2",{id:"dependency-injection--inversion-of-control-\uc758\uc874\uc131-\uc8fc\uc785--\uc81c\uc5b4\uc758-\uc5ed\uc804"},"Dependency Injection & Inversion of Control (\uc758\uc874\uc131 \uc8fc\uc785 & \uc81c\uc5b4\uc758 \uc5ed\uc804)"),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"Alt text",src:n(1555).Z,width:"1108",height:"566"}),"  "),(0,o.kt)("p",null,"\uc758\uc874\uc131 \uc8fc\uc785 (DI)  "),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"A\ud074\ub798\uc2a4\uc758 \uc778\uc2a4\ud134\uc2a4\uac00 \uc791\ub3d9\ud558\ub824\uba74 B\ud074\ub798\uc2a4\uc758 \uc778\uc2a4\ud134\uc2a4\uac00 \uc788\uc5b4\uc57c \ud55c\ub2e4.  "),(0,o.kt)("li",{parentName:"ul"},"A\uac00 \uc0dd\uc131\ub420\ub54c B\uc758 \uc778\uc2a4\ud134\uc2a4\ub97c \ub0b4\ubd80 \ud504\ub85c\ud37c\ud2f0\ub85c \uac00\uc9c0\uace0 \uc788\ub2e4\uba74 \uc758\uc874\uc131\uc774 \uac15\ud558\uac8c \uacb0\ud569\ub418\uc5b4 \uc788\ub2e4.  "),(0,o.kt)("li",{parentName:"ul"},"\uc774\ub294 \ud14c\uc2a4\ud2b8\ub97c \uc5b4\ub835\uac8c \ub9cc\ub4e0\ub2e4.  "),(0,o.kt)("li",{parentName:"ul"},"\uadf8\ub798\uc11c A\uac00 \ud544\uc694\ub85c \ud558\ub294 B \ud074\ub798\uc2a4\uc758 \uc778\uc2a4\ud134\uc2a4\ub97c \uc678\ubd80\uc5d0\uc11c \ub123\uc5b4\uc8fc\ub294\uac83\uc774 DI \uc774\ub2e4 . ")),(0,o.kt)("p",null,"Inversion of Control"),(0,o.kt)("h2",{id:"module-provider-\uadf8\ub9ac\uace0-inversion-of-control-\ucf54\ub4dc\ub85c-\uc774\ud574\ud558\uae30"},"Module, Provider \uadf8\ub9ac\uace0 Inversion of Control \ucf54\ub4dc\ub85c \uc774\ud574\ud558\uae30"),(0,o.kt)("h2",{id:"appmodule\uacfc-maints-\ud30c\uc77c"},"AppModule\uacfc main.ts \ud30c\uc77c"))}d.isMDXComponent=!0},1555:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/image-d7158bcee6521e16a95127b9c9904575.png"}}]);