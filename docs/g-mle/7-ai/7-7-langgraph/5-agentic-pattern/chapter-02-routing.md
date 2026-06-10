---
sidebar_position: 2
---

# Requirement: Chapter 2 - Routing

## Source

- PDF: `Agentic_Design_Patterns.pdf`
- Section: `Chapter 2: Routing`
- Page range: logical pages 30-42 from `docs/agentic-design-patterns-toc.md`
- Extraction note: Chapter 2 begins at PDF page index 35, file page 36, and Chapter 3 begins at PDF page index 49, file page 50. The extracted Chapter 2 span therefore appears to be PDF indexes 35-48, file pages 36-49, with extracted chapter page counters 1-14. This is ambiguous because the TOC logical range 30-42 is 13 pages.

## Pattern Summary

Routing adds conditional control flow to an agentic system. Instead of running every request through one fixed prompt chain, the system first evaluates the request, current state, or prior result, then selects the most appropriate next workflow, tool, or specialist agent.

Use this pattern when an agent must triage diverse inputs into distinct handling paths. Chapter 2 describes customer inquiries that may need order-status lookup, product information retrieval, technical-support handling, human escalation, or clarification when intent is unclear. The routing decision can be implemented with an LLM classifier, embedding similarity, deterministic rules, or a supervised classifier. For a first LangGraph implementation, the router should expose a testable interface so production code can use an LLM while tests can inject deterministic routing decisions.

Expected behavior:

- Analyze the incoming user request before invoking a specialist handler.
- Emit a constrained route label rather than free-form routing text.
- Dispatch to exactly one route for the initial example.
- Preserve the route decision, reason, confidence, and handler output in graph state.
- Route unclear, unsupported, low-confidence, or malformed decisions to a clarification or fallback path.

## Pattern Explanation

### Conceptual Overview

Routing lets an agentic system choose the right path for a request before doing the main work. A router examines the input or current state, assigns a constrained destination, and sends the workflow to a matching handler.

This is different from a single prompt chain because the next step is not fixed. The workflow adapts based on intent, confidence, request type, or policy constraints.

### Problem

Many agentic applications receive mixed user requests. A customer-support assistant may see order questions, product questions, technical issues, and unclear requests in the same interface. A single generic handler can become broad, brittle, and hard to evaluate. Routing solves this by separating classification from specialized handling.

### When to Use

- Use this pattern when inputs fall into known categories.
- Use it when different categories require different tools, prompts, policies, or specialists.
- Use it when unclear or low-confidence inputs should be clarified before action.
- Use it when observability of the decision path matters.

### When Not to Use

- Avoid this pattern when all requests should follow the same workflow.
- Avoid it when categories are unstable or poorly defined.
- Avoid over-routing when a wrong route is more harmful than asking a clarification question.
- Avoid relying on unconstrained free-form router output.

### How It Works

1. The workflow normalizes and validates the user input.
2. A router classifies the input into one of a small set of allowed route labels.
3. A validator checks the route label, confidence, and fallback policy.
4. A conditional edge dispatches the state to the selected specialist handler.
5. The selected handler produces the domain-specific response, then a formatter returns the final answer.

### Trade-offs

| Benefit | Cost or Risk |
| --- | --- |
| Keeps specialist prompts and tools focused. | Incorrect routing can send the user to the wrong workflow. |
| Makes behavior easier to test by route. | Requires route labels, confidence thresholds, and fallback policy. |
| Supports scalable multi-handler systems. | More branches increase maintenance and observability needs. |

### Minimal Example

```text
Customer request
  -> classify route
  -> validate route
  -> order_status | product_info | technical_support | clarify
  -> final response
```

### LangGraph Mapping

| Pattern Concept | LangGraph Element |
| --- | --- |
| Route decision | State fields `route`, `route_reason`, and `route_confidence` |
| Router | Node `classify_route` |
| Route validation | Node `validate_route` |
| Branch selection | Conditional edge reading `route` |
| Specialist workflows | Handler nodes such as `order_status_handler` |
| Fallback | `clarification_handler` branch |

## LangGraph Implementation Goal

Build a LangGraph customer-inquiry router that classifies an input request and dispatches it to one of four specialist nodes:

- `order_status_handler` for order tracking or account/order lookup requests.
- `product_info_handler` for product catalog, feature, price, compatibility, or availability questions.
- `technical_support_handler` for troubleshooting and support requests.
- `clarification_handler` for unclear, unsupported, or low-confidence requests.

The example should demonstrate LangGraph conditional edges rather than a linear chain. The router node may use an LLM prompt that returns a structured decision, but the graph should be written so tests can replace that router with a deterministic rule-based or fake classifier.

## State Shape

List the state fields the graph needs.

| Field | Type | Purpose |
| --- | --- | --- |
| `input` | `str` | Original user request. |
| `normalized_input` | `str` | Trimmed and normalized request used for classification. |
| `route` | `Literal["order_status", "product_info", "technical_support", "clarify"] \| None` | Constrained destination selected by the router. |
| `route_reason` | `str \| None` | Short explanation for observability and debugging. |
| `route_confidence` | `float \| None` | Optional confidence score from the router or classifier. |
| `handler_output` | `str \| None` | Output produced by the selected specialist handler. |
| `final_output` | `str \| None` | User-facing response returned by the graph. |
| `errors` | `list[str]` | Recoverable parsing, classification, or handler errors encountered during execution. |
| `retry_count` | `int` | Number of router retries attempted after invalid output or transient failure. |
| `requires_human_review` | `bool` | Whether the request should be escalated instead of answered automatically. |
| `metadata` | `dict[str, Any]` | Optional request IDs, user/account IDs, route model name, or trace data. |

## Nodes

| Node | Responsibility |
| --- | --- |
| `preprocess_input` | Validate that `input` is present, normalize whitespace, and initialize default state fields. |
| `classify_route` | Analyze `normalized_input` and produce a constrained route decision, reason, and optional confidence. |
| `validate_route` | Normalize router output, reject unknown labels, apply confidence thresholds, and map invalid decisions to `clarify`. |
| `order_status_handler` | Simulate or invoke order-status retrieval for order tracking requests. |
| `product_info_handler` | Simulate or invoke product catalog lookup for product-related questions. |
| `technical_support_handler` | Simulate or invoke troubleshooting guidance; set `requires_human_review` for complex or unsafe support cases. |
| `clarification_handler` | Ask a targeted follow-up question when the request is ambiguous or unsupported. |
| `format_response` | Convert the selected handler result into `final_output` while preserving trace fields. |

## Edges

Describe the graph flow, including conditional branches.

```text
START
  -> preprocess_input
  -> classify_route
  -> validate_route
  -> route_by_decision

route_by_decision:
  order_status      -> order_status_handler
  product_info      -> product_info_handler
  technical_support -> technical_support_handler
  clarify           -> clarification_handler

order_status_handler      -> format_response -> END
product_info_handler      -> format_response -> END
technical_support_handler -> format_response -> END
clarification_handler     -> format_response -> END
```

Conditional edge requirements:

- The conditional edge must read only normalized, validated state such as `route`.
- Unknown, empty, or malformed route labels must not raise by default; they should route to `clarification_handler` and append an error.
- If `classify_route` fails transiently, the graph may retry up to the configured `retry_count` limit before falling back to clarification.
- If `technical_support_handler` identifies a request requiring human review, it should still pass through `format_response`, but `final_output` must make the escalation status clear.

## Inputs and Outputs

- Input: a single natural-language customer request, plus optional metadata such as user ID, account ID, or test route override.
- Output: `final_output`, the selected `route`, and diagnostic fields needed to verify the path taken.
- Intermediate artifacts: normalized input, router raw output if available, route reason, confidence score, handler output, errors, and human-review flag.

Example input shape:

```json
{
  "input": "Where is order 12345?",
  "user_id": "user-123",
  "metadata": {
    "channel": "chat"
  }
}
```

Example input categories:

- Order status: "Where is order 12345?"
- Product information: "Does this laptop support two external monitors?"
- Technical support: "My device will not connect to Wi-Fi."
- Clarification: "Can you help me with that thing from yesterday?"

## Failure Cases

Document expected failures, retries, fallback behavior, and human-review points.

- Missing or blank `input`: stop in preprocessing with a clarification response and an error entry.
- LLM router returns prose instead of an allowed label: validate, append an error, optionally retry, then route to clarification.
- Router chooses a valid label with confidence below threshold: route to clarification rather than invoking the wrong handler.
- Request contains multiple intents, such as order status plus troubleshooting: either choose the dominant intent and record the reason, or ask for clarification in the initial implementation.
- Handler raises a recoverable exception: append the error and return a fallback response from `format_response`.
- Technical support request is high risk, account-specific, or requires privileged action: set `requires_human_review = true` and produce an escalation-oriented response.
- Embedding-based or ML-based router is unavailable: fall back to rule-based or LLM-based routing if configured; otherwise clarify.

## Test Ideas

- Verify the happy path for each route: order status, product info, technical support, and clarification.
- Verify that each happy-path input executes exactly one specialist handler.
- Verify malformed router output routes to `clarification_handler` and records an error.
- Verify low-confidence routing does not call a specialist handler.
- Verify a blank input produces a clarification response without calling `classify_route`.
- Verify handler exceptions are captured in `errors` and still produce `final_output`.
- Verify `technical_support_handler` can set `requires_human_review`.
- Verify final state contains `input`, `normalized_input`, `route`, `handler_output`, `final_output`, and `errors`.
- Use a fake classifier in unit tests so route selection is deterministic and does not require network access.

## Open Questions

- The TOC lists Chapter 2 as logical pages 30-42, but extracted PDF boundaries show Chapter 2 from PDF index 35 through 48, with Chapter 3 starting at index 49. This produces 14 extracted pages, not 13 logical pages.
- The chapter presents multiple routing implementation styles: LLM-based, embedding-based, rule-based, and supervised classifier-based. The first LangGraph example should likely use LLM-based routing with a deterministic fake for tests, but the repository has not yet standardized model providers or test fixtures.
- The chapter examples include both customer-support categories and a booking/info/unclear coordinator. This requirement uses the customer-support categories because they are broader and map cleanly to distinct LangGraph branches.
