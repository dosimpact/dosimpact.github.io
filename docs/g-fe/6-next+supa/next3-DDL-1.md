---
sidebar_position: 3
---

# Supabase DDL

- [Supabase DDL](#supabase-ddl)
  - [📌 Row Level Security - RLS](#-row-level-security---rls)
      - [RLS 로 해결하는 API 취약점](#rls-로-해결하는-api-취약점)
  - [RLS 문법](#rls-문법)
  - [📌 RLS - SELECT POLICY](#-rls---select-policy)
    - [USING expression](#using-expression)
  - [📌 RLS - INSERT, UPDATE, DELETE POLICY](#-rls---insert-update-delete-policy)
    - [WITH CHECK expression](#with-check-expression)


## 📌 Row Level Security - RLS  

Supabase의 RLS는 "Row-Level Security"의 약자.  
- 데이터베이스 테이블의 행에 대한 유효성 검사를 관리하는 기능, 특히 권한에 대한 검사. 
- 특정 사용자가 특정 행에 읽기, 쓰기 가능한지 체크하고 보호한다  

행 수준의 보안 장점
- 블로그 포스팅이라는 테이블이 있다라고 가정 해보자.  
- 포스팅이라는 하나의 테이블에는 사실 다른 사람들의 포스팅도 있다.    
- 보통 서버에서 내 포스팅과 다른 사람의 포스팅이 섞이지 않도록 권한체크를 한다.  
- 근데 이러한 기능을 DB Level에서 제어하는 것.!  
  - *권한에 대해서 Application Code가 아닌 DDL로 정의가 된다.  


RLS는 테이블 단위로 적용시킬 수 있다.  
- RLS enalbe 되면 RLS 정책을 만들어야 테이블을 조회할 수 있다.   
  - >"누구나 그 테이블을 읽을 수 있어 라는 정책" 을 만들어야 한다.  
    - *참고  
    - anon : 누구나  
    - authenticated : 인증된 사용자만  
    - service_role : 어드민 (= RLS PASS권)  


#### RLS 로 해결하는 API 취약점  

BOLA - Broken Object Level Authorization. 
- 접근 권한이 없는 데이터에 접근을 하는 경우이다.  
- 예를 들어, A 사용자는 자신의 정보만 볼 수 있어야 하는 데, 같은 권한 수준을 가진 B 사용자의 정보까지 볼 수 있는 경우를 말한다.  

BFLA - Broken Function Level Authorization
- BOLA가 Access - 데이터 접근에 대한 문제라면 BFLA는 Action - 작업 수행에 대한 문제이다. 즉, 권한이 없는 작업을 수행하는 것이다.

* postgreSQL의 RLS 기능을 이용해서 BOLA, BFLA 예방할 수 있다.  

ref : [11개 API 취약점](https://jusths.tistory.com/330)

## RLS 문법   

DB에 트랜잭션이 들어가기 전후로 RLS이 적용된다.  
3단계로 생각하면 좋다.  

1.준비
- using expression 라는 문법구절을 이용한다.  
- 위 조건에 맞는 데이터만 준비된다.  
- *처음에 RLS를 잘못설정하여 데이터조차 조회가 안되는 실수를 범한다. 

2.트랜잭션  
- select, insert, update, delete 연산을 수행한다.  

3.재확인  
- with check expression 라는 문법구절을 이용한다.  
- 위 조건검사에 실패하면 오류가 발생하며, 트랜잭션 롤백된다.  


## 📌 RLS - SELECT POLICY  

About Role 
- anon : 로그인 안한 유저  
- authenticated : 로그인 한 유저  
- public : anon + authenticated  
- owner : 데이터 행 소유자, auth.uid() = user_id  
  - * public | authenticated | owner 3단계로 권한을 좁힌다고 생각하자.  

*모든 roles : https://supabase.com/docs/guides/database/postgres/roles#supabase-roles 

### USING expression

- USING expression은 where절로 변환된다고 생각하면 된다. 
- 즉, SELECT, UPDATE, DELETE 연산을 하기 전에 해당 Where 절이 먼저 실행된다.  
- *트랜젝션 사전에 실행되는 것이다.  

eg) SELECT에 auth.uid() = user_id을 걸면   
- 로그인 한 사용자의 Row만 보인다.  

설명  
- USING expression은 행 수준 보안이 활성화된 경우 테이블을 참조하는 쿼리에 추가됩니다.
- 표현식이 true를 반환하는 행이 표시됩니다. 식이 false 또는 null을 반환하는 모든 행은 사용자에게 표시되지 않으며(SELECT에서) 수정할 수 없습니다(UPDATE 또는 DELETE에서).  
- 이러한 행은 자동으로 표시되지 않으며 **오류가 보고되지 않습니다.**  

```sql
--- 누구나 조회가 가능한 정책    
CREATE POLICY "Enable select for authenticated users only" ON "public"."todos"
AS PERMISSIVE FOR SELECT
TO public  -- public | anon | authenticated
USING (true)

-- 로그인 한 사용자만 조회가 가능한 정책  
CREATE POLICY "Enable select for authenticated users only" ON "public"."todos"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (true)

-- 로그인 했으며, 행의 소유권자만 조회가 가능함   
CREATE POLICY "Enable select for users based on user_id" ON "public"."todos"
AS PERMISSIVE FOR SELECT
TO public
USING (auth.uid() = user_id)  
-- * auth.uid() : 현재 인증된 사용자의 고유 ID  
-- * user_id : 검사할 행의 user_id 값    

-- 참고) using의 내부적인 변환 과정    
-- https://supabase.com/docs/guides/auth/row-level-security#policies
create policy "Individuals can view their own todos."
on todos for select
using ( auth.uid() = user_id );

-- RLS(using 구문)이 적용된 select sql은 아래처럼 변환됩니다.  
select * from todos
where auth.uid() = todos.user_id; -- RLS Policy is implicitly added.
```


## 📌 RLS - INSERT, UPDATE, DELETE POLICY   

### WITH CHECK expression

- INSERT, UPDATE 연산을 하고 난 후에 체크할 부분  

설명  
- 이 식은 행 수준 보안이 활성화된 경우 테이블에 대한 INSERT 및 UPDATE 쿼리에 사용됩니다.
- 표현식이 true로 평가되는 행만 허용됩니다. 삽입된 레코드나 업데이트로 인해 생성된 레코드에 대해 표현식이 false 또는 null로 평가되면 오류가 발생합니다.
- 이 표현식은 원래 내용이 아닌 행의 제안된 새 내용에 대해 평가됩니다.  

CHECK Expression 은 사후 처리 검증을 시도하고 오류라면 롤백한다.   
- todos 테이블에 대해서 insert : authenticated (로그인 한 사용자만 가능)    
- todos 테이블에 대해서 update : owner (만든 사람만 가능)  
- todos 테이블에 대해서 delete : owner (만든 사람만 가능)  

```sql
-- INSERT는 사후 검증만 가능  
CREATE POLICY "Enable insert for authenticated users only" ON "public"."todos"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (true) -- WITH CHECK expression

-- UPDATE는 더블체크  
CREATE POLICY "Enable update for users based on user_id" ON "public"."todos"
AS PERMISSIVE FOR UPDATE
TO public
USING (auth.uid() = user_id)  -- USING expression
WITH CHECK (auth.uid() = user_id) -- WITH CHECK expression

-- DELETE는 사전 검증만 가능  
CREATE POLICY "Enable delete for users based on user_id" ON "public"."todos"
AS PERMISSIVE FOR DELETE
TO public
USING (auth.uid() = user_id) -- 로그인한 uid 랑 이 테이블의 user_id가 같은지 체크한다.  
```