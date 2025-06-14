---
sidebar_position: 1
---

# FE 개발단계 체크 리스트  

- [FE 개발단계 체크 리스트](#fe-개발단계-체크-리스트)
  - [1.Requirements](#1requirements)
  - [2.Develop](#2develop)
  - [2.0 Prepare](#20-prepare)
  - [2.1 API Spec](#21-api-spec)
  - [2.2 Markup/CSS](#22-markupcss)
  - [2.3 React](#23-react)
  - [2.4 Testing](#24-testing)
    - [📌 Sanity test](#-sanity-test)
    - [📌 Unit Test Code](#-unit-test-code)
  - [3 Self QA](#3-self-qa)
  - [Monitoring \& Metric](#monitoring--metric)
  - [회고](#회고)


1.Requirements Level
2.Develop Level 
3.QA Level
4.Monitoring & Metric Level  

## 1.Requirements  


- [ ] 📌 다른 사람들의 짠 코드의 로직을 잘 이해 해야함(익숙도를 체크.)  
    - 아무리 잘 짠 코드라도, 간단한 코드라도 남이 짠 코드를 바탕으로 무언가를 만들려고 하면 복잡하다. 그래서 다른 사람들의 코드를 마치 내가 짠 코드 처럼 익숙해지는 단계가 필요하다.  

7.1 API Level은 반드시 파악할 것  
>API 정리는 블랙박스 같은 컴포넌트를 파악하는 첫 단추이다. 리모컨의 회로를 들여다 보기전에 어떠한 버튼이 있는지 파악하는것이다.  
>*일정이 촉박하다고 반드시 이 단계를 넘어가지 마세요.! 일정의 일부입니다.* 
- *사용중인 API 목록을 만드는게 좋다.  
- *API의 응답값들을 정리하는것이 좋다.  
- *API응답 필드에 대한 정의 및 이해가 필요하다.  
- *API응답에 대한 UseCase들을 파악하는것이 필요하다.  

7.2 FE에서 익숙해져야 하는 것  
>개발을 들어가기 전에 어떻게 개발할것인지 디스크립션(플랜)을 적어보는것이 굉장히 큰 도움이 된다.    
- *주로 사용하는 UI Component들을 목록화 하자.  
- *건드리는 지면에 대한 AS Logic FLow을 파악하자.  
- *Validator에   


## 2.Develop 

- [ ] UI Broken Test & Responsive 
  - *i18n영역은 영어로 바뀌면 깨질 수 있다. 숫자 영역은 최대값을 넣으면 깨질 수 있다. 반드시 UI가 어떻게 반응할지 테스트 한다.  
  - 예) min-width ~ context-fit ~ max-width 의 범위를 넘어가면, wrap으로 개행 처리.   
    - 최후의 수단으로 언어별, 숫자별 UI의 마크업을 달리한다. 혹은 font-size 등의 CSS를 달리한다.   

## 2.0 Prepare  

- [ ] i18n이 400개 행이 된다면? xlsx to JSON 반드시 도구를 이용해라.  
  - *400개 한/영 옮기면 800번이나 왔다갔다 해야 한다. 실수안할 자신이 있는가?  

## 2.1 API Spec  

📌 API Interface는 미리 공유 및 제안을 하자.  
- FE에서 개발하는데 필요한 Interface를 미리 받아야 함. 안그러면 추가 개발 필요할 수 있다.    
- 변수명이 모호한 경우 반드시 그 정의를 물어봐야 한다.  
- eg) const GMV = 0.9  
- ㄴ단위가 Percentage 인가?, TimeWindow가 7일일가? 1일인가?, Null가능?  

## 2.2 Markup/CSS  

해상도 대응, 가변 변수 확인하기  
- [ ] 화면 해상도에 따라 컴포넌트가 줄어들면 어떻게 되는가? > 개행, 줄임표.  
- [ ] 한/중/영 바꾸면 어떻게 되는가? > 개행, 줄임표.  
- [ ] 값이 10억까지 가능한데 늘어나면 어떻게 되는가? > 개행, 줄임표.   

## 2.3 React  


📌 컴포넌트 하위 호환성 고려하기  
- UI컴포넌트는 많은 곳에서 참조된다. 하위호환성을 지키면서 개발을 해야 한다.  

📌 의존성 배열 잘 확인하기  
- 의존성 배열을 잘 관리안하면 업데이트가 동작안할 수 있다.  

(사용성) 사용자의 중복 제출을 막아라  
- >요청에 대한 submitting | success | fail 처리를 잘 하고 있는가?  

(사용성) 필요없는 사용자의 요청은 취소해라    
- >요청에 abort 처리를 잘 하고 있는가?  

📌 리렌더링  
- [ ] useMemo, useCallback으로 리렌더링을 막았는가? 의존성 배열에 놓친것이 있는가?  
- [ ] memo를 적절히 사용해서 재생성을 막았는가?  

 
```
userDict = { [id:number]:User } 으로 상태 선언함.
getUserById 으로 사용자 정보를 얻어오는 경우 아래 케이스 적절?
// 👃
const targetUser = useCallback(()=> getUserById(targetId),[targetId]);

// 👀
// 위 경우에는 targetId가 변경되지 않는경우 최신의 유저 정보를 받아올 수 없다.

// ✅
const targetUser = useCallback(()=> getUserById(targetId),[targetId, userDict]);
// userDict이 변한경우에도 targetUser를 갱신해야 한다.  

```

📌 전역, 지역, 서버 상태관리 
- [ ] (공통) 리렌더링이 되는 컴포넌트라면 초기화, CleanUp 싸이클이 언제 필요한가?    
- [ ] (공통) 재생성 되는 컴포넌트라면 초기화, CleanUp 싸이클이 언제 필요한가?  
- [ ] 재생성 로직만으로 싸이클을 다룰 수 있는가?  

## 2.4 Testing  

### 📌 Sanity test   

- Sanity test : 개발자가 스스로 새로운 기능에 대해서 테스트 하는 것  

1.요구사항에 맞추어 테스트 케이스를 먼저 작성한다.    
- PRD를 꼼꼼하게 읽고, Figma UI Flow을 꼼꼼히 체크한다. 
- ㄴ이상한 로직, 미구현 플로우, 예외사항들이 많이 발견될 예정.   

2.개발을 진행한다.  
- 개발 일정 산출이 중요하다. 코드 퀄리티가 급격하게 떨어진다. 심지어는 미구현 사항도 발생할 수 있다.  

3.코드에 영향받는 범위를 꼼꼼히 체크한다.  
- 컴포넌트 하위 호환성을 지키면서 개발하였는가?  
- 그렇지 않다라면, 모든 의존성 컴포넌트 및 비즈니스 로직을 체크해야 한다.  
- ㄴ*코드 한줄 바꾸고, 영향받는 여러 범위를 잘 캐치하는게 중요!  

4.반드시 최종 Stage에서 확인해라  
- MFE의 환경에서 스타일이 깨지는 경우도 있음.  


### 📌 Unit Test Code  

특히나 그래프, 수치에 대한 함수는 테스트 코드를 반드시 작성한다.  
- 계산식, 선형보간법, 특정 공식 구현, 메인 비즈니스 로직  

## 3 Self QA  

Table
- [ ] 문구, 툴팁, 순서, 변역 꼼꼼히 시간가지고 의미 느끼며 체크하기.  

## Monitoring & Metric  


--- 

## 회고  

Action Item    

1.모든 상태의 합집합은 전체 집합인지 체크하자.  
- 1.그래프에 데이터가 없는 케이스 고려 = 상승 | 하락 | 동일 | **없음**   
- 2.상품 목록 API 처리 = 로딩중 | **상품없음** | 상품 리스트 | 오류  

2.시스템 예외사항은 - window.Alert 대신에 별도의 Modal UI 요청하자.    

3.State가 복잡한 경우에는, 다양한 케이스를 고려해야 한다.  
- 메인Filter, 서브 Filter, Sorter, Pagination, Selection 등 다양한 인터렉션이 존재한다. 각각의 로직에 잘 대응하는것이 필요.  
- PageSize가 10일때는 50Page가 있지만, PageSize가 50일때는 50번째 페이지는 없다. 적절하게 마지막 페이지로 이동해야 함.  
- 메인 필터에 따라서, 서브 필터에 상품군의 갯수가 달라진다. 모수가 바뀌는것 대응    

4.CSS 조금이라도 이상한가 꼼꼼해 봐야 한다.  
- Padding/줄간격 / i18n 텍스트 깨짐 / CommaInsert  
- ⬆️ 이모지는 쓰면안된다.  

