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

프리티어가 못하는 것을 더 공략하자.  

## 1. 좋은 구조를 만드는 원칙
- 인지 심리학 기반(사람 기반)으로 원칙을 만드는 것은 좋은 것 같다.

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
  - *로직에 따라서 분리하는 것이 좋다 => '[연속성의 원칙 (Continuation)]' 때문에  

#### [연속성의 원칙 (Continuation)]  

디버깅을 하는 과정(코드의 흐름을 읽는 관점)에서 유사한 로직의 바로바로 연결되는 것이 인지 부담이 적다.  
- 로직에 따라 컴포넌트, 훅을 분리 하자.  

### 1.1 SLAP(Single Level of Abstraction Principle)

목적 : 함수가 하나의 의도를 한 눈에 설명하게 만들고, 세부 구현이 업무 흐름을 가리지 않게 한다.

> 하나의 함수 안에서는 동일한 추상화 수준의 작업만 다룬다.

상세 로직

1. 판단 기준 및 적용 조건
  - 함수명 아래의 문장들이 모두 “무엇을 한다”를 설명하는지 확인한다. 업무 단계와 배열 순회, JSON 변환, HTTP 헤더 조립 같은 “어떻게 한다”가 한 함수에 섞이면 위반 신호다.
  - 자세한 구현을 읽지 않고도 상위 함수만으로 사용자 흐름이나 업무 절차를 읽을 수 있어야 한다.
  - 함수 길이가 짧다고 SLAP을 지킨 것은 아니다. 짧은 함수에서도 상태 갱신과 DOM 조작, 업무 규칙과 DB 쿼리를 섞으면 추상화 수준이 다르다.
  - 추출한 하위 함수의 이름은 세부 구현을 숨기는 문장이어야 한다. `processData`, `handleLogic` 같은 모호한 이름은 추상화를 만들지 못한다.

2. 실행 절차 및 구현 규칙
  - 먼저 함수의 목적을 한 문장으로 적고, 그 문장을 구성하는 동일한 수준의 단계만 상위 함수에 남긴다.
  - 특정 단계 안의 구현 상세는 의도가 드러나는 함수로 추출한다. 필요하면 하위 함수도 다시 같은 원칙으로 나눈다.
  - 상위 함수은 정책과 순서를, 하위 함수는 계산·변환·I/O 같은 구현을 담는 방식이 읽기 쉽다.
  - 분리 후에는 기존 행동을 유지하는지 테스트하고, 단순히 한 번만 쓰는 한 줄을 숨기는 무의미한 함수는 만들지 않는다.

React 예제: 이벤트 핸들러에서 사용자 흐름과 저수준 구현이 섞인 경우

```tsx
// SLAP 위반: 검증, 포맷 변환, HTTP 요청, UI 상태 갱신이 섞여 있다.
async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (!email.includes("@")) {
    setError("Email을 확인해 주세요.");
    return;
  }

  const response = await fetch("/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  });

  if (!response.ok) {
    setError("구독 신청에 실패했습니다.");
    return;
  }

  setSubscribed(true);
}
```

```tsx
// 개선: 핸들러는 제출 흐름만 설명한다.
async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const result = await subscribeToNewsletter(email);
  applySubscriptionResult(result);
}

async function subscribeToNewsletter(email: string) {
  const normalizedEmail = normalizeEmail(email);
  validateEmail(normalizedEmail);
  return requestNewsletterSubscription(normalizedEmail);
}
```

Next.js 예제: Route Handler에서 요청 처리 절차와 데이터 접근 구현이 섞인 경우

```ts
// app/api/orders/route.ts
export async function POST(request: Request) {
  const input = await request.json();
  const order = parseOrderInput(input);

  validateOrder(order);
  const pricedOrder = calculateOrderPrice(order);
  const savedOrder = await saveOrder(pricedOrder);

  return Response.json(toOrderResponse(savedOrder), { status: 201 });
}
```

Route Handler는 “주문 요청을 처리한다”는 순서를 보여 준다. SQL, `JSON.stringify`, 할인 루프 같은 세부 구현은 `saveOrder`, `toOrderResponse`, `calculateOrderPrice`의 내부로 내려간다.

NestJS 예제: Service 메서드를 업무 흐름의 오케스트레이션으로 유지하는 경우

```ts
@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly notifications: NotificationsService,
  ) {}

  async placeOrder(command: PlaceOrderCommand) {
    const order = Order.create(command);
    order.calculatePrice();

    const savedOrder = await this.ordersRepository.save(order);
    await this.notifications.sendOrderPlaced(savedOrder);

    return savedOrder;
  }
}
```

`placeOrder` 내부에 ORM의 `createQueryBuilder`, email 템플릿 HTML, 금액 포맷 변환을 직접 넣으면 업무 절차와 기술 구현이 섞인다. Repository, Domain 객체, Notification Service의 인터페이스로 세부 사항을 숨기면 Service는 주문 생성 절차를 읽히게 표현한다.

SLAP는 SRP(Single Responsibility Principle)와 관련되지만 판단 초점이 다르다. SRP는 함수나 모듈이 하나의 책임과 변경 이유을 갖는지 묻고, SLAP는 함수 내부의 각 문장이 같은 높이에서 의도를 설명하는지 묻는다. 두 원칙을 함께 적용하면 함수의 책임과 읽기 흐름을 동시에 명확하게 만들 수 있다.

## 2. 좋은 이름 짓기


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

## 3. 리팩토링

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
