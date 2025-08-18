---
sidebar_position: 13
---

# Layout - Z Index  

## 레아이웃 컴포넌트의 역할  

문제점 : page 가 거대해지면 여러가지 이슈가 존재한다.  
- 툴팁, 팝오버, 모달, 모달의 툴팁, 팝오버의 툴팁 등 복잡함 > 모달의 팝오버의 툴팁이 모달 뒤로 가는 현상 > z-index 이슈  
- 1px 옮겨주세요 등의 전체 레아이웃 수정 이슈.    
- Floating Icon, Sticky Icon 등 이슈.    

위 경우에는 Layout을 별도로 컴포넌트화 해서 관리하는게 좋다.  

## Stack context

https://play.tailwindcss.com/378SjIABex?size=504x720  

z-index는 Stack context 유효범위가 있다.  
- 새로운 Stack context가 만들어지면 해당 스코프 내에서만 작동한다.  
- 예측 불가능한 레이아웃을 방지하기 위함이다.!   

Stack context 생성 조건  
-  z-index가 auto가 아닌 position 속성(relative, absolute, fixed, sticky)   
-  아래 코드는 3개의 Stack context가 만들어진다.   

```html
<!-- z index, stacking context 문제 -->
<!-- 
스태킹 컨텍스트의 생성 조건
  * z-index가 auto가 아닌 position 속성(relative, absolute, fixed, sticky) 
  * 아래 코드는 3개의 Stack context가 만들어진다.  
-->

<!-- Stack context 30과 20의 대결 (z-20 영역내에서만 유효, z-50은 영향없음)  -->
<div class="relative h-48 w-full">
  <div class="absolute top-10 left-20 z-30 h-32 w-48 bg-gray-400 p-2">Stack context (z-30)</div>

  <div class="absolute top-0 left-0 z-20 h-full w-full bg-blue-200/50 opacity-90">
    <div class="relative top-5 left-5 z-50 h-32 w-48 bg-green-300 p-2">Stack context (z-50) / 회색 박스 뒤에 있음</div>
  </div>
</div>

<!-- Stack context 30과 40의 대결에서 2번째 Stack이 높음. (z-50은 영향없음)  -->
<div class="relative mt-2 h-48 w-full">
  <div class="absolute top-10 left-20 z-30 h-32 w-48 bg-gray-400 p-2">Stack context (z-30)</div>

  <div class="absolute top-0 left-0 z-40 h-full w-full bg-blue-200/50 opacity-90">
    <div class="relative top-5 left-5 z-50 h-32 w-48 bg-green-300 p-2">Stack context (z-50) / 이제 회색 박스 위에 있음</div>
  </div>
</div>

```