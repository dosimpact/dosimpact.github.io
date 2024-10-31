---
sidebar_position: 2
---

# Docker Command  

```md
## 버전 확인 및 헬로 월드

docker version
docker -v
docker run hello-world


# 이미지

docker image ls # 이미지리스트 출력
docker system df # 이미지 및 디스크 사용량
docker image inspect nginx # 이미지 정보 출력

docker pull ubuntu # 가져오기
docker push <사용자이름>/<이미지이름>:<태그> # 이미지 푸쉬 ( 이미지 이름 입력 )

docker search python #검색
docker image prune # 사용하지 않는 모든 image 삭제
docker image rm nginx # 제거
docker rim 이미지 아이디 # 제거
docker image rm -f $(docker image ls -q)  #  모든 이미지 제거


# 현재 실행중인 컨테이너 및 모든 컨테이너

docker ps
docker ps -a ( docker container ps -a 줄임말 )





# 컨테이너 ( nginx | centos | 우분투 실행 )

-d 백그라운드 실행 ( 생성 옵션 | 도커 시작하고, 필요하다면 attach로 bash 들어가는 방법)
-a attach도 같이 한다.
-p 포트설정 ( 기본 로그 출력에다, cmd 상으로도 입출력을 연결하는듯 , 생성 옵션 <외부>:<내부>)
-it 인터렉티브 터미널 ( -i (input pipe) , -t ( TTY support ) )
    • https://stackoverflow.com/questions/43099116/error-the-input-device-is-not-a-tty 
-e 환경변수 설정 실행 ( 생성 옵션 )
--rm 컨테이너 실행 후 종료시 바로 삭제
--name 컨테이너 이름 설정

    eg) 1회용
        docker run --rm -it --name node_web node:16 bash
    eg) 백그라운드 러닝
        docker run -itd --name node_web node:16 
        

docker pull nginx #이미지 다운
docker image ls #확인
docker container rename webserver nginxserver # 컨테이너 이름 변경


docker run | create | start | stop | kill <dockerImageName> <command>
*run = create && start 이다.
*kill 바로 종료, stop 은 작업중인것 마져 하고 종료

---nginx
docker run --name webserver -d -p 6080:80 nginx # 컨테이너 생성 및 실행
docker start webserver # 컨테이너 실행 ( 이미 만들어진 )
docker stop webserver # 컨테이너 중지
docker rm webserver  # 컨테이너 삭제


---centos
docker container run -it --name "test1" centos /bin/cal

docker run -it --name "test2" centos /bin/bash


---ubuntu
docker container run ubuntu:lastest /bin/echo 'hello world'

docker container run -it --name "ubuntush" ubuntu bash

docker run -itd --name ubsh ubuntu bash


# 컨테이너 all rm

docker rm `docker ps -aq `


# 컨테이너 rename
docker rename origin_name chagned_name


# 컨테이너 attach detacㄹh

docker start|stop NAME
docker attach
컨트롤P,컨트롤Q > 빠져나오기

docker logs [ container ID ]


# 컨테이너 exec
*컨테이너에 명령어 전달하기
docker exec -it ub /bin/cat /etc/hosts
docker exec -it ub /bin/echo "hello"

*도커 쉘 실행하기
docker exec -it postgres /bin/bash

eg) docker exec -it redis_back redis-cli -a password
>ping


# 컨테이너 update

# docker update --restart=always <container> 
docker update --restart=always TestContainer

# 컨테이너 port

docker port test2 #  80/tcp -> 0.0.0.0:4444 포트 정보 출력된다. ( -p 4444:80 연결된 모습 )

# 컨테이너 cp:file copy

docker cp ./a.txt  origin:/  # 명령어 : docker cp [클라이언트 path]   [컨테이너]:[path]
docker cp origin:/a.txt   ./  # 반대로도 가능


# 정리
docker system prune # 사용하지않는 컨테이너,이미지,네트워크 제거
    - disk 용량 오류가 발생할 때,


# 로그인

docker login
docker logout


# 이미지 빌드

# 이미지 이름의 관행 <저장소이름>/<이미지이름>:버전

docker build -t ehdudtkatka/blockcrawl:0.2 .
docker run -it -p 3001:80 --name webserver_2 webserver_2:0.0.1

# 이미지 Push 

docker tag blockcrawl_back:0.2 ehdudtkatka/blockcrawl:0.2 # 이미지 이름에 내 아이디가 들어가도록 바꾸어야한다.
docker push ehdudtkatka/blockcrawl:0.2 # 그리고 push


https://www.lainyzine.com/ko/article/how-to-remove-all-docker-contaniers-and-images/
```