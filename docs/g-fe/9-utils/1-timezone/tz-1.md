---
sidebar_position: 1
---

# Timezone 설정에 대한 가이드라인  

- [Timezone 설정에 대한 가이드라인](#timezone-설정에-대한-가이드라인)
  - [1.시간 객체에 대해서 유닉스 타임 스템프가 고정되어 있는가?](#1시간-객체에-대해서-유닉스-타임-스템프가-고정되어-있는가)
  - [2.각 모듈별로 타임존 설정 어떻게 하는지 코드 수준에서 필요.](#2각-모듈별로-타임존-설정-어떻게-하는지-코드-수준에서-필요)
  - [추가 고려 사항](#추가-고려-사항)


글로벌 서비스를 만들면 시간에 대해서 잘 고려해서 다루어야 한다.  
- 시간에 대한 절대값 개념  
- 시간에 대한 상대적 표현 개념  
- 시간에 대한 해석 

위 3가지가 주요 컨셉이다.  


## 1.시간 객체에 대해서 유닉스 타임 스템프가 고정되어 있는가?  

📌 시간의 절대값은 유닉스 타임 스템프이다.  
- 유닉스 타임 스탬프 : 1970년 1월 1일 00:00:00 협정 세계시(UTC)부터 현재까지 경과된 시간을 초(second) 단위로 나타낸 정수  
- 유닉스 타임 스템프 고정 전과 후로 나누어서 생각하면 편하다.    
- 절대값이 고정되면 로컬 브라우저의 타임존에 맞게 표기하는 문제로 넘어갈 수 있다.  

📌 예) 대만 서비스를 진행하는 상황을 가정.  

절대값 : 2025-10-14 07:00 (GMT+0)은 고정된 상태의 시간 객체를 다룬다고 생각해보자.  

1.사용자-facing 화면
- 당연히 대만 사용자에게는 본인의 시간대인 UTC+8 기준으로 표기한다.  
  - → 예: 2025-10-14 15:00 (GMT+8) 

2.운영자-facing 화면 (Admin, Dashboard 등)   

문제는 운영자 화면에서 어떻게 표기 할 것인가? 

선택지 1. 내부 운영 효율을 위해 대만 사용자가 보는 그대로 표기한다.  
  - 브라우저의 로컬 시간대는 UTC+9이지만, 강제로 UTC+8로(사업하는 곳의 현지시간) 변경하여 처리한다.  

선택지 2. 접속한 사용자의 브라우저의 시간대에 맞추어서 표기한다.  
  - 장점은 KST 로컬 사용자의 입장에서 시간대를 고려해서 표기가 가능하다.  
  - 예를들어 대만에서는 아침 12시부터 가게가 오픈하는데, 한국시간 기준으로 보면 13시인 상황이다.  
  - 사용자 경험에서 현지 사업장 기준으로 생각하니, 대만 지점 영업 시작: 12:00 (NST). (13:00 KST) 으로 2개 표기도 방법 이겠다.  

선택지 3. 타임존 변경 옵션을 주기  
  - 보통 에이전시 등 해외에서 현지의 사업을 관리한다면 기본적으로 로컬 타임존으로 표기하되, 변경 옵션을 주는것도 좋겠다.  
  - 표기는 현지 시간 표기 + 로컬 브라우저 타임존 시간 표기 2가지 진행 ( Localization + Clarity 충족 )


## 2.각 모듈별로 타임존 설정 어떻게 하는지 코드 수준에서 필요.  

1.현재 타임을 생성하는 로직  
- 현재 시간을 생성하면 시간의 절대값은 모두 동일하다, 어떤 타임존으로 `표기` 의 문제  

2.타임을 해석(생성)하는 로직    
- 매우 중요하다.  
- 특히나 타임존 정보가 없는 시간정보를 해석할때 무엇으로 해석하느냐에 따라서 시간 버그가 발생할 수 있다.  
- 2.1 타임존이 있는 경우
  - '2025-10-23T14:30:06.117Z' 처럼 타임존 정보가 포함된 문자열은 알아서 처리 된다.  
- 2.2 타임존이 없는 경우
  - '2025-10-23 14:30:06' 처럼 타임존 정보가 없다면 이를 UTC+9로 해석할지 설정을 해야 한다.    
  - 자주 발생하는 버그케이스
    - 서버에서 UTC+0으로 저장된 문자열 '2025-10-23 14:30:06'을 브라우저에서 받고, 이를 UTC+0이 아닌, 로컬 타임존으로 해석하는 경우.  

3.현재 타임을 표기하는 로직     
- 기본 : 로컬 브라우저의 타임존에 맞게 표기.  

```ts
import dayjs, { type Dayjs } from 'dayjs';

import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
// 타임존 없는 문자열을 특정 포맷으로 해석(parse)하기 위해 필요합니다.
dayjs.extend(customParseFormat); 

// 현지 사업장 타임존 설정 (예시: Asia/Taipei)
const TIMEZONE = 'Asia/Taipei';

// dayjs는 여러 포맷을 배열로 받으면 순서대로 파싱을 시도합니다.
const DATE_FORMATS = [
  'YYYY-MM-DD HH:mm:ss', // "2020-12-20 15:15:12"
  'YYYY-MM-DD',         // "2020-12-20"
];

type DayjsInput = string | number | Date | Dayjs | null | undefined;

/**
 * 마켓 설정에 따른 타임존을 적용한 Dayjs 객체를 반환합니다.
 * 타임존 정보가 없는 문자열은 'Asia/Taipei'를 기준으로 해석합니다.
 *
 * @param date - dayjs 생성자에 전달할 인자 (날짜/시간 문자열, Date 객체, Unix timestamp 등)
 * @returns 타임존이 적용된 Dayjs 객체
 */
export function dayjsTz(date?: DayjsInput): Dayjs {
  const timezone = TIMEZONE as string | undefined;

  // 타임존 설정이 없는 경우 (로컬 또는 기본 설정 사용)
  if (!timezone) {
    return dayjs(date);
  }

  // 1) 인자 없음 또는 null/undefined: 현재 시각을 마켓 타임존으로 표시
  if (date === undefined || date === null) {
    return dayjs().tz(timezone);
  }

  // 2) 문자열 인자 처리
  if (typeof date === 'string') {
    // 타임존 정보가 포함된 문자열인지 확인 (Z, GMT, +09:00 등이 포함된 ISO/GMT 문자열)
    // 이 경우, dayjs는 문자열을 UTC로 해석 후 tz()를 통해 TIMEZONE으로 변환합니다.
    if (/(Z|[+-]\d{2}(:?\d{2})?|GMT)/i.test(date)) {
      return dayjs.tz(date, timezone);
    }
    
    // 타임존 정보가 없는 문자열 ("2020-12-20", "2020-12-20 15:15:12" 등)
    // - dayjs.tz(string, formats, timezone)를 사용하여 해당 타임존 기준으로 해석(parse)합니다.
    // - customParseFormat 플러그인이 필요합니다.
    return dayjs.tz(date, DATE_FORMATS, timezone);
  }

  // 3) Date 객체, Dayjs 객체, 숫자 (timestamp) 등의 인자 처리
  // - dayjs로 생성 후 .tz()를 적용하여 해당 타임존으로 변환합니다.
  return dayjs(date).tz(timezone);
}



/**
 * UTC 기준 시간 문자열을 지정된 타임존으로 변환합니다.
 * @param {string|Date} createdAt - UTC 기준 시간 (ISO 문자열 또는 Date 객체)
 * @param {string} timeZone - 변환할 타임존 (기본값: 'Asia/Seoul')
 * @returns {dayjs.Dayjs} - 타임존이 적용된 Day.js 객체
 */
function interpretAsUTC(createdAt, timeZone = 'Asia/Seoul') {
  return dayjs.utc(createdAt).tz(timeZone);
}


/**
 * 로컬 타임존 기준 시간 문자열을 지정된 타임존으로 변환합니다.
 * @param {string|Date} createdAt - 로컬 타임존 기준 시간 (ISO 문자열 또는 Date 객체)
 * @param {string} timeZone - 변환할 타임존 (기본값: 'Asia/Seoul')
 * @returns {dayjs.Dayjs} - 타임존이 적용된 Day.js 객체
 */
function interpretAsTimezone(createdAt, timeZone = 'Asia/Seoul') {
  return dayjs(createdAt).tz(timeZone);
}

```

## 추가 고려 사항

커스텀 Timezone 처리  
- 커스텀 처리 할 Timezone 변수를 데이터 패칭 이후 External Store Sync에 대한 타이밍 이슈가 굉장히 중요.  

캘린더 정책 
- AntD 는 moment객체를 사용하는데 moment.tz()의 타임존에 따라서 표기되는 캘린더의 UI가 달라진다.  
- 사용자 표기 타임존에 대한 정책도 필요하다.  

