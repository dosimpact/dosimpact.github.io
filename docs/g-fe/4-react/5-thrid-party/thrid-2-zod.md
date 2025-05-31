---
sidebar_position: 2
---

# Zod  

- [Zod](#zod)
  - [소개](#소개)
  - [Infra Code](#infra-code)
  - [usage](#usage)
    - [usu - refine, filetype](#usu---refine-filetype)
  - [eg](#eg)
    - [eg - Schema Number](#eg---schema-number)
    - [eg - Shame object, UserSchema](#eg---shame-object-userschema)
    - [eg - gpt tools](#eg---gpt-tools)
    - [eg) streamObject](#eg-streamobject)

## 소개  

목적 : 스키마 선언 및 데이터 검증 라이브러리    
예 : API 응답, 폼 데이터, 환경 변수 등의 유효성 검사  
장점 : 
- TypeScript 기반 타입추론 기능, (런타임 유효성 검사 가능)  
- 확장성 좋음 ( refine, 	객체, 배열, union, intersection, optional 등 다양한 구조를 잘 처리. )  
단점  
- 의존성 필드들은 refine 에 많이 의존한다.  

## Infra Code  

설계  
- 1.스키마 정의부
  - 조건부 의존성 검사 대응을 위해, refine에 들어가는 인자를 create 함수로 받는다.   
  - 도메인 단위로 스키마를 정의한다.  
- 2.실행부
  - validate, hooks 제공  

```js
// validateWithZod
import { z } from "zod";

export function validateWithZod<T>(schema: z.ZodSchema, data: T): string[] {
  const errors: string[] = [];

  try {
    schema.parse(data);
  } catch (e) {
    if (e instanceof z.ZodError) {
      errors.push(...e.errors.map((e) => e.message));
    }
  }

  return errors;
}


// useZodValidator
import { useEffect, useMemo, useState } from "react";
import type { z } from "zod";
import { validateWithZod } from "./validateWithzod";

export function useZodValidator<T>(zodSchema: z.ZodSchema, value: T) {
  const [errors, setErrors] = useState<Array<string>>([]);

  const schema = useMemo(() => zodSchema, [zodSchema]);

  const hasError = errors?.length >= 1;

  useEffect(() => {
    const validationErrors = validateWithZod(schema, value);
    setErrors(validationErrors);
  }, [value, schema]);

  return { errors, hasError };
}

--- 
// str.schema.ts
import { z } from "zod";

export const STR_ERROR = {
  NOT_VALID_EMAIL: "NOT_VALID_EMAIL",
  NOT_VALID_URL: "NOT_VALID_URL",
};

export const createEmailErrorSchema = () =>
  z.string().email({
    message: STR_ERROR.NOT_VALID_EMAIL,
  });

export const createUrlErrorSchema = () =>
  z.string().url({
    message: STR_ERROR.NOT_VALID_URL,
  });


// price.schema.ts
import { z } from "zod";

export const SchemaMsgEnum = {
  ERROR_MSG_PRICE: "ERROR_MSG_PRICE",
  ERROR_MSG_PRICE_LIMIT: "ERROR_MSG_PRICE_LIMIT",
};

const PRICE_LOWER_LIMIT = 10_000;
const PRICE_UPPER_LIMIT = 1_000_000_000;

export const createPriceErrorSchema = () =>
  z
    .number({ message: SchemaMsgEnum.ERROR_MSG_PRICE })
    .optional() // 없어도 되는 값, 하지만 있으면 검사를 한다.
    .nullable() // null 값도 허용한다.
    .refine(
      // 값이 있다면 반드시 아래 조건이 만족 되어야 한다.
      (value) => {
        if (value === undefined || value === null) return true;
        return value >= PRICE_LOWER_LIMIT && value <= PRICE_UPPER_LIMIT;
      },
      {
        message: SchemaMsgEnum.ERROR_MSG_PRICE_LIMIT,
      },
    );

// user.schema.ts

import { z } from "zod";
import { createEmailErrorSchema, createUrlErrorSchema } from "./str.schema";

export const USER_ERROR = {
  NOT_VALID_EMAIL: "NOT_VALID_EMAIL",
  NOT_VALID_URL: "NOT_VALID_URL",
  NOT_VALID_PASSWORD: "NOT_VALID_PASSWORD",
  NOT_VALID_PASSWORD_UPPER_CASE: "NOT_VALID_PASSWORD_UPPER_CASE",
  NOT_VALID_PASSWORD_LOWER_CASE: "NOT_VALID_PASSWORD_LOWER_CASE",
  NOT_VALID_PASSWORD_NUMBER: "NOT_VALID_PASSWORD_NUMBER",
  NOT_VALID_USERNAME: "NOT_VALID_USERNAME",
  NOT_VALID_USERNAME_MAX: "NOT_VALID_USERNAME_MAX",
};

export const createUsernameErrorSchema = () =>
  z
    .string()
    .min(3, {
      message: USER_ERROR.NOT_VALID_USERNAME,
    })
    .max(10, {
      message: USER_ERROR.NOT_VALID_USERNAME_MAX,
    });

export const createPasswordErrorSchema = () =>
  z
    .string()
    .min(0, {
      message: USER_ERROR.NOT_VALID_PASSWORD,
    })
    .regex(/[A-Z]/, {
      message: USER_ERROR.NOT_VALID_PASSWORD_UPPER_CASE,
    })
    .regex(/[a-z]/, {
      message: USER_ERROR.NOT_VALID_PASSWORD_LOWER_CASE,
    })
    .regex(/[0-9]/, {
      message: USER_ERROR.NOT_VALID_PASSWORD_NUMBER,
    });

export const createUserErrorSchema = () =>
  z.object({
    email: createEmailErrorSchema(),
    url: createUrlErrorSchema().optional(),
    username: createUsernameErrorSchema(),
    password: createPasswordErrorSchema(),
  });


```

```js
const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});
type User = z.infer<typeof UserSchema>;
```
- ai-sdk와 연동해서 사용 가능, json 스키마 모드에 zod를 연결하여 복잡한 구조의 응답 가능.  


--- 
## usage 

### usu - refine, filetype

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


--- 
## eg

### eg - Schema Number

```js
import { z } from 'zod';

export const SchemaMsgEnum = {
  ERROR_MSG_NOT_NUMBER: 'ERROR_MSG_NOT_NUMBER',
  ERROR_MSG_POINT_LIMIT: 'ERROR_MSG_POINT_LIMIT'
};

const POINT_LOWER_LIMIT = 10_000;
const POINT_UPPER_LIMIT = 1_000_000_000;

export const createPointErrorSchema = () =>
  z.number({ message: SchemaMsgEnum.ERROR_MSG_NOT_NUMBER }) // 넘버타입이 아닐경우의 오류   
    .optional() // undefined 허용
    .nullable() // null 허용  
    .refine(
    value => {
      // * refine은 위에서 걸리지 않는 이상 (문자열등에 걸려서 ERROR_MSG_NOT_NUMBER 애러 등) 실행된다.  
      if (value === undefined || value === null) return true;  // optional, nullable 다시 체크해야함.  
      return value >= POINT_LOWER_LIMIT && value <= POINT_UPPER_LIMIT;
    },
    {
      message: SchemaMsgEnum.ERROR_MSG_POINT_LIMIT
    }
  );

createPointErrorSchema().parse(null) // no error
createPointErrorSchema().parse(undefined) // no error
createPointErrorSchema().parse('awef') // error ERROR_MSG_NOT_NUMBER
createPointErrorSchema().parse(0) // error ERROR_MSG_POINT_LIMIT
createPointErrorSchema().parse(10_000) // no error
createPointErrorSchema().parse(1_000_000_000) //  no error
createPointErrorSchema().parse(1_000_000_001) // error ERROR_MSG_POINT_LIMIT
```



### eg - Shame object, UserSchema    

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

### eg - gpt tools

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

### eg) streamObject

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
