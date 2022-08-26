# Frequently asked questions

### Why is the `NEBARI_KUBECONFIG` file in `/tmp`?

Nebari regenerates this file on every run. Yes, it will be removed by the operating system during its cleanup process, but running the `qhub deploy` command again as Nebari will update/create a `NEBARI_KUBECONFIG` file for you.

### How are Nebari conda user environments created? Who creates them?

The short answer: there are currently *two* ways of creating environments, as we are in the process of migrating Nebari to Conda-Store, and so which way depends on your use-case.

The longer answer: for global environments, you can specify the environment in `qhub_config.yml` and it will be made available for all users and services (e.g., CDSDashboards). Creating the environments in Conda-Store, by comparison, will provide more granular control over certain settings and permissions.

As Nebari and Conda-Store mature, the intent is to migrate exclusively to Conda-Store for environment creation and management.

### What if the user requires package `X` and it's not available in the environment?

You can simply add the package to the `qhub_config.yml`. If the user doesn't have access to the deployment repo, they'll need to contact their Nebari admin to
include the required package.

### What's included in the user's environment if a user wants to use Dask?

There are drop-in replacements for `distributed`, `dask`, and `dask-gateway` with the correct pinned versions available via the [QHub Dask metapackage](https://github.com/conda-forge/qhub-dask-feedstock). Example: `qhub-dask==||QHUB_VERSION||`.

### How can a user install a package locally? Is it available to the user's Dask workers?

:::caution

We *strongly recommend* installing packages by adding them through the Conda-Store UI. In an emergency situation, the following approach may be used.

:::

If the user is using a `setuptools` package, they can install it into their local user environment by:

```shell
pip install --no-build-isolation --user -e .
```

If they're using a `flit` package, they can install with

```shell
flit install -s
```

These aren't available to the Dask workers. See our [Dask tutorial](tutorials/using_dask.md) for more information.

### How can users use .bashrc on Nebari?

The user can use `.bashrc` on Nebari, but it's important to note that by default Nebari sources `.bash_profile`. The user should double-check to source the `.bashrc` inside of the `.bash_profile`. Also note that if the user sets environment variables in this way, these variables aren't available inside the notebooks.

### What if a user can't see the active conda environment in the terminal?

Set the `changeps1` value in the conda config:

```shell
conda config --set changeps1 true
```

### How do I clean up or delete the Conda-Store pod, if I need to?

There are potentially two similar questions here with very different answers.

If you want to delete old builds of your environment on Conda-Store, you simply need to click the "delete" button in the Conda-Store UI.

If you want to *purge* old builds of your environment entirely from the system, you will need to go to the NFS mount on the server, as these builds are cached there. You can then manually delete the cached builds. This can be done either through k9s, or ssh-ing into the Conda-Store pods.