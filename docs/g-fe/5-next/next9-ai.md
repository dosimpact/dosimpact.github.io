---
sidebar_position: 9
---

# AI SDK  


## 📌 Generative User Interfaces

흐름  
1.tools 정의 하기 - description, parameters, execute  
- 예, 특정 위치의 날시를 보여줘, 인자값:location, 실행함수 - 날씨 API  
2.Router Handler에 streamText 작성하기  
3.messages 중 toolInvocations 필드를 보고 UI를 랜더링 하기  

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