---
sidebar_position: 4
---

# Timer, Debouncing, Throttling  


## setTimeout, setInterval, clearTimeout, clearInterval

- **타이머 식별자 저장**: `setTimeout` 및 `setInterval`은 각각 타이머 식별자를 반환하므로, 이를 변수에 저장해야 나중에 `clearTimeout` 또는 `clearInterval`로 취소할 수 있습니다.
- **즉시 실행 방지**: 타이머를 설정한 후 바로 취소할 경우, 타이머 콜백이 실행되지 않도록 할 수 있습니다.

```javascript
const timeoutId = setTimeout(() => {
  console.log('This will not be logged if cleared');
}, 5000);

// 타이머 취소
clearTimeout(timeoutId);
```

```javascript
const intervalId = setInterval(() => {
  console.log('This will not be logged if cleared');
}, 1000);

// 타이머 취소
clearInterval(intervalId);
```

```javascript
// 추가 예제: React 컴포넌트에서 타이머 사용 및 취소
import React, { useEffect } from 'react';

const TimerComponent = () => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('Timeout triggered');
    }, 5000);

    const intervalId = setInterval(() => {
      console.log('Interval triggered');
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  return <div>Timer Component</div>;
};

export default TimerComponent;
```

## 쓰로틀링(throttling)과 디바운싱(debouncing)

- **디바운싱**: 일정 시간 동안 이벤트가 발생하지 않으면 함수 실행
- **쓰로틀링**: 일정 시간 간격마다 한 번씩 함수 실행

### 디바운싱 (Debouncing)

```javascript
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// 사용 예시
const debouncedFunction = debounce(() => {
  console.log('Debounced function executed');
}, 300);

// 예시로, 입력 필드의 입력 이벤트에 연결
document.getElementById('inputField').addEventListener('input', debouncedFunction);
```

### 쓰로틀링 (Throttling)

```javascript
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 사용 예시
const throttledFunction = throttle(() => {
  console.log('Throttled function executed');
}, 1000);

// 예시로, 스크롤 이벤트에 연결
window.addEventListener('scroll', throttledFunction);
```
