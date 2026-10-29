---
name: nebari-docs-style
description: >
  Structure, terminology, linking, and style rules for writing Nebari docs pages: match the headings of similar pages, open with why the page matters, give each step a purpose and real output, use the glossary's terms, link sparingly, and keep pages lean. Read before creating or editing any page under docs/src/content/docs/, including when /create-documentation runs, or when the author asks to "write a page", "draft the docs", "add a section", "link to the glossary", or "check the terminology".
user-invocable: true
---

# Nebari docs style

Read this before writing or editing a page in `docs/src/content/docs/`. It keeps every page using the same words for the same things, and keeps links from turning pages into mazes.

## 1. Before you write

- **Read the glossary** at `docs/src/content/docs/docs/references/glossary.md`, every time, since its definitions change.
- **Copy section headings from a page of the same type**, such as another provider guide, and keep their order. Readers who know one page can find their way around the next.

## 2. Opening

Start with why the page matters, not with commands.

- **Quickstart:** say what readers will have at the end. For example: "This quickstart takes you from a single config file to a full platform running on your own machine."
- **Guide:** start with an `## Overview` section. Say what problem the guide solves, or what it sets up. If it builds on another guide, say what's different.

## 3. Steps

- **Put the purpose before each step.** This matters most for setup steps (a kubeconfig, a port-forward), where readers can't tell why they're needed. For example: "To check the cluster, you'll use `kubectl`. First, save its connection details…"
- **Add an output block after each command** whose result readers need to check, using real output from a test run. Trim long output with `...`, and say "You should see" or "You should see something like this".
- **Use tabs only for small variations inside a step**, such as macOS vs Linux. Use the same `syncKey` for the same choice across pages, so readers pick once. Keep separate pages when most of the content differs, such as providers.

## 4. Words

- **Match the glossary's terms and capitalization.** Capitalize product terms (NKP, Software Pack, Service). Keep ordinary words lowercase (cluster, platform, provider).
- **Don't reuse a glossary word for something else.** For example, "Service" in the glossary means an app users work in. When you mean the Kubernetes networking object, write "Kubernetes Service".
- **Flag missing or wrong terms** to the author instead of defining them on the page.

## 5. Links

- **First mention only.** Link a term on its first mention on the page, never on every mention.
- **Only product terms the page doesn't explain.** Briefly explain terms readers need to finish this page, rather than linking away. Quickstarts and tutorials get the fewest links.
- **Link to side topics instead of repeating them.** If readers don't need a detail to finish this page (provider setup, cost, config changes), link to the page that covers it.
- **Link to the term's anchor**, such as `/docs/references/glossary/#nkp`, and confirm it exists.
- **Prefer the page that does the job.** When pointing readers onward, link to the page that performs the action (for example "install a Software Pack" goes to `/docs/software-packs/deploy-a-pack/`), not only to an overview or catalog.
- **A quickstart links to its full guide.** Say which guide covers the same path in depth, and point there for other options.
- **Link to `main`, not a release tag**, and don't name a `nic` version, until the docs are versioned. Pinned links go stale between releases.

## 6. Leave out

- **When unsure a detail is needed, leave it out**, and add it later if readers need it.
- **Drop claims you can't verify.** A setting that merely worked once is not a minimum requirement.
