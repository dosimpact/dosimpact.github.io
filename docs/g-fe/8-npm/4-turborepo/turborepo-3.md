---
sidebar_position: 3
---

# Monorepo Turborepo + pnpm + tsup  

- [Monorepo Turborepo + pnpm + tsup](#monorepo-turborepo--pnpm--tsup)
  - [Goal](#goal)
  - [📌 pnpm + monorepo](#-pnpm--monorepo)
    - [pnpm 명령어 정리](#pnpm-명령어-정리)
    - [workspace](#workspace)
  - [turbo 주요 명령어](#turbo-주요-명령어)
  - [Setup tsup](#setup-tsup)
    - [Setup tsup (Single Entry)](#setup-tsup-single-entry)
    - [Setup tsup (Multiple Entry)](#setup-tsup-multiple-entry)
    - [Setup tsup with bin script (npx cli)](#setup-tsup-with-bin-script-npx-cli)
  - [Local test](#local-test)
    - [Test in another project](#test-in-another-project)
  - [publish to npm regitry](#publish-to-npm-regitry)
  - [download from npm registry](#download-from-npm-registry)


## Goal  

Goal : 모노레포로 라이브러리 및 프로젝트를 관리한다.  
- Tools : turbo, pnpm, tsup, storybook, typescript, eslint, jest  

Tasks  
- [ ] turbo repo 시작하기  
- [ ] pnpm 명령어 정리 및 의존성 확인하기  
- [ ] tsup 라이브러리 배포 환경 및 turbo 명령어로 개발환경 구축  


Ref
- Vercel Examples : https://github.com/vercel/turborepo/blob/main/examples

## 📌 pnpm + monorepo 


### pnpm 명령어 정리

```js
// 1.설치
pnpm i
// 1.1 -r 
// -r은 모든 워크스페이스를 순환시켜주는 명령어 이다. 아래처럼 모든 워크스페이스 마다 pnpm i 명령어 실행
// 하지만 특별히 모노레포의 경우, 루트에서 pnpm i으로만 충분
pnpm i -r

// 2.모노레포의 의존성 link
// 2.1 로컬 의존성 설치하는 방법  
pnpm add package-name  
pnpm add package-name -D  
// 2.2 여러 레포에 한번에 의존성 링크하기  
pnpm add @org/ui --filter apps/web  
// 2.3 수동으로 설치하기
- "@org/ui":"workspace:*" -> pnpm i  

// 2.4 의존성 링크 확인  
pnpm list  

// 참고
pnpm link package-name  // 의존성 링크 만들기 
pnpm unlink package-name // 의존성 링크 제거  
pnpm list // 현재 의존성 리스트  

// 3.글로벌 의존성 만들기
// 로컬의 의존성을 다른 레포에서 테스트 할수 있다.  
pnpm link --global              // (로컬모듈) 글로벌 링크 만들기
pnpm link package-name --global // (test) 글로벌의 로컬모듈을 test 레포에 설치(하드 링크 방식)   
//? pnpm list --global              // (test) 링크 확인  
pnpm unlink --global            // (로컬모듈) 글로벌 링크 제거

// 캐시 클리어 
pnpm store prune 

// 워크스페이스 명령어
pnpm install -r  
// 모든 워크스페이스에서 node_modules 제거하기  
pnpm -r exec rm -rf node_mouldes  

// 의존성 제거, 업데이트
pnpm remove 
pnpm update 

// script 수행 
pnpm run script-name  
```

### workspace

모노레포는 node 진영에서는 workspace라는 개념으로 통한다.  
- pnpm-workspace.yaml 파일 생성  
```
packages:
  - "packages/*"
  - "apps/*"
```
- turbo.json 파일 생성  


## turbo 주요 명령어  

```
turbo run <task>: 지정된 작업을 실행합니다.
turbo run dev --filter=reco-common-ui --ui

turbo dev: 개발 모드에서 작업을 실행합니다.
turbo build: 빌드 작업을 실행합니다.
turbo lint: 린트 작업을 실행합니다.
turbo test: 테스트 작업을 실행합니다.
turbo prune: 사용되지 않는 패키지를 제거합니다.
turbo clean: 캐시와 빌드 아티팩트를 정리합니다.
```

## Setup tsup 

```js
export const tsup: Options = {
  entry: ['src/**/*.tsx', 'src/**/*.ts', 'src/**/*.css'],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  target: 'es2015',
  dts: true,
  bundle: true,
  splitting: false,
  clean: true,
  skipNodeModulesBundle: true,
  sourcemap: true,
  minify:false,
  watch: env === 'development',
};
---
package.json
  "type": "module",
  "main": "dist/index.cjs",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      },
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    }
  },
```

### Setup tsup (Single Entry)

```js
// 0.src/index.ts  
// 배럴 파일에서는 이름이 겹칠 수 있다. renamed & re-export 하는 방법을 사용한다.
// export * from './calcuator/index.js';
// export * from './calcuator-v2/index.js';

import * as CalculatorV1 from './calcuator/index.js';
import * as CalculatorV2 from './calcuator-v2/index.js';

export { CalculatorV1, CalculatorV2 };


// 1.
// tsup.config.ts
import { defineConfig } from 'tsup';

const env = process.env.NODE_ENV;

export default defineConfig({
  // entry 는 포함할 파일 목록이다. 모듈노출은 package.json 에서 진행한다.   
  entry: ['src/**/*.ts'], // glob 패턴 사용
  outDir: 'dist', // 출력 디렉토리
  format: ['cjs', 'esm'], // CommonJS와 ESM 형식 출력
  dts: true, // 타입 선언 파일 생성
  sourcemap: env === 'development', // 소스맵 생성
  target: 'es2015',
  /* optimization */
  minify: true, // 코드 최소화 여부
  bundle: true,
  splitting: false,
  skipNodeModulesBundle: true,
  /* dev */
  clean: true, // 빌드 전에 디렉토리 정리
  watch: env === 'development',
});

---
// 2.
// package.json
{
  "name": "@dodo/blocks",
  "version": "0.0.1",
  "description": "",
  "scripts": {
    "dev": "NODE_ENV=development tsup",
    "build": "NODE_ENV=production tsup",
    "npm-publihs": ""
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "exports": {
    "./calcuator": {
      "require": {
        "types": "./dist/calcuator/index.d.cts",
        "default": "./dist/calcuator/index.cjs"
      },
      "import": {
        "types": "./dist/calcuator/index.d.ts",
        "default": "./dist/calcuator/index.js"
      }
    },
    "./calcuator-v2": {
      "require": {
        "types": "./dist/calcuator-v2/index.d.cts",
        "default": "./dist/calcuator-v2/index.cjs"
      },
      "import": {
        "types": "./dist/calcuator-v2/index.d.ts",
        "default": "./dist/calcuator-v2/index.js"
      }
    }
  },
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
    "@turbo/gen": "^1.12.4",
    "@types/node": "^20.11.24",
    "@types/eslint": "^8.56.5",
    "@types/react": "^18.2.61",
    "@types/react-dom": "^18.2.19",
    "eslint": "^8.57.0",
    "react": "^18.2.0",
    "typescript": "5.5.4",
    "tsup": "^8.3.5"
  }
}

//3.tsconfig.json
{
  "extends": "@repo/typescript-config/react-library.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### Setup tsup (Multiple Entry)  

- 단점 : 모듈이 늘어날때마다 베이스 코드작업을 해야한다.  

```js
// 1.src/index.ts  
export * from './calcuator/index.js';
export * from './calcuator-v2/index.js';



// 2.
// package.json
{
  "name": "@dodo/blocks",
  "version": "0.0.1",
  "description": "",
  "scripts": {
    "dev": "NODE_ENV=development tsup",
    "build": "NODE_ENV=production tsup",
    "npm-publihs": ""
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "exports": {
    "./calcuator": {
      "require": {
        "types": "./dist/calcuator/index.d.cts",
        "default": "./dist/calcuator/index.cjs"
      },
      "import": {
        "types": "./dist/calcuator/index.d.ts",
        "default": "./dist/calcuator/index.js"
      }
    },
    "./calcuator-v2": {
      "require": {
        "types": "./dist/calcuator-v2/index.d.cts",
        "default": "./dist/calcuator-v2/index.cjs"
      },
      "import": {
        "types": "./dist/calcuator-v2/index.d.ts",
        "default": "./dist/calcuator-v2/index.js"
      }
    }
  },
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
    "@turbo/gen": "^1.12.4",
    "@types/node": "^20.11.24",
    "@types/eslint": "^8.56.5",
    "@types/react": "^18.2.61",
    "@types/react-dom": "^18.2.19",
    "eslint": "^8.57.0",
    "react": "^18.2.0",
    "typescript": "5.5.4",
    "tsup": "^8.3.5"
  }
}

```


### Setup tsup with bin script (npx cli)


```js
// 1.
// src/scripts/indext.ts

#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .name('@dodolabs/blocks')
  .description('CLI tool for math operations')
  .version('1.0.0');

// `adder` 명령어 정의
program
  .command('adder')
  .description('Add two numbers')
  .option('--a <number>', 'First number', '0')
  .option('--b <number>', 'Second number', '0')
  .action((options) => {
    const a = parseFloat(options.a);
    const b = parseFloat(options.b);
    console.log(`Result: ${a + b}`);
  });

// 명령어 파싱
program.parse(process.argv);

// 2.package.json
// add bin field  
  "bin": {
    "@dodolabs/blocks": "./dist/scripts/index.js"
  },

// 3.build
// "build": "NODE_ENV=production tsup",

// 4.Local Test in inside Module 
node ./dist/scripts/index.js

// 📕 현재 선언된 모듈이 type:"module" 이므로 ESM 스크립으를 구동한다.  

// 5.Local test in outside Module  
// pnpm link --global  
// pnpm link @dodolabs/blocks --global  
// npx @dodolabs/blocks adder --a=1 --b=2  
// pnpm unlink @dodolabs/blocks --global    

// 6.publish  
    "npm-publish": "pnpm build && npm publish"

```

## Local test


### Test in another project  

```js
// 1.
// pnpm setup 명령어를 실행하여 pnpm이 자동으로 전역 바이너리 디렉토리를 설정하도록 합니다.
pnpm setup
source ~/.zshrc 

// 2.
// 로컬모듈에서 글로벌 링크 만들기  
pnpm link --global

// 3.
// 테스트 레포로 가서 방금 만든 로컬 모듈 연결하기  
// pnpm install 은 필요없다.  
pnpm link --global @dodo/blocks
//확인해보기 (잘안된다.?)
pnpm list

// 4. 테스트 후 링크제거
pnpm unlink --global @dodo/blocks

```

cjs test
- change package.json type to commonjs
```js

const { adder } = require("@dodo/blocks/calcuator-v2");

console.log(typeof module !== "undefined" ? "CommonJS" : "ES Module"); // CommonJS

console.log(adder(1, 2));

```
mjs test
- change package.json type to module

```js
// ---

import { adder } from "@dodo/blocks/calcuator-v2";

// module 이라는 전역 객체가 존재한다.
console.log(typeof module !== "undefined" ? "CommonJS" : "ES Module"); // ES Module

console.log(adder(1, 2));

```

## publish to npm regitry  

```
// 1.
아래와 같이 내 계정이름과 다른 접두사를 가진 패키지를 배포하려면 조직을 만들어야 한다.  
- @dodolabs/blocks
- npm registry에서 조직을 만들자.   

// 2.
npm login  

// 3.
npm publish

```

## download from npm registry

```
pnpm i @dodolabs/blocks
```