---
sidebar_position: 10
---

# 10 Error 

## 주요 애러 객체, 필드  

```js

// https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Error#%EC%84%A4%EB%AA%85

/*
애러 객체

1.주요 애러 객체 유형 
- ReferenceError
- SyntaxError
- TypeError
*/

// case1. Uncaught SyntaxError
try {
  a.b.c.d. = f; // Uncaught SyntaxError: Unexpected token =
} catch (e) {
  console.dir(e);
}

// case2. ReferenceError
try {
    a.b.c.d = f;
} catch (e) {
    console.dir(e); // ReferenceError: a is not defined
}

// case3. TypeError
try {
  const z = {}; // TypeError: z?.reduce is not a function
  const result = z?.reduce((acc, value) => acc + value, 0);
  console.log(result);
} catch (e) {
  console.dir(e);
}

```

## 커스텀 애러

```js
/*
애러 객체

2.애러 객체 주요 필드
- name, message
- fileName, lineNumber, columnNumber, stack
*/

try {
    throw new TypeError("Hello", "someFile.js", 10);
  } catch (e) {
    console.log(e instanceof TypeError); // true
    console.log(e.message); // "Hello"
    console.log(e.name); // "TypeError"
    console.log(e.fileName); // "someFile.js"
    console.log(e.lineNumber); // 10
    console.log(e.columnNumber); // 0
    console.log(e.stack); // "@Scratchpad/2:2:9\n"
  }
  

try {
    null.f();
  } catch (e) {
    console.log(e instanceof TypeError); // true
    console.log(e.message); // "null has no properties"
    console.log(e.name); // "TypeError"
    console.log(e.fileName); // "Scratchpad/1"
    console.log(e.lineNumber); // 2
    console.log(e.columnNumber); // 2
    console.log(e.stack); // "@Scratchpad/2:2:3\n"
  }
  
```

```js
class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = "CustomError";
  }
}

try {
  throw new CustomError("This is a custom error message");
} catch (error) {
  console.error(error.name);    // CustomError
  console.error(error.message); // This is a custom error message
  console.error(error.stack);   // Stack trace
}

```