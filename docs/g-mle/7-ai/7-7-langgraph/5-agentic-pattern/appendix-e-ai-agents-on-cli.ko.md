---
sidebar_position: 105
---

# Appendix E: AI Agents on the CLI (ko)

## 패턴 요약

CLI 기반 AI 에이전트는 개발자 터미널을 단순 명령 실행기가 아니라 컨텍스트 인식 작업 공간으로 바꾼다. 자연어 요청으로 파일 점검, 변경 계획, 셸 실행, 편집, Git, MCP 호출을 수행해 리뷰 가능한 산출물을 만들 수 있다. 부록에서는 Claude CLI, Gemini CLI, Aider, GitHub Copilot CLI, Terminal-Bench를 예시로 든다.

구현상 유용한 패턴은 개별 벤더 복제 자체가 아니다. 공통 제어 루프를 모델링해야 한다: 개발자 작업 수신 → 제한된 저장소 컨텍스트 수집 → 작업 분류 → 계획 수립 → 안전한 로컬 도구 선택 → 위험 작업은 리뷰 경유 → 승인된 읽기/결정론적 작업 실행 → 결과 요약 → 감사 추적 유지. 이 패턴은 자연어 의도, 코드베이스 컨텍스트, 도구 실행, 샌드박스, Git 인식, 인간 리뷰 결합으로 CLI 에이전트를 실용화한다.

## 패턴 설명

### 개념 개요

CLI 에이전트는 개발자가 이미 일하는 터미널/로컬 저장소에서 동작한다. 모든 명령을 개발자가 외우게 할 필요가 없고, 고수준 요청을 받아 관련 컨텍스트를 읽고 필요한 작업을 결정해 제안/실행한다.

부록은 CLI 에이전트가 단순 명령 생성기가 아님을 밝힌다. Claude CLI는 아키텍처 이해와 대화형 계획, Gemini CLI는 광범위 도구·긴 컨텍스트·멀티모달·reason-act 루프, Aider는 직접 편집·테스트·커밋, Copilot CLI는 GitHub 이슈/PR 흐름, Terminal-Bench는 현실적인 CLI 과제 완수력을 평가한다.

### 문제

개발 작업은 여러 파일·도구·피드백 루프를 거치는데, 순수 셸은 저수준이고 챗봇은 로컬 저장소 조작이 제한된다. CLI 에이전트는 자연어 요구를 바운드된 로컬 행동으로 이어가되, 개발자에게 맥락/실행/검토 권한을 준다.

### 사용해야 할 때

- 저장소 기반 Q&A, 문서 생성, 리팩터링 계획, 버그 분류, 테스트 중심 변경 같은 레포 의식 조력이 필요할 때.
- plan → inspect → act → verify → summarize 루프가 유용할 때.
- 파일 읽기, 셸 명령 제안, 테스트 실행, Git 확인, MCP 도구 호출이 필요한 상황.
- 최종 변경/커밋/PR/운영 명령은 사람 최종 승인일 때.
- Terminal-Bench 스타일 벤치마크로 CLI 에이전트 동작을 검증할 때.

### 사용하지 말아야 할 때

- 단발성 답변만 필요한 경우.
- 승인 없는 자율 쓰기/커밋/배포/자격증명 접근/파괴적 셸 실행 금지.
- 비제한 파일시스템/셸/네트워크/Git 접근 허용 금지.
- 작은 컨텍스트 범위면 대규모 저장소 적재를 피할 것.
- 벤더 CLI 동작을 안정적 계약으로 가정해선 안 되며, 패턴만 구현한다.

### 작동 방식

1. 개발자 요청 수신(경로, 이슈 텍스트, 명령 출력, 도구 선호 포함 가능).
2. 작업을 저장소 Q&A/문서 생성/리팩터 계획/코드 제안/명령 도움/테스트 워크플로/지원 불가 고위험으로 분류.
3. 컨텍스트 수집기는 작업 관련 파일/메타데이터만 허용 범위 안에서 읽음.
4. 플래너는 파일 읽기/검색/명령 제안/테스트 시뮬레이션/Git 상태/MCP 조회를 후보로 짧은 액션 계획 생성.
5. 정책 게이트는 allowlist, 리스크 규칙, 경로 제한, 승인 요구를 검증.
6. 안전한 읽기/결정론적 동작만 자동 실행; 위험한 쓰기·셸·Git·외부 동작은 인간 리뷰로 정지.
7. 최종적으로 답변·제안 명령·실행 추적·리뷰 플래그·다음 단계가 담긴 결과 반환.

### 트레이드오프

| 이점 | 비용 또는 위험 |
| --- | --- |
  | 터미널 워크플로에 AI를 자연스럽게 통합 | 도구 오남용 시 파일 손상·비밀 노출·위험 명령 실행 가능 |
| 저장소 컨텍스트를 활용해 정확도 향상 | 컨텍스트 수집 비용, 누락, 개인정보 이슈 |
| 멀티스텝 루프로 inspect/edit/test/commit 지원 | 추적/중단 기준 없으면 루프가 불명확해짐 |
| MCP나 로컬 명령 어댑터 통합 유연 | 도구마다 스키마/권한/오류 처리/샌드박스 필요 |
| 계획·명령 제안·diff·테스트 결과를 감사 가능 | 코드 변경/커밋/PR/운영 효과는 인간 리뷰 필수 |

### 최소 예시

```text
사용자: "DB 설정은 어디에 있나? 테스트 명령도 제안해줘."

prepare_task -> repository_qna로 분류
collect_context -> 허용 파일 읽기: README.md, pyproject.toml, src/config.py
plan_actions -> file_summary + command_suggestion 선택
policy_gate -> 읽기 전용 허용
execute_safe_actions -> 관련 파일 요약
synthesize_response -> 파일 경로, 신뢰도, 제안 테스트 명령 포함 답변
```

### LangGraph 매핑

| 패턴 개념 | LangGraph 요소 |
| --- | --- |
| 개발자 CLI 요청 | 상태 `input` |
| 저장소/터미널 컨텍스트 | `requested_paths`, `context_items`, `repo_snapshot` |
| 작업 분류 | `classify_task` 노드와 `task_type` |
| 액션 계획 | `plan_cli_actions` 노드와 `plan` |
| CLI/파일/Git/MCP 선택 | `tool_requests` |
| 샌드박스 및 권한 확인 | `policy_gate` 노드 |
| 안전 터미널/저장소 실행 | `execute_safe_actions` 노드 |
| 인간 리뷰 경계 | `request_human_review` 노드 |
| 결과 합성 | `synthesize_cli_response` 노드 |
| 감사 추적 | `action_log` |

## LangGraph 구현 목표

`cli_agent_assistant`라는 LangGraph 예제를 구축한다. 개발자 요청과 작은 in-memory 저장소 픽스처를 받아 터미널 스타일 답변, 계획, 안전한 명령 제안, 리뷰 플래그를 반환한다.

최초 구현은 벤더 CLI 호출/실제 파일 수정/임의 셸 실행/네트워크 호출 없이 결정론적 로컬 fixture와 가짜 핸들러로 동작한다. 부록 E 핵심을 보여야 한다.

- 컨텍스트 인식 저장소 이해
- 액션 전 멀티스텝 계획
- 파일/셸/Git/MCP 스타일 도구의 중재 실행
- 샌드박스와 승인 경계
- 쓰기/커밋/PR/고위험 명령은 인간 리뷰
- Terminal-Bench 스타일 태스크 산출 검증

## 상태 형태

| 필드 | 타입 | 목적 |
| --- | --- | --- |
| `input` | `str` | CLI에 입력된 원문 |
| `normalized_input` | `str` | 분류·계획용 정규화 텍스트 |
| `task_type` | `Literal["repo_qna", "doc_generation", "refactor_plan", "command_help", "test_workflow", "code_change", "unsupported"] \| None` | 분류된 작업 유형 |
| `requested_paths` | `list[str]` | 사용자 지정 또는 계획으로 선택된 경로 |
| `allowed_paths` | `list[str]` | 현재 실행에서 점검 가능한 경로 |
| `repo_snapshot` | `dict[str, str]` | 경로 기반 in-memory 파일 모음 |
| `context_items` | `list[dict]` | 파일 스니펫·메타·Git 상태·이슈 텍스트·MCP 결과 |
| `plan` | `list[dict]` | 목적/도구/인자/리스크 포함 실행 계획 |
| `tool_requests` | `list[dict]` | 플래너가 제안한 정규화 tool 호출 |
| `tool_results` | `list[dict]` | 실행된 안전 도구의 상태/출력 |
| `blocked_actions` | `list[dict]` | 정책상 거부/보류된 요청 |
| `requires_human_review` | `bool` | 쓰기/커밋/PR/파괴/외부효과 시 중단 여부 |
| `review_reason` | `str \| None` | 리뷰 필요 사유 |
| `action_log` | `list[dict]` | 분류→컨텍스트 선택→정책 결정→실행→합성의 추적 |
| `status` | `Literal["ok", "needs_review", "failed"]` | 최종 상태 |
| `final_output` | `str \| None` | 개발자용 최종 텍스트 |
| `metadata` | `dict` | 모델명/fixture명/벤치마크 ID/시간/정책 버전 |

## 노드

| 노드 | 책임 |
| --- | --- |
| `prepare_task` | 입력 정규화, 리스트 초기화, 저장소 픽스처 로드 |
| `classify_task` | 요청을 Q&A/문서/리팩터 계획/명령 도움/테스트/코드변경/지원불가로 분류 |
| `select_context` | 제한된 파일/Git/이슈/MCP 중 필요한 항목 선택 |
| `collect_context` | 허용 in-memory 파일/메타를 `context_items`로 수집, 경로 오류 거부 |
| `plan_cli_actions` | 작업 유형·컨텍스트 기반으로 소규모 계획과 tool 요청 생성 |
| `policy_gate` | 경로, 명령 리스크, 쓰기 의도, Git, 외부효과, 도구 가용성 검사 |
| `execute_safe_actions` | 읽기/결정론적 도구만 실행: 요약, 검색, 명령 설명, 테스트 시뮬, Git 상태 |
| `request_human_review` | 파일 수정/커밋/PR/외부 API 호출/고위험 셸의 경우 중단 후 리뷰 반환 |
| `synthesize_cli_response` | 컨텍스트/결과/차단 내용을 바탕으로 터미널형 답변 생성 |
| `handle_failure` | 빈 입력, 미지원 작업, 컨텍스트 누락, 잘못된 도구, 조치 불가 위반 시 실패 종료 |

## 엣지

```text
START -> prepare_task -> classify_task -> select_context -> collect_context -> plan_cli_actions -> policy_gate

policy_gate -> execute_safe_actions -> synthesize_cli_response -> END
policy_gate -> request_human_review -> END
policy_gate -> handle_failure -> END

collect_context -> handle_failure -> END
plan_cli_actions -> handle_failure -> END
```

조건부 엣지 요구사항:

- 지원 작업은 정상 경로.
- 지원 불가/고위험은 안전한 리뷰 계획이 가능하지 않으면 `handle_failure`.
- `collect_context`에서 필수 경로 누락/허용 밖 경로/픽스처 부재 시 `handle_failure`.
- `policy_gate`는 모든 제안이 읽기 전용·결정론적·허용 시에만 실행 경로.
- 쓰기, 커밋, PR, 배포, credential, 광범위 셸, 네트워크, 사이드이펙트 MCP는 `request_human_review`.
- 정책 실패나 형식 불량·비가용 도구는 `handle_failure`.
- 성공한 안전 동작은 전체 `action_log`를 보존해 응답.

## 입력 및 출력

- 입력: 자연어 CLI 요청과 선택적 `repo_snapshot`. 예) `"DB 설정은 어디인지?"`, `"src/utils.py 문서 생성"`, `"log4j를 slf4j로 리팩터링 계획만 제안해줘"`.
- 출력: `final_output`, `status`, `task_type`, `plan`, `tool_results`, `blocked_actions`, `requires_human_review`.
- 중간 산출물: 정규화 요청, 선택 경로, 읽은 컨텍스트 스니펫, tool 요청, 정책 결정, 안전 실행 결과, 리뷰 사유, audit log.

성공 출력 예시:

```json
{
  "status": "ok",
  "task_type": "repo_qna",
  "final_output": "Database configuration is defined in src/config.py. The relevant environment variables are DATABASE_URL and DB_POOL_SIZE. Suggested verification command: pytest tests/test_config.py.",
  "plan": [
    {"tool": "read_file", "arguments": {"path": "src/config.py"}, "risk": "read_only"},
    {"tool": "suggest_command", "arguments": {"command": "pytest tests/test_config.py"}, "risk": "read_only"}
  ],
  "tool_results": [
    {"tool": "read_file", "status": "ok", "path": "src/config.py"}
  ],
  "blocked_actions": [],
  "requires_human_review": false
}
```

리뷰 필요 예시:

```json
{
  "status": "needs_review",
  "task_type": "code_change",
  "requires_human_review": true,
  "review_reason": "The plan includes file writes and a Git commit.",
  "blocked_actions": [
    {"tool": "write_file", "path": "src/auth.py", "reason": "writes require approval"},
    {"tool": "git_commit", "reason": "Git commits require approval"}
  ]
}
```

## 실패 사례

- 빈 입력은 `prepare_task`에서 중단.
- 허용 경로 밖 접근은 `blocked_actions`로 차단.
- 누락 파일은 컨텍스트 부재를 명확히 하는 부분 실패 또는 실패 처리.
- 라이브 배포·credential 추출 같은 미지원 요청은 셸 텍스트로 전환하지 않는다.
- 파괴적 셸, 광범위 변경, 커밋/PR/패키지 배포/클라우드 변경/외부 부작용은 인간 리뷰로 이동.
- 모델 텍스트 기반 임의 셸 실행 금지. 도움 요청은 텍스트 제안만.
- MCP는 스키마 검증과 외부 변형 작업 시 기본 리뷰 경로.
- 대규모 컨텍스트 요청은 `allowed_paths`/파일수/문자수로 제한.
- 결과는 사용한 컨텍스트 경로와 도구 결과에 근거해야 하며, 부재 시 추측 금지.
- 반복 거절 후 무한 루프 금지: 실패/리뷰로 종료.

## 테스트 아이디어

- 허용된 fixture 파일 기반 repo Q&A 정상 흐름.
- 문서 생성 요청이 제안 텍스트는 만들되 자동 파일 쓰기 하지 않음.
- 리팩터링 계획 요청이 다중 파일 근거를 반영하고 쓰기는 needs_review로 이동.
- 명령 도움 요청이 텍스트 제안만 반환하고 실행하지 않음.
- 테스트 워크플로가 결정론적 시뮬레이터를 사용해 결과 기록.
- 허용되지 않은 경로는 `context_items` 미포함 확인.
- 누락 파일 시 부분 성공 또는 실패 메시지의 명확성.
- 쓰기/Git 커밋/PR/배포/API는 리뷰 경로.
- action_log에 분류/선택/정책/실행 순서를 모두 기록.
- 네트워크 없이 벤치마크 fixture로 최종 상태·리뷰 플래그·호출 기대치 검증.

## 열린 질문

- TOC와 추출 라벨 간 페이지 불일치: 논리 `378-382` vs 추출 `399-403`.
- Appendix E가 F와 건너뛰어 추출되므로, 실제 추출 경계는 다음 제목 기반으로 판단.
- 실제 CLI 제품 기능은 시점에 따라 변할 수 있어, 본 구현은 부록에서 제시된 안정적 패턴만 사용한다.
- Runnable 그래프에서 가상 도구만 노출할지, 명시적 승인 후 로컬 실 도구 어댑터까지 제공할지는 구현 결정.
