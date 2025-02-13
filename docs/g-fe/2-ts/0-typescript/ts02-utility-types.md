---
sidebar_position: 2
---

# TS 2 Utility Types

- [TS 2 Utility Types](#ts-2-utility-types)
  - [Intersection (`&`), Union(`|`), Tagged Union](#intersection--union-tagged-union)
      - [인터섹션 타입 예시](#인터섹션-타입-예시)
      - [유니언 타입 (`|`) 예시](#유니언-타입--예시)
      - [Tagged Union 유니언 타입 (`|`) 예시](#tagged-union-유니언-타입--예시)
  - [인덱스 시그니처](#인덱스-시그니처)
  - [Enum Type](#enum-type)
    - [as const with typeof](#as-const-with-typeof)


## Intersection (`&`), Union(`|`), Tagged Union

**인터섹션 타입** =  교집합(`&`)  
- 교집합이라는 단어가 일반적으로 "공통 요소만 포함"한다고 오해될 수 있다.    
- 타입을 더 좁혀서 요구하는 필드의 복잡성이 올라간다라고 이해.  


#### 인터섹션 타입 예시

```typescript
interface Person {
  name: string;
  age: number;
}

interface Employee {
  employeeId: number;
  department: string;
}

type EmployeePerson = Person & Employee;

const emp: EmployeePerson = {
  name: "Alice",
  age: 30,
  employeeId: 1234,
  department: "Engineering",
};
// emp 객체의 경우에는 Person & Employee 의 속성을 모두 요구한다.  
- 이것도 요구, 저것도 요구   
```

**유니언 타입** = 합집합(`|`)   
- 객체의 유니언 타입에서는, 적어도 하나의 타입만 만족하면 된다.  
- 하지만 Tagged Union 개념을 사용하면

#### 유니언 타입 (`|`) 예시

```js
interface Human { 
  age:number
}

interface Employee {
  level:number
}

type Ntype1 = Human & Employee // intersection
type Ntype2 = Human | Employee // union  

// 가능, 적어도 1개 인터페이스를 만족만 하면 된다.  
const h2:Ntype2 = {
  age:50
}
const h3:Ntype2 = {
  level:2
}
const h4:Ntype2 = {
  age:50,
  level:10
}
```

#### Tagged Union 유니언 타입 (`|`) 예시
 
```typescript
// 유니언 타입은 두 개 이상의 타입 중 하나일 수 있는 새로운 타입을 생성합니다. 즉, 유니언 타입은 구성된 타입 중 하나를 만족하면 됩니다.
interface Bird {
  type: "bird";
  fly(): void;
}

interface Fish {
  type: "fish";
  swim(): void;
}

type Animal = Bird | Fish;

const parrot: Animal = {
  type: "bird",
  fly: () => console.log("Flying"),
};

const salmon: Animal = {
  type: "fish",
  swim: () => console.log("Swimming"),
};
```

위 예시에서 `Animal` 타입은 `Bird` 또는 `Fish` 중 하나일 수 있습니다. 따라서 `parrot` 객체는 `Bird` 타입을, `salmon` 객체는 `Fish` 타입을 따릅니다.


## 인덱스 시그니처

인덱스 시그니처 : 동적 속성을 허용하는 방법  
- 인터페이스가 특정 필드 외에도 추가적인 임의의 필드를 가질 수 있다.

```ts
interface Person {
  name: string;
  age: number;
  [key: string]: any; // 인덱스 시그니처를 사용하여 추가적인 임의의 필드를 허용
}

interface Employee {
  employeeId: number;
  department: string;
}

type EmployeePerson = Person & Employee;

const emp: EmployeePerson = {
  name: "Alice",
  age: 30,
  employeeId: 1234,
  department: "Engineering",
  additionalInfo: "Some additional information",

};

const te: Person = {
  age: 12,
  name: "123",
  additionalInfo: "Some additional information",
};

```




## Enum Type

### as const with typeof

```js
const myUnionValues = ['opt1','opt2','opt3'] as const // as const를 안쓰면 string 타입으로 추론된다. 런타임때 값이 바뀔꺼야 라고 추론  
type MyUnionValuesToUnionType = (typeof myUnionValues)[number] // 
// typeof myUnionValues 는 ['opt1','opt2','opt3'] 이다. 변수의 타입 그 자체를 가져오는 것 
//  ㄴas const를 안썼다면 string[] 
// [number] 는 해당 타입에 모든 인덱스를 이터레이션 하면서 타입을 유니온으로 모은다. > 'opt1' | 'opt2' | 'opt3'
//  ㄴas const를 안썼다면 string 이다. 
```