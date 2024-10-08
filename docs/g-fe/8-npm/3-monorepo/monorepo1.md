---
sidebar_position: 2
---

# Monorepo 기본 원리  

- [Monorepo 기본 원리](#monorepo-기본-원리)
  - [About Monorepo](#about-monorepo)
  - [원리1. 모듈 탐색](#원리1-모듈-탐색)
  - [원리2. Symlink](#원리2-symlink)
    - [yarn 에서 사용하는 방법](#yarn-에서-사용하는-방법)
  - [About Workspaces](#about-workspaces)
  - [yarn v1 으로 모노레포 만들기 실습](#yarn-v1-으로-모노레포-만들기-실습)
    - [1.모노레포 설정](#1모노레포-설정)
    - [2.호이스팅](#2호이스팅)
    - [3.script(bin)](#3scriptbin)
    - [4.cwd 변경없이 script실행하기](#4cwd-변경없이-script실행하기)
    - [5.다른 모노레포 툴](#5다른-모노레포-툴)
  - [yarn lerna 으로 모노레포 만들기 실습](#yarn-lerna-으로-모노레포-만들기-실습)
  - [refs](#refs)


## About Monorepo  

쉽게 생각해보자. 기존에 node프로젝트는 npm install을 통해 외부의 라이브러리를 설치한다.  
- 그러나 나의 프로젝트의 변경에 따라 이러한 의존성이 있는 패키지가 자주 업데이트 된다면,  
- 내 프로젝트 + 외부 라이브러리까지 하나의 래포에서 관리하면 좋다.  
- 이것이 모노래포의 기본 개념이다.  


모노레포를 만들때는 목적을 잘 생각해야 한다.    
- 2가지의 목적을 생각하자. 다른 프로젝트에 넣을 라이브러리 래포, 다른 하나는 서비스목적의 프로젝트 레포가 있다.   
- 조합: 라이브러리 + 라이브러리 ...  > 라이브러리 템플릿을 바탕으로 다수의 라이브러리를 개발 목적하는데 좋다.        
- 조합: 라이브러리 n개 + 서비스폴더 1개 > 서비스 규모가 커서, 라이브러리를 바탕으로 개발 프레임워크를 만드는 목적    
- 조합: 서비스폴더 + 서비스폴더 ... > 마이크로 프론트 엔드처럼 여러개의 서비스가 하나의 서비스로 통합이 되어야 하는 상황    


## 원리1. 모듈 탐색  

모듈 import의 상대경로 : ../../module-a.js   
모듈 import의 절대경로 : /root/User/module-b.js  
특별한 절대경로 : import "lodash" -> node_modules를 탐색한다.  
- 여기서 중요한 포인트!!  
- 호출 모듈 기준으로 parent-folder를 쭉 올라가며 node_modules에서 모듈을 가져오려고 한다. 
- 만약에 없다라면 더 상위 폴더로 가서 node_modules를 찾는다. 이것이 모노레포의 트릭으로 사용 된다.  

```js
// 아래 예시는 node_modules라는 폴더명을 사용했을때, module-a/index.js에서 module-b의 index.js에 접근함을 보여준다.  
// node_modules 대신 packages라고 폴더를 바꾸면 접근하지 못한다.
// ref: https://github.com/robdonn/monorepo-beginners
.
└── node_modules
    ├── module-a
    │   └── index.js
    └── module-b
        └── index.js
---
// index.js
console.log("module-a");
require("module-b");
---
// index.js
console.log("module-b");
---
module-a
module-b
```

## 원리2. Symlink

Symlink 는 심볼릭링크, 바로가기 이다.  
- Npm, yarn 모두 사용 가능하다.  
- 위에서 node_modules대신 packages라는 폴더를 사용해서 모듈을 import하도록 바꾸자.  

```js
// ref: https://github.com/robdonn/monorepo-beginners
.
└──packages
    ├── module-a
    │   └── index.js
    └── module-b
        └── index.js
---
// module-a/index.js
// yarn init -y
// /module-a> yarn link : 전역 symlinked패키지로 등록하는 과정이다.  
console.log("module-a");
require("module-b");
---
// module-b/index.js
// /module-b > yarn link module-b : 위에서 등록한 전역 바로가기 링크를 불러온다.   
// 그 결과로 node_modules폴더가 생기고. 마치 module-b가 있는것처럼 폴더도 생겼다. 하지만 이는 바로가기 링크로 설정되어 있다.   
console.log("module-b");
---
module-a
module-b
```

### yarn 에서 사용하는 방법

```js
시나리오  
- 라이브러리를 개발하고 있다. 데모 프로젝트를 하나 만들어서 테스트를 하고 싶은 상황이다.  
- 데모 프로젝트는 별도의 package.json을 가져야 하며, 라이브러리 패키지의 빌드 결과물을 참조해야 한다.  

yarn link를 통해서 다른 폴더(패키지)를 참조할 수 있다.     

# 1.Symlink 생성 (글로벌 Yarn 링크로 생성)  
cd path/to/your/package
yarn link

# 2.Symlink 사용  
cd path/to/your/other/project
yarn link "@dosimpact/axios-error" # your package.json > name  


```

![Alt text](image.png)

## About Workspaces  

Workspaces 는 아래와 같은 조건  
- 단일 저장소 안에 여러 패키지들간에 의존성을 만들 수 있다.  
- 하나의 명령어로 모든 작업이 가능하다.  
- 호이스팅이라는 시스템으로 최적화 되어 관리가능하다.  

## yarn v1 으로 모노레포 만들기 실습  

### 1.모노레포 설정
- 루트 : package.json 있어야 한다.   
  - private:true 이어야 한다.   
  - 하위 packages 경로를 표시해야 한다.   
- 하위 packages/module-a 에도 각각 package.json이 존재 해야 한다.  
- yarn install로 symlink를 만들어야 한다.    


### 2.호이스팅   
- module-a/에서 lodash를 설치하면   
- module-b/에서 lodash를 사용할 수 있다.    
- 왜냐하면 root 모듈로 호이스팅(심링크)되기 때문이다.  
- 이를 막기 위해서 옵션이 있다. nohoist   


```json
  "workspaces": {
    "packages": [
      "packages/*"
    ],
    "nohoist": [
      "**/lodash"
    ]
  },
```

### 3.script(bin)    

- packages/module 들 뿐 아니라, 모듈안에서 정의된 bin까지도 호이스팅 된다. 

```js
// packages/module-b/package.json
// - mdb라는 명령어는 index.js를 실행시킨다.  
{
  "name": "module-b",
  "main": "index.js",
  "bin":{
    "mdb":"./index.js"
  }
}
---
// 단 "#!/usr/bin/env node" 부분이 없다면 쉘스크립트로 실행하기 때문에 이를 node로 실행시키도록 하자.  
// packages/module-b/index.js

#!/usr/bin/env node
console.log("module-b");
---
// 루트로 돌아와서 아래 명령어를 수행하면, 루트 node_modules에 .bin/mdb의 심볼링 링크가 걸린것을 볼 수 있다.  
yarn install --force

// 그러면 이제 yarn mdb 명령어를 어디든 사용할 수 있다. 
---
//package.json
{
  "name": "004-modules",
  "main": "index.js",
  "private": true,
  "workspaces":{
    "packages": [
      "packages/*"
    ],
    "nohoist": [
      "**/lodash"
    ]
  },
  "scripts": {
    "start": "module-b"
  }
}
---
// packages/module-a/package.json
{
  "name": "module-a",
  "main": "index.js",
  "scripts": {
    "start": "mdb"
  }
}

```



### 4.cwd 변경없이 script실행하기  

- 여러 packages가 있다면 매번 하위 디렉터리로 가서 yarn build, yarn add 등의 명령어를 해야 한다.  
- 이것이 불편하면 yarn workspace "packages-name" 을 이용하면 된다.  

```
// 현재 디렉터리 상관없이 작동한다. module-a 에서 yarn build 와 동일한 효과
yarn workspace module-a build
// 현재 디렉터리 상관없이 작동한다. module-a 에서 yarn add react 와 동일한 효과  
yarn workspace module-a add react  
```


### 5.다른 모노레포 툴  

- pnpm, nx, turbo repo, yarn lerna  


## yarn lerna 으로 모노레포 만들기 실습  

>>https://lerna.js.org/  

lerna를 사용하면 모노레포에서 사용하는 여러 명령어들을 커버할 수 있다.    
- 예, 모노레포의 모든 패키지를 Build 하고 일괄 버전업 이후 publish 하기  
- 하위 모듈들 모두 @을 이용해서 스코핑 하기   
- import도 업데이트 하기   
- 하위 모듈에서 dependiencies 업데이트하기    
  - publishConfig:{ "access":"public" }  

```
yarn add lerna -D   // lerna 설치 반드시 -D

yarn lerna init // lerna.json 파일 생성됨 
- packages 대신 useWorkspaces 으로 package.json의 설정을 따르도록 한다. 
- version:"1.0.0" 혹은 "independent" > 하위 모듈들에 대한 독립적인 버전 설정  

yarn lerna run build  // 하위 모듈에 script:build가 있는 경우만 동작한다.  
yarn lerna run build --parallel  // 병렬로 모두 실행  

npm login // 로그인 확인하기  

yarn lerna publish // 배포하기  

```

## refs  

https://d2.naver.com/helloworld/7553804#ch4
https://d2.naver.com/helloworld/0923884

강의
https://coupang.udemy.com/course/monorepos-a-beginners-guide/learn/lecture/23143290#overview
https://github.com/robdonn/monorepo-beginners/blob/module-3/end/package.json

yarn berry
https://toss.tech/article/node-modules-and-yarn-berry