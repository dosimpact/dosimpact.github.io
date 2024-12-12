---
sidebar_position: 2
---

# ai/react

Ref : https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat#usechat


## eg) Basic usage  

```js
"use client";

import { generateUUID } from "@/lib/utils";
import { useChat } from "ai/react";
import React from "react";

/*
eg) messages sample  
[
    {
        "role": "user",
        "content": "my name is jay",
        "id": "bPclYKo27gxhIoWn",
        "createdAt": "2024-12-12T12:28:11.371Z"
    },
    {
        "id": "NPFi3J8vWw7Sa5uw",
        "role": "assistant",
        "content": "Nice to meet you, Jay! How can I assist you today?",
        "createdAt": "2024-12-12T12:28:13.252Z",
        "revisionId": "pDmdPLtSHFUvn3Bi"
    }
]*/

const ChatLite = ({ id }: { id: string }) => {
  const {
    messages,       // 지금까지의 누적 메시지 리스트
    setMessages,    // 메시지 setter, (api call 없음)
    input,          // 사용자 입력 & setter
    setInput,
    handleSubmit,   // input의 내용을 모델에 전송, message객체 추가, input 초기화
    append,         // message 객체 추가
    isLoading,
    stop,           // abort the current API
    data: streamingData, //최근 응답데이터의 스트림
  } = useChat({
    api: "/api/chat", // endpoint, default /api/chat  
    body: { id: id, modelId: "gpt-4o-mini" },
  });

  return (
    <div>
      {/* view */}
      <div>{JSON.stringify(messages)}</div>
      {/* input */}
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSubmit}>send</button>
      {/* append */}
      <div>
        <button
          onClick={() => append({ role: "user", content: "my name is jay" })}
        >
          Append suggested message!
        </button>
      </div>
    </div>
  );
};

export default ChatLite;
```