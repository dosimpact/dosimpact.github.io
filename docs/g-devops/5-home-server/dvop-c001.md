---
sidebar_position: 2
---

# 홈서버 (MacMini) 운용 방법 1

<head>
  <meta name="keywords" content="Mac Server, 맥미니 서버, 운용"/>
</head>


## 문제 정의
---

AWS 서버비용은 비싸다. 취미 혹은 개인용 서버로 사용하기에는 Mac Mini 혹은 라즈베리파이로도 충분하다.
- 처음에는 라즈베리 파이로 시작했지만, AWS 프리티어보다 높은 성능임에도 뭔가 아쉬웠다.
- M1맥북에 익숙해서 M1급칩의 개발환경이어야 나만의 서버가 사랑스럽고, 빠르다고 느꼈다.

<br/>

## 맥미니 서버 어떻게 해야 잘 활용할까?

---

### Code Server 개발환경 

사실 코드 서버 하나만 배포해도 충분히 취미용 개발 서버로 그 역할을 다 한다.   
실사용 후기는 정말정말 만족하고 좋다. AWS 프리티어와 비교도 안된다.   

![](./img/sc001.png)
`위 처럼 Web에서 언제 어디서나 접속이 가능한 나만의 Cloud IDE를 구축하고자 한다.`


Node.JS 관련 코딩 연습
- Javascript, React, NextJS, NestJS 등등 node.js 런타임이면 모두 개발과 동시에 포트를 열어서 실시간 확인이 가능하다.  
- 하지만 실서비스 배포는 가능하나 개발환경과 운용환경이 섞이는건 썩 좋지 않다.  


<br/>

### Docker 컨테이너 환경 구축

MySQL, PostgreSQL, Redis 등 각종 컨테이너들을 올려서 개발환경을 구축하고 있다.    
어떤 컨테이너를 사용하고 있는지 잠깐 보여드리면 아래와 같다.  

```
docker ps

7680119bcdca   mongo-express:latest                    "tini -- /docker-ent…"   4 months ago   
3caa96d61ed7   mongo:4.0.4                             "docker-entrypoint.s…"   4 months ago   
449b8f0710d7   portainer/portainer-ce                  "/portainer"             4 months ago   
79e49d8768ca   mysql:8.0.32                            "docker-entrypoint.s…"   4 months ago   
d78b865d9be1   m1macmini-jenkins-docker                "/usr/bin/tini -- /u…"   4 months ago   
77b2f22d1a7b   postgres:13                             "docker-entrypoint.s…"   4 months ago   
e2b69459e61c   rediscommander/redis-commander:latest   "/usr/bin/dumb-init …"   4 months ago   
ec347468f5cc   redis:latest                            "docker-entrypoint.s…"   4 months ago   
69b13440da19   redis:latest                            "docker-entrypoint.s…"   4 months ago   
```

<br/>

### 부팅시 자동으로 켜지는 프로세스

크게 3가지의 서비스를 사용중이다.  
일부는 brew 를 이용해서 관리하고 docker 같은 경우에는 dockerDesktop을 이용하면 부팅시 자동으로 실행된다.  
- 1. code-server by brew services
- 2. nginx by brew services
- 3. docker by DockerDesktop

