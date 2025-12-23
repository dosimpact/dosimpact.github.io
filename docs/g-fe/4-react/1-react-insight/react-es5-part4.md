---
sidebar_position: 5
---

# 리액트 인사이트 Part5

##  
__19.5 액션과 함께 사용하는 리액트 19버전 훅  
____19.5.1 액션과 서버 액션의 관계  
____19.5.2 useActionState( )과 트랜지션 사용하기  
____19.5.3 useOptimistic( )으로 낙관적 업데이트 구현하기  
____19.5.4 useFormStatus( )로 폼 상태 확인하기  
학습 마무리 | 핵심 키워드 리마인드  

📌 App Router의 File Convention  
- page router는 파일명 기반으로 라우터가 되는 반면 app router는 디렉터리 구조가 라우터 구조가 된다.  
- 디렉터리 구조에 따라서 Component hierarchy가 만들어진다.  
- https://nextjs.org/docs/app/getting-started/project-structure#component-hierarchy  

![Alt text](image.png)  
```js
순서
1, layout.js
2, template.js
3, error.js
4, loading.js
5, not-found.js
6, page.js
```

![Alt text](image-1.png)  

- App Router의 장점  
  - 라우터의 구조를 선언적으로 관리한다.  
  - 라우팅과 관련된 컴포넌트로 응집도를 높인다. 

- 언제 Template을 사용해야 할까?
  - 페이지 전환 애니메이션: Framer Motion 등을 사용하여 페이지가 바뀔 때마다 등장 애니메이션을 보여줘야 할 때   
  - useEffect 재실행: 페이지 방문 시마다 로깅, API를 다시 호출
  - 상태 초기화: 사용자가 페이지를 바꿀 때마다 폼(Form) 입력 상태를 완전히 깨끗하게 비워야 하는 경우.    

사실상 template가 존재하는 기준, 하위 경로가 바뀌면 리셋  
- app/post/template.tsx  
  - /post/1 → /post/2: 리셋  
  - /post/list → /post/write: 리셋  
  - /post/detail/1 → /post/detail/2: 리셋    
- app/post/detail/template.tsx (자식 템플릿)
  - /post/1 → /post/2: No Render ❌  
  - /post/list → /post/write: No Render ❌  
  - /post/detail/1 → /post/detail/2: 리셋  

📌 정적렌더링, 동적렌더링  

정적렌더링 : 빌드타임때 미리 HTML을 만들어 두는 것  
- ISR 패턴은 정기적으로 다시 HTML을 빌드한다.  
- next.js는 기본적으로 정적렌더링을 하려고 한다.  
- generateStaticParams로 정적세그먼트 id 목록을 만들 수 있다.  
  - On demand static generation : 빌드타임때 생성하지 못한 정적페이지를 요청이 들어올때 만드는 것, 이후 캐시됨.  

정적페이지 결과물 
- 1,html : 순수 HTML, 이는 FCP 향상  
- 2,meta : 프레임워크 내부에서 관리하는 파일
- 3,rsc : RSC Payload 파일, 클라이언트 사이드 네비게이션 및 상태 관리  

RSC Payload 파일  
- 1, 서버 컴포넌트의 렌더링 결과
- 2, 클라이언트 컴포넌트의 '참조(Reference)' 및 위치
- 3, 데이터 (Props)  
```js
1:I{"id":"./src/Button.js","chunks":["client0"],"name":"default"}
2:"User Data"
0:["$","div",null,{"children":[["$","h1",null,{"children":"Hello"}],["$","$L1",null,{"text":"Click Me"}]]}]

1:I...: "ID 1번은 ./src/Button.js라는 클라이언트 컴포넌트야." (참조 정의)

0:[...]: "루트 트리는 div이고, 그 안에 h1('Hello')이 있고, 그 뒤에 ID 1번 컴포넌트(버튼)를 렌더링해."
```
RSC Payload가 트리로 변환되는 과정  
- 1,Deserialization : 텍스트를 다시 React Element 객체로 변환
- 2,Client Component Resolution : Placeholder에 클라이언트 컴포넌트를 맞춘다.  
- 3,Reconciliation : 최종 React Render Tree 만들고 후속으로 실제 DOM에 반영(hydration)한다.  

동적렌더링 : 사용자의 요청이 들어오면 HTML을 만드는 것   
- 동적 API (header, cookie)를 사용하는 경우 -> 동적
- searchParams를 사용하는 경우 -> 동적  
- dynamic 옵션값이 'force-dynamic' -> 동적  

```js
// On demand static generation 비활성화, 생성되지 않은 페이지는 404페이지 반환  
export const dynamicParams = false; 
export const revalidate = 60; // ISR 적용, 60초 
export const dynamic = 'auto' |'force-dynamic' // 기본값은 정적/동적 next가 선택한다. 
```


📌 캐시 전략  

1,다계층 케시 전략을 사용한다.  
- 1,서버사이드 캐시 전략 : 풀라우트 캐시  
- 2,클라이언트 사이드 캐시 전략 : 라우터 캐시 (후속 탐색  subsequent navigations)  
- 풀라우트 캐시에는 2가지로 방법으로 캐시된다.  
  - 1, 정적 렌더링 : 빌드시점에 미리 렌더링 되는 경우  
  - 2, 동적 렌더링 : 요청이 들어오는 경우 생성 후 캐싱된다.  
- *클라이언트 측에서 fetch함수의 옵션(no-store)으로 최신의 데이터를 받아 올 수 있다.  

2,라우터 캐시 (후속 탐색 subsequent navigations) 과정  
- 1, 풀라우트 캐시로 최초의 페이지를 받는다.  
- 2, 현재 페이지의 모든 Link태그의 RSC Payload를 프리패칭 한다.  
- 3, 하드 네이비게이션(a 태그 등, 브라우저가 리프레쉬 되는) 없이 소프트네비게이션으로 화면전환이 된다.  

📌 서버사이드 캐시  

1,요청 메모이제이션
- next.js에서는 fetch를 이용해서 서버 to 서버 데이터 패칭을 해야한다.   
- 문제점 : SSR과정에서 데이터 패칭은 여러 컴포넌트에 펼쳐서 나온다.   
  - 1,동일한 페이지 내 로컬 컴포넌트에서 중복된 요청을 하는 경우.
  - 2,서로 다른 유저의 request에서 요청이 오는 경우 위 1번이 여러번 발생   
  - (리액트에서 water fall fetching을 한번에 처리한다고 생각하면 부하가 상당할 것.)  
  - 1번을 해결하기 위해, 캐시기능이 wrapping된 fetch 라이브러리를 사용해아 한다.   
- axios등 외부라이브러리를 사용해도 무관하지만 React.cache로 감싸서 직접 캐시를 구현해야 한다.   


2,캐시 옵션 
- 단일 렌더링 과정이 아닌, 서버 수준에서 캐시를 설정할 수 있다.  
- 🔥 렌더링 수준에서 캐싱과 fetch 수준에서 캐시는 분리해서 생각해야 한다.   
  - 두 설정(Route Segment Cache <-> Data Cache )이 충돌하면 고수준 캐시가 저수준의 캐시를 무효화.   
  - 즉, 데이터 패칭이 만료되면 다시 리렌더링 해야하고, Route 캐시만 만료되면 데이터 패칭 캐시는 유지.   
- 캐시 무효화는 2가지 방법
  - 1,Time-based Revalidation
  - 2,On-demand Revalidation
    - 2.1, revalidateTag  
    - 2.2, revalidatePath  
- *fetch는 클라이언트에서는 다르게 동작함, 캐시 기능이 없으니 react-query 등을 사용 할 것.  
- *revalidatePath를 요청한 브라우저는 업데이트된 정보로 리렌더링이 되지만, 다른 유저의 브라우저까지 영향이 가지는 않는다.  

```js
fetch(.., { cache:"force-cache" });
fetch(.., { cache:"no-store" });
fetch(.., { revalidate:60 });


// 1. 기본값 (Static Data Fetching) - SSG
// 별도 설정이 없으면 'force-cache'로 동작하여 빌드 시점에 딱 한 번 데이터를 가져오고 영구 캐싱합니다.
// ISR, 동적 렌더링이 다시 시작되어도 여전히 캐시를 가져와서 사용한다.  
fetch('https://...'); 

// 2. 강제 캐시 (Static Data Fetching) - SSG, 1번과 동일하게 동작합니다.
fetch('https://...', { cache: 'force-cache' });

// 3. 캐시 안 함 (Dynamic Data Fetching) - SSR
fetch('https://...', { cache: 'no-store' });

// 4. 시간 기반 재검증 (Revalidation) - ISR
// 데이터를 캐싱하되, 60초가 지나면 낡은 데이터로 간주하고 백그라운드에서 새로 업데이트합니다.
// *주의: revalidate는 'next' 객체 안에 감싸야 합니다.
fetch('https://...', { next: { revalidate: 60 } });
```

📌 Router Handler   
- 클라이언트에게 API Endpoint를 노출 가능. 
- 'force-static' 옵션은 GET매서드 한에 정적 API 제공 가능. (영구적 캐시)  

📌 서버 액션  
- 서버 액션은 Router Handler를 완전히 대체하는 기술은 아니다.  
- mutation 동작에 대해서 서버의 리모트 함수를 콜 해주는 기능이다.  
- 장점 1, data mutation + rerendering 기능을 같이 수행 2, 별도의 end point없이 가능하다.  
- 내부적인 동작 원리
  - 1,header에 Accpet=text/x-component와 action id로 호출한다.  
  - 2,서버 액션들의 매핑된 manifest 파일이 있다. action id -> module id로 어떤 함수를 호출해야 할지 안다.  
  - 3,서버 액션 후 RSC Payload를 리턴하여 브라우저는 부분적 UI 업데이트 진행.  


📌 리액트 액션  
- 리액트에서 액션은 사용자 인터페이스(UI) 내에서 비동기 작업을 처리하는 함수  
  - 특히 useActionState, useFormStatus, useOptimistic 같은 훅들과 함께 사용  
  - 트랜지션 컨텍스트 안에서 실행되는 함수이기도 하다.  
- 리액트에서 UI 업데이트는 2가지로 분류
  - 1,Urgent Update : 즉시 UI가 업데이트 되어야 하는 경우  
  - 2,Transition Update : 무거운 작업때문에 화면이 멈추는 현상을 해결하기 위함  
    - eg, 검색어 입력 후 결과 렌더링, 무거운 컴포넌트로의 탭 전환  
    - *리액트에게 렌더링 우선순위를 전달 가능.   

