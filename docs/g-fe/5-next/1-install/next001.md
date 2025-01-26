---
sidebar_position: 1
---


# NextJS Install

- [NextJS Install](#nextjs-install)
  - [Goal](#goal)
  - [1.Nextjs 을 시작하는 방법](#1nextjs-을-시작하는-방법)
    - [eg](#eg)
  - [2.Yarn berry로 변경하는 방법](#2yarn-berry로-변경하는-방법)
    - [2.1 백그라운드](#21-백그라운드)
    - [2.2 yarn berry migration](#22-yarn-berry-migration)
  - [3.Radix UI 설치 방법](#3radix-ui-설치-방법)
  - [More config tip](#more-config-tip)
    - [특정 경로를 빌드에서 무시하기](#특정-경로를-빌드에서-무시하기)

## Goal 

- 1.Nextjs 을 시작하는 방법    
- 2.Yarn berry로 변경하는 방법  
- 3.Radix UI 설치 방법  

## 1.Nextjs 을 시작하는 방법 

>docs : https://nextjs.org/docs/pages/api-reference/create-next-app

```
# npm
npx create-next-app@latest  
# yarn
yarn create next-app  
```

### eg

```
 npx create-next-app@latest next-13-crash
✔ Would you like to use TypeScript? … No / Yes
✔ Would you like to use ESLint? … No / Yes
✔ Would you like to use Tailwind CSS? … No / Yes
✔ Would you like to use `src/` directory? … No / Yes
✔ Would you like to use App Router? (recommended) … No / Yes
✔ Would you like to customize the default import alias? … No / Yes
✔ What import alias would you like configured? … @/*
Creating a new Next.js app in /Users/dosimpact/workspace/project/lectures_web/3.Next/lectures/next-13-crash.
```


## 2.Yarn berry로 변경하는 방법  

### 2.1 백그라운드

📌 npm install yarn -g 을 이용해서 설치하면 yarn은 최신버전이 아니다.     
- yarn -v // 1.22.19  
- 1.xx 버전을 유지하는 이유는 기존 생태계의 호환성을 위해서이다.  
- 최신버전으로 업데이트하면 완전 다른 인터페이스를 보게될 것이다.  

📌 모듈을 설치하는 3가지 방식   

Install modes  
- nodeLinker: pnp : Plug'n'Play 이며, node_modules를 생성하지 않는다.  
- nodeLinker: pnpm : yarn과 유사한 방식의 패키지 매니저의 방식    
- nodeLinker: node-modules : node_modules를 만드는 일반적인 방식   

📌 zero install  
1.yarn의 pnp를 사용한다.    
2.pnp를 git으로 버전관리하여, 의존성 모듈을 깃허브에 올린다.  
- 따라서 git clone 만으로도 의존성 모듈이 따라온다.   

📌 yarn v4 을 사용하면 좋은 점  
- 새로운 기능 : workspace, zero install  
- 모듈 설치 방식 3가지 지원, 커스터마이징 플러그인

### 2.2 yarn berry migration  

- yarn create next-app 을 통해 생성한 프로젝트이다.  
- yarn berry로 마이그레이션 해보자.  

```
# 최신버전의 yarn(berry) 사용 설정
yarn set version stable

# 버전 확인 - 4.0.2
yarn -v

# 패키지 설치
yarn
# package.json에  "packageManager": "yarn@4.0.2" 가 추가된다.
# .yarnrc.yml 파일이 추가되며, nodeLinker: node-modules 가 기본설정이다. 

# 개발모드로 띄워보기
yarn dev

---
# .gitignore 에 추가
.yarn/*
!.yarn/cache
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions

---
# Plug'n'Play 전환
# .yarnrc.yml 파일에서, nodeLinker: pnp로 변경
# 패키지 다시설치
yarn

# 개발모드로 띄워보기
yarn dev
```

- Release: Yarn 4.0 🪄⚗️ https://yarnpkg.com/blog/release/4.0
- 🚀 next.js 를 yarn berry와 typescript로 시작해버리기 : https://velog.io/@creco/next.js-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0   



## 3.Radix UI 설치 방법  

3.1 install : https://ui.shadcn.com/docs/installation/next
3.2 dark mode : https://ui.shadcn.com/docs/dark-mode/next

요약 
```js

// Install and configure Next.js. https://ui.shadcn.com/docs/installation/next
npx shadcn@latest init
npx shadcn@latest add button

// Dark mode. https://ui.shadcn.com/docs/dark-mode/next
yarn add next-themes

// theme provider 컴포넌트 코드 넣기  
// 다크 모드 토글 컴포넌트 넣기  

```


## More config tip  

### 특정 경로를 빌드에서 무시하기  


만약에 supabase 서브디렉터리가 있고, 이는 nextjs와 무관하다면 이를 빌드 싸이클에서 제외해야 한다.  
- tsconfig, next build 모두 설정해야 한다.  
- 모노래포로 만들어도 좋을것 같다.  

```js
#
yarn add ignore-loader

# tsconfig.json
  "exclude": ["node_modules","supabase"]

# next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /$\/supabase\/.*/, // 'supabase' 폴더 및 하위 경로를 무시하도록 정규식 지정
      use: "ignore-loader",
    });
    return config;
  },
};

export default nextConfig;
```
주의 
- `test: /supabase\/.*/,`  -> @supabase/ssr 과 같은 모듈의 경로도 무시하는 패턴이다.  
- `test: /^\/supabase\/.*/,` -> ignore-loader가 supabase라는  경로로 시작하는 모듈의 경우를 무시한다.  
  - 다행이도 @supabase라는 네임스페이스 때문에 의존성을 사용할 수 있다.  
