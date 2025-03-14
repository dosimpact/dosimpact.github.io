---
sidebar_position: 12
---

# SSE to NDJSON  

Demo github : https://github.com/dosimpact/reference-sse-to-ndjson  
- [SSE to NDJSON](#sse-to-ndjson)
  - [웹 소켓 vs Server-Sent-Events vs 롱 폴링](#웹-소켓-vs-server-sent-events-vs-롱-폴링)
  - [Vercel AI SDK 에서 왜 SSE 대신 NDJSON을 쓸까?](#vercel-ai-sdk-에서-왜-sse-대신-ndjson을-쓸까)

## 웹 소켓 vs Server-Sent-Events vs 롱 폴링

Long Polling (롱 폴링)  
- 클라이언트가 서버에 주기적으로 요청을 보내 데이터가 있는지 확인  
- 데이터가 없으면 일정 시간 후 서버가 응답 → 클라이언트가 다시 요청  
- HTTP 요청이 반복되므로 비효율적 (오버헤드 큼)   
- 사용 사례: 간단한 채팅, 알림 시스템  

📌 언제 사용해야 할까?
- ✅ 서버에서 실시간 알림을 보내야 하지만 WebSocket/SSE를 사용할 수 없을 때
- ✅ HTTP 기반 환경에서 간단하게 구현할 때
🚨 단점:
- ❌ 불필요한 요청이 많아 서버 부하 증가
- ❌ 실시간성이 WebSocket보다 떨어짐

Server-Sent Events (SSE)  
- 서버에서 클라이언트로 단방향 스트리밍 가능
- HTTP 기반이므로 WebSocket보다 설정이 간단함  
- 연결이 자동으로 재연결됨  
- 사용 사례: 뉴스 피드, 주식 가격 업데이트, 실시간 알림  

📌 언제 사용해야 할까?
- ✅ 서버에서 클라이언트로만 데이터를 보낼 때 (예: 실시간 알림)
- ✅ WebSocket이 필요할 정도로 빈번한 데이터 전송이 필요하지 않을 때
🚨 단점:
- ❌ 클라이언트 → 서버로의 데이터 전송이 제한됨
- ❌ 브라우저에서만 사용 가능 (WebSocket보다 범용성이 떨어짐)

WebSocket (웹소켓)
- 양방향 통신 가능 (Full Duplex)
- 서버와 클라이언트가 지속적으로 데이터를 주고받을 수 있음
- 헤더가 가벼워 성능이 뛰어남 (HTTP보다 효율적)
- 사용 사례: 실시간 채팅, 주식 거래, 온라인 게임

📌 언제 사용해야 할까?
- ✅ 서버와 클라이언트가 양방향으로 자주 데이터를 주고받아야 할 때
- ✅ 연결을 유지하면서 빠른 데이터 전송이 필요할 때  


## Vercel AI SDK 에서 왜 SSE 대신 NDJSON을 쓸까?     

Vercel AI SDK 에서는  
- 전형적인 SSE의 event: message\ndata: ... 형식이 아니라   
- Newline-delimited JSON (NDJSON) 형식을 따르는 점이 중요해요.  

Next.js의 스트리밍 렌더링 방식   
- Next.js에서 스트리밍을 지원하는 주요 방법은 다음과 같아요.  
✅ 1) React Server Components (RSC) 스트리밍    
✅ 2) fetch() API를 통한 서버 응답 스트리밍    
✅ 3) AI, LLM(대형 언어 모델) 응답 스트리밍 (useStreamable 등 활용)   


SSE의 한계는 다음과 같다.  
- 1.data:{}라는 형식으로 불필요한 페이로드 및 가공 있음.  
- 2.Event Source API 필요하며, fetch 호환성 없음  
  - IE, RN, Serverless 미지원  
- 3.HTTP/1.1 전용이라 HTTP/2 미지원  
  - http/2 기반의 서버는 처리 불가  

즉, HTTP 버전 의존성, 플랫폼 의존성을 지우기 위해 자체적으로 커스터마이징한 NDJSON으로 스트리밍을 해결했다.
- 깔끔하고 단순해서 구현하기도 좋다.      

```js
// SSE to createStreamableValue  
import { createStreamableValue } from "ai";

async function fetchAIResponse() {
  const stream = createStreamableValue("");

  const response = await fetch("https://your-business-server.com/ai-stream");
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true });
      stream.update((prev) => prev + text);
    }
  }

  stream.done();
  return stream.value;
}
```
