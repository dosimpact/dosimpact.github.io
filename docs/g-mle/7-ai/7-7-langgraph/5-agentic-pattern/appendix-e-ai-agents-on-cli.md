---
sidebar_position: 105
---

# Appendix E: AI Agents on the CLI (en)

## Pattern Summary

AI Agents on the CLI turn the developer terminal from a command executor into a context-aware workspace where natural-language requests can inspect files, plan changes, run shell commands, edit code, use Git, call MCP tools, and produce reviewable development artifacts. Appendix E surveys Claude CLI, Gemini CLI, Aider, GitHub Copilot CLI, and Terminal-Bench as examples of this emerging workflow.

For implementation, the useful pattern is not to clone any one vendor tool. The LangGraph example should model the common control loop behind CLI agents: receive a developer task, gather bounded repository context, classify the requested operation, build a plan, select safe local tools, require review for risky actions, execute approved read-only or deterministic actions, summarize the result, and preserve an auditable trace. The graph should demonstrate how CLI agents become useful by combining natural-language intent, codebase context, tool execution, sandboxing, Git awareness, and human review.

## Pattern Explanation

### Conceptual Overview

A CLI agent is an AI assistant that operates where developers already work: the terminal and the local repository. Instead of asking the developer to remember every command or manually coordinate edits across files, the agent accepts a high-level request, reads relevant project context, decides which operations are needed, and performs or proposes those operations through tools.

Appendix E frames these agents as more than command generators. Claude CLI emphasizes architectural understanding and conversational planning; Gemini CLI emphasizes broad tool access, large context, multimodal input, and a reason-act loop; Aider emphasizes direct file editing, tests, and Git commits; GitHub Copilot CLI emphasizes GitHub-native issue and pull-request workflows; Terminal-Bench evaluates whether agents can complete realistic command-line tasks.

### Problem

Modern development tasks often span many files, tools, and feedback loops. A developer may need to understand a repository, update code, run tests, manage Git state, integrate APIs, generate documentation, or answer project-specific questions. Plain shell commands are precise but low-level, and ordinary chatbots lack direct, governed access to the working tree. CLI agents solve this by connecting natural-language intent to bounded local actions while keeping the developer in control of context, execution, and review.

### When to Use

- Use this pattern when a task requires repository-aware assistance, such as codebase Q&A, documentation generation, refactoring plans, bug triage, or test-driven changes.
- Use it when the workflow benefits from a terminal-native loop of plan, inspect, act, verify, and summarize.
- Use it when the agent needs local tools such as file readers, shell commands, test runners, Git inspection, or MCP-provided enterprise tools.
- Use it when a human developer should remain the final reviewer for edits, commits, pull requests, or operational commands.
- Use it to evaluate agent behavior on command-line tasks using deterministic fixtures inspired by Terminal-Bench.

### When Not to Use

- Avoid this pattern for simple one-shot answers that do not need repository context or tool execution.
- Avoid autonomous writes, commits, deployments, credential access, or destructive shell commands without explicit approval.
- Avoid giving the model unrestricted filesystem, shell, network, or Git access.
- Avoid broad repository ingestion when a smaller, declared context set is enough.
- Avoid treating vendor-specific CLI behavior as a stable contract; the implementation should model the pattern, not depend on a live external coding assistant.

### How It Works

1. The developer submits a natural-language CLI task, optionally with file paths, issue text, command output, or tool preferences.
2. The graph normalizes the task and classifies it as repository Q&A, documentation, planning, code-change proposal, command help, test workflow, or unsupported/high-risk action.
3. A context collector reads only allowed files or simulated repository metadata needed for the task.
4. A planner creates a short action plan and selects candidate tools such as file read, search, command suggestion, test simulation, Git status, or MCP lookup.
5. A policy gate validates tool requests against allowlists, command risk rules, path limits, and approval requirements.
6. Safe read-only or deterministic actions run automatically; risky write, shell, Git, or external actions stop for human review.
7. The graph synthesizes a terminal-friendly result containing the answer, proposed commands or edits, execution trace, review flags, and next action.

### Trade-offs

| Benefit | Cost or Risk |
| --- | --- |
| Brings AI assistance into the developer's normal terminal workflow. | Incorrect tool use can damage files, leak secrets, or run unsafe commands if not governed. |
| Uses repository context to answer or plan more accurately than a context-free chatbot. | Context collection can be expensive, incomplete, or privacy-sensitive. |
| Supports multi-step development loops such as inspect, edit, test, and commit. | Multi-step loops can become opaque without trace logging and clear stop conditions. |
| Can integrate specialized tools through MCP or local command adapters. | Each tool adds schema, permission, error-handling, and sandboxing requirements. |
| Produces auditable artifacts such as plans, command suggestions, diffs, and test results. | Human review remains necessary for code changes, commits, pull requests, and operational effects. |

### Minimal Example

```text
User: "Explain where database configuration lives and suggest a test command."

prepare_task -> classify as repository_qna
collect_context -> read allowed files: README.md, pyproject.toml, src/config.py
plan_actions -> choose file_summary and command_suggestion
policy_gate -> allow read-only actions
execute_safe_actions -> summarize relevant files
synthesize_response -> answer with file paths, confidence, and a suggested test command
```

### LangGraph Mapping

| Pattern Concept | LangGraph Element |
| --- | --- |
| Developer CLI request | State field `input` |
| Repository and terminal context | State fields `requested_paths`, `context_items`, and `repo_snapshot` |
| Task classification | Node `classify_task` and state field `task_type` |
| Agentic plan | Node `plan_cli_actions` and state field `plan` |
| CLI/file/Git/MCP tool selection | State field `tool_requests` |
| Sandboxing and permission checks | Node `policy_gate` |
| Safe terminal or repository action | Node `execute_safe_actions` |
| Human review boundary | Node `request_human_review` |
| Result synthesis | Node `synthesize_cli_response` |
| Audit trail | State field `action_log` |

## LangGraph Implementation Goal

Build a LangGraph example named `cli_agent_assistant` that simulates a governed AI CLI agent for repository-aware development tasks. The graph should accept a developer request and a small in-memory repository fixture, then return a terminal-style answer, plan, safe command suggestions, and review flags.

The first implementation should not call real vendor CLIs, modify real files, run arbitrary shell commands, or open network connections. It should use deterministic local fixtures and fake tool handlers so tests can verify the core agent pattern safely. The example should demonstrate the Appendix E themes:

- context-aware repository understanding,
- multi-step planning before action,
- tool-mediated file, shell, Git, or MCP-style operations,
- sandbox and approval boundaries,
- human review for writes, commits, pull requests, and risky commands,
- benchmark-style task outcomes suitable for Terminal-Bench-inspired tests.

## State Shape

List the state fields the graph needs.

| Field | Type | Purpose |
| --- | --- | --- |
| `input` | `str` | Original developer request entered in the CLI. |
| `normalized_input` | `str` | Trimmed and normalized request used for classification and planning. |
| `task_type` | `Literal["repo_qna", "doc_generation", "refactor_plan", "command_help", "test_workflow", "code_change", "unsupported"] \| None` | Classified CLI-agent task category. |
| `requested_paths` | `list[str]` | Paths explicitly named by the user or selected by context planning. |
| `allowed_paths` | `list[str]` | Repository paths the graph may inspect in the current run. |
| `repo_snapshot` | `dict[str, str]` | Deterministic in-memory repository fixture keyed by path. |
| `context_items` | `list[dict]` | Retrieved file snippets, metadata, Git status, issue text, or simulated MCP results. |
| `plan` | `list[dict]` | Ordered action plan with purpose, tool name, arguments, and risk level. |
| `tool_requests` | `list[dict]` | Normalized tool calls proposed by the planner. |
| `tool_results` | `list[dict]` | Results from executed safe tools, including status and output. |
| `blocked_actions` | `list[dict]` | Tool requests denied or paused by policy. |
| `requires_human_review` | `bool` | Whether the graph must stop before writes, commits, pull requests, destructive commands, or external side effects. |
| `review_reason` | `str \| None` | Explanation for why human review is required. |
| `action_log` | `list[dict]` | Audit trail of classification, context selection, policy decisions, tool execution, and synthesis. |
| `status` | `Literal["ok", "needs_review", "failed"]` | Final workflow status. |
| `final_output` | `str \| None` | Terminal-friendly answer for the developer. |
| `metadata` | `dict` | Optional model name, fixture name, benchmark task ID, timing, or policy version. |

## Nodes

| Node | Responsibility |
| --- | --- |
| `prepare_task` | Validate non-empty input, normalize whitespace, initialize list fields, and load the repository fixture or supplied `repo_snapshot`. |
| `classify_task` | Categorize the request into repository Q&A, documentation, refactor planning, command help, test workflow, code change, or unsupported. |
| `select_context` | Choose bounded files, Git metadata, issue text, or simulated MCP records needed for the request. |
| `collect_context` | Read allowed in-memory files and metadata into `context_items`; reject missing or disallowed paths. |
| `plan_cli_actions` | Produce a small ordered plan and proposed tool requests based on the task type and collected context. |
| `policy_gate` | Validate paths, command risk, write intent, Git operations, external side effects, and tool availability. |
| `execute_safe_actions` | Execute only approved read-only or deterministic tools, such as file summary, repository search, command explanation, test simulation, or Git status simulation. |
| `request_human_review` | Stop and return a reviewable plan when an action would edit files, commit changes, create a pull request, call external APIs, or run risky shell commands. |
| `synthesize_cli_response` | Create the final terminal-style response grounded in context, tool results, and blocked actions. |
| `handle_failure` | End with a controlled failure for blank input, unsupported tasks, missing context, invalid tool requests, or policy violations that cannot be reviewed safely. |

## Edges

Describe the graph flow, including conditional branches.

```text
START -> prepare_task -> classify_task -> select_context -> collect_context -> plan_cli_actions -> policy_gate

policy_gate -> execute_safe_actions -> synthesize_cli_response -> END
policy_gate -> request_human_review -> END
policy_gate -> handle_failure -> END

collect_context -> handle_failure -> END
plan_cli_actions -> handle_failure -> END
```

Conditional edge requirements:

- Route from `classify_task` through the normal flow for supported task types.
- Route unsupported or ambiguous high-risk requests to `handle_failure` unless a reviewable safe plan can be produced.
- Route from `collect_context` to `handle_failure` when required context is missing, paths are outside `allowed_paths`, or the repository fixture is unavailable.
- Route from `policy_gate` to `execute_safe_actions` only when all proposed actions are read-only, deterministic, and allowed.
- Route from `policy_gate` to `request_human_review` when actions include file writes, commits, pull requests, deployments, credential access, broad shell execution, network calls, or MCP tools with side effects.
- Route from `policy_gate` to `handle_failure` for tool requests that are malformed, unavailable, or unsafe without a meaningful human-review path.
- Route successful safe actions to `synthesize_cli_response`, preserving the full `action_log`.

## Inputs and Outputs

- Input: a developer's natural-language CLI request plus an optional deterministic `repo_snapshot`, such as `"Where is database configuration defined?"`, `"Generate documentation for src/utils.py"`, or `"Plan a refactor from log4j to slf4j without editing files."`
- Output: `final_output`, `status`, `task_type`, `plan`, `tool_results`, `blocked_actions`, and `requires_human_review`.
- Intermediate artifacts:
  - normalized request,
  - selected paths,
  - retrieved context snippets,
  - proposed tool requests,
  - policy decisions,
  - safe tool results,
  - review reason,
  - audit log.

Example successful output shape:

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

Example review output shape:

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

## Failure Cases

Document expected failures, retries, fallback behavior, and human-review points.

- Blank input should fail in `prepare_task` before context selection or tool planning.
- Requests to inspect paths outside `allowed_paths` should be denied and recorded in `blocked_actions`.
- Missing files in the repository fixture should produce a controlled failure or partial answer that names the missing context.
- Unsupported tasks, such as live deployment or credential extraction, should not be converted into shell commands.
- Destructive shell commands, broad filesystem rewrites, commits, pull requests, package publishing, cloud mutations, and external side effects should route to `request_human_review`.
- The graph should never execute arbitrary shell text generated by the model. Command-help tasks should return suggested commands as text unless an allowlisted deterministic simulator handles them.
- MCP-style tools should require explicit schema validation and should default to review when they access private APIs or mutate external systems.
- Large context requests should be bounded by `allowed_paths`, file count, and character limits.
- Final answers should cite the context paths or tool results they are based on; if the context was unavailable, the graph should say so instead of inventing repository details.
- The action loop should be bounded; if planning repeatedly proposes denied actions, return `failed` or `needs_review` rather than retrying indefinitely.

## Test Ideas

- Verify a repository Q&A happy path that reads an allowed fixture file and returns a grounded answer with file paths.
- Verify a documentation-generation request that produces proposed documentation text but does not write files automatically.
- Verify a refactor-planning request that creates a plan from multiple allowed files and routes writes to `needs_review`.
- Verify a command-help request returns a suggested command as text without executing arbitrary shell.
- Verify a test-workflow request uses a deterministic test simulator and records the simulated result.
- Verify a disallowed path is blocked and does not appear in `context_items`.
- Verify a missing file produces a controlled failure or partial answer with a clear missing-context message.
- Verify write, Git commit, pull request, deployment, and external API actions all route to `request_human_review`.
- Verify `action_log` records classification, context selection, policy decisions, and tool execution in order.
- Verify benchmark-style fixtures can assert final status, required review flags, and expected tool calls without network access.

## Open Questions

- The TOC lists Appendix E as logical pages `378-382`, but `pypdf` page labels and file pages identify the extracted span as `399-403`, with the visible Appendix E heading at PDF zero-based index `398`.
- The physical extraction jumps from Appendix E on file pages `399-403` to Appendix G on file page `404`, even though the TOC lists Appendix F between them. This requirement uses the visible Appendix E heading and the next visible appendix heading as the extraction boundary.
- Appendix E discusses real CLI agents whose capabilities may change over time. This requirement intentionally models the stable pattern from the PDF rather than depending on current behavior of Claude CLI, Gemini CLI, Aider, GitHub Copilot CLI, or Terminal-Bench.
- Decide during implementation whether the runnable graph should expose only simulated tools or also optional adapters for real local commands behind explicit approval.
