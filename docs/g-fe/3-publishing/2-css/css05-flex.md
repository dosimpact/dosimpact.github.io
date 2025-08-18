---
sidebar_position: 5
---

# Flex  


## flex-1(flex-basis:auto) vs flex-basis:0%  

https://play.tailwindcss.com/6L2SrR6lhC?size=390x720

```html
<!-- flex-1(flex-basis:auto) vs flex-basis:0% -->
<!-- 기본값 : 0 1 auto  -->
<!-- 1 1 auto : 기본 너비에 따라서 나눠 가진다. -->
<div class="flex">
  <div class="grow-[1] bg-emerald-200 p-4">Hello</div>
  <div class="grow-[1] bg-blue-200 p-4">Hello World</div>
</div>
<!-- 1 1 0% : 모든 요소가 공평하게 영역을 가진다. -->
<div class="flex">
  <div class="flex-1 bg-emerald-200 p-4">Hello</div>
  <div class="flex-1 bg-blue-200 p-4">Hello World</div>
</div>
```
