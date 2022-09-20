<p align="center">
  <a href="https://www.gatsbyjs.com">
    <img alt="Nebari horizontal logo mark - black text" src="https://raw.githubusercontent.com/nebari-dev/nebari-design/main/logo-mark/horizontal/Nebari-Logo-Horizontal-Lockup.svg#gh-light-mode-only" height="100" />

  <img alt="Nebari horizontal logo mark - white text" src="https://raw.githubusercontent.com/nebari-dev/nebari-design/main/logo-mark/horizontal/Nebari-Logo-Horizontal-Lockup-White-text.svg#gh-dark-mode-only" height="100" />
  </a>
</p>

| Information | Links                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :---------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Project     | [![License](https://img.shields.io/badge/License-BSD%203--Clause-gray.svg?colorA=2D2A56&colorB=5936D9&style=flat.svg)](https://opensource.org/licenses/BSD-3-Clause) [![Nebari documentation](https://img.shields.io/badge/%F0%9F%93%96%20Read-the%20docs-gray.svg?colorA=2D2A56&colorB=5936D9&style=flat.svg)](https://nebari.dev) [![PyPI version](https://badge.fury.io/py/qhub.svg)](https://badge.fury.io/py/qhub) |
| Community   | [![GH discussions](https://img.shields.io/badge/%F0%9F%92%AC%20-Participate%20in%20discussions-gray.svg?colorA=2D2A56&colorB=5936D9&style=flat.svg)](https://github.com/nebari-dev/nebari/discussions) [![Open an issue](https://img.shields.io/badge/%F0%9F%93%9D%20Open-an%20issue-gray.svg?colorA=2D2A56&colorB=5936D9&style=flat.svg)](https://github.com/nebari-dev/nebari/issues/new/choose)                      |
| CI          | [![Kubernetes Tests](https://github.com/Quansight/qhub/actions/workflows/kubernetes_test.yaml/badge.svg)](https://github.com/Quansight/qhub/actions/workflows/kubernetes_test.yaml) [![Tests](https://github.com/Quansight/qhub/actions/workflows/test.yaml/badge.svg)](https://github.com/Quansight/qhub/actions/workflows/test.yaml) [![Netlify Status](https://api.netlify.com/api/v1/badges/d839c192-691b-4fd8-8e6a-1ca875b36825/deploy-status)](https://app.netlify.com/sites/nebari-docs/deploys)                                                                                  |

---

Nebari is a customizable Data Science and MLOps platform designed as a managed integration of open source technologies.
It uses an infrastructure-as-code approach to quickly and smoothly deploy a shared data science environment, on premises
or in the cloud of choice. Nebari is an opinionated open source JupyterHub distribution with a variety of common
integrations to help you and your team get set up with all your favorite tools... and a few you didn't know you
needed!

To get started with Nebari right away, check the [Nebari documentation][nebari-docs]!

---

## Table of contents

- [Nebari 101 :zap:](#nebari-101-zap)
  - [Nebari on-prem](#nebari-on-prem)
- [Installation :computer:](#installation-computer)
- [Contributing to Nebari :woman_technologist:](#contributing-to-nebari-woman_technologist)
  - [Installing the Development version of Nebari :gear:](#installing-the-development-version-of-nebari-gear)
  - [Contributing to the documentation :pencil:](#contributing-to-the-documentation-pencil)
  - [Questions? :thinking:](#questions-thinking)
- [Code of Conduct :book:](#code-of-conduct-book)
- [License](#license)

## Nebari 101 :zap:

Nebari Cloud can be deployed on any Kubernetes cluster by leveraging these tools:

- [Terraform modules](https://www.terraform.io/): to automate the provisioning of your cloud infrastructure
- [Helm](https://helm.sh/): to define, manage, and install Kubernetes applications
- [GitHub Actions](https://docs.github.com/en/free-pro-team@latest/actions) or
  [GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/index.html): to automate the build and deployment of Nebari.

Nebari aims to abstract all these complexities for its users. Hence, it is not necessary to know any of the above
mentioned technologies to have your project successfully deployed.

> **TLD;R**
> If you know GitHub/GitLab and feel comfortable generating and using API keys, you should have all it takes to deploy
> and maintain your system without the need for a dedicated DevOps team. No need to learn Kubernetes, Terraform, or Helm.

### Nebari on-prem

We also have a version of Nebari based on OpenHPC. It can be used to deploy onto HPC systems or on bare-metal.

> **Note**
> This tool is currently under development. Curious? Check out the [Nebari HPC](https://github.com/Quansight/qhub-hpc) repository.

## Installation :computer:

Nebari is supported by macOS and Linux operating systems (Windows is **NOT** currently supported). It is compatible
with Python 3.7+. We also suggest you use virtual environments such as
([`conda`](https://docs.conda.io/en/latest/), [`pipenv`](https://github.com/pypa/pipenv) or
[`venv`](https://docs.python.org/3/library/venv.html))

Depending on where you are planning to deploy, Nebari can be installed and
deployed in roughly 30 minutes!

Check the [Nebari installation guide](https://www.nebari.dev/category/getting-started) for detailed step-by-step instructions on deploying Nebari.

## Contributing to Nebari :woman_technologist:

Thinking about contributing? Check out our
[Contribution Guidelines](https://github.com/nebari-dev/nebari/blob/main/CONTRIBUTING.md) to get started.

### Installing the Development version of Nebari :gear:

To install the latest developer version (unstable) use:

```bash
pip install git+https://github.com/nebari-dev/nebari.git
```

### Contributing to the documentation :pencil:

To build the docs locally, follow the guide in the [docs README](docs/README).

### Questions? :thinking:

Have a look at our [Frequently Asked Questions (FAQ)](docs/source/user_guide/faq.md) to see if your query has been answered.

Getting help:

- [GitHub Discussions][gh-discussions] is our user forum. It can be used to raise
  discussions about a subject, such as: "What is the recommended way to do _X_ with Nebari?"

- [Issues][gh-issues] for queries, bug reporting, feature requests,
  documentation, etc.

> We work around the clock to make Nebari better, but sometimes your query might take a while to get a reply. We
> apologize in advance and ask you to please, be patient :pray:.

## Code of Conduct :book:

To guarantee a welcoming and friendly community, we require contributors to follow our
[Code of Conduct](https://github.com/Quansight/.github/blob/master/CODE_OF_CONDUCT.md).

## License

Nebari is licensed under the [BSD-3 OSI license](LICENSE).

<!-- links -->
[nebari-docs]: https://www.nebari.dev
[gh-discussions]: https://github.com/nebari-dev/nebari/discussions
[gh-issues]: https://github.com/nebari-dev/nebari/issues/new/choose
