# Architecture of this repository

This is a short overview of the general architecture and structure of the repository, to help you orient yourself.

This site is built using [Astro](https://astro.build) and [Starlight](https://starlight.astro.build) with the shared [`@nebari/starlight`](https://github.com/nebari-dev/starlight) theme. For more details on setting your local development environment and building the site, visit the [docs README](docs/README.md) and the [Contributing to Nebari's documentation section in our community guidelines](https://www.nebari.dev/community/doc-contributions/).

The structure of this repository is as follows:

```bash
.
├── .github
├── docs
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── content/docs
│   │   ├── styles
│   │   ├── content.config.ts
│   │   └── routeData.ts
│   ├── test
│   ├── astro.config.mjs
│   ├── bun.lock
│   ├── package.json
│   ├── README.md
│   ├── tsconfig.json
│   └── wrangler.jsonc
├── .editorconfig
├── .gitignore
├── .gitpod.yml
├── .pre-commit-config.yaml
├── ARCHITECTURE.md
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

## `.github` - GitHub-related files

This directory contains the following

- `ISSUE_TEMPLATE`: the various issue templates for the repository
- `PULL_REQUEST_TEMPLATE`: this project's pull request template
- `workflows/`: GitHub actions workflows for this repository. `docs.yml` builds, tests and deploys the site to Cloudflare.

> **Note**
> The issue and pull request templates are located in the [nebari-dev/.github](https://github.com/nebari-dev/.github) repository and are synced across repositories through a GitHub action.

# `docs/`

This is the top-level directory for the documentation site. It contains the following files and directories.

## `src/content/docs`

All the pages of the site. The path of a file is its URL, so the directory names match the site's sections:

- `docs/`: the current Nebari documentation, organized following the Diátaxis framework (`get-started`, `how-tos`, `explanations`, `references`) plus `software-packs`.
- `classic/`: the Nebari Classic documentation (`get-started`, `tutorials`, `how-tos`, `explanations`, `references`, plus `troubleshooting`, `faq`, and `glossary`).
- `community/`: our community-related content covering items like contribution guidelines and style guides.
- `blog/`: blog posts, rendered by the `starlight-blog` plugin.
- `index.mdx` and `404.md`: the landing page and the not-found page.

## `src/components`

Astro components used from content pages (`PlannedProvider`, `MarkdownTable`, `SubpageCards`) and the Starlight component overrides (`Head` adds analytics and the cookie banner, `MarkdownContent` adds the Nebari Classic phase-out notice).

## `src/routeData.ts`

A Starlight route middleware. The sidebar in `astro.config.mjs` is defined as three top-level groups (Nebari, Nebari Classic, Community) and this middleware shows only the group matching the current section, so each section keeps its own navigation like the previous multi-instance setup.

## `src/styles`

`custom.css` holds the landing-page styles. Everything else (colors, fonts, header, footer) comes from the `@nebari/starlight` theme.

## `public`

All the static files for the site, served from the root URL: the Nebari logos and favicon (`logo/`), the images for the documentation content (`img/`, organized like the content), the AWS IAM policy files (`policies/`), and `_redirects`, the Cloudflare redirect rules that keep legacy Docusaurus URLs working.

## Other files in `/docs`

- `astro.config.mjs`: Astro and Starlight configuration, including the header tabs, the three sidebars, the blog and the links validator
- `package.json` and `bun.lock`: dependencies and scripts (`bun run dev`, `bun run build`, `bun test`)
- `test/build.test.ts`: build smoke tests, run in CI
- `tsconfig.json`: TypeScript configuration for Astro
- `wrangler.jsonc`: Cloudflare Worker configuration for deployment
- `README.md`: detailed step-by-step instructions for using the documentation site and building it locally

## Files in `./` - the root directory of this repository

- `.gitignore`: `.git` configuration file with files and patterns not to be committed to version control
- `.gitpod.yml`: gitpod configuration file
- `.pre-commit-config.yaml`: configuration for the multiple non-JavaScript pre-commits used
- `.editorconfig`: configuration file to help everyone achieve style consistency
- `CONTRIBUTING.md`: this project's contribution guidelines
- `LICENSE`: BSD-3 OSI license file
- `README.md`: top-level information page for this project's repository
