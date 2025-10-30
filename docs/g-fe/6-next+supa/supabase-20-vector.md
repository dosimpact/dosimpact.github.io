---
sidebar_position: 20
---

# Supabase Vector DB  

## Goal  
- Vector DB를 활용여 RAG를 구현한다.  

Refs  
- pgVector : https://velog.io/@bbkyoo/pgVector#5-query  

문서 유사도 검색을 이용한

## Background  

### RAG 

RAG는 “Retrieval-Augmented Generation”의 약자
- 문제 : LLM모델이 학습하지 않은 데이터는 대답 불가능.  
- 사전 정보와 함께 프롬프트를 LLM에 넣어주어 해결.  
- 비유하면 LLM모델을 선택하는것은 정규교과과정을 거친 중학생, 고등학생이다. RAG는 이 학생에게 전공 지식을 짧게 가르치고 대답을 만드는 것.   

1. Retrieval (검색)

	•	AI 모델이 데이터를 생성하기 전에, 외부 데이터베이스나 문서에서 관련 정보를 검색해 가져오는 단계예요.

2. Augmented Generation (보강된 생성)

RAG의 활용 사례

- 고급 질문 응답 시스템: 특정 도메인의 정보를 빠르게 검색하고, 정확한 답변을 제공할 때 유용해요.
- 기업용 챗봇: 회사의 내부 문서나 FAQ에서 관련 정보를 찾아 사용자 질문에 답변할 때 사용돼요.
- 컨텍스트 기반 생성 작업: 논문 요약, 기술 자료 작성, 고객 지원 등의 작업에서 정확도를 높이는 데 활용돼요.

이 기술은 OpenAI, Hugging Face, Meta와 같은 기업에서도 활용되고 있으며, 최근 AI의 신뢰성과 유용성을 높이는 중요한 접근법으로 주목받고 있어요.


RAG 시스템 구현하기  

1.SQL 기반 검색 
- 생성된 혹은 미리 작성된 SQL을 바탕으로 검색 후 보강   
- 기업의 ERP나 CRM 같은 기존의 데이터 관리 및 쿼리 작성 기술을 활용 가능  

2.ElasticSearch  
- 키워드 기반 검색과 더불어 비정형 데이터 검색 기능  
- 고성능 검색 및 확장성, 	임베딩 벡터 기반 검색보다는 정확도가 떨어질 수 있다.  

3.캐시 기반 검색 (Redis 등)  
- 자주 참조되는 작은 크기의 데이터에서 빠른 응답이 필요  

4.API 기반 검색    
- 외부 데이터 연동이 필요.  

5.Vector DB
- 임베딩(embedding)을 활용한 벡터 유사도 검색  

### Vector DB vs ElasticSearch  

Vector DB
- 임베딩(embedding)을 활용한 벡터 유사도 검색이 가능하다.  

- *데이터의 특징을 숫자 배열로 바꾸어서 관리한다.  
- *축구공은 “둥글다, 튼튼하다, 차기 좋다” 같은 특징을 추출  
- *축구공과 유사한것들은? 축구공과 비슷한 농구공이나 배구공 같은 것을 대답할 수 있다.  


ElasticSearch

검색엔진을 ElasticSearch을 통해 초기버전으로 구현이 가능하다.    
예
- 문서와 데이터가 아래 처럼 있다.
  - 문서 1: “사자와 호랑이는 동물이다. 동물은 멋있다.”  
  -	문서 2: “고양이는 귀여운 동물이다.”  
- 역색인은 이렇게 만들어져요: (Indexing)   
	•	“사자” → 문서 1  
	•	“호랑이” → 문서 1  
	•	“동물” → 문서 1, 문서 2  
	•	“고양이” → 문서 2  
- 검색:동물 (Query)  
  - 결과 : 문서 1,문서 2  
  - *with 스코어링(Scoring)  
    - 문서1이 동물이라는 키워드가 2번 나온다. = 더 관련성이 높음  




## Code

### 1.SQL Init

pgVector는 PostgreSQL 내부에서 바로 유사도 검사를 수행
- 외부에서 복잡한 처리를 하지 않아도 된다. > AI 벡터 검색 엔진을 구축에 이점  

```sql

-- Enable pgvector extension
create extension if not exists vector with schema public;

-- Create tables 
-- 파일 경로와 checksum을 관리하여 동일한 파일에 대해서 백터임베딩을 스킵한다.   
create table "public"."nods_page" (
  id bigserial primary key,
  parent_page_id bigint references public.nods_page,
  path text not null unique,
  checksum text,
  meta jsonb,
  type text,
  source text
);
-- RLS on
alter table "public"."nods_page" enable row level security;

-- nods_page는 여러 content로 분리 및 백터임베딩 값을 넣는다.  
-- slug : 
-- heading : 
create table "public"."nods_page_section" (
  id bigserial primary key,
  page_id bigint not null references public.nods_page on delete cascade,
  content text,
  token_count int,
  embedding vector(1536),
  slug text,
  heading text
);
-- RLS on
alter table "public"."nods_page_section" enable row level security;

-- Create embedding similarity search functions
-- 	•	embedding vector(1536): 검색 기준이 되는 임베딩 벡터(OpenAI 등에서 생성된 1536차원 벡터).
--	•	match_threshold float: 유사도의 최소값. 이 값을 넘는 섹션만 검색 결과에 포함.
--	•	match_count int: 반환할 최대 결과 개수.
--	•	min_content_length int: 섹션 내용의 최소 길이. 짧은 섹션은 무시.

create or replace function match_page_sections(embedding vector(1536), match_threshold float, match_count int, min_content_length int)
returns table (id bigint, page_id bigint, slug text, heading text, content text, similarity float)
language plpgsql
as $$
#variable_conflict use_variable
begin
  return query
  select
    nods_page_section.id,
    nods_page_section.page_id,
    nods_page_section.slug,
    nods_page_section.heading,
    nods_page_section.content,
    (nods_page_section.embedding <#> embedding) * -1 as similarity
  from nods_page_section

  -- We only care about sections that have a useful amount of content
  where length(nods_page_section.content) >= min_content_length

  -- The dot product is negative because of a Postgres limitation, so we negate it
  and (nods_page_section.embedding <#> embedding) * -1 > match_threshold

  -- OpenAI embeddings are normalized to length 1, so
  -- cosine similarity and dot product will produce the same results.
  -- Using dot product which can be computed slightly faster.
  --
  -- For the different syntaxes, see https://github.com/pgvector/pgvector
  order by nods_page_section.embedding <#> embedding
  
  limit match_count;
end;
$$;

create or replace function get_page_parents(page_id bigint)
returns table (id bigint, parent_page_id bigint, path text, meta jsonb)
language sql
as $$
  with recursive chain as (
    select *
    from nods_page 
    where id = page_id

    union all

    select child.*
      from nods_page as child
      join chain on chain.parent_page_id = child.id 
  )
  select id, parent_page_id, path, meta
  from chain;
$$;

```

```js
// 아래 pg function은 rpc로 호출한다.   
function match_page_sections(embedding vector(1536), match_threshold float, match_count int, min_content_length int)
// 
    const { error: matchError, data: pageSections } = await supabaseClient.rpc(
      'match_page_sections',
      {
        embedding,
        match_threshold: 0.78,
        match_count: 10,
        min_content_length: 50,
      }
    )
```

### 2.SQL Init

## 주안점  

### 1.임베딩 콘텐츠  

백터 임베딩을 하기위해서 적절한 지식단위로 나누는것이 필요하다.  

	•	OpenAI의 임베딩 모델:
	•	text-embedding-ada-002 기준: 최대 8191 토큰.
	•	권장 길이: 100~500 토큰(짧고 의미 있는 텍스트).

텍스트가 너무 긴 경우  
	•	긴 텍스트를 한 번에 처리하면 중요한 정보가 희석되거나 잘릴 가능성이 있습니다.  
	•	따라서 긴 텍스트는 분할하여 처리하는 것이 일반적입니다.  

마크다운의 경우에는 h1~h6 단위로 나눠볼 수 있다.  
그렇지 않은 비정형 데이터는 다시 LLM으로 넣는것이 필요할 수 있다.  