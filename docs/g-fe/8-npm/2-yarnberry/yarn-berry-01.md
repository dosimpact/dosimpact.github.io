---
sidebar_position: 1
---
# Vite + React + TS + Yarn Berry  

- [Vite + React + TS + Yarn Berry](#vite--react--ts--yarn-berry)
  - [Install](#install)
  - [Yarn Berry](#yarn-berry)
  - [Zero Install](#zero-install)
  - [이슈: node\_modules가 자꾸 생기는 이슈(vite)](#이슈-node_modules가-자꾸-생기는-이슈vite)
  - [이슈: yarn berry 설치 후 모듈 찾기 불가능](#이슈-yarn-berry-설치-후-모듈-찾기-불가능)
  - [Ref](#ref)


## Install  

- IDE: VS Code, Node.js 20+  

```
# vite로 프로젝트 생성 
yarn create vite {project name} --template react-ts

# yarn 4.x 버전 사용
yarn set version berry

# 패캐지 설치
yarn
```

## Yarn Berry  

.yarn/cache/: 의존성 패키지들이 압축된 .zip 파일 형태로 저장되는 캐시 디렉터리예요.   
- Yarn 2+에서는 모든 패키지가 .zip 파일로 관리되며, 이 캐시를 사용하여 빠르게 패키지를 로드    

.yarn/plugins/: Yarn의 플러그인들이 저장되는 디렉터리예요.  
- Yarn은 플러그인 기반으로 동작하므로, 추가 기능이 필요할 때 이곳에 플러그인을 설치해요.  

.pnp.cjs 또는 .pnp.js: Plug’n’Play(PnP) 기능을 사용할 때 생성되는 파일
- Node.js의 require 메커니즘을 대체하여 의존성 경로를 관리해요.    
- 이 파일을 통해 Yarn이 의존성 트리를 관리하고 패키지를 찾아요.   

.yarnrc.yml: Yarn의 설정 파일이에요.  
- Yarn의 설정, PnP 여부, 플러그인 목록 등을 정의할 수 있어요.  


## Zero Install  

yarn berry는 node_modules에 수많은 디렉터리를 만드는것 대신에, 의존성관리를 zip파일로 한다.    
- 의존성관리 파일을 모두 github에 올린다면, git clone 만으로도 의존성까지 모두 설치된 상태이다.  

Zero Install : .gitignore 설정만 해주면 된다.  

```
If you're using Zero-Installs:

.yarn/*
!.yarn/cache
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions

If you're not using Zero-Installs:

.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions

```
## 이슈: node_modules가 자꾸 생기는 이슈(vite)  

```
// vite.config.ts
{
  ...,
  cacheDir: './.vite' // 추가
}

// .gitignore
{
  # vite cache
  .vite // 추가
}
```

## 이슈: yarn berry 설치 후 모듈 찾기 불가능  

```js
1.VS Code에 SDK 설치
yarn dlx @yarnpkg/sdks vscode


2.Tyesciprt를 워크스페이스의 버전으로 변경하기. 
- Ctrl + Shift + P
- Select Typescript Version
- Use Workspace Version 클릭

```

## Ref  

https://geekk89.medium.com/vite%EC%99%80-yarn-berry%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EC%84%B8%ED%8C%85-feat-react-653b973cd44a  