---
marp: true
theme: default
paginate: true
---

# 모델 성능을 평가하는 방법론

LLM Evaluation Framework  
- 정답셋 구축
- 평가 방법론
- DeepEval
- 요약 평가 지표

---

# 1. 정답셋 구축하기

## 방법 1: Human Eval Set
- 사람이 직접 정답셋 제작
- 비용 많이 듦
- 비결정적 모델에서는 한계 존재
- AI와 인간 출력 차이 비교 가능

## 방법 2: AI 생성 정답셋
- LLM으로 정답 자동 생성
- 사람이 일부 검수
- 대량 확장 가능

---

# 2. 정확한 평가 (Deterministic Evaluation)

## 특징
- 답이 명확한 문제
- Unit Test 기반 평가

## 대표 벤치마크
- OpenAI HumanEval
- Google MBPP

## 방식
- 모델이 k개 코드 생성
- k개 중 1개라도 Test Case 통과 → 정답 처리

---

# 3. 참조 데이터 유사도 측정

정답과 얼마나 유사한가?

---

## 3-1. 정확한 일치 (Exact Match)

- 완전 문장 일치 시 정답
- 단점: 표현만 달라도 오답 처리

---

## 3-2. 어휘적 유사도 (Lexical Similarity)

### 방법
- Fuzzy Matching
- N-gram 유사도

### 단점
- 의미가 같아도 표현 다르면 낮은 점수
- 단어 순서에 민감

Example:
A: I love natural language processing  
B: I love language natural processing

---

## 3-3. 의미적 유사도 (Semantic Similarity)

### 1. 토큰 기반 비교

#### BERTScore
- 모든 토큰 간 cosine 비교
- 가장 유사한 토큰끼리 매칭
- 단어 순서 변화에 강함

#### Mover Score
- 토큰 이동 거리까지 고려

---

### 2. 문장 전체 임베딩

- 문장 → 하나의 Dense Vector
- Cosine Similarity로 비교
- 예: text-embedding-3-small

---

## 멀티모달 평가

### CLIP
- 텍스트 인코더
- 이미지 인코더
- 동일 벡터 공간에서 유사도 계산

---

# 4. DeepEval

LLM 애플리케이션 평가 오픈소스 프레임워크

---

## DeepEval 특징

- LLM을 pytest처럼 unit test 가능
- Golden Set 직접 구축

### Golden Set 제작 방식

초기:
- 개발자
- ML 엔지니어
- 도메인 전문가
- 기존 데이터 / 운영 로그

확장:
- LLM 자동 생성
- Synthesizer 기능 활용
- 문서 → 질문/정답 자동 생성

---

# 5. LLM 요약 평가의 어려움

- 정답이 정해져 있지 않음 (Open-ended)
- 평가 기준이 주관적
- 골드 요약 생성 어려움

---

# 6. F1 기반 요약 평가

F1 = Alignment Score + Coverage Score (조화 평균)

---

## Alignment Score

- 요약에서 Claim 추출
- 원문 Truth와 비교
- 사실 정합성 평가

---

## Coverage Score

- 원문 기반 질문 생성
- 요약으로 답변 가능한지 평가
- 정보 포함도 측정

---

# 7. 추가 요약 평가 지표

## 1. Entity Density

Entity Density = 개체 수 / 전체 토큰 수

Entity 예시:
- 인물: Elon Musk
- 기관: OpenAI
- 국가: China
- 날짜: 2024
- 수치: 10%, 3 billion

이상적 밀도 ≈ 0.15  
→ 너무 설명적이지도, 너무 빽빽하지도 않은 상태

---

## 2. Repetitiveness

- 동일 개념 반복 감점
- LLM-as-judge (GEval) 활용 가능

---

## 3. Vagueness

- 불필요 문장 감점
- 예: "이 글은 ~을 설명한다"

---

## 4. Coherence Metric

- n번째 문장과 n+2번째 문장 cosine similarity 평균
- 문장 순서 랜덤화 시 점수 감소

---

# 결론

LLM 평가에는

- 정답셋 구축 전략
- 정확한 평가 vs 유사도 기반 평가
- 의미 기반 임베딩 비교
- DeepEval 프레임워크 활용
- 요약 전용 F1 + 추가 품질 지표

가 필요하다.