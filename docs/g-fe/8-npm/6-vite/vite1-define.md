---
sidebar_position: 1
---

# Vite define 

```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// define 사용법
// 1. dev환경  = define에 정의된 변수는 window 전역객체에 들어간다.
// 2. prod환경 = define에 정의된 변수는 build-time에 치환된다.
// *치환될때 문자열은 문자열을 벗고 그대로 들어간다. ( JSON.stringify, ''으로 한번더 감싼다.)   
export default defineConfig({
  plugins: [react()],
  define: {
    // case1 - 문자열   
    // ENV:"ENV_LOCAL" // ❌  const defines = { "ENV": ENV_LOCAL }; ENV_LOCAL라는 변수는 없어서 오류
    ENV:JSON.stringify("ENV_LOCAL"), // ✅ 문자열로 한번 벗겨서 들어간다. 
    // ENVENV:'"ENV_LOCAL"', // ✅ 문자열로 한번 벗겨서 들어가서 string이 잘 들어간다.  
    // 결과 const defines = { "ENV": "ENV_LOCAL" };

    // case1.1 - 문자열   
    // __APP_VERSION__: 'v1.0.0', // ❌ 문자열로 정의
    // const defines = {"__APP_VERSION__": v1.0.0 }; // 실제 들어간것은 v1객체가 들어간 코드 형태 
    __APP_VERSION__: JSON.stringify('v1.0.0'), // ✅
    // const defines = {"__APP_VERSION__": "v1.0.0" }; // 실제 들어간것은 문자열

    // case1.2 - 문자열 넣기  
    __API_URL__: 'window.__backend_api_url', // ✅
    // const defines = { "__API_URL__": window.__backend_api_url };

    //case2.숫자
    // 숫자는 별도의 처리가 필요없다.
    __APP_NUMBER__: 3,

    // case3 - object   
    // 객체의 경우에는 JSON.stringify를 사용안해도 된다.
    TEST_OBJ:{ // 
      NAME:"alice",
    },
    TEST_OBJ_2:JSON.stringify({ // ok 
      NAME:"banana",
    }),
    TEST_OBJ_3:{
      NAME:'"apple"', // ❌ 
    },

    // case3.1 nested object
    'process.env': {
      PROFILE:"local",   // ✅
      ENV:'"ENV_LOCAL"', // ❌ 
    },
    // const defines = { "process.env": { "PROFILE": "local" } };
    // TEST:"ENV_LOCAL"
  },
})

/*
const context = ( () => {
    if (typeof globalThis !== "undefined") {
        return globalThis;
    } else if (typeof self !== "undefined") {
        return self;
    } else if (typeof window !== "undefined") {
        return window;
    } else {
        return Function("return this")();
    }
}
)();
const defines = {
    "ENV": "ENV_LOCAL",
    "TEST_OBJ": {
        "NAME": "alice"
    },
    "TEST_OBJ_2": {
        "NAME": "banana"
    },
    "TEST_OBJ_3": {
        "NAME": "\"apple\""
    },
    "__API_URL__": window.__backend_api_url,
    "__APP_NUMBER__": 3,
    "__APP_VERSION__": "v1.0.0",
    "process.env": {
        "PROFILE": "local",
        "ENV": "\"ENV_LOCAL\""
    }
};
Object.keys(defines).forEach( (key) => {
    const segments = key.split(".");
    let target = context;
    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        if (i === segments.length - 1) {
            target[segment] = defines[key];
        } else {
            target = target[segment] || (target[segment] = {});
        }
    }
}
);
*/

```
