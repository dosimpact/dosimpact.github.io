---
sidebar_position: 1
---

# JS 문제집    


https://bigfrontend.dev/problem  


## setTimeout, setInterval  

시간에 관련된 함수이다.  
- setTimeout, clearTimeout, setInterval, clearInterval의 쌍 조합으로 ms초 이후 취소를 해주는 것이 필요하다.  

📌 디바운스 함수 기초 로직  

```js
function debounced(func, wait){
    let timeout = null;
    return function(...args){
        clearTimeout(timeout);
        // timeout = setTimeout(()=>{ func.call(this,...args); }, wait )
        timeout = setTimeout(()=>{ func.apply(this,args); }, wait )
    }
}

// TC  
const sleep = (ms) => new Promise((res)=> setTimeout(res,ms));

const dc = debounced((msg)=>console.log("log"+msg), 2000 );

async function bootstrap(){
    for(let i = 0 ; i < 100; i++){
        dc("my-msg")
        await sleep(10);
    }
    console.log("done")
}
bootstrap();
```

📌 쓰로틀링 (w, trailing edge)

```js
function throttle(func, delay) {
  let isThrottled = false;
  let lastArgs = null;
  let lastContext = null;

  return function(...args) {
    const context = this;

    if (isThrottled) {
      lastArgs = args;
      lastContext = context;
      return;
    }

    func.apply(context, args);
    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;
      if (lastArgs) {
        func.apply(lastContext, lastArgs);
        lastArgs = null;
        lastContext = null;
      }
    }, delay);
  };
}
```