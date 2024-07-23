---
sidebar_position: 3
---

# QS

## npm install qs

`qs`는 JavaScript에서 URL 쿼리 문자열을 구문 분석하고 문자열화하는 데 사용되는 라이브러리입니다. 
- 이 라이브러리는 복잡한 쿼리 문자열을 쉽게 다룰 수 있도록 도와줍니다.   
- `qs`를 사용하면 쿼리 문자열을 객체로 변환하거나, 객체를 쿼리 문자열로 변환하는 작업을 쉽게 수행할 수 있습니다.  

### `qs.parse`

`qs.parse` 메서드를 사용하여 쿼리 문자열을 JavaScript 객체로 변환할 수 있습니다.

```javascript
const qs = require('qs');
const queryString = 'name=John&age=30&city=New+York';
const parsed = qs.parse(queryString);
console.log(parsed);
// { name: 'John', age: '30', city: 'New York' }
```

### `qs.stringify`  

`qs.stringify` 메서드를 사용하여 JavaScript 객체를 쿼리 문자열로 변환할 수 있습니다.

```javascript
const qs = require('qs');
const obj = {
  name: 'John',
  age: 30,
  city: 'New York'
};
const queryString = qs.stringify(obj);
console.log(queryString);
// name=John&age=30&city=New+York
```

### 고급 사용법

#### 중첩된 객체 처리

`qs`는 중첩된 객체도 처리할 수 있습니다.

```javascript
const qs = require('qs');

const queryString = 'user[name]=John&user[age]=30&user[address][city]=New+York';
const parsed = qs.parse(queryString);

console.log(parsed);
// { user: { name: 'John', age: '30', address: { city: 'New York' } } }
```

#### 배열 처리

`qs`는 배열도 처리할 수 있습니다.

```javascript
const qs = require('qs');

const queryString = 'colors[]=red&colors[]=green&colors[]=blue';
const parsed = qs.parse(queryString);

console.log(parsed);
// { colors: ['red', 'green', 'blue'] }
```

배열을 객체로 변환하는 경우도 `qs.stringify`를 사용하여 가능합니다.

```javascript
const qs = require('qs');

const obj = {
  colors: ['red', 'green', 'blue']
};

const queryString = qs.stringify(obj);
console.log(queryString);
// colors[0]=red&colors[1]=green&colors[2]=blue
```

#### 옵션 사용

`qs`는 다양한 옵션을 지원합니다. 예를 들어, `arrayFormat` 옵션을 사용하여 배열을 다른 형식으로 문자열화할 수 있습니다.

```javascript
const qs = require('qs');

const obj = {
  colors: ['red', 'green', 'blue']
};

const queryString = qs.stringify(obj, { arrayFormat: 'brackets' });
console.log(queryString);
// colors[]=red&colors[]=green&colors[]=blue
```

다른 `arrayFormat` 옵션으로는 `indices`, `repeat`, `comma` 등이 있습니다.

### 옵션을 사용한 파싱

```javascript
const qs = require('qs');

const queryString = 'colors[]=red&colors[]=green&colors[]=blue';
const parsed = qs.parse(queryString, { ignoreQueryPrefix: true });

console.log(parsed);
// { colors: ['red', 'green', 'blue'] }
```

`ignoreQueryPrefix: true` 옵션은 쿼리 문자열의 앞부분에 `?`가 있는 경우 이를 무시합니다.

### TypeScript와 함께 사용하기

`qs`를 TypeScript와 함께 사용할 때는 타입 정의를 추가하면 더 안전하게 사용할 수 있습니다.

```typescript
import qs from 'qs';

const queryString = 'name=John&age=30&city=New+York';
const parsed: Record<string, string> = qs.parse(queryString);
console.log(parsed);
// { name: 'John', age: '30', city: 'New York' }
const obj = {
  name: 'John',
  age: 30,
  city: 'New York'
};

const queryStringified: string = qs.stringify(obj);
console.log(queryStringified);
// name=John&age=30&city=New+York
```

## URLSearchParams  

### URLSearchParams 기본 사용법

`URLSearchParams`는 URL 쿼리 문자열을 쉽게 조작할 수 있도록 해주는 브라우저 내장 객체입니다. 이를 사용하여 쿼리 문자열을 파싱하고, 값을 추가하거나 수정할 수 있습니다. 기본 사용법을 예시를 통해 설명하겠습니다.

#### 1. 쿼리 문자열 파싱

`URLSearchParams` 객체를 사용하여 쿼리 문자열을 파싱하고 값을 추출할 수 있습니다.

```javascript
const queryString = 'name=John&age=30&city=New+York';
const params = new URLSearchParams(queryString);

console.log(params.get('name')); // "John"
console.log(params.get('age'));  // "30"
console.log(params.get('city')); // "New York"
```

#### 2. 쿼리 문자열 생성

객체를 `URLSearchParams` 객체로 변환하여 쿼리 문자열을 쉽게 생성할 수 있습니다.

```javascript
const params = new URLSearchParams();
params.append('name', 'John');
params.append('age', '30');
params.append('city', 'New York');

console.log(params.toString()); // "name=John&age=30&city=New+York"
```

#### 3. 값 추가 및 수정

`URLSearchParams` 객체를 사용하여 쿼리 문자열에 값을 추가하거나 수정할 수 있습니다.

```javascript
const params = new URLSearchParams('name=John&age=30');

// 값 추가
params.append('city', 'New York');
console.log(params.toString()); // "name=John&age=30&city=New+York"

// 값 수정
params.set('name', 'Jane');
console.log(params.toString()); // "name=Jane&age=30&city=New+York"
```

#### 4. 값 삭제

`URLSearchParams` 객체를 사용하여 특정 키의 값을 삭제할 수 있습니다.

```javascript
const params = new URLSearchParams('name=John&age=30&city=New+York');

// 값 삭제
params.delete('age');
console.log(params.toString()); // "name=John&city=New+York"
```

#### 5. 모든 키와 값 반복

`URLSearchParams` 객체의 `forEach` 메서드를 사용하여 모든 키와 값을 반복할 수 있습니다.

```javascript
const params = new URLSearchParams('name=John&age=30&city=New+York');

params.forEach((value, key) => {
  console.log(`${key}: ${value}`);
});
// 출력:
// name: John
// age: 30
// city: New York
```

#### 6. 모든 키 또는 값 얻기

`URLSearchParams` 객체의 `keys` 및 `values` 메서드를 사용하여 모든 키 또는 값을 반복할 수 있습니다.

```javascript
const params = new URLSearchParams('name=John&age=30&city=New+York');

for (const key of params.keys()) {
  console.log(key);
}
// 출력:
// name
// age
// city

for (const value of params.values()) {
  console.log(value);
}
// 출력:
// John
// 30
// New York
```

### 예제: URLSearchParams 사용하여 URL 쿼리 문자열 관리

```javascript
// URL 쿼리 문자열을 파싱하여 객체로 변환
const url = 'https://example.com?name=John&age=30&city=New+York';
const urlParams = new URL(url);
const params = new URLSearchParams(urlParams.search);

console.log(params.get('name')); // "John"
console.log(params.get('age'));  // "30"
console.log(params.get('city')); // "New York"

// 쿼리 문자열에 새로운 값 추가 및 수정
params.append('country', 'USA');
params.set('city', 'Los Angeles');
console.log(params.toString()); // "name=John&age=30&city=Los+Angeles&country=USA"

// 쿼리 문자열에서 특정 값 삭제
params.delete('age');
console.log(params.toString()); // "name=John&city=Los+Angeles&country=USA"

// 새로운 URL 생성
const newUrl = `${urlParams.origin}${urlParams.pathname}?${params.toString()}`;
console.log(newUrl); // "https://example.com?name=John&city=Los+Angeles&country=USA"
```

이 예제에서는 URL 쿼리 문자열을 파싱하고, 값을 추가, 수정 및 삭제하는 방법을 보여줍니다. 또한, 변경된 쿼리 문자열을 사용하여 새로운 URL을 생성하는 방법도 보여줍니다.

`URLSearchParams` 객체는 URL 쿼리 문자열을 관리하는 데 매우 유용하며, 위의 기본 사용법을 통해 쿼리 문자열을 쉽게 조작할 수 있습니다.




### `qs.parse` 구현

`qs.parse`는 쿼리 문자열을 객체로 변환하는 함수입니다. 이 함수는 `URLSearchParams` 인터페이스를 사용하여 쿼리 문자열을 파싱할 수 있습니다.

```javascript
function parse(queryString) {
  const query = {};
  const pairs = queryString.replace(/^\?/, '').split('&');

  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (!key) continue;

    const decodedKey = decodeURIComponent(key);
    const decodedValue = value ? decodeURIComponent(value) : '';

    if (query[decodedKey]) {
      if (Array.isArray(query[decodedKey])) {
        query[decodedKey].push(decodedValue);
      } else {
        query[decodedKey] = [query[decodedKey], decodedValue];
      }
    } else {
      query[decodedKey] = decodedValue;
    }
  }

  return query;
}

// 테스트
const queryString = 'name=John&age=30&city=New+York';
console.log(parse(queryString));
// { name: 'John', age: '30', city: 'New York' }

const nestedQueryString = 'user[name]=John&user[age]=30&user[address][city]=New+York';
console.log(parse(nestedQueryString));
// { 'user[name]': 'John', 'user[age]': '30', 'user[address][city]': 'New York' }
```

### `qs.stringify` 구현

`qs.stringify`는 객체를 쿼리 문자열로 변환하는 함수입니다. 이를 구현하기 위해 재귀를 사용하여 중첩된 객체를 처리할 수 있습니다.

```javascript
function stringify(obj, prefix) {
  const pairs = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const fullKey = prefix ? `${prefix}[${key}]` : key;

      if (value && typeof value === 'object') {
        pairs.push(stringify(value, fullKey));
      } else {
        pairs.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(value)}`);
      }
    }
  }

  return pairs.join('&');
}

// 테스트
const obj = {
  name: 'John',
  age: 30,
  city: 'New York'
};
console.log(stringify(obj));
// name=John&age=30&city=New+York

const nestedObj = {
  user: {
    name: 'John',
    age: 30,
    address: {
      city: 'New York'
    }
  }
};
console.log(stringify(nestedObj));
// user[name]=John&user[age]=30&user[address][city]=New+York
```

### 설명

#### `qs.parse` 구현 설명
- `queryString.replace(/^\?/, '').split('&')`는 쿼리 문자열의 앞부분에 `?`가 있는 경우 이를 제거하고 `&`로 분리하여 쌍의 배열을 만듭니다.
- 각 쌍을 `=`로 분리하여 키와 값을 구합니다.
- `decodeURIComponent`를 사용하여 URI 인코딩된 키와 값을 디코딩합니다.
- 중복된 키가 있는 경우, 값을 배열로 관리합니다.

#### `qs.stringify` 구현 설명
- 객체의 각 키와 값을 순회합니다.
- 값이 객체인 경우, 재귀적으로 `stringify` 함수를 호출하여 중첩된 쿼리 문자열을 생성합니다.
- 값을 인코딩하고 키와 값 쌍을 `=`로 연결합니다.
- 최종적으로 `&`로 연결된 쿼리 문자열을 반환합니다.

이 두 함수는 `qs` 라이브러리의 기본적인 `parse`와 `stringify` 기능을 간단히 구현한 것입니다. 복잡한 쿼리 문자열이나 객체를 다루기 위해서는 추가적인 로직이 필요할 수 있습니다.