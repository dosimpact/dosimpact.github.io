---
sidebar_position: 02
---

# Typescript Props Pattern  


## Background

### satisfies   

- 강제 타입 변환이 필요한 경우는 as를 사용, 타입검사가 필요하면 satisfies 사용  
- 런타임 타입 검사를 추가하는 방법으로 타입 가드 함수(assertion 함수)를 이용하자.   

```js
// satisfies 예시
type User = {
  name: string;
  age: number;
};

const user = {
  name: "Alice",
  age: 25,
  role: "admin", // `User` 타입에는 없는 속성사용 가능  
} as User;

console.log(user.role); // 'role' 속성은 User 타입에 없으나 `as`로 캐스팅해서 오류가 발생하지 않음
---

const user = {
  name: "Alice",
  age: 25,
  // 개체 리터럴은 알려진 속성만 지정할 수 있으며 'User' 형식에 'role'이(가) 없습니다.ts(2353)
  role: "admin", // `User` 타입에는 없는 속성
} satisfies User; // 오류 발생: 'role' 속성은 `User` 타입에 정의되지 않았습니다.

console.log(user.role); 
---
// assertion 함수
function isMyDataType(data: any): data is MyDataType {
  return typeof data.id === 'number' && typeof data.name === 'string';
}
```

### Extracting Types with const 

```js
const BUTTON_TYPES = {
  0: "warning",
  1: "success",
  2: "error",
} as const;

type ButtonTypes = typeof BUTTON_TYPES;

type TypesKeys = keyof ButtonTypes; // keyof typeof BUTTON_TYPES
type TypesValues = ButtonTypes[TypesKeys]; // (typeof BUTTON_TYPES)[TypesKeys];

---
// Make generic type 
type PickKey<T> = keyof T;
type PickValue<T> = T[PickKey<T>];

type ButtonKeyType = PickKey<ButtonTypes>;
type ButtonValueType = PickValue<ButtonTypes>; 
```

## Empty Object and Requiring props  

>value, onChange 속성은 필요하다면, 반드시 한쌍으로 넣어야 할때

- 타입 추론의 순서는 optional 다음 value 

```js
import { ChangeEventHandler } from "react";

type InputProps = (
  | {
      value: string;
      onChange: ChangeEventHandler;
    }
  | {
      value?: undefined;
      onChange?: undefined;
    }
) & {
  label: string;
};

const Input = ({ label, ...props }: InputProps) => {
  return (
    <div>
      <label>
        {label}
        <input {...props} />
      </label>
    </div>
  );
};

export default Input;

---
<Input label="Name" value="Codelicks" onChange={() => {}} />
<Input label="Name" />
// 오류 '{ label: string; value: string; }' 형식은 'InputProps' 형식에 할당할 수 없습니다.
<Input label="Name" value="Codelicks" />
// 오류 '{ label: string; value: string; }' 형식은 'InputProps' 형식에 할당할 수 없습니다.
<Input label="Name" onChange={() => {}} />
```

## Dynamic Props  

>variant props만 설정하면 나머지 속성들은 알아서 들어가도록.  
- button에는 varient = submit | reset | skip 있다.   
- submit props를 넘기면 관련 JSX Props를 넣어주자.

```js
import { ComponentProps } from "react";

const buttonProps = {
  submit: {
    className: "submit-btn",
    type: "submit",
    notAllowedProperty: "anything",
  },
  reset: {
    className: "reset-btn",
    type: "reset",
    notAllowedProperty: "anything",
  },
  skip: {
    className: "skip-btn",
    type: "button",
    notAllowedProperty: "anything",
  },
} satisfies Record<string, ComponentProps<"button">>; // ComponentProps  

type ButtonProps = {
  variant: keyof typeof buttonProps;
};

const Button = (props: ButtonProps) => {
  return <button {...buttonProps[props.variant]}>Click me!</button>;
};

export default Button;
```

