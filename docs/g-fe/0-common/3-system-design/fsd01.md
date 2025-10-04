---
sidebar_position: 1
---

# FE System Design - Financial Dashboard

## Process 

- 1.요구사항 분석, 기능/비기능 요구사항   
- 2.UI 레이아웃 설계   
- 3.컴포넌트 설계   
- 4.상태관리 설계   
- 5.API Interface 설계, 프로토콜 정립  
- 6.멀티윈도우 설계  

## Requirements  

Product Requirements:  
- 1. Dashboard should support multiple resizable charts
- 2. Data can come from different data-sources
- 3. Each-chart on the dashboard can have a different data-model, however the model that comes from the server is a generic
- 4. You can add same charts multiple times and synchronize them using different parameters:
  - ticker
  - timeframe

Non-product requirements:  
- 1. Network performance. Although, we expect that we have a good network connect, it would be great to understand how to optimize efficiency
- 2. Rendering Stability. When we change the parameters of the data, can we still display a partial chart, while fetching a new chunk of data
- 3. Legacy API. We need to implement architecture that would support any underlying API as long as it follows a data-format we establish  


## Layout Design  

핵심 컨셉 : 샌드위치 디자인    

3중 레이어로 구조를 잡는다.  
1. Grid Container : N*N개의 셀을 담는 컨테이너, 이벤트 위임을 담당한다.  
2. Cell Grid : 좌표를 담당하며 데이터는 어트리뷰트로 가진다.  
3. Chart Layer : 실제 그러지는 차트 컨테이너 이다.  


- 부모 컨테이너 요소와 자식 요소가 64개 이상 많을때 이벤트 핸들러를 자식에 계속 추가하는것은 성능상 좋지않다.  
- 이벤트 루프에 많은 이벤트 핸들러가 등록되었으니 느려질 수 있다.  이벤트 버블링을 이용해서 감지하자.  


## 상태관리 설계  

핵심 컨셉 : 버켓팅, IndexDB, 다운 샘플링, 업샘플링  
- IndexDB는 유일하게 브라우저의 데이터를 하드디스크에 저장할 수 있는 수단이다.   
- 시계열 데이터를 버킷(파티션 형태)으로 관리한다.   

다운 샘플링  
- 5분 짜리 캔들의 버킷 데이터 12개로 1시간짜리 캔들을 만들 수 있다.  
- 네트워크 요청없이 자체적으로 계산 가능하다.  
- CPU I/O vs 네트워크 I/O 중 더 효과적인것으로 택한다.  

공간복잡도 계산  
1. asset_id	8 bytes	자산(종목)을 식별하는 고유 ID (예: 64비트 정수)  
2. open, close	8 bytes	시가(Open) 4 bytes, 종가(Close) 4 bytes. (아마도 부동소수점 Float32를 가정)  
3. bucket	4 bytes	캔들의 타임스탬프 또는 버켓 ID (예: 32비트 정수/초 단위 UNIX Time)  
4. timeframe	2 chars = 2 bytes	시간 간격(예: "1m", "5m", "1h")을 저장하는 문자열  
총 기본 레코드 크기	22 bytes	(8 + 8 + 4 + 2)  

해석 1: 1초(Second) 데이터 기준 (최대 1일)
- 86400: 하루(1일)는 24시간 × 60분 × 60초 = 86,400초입니다.
- 8 bytes: 만약 각 1초마다 8 bytes 크기의 데이터(예: 종가만)를 저장한다고 가정하면,
- 1일 저장 공간=86400×8 bytes≈0.7 MB

해석 2: 1년치 저장 공간 (원시 1초 데이터 기준)  
- 365: 1년(365일)을 가정하여 위의 1일 저장 공간을 곱합니다.  
- 1년 저장 공간=0.7 MB×365≈255 MB  


## 네트워크 API 설계   

프로토콜 장단점 비교  

Websockets	
- Pros : Real-time communication, Binary data 지원, Dual communication (양방향)
- Cons : Eng complexity (직렬화, 에러 핸들링, 상태 관리의 복잡성)

SSE (Server-Sent Events)
- Pros : HTTP/2 기반, Stateless (상태 없음), Reconnecting and error handling comes out of the box (재연결/에러 처리 기본 지원), Multiplexing (다중화 용이), Easy to scale and use (확장 용이 및 사용 편리)	
- Cons : Slower than Web-sockets (Websocket보다 느릴 수 있음), Text-data 기반 (이진 데이터 처리에 불리), Mono-channel (단방향)

HTTP Streaming
- Pros : Binary data 지원, Benefits from HTTP/2 (HTTP/2의 장점 활용)	
- Cons : Pretty slow (TCP) (상대적으로 느림), No frame marking (프레임 구분 어려움)

Web Transport
- Pros : UDP 기반 / QUIC / SRTT (더 빠른 프로토콜 활용), Faster the web-sockets (Websocket보다 빠름), Binary data 및 데이터 프레이밍 지원	
- Cons : Limited browser & server support (브라우저/서버 지원이 제한적)

데이터 인코딩 최적화 (Protobuf)
- Protobuf (Protocol Buffers): Google에서 개발한 언어 중립적, 플랫폼 중립적, 확장 가능한 직렬화 메커니즘입니다.  
- 효과: JSON이나 XML 같은 텍스트 기반 인코딩 방식과 달리, Protobuf는 데이터를 바이너리(Binary) 형태로 인코딩하여 전송합니다. 이 때문에 데이터 크기가 훨씬 작아지고(압축 효율), 인코딩/디코딩 속도가 빠릅니다.  
- Protobuf를 사용할 경우, JSON 같은 일반적인 텍스트 기반 인코딩에 비해 데이터 크기가 6~8배 정도 작아지거나 혹은 처리 속도가 6~8배 정도 빨라진다는 성능 개선 효과를 추정하는 것입니다. 금융 데이터처럼 대용량 시계열 데이터를 전송할 때 매우 중요한 최적화 요소입니다.  


## 다중 창 지원, 멀티 윈도우 지원  
- SSOF 구현, Index DB를 쓰는 창은 1개여야 한다.
- 메인 노드와 워커 노드를 구분해야한다. ( Local Storge를 통해 구분 )     
- Broadcast Channel과 이벤트 시스템을 구현한다.  
  - Race Condition을 피하기 위해서 워커노드의 변경사항들은 메인노드에게 채널로 전송하여 데이터를 처리한다.    
- 특히 *논리적 오류(Logical Race Condition)* 주의  


