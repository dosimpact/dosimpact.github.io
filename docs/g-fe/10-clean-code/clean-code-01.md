---
sidebar_position: 100
---

# Clean Code 1  

게슈탈트 법칙으로 이해하는 클린코드: 가독성의 비밀  
>https://velog.io/@teo/cleancode    

클린코드의 특징  
- 가독성 : 좋은 코드는 읽기 쉽고 이해하기 쉽습니다.  
- 유지보수성 : 좋은 코드는 수정사항에 대응하기 쉬우며, 수정에 독립적이고 찾기 쉽습니다.  
- 확장성 : 좋은 코드는 새로운 기능을 추가할 때, 기존 코드를 크게 수정하지 않을 수 있습니다.  
- 견고성 : 좋은 코드는 에러가 발생했을 경우에도 동작하거나 대응하고, 에러를 발견하기 쉽습니다.  
- 테스트 가능성 : 좋은 코드는 테스트를 작성하기 쉬우며, 단위별 테스트를 할 수 있습니다.  
- 자기문서화 : 좋은 코드는 요구사항과 코드가 유사하여 코드를 통해 요구사항을 이해할 수 있게 합니다.  
- 일관성 : 좋은 코드는 같은 규칙과 철학으로 작성되어 예측이 가능합니다.  


좋은 코드를 작성하기 어려운 이유  
- 타인이 보기에 좋아야 하기 때문  
- 지식의 저주 : 나는 어렵지 않다. 하지만 남이 작성한 코드를 보는 것은 고역    

개발 문화  
- 팀 컨벤션 : 동일한 스타일의 코드 작성 -> 예측 가능, 모두가 같은 코드 작성 -> 품질 향상  
- 코드 리뷰 : 코드 스타일 맞추고 서로 배우는 과정  
- 리팩토링 : 기존 코드를 개선 -> 가독성, 유지보수성, 확장성 높이는 목적  
- 테스트 : 테스트 가능한 코드는 명확한 역할이 있다. -> 요구사항을 테스트 케이스로 만들어서 자기 문서화 하는 것    

시작은 코드 가독성이다.  
- 좋은 모양, 좋은 구조, 좋은 이름이 필요하다.    
- 뇌의 부하를 최소화하여 코드를 읽게 만드는 것이다.   
- 프리티어를 사용하여 컨벤션의 역할  

프리티어가 못하는것을 더 공략하자.  

## 📌 좋은 구조를 만드는 원칙  
- 인지 심리학 기반(사람 기반)으로 원칙을 만드는것은 좋은것 같다.   

#### [공통영역의 원칙 (Common Region)]  
- 공통영역 내에 배치된 요소들은 그룹으로 인식된다.

- 1.줄바꿈과 주석  
  - 가독성을 위한 줄바꿈 + 주석 달기  

- 2.코드의 배치
  - 주석을 통해 그룹 만들기  
  - 빈줄을 통해 그룹 구분하기  
  - 함수를 통해서 연관된 내용 담기

#### [유사성의 원칙 (Similarity)]  

유사하게 생긴 요소들은 같은 종류로 보인다.    
- 일관성 있는 함수 이름을 만들어야 한다.  
  - 예) 핸들러 함수를 handlexxx 이라고 모두 지키던가 아니면 onClick 이라고 한가지로 통일.    
- 1.로직에 따라 분리하기  
  - count-related logic + data fetching logic  
- 2.역할에 따라 분리하기   
  - hooks + computed field + handler + effect    
  - *로직에 따라서 분리하는것이 좋다 => '[연속성의 원칙 (Continuation)]' 때문에  

#### [연속성의 원칙 (Continuation)]  

디버깅을 하는 과정(코드의 흐름을 읽는 관점)에서 유사한 로직의 바로바로 연결되는것이 인지 부담이 적다.  
- 로직에 따라 컴포넌트, 훅을 분리 하자.  

## 📌 좋은 이름 짓기  


좋은 이름이란 예측이 가능한 것  
- 1.값과 타입이 예측이 가능해야 한다.  
  - 이름만 보고 string, number, boolean, array, object가 연상되어야 한다.  
- 2.변수의 맥락이 지역에서 글로벌로 갈수록 구체적으로 적어야 한다.  
  - 지역 함수의 변수명 key  --> 전역 변수 OPEN_PUBLIC_AUTH_KEY 라고 명명  
- 3.함수 이름 짓기  
  - 안좋은 예) calculateTotalPrice0fAllItemsInTheShoppingCart(){}  
  - 변경)
    - calculateTotalPrice(cartItemList){}
      - 1 동작을 나타내는 동사 유지: calculate  
      - 2 반환값을 예측 : Total Price ( Total 보다는 Price 더 명확한 듯 )  
      - 3 중복 제거:  OfAllItems는 Total과 의미가 중복  
      - 4 중요한 정보는 유지, 불필요한 부분은 제거: ShoppingCart에서 Cart만으로도 충분히 의미가 전달됩니다. Shopping과 The는 생략 가능합니다.  
      - 5 매개변수(목적어)까지 활용 : cartItemList  
    - 함수명명 규칙 = function 동작+반환값(인자1 = 목적어, 인자2 = 목적 보어?)    

- 4.보편적으로 사용하는 이름 쓰기 (맛집 이론)  
```
create~(), add~(), push~(), insert~()
parse~(), make~(), build~(), split~()
query~(), mutation~(), fetch~(), update~(), delete~()
save~(), put~(), send~(), dispatch~(), receive~()
validate~(), calc~(), serialize~()
init~(), configure~(), start~(), stop~()
generate~(), transform~(), log~()

변수나 속성 이름도 마찬가지입니다:
count~, sum~, num~
is~, has~
~ing, ~ed
min~, max~, total
~name, ~title, ~desc, ~data
item, temp
~at, ~date, ~index
selected~, current~
~s (복수형)
~type, ~code, ~ID, ~text
params, error


유사하지만 미묘한 차이를 지니는 단어들도 있습니다. 가령 'current'는 현재 활성화된 항목을, 'selected'는 사용자에 의해 선택된 항목을 의미합니다.
이러한 미묘한 차이를 이해하고 적절히 사용하면, 코드의 의도를 더 명확히 전달할 수 있으며, 다른 개발자들이 코드를 더 쉽게 이해하고 유지보수할 수 있게 됩니다.
각 이름들은 어떤 차이들이 있을까요?
create(), add(), push(), insert()
fetch(), retrieve(), load(), get()
update(), modify(), edit(), change()
remove(), delete(), clear(), erase()
find(), search(), lookup(), query()
check(), validate(), verify(), test()
convert(), transform(), parse(), format()
render(), display(), show(), present()
toggle(), switch(), flip(), alternate()
mount(), attach(), append(), connect()
unmount(), detach(), remove(), disconnect()
subscribe(), listen(), observe(), watch()
unsubscribe(), unlisten(), ignore(), stopWatching()
dispatch(), emit(), trigger(), fire()
handle(), process(), manage(), deal()
isOpen, isVisible, isActive, isEnabled
onSubmit, onSend, onConfirm, onApply
setState, updateState, setProps, updateProps
useEffect, useCallback, useMemo, useRef
```  

## 리팩토링 

클린코드 -> 코드를 처음부터 명확하고 이해하기 쉽게 작성하는 것  
리팩토링 정의 : 기능을 유지한 채, 코드 구조를 바꾸거나 새로운 패러다임에 맞추는 과정    
- 프로젝트가 커지고 시간이 지날수록 => 기존의 코드를 읽는데 더 많은 시간을 쓰고, 기존의 기능에 영향이 있는지 테스트하는데 많은 시간 사용.  
  - 필요성 : 새로운 요구사항 + 새로운 기술 도입 + 새로운 패러다임 적용  
  - 목적 => 코드 이해 시간 단축 + 코드 수정 영향도 체크 시간 단축  
  - 결과 ==> 더 좋은 클린코드   

원칙  
- 기존의 기능은 반드시 유지하되, 가장 의존성이 적은 부분부터 시작할 것  
- 작은 단위로 점진적으로 진행할 것
  - 리팩토링은 한 번에 전체 코드를 수정하는 것이 아니라, 작은 부분씩 진행하는 것이 좋아요. 이렇게 하면 변경 사항을 이해하기 쉽고, 문제를 추적하거나 되돌리기가 쉬워요.  
- 테스트와 함께 할 것  