# Repository Guidelines

## Project Structure & Module Organization

This repository is a Docusaurus 2 documentation site. Main documentation lives in `docs/`, grouped by topic folders such as `g-fe`, `g-be`, `g-devops`, `g-mle`, `g-hard`, and `g-soft`; sidebar generation is configured in `sidebars.js`. Blog posts live in `blog/`, with author metadata in `blog/authors.yml`. React page and component code is under `src/pages/` and `src/components/`, global styling is in `src/css/custom.css`, and static assets such as images and `robots.txt` are in `static/`.

## Build, Test, and Development Commands

Use Yarn 1, as declared in `package.json`.

- `yarn`: install dependencies.
- `yarn start`: run the local Docusaurus dev server on port `3000`.
- `yarn start:studio`: run the dev server on port `3103`.
- `yarn build`: generate the production static site in `build/`; also catches many broken links and MDX issues.
- `yarn serve`: serve the built site locally.
- `yarn clear`: clear Docusaurus caches when generated state looks stale.
- `yarn deploy`: deploy to GitHub Pages according to the Docusaurus deploy flow.

## Coding Style & Naming Conventions

Use two-space indentation for JavaScript, JSON, Markdown front matter, and CSS. Prefer double quotes in JavaScript, matching existing config files. Keep Docusaurus content filenames lowercase and descriptive when possible, often with numeric prefixes for ordering, for example `docs/g-devops/1-docker/1-docker-basic/docker-1-concept.md`. Add `_category_.json` files when a new docs folder needs sidebar label or ordering metadata.

## Testing Guidelines

There is no dedicated test runner configured. Treat `yarn build` as the required validation step before submitting changes. For docs changes, verify pages render in `yarn start` when editing MDX, Mermaid diagrams, sidebar metadata, links, or assets. Check browser output for broken images, malformed headings, and unexpected sidebar placement.

## Commit & Pull Request Guidelines

Recent history uses short messages such as `update`, plus scoped messages like `docs: organize agentic pattern pages`, `refactor: directory`, and `update: langgraph`. Prefer concise imperative commits with an optional scope, for example `docs: add docker compose notes` or `refactor: rename mle section`.

Pull requests should include a short description, the affected docs or pages, validation performed (`yarn build`, local preview), and screenshots when UI, navigation, styling, or rendered diagrams change. Link related issues or source material when applicable.

## Security & Configuration Tips

Do not commit private analytics, deployment, or search credentials. Public Docusaurus client keys may appear in config, but verify new tokens are safe for browser exposure before adding them.
