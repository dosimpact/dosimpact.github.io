"use strict";(self.webpackChunkdosimpact_blog=self.webpackChunkdosimpact_blog||[]).push([[1050],{3905:(e,t,l)=>{l.d(t,{Zo:()=>m,kt:()=>N});var a=l(67294);function n(e,t,l){return t in e?Object.defineProperty(e,t,{value:l,enumerable:!0,configurable:!0,writable:!0}):e[t]=l,e}function r(e,t){var l=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),l.push.apply(l,a)}return l}function i(e){for(var t=1;t<arguments.length;t++){var l=null!=arguments[t]?arguments[t]:{};t%2?r(Object(l),!0).forEach((function(t){n(e,t,l[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(l)):r(Object(l)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(l,t))}))}return e}function u(e,t){if(null==e)return{};var l,a,n=function(e,t){if(null==e)return{};var l,a,n={},r=Object.keys(e);for(a=0;a<r.length;a++)l=r[a],t.indexOf(l)>=0||(n[l]=e[l]);return n}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)l=r[a],t.indexOf(l)>=0||Object.prototype.propertyIsEnumerable.call(e,l)&&(n[l]=e[l])}return n}var o=a.createContext({}),p=function(e){var t=a.useContext(o),l=t;return e&&(l="function"==typeof e?e(t):i(i({},t),e)),l},m=function(e){var t=p(e.components);return a.createElement(o.Provider,{value:t},e.children)},c="mdxType",k={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},s=a.forwardRef((function(e,t){var l=e.components,n=e.mdxType,r=e.originalType,o=e.parentName,m=u(e,["components","mdxType","originalType","parentName"]),c=p(l),s=n,N=c["".concat(o,".").concat(s)]||c[s]||k[s]||r;return l?a.createElement(N,i(i({ref:t},m),{},{components:l})):a.createElement(N,i({ref:t},m))}));function N(e,t){var l=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var r=l.length,i=new Array(r);i[0]=s;var u={};for(var o in t)hasOwnProperty.call(t,o)&&(u[o]=t[o]);u.originalType=e,u[c]="string"==typeof e?e:n,i[1]=u;for(var p=2;p<r;p++)i[p]=l[p];return a.createElement.apply(null,i)}return a.createElement.apply(null,l)}s.displayName="MDXCreateElement"},37940:(e,t,l)=>{l.r(t),l.d(t,{assets:()=>o,contentTitle:()=>i,default:()=>k,frontMatter:()=>r,metadata:()=>u,toc:()=>p});var a=l(87462),n=(l(67294),l(3905));const r={sidebar_position:1},i="Evaluation LLM Summarization",u={unversionedId:"g-hard/llm/llm-01-evaluate-1",id:"g-hard/llm/llm-01-evaluate-1",title:"Evaluation LLM Summarization",description:"- Evaluation LLM Summarization",source:"@site/docs/g-hard/7-llm/llm-01-evaluate-1.md",sourceDirName:"g-hard/7-llm",slug:"/g-hard/llm/llm-01-evaluate-1",permalink:"/docs/g-hard/llm/llm-01-evaluate-1",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/g-hard/7-llm/llm-01-evaluate-1.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"hardSkill",previous:{title:"LLM App \uc81c\uc791\uc744 \uc704\ud55c \ubc30\uacbd\uc9c0\uc2dd",permalink:"/docs/g-hard/llm/llm-00"}},o={},p=[{value:"Precision, Recall, F1 Score",id:"precision-recall-f1-score",level:2},{value:"Precision \uacfc Recall \uc758 \uad00\uacc4",id:"precision-\uacfc-recall-\uc758-\uad00\uacc4",level:4},{value:"Evaluate LLM Summarization",id:"evaluate-llm-summarization",level:2}],m={toc:p},c="wrapper";function k(e){let{components:t,...r}=e;return(0,n.kt)(c,(0,a.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"evaluation-llm-summarization"},"Evaluation LLM Summarization"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"#evaluation-llm-summarization"},"Evaluation LLM Summarization"),(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"#precision-recall-f1-score"},"Precision, Recall, F1 Score"),(0,n.kt)("pre",{parentName:"li"},(0,n.kt)("code",{parentName:"pre"},"- [Precision \uacfc Recall \uc758 \uad00\uacc4](#precision-\uacfc-recall-\uc758-\uad00\uacc4)\n"))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"#evaluate-llm-summarization"},"Evaluate LLM Summarization"))))),(0,n.kt)("h2",{id:"precision-recall-f1-score"},"Precision, Recall, F1 Score"),(0,n.kt)("p",null,(0,n.kt)("img",{alt:"Alt text",src:l(34248).Z,width:"998",height:"296"}),"  "),(0,n.kt)("p",null,"\u2705 TP (True Positive)  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Positive = \ucc38\uc774\ub77c\uace0 \ubaa8\ub378\uc774 \uc608\uce21\ud588\ub294\ub370, True \uadf8\uac83\uc774 \uc9c4\uc2e4\uc774\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\uc608: \uc554 \ud658\uc790\uc778\ub370 \ubaa8\ub378\ub3c4 \uc554\uc774\ub77c\uace0 \uc608\uce21\ud568  ")),(0,n.kt)("p",null,"\u274c FP (False Positive)"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Positive = \ucc38\uc774\ub77c\uace0 \ubaa8\ub378\uc774 \uc608\uce21\ud588\ub294\ub370, False \uadf8\uac83\uc774 \uc9c4\uc2e4\uc774\ub2e4.  "),(0,n.kt)("li",{parentName:"ul"},"\uc608: \uba40\uca61\ud55c \uc0ac\ub78c\uc778\ub370 \ubaa8\ub378\uc774 \uc554\uc774\ub77c\uace0 \uc798\ubabb \ud310\ub2e8\ud568 (\uac70\uc9d3 \uacbd\ubcf4)   ")),(0,n.kt)("p",null,"\u274c FN (False Negative)  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\uc815\ub2f5\uc740 Yes, \uc608\uce21\uc740 No  "),(0,n.kt)("li",{parentName:"ul"},"\uc608: \uc554 \ud658\uc790\uc778\ub370 \ubaa8\ub378\uc774 \uac74\uac15\ud558\ub2e4\uace0 \uc608\uce21\ud568 (\ub193\uce5c \uc815\ub2f5)  ")),(0,n.kt)("p",null,"\u2705 TN (True Negative)  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\uc815\ub2f5\ub3c4 No, \uc608\uce21\ub3c4 No   "),(0,n.kt)("li",{parentName:"ul"},"\uc608: \uac74\uac15\ud55c \uc0ac\ub78c\uc744 \uac74\uac15\ud558\ub2e4\uace0 \uc798 \ub9de\ucda4    ")),(0,n.kt)("hr",null),(0,n.kt)("p",null,"\ud83d\udcd0 \uc704 \uae30\uc900\uc73c\ub85c \uc9c0\ud45c \uacc4\uc0b0"),(0,n.kt)("p",null,"Precision (\uc815\ubc00\ub3c4)"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"TP / ( TP + FP )  "),(0,n.kt)("li",{parentName:"ul"},"\ubaa8\ub378\uc774 \ub9de\ucdc4\ub2e4\uace0 \ud55c \uac83 \uc911 \uc2e4\uc81c\ub85c \ub9de\uc740 \ube44\uc728")),(0,n.kt)("p",null,"Recall (\uc7ac\ud604\uc728)"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"TP / ( TP + FN )  "),(0,n.kt)("li",{parentName:"ul"},"\uc2e4\uc81c \uc815\ub2f5 \uc911\uc5d0\uc11c \ubaa8\ub378\uc774 \uc798 \ub9de\ucd98 \ube44\uc728 ")),(0,n.kt)("p",null,"F1 Score"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Precision + Recall\uc758 \uc870\ud654\ud3c9\uade0"),(0,n.kt)("li",{parentName:"ul"},"\uc815\ubc00\ub3c4\uc640 \uc7ac\ud604\uc728\uc744 \uade0\ud615 \uc788\uac8c \ud3c9\uac00\ud55c \uc9c0\ud45c")),(0,n.kt)("p",null,"\ud83c\udfaf \uc65c \uc911\uc694\ud55c\uac00\uc694?"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"TP, FP, FN, TN\uc740 \ubaa8\ub378 \uc131\ub2a5\uc744 \uc9c4\uc9dc\ub85c \ubd84\uc11d\ud560 \ub54c \uae30\ubcf8\uc774 \ub418\ub294 \uac12\uc774\uc5d0\uc694."),(0,n.kt)("li",{parentName:"ul"},"\uc774 4\uac1c \uac12\uc744 \uc54c\uba74 \ubaa8\ub4e0 \ud3c9\uac00 \uc9c0\ud45c\ub97c \uacc4\uc0b0\ud560 \uc218 \uc788\uc5b4\uc694."),(0,n.kt)("li",{parentName:"ul"},"\ud2b9\ud788 \ubd88\uade0\ud615 \ub370\uc774\ud130(\uc608: \uc0ac\uae30 \ud0d0\uc9c0, \uc554 \uc9c4\ub2e8)\uc5d0\uc11c\ub294 Accuracy(\uc815\ud655\ub3c4)\ubcf4\ub2e4 \ud6e8\uc52c \uc911\uc694\ud574\uc694.")),(0,n.kt)("hr",null),(0,n.kt)("p",null,"\uc870\ud654\ud3c9\uade0\uc758 \uacf5\uc2dd",(0,n.kt)("br",{parentName:"p"}),"\n",(0,n.kt)("img",{alt:"Alt text",src:l(89094).Z,width:"650",height:"576"}),"\n",(0,n.kt)("strong",{parentName:"p"},"\uac12\ub4e4 \uc911 \uc791\uc740 \uac12\uc5d0 \ub354 \ud070 \uac00\uc911\uce58\ub97c \ub450\uc5b4, \uc804\uccb4 \uade0\ud615\uc744 \ud3c9\uac00"),"\ud558\ub824\ub294 \ubaa9\uc801\uc774\uc5d0\uc694.  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\ud83d\udd0d \ube44\uc720: \u201c\ub290\ub9b0 \ub188\uc774 \uc804\uccb4\ub97c \ub290\ub9ac\uac8c \ub9cc\ub4e0\ub2e4\u201d  "),(0,n.kt)("li",{parentName:"ul"},"\ub450 \uac12 \uc911 \uc791\uc740 \uac12\uc774 \uc804\uccb4 \ud3c9\uade0\uc744 \uc9c0\ubc30\ud558\uac8c \ub418\ub294 \uad6c\uc870\uc608\uc694.  "),(0,n.kt)("li",{parentName:"ul"},"\ud83c\udfaf \uc811\uadfc 2: \uc791\uc5c5 \ud6a8\uc728 \ube44\uc720 (\uc880 \ub354 \uc77c\ubc18\uc801\uc778 \uc124\uba85)  "),(0,n.kt)("li",{parentName:"ul"},"\uc5b4\ub5a4 \uc0ac\ub78c\uc774 1\uc2dc\uac04\uc5d0 a\uac1c \uc791\uc5c5, \ub2e4\ub978 \uc0ac\ub78c\uc740 1\uc2dc\uac04\uc5d0 b\uac1c \uc791\uc5c5  "),(0,n.kt)("li",{parentName:"ul"},"\uc774 \ub458\uc774 \uac19\uc774 1\uac1c\uc758 \uc791\uc5c5\uc744 \ud558\uba74 \uc5bc\ub9c8\ub098 \uac78\ub9b4\uae4c\uc694?  ")),(0,n.kt)("hr",null),(0,n.kt)("h4",{id:"precision-\uacfc-recall-\uc758-\uad00\uacc4"},"Precision \uacfc Recall \uc758 \uad00\uacc4"),(0,n.kt)("p",null,"\u2705 1. Precision \u2191, Recall \u2191 (\uc815\ubc00\ub3c4 \ub192\uace0, \uc7ac\ud604\uc728\ub3c4 \ub192\uc74c)"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\ucd5c\uace0\uc758 \uc774\uc0c1\uc801\uc778 \uc0c1\ud669, \ubaa8\ub378\uc774 \uc815\ub2f5\ub3c4 \uc798 \ucc3e\uace0, \ud2c0\ub9ac\ub294 \uacbd\uc6b0\ub3c4 \uac70\uc758 \uc5c6\uc74c."),(0,n.kt)("li",{parentName:"ul"},"\uc608:\uc2a4\ud338 \ud544\ud130\uac00 \uc2a4\ud338\uc744 \uac70\uc758 \ub2e4 \uc7a1\uc544\ub0b4\uba74\uc11c"),(0,n.kt)("li",{parentName:"ul"},"\ud83c\udfaf \ubaa8\ub378 \uc131\ub2a5 \uc6b0\uc218, \uc2e4\uc6a9\uc131 \ub192\uc74c")),(0,n.kt)("p",null,"\u2705 2. Precision \u2191, Recall \u2193 (\uc815\ubc00\ub3c4 \ub192\uace0, \uc7ac\ud604\uc728 \ub0ae\uc74c)"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\ubaa8\ub378\uc774 \uc815\ub2f5\uc744 \ub193\uce58\uae34 \ud558\uc9c0\ub9cc, \ub9de\ucdc4\ub2e4\uace0 \ud55c \uac74 \uac70\uc758 \ub2e4 \uc9c4\uc9dc \uc815\ub2f5\uc774\uc5d0\uc694."),(0,n.kt)("li",{parentName:"ul"},"\uc554 \uc9c4\ub2e8 \ubaa8\ub378\uc774 \ud655\uc2e4\ud55c \uacbd\uc6b0\uc5d0\ub9cc \u2018\uc554\u2019\uc774\ub77c\uace0 \uc608\uce21\ud568"),(0,n.kt)("li",{parentName:"ul"},"\ud83c\udfaf \ubcf4\uc218\uc801 \ud310\ub2e8, \uac70\uc9d3 \uc591\uc131(False Positive)\uc744 \uc904\uc774\ub294 \uac8c \uc911\uc694\ud55c \uacbd\uc6b0\uc5d0 \uc801\ud569"),(0,n.kt)("li",{parentName:"ul"},"\u2192 \uc608: \uc7ac\ud310, \uc57d \ucd94\ucc9c, \uace0\uc704\ud5d8 \uae08\uc735 \ubaa8\ub378")),(0,n.kt)("p",null,"\u2705 3. Precision \u2193, Recall \u2191 (\uc815\ubc00\ub3c4 \ub0ae\uace0, \uc7ac\ud604\uc728 \ub192\uc74c)"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\ubaa8\ub378\uc774 \uc815\ub2f5\uc744 \ub9ce\uc774 \ucc3e\uae34 \ud558\uc9c0\ub9cc,\ud5db\ub2e4\ub9ac\ub3c4 \ub9ce\uc774 \uc9da\uc74c (\uc624\ub2f5\ub3c4 \ub9ce\uc74c)"),(0,n.kt)("li",{parentName:"ul"},"\uc2a4\ud338\uba54\uc77c \ub300\ubd80\ubd84\uc744 \ud0d0\uc9c0\ud588\uc9c0\ub9cc, \uc815\uc0c1 \uba54\uc77c\uae4c\uc9c0 \uc2a4\ud338\uc73c\ub85c \uc624\ud310"),(0,n.kt)("li",{parentName:"ul"},"\uc554 \uc9c4\ub2e8\uc5d0\uc11c \ud658\uc790\ub294 \uac70\uc758 \ub2e4 \uac78\ub7ec\ub0b4\uc9c0\ub9cc, \uac74\uac15\ud55c \uc0ac\ub78c\ub3c4 \uc554\uc774\ub77c\uace0 \uc624\uc9c4"),(0,n.kt)("li",{parentName:"ul"},"\ud83c\udfaf \uc815\ub2f5\uc744 \ub193\uce58\uba74 \uc548 \ub418\ub294 \uc0c1\ud669\uc5d0 \uc801\ud569 \u2192 \uc608: \ubc94\uc8c4 \ud0d0\uc9c0, \uc751\uae09 \uc9c8\ubcd1 \uc2a4\ud06c\ub9ac\ub2dd, \ud14c\ub7ec \ud0d0\uc9c0")),(0,n.kt)("h2",{id:"evaluate-llm-summarization"},"Evaluate LLM Summarization"),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"https://medium.com/data-science/how-to-evaluate-llm-summarization-18a040c3905d#60ce"},"https://medium.com/data-science/how-to-evaluate-llm-summarization-18a040c3905d#60ce")),(0,n.kt)("p",null,"\uacb0\ub860\ubd80\ud130 \ub9d0\ud558\uba74, \uc774 \uae00\uc740 LLM \uc694\uc57d \ud3c9\uac00\uc758 \uc5b4\ub824\uc6c0\uacfc \uae30\uc874 \ud3c9\uac00 \ubc29\ubc95\uc758 \ud55c\uacc4\uc810\uc744 \uc124\uba85\ud558\uace0, \uc774\ub97c \ubcf4\uc644\ud55c \uc2e4\uc6a9\uc801\uc774\uace0 \uc815\ub7c9\uc801\uc778 \uc694\uc57d \ud3c9\uac00 \ud504\ub808\uc784\uc6cc\ud06c\ub97c \uc81c\uc548\ud55c \uae00\uc774\uc5d0\uc694. \ud575\uc2ec\uc740 \uc694\uc57d \ud3c9\uac00\ub97c \uc815\ubc00\ud558\uace0 \uccb4\uacc4\uc801\uc73c\ub85c \uc218\ud589\ud558\ub824\uba74 \uc815\ubc00\ub3c4(precision)\uc640 \uc7ac\ud604\uc728(recall)\uc758 \uad00\uc810\uc5d0\uc11c \uc811\uadfc\ud574\uc57c \ud558\uba70, DeepEval \ud504\ub808\uc784\uc6cc\ud06c\ub97c \uae30\ubc18\uc73c\ub85c \ubcf4\uc644\uc774 \ud544\uc694\ud558\ub2e4\ub294 \uc810\uc774\uc5d0\uc694."),(0,n.kt)("p",null,"\u2e3b"),(0,n.kt)("p",null,"\u2705 \ud575\uc2ec \uc694\uc57d"),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},"LLM \uc694\uc57d \ud3c9\uac00\uac00 \uc5b4\ub824\uc6b4 \uc774\uc720")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\uc694\uc57d\uc740 \uc815\ub2f5\uc774 \uc815\ud574\uc9c0\uc9c0 \uc54a\uc740 \uac1c\ubc29\ud615(open-ended) \uc791\uc5c5\uc774\ub77c \uc815\ub7c9\uc801 \ud3c9\uac00\uac00 \uc5b4\ub835\uace0 \uc8fc\uad00\uc131\uc774 \ucee4\uc694."),(0,n.kt)("li",{parentName:"ul"},"\ub808\ud37c\ub7f0\uc2a4 \uc694\uc57d \uc0dd\uc131\uc774 \uc5b4\ub835\uae30 \ub54c\ubb38\uc5d0 \uc790\ub3d9\ud654\ub41c \ud3c9\uac00 \ub370\uc774\ud130\uc14b \uad6c\uc131\uc774 \uc5b4\ub824\uc6cc\uc694."),(0,n.kt)("li",{parentName:"ul"},"\uae30\uc874 BLEU, ROUGE \ub4f1 \uc804\ud1b5\uc801\uc778 \ud3c9\uac00\uc9c0\ud45c\ub294 \ucd94\ucd9c \uc694\uc57d(extractive)\uc5d0 \uc801\ud569\ud558\uba70, LLM\uc758 \ucd94\uc0c1 \uc694\uc57d(abstractive)\uc5d0\ub294 \uc798 \ub9de\uc9c0 \uc54a\uc544\uc694.")),(0,n.kt)("ol",{start:2},(0,n.kt)("li",{parentName:"ol"},"\uc88b\uc740 \uc694\uc57d\uc758 \uc870\uac74 (4\uac00\uc9c0 \uc694\uc18c)  ")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("strong",{parentName:"li"},"Relevance"),": \uc6d0\ubb38\uc5d0\uc11c \uc911\uc694\ud55c \ub0b4\uc6a9\uc744 \uc798 \ub2f4\uace0 \uc788\uc5b4\uc57c \ud574\uc694.  "),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("strong",{parentName:"li"},"Conciseness"),": \ubc18\ubcf5 \uc5c6\uc774 \ud575\uc2ec\ub9cc \ub2f4\uc544 \uac04\uacb0\ud574\uc57c \ud574\uc694.  "),(0,n.kt)("li",{parentName:"ul"},"Coherence: \uad6c\uc870\uc801\uc73c\ub85c \ub17c\ub9ac\uc801 \ud750\ub984\uc774 \uc788\uc5b4\uc57c \ud574\uc694.  "),(0,n.kt)("li",{parentName:"ul"},"Faithfulness: \uc6d0\ubb38\uc5d0 \uc5c6\ub294 \ub0b4\uc6a9\uc744 \ud658\uac01(hallucination)\ud558\uba74 \uc548 \ub3fc\uc694.  ",(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"*\uccab\ubc88\uc9f8 \ub450\ubc88\uc9f8\ub97c \ud569\uccd0\uc11c F1 Score \ucc98\ub7fc \ub9cc\ub4e4 \uc218 \uc788\ub2e4.  ")))),(0,n.kt)("ol",{start:3},(0,n.kt)("li",{parentName:"ol"},"\uae30\uc874 DeepEval \uc694\uc57d \ud3c9\uac00 \ubc29\uc2dd")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Alignment (\uc815\ubc00\ub3c4): \uc694\uc57d\uc758 \uc8fc\uc7a5\ub4e4\uc774 \uc6d0\ubb38\uc5d0\uc11c \ub098\uc628 \uc815\ubcf4\uc640 \uc77c\uce58\ud558\ub294\uc9c0 \ud3c9\uac00."),(0,n.kt)("li",{parentName:"ul"},"Coverage (\uc7ac\ud604\uc728): \uc6d0\ubb38\uc5d0 \uae30\ubc18\ud55c \uc9c8\ubb38\uc5d0 \uc694\uc57d\ub9cc\uc73c\ub85c \uc5bc\ub9c8\ub098 \uc798 \ub2f5\ud560 \uc218 \uc788\ub294\uc9c0 \ud3c9\uac00.",(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"\ucd5c\uc885 \uc810\uc218\ub294 min(alignment, coverage)\ub85c \uacc4\uc0b0\ub3fc\uc694.")))),(0,n.kt)("p",null,"\ud83d\udee0 \uac1c\uc120\ub41c \uc694\uc57d \ud3c9\uac00 \ubc29\uc2dd (\uc791\uc131\uc790\uac00 \uc9c1\uc811 \uac1c\ubc1c)"),(0,n.kt)("p",null,"\u2705 \ubb38\uc81c\uc810 & \ud574\uacb0\ucc45"),(0,n.kt)("p",null,"1.Yes/No \uc9c8\ubb38\ub9cc \uc0ac\uc6a9\ud558\ub294 Coverage \ud3c9\uac00"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\ub2e8\ub2f5\ud615\uc774\uc5b4\uc11c \uc815\ubcf4 \ud48d\ubd80\ub3c4 \uce21\uc815\uc5d0 \ud55c\uacc4."),(0,n.kt)("li",{parentName:"ul"},"\u2192 \ubcf5\uc7a1\ud55c \uc5f4\ub9b0 \uc9c8\ubb38\uc744 \uc0dd\uc131\ud558\uace0, \uc694\uc57d\uc5d0\uc11c \uc0dd\uc131\ud55c \ub2f5\ubcc0\uacfc \uc6d0\ubb38\uc5d0\uc11c \uc0dd\uc131\ud55c \uc815\ub2f5\uc744 0~5\uc810\uc73c\ub85c \ube44\uad50\ud574 \uc815\ub7c9\ud654.")),(0,n.kt)("p",null,"2.Alignment \ud3c9\uac00 \uc2dc \uc6d0\ubb38\uc5d0\uc11c \uc77c\ubd80 \uc815\ubcf4\ub9cc \ucd94\ucd9c  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\uc694\uc57d\uc758 \uc9c4\uc2e4\uc131 \uac80\uc99d\uc774 \ubd88\uc644\uc804.  "),(0,n.kt)("li",{parentName:"ul"},"\u2192 \uc694\uc57d\uc758 \uc8fc\uc7a5\uacfc \uc804\uccb4 \uc6d0\ubb38\uc744 \ud568\uaed8 LLM\uc5d0 \uc81c\uacf5\ud574 \uc815\ud655\ud558\uac8c \ube44\uad50.  ")),(0,n.kt)("p",null,"3.\ucd5c\uc885 \uc810\uc218\uac00 min(alignment, coverage)  "),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\uc7ac\ud604\uc728\ub9cc \ub0ae\uc544\ub3c4 \uc810\uc218\uac00 \ub0ae\uc544\uc9d0.  "),(0,n.kt)("li",{parentName:"ul"},"\u2192 F1 score \uc0ac\uc6a9\uc73c\ub85c \uc815\ubc00\ub3c4\xb7\uc7ac\ud604\uc728 \uade0\ud615 \uc788\uac8c \ubc18\uc601.  ")),(0,n.kt)("p",null,"\ud83d\udccf \ucd94\uac00 \ud3c9\uac00 \uc9c0\ud45c  "),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},"Entity Density (\uc815\ubcf4 \ubc00\ub3c4)  ")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\uc694\uc57d \ubb38\uc7a5\ub2f9 \uace0\uc720\uba85\uc0ac \ube44\uc728 (0.15\uac00 \uc774\uc0c1\uc801)  "),(0,n.kt)("li",{parentName:"ul"},"\ub108\ubb34 \ub0ae\uc73c\uba74 \ubd80\uc2e4, \ub108\ubb34 \ub192\uc73c\uba74 \uacfc\ubc00.  ")),(0,n.kt)("ol",{start:2},(0,n.kt)("li",{parentName:"ol"},"Vagueness Score (\ubaa8\ud638\uc131)  ")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\uc694\uc57d \ubb38\uc7a5\uc744 \ubb38\uc7a5 \ub2e8\uc704\ub85c \ucabc\uac1c\uace0, \ubaa8\ud638\ud55c \ud45c\ud604 \uc5ec\ubd80 \ud3c9\uac00.")),(0,n.kt)("ol",{start:3},(0,n.kt)("li",{parentName:"ol"},"Repetitiveness Score (\ubc18\ubcf5\uc131)")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\uc694\uc57d \ub0b4 \uc911\ubcf5\ub41c \uc815\ubcf4\ub098 \uc8fc\uc7a5\uc744 LLM\uc774 \ud3c9\uac00.")),(0,n.kt)("ol",{start:4},(0,n.kt)("li",{parentName:"ol"},"Coherence Score (\ubb38\uc7a5 \ud750\ub984 \uc77c\uad00\uc131)")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\uc778\uc811\ud558\uc9c0 \uc54a\uc740 \ubb38\uc7a5 \uac04 \uc758\ubbf8 \uc720\uc0ac\ub3c4 (cosine similarity)\ub85c \ud3c9\uac00.")))}k.isMDXComponent=!0},89094:(e,t,l)=>{l.d(t,{Z:()=>a});const a=l.p+"assets/images/image-1-8bd8edef319b1c2d2f59769f74136105.png"},34248:(e,t,l)=>{l.d(t,{Z:()=>a});const a=l.p+"assets/images/image-0b4503a2291e6452d0caab74cd3283b0.png"}}]);