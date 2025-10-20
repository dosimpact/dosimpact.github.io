---
sidebar_position: 3
---

# Nginx Trouble Shooting  


## 문제 : Supabase Login Callback에서 Nginx 504 이슈가 발생.   

Nginx을 리버스 프록시로 사용하고 있다.  
- 아래의 옵션을 주니 문제는 해결되었다.  
- ( upstream sent too big header ) 같은 오류가 발생했을 것이다.  

```
proxy_buffers 8 16k;
proxy_buffer_size 32k;
proxy_connect_timeout 60s;
proxy_send_timeout 60s;
proxy_read_timeout 60s;
```

📌 구조 및 설정 
- 브라우저,클라이언트 (Downstream) -> Nginx -> Next.js 서버 (Upstream / Backend)  

1.프록시 버퍼링 설정 (Proxy Buffering Configuration)  

nginx는 upstream server로 부터 데이터를 한번에 받지 않고 버퍼에 저장 후 전달한다.  
- nginx는 응답 헤더를 먼저 받아서 응답코드를 분석한다.
- 200, 500 응답 코드 혹은 Content-Type, Length 등의 정보를 확인해서 버퍼링 전략 및 캐시 결정한다.   
  - proxy_buffer_size 32k; : 응답 헤더의 크기. 헤더는 비교적 작고 크기가 일정하다.    
  - proxy_buffers 8 16k; : body 부분을 정의한다. 버퍼는 8개, 각 버퍼는 16K이다.  총 128K 


2.프록시 타임아웃 설정 (Proxy Timeout Configuration)
- proxy_connect_timeout 60s; 60초 이내 연결 안되면 504 Gateway Timeout 발생   
- proxy_send_timeout 60s;  (request) 전송에 대한 타임아웃    
- proxy_read_timeout 60s;  (response) 수신에 대한 타임아웃  

📌 총 버퍼를 늘리는것의 장점 
- 메모리 사용량을 늘려 디스크 IO 감소 및 지연시간을 줄인다.    
  - 버퍼의 크기 : CPU 캐시 라인 크기, 메모리 페이지 크기에 맞추는 것이 좋다. ( CPU는 요즘 64바이트, 메모리 페이지 크기는 보통 4KB )  
  - 버퍼의 개수 : 버퍼의 수를 늘려 메모리 사용량을 조절한다.   

📌 로그 확인하기

```
docker exec -it <NPM 컨테이너 이름> sh
# 액세스 로그 확인
cat /var/log/nginx/access.log

# 에러 로그 확인
tail -f /var/log/nginx/error.log
```