---
sidebar_position: 1
---

# Debounce, Throttle    


debounce
```ts
/**
 * 디바운스 함수: 마지막 호출 후 지정된 시간(delay)이 지나야 콜백 함수를 실행합니다.
 * @param callback 실행할 콜백 함수.
 * @param delay 지연 시간 (밀리초, ms).
 * @returns 디바운스 처리된 함수.
 */
export function debounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    // 이전 타이머가 있다면 취소
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // 새로운 타이머 설정
    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

// 사용 예시:
// const handleSearch = (keyword: string) => console.log(`검색어: ${keyword}`);
// const debouncedSearch = debounce(handleSearch, 300);
// // 300ms 이내에 여러 번 호출해도 마지막 한 번만 실행됨
```

throttling
```ts
/**
 * 쓰로틀링 함수: 지정된 시간(limit) 간격 내에서는 콜백 함수가 한 번만 실행되도록 제한합니다.
 * @param callback 실행할 콜백 함수.
 * @param limit 제한 시간 (밀리초, ms).
 * @returns 쓰로틀링 처리된 함수.
 */
export function throttle<T extends (...args: any[]) => void>(
  callback: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: unknown = null;

  return function (this: unknown, ...args: Parameters<T>) {
    // 함수 호출 시점의 컨텍스트와 인수를 저장
    lastArgs = args;
    lastThis = this; 

    if (!inThrottle) {
      // 1. 제한 시간이 아니면 즉시 실행
      callback.apply(lastThis, lastArgs);
      inThrottle = true;

      // 2. 제한 시간(limit) 후에 플래그를 해제
      setTimeout(() => {
        inThrottle = false;
        
        // 3. 타이머 만료 시점까지 호출된 이벤트가 있다면 마지막 이벤트를 다시 실행 (선택적)
        // 이 로직은 쓰로틀링 구현 방식에 따라 포함될 수도, 안 될 수도 있습니다.
        if (lastArgs) {
             // callback.apply(lastThis, lastArgs as Parameters<T>); // 마지막 호출 실행을 원한다면 주석 해제
             lastArgs = null; // 실행 후 인수를 초기화
        }

      }, limit);
    }
  };
}

// 사용 예시:
// const handleScroll = (event: Event) => console.log('스크롤 이벤트 발생');
// const throttledScroll = throttle(handleScroll, 100);
// // 100ms 마다 최대 한 번만 handleScroll이 실행됨
```