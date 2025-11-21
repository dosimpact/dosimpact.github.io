---
sidebar_position: 15
---

# nginx proxy manager  

- [nginx proxy manager](#nginx-proxy-manager)
  - [1.Template](#1template)
  - [About](#about)
    - [사용 시나리오](#사용-시나리오)


## 1.Template 

```yaml
services:
  app:
    image: "jc21/nginx-proxy-manager:latest"
    restart: unless-stopped
    ports:
      # These ports are in format <host-port>:<container-port>
      - "80:80" # Public HTTP Port
      - "443:443" # Public HTTPS Port
      - "81:81" # Admin Web Port
      # Add any other Stream port you want to expose
      # - '21:21' # FTP

    #environment:
    # Uncomment this if you want to change the location of
    # the SQLite DB file within the container
    # DB_SQLITE_FILE: "/data/database.sqlite"

    # Uncomment this if IPv6 is not enabled on your host
    # DISABLE_IPV6: 'true'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt

    networks:
      - proxy_net

networks:
  proxy_net:
    driver: bridge
# docker-compose down && docker-compose up -d
```

## About  

Docker Nginx Proxy Manager (NPM)의 주요 기능 요약
- Nginx를 기반으로 리버스 프록시(Reverse Proxy) 구성을 웹 기반GUI(Graphical User Interface)를 관리할 수 있도록 해주는 도구입니다.  

1. 웹 기반 리버스 프록시 설정 (Proxy Hosts)
- GUI 제공: Nginx 설정 파일에 대한 깊은 지식 없이도 웹 인터페이스를 통해리버스 프록시를 쉽게 구성  
- 도메인 기반 라우팅: 사용자가 접속한도메인 이름에 따라 서버 내부의 특정IP 주소와 포트로 요청을 전달(라우팅)합니다.  
- 포트 신경 불필요: 외부에서는 표준 HTTP/HTTPS 포트(80/443)만 사용하고, 내부적으로 다양한 포트의 서비스로 접근할 수 있게 해줍니다.  

2. 자동화된 SSL/TLS 인증서 관리 (SSL Certificates)  
- Let's Encrypt 지원: 무료 SSL 인증 기관인Let's Encrypt를 이용한 SSL 인증서 발급 및 적용을자동화합니다.
- 갱신 자동화: 발급된 인증서의 갱신을 자동으로 처리하여 보안성을 유지합니다.

3. 쉬운 리다이렉션 설정 (Redirection Hosts)
- 특정 도메인으로 들어온 요청을 다른 도메인이나 URL로 쉽게리다이렉션(전달)하도록 설정할 수 있습니다.

4. 접근 제어 및 보안 기능  
- 액세스 목록(Access Lists): 특정 웹 자산에 대한 접근을IP 주소로 필터링하거나,사용자 이름/비밀번호를 통한 제한(Basic Authentication)을 설정하여 웹 리소스의 보안을 강화할 수 있습니다.
- 실제 서버 IP 보호: 리버스 프록시 역할을 통해 실제 백엔드 서버의 IP 주소를 외부 사용자에게 직접 노출하지 않아 보안에 유리합니다.

5. 기타 기능
- 스트림 지원 (Streams): Nginx의 스트림 기능을 사용하여TCP/UDP 트래픽을 네트워크상의 다른 서버로 직접 전달하도록 설정할 수 있습니다 (게임 서버, FTP, SSH 등에 사용).
- 404 페이지 설정 (404 Hosts): 404 응답 페이지를 사용자 정의할 수 있습니다.
- 상태 및 로그 확인: UI를 통해 프록시 서버의로그 및 다양한통계를 확인할 수 있습니다.


### 사용 시나리오    


1, 가비아 도메인 주소 + https 연결  

nginx proxy manager는 서버의 단일 진입 포인트로 사용한다.  
- test.my-domain.com 
  - -> A 레코드 설정 ( 14.14.14.14 (my ip) )  
- 1.nginx는 도메인 이름 바탕으로 내부 아이피 + 포트를 바인딩 시켜줄 수 있다.  
- 2.DNS 레코드만 잘 설정되어 있으면 https 인증서가 자동으로 발급되고 관리된다.  
- 3.NPM은 도커 컨테이너의 nginx이므로 다른 컨테이너에 접근하려면 http://host.docker.internal:2229 와 같은 주소를 사용해야한다.   


2, 기본 ID, PW 인증 넣기  
- Access Lists에서 ID, PW 를 포함하여 Access 객체를 만들 수 있다.  
- proxy host 설정에서 위 Access List를 연결하면 기본 인증 팝업이 나온다.  

3, proxy chain
- 내 서버의 상황은 특별한 상황에 있다.  
- 1개의 공인 IP에 1개의 공유기를 연결해서 사용한다. 뒷단에는 2대의 서버(메인,서브)가 있다.  
- 가비아 DNS 에서는 도메인과 ip주소만 바인딩 되지, 포트까지는 바인딩 지원이 안된다. (그것이 DNS, A 레코드 이니까)  

따라서 메인 서버에서 먼저 요청을 받고, 메인 서버에서 서브로 proxy를 다시 보내주어야 한다.     
- 구조 (메인서버는 80:80 (외부 포트:내부포트), 서브서버는 10080:80 (외부 포트:내부포트) 포트로 포트포워딩 되어 있다. )
  - 1, DNS A 레코드 설정 ( test.my-domain.com 는 -> 14.14.14.14 (my ip) 으로 가시오 )  
  - 2, 메인 서버 NPM 설정 ( test.my-domain.com 접속한 요청은 -> my-domain.iptime.org:10080 로 가시오 )  
  - 3, DDNS 설정 ( my-domain.iptime.org:10080 -> 14.14.14.14:10080 로 가시오 )  
    - *이는 DNS의 역할이라기보다는 NAT(Network Address Translation) 및 포트 포워딩의 역할     
  - 4, 서브 서버 NPM 설정 ( test.my-domain.com 접속한 요청은 -> host.docker.internal:4512 로 가시오 )  


4, redirect  
- Redirect(리다이렉트), Reverse Proxy(리버스 프록시) 차이점을 브라우저 관점에서 이해하면 쉽다.  
  - 리다이렉트는 서버가 브라우저에게 "네가 요청한 주소는 여기(새 주소)로 옮겨갔으니 새 주소로 다시 요청해"라고 알려주는 것  
  - 리버스 프록시는 서버가 브라우저에게는 아무런 주소 변경 사실을 알리지 않고, 서버 내부적으로 요청을 실제 서비스를 제공하는 다른 서버로 전달하고, 그 결과를 받아서 브라우저에게 되돌려주는 것.
- 기존의 www.my-domain.com을 쓰다가 app.my-domain.com으로 주소를 이전한 경우, 리다이렉트를 거는 대표 케이스다.  
