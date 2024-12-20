"use strict";(self.webpackChunkdosimpact_blog=self.webpackChunkdosimpact_blog||[]).push([[6626],{3905:(e,n,t)=>{t.d(n,{Zo:()=>c,kt:()=>g});var a=t(67294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function r(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?r(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,a,i=function(e,n){if(null==e)return{};var t,a,i={},r=Object.keys(e);for(a=0;a<r.length;a++)t=r[a],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)t=r[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var l=a.createContext({}),p=function(e){var n=a.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},c=function(e){var n=p(e.components);return a.createElement(l.Provider,{value:n},e.children)},m="mdxType",u={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},d=a.forwardRef((function(e,n){var t=e.components,i=e.mdxType,r=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),m=p(t),d=i,g=m["".concat(l,".").concat(d)]||m[d]||u[d]||r;return t?a.createElement(g,o(o({ref:n},c),{},{components:t})):a.createElement(g,o({ref:n},c))}));function g(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var r=t.length,o=new Array(r);o[0]=d;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s[m]="string"==typeof e?e:i,o[1]=s;for(var p=2;p<r;p++)o[p]=t[p];return a.createElement.apply(null,o)}return a.createElement.apply(null,t)}d.displayName="MDXCreateElement"},30644:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>u,frontMatter:()=>r,metadata:()=>s,toc:()=>p});var a=t(87462),i=(t(67294),t(3905));const r={sidebar_position:8},o="Framer motion",s={unversionedId:"g-fe/next/next8-framer",id:"g-fe/next/next8-framer",title:"Framer motion",description:"- Framer motion",source:"@site/docs/g-fe/5-next/next8-framer.md",sourceDirName:"g-fe/5-next",slug:"/g-fe/next/next8-framer",permalink:"/docs/g-fe/next/next8-framer",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/g-fe/5-next/next8-framer.md",tags:[],version:"current",sidebarPosition:8,frontMatter:{sidebar_position:8},sidebar:"frontEnd",previous:{title:"Next + Lib",permalink:"/docs/g-fe/next/next7-lib"},next:{title:"AI SDK",permalink:"/docs/g-fe/next/next9-ai"}},l={},p=[{value:"About Framer Motion",id:"about-framer-motion",level:2},{value:"eg) opacity 0-&gt;1, 1-&gt;0",id:"eg-opacity-0-1-1-0",level:2},{value:"eg) \uc624\ub978\ucabd\uc5d0\uc11c \ub098\ud0c0\ub098\uae30, \ub4a4\ub85c \uc791\uc544\uc9c0\uba74\uc11c \uc0ac\ub77c\uc9c0\uae30",id:"eg-\uc624\ub978\ucabd\uc5d0\uc11c-\ub098\ud0c0\ub098\uae30-\ub4a4\ub85c-\uc791\uc544\uc9c0\uba74\uc11c-\uc0ac\ub77c\uc9c0\uae30",level:2},{value:"eg) \uc11c\uc11c\ud788 \uc804\uccb4\ud654\uba74 \ucc44\uc6b0\uae30 -&gt; \uc791\uc544\uc9c0\ub294 \ubc15\uc2a4\ub85c \uc0ac\ub77c\uc9c0\uae30",id:"eg-\uc11c\uc11c\ud788-\uc804\uccb4\ud654\uba74-\ucc44\uc6b0\uae30---\uc791\uc544\uc9c0\ub294-\ubc15\uc2a4\ub85c-\uc0ac\ub77c\uc9c0\uae30",level:2},{value:"eg) \uaca9\uc790\ud615 \uad6c\uc870, 1\ubc88\ubd80\ud130 \uc544\ub798\uc5d0\uc11c \ud1a1\ud1a1 \ud280\uc5b4\uc624\ub974\uae30",id:"eg-\uaca9\uc790\ud615-\uad6c\uc870-1\ubc88\ubd80\ud130-\uc544\ub798\uc5d0\uc11c-\ud1a1\ud1a1-\ud280\uc5b4\uc624\ub974\uae30",level:2},{value:"eg) \uc560\ub2c8\uba54\uc774\uc158 - \ub85c\ub529 \uc544\uc774\ucf58",id:"eg-\uc560\ub2c8\uba54\uc774\uc158---\ub85c\ub529-\uc544\uc774\ucf58",level:2}],c={toc:p},m="wrapper";function u(e){let{components:n,...t}=e;return(0,i.kt)(m,(0,a.Z)({},c,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"framer-motion"},"Framer motion"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#framer-motion"},"Framer motion"),(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#about-framer-motion"},"About Framer Motion")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#eg-opacity-0-1-1-0"},"eg) opacity 0-",">","1, 1-",">","0")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#eg-%EC%98%A4%EB%A5%B8%EC%AA%BD%EC%97%90%EC%84%9C-%EB%82%98%ED%83%80%EB%82%98%EA%B8%B0-%EB%92%A4%EB%A1%9C-%EC%9E%91%EC%95%84%EC%A7%80%EB%A9%B4%EC%84%9C-%EC%82%AC%EB%9D%BC%EC%A7%80%EA%B8%B0"},"eg) \uc624\ub978\ucabd\uc5d0\uc11c \ub098\ud0c0\ub098\uae30, \ub4a4\ub85c \uc791\uc544\uc9c0\uba74\uc11c \uc0ac\ub77c\uc9c0\uae30")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#eg-%EC%84%9C%EC%84%9C%ED%9E%88-%EC%A0%84%EC%B2%B4%ED%99%94%EB%A9%B4-%EC%B1%84%EC%9A%B0%EA%B8%B0---%EC%9E%91%EC%95%84%EC%A7%80%EB%8A%94-%EB%B0%95%EC%8A%A4%EB%A1%9C-%EC%82%AC%EB%9D%BC%EC%A7%80%EA%B8%B0"},"eg) \uc11c\uc11c\ud788 \uc804\uccb4\ud654\uba74 \ucc44\uc6b0\uae30 -",">"," \uc791\uc544\uc9c0\ub294 \ubc15\uc2a4\ub85c \uc0ac\ub77c\uc9c0\uae30")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#eg-%EA%B2%A9%EC%9E%90%ED%98%95-%EA%B5%AC%EC%A1%B0-1%EB%B2%88%EB%B6%80%ED%84%B0-%EC%95%84%EB%9E%98%EC%97%90%EC%84%9C-%ED%86%A1%ED%86%A1-%ED%8A%80%EC%96%B4%EC%98%A4%EB%A5%B4%EA%B8%B0"},"eg) \uaca9\uc790\ud615 \uad6c\uc870, 1\ubc88\ubd80\ud130 \uc544\ub798\uc5d0\uc11c \ud1a1\ud1a1 \ud280\uc5b4\uc624\ub974\uae30")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#eg-%EC%95%A0%EB%8B%88%EB%A9%94%EC%9D%B4%EC%85%98---%EB%A1%9C%EB%94%A9-%EC%95%84%EC%9D%B4%EC%BD%98"},"eg) \uc560\ub2c8\uba54\uc774\uc158 - \ub85c\ub529 \uc544\uc774\ucf58"))))),(0,i.kt)("h2",{id:"about-framer-motion"},"About Framer Motion"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\ub9ac\uc561\ud2b8 \ucef4\ud3ec\ub10c\ud2b8 \uae30\ubc18\uc758 \uc7ac\uc0ac\uc6a9 \uac00\ub2a5\ud55c \uc560\ub2c8\uba54\uc774\uc158 \ucd94\uac00 \uac00\ub2a5\ud558\ub2e4.  "),(0,i.kt)("li",{parentName:"ul"},"motion.div \ub4f1\uc758 wrapper \ud0dc\uadf8\ub85c \uc791\uc131",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"initial -> animate -> exit ( transition \uc560\ub2c8\uba54\uc774\uc158 \uc9c0\uc18d \uc2dc\uac04 )"))),(0,i.kt)("li",{parentName:"ul"},"AnimatePresence\ub294 \ucef4\ud3ec\ub10c\ud2b8\uac00 \uc81c\uac70\ub420 \ub54c exit \uc560\ub2c8\uba54\uc774\uc158\uc744 \uc2e4\ud589\ud560 \uc218 \uc788\uac8c \ud574\uc90d\ub2c8\ub2e4.  ",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"*\uc5c6\ub294\uacbd\uc6b0\ub77c\uba74 \ubc14\ub85c \uc5b8\ub9c8\uc6b4\ud2b8 \ub41c\ub2e4.  ")))),(0,i.kt)("h2",{id:"eg-opacity-0-1-1-0"},"eg) opacity 0->1, 1->0"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"import { motion, AnimatePresence } from 'framer-motion';\n\n    <div>\n      <button onClick={() => setIsOpen(!isOpen)}>MotionEg01 Toggle</button>\n      {/* AnimatePresence\ub294 \ucef4\ud3ec\ub10c\ud2b8\uac00 \uc81c\uac70\ub420 \ub54c exit \uc560\ub2c8\uba54\uc774\uc158\uc744 \uc2e4\ud589\ud560 \uc218 \uc788\uac8c \ud574\uc90d\ub2c8\ub2e4 */}\n      <AnimatePresence>\n        {isOpen && (\n          <motion.div\n            className=\"h-[100px] w-[400px] top-0 bg-zinc-900/50\"\n            // \ucd08\uae30 \uc0c1\ud0dc - \uc644\uc804\ud788 \ud22c\uba85\n            initial={{ opacity: 0 }}\n            // \ub098\ud0c0\ub0a0 \ub54c - \uc644\uc804\ud788 \ubd88\ud22c\uba85\n            animate={{ opacity: 1 }}\n            // \uc0ac\ub77c\uc9c8 \ub54c - \ub2e4\uc2dc \ud22c\uba85\ud558\uac8c\n            exit={{ opacity: 0 }}\n            // \uc560\ub2c8\uba54\uc774\uc158 \uc9c0\uc18d \uc2dc\uac04 1\ucd08\n            transition={{ duration: 1 }}\n          >\n            AnimatePresence!\n          </motion.div>\n        )}\n      </AnimatePresence>\n    </div>\n")),(0,i.kt)("h2",{id:"eg-\uc624\ub978\ucabd\uc5d0\uc11c-\ub098\ud0c0\ub098\uae30-\ub4a4\ub85c-\uc791\uc544\uc9c0\uba74\uc11c-\uc0ac\ub77c\uc9c0\uae30"},"eg) \uc624\ub978\ucabd\uc5d0\uc11c \ub098\ud0c0\ub098\uae30, \ub4a4\ub85c \uc791\uc544\uc9c0\uba74\uc11c \uc0ac\ub77c\uc9c0\uae30"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'      <AnimatePresence>\n        {isOpen && (\n          <motion.div\n            className="h-[100px] w-[400px] top-0 bg-zinc-900/50"\n            initial={{ opacity: 0, x: 10, scale: 1 }}\n            // \uc624\ub978\ucabd\uc5d0\uc11c \ub098\ud0c0\ub098\uae30\n            animate={{\n              opacity: 1, // \uc644\uc804\ud788 \ubcf4\uc774\uac8c\n              x: 0, // \uc6d0\ub798 \uc704\uce58\ub85c\n              scale: 1, // \uc6d0\ub798 \ud06c\uae30\ub85c\n              transition: {\n                delay: 0.2, // 0.2\ucd08 \ud6c4\uc5d0 \uc2dc\uc791\n                type: "spring", // \uc2a4\ud504\ub9c1 \ud6a8\uacfc \uc0ac\uc6a9\n                stiffness: 200, // \uc2a4\ud504\ub9c1\uc758 \uac15\ub3c4\n                damping: 30, // \uc2a4\ud504\ub9c1\uc758 \uac10\uc1e0\n              },\n            }}\n            // \ub4a4\ub85c \uc791\uc544\uc9c0\uba74\uc11c \uc0ac\ub77c\uc9c0\uae30\n            exit={{\n              opacity: 0, // \uc644\uc804\ud788 \ud22c\uba85\ud558\uac8c\n              x: 0, // x\ucd95 \uc704\uce58 \uc720\uc9c0\n              scale: 0.95, // \uc57d\uac04 \uc791\uc544\uc9c0\uba74\uc11c\n              transition: { delay: 0 }, // \uc989\uc2dc \uc2dc\uc791\n            }}\n          >\n            AnimatePresence!\n          </motion.div>\n        )}\n      </AnimatePresence>\n')),(0,i.kt)("h2",{id:"eg-\uc11c\uc11c\ud788-\uc804\uccb4\ud654\uba74-\ucc44\uc6b0\uae30---\uc791\uc544\uc9c0\ub294-\ubc15\uc2a4\ub85c-\uc0ac\ub77c\uc9c0\uae30"},"eg) \uc11c\uc11c\ud788 \uc804\uccb4\ud654\uba74 \ucc44\uc6b0\uae30 -> \uc791\uc544\uc9c0\ub294 \ubc15\uc2a4\ub85c \uc0ac\ub77c\uc9c0\uae30"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'"use client";\nimport React, { useState } from "react";\nimport { motion, AnimatePresence } from "framer-motion";\nimport { useWindowSize } from "usehooks-ts";\n\nconst MotionEg03 = () => {\n  const [isOpen, setIsOpen] = useState(false);\n\n  const { width: windowWidth, height: windowHeight } = useWindowSize();\n  const isMobile = windowWidth ? windowWidth < 768 : false;\n\n  return (\n    <div>\n      <button onClick={() => setIsOpen(!isOpen)}>MotionEg03 Toggle</button>\n      {/* AnimatePresence\ub294 \ucef4\ud3ec\ub10c\ud2b8\uac00 \uc81c\uac70\ub420 \ub54c exit \uc560\ub2c8\uba54\uc774\uc158\uc744 \uc2e4\ud589\ud560 \uc218 \uc788\uac8c \ud574\uc90d\ub2c8\ub2e4 */}\n      <AnimatePresence>\n        {isOpen && (\n          <motion.div\n            className="absolute top-0 right-0 bg-zinc-900"\n            initial={{\n              opacity: 0,\n              scale: 1,\n              width: windowWidth,\n              height: windowHeight,\n            }}\n            // \uc11c\uc11c\ud788 \uc804\uccb4\ud654\uba74 \ucc44\uc6b0\uae30\n            animate={{\n              opacity: 1,\n              scale: 1,\n              borderRadius: 0,\n              transition: {\n                delay: 0,\n                type: "spring",\n                stiffness: 200,\n                damping: 30,\n              },\n            }}\n            // \uc791\uc544\uc9c0\ub294 \ubc15\uc2a4\ub85c \uc0ac\ub77c\uc9c0\uae30\n            exit={{\n              opacity: 0,\n              scale: 0.5,\n              transition: {\n                delay: 0.1,\n                type: "spring",\n                stiffness: 600,\n                damping: 30,\n              },\n            }}\n          >\n            <button onClick={() => setIsOpen(!isOpen)}>Close</button>\n            <div>AnimatePresence!</div>\n          </motion.div>\n        )}\n      </AnimatePresence>\n    </div>\n  );\n};\n\nexport default MotionEg03;\n\n')),(0,i.kt)("h2",{id:"eg-\uaca9\uc790\ud615-\uad6c\uc870-1\ubc88\ubd80\ud130-\uc544\ub798\uc5d0\uc11c-\ud1a1\ud1a1-\ud280\uc5b4\uc624\ub974\uae30"},"eg) \uaca9\uc790\ud615 \uad6c\uc870, 1\ubc88\ubd80\ud130 \uc544\ub798\uc5d0\uc11c \ud1a1\ud1a1 \ud280\uc5b4\uc624\ub974\uae30"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'<div className="grid sm:grid-cols-2 gap-2 w-full">\n  {suggestedActions.map((suggestedAction, index) => (\n    <motion.div\n      initial={{ opacity: 0, y: 20 }}\n      animate={{ opacity: 1, y: 0 }}\n      exit={{ opacity: 0, y: 20 }}\n      transition={{ delay: 0.05 * index }}\n      key={`suggested-action-${suggestedAction.title}-${index}`}\n      className={index > 1 ? "hidden sm:block" : "block"}\n    >\n      <Button\n        variant="ghost"\n        onClick={async () => {\n          window.history.replaceState({}, "", `/chat/${chatId}`);\n          append({\n            role: "user",\n            content: suggestedAction.action,\n          });\n        }}\n        className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"\n      >\n        <span className="font-medium">{suggestedAction.title}</span>\n        <span className="text-muted-foreground">\n          {suggestedAction.label}\n        </span>\n      </Button>\n    </motion.div>\n  ))}\n</div>\n')),(0,i.kt)("h2",{id:"eg-\uc560\ub2c8\uba54\uc774\uc158---\ub85c\ub529-\uc544\uc774\ucf58"},"eg) \uc560\ub2c8\uba54\uc774\uc158 - \ub85c\ub529 \uc544\uc774\ucf58"),(0,i.kt)("p",null,"Ref : ",(0,i.kt)("a",{parentName:"p",href:"https://playcode.io/framer_motion"},"https://playcode.io/framer_motion")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'      <AnimatePresence>\n        <motion.div\n          className="w-[50px] h-[50px] bg-pink-300"\n          animate={{\n            scale: [1, 1.1, 1.1, 1, 1],\n            rotate: [0, 0, 180, 180, 0],\n            borderRadius: ["0%", "0%", "50%", "50%", "0%"],\n          }}\n          transition={{\n            duration: 2,\n            ease: "easeInOut",\n            times: [0, 0.2, 0.5, 0.8, 1],\n            repeat: Infinity,\n            repeatDelay: 1,\n          }}\n        />\n      </AnimatePresence>\n')))}u.isMDXComponent=!0}}]);