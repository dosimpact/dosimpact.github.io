---
sidebar_position: 4
---


# Supabase DML


## next server actions + supabase client

- 아래 예시는 actions를 이용한 예이다.  
- 서버액션으로 사용하기 위해서 "use server"; 선언 및 비동기 함수로 정의하자.    
- 참고 - https://www.youtube.com/watch?v=PdmKlne1gRY   

주의점  
- 서버 액션은 서버 컴포넌트를 포함한 미들웨어, 다른 서버 액션, 라우터 핸들러에서 호출될 수 있다.  
- 이때 서버 컴포넌트에서 SSR 중에 서버 액션을 부르게 되면 쿠키에 대한 조작을 금지 해야 한다.  
- 그래서 액션한테 어떠한 곳에서 서버 액션을 불렀는지 알려주어야 한다.   


## SELECT

```js
"use server";
import { createServerSideClient } from "@/lib/supabase";

interface ContextProps {
  serverComponent?: boolean;
}

export const getTodosPublic = async (ctx?: ContextProps) => {
  const supabase = await createServerSideClient(ctx?.serverComponent);
  const result = await supabase
    .from("todos-public")
    .select("*")
    .is("deleted_at", null)
    .order("id", { ascending: false });

  // this make error.jsx show
  //   throw new Error("custom error");
  //   return;
  //   if (result.error)
  return result.data;
};

export const getTodosPublicById = async (id: number, ctx?: ContextProps) => {
  const supabase = await createServerSideClient(ctx?.serverComponent);
  const result = await supabase
    .from("todos-public")
    .select("*")
    .is("deleted_at", null)
    .eq("id", id);

  return result.data?.[0];
};

export const getTodosPublicBySearch = async (
  terms: string,
  ctx?: ContextProps
) => {
  const supabase = await createServerSideClient(ctx?.serverComponent);
  const result = await supabase
    .from("todos-public")
    .select("*")
    .is("deleted_at", null)
    .ilike("content", `%${terms}%`);

  return result.data;
};

```

## Mutation  

- update는 eq로 선택 + update안에는 업데이트 할 내용을 적어준다.  
- softDelete는 string타입(ISO)으로 삭제된 날짜를 넘겨주면서 구현한다.  

```js

export const createTodosPublic = async (
  content: string,
  ctx?: ContextProps
) => {
  const supabase = await createServerSideClient(ctx?.serverComponent);
  const result = await supabase
    .from("todos-public")
    .insert({ content })
    .select();

  return result.data;
};

export const updateTodosPublic = async (
  id: number,
  content: string,
  ctx?: ContextProps
) => {
  const supabase = await createServerSideClient(ctx?.serverComponent);
  const result = await supabase
    .from("todos-public")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select();

  return result.data;
};

export const deleteTodosPublicSoft = async (id: number, ctx?: ContextProps) => {
  const supabase = await createServerSideClient(ctx?.serverComponent);
  const result = await supabase
    .from("todos-public")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .select();
  return result.data;
};

export const deleteTodosPublicHard = async (id: number, ctx?: ContextProps) => {
  const supabase = await createServerSideClient(ctx?.serverComponent);
  const result = await supabase.from("todos-public").delete().eq("id", id);

  return result.data;
};



```