---
sidebar_position: 4
---

# 4.turborepo - prune


모노레포를 구성하면 여러 프로젝트를 담는 형태로 레포가 구성된다.   
도커 파일을 만들게 되면 lock파일을 들고 패키지를 도커 컨테이너 내부에서 install 하도록 작성된다.  
모노레포 구조에서의 문제는 lock파일이 루트에 하나 존재한다.   
워크스페이스의 개별 프로젝트를 빌드하는 도커 입장에서는 쓸모없는 의존성을 많이 알게되고 설치하게 된다.  

그래서 나온것이 prune 기능  
- https://turborepo.com/docs/reference/prune    
- `turborepo prune` 명령어는 모노레포의 특정 패키지(애플리케이션)를 배포 또는 빌드하기 위해 필요한 최소한의 파일과 의존성만을 추출하여 새로운 디렉토리에 생성하는 데 사용.  
- 이는 전체 모노레포를 복사하지 않고 배포 대상만 격리하여 빌드 시간 단축과 Docker 이미지 크기 최소화를 가능하게 합니다.


## 1 turbo prune 문서 요약

워크스페이스의 패키지를 빌드하는 데 필요한 부분적인 모노레포를 생성  
- 기본 출력 : ./out 
  - 내부 패키지의 전체 소스 코드 + pruned lock file    
- `--docker` 옵션 Docker 다중 단계 빌드에 최적화된 출력 구조를 만듭니다. 레이어 캐싱 활용에 유리합니다.  
  - json 폴더: 가지치기된 워크스페이스의 package.json 파일들 포함  
  - full 폴더: 대상 빌드에 필요한 내부 패키지의 전체 소스 코드 포함  
  - 가지치기된 잠금 파일 (예: pnpm-lock.yaml)  


## 2. Dockerfile 예시  

```dockerfile
# ==============================================================================
# 1단계: 빌더 (Builder Stage)
# 의존성 설치 및 앱 빌드를 위한 환경을 설정합니다.
# ==============================================================================
FROM node:20-slim AS builder
WORKDIR /app

# 1. 루트 파일 복사
# 패키지 설치/가지치기에 필요한 기본 파일들만 복사합니다.
COPY package.json pnpm-lock.yaml turbo.json ./
# 모노레포의 소스 코드를 복사합니다. (prune이 필요한 부분만 추출하게 합니다.)
COPY apps apps/
COPY packages packages/

# 터보리포 사용을 위해 pnpm과 turbo를 설치합니다. (npm install -g pnpm을 사용해도 됩니다)
RUN corepack enable && pnpm install turbo --global

# 배포할 앱 이름 설정
ARG APP_NAME=web

# 2. turbo prune 실행 (Docker Layer Caching 최적화)
# 'out' 디렉토리에 pruned된 파일들을 생성합니다.
RUN turbo prune ${APP_NAME} --docker

# --- 의존성 설치 레이어 ---
# prune으로 생성된 pnpm-lock.yaml과 package.json 파일들을 복사하여 의존성을 설치합니다.
# 이 레이어는 의존성이 변경되지 않는 한 캐싱됩니다.
COPY out/pnpm-lock.yaml ./
COPY out/json ./

# pnpm install을 실행하여 필요한 의존성만 설치합니다.
# (루트 package.json에 명시된 모든 개발 의존성 제외)
RUN pnpm install --frozen-lockfile

# --- 소스 코드/빌드 레이어 ---
# 3. 소스 코드 복사
# prune으로 생성된 'full' 디렉토리에는 대상 앱과 내부 종속성의 소스 코드가 포함되어 있습니다.
COPY out/full .

# 4. 앱 빌드
# pnpm filter를 사용하여 대상 앱만 빌드합니다.
RUN pnpm run build --filter=${APP_NAME}...

# ==============================================================================
# 2단계: 런너 (Runner Stage)
# 최종 빌드된 결과만 포함하는 가볍고 안전한 실행 환경을 만듭니다.
# ==============================================================================
FROM node:20-slim AS runner
WORKDIR /app

ARG APP_NAME=web

# 1. 빌드 결과 및 node_modules 복사
# 빌더 단계에서 설치된 프로덕션 의존성과 빌드된 앱 결과물을 복사합니다.
COPY --from=builder /app/node_modules ./node_modules
# 앱의 빌드 결과 디렉토리를 복사합니다. (경로는 앱 유형에 따라 다를 수 있습니다. 예: dist, .next 등)
COPY --from=builder /app/apps/${APP_NAME}/dist ./apps/${APP_NAME}/dist

# 2. 실행 설정
EXPOSE 3000

# 앱 실행 (예시: Express 서버)
CMD ["node", "apps/web/dist/server.js"]
```


📌 추가 트러블 슈팅  
- Docker Cache 문제 : latest 태그를 계속 사용하다보니 기존의 컨테이너가 업데이트가 안된다.    
- 해결 : 배포 버전을 명시하자. + 롤백도 어떤 버전으로 해야 하는지 명확해 진다. ( 배포 version도 git으로 관리 되는 것도 이점 )  