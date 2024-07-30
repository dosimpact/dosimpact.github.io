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

### 의존성 설치  

- (공통의존성) 모든 모노 래포가 공통으로 참조하는 의존성이 있을 수 있다.   
- (개별의존성) 모노 래포의 일부만 의존하는 경우도 있다.    

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

