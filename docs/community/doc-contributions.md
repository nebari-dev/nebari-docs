---
id: doc-contributions
title: Contribute to Nebari's documentation
description: Guidelines for contributing to Nebari's documentation
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

A complete and accessible set of documentation is essential for an open source project's success.
Thank you for making Nebari's documentation better!

Nebari has the following (broad) types of documentation:

- **Narrative documentation** in the form of tutorials, how-to's, and more, hosted on `nebari.dev` (this website). Keep reading this page to learn how you can contribute!
- **Docstrings and READMEs** that are a part of the [nebari codebase][nebari-repo] and other GitHub repositories in the [nebari-dev][nebari-org], respectively. To contribute to these, check out [Contribute to Nebari's codebase](doc-contributions.md).
- **Demos and examples** for community self-study and conference presentations hosted at [nebari/nebari-demo][nebari-demo]. To contribute examples, start at the [Nebari Demo README](https://github.com/nebari-dev/nebari-demo#readme).

## Documentation style guide

We follow some style guidelines across the Nebari documentation resources to maintain consistency and keep our documentation accessible to everyone.
Take a few minutes to go through the key principles before contributing.
We encourage you to read the complete style guide when you get a chance.
Many suggestions in the style guide are good practices to follow in day-to-day written communication as well.

[Read the Nebari documentation style guide →](style-guide.md)

## Documentation tools

Nebari's documentation is built with [Docusaurus 2](https://docusaurus.io/), a modern static website generator.
With Docusaurs, you can author documentation using a friendly Markdown format, which are converted to consistent documentation page.
If you are not familiar with Markdown, check out the [Markdown Guide project](https://www.markdownguide.org/) for a comprehensive reference.

In addition to general Markdown, Docusaurs has some helpful special features like tabs and admonitions,
go through the [Markdown Features section of the Docusaurus documentation](https://docusaurus.io/docs/markdown-features) to learn about them!

We use Netlify for deploying the documentation. The deployment to `nebari.dev` is automatically handled by Netlify when your content is merged into the `nebari-docs/main` branch.
Netlify will also add a nifty preview link to any PR as a comment. This way you can make sure everything is working as expected.

## Documentation framework

Nebari uses the [Diátaxis framework for technical documentation](https://diataxis.fr/). The Diátaxis framework recognizes four types of documentation: Tutorials, how-to guides, explanations (called "conceptual guides" in Nebari), and references. As described in the following diagram, each of these types of documentation serve a different purpose, and therefore, are written differently:

![Tutorials: Learning oriented, include practical steps, and serve our study. How-to guides: Task oriented, include practical steps, and serve our work. Explanation: Understanding oriented, include theoretical knowledge, and serve our study. Reference: Information oriented, include theoretical knowledge, and serve our work.](/img/community/diataxis.png)

<!-- TODO: Expand this section and add templated for each document type ref: gh-173 -->

## Set up your local repository

1. Make a fork of the [`Nebari-docs` repository][nebari-docs-repo] to your GitHub account.
2. Clone the forked repository to your local machine:

   ```bash
   git clone https://github.com/<your-username>/nebari-docs.git
   ```

## Set up your local development environment

### Optional: Create an isolated environment

1. To create an environment with `conda`:

   ```bash
   conda create -n nebari-docs python=3.9
   ```

   :::note
   You need Python >= 3.7 to complete the setup and install the `pre-commit` package manager later.
   :::

2. Activate the environment:

   ```bash
   conda activate nebari-docs
   ```

### Prerequisites: Node.js

To build the site you will need to have Node.js installed.
To see if you already have Node.js installed, type the following command into your local command line terminal:

```bash
node -v
# v18.10.0
```

If you see a version number, such as `v18.10.0` printed, you have Node.js installed, you can move to the next section!

If you get a `command not found` error (or similar phrasing), install Node.js before continuing.

To install node visit [nodejs.org](https://nodejs.org/en/download/) or check any of these tutorials for [Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04), [Debian](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-debian-10), or [macOS](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-and-create-a-local-development-environment-on-macos).

If you created an environment with `conda`, you can install Node.js with:

```bash
conda install -c conda-forge nodejs
```

### Prerequisites: Yarn

Once you have Node.js installed you can proceed to install Yarn.
Yarn has a unique way of installing and running itself in your JavaScript projects.
First, you install the yarn command globally, then you use the global yarn command to install a specific local version of Yarn into your project directory.

The Yarn maintainers recommend installing Yarn globally by using the `NPM` package manager,
which is included by default with all Node.js installations.
Use the `-g` flag with `npm` install to do this:

```bash
npm install -g yarn
```

After the package installs, have the `yarn` command print its own version number to verify if it was installed properly:

```bash
yarn --version
# 1.22.11
```

### Install documentation dependencies

1. Move to the `/docs` directory:

   ```bash
   cd docs
   ```

2. Install the necessary dependencies:

   ```bash
   yarn install
   ```

### Pre-commit hooks

Similar to the Nebari codebase, the `nebari-docs` repository uses a number of [pre-commit hooks](https://pre-commit.com/) to standardize our YAML and Markdown structure.

1. Navigate to the root of this project. If you're in the `docs` subdirectory, you can run "`cd ..`" to go back to the root.

2. Follow the instructions in the [Pre-commit hooks section of Contribute to Nebari's codebase](code-contributions.mdx#pre-commit-hooks) to install the pre-commit hooks.

## Develop and submit your contribution

Once you have the dependencies and the pre-commit hooks installed, you can start writing and updating the documentation.

The workflow to develop your contribution is similar to contributing code. The difference is that you're writing or updating Markdown files. Go through the following sections to learn about creating branches, making pull requests, and how the contribution review process works:

- [Develop your contribution →][code-contributions-develop]
- [Submitting your contribution →][code-contributions-submit]
- [Review process →][code-contributions-review]

### Start a live version of the documentation

To see a live local version of the docs while editing, run the following command from the `docs` subdirectory:

```bash
yarn start
```

This command starts a local development server and opens up a browser window.
Most changes are reflected live without having to restart the server.

:::note
By default, this will load your site at \<http://localhost:3000/\>.

You can specify a different port with `yarn start --port <port-number>`.
:::

### (Optional) Build the site locally

You can build the static files of the documentation to see how they would look once deployed to `nebari.dev`:

```bash
yarn build
```

This command generates static content into the `docs/build` directory and can be served using any static contents hosting service.

You can check the newly built site with the following command:

```bash
yarn run serve
```

:::note
By default, this will also load your site at \<http://localhost:3000/\>.

You can specify a different port with `yarn start --port <port-number>`.
:::

### Linting and formatting

In addition to the `pre-commit` hooks, you can run the Docusaurus linter (ESLint) and formatter (Prettier) to ensure code consistency before submitting a PR.

1. Navigate to the `docs` directory.

2. Run the following commands:

   ```bash
   yarn run lint
   yarn run format
   ```

### Adding a new dependency

If you need to a new dependency to the project, use the `add` sub-command:

```bash
yarn add package-name
```

<!-- links -->

[nebari-docs-repo]: https://github.com/nebari-dev/nebari-docs
[nebari-repo]: https://github.com/nebari-dev/nebari
[nebari-org]: https://github.com/nebari-dev
[nebari-demo]: https://github.com/nebari-dev/nebari-demo

<!-- Internal links -->

[code-contributions-develop]: community/code-contributions.mdx#develop-your-contribution
[code-contributions-submit]: community/code-contributions.mdx#submitting-your-contribution
[code-contributions-review]: community/code-contributions.mdx#review-process
