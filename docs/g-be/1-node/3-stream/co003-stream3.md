---
sidebar_position: 3
---

# (Stream) 3. Browser Stream Saver



## Stream Saver   

https://github.com/jimmywarting/StreamSaver.js?   

문제점 : 스트림 다운로드 + 브라우저 다운로드 다이어로그를 같이 구현 해야 한다.  
( 일반적으로 브라우저의 다운로드 다이얼로그를 통해 스트림 다운로드를 직접적으로 처리할 수는 없다. )  

### How does it work?  


브라우저가 다운로드 다이어로그로 파일을 저장을 저장하는 방법1. : ObjectURLs + a link  

stream, file, blob을 저장하는 마법같은 추상화된 함수는 아직 없다.  
- 현재는 ObjectURLs + a link로 blob(file,image,sound..) 다운로드 링크를 만들 수 있다.  
- 1. stream 은 ObjectURLs을 만드는것이 불가능하다. (blob 방식은 스트림 데이터를 다 모아야 하므로 오버플로가 발생 가능. )    
- 2. Content-Disposition 헤더를 변경못하는 경우 다운로드 다이얼로그를 못 연다.    


브라우저가 다운로드 다이어로그로 파일을 저장을 저장하는 방법2. : HTTP Content-Disposition Header 사용   

서버에서 스트림을 처리하는것 처럼, 브라우저에서도 스트림 다운로드를 처리하는 것이다.  
브라우저에는 우리가 생각하는 개념의 서버가 없는 대신 이 역할을 해줄 '서비스 워커'가 있다. 

- 서비스 워커는 특정 네트워크 요청을 가로채어 원하는 로직으로 바꿀 수 있다.
- respondWith() 을 사용해서 HTTP 응답 객체를 지정하면 브라우저가 다운로드 다이어로그로 처리한다.
- Header name: Content-Disposition.
- Header value: attachment;filename=FileName.txt.

### 전체 로직  

1.서버로부터 스트림 데이터를 받는다. 브라우저의 ReadableStream (StreamSaver.js)   

2.스트림 데이터를 service worker 에게 넘긴다.    
- 이때 mitm.html의 도움을 받는다.   
- mitm.html는 iframe(보안컨텍스트), popup(비보안컨텍스트) 에 열려있다.  
- window의 message 채널을 통해서 전달한다. ( 브라우저는 window간 메시지 전송을 지원 )  

3.서비스 워커가 데이터를 받아서 스트림 다운로드를 구현  
- Content-Disposition 으로 다운로드 다이어 로그 생성  

### 구현상 문제점

- 1. 서비스 워커는 secure contexts 에서만 작동
- 2. 서비스 워커는 작업이 없으면 5분 후 IDLE 상태로 빠짐

1. StreamSaver는 mitm.html을 만듭니다 (이는 보안 컨텍스트을 가지고, github 정적 페이지에서 호스팅되는 HTML 파일이고, 서비스 작업자를 설치하는 코드가 있다.)
( 보안 컨텍스트에서 iframe 통해서 html 처리, 안전하지 않은 경우 새 팝업에서 html을 처리한다. )    
1. postMessage를 사용하여 스트림(또는 DataChannel)을 service worker로 전송합니다.  
2. 그런 다음 service worker는 다운로드 링크를 만듭니다.  
3. IDLE로 빠지지 않도록 지속적으로 Ping을 날려준다.  


mitm.html is the lite "man in the middle"

signal the opener's messageChannel to the service worker  
- service worker : stream 수신역할  
- 작업자는 오프너(원래의 브라우저)에게 다운로드를 시작할 링크를 열도록 지시합니다.  


- 3. 일부 브라우저에는 ReadableStream이 있지만 WritableStream은 없습니다.
- 해결 방법 : 폴리필 web-streams-polyfill 
- 기본 ReadableStream이 서비스 워커로 전송될 때 StreamSaver가 더 잘 작동하기 때문에 polyfill 대신 ponyfill을 로드하고 기존 구현을 재정의하는 것이 좋습니다.    

Ref : https://github.com/jimmywarting/StreamSaver.js/blob/master/mitm.html  

---   

## 배경지식

### Content-Disposition

>HTTP의 Content-Disposition 헤더로 브라우저 다운로드를 열 수 있게 한다.  

이 헤더는 브라우저에서 다운로드를 활성화하고 다운로드된 파일의 기본 이름을 설정해요.
- 서버가 클라이언트 브라우저에서 지원하는 파일(TXT 또는 JPG 파일)을 보낼 때, 브라우저는 기본적으로 파일을 열어요.  
- 파일을 저장하도록 사용자에게 요청하려면 Content-Disposition 필드를 구성하여 브라우저의 기본 동작을 재정의해야 해요.  
  - 헤더 이름: Content-Disposition. 
  - 헤더 값: attachment;filename=FileName.txt.  

ref :  
- Content-Disposition : https://www.tencentcloud.com/document/product/1145/46185
- MIME_types (Content-Type) :https://developer.mozilla.org/ko/docs/Web/HTTP/Basics_of_HTTP/MIME_types


### Polyfill vs Ponyfill vs Transpiler

Transpiler : 오래된 브라우저들이 이해하지 못하는 최신 문법들을 오래된 문법으로 변경하여 브라우저들이 이해할 수 있도록 코드를 변환시켜주는 장치  
Polyfill : 전역 스코프에 브라우저가 지원하지 않는 API 또는 기능을 구현  
Ponyfill : Ponyfill은 Polyfill과 유사하지만, 전역객체를 수정하지 않는다. (전역 오염 X)   


### Secure contexts

브라우저 환경에서 secure context(보안 컨텍스트) 여부를 확인 한다.  
- isSecureContext 내장 속성 사용

https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts
https://w3c.github.io/webappsec-secure-contexts/

http/https, iframe, service worker 환경에서 현재 context가 secure 상태 인지 아닌지 판단하는 함수  
- eg) 브라우저 https 환경  - secure!  
- eg) http window - not secure
- eg) https iframe in http window - not secure
- eg) service worker from https iframe in http window - not secure  


---

### Service Worker

#### About Service Worker

https://developer.mozilla.org/ko/docs/Web/API/Service_Worker_API

서비스 워커는 웹 페이지와는 별도로 작동하는 백그라운드 서비스.  
- 네트워크 프록시 서버 역할, 네트워크 요청을 가로채기 가능. ( MSW )   
- 푸시 알림, 백그라운드 동기화 API  
- >효과적인 오프라인 경험  


특징  
- 서비스 워커는 워커 맥락에서 실행되기 때문에 DOM에 접근할 수 없습니다.
- 또한 앱을 구동하는 주 JavaScript와는 다른 스레드에서 동작하므로 연산을 가로막지 않습니다(논 블로킹).
- 서비스 워커는 온전히 비동기적으로 설계  -> 동기적 XHR이나 웹 저장소 등의 API를 서비스 워커 내에서 사용 불가
- 서비스 워커는 보안 상의 이유로 HTTPS에서만 동작. -> 중간자 공격에 굉장히 취약  


## ref

Node.js Stream 당신이 알아야할 모든 것
https://jeonghwan-kim.github.io/node/2017/07/03/node-stream-you-need-to-know.html
https://jeonghwan-kim.github.io/node/2017/08/07/node-stream-you-need-to-know-2.html
https://jeonghwan-kim.github.io/node/2017/08/12/node-stream-you-need-to-know-3.html

NodeJs에서 streaming을 활용한 대용량 엑셀 생성하기
- https://kyungyeon.dev/posts/69

Understanding Streams in Node.js
- https://nodesource.com/blog/understanding-streams-in-nodejs/

Node.js Stream - 높은 퍼포먼스의 Node.js 애플리케이션 만들기
- https://the-amy.tistory.com/8

MongoDB, Node.js 및 Streams로 대량 데이터 작업!
- https://medium.com/nerd-for-tech/transform-export-bulk-database-response-without-memory-overflow-using-mongodb-node-js-streams-bcbb3415dd9c

Streaming SQL in Node.js
- https://itnext.io/streaming-sql-in-node-js-eb419c5bd27e

Nodejs Mysql 과 Stream
- https://steemit.com/kr-dev/@ethanhur/nodejs-mysql-stream

Node.js v19.9.0 documentation
- https://nodejs.org/api/stream.html#streams-promises-api

How to Process Large Files with Node.js
- https://stateful.com/blog/process-large-files-nodejs-streams

Node.js Stream 개념을 익혀보자
- https://elvanov.com/2670

node.js로 스트리밍 서버 구축하기
- https://madchick.tistory.com/169

Streams—최종 가이드
- https://web.dev/streams/#%EC%9D%BD%EA%B8%B0-%EA%B0%80%EB%8A%A5%ED%95%9C-%EC%8A%A4%ED%8A%B8%EB%A6%BC-%EB%A7%8C%EB%93%A4%EA%B8%B0