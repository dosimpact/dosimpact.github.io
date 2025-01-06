"use strict";(self.webpackChunkdosimpact_blog=self.webpackChunkdosimpact_blog||[]).push([[6489],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>d});var a=n(67294);function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){l(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,l=function(e,t){if(null==e)return{};var n,a,l={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(l[n]=e[n]);return l}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(l[n]=e[n])}return l}var u=a.createContext({}),p=function(e){var t=a.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=p(e.components);return a.createElement(u.Provider,{value:t},e.children)},m="mdxType",s={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},k=a.forwardRef((function(e,t){var n=e.components,l=e.mdxType,r=e.originalType,u=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),m=p(n),k=l,d=m["".concat(u,".").concat(k)]||m[k]||s[k]||r;return n?a.createElement(d,i(i({ref:t},c),{},{components:n})):a.createElement(d,i({ref:t},c))}));function d(e,t){var n=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var r=n.length,i=new Array(r);i[0]=k;var o={};for(var u in t)hasOwnProperty.call(t,u)&&(o[u]=t[u]);o.originalType=e,o[m]="string"==typeof e?e:l,i[1]=o;for(var p=2;p<r;p++)i[p]=n[p];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}k.displayName="MDXCreateElement"},80281:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>i,default:()=>s,frontMatter:()=>r,metadata:()=>o,toc:()=>p});var a=n(87462),l=(n(67294),n(3905));const r={sidebar_position:1},i="Clean Code 1",o={unversionedId:"g-fe/clean-code/clean-code-01",id:"g-fe/clean-code/clean-code-01",title:"Clean Code 1",description:"\uac8c\uc288\ud0c8\ud2b8 \ubc95\uce59\uc73c\ub85c \uc774\ud574\ud558\ub294 \ud074\ub9b0\ucf54\ub4dc: \uac00\ub3c5\uc131\uc758 \ube44\ubc00",source:"@site/docs/g-fe/10-clean-code/clean-code-01.md",sourceDirName:"g-fe/10-clean-code",slug:"/g-fe/clean-code/clean-code-01",permalink:"/docs/g-fe/clean-code/clean-code-01",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/g-fe/10-clean-code/clean-code-01.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"frontEnd",previous:{title:"\ud074\ub9b0\ucf54\ub4dc \ub9ac\uc561\ud2b8 1",permalink:"/docs/g-fe/clean-code/clean-react/cc-react-1"},next:{title:"Clean Code 2",permalink:"/docs/g-fe/clean-code/clean-code-02"}},u={},p=[{value:"\ud83d\udccc \uc88b\uc740 \uad6c\uc870\ub97c \ub9cc\ub4dc\ub294 \uc6d0\uce59",id:"-\uc88b\uc740-\uad6c\uc870\ub97c-\ub9cc\ub4dc\ub294-\uc6d0\uce59",level:2},{value:"\uacf5\ud1b5\uc601\uc5ed\uc758 \uc6d0\uce59 (Common Region)",id:"\uacf5\ud1b5\uc601\uc5ed\uc758-\uc6d0\uce59-common-region",level:4},{value:"\uc720\uc0ac\uc131\uc758 \uc6d0\uce59 (Similarity)",id:"\uc720\uc0ac\uc131\uc758-\uc6d0\uce59-similarity",level:4},{value:"\uc5f0\uc18d\uc131\uc758 \uc6d0\uce59 (Continuation)",id:"\uc5f0\uc18d\uc131\uc758-\uc6d0\uce59-continuation",level:4},{value:"\ud83d\udccc \uc88b\uc740 \uc774\ub984 \uc9d3\uae30",id:"-\uc88b\uc740-\uc774\ub984-\uc9d3\uae30",level:2},{value:"\ub9ac\ud329\ud1a0\ub9c1",id:"\ub9ac\ud329\ud1a0\ub9c1",level:2}],c={toc:p},m="wrapper";function s(e){let{components:t,...n}=e;return(0,l.kt)(m,(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"clean-code-1"},"Clean Code 1"),(0,l.kt)("p",null,"\uac8c\uc288\ud0c8\ud2b8 \ubc95\uce59\uc73c\ub85c \uc774\ud574\ud558\ub294 \ud074\ub9b0\ucf54\ub4dc: \uac00\ub3c5\uc131\uc758 \ube44\ubc00  "),(0,l.kt)("blockquote",null,(0,l.kt)("p",{parentName:"blockquote"},(0,l.kt)("a",{parentName:"p",href:"https://velog.io/@teo/cleancode"},"https://velog.io/@teo/cleancode"),"    ")),(0,l.kt)("p",null,"\ud074\ub9b0\ucf54\ub4dc\uc758 \ud2b9\uc9d5  "),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\uac00\ub3c5\uc131 : \uc88b\uc740 \ucf54\ub4dc\ub294 \uc77d\uae30 \uc27d\uace0 \uc774\ud574\ud558\uae30 \uc27d\uc2b5\ub2c8\ub2e4.  "),(0,l.kt)("li",{parentName:"ul"},"\uc720\uc9c0\ubcf4\uc218\uc131 : \uc88b\uc740 \ucf54\ub4dc\ub294 \uc218\uc815\uc0ac\ud56d\uc5d0 \ub300\uc751\ud558\uae30 \uc26c\uc6b0\uba70, \uc218\uc815\uc5d0 \ub3c5\ub9bd\uc801\uc774\uace0 \ucc3e\uae30 \uc27d\uc2b5\ub2c8\ub2e4.  "),(0,l.kt)("li",{parentName:"ul"},"\ud655\uc7a5\uc131 : \uc88b\uc740 \ucf54\ub4dc\ub294 \uc0c8\ub85c\uc6b4 \uae30\ub2a5\uc744 \ucd94\uac00\ud560 \ub54c, \uae30\uc874 \ucf54\ub4dc\ub97c \ud06c\uac8c \uc218\uc815\ud558\uc9c0 \uc54a\uc744 \uc218 \uc788\uc2b5\ub2c8\ub2e4.  "),(0,l.kt)("li",{parentName:"ul"},"\uacac\uace0\uc131 : \uc88b\uc740 \ucf54\ub4dc\ub294 \uc5d0\ub7ec\uac00 \ubc1c\uc0dd\ud588\uc744 \uacbd\uc6b0\uc5d0\ub3c4 \ub3d9\uc791\ud558\uac70\ub098 \ub300\uc751\ud558\uace0, \uc5d0\ub7ec\ub97c \ubc1c\uacac\ud558\uae30 \uc27d\uc2b5\ub2c8\ub2e4.  "),(0,l.kt)("li",{parentName:"ul"},"\ud14c\uc2a4\ud2b8 \uac00\ub2a5\uc131 : \uc88b\uc740 \ucf54\ub4dc\ub294 \ud14c\uc2a4\ud2b8\ub97c \uc791\uc131\ud558\uae30 \uc26c\uc6b0\uba70, \ub2e8\uc704\ubcc4 \ud14c\uc2a4\ud2b8\ub97c \ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.  "),(0,l.kt)("li",{parentName:"ul"},"\uc790\uae30\ubb38\uc11c\ud654 : \uc88b\uc740 \ucf54\ub4dc\ub294 \uc694\uad6c\uc0ac\ud56d\uacfc \ucf54\ub4dc\uac00 \uc720\uc0ac\ud558\uc5ec \ucf54\ub4dc\ub97c \ud1b5\ud574 \uc694\uad6c\uc0ac\ud56d\uc744 \uc774\ud574\ud560 \uc218 \uc788\uac8c \ud569\ub2c8\ub2e4.  "),(0,l.kt)("li",{parentName:"ul"},"\uc77c\uad00\uc131 : \uc88b\uc740 \ucf54\ub4dc\ub294 \uac19\uc740 \uaddc\uce59\uacfc \ucca0\ud559\uc73c\ub85c \uc791\uc131\ub418\uc5b4 \uc608\uce21\uc774 \uac00\ub2a5\ud569\ub2c8\ub2e4.  ")),(0,l.kt)("p",null,"\uc88b\uc740 \ucf54\ub4dc\ub97c \uc791\uc131\ud558\uae30 \uc5b4\ub824\uc6b4 \uc774\uc720  "),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\ud0c0\uc778\uc774 \ubcf4\uae30\uc5d0 \uc88b\uc544\uc57c \ud558\uae30 \ub54c\ubb38  "),(0,l.kt)("li",{parentName:"ul"},"\uc9c0\uc2dd\uc758 \uc800\uc8fc : \ub098\ub294 \uc5b4\ub835\uc9c0 \uc54a\ub2e4. \ud558\uc9c0\ub9cc \ub0a8\uc774 \uc791\uc131\ud55c \ucf54\ub4dc\ub97c \ubcf4\ub294 \uac83\uc740 \uace0\uc5ed    ")),(0,l.kt)("p",null,"\uac1c\ubc1c \ubb38\ud654  "),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\ud300 \ucee8\ubca4\uc158 : \ub3d9\uc77c\ud55c \uc2a4\ud0c0\uc77c\uc758 \ucf54\ub4dc \uc791\uc131 -> \uc608\uce21 \uac00\ub2a5, \ubaa8\ub450\uac00 \uac19\uc740 \ucf54\ub4dc \uc791\uc131 -> \ud488\uc9c8 \ud5a5\uc0c1  "),(0,l.kt)("li",{parentName:"ul"},"\ucf54\ub4dc \ub9ac\ubdf0 : \ucf54\ub4dc \uc2a4\ud0c0\uc77c \ub9de\ucd94\uace0 \uc11c\ub85c \ubc30\uc6b0\ub294 \uacfc\uc815  "),(0,l.kt)("li",{parentName:"ul"},"\ub9ac\ud329\ud1a0\ub9c1 : \uae30\uc874 \ucf54\ub4dc\ub97c \uac1c\uc120 -> \uac00\ub3c5\uc131, \uc720\uc9c0\ubcf4\uc218\uc131, \ud655\uc7a5\uc131 \ub192\uc774\ub294 \ubaa9\uc801  "),(0,l.kt)("li",{parentName:"ul"},"\ud14c\uc2a4\ud2b8 : \ud14c\uc2a4\ud2b8 \uac00\ub2a5\ud55c \ucf54\ub4dc\ub294 \uba85\ud655\ud55c \uc5ed\ud560\uc774 \uc788\ub2e4. -> \uc694\uad6c\uc0ac\ud56d\uc744 \ud14c\uc2a4\ud2b8 \ucf00\uc774\uc2a4\ub85c \ub9cc\ub4e4\uc5b4\uc11c \uc790\uae30 \ubb38\uc11c\ud654 \ud558\ub294 \uac83    ")),(0,l.kt)("p",null,"\uc2dc\uc791\uc740 \ucf54\ub4dc \uac00\ub3c5\uc131\uc774\ub2e4.  "),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\uc88b\uc740 \ubaa8\uc591, \uc88b\uc740 \uad6c\uc870, \uc88b\uc740 \uc774\ub984\uc774 \ud544\uc694\ud558\ub2e4.    "),(0,l.kt)("li",{parentName:"ul"},"\ub1cc\uc758 \ubd80\ud558\ub97c \ucd5c\uc18c\ud654\ud558\uc5ec \ucf54\ub4dc\ub97c \uc77d\uac8c \ub9cc\ub4dc\ub294 \uac83\uc774\ub2e4.   "),(0,l.kt)("li",{parentName:"ul"},"\ud504\ub9ac\ud2f0\uc5b4\ub97c \uc0ac\uc6a9\ud558\uc5ec \ucee8\ubca4\uc158\uc758 \uc5ed\ud560  ")),(0,l.kt)("p",null,"\ud504\ub9ac\ud2f0\uc5b4\uac00 \ubabb\ud558\ub294\uac83\uc744 \ub354 \uacf5\ub7b5\ud558\uc790.  "),(0,l.kt)("h2",{id:"-\uc88b\uc740-\uad6c\uc870\ub97c-\ub9cc\ub4dc\ub294-\uc6d0\uce59"},"\ud83d\udccc \uc88b\uc740 \uad6c\uc870\ub97c \ub9cc\ub4dc\ub294 \uc6d0\uce59"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\uc778\uc9c0 \uc2ec\ub9ac\ud559 \uae30\ubc18(\uc0ac\ub78c \uae30\ubc18)\uc73c\ub85c \uc6d0\uce59\uc744 \ub9cc\ub4dc\ub294\uac83\uc740 \uc88b\uc740\uac83 \uac19\ub2e4.   ")),(0,l.kt)("h4",{id:"\uacf5\ud1b5\uc601\uc5ed\uc758-\uc6d0\uce59-common-region"},"[\uacf5\ud1b5\uc601\uc5ed\uc758 \uc6d0\uce59 (Common Region)]"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"\uacf5\ud1b5\uc601\uc5ed \ub0b4\uc5d0 \ubc30\uce58\ub41c \uc694\uc18c\ub4e4\uc740 \uadf8\ub8f9\uc73c\ub85c \uc778\uc2dd\ub41c\ub2e4.")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"1.\uc904\ubc14\uafc8\uacfc \uc8fc\uc11d  "),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"\uac00\ub3c5\uc131\uc744 \uc704\ud55c \uc904\ubc14\uafc8 + \uc8fc\uc11d \ub2ec\uae30  "))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"2.\ucf54\ub4dc\uc758 \ubc30\uce58"),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"\uc8fc\uc11d\uc744 \ud1b5\ud574 \uadf8\ub8f9 \ub9cc\ub4e4\uae30  "),(0,l.kt)("li",{parentName:"ul"},"\ube48\uc904\uc744 \ud1b5\ud574 \uadf8\ub8f9 \uad6c\ubd84\ud558\uae30  "),(0,l.kt)("li",{parentName:"ul"},"\ud568\uc218\ub97c \ud1b5\ud574\uc11c \uc5f0\uad00\ub41c \ub0b4\uc6a9 \ub2f4\uae30")))),(0,l.kt)("h4",{id:"\uc720\uc0ac\uc131\uc758-\uc6d0\uce59-similarity"},"[\uc720\uc0ac\uc131\uc758 \uc6d0\uce59 (Similarity)]"),(0,l.kt)("p",null,"\uc720\uc0ac\ud558\uac8c \uc0dd\uae34 \uc694\uc18c\ub4e4\uc740 \uac19\uc740 \uc885\ub958\ub85c \ubcf4\uc778\ub2e4.    "),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\uc77c\uad00\uc131 \uc788\ub294 \ud568\uc218 \uc774\ub984\uc744 \ub9cc\ub4e4\uc5b4\uc57c \ud55c\ub2e4.  ",(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"\uc608) \ud578\ub4e4\ub7ec \ud568\uc218\ub97c handlexxx \uc774\ub77c\uace0 \ubaa8\ub450 \uc9c0\ud0a4\ub358\uac00 \uc544\ub2c8\uba74 onClick \uc774\ub77c\uace0 \ud55c\uac00\uc9c0\ub85c \ud1b5\uc77c.    "))),(0,l.kt)("li",{parentName:"ul"},"1.\ub85c\uc9c1\uc5d0 \ub530\ub77c \ubd84\ub9ac\ud558\uae30  ",(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"count-related logic + data fetching logic  "))),(0,l.kt)("li",{parentName:"ul"},"2.\uc5ed\ud560\uc5d0 \ub530\ub77c \ubd84\ub9ac\ud558\uae30   ",(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"hooks + computed field + handler + effect    "),(0,l.kt)("li",{parentName:"ul"},"*\ub85c\uc9c1\uc5d0 \ub530\ub77c\uc11c \ubd84\ub9ac\ud558\ub294\uac83\uc774 \uc88b\ub2e4 => '","[\uc5f0\uc18d\uc131\uc758 \uc6d0\uce59 (Continuation)]","' \ub54c\ubb38\uc5d0  ")))),(0,l.kt)("h4",{id:"\uc5f0\uc18d\uc131\uc758-\uc6d0\uce59-continuation"},"[\uc5f0\uc18d\uc131\uc758 \uc6d0\uce59 (Continuation)]"),(0,l.kt)("p",null,"\ub514\ubc84\uae45\uc744 \ud558\ub294 \uacfc\uc815(\ucf54\ub4dc\uc758 \ud750\ub984\uc744 \uc77d\ub294 \uad00\uc810)\uc5d0\uc11c \uc720\uc0ac\ud55c \ub85c\uc9c1\uc758 \ubc14\ub85c\ubc14\ub85c \uc5f0\uacb0\ub418\ub294\uac83\uc774 \uc778\uc9c0 \ubd80\ub2f4\uc774 \uc801\ub2e4.  "),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\ub85c\uc9c1\uc5d0 \ub530\ub77c \ucef4\ud3ec\ub10c\ud2b8, \ud6c5\uc744 \ubd84\ub9ac \ud558\uc790.  ")),(0,l.kt)("h2",{id:"-\uc88b\uc740-\uc774\ub984-\uc9d3\uae30"},"\ud83d\udccc \uc88b\uc740 \uc774\ub984 \uc9d3\uae30"),(0,l.kt)("p",null,"\uc88b\uc740 \uc774\ub984\uc774\ub780 \uc608\uce21\uc774 \uac00\ub2a5\ud55c \uac83  "),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"1.\uac12\uacfc \ud0c0\uc785\uc774 \uc608\uce21\uc774 \uac00\ub2a5\ud574\uc57c \ud55c\ub2e4.  "),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"\uc774\ub984\ub9cc \ubcf4\uace0 string, number, boolean, array, object\uac00 \uc5f0\uc0c1\ub418\uc5b4\uc57c \ud55c\ub2e4.  "))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"2.\ubcc0\uc218\uc758 \ub9e5\ub77d\uc774 \uc9c0\uc5ed\uc5d0\uc11c \uae00\ub85c\ubc8c\ub85c \uac08\uc218\ub85d \uad6c\uccb4\uc801\uc73c\ub85c \uc801\uc5b4\uc57c \ud55c\ub2e4.  "),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"\uc9c0\uc5ed \ud568\uc218\uc758 \ubcc0\uc218\uba85 key  --\x3e \uc804\uc5ed \ubcc0\uc218 OPEN_PUBLIC_AUTH_KEY \ub77c\uace0 \uba85\uba85  "))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"3.\ud568\uc218 \uc774\ub984 \uc9d3\uae30  "),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"\uc548\uc88b\uc740 \uc608) calculateTotalPrice0fAllItemsInTheShoppingCart(){}  "),(0,l.kt)("li",{parentName:"ul"},"\ubcc0\uacbd)",(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"calculateTotalPrice(cartItemList){}",(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"1 \ub3d9\uc791\uc744 \ub098\ud0c0\ub0b4\ub294 \ub3d9\uc0ac \uc720\uc9c0: calculate  "),(0,l.kt)("li",{parentName:"ul"},"2 \ubc18\ud658\uac12\uc744 \uc608\uce21 : Total Price ( Total \ubcf4\ub2e4\ub294 Price \ub354 \uba85\ud655\ud55c \ub4ef )  "),(0,l.kt)("li",{parentName:"ul"},"3 \uc911\ubcf5 \uc81c\uac70:  OfAllItems\ub294 Total\uacfc \uc758\ubbf8\uac00 \uc911\ubcf5  "),(0,l.kt)("li",{parentName:"ul"},"4 \uc911\uc694\ud55c \uc815\ubcf4\ub294 \uc720\uc9c0, \ubd88\ud544\uc694\ud55c \ubd80\ubd84\uc740 \uc81c\uac70: ShoppingCart\uc5d0\uc11c Cart\ub9cc\uc73c\ub85c\ub3c4 \ucda9\ubd84\ud788 \uc758\ubbf8\uac00 \uc804\ub2ec\ub429\ub2c8\ub2e4. Shopping\uacfc The\ub294 \uc0dd\ub7b5 \uac00\ub2a5\ud569\ub2c8\ub2e4.  "),(0,l.kt)("li",{parentName:"ul"},"5 \ub9e4\uac1c\ubcc0\uc218(\ubaa9\uc801\uc5b4)\uae4c\uc9c0 \ud65c\uc6a9 : cartItemList  "))),(0,l.kt)("li",{parentName:"ul"},"\ud568\uc218\uba85\uba85 \uaddc\uce59 = function \ub3d9\uc791+\ubc18\ud658\uac12(\uc778\uc7901 = \ubaa9\uc801\uc5b4, \uc778\uc7902 = \ubaa9\uc801 \ubcf4\uc5b4?)    "))))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"4.\ubcf4\ud3b8\uc801\uc73c\ub85c \uc0ac\uc6a9\ud558\ub294 \uc774\ub984 \uc4f0\uae30 (\ub9db\uc9d1 \uc774\ub860)  "))),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"create~(), add~(), push~(), insert~()\nparse~(), make~(), build~(), split~()\nquery~(), mutation~(), fetch~(), update~(), delete~()\nsave~(), put~(), send~(), dispatch~(), receive~()\nvalidate~(), calc~(), serialize~()\ninit~(), configure~(), start~(), stop~()\ngenerate~(), transform~(), log~()\n\n\ubcc0\uc218\ub098 \uc18d\uc131 \uc774\ub984\ub3c4 \ub9c8\ucc2c\uac00\uc9c0\uc785\ub2c8\ub2e4:\ncount~, sum~, num~\nis~, has~\n~ing, ~ed\nmin~, max~, total\n~name, ~title, ~desc, ~data\nitem, temp\n~at, ~date, ~index\nselected~, current~\n~s (\ubcf5\uc218\ud615)\n~type, ~code, ~ID, ~text\nparams, error\n\n\n\uc720\uc0ac\ud558\uc9c0\ub9cc \ubbf8\ubb18\ud55c \ucc28\uc774\ub97c \uc9c0\ub2c8\ub294 \ub2e8\uc5b4\ub4e4\ub3c4 \uc788\uc2b5\ub2c8\ub2e4. \uac00\ub839 'current'\ub294 \ud604\uc7ac \ud65c\uc131\ud654\ub41c \ud56d\ubaa9\uc744, 'selected'\ub294 \uc0ac\uc6a9\uc790\uc5d0 \uc758\ud574 \uc120\ud0dd\ub41c \ud56d\ubaa9\uc744 \uc758\ubbf8\ud569\ub2c8\ub2e4.\n\uc774\ub7ec\ud55c \ubbf8\ubb18\ud55c \ucc28\uc774\ub97c \uc774\ud574\ud558\uace0 \uc801\uc808\ud788 \uc0ac\uc6a9\ud558\uba74, \ucf54\ub4dc\uc758 \uc758\ub3c4\ub97c \ub354 \uba85\ud655\ud788 \uc804\ub2ec\ud560 \uc218 \uc788\uc73c\uba70, \ub2e4\ub978 \uac1c\ubc1c\uc790\ub4e4\uc774 \ucf54\ub4dc\ub97c \ub354 \uc27d\uac8c \uc774\ud574\ud558\uace0 \uc720\uc9c0\ubcf4\uc218\ud560 \uc218 \uc788\uac8c \ub429\ub2c8\ub2e4.\n\uac01 \uc774\ub984\ub4e4\uc740 \uc5b4\ub5a4 \ucc28\uc774\ub4e4\uc774 \uc788\uc744\uae4c\uc694?\ncreate(), add(), push(), insert()\nfetch(), retrieve(), load(), get()\nupdate(), modify(), edit(), change()\nremove(), delete(), clear(), erase()\nfind(), search(), lookup(), query()\ncheck(), validate(), verify(), test()\nconvert(), transform(), parse(), format()\nrender(), display(), show(), present()\ntoggle(), switch(), flip(), alternate()\nmount(), attach(), append(), connect()\nunmount(), detach(), remove(), disconnect()\nsubscribe(), listen(), observe(), watch()\nunsubscribe(), unlisten(), ignore(), stopWatching()\ndispatch(), emit(), trigger(), fire()\nhandle(), process(), manage(), deal()\nisOpen, isVisible, isActive, isEnabled\nonSubmit, onSend, onConfirm, onApply\nsetState, updateState, setProps, updateProps\nuseEffect, useCallback, useMemo, useRef\n")),(0,l.kt)("h2",{id:"\ub9ac\ud329\ud1a0\ub9c1"},"\ub9ac\ud329\ud1a0\ub9c1"),(0,l.kt)("p",null,"\ud074\ub9b0\ucf54\ub4dc -> \ucf54\ub4dc\ub97c \ucc98\uc74c\ubd80\ud130 \uba85\ud655\ud558\uace0 \uc774\ud574\ud558\uae30 \uc27d\uac8c \uc791\uc131\ud558\ub294 \uac83",(0,l.kt)("br",{parentName:"p"}),"\n","\ub9ac\ud329\ud1a0\ub9c1 \uc815\uc758 : \uae30\ub2a5\uc744 \uc720\uc9c0\ud55c \ucc44, \ucf54\ub4dc \uad6c\uc870\ub97c \ubc14\uafb8\uac70\ub098 \uc0c8\ub85c\uc6b4 \ud328\ub7ec\ub2e4\uc784\uc5d0 \ub9de\ucd94\ub294 \uacfc\uc815    "),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\ud504\ub85c\uc81d\ud2b8\uac00 \ucee4\uc9c0\uace0 \uc2dc\uac04\uc774 \uc9c0\ub0a0\uc218\ub85d => \uae30\uc874\uc758 \ucf54\ub4dc\ub97c \uc77d\ub294\ub370 \ub354 \ub9ce\uc740 \uc2dc\uac04\uc744 \uc4f0\uace0, \uae30\uc874\uc758 \uae30\ub2a5\uc5d0 \uc601\ud5a5\uc774 \uc788\ub294\uc9c0 \ud14c\uc2a4\ud2b8\ud558\ub294\ub370 \ub9ce\uc740 \uc2dc\uac04 \uc0ac\uc6a9.  ",(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"\ud544\uc694\uc131 : \uc0c8\ub85c\uc6b4 \uc694\uad6c\uc0ac\ud56d + \uc0c8\ub85c\uc6b4 \uae30\uc220 \ub3c4\uc785 + \uc0c8\ub85c\uc6b4 \ud328\ub7ec\ub2e4\uc784 \uc801\uc6a9  "),(0,l.kt)("li",{parentName:"ul"},"\ubaa9\uc801 => \ucf54\ub4dc \uc774\ud574 \uc2dc\uac04 \ub2e8\ucd95 + \ucf54\ub4dc \uc218\uc815 \uc601\ud5a5\ub3c4 \uccb4\ud06c \uc2dc\uac04 \ub2e8\ucd95  "),(0,l.kt)("li",{parentName:"ul"},"\uacb0\uacfc ==> \ub354 \uc88b\uc740 \ud074\ub9b0\ucf54\ub4dc   ")))),(0,l.kt)("p",null,"\uc6d0\uce59  "),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\uae30\uc874\uc758 \uae30\ub2a5\uc740 \ubc18\ub4dc\uc2dc \uc720\uc9c0\ud558\ub418, \uac00\uc7a5 \uc758\uc874\uc131\uc774 \uc801\uc740 \ubd80\ubd84\ubd80\ud130 \uc2dc\uc791\ud560 \uac83  "),(0,l.kt)("li",{parentName:"ul"},"\uc791\uc740 \ub2e8\uc704\ub85c \uc810\uc9c4\uc801\uc73c\ub85c \uc9c4\ud589\ud560 \uac83",(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"\ub9ac\ud329\ud1a0\ub9c1\uc740 \ud55c \ubc88\uc5d0 \uc804\uccb4 \ucf54\ub4dc\ub97c \uc218\uc815\ud558\ub294 \uac83\uc774 \uc544\ub2c8\ub77c, \uc791\uc740 \ubd80\ubd84\uc529 \uc9c4\ud589\ud558\ub294 \uac83\uc774 \uc88b\uc544\uc694. \uc774\ub807\uac8c \ud558\uba74 \ubcc0\uacbd \uc0ac\ud56d\uc744 \uc774\ud574\ud558\uae30 \uc27d\uace0, \ubb38\uc81c\ub97c \ucd94\uc801\ud558\uac70\ub098 \ub418\ub3cc\ub9ac\uae30\uac00 \uc26c\uc6cc\uc694.  "))),(0,l.kt)("li",{parentName:"ul"},"\ud14c\uc2a4\ud2b8\uc640 \ud568\uaed8 \ud560 \uac83")))}s.isMDXComponent=!0}}]);