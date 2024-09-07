---
sidebar_position: 2
---

# (Stream) 1.Stream 개념

## 스트림 이란 ?    

스트림은 파일이나 데이터를 관리 가능한 청크로 나누어 모바일,웹 사이트에서 대용량 데이터를 전송하는 방법입니다. - 위키백과(영어)  

스트림 특징
- 스트림의 자료구조는 배열이나 문자열의 데이터 컬렉션 이다.  
- 한번에 모든 데이터를 얻을 수 없습니다.  
- 한번에 한 청크 단위로 가져온다.  

## 언제 사용하는가 ?

### 스트림의 위력 (비유)

스트림을 이용하면, 물로도 건물을 붕괴시킬 수 있는 위력을 가진다.  
- 지상의 호수에 물펌프를 설치한다.  
- 호수로부터 건물 옥상까지 물이 지나가는 파이프라인을 만든다.  
- 건물 옥상에 물을 담아둘 수 있는 큰 수영장을 만들어 , 끌어올린 물을 담는다. 
- 위 파이프라인을 따라 물을 계속 보낸다.  
- 건물이 감당할 수 없는 물이 옥상의 수영장에 차오르면, 건물은 붕괴된다.

호수에 있는 물 : 데이터의 원천, 읽기 가능한 스트림
건물 옥상까지 가는 물을 컨트롤 하는 배관 : 데이터가 흐르는 스트림, 변형 가능한 스트림
건물 옥상의 수영장 : 데이터의 목적지, 쓰기가 가능한 스트림

### 목적  

대용량 데이터를 나누어 전송 할 때 스트림을 사용한다.    

만약 대용량 DB 데이터를 서버에서 한번에 읽어서, 모두 브라우저로 보내면 크게 2가지 문제가 발생할 수 있다.  
- 1.서버/클라이언트 메모리 한계로 임시저장할 데이터의 총량이 제한되어 있다.  
- 2.원천DB 데이터를 읽는데 Lock이 걸릴 수 있다.  

스트림 방식의 처리  
- 파일을 작은 조각 (청크)로 분리해서 읽고, 스트림에 입력하고 필요하다면 일련의 처리 후 출력 스트림으로 내보낸다.

- 청크 : 청크는 파일의 작은 조각이 될 수 있다.  
  - 예를들어 SQL 쿼리의 0번부터 100번 페이지의 조회 결과를 하나의 청크로 만들 수 있다.  
  - eg) Chunk[0] = SQL Query ( pageSize = 100, Page = 0 )

- 파이프라인 : 청크단위의 데이터는 2개 이상의 스트림에서 전송되며, 전체 스트림은 파이프라인이라고 한다.
  - 예를들어 SQL을 읽어서 http 응답으로 쭉 흘려보낼 수 있다.  
  - eg) pipeline = SQL ReadableStream + Http Response WriteableStream


### use case

1.많은 정적파일들이 S3에 존재하는데 이를 압축해서 다운로드 받을때 사용.  

다음과 같은 과정으로 이루어 진다.  
- Node.js 에서 다수의 S3의 파일을 읽어서 > 큰 용량의 압축파일을 만들면서 > 브라우저로 보내면서 > 브라우저 받으면서 다운로드

정리하면 다음 과 같다.  
- Source : S3 ( Readable Stream )
- Transform : zip ( Transform Stream )
- Transform : Network I/O  ( Transform Stream )  
- Desination : browser를 실행시키고 있는 컴퓨터의 디스크 ( Writeable Stream )

2.소득과 관련된 DB데이터를 읽어서 보고서를 작성하여 S3에 저장하는 처리.  
- 1년 소득 연간 보고서 SQL > 데이터 파싱을 거쳐 CSV 파일 > S3에 업로드

3.소득과 관련된 DB데이터를 읽어서 보고서를 작성하여 웹에서 다운 받는 처리.  
- 1년 소득 연간 보고서 SQL > 데이터 파싱을 거쳐 엑셀파일 > 브라우저에서 다운로드


## 스트림의 구조 및 종류  

### 스트림 구조

스트림의 시작은 원천데이터를 읽는 Readable Stream으로 시작한다. 파이프라인을 구성하는 중간 스트림들을 Transform Stream이라고 한다. 
마지막에 목적지 데이터를 쓰는 스트림은 Writeable Stream 이라고 한다.  

전체 파이프라인 : Readable Stream 1개 + Transform Stream N개 + Writeable Stream 1개 ( N >= 0 ).  
- 스트림의 집합은 파이프라인이라고 한다.  
- 데이터를 쪼개서 청크 단위로 upstream > down stream 으로 흘려 보낸다.  
- 각 스트림은 버퍼가 존재한다.  
- 스트림과 스트림은 서로 이벤트를 발생시킨다.  
- 이러한 이벤트를 통해서 스트림이 drain (비어있는) 상태인지 pump(채우는) 상태인지 알 수 있다.    


### Reable Streams, Writeable Stream 종류  

Reable Streams
- HTTP responses(client).
- HTTP requests(server).
- fs read streams.
- zlib streams.
- crypto streams.
- TCP Sockets.
- process stdin.
- child process stdout and stderr (in parent)


Writeable Streams
- HTTP requests(client).
- HTTP responses(server).
- fs write streams.
- zlib streams.
- crypto streams.
- TCP Sockets.
- process stdout and stderr.
- child process stdin (in parent)

HTTP와 스트림
- 클라이어트에서는 HTTP 응답이 읽기 가능한 스트림
- 반면 서버에서는 쓰기 가능한 스트림이 됩니다


### 이벤트 플로우
1. upstream 에서 데이터를 펌핑(추출)해서 청크 크기 만큼 downstream으로 보낸다.
2. downstream 은 데이터가 들어오면 이벤트로 알게 된다.
3. downstream 데이터가 처리가 다 되면 upstream에게 데이터를 달라고 요청한다.
4. 위 과정의 반복으로 모든 청크파일이 보내지면 종료 이벤트를 보낸다.

