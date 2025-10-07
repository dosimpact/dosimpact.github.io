---
sidebar_position: 13
---

# React Patterns - HoC

## HoC  

React의 Composition 패턴 중 HoC는 리액트 컴포넌트 앞단에 추가 로직을 붙여준다.  
- 컴포넌트 호출 전 로직 추가.  
- 컴포넌트에 추가 props 전달.  

## Usage  

```jsx
import React from 'react';

export default function WithLogging<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) {
  return function WithLoggingComponent(props: P) {
    console.log(
      `${componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component'} rendered with props:`,
      props
    );

    return <WrappedComponent {...props} />;
  };
}

```

### WithSearchParams  

- search parasm의 존재성을 판단하고, props로 넘겨주는 패턴  

```jsx
import React from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

interface WithSearchParamsOptions {
  requiredSearchParams: string[];
}

export default function WithSearchParams<P extends object>(
  WrappedComponent: React.ComponentType<P & { searchParams: Record<string, string | null> }>,
  options: WithSearchParamsOptions
) {
  const { requiredSearchParams } = options;

  return function WithSearchParamsComponent(props: P) {
    const [searchParams] = useSearchParams();

    // 필수 파라미터가 모두 있는지 확인
    const hasAllRequiredParams = requiredSearchParams.every(param => searchParams.get(param) !== null);

    if (!hasAllRequiredParams) {
      return <Navigate to="/" replace />;
    }

    // 파라미터들을 객체로 만들어 전달
    const searchParamsObject = requiredSearchParams.reduce((acc, param) => {
      acc[param] = searchParams.get(param);
      return acc;
    }, {} as Record<string, string | null>);

    return <WrappedComponent {...props} searchParams={searchParamsObject} />;
  };
}

```