---
sidebar_position: 1  
---

# Design System Intro #20

## 기술적 고려사항  

### CSS 격리가 필요한가?   

📕 목적  
디자인 시스템 컴포넌트를 제작하면 여러 프로젝트에 온보딩 된다.  
- 각 프로젝트에서 css 충돌이 발생하지 않게 고려해야 한다.  

📕 CSS격리 ( Tailwind CSS 기준 )  

CSS 격리란?  
- prefix classname을 붙이는 등의 방법으로 브라우저 내 CSS간의 충돌을 회피한다.  
- 특히나 마이크로 프론트앱 환경에서 발생할 가능성이 높으며, 반드시 고려해야 하는 사항이다.  

```
@tailwind base; // TailwindCSS에서 제공해주는 normalize.css 이다.  
@tailwind components; // 컴포넌트 클래스, my-button-primary 등   
@tailwind utilities; // 유틸리티 클래스 text-gray-500 등    
```

1.base css의 격리  
- https://tailwindcss.com/docs/preflight  
- 각 호스트 프로젝트에서는 이미 reset css, normalize css 를 사용할 가능성이 높다.  

Option1. 라이브러리 컴파일 단계 > normalize css 제외하기  
  - tailwind css 에서 preflight는 사전비행의 의미로 css 사전 작업을 의미한다.  
  - https://github.com/tailwindlabs/tailwindcss/blob/main/packages/tailwindcss/preflight.css  
  - preflight false 옵션으로 normalize css는 번들에 포함시키지 않고 index.css 컴파일 한다.  

Option2. 라이브러리 컴파일 단계 > preflight 에 prefix className 붙이기  
  - tailwindcss-scoped-preflight 플러그인 사용으로 가능하다.  
  - https://github.com/Roman86/tailwindcss-scoped-preflight/blob/main/src/strategies.ts

Option3. 호스트 프로젝트 컴파일 단계 > postcss로 격리하기 
  - 마이크로 프론트 엔드 환경이면 상황이 복잡하다.  
  - 모듈 의존성 : Container App <-- Host App <-- Tailwind CSS UI Lib   
    - Container App 에서 이미 global normalize css 가 있을 가능성이 높다.  
    - Host app에서 CSS 컴파일 격리를 수행해야 한다.  
  - 방법 : postcss-prefix-selector  
  - 단점 : Antd 처럼 이미 prefix가 붙은 경우도 재격리 될 수 있음.  


단일 프로젝트의 경우 : 
마이크로 프론트엔드의 경우 : 
