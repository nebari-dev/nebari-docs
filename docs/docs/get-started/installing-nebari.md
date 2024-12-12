---
title: Installing Nebari
description: A guide to help you install Nebari for your team.
---

# Installing Nebari

This installation guide provides the basic instructions to install the Nebari deployer package CLI for the first time, and assumes you are already familiar with the [Conda](https://docs.conda.io/projects/conda/en/latest/) and [Python packaging](https://packaging.python.org/en/latest/tutorials/installing-packages/#installing-packages) ecosystems. If you are already familiar with Nebari and would like information on advanced configuration options, skip to the [Advanced Configuration][advanced-configuration] section in this documentation.

:::note
This guide focuses on installing Nebari for **cloud usage**.

For other alternatives, visit the [Choosing a deployment platform][nebari-deploy] section for an overview of the available options and their respective installation steps.
:::

## Pre-requisites

Nebari heavily depends on [Terraform](https://www.terraform.io/) and Python. The installation of the Terraform binary is built-in within the Nebari source code, and it is automatically downloaded during the first execution. Currently, only `Linux` and `macOS` are supported. `Windows` is only supported through the “Windows Subsystem for Linux” ("WSL").

- Currently, Nebari supports `Python >= 3.8`
- For more details on Terraform and its dependencies, visit the [official Terraform documentation](https://learn.hashicorp.com/tutorials/terraform/install-cli)
- To install conda, visit the [official conda documentation](https://docs.conda.io/projects/conda/en/latest/user-guide/install/index.html), or if you prefer, visit the [mamba installation documentation](https://github.com/mamba-org/mamba#installation)

## How to install the Nebari Package

_See [Environment Management][environment-management] for best practices for using `conda` and `pip` to control your deployment environment._

There are currently two ways to install the Nebari CLI:

1. You can install Nebari directly from the Python Package Index (PyPI) using `pip`. For most common architectures and platforms (`Linux x86-64` and `macOS x86-64`), `pip` will download and install the most recent version available.

   ```bash
   python3 -m pip install nebari
   ```

2. Nebari is also available at [conda-forge](https://anaconda.org/conda-forge/nebari) and can be installed using the `conda` package manager by running the following command:

   ```bash
   conda install nebari -c conda-forge
   ```

   if you prefer [mamba](https://github.com/mamba-org/mamba#mamba), you can use the following command:

   ```bash
   mamba install nebari
   ```

:::note
The version of Nebari in your `nebari-config.yaml` must match your currently installed Nebari package version; otherwise, a warning will be raised when attempting to deploy. See [Upgrading Nebari][nebari-upgrade] for techniques for upgrading your Nebari CLI or safely updating your older config file to match your Nebari package version.
:::

:::note
The Nebari CLI will auto-detect and then deploy any [Nebari Extensions][nebari-extension-system] that are installed in your Python environment, and extensions once deployed cannot be uninstalled. For this reason, we recommend creating a [unique environment][environment-management] for each Nebari deployment, especially when managing multiple deployments with extensions.
:::

## Verify installation

You can verify that the Nebari package is properly installed and you can execute the client commands by running:

```bash
nebari --help
```

![A representation of the output generated when Nebari help command argument is executed, the output contains a list of the available commands and their use.](/img/get-started/nebari-help.png "Nebari's help command line output")

:::note Troubleshooting
If you are unable to successfully validate the Nebari installation above, you may want to check out our [troubleshooting guide][nebari-troubleshooting].
:::

---

## What's next?

### Nebari Init and Guided Init

Nebari Init creates and initializes your Nebari configuration. Guided init does the same but you can have a step-by-step experience while running it.

You can pass the `--help` flag to the `init` command to check all the arguments and options available for it.

```bash
nebari init --help
```

![A representation of the output generated when Nebari init help command is executed, the output contains a list of the available options and arguments and their use.](/img/get-started/nebari-init-help-2.png "Nebari's init help command line output")

:::tip
You can pass the `--guided-init` flag to the `init` command to interact with Guided Init Wizard.
:::

## Next steps?

Need more information before deploying Nebari? Check out the following sections in the documentation:

- To get more insights on the **multiple deployment methods for Nebari** - check out the [Choosing a deployment platform][nebari-deploy] guide
- To learn more about the currently **supported public cloud providers** - check out the [Supported cloud providers][supported-cloud-providers] guide

Already made your mind about deployment? Check our handy how-to-guides:

- [Deploying Nebari on AWS][nebari-aws]
- [Deploying Nebari on Azure][nebari-azure]
- [Deploying Nebari on GCP][nebari-gcp]
- [Deploying Nebari on a local cluster][nebari-local]- using [`kind`](https://kind.sigs.k8s.io/) no cloud required

<!-- Internal links -->

[advanced-configuration]: /explanations/advanced-configuration.md
[nebari-aws]: /how-tos/nebari-aws.md
[nebari-azure]: /how-tos/nebari-azure.md
[environment-management]: /how-tos/nebari-environment-management.md
[nebari-extension-system]: /how-tos/nebari-extension-system.md
[nebari-gcp]: /how-tos/nebari-gcp.md
[nebari-local]: /how-tos/nebari-local.md
[nebari-deploy]: /get-started/deploy.mdx
[nebari-troubleshooting]: /troubleshooting.mdx
[nebari-upgrade]: /how-tos/nebari-upgrade.md
[supported-cloud-providers]: /get-started/cloud-providers.mdx
