---
sidebar_position: 2
---

# Nginx 환경설정 (Proxy)

Nginx을 Proxy으로 도메인을 연결해서 사용한다.  
- 따라서 도메인이 없으면 ping 응답만 주도록 바꾸자.  

- [Nginx 환경설정 (Proxy)](#nginx-환경설정-proxy)
  - [1.nginx 설정 파일의 구조](#1nginx-설정-파일의-구조)
    - [포트 조건](#포트-조건)
    - [도메인 조건](#도메인-조건)
  - [2.디폴트 서버 블록](#2디폴트-서버-블록)
  - [3.도메인별 분기 처리](#3도메인별-분기-처리)
    - [Usage](#usage)
  - [4.https로 리다이렉션 처리](#4https로-리다이렉션-처리)
    - [usage](#usage-1)
  - [5.설정파일 분리하기](#5설정파일-분리하기)
  - [6-1.특정 경로로 접근시, 정적파일들 제공하기](#6-1특정-경로로-접근시-정적파일들-제공하기)
  - [6-2.특정 경로로 접근시, 특정 파일 제공하기](#6-2특정-경로로-접근시-특정-파일-제공하기)
  - [예) CodeServer에 Nginx Proxy 설정하기 (+https)](#예-codeserver에-nginx-proxy-설정하기-https)
    - [proxy 옵션 details](#proxy-옵션-details)
  - [기타 설정들](#기타-설정들)
    - [client_max_body_size](#client_max_body_size)
    - [access_log, error_log](#access_log-error_log)

## 1.nginx 설정 파일의 구조  

nginx 설정파일은 여러개의 서버 블록들로 구성된다.  
- 서버 블록은 특정 포트나, 도메인을 만족할 때 처리할 분기문이라고 보면된다.  
- 하나의 루트 설정파일과 하위 설정파일들로 구성 가능  

서버블록 로직을 태우는 조건들의 예  

### 포트 조건  
- listen 80; http에 대해서 처리한다 - https로 리다이렉트 해줘    
- listen 443; https에 대해서 처리한다. - 특정 서버로 넘겨    

### 도메인 조건 
- server_name www.domain.com; 해당 도메인의 경우에만 처리할래.
- 도메인 조건과 포트조건을 합쳐서 처라할 수 있다.  

Note) DNS A Record에서도 서브 도메인에 대한 처리를 하는데?  
- 도메인은 메인도메인+서브도메인 구조이다. (domain.com = 메인, www = 서브)  
- DNS레코드에서 특정 도메인 경우에는 다른 IP로 연결이 가능하다.  
  - www.domain.com -> 124.1.1.1  
  - domain.com -> 123.123.123.123  
  - 그 외 모든 서브 도메인 -> 123.123.123.123  
- nginx에서 서브도메인의 처리를 담당하려면, 상위 DNS레코드에서 호스트(@)설정을 체크해야 한다.  


## 2.디폴트 서버 블록

어떠한 서버블록에도 걸리지 않는 경우, 처리하는 블록이 디폴트 서버 블록이다.  

- 공인 IP로 직접 접근하는 경우  
- DDNS로 직접 접근하는 경우  
- 특정 서버블록에 걸리지 않는 경우
등 처리할 수 있는 최후의 서버 블록이다.  

주의점
- 디폴트 블록이 없다면 가장 첫번째 블록으로 자동으로 처리가 된다.      
- 브라우저 창에서 도메인을 바로 입력하면, https로 처리된다.  

```py
# default 서버 블록의 예
worker_processes  1;
events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    server {
        listen 80 default_server;
        # listen 443 ssl default_server;
        # warn: If you enter domain.com in the browser search box, 
        # it will be displayed as https, and since there is no server block that handles nginx's default 443, 
        # it may branch to a different domain server block than expected.

        # _는 글로벌 식별자이다.
        server_name _;

        add_header Content-Type text/plain;

        # 어떠한 서버 블록에라도 걸리지 않으면 ok를 보낸다.  
        location / {
            return 200 "ok";
        }
    }
}
```

## 3.도메인별 분기 처리

아래 서버 블록은 domain.com 라는 특정 도메인의 경우에 반응한다.  
- proxy_pass를 통해서 프로세스와 연동이 가능하다.  
- code-server 든, docker container든 포트를 적어주자.  
- server_name에 조건에 맞는 도메인을 적어준다. 

```py
# 80포트 + 메인 도메인에 대한 처리  
server {
    listen 80 ;
    server_name domain.com;

    location / {  
        proxy_pass http://127.0.0.1:3031/;
    }
}

```
### Usage 

예) domain.com 접속시 리액트 App 실행  

## 4.https로 리다이렉션 처리

- http로 접근하면 80포트 이다. https는 443포트 이다.  
- 80포트 : HTTPS로 리다이렉션 하는 서버블록을 설정.   
- server_name에 조건에 맞는 도메인을 적어준다.  

```
server {
    listen 80 ;
    server_name domain.com;

    location / {  
        # HTTP to HTTPS 리디렉션
        return 301 https://$host$request_uri;
    }
}
```
### usage

예) domain.com 접속시 https로 리액트 App 실행  
- https 인증서 발급이 필요함  



## 5.설정파일 분리하기

server 블록이 많아지면 설정 파일의 관리가 어려워진다.  
또한 특정 도메인에 대한 설정파일을 구분하고 싶은 니즈도 있다.  

```
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    # servers 하위 모든 폴더들이 설정파일에 포함된다. 
    include servers/*;

    server {
        listen 80 default_server;
        server_name _;

        add_header Content-Type text/plain;

        location / {
            return 200 "ok";
        }
    }
}

---
# servers/example.com.conf

server {
    server_name example.com example.com;

    access_log /Users/username/log/ghost_example/access.log;
    error_log /Users/username/log/ghost_example/error.log;

    client_max_body_size 100M;

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

    location ~ ^/ads.txt {
            root /opt/homebrew/etc/nginx/public;
            default_type text/plain;
    }

    location / { 
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://127.0.0.1:3030/;
    }
}

server {
    if ($host = example.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    if ($host = www.example.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name www.example.com example.com;
    return 404; # managed by Certbot

}
```

## 6-1.특정 경로로 접근시, 정적파일들 제공하기

뒷단의 서비스까지 연결하지 않고, nginx 단에서 파일을 제공하고 끝내고 싶은 경우가 있다.  

```
    server {
        listen 80 ;
        server_name www.domain.com;

        location /.well-known/acme-challenge {
            alias /opt/homebrew/etc/nginx/.well-known/acme-challenge; # 실제 파일이 위치한 경로를 지정합니다.
            try_files $uri $uri/ /opt/homebrew/etc/nginx/.well-known/acme-challenge/XGNhKKRm4LMqNgFd3QC3RdI4mGM1ZedPYZiSt0nTCZB; # 특정 파일명을 여기에 지정합니다.
        }

        location / {  # HTTP to HTTPS 리디렉션
            return 301 https://$host$request_uri;
        }
    }
```
예) 
https://www.domain.com/.well-known/acme-challenge -> Not found.
https://www.domain.com/.well-known/acme-challenge/XGNhKKRm4LMqNgFd3QC3RdI4mGM1ZedPYZiSt0nTCZB -> 파일 다운


## 6-2.특정 경로로 접근시, 특정 파일 제공하기

위 경우보다 좁은 설정이다. 폴더 자체를 제공하는 것이 아닌 파일을 명시해서 제공한다.  

```
server {
    server_name domain.com;

    client_max_body_size 100M;

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/domain.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/domain.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

    # 경로+파일까지 일치하면 아래 location 블록을 실행한다.  
    location ~ ^/ads.txt {
            root /opt/homebrew/etc/nginx/public/domain.com;
            default_type text/plain;
    }

    location / { 
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://127.0.0.1:3036/;
    }
}
```

예)  
https://domain.com/ads.txt -> 텍스트 파일 제공

## 예) CodeServer에 Nginx Proxy 설정하기 (+https)  

```
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    include servers/*;

    # vscode
    server {
        listen 443 ssl; 
        server_name code.domain.site; 
        ssl_certificate /etc/letsencrypt/live/code.domain.site/fullchain.pem; 
        ssl_certificate_key /etc/letsencrypt/live/code.domain.site/privkey.pem; 

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
        server_name code.domain.site;

        location /.well-known/acme-challenge {
            alias /opt/homebrew/etc/nginx/.well-known/acme-challenge; # 실제 파일이 위치한 경로를 지정합니다.
            try_files $uri $uri/ /opt/homebrew/etc/nginx/.well-known/acme-challenge/XGNhDLRm4LMqNgFd3QC3RdI4mGM1ZedPYZiSt0nTCUY; # 특정 파일명을 여기에 지정합니다.
        }

        location / {  # HTTP to HTTPS 리디렉션
            return 301 https://$host$request_uri;
        }
    }

    # catch all server
    # nginx always has a default server. 
    # In the absence of any server block explicitly marked as default_server, nginx will use the first server with a matching listen directive.
    server {
        listen 80 default_server;
        # listen 443 ssl default_server;
        # warn: If you enter domain.com in the browser search box, 
        # it will be displayed as https, and since there is no server block that handles nginx's default 443, 
        # it may branch to a different domain server block than expected.

        server_name _;

        add_header Content-Type text/plain;

        location / {
            # 기본 도메인이나 도메인이 없는 경우의 설정 추가
            return 200 "ok";
        }
    }
}

# nginx -t
# brew services restart nginx
# sudo chmod -R 755 /etc/letsencrypt
```

### proxy 옵션 details

위의 nginx 설정 옵션들은 주로 프록시 서버를 설정할 때 사용되는 헤더들을 정의하는 것입니다. 각 옵션들은 다음과 같은 역할을 합니다:

1. `proxy_set_header Upgrade $http_upgrade;`: 클라이언트와 서버 간의 연결을 업그레이드하는데 필요한 헤더를 설정합니다. 보통 웹소켓과 같은 양방향 통신을 위해 사용됩니다.
2. `proxy_set_header Connection upgrade;`: 연결이 업그레이드되어야 함을 서버에게 알리기 위한 헤더를 설정합니다.
- 웹소켓 관련 Proxy 설정

3. `proxy_set_header Host $host;`: 원격 서버로 전송되는 요청 헤더에 호스트 정보를 추가합니다. 이는 가상 호스팅된 여러 도메인을 처리하는데 도움이 됩니다.
- 클라이언트가 최초접속한 호스트 정보를 전달한다. 그래야 redirect같은 이슈가 없다. 

4. `proxy_set_header X-Real-IP $remote_addr;`: 원격 서버에 전달되는 요청 헤더에 실제 클라이언트의 IP 주소를 추가합니다. 이를 통해 원격 서버에서 클라이언트의 실제 IP 주소를 식별할 수 있습니다.
- 오리지날 클라이언트 IP는 ? 

5. `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`: 클라이언트에서 서버로 전달되는 요청 헤더에 클라이언트의 전달된 IP 주소 목록을 추가합니다. 여러 중개 서버를 통과한 경우, 이를 통해 클라이언트의 실제 IP 주소를 식별할 수 있습니다.
- 어떤 프록시들을 거처왔는가? IP 목록들  

6. `proxy_set_header X-Forwarded-Proto $scheme;`: 클라이언트와 서버 간의 프로토콜을 식별하는데 사용됩니다. 이 헤더를 통해 서버는 클라이언트가 HTTPS를 통해 접속했는지 여부를 확인할 수 있습니다.
- https 접근했는가?



## 기타 설정들


### client_max_body_size

큰 파일 업로드가 실패하는 경우, bodySize 제한을 조정하자.  

```
client_max_body_size 100M;
```

### access_log, error_log

접속 로그를 남기자. 

```
    access_log /Users/user_name/log/ghost_example/access.log;
    error_log /Users/user_name/log/ghost_example/error.log;
```
