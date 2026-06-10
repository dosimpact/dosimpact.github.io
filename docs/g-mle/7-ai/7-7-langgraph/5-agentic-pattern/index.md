---
sidebar_position: 0
---

# Agentic Design Patterns Index

이 문서는 LangGraph로 구현할 에이전틱 디자인 패턴 문서의 인덱스다. 각 장은 하나의 패턴을 설명하고, LangGraph 상태, 노드, 엣지, 실패 처리, 테스트 기준으로 옮기는 방법을 정리한다.

## 읽는 순서

처음 읽는다면 1장부터 6장까지를 먼저 보는 것이 좋다. 이 구간은 단일 에이전트 워크플로를 설계할 때 자주 쓰는 기본 제어 흐름을 다룬다.

- 1: Prompt Chaining
- 2: Routing
- 3: Parallelization
- 4: Reflection
- 5: Tool Use
- 6: Planning

그 다음에는 협업, 상태, 기억, 회복, 사람 개입처럼 운영 환경에서 필요한 패턴을 이어서 읽는다.

- 7: Multi-Agent Collaboration
- 8: Memory Management
- 9: Learning and Adaptation
- 10: Model Context Protocol (MCP)
- 11: Goal Setting and Monitoring
- 12: Exception Handling and Recovery
- 13: Human-in-the-Loop

검색, 통신, 최적화, 평가, 안전성은 실제 제품 적용 시 검토해야 할 확장 패턴이다.

- 14: Knowledge Retrieval (RAG)
- 15: Inter-Agent Communication (A2A)
- 16: Resource-Aware Optimization
- 17: Reasoning Techniques
- 18: Guardrails/Safety Patterns
- 19: Evaluation and Monitoring
- 20: Prioritization
- 21: Exploration and Discovery

## 문서 구조

각 패턴 문서는 같은 관점으로 읽을 수 있게 구성한다.

- Pattern Summary: 패턴이 해결하는 문제와 핵심 아이디어
- Pattern Explanation: 사용 기준, 작동 방식, 트레이드오프
- LangGraph Mapping: 패턴 개념을 LangGraph 요소로 옮기는 방법
- State: 그래프가 유지해야 하는 상태 필드
- Nodes: 각 노드의 책임
- Edges: 제어 흐름과 조건부 분기
- Inputs and Outputs: 실행 입력과 기대 출력
- Failure Cases: 실패, 재시도, 폴백 기준
- Test Ideas: 구현 검증에 필요한 테스트

## 구현 원칙

각 예제는 설명보다 실행 가능성을 우선한다. 그래프의 상태는 명시적이어야 하고, 노드는 하나의 책임만 가져야 한다. 조건부 엣지는 정규화되고 검증된 상태만 읽어야 한다. 실패는 숨기지 않고 상태에 기록해야 한다.

테스트는 외부 네트워크와 실제 API 키에 의존하지 않는다. LLM, 도구, 검색기, API 호출은 fake 또는 deterministic test double로 대체할 수 있어야 한다.

## 언어 구분

같은 패턴은 영어 문서와 한국어 문서가 함께 존재할 수 있다. 제목의 `(en)`과 `(ko)` suffix로 언어를 구분한다.
