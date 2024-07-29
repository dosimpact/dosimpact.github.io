---
sidebar_position: 2
---

# Typescript Lib Publish Guide  

Goal : 타입스크립트 기반의 라이브러리를 배포합니다.      


- [Typescript Lib Publish Guide](#typescript-lib-publish-guide)
  - [Background](#background)
  - [Inint](#inint)
  - [package.json](#packagejson)
  - [tsconfig.json, tsconfig.esm.json](#tsconfigjson-tsconfigesmjson)
  - [.npmignore](#npmignore)
  - [src](#src)
  - [Prettier \& eslint 설정](#prettier--eslint-설정)
    - [Prettier 설정](#prettier-설정)
    - [ESLint 설정](#eslint-설정)
    - [Prettier와 ESLint 통합](#prettier와-eslint-통합)
    - [ESLint 세부 규칙 조정하기](#eslint-세부-규칙-조정하기)
    - [모든 규칙](#모든-규칙)


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

## Prettier & eslint 설정  

### Prettier 설정  

Prettier는 코드 포맷터로, 코드를 일관된 스타일로 자동으로 정리해줍니다.   
- Install VS Code Prettier Extension  

```bash
# 0.설치
yarn add prettier -D

# 1.설정 파일을 루트에 추가
# .prettierrc
{
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "avoid"
}

---
# 2.포멧팅 제외 파일(선택사항)
# .prettierignore
node_modules
dist
tsconfig.json
tsconfig.esm.json

---
# 3.package.json 스크립트 추가
"prettier": "prettier --write ./src"
```

### ESLint 설정  

ESLint는 JavaScript 코드의 문제를 찾아내고 스타일을 강제하는 도구입니다.  
- Install VS Code Eslint Extension and restart VS Code

```bash
# 1. ESLint 설치
yarn add eslint -D


# 2. ESLint 초기화
# ESLint를 초기화하여 기본 설정 파일을 생성합니다. 다음 명령어를 실행하세요:
npx eslint --init
# eslint, globals, @eslint/js, typescript-eslint 가 추가됨
# eslint.config.mjs 설정파일이 생성됨.

# 3. ESLint 실행 스크립트 추가
  "scripts": {
    "lint": "eslint --fix ./src"
  },

```

### Prettier와 ESLint 통합

- Prettier와 ESLint를 함께 사용하면 코드 스타일과 코드 품질을 동시에 유지할 수 있습니다. 
- 이를 위해 `eslint-config-prettier`와 `eslint-plugin-prettier` 패키지를 설치합니다:   
- **eslint-config-prettier**를 사용하여 충돌하는 ESLint 규칙을 비활성화하고 Prettier가 형식 지정을 처리하도록 합니다.
- **eslint-plugin-prettier**를 사용하여 Prettier를 ESLint 규칙으로 실행하고 형식 지정 문제를 ESLint 출력 내에서 보고합니다.
- 두 가지를 결합하여 Prettier가 형식 지정을 처리하고 ESLint가 코드 품질에 집중할 수 있도록 하여 충돌 없이 원활한 통합을 보장합니다.


```js
yarn add eslint-config-prettier eslint-plugin-prettier -D

---
# 그리고 `.eslintrc.json` 파일을 다음과 같이 수정합니다:

import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  { files: ['**/*.js'], languageOptions: { sourceType: 'script' } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,               // 추가
  eslintPluginPrettierRecommended,   // 추가
];

```

### ESLint 세부 규칙 조정하기    

- 규칙설정배열은 후속 구성 객체가 앞서 정의된 설정을 덮어쓸 수 있다.  

예) let 선언 후 변수에 재할당이 없다면 오류 발생, 이는 autofix 가능.  

```js
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  { files: ['**/*.js'], languageOptions: { sourceType: 'script' } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    rules: {
      'prefer-const': ['error', { ignoreReadBeforeAssign: true }],
    },
  },
];

```

### 모든 규칙  
https://eslint.org/docs/latest/rules/    
