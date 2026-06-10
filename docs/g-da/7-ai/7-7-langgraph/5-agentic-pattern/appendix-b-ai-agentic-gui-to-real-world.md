---
sidebar_position: 102
---

# Requirement: Appendix B: AI Agentic Interactions: From GUI to Real World Environment

## Source

- PDF: `Agentic_Design_Patterns.pdf`
- Section: `Appendix B - AI Agentic Interactions: From GUI to Real World environment`
- Page range: `358-363` logical pages from `docs/agentic-design-patterns-toc.md`
- Extraction note: the Appendix B heading was found at PDF page label `378` / one-based file page `378` / zero-based index `377`. The next appendix heading, Appendix C, was found at PDF page label `385` / one-based file page `385` / zero-based index `384`. The extracted Appendix B span is therefore PDF indexes `377-383`, file pages `378-384`, with appendix-local footer pages `1-7`. This is ambiguous because the TOC logical range `358-363` implies 6 logical pages, while the extracted appendix body occupies 7 file pages before Appendix C begins.

## Pattern Summary

Appendix B describes agents that act through graphical user interfaces and real-world-like environments rather than only through text or structured APIs. The appendix frames Agent-Computer Interfaces as the bridge that lets an agent perceive a screen, identify interactive GUI elements, interpret those elements in task context, control mouse and keyboard actions, and monitor visual feedback from changing interfaces.

The same interaction loop extends toward multimodal physical environments, where agents use cameras, microphones, voice, and screen sharing to understand surroundings and provide real-time assistance. The appendix also highlights the operational risk of agents that can act online or across applications, making explicit authorization, safety filtering, feedback, and iterative refinement necessary.

For the first LangGraph example, this requirement should implement a bounded GUI/environment interaction controller. The graph should accept a user task and simulated observations, recognize interface elements, choose the next action, check safety and approval requirements, execute through an injectable environment adapter, observe feedback, recover from common UI failures, and return a traceable completion report.

## Pattern Explanation

### Conceptual Overview

This pattern treats the agent as an actor in an environment. Instead of calling a clean API with known arguments, the agent must read what is currently visible, infer which parts of the environment are actionable, decide what to do next, perform an action, and observe whether the environment changed as expected.

Appendix B emphasizes GUI interaction because many useful workflows still live behind visual software interfaces: websites, desktop apps, forms, pop-ups, dashboards, and documents. It also points toward real-world interaction, where the same perceive-reason-act loop is powered by multimodal input such as camera images, audio, and shared screens.

### Problem

Traditional automation is brittle when it depends on prebuilt APIs, fixed selectors, or scripts that assume the interface never changes. Real user workflows often cross multiple applications, include loading states and pop-ups, require visual interpretation, or need human approval before sensitive actions.

This pattern solves that problem by giving the agent an explicit interaction loop: observe the current environment, understand actionable elements, plan a small next step, execute safely, and re-check the environment before continuing. The graph should make uncertainty, blocked states, and approval points visible instead of hiding them inside a single model response.

### When to Use

- Use this pattern when a task must be completed through a GUI, browser, desktop application, mobile screen, or multimodal environment.
- Use it when API access is unavailable, incomplete, or less representative of the user's actual workflow.
- Use it when the agent must respond to changing screens, pop-ups, loading states, validation errors, or multi-step forms.
- Use it when tasks span multiple tools, such as extracting data from one surface and entering it into another.
- Use it when the system needs a trace of observed states, chosen actions, and safety approvals.
- Use it when sensitive or irreversible actions can be isolated behind explicit authorization gates.

### When Not to Use

- Avoid this pattern when a stable API or database operation can complete the task more safely and deterministically.
- Avoid it for high-stakes physical-world control unless there is a verified actuator layer, hard safety limits, and human supervision.
- Avoid it when screenshots, accessibility trees, or multimodal observations cannot be obtained reliably.
- Avoid it when the environment contains private data that the agent is not allowed to inspect or store.
- Avoid it when a one-shot answer, retrieval flow, or simple tool call is sufficient.
- Avoid unrestricted autonomous execution for purchases, messages, financial transactions, account changes, or destructive operations.

### How It Works

1. Receive the user task, target environment type, constraints, and safety policy.
2. Capture or receive an observation of the current environment, such as screenshot text, accessibility nodes, DOM-like elements, or multimodal notes.
3. Recognize candidate GUI or environment elements, including buttons, fields, links, dialogs, labels, warnings, and disabled controls.
4. Interpret those elements in context so the graph knows which actions are relevant to the user's goal.
5. Plan one or more small actions, such as click, type, scroll, drag, wait, ask for clarification, or request approval.
6. Review the next action against safety rules, confidence thresholds, and authorization requirements.
7. Execute approved actions through an environment adapter, then observe the resulting feedback.
8. Route through recovery when the environment changes unexpectedly, an element is missing, a validation error appears, or the action fails.
9. Stop when the goal is complete, blocked, unsafe, needs human approval, or reaches a configured step limit.

### Trade-offs

| Benefit | Cost or Risk |
| --- | --- |
| Can automate workflows that have no stable API. | GUI observations are noisy and can be misread. |
| Handles dynamic screens by observing after each action. | Repeated observe-act loops increase latency and cost. |
| Works across multiple applications and surfaces. | Cross-app workflows create privacy, permission, and audit challenges. |
| Human-like interaction can reuse existing software affordances. | GUI actions are less deterministic than structured tool calls. |
| Safety gates can isolate sensitive actions. | Missing or vague policies can allow risky actions to proceed. |
| Execution traces make behavior easier to inspect. | Trace logs may contain sensitive screen content if not redacted. |

### Minimal Example

```text
Input:
  task: "Find the invoice total on this billing page and copy it into the reimbursement form."
  observation:
    - browser page with invoice table
    - reimbursement form open in another simulated app
  safety_policy:
    - require approval before submitting forms

Flow:
  observe_environment -> page and form are visible
  recognize_elements -> total cell, amount field, submit button
  interpret_context -> copy invoice total into amount field
  plan_next_action -> type "$248.90" into amount field
  safety_review_action -> allowed
  execute_action -> amount field updated
  observe_feedback -> value appears in form
  plan_next_action -> click submit
  safety_review_action -> approval required
  request_human_approval -> pause before submission

Output:
  status: "needs_approval"
  pending_action: "submit reimbursement form"
  action_trace: observed, typed amount, verified field value
```

### LangGraph Mapping

| Pattern Concept | LangGraph Element |
| --- | --- |
| User task and environment goal | State fields `input`, `task_goal`, `environment_type`, and `constraints` |
| Visual or multimodal perception | Node `observe_environment`, state fields `observations` and `current_observation` |
| GUI element recognition | Node `recognize_elements`, state field `recognized_elements` |
| Contextual interpretation | Node `interpret_context`, state fields `task_context` and `element_interpretations` |
| Stepwise action planning | Node `plan_next_action`, state fields `action_plan`, `pending_action`, and `step_count` |
| Safety and authorization gate | Node `review_action_safety`, state fields `safety_policy`, `safety_findings`, and `needs_approval` |
| Human approval for sensitive actions | Node `request_human_approval`, state field `human_approval` |
| Mouse, keyboard, browser, or simulated environment action | Node `execute_action`, state fields `action_result` and `action_trace` |
| Dynamic feedback after action | Node `observe_feedback`, state fields `feedback_observation` and `environment_events` |
| Recovery from changing UI | Node `recover_from_failure`, state fields `recovery_attempts` and `errors` |
| Completion or blocked handoff | Node `finalize_interaction_report`, state field `interaction_report` |

## LangGraph Implementation Goal

Build a LangGraph example of a GUI/environment interaction controller. The user supplies a task goal, environment type, initial simulated observation, optional constraints, safety policy, and step limit. The graph repeatedly observes, recognizes elements, plans the next small action, checks whether the action is allowed, executes through an injectable environment adapter, and records the result.

The first implementation should be local, deterministic, and safe. It should not control a real desktop, browser, phone, camera, microphone, payment site, or physical device. The environment adapter should be a fake or in-memory simulator for tests, with model behavior injectable so unit tests can provide deterministic element recognition and action planning.

Expected workflow outcome:

- The graph validates that a task and observation are present.
- The graph converts raw observations into recognized elements and task-relevant interpretations.
- The graph plans one bounded next action at a time rather than executing a long opaque script.
- Sensitive actions are blocked or routed to human approval before execution.
- The graph observes feedback after each action and decides whether to continue, recover, ask for help, or stop.
- The final `interaction_report` includes status, completed actions, pending approvals, failures, observations, and safety findings.

## State Shape

List the state fields the graph needs.

| Field | Type | Purpose |
| --- | --- | --- |
| `input` | `str` | Original user task description. |
| `task_goal` | `str` | Concrete outcome the agent should accomplish in the GUI or environment. |
| `environment_type` | `str` | Target surface such as `browser`, `desktop`, `mobile`, `multimodal`, or `simulated_physical`. |
| `constraints` | `dict[str, Any]` | Scope limits, forbidden actions, allowed applications, output requirements, and redaction rules. |
| `safety_policy` | `dict[str, Any]` | Rules for sensitive actions, approval gates, blocked domains, privacy handling, and maximum autonomy. |
| `initial_observation` | `dict[str, Any]` | Starting screen, DOM-like snapshot, accessibility tree, image description, or environment notes. |
| `current_observation` | `dict[str, Any] \| None` | Most recent environment observation used for planning. |
| `observations` | `list[dict[str, Any]]` | Ordered observation history with timestamps or step numbers. |
| `recognized_elements` | `list[dict[str, Any]]` | Candidate buttons, fields, links, labels, dialogs, warnings, and other actionable or informative elements. |
| `element_interpretations` | `list[dict[str, Any]]` | Task-relevant meaning, confidence, and affordances for recognized elements. |
| `task_context` | `dict[str, Any]` | Extracted facts needed to act, such as values to transfer, target fields, page state, and assumptions. |
| `action_plan` | `list[dict[str, Any]]` | Planned actions with action type, target, value, rationale, expected effect, and risk level. |
| `pending_action` | `dict[str, Any] \| None` | Next action selected for safety review and execution. |
| `action_result` | `dict[str, Any] \| None` | Result returned by the environment adapter after an action. |
| `action_trace` | `list[dict[str, Any]]` | Audit trail of planned, approved, executed, failed, skipped, and blocked actions. |
| `environment_events` | `list[dict[str, Any]]` | Loading screens, pop-ups, validation messages, navigation changes, or other feedback events. |
| `safety_findings` | `list[dict[str, Any]]` | Policy findings for risky, private, irreversible, or disallowed actions. |
| `needs_approval` | `bool` | Whether the graph must pause for human approval before continuing. |
| `human_approval` | `dict[str, Any] \| None` | Human approval, rejection, edits, or additional constraints for a pending action. |
| `step_count` | `int` | Number of observe-plan-act iterations completed. |
| `max_steps` | `int` | Hard cap on autonomous iterations. |
| `recovery_attempts` | `int` | Number of recovery attempts after missing elements, failed actions, or unexpected feedback. |
| `max_recovery_attempts` | `int` | Hard cap on recovery loops. |
| `interaction_status` | `str` | Overall state such as `ready`, `running`, `needs_approval`, `completed`, `blocked`, or `failed`. |
| `errors` | `list[str]` | Validation, perception, planning, execution, safety, or recovery errors. |
| `interaction_report` | `dict[str, Any] \| None` | Final structured report returned by the graph. |

## Nodes

| Node | Responsibility |
| --- | --- |
| `prepare_interaction_task` | Validate required fields, normalize defaults, initialize counters and trace lists, and set `interaction_status`. |
| `observe_environment` | Load the initial observation or request the latest observation from the environment adapter. |
| `recognize_elements` | Convert raw observation content into structured GUI or environment elements with confidence scores. |
| `interpret_context` | Determine which recognized elements and facts matter for the task goal. |
| `plan_next_action` | Select the next bounded action and expected feedback, or decide that the task is complete or blocked. |
| `review_action_safety` | Check `pending_action` against policy, risk level, privacy constraints, and approval requirements. |
| `request_human_approval` | Pause with a clear approval request and incorporate `human_approval` when supplied. |
| `execute_action` | Execute the approved action through an injectable fake or real adapter interface and record the result. |
| `observe_feedback` | Observe the environment after execution and extract navigation changes, validation messages, pop-ups, and errors. |
| `decide_next_step` | Route to another action, recovery, approval, completion, blocked, or failed finalization. |
| `recover_from_failure` | Try bounded recovery actions such as wait, re-observe, dismiss a harmless pop-up, scroll, or ask for clarification. |
| `finalize_interaction_report` | Produce the final report with status, action trace, observations, pending approvals, safety findings, and errors. |

## Edges

Describe the graph flow, including conditional branches.

```text
START
  -> prepare_interaction_task
  -> observe_environment
  -> recognize_elements
  -> interpret_context
  -> plan_next_action
  -> review_action_safety

review_action_safety -> execute_action
review_action_safety -> request_human_approval
review_action_safety -> finalize_interaction_report

request_human_approval -> execute_action
request_human_approval -> finalize_interaction_report

execute_action
  -> observe_feedback
  -> decide_next_step

decide_next_step -> observe_environment
decide_next_step -> recover_from_failure -> observe_environment
decide_next_step -> request_human_approval
decide_next_step -> finalize_interaction_report

finalize_interaction_report -> END
```

Conditional edge requirements:

- Route from `review_action_safety` to `finalize_interaction_report` with `interaction_status: "blocked"` when the action is disallowed by policy.
- Route from `review_action_safety` to `request_human_approval` when an action is sensitive, irreversible, externally visible, transactional, or low confidence.
- Route from `request_human_approval` to `execute_action` only when approval is present and positive.
- Route from `request_human_approval` to `finalize_interaction_report` with `interaction_status: "needs_approval"` when approval is missing, or `blocked` when approval is rejected.
- Route from `decide_next_step` to `observe_environment` when the previous action succeeded and more work remains.
- Route from `decide_next_step` to `recover_from_failure` when the environment changes unexpectedly, a target element is missing, a validation error appears, or the action result is uncertain.
- Route from `decide_next_step` to `request_human_approval` when recovery would require a sensitive or ambiguous action.
- Route from `decide_next_step` to `finalize_interaction_report` when the task is completed, blocked, failed, or `step_count >= max_steps`.

## Inputs and Outputs

- Input: task goal, environment type, initial observation, optional constraints, safety policy, maximum steps, maximum recovery attempts, and optional human approval.
- Output: `interaction_report`, including status, summary, completed actions, skipped or blocked actions, pending approval, final observation, safety findings, errors, and trace.
- Intermediate artifacts: recognized elements, element interpretations, task context, action plan, pending action, action result, observation history, environment events, and recovery attempts.

Example output shape:

```json
{
  "status": "needs_approval",
  "summary": "Copied the invoice total into the reimbursement form and paused before submission.",
  "completed_actions": [
    {
      "type": "type",
      "target": "amount_field",
      "value": "$248.90",
      "verified": true
    }
  ],
  "pending_action": {
    "type": "click",
    "target": "submit_button",
    "reason": "Submitting the reimbursement form is externally visible."
  },
  "safety_findings": [
    {
      "policy": "approval_required_for_form_submission",
      "severity": "medium"
    }
  ],
  "errors": []
}
```

## Failure Cases

Document expected failures, retries, fallback behavior, and human-review points.

- Missing `task_goal` or `initial_observation` should produce `interaction_status: "failed"` with a validation error and no action execution.
- Empty or low-confidence element recognition should trigger one bounded re-observation or clarification request before failing.
- A missing target element should route to recovery, such as scroll, wait, re-observe, or ask for human clarification.
- Loading states should route through a bounded wait-and-observe recovery path.
- Unexpected pop-ups should be classified before dismissal; security, permission, payment, consent, or account dialogs require human review.
- Validation errors after typing or form submission should be captured in `environment_events` and routed to planning or recovery.
- Disallowed actions should be blocked before execution and recorded in `safety_findings`.
- Sensitive actions such as purchases, submissions, account changes, messages, uploads, downloads, or destructive edits should require explicit human approval.
- Reaching `max_steps` or `max_recovery_attempts` should stop the graph with `interaction_status: "failed"` or `blocked`, preserving the trace.
- Environment adapter exceptions should be converted into structured errors without losing prior observations or action history.

## Test Ideas

- Verify the happy path where the graph recognizes a field, types a value, observes the updated field, and completes.
- Verify that a submit or purchase action routes to `request_human_approval` before execution.
- Verify that rejected approval prevents execution and finalizes with `interaction_status: "blocked"`.
- Verify that a missing element triggers bounded recovery and then succeeds after a new observation includes the element.
- Verify that a loading event causes the graph to wait or re-observe without incrementing unsafe actions.
- Verify that `max_steps` stops an unfinished task and preserves the action trace.
- Verify that element recognition and action planning can be tested with deterministic fake model outputs.
- Verify that the fake environment adapter receives only approved actions.
- Verify that private observation fields are redacted in `interaction_report` when required by `constraints`.

## Open Questions

- The TOC lists Appendix B as logical pages `358-363`, but extraction found the Appendix B body on PDF labels/file pages `378-384` with local footer pages `1-7`. Appendix C begins at PDF label/file page `385`, so file page `384` appears to belong to Appendix B despite the 6-page logical TOC span.
- The progress file title is `Appendix B: AI Agentic From GUI to Real world environment`, while the extracted PDF heading is `Appendix B - AI Agentic Interactions: From GUI to Real World environment`.
- Appendix B references specific products and projects as examples. This requirement treats them as source-text examples only; the LangGraph implementation should not depend on current availability, product behavior, or live external services.
