# Frontend Tech for Agent App

## 이 문서를 작성하는 방식
문제점: 기술이나 라이브러리를 도입하기 전에 올바른 선택을 하려면 충분한 배경지식이 필요하다.

- AI가 가진 지식의 일부를 나의 지식 체계로 빠르게 체화하는 과정이 필요하다.
- 이 문서는 그 학습 방식을 정의한다.

기대 효과:

- 기존에는 새 기술을 배우는 데 오랜 시간이 걸렸다면, AI를 활용해 핵심 지식을 빠르게 문서화하고 best practice를 정리한다.
- 지식 데이터베이스를 구축한다.
- 이 컨텍스트를 바탕으로 AI에게 맡길 작업 단위와 스킬을 설정할 수 있다.

방법론:

- Step 1. 메타 지식 생성하기: AI에게 무엇을 모르는지 계속 물어본다.
- 책의 목차처럼 학습 인덱스를 만든다.
- Step 2. 인덱스를 바탕으로 책의 내용을 구체화한다.

## 목차

이 문서는 LangGraph + React로 agent frontend를 제로부터 구현하고, 최종적으로는 production에서 사용할 수 있는 chat agent급 기능까지 확장하기 위한 기술 기반 문서이다. 목차는 기술 학습 난이도에 맞춰 기초 개념, 최소 구현, 기능 확장, 운영 심화 순서로 진행한다.

### 0. 학습 목표와 완성 기준

- 최종 산출물: thread 기반 chat agent frontend
- 구현 레벨: prototype, internal tool, production chat agent
- 기능 범위: streaming, thread persistence, tool call, interrupt, 재접속, 취소, 에러 처리
- 학습 방식: 개념 이해 -> 최소 코드 -> UI 연결 -> agent 기능 확장 -> 운영 안정화

### 1. 선행 지식 체크리스트

- TypeScript 기본 타입과 async/await
- React client component, hook, state, effect
- Next.js App Router와 route handler
- HTTP API, SSE streaming, browser network lifecycle
- LLM chat message 구조: system, user, assistant, tool
- LangChain message와 tool calling의 기본 개념

### 2. 전체 그림 먼저 잡기

- LangGraph backend와 React frontend의 역할 분리
- graph, assistant, thread, run, checkpoint의 관계
- 사용자가 메시지를 보내고 응답을 받기까지의 end-to-end 흐름
- browser 직접 호출 구조와 Next.js proxy 구조 비교
- custom UI, assistant-ui, LangGraph SDK의 역할 구분

### 3. 개발 환경 세팅

- Node.js, package manager, TypeScript 버전 기준
- LangGraph backend package 설치
- React/Next.js frontend package 설치
- LangGraph local dev server 실행
- `.env.local`, server secret, public env 분리
- CORS와 proxy 기본 설정
- 프로젝트 폴더 구조 예시

### 4. LangGraph 핵심 개념 입문

- `StateGraph`란 무엇인가
- state schema와 reducer
- `messages` state의 표준 shape
- node, edge, conditional edge
- `START`, `END` 흐름
- graph input, output, config
- compile과 invoke

### 5. 가장 작은 graph 만들기

- echo graph 만들기
- LLM 없는 graph 실행
- graph input과 state update 확인
- local invoke로 동작 검증
- LangGraph dev server에서 graph 노출
- frontend 붙이기 전 backend만 테스트하는 방법

### 6. 최소 LLM chat graph 구현

- LLM node 붙이기
- system prompt 주입하기
- user message를 assistant response로 변환하기
- message reducer로 history 누적하기
- model config 관리하기
- streaming 없이 invoke부터 검증하기
- model error 처리의 최소 기준

### 7. LangGraph API 기본 사용

- assistant id와 graph id
- thread 생성과 조회
- thread state 조회
- run 생성과 조회
- run status 이해
- checkpoint와 thread history
- LangGraph SDK client를 언제 직접 쓰는가

### 8. React SDK 선택 기준

- `@langchain/react`의 `useStream`
- `@langchain/langgraph-sdk` client 직접 사용
- `@langchain/langgraph-sdk/react` legacy/호환 사용
- `@assistant-ui/react-langgraph` runtime 사용
- custom UI와 assistant-ui 선택 기준
- SDK를 project adapter로 감싸는 이유

### 9. React에서 최소 streaming 붙이기

- `useStream` 초기화
- `assistantId`, `threadId`, `apiUrl` 연결
- user message submit
- assistant message streaming render
- `isLoading`, `error`, `stop` 처리
- component unmount와 stream cleanup
- 새로고침 후 같은 thread state 복원 확인

### 10. 기본 Chat UI 구현

- message list
- user message와 assistant message 구분
- composer input
- enter/shift-enter 처리
- loading indicator
- empty state
- markdown rendering
- code block rendering
- scroll-to-bottom
- mobile layout과 접근성 기본

### 11. Thread 기본 관리

- 새 thread 만들기
- URL 기반 `threadId` 관리
- thread list sidebar
- thread 선택과 route 이동
- thread title 생성
- thread rename, archive, delete
- thread metadata 설계
- user와 thread ownership 연결

### 12. Thread Join과 재접속

- running 중인 thread에 다시 진입하는 문제
- checkpoint state로 화면 복원
- active run 조회
- 새 run 생성과 stream reattach 분리
- route 전환 시 thread switch
- 브라우저 새로고침 후 복구
- 네트워크 복구 후 reconnect
- 중복 submit 방지

### 13. Stream mode와 event 이해

- `messages` stream
- `values` stream
- `updates` stream
- `custom` stream
- token 단위 streaming과 message 단위 streaming
- stream event logging
- UI가 어떤 event를 source of truth로 삼아야 하는가

### 14. assistant-ui 적용

- assistant-ui 설치와 quickstart
- `AssistantRuntimeProvider`
- LangGraph runtime 연결
- 기본 `Thread` 컴포넌트 사용
- custom component로 교체하기
- message part customization
- cancellation과 feedback adapter
- assistant-ui를 쓰지 않아야 하는 경우

### 15. Tool calling agent 기초

- tool 정의 방식
- tool schema와 validation
- LLM tool call 감지
- `ToolNode` 사용
- tool result를 message로 합치기
- agent -> tool -> agent loop
- tool error 처리
- tool timeout과 cancellation

### 16. Tool call UI 구현

- tool call running 상태 표시
- tool input 요약 표시
- tool result 표시
- tool error 표시
- 여러 tool call 동시 표시
- tool call과 assistant message 연결
- 사용자에게 보여줄 tool 정보와 숨길 정보 구분

### 17. Human-in-the-loop

- interrupt 개념
- 승인/거절 UI
- form 입력 기반 resume
- tool execution 전 사용자 확인
- 민감 작업 confirmation
- interrupt state 저장
- resume payload schema
- interrupt 이후 streaming 재개

### 18. 상태 관리 전략

- React local state로 충분한 영역
- SDK stream state를 source of truth로 두는 영역
- server cache와 client cache 분리
- optimistic update 적용 기준
- message id 안정성
- duplicated message 제거
- stale state와 race condition 방지
- Zustand/Redux 같은 외부 store가 필요한 경우

### 19. Agent UX 고도화

- 실행 단계 timeline
- tool progress 표시
- artifact panel
- source citation panel
- file attachment
- image/file output
- message edit
- retry, regenerate, branch
- stop generating
- user feedback 수집

### 20. Generative UI와 custom stream

- graph node에서 frontend 전용 event emit
- progress event schema
- partial artifact streaming
- subgraph event 표시
- subagent 작업 상태 표시
- UI message와 state update 분리
- client-side component와 server event 매핑

### 21. Backend proxy와 보안

- browser에 API key를 노출하지 않는 구조
- Next.js route handler proxy
- SSE response pass-through
- user 인증과 thread authorization
- assistant id allowlist
- request rate limit
- tool 권한 제어
- prompt injection 방어를 위한 UI/metadata 처리
- PII redaction과 audit log

### 22. 에러 처리와 안정성

- model error
- tool error
- graph node error
- stream connection error
- timeout
- retry/backoff
- offline 상태 표시
- run cancel
- run conflict
- partial response 복구
- 사용자에게 보여줄 에러와 숨길 에러 구분

### 23. 테스트 전략

- graph unit test
- tool unit test
- API contract test
- stream event contract test
- React component test
- assistant-ui integration test
- Playwright E2E
- thread join regression test
- interrupt resume test
- network disconnect/reconnect test

### 24. 관측과 디버깅

- LangSmith trace 확인
- run id, thread id, user id 로깅
- stream event logging
- frontend error boundary
- performance profiling
- tool latency 측정
- message render latency 측정
- production issue 재현용 debug payload

### 25. 성능 최적화

- token streaming render frequency 제어
- 긴 message list virtualization
- markdown/code block lazy rendering
- large artifact lazy loading
- attachment upload progress
- 불필요한 stream subscription 줄이기
- React re-render 최적화
- SSE와 WebSocket 선택 기준

### 26. 배포와 운영

- local dev
- staging
- production
- LangSmith Cloud/LangGraph Platform 배포
- self-host LangGraph server 배포
- frontend 배포 환경 변수
- API proxy 배포
- health check
- release versioning
- rollback 전략

### 27. Code Snippets 모음

- project scaffold
- LangGraph graph template
- LLM chat graph template
- tool calling graph template
- LangGraph client setup
- React `useStream` hook wrapper
- assistant-ui runtime wrapper
- thread create/list/select snippets
- thread join snippets
- interrupt resume snippets
- Next.js proxy route
- stream event logger
- Playwright thread join test

### 28. Troubleshooting

- stream이 안 열리는 경우
- message가 중복으로 보이는 경우
- 새로고침 후 history가 사라지는 경우
- running thread에 새 run이 중복 생성되는 경우
- tool result가 UI에 안 보이는 경우
- interrupt 후 resume이 안 되는 경우
- proxy에서 SSE가 buffer되는 경우
- CORS 문제
- production에서 env가 다르게 잡히는 경우

### 29. 구현 로드맵과 참고 문서

- Milestone 1: LangGraph hello graph
- Milestone 2: LLM chat graph
- Milestone 3: React message streaming
- Milestone 4: thread 생성과 history 복원
- Milestone 5: thread join과 reconnect
- Milestone 6: tool calling agent
- Milestone 7: assistant-ui 적용
- Milestone 8: interrupt와 resume
- Milestone 9: attachment, artifact, citation
- Milestone 10: auth, proxy, authorization
- Milestone 11: test와 observability
- Milestone 12: production hardening

## 0. 학습 목표와 완성 기준

이 문서의 목표는 LangGraph와 React를 함께 써서 agent frontend를 처음부터 구현할 수 있는 기술 기반을 만드는 것이다. 최종 형태는 단순 LLM 채팅창이 아니라, thread 기반으로 대화 상태를 복원하고 실행 중인 run에 재진입하며 tool call, interrupt, 취소, 재접속, 에러 처리를 다룰 수 있는 chat agent이다.

LangGraph는 long-running, stateful agent를 만들기 위한 orchestration framework이다. frontend 입장에서는 이 말이 중요하다. React 화면은 단발성 API 응답만 렌더링하는 것이 아니라, thread에 저장된 graph state와 실행 중 stream event를 계속 동기화해야 한다.

### 최종 UX

- 사용자는 새 대화를 시작하고 기존 대화를 다시 열 수 있다.
- 같은 `threadId`로 들어오면 checkpoint state를 기준으로 이전 대화가 복원된다.
- assistant 응답은 streaming으로 표시된다.
- agent가 tool을 실행하면 tool name, input 요약, 진행 상태, 결과를 볼 수 있다.
- agent가 사용자 확인을 기다리면 interrupt UI가 표시된다.
- 사용자는 실행 중인 run을 중지할 수 있다.
- 네트워크 재연결, 새로고침, 라우트 이동 후에도 대화 상태가 깨지지 않는다.
- model error, tool error, stream error가 UI에서 구분된다.

### 완성 레벨

| 레벨 | 목표 | 완료 기준 |
|---|---|---|
| Level 1. Minimal | LangGraph와 React 연결 검증 | 단일 thread에서 user message를 submit하고 assistant response를 streaming으로 렌더링한다. |
| Level 2. Chat App | 기본 chat 제품 형태 | thread 생성, thread list, history 복원, loading, stop, retry, markdown rendering을 구현한다. |
| Level 3. Agent UI | agent 동작 가시화 | tool call, tool result, interrupt, artifact, citation, 실행 단계 timeline을 표시한다. |
| Level 4. Production | 서비스 운영 가능 | auth, proxy, authorization, reconnect, error recovery, test, observability, rate limit을 갖춘다. |

### 구현 순서의 원칙

처음부터 production 기능을 모두 붙이면 학습 난이도가 급격히 올라간다. 이 문서는 다음 순서로 진행한다.

1. LangGraph의 state, node, edge 개념을 이해한다.
2. LLM 없는 가장 작은 graph를 실행한다.
3. LLM chat graph를 만들고 server에서 검증한다.
4. React에서 `useStream`으로 streaming을 붙인다.
5. thread 생성과 history 복원을 붙인다.
6. tool calling과 tool call UI를 추가한다.
7. interrupt, reconnect, cancel, error recovery를 추가한다.
8. proxy, auth, test, observability로 운영 수준을 올린다.

### 이 문서에서 지킬 기준

- backend graph state가 source of truth이다.
- frontend는 graph state와 stream event를 렌더링하는 projection layer이다.
- `threadId`는 대화 복원의 핵심 key이다.
- `submit`은 새 run을 시작하는 행위이고, thread 복원이나 재접속과 섞지 않는다.
- browser에 API key 같은 secret을 노출하지 않는다.
- UI 구현은 custom React UI와 assistant-ui 두 경로를 모두 비교하되, 학습은 custom UI부터 시작한다.

## 1. 선행 지식 체크리스트

이 장은 본격 구현 전에 필요한 지식의 범위를 정리한다. 모든 항목을 깊게 알 필요는 없지만, 어떤 문제가 생겼을 때 어느 계층에서 원인을 찾아야 하는지는 구분할 수 있어야 한다.

### TypeScript

알아야 할 것:

- `type`, `interface`, generic
- `Promise`, `async/await`
- union type과 optional field
- object shape validation의 필요성
- React props와 event type

확인 질문:

- `threadId?: string`과 `threadId: string | undefined`의 차이를 설명할 수 있는가
- `Promise<Thread>`를 반환하는 함수를 React event handler에서 어떻게 호출하는지 아는가
- API 응답 type과 UI에서 쓰는 view model type을 분리해야 하는 이유를 아는가

### React와 Next.js

알아야 할 것:

- client component와 server component의 차이
- `useState`, `useEffect`, custom hook
- route param 기반 화면 구성
- form submit과 controlled input
- component unmount와 cleanup
- Next.js route handler의 역할

확인 질문:

- `threadId`가 바뀔 때 기존 stream state를 어떻게 정리할 것인가
- `useEffect`에서 async 함수를 직접 쓰지 않고 내부 함수를 만들어 호출하는 이유를 아는가
- API key가 필요한 요청을 browser에서 직접 보내면 안 되는 이유를 설명할 수 있는가

### HTTP와 streaming

알아야 할 것:

- HTTP request/response 기본 구조
- SSE와 일반 JSON response의 차이
- streaming 중 네트워크가 끊겼을 때 UI가 가져야 할 상태
- retry와 reconnect의 차이
- proxy가 streaming response를 buffer하면 생기는 문제

확인 질문:

- assistant 응답을 한 번에 받는 방식과 token 단위로 받는 방식의 UX 차이를 설명할 수 있는가
- route handler에서 SSE response를 그대로 넘겨야 하는 이유를 아는가
- offline에서 online으로 돌아왔을 때 같은 `threadId`로 무엇을 복구해야 하는가

### LLM chat message

알아야 할 것:

- `system`, `user`, `assistant`, `tool` message의 역할
- message history가 model input에 들어가는 방식
- tool call과 tool result의 관계
- 사람이 보는 message와 machine-readable artifact의 차이

확인 질문:

- system prompt를 매번 `messages` state에 누적하면 어떤 문제가 생기는가
- tool result를 assistant 답변과 같은 UI bubble로 보여줄지 별도 panel로 보여줄지 판단 기준이 있는가
- message id가 streaming UI에서 왜 중요한지 설명할 수 있는가

### LangGraph를 배우기 전에 잡아야 할 관점

LangGraph는 "프롬프트를 잘 보내는 라이브러리"가 아니다. graph state를 기준으로 여러 단계의 agent workflow를 실행하고, 그 과정의 state update를 저장하고 streaming하는 runtime에 가깝다.

따라서 frontend 학습의 핵심 질문은 다음이다.

- graph state 중 무엇을 화면에 보여줄 것인가
- 실행 중 update를 어떤 UI 상태로 바꿀 것인가
- thread state와 local React state가 충돌하지 않게 하려면 source of truth를 어디에 둘 것인가
- 사용자가 새로고침하거나 재진입했을 때 어떤 state를 복원할 것인가

## 2. 전체 그림 먼저 잡기

LangGraph + React agent frontend는 크게 backend graph, API runtime, React stream layer, Chat UI로 나뉜다. 각 계층이 맡는 일을 분리해야 구현이 단순해진다.

### end-to-end 흐름

```text
User
  -> Chat UI
  -> React stream hook
  -> LangGraph API Server
  -> Assistant
  -> Thread
  -> Run
  -> Compiled Graph
  -> LLM / Tools
  -> Checkpoint
  -> Stream Events
  -> Chat UI
```

이 흐름에서 frontend가 직접 제어하는 것은 Chat UI, stream hook, thread route 정도이다. graph 실행 순서, checkpoint 저장, tool loop, interrupt는 backend graph와 LangGraph runtime의 책임이다.

### 핵심 객체

| 객체 | 의미 | frontend에서 중요한 이유 |
|---|---|---|
| `graph` | node와 edge로 구성된 agent workflow | 어떤 state key가 UI로 흘러오는지 결정한다. |
| `assistant` | graph와 실행 config를 묶은 실행 단위 | frontend는 보통 `assistantId`로 어떤 agent를 실행할지 지정한다. |
| `thread` | 대화와 graph state를 저장하는 container | `threadId`가 history 복원과 재진입의 기준이 된다. |
| `run` | thread 위에서 agent가 한 번 실행되는 작업 | loading, stop, 중복 submit 방지의 기준이 된다. |
| `checkpoint` | graph state snapshot | 새로고침, interrupt, branch, replay의 기반이 된다. |
| `stream` | 실행 중 발생하는 event 흐름 | token, message, update, tool progress를 UI에 반영한다. |

### 새 대화 흐름

```text
Create Thread
  -> Navigate /agents/{threadId}
  -> User Submit
  -> Create Run
  -> Stream Response
  -> Persist Checkpoint
  -> Render Final State
```

새 대화를 만들 때 중요한 점은 먼저 thread를 만들고 그 `threadId`를 route에 고정하는 것이다. user message submit은 그다음 단계이다. thread 생성과 run 생성을 섞으면 새로고침이나 retry에서 상태가 꼬이기 쉽다.

### 기존 대화 진입 흐름

```text
Open /agents/{threadId}
  -> Hydrate Thread State
  -> Render Existing Messages
  -> Check Active Run
  -> Reattach or Keep Idle
```

기존 대화에 들어왔을 때는 새 run을 자동으로 만들지 않는다. 먼저 checkpoint state를 보여주고, active run이 있으면 running UI를 이어받는다. 사용자가 새 메시지를 보낼 때만 `submit`으로 run을 시작한다.

### 라이브러리 역할

| 라이브러리 | 역할 | 기본 사용 위치 |
|---|---|---|
| `@langchain/langgraph` | graph 정의와 compile | backend graph |
| `@langchain/langgraph-sdk` | thread, run, assistant API client | server route, admin action, low-level client |
| `@langchain/react` | React에서 stream state를 다루는 hook | custom React chat UI |
| `@assistant-ui/react-langgraph` | assistant-ui와 LangGraph runtime 연결 | 완성형 chat UI |
| `@assistant-ui/react` | chat UI component/runtime framework | assistant-ui 기반 frontend |

학습 단계에서는 `@langchain/react`로 custom UI를 직접 만들어 stream과 state를 이해한다. 이후 실제 제품 개발에서 assistant-ui를 적용하면 message list, composer, cancellation, feedback, thread UI 같은 반복 작업을 줄일 수 있다.

### 직접 호출과 proxy 구조

local prototype에서는 browser에서 LangGraph local server를 직접 호출해도 된다.

```text
Browser -> LangGraph Local Server
```

운영 환경에서는 Next.js route handler를 proxy로 둔다.

```text
Browser -> /api/langgraph/* -> LangGraph API Server
```

proxy 구조가 필요한 이유:

- API key를 browser에 노출하지 않는다.
- user가 접근 가능한 `threadId`인지 확인한다.
- assistant id allowlist를 강제한다.
- rate limit과 audit log를 적용한다.
- SSE response를 서비스 도메인에서 안정적으로 전달한다.

### 10% 지점 완료 기준

여기까지 이해했다면 아직 코드를 많이 쓰지 않아도 된다. 다음 질문에 답할 수 있으면 10% 지점은 완료된 것이다.

- LangGraph frontend에서 `threadId`가 왜 중요한가
- `thread`와 `run`의 차이는 무엇인가
- React local state와 graph state 중 무엇을 source of truth로 둘 것인가
- 새 대화 생성과 user message submit을 왜 분리해야 하는가
- production에서 browser가 LangGraph API를 직접 호출하지 않게 해야 하는 이유는 무엇인가

## 3. 개발 환경 세팅

이 단계의 목표는 backend graph와 frontend app을 같은 workspace에서 개발할 수 있게 만드는 것이다. 아직 LLM이나 UI 완성도는 중요하지 않다. 중요한 것은 LangGraph dev server가 graph를 노출하고, React app이 그 server에 접근할 수 있는 기본 연결을 만드는 것이다.

### 권장 개발 구성

```text
Next.js App
  -> React Chat UI
  -> @langchain/react
  -> LangGraph API Server
  -> src/agent/graph.ts
```

local prototype에서는 browser가 LangGraph local server를 직접 호출해도 된다. 운영에서는 `/api/langgraph/*` 같은 Next.js proxy를 둔다.

### package 설치

backend graph와 LangGraph API client에 필요한 package:

```bash
npm install @langchain/langgraph @langchain/core @langchain/langgraph-sdk
```

React streaming UI에 필요한 package:

```bash
npm install @langchain/react
```

LLM provider는 사용하는 모델에 맞게 설치한다. OpenAI 계열 모델을 쓰는 예시는 다음과 같다.

```bash
npm install @langchain/openai
```

assistant-ui를 붙일 때만 다음 package를 추가한다.

```bash
npm install @assistant-ui/react @assistant-ui/react-langgraph
```

### 환경 변수

환경 변수는 browser에 공개 가능한 값과 server에서만 읽어야 하는 값을 분리한다.

```bash
# browser에서 읽을 수 있는 값
NEXT_PUBLIC_LANGGRAPH_API_URL=http://localhost:2024
NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID=agent

# server에서만 읽는 값
LANGGRAPH_API_URL=http://localhost:2024
LANGGRAPH_API_KEY=
LANGSMITH_TRACING=true
LANGSMITH_API_KEY=
CHAT_MODEL=gpt-4.1-mini
```

운영 환경에서 LangGraph API key가 필요하면 browser가 실제 LangGraph endpoint를 직접 호출하지 않게 한다.

```bash
NEXT_PUBLIC_LANGGRAPH_API_URL=/api/langgraph
LANGGRAPH_API_URL=https://your-langgraph-server.example.com
LANGGRAPH_API_KEY=...
```

### 프로젝트 구조

초기에는 구조를 작게 시작한다. agent graph, route, UI component를 섞지 않는 것이 중요하다.

```text
src/
  agent/
    graph.ts
    state.ts
    tools.ts
  app/
    agents/
      page.tsx
      [threadId]/
        page.tsx
        thread.tsx
    api/
      langgraph/
        [...path]/
          route.ts
  components/
    chat/
      message-list.tsx
      composer.tsx
      tool-call-card.tsx
```

각 폴더의 역할:

| 경로 | 역할 |
|---|---|
| `src/agent/state.ts` | graph state schema와 reducer 정의 |
| `src/agent/graph.ts` | LangGraph graph compile과 export |
| `src/agent/tools.ts` | tool 정의 |
| `app/agents/[threadId]/thread.tsx` | 특정 thread를 렌더링하는 client component |
| `app/api/langgraph/[...path]/route.ts` | 운영용 LangGraph proxy |
| `components/chat/*` | graph와 무관한 순수 UI component |

### LangGraph server 설정

LangGraph dev server가 graph export를 찾을 수 있도록 `langgraph.json`을 둔다.

```json
{
  "node_version": "20",
  "dependencies": ["."],
  "graphs": {
    "agent": "./src/agent/graph.ts:graph"
  },
  "env": ".env"
}
```

개발 스크립트는 package manager에 맞춰 고정한다.

```json
{
  "scripts": {
    "dev:web": "next dev",
    "dev:graph": "npx @langchain/langgraph-cli dev --config langgraph.json --port 2024"
  }
}
```

실행 순서:

```bash
npm run dev:graph
npm run dev:web
```

### 세팅 완료 기준

- LangGraph dev server가 `http://localhost:2024`에서 열린다.
- `langgraph.json`의 `agent` graph가 인식된다.
- Next.js app에서 `NEXT_PUBLIC_LANGGRAPH_API_URL`을 읽을 수 있다.
- browser secret과 server secret이 분리되어 있다.
- 이후 장에서 graph 코드를 바꿔도 server가 해당 export를 찾을 수 있다.

## 4. LangGraph 핵심 개념 입문

LangGraph frontend를 안정적으로 만들려면 backend graph가 어떤 state를 만들고 어떻게 저장하는지 먼저 이해해야 한다. React UI는 결국 graph state와 stream event를 화면에 투영하는 layer이다.

### State

state는 graph 전체가 공유하는 데이터이다. chat agent에서 가장 중요한 state는 `messages`이다.

```ts
// src/agent/state.ts
import { MessagesValue, StateSchema } from "@langchain/langgraph";
import * as z from "zod";

export const AgentState = new StateSchema({
  messages: MessagesValue,
  activeTool: z.string().optional(),
  artifact: z
    .object({
      id: z.string(),
      kind: z.string(),
      title: z.string(),
      content: z.unknown(),
    })
    .optional(),
});
```

state 설계 원칙:

- `messages`는 대화 history의 source of truth로 둔다.
- checkpoint에 저장되어야 하는 값과 streaming 중에만 필요한 값을 구분한다.
- UI 전용 progress는 가능하면 `updates` 또는 `custom` stream으로 보낸다.
- tool result는 사람이 볼 message와 machine-readable artifact를 분리한다.
- message id는 중복 제거, retry, edit, branch 기능의 기반이므로 안정적으로 유지한다.

### Node

node는 state를 입력으로 받고 state update를 반환하는 함수이다.

```ts
import { GraphNode } from "@langchain/langgraph";
import { AgentState } from "./state";

export const greet: GraphNode<typeof AgentState> = async () => {
  return {
    messages: [{ role: "ai", content: "안녕하세요. 무엇을 도와드릴까요?" }],
  };
};
```

node가 반환하는 값은 전체 state가 아니라 변경분이다. LangGraph는 reducer를 통해 기존 state와 node의 update를 합친다.

### Edge

edge는 node 사이의 실행 순서를 정의한다.

```ts
import { END, START, StateGraph } from "@langchain/langgraph";
import { AgentState } from "./state";
import { greet } from "./nodes";

export const graph = new StateGraph(AgentState)
  .addNode("greet", greet)
  .addEdge(START, "greet")
  .addEdge("greet", END)
  .compile();
```

단순 graph는 `START -> node -> END`로 끝난다. agent graph는 LLM 응답에 tool call이 있는지 확인하고, 조건에 따라 tool node로 보내는 conditional edge를 사용한다.

### Compile

`compile()`은 graph 정의를 실행 가능한 compiled graph로 만든다. frontend에서 직접 compile하지 않는다. frontend는 LangGraph API server에 배포된 compiled graph를 `assistantId`로 실행한다.

```text
StateGraph Definition
  -> compile()
  -> Compiled Graph
  -> LangGraph API Server
  -> React Stream
```

### Thread와 checkpoint

thread는 graph state를 저장하는 persistent container이다. checkpoint는 특정 시점의 state snapshot이다.

frontend에서 이 개념이 중요한 이유:

- 새로고침 후 같은 `threadId`로 들어오면 checkpoint state를 복원할 수 있다.
- 실행 중 interrupt가 발생하면 checkpoint를 기준으로 resume할 수 있다.
- message edit, retry, branch 같은 기능은 checkpoint history 위에서 구현된다.
- running thread에 다시 들어왔을 때 새 run을 만들지 않고 기존 상태를 이어받아야 한다.

### Stream

stream은 run 실행 중 frontend로 전달되는 event 흐름이다. UI는 final response만 기다리지 않고 stream event를 사용해 중간 상태를 보여준다.

대표 stream 범위:

- `messages`: assistant message와 token streaming
- `values`: graph state의 최신 값
- `updates`: node 단위 state update
- `custom`: frontend 전용 custom event
- `tools`: tool call progress

stream mode별 사용법은 뒤의 `13. Stream mode와 event 이해`에서 자세히 다룬다.

## 5. 가장 작은 graph 만들기

이 단계에서는 LLM을 붙이지 않는다. 먼저 LangGraph가 state를 받고, node를 실행하고, state update를 반환하는 흐름만 검증한다. LLM을 붙이기 전 이 단계가 동작해야 이후 문제를 계층별로 분리할 수 있다.

### state 정의

```ts
// src/agent/state.ts
import { MessagesValue, StateSchema } from "@langchain/langgraph";

export const AgentState = new StateSchema({
  messages: MessagesValue,
});
```

### echo node

```ts
// src/agent/graph.ts
import { END, GraphNode, START, StateGraph } from "@langchain/langgraph";
import { AgentState } from "./state";

const echo: GraphNode<typeof AgentState> = async (state) => {
  const lastMessage = state.messages.at(-1);
  const content =
    typeof lastMessage?.content === "string"
      ? lastMessage.content
      : "메시지를 이해하지 못했습니다.";

  return {
    messages: [
      {
        role: "ai",
        content: `echo: ${content}`,
      },
    ],
  };
};

export const graph = new StateGraph(AgentState)
  .addNode("echo", echo)
  .addEdge(START, "echo")
  .addEdge("echo", END)
  .compile();
```

### local invoke 검증

frontend를 붙이기 전에 graph를 직접 실행한다.

```ts
import { graph } from "./graph";

async function main() {
  const result = await graph.invoke({
    messages: [{ role: "user", content: "테스트 메시지" }],
  });

  console.log(result.messages.at(-1));
}

main().catch(console.error);
```

기대 결과:

```text
ai: echo: 테스트 메시지
```

### LangGraph dev server에서 확인

`langgraph.json`이 다음 export를 바라보는지 확인한다.

```json
{
  "graphs": {
    "agent": "./src/agent/graph.ts:graph"
  }
}
```

dev server를 실행한다.

```bash
npm run dev:graph
```

이 단계에서 확인할 것:

- graph export 이름이 `graph`와 일치하는가
- `agent` assistant id로 graph를 실행할 수 있는가
- input message가 state에 들어오는가
- node가 state update를 반환하는가
- 반환된 assistant message가 `messages`에 누적되는가

### 20% 지점 완료 기준

여기까지 완료하면 LangGraph + React 구현의 기초 환경과 backend graph 실행 흐름을 갖춘 것이다.

- package와 env가 분리되어 있다.
- LangGraph dev server가 실행된다.
- `StateGraph`, state, node, edge, compile의 역할을 설명할 수 있다.
- LLM 없는 echo graph를 실행할 수 있다.
- `threadId`, `run`, `checkpoint`, `stream`이 frontend에서 왜 중요한지 설명할 수 있다.

## 6. 최소 LLM chat graph 구현

다음 목표는 tool 없는 LLM chat graph를 만드는 것이다. 이 단계에서는 UI보다 backend graph가 안정적으로 message state를 업데이트하는지 검증한다. graph가 안정적이어야 React streaming 문제와 LLM 호출 문제를 분리해서 디버깅할 수 있다.

### 이 장의 목표

- user message를 받아 LLM에 전달한다.
- assistant response를 `messages` state에 누적한다.
- system prompt를 state에 저장하지 않고 호출 시점에만 주입한다.
- local invoke로 graph 동작을 먼저 확인한다.
- LangGraph dev server에서 실행 가능한 graph export를 유지한다.

### state 재사용

앞에서 만든 최소 state를 그대로 사용한다.

```ts
// src/agent/state.ts
import { MessagesValue, StateSchema } from "@langchain/langgraph";

export const AgentState = new StateSchema({
  messages: MessagesValue,
});
```

`MessagesValue`는 chat message list에 맞는 reducer를 제공한다. node가 `{ messages: [newMessage] }`를 반환하면 기존 messages를 덮어쓰는 것이 아니라 message-aware 방식으로 합쳐진다.

### LLM node

LLM node는 state의 message history를 읽고 assistant message 하나를 반환한다.

```ts
// src/agent/graph.ts
import { END, GraphNode, START, StateGraph } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage } from "@langchain/core/messages";
import { AgentState } from "./state";

const model = new ChatOpenAI({
  model: process.env.CHAT_MODEL ?? "gpt-4.1-mini",
  temperature: 0.2,
});

const callModel: GraphNode<typeof AgentState> = async (state) => {
  const response = await model.invoke([
    new SystemMessage("You are a concise and practical assistant."),
    ...state.messages,
  ]);

  return {
    messages: [response],
  };
};

export const graph = new StateGraph(AgentState)
  .addNode("call_model", callModel)
  .addEdge(START, "call_model")
  .addEdge("call_model", END)
  .compile();
```

중요한 점은 system prompt를 `messages` state에 직접 누적하지 않는 것이다. system prompt를 state에 계속 넣으면 같은 thread에서 run이 반복될 때 system message가 중복될 수 있다.

### local invoke 검증 스크립트

frontend를 붙이기 전 graph를 직접 실행한다.

```ts
// src/agent/dev-invoke.ts
import { graph } from "./graph";

const result = await graph.invoke({
  messages: [{ role: "user", content: "LangGraph를 한 문장으로 설명해줘." }],
});

for (const message of result.messages) {
  console.log(`${message.getType()}: ${message.content}`);
}
```

예상 흐름:

```text
human: LangGraph를 한 문장으로 설명해줘.
ai: ...
```

이 단계에서 확인할 것:

- `messages`에 user message와 assistant message가 모두 누적되는가
- assistant response가 LangChain message shape로 들어오는가
- system prompt가 매 요청에 중복 저장되지 않는가
- model error가 발생했을 때 graph node에서 어떻게 처리할 것인가

### 최소 error 처리

초기 단계에서는 error를 숨기지 않는다. graph node에서 error를 삼키면 frontend는 정상 응답과 실패를 구분하기 어려워진다.

```ts
const callModel: GraphNode<typeof AgentState> = async (state) => {
  try {
    const response = await model.invoke([
      new SystemMessage("You are a concise and practical assistant."),
      ...state.messages,
    ]);

    return { messages: [response] };
  } catch (error) {
    console.error("call_model failed", error);
    throw error;
  }
};
```

production에서는 model error를 그대로 사용자에게 노출하지 않는다. 그러나 learning 단계에서는 error boundary와 stream error 처리를 검증할 수 있도록 실패를 명확하게 전파한다.

### dev server 확인

`langgraph.json`의 graph export는 계속 같은 이름을 유지한다.

```json
{
  "graphs": {
    "agent": "./src/agent/graph.ts:graph"
  }
}
```

dev server에서 `agent` graph가 보이고, invoke 결과가 local script와 동일한 message shape를 반환하면 다음 단계로 넘어간다.

### 이 단계의 완료 기준

- `CHAT_MODEL` 없이도 fallback model 값이 있다.
- user message가 model input에 들어간다.
- system prompt는 호출 시점에만 주입된다.
- assistant message가 `messages` state에 누적된다.
- model 호출 실패가 숨겨지지 않는다.
- graph export가 LangGraph dev server에서 계속 인식된다.

## 7. LangGraph API 기본 사용

React frontend는 대부분 `@langchain/react` hook으로 충분하다. 그러나 thread list, active run 조회, thread metadata, server-side authorization, low-level stream debugging에는 LangGraph SDK client가 필요하다.

### API를 직접 쓰는 경우

| 목적 | 권장 위치 |
|---|---|
| thread 생성 | server action 또는 route handler |
| thread list 조회 | server route 또는 authenticated page loader |
| thread ownership 검증 | server route |
| thread state/history 조회 | debugging, retry, branch UI |
| low-level stream 검증 | Node script, test, admin tool |
| browser chat streaming | `@langchain/react` 우선 |

browser에서 SDK client를 직접 만들 수는 있지만, API key가 필요한 운영 환경에서는 server proxy를 거쳐야 한다.

### client 생성

server에서 사용하는 client:

```ts
// src/agent/langgraph-client.ts
import { Client } from "@langchain/langgraph-sdk";

export const langGraphClient = new Client({
  apiUrl: process.env.LANGGRAPH_API_URL ?? "http://localhost:2024",
  apiKey: process.env.LANGGRAPH_API_KEY,
});
```

browser에서 직접 호출하는 client는 secret을 넣지 않는다.

```ts
import { Client } from "@langchain/langgraph-sdk";

export const browserLangGraphClient = new Client({
  apiUrl: process.env.NEXT_PUBLIC_LANGGRAPH_API_URL!,
});
```

운영에서는 `NEXT_PUBLIC_LANGGRAPH_API_URL=/api/langgraph`처럼 proxy endpoint를 가리키게 한다.

### assistant id와 graph id

local dev에서는 `langgraph.json`에 등록한 graph key가 assistant id처럼 쓰이는 경우가 많다.

```json
{
  "graphs": {
    "agent": "./src/agent/graph.ts:graph"
  }
}
```

frontend에서는 이 값을 `NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID=agent`로 맞춘다.

```ts
const assistantId = process.env.NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID ?? "agent";
```

운영에서 assistant를 별도 생성하거나 versioning하면 assistant id가 UUID 또는 배포별 id가 될 수 있다. 그래서 frontend 코드에 `"agent"`를 직접 박지 않고 env 또는 server config에서 주입한다.

### thread 생성

thread는 대화 상태를 저장하는 container이다. 새 대화를 만들 때 먼저 thread를 만든 뒤 route를 이동한다.

```ts
export async function createAgentThread(userId: string) {
  return langGraphClient.threads.create({
    metadata: {
      userId,
      graphId: "agent",
    },
  });
}
```

반환값의 `thread_id`를 `/agents/{threadId}` route에 사용한다.

### thread 조회

```ts
export async function getAgentThread(threadId: string) {
  return langGraphClient.threads.get(threadId);
}
```

### thread state 조회

현재 thread의 graph state를 확인한다. history 복원, debugging, interrupt 상태 확인에 사용한다.

```ts
export async function getAgentThreadState(threadId: string) {
  return langGraphClient.threads.getState(threadId);
}
```

주로 보는 값:

- `values.messages`: 현재 message history
- `next`: 다음에 실행할 node
- `tasks`: interrupt나 pending task
- `checkpoint_id`: 현재 state snapshot

### thread history 조회

checkpoint history는 retry, branch, edit, time travel UI의 기반이다.

```ts
export async function getAgentThreadHistory(threadId: string) {
  return langGraphClient.threads.getHistory(threadId, {
    limit: 20,
  });
}
```

### thread list

thread sidebar를 만들 때는 metadata로 사용자 thread를 필터링한다.

```ts
export async function listUserThreads(userId: string) {
  return langGraphClient.threads.search({
    metadata: { userId },
    limit: 50,
  });
}
```

정렬 옵션은 SDK 버전마다 표기 차이가 있을 수 있으므로 프로젝트에서 사용하는 SDK 타입을 기준으로 확인한다. thread sidebar 구현에서는 일단 `updated_at` 또는 `updatedAt` 기준으로 client-side sort를 적용해도 된다.

### low-level thread stream

React UI에서는 `@langchain/react`를 쓰지만, SDK 동작을 이해하거나 CLI/test를 만들 때는 `client.threads.stream(...)`을 직접 사용할 수 있다.

```ts
import { Client } from "@langchain/langgraph-sdk";

const client = new Client({
  apiUrl: "http://localhost:2024",
});

const thread = client.threads.stream({
  assistantId: "agent",
});

await thread.run.start({
  input: {
    messages: [{ role: "user", content: "hello" }],
  },
});

for await (const message of thread.messages) {
  for await (const token of message.text) {
    process.stdout.write(token);
  }
}

console.log(await thread.output);
await thread.close();
```

기존 thread에 붙을 때는 thread id를 함께 넘긴다.

```ts
const thread = client.threads.stream(threadId, {
  assistantId: "agent",
});
```

신규 코드에서는 `client.runs.stream`, `client.runs.joinStream`, `client.threads.joinStream`보다 thread-centric `client.threads.stream(...)`을 우선 검토한다. run 기반 API는 기존 코드 유지나 특수한 운영 케이스에서만 사용한다.

### lifecycle 상태 모델

frontend에서 상태를 명확히 구분해야 중복 run과 깨진 UI를 줄일 수 있다.

| 상태 | 의미 | UI 처리 |
|---|---|---|
| idle | 실행 중인 run 없음 | composer 활성화 |
| loading thread | thread state hydrate 중 | skeleton 또는 spinner |
| busy | run 실행 중 | stop 활성화, submit 제한 |
| interrupted | 사용자 입력 대기 | interrupt form 표시 |
| error | run 또는 stream 실패 | retry/새로고침/진단 메시지 |

### 이 단계의 완료 기준

- server-only LangGraph client와 browser client의 차이를 설명할 수 있다.
- thread 생성 후 route 이동 흐름을 구현할 수 있다.
- thread state와 thread history를 조회할 수 있다.
- SDK low-level stream과 React stream hook의 역할을 구분할 수 있다.
- run lifecycle 상태를 UI 상태로 매핑할 수 있다.

## 8. React SDK 선택 기준

React frontend에서는 SDK 선택이 중요하다. 같은 LangGraph backend를 써도 "직접 custom UI를 만들 것인가", "assistant-ui를 쓸 것인가", "server route에서 low-level client를 쓸 것인가"에 따라 선택지가 달라진다.

### `@langchain/react`

새 custom React UI를 만들 때 기본 선택지로 둔다. v1 기준으로 root `useStream`이 thread lifecycle, messages, tool calls, interrupts, loading/error 상태를 제공한다. remount 시 자동 reattach를 지원하므로 예전처럼 `joinStream`을 직접 호출하는 흐름을 기본값으로 두지 않는다.

사용 기준:

- 직접 Chat UI를 만들고 싶다.
- LangGraph 외에 LangChain agent/deep agent와도 호환성을 보고 싶다.
- remount/reconnect 같은 stream lifecycle을 SDK에 맡기고 싶다.
- root hook의 `messages`, `values`, `toolCalls`, `interrupts` projection을 쓰고 싶다.

```tsx
import { useStream } from "@langchain/react";

const stream = useStream({
  apiUrl: process.env.NEXT_PUBLIC_LANGGRAPH_API_URL!,
  assistantId: process.env.NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID!,
  threadId,
});
```

project hook으로 감싸면 SDK 교체나 proxy 정책 변경이 쉬워진다.

```tsx
"use client";

import { useStream } from "@langchain/react";

export function useAgentStream(threadId: string) {
  return useStream({
    apiUrl: process.env.NEXT_PUBLIC_LANGGRAPH_API_URL!,
    assistantId: process.env.NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID!,
    threadId,
  });
}
```

### `@assistant-ui/react-langgraph`

완성형 chat UI와 runtime을 빠르게 붙이고 싶을 때 사용한다. assistant-ui의 LangGraph runtime은 LangGraph SDK와 직접 통합되고, streaming, metadata, subgraph events, interrupt, cancellation 같은 chat UI 기능을 runtime 레벨에서 제공한다.

사용 기준:

- ChatGPT 스타일 UI를 빠르게 만들고 싶다.
- message part, attachment, feedback, thread UI를 framework로 가져가고 싶다.
- 직접 message list/composer를 만들 시간이 없다.
- design system 위에 빠르게 agent UI를 얹고 싶다.

기본 구조:

```tsx
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useLangGraphRuntime } from "@assistant-ui/react-langgraph";
import { Thread } from "@/components/assistant-ui/thread";

const runtime = useLangGraphRuntime({
  apiUrl: process.env.NEXT_PUBLIC_LANGGRAPH_API_URL!,
  assistantId: process.env.NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID!,
  threadId,
});

return (
  <AssistantRuntimeProvider runtime={runtime}>
    <Thread />
  </AssistantRuntimeProvider>
);
```

### `@langchain/langgraph-sdk`

React hook이 아니라 low-level client다. server route, script, admin function, thread list, metadata update, explicit stream 제어에 사용한다.

사용 기준:

- Next.js server route에서 LangGraph API를 proxy하거나 호출한다.
- thread 검색, state 조회, history 조회가 필요하다.
- React 밖에서 graph를 실행하거나 stream을 직접 소비한다.
- test나 CLI에서 thread-centric stream을 검증하고 싶다.

### `@langchain/langgraph-sdk/react`

LangGraph SDK의 React adapter다. 기존 코드나 특정 LangGraph SDK API와 맞춰야 할 때 유용하다. 다만 새 custom UI에서는 `@langchain/react` v1을 우선 검토하고, assistant-ui는 `@assistant-ui/react-langgraph`를 사용한다.

특히 기존 문서나 예제에서 `joinStream`을 볼 수 있는데, 신규 custom UI의 기본 설계에서는 이를 직접 호출하는 흐름을 피한다. `@langchain/react`는 mount/remount와 thread lifecycle을 root hook에서 관리한다.

### 선택 규칙

| 요구사항 | 추천 |
|---|---|
| UI를 직접 만든다 | `@langchain/react` |
| 완성형 chat UI를 쓴다 | `@assistant-ui/react-langgraph` |
| server route에서 thread/run을 다룬다 | `@langchain/langgraph-sdk` |
| 기존 LangGraph SDK React 코드 유지 | `@langchain/langgraph-sdk/react` |

### 학습 순서 기준 선택

학습 단계에서는 다음 순서가 좋다.

1. `@langchain/react`로 직접 message list와 composer를 만든다.
2. thread state, loading, error, stop, reconnect의 원리를 이해한다.
3. assistant-ui를 붙여 반복 UI를 줄인다.
4. 운영에서는 `@langchain/langgraph-sdk`를 server route에 두고 auth/proxy/authorization을 처리한다.

### 30% 지점 완료 기준

여기까지 완료하면 backend LLM graph, LangGraph API client, React SDK 선택 기준까지 잡힌 것이다.

- LLM chat graph가 local invoke로 동작한다.
- system prompt와 message state를 분리해서 설계할 수 있다.
- thread 생성, state 조회, history 조회의 목적을 설명할 수 있다.
- `client.threads.stream(...)`과 `@langchain/react`의 역할 차이를 설명할 수 있다.
- custom UI와 assistant-ui 중 어떤 경로를 선택할지 판단할 수 있다.

## 9. React에서 최소 streaming 붙이기

이 단계의 목표는 React 화면에서 user message를 submit하고 assistant 응답이 streaming되는 것을 보는 것이다. 아직 UI 완성도는 중요하지 않다. 중요한 것은 `threadId`, `useStream`, `submit`, `messages`, `isLoading`, `error`, `stop`의 관계를 몸으로 익히는 것이다.

### 구현 흐름

```text
/agents/{threadId}
  -> AgentThread
  -> useAgentStream(threadId)
  -> stream.submit({ messages })
  -> LangGraph run
  -> stream.messages 업데이트
  -> MessageList 렌더링
```

이 단계에서 새 run을 만드는 행위는 `submit` 하나로 제한한다. 화면 mount, 새로고침, route 진입 시 자동으로 `submit`을 호출하지 않는다.

### thread route

`threadId`는 URL에 두는 것이 가장 단순하다.

```tsx
// app/agents/[threadId]/page.tsx
import { AgentThread } from "./thread";

export default async function Page({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  return <AgentThread threadId={threadId} />;
}
```

route에 `threadId`가 들어가면 새로고침, 공유 URL, thread 재진입을 같은 기준으로 처리할 수 있다.

### stream hook wrapper

SDK hook을 화면 곳곳에서 직접 초기화하지 말고 project hook으로 감싼다.

```tsx
// app/agents/[threadId]/use-agent-stream.ts
"use client";

import { useStream } from "@langchain/react";

export function useAgentStream(threadId: string) {
  return useStream({
    apiUrl: process.env.NEXT_PUBLIC_LANGGRAPH_API_URL!,
    assistantId: process.env.NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID!,
    threadId,
  });
}
```

wrapper를 두는 이유:

- API URL과 assistant id를 한 곳에서 관리한다.
- proxy 전환 시 component 코드를 고치지 않는다.
- later stage에서 auth header, custom transport, logging을 붙이기 쉽다.
- SDK 교체가 필요할 때 변경 범위가 줄어든다.

### 최소 thread component

```tsx
// app/agents/[threadId]/thread.tsx
"use client";

import { FormEvent, useState } from "react";
import { useAgentStream } from "./use-agent-stream";

export function AgentThread({ threadId }: { threadId: string }) {
  const stream = useAgentStream(threadId);
  const [input, setInput] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const content = input.trim();
    if (!content || stream.isLoading) return;

    setInput("");

    await stream.submit({
      messages: [{ type: "human", content }],
    });
  }

  return (
    <section>
      <div aria-live="polite">
        {stream.messages.map((message) => (
          <article key={message.id ?? `${message.type}:${message.content}`}>
            <strong>{message.type}</strong>
            <pre>{String(message.content)}</pre>
          </article>
        ))}
      </div>

      {stream.error ? <p role="alert">응답 생성 중 오류가 발생했습니다.</p> : null}

      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={stream.isLoading}
        />
        <button type="submit" disabled={stream.isLoading || !input.trim()}>
          Send
        </button>
        {stream.isLoading ? (
          <button type="button" onClick={() => stream.stop()}>
            Stop
          </button>
        ) : null}
      </form>
    </section>
  );
}
```

이 코드는 제품 UI가 아니라 stream 연결 검증용이다. message content가 array block 형태로 들어오는 경우 `String(message.content)`는 충분하지 않다. 다음 `10장`에서 message renderer를 분리한다.

### streaming render 기준

- `stream.messages`: UI에 렌더링할 message list이다.
- `stream.values`: graph의 최신 state projection이다.
- `stream.toolCalls`: tool call과 result를 렌더링할 때 사용한다.
- `stream.interrupts`: human-in-the-loop UI를 표시할 때 사용한다.
- `stream.isLoading`: run streaming 중인지 판단한다.
- `stream.error`: stream 또는 run error를 표시한다.
- `stream.stop()`: 실행 중인 run을 취소한다.
- `stream.submit(...)`: thread에 새 input을 넣고 run을 시작한다.

### submit 정책

가장 단순한 정책은 실행 중 추가 submit을 막는 것이다.

```tsx
async function submit(content: string) {
  if (stream.isLoading) return;

  await stream.submit({
    messages: [{ type: "human", content }],
  });
}
```

나중에 queue를 허용할 수는 있다. 하지만 처음부터 queue를 만들면 thread/run 상태가 복잡해진다. 기본 chat agent에서는 running 중 composer를 disable 하고, 사용자가 `Stop` 또는 run 완료 후 다시 submit하게 만드는 편이 안전하다.

### stop 처리

streaming 중에는 stop 버튼을 노출한다.

```tsx
{stream.isLoading ? (
  <button type="button" onClick={() => stream.stop()}>
    Stop
  </button>
) : null}
```

`stop()`은 UI의 loading 상태만 내리는 기능이 아니라 실행 중인 run 취소와 연결된다. stop 이후에는 partial message가 남을 수 있으므로, UI에서는 "중단됨" 상태를 표시하거나 다음 submit을 허용하는 정책을 정한다.

### error 처리

최소 구현에서도 error를 숨기지 않는다.

```tsx
{stream.error ? (
  <p role="alert">
    응답 생성 중 오류가 발생했습니다.
  </p>
) : null}
```

개발 단계에서는 console에도 error를 남긴다.

```tsx
useEffect(() => {
  if (stream.error) {
    console.error("agent stream error", stream.error);
  }
}, [stream.error]);
```

### hydration 확인

같은 `threadId`로 다시 들어왔을 때 이전 message가 복원되어야 한다.

확인 순서:

1. `/agents/{threadId}`에서 메시지를 보낸다.
2. assistant response가 끝날 때까지 기다린다.
3. browser를 새로고침한다.
4. user message와 assistant message가 다시 보이는지 확인한다.

복원되지 않으면 다음을 확인한다.

- 같은 `threadId`로 들어왔는가
- LangGraph server가 checkpoint를 저장하고 있는가
- `assistantId`가 올바른 graph를 가리키는가
- `messages` state가 graph에서 실제로 업데이트되는가

### 이 단계의 완료 기준

- 새 thread에서 user message를 submit할 수 있다.
- assistant message가 streaming으로 표시된다.
- 새로고침 후 같은 `threadId`에서 message가 복원된다.
- `isLoading` 중 submit이 중복 실행되지 않는다.
- `stop()`이 UI에 연결된다.
- error가 최소한 `role="alert"`로 노출된다.

## 10. 기본 Chat UI 구현

이 장의 목표는 9장에서 만든 검증용 UI를 실제 chat 화면의 최소 구조로 분리하는 것이다. 아직 assistant-ui를 쓰지 않고 직접 만든다. 직접 만들어봐야 LangGraph stream state가 UI의 어느 부분과 연결되는지 이해할 수 있다.

### component 분리

기본 chat UI는 다음 component로 나눈다.

```text
AgentThread
  -> MessageList
  -> MessageItem
  -> Composer
  -> StreamStatus
```

각 component의 책임:

| component | 책임 |
|---|---|
| `AgentThread` | stream hook, submit, stop, error 상태 연결 |
| `MessageList` | message 배열 렌더링, scroll-to-bottom |
| `MessageItem` | role별 message 표시 |
| `Composer` | textarea, submit, disabled 상태 |
| `StreamStatus` | loading, error, interrupted 표시 |

### message content 정규화

LangChain message content는 string일 수도 있고 content block array일 수도 있다. UI component는 content shape를 먼저 정규화한다.

```ts
type MessageContent = string | Array<unknown>;

export function getMessageText(content: MessageContent) {
  if (typeof content === "string") return content;

  return content
    .map((part) => {
      if (
        typeof part === "object" &&
        part !== null &&
        "text" in part &&
        typeof part.text === "string"
      ) {
        return part.text;
      }

      return "";
    })
    .join("");
}
```

### MessageList

message list는 새 token이 들어올 때 아래로 따라가야 한다. 사용자가 과거 message를 읽는 중이면 자동 scroll 정책을 더 섬세하게 만들어야 하지만, 최소 구현은 message 변경 시 하단으로 이동한다.

```tsx
"use client";

import { useEffect, useRef } from "react";
import { getMessageText } from "./message-content";

type ChatMessage = {
  id?: string;
  type: string;
  content: string | Array<unknown>;
};

export function MessageList({ messages }: { messages: ChatMessage[] }) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  if (messages.length === 0) {
    return <div>아직 메시지가 없습니다.</div>;
  }

  return (
    <div aria-live="polite">
      {messages.map((message, index) => (
        <article key={message.id ?? index}>
          <div>{message.type}</div>
          <div>{getMessageText(message.content)}</div>
        </article>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
```

### Composer

composer는 form submit 하나로 user input을 전달한다.

```tsx
"use client";

import { FormEvent, KeyboardEvent, useState } from "react";

type ComposerProps = {
  disabled: boolean;
  onSubmit: (content: string) => Promise<void> | void;
};

export function Composer({ disabled, onSubmit }: ComposerProps) {
  const [value, setValue] = useState("");

  async function submit() {
    const content = value.trim();
    if (!content || disabled) return;

    setValue("");
    await onSubmit(content);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await submit();
  }

  async function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await submit();
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={value}
        rows={3}
        disabled={disabled}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button type="submit" disabled={disabled || !value.trim()}>
        Send
      </button>
    </form>
  );
}
```

### AgentThread 조립

```tsx
"use client";

import { Composer } from "@/components/chat/composer";
import { MessageList } from "@/components/chat/message-list";
import { useAgentStream } from "./use-agent-stream";

export function AgentThread({ threadId }: { threadId: string }) {
  const stream = useAgentStream(threadId);

  async function submit(content: string) {
    if (stream.isLoading) return;

    await stream.submit({
      messages: [{ type: "human", content }],
    });
  }

  return (
    <section>
      <MessageList messages={stream.messages} />

      {stream.error ? <p role="alert">응답 생성 중 오류가 발생했습니다.</p> : null}

      <Composer disabled={stream.isLoading} onSubmit={submit} />

      {stream.isLoading ? (
        <button type="button" onClick={() => stream.stop()}>
          Stop
        </button>
      ) : null}
    </section>
  );
}
```

### UI 상태 구분

| 상태 | 조건 | UI |
|---|---|---|
| empty | `messages.length === 0` | 빈 대화 화면 |
| idle | `!isLoading && !error` | composer 활성화 |
| streaming | `isLoading` | composer disabled, stop 버튼 |
| error | `error` | alert, retry 안내 |
| interrupted | `interrupts.length > 0` | 이후 HITL UI에서 처리 |

### Markdown과 code block

assistant 응답은 markdown일 가능성이 높다. 최소 구현에서는 plain text로 시작하고, chat app 수준으로 넘어갈 때 markdown renderer를 붙인다.

```bash
npm install react-markdown remark-gfm
```

```tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownMessage({ content }: { content: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
}
```

code block highlighting은 나중에 추가한다. 처음부터 markdown, syntax highlight, copy button까지 붙이면 streaming 문제와 renderer 문제를 구분하기 어려워진다.

### 이 단계의 완료 기준

- stream hook과 UI component가 분리되어 있다.
- message content 정규화 함수가 있다.
- enter submit, shift-enter newline이 동작한다.
- loading 중 composer가 disabled 된다.
- stop 버튼이 노출된다.
- empty, loading, error 상태가 구분된다.
- message list가 새 message를 따라 scroll 된다.

## 11. Thread 기본 관리

이 장의 목표는 단일 thread 화면을 여러 대화가 가능한 chat app 구조로 확장하는 것이다. thread 관리는 chat agent frontend의 핵심이다. thread가 없으면 multi-turn memory, history 복원, 재진입, sidebar, retry, branch가 모두 불안정해진다.

### thread 관리 원칙

- 새 대화는 먼저 thread를 만들고 route를 이동한다.
- user message submit은 thread 화면에서 처리한다.
- `threadId`는 URL에 둔다.
- user와 thread ownership은 server에서 검증한다.
- thread title, archive 여부, pinned 여부 같은 product metadata는 app DB 또는 thread metadata로 관리한다.

### 새 thread 만들기

server에서 thread를 만들고 `thread_id`를 반환한다.

```ts
// app/agents/actions.ts
"use server";

import { langGraphClient } from "@/agent/langgraph-client";
import { getCurrentUserId } from "@/auth/session";

export async function createThread() {
  const userId = await getCurrentUserId();

  const thread = await langGraphClient.threads.create({
    metadata: {
      userId,
      graphId: "agent",
    },
  });

  return thread.thread_id;
}
```

client에서는 thread 생성 후 route를 이동한다.

```tsx
"use client";

import { useRouter } from "next/navigation";
import { createThread } from "./actions";

export function NewThreadButton() {
  const router = useRouter();

  async function handleClick() {
    const threadId = await createThread();
    router.push(`/agents/${threadId}`);
  }

  return <button onClick={handleClick}>New Chat</button>;
}
```

### thread list 조회

thread sidebar는 현재 사용자의 thread만 보여준다.

```ts
// app/agents/thread-list.ts
import { langGraphClient } from "@/agent/langgraph-client";

export async function listThreads(userId: string) {
  const threads = await langGraphClient.threads.search({
    metadata: { userId },
    limit: 50,
  });

  return threads.sort((a, b) => {
    const left = new Date(a.updated_at ?? 0).getTime();
    const right = new Date(b.updated_at ?? 0).getTime();
    return right - left;
  });
}
```

SDK 또는 deployment에 따라 timestamp field naming이 다를 수 있다. 프로젝트 type을 확인한 뒤 `updated_at`/`updatedAt` 중 하나로 고정한다.

### sidebar component

```tsx
import Link from "next/link";
import { listThreads } from "./thread-list";
import { NewThreadButton } from "./new-thread-button";

export async function ThreadSidebar({ userId }: { userId: string }) {
  const threads = await listThreads(userId);

  return (
    <aside>
      <NewThreadButton />
      <nav>
        {threads.map((thread) => (
          <Link key={thread.thread_id} href={`/agents/${thread.thread_id}`}>
            {getThreadTitle(thread)}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```

### thread title

초기 title은 metadata에 저장된 값을 우선 사용하고, 없으면 첫 message 또는 생성 시각 기반 fallback을 쓴다.

```ts
type ThreadLike = {
  thread_id: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
};

export function getThreadTitle(thread: ThreadLike) {
  const title = thread.metadata?.title;
  if (typeof title === "string" && title.trim()) {
    return title;
  }

  if (thread.created_at) {
    return new Intl.DateTimeFormat("ko-KR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(thread.created_at));
  }

  return thread.thread_id.slice(0, 8);
}
```

title 생성은 처음 user message를 받은 뒤 background run이나 server action으로 처리할 수 있다. 처음부터 title agent를 붙이지 않아도 된다.

### thread metadata 업데이트

rename, archive, pin 같은 product 기능은 metadata update로 처리할 수 있다.

```ts
export async function renameThread(threadId: string, title: string) {
  await langGraphClient.threads.update(threadId, {
    metadata: {
      title,
    },
  });
}
```

archive도 같은 방식으로 flag를 둔다.

```ts
export async function archiveThread(threadId: string) {
  await langGraphClient.threads.update(threadId, {
    metadata: {
      archived: true,
    },
  });
}
```

### ownership 검증

frontend에서 `userId`를 넘기는 것만으로는 권한 검증이 되지 않는다. thread page 또는 proxy route에서 thread metadata를 확인한다.

```ts
export async function assertThreadOwner(threadId: string, userId: string) {
  const thread = await langGraphClient.threads.get(threadId);

  if (thread.metadata?.userId !== userId) {
    throw new Error("Forbidden thread access");
  }

  return thread;
}
```

운영에서는 이 검증을 모든 thread read/write/run 요청 앞에 둔다. 특히 `/agents/{threadId}` URL은 사용자가 직접 입력할 수 있으므로 route param만 신뢰하지 않는다.

### route layout 예시

```tsx
// app/agents/layout.tsx
import type { ReactNode } from "react";
import { getCurrentUserId } from "@/auth/session";
import { ThreadSidebar } from "./thread-sidebar";

export default async function AgentsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const userId = await getCurrentUserId();

  return (
    <div>
      <ThreadSidebar userId={userId} />
      <main>{children}</main>
    </div>
  );
}
```

### 이 단계의 완료 기준

- 새 thread 생성 후 `/agents/{threadId}`로 이동한다.
- thread list sidebar가 현재 사용자의 thread를 보여준다.
- thread title fallback이 있다.
- thread rename/archive 같은 metadata 업데이트 경로가 있다.
- thread page 진입 시 ownership 검증을 고려한다.
- user message submit과 thread 생성이 분리되어 있다.

### 40% 지점 완료 기준

여기까지 완료하면 React에서 최소 streaming chat을 만들고, 여러 thread를 관리할 수 있는 기본 구조를 갖춘 것이다.

- `useStream` 기반 submit/stop/error 흐름을 설명할 수 있다.
- message list와 composer가 component로 분리되어 있다.
- 기본 chat 상태가 empty/idle/streaming/error로 구분된다.
- thread 생성과 route 이동이 분리되어 있다.
- thread sidebar와 title fallback을 만들 수 있다.
- thread ownership 검증이 필요한 이유를 설명할 수 있다.

## 12. Thread Join과 재접속

이 장의 목표는 agent가 running 상태인 thread에 사용자가 다시 들어왔을 때, 새 run을 만들지 않고 기존 실행 흐름을 이어받는 방법을 정리하는 것이다.

핵심은 checkpoint state로 화면을 즉시 복원하고, 실행 중 업데이트는 SSE stream으로 이어받는 것이다.

사용하는 라이브러리:

- LangGraph standard API
- `@langchain/react`
- `@langchain/langgraph-sdk`
- `@assistant-ui/react-langgraph`

### 구현 목표

사용자가 이미 실행 중인 agent thread 화면에 다시 들어왔을 때 다음이 가능해야 한다.

- 기존 thread의 checkpoint state를 즉시 조회해서 화면을 복원한다.
- 해당 thread에 아직 running 중인 run이 있으면 새 run을 만들지 않고 active stream에 join한다.
- agent가 생성 중인 message, tool call, custom update를 SSE 기반 streaming으로 계속 반영한다.
- 브라우저 새로고침, 탭 이동, 라우트 재진입 후에도 같은 `threadId` 기준으로 대화가 이어진다.

핵심은 frontend가 `threadId`를 route/local state로 유지하고, LangGraph SDK의 `useStream` 기반 상태와 assistant-ui runtime을 연결하는 것이다.

### 설치

```bash
npm install @langchain/langgraph-sdk @assistant-ui/react @assistant-ui/react-langgraph
```

Next.js App Router 기준이면 client component에서 사용한다.

```tsx
"use client";
```

### 환경 변수

LangGraph server 또는 LangGraph Platform endpoint를 frontend에서 직접 호출하는 구조라면 public URL만 노출한다.

```bash
NEXT_PUBLIC_LANGGRAPH_API_URL=http://localhost:2024
NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID=agent
```

운영 환경에서 API key가 필요한 경우에는 browser에 secret을 직접 노출하지 말고 Next.js route handler를 proxy로 둔다.

```bash
LANGGRAPH_API_KEY=...
NEXT_PUBLIC_LANGGRAPH_API_URL=/api/langgraph
```

### thread id 관리

thread join의 기준은 `threadId`이다. URL param으로 들고 가는 방식이 가장 단순하다.

```tsx
// app/agents/[threadId]/page.tsx
import { AgentThread } from "./thread";

export default async function Page({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;

  return <AgentThread threadId={threadId} />;
}
```

새 대화를 시작할 때는 backend route 또는 LangGraph client로 thread를 만든 뒤 `/agents/{threadId}`로 이동한다. 아래 예시는 local prototype용이다. 운영에서는 server route에서 thread를 만들고 ownership metadata를 함께 저장한다.

```tsx
import { Client } from "@langchain/langgraph-sdk";

const client = new Client({
  apiUrl: process.env.NEXT_PUBLIC_LANGGRAPH_API_URL!,
});

export async function createThread() {
  const thread = await client.threads.create();
  return thread.thread_id;
}
```

### React SDK로 thread 재진입 처리하기

새 custom UI에서는 `@langchain/react`의 `useStream`을 기본으로 둔다. 동일한 `threadId`로 hook을 mount하면 thread state를 hydrate하고, SDK가 stream lifecycle을 관리한다. 화면 진입 시 `submit`을 호출하면 새 run이 생기므로, 재진입 처리는 `threadId`를 유지하는 것에서 시작한다.

```tsx
"use client";

import { useStream } from "@langchain/react";

type AgentState = {
  messages: Array<{
    id?: string;
    type: "human" | "ai" | "tool" | "system";
    content: string;
  }>;
  status?: "idle" | "running" | "interrupted" | "error";
};

type AgentThreadProps = {
  threadId: string;
};

export function AgentThread({ threadId }: AgentThreadProps) {
  const stream = useStream<AgentState>({
    apiUrl: process.env.NEXT_PUBLIC_LANGGRAPH_API_URL!,
    assistantId: process.env.NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID!,
    threadId,
  });

  async function submit(content: string) {
    if (stream.isLoading) return;

    await stream.submit({
      messages: [{ type: "human", content }],
    });
  }

  return (
    <section>
      <MessageList messages={stream.messages} />
      <Composer disabled={stream.isLoading} onSubmit={submit} />
    </section>
  );
}
```

주의할 점은 화면 진입 시 `submit`을 자동 호출하지 않는 것이다. `submit`은 새 run을 생성한다. thread 재진입은 `threadId`를 유지하고 stream hook이 해당 thread state를 복원하게 만드는 문제로 분리한다.

### active run 확인 후 UI 정책 정하기

프로젝트 정책상 running thread에서 composer를 막거나 stop 버튼만 노출해야 한다면 LangGraph client로 thread/run 상태를 먼저 조회한다.

```tsx
import { Client } from "@langchain/langgraph-sdk";

const client = new Client({
  apiUrl: process.env.NEXT_PUBLIC_LANGGRAPH_API_URL!,
});

export async function getThreadRuntimeState(threadId: string) {
  const [thread, runs] = await Promise.all([
    client.threads.get(threadId),
    client.runs.list(threadId, { limit: 10 }),
  ]);

  const activeRun = runs.find((run) =>
    ["pending", "running"].includes(String(run.status))
  );

  return {
    threadStatus: thread.status,
    activeRun,
  };
}
```

client component에서는 active run이 있으면 중복 submit을 막는다.

```tsx
useEffect(() => {
  let cancelled = false;

  async function loadRuntimeState() {
    const runtimeState = await getThreadRuntimeState(threadId);
    if (!cancelled) {
      setActiveRun(runtimeState.activeRun);
    }
  }

  loadRuntimeState();

  return () => {
    cancelled = true;
  };
}, [threadId]);
```

명시적으로 특정 run에 붙어야 하는 기존 `@langchain/langgraph-sdk/react` 코드라면 `joinStream`에 `runId`를 전달한다. 인자 없이 호출하는 방식으로 작성하지 않는다.

```tsx
import { useStream } from "@langchain/langgraph-sdk/react";

const stream = useStream({
  apiUrl: process.env.NEXT_PUBLIC_LANGGRAPH_API_URL!,
  assistantId: process.env.NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID!,
  threadId,
});

if (activeRun) {
  await stream.joinStream(activeRun.run_id);
}
```

신규 구현에서는 `@langchain/react`의 remount/reattach 흐름을 우선 사용하고, manual run join은 migration 또는 특수한 운영 정책이 있을 때만 사용한다.

### assistant-ui와 연결하기

assistant-ui를 사용하면 message list, composer, loading state, thread UI를 직접 만들지 않고 runtime으로 연결할 수 있다. LangGraph runtime은 `@langchain/langgraph-sdk`와 직접 통합된다.

```tsx
"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useLangGraphRuntime } from "@assistant-ui/react-langgraph";
import { Thread } from "@/components/assistant-ui/thread";

type AgentAssistantProps = {
  threadId: string;
};

export function AgentAssistant({ threadId }: AgentAssistantProps) {
  const runtime = useLangGraphRuntime({
    apiUrl: process.env.NEXT_PUBLIC_LANGGRAPH_API_URL!,
    assistantId: process.env.NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID!,
    threadId,
    streamMode: ["messages", "updates", "values"],
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <Thread />
    </AssistantRuntimeProvider>
  );
}
```

`Thread` 컴포넌트는 assistant-ui quickstart로 생성한 컴포넌트를 그대로 사용하거나 프로젝트 디자인 시스템에 맞게 감싸면 된다.

### message shape 정규화

LangGraph state의 `messages`와 UI message의 shape이 다를 수 있으므로, backend graph state는 일관된 message schema를 유지하는 편이 좋다.

```ts
type GraphMessage = {
  id?: string;
  type: "human" | "ai" | "tool" | "system";
  content: string | Array<unknown>;
  name?: string;
  tool_call_id?: string;
};

function getTextContent(content: GraphMessage["content"]) {
  if (typeof content === "string") return content;

  return content
    .map((part) => {
      if (
        typeof part === "object" &&
        part !== null &&
        "text" in part &&
        typeof part.text === "string"
      ) {
        return part.text;
      }

      return "";
    })
    .join("");
}
```

assistant-ui runtime을 쓰면 대부분의 변환을 runtime이 처리하지만, custom message part나 tool result를 UI에 특별히 보여줄 때는 이런 정규화 함수가 필요하다.

### tool call streaming 표시

agent가 tool을 호출하는 동안 UI에 "도구 실행 중" 상태를 보여주려면 `updates` 또는 message metadata를 사용한다.

```tsx
function ToolCallPanel({
  updates,
}: {
  updates: Record<string, unknown> | undefined;
}) {
  const activeTool = updates?.active_tool;

  if (!activeTool || typeof activeTool !== "string") {
    return null;
  }

  return (
    <div role="status" aria-live="polite">
      {activeTool} 실행 중
    </div>
  );
}
```

backend graph node에서는 UI가 읽기 쉬운 update key를 명시적으로 emit하는 것이 좋다.

```ts
return {
  active_tool: "search",
  messages: [toolMessage],
};
```

### interrupt 상태 처리

human-in-the-loop 승인, 확인, form 입력이 필요한 graph라면 interrupt를 UI 상태로 분기한다.

```tsx
function InterruptBox({
  interrupt,
  onResume,
}: {
  interrupt: unknown;
  onResume: (value: unknown) => void;
}) {
  if (!interrupt) return null;

  return (
    <div>
      <p>사용자 확인이 필요합니다.</p>
      <button onClick={() => onResume({ approved: true })}>승인</button>
      <button onClick={() => onResume({ approved: false })}>거절</button>
    </div>
  );
}
```

```tsx
<InterruptBox
  interrupt={stream.interrupt}
  onResume={(value) => stream.submit(undefined, { command: { resume: value } })}
/>
```

### 라우트 이동 시 thread 전환

동일한 component instance에서 `threadId`만 바뀔 수 있다면 `switchThread`로 내부 stream state를 정리한다.

```tsx
useEffect(() => {
  stream.switchThread(threadId);
}, [stream, threadId]);
```

이 처리를 하지 않으면 이전 thread의 message가 잠깐 남아 보이거나, 이전 stream의 loading state가 새 화면에 섞일 수 있다.

### 중복 submit 방지

running 중인 thread에 사용자가 다시 메시지를 보내는 정책은 명확히 해야 한다.

```tsx
async function submit(content: string) {
  if (stream.isLoading) {
    return;
  }

  await stream.submit({
    messages: [{ type: "human", content }],
  });
}
```

더 엄격하게는 active run 조회 결과가 있으면 composer를 disable 한다.

```tsx
const disabled = stream.isLoading || Boolean(activeRun);
```

### 재접속 UX

브라우저 네트워크가 끊겼다가 복구되면 같은 `threadId`로 stream hook이 다시 연결되도록 만든다. `@langchain/react` 기반 신규 구현에서는 인자 없는 `joinStream()`을 호출하지 않는다.

```tsx
function AgentThreadShell({ threadId }: { threadId: string }) {
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    function handleOnline() {
      setReloadKey((value) => value + 1);
    }

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return <AgentThread key={`${threadId}:${reloadKey}`} threadId={threadId} />;
}
```

같은 component instance 안에서 thread만 바뀌는 구조라면 `switchThread`로 state를 정리한다.

```tsx
useEffect(() => {
  stream.switchThread(threadId);
}, [stream, threadId]);
```

화면은 다음 상태를 구분해서 보여준다.

- `isLoading`: 현재 stream 또는 submit이 진행 중이다.
- `interrupt`: graph가 사용자 입력을 기다린다.
- `error`: SSE 연결 또는 run 실행 실패가 있다.
- `messages.length === 0`: 아직 checkpoint message가 없다.

### Next.js proxy route 예시

운영 환경에서 LangGraph API key를 숨겨야 한다면 `/api/langgraph` route를 둔다. 중요한 점은 SSE streaming response를 buffer하지 않고 그대로 넘기는 것이다.

```ts
// app/api/langgraph/[...path]/route.ts
import { NextRequest } from "next/server";

const LANGGRAPH_API_URL = process.env.LANGGRAPH_API_URL!;
const LANGGRAPH_API_KEY = process.env.LANGGRAPH_API_KEY!;

async function proxy(request: NextRequest, path: string[]) {
  const url = new URL(request.url);
  const target = new URL(path.join("/"), LANGGRAPH_API_URL);
  target.search = url.search;

  return fetch(target, {
    method: request.method,
    headers: {
      Authorization: `Bearer ${LANGGRAPH_API_KEY}`,
      "Content-Type": request.headers.get("Content-Type") ?? "application/json",
    },
    body: ["GET", "HEAD"].includes(request.method)
      ? undefined
      : await request.arrayBuffer(),
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxy(request, path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxy(request, path);
}
```

### 구현 체크리스트

- `threadId`는 URL 또는 전역 store에 보존한다.
- 화면 mount 시 checkpoint state를 보여주고 active stream에 join한다.
- 새 메시지 전송과 active stream join을 분리한다.
- running 중에는 중복 submit을 막거나 queue 정책을 명확히 둔다.
- interrupt가 있는 graph라면 resume UI를 별도 상태로 처리한다.
- SSE proxy를 쓰는 경우 response streaming을 buffer하지 않는다.
- message, update, tool call의 schema를 frontend에서 예측 가능하게 만든다.

### 참고 문서

- LangGraph React SDK `useStream`: https://reference.langchain.com/javascript/langchain-langgraph-sdk/react/UseStream
- assistant-ui LangGraph runtime: https://www.assistant-ui.com/docs/runtimes/langgraph/overview
- assistant-ui LangGraph quickstart: https://www.assistant-ui.com/docs/runtimes/langgraph/quickstart

## 13. Stream mode와 event 이해

이 장의 목표는 LangGraph가 어떤 event를 frontend로 보내고, React UI가 어떤 event를 기준으로 화면을 업데이트해야 하는지 이해하는 것이다. streaming은 단순히 token을 빨리 보여주는 기능이 아니다. agent가 어떤 node를 실행 중인지, tool이 시작됐는지, graph state가 어떻게 변했는지, interrupt가 발생했는지를 UI에 전달하는 통로이다.

### stream mode 개요

LangGraph는 여러 stream mode를 제공한다. 목적에 따라 하나만 쓰거나 여러 mode를 함께 사용할 수 있다.

| mode | 의미 | UI 사용처 |
|---|---|---|
| `messages` | LLM token과 message stream | assistant 답변 streaming |
| `values` | step 이후 전체 graph state | checkpoint state, 전체 state inspection |
| `updates` | step 이후 node별 state update | 실행 단계 표시, progress UI |
| `custom` | node/tool에서 직접 emit한 custom event | artifact progress, domain-specific UI |
| `tools` | tool lifecycle event | tool start/progress/end/error 표시 |
| `debug` | 가능한 상세 실행 정보 | 개발/디버깅 전용 |

custom React UI에서는 보통 `@langchain/react`의 root projection을 먼저 사용한다.

```tsx
const stream = useAgentStream(threadId);

const messages = stream.messages;
const values = stream.values;
const toolCalls = stream.toolCalls;
const interrupts = stream.interrupts;
```

raw `graph.stream(...)` 또는 low-level SDK를 직접 사용할 때만 stream mode tuple을 직접 처리한다.

### `messages`

`messages`는 assistant 답변을 점진적으로 보여주는 핵심 mode이다. UI에서는 일반적으로 `stream.messages`를 렌더링하면 된다.

```tsx
<MessageList messages={stream.messages} />
```

직접 graph를 실행하는 script에서는 다음처럼 token stream을 확인할 수 있다.

```ts
for await (const [token, metadata] of await graph.stream(
  { messages: [{ role: "user", content: "hello" }] },
  { streamMode: "messages" }
)) {
  console.log(metadata.langgraph_node, token.content);
}
```

message stream을 UI에 붙일 때 주의할 점:

- token 단위 업데이트는 자주 발생하므로 불필요한 expensive render를 피한다.
- message id가 없을 때 index fallback을 쓰면 streaming 중 key가 흔들릴 수 있다.
- 내부 LLM 호출을 UI에 보여주고 싶지 않으면 해당 호출을 별도 channel이나 non-streaming 설정으로 분리한다.

### `values`

`values`는 graph state 전체를 보여준다. state inspection, checkpoint 복원 확인, debug panel에 적합하다.

```tsx
function StateDebugPanel({ values }: { values: unknown }) {
  if (process.env.NODE_ENV === "production") return null;

  return <pre>{JSON.stringify(values, null, 2)}</pre>;
}
```

`values`를 화면의 source of truth로 쓸 때는 조심해야 한다. chat UI의 message list는 보통 `stream.messages` projection을 쓰고, state debug나 artifact panel에서만 `values`를 참조하는 편이 안전하다.

### `updates`

`updates`는 node별 state 변경을 보여준다. agent 실행 timeline을 만들 때 유용하다.

```ts
for await (const chunk of await graph.stream(
  { messages: [{ role: "user", content: "분석해줘" }] },
  { streamMode: "updates" }
)) {
  for (const [nodeName, update] of Object.entries(chunk)) {
    console.log(nodeName, update);
  }
}
```

UI에서는 update를 바로 message bubble로 만들기보다 timeline이나 status panel로 보여준다.

```tsx
type AgentStep = {
  nodeName: string;
  status: "running" | "completed" | "error";
  summary?: string;
};
```

### `custom`

`custom`은 graph node나 tool에서 frontend 전용 event를 직접 보낼 때 사용한다. 예를 들어 긴 문서 분석, 파일 생성, 검색 진행률 같은 domain-specific 상태를 보낼 수 있다.

```ts
import { GraphNode, LangGraphRunnableConfig } from "@langchain/langgraph";

const analyzeDocument: GraphNode<typeof AgentState> = async (
  state,
  config: LangGraphRunnableConfig
) => {
  config.writer({ type: "progress", label: "문서 읽는 중", value: 0.2 });
  config.writer({ type: "progress", label: "근거 추출 중", value: 0.7 });

  return {
    artifact: {
      id: "analysis",
      kind: "report",
      title: "분석 결과",
      content: {},
    },
  };
};
```

custom event schema는 반드시 정한다.

```ts
type AgentCustomEvent =
  | { type: "progress"; label: string; value: number }
  | { type: "artifact"; artifactId: string; title: string }
  | { type: "status"; message: string };
```

schema 없이 freeform object를 계속 보내면 frontend가 event를 안정적으로 처리하기 어렵다.

### `tools`

`tools` mode는 tool lifecycle event를 UI에 보여줄 때 사용한다. 대표 event는 start, event, end, error이다.

| event | 의미 |
|---|---|
| `on_tool_start` | tool 실행 시작 |
| `on_tool_event` | tool 중간 progress |
| `on_tool_end` | tool 실행 완료 |
| `on_tool_error` | tool 실행 실패 |

tool progress를 보여주는 UI model은 다음처럼 시작할 수 있다.

```ts
type ToolProgressItem = {
  toolCallId: string;
  name: string;
  status: "running" | "completed" | "error";
  input?: unknown;
  output?: unknown;
  error?: unknown;
};
```

처음에는 tool call raw input/output을 그대로 노출하지 않는다. 검색 query, 파일명, 레코드 수처럼 사용자에게 의미 있는 요약만 보여준다.

### mode 선택 기준

| 만들 UI | 우선 사용할 데이터 |
|---|---|
| assistant 답변 bubble | `messages` |
| graph state debug panel | `values` |
| node 실행 timeline | `updates` |
| artifact/progress panel | `custom` |
| tool progress card | `tools`, `toolCalls` |
| human approval UI | `interrupts` |

### event logging

개발 중에는 stream event를 로그로 남겨야 한다. UI가 깨지는 원인이 graph state인지, SDK projection인지, component render인지 분리할 수 있다.

```ts
export function logStreamSnapshot(stream: {
  messages: unknown[];
  values: unknown;
  toolCalls?: unknown;
  interrupts?: unknown[];
  isLoading: boolean;
  error?: unknown;
}) {
  console.log({
    messageCount: stream.messages.length,
    values: stream.values,
    toolCalls: stream.toolCalls,
    interrupts: stream.interrupts,
    isLoading: stream.isLoading,
    error: stream.error,
  });
}
```

production에서는 raw message, tool input, PII가 포함될 수 있으므로 그대로 로그에 남기지 않는다.

### 이 단계의 완료 기준

- `messages`, `values`, `updates`, `custom`, `tools`의 차이를 설명할 수 있다.
- chat bubble에는 `messages`를 우선 사용한다.
- debug panel과 product UI가 같은 state를 무분별하게 공유하지 않는다.
- custom event schema를 정의할 수 있다.
- tool progress를 message와 별도 UI로 표시할 기준을 세울 수 있다.

## 14. assistant-ui 적용

이 장의 목표는 직접 만든 최소 chat UI를 assistant-ui 기반 runtime으로 바꾸는 기준과 기본 연결 방식을 정리하는 것이다. assistant-ui는 message list, composer, thread UI, cancellation, interrupt, metadata, generative UI 같은 반복 구현을 줄여준다. 다만 LangGraph stream state를 먼저 이해한 뒤 적용하는 편이 좋다.

### 언제 assistant-ui를 쓰는가

assistant-ui를 쓰기 좋은 경우:

- ChatGPT 스타일 thread UI를 빠르게 만들고 싶다.
- message list, composer, action bar, stop, retry 같은 반복 UI를 줄이고 싶다.
- LangGraph interrupt, message editing, cancellation을 runtime에 맡기고 싶다.
- attachment, feedback, generative UI 같은 chat product 기능을 확장할 계획이 있다.

직접 UI가 나은 경우:

- chat UI가 매우 단순하다.
- design system 제약이 강해서 runtime component를 많이 바꿔야 한다.
- stream event를 domain-specific dashboard로 표현해야 한다.
- assistant-ui의 runtime abstraction보다 직접 state control이 더 중요하다.

### 설치

```bash
npm install @assistant-ui/react @assistant-ui/react-langgraph
```

LangGraph SDK와 React SDK는 앞 단계에서 이미 설치되어 있다고 가정한다.

### 기본 runtime 연결

```tsx
"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useLangGraphRuntime } from "@assistant-ui/react-langgraph";
import { Thread } from "@/components/assistant-ui/thread";

type AgentAssistantProps = {
  threadId: string;
};

export function AgentAssistant({ threadId }: AgentAssistantProps) {
  const runtime = useLangGraphRuntime({
    apiUrl: process.env.NEXT_PUBLIC_LANGGRAPH_API_URL!,
    assistantId: process.env.NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID!,
    threadId,
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <Thread />
    </AssistantRuntimeProvider>
  );
}
```

`Thread` component는 assistant-ui quickstart로 생성한 기본 component를 사용할 수 있다. 프로젝트 디자인 시스템에 맞게 message, composer, action button만 점진적으로 교체한다.

### route에 붙이기

```tsx
// app/agents/[threadId]/page.tsx
import { AgentAssistant } from "./agent-assistant";

export default async function Page({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;

  return <AgentAssistant threadId={threadId} />;
}
```

### custom UI와 assistant-ui 비교

| 기능 | custom UI | assistant-ui |
|---|---|---|
| message list | 직접 구현 | 기본 제공 |
| composer | 직접 구현 | 기본 제공 |
| stop/cancel | 직접 연결 | runtime 제공 |
| thread UI | 직접 구현 | adapter로 확장 |
| interrupt | 직접 상태 처리 | runtime 지원 |
| message metadata | 직접 파싱 | runtime 기반 접근 |
| generative UI | 직접 event mapping | runtime 패턴 사용 |

학습용으로는 custom UI가 좋고, 제품화 단계에서는 assistant-ui가 반복 작업을 줄인다.

### thread list adapter 방향

assistant-ui의 기본 thread UI를 쓰려면 application thread list와 LangGraph thread를 연결하는 adapter가 필요하다. 최소 구조는 다음과 같다.

```ts
type AppThread = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export async function listAssistantThreads(userId: string): Promise<AppThread[]> {
  const threads = await langGraphClient.threads.search({
    metadata: { userId },
    limit: 50,
  });

  return threads.map((thread) => ({
    id: thread.thread_id,
    title: getThreadTitle(thread),
    createdAt: thread.created_at,
    updatedAt: thread.updated_at,
  }));
}
```

application DB를 별도로 쓰면 LangGraph thread metadata와 app DB thread row를 동기화한다.

### interrupt 처리

LangGraph interrupt는 checkpoint 기반으로 복원되어야 한다. assistant-ui runtime은 interrupt 상태를 UI message 상태와 연결할 수 있다. 직접 구현할 때와 마찬가지로 핵심은 thread state의 `tasks` 또는 interrupt payload를 잃지 않는 것이다.

```tsx
function ApprovalActions({
  onApprove,
  onReject,
}: {
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div>
      <button onClick={onApprove}>승인</button>
      <button onClick={onReject}>거절</button>
    </div>
  );
}
```

구체적인 resume payload schema는 graph의 interrupt 설계와 맞춘다. approval interrupt라면 `{ approved: boolean }`, form interrupt라면 form field object를 사용한다.

### cancellation

assistant-ui runtime을 쓰면 UI의 cancel action과 LangGraph run cancellation을 연결할 수 있다. custom UI에서 `stream.stop()`을 직접 연결했던 것과 같은 목적이다.

취소 UX 기준:

- streaming 중에는 stop/cancel affordance를 보여준다.
- cancel 후 partial assistant message를 어떻게 표시할지 정한다.
- cancel 된 run 뒤에 새 submit을 허용한다.
- server에는 실제 run cancellation이 전달되어야 한다.

### message customization

처음에는 assistant-ui 기본 message component를 사용한다. 이후 아래 순서로 교체한다.

1. markdown renderer
2. code block renderer
3. tool call card
4. artifact panel
5. citation/source panel
6. feedback action

customization은 한 번에 모두 하지 않는다. assistant-ui runtime 연결이 안정적으로 동작한 뒤 message part 단위로 교체한다.

### migration 기준

custom UI에서 assistant-ui로 넘어갈 때 확인할 것:

- 같은 `threadId`에서 history가 복원되는가
- submit 시 새 run이 정상 생성되는가
- stop/cancel이 실제 run에 반영되는가
- interrupt 상태가 thread 전환 후에도 복원되는가
- tool call 표시 정책이 유지되는가
- message id가 안정적으로 유지되는가

### 이 단계의 완료 기준

- `useLangGraphRuntime`으로 LangGraph thread를 assistant-ui에 연결할 수 있다.
- custom UI와 assistant-ui의 역할 차이를 설명할 수 있다.
- thread list adapter가 왜 필요한지 이해한다.
- interrupt와 cancellation을 runtime 기능으로 연결할 수 있다.
- assistant-ui를 적용해도 `threadId` 중심 설계가 유지된다.

### 50% 지점 완료 기준

여기까지 완료하면 React 기반 chat agent frontend의 중간 지점이다. 최소 streaming chat, thread 관리, thread 재진입, stream mode, assistant-ui 적용 기준까지 갖춘 상태다.

- running thread 재진입 시 새 run을 자동 생성하지 않는다.
- stream mode별 UI 사용처를 구분할 수 있다.
- custom event와 tool progress를 어떤 UI로 보낼지 설계할 수 있다.
- assistant-ui runtime을 기본 thread route에 연결할 수 있다.
- custom UI와 assistant-ui 중 프로젝트에 맞는 선택을 할 수 있다.

## 15. Tool calling agent 기초

이 장의 목표는 LLM이 tool을 호출하고, LangGraph가 tool을 실행한 뒤, 결과를 다시 LLM에 전달하는 기본 loop를 만드는 것이다. chat agent가 단순 Q&A를 넘어 실제 작업을 하려면 tool calling 구조가 필요하다.

### tool calling 흐름

```text
User message
  -> LLM node
  -> AIMessage with tool_calls?
  -> ToolNode
  -> ToolMessage
  -> LLM node
  -> Final AIMessage
```

핵심은 LLM이 tool call을 결정하고, graph가 tool을 실행하고, tool result를 message state에 다시 넣어 LLM이 최종 답변을 만들게 하는 것이다.

### tool 정의

tool은 이름, 설명, schema, 실행 함수로 구성한다.

```ts
// src/agent/tools.ts
import { tool } from "@langchain/core/tools";
import * as z from "zod";

export const searchDocs = tool(
  async ({ query }) => {
    return `검색 결과: ${query}`;
  },
  {
    name: "search_docs",
    description: "프로젝트 문서에서 질문과 관련된 내용을 검색한다.",
    schema: z.object({
      query: z.string().describe("검색할 질문 또는 키워드"),
    }),
  }
);

export const getCurrentTime = tool(
  async ({ timezone }) => {
    return new Intl.DateTimeFormat("ko-KR", {
      dateStyle: "full",
      timeStyle: "long",
      timeZone: timezone,
    }).format(new Date());
  },
  {
    name: "get_current_time",
    description: "지정한 timezone의 현재 시간을 반환한다.",
    schema: z.object({
      timezone: z.string().default("Asia/Seoul"),
    }),
  }
);

export const tools = [searchDocs, getCurrentTime];
```

tool 설계 기준:

- 이름은 짧고 동사형으로 둔다.
- description은 LLM이 언제 tool을 써야 하는지 판단할 수 있게 쓴다.
- schema field에는 가능한 구체적인 description을 넣는다.
- tool return은 너무 긴 raw object보다 요약 가능한 구조로 시작한다.
- 민감 작업 tool은 바로 실행하지 않고 interrupt 승인 단계를 둔다.

### ToolNode 기반 graph

`ToolNode`는 LangGraph workflow에서 tool을 실행하는 prebuilt node이다. 기본 tool loop는 `toolsCondition`으로 구성할 수 있다.

```ts
// src/agent/graph.ts
import { ChatOpenAI } from "@langchain/openai";
import {
  END,
  MessagesValue,
  START,
  StateGraph,
  StateSchema,
} from "@langchain/langgraph";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import { tools } from "./tools";

const AgentState = new StateSchema({
  messages: MessagesValue,
});

const model = new ChatOpenAI({
  model: process.env.CHAT_MODEL ?? "gpt-4.1-mini",
  temperature: 0,
}).bindTools(tools);

async function callModel(state: typeof AgentState.State) {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

export const graph = new StateGraph(AgentState)
  .addNode("agent", callModel)
  .addNode("tools", new ToolNode(tools))
  .addEdge(START, "agent")
  .addConditionalEdges("agent", toolsCondition)
  .addEdge("tools", "agent")
  .compile();
```

이 graph는 `agent` node가 tool call을 포함한 AIMessage를 반환하면 `tools` node로 이동하고, tool 실행 결과를 다시 `agent` node에 전달한다. tool call이 없으면 `toolsCondition`이 `END`로 라우팅한다.

### 직접 router를 쓰는 경우

`toolsCondition`을 쓰지 않고 직접 routing logic을 만들 수도 있다.

```ts
function shouldContinue(state: typeof AgentState.State) {
  const lastMessage = state.messages.at(-1);
  const toolCalls = "tool_calls" in (lastMessage ?? {})
    ? lastMessage.tool_calls
    : undefined;

  if (Array.isArray(toolCalls) && toolCalls.length > 0) {
    return "tools";
  }

  return END;
}

export const graph = new StateGraph(AgentState)
  .addNode("agent", callModel)
  .addNode("tools", new ToolNode(tools))
  .addEdge(START, "agent")
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tools", "agent")
  .compile();
```

직접 router는 상태 key가 더 복잡하거나, 특정 tool만 승인 flow로 보내야 할 때 유용하다. 기본 학습 단계에서는 `toolsCondition`으로 시작한다.

### tool error 처리

tool error는 사용자가 볼 수 있는 실패와 내부 실패를 분리한다.

```ts
export const searchDocs = tool(
  async ({ query }) => {
    try {
      return await searchProjectDocs(query);
    } catch (error) {
      console.error("search_docs failed", error);
      return "문서 검색 중 오류가 발생했습니다.";
    }
  },
  {
    name: "search_docs",
    description: "프로젝트 문서를 검색한다.",
    schema: z.object({
      query: z.string(),
    }),
  }
);
```

초기에는 tool error를 ToolMessage로 돌려 LLM이 사용자에게 설명하게 만들 수 있다. production에서는 에러 type, retry 가능 여부, 사용자에게 보여줄 메시지를 명확히 나눈다.

### tool loop 완료 기준

tool calling graph가 제대로 동작하면 message history는 다음 형태가 된다.

```text
human: 문서에서 Thread Join을 찾아줘
ai: tool call search_docs(...)
tool: 검색 결과 ...
ai: Thread Join은 ...
```

확인할 것:

- LLM이 tool call을 생성하는가
- tool schema가 올바르게 validation 되는가
- ToolMessage가 `messages`에 들어가는가
- tool result 이후 LLM이 최종 답변을 생성하는가
- tool loop가 무한 반복하지 않는가

### 이 단계의 완료 기준

- tool을 이름, 설명, schema, 실행 함수로 정의할 수 있다.
- `ToolNode`와 `toolsCondition`으로 기본 tool loop를 만들 수 있다.
- tool result가 message state에 들어가는 흐름을 설명할 수 있다.
- tool error를 사용자 메시지와 내부 로그로 분리할 수 있다.
- 민감 tool에는 HITL 승인이 필요하다는 기준을 세울 수 있다.

## 16. Tool call UI 구현

이 장의 목표는 agent가 tool을 쓰는 동안 사용자가 "무슨 일이 일어나고 있는지" 볼 수 있게 만드는 것이다. tool call은 내부 구현 세부사항이지만, agent UX에서는 중요한 진행 상태이기도 하다.

### UI에 보여줄 정보

최소 tool call UI는 다음 정보를 다룬다.

| 정보 | 설명 |
|---|---|
| tool name | 어떤 tool이 실행되는지 |
| input summary | 어떤 대상으로 실행되는지 |
| status | running, completed, error |
| result summary | 결과 요약 |
| duration | 오래 걸리는 tool의 대기 시간 |

raw input/output을 그대로 보여주지 않는다. tool input에는 API key, 내부 path, user PII, 긴 query object가 포함될 수 있다.

### tool call view model

UI component는 SDK raw object를 직접 렌더링하지 않고 view model로 변환한다.

```ts
export type ToolCallView = {
  id: string;
  name: string;
  status: "running" | "completed" | "error";
  inputSummary?: string;
  outputSummary?: string;
  errorMessage?: string;
};
```

변환 함수:

```ts
export function toToolCallView(toolCall: unknown): ToolCallView {
  if (
    typeof toolCall === "object" &&
    toolCall !== null &&
    "id" in toolCall &&
    "name" in toolCall
  ) {
    return {
      id: String(toolCall.id),
      name: String(toolCall.name),
      status: "running",
      inputSummary: "도구 입력을 준비 중입니다.",
    };
  }

  return {
    id: "unknown",
    name: "unknown",
    status: "running",
  };
}
```

실제 프로젝트에서는 SDK가 제공하는 `toolCalls`, `toolProgress`, message metadata의 shape에 맞춰 변환한다.

### ToolCallCard

```tsx
type ToolCallCardProps = {
  tool: ToolCallView;
};

export function ToolCallCard({ tool }: ToolCallCardProps) {
  return (
    <section aria-label={`${tool.name} tool call`}>
      <div>
        <strong>{tool.name}</strong>
        <span>{tool.status}</span>
      </div>

      {tool.inputSummary ? <p>{tool.inputSummary}</p> : null}
      {tool.outputSummary ? <p>{tool.outputSummary}</p> : null}
      {tool.errorMessage ? <p role="alert">{tool.errorMessage}</p> : null}
    </section>
  );
}
```

status별 UI 정책:

- `running`: spinner 또는 progress text
- `completed`: result summary
- `error`: retry 가능 여부와 실패 메시지

### stream.toolCalls 사용

`@langchain/react`를 쓰는 custom UI에서는 root projection에서 tool call 관련 state를 읽는다.

```tsx
function ToolCallList({ stream }: { stream: ReturnType<typeof useAgentStream> }) {
  const tools = Array.from(stream.toolCalls ?? []).map(toToolCallView);

  if (tools.length === 0) return null;

  return (
    <div>
      {tools.map((tool) => (
        <ToolCallCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}
```

SDK 버전에 따라 tool call projection의 shape가 다를 수 있으므로, application layer에서 `toToolCallView` 같은 adapter를 둔다.

### tools stream mode 사용

tool lifecycle event를 더 명시적으로 다루려면 `tools` stream mode를 사용한다. server-side 검증 스크립트에서는 다음처럼 확인할 수 있다.

```ts
for await (const [mode, chunk] of await graph.stream(
  { messages: [{ role: "user", content: "문서를 검색해줘" }] },
  { streamMode: ["messages", "tools"] }
)) {
  if (mode !== "tools") continue;

  switch (chunk.event) {
    case "on_tool_start":
      console.log("tool started", chunk.name, chunk.input);
      break;
    case "on_tool_event":
      console.log("tool progress", chunk.name, chunk.data);
      break;
    case "on_tool_end":
      console.log("tool finished", chunk.name, chunk.output);
      break;
    case "on_tool_error":
      console.error("tool failed", chunk.name, chunk.error);
      break;
  }
}
```

frontend에서는 이 event를 그대로 보여주기보다 `ToolCallView`로 누적해 렌더링한다.

### custom progress와 tool progress

`tools` mode와 `custom` mode는 목적이 다르다.

| mode | 사용 기준 |
|---|---|
| `tools` | tool lifecycle 자체를 보여준다. |
| `custom` | 업무 도메인 progress를 보여준다. |

예를 들어 검색 tool이 100개 문서를 훑는다면 tool 실행 lifecycle은 `tools`로, "37/100개 문서 분석 완료" 같은 업무 progress는 `custom`으로 보내는 편이 좋다.

```ts
const analyzeDocs = tool(
  async function* ({ query }) {
    yield { type: "progress", label: "문서 검색 중", value: 0.3 };
    yield { type: "progress", label: "근거 정리 중", value: 0.7 };
    return `분석 결과: ${query}`;
  },
  {
    name: "analyze_docs",
    description: "문서를 검색하고 분석한다.",
    schema: z.object({
      query: z.string(),
    }),
  }
);
```

### tool result와 artifact 분리

tool result가 긴 표, 파일, 차트, 검색 결과 목록이면 assistant message에 모두 넣지 않는다.

권장 구조:

- ToolMessage: LLM이 최종 답변을 만들 수 있는 요약
- Artifact state: UI가 별도 panel에서 렌더링할 구조화 데이터
- Citation state: 출처 목록

```ts
return {
  messages: [toolMessage],
  artifact: {
    id: "search-results",
    kind: "search-results",
    title: "검색 결과",
    content: results,
  },
};
```

### 이 단계의 완료 기준

- tool call raw object를 UI view model로 변환한다.
- running/completed/error 상태를 구분한다.
- tool input/output을 그대로 노출하지 않는다.
- `tools`와 `custom` stream mode의 차이를 설명할 수 있다.
- 긴 tool result는 artifact panel로 분리한다.

## 17. Human-in-the-loop

이 장의 목표는 agent 실행 중 사용자 승인, 편집, 입력이 필요한 지점에서 graph를 멈추고, UI에서 사용자 결정을 받은 뒤 같은 thread에서 실행을 재개하는 흐름을 구현하는 것이다.

### HITL이 필요한 경우

Human-in-the-loop이 필요한 대표 상황:

- 결제, 삭제, 이메일 발송 같은 irreversible action
- 외부 API에 쓰기 요청을 보내는 tool
- 사용자의 개인 정보 또는 민감 데이터를 다루는 작업
- LLM이 생성한 내용을 사람이 검토해야 하는 workflow
- form 입력이 없으면 다음 단계로 갈 수 없는 workflow

원칙은 단순하다. 위험하거나 사용자의 의도가 더 필요한 작업은 tool 실행 전에 멈춘다.

### interrupt 흐름

```text
Graph node
  -> interrupt(payload)
  -> checkpoint 저장
  -> frontend에 interrupt payload 표시
  -> user decision
  -> Command({ resume })
  -> 같은 thread에서 graph 재개
```

interrupt는 thread와 checkpoint 없이는 제대로 동작하지 않는다. 같은 `threadId`로 resume해야 한다.

### approval node

```ts
import { Command, GraphNode, interrupt } from "@langchain/langgraph";
import { AgentState } from "./state";

type ApprovalResume = {
  approved: boolean;
};

export const approvalNode: GraphNode<typeof AgentState> = async (state) => {
  const resume = interrupt({
    type: "approval",
    title: "작업 승인 필요",
    description: "외부 시스템에 변경 사항을 적용하려고 합니다.",
    action: {
      name: "update_external_system",
      summary: "고객 레코드 업데이트",
    },
  }) as ApprovalResume;

  if (!resume.approved) {
    return {
      messages: [{ role: "ai", content: "요청한 작업을 취소했습니다." }],
    };
  }

  return new Command({ goto: "execute_action" });
};
```

interrupt payload는 JSON-serializable 해야 한다. function, class instance, cyclic object를 넣지 않는다.

### graph resume

local graph invoke에서는 같은 config의 `thread_id`를 사용한다.

```ts
import { Command } from "@langchain/langgraph";

const config = {
  configurable: {
    thread_id: "thread-1",
  },
};

const interrupted = await graph.invoke(
  { messages: [{ role: "user", content: "고객 정보를 업데이트해줘" }] },
  config
);

console.log(interrupted.__interrupt__);

const resumed = await graph.invoke(
  new Command({ resume: { approved: true } }),
  config
);

console.log(resumed.messages.at(-1));
```

LangGraph API server와 React SDK를 사용할 때도 개념은 같다. UI에서 받은 resume payload를 command로 전달하고, 같은 thread에서 이어서 실행한다.

### frontend interrupt UI

```tsx
type ApprovalInterrupt = {
  type: "approval";
  title: string;
  description?: string;
  action?: {
    name: string;
    summary?: string;
  };
};

function ApprovalInterruptBox({
  interrupt,
  onResume,
}: {
  interrupt: ApprovalInterrupt;
  onResume: (value: { approved: boolean }) => void;
}) {
  return (
    <section>
      <h3>{interrupt.title}</h3>
      {interrupt.description ? <p>{interrupt.description}</p> : null}
      {interrupt.action?.summary ? <p>{interrupt.action.summary}</p> : null}
      <button onClick={() => onResume({ approved: true })}>승인</button>
      <button onClick={() => onResume({ approved: false })}>거절</button>
    </section>
  );
}
```

stream에서 interrupt를 읽어 표시한다.

```tsx
function InterruptPanel({ stream }: { stream: ReturnType<typeof useAgentStream> }) {
  const interrupt = stream.interrupt;

  if (!interrupt) return null;

  if (isApprovalInterrupt(interrupt.value)) {
    return (
      <ApprovalInterruptBox
        interrupt={interrupt.value}
        onResume={(value) => {
          stream.submit(undefined, {
            command: { resume: value },
          });
        }}
      />
    );
  }

  return <p>사용자 입력이 필요합니다.</p>;
}
```

SDK 버전에 따라 resume command 전달 shape가 달라질 수 있으므로, 실제 프로젝트에서는 `resumeInterrupt(value)` adapter를 만든다.

```ts
export function resumeInterrupt(
  stream: ReturnType<typeof useAgentStream>,
  value: unknown
) {
  return stream.submit(undefined, {
    command: { resume: value },
  });
}
```

### type guard

interrupt payload는 외부 입력처럼 취급하고 검증한다.

```ts
function isApprovalInterrupt(value: unknown): value is ApprovalInterrupt {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type === "approval" &&
    "title" in value &&
    typeof value.title === "string"
  );
}
```

### interrupt 설계 규칙

- interrupt payload는 JSON-serializable 해야 한다.
- node 안에서 `interrupt()`를 `try/catch`로 감싸지 않는다.
- resume 시 같은 `threadId`를 사용한다.
- interrupt 전에 실행한 side effect는 resume 때 다시 실행될 수 있음을 고려한다.
- irreversible action은 interrupt 이후 node에서 실행한다.
- 여러 interrupt가 동시에 생길 수 있으면 interrupt id와 resume value mapping을 설계한다.

중요한 점은 resume 시 interrupt가 발생한 node가 처음부터 다시 실행될 수 있다는 것이다. 따라서 interrupt 이전에 외부 API 쓰기, 결제, 삭제 같은 side effect를 두면 안 된다.

### approval, edit, respond

HITL payload는 처음부터 범용 schema로 잡아두면 확장하기 쉽다.

```ts
type HitlDecision =
  | { type: "approve" }
  | { type: "reject"; reason?: string }
  | { type: "edit"; value: unknown }
  | { type: "respond"; message: string };
```

tool 승인 workflow에서는 다음처럼 쓸 수 있다.

```ts
type ToolReviewInterrupt = {
  type: "tool_review";
  toolCallId: string;
  toolName: string;
  argsPreview: Record<string, unknown>;
  allowedDecisions: Array<HitlDecision["type"]>;
};
```

### assistant-ui와 HITL

assistant-ui를 쓰는 경우에도 핵심은 같다.

- thread state에서 interrupt payload를 복원한다.
- UI message를 `requires-action` 상태로 표시한다.
- 사용자 결정을 resume command로 보낸다.
- resume 이후 같은 thread에서 streaming이 이어진다.

assistant-ui는 이 과정을 runtime과 message state에 더 자연스럽게 연결할 수 있다. custom UI에서 interrupt flow를 먼저 이해한 뒤 assistant-ui runtime에 붙이는 것이 좋다.

### 이 단계의 완료 기준

- `interrupt()`와 `Command({ resume })`의 관계를 설명할 수 있다.
- interrupt payload schema를 정의할 수 있다.
- 승인/거절 UI를 만들 수 있다.
- 같은 `threadId`로 resume해야 하는 이유를 설명할 수 있다.
- interrupt 이전에 side effect를 두면 안 되는 이유를 이해한다.

### 60% 지점 완료 기준

여기까지 완료하면 agent frontend의 핵심 기능인 tool calling, tool 상태 표시, human-in-the-loop을 설계할 수 있다.

- ToolNode 기반 tool loop를 만들 수 있다.
- tool call UI를 raw data가 아니라 view model로 렌더링한다.
- tool progress와 custom progress를 구분한다.
- interrupt payload와 resume payload를 schema로 관리한다.
- 민감 tool 실행 전에 approval interrupt를 넣을 수 있다.

## 18. 상태 관리 전략

이 장의 목표는 LangGraph state, React local state, server cache, app DB metadata의 경계를 정하는 것이다. agent frontend가 복잡해지는 가장 흔한 원인은 같은 데이터를 여러 곳에서 source of truth로 관리하는 것이다.

### source of truth 원칙

| 데이터 | source of truth | 예시 |
|---|---|---|
| 대화 message | LangGraph thread state | `messages` |
| graph 실행 결과 | LangGraph state | `values`, `artifact`, `citations` |
| 실행 중 stream 상태 | React stream hook | `isLoading`, `error`, `toolCalls`, `interrupts` |
| 입력창 값 | React local state | composer textarea |
| UI 접힘/펼침 | React local state | artifact panel collapsed |
| thread title/archive/pin | app DB 또는 thread metadata | sidebar metadata |
| 사용자 권한 | auth server/app DB | user-thread ownership |

기본 원칙은 backend graph state를 agent 실행의 source of truth로 두고, React local state는 화면 상호작용에만 사용한다.

### React local state로 충분한 것

React local state는 화면을 벗어나면 사라져도 되는 값에 적합하다.

```tsx
const [composerValue, setComposerValue] = useState("");
const [isSidebarOpen, setIsSidebarOpen] = useState(true);
const [collapsedArtifactIds, setCollapsedArtifactIds] = useState<Set<string>>(
  () => new Set()
);
```

local state로 관리하기 좋은 값:

- textarea 입력값
- modal open/close
- panel collapsed 상태
- hover/selection 상태
- 현재 탭
- temporary optimistic UI 상태

local state로 관리하면 안 되는 값:

- message history
- tool result
- interrupt payload
- checkpoint 기반 복원 대상
- 다른 기기/탭에서 이어져야 하는 상태

### stream state를 그대로 쓰는 것

`useStream` root projection은 agent 실행 상태를 보여주는 기본 데이터이다.

```tsx
const stream = useAgentStream(threadId);

const messages = stream.messages;
const values = stream.values;
const toolCalls = stream.toolCalls;
const interrupts = stream.interrupts;
const isLoading = stream.isLoading;
const error = stream.error;
```

이 값들은 별도 store에 복사하지 않는다. 복사하는 순간 sync 문제가 생긴다.

좋은 패턴:

```tsx
<MessageList messages={stream.messages} />
<ToolCallList toolCalls={stream.toolCalls} />
<InterruptPanel interrupts={stream.interrupts} />
```

피해야 할 패턴:

```tsx
const [messages, setMessages] = useState(stream.messages);
```

stream projection을 local state로 복사하면 token streaming 중 누락, 중복, stale render가 생기기 쉽다.

### derived view model

UI에 바로 쓰기 어려운 stream data는 view model로 변환한다.

```ts
type AgentThreadView = {
  messages: ChatMessageView[];
  tools: ToolCallView[];
  isBusy: boolean;
  hasError: boolean;
};

export function toAgentThreadView(stream: {
  messages: unknown[];
  toolCalls?: unknown;
  isLoading: boolean;
  error?: unknown;
}): AgentThreadView {
  return {
    messages: stream.messages.map(toChatMessageView),
    tools: Array.from(stream.toolCalls ?? []).map(toToolCallView),
    isBusy: stream.isLoading,
    hasError: Boolean(stream.error),
  };
}
```

view model은 render 시점에 계산하거나 `useMemo`로 memoize한다.

```tsx
const view = useMemo(() => toAgentThreadView(stream), [
  stream.messages,
  stream.toolCalls,
  stream.isLoading,
  stream.error,
]);
```

### Zustand/Redux가 필요한 경우

external store는 신중하게 쓴다. agent stream 자체를 store에 넣기보다 app shell 상태를 관리하는 데 사용한다.

필요한 경우:

- 여러 route에서 공유하는 sidebar 상태
- selected artifact
- global command palette
- cross-thread UI preference
- toast queue
- upload manager

부적절한 경우:

- `stream.messages` 복사
- `stream.values` 전체 복사
- run lifecycle을 별도로 재구현
- interrupt state 중복 관리

### optimistic update

user message submit 직후 UI에 message를 먼저 보여주고 싶을 수 있다. 이때도 optimistic message는 명확히 표시한다.

```ts
type OptimisticMessage = {
  id: string;
  type: "human";
  content: string;
  status: "pending" | "committed" | "failed";
};
```

기본 학습 단계에서는 optimistic update를 미룬다. `useStream`이 submit 이후 message를 반영하는지 먼저 확인한다. 이후 UX 개선 단계에서 optimistic queue를 추가한다.

### 중복 message 제거

message id가 있으면 id 기준으로 중복 제거한다.

```ts
export function uniqueMessages<T extends { id?: string }>(messages: T[]) {
  const seen = new Set<string>();

  return messages.filter((message) => {
    if (!message.id) return true;
    if (seen.has(message.id)) return false;
    seen.add(message.id);
    return true;
  });
}
```

id가 없는 message에 content 기반 dedupe를 적용하면 streaming 중 partial content가 사라질 수 있다. 가능하면 backend/runtime이 안정적인 message id를 제공하게 둔다.

### race condition 방지

thread 전환, submit, stop, reconnect가 동시에 일어날 수 있다.

방지 기준:

- `threadId` 변경 시 component key를 바꿔 stream instance를 분리한다.
- running 중 submit을 막는다.
- stop 후 submit 허용 시점은 `isLoading`이 false가 된 뒤로 둔다.
- async effect는 cleanup flag를 둔다.
- route param이 바뀌면 이전 thread의 active run state를 버린다.

```tsx
useEffect(() => {
  let cancelled = false;

  async function load() {
    const state = await getThreadRuntimeState(threadId);
    if (!cancelled) {
      setRuntimeState(state);
    }
  }

  load();

  return () => {
    cancelled = true;
  };
}, [threadId]);
```

### 이 단계의 완료 기준

- graph state와 React local state의 역할을 구분할 수 있다.
- `stream.messages`를 별도 state로 복사하지 않는다.
- UI view model adapter를 둘 수 있다.
- external store가 필요한 경우와 아닌 경우를 구분한다.
- thread 전환과 async race condition을 고려한다.

## 19. Agent UX 고도화

이 장의 목표는 기본 chat UI를 agent다운 제품 경험으로 확장하는 것이다. agent frontend는 단순히 답변을 보여주는 것이 아니라, agent가 어떤 일을 하고 있는지, 어떤 근거로 답하는지, 사용자가 어떻게 개입할 수 있는지를 보여줘야 한다.

### 고도화 우선순위

처음부터 모든 UX를 넣지 않는다. 다음 순서가 안정적이다.

1. 실행 중 상태: loading, stop, reconnect
2. tool 상태: running, completed, error
3. source/citation: 답변 근거 표시
4. artifact: 표, 문서, 파일, 차트 분리
5. retry/regenerate: 실패와 재생성
6. edit/branch: message editing과 checkpoint branch
7. feedback: 좋아요/싫어요, comment

### 실행 단계 timeline

multi-step graph는 단계별 상태를 보여주면 사용자가 기다릴 수 있다.

```ts
type AgentTimelineStep = {
  id: string;
  label: string;
  nodeName: string;
  status: "idle" | "running" | "completed" | "error";
  summary?: string;
};
```

node metadata와 `stream.values`를 조합해 status를 만든다.

```ts
function getNodeStatus({
  nodeName,
  completed,
  streamingNode,
}: {
  nodeName: string;
  completed: boolean;
  streamingNode?: string;
}) {
  if (completed) return "completed";
  if (streamingNode === nodeName) return "running";
  return "idle";
}
```

LangGraph frontend pattern에서는 message metadata의 `langgraph_node`를 사용해 어떤 node가 token을 만들었는지 식별할 수 있다.

### artifact panel

긴 결과물은 message bubble에 넣지 않는다.

artifact 예시:

- 검색 결과 목록
- 코드 파일
- 분석 리포트
- 차트 데이터
- SQL query 결과
- 생성된 문서 초안

state shape:

```ts
type AgentArtifact = {
  id: string;
  kind: "report" | "table" | "code" | "chart" | "search-results";
  title: string;
  content: unknown;
  createdByNode?: string;
};
```

UI:

```tsx
function ArtifactPanel({ artifact }: { artifact?: AgentArtifact }) {
  if (!artifact) return null;

  return (
    <aside>
      <h2>{artifact.title}</h2>
      <pre>{JSON.stringify(artifact.content, null, 2)}</pre>
    </aside>
  );
}
```

위 예시는 일부러 단순한 debug rendering이다. 실제 UI에서는 `kind`별 renderer를 분리한다.

```tsx
function ArtifactRenderer({ artifact }: { artifact: AgentArtifact }) {
  switch (artifact.kind) {
    case "table":
      return <TableArtifact content={artifact.content} />;
    case "code":
      return <CodeArtifact content={artifact.content} />;
    case "search-results":
      return <SearchResultsArtifact content={artifact.content} />;
    default:
      return <pre>{JSON.stringify(artifact.content, null, 2)}</pre>;
  }
}
```

### source citation

RAG나 검색 agent는 답변 근거를 분리해서 보여준다.

```ts
type Citation = {
  id: string;
  title: string;
  url?: string;
  excerpt?: string;
  score?: number;
};
```

UI 기준:

- 답변 bubble에는 inline citation marker를 둔다.
- side panel에는 source list를 둔다.
- excerpt는 짧게 보여준다.
- source 클릭 시 원문 또는 내부 문서로 이동한다.

```tsx
function CitationList({ citations }: { citations: Citation[] }) {
  if (citations.length === 0) return null;

  return (
    <aside>
      <h2>Sources</h2>
      {citations.map((citation) => (
        <article key={citation.id}>
          <h3>{citation.title}</h3>
          {citation.excerpt ? <p>{citation.excerpt}</p> : null}
        </article>
      ))}
    </aside>
  );
}
```

### retry와 regenerate

retry는 실패한 run을 다시 시도하는 것이고, regenerate는 같은 user message에서 assistant response를 다시 생성하는 것이다. 둘을 구분한다.

| 기능 | 의미 |
|---|---|
| retry | error가 난 run을 다시 실행 |
| regenerate | 마지막 assistant response를 새로 생성 |
| edit | 이전 user message를 수정하고 branch 생성 |
| branch | checkpoint history에서 새 경로 생성 |

초기 구현에서는 retry만 제공한다. regenerate/edit/branch는 checkpoint history 이해가 필요하므로 뒤에서 확장한다.

```tsx
function RetryButton({
  disabled,
  onRetry,
}: {
  disabled: boolean;
  onRetry: () => void;
}) {
  return (
    <button type="button" disabled={disabled} onClick={onRetry}>
      Retry
    </button>
  );
}
```

### feedback

사용자 feedback은 모델 품질 개선과 디버깅에 중요하다.

```ts
type MessageFeedback = {
  messageId: string;
  rating: "up" | "down";
  comment?: string;
  threadId: string;
  runId?: string;
};
```

feedback 저장 시 함께 남길 값:

- `threadId`
- `messageId`
- `runId`
- `assistantId`
- user id
- timestamp
- optional comment

message content 전체를 그대로 저장할지는 privacy 정책에 따라 결정한다.

### file attachment

attachment를 붙일 때는 message와 upload lifecycle을 분리한다.

```ts
type UploadItem = {
  id: string;
  fileName: string;
  status: "queued" | "uploading" | "uploaded" | "failed";
  url?: string;
};
```

submit 전에 file upload를 완료하고, graph input에는 file reference만 전달한다.

```ts
await stream.submit({
  messages: [
    {
      type: "human",
      content: "이 파일을 분석해줘.",
      attachments: uploadedFiles.map((file) => ({
        name: file.fileName,
        url: file.url,
      })),
    },
  ],
});
```

실제 attachment shape는 사용하는 runtime과 backend graph schema에 맞춰 고정한다.

### 이 단계의 완료 기준

- agent 실행 단계를 timeline으로 보여줄 수 있다.
- artifact와 message를 분리하는 기준이 있다.
- citation/source panel의 기본 shape를 정의할 수 있다.
- retry, regenerate, edit, branch의 차이를 설명할 수 있다.
- feedback과 attachment를 thread/run/message id와 연결할 수 있다.

## 20. Generative UI와 custom stream

이 장의 목표는 agent가 text만 생성하는 것이 아니라 UI에 렌더링 가능한 구조화 데이터를 생성하고, frontend가 이를 안전하게 component로 표현하는 방법을 정리하는 것이다.

### generative UI의 두 가지 방식

| 방식 | 설명 | 사용 예시 |
|---|---|---|
| structured output | agent가 정해진 schema의 JSON을 반환 | 카드, 표, 요약 블록 |
| custom stream | node/tool이 진행 중 custom event를 emit | progress, partial artifact |

처음에는 LLM이 임의 component tree를 만들게 하지 않는다. 정해진 schema와 renderer catalog 안에서만 UI를 만든다.

### structured artifact

backend graph state에 artifact를 저장한다.

```ts
type DashboardArtifact = {
  id: string;
  kind: "dashboard";
  title: string;
  cards: Array<{
    label: string;
    value: string;
    trend?: "up" | "down" | "flat";
  }>;
};
```

node는 structured artifact를 반환한다.

```ts
const buildDashboard: GraphNode<typeof AgentState> = async () => {
  return {
    artifact: {
      id: "sales-dashboard",
      kind: "dashboard",
      title: "매출 요약",
      cards: [
        { label: "이번 달 매출", value: "12.4M", trend: "up" },
        { label: "전환율", value: "4.2%", trend: "flat" },
      ],
    },
  };
};
```

frontend는 `kind`별 renderer를 사용한다.

```tsx
function DashboardArtifact({ artifact }: { artifact: DashboardArtifact }) {
  return (
    <section>
      <h2>{artifact.title}</h2>
      {artifact.cards.map((card) => (
        <article key={card.label}>
          <div>{card.label}</div>
          <strong>{card.value}</strong>
        </article>
      ))}
    </section>
  );
}
```

### renderer catalog

generative UI는 "AI가 아무 React component나 호출한다"가 아니다. frontend가 허용한 renderer만 사용할 수 있게 한다.

```ts
type ArtifactKind = "dashboard" | "table" | "chart" | "report";

type ArtifactRendererMap = Record<
  ArtifactKind,
  (props: { artifact: unknown }) => JSX.Element
>;
```

```tsx
const renderers: ArtifactRendererMap = {
  dashboard: DashboardRenderer,
  table: TableRenderer,
  chart: ChartRenderer,
  report: ReportRenderer,
};

function RenderArtifact({ artifact }: { artifact: { kind: ArtifactKind } }) {
  const Renderer = renderers[artifact.kind];
  return <Renderer artifact={artifact} />;
}
```

unknown `kind`는 렌더링하지 않거나 safe fallback으로 보낸다.

### custom stream event

긴 작업에서는 최종 artifact를 기다리지 않고 중간 event를 보낸다.

```ts
import { GraphNode, LangGraphRunnableConfig } from "@langchain/langgraph";

const generateReport: GraphNode<typeof AgentState> = async (
  state,
  config: LangGraphRunnableConfig
) => {
  config.writer({
    type: "report_progress",
    reportId: "monthly-report",
    label: "데이터 수집 중",
    value: 0.2,
  });

  config.writer({
    type: "report_progress",
    reportId: "monthly-report",
    label: "요약 생성 중",
    value: 0.7,
  });

  return {
    artifact: {
      id: "monthly-report",
      kind: "report",
      title: "월간 리포트",
      content: "완성된 리포트",
    },
  };
};
```

custom event schema:

```ts
type CustomUiEvent =
  | {
      type: "report_progress";
      reportId: string;
      label: string;
      value: number;
    }
  | {
      type: "artifact_ready";
      artifactId: string;
    };
```

### partial artifact state

frontend에서는 custom event를 partial artifact state로 축적할 수 있다.

```ts
type PartialArtifactState = {
  id: string;
  progress: number;
  label: string;
};

function reduceCustomEvent(
  state: PartialArtifactState | undefined,
  event: CustomUiEvent
): PartialArtifactState | undefined {
  if (event.type === "report_progress") {
    return {
      id: event.reportId,
      progress: event.value,
      label: event.label,
    };
  }

  return state;
}
```

중요한 점은 partial state와 final graph state를 구분하는 것이다. custom event는 진행 상태이고, 최종 artifact는 checkpoint에 저장되는 graph state이다.

### node별 streaming card

multi-step graph는 node별 card로 보여줄 수 있다. `getMessagesMetadata`로 message가 어떤 LangGraph node에서 나왔는지 확인한다.

```tsx
function getStreamingContentByNode({
  messages,
  getMetadata,
}: {
  messages: Array<{ type: string; content: unknown }>;
  getMetadata: (message: unknown) => { streamMetadata?: Record<string, unknown> } | undefined;
}) {
  const content: Record<string, string> = {};

  for (const message of messages) {
    if (message.type !== "ai") continue;

    const metadata = getMetadata(message);
    const node = metadata?.streamMetadata?.langgraph_node;

    if (typeof node === "string" && typeof message.content === "string") {
      content[node] = message.content;
    }
  }

  return content;
}
```

이 패턴은 research, analyze, synthesize처럼 node가 명확한 pipeline UI에 적합하다.

### 안전한 rendering 규칙

AI가 생성한 구조화 데이터를 UI로 렌더링할 때는 반드시 검증한다.

- unknown component type은 렌더링하지 않는다.
- URL, markdown, HTML은 sanitize 정책을 둔다.
- function name, action name을 그대로 실행하지 않는다.
- renderer catalog 외 component는 허용하지 않는다.
- partial streaming data는 schema validation 후 렌더링한다.
- 사용자 권한이 필요한 data는 server에서 필터링한다.

### 이 단계의 완료 기준

- structured artifact와 custom stream event의 차이를 설명할 수 있다.
- artifact `kind`별 renderer catalog를 만들 수 있다.
- custom event schema를 정의할 수 있다.
- partial progress와 final graph state를 분리할 수 있다.
- AI-generated UI data를 검증한 뒤 렌더링해야 하는 이유를 이해한다.

### 70% 지점 완료 기준

여기까지 완료하면 agent frontend의 제품 경험과 고급 UI 설계를 시작할 수 있다.

- graph state, stream state, local UI state의 경계를 설명할 수 있다.
- timeline, artifact, citation, feedback, attachment의 기본 shape를 설계할 수 있다.
- structured artifact를 component로 렌더링할 수 있다.
- custom stream event로 progress UI를 만들 수 있다.
- renderer catalog와 validation으로 generative UI를 안전하게 제한할 수 있다.

## 21. Backend proxy와 보안

이 장의 목표는 local prototype에서 production 구조로 넘어갈 때 반드시 필요한 보안 경계를 정리하는 것이다. LangGraph server가 browser에서 직접 호출 가능한 endpoint처럼 보이더라도, 운영에서는 대부분 Next.js route handler 같은 backend proxy를 둔다.

핵심 원칙은 간단하다.

- browser에는 LangGraph API key, LangSmith key, model provider key를 노출하지 않는다.
- user identity와 thread ownership은 server에서 검증한다.
- assistant id와 tool 권한은 allowlist로 제한한다.
- model이 생성한 text와 server가 검증한 action metadata를 같은 신뢰도로 취급하지 않는다.

### local과 production 호출 구조

local prototype:

```text
Browser
  -> @langchain/react useStream
  -> http://localhost:2024
  -> LangGraph dev server
```

production:

```text
Browser
  -> @langchain/react useStream
  -> /api/langgraph/*
  -> Next.js route handler
  -> LangGraph API server
```

`useStream`에서는 `apiUrl`만 proxy로 바꾸면 된다.

```tsx
import { useStream } from "@langchain/react";

export function useAgentStream(threadId?: string) {
  return useStream({
    apiUrl: "/api/langgraph",
    assistantId: process.env.NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID ?? "agent",
    threadId,
  });
}
```

운영에서 `NEXT_PUBLIC_` 변수는 공개 값이다. 여기에는 endpoint, assistant id처럼 공개되어도 되는 값만 둔다. secret은 `LANGGRAPH_API_KEY`, `LANGSMITH_API_KEY`, model provider key처럼 server process에서만 읽는다.

### proxy route 기본 구조

Next.js App Router 기준으로 `app/api/langgraph/[...path]/route.ts`를 둔다.

```ts
// src/app/api/langgraph/[...path]/route.ts
import type { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CurrentUser = {
  id: string;
  scopes: string[];
};

type ProxyContext = {
  params: { path?: string[] } | Promise<{ path?: string[] }>;
};

type JsonObject = Record<string, unknown>;

const LANGGRAPH_API_URL = process.env.LANGGRAPH_API_URL!;
const LANGGRAPH_API_KEY = process.env.LANGGRAPH_API_KEY;
const ALLOWED_ASSISTANT_IDS = new Set(
  (process.env.LANGGRAPH_ALLOWED_ASSISTANTS ?? "agent")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
);

class ProxyHttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

declare function readSessionFromYourAuthProvider(
  request: Request
): Promise<CurrentUser | null>;

declare function assertAppThreadOwner(
  threadId: string,
  userId: string
): Promise<void>;

declare function consumeRateLimit(
  key: string,
  options: { limit: number; windowMs: number }
): Promise<boolean>;

function isRecord(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getThreadId(path: string[]) {
  const threadIndex = path.indexOf("threads");
  return threadIndex >= 0 ? path[threadIndex + 1] : undefined;
}

function isRunCreatePath(method: string, path: string[]) {
  return method === "POST" && path.includes("runs");
}

async function getProxyPath(context: ProxyContext) {
  const params = await context.params;
  return params.path ?? [];
}

async function getCurrentUser(request: Request) {
  return readSessionFromYourAuthProvider(request);
}
```

`declare function`으로 둔 부분은 프로젝트의 인증 provider, app DB, rate limiter로 교체한다. proxy에서 중요한 것은 "브라우저가 준 user id를 믿지 않고 server session에서 user를 만든다"는 점이다.

### request 검증과 body 보강

run 생성 요청에는 owner metadata와 runtime configurable 값을 server에서 추가한다.

```ts
async function buildUpstreamBody(
  request: Request,
  path: string[],
  user: CurrentUser
) {
  if (request.method === "GET" || request.method === "HEAD") {
    return undefined;
  }

  const contentType = request.headers.get("content-type") ?? "";
  const shouldInspectJson = contentType.includes("application/json");

  if (!shouldInspectJson) {
    return request.body ?? undefined;
  }

  const text = await request.text();
  if (!text) return undefined;

  let body: unknown;

  try {
    body = JSON.parse(text) as unknown;
  } catch {
    throw new ProxyHttpError(400, "Invalid JSON");
  }

  if (!isRecord(body)) {
    return text;
  }

  if (isRunCreatePath(request.method, path)) {
    const assistantId =
      typeof body.assistant_id === "string"
        ? body.assistant_id
        : typeof body.assistantId === "string"
          ? body.assistantId
          : undefined;

    if (assistantId && !ALLOWED_ASSISTANT_IDS.has(assistantId)) {
      throw new ProxyHttpError(403, "Forbidden assistant");
    }

    const metadata = isRecord(body.metadata) ? body.metadata : {};
    const config = isRecord(body.config) ? body.config : {};
    const configurable = isRecord(config.configurable)
      ? config.configurable
      : {};

    body.metadata = {
      ...metadata,
      owner: user.id,
    };

    body.config = {
      ...config,
      configurable: {
        ...configurable,
        userId: user.id,
        userScopes: user.scopes,
      },
    };
  }

  return JSON.stringify(body);
}
```

이 패턴의 목적은 frontend가 보낸 `metadata.owner`, `configurable.userId`, `scopes`를 신뢰하지 않는 것이다. browser에서 보낸 값은 조작 가능하므로 proxy가 overwrite한다.

### header와 SSE pass-through

upstream으로 전달할 header는 제한한다. browser의 `Authorization`, `Cookie`, 임의 `x-user-id`를 그대로 넘기지 않는다.

```ts
function buildUpstreamHeaders(request: Request, user: CurrentUser) {
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");

  if (contentType) headers.set("content-type", contentType);
  if (accept) headers.set("accept", accept);
  if (LANGGRAPH_API_KEY) headers.set("x-api-key", LANGGRAPH_API_KEY);

  headers.set("x-agent-user-id", user.id);
  headers.set("x-agent-scopes", user.scopes.join(","));

  return headers;
}

function buildResponseHeaders(upstreamHeaders: Headers) {
  const headers = new Headers();
  const contentType = upstreamHeaders.get("content-type");
  const requestId = upstreamHeaders.get("x-request-id");

  if (contentType) headers.set("content-type", contentType);
  if (requestId) headers.set("x-request-id", requestId);

  headers.set("cache-control", "no-store");

  if (contentType?.includes("text/event-stream")) {
    headers.set("connection", "keep-alive");
  }

  return headers;
}
```

SSE stream은 `Response` body를 그대로 반환한다.

```ts
async function proxy(request: NextRequest, context: ProxyContext) {
  const path = await getProxyPath(context);
  const user = await getCurrentUser(request);

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const allowed = await consumeRateLimit(`agent:${user.id}`, {
    limit: 30,
    windowMs: 60_000,
  });

  if (!allowed) {
    return new Response("Too many requests", { status: 429 });
  }

  const threadId = getThreadId(path);
  if (threadId) {
    await assertAppThreadOwner(threadId, user.id);
  }

  const requestUrl = new URL(request.url);
  const upstreamUrl = new URL(
    `${path.join("/")}${requestUrl.search}`,
    `${LANGGRAPH_API_URL.replace(/\/$/, "")}/`
  );

  let body: BodyInit | ReadableStream<Uint8Array> | undefined;

  try {
    body = await buildUpstreamBody(request, path, user);
  } catch (error) {
    if (error instanceof ProxyHttpError) {
      return new Response(error.message, { status: error.status });
    }

    throw error;
  }

  const init: RequestInit & { duplex?: "half" } = {
    method: request.method,
    headers: buildUpstreamHeaders(request, user),
  };

  if (body !== undefined) {
    init.body = body;
    if (typeof body !== "string") {
      init.duplex = "half";
    }
  }

  const upstream = await fetch(upstreamUrl, init);

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: buildResponseHeaders(upstream.headers),
  });
}

export function GET(request: NextRequest, context: ProxyContext) {
  return proxy(request, context);
}

export function POST(request: NextRequest, context: ProxyContext) {
  return proxy(request, context);
}

export function PATCH(request: NextRequest, context: ProxyContext) {
  return proxy(request, context);
}

export function DELETE(request: NextRequest, context: ProxyContext) {
  return proxy(request, context);
}
```

이 proxy는 "예시 골격"이다. 실제 배포에서는 사용하는 host, edge/node runtime, reverse proxy, auth provider에 따라 streaming buffering 여부를 별도로 확인한다.

### LangGraph Platform auth와 proxy의 관계

LangGraph Platform 또는 LangSmith Deployment의 custom auth를 사용한다면 proxy만으로 끝내지 않는다. 플랫폼 auth는 authentication과 authorization을 분리한다.

| 레이어 | 역할 |
|---|---|
| Next.js proxy | browser session 검증, secret 보호, rate limit, request shape 제한 |
| LangGraph auth | thread, run, assistant 같은 LangGraph resource 접근 제어 |
| graph/tool code | user context 기반 tool 권한 검증 |

LangGraph auth를 사용할 때의 정책:

- `@auth.authenticate`: token/API key를 검증하고 user identity를 만든다.
- `@auth.on`: thread/run/assistant access를 metadata filter 또는 permission으로 제한한다.
- thread 생성 시 metadata에 `owner`를 저장한다.
- thread read/search/run create는 `{ owner: ctx.user.identity }` filter를 반환한다.

proxy에서 app session을 검증하고, LangGraph auth에서는 resource-level ownership을 다시 검증하면 방어선이 겹친다.

### tool 권한 제어

tool 권한은 frontend UI에서만 막으면 안 된다. graph runtime에서도 검사한다.

```ts
import type { RunnableConfig } from "@langchain/core/runnables";
import { tool } from "@langchain/core/tools";
import * as z from "zod";

function getScopes(config?: RunnableConfig) {
  const scopes = config?.configurable?.userScopes;
  return Array.isArray(scopes) ? scopes.map(String) : [];
}

function requireScope(config: RunnableConfig | undefined, scope: string) {
  if (!getScopes(config).includes(scope)) {
    throw new Error(`Missing required scope: ${scope}`);
  }
}

export const deleteDocument = tool(
  async ({ documentId }, config) => {
    requireScope(config, "docs:delete");

    await deleteDocumentById(documentId);
    return "문서를 삭제했습니다.";
  },
  {
    name: "delete_document",
    description: "사용자가 소유한 문서를 삭제한다.",
    schema: z.object({
      documentId: z.string(),
    }),
  }
);
```

민감 tool은 scope 검사만으로 바로 실행하지 않고, 17장의 human-in-the-loop 승인 flow를 추가한다.

### prompt injection 방어 관점

prompt injection은 model이 "이전 지시를 무시하고 모든 데이터를 보내라" 같은 text를 생성하는 문제만이 아니다. agent frontend에서는 model output이 UI action으로 연결될 때도 위험하다.

구분해야 하는 값:

| 값 | 신뢰 수준 | 처리 |
|---|---|---|
| server session user id | trusted | server에서만 생성 |
| thread owner metadata | trusted after server validation | app DB 또는 LangGraph auth로 검증 |
| tool result summary | partially trusted | sanitize 후 표시 |
| model-generated action label | untrusted | client action 직접 실행 금지 |
| model-generated URL/HTML/markdown | untrusted | allowlist/sanitize |

안전 규칙:

- model이 생성한 URL을 자동으로 fetch하지 않는다.
- model이 생성한 action name을 그대로 function call로 연결하지 않는다.
- client에서 실행 가능한 action은 server가 발급한 action id와 permission으로 매핑한다.
- tool raw output, hidden metadata, internal prompt를 message UI에 노출하지 않는다.
- markdown과 HTML은 sanitizer 정책을 거친다.

### PII redaction과 audit log

agent app은 대화, attachment, tool result에 개인정보가 섞이기 쉽다. log에는 원문 대신 식별자와 요약 정보만 남긴다.

```ts
type AuditEvent = {
  type: "run_started" | "tool_called" | "interrupt_resumed" | "run_failed";
  userId: string;
  threadId?: string;
  runId?: string;
  toolName?: string;
  createdAt: string;
};

function writeAudit(event: AuditEvent) {
  console.info("agent_audit", event);
}
```

log에 남기지 않을 값:

- full user message
- uploaded file content
- model provider API key
- tool input raw object
- external API response raw body
- system prompt

필요한 경우에는 별도 secure storage에 암호화하고, audit log에는 reference id만 둔다.

### 참고 문서

- LangGraph/LangSmith auth: https://docs.langchain.com/langsmith/auth
- `@langchain/react` reference: https://reference.langchain.com/javascript/langchain-react
- `useStream` options: https://reference.langchain.com/javascript/langchain-langgraph-sdk/react/UseStreamOptions

### 이 단계의 완료 기준

- browser 직접 호출과 backend proxy 호출의 차이를 설명할 수 있다.
- LangGraph API key를 browser에 노출하지 않는 proxy를 만들 수 있다.
- user session에서 owner metadata와 configurable context를 server-side로 주입할 수 있다.
- thread ownership을 server에서 검증할 수 있다.
- assistant id allowlist, rate limit, tool permission, audit log의 필요성을 설명할 수 있다.

## 22. 에러 처리와 안정성

이 장의 목표는 "stream이 끊겼다", "tool이 실패했다", "agent가 무한 loop에 빠졌다" 같은 상황을 사용자 경험과 graph 실행 관점에서 분리해 처리하는 것이다.

agent frontend의 안정성은 단일 `try/catch`로 해결되지 않는다. error source가 frontend, network, LangGraph API, model provider, tool, graph node, authorization에 걸쳐 있기 때문이다.

### error 분류표

| 분류 | 예시 | 사용자 UI | 내부 처리 |
|---|---|---|---|
| auth error | 401, 403 | 로그인/권한 안내 | session refresh, 권한 로그 |
| stream error | SSE disconnect | 재연결/새로고침 안내 | thread state 재조회 |
| model error | provider timeout, rate limit | 답변 생성 실패 안내 | retry/backoff |
| tool error | 외부 API 실패 | tool card error | retry 가능 여부 기록 |
| graph error | node exception | 실행 실패 안내 | trace/run id 기록 |
| recursion error | loop 종료 실패 | 작업 중단 안내 | recursion limit 조정 |
| run conflict | running 중 중복 submit | 입력 비활성화 | active run 확인 |
| offline | browser network down | offline banner | reconnect 대기 |

사용자에게 보여줄 메시지는 짧고 행동 가능해야 한다. 내부 stack trace, provider error body, API key 관련 정보는 보여주지 않는다.

### UI error view model

frontend는 raw error를 바로 렌더링하지 않고 view model로 변환한다.

```ts
type AgentErrorCode =
  | "auth"
  | "network"
  | "stream"
  | "model"
  | "tool"
  | "graph"
  | "conflict"
  | "unknown";

type AgentErrorView = {
  code: AgentErrorCode;
  title: string;
  message: string;
  retryable: boolean;
};

function toAgentErrorView(error: unknown): AgentErrorView {
  if (error instanceof TypeError) {
    return {
      code: "network",
      title: "연결 오류",
      message: "네트워크 연결을 확인한 뒤 다시 시도하세요.",
      retryable: true,
    };
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    Number(error.status) === 403
  ) {
    return {
      code: "auth",
      title: "권한이 없습니다",
      message: "이 대화 또는 작업에 접근할 권한이 없습니다.",
      retryable: false,
    };
  }

  return {
    code: "unknown",
    title: "실행 오류",
    message: "요청을 처리하는 중 문제가 발생했습니다.",
    retryable: true,
  };
}
```

error mapping은 project adapter에 둔다. UI component는 `AgentErrorView`만 받아 렌더링한다.

```tsx
function ErrorBanner({
  error,
  onRetry,
}: {
  error: AgentErrorView;
  onRetry?: () => void;
}) {
  return (
    <div role="alert">
      <strong>{error.title}</strong>
      <p>{error.message}</p>
      {error.retryable && onRetry ? (
        <button type="button" onClick={onRetry}>
          다시 시도
        </button>
      ) : null}
    </div>
  );
}
```

### stream error 처리

`useStream`의 `error`, `isLoading`, `stop`, `switchThread` 같은 상태를 UI lifecycle과 연결한다.

```tsx
function ChatErrorBoundary({
  stream,
  threadId,
}: {
  stream: ReturnType<typeof useAgentStream>;
  threadId: string;
}) {
  if (!stream.error) return null;

  const error = toAgentErrorView(stream.error);

  return (
    <ErrorBanner
      error={error}
      onRetry={() => {
        stream.switchThread(threadId);
      }}
    />
  );
}
```

`switchThread(threadId)`는 thread state를 다시 hydrate하는 용도로 사용할 수 있다. 단, SDK 버전에 따라 reattach/hydration 동작이 달라질 수 있으므로 실제 프로젝트의 `useStream` version에서 동작을 확인한다.

### offline 상태 표시

browser network 상태는 stream error와 별도로 보여준다.

```tsx
import { useEffect, useState } from "react";

function useOnlineStatus() {
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  return online;
}
```

UI에서는 offline이면 submit을 막거나, submit을 queue에 넣을지 정책을 정한다. agent chat에서는 offline queue보다 명시적 재시도가 보통 더 안전하다.

### 중복 submit과 run conflict

중복 submit은 가장 흔한 안정성 문제다. `isLoading`만 믿지 않고 submit handler에서도 guard를 둔다.

```tsx
import { useRef } from "react";

function useSafeSubmit(stream: ReturnType<typeof useAgentStream>) {
  const pendingRef = useRef(false);

  return async function submit(content: string) {
    if (pendingRef.current || stream.isLoading) return;

    pendingRef.current = true;

    try {
      await stream.submit({
        messages: [{ type: "human", content }],
      });
    } finally {
      pendingRef.current = false;
    }
  };
}
```

server에서도 active run 또는 running thread 상태를 확인해 conflict를 막는다. frontend guard는 UX 보조 장치이고, 최종 방어선은 server다.

### run cancel

사용자가 stop을 누르면 현재 stream을 중단한다.

```tsx
function StopButton({ stream }: { stream: ReturnType<typeof useAgentStream> }) {
  return (
    <button
      type="button"
      disabled={!stream.isLoading}
      onClick={() => {
        void stream.stop();
      }}
    >
      중지
    </button>
  );
}
```

cancel 이후 정책:

- partial assistant message를 그대로 남길지 제거할지 정한다.
- thread checkpoint가 어디까지 저장됐는지 재조회한다.
- composer는 다시 활성화한다.
- "중단됨" 상태를 message metadata 또는 timeline에 표시한다.

### model/node retry policy

LangGraph에서는 node별 retry policy를 둘 수 있다. model provider, DB, 외부 API처럼 일시적 실패가 가능한 node에만 적용한다.

```ts
import { StateGraph } from "@langchain/langgraph";

const graph = new StateGraph(AgentState)
  .addNode("call_model", callModel, {
    retryPolicy: {
      maxAttempts: 3,
      retryOn: (error: unknown) => isRetryableModelError(error),
    },
  })
  .addNode("search_docs", searchDocsNode, {
    retryPolicy: {
      maxAttempts: 2,
      retryOn: (error: unknown) => isRetryableSearchError(error),
    },
  });
```

retry하면 안 되는 경우:

- schema validation 실패
- user permission 실패
- tool input이 명백히 잘못된 경우
- 결제, 삭제, 전송처럼 side effect가 있는 작업
- human approval 없이 반복 실행하면 위험한 작업

side effect tool은 idempotency key를 사용하거나, interrupt 승인 후 단 한 번만 실행되도록 설계한다.

### timeout

timeout은 model provider 옵션, tool 내부 timeout, graph run timeout 세 레이어에서 다룬다. frontend에서 오래 기다리는 spinner만 보여주는 것은 해결책이 아니다.

```ts
async function withTimeout<T>(
  task: Promise<T>,
  timeoutMs: number,
  label: string
) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${label} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([task, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}
```

tool 예시:

```ts
export async function searchDocsNode(state: typeof AgentState.State) {
  const results = await withTimeout(
    searchProjectDocs(state.messages),
    15_000,
    "search_docs"
  );

  return {
    searchResults: results,
  };
}
```

외부 API가 `AbortSignal`을 지원한다면 `AbortController`를 쓰는 방식이 더 좋다.

### graph loop와 recursion limit

tool calling agent는 조건이 잘못되면 agent -> tool -> agent loop가 끝나지 않을 수 있다. LangGraph 실행 config에는 recursion limit을 둘 수 있다.

```ts
await graph.invoke(
  {
    messages: [{ role: "user", content: "문서를 찾아줘" }],
  },
  {
    recursionLimit: 12,
  }
);
```

frontend에서는 recursion error를 "작업이 너무 길어 중단됐다"는 사용자 메시지로 바꾼다. 내부적으로는 어떤 node loop가 발생했는지 trace/run id로 확인한다.

### partial response 복구

stream connection이 끊겼을 때 frontend가 해야 할 일:

1. 현재 optimistic message를 확정 state와 구분한다.
2. thread state를 다시 조회한다.
3. checkpoint에 저장된 messages를 source of truth로 삼는다.
4. running run이 있으면 reattach 또는 join 정책을 적용한다.
5. 복구 실패 시 사용자에게 새로고침/재시도 action을 제공한다.

partial token을 local state에만 저장했다면 새로고침 후 사라질 수 있다. 운영 UI에서는 checkpoint state와 stream 중간 상태를 구분해서 표시한다.

### 사용자에게 보여줄 error와 숨길 error

보여줄 수 있는 정보:

- 요청 처리 실패 여부
- 다시 시도 가능 여부
- 권한/로그인 필요 여부
- thread id 또는 support reference id

숨길 정보:

- provider raw error body
- stack trace
- system prompt
- tool raw input/output
- internal URL
- API key, token, credential

support debugging이 필요하면 user-facing message에 `traceId`, `runId`, `threadId` 같은 reference만 표시한다.

### 참고 문서

- LangGraph JavaScript graph API retry/recursion: https://docs.langchain.com/oss/javascript/langgraph/use-graph-api
- LangGraph JavaScript fault tolerance: https://docs.langchain.com/oss/javascript/langgraph/fault-tolerance
- LangGraph common errors: https://docs.langchain.com/oss/javascript/common-errors

### 이 단계의 완료 기준

- error source를 frontend/network/model/tool/graph/auth로 분류할 수 있다.
- raw error를 사용자용 error view model로 변환할 수 있다.
- stream error, offline, run conflict, cancel을 UI 상태로 처리할 수 있다.
- node retry policy와 retry 금지 조건을 설명할 수 있다.
- timeout, recursion limit, partial response 복구 정책을 설계할 수 있다.

## 23. 테스트 전략

이 장의 목표는 LangGraph + React agent frontend를 어디까지 테스트해야 하는지 레이어별로 정리하는 것이다. agent app은 deterministic UI와 non-deterministic LLM이 섞여 있기 때문에, "모든 답변 내용을 snapshot으로 고정"하는 방식은 유지보수성이 낮다.

테스트의 핵심은 다음이다.

- graph 구조와 state transition은 unit test로 검증한다.
- LLM 답변 문장 자체보다 message shape, tool call, interrupt, artifact schema를 검증한다.
- stream event contract를 별도 테스트한다.
- React UI는 SDK raw object가 아니라 view model과 user action을 검증한다.
- thread join, reconnect, interrupt resume은 E2E 회귀 테스트로 남긴다.

### 테스트 레이어

| 레이어 | 도구 | 검증 대상 |
|---|---|---|
| graph unit | Vitest | node output, route, state reducer |
| tool unit | Vitest | tool schema, permission, error |
| API contract | Vitest/MSW | proxy request/response, auth, metadata |
| stream contract | Vitest | stream mode, event shape |
| component | React Testing Library | message/tool/error UI |
| integration | assistant-ui/custom runtime | runtime adapter 연결 |
| E2E | Playwright | thread flow, reload, reconnect, interrupt |

LLM provider를 실제로 호출하는 테스트는 smoke/eval로 분리한다. CI unit test에서는 fake model과 fake tool을 우선 사용한다.

### graph factory로 테스트 가능하게 만들기

graph를 바로 compile해서 export하면 테스트에서 model/tool dependency를 바꾸기 어렵다. factory와 compiled export를 분리한다.

```ts
// src/agent/graph.ts
import {
  END,
  MessagesValue,
  START,
  StateGraph,
  StateSchema,
} from "@langchain/langgraph";

export const AgentState = new StateSchema({
  messages: MessagesValue,
});

type AgentDeps = {
  callModel: (state: typeof AgentState.State) => Promise<Partial<typeof AgentState.State>>;
};

export function createAgentGraph(deps: AgentDeps) {
  return new StateGraph(AgentState)
    .addNode("agent", deps.callModel)
    .addEdge(START, "agent")
    .addEdge("agent", END);
}

export const graph = createAgentGraph({
  callModel: productionCallModel,
}).compile();
```

테스트에서는 fake `callModel`을 넣고 새 checkpointer로 compile한다.

```ts
// tests/agent/graph.test.ts
import { AIMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { describe, expect, test } from "vitest";
import { createAgentGraph } from "../../src/agent/graph";

function compileTestGraph() {
  return createAgentGraph({
    callModel: async () => ({
      messages: [new AIMessage("테스트 응답")],
    }),
  }).compile({
    checkpointer: new MemorySaver(),
  });
}

describe("agent graph", () => {
  test("adds an assistant message", async () => {
    const graph = compileTestGraph();

    const result = await graph.invoke(
      {
        messages: [{ role: "user", content: "hello" }],
      },
      {
        configurable: { thread_id: "test-thread-1" },
      }
    );

    expect(result.messages.at(-1)?.content).toBe("테스트 응답");
  });
});
```

공식 테스트 가이드도 graph를 테스트마다 새로 만들고, test checkpointer를 새로 compile하는 패턴을 권장한다.

### node 단위 테스트

특정 node만 테스트하면 route나 checkpoint 영향을 줄이고 순수 state update를 확인할 수 있다.

```ts
test("agent node returns model message", async () => {
  const graph = compileTestGraph();

  const result = await graph.nodes.agent.invoke({
    messages: [{ role: "user", content: "hello" }],
  });

  expect(result.messages).toHaveLength(1);
  expect(result.messages[0].content).toBe("테스트 응답");
});
```

node 단위 테스트에서 확인할 것:

- input state shape를 올바르게 읽는가
- output state key가 reducer와 맞는가
- error 상황에서 throw/return 정책이 일관적인가
- model/tool dependency를 mock할 수 있는가

### tool unit test

tool은 LLM보다 deterministic하므로 더 강하게 테스트한다.

```ts
import { describe, expect, test } from "vitest";
import { searchDocs } from "../../src/agent/tools";

describe("searchDocs tool", () => {
  test("returns summarized search results", async () => {
    const result = await searchDocs.invoke({
      query: "Thread Join",
    });

    expect(String(result)).toContain("Thread");
  });
});
```

permission이 필요한 tool은 config를 넣어 검사한다.

```ts
test("deleteDocument requires scope", async () => {
  await expect(
    deleteDocument.invoke(
      { documentId: "doc-1" },
      { configurable: { userScopes: [] } }
    )
  ).rejects.toThrow("Missing required scope");
});
```

tool test에서 raw 외부 API를 호출하지 않는다. 외부 API는 adapter로 감싸고, adapter를 mock하거나 fixture response를 사용한다.

### API contract test

proxy route는 다음 contract를 검증한다.

- unauthenticated request는 401이다.
- forbidden assistant id는 403이다.
- run create body에 `metadata.owner`가 server user id로 들어간다.
- browser가 보낸 `metadata.owner`는 overwrite된다.
- `x-api-key`는 upstream에만 전달되고 browser response에 노출되지 않는다.
- SSE `content-type`이 보존된다.

mock fetch를 사용해 upstream request를 캡처하는 방식:

```ts
import { NextRequest } from "next/server";
import { describe, expect, test, vi } from "vitest";
import { POST } from "../../src/app/api/langgraph/[...path]/route";

describe("langgraph proxy", () => {
  test("overwrites owner metadata", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("{}", {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );

    const request = new NextRequest("http://localhost/api/langgraph/threads/t1/runs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        assistant_id: "agent",
        metadata: { owner: "attacker" },
      }),
    });

    await POST(request, {
      params: { path: ["threads", "t1", "runs"] },
    });

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(String(init?.body));

    expect(body.metadata.owner).toBe("user-from-session");
  });
});
```

위 예시는 route 내부의 auth/session 함수가 test double로 대체되어 있다는 전제다. 실제 프로젝트에서는 dependency injection 또는 module mock으로 처리한다.

### stream event contract test

stream은 UI가 의존하는 event shape를 고정해야 한다.

```ts
test("streams update events", async () => {
  const graph = compileTestGraph();
  const events: unknown[] = [];

  for await (const event of await graph.stream(
    {
      messages: [{ role: "user", content: "hello" }],
    },
    {
      streamMode: "updates",
    }
  )) {
    events.push(event);
  }

  expect(events.length).toBeGreaterThan(0);
  expect(events[0]).toHaveProperty("agent");
});
```

custom event를 사용한다면 schema guard를 테스트한다.

```ts
import * as z from "zod";

const CustomUiEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("report_progress"),
    reportId: z.string(),
    label: z.string(),
    value: z.number().min(0).max(1),
  }),
]);

test("validates custom progress event", () => {
  expect(
    CustomUiEventSchema.parse({
      type: "report_progress",
      reportId: "r1",
      label: "분석 중",
      value: 0.5,
    })
  ).toBeTruthy();
});
```

stream contract test는 "토큰 문장"보다 "event mode, node key, schema"를 검증한다.

### React component test

component는 SDK를 직접 mock하기보다 view model을 넣어 테스트한다.

```tsx
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { ToolCallCard } from "../../src/components/chat/tool-call-card";

test("renders tool error", () => {
  render(
    <ToolCallCard
      tool={{
        id: "tool-1",
        name: "search_docs",
        status: "error",
        errorMessage: "문서 검색 중 오류가 발생했습니다.",
      }}
    />
  );

  expect(screen.getByText("search_docs")).toBeInTheDocument();
  expect(screen.getByRole("alert")).toHaveTextContent("오류");
});
```

message list, composer, error banner, interrupt form은 component test로 충분히 많은 regression을 잡을 수 있다.

### thread join regression test

thread join과 재접속은 단위 테스트보다 Playwright E2E가 적합하다.

```ts
import { expect, test } from "@playwright/test";

test("keeps thread state after reload", async ({ page }) => {
  await page.goto("/agents/new");

  await page.getByRole("textbox").fill("긴 작업을 시작해줘");
  await page.getByRole("button", { name: "전송" }).click();

  await expect(page.getByText("작업 중")).toBeVisible();

  await page.reload();

  await expect(page.getByText("긴 작업을 시작해줘")).toBeVisible();
  await expect(page.getByText(/작업 중|완료/)).toBeVisible();
});
```

테스트가 불안정하면 text matcher보다 data-testid와 run status indicator를 사용한다. E2E에서 LLM provider를 실제 호출하지 않고 deterministic test graph를 사용하는 편이 안정적이다.

### interrupt resume E2E

interrupt flow는 반드시 회귀 테스트로 둔다.

```ts
test("resumes an approval interrupt", async ({ page }) => {
  await page.goto("/agents/new");

  await page.getByRole("textbox").fill("문서를 삭제해줘");
  await page.getByRole("button", { name: "전송" }).click();

  await expect(page.getByText("승인이 필요합니다")).toBeVisible();

  await page.getByRole("button", { name: "승인" }).click();

  await expect(page.getByText(/완료|삭제했습니다/)).toBeVisible();
});
```

검증할 것:

- interrupt payload가 UI에 렌더링된다.
- 승인/거절 payload가 backend schema와 맞다.
- resume 후 streaming이 재개된다.
- 새로고침 후에도 interrupt form이 사라지지 않는다.

### network disconnect/reconnect test

stream 장애는 E2E에서 한 번은 재현한다.

```ts
test("shows stream error on disconnect", async ({ page }) => {
  await page.route("**/api/langgraph/**/stream", async (route) => {
    await route.abort("failed");
  });

  await page.goto("/agents/new");
  await page.getByRole("textbox").fill("hello");
  await page.getByRole("button", { name: "전송" }).click();

  await expect(page.getByRole("alert")).toContainText("연결");
});
```

reconnect test는 환경에 따라 flake가 생기기 쉽다. CI에서는 deterministic mock server로 stream을 제어하고, browser network만 조작하는 테스트는 별도 nightly로 분리할 수 있다.

### 테스트 데이터와 fixture

테스트 fixture는 다음을 포함한다.

- normal message history
- tool call running/completed/error
- interrupt pending state
- artifact with unknown kind
- citation with invalid URL
- long markdown/code block
- duplicate message id
- partial stream event
- unauthorized thread access

fixture는 실제 사용자 대화 원문을 사용하지 않는다. 필요한 경우 anonymized synthetic data를 만든다.

### CI에서 분리할 테스트

| 테스트 | CI 기본 | 별도 job |
|---|---|---|
| graph unit | yes | no |
| tool unit with mocks | yes | no |
| proxy contract | yes | no |
| component test | yes | no |
| Playwright deterministic graph | yes | optional |
| real model smoke | no | yes |
| LangSmith eval | no | yes |
| production canary | no | yes |

real model smoke test는 비용, rate limit, latency 때문에 기본 PR CI에 넣지 않는다. 대신 main branch, nightly, release candidate에서 실행한다.

### 참고 문서

- LangGraph JavaScript test guide: https://docs.langchain.com/oss/javascript/langgraph/test
- LangGraph JavaScript graph API: https://docs.langchain.com/oss/javascript/langgraph/use-graph-api
- LangGraph frontend graph execution: https://docs.langchain.com/oss/javascript/langgraph/frontend/graph-execution

### 이 단계의 완료 기준

- graph factory를 만들어 test dependency를 주입할 수 있다.
- graph unit, node unit, tool unit test를 구분할 수 있다.
- proxy request/response contract를 테스트할 수 있다.
- stream event shape를 테스트할 수 있다.
- thread reload, interrupt resume, stream disconnect를 E2E 회귀 테스트로 설계할 수 있다.

### 80% 지점 완료 기준

여기까지 완료하면 agent frontend를 production에 올리기 위한 핵심 안전장치가 갖춰진다.

- browser secret 노출 없이 LangGraph proxy를 설계할 수 있다.
- user identity, thread ownership, assistant allowlist, tool scope를 server에서 검증할 수 있다.
- stream/network/model/tool/graph error를 분류해 UI 정책으로 연결할 수 있다.
- retry, timeout, cancellation, recursion limit의 적용 기준을 설명할 수 있다.
- graph, tool, proxy, stream, React component, E2E 테스트 레이어를 설계할 수 있다.

## 24. 관측과 디버깅

이 장의 목표는 production agent가 실패했을 때 "무슨 일이 있었는지"를 빠르게 재현하고 설명할 수 있게 만드는 것이다. LangGraph + React agent에서는 backend trace, frontend event, thread state, user action이 모두 연결되어야 한다.

관측의 기본 단위:

| 단위 | 의미 | 어디에 남기는가 |
|---|---|---|
| `userId` | app 사용자 | app log, LangSmith metadata |
| `threadId` | 대화 상태 container | URL, LangGraph thread, log |
| `runId` | 특정 실행 | stream metadata, log, trace |
| `requestId` | proxy/API 요청 | HTTP header, server log |
| `traceId` | LangSmith trace | LangSmith UI, support payload |
| `messageId` | UI message | frontend state, feedback |

debugging은 이 id들을 연결하는 작업이다. "사용자가 이상한 답을 받았다"는 리포트만 있으면 재현이 어렵다. 최소한 `threadId`, `runId`, `createdAt`, frontend app version이 같이 있어야 한다.

### LangSmith tracing 환경 변수

LangChain/LangGraph run을 LangSmith로 보내려면 server 환경에서 tracing을 켠다.

```bash
LANGSMITH_TRACING=true
LANGSMITH_API_KEY=...
LANGSMITH_PROJECT=agent-production

# workspace가 여러 개인 API key를 쓸 때
LANGSMITH_WORKSPACE_ID=...

# region 또는 self-hosted endpoint를 쓸 때
LANGSMITH_ENDPOINT=https://api.smith.langchain.com
```

serverless 환경에서는 trace 전송이 process 종료 전에 끝나야 하므로 callback background 설정을 별도로 검토한다.

```bash
# long-running server에서는 background 전송이 latency에 유리하다.
LANGCHAIN_CALLBACKS_BACKGROUND=true

# serverless에서는 function 종료 전에 flush가 필요할 수 있다.
LANGCHAIN_CALLBACKS_BACKGROUND=false
```

high-volume production에서는 sampling을 둔다.

```bash
LANGSMITH_TRACING_SAMPLING_RATE=0.1
```

sampling rate를 낮춰도 error, interrupt, production canary 같은 중요한 run은 별도 project 또는 조건부 tracing으로 남기는 정책을 둔다.

### trace metadata와 tags

LangSmith trace에는 tags와 metadata를 붙여야 검색이 가능하다. LangChain/LangGraph는 `RunnableConfig`의 `tags`, `metadata`, `runName` 같은 값을 하위 runnable에 전파할 수 있다.

```ts
await graph.invoke(
  {
    messages: [{ role: "user", content: "문서를 분석해줘" }],
  },
  {
    runName: "agent_chat_turn",
    tags: ["agent", "chat", process.env.NODE_ENV ?? "development"],
    metadata: {
      userId,
      threadId,
      appVersion: process.env.NEXT_PUBLIC_APP_VERSION,
      assistantId: "agent",
    },
    configurable: {
      thread_id: threadId,
      userId,
    },
  }
);
```

React에서 바로 graph를 호출하지 않는 production 구조라면 proxy가 metadata를 보강한다. browser가 보낸 metadata는 신뢰하지 않고, server session에서 만든 값을 사용한다.

```ts
function buildTraceMetadata({
  userId,
  threadId,
  requestId,
}: {
  userId: string;
  threadId?: string;
  requestId: string;
}) {
  return {
    userId,
    threadId,
    requestId,
    app: "agent-frontend",
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION ?? "local",
    environment: process.env.NODE_ENV ?? "development",
  };
}
```

metadata에 넣지 않을 값:

- user message 원문
- uploaded file content
- raw tool input/output
- system prompt
- credential, token, API key

### run id와 request id 연결

proxy에서 모든 요청에 request id를 부여한다.

```ts
import { randomUUID } from "crypto";

export function getRequestId(request: Request) {
  return request.headers.get("x-request-id") ?? randomUUID();
}

export function withRequestId(headers: Headers, requestId: string) {
  headers.set("x-request-id", requestId);
  return headers;
}
```

server log에는 JSON line 형태로 남긴다.

```ts
type AgentLogEvent = {
  level: "info" | "warn" | "error";
  event: string;
  requestId: string;
  userId?: string;
  threadId?: string;
  runId?: string;
  durationMs?: number;
  metadata?: Record<string, string | number | boolean | undefined>;
};

function logAgentEvent(event: AgentLogEvent) {
  console.log(JSON.stringify(event));
}
```

JSON log의 장점은 검색과 dashboard 집계가 쉽다는 점이다. production에서는 logger를 직접 `console.log`로 두지 않고, 사용하는 log collector에 맞춘 adapter로 감싼다.

### stream event logging

stream event는 너무 많다. token 단위 event를 전부 production log에 남기면 비용과 노이즈가 커진다.

권장 정책:

| event | log 수준 |
|---|---|
| run started | 항상 |
| node started/finished | sample 또는 debug mode |
| tool started/finished | 항상, raw input 제외 |
| interrupt created/resumed | 항상 |
| token chunk | local debug only |
| custom progress | sample |
| stream error | 항상 |

local debug용 stream logger:

```ts
type StreamDebugEvent = {
  mode: string;
  node?: string;
  event?: string;
  timestamp: number;
  chunkPreview?: string;
};

export function toStreamDebugEvent(
  mode: string,
  chunk: unknown
): StreamDebugEvent {
  const preview =
    typeof chunk === "string"
      ? chunk.slice(0, 120)
      : JSON.stringify(chunk).slice(0, 120);

  return {
    mode,
    timestamp: Date.now(),
    chunkPreview: preview,
  };
}
```

frontend에서는 debug flag가 켜진 경우에만 보여준다.

```tsx
function StreamDebugPanel({
  events,
}: {
  events: StreamDebugEvent[];
}) {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <aside>
      {events.map((event) => (
        <pre key={`${event.timestamp}-${event.mode}`}>
          {JSON.stringify(event, null, 2)}
        </pre>
      ))}
    </aside>
  );
}
```

### frontend error boundary

agent UI는 markdown, code block, artifact, generative UI renderer가 많기 때문에 render error가 발생하기 쉽다. thread 전체가 깨지지 않도록 message/artifact 단위 boundary를 둔다.

```tsx
import { Component, ReactNode } from "react";

type ErrorBoundaryState = {
  error?: Error;
};

export class AgentPanelErrorBoundary extends Component<
  { children: ReactNode; fallbackTitle: string },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {};

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("agent panel render failed", {
      message: error.message,
    });
  }

  render() {
    if (this.state.error) {
      return (
        <div role="alert">
          <strong>{this.props.fallbackTitle}</strong>
          <p>이 영역을 렌더링하는 중 문제가 발생했습니다.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

사용 위치:

```tsx
<AgentPanelErrorBoundary fallbackTitle="Artifact 표시 오류">
  <ArtifactRenderer artifact={artifact} />
</AgentPanelErrorBoundary>
```

message list 전체보다 message item, artifact panel, citation panel처럼 작은 단위에 두는 것이 좋다.

### performance mark

frontend에서 사용자가 체감하는 주요 지표를 직접 측정한다.

```ts
export function markAgentEvent(name: string) {
  if (typeof performance === "undefined") return;
  performance.mark(name);
}

export function measureAgentDuration(
  name: string,
  startMark: string,
  endMark: string
) {
  if (typeof performance === "undefined") return;

  try {
    performance.measure(name, startMark, endMark);
  } catch {
    // mark가 없는 경우는 측정하지 않는다.
  }
}
```

submit flow 예시:

```tsx
async function submitMessage(content: string) {
  markAgentEvent("agent_submit_start");

  await stream.submit({
    messages: [{ type: "human", content }],
  });

  markAgentEvent("agent_submit_done");
  measureAgentDuration(
    "agent_submit_duration",
    "agent_submit_start",
    "agent_submit_done"
  );
}
```

측정할 frontend 지표:

- time to submit accepted
- time to first assistant token
- time to final response
- message list render duration
- markdown/code block render duration
- artifact render duration
- attachment upload duration

### tool latency 측정

tool node는 latency가 production 병목이 되기 쉽다.

```ts
async function measureTool<T>(
  toolName: string,
  run: () => Promise<T>
): Promise<T> {
  const startedAt = Date.now();

  try {
    return await run();
  } finally {
    logAgentEvent({
      level: "info",
      event: "tool_latency",
      requestId: "from-request-context",
      durationMs: Date.now() - startedAt,
      metadata: {
        toolName,
      },
    });
  }
}
```

tool log에는 input raw object를 남기지 않는다. 필요한 경우 sanitized summary만 남긴다.

### production issue debug payload

사용자 리포트를 받기 쉽게 debug payload를 만들 수 있다.

```ts
type AgentDebugPayload = {
  appVersion: string;
  environment: string;
  userIdHash: string;
  threadId?: string;
  runId?: string;
  requestId?: string;
  lastMessageId?: string;
  streamStatus: "idle" | "loading" | "error" | "interrupted";
  errorCode?: string;
  createdAt: string;
};
```

UI에서 복사 가능한 support payload를 제공할 때도 raw message content는 제외한다.

```tsx
function DebugPayloadButton({ payload }: { payload: AgentDebugPayload }) {
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      }}
    >
      진단 정보 복사
    </button>
  );
}
```

### LangSmith Studio 활용

LangSmith Studio는 local Agent Server 또는 deployed Agent Server에 연결해 graph 실행을 시각적으로 확인하는 도구다. graph mode에서는 node traversal, intermediate state, thread, trace를 볼 수 있고, chat mode는 `MessagesState` 기반 chat agent를 빠르게 테스트하는 데 유용하다.

Studio로 확인할 것:

- graph topology가 의도한 node/edge로 구성되어 있는가
- 특정 입력에서 어떤 node sequence가 실행되는가
- tool call argument와 result가 schema에 맞는가
- interrupt payload와 resume payload가 맞는가
- checkpoint state가 resume 후 예상대로 복원되는가
- prompt 변경이 model behavior에 어떤 영향을 주는가

### 참고 문서

- LangSmith tracing with LangChain JS/TS: https://docs.langchain.com/langsmith/trace-with-langchain
- LangSmith observability concepts: https://docs.langchain.com/langsmith/observability-concepts
- LangSmith metadata and tags: https://docs.langchain.com/langsmith/add-metadata-tags
- LangSmith Studio: https://docs.langchain.com/langsmith/studio

### 이 단계의 완료 기준

- `userId`, `threadId`, `runId`, `requestId`, `traceId`를 연결해 debugging할 수 있다.
- LangSmith tracing env와 sampling 정책을 설명할 수 있다.
- trace metadata/tags를 안전하게 넣을 수 있다.
- frontend error boundary와 debug payload를 만들 수 있다.
- stream event, tool latency, frontend performance를 구분해 로깅할 수 있다.

## 25. 성능 최적화

이 장의 목표는 agent frontend가 길고 복잡한 대화에서도 느려지지 않게 만드는 것이다. LLM latency 자체를 줄이는 것도 중요하지만, frontend에서는 token streaming, markdown rendering, message list, artifact, attachment가 병목이 된다.

성능 최적화는 측정 후 적용한다. 처음부터 모든 최적화를 넣으면 코드가 복잡해지고, 실제 병목과 다른 곳을 최적화하기 쉽다.

### 성능 병목 분류

| 병목 | 증상 | 대응 |
|---|---|---|
| time to first token | submit 후 오래 비어 있음 | model/tool latency 측정, prompt/tool 개선 |
| token render frequency | streaming 중 typing이 버벅임 | token batching, render throttle |
| long message list | thread 이동/스크롤 느림 | virtualization |
| markdown/code render | 긴 답변에서 UI lock | memoization, lazy render |
| artifact render | chart/table가 무거움 | lazy loading, pagination |
| attachment upload | 파일 전송 중 멈춘 느낌 | upload progress, background upload |
| state fan-out | token마다 전체 app re-render | component 분리, memoization |
| network reconnect | stream 재연결 지연 | thread state hydrate, join policy |

### token streaming render batching

token chunk가 올 때마다 전체 message list를 다시 렌더링하면 UI가 느려진다. 화면에는 일정 주기로만 반영한다.

```tsx
import { useEffect, useRef, useState } from "react";

export function useBatchedText(value: string, intervalMs = 32) {
  const latestRef = useRef(value);
  const [batched, setBatched] = useState(value);

  useEffect(() => {
    latestRef.current = value;
  }, [value]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setBatched((current) => {
        const next = latestRef.current;
        return current === next ? current : next;
      });
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [intervalMs]);

  return batched;
}
```

assistant message component에서만 적용한다.

```tsx
function StreamingAssistantText({ content }: { content: string }) {
  const text = useBatchedText(content);
  return <MarkdownMessage content={text} />;
}
```

목표는 "토큰마다 렌더링"이 아니라 "사용자가 자연스럽게 streaming으로 인식할 정도의 빈도"다. 보통 30~60ms 단위면 충분하다.

### message list virtualization

thread가 길어지면 모든 message DOM을 유지하지 않는다. `@tanstack/react-virtual` 같은 library를 사용해 보이는 영역만 렌더링한다.

```bash
npm install @tanstack/react-virtual
```

```tsx
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

function VirtualMessageList({ messages }: { messages: AgentMessageView[] }) {
  const parentRef = useRef<HTMLDivElement | null>(null);

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: 8,
  });

  return (
    <div ref={parentRef} style={{ height: "100%", overflow: "auto" }}>
      <div
        style={{
          height: virtualizer.getTotalSize(),
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((item) => (
          <div
            key={item.key}
            data-index={item.index}
            ref={virtualizer.measureElement}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${item.start}px)`,
            }}
          >
            <MessageItem message={messages[item.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

virtualization 적용 전 확인할 것:

- scroll-to-bottom이 깨지지 않는가
- streaming 중 마지막 item 높이 변경이 반영되는가
- keyboard navigation과 screen reader 접근성이 유지되는가
- message edit/retry 후 scroll 위치가 예상대로 유지되는가

### markdown/code block lazy rendering

markdown은 text보다 렌더링 비용이 크다. 특히 syntax highlighting은 무겁다.

단순 정책:

- streaming 중에는 plain text 또는 lightweight markdown으로 렌더링한다.
- 최종 완료 후 full markdown renderer를 적용한다.
- code block syntax highlighting은 viewport 진입 후 적용한다.
- 긴 code block은 접기/펼치기를 제공한다.

```tsx
function AgentMarkdown({
  content,
  streaming,
}: {
  content: string;
  streaming: boolean;
}) {
  if (streaming) {
    return <p style={{ whiteSpace: "pre-wrap" }}>{content}</p>;
  }

  return <MarkdownMessage content={content} />;
}
```

code block은 dynamic import로 분리한다.

```tsx
import dynamic from "next/dynamic";

const CodeBlock = dynamic(() => import("./code-block"), {
  ssr: false,
  loading: () => <pre>코드를 불러오는 중...</pre>,
});
```

### artifact lazy loading

large artifact는 message list 안에 직접 렌더링하지 않는다. message에는 summary만 두고, panel이나 route에서 상세를 연다.

```ts
type ArtifactSummary = {
  id: string;
  kind: "table" | "chart" | "report";
  title: string;
  rowCount?: number;
  sizeBytes?: number;
};
```

```tsx
function ArtifactSummaryCard({
  artifact,
  onOpen,
}: {
  artifact: ArtifactSummary;
  onOpen: (artifactId: string) => void;
}) {
  return (
    <button type="button" onClick={() => onOpen(artifact.id)}>
      <strong>{artifact.title}</strong>
      <span>{artifact.kind}</span>
    </button>
  );
}
```

대형 table은 pagination 또는 windowing을 적용한다. chart library는 필요할 때만 dynamic import한다.

### attachment upload progress

파일 업로드는 agent run과 분리한다. 먼저 storage에 업로드하고, 완료된 file reference만 graph input에 넣는다.

```ts
type UploadedAttachment = {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  size: number;
};

type UploadProgress = {
  fileName: string;
  loaded: number;
  total: number;
};
```

XHR 기반 progress 예시:

```ts
export function uploadWithProgress(
  file: File,
  onProgress: (progress: UploadProgress) => void
) {
  return new Promise<UploadedAttachment>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      onProgress({
        fileName: file.name,
        loaded: event.loaded,
        total: event.total,
      });
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText) as UploadedAttachment);
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed"));
    xhr.open("POST", "/api/uploads");
    xhr.send(formData);
  });
}
```

agent submit은 업로드 완료 후 실행한다.

```ts
await stream.submit({
  messages: [
    {
      type: "human",
      content,
      attachments: uploadedAttachments,
    },
  ],
});
```

### state fan-out 줄이기

`stream.messages`가 바뀔 때마다 chat page 전체가 re-render되면 성능이 떨어진다. stream state를 필요한 component에만 전달한다.

안 좋은 패턴:

```tsx
function AgentPage() {
  const stream = useAgentStream();

  return (
    <PageLayout
      sidebar={<ThreadSidebar stream={stream} />}
      main={<MessageList stream={stream} />}
      right={<ArtifactPanel stream={stream} />}
    />
  );
}
```

더 나은 패턴:

```tsx
function AgentPage() {
  const stream = useAgentStream();
  const messages = stream.messages;
  const status = stream.isLoading ? "loading" : "idle";

  return (
    <PageLayout
      sidebar={<ThreadSidebar />}
      main={<MessageList messages={messages} status={status} />}
      right={<ArtifactPanel threadId={stream.threadId} />}
    />
  );
}
```

component는 필요한 primitive props만 받는다. artifact panel이 매 token마다 다시 렌더링될 필요는 없다.

### view model memoization

message 변환 비용이 크면 `useMemo`로 제한한다.

```tsx
function AgentThread({ stream }: { stream: ReturnType<typeof useAgentStream> }) {
  const messageViews = useMemo(
    () => stream.messages.map(toAgentMessageView),
    [stream.messages]
  );

  return <MessageList messages={messageViews} />;
}
```

주의할 점은 `stream.messages`가 token마다 새 reference가 되면 `useMemo`도 token마다 다시 계산된다는 것이다. 큰 비용이 있다면 message id별 cache를 둔다.

```ts
function createMessageViewCache() {
  const cache = new Map<string, AgentMessageView>();

  return function getMessageView(message: AgentRawMessage) {
    const cached = cache.get(message.id);
    if (cached && cached.updatedAt === message.updatedAt) {
      return cached;
    }

    const next = toAgentMessageView(message);
    cache.set(message.id, next);
    return next;
  };
}
```

### 불필요한 stream subscription 줄이기

stream 관련 hook을 여러 component에서 각각 만들면 같은 thread에 여러 연결이 생길 수 있다. thread route의 상단에서 한 번 만들고, 필요한 값만 context 또는 props로 내려보낸다.

```tsx
function AgentThreadRoute({ threadId }: { threadId: string }) {
  const stream = useAgentStream(threadId);

  return (
    <AgentThreadContext.Provider value={stream}>
      <AgentShell />
    </AgentThreadContext.Provider>
  );
}
```

단, context에 stream 전체를 넣으면 모든 consumer가 자주 re-render될 수 있다. message list, composer, status bar처럼 update 빈도가 다른 영역은 분리한다.

### SSE와 WebSocket 선택 기준

LangGraph streaming과 chat token 전송은 SSE로 충분한 경우가 많다.

| 방식 | 장점 | 적합한 경우 |
|---|---|---|
| SSE | 구현 단순, HTTP 친화적, token stream에 적합 | server -> client streaming 중심 |
| WebSocket | 양방향, 낮은 overhead | collaborative editing, 실시간 presence, bidirectional control |

agent chat에서는 대부분 `submit`, `stop`, `resume` 같은 client action이 별도 HTTP request로 충분하다. 실시간 협업 UI나 multi-user monitoring이 필요해질 때 WebSocket을 검토한다.

### 성능 budget

운영 전에 budget을 정한다.

| 지표 | 기준 예시 |
|---|---|
| submit click -> request started | 100ms 이하 |
| submit -> first visible feedback | 200ms 이하 |
| submit -> first token | use case별 별도 측정 |
| token rendering interval | 30~60ms |
| message list scroll frame drop | 눈에 띄지 않을 것 |
| artifact panel open | 300ms 이하 |
| attachment progress update | 100~250ms |

LLM 응답 시간은 모델과 tool에 따라 달라지므로 고정 SLA보다 percentile을 본다. p50, p95, p99를 분리해 dashboard로 본다.

### 이 단계의 완료 기준

- token render batching을 적용해야 하는 이유를 설명할 수 있다.
- 긴 thread에 virtualization을 적용할 수 있다.
- streaming 중 markdown/code block rendering 정책을 세울 수 있다.
- large artifact와 attachment upload를 agent run과 분리할 수 있다.
- stream state fan-out을 줄이고 component re-render 범위를 제한할 수 있다.

## 26. 배포와 운영

이 장의 목표는 local에서 만든 LangGraph + React agent를 staging과 production에 올리고, 운영 중 변경이 기존 thread를 깨지 않게 관리하는 것이다.

LangGraph agent는 일반 stateless API와 다르다. thread checkpoint가 남고, interrupted/busy run이 존재하며, 새 코드가 기존 checkpoint를 이어받아 실행될 수 있다. 따라서 배포는 frontend, proxy, graph runtime, state schema compatibility를 함께 다룬다.

### 환경 구분

| 환경 | 목적 | 특징 |
|---|---|---|
| local | 빠른 개발 | `langgraph dev`, local Next.js |
| local-prod-like | 배포 전 검증 | `langgraph up`, Docker, persistent services |
| staging | production 전 검증 | production과 유사한 env/auth |
| production | 실제 사용자 | tracing, rate limit, rollback |

local 개발:

```bash
npm run dev:web
npm run dev:graph
```

production-like local 검증:

```bash
npx @langchain/langgraph-cli up --config langgraph.json
```

공식 문서 기준으로 `langgraph dev`는 빠른 iteration에 적합하고, `langgraph up`은 Docker 기반 production-like validation에 적합하다.

### 배포 옵션

LangGraph deployment는 크게 세 가지로 나눈다.

| 방식 | 설명 | 선택 기준 |
|---|---|---|
| LangSmith Cloud | LangSmith가 infra/scaling 운영 | 빠른 production, managed runtime |
| Standalone server | 직접 Docker/Compose/Kubernetes 운영 | 가벼운 self-managed 운영 |
| Self-hosted/Hybrid | LangSmith platform까지 private infra에 운영 | enterprise, compliance, private network |

frontend는 Vercel, Netlify, Cloudflare, 자체 Kubernetes 등 별도 platform에 배포할 수 있다. 중요한 것은 frontend가 LangGraph endpoint를 직접 호출할지, proxy를 거칠지 결정하는 것이다. production에서는 보통 proxy를 둔다.

### application structure

배포 가능한 LangGraph app은 `langgraph.json`, graph export, dependency manifest가 맞아야 한다.

```json
{
  "node_version": "20",
  "dependencies": ["."],
  "graphs": {
    "agent": "./src/agent/graph.ts:graph"
  },
  "env": ".env"
}
```

배포 전 checklist:

- `graphs.agent` path가 실제 export와 일치한다.
- `dependencies`에 graph code가 포함된다.
- production `.env`는 repository에 commit하지 않는다.
- `LANGSMITH_TRACING`, model provider key, auth secret이 배포 환경에 설정되어 있다.
- local `langgraph dev`와 `langgraph up`에서 둘 다 실행된다.

### frontend 환경 변수

Next.js frontend는 public env와 server env를 분리한다.

```bash
# public
NEXT_PUBLIC_LANGGRAPH_API_URL=/api/langgraph
NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID=agent
NEXT_PUBLIC_APP_VERSION=2026.06.02-1

# server only
LANGGRAPH_API_URL=https://your-agent-server.example.com
LANGGRAPH_API_KEY=...
LANGGRAPH_ALLOWED_ASSISTANTS=agent
LANGSMITH_API_KEY=...
AUTH_SECRET=...
```

runtime env validation을 추가한다.

```ts
import * as z from "zod";

const ServerEnvSchema = z.object({
  LANGGRAPH_API_URL: z.string().url(),
  LANGGRAPH_API_KEY: z.string().optional(),
  LANGGRAPH_ALLOWED_ASSISTANTS: z.string().default("agent"),
  AUTH_SECRET: z.string().min(1),
});

export const serverEnv = ServerEnvSchema.parse(process.env);
```

public env도 명시적으로 검증한다.

```ts
const PublicEnvSchema = z.object({
  NEXT_PUBLIC_LANGGRAPH_API_URL: z.string().min(1),
  NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID: z.string().min(1),
  NEXT_PUBLIC_APP_VERSION: z.string().min(1),
});

export const publicEnv = PublicEnvSchema.parse({
  NEXT_PUBLIC_LANGGRAPH_API_URL:
    process.env.NEXT_PUBLIC_LANGGRAPH_API_URL,
  NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID:
    process.env.NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID,
  NEXT_PUBLIC_APP_VERSION:
    process.env.NEXT_PUBLIC_APP_VERSION,
});
```

### proxy 배포 확인

proxy는 local에서는 잘 동작하다가 production reverse proxy에서 SSE buffering 때문에 깨질 수 있다. 배포 후 다음을 확인한다.

- `text/event-stream` content type이 보존된다.
- response body가 buffering 없이 chunk로 전달된다.
- idle timeout이 agent run보다 짧지 않다.
- `x-api-key` 또는 upstream credential이 browser response에 노출되지 않는다.
- auth cookie/session이 route handler에서 정상적으로 읽힌다.
- CORS 정책이 직접 호출/proxy 호출 구조와 일치한다.

SSE smoke test:

```ts
async function smokeStream() {
  const response = await fetch("/api/langgraph/threads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      metadata: { source: "smoke" },
    }),
  });

  if (!response.ok) {
    throw new Error(`Thread create failed: ${response.status}`);
  }
}
```

실제 stream smoke는 SDK client 또는 Playwright로 user submit까지 검증한다. 단순 endpoint check만으로는 SSE buffering 문제를 잡지 못할 수 있다.

### health check와 synthetic run

health check는 두 단계로 둔다.

| check | 목적 | 주기 |
|---|---|---|
| lightweight health | app/proxy/server alive | 짧게 |
| synthetic agent run | graph, model, stream, checkpoint 확인 | 길게 |

synthetic run은 실제 사용자 thread와 분리된 test user로 실행한다.

```ts
import { Client } from "@langchain/langgraph-sdk";

export async function runSyntheticAgentCheck() {
  const client = new Client({
    apiUrl: process.env.LANGGRAPH_API_URL!,
    apiKey: process.env.LANGGRAPH_API_KEY,
  });

  const thread = await client.threads.create({
    metadata: {
      owner: "synthetic",
      purpose: "health-check",
    },
  });

  const stream = client.runs.stream(thread.thread_id, "agent", {
    input: {
      messages: [{ role: "user", content: "health check" }],
    },
    metadata: {
      owner: "synthetic",
      purpose: "health-check",
    },
  });

  for await (const chunk of stream) {
    if (chunk.event === "error") {
      throw new Error("Synthetic run failed");
    }
  }
}
```

SDK method signature는 사용하는 `@langchain/langgraph-sdk` version에 맞춰 확인한다. smoke test에서 중요한 것은 thread creation, run streaming, final state를 한 번에 검증하는 것이다.

### release versioning

agent release는 frontend version과 graph version을 같이 남긴다.

```ts
type AgentReleaseInfo = {
  appVersion: string;
  graphVersion: string;
  assistantId: string;
  releasedAt: string;
};
```

thread 시작 시 version metadata를 저장한다.

```ts
await langGraphClient.threads.create({
  metadata: {
    owner: userId,
    assistantId: "agent",
    graphVersion: process.env.AGENT_GRAPH_VERSION,
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION,
  },
});
```

이 정보는 production issue를 재현할 때 중요하다. 같은 user message라도 graph version, prompt version, model config가 다르면 결과가 달라진다.

### backward compatibility

LangGraph는 기존 checkpoint state를 최신 graph code로 이어 실행할 수 있다. 따라서 배포 변경은 기존 thread/checkpoint와의 compatibility를 고려해야 한다.

위험한 변경:

- node 이름 변경 또는 삭제
- state key 이름 변경 또는 삭제
- state field를 optional에서 required로 강화
- interrupt/resume payload schema 변경
- tool name/schema 변경
- checkpoint에 저장된 artifact shape 변경

안전한 변경 패턴:

- 새 state field는 optional/nullish로 추가한다.
- rename은 add -> dual write -> migrate/read fallback -> remove 순서로 한다.
- node rename 대신 새 node를 추가하고 old node는 drain 기간 동안 유지한다.
- behavior change가 크면 `flowVersion`을 state에 저장하고 conditional edge에서 분기한다.
- staging에서 기존 thread를 몇 개 골라 `getState`/history로 확인한다.

flow version 예시:

```ts
type AgentRuntimeState = {
  flowVersion?: 1 | 2;
};

function routeAfterTriage(state: AgentRuntimeState) {
  if ((state.flowVersion ?? 1) === 1) {
    return "respond";
  }

  return "policy_check";
}
```

기존 interrupted thread가 어느 node에서 멈춰 있는지 모른다면 old node를 바로 제거하지 않는다.

### rollback 전략

rollback은 단순히 이전 frontend bundle로 되돌리는 문제가 아니다. graph state schema와 checkpoint compatibility를 같이 본다.

rollback checklist:

- 이전 graph code가 새 checkpoint state를 읽을 수 있는가
- 새 state field가 old code에서 무시 가능한가
- tool side effect가 이미 실행되었는가
- assistant id를 versioned로 분리했는가
- frontend가 old/new artifact shape를 모두 렌더링할 수 있는가
- interrupted thread가 old resume payload를 기대하는가

rollback이 어려운 변경은 canary rollout 또는 versioned assistant로 배포한다.

```text
assistant: agent-v1  -> stable users
assistant: agent-v2  -> canary users
```

canary에서 trace/error/feedback을 확인한 뒤 v2를 default로 승격한다.

### deployment pipeline

기본 pipeline:

```text
pull request
  -> typecheck
  -> graph unit test
  -> proxy contract test
  -> React component test
  -> Playwright deterministic E2E
  -> langgraph up validation
  -> staging deploy
  -> synthetic run
  -> production deploy
  -> production synthetic run
```

GitHub Actions 예시 골격:

```yaml
name: agent-ci

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run typecheck
      - run: npm test
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

LangGraph deployment job은 사용하는 배포 방식에 맞춰 분리한다. Cloud를 쓰면 LangSmith UI/GitHub 연동 또는 `langgraph deploy` 흐름을 사용하고, standalone이면 Docker build/push/deploy를 사용한다.

### 운영 dashboard

production dashboard에서 볼 지표:

- request count
- active runs
- busy/interrupted/error thread count
- model latency p50/p95/p99
- tool latency p50/p95/p99
- stream disconnect count
- run cancel count
- retry count
- token usage/cost
- user feedback negative rate
- interrupt approval/rejection rate
- attachment upload failure rate

LangSmith trace와 app log dashboard를 같이 본다. LangSmith는 agent 실행 내부를 보고, app log는 인증/proxy/frontend lifecycle을 본다.

### 운영 runbook

반복 장애는 runbook으로 정리한다.

```text
증상: stream이 production에서만 늦게 한 번에 도착한다.
확인:
  - proxy response header content-type
  - reverse proxy buffering
  - platform idle timeout
  - browser network waterfall
조치:
  - buffering 비활성화
  - node runtime 사용
  - synthetic stream test 추가
```

runbook으로 남길 주제:

- provider rate limit
- model authentication failure
- tool external API outage
- SSE buffering
- thread ownership mismatch
- interrupt resume failure
- graph recursion limit
- schema/backward compatibility failure

### 참고 문서

- LangGraph local development and `langgraph up`: https://docs.langchain.com/langgraph-platform/local-server
- LangGraph application structure: https://docs.langchain.com/langgraph-platform/application-structure
- LangSmith Deployment overview: https://docs.langchain.com/langsmith/deployments
- LangGraph JavaScript deploy guide: https://docs.langchain.com/oss/javascript/langgraph/deploy
- LangGraph backward compatibility: https://docs.langchain.com/oss/javascript/langgraph/backward-compatibility

### 이 단계의 완료 기준

- local, staging, production 환경 차이를 설명할 수 있다.
- `langgraph dev`와 `langgraph up`의 용도를 구분할 수 있다.
- LangSmith Cloud, standalone server, self-hosted/hybrid 선택 기준을 설명할 수 있다.
- frontend/proxy/graph runtime env를 분리하고 검증할 수 있다.
- release versioning, backward compatibility, rollback 전략을 설계할 수 있다.

### 90% 지점 완료 기준

여기까지 완료하면 agent frontend를 production 수준으로 운영하기 위한 관측, 성능, 배포 기준이 갖춰진다.

- LangSmith trace와 app log를 `threadId`, `runId`, `requestId`로 연결할 수 있다.
- stream event, tool latency, frontend rendering performance를 측정할 수 있다.
- 긴 thread, token streaming, markdown, artifact, attachment에서 발생하는 frontend 병목을 최적화할 수 있다.
- `langgraph dev`, `langgraph up`, staging, production deploy 흐름을 설계할 수 있다.
- 기존 checkpoint를 깨지 않는 graph/state/schema 변경 전략을 세울 수 있다.

## 27. Code Snippets 모음

이 장의 목표는 앞에서 학습한 내용을 실제 구현할 때 바로 참고할 수 있는 snippet 형태로 정리하는 것이다. 각 snippet은 구현의 출발점으로 사용할 수 있지만, production 코드에서는 프로젝트의 auth, DB, design system, model provider, deployment 방식에 맞춰 adapter를 둔다.

### snippets 사용 원칙

- snippet은 "완성 앱"이 아니라 반복 구현의 시작점이다.
- API key, user id, owner metadata는 browser가 아니라 server에서 주입한다.
- `threadId`는 URL, app DB, LangGraph thread를 연결하는 핵심 id로 유지한다.
- SDK raw object는 UI component에서 직접 렌더링하지 않고 view model로 변환한다.
- interrupt, artifact, tool result, citation은 schema guard를 둔다.
- LangGraph SDK와 React SDK는 버전별 API 차이가 있을 수 있으므로 project adapter를 만든다.

### project scaffold

초기 패키지 설치:

```bash
npm install @langchain/langgraph @langchain/core @langchain/langgraph-sdk
npm install @langchain/react
npm install @langchain/openai
```

assistant-ui를 사용할 때:

```bash
npm install @assistant-ui/react @assistant-ui/react-langgraph
```

테스트와 UI 품질 도구:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test
```

기본 폴더:

```text
src/
  agent/
    graph.ts
    state.ts
    tools.ts
    client.ts
  app/
    agents/
      new/
        page.tsx
      [threadId]/
        page.tsx
        thread.tsx
    api/
      langgraph/
        [...path]/
          route.ts
      threads/
        route.ts
  components/
    chat/
      composer.tsx
      message-list.tsx
      message-item.tsx
      tool-call-card.tsx
      interrupt-panel.tsx
  lib/
    env.ts
    agent-errors.ts
    agent-view-model.ts
```

LangGraph server config:

```json
{
  "node_version": "20",
  "dependencies": ["."],
  "graphs": {
    "agent": "./src/agent/graph.ts:graph"
  },
  "env": ".env"
}
```

package script:

```json
{
  "scripts": {
    "dev:web": "next dev",
    "dev:graph": "npx @langchain/langgraph-cli dev --config langgraph.json --port 2024",
    "graph:up": "npx @langchain/langgraph-cli up --config langgraph.json",
    "test": "vitest run",
    "test:e2e": "playwright test"
  }
}
```

### env validation

```ts
// src/lib/env.ts
import * as z from "zod";

const ServerEnvSchema = z.object({
  LANGGRAPH_API_URL: z.string().min(1),
  LANGGRAPH_API_KEY: z.string().optional(),
  LANGGRAPH_ALLOWED_ASSISTANTS: z.string().default("agent"),
  CHAT_MODEL: z.string().default("gpt-4.1-mini"),
  AUTH_SECRET: z.string().optional(),
});

const PublicEnvSchema = z.object({
  NEXT_PUBLIC_LANGGRAPH_API_URL: z.string().min(1),
  NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID: z.string().min(1),
  NEXT_PUBLIC_APP_VERSION: z.string().default("local"),
});

export const serverEnv = ServerEnvSchema.parse(process.env);

export const publicEnv = PublicEnvSchema.parse({
  NEXT_PUBLIC_LANGGRAPH_API_URL:
    process.env.NEXT_PUBLIC_LANGGRAPH_API_URL,
  NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID:
    process.env.NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID,
  NEXT_PUBLIC_APP_VERSION:
    process.env.NEXT_PUBLIC_APP_VERSION,
});
```

local `.env` 예시:

```bash
NEXT_PUBLIC_LANGGRAPH_API_URL=http://localhost:2024
NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID=agent
NEXT_PUBLIC_APP_VERSION=local

LANGGRAPH_API_URL=http://localhost:2024
LANGGRAPH_API_KEY=
LANGGRAPH_ALLOWED_ASSISTANTS=agent
CHAT_MODEL=gpt-4.1-mini

LANGSMITH_TRACING=true
LANGSMITH_PROJECT=agent-local
LANGSMITH_API_KEY=
```

production `.env` 예시:

```bash
NEXT_PUBLIC_LANGGRAPH_API_URL=/api/langgraph
NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID=agent
NEXT_PUBLIC_APP_VERSION=2026.06.02-1

LANGGRAPH_API_URL=https://your-agent-server.example.com
LANGGRAPH_API_KEY=...
LANGGRAPH_ALLOWED_ASSISTANTS=agent
CHAT_MODEL=gpt-4.1-mini

LANGSMITH_TRACING=true
LANGSMITH_PROJECT=agent-production
LANGSMITH_API_KEY=...
```

### LangGraph state template

```ts
// src/agent/state.ts
import { MessagesValue, StateSchema } from "@langchain/langgraph";

export const AgentState = new StateSchema({
  messages: MessagesValue,
});

export type AgentStateValue = typeof AgentState.State;
```

처음에는 `messages`만 둔다. artifact, citation, progress, user profile 같은 값은 필요해지는 시점에 추가한다. 새 state field는 기존 checkpoint와의 호환성을 위해 optional/nullish로 설계한다.

### LLM chat graph template

```ts
// src/agent/graph.ts
import { ChatOpenAI } from "@langchain/openai";
import { END, GraphNode, START, StateGraph } from "@langchain/langgraph";
import { AgentState } from "./state";

const model = new ChatOpenAI({
  model: process.env.CHAT_MODEL ?? "gpt-4.1-mini",
  temperature: 0.2,
});

const callModel: GraphNode<typeof AgentState> = async (state) => {
  const response = await model.invoke([
    {
      role: "system",
      content: "사용자의 요청에 간결하고 정확하게 답변한다.",
    },
    ...state.messages,
  ]);

  return {
    messages: [response],
  };
};

export const graph = new StateGraph(AgentState)
  .addNode("agent", callModel)
  .addEdge(START, "agent")
  .addEdge("agent", END)
  .compile();
```

검증 스크립트:

```ts
// scripts/invoke-agent.ts
import { graph } from "../src/agent/graph";

const result = await graph.invoke({
  messages: [{ role: "user", content: "hello" }],
});

console.log(result.messages.at(-1));
```

### tool calling graph template

```ts
// src/agent/tools.ts
import { tool } from "@langchain/core/tools";
import * as z from "zod";

export const searchDocs = tool(
  async ({ query }) => {
    return `검색 결과 요약: ${query}`;
  },
  {
    name: "search_docs",
    description: "프로젝트 문서에서 질문과 관련된 내용을 검색한다.",
    schema: z.object({
      query: z.string().describe("검색할 질문 또는 키워드"),
    }),
  }
);

export const tools = [searchDocs];
```

```ts
// src/agent/graph.ts
import { ChatOpenAI } from "@langchain/openai";
import { START, StateGraph } from "@langchain/langgraph";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import { AgentState } from "./state";
import { tools } from "./tools";

const model = new ChatOpenAI({
  model: process.env.CHAT_MODEL ?? "gpt-4.1-mini",
  temperature: 0,
}).bindTools(tools);

async function callModel(state: typeof AgentState.State) {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

export const graph = new StateGraph(AgentState)
  .addNode("agent", callModel)
  .addNode("tools", new ToolNode(tools))
  .addEdge(START, "agent")
  .addConditionalEdges("agent", toolsCondition)
  .addEdge("tools", "agent")
  .compile();
```

tool calling graph에서는 `agent -> tools -> agent` loop가 끝나는 조건을 반드시 확인한다. tool call이 계속 생성되는 경우 recursion limit 또는 tool schema/prompt를 점검한다.

### LangGraph client setup

server-only client:

```ts
// src/agent/client.ts
import { Client } from "@langchain/langgraph-sdk";
import { serverEnv } from "@/lib/env";

export const langGraphClient = new Client({
  apiUrl: serverEnv.LANGGRAPH_API_URL,
  apiKey: serverEnv.LANGGRAPH_API_KEY,
});
```

browser에서 secret 없이 proxy를 호출할 때:

```ts
import { Client } from "@langchain/langgraph-sdk";
import { publicEnv } from "@/lib/env";

export const browserLangGraphClient = new Client({
  apiUrl: publicEnv.NEXT_PUBLIC_LANGGRAPH_API_URL,
});
```

운영에서는 browser client에 API key를 넣지 않는다.

### thread create/list/select snippets

thread 생성 route:

```ts
// src/app/api/threads/route.ts
import { NextResponse } from "next/server";
import { langGraphClient } from "@/agent/client";

declare function getCurrentUserId(): Promise<string>;

export async function POST() {
  const userId = await getCurrentUserId();

  const thread = await langGraphClient.threads.create({
    metadata: {
      owner: userId,
      assistantId: "agent",
    },
  });

  return NextResponse.json({
    threadId: thread.thread_id,
  });
}
```

새 thread 버튼:

```tsx
"use client";

import { useRouter } from "next/navigation";

export function NewThreadButton() {
  const router = useRouter();

  async function createThread() {
    const response = await fetch("/api/threads", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Thread creation failed");
    }

    const body = (await response.json()) as { threadId: string };
    router.push(`/agents/${body.threadId}`);
  }

  return (
    <button type="button" onClick={() => void createThread()}>
      새 대화
    </button>
  );
}
```

thread list service:

```ts
export async function listUserThreads(userId: string) {
  return langGraphClient.threads.search({
    metadata: {
      owner: userId,
    },
    limit: 50,
  });
}
```

thread 선택은 route 이동으로 처리한다.

```tsx
import Link from "next/link";

type ThreadItem = {
  thread_id: string;
  metadata?: Record<string, unknown>;
};

export function ThreadList({ threads }: { threads: ThreadItem[] }) {
  return (
    <nav>
      {threads.map((thread) => (
        <Link key={thread.thread_id} href={`/agents/${thread.thread_id}`}>
          {String(thread.metadata?.title ?? "새 대화")}
        </Link>
      ))}
    </nav>
  );
}
```

### React useStream hook wrapper

```tsx
// src/app/agents/[threadId]/use-agent-stream.ts
"use client";

import { useStream } from "@langchain/react";
import { publicEnv } from "@/lib/env";

export function useAgentStream(threadId?: string) {
  return useStream({
    apiUrl: publicEnv.NEXT_PUBLIC_LANGGRAPH_API_URL,
    assistantId: publicEnv.NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID,
    threadId,
    throttle: 32,
    onError(error) {
      console.error("agent stream error", error);
    },
    onThreadId(nextThreadId) {
      console.debug("agent thread id", nextThreadId);
    },
  });
}
```

`throttle`은 token streaming render 빈도를 낮추는 데 사용한다. SDK 버전별 option 차이가 있을 수 있으므로 이 wrapper를 프로젝트의 유일한 `useStream` 진입점으로 둔다.

### basic chat route

```tsx
// src/app/agents/[threadId]/page.tsx
import { AgentThread } from "./thread";

export default async function Page({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  return <AgentThread threadId={threadId} />;
}
```

```tsx
// src/app/agents/[threadId]/thread.tsx
"use client";

import { useState } from "react";
import { useAgentStream } from "./use-agent-stream";

export function AgentThread({ threadId }: { threadId: string }) {
  const stream = useAgentStream(threadId);
  const [input, setInput] = useState("");

  async function submit() {
    const content = input.trim();
    if (!content || stream.isLoading) return;

    setInput("");

    await stream.submit({
      messages: [{ type: "human", content }],
    });
  }

  return (
    <main>
      <MessageList messages={stream.messages} />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button type="submit" disabled={stream.isLoading}>
          전송
        </button>
        <button
          type="button"
          disabled={!stream.isLoading}
          onClick={() => void stream.stop()}
        >
          중지
        </button>
      </form>
    </main>
  );
}
```

message list는 raw message shape를 프로젝트 view model로 변환해 렌더링한다.

```tsx
function MessageList({ messages }: { messages: unknown[] }) {
  return (
    <div>
      {messages.map((message, index) => (
        <pre key={index}>{JSON.stringify(message, null, 2)}</pre>
      ))}
    </div>
  );
}
```

초기 debug 단계에서는 `pre`로 확인하고, 실제 UI에서는 `toAgentMessageView` adapter로 교체한다.

### assistant-ui runtime wrapper

```tsx
// src/app/agents/[threadId]/agent-assistant.tsx
"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useLangGraphRuntime } from "@assistant-ui/react-langgraph";
import { Thread } from "@/components/assistant-ui/thread";
import { publicEnv } from "@/lib/env";

export function AgentAssistant({ threadId }: { threadId: string }) {
  const runtime = useLangGraphRuntime({
    apiUrl: publicEnv.NEXT_PUBLIC_LANGGRAPH_API_URL,
    assistantId: publicEnv.NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID,
    threadId,
    streamMode: ["messages", "updates", "values"],
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <Thread />
    </AssistantRuntimeProvider>
  );
}
```

assistant-ui를 쓰면 message UI, composer, cancellation, interrupt persistence, message editing 같은 기능을 runtime 중심으로 확장한다. custom UI로 먼저 stream 구조를 이해한 뒤 적용하는 편이 안전하다.

### thread join snippets

thread state 조회:

```ts
export async function getThreadState(threadId: string) {
  return langGraphClient.threads.getState(threadId);
}
```

route 진입 시 thread state를 hydrate하는 server component:

```tsx
// src/app/agents/[threadId]/page.tsx
import { getThreadState } from "@/agent/thread-service";
import { AgentThread } from "./thread";

export default async function Page({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  const state = await getThreadState(threadId);

  return (
    <AgentThread
      threadId={threadId}
      initialMessages={state.values?.messages ?? []}
    />
  );
}
```

client에서 thread를 바꿀 때:

```tsx
import { useEffect } from "react";

export function useSwitchAgentThread(
  stream: ReturnType<typeof useAgentStream>,
  threadId: string
) {
  useEffect(() => {
    stream.switchThread(threadId);
  }, [stream, threadId]);
}
```

running thread reattach 정책은 SDK 버전과 runtime에 따라 달라질 수 있다. 중요한 것은 새 run을 무조건 만들지 않고, 기존 thread state와 active run 상태를 먼저 확인하는 것이다.

### interrupt resume snippets

interrupt schema:

```ts
export type ApprovalInterrupt = {
  type: "approval";
  title: string;
  description?: string;
  action?: {
    name: string;
    summary?: string;
  };
};

export function isApprovalInterrupt(
  value: unknown
): value is ApprovalInterrupt {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type === "approval" &&
    "title" in value &&
    typeof value.title === "string"
  );
}
```

resume adapter:

```ts
export function resumeInterrupt(
  stream: ReturnType<typeof useAgentStream>,
  value: unknown
) {
  return stream.submit(undefined, {
    command: {
      resume: value,
    },
  });
}
```

interrupt UI:

```tsx
function InterruptPanel({ stream }: { stream: ReturnType<typeof useAgentStream> }) {
  const interrupt = stream.interrupt;

  if (!interrupt) return null;

  if (!isApprovalInterrupt(interrupt.value)) {
    return <p>사용자 입력이 필요합니다.</p>;
  }

  return (
    <section>
      <h3>{interrupt.value.title}</h3>
      {interrupt.value.description ? (
        <p>{interrupt.value.description}</p>
      ) : null}
      <button
        type="button"
        onClick={() => {
          void resumeInterrupt(stream, { approved: true });
        }}
      >
        승인
      </button>
      <button
        type="button"
        onClick={() => {
          void resumeInterrupt(stream, { approved: false });
        }}
      >
        거절
      </button>
    </section>
  );
}
```

interrupt resume에는 같은 `threadId`가 필요하다. 다른 thread에서 resume하면 새 대화 또는 다른 checkpoint로 처리된다.

### Next.js proxy route

가장 작은 pass-through proxy:

```ts
// src/app/api/langgraph/[...path]/route.ts
import type { NextRequest } from "next/server";
import { serverEnv } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = {
  params: { path?: string[] } | Promise<{ path?: string[] }>;
};

async function getPath(context: Context) {
  const params = await context.params;
  return params.path ?? [];
}

async function proxy(request: NextRequest, context: Context) {
  const path = await getPath(context);
  const requestUrl = new URL(request.url);
  const upstreamUrl = new URL(
    `${path.join("/")}${requestUrl.search}`,
    `${serverEnv.LANGGRAPH_API_URL.replace(/\/$/, "")}/`
  );

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");

  if (contentType) headers.set("content-type", contentType);
  if (accept) headers.set("accept", accept);
  if (serverEnv.LANGGRAPH_API_KEY) {
    headers.set("x-api-key", serverEnv.LANGGRAPH_API_KEY);
  }

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : request.body;

  const init: RequestInit & { duplex?: "half" } = {
    method: request.method,
    headers,
  };

  if (body) {
    init.body = body;
    init.duplex = "half";
  }

  const upstream = await fetch(upstreamUrl, init);

  const responseHeaders = new Headers();
  const upstreamContentType = upstream.headers.get("content-type");

  if (upstreamContentType) {
    responseHeaders.set("content-type", upstreamContentType);
  }

  responseHeaders.set("cache-control", "no-store");

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export function GET(request: NextRequest, context: Context) {
  return proxy(request, context);
}

export function POST(request: NextRequest, context: Context) {
  return proxy(request, context);
}

export function PATCH(request: NextRequest, context: Context) {
  return proxy(request, context);
}

export function DELETE(request: NextRequest, context: Context) {
  return proxy(request, context);
}
```

이 예시는 최소형이다. production에서는 21장의 auth, thread ownership, assistant allowlist, rate limit, metadata overwrite를 추가한다.

### stream event logger

```ts
type DebugStreamEvent = {
  mode: string;
  preview: string;
  createdAt: string;
};

export function toDebugStreamEvent(
  mode: string,
  chunk: unknown
): DebugStreamEvent {
  const preview =
    typeof chunk === "string"
      ? chunk.slice(0, 160)
      : JSON.stringify(chunk).slice(0, 160);

  return {
    mode,
    preview,
    createdAt: new Date().toISOString(),
  };
}
```

server-side stream 확인:

```ts
for await (const event of await graph.stream(
  {
    messages: [{ role: "user", content: "hello" }],
  },
  {
    streamMode: ["messages", "updates"],
  }
)) {
  console.log(toDebugStreamEvent("debug", event));
}
```

production에서는 token chunk 전체를 log에 남기지 않는다.

### error view model

```ts
export type AgentErrorView = {
  code: "auth" | "network" | "stream" | "graph" | "tool" | "unknown";
  title: string;
  message: string;
  retryable: boolean;
};

export function toAgentErrorView(error: unknown): AgentErrorView {
  if (error instanceof TypeError) {
    return {
      code: "network",
      title: "연결 오류",
      message: "네트워크 연결을 확인한 뒤 다시 시도하세요.",
      retryable: true,
    };
  }

  return {
    code: "unknown",
    title: "실행 오류",
    message: "요청을 처리하는 중 문제가 발생했습니다.",
    retryable: true,
  };
}
```

UI:

```tsx
function ErrorBanner({ error }: { error: AgentErrorView }) {
  return (
    <div role="alert">
      <strong>{error.title}</strong>
      <p>{error.message}</p>
    </div>
  );
}
```

### artifact renderer catalog

```ts
type ArtifactKind = "table" | "chart" | "report";

type Artifact = {
  id: string;
  kind: ArtifactKind;
  title: string;
  content: unknown;
};
```

```tsx
type ArtifactRenderer = (props: { artifact: Artifact }) => JSX.Element;

const artifactRenderers: Record<ArtifactKind, ArtifactRenderer> = {
  table: TableArtifact,
  chart: ChartArtifact,
  report: ReportArtifact,
};

export function ArtifactRenderer({ artifact }: { artifact: Artifact }) {
  const Renderer = artifactRenderers[artifact.kind];

  if (!Renderer) {
    return <p>지원하지 않는 artifact입니다.</p>;
  }

  return <Renderer artifact={artifact} />;
}
```

renderer catalog 외 component는 실행하지 않는다. AI가 생성한 arbitrary component name을 그대로 React component로 매핑하면 안 된다.

### Playwright thread join test

```ts
// tests/e2e/thread-join.spec.ts
import { expect, test } from "@playwright/test";

test("reload keeps thread messages", async ({ page }) => {
  await page.goto("/agents/new");

  await page.getByRole("button", { name: "새 대화" }).click();
  await page.getByRole("textbox").fill("Thread Join 테스트");
  await page.getByRole("button", { name: "전송" }).click();

  await expect(page.getByText("Thread Join 테스트")).toBeVisible();

  await page.reload();

  await expect(page.getByText("Thread Join 테스트")).toBeVisible();
});
```

실제 CI에서는 deterministic test graph를 사용한다. real model을 호출하는 테스트는 nightly 또는 release smoke로 분리한다.

### snippets 완료 기준

- 최소 LangGraph chat graph를 만들 수 있다.
- tool calling graph를 만들 수 있다.
- server-only LangGraph client와 browser proxy client를 구분할 수 있다.
- React `useStream` wrapper를 만들 수 있다.
- thread 생성, 선택, hydrate, interrupt resume snippet을 조합할 수 있다.
- production proxy에 필요한 보안 보강 지점을 설명할 수 있다.

## 28. Troubleshooting

이 장의 목표는 LangGraph + React agent 구현 중 자주 만나는 문제를 증상, 원인, 확인 방법, 해결책으로 정리하는 것이다. 문제를 해결할 때는 먼저 `threadId`, `runId`, `requestId`, `traceId`를 확보한다.

### 빠른 진단 순서

1. browser network tab에서 요청이 시작됐는지 확인한다.
2. `/api/langgraph` proxy 응답 status와 content type을 확인한다.
3. LangGraph thread state를 조회한다.
4. LangSmith trace에서 node/tool/model error를 확인한다.
5. frontend console에서 render error와 stream error를 확인한다.
6. 같은 입력을 local `graph.invoke` 또는 LangGraph Studio에서 재현한다.

진단용 thread state:

```ts
const state = await langGraphClient.threads.getState(threadId);

console.log({
  values: state.values,
  next: state.next,
  tasks: state.tasks,
  checkpoint: state.checkpoint_id,
});
```

### stream이 안 열리는 경우

증상:

- submit 후 아무 token도 보이지 않는다.
- network tab에 request가 없거나 pending에서 멈춘다.
- console에 CORS, 401, 403, 404, 500이 보인다.

확인:

```bash
curl -i http://localhost:2024
```

```bash
echo $NEXT_PUBLIC_LANGGRAPH_API_URL
echo $NEXT_PUBLIC_LANGGRAPH_ASSISTANT_ID
```

원인:

- LangGraph dev server가 실행되지 않았다.
- `apiUrl`이 잘못됐다.
- `assistantId`가 `langgraph.json`의 graph key와 다르다.
- production proxy가 SSE body를 buffer하거나 끊는다.
- auth cookie/session이 route handler에서 읽히지 않는다.

해결:

- local에서는 `npm run dev:graph`와 `npm run dev:web`을 둘 다 실행한다.
- `langgraph.json`의 graph key와 frontend assistant id를 맞춘다.
- production에서는 `NEXT_PUBLIC_LANGGRAPH_API_URL=/api/langgraph`로 두고 proxy를 통과시킨다.
- proxy response의 `content-type: text/event-stream` 보존 여부를 확인한다.
- reverse proxy buffering과 idle timeout을 점검한다.

### message가 중복으로 보이는 경우

증상:

- user message가 두 번 보인다.
- assistant message가 streaming 중 여러 개로 분리된다.
- 새로고침 후 같은 message가 반복된다.

원인:

- optimistic message와 server checkpoint message를 둘 다 렌더링한다.
- message id 기준 dedup이 없다.
- submit handler가 두 번 실행된다.
- React Strict Mode에서 effect가 중복 실행된다.
- 같은 thread에 새 run을 중복 생성한다.

해결:

```ts
type MessageWithId = {
  id?: string;
  content: unknown;
};

export function dedupeMessages<T extends MessageWithId>(messages: T[]) {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const message of messages) {
    const key = message.id ?? JSON.stringify(message.content);
    if (seen.has(key)) continue;

    seen.add(key);
    result.push(message);
  }

  return result;
}
```

submit guard:

```ts
const pendingRef = useRef(false);

async function submitOnce(content: string) {
  if (pendingRef.current || stream.isLoading) return;
  pendingRef.current = true;

  try {
    await stream.submit({
      messages: [{ type: "human", content }],
    });
  } finally {
    pendingRef.current = false;
  }
}
```

### 새로고침 후 history가 사라지는 경우

증상:

- reload 후 빈 대화가 열린다.
- 이전 message는 LangGraph Studio에는 있는데 UI에는 없다.

원인:

- URL에 `threadId`가 없다.
- 새로고침 때 새 thread를 만든다.
- checkpointer가 없거나 local dev state가 초기화됐다.
- `switchThread(threadId)` 또는 `threadId` option이 빠졌다.
- thread state hydrate를 하지 않는다.

해결:

- thread route를 `/agents/[threadId]`로 고정한다.
- 새 대화 버튼에서만 thread를 생성한다.
- 기존 route 진입에서는 `useStream({ threadId })` 또는 `switchThread(threadId)`를 사용한다.
- server component에서 `getState(threadId)`로 initial state를 확인한다.
- production에서는 durable persistence를 사용하는 Agent Server를 사용한다.

### running thread에 새 run이 중복 생성되는 경우

증상:

- 사용자가 reload 후 전송하면 이전 run과 새 run이 동시에 돈다.
- tool call이 두 번 실행된다.
- 같은 side effect가 중복 발생한다.

원인:

- active run 확인 없이 submit한다.
- `isLoading`이 false로 초기화되는 순간 새 submit을 허용한다.
- thread join/reattach와 new run create를 구분하지 않는다.

해결:

- route 진입 시 thread state와 pending task를 확인한다.
- busy/interrupted 상태면 composer를 제한한다.
- side effect tool에는 idempotency key를 둔다.
- user submit 전에 server에서 run conflict를 검사한다.

UI 정책:

```ts
type ThreadUiStatus = "idle" | "loading" | "busy" | "interrupted" | "error";

function canSubmit(status: ThreadUiStatus) {
  return status === "idle" || status === "error";
}
```

### tool result가 UI에 안 보이는 경우

증상:

- LangSmith trace에는 tool이 실행됐지만 UI에는 표시되지 않는다.
- assistant 답변은 있지만 tool card가 없다.

원인:

- stream mode에 tool/update event가 포함되지 않았다.
- ToolMessage를 message renderer가 무시한다.
- tool call raw shape가 SDK adapter와 맞지 않는다.
- tool result를 artifact state로 분리했지만 artifact renderer가 없다.

해결:

- `messages`, `updates`, `values`, 필요한 경우 `tools`/`custom` stream mode를 확인한다.
- tool call view model adapter를 만든다.
- raw input/output을 그대로 보여주지 말고 summary를 렌더링한다.
- 긴 tool result는 artifact panel로 분리한다.

debug:

```tsx
function ToolDebug({ stream }: { stream: ReturnType<typeof useAgentStream> }) {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <pre>
      {JSON.stringify(
        {
          toolCalls: stream.toolCalls,
          values: stream.values,
        },
        null,
        2
      )}
    </pre>
  );
}
```

### interrupt 후 resume이 안 되는 경우

증상:

- 승인 버튼을 눌러도 graph가 재개되지 않는다.
- resume 후 같은 interrupt가 반복된다.
- `__interrupt__`는 있는데 UI가 인식하지 못한다.

원인:

- resume에 다른 `threadId`를 사용한다.
- `Command({ resume })` shape가 SDK adapter와 맞지 않는다.
- interrupt payload가 JSON-serializable 하지 않다.
- `interrupt()`를 `try/catch`로 감쌌다.
- interrupt 이전에 non-idempotent side effect가 있다.
- 여러 interrupt가 있는데 id별 resume mapping을 하지 않았다.

해결:

- 같은 `threadId`로 resume한다.
- `resumeInterrupt(stream, value)` adapter를 한 곳에 둔다.
- payload/resume schema를 zod 또는 type guard로 검증한다.
- `interrupt()` 호출을 `try/catch`로 감싸지 않는다.
- side effect는 interrupt 이후 별도 node에서 실행한다.

### proxy에서 SSE가 buffer되는 경우

증상:

- local LangGraph server 직접 호출은 streaming이 되지만 `/api/langgraph`에서는 답변이 한 번에 도착한다.
- production에서만 streaming이 느리다.

원인:

- reverse proxy가 response buffering을 한다.
- serverless platform이 stream을 flush하지 않는다.
- route handler가 body를 끝까지 읽은 뒤 반환한다.
- response header가 `text/event-stream`으로 유지되지 않는다.

해결:

- route handler에서 `new Response(upstream.body, ...)`로 pass-through한다.
- `cache-control: no-store`를 둔다.
- node runtime을 사용한다.
- platform/reverse proxy의 buffering 설정을 끈다.
- synthetic stream test를 production 배포 후 실행한다.

확인:

```bash
curl -N -i https://your-app.example.com/api/langgraph/...
```

### CORS 문제

증상:

- browser console에 CORS error가 보인다.
- curl은 되는데 browser에서만 실패한다.

원인:

- browser가 LangGraph API server를 직접 호출한다.
- LangGraph server의 allowed origin이 frontend origin과 다르다.
- credential/cookie가 필요한데 CORS 설정이 맞지 않는다.

해결:

- production에서는 Next.js proxy를 사용한다.
- browser `apiUrl`을 `/api/langgraph`로 둔다.
- 직접 호출이 필요한 local prototype에서는 origin과 credential 정책을 명확히 맞춘다.

### production에서 env가 다르게 잡히는 경우

증상:

- local에서는 되지만 production에서 wrong assistant id, wrong API URL이 사용된다.
- browser bundle에 server secret이 들어간다.

원인:

- `NEXT_PUBLIC_`와 server env를 혼동했다.
- build time env와 runtime env가 다르다.
- staging/prod deployment variable이 누락됐다.

해결:

- `env.ts`에서 public/server schema를 분리한다.
- browser에서 필요한 값만 `NEXT_PUBLIC_`로 둔다.
- production build artifact의 app version과 env를 debug payload에 포함한다.
- secret은 browser bundle에 넣지 않는다.

### graph recursion limit error

증상:

- agent가 tool을 계속 호출하다가 중단된다.
- LangGraph common error에 recursion 관련 code가 보인다.

원인:

- conditional edge가 종료 조건을 갖지 않는다.
- LLM이 tool call 이후에도 같은 tool을 반복 호출한다.
- tool result가 model이 이해할 수 없는 형태다.

해결:

- `toolsCondition` 또는 custom router 종료 조건을 확인한다.
- tool result를 간결한 ToolMessage로 반환한다.
- system prompt에 tool 사용 종료 기준을 명시한다.
- recursion limit을 무작정 늘리지 말고 loop 원인을 먼저 고친다.

### INVALID_TOOL_RESULTS / INVALID_CHAT_HISTORY

증상:

- tool call 이후 graph가 실패한다.
- message history coercion error가 난다.

원인:

- AIMessage tool call과 ToolMessage가 짝을 이루지 않는다.
- message role/type shape가 SDK 기대값과 다르다.
- custom UI에서 message를 변환하면서 tool call id를 잃었다.

해결:

- tool execution은 `ToolNode`로 시작한다.
- message 변환 adapter에서 id, type, tool_call_id를 보존한다.
- custom message를 만들 때 LangChain message shape를 확인한다.
- raw message history를 debug로 출력해 role 순서를 확인한다.

### markdown 또는 artifact render error

증상:

- 특정 답변에서 화면 전체가 깨진다.
- artifact panel을 열면 React error가 난다.

원인:

- AI-generated structured data가 schema와 맞지 않는다.
- unknown artifact kind를 renderer가 처리하지 못한다.
- markdown/HTML sanitize가 없다.
- code block renderer가 browser-only API를 SSR에서 사용한다.

해결:

- artifact schema validation을 추가한다.
- unknown kind는 safe fallback으로 보낸다.
- artifact/message 단위 error boundary를 둔다.
- heavy renderer는 dynamic import한다.

### troubleshooting 완료 기준

- 문제 발생 시 `threadId`, `runId`, `requestId`, `traceId`를 먼저 확보할 수 있다.
- stream, proxy, env, thread state, interrupt, tool result 문제를 분리해 진단할 수 있다.
- duplicate message, lost history, run conflict의 원인을 설명할 수 있다.
- SSE buffering과 CORS 문제를 구분할 수 있다.
- LangGraph common error를 message history/tool result/recursion 관점에서 분석할 수 있다.

## 29. 구현 로드맵과 참고 문서

이 장의 목표는 이 문서를 실제 학습/구현 순서로 실행할 수 있게 만드는 것이다. 로드맵은 "작게 만들고, 확인하고, 다음 기능을 붙인다"는 방식으로 진행한다.

### 전체 로드맵

| Milestone | 목표 | 산출물 | 완료 기준 |
|---|---|---|---|
| 1 | hello graph | LLM 없는 echo graph | local invoke 성공 |
| 2 | LLM chat graph | 최소 chat graph | user -> assistant 응답 |
| 3 | React streaming | `useStream` chat UI | token streaming 표시 |
| 4 | thread persistence | thread route/list | reload 후 history 복원 |
| 5 | thread join | running thread 재진입 | 중복 run 없이 복구 |
| 6 | tool calling | ToolNode agent | tool result 후 최종 답변 |
| 7 | tool UI | tool card/progress | running/completed/error 표시 |
| 8 | HITL | approval interrupt | 승인/거절 resume |
| 9 | assistant-ui | runtime 기반 UI | 기본 Thread UI 연결 |
| 10 | artifact/citation | artifact panel/source panel | message와 artifact 분리 |
| 11 | auth/proxy | secure proxy | secret 미노출, owner 검증 |
| 12 | stability | error/retry/cancel | stream failure 복구 |
| 13 | testing | graph/proxy/E2E | deterministic CI |
| 14 | observability | LangSmith/app logs | trace/log 연결 |
| 15 | production | deploy/rollback | staging/prod 운영 |

### 1주 구현 계획

빠르게 prototype을 만드는 순서:

```text
Day 1
  - langgraph.json
  - AgentState
  - LLM chat graph
  - local invoke

Day 2
  - Next.js route
  - useAgentStream
  - MessageList
  - Composer

Day 3
  - thread create route
  - /agents/[threadId]
  - reload 후 state 복원

Day 4
  - tool 정의
  - ToolNode loop
  - tool call UI

Day 5
  - interrupt approval
  - resume UI
  - error banner

Day 6
  - proxy route
  - user/thread ownership
  - env validation

Day 7
  - graph unit test
  - Playwright thread reload test
  - LangSmith tracing
```

이 일정은 학습용 압축 계획이다. production 품질은 2~4주 단위로 테스트, 보안, 관측, rollback을 보강한다.

### production 구현 순서

production을 목표로 할 때는 다음 순서를 권장한다.

1. LangGraph graph를 먼저 안정화한다.
2. local invoke와 graph unit test를 만든다.
3. React custom UI로 stream/state를 이해한다.
4. thread persistence와 reload 복구를 구현한다.
5. tool calling과 tool UI를 붙인다.
6. HITL interrupt를 붙인다.
7. assistant-ui 적용 여부를 결정한다.
8. artifact/citation/attachment를 분리한다.
9. Next.js proxy와 auth/ownership을 구현한다.
10. error/retry/cancel/reconnect 정책을 넣는다.
11. graph/proxy/component/E2E 테스트를 만든다.
12. LangSmith trace와 app log를 연결한다.
13. staging에서 `langgraph up` 또는 production-like runtime으로 검증한다.
14. canary/rollback 전략을 정한 뒤 production에 배포한다.

### 기능별 난이도

| 기능 | 난이도 | 이유 |
|---|---|---|
| 최소 chat streaming | 낮음 | SDK hook으로 빠르게 가능 |
| thread route/history | 중간 | URL, SDK state, persistence 연결 필요 |
| tool calling | 중간 | message/tool result shape 이해 필요 |
| tool UI | 중간 | raw data와 사용자 노출 정보 분리 필요 |
| interrupt | 중상 | checkpoint, resume, side effect 규칙 필요 |
| thread join | 중상 | active run, reconnect, duplicate 방지 필요 |
| generative UI | 중상 | schema/renderer/safety 필요 |
| secure proxy | 높음 | auth, owner, secret, SSE pass-through 필요 |
| production rollback | 높음 | checkpoint compatibility 고려 필요 |

### 학습 체크 질문

다음 질문에 답할 수 있으면 이 문서를 제대로 소화한 것이다.

- LangGraph의 graph, assistant, thread, run, checkpoint는 각각 무엇인가?
- browser에서 LangGraph API key를 노출하면 왜 위험한가?
- `messages`, `updates`, `values`, `custom` stream mode를 언제 쓰는가?
- React local state와 LangGraph state의 경계는 어디인가?
- reload 후 history를 복원하려면 어떤 id가 필요한가?
- running thread에 다시 들어갈 때 새 run을 만들면 왜 위험한가?
- tool raw input/output을 그대로 UI에 보여주면 안 되는 이유는 무엇인가?
- interrupt 이전에 side effect를 두면 왜 문제가 되는가?
- artifact와 assistant message를 분리해야 하는 기준은 무엇인가?
- graph state schema 변경이 기존 checkpoint에 어떤 영향을 주는가?
- production에서 SSE가 한 번에 도착하면 어디를 확인해야 하는가?
- E2E 테스트에서 real model 대신 deterministic graph를 쓰는 이유는 무엇인가?

### 프로젝트 품질 checklist

graph:

- `langgraph.json` graph path가 맞다.
- graph unit test가 있다.
- tool schema가 zod로 검증된다.
- interrupt payload가 JSON-serializable 하다.
- side effect tool에는 idempotency 또는 approval이 있다.
- state schema 변경에 backward compatibility가 있다.

frontend:

- `useStream`은 wrapper를 통해서만 사용한다.
- `threadId`는 URL에 있다.
- reload 후 thread state가 복원된다.
- duplicate message dedup 정책이 있다.
- tool/artifact/citation은 view model로 렌더링한다.
- error boundary가 message/artifact 단위로 있다.
- stop, retry, interrupt resume UI가 있다.

backend/proxy:

- LangGraph API key가 browser에 노출되지 않는다.
- auth session에서 user id를 읽는다.
- thread ownership을 server에서 검증한다.
- assistant id allowlist가 있다.
- request rate limit이 있다.
- metadata/configurable user context는 server에서 overwrite한다.
- SSE response body를 pass-through 한다.

operations:

- LangSmith tracing이 켜져 있다.
- trace metadata에 `userId`, `threadId`, `appVersion`이 있다.
- app log에 `requestId`, `runId`, `threadId`가 있다.
- synthetic run이 있다.
- staging 환경이 있다.
- rollback/canary 전략이 있다.
- runbook이 있다.

### 참고 문서

LangGraph JavaScript:

- Overview: https://docs.langchain.com/oss/javascript/langgraph
- Graph API: https://docs.langchain.com/oss/javascript/langgraph/use-graph-api
- Streaming: https://docs.langchain.com/oss/javascript/langgraph/streaming
- Interrupts: https://docs.langchain.com/oss/javascript/langgraph/interrupts
- Human-in-the-loop: https://docs.langchain.com/oss/javascript/langgraph/human-in-the-loop
- Test guide: https://docs.langchain.com/oss/javascript/langgraph/test
- Backward compatibility: https://docs.langchain.com/oss/javascript/langgraph/backward-compatibility
- Frontend overview: https://docs.langchain.com/oss/javascript/langgraph/frontend/overview
- Frontend graph execution: https://docs.langchain.com/oss/javascript/langgraph/frontend/graph-execution

LangGraph Platform / LangSmith Deployment:

- Local server: https://docs.langchain.com/langgraph-platform/local-server
- Application structure: https://docs.langchain.com/langgraph-platform/application-structure
- CLI: https://docs.langchain.com/langgraph-platform/cli
- Deployment overview: https://docs.langchain.com/langsmith/deployments
- JavaScript deploy guide: https://docs.langchain.com/oss/javascript/langgraph/deploy
- Auth: https://docs.langchain.com/langsmith/auth
- Studio: https://docs.langchain.com/langsmith/studio

LangSmith Observability:

- Observability concepts: https://docs.langchain.com/langsmith/observability-concepts
- Trace LangChain JS/TS: https://docs.langchain.com/langsmith/trace-with-langchain
- Add metadata and tags: https://docs.langchain.com/langsmith/add-metadata-tags
- Sampling traces: https://docs.langchain.com/langsmith/sample-traces
- Distributed tracing: https://docs.langchain.com/langsmith/distributed-tracing

React SDK / assistant-ui:

- `@langchain/react` reference: https://reference.langchain.com/javascript/langchain-react
- `useStream` options: https://reference.langchain.com/javascript/langchain-langgraph-sdk/react/UseStreamOptions
- assistant-ui LangGraph runtime: https://www.assistant-ui.com/docs/runtimes/langgraph/overview
- assistant-ui quickstart: https://www.assistant-ui.com/docs/runtimes/langgraph/quickstart
- assistant-ui interrupts: https://www.assistant-ui.com/docs/runtimes/langgraph/interrupts

### 최종 완료 기준

이 문서를 끝까지 구현하면 다음을 만들 수 있어야 한다.

- LangGraph backend graph
- React custom streaming chat UI
- thread create/list/select/reload 복구
- tool calling agent와 tool call UI
- human-in-the-loop approval flow
- artifact/citation/attachment 기반 agent UX
- assistant-ui 기반 대체 UI
- secure backend proxy
- error/retry/cancel/reconnect 처리
- graph/proxy/component/E2E 테스트
- LangSmith tracing과 production debugging
- staging/production 배포와 rollback 전략

### 100% 지점 완료 기준

여기까지 완료하면 LangGraph + React로 chat agent급 frontend를 제로부터 production 운영 수준까지 구현하기 위한 기술 기반이 완성된다.

- 전체 목차가 기초 -> 심화 순서로 정리되어 있다.
- 각 장은 목표, 구현 기준, code snippet, 완료 기준을 가진다.
- 최소 graph부터 production proxy와 배포까지 연결된다.
- code snippets를 조합해 실제 프로젝트 scaffold를 시작할 수 있다.
- troubleshooting과 roadmap을 보고 구현 순서를 결정할 수 있다.
