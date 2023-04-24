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

## What packages are needed in your environment to create a dashboard?

When deploying an app via CDS Dashboards, you will always need to have `cdsdashboards-singleuser` installed in your environment. This allows your environment to show up on the environment options menu when creating your app.

Furthermore, with each framework, you will need to make sure that the specific framework you are deploying is installed. You will need to install `streamlit` for a streamlit app, `panel` for a panel app, etc.

Finally, when creating your app, make note of the packages you are using to run the app locally. These will also need to be added to your environment you will be using to create the dashboard.

There are several example dashboards to build in the dashboard_examples folder on Nebari. The `environment.yml` file in this folder can be used to build an environment that can run each of the dashboard examples available.

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

If the package requires build tools like `gcc` and `cmake`, remember that you can create a conda environment through the conda-store UI that includes the build tools, then just activate the environment and install the package locally.

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

## Why doesn't my code recognize the GPU(s) on Nebari?

First be sure you chose a [GPU-enabled server when you selected a profile][selecting a profile]. Next, if you're using PyTorch, see [PyTorch best practices][pytorch best practices].  If it's still not working for you, be sure your environment includes a GPU-specific version of either PyTorch or TensorFlow, i.e. `pytorch-gpu` or `tensorflow-gpu`. Also note that `tensorflow>=2` includes both CPU and GPU capabilities, but if the GPU is still not recognized by the library, try removing `tensorflow` from your environment and adding `tensorflow-gpu` instead.


## How do I migrate from Qhub to Nebari?

Nebari was previously called QHub. If your Qhub version lives in the `0.4.x` series, you can migrate to Nebari by following the [migration guide](./how-tos/nebari-upgrade). If you're using a version of Qhub that lives in the `0.3.x` series, you will need to upgrade to `0.4.x` first as the user group management is different between the two versions. For more information, see the deprecation notice in the [Nebari release note](./references/RELEASE).

## Why is there duplication in names of environments?

The default Dask environment is named `nebari-git-nebari-git-dask`, with `nebari-git` duplicated.

`nebari-git` is the name of the namespace.
Namespaces are a concept in conda-store, however conda itself does not recognize it.

It is possible to use conda-store to create an environment with the name "dask" in two different namespaces.
But because conda doesn't understand namespaces, conda won't be able to differentiate between them.
To avoid this, we prepend the namespace's name into the environment building on conda-store.

Next, [nb_conda_kernels](https://github.com/Anaconda-Platform/nb_conda_kernels) with [nb-conda-store-kernels](https://pypi.org/project/nb-conda-store-kernels/) are the packages that we use to transform conda environments into runnable kernels in JupyterLab (that's why we require that all environments have `ipykernel`).

The issue is that `nb_conda_kernels` insists the following path: `/a/path/to/global/datascience-env`, which corresponds to `global-datascience-env` being the name that users see while `datascience-env` is what conda sees.

Hence, to make things unique we've named things as `/a/path/to/global/global-datascience-env`. This makes conda see the env as `global-datascience-env`, but `nb_conda_kernel` now displays it as `global-global-datascience-env`.

We have discussed contributing a PR to `nb_conda_kernels`, but the project has not accepted community PRs in over 3 years, so we don't currently have the motivation to do this.

If you have potential solutions or can help us move forward with updates to the `nb_conda_kernels`, please reach out to us on our [discussion forum](https://github.com/orgs/nebari-dev/discussions)!

<!-- Internal links -->

[dask-tutorial]: tutorials/using_dask.md
[selecting a profile]: https://www.nebari.dev/docs/how-tos/login-keycloak#3-selecting-a-profile
[pytorch best practices]: https://www.nebari.dev/docs/how-tos/pytorch-best-practices
