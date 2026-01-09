---
sidebar_position: 3
---

# 4.PoC Tasks  


## 문제 정의  
- 문제 : 파운데이션/LLM 모델에서 도메인 특화된 지식이 없어서 관련이 없는 대답을 주고 있다.  
- 가설 : 임베딩 및 Vector DB 검색 후 RAG  
- 트레이드 오프  
  - 대안, 파인튜닝 
    - Pros, 잘 변하지 않는 도메인 지식으로 특화된 모델을 만들면 RAG의 비용을 줄일 수 있다.
    - Cons, 최신의 정보를 매번 파인튜닝 할 수 없으므로 최신성을 떨어진다.  
  - 지식 베이스 기능 
    - Pros, AWS Bedrock의 프레임워크를 사용하면 빠르게 검증 가능하다.  
    - Cons, 내가 원하는 

## 고민 포인트 
- 1, 임베딩 모델을 어떤것을 써야 하는가?  
  - OpenAI text-embedding-3-small/large  
  - 한국어 특화 성능이 중요하다면 Upstage의 임베딩 모델  
  - AWS Bedrock을 사용 중이라면 Amazon Titan Text Embeddings v2   

- 2, Vector DB는 어떤것을 사용해야 하는가? 
  - Managed (SaaS): Pinecone (가장 대중적), Weaviate.  
  - AWS Native: OpenSearch Serverless (Knowledge Base for Bedrock 연동 시 기본), PGVector (RDS 사용 시).  
  - Open Source: ChromaDB (프로토타입용), Qdrant (고성능).  

- 3, 유사도 검색의 종류와 각 방식의 장단점은 무엇인가?  
- Cosine Similarity;	벡터의 방향성(각도)을 측정	-> 가장 널리 쓰임. 텍스트의 길이에 상관없이 의미적 유사성을 잘 파악함.
- L2 Distance (Euclidean);	점과 점 사이의 직선 거리 측정	-> 데이터의 크기(Magnitude) 자체가 중요할 때 유리함.
- Dot Product;	두 벡터의 내적값 계산	-> 계산이 빠르며, 특정 단어의 중요도가 임베딩에 반영된 경우 유리함.
- 가이드
  - 대부분의 최신 임베딩 모델은 Cosine Similarity에 최적화되어 설계. 실무에서 90% 사용    
  - 코사인 유사도가 커버하지 못하는 예외 사례  
    - 추천 시스템 (Dot Product 유리) : 단순히 취향(방향)만 중요한 게 아니라 별점의 강도(크기) 자체가 중요할 때는 내적(Dot Product)을 사용  
    - 이미지 인식 및 얼굴 인식 (L2 Distance 유리): 시각 데이터는 픽셀 간의 절대적인 거리 차이가 중요  
    - 이상 탐지 (Anomaly Detection): 데이터가 정상 범주에서 얼마나 '멀리' 떨어져 있는지를 절대적 수치로 파악해야 하므로 L2 거리  
  - *데이터가 수억 건이라 속도가 너무 중요하다면? 벡터를 정규화해서 저장한 뒤 내적(Dot Product)으로 검색해서 성능 향상  


- 4, 데이터 소스를 청크할 때 어떤 방식으로 청킹해야 하며, 어떻게 payload를 구성해야 할까?  

- 5, 청킹의 단위를 단순하게 텍스트 크기로 나눈 것 과, 의미론적으로 하나의 완성된 단락으로 나눈것이 크게 차이가 날까?  

- 6, 랭크된 검색 결과에서 유사도 점수가 얼마 이상이면 유의미한 결과라고 판단 해야 할 까?  

데이터 셋 준비  
- 타입 : VTT(Youtube Source), HTML(Blog), PDF Files  

데이터 셋 파싱 방법  
- VTT 
  - 1, 단순하게 텍스트 크기 n개가 되면 청킹한다.  
  - 2, LLM이 요약 후 문단 단위로 데이터 셋을 준비한다.  

- HTML
  - 1, h1, h2 등의 단위로 청킹한다.  
  - 2, LLM이 요약 후 문단 단위로 데이터 셋을 준비한다.  

- PDF Files
  - 1, PDF 파일을 Text 내용으로 변환한다. (Internal Guide PDF)  
  - 2, PDF 파일을 페이지 단위로 청킹 ( Page Text 내용 + 사진 참조(링크) )  
  - 3, AWS Bedrock framework 이용하기
    - S3 업로드 -> 텍스트 추출 및 파싱 -> 청킹 -> 임베딩    
  - 4, 오픈소스 tesseract 이용 ( tesseract page2_img-02.png page2_ocr -l kor+eng && cat page2_ocr.txt )
    - tesseract 텍스트 추출 -> 청킹 -> 임베딩  
    - eg, pdftoppm -png -f 4 -l 4 "file-name.pdf" page4_img && tesseract page4_img-04.png page4_ocr -l kor+eng && cat page4_ocr.txt


Working Backwards


## 부록 - Vector 유사도 검색 방법론  

1. Managed (SaaS): 운영 효율성 중심
- 인프라 관리 부담을 최소화하고 싶은 경우에 적합합니다.
- Pinecone (가장 대중적) 완전 관리형 서버리스 벡터 DB의 선두주자입니다.
  - 설치가 전혀 필요 없고 API 호출만으로 사용 가능하며, 수억 개의 데이터에서도 검색 속도가 매우 빠릅니다.  
  - 단점: 데이터 양이 늘어날수록 비용이 상당히 비싸지며, 데이터가 외부 클라우드에 저장되어 보안 정책에 따라 사용이 제한될 수 있습니다.  

2. AWS Native: 클라우드 생태계 통합
- 기존에 AWS 인프라를 사용 중이고 보안과 통합을 중시할 때 적합합니다.
- 2-1, OpenSearch Serverless (Knowledge Base for Bedrock 전용) : AWS의 생성형 AI 서비스인 Bedrock과 연동할 때 기본으로 권장되는 옵션입니다.  
- Pros, AWS 환경 내에서 보안 설정이 쉽고, 인프라 크기를 자동으로 조절해 줍니다.  
- Cons, '최소 비용' 설정값이 높아 데이터가 적어도 매달 일정 금액 이상의 비용이 발생하며, 쿼리 문법이 다소 복잡합니다.  
- 2-2, PGVector (RDS / Aurora)
  - 특징: 기존에 쓰던 PostgreSQL 데이터베이스에 벡터 검색 기능을 추가한 형태.  
  - 장점: 새로운 DB를 공부할 필요 없이 기존 SQL 문법을 그대로 쓸 수 있고, 사용자 정보 같은 일반 데이터와 벡터 데이터를 한 번에 조회하기 매우 편리.  
  - 단점: 전문 벡터 DB에 비해 검색 성능(속도)이 떨어질 수 있어, 대규모 실시간 서비스에는 한계가 있을 수 있습니다.  

3. Open Source: 유연성과 비용 절감
- 프로토타입을 만들거나, 인프라를 직접 제어하고 싶을 때 적합합니다.
- ChromaDB (프로토타입용), Qdrant (고성능) Rust 언어로 개발되어 성능과 효율성을 극대화한 DB입니다.

