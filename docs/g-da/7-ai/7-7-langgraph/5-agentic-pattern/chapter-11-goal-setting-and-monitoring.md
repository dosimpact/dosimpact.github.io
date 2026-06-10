---
sidebar_position: 11
---

# Requirement: Chapter 11: Goal Setting and Monitoring

## Source

- PDF: `Agentic_Design_Patterns.pdf`
- Section: `Chapter 11: Goal Setting and Monitoring`
- Page range: `170-181` logical pages from `docs/agentic-design-patterns-toc.md`
- Extraction note: the visible Chapter 11 heading was found at one-based PDF file page `183` / zero-based index `182`, and Chapter 12 starts at one-based PDF file page `196` / zero-based index `195`. This requirement uses visible Chapter 11 extraction indexes `182-194`, file pages `183-195`, with chapter-local page counters `1-13`, while preserving the TOC logical range above as the cited range. This is ambiguous because the TOC range `170-181` covers 12 logical pages.

## Pattern Summary

Goal Setting and Monitoring gives an agent an explicit objective and a way to judge whether its actions are moving toward that objective. The chapter frames the pattern as the difference between a reactive agent that simply answers or acts and a purposeful agent that tracks progress against defined success criteria.

The chapter emphasizes clear goals, measurable criteria, environmental and tool-output monitoring, and feedback loops that let the agent adapt, revise, or escalate. Its hands-on example is an AI coding agent that accepts a use case and goal checklist, generates code, reviews whether the goals are met, revises when they are not, and stops after success or a maximum number of attempts.

For the first LangGraph example, this requirement should implement a bounded goal-monitoring loop rather than an open-ended autonomous worker. The graph should convert user goals into a structured goal contract, generate a candidate artifact, run objective checks, monitor the artifact against the contract, revise when recoverable gaps remain, and route to human review when the goal is unclear, unsafe, unsupported, or still unmet after the retry limit.

## Pattern Explanation

### Conceptual Overview

Goal Setting and Monitoring makes the agent's target explicit. A goal-oriented agent does not only produce a response; it knows what result it is trying to achieve, what evidence would show progress, and when it should stop, revise, or escalate.

In the chapter, the pattern is illustrated through customer support, learning systems, project management, trading, robotics, content moderation, and a code-generation example. The shared idea is that the agent has a desired outcome and a monitoring process that compares current state, actions, and outputs against that desired outcome.

### Problem

Agents without explicit goals can complete steps without knowing whether the larger task is actually solved. They may continue acting after success, stop too early, ignore constraints, or treat a plausible answer as complete without checking it against the user's requirements.

Goal Setting and Monitoring solves this by defining success criteria up front and making progress assessment a first-class workflow step. The monitoring loop creates evidence for decisions such as continue, revise, finalize, or escalate.

### When to Use

- Use this pattern when the agent must complete a multi-step task against a clear desired outcome.
- Use it when success should be measured against explicit criteria, metrics, deadlines, or constraints.
- Use it when the agent needs to adapt its plan or output after observing tool results, environment state, or evaluator feedback.
- Use it when the final answer should include evidence of which goals were met and which remain unresolved.
- Use it when autonomous execution needs bounded stopping conditions rather than an indefinite loop.
- Use it when another pattern, such as planning or tool use, needs a supervisory progress check.

### When Not to Use

- Avoid this pattern for simple one-shot transformations where pass/fail monitoring adds no value.
- Avoid it when the goal cannot be made specific or measurable enough to evaluate.
- Avoid relying only on an LLM's self-judgment for high-stakes outputs, especially when the same model generated the output.
- Avoid autonomous monitoring for side-effecting tasks unless approval, rollback, and audit requirements are defined.
- Avoid open-ended retry loops without `max_iterations`, progress criteria, and failure routing.
- Avoid treating a numeric score as sufficient when qualitative safety, correctness, or user intent issues remain.

### How It Works

1. Capture the user's task, initial state, constraints, and desired outcome.
2. Convert the desired outcome into a goal contract with measurable acceptance criteria, priority, and stopping rules.
3. Generate a plan, response, code draft, or other candidate artifact intended to satisfy the goal.
4. Observe the candidate artifact, tool outputs, deterministic checks, and any environment state relevant to the goal.
5. Compare those observations against the goal contract and produce a monitoring report.
6. Route based on progress: finalize when goals are met, revise when gaps are recoverable, or escalate when goals are unclear, unsafe, or repeatedly unmet.
7. Record each iteration so the final result explains what was attempted, what passed, what failed, and why the graph stopped.

### Trade-offs

| Benefit | Cost or Risk |
| --- | --- |
| Makes agent behavior purposeful and inspectable. | Requires more state, criteria design, and routing logic than a direct prompt. |
| Provides clear stopping conditions for autonomous work. | Weak criteria can produce false confidence or premature success. |
| Enables revision based on concrete feedback. | Revision loops can waste tokens or drift if progress is not measured. |
| Supports auditability by preserving progress history and verdicts. | Monitoring reports can be wrong when based only on model judgment. |
| Helps combine planning, tool use, and multi-agent review under a supervisory loop. | Independent reviewers, tests, and side-effect controls add implementation complexity. |

### Minimal Example

```text
Use case: Write a small Python function.
Goals:
  - simple to understand
  - functionally correct
  - handles edge cases

Flow:
  -> normalize goals into acceptance criteria
  -> generate candidate code
  -> run objective checks and reviewer assessment
  -> if all required criteria pass: finalize
  -> if gaps are recoverable and attempts remain: revise with feedback
  -> otherwise: route to human review with unmet goals
```

### LangGraph Mapping

| Pattern Concept | LangGraph Element |
| --- | --- |
| Desired outcome | State fields `use_case`, `raw_goals`, and `goal_contract` |
| Specific measurable criteria | Node `define_goal_contract` and state field `success_criteria` |
| Candidate work product | Node `generate_candidate` and state field `candidate_artifact` |
| Observed progress | Node `run_objective_checks` and state field `check_results` |
| Monitoring verdict | Node `monitor_candidate` and state field `monitoring_report` |
| Feedback loop | Conditional edge from `monitor_candidate` to `revise_candidate` |
| Stopping condition | State fields `iteration_count`, `max_iterations`, and conditional routing |
| Escalation | Node `mark_needs_review` |
| Audit trail | State field `progress_history` |

## LangGraph Implementation Goal

Build a LangGraph example of a goal-monitored coding assistant. The user provides a small coding use case and a comma-separated list of goals, such as simplicity, correctness, edge-case handling, or including examples. The graph turns those goals into a structured goal contract, generates a candidate Python solution, runs deterministic checks where possible, asks a reviewer or mock evaluator to assess the candidate against the goals, and either finalizes, revises, or routes to review.

The implementation should improve on the chapter's illustrative script in three ways:

- It must not write generated code to disk by default; the final code should be returned in state for inspection and tests.
- It must cap revision attempts with `max_iterations`.
- It should separate generation from monitoring as much as the local model setup allows, and tests must be able to inject deterministic fake generator and evaluator functions.

Expected workflow outcome:

- The agent creates explicit acceptance criteria before generating the artifact.
- The monitoring report identifies each goal as met, unmet, or uncertain.
- Recoverable gaps trigger a bounded revision loop.
- Unsafe, unclear, contradictory, or repeatedly unmet goals route to human review.
- The final output includes the candidate artifact, goal verdicts, iteration count, status, and progress history.

## State Shape

List the state fields the graph needs.

| Field | Type | Purpose |
| --- | --- | --- |
| `input` | `str` | Original user request containing the coding use case and goals. |
| `use_case` | `str` | Normalized coding task the candidate artifact should satisfy. |
| `raw_goals` | `list[str]` | User-provided goals before normalization. |
| `goal_contract` | `list[dict]` | Structured goals with `id`, `description`, `priority`, `acceptance_criteria`, and `measurement`. |
| `success_criteria` | `dict[str, Any]` | Aggregated pass thresholds and stopping rules derived from the goal contract. |
| `candidate_artifact` | `str \| None` | Current generated Python code or code-like solution text. |
| `previous_artifacts` | `list[str]` | Prior candidate versions kept for revision and audit. |
| `check_results` | `dict[str, Any]` | Deterministic validation results such as parse status, banned operations, basic examples, or static checks. |
| `monitoring_report` | `dict[str, Any]` | Reviewer verdicts, goal-by-goal status, score, feedback, uncertainty, and safety flags. |
| `goal_status` | `str` | Overall progress state: `met`, `needs_revision`, `needs_review`, or `failed`. |
| `revision_feedback` | `str \| None` | Specific feedback to include in the next generation attempt. |
| `iteration_count` | `int` | Number of candidate generation or revision attempts completed. |
| `max_iterations` | `int` | Maximum allowed attempts, defaulting to a small value such as `2` or `3`. |
| `progress_history` | `list[dict]` | Ordered events for goal definition, generation, checks, monitoring, revision, and finalization. |
| `needs_human_review` | `bool` | Whether the graph stopped because automatic monitoring was insufficient or unsafe. |
| `errors` | `list[str]` | Validation, model, parsing, evaluator, or check failures encountered during the workflow. |
| `final_output` | `dict[str, Any] \| None` | User-facing result with status, artifact, goal verdicts, iteration count, and unresolved goals. |

## Nodes

| Node | Responsibility |
| --- | --- |
| `prepare_input` | Validate non-empty input, extract the use case and raw goals, initialize counters, history, and defaults. |
| `define_goal_contract` | Convert raw goals into specific, measurable acceptance criteria and stopping rules. |
| `validate_goal_contract` | Check for missing, vague, contradictory, unsafe, or unmeasurable goals. |
| `generate_candidate` | Produce the first candidate Python solution using the use case and goal contract. |
| `run_objective_checks` | Run deterministic checks where practical, such as syntax parsing, restricted operation checks, or fixture examples. |
| `monitor_candidate` | Evaluate the candidate against every goal, using check results and a reviewer prompt or deterministic fake in tests. |
| `revise_candidate` | Generate an improved candidate from the prior artifact, monitoring report, and revision feedback; increment `iteration_count`. |
| `mark_needs_review` | Set review status when goals are unclear, unsafe, contradictory, or not met after the retry limit. |
| `finalize` | Create `final_output` with the candidate artifact, status, goal verdicts, iteration count, errors, and progress history. |

## Edges

Describe the graph flow, including conditional branches.

```text
START
  -> prepare_input
  -> define_goal_contract
  -> validate_goal_contract
  -> generate_candidate
  -> run_objective_checks
  -> monitor_candidate

monitor_candidate -> finalize -> END
monitor_candidate -> revise_candidate -> run_objective_checks
monitor_candidate -> mark_needs_review -> finalize -> END
validate_goal_contract -> mark_needs_review -> finalize -> END
```

Conditional edge requirements:

- Route from `validate_goal_contract` to `generate_candidate` only when the goal contract is measurable, non-empty, and safe for autonomous drafting.
- Route from `validate_goal_contract` to `mark_needs_review` when goals are too vague, contradictory, unsafe, or require side effects that the graph is not allowed to perform.
- Route from `monitor_candidate` to `finalize` when all required goals are met, no safety flags are present, and deterministic checks pass.
- Route from `monitor_candidate` to `revise_candidate` when at least one required goal is unmet, the feedback is actionable, and `iteration_count < max_iterations`.
- Route from `monitor_candidate` to `mark_needs_review` when the artifact is unsafe, unsupported, evaluator output is malformed, goals remain unmet after retries, or the reviewer is uncertain about critical correctness.
- `revise_candidate` must preserve the previous artifact in `previous_artifacts` and append a progress-history event.
- The graph must never loop beyond `max_iterations`.

## Inputs and Outputs

- Input: a natural-language coding use case and a list of goals, either embedded in `input` or supplied as separate test fields.
- Output: `final_output`, including status, candidate code or review request, goal verdicts, monitoring report, iteration count, unresolved goals, and errors.
- Intermediate artifacts: normalized use case, raw goals, goal contract, deterministic check results, reviewer feedback, previous artifacts, revision feedback, and progress history.

Example successful output shape:

```json
{
  "status": "ok",
  "artifact": "def binary_gap(n: int) -> int:\n    ...",
  "iteration_count": 1,
  "goal_verdicts": [
    {
      "goal_id": "correctness",
      "status": "met",
      "evidence": "Fixture examples passed and reviewer found no logic gap."
    }
  ],
  "monitoring_report": {
    "overall_status": "met",
    "score": 0.91,
    "feedback": "The solution is simple, handles edge cases, and includes examples."
  },
  "errors": []
}
```

Example review output shape:

```json
{
  "status": "needs_review",
  "artifact": "def update_billing(...):\n    ...",
  "iteration_count": 3,
  "unresolved_goals": ["safety", "side_effect_control"],
  "reason": "The task requires billing changes and cannot be completed without approval.",
  "errors": []
}
```

Example input shape:

```json
{
  "input": "Implement a Python function that returns the longest binary gap for a positive integer.",
  "goals": ["correctness", "readability", "handles edge cases"]
}
```

## Failure Cases

Document expected failures, retries, fallback behavior, and human-review points.

- Empty input should fail before model invocation and set `status` to `failed`.
- Missing goals should route to `mark_needs_review` or return a request for clearer criteria instead of generating blindly.
- Vague goals such as "make it good" should be normalized only if the graph can produce measurable criteria; otherwise route to review.
- Contradictory goals, such as "shortest possible" and "comprehensive explanation", should be surfaced before generation.
- Generated code that cannot be parsed should fail deterministic checks and route to revision when retries remain.
- Generated code that uses unsafe operations, file writes, network calls, subprocesses, or credential access should route to review unless explicitly allowed by future policy.
- Reviewer output may be malformed, incomplete, or overconfident. The graph should append an error and route to review for critical uncertainty.
- The same model may be biased when judging its own output. Tests should support a separate fake evaluator and should not assume model self-assessment is reliable.
- Low score or unmet required goals after `max_iterations` should stop in `needs_review`, not continue revising.
- Monitoring must include objective checks where possible; an LLM verdict alone is not enough for correctness-sensitive code.
- The implementation should not save generated files by default, even though the source chapter's illustrative code does so.

## Test Ideas

- Verify the happy path where clear goals produce a goal contract, candidate artifact, passing check results, and `status: ok`.
- Verify that blank input stops before goal definition or generation.
- Verify that vague or missing goals route to `needs_review`.
- Verify that contradictory goals are detected in `validate_goal_contract`.
- Verify that a syntax-invalid first candidate routes through `revise_candidate` when `max_iterations` remains.
- Verify that `iteration_count` increases on revision and never exceeds `max_iterations`.
- Verify that previous candidate versions are preserved in `previous_artifacts`.
- Verify that unsafe code operations route to `needs_review` even if the reviewer score is high.
- Verify that malformed evaluator output appends an error and does not produce a false `ok`.
- Verify that final output always includes `status`, `iteration_count`, `goal_verdicts` or unresolved goals, `monitoring_report`, `errors`, and `progress_history`.
- Verify that tests can inject fake generator, fake objective checker, and fake monitor components without network access.

## Open Questions

- `docs/agentic-design-patterns-toc.md` lists Chapter 11 as logical pages `170-181`, but PDF text extraction shows the visible Chapter 11 section at file pages `183-195` / zero-based indexes `182-194`, with chapter-local page counters `1-13`.
- The TOC logical range covers 12 logical pages, while the visible extracted Chapter 11 span covers 13 file pages. This document preserves both instead of forcing a single numbering scheme.
- The chapter overview contains several planning-oriented paragraphs that overlap with Chapter 6. This requirement treats those paragraphs as context and focuses the LangGraph example on explicit goal criteria, monitoring reports, revision decisions, and stopping conditions.
- Should the implementation use a separate model role for monitoring by default, or keep one shared model with strict test doubles until model configuration supports multiple named roles?
- Should deterministic code checks execute generated code in a sandbox, or should the first implementation limit checks to parsing, static inspection, and fixture-driven fake results?
