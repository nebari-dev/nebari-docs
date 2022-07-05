---
title: Installing Nebari
description: A guide to help you install Nebari for your team.
---

# Installing Nebari


This installation guide provides the basic instructions to install and deploy Nebari for the first time, and assumes you are is already familiar with the [Conda](https://docs.conda.io/projects/conda/en/latest/) and [Python packaging](https://packaging.python.org/en/latest/tutorials/installing-packages/#installing-packages) ecosystems. If you are already familiar with Nebari and would like information on advanced configuration options, feel free to skip to the [advanced-settings] section.

:::note
This guide focuses on installing Nebari for cloud usage. For other alternatives, please visit [deploying options](/getting-started/deploy.md) for an overview of the available options and their respective installation steps.
:::

## Pre-requisites

Nebari heavily depends on [Terraform](https://www.terraform.io/) and a Python ecosystem. The installation of the Terraform binary is built-in within the Nebari source code and it is automatically downloaded during the first execution. Currently, only `Linux` and `macOS` are supported. `Windows` is only supported through the “Windows Subsystem for Linux” (see "WSL").
- Currently, Nebari supports Python `3.8+`
- For more details on Terraform and its dependencies, visit the [official Terraform documentation](https://learn.hashicorp.com/tutorials/terraform/install-cli)
- To install conda, visit the [official conda documentation](https://docs.conda.io/projects/conda/en/latest/user-guide/install/index.html), or if you prefer, visit the [mamba installation documentation](https://github.com/mamba-org/mamba#installation)

## How to install Nebari

There are currently two ways to install Nebari:

1. You can install Nebari directly from the Python Package Index (PyPI) using `pip`. For most common architectures and platforms (`Linux x86-64` and `macOS x86-64`), `pip` will download and install the most recent version available.

```bash
python3 pip install nebari
```

2. Nebari is also available at [conda-forge](https://anaconda.org/conda-forge/qhub) and can be installed using the `conda` package manager by running the following command:

```bash
conda install nebari -c conda-forge
```
if you prefer [mamba](https://github.com/mamba-org/mamba#mamba), you can use the following command:

```bash
mamba install nebari
```

## Verify installation

You can verify that Nebari is properly installed and you are able to execute the client commands by running:

```bash
nebari --help
```

![A representation of the output generated when nebari help command argument is executed, the output contains a list of the available positional arguments and usage.](/img/validate_installation.png "Nebari's help command line output").

:::note Troubleshooting
If you are unable to successfully validate the Nebari installation above, you may want to check out our [troubleshooting guide](/troubleshooting.md).
:::
