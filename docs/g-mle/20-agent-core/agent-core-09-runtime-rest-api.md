---
sidebar_position: 9
title: Agent Core Runtime REST API
description: AWS Agent Core Runtime을 만든 뒤 REST API로 에이전트를 호출하고, 세션 명령을 실행하고, Gateway를 통해 제어하는 방법을 정리합니다.
---

# Agent Core Runtime REST API

AWS Agent Core Runtime을 만들고 나면 애플리케이션은 REST API 형태로 런타임을 호출할 수 있다.
핵심은 두 가지다.

1. **Data Plane API**: 배포된 Runtime을 실제로 호출한다.
2. **Control Plane API**: Runtime, Endpoint, Gateway 같은 리소스를 생성·조회·수정한다.

일반적인 서비스 백엔드가 사용자 요청을 받아 Agent Core Runtime에 전달할 때는 대부분 `InvokeAgentRuntime`을 사용한다.
Gateway를 앞단에 두면 Gateway URL로 호출하면서 인증, 정책, Guardrail, Observability를 Runtime 바깥에서 적용할 수 있다.

공식 문서:

- [InvokeAgentRuntime - Amazon Bedrock AgentCore Data Plane](https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_InvokeAgentRuntime.html)
- [Invoke an AgentCore Runtime agent](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-invoke-agent.html)
- [InvokeAgentRuntimeCommand - Amazon Bedrock AgentCore Data Plane](https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_InvokeAgentRuntimeCommand.html)
- [Amazon Bedrock AgentCore Runtime targets](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-http-runtime.html)
- [AgentCore Control Plane API Reference](https://docs.aws.amazon.com/bedrock-agentcore-control/latest/APIReference/Welcome.html)

## 1. Runtime 호출 API

`InvokeAgentRuntime`은 Agent Core Runtime에 배포된 agent 또는 tool에 요청을 보내고 응답을 받는 API다.
응답은 streaming을 지원한다.

### Endpoint

```http
POST /runtimes/{agentRuntimeArn}/invocations?accountId={accountId}&qualifier={qualifier}
```

`agentRuntimeArn`에는 full ARN 또는 agent ID를 넣을 수 있다.
agent ID만 쓰는 경우에는 `accountId` query parameter가 필요하다.

### 주요 권한

| 작업 | 필요한 IAM 권한 |
| --- | --- |
| Runtime 호출 | `bedrock-agentcore:InvokeAgentRuntime` |
| 사용자 ID를 대신해 호출 | `bedrock-agentcore:InvokeAgentRuntime`, `bedrock-agentcore:InvokeAgentRuntimeForUser` |

OAuth를 통합하는 경우 AWS SDK 호출이 아니라 HTTPS request로 `InvokeAgentRuntime`을 호출해야 한다고 AWS 문서가 안내한다.

## 2. InvokeAgentRuntime 요청 스펙

### Path / Query

| 이름 | 위치 | 필수 | 설명 |
| --- | --- | --- | --- |
| `agentRuntimeArn` | path | 예 | 호출할 Runtime ARN 또는 agent ID |
| `accountId` | query | 조건부 | `agentRuntimeArn`에 agent ID를 넣을 때 필요한 AWS 계정 ID |
| `qualifier` | query | 아니오 | 특정 Runtime endpoint 또는 version을 가리키는 qualifier. 생략 시 default endpoint 사용 |

### Headers

| Header | 필수 | 설명 |
| --- | --- | --- |
| `Content-Type` | 권장 | 요청 payload MIME type. 보통 `application/json` |
| `Accept` | 권장 | 응답 MIME type. 예: `application/json`, `text/event-stream` |
| `X-Amzn-Bedrock-AgentCore-Runtime-Session-Id` | 권장 | Runtime session ID. 같은 값을 재사용하면 대화 context를 이어갈 수 있음 |
| `X-Amzn-Bedrock-AgentCore-Runtime-User-Id` | 선택 | 사용자 단위 호출을 식별할 때 사용 |
| `X-Amzn-Trace-Id` | 선택 | 요청 추적 ID |
| `traceparent` | 선택 | W3C distributed tracing parent 정보 |
| `tracestate` | 선택 | W3C distributed tracing state 정보 |
| `baggage` | 선택 | distributed tracing context |
| `Mcp-Session-Id` | 선택 | MCP session ID |
| `Mcp-Protocol-Version` | 선택 | MCP protocol version |

`runtimeSessionId`는 최소 33자, 최대 256자 제약이 있다.
실무에서는 사용자 대화 단위로 UUID 기반 session ID를 만들고 재사용하는 방식이 자연스럽다.

### Body

요청 body는 binary payload다.
형식은 agent 구현과 `Content-Type`에 따라 달라진다.
대부분의 HTTP agent는 JSON payload를 받도록 설계한다.

```json
{
  "prompt": "현재 세션 상태를 요약해줘"
}
```

AWS 공식 API Reference 기준 payload 최대 크기는 100 MB다.

## 3. InvokeAgentRuntime 응답 스펙

### Headers

| Header | 설명 |
| --- | --- |
| `X-Amzn-Bedrock-AgentCore-Runtime-Session-Id` | Runtime session ID |
| `Content-Type` | 응답 MIME type |
| `Mcp-Session-Id` | MCP session ID |
| `Mcp-Protocol-Version` | MCP protocol version |
| `X-Amzn-Trace-Id` | trace ID |
| `traceparent` | W3C trace parent |
| `tracestate` | W3C trace state |
| `baggage` | distributed tracing context |

### Body

응답 body는 agent가 반환하는 response stream이다.
`Content-Type`에 따라 처리 방식이 다르다.

| 응답 타입 | 처리 방식 |
| --- | --- |
| `text/event-stream` | `data:` line을 chunk 단위로 읽음 |
| `application/json` | chunk를 모아 JSON으로 parse |
| 기타 binary/text | agent 구현에 맞게 처리 |

## 4. 직접 호출 예시

### curl

실제 서비스에서는 AWS SigV4 서명이 필요하다.
아래 예시는 HTTP shape를 이해하기 위한 형태다.

```bash
curl -X POST "https://bedrock-agentcore.{region}.amazonaws.com/runtimes/{encodedAgentRuntimeArn}/invocations?qualifier=DEFAULT" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "X-Amzn-Bedrock-AgentCore-Runtime-Session-Id: session-123456789012345678901234567890123" \
  -d '{"prompt":"Hello"}'
```

### boto3

```python
import json
import uuid
import boto3

client = boto3.client("bedrock-agentcore", region_name="us-west-2")

response = client.invoke_agent_runtime(
    agentRuntimeArn="arn:aws:bedrock-agentcore:us-west-2:111122223333:runtime/AGENT_RUNTIME_ID",
    runtimeSessionId=str(uuid.uuid4()) + "-agentcore-session",
    qualifier="DEFAULT",
    contentType="application/json",
    accept="application/json",
    payload=json.dumps({"prompt": "Hello"}).encode("utf-8"),
)

chunks = []
for chunk in response.get("response", []):
    chunks.append(chunk.decode("utf-8"))

print("".join(chunks))
```

## 5. Session 관리

`InvokeAgentRuntime`은 `runtimeSessionId`로 session을 유지한다.

| 상황 | session ID 전략 |
| --- | --- |
| 새 대화 시작 | 새로운 session ID 생성 |
| 기존 대화 이어가기 | 이전 요청과 같은 session ID 재사용 |
| 사용자별 독립 context | 사용자 ID와 대화 ID를 기준으로 session ID 관리 |

같은 session ID를 쓰면 Runtime이 이전 interaction을 참조할 수 있다.
충돌을 피하려면 UUID처럼 충분히 고유한 값을 사용한다.

## 6. Command 실행 API

`InvokeAgentRuntimeCommand`는 이미 실행 중인 Runtime session 안에서 shell command를 실행하고 stdout/stderr를 streaming으로 받는 API다.
agent reasoning은 `InvokeAgentRuntime`에 맡기고, 테스트 실행·빌드·파일 확인 같은 deterministic 작업은 이 API로 분리할 수 있다.

### Endpoint

```http
POST /runtimes/{agentRuntimeArn}/commands?accountId={accountId}&qualifier={qualifier}
```

### 권한

| 작업 | 필요한 IAM 권한 |
| --- | --- |
| Runtime session command 실행 | `bedrock-agentcore:InvokeAgentRuntimeCommand` |

### Request body

```json
{
  "command": "/bin/bash -c \"npm test\"",
  "timeout": 60
}
```

| 필드 | 필수 | 설명 |
| --- | --- | --- |
| `command` | 예 | Runtime container 안에서 실행할 shell command. 1 byte 이상 64 KB 이하 |
| `timeout` | 아니오 | command timeout. 기본 300초, 최소 1초, 최대 3600초 |

### Response event

| Event | 의미 |
| --- | --- |
| `contentStart` | command 시작 |
| `contentDelta` | 실행 중 stdout/stderr chunk |
| `contentStop` | 종료. `exitCode`, `status` 포함 |

보안상 command 실행은 매우 강한 권한이다.
AWS 문서도 command 실행에 대한 책임은 사용자에게 있으며, container 내부 filesystem과 설정된 credential에 접근할 수 있음을 명시한다.

## 7. Gateway를 통한 Runtime 호출

Runtime을 직접 열어두는 대신 Agent Core Gateway를 앞단에 두면 인증, 정책, Guardrail, interceptor, observability를 중앙에서 적용할 수 있다.

Agent Core Runtime target을 Gateway에 붙이면 Gateway가 Runtime으로 요청을 그대로 forwarding한다.
이 방식은 MCP target처럼 tool capability를 aggregation하지 않고, target별 path routing으로 호출한다.

### Gateway invocation URL

```http
POST https://{gatewayId}.gateway.bedrock-agentcore.{region}.amazonaws.com/{targetName}/invocations
```

### Gateway 호출 예시

```bash
curl -X POST "https://gateway-id.gateway.bedrock-agentcore.us-west-2.amazonaws.com/my-target/invocations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"input":{"prompt":"Hello"}}'
```

Gateway Runtime target 설정에는 Runtime ARN이 필요하고, qualifier는 선택이다.
HTTP protocol runtime에 Gateway policy/guardrail을 적용하려면 request/response schema를 OpenAPI 또는 Smithy 형식으로 제공해야 한다.

## 8. Control Plane API 요약

Agent Core 리소스 자체를 만들고 관리하는 API는 Data Plane이 아니라 Control Plane이다.

| 목적 | 대표 API | 설명 |
| --- | --- | --- |
| Runtime 생성 | `CreateAgentRuntime` | container artifact, role, network, protocol 설정으로 Runtime 생성 |
| Runtime 조회 | `GetAgentRuntime` | Runtime ARN, ID, version, status, env, network 설정 조회 |
| Runtime 목록 | `ListAgentRuntimes` | 계정/리전의 Runtime 목록 조회 |
| Runtime 수정 | `UpdateAgentRuntime` | artifact, env, role, network, protocol 등을 업데이트 |
| Endpoint 수정 | `UpdateAgentRuntimeEndpoint` | endpoint가 바라보는 Runtime version 또는 설명 수정 |
| Gateway 생성 | `CreateGateway` | Runtime 또는 외부 target 앞단의 Gateway 생성 |

Control Plane API는 HTTP REST 형태의 AWS API지만, 일반 애플리케이션의 agent 호출 경로와는 분리해서 생각하는 것이 좋다.
배포 자동화, CI/CD, 운영 콘솔은 Control Plane을 사용하고, 사용자 요청 처리는 Data Plane 또는 Gateway invocation URL을 사용한다.

## 9. 에러 처리

공식 API Reference에서 공통적으로 확인되는 주요 에러는 다음과 같다.

| 에러 | HTTP status | 의미 |
| --- | --- | --- |
| `ValidationException` | 400 | ARN, session ID, payload, command 등 입력값이 제약을 만족하지 않음 |
| `AccessDeniedException` | 403 | IAM 권한 또는 인증/인가 부족 |
| `ResourceNotFoundException` | 404 | Runtime, endpoint, target 등을 찾을 수 없음 |
| `RuntimeClientError` | 424 | Runtime client 쪽 오류 |
| `ThrottlingException` | 429 | 요청 rate limit 초과 |
| `InternalServerException` | 500 | AWS 서비스 내부 오류. exponential backoff 권장 |
| `ServiceQuotaExceededException` | 402 | service quota 초과 |

## 10. 설계 기준

| 요구사항 | 권장 호출 방식 |
| --- | --- |
| 단순 agent 호출 | `InvokeAgentRuntime` |
| session 유지 대화 | 같은 `runtimeSessionId`로 `InvokeAgentRuntime` 반복 호출 |
| OAuth inbound auth 필요 | AWS SDK 대신 HTTPS request |
| command/test/build 실행 | `InvokeAgentRuntimeCommand` |
| 인증·정책·Guardrail을 중앙 적용 | Agent Core Gateway Runtime target |
| Runtime 생성/배포 자동화 | AgentCore Control Plane API |

운영 서비스에서는 Runtime을 직접 호출할지, Gateway를 강제할지 먼저 정해야 한다.
Gateway를 표준 진입점으로 쓰는 경우 Runtime 직접 호출을 IAM resource policy 또는 authorizer 설정으로 제한해야 정책 우회를 막을 수 있다.
