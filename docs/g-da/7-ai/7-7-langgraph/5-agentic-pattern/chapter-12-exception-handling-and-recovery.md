---
sidebar_position: 12
---

# Requirement: Chapter 12: Exception Handling and Recovery

## Source

- PDF: `Agentic_Design_Patterns.pdf`
- Section: `Chapter 12: Exception Handling and Recovery`
- Page range: `182-189` logical pages from `docs/agentic-design-patterns-toc.md`
- Extraction note: the visible Chapter 12 heading was found at PDF page label `196` / zero-based index `195`, and Chapter 13 starts at PDF page label `204` / zero-based index `203`. The extracted Chapter 12 span is therefore PDF indexes `195-202`, file pages `196-203`, with chapter-local page counters `1-8`. This is ambiguous because the TOC logical range `182-189` also covers 8 pages but does not match the PDF file page labels.

## Pattern Summary

Exception Handling and Recovery makes an agent reliable when tools fail, services return errors, inputs are malformed, or the environment changes unexpectedly. The chapter frames the pattern as a way to detect errors, respond gracefully, and restore the agent to a stable operating state instead of crashing or looping blindly.

The chapter organizes the pattern into three related activities: error detection, error handling, and recovery. Detection includes validating tool outputs, checking API codes, watching for timeouts, and recognizing incoherent responses. Handling includes logging, bounded retries, fallback strategies, graceful degradation, and notifications. Recovery includes rollback, diagnosis, self-correction, replanning, and escalation to a human or higher-level system.

For the LangGraph example, this requirement should implement a robust location lookup workflow based on the chapter's hands-on example: first try a precise location lookup, detect and record failures, retry only when appropriate, fall back to a broader area lookup, and produce a final response that explains either the recovered result or the controlled failure.

## Pattern Explanation

### Conceptual Overview

An agent that calls tools and external services will eventually encounter failures. A location service may be unavailable, a database may time out, a website may change shape, or a model may return content in the wrong format. Exception Handling and Recovery gives the agent a structured way to notice the problem, contain it, and choose the next safe action.

The chapter emphasizes that reliability is not only about catching exceptions in code. The agent must preserve operational integrity: it should keep enough state to know what failed, decide whether the failure is transient or terminal, choose a recovery path, and communicate clearly when it cannot complete the original task.

### Problem

Agents can be fragile when their plan assumes every tool call, model response, and service dependency will work. Without an explicit failure path, a tool error can crash the workflow, trigger repeated invalid retries, hide the real cause, or return an incoherent answer to the user.

This pattern solves that problem by making failure states first-class parts of the graph. The graph records what happened, routes based on error type, applies bounded recovery actions, and escalates or degrades gracefully when full recovery is not possible.

### When to Use

- Use this pattern when an agent depends on tools, APIs, databases, devices, browsers, or other external systems.
- Use it when operational reliability matters more than a best-effort single attempt.
- Use it when failures can be classified into transient, input-related, unavailable, partial, or severe categories.
- Use it when a fallback can still provide value, such as returning general area information after precise address lookup fails.
- Use it when users need a clear explanation of what succeeded, what failed, and what action was taken.
- Use it when logs, diagnostics, notifications, or escalation records are needed for later debugging.
- Use it when reflection or replanning can improve the next attempt after a failed one.

### When Not to Use

- Avoid this pattern for trivial deterministic flows where there are no meaningful external failure modes.
- Avoid automatic retries for non-transient failures such as invalid credentials, insufficient funds, market closed, or malformed user input.
- Avoid fallback behavior that silently changes the user's requested task without disclosure.
- Avoid unbounded retry loops, because they can increase cost, latency, and load on failing services.
- Avoid self-correction when the system lacks enough diagnostic information to choose a better action.
- Avoid treating graceful degradation as success when the original task still failed and the user must know that.

### How It Works

1. The graph validates the user request and initializes failure-tracking state.
2. The primary action runs, usually a tool call or service request that can fail.
3. The graph detects errors by checking exceptions, status codes, timeouts, empty results, malformed outputs, or suspicious content.
4. The graph records diagnostic details in state, including the failed operation, error category, message, and retry count.
5. A conditional route chooses the handling strategy: return success, retry a transient failure, use a fallback, degrade gracefully, notify, or escalate.
6. Recovery restores a stable state by keeping the last known good data, rolling back partial results, adjusting the plan, or invoking a fallback tool.
7. The graph finalizes with a user-facing response and an audit-friendly summary of the recovery path.

### Trade-offs

| Benefit | Cost or Risk |
| --- | --- |
| Keeps agents from crashing on predictable real-world failures. | Adds state, branches, and tests to every tool-dependent workflow. |
| Makes operational failures visible through logs and structured error state. | Poorly designed logs can expose sensitive data or overwhelm operators. |
| Recovers value through bounded retries and fallback behavior. | Retrying the wrong failure can waste time, money, and external service capacity. |
| Supports graceful degradation when full success is unavailable. | Users may misunderstand degraded output unless the response is explicit. |
| Enables escalation to humans or higher-level systems for severe cases. | Escalation adds operational process requirements outside the graph. |
| Can combine with reflection or replanning after failed attempts. | Self-correction can make failures worse if diagnostics are weak or the plan changes unsafely. |

### Minimal Example

```text
User asks for precise information about an address
  -> validate the address request
  -> call precise_location_lookup
  -> if precise lookup succeeds: format exact result
  -> if timeout/server error and retries remain: retry once
  -> if precise lookup still fails: extract city and call general_area_lookup
  -> if fallback succeeds: explain that only general area data is available
  -> if fallback fails or input is unusable: escalate or return controlled failure
```

### LangGraph Mapping

| Pattern Concept | LangGraph Element |
| --- | --- |
| User task and current operating state | State fields such as `input`, `normalized_query`, `address`, and `city` |
| Error detection | Node `call_precise_lookup` catches tool exceptions and validates results |
| Error classification | Node `diagnose_failure` sets `error_category` and `recovery_action` |
| Logging and diagnostics | State fields `tool_errors`, `event_log`, and `last_error` |
| Bounded retry | Conditional edge from `diagnose_failure` to `retry_precise_lookup` when `retry_count < max_retries` |
| Fallback | Node `call_general_area_lookup` and conditional route `fallback` |
| Graceful degradation | Node `compose_degraded_response` when only fallback data is available |
| Escalation or notification | Node `mark_for_review` for severe, repeated, or unrecoverable failures |
| Stable finalization | Node `finalize_response` produces `final_output` with status and recovery metadata |

## LangGraph Implementation Goal

Build a LangGraph example of a robust location information assistant. The user provides a natural-language location query. The graph attempts to retrieve precise address information with a primary tool. If the primary call fails, the graph detects the failure, records diagnostics, retries only for transient failures, falls back to a general area lookup when useful, and returns a clear response.

The implementation should demonstrate the chapter's detection, handling, and recovery stages without requiring real external services. The precise and general lookup tools should be injectable or fakeable so tests can deterministically simulate success, timeout, malformed output, not found, and service unavailable cases.

Expected workflow outcome:

- Successful precise lookups return exact location information.
- Transient primary failures trigger at most one retry.
- Non-transient primary failures skip retry and move directly to fallback or review.
- Fallback success returns a degraded but useful answer that clearly says it is not precise.
- Repeated or severe failures produce a controlled failure response and a review/escalation marker.
- The final state includes structured diagnostics for observability and tests.

## State Shape

List the state fields the graph needs.

| Field | Type | Purpose |
| --- | --- | --- |
| `input` | `str` | Original user location request. |
| `normalized_query` | `str` | Trimmed and normalized query used by parsing and tools. |
| `address` | `str \| None` | Parsed precise address or place string for the primary lookup. |
| `city` | `str \| None` | Parsed city or broader area for fallback lookup. |
| `primary_result` | `dict[str, Any] \| None` | Validated result from the precise location lookup. |
| `fallback_result` | `dict[str, Any] \| None` | Validated result from the general area lookup. |
| `location_result` | `dict[str, Any] \| None` | Best available location result selected for final response. |
| `primary_location_failed` | `bool` | Whether the primary lookup failed or returned unusable output. |
| `fallback_location_failed` | `bool` | Whether fallback lookup failed or returned unusable output. |
| `last_error` | `dict[str, Any] \| None` | Most recent structured error with operation, category, message, and retryable flag. |
| `tool_errors` | `list[dict[str, Any]]` | Complete ordered list of tool errors and validation failures. |
| `event_log` | `list[dict[str, Any]]` | Audit trail of detection, handling, recovery, fallback, and escalation decisions. |
| `retry_count` | `int` | Number of primary lookup retries already attempted. |
| `max_retries` | `int` | Configured retry cap, initially `1` for the example. |
| `error_category` | `str \| None` | Category such as `transient`, `not_found`, `invalid_input`, `malformed_output`, `service_unavailable`, or `severe`. |
| `recovery_action` | `str \| None` | Next action selected by diagnosis: `return_primary`, `retry`, `fallback`, `degrade`, `review`, or `fail`. |
| `needs_human_review` | `bool` | Whether the graph should flag the case for operator review or escalation. |
| `final_output` | `dict[str, Any] \| None` | User-facing response plus status, source, recovery path, and diagnostics summary. |

## Nodes

| Node | Responsibility |
| --- | --- |
| `prepare_request` | Validate non-empty input, normalize whitespace, initialize retry counters, flags, logs, and defaults. |
| `parse_location_query` | Extract a likely address/place and broader city or area from the user request. |
| `call_precise_lookup` | Invoke the primary precise location tool; catch exceptions; validate required fields; populate `primary_result` or `last_error`. |
| `diagnose_failure` | Classify the primary outcome and choose `recovery_action` based on error category, retryability, fallback availability, and retry count. |
| `retry_precise_lookup` | Increment `retry_count`, record the retry decision, and send control back to the primary lookup. |
| `call_general_area_lookup` | Invoke the fallback lookup using `city` or broader area; catch exceptions and validate fallback output. |
| `select_recovered_result` | Choose the best available result, preferring precise data and otherwise using fallback data with degraded status. |
| `mark_for_review` | Mark severe, repeated, or unrecoverable failures for escalation and preserve diagnostic state. |
| `finalize_response` | Build `final_output` with status, message, chosen result source, recovery path, and non-sensitive diagnostic summary. |

## Edges

Describe the graph flow, including conditional branches.

```text
START
  -> prepare_request
  -> parse_location_query
  -> call_precise_lookup
  -> diagnose_failure

diagnose_failure -> select_recovered_result -> finalize_response -> END
diagnose_failure -> retry_precise_lookup -> call_precise_lookup
diagnose_failure -> call_general_area_lookup -> select_recovered_result -> finalize_response -> END
diagnose_failure -> mark_for_review -> finalize_response -> END
```

Conditional edge requirements:

- Route from `diagnose_failure` to `select_recovered_result` when `primary_result` is valid.
- Route from `diagnose_failure` to `retry_precise_lookup` when `error_category` is transient and `retry_count < max_retries`.
- Route from `diagnose_failure` to `call_general_area_lookup` when the primary lookup failed and `city` or another fallback area is available.
- Route from `diagnose_failure` to `mark_for_review` when the input is unusable, no fallback area exists, the error is severe, or retry and fallback have both failed.
- `retry_precise_lookup` must increment `retry_count` before returning to `call_precise_lookup`.
- `call_general_area_lookup` must route to `select_recovered_result` even when it fails so finalization can produce a controlled failure response.
- The graph must not loop beyond `max_retries`.
- Tool implementations must be injectable so tests can simulate each route without network calls.

## Inputs and Outputs

- Input: a natural-language location query, such as "Find precise location details for 1600 Amphitheatre Parkway, Mountain View" or "What area is this Paris address in?"
- Output: `final_output`, including `status`, `message`, `result`, `result_source`, `recovery_path`, `needs_human_review`, and a non-sensitive diagnostic summary.
- Intermediate artifacts: parsed address, parsed city, primary result, fallback result, structured errors, event log, retry count, selected recovery action, and review flag.

Example precise-success output shape:

```json
{
  "status": "ok",
  "message": "Found precise location information for the requested address.",
  "result_source": "primary",
  "result": {
    "address": "1600 Amphitheatre Parkway, Mountain View, CA",
    "confidence": 0.94
  },
  "recovery_path": ["primary_success"],
  "needs_human_review": false
}
```

Example fallback output shape:

```json
{
  "status": "degraded",
  "message": "Precise lookup failed, but general area information is available.",
  "result_source": "fallback",
  "result": {
    "city": "Mountain View",
    "summary": "General area information for Mountain View, CA"
  },
  "recovery_path": ["primary_failed", "fallback_success"],
  "needs_human_review": false
}
```

Example input shape:

```json
{
  "input": "Find precise location details for 1600 Amphitheatre Parkway, Mountain View",
  "max_retries": 1
}
```

## Failure Cases

Document expected failures, retries, fallback behavior, and human-review points.

- Blank input should fail in `prepare_request` and route to `mark_for_review` or controlled finalization without tool calls.
- A malformed or incomplete location query should not trigger repeated precise lookup attempts; it should ask for clarification or mark review depending on implementation scope.
- Primary lookup timeout or temporary server error should be classified as `transient` and retried only while `retry_count < max_retries`.
- Primary lookup `not_found` should skip retry and attempt fallback if a broader area can be extracted.
- Primary lookup malformed output should be recorded as a validation failure even if no Python exception was raised.
- Fallback lookup failure should not crash finalization; the graph should return a controlled failure with diagnostic metadata.
- Severe errors, repeated failures, missing fallback data, or contradictory tool results should set `needs_human_review`.
- The graph should avoid exposing raw stack traces, credentials, or sensitive tool payloads in `final_output`.
- Logging failures should not mask the original error. If event logging is implemented through an injected dependency, failures should append a secondary error and continue to finalization.
- Retry behavior must not repeat invalid actions such as unsupported input, invalid credentials, or a known closed/unavailable service.

## Test Ideas

- Verify the happy path where the primary precise lookup succeeds and the graph finalizes without fallback.
- Verify a transient primary failure retries once and then succeeds.
- Verify a transient primary failure retries once, fails again, then uses fallback successfully.
- Verify a `not_found` primary result skips retry and uses fallback.
- Verify malformed primary output is treated as failure and recorded in `tool_errors`.
- Verify fallback failure produces `status: "failed"` or equivalent controlled failure without raising from the graph.
- Verify blank input stops before either tool is called.
- Verify no route can exceed `max_retries`.
- Verify severe errors set `needs_human_review` and preserve `last_error`.
- Verify final state always includes `final_output`, `event_log`, `tool_errors`, `retry_count`, and the selected `recovery_action`.
- Verify injected fake tools can exercise success, timeout, not found, malformed output, service unavailable, and fallback failure deterministically.

## Open Questions

- `docs/agentic-design-patterns-toc.md` lists Chapter 12 as logical pages `182-189`, but PDF text extraction shows the visible Chapter 12 section at page labels `196-203`, zero-based indexes `195-202`, with chapter-local page counters `1-8`.
- The chapter's ADK code references `get_precise_location_info` and `get_general_area_info` but does not define their schemas. The LangGraph implementation should define small typed fake tool contracts before implementation begins.
- Should controlled failure return `status: "failed"` directly, or should unrecoverable cases always route to a human-in-the-loop pattern once Chapter 13 is implemented?
- Should event logging stay in graph state for the first implementation, or should it use a shared observability interface when the project scaffold is finalized?
