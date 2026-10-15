# AGENTS.md

Guidance for AI coding agents working in this repository. For humans, the same information lives in
[`docs/README.md`](docs/README.md) and [`ARCHITECTURE.md`](ARCHITECTURE.md).

## What this repo is

The source for two documentation sites, built from one Astro + Starlight project in `docs/` with the shared
[`@nebari/starlight`](https://github.com/nebari-dev/starlight) theme:

| Site               | What it documents                       | Source                                 | Build output         |
| :----------------- | :-------------------------------------- | :------------------------------------- | :------------------- |
| **www.nebari.dev** | **Nebari** (current, "new") + community | `docs/src/`, `docs/public/`            | `docs/dist/`         |
| classic.nebari.dev | **Nebari Classic** (maintenance mode)   | `docs/classic/`, `docs/classic/public` | `docs/dist-classic/` |

`DOCS_SITE=classic` switches `docs/astro.config.mjs` to the Classic source, public dir, output dir, sidebar and header.
Components and styles in `docs/src/` are shared by both builds.

## Nebari vs. Nebari Classic — read this first

There are two different products documented here. Do not mix them up.

- **Nebari** (the new one) is the current product: a composable ecosystem of **Software Packs** installed onto
  Kubernetes by **Deploy Targets** (Nebari Infrastructure Core / NKP). Its docs live in `docs/src/content/docs/docs/`
  and are served at `https://www.nebari.dev/docs/...`.
- **Nebari Classic** is the older, JupyterHub-centric `nebari` CLI distribution (`nebari init` / `nebari deploy`,
  `nebari-config.yaml`, Terraform stages, conda-store, Dask, Argo, etc.). It is in **maintenance mode**: security
  updates and key bug fixes only, expected through the end of 2026, and **no new features**. Its docs live in
  `docs/classic/content/docs/` and are served at `https://classic.nebari.dev/...`.

### Rules

1. **Default to new Nebari.** Unless the task explicitly says "Classic" (or the file being changed is already under
   `docs/classic/`), all new pages, edits, examples, links and recommendations go into the new docs under
   `docs/src/`. If a request is ambiguous about which product it means, assume new Nebari, and say so in your
   summary.
2. **Do not grow Classic.** Don't add new pages, sections, sidebar entries or features to `docs/classic/`. Changes
   there are limited to corrections: factual fixes, broken links, security-relevant notes, typos, and pointers to the
   new docs. If someone asks for new Classic content, flag that Classic is in maintenance mode before doing it.
3. **Don't port Classic content blindly.** Classic concepts (`nebari-config.yaml`, `nebari deploy`, Terraform stages,
   conda-store environments, Classic provider guides) do not apply to new Nebari. Never copy Classic instructions into
   the new docs without verifying they're true for the current product. When unsure whether a Classic feature exists
   in new Nebari, ask rather than guess.
4. **Link to the new docs.** When pointing readers somewhere, prefer `/docs/...` pages on www.nebari.dev. Link to
   Classic only when the reader specifically needs Classic information (e.g. "Looking for the Classic AWS guide?").
5. **Keep the boundary visible.** Classic pages get a maintenance-mode notice from
   `docs/src/components/MarkdownContent.astro`; main-site pages get a "Looking for Nebari Classic?" banner from
   `docs/src/components/Banner.astro`. Keep both intact, and keep the support timeline in the Classic notice accurate.
6. **Naming.** Call the current product just "Nebari". Always say "Nebari Classic" (capital C) for the old one — never
   "old Nebari", "Nebari v1", or "legacy Nebari". Don't reintroduce the `/classic/` path on www.nebari.dev; those URLs
   redirect to classic.nebari.dev via `docs/public/_redirects`.

## Layout

```
docs/
├── astro.config.mjs        # Starlight config for both sites: header nav, sidebars, link validator
├── src/
│   ├── content/docs/
│   │   ├── index.mdx       # Landing page (www.nebari.dev)
│   │   ├── docs/           # New Nebari docs -> /docs/* (Diátaxis: get-started, explanations, how-tos, references, software-packs)
│   │   └── community/      # Contributor/maintainer guidelines -> /community/*
│   ├── components/         # Content components + Starlight overrides (shared by both sites)
│   ├── routeData.ts        # Shows one sidebar per section on www.nebari.dev
│   └── styles/custom.css   # Landing-page styles
├── public/                 # www.nebari.dev assets (img/, logo/, policies/) + _redirects
├── classic/
│   ├── content/docs/       # Nebari Classic pages -> classic.nebari.dev/*
│   └── public/             # Classic assets (img/) + _redirects
├── test/build.test.ts      # Build smoke tests for both sites
├── wrangler.jsonc          # Cloudflare Worker: nebari-docs (www.nebari.dev)
└── wrangler.classic.jsonc  # Cloudflare Worker: nebari-docs-classic (classic.nebari.dev)
```

## Commands

Run everything from `docs/`. Tooling is [Bun](https://bun.sh); use `bun`, not `npm`/`yarn`, so `bun.lock` stays the
only lockfile.

```bash
bun install            # install dependencies
bun run dev            # dev server for www.nebari.dev (http://localhost:4321)
bun run dev:classic    # dev server for classic.nebari.dev
bun run build          # build www.nebari.dev into dist/ (also validates every internal link and #anchor)
bun run build:classic  # build classic.nebari.dev into dist-classic/
bun test               # build both sites and run the smoke tests (what CI runs)
```

Before calling a change done, run `bun test` (or at least `bun run build` for the site you touched). Broken internal
links fail the build. Pre-commit (`pre-commit run --all-files` from the repo root) runs codespell and some formatting
checks.

## Writing content

- Every page needs `title` (and ideally `description`) in frontmatter. Starlight renders the title, so don't repeat it
  as a `# Heading`.
- The file path is the URL. New pages must also be added to the right sidebar in `docs/astro.config.mjs`
  (`docsSidebar`, `communitySidebar`, or — for corrections only — `classicSidebar`) or they won't appear in navigation.
- Internal links are root-relative with a trailing slash: `/docs/how-tos/deploy/`.
- Links between the two sites must be absolute: `https://www.nebari.dev/docs/...` from Classic,
  `https://classic.nebari.dev/...` from the main site.
- Images: `docs/public/img/...` for the main site, `docs/classic/public/img/...` for Classic, referenced as `/img/...`.
- Callouts use Starlight syntax: `:::note`, `:::tip`, `:::caution`, `:::danger`, optionally `:::note[Title]`.
- Pages using components (`<Tabs>`, `<TabItem>`, `<Aside>`, `<LinkCard>`, `<CardGrid>`, ...) must be `.mdx` and import
  them from `@astrojs/starlight/components`. HTML comments are invalid in `.mdx`; use `{/* ... */}`.
- Mermaid diagrams work in fenced ` ```mermaid ` blocks.
- Smart punctuation is disabled; quotes and dashes render exactly as written.
- Follow the community [style guide](docs/src/content/docs/community/style-guide.md).

## Deployment

`.github/workflows/docs.yml` builds and tests both sites on every PR and push to `main`. Pushes to `main` deploy to the
`nebari-docs` and `nebari-docs-classic` Cloudflare Workers; same-repo PRs get preview URLs for both sites in a PR
comment. Don't deploy manually with `wrangler` unless asked.
