---
sidebar_position: 11
---

# Supabase Functions, Triggers  


## Profile management  

- supabase에서 auth.users 테이블은 직접 접근이 불가능하다.  
  - 정교하게 돌아가는 사용자 인증 관리 시스템은 보호되고 있다.  
- 사용자가 가입이 되는 순간 profiles이라는 테이블로 데이터들을 복사해야 한다.  
  - 이때 trigger, function이 사용된다.  
  - 아래 예시에서
    - on_auth_user_created : after insert on auth.users 조건일때 트리거  
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