---
sidebar_position: 9
---

# 9: Learning and Adaptation (en)

## Pattern Summary

Learning and adaptation turn a static agent into a system that can improve its behavior, knowledge, or strategy from experience. The chapter frames learning as the process that changes an agent internally, and adaptation as the visible behavioral change that follows from learning.

The chapter surveys several learning modes: reinforcement learning, supervised learning, unsupervised learning, few-shot and zero-shot adaptation with LLMs, online learning, and memory-based learning. It also discusses PPO and DPO as model-training or alignment approaches, then uses SICA, AlphaEvolve, and OpenEvolve to illustrate feedback-driven self-improvement loops.

For the first LangGraph example, this requirement should not implement full model training, PPO, DPO, or unsafe source-code self-modification. Instead, it should implement a bounded adaptation loop: retrieve prior experience, choose a strategy, produce an output, evaluate the result, update a lightweight experience archive or strategy profile, and conditionally retry or route to review.

## Pattern Explanation

### Conceptual Overview

Learning and adaptation are the mechanisms that let an agent change over time. A learning agent does not only follow a fixed prompt or workflow. It observes outcomes, stores useful experience, and uses those lessons to make better future decisions.

In the chapter, this idea ranges from classical machine learning to LLM-based self-improvement systems. For a practical LangGraph graph, the core idea can be represented as an observable feedback loop: every run creates evidence about what worked, and the next run can use that evidence when selecting a strategy.

### Problem

Static agents can degrade when the environment changes, when user preferences evolve, or when a task differs from the examples anticipated during initial design. They may repeat the same bad strategy because there is no durable record of failures, successful approaches, or evaluation feedback.

Learning and adaptation solve this by adding a mechanism for experience capture, outcome evaluation, and future behavior adjustment.

### When to Use

- Use this pattern when the agent handles repeated tasks where past outcomes can improve future behavior.
- Use it when the environment, data, tools, or user preferences change over time.
- Use it when there is a reliable feedback signal, score, benchmark, evaluator, or human review outcome.
- Use it when personalization matters, such as assistant behavior that should adapt to a user or team.
- Use it when failed attempts should produce reusable lessons instead of disappearing from the workflow.
- Use it when the system needs an archive of strategies, versions, or experiences for auditability.

### When Not to Use

- Avoid this pattern for simple one-off tasks where persistence and feedback add no value.
- Avoid it when there is no trustworthy evaluation signal; bad feedback can teach the wrong behavior.
- Avoid autonomous self-modification in production without sandboxing, review, rollback, and monitoring.
- Avoid storing sensitive user data unless retention, consent, and deletion rules are clear.
- Avoid frequent adaptation when deterministic, stable behavior is more important than improvement.
- Avoid treating lightweight memory updates as equivalent to true model fine-tuning or reinforcement learning.

### How It Works

1. The workflow receives a task, user request, or environment observation.
2. The agent retrieves relevant prior experiences, successful strategies, known failures, or user preferences.
3. A strategy selector chooses how to handle the current task using the current input and retrieved lessons.
4. The agent produces an output or action using the selected strategy.
5. An evaluator scores the result against a rubric, benchmark, user feedback, or deterministic checks.
6. The system records an adaptation event containing the input summary, selected strategy, output summary, score, failure reasons, and learned lesson.
7. A conditional decision either finalizes, retries with a revised strategy, asks for clarification, or routes to human review.
8. Future runs can retrieve the saved adaptation records and change their behavior accordingly.

### Trade-offs

| Benefit | Cost or Risk |
| --- | --- |
| Improves behavior across repeated tasks by using past outcomes. | Bad or biased feedback can reinforce poor behavior. |
| Supports personalization and changing environments. | Requires persistent state, retention policy, and observability. |
| Makes failures useful by turning them into lessons or strategy updates. | Poorly bounded adaptation can drift away from intended behavior. |
| Enables benchmark-driven improvement similar to SICA or AlphaEvolve at a workflow level. | True model training, self-modification, and reward optimization require much stronger safety controls. |
| Provides an auditable archive of strategy choices and scores. | More state and routing logic increase implementation and test complexity. |

### Minimal Example

```text
User support request
  -> retrieve similar past cases and lessons
  -> select response strategy
  -> draft response
  -> evaluate response against rubric
  -> if score is high: store success lesson and finalize
  -> if score is low and retries remain: revise strategy and try again
  -> if still weak or unsafe: store failure lesson and request human review
```

### LangGraph Mapping

| Pattern Concept | LangGraph Element |
| --- | --- |
| Current experience | State fields such as `input`, `task_category`, and `normalized_input` |
| Prior learning | State field `experience_matches` plus optional LangGraph store or injected memory repository |
| Strategy or policy | State fields `selected_strategy`, `strategy_reason`, and `strategy_profile` |
| Action using the strategy | Node `generate_response` |
| Reward, score, or feedback | Node `evaluate_response` and state field `evaluation` |
| Adaptation update | Node `adapt_from_result` writing `adaptation_record` and `archive_update` |
| Retry or review decision | Conditional edge after `evaluate_response` |
| Human safety boundary | Node `mark_needs_review` |

## LangGraph Implementation Goal

Build a LangGraph example of an adaptive support assistant that improves from prior solved cases and evaluation feedback. The user provides a technical support or troubleshooting request. The graph retrieves similar prior experiences, selects a response strategy, drafts an answer, evaluates the answer, and updates a lightweight experience archive before returning the final result.

The example should demonstrate learning and adaptation at the workflow level rather than training model weights. It should be safe and testable: memory updates should be explicit state or store writes, evaluators should be mockable, and the graph should never modify its own source code. This maps to the chapter's memory-based learning, online learning, SICA-style archive of past versions and scores, and AlphaEvolve/OpenEvolve-style generate-evaluate-select loop.

Expected workflow outcome:

- The agent uses prior successful cases when they are relevant.
- The agent records both successes and failures as adaptation events.
- Low-scoring outputs trigger one bounded revision attempt.
- Repeated weak, unsupported, or unsafe outputs route to human review.
- The final output exposes what strategy was used and what adaptation record was created.

## State Shape

List the state fields the graph needs.

| Field | Type | Purpose |
| --- | --- | --- |
| `input` | `str` | Original user support request or task description. |
| `user_id` | `str \| None` | Optional user identifier for scoped personalization or memory namespace. |
| `normalized_input` | `str` | Trimmed and normalized input used for retrieval and generation. |
| `task_category` | `str \| None` | Coarse category such as `connectivity`, `account`, `software`, `hardware`, or `unknown`. |
| `experience_matches` | `list[dict]` | Retrieved prior cases, lessons, strategy records, or user preferences relevant to the current task. |
| `strategy_profile` | `dict[str, Any]` | Lightweight policy data such as strategy success counts, average scores, and known pitfalls. |
| `selected_strategy` | `str \| None` | Chosen handling strategy, such as `reuse_known_solution`, `diagnostic_steps`, `clarify_first`, or `escalate`. |
| `strategy_reason` | `str \| None` | Short explanation of why the strategy was selected. |
| `draft_output` | `str \| None` | Candidate response produced by the graph before finalization. |
| `evaluation` | `dict[str, Any]` | Score, pass/fail flag, rubric notes, safety flags, and missing information from the evaluator. |
| `adaptation_record` | `dict[str, Any]` | Structured event summarizing the run, selected strategy, score, outcome, and learned lesson. |
| `archive_update` | `dict[str, Any] \| None` | Data to persist into the experience archive or LangGraph store after evaluation. |
| `retry_count` | `int` | Number of adaptation retries already attempted for the current request. |
| `max_retries` | `int` | Configured cap for revision attempts, initially `1` for a focused example. |
| `needs_human_review` | `bool` | Whether the graph should stop automatic adaptation and request review. |
| `errors` | `list[str]` | Recoverable validation, retrieval, model, evaluator, or persistence errors. |
| `final_output` | `dict[str, Any] \| None` | User-facing result containing the answer, status, strategy, score, and adaptation metadata. |

## Nodes

| Node | Responsibility |
| --- | --- |
| `preprocess_input` | Validate non-empty input, normalize whitespace, initialize retries, errors, and default thresholds. |
| `classify_task` | Assign a coarse task category so retrieval and strategy selection can use a stable label. |
| `retrieve_experience` | Retrieve relevant prior cases, lessons, strategy outcomes, or user preferences from an injected memory source or LangGraph store. |
| `select_strategy` | Choose the response strategy using the current task, retrieved experience, and strategy profile. |
| `generate_response` | Produce a candidate support response using the selected strategy and relevant lessons. |
| `evaluate_response` | Score the draft with a deterministic rubric, fake evaluator, or LLM judge; identify gaps, unsupported claims, and safety concerns. |
| `revise_strategy` | When evaluation fails and retries remain, adjust `selected_strategy`, incorporate evaluator notes, and increment `retry_count`. |
| `adapt_from_result` | Create `adaptation_record` and `archive_update` from the outcome, including success, failure reason, score, and lesson. |
| `persist_adaptation` | Store the archive update if persistence is configured; otherwise keep it in final state for tests and inspection. |
| `mark_needs_review` | Set `needs_human_review` for unsafe, unsupported, or repeatedly low-scoring outputs. |
| `finalize` | Produce `final_output` with the final answer, status, score, strategy, and adaptation metadata. |

## Edges

Describe the graph flow, including conditional branches.

```text
START
  -> preprocess_input
  -> classify_task
  -> retrieve_experience
  -> select_strategy
  -> generate_response
  -> evaluate_response

evaluate_response -> adapt_from_result -> persist_adaptation -> finalize -> END
evaluate_response -> revise_strategy -> generate_response
evaluate_response -> mark_needs_review -> adapt_from_result -> persist_adaptation -> finalize -> END
```

Conditional edge requirements:

- Route from `evaluate_response` to `adapt_from_result` when the score meets the configured threshold and no safety flag is present.
- Route from `evaluate_response` to `revise_strategy` when the score is below threshold, the issue appears recoverable, and `retry_count < max_retries`.
- Route from `evaluate_response` to `mark_needs_review` when the output is unsafe, unsupported by the input or retrieved experience, missing required context, or still below threshold after retries.
- `revise_strategy` must increment `retry_count` and must not loop beyond `max_retries`.
- `persist_adaptation` must not hide write failures. It should append an error and still allow `finalize` to return the response and in-state archive update.
- Retrieval and persistence should be injectable so tests can run without a network or external database.

## Inputs and Outputs

- Input: a natural-language technical support or troubleshooting request, plus optional `user_id`, prior feedback, or an injected in-memory archive for tests.
- Output: `final_output`, including the answer or review request, selected strategy, evaluation score, status, and adaptation metadata.
- Intermediate artifacts: normalized input, task category, retrieved experiences, strategy profile, selected strategy, draft response, evaluator notes, adaptation record, archive update, errors, and retry count.

Example successful output shape:

```json
{
  "status": "ok",
  "answer": "Try forgetting the Wi-Fi network, restarting the router, and reconnecting. If the issue started after an update, also reset the network settings.",
  "selected_strategy": "diagnostic_steps",
  "strategy_reason": "Similar prior connectivity cases succeeded with a stepwise diagnostic checklist.",
  "evaluation": {
    "score": 0.86,
    "passed": true,
    "notes": ["clear steps", "no unsafe instruction"]
  },
  "adaptation_record": {
    "outcome": "success",
    "lesson": "For connectivity issues, start with reversible network diagnostics before escalation."
  }
}
```

Example input shape:

```json
{
  "input": "My laptop connects to Wi-Fi but the internet stops working after a few minutes.",
  "user_id": "user-123"
}
```

## Failure Cases

Document expected failures, retries, fallback behavior, and human-review points.

- Blank input should fail in `preprocess_input` without invoking the model.
- No relevant prior experience should not block the graph; `select_strategy` should fall back to a general diagnostic or clarification strategy.
- Retrieved experience may be stale, irrelevant, or contradictory. The graph should treat it as guidance, not as ground truth.
- The generator may produce unsupported claims. `evaluate_response` should flag unsupported or overconfident content and route to revision or review.
- Evaluator output may be malformed or missing a score. The graph should append an error and either retry evaluation once or route to review.
- Low score after the retry limit should end in `mark_needs_review`, not an unbounded adaptation loop.
- Archive persistence may fail. The graph should preserve `archive_update` in state and expose the persistence error in `final_output`.
- Sensitive or personal data should not be stored in the archive unless the implementation has a retention policy and scoped namespace.
- Self-modifying behavior is out of scope for the first graph. The graph may update strategy records or memory, but it must not edit repository files, prompts on disk, or model weights.
- Reward hacking risk should be acknowledged: optimizing only for evaluator score can produce responses that satisfy the rubric while failing the user. Tests should include at least one case where a high-looking but unsupported answer is rejected.

## Test Ideas

- Verify the happy path where a relevant prior case is retrieved, `diagnostic_steps` is selected, the evaluator passes the draft, and an adaptation record is produced.
- Verify the cold-start path where no memory exists and the graph still produces a general response with an archive update.
- Verify a low-scoring draft routes through `revise_strategy`, increments `retry_count`, and then finalizes after the revised response passes.
- Verify a second low score after `max_retries` routes to `mark_needs_review`.
- Verify unsafe or unsupported generated content routes to human review even if a numeric score is present.
- Verify persistence failure appends an error while preserving `archive_update` in final state.
- Verify blank input stops before retrieval or model generation.
- Verify tests can inject a fake retriever, fake generator, fake evaluator, and fake persistence layer.
- Verify final state always includes `selected_strategy`, `evaluation`, `adaptation_record`, `retry_count`, `errors`, and `final_output`.
- Verify retrieved memories are scoped by `user_id` or a documented default namespace when personalization is enabled.

## Open Questions

- `docs/agentic-design-patterns-toc.md` lists Chapter 9 as logical pages `142-153`, but PDF text extraction shows the visible Chapter 9 section at page labels `154-166`, zero-based indexes `153-165`, with chapter-local page counters `1-13`.
- Should the first implementation use LangGraph's persistent store/checkpointer for the experience archive, or keep an injected in-memory repository until the shared project scaffold is finalized?
- Should evaluation be implemented first as deterministic heuristics, an LLM judge, or a pluggable interface with deterministic fakes for tests?
- What retention and privacy policy should apply to user-specific adaptation records?
- What score threshold and retry cap should be standardized across later adaptive examples?
