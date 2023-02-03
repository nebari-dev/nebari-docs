# Frequently asked questions

## Why is the `NEBARI_KUBECONFIG` file in `/tmp`?

Nebari regenerates this file on every run. This means it will be removed by the operating system during its cleanup process,
but running the `nebari deploy` command again as a Nebari administrator will update/create a `NEBARI_KUBECONFIG` file for you.

## How are Nebari conda user environments created? Who creates them?

The short answer: there are currently _two_ ways of creating environments, as we are in the process of migrating Nebari to conda-store,
and so which way depends on your use-case.

The longer answer:

- For global environments, you can specify the environment in `nebari_config.yml`, and it will be made available for all users and services (for example, CDSDashboards).
- By comparison, creating the environments through conda-store will provide more granular control over certain settings and permissions.

As Nebari and conda-store mature, the intent is to migrate exclusively to conda-store for environment creation and management.

## What if I need to install package `X`, and it's not available in the environment?

You can add the package to the `nebari_config.yml`. If you don't have access to the deployment repo,
you'll need to contact your Nebari administrator to include the required package.

## What's included in the conda environment if I want to use Dask?

<!-- TODO: will need to update the conda-feedstock -->

There are drop-in replacements for `distributed`, `dask`, and `dask-gateway` with the correct pinned versions available via the [Nebari Dask metapackage](https://github.com/conda-forge/nebari-dask-feedstock). Example: `nebari-dask==||nebari_VERSION||`.

## How can I install a package locally? Will this package be available to Dask workers?

:::caution

We _strongly recommend_ installing packages by adding them through the conda-store UI. If you're developing a package and need to install the package through `pip`, `conda`, or similar, the following approach may be used.

:::

If you are using a `setuptools` package, you can install it into your local user environment by:

```shell
pip install --no-build-isolation --user -e .
```

If you're using a `flit` package, you can install it through the following command:

```shell
flit install -s
```

It's important to note that packages installed this way aren't available to the Dask workers. See our [Dask tutorial][dask-tutorial] for more information.

## Can I modify the `.bashrc` file on Nebari?

Regular Nebari users do not have write permissions to modify the `.bashrc` file.

Nebari automatically creates and manages `.bashrc` and `.profile`, so if the intent of using the `.bashrc` file is to populate environment variables in bash scripts or similar, you can source the file in any scripts you create by including the following line in your scripts:

```bash
source ~/.bashrc
```

You can use `.bashrc` on Nebari, but it's important to note that by default Nebari sources `.bash_profile`. You should double-check to source the `.bashrc` inside the `.bash_profile`. Also, note that if you set environment variables in this way, these variables aren't available inside the notebooks.

## What if I can't see the active conda environment in the terminal?

Set the `changeps1` value in the `conda` config:

```shell
conda config --set changeps1 true
```

The `conda` config is located in the `/home/{user}/.condarc` file. You can change the conda config with a text editor (for example: `nano`, which is included in Nebari by default), and the changes will be applied on saving the file.

## How do I clean up or delete the conda-store pod, if I need to?

You may find that the pods hosting your environment get full over time, prompting you to clear them out. To delete old builds of your environment on conda-store, click the "delete" button in the conda-store UI.

## How do I use preemptible and spot instances on Nebari?

A preemptible or spot VM is an instance that you can create and run at a much lower price than normal instances. Azure
and Google Cloud platform use the term preemptible, while AWS uses the term spot, and Digital Ocean doesn't support
these types of instances. However, the cloud provider might stop these instances if it requires access to those
resources for other tasks. Preemptible instances are excess Cloud Provider's capacity, so their availability varies with
usage.

#### Usage

##### Google Cloud Platform

The `preemptible` flag in the Nebari config file defines the preemptible instances.

```yaml
google_cloud_platform:
  project: project-name
  region: us-central1
  zone: us-central1-c
  availability_zones:
  - us-central1-c
  kubernetes_version: 1.18.16-gke.502
  node_groups:
# ...
    preemptible-instance-group:
      preemptible: true
      instance: "e2-standard-8"
      min_nodes: 0
      max_nodes: 10
```

##### Amazon Web Services

Spot instances aren't supported at this moment.

##### Azure

Preemptible instances aren't supported at this moment.

##### Digital Ocean

Digital Ocean doesn't support these type of instances.

## How do I access a GPU on Nebari?
## Why doesn't my code recognize the GPU(s) on Nebari?

First be sure you chose a [GPU-enabled server when you selected a profile][selecting a profile].  Next, be sure your environment includes a GPU-specific version of either PyTorch or TensorFlow, i.e. `pytorch-gpu` or `tensorflow-gpu`.  Also note that `tensorflow>=2` includes both CPU and GPU capabilities, but if the GPU is still not recognized by the library, try removing `tensorflow` from your environment and adding `tensorflow-gpu` instead.

<!-- Internal links  -->

[dask-tutorial]: tutorials/using_dask.md
[selecting a profile]: https://www.nebari.dev/docs/how-tos/login-keycloak#3-selecting-a-profile
