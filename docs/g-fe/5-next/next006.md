---
sidebar_position: 6
---

# Next + TailwindCSS

- [Next + TailwindCSS](#next--tailwindcss)
  - [playground](#playground)
  - [단위체계](#단위체계)
  - [bg, border, border-color, rounded](#bg-border-border-color-rounded)
    - [bg-gradient-to-t from-black](#bg-gradient-to-t-from-black)
  - [w, h, p, m](#w-h-p-m)
  - [text-color, text-size, font-bold, cursor](#text-color-text-size-font-bold-cursor)
  - [flex, flex-col, justify, items, gap](#flex-flex-col-justify-items-gap)
  - [hover, transition, :disabled](#hover-transition-disabled)
  - [반응형 UI만드는 방법](#반응형-ui만드는-방법)
  - [overflow](#overflow)
  - [group](#group)
  - [backdrop-filter](#backdrop-filter)
  - [twMerge](#twmerge)
  - [etc](#etc)
    - [truncate](#truncate)
    - [color-scheme](#color-scheme)
  - [eg) 픽토그램 - 신호등, 횡단보드](#eg-픽토그램---신호등-횡단보드)
  - [eg) Next Image + gradient](#eg-next-image--gradient)

## playground

아래 사이트에서 연습이 가능하다.  
- https://play.tailwindcss.com/

## 단위체계

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

## bg, border, border-color, rounded

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

## w, h, p, m 

```js
# extrinsic 
className="h-auto h-5 h-[40px]"
# intrinsic - 내부 요소에 의해 크기 결정
className="h-fit h-min h-max"
className="w-auto w-full w-5 w-[40px]"
className="p-8 p-[40px] px-8 py-8"
className="m-8 m-[40px] mx-8 my-8"
```

## text-color, text-size, font-bold, cursor

```js
# color
className="text-green-500"

# font-size (text-sm, text-md, text-lg..)
className="text-sm text-md text-2xl text-[50px]"

# weight, font-bold(700)
className="font-medium font-[500] font-bold font-[700]"

className="cursor-pointer"
```

## flex, flex-col, justify, items, gap

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


## hover, transition, :disabled

```js
className="transition"
className="hover:text-white"
className="disabled:cursor-not-allowed disabled:opacity-50"
```

## 반응형 UI만드는 방법  

https://tailwindcss.com/docs/responsive-design
- UI는 Mobile우선 작업을 한다. 그리고 PC로 확장을 한다.   
- Mobile에서 구동 가능한 화면은 PC에서 볼 수 있지만 반대의 경우는 그렇지 않다.  

```js
# md:hidden : @media (min-width: 768px) { ... }
- 최소 768px 이상의 너비를 가진 화면이라면,(예 PC) 작동하는 로직
- 모바일을 기준으로 작업을한다. 모바일에서 보이는건 PC에서 보이지만 반대의 경우에는 그렇진 않기 떄문. 

# mobile 보여주다가, PC 숨긴다.
className="flex md:hidden gap-x-2 items-center"

# PC에서 보여주다가, mobile의 경우 숨긴다.
className="hidden md:flex gap-x-2 items-center"

```


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

### truncate

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

## eg) 픽토그램 - 신호등, 횡단보드 

```js
<!-- eg) 픽토그램 - 신호등, 횡단보드  -->

<div class="group flex h-[250px] w-full flex-row items-center justify-between bg-black">
  <div class="flex flex-row gap-4 group-hover:bg-pink-300">
    <div class="h-[150px] w-4 bg-white"></div>
    <div class="h-[150px] w-4 bg-white"></div>
    <div class="h-[150px] w-4 bg-white"></div>
    <div class="h-[150px] w-4 bg-white"></div>
    <div class="h-[150px] w-4 bg-white"></div>
  </div>
  <div class="flex flex-row items-center justify-center gap-3">
    <div class="h-40 w-40 rounded-full border-2 border-white bg-red-400 transition hover:bg-red-200"></div>
    <div class="h-40 w-40 rounded-full border-2 border-white bg-yellow-400 transition hover:bg-yellow-200"></div>
    <div class="h-40 w-40 rounded-full border-2 border-white bg-green-400 transition hover:bg-green-200"></div>
  </div>
  <div class="flex flex-row gap-4 group-hover:bg-yellow-300">
    <div class="h-[150px] w-4 bg-white"></div>
    <div class="h-[150px] w-4 bg-white"></div>
    <div class="h-[150px] w-4 bg-white"></div>
    <div class="h-[150px] w-4 bg-white"></div>
    <div class="h-[150px] w-4 bg-white"></div>
  </div>
</div>
```

## eg) Next Image + gradient

```js
const Header = () => {
  return (
    <div className="w-full h-[400px] relative">
      <Image
        alt="MediaItem "
        className="object-cover"
        fill
        src={
          "https://images.unsplash.com/photo-1707833558984-3293e794031c?q=80&w=2033&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
      />
      <div className="w-full h-full bg-black opacity-40 absolute top-0"></div>
      <div className="w-full h-full absolute top-0 bg-gradient-to-t from-black"></div>
    </div>
  );
};

```