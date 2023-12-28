---
sidebar_position: 1
---

# Nginx 설치

## brew install nginx

```
brew search nginx
brew install nginx
```

## 명령어 정리

```
# 서비스 재시작 및 정지
brew services restart nginx
brew services start nginx
brew services stop nginx


# 설정파일 변경 후 문법 체크하기
nginx -t 


# nginx.conf 파일 경로 확인
brew info nginx
...
The default port has been set in /opt/homebrew/etc/nginx/nginx.conf to 8080 so that
nginx can run without sudo.
...


# nginx root 폴더 확인 (index.html) 
>nginx -V

nginx version: nginx/1.25.1 ...
configure arguments: --prefix=/opt/homebrew/Cellar/nginx/1.25.1_1 ...

여기서 : --prefix=/opt/homebrew/Cellar/nginx/1.25.1_1 에 루트 디렉터리가 된다.
하지만 해당 디렉터리의 html 폴더는 링크가 걸려 있다. 
최종적으로 /opt/homebrew/var/www 라는 곳에 index.html 이 있다. 
```