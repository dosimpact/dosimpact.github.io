"use strict";(self.webpackChunkdosimpact_blog=self.webpackChunkdosimpact_blog||[]).push([[6288],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>m});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),c=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=c(e.components);return r.createElement(s.Provider,{value:t},e.children)},u="mdxType",f={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=c(n),d=a,m=u["".concat(s,".").concat(d)]||u[d]||f[d]||o;return n?r.createElement(m,i(i({ref:t},p),{},{components:n})):r.createElement(m,i({ref:t},p))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[u]="string"==typeof e?e:a,i[1]=l;for(var c=2;c<o;c++)i[c]=n[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},9627:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>f,frontMatter:()=>o,metadata:()=>l,toc:()=>c});var r=n(7462),a=(n(7294),n(3905));const o={sidebar_position:7},i="Next + Lib",l={unversionedId:"g-fe/next/next007",id:"g-fe/next/next007",title:"Next + Lib",description:"- Next + Lib",source:"@site/docs/g-fe/5-next/next007.md",sourceDirName:"g-fe/5-next",slug:"/g-fe/next/next007",permalink:"/docs/g-fe/next/next007",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/g-fe/5-next/next007.md",tags:[],version:"current",sidebarPosition:7,frontMatter:{sidebar_position:7},sidebar:"frontEnd",previous:{title:"Next + TailwindCSS",permalink:"/docs/g-fe/next/next006"},next:{title:"Supabase Concepts",permalink:"/docs/g-fe/next/next008"}},s={},c=[{value:"react-spinners",id:"react-spinners",level:2},{value:"useage",id:"useage",level:3},{value:"ref",id:"ref",level:3},{value:"react-hot-toast",id:"react-hot-toast",level:2}],p={toc:c},u="wrapper";function f(e){let{components:t,...n}=e;return(0,a.kt)(u,(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"next--lib"},"Next + Lib"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#next--lib"},"Next + Lib"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#react-spinners"},"react-spinners"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#useage"},"useage")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#ref"},"ref")))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#react-hot-toast"},"react-hot-toast"))))),(0,a.kt)("h2",{id:"react-spinners"},"react-spinners"),(0,a.kt)("p",null,"kinetic loading \uc744 \ubcf4\uc5ec\uc904 \uc218 \uc788\ub2e4.  "),(0,a.kt)("h3",{id:"useage"},"useage"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'import { BounceLoader } from "react-spinners";\n\nexport const LoadingBox = () => {\n  return (\n    <Box>\n      <BounceLoader loading color="#22c55e" size={40} />\n    </Box>\n  );\n};\n\nexport default Box;\n\n')),(0,a.kt)("h3",{id:"ref"},"ref"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://www.davidhu.io/react-spinners/storybook/?path=/docs/bounceloader--main"},"https://www.davidhu.io/react-spinners/storybook/?path=/docs/bounceloader--main")),(0,a.kt)("hr",null),(0,a.kt)("h2",{id:"react-hot-toast"},"react-hot-toast"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\ubcc4\ub3c4\uc758 \uc778\uc2a4\ud134\uc2a4 \uc0c1\ud0dc\uad00\ub9ac\uac00 \ud544\uc694 \uc5c6\ub2e4.  "),(0,a.kt)("li",{parentName:"ul"},"Provider \ub123\uace0 \uc4f0\uba74 \ub41c\ub2e4.  ")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'"use client";\n\nimport { Toaster } from "react-hot-toast";\n\nconst ToasterProvider = () => {\n  return ( \n    <Toaster \n      toastOptions={{\n        style: {\n          background: \'#333\',\n          color: \'#fff\',\n        }\n      }}\n    /> \n  );\n}\n \nexport default ToasterProvider;\n---\nimport { toast } from "react-hot-toast";\n\n...\n  const handleLogout = async () => {\n    if (error) {\n      toast.error(error.message);\n    }\n  }\n\n')))}f.isMDXComponent=!0}}]);