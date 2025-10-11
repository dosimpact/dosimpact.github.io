---
sidebar_position: 1
---

# dayjs 

- [dayjs](#dayjs)
  - [install](#install)
  - [moment.js 대신 dayjs를 사용해야 하는 이유](#momentjs-대신-dayjs를-사용해야-하는-이유)
  - [기본 사용법](#기본-사용법)
    - [](#)
    - [format](#format)
  - [timezone 다루기](#timezone-다루기)
  - [ref](#ref)



## install

```
npm i dayjs
```

```js
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// Day.js에는 기본 타임존을 전역적으로 설정하는 별도의 API는 없으나, dayjs.tz.setDefault() 함수를 사용하여 이후 dayjs.tz() 호출 시 타임존 인수를 생략할 수 있게 만들 수 있습니다.
dayjs.tz.setDefault('Asia/Seoul');

export default dayjs;

---
// 가정 : 현재시간 2025년 10월 10일 15시 35분 53초 KST 기준

// [생성자]  
// 1. 타임존이 포함된 경우 -> dayjs() 사용  
const case1 = dayjs('Fri Oct 10 2025 15:24:44 GMT+0900 (한국 표준시)');  
case1.format('YYYY년 M월 D일 HH시 mm분 ss초'); // 2025년 10월 10일 15시 35분 53초  

// 2. 타임존을 없는 경우 (혹은 무시하는 경우) -> dayjs.tz() 사용  

// 문자열을 UTC로 파싱 후  Asia/Seoul 타임존으로 변환
const case2 = dayjs.tz('Fri Oct 10 2025 15:24:44 GMT+0900 (한국 표준시)');
case2.format('YYYY년 M월 D일 HH시 mm분 ss초'); // 2025년 10월 10일 06시 35분 53초

// [출력]
// 3.출력은 상관없이 진행된다.
// - dayjs() : 로컬 머신의 타임존
// - dayjs.tz() : 설정된 타임존으로 변환
dayjs().format('YYYY년 M월 D일 HH시 mm분 ss초'); // 2025년 10월 10일 15시 35분 53초
dayjs.tz().format('YYYY년 M월 D일 HH시 mm분 ss초'); // 2025년 10월 10일 15시 35분 53초

// dayjs.tz.setDefault('Europe/London');
dayjs().format('YYYY년 M월 D일 HH시 mm분 ss초'); // 2025년 10월 10일 15시 35분 53초
dayjs.tz().format('YYYY년 M월 D일 HH시 mm분 ss초'); // 2025년 10월 10일 07시 35분 53초
```

## moment.js 대신 dayjs를 사용해야 하는 이유

- moment는 불변성을 지키지 않으므로 예상치 못한 동작
- 더이상 업데이트 하지 않는다.
- JS 용량이 크며, 트리쉐이킹이 안된다.
- moment 와 사용법이 비슷해, 마이그레이션이 쉽다. 


## 기본 사용법

### 
```
dayjs();
dayjs().valueOf();
dayjs().toISOString();
dayjs().utcOffset();
```

### format
```
// https://day.js.org/docs/en/display/format
dayjs().format("YYYY-MM-DD HH:mm:ss"); //  2025-03-03 03:05:03
dayjs().format("YYYY년 M월 D일 H시 m분 s초"); //  2025년 3월 3일 3시 5분 3초  

dayjs(1698210631000).format("YYYY MM DD HH:mm:ss"); // 14시는 14시로 표현
dayjs(1698210631000).format("YYYY MM DD hh:mm:ss"); // 14시는 2시로 표현
```

## timezone 다루기

```js
// utc 플러그인
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// 현재의 타임존 
// date: dayjs(String(date), 'YYYYMMDD').format('YYYY.MM.DD'),

// unix epoch -> dayjs
dayjs(1698210631000).format("YYYY MM DD HH:mm:ss");

// utc로 변환
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

// default local time
dayjs().format();
dayjs().format("YYYYMMDD HH:mm:ss"); // 20231030 13:16:10

// UTC mode
dayjs.utc().format(); // 2019-03-06T09:11:55Z
dayjs.utc().format("YYYYMMDD HH:mm:ss"); // 2019-03-06T09:11:55Z

```

## ref
- [https://day.js.org/](https://day.js.org/)
- [https://stickode.tistory.com/668](https://stickode.tistory.com/668)