---
sidebar_position: 0
---

# ADD 1, Intro  

ADD : AI Driven Development
- AI을 활용한 A-Z 비즈니스 개발 방법론을 연구 및 PoC  

## Benchmarks    

📌 Software 3.0 시대, Harness를 통한 조직 생산성 저점 높이기  
> https://toss.tech/article/harness-for-team-productivity  

문제 : 같은 LLM을 써도 팀 내 결과물 편차가 큼, LLM Literacy(컨텍스트 설계 능력) 격차  
  - 목표: 팀 생산성의 저점(Raising the Floor) 상승  
  - LLM 활용을 개인 역량이 아닌 조직 차원의 하네스(Harness) 로 설계

솔루션 : 조직 차원의 워크플로우 배포 플랫폼 
  - 조직이 일하는 방식을 워크플로우로 정의하고 이를 한곳에서 배포&관리한다.  
  - 시나리오 예) /new-feature 입력 : 티켓 발급 -> 브랜치 생성 -> 구현 계획 작성
  - Executable SSOT : 문서는 사람이 읽으면 매뉴얼, LLM이 읽으면 실행 가능한 코드형 지식
  - Layered Architecture : 글로벌 수준, 팀 수준, 로컬 수준 등 레이어마다 다른 워크플로우 
  - Data Flywheel 가설 : 플러그인 기반 워크플로우 → 정형화된 데이터 축적 → 도메인 특화 모델 파인튜닝

## 언제 AI의 효용이 높을까? 고민되는 지점들  

AI가 딸깍 수준으로 잘 했던것들 테스크    
- [ ] 오픈클로, 브라우저 자동화, 대출상담사 진위 여부 판단 해줘. 

AI가 못해서 HITL가 자꾸 발생한 테스크   
- [ ]  [superpowers](https://github.com/obra/superpowers)  
- [ ]  


## 개발 단계에서 지시해야하는 지침  

1, plan/todo > plan/done 등 워크플로우 설계하기  

2, 필수 지침 
- 디렉터리 설계 및 컴포넌트 다이어 그램  

매출이 발생 할 제품을 설계하는 방법론들을 고민해보자  
- 1, 밴치마킹 기법 : 다른곳에서 괜찮은 기능을 리버스-엔지니어링으로 접근하여 개발.  
- 2, 스펙주도 개발 : 디자인과 PRD가 원하는 요구사항을 최대한 만족시키는 방식으로 구현.  
- 3, API Spec Driven 개발 : Fields가 명확한 경우 AI한테는 그에 대응되는 명확한 ui를 그릴 수 있다.  
- 4, 자유 : 완전히 AI에게 자율적으로 맡기는 경우.  

3, Plan 및 서브에이전트 활용  

Plan을 세우는 프롬프팅과 Execute을 진행하는 프롬프팅 2가지를 진행하자.  
- 여러 프로젝트를 진행하는것은 무리다.  


아래 작업들을 명시한것은 직렬
- plan/todo/1.task-name
- plan/todo/2.task-name
- plan/todo/3.task-name
  
아래 작업들을 명시한것은 병렬 가능 
- plan/todo/3-1.task-name
- plan/todo/3-2.task-name
- plan/todo/3-3.task-name


4, 스킬 활용  

codex는 .codex/skills 디렉터리 하위에서 관리한다.    
- https://github.com/vercel-labs/agent-skills 을 참고해서 쉽게 스킬을 추가할 수 있다.  
  - https://vercel.com/blog/introducing-react-best-practices


5, superpowers 활용  
- 여러가지 스킬을 우선 넣었다. 직접 사용해보고 보려고 한다.  
- 작업에 대한 스킬이 어떠한 결과를 줄지 미지수  

6, 규칙  
- tailwind css를 반드시 사용하라는 규칙 적용이 없었다. 혹 안되었다.?


7, 레이어를 쌓아야 하는 작업은 선행해야 한다.  
- 예를들어 레이아웃 컴포넌트 같은것.  

잘 안되는 것들  
- 모바일 대응 : 사진에서 모바일 대응이 깨지는 경우가 있어. 수정해. 그리고 이를 진작에 막기 위해서는 어떻게 지시를 내렸어야 했지?  


plan들을 쭉 작성하고 각 기능마다 PR을 만들어 준다면? - 근데 병렬 task들은 가능한데 앞뒤 의존성이 있는경우는 어렵다.     

여전히 HITP는 필요하다. 
- 인사이트 클릭했을때 drawer가 화면이 넘친다. 내부 스크롤링이 필요해보여

확인해봐야 하는 것 
- 특정 작업(예, css관련 작업)을 진행할때는 해당 스킬을 호출하는지 검토.  

