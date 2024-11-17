---
sidebar_position: 01
---
# React Typescript   

- [React Typescript](#react-typescript)
  - [React의 컴포넌트 타입들](#react의-컴포넌트-타입들)
    - [ReactNode vs ReactElement](#reactnode-vs-reactelement)
    - [ReactNode vs ()=\> React.ReactNode](#reactnode-vs--reactreactnode)
  - [Extract Unions](#extract-unions)
  - [Discriminated Unions](#discriminated-unions)
  - [Discriminated Unions Branding](#discriminated-unions-branding)
  - [Undefined optional type union](#undefined-optional-type-union)
  - [React Hook with Generic](#react-hook-with-generic)
  - [React Component with Generic](#react-component-with-generic)
  - [리팩토링: 삼항연산자 \> Discriminated Unions](#리팩토링-삼항연산자--discriminated-unions)
  - [Typing HoC](#typing-hoc)
  - [RenderProps Pattern](#renderprops-pattern)
  - [Limiting prop composition](#limiting-prop-composition)
  - [214 Requiring props Composition](#214-requiring-props-composition)
  - [215 Render Props](#215-render-props)
  - [216 Polymorphic Component](#216-polymorphic-component)
  - [221](#221)
  - [225](#225)
  - [226 Empty Object as Type](#226-empty-object-as-type)
  - [Mapped Types](#mapped-types)


## React의 컴포넌트 타입들 

### ReactNode vs ReactElement

ReactNode는 ReactElement를 포함하는 더 큰 개념.    
- 심지어는 null, undefined도 올 수 있다. (이는 리액트 컴포넌트에서 null도 리턴할 수 있음을 의미)
- 반면 ReactElement는 <></> 혹은 <div/> 등의 JSX를 리턴하는 함수입니다. createElement 함수의 리턴값이다.  

```js
    type ReactNode =
        | ReactElement
        | string
        | number
        | Iterable<ReactNode>
        | ReactPortal
        | boolean
        | null
        | undefined
        | DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES[
            keyof DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES
        ];
```


### ReactNode vs ()=> React.ReactNode  

1.React.ReactNode : 컴포넌트 리턴값, 반면 아래 2개는 컴포넌트 자체의 타입   

2.`React.ComponentType<MyComponentProps>` : 클래스 컴포넌트, 함수 컴포넌트 그 자체의 타입  
  - `type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;`
  - FunctionComponent는 React.FC로 축약가능    

3.`()=>React.ReactNode` : props가 없는 함수컴포넌트 타입  

```js
import React from "react";

const MyComponent = () => <div>Hello, World!</div>;

// 예시 1: {Component} 사용
// ReactNode를 인자로 받는다. 슬롯패턴처럼 컴포넌트를 {}으로 넣어야 한다.  
// {children}을 생각하면 쉽다. 컴포넌트 합성에 대한 방식은 이미 인스턴스화된 컴포넌트의 자리만 잡아주는 것.  
const AppWithComponentReference = ({
  Component,
}: {
  Component: React.ReactNode;
}) => (
  <div>
    <h1>Using Component Reference</h1>
    {Component} {/* 단순히 컴포넌트 타입을 삽입 */}
  </div>
);

// 예시 2: <Component /> 사용
// 리액트 컴포넌트를 인자로 받는다. JSX를 리턴해야 한다. ()=>React.ReactNode;
const AppWithComponentInstance = ({
  Component,
}: {
  Component: React.ComponentType; // React.ComponentType; // () => React.ReactNode;
}) => (
  <div>
    <h1>Using Component Instance</h1>
    <Component /> {/* 실제로 컴포넌트를 렌더링 */}
  </div>
);

// 실제 렌더링
export const Test01 = () => {
  return (
    <>
      <div>
        <AppWithComponentReference Component={<MyComponent />} />
        <AppWithComponentInstance Component={MyComponent} />
      </div>
    </>
  );
};

```

## Extract Unions

```js
// readonly
// readonly 는 해당 변수를 읽기 전용으로 만들어줍니다.
// - readonly Array 는 enum 처럼 생각.
// - readonly Object 는 freezed object 처럼 생각.

// Extarct Union Literal
const exampleList1 = ['v1', 'v2', 'v3'];
// type : string[]

const exampleList2 = ['v1', 'v2', 'v3'] as const; // string[]
// type : readonly ['v1', 'v2', 'v3']

type ExampleList2Union = (typeof exampleList2)[number]; // 'v1' | 'v2' | 'v3'

const exampleObj1 = {
  key1: 'v1',
  key2: 'v2'
} as const;

type KeyUnion = keyof typeof exampleObj1;
type ValueUnion = (typeof exampleObj1)[KeyUnion];
```

## Discriminated Unions  

>유니온 타입은 여러 타입이 포함된 타입인데, 식별 필드를 통해 타입을 구분할 수 있다.   

- Discriminated Field는 숫자, 문자열, 불리언 가능  
- interface에서도 유사하게 Discriminated Field 구현 가능   

```js
type Circle = {
  kind: "circle";  // 구분을 위한 식별 필드, literal string
  radius: number;
};

type Square = {
  kind: "square";  // 구분을 위한 식별 필드
  sideLength: number;
};

type Shape = Circle | Square;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle": // Circle 타입으로 좁혀진다.  
      return Math.PI * shape.radius ** 2;
    case "square": // Square 타입으로 좁혀진다.  
      return shape.sideLength ** 2;
  }
}
```

## Discriminated Unions Branding  

```js
type Menu = "home" | "products" | "about";
type ButtonVariant = "primary" | "secondary";

//1.
type FlexibleMenuFail = Menu | string;
// 타이핑 실패, "home" | "products" | "about" 타이핑이 가능하되, string도 받게끔 하고 싶은데 전혀 타이핑이 안된다.
// tsc에서 Menu | string; 는 아예 string으로 타입을 확장시켜 버린다.
export const menus2: FlexibleMenuFail[] = [""];

//2.
type FlexibleMenu = Menu | (string & {});
type FlexibleButtonVariant = ButtonVariant | (string & {});

// 타입이 자동완성되면서(home" | "products" | "about") "other..."와 같은 추가적인 문자열도 넣기 가능.!
export const menus: FlexibleMenu[] = ["home", "products", "about", "other..."];

//3.
// Typescript helper 제너릭으로 리팩터링 가능
type FlexibleAutoComplete<T> = T | (string & {});
type FlexibleButtonVariantGeneric = FlexibleAutoComplete<ButtonVariant>;

export const buttonVariants: FlexibleButtonVariantGeneric[] = [
  "primary",
  "other",
];
```

## Undefined optional type union

```js
import { ChangeEventHandler } from "react";

//1.
// value, onChange는 optional 값으로 ?를 사용할 수 있지만,
// value가 받았더라면 onChange도 반드시 써야하는 상황이 있다.
type InputPropsAsIs = {
  value?: string;
  onChange?: ChangeEventHandler;
  label: string;
};

//2. undefined optional field
// 유니온 타입을 통해서 가능하다.
type InputProps1 = (
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

//3. generic
type TightProps<T extends object> = T | OptionalUndefined<T>;
type OptionalUndefined<T extends object> = Partial<Record<keyof T, undefined>>;

// type을 정의했으나, optional 하게 props를 받아도 되는 상황이다.
type InputProps2 = TightProps<{
  value: string;
  onChange: ChangeEventHandler;
}> & {
  label: string;
};

const InputExG = ({ label, ...props }: InputProps2) => {
  return (
    <div>
      <label>
        {label}
        <input {...props} />
      </label>
    </div>
  );
};
export default InputExG;

```


## React Hook with Generic 

```js
const useLocalStorage = (identifier: string) => {
  const set = (key: string, value: any) => {
    window.localStorage.setItem(key + identifier, JSON.stringify(value));
  };

  const get = (key: string) => {
    return JSON.parse(window.localStorage.getItem(key + identifier) || "null");
  };
  return { set, get };
};
---
const useLocalStorage = <T,>(identifier: string) => {
  const set = (key: string, value: T) => {
    window.localStorage.setItem(key + identifier, JSON.stringify(value));
  };

  const get = (key: string): T | null => {
    return JSON.parse(window.localStorage.getItem(key + identifier) || "null");
  };
  return { set, get };
};
---
function App() {
  const client = useLocalStorage<{ level: string }>("client");
  client.set("level", { level: "student" });
  const clientLevel = client.get("level");

  return <></>;
}

export default App;

```

```js

export const useStateObject = (initial: any) => {
  const [value, set] = useState(initial);
  ...
};
---
export const useStateObject = <T,>(initial: T) => {
  const [value, set] = useState(initial);
  ...
};
```


## React Component with Generic 

```js
// 1.before
import { ReactNode } from "react";

interface ProductListProps {
  rows: any[];
  renderRow: (row: any) => ReactNode;
}

export const ProductList = (props: ProductListProps) => {
  return <ul>{props.rows.map((row) => props.renderRow(row))}</ul>;
};

const products = [
  {
    id: 1,
    title: "product",
  },
];

function App() {
  return (
    <div>
      <ProductList rows={products} renderRow={(row) => <li>{row.title}</li>} />
      <ProductList
        rows={products}
        renderRow={(row) => {
          return <li>{row.nonExistingProp}</li>;
        }}
      ></ProductList>
    </div>
  );
}
---
// 1.after
interface ProductListProps<T> {
  rows: T[];
  renderRow: (row: T) => ReactNode;
}

export const ProductList = <T,>(props: ProductListProps<T>) => {
  return <ul>{props.rows.map((row) => props.renderRow(row))}</ul>;
};

interface Product {
  id: number;
  title: string;
  price: number;
}

function App() {
  return (
    <div>
      {/* 타입오류 */}
      <ProductList<Product>
        rows={[1, 2, 3, 4]}
        renderRow={(row) => <li>{row.title}</li>}
      />
      <ProductList<Product>
        rows={[
          { id: 1, title: "blabla", price: 99 },
          // 타입 오류
          { id: "2", title: "blabla2", price: "29" },
        ]}
        renderRow={(row) => {
          // 타입 오류, Product 추론됨   
          return <li>{row.nonExistingProp}</li>;
        }}
      ></ProductList>
    </div>
  );
}
```


## 리팩토링: 삼항연산자 > Discriminated Unions  

```js
export type AllowedVariants = "with-controls" | "no-controls";

//1.
//삼항연산자로 타입 조건 
export type PopupProps<T extends AllowedVariants> = {
  isOpen: boolean;
  variant: T;
} & (T extends "with-controls"
  ? {
      label: string;
      onClick: () => void;
    }
  : {});

---
// extends + 삼항연산자 없이도 간단하게 리팩토링 가능.  
export type PopupProps = {
  isOpen: boolean;
} & (
  | {
      variant: "with-controls";
      label: string;
      onClick: () => void;
    }
  | {
      variant: "no-controls";
    }
);


export const Popup = <T extends AllowedVariants>(props: PopupProps<T>) => {
  return <></>;
};


```



## Typing HoC 

```js
import { MouseEventHandler, MouseEvent, useCallback, useState } from "react";

const getPosition = (event: MouseEvent): { x: number; y: number } => {
  return {
    x: event.clientX,
    y: event.clientY,
  };
};

const initialState = { x: 0, y: 0 };

// 1.
// HoC에서 제공해주는 props를 정의한다.
// HoC에서 props를 받는 자식 컴포넌트는 아래 인터페이스를 확장해야 한다.
export interface WithMouseMoveProps {
  x: number;
  y: number;
  onMouseMove: MouseEventHandler;
}

// 2.HoC 정의
// 함수를 리턴 함수를 작성한다. Component의 props는 hoc props를 포함한다.
const withMouseMove =
  <T extends object>(Component: React.ComponentType<WithMouseMoveProps & T>) =>
  (props: Omit<T, keyof WithMouseMoveProps>) => {
    const [{ x, y }, setPosition] = useState(initialState);

    const updatePosition = useCallback<MouseEventHandler>(
      (event) => {
        const { x, y } = getPosition(event);
        setPosition({ x, y });
      },
      [setPosition]
    );

    return (
      <Component {...(props as T)} x={x} y={y} onMouseMove={updatePosition} />
    );
  };

export default withMouseMove;

--- 
import { WithMouseMoveProps } from "./withMouseMove";

export type DisplayMousePositionProps = {
  title: string;
};

// 3.
// HoC에서 받은 props를 타이핑 해준다.
export const DisplayMousePosition = ({
  x,
  y,
  onMouseMove,
  title,
}: WithMouseMoveProps & DisplayMousePositionProps) => {
  return (
    <div className="relative-container" onMouseMove={onMouseMove}>
      {title}
      <section className="absolute-section">
        <p>
          <span className="bold-span">X</span>: {x}
        </p>
        <p>
          <span className="bold-span">Y</span>: {y}
        </p>
      </section>
    </div>
  );
};
---
// 4.
const EnhancedDisplayMousePosition =
  withMouseMove<DisplayMousePositionProps>(DisplayMousePosition);

function App() {
  return (
    <>
      <EnhancedDisplayMousePosition title="hello" />
    </>
  );
}
```



## RenderProps Pattern   

```js
import { MouseEventHandler, useState } from "react";
import "../style.css";

type RenderMousePositionProps = {
  children: (props: { x: number; y: number }) => React.ReactNode;
};

export const RenderMousePosition = ({ children }: RenderMousePositionProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const updatePosition: MouseEventHandler = (event) => {
    setPosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <div className="relative-container" onMouseMove={updatePosition}>
      {children({ x: position.x, y: position.y })}
    </div>
  );
};

---
import "./App.css";
import { RenderMousePosition } from "./components/render-props/RenderMouse";

const DisplayMousePos = ({ x, y }: { x: number; y: number }) => (
  <section className="absolute-section">
    <p>
      <span className="bold-span">X</span>: {x}
    </p>
    <p>
      <span className="bold-span">Y</span>: {y}
    </p>
  </section>
);

function App() {
  return (
    <div className="container">
      <RenderMousePosition>
        {({ x, y }) => <DisplayMousePos x={x} y={y} />}
      </RenderMousePosition>
    </div>
  );
}

export default App;

```

## Limiting prop composition  

>상호베타적인 타입을 선언할때 사용한다.  

```js
type ButtonProps = {
  children: string;
};

type PrimaryButtonProps = {
  primary: boolean;
  secondary?: never;
};

type SecondaryButtonProps = {
  primary?: never;
  secondary: boolean;
};


const buildClassNames = (classes: { [key: string]: boolean }): string => {
  let classNames = "";
  for (const [key, value] of Object.entries(classes)) {
    if (value) classNames += key + " ";
  }
  return classNames.trim();
};

export const Button = ({
  children,
  primary = false,
  secondary = false,
}: ButtonProps & (PrimaryButtonProps | SecondaryButtonProps)) => {
  const classNames = buildClassNames({ primary, secondary });

  return <button className={classNames}>{children}</button>;
};

--- 
import { Button } from "./components/button";
import "./App.css";

function App() {
  return (
    <div className="container">
      <Button primary>Primary Button</Button>
      <Button secondary>Secondary Button</Button>
      {/* 아래 2가지 props는 동시에 사용 불가능하다. */}
      {/* <Button primary secondary>Secondary Button</Button> */}
    </div>
  );
}

export default App;

```

## 214 Requiring props Composition   

```js

      <TextPan short expanded={expanded}>
        {dummyText}
      </TextPan>
      {/* expanded만 쓰면 오류난다. short를 반드시 요구 */}
      <TextPan expanded={expanded}>{dummyText}</TextPan>
```

## 215 Render Props  

```js
import ListHandler from "./list-handler";
import books from "./books.json";
import styled from "styled-components";

const DisplayBooksContainer = styled.div`
  text-align: center;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
  font-weight: 600;
  margin-bottom: 1rem;
`;

const StyledBook = styled.div`
  padding: 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  max-width: 20rem;
  margin: 0.5rem auto;
`;

const booksData = books.slice(0, 4);
const DisplayBooks = () => {
  return (
    <DisplayBooksContainer>
      <Title>Books List</Title>
      <div>
        <ListHandler
          items={booksData}
          keyExtractor={(book) => book.id}
          renderItem={(item) => <StyledBook>{item.title}</StyledBook>}
        />
      </div>
    </DisplayBooksContainer>
  );
};
export default DisplayBooks;

---
const ListHandler = (props) => {
  const { items, keyExtractor, renderItem } = props;
  return (
    <div>
      {items.map((item, index) => {
        return <div key={keyExtractor(item)}>{renderItem(item, index)}</div>;
      })}
    </div>
  );
};
export default ListHandler;

```


## 216 Polymorphic Component  

```js
import Button from "./button";

const PolymorphicComponent = (props) => {
  return (
    <div>
      <Button type="button">This is a button</Button>
      <Button as="a" href="https://google.com">
        This is a link
      </Button>
    </div>
  );
};
export default PolymorphicComponent;
---
const Button = (props) => {
  const { children, as, ...buttonProps } = props;
  const Component = as || "button";

  return (
    <StyledButton>
      <Component {...buttonProps}>{children}</Component>
    </StyledButton>
  );
};
```
```

shadcn/ui에서 asChild와 as 속성은 구성 요소의 특정 동작을 제어할 때 유용한 속성입니다. 이 속성들은 Radix UI 같은 라이브러리와 같이 컴포넌트를 더 유연하게 구성할 수 있게 합니다. 각 속성의 용도는 다음과 같습니다:

asChild

asChild 속성은 Radix UI와 같은 라이브러리에서 사용되며, 기본 컴포넌트의 렌더링을 커스터마이징할 수 있게 합니다. 예를 들어, 버튼이나 링크와 같은 컴포넌트의 렌더링 태그를 커스터마이징할 수 있습니다.

<Button asChild>
  <a href="/page">Go to Page</a>
</Button>

위 예시에서 Button 컴포넌트는 실제로 <a> 태그로 렌더링되며, 버튼의 모든 스타일과 기능이 <a> 태그에 적용됩니다. asChild를 사용하면 기본 구성 요소의 DOM 구조를 재정의할 수 있어, 스타일과 이벤트 처리를 유지하면서 원하는 태그로 컴포넌트를 렌더링할 수 있어요.

as

as 속성은 특정 태그나 컴포넌트를 명시적으로 지정할 수 있는 속성입니다. 예를 들어, 버튼을 <button>이 아닌 <a> 태그로 바꾸고 싶을 때 유용하게 사용할 수 있습니다.

<Button as="a" href="/page">
  Go to Page
</Button>

이 경우, Button 컴포넌트가 <a>로 렌더링되며, href 속성 등 링크의 속성을 사용할 수 있습니다. as는 asChild와 달리 단일 태그 또는 컴포넌트를 설정하는 데 사용됩니다.

사용 시 주의사항

asChild와 as 속성을 잘못 사용할 경우 컴포넌트의 이벤트 처리나 스타일이 예상과 다르게 작동할 수 있어, 각 속성의 차이를 이해하고 사용하는 것이 중요해요.
```

## 221

```js
import { PropsWithChildren } from "react";
import "./style.css";

type CardProps = { color?: "crimson" | "blue" | "brown" };

const Card = ({ children, color = "blue" }: PropsWithChildren<CardProps>) => {
  return (
    <section className="m-4 card-container" style={{ color }}>
      {children}
    </section>
  );
};

export default Card;
---
// type ButtonProps = React.PropsWithChildren<{
//   onClick: () => void;
// }>;

// button의 기본 속성들을 다 있는 상태로 추가
type ButtonProps = React.ComponentPropsWithoutRef<"button">;

const Button = ({ children, onClick, type }: ButtonProps) => {
  return (
    <button onClick={onClick} type={type}>
      {children}
    </button>
  );
};
---
import React from 'react';

type CustomButtonProps = ComponentPropsWithRef<'button'> & {
  customProp: string;
};

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ customProp, ...props }, ref) => {
    return (
      <button ref={ref} {...props}>
        {customProp}
      </button>
    );
  }
);
```

## 225

```js
type ProfileProps =
  | {
      showLinkedin: true;
      linkedinId: string;
    }
  | {
      showLinkedin?: false;
      githubId: string;
    };

const Profile = (props: ProfileProps) => {
  if (props.showLinkedin) {
    return (
      <a href={`https://www.linkedin.com/in/${props.linkedinId}`}>
        Linkedin Profile
      </a>
    );
  }

  return <a href={`https://github.com/${props.githubId}`}>Github Profile</a>;
};

export default Profile;
---
// ok
<Profile showLinkedin linkedinId="test-lnk" />
// ok
<Profile githubId="test-gth" />
// error,
<Profile showLinkedin githubId="test-gth" />
// error,
<Profile linkedinId="test-lnk" />

```

## 226 Empty Object as Type  

```js
const Component = (props: { data: Record<string, never> }) => {
  return <div />;
};

function App() {
  return (
    <div>
      <Component data={{}} />
    </div>
  );
}

export default App;
```


## Mapped Types

```js
// 뼈대 타입을 선언한다.  
export const NewsTypeEnum = {
  Eco: 'Eco',
  Quick: 'Quick',
  Global: 'Global',
} as const;

export type NewsType = PickKeys<typeof NewsTypeEnum>;

type Content = {
  Eco: EcoContent;
  Quick: QuickContent;
  Global: GlobalContent;
};

// Point.1
type ContentByNewsType = {
  [K in NewsType]: Content[K];
};

// Point.2
type ContentDebug = {
  Eco: any; // EcoContent;
  Global: any; // GlobalContent;
  Quick: any; // QuickContent;
};

type ContentDebugByNewsType = {
  [K in NewsType]: ContentDebug[K];
};

export type NewsCard<R extends NewsType> = {
  id: number;
  NewsType?: R;
  version?: string;
  content?: ContentByNewsType[R];
  debugContent?: ContentDebugByNewsType[R];
  logId?: string;
  relatedCards?: NewsCard<NewsType>[];
};
```