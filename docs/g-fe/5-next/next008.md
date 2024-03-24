---
sidebar_position: 8
---


# Supabase Concepts


- [Supabase Concepts](#supabase-concepts)
  - [Docs](#docs)
  - [supabase 란 ?](#supabase-란-)
    - [클라우스 서비스 구조](#클라우스-서비스-구조)
    - [Pricing](#pricing)
  - [RLS (Row-Level Security)](#rls-row-level-security)
    - [BOLA](#bola)
  - [필수 datatypes](#필수-datatypes)
  - [typescript - typegen](#typescript---typegen)
  - [참고자료](#참고자료)

## Docs 

Docs > https://supabase.com/docs

## supabase 란 ?

프로젝트를 빠르게 구축하기 위한 백앤드 서비스들 모음집 + 클라우드   

데이터베이스:
- Supabase는 각 프로젝트에 대해 전체적인 Postgres 데이터베이스를 제공하며 실시간 기능, 데이터베이스 백업, 확장 기능 등을 제공합니다.

인증(Auth):
- 이메일 및 비밀번호, 비밀번호 없는 인증, OAuth 및 모바일 로그인과 같은 다양한 인증 방법을 통해 프로젝트에 사용자를 추가하고 관리할 수 있습니다.

스토리지:
- 대용량 파일을 저장, 정리, 변환 및 제공할 수 있으며, 데이터베이스와 완전히 통합되어 Row Level Security 접근 정책을 사용할 수 있습니다.  

실시간:
- 데이터베이스 변경 사항을 실시간으로 감지하고, 사용자 상태를 클라이언트 간에 동기화하며, 채널에 구독된 클라이언트에게 데이터를 브로드캐스트할 수 있습니다.  

Edge Functions:
- 전 세계적으로 분산된 서버 측 함수를 통해 사용자에게 가장 낮은 지연 시간으로 코드를 실행할 수 있습니다.

AI 및 벡터:
- Supabase를 사용하여 임베딩 벡터를 저장하고 검색할 수 있습니다.  
  - Search: how similar is a search term to a body of text? 
  - Recommendations: how similar are two products?  
  - Classifications: how do we categorize a body of text?  
  - Clustering: how do we identify trends?  

### 클라우스 서비스 구조 

계정 생성 - 조직 생성 - 프로젝트 생성 - DB 만들기   
- DB Level 에서 인증, 스토리지, 관리 가능  

### Pricing  

- 시작은 FREE 이다.!   
- 용량 500MB 혹은 MAU 5만 넘어가면, 이후 PRO 사용하면 된다.    
- https://supabase.com/pricing  


## RLS (Row-Level Security)

Supabase의 RLS는 "Row-Level Security"의 약자. 
- 데이터베이스 테이블의 행에 대한 보안을 관리하는 기능
- 사용자 또는 역할이 특정 행에 접근할 수 있는지 여부를 제어.  


행 수준의 보안 장점   
- 블로그 포스팅이라는 테이블이 있다라고 가정 하면  
- 포스팅이라는 하나의 테이블에는 다른 사람들의 포스팅도 있음    
- 원래는 서버단에서 내 포스팅과 다른 사람의 포스팅이 섞이지 않도록 권한체크 해야 한다.    
- 근데 DB Level에서 이를 해주는 거임  
- 보안이 향상된 인프라가 있으니 맘놓고 개발 가능!  

예)  
- Todo테이블의 Todo 정보에 대해서 다음 규칙을 DB Level에서 적용 가능  
- 3가지 권한 타입 : owner(소유권자), auth(인증자) ,public(공개,anon 누구나, 익명)  
- 정책 만들기 예)
  - SELECT : Todo테이블은 읽기는 누구나 가능하다.  
  - UPDATE : Todo테이블은 수정은 로그인 한 사람은 누구나 가능하다.  
  - DELETE : Todo테이블 삭제는 만든사람만 가능하다.  

신기한 점  
- 로그인 후 + select * from post 라고 조회하면 로그인 한 사용자것만 나옴  
- sql이 실제랑 다르다.  


```js
# App 요청
select * from todos

# DB Level 처리
select * from todos
where auth.uid() = todos.user_id; -- Policy is implicitly added.
```
참조 : https://supabase.com/docs/guides/database/postgres/row-level-security#policies


### BOLA

BOLA - Broken Object Level Authorization. 
- 접근 권한이 없는 데이터에 접근을 하는 경우이다.  
- 예를 들어, A 사용자는 자신의 정보만 볼 수 있어야 하는 데, 같은 권한 수준을 가진 B 사용자의 정보까지 볼 수 있는 경우를 말한다.  

* postgreSQL의 RLS 기능을 이용해서 BOLA를 예방할 수 있다.  

ref : 11개 API 취약점 > https://jusths.tistory.com/330   

## 필수 datatypes 

https://supabase.com/docs/guides/database/tables#data-types

```
불리언 저장 : boolean   
정수 저장 : bigint(int8), integer(int4)   
소수점 저장 : double precision	float8	double precision floating-point number (8 bytes)   
문자열 저장 : text, varchar	(variable-length character string)   
json 저장 : json   
사용자 식별자 저장 : uuid universally unique identifier  
시간 저장 : timestamptz ( 타임존 정보도 함께 )  
*시간 저장 : timestamp ( 타임존 정보 X , UTC 기본 - 하지만 데이터 잘못 들어가면 ?? )   

```


## typescript - typegen

DB 스키마에 따라서 타입 제너레이팅이 가능하다.  
- 정말 유용한 기능!!   
- https://supabase.com/docs/guides/api/rest/generating-types


![Alt text](./img/image.png)
알아야 할 정보 
- Project Settings > General settings  
- Project name : next-todo  
- Reference ID : txigexxxxpllferqc  

```js
npm i supabase@">=1.8.1" --save-dev
npx supabase login
npx supabase gen types typescript --project-id txigexxxxpllferqc --schema public > types/supabase.ts

---

import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/supabase";

export const supaBrowserClient = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

```


## 참고자료

리액트 핸드북 > 파일 구조 > bulletproof-react  
- https://reacthandbook.dev/project-standards#file-directory-structures

Next.js 14 + @supabase/ssr: authencation, oauth, page protection,CRUD
- https://www.youtube.com/watch?v=PdmKlne1gRY

Learn Supabase (Firebase Alternative) – Full Tutorial for Beginners
- https://www.youtube.com/watch?v=dU7GwCOgvNY&list=PLtFBvXtDoP-LeZoZ5RoKTi4Gs9jUaWwpA&index=4&t=7970s

Next.js 14 + @supabase/ssr: 인증, oauth, 페이지 보호, CRUD
- https://www.youtube.com/watch?v=PdmKlne1gRY&list=PLtFBvXtDoP-LeZoZ5RoKTi4Gs9jUaWwpA&index=5&t=1105s