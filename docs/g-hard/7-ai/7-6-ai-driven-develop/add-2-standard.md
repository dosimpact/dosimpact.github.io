Codex CLI 운영 표준 가이드 v1.0

목표: 생산성 ↑ + 안정성 ↑ + 재현성 ↑ + 비용 통제 + 보안 경계 명확화

⸻

0. 철학 (Operating Principles)  

Harness engineering  
- 누구나 이해 가능한 표준으로 코드를 작성하고, AI도 유지보수가 가능한 코드 컨벤션을 맞추어 작업한다.  

AI Utils Maximize   
- MCP
- Skills
- Workflow
- Sub-agents  

Minimize Human in the loop
- AI주도 개발에서 가장 큰 블록커는 인간이다. 인간이 개입이 최소화 하면서 품질 보증과 임팩트가 있어야 한다.  
- 인간의 고수준의 목표와 검증에 집중하고  
- 구현을 위한 추론은 AI에게 외주를 맡긴다.  

Measurable high-level impact metrics



## 기능들 정리  

💡 AGENTS  
- AI에이전트에게 주는 전반적인 지침, 파일 1개만 가능하다.  

💡 MCP/Apps  
- MCP는 프로토콜 수준의 정의
- Apps는 상용 MCP들의 모음집이다.  

💡 스킬  
- 로컬에서 AI Agent을 동작시키는 지침이다.  
- Rules보다 상위 호환, Worflows 도 비슷한 개념이지만 상위 호환이다.  
- 지침/컨벤션 + 로컬 파일 접근 + MCP 호출을 한곳에 모아둔다.  
- 트리거 : 수동, 자동(필요하면 스스로 호출)  

💡 멀티에이전트 기능    

Experimental으로 기능 활성화 필요  
- 메인 에이전트는 1개인데, 서브 에이전트를 스레드 기반으로 구동 가능  

```
 /agent → 새 에이전트 스레드 생성
 /status → 현재 스레드 상태 확인
 /compact → 컨텍스트 정리
```

부가 기능들  

💡 JavaScript REPL
- Enable a persistent Node-backed JavaScript REPL for interactive website debugging and other inline JavaScript execution  
- 웹 디버깅/DOM 분석/간단한 JS 실험에 좋음  



## 프로세스 정리  

Codex 문서 기준, `/init`으로 AGENTS.md 스캐폴딩 가능.  
- AGENTS.md에 반드시 명시: 모델 버전, reasoning level, review_model, 금지 규칙


Plan -> Excute 2단계로 진행 : 각 Plan단위 구현 결과를 PR 및 코멘트로 남기기  
- checkpoint 습관화
- review 생략 하지 말 것, 리뷰 게이트 (필수 루틴)
	/review, reviewer agent 재검토, /diff,	테스트 실행, 인간 승인
- 어떤 기능을 배치로 돌려두어야 하는가?  
- 실패 복구 전략 (Rollback)
  - 1, base branch 기반 작업 전략
  - 2, tag check points 전략  
  - 3, 배포 후 roll back 전략  