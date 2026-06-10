---
sidebar_position: 107
---

# Appendix G: Coding Agents (en)

## Pattern Summary

Coding agents turn AI-assisted programming from one-off code generation into a human-led team workflow. Appendix G starts with "vibe coding" as a useful entry point for fast ideation, prototyping, and blank-page reduction, then argues that production software needs a more structured partnership. The developer remains the orchestrator, architect, and quality gate, while specialized AI coding agents handle focused tasks such as scaffolding, test creation, documentation, refactoring, and review.

The implementation-oriented pattern is a governed coding-agent team. A human supplies a complete task brief and curated context, the graph routes work to a specialist role, the specialist produces a bounded artifact, a process/reviewer agent critiques and reflects on the artifact, and the human-review boundary remains explicit. The LangGraph example should demonstrate context staging, role-specific prompts, direct model invocation through the shared model adapter, versioned prompt definitions, review loops, and optional Git-hook-style automation without letting agents autonomously commit or modify real files.

## Pattern Explanation

### Conceptual Overview

Appendix G frames coding agents as specialized collaborators in a human-led engineering workflow. Vibe coding is useful for getting from a vague idea to runnable code quickly, but the chapter treats that as only the starting point. Robust software requires deliberate context, role separation, critique, reflection, and final human judgment.

The core mental model is an augmented development team. The human developer defines the goal, curates context, chooses the right specialist, evaluates output, and owns architecture. The AI agents are force multipliers for tactical work: implementing, testing, documenting, optimizing, and reviewing.

### Problem

Raw AI code generation can produce plausible code quickly, but it often lacks project context, architectural alignment, test discipline, and long-term maintainability. A single prompt is also a poor fit for work that naturally involves multiple engineering roles.

This pattern solves the problem by making the coding workflow explicit. It separates context preparation, specialist execution, review, reflection, and human approval so AI assistance can be useful without surrendering control of the codebase.

### When to Use

- Use this pattern when a software task benefits from a role-specific coding assistant, such as implementation, tests, docs, refactoring, or code review.
- Use it when the developer can provide a curated task brief, relevant code, requirements, and style guidance.
- Use it when the output should be treated as a proposal that must pass review before being accepted.
- Use it when teams want reusable prompt roles stored as version-controlled assets.
- Use it when a local orchestrator can package transparent context for the model instead of relying on opaque retrieval.
- Use it when review automation, such as a pre-commit check, should produce advisory feedback without taking final control.

### When Not to Use

- Avoid this pattern for trivial deterministic edits where a simple script, formatter, or direct code change is enough.
- Avoid it when there is no reliable way to supply the project context needed for the agent to act safely.
- Avoid using agent output as authoritative code without tests, review, and domain validation.
- Avoid broad, automated context collection that sends secrets, unrelated files, or excessive code to a model.
- Avoid autonomous commits, deploys, destructive commands, or production changes without explicit human approval.
- Avoid treating a frontier model name or vendor-specific coding product as a stable implementation requirement.

### How It Works

1. The human developer creates a task brief that states the goal, constraints, acceptance criteria, relevant files, style rules, and expected artifact.
2. A context staging step assembles the task-specific materials, such as code snippets, API docs, pull request notes, or test philosophy.
3. The orchestrator classifies the task and chooses a specialist role: scaffolder, test engineer, documenter, optimizer, or process/reviewer.
4. The selected specialist receives a role-specific prompt and the staged context, then produces a bounded artifact such as code, tests, docs, a refactor proposal, or review findings.
5. A process agent reviews the artifact, critiques possible bugs or mismatches, reflects on its own critique, and prioritizes the most important feedback.
6. The graph either requests another specialist pass, asks for missing context, or packages a final reviewable result.
7. The human developer remains the final quality gate and decides whether to apply, revise, reject, or run further verification.

### Trade-offs

| Benefit | Cost or Risk |
| --- | --- |
| Speeds early ideation and routine engineering tasks. | Generated code can be shallow, brittle, or misaligned without review. |
| Separates specialist responsibilities so prompts and outputs are easier to reason about. | More roles add orchestration complexity and prompt maintenance. |
| Makes context preparation explicit and auditable. | Context staging takes discipline and can omit critical information. |
| Keeps architecture and final approval with the human developer. | Human review remains a throughput bottleneck for risky changes. |
| Version-controlled prompts let teams improve agent behavior over time. | Prompt libraries can drift from current engineering standards if not maintained. |
| Critique and reflection improve review quality before handoff. | Reviewer agents can miss subtle defects or over-prioritize low-value comments. |

### Minimal Example

```text
Input:
  Goal: add CSV import validation
  Context: brief, existing parser code, validation style guide, current tests
  Requested role: test_engineer

Flow:
  stage_context
  classify_task -> test_creation
  select_specialist -> test_engineer
  run_specialist_agent -> draft pytest cases
  run_process_review -> critique coverage and reflect on priorities
  decide_next_step -> final_human_review

Output:
  Proposed test file content
  Coverage notes
  Review summary
  Human approval required before applying changes
```

### LangGraph Mapping

| Pattern Concept | LangGraph Element |
| --- | --- |
| Human developer as orchestrator | State fields `input`, `human_brief`, and `approval_policy` |
| Context staging area | Node `stage_context` and state field `context_bundle` |
| Role-specific coding agent | Node `run_specialist_agent` and state fields `selected_role` and `role_prompt` |
| Scaffolder agent | `selected_role: "scaffolder"` with implementation artifact output |
| Test engineer agent | `selected_role: "test_engineer"` with test artifact output |
| Documenter agent | `selected_role: "documenter"` with documentation artifact output |
| Optimizer agent | `selected_role: "optimizer"` with refactor proposal output |
| Process/code supervisor agent | Node `run_process_review` with critique and reflection output |
| Iterative human-agent dialogue | Conditional edge from `decide_next_step` back to `request_clarification`, `stage_context`, or `run_specialist_agent` |
| Final human quality gate | Node `prepare_human_review` and state field `requires_human_approval` |
| Prompt library | State field `prompt_library` and node `load_role_prompt` |
| Git-hook-style automation | Optional input `trigger_source` and route to review-only mode |

## LangGraph Implementation Goal

Build a LangGraph example named `coding_agent_team` that models a human-led coding-agent workflow. The graph accepts a developer task, staged repository context, a prompt library, optional requested specialist role, and an approval policy. It selects the right specialist, produces a reviewable engineering artifact, runs critique-and-reflection review, and returns a structured package for human approval.

The example should not edit real files, run arbitrary shell commands, commit changes, deploy code, or call live vendor coding agents. It should use the repository's shared model pattern so tests can inject deterministic fake model responses. File and prompt inputs should be in-memory fixtures or explicitly supplied strings. The graph should demonstrate the Appendix G themes:

- vibe coding as useful early ideation, but not the final production workflow,
- human-led orchestration and architectural ownership,
- curated context as the main determinant of agent quality,
- role-specific prompts for specialist coding tasks,
- critique and reflection before final handoff,
- version-controlled prompt-library behavior,
- optional pre-commit-review mode that is advisory only,
- final human approval for any proposed code, test, documentation, or refactor artifact.

Expected workflow outcome:

- Blank or underspecified tasks request clarification instead of producing code.
- Implementation tasks route to the scaffolder role.
- Test tasks route to the test engineer role.
- Documentation tasks route to the documenter role.
- Performance or maintainability tasks route to the optimizer role.
- Review-only or Git-hook-triggered tasks route directly to the process/reviewer role.
- Every generated artifact is reviewed before final output.
- The final output contains proposed artifacts and review metadata, not applied filesystem changes.

## State Shape

List the state fields the graph needs.

| Field | Type | Purpose |
| --- | --- | --- |
| `input` | `str` | Original developer request. |
| `normalized_input` | `str` | Trimmed and normalized task text used for classification and prompts. |
| `human_brief` | `dict[str, Any]` | Structured task brief with goal, constraints, acceptance criteria, style rules, and expected artifact. |
| `requested_role` | `str \| None` | Optional human-selected specialist role. |
| `selected_role` | `str \| None` | Specialist role selected by the graph, such as `scaffolder`, `test_engineer`, `documenter`, `optimizer`, or `process_reviewer`. |
| `task_type` | `str \| None` | Classified task type, such as `ideation`, `implementation`, `test_creation`, `documentation`, `optimization`, `review`, or `unsupported`. |
| `trigger_source` | `str` | Source of invocation, such as `manual`, `pre_commit`, or `review_pipeline`. |
| `context_sources` | `list[dict[str, Any]]` | Supplied code snippets, docs, API references, PR descriptions, style guides, and test notes. |
| `context_bundle` | `dict[str, Any]` | Curated context package sent to the specialist role. |
| `context_warnings` | `list[str]` | Missing, excessive, ambiguous, or unsafe context issues. |
| `prompt_library` | `dict[str, str]` | Versioned role prompts keyed by specialist role. |
| `role_prompt` | `str \| None` | Prompt loaded for the selected specialist. |
| `model_config` | `dict[str, Any]` | Shared model settings and provider metadata used by the implementation adapter. |
| `specialist_artifact` | `dict[str, Any] \| None` | Proposed output from the specialist, such as code, tests, docs, refactor plan, or review findings. |
| `critique` | `dict[str, Any] \| None` | Initial process-agent review of the specialist artifact. |
| `reflection` | `dict[str, Any] \| None` | Prioritized summary produced after reflecting on the critique. |
| `iteration_count` | `int` | Number of specialist/review loops already attempted. |
| `max_iterations` | `int` | Configured cap for iterative dialogue. |
| `requires_human_approval` | `bool` | Whether the result must stop for human approval before any application. |
| `approval_policy` | `dict[str, Any]` | Rules for writes, commits, commands, secrets, external calls, and review-only triggers. |
| `blocked_actions` | `list[dict[str, Any]]` | Proposed actions blocked or paused by policy. |
| `action_log` | `list[dict[str, Any]]` | Audit trail of classification, context staging, prompt loading, model calls, review, and routing. |
| `status` | `str` | Final status such as `ok`, `needs_context`, `needs_review`, `unsupported`, or `failed`. |
| `final_output` | `dict[str, Any] \| None` | Structured result returned to the caller. |

## Nodes

| Node | Responsibility |
| --- | --- |
| `prepare_task` | Validate input, normalize text, initialize defaults, and load supplied brief, prompt library, policy, and context sources. |
| `classify_task` | Classify the request into ideation, implementation, tests, documentation, optimization, review, or unsupported. |
| `validate_human_brief` | Check that the brief includes goal, constraints, acceptance criteria, and expected output; flag missing context. |
| `stage_context` | Build a transparent context bundle from supplied code, docs, style rules, and requirements without broad implicit retrieval. |
| `select_specialist_role` | Choose the specialist role from the request, task type, trigger source, and context warnings. |
| `load_role_prompt` | Load the versioned prompt for the selected role from `prompt_library` and report missing prompts. |
| `run_specialist_agent` | Invoke the shared model adapter with the role prompt and context bundle to produce a bounded artifact. |
| `run_process_review` | Critique the artifact for bugs, mismatches, missing tests, unclear docs, or maintainability issues. |
| `reflect_on_review` | Prioritize the critique into a concise, actionable review summary. |
| `decide_next_step` | Decide whether to request more context, iterate with the specialist, prepare human review, or fail. |
| `request_clarification` | Return a controlled response asking the human for missing brief or context. |
| `prepare_human_review` | Package the proposed artifact, critique, reflection, blocked actions, and approval instructions for human review. |
| `finalize_response` | Build `final_output` with status, selected role, artifact summary, review summary, context warnings, and audit metadata. |

## Edges

Describe the graph flow, including conditional branches.

```text
START
  -> prepare_task
  -> classify_task
  -> validate_human_brief
  -> stage_context
  -> select_specialist_role
  -> load_role_prompt
  -> run_specialist_agent
  -> run_process_review
  -> reflect_on_review
  -> decide_next_step

decide_next_step -> request_clarification -> finalize_response -> END
decide_next_step -> run_specialist_agent
decide_next_step -> prepare_human_review -> finalize_response -> END
decide_next_step -> finalize_response -> END
```

Conditional edge requirements:

- Route from `prepare_task` to `finalize_response` with `status: "failed"` when the input is blank or malformed.
- Route from `validate_human_brief` to `request_clarification` when the goal, acceptance criteria, or necessary context is missing.
- Route from `stage_context` to `request_clarification` when context is too sparse to produce a useful artifact.
- Route from `stage_context` to `finalize_response` with `status: "failed"` when context appears to include secrets or disallowed data.
- Route from `select_specialist_role` to `finalize_response` with `status: "unsupported"` when the task asks for autonomous commits, deployment, credential use, or destructive commands.
- Route `trigger_source: "pre_commit"` to `process_reviewer` or review-only mode; do not generate new code in that mode unless the human explicitly requests it.
- Route from `load_role_prompt` to `finalize_response` with `status: "failed"` when the selected role has no prompt.
- Route from `decide_next_step` back to `run_specialist_agent` only when the critique finds fixable issues, more iterations remain, and the approval policy permits another model pass.
- Route from `decide_next_step` to `prepare_human_review` whenever an artifact proposes code, tests, docs, refactor changes, commands, commits, or any other change that a human must approve.
- Route to `finalize_response` with `status: "ok"` only for advisory outputs that require no application, such as a review summary or ideation notes.
- The graph must not write files, commit changes, run shell commands, or call external services as part of this requirement.

## Inputs and Outputs

- Input: a developer task, structured human brief, context sources, prompt library, optional requested role, optional trigger source, model configuration, and approval policy.
- Output: `final_output`, including `status`, `selected_role`, `task_type`, `artifact_summary`, `specialist_artifact`, `critique`, `reflection`, `context_warnings`, `blocked_actions`, `requires_human_approval`, and `action_log`.
- Intermediate artifacts:
  - normalized request,
  - validated brief,
  - curated context bundle,
  - loaded role prompt,
  - specialist artifact,
  - critique,
  - reflection,
  - route decision,
  - human-review package.

Example successful review output shape:

```json
{
  "status": "needs_review",
  "selected_role": "test_engineer",
  "task_type": "test_creation",
  "requires_human_approval": true,
  "artifact_summary": "Proposed pytest coverage for CSV import validation, including malformed rows, missing required columns, and duplicate IDs.",
  "specialist_artifact": {
    "kind": "tests",
    "path": "tests/test_csv_import.py",
    "content": "<proposed test code>"
  },
  "critique": {
    "findings": [
      "The tests cover parser failures but do not assert the user-facing error message."
    ]
  },
  "reflection": {
    "priority": "Add one assertion for the displayed validation message before applying the tests."
  },
  "blocked_actions": [
    {
      "action": "write_file",
      "reason": "Generated artifacts require human approval before filesystem changes."
    }
  ]
}
```

Example clarification output shape:

```json
{
  "status": "needs_context",
  "selected_role": null,
  "task_type": "implementation",
  "requires_human_approval": false,
  "context_warnings": [
    "No existing code or interface contract was supplied for the requested feature."
  ],
  "final_output": {
    "message": "Provide the target module, expected behavior, and acceptance criteria before invoking a scaffolder agent."
  }
}
```

## Failure Cases

Document expected failures, retries, fallback behavior, and human-review points.

- Blank input: stop with `status: "failed"` and a concise validation error.
- Missing brief: request goal, acceptance criteria, target files, or expected artifact before selecting a specialist.
- Missing prompt: fail with the selected role and missing prompt key so the prompt library can be fixed.
- Insufficient context: request additional code, docs, or style guidance instead of inventing project details.
- Excessive or unsafe context: block the run if supplied context appears to include secrets, credentials, private keys, or unrelated bulk data.
- Unsupported request: refuse autonomous commits, deploys, credential use, destructive shell commands, or production changes.
- Low-quality specialist artifact: use critique/reflection to iterate when `max_iterations` allows; otherwise return `needs_review` with known gaps.
- Review-only trigger: in pre-commit mode, produce critique and reflection but do not propose unrelated code generation.
- Model/tool failure: preserve the action log and return `status: "failed"` or `needs_review` depending on whether a partial artifact exists.
- Human approval boundary: any proposed change artifact must end in `needs_review`; the graph must not apply it.

## Test Ideas

- Verify an implementation request with a complete brief routes to `scaffolder`, generates an artifact, runs review, and returns `needs_review`.
- Verify a test-generation request routes to `test_engineer` and includes critique/reflection before final output.
- Verify a documentation request routes to `documenter`.
- Verify an optimization request routes to `optimizer` and returns a refactor proposal, not applied changes.
- Verify `trigger_source: "pre_commit"` routes to review-only behavior.
- Verify missing context returns `needs_context` before any model artifact is generated.
- Verify a missing prompt library entry returns a controlled failure with the selected role.
- Verify a request to commit, deploy, or run a destructive command is blocked by policy.
- Verify generated outputs never claim that files were written or commands were executed.
- Verify fake model fixtures make route decisions and final output deterministic.
- Verify `max_iterations` caps the critique-driven retry loop.
- Verify the final state contains `selected_role`, `specialist_artifact`, `critique`, `reflection`, `requires_human_approval`, and `action_log`.

## Open Questions

- The TOC lists Appendix G as logical pages `397-403`, but PDF file pages with labels `397-403` contain Appendix D and Appendix E material. The visible Appendix G body begins at file page `404`, so page-index mapping is ambiguous.
- Appendix G appears duplicated: indexes `403-408` / file pages `404-409` and indexes `409-414` / file pages `410-415` have matching extracted text hashes. This document uses the first occurrence.
- The TOC lists Appendix G as seven logical pages, while the extracted visible Appendix G occurrence contains six physical pages with page-local counters `1-6`.
- Appendix F appears missing or displaced between Appendix E and Appendix G; this reinforces that the PDF may have an assembly or pagination issue in the appendix region.
- The source names current frontier models as examples of direct model access. The implementation should treat provider/model selection as configuration through the repository's shared model pattern, not as a hard dependency on any named external model.
