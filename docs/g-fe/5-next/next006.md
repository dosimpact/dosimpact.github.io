---
sidebar_position: 6
---

# TailwindCSS

- [TailwindCSS](#tailwindcss)
  - [twMerge](#twmerge)
  - [반응형 UI만드는 방법](#반응형-ui만드는-방법)
  - [flex](#flex)
  - [width, heigth, padding, margin, border, round](#width-heigth-padding-margin-border-round)
  - [color, background, font-size, font-weight, cursor](#color-background-font-size-font-weight-cursor)
  - [transition, :hover, :disabled](#transition-hover-disabled)
  - [overflow](#overflow)
  - [group](#group)
  - [backdrop-filter](#backdrop-filter)
  - [etc](#etc)
    - [truncate](#truncate)
    - [color-scheme](#color-scheme)

## twMerge

- 조건에 따라 선택적으로 className을 넣을 수 있다.  

```js
import { twMerge } from "tailwind-merge";
className={twMerge(``,active && "text-white")}
```

## 반응형 UI만드는 방법  

https://tailwindcss.com/docs/responsive-design

```js
# md:hidden : @media (min-width: 768px) { ... }
- 최소 768px 이상의 너비를 가진 화면이라면,(예 PC) 작동하는 로직
- 모바일을 기준으로 작업을한다. 모바일에서 보이는건 PC에서 보이지만 반대의 경우에는 그렇진 않기 떄문. 

# mobile 보여주다가, PC 숨긴다.
className="flex md:hidden gap-x-2 items-center"

# PC에서 보여주다가, mobile의 경우 숨긴다.
className="hidden md:flex gap-x-2 items-center"

```

## flex

```js
# flex, justify-content(main-axis), align-items(cross-axis)
className="flex flex-col gap-y-4"

# main-axis(justify)
className="flex justify-between"

# cross-axios(items)
className="flex flex-row items-center gap-x"

# flex:1 1 0%
className="flex flex-1"

```

## width, heigth, padding, margin, border, round

```js
className="h-auto w-full py-1"
className="h-[130px]"
className="px-5 py-4"
className="rounded-lg"
className="border border-transparent rounded-full"
className="cursor-pointer rounded-full hover:opacity-75 transition"
```

## color, background, font-size, font-weight, cursor

```js
# color
className="text-green-500"
# font-size (text-sm, text-md, text-lg)
className="text-neutral-400 text-md font-medium cursor-pointer"
className="text-black bg-green-500 font-bold"
```
## transition, :hover, :disabled

```js
className="hover:text-white transition"
className="disabled:cursor-not-allowed disabled:opacity-50"
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