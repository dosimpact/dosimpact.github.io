---
sidebar_position: 31
---

# 부록. LangGraph API


# LangGraph API

`langgraph dev`를 실행하면 LangGraph 개발 서버가 기본 REST API를 함께 노출한다.

용어 및 흐름
  - graph
      - 실제 agent 그래프 로직입니다.
      - node, edge, state, interrupt/resume 흐름이 여기 들어 있음.  
  - assistant
      - graph는 클래스 정의 -> assistant는 그 클래스를 특정 설정으로 띄운 인스턴스  
      - graph로 여러 assistant를 만든다.    
      - assistant마다 모델 설정, 툴 설정, 시스템프롬프트 등 다르게 가능  
  - thread
      - 상태를 저장하는 대화/실행 컨테이너입니다.
      - 어떤 사용자의 한 세션, 한 문서 작업 흐름 같은 것으로 보면 됩니다.
      - 아직 이 단계에서는 어떤 assistant를 쓸지 정하지 않아도 됩니다.
  - thread run
      - 특정 thread에서 특정 assistant를 실제로 1회 실행한 기록입니다.
      - 입력 메시지를 넣고 실행하면 run_id가 생깁니다.
      - interrupt까지 도달해도 그 run은 success로 끝날 수 있습니다. 그 뒤 상태는 thread에 남습니다.


## Assistants

An assistant is a configured instance of a graph.

### AssistantsOperations

- `POST /assistants`: 새 assistant를 생성한다.
- `POST /assistants/search`: assistant 목록을 조건으로 조회한다.
- `POST /assistants/count`: assistant 개수를 센다.
- `GET /assistants/{assistant_id}`: assistant 상세 정보를 조회한다.
- `DELETE /assistants/{assistant_id}`: assistant를 삭제한다.
- `PATCH /assistants/{assistant_id}`: assistant 설정을 수정한다.
- `GET /assistants/{assistant_id}/graph`: assistant의 그래프 구조를 조회한다.
- `GET /assistants/{assistant_id}/subgraphs`: assistant의 서브그래프 목록을 조회한다.
- `GET /assistants/{assistant_id}/subgraphs/{namespace}`: 특정 서브그래프를 조회한다.
- `GET /assistants/{assistant_id}/schemas`: assistant의 입력/출력 스키마를 조회한다.
- `POST /assistants/{assistant_id}/versions`: assistant 버전을 생성한다.
- `POST /assistants/{assistant_id}/latest`: assistant를 최신 버전 기준으로 맞춘다.

## Threads

A thread is a stateful conversation or execution container.

### ThreadsOperations

- `POST /threads`: 새 thread를 생성한다.
- `POST /threads/search`: thread 목록을 조건으로 조회한다.
- `POST /threads/count`: thread 개수를 센다.
- `POST /threads/prune`: 오래된 thread를 정리한다.
- `GET /threads/{thread_id}`: thread 상세 정보를 조회한다.
- `POST /threads/{thread_id}/copy`: thread를 복사한다.
- `GET /threads/{thread_id}/history`: thread 실행 이력을 조회한다.
- `GET /threads/{thread_id}/state`: 현재 state를 조회한다.
- `POST /threads/{thread_id}/state/checkpoint`: 현재 state를 체크포인트로 저장한다.
- `GET /threads/{thread_id}/state/{checkpoint_id}`: 특정 체크포인트 state를 조회한다.
- `POST /threads/{thread_id}/stream`: thread 단위 스트림을 연다.

## Thread Runs

A thread run executes an assistant on an existing thread.

### ThreadRunsOperations

- `POST /threads/{thread_id}/runs`: 특정 thread에서 실행을 시작한다.
- `POST /threads/{thread_id}/runs/stream`: 실행 결과를 스트리밍으로 받는다.
- `POST /threads/{thread_id}/runs/wait`: 실행 완료까지 기다린다.
- `GET /threads/{thread_id}/runs/{run_id}`: 특정 run 상태를 조회한다.
- `POST /threads/{thread_id}/runs/{run_id}/cancel`: 실행을 취소한다.
- `POST /threads/{thread_id}/runs/{run_id}/join`: 진행 중 실행에 다시 붙는다.
- `POST /threads/{thread_id}/runs/{run_id}/stream`: 특정 run의 스트림에 붙는다.
- `POST /threads/{thread_id}/runs/crons`: thread 기준 cron 실행을 등록한다.

## Stateless Runs

A stateless run executes without storing state in a thread.

### StatelessRunsOperations

- `POST /runs`: 상태 저장 없이 1회성 실행을 시작한다.
- `POST /runs/stream`: 상태 저장 없이 스트리밍 실행한다.
- `POST /runs/wait`: 상태 저장 없이 완료까지 기다린다.
- `POST /runs/batch`: 여러 실행을 배치로 처리한다.
- `POST /runs/cancel`: stateless run을 취소한다.

## Crons

Crons schedule runs to happen automatically on a time-based schedule.

### CronsOperations

- `POST /runs/crons`: cron 실행을 생성한다.
- `POST /runs/crons/search`: cron 목록을 조회한다.
- `POST /runs/crons/count`: cron 개수를 센다.
- `GET /runs/crons/{cron_id}`: 특정 cron 정보를 조회한다.
- `DELETE /runs/crons/{cron_id}`: cron을 삭제한다.

## Store

The store API manages persisted items and namespaces.

### StoreOperations

- `PUT /store/items`: store에 item을 저장한다.
- `POST /store/items/search`: item을 조건으로 검색한다.
- `POST /store/namespaces`: namespace 목록을 조회한다.

## A2A

A2A is for agent-to-agent communication.

### A2AOperations

- `POST /a2a/{assistant_id}`: assistant를 A2A 방식으로 호출한다.

## MCP

MCP exposes Model Context Protocol endpoints for tool and context integration.

### MCPOperations

- `POST /mcp/`: MCP 요청을 처리한다.
- `GET /mcp/`: MCP 엔드포인트 정보를 조회한다.
- `DELETE /mcp/`: MCP 세션을 종료한다.

## System

System APIs expose server-level information and health endpoints.

### SystemOperations

- `GET /info`: 서버 정보를 조회한다.
- `GET /metrics`: 서버 메트릭을 조회한다.
- `GET /docs`: API 문서를 조회한다.
- `GET /ok`: 헬스 체크를 수행한다.

## Models

Models is a group for model-related capabilities exposed by the server.

현재 이 로컬 dev 서버의 `openapi.json` 경로 목록에는 별도 `/models` 엔드포인트가 보이지 않았다. UI 그룹에는 존재할 수 있지만, 실제 노출 경로는 서버 버전이나 설정에 따라 달라질 수 있다.

