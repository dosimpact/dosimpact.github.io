---
sidebar_position: 1
---

# Remeda 1    

- [Remeda 1](#remeda-1)
  - [Remeda란?](#remeda란)
  - [Basic](#basic)


## Remeda란?
- **타입 안전(Type-safe)**을 최우선으로 설계된 JavaScript/TypeScript 유틸리티 함수 모음
- Lodash/Ramda와 비슷하지만, TypeScript 친화도가 훨씬 높습니다.
- 불변(immutable) 데이터 처리에 유용한 함수들을 제공 → 기존 객체/배열을 변경하지 않고 새 값 반환.
- FP 스타일	pipe, compose 등 함수형 프로그래밍 흐름 지원
- Tree-shaking 친화	필요한 함수만 개별 import 가능 → 번들 크기 절감


📌 lodash-es / Remeda와의 차이점

- Remeda와의 : 새로운 FP 스타일을 도입해도 무방, TS 친화도 중시


## Basic  

```js
// pipe
import { pipe, filter, map, take } from 'remeda';

const result = pipe(
  [1, 2, 3, 4, 5],
  filter(n => n % 2 === 0),
  map(n => n * 10),
  take(2)
); 
// [20, 40]
 - pipe는 첫 번째 인자를 다음 함수에 순서대로 넘겨줍니다.
 - 각 단계에서 타입을 잃지 않음.

// 3.2 객체 유틸
import { values, pick, omit, mapValues } from 'remeda';

const obj = { a: 1, b: 2, c: 3 };

values(obj); // [1, 2, 3]
pick(obj, ['a', 'b']); // { a: 1, b: 2 }
omit(obj, ['c']); // { a: 1, b: 2 }
mapValues(obj, v => v * 2); // { a: 2, b: 4, c: 6 }


// 3.3 배열 유틸
import { uniq, groupBy } from 'remeda';

uniq([1, 2, 2, 3]); // [1, 2, 3]
groupBy(
  ['apple', 'banana', 'avocado'],
  fruit => fruit[0] // a로 시작한느 것
);
// { a: ['apple', 'avocado'], b: ['banana'] }

// 3.4 조건/타입 유틸
import { isNullish, isEmpty } from 'remeda';

isNullish(null); // true
isNullish(undefined); // true
isEmpty([]); // true
isEmpty({}); // true

