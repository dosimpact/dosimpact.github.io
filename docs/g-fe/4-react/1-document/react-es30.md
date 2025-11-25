---
sidebar_position: 30
---

# React Advanced Typescript    

## 📌 useState 초기 상태 타이핑

```js
export type Book = {
  id: number;
  title: string;
  author?: string;
};

function App() {
  // 1번, Book 상태를 가지며, 초기값 리터럴 선언  
  const [book, setBook] = useState<Book>({
    id: 0,
    title: "",
    author: "",
  });
  // 2번, undefined상태를 허용한다.  
  const [book, setBook] = useState<Book | undefined>();

  useEffect(() => {
    fetchRandomBook().then(setBook);
  }, []);

  if (!book) return <Loader />;

  return (
    <main className="w-full max-w-2xl py-16 mx-auto">
      {/* <Book title={book.title} author={book.author} /> */}
    </main>
  );
}
```

- undefined 상태를 허용한다. 그리고 그 상태에 맞는 컴포넌트를 랜더링 한다.  
- ""와 같은 비어있는 상태의 UI는 의미가 없다. 차라리 애러 화면을 보여주는게 맞다.  

## 📌 useRef 타이핑  

```js
  const inputRef = useRef<HTMLInputElement>(null); // RefObject는 주로 DOM 요소 참조용이며, 직접 값을 수정할 수 없도록 타이핑
  const timerRef = useRef<number>(0); // 자유롭게 값을 수정할 수 있는 객체
```

RefObject는 주로 DOM 요소 참조용이며, 직접 값을 수정할 수 없도록 타이핑  
- null로 초기화 + 적절한 HTMLElement로 타이핑 하기   
- inputRef.current?.focus() 으로 일시적인 Null상태를 고려한다.    

MutableObject는 언제든 값이 변할 수 있다.   
- 적절한 초기값을 설정해주자.   


## 📌 배열 리턴 타이핑   

```js
export const useUrl = (defaultUrl: string) => {
  const [url, setUrl] = useState(defaultUrl);

  // return [url, setUrl]; // (string | React.Dispatch<React.SetStateAction<string>>)[]
  return [url, setUrl] as const; // readonly [string, React.Dispatch<React.SetStateAction<string>>]
};
```  
그냥 배열을 리턴하면 유니온 타입으로 타입추론이 된다.    
- as const라고 선언하면 고정된 리터럴 타입으로 추론된다.  

```js
const colors = ['red', 'blue', 'green'];
// colors의 타입은 string[]로 추론됩니다.
const colors = ['red', 'blue', 'green'] as const;
// colors의 타입은 ['red', 'blue', 'green']으로 추론됩니다.
---
const directions = {
  up: 'UP',
  down: 'DOWN',
  left: 'LEFT',
  right: 'RIGHT',
} as const;
// as const 사용: 객체와 그 속성들이 읽기 전용이며, 값이 리터럴 타입으로 고정됩니다. 타입이 더 엄격해지고, 의도치 않은 값 변경을 방지할 수 있어요.
const directions = {
  up: 'UP',
  down: 'DOWN',
  left: 'LEFT',
  right: 'RIGHT',
};
// as const 미사용: 객체 속성 값은 단순한 문자열로 추론되며, 변경 가능하고 타입이 더 유연하지만 타입 안전성이 떨어질 수 있어요.

```

## 📌 복잡한 상태 타이핑 - 유니온 객체 

```js
// 1.
type State = { 
      status: "error"| "fetching" | "fetched";
      error?: Error;
}; 
// 2.
type State =
  | {
      status: "fetching" | "fetched";
    }
  | {
      status: "error";
      error: Error;
    }; 
---

    fetch(src)
      .then((data) => {
        if (aborted) return;
        setState({ status: "fetched" });
      })
      .catch((error) => {
        if (aborted) return;
        setState({ status: "error", error }); // 애러 상태와 같은 경우를 타이핑 할 수 있다.  
      });

```


## 📌 튜플 정의하기 - 유니온 튜플 

```js
// 1. 0번째는 3가지 중 1개가 올 수있다. 1번째 요소도 마찬가지
// 하지만 첫번째 요소가 error 라면, Error객체만 2번째 요소가 오면 좋겠다. -> 유니  
export type Data<T> = ["fetching" | "success" | "error", T | Error | undefined];

// 2. error인 경우 2번째 요소가 애러로 타이핑이 된다.  
export type Data<T> =
  | ["fetching", undefined?]
  | ["success", T]
  | ["error", Error];

---
import { useState, useEffect } from "react";

export type Data<T> =
  | ["fetching", undefined?]
  | ["success", T]
  | ["error", Error];

export const useUser = <T,>(url: string): Data<T> => {
  const [data, setData] = useState<Data<T>>(["fetching", undefined]);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setData(["success", data]))
      .catch((error) => setData(["error", error]));
  }, [url]);

  return data;
};

```

- 튜플을 정의할때도 첫번째 요소에 따라서, 두번째 요소가 다르게 타이핑 될 수 있다.  

## 📌 Reducer 

```js
type InitialState = {
  items: number;
  inputItems: string | number;
};
const initialState: InitialState = {
  items: 0,
  inputItems: 0,
};

type Action = {
  type: "increase" | "decrease" | "reset" | "updateItemsFromInput";
};

type ActionWithPayload = {
  type: "updateInputItems";
  payload: number;
};

// 1. action:any 로 타이핑
// 2. action: Action | ActionWithPayload 로 타이핑
const cartReducer = (state = initialState, action: Action | ActionWithPayload) => {
  const { items, inputItems } = state;

  switch (action.type) {
    case "increase":
      const newItemsInc = items + 1;
      return { items: newItemsInc, inputItems: newItemsInc };
    case "decrease":
      const newItemsDec = items - 1;
      return { items: newItemsDec, inputItems: newItemsDec };
    case "reset":
      return { items: 0, inputItems: 0 };
    case "updateInputItems":
      return { items, inputItems: action.payload };
    case "updateItemsFromInput":
      return { items: Number(inputItems), inputItems };
    default:
      return state;
  }
};

const ShoppingCard = () => {
  const [{ items, inputItems }, dispatch] = useReducer(
    cartReducer,
    initialState
  );


  return (
          <input
            type="number"
            value={inputItems}
            onChange={(e) =>
              dispatch({
                type: "updateInputItems",
                payload: e.target.valueAsNumber,
              })
            }
            className="counter-input"
          />)
}
```

- dispatch의 type에 따라서 어떠한 payload를 넣어야 하는지 명확하다.  


## 📌 Template Literal Types  

```js
type HexColor = `#${string}`;
type RGBString = `rgb(${number},${number},${number})`;

type ColorFormats = "rgb" | "hex";
type ActionTypes = `updated-${ColorFormats}`;

const isHexColor = (str: string): str is HexColor => {
  return str.startsWith("#");
};

// '"12"' 형식은 '`#${string}`' 형식에 할당할 수 없습니다.ts(2322)
const hex1: HexColor = "12";

```

## 

```js
type ColorContextState = {
  hexColor: string;
  dispatch: Dispatch<ColorActions>;
};

// 1.dispatch 초기값 없음
// export const ColorContext = createContext<ColorContextState>({
//   hexColor: "#FDGTA34",
// });

// 2.타입케스팅으로 초기값 오류 해결, 
export const ColorContext = createContext<ColorContextState>({
  hexColor: "#FDGTA34",
} as ColorContextState);

export const ColorProvider = ({ children }: PropsWithChildren) => {
  const [{ hexColor }, dispatch] = useReducer(colorReducer, initState);
  return (
    <ColorContext.Provider value={{ hexColor, dispatch }}>
      {children}
    </ColorContext.Provider>
  );
};

```

## 

### 📕 제네릭(Generics)에서  T, K 컨벤션  

K와 T는 제네릭(Generics)에서 자주 사용되는 타입 매개변수  

```js
// T (Type): T는 일반적으로 Type을 나타내는 변수, 임의의 타입을 받아들이기 위한 매개변수
function identity<T>(arg: T): T {
  return arg;
}

// K (Key): K는 Key를 나타내는 변수, 주로 객체의 키 값을 타입으로 받을 때 사용  
// -  keyof T는 객체 T의 키들의 유니온 타입을 반환.  
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

```


```js
type Obj = {
    a:"A",
    b:"B",
    c: number;
    d: number;
}
// Obj의 value type을 유니온으로 모은다.  
type res = Obj[keyof Obj] // type res = number | "A" | "B"

type set1 = "a" | "b" | "c"
type set2 = "b" | "c" | "d"

// set1, set2 합집합  
type UnionType = set1 | set2 // type UnionType = "a" | "b" | "c" | "d"
// set1, set2 교집합
type IntersectionType = set1 & set2 // type IntersectionType = "b" | "c"

// ---cut---

// extends : 해당 제네릭이 특정 타입을 상속하거나 특정 조건을 만족해야만 사용할 수 있게 제약을 설정할 수 있다.  
type CanAcceptProp<T,K> = K extends keyof T ? true : false;

type ButtonProps = {
    size:"small" | "medium" | "large";
    color: "red" | "blue" | "green";
}

type CanButtonAcceptColor = CanAcceptProp<ButtonProps, "color">;
type CanButtonAcceptIcon = CanAcceptProp<ButtonProps, "icon">; // ButtonProps에는 없는 프로퍼티  

type Result1 = CanButtonAcceptColor;
type Result2 = CanButtonAcceptIcon;


// ---cut---

type Obj2 = { a:string };
type ObjWithStringKeys = { [key:string]: number}; // value로 number만 허용하는 인덱스 시그니처  

const aaa2:Obj2 = { a: '10' }
const aaa:ObjWithStringKeys = { 'a': 10 }

/// ---cut---

type Obj3 = {
    "a":number;
    "b":number;
    "c":string;
    "d":string;
}
// in : Mapped Types를 정의한다. -> 주어진 유니언 타입의 각 멤버에 대해 순회(iterate) 한다.
// type Obj3Refactor = { [K in 'a' | 'b' ]: number;  [K in 'c'|'d' ]: string; } // 오류, 아래처럼 나누어야 한다.  
type Obj3Refactor = { [K in 'a' | 'b' ]: number} & { [K in 'c'|'d' ]: string; }

type Mask = { [k in keyof Obj3Refactor]: boolean } 

type ConditionalType<T> = { [K in keyof T]: T[K] extends number ? string : T[K] };
type NewExample = ConditionalType<Obj3Refactor>

// type Pick<T, K extends keyof T> = { [P in K]: T[P]; }
type MyPick<T, K extends keyof T> = { [P in K]: T[P]; }
type New2 = MyPick<NewExample,"a"|"b">

// type Exclude<T, U> = T extends U ? never : T
// type Omit<T, K extends keyof any> = { [P in Exclude<keyof T, K>]: T[P]; }
type MyOmit<T, K extends keyof any> = { [P in Exclude<keyof T, K>]: T[P]; }
type New3 = MyOmit<NewExample,"a"|"b">
// 📕 never 타입 = 절대로 발생하지 않는 값 ( 제거 목적, 미반환의 경우 )
// 1.
function logMessage(): void {
  console.log("This function returns nothing."); // void: 값을 반환하지 않지만, 함수가 정상적으로 종료됨을 나타내요.
}

function fail(): never {
  throw new Error("This function never returns."); // never: 함수가 정상적으로 종료되지 않거나, 도달할 수 없는 코드
}
// 2.
type Example = string & number; // 타입을 유니온으로 좁혀나가다가 never가 나오면 모든 범위를 아우르는 것.  

type Animal = "dog" | "cat" | "bird";

function handleAnimal(animal: Animal) {
  if (animal === "dog") {
    console.log("This is a dog.");
  } else if (animal === "cat") {
    console.log("This is a cat.");
  } else if (animal === "bird") {
    console.log("This is a bird.");
  } else {
    // 여기에 도달할 경우 타입 시스템에 빈틈이 있다는 의미
    const unreachable: never = animal;
  }
}

// 2.1 타입체킹 with compile time (사전처리) / build time (사후처리)  
function onlyArray<T>(value: T): T extends any[] ? T : never {
  if (Array.isArray(value)) {
    return value;
  } else {
    throw new Error("This function only accepts arrays."); // (런타임 오류)
  }
}

const arr = onlyArray([1, 2, 3]); // 정상적으로 작동
const notArr = onlyArray(123);    // 타입 오류 발생, never (컴파일 타임)


// type Partial<T> = { [P in keyof T]?: T[P] | undefined; }
type New4 = Partial<NewExample>
```

## 📌 string vs (string & {})

```js
const knownColors = {
  green: "#66bb6a",
  red: "#ef9a9a",
  blue: "#81d4fa",
} as const;

function getColor(color: keyof typeof knownColors | string): string {
  if (color in knownColors)
    return knownColors[color as keyof typeof knownColors];

  return color;
}

// (string & {}) 는 개념상으로 string과 비슷하다. 
// 컴파일러가 type reduction을 공격적으로 수행하지 않는점이 다르다. 그래서 knownColors 타입이 살아 있다.  
function getColor2(color: keyof typeof knownColors | (string & {})): string {
  if (color in knownColors)
    return knownColors[color as keyof typeof knownColors];
  return color;
}

// getColor("") // intellisense no typing
// getColor2("blue"); typing ok - blue, red, green
```

## Object Optional chaining 

```js
// type RecordSample = { [ k: string ]:{name:string}  | undefined }
type RecordSample = Record<string,{name:string} | undefined > 

const eee:RecordSample = { '1': {name:'name1'}, '2':{name:'name2'} }

const e2 = eee?.['123123123'] 

Object.keys(e2)

```