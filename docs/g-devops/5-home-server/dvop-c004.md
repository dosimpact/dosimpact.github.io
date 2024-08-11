---
sidebar_position: 4
---

# 홈서버 (MacMini) 운용 방법 4

<head>
  <meta name="keywords" content="Mac Server, 맥미니 서버, 운용"/>
</head>

---

- [홈서버 (MacMini) 운용 방법 4](#홈서버-macmini-운용-방법-4)
  - [Nginx으로 CodeServer에 https 붙이기](#nginx으로-codeserver에-https-붙이기)
  - [1. nginx 설치](#1-nginx-설치)
    - [80 포트로 변경해서 nginx접근이 되는지 확인](#80-포트로-변경해서-nginx접근이-되는지-확인)
  - [2. 도메인 연결](#2-도메인-연결)
    - [DNS Record](#dns-record)
    - [A Type 설정 후 도메인 접속 확인](#a-type-설정-후-도메인-접속-확인)
  - [3. https 적용 - 인증서 발급](#3-https-적용---인증서-발급)
    - [자동 발급 방식](#자동-발급-방식)
    - [참고) manual 방식](#참고-manual-방식)
  - [4. 인증서 갱신](#4-인증서-갱신)
    - [cron job](#cron-job)
  - [최종 nginx.conf](#최종-nginxconf)
    - [예) 최종 nginx.conf (code-server)](#예-최종-nginxconf-code-server)
    - [예) 최종 nginx.conf (ghost cms)](#예-최종-nginxconf-ghost-cms)
  - [요약](#요약)
    - [NOTE) brew / nginx / certbot 명령어 정리](#note-brew--nginx--certbot-명령어-정리)
  - [ref](#ref)


## Nginx으로 CodeServer에 https 붙이기

한번 해보면 어렵지 않다. 처음에는 무지 어려웠다...  


## 1. nginx 설치

아래 명령어를 참고해서 nginx를 MacOS에 설치한다.   

```
#1 패키지 설치
brew install nginx 

#2 서비스 시작
brew services start nginx

#3 서비스 목록
brew services

# 서비스 재시작
brew services restart nginx

#4 8080포트 접근시 nginx 도달 확인하자.
> http://123.123.123.123:8080/
```

<br/>

### 80 포트로 변경해서 nginx접근이 되는지 확인

설정파일에서 80 포트로 변경해서 nginx접근이 되는지 확인

```
# 1. nginx.conf 파일 경로 확인
brew info nginx

# 1.1 아래처럼 설정파일 경로를 확인 
...
The default port has been set in /opt/homebrew/etc/nginx/nginx.conf to 8080 so that
nginx can run without sudo.
...

# 2. 설정 파일 변경
설정 파일 경로 : /opt/homebrew/etc/nginx/nginx.conf
  - 포트 8080 > 80 변경

#3. 서비스 재시작
brew services restart nginx

#3 nginx 도달 확인 (port 80)
> http://123.123.123.123
```

<br/>

## 2. 도메인 연결

### DNS Record 

가비아에서 구매한 도메인을 연결하기 위해 DNS 레코드를 수정해야한다.  
간단하게 레코드 타입을 설명하면  
- A 타입을 주로 사용한다. 도메인과 IP를 연결한다.  
  - 서브 도메인이라는 개념이 있다.   
  - 내가 구매한 도메인이 my-coding.site 라면
  - www.my-coding.site, blog.my-coding.site 등 무한으로 서브도메인을 사용할 수 있다.  
  - 서브도메인이 없는 경우는 @ 라고 쓰면 된다. 
- CNAME 은 도메인과 도메인을 연결한다.  
  - 티스토리 블로그를 운영하는데, 개인 도메인을 가지고 싶을때 사용한다.  

### A Type 설정 후 도메인 접속 확인  

my-coding.site 도메인을 구매 후 www.my-coding.site 도메인과 내 맥미니 서버와 연결해야 한다.    

```
#1 A 타입으로 레코드를 추가한다. 
- eg) www.my-coding.site -> 123.123.123.123 설정을 원한다면
- host : www ( host는 www 이며 서브도메인을 뜻한다. )

# 참고)
- eg) my-coding.site -> 123.123.123.123 설정을 원한다면
- host:@
- Note) host에 @은 서브도메인이 없는 경우이다.
- 즉, http://my-coding.site 로 접속하면 지정된 IP로 이동한다.

#2 nginx 도달 확인
>http://www.my-coding.site 

```
 
<br/>

## 3. https 적용 - 인증서 발급 

https://ukprog.tistory.com/125

certbot으로 인증서를 발급하는 방법은 2가지가 있다.  
- manual 방식  
- nginx, apache 등 서버를 명시하는 자동 발급 방식  
- 후자의 방법을 추천한다.  


### 자동 발급 방식

```
# 1. nginx에 https 인증서를 받는 명령어  

# 도메인이 여러개인/하나인 경우
sudo certbot --nginx --nginx-server-root /opt/homebrew/etc/nginx -d domain.com,www.domain.com
sudo certbot --nginx --nginx-server-root /opt/homebrew/etc/nginx -d domain.com
# --nginx-server-root 경로 지정, brew로 nginx을 설치해서 기본 경로랑 다르다.!
# --nginx : cerbot이 처리할 대상의 서버, apache등이 있다.  
# 위 명령어가 수행되면 nginx.conf파일이 저절로 변경된다.  

# 2. 아래 파일을 nginx가 읽도록 권한 부여하기
# sudo chmod -R 755 /etc/letsencrypt

# 3. 재시작
# nginx -t
# brew services restart nginx

```

### 참고) manual 방식

```
# 1. 인증서 발급 시작
sudo certbot certonly --manual 

(가능하면 아래 명령어로 nginx 설정을 자동으로 설정하게끔 하자.)
sudo certbot --nginx -d yourdomain.com


# 2. 연결할 도메인 입력
www.my-coding.site

# 도메인에 아래 파일 서빙하도록 nginx 설정 변경
Create a file containing just this data:
Emu_LEu_HbaAeKH6OrOER88xvjurfFKRJM7-MoYhjN9.HpJsIlJVhSaVM-6mjKz5_4ZU5tydqNW2B5pjcvuHjS0
And make it available on your web server at this URL:
http://www.my-coding.site/.well-known/acme-challenge/Emu_LEu_HbaAeKH6OrOER88xvjurfFKRJM7-MoYhjN9


# nginx.conf 추가
---
    server {
        listen 80 ;
        server_name www.my-coding.site;

        location /.well-known/acme-challenge {
            alias /opt/homebrew/etc/nginx/.well-known/acme-challenge; # 실제 파일이 위치한 경로를 지정합니다.
            try_files $uri $uri/ /opt/homebrew/etc/nginx/.well-known/acme-challenge/Emu_LEu_HbaAeKH6OrOER88xvjurfFKRJM7-MoYhjN9; # 특정 파일명을 여기에 지정합니다.
        }

        location / {  # HTTP to HTTPS 리디렉션
            return 301 https://$host$request_uri;
        }
    }
...

--- 

mkdir -p .well-known/acme-challenge/
vi Emu_LEu_HbaAeKH6OrOER88xvjurfFKRJM7-MoYhjN8
Emu_LEu_HbaAeKH6OrOER88xvjurfFKRJM7-MoYhjN8.HpJsIlJVhSaVM-6mjKz5_4ZU5tydqNW2B5pjcvuHjS0  입력 후 저장

#3. nginx 재실행
nginx -t # 문법 검사
brew services restart nginx # 재시작 

#4. cerbot 확인 후 발급 성공
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/www.my-coding.site /fullchain.pem
Key is saved at:         /etc/letsencrypt/live/www.my-coding.site /privkey.pem
This certificate expires on 2023-11-08.
These files will be updated when the certificate renews.


#5. 인증서 읽기 권한 문제 해결
sudo chmod -R 755 /etc/letsencrypt

#6. https 처리하는 nginx.conf 추가

---
    server {
        listen 443 ssl; 
        server_name www.my-coding.site; 
        ssl_certificate /etc/letsencrypt/live/www.my-coding.site/fullchain.pem; 
        ssl_certificate_key /etc/letsencrypt/live/www.my-coding.site/privkey.pem; 

        # SSL 설정 (최신 보안 권장)
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384';
        ssl_prefer_server_ciphers off;

        # SSL 세션 캐싱 설정
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 1h;

        location / {
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Host $host;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_pass http://127.0.0.1:3030/;
        }   
    }
...

```

## 4. 인증서 갱신

sudo certbot certonly --manual 명령어를 이용했더라면 자동으로 갱신이 불가능 하다.    

```
[certbot]
# 인증서 정보 , 유효기간, 경로 확인 
sudo certbot certificates

# 인증서 발급
sudo certbot --nginx -d yourdomain.com
sudo certbot certonly --manual 

# 인증서 갱신 dry-run
sudo certbot renew --dry-run

# 인증서 갱신 (--apache, --nginx 등으로 자동 발급한 경우)
sudo certbot renew

# 인증서 갱신 (--manual 로 발급한 경우)
sudo certbot certonly --manual --dry-run -d www.your-domain.com
- /opt/homebrew/etc/nginx

```

### cron job

echo "0 0,12 * * * root python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew -q" | sudo tee -a /etc/crontab > /dev/null


---

## 최종 nginx.conf

```c
#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;
#pid        logs/nginx.pid;
events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;
    #keepalive_timeout  0;
    keepalive_timeout  65;
    #gzip  on;

    server {
        listen 443 ssl; # managed by Certbot
        server_name www.you-domain.site; # managed by Certbot
        ssl_certificate /opt/homebrew/etc/nginx/fullchain.pem; # managed by Certbot
        ssl_certificate_key /opt/homebrew/etc/nginx/privkey.pem; # managed by Certbot
        # SSL 설정 추가 (optional, 추천)
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA:ECDHE-RSA-AES256-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384';
        ssl_prefer_server_ciphers off;
        ssl_session_timeout 1d;
        ssl_session_cache shared:SSL:50m;

        location / {
            proxy_pass http://127.0.0.1:2229/;           
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection upgrade;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
	    }   
    }

    server {
        listen 80 ;
        server_name www.you-domain.site;
        location / {  # HTTP to HTTPS 리디렉션
            return 301 https://$host$request_uri;
        }
    }

    include servers/*;
}
```


### 예) 최종 nginx.conf (code-server)

```
#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;
#pid        logs/nginx.pid;
events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;
    #keepalive_timeout  0;
    keepalive_timeout  65;
    #gzip  on;

    # vscode
    server {
        listen 443 ssl; 
        server_name code.coding-play.site; 
        ssl_certificate /etc/letsencrypt/live/code.coding-play.site/fullchain.pem; 
        ssl_certificate_key /etc/letsencrypt/live/code.coding-play.site/privkey.pem; 

        # SSL 설정 추가 (optional, 추천)
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA:ECDHE-RSA-AES256-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384';
        # ssl_prefer_server_ciphers off;
        # ssl_session_timeout 1d;
        # ssl_session_cache shared:SSL:50m;


        location / {
            proxy_pass http://127.0.0.1:2229;           
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection upgrade;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
	    }   
    }

    server {
        listen 80 ;
        server_name code.coding-play.site;

        location /.well-known/acme-challenge {
            alias /opt/homebrew/etc/nginx/.well-known/acme-challenge; # 실제 파일이 위치한 경로를 지정합니다.
            try_files $uri $uri/ /opt/homebrew/etc/nginx/.well-known/acme-challenge/XGNhDLRm4LMqNgFd3QC3RdI4mGM1ZedPYZiSt0nTCUY; # 특정 파일명을 여기에 지정합니다.
        }

        location / {  # HTTP to HTTPS 리디렉션
            return 301 https://$host$request_uri;
        }
    }

    include servers/*;
}

# nginx -t
# brew services restart nginx
# sudo chmod -R 755 /etc/letsencrypt
```



### 예) 최종 nginx.conf (ghost cms)

```
#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;
#pid        logs/nginx.pid;
events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;
    #keepalive_timeout  0;
    keepalive_timeout  65;
    #gzip  on;

    # ghost cms - coding-play
    server {
        listen 80 ;
        server_name wp.coding-play.site;

        location /.well-known/acme-challenge {
            alias /opt/homebrew/etc/nginx/.well-known/acme-challenge; # 실제 파일이 위치한 경로를 지정합니다.
            try_files $uri $uri/ /opt/homebrew/etc/nginx/.well-known/acme-challenge/GA8XfAQnDC7jp1kjtxMmzhUJ5RVeYWG0MbwfdnH1JXQ; # 특정 파일명을 여기에 지정합니다.
        }

        location / {  # HTTP to HTTPS 리디렉션
            return 301 https://$host$request_uri;
            # proxy_pass http://127.0.0.1:8080;
        }
        # location ~ /.well-known {
        #     allow all;
        # }
    }

    server {
        listen 443 ssl; 
        server_name wp.coding-play.site; 
        ssl_certificate /etc/letsencrypt/live/wp.coding-play.site/fullchain.pem; 
        ssl_certificate_key /etc/letsencrypt/live/wp.coding-play.site/privkey.pem; 

        # SSL 설정 (최신 보안 권장)
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384';
        ssl_prefer_server_ciphers off;

        # SSL 세션 캐싱 설정
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 1h;

        location / {
            # proxy_set_header Host "wp.coding-play.site";
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Host $host;
            proxy_set_header X-Forwarded-Proto $scheme;
            # proxy_set_header X-Real-IP $remote_addr;
            # proxy_set_header Host $http_host;
            # proxy_set_header X-NginX-Proxy true;
            # proxy_redirect off;
            proxy_pass http://127.0.0.1:3030/;


            # proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            # proxy_set_header X-Forwarded-Proto $scheme;
            # proxy_set_header X-Real-IP $remote_addr;
            # proxy_set_header Host $http_host;
        }   
    }

    include servers/*;
}

# nginx -t
# brew services restart nginx
# sudo chmod -R 755 /etc/letsencrypt
```


## 요약

1.도메인 설정
- 도메인을 구매한다. eg) example.com
- DNS 래코드 설정으로 내 아이피와 연결한다. eg) www.example.com -> 123.123.123.123

2.nginx 80 port 설정
- 맥미니의 80포트 접속 = nginx로 셋업
- 마치 GW 같은 역학을 nginx가 해주는 것이다.  
- 그리고 각 도메인 별로 분기처리 하여, 뒷단의 서비스 포트로 연결한다.

```
    server {
        listen 80 ; # nginx는 80포트 open  
        server_name www.example.com; # 특정 서브 도메인에 해당하는 경우만 처리한다.

        location / {  # HTTP to HTTPS 리디렉션
            return 301 https://$host$request_uri;
        }
    }
```

3.cerbot 실행

- `sudo certbot certonly --manual`으로 인증서발급 진행
- cerbot에서 임의의 경로에 요청을 보낼테니, 특정 파일을 읽을 수 있도록 셋팅하라 한다.
- 그 설정을 `location /` 앞단에 한다.

```
    server {
        listen 80 ; # nginx는 80포트 opn  
        server_name www.example.com; # 그 중 특정 도메인에 해당하는 경우만 처리한다. 

        location /.well-known/acme-challenge {
            alias /opt/homebrew/etc/nginx/.well-known/acme-challenge; # 실제 파일이 위치한 경로를 지정합니다.
            try_files $uri $uri/ /opt/homebrew/etc/nginx/.well-known/acme-challenge/EaICkPAIxkrb_MYWJPqLihzZCc228BkrgxXPvi9qUTA; # 특정 파일명을 여기에 지정합니다.
        }

        location / {  # HTTP to HTTPS 리디렉션
            return 301 https://$host$request_uri;
        }
    }
```

4.nginx 443 port 설정

- 인증이 성공되면, 특정 경로에 인증서를 만들어주게 된다.
- 이는 fullchain.pem, privkey.pem 2개가 나온다.
- 해당 디렉터리는 nginx가 읽을권한이 없으므로 `sudo chmod -R 755 /etc/letsencrypt` 명령어로 권한 부여
- 다음처럼 설정을 추가한다. (아래 예제는 localhost 3030포트로 진입한다.)

```
    server {
        listen 443 ssl; 
        server_name www.example.com; 

        ssl_certificate /etc/letsencrypt/live/www.example.com/fullchain.pem; 
        ssl_certificate_key /etc/letsencrypt/live/www.example.com/privkey.pem; 

        # SSL 설정 (최신 보안 권장)
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384';
        ssl_prefer_server_ciphers off;

        # SSL 세션 캐싱 설정
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 1h;

        location / {
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Host $host;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_pass http://127.0.0.1:3030/;
        }   
    }
```

<br/>

### NOTE) brew / nginx / certbot 명령어 정리

```
[brew]
brew search nginx   # 패키지 검색 
brew install nginx  # 패키지 설치

brew services start nginx  # 서비스 시작
brew services restart nginx 
( brew services [run|start|stop|restart|cleanup] service_name  )

brew services # 서비스 확인
Name        Status  User      File
nginx       started dosimpact ~/Library/LaunchAgents/homebrew.mxcl.nginx.plist

---

[nginx]
# 설정파일 변경 후 문법 체크하기
nginx -t 

# nginx.conf 파일 경로 확인
brew info nginx
...
The default port has been set in /opt/homebrew/etc/nginx/nginx.conf to 8080 so that
nginx can run without sudo.
...

# nginx root 폴더 확인 
>nginx -V

nginx version: nginx/1.25.1 ...
configure arguments: --prefix=/opt/homebrew/Cellar/nginx/1.25.1_1 ...

여기서 : --prefix=/opt/homebrew/Cellar/nginx/1.25.1_1 에 루트 디렉터리가 된다.
하지만 해당 디렉터리의 html 폴더는 링크가 걸려 있다. 
최종적으로 /opt/homebrew/var/www 라는 곳에 index.html 이 있다. 

# 환경 설정 변경 후 리로드 명령어  
nginx -s reload

---
[certbot]

# 인증서 발급
sudo certbot certonly --manual 
sudo certbot --nginx -d yourdomain.com
sudo certbot --nginx --nginx-server-root /opt/homebrew/etc/nginx -d yourdomain.com


# 인증서 정보 , 유효기간, 경로 확인
sudo certbot certificates
sudo certbot certificates -d www.domain.com

Saving debug log to /var/log/letsencrypt/letsencrypt.log
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Found the following certs:
  Certificate Name: MY_DOMAIN
    Serial Number: 3841dcd9246507891a8afc5cde8df0e0af1
    Key Type: ECDSA
    Domains: MY_DOMAIN
    Expiry Date: 2023-11-08 12:19:45+00:00 (VALID: 89 days)
    Certificate Path: /etc/letsencrypt/live/MY_DOMAIN/fullchain.pem
    Private Key Path: /etc/letsencrypt/live/MY_DOMAIN/privkey.pem
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

# 인증서 갱신 dry-run
sudo certbot renew --dry-run
sudo certbot renew --dry-run -d www.domain.com

# 인증서 갱신
( 발급시 90일 연장, 30일 남았을때 연장 가능 )
sudo certbot renew

## tip, nginx 설정, nginx 설정파일 경로 지정 
sudo certbot --nginx --nginx-server-root /opt/homebrew/etc/nginx renew

# 인증서 삭제
sudo certbot delete --cert-name yourdomain.com

```

---

## ref

[DNS 레코드 종류](https://www.delmaster.net/69).   
[DNS 레코드 종류 쉽게 이해](https://inpa.tistory.com/entry/WEB-%F0%9F%8C%90-DNS-%EB%A0%88%EC%BD%94%EB%93%9C-%EC%A2%85%EB%A5%98-%E2%98%85-%EC%95%8C%EA%B8%B0-%EC%89%BD%EA%B2%8C-%EC%A0%95%EB%A6%AC).   
[ssh 접속 to mac mini](https://dev-repository.tistory.com/96)      
[nginx + code-server 구축](https://www.hakawati.co.kr/entry/Code-Server-%EA%B5%AC%EC%B6%95%ED%8E%B8#NginX%EC%9D%98%20%ED%8C%A8%EC%8A%A4%EC%9B%8C%EB%93%9C%20%EC%9D%B8%EC%A6%9D%20%EA%B5%AC%EC%84%B1-1).   
[code-server 자체에 https 적용](https://donghun.dev/code-server-tutorial-guide) 

