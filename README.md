<div align="center">
 <img alt="Nebari logo on white background" src="./docs/static/img/docusaurus.png" width="300" />
</div>
<br>

| Information | Links |
| :---------- | :-----|
|   Project   | [![License](https://img.shields.io/badge/License-BSD%203--Clause-gray.svg?colorA=2D2A56&colorB=5936D9&style=flat.svg)](https://opensource.org/licenses/BSD-3-Clause) [![Nebari documentation](https://img.shields.io/badge/%F0%9F%93%96%20Read-the%20docs-gray.svg?colorA=2D2A56&colorB=5936D9&style=flat.svg)](https://nebari-docs.netlify.app/) [![PyPI version](https://badge.fury.io/py/qhub.svg)](https://badge.fury.io/py/qhub) |
|  Community  | [![GH discussions](https://img.shields.io/badge/%F0%9F%92%AC%20-Participate%20in%20discussions-gray.svg?colorA=2D2A56&colorB=5936D9&style=flat.svg)](https://github.com/nebari-dev/nebari/discussions) [![Open an issue](https://img.shields.io/badge/%F0%9F%93%9D%20Open-an%20issue-gray.svg?colorA=2D2A56&colorB=5936D9&style=flat.svg)](https://github.com/nebari-dev/nebari/issues/new/choose) |
|     CI      | [![Kubernetes Tests](https://github.com/Quansight/qhub/actions/workflows/kubernetes_test.yaml/badge.svg)](https://github.com/Quansight/qhub/actions/workflows/kubernetes_test.yaml) [![Tests](https://github.com/Quansight/qhub/actions/workflows/test.yaml/badge.svg)](https://github.com/Quansight/qhub/actions/workflows/test.yaml) |
| Website | [![Website Deploy](https://github.com/nebari-dev/nebari/actions/workflows/deploy.yml/badge.svg)](https://github.com/nebari-dev/nebari/actions/workflows/deploy.yml) 

---

Nebari is an customizable Data Science and MLOPs Platform designed as a managed integration of open source technologies. 
It uses an infrastructure-as-code approach to quickly and easily deploy a shared data science environment, on premises 
or in the cloud of choice. 

Nebari is an opinionated open source JupyterHub distribution with a variety of common integrations to help you and your 
team get set up with all your favorite tools ...  and a few you didn't know you needed! 

Check out our full [documentation](https://nebari-docs.netlify.app/)!

---

## Table of contents

- [Nebari 101](#nebari-101)
- [Nebari on-prem](#nebari-on-prem)
  <!-- - [:cloud: Cloud Providers](#cloud-cloud-providers) -->
- [:computer: Installation](#computer-installation)
- [:question: Questions?](#question-questions)
- [:book: Code of Conduct](#book-code-of-conduct)
- [:gear: Installing the Development version of Nebari](#gear-installing-the-development-version-of-nebari)
- [:raised_hands: Contributions](#raised_hands-contributions)
- [License](#license)

## Nebari 101

Nebari Cloud deployments use Kubernetes and are is built using 
[Terraform](https://www.terraform.io/), [Helm](https://helm.sh/), and
[GitHub Actions](https://docs.github.com/en/free-pro-team@latest/actions). Terraform manages the infrastructure on the 
cloud. Helm helps to define, install,
and manage [Kubernetes](https://kubernetes.io/ "Automated container deployment, scaling, and management"). GitHub 
Actions is used to automatically create commits (triggered by commits with changes to the 
configuration file, `nebari-config.yaml`) as well as to kick off the deployment action.

Nebari aims to abstract all these complexities for its users. Hence, it is not necessary to know any of the above 
mentioned technologies to have your project successfully deployed.

> TLDR: If you know GitHub and feel comfortable generating and using API keys, you should have all it takes to deploy and maintain your system without the need for a dedicated
> DevOps team. No need to learn Kubernetes, Terraform, or Helm.

## Nebari on-prem

We also have a version of Nebari based on OpenHPC. It can be used to deploy onto HPC systems or on bare-metal. 

> **Note** 
> This tool is currently under development. Curious? Check out the [Nebari HPC](https://github.com/Quansight/qhub-hpc) repository.

## :computer: Installation

Nebari is supported by macOS and Linux operating systems (Windows is **NOT** currently supported). It is compatible 
with Python 3.7+. We also suggest you use virtual environments such as 
([`conda`](https://docs.conda.io/en/latest/), [`pipenv`](https://github.com/pypa/pipenv) or
  [`venv`](https://docs.python.org/3/library/venv.html))

Depending on where you are planning to deploy Nebari, you may need to set up credentials (e.g. for cloud deployment). 
Once all the necessary credentials are generated, Nebari can be installed and 
deployed in roughly 30 minutes! 

See our [installation guide]() for a complete guide to intallation. 


## :question: Questions?

Have a look at our [FAQ](docs/source/user_guide/faq.md) to see if your query has been answered.

We separate the queries for Nebari into:

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

To build the docs locally, follow the guide in the [docs readme](docs/README)

## :raised_hands: Contributions

Thinking about contributing? Check out our 
[Contribution Guidelines](https://github.com/nebari-dev/nebari/blob/main/CONTRIBUTING.md).

## License

[Nebari is BSD3 licensed](LICENSE).
