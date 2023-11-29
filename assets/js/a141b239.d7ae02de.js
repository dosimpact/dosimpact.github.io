"use strict";(self.webpackChunkdosimpact_blog=self.webpackChunkdosimpact_blog||[]).push([[4642],{3905:(e,t,a)=>{a.d(t,{Zo:()=>m,kt:()=>N});var l=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);t&&(l=l.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,l)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function k(e,t){if(null==e)return{};var a,l,n=function(e,t){if(null==e)return{};var a,l,n={},r=Object.keys(e);for(l=0;l<r.length;l++)a=r[l],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(l=0;l<r.length;l++)a=r[l],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var u=l.createContext({}),p=function(e){var t=l.useContext(u),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},m=function(e){var t=p(e.components);return l.createElement(u.Provider,{value:t},e.children)},s="mdxType",o={inlineCode:"code",wrapper:function(e){var t=e.children;return l.createElement(l.Fragment,{},t)}},c=l.forwardRef((function(e,t){var a=e.components,n=e.mdxType,r=e.originalType,u=e.parentName,m=k(e,["components","mdxType","originalType","parentName"]),s=p(a),c=n,N=s["".concat(u,".").concat(c)]||s[c]||o[c]||r;return a?l.createElement(N,i(i({ref:t},m),{},{components:a})):l.createElement(N,i({ref:t},m))}));function N(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var r=a.length,i=new Array(r);i[0]=c;var k={};for(var u in t)hasOwnProperty.call(t,u)&&(k[u]=t[u]);k.originalType=e,k[s]="string"==typeof e?e:n,i[1]=k;for(var p=2;p<r;p++)i[p]=a[p];return l.createElement.apply(null,i)}return l.createElement.apply(null,a)}c.displayName="MDXCreateElement"},946:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>u,contentTitle:()=>i,default:()=>o,frontMatter:()=>r,metadata:()=>k,toc:()=>p});var l=a(7462),n=(a(7294),a(3905));const r={sidebar_position:2},i="\ucd08\ubcf4\uc790\ub97c \uc704\ud55c apache kafka - 2",k={unversionedId:"g-be/kafka/ka002",id:"g-be/kafka/ka002",title:"\ucd08\ubcf4\uc790\ub97c \uc704\ud55c apache kafka - 2",description:"- \ucd08\ubcf4\uc790\ub97c \uc704\ud55c apache kafka - 2",source:"@site/docs/g-be/3-kafka/ka002.md",sourceDirName:"g-be/3-kafka",slug:"/g-be/kafka/ka002",permalink:"/docs/g-be/kafka/ka002",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/g-be/3-kafka/ka002.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"backEnd",previous:{title:"\ucd08\ubcf4\uc790\ub97c \uc704\ud55c apache kafka - 1",permalink:"/docs/g-be/kafka/ka001"},next:{title:"kafka install with docker",permalink:"/docs/g-be/kafka/ka003"}},u={},p=[{value:"1. \ud1a0\ud53d, \ud30c\ud2f0\uc158 \uc624\ud504\uc14b",id:"1-\ud1a0\ud53d-\ud30c\ud2f0\uc158-\uc624\ud504\uc14b",level:2},{value:"\uc608",id:"\uc608",level:3},{value:"2. \ud504\ub85c\ub4c0\uc11c &amp; \uba54\uc2dc\uc9c0 \ud0a4",id:"2-\ud504\ub85c\ub4c0\uc11c--\uba54\uc2dc\uc9c0-\ud0a4",level:2},{value:"\uba54\uc2dc\uc9c0 \uad6c\uc870",id:"\uba54\uc2dc\uc9c0-\uad6c\uc870",level:3},{value:"Kafka Message Serializer",id:"kafka-message-serializer",level:3},{value:"Kafka Message Key Hashing",id:"kafka-message-key-hashing",level:3},{value:"3. \ucee8\uc288\uba38 &amp; \uc5ed\uc9c1\ub82c\ud654",id:"3-\ucee8\uc288\uba38--\uc5ed\uc9c1\ub82c\ud654",level:2},{value:"Consumer Deserializer",id:"consumer-deserializer",level:3},{value:"4. \ucee8\uc288\uba38 \uadf8\ub8f9 &amp; \ucee8\uc288\uba38 \uc624\ud504\uc14b",id:"4-\ucee8\uc288\uba38-\uadf8\ub8f9--\ucee8\uc288\uba38-\uc624\ud504\uc14b",level:2},{value:"Delivery semantics for consumers",id:"delivery-semantics-for-consumers",level:3},{value:"\ube0c\ub85c\ucee4 &amp; \ud1a0\ud53d",id:"\ube0c\ub85c\ucee4--\ud1a0\ud53d",level:2},{value:"\ud1a0\ud53d \ubcf5\uc81c",id:"\ud1a0\ud53d-\ubcf5\uc81c",level:2},{value:"topic replication factor",id:"topic-replication-factor",level:3},{value:"\ud30c\ud2f0\uc158 \ub9ac\ub354 \uac1c\ub150",id:"\ud30c\ud2f0\uc158-\ub9ac\ub354-\uac1c\ub150",level:3},{value:"\ud504\ub85c\ub4c0\uc11c \ud655\uc778 &amp; \ud1a0\ud53d \ub0b4\uad6c\uc131",id:"\ud504\ub85c\ub4c0\uc11c-\ud655\uc778--\ud1a0\ud53d-\ub0b4\uad6c\uc131",level:2},{value:"Producer Acknowledgements acks",id:"producer-acknowledgements-acks",level:3},{value:"Topic Durability",id:"topic-durability",level:3},{value:"\uc8fc\ud0a4\ud37c",id:"\uc8fc\ud0a4\ud37c",level:2},{value:"Kafka KRaft - \uc8fc\ud0a4\ud37c \uc9c0\uc6b0\uae30",id:"kafka-kraft---\uc8fc\ud0a4\ud37c-\uc9c0\uc6b0\uae30",level:2}],m={toc:p},s="wrapper";function o(e){let{components:t,...r}=e;return(0,n.kt)(s,(0,l.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"\ucd08\ubcf4\uc790\ub97c-\uc704\ud55c-apache-kafka---2"},"\ucd08\ubcf4\uc790\ub97c \uc704\ud55c apache kafka - 2"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"#%EC%B4%88%EB%B3%B4%EC%9E%90%EB%A5%BC-%EC%9C%84%ED%95%9C-apache-kafka---2"},"\ucd08\ubcf4\uc790\ub97c \uc704\ud55c apache kafka - 2"),(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"#1-%ED%86%A0%ED%94%BD-%ED%8C%8C%ED%8B%B0%EC%85%98-%EC%98%A4%ED%94%84%EC%85%8B"},"1. \ud1a0\ud53d, \ud30c\ud2f0\uc158 \uc624\ud504\uc14b"),(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"#%EC%98%88"},"\uc608")))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"#2-%ED%94%84%EB%A1%9C%EB%93%80%EC%84%9C--%EB%A9%94%EC%8B%9C%EC%A7%80-%ED%82%A4"},"2. \ud504\ub85c\ub4c0\uc11c \\& \uba54\uc2dc\uc9c0 \ud0a4"),(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"#%EB%A9%94%EC%8B%9C%EC%A7%80-%EA%B5%AC%EC%A1%B0"},"\uba54\uc2dc\uc9c0 \uad6c\uc870")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"#kafka-message-serializer"},"Kafka Message Serializer")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"#kafka-message-key-hashing"},"Kafka Message Key Hashing")))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"#3-%EC%BB%A8%EC%8A%88%EB%A8%B8--%EC%97%AD%EC%A7%81%EB%A0%AC%ED%99%94"},"3. \ucee8\uc288\uba38 \\& \uc5ed\uc9c1\ub82c\ud654"),(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"#consumer-deserializer"},"Consumer Deserializer")))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"#4-%EC%BB%A8%EC%8A%88%EB%A8%B8-%EA%B7%B8%EB%A3%B9--%EC%BB%A8%EC%8A%88%EB%A8%B8-%EC%98%A4%ED%94%84%EC%85%8B"},"4. \ucee8\uc288\uba38 \uadf8\ub8f9 \\& \ucee8\uc288\uba38 \uc624\ud504\uc14b"),(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"#delivery-semantics-for-consumers"},"Delivery semantics for consumers")))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"#%EB%B8%8C%EB%A1%9C%EC%BB%A4--%ED%86%A0%ED%94%BD"},"\ube0c\ub85c\ucee4 \\& \ud1a0\ud53d")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"#%ED%86%A0%ED%94%BD-%EB%B3%B5%EC%A0%9C"},"\ud1a0\ud53d \ubcf5\uc81c"),(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"#topic-replication-factor"},"topic replication factor")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"#%ED%8C%8C%ED%8B%B0%EC%85%98-%EB%A6%AC%EB%8D%94-%EA%B0%9C%EB%85%90"},"\ud30c\ud2f0\uc158 \ub9ac\ub354 \uac1c\ub150")))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"#%ED%94%84%EB%A1%9C%EB%93%80%EC%84%9C-%ED%99%95%EC%9D%B8--%ED%86%A0%ED%94%BD-%EB%82%B4%EA%B5%AC%EC%84%B1"},"\ud504\ub85c\ub4c0\uc11c \ud655\uc778 \\& \ud1a0\ud53d \ub0b4\uad6c\uc131"),(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"#producer-acknowledgements-acks"},"Producer Acknowledgements acks")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"#topic-durability"},"Topic Durability")))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"#%EC%A3%BC%ED%82%A4%ED%8D%BC"},"\uc8fc\ud0a4\ud37c")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"#kafka-kraft---%EC%A3%BC%ED%82%A4%ED%8D%BC-%EC%A7%80%EC%9A%B0%EA%B8%B0"},"Kafka KRaft - \uc8fc\ud0a4\ud37c \uc9c0\uc6b0\uae30"))))),(0,n.kt)("h2",{id:"1-\ud1a0\ud53d-\ud30c\ud2f0\uc158-\uc624\ud504\uc14b"},"1. \ud1a0\ud53d, \ud30c\ud2f0\uc158 \uc624\ud504\uc14b"),(0,n.kt)("p",null,"\ud1a0\ud53d\uc774\ub780 : \ub370\uc774\ud130 \uc2a4\ud2b8\ub9bc\uc758 \uc77c\ubd80\ubd84.  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\uce74\ud504\uce74\ub294 \ud074\ub7ec\uc2a4\ud130 \ud658\uacbd\uc5d0\uc11c \uad6c\ub3d9\ub41c\ub2e4. \uc989 \uc5ec\ub7ec\uac1c\uc758 \ub178\ub4dc\ub85c \uad6c\uc131\ub41c\ub2e4. "),(0,n.kt)("li",{parentName:"ul"},"\uce74\ud504\uce74 \uc548\uc5d0\ub294 \uc5ec\ub7ec\uac00\uc9c0 \ud1a0\ud53d\ub4e4\uc774 \uc874\uc7ac\ud55c\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"db\ub85c \ube44\uc720\ud558\uba74 \uc5ec\ub7ec \ud14c\uc774\ube14\uc774 \uc874\uc7ac\ud558\ub294\uac83\uacfc \ub3d9\uc77c\ud558\ub2e4. "),(0,n.kt)("li",{parentName:"ul"},"\ub2e4\uc591\ud55c \ud1a0\ud53d\ub4e4\uc744 \uc0dd\uc131\ud560 \uc218 \uc788\uace0, \ud1a0\ud53d\uc740 \uc774\ub984\uc740 \uc2dd\ubcc4\uc790\uc774\ubbc0\ub85c \uc911\ubcf5\ub418\uc9c0 \uc54a\ub294\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\uc5b4\ub5a0\ud55c \uba54\uc2dc\uc9c0 \ud3ec\uba67\ub3c4 \ubc1b\uc73c\uba70, \ud1a0\ud53d\ub4e4\uc740 \ucee8\uc288\uba38\ub098,\ud504\ub85c\ub4c0\uc11c\uc5d0\uc11c \ucffc\ub9ac\ud560 \uc218 \uc5c6\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\ud1a0\ud53d \uc548\uc5d0\ub294 \uba54\uc2dc\uc9c0\ub4e4\uc758 \uc2dc\ud000\uc2a4\uac00 \uc874\uc7ac\ud55c\ub2e4. \uadf8\ub798\uc11c \uce74\ud504\uce74\ub97c \uc2a4\ud2b8\ub9ac\ubc0d \ud50c\ub7ab\ud3fc\uc774\ub77c\uace0 \ud55c\ub2e4.  ")),(0,n.kt)("p",null,"\ud30c\ud2f0\uc158  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\ud1a0\ud53d\uc548\uc740 \ub610 \uc5ec\ub7ec\uac1c\uc758 \ud30c\ud2f0\uc158\uc73c\ub85c \ubd84\ub9ac\ub41c\ub2e4. \uc608\ub97c\ub4e4\uc5b4 \ud558\ub098\uc758 \ud1a0\ud53d\uc5d0 100\uac1c\uc758 \ud30c\ud2f0\uc158\uc774 \uc874\uc7ac\ud560 \uc218 \uc788\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\uba54\uc2dc\uc9c0\uc2dc\ub4e4\uc740 \uac01 \ud30c\ud2f0\uc158\uc5d0 \ub4e4\uc5b4\uac00\uba70, id\uac12\uc744 \uc99d\uac00\uc2dc\ud0a4\uba70 \ub4e4\uc5b4\uac04\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\uce74\ud504\uce74\uc758 \ud1a0\ud53d\uc740 \ubd88\ubcc0\uc131\uc744 \uac00\uc9c0\uace0 \uc788\ub2e4. \uadf8\ub798\uc11c \uba54\uc2dc\uc9c0\ub97c \ud55c\ubc88 \ub123\uc73c\uba74 \uc218\uc815\uc774\ub098 \uc0ad\uc81c\uac00 \ubd88\uac00\ub2a5 \ud558\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\uba54\uc2dc\uc9c0\ub294 \ubd88\ubcc0\uc131\uc774\ub098, \ub514\ud3f4\ud2b8\ub85c 1\uc8fc\uc77c \ud6c4\uc5d0 \uc0ac\ub77c\uc9c4\ub2e4.  ")),(0,n.kt)("p",null,"\uc624\ud504\uc14b "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\uba54\uc2dc\uc9c0\ub4e4\uc758 id\ub97c \ud30c\ud2f0\uc158\uc758 \uc624\ud504\uc14b\uc774\ub77c\uace0 \ud55c\ub2e4.  ")),(0,n.kt)("h3",{id:"\uc608"},"\uc608"),(0,n.kt)("p",null,"truck_gps \ub77c\ub294 \ud1a0\ud53d\uc774 \uc788\ub2e4\uace0 \uc608\ub97c \ub4e4\uc5b4 \ubcf8\ub2e4.   "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\uc218\ub9ce\uc740 \ud2b8\ub7ed\ub4e4\uc774 \uc874\uc7ac\ud558\uace0, 20\ucd08\ub9c8\ub2e4 gps \uc704\uce58\uc815\ubcf4\ub97c \uce74\ud504\uce74\uc5d0 \uc804\uc1a1\ud558\ub294 \uc0c1\ud669\uc774\ub2e4. "),(0,n.kt)("li",{parentName:"ul"},"\uac01 \ud2b8\ub7ed\uc740 truckID, truckPosition \ub370\uc774\ud130\uac00 \uc788\ub2e4."),(0,n.kt)("li",{parentName:"ul"},"\uc774 \ud1a0\ud53d\uc744 \uad6c\ub3c5\ud558\uace0 \uc788\ub294 \uc11c\ube44\uc2a4\ub294, location map / notification service \uc774\ub2e4.")),(0,n.kt)("br",null),(0,n.kt)("h2",{id:"2-\ud504\ub85c\ub4c0\uc11c--\uba54\uc2dc\uc9c0-\ud0a4"},"2. \ud504\ub85c\ub4c0\uc11c & \uba54\uc2dc\uc9c0 \ud0a4"),(0,n.kt)("p",null,"\ud504\ub85c\ub4c0\uc11c : \ud1a0\ud53d\uc5d0 \uba54\uc2dc\uc9c0\ub97c \ubcf4\ub0b4\ub294 \uc8fc\uccb4\uc774\ub2e4. "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\ud1a0\ud53d\uc5d0\ub294 \ud30c\ud2f0\uc158\uc774 \uc874\uc7ac\ud558\uace0, \ud504\ub85c\ub4c0\uc11c\ub294 \uc5b4\ub290 \ud30c\ud2f0\uc158\uc5d0 \uba54\uc2dc\uc9c0\ub97c \uc4f8\uc9c0 \uc54c\uace0 \uc788\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\ub9cc\uc57d\uc5d0 \uce74\ud504\uce74 \ube0c\ub85c\ucee4\uac00 \uba54\uc2dc\uc9c0 \uc218\uc2e0\uc5d0 \uc2e4\ud328\ud558\uba74, \ud504\ub85c\ub4c0\uc11c\uac00 \ub9ac\ucee4\ubc84\ub9ac \ud574\uc57c\ud55c\ub2e4. ")),(0,n.kt)("p",null,"\uba54\uc2dc\uc9c0 \ud0a4 "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\ud504\ub85c\ub4c0\uc11c\uac00 \uba54\uc2dc\uc9c0\ub97c \ubcf4\ub0bc\ub54c\ub294 \ud0a4\ub77c\ub294 \uba54\ud0c0\ub370\uc774\ud130\uc640 \ud568\uaed8 \ubcf4\ub0b8\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\uba54\uc2dc\uc9c0\ub294 string, number, binary \ub4f1\uc774 \ub420 \uc218 \uc788\uc73c\uba70 null\ub3c4 \uac00\ub2a5\ud558\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"null\uac12\uc778 \uacbd\uc6b0\uc5d0\ub294 \uc784\uc758\uc758 \ud30c\ud2f0\uc158\uc5d0 \uba54\uc2dc\uc9c0\uac00 \uae30\ub85d\ub41c\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"null\uac12\uc774 \uc544\ub2cc \uacbd\uc6b0\uc5d0\ub294, \uba54\uc2dc\uc9c0\ub294 \ud2b9\uc815 \ud30c\ud2f0\uc158\uc5d0 \uae30\ub85d\ub41c\ub2e4.   "),(0,n.kt)("li",{parentName:"ul"},"\ud30c\ud2f0\uc158\uc5d0 \ub4e4\uc5b4\uac00\uae30 \uc804\uc5d0 \ud574\uc2dc\ud568\uc218\uac00 \uc788\ub2e4. \uadf8\ub798\uc11c \ud2b9\uc815 \ud0a4\uac12\uc740 \uc5b8\uc81c\ub098 \uac19\uc740 \ud30c\ud2f0\uc158\uc5d0 \ub4e4\uc5b4\uac04\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\ub9cc\uc57d\uc5d0, \ud2b8\ub7edID\ub97c \ud0a4\uac12\uc73c\ub85c \uc0ac\uc6a9\ud558\uace0, gps\uc815\ubcf4\ub97c \uacc4\uc18d \ubcf4\ub0b8\ub2e4\uba74 \uc774 \uba54\uc2dc\uc9c0\ub294 \ub3d9\uc77c\ud55c \ud30c\ud2f0\uc158\uc5d0 \ubaa8\ub450 \ub4e4\uc5b4\uac04\ub2e4.  ")),(0,n.kt)("h3",{id:"\uba54\uc2dc\uc9c0-\uad6c\uc870"},"\uba54\uc2dc\uc9c0 \uad6c\uc870"),(0,n.kt)("p",null,(0,n.kt)("img",{alt:"./img/img1.png",src:a(7989).Z,width:"548",height:"412"})),(0,n.kt)("p",null,"\uce74\ud504\uce74\uc758 \uba54\uc2dc\uc9c0 \uad6c\uc870\ub294 \uc704 \uadf8\ub9bc\uacfc \uac19\ub2e4.   "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"key : \ubc14\uc774\ub108\ub9ac, nullable"),(0,n.kt)("li",{parentName:"ul"},"value : \ubc14\uc774\ub108\ub9ac, nullable"),(0,n.kt)("li",{parentName:"ul"},"compression Type : \uc555\ucd95 \ub9e4\ucee4\ub2c8\uc998 \uc801\uc6a9 \uac00\ub2a5"),(0,n.kt)("li",{parentName:"ul"},"headers : optional "),(0,n.kt)("li",{parentName:"ul"},"partition + offset"),(0,n.kt)("li",{parentName:"ul"},"timestamp")),(0,n.kt)("h3",{id:"kafka-message-serializer"},"Kafka Message Serializer"),(0,n.kt)("p",null,"\uce74\ud504\uce74\ub294 \uc624\uc9c1 bytes \ub9cc \uc785\ucd9c\ub825\uc774 \ud5c8\uc6a9\ub41c\ub2e4.  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\ud504\ub85c\ub4c0\uc11c\uc640 \ucee8\uc288\uba38\ub294 \ub370\uc774\ud130\ub97c \uc2dc\ub9ac\uc5bc\ub77c\uc774\uc988 \ud574\uc57c\ud55c\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\uc5ec\uae30\uc11c \uc2dc\ub9ac\uc5bc\ub77c\uc774\uc988\ub77c\ub294 \ub9d0\uc740, \ubc14\uc774\ub108\ub9ac(0,1)\ud615\ud0dc\ub85c \ub370\uc774\ud130\ub97c \ubcc0\ud658\ud574\uc57c \ud55c\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"string (json\ud3ec\ud568), int, float, protobuf \ub4f1 \ubaa8\ub450 \ubc14\uc774\ub108\ub9ac \ub370\uc774\ud130\ub85c \ubc14\uafb8\uc5b4\uc57c \ud55c\ub2e4.  ")),(0,n.kt)("h3",{id:"kafka-message-key-hashing"},"Kafka Message Key Hashing"),(0,n.kt)("p",null,"\uce74\ud504\uce74 \ud30c\ud2f0\uc154\ub110 \ub85c\uc9c1\uc5d0\uc11c \uc0ac\uc6a9\ub418\ub294 \ud574\uc2f1\ub85c\uc9c1\uc740 marmar2 \uc54c\uace0\ub9ac\uc998\uc774\ub2e4.  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("inlineCode",{parentName:"li"},"targetPartition = Math.abs(murmur2(keyBytes)) % (numPartitions - 1)  "),"  "),(0,n.kt)("li",{parentName:"ul"},"\uce74\ud504\uce74\uc758 \ub808\ucf54\ub4dc\uc5d0\uc11c \uc704 \ud574\uc2f1 \ub85c\uc9c1\uc744 \ud0dc\uc6b0\uace0, \ud30c\ud2f0\uc158\uc5d0 \uc804\ub2ec\ud558\ub294 \uacfc\uc815\uc774 \ub0b4\ubd80\uc801\uc73c\ub85c \uc874\uc7ac  "),(0,n.kt)("li",{parentName:"ul"},"\uc911\uc694\ud55c\uc810\uc740 \ud504\ub85c\ub4c0\uc11c\ub3c4 \uc5b4\ub290 \ud30c\ud2f0\uc158\uc5d0 \ub370\uc774\ud130\uac00 \uc800\uc7a5\ub420\uc9c0 \uc54c\uace0 \uc788\ub2e4.  ")),(0,n.kt)("br",null),(0,n.kt)("h2",{id:"3-\ucee8\uc288\uba38--\uc5ed\uc9c1\ub82c\ud654"},"3. \ucee8\uc288\uba38 & \uc5ed\uc9c1\ub82c\ud654"),(0,n.kt)("p",null,"\ucee8\uc288\uba38\ub294 \ud1a0\ud53d\uc758 \uba54\uc2dc\uc9c0\ub97c \uc77d\ub294\ub370, pulling\ubc29\uc2dd\uc73c\ub85c \ub370\uc774\ud130\ub97c \uc77d\ub294\ub2e4.  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\ucee8\uc288\uba38\ub294 \uc790\ub3d9\uc73c\ub85c \uc5b4\ub5a4 \ud30c\ud2f0\uc158\uc5d0\uc11c \ub370\uc774\ud130\ub97c \uc77d\uc744\uc9c0 \uc54c\uace0 \uc788\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\ube0c\ub85c\ucee4\uac00 \uc7a5\uc560\uac00 \ubc1c\uc0dd\ud588\uc744\ub54c\ub3c4, \ub9ac\ucee4\ubc84\ub9ac \ubc29\uc2dd\ub3c4 \uc54c\uace0\uc788\ub2e4. "),(0,n.kt)("li",{parentName:"ul"},"\ub370\uc774\ud130\ub294 \ub0ae\uc740 \uc624\ud504\uc14b\uc5d0\uc11c \ub192\uc740 \uc624\ud504\uc14b\uc73c\ub85c \uc77d\ub294\ub370, \uc5b4\ub5a4 \ud30c\ud2f0\uc158\uc5d0\uc11c \uba3c\uc800 \uc77d\ub294\uc9c0\ub294 \uc21c\uc11c\uac00 \ubcf4\uc7a5\ub418\uc9c0 \uc54a\ub294\ub2e4. ")),(0,n.kt)("h3",{id:"consumer-deserializer"},"Consumer Deserializer"),(0,n.kt)("p",null,"\ucee8\uc288\uba38\ub294 \ub370\uc774\ud130\ub97c \uc77d\uace0\ub098\uba74 Deserializer \uacfc\uc815\uc774 \uc788\ub2e4.  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\ubc14\uc774\ub108\ub9ac \uac12\uc778 \ud0a4\uac12\uc740 \uc815\uc218\ub85c \ubcc0\ud658\ud558\uace0, \ubc14\uc774\ub108\ub9ac \uac12\uc778 value\ub294 string\uc73c\ub85c \ubcc0\ud658\ud558\ub294 \ub4f1\uc758 \uc791\uc5c5\uc774 \uc788\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\uc870\ub9bd\uacfc \ubd84\ud574\uc758 \uacfc\uc815\ucc98\ub7fc Serializer-Deserializer \uacfc\uc815\uc774 \uc788\ub294\uac83\uc774\ub2e4."),(0,n.kt)("li",{parentName:"ul"},"\uadf8\ub798\uc11c topic lifecyle \uc548\uc5d0\ub294 \ub370\uc774\ud130\uc758 \ud0c0\uc785\uc774 \ubcc0\uacbd\ub418\uba74 \uc548\ub41c\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\ub370\uc774\ud130 \ud0c0\uc785\uc758 \ubcc0\uacbd\uc774 \ud544\uc694\ud55c \uacbd\uc6b0\uc5d0\ub294 \uc0c8\ub85c\uc6b4 \ud1a0\ud53d\uc744 \ub9cc\ub4e4\uc5b4\uc57c \ud55c\ub2e4.  ")),(0,n.kt)("br",null),(0,n.kt)("h2",{id:"4-\ucee8\uc288\uba38-\uadf8\ub8f9--\ucee8\uc288\uba38-\uc624\ud504\uc14b"},"4. \ucee8\uc288\uba38 \uadf8\ub8f9 & \ucee8\uc288\uba38 \uc624\ud504\uc14b"),(0,n.kt)("p",null,(0,n.kt)("img",{alt:"./img/img2.png",src:a(88).Z,width:"716",height:"300"})),(0,n.kt)("p",null,"\ucee8\uc288\uba38 \uadf8\ub8f9 : \ubaa8\ub4e0 \ucee8\uc288\uba38\ub294 \uadf8\ub8f9\uc744 \ub9cc\ub4e4\uc5b4\uc11c \ub370\uc774\ud130\ub97c \uc18c\ube44\ud55c\ub2e4.  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\uac01 \ucee8\uc288\uba38\ub294 \ud30c\ud2f0\uc158\uc744 \ub3c5\uc810\uc801\uc73c\ub85c \uc77d\ub294\ub2e4.   "),(0,n.kt)("li",{parentName:"ul"},"\ub3d9\uc2dc\uc5d0 \uc5ec\ub7ec \ucee8\uc288\uba38\uac00 \ub3d9\uc77c\ud55c \ud30c\ud2f0\uc158\uc744 \uc77d\uc9c0 \uc54a\ub294\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\ub9cc\uc57d\uc5d0 \ud30c\ud2f0\uc158\ubcf4\ub2e4 \ucee8\uc288\uba38\uac00 \ub354 \ub9ce\ub2e4\uba74, \ube44\ud65c\uc131\ud654\ub41c \ucee8\uc288\uba38 \uadf8\ub8f9\uc774 \uc0dd\uae34\ub2e4.  ")),(0,n.kt)("p",null,(0,n.kt)("img",{alt:"./img/img3.png",src:a(7649).Z,width:"867",height:"455"})),(0,n.kt)("p",null,"\uc704 \uadf8\ub9bc\uc740 n\uac1c\uc758 \ucee8\uc288\uba38, m\uac1c\uc758 \ucee8\uc288\uba38 \uadf8\ub8f9, k\uac1c\uc758 \ud30c\ud2f0\uc158\uc5d0 \ub300\ud55c \uadf8\ub9bc\ub2c8\ub2e4.  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\ud30c\ud2f0\uc158\uc740 \uc5ec\ub7ec \ucee8\uc288\uba38 \uadf8\ub8f9\uc744 \uac00\uc9c8 \uc218 \uc788\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\ud558\uc9c0\ub9cc, \ud55c\uac1c\uc758 \ud30c\ud2f0\uc158\uc740 \uadf8\ub8f9\ub2f9 \ud558\ub098\uc758 \ucee8\uc288\uba38\ub9cc \uc77d\uc5b4\uac04\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\uc608) \ud2b8\ub7ed \uc704\uce58\uc815\ubcf4 \ud1a0\ud53d&\ud30c\ud2f0\uc158\uc744 \uc77d\uc5b4\uac00\ub294 \uc11c\ube44\uc2a4\ub4e4\uc774\ub77c\uba74, ",(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"1\ubc88 \ucee8\uc288\uba38 \uadf8\ub8f9 : \uc704\uce58 \uc11c\ube44\uc2a4\uc5d0 \uc0ac\uc6a9"),(0,n.kt)("li",{parentName:"ul"},"2\ubc88 \ucee8\uc288\uba38 \uadf8\ub8f9 : \uc54c\ub9bc \uc11c\ube44\uc2a4\uc5d0 \uc0ac\uc6a9 ")))),(0,n.kt)("p",null,"\ucee8\uc288\uba38 \uc624\ud504\uc14b : \ub370\uc774\ud130\ub97c \uc5b4\ub514\uae4c\uc9c0 \uc77d\uc5c8\ub294\uc9c0 \ubd81\ub9c8\ud06c \uac19\uc740 \uae30\ub2a5 "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\uce74\ud504\uce74\uac00 \uc624\ud504\uc14b \uc815\ubcf4\ub97c \ucee8\uc288\uba38 \uadf8\ub8f9\ubcc4\ub85c \uc800\uc7a5\ud558\uace0 \uc788\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\uc624\ud504\uc14b \uc815\ubcf4\ub294 \ud1a0\ud53d\uc5d0 \ucee4\ubc0b\ub41c\ub2e4. __consumer_offsets \uc774\ub77c\ub294 \ubcc0\uc218\uba85  "),(0,n.kt)("li",{parentName:"ul"},"\ub9cc\uc57d \ucee8\uc288\uba38\uac00 \uc8fd\uac8c\ub41c\ub2e4\uba74, \uc5b4\ub514\uae4c\uc9c0 \uc77d\uc5c8\ub294\uc9c0 \uae30\ub85d\uc744 \ub450\uc5c8\uc73c\ub2c8 \uc774\uc5b4\uc11c \uc77d\uac8c \ub41c\ub2e4.  ")),(0,n.kt)("h3",{id:"delivery-semantics-for-consumers"},"Delivery semantics for consumers"),(0,n.kt)("p",null,"\uae30\ubcf8\uc801\uc73c\ub85c \uc790\ubc14 \ucee8\uc288\uba38\ub294 at least once\ub85c \uc790\ub3d9 \ucee4\ubc0b\ub41c\ub2e4.  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"3\uac00\uc9c0 \ub2e4\ub978 \uc635\uc158\ub4e4\uc774 \uc788\ub2e4.  ")),(0,n.kt)("p",null,"1.at least once : \ucd5c\uc18c\ud55c \ud55c\ubc88 / \ubcf4\ud1b5\uc758 \uacbd\uc6b0\uc5d0 \ucd94\ucc9c\ub41c\ub2e4.   "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\uba54\uc2dc\uc9c0\ub97c \uc77d\uace0\ub098\uba74 \uc624\ud504\uc14b\uc774 \ucee4\ubc0b\ub41c\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\uba54\uc2dc\uc9c0\ub97c \ub2e4\uc2dc \uc77d\uc744 \uae30\ud68c\uac00 \uc8fc\uc5b4\uc9c4\ub2e4. \ub530\ub77c\uc11c \uba71\ub4f1\uc758 \uacbd\uc6b0\uc5d0\ub9cc \uc0ac\uc6a9\ud574\uc57c \ud55c\ub2e4.  ")),(0,n.kt)("p",null,"2.at most once : \ucd5c\ub300\ud55c \ud55c\ubc88 "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\ucee8\uc288\uba38\uac00 \uba54\uc2dc\uc9c0\ub97c \ubc1b\uc790\ub9c8\uc790 \uc624\ud504\uc14b\uc744 \ucee4\ubc0b\ud558\uac8c \ub41c\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\ub9cc\uc57d\uc5d0 \uba54\uc2dc\uc9c0\uc5d0 \ub300\ud55c \uc77c\ucc98\ub9ac\uac00 \uc798\ubabb\ub418\uba74, \uc77c\ubd80 \uba54\uc2dc\uc9c0\ub97c \uc783\uc744 \uc218 \uc788\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\uc798\ubabb\ub41c \ucc98\ub9ac\ub97c \ub418\ub3cc\ub9ac\uae30\uc804\uc5d0 \uc774\ubbf8 \ucee4\ubc0b\uc744 \ud574\ubc84\ub9b0 \uc0c1\ud669\uc774\ub2c8\uae4c  ")),(0,n.kt)("p",null,"3.exactly once : \uc815\ud655\ud788 \ud55c\ubc88"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\ud1a0\ud53d\uc744 \uc77d\uace0 \uc798 \ucc98\ub9ac\uac00 \ub418\uba74 \ud2b8\ub79c\uc81d\uc158 API\ub97c \ud638\ucd9c\ud574\uc11c \ucee4\ubc0b\ud55c\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\uc678\ubd80\uc2dc\uc2a4\ud15c\uc73c\ub85c \uac00\ub294 \uacbd\uc6b0\uc5d0\ub294 \uba71\ub4f1 \ucee8\uc288\uba38\ub97c \uc0ac\uc6a9\ud55c\ub2e4 ? ")),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"\ub9e4\uc6b0 \uc911\uc694: \ube0c\ub85c\ucee4 \ud558\ub098\uc5d0\ub9cc(\uc5b4\ub5a4 \ube0c\ub85c\ucee4\ub4e0) \uc5f0\uacb0\ud558\uace0, \uc4f0\uace0 \uc2f6\uc740 \ud1a0\ud53d \uc774\ub984\ub9cc \uc81c\uacf5\ud558\uba74 \ub429\ub2c8\ub2e4. \n\uce74\ud504\uce74 \ud074\ub77c\uc774\uc5b8\ud2b8\uac00 \ub370\uc774\ud130\ub97c \uc801\ub2f9\ud55c \ube0c\ub85c\ucee4\uc640 \ud30c\ud2f0\uc158\uc73c\ub85c \ub77c\uc6b0\ud305\ud574 \uc90d\ub2c8\ub2e4!\n\n\ub9e4\uc6b0 \uc911\uc694: \ube0c\ub85c\ucee4 \ud558\ub098\uc5d0\ub9cc(\uc5b4\ub5a4 \ube0c\ub85c\ucee4\ub4e0) \uc5f0\uacb0\ud558\uace0, \uc77d\uc5b4 \uc624\uace0 \uc2f6\uc740 \ud1a0\ud53d \uc774\ub984\ub9cc \uc81c\uacf5\ud558\uba74 \ub429\ub2c8\ub2e4. \n\uce74\ud504\uce74\uac00 \ud638\ucd9c\uc744 \uc801\ub2f9\ud55c \ube0c\ub85c\ucee4\uc640 \ud30c\ud2f0\uc158\uc73c\ub85c \ub77c\uc6b0\ud305\ud574 \uc90d\ub2c8\ub2e4!\n")),(0,n.kt)("br",null),(0,n.kt)("h2",{id:"\ube0c\ub85c\ucee4--\ud1a0\ud53d"},"\ube0c\ub85c\ucee4 & \ud1a0\ud53d"),(0,n.kt)("p",null,"\uce74\ud504\uce74\uc758 \ud074\ub7ec\uc2a4\ud130\uc5d0\ub294 \ub2e4\uc218\uc758 \ube0c\ub85c\ucee4\ub85c \uad6c\uc131\ub420 \uc218 \uc788\ub2e4.  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\uc5ec\uae30\uc11c \ube0c\ub85c\ucee4\ub294 \uadf8\ub0e5 \ud558\ub098\uc758 \uc11c\ubc84\uc774\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\uac01 \ube0c\ub85c\ucee4\ub294 \uc2dd\ubcc4\uc790ID\ub97c \uac00\uc9c0\uace0 \uc788\uc73c\uba70, \ud1a0\ud53d\uc758 \ud30c\ud2f0\uc158\ub4e4\uc744 \ubcf4\uad00\ud558\uace0 \uc788\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\ud2b9\uc815 \ube0c\ub85c\ucee4 (=bootstrap broker)\uc640 \uc5f0\uacb0\ub9cc \ud558\uba74 \ub098\uba38\uc9c0 \ube0c\ub85c\ucee4\ub4e4\uacfc\ub3c4 \uc5f0\uacb0\ub420 \uc218 \uc788\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\uc2dc\uc791\uc740 3\uac1c\uc758 \ube0c\ub85c\ucee4\ub97c \ub450\ub294\uac8c \uc88b\uace0, \ud070 \uaddc\ubaa8\uc758 \uce74\ud504\uce74 \ud074\ub7ec\uc2a4\ud130\ub294 100\uac1c \uc774\uc0c1\uc758 \ube0c\ub85c\ucee4\ub3c4 \uc874\uc7ac\ud55c\ub2e4.    ")),(0,n.kt)("p",null,(0,n.kt)("img",{alt:"./img/img4.png",src:a(9302).Z,width:"804",height:"263"})),(0,n.kt)("p",null,"\uc608) \ube0c\ub85c\ucee4 3\uac1c, \ud30c\ud2f0\uc158 3\uac1c\uc778 \ud1a0\ud53dA, \ud30c\ud2f0\uc158 2\uac1c\uc778 \ud1a0\ud53dB"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\ud30c\ud2f0\uc158\uc774 3\uac1c\uc778 \ud1a0\ud53dA\ub294 \ubaa8\ub4e0 \ube0c\ub85c\ucee4\uc5d0 \ubd84\uc0b0\ub418\uc5b4 \uc788\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\ud558\uc9c0\ub9cc \ud30c\ud2f0\uc158\uc774 2\uac1c\uc778 \ud1a0\ud53dB\ub294 \ube0c\ub85c\ucee4 101, 102\uc5d0\ub9cc \uc788\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\uc218\ud3c9\uc801 \uc2a4\ucf00\uc77c\ub9c1 \uacb0\uacfc, \uc790\ub3d9\uc73c\ub85c \ud30c\ud2f0\uc158\uc744 \uc801\uc808\ud558\uac8c \ub098\ub204\uc5b4 \uc8fc\uc5c8\ub2e4.  ")),(0,n.kt)("p",null,(0,n.kt)("img",{alt:"./img/img5.png",src:a(5259).Z,width:"642",height:"254"}),(0,n.kt)("br",{parentName:"p"}),"\n","\uce74\ud504\uce74 \ud074\ub7ec\uc2a4\ud130 \ub0b4 \ubaa8\ub4e0 \ube0c\ub85c\ucee4\ub4e4\uc740 \ubd80\ud2b8\uc2a4\ud2b8\ub7a9 \ube0c\ub85c\ucee4\uc11c\ubc84\ub77c\uace0\ub3c4 \ubd80\ub978\ub2e4.  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\uc989 \ud558\ub098\uc758 \ube0c\ub85c\ucee4\uc5d0\ub9cc \uc5f0\uacb0\uc774 \ub41c\ub2e4\uba74, \ubaa8\ub4e0 \ube0c\ub85c\ucee4\uc5d0 \uc5f0\uacb0\ub41c\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\uac01 \ube0c\ub85c\ucee4\ub4e4\uc740 \ub2e4\ub978 \ube0c\ub85c\ucee4\uc758 \ub9ac\uc2a4\ud2b8\uc640 \uba54\ud0c0\ub370\uc774\ud130(\ud1a0\ud53d,\ud30c\ud2f0\uc158 \uc815\ubcf4\ub4e4) \ub610\ud55c \ubaa8\ub450 \uc54c\uace0\uc788\ub2e4.  ")),(0,n.kt)("br",null),(0,n.kt)("h2",{id:"\ud1a0\ud53d-\ubcf5\uc81c"},"\ud1a0\ud53d \ubcf5\uc81c"),(0,n.kt)("h3",{id:"topic-replication-factor"},"topic replication factor"),(0,n.kt)("p",null,(0,n.kt)("img",{alt:"./img/img6.png",src:a(4236).Z,width:"848",height:"257"}),"  "),(0,n.kt)("p",null,"\ud1a0\ud53d\uc740 replication fator\uac12\uc774 \uc874\uc7ac\ud55c\ub2e4. 1,2,3 \uc635\uc158\uc774 \uc788\ub2e4.  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\ubcf4\ud1b5 2,3\uc744 \uc0ac\uc6a9\ud558\uace0 1\uc744 \uc0ac\uc6a9\ud558\uba74 \ubcf5\uc81c\uac00 \ub418\uc9c0 \uc54a\ub294\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\ub9cc\uc57d\uc5d0 \ube0c\ub85c\ucee4\uac00 \ub2e4\uc6b4\ub418\ub294 \uacbd\uc6b0\ub97c \ub300\ube44\ud574\uc11c, \ub2e4\ub978 \ube0c\ub85c\ucee4\uac00 \ud1a0\ud53d\ub4e4\uc744 \ubcf5\uc81c\ud574 \ub450\uace0 \uc788\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\uc704 \uc0ac\uc9c4\uc5d0\uc11c, \ube0c\ub85c\ucee4 101 \ud1a0\ud53dA-\ud30c\ud2f0\uc1580 >>> \ube0c\ub85c\ucee4 102\ub85c \ubcf5\uc81c\ub418\uc5c8\ub2e4.  ")),(0,n.kt)("p",null,(0,n.kt)("img",{src:a(380).Z,width:"833",height:"265"}),"   "),(0,n.kt)("p",null,"\ub9cc\uc57d\uc5d0 \uc7a5\uc560 \uc0c1\ud669\uc744 \uac00\uc815\ud574\uc11c, \ube0c\ub85c\ucee4 102\uac00 \ub2e4\uc6b4\ub418\uc5c8\ub2e4.  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\uadf8\ub7fc\uc5d0\ub3c4 \uc5ec\uc804\ud788 \ud1a0\ud53dA\ub294 \uc81c\uacf5\uc774 \uac00\ub2a5\ud558\ub2e4.  ")),(0,n.kt)("h3",{id:"\ud30c\ud2f0\uc158-\ub9ac\ub354-\uac1c\ub150"},"\ud30c\ud2f0\uc158 \ub9ac\ub354 \uac1c\ub150"),(0,n.kt)("p",null,(0,n.kt)("img",{src:a(7854).Z,width:"818",height:"249"}),"   "),(0,n.kt)("p",null,"\uac01 \ud30c\ud2f0\uc158\uc740 \uc6d0\ubcf8\ub370\uc774\ud130\ub97c \uac00\uc9c0\uace0 \uc788\ub294 \ub9ac\ub354\ub4e4\uc774 \uc788\ub2e4.  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\ud30c\ud2f0\uc158 \uc6d0\ubcf8\uc744 \uac00\uc9c4 \ud30c\ud2f0\uc158 \ub9ac\ub354\uc640 \ubcf5\uc81c\ubcf8\uc758 \ud30c\ud2f0\uc158\uc73c\ub85c \uad6c\uc131"),(0,n.kt)("li",{parentName:"ul"},"\uc989, One leader + ISR ( in-sync replica ) \ubaa8\ub378\uc774\ub2e4."),(0,n.kt)("li",{parentName:"ul"},"\ud504\ub85c\ub4c0\uc11c\ub294 \ud30c\ud2f0\uc158 \ub9ac\ub354\ub4e4\uc5d0\uac8c\ub9cc \ub370\uc774\ud130\ub97c \uc804\uc1a1"),(0,n.kt)("li",{parentName:"ul"},"\ucee8\uc288\uba38\uc5ed\uc2dc \ud30c\ud2f0\uc158 \ub9ac\ub354\uc5d0\uc11c\ub9cc \ub370\uc774\ud130\ub97c \uc77d\ub294\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\ube0c\ub85c\ucee4\uac00 \ub2e4\uc6b4\ub418\uc5c8\uc744\ub54c \ud30c\ud2f0\uc158 \ub9ac\ub354\uac00 \ub2e4\uc2dc \uc120\ucd9c\ub418\uc5b4 \ub370\uc774\ud130\ub97c \ucc98\ub9ac\ud55c\ub2e4.  ")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\uce74\ud504\uce74 \ubc84\uc804\uc774 \uc62c\ub77c\uac00\uba74\uc11c \ucd94\uac00\ub41c \uae30\ub2a5\uc911 \ud558\ub098 (2.4ver+)  ",(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"\ucee8\uc288\uba38\uc5d0\uac8c \uac00\uae4c\uc6b4 \ube0c\ub85c\ucee4\uc758 replica\ub97c \uc77d\uc744 \uc218 \uc788\ub294 \uae30\ub2a5  ")))),(0,n.kt)("br",null),(0,n.kt)("h2",{id:"\ud504\ub85c\ub4c0\uc11c-\ud655\uc778--\ud1a0\ud53d-\ub0b4\uad6c\uc131"},"\ud504\ub85c\ub4c0\uc11c \ud655\uc778 & \ud1a0\ud53d \ub0b4\uad6c\uc131"),(0,n.kt)("h3",{id:"producer-acknowledgements-acks"},"Producer Acknowledgements acks"),(0,n.kt)("p",null,"\ud504\ub85c\ub4c0\uc11c\ub294 \ub370\uc774\ud130\ub97c \ubcf4\ub0b4\uace0 \uc751\ub2f5\ubc1b\ub294 acks \ubc29\uc2dd\uc744 \uace0\ub97c \uc218 \uc788\ub2e4.  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"acks = 0 : \ud504\ub85c\ub4c0\uc11c\ub294 acks\ub97c \uae30\ub2e4\ub9ac\uc9c0 \uc54a\ub294\ub2e4. (\ub370\uc774\ud130 \uc804\uc1a1 \uc720\uc2e4\uac00\ub2a5\uc131\uc774 \uc788\ub2e4.)    "),(0,n.kt)("li",{parentName:"ul"},"acks = 1 : \ud504\ub85c\ub4c0\uc11c\ub294 \ub9ac\ub354\uac00 \uc120\ucd9c\uae4c\uc9c0 acks\ub97c \ubc1b\ub294\ub2e4. ( \uc7a5\uc560\uc2dc \ub370\uc774\ud130 \uc190\uc2e4 \uac00\ub2a5\uc131\uc774 \uc788\ub2e4. )    "),(0,n.kt)("li",{parentName:"ul"},"acks = 2 : \ud504\ub85c\ub4c0\uc11c\ub294 \ub9ac\ub354\uc120\ucd9c \ubc0f \ub370\uc774\ud130\ubcf5\uc81c\uae4c\uc9c0 acks\ub97c \ubc18\ub294\ub2e4. ( \ub370\uc774\ud130 loss\uac00 \uc5c6\ub2e4. )   ")),(0,n.kt)("h3",{id:"topic-durability"},"Topic Durability"),(0,n.kt)("p",null,"\uc704\uc5d0\uc11c topic replication factor\uc5d0 \ub300\ud574\uc11c \ub2e4\ub8e8\uc5c8\ub2e4.    "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"factor\uac00 1\uc778 \uacbd\uc6b0, \ube0c\ub85c\ucee4 1\uac1c\ub77c\ub3c4 \uace0\uc7a5\ub098\uba74 \ub370\uc774\ud130 \uc720\uc2e4\uc774 \ubc1c\uc0dd\ud560 \uc218 \uc788\ub2e4.   "),(0,n.kt)("li",{parentName:"ul"},"factor\uac00 2\uc778 \uacbd\uc6b0, \ube0c\ub85c\ucee4 1\uac1c\uac00 \uace0\uc7a5\ub098\ub3c4 \uc5ec\uc804\ud788 \uac00\uc6a9\uac00\ub2a5(\uac00\uc6a9\uc131 O).   "),(0,n.kt)("li",{parentName:"ul"},"factor\uac00 3\uc778 \uacbd\uc6b0, \ube0c\ub85c\ucee4 2\uac1c\uac00 \uace0\uc7a5\ub098\ub3c4 \uc5ec\uc804\ud788 \uac00\uc6a9\uac00\ub2a5(\uac00\uc6a9\uc131 O).     "),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("strong",{parentName:"li"},"factor\uac00 N\uc778 \uacbd\uc6b0, \ube0c\ub85c\ucee4 N-1\uac1c\uac00 \uace0\uc7a5\ub098\ub3c4 \uc5ec\uc804\ud788 \uac00\uc6a9\uac00\ub2a5(\uac00\uc6a9\uc131 O)."),"  ")),(0,n.kt)("br",null),(0,n.kt)("h2",{id:"\uc8fc\ud0a4\ud37c"},"\uc8fc\ud0a4\ud37c"),(0,n.kt)("p",null,"\uc8fc\ud0a4\ud37c\ub294 \uc55e\uc73c\ub85c \uc0ac\ub77c\uc9c8 \uc608\uc815\uc774\ub2e4.",(0,n.kt)("br",{parentName:"p"}),"\n","\uc8fc\ud0a4\ud37c\ub294 \uce74\ud504\uce74 \ube0c\ub85c\ucee4\ub97c \ub9e4\ub2c8\uc9d5 \ud558\ub294 \uc5ed\ud560\uc774\ub2e4. \ube0c\ub85c\ucee4\uac00 \ub2e4\uc6b4\ub420\ub54c\ub9c8\ub2e4 \ud30c\ud2f0\uc158 \ub9ac\ub354\ub97c \uc120\ucd9c\ud558\ub294\ub370 \ub3c4\uc6c0 \uc900\ub2e4.",(0,n.kt)("br",{parentName:"p"}),"\n","\ub9ce\uc740 \uba54\ud0c0\ub370\uc774\ud130\ub4e4\uc758 \uc218\uc815\uc5d0 \ub300\ud574 \ube0c\ub85c\ucee4\ub4e4\uc5d0\uac8c \uc54c\ub9bc\uc744 \uc900\ub2e4.  "),(0,n.kt)("p",null,"\uce74\ud504\uce74 \ubc84\uc804 2.8\uae4c\uc9c0\ub294 \ubc18\ub4dc\uc2dc \uc8fc\ud0a4\ud37c\uac00 \ud544\uc694\ud558\ub2e4.",(0,n.kt)("br",{parentName:"p"}),"\n","\ud558\uc9c0\ub9cc \ubc84\uc804 3.x \ubd80\ud130\ub294 \uc8fc\ud0a4\ud37c\uc758 \uc758\uc874\uc131\uc774 \uc0ac\ub77c\uc84c\ub2e4. ( Kafka Raft \ub9e4\ucee4\ub2c8\uc998\uc774\ub77c\uace0 \ud55c\ub2e4. )  "),(0,n.kt)("p",null,"\uc8fc\ud0a4\ud37c\ub294 1,3,5..\uc758 \ud640\uc218\ub97c \uac00\uc9c0\uac8c \ub41c\ub2e4.  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\uc8fc\ud0a4\ud37c\uc5d0\ub3c4 \ub9ac\ub354 \uac1c\ub150\uc774 \uc788\uc5b4\uc11c, \ub9ac\ub354\ub294 \uc4f0\uae30\ub97c \ub2f4\ub2f9\ud558\uace0 \ub098\uba38\uc9c0\ub294 \uc77d\uae30\uc5d0 \uc0ac\uc6a9 \ud55c\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\uc624\ud504\uc14b \uc815\ubcf4\ub3c4 \uc8fc\ud0a4\ud37c\uc5d0 \uc800\uc7a5\uc744 \ud588\ub2e4.  ")),(0,n.kt)("p",null,(0,n.kt)("img",{src:a(3349).Z,width:"911",height:"433"}),"  "),(0,n.kt)("p",null,"\uc8fc\ud0a4\ud37c \ub610\ud55c \uc704 \uad6c\uc131\ucc98\ub7fc \uc5ec\ub7ec\uac1c\uc758 \ub178\ub4dc\ub85c \uad6c\uc131\ud55c\ub2e4.  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\uce74\ud504\uce74 \ube0c\ub85c\ucee4\ub97c \uad00\ub9ac\ud574\uc57c \ud55c\ub2e4\uba74, kafka 4.0\ubc84\uc804\uc774 \ub098\uc624\uae30 \uc804\uae4c\uc9c0 \uc8fc\ud0a4\ud37c\ub97c \uc0ac\uc6a9\ud574\uc57c \ud55c\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\uce74\ud504\uce74 \ud074\ub77c\uc774\uc5b8\ud2b8\ub85c \uc8fc\ud0a4\ud37c\ub97c \uc5f0\uacb0\ud558\uace0 \uc11c\ube44\uc2a4\ub97c \uc8fc\ud0a4\ud37c\ub85c \uc5f0\uacb0\ud574\uc654\uc9c0\ub9cc, \uc774\uc81c \uc5d4\ub4dc\ud3ec\uc778\ud2b8\ub85c \uc9c1\uc811 \ube0c\ub85c\ucee4\ub85c \uc5f0\uacb0\ud574\uc57c\ud55c\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\uc8fc\ud0a4\ud37c\uc640 \uce74\ud504\uce74\uc758 \ud074\ub7ec\uc2a4\ud130 \uc870\ud569\uc740 \uc548\uc815\uc801\uc774\uc9c0 \uc54a\uc740\uad6c\uc870\uc774\ub2e4. \uc55e\uc73c\ub85c\ub294 \uc8fc\ud0a4\ud37c\uac00 \uc5c6\uc5b4\uc9c0\ub294 \uad6c\uc870\ub97c \ud0dd\ud574\uc57c \ud55c\ub2e4.   ")),(0,n.kt)("br",null),(0,n.kt)("h2",{id:"kafka-kraft---\uc8fc\ud0a4\ud37c-\uc9c0\uc6b0\uae30"},"Kafka KRaft - \uc8fc\ud0a4\ud37c \uc9c0\uc6b0\uae30"),(0,n.kt)("p",null,"Kafka KRraft   "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\uce74\ud504\uce74 \ubc84\uc804 3\ubd80\ud130 \uc2dc\uc791\ub418\uc5c8\uc73c\uba70 \uc8fc\ud0a4\ud37c \uc758\uc874\uc131\uc744 \uc81c\uac70\ud558\uace0\uc790 \ud558\ub294 \ubaa9\uc801\uc774\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\ud074\ub7ec\uc2a4\ud130\uc5d0 \ud30c\ud2f0\uc158\uc774 100,000 \uc774\uc0c1\uc77c\ub54c \uc8fc\ud0a4\ud37c\ub294 \uc2a4\ucf00\uc77c\ub9c1 \uc774\uc288\ub97c \ubcf4\uc5ec\uc8fc\uace0 \uc788\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\uc8fc\ud0a4\ud37c\ub97c \uc81c\uac70\ud558\uba74, \ud655\uc791\uc131, \ubcf4\uc644, \ubaa8\ub2c8\ud130\ub9c1, \uc548\uc815\uc131, \uc720\uc9c0\ubcf4\uc218 \ub4f1 \uac1c\uc120\ub41c\ub2e4.  ")),(0,n.kt)("p",null,(0,n.kt)("img",{src:a(5821).Z,width:"831",height:"463"}),"  "),(0,n.kt)("p",null,"Quorum Leader : Kafka \ube0c\ub85c\ucee4\ub97c \uad00\ub9ac\ud558\ub294 \ub9ac\ub354  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\uc8fc\ud0a4\ud37c\uc5d0\uc11c \ub9ac\ub354\uac00 \uc120\ucd9c\ub418\uc5b4 \uad00\ub9ac\ud55c\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\ud558\uc9c0\ub9cc kafka\uc5d0 Quorum Controller\uac00 \uc788\ub2e4\uba74 \ud6e8\uc52c \uad6c\uc870\uac00 \uac04\ub2e8\ud574\uc9c4\ub2e4.")))}o.isMDXComponent=!0},7989:(e,t,a)=>{a.d(t,{Z:()=>l});const l=a.p+"assets/images/img1-22a0e255c2065528d2e6a117f15e7150.png"},3349:(e,t,a)=>{a.d(t,{Z:()=>l});const l=a.p+"assets/images/img10-0d2884779efd0c140697acd414eea2ee.png"},5821:(e,t,a)=>{a.d(t,{Z:()=>l});const l=a.p+"assets/images/img11-a8748e0bd5efe23b66013a2648e31255.png"},88:(e,t,a)=>{a.d(t,{Z:()=>l});const l=a.p+"assets/images/img2-60db8567b92a0cbf39b6087985420217.png"},7649:(e,t,a)=>{a.d(t,{Z:()=>l});const l=a.p+"assets/images/img3-eb2ec64a64482609be6ab257973c513a.png"},9302:(e,t,a)=>{a.d(t,{Z:()=>l});const l=a.p+"assets/images/img4-a7148972c46f550729db425da19be25f.png"},5259:(e,t,a)=>{a.d(t,{Z:()=>l});const l=a.p+"assets/images/img5-1a0818d632244afe609b27921a8d1f29.png"},4236:(e,t,a)=>{a.d(t,{Z:()=>l});const l=a.p+"assets/images/img6-7a3d021c87c342b388ecc522c73dd8bd.png"},380:(e,t,a)=>{a.d(t,{Z:()=>l});const l=a.p+"assets/images/img8-035427ff903d699ade78755793244035.png"},7854:(e,t,a)=>{a.d(t,{Z:()=>l});const l=a.p+"assets/images/img9-176da135a0701ed639a27880de197d79.png"}}]);