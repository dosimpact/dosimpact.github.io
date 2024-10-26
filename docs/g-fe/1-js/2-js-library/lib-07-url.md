---
sidebar_position: 7
---

# URL 


## encodeURIComponent, decodeURIComponent  

URL 인코딩 (percent-encoding) 방식으로 인코딩된 문자열  
- URL에서 사용하는 예약어 때문에, 특수 문자나 비ASCII 문자를 ASCII 형식으로 변환해야 한다. 
- 예)%EC%82%AC%EC%9A%A9%EC%9E%90%EA%B0%80%20%EA%B2%B0%EC%A0%9C%EB%A5%BC%20%EC%B7%A8%EC%86%8C%ED%95%98%EC%98%80%EC%8A%B5%EB%8B%88%EB%8B%A4
- 디코딩 결과 : 사용자가 결제를 취소하였습니다  

```js
// 예제 문자열
const originalText = "사용자가 결제를 취소하였습니다";

// URL 인코딩
const encodedText = encodeURIComponent(originalText);
console.log(encodedText);

// URL 디코딩
const decodedText = decodeURIComponent(encodedText);
console.log(decodedText); // 사용자가 결제를 취소하였습니다

```

