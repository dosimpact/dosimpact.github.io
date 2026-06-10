---
sidebar_position: 10
---

# Requirement: Chapter 10: Model Context Protocol (MCP)

## Source

- PDF: `Agentic_Design_Patterns.pdf`
- Section: `Chapter 10: Model Context Protocol`
- Page range: `154-169` logical pages from `docs/agentic-design-patterns-toc.md`
- Extraction note: the visible Chapter 10 heading was found at PDF page label `167` / one-based file page `167` / zero-based index `166`. Chapter 11 starts at PDF page label `183` / one-based file page `183` / zero-based index `182`. The extracted Chapter 10 span is therefore PDF indexes `166-181`, file pages `167-182`, with chapter-local page counters `1-16`. This is ambiguous because the TOC logical range `154-169` covers the same 16-page length but does not match the PDF page labels or file indexes.

## Pattern Summary

The Model Context Protocol (MCP) gives agentic applications a standardized way to discover and use external resources, prompts, and tools. Instead of wiring every LLM application directly to every API, an MCP client connects to one or more MCP servers, discovers their capabilities, sends standardized requests, and receives standardized responses that can be added back into the agent context.

The chapter presents MCP as broader than direct tool function calling. Function calling is usually a provider-specific, one-to-one mechanism for invoking predefined functions. MCP is a client-server protocol intended for interoperable, reusable, and dynamically discoverable integrations across tools, data sources, applications, and models.

For implementation, this requirement should demonstrate MCP as an orchestration boundary inside a LangGraph workflow: discover server capabilities, decide whether a resource, prompt, or tool is needed, validate that the exposed interface is safe and agent-friendly, execute the selected capability through an MCP client adapter, and route failures or unsafe actions to fallback or review.

## Pattern Explanation

### Conceptual Overview

MCP is a common connection layer between an agent and the outside systems it needs to use. The agent does not need bespoke code for every database, file server, media service, or internal API. It can ask an MCP server what it exposes, choose the relevant capability, call it through a standard interface, and use the response as new context for the next reasoning step.

The chapter emphasizes that MCP is not magic. It standardizes the interface, but the underlying API still has to be useful to an agent. A server that returns opaque files, unfiltered records, or poorly structured output may technically be MCP-compliant while still being hard for an LLM to use.

### Problem

Agents often need current data, external software, and operational actions. Without a shared protocol, each integration becomes custom application code tied to one LLM provider, one host application, or one fixed set of functions. This makes complex agent systems harder to reuse, test, scale, and adapt as available capabilities change.

MCP solves this by separating the agent host from the external capability provider. Servers expose resources, prompts, and tools through a standardized contract; clients discover and invoke those capabilities; the agent reasons over the returned context or execution result.

### When to Use

- Use this pattern when an agent must interact with multiple external systems, tools, APIs, databases, or files.
- Use it when tool capabilities should be reusable across different agents, host applications, or LLM providers.
- Use it when agents need dynamic discovery of available capabilities rather than a fixed list hard-coded into the prompt.
- Use it when local or remote services need to expose resources, prompts, or tools through a predictable client-server boundary.
- Use it when an organization wants a shared integration layer for common tools such as databases, document stores, email systems, media generation, or internal services.
- Use it when a workflow may combine several external capabilities into a multi-step agentic task.

### When Not to Use

- Avoid this pattern for simple applications with one or two stable functions where direct tool calling is easier and sufficient.
- Avoid wrapping legacy APIs unchanged when they lack filtering, sorting, stable schemas, or agent-readable outputs.
- Avoid exposing tools through MCP before authentication, authorization, and action-scoping rules are defined.
- Avoid MCP when the response data is opaque to the agent, such as raw PDFs or binary files without a text extraction layer.
- Avoid dynamic capability use when deterministic business logic or fixed workflows are required for compliance.
- Avoid remote MCP servers for sensitive data unless transport security, credentials, audit logging, and tenancy boundaries are clear.

### How It Works

1. An MCP server exposes capabilities as resources, prompts, and tools for a specific domain such as a file system, database, media service, or internal API.
2. An MCP client in the agent host connects to the server over an available transport such as STDIO for local servers or HTTP/SSE-style transports for remote servers.
3. The client discovers the server manifest and records available capability names, descriptions, schemas, and access constraints.
4. The LLM or graph planner decides whether the current user request needs an external resource, reusable prompt, or executable tool.
5. The graph validates the selected capability, required parameters, permissions, and data shape before invocation.
6. The MCP client sends a standardized request to the server.
7. The server authenticates and validates the request, then reads a resource, applies a prompt, or executes a tool against the underlying service.
8. The server returns a standardized response with output or error metadata.
9. The graph adds the result to state, lets the model produce the next response, retries or selects another capability on recoverable errors, and routes unsafe or unauthorized actions to review.

### Trade-offs

| Benefit | Cost or Risk |
| --- | --- |
| Standardizes LLM-to-system communication across tools, data sources, and applications. | Adds protocol, transport, and client/server lifecycle complexity. |
| Promotes reusable MCP servers instead of one-off tool integrations. | Poorly designed server schemas can still be difficult for agents to use. |
| Supports dynamic discovery of new capabilities. | Dynamic tool availability requires stronger validation and test coverage. |
| Decouples agent host code from underlying services. | Authentication, authorization, and audit logging become mandatory design concerns. |
| Works for resources, prompts, and tools instead of only executable functions. | Opaque or unstructured resource outputs can degrade agent reasoning. |
| Can support local, remote, on-demand, and batch use cases. | Transport failures, server availability, and timeout handling need explicit routing. |

### Minimal Example

```text
User: "Summarize the open high-priority support tickets."

Graph:
  -> discover MCP servers
  -> find a ticketing server with search_tickets and read_ticket resources
  -> validate that search_tickets supports priority/status filters
  -> call search_tickets(priority="high", status="open")
  -> if results are structured and bounded: summarize them
  -> if server lacks filters or returns opaque records: ask for a safer query or route to review
```

### LangGraph Mapping

| Pattern Concept | LangGraph Element |
| --- | --- |
| User request requiring external context or action | State fields `input`, `intent`, and `operation_type` |
| MCP client | Injectable `mcp_client` dependency used by discovery and invocation nodes |
| MCP server manifest | State field `capability_manifest` |
| Resource, prompt, or tool | State field `selected_capability` with `capability_type` |
| Dynamic discovery | Node `discover_capabilities` |
| Capability selection | Node `select_capability` |
| Agent-friendly API check | Node `validate_capability` and conditional edge to fallback or review |
| Standardized request | State field `mcp_request` built by `build_mcp_request` |
| Server execution result | State field `mcp_result` from `invoke_mcp_capability` |
| Error handling | Conditional edges after discovery, validation, and invocation |
| Context update for final answer | Node `integrate_result` and state field `context_update` |

## LangGraph Implementation Goal

Build a LangGraph example of an MCP-aware operations assistant. The user asks for help with a task that may require external context or action, such as listing files in a managed folder, reading a known text file, querying a mock ticket database, or greeting a named person through a sample MCP tool.

The graph should use an injected MCP client adapter rather than hard-coding direct tool calls into the graph. For tests, the adapter can be a deterministic fake that returns MCP-like manifests, resources, tool results, and errors. A later production version may connect to a local STDIO MCP server, an HTTP FastMCP server, or a community server, but the first implementation should keep the workflow deterministic and offline-testable.

Expected workflow outcome:

- The graph discovers available MCP capabilities before selection.
- The graph distinguishes resources, prompts, and tools.
- The graph validates that the selected capability is allowed, has the required parameters, and returns agent-readable data.
- The graph invokes the capability through the MCP client adapter and integrates the result into the final answer.
- Discovery failures, unavailable servers, invalid parameters, unauthorized actions, opaque outputs, and execution errors are surfaced clearly instead of hidden.

## State Shape

List the state fields the graph needs.

| Field | Type | Purpose |
| --- | --- | --- |
| `input` | `str` | Original user request or task description. |
| `intent` | `str \| None` | Interpreted user intent, such as `read_resource`, `execute_tool`, `use_prompt`, or `answer_without_mcp`. |
| `operation_type` | `str \| None` | Requested MCP category: `resource`, `tool`, `prompt`, or `none`. |
| `server_preferences` | `list[str]` | Optional preferred server names or domains supplied by configuration or user input. |
| `capability_manifest` | `dict[str, Any]` | Discovered MCP servers and their resources, prompts, tools, schemas, descriptions, and constraints. |
| `candidate_capabilities` | `list[dict]` | Capabilities that might satisfy the user request. |
| `selected_capability` | `dict[str, Any] \| None` | Chosen MCP capability, including server, name, type, schema, and reason for selection. |
| `capability_validation` | `dict[str, Any]` | Validation result covering allowed action, required args, schema fit, output readability, and risk flags. |
| `mcp_request` | `dict[str, Any] \| None` | Standardized request payload prepared for the selected MCP server. |
| `mcp_result` | `dict[str, Any] \| None` | Standardized response or error returned by the MCP client adapter. |
| `context_update` | `dict[str, Any] \| None` | Agent-readable context derived from the MCP result, such as text content, records, or confirmation metadata. |
| `fallback_reason` | `str \| None` | Reason MCP was skipped, failed, or routed away from automatic execution. |
| `needs_human_review` | `bool` | Whether the request requires human approval or manual handling. |
| `errors` | `list[str]` | Discovery, validation, transport, authorization, execution, parsing, or schema errors. |
| `final_output` | `dict[str, Any] \| None` | User-facing response with status, selected capability, MCP result summary, and errors. |

## Nodes

| Node | Responsibility |
| --- | --- |
| `preprocess_request` | Validate non-empty input, normalize text, initialize state fields, and identify whether the request may need MCP. |
| `classify_intent` | Classify the request as resource retrieval, tool execution, prompt use, or no MCP needed. |
| `discover_capabilities` | Query configured MCP servers through the client adapter and populate `capability_manifest`. |
| `select_capability` | Choose candidate and selected capabilities based on intent, server descriptions, schemas, and user constraints. |
| `validate_capability` | Check allowlist policy, required parameters, schema compatibility, output readability, and whether the action needs review. |
| `build_mcp_request` | Convert the selected capability and user request into a structured MCP request payload. |
| `invoke_mcp_capability` | Call the MCP client adapter and capture either a standardized result or structured error. |
| `integrate_result` | Convert MCP output into agent-readable context and detect opaque, oversized, or malformed outputs. |
| `generate_final_response` | Produce the final answer using the original input, selected capability, context update, and errors. |
| `answer_without_mcp` | Return a normal response when no external capability is required or no safe capability is available. |
| `mark_needs_review` | Stop automatic execution for unsafe, unauthorized, high-impact, or ambiguous actions. |

## Edges

Describe the graph flow, including conditional branches.

```text
START
  -> preprocess_request
  -> classify_intent

classify_intent -> answer_without_mcp -> generate_final_response -> END
classify_intent -> discover_capabilities -> select_capability -> validate_capability

validate_capability -> build_mcp_request -> invoke_mcp_capability -> integrate_result -> generate_final_response -> END
validate_capability -> answer_without_mcp -> generate_final_response -> END
validate_capability -> mark_needs_review -> generate_final_response -> END

invoke_mcp_capability -> select_capability
invoke_mcp_capability -> mark_needs_review -> generate_final_response -> END
integrate_result -> mark_needs_review -> generate_final_response -> END
```

Conditional edge requirements:

- Route from `classify_intent` to `answer_without_mcp` when the request does not require external context or action.
- Route from `discover_capabilities` to `answer_without_mcp` when no server is configured or no capability can satisfy the request.
- Route from `select_capability` to `answer_without_mcp` when only weak or irrelevant capabilities are available.
- Route from `validate_capability` to `build_mcp_request` when the selected capability is allowed, parameters are complete, and output is expected to be agent-readable.
- Route from `validate_capability` to `mark_needs_review` when the capability could write files, send messages, update records, control devices, execute financial actions, or access sensitive data without explicit approval.
- Route from `validate_capability` to `answer_without_mcp` when the selected capability is harmless but unusable, such as a resource that returns only binary data.
- Route from `invoke_mcp_capability` back to `select_capability` on recoverable failures when another candidate capability remains.
- Route from `invoke_mcp_capability` to `mark_needs_review` on authentication failure, authorization failure, repeated transport errors, or high-impact execution ambiguity.
- Route from `integrate_result` to `mark_needs_review` when output is malformed, too large, contradictory, or opaque to the model.

## Inputs and Outputs

- Input: a natural-language request, optional server preference, and an injected MCP client adapter for configured local or remote servers.
- Output: `final_output`, including status, response text, selected MCP server and capability, result summary, fallback or review reason, and errors.
- Intermediate artifacts: intent, operation type, discovered manifest, candidate capabilities, selected capability, validation metadata, MCP request, raw MCP result, context update, errors, and review flag.

Example successful output shape:

```json
{
  "status": "ok",
  "response": "The managed folder contains sample.txt and notes.md.",
  "selected_capability": {
    "server": "filesystem",
    "type": "tool",
    "name": "list_directory"
  },
  "mcp_result_summary": {
    "success": true,
    "item_count": 2
  },
  "errors": []
}
```

Example review output shape:

```json
{
  "status": "needs_review",
  "response": "I found a matching email-sending tool, but sending external messages requires approval before execution.",
  "selected_capability": {
    "server": "email",
    "type": "tool",
    "name": "send_email"
  },
  "fallback_reason": "high-impact action requires human approval",
  "errors": []
}
```

Example input shape:

```json
{
  "input": "List the files in the managed project folder.",
  "server_priority": ["filesystem"]
}
```

## Failure Cases

Document expected failures, retries, fallback behavior, and human-review points.

- Blank input should fail in `preprocess_request` without discovery or model invocation.
- No configured MCP servers should not crash the graph; it should answer without MCP or explain that no external capability is available.
- Discovery may fail because a server is unavailable, the transport is misconfigured, or the manifest is malformed. The graph should record the error and continue only when a safe fallback exists.
- The selected capability may be irrelevant, ambiguous, or missing required schema fields. The graph should choose another candidate, ask for clarification, or answer without MCP.
- A server may expose a legacy API that lacks filters, sorting, bounded pagination, or structured fields. The graph should avoid expensive or unreliable broad queries.
- A resource may return binary or opaque content such as a raw PDF. The graph should treat this as unusable unless an extraction capability is also available.
- Tool parameters may be incomplete or unsafe. The graph should request clarification or route to review rather than inventing values.
- Authentication and authorization failures should be surfaced as security errors, not retried blindly.
- Write actions, email sending, database updates, device control, financial actions, and other high-impact operations should require explicit approval or a documented allowlist.
- Tool execution may time out or return a structured error. The graph may try another safe capability once, then fallback or review.
- The MCP result may be too large for model context. `integrate_result` should summarize, paginate, or stop with a clear error instead of overfilling state.
- Server output may be malformed or fail schema validation. The graph should not present it as trusted context.
- Local STDIO servers and remote HTTP servers should be tested through the same adapter boundary so transport-specific failures remain isolated.

## Test Ideas

- Verify the happy path where discovery returns a filesystem-like server, the graph selects `list_directory`, invokes it through a fake MCP client, and returns a structured final answer.
- Verify a resource retrieval path where a text resource is discovered, validated as agent-readable, and integrated into the final response.
- Verify a prompt capability path where the graph identifies a reusable prompt template and records it as the selected capability without treating it as a tool.
- Verify direct-answer routing when the request does not require MCP.
- Verify no-server routing when discovery returns an empty manifest.
- Verify malformed manifest handling records an error and avoids invocation.
- Verify missing required parameters cause clarification, fallback, or review instead of fabricated arguments.
- Verify unauthorized and high-impact tools route to `mark_needs_review`.
- Verify opaque output, such as `application/pdf` without extracted text, is rejected by `integrate_result`.
- Verify recoverable tool failure tries another candidate capability when one is available.
- Verify repeated transport failure stops without an unbounded loop.
- Verify final state always includes `intent`, `capability_manifest`, `selected_capability`, `capability_validation`, `errors`, and `final_output`.
- Verify tests can run with a fake MCP client and no network, local server process, Node `npx`, ADK, or FastMCP dependency.

## Open Questions

- `docs/agentic-design-patterns-toc.md` lists Chapter 10 as logical pages `154-169`, but PDF text extraction shows the visible Chapter 10 section at page labels `167-182`, zero-based indexes `166-181`, with chapter-local page counters `1-16`.
- Should the first implementation use a fake MCP client adapter only, or should it also include an optional real local MCP server example for manual testing?
- Which MCP Python integration should be standardized for later implementation, given the chapter discusses ADK, community servers via `npx`, and FastMCP rather than LangGraph-specific packages?
- What project-level allowlist should define safe read-only capabilities versus actions that require human approval?
- Should write-capable examples be excluded from the first graph to keep tests deterministic and low-risk?
