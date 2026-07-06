---
sidebar_position: 2
---

# 1.Langgrah Intro

## Langgraph의 필요성  
- 완전 자율 AI에게 명령은 계획, 설계, 실행, 재귀적 테스트 수행을 한다. 이것이 위험이다.  
- 어떤 방향성으로 진행 되는지 모르며, '할루이네이션 폭팔' 현상이 발생한다.  
- 하지만 너무 LLM을 정해진 틀 안에서 사용하는 것은 AI의 가능성을 제한한다. 그 정답은 사이에 있으며 lang graph가 그것을 구현해준다.  
- 따라서 자율적인 AI의 장점과 + 의도한 결과물까지 정합성 2가지를 모두 챙길 수 있는 에이전트 런타임이다.  

Langgraph : LLM을 State Machine 기반 워크플로우 안에서 통제하는 에이전트 런타임.  

Github : https://github.com/emarco177/langgraph-course/tree/main  


## Agent 패턴

| Agent 패턴 | 핵심 개념 | 대표 흐름 | 주요 목적 | LangGraph 핵심 요소 | 실무 활용 예시 |
| --- | --- | --- | --- | --- | --- |
| ReAct Agent | Thought + Action + Observation loop | Reason → Tool → Observe → Repeat | 기본 tool calling agent | loop edge, tool node | 검색 봇, API assistant |
| Router Agent | 질문별 routing | Query → Classifier → Specialized Agent | task 분기 | conditional edge | 코드/검색/금융 분리 |
| Supervisor Multi-Agent | 상위 agent가 하위 agent orchestration | Supervisor → Sub Agents | 역할 분리 및 협업 | shared state, delegation | Research + Coding + QA agent |
| Reflection Agent | 자기 결과 비평 | Generate → Critique → Improve | 품질 향상 | retry loop | 코드 개선, hallucination 감소 |
| Reflexion Agent | 실패 기억 기반 개선 | Attempt → Reflect → Retry | self-improving agent | memory + retry | autonomous debugging |
| Planning Agent | 계획 후 실행 | Planner → Steps → Executor | 긴 task 안정화 | planner node | research workflow |
| Human-in-the-loop | 사람 승인 삽입 | Agent → Approval → Continue | 안전성 확보 | interrupt/resume | deploy 승인 |
| Tool-Augmented Agent | 외부 도구 적극 사용 | LLM ↔ Tools | capability 확장 | tool executor | SQL/browser/python |
| Basic RAG Agent | retrieval 기반 응답 | Retrieve → Generate | grounding | retriever node | 문서 QA |
| Corrective RAG (CRAG) | retrieval 품질 검증 | Retrieve → Evaluate → Retry | 검색 품질 향상 | evaluator node | low-quality retrieval 보정 |
| Self-RAG | retrieval 필요 여부 자가 판단 | Decide → Retrieve → Verify | 비용/정확도 최적화 | conditional graph | adaptive QA |
| Adaptive RAG | 질문 난이도별 전략 변경 | Classify → Different RAG Flow | 동적 workflow | routing graph | enterprise search |
| Tree Search Agent (LATS) | 여러 reasoning path 탐색 | Multi-path → Evaluate → Select | System 2 reasoning | branching graph | 복잡한 문제 해결 |
| Stateful Workflow Agent | 상태 기반 workflow orchestration | Nodes + Shared State | durable workflow | graph state | long-running workflow |
| Validation Agent | 출력 검증 | Output → Validate → Approve | 안전성/정확성 | validation node | schema validation |
| Security Agent | 보안 정책 검사 | Input → Policy Check → Execute | safe execution | guardrail node | prompt injection 방어 |
| Evaluation Agent | 결과 scoring/eval | Output → Judge → Score | 품질 평가 | evaluator graph | LLM eval pipeline |
| Memory Agent | 장기/단기 기억 활용 | Retrieve Memory → Generate | personalization | checkpoint/store | persistent assistant |
| Collaborative Agent | agent 간 peer collaboration | Agent ↔ Agent | collective reasoning | message passing | debate architecture |
| Autonomous Agent | 목표 기반 자율 반복 실행 | Goal → Plan → Execute → Retry | autonomous workflow | persistent loop | autonomous research |
| Event-Driven Agent | 이벤트 기반 실행 | Event → Trigger → Action | reactive system | async node | monitoring automation |
| Hierarchical Agent | 계층형 orchestration | Manager → Worker → Specialist | large-scale orchestration | nested graph | enterprise AI workflow |
| Critic-Generator Pattern | 생성 + 평가 분리 | Generator → Critic → Revise | 품질 향상 | dual-node loop | writing/code review |
| Debate Agent | 다중 관점 토론 | Agent A ↔ Agent B → Judge | reasoning robustness | multi-branch graph | decision support |
| Verification Agent | 결과 검증 전용 | Solve → Verify → Finalize | factual correctness | verifier node | math/code validation |
| Workflow DAG Agent | DAG 기반 task execution | Directed Task Graph | deterministic orchestration | DAG edges | ETL + AI workflow |
| Long-running Durable Agent | checkpoint/recovery 지원 | Execute → Persist → Resume | 안정적 장기 실행 | checkpoint engine | async enterprise agent |
| Streaming Agent | partial output streaming | Node → Stream UI | 실시간 UX | streaming state | assistant-ui 연동 |
| UI-aware Agent | UI state 직접 제어 | Agent → UI Action | interactive UX | UI message state | Copilot/assistant UI |
| Guardrailed Tool Agent | tool execution 제한 | Policy → Tool Call | 안전한 tool 사용 | permission layer | 금융/사내 시스템 |
