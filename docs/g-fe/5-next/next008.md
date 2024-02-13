---
sidebar_position: 8
---


# Supabase Concepts


- [Supabase Concepts](#supabase-concepts)
  - [Docs](#docs)
  - [RLS](#rls)
    - [BOLA](#bola)

## Docs 

Docs > https://supabase.com/docs

## RLS

Supabase의 RLS는 "Row-Level Security"의 약자. 
- 데이터베이스 테이블의 행에 대한 보안을 관리하는 기능
- 사용자 또는 역할이 특정 행에 접근할 수 있는지 여부를 제어. 

RLS를 사용하면 데이터베이스에 저장된 정보에 대한 엑세스를 효과적으로 제어할 수 있습니다.   
예를 들어, 특정 사용자에 대한 특정 행의 읽기 또는 쓰기 권한을 제한할 수 있습니다.  
이는 데이터의 보안 및 개인 정보 보호를 강화하는 데 도움이 됩니다.   

이렇게하면 데이터베이스의 각 행에 대한 엑세스를 세밀하게 제어하여 데이터 보안을 강화할 수 있습니다.  
Supabase의 RLS는 데이터베이스 관리 및 보안을 개선하는 데 유용한 도구 중 하나입니다.

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

