"use strict";(self.webpackChunkdosimpact_blog=self.webpackChunkdosimpact_blog||[]).push([[1372],{3905:(e,n,t)=>{t.d(n,{Zo:()=>u,kt:()=>k});var a=t(67294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function l(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?l(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function o(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)t=l[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)t=l[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var p=a.createContext({}),s=function(e){var n=a.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},u=function(e){var n=s(e.components);return a.createElement(p.Provider,{value:n},e.children)},c="mdxType",m={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},d=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,l=e.originalType,p=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),c=s(t),d=r,k=c["".concat(p,".").concat(d)]||c[d]||m[d]||l;return t?a.createElement(k,i(i({ref:n},u),{},{components:t})):a.createElement(k,i({ref:n},u))}));function k(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var l=t.length,i=new Array(l);i[0]=d;var o={};for(var p in n)hasOwnProperty.call(n,p)&&(o[p]=n[p]);o.originalType=e,o[c]="string"==typeof e?e:r,i[1]=o;for(var s=2;s<l;s++)i[s]=t[s];return a.createElement.apply(null,i)}return a.createElement.apply(null,t)}d.displayName="MDXCreateElement"},42886:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>p,contentTitle:()=>i,default:()=>m,frontMatter:()=>l,metadata:()=>o,toc:()=>s});var a=t(87462),r=(t(67294),t(3905));const l={sidebar_position:1},i="NextJS Install",o={unversionedId:"g-fe/next/install/next001",id:"g-fe/next/install/next001",title:"NextJS Install",description:"- NextJS Install",source:"@site/docs/g-fe/5-next/1-install/next001.md",sourceDirName:"g-fe/5-next/1-install",slug:"/g-fe/next/install/next001",permalink:"/docs/g-fe/next/install/next001",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/g-fe/5-next/1-install/next001.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"frontEnd",previous:{title:"Next Install",permalink:"/docs/category/next-install"},next:{title:"NextJS Essential TS, Etc",permalink:"/docs/g-fe/next/next002-4"}},p={},s=[{value:"Goal",id:"goal",level:2},{value:"1.Nextjs \uc744 \uc2dc\uc791\ud558\ub294 \ubc29\ubc95",id:"1nextjs-\uc744-\uc2dc\uc791\ud558\ub294-\ubc29\ubc95",level:2},{value:"eg",id:"eg",level:3},{value:"2.Yarn berry\ub85c \ubcc0\uacbd\ud558\ub294 \ubc29\ubc95",id:"2yarn-berry\ub85c-\ubcc0\uacbd\ud558\ub294-\ubc29\ubc95",level:2},{value:"2.1 \ubc31\uadf8\ub77c\uc6b4\ub4dc",id:"21-\ubc31\uadf8\ub77c\uc6b4\ub4dc",level:3},{value:"2.2 yarn berry migration",id:"22-yarn-berry-migration",level:3},{value:"3.Radix UI \uc124\uce58 \ubc29\ubc95",id:"3radix-ui-\uc124\uce58-\ubc29\ubc95",level:2},{value:"More config tip",id:"more-config-tip",level:2},{value:"\ud2b9\uc815 \uacbd\ub85c\ub97c \ube4c\ub4dc\uc5d0\uc11c \ubb34\uc2dc\ud558\uae30",id:"\ud2b9\uc815-\uacbd\ub85c\ub97c-\ube4c\ub4dc\uc5d0\uc11c-\ubb34\uc2dc\ud558\uae30",level:3}],u={toc:s},c="wrapper";function m(e){let{components:n,...t}=e;return(0,r.kt)(c,(0,a.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"nextjs-install"},"NextJS Install"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#nextjs-install"},"NextJS Install"),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#goal"},"Goal")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#1nextjs-%EC%9D%84-%EC%8B%9C%EC%9E%91%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95"},"1.Nextjs \uc744 \uc2dc\uc791\ud558\ub294 \ubc29\ubc95"),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#eg"},"eg")))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#2yarn-berry%EB%A1%9C-%EB%B3%80%EA%B2%BD%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95"},"2.Yarn berry\ub85c \ubcc0\uacbd\ud558\ub294 \ubc29\ubc95"),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#21-%EB%B0%B1%EA%B7%B8%EB%9D%BC%EC%9A%B4%EB%93%9C"},"2.1 \ubc31\uadf8\ub77c\uc6b4\ub4dc")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#22-yarn-berry-migration"},"2.2 yarn berry migration")))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#3radix-ui-%EC%84%A4%EC%B9%98-%EB%B0%A9%EB%B2%95"},"3.Radix UI \uc124\uce58 \ubc29\ubc95")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#more-config-tip"},"More config tip"),(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"#%ED%8A%B9%EC%A0%95-%EA%B2%BD%EB%A1%9C%EB%A5%BC-%EB%B9%8C%EB%93%9C%EC%97%90%EC%84%9C-%EB%AC%B4%EC%8B%9C%ED%95%98%EA%B8%B0"},"\ud2b9\uc815 \uacbd\ub85c\ub97c \ube4c\ub4dc\uc5d0\uc11c \ubb34\uc2dc\ud558\uae30"))))))),(0,r.kt)("h2",{id:"goal"},"Goal"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"1.Nextjs \uc744 \uc2dc\uc791\ud558\ub294 \ubc29\ubc95    "),(0,r.kt)("li",{parentName:"ul"},"2.Yarn berry\ub85c \ubcc0\uacbd\ud558\ub294 \ubc29\ubc95  "),(0,r.kt)("li",{parentName:"ul"},"3.Radix UI \uc124\uce58 \ubc29\ubc95  ")),(0,r.kt)("h2",{id:"1nextjs-\uc744-\uc2dc\uc791\ud558\ub294-\ubc29\ubc95"},"1.Nextjs \uc744 \uc2dc\uc791\ud558\ub294 \ubc29\ubc95"),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},"docs : ",(0,r.kt)("a",{parentName:"p",href:"https://nextjs.org/docs/pages/api-reference/create-next-app"},"https://nextjs.org/docs/pages/api-reference/create-next-app"))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"# npm\nnpx create-next-app@latest  \n# yarn\nyarn create next-app  \n")),(0,r.kt)("h3",{id:"eg"},"eg"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"}," npx create-next-app@latest next-13-crash\n\u2714 Would you like to use TypeScript? \u2026 No / Yes\n\u2714 Would you like to use ESLint? \u2026 No / Yes\n\u2714 Would you like to use Tailwind CSS? \u2026 No / Yes\n\u2714 Would you like to use `src/` directory? \u2026 No / Yes\n\u2714 Would you like to use App Router? (recommended) \u2026 No / Yes\n\u2714 Would you like to customize the default import alias? \u2026 No / Yes\n\u2714 What import alias would you like configured? \u2026 @/*\nCreating a new Next.js app in /Users/dosimpact/workspace/project/lectures_web/3.Next/lectures/next-13-crash.\n")),(0,r.kt)("h2",{id:"2yarn-berry\ub85c-\ubcc0\uacbd\ud558\ub294-\ubc29\ubc95"},"2.Yarn berry\ub85c \ubcc0\uacbd\ud558\ub294 \ubc29\ubc95"),(0,r.kt)("h3",{id:"21-\ubc31\uadf8\ub77c\uc6b4\ub4dc"},"2.1 \ubc31\uadf8\ub77c\uc6b4\ub4dc"),(0,r.kt)("p",null,"\ud83d\udccc npm install yarn -g \uc744 \uc774\uc6a9\ud574\uc11c \uc124\uce58\ud558\uba74 yarn\uc740 \ucd5c\uc2e0\ubc84\uc804\uc774 \uc544\ub2c8\ub2e4.     "),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"yarn -v // 1.22.19  "),(0,r.kt)("li",{parentName:"ul"},"1.xx \ubc84\uc804\uc744 \uc720\uc9c0\ud558\ub294 \uc774\uc720\ub294 \uae30\uc874 \uc0dd\ud0dc\uacc4\uc758 \ud638\ud658\uc131\uc744 \uc704\ud574\uc11c\uc774\ub2e4.  "),(0,r.kt)("li",{parentName:"ul"},"\ucd5c\uc2e0\ubc84\uc804\uc73c\ub85c \uc5c5\ub370\uc774\ud2b8\ud558\uba74 \uc644\uc804 \ub2e4\ub978 \uc778\ud130\ud398\uc774\uc2a4\ub97c \ubcf4\uac8c\ub420 \uac83\uc774\ub2e4.  ")),(0,r.kt)("p",null,"\ud83d\udccc \ubaa8\ub4c8\uc744 \uc124\uce58\ud558\ub294 3\uac00\uc9c0 \ubc29\uc2dd   "),(0,r.kt)("p",null,"Install modes  "),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"nodeLinker: pnp : Plug'n'Play \uc774\uba70, node_modules\ub97c \uc0dd\uc131\ud558\uc9c0 \uc54a\ub294\ub2e4.  "),(0,r.kt)("li",{parentName:"ul"},"nodeLinker: pnpm : yarn\uacfc \uc720\uc0ac\ud55c \ubc29\uc2dd\uc758 \ud328\ud0a4\uc9c0 \ub9e4\ub2c8\uc800\uc758 \ubc29\uc2dd    "),(0,r.kt)("li",{parentName:"ul"},"nodeLinker: node-modules : node_modules\ub97c \ub9cc\ub4dc\ub294 \uc77c\ubc18\uc801\uc778 \ubc29\uc2dd   ")),(0,r.kt)("p",null,"\ud83d\udccc zero install",(0,r.kt)("br",{parentName:"p"}),"\n","1.yarn\uc758 pnp\ub97c \uc0ac\uc6a9\ud55c\ub2e4.",(0,r.kt)("br",{parentName:"p"}),"\n","2.pnp\ub97c git\uc73c\ub85c \ubc84\uc804\uad00\ub9ac\ud558\uc5ec, \uc758\uc874\uc131 \ubaa8\ub4c8\uc744 \uae43\ud5c8\ube0c\uc5d0 \uc62c\ub9b0\ub2e4.  "),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"\ub530\ub77c\uc11c git clone \ub9cc\uc73c\ub85c\ub3c4 \uc758\uc874\uc131 \ubaa8\ub4c8\uc774 \ub530\ub77c\uc628\ub2e4.   ")),(0,r.kt)("p",null,"\ud83d\udccc yarn v4 \uc744 \uc0ac\uc6a9\ud558\uba74 \uc88b\uc740 \uc810  "),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"\uc0c8\ub85c\uc6b4 \uae30\ub2a5 : workspace, zero install  "),(0,r.kt)("li",{parentName:"ul"},"\ubaa8\ub4c8 \uc124\uce58 \ubc29\uc2dd 3\uac00\uc9c0 \uc9c0\uc6d0, \ucee4\uc2a4\ud130\ub9c8\uc774\uc9d5 \ud50c\ub7ec\uadf8\uc778")),(0,r.kt)("h3",{id:"22-yarn-berry-migration"},"2.2 yarn berry migration"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"yarn create next-app \uc744 \ud1b5\ud574 \uc0dd\uc131\ud55c \ud504\ub85c\uc81d\ud2b8\uc774\ub2e4.  "),(0,r.kt)("li",{parentName:"ul"},"yarn berry\ub85c \ub9c8\uc774\uadf8\ub808\uc774\uc158 \ud574\ubcf4\uc790.  ")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},'# \ucd5c\uc2e0\ubc84\uc804\uc758 yarn(berry) \uc0ac\uc6a9 \uc124\uc815\nyarn set version stable\n\n# \ubc84\uc804 \ud655\uc778 - 4.0.2\nyarn -v\n\n# \ud328\ud0a4\uc9c0 \uc124\uce58\nyarn\n# package.json\uc5d0  "packageManager": "yarn@4.0.2" \uac00 \ucd94\uac00\ub41c\ub2e4.\n# .yarnrc.yml \ud30c\uc77c\uc774 \ucd94\uac00\ub418\uba70, nodeLinker: node-modules \uac00 \uae30\ubcf8\uc124\uc815\uc774\ub2e4. \n\n# \uac1c\ubc1c\ubaa8\ub4dc\ub85c \ub744\uc6cc\ubcf4\uae30\nyarn dev\n\n---\n# .gitignore \uc5d0 \ucd94\uac00\n.yarn/*\n!.yarn/cache\n!.yarn/patches\n!.yarn/plugins\n!.yarn/releases\n!.yarn/sdks\n!.yarn/versions\n\n---\n# Plug\'n\'Play \uc804\ud658\n# .yarnrc.yml \ud30c\uc77c\uc5d0\uc11c, nodeLinker: pnp\ub85c \ubcc0\uacbd\n# \ud328\ud0a4\uc9c0 \ub2e4\uc2dc\uc124\uce58\nyarn\n\n# \uac1c\ubc1c\ubaa8\ub4dc\ub85c \ub744\uc6cc\ubcf4\uae30\nyarn dev\n')),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Release: Yarn 4.0 \ud83e\ude84\u2697\ufe0f ",(0,r.kt)("a",{parentName:"li",href:"https://yarnpkg.com/blog/release/4.0"},"https://yarnpkg.com/blog/release/4.0")),(0,r.kt)("li",{parentName:"ul"},"\ud83d\ude80 next.js \ub97c yarn berry\uc640 typescript\ub85c \uc2dc\uc791\ud574\ubc84\ub9ac\uae30 : ",(0,r.kt)("a",{parentName:"li",href:"https://velog.io/@creco/next.js-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0"},"https://velog.io/@creco/next.js-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0"),"   ")),(0,r.kt)("h2",{id:"3radix-ui-\uc124\uce58-\ubc29\ubc95"},"3.Radix UI \uc124\uce58 \ubc29\ubc95"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"\n// Install and configure Next.js. https://ui.shadcn.com/docs/installation/next\nnpx shadcn@latest init\nnpx shadcn@latest add button\n\n// Dark mode. https://ui.shadcn.com/docs/dark-mode/next\nyarn add next-themes\n\n// theme provider \ucef4\ud3ec\ub10c\ud2b8 \ucf54\ub4dc \ub123\uae30  \n// \ub2e4\ud06c \ubaa8\ub4dc \ud1a0\uae00 \ucef4\ud3ec\ub10c\ud2b8 \ub123\uae30  \n\n")),(0,r.kt)("h2",{id:"more-config-tip"},"More config tip"),(0,r.kt)("h3",{id:"\ud2b9\uc815-\uacbd\ub85c\ub97c-\ube4c\ub4dc\uc5d0\uc11c-\ubb34\uc2dc\ud558\uae30"},"\ud2b9\uc815 \uacbd\ub85c\ub97c \ube4c\ub4dc\uc5d0\uc11c \ubb34\uc2dc\ud558\uae30"),(0,r.kt)("p",null,"\ub9cc\uc57d\uc5d0 supabase \uc11c\ube0c\ub514\ub809\ud130\ub9ac\uac00 \uc788\uace0, \uc774\ub294 nextjs\uc640 \ubb34\uad00\ud558\ub2e4\uba74 \uc774\ub97c \ube4c\ub4dc \uc2f8\uc774\ud074\uc5d0\uc11c \uc81c\uc678\ud574\uc57c \ud55c\ub2e4.  "),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"tsconfig, next build \ubaa8\ub450 \uc124\uc815\ud574\uc57c \ud55c\ub2e4.  "),(0,r.kt)("li",{parentName:"ul"},"\ubaa8\ub178\ub798\ud3ec\ub85c \ub9cc\ub4e4\uc5b4\ub3c4 \uc88b\uc744\uac83 \uac19\ub2e4.  ")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'#\nyarn add ignore-loader\n\n# tsconfig.json\n  "exclude": ["node_modules","supabase"]\n\n# next.config.js\n/** @type {import(\'next\').NextConfig} */\nconst nextConfig = {\n  webpack: (config, { isServer }) => {\n    config.module.rules.push({\n      test: /$\\/supabase\\/.*/, // \'supabase\' \ud3f4\ub354 \ubc0f \ud558\uc704 \uacbd\ub85c\ub97c \ubb34\uc2dc\ud558\ub3c4\ub85d \uc815\uaddc\uc2dd \uc9c0\uc815\n      use: "ignore-loader",\n    });\n    return config;\n  },\n};\n\nexport default nextConfig;\n')),(0,r.kt)("p",null,"\uc8fc\uc758 "),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"test: /supabase\\/.*/,"),"  -> @supabase/ssr \uacfc \uac19\uc740 \ubaa8\ub4c8\uc758 \uacbd\ub85c\ub3c4 \ubb34\uc2dc\ud558\ub294 \ud328\ud134\uc774\ub2e4.  "),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"test: /^\\/supabase\\/.*/,")," -> ignore-loader\uac00 supabase\ub77c\ub294  \uacbd\ub85c\ub85c \uc2dc\uc791\ud558\ub294 \ubaa8\ub4c8\uc758 \uacbd\uc6b0\ub97c \ubb34\uc2dc\ud55c\ub2e4.  ",(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"\ub2e4\ud589\uc774\ub3c4 @supabase\ub77c\ub294 \ub124\uc784\uc2a4\ud398\uc774\uc2a4 \ub54c\ubb38\uc5d0 \uc758\uc874\uc131\uc744 \uc0ac\uc6a9\ud560 \uc218 \uc788\ub2e4.")))))}m.isMDXComponent=!0}}]);