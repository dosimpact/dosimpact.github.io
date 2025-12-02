---
sidebar_position: 1
---

# NestJS 시작

<head>
  <meta name="keywords" content="NestJS"/>
</head>


## NestJS 란?

NestJS는 자바스크립트와 타입스크립트를 기반으로 하는 서버사이드 애플리케이션을 만들기 위한 프레임워크입니다.   

이는 주로 Node.js에서 실행되며, 읽기 쉬운 코드와 확장 가능성을 강조합니다. NestJS는 모듈화된 구조, 의존성 주입, 미들웨어 등의 기능을 지원하여 애플리케이션을 효과적으로 구성하고 유지보수하기 쉽게 만듭니다.   

NestJS는 주로 백엔드 개발에 사용되며, Angular와 비슷한 구조를 가지고 있어 전체적인 일관성을 유지하는 데 도움이 됩니다.  

<br/>

## NestJS init 프로젝트 설치

nest 프로젝트는 cli를 통해 쉽게 프로젝트를 시작할 수 있다.  

```js
// node 16버전 이상인지 체크
node -v 

// global install
npm i -g @nestjs/cli

// 생성
nest new project-name

// 프로젝트 디렉터리 이동 후
yarn start:dev
( "start:dev": "nest start --watch" )

```

<br/>

## Cli generator

nest cli를 통해서 손쉽게 API 보일러 플레이트를 만들 수 있다.  

```
npx nest --help

Commands:
  new|n [options] [name]                          Generate Nest application.
  build [options] [app]                           Build Nest application.
  start [options] [app]                           Run Nest application.
  info|i                                          Display Nest project details.
  add [options] <library>                         Adds support for an external library to your project.
  generate|g [options] <schematic> [name] [path]  Generate a Nest element.
    Schematics available on @nestjs/schematics collection:
      ┌───────────────┬─────────────┬──────────────────────────────────────────────┐
      │ name          │ alias       │ description                                  │
      │ application   │ application │ Generate a new application workspace         │
      │ class         │ cl          │ Generate a new class                         │
      │ configuration │ config      │ Generate a CLI configuration file            │
      │ controller    │ co          │ Generate a controller declaration            │
      │ decorator     │ d           │ Generate a custom decorator                  │
      │ filter        │ f           │ Generate a filter declaration                │
      │ gateway       │ ga          │ Generate a gateway declaration               │
      │ guard         │ gu          │ Generate a guard declaration                 │
      │ interceptor   │ itc         │ Generate an interceptor declaration          │
      │ interface     │ itf         │ Generate an interface                        │
      │ library       │ lib         │ Generate a new library within a monorepo     │
      │ middleware    │ mi          │ Generate a middleware declaration            │
      │ module        │ mo          │ Generate a module declaration                │
      │ pipe          │ pi          │ Generate a pipe declaration                  │
      │ provider      │ pr          │ Generate a provider declaration              │
      │ resolver      │ r           │ Generate a GraphQL resolver declaration      │
      │ resource      │ res         │ Generate a new CRUD resource                 │
      │ service       │ s           │ Generate a service declaration               │
      │ sub-app       │ app         │ Generate a new application within a monorepo │
      └───────────────┴─────────────┴──────────────────────────────────────────────┘
```

아래 처럼 단일 클래스 파일을 만들 수 있다.

```
// 모듈을 생성해주는 cli
npx nest g mo

// 서비스를 생성해주는 cli
npx nest g s

// 컨트롤러를 생성해주는 cli
npx nest g co

// 리솔버를 생성해주는 cli
npx nest g r
```

기본적인 CRUD를 생성해주는 cli 다음과 같다.

```
npx nest g res

? What name would you like to use for this resource (plural, e.g., "users")? users
? What transport layer do you use? REST API
? Would you like to generate CRUD entry points? Yes
CREATE users/users.controller.spec.ts (566 bytes)
CREATE users/users.controller.ts (894 bytes)
CREATE users/users.module.ts (248 bytes)
CREATE users/users.service.spec.ts (453 bytes)
CREATE users/users.service.ts (609 bytes)
CREATE users/dto/create-user.dto.ts (30 bytes)
CREATE users/dto/update-user.dto.ts (169 bytes)
CREATE users/entities/user.entity.ts (21 by

```