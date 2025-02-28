---
sidebar_position: 13
---

# Postgres


## Container  
```yml
version: "0.2"

services:
  postgres_db:
    image: postgres:13
    container_name: postgres_db
    restart: always
    volumes:
      - ${VOLUME_DIR_POSTGRES}:/var/lib/postgresql/data
    ports:
      - "${PORT_POSTGRES}:5432"
    environment:
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    healthcheck:
      test: pg_isready -U postgres -h localhost
      interval: 5s
      timeout: 5s
      retries: 10
--- 
PREFIX_VOLUME_DIR=***
VOLUME_DIR_POSTGRES=${PREFIX_VOLUME_DIR}/postgres
COMMON_PASSWORD=***
POSTGRES_PASSWORD=${COMMON_PASSWORD}
PORT_REDIS_COMMANDER=6378
```

### Change SuperUser Password    

- 환경변수의 POSTGRES_PASSWORD는 새로운 볼륨이 만들어지는 초기화 단계에서만 유효 
- `docker exec -it my-container bash` bash 접속 후 
- `psql -h localhost -U <username> -W` postgres(기본 슈퍼유저)로 접속하자.  
- 아래 방법으로 비빌번호 리셋  

```
ALTER USER postgres WITH PASSWORD 'newpassword123';
```
