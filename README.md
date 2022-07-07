# Nebari

| Information | Links                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :---------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Project     | [![License](https://img.shields.io/badge/License-BSD%203--Clause-gray.svg?colorA=2D2A56&colorB=5936D9&style=flat.svg)](https://opensource.org/licenses/BSD-3-Clause) [![Nebari documentation](https://img.shields.io/badge/%F0%9F%93%96%20Read-the%20docs-gray.svg?colorA=2D2A56&colorB=5936D9&style=flat.svg)](https://nebari.dev) [![PyPI version](https://badge.fury.io/py/qhub.svg)](https://badge.fury.io/py/qhub) |
| Community   | [![GH discussions](https://img.shields.io/badge/%F0%9F%92%AC%20-Participate%20in%20discussions-gray.svg?colorA=2D2A56&colorB=5936D9&style=flat.svg)](https://github.com/nebari-dev/nebari/discussions) [![Open an issue](https://img.shields.io/badge/%F0%9F%93%9D%20Open-an%20issue-gray.svg?colorA=2D2A56&colorB=5936D9&style=flat.svg)](https://github.com/nebari-dev/nebari/issues/new/choose)                      |
| CI          | [![Kubernetes Tests](https://github.com/Quansight/qhub/actions/workflows/kubernetes_test.yaml/badge.svg)](https://github.com/Quansight/qhub/actions/workflows/kubernetes_test.yaml) [![Tests](https://github.com/Quansight/qhub/actions/workflows/test.yaml/badge.svg)](https://github.com/Quansight/qhub/actions/workflows/test.yaml)                                                                                  |

---

Nebari is a customizable Data Science and MLOps platform designed as a managed integration of open source technologies.
It uses an infrastructure-as-code approach to quickly and easily deploy a shared data science environment, on premises
or in the cloud of choice. Nebari is an opinionated open source JupyterHub distribution with a variety of common
integrations to help you and your team get set up with all your favorite tools... and a few you didn't know you
needed!

To get started with Nebari right away, check the [Nebari documentation](https://www.nebari.dev)!

---

## Table of contents

- [Nebari](#nebari)
  - [Table of contents](#table-of-contents)
  - [:zap: Nebari 101](#zap-nebari-101)
  - [Nebari on-prem](#nebari-on-prem)
  - [:computer: Installation](#computer-installation)
  - [:question: Questions?](#question-questions)
  - [:book: Code of Conduct](#book-code-of-conduct)
  - [:gear: Installing the Development version of Nebari](#gear-installing-the-development-version-of-nebari)
  - [:raised_hands: Contributions](#raised_hands-contributions)
  - [License](#license)

## :zap: Nebari 101

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

## Nebari on-prem

We also have a version of Nebari based on OpenHPC. It can be used to deploy onto HPC systems or on bare-metal.

> **Note**
> This tool is currently under development. Curious? Check out the [Nebari HPC](https://github.com/Quansight/qhub-hpc) repository.

## :computer: Installation

Nebari is supported by macOS and Linux operating systems (Windows is **NOT** currently supported). It is compatible
with Python 3.7+. We also suggest you use virtual environments such as
([`conda`](https://docs.conda.io/en/latest/), [`pipenv`](https://github.com/pypa/pipenv) or
[`venv`](https://docs.python.org/3/library/venv.html))

Depending on where you are planning to deploy, Nebari can be installed and
deployed in roughly 30 minutes!

Check the [Nebari installation guide]() for detailed step-by-step instructions on deploying Nebari.

## :question: Questions?

Have a look at our [Frequently Asked Questions (FAQ)](docs/source/user_guide/faq.md) to see if your query has been answered.

Getting help:

- [GitHub Discussions](https://github.com/nebari-dev/nebari/discussions) is our user forum. It can be used to raise
  discussions about a subject, such as: "What is the recommended way to do _X_ with Nebari?"

- [Issues](https://github.com/nebari-dev/nebari/issues/new/choose) for queries, bug reporting, feature requests,
  documentation, etc.

> We work around the clock to make Nebari better, but sometimes your query might take a while to get a reply. We
> apologise in advance and ask you to please, be patient :pray:.

## :book: Code of Conduct

To guarantee a welcoming and friendly community, we require contributors to follow our
[Code of Conduct](https://github.com/Quansight/.github/blob/master/CODE_OF_CONDUCT.md).

## :gear: Installing the Development version of Nebari

To install the latest developer version (unstable) use:

```bash
pip install git+https://github.com/nebari-dev/nebari.git
```

To build the docs locally, follow the guide in the [docs readme](docs/README).

## :raised_hands: Contributions

Thinking about contributing? Check out our
[Contribution Guidelines](https://github.com/nebari-dev/nebari/blob/main/CONTRIBUTING.md).

## License

[Nebari is BSD3 licensed](LICENSE).
