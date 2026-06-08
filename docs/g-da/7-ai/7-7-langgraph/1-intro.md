---
sidebar_position: 0
---

# 1.Why use LangGraph?  

## Why use LangGraph?  

LangGraph provides *low-level supporting infrastructure for any long-running, stateful workflow or agent:*
- Durable execution — Build agents that persist through failures and can run for extended periods, automatically resuming from exactly where they left off.
- Human-in-the-loop — Seamlessly incorporate human oversight by inspecting and modifying agent state at any point during execution.
- Comprehensive memory — Create stateful agents with both short-term working memory for ongoing reasoning and long-term persistent memory across sessions.
- Debugging with LangSmith  

LangGraph는 LLM 애플리케이션에서 **상태가 있는 에이전트 워크플로우**를 만들기 위한 그래프 기반 프레임워크다.

일반적인 LLM 앱은 프롬프트를 만들고, 모델을 호출하고, 결과를 받아오는 흐름으로 끝나는 경우가 많다. 하지만 실제 에이전트는 한 번에 끝나지 않는다. 도구를 호출하고, 결과를 확인하고, 다시 판단하고, 필요하면 사람에게 승인을 요청하고, 실패하면 재시도해야 한다. LangGraph는 이런 흐름을 노드와 엣지로 명시적으로 설계할 수 있게 해준다.

## LangChain vs LangGraph

- **LangChain**은 LLM 앱에 필요한 부품을 제공한다.
- **LangGraph**는 그 부품들이 어떤 순서와 조건으로 동작할지 제어한다.

LangChain과 LangGraph는 경쟁 관계라기보다 역할이 다르다.

| 구분 | LangChain | LangGraph |
|---|---|---|
| 핵심 역할 | LLM 앱을 만들기 위한 컴포넌트 프레임워크 | 상태 기반 에이전트 워크플로우 오케스트레이션 |
| 주요 사용처 | RAG, 프롬프트 체인, 모델 호출, 도구 연결, 간단한 에이전트 | 복잡한 에이전트, 반복/분기/재시도, 멀티 에이전트, human-in-the-loop |
| 흐름 제어 | 비교적 선형적인 체인 구성 | 노드와 엣지로 명시적인 그래프 구성 |
| 상태 관리 | 가능하지만 중심 개념은 아님 | 핵심 개념 |
| 반복과 분기 | 가능하지만 구조가 복잡해질 수 있음 | 1급 기능 |


### 언제 LangChain을 쓰나?

다음처럼 흐름이 비교적 단순하면 LangChain만으로 충분한 경우가 많다.

- 문서 기반 질의응답
- RAG 파이프라인
- 프롬프트 템플릿과 모델 호출 조합
- 모델 출력 파싱
- 간단한 도구 호출
- 짧은 체인 기반 자동화

예를 들어 "사용자의 질문을 받아서 문서를 검색하고, 검색 결과를 바탕으로 답변한다" 정도의 구조라면 LangChain 중심으로 구현해도 충부

## 언제 LangGraph를 쓰나?

다음처럼 워크플로우가 복잡해지면 LangGraph가 더 적합하다.

- 같은 작업을 여러 번 반복해야 할 때
- 결과에 따라 다음 단계가 달라질 때
- 실패 시 재시도하거나 다른 경로로 우회해야 할 때
- 여러 에이전트가 역할을 나누어 협업해야 할 때
- 중간에 사람이 승인하거나 수정해야 할 때
- 긴 작업을 저장하고 나중에 이어서 실행해야 할 때
- 에이전트의 상태를 명확하게 추적해야 할 때

예를 들어 "주제를 조사하고, 도구를 호출하고, 결과를 비판적으로 검토하고, 품질이 낮으면 다시 조사하고, 최종 보고서를 저장한다" 같은 흐름은 LangGraph로 설계하는 편이 낫다.

