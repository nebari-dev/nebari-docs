---
title: Environment configurations
id: environments-configuration
description: Configure environments with conda-store
---

# Environment configurations

<!-- TODO: Update the time to create environments based in new conda-store updates -->

Each environment configuration is a `environment.<filename>` mapping to a conda environment definition file.
If you need to pin a specific version of a package, please include it in the definition.
Upon changing the environment definition expect 1-10 minutes upon deployment of the configuration for the environment to appear.

:::note
One current requirement is that each environment _must_ include `ipykernel` and `ipywidgets` to properly show up in the JupyterLab environment.
:::

Nebari comes with two default environments that are built during deployment:

- `nebari-git-nebari-git-dask` to [run distributed workflows with Dask][using-dask],
- `nebari-git-nebari-git-dashboard` to [create shareable dashboard][create-dashboards].

:::note
The double `nebari-git` is a known consequence of using conda-store for environment management.

Learn more in the [FAQ: Why do I see duplication in the names of environments?](../faq#why-is-there-duplication-in-names-of-environments)
:::

```yaml
### Example environment configuration
environments:
  "environment-example.yaml":
    name: example
    channels:
      - conda-forge
      - defaults
    dependencies:
      - python=3.9
      - ipykernel
      - ipywidgets
      - numpy
      - numba
      - pandas
      - jinja2
      - pyyaml
```

:::warning
By default conda-store restricts the environment channels to only accept `defaults` and `conda-forge`.

<!-- TODO: Uncomment and add link when ready -->
<!-- You can check out [Managing conda environment][] for more details. -->

:::

<!-- Internal links -->

[using-dask]: ../tutorials/using_dask
[create-dashboards]: ../tutorials/creating-cds-dashboard
