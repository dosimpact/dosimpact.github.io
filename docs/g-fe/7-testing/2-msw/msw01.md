---
sidebar_position: 1
---

# msw setup  

## install

```
// 1버전을 사용한다.
yarn add msw@1.3.2 -D  

// service worker  
npx msw init public/ --save
// public/mockServiceWorker.js 생성된다.  

```

## setup code 

```js
// 1.핸들러 함수를 정의 합니다.  
// src/mocks/handlers.ts
import { rest } from "msw";

export function handlers() {
  return [rest.get("/api/user", getUser)];
}

const getUser: Parameters<typeof rest.get>[1] = async (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({
      username: "John Doe",
    })
  );
};

---
// 2.서비스 워커를 정의합니다. 
// src/mocks/browser.ts

import { setupWorker } from "msw/browser";
import { handlers } from "./handler";

export const server = setupWorker(...handlers);

// 3.노드 서비스를 정의합니다.  
// src/mocks/node.ts
import { setupServer } from "msw/node";
import { handlers } from "./handler";

export const server = setupServer(...handlers());

---

// 4.App 진입점에 시작합니다.  
// src/index.js
server.start({ onUnhandledRequest: 'bypass' });
```