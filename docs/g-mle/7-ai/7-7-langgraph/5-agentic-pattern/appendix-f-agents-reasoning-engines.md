---
sidebar_position: 106
---

# Appendix F: Agents' Reasoning Engines (en)

## Pattern Summary

Appendix F is listed as an inside look at agents' reasoning engines. Since the canonical body text is missing or displaced in the extracted PDF, the safest implementation-oriented interpretation is to model the "reasoning engine" as the control layer that turns a user task into a bounded sequence of reasoning operations: task analysis, strategy selection, working-memory updates, optional tool actions, self-evaluation, revision, and finalization.

The LangGraph example should not duplicate Chapter 17's broad survey of reasoning techniques. Instead, it should expose the mechanics behind a reasoning engine: how state is initialized, how the graph chooses a strategy such as direct answer, decomposition, tool-assisted ReAct, or critique-and-revise, how each step is evaluated, and how the loop stops without leaking raw hidden chain-of-thought. The final output should include the answer, a concise user-safe reasoning summary, the selected strategy, step metadata, evidence or observations, and termination reason.

Because the Appendix F body is not available as extracted text, implementation should avoid product claims, external dependencies, and unsupported details. Treat the example as a local, testable reasoning-engine simulator grounded in agentic control-flow concepts already present elsewhere in the source PDF.

## Pattern Explanation

### Conceptual Overview

A reasoning engine is the part of an agent that decides how to think before it answers or acts. It is not just the language model call. It is the orchestration around the model: what context is prepared, which reasoning strategy is selected, whether tools are needed, how intermediate results are stored, how quality is checked, and when the system should stop.

For a learner, the key idea is that agent reasoning becomes more reliable when it is structured as explicit state transitions rather than a single uninspected prompt. For an engineer, the key implementation requirement is to make those transitions observable and bounded while keeping internal deliberation private and returning only concise rationale and metadata.

### Problem

Single-pass agents can respond quickly, but they often fail when a task requires choosing an approach, maintaining intermediate state, checking whether evidence is sufficient, or recovering from an uncertain step. Without a reasoning engine, the application cannot easily tell whether the model answered directly, decomposed the problem, used a tool, revised a draft, or stopped because it ran out of budget.

This pattern solves the problem by making reasoning control explicit. The graph records the task profile, selected strategy, step summaries, observations, critiques, and stop conditions so the behavior can be tested and debugged.

### When to Use

- Use this pattern when an agent must choose among reasoning modes instead of always using one prompt.
- Use it when the task may require decomposition, tool use, critique, verification, or multiple steps.
- Use it when observability matters and tests need to assert which reasoning path was taken.
- Use it when cost, latency, and step count must be capped by explicit budgets.
- Use it when the final answer should include a concise explanation of process without exposing raw hidden reasoning.
- Use it when a project needs a reusable control loop that other pattern examples can build on.

### When Not to Use

- Avoid this pattern for simple deterministic transformations where a direct function or one model call is enough.
- Avoid it when the task has no meaningful strategy choice and a full graph would only add latency.
- Avoid it when the application cannot tolerate nondeterministic model routing decisions without deterministic guards.
- Avoid exposing raw chain-of-thought logs as user-facing output; return summaries, decisions, and evidence instead.
- Avoid unbounded reasoning loops, retries, or branch exploration without clear termination rules.
- Avoid treating the engine trace as proof of correctness; it is diagnostic metadata, not verification by itself.

### How It Works

1. The graph receives a user task and initializes a bounded reasoning budget, empty working memory, empty trace, and default status.
2. A task analysis step classifies the request by complexity, required knowledge, tool needs, risk, and whether direct response is acceptable.
3. A strategy selector chooses a reasoning mode such as `direct`, `decompose`, `react_tool_loop`, or `critique_and_revise`.
4. The graph prepares working context from the input, constraints, available tools, and any local evidence fixtures.
5. The engine proposes the next step, executes it through either an LLM-like reasoning node or an injectable local tool, and records a concise step summary.
6. An evaluator checks whether the step improved the answer, found a gap, produced an error, or exhausted the configured budget.
7. Conditional routing either loops for another step, switches strategy, drafts an answer, or finalizes a partial result.
8. A critique node reviews the draft against the task, observations, and constraints, then revises unsupported or incomplete content.
9. The final node returns the answer, strategy, user-safe reasoning summary, trace metadata, observations, errors, and termination reason.

### Trade-offs

| Benefit | Cost or Risk |
| --- | --- |
| Makes agent reasoning observable as state transitions and route choices. | Adds graph complexity beyond a direct model call. |
| Supports different reasoning modes for different task types. | Strategy selection can be wrong unless tested with clear fixtures. |
| Bounded loops reduce runaway cost and latency. | Strict budgets can stop before the best answer is reached. |
| Step summaries help debugging and monitoring. | Summaries can create false confidence if not grounded in observations. |
| Tool and critique nodes make reasoning more reliable for external or uncertain tasks. | Tool failures and shallow critiques must be handled explicitly. |
| User-safe summaries avoid exposing raw hidden deliberation. | Engineers still need internal observability for tests and debugging. |

### Minimal Example

```text
Input:
  "Estimate whether a small team can ship a CSV import feature in two weeks.
   Constraints: two engineers, existing parser library, tests required."

Flow:
  prepare_task
  analyze_task -> complex planning question, no external network needed
  select_reasoning_strategy -> decompose + critique_and_revise
  propose_next_step -> identify workstreams
  execute_reasoning_step -> parse, validation, UI, tests, release risk
  evaluate_step -> enough structure, but missing risk check
  propose_next_step -> assess risks and assumptions
  evaluate_step -> ready to draft
  draft_answer
  critique_answer -> mark uncertainty and remove unsupported estimates
  finalize_response

Output:
  answer: qualified two-week feasibility assessment
  strategy: decompose + critique_and_revise
  reasoning_summary: concise process description
  termination_reason: answer_ready
```

### LangGraph Mapping

| Pattern Concept | LangGraph Element |
| --- | --- |
| User task | State fields `input` and `normalized_input` |
| Reasoning engine configuration | State fields `engine_config`, `available_strategies`, and `reasoning_budget` |
| Task profiling | Node `analyze_task` and state field `task_profile` |
| Strategy selection | Node `select_reasoning_strategy` and state field `selected_strategy` |
| Working memory | State field `working_memory` |
| Step proposal | Node `propose_next_step` and state field `next_step` |
| Reasoning step execution | Node `execute_reasoning_step` and state field `step_trace` |
| Tool-assisted action | Node `run_tool_action` and state fields `tool_requests` and `observations` |
| Step evaluation | Node `evaluate_progress` and state fields `knowledge_gaps`, `confidence`, and `termination_reason` |
| Strategy switch or loop | Conditional edges from `evaluate_progress` and state field `route_decision` |
| Draft and critique | Nodes `draft_answer`, `critique_answer`, and `revise_answer` |
| User-safe reasoning report | State field `reasoning_summary`, not raw hidden chain-of-thought |
| Final result | Node `finalize_response` and state field `final_output` |

## LangGraph Implementation Goal

Build a LangGraph example of a reasoning engine controller. The user provides a task, optional constraints, optional local evidence, optional allowed tools, and optional budget overrides. The graph profiles the task, selects a reasoning strategy, runs a bounded reasoning loop, optionally calls local injectable tools, evaluates progress, critiques the draft, and returns a final response with diagnostic metadata.

The example should be deterministic under tests. Model calls should be wrapped so tests can inject fake outputs. Tool behavior should use local fixtures, not network access. The graph should demonstrate how an agent's reasoning engine controls state and routing, rather than claiming that any one prompt reveals the model's true internal reasoning.

Expected workflow outcome:

- Simple requests can route through `direct` and finalize quickly.
- Multi-step requests can route through `decompose` and complete after one or more evaluated steps.
- Tool-requiring requests can route through `react_tool_loop` only when a matching local tool is allowed.
- Low-confidence or unsupported drafts can route through critique and revision before finalization.
- Budget exhaustion returns a partial result with gaps and termination metadata.
- The final output includes concise reasoning metadata, not raw hidden chain-of-thought.

## State Shape

List the state fields the graph needs.

| Field | Type | Purpose |
| --- | --- | --- |
| `input` | `str` | Original user task or question. |
| `normalized_input` | `str` | Trimmed and normalized task text used by prompts and tools. |
| `constraints` | `dict[str, Any]` | User-provided scope, quality, tool, budget, or output constraints. |
| `engine_config` | `dict[str, Any]` | Runtime settings such as allowed strategies, default budgets, tool policy, and confidence thresholds. |
| `available_strategies` | `list[str]` | Supported reasoning modes such as `direct`, `decompose`, `react_tool_loop`, and `critique_and_revise`. |
| `selected_strategy` | `str \| None` | Strategy chosen for the current task. |
| `strategy_history` | `list[dict[str, Any]]` | Ordered record of strategy choices, switches, and rationales. |
| `task_profile` | `dict[str, Any]` | Classification of complexity, domain, risk, tool needs, evidence needs, and expected output type. |
| `reasoning_budget` | `dict[str, int]` | Caps for steps, tool calls, critique rounds, strategy switches, and model calls. |
| `budget_used` | `dict[str, int]` | Counters for steps, tool calls, critique rounds, strategy switches, and model calls. |
| `working_memory` | `dict[str, Any]` | Structured scratch state containing subgoals, assumptions, partial conclusions, and open decisions. |
| `next_step` | `dict[str, Any] \| None` | Proposed next reasoning or tool step. |
| `step_trace` | `list[dict[str, Any]]` | Concise, user-safe summaries of executed steps, inputs, outputs, and route decisions. |
| `tool_requests` | `list[dict[str, Any]]` | Tool calls proposed by the reasoning loop. |
| `observations` | `list[dict[str, Any]]` | Results from local tools, evidence fixtures, or validation checks. |
| `knowledge_gaps` | `list[str]` | Missing information or unresolved assumptions discovered during evaluation. |
| `errors` | `list[str]` | Validation, strategy, tool, parsing, or evaluation errors. |
| `confidence` | `float` | Current confidence score from evaluation, bounded from `0.0` to `1.0`. |
| `route_decision` | `str \| None` | Next route such as `continue`, `use_tool`, `switch_strategy`, `draft`, `partial`, or `fail`. |
| `draft_answer` | `str \| None` | Initial answer synthesized from working memory and observations. |
| `critique` | `dict[str, Any] \| None` | Review of the draft for support, completeness, constraint satisfaction, and clarity. |
| `revised_answer` | `str \| None` | Answer after critique-driven revision. |
| `reasoning_summary` | `str \| None` | Concise user-facing process summary that omits raw hidden deliberation. |
| `termination_reason` | `str \| None` | Stop condition such as `answer_ready`, `budget_exhausted`, `invalid_input`, `tool_unavailable`, or `insufficient_evidence`. |
| `status` | `str` | Overall status such as `ok`, `partial`, `invalid_input`, `blocked`, or `failed`. |
| `final_output` | `dict[str, Any] \| None` | Final structured result returned by the graph. |

## Nodes

| Node | Responsibility |
| --- | --- |
| `prepare_task` | Validate input, normalize fields, set default config and budgets, and initialize empty state artifacts. |
| `analyze_task` | Classify complexity, risk, evidence needs, tool needs, and likely output type. |
| `select_reasoning_strategy` | Choose the initial strategy from `available_strategies` based on `task_profile` and constraints. |
| `prepare_working_memory` | Seed subgoals, assumptions, open questions, and any local evidence into structured working memory. |
| `propose_next_step` | Decide the next reasoning or tool step given strategy, gaps, confidence, and remaining budget. |
| `execute_reasoning_step` | Run an injectable model-like reasoning operation and append a concise step summary to `step_trace`. |
| `run_tool_action` | Execute an allowed local tool or fixture lookup, append an observation, and handle tool errors. |
| `evaluate_progress` | Check whether the graph has enough support to draft, needs another step, should switch strategy, or must stop. |
| `switch_strategy` | Change strategy when progress stalls and the switch budget allows it. |
| `draft_answer` | Synthesize an answer from working memory, observations, and supported partial conclusions. |
| `critique_answer` | Review the draft against the original task, constraints, observations, and gaps. |
| `revise_answer` | Remove unsupported content, resolve critique findings, and produce the final answer candidate. |
| `finalize_response` | Build `final_output` with status, answer, reasoning summary, strategy metadata, trace summary, gaps, errors, and budget usage. |

## Edges

Describe the graph flow, including conditional branches.

```text
START
  -> prepare_task
  -> analyze_task
  -> select_reasoning_strategy
  -> prepare_working_memory
  -> propose_next_step

propose_next_step -> execute_reasoning_step -> evaluate_progress
propose_next_step -> run_tool_action -> evaluate_progress

evaluate_progress -> propose_next_step
evaluate_progress -> switch_strategy -> propose_next_step
evaluate_progress -> draft_answer
evaluate_progress -> finalize_response

draft_answer -> critique_answer
critique_answer -> revise_answer
critique_answer -> finalize_response
revise_answer -> finalize_response

finalize_response -> END
```

Conditional edge requirements:

- Route from `prepare_task` to `finalize_response` with `status: "invalid_input"` when the input is blank.
- Route from `propose_next_step` to `run_tool_action` only when the next step requests an allowed local tool and budget remains.
- Route from `propose_next_step` to `execute_reasoning_step` for decomposition, analysis, comparison, or synthesis preparation steps.
- Route from `evaluate_progress` back to `propose_next_step` when gaps remain and step budget remains.
- Route from `evaluate_progress` to `switch_strategy` when confidence stalls, the selected strategy is mismatched, and switch budget remains.
- Route from `evaluate_progress` to `draft_answer` when confidence meets the configured threshold or no more useful steps are needed.
- Route from `evaluate_progress` to `finalize_response` with `status: "partial"` when the budget is exhausted before the answer is fully supported.
- Route from `critique_answer` to `revise_answer` when the critique finds fixable unsupported claims, missing constraints, or clarity issues.
- Route from `critique_answer` directly to `finalize_response` when the draft is acceptable or the critique budget is exhausted.
- The graph must never exceed configured step, tool, critique, strategy-switch, or model-call budgets.

## Inputs and Outputs

- Input: a natural-language task, optional constraints, optional local evidence fixtures, optional allowed tools, optional `available_strategies`, and optional budget overrides.
- Output: `final_output`, including `status`, `answer`, `reasoning_summary`, `selected_strategy`, `strategy_history`, `termination_reason`, `confidence`, `knowledge_gaps`, `trace_summary`, `observations`, `budget_used`, and `errors`.
- Intermediate artifacts: task profile, working memory, next step, step trace, tool requests, observations, draft answer, critique, and revised answer.

Example successful output shape:

```json
{
  "status": "ok",
  "answer": "A two-week CSV import feature is feasible only if the scope is limited to a known schema, server-side validation, error reporting, and automated tests. Custom mapping, background processing, or large-file optimization should be deferred.",
  "reasoning_summary": "The engine classified the request as a bounded planning task, decomposed the work into implementation and risk areas, checked assumptions, and revised the answer to mark unsupported scope as deferred.",
  "selected_strategy": "decompose",
  "strategy_history": [
    {
      "strategy": "decompose",
      "reason": "The task requires multi-step feasibility analysis."
    }
  ],
  "termination_reason": "answer_ready",
  "confidence": 0.82,
  "knowledge_gaps": [],
  "trace_summary": [
    {
      "step": "identify_workstreams",
      "result": "Found parser integration, validation, UI, tests, and release risks."
    },
    {
      "step": "check_assumptions",
      "result": "Marked schema stability and file size as key assumptions."
    }
  ],
  "budget_used": {
    "steps": 2,
    "tool_calls": 0,
    "critique_rounds": 1,
    "strategy_switches": 0,
    "model_calls": 4
  },
  "errors": []
}
```

Example partial output shape:

```json
{
  "status": "partial",
  "answer": "I can outline the likely approach, but the configured budget ended before the graph could verify file-size and schema assumptions.",
  "reasoning_summary": "The engine decomposed the task and found unresolved assumptions before budget exhaustion.",
  "selected_strategy": "decompose",
  "termination_reason": "budget_exhausted",
  "confidence": 0.48,
  "knowledge_gaps": [
    "maximum expected CSV file size",
    "whether custom column mapping is in scope"
  ],
  "budget_used": {
    "steps": 1,
    "tool_calls": 0,
    "critique_rounds": 0,
    "strategy_switches": 0,
    "model_calls": 2
  },
  "errors": []
}
```

## Failure Cases

Document expected failures, retries, fallback behavior, and human-review points.

- Blank input should stop in `prepare_task` with `status` `invalid_input`.
- Unsupported strategy names should be ignored with an error or replaced by the default strategy.
- Strategy selection failure should fall back to `direct` only for simple tasks; complex tasks should return `partial` or `failed`.
- Tool requests for unavailable or disallowed tools should not execute and should set `termination_reason` to `tool_unavailable` when no alternative path exists.
- Tool exceptions should be captured in `errors`, appended to the trace, and counted against tool budget only for attempted calls.
- Repeated low-confidence evaluations should trigger `switch_strategy` only while switch budget remains.
- Budget exhaustion should return a partial answer with gaps, not fabricate missing information.
- Critique failures should not erase the draft; finalization should include a warning and lower confidence.
- Raw hidden chain-of-thought should never be placed in `final_output`; use concise step summaries and evidence metadata instead.
- The graph should terminate deterministically even when fake model outputs request more steps forever.
- If the source ambiguity for Appendix F remains unresolved, implementation should keep Appendix F-specific claims minimal and test behavior around the generic reasoning-engine control loop.

## Test Ideas

- Verify a simple factual or formatting request routes through `direct` and uses at most one reasoning step.
- Verify a multi-step planning task routes through `decompose`, records multiple step summaries, and finalizes with `status` `ok`.
- Verify a tool-requiring task routes to `run_tool_action` only when the requested tool is allowed.
- Verify a disallowed tool request returns `partial` or `failed` without executing the tool.
- Verify low confidence can trigger one strategy switch and that switch budget is enforced.
- Verify budget exhaustion stops the loop and includes `termination_reason: "budget_exhausted"`.
- Verify critique removes or flags unsupported claims before final output.
- Verify `final_output` contains `answer`, `reasoning_summary`, `selected_strategy`, `termination_reason`, `budget_used`, and `errors`.
- Verify `final_output` does not include raw hidden chain-of-thought fields.
- Verify fake model outputs that repeatedly request another step cannot create an infinite loop.
- Verify source ambiguity is represented in documentation and does not depend on external services or unavailable PDF text.

## Open Questions

- The Appendix F body text could not be located in the extracted PDF. The TOC lists Appendix F as logical pages `383-396`, but those PDF labels / file pages contain Appendix B, Appendix C, and Appendix D material.
- The expected continuation after Appendix E is inconsistent. Appendix E appears at PDF file pages `399-403`, but Appendix G starts immediately at file page `404`, where Appendix F would be expected if the TOC order were followed.
- Appendix G appears duplicated before the Conclusion, suggesting that a PDF assembly or extraction error may have replaced or displaced Appendix F.
- Later Glossary pages `433-436` / indexes `432-435` briefly define reasoning capabilities such as Chain of Thought, Tree of Thoughts, ReAct, Planning, Deep Research, and Critique Model. Those pages are labeled Glossary, not Appendix F, so they were not treated as the authoritative Appendix F body.
- If a corrected PDF or separate Appendix F source is provided, this requirement should be revised against that source before implementation is considered complete.
