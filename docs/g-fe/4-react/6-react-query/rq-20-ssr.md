---
sidebar_position: 20
---

# React Query - SSR1

- [React Query - SSR1](#react-query---ssr1)
  - [Performance \& Request Waterfalls](#performance--request-waterfalls)
  - [Prefetching \& Router Integration](#prefetching--router-integration)
  - [Server Rendering \& Hydration](#server-rendering--hydration)

## Performance & Request Waterfalls

https://tanstack.com/query/v5/docs/framework/react/guides/request-waterfalls

Request Waterfall 이란?  
- 어떤 리소스 요청이 완료 되어야 다음 리소스 요청이 진행되는 현상.  
- 리소스 요청이 다른 리소스에 의존하는 경우 등 원인에 따라 해결전략이 다르다.   


1, 단일 요청 워터폴 문제  
- 상황 : user 정보를 요청 후 user id로 리소스를 요청하는 경우  
  - 1-1, 2번의 요청을 할 필요없이 Backend에서 API을 하나로 통합해서 내려준다.  
  - 1-2, (요청 간 의존성이 없는 전제) 복수의 useQuers는 직렬로 요청된다. 이는 useQueris로 해결 가능하다.  

```js
  const usersQuery = useSuspenseQuery({ queryKey: ['users'], queryFn: fetchUsers })
  const teamsQuery = useSuspenseQuery({ queryKey: ['teams'], queryFn: fetchTeams })
  const projectsQuery = useSuspenseQuery({ queryKey: ['projects'], queryFn: fetchProjects })
---
const [usersQuery, teamsQuery, projectsQuery] = useSuspenseQueries({
  queries: [
    { queryKey: ['users'], queryFn: fetchUsers },
    { queryKey: ['teams'], queryFn: fetchTeams },
    { queryKey: ['projects'], queryFn: fetchProjects },
  ],
})
```

2, 부모-자식 컴포넌트 워터풀  
상황 : 부모 컴포넌트 쿼리 완료 > 렌더링 완료 > 자식 컴포넌트 쿼리 시작  
- 2-1, 쿼리 호이스팅 : 자식에서 어떤 쿼리를 가져오는지 안다면 미리 쿼리 요청하기  
- 상위 쿼리에 의존하지 않는 경우
  - 2-2, API 통합이 가능한 경우 혹은 Graph 쿼리의 경우 미리 리프노드도 요청하기  
  - 추가로 서버 컴포넌트을 사용하면 RTT(Round Trip Time) 최소화 가능, 서버와 서버 통신은 2ms인데 클라이언트와 서버는 200ms 등 지연시간이 더 길다.  

3, 코드 스플릿팅  
- 상황 : JS리소스를 가져오고 > 컴포넌트 최초 렌더링 > 데이터 패칭 시장   
- 개선 : 코드 스플릿과 동시에, 미리 데이터를 패칭해서 가져온다.  

## Prefetching & Router Integration

https://tanstack.com/query/v5/docs/framework/react/guides/prefetching  

프리패칭 기법을 통해 데이터를 미리 가져오면 2가지 장점이 있다.  
- reqeust waterfalls (렌더링 워터폴)을 피할 수 있음.  
- 사전에 미리 데이터를 가져오므로 빠른 사용자 경험 가능.  

이허란 프리패칭은 크게 3가지 패턴에서 작성 가능  
- 1, 이벤트 핸들러 : 사용자의 행동 경로에서 미리 데이터를 가져오기  
  - 예, 버튼에 마우스 호버를 한 경우 프리패칭   
- 2, 상위 컴포넌트에서 하위 컴포넌트의 API요청을 프리패칭하기. 렌더링 워터폴을 피할 수 있다.  
- 3, 라우터 통합 : 라우터 하위에서 사용하는 모든 데이터를 프리패칭  



## Server Rendering & Hydration

https://tanstack.com/query/v5/docs/framework/react/guides/ssr

SSR에서 구지 react-query 객체의 hydration을 해야하는 이유  
- SSR의 목적은 html preview를 만들어서 첫화면 렌더링 시간을 단축하는데 의의가 있다.  
- 이때 데이터 패칭을 SSR 과정에서 진행하고 후속 CSR에서 그 데이터를 조작해야 한다면 하이드레이션 과정이 필요하다. 
- 서버 데이터 관리의 주체가 react-query라면 그들의 hydration을 규칙을 따라야 함.    



