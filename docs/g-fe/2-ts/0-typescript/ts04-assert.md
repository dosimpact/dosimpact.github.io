---
sidebar_position: 2
---

# TS 4 - TypeGuard, Assert  

## Goal  

타입을 좁히거나 단언  
- [ ] assert 함수 : asserts error is AxiosError 등의 구문 
- [ ] 타입 가드 : 타입 가드는 반환 타입으로 obj is Type 형태 + in 연산자를 사용하여 객체에 특정 속성 체크
- [ ] instanceof : 클래스 기반 객체의 타입 


## asserts

1.타입스크립트에서 타입을 좁히기 위해서 사용한다.  
- 프리미티브 타입 : asserts condition 함수  
- 객체 타입 : asserts error is AxiosError 등 구문 사용  
  - 예) try..catch 애러에서 catch된 애러의 경우에는 타입이 unknown이다. 이를 위해 assertion을 사용하면 타입을 좁힐 수 잇다.  

2.Asserts은 화살표 함수 대신 '함수'로 구현해야 한다.  
- 함수 선언과 달리 타입 추론이 제대로 되지 않는다.  

### asserts condition

```js
function assert(condition: boolean, message: string): asserts condition {
    if (!condition) {
        throw new Error(message);
    }
}
---
const value: number | null = 5;
assert(value !== null, 'Value should not be null');
// 이후의 코드에서는 value가 null이 아님을 보장받습니다.
console.log(value.toFixed(2));
```

### asserts error is AxiosError


```js
import axios, { AxiosError } from 'axios';

// assetion
export function assertAxiosError(err: unknown): asserts err is AxiosError {
  if (typeof err === 'object' && err !== null && 'isAxiosError' in err) {
    return;
  }
  throw err;
}
---
// with generic 
export function assertAxiosError<T extends object>(err: unknown): asserts err is AxiosError<T> {
  if (typeof err === 'object' && err !== null && 'isAxiosError' in err) {
    return;
  }
  throw err;
}
---
// with axios static method
function assertIsAxiosError(error: any): asserts error is AxiosError {
    if (!axios.isAxiosError(error)) {
        throw new Error('The error is not an AxiosError');
    }
}
---
// usage
     async function fetchData(url: string) {
         try {
             const response = await axios.get(url);
             console.log(response.data);
         } catch (error) {
             assertIsAxiosError(error); // 여기서 error가 AxiosError임을 확인
             console.error('Axios error message:', error.message);
             console.error('Axios error config:', error.config);
             // 이후에는 error가 AxiosError 타입임을 보장받습니다.
         }
     }

fetchData('https://jsonplaceholder.typicode.com/posts');
```


