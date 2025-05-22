---
sidebar_position: 1
---

# Hooks Snippets  


- [Hooks Snippets](#hooks-snippets)
  - [useShadowDOM](#useshadowdom)
    - [Shadow DOM 개념](#shadow-dom-개념)
    - [예제](#예제)
    - [예제 with React](#예제-with-react)
    - [예제 with React + StyledComponent](#예제-with-react--styledcomponent)
  - [useBreakpoint](#usebreakpoint)
  - [usePortal (dynamic target DOM)](#useportal-dynamic-target-dom)
  - [useClickOutside](#useclickoutside)
  - [useIntersectionObserver](#useintersectionobserver)
  - [useFadeIn](#usefadein)
  - [useEllipsis](#useellipsis)


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

## usePortal (dynamic target DOM)  

- React의 컨텍스트를 유지시키면서 특정 컴포넌트를 다른 DOM에 연결시킬 수 있다.  
- 모달, 툴팁, 드롭다운 등 부모 스타일에 영향을 받지 않도록 할 때  

동작원리  
- createPortal의 target domNode을 동적으로 생성하는 경우.
- step1. createPortal : 리액트 엘리먼트를 컨테이너 HTMLElement 에 붙이는 단계
- ㄴDOM에 안보이는데 리액트 컴포넌트는 작동한다.
- step2. 컨테이너 HTMLElement 을 RealDOM에 붙이는 단계
- ㄴ렌더링이 되어 보인다.

```js
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// createPortal의 target domNode을 동적으로 생성하는 경우.
// step1. createPortal : 리액트 엘리먼트를 컨테이너 HTMLElement 에 붙이는 단계
// ㄴDOM에 안보이는데 리액트 컴포넌트는 작동한다.
// step2. 컨테이너 HTMLElement 을 RealDOM에 붙이는 단계
// ㄴ렌더링이 되어 보인다.

const usePortal = (id: string): HTMLElement => {
  const containerElemRef = useRef<HTMLElement | null>(null);

  const createRootElement = (id: string): HTMLElement => {
    const rootContainer = document.createElement("div");
    rootContainer.setAttribute("id", id);
    return rootContainer;
  };

  const addRootElement = (rootElem: HTMLElement): void => {
    document.body.insertBefore(
      rootElem,
      document.body.lastElementChild?.nextElementSibling || null
    );
  };

  const getContainerElem = (): HTMLElement => {
    if (!containerElemRef.current) {
      containerElemRef.current = document.createElement("div");
    }

    return containerElemRef.current;
  };

  useEffect(() => {
    const existingRootElement = document.querySelector<HTMLElement>(`#${id}`);
    const rootElement = existingRootElement || createRootElement(id);

    if (!existingRootElement) addRootElement(rootElement);

    if (rootElement && containerElemRef.current)
      rootElement.appendChild(containerElemRef.current);

    return () => {
      // container Level 초기화
      if (containerElemRef.current) {
        containerElemRef.current.remove();
      }
      // root Level 초기화
      if (!rootElement.childElementCount) {
        rootElement.remove();
      }
    };
  }, [id]);

  return getContainerElem();
};

export default usePortal;

export const Portal: React.FC<{ id: string; children: React.ReactNode }> = ({
  id,
  children,
}) => {
  const target = usePortal(id);

  return createPortal(children, target);
};


```


## useClickOutside  

- 1.event에 target(실제 이벤트 발생 노드), currentTaget(리스너가 걸린 노드)  
- 2.document.body에 mousedown 이벤트를 리슨한다.    
- 3.boxRef가 event.target을 contains 하는지 판단한다.   

- document vs document.body 차이 
  - document.body는 html안의 body 태그까지만 클릭을 감지한다. 
  - CSS 문제로 body태그를 넘어가는 요소가 생기면 전체 document 클릭의 빈큼이 생길 수 있다.  

```js
import { useEffect, useRef } from "react";

interface UseClickOutsideProps {
  onClickOutside?: () => void;
}

const useClickOutside = ({ onClickOutside }: UseClickOutsideProps = {}) => {
  const boxRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (boxRef.current && !boxRef.current?.contains(event.target as Node)) {
        onClickOutside && onClickOutside();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [boxRef, onClickOutside]);

  return { boxRef };
};

export default useClickOutside;

```

## useIntersectionObserver

```js
import { useState, useEffect, useRef } from "react";

interface IntersectionObserverArgs {
  root?: Element | null; // root: null, // 뷰포트를 root로 사용
  rootMargin?: string; // rootMargin: '50px 0px', // 위아래로 50px의 여유를 두고 감지
  threshold?: number | number[];
}

const useIntersectionObserver = (
  options: IntersectionObserverArgs = {
    root: null,
    rootMargin: "",
    threshold: 0,
  }
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<Element | null>();

  useEffect(() => {
    if (!targetRef.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(targetRef.current);

    return () => {
      if (targetRef.current) observer.unobserve(targetRef.current);
    };
  }, [options]);

  return { targetRef, isIntersecting };
};

export default useIntersectionObserver;

```

## useFadeIn

```js

export class FadeInAnimation {
  private node: HTMLElement;
  private duration: number = 1000; // 1sec delay
  private startTime: number | null = null;
  private frameId: number | null = null;

  constructor(node: HTMLElement) {
    this.node = node;
  }
  start(duration: number) {
    this.duration = duration;
    this.startTime = performance.now();
    this.onProgress(0);
    // (x) this.frameId = requestAnimationFrame(this.onFrame);
    // (x) this.frameId = requestAnimationFrame(() => this.onFrame);
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  stop(): void {
    if (this.frameId) cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.duration = 1;
    this.frameId = null;
  }
  private onFrame() {
    if (!this.startTime) return;

    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);

    this.onProgress(progress);
    if (progress < 1) {
      this.frameId = requestAnimationFrame(() => this.onFrame());
    } else {
      this.stop();
    }
  }
  private onProgress(progress: number) {
    this.node.style.opacity = progress.toString();
  }
}

---
import { useEffect, RefObject } from 'react';
import { FadeInAnimation } from './FadeInAnimation';

export function useFadeIn(ref: RefObject<HTMLElement>, duration: number): void {
  useEffect(() => {
    if (!ref.current) return;
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);

    return () => {
      animation.stop();
    };
  }, [ref, duration]);
}
```


## useEllipsis  

목적 : 텍스트가 짤리는 경우(ellipsis)인지 아닌지 판단한다. JS로 판단  

📒 개념 scrollWith, clientWidth, offsetWidth는
- ![img](https://preview.redd.it/diagram-for-offsetwidth-offsetheight-clientwidth-v0-jwjvndwwy6db1.png?auto=webp&s=de7877f7831cc836db0244225726511080df22f3)  
- 200px 블럭이  50px의 부모에 의해 줄어들어 스크롤이 발생한다. 이때  scrollWith는 200px, clientWidth는 50px이다.  
  - offsetWidth는 border 즉, 스크롤영역을 포함한 크기이다. 예를들어 70px 이 될 수 있다.   

📒 개념 RefObject vs MutableRefObject
- useRef의 타입 중 하나이다. 전자는 변경이 불가능한 ref이다.  
- null초기값을 해야 RefObject로 선언된다. 그냥 정의가 그렇다.  
  ```
  - // DOM 요소를 위한 오버로드 (null 초기값 사용 시)
  - function useRef<T>(initialValue: null): React.RefObject<T>;
  - // 다른 값들을 위한 오버로드
  - function useRef<T>(initialValue: T): React.MutableRefObject<T>;
  - // 초기값 없는 경우
  - function useRef<T = undefined>(): React.MutableRefObject<T | undefined>;
  ```

```js
function useEllipsis<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [isEllipsis, setIsEllipsis] = useState(false);
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const checkEllipsis = () => {
      const el = ref.current;
      if (!el) return;

      const hasEllipsis = el.offsetWidth < el.scrollWidth;
      setIsEllipsis(hasEllipsis);
    };

    checkEllipsis(); 

    observerRef.current = new ResizeObserver(() => {
      checkEllipsis();
    });

    if (ref.current) observerRef.current.observe(ref.current);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  return { ref, isEllipsis };
}

--- 
// eg sudo
const TextEllipsis = ({value})=>{
  const { ref, isEllipsis } = useEllipsis();

  // css - overflow:hidden, text-overflow:ellipsis, white-space:no-wrap
  return (
    <div className="w-full truncate" ref={ref}> {isEllipsis ? <Tooltip value={value} /> : value } </div>
  )
}
```