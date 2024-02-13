---
sidebar_position: 7
---

# Next + Lib
- [Next + Lib](#next--lib)
  - [react-spinners](#react-spinners)
    - [useage](#useage)
    - [ref](#ref)
  - [react-hot-toast](#react-hot-toast)


## react-spinners

kinetic loading 을 보여줄 수 있다.  

### useage

```js
import { BounceLoader } from "react-spinners";

export const LoadingBox = () => {
  return (
    <Box>
      <BounceLoader loading color="#22c55e" size={40} />
    </Box>
  );
};

export default Box;

```

### ref
https://www.davidhu.io/react-spinners/storybook/?path=/docs/bounceloader--main

---

## react-hot-toast

- 별도의 인스턴스 상태관리가 필요 없다.  
- Provider 넣고 쓰면 된다.  

```js
"use client";

import { Toaster } from "react-hot-toast";

const ToasterProvider = () => {
  return ( 
    <Toaster 
      toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
        }
      }}
    /> 
  );
}
 
export default ToasterProvider;
---
import { toast } from "react-hot-toast";

...
  const handleLogout = async () => {
    if (error) {
      toast.error(error.message);
    }
  }

```