---
sidebar_position: 3
---

# Supabase DDL 

## 📌 Todo Table DDL (without RLS)    


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
