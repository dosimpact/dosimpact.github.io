---
sidebar_position: 1
---

# tsconfig.json   

- [tsconfig.json](#tsconfigjson)
  - [Install](#install)
  - [tsconfig.json](#tsconfigjson-1)
    - [주요 옵션](#주요-옵션)
    - [모든 옵션](#모든-옵션)
  - [CommonJS vs ESM](#commonjs-vs-esm)
      - [CommonJS](#commonjs)
      - [ESNext (ES Modules)](#esnext-es-modules)
      - [종합 비교](#종합-비교)
  - [module, moduleResolution](#module-moduleresolution)
      - [`module`](#module)
      - [`moduleResolution`](#moduleresolution)
      - [예시](#예시)
  - [esModuleInterop(true), allowSyntheticDefaultImports(true)](#esmoduleinteroptrue-allowsyntheticdefaultimportstrue)
      - [기본 설정(`esModuleInterop: false`)에서의 문제점](#기본-설정esmoduleinterop-false에서의-문제점)
    - [`esModuleInterop`를 켰을 때의 동작 (`esModuleInterop: true`)](#esmoduleinterop를-켰을-때의-동작-esmoduleinterop-true)
  - [절대경로설정](#절대경로설정)
    - [1. `tsconfig.json` 파일 설정](#1-tsconfigjson-파일-설정)
    - [예시](#예시-1)
    - [2. 모듈 가져오기](#2-모듈-가져오기)
    - [3. Jest 설정 (선택 사항)](#3-jest-설정-선택-사항)
    - [4. ESLint 설정 (선택 사항)](#4-eslint-설정-선택-사항)


## Install  

```
npm install typescript -D  
npx tsc --init // tsconfig.json 파일을 생성합니다.  
```


## tsconfig.json    

상세 옵션 확인 >https://www.typescriptlang.org/tsconfig/  

### 주요 옵션  

```js

include : 컴파일 대상 스코프  
exclude : 컴파일 제외 스코프  

-compilerOptions-
"target": "es6"
너무 최신 문법 보다는, 보통 ES5,ES6을 타겟으로 컴파일한다.   

"lib": ["DOM","DOM.Iterable","ESNext"]
target에 포함되는 라이브러리들, DOM같은 요소들이 있다. 기본적으로 꺼두면 target에 맞추어서 셋팅된다.  

"jsx": "react"
JSX를 어떻게 변환할지에 대한 옵션이다. react라고 하면 React.createElement 로 변환됨.  

"experimentalDecorators": true
데코레이터 사용 

"module": "commonjs"
모듈지원 방식을 결정한다. cjs는 commonjs, esm은 ESNext로 설정한다.  

"moduleResolution": "node",  
프로젝트에서 import하는 모듈들을 어떻게 해석할지 결정한다. nodenext(cjs,esm), node(cjs only), bundler(esm only)  
- https://www.typescriptlang.org/tsconfig/#moduleResolution

"baseUrl": "./",  
프로젝트 base directory  

"allowJs": true,    
JS허용  

"declaration": true,  
타입선언파일 따로 생성 여부  

"sourceMap": false, 
소스맵 생성 여부  

"outDir": "./dist",  
출력 파일 경로 지정  

"esModuleInterop": true,  
namespace와 default import 설정에서 발생하는 문제를 해결, 

"forceConsistentCasingInFileNames": true,    
대소문자를 구분하지 않는 OS에서, 대소문자를 구분하는OS로 프로젝트 이동시 문제가 발생할 수 있다. 그래서 대소문자를 구분하도록 옵션을 건다.  


```



### 모든 옵션  

```json
{
  "include": ["src"], // 컴파일 포함 디렉터리    
  "exclude": ["**/__test___/**"],// 컴파일 제외 디렉터리  
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig to read more about this file */

    /* Projects */
    "incremental": true,                               // 바뀐 부분만 컴파일 하도록 증분 설정을 한다.                               
    /* Save .tsbuildinfo files to allow for incremental compilation of projects. */
    "composite": true,                                /* Enable constraints that allow a TypeScript project to be used with project references. */
    "tsBuildInfoFile": "./.tsbuildinfo",              // incremental 관련된 정보를 담는 파일  
    /* Specify the path to .tsbuildinfo incremental compilation file. */
    "disableSourceOfProjectReferenceRedirect": true,  /* Disable preferring source files instead of declaration files when referencing composite projects. */
    "disableSolutionSearching": true,                 /* Opt a project out of multi-project reference checking when editing. */
    "disableReferencedProjectLoad": true,             /* Reduce the number of projects loaded automatically by TypeScript. */

    /* Language and Environment */
    "target": "es6", // 컴파일 대상의 버전, 너무 낮은 버전일수록 코드가 방대해질수있다.                                   
    /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
    "lib": ["DOM","DOM.Iterable","ESNext"],                                        /* Specify a set of bundled library declaration files that describe the target runtime environment. */
    "jsx": "react",                                /* Specify what JSX code is generated. */
    "experimentalDecorators": true,                   /* Enable experimental support for legacy experimental decorators. */
    // "emitDecoratorMetadata": true,                    /* Emit design-type metadata for decorated declarations in source files. */
    // "jsxFactory": "",                                 /* Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h'. */
    // "jsxFragmentFactory": "",                         /* Specify the JSX Fragment reference used for fragments when targeting React JSX emit e.g. 'React.Fragment' or 'Fragment'. */
    // "jsxImportSource": "",                            /* Specify module specifier used to import the JSX factory functions when using 'jsx: react-jsx*'. */
    // "reactNamespace": "",                             /* Specify the object invoked for 'createElement'. This only applies when targeting 'react' JSX emit. */
    // "noLib": true,                                    /* Disable including any library files, including the default lib.d.ts. */
    // "useDefineForClassFields": true,                  /* Emit ECMAScript-standard-compliant class fields. */
    // "moduleDetection": "auto",                        /* Control what method is used to detect module-format JS files. */

    /* Modules */
    "module": "commonjs",// 어떤 방식의 모듈을 사용할지 결정한다. commonjs - cjs, ESNext - AMD 모듈로 설정한다.   
    /* Specify what module code is generated. */
    // "rootDir": "./",                                  /* Specify the root folder within your source files. */
    "moduleResolution": "node",                          /* Specify how TypeScript looks up a file from a given module specifier. */
    "baseUrl": "./",                                  /* Specify the base directory to resolve non-relative module names. */
    // "paths": {},                                      /* Specify a set of entries that re-map imports to additional lookup locations. */
    // "rootDirs": [],                                   /* Allow multiple folders to be treated as one when resolving modules. */
    // "typeRoots": [],                                  /* Specify multiple folders that act like './node_modules/@types'. */
    // "types": [],                                      /* Specify type package names to be included without being referenced in a source file. */
    // "allowUmdGlobalAccess": true,                     /* Allow accessing UMD globals from modules. */
    // "moduleSuffixes": [],                             /* List of file name suffixes to search when resolving a module. */
    // "allowImportingTsExtensions": true,               /* Allow imports to include TypeScript file extensions. Requires '--moduleResolution bundler' and either '--noEmit' or '--emitDeclarationOnly' to be set. */
    // "resolvePackageJsonExports": true,                /* Use the package.json 'exports' field when resolving package imports. */
    // "resolvePackageJsonImports": true,                /* Use the package.json 'imports' field when resolving imports. */
    // "customConditions": [],                           /* Conditions to set in addition to the resolver-specific defaults when resolving imports. */
    // "resolveJsonModule": true,                        /* Enable importing .json files. */
    // "allowArbitraryExtensions": true,                 /* Enable importing files with any extension, provided a declaration file is present. */
    // "noResolve": true,                                /* Disallow 'import's, 'require's or '<reference>'s from expanding the number of files TypeScript should add to a project. */

    /* JavaScript Support */
    "allowJs": true,                                     /* Allow JavaScript files to be a part of your program. Use the 'checkJS' option to get errors from these files. */
    "checkJs": true,                                     /* Enable error reporting in type-checked JavaScript files. */
    // "maxNodeModuleJsDepth": 1,                        /* Specify the maximum folder depth used for checking JavaScript files from 'node_modules'. Only applicable with 'allowJs'. */

    /* Emit */
    "declaration": true,                              /* Generate .d.ts files from TypeScript and JavaScript files in your project. */
    // "declarationMap": true,                           /* Create sourcemaps for d.ts files. */
    // "emitDeclarationOnly": true,                      /* Only output d.ts files and not JavaScript files. */
    "sourceMap": false,                                /* Create source map files for emitted JavaScript files. */
    // "inlineSourceMap": true,                          /* Include sourcemap files inside the emitted JavaScript. */
    "outFile": "./",                                    /* Specify a file that bundles all outputs into one JavaScript file. If 'declaration' is true, also designates a file that bundles all .d.ts output. */
    "outDir": "./dist",                                   /* Specify an output folder for all emitted files. */
    "removeComments": true,                              /* Disable emitting comments. */
    "noEmit": false,                                     // JS파일 출력 안한다. 타입 체크만 할때 사용  
    /* Disable emitting files from a compilation. */
    "importHelpers": true,                               // 예전버전에서 문제가 발생할때 
    /* Allow importing helper functions from tslib once per project, instead of including them per-file. */
    "downlevelIteration": true,                          // 
    /* Emit more compliant, but verbose and less performant JavaScript for iteration. */
    // "sourceRoot": "",                                 /* Specify the root path for debuggers to find the reference source code. */
    // "mapRoot": "",                                    /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSources": true,                            /* Include source code in the sourcemaps inside the emitted JavaScript. */
    // "emitBOM": true,                                  /* Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files. */
    // "newLine": "crlf",                                /* Set the newline character for emitting files. */
    // "stripInternal": true,                            /* Disable emitting declarations that have '@internal' in their JSDoc comments. */
    // "noEmitHelpers": true,                            /* Disable generating custom helper functions like '__extends' in compiled output. */
    // "noEmitOnError": true,                            /* Disable emitting files if any type checking errors are reported. */
    // "preserveConstEnums": true,                       /* Disable erasing 'const enum' declarations in generated code. */
    // "declarationDir": "./",                           /* Specify the output directory for generated declaration files. */

    /* Interop Constraints */
    // "isolatedModules": true,                          /* Ensure that each file can be safely transpiled without relying on other imports. */
    // "verbatimModuleSyntax": true,                     /* Do not transform or elide any imports or exports not marked as type-only, ensuring they are written in the output file's format based on the 'module' setting. */
    // "isolatedDeclarations": true,                     /* Require sufficient annotation on exports so other tools can trivially generate declaration files. */
    // "allowSyntheticDefaultImports": true,             /* Allow 'import x from y' when a module doesn't have a default export. */
    "esModuleInterop": true,                             /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */
    // "preserveSymlinks": true,                         /* Disable resolving symlinks to their realpath. This correlates to the same flag in node. */
    "forceConsistentCasingInFileNames": true,            /* Ensure that casing is correct in imports. */

    /* Type Checking */
    "strict": true,                                      // 모든 타입 체크 검사를 받는다. 원치않다면 아래 옵션에서 일부만 활성화 하기.  
    /* Enable all strict type-checking options. */
    "noImplicitAny": true,                               /* Enable error reporting for expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,                         /* When type checking, take into account 'null' and 'undefined'. */
    // "strictFunctionTypes": true,                      /* When assigning functions, check to ensure parameters and the return values are subtype-compatible. */
    // "strictBindCallApply": true,                      /* Check that the arguments for 'bind', 'call', and 'apply' methods match the original function. */
    // "strictPropertyInitialization": true,             /* Check for class properties that are declared but not set in the constructor. */
    // "noImplicitThis": true,                           /* Enable error reporting when 'this' is given the type 'any'. */
    // "useUnknownInCatchVariables": true,               /* Default catch clause variables as 'unknown' instead of 'any'. */
    // "alwaysStrict": true,                             /* Ensure 'use strict' is always emitted. */
    "noUnusedLocals": true,                             /* Enable error reporting when local variables aren't read. */
    // "noUnusedParameters": true,                       /* Raise an error when a function parameter isn't read. */
    // "exactOptionalPropertyTypes": true,               /* Interpret optional property types as written, rather than adding 'undefined'. */
    // "noImplicitReturns": true,                        /* Enable error reporting for codepaths that do not explicitly return in a function. */
    // "noFallthroughCasesInSwitch": true,               /* Enable error reporting for fallthrough cases in switch statements. */
    // "noUncheckedIndexedAccess": true,                 /* Add 'undefined' to a type when accessed using an index. */
    // "noImplicitOverride": true,                       /* Ensure overriding members in derived classes are marked with an override modifier. */
    // "noPropertyAccessFromIndexSignature": true,       /* Enforces using indexed accessors for keys declared using an indexed type. */
    // "allowUnusedLabels": true,                        /* Disable error reporting for unused labels. */
    // "allowUnreachableCode": true,                     /* Disable error reporting for unreachable code. */

    /* Completeness */
    // "skipDefaultLibCheck": true,                      /* Skip type checking .d.ts files that are included with TypeScript. */
    "skipLibCheck": true                                 /* Skip type checking all .d.ts files. */
  }
}

```


## CommonJS vs ESM  

- CommonJS(NodeNext)
- ESM(ESNext)  

#### CommonJS

CommonJS는 주로 Node.js 환경에서 사용되는 모듈 시스템입니다.
- CommonJS 모듈은 `require` 함수와 `module.exports` 객체를 사용하여 모듈을 로드하고 내보냅니다.
  ```javascript
  // module1.js
  const module2 = require('./module2');
  module.exports = {
    greet: () => console.log('Hello from module1')
  };
  
  // module2.js
  module.exports = {
    greet: () => console.log('Hello from module2')
  };
  
  // main.js
  const module1 = require('./module1');
  module1.greet(); // "Hello from module1"
  ```

- **동기적 로딩**: 
  - CommonJS 모듈은 동기적으로 로드됩니다. 즉, 모듈이 로드될 때까지 코드 실행이 중단 
  - 동기적 로딩은 파일을 로드할 때 블로킹이 발생하므로, 브라우저 환경에서는 비효율적일 수 있습니다.
- **브라우저 호환성 부족**: 
  - 브라우저 환경에서는 기본적으로 지원되지 않으며, 브라우저에서 사용하려면 번들러(예: Webpack)와 같은 도구가 필요.
  - *Webpack의 CommonJS 처리 과정  
    - 모듈들을 하나의 번들 파일로 만든다. 모듈리스트들은 webpack_modules 변수에 들어간다. (in memory)  
    - 모듈들이 필요하면 모듈 리스트에서 찾아서 리턴해준다. webpack_require 라는 함수가 이를 처리한다. 필요시 캐싱  
    - *마치 node.js 에서 동작하는 require, exports를 bundle.js에서 인메모리 상에 구현함.  


#### ESNext (ES Modules)

ESNext(또는 ECMAScript Modules, ESM)는 최신 ECMAScript 표준에 정의된 모듈 시스템입니다.  
- 브라우저와 Node.js 모두에서 사용할 수 있도록 설계. 
- ES 모듈은 `import`와 `export` 키워드를 사용하여 모듈을 로드하고 내보냅니다.

  ```javascript
  // module1.mjs
  import { greet as greet2 } from './module2.mjs';
  export const greet = () => console.log('Hello from module1');
  
  // module2.mjs
  export const greet = () => console.log('Hello from module2');
  
  // main.mjs
  import { greet as greet1 } from './module1.mjs';
  greet1(); // "Hello from module1"
  ```

- **비동기적 로딩**: ES 모듈은 비동기적으로 로드되며, 이는 브라우저 환경에서 효율적입니다.  
- **트리 쉐이킹(Tree Shaking)**: 번들러가 사용되지 않는 코드를 제거하여 최적화할 수 있습니다.  
- **엄격 모드**: 모든 ES 모듈은 자동으로 엄격 모드('use strict')에서 실행됩니다.  

- **브라우저 및 Node.js 지원**: 최신 브라우저와 Node.js(버전 12 이상)에서 기본적으로 지원됩니다.  
- **표준화**: 공식 ECMAScript 표준의 일부로, 앞으로의 JavaScript 발전에 맞춰 지속적으로 개선될 것입니다.  
- **호환성 문제**: 오래된 JavaScript 환경이나 도구에서 호환성 문제가 발생할 수 있습니다.  


#### 종합 비교

| 특징             | CommonJS                                 | ESNext (ES Modules)                        |
|------------------|------------------------------------------|--------------------------------------------|
| 사용 환경        | Node.js, 서버 사이드                      | 최신 브라우저, Node.js                      |
| 로딩 방식        | 동기적                                    | 비동기적                                    |
| 구문             | `require`, `module.exports`               | `import`, `export`                         |
| 트리 쉐이킹      | 지원하지 않음                             | 지원                                       |
| 모듈 스코프      | 고유 스코프                               | 고유 스코프, 엄격 모드                      |
| 표준화 여부      | 비표준                                    | 표준 (ECMAScript)                          |
| 호환성           | 브라우저에서 번들러 필요                 | 최신 브라우저와 Node.js에서 기본 지원        |


## module, moduleResolution

TypeScript 컴파일러가 모듈을 처리하는 방식을 정의.

#### `module`

`module` 옵션은 TypeScript 컴파일러가 생성할 JavaScript 모듈 시스템을 지정.

- `CommonJS`: Node.js 및 대부분의 서버측 JavaScript 환경에서 사용됩니다. 모듈은 `require`와 `module.exports`를 통해 로드되고 내보내집니다.
- `ESNext`: 최신 ECMAScript 모듈 시스템을 사용합니다. 이 옵션은 최신 ES 모듈 기능을 사용할 수 있도록 합니다.
- `ES6`/`ES2015`: ES6 모듈 시스템을 사용합니다. 모듈은 `import`와 `export`를 통해 로드되고 내보내집니다.
- `AMD`: Asynchronous Module Definition을 사용합니다. 주로 브라우저 환경에서 사용됩니다.
- `UMD`: Universal Module Definition을 사용합니다. AMD와 CommonJS를 모두 지원하는 방식으로, 브라우저와 서버 모두에서 사용할 수 있습니다.
- `System`: SystemJS를 사용하여 모듈을 로드합니다.
- `None`: 모듈 시스템을 사용하지 않습니다. 이 설정은 모듈화되지 않은 글로벌 스코프 코드를 생성합니다.

#### `moduleResolution`

`moduleResolution` 옵션은 TypeScript 컴파일러가 모듈 경로를 해석하는 방식을 지정.  
- 일반적으로 옵션은 node를 사용한다. 이는 모듈시스템(cjs,mjs)에 상관없이 모듈을 찾을 수 있다.   
  - CommonJS 모듈은 require이 아닌 import로 가져오고 싶다면 > esModuleInterop  
  - 

- `classic`: TypeScript 1.6 이전의 기본 모듈 해석 전략을 사용합니다. 이 모드에서는 `node_modules` 폴더를 검색하지 않고, 상대 경로로만 모듈을 찾습니다.
- `node`: Node.js 모듈 해석 전략을 사용합니다. Node.js의 `require` 방식과 동일하게 동작하며, `node_modules` 폴더를 검색하고, 패키지의 `package.json` 파일을 참조하여 `main` 필드를 찾습니다.
- `bundler`: TypeScript 5.0부터 사용 가능한 옵션으로, 번들러(webpack, rollup 등)와 유사한 모듈 해석 전략을 사용합니다. 이 모드에서는 `.ts`, `.tsx`, `.js`, `.jsx`, `.d.ts` 확장자를 가진 파일을 우선적으로 찾습니다.

#### 예시

```json
{
  "compilerOptions": {
    "module": "CommonJS",
    "moduleResolution": "node"
  }
}
---
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

## esModuleInterop(true), allowSyntheticDefaultImports(true)

esModuleInterop(default = true)  
- node_modules를 가져올때 세부 설정
- CommonJS 모듈을 ES 모듈처럼 사용 가능   
- https://www.typescriptlang.org/tsconfig/#esModuleInterop  

```js
// node_modules/some-library/index.js
module.exports = {
  libraryFunction: function() {
    console.log("Library function called");
  }
};
---
import { greet } from './utils';
import * as someLibrary from 'some-library';
console.log(greet('TypeScript'));
someLibrary.libraryFunction();
```

allowSyntheticDefaultImports (default = true)
- node_modules를 가져올때 세부 설정  
- CommonJS 모듈을 ES 모듈처럼 사용할때, default import 구문을 사용할 수 있다.   
- https://www.typescriptlang.org/tsconfig/#Interop_Constraints_6252


```js
// node_modules/some-library/index.js
module.exports = {
  libraryFunction: function() {
    console.log("Library function called");
  }
};
--- allowSyntheticDefaultImports:true
import { greet } from './utils';
import someLibrary from 'some-library';

console.log(greet('TypeScript'));
someLibrary.libraryFunction();

--- allowSyntheticDefaultImports:false
// 1.require을 쓰던가
import { greet } from './utils';
const someLibrary = require('some-library');

console.log(greet('TypeScript'));
someLibrary.libraryFunction();
// 2. namespace 구문(* as)을 사용하던가   
import { greet } from './utils';
import * as someLibrary from 'some-library';

console.log(greet('TypeScript'));
someLibrary.libraryFunction();
```

esModuleInterop = false

#### 기본 설정(`esModuleInterop: false`)에서의 문제점

1. **네임스페이스 import**:
   ```typescript
   import * as moment from "moment";
   ```
   위 코드는 ES6 모듈 사양에 따르면 객체여야 하지만, TypeScript는 이를 `const moment = require("moment")`와 동일하게 처리하여 함수처럼 호출할 수 있게 합니다. 이는 사양에 맞지 않습니다.

2. **디폴트 import**:
   ```typescript
   import moment from "moment";
   ```
   위 코드는 `const moment = require("moment").default`와 동일하게 처리됩니다. 이는 일부 CommonJS/AMD/UMD 모듈과의 호환성 문제를 일으킵니다.

### `esModuleInterop`를 켰을 때의 동작 (`esModuleInterop: true`)

이 설정을 켜면 TypeScript는 다음과 같은 방식으로 문제를 해결합니다:

1. **네임스페이스 import**:
   - TypeScript가 모듈을 올바르게 네임스페이스 객체로 처리하여, 함수처럼 호출할 수 없도록 합니다.
   
2. **디폴트 import**:
   - TypeScript가 CommonJS/AMD/UMD 모듈의 디폴트 export를 올바르게 처리하여, 호환성을 유지합니다.

```typescript
// 문제 발생 코드 (`esModuleInterop: false`):

// 네임스페이스 import
import * as moment from "moment";
moment();  // TypeScript에서는 오류 없음, 런타임에서 오류 발생

// 디폴트 import
import moment from "moment";
moment().format();  // 모듈이 .default 속성을 가지지 않는 경우 오류 발생
``
// 해결된 코드 (`esModuleInterop: true`):
// 네임스페이스 import
import * as moment from "moment";
moment();  // 컴파일 오류: 네임스페이스 객체는 호출할 수 없음

// 디폴트 import
import moment from "moment";
moment().format();  // 올바르게 작동
```


## 절대경로설정  

TypeScript에서 절대 경로를 설정하면 프로젝트 파일을 더 쉽게 관리하고, 상대 경로의 복잡성을 줄일 수 있습니다. 이를 위해 `tsconfig.json` 파일을 설정해야 합니다. 다음은 절대 경로를 설정하는 방법입니다.

### 1. `tsconfig.json` 파일 설정

`tsconfig.json` 파일에서 `compilerOptions`에 `baseUrl` 및 `paths` 옵션을 추가합니다. 

- **`baseUrl`**: 절대 경로의 기준이 되는 디렉토리를 설정합니다.
- **`paths`**: 모듈 이름을 재정의하여 절대 경로를 사용할 수 있도록 합니다.

### 예시

프로젝트 구조가 다음과 같다고 가정해 봅시다:

```
project-root
├── src
│   ├── components
│   │   └── Button.tsx
│   ├── utils
│   │   └── helpers.ts
│   └── index.ts
├── tsconfig.json
└── package.json
```

이 경우, `tsconfig.json` 파일을 다음과 같이 설정할 수 있습니다:

```json
{
  "compilerOptions": {
    "baseUrl": "./",  // 프로젝트의 루트 디렉토리를 기준으로 설정
    "paths": {
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    },
    "target": "es5",
    "module": "commonjs",
    "jsx": "react",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### 2. 모듈 가져오기

설정을 완료한 후, 이제 `src/index.ts` 파일에서 절대 경로를 사용하여 모듈을 가져올 수 있습니다:

```typescript
// 기존 상대 경로
import { Button } from './components/Button';
import { helper } from './utils/helpers';

// 절대 경로
import { Button } from '@components/Button';
import { helper } from '@utils/helpers';
```

### 3. Jest 설정 (선택 사항)

만약 Jest를 사용하여 테스트를 작성하는 경우, Jest도 절대 경로를 이해할 수 있도록 설정해야 합니다. `jest.config.js` 파일을 다음과 같이 설정합니다:

```javascript
module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1'
  }
};
```

### 4. ESLint 설정 (선택 사항)

만약 ESLint를 사용하는 경우, ESLint도 절대 경로를 이해할 수 있도록 설정해야 합니다. `.eslintrc.js` 파일을 다음과 같이 설정합니다:

```javascript
module.exports = {
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      },
      alias: {
        map: [
          ['@components', './src/components'],
          ['@utils', './src/utils']
        ],
        extensions: ['.ts', '.js', '.jsx', '.json']
      }
    }
  }
};
```