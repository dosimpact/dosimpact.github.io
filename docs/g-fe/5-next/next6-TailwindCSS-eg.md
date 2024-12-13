---
sidebar_position: 6
---

# TailwindCSS Eg

- [TailwindCSS Eg](#tailwindcss-eg)
  - [eg) 픽토그램 - 신호등, 횡단보드](#eg-픽토그램---신호등-횡단보드)
  - [eg) Next Image + gradient](#eg-next-image--gradient)
  - [eg) text 배경 강조](#eg-text-배경-강조)



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

## eg) text 배경 강조  

![Alt text](image-5.png)
```js
<span className="rounded-md bg-muted px-1 py-0.5">streamText</span>
```