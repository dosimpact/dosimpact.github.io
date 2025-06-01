---
sidebar_position: 3
---

# Dir - 디렉터리 추상화    

## 응집도/결합도 관점에서 본 디렉터리 추상화    

>“개발자가 어떤 기능을 쓸 때 모든 내부 코드를 보지 않고, 
>핵심 인터페이스나 함수만 보면 사용할 수 있도록 한다.”  


```js

1. 배럴 파일(index.ts)을 최상위 인터페이스로 삼기  
- index.ts만 보면 전체 기능의 진입점과 핵심 기능이 보이도록 구성  
// src/features/user/index.ts
export * from './api';      // userApi
export * from './types';    // User, UserId
export * from './hooks';    // useUser, useUserList

2. 기능별 디렉토리 구조로 명확하게 분리  
src/features/user/
├── api.ts            // API 호출
├── hooks.ts          // React hook들
├── types.ts          // 타입 정의
├── utils.ts          // 내부 유틸
├── constants.ts      // 상수
└── index.ts          // 배럴 파일

3. 의도적으로 export 범위 제한  
// ❌ 좋지 않은 방식
// src/features/user/api.ts
export const fetchUser = ...

// ✅ 좋은 방식
// src/features/user/api.ts
const fetchUser = ...
export { fetchUser };

// 그리고 index.ts에서
export { fetchUser } from './api';  

3.1 명명 규칙으로 일관성 유지  
	•	useUser, fetchUser, User, UserId → 기능 중심으로 통일
	•	사용자가 추론하기 쉽게 네이밍  

3.2 export 의 Level를 생각하기.  
src/
└── features/
    └── user/
        ├── api               # 내부용
        ├── hooks             # 내부 + 외부
        ├── types             # 외부 (정의용)
        ├── constants         # 내부
        ├── utils             # 내부
        ├── components/       # 내부 전용 UI 컴포넌트들
        └── index.ts          # ✨ 외부에 노출할 public API만 export


Case 1. Internal exports : feature `내` 구성요소 간 공유 *.ts
- features/api/auth.ts, features/api/auth.ts

Case 2. Public exports : feature `간` 사용할 API만 노출 
- features/api/index.ts

Case 3. Feature-level re-export  : feature `외부`, 앱 전체에서 사용 가능하도록 공개 (app-level barrel) 
- features/index.ts


```

