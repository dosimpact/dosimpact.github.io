---
sidebar_position: 21
---

# Requirement: Chapter 21: Exploration and Discovery

## Source

- PDF: `Agentic_Design_Patterns.pdf`
- Section: `Chapter 21: Exploration and Discovery`
- Page range: `317-329` logical pages from `docs/agentic-design-patterns-toc.md`
- Extraction note: the visible Chapter 21 heading was found at PDF page label `335` / one-based file page `335` / zero-based index `334`. Appendix A starts at PDF page label `349` / one-based file page `349` / zero-based index `348`. The extracted Chapter 21 span is therefore PDF indexes `334-347`, file pages `335-348`, with chapter-local page counters `1-14`. This is ambiguous because the TOC logical range `317-329` covers 13 logical pages and differs from the visible PDF labels by 18-19 pages.

## Pattern Summary

Exploration and Discovery enables an agent to move beyond reactive task completion and deliberately search for new information, unknown unknowns, novel hypotheses, and unexpected solution paths. The chapter contrasts this with optimization inside a predefined solution space: the agent is not merely choosing the best known option, but expanding the set of possible options through investigation, experimentation, review, and refinement.

The chapter grounds the pattern in open-ended domains such as scientific research automation, strategy discovery, market research, vulnerability discovery, creative generation, and personalized education. Its main examples are Google Co-Scientist and Agent Laboratory. Both use specialized agents to generate ideas, critique them, rank or cluster promising directions, evolve candidates, and keep a human researcher in the loop for guidance and oversight.

For the first LangGraph example, this requirement should implement a bounded hypothesis-discovery workflow. The graph should accept an open-ended research goal, existing context, constraints, and safety policy; generate diverse candidate hypotheses; review them for novelty, plausibility, evidence, risk, and clarity; rank and cluster them; evolve the strongest candidates; and return a discovery brief with proposed next validation steps. Tests should use deterministic fake model outputs and local evidence, not external web or lab execution.

## Pattern Explanation

### Conceptual Overview

Exploration and Discovery treats an agent as an active investigator. Instead of waiting for a fully specified task or optimizing a known checklist, the agent asks what is missing, searches across available context, proposes possibilities, critiques those possibilities, and improves them through iteration.

Chapter 21 emphasizes multi-agent collaboration because discovery benefits from different perspectives. One component can generate hypotheses, another can review quality and novelty, another can rank or cluster alternatives, and another can synthesize the final research direction. Human feedback remains important because the chapter frames these systems as augmenting researchers rather than replacing them.

### Problem

Open-ended domains often lack a clear solution path. A single-pass agent may answer from static knowledge, overfit to obvious ideas, or miss hidden relationships in the available evidence. It may also produce speculative output without distinguishing promising hypotheses from unsupported guesses.

This pattern solves that problem by making discovery a structured workflow: gather context, identify gaps, generate multiple possibilities, evaluate them from several angles, prioritize the strongest directions, refine them, and surface the result with evidence, limitations, and next validation steps.

### When to Use

- Use this pattern when the task is open-ended and the solution space is not fully known.
- Use it when the desired output is a hypothesis, research direction, strategy, trend, creative concept, or new possibility.
- Use it when diverse candidate generation is useful before selecting one direction.
- Use it when multiple evaluation lenses are needed, such as novelty, plausibility, feasibility, evidence strength, safety, and impact.
- Use it when human experts need a structured brief that explains candidate ideas and their trade-offs.
- Use it when the system can tolerate iterative reasoning, higher latency, and additional model calls in exchange for better discovery.

### When Not to Use

- Avoid this pattern when the user needs a deterministic answer to a well-defined task.
- Avoid it when a simple retrieval, classification, routing, or prioritization graph is sufficient.
- Avoid autonomous experimentation in high-risk scientific, medical, cyber, financial, or physical domains without explicit human approval and safety controls.
- Avoid it when there is no reliable context or evidence source and the output would be pure speculation.
- Avoid it when latency, cost, or token budget makes iterative exploration impractical.
- Avoid treating ranked hypotheses as verified facts; the pattern produces candidates for validation, not proof.

### How It Works

1. Frame the exploration goal, domain, constraints, known context, and safety boundaries.
2. Screen the goal for unsafe or unsupported requests before generating candidates.
3. Explore supplied evidence or local knowledge sources to identify themes, gaps, assumptions, and unexplored angles.
4. Generate a diverse set of hypotheses or discovery directions from the goal and evidence.
5. Review each candidate for novelty, plausibility, support, feasibility, ethical risk, and clarity.
6. Rank candidates and optionally cluster similar ideas so the final set is diverse rather than redundant.
7. Evolve promising candidates by combining, simplifying, challenging, or reframing them.
8. Repeat review and evolution until quality thresholds or iteration limits are reached.
9. Produce a discovery brief that includes selected hypotheses, evidence links, limitations, safety notes, and proposed validation steps.

### Trade-offs

| Benefit | Cost or Risk |
| --- | --- |
| Expands the solution space beyond obvious answers. | Can generate unsupported or hallucinated hypotheses if evidence handling is weak. |
| Multi-perspective review improves novelty, quality, and robustness. | More nodes, prompts, and state make the workflow harder to debug. |
| Ranking and clustering make large idea sets easier to inspect. | Scores may overstate confidence when based on subjective model judgment. |
| Iterative evolution can refine weak ideas into stronger candidates. | Extra model calls increase latency, cost, and nondeterminism. |
| Human-in-the-loop review keeps discovery aligned with expert judgment. | Human checkpoints slow automation and require clear handoff artifacts. |
| Safety screening reduces misuse in sensitive domains. | Overly broad safety rules can block legitimate research exploration. |

### Minimal Example

```text
Input:
  research_goal: "Find plausible reasons that onboarding users abandon a B2B SaaS setup flow."
  context:
    - activation analytics summary
    - support-ticket themes
    - known product constraints

Flow:
  safety_screen_goal -> pass
  explore_context -> summarize evidence and gaps
  generate_hypotheses -> produce 8 candidate causes
  review_hypotheses -> score novelty, plausibility, evidence, feasibility
  rank_and_cluster -> keep diverse high-scoring candidates
  evolve_hypotheses -> refine the top 3 and add validation tests
  finalize_discovery_brief -> return ranked hypotheses and next experiments

Output:
  discovery_brief:
    - selected hypotheses
    - evidence and assumptions
    - proposed validation steps
    - risks and open questions
```

### LangGraph Mapping

| Pattern Concept | LangGraph Element |
| --- | --- |
| Open-ended discovery goal | State fields `input`, `research_goal`, `domain`, and `constraints` |
| Safety and ethical boundary | Node `safety_screen_goal`, state fields `safety_policy`, `safety_findings`, and conditional edge to blocked finalization |
| Context exploration | Node `explore_context` and state fields `seed_context`, `evidence_items`, and `context_summary` |
| Unknown unknowns and gaps | Node `identify_knowledge_gaps` and state field `knowledge_gaps` |
| Hypothesis generation | Node `generate_hypotheses` and state field `candidate_hypotheses` |
| Peer-style critique | Node `review_hypotheses` and state field `review_results` |
| Ranking or tournament selection | Node `rank_hypotheses` and state field `ranked_hypotheses` |
| Proximity or diversity clustering | Node `cluster_hypotheses` and state field `hypothesis_clusters` |
| Evolution and refinement | Node `evolve_hypotheses` and state fields `evolved_hypotheses` and `iteration_count` |
| Human researcher guidance | Conditional node `request_human_review` and state field `human_feedback` |
| Discovery output | Node `finalize_discovery_brief` and state field `discovery_brief` |

## LangGraph Implementation Goal

Build a LangGraph example of a bounded exploration and discovery assistant. The user supplies an open-ended research or product-discovery goal, optional local evidence, constraints, quality thresholds, and safety policy. The graph produces a ranked discovery brief rather than a final factual answer.

The first implementation should be local and testable. It should not call external search, scientific databases, Agent Laboratory, AgentRxiv, Google Co-Scientist, or any lab-execution service. Retrieval-like inputs should be passed in as `seed_context` or `evidence_items`, and model behavior should be injectable so tests can use deterministic fake responses.

Expected workflow outcome:

- The graph validates that the research goal is present and bounded.
- Unsafe or unsupported requests are blocked before hypothesis generation.
- The graph extracts useful themes and gaps from supplied context.
- Multiple hypotheses are generated, reviewed, ranked, clustered, and refined.
- Low-quality candidates are either discarded or routed through one refinement loop.
- Human review is requested for high-risk, low-confidence, or policy-sensitive candidates.
- The final `discovery_brief` clearly separates hypotheses, evidence, assumptions, limitations, risks, and proposed validation steps.

## State Shape

List the state fields the graph needs.

| Field | Type | Purpose |
| --- | --- | --- |
| `input` | `str` | Original user request or short description of the discovery task. |
| `research_goal` | `str` | Open-ended goal the graph should explore. |
| `domain` | `str` | Domain label such as `product`, `science`, `education`, `security`, or `creative`. |
| `constraints` | `dict[str, Any]` | Scope limits, excluded approaches, available resources, timeline, and output requirements. |
| `safety_policy` | `dict[str, Any]` | Rules for disallowed goals, high-risk domains, human-review triggers, and blocked content. |
| `seed_context` | `list[str]` | User-provided notes, observations, documents, summaries, or evidence snippets. |
| `evidence_items` | `list[dict[str, Any]]` | Normalized evidence records with source, claim, relevance, and confidence metadata. |
| `context_summary` | `str` | Concise synthesis of the supplied context. |
| `knowledge_gaps` | `list[str]` | Missing information, uncertain assumptions, and unexplored angles discovered from context. |
| `exploration_questions` | `list[str]` | Questions the graph will use to diversify candidate generation. |
| `candidate_hypotheses` | `list[dict[str, Any]]` | Generated hypotheses with title, rationale, evidence references, assumptions, and risk notes. |
| `review_results` | `list[dict[str, Any]]` | Per-hypothesis scores and critiques for novelty, plausibility, evidence, feasibility, clarity, impact, and safety. |
| `ranked_hypotheses` | `list[dict[str, Any]]` | Candidates ordered by aggregate score, with rank rationale and rejection reasons. |
| `hypothesis_clusters` | `list[dict[str, Any]]` | Groups of similar hypotheses used to preserve diversity in the final selection. |
| `evolved_hypotheses` | `list[dict[str, Any]]` | Refined or combined hypotheses produced after review and ranking. |
| `selected_hypotheses` | `list[dict[str, Any]]` | Final hypotheses chosen for the discovery brief. |
| `validation_plan` | `list[dict[str, Any]]` | Proposed next experiments, analyses, or observations to test selected hypotheses. |
| `human_feedback` | `dict[str, Any] \| None` | Optional expert approval, rejection, edits, or constraints added after review. |
| `safety_findings` | `list[dict[str, Any]]` | Safety, ethics, misuse, or policy findings raised during goal screening or hypothesis review. |
| `iteration_count` | `int` | Number of generate-review-evolve loops completed. |
| `max_iterations` | `int` | Hard cap on refinement loops. |
| `quality_thresholds` | `dict[str, float]` | Minimum scores for novelty, plausibility, evidence, feasibility, and safety. |
| `needs_human_review` | `bool` | Whether the graph should pause or mark the result for human review. |
| `discovery_status` | `str` | Overall state such as `ready`, `blocked`, `needs_review`, `completed`, or `failed`. |
| `errors` | `list[str]` | Validation, parsing, safety, scoring, or missing-evidence errors. |
| `discovery_brief` | `dict[str, Any] \| None` | Final structured output returned by the graph. |

## Nodes

| Node | Responsibility |
| --- | --- |
| `prepare_discovery_task` | Validate required fields, normalize constraints, set defaults for thresholds and iteration limits, and initialize state lists. |
| `safety_screen_goal` | Check the research goal and domain against `safety_policy`; block or require human review for unsafe or sensitive requests. |
| `explore_context` | Normalize supplied context into `evidence_items` and produce a concise `context_summary`. |
| `identify_knowledge_gaps` | Extract missing information, uncertain assumptions, weak evidence areas, and exploratory questions. |
| `generate_hypotheses` | Produce diverse candidate hypotheses grounded in the goal, context summary, evidence, gaps, and constraints. |
| `review_hypotheses` | Critique and score each hypothesis for novelty, plausibility, evidence support, feasibility, impact, clarity, and safety. |
| `rank_hypotheses` | Aggregate review scores, apply thresholds, identify rejected candidates, and order the remaining hypotheses. |
| `cluster_hypotheses` | Group similar candidates and choose diverse representatives so the final set does not collapse to one theme. |
| `decide_refinement` | Decide whether the candidates are good enough, need one more evolution pass, require human review, or should fail. |
| `evolve_hypotheses` | Refine top candidates by combining, simplifying, challenging, or reframing them in response to review critiques. |
| `plan_validation_steps` | Convert selected hypotheses into concrete next experiments, analyses, observations, or user-research checks. |
| `request_human_review` | Record that expert review is required and incorporate provided `human_feedback` when available. |
| `finalize_discovery_brief` | Produce the final `discovery_brief` with selected hypotheses, evidence, scores, limitations, safety notes, and validation plan. |

## Edges

Describe the graph flow, including conditional branches.

```text
START
  -> prepare_discovery_task
  -> safety_screen_goal

safety_screen_goal -> explore_context
safety_screen_goal -> finalize_discovery_brief

explore_context
  -> identify_knowledge_gaps
  -> generate_hypotheses
  -> review_hypotheses
  -> rank_hypotheses
  -> cluster_hypotheses
  -> decide_refinement

decide_refinement -> evolve_hypotheses -> review_hypotheses
decide_refinement -> plan_validation_steps -> finalize_discovery_brief
decide_refinement -> request_human_review -> finalize_discovery_brief
decide_refinement -> finalize_discovery_brief

finalize_discovery_brief -> END
```

Conditional edge requirements:

- Route from `safety_screen_goal` directly to `finalize_discovery_brief` with `discovery_status: "blocked"` when the goal is unsafe, disallowed, or outside configured policy.
- Route from `safety_screen_goal` to `explore_context` when the goal is allowed or only requires a non-blocking safety note.
- Route from `decide_refinement` to `evolve_hypotheses` when too few candidates meet thresholds and `iteration_count < max_iterations`.
- Route from `decide_refinement` to `plan_validation_steps` when enough diverse candidates meet quality and safety thresholds.
- Route from `decide_refinement` to `request_human_review` when the domain is high impact, reviewer scores disagree sharply, confidence is low, or ethical concerns are present.
- Route from `decide_refinement` directly to `finalize_discovery_brief` with `discovery_status: "failed"` when no usable candidates remain or the graph reaches `max_iterations`.
- The graph must keep tests deterministic by using fake model outputs or injectable model clients.

## Inputs and Outputs

- Input: a research goal, domain, constraints, safety policy, optional seed context or evidence items, quality thresholds, max iteration count, and optional human feedback.
- Output: `discovery_brief`, including status, selected hypotheses, ranking and review summaries, supporting evidence, assumptions, rejected candidates, limitations, safety notes, validation plan, and human-review requirement.
- Intermediate artifacts: context summary, knowledge gaps, exploration questions, candidate hypotheses, review results, ranking table, clusters, evolved hypotheses, safety findings, errors, and status.

Example discovery output shape:

```json
{
  "status": "completed",
  "summary": "Three plausible onboarding-abandonment hypotheses were selected for validation.",
  "selected_hypotheses": [
    {
      "title": "Users abandon when setup requires unavailable admin permissions",
      "novelty": 0.66,
      "plausibility": 0.91,
      "evidence_refs": ["support-theme-admin-permissions", "analytics-step-3-dropoff"],
      "assumptions": ["Support tickets represent a meaningful subset of abandoned users."],
      "risks": ["May undercount users who never contact support."]
    }
  ],
  "validation_plan": [
    {
      "hypothesis": "Users abandon when setup requires unavailable admin permissions",
      "next_step": "Segment activation drop-off by user role and permission state.",
      "success_signal": "A materially higher drop-off rate for non-admin users at the permissions step."
    }
  ],
  "safety_notes": [],
  "needs_human_review": false
}
```

Example input shape:

```json
{
  "input": "Find promising product ideas for reducing support ticket volume in a B2B SaaS app.",
  "domain": "customer support automation",
  "constraints": ["low implementation cost", "no external data sharing"],
  "seed_context": "Most tickets are password resets, billing confusion, and onboarding questions."
}
```

## Failure Cases

Document expected failures, retries, fallback behavior, and human-review points.

- Missing `research_goal` should produce `discovery_status: "failed"` with a validation error and no model calls.
- Unsafe or disallowed goals should produce `discovery_status: "blocked"` before hypothesis generation.
- High-impact domains such as biomedical, security, finance, legal, or physical-world experimentation should trigger `needs_human_review` unless policy explicitly allows autonomous drafting.
- Empty or weak `seed_context` should not silently imply certainty; the graph should mark evidence as sparse and label hypotheses as speculative.
- Malformed model output should be retried once if the implementation supports retries, then recorded in `errors` and routed to `needs_review` or `failed`.
- Duplicate or near-duplicate hypotheses should be clustered or rejected so the final brief remains diverse.
- Reviewer disagreement should not be hidden by aggregate scores; large disagreement should trigger human review.
- If all candidates fail quality thresholds, the graph should attempt refinement until `max_iterations` and then return a failed or needs-review brief.
- If a hypothesis has ethical, safety, or misuse concerns, it should be excluded, blocked, or marked for human review according to `safety_policy`.
- The graph should not present exploratory hypotheses as verified facts or execute real-world experiments.

## Test Ideas

- Verify the happy path with a fake model: context is summarized, hypotheses are generated, reviewed, ranked, clustered, evolved if needed, and a completed discovery brief is returned.
- Verify that an unsafe goal is blocked before `generate_hypotheses`.
- Verify that missing `research_goal` returns a failed status and does not call downstream nodes.
- Verify that sparse evidence produces speculative limitations in the final brief.
- Verify that duplicate hypotheses are clustered and the selected set remains diverse.
- Verify that low-scoring candidates route through `evolve_hypotheses` while `iteration_count < max_iterations`.
- Verify that the graph stops refinement and returns `failed` or `needs_review` at `max_iterations`.
- Verify that reviewer-score disagreement sets `needs_human_review`.
- Verify that malformed hypothesis or review JSON is captured in `errors`.
- Verify that the final state contains `discovery_brief`, `selected_hypotheses`, `validation_plan`, `review_results`, and `safety_findings`.

## Open Questions

- Page/index ambiguity: `docs/agentic-design-patterns-toc.md` lists Chapter 21 as logical pages `317-329`, but the extracted heading appears at PDF label/file page `335` and Appendix A starts at label/file page `349`. The chapter-local counters run `1-14`, so the extracted chapter is 14 file pages, not 13 logical pages.
- Figure ambiguity: the PDF text extraction exposes the captions for the AI Co-Scientist architecture and the Exploration and Discovery visual summary, but not the diagrams' internal structure. The requirement therefore uses surrounding prose rather than diagram-only details.
- Code extraction ambiguity: the Agent Laboratory code examples are flattened by PDF text extraction. The implementation requirements are based on the described roles and review schema, not exact source code reproduction.
- Scope question for implementation: the chapter includes security vulnerability discovery as an application, but the first LangGraph example should use a lower-risk hypothesis-discovery scenario unless the user explicitly requests a security-focused version with stronger guardrails.
