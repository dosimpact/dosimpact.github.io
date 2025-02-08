---
sidebar_position: 2
---

# Routing

[Routing Fundamentals](https://nextjs.org/docs/app/building-your-application/routing)

## Linking and Navigating  

How Routing and Navigation Works    

next.js에서는 Route segments 단위로 코드 스플릿팅이 된다.  
- 그 이유는 Route segments 별로 프리패칭 및 캐싱으로  
- 다른 페이지 이동할때 빠르게 이동할수 있도록 하기 위함이다.  

1.코드 스플리팅 (Code Splitting)  
- Application이 작은 번들단위로 분리되며, 다운로드 사이징을 줄여 최적화.  
- RSC에서 Route segments, Suspense 기준으로 

2.프리페칭 (Prefetching)
- Link 컴포넌트: 사용자의 뷰포트에 들어오면 자동으로 프리페칭됨, Loading컴포넌트 까지만 다운받고 풀패칭은 아님.!  
- router.prefetch(): useRouter 훅 제공 
- *개발 환경에서는 프리페칭이 활성화되지 않음.

3.캐싱 (Caching)  
- 캐싱에는 크게 4가지 매커니즘이 있으며, 함수 호출, Data, HTML, RSC Payload 등을 캐싱한다.  
- 캐시는 서버 그리고 Router Cache매커니즘은 브라우저에서 동작한다.  
- 캐싱을 통해 데이터 요청 횟수를 줄일 수 있다.    

4.부분 렌더링 (Partial Rendering)  
- 변경된 라우트 세그먼트만 다시 렌더링하고, 공유된 레이아웃은 유지하여 데이터 전송량 감소 및 실행 시간 최적화.

5.소프트 네비게이션 (Soft Navigation)
- hard navigation : 브라우저의 전체 새로고침   
- Partial Renderind으로 변경된 부분만 업데이트하여 클라이언트 상태를 유지함.

6.Back and Forward Navigation
- 스크롤 위치 유지 및 Router Cache를 활용해 빠른 네비게이션 제공.

7.pages/와 app/ 간 라우팅  
- Next.js는 pages/에서 app/으로 점진적으로 마이그레이션할 때 자동으로 하드 네비게이션 처리.  
- next.config.js에서 experimental.clientRouterFilter 옵션을 조정하여 제어 가능. 



## Loading UI and Streaming
- streaming-with-suspense : suspense를 이용해서 UI 스트리밍 하기   
  - https://nextjs.org/docs/14/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense


## Redirecting

2.Optimizing data lookup performance  
- Bloom Filter를 사용해서 특정 url에는 확실하게 데이터가 없는지 판단할 수 있다.  
- Bloom Filter의 원리는 요소를 해시화 하여 마킹을 하는 원리이다. 삽입,검색 = O(k), k는 해시 함수 개수   


## Route Groups
>URL경로 매커니즘에 영향없이, 디렉터리를 정리하고 싶을때  
- 예를들어 인증한 사용자만 접근하는 디렉터리, 모두가 접근 가능한 디렉터리, 미인증 사용자만 접근 가능한 디렉터리  

## Dynamic Routes
>동적 경로에 대한 처리,
- Generating Static Params : 세그먼트에 대해서 정적 페이지를 생성하는 로직 


## Parallel Routes
>Streaming UI를 app router에 구현했다. @slot 컨벤션을 사용한다.  

## Intercepting Routes  
>사진 카드를 클릭해서 모달창에 사진 UI을 보여준다. 하지만 현재 링크를 다시 브라우저에 넣으면 사진 페이지로 이동하고 싶을때    

