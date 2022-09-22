# Frequently asked questions

## Why is the `NEBARI_KUBECONFIG` file in `/tmp`?

Nebari regenerates this file on every run. This means it will be removed by the operating system during its cleanup process,
but running the `nebari deploy` command again as a Nebari administrator will update/create a `NEBARI_KUBECONFIG` file for you.

## How are Nebari conda user environments created? Who creates them?

The short answer: there are currently _two_ ways of creating environments, as we are in the process of migrating Nebari to conda-store,
and so which way depends on your use-case.

The longer answer:

- For global environments, you can specify the environment in `nebari_config.yml`, and it will be made available for all users and services (e.g., CDSDashboards).
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

It's important to note that packages installed this way aren't available to the Dask workers. See our [Dask tutorial](tutorials/using_dask.md) for more information.

## Can I modify the `.bashrc` file on Nebari?

Regular Nebari users do not have write permissions to modify the `.bashrc` file.

Nebari automatically creates and manages `.bashrc` and `.profile`, so if the intent of using the `.bashrc` file is to populate environment variables in bash scripts or similar, you can source the file in any scripts you create by including the following line in your scripts:

```bash
source ~/.bashrc
```

You can use `.bashrc` on Nebari, but it's important to note that by default Nebari sources `.bash_profile`. You should double-check to source the `.bashrc` inside of the `.bash_profile`. Also, note that if you set environment variables in this way, these variables aren't available inside the notebooks.

## What if I can't see the active conda environment in the terminal?

Set the `changeps1` value in the conda config:

```shell
conda config --set changeps1 true
```

The conda config is located in the `/home/{user}/.condarc` file. You can change the conda config with a text editor (for example: `nano`, which is included in Nebari by default), and the changes will be applied on saving the file.

## How do I clean up or delete the conda-store pod, if I need to?

You may find that the pods hosting your environment get full over time, prompting you to clear them out. To delete old builds of your environment on conda-store, click the "delete" button in the conda-store UI.
