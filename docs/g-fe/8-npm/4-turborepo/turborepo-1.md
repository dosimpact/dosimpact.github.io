---
sidebar_position: 1
---

# Monorepo Turborepo    

- [Monorepo Turborepo](#monorepo-turborepo)
  - [Introduction](#introduction)
  - [From zero to turbo](#from-zero-to-turbo)
  - [1. Structuring a repository](#1-structuring-a-repository)
    - [예제 프로젝트](#예제-프로젝트)
    - [최소 요구 사항 파일들](#최소-요구-사항-파일들)
    - [패키지의 구조 및 패키지의 진입점](#패키지의-구조-및-패키지의-진입점)
    - [참고) 패키지 배포할때 진입점을 설정하는 2가지 방법](#참고-패키지-배포할때-진입점을-설정하는-2가지-방법)
    - [exports 이점 3가지](#exports-이점-3가지)
    - [일반적인 함정](#일반적인-함정)
    - [예제 뜯어보기](#예제-뜯어보기)
  - [2. Managing dependencies](#2-managing-dependencies)
  - [3. Creating an internal package](#3-creating-an-internal-package)
  - [4. Configuring tasks](#4-configuring-tasks)
  - [5. Running tasks](#5-running-tasks)
  - [6. Caching](#6-caching)
  - [7. Developing apps](#7-developing-apps)
  - [8. Using environment variables](#8-using-environment-variables)
  - [9. Constructing CI](#9-constructing-ci)
  - [10. Upgrading](#10-upgrading)


## Introduction

**Turborepo란?**    
>모노레포(monorepos)의 엔터프라이즈 급 솔루션, 다수의 코드베이스의 테스트, 린트, 빌드 프로세스 최적화.  

Turborepo는 JavaScript와 TypeScript 코드베이스를 위한 고성능 빌드 시스템이에요.  
- 주로 모노레포(monorepos)의 확장을 위해 설계되었으며, 단일 패키지 작업 공간에서도 워크플로우를 더욱 빠르게 만들어줘요.

**모노레포 문제**  
확장성 이슈 : 모노레포는 많은 이점이 있지만, 확장하는 데 어려움을 겪어요. 
- 각 작업 공간은 자체 테스트 스위트, 린트 프로세스, 빌드 프로세스를 가지고 있어요. 단일 모노레포는 수천 개의 작업을 실행해야 할 수도 있어요.
- 일반적인 모노레포의 예로, 첫 번째 애플리케이션은 작업을 완료하는 데 110초가 걸리고, 두 번째 애플리케이션은 140초가 걸려요. 두 애플리케이션 사이에 공유된 패키지는 작업을 완료하는 데 90초가 걸려요. 

**모노레포 솔루션**    

1.원격 캐시
이전의 모노레포가 Turborepo를 사용하면, 세 개의 패키지에 대한 작업을 캐시에서 불러와 80밀리초 안에 완료할 수 있어요.  
Turborepo는 모노레포의 확장 문제를 해결해요. 원격 캐시는 모든 작업의 결과를 저장하여, CI가 같은 작업을 반복할 필요가 없게 해줘요.

2.작업 스케줄링
또한, 모노레포에서 작업 스케줄링은 어려울 수 있어요. 빌드를 먼저 하고, 테스트를 하고, 그다음 린트를 해야 할 수 있어요.
Turborepo는 모든 작업을 최대한 빠르게 스케줄링하고, 사용 가능한 모든 코어에서 병렬로 작업을 처리해요.

3.점진적으로 도입 가능  
- Turborepo는 점진적으로 도입할 수 있고, 몇 분 안에 모든 저장소에 추가할 수 있어요. 
- 이미 작성한 package.json 스크립트와 선언한 종속성을 사용하며, turbo.json 파일 하나만 필요해요.
- npm, yarn, pnpm과 같은 어떤 패키지 매니저와도 사용할 수 있어요.  
- Turborepo는 npm 생태계의 관습을 따르니까요.



## From zero to turbo  

## 1. Structuring a repository
>Design the directory structure of your monorepo.   

목적 : 파일 구조 컨벤션을 소개하겠다.  

### 예제 프로젝트  
아래 예제 프로젝트 확인하면서, 공식문서 내용이랑 실제 모노래포를 비교하면서 들을 것.!  
- https://github.com/vercel/turborepo/tree/main/examples  
  - https://github.com/vercel/turborepo/tree/main/examples/with-nestjs 
    - nestjs + nextjs full stack 개발에서 사용 된다.   
  - https://github.com/vercel/turborepo/tree/main/examples/with-berry  
    - yarn, yarn berry, pnpm 등 패키지 매니저에 상관없이 사용 가능하다.  

### 최소 요구 사항 파일들  

아래는 유효한 작업 공간을 만들기 위한 create-turbo의 주요 구조 요소들이에요.

**최소 요구 사항**
- Specifying packages in a monorepo  
- A package manager lockfile
- Root package.json
- Root turbo.json
- package.json in each package

1.Specifying packages in a monorepo

패키지 관리자가 패키지의 위치를 설명해야 해요. 
- 일반적으로 `apps/`에는 애플리케이션과 서비스를,
- `packages/`에는 라이브러리 및 도구를 배치하는 것을 권장해요.

```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```
- 이 설정을 사용하면 `apps` 또는 `packages` 디렉토리 내에서 `package.json`을 가진 모든 디렉토리가 패키지로 간주돼요.

**각 패키지에 있는 package.json**  
패키지가 패키지 관리자와 turbo에 의해 인식되려면 해당 디렉토리에 `package.json` 파일이 있어야 해요.  

**루트 package.json**  
루트 `package.json`은 작업 공간의 기본이에요. 아래는 루트 `package.json`의 일반적인 예시예요:

```json
{
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "latest"
  },
  "packageManager": "npm@10.0.0"
}
```

**루트 turbo.json**  
`turbo.json`은 turbo의 동작을 설정하는 데 사용돼요. 작업을 구성하는 방법에 대한 자세한 내용은 작업 구성 페이지에서 확인할 수 있어요.

**패키지 관리자 잠금 파일**  
- 잠금 파일(lockfile)은 패키지 관리자와 turbo 모두에서 재현 가능한 동작을 보장하는 데 중요해요. - Turborepo는 잠금 파일을 사용해 작업 공간 내에서 내부 패키지 간의 종속성을 이해해요.


**패키지의 구조**  
- 작업 공간 내에서 각 패키지를 하나의 독립적인 단위로 생각하는 것이 좋아요. 
- 각 패키지는 자체 `package.json`, 도구 구성, 소스 코드를 가지고 있으며, 이는 마치 작은 "프로젝트" 같아요.  

### 패키지의 구조 및 패키지의 진입점  

- workspaces 내 패키지들을 독립적인 단위로 생각하는게 처음에는 좋다.    
- 독립적인 패키지들은 독자적인 package.json, lint, source code 등을 가진 작은 프로젝트 이다.   
- 또한 패키지의 진입점(entrypoint)이 있어서, 다른 패키지에서 접근할 수 있는 `exports` 필드가 있다.  

### 참고) 패키지 배포할때 진입점을 설정하는 2가지 방법  

```js
// case1. 진입점이 1개인 경우  
  "types": "dist/index.d.ts",
  "main": "dist/index.js",
  "module": "dist/esm"

// case2. 진입점이 2개 이상인 경우
  "exports": {
    ".": {
      "require": {
        "types": "./index.d.ts",
        "default": "./index.js"
      },
      "import": {
        "types": "./esm/index.d.ts",
        "default": "./esm/index.js"
      }
    },
    "./feature": {
      "require": {
        "types": "./index.d.ts",
        "default": "./index.js"
      },
      "import": {
        "types": "./index.d.mts",
        "default": "./index.mjs"
      }
    }
  }
```

**패키지의 package.json 필드**
- **name**: 패키지를 식별하는 데 사용돼요. 반드시 unique 값!.  
- **scripts**: 패키지의 컨텍스트에서 실행할 스크립트를 정의하는 필드예요.
- **exports**: 패키지의 진입점을 지정해 다른 패키지가 이 패키지에 접근할 수 있게 해줘요.

예를 들어 `@repo/math` 패키지가 있다고 가정하면, 다음과 같은 `exports` 필드를 가질 수 있어요:

```json
{
  "exports": {
    ".": "./dist/constants.ts",
    "./add": "./dist/add.ts",
    "./subtract": "./dist/subtract.ts"
  }
}
```

이렇게 하면 다른 패키지에서 다음과 같이 해당 함수들을 불러올 수 있어요:

```typescript
import { GRAVITATIONAL_CONSTANT, SPEED_OF_LIGHT } from '@repo/math';
import { add } from '@repo/math/add';
import { subtract } from '@repo/math/subtract';
```
### exports 이점 3가지  

`exports`를 사용하는 방식은 다음 세 가지 주요 이점을 제공해요:

1. **배럴 파일 회피**: 
- 배럴 파일은 하나의 진입점을 만들기 위해, 다른 패키지들을 re-export 를 하는 파일이다.  
- 편리해 보일 수 있지만, 컴파일러와 번들러가 처리하기 어렵고 성능 문제로 이어질 수 있어요.  
- (Barrel 파일이 불필요한 모듈까지 모두 불러와 트리 쉐이킹(tree-shaking)이 제대로 작동 X)  

2. **더 강력한 기능**: 
- `exports`는 `main` 필드와 비교해 조건부 내보내기(Conditional Exports)와 같은 더 강력한 기능을 제공해요. 
- 가능하면 `exports`를 사용하는 것을 권장.  

3. **IDE 자동 완성**: 패키지의 진입점을 `exports`로 지정하면 코드 편집기에서 해당 패키지의 내보내기에 대한 자동 완성 기능을 제공할 수 있어요.

**참고**: `exports`에 와일드카드를 사용할 수도 있지만, TypeScript 컴파일러의 성능 문제로 인해 자동 완성 기능을 잃을 수 있어요. 자세한 내용은 TypeScript 가이드를 참조하세요.

**`imports` (선택 사항)**  
- `imports` 필드는 외부 패키지의 하위 경로를 만들 수 있는 방법을 제공.  
- (참고로 프로젝트내 절대 경로 설정은, tsconfig에서 path 필드 사용)   
- 이는 파일 이동과 같은 리팩터링에 더 탄력적인 단순한 경로를 작성하는 "단축키"와 같다고 생각할 수 있어요.   


소스 코드     
- 일반적으로 패키지들은 `src` 디렉토리에 소스 코드를 저장
- 이를 컴파일하여 `dist` 디렉토리로 출력해요.   

### 일반적인 함정  

1.TypeScript를 사용하는 경우, 작업 공간의 루트에 `tsconfig.json`이 꼭 필요하지 않을 가능성이 높아요.   
  - 패키지들은 각각 독립적으로 자체 설정을 지정해야 하며, 공용 tsconfig.json을 확장해서 사용.  

2.가능한 한 패키지 경계를 넘어 파일에 접근하는 것은 피하는 것이 좋아요. 
  - 만약 다른 패키지에 접근하기 위해 `../`를 사용하는 것을 발견한다면, 
  - 그 패키지를 필요한 위치에 설치하고 package.json exports 필드에 맞게 가져와야 한다.  


### 예제 뜯어보기  

URL : https://github.com/vercel/turborepo/tree/main/examples/with-nestjs     

1.package.json  

1.1 workspaces 필드를 통해서 하위 워크스페이스를 알수있다.  
- apps에는 web(nextjs), api(nestjs) 2개의 프로젝트가 존재한다.  
- packages에는 api, ui, config 설정들 (eslint, jest, typescript) 가 있다.  
  - typescript 설정도 하나의 package로 뺀것이 신기하다.  
- ui 패키지: turbo gen react-component 명령어가 있는데, 보일러 플레이트 코드와 exports를 추가해주는 귀여운 스크립트이다.  

2.api 패키지 

2.1 dto, entities 등 공통으로 사용하는 TS파일을 별도의 패키지로 분리한것이 맘에 든다.  
2.2 app/web 프로젝트에서 사용하는데, devDependencies로 설치가 되어 있다.  
- 패키지 버전은 "*"라고 명시되어 있는데, 모든 버전을 쓴다는 의미이고 모노래포랑 관계는 없다.  

참고) 
- 모노레포는 심볼릭 링크에 기반하여 작동한다.  
- npm workspaces : 심볼릭 링크를 npm 에게 위임한다.  
- yarn workspaces : symlink 또는 **PnP (Plug’n’Play)**라는 방식을 사용.  
- pnpm workspaces : pnpm은 패키지를 링크할 때 하드 링크 사용.  
  - 하드 링크 : 원본 파일과 하드 링크 파일이 동일한 inode. (하드 링크는 같은 inode 번호를 공유하는 여러 파일 이름)  
  - symlink : 원본 파일과 별개로 다른 inode 생성, 디렉터리도 가능
  - *하드 링크로 연결된 모든 참조가 삭제되어야 디스크에서 파일의 실제 데이터가 정리.  
  - *inode : 파일이름과 inode 번호가 연결된다. 
    - inode에는 디스크 블록에 대한 메타 정보(크기, 권한, 생성일, 하드링크 수, 파일의 데이터가 저장된 블록 번호를 가리키는 포인터 등) 저장    



## 2. Managing dependencies
> Using dependencies for sharing code  


## 3. Creating an internal package
>Make a package in your repository

## 4. Configuring tasks
>Design your task patterns

## 5. Running tasks
>Run tasks as fast as possible

## 6. Caching
>Never do the same work twice

## 7. Developing apps
>Run many apps in parallel

## 8. Using environment variables
>Account for variables in your environment

## 9. Constructing CI
>Ship your applications

## 10. Upgrading
>Upgrading your Turborepo version
