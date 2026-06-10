---
sidebar_position: 14
---

# 요구사항: 14장 지식 검색(RAG)

## 출처

- PDF: `Agentic_Design_Patterns.pdf`
- 섹션: `Chapter 14: Knowledge Retrieval (RAG)`
- 페이지 범위: `199-215` (`docs/agentic-design-patterns-toc.md`의 논리 페이지)
- 추출 참고: Chapter 14 헤딩은 PDF 라벨 `213` / 0 기반 인덱스 `212`에서, Chapter 15는 `231` / 0 기반 `230`에서 시작합니다. 추출 범위는 PDF 인덱스 `212-229`, 파일 페이지 `213-230`, 챕터 내부 `1-18`입니다. TOC 범위는 17페이지라 실제 범위와 1페이지 차이와 라벨 차이가 있습니다.

## 패턴 요약

지식 검색(RAG)은 응답 생성 이전에 LLM을 외부 지식과 연결합니다. 단순히 학습 가중치에 기대기보다 관련 스니펫을 검색해 근거를 함께 제공하고 그 근거로 답변하게 만드는 구조입니다.

챕터는 이를 정확도, 최신성, 도메인 특화성, 검증 가능성을 높이는 방식으로 설명합니다. 임베딩, 의미 유사도, 청킹, 벡터 DB, BM25/하이브리드 검색, 인용, GraphRAG, Agentic RAG를 다룹니다. 조각 간 단편화, 불일치 결과, 출처 모순, 오래된 인덱스, 지연·토큰 비용, 유지비도 다룹니다.

LangGraph 예제는 내부 문서 기반 정책 Q&A입니다. 작은 로컬 코퍼스에서 청크를 검색하고 정렬/필터링 후, 필요하면 쿼리를 재작성하며, 인용 가능한 근거 기반 답변을 만들고, 근거가 부족하면 "모름" 또는 `insufficient_context`를 반환해야 합니다.

## 패턴 설명

### 개념 개요

RAG는 LLM을 폐쇄형 답변기에서 열린형 참조형으로 바꿉니다. 최종 답변은 모델이 작성하지만, 먼저 관련 증거(문서/DB/웹 등)를 주입합니다.

이 장에서 핵심은 단순 키워드 조회가 아니라 의미 기반 임베딩 검색입니다. 쿼리와 의미가 가까운 청크를 찾아 모델이 현재성·비공개성·검증 가능한 근거로 답하게 만듭니다.

### 문제

모델은 오래된 지식에 기반하거나 회사 내부 데이터나 최신 정보를 알지 못할 수 있고, 자신감 있게 잘못된 사실을 말할 수도 있습니다. 최신 정책, 매뉴얼, 지원 문서, 연구 정보 같은 데이터가 필요한데 증거 없이 답하면 사용자는 신뢰하기 어렵습니다.

RAG는 생성 전에 외부 지식 조회를 필수화하고, 검색 결과가 부족하거나 모순되면 답변을 억제하고 근거를 검증·인용하게 만듭니다.

### 사용해야 할 때

- 최신/비공개/전문/자주 바뀌는 정보에 대한 응답이 필요할 때.
- 내부 정책 Q&A, 지원응답, 기술 문서, 법률/연구 조회, 이벤트 요약.
- 인용과 출처 추적이 요구될 때.
- 전체 문서를 모두 넣는 대신 일부 핵심 맥락만 쓰는 것이 효율적인 경우.
- 사용자 표현이 원문과 다를 때도 의미 기반 매칭이 필요한 경우.
- 여러 하위 질문이나 출처 충돌 조정이 필요한 경우(Agentic RAG).
- 문서 간 관계형 추론이 필요한 경우(GraphRAG).

### 사용하지 말아야 할 때

- 정보가 이미 사용자 입력이나 애플리케이션 상태에 모두 있는 경우.
- 정적 규칙/단순 조건분기로 충분한 경우.
- 인덱스가 부정확·오래됨·거버넌스가 약해 신뢰가 떨어지는 경우.
- 임계치 미만의 낮은 연관도에서 무리하게 답변할 때.
- RAG로 권한 관리·프라이버시·품질 통제를 대체할 수 없습니다.
- 단순 top-k로도 충분하고 지연이 중요하면 과도한 Agentic RAG/GraphRAG는 피함.
- 민감 데이터 인덱싱은 보존/권한/삭제/감사 요건이 선행되어야 함.

### 동작 방식

1. 문서 로딩, 청킹, 임베딩, 검색 가능한 인덱스 생성.
2. 사용자 질문 정규화.
3. 벡터/키워드/하이브리드 검색으로 후보 청크 추출.
4. 점수, 신선도, 신뢰도, 출처 타입, threshold 기반으로 정렬/필터.
5. 근거가 부족하면 쿼리 재작성 또는 관련 노드 확장으로 재검색.
6. 질문·선택 맥락·인용 메타·근거 사용 규칙을 넣은 증강 프롬프트 생성.
7. 답변을 생성하고 각 주장에 대한 인용 매핑.
8. 생성 결과가 근거와 맞는지 검증, 부족하면 재시도 또는 실패 상태 반환.
9. 최종 응답에 답변, 인용, 검색 메타, 신뢰도, 오류를 포함.

### 트레이드오프

| 장점 | 비용/위험 |
| --- | --- |
| 최신·비공개·도메인 특화 정보를 모델에 제공 | 수집/청킹/임베딩/인덱스 유지 비용 증가 |
| 근거 기반으로 허위 답변 감소 | 검색 품질 저하 시 오답 가능성 유지 |
| 인용 기반 추적성 제공 | 잘못된 인용 매핑은 큰 신뢰성 문제 |
| 긴 문서 대신 핵심 청크만 전달해 프롬프트 압축 | 검색 자체의 지연, 토큰, 인프라 비용 증가 |
| 의미 검색으로 표현 차이 대응 | 임베딩/청킹 길이 설정이 품질에 큰 영향 |
| 하이브리드 검색으로 Recall 향상 | 튜닝 포인트 증가 |
| Agentic RAG로 검증/조정/재질문 수행 | 반복 루프 증가로 비용·지연 위험 |
| GraphRAG로 관계형 질의 대응 | 지식 그래프 유지 비용이 큼 |

### 최소 예시

```text
질문: "현재 원격 근무 정책이 뭐야?"
  -> 쿼리 정규화
  -> 사내 매뉴얼에서 최신 정책 청크 검색
  -> 2020년 블로그 글은 제외, 2025 매뉴얼 우선
  -> 증강 프롬프트에 정책 청크+인용 메타 조합
  -> 근거 기반 간결한 답변 생성
  -> 각 주장 근거 검증
  -> 제목·섹션·청크 ID와 함께 반환
```

### LangGraph 매핑

| 패턴 개념 | LangGraph 요소 |
| --- | --- |
| 사용자 질문 | `input`, `normalized_query`, `retrieval_query` |
| 지식 베이스 | `corpus_name`, `documents`, `chunks`, `index_metadata` |
| 청킹 | `prepare_corpus_index`, `chunks` |
| 임베딩/벡터 검색 | `retrieve_candidates`, `retrieval_config`, `retrieved_chunks`, `scores` |
| BM25 또는 하이브리드 | `retrieval_strategy`, `rank_and_filter_context` |
| 증강 | `build_augmented_prompt`, `augmented_prompt` |
| 근거 기반 생성 | `generate_answer`, `draft_answer` |
| 인용 | `citations`, `source_metadata`, `supporting_chunk_ids` |
| 맥락 품질 확인 | `assess_context_quality`, 조건 분기 |
| Agentic RAG 재질문 | `rewrite_query`, `validate_grounding` |
| 경량 GraphRAG 확장 | `expand_related_context` |

## LangGraph 구현 목표

내부 정책/제품 문서 어시스턴트 예제를 구현합니다. 자연어 질의가 들어오면, 로컬 fixture 코퍼스에서 검색해 관련 청크를 걸러낸 뒤, 증거 기반 답변과 인용을 반환합니다.

초기 구현은 네트워크 불필요의 결정적 테스트 가능 구조여야 합니다. 메모리 기반 검색도 가능하지만 검색 컨셉은 명시적이어야 하며(청크 ID, 메타, 점수, top_k, relevance threshold, strategy), 추후 실서비스 벡터 DB로 교체 가능합니다.

예상 결과:

- 적절한 질문은 검색 청크 기반의 간결한 답변 및 인용을 반환.
- 약한 검색은 최대 한 번 재작성 후 부족하면 부족 상태 반환.
- 상충 소스는 권한·최신성 기준으로 해결.
- 근거 없는 응답은 차단/재작성.
- 상태는 검색·순위·검증·인용 메타를 노출.

## 상태 형태

| 필드 | 타입 | 목적 |
| --- | --- | --- |
| `input` | `str` | 원본 질문 |
| `normalized_query` | `str` | 정규화 질문 |
| `retrieval_query` | `str` | 재작성 포함 실제 검색 쿼리 |
| `query_rewrites` | `list[str]` | 재작성 쿼리 이력 |
| `corpus_name` | `str` | 로컬 코퍼스 또는 KB 이름 |
| `documents` | `list[dict]` | 문서 메타/본문/관계 포함 |
| `chunks` | `list[dict]` | 청크 텍스트와 메타(문서id, 섹션, 인덱스) |
| `index_metadata` | `dict[str, Any]` | 청크 크기/중첩/임베딩 모델/버전 |
| `retrieval_strategy` | `str` | `semantic`, `keyword`, `hybrid` |
| `retrieval_config` | `dict[str, Any]` | `top_k`, `score_threshold`, `vector_distance_threshold`, `max_retrieval_attempts` |
| `retrieval_attempts` | `int` | 검색 시도 횟수 |
| `retrieved_chunks` | `list[dict]` | 검색 원시 결과 |
| `ranked_chunks` | `list[dict]` | 순위 필터링된 문맥 청크 |
| `related_chunks` | `list[dict]` | 다단계/단편 질문용 확장 청크 |
| `context` | `str` | 생성 프롬프트에 전달될 문맥 문자열 |
| `source_metadata` | `list[dict]` | 인용용 메타(제목, 섹션, source id, chunk id) |
| `context_quality` | `str` | `sufficient`, `weak`, `contradictory`, `missing` |
| `contradictions` | `list[dict]` | 상충 청크와 해결 메모 |
| `knowledge_gap` | `str \| None` | 답변 불가 사유 |
| `augmented_prompt` | `str` | 질문·맥락·인용·근거규칙을 포함한 프롬프트 |
| `draft_answer` | `str` | 생성 전 초기 답안 |
| `citations` | `list[dict]` | 최종 인용 목록 |
| `grounding_status` | `str` | `grounded`, `unsupported`, `partially_supported`, `not_checked` |
| `confidence` | `float` | 검색/근거 품질 기반 신뢰도 |
| `errors` | `list[str]` | 검증/검색/생성/근거 오류 |
| `final_output` | `dict[str, Any] \| None` | 사용자 응답 + 상태 + 인용 + 메타 |

## 노드

| 노드 | 책임 |
| --- | --- |
| `prepare_query` | 입력 검증 및 정규화, 기본값 초기화 |
| `prepare_corpus_index` | 문서 로딩/청킹/메타 부여/인덱스 준비 |
| `retrieve_candidates` | 설정 전략에 따라 top_k 및 임계값으로 후보 추출 |
| `rank_and_filter_context` | 낮은 점수/오래된 항목 제거 후 `ranked_chunks` 생성 |
| `expand_related_context` | 다중 출처 관계가 있을 때 확장 검색 |
| `assess_context_quality` | 충분/약함/모순/누락 판정 |
| `rewrite_query` | 한 번만 쿼리 재작성 |
| `build_augmented_prompt` | 질문·맥락·인용·근거 규칙 결합 |
| `generate_answer` | 공유 모델 패턴 또는 테스트용 Mock 모델 호출 |
| `validate_grounding` | 생성문이 실제 출처로 뒷받침되는지 검증 |
| `finalize_answer` | 검증 통과 시 인용·신뢰도 포함 성공 응답 |
| `finalize_insufficient_context` | `I don't know`/insufficient_context 응답 |
| `finalize_failure` | 비정상 런타임/스키마 오류 시 통제된 실패 |

## 간선

```text
START
  -> prepare_query
  -> prepare_corpus_index
  -> retrieve_candidates
  -> rank_and_filter_context
  -> assess_context_quality

assess_context_quality -> build_augmented_prompt
assess_context_quality -> expand_related_context -> build_augmented_prompt
assess_context_quality -> rewrite_query -> retrieve_candidates
assess_context_quality -> finalize_insufficient_context

build_augmented_prompt -> generate_answer -> validate_grounding

validate_grounding -> finalize_answer -> END
validate_grounding -> rewrite_query -> retrieve_candidates
validate_grounding -> finalize_insufficient_context -> END
validate_grounding -> finalize_failure -> END
```

조건 간선 요구사항:

- `assess_context_quality`에서 컨텍스트 충분 시 `build_augmented_prompt`.
- 조각이 분절되어 있거나 다단계 필요하면 `expand_related_context`.
- 약함/누락이면서 `retrieval_attempts < max_retrieval_attempts`면 `rewrite_query`.
- 허용 재시도 소진 후에도 누락이면 `finalize_insufficient_context`.
- `validate_grounding`은 인용이 선택된 청크와 일치할 때만 `finalize_answer`.
- 근거 미충족이면 재시도(남은 1회)로 `rewrite_query`.
- 근거로도 못 설명되면 `finalize_insufficient_context`.
- 비정상 런타임/스키마 실패만 `finalize_failure`.
- 루프는 `max_retrieval_attempts` 초과 금지.
- 검색/생성은 주입 가능한 의존성(테스트에서 fake retriever/mock model) 사용.

## 입력/출력

- 입력: 자연어 질문, 선택 `retrieval_config`, 선택 코퍼스 오버라이드.
- 출력: `final_output`에 `status`, `answer`, `citations`, `confidence`, `retrieval_attempts`, `retrieved_sources`, `grounding_status`, `errors`.
- 중간 산출물: 정규화/검색 쿼리, 청크, 순위 결과, 관계 확장, 품질 판정, 모순, 지식공백, 증강 프롬프트, 초안, 소스 메타.

예시 입력 형태:

```json
{
  "input": "How many days per week can employees work remotely under the current handbook?",
  "retrieval_config": {
    "top_k": 3
  }
}
```

성공 응답 예시:

```json
{
  "status": "answered",
  "answer": "직원은 주당 최대 3일을 원격근무할 수 있으며, 관리자 승인 조건이 적용됩니다.",
  "citations": [
    {
      "source_id": "hr-handbook-2025",
      "title": "Employee Handbook 2025",
      "section": "Remote Work",
      "chunk_id": "hr-handbook-2025::remote-work::1"
    }
  ],
  "confidence": 0.86,
  "retrieval_attempts": 1,
  "grounding_status": "grounded",
  "errors": []
}
```

insufficient-context 예시:

```json
{
  "status": "insufficient_context",
  "answer": "현재 지식베이스로는 답할 수 없습니다.",
  "citations": [],
  "confidence": 0.0,
  "retrieval_attempts": 2,
  "grounding_status": "unsupported",
  "knowledge_gap": "계약직 원격근무 자격에 대한 청크가 검색되지 않았습니다.",
  "errors": []
}
```

## 실패 사례

- 빈 입력은 `prepare_query`에서 즉시 중단, 검색/생성 호출 없이 처리.
- 코퍼스 누락/비어있음은 `finalize_failure` 또는 `finalize_insufficient_context`.
- 청킹 실패는 검색 전 상태에서 통제된 실패로 전환.
- 검색기 불가/출력 형식 오류 시 에러 기록 후 근거 없는 응답 방지.
- 임계값 미달은 한 번 재작성 후 부족 상태 반환.
- 관련도 낮거나 오래된 결과는 프롬프트 구성 이전에 필터.
- 상충 결과는 권한·최신성으로 조정하거나 조심스러운/부족 상태 반환.
- 근거 없는 생성은 최종 성공으로 넘어가지 않음.
- 인용은 실제 선택 청크만 허용; 허위 인용은 grounding 실패.
- 최종 응답에 숨은 메타, 자격 증명, 스택 트레이스, 불필요한 문서 원문을 노출하지 않음.
- 검색 문서 내 prompt injection은 도구/시스템 지시로 간주하지 않음.
- 재검색 루프는 `max_retrieval_attempts` 준수.
- 추후 실서비스에서 웹 검색/외부 벡터스토어 사용 시 실패는 실패/부족 상태로 처리.

## 테스트 아이디어

- 정책 질문으로 관련 청크를 찾아 인용 포함 답변 생성.
- 모르는 질문이 허위 답변 대신 `insufficient_context`를 반환.
- 낮은 검색 점수에서 한 번 재작성 동작 및 초과하지 않음 확인.
- 최신/과거 출처 우선순위가 정확히 최신 권한 source를 택하는지.
- 상충 청크가 `contradictions`에 기록 및 해결/반려되는지.
- 근거 없는 답변이 grounding에서 실패.
- 허위 인용 ID가 유효성 검증에서 걸러짐.
- 검색 문서 주입 텍스트의 프롬프트 인젝션이 답변 규칙을 오염시키지 않음.
- fake retriever/model로 결정론적 테스트.

## 열린 질문

- TOC 논리 범위는 `199-215`이지만 실제 추출은 PDF 라벨 `213-230`입니다.
- 챕터 텍스트의 그림은 캡션(`Fig.1`류)만 추출되어 내부 구조가 빠져 있습니다.
- 예제에서는 단순 로컬 리트리버로 시작하고, 운영에서는 실제 벡터스토어로 점진 이전하는 쪽으로 판단해야 합니다.
