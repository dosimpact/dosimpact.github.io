---
sidebar_position: 2
---

# Typescript Lib Publish Guide  

Goal : 타입스크립트 기반의 라이브러리를 배포합니다.      

## Background  

error 객체는 typescript에서 unknown으로 처리된다.  
- 타입 가드를 통해서 특정 타입으로 좁혀야 한다.    
- 타입가드 함수를 통해서, 특정 타입에 대한 필드검사 등을 마치면 'asserts e is AxiosError' 같은 syntax를 통해서 Type을 명시한다.   

## Inint

```
yarn init -y
yarn add axios  
yarn add typescript -D  
npx tsc --init  
```

## package.json  

```json
{
  "name": "@dosimpact/axios-error",
  "version": "1.0.0",
  "license": "MIT",
  "scripts": {
    "build": "rm -rf dist && tsc -p tsconfig.json && tsc -p tsconfig.esm.json",
    "deploy": "yarn build && yarn publish --access=public"
  },
  "devDependencies": {
    "typescript": "^5.5.3"
  },
  "dependencies": {
    "axios": "^1.7.2"
  },
  "private": false,
  "types": "dist/index.d.ts",
  "main": "dist/index.js",
  "module": "dist/esm"
}
```

- 패키지 이름에는 @을 이용해서 패키지에 대한 네임스페이스를 걸어줍니다.  
- 패키지 버전은 중요합니다. 메이저, 마이너, 패치 버전에 따른 배포를 할 수 있습니다.  
- scripts부분에서는 빌드는 cjs, esm 모듈 모두 emit 할 수 있습니다.  
- deploy는 npm registry로 배포하며 access=public 옵션을 통해서 공개 저장소에 배포합니다.  
- private 설정을 false로 변경해서 배포합니다.  
- types 필드는 타입정의 파일 경로를 지정합니다.  
- main 필드는 cjs entry point 입니다.  
- module 필드는 esm entry point 입니다.  

## tsconfig.json, tsconfig.esm.json

```json
{
  "include": ["src"],
  "exclude": ["**/__test___/**"],
  "compilerOptions": {
    "target": "es6",                                  /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
    "lib": ["DOM","DOM.Iterable","ESNext"],         /* Specify a set of bundled library declaration files that describe the target runtime environment. */
    "jsx": "react",                                /* Specify what JSX code is generated. */
    "experimentalDecorators": true,                   /* Enable experimental support for legacy experimental decorators. */
    "module": "commonjs",                                /* Specify what module code is generated. */
    "moduleResolution": "nodenext",                          /* Specify how TypeScript looks up a file from a given module specifier. */
    "baseUrl": "./",                                  /* Specify the base directory to resolve non-relative module names. */
    "allowJs": true,                                  /* Allow JavaScript files to be a part of your program. Use the 'checkJS' option to get errors from these files. */
    "declaration": true,                              /* Generate .d.ts files from TypeScript and JavaScript files in your project. */
    "sourceMap": false,                                /* Create source map files for emitted JavaScript files. */
    "outDir": "./dist",                                   /* Specify an output folder for all emitted files. */
    "noEmit": false,                                   /* Disable emitting files from a compilation. */
    "esModuleInterop": true,                           /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */
    "forceConsistentCasingInFileNames": true,            /* Ensure that casing is correct in imports. */
    "strict": true,                                      /* Enable all strict type-checking options. */
    "noImplicitAny": true,                               /* Enable error reporting for expressions and declarations with an implied 'any' type. */
    "noUnusedLocals": true,                             /* Enable error reporting when local variables aren't read. */
    "skipLibCheck": true                                 /* Skip type checking all .d.ts files. */
  }
}

---
{
  "extends":"./tsconfig.json",
  "include": ["src"],
  "exclude": ["**/__test___/**"],
  "compilerOptions": {
    "outDir": "./dist/esm",
    "module": "ESNext"                 /* Skip type checking all .d.ts files. */
  }
}
```

## .npmignore

```
src
```

## src

```ts
// src/index.ts
export * from "./assertAxiosError";
---
// src/assertAxiosError
import type { AxiosError } from "axios";

export function assertAxiosError(e: unknown): asserts e is AxiosError {
  if (typeof e === "object" && e != null && "isAxiosError" in e) {
    return;
  }
  throw e;
}

```