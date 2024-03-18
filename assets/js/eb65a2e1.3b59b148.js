"use strict";(self.webpackChunkdosimpact_blog=self.webpackChunkdosimpact_blog||[]).push([[6998],{3905:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>d});var a=n(7294);function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){l(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,l=function(e,t){if(null==e)return{};var n,a,l={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(l[n]=e[n]);return l}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(l[n]=e[n])}return l}var u=a.createContext({}),p=function(e){var t=a.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},s=function(e){var t=p(e.components);return a.createElement(u.Provider,{value:t},e.children)},c="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},k=a.forwardRef((function(e,t){var n=e.components,l=e.mdxType,r=e.originalType,u=e.parentName,s=o(e,["components","mdxType","originalType","parentName"]),c=p(n),k=l,d=c["".concat(u,".").concat(k)]||c[k]||m[k]||r;return n?a.createElement(d,i(i({ref:t},s),{},{components:n})):a.createElement(d,i({ref:t},s))}));function d(e,t){var n=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var r=n.length,i=new Array(r);i[0]=k;var o={};for(var u in t)hasOwnProperty.call(t,u)&&(o[u]=t[u]);o.originalType=e,o[c]="string"==typeof e?e:l,i[1]=o;for(var p=2;p<r;p++)i[p]=n[p];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}k.displayName="MDXCreateElement"},9560:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>i,default:()=>m,frontMatter:()=>r,metadata:()=>o,toc:()=>p});var a=n(7462),l=(n(7294),n(3905));const r={sidebar_position:36},i="Cloud SW \uc544\ud0a4\ud14d\ucc98 \ud328\ud134:Deployment and Production Testing Patterns",o={unversionedId:"g-be/common/co036-cc7",id:"g-be/common/co036-cc7",title:"Cloud SW \uc544\ud0a4\ud14d\ucc98 \ud328\ud134:Deployment and Production Testing Patterns",description:"- Cloud SW \uc544\ud0a4\ud14d\ucc98 \ud328\ud134:Deployment and Production Testing Patterns",source:"@site/docs/g-be/0-common/co036-cc7.md",sourceDirName:"g-be/0-common",slug:"/g-be/common/co036-cc7",permalink:"/docs/g-be/common/co036-cc7",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/g-be/0-common/co036-cc7.md",tags:[],version:"current",sidebarPosition:36,frontMatter:{sidebar_position:36},sidebar:"backEnd",previous:{title:"Cloud SW \uc544\ud0a4\ud14d\ucc98 \ud328\ud134:Reliability, Error Handling, Recovery Patterns",permalink:"/docs/g-be/common/co035-cc6"},next:{title:"NestJS",permalink:"/docs/category/nestjs"}},u={},p=[{value:"Deployment and Production Testing Patterns",id:"deployment-and-production-testing-patterns",level:2},{value:"Rolling",id:"rolling",level:2},{value:"Blue-Green",id:"blue-green",level:2},{value:"Canary A/B",id:"canary-ab",level:2},{value:"Chaos Engineering Pattern",id:"chaos-engineering-pattern",level:2},{value:"Chaos Engineering - Motivation",id:"chaos-engineering---motivation",level:3},{value:"\ud559\uc2b5 \ud68c\uace0",id:"\ud559\uc2b5-\ud68c\uace0",level:2},{value:"1.\uc2dc\uc2a4\ud15c \ub808\ubca8\uc758 \uc774\ud574\uc5d0 \ub3c4\uc6c0\uc774 \ub9ce\uc774 \ub418\ub294 \uac15\uc758 \uc600\ub2e4.",id:"1\uc2dc\uc2a4\ud15c-\ub808\ubca8\uc758-\uc774\ud574\uc5d0-\ub3c4\uc6c0\uc774-\ub9ce\uc774-\ub418\ub294-\uac15\uc758-\uc600\ub2e4",level:3},{value:"2.\uba54\uc2dc\uc9c0 \ube0c\ub85c\ucee4 (\uce74\ud504\uce74)\uac00 \uc815\ub9d0 \ub2e4\uc591\ud55c \ud328\ud134\uc5d0 \uc4f0\uc778\ub2e4.",id:"2\uba54\uc2dc\uc9c0-\ube0c\ub85c\ucee4-\uce74\ud504\uce74\uac00-\uc815\ub9d0-\ub2e4\uc591\ud55c-\ud328\ud134\uc5d0-\uc4f0\uc778\ub2e4",level:3},{value:"3.\uacbd\ud5d8\uc758 \uc911\uc694\uc131\uc744 \uc54c\uac8c\ub418\uc5c8\ub2e4.",id:"3\uacbd\ud5d8\uc758-\uc911\uc694\uc131\uc744-\uc54c\uac8c\ub418\uc5c8\ub2e4",level:3},{value:"4.FE\uac1c\ubc1c\uc5d0\ub3c4 \ud070 \ub3c4\uc6c0\uc774 \ub41c\ub2e4.",id:"4fe\uac1c\ubc1c\uc5d0\ub3c4-\ud070-\ub3c4\uc6c0\uc774-\ub41c\ub2e4",level:3}],s={toc:p},c="wrapper";function m(e){let{components:t,...r}=e;return(0,l.kt)(c,(0,a.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"cloud-sw-\uc544\ud0a4\ud14d\ucc98-\ud328\ud134deployment-and-production-testing-patterns"},"Cloud SW \uc544\ud0a4\ud14d\ucc98 \ud328\ud134:Deployment and Production Testing Patterns"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"#cloud-sw-%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98-%ED%8C%A8%ED%84%B4deployment-and-production-testing-patterns"},"Cloud SW \uc544\ud0a4\ud14d\ucc98 \ud328\ud134:Deployment and Production Testing Patterns"),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"#deployment-and-production-testing-patterns"},"Deployment and Production Testing Patterns")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"#rolling"},"Rolling")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"#blue-green"},"Blue-Green")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"#canary-ab"},"Canary A/B")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"#chaos-engineering-pattern"},"Chaos Engineering Pattern"),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"#chaos-engineering---motivation"},"Chaos Engineering - Motivation")))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"#%ED%95%99%EC%8A%B5-%ED%9A%8C%EA%B3%A0"},"\ud559\uc2b5 \ud68c\uace0"),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"#1%EC%8B%9C%EC%8A%A4%ED%85%9C-%EB%A0%88%EB%B2%A8%EC%9D%98-%EC%9D%B4%ED%95%B4%EC%97%90-%EB%8F%84%EC%9B%80%EC%9D%B4-%EB%A7%8E%EC%9D%B4-%EB%90%98%EB%8A%94-%EA%B0%95%EC%9D%98-%EC%98%80%EB%8B%A4"},"1.\uc2dc\uc2a4\ud15c \ub808\ubca8\uc758 \uc774\ud574\uc5d0 \ub3c4\uc6c0\uc774 \ub9ce\uc774 \ub418\ub294 \uac15\uc758 \uc600\ub2e4.")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"#2%EB%A9%94%EC%8B%9C%EC%A7%80-%EB%B8%8C%EB%A1%9C%EC%BB%A4-%EC%B9%B4%ED%94%84%EC%B9%B4%EA%B0%80-%EC%A0%95%EB%A7%90-%EB%8B%A4%EC%96%91%ED%95%9C-%ED%8C%A8%ED%84%B4%EC%97%90-%EC%93%B0%EC%9D%B8%EB%8B%A4"},"2.\uba54\uc2dc\uc9c0 \ube0c\ub85c\ucee4 (\uce74\ud504\uce74)\uac00 \uc815\ub9d0 \ub2e4\uc591\ud55c \ud328\ud134\uc5d0 \uc4f0\uc778\ub2e4.")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"#3%EA%B2%BD%ED%97%98%EC%9D%98-%EC%A4%91%EC%9A%94%EC%84%B1%EC%9D%84-%EC%95%8C%EA%B2%8C%EB%90%98%EC%97%88%EB%8B%A4"},"3.\uacbd\ud5d8\uc758 \uc911\uc694\uc131\uc744 \uc54c\uac8c\ub418\uc5c8\ub2e4.")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"#4fe%EA%B0%9C%EB%B0%9C%EC%97%90%EB%8F%84-%ED%81%B0-%EB%8F%84%EC%9B%80%EC%9D%B4-%EB%90%9C%EB%8B%A4"},"4.FE\uac1c\ubc1c\uc5d0\ub3c4 \ud070 \ub3c4\uc6c0\uc774 \ub41c\ub2e4."))))))),(0,l.kt)("h2",{id:"deployment-and-production-testing-patterns"},"Deployment and Production Testing Patterns"),(0,l.kt)("p",null,"5.\ubc30\ud3ec \ubc0f \ud504\ub85c\ub355\uc158 \ud14c\uc2a4\ud2b8 \uc544\ud0a4\ud14d\ucc98 \ud328\ud134 - Deployment and Production Testing Patterns    "),(0,l.kt)("p",null,"\ubc30\ud3ec\uc5d0 \uad00\ub828\ub41c \uc0ac\ud56d\uc740 k8s \uc5d0\uc11c \ub354 \uc790\uc138\ud558\uac8c \ub2e4\ub8e8\ub294\uac8c \uc88b\uc744\uac83 \uac19\ub2e4.  "),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"k8s \ucef4\ud3ec\ub10c\ud2b8 \uac1c\ub150\uacfc \ud568\uaed8 \uc5ec\ub7ec \ubc30\ud3ec \uc804\ub7b5\ub4e4\uc744 \uc774\uc5b4\uc11c \ud559\uc2b5. ")),(0,l.kt)("h2",{id:"rolling"},"Rolling"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"Rolling Deployment benefits:"),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"No downtime"),(0,l.kt)("li",{parentName:"ul"},"No additional cost for hardware"),(0,l.kt)("li",{parentName:"ul"},"We can rollback quickly if something goes wrong  "))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"Downsides:"),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"Potential for Cascading Failures"),(0,l.kt)("li",{parentName:"ul"},"2 versions in production at the same time")))),(0,l.kt)("h2",{id:"blue-green"},"Blue-Green"),(0,l.kt)("p",null,(0,l.kt)("img",{src:n(7406).Z,width:"1656",height:"932"})),(0,l.kt)("h2",{id:"canary-ab"},"Canary A/B"),(0,l.kt)("p",null,"Both Canary Release and A/B Deployment Patterns allow us"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"to dedicate a small portion of servers for a different version of software")),(0,l.kt)("p",null,"During a Canary Release:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"We monitor for:",(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"Performance"),(0,l.kt)("li",{parentName:"ul"},"Functionality"))),(0,l.kt)("li",{parentName:"ul"},"Limit to internal users or beta testers")),(0,l.kt)("h2",{id:"chaos-engineering-pattern"},"Chaos Engineering Pattern"),(0,l.kt)("h3",{id:"chaos-engineering---motivation"},"Chaos Engineering - Motivation"),(0,l.kt)("p",null,"\u2022 We won't know about those issues until they actually happen\n\u2022 When they do happen it may be too late",(0,l.kt)("br",{parentName:"p"}),"\n","\u2022 Those issues are very rare",(0,l.kt)("br",{parentName:"p"}),"\n","\u2022 The results of those issue can be catastrophic",(0,l.kt)("br",{parentName:"p"}),"\n","\u2022 Solution of Chaos Engineering : Embracing the inherent chaos in a cloud-based\nDistributed System  "),(0,l.kt)("p",null,"Chaos Monkey (2011) by Netflix",(0,l.kt)("br",{parentName:"p"}),"\n","\u2022 Responsible for randomly terminating cloud servers in production"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"Chaos Engineering Pattern:  "),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"Increases confidence  "),(0,l.kt)("li",{parentName:"ul"},"Protects production against critical failures   "))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"Allows finding: "),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"Single Points of Failure   "),(0,l.kt)("li",{parentName:"ul"},"Scalability issues  "),(0,l.kt)("li",{parentName:"ul"},"Performance bottlenecks   "))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},"Ensures that real failures are dealt with gracefully  "))),(0,l.kt)("h2",{id:"\ud559\uc2b5-\ud68c\uace0"},"\ud559\uc2b5 \ud68c\uace0"),(0,l.kt)("h3",{id:"1\uc2dc\uc2a4\ud15c-\ub808\ubca8\uc758-\uc774\ud574\uc5d0-\ub3c4\uc6c0\uc774-\ub9ce\uc774-\ub418\ub294-\uac15\uc758-\uc600\ub2e4"},"1.\uc2dc\uc2a4\ud15c \ub808\ubca8\uc758 \uc774\ud574\uc5d0 \ub3c4\uc6c0\uc774 \ub9ce\uc774 \ub418\ub294 \uac15\uc758 \uc600\ub2e4."),(0,l.kt)("p",null,"\uc0ac\ub0b4 \uc2dc\uc2a4\ud15c\uc5d0 \ub2e4\uc591\ud55c \uc544\ud0a4\ud14d\ucc98\ub4e4\uc774 \uc874\uc7ac\ud55c\ub2e4.",(0,l.kt)("br",{parentName:"p"}),"\n","\uc2dc\uc2a4\ud15c \uc544\ud0a4\ud14d\ucc98\ub4e4\uc744 \ubcf4\uba74 \ub9e4\ubc88 \uc0c8\ub86d\uace0 \uc88b\uc544\ubcf4\uc600\ub2e4.   "),(0,l.kt)("p",null,"\uc544\ud0a4\ud14d\ucc98 \ud328\ud134\uc744 \uc774\ud574\ud558\uace0 \ubcf4\ub2c8, \uc0ac\uc2e4\uc0c1 \ubaa8\ub4e0 \uc2dc\uc2a4\ud15c\ub4e4\uc774 Best Practice\ub294 \uc544\ub2cc \uacbd\uc6b0\uac00 \ubcf4\uc778\ub2e4.   "),(0,l.kt)("p",null,"\uc624\ubc84\uc5d4\uc9c0\ub2c8\uc5b4\ub9c1\uc744 \ud55c \uacbd\uc6b0, \uc77c\uc815\uc5d0 \ucad2\uaca8\uc11c \ub354 \uc88b\uc740 \uad6c\uc870\ub85c \uac08 \uc218 \uc788\uc73c\ub098 \ud0c0\ud611\ud55c \uacbd\uc6b0 \ub4f1\ub4f1  "),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\uc774\ubca4\ud2b8 \uc544\ud0a4\ud14d\ucc98\ub85c, \uba54\uc2dc\uc9c0 \ube0c\ub85c\ucee4\ub97c \ub3c4\uc785\ud560 \ub9cc\ud07c \uc911\uc694\ud55c \uae30\ub2a5\uc784\uc5d0\ub3c4  "),(0,l.kt)("li",{parentName:"ul"},"Time Based Sync\ub85c \ucef4\ud3ec\ub10c\ud2b8\uac04 \ub370\uc774\ud130 \ub3d9\uae30\ud654 \ud50c\ub85c\uc6b0\ub85c \ucc44\uc6cc\uac00\ub294 \uacbd\uc6b0\ub3c4 \uc788\uc5c8\ub2e4.    "),(0,l.kt)("li",{parentName:"ul"},"\uadf8\ub7ec\uba74 \ube44\ub85d \uc9e7\uc740 \uc2dc\uac04\uc77c\uc9c0\ub77c\ub3c4 '\uc77c\uad00\uc131'\uc774 \uae68\uc9c8 \uc218 \uc788\ub2e4.   ")),(0,l.kt)("p",null,"\uc608\ub97c\ub4e4\uc5b4 Youbube\ucc98\ub7fc \uad11\uace0 \uc601\uc0c1\uc744 \uc62c\ub9ac\ub294 \uae30\ub2a5\uc774\ub2e4.  "),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\uad11\uace0 \uc815\ucc45\uc5d0 \uc774\uc288\uac00 \uc788\ub294 \ucf58\ud150\uce20\ub294 \uc0ac\uc804\uc5d0 \uccb4\ud06c\ud574\uc57c \ud55c\ub2e4.  "),(0,l.kt)("li",{parentName:"ul"},"\ud558\uc9c0\ub9cc \uc6b0\uc120 \uad11\uace0 \uc601\uc0c1\uc774 \uacf5\uac1c\ub418\uace0, \uadf8 \uc774\ud6c4 Audit \ud558\ub294 \ub85c\uc9c1\uc774 \ub3cc\uc544\uac04\ub2e4.  "),(0,l.kt)("li",{parentName:"ul"},"\ucd5c\ub300 30\ubd84\uc815\ub3c4 \uc7a0\uc7ac\uc801 \uc704\ud5d8\uc774 \uc788\ub294 \uad11\uace0 \uc601\uc0c1\uc774 \uacf5\uac1c\ub418\ub294 \uac83\uc774\ub2e4.  ")),(0,l.kt)("p",null,"\uc0ac\ub0b4 \uc2dc\uc2a4\ud15c\uc5d0 \ub300\ud574\uc11c \uc2a4\ud130\ub514\ub97c \ud558\uc790.!"),(0,l.kt)("h3",{id:"2\uba54\uc2dc\uc9c0-\ube0c\ub85c\ucee4-\uce74\ud504\uce74\uac00-\uc815\ub9d0-\ub2e4\uc591\ud55c-\ud328\ud134\uc5d0-\uc4f0\uc778\ub2e4"},"2.\uba54\uc2dc\uc9c0 \ube0c\ub85c\ucee4 (\uce74\ud504\uce74)\uac00 \uc815\ub9d0 \ub2e4\uc591\ud55c \ud328\ud134\uc5d0 \uc4f0\uc778\ub2e4."),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\ub85c\ub4dc\ubc38\ub7f0\uc2f1, \ucf54\ub808\uc624\uadf8\ub798\ud53c, CQRS \ud328\ud134 \ub4f1  "),(0,l.kt)("li",{parentName:"ul"},"\uc2dc\uc2a4\ud15c\uc5d0\uc11c \ube44\ub3d9\uae30\ub77c\ub294 \uc791\uc5c5\uc740 \uc815\ub9d0 \ub9ce\uace0, \uadf8\ub798\uc11c \uce74\ud504\uce74\uac00 \uc911\uc694\ud558\uad6c\ub098.  ")),(0,l.kt)("p",null,"\uce74\ud504\uce74\uc5d0 \ub300\ud574\uc11c \uc587\ud30d\ud558\uac8c \uc54c\uc544\ubcf4\uc790.!  "),(0,l.kt)("h3",{id:"3\uacbd\ud5d8\uc758-\uc911\uc694\uc131\uc744-\uc54c\uac8c\ub418\uc5c8\ub2e4"},"3.\uacbd\ud5d8\uc758 \uc911\uc694\uc131\uc744 \uc54c\uac8c\ub418\uc5c8\ub2e4."),(0,l.kt)("p",null,"\uc0ac\uc2e4\uc0c1 \uc9c0\uae08\uae4c\uc9c0 \ubc30\uc6b4 \uc544\ud0a4\ud14d\ucc98 \ud328\ud134\uc740 \uc774\ub860\uc5d0 \ubd88\uacfc\ud558\ub2e4.  "),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\uc2e4\uc81c \ube44\uc988\ub2c8\uc2a4 \ub85c\uc9c1\uc744 \ub2f4\uace0 \ub3c8\uc73c\ub85c \ubc8c\uc5b4\ubd10\uc57c \uadf8 \ubcf5\uc7a5\uc131\uacfc \ud604\uc2e4 \ud0c0\ud611\uc810\ub4e4\uc744 \uc54c\uac8c \ub41c\ub2e4.  "),(0,l.kt)("li",{parentName:"ul"},"\uae30\ubcf8 \ubca0\uc774\uc2a4 \uc9c0\uc2dd\ub4e4\uc744 \uc54c\uace0, \ud604\uc2e4\uc5d0\uc11c \ub9c8\uc8fc\ud560 \uc218 \uc788\ub294 \uc218\ub9ce\uc740 \uc560\ub7ec\ub4e4\uc744 \ud578\ub4e4\ub9c1 \ud558\uba70  "),(0,l.kt)("li",{parentName:"ul"},"\ud070 \uaddc\ubaa8\uc758 \uc2dc\uc2a4\ud15c\uc744 \uc131\uacf5\uc801\uc73c\ub85c \uc774\ub044\ub294 \uacbd\ud5d8\uc774 \uc18c\uc911\ud560\uac83 \uac19\ub2e4.   "),(0,l.kt)("li",{parentName:"ul"},"\uac1c\ubc1c\uc52c \uc740\ud1f4\uae4c\uc9c0 2~3\uac1c\uc758 \ub300\uaddc\ubaa8 \uc2dc\uc2a4\ud15c\uc744 \uad6c\ucd95\ud574\ubcf4\ub294\uac83\ub3c4 \uc5b4\ub824\uc6b8 \uc218 \uc788\ub2e4\ub294 \uc0dd\uac01.  "),(0,l.kt)("li",{parentName:"ul"},"\ucd08\uae30 \uc2a4\ud0c0\ud2b8\uc5c5, \uc2e0\uc0ac\uc5c5\ubd80 \uac19\uc740 \uacbd\uc6b0\ub77c\uba74 \uae30\ud68c\uac00 \ub354 \ub9ce\uc744\uc9c0\ub3c4?")),(0,l.kt)("p",null,"\uc0ac\uc774\ub4dc\ud504\ub85c\uc81d\ud2b8 \ud639\uc740 \uae30\ud68c\uac00 \ub418\uba74 \uc2dc\uc2a4\ud15c \uc124\uacc4\ub97c \ud558\uc790.!"),(0,l.kt)("h3",{id:"4fe\uac1c\ubc1c\uc5d0\ub3c4-\ud070-\ub3c4\uc6c0\uc774-\ub41c\ub2e4"},"4.FE\uac1c\ubc1c\uc5d0\ub3c4 \ud070 \ub3c4\uc6c0\uc774 \ub41c\ub2e4."),(0,l.kt)("p",null,"\uc544\ud0a4\ud14d\ucc98 \ud328\ud134 \uac15\uc758\ub97c \ub4e4\uc73c\uba74\uc11c FE\uac1c\ubc1c \uad00\ub828\ub41c \ubd80\ubd84\uc740 \ud558\ub098\uc758 \ud30c\ud2b8\ubc16\uc5d0 \uc5c6\uc5c8\ub2e4.  "),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"BFF \ud328\ud134\ubc16\uc5d0\uc11c \uc5c6\uc5b4\uc11c \uc544\uc26c\uc6e0\ub2e4.  "),(0,l.kt)("li",{parentName:"ul"},"\ub9c8\uc774\ud06c\ub85c \ud504\ub860\ud2b8 \uc5d4\ub4dc \ub4f1 \uc544\ud0a4\ud14d\ucc98\ub97c \uace0\ub824\ud560 \ubd80\ubd84\ub4e4\uc774 \uc788\uae34 \ud558\ub2e4.  "),(0,l.kt)("li",{parentName:"ul"},"\uadf8\ub7fc\uc5d0\ub3c4 FE\uc9c0\uc2dd\uacfc \uc9c0\uae08\uac00\uc9c0 \ubc30\uc6b4 \ud328\ud134\ub4e4\uc744 \uc870\ud569\ud574\uc11c \uc2dc\uc2a4\ud15c\uc744 \uad6c\ucd95\ud574\ubcfc \uc218 \uc788\uc744\uac83 \uac19\ub2e4.  ")),(0,l.kt)("p",null,"\uc608) Static Site Generator + CQRS Pattern.  "),(0,l.kt)("p",null,"SSR \uae30\ub2a5\uc774 \ud0d1\uc7ac\ub41c Next.js, Nuxt.js \uc5d0\ub294 \uc815\uc801\uc0ac\uc774\ud2b8\ub97c \uc0dd\uc131\ud560 \uc218 \uc788\ub294 \uae30\ub2a5\ub4e4\uc774 \uc788\ub2e4.",(0,l.kt)("br",{parentName:"p"}),"\n","\uc0ac\uc6a9\uc790\ub4e4\uc758 \ud3ec\uc2a4\ud305, \ub274\uc2a4\uae30\uc0ac \ub4f1\uc744 \ubc1c\ud589\uc744 \ud55c\ub2e4.",(0,l.kt)("br",{parentName:"p"}),"\n","\uc0ac\uc6a9\uc790\ub4e4\uc774 \ub9cc\ub4e4\uc5b4\ub454 \ucf58\ud150\uce20\ub97c \ubc14\ud0d5\uc73c\ub85c \ubbf8\ub9ac\ubbf8\ub9ac \uc815\uc801\uc0ac\uc774\ud2b8\ub4e4\uc744 \uc0dd\uc131\ud574\uc57c \ud55c\ub2e4.",(0,l.kt)("br",{parentName:"p"}),"\n","\uc5ec\ub7ec\uac00\uc9c0 \ubc29\ubc95\uc774 \uc788\ub2e4.  "),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"\uc8fc\uae30\uc801\uc73c\ub85c \uc815\uc801\uc0ac\uc774\ud2b8\ub97c \ub9cc\ub4dc\ub294 \ubc29\ubc95  "),(0,l.kt)("li",{parentName:"ul"},"\uc0ac\uc6a9\uc790\uc758 \uc694\uccad\uc774 \ub4e4\uc5b4\uc62c\ub54c \uc815\uc801\uc0ac\uc774\ud2b8\ub97c \ub9cc\ub4e4\uc5b4 \uc8fc\uace0 \uce90\uc2f1\ud558\ub294 \ubc29\ubc95    "),(0,l.kt)("li",{parentName:"ul"},"CQRS \ud328\ud134\uc744 \uc774\uc6a9\ud558\uba74, \uc0ac\uc6a9\uc790\uac00 \ucf58\ud150\uce20\ub97c \uc5c5\ub370\uc774\ud2b8 \ud560 \ub54c \uc774\ub97c \uad6c\ub3c5\ud558\uace0 \uc815\uc801\uc0ac\uc774\ud2b8\ub97c \ub9cc\ub4e4\uc5b4\ubcfc \uc218 \uc788\ub2e4. !")),(0,l.kt)("p",null,"FE\uc5d0 \uc801\uc6a9\uc2dc\ud0a4\uba74 \uc88b\uc744 \uc2dc\uc2a4\ud15c \uc124\uacc4\ub97c \uacf5\ubd80\ud558\uc790.!"))}m.isMDXComponent=!0},7406:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/co61-696a5c8c1384944b7eb7cbf2ef17e3c4.png"}}]);