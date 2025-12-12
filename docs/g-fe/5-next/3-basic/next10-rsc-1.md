---
sidebar_position: 10
---

# Hello, 리액트 서버 컴포넌트 

- [Hello, 리액트 서버 컴포넌트](#hello-리액트-서버-컴포넌트)
  - [Hello, 리액트 서버 컴포넌트](#hello-리액트-서버-컴포넌트-1)
  - [Next.js의 렌더링 5단계](#nextjs의-렌더링-5단계)
    - [1~2 : 서버에서 일어나는 과정](#12--서버에서-일어나는-과정)
    - [3~5 : 브라우저에서 일어나는 과정](#35--브라우저에서-일어나는-과정)
  - [RSC에서 고려해야 할 점](#rsc에서-고려해야-할-점)


## Hello, 리액트 서버 컴포넌트 

리액트만 사용했던 사람이라면, 서버컴포넌트에 익숙하지 않을 수 있다.     
- 서버 컴포넌트는 말 그대로 서버에서 작동되는 컴포넌트이다.  
- 서버에서만 접근 가능한 리소스들을 이용해서 리액트 컴포넌트를 전처리 후 나머지 후속작업은 브라우저에게 넘겨준다.  
- 리액트 트리를 초벌구이 해놓은 느낌이다.   
- 서버에서만 접근 가능한 리소스(DB, Service)에서 데이터 패칭 후 HTML Preview를 만들 수 있다.  
- 그 이후에 브라우저에서는 hydration 과정을 거쳐서 클라이언트 컴포넌트가 작동된다.  

용어  
- RSC : 리액트 서버 컴포넌트   
- RCC : 리액트 클라이언트 컴포넌트  
- SSR (Server Side Rendering) : RSC, RCC를 사용해서 서버 사이드에서 preview html 및 RSC Payload를 만드는 작업  


1.Next.js 에서 컴포넌트는 리액트와 다르게 기본적으로 서버 컴포넌트이다.  
- 클라이언트 컴포넌트 선언을 위해서 'use client' 디렉티브를 파일 상단에 적어준다.    
- 클라이언트 컴포넌트에서 import하는 하위 컴포넌트는 모두 클라이언트 컴포넌트가 된다.  
  - 서버 컴포넌트에서 import하는 하위 컴포넌트는 서버, 클라이언트 컴포넌트가 가능.  
  - 즉, 모듈 수준에서 RSC, RCC가 결정 되며 RSC를 경계를 넓히고 싶다면 합성을 이용한다.  
- 클라이언트 컴포넌트에서 useState 등의 리액트 lifecycle hook을 사용할 수 있다.  

만약에 useClient을 안적는다면?  
- useState, useMemo 등 사용이 불가능하다.  
- 컴파일 경고가 나온다. 그렇지 않는 경우도 있다.  
- 애니메이션이 있는 Loading과 같은 컴포넌트는 애니메이션이 동작안할 수 있다.  


2.서버컴포넌트는 서버에서 랜더링 된다.  
- App Router는 Page를 Full Page, Sub Page로 구분한다.  
- Full Page 요청은 최초요청, 새로고침이다. 이때 SSR이 적용된다.    
  - `use client` 지시어를 사용했어도, SSR에 포함된다.  
  - useState 같은 경우 default 값으로 HTML이 구워져서 나온다. 
  - 그 이후 hydration 과정을 거쳐서 후속 렌더링이 이어진다.    

- Sub Page의 라우팅은 필요한 부분만 서버에서 추가 랜더링 된다.  
  - 특정 sub Page가 서버컴포넌트로 SSR이 가능하면 그 부분만 컴파일 된다.  
  - 기존의 Root Layout에서 context provider와 같은 클라이언트 상태가 유지된다.    
  - 그 이후 hydration 과정을 거쳐서 후속 렌더링이 이어진다.    

3.클라이언트 경계 

서버, 클라이언트 컴포넌트가 섞여서 복잡해 보이지만, 최종 목적은 최대한 서버에서 처리할 수 있는부분은 처리하고 나머지는 클라이언트에 던져주기 위함 이다.    
- RSC, RCC 가 혼합되지만, 결국 일부 렌더 트리는 클라이언트 단에서 처리가 필요하다.    
- SSR이 가능한 부분과 그렇지 않은 부분을 nextjs가 구분해서 최적화 한다.   
- 최대한 SSR에서 처리하고 나머지 부분은 browser에서 처리할 수 있도록 구분하는것이 중요하다.    
- 클라이언트의 경계를 구분짓기 위한 결과다.
- 컴포넌트가 아닌 파일 단위의 Tree 구조를 머리속에 그려야 한다.   

---

## Next.js의 렌더링 5단계    

Next.js의 이론으로 렌더링 단계를 5단계로 나누어서 배웠었다.  

https://dosimpact.github.io/docs/g-fe/common/deepdive/de01-2#nextjs%EC%9D%98-%EB%A0%8C%EB%8D%94%EB%A7%81-5%EB%8B%A8%EA%B3%84  

### 1~2 : 서버에서 일어나는 과정  

1.RSC > RSC Payload
- React는 서버 컴포넌트를 React 서버 컴포넌트 페이로드(RSC Payload)라는 특별한 데이터 형식으로 렌더링해요.

React 서버 컴포넌트 페이로드(RSC)
- 렌더링된 React 서버 컴포넌트 트리의 압축된 바이너리 표현이에요. 
- 이 페이로드는 클라이언트에서 React가 브라우저의 DOM을 업데이트하는 데 사용돼요. 
- RSC 페이로드에는 다음이 포함돼요:
  - 1.RCS 렌더링 결과
  - 2.Placeholders : CCS를 렌더링해야 하는 위치 + 해당 JavaScript 파일에 대한 references    
  - 3.서버 컴포넌트에서 클라이언트 컴포넌트로 전달된 모든 props

2.HTML 렌더링 결과물 출력  
- Next.js는 : RSC Payload + Client Component JavaScript instructions > 서버에서 HTML을 렌더링합니다.

### 3~5 : 브라우저에서 일어나는 과정   

3.HTML Preview  
- 브라우저에서는 SSR과정에서 생성된 HTML을 받아서 즉시 보여준다.  
- 이는 fast but non-interactive preview ( 초기 페이지 로드에만 해당, SEO 유리 )     

4.Reconcile  
- RCS Payload 를 통해 Client and Server Component trees의 Reconcile 이 일어난다.  
- Server Component trees 에는 Placeholders 가 존재한다.  
- 이 자리를 Client Component가 들어가도록 Reconcile(조정)이 일어난다.  
- 최종적으로 리액트 컴포넌트 트리=V-DOM이 만들어진다.    

5.Hydrate  
- Hydration은 Real DOM(HTML Preview으로 부터 만든)과 브라우저에서 다시 만든 Reconciled Render Tree를 매핑하는 과정이다.  
- Hydration은 interactive 만들기 위함이다.   
- Client Component JavaScript instructions 이 사용된다.  
  - 그 안에는 useState, Event Handler 함수 등이 있다.    

---


## RSC에서 고려해야 할 점  

리액트 컴포넌트의 초기 상태를 서버에서 관리하게 되면서 고려해야 할 점들이 있다.  
- 미들웨어를 통과하고 root layout, template, layout, page 순서로 렌더링이 진행된다.  

문제 1.📌 클라이언트의 초기 상태와 서버의 초기상태의 불일치  
- 예를들어 local storage에 최근 열었던 탭 정보를 저장한다고 가정하자.  
- SSR 과정에서는 브라우저의 로컬 스토리지에 당연히 접근 불가능하니, 디폴트 탭 상태로 렌더링 된다.  
- 클라이언트 리렌더링 과정에서 최근 열었던 탭으로 상태가 변경되는 불필요한 과정이 발생한다.  


문제 2.📌 fetch water fall을 피해야 한다.   
- 생각해보자. SSR과정에서 데이터 패칭 후 게시판 목록을 잘 생성했다. 이는 HTML Preview로 내려왔다.  
- 후속 렌더링에서 게시판 목록에 정렬, 페이지네이션을 적용할려면 데이터를 다시 가져와야 한다.  
- 즉 SSR과정에서 데이터 패칭 한번, CSR 과정에서 데이터 패칭 한번, 2번의 중복 요청이 발생할 수 있다.  
- 불필요한 데이터 패칭을 제거하도록 next.js의 캐시, server state hydrate 등의 조치가 필요하다.  


📌 해결하기: 클라이언트의 초기 상태와 서버의 초기상태의 불일치   


1.UI의 주요 상태를 쿠키에 저장하기  
- 서버에 요청을 보내면 브라우저는 쿠키값을 같이 보내게된다.  
- 그 쿠키값을 이용해서 초기 상태를 결정(deterministic) 가능.  
- 대표 케이스 : App Side Bar의 폴딩 로직, 나는 사이드바를 접었는데 새로고침하면 다시 열려요.!  
- CSR Only 케이스 : 브라우저 스토어에 UI 상태를 저장하는 것은 SSR에 사용하지 못한다.  

```ts
export default function SummaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read sidebar state from cookie on server
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
      <SidebarProvider defaultOpen={defaultOpen} className="flex-1" />
  );
}
```

2.쿼리 스트링으로 상태 관리하기  
- 쿠키의 특성은 state full 하다는 것이다. 동일한 url인데 이전의 상태에 따라서 다른 결과가 나오는 것.  
- 만약에 stateless 상태로 관리하고, 세션의 상태만 필요하다면 query string으로 값을 넘겨주는것도 방법이다.  
- (세션 수준의 상태의 라이프 싸이클은 query-string으로 대체 가능한듯 )  
- 1,2번 방법 모두 정적 렌더링은 포기해야한다. ( 필요하다면 export const dynamic = 'force-static' (권장) )    


