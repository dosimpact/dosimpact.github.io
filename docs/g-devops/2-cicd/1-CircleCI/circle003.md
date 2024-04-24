---
sidebar_position: 3
---

# CircleCI run in local   

## install 

If you are using Homebrew  with macOS, you can install the CLI with the following command:  
```brew install circleci```  

If you already have Docker for Mac installed, you can use this command instead:  
```brew install --ignore-dependencies circleci```  

## what is diff circleci/node vs  node

circleci/node 이미지는 다음과 같은 추가 기능을 제공합니다   
- SSH 접속: 디버깅을 위해 컨테이너에 SSH로 접속할 수 있습니다.  
- 사용자 권한: circleci 사용자가 기본적으로 sudo 권한을 가지고 있어, 컨테이너 내에서 필요한 패키지를 쉽게 설치할 수 있습니다.  
- CircleCI 관련 도구: CircleCI 작업을 실행하고 디버깅하는 데 필요한 도구가 포함되어 있습니다.  


## steps 단계에서 서버를 실행시켜도 다음 단계로 넘어갈 수 있는가 ?  

- Yes, background 실행이 가능하다.  

```yml
version: 2.1
executors:
  node-executor:
    docker:
      - image: circleci/node:latest
jobs:
  build-and-run:
    executor: node-executor
    steps:
      - checkout
      - run:
          name: Install Dependencies
          command: npm install
      - run:
          name: Build
          command: npm run build
      - run:
          name: Run Server
          command: npm start
          background: true
  e2e-tests:
    executor: node-executor
    steps:
      - checkout
      - run:
          name: Install Dependencies
          command: npm install
      - run:
          name: Run E2E Tests
          command: npx cypress run
workflows:
  version: 2
  build-run-and-test-workflow:
    jobs:
      - build-and-run
      - e2e-tests:
          requires:
            - build-and-run
```


## ref  
https://circleci.com/docs/local-cli/#macos-install-with-homebrew  