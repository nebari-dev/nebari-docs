---
id: installing-nebari
---

# Installing Nebari

A guide to help you install Nebari for your project.

This installation guide provides the basic instructions to install and deploy Nebari for the first time, and assumes you are is already familiar with the [Conda](https://docs.conda.io/projects/conda/en/latest/) and [Python packaging](https://packaging.python.org/en/latest/tutorials/installing-packages/#installing-packages) ecosystems. If you are already familiar with Nebari and would like information on advanced configuration options, feel free to skip to the [advanced-settings] section.

:::note
This guide focuses on installing Nebari for cloud usage. For other alternatives, please visit [deploying options](/started/deploy.md) for an overview of the available options and their respective installation steps.
:::

## Requirements

Nebari heavily depends on [Terraform](https://www.terraform.io/) and a Python ecosystem. The installation of the Terraform binary is built in within the Nebari source code and it is automatically downloaded during the first execution. Currently, only `Linux` and `macOS` are supported. `Windows` is only supported through the “Windows Subsystem for Linux” (see "WSL").

## How to install Nebari

There are currently two ways to install Nebari:

First, you can install Nebari directly from the Python Package Index (PyPI) using `pip`. For most common architectures and platforms (`Linux x86-64` and `macOS x86-64`), `pip` will download and install the most recent version available.

```bash
    pip install nebari
```

Second, Nebari is also available at [conda-forge](https://anaconda.org/conda-forge/qhub) and can be installed using the `conda` package manager by running the following command:

```bash
    conda install nebari -c conda-forge
```

## Verify installation

You can verify that Nebari is properly installed and you are able to execute the client commands by running:

```bash
    nebari --help
```

![alt text for screen readers](/img/validate_installation.png "Text to show on mouseover").

:::note Troubleshooting
If you are unable to successfully validate the Nebari installation above, you may want to check out our [troubleshooting guide](/started/troubleshooting.md).
:::
