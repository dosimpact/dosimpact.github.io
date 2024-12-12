---
sidebar_position: 2
---

# Zod  

- [Zod](#zod)
  - [eg) Basic - UserSchema](#eg-basic---userschema)
  - [eg) gpt tools](#eg-gpt-tools)
  - [eg) streamObject](#eg-streamobject)
  - [eg) refine, filetype](#eg-refine-filetype)


Zod 왜 사용하는가?  
- 유효성 검증 라이브러리  
- 타입추론 기능 
```js
const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});
type User = z.infer<typeof UserSchema>;
```
- ai-sdk와 연동해서 사용 가능, json 스키마 모드에 zod를 연결하여 복잡한 구조의 응답 가능.  

## eg) Basic - UserSchema    

- z.object : 객체의 구조 정의  
- UserSchema.parse(body) : 유효성 검사 수행  
- error instanceof z.ZodError, error.issue : 유효성 검사 실패 애러  

```js
// TS : app/api/hello/route.ts
import { z } from "zod";

// 1.스키마 정의
const UserSchema = z.object({
  name: z.string().min(3, { message: "최소 3글자" }),
  email: z.string().email({ message: "올바른 이메일 형식이 아니다." }),
});

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    // 2.스키마 테스트  
    const user = UserSchema.parse(body);

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);

    // SyntaxError: Unexpected end of JSON input
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    // 3.zod error
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map((issue) => issue.message)
        .join(", ");

      return NextResponse.json(
        { error: "Invalid user data : " + errorMessages },
        { status: 400 }
      );
    }

    // internal server error
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

```


## eg) gpt tools

- free weahter api : https://api.open-meteo.com/v1/forecast?latitude=38&longitude=123&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto


```js
  const result = await streamText({
    model: customModel(model.apiIdentifier),
    system: systemPrompt,
    messages: coreMessages,
    maxSteps: 5,
    experimental_activeTools: allTools,
    tools: {
      getWeather: {
        description: "Get the current weather at a location",
        // zod 의 스키마 정의를 파라미터에 넣는다.  
        parameters: z.object({
          latitude: z.number(),
          longitude: z.number(),
        }),
        execute: async ({ latitude, longitude }) => {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`
          );

          const weatherData = await response.json();
          return weatherData;
        },
      },
```

## eg) streamObject

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
```

## eg) refine, filetype

- refine : 정제하다 ( 파일의 용량, 이미지 타입 등 정의가능)  

```js
// Use Blob instead of File since File is not available in Node.js environment
const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size should be less than 5MB",
    })
    // Update the file type based on the kind of files you want to accept
    .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
      message: "File type should be JPEG or PNG",
    }),
});

```