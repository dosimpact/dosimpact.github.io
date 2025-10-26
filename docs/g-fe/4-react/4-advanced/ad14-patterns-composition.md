---
sidebar_position: 15
---

# React Patterns - Compoisiton

- [React Patterns - Compoisiton](#react-patterns---compoisiton)
  - [📌 돌아보기, 명령형 vs 선언형](#-돌아보기-명령형-vs-선언형)
  - [Switch](#switch)
  - [Match](#match)
  - [Show](#show)


## 📌 돌아보기, 명령형 vs 선언형  
- 명령적(imperative) : 어떻게(how) 할지 한단계씩 지시, if-else 분기 로직으로 흐름을 탄다.  
- 선언적(Declarative) : 무엇(what)을 원하는지만 선언 (최종 상태의 목표 설정)  
  - 리액트에서 선언형을 지향하는 이유.
    - 1.UI는 상태에 따라 자동 결정됨 
      - ( 이 상태일때는 이것을 보여준다. 그 상태까지 나오는 과정은 관심밖 )  
    - 2.추상화와 테스트가능(유지보수성)  
      - 컴포넌트 내부에서 상태를 복잡하게 계산한다면, 내부 로직을 다 들여다봐야 TC작성 가능  
      - 반대로 상태가 선언적으로 딱 4가지 - 그에 따라 보이는게 4가지로 결정된다면 훨씬 쉽다.  
    - 3.리액트에서 V-Dom diff 알고리즘에서 최소 변경사항을 파악하기 위해 불변성을 탐지한다.  
      - 이 매커니즘에 맞게 개발자도 선언형으로 작성하는것이 복잡성 낮춤.  

- 선언형의 다른 예시  
  - SQL문 작성 => ( 내부에서 쿼리 플래닝과 데이터 조회 )
  - CSS 작성 => ( 브라우저가 내부에서 처리 )  
  - map, each 등 함수형 프로그래밍 => ( 내부 동작은 for문으로 돌아간다. )
    - *장점 : lazy evaluation 최적화 기법 가능.  
      - 명령형에서는 계산 결과를 중간중간 저장하고, 복사하고 for문 돌고 등등 과정을 거치는데  
      - lodash, RxJS 등 내부에서 중간 배열 제거(메모리 절약), 단일 루프 처리(CPU효율) 등 과정을 추가할 여지가 있다.  
  - 장점 : How에 해당하는 복잡한 부분은 시스템이 담당하고, 개발자는 What만 정의한다.  



## Switch  

- 언제 : if-else 조건문 체인이나, 삼항연산자로 복잡한 로직을 처리해서 가독성이 떨어지는 경우  
- 특히, (enum) value에 따라서 조건부 렌더링을 명시적으로 사용할 때 사용하면 좋다.  

```tsx
"use client";

import type React from "react";

interface Props<V extends string | number> {
  caseBy: Partial<Record<V, React.JSX.Element | null>>;
  value: V;
  defaultComponent?: React.JSX.Element | null;
}

export function Switch<V extends string | number>({
  value,
  caseBy,
  defaultComponent = null
}: Props<V>): React.JSX.Element | null {
  if (value == null) {
    return defaultComponent;
  }

  return caseBy[value] ?? defaultComponent;
}
```

예제  

```tsx
function Status({ status }: { status: string }) {
  return (
    <Switch
      value={status}
      caseBy={{
        active: <ActiveComponent />,
        inactive: <InactiveComponent />,
        pending: <PendingComponent />,
      }}
      defaultComponent={<UnknownComponent />}
    />
  );
}
```



## Match

```tsx
"use client";

import type { ReactNode } from "react";
import React from "react";

interface MatchProps<T> {
  value: T;
  children: ReactNode;
}

interface CaseProps<T> {
  when: T | ((value: T) => boolean);
  children: ReactNode;
}

type MatchFunction<T> = (value: T) => boolean;

interface DefaultProps {
  children: ReactNode;
}

export function Match<T>({ value, children }: Readonly<MatchProps<T>>): React.JSX.Element | null {
  const cases = React.Children.toArray(children);

  for (const child of cases) {
    if (React.isValidElement(child)) {
      if (child.type === Case) {
        const { when, children: caseChildren } = child.props as CaseProps<T>;
        const matches = typeof when === "function" ? (when as MatchFunction<T>)(value) : when === value;

        if (matches) {
          return <>{caseChildren}</>;
        }
      }
      else if (child.type === Default) {
        const { children: defaultChildren } = child.props as DefaultProps;
        return <>{defaultChildren}</>;
      }
    }
  }

  return null;
}

export function Case<T>({ children }: Readonly<CaseProps<T>>): React.JSX.Element {
  return <>{children}</>;
}

export function Default({ children }: Readonly<DefaultProps>): React.JSX.Element {
  return <>{children}</>;
}

```

- 값 기반 매칭과 함수 기반 매칭 모두 지원한다.  

```tsx
<Match value={status}>
  <Case when="loading"><Spinner /></Case>
  <Case when={(s)=> s ==="error"}><ErrorMessage /></Case>
  <Case when="success"><Content /></Case>
  <Default><EmptyState /></Default>
</Match>
```

## Show

```tsx
"use client";

import type { ReactNode } from "react";
import React from "react";

type MatchMode = "singleMatch" | "multipleMatch";

interface ShowProps {
  children: ReactNode;
  fallback?: ReactNode;
  mode?: MatchMode;
  separator?: ReactNode;
}

interface WhenProps {
  isTrue: boolean;
  children: ReactNode;
}

/**
 * @example
 * ```tsx
 * <Show fallback={<EmptyState />}>
 *   <When isTrue={isLoading}><Spinner /></When>
 *   <When isTrue={hasError}><ErrorMessage /></When>
 *   <When isTrue={hasData}><Content /></When>
 * </Show>
 * ```
 */
export function Show({
  children,
  fallback = null,
  mode = "multipleMatch",
  separator = null,
}: ShowProps): React.JSX.Element | null {
  const childrenArray = React.Children.toArray(children);
  const matchedElements: ReactNode[] = [];

  for (const child of childrenArray) {
    if (React.isValidElement(child) && child.type === When) {
      const { isTrue, children: whenChildren } = child.props as WhenProps;

      if (isTrue) {
        matchedElements.push(whenChildren);

        if (mode === "singleMatch") {
          return <>{whenChildren}</>;
        }
      }
    }
  }

  if (matchedElements.length > 0) {
    if (separator && matchedElements.length > 1) {
      const elementsWithSeparators: ReactNode[] = [];

      matchedElements.forEach((element, index) => {
        elementsWithSeparators.push(
          <React.Fragment key={`element-${index}`}>{element}</React.Fragment>
        );

        if (index < matchedElements.length - 1) {
          elementsWithSeparators.push(
            <React.Fragment key={`separator-${index}`}>
              {separator}
            </React.Fragment>
          );
        }
      });

      return <>{elementsWithSeparators}</>;
    }

    return <>{matchedElements}</>;
  }

  return <>{fallback}</>;
}

export function When({ children }: WhenProps): React.JSX.Element {
  return <>{children}</>;
}

```

```tsx
<Show fallback={<EmptyState />}>
  <When isTrue={isLoading}><Spinner /></When>
  <When isTrue={hasError}><ErrorMessage /></When>
  <When isTrue={hasData}><Content /></When>
</Show>
```
