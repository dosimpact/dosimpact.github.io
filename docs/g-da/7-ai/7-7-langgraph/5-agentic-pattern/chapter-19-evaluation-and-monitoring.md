---
sidebar_position: 19
---

# Requirement: Chapter 19: Evaluation and Monitoring

## Source

- PDF: `Agentic_Design_Patterns.pdf`
- Section: `Chapter 19: Evaluation and Monitoring`
- Page range: `289-306` logical pages from `docs/agentic-design-patterns-toc.md`
- Extraction note: the visible Chapter 19 heading was found at PDF page label `306` / one-based file page `306` / zero-based index `305`. Chapter 20 starts at PDF page label `325` / one-based file page `325` / zero-based index `324`. The extracted Chapter 19 span is therefore PDF indexes `305-323`, file pages `306-324`, with chapter-local page counters `1-19`. This is ambiguous because the TOC logical range `289-306` covers 18 logical pages and differs from the visible PDF labels by 17 pages.

## Pattern Summary

Evaluation and Monitoring gives an agent workflow a structured way to measure whether the agent remains effective, efficient, and aligned after it is built or deployed. The chapter distinguishes this pattern from Chapter 11's internal goal monitoring by focusing on continuous, often external measurement: response quality, latency, token usage, safety and compliance, drift, anomalies, trajectory quality, and multi-agent coordination.

The chapter's practical examples include live performance tracking, A/B testing, compliance and safety audits, drift detection, anomaly detection, learning-progress assessment, response accuracy scoring, latency and token tracking, LLM-as-a-Judge rubrics, trajectory evaluation, test files, evalset files, and evaluation support in Google's ADK.

For the first LangGraph example, this requirement should implement an evaluation harness for a recorded agent run. The graph should accept a run record, expected behavior, thresholds, and optional baseline metrics; compute deterministic quality and operational metrics; optionally call a mockable judge for rubric-based assessment; compare the actual tool/action trajectory with the expected trajectory; detect drift or anomalies; and emit a structured evaluation report with pass/fail status, alerts, and recommended follow-up.

## Pattern Explanation

### Conceptual Overview

Evaluation and Monitoring treats agent behavior as something that must be measured continuously, not trusted because a prompt looked good once. An agent can return plausible text while using the wrong tool, taking too long, consuming too many tokens, violating a policy, or drifting as user inputs and environments change.

Chapter 19 frames evaluation as a multi-layer practice. Some checks are objective, such as latency, token counts, exact tool calls, and threshold breaches. Others are qualitative, such as helpfulness, neutrality, and legal survey quality, where a human or LLM judge may apply a rubric. The intended LangGraph graph should make those measurement layers explicit in state and route to alerts when the run does not satisfy the contract.

### Problem

Traditional pass/fail software tests are not enough for probabilistic agents. Agents may produce different outputs across runs, take unexpected tool paths, degrade after deployment, or behave acceptably on final answer text while failing operational or safety requirements.

This pattern solves that problem by defining what to measure, collecting observations from each run, comparing those observations against expected outputs and trajectories, and producing a report that can support regression tests, A/B comparisons, drift detection, audits, and human review.

### When to Use

- Use this pattern when an agent is moving beyond a prototype and needs repeatable evaluation.
- Use it when response quality, factuality, helpfulness, neutrality, or compliance must be measured.
- Use it when operational metrics such as latency, token usage, cost, and resource consumption matter.
- Use it when the agent uses tools and the sequence of tool calls is part of correctness.
- Use it when comparing agent versions, models, prompts, planners, or routing strategies.
- Use it when production behavior may drift because user inputs, data distributions, tools, or environments change.
- Use it when multi-agent cooperation, handoffs, and task selection need to be evaluated as a system.
- Use it when regulated or high-stakes workflows require audit reports and alerting.

### When Not to Use

- Avoid this pattern for a trivial one-shot demo where a simple assertion is enough.
- Avoid LLM-as-a-Judge for high-stakes decisions unless its rubric, calibration, and failure handling are independently reviewed.
- Avoid relying on exact text match as the only quality metric for natural-language answers that may be correct when paraphrased.
- Avoid monitoring without thresholds, ownership, or follow-up actions; unused alerts become noise.
- Avoid collecting raw prompts, outputs, or tool payloads when privacy and retention rules are not defined.
- Avoid treating evaluation scores as objective truth when the metric only approximates the target behavior.

### How It Works

1. Capture a complete agent run record, including user input, final output, intermediate responses, tool calls, latency, token usage, model or prompt version, and optional safety metadata.
2. Load the expected behavior for that run: reference output, expected trajectory, rubric, metric thresholds, and any contract requirements.
3. Compute deterministic response metrics such as exact match, keyword coverage, simple semantic proxy scores, and required-output checks.
4. Measure operational metrics such as elapsed time, token usage, cost estimate, and resource limits.
5. Compare the actual trajectory with the expected trajectory using exact-match, in-order, any-order, precision, recall, or single-tool-use checks.
6. When qualitative judgment is required, call a rubric-based evaluator or mock judge and validate its structured output.
7. Compare current metrics with baselines or thresholds to detect regressions, drift, anomalies, and compliance failures.
8. Finalize an evaluation report that records pass/fail status, metric values, alerts, recommended action, and enough evidence for tests or review.

### Trade-offs

| Benefit | Cost or Risk |
| --- | --- |
| Makes agent quality measurable beyond a single final answer. | Requires careful metric design and more state than a direct graph. |
| Catches regressions in tool use, latency, cost, and safety before deployment. | False positives can create alert fatigue and slow iteration. |
| Supports A/B testing and baseline comparison across agent versions. | Comparisons are misleading when traffic, inputs, or test data are not comparable. |
| Trajectory checks reveal wrong reasoning paths or tool choices. | Strict trajectory matching can reject acceptable alternate paths. |
| LLM-as-a-Judge can scale subjective evaluation. | Judge models can be biased, inconsistent, blocked, or wrong. |
| Audit reports improve accountability in production systems. | Logs and reports can expose sensitive data unless redacted and retained carefully. |
| Drift and anomaly detection make monitoring continuous. | Drift baselines can age, and thresholds need maintenance. |

### Minimal Example

```text
Recorded run:
  user_input: "Turn off device_2 in the Bedroom"
  actual_tools: [set_device_info(location="Bedroom", device_id="device_2", status="OFF")]
  final_output: "I have set device_2 to off."
  latency_ms: 820
  tokens: 143

Expected behavior:
  required_tool: set_device_info
  expected_final_response: "I have set the device_2 status to off."
  latency_limit_ms: 1500
  token_limit: 300

Flow:
  -> compute answer quality metrics
  -> evaluate tool trajectory
  -> check latency and token thresholds
  -> run rubric judge only if subjective checks are configured
  -> detect regressions against baseline
  -> return pass report or alerts
```

### LangGraph Mapping

| Pattern Concept | LangGraph Element |
| --- | --- |
| Recorded agent behavior | State fields `agent_run`, `actual_output`, `actual_trajectory`, and `run_metadata` |
| Expected behavior or contract | State fields `reference_output`, `expected_trajectory`, `rubric`, and `thresholds` |
| Response assessment | Node `score_response_quality` and state field `response_metrics` |
| Latency and token monitoring | Node `score_operational_metrics` and state field `operational_metrics` |
| Trajectory evaluation | Node `evaluate_trajectory` and state field `trajectory_metrics` |
| LLM-as-a-Judge rubric | Conditional node `run_rubric_judge` and state field `judge_result` |
| Drift and anomaly detection | Node `detect_regressions_and_anomalies` and state fields `baseline_metrics`, `drift_signals`, and `alerts` |
| Compliance and safety audit | Node `audit_requirements` and state field `audit_findings` |
| Final report | Node `finalize_report` and state field `evaluation_report` |

## LangGraph Implementation Goal

Build a LangGraph example of an agent evaluation and monitoring harness. The user or test supplies one recorded agent run and an evaluation contract. The graph scores response quality, operational behavior, tool trajectory, and compliance requirements, then produces a structured report suitable for a unit test, CI check, or monitoring dashboard.

The implementation should not depend on Google's ADK or any external monitoring service. It should mirror the chapter's concepts with local, deterministic code wherever possible and use injectable or fake components for judge-based scoring. The first graph should evaluate one run at a time, while keeping state fields that can later support evalset files, A/B comparisons, and production monitoring.

Expected workflow outcome:

- The graph validates that a run record and evaluation contract are present.
- Deterministic metrics are computed for answer quality, trajectory, latency, token usage, and configured limits.
- A rubric judge is called only when subjective criteria are configured, and its JSON-like result is validated.
- The actual trajectory is compared with the expected trajectory using the configured match mode.
- Baseline metrics and thresholds produce regression, drift, anomaly, or compliance alerts.
- The final output is a structured `evaluation_report` with status, metric details, failures, alerts, and recommended action.

## State Shape

List the state fields the graph needs.

| Field | Type | Purpose |
| --- | --- | --- |
| `input` | `str` | Human-readable name or description of the evaluation run. |
| `agent_run` | `dict[str, Any]` | Complete recorded run, including user input, final output, intermediate messages, tool calls, timestamps, and metadata. |
| `actual_output` | `str` | Final response generated by the evaluated agent. |
| `reference_output` | `str \| None` | Expected final response or reference answer, when available. |
| `actual_trajectory` | `list[dict[str, Any]]` | Ordered tool calls, actions, handoffs, or major reasoning steps observed in the run. |
| `expected_trajectory` | `list[dict[str, Any]]` | Expected or acceptable tool/action sequence for trajectory evaluation. |
| `trajectory_match_mode` | `str` | Comparison mode such as `exact`, `in_order`, `any_order`, `precision_recall`, or `single_tool`. |
| `run_metadata` | `dict[str, Any]` | Latency, token counts, model name, prompt version, agent version, environment, and timestamp. |
| `thresholds` | `dict[str, Any]` | Limits and pass criteria for score, latency, token usage, cost, safety, and compliance. |
| `rubric` | `dict[str, Any] \| None` | Optional rubric for subjective judgment, including criteria, scale, and required JSON schema. |
| `baseline_metrics` | `dict[str, Any] \| None` | Previous or control metrics for regression, A/B, or drift comparison. |
| `response_metrics` | `dict[str, Any]` | Accuracy, string similarity, keyword coverage, required-output checks, and pass flags. |
| `operational_metrics` | `dict[str, Any]` | Latency, token usage, estimated cost, and resource-threshold results. |
| `trajectory_metrics` | `dict[str, Any]` | Match score, missing actions, extra actions, order violations, precision, recall, and pass flags. |
| `judge_result` | `dict[str, Any] \| None` | Structured LLM-as-a-Judge or fake judge result with score, rationale, concerns, and recommended action. |
| `audit_findings` | `list[dict[str, Any]]` | Compliance, safety, privacy, policy, or contract findings detected during evaluation. |
| `drift_signals` | `dict[str, Any]` | Regression, drift, anomaly, and A/B comparison signals derived from thresholds and baselines. |
| `alerts` | `list[dict[str, Any]]` | Alert records with severity, metric, reason, and recommended owner/action. |
| `evaluation_status` | `str` | Overall state such as `passed`, `failed`, `warning`, `needs_review`, or `invalid`. |
| `errors` | `list[str]` | Validation, metric, judge, parsing, or missing-data errors. |
| `evaluation_report` | `dict[str, Any] \| None` | Final structured report returned by the graph. |

## Nodes

| Node | Responsibility |
| --- | --- |
| `prepare_evaluation` | Validate required inputs, normalize the run record, extract output, trajectory, metadata, thresholds, and defaults. |
| `score_response_quality` | Compute deterministic output metrics such as exact match, normalized string similarity, keyword coverage, and required-answer checks. |
| `score_operational_metrics` | Check latency, input tokens, output tokens, total tokens, cost estimate, and resource thresholds. |
| `evaluate_trajectory` | Compare actual and expected tool/action trajectories using the configured match mode. |
| `audit_requirements` | Check configured safety, compliance, privacy, and contract requirements against output and run metadata. |
| `decide_judge_need` | Decide whether subjective rubric evaluation is required or can be skipped. |
| `run_rubric_judge` | Invoke an injectable judge provider or deterministic fake and require structured output. |
| `validate_judge_result` | Validate judge fields, score bounds, rationale, concerns, and recommended action. |
| `detect_regressions_and_anomalies` | Compare metrics with thresholds and baselines to detect regression, drift, anomalies, or A/B differences. |
| `decide_evaluation_status` | Aggregate metric pass flags, judge result, audit findings, drift signals, and errors into an overall status. |
| `finalize_report` | Produce `evaluation_report` with metrics, failures, alerts, evidence, and recommended follow-up. |

## Edges

Describe the graph flow, including conditional branches.

```text
START
  -> prepare_evaluation
  -> score_response_quality
  -> score_operational_metrics
  -> evaluate_trajectory
  -> audit_requirements
  -> decide_judge_need

decide_judge_need -> run_rubric_judge -> validate_judge_result -> detect_regressions_and_anomalies
decide_judge_need -> detect_regressions_and_anomalies

detect_regressions_and_anomalies
  -> decide_evaluation_status
  -> finalize_report
  -> END
```

Conditional edge requirements:

- Route from `prepare_evaluation` directly to `finalize_report` with `evaluation_status: "invalid"` when the run record is missing or malformed.
- Route from `decide_judge_need` to `run_rubric_judge` when a rubric is present, deterministic metrics are inconclusive, or subjective criteria such as helpfulness, neutrality, or clarity are configured.
- Route from `decide_judge_need` directly to `detect_regressions_and_anomalies` when deterministic metrics are sufficient and no rubric is configured.
- Route from `validate_judge_result` to `detect_regressions_and_anomalies` even when the judge result is malformed, but append an error and mark judge-dependent criteria as failed or `needs_review`.
- `detect_regressions_and_anomalies` must create alerts for threshold breaches, baseline regressions, drift signals, and anomalous trajectories.
- `decide_evaluation_status` must favor the stricter status when metrics disagree: policy failure beats judge approval, invalid input beats pass, and critical alerts produce `failed` or `needs_review`.
- The graph should not call network services in tests. Judge behavior must be injectable or fakeable.

## Inputs and Outputs

- Input: a recorded agent run, optional reference output, optional expected trajectory, thresholds, optional rubric, optional baseline metrics, and optional fake judge response.
- Output: `evaluation_report`, including overall status, metric values, trajectory result, audit findings, judge summary, drift or anomaly signals, alerts, and recommended action.
- Intermediate artifacts: normalized run metadata, response metrics, operational metrics, trajectory metrics, audit findings, judge result, drift signals, errors, and status.

Example evaluation output shape:

```json
{
  "status": "failed",
  "summary": "The response was acceptable, but the tool trajectory missed a required device-control action and latency exceeded the configured threshold.",
  "metrics": {
    "response": {
      "exact_match": false,
      "keyword_coverage": 1.0,
      "passed": true
    },
    "operational": {
      "latency_ms": 1840,
      "latency_limit_ms": 1500,
      "total_tokens": 260,
      "passed": false
    },
    "trajectory": {
      "match_mode": "in_order",
      "passed": false,
      "missing_actions": ["set_device_info"]
    }
  },
  "alerts": [
    {
      "severity": "critical",
      "metric": "trajectory",
      "reason": "Required tool action was not observed."
    },
    {
      "severity": "warning",
      "metric": "latency_ms",
      "reason": "Observed latency exceeded threshold."
    }
  ],
  "recommended_action": "Block release and inspect tool routing."
}
```

Example input shape:

```json
{
  "agent_run": {
    "input": "Where is order 12345?",
    "final_output": "Order 12345 is currently in transit.",
    "tool_calls": ["lookup_order"]
  },
  "reference_output": "Order 12345 is in transit.",
  "thresholds": {
    "latency_ms": 1500
  }
}
```

## Failure Cases

Document expected failures, retries, fallback behavior, and human-review points.

- Missing or malformed `agent_run` should produce `evaluation_status: "invalid"` without invoking the judge.
- Missing `reference_output` should not fail the whole graph if trajectory, rubric, or operational metrics are still configured; response metrics should record `not_applicable`.
- Exact-match response scoring should not be treated as sufficient for semantic equivalence when the task allows paraphrases.
- Missing `expected_trajectory` should skip trajectory scoring or mark it `not_applicable`, depending on thresholds.
- Unsupported `trajectory_match_mode` should append an error and route to `needs_review` or `invalid`.
- Latency, token, or cost metadata may be absent or approximate; the report should distinguish `missing`, `estimated`, and `measured`.
- Judge provider failure, blocked response, malformed JSON, missing score, or out-of-range score should append an error and fail judge-dependent criteria.
- A judge approval must not override deterministic compliance, safety, privacy, or trajectory failures.
- Drift detection should require a baseline; if no baseline exists, drift signals should be `not_applicable` rather than guessed.
- Anomaly thresholds should be configurable so one high-latency run can be handled differently from a sustained production issue.
- Reports must avoid exposing sensitive raw prompts, private tool payloads, or credentials unless the implementation explicitly redacts them.
- Multi-agent evaluations should preserve handoff and agent identity metadata; missing identities should reduce confidence in collaboration metrics.

## Test Ideas

- Verify the happy path where response quality, trajectory, latency, token usage, and audit checks all pass.
- Verify exact text mismatch can still pass when keyword or semantic proxy criteria satisfy the configured threshold.
- Verify a missing required tool call fails trajectory evaluation even if the final output looks correct.
- Verify `in_order`, `any_order`, `exact`, and `single_tool` trajectory match modes on small fixtures.
- Verify latency or token threshold breaches create alerts and affect `evaluation_status`.
- Verify no judge is called when no rubric is configured and deterministic metrics are conclusive.
- Verify a fake rubric judge result is validated and included in the final report.
- Verify malformed judge output produces an error and a `needs_review` or `failed` status.
- Verify baseline regression or drift signals are detected when current metrics fall below configured tolerances.
- Verify missing baseline marks drift as `not_applicable` without guessing.
- Verify compliance or safety audit failure overrides a passing judge score.
- Verify final state always includes `evaluation_report`, `evaluation_status`, `alerts`, `errors`, and all computed metric groups.

## Open Questions

- Page/index ambiguity: `docs/agentic-design-patterns-toc.md` lists Chapter 19 as logical pages `289-306`, but direct extraction found the visible chapter at PDF labels/file pages `306-324`, zero-based indexes `305-323`, with chapter-local page counters `1-19`. Chapter 20 begins at PDF label/file page `325`.
- PDF length ambiguity: `pypdf` reports `482` file pages, while the extracted table of contents describes `424` total pages. This requirement uses the visible Chapter 19 and Chapter 20 headings to define the extraction span.
- The chapter's figures were extractable as captions only: `Fig:1. Best practices for evaluation and monitoring`, `Fig. 2: Contract execution example among agents`, `Fig.3: Evaluation Support for Google ADK`, and `Fig.4: Evaluation and Monitoring design pattern`. The diagram contents were not converted into requirements.
- The chapter includes Google ADK-specific evaluation interfaces. The LangGraph implementation should reuse the underlying ideas of test files, evalsets, trajectory checks, and CI evaluation without depending on ADK.
- The exact-match accuracy code in the chapter is intentionally limited and fails on semantically equivalent paraphrases. The implementation should include exact match only as one metric among several, not as the sole quality gate.
- Contractor-style formal agreements are discussed as an evolution of agent reliability. This requirement includes contract and threshold fields but keeps the first graph focused on evaluating a single recorded run rather than implementing a full contractor system.
