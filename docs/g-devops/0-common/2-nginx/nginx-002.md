---
sidebar_position: 2
---

# Nginx 환경설정 (Proxy)

Nginx을 Proxy으로 도메인을 연결해서 사용한다.  
- 따라서 도메인이 없으면 ping 응답만 주도록 바꾸자.  

## nginx 설정 파일의 구조  

nginx 설정파일은 여러개의 서버 블록들로 구성된다.  
서버 블록은 특정 포트나, 도메인을 만족할 때 처리할 분기문이라고 보면된다.  
하나의 루트 설정파일과 함께 도메인별 하위 설정파일들로 구성

서버블록 로직을 태우는 조건들
- listen 80; 포트 조건  
- server_name www.domain.com; 도메인 조건


## 디폴트 서버 블록

어떠한 서버블록에도 걸리지 않는 경우, 처리하는 블록이 디폴트 서버 블록이다.  

- 공인 IP로 직접 접근하는 경우  
- DDNS로 직접 접근하는 경우  
- 특정 서버블록에 걸리지 않는 경우
등 처리할 수 있는 최후의 서버 블록이다.  

주의점
- 디폴트 블록이 없다면 가장 첫번째 블록으로 자동으로 처리가 된다.      
- 브라우저 창에서 도메인을 바로 입력하면, https로 처리된다.  

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

## 도메인별 분기 처리

아래 서버 블록은 domain.com 라는 특정 도메인의 경우에 반응한다.  
- proxy_pass를 통해서 프로세스와 연동이 가능하다.  
- code-server 든, docker container든 포트를 적어주자.  
- server_name에 조건에 맞는 도메인을 적어준다. 

```
server {
    listen 80 ;
    server_name domain.com;

    location / {  
        proxy_pass http://127.0.0.1:3031/;
    }
}

```

예) domain.com 접속시 리액트 App 실행  

## https로 리다이렉션 처리

- http로 접근하면 80포트이다. https는 443이다.  
- 80포트이면 HTTPS로 리다이렉션 하는 서버블록이다. 
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

예) domain.com 접속시 https로 리액트 App 실행  

## 특정 경로로 접근시, 정적파일들 제공하기

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


## 특정 경로로 접근시, 특정 파일 제공하기

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

## 예) Nginx + CodeServer (https)

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

## 설정파일 분리하기

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
