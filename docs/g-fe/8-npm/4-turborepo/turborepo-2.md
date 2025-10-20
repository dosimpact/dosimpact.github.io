---
sidebar_position: 2
---

# eg - Monorepo Turborepo   

## Goal  

Yarn Berry(pnp) + TurboRepo 으로 모노레포 구성.  
- 비즈니스 프로젝트 : api Server(nest.js) / DA Server(python) / admin web(next.js) / service web(next.js)     
- FE,BE 공용 Typescript 관리     

### 모노 레포 사용 이유. 
장점
- 1.저장소 생성 → boilerplate 코드 생성 및 디렉터리 구조 확립 → ESLint 및 Prettier 같은 개발 관련 툴 설정 → CI/CD 설정 → npm registry 에 publish  
- ㄴ위와같은 초기 프로젝트 설정을 스킵할 수 있다.  
- 2.공용 TS파일, 라이브러리 npm Registry등록 -> 의존하는 프로젝트 모두 다시 빌드  
- ㄴ여러 프로젝트들이 공유하는 의존성을 쉽게 관리할 수 있다. 

단점
- 기존의 Git-flow 방식 대신,  Trunk-based workflow 같은 새로운 버전 관리 방식 ( 피처 플래그 사용, Test Code )

*yarn workspace + turborepo 사용이유

1.yarn workspace > 의존성 관리. 
2.turborepo > 의존성 외, 모노 래포의 전반적 관리. 
1.캐시 빌드 최적화 / 원격 캐싱  
2.병렬 작업 처리
3.의존성 그래프 분석
4.워크플로 파이프 라인




## install  

### vscode extensions
- yarn
- eslint
- prettier  
- (zipFS)  

### Guide  

워크스페이스 추가 방법 = 일반 프로젝트 만드는것이랑 같다.  
- yarn create next-app 과 같은 명령어를 그대로 사용해도 좋다.  

```sh
#  
git init
yarn init -y
# yarn 2.x 이상 사용  
yarn set version berry
# yarn berry pnp sdk 설치하기
yarn dlx @yarnpkg/sdks vscode
(Typescript 버전을 workspace에 맞추기 - (모듈검색오류))


# app 디렉터리의 프로젝트 추가
cd ./apps
yarn create next-app nextjs-admin --typescript --eslint
yarn create next-app nextjs-client --typescript --eslint
(workspace path 업데이트) <folder이름>.code-worspace.json   

# packages에 리액트+Storybook 프로젝트 추가  
cd ./packages
yarn create react-app storybook --template typescript --use-pnp
yarn add @testing-library/jest-dom
yarn add -D @types/testing-library__jest-dom
(workspace path 업데이트) <folder이름>.code-worspace.json   

yarn dlx sb init
yarn dlx -p @storybook/cli sb init
yarn add -D @babel/preset-env
yarn add -D @babel/core babel-loader @babel/preset-react @babel/preset-typescript
(?뭔가 의존성이 node_modules로 설치되었다. 누락된 의존성을 다시 설치하자. )

(in Root)
yarn add -D lint-staged
yarn add -D husky
yarn husky install
```

## turbo 주요 명령어  
npx turbo link
turbo run [script-name] --filter=[workspace-name]

## yarn workspace 주요 명령어  
yarn workspace [workspace-name] add [package-name] [--options]  
yarn workspace storybook add -D @types/testing-library__jest-dom



## Ref  
https://medium.com/@yoontopia94/yarn-workspaces-turborepo-%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-monorepo-%EA%B5%AC%EC%B6%95%EA%B8%B0-part-2-517df6de204

