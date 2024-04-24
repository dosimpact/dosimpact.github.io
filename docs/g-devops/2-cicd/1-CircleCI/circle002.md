---
sidebar_position: 2
---

# CircleCI 개념/용어  

Circle CI는 k8s 클라우드 기반의 CI 플랫폼이다.  
- 프로젝트 단위로 구성된다.
- 프로젝트 하위 .circle/config.yml 파일로 구성한다.  

## 용어 

Project : github저장소 이름과 동일하게 circle ci 파이프라인을 구성한다.  
Workflow : 여러개의 Job으로 구성된다.  
- workflows는 평행하게 작업이 가능하다.  
- 예) dev존 빌드 워크 플로우, prod존 빌드 워크 플로우   
- https://circleci.com/docs/workflows/  
Job : 하나 이상의 step의 조합이다.  
- Job은 가상 머신 혹은 새로운 컨테이너 단위로 실행 된다.  
- Job은 Parallel 혹은 Sequential 하게 구성할 수 있다.  
- 예) node.js 설치 단계 > node.js 이미지 빌드단계 >  
- https://circleci.com/docs/jobs-steps/

Executor
- Executor는 Docker 컨테이너 또는 Linux, Windows 또는 macOS를 실행하는 가상 머신이 될 수 있습니다.  
- Executor는 각 Job마다 할당된다.  
- Executor에는 여러개의 도커 이미지를 올릴 수 있지만, 첫번째 컨테이너가 메인이고 나머지는 보조이다.  



```yml

version: 2.1
executors:
  node-executor:
    docker:
      - image: circleci/node:latest
        environment:
          DATABASE_URL: postgresql://root@localhost:5432/test_db
      - image: circleci/postgres:latest
        environment:
          POSTGRES_USER: root
          POSTGRES_DB: test_db
jobs:
  install-dependencies:
    executor: node-executor
    steps:
      - checkout
      - run: npm install
  test:
    executor: node-executor
    steps:
      - checkout
      - run: npm test
workflows:
  version: 2
  build-and-test:
    jobs:
      - install-dependencies
      - test:
          requires:
            - install-dependencies

```