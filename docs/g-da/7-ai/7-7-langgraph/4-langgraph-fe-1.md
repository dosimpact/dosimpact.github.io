# Langgraph Frontend 

- [Langgraph Frontend](#langgraph-frontend)
  - [Index](#index)
  - [Agent UI 라이브러리 및 생태계 정리](#agent-ui-라이브러리-및-생태계-정리)
  - [](#)


## Index

- [ ] Agent UI 라이브러리 및 생태계 정리
- [ ]

## Agent UI 라이브러리 및 생태계 정리   

- @langchain/langgraph : python langgraph대신 직업 js로 langgraph을 개발하는 경우.  
- @langchain/langgraph-sdk  : LangGraph Server/Platform API 클라이언트. 
- @langchain/langgraph-sdk/react : 리액트 wrapper
- assistant-ui : UI Primitive 을 빠르게 구현하기 위한 라이브러리 계층.
  - 트레이드 오프 : @langchain/langgraph-sdk 의 이벤트를 assistant-ui의 방식으로 전환해야하는 레이어가 있음. 
- CopilotKit : Agent가 frontend action/tool과 밀접하게 연동, app상태와 agent상태 동기화. AG-UI. 서버에 CoilotRuntime 계층이 추가된다.  


## 