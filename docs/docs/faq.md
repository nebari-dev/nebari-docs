# Frequently asked questions

### Why is the `NEBARI_KUBECONFIG` file in `/tmp`?

Nebari regenerates this file on every run. Yes, it will be removed by the operating system during its cleanup process, but running the `qhub deploy` command again as Nebari will update/create a `NEBARI_KUBECONFIG` file for you.

### How are Nebari conda user environments created? Who creates them?

The environment specifications are made in `qhub_config.yml` in the deployment repo, which Nebari incorporates using [conda-store](https://conda-store.readthedocs.io/). When users manage their environments with Conda-Store, they get all the same benefits of environment versioning that Nebari does such as convenient environment rollback and environment encapsulation in containers.

Anyone with access to the Nebari deployment repo can add new environments, and there is no limit to the number of included environments.


### What if the user requires package `X` and it's not available in the environment?

You can simply add the package to the `qhub_config.yml`. If the user doesn't have access to the deployment repo, they'll need to contact their Nebari admin to
include the required package.

### What's included in the user's environment if a user wants to use Dask?

There are drop-in replacements for `distributed`, `dask`, and `dask-gateway` with the correct pinned versions available via the [QHub Dask metapackage](https://github.com/conda-forge/qhub-dask-feedstock). Example: `qhub-dask==||QHUB_VERSION||`.

### Why can't a user just create their own local conda environment or edit the existing conda environments?

The version of [conda-store](https://conda-store.readthedocs.io/) used in Nebari versions 0.3.11 and earlier is an alpha version. It doesn't support using local conda environments or editing pre-exising environments directly.

### How can a user install a package locally? Is it available to the user's Dask workers?

If the user is using a `setuptools` package, they can install it into their local user environment by:

```shell
pip install --no-build-isolation --user -e .
```

If they're using a `flit` package, they can install with

```shell
flit install -s
```

These aren't available to the Dask workers.

### How can users use .bashrc on Nebari?

The user can use `.bashrc` on Nebari, but it's important to note that by default Nebari sources `.bash_profile`. The user should double-check to source the `.bashrc` inside of the `.bash_profile`. It's important to note that if the user sets environment variables in this way, these variables aren't available inside the notebooks.

### How to use environment variables on dask workers which aren't loaded via a package?

It's achieved through the web interface:

```python
import dask_gateway
gateway = dask_gateway.Gateway()
options = gateway.cluster_options()
options
```

It can also be accessed in the same way programmatically:

```python
env_vars = {
"ENV_1": "VALUE_1",
"ENV_2": "VALUE_2"
}
options.environment_vars = env_vars
```

This feature is available in release 0.3.12 or later.

### What if a user can't see the active conda environment in the terminal?

Set the `changeps1` value in the conda config:

```shell
conda config --set changeps1 true
```

### What if a user wants to use the Nebari server to compute a new pinned environment, which the user serves via the `qhub_config.yml`?

If the user needs to solve a conda env on a Nebari server, they'll need to specify the prefix. For example, `conda env create -f env_test.yml --prefix/tmp/test-env` where `test-env` is the env name. This is not recommended, but there are valid use cases of this operation.