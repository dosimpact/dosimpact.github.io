---
sidebar_position: 9
---

# Supabase Edge Functions  

- [Supabase Edge Functions](#supabase-edge-functions)
  - [About Edge Functions](#about-edge-functions)
    - [장점:엣지 함수를 사용해야 하는 이유](#장점엣지-함수를-사용해야-하는-이유)
    - [단점](#단점)
  - [Developing Edge Functions locally](#developing-edge-functions-locally)
  - [Deploy to Production](#deploy-to-production)
  - [Example](#example)

Guide Docs  
- quickstart : https://supabase.com/docs/guides/functions/quickstart
- deploy : https://supabase.com/docs/guides/functions/deploy  


## About Edge Functions  


### 장점:엣지 함수를 사용해야 하는 이유  

1.빠른 응답 속도:
   - 가용성:엣지 함수는 글로벌하게 분산된 엣지 네트워크에서 실행되므로 사용자에게 가장 가까운 위치에서 요청을 처리
   - 이로 인해 응답 시간이 크게 단축되어 사용자 경험이 개선. 

2.서버리스 아키텍처:
   - 엣지 함수는 서버리스로 동작하므로 별도의 서버를 관리할 필요가 없습니다. 
   - 확장성:엣지 함수는 자동으로 확장됩니다. 사용량이 급증하더라도 인프라를 자동으로 확장하여 고가용성을 보장합니다.
   - Stripe와 같은 서드파티 서비스와의 통합을 엣지 함수에서 처리하여 서버 부하를 줄이고, 더 빠르게 트랜잭션을 처리할 수 있습니다.  

### 단점  

1.추가적인 복잡성  
- 엣지 함수를 사용하면 애플리케이션이 더 분산된 구조를 갖게 되어, 로깅, 디버깅, 모니터링 등이 복잡  
- 특히 엣지 위치에서 발생한 문제를 추적하는 것이 어려울 수 있습니다.  

2.제한된 런타임 환경  
- 엣지 함수는 Deno를 기반으로 하기 때문에 Node.js나 브라우저 환경에서 사용할 수 있는 일부 라이브러리나 API를 사용할 수 없습니다. 
- 이는 기존의 Node.js 기반 프로젝트를 엣지 함수로 이식할 때 문제가 될 수 있습니다.  

## Developing Edge Functions locally  

- 도커가 필요하며, supabase/edge-runtime 이미지를 활용하여 로컬에서 edge functions를 개발, 빌드, 테스트 한다.  

```js
# 프로젝트에 supabase 디렉터리를 생성한다. 이곳이 작업공간이 된다.  
supabase init

# 새로운 함수 만들기
supabase functions new hello-world

# 결과
└── supabase
    ├── functions
    │   └── hello-world
    │   │   └── index.ts ## Your function code
    └── config.toml

예)
Deno.serve(async (req) => {
  const { name } = await req.json()
  const data = {
    message: `Hello ${name}!`,
  }

  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
})

## 로컬 테스트

# 로컬에서 슈파베이스를 실행시킨다.  
supabase start # start the supabase stack

# 서비스 중 엣지 팡션을 시작한다.   
supabase functions serve # start the Functions watcher

# 로컬에서는 별도의 배포 없이 즉시 테스트가 가능하다.    
curl --request POST 'http://localhost:54321/functions/v1/hello-world' \
  --header 'Authorization: Bearer SUPABASE_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{ "name":"Functions" }'


# sdk에서, 엣지 함수 배포 후 다음처럼 호출하면 된다.  
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
const { data, error } = await supabase.functions.invoke('hello-world', {
  body: { name: 'Functions' },
})

# 테스트 후 종료
supabase stop
```

## Deploy to Production

```js
# 로그인 후 여러 프로젝트 중 어느것에 연결시킬지 고른다.  
supabase login
supabase projects list
supabase link --project-ref <your-project-id>

# 모든 함수 배포  
supabase functions deploy 

# 특정 함수 배포  (jwt token 필요)  
supabase functions deploy hello-world 

# 테스트  
curl --request POST 'https://jzdmzxppyivazcgdsiul.supabase.co/functions/v1/hello-world' \
  --header 'Authorization: Bearer ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{ "name":"Functions" }'


# 특정 함수 배포 (jwt token 필요 x, public)    
supabase functions deploy hello-world --no-verify-jwt 

# 테스트  
curl --request POST 'https://jzdmzxppyivazcgdsiul.supabase.co/functions/v1/hello-world' \
  --data '{ "name":"Functions" }'

```

## Example  

https://github.com/supabase/supabase/tree/master/examples/edge-functions/supabase/functions  
