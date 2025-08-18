---
sidebar_position: 1
---

# 2. Block   

- [2. Block](#2-block)
  - [🔥 Outter Css](#-outter-css)
  - [eg) 마진 병합](#eg-마진-병합)
  - [🔥 Inner Css](#-inner-css)
  - [100vh vs 100dvh](#100vh-vs-100dvh)


## 🔥 Outter Css

## eg) 마진 병합

마진 병합 (Margin Collapsing)  
- 설명: 세로로 인접한 block 요소의 마진은 합쳐집니다. 위 요소의 하단 마진과 아래 요소의 상단 마진 중 더 큰 값 하나만 적용됩니다.

```html
<div class="border border-red-500 p-2">
  <div class="mb-8 h-16 bg-sky-200"></div>
  <div class="mt-8 h-16 bg-sky-200"></div>
</div>


<div class="flex flex-col border border-red-500 p-2">
  <div class="mb-8 h-16 bg-emerald-200"></div>
  <div class="mt-8 h-16 bg-emerald-200"></div>
</div>
```

## 🔥 Inner Css

## 100vh vs 100dvh


100vh  
- 현재 뷰포트의 높이 기준으로 높이가 설정 ( 뷰포트 = 주소창, 툴바 제외 영역 )  
- 문제점 : 모바일 브라우저에서 스크롤을 내리면 주소창이나 툴바가 사라진다.  

100dvh  
- 주소창이 사라지면 `100dvh`의 값은 **새로 커진 뷰포트의 높이에 맞춰 실시간으로 변경**  
- 모바일 환경에서 깜빡임 없이 레이아웃 유지 가능  

