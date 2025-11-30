---
sidebar_position: 1
---

# JS 단상  

- [JS 단상](#js-단상)
  - [JS 스코프, 클로저](#js-스코프-클로저)
  - [호이스팅](#호이스팅)
  - [This Binding](#this-binding)


## JS 스코프, 클로저  

스코프 정의 : 식별자의 유효 범위 ( identifier’s valid range ) 
- 변수, 함수, 클래스와 같은 식별자가 다른 코드에서 자신이 참조될 수 있는지 결정하는 범위

전역 스코프 : 모든 코드에서 참조 가능한 식별자들  
지역 스코프 : 일부 코드에서만 참조 가능한 식별자들  

블록 레벨 스코프, 함수 레벨 스코프  
- 대부분의 언어는 블록 레벨 스코프를 따른다.   
- Javascript에서는 var키워드가 함수 레벨 스코프, let,const는 블록 레벨 스코프 이다.
- var는 함수 레벨에서 호이스팅되어 비직관적이며 변수 충돌가능성이 크다. 그래서 안쓴다.  

동적스코프와 정적(렉시컬)스코프  
- JS, C, Java 등 대부분의 언어는 렉시컬 스코프를 따른다.  
- 정적 스코프 : 코드에서 선언된 위치에 따라서 스코프가 결정된다.  
- 동적 스코프는 디버깅이 어렵다. 모든 함수 호출 경로를 파악해야 스코프를 알 수 있다.  

스코프 체인
- 하위 스코프는 상위 스코프를 참조할 수 있어 상위 지역변수나 전역 변수 참조가 가능.  
- 이렇게 스코프가 계층적으로 연결된 구조를 스코프 체인.  

실행 컨텍스트 
- C언어에서는 함수가 호출되면 콜스택에 스택 프레임이 쌓인다.  
- 함수내 선언된 변수가 무엇인지, 매개변수, 복귀 주소 등 정보가 담겨 있다.  
- 이는 콜 스택에 선입 선출 구조로 쌓이며, 메모리 스택 영역에 할당
- Javascript도 동일한데, 실행 컨텍스트는 스택 프레임이 더 확장된 개념이다.  
- 실행 컨텍스트에는 렉시컬 환경, 변수 환경, this biding 자료구조가 만들어진다.
- 렉시컬 환경에는 현재 컨텍스트의 식별자, 상위 소크프 참조로 구성
- 변수 환경에는 초기값은 렉시컬 환경이랑 동일, 이후 변수 변경을 기록  
- this 식별자가 바라봐야 할 객체 저장  

클로저
- 함수의 일종, 중첩함수 구조에서 생명주기를 마감함 외부 함수의 식별자를 참조하는 내부 함수.
- 하위 컨텍스트에서 상위 스코프의 렉시컬 환경을 참조하고 있는 구조.   
- 클로저에 의해서 참조된 외부 변수가 자유변수라고 한다.  

## 호이스팅

![Alt text](image.png)  

실행 컨텍스트의 구성  
- 집중 : 렉시컬 환경 -> 환경 레코드, 외부 환경 참조 2가지  

호이스팅 : 함수, 변수가 선언 전에도 참조 가능한 현상,  마치 식별자가 상단으로 끌어올려진 현상처럼 보여서 호이스팅.  

환경 레코드 : 식별자 기록, 식별자 바인딩된 값 기록  
- 실행 컨텍스트는 생성 단계 (Creation Phase)을 먼저 실행 (스캐너 처럼)
  - 메모리 공간 확보 및 식별자와 연결  
  - var 식별자들을 환경 레코드에 기록와 동시에 undefiend로 초기화   
  - let, const는 undefiend로 초기화 하지 않는다. 그래서 TDZ가 발생  
  - 함수 선언문은 선언과 동시에 생성되어 TDZ없이 사용이 가능하다.  
- 실행 단계 (Execution Phase)에서 코드의 실행 및 환경 레코드의 변수들을 읽기/쓰기 진행   
- *Temproal Dead Zone : let, const의 경우 선언 이전에 참조할 수 없는 구역을 말한다.  

키워드 : 
- Hoisting, Execution Context(Creation Phase, Execution Phase)  
- Declaration, Initalization  
- Temporal Dead Zone, Function Expression, Function Delcaration   

ES3에서는 동적스코프 ( 변수객체, 스코프 체인, this )로 작동했지만, ES5 이후에는 실행 컨텍스트 도입으로 정적 스코프가 도입되었다.  

## This Binding

javascript에서 this binding은 실행 컨텍스트 Level에서 진행된다  
- 실행 컨텍스트는 함수가 호출될 때 만들어지니, this도 함수 호출단계에서 결정된다.  
- this 바인딩 규칙 4가지  
  - 기본 바인딩
  - 암시적 바인딩
  - 명시적 바인딩   
  - new 바인딩

기본 바인딩, 암시적 바인딩  
- 기본적으로 전역 객체에 바인딩 되며, 엄격모드에서는 전역 객체는 제외된다.  
- node.js 환경에서는 this는 module.exports와 동일하다  
- object.getName 이라는 문법에서 점 연산자는 참조 타입이다.  
  - (base 객체, name 프로퍼티 이름, strict 엄격모드) 라는 연산자로 참조를 리턴해주는 것  
  - object.getName() 으로 바로 호출하면 호출자 base 객체로 바인딩 된다.  
  - `callback = object.getName(); callback()` 은 비록 참조 타입으로 getName함수를 가져왔어도 호출자는 전역 객체가 된다.  
- 참조 타입에 의한 바인딩을 암시적 바인딩이라고 한다.  

명시적 바인딩
- call
- apply
- bind

```js
// 1. this로 사용할 객체 정의
const person1 = {
    name: "철수",
    id: 101
};
const person2 = {
    name: "영희",
    id: 102
};
// 2. this를 사용하는 함수 정의
function sayHello(greeting, language) {
    console.log(`${greeting}! 저는 ${this.name} (${this.id})입니다. 언어: ${language}`);
}

// --- 명시적 바인딩 실행 ---
// 1. call(): 즉시 실행, 인수를 개별적으로 전달 (쉼표 구분)
console.log("--- 1. call() ---");
sayHello.call(person1, "안녕하세요", "Korean");

// 2. apply(): 즉시 실행, 인수를 배열로 전달
console.log("\n--- 2. apply() ---");
sayHello.apply(person2, ["Hello", "English"]);

// 3. bind(): 새로운 함수를 생성하고, 나중에 호출
console.log("\n--- 3. bind() ---");
const boundFunction = sayHello.bind(person1);
// 바인딩된 함수는 여기서 실행
boundFunction("Hi", "Spanish");
```

new 바인딩  
- 함수를 호출 할 때 new 연산자를 사용하면, 새로운 객체를 생성 후 this 바인딩 후 객체를 리턴한다.  


화살표 함수에서 this는 렉시컬 this 바인딩
- 화살표 함수는 자신만의 this 바인딩을 생성하지 않는다.  
- 화살표 함수가 선언된 곳의 스코프를 가르킨다. 렉시컬 this라고 한다. 즉, 화살표 함수를 감싸는 가장 가까운 일반 함수의 this를 참조.  

```js
const user = {
    name:"do";
    gFunc:function(){
        console.log(this.name); // do
        setTimeout(function(){
            console.log(this.name); // undefined 
        },1000)
    }
    aFunc:function(){
        console.log(this.name); // do
        setTimeout(()=>{
            console.log(this.name); // do, 상위 aFunc의 컨텍스트와 렉시컬 this 바인딩 된다.  
        },1000)
    }
}

user.gFunc();   // do -> undefined
user.aFunc();   // do -> do  

```