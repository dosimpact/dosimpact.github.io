---
sidebar_position: 2
---

# Docker File    


```Dockerfile
FROM 이미지
MAINTAINER 관리자이름

ARG PROFILE : 빌드동안 살아있는 환경변수, 이미지 박히는 변수 --build-arg로 설정 가능

ENV NODE_ENV production : 환경변수, 컨테이너 실행마다 다르게 줄 수 있다.  -e 옵션으로 주입가능
ENV HOME /workspace/app : 

WORKDIR $HOME : (위 환경변수 사용), 컨테이너 접속시 기본 경로 셋팅 
COPY . $HOME : 로컬머신파일 > 도커파일로 파일 복사

RUN 도커 빌드시 실행시킬 스크립트

EXPOSE 3000 - 포트

CMD ["npm","start"] 컨테이너 생성시 기본 명령어, docker run 커맨드에서 덮어쓰기 가능
```

## eg) 1

```Dockerfile
FROM node:14

WORKDIR /app

COPY package.json .
COPY . .

RUN npm install

EXPOSE 3000
CMD [ "node", "app.mjs" ]
```
## eg) 2

```Dockerfile
FROM python:3.10.8

WORKDIR /app
ADD ./ /app

RUN pip install -r ./requirements.txt

CMD ["python","main.py"]
```

# Command