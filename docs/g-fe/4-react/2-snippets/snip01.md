---
sidebar_position: 1
---

# Hooks Snippets

## useShadowDOM  

### Shadow DOM 개념 
- 웹 개발자들이 자신의 HTML 요소에 캡슐화를 적용
- 컴포넌트의 스타일과 구조를 외부로부터 독립적으로 유지

1. **캡슐화:** 스타일과 구조를 독립적으로 유지하여 다른 코드와의 충돌을 방지합니다.
2. **재사용성:** 자체적인 스타일과 구조를 가진 독립적인 컴포넌트를 쉽게 재사용할 수 있습니다.
3. **유지보수성:** 캡슐화된 컴포넌트는 변경 시 다른 부분에 영향을 주지 않아 유지보수가 용이합니다.

- Shadow Tree: Shadow DOM을 사용하여 생성된 DOM 트리는 "shadow tree"라고 불리며, 호스트 요소의 일반 DOM 트리와는 별도로 존재합니다.  
- Shadow Host: Shadow tree가 부착되는 요소를 "shadow host"라고 합니다. 이 호스트는 shadow tree를 포함하지만, 외부에서는 이 내부 구조에 접근할 수 없습니다.  
- Shadow Root: Shadow tree의 루트 요소를 "shadow root"라고 하며, 이를 통해 shadow tree가 연결됩니다.  

**모드(Mode):**
   - **open 모드:** 외부 자바스크립트 코드가 shadow root에 접근할 수 있습니다.
   - **closed 모드:** 외부 자바스크립트 코드가 shadow root에 접근할 수 없습니다.

### 예제

```html
<body>
  <div id="shadow-host">This is a shadow host.</div>
  <script>
    // Shadow Host 요소를 선택합니다.
    const shadowHost = document.getElementById('shadow-host');
    // Shadow Root를 open 모드로 생성합니다.
    const shadowRoot = shadowHost.attachShadow({ mode: 'open' });

    // Shadow DOM 내부에 새로운 콘텐츠를 추가합니다.
    shadowRoot.innerHTML = `
      <style>
        p {
          color: red;
        }
      </style>
      <p>This is inside the shadow DOM.</p>
    `;
  </script>
</body>
</html>
```

### 예제 with React

```js
// 2번 붙는다고 보면된다.  
// - 1. 특정 Html 요소에 shadow Tree를 만들어서 붙이는 작업 ( shadow host tag  - shadow root tag )  
// - 2. shadow root tag에 리액트 컴포넌트를 붙이는 작업  
import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

// Shadow DOM을 생성하고 React 컴포넌트를 렌더링하는 커스텀 훅
function useShadowDOM() {
  const shadowHostRef = useRef(null);
  const shadowRootRef = useRef(null);

  useEffect(() => {
    if (shadowHostRef.current) {
      // 1.shadowRootRef는 이제부터 Tree의 최상단으로 역할 부여
      shadowRootRef.current = shadowHostRef.current.attachShadow({ mode: 'open' }); 
    }
  }, []);

  return [shadowHostRef, shadowRootRef];
}
---
const ShadowComponent = ({ children }) => {
  const [shadowHostRef, shadowRootRef] = useShadowDOM();

  useEffect(() => {
    if (shadowRootRef.current) {
      ReactDOM.render(children, shadowRootRef.current);
    }
  }, [children, shadowRootRef]);

  return <div ref={shadowHostRef}></div>;
};
---
const InnerComponent = () => {
  return (
    <div>
      <p style={{ color: 'red' }}>Hello from the Shadow DOM!</p>
    </div>
  );
};

const App = () => {
  return (
    <div>
      <h1>Main App</h1>
      <ShadowComponent>
        <InnerComponent />
      </ShadowComponent>
    </div>
  );
};

export default App;

```


### 예제 with React + StyledComponent

```js
import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled, { StyleSheetManager } from 'styled-components';

// Shadow DOM을 생성하고 React 컴포넌트를 렌더링하는 커스텀 훅
function useShadowDOM() {
  const shadowHostRef = useRef(null);
  const shadowRootRef = useRef(null);

  useEffect(() => {
    if (shadowHostRef.current) {
      shadowRootRef.current = shadowHostRef.current.attachShadow({ mode: 'open' });
    }
  }, []);

  return [shadowHostRef, shadowRootRef];
}

const ShadowComponent = ({ children }) => {
  const [shadowHostRef, shadowRootRef] = useShadowDOM();

  useEffect(() => {
    if (shadowRootRef.current) {
      ReactDOM.render(
        <StyleSheetManager target={shadowRootRef.current}>
          {children}
        </StyleSheetManager>,
        shadowRootRef.current
      );
    }
  }, [children, shadowRootRef]);

  return <div ref={shadowHostRef}></div>;
};

const StyledParagraph = styled.p`
  color: red;
`;

const InnerComponent = () => {
  return (
    <div>
      <StyledParagraph>Hello from the Shadow DOM!</StyledParagraph>
    </div>
  );
};

const App = () => {
  return (
    <div>
      <h1>Main App</h1>
      <ShadowComponent>
        <InnerComponent />
      </ShadowComponent>
    </div>
  );
};

export default App;

```


## useBreakpoint

- throttling : https://github.com/lodash/lodash/blob/4.17.21-es/throttle.js  

```js
import { useEffect, useState } from 'react';

// 브레이크포인트 타입 정의
type Breakpoint = 'mobile' | 'tablet' | 'desktop';

// 브레이크포인트 정의
const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
};

// 현재 뷰포트에 따라 브레이크포인트를 반환하는 함수
const getBreakpoint = (width: number): Breakpoint => {
  if (width < breakpoints.tablet) return 'mobile';
  if (width < breakpoints.desktop) return 'tablet';
  return 'desktop';
};

// 쓰로틀링 유틸리티 함수
const throttle = (func: (...args: any[]) => void, limit: number) => {
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;

  return function (...args: any[]) {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if ((Date.now() - lastRan) >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

// useBreakpoint 훅 정의
const useBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(getBreakpoint(window.innerWidth));

  useEffect(() => {
    const handleResize = throttle(() => {
      setBreakpoint(getBreakpoint(window.innerWidth));
    }, 200); // 200ms 쓰로틀링

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return breakpoint;
};

export default useBreakpoint;
---
import React from 'react';
import useBreakpoint from './useBreakpoint';

const MyResponsiveComponent: React.FC = () => {
  const breakpoint = useBreakpoint();

  return (
    <div>
      {breakpoint === 'mobile' && <p>Mobile View</p>}
      {breakpoint === 'tablet' && <p>Tablet View</p>}
      {breakpoint === 'desktop' && <p>Desktop View</p>}
    </div>
  );
};

export default MyResponsiveComponent;

```