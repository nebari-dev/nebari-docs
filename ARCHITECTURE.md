# Architecture of this repository

This is a short overview of the general architecture and structure of the repository, to help you orient yourself.

This site is built using Docusaurus. For more details on setting your local development environment and building the site, visit the [Documentation README](./docs/README.md)

The structure of this repository is as follows:

```
.
├── .github
├── docs
│   ├── docs
│   ├── src
│   ├── static
│   ├── .eslintignore
│   ├── .eslintrc.json
│   ├── .prettierignore
│   ├── .prettierc
│   ├── .babel.config.js
│   ├── docusaurus.config.js
│   ├── package.json
│   ├── README.md
│   ├── sidebar.js
│   └── yarn.lock
├── .editorconfig
├── .gitignore
├── .gitpod.yml
├── .pre-commit.yaml
├── ARCHITECTURE.md
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

## `.github` - GitHub-related files

This directory contains the following

- `ISSUE_TEMPLATE`: the various issue templates for the repository
- `PULL_REQUEST_TEMPLATE`: this project's pull request template
- `workflows/`: GitHub actions workflows for this repository

# `docs/`

This is the top-level directory for the documentation. It contains the following files and directories.

## `docs`

The main content for the Nebari documentation. Since we follow the Diátaxis documentation framework the content is organised to follow the Diátaxis structure:

- `tutorials`: Step-by-step tutorials that cover how to do a particular thing from beginning to end.
- `how-tos`: How-tos that are intended to be used in the context of a particular project.
- `references`: Reference sections of the documentation aimed to demonstrate the multiple capabilities of Nebari.
- `explanations`: Explanations of the different features of Nebari.
- `community`: our community-related content covering items like contribution guidelines and style guides

Plus additional sections such as `glossary, troubleshooting, welcome, etc.`

## src

This folder contains all the source files for the documentation theme:
The team uses `scss` to work on the stylesheets to benefit from the syntactic sugar this offers over `css`. The stylesheets are organized as follows:

```ascii
.
├── scss
│   ├── utils
│   │   └── _global_vars.scss
│   ├── application.scss
│   └── core.scss
└── theme
    └── components
        ├── admonitions.scss
        ├── footer.scss
        ├── markdown.scss
        ├── menu.scss
        ├── navbar.scss
        └── scrollbar.scss
```

Since we use the `Docusaurus scss plugin` there is no need to compile these files.

## `static`

This directory contains all the static files for the documentation theme. Such as the Nebari logos, the favicon, and the images for the main documentation content.

To keep things tidy the images are organized in the same way as the main documentation content:

- `tutorials`
- `how-tos`
- `references`
- `explanations`
- `community`
- `getting-started`: getting started sections of the documentation
- `welcome`: our main page

## Other miscellaneous files in `/docs`

- `.eslintignore`: patterns and files to be ignored by our linter
- `.eslintrc.json`: configuration file foe `eslint`
- `.prettierignore`: patterns and files to be ignored by our prettier formatter
- `.prettierc`: configuration file for the prettier formatter
- `.babel.config.js`: `babel` configuration file
- `docusaurus.config.js`: Docusaurus configuration file
- `package.json`: set of dependencies for the documentation site and complementary scripts
- `README.md`: detailed step-by-step instructions for using the documentation site and building it locally
- `sidebar.js`: JavaScript file that generates the sidebar for the documentation site
- `yarn.lock`: lock file for the dependencies
- `.editorconfig`: configuration file to help everyone achieve style consistency

## Files in `./` - the root directory of this repository

- `.gitignore`: `.git` configuration file with files and patters not to be committed to version control
- `.gitpod.yml`: gitpod configuration file
- `.pre-commit.yaml`: configuration for the multiple non-JavaScript pre-commits used
- `CONTRIBUTING.md`: this project's contribution guidelines
- `LICENSE`: BSD-3 OSI license file
- `README.md`: top-level information page for this project's repository
