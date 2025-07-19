---
sidebar_position: 0
---

# n8n - 시작하기 앞서  


Youtube 스크립트 및 요약 파이프라인에 n8n을 사용했었다.  

- 여러가지 문제점이 발생하여, n8n 사용을 최소화 하고자 한다.

문제점 

- ( 결국 코딩으로 )
    - Rate Limiter가 필요한 경우 → await 기능을 사용가능하나, 결국 api level global rate limiter를 만들어야한다.
    - Database, API Interface  변화로 여러 워크플로우를 수정해야 하는 문제
    - Notion을 Block 단위 퍼블리싱 불가능, Text만 삽입 가능
    - Ghost CMS 등 인터페이스가 한정적
    - Vector DB 넣는것도 정해진 DB Table(Interface)에서만 가능.

사용 방안

*Nestjs에서 처리할 로직 vs n8n에서 처리할 로직 고민하기.  

- 워크플로우 Batch 트리거링 용도
    - ㄴ워크플로우내 호출해야하는 API는 1개에 가깝게 한다.
- 글로벌 얼럿 및 디스코드 연결
- Input, output 관리는 Spread Sheet 로 좋은듯 ( 시트는 자주 수정되고 입출력 인터페이스 용도로만 )