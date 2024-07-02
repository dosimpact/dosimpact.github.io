"use strict";(self.webpackChunkdosimpact_blog=self.webpackChunkdosimpact_blog||[]).push([[6720],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>y});var n=r(67294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var p=n.createContext({}),s=function(e){var t=n.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},c=function(e){var t=s(e.components);return n.createElement(p.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,p=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),u=s(r),m=a,y=u["".concat(p,".").concat(m)]||u[m]||d[m]||o;return r?n.createElement(y,l(l({ref:t},c),{},{components:r})):n.createElement(y,l({ref:t},c))}));function y(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,l=new Array(o);l[0]=m;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i[u]="string"==typeof e?e:a,l[1]=i;for(var s=2;s<o;s++)l[s]=r[s];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},35457:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>p,contentTitle:()=>l,default:()=>d,frontMatter:()=>o,metadata:()=>i,toc:()=>s});var n=r(87462),a=(r(67294),r(3905));const o={sidebar_position:1},l="Jupyter Docker Server",i={unversionedId:"g-da/py/py002",id:"g-da/py/py002",title:"Jupyter Docker Server",description:"\uc18c\uac1c",source:"@site/docs/g-da/1-py/py002.md",sourceDirName:"g-da/1-py",slug:"/g-da/py/py002",permalink:"/docs/g-da/py/py002",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/g-da/1-py/py002.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"dataAnalytics",previous:{title:"python virtualenv \uc124\uc815\ubc95",permalink:"/docs/g-da/py/py001"},next:{title:"pandas \uae30\ubcf8 \uc815\ub9ac",permalink:"/docs/g-da/py/py003"}},p={},s=[{value:"\uc18c\uac1c",id:"\uc18c\uac1c",level:2},{value:"Docker Compose",id:"docker-compose",level:2},{value:"VsCode Extension",id:"vscode-extension",level:2},{value:"\uc8fc\ud53c\ud130 &gt; \ub3c4\ucee4 \uc5f0\uacb0",id:"\uc8fc\ud53c\ud130--\ub3c4\ucee4-\uc5f0\uacb0",level:2}],c={toc:s},u="wrapper";function d(e){let{components:t,...o}=e;return(0,a.kt)(u,(0,n.Z)({},c,o,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"jupyter-docker-server"},"Jupyter Docker Server"),(0,a.kt)("h2",{id:"\uc18c\uac1c"},"\uc18c\uac1c"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"VS Code \uc5d0\uc11c \uc8fc\ud53c\ud130 \ub178\ud2b8\ubd81\uc744 \uc0ac\uc6a9\ud558\uace0 \uc2f6\ub2e4.  "),(0,a.kt)("li",{parentName:"ul"},"\ub85c\uceec\uc758 \uac00\uc0c1\ud658\uacbd\uc758 python\ub3c4 \uc88b\uc9c0\ub9cc,"),(0,a.kt)("li",{parentName:"ul"},"\uc678\ubd80 \ud648\uc11c\ubc84\uc758 python \ubc31\uc564\ub4dc\uc11c\ubc84\ub97c \ud65c\uc6a9\ud558\uace0 \uc2f6\ub2e4.   ")),(0,a.kt)("h2",{id:"docker-compose"},"Docker Compose"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yml"},'# .env\nCONTENT_VOLUME_DIR=/Users/dosimpact/Volume/jupyter\nTOKEN=your_token_here\n---\n# docker-compose.yml\nversion: "0.2"\n\nservices:\n  jupyter:\n    image: jupyter/scipy-notebook:latest\n    restart: always\n    container_name: jupyter\n    ports:\n      - "8888:8888"\n    volumes:\n      - ${CONTENT_VOLUME_DIR}:/home/jovyan/work\n    command: start-notebook.sh --NotebookApp.token=${TOKEN}\n')),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\ud1a0\ud070\uc740 \ube44\ubc00\ubc88\ud638 \uc774\ub2e4.  "),(0,a.kt)("li",{parentName:"ul"},"\ud3ec\ud2b8 \ubc14\uc778\ub529\uc740 \uc790\uc720\ub86d\uac8c \ubc14\uafb8\uc5b4\ub3c4 \uc88b\ub2e4.  "),(0,a.kt)("li",{parentName:"ul"},"\ubcfc\ub968 \ub9c8\uc6b4\ud2b8\ub3c4 \ud544\uc694\ud558\ub2e4.  ")),(0,a.kt)("h2",{id:"vscode-extension"},"VsCode Extension"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Install Python",(0,a.kt)("br",{parentName:"li"}),(0,a.kt)("img",{alt:"Alt text",src:r(96803).Z,width:"742",height:"177"}),"  "),(0,a.kt)("li",{parentName:"ul"},"Install Jupyter",(0,a.kt)("br",{parentName:"li"}),(0,a.kt)("img",{alt:"Alt text",src:r(11106).Z,width:"745",height:"165"}),"  ")),(0,a.kt)("h2",{id:"\uc8fc\ud53c\ud130--\ub3c4\ucee4-\uc5f0\uacb0"},"\uc8fc\ud53c\ud130 > \ub3c4\ucee4 \uc5f0\uacb0"),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"Alt text",src:r(54509).Z,width:"929",height:"258"}),"  "),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\uc624\ub978\ucabd \uc0c1\ub2e8\uc5d0 \ucee4\ub110 \uc5f0\uacb0 \ubc84\ud2bc\uc774 \uc788\ub2e4.  "),(0,a.kt)("li",{parentName:"ul"},"\ubcf8\uc778\uc774 \uc62c\ub824\uc900 \uc11c\ubc84\uc5d0 \ub9de\ucd94\uc5b4 \uc5f0\uacb0\ud558\uba74 \ub05d.!")))}d.isMDXComponent=!0},96803:(e,t,r)=>{r.d(t,{Z:()=>n});const n=r.p+"assets/images/image-1-f5e2008b273d39bdc1c494752f96bff0.png"},11106:(e,t,r)=>{r.d(t,{Z:()=>n});const n=r.p+"assets/images/image-2-7c3e946d7a7e5bc9dab02e4fbab65bfc.png"},54509:(e,t,r)=>{r.d(t,{Z:()=>n});const n=r.p+"assets/images/image-3-24fda5404a0aaa32cfa682f2226f6f24.png"}}]);