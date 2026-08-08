---
name: apb-wiki-create
description: |
  Guide for creating, updating, and refining compact Docusaurus wiki pages that
  turn newly learned material into well-structured Korean concept documentation.
  Phases: Create Wiki -> Update/Insert Wiki -> Refactor Wiki.
  Triggers: wiki, apb wiki create, reasoning wiki,
  create wiki, update wiki, insert wiki, update insert wiki,
  refactor wiki, concept wiki, docusaurus wiki, 위키, 개념 위키,
  도큐사우루스 위키, 개념 정리, 위키 작성, 위키 업데이트, 위키 삽입,
  위키 리팩터링.
  Do NOT use for: generic skill creation (use $apb-skill-create),
  generic documentation templates (use $apb-templates), runtime validation
  reports (use $apb-validation-report).
---

# Wiki Create

> Maintain compact Docusaurus wiki documentation by creating pages, updating
> existing concepts, or inserting new lessons that turn learned material into
> reusable conceptual knowledge.

## Usage

```
$apb-wiki-create create-wiki     Create or initialize a Docusaurus wiki page
$apb-wiki-create update-wiki     Update or insert a concept from new learning
$apb-wiki-create insert-wiki     Update or insert a concept from new learning
$apb-wiki-create refactor-wiki   Normalize category/task headings and prefix numbers
```

## Phase Flow

```
[Create Wiki] -> [Update/Insert Wiki] -> [Refactor Wiki]
```

## Phase Progress Visualization

```
[Create Wiki] -> [Update/Insert Wiki] -> [Refactor Wiki]

Status:
  [Phase] done     -> phase completed
  [Phase] active   -> currently working
  [Phase] pending  -> not yet started
```

---

## Common Wiki Rules

These rules apply to every phase.

1. Keep the document in Korean, while preserving product, SDK, API, command,
   file, or domain-specific names in their original language.
2. Treat the Docusaurus page as a concept wiki, not a scratch note. Convert
   newly learned material into stable definitions, mental models, comparison
   criteria, implementation patterns, validation flows, and pitfalls that will
   still be useful later.
3. Default to compression. Do not mirror the source material's outline, lecture
   order, or numbered list as headings. Extract the central reusable idea first,
   then place supporting definitions, examples, exceptions, tools, graphs, and
   model choices inside that idea's H3 body.
4. H3 is the smallest reusable wiki unit. Each H3 should cover one focused
   concept or judgment rule. Prefer one H3 for one learning note unless there
   are clearly independent rules that would be searched, updated, and reused
   separately.
5. Split into multiple H3 tasks only when the material contains independent
   reusable concepts with different decision criteria or workflows. Do not
   create separate H3 tasks just because the source has sections such as
   definition, examples, why it matters, business cases, graphs, or summary.
6. Avoid turning one H3 into a full lecture note. Long definitions, exhaustive
   examples, downstream analysis methods, charts, and model choices should
   appear only when they are necessary to understand or apply that H3's concept.
7. Prefer this H3 structure:

   ```markdown
   ### {category_number}.{task_number} {task}

   목적 : {why this concept matters or when it should be used}

   상세 로직

   1. 판단 기준 및 적용 조건
     - {when to use this concept, rule, pattern, or decision}
     - {important constraint, exception, or failure mode}

   2. 실행 절차 및 구현 규칙
     - {concrete implementation, operation, or documentation rule}
     - {important verification, sync, or maintenance constraint}
   ```

8. Prefer two numbered sections only: `판단 기준 및 적용 조건` and
   `실행 절차 및 구현 규칙`. Add a third section only when an actionable
   exception or pitfall cannot fit cleanly into those two sections.
9. Keep each numbered section short: usually 2-4 bullets. If a section needs
   more than 4 bullets, split the topic or remove supporting explanation.
10. Prefer concrete project facts over generic advice. Include API names, state
   fields, commands, file paths, domain terms, decision criteria, or failure
   symptoms when they prevent future mistakes.
11. Follow this repository's Docusaurus conventions: use Markdown/MDX that can
   pass `yarn build`, place pages under the appropriate `docs/` category, and
   add or preserve `_category_.json` metadata when a new folder needs sidebar
   labeling or ordering.
12. Do not use `### 상세 로직`; write `상세 로직` as plain body text under the
   H3 task.

---

## Phase:Create Wiki

Create or initialize a Docusaurus wiki page without replacing existing entries.

### Prerequisites

- The target project or domain has newly learned concepts, terminology,
  reasoning, implementation behavior, operation flow, or decision logic worth
  preserving as Docusaurus documentation.
- The intended wiki path is provided by the user or inferred from the
  project context. If the user does not provide a path, use the most relevant
  `docs/` category in this repository or ask only when no safe path can be
  inferred.
- Record the resolved path and reuse it consistently in every phase:

  ```
  {resolved_wiki_path}
  ```

### Steps

1. Inspect the target path before writing.
2. Apply `Common Wiki Rules` when creating any initial structure or topic.
3. If the file exists, preserve all current content and treat this phase as
   complete.
4. If the file is missing, create it with this title:

   ```markdown
   # {concept or domain title}
   ```

5. Do not add example-specific content during this phase unless the user
   provides a concrete wiki topic.
6. Use numbered H2 category headings and numbered H3 task headings when adding
   structure later:

   ```markdown
   ## 1. {category}

   ### 1.1 {wiki task}
   ```

### Output Path

```
{resolved_wiki_path}
```

---

## Phase:Update/Insert Wiki

Update an existing wiki entry or insert a new one when real work or study
reveals a clear reusable concept, reasoning model, decision criterion,
implementation practice, or operational constraint.

### Prerequisites

- The wiki file exists or `Create Wiki` has been completed.
- New learning is backed by source material, implementation, tests, debugging
  results, user feedback, operational evidence, or observed project behavior.
- The topic has a clear reusable concept, lesson, rule, or decision criterion,
  not just a general note.

### Steps

1. Read the full wiki and list existing H2 category headings and H3 task
   headings.
2. Apply `Common Wiki Rules` before deciding the final H3 scope. Start by
   asking: "What is the one reusable concept or judgment rule this learning
   should preserve?"
3. Decide whether the learning updates an existing H3 or needs a new H3:
   - If a matching H3 already exists, update only that H3 unless the user asks
     for a wider rewrite.
   - If no matching H3 exists, insert one compressed H3 in the most related
     category.
   - Add multiple H3 tasks only when each H3 has a distinct purpose, decision
     criterion, and future reuse path.
4. Choose or create a short Korean H2 category title that groups related
   concepts, reasoning models, decision criteria, implementation lessons, or
   operating practices.
5. Choose a short Korean H3 task title that describes one reusable concept,
   judgment rule, or implementation pattern.
6. For updates, preserve the existing H3 structure when it already follows the
   common rules. For inserts, use the common H3 structure.
7. For inserts, place the new H3 task after the most related task in the
   matching category. If there is no related category, append a new H2 category
   after the existing content.
8. Never promote source subtopics directly into headings. Put definitions,
   examples, business cases, distribution choices, statistical tests, ML model
   choices, graphs, and summaries under the single H3 unless they are truly
   independent reusable concepts.
9. H2 and H3 headings must include prefix numbers:

   ```markdown
   ## 1. {category}

   ### 1.1 {task}
   ```

10. Avoid duplicate statements already present in the same topic.
11. Keep the style consistent with the existing Korean wiki entry.
12. After update or insertion, renumber H2 and H3 prefix numbers so they are
    sequential and match their hierarchy.

### Output Path

```
{resolved_wiki_path}
```

---

## Phase:Refactor Wiki

Normalize an existing wiki so Docusaurus pages, category headings, and task
headings follow the standard hierarchy and prefix-number convention.

### Prerequisites

- The wiki file exists.
- The document has one or more concepts or implementation lessons that can be
  grouped under H2 categories and H3 wiki tasks.
- Refactoring must preserve the implementation facts unless the user asks for a
  content rewrite.
- Refactoring should compress over-expanded H2/H3 structures when several
  headings are only source-outline sections for the same reusable concept.
- Refactoring should split H3 entries only when one task mixes several
  independent judgment rules with different reuse paths.

### Steps

1. Read the full wiki before editing.
2. Apply `Common Wiki Rules` when deciding how to compress, split, keep, or
   rewrite H3 tasks.
3. List all H2 headings and decide whether each one is a category or an
   implementation task.
4. Convert broad grouping headings to numbered H2 category headings:

   ```markdown
   ## 1. {category}
   ```

5. Convert implementation-level wiki entries to numbered H3 task headings:

   ```markdown
   ### 1.1 {task}
   ```

6. Remove `### 상세 로직` headings and replace them with plain body text:

   ```markdown
   상세 로직
   ```

7. Ensure every H3 task follows the common H3 structure:

   ```markdown
   ### {category_number}.{task_number} {task}

   목적 : {why this concept or pattern exists}

   상세 로직

   1. 판단 기준 및 적용 조건
     - {concrete implementation rule}

   2. 실행 절차 및 구현 규칙
     - {concrete implementation rule}
   ```

8. Renumber all H2 and H3 prefixes after moving or converting headings:
   - H2 categories use `1.`, `2.`, `3.` in document order.
   - H3 tasks use `{h2_number}.1`, `{h2_number}.2`, `{h2_number}.3` within
     each category.
   - H3 prefixes must always match the parent H2 prefix.
9. Check that no implementation task remains as H2 and no `### 상세 로직`
   heading remains.
10. If several H3 tasks merely restate definition, examples, why it matters,
   business cases, graphs, or summary for the same concept, merge them into one
   H3 and keep those details as bullets.
11. Keep bullets concise, preserve concrete product, SDK, API, command, file,
   and domain names, and avoid duplicate statements introduced during
   refactoring.

### Output Path

```
{resolved_wiki_path}
```

---

## Heading Rules

- H1 is reserved for the page title only:

  ```markdown
  # {concept or domain title}
  ```

- H2 is reserved for numbered category-level headings. A category groups
  related reasoning rules, decision criteria, implementation lessons, or
  operating practices and must not contain a concrete task directly in the
  heading.

  ```markdown
  ## 1. {category}
  ```

- H3 is reserved for numbered wiki-task headings. A wiki task is the concrete
  reusable concept unit, such as a definition, mental model, decision rule,
  implementation pattern, validation flow, review checklist, operational
  response, or maintenance procedure.
- Each H3 should cover one focused reusable concept. If source material
  contains multiple sections for the same concept, compress them into the
  current H3 instead of turning each source section into a heading.
- Create separate H3 tasks only for concepts that have independent decision
  criteria, workflows, or future maintenance paths.
- Avoid turning a single H3 into a full lecture note. Long definitions,
  exhaustive examples, downstream analysis methods, charts, and model choices
  should appear only when they are necessary to understand or apply that H3's
  concept.

  ```markdown
  ### 1.1 {wiki task}
  ```

- H2 and H3 headings require prefix numbers. H2 prefixes use document order
  (`1.`, `2.`, `3.`), and H3 prefixes use the parent H2 number plus local task
  order (`1.1`, `1.2`, `2.1`).
- Do not use `### 상세 로직`. The phrase `상세 로직` is plain body text inside
  each H3 task.
