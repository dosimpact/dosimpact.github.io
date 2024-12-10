---
sidebar_position: 8
---

# framer motion  

## About Framer Motion  

- 리액트 컴포넌트 기반의 재사용 가능한 애니메이션 추가 가능하다.  
- motion.div 등의 wrapper 태그로 작성
  - initial -> animate -> exit ( transition 애니메이션 지속 시간 )
- AnimatePresence는 컴포넌트가 제거될 때 exit 애니메이션을 실행할 수 있게 해줍니다.  
  - *없는경우라면 바로 언마운트 된다.  

## eg) opacity 0->1, 1->0  

```js
import { motion, AnimatePresence } from 'framer-motion';

    <div>
      <button onClick={() => setIsOpen(!isOpen)}>MotionEg01 Toggle</button>
      {/* AnimatePresence는 컴포넌트가 제거될 때 exit 애니메이션을 실행할 수 있게 해줍니다 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="h-[100px] w-[400px] top-0 bg-zinc-900/50"
            // 초기 상태 - 완전히 투명
            initial={{ opacity: 0 }}
            // 나타날 때 - 완전히 불투명
            animate={{ opacity: 1 }}
            // 사라질 때 - 다시 투명하게
            exit={{ opacity: 0 }}
            // 애니메이션 지속 시간 1초
            transition={{ duration: 1 }}
          >
            AnimatePresence!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
```

## eg) 오른쪽에서 나타나기, 뒤로 작아지면서 사라지기

```js
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="h-[100px] w-[400px] top-0 bg-zinc-900/50"
            initial={{ opacity: 0, x: 10, scale: 1 }}
            // 오른쪽에서 나타나기
            animate={{
              opacity: 1, // 완전히 보이게
              x: 0, // 원래 위치로
              scale: 1, // 원래 크기로
              transition: {
                delay: 0.2, // 0.2초 후에 시작
                type: "spring", // 스프링 효과 사용
                stiffness: 200, // 스프링의 강도
                damping: 30, // 스프링의 감쇠
              },
            }}
            // 뒤로 작아지면서 사라지기
            exit={{
              opacity: 0, // 완전히 투명하게
              x: 0, // x축 위치 유지
              scale: 0.95, // 약간 작아지면서
              transition: { delay: 0 }, // 즉시 시작
            }}
          >
            AnimatePresence!
          </motion.div>
        )}
      </AnimatePresence>
```

## eg) 서서히 전체화면 채우기 -> 작아지는 박스로 사라지기  

```js
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowSize } from "usehooks-ts";

const MotionEg03 = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const isMobile = windowWidth ? windowWidth < 768 : false;

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>MotionEg03 Toggle</button>
      {/* AnimatePresence는 컴포넌트가 제거될 때 exit 애니메이션을 실행할 수 있게 해줍니다 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-0 right-0 bg-zinc-900"
            initial={{
              opacity: 0,
              scale: 1,
              width: windowWidth,
              height: windowHeight,
            }}
            // 서서히 전체화면 채우기
            animate={{
              opacity: 1,
              scale: 1,
              borderRadius: 0,
              transition: {
                delay: 0,
                type: "spring",
                stiffness: 200,
                damping: 30,
              },
            }}
            // 작아지는 박스로 사라지기
            exit={{
              opacity: 0,
              scale: 0.5,
              transition: {
                delay: 0.1,
                type: "spring",
                stiffness: 600,
                damping: 30,
              },
            }}
          >
            <button onClick={() => setIsOpen(!isOpen)}>Close</button>
            <div>AnimatePresence!</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MotionEg03;

```

## eg) 로딩 애니메이션  

Ref : https://playcode.io/framer_motion

```js
      <AnimatePresence>
        <motion.div
          className="w-[50px] h-[50px] bg-pink-300"
          animate={{
            scale: [1, 1.1, 1.1, 1, 1],
            rotate: [0, 0, 180, 180, 0],
            borderRadius: ["0%", "0%", "50%", "50%", "0%"],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      </AnimatePresence>
```