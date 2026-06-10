---
sidebar_position: 104
---

# Appendix D: Building an Agent with AgentSpace (en)

## Pattern Summary

Appendix D presents AgentSpace as an enterprise platform for building specialized AI agents through a graphical, no-code workflow. The platform combines enterprise search, connected business services, prompt configuration, knowledge graph context, security controls, analytics, web exposure, and a chat interface. It also describes multi-agent interoperability through the Agent2Agent (A2A) Protocol.

The implementation-relevant pattern is an enterprise agent assembly workflow: define an agent goal, connect allowed data and services, choose or write the agent prompt, configure knowledge and runtime capabilities, enforce access controls, expose a chat interface, and record usage. The chapter emphasizes that the agent is not just a chatbot; it can reason, plan, synthesize enterprise context, and perform multi-step actions.

For the LangGraph example, do not integrate with live AgentSpace, Google Cloud, Google services, or third-party SaaS products. Build a local AgentSpace-style graph that accepts an enterprise agent configuration request and a sample user query, validates security and connector choices, assembles a runnable agent specification, performs a deterministic mock retrieval/action flow, and returns an auditable response.

## Pattern Explanation

### Conceptual Overview

AgentSpace packages agent construction into an enterprise workflow. Instead of requiring a developer to wire every model, retriever, tool, permission check, and user interface manually, the platform gives users a place to configure an agent from existing organizational assets.

The appendix describes AgentSpace as connecting documents, emails, databases, calendars, mail systems, ticketing tools, knowledge graphs, datastores, prompts, analytics, and chat. The central idea is that an enterprise agent should be grounded in the organization's own digital footprint and constrained by enterprise access rules.

### Problem

Organizations often want agents that can answer questions and complete work across internal documents, applications, and workflows. A plain chatbot does not know which enterprise sources it may use, which services it can act on, which users are authorized, or how its usage should be monitored.

This pattern solves that problem by turning agent construction into a governed configuration pipeline. The agent is assembled from approved connectors, prompts, knowledge sources, access controls, and runtime surfaces before it is allowed to answer or act.

### When to Use

- Use this pattern when an agent must operate over enterprise documents, email, databases, or business applications.
- Use it when non-specialist builders need a no-code or low-code way to configure the agent's purpose and prompt.
- Use it when the agent needs organization-specific context from a datastore, enterprise knowledge graph, or private knowledge graph.
- Use it when the agent must enforce access controls before retrieving information or performing actions.
- Use it when chat deployment, web exposure, analytics, and usage monitoring are part of the expected operating environment.
- Use it when multi-agent collaboration or A2A-style interoperability is needed for larger workflows.

### When Not to Use

- Avoid this pattern when the task is a simple standalone prompt with no enterprise data or tool access.
- Avoid it when the agent should not access sensitive organizational systems.
- Avoid it when the required services are unsupported or cannot be safely mocked in a local example.
- Avoid it when direct code-level control over every graph node, retrieval step, and tool call is more important than platform-style configuration.
- Avoid using autonomous actions for high-impact business workflows unless human approval, audit logging, and rollback behavior are defined.
- Avoid treating connected enterprise context as universally available; permissions must be evaluated per user and per source.

### How It Works

1. The builder opens AgentSpace from the Google Cloud Console through the AI Applications area.
2. The builder connects the agent to approved services, such as calendar, mail, ticketing, work-management, or service-management systems.
3. The builder chooses a pre-assembled prompt from a gallery or writes a custom prompt for the agent.
4. The builder configures advanced capabilities, such as datastores, Google Knowledge Graph, private knowledge graph integration, web exposure, and analytics.
5. The platform applies enterprise security controls, including role-based access and data protection.
6. The configured agent becomes available through an AgentSpace chat interface.
7. At runtime, the agent uses the configured prompt, connected sources, knowledge context, and allowed tools to reason, plan, synthesize information, and perform approved multi-step actions.
8. Usage and outcomes are monitored through analytics and other operational controls.

### Trade-offs

| Benefit | Cost or Risk |
| --- | --- |
| Makes enterprise agent construction accessible through a no-code configuration flow. | Platform abstractions can hide implementation details that engineers need for debugging. |
| Grounds responses in organization-specific documents, services, and knowledge graphs. | Incorrect connector or permission configuration can expose sensitive information. |
| Prompt gallery and custom prompts make agent behavior easier to standardize. | Weak prompts can still produce vague, unsafe, or over-broad behavior. |
| Built-in chat, web exposure, and analytics help move from prototype to operation. | Operational surfaces increase the need for monitoring, audit trails, and change control. |
| A2A-style collaboration can support more complex workflows. | Multi-agent handoffs add coordination, failure, and accountability complexity. |
| Security controls align the agent with enterprise governance. | Overly restrictive access rules can make the agent appear unreliable or incomplete. |

### Minimal Example

```text
Input:
  agent_goal: "Help employees prepare for customer renewal meetings."
  requested_services:
    - calendar
    - email
    - crm_notes
    - support_tickets
  prompt_choice: "custom"
  custom_prompt: "Summarize account status, open risks, and next actions."
  user_role: "account_manager"
  runtime_query: "Prepare my briefing for the Acme renewal call."

Flow:
  validate_agent_request -> pass
  select_service_connectors -> calendar, email, crm_notes, support_tickets
  enforce_access_policy -> account_manager can read assigned accounts only
  build_knowledge_context -> account notes, ticket summary, meeting metadata
  compose_agent_prompt -> custom renewal briefing prompt
  assemble_agent_spec -> configured enterprise agent
  deploy_chat_interface -> local mock chat endpoint is ready
  handle_runtime_query -> retrieve allowed context and plan approved actions
  synthesize_response -> return briefing with citations and audit metadata

Output:
  agent_spec:
    - selected connectors
    - prompt
    - knowledge sources
    - security policy
    - enabled capabilities
  response:
    - renewal briefing
    - cited context items
    - blocked or skipped actions
    - usage event
```

### LangGraph Mapping

| Pattern Concept | LangGraph Element |
| --- | --- |
| AgentSpace enterprise agent builder | One LangGraph graph named for an AgentSpace-style builder and runtime |
| Google Cloud Console entry point | Node `prepare_agent_request` and state field `input` |
| Service integrations | Node `select_service_connectors`, state fields `requested_services`, `available_services`, and `selected_connectors` |
| Enterprise digital footprint | State fields `source_documents`, `mock_service_records`, and `knowledge_context` |
| Enterprise knowledge graph | Node `build_knowledge_context` and state field `knowledge_graph` |
| Prompt gallery | State fields `prompt_gallery` and `prompt_choice`, node `choose_prompt_source` |
| Custom prompt | State field `custom_prompt`, node `compose_agent_prompt` |
| Agent Designer configuration | Nodes `configure_capabilities` and `assemble_agent_spec` |
| Role-based access control and encryption expectations | Node `enforce_access_policy`, state fields `security_policy`, `access_decision`, and `audit_log` |
| Advanced features such as datastores, web exposure, and analytics | State field `enabled_capabilities`, nodes `configure_capabilities` and `record_analytics_event` |
| A2A Protocol interoperability | Conditional node `route_to_collaborator_agent` and state fields `a2a_enabled` and `collaborator_agents` |
| AgentSpace chat interface | Nodes `deploy_chat_interface` and `handle_runtime_query` |
| Reasoning, planning, and multi-step actions | Nodes `plan_runtime_actions` and `execute_mock_actions` |
| Monitored enterprise output | Node `finalize_agent_result`, state fields `response`, `citations`, `usage_events`, and `deployment_status` |

## LangGraph Implementation Goal

Build a local LangGraph example that models the AgentSpace-style workflow from Appendix D without depending on AgentSpace itself. The example should show how an enterprise agent can be configured from approved services, prompts, knowledge sources, security rules, and runtime capabilities, then used through a mock chat request.

The graph should accept an agent build request and an optional sample query. It should validate the requested services, enforce access rules, assemble an `agent_spec`, optionally simulate A2A collaboration, run a deterministic mock retrieval/action plan, and return a final response with citations, blocked actions, and analytics events.

Expected workflow outcome:

- The graph rejects missing goals, unsupported connectors, unsafe prompts, or unauthorized data access.
- The graph can use either a prompt-gallery entry or a custom prompt.
- The graph composes an agent specification that includes selected connectors, knowledge context, prompt, capabilities, and security policy.
- The graph handles a sample chat query using only allowed mock records and mock tools.
- The graph records auditable events for configuration, retrieval, action planning, blocked actions, and final response generation.
- Tests run without network access, cloud credentials, Google APIs, AgentSpace APIs, live SaaS connectors, or external A2A services.

## State Shape

List the state fields the graph needs.

| Field | Type | Purpose |
| --- | --- | --- |
| `input` | `str` | Original user request or short description of the enterprise agent to build. |
| `agent_goal` | `str` | Purpose of the configured agent. |
| `builder_id` | `str` | Identifier for the person or process configuring the agent. |
| `user_role` | `str` | Runtime user's role for permission checks. |
| `requested_services` | `list[str]` | Services the builder wants the agent to connect to. |
| `available_services` | `dict[str, dict[str, Any]]` | Locally supported mock connectors and their capabilities. |
| `selected_connectors` | `list[dict[str, Any]]` | Connectors approved for this agent after validation. |
| `source_documents` | `list[dict[str, Any]]` | Mock documents or datastore records available for retrieval. |
| `mock_service_records` | `dict[str, list[dict[str, Any]]]` | Mock records returned by connected services such as calendar, mail, tickets, or CRM. |
| `knowledge_graph` | `dict[str, Any]` | Simplified graph of people, documents, services, and entities available to the agent. |
| `knowledge_context` | `list[dict[str, Any]]` | Permission-filtered context assembled from documents, services, and graph relationships. |
| `prompt_gallery` | `dict[str, str]` | Named reusable prompts available to the builder. |
| `prompt_choice` | `str` | Prompt selection mode or gallery key. |
| `custom_prompt` | `str \| None` | Builder-provided prompt text when not using the gallery. |
| `agent_prompt` | `str` | Final prompt used by the configured agent. |
| `security_policy` | `dict[str, Any]` | Allowed roles, connector permissions, data classification rules, and human-review triggers. |
| `access_decision` | `dict[str, Any]` | Permission result with allowed sources, denied sources, and reasons. |
| `enabled_capabilities` | `dict[str, bool]` | Feature flags for datastores, knowledge graph, web interface, analytics, and A2A. |
| `a2a_enabled` | `bool` | Whether collaborator-agent routing is enabled. |
| `collaborator_agents` | `dict[str, dict[str, Any]]` | Local mock collaborators and their responsibilities. |
| `agent_spec` | `dict[str, Any] \| None` | Final assembled agent configuration. |
| `deployment_status` | `str` | Configuration state such as `not_started`, `ready`, `blocked`, `deployed`, or `failed`. |
| `runtime_query` | `str \| None` | Optional user query to send through the configured chat interface. |
| `runtime_plan` | `list[dict[str, Any]]` | Planned retrievals, tool calls, or collaborator handoffs for the runtime query. |
| `tool_calls` | `list[dict[str, Any]]` | Mock actions attempted by the graph. |
| `blocked_actions` | `list[dict[str, Any]]` | Actions denied by policy, connector availability, or missing permissions. |
| `citations` | `list[dict[str, Any]]` | Source records used in the final response. |
| `response` | `dict[str, Any] \| None` | Final chat-style answer and supporting metadata. |
| `usage_events` | `list[dict[str, Any]]` | Analytics-style events for configuration and runtime steps. |
| `audit_log` | `list[dict[str, Any]]` | Security and operational log entries for important decisions. |
| `errors` | `list[str]` | Validation, permission, prompt, connector, or runtime errors. |

## Nodes

| Node | Responsibility |
| --- | --- |
| `prepare_agent_request` | Validate required input fields, normalize service names, initialize defaults, and start audit logging. |
| `validate_enterprise_scope` | Confirm the request is an enterprise-agent configuration task and not an unsupported live cloud operation. |
| `select_service_connectors` | Match requested services to local mock connectors and record unsupported services as errors. |
| `enforce_access_policy` | Apply role and data-classification rules to connectors, documents, service records, and capabilities. |
| `build_knowledge_context` | Create a simplified enterprise context from allowed documents, service records, and knowledge graph relationships. |
| `choose_prompt_source` | Select either a gallery prompt or a custom prompt and validate that the prompt exists. |
| `compose_agent_prompt` | Combine the agent goal, selected prompt, allowed services, and security constraints into the final `agent_prompt`. |
| `configure_capabilities` | Enable or disable datastore, knowledge graph, web interface, analytics, and A2A-style capabilities. |
| `configure_collaborators` | Register local mock collaborator agents when A2A is enabled. |
| `assemble_agent_spec` | Produce the structured `agent_spec` containing connectors, prompt, context policy, capabilities, and audit metadata. |
| `deploy_chat_interface` | Mark the local mock chat interface as ready when the agent specification passes validation. |
| `handle_runtime_query` | Validate the optional runtime query and route to runtime planning or finalization. |
| `plan_runtime_actions` | Decide which allowed context, mock tools, or collaborator agents are needed to answer the query. |
| `route_to_collaborator_agent` | Simulate an A2A handoff to a local collaborator when the runtime plan requires it. |
| `execute_mock_actions` | Run deterministic mock retrievals or service actions and record blocked actions. |
| `synthesize_response` | Generate the final chat answer from allowed context, action results, and citations. |
| `record_analytics_event` | Append configuration and runtime usage events when analytics are enabled. |
| `finalize_agent_result` | Return the final `agent_spec`, deployment status, response, audit log, usage events, and errors. |

## Edges

Describe the graph flow, including conditional branches.

```text
START
  -> prepare_agent_request
  -> validate_enterprise_scope
  -> select_service_connectors
  -> enforce_access_policy

enforce_access_policy -> build_knowledge_context
enforce_access_policy -> finalize_agent_result

build_knowledge_context
  -> choose_prompt_source
  -> compose_agent_prompt
  -> configure_capabilities

configure_capabilities -> configure_collaborators
configure_capabilities -> assemble_agent_spec
configure_collaborators -> assemble_agent_spec

assemble_agent_spec
  -> deploy_chat_interface
  -> handle_runtime_query

handle_runtime_query -> plan_runtime_actions
handle_runtime_query -> record_analytics_event

plan_runtime_actions -> route_to_collaborator_agent
plan_runtime_actions -> execute_mock_actions
route_to_collaborator_agent -> execute_mock_actions

execute_mock_actions
  -> synthesize_response
  -> record_analytics_event
  -> finalize_agent_result

record_analytics_event -> finalize_agent_result
finalize_agent_result -> END
```

Conditional edge requirements:

- Route from `validate_enterprise_scope` or `select_service_connectors` to `finalize_agent_result` with `deployment_status: "blocked"` when the request asks for live AgentSpace, live Google Cloud mutation, external SaaS credentials, or only unsupported connectors.
- Route from `enforce_access_policy` to `finalize_agent_result` when the user role has no permitted sources or requested capabilities violate `security_policy`.
- Route from `configure_capabilities` to `configure_collaborators` only when `a2a_enabled` is true.
- Route from `handle_runtime_query` directly to `record_analytics_event` and finalization when no runtime query is provided; the graph should still return the assembled `agent_spec`.
- Route from `plan_runtime_actions` to `route_to_collaborator_agent` only when an enabled collaborator is required and permitted.
- Route from `plan_runtime_actions` or `execute_mock_actions` to `finalize_agent_result` with blocked action details when a planned action is unauthorized or the connector is unavailable.
- The first implementation should keep model calls injectable and tests deterministic; a fake model or fixed planner is acceptable.

## Inputs and Outputs

- Input:
  - `input`: description of the agent to build.
  - `agent_goal`: business purpose for the configured agent.
  - `requested_services`: list of desired service connectors.
  - `prompt_choice` or `custom_prompt`: prompt configuration source.
  - `security_policy`: role and data-access constraints.
  - `runtime_query`: optional chat-style query to test the configured agent.
- Output:
  - `agent_spec`: selected connectors, final prompt, capabilities, knowledge context policy, and deployment metadata.
  - `deployment_status`: `deployed`, `blocked`, or `failed`.
  - `response`: optional runtime answer with citations and blocked actions.
  - `audit_log`: permission and configuration decisions.
  - `usage_events`: analytics-style records when enabled.
- Intermediate artifacts:
  - `selected_connectors`
  - `knowledge_context`
  - `access_decision`
  - `runtime_plan`
  - `tool_calls`
  - `blocked_actions`
  - `citations`

## Failure Cases

Document expected failures, retries, fallback behavior, and human-review points.

- Missing `agent_goal`, empty `input`, or absent prompt configuration should fail validation before deployment.
- Unsupported services should be recorded clearly; if no requested service is supported, the graph should block deployment.
- Requests for live AgentSpace setup, cloud mutations, real Google Cloud Console actions, or external SaaS credentials should be blocked in the local example.
- A `custom_prompt` that asks for policy bypass, unrestricted data access, or destructive action should be blocked or marked for human review.
- If access policy denies all source documents and service records, the graph should return a deployed-but-limited or blocked result, depending on configuration.
- If A2A is enabled but the required collaborator is missing or unauthorized, the graph should continue without that handoff only when the task can still be answered safely.
- If analytics is disabled, the graph should not add usage events beyond mandatory audit records.
- If a runtime action is unauthorized, the graph should include it in `blocked_actions` and synthesize a response from allowed context only.
- If retrieval produces no allowed citations, the graph should state that it lacks permitted context rather than fabricate enterprise facts.
- Human review should be required for high-impact actions, broad data-access changes, external publication through a web interface, or any prompt that expands the agent beyond its approved goal.

## Test Ideas

- Verify the happy path builds an agent from supported mock services, a gallery prompt, allowed documents, and a runtime query.
- Verify a custom prompt path composes the final `agent_prompt` and returns the expected `agent_spec`.
- Verify unsupported connectors are rejected and deployment is blocked when no connector remains.
- Verify role-based access filters out restricted documents and service records.
- Verify a runtime query produces citations only from allowed context.
- Verify unauthorized mock actions are added to `blocked_actions` and do not appear in `tool_calls` as completed actions.
- Verify A2A routing is skipped when disabled and invoked only for an allowed collaborator when enabled.
- Verify analytics events are recorded only when the analytics capability is enabled.
- Verify requests for live AgentSpace or Google Cloud operations are blocked by `validate_enterprise_scope`.
- Verify deterministic tests can run with a fake planner or fake model without network access.

## Open Questions

- The TOC gives Appendix D as logical pages `372-377`, but extracted text places the appendix at one-based file pages `393-398` / zero-based indexes `392-397`. The PDF has no internal page-label metadata to reconcile this offset.
- The extracted Appendix D pages contain figure captions and surrounding prose, but the screenshot contents themselves are not available as text. UI details visible only inside figures should not be treated as requirements unless separately inspected.
- The source text lists one service as `Workaday`; this may refer to Workday, but the requirement preserves the extracted wording rather than silently correcting it.
- Appendix D is a platform walkthrough, not a conventional algorithmic pattern. The LangGraph implementation should therefore emulate the described AgentSpace-style configuration and runtime workflow locally rather than claiming to implement Google AgentSpace.
