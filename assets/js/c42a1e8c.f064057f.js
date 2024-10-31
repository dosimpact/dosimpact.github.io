"use strict";(self.webpackChunkdosimpact_blog=self.webpackChunkdosimpact_blog||[]).push([[938],{3905:(e,o,r)=>{r.d(o,{Zo:()=>d,kt:()=>k});var t=r(67294);function n(e,o,r){return o in e?Object.defineProperty(e,o,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[o]=r,e}function c(e,o){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);o&&(t=t.filter((function(o){return Object.getOwnPropertyDescriptor(e,o).enumerable}))),r.push.apply(r,t)}return r}function s(e){for(var o=1;o<arguments.length;o++){var r=null!=arguments[o]?arguments[o]:{};o%2?c(Object(r),!0).forEach((function(o){n(e,o,r[o])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(o){Object.defineProperty(e,o,Object.getOwnPropertyDescriptor(r,o))}))}return e}function p(e,o){if(null==e)return{};var r,t,n=function(e,o){if(null==e)return{};var r,t,n={},c=Object.keys(e);for(t=0;t<c.length;t++)r=c[t],o.indexOf(r)>=0||(n[r]=e[r]);return n}(e,o);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(t=0;t<c.length;t++)r=c[t],o.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var a=t.createContext({}),l=function(e){var o=t.useContext(a),r=o;return e&&(r="function"==typeof e?e(o):s(s({},o),e)),r},d=function(e){var o=l(e.components);return t.createElement(a.Provider,{value:o},e.children)},i="mdxType",u={inlineCode:"code",wrapper:function(e){var o=e.children;return t.createElement(t.Fragment,{},o)}},m=t.forwardRef((function(e,o){var r=e.components,n=e.mdxType,c=e.originalType,a=e.parentName,d=p(e,["components","mdxType","originalType","parentName"]),i=l(r),m=n,k=i["".concat(a,".").concat(m)]||i[m]||u[m]||c;return r?t.createElement(k,s(s({ref:o},d),{},{components:r})):t.createElement(k,s({ref:o},d))}));function k(e,o){var r=arguments,n=o&&o.mdxType;if("string"==typeof e||n){var c=r.length,s=new Array(c);s[0]=m;var p={};for(var a in o)hasOwnProperty.call(o,a)&&(p[a]=o[a]);p.originalType=e,p[i]="string"==typeof e?e:n,s[1]=p;for(var l=2;l<c;l++)s[l]=r[l];return t.createElement.apply(null,s)}return t.createElement.apply(null,r)}m.displayName="MDXCreateElement"},95398:(e,o,r)=>{r.r(o),r.d(o,{assets:()=>a,contentTitle:()=>s,default:()=>u,frontMatter:()=>c,metadata:()=>p,toc:()=>l});var t=r(87462),n=(r(67294),r(3905));const c={sidebar_position:2},s="Docker Compose",p={unversionedId:"g-devops/docker/docker-basic/docker-3-compose",id:"g-devops/docker/docker-basic/docker-3-compose",title:"Docker Compose",description:"install docker compose",source:"@site/docs/g-devops/1-docker/1-docker-basic/docker-3-compose.md",sourceDirName:"g-devops/1-docker/1-docker-basic",slug:"/g-devops/docker/docker-basic/docker-3-compose",permalink:"/docs/g-devops/docker/docker-basic/docker-3-compose",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/g-devops/1-docker/1-docker-basic/docker-3-compose.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"devOps",previous:{title:"Docker File",permalink:"/docs/g-devops/docker/docker-basic/docker-2-file"},next:{title:"docker network",permalink:"/docs/g-devops/docker/docker-basic/sp002"}},a={},l=[{value:"install docker compose",id:"install-docker-compose",level:2}],d={toc:l},i="wrapper";function u(e){let{components:o,...r}=e;return(0,n.kt)(i,(0,t.Z)({},d,r,{components:o,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"docker-compose"},"Docker Compose"),(0,n.kt)("h2",{id:"install-docker-compose"},"install docker compose"),(0,n.kt)("p",null,"\uba85\ub839\uc5b4 \ubc14\ub85c \ubcf5\ubd99 :"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},'sudo curl -L "https://github.com/docker/compose/releases/download/v2.2.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose\nsudo chmod +x /usr/local/bin/docker-compose\nsudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose\ndocker-compose -v\n\n')),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\ub3c4\ucee4 \ucef4\ud3ec\uc988 \uc124\uce58 (\ubc84\uc804\uc740 \uc6d0\ud558\ub294 \ub300\ub85c \uc815\ud560 \uc218 \uc788\ub2e4)"),(0,n.kt)("li",{parentName:"ul"},"\ucd5c\uc2e0 \ubc84\uc804\uc744 \ub2e4\uc6b4 \ubc1b\uace0 \uc2f6\uc744 \uacbd\uc6b0\uc5d0\ub294 \uc544\ub798 \ub9c1\ud06c\uc5d0\uc11c \ucd5c\uc2e0 \ubc84\uc804 \ud655\uc778\n",(0,n.kt)("a",{parentName:"li",href:"https://github.com/docker/compose/releases"},"https://github.com/docker/compose/releases"))),(0,n.kt)("p",null,"$ sudo chmod +x /usr/local/bin/docker-compose"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\ub3c4\ucee4 \ucef4\ud3ec\uc988\uc5d0 \uad8c\ud55c\uc744 \uc124\uc815.")),(0,n.kt)("p",null,"$ sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\uc2ec\ubcfc\ub9ad \ub9c1\ud06c \uc124\uc815 (\uc124\uc815\uc744 \uc548\ud574\uc8fc\uba74 \uc544\ub798\uc640 \uac19\uc740 path\uc5d0\ub7ec \ubc1c\uc0dd)")),(0,n.kt)("p",null,"$ docker-compose -v"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"\uc124\uce58 \ub41c \ub3c4\ucee4\ucef4\ud3ec\uc988 \ubc84\uc804 \ud655\uc778")),(0,n.kt)("p",null,"ref : Docker Compose\uc640 \ubc84\uc804\ubcc4 \ud2b9\uc9d5 ",(0,n.kt)("a",{parentName:"p",href:"https://meetup.toast.com/posts/277"},"https://meetup.toast.com/posts/277")),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-sh"},"\n# Summary\ndocker-compose -p code-server-cluster up -d\ndocker-compose down\n\n# step-1 docker-compose.yml \uc791\uc131\ud558\uae30  \n#   - code-server 3\uac1c \uc815\ub3c4 \ub9cc\ub4e4\uc790. \n\n---\n\n# step-2 docker-compose \uc2e4\ud589\n\n# docker-compose **up** : compose\ub97c \uc2e4\ud589 \n#   -d: \uc11c\ube44\uc2a4 \ubc31\uadf8\ub77c\uc6b4\ub4dc\ub85c \uc2e4\ud589. (docker run\uc5d0\uc11c\uc758 -d\uc640 \uac19\uc74c)\n#   --force-recreate: \ucee8\ud14c\uc774\ub108\ub97c \uc9c0\uc6b0\uace0 \uc0c8\ub85c \uc0dd\uc131.\n#   --build: \uc11c\ube44\uc2a4 \uc2dc\uc791 \uc804 \uc774\ubbf8\uc9c0\ub97c \uc0c8\ub85c \uc0dd\uc131\n#   -f: \uae30\ubcf8\uc73c\ub85c \uc81c\uacf5\ud558\ub294 docker-compose.yml\uc774 \uc544\ub2cc \ubcc4\ub3c4\uc758 \ud30c\uc77c\uba85\uc744 \uc2e4\ud589\ud560 \ub54c \uc0ac\uc6a9\n\ndocker-compose -p code-server-cluster up -d\n\n---\n\n# step-3 docker-compose stop, start\n\n# stop, start :  \uc11c\ube44\uc2a4\ub97c \uba48\ucd94\uac70\ub098, \uba48\ucdb0 \uc788\ub294 \uc11c\ube44\uc2a4\ub97c \uc2dc\uc791\ud569\ub2c8\ub2e4.\ndocker-compose stop code-server-cluster\ndocker-compose start\n\n---\n\n# step-4 docker-compose down\n\n# \uc2e4\ud589 \uc911\uc778 \uc11c\ube44\uc2a4\ub97c \uc0ad\uc81c\ud569\ub2c8\ub2e4.\n# \ucee8\ud14c\uc774\ub108\uc640 \ub124\ud2b8\uc6cc\ud06c\ub97c \uc0ad\uc81c\ud558\uba70, \uc635\uc158\uc5d0 \ub530\ub77c \ubcfc\ub968\ub3c4 \uac19\uc774 \uc0ad\uc81c\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.\n\ndocker-compose down\n\n# options\n#     -v, --volume: \ubcfc\ub968\uae4c\uc9c0 \uac19\uc774 \uc0ad\uc81c\n#         DB \ub370\uc774\ud130 \ucd08\uae30\ud654\ud558\ub294\ub370 \uc6a9\uc774\ud568\n#         \ubaa8\ub4e0 \uc124\uc815\uc744 \ucd08\uae30\ud654\ud558\uace0 \uc0c8\ub85c \uc2dc\uc791\ud558\ub294 \ub370 \uc0ac\uc6a9\n\n")))}u.isMDXComponent=!0}}]);