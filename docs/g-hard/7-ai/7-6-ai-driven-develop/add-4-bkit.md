---
sidebar_position: 4
---

# bkit 분석  

- [bkit 분석](#bkit-분석)
  - [Install (devin)](#install-devin)
    - [mcp 서버 설정(local stdio mode)](#mcp-서버-설정local-stdio-mode)
  - [Skills (27)](#skills-27)
  - [MCP Tools (16)](#mcp-tools-16)
  - [Quick Start](#quick-start)
  - [Examples](#examples)
  - [PDCA as-is cycle](#pdca-as-is-cycle)
    - [Default Phase Flow](#default-phase-flow)
    - [Steps Each Phase](#steps-each-phase)


Notes
- bkit는 로컬 프로젝트에 설치되며 이는 전역 컨텍스트의 오염이 되지 않는다.  
 

## Install (devin)

### mcp 서버 설정(local stdio mode)  


.cognition/config.json 파일 생성 후 아래 내용 넣기  

```
{
  "mcpServers": {
    "bkit": {
      "command": "node",
      "args": ["./.bkit-codex/packages/mcp-server/index.js"]
    }
  }
}

```


## Skills (27)

| Skill | Category | Trigger Examples |
|-------|----------|-----------------|
| **pdca** | Core | `$pdca plan`, `$pdca design`, `$pdca analyze` |
| **plan-plus** | Core | "brainstorming plan", "deep planning", "intent discovery" |
| **bkit-rules** | Core | Core rules (auto-applied via AGENTS.md) |
| **bkit-templates** | Core | "plan template", "design template" |
| **starter** | Level | "static site", "portfolio", "beginner" |
| **dynamic** | Level | "login", "fullstack", "authentication" |
| **enterprise** | Level | "microservices", "k8s", "terraform" |
| **development-pipeline** | Pipeline | "where to start", "development order" |
| **phase-1-schema** | Pipeline | "schema", "data model", "terminology" |
| **phase-2-convention** | Pipeline | "coding rules", "conventions" |
| **phase-3-mockup** | Pipeline | "mockup", "wireframe", "prototype" |
| **phase-4-api** | Pipeline | "API design", "REST endpoints" |
| **phase-5-design-system** | Pipeline | "design system", "component library" |
| **phase-6-ui-integration** | Pipeline | "frontend integration", "API client" |
| **phase-7-seo-security** | Pipeline | "SEO", "security hardening" |
| **phase-8-review** | Pipeline | "architecture review", "gap analysis" |
| **phase-9-deployment** | Pipeline | "CI/CD", "production deployment" |
| **code-review** | Quality | "review code", "check quality" |
| **zero-script-qa** | Quality | "test logs", "QA without scripts" |
| **mobile-app** | Platform | "React Native", "Flutter", "iOS app" |
| **desktop-app** | Platform | "Electron", "Tauri", "desktop app" |
| **codex-learning** | Learning | "learn Codex", "Codex CLI setup" |
| **bkend-quickstart** | bkend.ai | "bkend setup", "first project" |
| **bkend-data** | bkend.ai | "table", "CRUD", "schema", "filter" |
| **bkend-auth** | bkend.ai | "signup", "login", "JWT", "session" |
| **bkend-storage** | bkend.ai | "file upload", "presigned URL", "CDN" |
| **bkend-cookbook** | bkend.ai | "tutorial", "example project", "todo app" |

## MCP Tools (16)

WHY : State Management Layer
- MCP Tools + Lib Modules
- PDCA status tracking, intent detection, template management, memory persistence, context recovery   

---

The MCP server provides 16 tools via JSON-RPC 2.0 over STDIO with **zero external dependencies**:

| Tool | Category | Purpose |
|------|----------|---------|
| `bkit_init` | Session | Initialize session, detect level, load PDCA status, compact summary |
| `bkit_analyze_prompt` | Intent | Detect language, match triggers, score ambiguity (8 languages) |
| `bkit_get_status` | PDCA | Retrieve current PDCA status with recommendations (supports recovery mode) |
| `bkit_pre_write_check` | PDCA | Pre-write compliance check (design document existence) |
| `bkit_post_write` | PDCA | Post-write guidance (gap analysis suggestions) |
| `bkit_complete_phase` | PDCA | Mark phase complete, validate transition, advance task chain |
| `bkit_pdca_plan` | Template | Generate plan document template with level-specific sections and task chain |
| `bkit_pdca_design` | Template | Generate design template (Starter/Dynamic/Enterprise variants) |
| `bkit_pdca_analyze` | Template | Generate gap analysis template |
| `bkit_pdca_next` | PDCA | Recommend next PDCA action based on current state |
| `bkit_classify_task` | Utility | Classify task size (quick_fix / minor_change / feature / major_feature) |
| `bkit_detect_level` | Utility | Detect project level from directory structure |
| `bkit_select_template` | Utility | Select template by phase and level |
| `bkit_check_deliverables` | Utility | Verify phase deliverables exist |
| `bkit_memory_read` | Memory | Read session memory |
| `bkit_memory_write` | Memory | Write session memory |

---


## Quick Start  

```
$pdca plan local-auth       # 1. 계획서 작성
$pdca design local-auth     # 2. 설계서 작성
$pdca do local-auth         # 3. 구현 (코드 작성)
$pdca analyze local-auth    # 4. 갭 분석
$pdca iterate local-auth    # 5. 갭 수정 (필요시 반복)
$pdca report local-auth     # 6. 완료 보고서
$pdca archive local-auth    # 7. 문서 보관
```


## Examples  
- eg, local-auth-demo  

## PDCA as-is cycle  

### Default Phase Flow

```
Plan -> Design -> Do -> Check(analyze) -> Act(iterate) -> Report -> Archive
  |                                          |
  |                                          v
  |                                    (if < 90%)
  |                                    iterate -> re-analyze
  |                                          |
  v                                          v
[Complete]                             (if >= 90%)
                                       Report -> Archive
```

### Steps Each Phase  

[Plan]
1. Verify plan exists (required prerequisite)
2. Call `bkit_pdca_design(feature, level)` MCP tool
3. Write template to `docs/02-design/features/{feature}.design.md`
4. Fill in: Architecture, Data Model, API Spec, Test Plan
5. Call `bkit_complete_phase(feature, "design")` when done


[Design]
1. Verify plan exists (required prerequisite)
2. Call `bkit_pdca_design(feature, level)` MCP tool
3. Write template to `docs/02-design/features/{feature}.design.md`
4. Fill in: Architecture, Data Model, API Spec, Test Plan
5. Call `bkit_complete_phase(feature, "design")` when done


[Do]
1. Verify design exists (required prerequisite)
2. Reference design document during implementation
3. Follow implementation order from design
4. Call `bkit_pre_write_check(filePath)` before each file write
5. Call `bkit_post_write(filePath, linesChanged)` after significant changes
6. Call `bkit_complete_phase(feature, "do")` when done


[Analyze]
1. Call `bkit_pdca_analyze(feature)` MCP tool
2. Read design document: `docs/02-design/features/{feature}.design.md`
3. Scan implementation code in relevant directories
4. Compare design items vs implemented items
5. Calculate Match Rate: `(implemented / total_design_items) * 100`
6. Write analysis to `docs/03-analysis/{feature}.analysis.md`


[Iterate]
1. Read gap list from analysis document
2. Fix identified gaps in code (prioritize "Missing in Code" items)
3. Re-run analysis: `$pdca analyze {feature}`
4. Repeat until matchRate >= 90% or max 5 iterations
5. Call `bkit_complete_phase(feature, "act")` when done


[Report]
1. Verify matchRate >= 90% (warn if below)
2. Gather data from plan, design, analysis documents
3. Generate completion report
4. Write to `docs/04-report/{feature}.report.md`
5. Include: completed items, quality metrics, learnings


[Archive]
1. Verify report completion (phase = "completed" or matchRate >= 90%)
2. Create `docs/archive/YYYY-MM/{feature}/` folder
3. Move documents from original locations
4. Update `.pdca-status.json`: phase = "archived"