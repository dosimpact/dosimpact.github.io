---
sidebar_position: 2
---

# Zod  


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