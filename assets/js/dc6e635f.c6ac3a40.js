"use strict";(self.webpackChunkdosimpact_blog=self.webpackChunkdosimpact_blog||[]).push([[7167],{3905:(e,t,a)=>{a.d(t,{Zo:()=>s,kt:()=>f});var r=a(67294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function c(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},l=Object.keys(e);for(r=0;r<l.length;r++)a=l[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)a=l[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var i=r.createContext({}),d=function(e){var t=r.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},s=function(e){var t=d(e.components);return r.createElement(i.Provider,{value:t},e.children)},p="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,l=e.originalType,i=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),p=d(a),m=n,f=p["".concat(i,".").concat(m)]||p[m]||u[m]||l;return a?r.createElement(f,o(o({ref:t},s),{},{components:a})):r.createElement(f,o({ref:t},s))}));function f(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var l=a.length,o=new Array(l);o[0]=m;var c={};for(var i in t)hasOwnProperty.call(t,i)&&(c[i]=t[i]);c.originalType=e,c[p]="string"==typeof e?e:n,o[1]=c;for(var d=2;d<l;d++)o[d]=a[d];return r.createElement.apply(null,o)}return r.createElement.apply(null,a)}m.displayName="MDXCreateElement"},59713:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>i,contentTitle:()=>o,default:()=>u,frontMatter:()=>l,metadata:()=>c,toc:()=>d});var r=a(87462),n=(a(67294),a(3905));const l={sidebar_position:3},o="React \uacf5\uc2dd\ubb38\uc11c API \ub808\ud37c\ub7f0\uc2a4",c={unversionedId:"g-fe/react/essential/react-es3",id:"g-fe/react/essential/react-es3",title:"React \uacf5\uc2dd\ubb38\uc11c API \ub808\ud37c\ub7f0\uc2a4",description:"createPortal",source:"@site/docs/g-fe/4-react/1-essential/react-es3.md",sourceDirName:"g-fe/4-react/1-essential",slug:"/g-fe/react/essential/react-es3",permalink:"/docs/g-fe/react/essential/react-es3",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/g-fe/4-react/1-essential/react-es3.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"frontEnd",previous:{title:"React \uacf5\uc2dd\ubb38\uc11c",permalink:"/docs/g-fe/react/essential/react-es1"},next:{title:"React Advanced Typescript",permalink:"/docs/g-fe/react/essential/react-es10"}},i={},d=[{value:"createPortal",id:"createportal",level:2},{value:"3.Portal\uc774 \uc788\ub294 \ubaa8\ub2ec \ub300\ud654 \uc0c1\uc790 \ub80c\ub354\ub9c1\ud558\uae30",id:"3portal\uc774-\uc788\ub294-\ubaa8\ub2ec-\ub300\ud654-\uc0c1\uc790-\ub80c\ub354\ub9c1\ud558\uae30",level:3},{value:"ant.design\uc758 Static Modal Method\ub294 ReactDOM.render \uc0ac\uc6a9\ud55c\ub2e4.",id:"antdesign\uc758-static-modal-method\ub294-reactdomrender-\uc0ac\uc6a9\ud55c\ub2e4",level:4},{value:"2.React \ucef4\ud3ec\ub10c\ud2b8\ub97c React\uac00 \uc544\ub2cc \uc11c\ubc84 \ub9c8\ud06c\uc5c5\uc73c\ub85c \ub80c\ub354\ub9c1\ud558\uae30",id:"2react-\ucef4\ud3ec\ub10c\ud2b8\ub97c-react\uac00-\uc544\ub2cc-\uc11c\ubc84-\ub9c8\ud06c\uc5c5\uc73c\ub85c-\ub80c\ub354\ub9c1\ud558\uae30",level:3},{value:"3.React \ucef4\ud3ec\ub10c\ud2b8\ub97c React\uac00 \uc544\ub2cc DOM \ub178\ub4dc\ub85c \ub80c\ub354\ub9c1\ud558\uae30",id:"3react-\ucef4\ud3ec\ub10c\ud2b8\ub97c-react\uac00-\uc544\ub2cc-dom-\ub178\ub4dc\ub85c-\ub80c\ub354\ub9c1\ud558\uae30",level:3}],s={toc:d},p="wrapper";function u(e){let{components:t,...a}=e;return(0,n.kt)(p,(0,r.Z)({},s,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"react-\uacf5\uc2dd\ubb38\uc11c-api-\ub808\ud37c\ub7f0\uc2a4"},"React \uacf5\uc2dd\ubb38\uc11c API \ub808\ud37c\ub7f0\uc2a4"),(0,n.kt)("h2",{id:"createportal"},"createPortal"),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},(0,n.kt)("a",{parentName:"p",href:"https://ko.react.dev/reference/react-dom/createPortal"},"https://ko.react.dev/reference/react-dom/createPortal"))),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},"import { createPortal } from 'react-dom';\n// ...\n<div>\n  <p>This child is placed in the parent div.</p>\n  {createPortal(\n    <p>This child is placed in the document body.</p>,\n    document.body\n  )}\n</div>\n")),(0,n.kt)("p",null,"1.createPortal \ud638\ucd9c \ub2f9\uc2dc domNode\uac00 \uc120\ud589\uc801\uc73c\ub85c \uc874\uc7ac\ud574\uc57c\ud55c\ub2e4.  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"domNode\uac00 \uc5c6\ub2e4\uba74 \ub80c\ub354\ub9c1\uc774 \uc548\ub41c\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"domNode\uac00 \uc0ad\uc81c\ub418\uba74 \ud3ec\ud138\ub3c4 \uc0ac\ub77c\uc9c4\ub2e4."),(0,n.kt)("li",{parentName:"ul"},"domNode\uac00 \ub3d9\uc801\uc73c\ub85c \ubcc0\uacbd\ub418\uba74 \ud3ec\ud138\ub3c4 \uc774\ub3d9\ud55c\ub2e4. (\ubb3c\ub860 \ubcc0\uacbd \ud6c4 createPortal \uc7ac\ud638\ucd9c )  ")),(0,n.kt)("p",null,"2.createPortal \ubc18\ud658\uac12\uc740 \ub9ac\uc561\ud2b8 \ub178\ub4dc\uc774\ub2e4. "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"React\uac00 \ub80c\ub354\ub9c1 \ucd9c\ub825\uc5d0\uc11c \uc774\ub97c \ubc1c\uacac\ud558\uba74, \uc81c\uacf5\ub41c children\uc744 \uc81c\uacf5\ub41c domNode \uc548\uc5d0 \ubc30\uce58  ")),(0,n.kt)("p",null,"3.\uc774\ubca4\ud2b8 \uc804\ud30c"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"DOM \ud2b8\ub9ac\uac00 \uc544\ub2cc React \ud2b8\ub9ac\uc5d0 \ub530\ub77c \uc804\ud30c ")),(0,n.kt)("h3",{id:"3portal\uc774-\uc788\ub294-\ubaa8\ub2ec-\ub300\ud654-\uc0c1\uc790-\ub80c\ub354\ub9c1\ud558\uae30"},"3.Portal\uc774 \uc788\ub294 \ubaa8\ub2ec \ub300\ud654 \uc0c1\uc790 \ub80c\ub354\ub9c1\ud558\uae30"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"createPortal \ubc18\ud658\uac12\uc744 \ub80c\ub354\ud2b8\ub9ac\uc5d0 \ud55c\ubc88\uc740 \ucc14\ub7ec \ub123\uc5b4\uc57c \ud55c\ub2e4.  ")),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},"import { createPortal } from 'react-dom';\n\nexport default function PortalExample() {\n  const [showModal, setShowModal] = useState(false);\n  return (\n    <>\n      <button onClick={() => setShowModal(true)}>\n        Show modal using a portal\n      </button>\n      {showModal && createPortal(\n        <ModalContent onClose={() => setShowModal(false)} />,\n        document.body\n      )}\n    </>\n  );\n}\n")),(0,n.kt)("h4",{id:"antdesign\uc758-static-modal-method\ub294-reactdomrender-\uc0ac\uc6a9\ud55c\ub2e4"},"ant.design\uc758 Static Modal Method\ub294 ReactDOM.render \uc0ac\uc6a9\ud55c\ub2e4."),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"https://ant.design/components/modal#why-i-can-not-access-context-redux-configprovider-localeprefixcls-in-modalxxx"},"https://ant.design/components/modal#why-i-can-not-access-context-redux-configprovider-localeprefixcls-in-modalxxx"),"   "),(0,n.kt)("p",null,"1.\uc7a5\uc810  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"provider\ub97c \uc81c\uacf5\ud558\uc9c0 \uc54a\uc544\ub3c4 \uc0ac\uc6a9 \uac00\ub2a5\ud55c static \ud568\uc218\uc774\ub2e4.",(0,n.kt)("br",{parentName:"li"}),"2.\ub2e8\uc810  "),(0,n.kt)("li",{parentName:"ul"},"\uae30\uc874 \ub80c\ub354 \ud2b8\ub9ac\uc758 context\uc5d0 \uc811\uadfc\uc774 \ubd88\uac00\ub2a5 \ud558\ub2e4.  ")),(0,n.kt)("h3",{id:"2react-\ucef4\ud3ec\ub10c\ud2b8\ub97c-react\uac00-\uc544\ub2cc-\uc11c\ubc84-\ub9c8\ud06c\uc5c5\uc73c\ub85c-\ub80c\ub354\ub9c1\ud558\uae30"},"2.React \ucef4\ud3ec\ub10c\ud2b8\ub97c React\uac00 \uc544\ub2cc \uc11c\ubc84 \ub9c8\ud06c\uc5c5\uc73c\ub85c \ub80c\ub354\ub9c1\ud558\uae30"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("inlineCode",{parentName:"li"},'<div id="root">')," \uc5d0 \ub9ac\uc561\ud2b8 \ubcf8\ub798 \ub80c\ub354 \ud2b8\ub9ac\ub97c \ub123\ub294\ub2e4."),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("inlineCode",{parentName:"li"},'<div class="sidebar">')," \uc11c\ubc84\uc0ac\uc774\ub4dc\uc758 \ud2b9\uc815 \ub9c8\ud06c\uc5c5\uc744 \ub123\ub294\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("inlineCode",{parentName:"li"},'<div id="sidebar-content">')," \uc5d0 \ub9ac\uc561\ud2b8 \ud3ec\ud138\uc744 \uc774\uc6a9\ud574\uc11c \ucef4\ud3ec\ub10c\ud2b8\ub97c \ub123\ub294\ub2e4.  ")),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-html"},'<!DOCTYPE html>\n<html>\n  <head><title>My app</title></head>\n  <body>\n    <h1>Welcome to my hybrid app</h1>\n    <div class="parent">\n      <div class="sidebar">\n        This is server non-React markup\n        <div id="sidebar-content"></div>\n      </div>\n      <div id="root"></div>\n    </div>\n  </body>\n</html>\n')),(0,n.kt)("h3",{id:"3react-\ucef4\ud3ec\ub10c\ud2b8\ub97c-react\uac00-\uc544\ub2cc-dom-\ub178\ub4dc\ub85c-\ub80c\ub354\ub9c1\ud558\uae30"},"3.React \ucef4\ud3ec\ub10c\ud2b8\ub97c React\uac00 \uc544\ub2cc DOM \ub178\ub4dc\ub85c \ub80c\ub354\ub9c1\ud558\uae30"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\uc11c\ub4dc \ud30c\ud2f0 \uc9c0\ub3c4 \ub77c\uc774\ube0c\ub7ec\ub9ac\uc5d0 \ud234\ud301\uc774 \uc874\uc7ac, \uadf8\uacf3\uc5d0 DOM Node\ub97c \ud558\ub098 \ub9cc\ub4e4\uc5b4 \ub9ac\uc561\ud2b8 \ucef4\ud3ec\ub10c\ud2b8 \ub123\uae30.     "),(0,n.kt)("li",{parentName:"ul"},"ag grid\uc5d0 \uc81c\uacf5\ud558\ub294 \ud14c\uc774\ube14 \ucef4\ud3ec\ub10c\ud2b8\uc5d0 DOM Node\ub97c \ud558\ub098 \uc120\ud0dd\ud55c\ub2e4. \uadf8\uacf3\uc5d0 \ub9ac\uc561\ud2b8 \ucef4\ud3ec\ub10c\ud2b8 \ub123\uae30.  ",(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"*\ucc28\ub9ac\ub9ac \uc21c\uc218 DOM\uc744 \uc9c1\uc811 \uc870\uc791\ud558\ub294\uac83\uc774 \ub098\uc744 \uc218 \uc788\ub2e4.")))))}u.isMDXComponent=!0}}]);