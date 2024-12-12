---
sidebar_position: 2
---

# Position CSS    

## Sticky  

- 스티키는 평소에 static처럼 작동하다가 스크롤에 의해서 위치가 고정되는 위치 속성이다.    

```
position:sticky; top:0;  // 반드시 2개 속성은 필수이다.  
z-index:1; // optional, 보통의 경우 하위요소에 의해서 가려진다.  
```


부모의 스크롤 컨텍스트 파악이 중요하다. 
  - 1.window의 스크롤이 스티키 기준점이 되는 경우
  - 2.하위 부모 요소에 스크롤 컨텍스트가 생겨서 기준이 되는경우  
- 1번의 경우를 원한다면 부모로 가는 도중에 스크롤 컨텍스트가 생기지 않도록, overflow 옵션이 없어야 한다.  

```html
<div class="parent">
  <nav class="nav">Nav</nav>
  <section class="content">
    <!--스크롤 컨텍스트가 window -->
    <div class="container">
      <div class="static">static</div>
      <div class="sticky top-0">sticky 0</div>
      <div class="sticky top-30">sticky 30</div>
      <div class="sticky top-60">sticky 60</div>
    </div>
    <!--스크롤 컨텍스트가 window가 아닌 부모요소-->
    <div class="long-h">
      <div class="long-box">LongText</div>
      <div class="long-box sticky top-0">sticky</div>
      <div class="long-box">LongText</div>
      <div class="long-box">LongText</div>
      <div class="long-box">LongText</div>
    </div>
  </section>
  <footer class="footer">footer</footer>
</div>

```

```css
.nav {
  border: 1px solid black;
  height: 50px;
}

.content {
  height: auto;
  display: flex;
  flex-flow: row nowrap;
  height: 2000px;
  border: 1px solid red;
}

.container {
  width: 300px;
  height: auto;
  border: 1px solid black;
}

.fixed {
}

.sticky {
  position: sticky;
  background-color: yellowgreen;
  height: 30px;
}
.top-0 {
  top: 0px;
}
.top-30 {
  top: 30px;
}
.top-60 {
  top: 60px;
}

.footer {
  border: 1px solid black;
  height: 2000px;
}

/* eg2 */
.long-h {
  width: 100%;
  height: 300px;
  overflow: scroll;
}
.long-box {
  width: 100px;
  height: 100px;
  background-color: #5211;
}

```