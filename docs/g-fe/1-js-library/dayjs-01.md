---
sidebar_position: 1
---

# dayjs - javascript 날짜,시간 조작 기본 사용법

<head>
  <meta name="keywords" content="dayjs"/>
</head>

- [dayjs - javascript 날짜,시간 조작 기본 사용법](#dayjs---javascript-날짜시간-조작-기본-사용법)
  - [install](#install)
  - [moment.js 대신 dayjs를 사용해야 하는 이유](#momentjs-대신-dayjs를-사용해야-하는-이유)
  - [기본 사용법](#기본-사용법)
    - [](#)
    - [format](#format)
    - [](#-1)
  - [timezone 다루기](#timezone-다루기)
  - [ref](#ref)



## install

```js
npm i dayjs
npm i dayjs-plugin-utc
```

## moment.js 대신 dayjs를 사용해야 하는 이유

- moment는 불변성을 지키지 않으므로 예상치 못한 동작
- 더이상 업데이트 하지 않는다.
- JS 용량이 크며, 트리쉐이킹이 안된다.
- moment 와 사용법이 비슷해, 마이그레이션이 쉽다. 


## 기본 사용법

###
```
console.log(dayjs());
console.log(dayjs().valueOf());
console.log(dayjs().toISOString());
console.log(dayjs().format("YYYY-MM-DD HH:mm:ss"));
console.log(dayjs().utcOffset());
```

### format
```
console.log(dayjs(1698210631000).format("YYYY MM DD HH:mm:ss")); // 14시는 14시로 표현
console.log(dayjs(1698210631000).format("YYYY MM DD hh:mm:ss")); // 14시는 2시로 표현
```
### 

## timezone 다루기

```
## utc 플러그인
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);




## 현재의 타임존 
// 
date: dayjs(String(date), 'YYYYMMDD').format('YYYY.MM.DD'),


## unix epoch -> dayjs
console.log(dayjs(1698210631000).format("YYYY MM DD HH:mm:ss"));


## utc로 변환
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

// default local time
console.log(dayjs().format());
console.log(dayjs().format("YYYYMMDD HH:mm:ss")); // 20231030 13:16:10

// UTC mode
console.log(dayjs.utc().format()); // 2019-03-06T09:11:55Z
console.log(dayjs.utc().format("YYYYMMDD HH:mm:ss")); // 2019-03-06T09:11:55Z


// redirect 처리
- how to handle redirect server spec 

```

## ref
- [https://day.js.org/](https://day.js.org/)
- [https://stickode.tistory.com/668](https://stickode.tistory.com/668)