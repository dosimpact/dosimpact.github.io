---
sidebar_position: 4
---

# 홈서버 (MacMini) 운용 방법 3

<head>
  <meta name="keywords" content="Mac Server, 맥미니 서버, 운용"/>
</head>


## CodeServer + Nginx + https 설정 방법

---

## code-server에 https를 붙이는 방법

인터넷을 찾아보니 code-server에 https를 붙이기 위해서 `nginx를 앞단에` 두는 방식을 주로 사용했다.    
- MacOS환경에서 brew로 nginx을 설치했다. 
- nginx 설치 경로가 우분투 환경과 다르게 셋업 되었다. 그래서 cerbot 자동 설정(`python3-certbot-nginx`)이 실패..
- 그래서 cerbot 수동설정 및 nginx conf도 직접 설정해서 https 인증서를 발급했다.


크게 code-server에 https를 붙이는 방법은 `2가지다`. (여기서는 1번 방법을 기록)  
1. https 인증서를 nginx에 붙이고, 뒷단에 code-server 두기  
2. code-server에 직접 https 인증서 붙이기   


1번 방법이 좀 더 일반적인 상황에서 사용이 가능하고, cerbot을 이용해서 수동으로 https 인증서를 발급할 예정이다.

<br/>

## 도메인을 붙이면 좋은 이유 

맥미니 서버를 운용하다보면, 각 포트에 여러 서비스를 만들게 된다.
예를들어, 
```
3000 리액트 서버
4000 api 서버
5432 db 서버
5555 redis 서버
8090 jeknins 서버
9009 portainer 서버
```

매번 내 아이피 주소에 포트를 붙여서 접근해도 되지만, 외부에 서비스를 노출할때는 그렇게 하지 않는다. 
도메인을 붙이는것이다. 도메인 example.com을 구매해서 다음처럼 구성이 가능하다.

```
www.example.com -> 3000 리액트 서버
api.example.com -> 4000 api 서버
db.example.com -> 5432 db 서버
cache.example.com -> 5555 redis 서버
jekins.example.com -> 8090 jeknins 서버
ci.example.com -> 9009 portainer 서버
```
<br/>

## Nginx을 홈서버에 쓰는 이유  

1. 도메인 연결 및 https 사용을 하기 위함  
2. code-server 와 같은 맥미니 프로세스와 연동이 가능하다.  
3. docker container 와 연동이 가능하다.  
4. 서브도메인과 포트 매핑이 가능하다.  

```
인바운드 플로우 : 
도메인 주소 접근 > 공인 아이피 > nginx > 프로세스. 
eg) www.domain.com > 123.123.123.123 > nginx 서버 접근 및 라우팅 > code-server 접속. 
eg) db.domain.com > 123.123.123.123 > nginx 서버 접근 및 라우팅 > mysql container 접속. 

*도메인은 공인IP 에 별칭을 붙여주는 것  
*Nginx는 서브도메인과 포트를 매핑시켜주는 것  

```

## 사전 준비

내 아이피 확인하기 
- MY_IP = 123.123.123.123 라고 가정한다.  

도메인 구매하기 (가비아 등)
- 가비아에서 2000원,1년치 도메인을 구매했다.
- MY_DOMAIN = www.my-coding.site 
- 외국 사이트 중 https://www.namecheap.com/ 가 싼것 같다.

공유기 포트포워딩 확인
- 80, 443 포트가 맥서버와 연결되었는지 반드시 확인
