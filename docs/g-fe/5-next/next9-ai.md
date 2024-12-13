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
---
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
