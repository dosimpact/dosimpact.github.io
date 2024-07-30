"use strict";(self.webpackChunkdosimpact_blog=self.webpackChunkdosimpact_blog||[]).push([[4281],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>f});var r=n(67294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var o=r.createContext({}),p=function(e){var t=r.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},c=function(e){var t=p(e.components);return r.createElement(o.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,l=e.originalType,o=e.parentName,c=a(e,["components","mdxType","originalType","parentName"]),u=p(n),d=i,f=u["".concat(o,".").concat(d)]||u[d]||m[d]||l;return n?r.createElement(f,s(s({ref:t},c),{},{components:n})):r.createElement(f,s({ref:t},c))}));function f(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var l=n.length,s=new Array(l);s[0]=d;var a={};for(var o in t)hasOwnProperty.call(t,o)&&(a[o]=t[o]);a.originalType=e,a[u]="string"==typeof e?e:i,s[1]=a;for(var p=2;p<l;p++)s[p]=n[p];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},58527:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>o,contentTitle:()=>s,default:()=>m,frontMatter:()=>l,metadata:()=>a,toc:()=>p});var r=n(87462),i=(n(67294),n(3905));const l={sidebar_position:2},s="Typescript Lib Publish Guide",a={unversionedId:"g-fe/ts/complier/tsc02",id:"g-fe/ts/complier/tsc02",title:"Typescript Lib Publish Guide",description:"Goal : \ud0c0\uc785\uc2a4\ud06c\ub9bd\ud2b8 \uae30\ubc18\uc758 \ub77c\uc774\ube0c\ub7ec\ub9ac\ub97c \ubc30\ud3ec\ud569\ub2c8\ub2e4.",source:"@site/docs/g-fe/2-ts/1-complier/tsc02.md",sourceDirName:"g-fe/2-ts/1-complier",slug:"/g-fe/ts/complier/tsc02",permalink:"/docs/g-fe/ts/complier/tsc02",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/g-fe/2-ts/1-complier/tsc02.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"frontEnd",previous:{title:"tsconfig.json",permalink:"/docs/g-fe/ts/complier/tsc01"},next:{title:"Typescript 1",permalink:"/docs/g-fe/ts/ts01"}},o={},p=[{value:"Background",id:"background",level:2},{value:"Inint",id:"inint",level:2},{value:"package.json",id:"packagejson",level:2},{value:"tsconfig.json, tsconfig.esm.json",id:"tsconfigjson-tsconfigesmjson",level:2},{value:".npmignore",id:"npmignore",level:2},{value:"src",id:"src",level:2},{value:"Prettier &amp; eslint \uc124\uc815",id:"prettier--eslint-\uc124\uc815",level:2},{value:"Prettier \uc124\uc815",id:"prettier-\uc124\uc815",level:3},{value:"ESLint \uc124\uc815",id:"eslint-\uc124\uc815",level:3},{value:"Prettier\uc640 ESLint \ud1b5\ud569",id:"prettier\uc640-eslint-\ud1b5\ud569",level:3},{value:"ESLint \uc138\ubd80 \uaddc\uce59 \uc870\uc815\ud558\uae30",id:"eslint-\uc138\ubd80-\uaddc\uce59-\uc870\uc815\ud558\uae30",level:3},{value:"\ubaa8\ub4e0 \uaddc\uce59",id:"\ubaa8\ub4e0-\uaddc\uce59",level:3}],c={toc:p},u="wrapper";function m(e){let{components:t,...n}=e;return(0,i.kt)(u,(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"typescript-lib-publish-guide"},"Typescript Lib Publish Guide"),(0,i.kt)("p",null,"Goal : \ud0c0\uc785\uc2a4\ud06c\ub9bd\ud2b8 \uae30\ubc18\uc758 \ub77c\uc774\ube0c\ub7ec\ub9ac\ub97c \ubc30\ud3ec\ud569\ub2c8\ub2e4.      "),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#typescript-lib-publish-guide"},"Typescript Lib Publish Guide"),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#background"},"Background")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#inint"},"Inint")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#packagejson"},"package.json")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#tsconfigjson-tsconfigesmjson"},"tsconfig.json, tsconfig.esm.json")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#npmignore"},".npmignore")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#src"},"src")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#prettier--eslint-%EC%84%A4%EC%A0%95"},"Prettier \\& eslint \uc124\uc815"),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#prettier-%EC%84%A4%EC%A0%95"},"Prettier \uc124\uc815")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#eslint-%EC%84%A4%EC%A0%95"},"ESLint \uc124\uc815")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#prettier%EC%99%80-eslint-%ED%86%B5%ED%95%A9"},"Prettier\uc640 ESLint \ud1b5\ud569")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#eslint-%EC%84%B8%EB%B6%80-%EA%B7%9C%EC%B9%99-%EC%A1%B0%EC%A0%95%ED%95%98%EA%B8%B0"},"ESLint \uc138\ubd80 \uaddc\uce59 \uc870\uc815\ud558\uae30")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#%EB%AA%A8%EB%93%A0-%EA%B7%9C%EC%B9%99"},"\ubaa8\ub4e0 \uaddc\uce59"))))))),(0,i.kt)("h2",{id:"background"},"Background"),(0,i.kt)("p",null,"error \uac1d\uccb4\ub294 typescript\uc5d0\uc11c unknown\uc73c\ub85c \ucc98\ub9ac\ub41c\ub2e4.  "),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\ud0c0\uc785 \uac00\ub4dc\ub97c \ud1b5\ud574\uc11c \ud2b9\uc815 \ud0c0\uc785\uc73c\ub85c \uc881\ud600\uc57c \ud55c\ub2e4.    "),(0,i.kt)("li",{parentName:"ul"},"\ud0c0\uc785\uac00\ub4dc \ud568\uc218\ub97c \ud1b5\ud574\uc11c, \ud2b9\uc815 \ud0c0\uc785\uc5d0 \ub300\ud55c \ud544\ub4dc\uac80\uc0ac \ub4f1\uc744 \ub9c8\uce58\uba74 'asserts e is AxiosError' \uac19\uc740 syntax\ub97c \ud1b5\ud574\uc11c Type\uc744 \uba85\uc2dc\ud55c\ub2e4.   ")),(0,i.kt)("h2",{id:"inint"},"Inint"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"yarn init -y\nyarn add axios  \nyarn add typescript -D  \nnpx tsc --init  \n")),(0,i.kt)("h2",{id:"packagejson"},"package.json"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "name": "@dosimpact/axios-error",\n  "version": "1.0.0",\n  "license": "MIT",\n  "scripts": {\n    "build": "rm -rf dist && tsc -p tsconfig.json && tsc -p tsconfig.esm.json",\n    "deploy": "yarn build && yarn publish --access=public"\n  },\n  "devDependencies": {\n    "typescript": "^5.5.3"\n  },\n  "dependencies": {\n    "axios": "^1.7.2"\n  },\n  "private": false,\n  "types": "dist/index.d.ts",\n  "main": "dist/index.js",\n  "module": "dist/esm"\n}\n')),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\ud328\ud0a4\uc9c0 \uc774\ub984\uc5d0\ub294 @\uc744 \uc774\uc6a9\ud574\uc11c \ud328\ud0a4\uc9c0\uc5d0 \ub300\ud55c \ub124\uc784\uc2a4\ud398\uc774\uc2a4\ub97c \uac78\uc5b4\uc90d\ub2c8\ub2e4.  "),(0,i.kt)("li",{parentName:"ul"},"\ud328\ud0a4\uc9c0 \ubc84\uc804\uc740 \uc911\uc694\ud569\ub2c8\ub2e4. \uba54\uc774\uc800, \ub9c8\uc774\ub108, \ud328\uce58 \ubc84\uc804\uc5d0 \ub530\ub978 \ubc30\ud3ec\ub97c \ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.  "),(0,i.kt)("li",{parentName:"ul"},"scripts\ubd80\ubd84\uc5d0\uc11c\ub294 \ube4c\ub4dc\ub294 cjs, esm \ubaa8\ub4c8 \ubaa8\ub450 emit \ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.  "),(0,i.kt)("li",{parentName:"ul"},"deploy\ub294 npm registry\ub85c \ubc30\ud3ec\ud558\uba70 access=public \uc635\uc158\uc744 \ud1b5\ud574\uc11c \uacf5\uac1c \uc800\uc7a5\uc18c\uc5d0 \ubc30\ud3ec\ud569\ub2c8\ub2e4.  "),(0,i.kt)("li",{parentName:"ul"},"private \uc124\uc815\uc744 false\ub85c \ubcc0\uacbd\ud574\uc11c \ubc30\ud3ec\ud569\ub2c8\ub2e4.  "),(0,i.kt)("li",{parentName:"ul"},"types \ud544\ub4dc\ub294 \ud0c0\uc785\uc815\uc758 \ud30c\uc77c \uacbd\ub85c\ub97c \uc9c0\uc815\ud569\ub2c8\ub2e4.  "),(0,i.kt)("li",{parentName:"ul"},"main \ud544\ub4dc\ub294 cjs entry point \uc785\ub2c8\ub2e4.  "),(0,i.kt)("li",{parentName:"ul"},"module \ud544\ub4dc\ub294 esm entry point \uc785\ub2c8\ub2e4.  ")),(0,i.kt)("h2",{id:"tsconfigjson-tsconfigesmjson"},"tsconfig.json, tsconfig.esm.json"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "include": ["src"],\n  "exclude": ["**/__test___/**"],\n  "compilerOptions": {\n    "target": "es6",                                  /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */\n    "lib": ["DOM","DOM.Iterable","ESNext"],         /* Specify a set of bundled library declaration files that describe the target runtime environment. */\n    "jsx": "react",                                /* Specify what JSX code is generated. */\n    "experimentalDecorators": true,                   /* Enable experimental support for legacy experimental decorators. */\n    "module": "commonjs",                                /* Specify what module code is generated. */\n    "moduleResolution": "nodenext",                          /* Specify how TypeScript looks up a file from a given module specifier. */\n    "baseUrl": "./",                                  /* Specify the base directory to resolve non-relative module names. */\n    "allowJs": true,                                  /* Allow JavaScript files to be a part of your program. Use the \'checkJS\' option to get errors from these files. */\n    "declaration": true,                              /* Generate .d.ts files from TypeScript and JavaScript files in your project. */\n    "sourceMap": false,                                /* Create source map files for emitted JavaScript files. */\n    "outDir": "./dist",                                   /* Specify an output folder for all emitted files. */\n    "noEmit": false,                                   /* Disable emitting files from a compilation. */\n    "esModuleInterop": true,                           /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables \'allowSyntheticDefaultImports\' for type compatibility. */\n    "forceConsistentCasingInFileNames": true,            /* Ensure that casing is correct in imports. */\n    "strict": true,                                      /* Enable all strict type-checking options. */\n    "noImplicitAny": true,                               /* Enable error reporting for expressions and declarations with an implied \'any\' type. */\n    "noUnusedLocals": true,                             /* Enable error reporting when local variables aren\'t read. */\n    "skipLibCheck": true                                 /* Skip type checking all .d.ts files. */\n  }\n}\n\n---\n{\n  "extends":"./tsconfig.json",\n  "include": ["src"],\n  "exclude": ["**/__test___/**"],\n  "compilerOptions": {\n    "outDir": "./dist/esm",\n    "module": "ESNext"                 /* Skip type checking all .d.ts files. */\n  }\n}\n')),(0,i.kt)("h2",{id:"npmignore"},".npmignore"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"src\n")),(0,i.kt)("h2",{id:"src"},"src"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},'// src/index.ts\nexport * from "./assertAxiosError";\n---\n// src/assertAxiosError\nimport type { AxiosError } from "axios";\n\nexport function assertAxiosError(e: unknown): asserts e is AxiosError {\n  if (typeof e === "object" && e != null && "isAxiosError" in e) {\n    return;\n  }\n  throw e;\n}\n\n')),(0,i.kt)("h2",{id:"prettier--eslint-\uc124\uc815"},"Prettier & eslint \uc124\uc815"),(0,i.kt)("h3",{id:"prettier-\uc124\uc815"},"Prettier \uc124\uc815"),(0,i.kt)("p",null,"Prettier\ub294 \ucf54\ub4dc \ud3ec\ub9f7\ud130\ub85c, \ucf54\ub4dc\ub97c \uc77c\uad00\ub41c \uc2a4\ud0c0\uc77c\ub85c \uc790\ub3d9\uc73c\ub85c \uc815\ub9ac\ud574\uc90d\ub2c8\ub2e4.   "),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Install VS Code Prettier Extension  ")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},'# 0.\uc124\uce58\nyarn add prettier -D\n\n# 1.\uc124\uc815 \ud30c\uc77c\uc744 \ub8e8\ud2b8\uc5d0 \ucd94\uac00\n# .prettierrc\n{\n  "printWidth": 80,\n  "tabWidth": 2,\n  "useTabs": false,\n  "semi": true,\n  "singleQuote": true,\n  "trailingComma": "es5",\n  "bracketSpacing": true,\n  "arrowParens": "avoid"\n}\n\n---\n# 2.\ud3ec\uba67\ud305 \uc81c\uc678 \ud30c\uc77c(\uc120\ud0dd\uc0ac\ud56d)\n# .prettierignore\nnode_modules\ndist\ntsconfig.json\ntsconfig.esm.json\n\n---\n# 3.package.json \uc2a4\ud06c\ub9bd\ud2b8 \ucd94\uac00\n"prettier": "prettier --write ./src"\n')),(0,i.kt)("h3",{id:"eslint-\uc124\uc815"},"ESLint \uc124\uc815"),(0,i.kt)("p",null,"ESLint\ub294 JavaScript \ucf54\ub4dc\uc758 \ubb38\uc81c\ub97c \ucc3e\uc544\ub0b4\uace0 \uc2a4\ud0c0\uc77c\uc744 \uac15\uc81c\ud558\ub294 \ub3c4\uad6c\uc785\ub2c8\ub2e4.  "),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Install VS Code Eslint Extension and restart VS Code")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},'# 1. ESLint \uc124\uce58\nyarn add eslint -D\n\n\n# 2. ESLint \ucd08\uae30\ud654\n# ESLint\ub97c \ucd08\uae30\ud654\ud558\uc5ec \uae30\ubcf8 \uc124\uc815 \ud30c\uc77c\uc744 \uc0dd\uc131\ud569\ub2c8\ub2e4. \ub2e4\uc74c \uba85\ub839\uc5b4\ub97c \uc2e4\ud589\ud558\uc138\uc694:\nnpx eslint --init\n# eslint, globals, @eslint/js, typescript-eslint \uac00 \ucd94\uac00\ub428\n# eslint.config.mjs \uc124\uc815\ud30c\uc77c\uc774 \uc0dd\uc131\ub428.\n\n# 3. ESLint \uc2e4\ud589 \uc2a4\ud06c\ub9bd\ud2b8 \ucd94\uac00\n  "scripts": {\n    "lint": "eslint --fix ./src"\n  },\n\n')),(0,i.kt)("h3",{id:"prettier\uc640-eslint-\ud1b5\ud569"},"Prettier\uc640 ESLint \ud1b5\ud569"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Prettier\uc640 ESLint\ub97c \ud568\uaed8 \uc0ac\uc6a9\ud558\uba74 \ucf54\ub4dc \uc2a4\ud0c0\uc77c\uacfc \ucf54\ub4dc \ud488\uc9c8\uc744 \ub3d9\uc2dc\uc5d0 \uc720\uc9c0\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4. "),(0,i.kt)("li",{parentName:"ul"},"\uc774\ub97c \uc704\ud574 ",(0,i.kt)("inlineCode",{parentName:"li"},"eslint-config-prettier"),"\uc640 ",(0,i.kt)("inlineCode",{parentName:"li"},"eslint-plugin-prettier")," \ud328\ud0a4\uc9c0\ub97c \uc124\uce58\ud569\ub2c8\ub2e4:   "),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"eslint-config-prettier"),"\ub97c \uc0ac\uc6a9\ud558\uc5ec \ucda9\ub3cc\ud558\ub294 ESLint \uaddc\uce59\uc744 \ube44\ud65c\uc131\ud654\ud558\uace0 Prettier\uac00 \ud615\uc2dd \uc9c0\uc815\uc744 \ucc98\ub9ac\ud558\ub3c4\ub85d \ud569\ub2c8\ub2e4."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"eslint-plugin-prettier"),"\ub97c \uc0ac\uc6a9\ud558\uc5ec Prettier\ub97c ESLint \uaddc\uce59\uc73c\ub85c \uc2e4\ud589\ud558\uace0 \ud615\uc2dd \uc9c0\uc815 \ubb38\uc81c\ub97c ESLint \ucd9c\ub825 \ub0b4\uc5d0\uc11c \ubcf4\uace0\ud569\ub2c8\ub2e4."),(0,i.kt)("li",{parentName:"ul"},"\ub450 \uac00\uc9c0\ub97c \uacb0\ud569\ud558\uc5ec Prettier\uac00 \ud615\uc2dd \uc9c0\uc815\uc744 \ucc98\ub9ac\ud558\uace0 ESLint\uac00 \ucf54\ub4dc \ud488\uc9c8\uc5d0 \uc9d1\uc911\ud560 \uc218 \uc788\ub3c4\ub85d \ud558\uc5ec \ucda9\ub3cc \uc5c6\uc774 \uc6d0\ud65c\ud55c \ud1b5\ud569\uc744 \ubcf4\uc7a5\ud569\ub2c8\ub2e4.")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"yarn add eslint-config-prettier eslint-plugin-prettier -D\n\n---\n# \uadf8\ub9ac\uace0 `.eslintrc.json` \ud30c\uc77c\uc744 \ub2e4\uc74c\uacfc \uac19\uc774 \uc218\uc815\ud569\ub2c8\ub2e4:\n\nimport globals from 'globals';\nimport pluginJs from '@eslint/js';\nimport tseslint from 'typescript-eslint';\nimport eslintConfigPrettier from 'eslint-config-prettier';\nimport eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';\n\nexport default [\n  { files: ['**/*.js'], languageOptions: { sourceType: 'script' } },\n  { languageOptions: { globals: globals.browser } },\n  pluginJs.configs.recommended,\n  ...tseslint.configs.recommended,\n  eslintConfigPrettier,               // \ucd94\uac00\n  eslintPluginPrettierRecommended,   // \ucd94\uac00\n];\n\n")),(0,i.kt)("h3",{id:"eslint-\uc138\ubd80-\uaddc\uce59-\uc870\uc815\ud558\uae30"},"ESLint \uc138\ubd80 \uaddc\uce59 \uc870\uc815\ud558\uae30"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\uaddc\uce59\uc124\uc815\ubc30\uc5f4\uc740 \ud6c4\uc18d \uad6c\uc131 \uac1d\uccb4\uac00 \uc55e\uc11c \uc815\uc758\ub41c \uc124\uc815\uc744 \ub36e\uc5b4\uc4f8 \uc218 \uc788\ub2e4.  ")),(0,i.kt)("p",null,"\uc608) let \uc120\uc5b8 \ud6c4 \ubcc0\uc218\uc5d0 \uc7ac\ud560\ub2f9\uc774 \uc5c6\ub2e4\uba74 \uc624\ub958 \ubc1c\uc0dd, \uc774\ub294 autofix \uac00\ub2a5.  "),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"import globals from 'globals';\nimport pluginJs from '@eslint/js';\nimport tseslint from 'typescript-eslint';\nimport eslintConfigPrettier from 'eslint-config-prettier';\nimport eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';\n\nexport default [\n  { files: ['**/*.js'], languageOptions: { sourceType: 'script' } },\n  { languageOptions: { globals: globals.browser } },\n  pluginJs.configs.recommended,\n  ...tseslint.configs.recommended,\n  eslintConfigPrettier,\n  eslintPluginPrettierRecommended,\n  {\n    files: ['**/*.{js,mjs,cjs,ts}'],\n    rules: {\n      'prefer-const': ['error', { ignoreReadBeforeAssign: true }],\n    },\n  },\n];\n\n")),(0,i.kt)("h3",{id:"\ubaa8\ub4e0-\uaddc\uce59"},"\ubaa8\ub4e0 \uaddc\uce59"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://eslint.org/docs/latest/rules/"},"https://eslint.org/docs/latest/rules/")))}m.isMDXComponent=!0}}]);