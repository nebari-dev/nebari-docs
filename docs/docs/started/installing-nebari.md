---
id: installing-nebari
---

# Installing Nebari

A guide to help you install Nebari for your project.

This installation guide provides the basic needs to install and deploy Nebari for the first time and assumes the user is already familiar with the [Conda](https://docs.conda.io/projects/conda/en/latest/) and [Python packaging](https://packaging.python.org/en/latest/tutorials/installing-packages/#installing-packages) ecosystems. If you are already familiar to Nebari and would like to check the advance configuration, feel free to skip to "advanced-settings" section.

:::note
This guide focus on installing Nebari for `Cloud` usage. For other instructions, please visit [deploying options](/started/deploy.md) for an overview of the available options and its respective installation steps.
:::

## Requirements

Nebari heavily depends on [Terraform](https://www.terraform.io/) and a python ecosystem. The installation of the Terrraform binary is built in within Nebari source code and its is automatically downloaded during first execution. Currently, only `Linux` and `macOS` are supported, `Windows` only through the “Windows Subsystem for Linux” (see "WSL").

## How to install Nebari

There are two most accessible ways to install Nebari:

You can install Nebari directly from the Python Package Index (PyPi) using pip. For most common architectures and platforms (`Linux x86-64` and `macOS x86-64`), Pip will download and install the most recent version available.

```bash
    pip install nebari
```

Nebari is also available at [conda-forge](https://anaconda.org/conda-forge/qhub) and can be installed using the conda package manager by running the following command:

```bash
    conda install nebari -c conda-forge
```

## Verify installation

Verify that Nebari is installed and you are able to execute the client commands by running:

```bash
    nebari --help
```

![alt text for screen readers](/img/validate_installation.png "Text to show on mouseover").

:::note Troubleshooting
If you are unable to successfully validate the Nebari installation above, you may want to check out our [troubleshooting guide](/started/troubleshooting.md).
:::
