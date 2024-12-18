---
sidebar_position: 2
---

# Docker Compose  


## install docker compose

명령어 바로 복붙 :

```
sudo curl -L "https://github.com/docker/compose/releases/download/v2.2.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
docker-compose -v

```

- 도커 컴포즈 설치 (버전은 원하는 대로 정할 수 있다)
- 최신 버전을 다운 받고 싶을 경우에는 아래 링크에서 최신 버전 확인
  https://github.com/docker/compose/releases

$ sudo chmod +x /usr/local/bin/docker-compose

- 도커 컴포즈에 권한을 설정.

$ sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

- 심볼릭 링크 설정 (설정을 안해주면 아래와 같은 path에러 발생)

$ docker-compose -v

- 설치 된 도커컴포즈 버전 확인


ref : Docker Compose와 버전별 특징 https://meetup.toast.com/posts/277

```sh

# Summary
docker-compose -p code-server-cluster up -d
docker-compose down

# step-1 docker-compose.yml 작성하기  
#   - code-server 3개 정도 만들자. 

---

# step-2 docker-compose 실행

# docker-compose **up** : compose를 실행 
#   -d: 서비스 백그라운드로 실행. (docker run에서의 -d와 같음)
#   --force-recreate: 컨테이너를 지우고 새로 생성.
#   --build: 서비스 시작 전 이미지를 새로 생성
#   -f: 기본으로 제공하는 docker-compose.yml이 아닌 별도의 파일명을 실행할 때 사용

docker-compose -p code-server-cluster up -d

---

# step-3 docker-compose stop, start

# stop, start :  서비스를 멈추거나, 멈춰 있는 서비스를 시작합니다.
docker-compose stop code-server-cluster
docker-compose start

---

# step-4 docker-compose down

# 실행 중인 서비스를 삭제합니다.
# 컨테이너와 네트워크를 삭제하며, 옵션에 따라 볼륨도 같이 삭제할 수 있습니다.

docker-compose down

# options
#     -v, --volume: 볼륨까지 같이 삭제
#         DB 데이터 초기화하는데 용이함
#         모든 설정을 초기화하고 새로 시작하는 데 사용

```