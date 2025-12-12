---
sidebar_position: 3
---

# 함수형 코딩 #3

- [함수형 코딩 #3](#함수형-코딩-3)
  - [챕터 9, 일급 함수 1](#챕터-9-일급-함수-1)

## 챕터 9, 일급 함수 1  

함수에서 나는 코드 스멜  
- 함수의 이름에서 나타나는 암묵적 인자 : 
  - setTextByName, setPriceByName, setShippingByName 등 함수의 이름에는 없지만 함수명 자체에서 인자를 받는 경우가 있다. 이를 함수의 이름에서 나타나는 암묵적 인자이다.  


일급 값  
- 일급 값이 아닌것은 연산자, try-catch, for loop 등이 있다.  
- C++에서는 연산자 자체에 대한 오버로딩이 있어 다루기 더 자유롭다.  
- 일급 값이 되기 위해서는 1, 변수 할당 가능 2, 함수의 인자나 리턴값으로 사용 가능 해야 한다.  
- Javascript에서 더하기 + 연산자는 일급 값이 아니다.  
- 일급 함수 : 함수를 일급 값처럼 쓸 수 있는 경우, 즉 함수를 변수에 담고, 함수로 전달하고 리턴받으면 일급 함수이다.  

동적 타입, 정적 타입  
- 런타임에 타입이 결정되는 언어는 동적 타입언어이고, 컴파일 타임에 타입이 결정되면 정적 타입언어이다.    
- Javascript => 동적 / Typescript, Java, C++ => 정적  

어떤 값이든 일급함수로 만들 수 있다.  
- `function plus(a,b){ return a+b; }` 의 경우 별 기능이 없는것 처럼 보이지만 일급값이 아닌 연산자를 일급 함수로 만든 것 이다.   
- 고차 함수 : 인자로 함수를 받거나, 함수를 리턴하는 함수이다.  
- 콜백, 핸들러 : 함수의 인자로 들어가는 함수를 지칭한다. `function myfunc(cb)` 에서 cb  

고차함수 리팩터링 : 같은 동작 부분을 고차함수로 추상화 하여 중복을 제거한다. 
- 1, forEach
- 2, withLogger 

```js
// forEach 고차함수의 구현 
function forEach(arr, cb){
  for(let i = 0; i < arr.length; i++){
    cb(arr[i]);
  }
}
forEach(foods, function(food){ cook(food); serving(food);  } )

// withLogger의 구현
function withLogger(f){
  try{
    await f();
  }catch(e){
    logger.error(e);
  }
}
withLogger(async ()=>saveUser(user))
```
