---
sidebar_position: 8
---

# Supabase Functions, Triggers  

- [Supabase Functions, Triggers](#supabase-functions-triggers)
  - [📌 Function](#-function)
    - [eg) hello world 출력](#eg-hello-world-출력)
    - [eg) loop등 sql문법 사용 가능](#eg-loop등-sql문법-사용-가능)
    - [eg) RLS with function (auth.uid())](#eg-rls-with-function-authuid)
    - [eg) function(select \* )](#eg-functionselect--)
  - [More](#more)
    - [Database Functions vs Edge Functions](#database-functions-vs-edge-functions)
  - [📌 Profile management](#-profile-management)
  - [📌 function with pgVector](#-function-with-pgvector)


https://supabase.com/docs/guides/database/functions

## 📌 Function

### eg) hello world 출력  

```sql
-- define function  
create or replace function hello_world() -- 1 upsert
returns text -- 2 return types (void, int, ... )
language sql -- 3 plpgsql, plv8, plpython
as $$  -- 4 function wrapper open  
  select 'hello world';  -- 5 sql 
$$; --6 wrapper close

-- function call
select hello_world();

-- js 
const { data, error } = await supabase.rpc('hello_world')
```

### eg) loop등 sql문법 사용 가능  

```sql
-- upsert function 
create or replace function output_hello_world()
returns setof text 
as $$
declare
    i integer;
begin
    for i in 1..2 loop
        return next format('%s - hello world', i);
    end loop;
end;
$$ language plpgsql;

-- function 호출
SELECT output_hello_world();
-- returns
-- 1 - hello world
-- 2 - hello world
```

### eg) RLS with function (auth.uid())

- auth.uid()는 현재 세션 테이블 정보를 바탕으로 로그인한 사용자의 uid를 리턴   
- RLS에 function 호출가능.  

```sql
CREATE POLICY "Enable select for users based on user_id" ON "public"."todos"
AS PERMISSIVE FOR SELECT
TO public
USING (auth.uid() = user_id)  
```

### eg) function(select * )

```sql  
--- DDL
create table planets (
  id serial primary key,
  name text
);
insert into planets (id, name)
values (1, 'Tattoine'),  (2, 'Alderaan'),  (3, 'Kashyyyk');

create table people (
  id serial primary key,
  name text,
  planet_id bigint references planets
);

insert into people (id, name, planet_id)
values
  (1, 'Anakin Skywalker', 1),
  (2, 'Luke Skywalker', 1),
  (3, 'Princess Leia', 2),
  (4, 'Chewbacca', 3);

--- function
create or replace function get_planets()
returns setof planets
language sql
as $$
  select * from planets;
$$;
```

## More

### Database Functions vs Edge Functions  

- Database Functions: 데이터 집약적인 작업에 적합하며, 데이터베이스 내부에서 실행됩니다. REST 및 GraphQL API로 호출 가능.
- Edge Functions: 지정학적 low-latency 요구 작업에 적합, Typescript로 작성된 글로벌 분산 환경에서 실행됩니다.


## 📌 Profile management  

- supabase에서 auth.users 테이블은 직접 접근이 불가능하다.  
  - 정교하게 돌아가는 사용자 인증 관리 시스템은 보호되고 있다.  
- 사용자가 가입이 되는 순간 profiles이라는 테이블로 데이터들을 복사해야 한다.  
  - 이때 trigger, function이 사용된다.  
  - 아래 예시에서
    - on_auth_user_created : after insert on auth.users 조건일 때 트리거  
    - 뭐를 ?: handle_new_user 를, 해당 함수에서는 raw_user_meta_data의 json데이터와 profile의 컬럼을 매핑하고 있다.   

```sql
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  email text,

  constraint username_length check (char_length(username) >= 3)
);
-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, website, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', NULL, new.raw_user_meta_data->>'email');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

```

*raw_user_meta_data에서 email 컬럼 추가해야 한다.  
*function, trigger 삭제가 필요하다면 trigger 먼저 지워야 한다.  
- `DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;`    


## 📌 function with pgVector    

- 문서 유사도 검색  

```sql
-- Create embedding similarity search functions
-- #variable_conflict use_variable : 테이블 열의 이름이 동일할 때 충돌 시 변수를 우선 참조.
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
  -- <#> - (negative) inner product 연산자이다.  
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
```

```js
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
