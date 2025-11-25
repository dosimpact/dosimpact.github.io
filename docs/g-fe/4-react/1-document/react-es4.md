---
sidebar_position: 4
---

# React 공식문서  

- [React 공식문서](#react-공식문서)
  - [4.탈출구](#4탈출구)
  - [4.1 Ref로 값 참조하기.](#41-ref로-값-참조하기)
    - [ref의 사용목적](#ref의-사용목적)
  - [4.2 Ref로 DOM 조작하기](#42-ref로-dom-조작하기)
  - [4.8 커스텀 Hook으로 로직 재사용하기](#48-커스텀-hook으로-로직-재사용하기)


## 4.탈출구

## 4.1 Ref로 값 참조하기.  

### ref의 사용목적 

📌 ref의 사용목적 : 컴포넌트가 리렌더링 사이의 일부정보를 유지 & 렌더링 유발하지 않게 하기 위함.  
- *렌더링 로직에 영향을 미치지 않는 경우 사용한다.   
- *state는 snapshot처럼 동작한다. 이와 상관없이 최신의 정보를 참조하고 싶을때 사용.  

📌 useState와 ref의 차이
- ref는 mutable 가능, state는 immutable 로 리렌더 대기열 넣어야 함. 

예) 타이머의 interval ID 값,
- interval ID은 리렌더링에 상관없다.
- 이벤트 핸들러가 취소하기 위해서 Interval ID 정보를 기억해야한다. Ref를 사용하자.

useState로 useRef 구현하기. 
- ref.current의 이유는 불변성 때문이다.      

```
// Inside of React
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

📌 refs를 사용하는 useCase  
1.timeout ID 저장   
2.DOM 엘리먼트 저장 및 조작   
3.JSX를 계산하는데 필요하지 않은 다른 객체 저장.  

📌 timeout ID 저장을 useRef 대신 컴포넌트 외부에 값을 저장해도 작동하긴 한다. 차이점은?  
- 컴포넌트 생명주기와 관련이 있다.  
- useRef는 컴포넌트 인스턴스마다 생기는 독립적인 값.  
- 컴포넌트 외부 값은 모든 컴포넌트가 공유하는 static한 글로벌 변수이다.  

## 4.2 Ref로 DOM 조작하기  

>useRef, ref callback, forwardRef, useImperativeHandle, flushSync

1.예시, input focus 하기   
```js
  function handleClick() {
    inputRef.current.focus();
  }
```
2.예시, scrollIntoView
```js
  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }
```
3.예시, ref콜백  

- ref콜백은 라이프싸이클에 맞추어서 node 혹은 null을 전달해준다.  

```js
{catList.map((cat) => (
  <li
    key={cat}
    ref={(node) => {
      const map = getMap();
      node ? map.set(cat, node) :map.delete(cat);
    }}
  >
    <img src={cat} />
  </li>
))}
```

📌 forwardRef    
- 자식에게 ref를 전달가능  
```js
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});
```

📌 useImperativeHandle  

- 부모 컴포넌트에서 ref를 이용해서 예상치 못 한 작업을 방지하는 법.  
- 아래 예시는 부모 컴포넌트는 ref를 통해서 focus만 가능하다.  

```js
const MyInput = forwardRef((props, ref) => {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // 오직 focus만 노출합니다.
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input {...props} ref={realInputRef} />;
});
```

📌 flushSync   

- state는 큐에 쌓여 비동기로 처리된다.
- 핸들러 함수에서는 DOM업데이트전의 상태를 보고 있다.  
- 아래 예시처럼 최신의 DOM을 보고 DOM API를 호출하려면 flushSync로 커밋페이스까지 동기화 가능.  

```js
  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    flushSync(() => {
      setText('');
      setTodos([ ...todos, newTodo]);
    });
    // By this line, the DOM is updated.
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }
```

📌 React가 관리하는 DOM 노드, ref로 관리하는 DOM 노드   

- 차트 라이브러리 등 직접 DOM 관리를 해야하는 경우라면 React랑 충돌을 피해야 한다.  
- 빈 div 태그를 리턴하고, 해당 태그안에서 DOM을 조작하자.  


## 4.8 커스텀 Hook으로 로직 재사용하기  

📌 커스텀 Hook 이란? 
- 리액트 라이프싸이클 훅이 포함된 재사용가능한 로직.  

📌 커스텀 Hook이 구체적인 고급 사용 사례에 집중하도록 하기 

1.이상적으로 커스텀 Hook의 이름은 코드를 자주 작성하는 사람이 아니더라도 
- 커스텀 Hook이 무슨 일을 하고, 무엇을 props로 받고, 무엇을 반환하는지 알 수 있도록 아주 명확해야 합니다.
- ✅ useData(url)  
- ✅ useImpressionLog(eventName, extraData)  
- ✅ useChatRoom(options)    


2.외부 시스템과 동기화할 때, 커스텀 Hook의 이름은 좀 더 기술적이고 해당 시스템을 특정하는 용어를 사용하는 것이 좋습니다. 
- 해당 시스템에 친숙한 사람에게도 명확한 이름이라면 좋습니다.
- ✅ useMediaQuery(query)
- ✅ useSocket(url)
- ✅ useIntersectionObserver(ref, options)


3.커스텀 Hook이 구체적인 고급 사용 사례에 집중할 수 있도록 하세요. 
- useEffect API 그 자체를 위한 대책이나 편리하게 감싸는 용도로 동작하는 커스텀 “생명 주기” Hook을 생성하거나 사용하는 것을 피하세요.
- 🔴 useMount(fn)
- 🔴 useEffectOnce(fn)
- 🔴 useUpdateEffect(fn)

📌 useSyncExternalStore  

```js

```

📌 requestAnimationFrame  

배경지식  
- 보통 초당 60번 화면을 그리는데, 리프레시 주기에 맞추어 로직 작성 > 브라우저 성능을 최적화  
- 콜백 함수는 17ms간격으로 호출. 
- 만약 requestAnimationFrame 안의 작업이 33ms 걸린다면 '프레임 드랍' 발생, 30fps 갱신을 보여준다.  
  - 장점 : 탭이 비활성화 > 자동 일시정지 된다.  


참고 - performance.now()  
```js
const time1 = performance.now();
for (let i = 1; i <= 1_000_000_000; i++) {}
const time2 = performance.now();
console.log(time2 - time1); // 약 350ms
```

예시) useFadeIn   
```js
import { useEffect } from 'react';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // 아직 그려야 할 프레임이 많습니다.
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, [ref, duration]);
}

```

예시) useFadeIn with Class

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


📌 useEffectEvent(실험)    

- 아직 실험적인 기능이다.  
- 사용 목적 : useEffect 에서 의존성배열 추가하지 않고 핸들러 함수를 호출하고 싶을때  

예) 챌린지 도전하기 4번

```js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => {
      clearInterval(id);
    };
  }, [onTick, delay]);
}
---
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

```