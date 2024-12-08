---
sidebar_position: 3
---


# Supabase DDL

- [Supabase DDL](#supabase-ddl)
  - [📌 Row Level Security - RLS](#-row-level-security---rls)
      - [RLS 로 해결하는 API 취약점](#rls-로-해결하는-api-취약점)
  - [RLS 문법](#rls-문법)
  - [📌 todos with no-RLS](#-todos-with-no-rls)
    - [REST API](#rest-api)
  - [todos with RLS](#todos-with-rls)
    - [DDL with editor](#ddl-with-editor)
      - [user relations](#user-relations)
      - [조회 정책](#조회-정책)
      - [Mutation 정책](#mutation-정책)
    - [USING expression](#using-expression)
    - [WITH CHECK expression](#with-check-expression)
    - [응용, 공개 설정 처리](#응용-공개-설정-처리)
  - [TS - generating types](#ts---generating-types)


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


## 📌 todos with no-RLS
![Alt text](image-5.png)

```
[READ]
select * from public."todos-no-rls";

- id를 내림차 순으로 public."todos-no-rls" 조회 해줘
select  * from public."todos-no-rls" order by id desc;

- public."todos-no-rls" 에서 deleted_at이 null 인것만 모두 조회해
select  * from  public."todos-no-rls" where  deleted_at is null;

- 빨래라는 단어가 포함되는 조건을 추가해줘  
select * from  public."todos-no-rls" where  deleted_at is null and content like '%빨래%';

[CREATE]
insert into  public."todos-no-rls" (content) values  ('빨래를 세탁하기');

[UPDATE]
- content 값을 업데이트하는 sql 구문 만들어줘
update public."todos-no-rls" set content = '신발 세탁 2' where  id = 5;

- updated_at 을 현재시간으로 업데이트 하는 update 구문 만들어줘
update public."todos-no-rls" set  content = '신발 세탁 2', updated_at = current_timestamp where  id = 5;

[Delete]
- 특정 행을 지우는 구문 만들어줘
delete from public."todos-no-rls" where id = 5;

---

```

### REST API

![Alt text](image-6.png)

## todos with RLS

### DDL with editor

![Alt text](image-4.png)

#### user relations  




|Add foreign key relation|Foreign Keys|
|------|---|
|![Alt text](./img/image-3.png)  |![Alt text](./img/image-4.png)|


#### 조회 정책

```sql
---누구나 조회가 가능함  
CREATE POLICY "Enable insert for authenticated users only" ON "public"."todos"
AS PERMISSIVE FOR SELECT
TO public  -- public | anon \ authenticated
USING (true)

-- 로그인 한 사용자만 조회가 가능함.(위 조건 없음??)
CREATE POLICY "Enable insert for authenticated users only" ON "public"."todos"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (true)


--소유권자만 조회가 가능함  
CREATE POLICY "Enable insert for users based on user_id" ON "public"."todos"
AS PERMISSIVE FOR SELECT
TO public
USING (auth.uid() = user_id)

-- 문서 
-- 변환 설명 : https://supabase.com/docs/guides/auth/row-level-security#policies
create policy "Individuals can view their own todos."
on todos for select
using ( auth.uid() = user_id );
>>>.. 사용자가 todos 테이블에서 선택을 시도할 때마다 다음과 같이 변환됩니다.
select *
from todos
where auth.uid() = todos.user_id;
-- Policy is implicitly added.

-- 모든 roles : https://supabase.com/docs/guides/database/postgres/roles#supabase-roles 
```

#### Mutation 정책

- todo insert는 로그인 된 사용자만 가능하게 만들자.  
- todo update는 만든 사람만 가능하게 하자.  
- todo delete는 만든 사람만 가능하게 만들자.  

```sql
CREATE POLICY "Enable insert for authenticated users only" ON "public"."todos"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (true) -- WITH CHECK expression

CREATE POLICY "Enable update for users based on user_id" ON "public"."todos"
AS PERMISSIVE FOR UPDATE
TO public
USING (auth.uid() = user_id)  -- USING expression
WITH CHECK (auth.uid() = user_id) -- WITH CHECK expression

CREATE POLICY "Enable delete for users based on user_id" ON "public"."todos"
AS PERMISSIVE FOR DELETE
TO public
USING (auth.uid() = user_id) -- 로그인한 uid 랑 이 테이블의 user_id가 같은지 체크한다.  

```

### USING expression

- where 처럼 생각하면 된다.  
- SELECT, UPDATE, DELETE 연산을 하기 전에 해당 Where 절이 먼저 실행된다고 생각하면된다.  
- 어떠한 작업을 하기 전에 사전에 실행되는 것이다.  

eg) SELECT에 auth.uid() = user_id을 걸면   
- 로그인 한 사용자의 Row만 보인다.  

설명  
- 이 식은 행 수준 보안이 활성화된 경우 테이블을 참조하는 쿼리에 추가됩니다.
- 표현식이 true를 반환하는 행이 표시됩니다. 식이 false 또는 null을 반환하는 모든 행은 사용자에게 표시되지 않으며(SELECT에서) 수정할 수 없습니다(UPDATE 또는 DELETE에서).
- 이러한 행은 자동으로 표시되지 않으며 오류가 보고되지 않습니다.

### WITH CHECK expression

- INSERT, UPDATE 연산을 하고 난 후에 체크할 부분  

설명  
- 이 식은 행 수준 보안이 활성화된 경우 테이블에 대한 INSERT 및 UPDATE 쿼리에 사용됩니다.
- 표현식이 true로 평가되는 행만 허용됩니다. 삽입된 레코드나 업데이트로 인해 생성된 레코드에 대해 표현식이 false 또는 null로 평가되면 오류가 발생합니다.
- 이 표현식은 원래 내용이 아닌 행의 제안된 새 내용에 대해 평가됩니다.


### 응용, 공개 설정 처리

```
--공개 설정 처리  
CREATE POLICY "Enable select for users based on is_open ON "public"."todos"
AS PERMISSIVE FOR SELECT
TO public
USING (is_open)
```

## TS - generating types  

DB 스키마를 바탕으로 타입 제너레이팅이 가능하다.  
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
// mkdir ./types
npx supabase gen types typescript --project-id txigexxxxpllferqc --schema public > types/supabase.ts

---
// eg) type generic 
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/supabase";

export const supaBrowserClient = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!
);

```