# Contributing to the documentation 📝

Nebari's documentation is built with [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

- [Contributing to the documentation 📝](#contributing-to-the-documentation-)
  - [Setting your local development environment](#setting-your-local-development-environment)
    - [Prerequisites](#prerequisites)
    - [Installing the dependencies](#installing-the-dependencies)
    - [Pre-commit hooks](#pre-commit-hooks)
    - [Working on the docs](#working-on-the-docs)
  - [Building the site](#building-the-site)
  - [Adding a New Dependency](#adding-a-new-dependency)
  - [Deployment](#deployment)
  - [Linting](#linting)

## Setting your local development environment

1. Make a fork of the [Nebari-docs repository][nebari-docs-repo] to your GitHub account
2. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/nebari-dev/nebari-docs.git
   ```

### Prerequisites

To build the site you will need to have Node.js installed. To see if you already have Node.js installed, type the following command into your local command line terminal:

```console
$ node -v
v14.17.0
```

If you see a version number, such as `v14.17.0` printed, you have Node.js installed. If you get a `command not found` error (or similar phrasing), please install Node.js before continuing.

To install node visit [nodejs.org](https://nodejs.org/en/download/) or check any of these handy tutorials for [Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04), [Debian](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-debian-10), or [macOS](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-and-create-a-local-development-environment-on-macos).

Once you have Node.js installed you can proceed to install Yarn. Yarn has a unique way of installing and running itself in your JavaScript projects. First you install the yarn command globally, then you use the global yarn command to install a specific local version of Yarn into your project directory.

The Yarn maintainers recommend installing Yarn globally by using the `NPM` package manager, which is included by default with all Node.js installations.
Use the `-g` flag with `npm` install to do this:

```bash
npm install -g yarn
```

After the package installs, have the yarn command print its own version number. This will let you verify it was installed properly:

```console
$ yarn --version
1.22.11
```

### Installing docs dependencies

1. First make sure to be in the `/docs` directory:

   ```bash
   cd docs
   ```

2. Install the necessary dependencies:

   ```bash
   yarn install
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

Once you have the pre-commits and the dependencies installed, you can get started with the documentation.
To see a live local version of the docs run the following command:

```bash
yarn start
```

This command starts a local development server and opens up a browser window.
Most changes are reflected live without having to restart the server.

> **Note**
> By default, this will load your site at <http://localhost:3000/>.

### Building the site locally

To build the static files of the documentation (and see how they would look once deployed to `www.nebari.dev`), run:

```bash
yarn build
```

This command generates static content into the `docs/build` directory and can be served using any static contents hosting service.
You can check the new build site with the following command:

```bash
yarn run serve
```

> **Note**
> By default, this will load your site at <http://localhost:3000/>.

## Adding a New Dependency

Use the `add` subcommand to add new dependencies:

```bash
yarn add package-name
```

## Deployment

The deployment is automatically handled by Netlify when content is merged into the `main` branch.

## Linting

Before opening a PR, run the docs linter and formatter to ensure code consistency. From the `docs` directory, run:

```bash
yarn run lint
yarn run format
```

<!-- links -->

[nebari-docs-repo]: https://github.com/nebari-dev/nebari-docs
