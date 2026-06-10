---
sidebar_position: 8
---

# Requirement: Chapter 8: Memory Management

## Source

- PDF: `Agentic_Design_Patterns.pdf`
- Section: `Chapter 8: Memory Management`
- Page range: `121-141` logical pages from `docs/agentic-design-patterns-toc.md`
- Extraction note: the visible Chapter 8 heading was found at one-based PDF page `132` / zero-based index `131`, and Chapter 9 starts at one-based PDF page `154` / zero-based index `153`. This requirement uses the visible chapter boundary pages `132-153` for extraction while preserving the TOC range above as the cited logical range.

## Pattern Summary

Memory management gives an agent continuity across turns and across sessions. The chapter separates memory into short-term contextual memory, which keeps the active conversation coherent, and long-term persistent memory, which stores reusable facts, preferences, learned experiences, or instructions outside the immediate context window.

Use this pattern when an agent must track conversation history, maintain task progress, personalize responses, retrieve prior knowledge, or learn from previous interactions. The chapter emphasizes that context windows are limited and ephemeral, so durable memory needs explicit storage and retrieval mechanisms rather than relying on the full chat transcript.

For implementation, memory management should behave like a controlled read-write loop: retrieve relevant memories before response generation, keep only useful short-term context in the prompt, extract durable memory candidates after the turn, validate what is safe and useful to persist, and store memories under predictable namespaces and keys.

## Pattern Explanation

### Conceptual Overview

Memory management is the practice of deciding what an agent should remember, where that information should live, and when it should be recalled. Short-term memory is the working context for the current thread. Long-term memory is an external store that survives individual conversations.

The chapter presents memory as a practical requirement for agents that need to be more than stateless question-answering systems. A memory-aware agent can resume a thread, remember user preferences, reuse prior successful task strategies, and retrieve relevant knowledge when the current prompt does not contain everything it needs.

### Problem

LLM calls are naturally stateless unless the application supplies context. If every turn is handled independently, the agent forgets prior messages, loses task progress, cannot personalize future interactions, and cannot reuse knowledge from past sessions. If the application simply stuffs all prior text into the prompt, it can exceed the context window, raise cost, and introduce irrelevant or stale information.

Memory management solves this by separating immediate thread state from persistent knowledge and by making retrieval and storage explicit parts of the agent workflow.

### When to Use

- Use this pattern when an agent needs coherent multi-turn conversation within a thread.
- Use it when an agent must resume tasks or track progress across steps.
- Use it when personalization depends on remembered user preferences, profile facts, or past issues.
- Use it when prior conversations or external knowledge should be semantically searchable.
- Use it when the agent should store reusable examples, successful workflows, or procedural instructions.
- Use it when context-window limits require summarizing, filtering, or retrieving only relevant memory.

### When Not to Use

- Avoid this pattern for simple one-shot tasks where no information should persist.
- Avoid long-term memory when retention, consent, deletion, or privacy rules are not defined.
- Avoid writing every interaction to memory without filtering; noisy memory degrades retrieval quality.
- Avoid persistent personalization when stale or contradictory facts would be worse than asking again.
- Avoid external memory stores for deterministic workflows that already receive all required state as input.
- Avoid procedural self-updates unless the system has review, rollback, and evaluation controls.

### How It Works

1. The graph receives a user message with a stable thread ID and, for persistent memory, a user or application namespace.
2. Short-term memory is loaded from graph state or a checkpointer so recent messages, summaries, and task progress are available.
3. Long-term memory is searched by namespace and query to retrieve relevant facts, preferences, examples, or instructions.
4. The graph builds a bounded prompt from the current input, recent thread context, optional summary, and retrieved memories.
5. The model generates a response grounded in the current turn and the recalled memory.
6. A memory extraction step identifies durable facts or updates from the new turn, such as preferences or corrected profile data.
7. A validation step filters transient, sensitive, unsupported, duplicate, or contradictory memory candidates.
8. Approved memories are written to the long-term store with predictable namespace and key values.
9. The graph finalizes the response and records metadata about what was retrieved, stored, skipped, or flagged.

### Trade-offs

| Benefit | Cost or Risk |
| --- | --- |
| Maintains coherent multi-turn conversations. | Requires careful state and checkpoint management. |
| Enables personalization across sessions. | Persistent user memory creates privacy, consent, and deletion obligations. |
| Reduces prompt bloat by retrieving only relevant memory. | Retrieval can return irrelevant, stale, or contradictory information. |
| Supports learning from prior interactions and examples. | Poor memory extraction can save noisy or hallucinated facts. |
| Makes task progress resumable. | Concurrent writes can overwrite or duplicate memory without key discipline. |
| Lets procedural instructions evolve over time. | Self-modifying instructions can degrade behavior without evaluation and rollback. |

### Minimal Example

```text
Turn 1:
  User: "Remember that I prefer morning flights and aisle seats."
  -> extract durable preferences
  -> store under ("user-123", "travel_preferences")

Later turn:
  User: "Find me a flight to Denver."
  -> load thread context
  -> search long-term memory for travel preferences
  -> generate response using morning flight and aisle-seat preferences
  -> store any new durable preferences from the turn
```

### LangGraph Mapping

| Pattern Concept | LangGraph Element |
| --- | --- |
| Current conversation thread | State field such as `messages`, persisted by a checkpointer |
| Bounded working context | State fields such as `short_term_summary`, `recent_messages`, and `prompt_context` |
| Long-term memory repository | LangGraph `BaseStore` / `InMemoryStore` or a production-backed store |
| User or app memory scope | Store namespace such as `(user_id, "profile")` or `(app_id, "procedures")` |
| Specific remembered fact | Store key plus JSON value, for example `"travel_preferences"` |
| Semantic recall | Store `search()` call using the current request as query |
| Memory extraction | Node such as `extract_memory_candidates` |
| Memory validation and filtering | Node such as `validate_memory_updates` |
| Memory write | Node such as `store_memory_updates` |
| Retrieval/write decisions | Conditional edges for `has_retrieval_error`, `has_memory_updates`, and `needs_review` |

## LangGraph Implementation Goal

Build a LangGraph example for a memory-aware travel assistant. The user can tell the assistant durable preferences, such as preferred flight times, seat choices, hotel constraints, or dietary needs. Later, in the same or a different thread for the same user, the assistant retrieves those preferences and uses them to answer a new travel-planning request.

The example should demonstrate both memory types from the chapter:

- Short-term memory: thread-scoped messages and task progress, persisted through a LangGraph checkpointer.
- Long-term memory: user-scoped facts stored as JSON documents in a LangGraph store, organized by namespace and key, and retrieved before response generation.

The workflow should not store every user sentence. It should extract only durable, user-relevant facts, validate them, and record skipped candidates with reasons. The final response should expose enough metadata for tests to assert which memories were retrieved and which were written.

## State Shape

List the state fields the graph needs.

| Field | Type | Purpose |
| --- | --- | --- |
| `input` | `str` | Original user input or task description. |
| `user_id` | `str` | Stable user identifier used to namespace long-term memories. |
| `thread_id` | `str` | Stable conversation thread identifier used by the checkpointer. |
| `messages` | `list` | Current thread messages used as short-term memory. |
| `short_term_summary` | `str` | Optional compact summary of older thread context when message history is too long. |
| `retrieval_query` | `str` | Query derived from the current input for long-term memory search. |
| `retrieved_memories` | `list[dict]` | Memories returned from the store, including namespace, key, value, and score when available. |
| `prompt_context` | `dict` | Bounded context passed to the model, combining input, recent messages, summary, and retrieved memories. |
| `response` | `str` | Assistant response generated for the current turn. |
| `memory_candidates` | `list[dict]` | Candidate facts, preferences, examples, or instruction updates extracted from the turn. |
| `approved_memory_updates` | `list[dict]` | Validated memories to persist in the long-term store. |
| `skipped_memory_updates` | `list[dict]` | Rejected candidates with reasons such as transient, duplicate, sensitive, or unsupported. |
| `memory_write_results` | `list[dict]` | Results of store writes, including namespace, key, and success or error metadata. |
| `errors` | `list[str]` | Retrieval, validation, model, or store errors encountered during the turn. |
| `status` | `str` | Workflow status: `ok`, `needs_review`, or `failed`. |
| `final_output` | `dict` | User-facing response plus retrieved-memory and memory-write metadata. |

## Nodes

| Node | Responsibility |
| --- | --- |
| `prepare_turn` | Validate `input`, `user_id`, and `thread_id`; initialize state fields; append the user message to short-term state. |
| `build_retrieval_query` | Convert the current input and relevant short-term context into a focused search query. |
| `retrieve_long_term_memory` | Search the user-scoped store namespace for relevant semantic, episodic, or procedural memories. |
| `compact_short_term_memory` | Summarize or trim older messages when the thread context is too large for the prompt budget. |
| `build_prompt_context` | Combine the current input, recent messages, summary, and retrieved memories into a bounded model context. |
| `generate_response` | Generate the assistant reply using the prepared context and retrieved memory. |
| `extract_memory_candidates` | Inspect the user input and response for durable facts or preferences worth storing. |
| `validate_memory_updates` | Reject unsupported, transient, sensitive, duplicate, or contradictory memory candidates; normalize approved values. |
| `store_memory_updates` | Persist approved memory JSON documents under deterministic namespaces and keys. |
| `finalize` | Return the assistant response with status, retrieved memories, stored updates, skipped updates, and errors. |
| `mark_needs_review` | Stop with review metadata when memory conflicts, privacy concerns, or store failures require human handling. |

## Edges

Describe the graph flow, including conditional branches.

```text
START -> prepare_turn -> build_retrieval_query -> retrieve_long_term_memory
retrieve_long_term_memory -> compact_short_term_memory -> build_prompt_context -> generate_response
generate_response -> extract_memory_candidates -> validate_memory_updates

validate_memory_updates -> store_memory_updates -> finalize -> END
validate_memory_updates -> finalize -> END
validate_memory_updates -> mark_needs_review -> END
retrieve_long_term_memory -> mark_needs_review -> END
```

Conditional edge requirements:

- Route from `retrieve_long_term_memory` to `compact_short_term_memory` when search succeeds or returns no matches.
- Route from `retrieve_long_term_memory` to `mark_needs_review` only when memory retrieval fails in a way that makes personalization unsafe or misleading.
- Route from `validate_memory_updates` to `store_memory_updates` when at least one approved memory update exists.
- Route from `validate_memory_updates` directly to `finalize` when there are no durable updates to store and no review condition.
- Route from `validate_memory_updates` to `mark_needs_review` when a candidate conflicts with existing memory, includes sensitive data that requires policy review, or cannot be safely normalized.
- `store_memory_updates` should preserve the generated response even if an optional memory write fails; the failure should be surfaced in `errors` and `final_output`.

## Inputs and Outputs

- Input: a user message, `user_id`, and `thread_id`.
- Output: assistant response plus status and memory metadata.
- Intermediate artifacts: retrieval query, retrieved memories, short-term summary, prompt context, memory candidates, approved updates, skipped updates, and write results.

Example successful output shape:

```json
{
  "status": "ok",
  "response": "I will prioritize morning flights and aisle seats for the Denver options.",
  "retrieved_memories": [
    {
      "namespace": ["user-123", "travel"],
      "key": "preferences",
      "value": {
        "flight_time": "morning",
        "seat": "aisle"
      }
    }
  ],
  "stored_updates": [],
  "skipped_updates": [
    {
      "candidate": "Find me a flight to Denver.",
      "reason": "transient request, not durable memory"
    }
  ],
  "errors": []
}
```

Example input shape:

```json
{
  "input": "Please find flight options for my Denver trip next month.",
  "user_id": "user-123",
  "thread_id": "thread-456"
}
```

## Failure Cases

Document expected failures, retries, fallback behavior, and human-review points.

- Missing or empty `input` should fail before model invocation and set `status` to `failed`.
- Missing `user_id` should disable long-term memory or fail with a clear validation error, depending on the implementation policy.
- Missing `thread_id` should fail before checkpointed short-term memory is used.
- Retrieval store unavailable should not silently pretend there are no memories; record an error and decide whether to continue without personalization or route to review.
- Irrelevant retrieved memories should be filtered before prompt construction to avoid confusing the model.
- Context overflow should trigger `compact_short_term_memory` rather than passing an unbounded transcript.
- Memory candidates unsupported by the current user message should be skipped to avoid storing hallucinated facts.
- Sensitive or regulated information should not be persisted unless the implementation has an explicit retention policy.
- Contradictory updates, such as a changed preference, should either replace the prior value with conflict metadata or route to `mark_needs_review`.
- Duplicate memory candidates should update an existing key or be skipped instead of creating noisy repeated memories.
- Store write failure should preserve the user response but surface the failed write and avoid reporting that memory was saved.
- Procedural memory updates should require stricter validation or review because they can alter future agent behavior.

## Test Ideas

- Verify the happy path where a user states a durable travel preference and the graph stores it under the expected namespace and key.
- Verify cross-thread recall by creating a second thread for the same `user_id` and asserting the stored preference is retrieved and used in the response metadata.
- Verify short-term continuity by checking that thread messages persist through the configured checkpointer.
- Verify that a transient request, such as "Book a flight to Denver", is skipped as long-term memory.
- Verify that no memory is written when extraction returns only duplicates of existing stored facts.
- Verify that a contradictory preference is either normalized as an update with conflict metadata or routed to `needs_review`.
- Verify that retrieval errors are captured in `errors` and do not masquerade as an empty memory result.
- Verify that context compaction runs when message history exceeds the configured prompt budget.
- Verify that `final_output` always includes `status`, `response`, `retrieved_memories`, `stored_updates`, `skipped_updates`, and `errors`.
- Verify that tests can run with an in-memory store and mocked model outputs without network access.

## Open Questions

- `docs/agentic-design-patterns-toc.md` lists Chapter 8 as logical pages `121-141`, but the visible Chapter 8 extraction starts at one-based PDF page `132` / zero-based index `131`, and Chapter 9 starts at one-based PDF page `154` / zero-based index `153`. Confirm whether future documents should standardize on TOC logical pages plus visible PDF boundaries.
- The extracted Chapter 8 pages include chapter-local footer numbers `1-22`, so the visible extracted span is 22 pages while the TOC range `121-141` is 21 inclusive pages. The requirement preserves both rather than forcing a single numbering scheme.
- The chapter covers ADK, LangChain, LangGraph, and Vertex Memory Bank. The LangGraph example should probably focus on native checkpointer plus store behavior, while keeping external managed memory services out of scope for the first implementation.
- Should the implementation persist changed user preferences by overwriting a profile-style JSON document, appending individual fact documents, or supporting both strategies?
- Should sensitive-memory filtering be a lightweight deterministic validator in this chapter's graph, or deferred to the later Guardrails/Safety pattern?
