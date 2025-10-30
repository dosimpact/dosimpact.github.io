---
sidebar_position: 1
---

# Supabase Concepts


- [Supabase Concepts](#supabase-concepts)
  - [Docs](#docs)
  - [supabase 란 ?](#supabase-란-)
  - [가격 정책 (Pricing)](#가격-정책-pricing)
  - [RLS (Row-Level Security)](#rls-row-level-security)
    - [RLS 로 해결하는 API 취약점](#rls-로-해결하는-api-취약점)
  - [필수 data types](#필수-data-types)
  - [Authentication](#authentication)
  - [Architecture](#architecture)
  - [참고자료](#참고자료)

## Docs 

Docs > https://supabase.com/docs

## supabase 란 ?

Backend-as-a-Service (BaaS) 플랫폼, 프로젝트를 빠르게 구축하기 위한 백앤드 서비스들 모음집 + 클라우드   

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

Postgres Modules
- AI & Vectors : Supabase를 사용하여 임베딩 벡터를 저장하고 검색할 수 있습니다.  
- Cron  
- Queues  


## 가격 정책 (Pricing)    

시작은 FREE 이다.!   
- DB의 용량을 500MB 혹은 1 GB file storage 혹은 MAU 5만 넘어가면, 이후 PRO 사용하면 된다.    
- https://supabase.com/pricing  
- Free 버전 고려점
  - 클라우드 리소스를 절약하기 위해 현재 7일 이상 비활성 상태인 무료 계층 프로젝트를 일시 중지.  
  - Pro 비용 이후 AWS RDS보다 가격이 비싸다.   

무료 버전에서 Pro (유료 버전)에서의 한계    
- 100,000 monthly active users 
- 8 GB database space 
- 250 GB bandwidth 
- 100 GB file storage 
- Email support
- Daily backups stored for 7 days
- 7-day log retention

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
- 권한 체크 API 서버 없이 SPA에서 바로 Supbase를 호출 가능한 이유이다.   

예)  
- Todo테이블의 Todo 정보에 대해서 다음 규칙을 DB Level에서 적용 가능  
- 3가지 권한 타입 : owner(소유권자), auth(인증자), public(공개,anon 누구나, 익명)    
- 정책 만들기 예)
  - SELECT : Todo테이블은 읽기는 누구나 가능하다.  
  - UPDATE : Todo테이블은 수정은 로그인 한 사람은 누구나 가능하다.  
  - DELETE : Todo테이블 삭제는 만든사람만 가능하다.  

주의할 점    
- 로그인 후 `select * from post` 라고 조회하면 RLS 정책에 따라서 로그인 한 사용자의 행만 쿼리가 된다.    
- 보이는 sql이 결과랑 다른점이 처음에 신기할 수 있다.    

```js
내부적으로는 아래와 같은 처리가 진행진다.
# SQL(App) 요청 
select * from todos  

# DB Level 처리
select * from todos
where auth.uid() = todos.user_id; -- Policy is implicitly added.
```
- Ref : https://supabase.com/docs/guides/database/postgres/row-level-security#policies


### RLS 로 해결하는 API 취약점  

BOLA - Broken Object Level Authorization. 
- 접근 권한이 없는 데이터에 접근을 하는 경우이다.  
- 예를 들어, A 사용자는 자신의 정보만 볼 수 있어야 하는 데, 같은 권한 수준을 가진 B 사용자의 정보까지 볼 수 있는 경우를 말한다.  

BFLA - Broken Function Level Authorization
- BOLA가 Access - 데이터 접근에 대한 문제라면 BFLA는 Action - 작업 수행에 대한 문제이다. 즉, 권한이 없는 작업을 수행하는 것이다.

* postgreSQL의 RLS 기능을 이용해서 BOLA, BFLA 예방할 수 있다.  


ref : [11개 API 취약점](https://jusths.tistory.com/330)

## 필수 data types 

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


## Authentication

Authentication
- Supabase는 JWT와 키 인증을 혼합하여 작동합니다.
- Authorization 헤더가 포함되어 있지 않으면 API는 익명 사용자에게 요청을 하는 것으로 가정합니다.
- Authorization 헤더가 포함된 경우 API는 요청을 수행하는 사용자의 역할로 "전환"됩니다. (키를 환경 변수로 설정하는 것이 좋습니다.)

```js
// 로그인 전 요청, apiKey를 헤더에 넣어서 요청한다. ( apiKey는 anon key 혹은 service role key  )
curl 'https://xscduanzzfseqszwzhcy.supabase.co/rest/v1/colors?select=name' \
-H "apikey: eyxx..xc" \

// 로그인을 하면 JWT 토큰이 발급된다.  
supabase.auth.signIn({
  email: 'lao.gimmie@gov.sg',
  password: 'They_Live_1988!',
})

// 로그인 요청 후, apiKey + Authorization 와 함께 요청을 보낸다.  
curl 'https://xscduanzzfseqszwzhcy.supabase.co/rest/v1/colors?select=name' \
-H "apikey: eyxx..xc" \
-H "Authorization: Bearer eyx..xs"

```

Client API Keys (anon key)  
- 클라이언트 키는 사용자가 로그인할 때까지 데이터베이스에 대한 "익명 액세스"를 허용합니다. 
- 로그인한 후 키는 사용자 자신의 로그인 토큰으로 전환됩니다.
- RLS 정책을 적용 받는다.  

Service Keys (service role key)
- 서비스 키는 모든 보안 정책을 우회하여 데이터에 대한 전체 액세스 권한을 갖습니다. 이러한 키를 노출할 때에는 매우 주의하십시오.   
- 서버에서만 사용해야 하며 클라이언트나 브라우저에서는 절대 사용해서는 안 됩니다.
- 이 문서에서는 SERVICE_KEY라는 이름을 사용하여 키를 참조합니다.
- API 설정 페이지에서 service_role을 찾을 수 있습니다.


## Architecture

![altImg](https://supabase.com/docs/_next/image?url=%2Fdocs%2Fimg%2Fsupabase-architecture.svg&w=2048&q=75)
 
https://supabase.com/docs/guides/getting-started/architecture

## 참고자료

리액트 핸드북 > 파일 구조 > bulletproof-react  
- https://reacthandbook.dev/project-standards#file-directory-structures

Next.js 14 + @supabase/ssr: authencation, oauth, page protection,CRUD
- https://www.youtube.com/watch?v=PdmKlne1gRY

Learn Supabase (Firebase Alternative) – Full Tutorial for Beginners
- https://www.youtube.com/watch?v=dU7GwCOgvNY&list=PLtFBvXtDoP-LeZoZ5RoKTi4Gs9jUaWwpA&index=4&t=7970s

Next.js 14 + @supabase/ssr: 인증, oauth, 페이지 보호, CRUD
- https://www.youtube.com/watch?v=PdmKlne1gRY&list=PLtFBvXtDoP-LeZoZ5RoKTi4Gs9jUaWwpA&index=5&t=1105s