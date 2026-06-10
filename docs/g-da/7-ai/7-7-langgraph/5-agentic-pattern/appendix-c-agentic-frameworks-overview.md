---
sidebar_position: 103
---

# Requirement: Appendix C: Quick overview of Agentic Frameworks

## Source

- PDF: `Agentic_Design_Patterns.pdf`
- Section: `Appendix C - Quick overview of Agentic Frameworks`
- Page range: `364-371` logical pages from `docs/agentic-design-patterns-toc.md`
- Extraction note: the visible Appendix C heading was found at PDF page label `385` / one-based file page `385` / zero-based index `384`. Appendix D starts at PDF page label `393` / one-based file page `393` / zero-based index `392`. The extracted Appendix C span is therefore PDF indexes `384-391`, file pages `385-392`, with appendix-local page counters `1-8`. This is ambiguous because the TOC logical range `364-371` covers the same 8-page length but does not match PDF page labels or file indexes. `pypdf` reports page labels equal to one-based file page numbers.

## Pattern Summary

Appendix C is not a single runtime agent pattern. It is a framework-selection guide for deciding which agentic development abstraction fits a project. The appendix contrasts low-level chain composition, explicit stateful graph control, higher-level multi-agent team orchestration, retrieval-first systems, production search pipelines, role/SOP-driven software teams, lifecycle platforms, enterprise plugin/planner SDKs, and lightweight model-driven agent SDKs.

For implementation, this requirement should become a LangGraph framework-selection advisor. Given a project brief, the graph should classify the desired workflow shape, operational needs, data needs, team-orchestration needs, and control requirements, then recommend one or more framework families from the appendix with concise rationale and trade-offs.

## Pattern Explanation

### Conceptual Overview

Agentic frameworks sit at different abstraction levels. LangChain is presented as a good fit for simple linear chains, while LangGraph adds explicit state and cycles for workflows that need loops, retries, tool use, planning, or human checkpoints. Higher-level frameworks such as Google's ADK and CrewAI move attention from graph wiring to coordinated teams of agents. Other frameworks specialize in conversational multi-agent work, retrieval, scalable search, SOP-based software teams, autonomous-agent lifecycle management, enterprise plugin/planner integration, or lightweight model-driven agent loops.

The core lesson is to choose the framework by matching the application's control-flow needs and operating model, not by popularity. A simple sequence should not be forced into a complex multi-agent platform, and a dynamic agent loop should not be hidden inside a purely linear chain.

### Problem

Teams building agentic applications can choose from many overlapping frameworks. Without an explicit selection process, they may overbuild a simple workflow, underbuild a stateful agent that needs retries and tools, choose a collaboration framework for a retrieval problem, or pick a high-level platform when they need fine-grained graph control.

This requirement solves that problem by turning the appendix's comparisons into an implementation-ready decision workflow.

### When to Use

- Use this pattern when a project team needs to select an agentic framework for a new application.
- Use it when requirements mention workflow shape, such as linear pipeline, loop, retry, plan-and-execute, parallel work, or human checkpoint.
- Use it when a team needs to compare LangChain, LangGraph, ADK, CrewAI, AutoGen, LlamaIndex, Haystack, MetaGPT, SuperAGI, Semantic Kernel, or Strands Agents.
- Use it when the project brief mixes application goals with operational concerns such as observability, lifecycle management, enterprise integration, or model/provider flexibility.
- Use it when stakeholders need a recommendation with the reasoning, risks, and alternative options made explicit.

### When Not to Use

- Avoid this pattern when the framework is already mandated by the project.
- Avoid it when the task is only to implement one known LangGraph graph from an existing requirement document.
- Avoid it when a small deterministic function or script would solve the problem without an LLM or agent framework.
- Avoid it when current vendor capabilities, pricing, licensing, or API compatibility must be verified before deciding; those details are time-sensitive and need fresh source checks.
- Avoid treating the recommendation as an architectural guarantee. The advisor should identify fit and trade-offs, not replace a proof of concept.

### How It Works

1. Capture the project brief, including task type, workflow complexity, data sources, human review needs, multi-agent needs, production constraints, and preferred ecosystem.
2. Normalize the brief into decision signals such as `linear_flow`, `stateful_loop`, `multi_agent_team`, `conversation_driven`, `retrieval_heavy`, `search_pipeline`, `sop_driven`, `lifecycle_platform`, `enterprise_plugins`, and `lightweight_mcp`.
3. Map each signal to the framework categories described in the appendix.
4. Score candidate frameworks by fit, control level, abstraction level, operational overhead, and known risks.
5. Select a primary recommendation and one or two alternatives when the brief supports multiple plausible choices.
6. Explain the recommendation in implementation-oriented language, including why simpler or higher-level alternatives were not chosen.
7. Ask for clarification when the brief lacks enough information to distinguish key choices, such as simple chain versus stateful loop or retrieval pipeline versus multi-agent team.

### Trade-offs

| Benefit | Cost or Risk |
| --- | --- |
| Forces framework choice to follow workflow requirements. | Recommendations can be wrong if the project brief omits important constraints. |
| Makes abstraction level explicit, from chains to graphs to managed agent teams. | The appendix is a quick overview, not a complete vendor comparison. |
| Helps avoid overbuilding simple linear workflows. | Time-sensitive framework features, pricing, and maturity need external verification. |
| Provides a deterministic decision structure that can be tested. | Some projects legitimately need multiple frameworks or a custom architecture. |
| Produces rationale and alternatives instead of a one-word answer. | Scoring can appear more precise than the source supports unless confidence is reported. |

### Minimal Example

```text
Project brief:
  "Build a customer-support assistant that retrieves policies, calls tools,
  retries failed actions, and asks a human before refunding money."

Decision flow:
  -> extract requirements
  -> detect retrieval_heavy, stateful_loop, tool_use, human_checkpoint
  -> score LangGraph high because explicit state and conditional loops are needed
  -> mention LangChain for simple retrieval chains, but not as the main fit
  -> return LangGraph recommendation with RAG and human-review notes
```

### LangGraph Mapping

| Pattern Concept | LangGraph Element |
| --- | --- |
| Project brief | State field `input` |
| Extracted project requirements | State field `requirements` |
| Workflow-shape classification | Node `classify_workflow_shape` |
| Framework catalog from Appendix C | Static configuration used by `score_frameworks` |
| Fit scoring | State field `candidate_scores` |
| Primary recommendation | State field `recommendation` |
| Alternative frameworks | State field `alternatives` |
| Ambiguity or missing information | Conditional edge to `request_clarification` |
| Recommendation explanation | Node `compose_recommendation` |
| Final response | State field `final_output` |

## LangGraph Implementation Goal

Build a LangGraph example named `framework_selector` that recommends an agentic framework based on a project brief. The graph should not call real framework APIs. It should use a small local catalog derived from Appendix C and produce a structured recommendation that explains:

- the detected workflow shape,
- the primary framework recommendation,
- why that framework fits,
- one or two alternatives,
- key trade-offs and risks,
- clarification questions when the brief is underspecified.

Expected workflow outcome:

- Simple linear pipelines should recommend LangChain.
- Stateful loops, retries, tool-use cycles, plan-and-execute flows, parallel nodes, and human checkpoints should recommend LangGraph.
- Managed multi-agent teams with production-oriented orchestration should consider Google's ADK.
- Role/task/team collaboration should consider CrewAI.
- Conversation-driven multi-agent collaboration should consider AutoGen.
- Retrieval-first knowledge systems should consider LlamaIndex.
- Large-scale search, question answering, summarization, or retrieval pipelines should consider Haystack.
- SOP-driven software-team simulation should consider MetaGPT.
- Autonomous-agent lifecycle management and GUI monitoring needs should consider SuperAGI.
- Enterprise code integration through plugins and planners should consider Semantic Kernel.
- Lightweight, model-agnostic agent loops with MCP-oriented tool access should consider Strands Agents.

## State Shape

List the state fields the graph needs.

| Field | Type | Purpose |
| --- | --- | --- |
| `input` | `str` | Original project brief or framework-selection question. |
| `requirements` | `dict[str, Any]` | Normalized project requirements extracted from the brief. |
| `workflow_shape` | `str \| None` | Classified shape such as `linear`, `stateful_graph`, `managed_team`, `retrieval_first`, `search_pipeline`, or `unknown`. |
| `decision_signals` | `dict[str, bool]` | Boolean signals such as `needs_cycles`, `needs_human_review`, `retrieval_heavy`, `multi_agent`, `conversation_driven`, `sop_driven`, `production_lifecycle`, `enterprise_integration`, and `mcp_tools`. |
| `framework_catalog` | `dict[str, dict[str, Any]]` | Local catalog of frameworks, strengths, risks, and best-fit signals derived from Appendix C. |
| `candidate_scores` | `list[dict[str, Any]]` | Ranked framework candidates with score, matched signals, missing signals, and caveats. |
| `recommendation` | `dict[str, Any] \| None` | Primary framework recommendation with rationale and confidence. |
| `alternatives` | `list[dict[str, Any]]` | Plausible secondary options with reasons to choose or avoid them. |
| `clarification_questions` | `list[str]` | Questions to ask when the brief is too vague or conflicting. |
| `ambiguities` | `list[str]` | Source or input ambiguities detected during selection. |
| `errors` | `list[str]` | Validation or processing errors. |
| `final_output` | `dict[str, Any] \| None` | User-facing structured recommendation, alternatives, trade-offs, and next steps. |

## Nodes

| Node | Responsibility |
| --- | --- |
| `preprocess_brief` | Validate non-empty input, normalize whitespace, and initialize state fields. |
| `extract_requirements` | Convert the project brief into structured requirements and decision signals. |
| `classify_workflow_shape` | Classify the brief as linear, stateful graph, managed team, retrieval-first, search pipeline, SOP-driven, lifecycle platform, enterprise SDK, lightweight agent loop, or unknown. |
| `load_framework_catalog` | Load the Appendix C framework catalog from local constants. |
| `score_frameworks` | Score each framework against detected signals, abstraction level, control needs, and operational requirements. |
| `select_recommendation` | Choose the primary recommendation, alternatives, confidence, and caveats. |
| `request_clarification` | Produce focused questions when the graph cannot distinguish between plausible choices. |
| `compose_recommendation` | Generate the final recommendation text and structured output. |
| `handle_invalid_input` | Return a clear failure for blank or unusable input. |

## Edges

Describe the graph flow, including conditional branches.

```text
START
  -> preprocess_brief

preprocess_brief -> handle_invalid_input -> END
preprocess_brief -> extract_requirements
  -> classify_workflow_shape
  -> load_framework_catalog
  -> score_frameworks
  -> select_recommendation

select_recommendation -> request_clarification -> compose_recommendation -> END
select_recommendation -> compose_recommendation -> END
```

Conditional edge requirements:

- Route from `preprocess_brief` to `handle_invalid_input` when `input` is blank or too short to classify.
- Route from `select_recommendation` to `request_clarification` when confidence is low, top candidates are tied, or required signals conflict.
- Route from `select_recommendation` directly to `compose_recommendation` when a primary recommendation has enough matched signals.
- `compose_recommendation` should always include the detected workflow shape, primary recommendation if available, alternatives, and caveats.

## Inputs and Outputs

- Input: a natural-language project brief, such as "I need an agent that retrieves documents, calls tools, retries, and asks humans before risky actions."
- Output: `final_output`, including detected requirements, recommended framework, confidence, rationale, alternatives, trade-offs, and clarification questions when needed.
- Intermediate artifacts: normalized requirements, decision signals, workflow shape, framework catalog, candidate scores, recommendation, alternatives, ambiguities, and errors.

Example successful output shape:

```json
{
  "status": "ok",
  "workflow_shape": "stateful_graph",
  "recommended_framework": "LangGraph",
  "confidence": "high",
  "rationale": [
    "The brief requires loops, tool-use retries, and human approval checkpoints.",
    "Appendix C positions LangGraph for cyclical, stateful agent workflows."
  ],
  "alternatives": [
    {
      "framework": "LangChain",
      "fit": "Use only if the workflow can be reduced to a simple linear RAG chain."
    },
    {
      "framework": "Google ADK",
      "fit": "Consider if managed multi-agent deployment matters more than explicit graph control."
    }
  ],
  "clarification_questions": [],
  "caveats": [
    "Verify current framework APIs and licensing before production adoption."
  ]
}
```

Example clarification output shape:

```json
{
  "status": "needs_clarification",
  "workflow_shape": "unknown",
  "recommended_framework": null,
  "confidence": "low",
  "clarification_questions": [
    "Is the workflow a fixed sequence, or does it need loops, retries, or conditional routing?",
    "Is the main challenge retrieval from private data, multi-agent collaboration, or production lifecycle management?"
  ],
  "alternatives": []
}
```

## Failure Cases

Document expected failures, retries, fallback behavior, and human-review points.

- Blank input should route to `handle_invalid_input` and return a validation error without model invocation.
- A vague brief such as "build an AI app" should not produce a high-confidence recommendation; it should ask clarification questions.
- A brief containing conflicting signals, such as "simple fixed chain" plus "multi-agent autonomous team with retries", should report the conflict and lower confidence.
- The graph should not claim that a framework has capabilities not described in Appendix C unless the implementation has separate, current documentation checks.
- Time-sensitive claims about current APIs, pricing, deployment support, licensing, or ecosystem maturity should be surfaced as caveats.
- If multiple frameworks tie, the graph should return a ranked comparison rather than forcing one answer.
- If the brief requests a framework outside the Appendix C catalog, the graph should mark it as out of catalog and compare only where supported by known signals.
- If model-based requirement extraction fails or returns malformed data, the graph should fall back to deterministic keyword signals or request clarification.
- The graph should avoid recommending a high-level multi-agent framework when the detected workflow is a simple linear chain.
- The graph should avoid recommending a purely linear chain when cycles, retries, tool-use loops, or human checkpoints are core requirements.

## Test Ideas

- Verify a simple RAG, summarization, or extraction brief recommends LangChain with high confidence.
- Verify a plan-and-execute, retrying, tool-using, or human-in-the-loop brief recommends LangGraph.
- Verify a parallel content-generation brief can classify as `stateful_graph` or `parallel_graph` and recommend LangGraph.
- Verify a managed team-of-agents deployment brief includes Google's ADK as the primary or a strong alternative.
- Verify a role-based research team brief recommends CrewAI.
- Verify a conversation-driven multi-agent problem recommends AutoGen.
- Verify a private-data retrieval and synthesis brief recommends LlamaIndex.
- Verify an enterprise-scale search or question-answering pipeline recommends Haystack.
- Verify an SOP-driven software-development team brief recommends MetaGPT.
- Verify an autonomous-agent lifecycle management brief recommends SuperAGI.
- Verify an enterprise plugin/planner integration brief recommends Semantic Kernel.
- Verify a lightweight model-agnostic agent with MCP tool access recommends Strands Agents.
- Verify vague input returns `needs_clarification` with focused questions.
- Verify conflicting input returns low confidence and explains the conflict.
- Verify final state always includes `requirements`, `workflow_shape`, `candidate_scores`, `recommendation`, `alternatives`, `clarification_questions`, `errors`, and `final_output`.

## Open Questions

- `docs/agentic-design-patterns-toc.md` lists Appendix C as logical pages `364-371`, but PDF text extraction shows the visible Appendix C section at page labels `385-392`, one-based file pages `385-392`, zero-based indexes `384-391`, with appendix-local page counters `1-8`.
- The extracted Appendix C snippets are illustrative, not directly runnable. The LangGraph code fragment is split across pages and includes extraction-sensitive formatting, including a line break inside a formatted string.
- The source's ADK snippet appears internally inconsistent in extraction: it imports a Google search tool name with one capitalization but uses a differently cased name in `tools`, and the variable name does not match the described question-answering agent.
- The appendix is a quick overview and does not provide a complete scoring rubric. The implementation should make the scoring heuristic explicit and keep confidence levels conservative.
- Current framework capabilities, APIs, pricing, licensing, and production readiness may have changed after the source was written. The requirement document should be treated as source-grounded framework guidance, not a current market report.
