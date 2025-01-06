"use strict";(self.webpackChunkdosimpact_blog=self.webpackChunkdosimpact_blog||[]).push([[2255],{3905:(e,t,n)=>{n.d(t,{Zo:()=>i,kt:()=>m});var a=n(67294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),u=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},i=function(e){var t=u(e.components);return a.createElement(s.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},f=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,s=e.parentName,i=c(e,["components","mdxType","originalType","parentName"]),p=u(n),f=r,m=p["".concat(s,".").concat(f)]||p[f]||d[f]||l;return n?a.createElement(m,o(o({ref:t},i),{},{components:n})):a.createElement(m,o({ref:t},i))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,o=new Array(l);o[0]=f;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c[p]="string"==typeof e?e:r,o[1]=c;for(var u=2;u<l;u++)o[u]=n[u];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}f.displayName="MDXCreateElement"},43359:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>d,frontMatter:()=>l,metadata:()=>c,toc:()=>u});var a=n(87462),r=(n(67294),n(3905));const l={sidebar_position:1},o="\ud074\ub9b0\ucf54\ub4dc \ub9ac\uc561\ud2b8 1",c={unversionedId:"g-fe/clean-code/clean-react/cc-react-1",id:"g-fe/clean-code/clean-react/cc-react-1",title:"\ud074\ub9b0\ucf54\ub4dc \ub9ac\uc561\ud2b8 1",description:"1.State",source:"@site/docs/g-fe/10-clean-code/1-clean-react/cc-react-1.md",sourceDirName:"g-fe/10-clean-code/1-clean-react",slug:"/g-fe/clean-code/clean-react/cc-react-1",permalink:"/docs/g-fe/clean-code/clean-react/cc-react-1",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/g-fe/10-clean-code/1-clean-react/cc-react-1.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"frontEnd",previous:{title:"1.\ud074\ub9b0\ucf54\ub4dc \ub9ac\uc561\ud2b8",permalink:"/docs/category/1\ud074\ub9b0\ucf54\ub4dc-\ub9ac\uc561\ud2b8"},next:{title:"Clean Code 1",permalink:"/docs/g-fe/clean-code/clean-code-01"}},s={},u=[{value:"1.State",id:"1state",level:2},{value:"\ucd08\uae30\uac12 \uc124\uc815\uc740 \ubc18\ub4dc\uc2dc",id:"\ucd08\uae30\uac12-\uc124\uc815\uc740-\ubc18\ub4dc\uc2dc",level:2},{value:"\ub80c\ub354\ub9c1 \uc2f8\uc774\ud074\uc5d0 \uac78\ub9ac\uc9c0 \uc54a\ub294 \ubcc0\uc218\ub294 \ucef4\ud3ec\ub10c\ud2b8 \uc678\ubd80\ub85c",id:"\ub80c\ub354\ub9c1-\uc2f8\uc774\ud074\uc5d0-\uac78\ub9ac\uc9c0-\uc54a\ub294-\ubcc0\uc218\ub294-\ucef4\ud3ec\ub10c\ud2b8-\uc678\ubd80\ub85c",level:2},{value:"\ubd88\ud544\uc694\ud55c \uc0c1\ud0dc \uc81c\uac70\ud558\uae30",id:"\ubd88\ud544\uc694\ud55c-\uc0c1\ud0dc-\uc81c\uac70\ud558\uae30",level:2},{value:"useState \ub300\uc2e0 useRef",id:"usestate-\ub300\uc2e0-useref",level:2},{value:"\uc5f0\uad00\ub41c \uc0c1\ud0dc \ub2e8\uc21c\ud654\ud558\uae30",id:"\uc5f0\uad00\ub41c-\uc0c1\ud0dc-\ub2e8\uc21c\ud654\ud558\uae30",level:3},{value:"\ucee4\uc2a4\ud140 \ud6c5 \ucd94\ucd9c\ud558\uae30",id:"\ucee4\uc2a4\ud140-\ud6c5-\ucd94\ucd9c\ud558\uae30",level:3},{value:"\uc774\uc804 \uc0c1\ud0dc \ud65c\uc6a9\ud558\uae30",id:"\uc774\uc804-\uc0c1\ud0dc-\ud65c\uc6a9\ud558\uae30",level:3}],i={toc:u},p="wrapper";function d(e){let{components:t,...n}=e;return(0,r.kt)(p,(0,a.Z)({},i,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"\ud074\ub9b0\ucf54\ub4dc-\ub9ac\uc561\ud2b8-1"},"\ud074\ub9b0\ucf54\ub4dc \ub9ac\uc561\ud2b8 1"),(0,r.kt)("h2",{id:"1state"},"1.State"),(0,r.kt)("h2",{id:"\ucd08\uae30\uac12-\uc124\uc815\uc740-\ubc18\ub4dc\uc2dc"},"\ucd08\uae30\uac12 \uc124\uc815\uc740 \ubc18\ub4dc\uc2dc"),(0,r.kt)("p",null,"\ucd08\uae30\uac12\ub3c4 UI\uc5d0 \ubcf4\uc774\ub294 \uac12  "),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"\ucd08\uae30 \ub80c\ub354\ub9c1\uc5d0 \uc21c\uac04\uc801\uc73c\ub85c \ubcf4\uc774\ub294 \uac12\uc774\ub2e4.  ")),(0,r.kt)("p",null,"\ucd08\uae30\uac12\uc774 \uc5c6\ub2e4\uba74?  "),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"\ud0c0\uc785\ubd88\uc77c\uce58 \uc774\uc288 "),(0,r.kt)("li",{parentName:"ul"},"undefined\ub85c \ub7f0\ud0c0\uc784 \uc560\ub7ec  "),(0,r.kt)("li",{parentName:"ul"},"\ub80c\ub354\ub9c1 \uc774\uc288 \ud639\uc740 \ubb34\ud55c \ub8e8\ud504  "),(0,r.kt)("li",{parentName:"ul"},"\uc6d0\uc0c1\ud0dc\ub85c \uc5b4\ub5bb\uac8c \ubcf5\uad6c \ud560\uc9c0 \uba85\uc2dc  "),(0,r.kt)("li",{parentName:"ul"},"null \ubc29\uc5b4 \ucf54\ub4dc \uc904\uc774\uae30  ")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"const MyComponent = () => {\n    const [items, setItems] = useState(); // \ucd08\uae30\uac12 \uc124\uc815 \uc5c6\uc74c\n\n    return (\n        <ul>\n            {items.map(item => (\n                <li key={item.id}>{item.name}</li>\n            ))}\n        </ul>\n    );\n};\n")),(0,r.kt)("h2",{id:"\ub80c\ub354\ub9c1-\uc2f8\uc774\ud074\uc5d0-\uac78\ub9ac\uc9c0-\uc54a\ub294-\ubcc0\uc218\ub294-\ucef4\ud3ec\ub10c\ud2b8-\uc678\ubd80\ub85c"},"\ub80c\ub354\ub9c1 \uc2f8\uc774\ud074\uc5d0 \uac78\ub9ac\uc9c0 \uc54a\ub294 \ubcc0\uc218\ub294 \ucef4\ud3ec\ub10c\ud2b8 \uc678\ubd80\ub85c"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"// \ucef4\ud3ec\ub10c\ud2b8 \uc678\ubd80\uc5d0 \ubcc0\uc218\ub97c \uc815\uc758\nlet externalVariable = 0;\n\nconst MyComponent = () => {\n    const [count, setCount] = useState(0);\n\n    const handleClick = () => {\n        setCount(count + 1);\n        externalVariable += 1; // \uc678\ubd80 \ubcc0\uc218\ub97c \uc5c5\ub370\uc774\ud2b8\n    };\n\n    return (\n        <div>\n            <p>Count: {count}</p>\n            <p>External Variable: {externalVariable}</p>\n            <button onClick={handleClick}>Increment</button>\n        </div>\n    );\n};\n")),(0,r.kt)("h2",{id:"\ubd88\ud544\uc694\ud55c-\uc0c1\ud0dc-\uc81c\uac70\ud558\uae30"},"\ubd88\ud544\uc694\ud55c \uc0c1\ud0dc \uc81c\uac70\ud558\uae30"),(0,r.kt)("p",null,"useState, useEffect\ub294 \uc904\uc77c \uc218 \uc788\ub2e4.  "),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"computed field\ub97c \uc0ac\uc6a9\ud558\ub294 \uac83 ( \ub2e8, \ub9ac\ub80c\ub354\ub9c1 \uc804\uc81c )   ")),(0,r.kt)("p",null,"1.\ud50c\ub798\uadf8 \uc0c1\ud0dc\ub85c \ubc14\uafb8\uae30"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"const MyComponent = () => {\n    const [isLogin, setIsLogin] = useState(0);\n\n    useEffect(()=>{\n        if(a) setIsLogin(true);\n        if(b) setIsLogin(true);\n    },[a,b])\n};\n---\nconst MyComponent = () => {\n   const isLogin = a || b  \n};\n")),(0,r.kt)("p",null,"2.\ubd88\ud544\uc694\ud55c \uc0c1\ud0dc \uc81c\uac70\ud558\uae30"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"const MyComponent = () => {\n    const [userList, setUserList] = useState([]);\n    const [activeUserList, setActiveUserList] = useState([]);\n\n    useEffect(()=>{\n        const filteredUserList = userList.filter(...)\n        setActiveUserList(filteredUserList)\n    },[userList])\n};\n---\nconst MyComponent = () => {\n    const [userList, setUserList] = useState([]);\n    const activeUserList = userList.filter(...)\n};\n")),(0,r.kt)("h2",{id:"usestate-\ub300\uc2e0-useref"},"useState \ub300\uc2e0 useRef"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"useRef\ub294 \ucef4\ud3ec\ub10c\ud2b8 \ub77c\uc774\ud504\uc2f8\uc774\ud074 \ub3d9\uc548 \uc720\uc9c0\ub418\ub294 static \uc131\uaca9\uc758 \uac12\uc774\ub2e4. (\uac00\ubcc0 \ucee8\ud14c\uc774\ub108)  ",(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"useRef \uac12\uc774 \ubcc0\uacbd\ub418\uc5b4\ub3c4 \ub9ac\ub80c\ub354\ub9c1\uc744 \ubc1c\uc0dd\uc2dc\ud0a4\uc9c0 \uc54a\ub294\ub2e4.  "),(0,r.kt)("li",{parentName:"ul"},"useRef\uc5d0 \uc758\ud55c computedValue \uac12\uc774 \ubcc0\uacbd\ub418\uc5b4\ub3c4 \ub9ac\ub80c\ub354\ub9c1\uc744 \ubc1c\uc0dd\uc2dc\ud0a4\uc9c0 \uc54a\ub294\ub2e4.  "),(0,r.kt)("li",{parentName:"ul"},"useState, props\uc758 \ubcc0\ud654\uc5d0 \uc758\ud574 \ubcc0\uacbd\ub41c useRef \uac12, computedValue\uc774 UI\uc5d0 \ubc18\uc601\ub41c\ub2e4.  ")))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"import React, { useRef, useState } from 'react';\n\nexport function App() {\n  const valueRef = useRef(10); // \uae30\ubcf8\uac12 \uc124\uc815\n  const computedValue = valueRef.current * 2; // \uacc4\uc0b0\ub41c \uac12\n\n  const [state, setState] = useState(0);\n\n  const updateRef = () => {\n    valueRef.current += 5; // \uac12 \uc99d\uac00\n    console.log('valueRef:', valueRef.current, 'computedValue:', computedValue);\n  };\n\n  const forceRender = () => {\n    setState(prev => prev + 1);\n  };\n\n  return (\n    <div>\n      <p>\ud604\uc7ac \uac12: {valueRef.current}</p>\n      <p>Computed \uac12: {computedValue}</p>\n      <button onClick={updateRef}>useRef \uac12 \ubcc0\uacbd</button>\n      <button onClick={forceRender}>\ub9ac\ub80c\ub354\ub9c1 \uac15\uc81c \uc2e4\ud589</button>\n    </div>\n  );\n}\n// Log to console\nconsole.log('Hello console');\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"export const component = ()=>{\n    const isMount = useRef(false);\n    useEffect(()=>{\n        isMount.current = true;\n        return ()=> isMount.current = false;\n    },[])\n}\n")),(0,r.kt)("h3",{id:"\uc5f0\uad00\ub41c-\uc0c1\ud0dc-\ub2e8\uc21c\ud654\ud558\uae30"},"\uc5f0\uad00\ub41c \uc0c1\ud0dc \ub2e8\uc21c\ud654\ud558\uae30"),(0,r.kt)("p",null,"1.\uc5f0\uad00\ub41c \uc0c1\ud0dc, sequence \uac19\uc740 \uc0c1\ud0dc\ub294 enum \ubb36\uc5b4\uc11c \ucc98\ub9ac\ud560 \uc218 \uc788\ub294 \ubc29\ubc95\uc774 \uc788\ub2e4.",(0,r.kt)("br",{parentName:"p"}),"\n","2.\uc5f0\uad00\ub41c \uc0c1\ud0dc, state diagram \uac19\uc740 \uc0c1\ud0dc\ub294 object \ubb36\uc5b4\uc11c \ucc98\ub9ac\ud560 \uc218 \uc788\ub294 \ubc29\ubc95\uc774 \uc788\ub2e4.",(0,r.kt)("br",{parentName:"p"}),"\n","3.\uc774\ub7ec\ud55c \uc5f0\uad00\ub41c \uc0c1\ud0dc\ub294 useReducer\ub85c \ub9ac\ud329\ud130\ub9c1 \uac00\ub2a5\ud558\ub2e4.  "),(0,r.kt)("h3",{id:"\ucee4\uc2a4\ud140-\ud6c5-\ucd94\ucd9c\ud558\uae30"},"\ucee4\uc2a4\ud140 \ud6c5 \ucd94\ucd9c\ud558\uae30"),(0,r.kt)("p",null,"1.\ub85c\uc9c1\uc5d0 \ub530\ub77c\uc11c \ucee4\uc2a4\ud140 \ud6c5 \ucd94\ucd9c\ud558\uae30  "),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"filter hook, pagination hook\n2.\uc5ed\ud560\uc5d0 \ub530\ub77c\uc11c \ucee4\uc2a4\ud140 \ud6c5 \ucd94\ucd9c\ud558\uae30  "),(0,r.kt)("li",{parentName:"ul"},"\uc5ed\ud560 : state, computed field, function, useEffect  ")),(0,r.kt)("h3",{id:"\uc774\uc804-\uc0c1\ud0dc-\ud65c\uc6a9\ud558\uae30"},"\uc774\uc804 \uc0c1\ud0dc \ud65c\uc6a9\ud558\uae30"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"\uc544\ub798 \uc608\uc2dc\ucc98\ub7fc \ud578\ub4e4\ub7ec \ud568\uc218 \ub0b4 state\ub97c \uc9c1\uc811 \ucc38\uc870\ud558\ub294\uac83\uc740 \uc608\uc0c1\uce58 \ubabb\ud55c \ubc84\uadf8\uac00 \ubc1c\uc0dd\ud560 \uc218 \uc788\ub2e4.    ")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"export function App() {\n  const [state, setState] = useState(0);\n\n  const handler1 = () => {\n    setState(state + 1)\n     // =>setState(prev => prev + 1)\n  };\n\n  const handler2 = () => {\n    setState(state + 1)\n  };\n}\n")))}d.isMDXComponent=!0}}]);