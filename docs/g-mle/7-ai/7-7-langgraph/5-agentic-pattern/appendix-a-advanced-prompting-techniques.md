---
sidebar_position: 101
---

# Appendix A: Advanced Prompting Techniques (en)

## Pattern Summary

Advanced Prompting Techniques are the practical controls that turn a general language model into a predictable component inside an agentic workflow. Appendix A starts with core prompt principles such as clarity, specificity, concision, active verbs, positive instructions, and iterative refinement. It then layers concrete techniques: zero-shot, one-shot, few-shot, and many-shot examples; system prompts, role prompts, delimiters, context engineering, and structured output; reasoning techniques such as Chain of Thought, self-consistency, step-back prompting, and Tree of Thoughts; action techniques such as function calling and ReAct; and prompt optimization methods such as Automatic Prompt Engineering, DSPy-style optimization, iterative refinement, negative examples, analogies, decomposition, RAG, personas, persistent task-specific assistants, meta-prompt refinement, code prompting, and multimodal prompting.

For implementation, treat the appendix as a prompt-engineering workbench rather than a single model prompt. The LangGraph example should accept a user task, analyze what kind of prompting support it needs, assemble a prompt package from explicit sections, run bounded trial evaluations through injectable model/test doubles, validate structured outputs when requested, refine the prompt from observed failures, and return the final prompt package with evaluation metadata.

## Pattern Explanation

### Conceptual Overview

Prompting is the interface layer between an agentic system and a language model. In the appendix, prompt engineering is presented as a disciplined practice: describe the task clearly, provide only useful context, demonstrate the expected behavior when examples help, require machine-readable formats when downstream components depend on the answer, and iterate based on actual model outputs.

In agentic systems, prompts are not isolated text snippets. They become reusable contracts between graph nodes, tools, memory, retrieval, and model calls. A good prompt explains the model's role, inputs, context boundaries, output schema, reasoning or tool-use expectations, and stop conditions well enough that the graph can parse, validate, and route the result.

### Problem

Language models are probabilistic and sensitive to vague instructions, missing context, poor examples, conflicting constraints, and underspecified output formats. In an agent graph, those weaknesses can cascade: a malformed response can break a parser, an unclear tool instruction can call the wrong tool, a reasoning shortcut can produce an unsupported answer, and an overlong context can hide the important facts.

Advanced prompting solves this by making prompt construction explicit, testable, and iterative. The graph should choose techniques based on the task rather than relying on one generic prompt for everything.

### When to Use

- Use this pattern when an agent node needs reliable, repeatable model behavior.
- Use it when model output will feed another graph node, parser, tool call, API, or Pydantic model.
- Use it when examples are needed to teach a format, tone, classification boundary, or extraction schema.
- Use it when the task requires multi-step reasoning, alternative solution paths, abstraction, or decomposition.
- Use it when the answer must be grounded in retrieved, current, proprietary, or user-specific context.
- Use it when prompts are reused in production and should be versioned, evaluated, and refined.
- Use it when prompt quality must be measured across sample inputs, not judged by one manual trial.

### When Not to Use

- Avoid complex prompting workflows for simple tasks that a direct instruction handles reliably.
- Avoid exposing raw chain-of-thought as the user-facing output; return concise rationale, validated artifacts, and evidence instead.
- Avoid few-shot or many-shot prompts when examples are low quality, biased, repetitive, or consume context needed for the live task.
- Avoid self-consistency or Tree of Thoughts when latency, token cost, or model-call budgets are tight.
- Avoid tool-use prompts unless tool schemas, permissions, and execution boundaries are explicit.
- Avoid structured-output prompts without parser validation and fallback behavior.
- Avoid automatic prompt optimization when there is no goldset, scoring metric, or review process to prevent overfitting.

### How It Works

1. The graph receives a task description, target audience, desired output, optional examples, optional context, and optional evaluation cases.
2. It analyzes the task to decide whether it needs direct zero-shot prompting, examples, a role, dynamic context, structured output, reasoning support, tool-use instructions, retrieval grounding, or prompt optimization.
3. It builds a prompt package with clear sections such as system instruction, role, task, context, examples, negative examples, delimiter rules, output schema, and evaluation notes.
4. It generates one or more prompt candidates, keeping them concise and explicit.
5. It runs bounded trial calls through an injectable model runner or test double using representative inputs.
6. It validates trial outputs, including JSON/XML/Pydantic parsing when structured output is required.
7. It evaluates results against deterministic checks, expected labels, schema validity, or reviewer feedback.
8. If quality is below threshold and the iteration budget remains, it refines the prompt by adding specificity, better delimiters, improved examples, a clearer persona, or stronger output-format instructions.
9. It finalizes the best prompt package, including the selected techniques, evaluation summary, known limits, and a concise explanation of why those techniques were chosen.

### Trade-offs

| Benefit | Cost or Risk |
| --- | --- |
| Makes model behavior more predictable for agent nodes. | Adds design, evaluation, and maintenance overhead. |
| Structured output enables downstream parsing and graph routing. | The model can still emit invalid JSON or schema-incompatible data. |
| Examples improve adherence to style, labels, and schemas. | Poor examples can teach the wrong pattern or overfit the prompt. |
| Dynamic context and RAG ground responses in current or private data. | Context pipelines introduce privacy, token budget, retrieval quality, and provenance risks. |
| Reasoning prompts improve complex task performance. | Extra reasoning increases cost and latency and should not be exposed raw. |
| Self-consistency and Tree of Thoughts can reduce single-sample errors. | Multiple model calls can still converge on a wrong answer without validation. |
| Prompt optimization scales refinement across many tasks. | Optimization needs representative data and objective metrics or it can optimize for the wrong behavior. |

### Minimal Example

```text
User task: "Extract customer contact data from support emails as JSON."
  -> analyze task: extraction, structured output, schema validation needed
  -> select techniques: system prompt, delimiters, few-shot examples, JSON schema, negative example
  -> build prompt candidate with <email> delimiters and required keys
  -> run trial emails through fake/model runner
  -> validate JSON with a Pydantic schema
  -> refine if phone_number is missing or malformed
  -> return final prompt package plus validation summary
```

### LangGraph Mapping

| Pattern Concept | LangGraph Element |
| --- | --- |
| User task and desired behavior | State fields `input`, `task_description`, and `success_criteria` |
| Core prompting principles | Node `analyze_task` and state field `prompt_requirements` |
| Zero-shot, one-shot, few-shot, many-shot selection | Node `select_prompting_strategy` and state field `selected_techniques` |
| System, role, delimiters, and context sections | Node `assemble_prompt_sections` and state field `prompt_sections` |
| Context engineering and RAG context | Node `build_context_pack` and state field `context_pack` |
| Structured output contract | State fields `output_schema`, `parser_type`, and node `validate_trial_output` |
| Chain of Thought, step-back, self-consistency, Tree of Thoughts | Strategy flags in `selected_techniques` and trial metadata in `reasoning_config` |
| Function calling and ReAct prompt support | State fields `tool_contracts` and `action_format` |
| Automatic or iterative prompt refinement | Nodes `evaluate_trial_results` and `refine_prompt_candidate` |
| Prompt attempt documentation | State fields `prompt_versions`, `trial_results`, and `evaluation_summary` |
| Final reusable prompt package | Node `finalize_prompt_package` and state field `final_output` |

## LangGraph Implementation Goal

Build a LangGraph example named `advanced_prompting_workbench` that helps an engineer design, evaluate, and refine prompts for agentic nodes. The user provides a prompting task, optional audience/persona, optional examples, optional retrieved context, optional output schema, and optional trial inputs. The graph chooses appropriate prompting techniques from Appendix A, assembles a structured prompt package, runs bounded trial evaluations through injectable model runners, validates outputs, iterates on failures, and returns the final prompt package.

The first implementation should avoid network dependencies. Model calls, retrieval, and prompt scoring should be injectable so tests can use deterministic fakes. The graph should demonstrate the appendix's main engineering idea: prompt quality is improved by explicit structure, examples, context, output contracts, evaluation, and iteration.

Expected workflow outcome:

- Simple tasks can produce a direct zero-shot prompt with minimal sections.
- Format-sensitive tasks can add examples, delimiters, and structured-output instructions.
- Reasoning-heavy tasks can add step-back, concise reasoning-summary, self-consistency, or Tree-of-Thought configuration without exposing raw chain-of-thought.
- Tool-using tasks can include tool descriptions and action/observation formatting requirements without executing tools in this graph.
- RAG-style tasks can include retrieved context blocks and provenance notes from an injected context provider.
- The final output includes the prompt text, selected techniques, schema or parser instructions, test/evaluation results, refinement history, and known limitations.

## State Shape

List the state fields the graph needs.

| Field | Type | Purpose |
| --- | --- | --- |
| `input` | `str` | Original user request for a prompt or prompt-improvement task. |
| `task_description` | `str` | Normalized description of what the target prompt should accomplish. |
| `target_audience` | `str \| None` | Intended reader or user persona for the model output. |
| `model_role` | `str \| None` | Role or persona assigned to the model, such as analyst, tutor, extractor, or reviewer. |
| `success_criteria` | `list[str]` | Observable criteria used to evaluate prompt outputs. |
| `prompt_requirements` | `dict[str, Any]` | Analysis of task type, risk level, output format, context needs, reasoning needs, and tool-use needs. |
| `selected_techniques` | `list[str]` | Techniques chosen from the appendix, such as `few_shot`, `structured_output`, `rag_context`, or `self_consistency`. |
| `examples` | `list[dict[str, str]]` | Positive input-output examples for one-shot, few-shot, or many-shot prompting. |
| `negative_examples` | `list[dict[str, str]]` | Optional examples showing outputs to avoid or classification boundaries. |
| `context_sources` | `list[dict[str, Any]]` | Retrieved or provided context records with source identifiers and trust metadata. |
| `context_pack` | `str \| None` | Delimited context block assembled for the prompt. |
| `output_schema` | `dict[str, Any] \| None` | Machine-readable output contract, such as JSON keys or Pydantic-compatible field definitions. |
| `parser_type` | `str \| None` | Parser expectation such as `json`, `xml`, `markdown_table`, or `free_text`. |
| `tool_contracts` | `list[dict[str, Any]]` | Optional tool names, descriptions, and argument schemas to include in a tool-use prompt. |
| `reasoning_config` | `dict[str, Any]` | Configuration for reasoning prompts, self-consistency samples, branch limits, and user-safe rationale. |
| `prompt_sections` | `dict[str, str]` | System, role, instruction, context, examples, constraints, schema, and final-response sections. |
| `prompt_candidate` | `str \| None` | Current assembled prompt text. |
| `prompt_versions` | `list[dict[str, Any]]` | History of candidates, selected techniques, changes, and scores. |
| `trial_inputs` | `list[dict[str, Any]]` | Representative test inputs for evaluating the prompt. |
| `trial_results` | `list[dict[str, Any]]` | Outputs, parse results, scores, and errors from running prompt trials. |
| `validation_errors` | `list[dict[str, Any]]` | Schema, parser, delimiter, missing-field, or unsafe-output errors. |
| `evaluation_summary` | `dict[str, Any] \| None` | Aggregate pass rate, best candidate ID, failed criteria, and recommendation. |
| `refinement_feedback` | `list[str]` | Specific instructions for improving the next prompt candidate. |
| `iteration` | `int` | Current refinement iteration. |
| `max_iterations` | `int` | Cap on prompt-refinement loops. |
| `status` | `str` | Lifecycle status such as `ok`, `needs_review`, `partial`, `invalid_input`, or `failed`. |
| `errors` | `list[str]` | Recoverable graph, validation, model-runner, or evaluation errors. |
| `final_output` | `dict[str, Any] \| None` | Final prompt package, selected techniques, evaluation metadata, and limitations. |

## Nodes

| Node | Responsibility |
| --- | --- |
| `prepare_request` | Validate non-empty input, normalize fields, initialize counters, defaults, and artifact lists. |
| `analyze_task` | Classify the prompting task by output type, complexity, context needs, reasoning needs, risk, and downstream parser needs. |
| `select_prompting_strategy` | Choose appropriate techniques, starting simple and adding examples, schema, context, reasoning, or tool contracts only when justified. |
| `build_context_pack` | Assemble provided or retrieved context into delimited sections with source identifiers and token-budget checks. |
| `assemble_prompt_sections` | Create explicit system, role, task, context, examples, negative examples, output schema, and response-format sections. |
| `generate_prompt_candidate` | Render the sections into a concise prompt candidate and store it in `prompt_versions`. |
| `run_prompt_trials` | Execute the candidate against representative trial inputs using an injectable model runner or deterministic test double. |
| `validate_trial_output` | Parse and validate outputs against the configured parser, schema, required fields, and safety constraints. |
| `evaluate_trial_results` | Score trials against success criteria, aggregate failures, and decide whether the candidate is good enough. |
| `refine_prompt_candidate` | Produce targeted revisions based on validation errors and failed criteria while preserving useful prior sections. |
| `finalize_prompt_package` | Return the final prompt, selected techniques, evaluation summary, version history, parser guidance, and known limits. |
| `handle_failure` | End with a clear failure or human-review status for invalid input, conflicting requirements, missing schema, or exhausted iteration budget. |

## Edges

Describe the graph flow, including conditional branches.

```text
START
  -> prepare_request
  -> analyze_task
  -> select_prompting_strategy
  -> build_context_pack
  -> assemble_prompt_sections
  -> generate_prompt_candidate
  -> run_prompt_trials
  -> validate_trial_output
  -> evaluate_trial_results

evaluate_trial_results -> refine_prompt_candidate -> assemble_prompt_sections
evaluate_trial_results -> finalize_prompt_package -> END
evaluate_trial_results -> handle_failure -> END

prepare_request -> handle_failure -> END
build_context_pack -> handle_failure -> END
validate_trial_output -> handle_failure -> END
```

Conditional edge requirements:

- Route from `prepare_request` to `handle_failure` when `input` is blank or required task details cannot be inferred.
- Route from `select_prompting_strategy` with no examples directly into zero-shot prompt assembly for simple tasks.
- Route through example sections when one-shot, few-shot, many-shot, or negative examples are selected.
- Route through context assembly when the task requests RAG, user history, tool outputs, or domain documents.
- Route through structured-output validation when `parser_type` is not `free_text`.
- Route from `evaluate_trial_results` to `finalize_prompt_package` when required criteria pass or no trial inputs are provided and the prompt is syntactically valid.
- Route from `evaluate_trial_results` to `refine_prompt_candidate` when failures are actionable and `iteration < max_iterations`.
- Route from `evaluate_trial_results` to `handle_failure` when criteria fail after the iteration budget, the output schema is contradictory, or safety/human-review policy blocks finalization.

## Inputs and Outputs

- Input: a natural-language prompt-design request, optional target audience, optional model role, optional examples or negative examples, optional output schema, optional tool contracts, optional context records, optional trial inputs, optional success criteria, and optional max-iteration setting.
- Output: `final_output`, including `status`, `final_prompt`, `selected_techniques`, `prompt_sections`, `parser_type`, `output_schema`, `evaluation_summary`, `prompt_versions`, `validation_errors`, and `known_limitations`.
- Intermediate artifacts:
  - normalized task description,
  - prompt requirements,
  - context pack,
  - generated prompt candidates,
  - trial outputs,
  - parser results,
  - refinement feedback,
  - iteration counters.

Example successful output shape:

```json
{
  "status": "ok",
  "final_prompt": "You are a precise information extraction assistant...\n<email>{email}</email>\nReturn only valid JSON with keys: name, address, phone_number.",
  "selected_techniques": [
    "role_prompting",
    "delimiters",
    "few_shot",
    "structured_output",
    "iterative_refinement"
  ],
  "parser_type": "json",
  "evaluation_summary": {
    "trial_count": 3,
    "passed": 3,
    "failed_criteria": []
  },
  "known_limitations": [
    "The prompt assumes one contact record per email."
  ]
}
```

Example partial output shape:

```json
{
  "status": "partial",
  "final_prompt": "Draft prompt omitted here for brevity.",
  "selected_techniques": ["structured_output", "few_shot"],
  "evaluation_summary": {
    "trial_count": 4,
    "passed": 3,
    "failed_criteria": ["phone_number must be normalized to E.164 format"]
  },
  "validation_errors": [
    {
      "trial_id": "case_004",
      "error": "phone_number format mismatch"
    }
  ]
}
```

## Failure Cases

Document expected failures, retries, fallback behavior, and human-review points.

- Blank or purely conversational input should fail before prompt generation.
- Conflicting requirements, such as "return JSON only" and "include a prose explanation outside JSON", should produce `needs_review` or a targeted clarification error.
- Too many examples or too much context should trigger token-budget pruning or a clear failure instead of silently dropping important inputs.
- Low-quality examples, inconsistent labels, or unbalanced classification examples should be flagged before they are embedded in the prompt.
- Negative examples should be used sparingly; overemphasis can make the model focus on forbidden content rather than the target behavior.
- Structured-output prompts can still produce malformed JSON, XML, or tables. The graph should validate and refine, not trust the prompt alone.
- Pydantic or schema validation failures should produce actionable refinement feedback, such as missing fields or wrong types.
- Self-consistency majority voting can select the wrong answer when most samples share the same misconception. Tests should not treat majority vote as truth without task validation.
- Tool-use or ReAct prompt packages should define action formats but should not execute arbitrary tools in this graph.
- RAG or context-engineered prompts can leak sensitive information if context governance is missing; sensitive context should route to human review.
- Prompt optimization can overfit to a small goldset. Evaluation should report coverage limits and avoid claiming general correctness.
- Multimodal prompt requests should be marked unsupported or partial unless the implementation has an image/audio/video model runner and test fixtures.
- If the model runner is unavailable, the graph should still be able to return an unevaluated prompt package with `partial` status when syntax checks pass.

## Test Ideas

- Verify that a simple summarization task selects a zero-shot strategy and does not add unnecessary examples or reasoning configuration.
- Verify that an extraction task with a schema selects structured output, delimiters, and validation.
- Verify that a classification task with examples preserves example diversity and does not reorder labels into a single-class block.
- Verify that conflicting output requirements route to `handle_failure` or `needs_review`.
- Verify that invalid JSON from a trial output produces a validation error and a refinement loop.
- Verify that the graph stops after `max_iterations` and returns partial/failure metadata rather than looping.
- Verify that context records are delimited and source identifiers are preserved in `context_pack`.
- Verify that token-budget limits prune or reject excess context deterministically.
- Verify that a reasoning-heavy task selects a user-safe reasoning summary configuration rather than requesting raw chain-of-thought output.
- Verify that a tool-use task includes tool names and argument schemas in `tool_contracts` but does not execute tools.
- Verify that model runners, retrieval providers, and scorers can be replaced with deterministic fakes for tests.
- Verify that `prompt_versions` records each candidate, score, and refinement reason.

## Open Questions

- The TOC lists Appendix A as logical pages `330-357`, but the visible Appendix A extraction begins at PDF file label `349` / zero-based index `348` and Appendix B begins at file label `378` / zero-based index `377`. The extracted Appendix A body therefore spans file labels `349-377`, with local counters `1-29`, not the TOC's 28-page logical range.
- The appendix is a survey of many prompting techniques rather than one narrow design pattern. This requirement maps it to one LangGraph graph, `advanced_prompting_workbench`, that demonstrates technique selection, prompt assembly, trial evaluation, validation, and iterative refinement.
- The source text contains the heading typo `Contextual Enginnering`; this document uses `context engineering` while preserving the extraction note.
- The self-consistency example in the source uses majority voting on the claim "All birds can fly" and notes that better approaches would weigh reasoning quality. The implementation should treat self-consistency as a confidence signal, not proof of factual correctness.
