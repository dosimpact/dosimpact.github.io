---
sidebar_position: 9
---

# AI SDK    

- [AI SDK](#ai-sdk)
  - [주요 함수들](#주요-함수들)
  - [Stream Protocols](#stream-protocols)
  - [📌 Basic](#-basic)
  - [📌 Generative User Interfaces](#-generative-user-interfaces)
  - [📌 Streaming Custom Data](#-streaming-custom-data)
    - [eg) 스크립트 요약하기](#eg-스크립트-요약하기)
    - [eg) 마크 다운 문서 Streaming 응답](#eg-마크-다운-문서-streaming-응답)
    - [eg) 문서를 첨삭 Streaming Object](#eg-문서를-첨삭-streaming-object)


## 주요 함수들  

>Blocking UI vs Streaming UI : https://sdk.vercel.ai/docs/foundations/streaming  

- generateText : Blocking UI + text
- generateObject : Blocking UI + object  
  - https://sdk.vercel.ai/docs/advanced/sequential-generations  
- streamObject : Streaming UI + text
- streamText : Streaming UI + object
- createDataStreamResponse : Streaming UI + Streaming Custom Data  


## Stream Protocols  

>https://sdk.vercel.ai/docs/ai-sdk-ui/stream-protocol  

stream protocol 이란?  
- HTTP 프로토콜 위에서 스트림 데이터를 넘기는 규칙. ( text stream, data stream 모두 포함 )  

Text Stream Protocol
- `streamText().toTextStreamResponse();`   사용  

Data Stream Protocol
- `createDataStreamResponse` 사용    

*타입 구분을 통해서 Stream Protocol 내 Text, Data 모두 내려올 수 있다.   

*TypeID = 0,  Text Part  
- Format: 0:string\n  

*TypeID = 2,  Data Part  
- Format: 2:[{"key":"object1"},{"anotherKey":"object2"}]\n  

*TypeID = 8,  Message Annotation Part  
- Format: 8:[{"id":"message-123","other":"annotation"}]\n   

*TypeID = 3,  Error Part
- Format: 3:"error message"\n    

*TypeID = 3,  Tool Call Streaming Start Part
- Format: b:{"toolCallId":"call-456","toolName":"streaming-tool"}\n      
*TypeID = c,  Tool Call Delta Part
- Format: c:{"toolCallId":"call-456","argsTextDelta":"partial arg"}\n
*TypeID = 9,  Tool Call Part
- Format: 9:{"toolCallId":"call-123","toolName":"my-tool","args":{"some":"argument"}}\n
*TypeID = a,  Tool Result Part
- Format: a:{"toolCallId":"call-123","result":"tool output"}\n

*TypeID = e,  Finish Step Part
- Format: e:{"finishReason":"stop","usage":{"promptTokens":10,"completionTokens":20},"isContinued":false}\n
*TypeID = d,  Finish Message Part
- Format: d:{"finishReason":"stop","usage":{"promptTokens":10,"completionTokens":20}}\n

```
// 응답 예 
// TypeID, Type delimiter(:), Text|Data Chunk, Chunk delimiter 4가지 파트로 구성  

2:["initialized call"]
8:[{"chunk":"123"}]
0:"Hello"
8:[{"chunk":"123"}]
0:"!"
8:[{"chunk":"123"}]
0:" How"
8:[{"chunk":"123"}]
0:" can"
8:[{"chunk":"123"}]
0:" I"
8:[{"chunk":"123"}]
0:" assist"
8:[{"chunk":"123"}]
0:" you"
8:[{"chunk":"123"}]
0:" today"
8:[{"chunk":"123"}]
0:"?"
8:[{"id":"DU5YpIiiuczDZpiN","other":"information"}]
2:["call completed"]
e:{"finishReason":"stop","usage":{"promptTokens":8,"completionTokens":9},"isContinued":false}
d:{"finishReason":"stop","usage":{"promptTokens":8,"completionTokens":9}}
```




## 📌 Basic

```js
// app/api/chat-test/route.ts
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: "You are a friendly assistant!",
    messages,
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
---
// chat-lite.tsx
"use client";

import { generateUUID } from "@/lib/utils";
import { useChat } from "ai/react";
import React from "react";

/*
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
    messages, // 지금까지의 누적 메시지 리스트
    setMessages, // 메시지 setter, (api call 없음)
    input, // 사용자 입력 & setter
    setInput,
    handleSubmit, // input의 내용을 모델에 전송, message객체 추가, input 초기화
    append, // 사용자 message 추가 후 바로 api 호출.
    isLoading,
    stop, // abort the current API
    data: streamingData, //최근 응답데이터의 스트림
  } = useChat({
    api: "/api/chat",
    body: { id: id, modelId: "gpt-4o-mini" },
  });

  // send continue message
  console.log({ id, messages, streamingData });

  return (
    <div>
      <div>{JSON.stringify(messages)}</div>
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

## 📌 Generative User Interfaces

흐름  
- 1.tools 정의 하기 - description, parameters, execute    
  - 예, 특정 위치의 날시를 보여줘, 인자값:location, 실행함수 - 날씨 API    
- 2.Router Handler에 streamText 작성하기    
- 3.messages 중 toolInvocations 필드를 보고 UI를 랜더링 하기    

제약
- gpt-4o-mini, gpt-4 이상 모델 선택  


```js
//lib/ai/tools.ts
import { tool as createTool } from "ai";
import { z } from "zod";

export const weatherTool = createTool({
  description: "Display the weather for a location",
  parameters: z.object({
    location: z.string(),
  }),
  execute: async function ({ location }) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { weather: "Sunny", temperature: 75, location };
  },
});

export const tools = {
  displayWeather: weatherTool,
};

---
// app/api/chat-test/route.ts
import { tools } from "@/lib/ai/tools";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: "You are a friendly assistant!",
    messages,
    maxSteps: 5,
    tools,
  });

  return result.toDataStreamResponse();
}
```

```js
// components/chat-lite-ui
"use client";

import { useChat } from "ai/react";

type WeatherProps = {
  temperature: number;
  weather: string;
  location: string;
};

export const Weather = ({ temperature, weather, location }: WeatherProps) => {
  return (
    <div>
      <h2>Current Weather for {location}</h2>
      <p>Condition: {weather}</p>
      <p>Temperature: {temperature}°C</p>
    </div>
  );
};

const ChatLiteUI = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat-test",
  });

  console.log("messages", messages);

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <div>{message.role === "user" ? "User: " : "AI: "}</div>
          <div>{message.content}</div>
          <div>
            {message.toolInvocations?.map((toolInvocation) => {
              const { toolName, toolCallId, state } = toolInvocation;

              if (state === "result") {
                if (toolName === "displayWeather") {
                  const { result } = toolInvocation;
                  return (
                    <div key={toolCallId}>
                      <Weather {...result} />
                    </div>
                  );
                }
              } else {
                return (
                  <div key={toolCallId}>
                    {toolName === "displayWeather" ? (
                      <div>Loading weather...</div>
                    ) : null}
                  </div>
                );
              }
            })}
          </div>
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message"
        ></input>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatLiteUI;


```


## 📌 Streaming Custom Data

>https://sdk.vercel.ai/docs/ai-sdk-ui/streaming-data#streaming-custom-data

흐름
- 1.createDataStreamResponse 을 리턴하며 execute안에서 streamText과 머지한다.  
- `result.mergeIntoDataStream(dataStream);`  
- 2.dataStream.writeData : 스트림 데이터, useChat의 data으로 넘어옴  
- 3.dataStream.writeMessageAnnotation : 스트림 어노테이션데이터, 주석과 같은 메타정보 넣는것이 가능.  useChat의 message 객체와 함께 들어옴.  

```js
// app/api/chat-test/route.ts
import { openai } from "@ai-sdk/openai";
import { generateId, createDataStreamResponse, streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  // immediately start streaming (solves RAG issues with status, etc.)
  return createDataStreamResponse({
    execute: (dataStream) => {
      dataStream.writeData("initialized call");

      const result = streamText({
        model: openai("gpt-4o-mini"),
        messages,
        onChunk() {
          dataStream.writeMessageAnnotation({ chunk: "123" }); // annotation 정보는 messages안에 포함되며 
        },
        onFinish() {
          // message annotation:
          dataStream.writeMessageAnnotation({
            id: generateId(), // e.g. id from saved DB record
            other: "information",
          });

          // call annotation:
          dataStream.writeData("call completed");
        },
      });

      result.mergeIntoDataStream(dataStream);
    },
    onError: (error) => {
      // Error messages are masked by default for security reasons.
      // If you want to expose the error message to the client, you can do so here:
      return error instanceof Error ? error.message : String(error);
    },
  });
}

```

```js
"use client";

import { useChat } from "ai/react";

const ChatLiteUIStreamCustom = () => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    data: streamData,
  } = useChat({
    api: "/api/chat-test",
  });

  console.log("messages", messages);
  console.log("streamData", streamData);

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <div>{message.role === "user" ? "User: " : "AI: "}</div>
          <div id="content">{message.content}</div>
          <div id="annotations">
            {message.annotations && <>{JSON.stringify(message.annotations)}</>}
          </div>
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message"
        ></input>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatLiteUIStreamCustom;

```

### eg) 스크립트 요약하기  
- streamText + useCompletion

```js
// api/router-hander.ts
export async function POST(request: NextRequest) {
  const body = await request.json(); // { prompt: string }

  const searchParams = request.nextUrl.searchParams;

  const videoId = searchParams.get("video_id");

  if (!videoId) {
    return NextResponse.json(
      { error: "비디오 ID를 추출할 수 없습니다." },
      { status: 400 },
    );
  }

  const webhookData = await n8nService.getVideoInfo(videoId);

  const result = streamText({
    model: openai("gpt-4.1-nano"),
    system: "마크다운으로 요약해줘",
    prompt: webhookData.text_only_ko,
  });

  return result.toDataStreamResponse();
}
---
// summary.tsx
import { Button } from "@/components/ui/button";
import { useCompletion } from "@ai-sdk/react";
import { Markdown } from "@/components/markdown/markdown";

const Summary = () => {
  const { completion, handleSubmit } = useCompletion({
    initialInput: "initial input", // body.prompt 값  
    initialCompletion: "initial completion", // 초기 LLM 출력 데이터  
    api: "http://localhost:3000/api/yt-summary/general-summary?video_id=s5FNl52TIpk",
    streamProtocol: "data", // streaming data protocol 을 따르는지 여부  
  });

  const onClickButton = () => {
    handleSubmit();
  };

  return (
    <div>
      <Button onClick={onClickButton}>Submit</Button>
      <Markdown>{completion}</Markdown>
    </div>
  );
};

export default Summary;

```

### eg) 마크 다운 문서 Streaming 응답

- streamText + Streaming Custom Data  

```js
          const { fullStream } = await streamText({
            model: customModel(model.apiIdentifier),
            system:
              "Write about the given topic. Markdown is supported. Use headings wherever appropriate.",
            prompt: title,
          });

          for await (const delta of fullStream) {
            const { type } = delta;

            if (type === "text-delta") {
              const { textDelta } = delta;

              draftText += textDelta;
              streamingData.append({
                type: "text-delta",
                content: textDelta,
              });
            }
          }

          streamingData.append({ type: "finish", content: "" });
```

### eg) 문서를 첨삭 Streaming Object  

- stream object + Streaming Custom Data

```js

          const { elementStream } = await streamObject({
            model: customModel(model.apiIdentifier),
            system:
              "You are a help writing assistant. Given a piece of writing, please offer suggestions to improve the piece of writing and describe the change. It is very important for the edits to contain full sentences instead of just words. Max 5 suggestions.",
            prompt: document.content,
            output: "array",
            schema: z.object({
              originalSentence: z.string().describe("The original sentence"),
              suggestedSentence: z.string().describe("The suggested sentence"),
              description: z
                .string()
                .describe("The description of the suggestion"),
            }),
          });

          for await (const element of elementStream) {
            const suggestion = {
              originalText: element.originalSentence,
              suggestedText: element.suggestedSentence,
              description: element.description,
              id: generateUUID(),
              documentId: documentId,
              isResolved: false,
            };

            streamingData.append({
              type: "suggestion",
              content: suggestion,
            });

            suggestions.push(suggestion);
          }
```