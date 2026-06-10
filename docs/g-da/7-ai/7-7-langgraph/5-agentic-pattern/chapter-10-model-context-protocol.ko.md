---
sidebar_position: 10
---

# 요구사항: Chapter 10: Model Context Protocol (MCP)

## 출처

- PDF: `Agentic_Design_Patterns.pdf`
- 섹션: `Chapter 10: Model Context Protocol`
- 페이지 범위: `docs/agentic-design-patterns-toc.md` 기준 `154-169` 논리 페이지
- 추출 참고: 보이는 Chapter 10 제목은 PDF 페이지 라벨 `167`(1 기반 파일 페이지 `167`, 0 기반 인덱스 `166`)에서 발견되었고, Chapter 11은 PDF 페이지 라벨 `183`(1 기반 `183`, 0 기반 `182`)에서 시작합니다. 추출 Chapter 10 범위는 PDF 인덱스 `166-181`, 파일 페이지 `167-182`, chapter-local `1-16`입니다. TOC 범위 `154-169`와 길이는 같으나 라벨이 다릅니다.

## 패턴 요약

Model Context Protocol(MCP)은 에이전트 애플리케이션이 외부 리소스, 프롬프트, 도구를 표준 방식으로 탐색하고 사용하는 기반을 제공합니다. 모든 LLM 앱을 각 API에 직접 붙이는 방식 대신, MCP 클라이언트가 MCP 서버를 발견하고 표준 요청을 보내며 표준 응답을 받아 다시 에이전트 컨텍스트에 넣는 방식입니다.

이 장에서는 MCP를 단순 함수 호출 이상으로 봅니다. 일반 함수 호출은 보통 제공자 종속적인 일대일 호출 메커니즘인 반면, MCP는 도구·데이터·앱·모델 간 상호운용 가능한 동적 통합을 위한 클라이언트-서버 프로토콜입니다.

구현에서는 MCP를 LangGraph 워크플로 내 오케스트레이션 경계로 보여야 합니다. 즉, 서버 능력 탐색 → 자원/프롬프트/도구 필요 판단 → 노출 인터페이스의 안전성·에이전트 적합성 검증 → MCP 클라이언트 어댑터 실행 → 실패/위험 동작을 폴백 또는 검토로 라우팅 합니다.

## 패턴 설명

### 개념 개요

MCP는 에이전트와 외부 시스템 사이의 공통 연결 계층입니다. 에이전트는 데이터베이스, 파일 서버, 미디어 서비스, 내부 API마다 맞춤 코드를 만들 필요가 없습니다. MCP 서버가 제공하는 기능을 조회한 뒤, 필요 기능을 골라 표준 인터페이스로 호출하고, 반환된 결과를 다음 추론 단계의 새 컨텍스트로 사용합니다.

MCP가 모든 문제를 해결해 주는 건 아닙니다. 인터페이스는 표준화되지만, 실제 API 출력이 구조화되어 있어야 에이전트가 유효하게 사용할 수 있습니다. 불투명 파일/레코드/잘못된 스키마는 MCP 준수라도 실제로는 쓸모가 적습니다.

### 문제

에이전트는 최신 데이터 조회, 외부 소프트웨어 조작, 작업 실행이 필요합니다. 공용 프로토콜이 없다면 기능마다 개별 통합 코드가 생기고 LLM 제공자/호스트/함수 집합에 강하게 묶입니다. 결과적으로 재사용성, 테스트성, 확장성, 기능 변경 대응이 어렵습니다.

MCP는 에이전트 호스트에서 외부 기능 제공자를 분리합니다. 서버는 리소스/프롬프트/도구를 표준 계약으로 공개하고, 클라이언트가 이를 발견·호출하며, 에이전트는 응답 또는 실행 결과를 바탕으로 다음 판단을 합니다.

### 사용 시점

- 외부 시스템, 도구, API, DB, 파일에 에이전트가 접근해야 할 때 사용합니다.
- 여러 에이전트/호스트/LLM 제공자에서 동일 도구 사용성이 필요할 때 사용합니다.
- 고정 함수 목록보다 동적 capability discovery가 필요할 때 사용합니다.
- 로컬/원격 서비스가 리소스·프롬프트·도구를 예측 가능한 경계로 노출해야 할 때 사용합니다.
- 공통 통합 계층으로 문서 저장소, DB, 메일, 미디어 생성, 내부 서비스 등을 공유하려는 경우 사용합니다.
- 워크플로 중 여러 외부 능력을 조합해야 하는 멀티스텝 작업에서 사용합니다.

### 사용하지 말아야 할 때

- 두세 개의 고정 함수면 충분한 단순 애플리케이션은 MCP가 과도할 수 있습니다.
- 필터링, 정렬, 안정 스키마, 에이전트 가독 출력이 없는 레거시 API를 무비판으로 MCP에 감싸지 마세요.
- 인증/인가/권한 범위가 정리되지 않은 상태에서 MCP를 노출하면 안 됩니다.
- MCP 응답이 raw PDF/바이너리만 주고 텍스트 추출 계층이 없으면 사용이 어렵습니다.
- 결정론적 비즈니스 로직이 필수인 곳에서 동적 기능 선택은 부적합할 수 있습니다.
- 민감 데이터가 관여하는 원격 MCP는 전송 보안, 자격 증명, 감사 로그, 테넌시 경계가 명확할 때만 사용해야 합니다.

### 작동 방식

1. MCP 서버는 도메인별로 리소스, 프롬프트, 도구를 노출합니다(파일시스템, DB, 미디어 서비스, 내부 API 등).
2. 에이전트 호스트의 MCP 클라이언트가 STDIO(로컬) 또는 HTTP/SSE(원격) 전송으로 서버에 연결합니다.
3. 클라이언트는 매니페스트를 조회해 기능명, 설명, 스키마, 접근 제약을 저장합니다.
4. LLM/그래프 계획기준으로 현재 요청이 외부 자원, 재사용 프롬프트, 실행 도구가 필요한지 판단합니다.
5. 호출 전 capability, 파라미터, 권한, 데이터 형태를 검증합니다.
6. MCP 클라이언트가 표준 요청을 서버로 전송합니다.
7. 서버는 인증/검증 후 리소스 읽기, 프롬프트 적용, 도구 실행을 수행해 결과를 반환합니다.
8. 표준화된 응답(결과 또는 에러 메타 포함)을 수신합니다.
9. 그래프는 응답을 상태에 반영하고 다음 응답 생성, 복구 호출, 또는 다른 capability 선택을 진행합니다. 안전하지 않거나 미승인 동작은 검토로 이동합니다.

### 트레이드오프

| 이점 | 비용 또는 위험 |
| --- | --- |
| 도구·데이터·애플리케이션 간 LLM-시스템 통신을 표준화합니다. | 프로토콜, 전송, 라이프사이클 복잡도 증가. |
| 단발성 통합 대신 재사용 가능한 MCP 서버를 제공합니다. | 스키마 설계가 잘못되면 여전히 에이전트가 사용하기 어렵습니다. |
| 사용 가능한 새 기능의 동적 탐색을 지원합니다. | 동적 가용성은 검증 및 테스트 커버를 요구합니다. |
| 에이전트 호스트 코드를 하위 서비스에서 분리합니다. | 인증, 권한, 감사 로그가 필수 설계 고려사항이 됩니다. |
| 함수 호출뿐 아니라 리소스/프롬프트/도구를 모두 다룹니다. | 불투명하거나 비구조적 출력은 추론 품질을 낮춥니다. |
| 로컬/원격/온디맨드/배치 시나리오를 지원합니다. | 전송 실패, 가용성 이슈, timeout을 위한 라우팅 필요. |

### 최소 예시

```text
사용자: "현재 높은 우선순위로 열려 있는 지원 티켓을 요약해줘."

그래프:
  -> MCP 서버 탐색
  -> search_tickets/read_ticket 리소스가 있는 티켓팅 서버 선택
  -> search_tickets가 priority/status 필터를 지원하는지 검증
  -> search_tickets(priority="high", status="open") 호출
  -> 결과가 구조화되고 제한된 형태면 요약
  -> 필터 부족/불명확 데이터면 더 안전한 질의 요청 또는 검토 경로
```

### LangGraph 매핑

| 패턴 개념 | LangGraph 요소 |
| --- | --- |
| 외부 컨텍스트 또는 동작이 필요한 사용자 요청 | `input`, `intent`, `operation_type` 상태 필드 |
| MCP 클라이언트 | discovery/invocation 노드에서 쓰는 주입형 `mcp_client` |
| MCP 서버 매니페스트 | `capability_manifest` 상태 필드 |
| 리소스/프롬프트/도구 | `selected_capability`의 `capability_type` |
| 동적 탐색 | `discover_capabilities` 노드 |
| capability 선택 | `select_capability` 노드 |
| 에이전트 친화 API 검사 | `validate_capability`와 검토/폴백 조건부 간선 |
| 표준화 요청 | `build_mcp_request`에서 생성한 `mcp_request` |
| 서버 실행 결과 | `invoke_mcp_capability`가 만든 `mcp_result` |
| 오류 처리 | 탐색/검증/실행 뒤 조건부 라우팅 |
| 최종 응답 반영 | `integrate_result`와 `context_update` |

## LangGraph 구현 목표

MCP-aware 운영 조력자 예제를 구성합니다. 사용자 요청이 외부 맥락/동작이 필요한 작업(폴더 목록 조회, 텍스트 파일 읽기, 모의 티켓 DB 조회, 샘플 MCP 도구로 메시지 발송 테스트)을 지정할 수 있어야 합니다.

그래프는 직접적인 도구 하드코딩 호출 대신 MCP 클라이언트 어댑터를 주입해 사용해야 합니다. 테스트에서는 적대적 케이스까지 다루는 결정론적 가짜 어댑터가 MCP-like 매니페스트/리소스/도구 결과/오류를 반환해야 합니다. 추후 실제 운영에서는 로컬 STDIO MCP, HTTP FastMCP, 커뮤니티 서버로 확장할 수 있으나, 최초 구현은 오프라인에서 결정론적으로 동작해야 합니다.

예상 동작:

- 그래프는 먼저 사용 가능한 MCP capability를 탐색해야 합니다.
- 리소스/프롬프트/도구를 구분해야 합니다.
- 선택한 capability가 허용 여부·필수 파라미터·에이전트 가독성을 충족하는지 검증해야 합니다.
- MCP 클라이언트 어댑터로 실제 실행해 결과를 최종 응답에 통합해야 합니다.
- 탐색 실패, 서버 미가용, 파라미터 미비, 비인가 동작, 불투명 출력, 실행 오류를 은폐하지 말고 노출해야 합니다.

## 상태 형태

그래프가 필요한 상태 필드를 나열합니다.

| 필드 | 타입 | 목적 |
| --- | --- | --- |
| `input` | `str` | 원본 사용자 요청/작업 설명. |
| `intent` | `str \| None` | 해석된 사용자 의도(`read_resource`, `execute_tool`, `use_prompt`, `answer_without_mcp`). |
| `operation_type` | `str \| None` | 요청된 MCP 분류: `resource`, `tool`, `prompt`, `none`. |
| `server_preferences` | `list[str]` | 사용자/구성에서 전달된 우선순위 서버명 목록(선택). |
| `capability_manifest` | `dict[str, Any]` | 탐색한 MCP 서버 및 capability(설명·스키마·제약) 목록. |
| `candidate_capabilities` | `list[dict]` | 요청을 충족할 수 있는 후보 capability 목록. |
| `selected_capability` | `dict[str, Any] \| None` | 선택된 MCP capability(서버, 이름, 타입, 스키마, 선택 이유). |
| `capability_validation` | `dict[str, Any]` | 허용 여부, 필수 인수, 스키마 정합성, 출력 가독성, 위험 플래그를 포함한 검증 결과. |
| `mcp_request` | `dict[str, Any] \| None` | 표준화된 MCP 요청 페이로드. |
| `mcp_result` | `dict[str, Any] \| None` | MCP 클라이언트 어댑터의 표준 응답/오류. |
| `context_update` | `dict[str, Any] \| None` | MCP 결과에서 추출한 텍스트/레코드/확인 메타데이터 등 모델 입력용 컨텍스트. |
| `fallback_reason` | `str \| None` | MCP가 스킵/실패/회피된 이유. |
| `needs_human_review` | `bool` | 사람 승인 또는 수동 처리 필요 여부. |
| `errors` | `list[str]` | 탐색, 검증, 전송, 인증, 실행, 파싱, 스키마 오류 목록. |
| `final_output` | `dict[str, Any] \| None` | 상태, 선택된 capability, MCP 결과 요약, 오류를 포함한 사용자 결과. |

## 노드

| 노드 | 책임 |
| --- | --- |
| `preprocess_request` | 입력 비어있음 검사, 텍스트 정규화, 기본 필드 초기화, MCP 필요 여부 판별. |
| `classify_intent` | 요청을 리소스 조회/도구 실행/프롬프트 사용/비MCP 응답으로 분류. |
| `discover_capabilities` | MCP 클라이언트 어댑터로 서버를 조회해 `capability_manifest` 구성. |
| `select_capability` | intent, 서버 설명, 스키마, 사용자 제약 기반으로 후보를 선택. |
| `validate_capability` | allowlist 정책, 필수 파라미터, 스키마 정합성, 출력 가독성, 리뷰 필요성 점검. |
| `build_mcp_request` | 요청/선택 capability를 구조화된 MCP payload로 변환. |
| `invoke_mcp_capability` | MCP 클라이언트 어댑터 호출 후 정상 결과 또는 구조화된 오류 수집. |
| `integrate_result` | MCP 출력에서 모델이 사용할 수 있는 컨텍스트로 변환하고, 불투명/과도한/비정상 출력을 감지. |
| `generate_final_response` | `input`, 선택 capability, 컨텍스트 업데이트, 오류를 반영해 최종 응답 생성. |
| `answer_without_mcp` | 외부 호출이 불필요하거나 안전하지 않으면 일반 응답 경로로 처리. |
| `mark_needs_review` | 고위험·미승인·모호한 동작을 사람 검토 상태로 중단. |

## 엣지

조건부 분기를 포함한 그래프 흐름을 정의합니다.

```text
START
  -> preprocess_request
  -> classify_intent

classify_intent -> answer_without_mcp -> generate_final_response -> END
classify_intent -> discover_capabilities -> select_capability -> validate_capability

validate_capability -> build_mcp_request -> invoke_mcp_capability -> integrate_result -> generate_final_response -> END
validate_capability -> answer_without_mcp -> generate_final_response -> END
validate_capability -> mark_needs_review -> generate_final_response -> END

invoke_mcp_capability -> select_capability
invoke_mcp_capability -> mark_needs_review -> generate_final_response -> END
integrate_result -> mark_needs_review -> generate_final_response -> END
```

조건부 엣지 요구사항:

- 요청이 외부 컨텍스트/동작이 필요 없으면 `classify_intent`에서 `answer_without_mcp`로 이동합니다.
- 서버 미설정이나 요청 충족 capability 없음이면 `discover_capabilities`에서 `answer_without_mcp`로 이동합니다.
- 후보가 약하거나 관련성이 낮으면 `select_capability`에서 `answer_without_mcp`로 이동합니다.
- `validate_capability`에서 허용·파라미터 완전성·출력 가독성이 모두 충족되면 `build_mcp_request`로 이동합니다.
- 파일 조작, 메시지 발송, 레코드 수정, 장치 제어, 금융 액션, 민감 데이터 접근 등 고위험이거나 승인 미입력일 때 `mark_needs_review`.
- harmless하지만 사용 불가(예: binary-only resource)인 경우 `answer_without_mcp`로 이동합니다.
- `invoke_mcp_capability`에서 복구 가능 실패 시 대체 후보가 있으면 `select_capability`로 돌아갑니다.
- 인증 실패, 인가 실패, 반복 전송 오류, 고위험 모호 실행에서는 `mark_needs_review`.
- `integrate_result`에서 형식 오류, 과도한 크기, 모순, 오염을 발견하면 `mark_needs_review`.

## 입력과 출력

- 입력: 자연어 요청, 서버 우선순위(선택), 설정된 MCP 클라이언트 어댑터(로컬/원격).
- 출력: `final_output`으로, 상태, 응답 텍스트, 선택 서버/케이스, 결과 요약, 폴백/검토 사유, 오류 정보를 포함.
- 중간 산출물: intent, operation_type, 매니페스트, 후보, 선택 capability, 검증 메타, MCP 요청, 원시 응답, context update, 오류, review flag.

예시 입력 형태:

```json
{
  "input": "List the files in the managed project folder.",
  "server_priority": ["filesystem"]
}
```

성공 출력 예시:

```json
{
  "status": "ok",
  "response": "The managed folder contains sample.txt and notes.md.",
  "selected_capability": {
    "server": "filesystem",
    "type": "tool",
    "name": "list_directory"
  },
  "mcp_result_summary": {
    "success": true,
    "item_count": 2
  },
  "errors": []
}
```

리뷰 출력 예시:

```json
{
  "status": "needs_review",
  "response": "I found a matching email-sending tool, but sending external messages requires approval before execution.",
  "selected_capability": {
    "server": "email",
    "type": "tool",
    "name": "send_email"
  },
  "fallback_reason": "high-impact action requires human approval",
  "errors": []
}
```

## 실패 사례

예상 실패, 재시도, 폴백 동작, 사람 검토 포인트를 문서화합니다.

- 빈 입력은 `preprocess_request`에서 MCP 탐색/모델 호출 없이 실패해야 합니다.
- MCP 서버가 없으면 graph가 크래시 없이 종료하고 without MCP 응답 또는 부재 안내를 제공합니다.
- 탐색 실패(서버 미가용, 전송 설정 오류, 매니페스트 손상)는 오류를 기록하고 안전 폴백만 있을 때 계속 진행합니다.
- 선택 capability가 무관/모호/필수 스키마 부재면 다른 후보 선택, 질문, 혹은 without MCP 처리로 분기합니다.
- 정렬/필터/페이지네이션/구조화 미지원 레거시 API는 과도하고 비신뢰 조회로 이어지므로 피해야 합니다.
- 텍스트가 아닌 raw PDF 등 불투명 자원은 텍스트 추출 능력이 없으면 사용 불가 처리합니다.
- 파라미터 불충분/불안전 시 임의 보정 금지, 명확화 요청 또는 검토 이동해야 합니다.
- 인증/인가 실패를 반복 재시도하지 말고 보안 오류로 노출해야 합니다.
- 작성/메일 전송/DB 업데이트/디바이스 제어/금융 액션 등은 명시 승인 또는 allowlist 없으면 허용 안 됨.
- 실행 timeout이나 구조화 오류 발생 시 안전한 후보를 한 번 더 시도할 수 있지만 무한 반복은 금지.
- MCP 결과가 너무 크면 `integrate_result`에서 요약/페이지 분할 또는 실패 처리해야 합니다.
- 응답 파싱 실패 또는 스키마 불일치는 신뢰 가능한 컨텍스트로 사용하지 않습니다.
- 로컬 STDIO/원격 HTTP 전송 모두 동일 어댑터 경계를 통해 테스트해 전송 차이를 격리해야 합니다.

## 테스트 아이디어

- 파일시스템형 서버를 탐색해 `list_directory`를 선택·호출하고 구조화된 최종 응답을 반환하는 정상 경로를 검증합니다.
- 텍스트 리소스를 발견해 agent-readable로 검증 후 통합되는 자원 조회 경로를 검증합니다.
- 재사용 가능한 프롬프트 템플릿을 감지하고 이를 도구 호출로 오해하지 않고 선택 경로를 검증합니다.
- MCP가 불필요한 요청에서는 즉시 직접 응답 경로가 선택되는지 검증합니다.
- 매니페스트 비어있을 때 no-server 라우팅 동작 검증.
- 잘못된 매니페스트 처리 시 오류 기록 후 무차별 호출 회피 검증.
- 파라미터 누락 시 값 생성 대신 정정/폴백/검토 이동하는지 검증.
- 권한/고위험 동작이 `mark_needs_review`로 이동하는지 검증.
- application/pdf 원문 텍스트 미지원 등 오답을 `integrate_result`에서 거부하는지 검증.
- 복구 가능한 실패에서 다른 후보 capability 재시도를 검증.
- 전송 실패 반복 시 무한 루프 없는 종료를 검증.
- 최종 상태가 `intent`, `capability_manifest`, `selected_capability`, `capability_validation`, `errors`, `final_output`을 모두 포함하는지 검증.
