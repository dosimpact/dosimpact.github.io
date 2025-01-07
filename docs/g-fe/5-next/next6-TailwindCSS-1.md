---
sidebar_position: 6
---

# Next + TailwindCSS

- [Next + TailwindCSS](#next--tailwindcss)
  - [playground](#playground)
    - [📌 CSS 작성 규칙](#-css-작성-규칙)
  - [1.단위체계](#1단위체계)
  - [2.bg, border, border-color, rounded](#2bg-border-border-color-rounded)
    - [bg-gradient-to-t from-black](#bg-gradient-to-t-from-black)
  - [3.w, h, p, m](#3w-h-p-m)
  - [4.text-color, text-size, font-bold, cursor](#4text-color-text-size-font-bold-cursor)
  - [5.flex, flex-col, justify, items, gap](#5flex-flex-col-justify-items-gap)
  - [6.hover, transition, :disabled](#6hover-transition-disabled)
  - [position, transform, translate](#position-transform-translate)
  - [📌 반응형 UI만드는 방법](#-반응형-ui만드는-방법)
    - [Responsive Design](#responsive-design)
  - [overflow](#overflow)
  - [group](#group)
  - [backdrop-filter](#backdrop-filter)
  - [twMerge](#twmerge)
  - [etc](#etc)
    - [text underline](#text-underline)
    - [text truncate](#text-truncate)
    - [color-scheme](#color-scheme)
  - [📌 Theme](#-theme)

## playground

아래 사이트에서 연습이 가능하다.  
- https://play.tailwindcss.com/  


### 📌 CSS 작성 규칙    

작성 순서  
- 외부 레아웃에서 내부로 이동 스타일을 결정한다.  
  - 0.relative, absolute : 외부 레이아웃
  - ---
  - 1.w,h,p,m : 박스모델 만들기   
  - 2.flex : 내부 레이아웃    
  - 3.bg, border, rounded : 박스 모델 스타일   
  - 4.text, font, cursor : 콘텐츠 스타일    
  - 5.hover : 가상 클래스 작업    


## 1.단위체계

tailwind css 에서는 rem 단위를 사용한다.  
- 1은 0.25 rem, 4는 1rem 이다. 
- 디폴트 값으로 1rem은 16px이다. 
- 고정된 px단위도 사용 가능하다.  

```js
# gap-1 은 0.25rem 만큼 떨어진다. 
# px단위는 []을 이용해서 사용한다.  
<div class="flex flex-row gap-1 gap-[5px]">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>

```

## 2.bg, border, border-color, rounded

```js
className="bg-red-200"
className="bg-red-200 bg-opacity-50"
className="border border-solid border-red-300"
className="border-2 border-red-300"
className="rounded-full"
className="border border-transparent rounded-full"
className="cursor-pointer rounded-full hover:opacity-75 transition"

eg)
<div class="h-40 w-40 cursor-pointer rounded-full border border-transparent bg-red-200 transition-colors hover:bg-red-300"></div>

```
### bg-gradient-to-t from-black

```js
className="w-full h-full absolute top-0 bg-gradient-to-t from-black"
```

## 3.w, h, p, m 

```js
# extrinsic 
className="h-auto h-5 h-[40px]"
# intrinsic - 내부 요소에 의해 크기 결정
className="h-fit h-min h-max"
className="w-auto w-full w-5 w-[40px]"
className="p-8 p-[40px] px-8 py-8"
className="m-8 m-[40px] mx-8 my-8"
```

## 4.text-color, text-size, font-bold, cursor

```js
# color
className="text-green-500"

# font-size (text-sm, text-md, text-lg..)
className="text-sm text-md text-2xl text-[50px]"

# weight, font-bold(700)
className="font-medium font-[500] font-bold font-[700]"

className="cursor-pointer"
```

## 5.flex, flex-col, justify, items, gap

```js
# display:flex
className="flex"

# justify-content(main-axis)
className="flex justify-between"

# align-items(cross-axis)
className="flex items-center"

# direction
className="flex flex-row"
className="flex flex-col"

# gap
className="flex flex-col gap-y-4"

# flex:1 1 0%
className="flex flex-1"

# eg)
<div class="flex flex-row items-center justify-between gap-[5px]">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
```


## 6.hover, transition, :disabled

```js
className="transition"
className="hover:text-white"
className="disabled:cursor-not-allowed disabled:opacity-50"
```

## position, transform, translate

```js
// 중앙 정렬을 수행 한다.  
<div
  className="absolute
  right-[0px] top-[50%] transform -translate-x-1/2 -translate-y-1/2"
>
  <PiWarningCircleLight color="#EE4700" size={16} />
</div>
```


## 📌 반응형 UI만드는 방법  

https://tailwindcss.com/docs/responsive-design
- UI는 Mobile우선 작업을 한다. 그리고 PC로 확장을 한다.   
- Mobile에서 구동 가능한 화면은 PC에서 볼 수 있지만 반대의 경우는 그렇지 않다.  

```js
# md:hidden : @media (min-width: 768px) { ... }
- 최소 768px 이상의 너비를 가진 화면이라면,(예 PC) 작동하는 로직
- 모바일을 기준으로 작업을한다. 모바일에서 보이는건 PC에서 보이지만 반대의 경우에는 그렇진 않기 떄문.  

# type1 - mobile 보여주다가, PC 숨긴다.
className="flex md:hidden gap-x-2 items-center"


# type2 - PC에서 보여주다가, mobile의 경우 숨긴다.
className="hidden md:flex gap-x-2 items-center"

```

### Responsive Design


>> https://tailwindcss.com/docs/responsive-design
>> https://tailwindcss.com/docs/screens

```
Breakpoint prefix	Minimum width	CSS

sm	640px	@media (min-width: 640px) { ... } -- ~ 640px 모바일로 잡기 (breakpoint1)  
md	768px	@media (min-width: 768px) { ... } 
lg	1024px	@media (min-width: 1024px) { ... } -- 테블릿 (breakpoint2)
xl	1280px	@media (min-width: 1280px) { ... }
2xl	1536px	@media (min-width: 1536px) { ... }

참고: youtube music
- 0 - 615px : mobile 대응 
- 615px - 935px : mobile 대응, 일부 UI는 더 보임(예 - sidebar)
– 935px ~ max :  PC 대응

```

![Alt text](image.png)


## overflow

```js
# 평소에는 스크롤이 없다가, 오버플로 발생시 스크롤이 나온다.
className="overflow-y-auto"
```

## group

- group 이라는 classname
- 부모 선택자 (group), 부모 요소에 hover할 떄 자식요소들이 반응할 수 있다.  

https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-parent-state


## backdrop-filter

```js
# backdrop-filter: blur(10px);
# position: absolute; inset: 10px 20px 30px 40px;
className="bg-neutral-900/90 backdrop-blur-sm fixed inset-0"
```

## twMerge

React, NextJS에서 사용한다.  
- 조건에 따라 선택적으로 className을 넣을 수 있다.  

```js
import { twMerge } from "tailwind-merge";
className={twMerge(``,active && "text-white")}
```

## etc

### text underline

```js
<Link
  className="underline underline-offset-4"
  href="https://github.com/vercel/ai-chatbot"
  target="_blank">
open source</Link>
```

### text truncate

```js
    <Link
      href={href}
      className={twMerge(
        `flex flex-row items-center gap-x-4 
      h-auto w-full py-1 
      text-md text-neutral-400 font-medium cursor-pointer
      hover:text-white transition`,
        active && "text-white"
      )}
    >
      <Icon size={26} />
      <p className="w-100 truncate">{label}</p>
    </Link>
```

### color-scheme

```
html,body,:root{
  height: 100%;
  background-color: black;
  color-scheme: dark;
}
```

## 📌 Theme

>https://ui.shadcn.com/themes   

1.shadcn의 장점중 하나는 테마를 설정할 수 있다.  
- global.css 에서 css variable로 테마 색상을 변경가능.    

2.tailwind는 레이어 디렉티브 개념을 사용한다. `예, @layer base `    
- CSS 파일 어디든 작성해도 `적용 우선 순위` 보장.  

2.1 Tailwind의 레이어 우선순위  
	1.	Base: 기본 스타일 (HTML 태그 초기화 및 전역 스타일)
	2.	Components: 재사용 가능한 컴포넌트 스타일
	3.	Utilities: 유틸리티 클래스 스타일 (가장 강력하며, 다른 스타일을 덮어씀)

2.2 `@layer` 라는 디렉티브로 css파일에 적용한다.  

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
/* hsl로 정의된다. 	
  •	Hue (색상): 0~360도 사이의 값 (색상의 각도를 나타냄, 예: 빨강은 0, 초록은 120, 파랑은 240)
	•	Saturation (채도): 0~100% (색의 강도)
	•	Lightness (명도): 0~100% (밝기) */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    ...
```

3.기본 테마 적용하기
![Alt text](image-6.png)  
>https://ui.shadcn.com/themes  

- 위 테마 선택 후 global.css에서 변경한ㄷ.ㅏ  

```
@layer base {
  :root {
    --background: 0 0% 100%;
    ...
  }

  .dark {
    --background: 240 10% 3.9%;
    -...
}

```

4.테마 색상 변경하기
>https://ui.shadcn.com/docs/theming

4.1 CSS Variables 방식을 사용한다.  
- global.css에 변수를 정의한다.  
- tailwind.config.js에 정의한 변수를 추가한다. ( className 사용 가능 )