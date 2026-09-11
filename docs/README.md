# Contributing to the documentation 📝

Nebari's documentation is built with [Astro](https://astro.build) and
[Starlight](https://starlight.astro.build), using the shared
[`@nebari/starlight`](https://github.com/nebari-dev/starlight) theme so every
Nebari documentation site looks the same.

- [Contributing to the documentation 📝](#contributing-to-the-documentation-)
  - [Setting your local development environment](#setting-your-local-development-environment)
    - [Prerequisites](#prerequisites)
    - [Installing docs dependencies](#installing-docs-dependencies)
    - [Pre-commit hooks](#pre-commit-hooks)
    - [Working on the docs](#working-on-the-docs)
    - [Building the site locally](#building-the-site-locally)
    - [Running the tests](#running-the-tests)
  - [Project layout](#project-layout)
  - [Writing content](#writing-content)
  - [Adding a new dependency](#adding-a-new-dependency)
  - [Deployment](#deployment)

## Setting your local development environment

1. Make a fork of the [`nebari-docs` repository][nebari-docs-repo] to your GitHub account
2. Clone the forked repository to your local machine:

   ```bash
   git clone https://github.com/<your-username>/nebari-docs.git
   ```

### Prerequisites

The site is built and tested with [Bun](https://bun.sh). Install it with:

```bash
curl -fsSL https://bun.sh/install | bash
```

and check it works:

```console
$ bun --version
1.3.14
```

Node.js 22 or newer also works for `npm run dev` / `npm run build`, but the
lockfile and the test runner (`bun test`) assume Bun.

### Installing docs dependencies

1. First make sure to be in the `/docs` directory:

   ```bash
   cd docs
   ```

2. Install the necessary dependencies:

   ```bash
   bun install
   ```

### Pre-commit hooks

This repository uses a number of [pre-commit hooks](https://pre-commit.com/) to standardize our YAML and markdown structure.
**Note** - You will need to have Python>= 3.7 installed in your local machine.

1. Before you can run the hooks, you need to install the pre-commit package manager:

   ```bash
   # using pip
   pip install pre-commit

   # if you prefer using conda
   conda install -c conda-forge pre-commit
   ```

2. From the root of this project, install the git hook scripts:

   ```bash
   # install the pre-commit hooks
   pre-commit install
   ```

3. Optional- run the hooks against the files in this repository

   ```bash
   # run the pre-commit hooks
   pre-commit run --all-files
   ```

Once installed, the pre-commit hooks will run automatically when you make a commit in version control.

### Working on the docs

To see a live local version of the docs run the following command from the `docs` directory:

```bash
bun run dev
```

This command starts a local development server with hot reload.

> **Note**
> By default, this will load your site at <http://localhost:4321/>.

### Building the site locally

To build the static files of the documentation (and see how they would look once deployed to `www.nebari.dev`), run:

```bash
bun run build
```

This command generates static content into the `docs/dist` directory. The build
also validates every internal link (including `#anchors`) with
[`starlight-links-validator`](https://github.com/HiDeoo/starlight-links-validator)
and fails on broken ones. You can check the built site with:

```bash
bun run preview
```

### Running the tests

The smoke tests in `test/build.test.ts` build the site and then verify that
every content page renders with its title, each section shows only its own
sidebar, every internal `href` and image on every page resolves, the search
index exists, and the legacy redirects in `public/_redirects` point at real
pages. Run them with:

```bash
bun test
```

## Project layout

```
docs/
├── astro.config.mjs        # Starlight config: theme plugin, header tabs, sidebars, blog
├── public/                 # Static assets served at the site root (/img, /logo, /policies)
│   └── _redirects          # Legacy URL redirects (Cloudflare format)
├── src/
│   ├── components/         # Astro components used by content and Starlight overrides
│   ├── content/docs/       # All pages; the path of a file is its URL
│   │   ├── index.mdx       # Landing page
│   │   ├── docs/           # Current Nebari documentation   -> /docs/*
│   │   ├── classic/        # Nebari Classic documentation   -> /classic/*
│   │   ├── community/      # Community guidelines           -> /community/*
│   │   └── blog/           # Blog posts (starlight-blog)    -> /blog/*
│   ├── routeData.ts        # Shows one sidebar per section
│   └── styles/custom.css   # Landing-page styles
├── test/build.test.ts      # Build smoke tests
└── wrangler.jsonc          # Cloudflare Worker (static assets) config
```

## Writing content

- Every page needs a `title` in its frontmatter; Starlight renders it as the page heading, so don't repeat it as a `# Heading`.
- Use root-relative links with a trailing slash, for example `/classic/how-tos/nebari-aws/`. Broken links fail the build.
- Callouts use Starlight's syntax: `:::note`, `:::tip`, `:::caution`, `:::danger`, optionally with a title as `:::note[Title]`.
- Files that use components (`<Tabs>`, `<TabItem>`, `<Aside>`, `<LinkCard>`, ...) must have the `.mdx` extension and import them from `@astrojs/starlight/components`. HTML comments are not valid in `.mdx`; use `{/* ... */}`.
- New pages must be added to the matching sidebar in `astro.config.mjs` to appear in navigation.
- Mermaid diagrams work in fenced ```` ```mermaid ```` blocks.

## Adding a new dependency

```bash
bun add package-name
```

## Deployment

The [Docs workflow](../.github/workflows/docs.yml) builds and tests the site on
every pull request and push to `main`. Pushes to `main` deploy `docs/dist` to
the `nebari-docs` Cloudflare Worker with
[`cloudflare/wrangler-action`](https://github.com/cloudflare/wrangler-action);
same-repository pull requests get a preview deployment whose URL is posted as a
PR comment. The workflow needs these repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

<!-- links -->

[nebari-docs-repo]: https://github.com/nebari-dev/nebari-docs
