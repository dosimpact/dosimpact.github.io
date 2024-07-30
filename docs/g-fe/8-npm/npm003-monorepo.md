---
sidebar_position: 3
---

# Monorepo 2


## Goal  

MonoRepo 환경을 구성합니다.  
- 다수의 라이브러리 패키지를 관리하여 이는 npm publish가 되어야 합니다.  
- Yarn : 패키지간의 의존성은 yarn workspace를 이용해서 관리합니다. (의존성)   
- Lerna 패키지의 배포 및 병렬 수행등의 Task는 Lerna을 이용해서 관리합니다. (빌드,배포)   

## Problem  

Admin Page, API Server, Batch 프로젝트가 있습니다.   
- 이들이 공통으로 사용하는 entity 가 있는데 이를 공유하고 싶은 니즈가 있습니다.   
- npm 저장소에 올리기에는 실시간성이 떨어지며 오히려 관리비용이 더 늘어납니다.   
- 파일복사를 해서 쓰기에는 유지보수가 힘듭니다.    

그래서 단일 저장소에 여러 프로젝트를 관리하여 때로는 공통모듈도 관리할 수 있는 방식이 있습니다.   

Lerna와 Yarn Workspace를 조합해서 사용할 수 있습니다.  
- Lerna : 각 패키지들을 배포, 버전을 관리  
- Yarn : 패키지들간의 의존성을 관리  
- *lerna로도 의존성 관리가 가능하지만 yarn 으로 하는것이 더 좋다.  

## Background  

### 0. 의존성 설치  

- (공통의존성) 모든 모노 래포가 공통으로 참조하는 의존성이 있을 수 있다.   
- (개별의존성) 모노 래포의 일부만 의존하는 경우도 있다.    

### 1. **Yarn에서 node_modules로 패키지를 관리하는 것과 PnP로 관리하는 것의 정의 및 차이점**

   - **node_modules**: 전통적인 방식으로, 패키지들이 프로젝트 내의 `node_modules` 폴더에 설치됩니다. 이 방식은 Node.js와 대부분의 JavaScript 도구들이 기본적으로 지원하며, 모든 의존성이 명확하게 폴더 구조로 나타납니다. 장점으로는 호환성이 뛰어나며, 대부분의 IDE와 도구들이 별도의 설정 없이 바로 사용할 수 있다는 점이 있습니다. 그러나 파일 시스템 의존성이 크고, 많은 파일이 생성되어 프로젝트가 무거워질 수 있습니다.

   - **Plug'n'Play (PnP)**: Yarn의 최신 방식으로, 패키지들이 `node_modules` 폴더 없이 글로벌 스토어에 저장됩니다. 대신 각 프로젝트에는 의존성 목록을 포함하는 단일 로더 파일이 생성됩니다. 이는 패키지 접근을 더 빠르게 하고, '유령 의존성(ghost dependencies)' 문제를 방지합니다. PnP는 설치 속도가 빠르고, 의존성 오류를 더 명확하게 알려주며, 불필요한 파일 복사를 없앱니다. 하지만 일부 도구나 IDE는 별도의 설정이 필요할 수 있습니다.

### 2. **Yarn의 Zero-Install 원리**

   Yarn의 Zero-Install은 프로젝트를 클론할 때 이미 모든 패키지가 설치된 상태로 만드는 방식입니다. 이를 위해 의존성 캐시와 `.yarn` 폴더를 버전에 포함시키는 방식으로, 새로운 환경에서 `yarn install` 명령어를 실행하지 않아도 됩니다. Zero-Install을 사용하면 설치 시간이 크게 줄어들고, 모든 개발자가 동일한 환경을 사용할 수 있어 일관성이 높아집니다. 그러나 캐시와 `.yarn` 폴더를 저장소에 포함시키기 때문에 저장소의 크기가 커질 수 있습니다【6†source】【9†source】.





## Install

```js
# 필요한 전연 모듈 설치  
npm install -g yarn
npm install -g lerna
---

# lerna를 이용해서 패키지를 초기화 합니다.   
lerna init --independent
lerna create axios-error -y  
lerna create useCustomEvent -y
---

# yarn v1.x 에서 v4로 변경합니다.  
yarn set version stable
yarn install  

// (yarn add @types/jest jest --dev --ignore-workspace-root-check
// yarn workspace order-log add chalk --dev 
// yarn link order-base)

---
yarn workspace 주요 명령어  
1.특정 워크스페이스 명령어  
yarn workspace my-app add lodash
yarn workspace my-app add lodash -D
yarn workspaces @dosimpact/use-custom-event run publish  

2.전체 워크스페이스 명령어
yarn workspaces foreach --all -pt run lint
yarn workspaces foreach --all -pt run build
// --parallel (여러 작업을 동시에), --topological (종속성 그래프의 순서에 따라 )

// 특정 워크스페이스만 명령어 수행하기  
yarn workspaces foreach --from @dosimpact/use-custom-event -R run publish
// yarn workspaces focus my-app

---
VSCode typescript 이슈 해결 / https://xionwcfm.tistory.com/343  

yarn remove typescript
yarn add typescript@5.0.2
yarn dlx @yarnpkg/sdks vscode
```

## ref

- yarn workspace typescript 이슈 해결 : https://xionwcfm.tistory.com/343   
- yarn-workspace를 활용한 Mono Repo (Typescript & Jest) 환경 구성하기 https://jojoldu.tistory.com/585

