---
sidebar_position: 2
---

# 2.Enviroment variables

Guide : https://nextjs.org/docs/app/guides/environment-variables  


📌 .env와 같은 파일을 만들어서 환경변수를 관리한다.    
- 런타임 환경변수와 빌드 타임 환경변수가 있다.  
- Page Router의 next.config.js에 설정하는 Runtime Config은 권장하지 않는다.  


빌드 타임 환경변수  
- NEXT_PUBLIC_ANALYTICS_ID 처럼 NEXT_PUBLIC 접두사를 붙여야 함. 
- 빌드 타임때 하드 코딩된 상수로 치환된다. 
- 아래 처럼 변수를 사용하면 작동이 안된다.   
```js
// This will NOT be inlined, because it uses a variable
const varName = 'NEXT_PUBLIC_ANALYTICS_ID'
setupAnalyticsService(process.env[varName])
 
// This will NOT be inlined, because it uses a variable
const env = process.env
setupAnalyticsService(env.NEXT_PUBLIC_ANALYTICS_ID)
```

런타임 환경변수  
- 서버에서 실행되는 환경 변수이다.  
- 도커 컨테이너의 환경변수로 전달 가능.  


📌 중요한 포인트: NEXT_PUBLIC_ 접두사로 런타임/빌드타임 변수 구분이 불가능 하다.  
- 코드가 실행되는 위치에 따라서 NEXT_PUBLIC_ 변수가 런타임으로 사용 가능하다.  
- 쉽게 생각하면 ('use client') 가 있다면 빌드 타임 변수가 된다.  
- *아래 코드 예시처럼 'NEXT_PUBLIC_SUPABASE_URL' 값을 서버 런타임에서도 사용한다면 환경변수로 넣어야 한다.  

```js
import "server-only";

// 서버에서 실행되는 코드 (런타임에 환경변수 읽음)
export async function createSupabaseServerClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL, // 런타임에 실제 환경변수 값
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
```