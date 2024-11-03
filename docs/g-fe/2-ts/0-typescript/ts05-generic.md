---
sidebar_position: 2
---

# TS 5 - Generic  


## 기본 개념  

제너릭은 타입 파라미터를 받을 수 있는 기능이다.  
- 목적 : 타입 관점에서 재사용 가능한 함수, 클래스, 인터페이스, 타입을 만들 수 있다.  
- 변수명 관습 : T 는 타입을 의미, K는 객체의 키   
- 제너릭 타입 디폴트값을 지정 가능 (=)  
- 제너릭 타입에 제약을 설정 가능 (extends)  

제너릭 타입이 자주 쓰일법한 곳  
- any 혹은 unknown이 있는곳이라면 제너릭으로 다룰 수 있다.  

```js
// 1.
// 함수 제네릭 
function identity<T>(arg: T): T {
  return arg;
}
const num = identity<number>(5); // T가 number로 설정
const str = identity<string>("Hello"); // T가 string으로 설정

function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}
// person의 타입은 { name: string; age: number }로 추론됩니다.
const person = merge({ name: "Alice" }, { age: 25 });
---

//2.
//제너릭 클래스
class DataStorage<T> {
  private data: T[] = [];

  addItem(item: T) {
    this.data.push(item);
  }

  removeItem(item: T) {
    this.data = this.data.filter(i => i !== item);
  }

  getItems(): T[] {
    return [...this.data];
  }
}

const textStorage = new DataStorage<string>();
textStorage.addItem("Hello");
textStorage.addItem("World");
console.log(textStorage.getItems()); // ["Hello", "World"]

const numberStorage = new DataStorage<number>();
numberStorage.addItem(10);
numberStorage.addItem(20);
console.log(numberStorage.getItems()); // [10, 20]
---
//3.
//제너릭 인터페이스
interface KeyValuePair<K, V> {
  key: K;
  value: V;
}
const kvp1: KeyValuePair<string, number> = { key: "age", value: 25 };
const kvp2: KeyValuePair<number, string> = { key: 1, value: "One" };
---
// 4.
// 제너릭 타입 + 디폴트 제너릭 값
type KeyValuePair<K = string, V = number> = {
  key: K;
  value: V;
};

const defaultPair: KeyValuePair = { key: "age", value: 30 }; // K는 string, V는 number
const customPair: KeyValuePair<boolean, string> = { key: true, value: "yes" };

---
//5.
//제너릭 제약 (Constraints), extends
function getProperty<T extends object, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

const person = { name: "Alice", age: 25 };
console.log(getProperty(person, "name")); // "Alice"
console.log(getProperty(person, "age")); // 25
```  


## Generic Example  


OptionalUndefined  

```js
type OptionalUndefined<T> = Partial<Record<keyof T, undefined>>;
{
    value: string;                  --> value?: undefined;
    onChange: ChangeEventHandler;   --> onChange?: undefined;
}

type TightProps<T> = T | OptionalUndefined<T>;
    {
      value: string;
      onChange: ChangeEventHandler;
    }
  | {
      value?: undefined;
      onChange?: undefined;
    }
```
