---
sidebar_position: 4
---

# Solidity 입문  4

## 8.블록체인 스마트 계약 & DeFi. 

EVM. 
- 이더리움의 모든 노드에 구현되어 있으며,  
- 이더리움 블록체인 상에서 코드를 실행하는 분산컴퓨팅 환경.  
- 스마트 계약을 실행하며 이를 네트워크에 기록한다.  

컴파일과 옵코드  
- 스마트 계약을 컴파일하면 opcode라는 머신레벨의 언어로 컴파일 된다.  
- 옵코드는 1바이트로 암호화 되며, 사람이 알아보기 쉽게 니모닉으로도 볼 수 있다.  

Constract Storage. 
- 저수준의 언어는 stack을 이용해서 함수에 값을 전달한다.  
- EVM은 256bit(32byte) 레지스터 스택을 사용한다. 스택은 총 한번에 1024 아이템만 접근 및 조작 가능.   
- 레지스터 스택은 연산을 위한 임시 데이터 저장소라고 생각

- 이러한 레지스터의 한계로 contract storage, memory를 사용한다. memory, storage 키워드를 사용하여 데이터를 저장.  
- Constract Storage는 마치 공공 DB처럼 작동, 계약에 트랜젝션을 보내지 않아도 값을 읽을 수 있다.  
  - Storage에 값을 쓰는건 매우 비싸다. 6천배나  
  - Memory는 덜 하다.  
- Constract Memory는 계약 실행 중 임시데이터 저장소 이다.    

저장소 대안  
- 1.이벤트 로그 발생 > 하지만 컨트랙에서 접근은 불가능
- 2.IPFS 
- 3.Merkle 트리 및 해시 사용 : 데이터를 해시값으로 요약 후 저장  

### 블록체인 동작 원리의 비유  
- 투명한 서류 가방 = 블록  
- 체인 = 블록과 블록을 연결하는 해시  
- 트렌젝션 = 거래기록  
- *트렌젝션을 모아 하나의 블록으로 만든다.  


암호화폐 채굴 : 블록이 유효한지 검증하는 과정 그에 대한 보상을 받는 것.   

NFT 란?  
- 대체 불가능한 토큰이다. 화폐가 FT 이다. 1달러 지폐와 다른 1달러 지폐는 동일 하다.  
- 이것은 블록체인의 토큰으로 존재한다.  

### PoW vs PoS   

작업 증명, 지분 증명 모두 블록의 유효성을 판단하기 위한 알고리즘 이다.  

PoW. 
- 채굴(해시값 찾기) > 블록 생성 > 합의  
- *난이도는 해시 파워에 따라 조정 된다.  
- *블록에는 여러 트랜젝션이 포함되며, 최초 블록 생성자에게 보상을 준다.  
- *합의는 가장 긴 체인에 대해 올바른 해시를 가진지 체크 후 자신의 체인에 추가.  

동시에 2개 블록에 전파될 확률은 매우 낮다.  
- 10분에 한번씩 블록이 생성된다. 블록 전파는 수십초 내에 완료된다.  
- 생성 된 블록을 2개 받았다면 2개 모두 임시적으로 유효하다.  
- 처음 받은 블록을 기준으로 채굴을 한다.   
- 결국 하나의 체인은 짧아지며 이는 버려진다.  

PoS. 
- 일부 코인을 스테이킹하여, PoS 지분증명에 사용된다.  
- 악의적인 행동을 하면 슬래싱이라는 패널티를 받는다.  
- 스테이킹한 지분의 일부 혹은 전부를 잃는다.  
- 슬래싱 조건
  - 1.이중 서명 : 동일 슬롯, epoch에서 서로 다른 두 개 블록에 서명하는 경우  
    - *슬롯은 블록 제안의 시간 단위. 고정된 시간 간격이 존재  
    - *epoch은 슬롯의 묶음, 32개가 하나이다. = 대략 6분  
  - 2.잘못된 블록 제안 : 네트워크 규칙에 맞지 않는 블록 제안   
  - 3.의무 불이행 : 장기간 오프라인 상태   