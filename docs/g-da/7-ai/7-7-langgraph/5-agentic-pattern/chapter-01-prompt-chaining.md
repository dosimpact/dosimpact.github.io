---
sidebar_position: 1
---

# Requirement: Chapter 1: Prompt Chaining

## Source

- PDF: `Agentic_Design_Patterns.pdf`
- Section: `Chapter 1: Prompt Chaining`
- Page range: `18-29` logical pages from `docs/agentic-design-patterns-toc.md`
- Extraction note: the visible Chapter 1 heading was found at PDF page label `23` / zero-based index `22`, and Chapter 2 starts at PDF page label `36` / zero-based index `35`. This requirement uses the visible chapter boundary pages `23-35` for extraction while preserving the TOC range above as the cited logical range.

## Pattern Summary

Prompt chaining decomposes a complex LLM task into a sequence of focused sub-tasks. Each step has a narrow responsibility, and the output of one step becomes the input to the next step. This reduces instruction overload, contextual drift, hallucination risk, and hard-to-debug monolithic prompts.

Use this pattern when the task has multiple dependent stages, requires intermediate validation, benefits from structured handoff data, or needs deterministic processing or external tool calls between LLM calls. The chapter emphasizes structured intermediate outputs such as JSON because ambiguous natural-language handoffs can cause downstream failures.

For implementation, prompt chaining should behave like a stateful pipeline: preserve intermediate artifacts, validate each handoff, retry or repair malformed outputs when possible, and expose enough state for debugging.

## Pattern Explanation

### Conceptual Overview

Prompt chaining is the practice of splitting one large model task into smaller connected prompts. Instead of asking a model to understand, transform, validate, and format everything at once, each prompt performs one focused job and passes its result to the next step.

In agentic systems, this turns a vague LLM interaction into an observable workflow. Each step has a clear input, a clear output, and a place where validation or repair can happen before the next step depends on it.

### Problem

Large prompts often mix too many responsibilities. This makes outputs harder to predict, harder to test, and harder to recover when one part fails. Prompt chaining solves this by separating responsibilities and making intermediate outputs explicit.

### When to Use

- Use this pattern when a task has multiple dependent stages.
- Use it when intermediate outputs need validation, parsing, or transformation.
- Use it when a workflow benefits from debugging visibility between LLM calls.
- Use it when structured handoff data, such as JSON, is safer than free-form text.

### When Not to Use

- Avoid this pattern for simple one-step questions.
- Avoid it when every step depends on the same full context and splitting would add cost without clarity.
- Avoid unnecessary chains when latency, token cost, or orchestration complexity matters more than observability.

### How It Works

1. The workflow prepares or normalizes the original input.
2. A first prompt performs a narrow task, such as extracting candidate facts.
3. A later prompt transforms or refines the previous result into a stricter format.
4. A validator checks whether the handoff is parseable, complete, and grounded in the input.
5. The workflow either finalizes the result, repairs the bad step, or marks the result for review.

### Trade-offs

| Benefit | Cost or Risk |
| --- | --- |
| Easier debugging because intermediate outputs are visible. | More LLM calls can increase latency and cost. |
| Better reliability through focused prompts and validation. | Bad early outputs can still affect later steps if not validated. |
| Natural fit for structured output pipelines. | Requires careful schema and retry design. |

### Minimal Example

```text
Product text
  -> extract technical facts
  -> convert facts to JSON
  -> validate required fields
  -> final structured specs
```

### LangGraph Mapping

| Pattern Concept | LangGraph Element |
| --- | --- |
| Original task and intermediate outputs | State fields such as `input`, `raw_extraction`, and `specifications` |
| Each prompt in the chain | Node such as `extract_specs` or `transform_to_json` |
| Sequential handoff | Normal edge from one node to the next |
| Validation and repair decision | Conditional edge from `validate_output` |
| Exhausted repair path | Terminal node such as `mark_needs_review` |

## LangGraph Implementation Goal

Build a LangGraph example that converts unstructured product text into validated structured technical specifications. The user provides a product description such as a laptop description. The graph first extracts technical specifications from the text, then transforms the extracted information into a JSON-compatible object with required fields such as `cpu`, `memory`, and `storage`.

The example should demonstrate the core prompt chaining behavior from the chapter while using LangGraph state and conditional edges to make the workflow observable and reliable. The happy path is linear, but validation can route malformed or incomplete intermediate output through one repair prompt before finalizing or marking the result for review.

## State Shape

List the state fields the graph needs.

| Field | Type | Purpose |
| --- | --- | --- |
| `input` | `str` | Original user input or task description. |
| `clean_text` | `str` | Normalized source text passed into the extraction prompt. |
| `raw_extraction` | `str` | First LLM output containing extracted specifications. |
| `raw_transformation` | `str` | Second LLM output before JSON parsing and validation. |
| `specifications` | `dict` | Parsed structured result, expected to contain `cpu`, `memory`, and `storage`. |
| `missing_fields` | `list[str]` | Required fields that could not be found or validated. |
| `validation_errors` | `list[str]` | Parse errors, schema errors, unsupported values, or evidence mismatches. |
| `retry_count` | `int` | Number of repair attempts already performed. |
| `max_retries` | `int` | Configured cap for repair attempts. |
| `intermediate_artifacts` | `list[dict]` | Ordered record of prompt inputs, prompt outputs, parser results, and validation decisions. |
| `status` | `str` | Workflow status: `ok`, `needs_review`, or `failed`. |
| `final_output` | `dict` | User-facing result containing status, structured specifications, and validation metadata. |

## Nodes

| Node | Responsibility |
| --- | --- |
| `prepare_input` | Trim and normalize the input text, reject empty input, and initialize retry and artifact fields. |
| `extract_specs` | Run a focused extraction prompt that asks the model to identify only technical specifications from `clean_text`. |
| `transform_to_json` | Run a second focused prompt that converts `raw_extraction` into a strict JSON object with the required keys. |
| `validate_output` | Parse `raw_transformation`, validate required keys and value formats, detect missing fields, and record validation errors. |
| `repair_output` | When validation fails, run a targeted repair prompt using the original text, previous output, and validation errors. |
| `finalize` | Produce `final_output` when validation succeeds, including the structured object and selected metadata. |
| `mark_needs_review` | Stop the chain when repair is exhausted or required information is genuinely absent, preserving errors and artifacts. |

## Edges

Describe the graph flow, including conditional branches.

```text
START -> prepare_input -> extract_specs -> transform_to_json -> validate_output

validate_output -> finalize -> END
validate_output -> repair_output -> validate_output
validate_output -> mark_needs_review -> END
```

Conditional edge requirements:

- Route from `validate_output` to `finalize` when JSON parsing succeeds, required keys exist, and values are supported by the source text.
- Route from `validate_output` to `repair_output` when output is malformed or incomplete and `retry_count < max_retries`.
- Route from `validate_output` to `mark_needs_review` when repair attempts are exhausted or the input does not contain enough evidence for required fields.
- Increment `retry_count` only in the repair path.

## Inputs and Outputs

- Input: unstructured product or document text containing technical specifications.
- Output: a JSON-compatible dictionary with `cpu`, `memory`, and `storage`, plus `status` and validation metadata.
- Intermediate artifacts: cleaned input text, extraction prompt output, transformation prompt output, parser result, validation errors, missing fields, and repair attempts.

Example input shape:

```json
{
  "input": "The laptop includes a 3.5 GHz octa-core processor, 16GB RAM, and a 1TB NVMe SSD."
}
```

Example successful output shape:

```json
{
  "status": "ok",
  "specifications": {
    "cpu": "3.5 GHz octa-core processor",
    "memory": "16GB RAM",
    "storage": "1TB NVMe SSD"
  },
  "missing_fields": [],
  "validation_errors": []
}
```

## Failure Cases

Document expected failures, retries, fallback behavior, and human-review points.

- Empty or whitespace-only input should fail before any LLM call and set `status` to `failed`.
- Malformed JSON from the transformation prompt should be parsed as a validation error and routed to `repair_output` when retries remain.
- Missing required fields should not be hallucinated. The graph should either repair by rechecking the source text or return `needs_review` with the missing field list.
- Extracted values that are not supported by the source text should be rejected or marked for review.
- Oversized input should be handled by truncation, chunking, or a documented validation error before the extraction prompt.
- Repeated repair failure should end in `mark_needs_review`, not an infinite loop.
- Provider or model invocation errors should be captured in `validation_errors` or a dedicated runtime error field, then surfaced in `final_output`.

## Test Ideas

- Verify the happy path with the chapter-style laptop sentence and assert that `cpu`, `memory`, and `storage` are populated.
- Verify that a mocked malformed JSON response routes through `repair_output` and then finalizes after a valid repair.
- Verify that missing storage information returns `needs_review` or a documented null policy instead of inventing storage.
- Verify that `retry_count` increments only on the repair path and cannot exceed `max_retries`.
- Verify that `intermediate_artifacts` contains each prompt output and validation decision in execution order.
- Verify that empty input fails before calling the LLM.
- Verify that the final state always includes `status`, `final_output`, and validation metadata.

## Open Questions

- `docs/agentic-design-patterns-toc.md` lists Chapter 1 as logical pages `18-29`, but the PDF text extraction shows the visible Chapter 1 section at page labels `23-35`. Confirm whether future requirement documents should cite only TOC logical pages, extracted PDF labels, or both.
- Should the first implementation keep the chapter's fixed `cpu`, `memory`, and `storage` schema, or should it accept a configurable extraction schema to support broader document-processing examples?
- Should absent required fields be represented as `null` in `specifications`, omitted entirely, or treated as `needs_review`?
- Which model provider should the runnable example target first, and should structured output be enforced with provider-native JSON mode, LangChain parsers, or deterministic post-processing?
