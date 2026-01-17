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


## 부록 - Graph RAG 

백터 기반 RAG는 언어/의미론적으로 유사도가 높은 청크 데이터를 가져올 수 있다.    
- 관련성(relevant)이 있으나 언어/의미론적(language/semantics)으로 낮은 정보를 가져올 때 유용  
- 가족관계, 인과관계, 시간/공간의 인접성, 분류적인 관계 등  


LlamaIndex(라마인덱스) : 여러분의 개인 데이터와 거대 언어 모델(LLM)을 연결해 주는 역할  
- 데이터 커넥터, 데이터 인덱싱, 쿼리 엔진  

인덱싱 순서  
1, Extract   
LlamaIndex (MarkdownNodeParser): 마크다운 문서를 제목 단위로 큼직하게 썰어서 LLM이 읽기 좋게 서빙합니다.

LLM (GraphRAG Toolkit): 썰어놓은 텍스트 조각들을 하나씩 읽으며 **"여기서 누가 주인공이지? 얘네 둘은 무슨 사이야?"**라고 자문자답하며 JSON 형태의 그래프 데이터를 생성합니다.

Storage: 그 결과물을 그래프 DB(Neptune 등)에 저장합니다.

--- 
```
제공해주신 JSON 데이터는 AWS 설명서(특히 Amazon Neptune의 인스턴스 유형 선택 가이드)에서 추출된 구조화된 정보입니다. 이 데이터는 문서의 텍스트뿐만 아니라 그래프 기반의 관계 정보, 메타데이터, 그리고 시스템 관리를 위한 필드들을 포함하고 있습니다.

각 주요 필드에 대한 메타 정보 정리입니다.

---

### 1. 기본 식별 및 구조 정보

* **`id_`**: 노드의 고유 식별자입니다 (`aws::e61317db...`).
* **`text`**: 실제 사용자에게 보여지는 문서의 **본문 내용**입니다. `r7g` 인스턴스 제품군의 특징(Graviton3 프로세서 사용, 성능 향상 등)이 담겨 있습니다.
* **`mimetype`**: 콘텐츠의 형식이며, 여기서는 일반 텍스트(`text/plain`)로 지정되어 있습니다.
* **`class_name`**: 이 데이터 객체의 클래스 타입인 `TextNode`를 나타냅니다.

### 2. 문서 소스 정보 (Metadata)

* **`file_name`**: 원본 파일 이름 (`instance-types.md`).
* **`header_path`**: 문서 내에서 해당 내용이 위치한 경로입니다 (`/**Choosing instance types for Amazon Neptune**/`).
* **`start_char_idx` / `end_char_idx**`: 전체 원본 문서에서 이 텍스트 블록이 차지하는 시작과 끝 문자 위치입니다.

### 3. 지식 그래프 및 논리적 분석 (aws::graph)

이 섹션은 AI가 텍스트를 더 잘 이해하도록 논리적으로 분해한 핵심 정보입니다.

* **`propositions`**: 텍스트에서 추출한 개별적인 사실(명제)들의 목록입니다. (예: "r7g 제품군은 Graviton3 프로세서를 사용함")
* **`topics`**: 텍스트 내 주요 주제와 개체(Entities)를 분류합니다.
* **`entities`**: `r7g family`, `AWS Graviton3`, `OLTP` 등 주요 기술 키워드를 'Product' 등의 카테고리로 분류했습니다.
* **`statements` & `facts**`: "주어(Subject) - 서술어(Predicate) - 목적어(Object)" 형태로 관계를 구조화하여 기계가 논리 추론을 할 수 있게 합니다. (예: `r7g family` -> `USES` -> `AWS Graviton3 processor`)



### 4. 관계 및 인덱싱 (Relationships)

* **`relationships`**: 이 노드와 연결된 다른 노드(부모, 형제, 혹은 연관된 문서 조각)들과의 ID 및 연결 유형 정보를 담고 있습니다.
* **`hash`**: 데이터의 무결성 검증이나 변경 사항 추적을 위한 해시값입니다.

### 5. 설정 및 템플릿

* **`metadata_template` / `text_template**`: 메타데이터와 본문을 결합하여 LLM(대규모 언어 모델)에게 전달할 때 사용할 출력 형식을 정의합니다.
* **`excluded_embed_metadata_keys`**: 임베딩(벡터화) 처리 시 제외할 메타데이터 키 목록입니다 (파일 크기, 수정 날짜 등 의미론적 가치가 낮은 정보 제외).

---

**요약하자면:** 이 JSON은 단순히 텍스트만 저장한 것이 아니라, **RAG(검색 증강 생성) 시스템이나 지식 그래프 기반의 AI**가 특정 AWS 인스턴스 정보를 정확하게 검색하고 추론할 수 있도록 고도로 가공된 데이터 유닛입니다.

이 정보와 관련하여 `r7g` 인스턴스의 구체적인 성능 수치나 다른 인스턴스(r6g 등)와의 비교 분석이 더 필요하신가요?
```
--- 
2, Build : 추출한 정보를 실제 Graph/Vector Store에 넣는 과정   

GraphRAG Toolkit 
- 미리 정해진 Hierarchical Lexical Graph(계층적 어휘 그래프) 라는 그래프 모델에 데이터를 빌드한다.   
- 목적 : 사용자의 질문(user query)에 가장 올바른 대답(statement)을 찾아내기.  
- 

```
Lexical Graph
The GraphRAG Toolkit builds a particular kind of graph model, called a hierarchical lexical graph.

This graph has a very specific purpose: to make it easy to find sets of relevant statements that can be used to answer the user's question.

Statements are the key data elements in the lexical graph. You can think of the entire lexical graph as a "bucket" of statements, with other nodes (sources, chunks, topics, facts and entities) playing specific roles to help find and organize statements:

Sources Contain source document metadata for filtering and versioning
Chunks Provide vector-based entry points into the graph
Statements Standalone propositions - the primary unit of context supplied to an LLM
Topics Thematically group statements belonging to the same source
Facts Connect statements belonging to different sources
Entities Represent domain semantics of dataset
```
요소 (Node)	역할	비유
Sources	문서의 출처, 메타데이터, 버전 정보 관리	도서관의 장서 목록 (어떤 책에서 왔는가?)
Chunks	벡터 검색을 통해 그래프로 진입하는 입구	도서관 안내 데스크 (어디로 가야 정보를 찾지?)
Topics	한 문서 내에서 같은 주제를 다루는 문장들을 그룹화	책의 '장(Chapter)'
Statements	가장 중요한 핵심 단위. LLM에게 전달될 독립된 명제	책 속의 핵심 문장 (실제 답변의 재료)
Facts	여러 문서에 걸쳐 공통된 내용을 연결	서로 다른 책들을 잇는 '참고 문헌'
Entities	도메인의 구체적인 개념 (예: r7g, Graviton3)	색인(Index)에 등록된 주요 키워드


"Implicit Domain Semantics" (암시적 도메인 의미론)  
- 예를 들어, AWS 문서를 분석하다 보면 **'인스턴스(Instance)'**와 **'프로세서(Processor)'**라는 단어가 자주 등장하고, 둘 사이에는 항상 **'사용한다(Uses)'**라는 관계가 있다는 것을 AI가 눈치챕니다.  
- Schema Nodes" (스키마 노드) 위에서 찾은 '패턴'을 아예 규칙으로 만든 것이 스키마 노드
- 스키마 유도(Schema Induction) : LLM이 데이터를 분석  
  - 🔍 스키마가 자동으로 만들어지는 과정
  - 데이터 관찰: LLM이 r7g, Graviton3, Neptune 같은 단어들을 읽습니다.
  - 분류(Typing): r7g는 '인스턴스(Product)' 타입이고, Graviton3는 '프로세서(Product)' 타입이라고 라벨을 붙입니다. (아까 보신 JSON의 classification 필드가 이 역할을 합니다.)
  - 관계 추론: "A가 B를 사용한다(USES)" 혹은 "A가 B의 일부다(PART_OF)"라는 문장들을 수집합니다.
  - 일반화(Generalization): 수많은 사실을 종합하여 **"이 도메인에서는 'Product' 노드와 'Product' 노드가 'USES'라는 관계로 연결될 수 있다"**라는 규칙을 도출합니다.


```
GraphRAG의 **내부 쿼리 과정**은 일반적인 RAG보다 훨씬 정교합니다. 단순히 질문과 닮은 텍스트를 찾는 게 아니라, **'검색 → 그래프 탐색 → 컨텍스트 재구성'**이라는 3단계 프로세스를 거칩니다.

사용자가 **"r7i와 r8g의 차이점은?"**이라고 물었을 때의 과정을 예로 들어 설명해 드릴게요.

---

### 1단계: 진입점 찾기 (Vector Search)

먼저 질문에서 핵심 키워드인 `r7i`, `r8g`, `difference` 등을 추출합니다.

* **벡터 검색:** 벡터 저장소에서 질문과 가장 의미적으로 가까운 **Chunk(텍스트 조각)**와 **Topic(주제)** 노드를 찾습니다.
* **결과:** "이 질문은 아마도 `r7i` 인스턴스 정보와 `r8g` 성능 비교 섹션에 답이 있을 것 같다"는 단서를 얻습니다.

### 2단계: 그래프 탐색 (Graph Traversal)

여기서 GraphRAG의 진가가 발휘됩니다. 찾은 단서를 바탕으로 그래프 DB 내부를 **'항해'**합니다.

1. **엔티티 식별:** `r7i` 노드와 `r8g` 노드를 그래프 상에서 딱 찍습니다.
2. **관계 추적:** 각 노드에 연결된 화살표(Edge)들을 따라가며 정보를 수집합니다.
* `r7i` → [HAS_PROCESSOR] → `Intel Sapphire Rapids`
* `r8g` → [HAS_PROCESSOR] → `AWS Graviton4`
* `r8g` → [HAS_PERFORMANCE] → `30% better than r7g`


3. **명제 수집:** 연결된 `Statement(명제)` 노드들을 전부 긁어모읍니다. 이때 대명사가 실제 이름으로 바뀐 **'자립형 문장'**들이 모이게 됩니다.

### 3단계: 컨텍스트 재구성 및 LLM 응답

그래프에서 수집된 정보들은 이미 파편화된 조각이 아니라, **서로 연결된 사실들의 집합**입니다.

1. **컨텍스트 생성:** 수집된 명제들을 LLM이 읽기 좋은 순서로 나열합니다. (예: r7i의 스펙 명제들 + r8g의 스펙 명제들)
2. **최종 답변 생성:** LLM은 제공된 명제들만 보고 "r7i는 인텔 기반이고, r8g는 그라비톤4 기반입니다. 두 모델의 주된 차이점은..."과 같이 논리적인 비교 답변을 작성합니다.

---

### 💡 일반 RAG와 무엇이 다른가요?

| 과정 | 일반 RAG (Simple RAG) | GraphRAG (Lexical Graph) |
| --- | --- | --- |
| **검색 대상** | 유사한 단어가 포함된 **문단 덩어리** | 질문과 관련된 **엔티티와 연결된 사실들** |
| **정보의 정확도** | 문단에 노이즈(상관없는 말)가 섞임 | 필요한 **명제(Statement)**만 골라옴 |
| **추론 능력** | 여러 문서에 흩어진 정보 연결이 어려움 | **Fact** 노드가 문서 간 다리를 놓아줌 |

### 🏃 요약하자면

내부적으로는 **"지도를 보고(Vector Search) → 길을 따라가서(Graph Traversal) → 필요한 재료만 담아 요리(LLM Generation)하는 과정"**이라고 할 수 있습니다. 덕분에 정보가 꼬이지 않고 매우 정확한 비교가 가능해집니다.

---

실제로 쿼리를 날렸을 때, AI가 어떤 노드들을 방문했는지 **탐색 경로(Trace)**를 직접 확인해보고 싶으신가요?
```
```
Based on the search results, here are the key differences between the r7i and r8g instance families:

**Processor Architecture:**
- The r7i family uses a 2-socket Intel CPU architecture, while the r8g family has a single-socket architecture powered by AWS Graviton4 ARM-based processors [Source: instance-types.md]

**Performance Scaling:**
- The r8g family's single-socket architecture enables linear performance scaling from r8g.large to r8g.16xlarge, whereas the r7i family's 2-socket architecture has enhanced memory management between physical processors but inherently includes some memory-management overhead [Source: instance-types.md]

**Performance Improvements:**
- The r8g instances provide approximately 15-20% better performance for graph queries compared to r7g instances (note: this compares r8g to r7g, not r7i) [Source: instance-types.md]
- The r7i instances provide approximately 15% better compute price/performance than comparable r6i instance types and up to 20% higher memory bandwidth per vCPU than r6i instances [Source: instance-types.md]

**Optimization Focus:**
- The r8g family is specifically described as memory-optimized and well-suited for memory-intensive graph workloads [Source: instance-types.md]
- The r7i family architecture is noted to be similar to the r5 family [Source: instance-types.md]

**Largest Instance Size:**
- Both families offer their largest instance type as a 16xlarge configuration (r7i.16xlarge and r8g.16xlarge) [Source: instance-types.md]

The r8g family represents a newer generation with ARM-based processors optimized for graph workloads, while the r7i family continues with Intel-based architecture similar to previous generations.
```

📌 Querying  

Query process 
- 1, Retrieve  
  - 사용자 질문에 대해서 임베딩을 만든다.  
  - 임베딩 유사도 검색 진행 -> Top K개의 청크 id 검색을 완료  
  - graph traversal을 통해 chunk ids -> entry points 변환  
- 2, Generate  
  - LLM에게 본래의 사용자 질문과, graph traversal 결과를 입력한다.   

💡 왜 Neptune(그래프 DB) 자체에도 벡터를 저장할 수 있지만, 일반적으로는 외부 벡터 전용 저장소(Vector Store)와 협력하는 구조?  
- 성능과 비용: 벡터 전용 엔진(OpenSearch 등)은 수백만 개의 벡터 사이에서 유사도를 찾는 속도가 매우 빠르고 최적화되어 있습니다.
- 유연성: 그래프 데이터는 복잡한 관계를 관리하는 데 집중하고, 벡터 데이터는 대규모 검색에 집중하도록 역할을 분리하는 것이 관리하기 편할 때가 많습니다.

💡 Multi-Tenancy
- **Multi-Tenancy(멀티 테넌시)**는 하나의 거대한 인프라(Neptune DB, Vector DB 등)를 여러 개의 독립된 구역으로 나누어 사용하는 기술입니다.
- GraphRAG Toolkit은 내부적으로 
  - 그래프 검색 시: MATCH (n {tenant_id: 'ecorp'}) ... 와 같이 해당 테넌트의 노드만 탐색하도록 쿼리를 생성합니다.
  - 벡터 검색 시: 벡터 DB의 Metadata 필터 기능을 이용해 tenant_id == 'ecorp'인 벡터값들 사이에서만 유사도를 계산합니다.


순수 벡터 검색(Pure Vector Search)**만 사용했을 때의 성능을 확인
- Vector Search: 질문과 "가장 비슷한 문장"을 가진 덩어리(Chunk)를 찾아옵니다.
- Graph Search (나중에 수행): 엔티티 간의 "관계"를 추적하여 여러 문단에 흩어진 정보를 엮어서 대답합니다.  

The press releases tell a story. In summary:
- Example Corp sells Widgets
- There is a huge Christmas demand for Widgets in the UK
- Example Corp has partnered with AnyCompany Logistics
- AnyCompany Logistics is cutting shipping times by using the Turquoise Canal
- The Turquoise Canal is blocked, causing delays
  - "영국(UK)에서의 매출 전망은?"이라는 질문에 대해 벡터 검색은 아마도 다음과 같이 답할 것입니다.
  - 예상 답변: "영국 시장에 관한 언급이 있는 특정 보도자료 문단을 찾았습니다. 그 내용은 이렇습니다..."


```
Based on the search results, Example Corp has very strong sales prospects in the UK, particularly for their Widget product.

The most compelling evidence comes from the UK toy industry's response to the Widget. Industry analysts have already named Example Corp's Widget as the predicted number one "must-have toy for 2025" for the Christmas season [Countdown to Christmas.md]. This prediction has generated significant commercial activity, with major UK retailers placing substantial advance orders despite it being only August - months before the typical holiday shopping season begins [Countdown to Christmas.md].

The scale of early demand is impressive: leading toy store chains across major UK cities including London, Manchester, and Birmingham have collectively placed orders for over 1 million Widget units, representing a total value of $15 million [Countdown to Christmas.md]. Industry analysts note this represents "an unprecedented level of pre-orders this far out from the holiday season," indicating retailers are taking extraordinary measures to avoid potential stock shortages [Countdown to Christmas.md].

This strong UK market response aligns with the broader global expansion strategy Example Corp has implemented through their partnership with AnyCompany Logistics, which provides international shipping and distribution capabilities to reach worldwide audiences [Revolutionizing Personal Computing.md]. The Widget's innovative AI-powered conversational capabilities and its positioning as a revolutionary personal computing device appear to have created significant market anticipation [Revolutionizing Personal Computing.md].

The combination of industry analyst predictions, substantial retailer pre-orders, and the product's innovative technology suggests Example Corp has excellent sales prospects in the UK market for 2025.

제시해주신 텍스트는 **Example Corp의 주력 제품인 'Widget'이 2025년 영국 시장에서 매우 강력한 판매 전망을 보이고 있다**는 내용을 담고 있습니다. 주요 요약 내용은 다음과 같습니다.

### 1. 시장의 폭발적인 반응

* **크리스마스 ‘머스트 해브’ 아이템:** 업계 분석가들은 Widget을 2025년 크리스마스 시즌의 **예상 1위 필수 장난감**으로 선정했습니다.
* **이례적인 선주문:** 8월임에도 불구하고 주요 유통업체들이 이미 대규모 선주문을 완료했습니다. 이는 휴가 시즌을 한참 앞둔 시점이라 매우 이례적인 현상으로 평가받습니다.

### 2. 구체적인 성과 및 수치

* **판매 규모:** 런던, 맨체스터, 버밍엄 등 영국 주요 도시의 대형 장난감 체인점에서 **100만 대 이상의 유닛(약 1,500만 달러 규모)**을 선주문했습니다.
* **공급망 관리:** 소매업체들은 향후 발생할 수 있는 재고 부족 사태를 방지하기 위해 선제적으로 전례 없는 수준의 물량을 확보하고 있습니다.

### 3. 제품 경쟁력 및 전략

* **기술적 혁신:** **AI 기반의 대화형 기능**을 탑재하여 혁신적인 개인용 컴퓨팅 기기로 포지셔닝한 것이 시장의 기대를 모았습니다.
* **글로벌 유통망:** AnyCompany Logistics와의 파트너십을 통해 전 세계로 확장 가능한 국제 배송 및 유통 역량을 확보했습니다.

---

**결론적으로**, 혁신적인 AI 기술과 강력한 초기 수요, 탄탄한 물류 파트너십이 결합되어 **2025년 Example Corp의 영국 내 성공 가능성은 매우 높음**을 시사합니다.

이와 관련하여 **영국 외의 다른 지역(예: 북미나 아시아) 시장 전망**에 대해서도 추가로 정리해 드릴까요?

```

The response is detailed, but it is not complete. It is overly _optimistic_.

```
Chunk 1:

"By seamlessly blending conversational capabilities with a captivating physical form factor, Example Corp has created a product that has the potential to revolutionize the way we interact with our personal devices. This partnership with AnyCompany Logistics is a strategic move that will undoubtedly accelerate the Widget's global adoption."

With the expanded distribution channels facilitated by the AnyCompany Logistics partnership, Example Corp is poised to introduce the Widget to a worldwide audience, empowering users to experience the future of personal computing and AI-driven companionship. As the hype surrounding this revolutionary product continues to build, technology enthusiasts and early adopters alike eagerly await the global availability of the Widget, a testament to the transformative power of innovation.

------------------

Chunk 2:

# Revolutionizing Personal Computing: Example Corp's Widget Expands Global Reach Through AnyCompany Logistics Partnership

February 2nd, 2025 - In a move that promises to bring the innovative Widget personal gizmo to the fingertips of consumers around the world, Example Corp, the US-based technology powerhouse, has announced a strategic partnership with AnyCompany Logistics. This collaboration will significantly expand the global distribution channels for the highly anticipated Widget, leveraging AnyCompany's expansive international shipping, storage, and last-mile delivery capabilities.

Developed at the cutting-edge Example Corp labs in Austin, Texas, the Widget is a groundbreaking AI-augmented personal desktop pet that has captivated technology enthusiasts and early adopters. Powered by a new breed of generative AI technologies, the Widget's conversational abilities allow users to engage in natural, human-like interactions, blurring the line between technology and companionship.

"The Widget represents a transformative shift in the way we interact with our personal devices," said John Smith, CEO of Example Corp.

------------------

Chunk 3:

Its AI-powered capabilities allow users to engage in a wide range of interactions, from task assistance and information retrieval to companionship and entertainment.

"The Widget is more than just a personal gizmo; it's a window into the future of human-technology interaction," said Dr. Sarah Lee, lead researcher at the Example Corp AI lab. "By harnessing the power of generative AI, we've created a device that can truly understand and respond to user needs in a natural, intuitive manner. This partnership with AnyCompany Logistics will help us bring this transformative technology to a global audience."

The announcement of the Example Corp and AnyCompany Logistics partnership has generated significant buzz within the technology industry and among consumers worldwide. Industry analysts and early adopters alike are eagerly anticipating the global availability of the Widget, which is poised to redefine the boundaries of personal computing and AI-driven companionship.“

The Widget represents a quantum leap in the integration of AI into consumer technology," said technology analyst, John Doe.

------------------

Chunk 4:

# Countdown to Christmas: UK Retailers in a Frenzy Over Example Corp's Latest "Must-Have" Toy

August 15th, 2025 - With the holiday shopping season still months away, the UK toy industry is already in a frenzy over what is predicted to be this year's top-selling Christmas gift. Industry analysts have named Example Corp's new "Widget" chatty desktop pet as the must-have toy for 2025, and major retailers across the country have wasted no time placing massive orders to meet the anticipated demand.

Despite it being the middle of August, the top-10 Christmas toy predictions have already been released, and the Widget from Example Corp sits firmly at number one. "We're seeing an unprecedented level of pre-orders this far out from the holiday season," said industry analyst Samantha Watkins. "Retailers understand that they need to get ahead of this trend if they want to avoid stock shortages come December."

Leading toy store chains in London, Manchester, Birmingham and other major cities have collectively placed orders for over 1 million Widget units, valued at a staggering $15 million.

------------------

Chunk 5:

"By seamlessly integrating AI-driven conversational capabilities, the Widget oﬀers a level of personalization and engagement that has never been seen before in the consumer technology market. Our partnership with AnyCompany Logistics is a crucial step in ensuring that this revolutionary product reaches the global audience it deserves."

AnyCompany Logistics, a leading international shipping, storage, and last-mile distribution provider, has been carefully selected by Example Corp to facilitate the Widget's worldwide distribution. With a vast network of logistics hubs and delivery infrastructure spanning multiple continents, AnyCompany is uniquely positioned to ensure the eﬃcient and reliable delivery of the Widget to customers around the globe.

"We are thrilled to be partnering with Example Corp to bring the incredible Widget technology to consumers worldwide," said Jane Doe, CEO of AnyCompany Logistics. "Our extensive experience in navigating the complexities of global logistics, combined with Example Corp's innovative vision, will ensure that the Widget is accessible to a truly international customer base."

The Widget, which is currently manufactured in Taiwan, boasts a sleek and compact design that seamlessly blends into any workspace or living environment.

------------------

>>>🎯 2.6 Query the data using graph-enhanced search


Based on the search results, Example Corp has very strong sales prospects for their Widget product in the UK market.

The UK toy industry is experiencing significant excitement around the Widget, with industry analysts naming it as the must-have toy for 2025 [Source: Countdown to Christmas.md]. Leading toy store chains across the UK have collectively ordered over 1 million Widget units, representing a total value of $15 million, which demonstrates substantial retailer confidence in the product's market potential [Source: Countdown to Christmas.md].

The Widget is predicted to be the top-selling Christmas gift in 2025, with experts expecting it to be "the absolute must-have item under Christmas trees across the UK" [Source: Countdown to Christmas.md]. The level of demand is described as "absolutely unprecedented," indicating exceptionally strong consumer interest [Source: Countdown to Christmas.md].

Example Corp has invested heavily in marketing to support these sales prospects, launching a massive marketing campaign that includes celebrity endorsements and social media influencer partnerships, which has successfully built hype and excitement around the Widget [Source: Countdown to Christmas.md].

However, there are some potential challenges that could impact sales prospects. Example Corp's partnership with AnyCompany Logistics for global distribution may face disruptions due to the recent Turquoise Canal blockage caused by landslides [Source: Turquoise Canal Blocked by Landslides.md]. This blockage is expected to create product shortages and could affect delivery times for months, which might impact the availability of Widgets during the crucial Christmas shopping season [Source: Turquoise Canal Blocked by Landslides.md].

Despite these logistical challenges, the fundamental market demand and retailer commitment suggest that Example Corp's sales prospects in the UK remain very promising, particularly if supply chain issues can be resolved.



## 📈 판매 전망: "매우 낙관적"

Example Corp은 2025년 영국 시장에서 **강력한 판매 잠재력**을 보유한 것으로 평가됩니다.

### 1. 전례 없는 시장 수요

* **2025년 최고의 장난감:** 업계 분석가들은 Widget을 2025년 크리스마스 시즌의 **'반드시 가져야 할 장난감(Must-have toy)' 1위**로 선정했습니다.
* **기록적인 선주문:** 영국 전역의 주요 장난감 체인점에서 이미 **100만 대 이상의 유닛(약 1,500만 달러 규모)**을 주문했습니다. 이는 소매업체들의 강한 신뢰를 보여줍니다.
* **소비자 기대감:** 전문가들은 Widget이 2025년 크리스마스트리 아래 가장 많이 놓일 선물 중 하나가 될 것으로 예측하며, 수요 수준을 "전례 없는 수준"이라 평가하고 있습니다.

### 2. 공격적인 마케팅 전략

* **대규모 캠페인:** 유명 인사(Celebrity)의 지지와 소셜 미디어 인플루언서 협업을 포함한 대대적인 마케팅을 통해 제품 출시 전부터 강력한 '하이프(Hype, 열풍)'를 형성하는 데 성공했습니다.

---

## ⚠️ 주요 리스크: "물류 및 공급망 차단"

긍정적인 수요에도 불구하고, 실제 판매 성과를 저해할 수 있는 결정적인 외부 요인이 존재합니다.

* **터키석 운하(Turquoise Canal) 폐쇄:** 최근 발생한 산사태로 인해 주요 물류 통로인 터키석 운하가 차단되었습니다.
* **공급 차질 우려:** 글로벌 유통 파트너인 AnyCompany Logistics를 통한 제품 공급이 수개월간 지연될 수 있습니다. 이는 크리스마스 성수기 동안의 **재고 부족 사태**로 이어질 위험이 있습니다.

---

## 💡 종합 결론

Widget에 대한 **기초적인 시장 수요와 소매업체의 주문 의지는 매우 강력**합니다. 따라서 공급망 문제(운하 차단 사태)를 얼마나 신속하게 해결하느냐가 2025년 최종 매출 실적을 결정짓는 핵심 변수가 될 것입니다.



```


🔍 Context 내부 작동 원리
- query() 메서드를 호출하면 내부적으로 다음과 같은 일이 벌어집니다.
- 데이터 수집 (Retrieval): 그래프 저장소(Neptune)와 벡터 저장소(OpenSearch)에서 질문과 관련된 Statements, Entities, Chunks를 긁어모읍니다.
- 컨텍스트 구성 (Context Construction): 수집된 파편화된 정보들을 LLM이 이해하기 쉬운 하나의 긴 텍스트 뭉치(Context)로 합칩니다.
- 프롬프트 주입 (Prompt Injection): "너는 분석가야. 아래 제공된 **[Context]**를 바탕으로 질문에 답해줘."라는 프롬프트와 함께 LLM에게 전달합니다.


Entity Network Contexts
- 엔티티 네트워크란? (지식의 지문) 질문에서 찾아낸 핵심 키워드(엔티티) 주변의 1~2단계(Hop) 연결망
- 질문에서 'Example Corp'을 찾았다면, 그래프 상에서 이와 바로 연결된(1-hop) 노드들과, 그 다음 연결된(2-hop) 노드들까지 싹 훑습니다  
- 왜 '지문(Fingerprint)'인가?: 질문에는 '공급망'이라는 단어가 없더라도, 그래프를 따라가다 보면 Example Corp -> [연결됨] -> 핵심 공급업체 -> [발생함] -> 파업/지연 같은 정보를 발견하게 됩니다. 이 연결된 모양새가 마치 이 질문의 숨겨진 맥락을 보여주는 지문과 같다는 뜻입니다  
- . 시드(Seed) 생성: 질문 너머의 단서 찾기
보통의 검색은 질문(Question)을 기준으로 비슷한 것을 찾습니다. 하지만 GraphRAG는 질문에서 뽑아낸 엔티티 네트워크를 '시드(Seed, 씨앗)'로 삼습니다.
- 질문에는 "영국 매출"만 있지만, 엔티티 네트워크를 통해 리튬, 공급망, 노동 조합 같은 관련 키워드들을 확보합니다.
- 비유사성 검색 (Dissimilarity Search)확보된 시드(엔티티 네트워크)를 가지고 벡터 저장소에서 검색을 수행합니다.이 단계가 **"비유사성"**이라고 불리는 이유는, 결과물들이 원래 질문과는 전혀 닮지 않았을 수 있기 때문입니다.질문: "영국 매출 전망은?" $\rightarrow$ 결과: "리튬 광산 파업 소식" (단어만 보면 전혀 다름)하지만 이 결과는 엔티티 네트워크라는 '다리'를 통해 구조적으로 매우 밀접한 정보를 담고 있습니다.

```
🛠️ 프롬프트 보강(Enrichment)의 실제 모습
내부적으로 LLM에게 전달되는 프롬프트는 대략 이런 구조를 갖게 됩니다.

[시스템 지침] 당신은 분석가입니다. 아래 제공된 '엔티티 네트워크'와 '검색 결과'를 바탕으로 답변하세요.

[엔티티 네트워크 컨텍스트] <-- 이 부분이 추가됨!

Example Corp (Entity) is related to UK (Location) via SALES_REGION.

Example Corp (Entity) depends on Component X (Entity) via SUPPLY_CHAIN.

[검색된 명제 및 문단들]

문장 1: "Example Corp의 영국 내 매출은 작년 대비..."

문장 2: "최근 Component X의 공급이 원활하지 않아..."

[사용자 질문] "Example Corp의 영국 내 매출 전망은?"
```

💡 왜 이렇게 하나요? (The "So What?")
LLM은 엔티티 네트워크 정보를 통해 **문장 1(매출)**과 **문장 2(공급망)**가 서로 별개의 이야기가 아니라, 공급망 문제가 결국 매출에 영향을 줄 수 있다는 논리적 연결고리를 훨씬 쉽게 찾아냅니다.

결과적으로 AI는 "매출 지표는 좋지만, 엔티티 네트워크 상에서 확인된 공급망 리스크 때문에 전망은 불투명합니다"와 같은 통찰력 있는 답변을 내놓게 됩니다.


---


3-Agentic-Use-Cases


참고 소스 : https://github.com/awslabs/graphrag-toolkit/blob/main/examples/lexical-graph/workshop/0-Start-Here.ipynb  

