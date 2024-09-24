---
title: Environment configurations
id: environments-configuration
description: Configure environments with conda-store
---

# Environment configurations

:::tip
For guidance on managing or creating environments directly with conda-store, see our guide on [Creating new environments on Nebari](/docs/tutorials/creating-new-environments.md).
If you're looking for information on updating your namespaces after a recent upgrade, refer to our troubleshooting guide on [Migrating namespaces](/docs/troubleshooting.mdx#conda-store-compatibility-migration-steps-when-upgrading-to-045).
:::

<!-- TODO: Update the time to create environments based in new conda-store updates -->

Nebari comes with two default environments that are built during deployment:

- `nebari-git-nebari-git-dask` to [run distributed workflows with Dask][using-dask],
- `nebari-git-nebari-git-dashboard` to [create shareable dashboard][create-dashboards].

The configuration of each environment in Nebari is achieved through a `environment.<filename>` mapping to a conda environment specification. To configure environments, you can add entries to the `nebari-config.yml` file located in the deployment repository, which will then be used by conda-store to create or update the environment during deployment.

For example, the following snippet shows an environment configuration in `nebari-config.yml`:

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

In this example, the environment is defined with the name "example" and includes various dependencies specified as a list of package names and versions. Additionally, two channels, `conda-forge` and `defaults`, are specified to be used to retrieve the packages during environment creation.

:::note
One current requirement is that each environment _must_ include `ipykernel` and `ipywidgets` to properly show up in the JupyterLab environment.
:::

After you modify an environment definition in the configuration, it may take 1-10 minutes for the changes to take effect after you deploy the configuration. Once the environment is updated, you can access it from the JupyterLab environment selection menu under the `nebari-git` namespace. For example, if you created an environment called `example` (as show in the above example), it will be available as `nebari-git-nebari-git-example`.

:::note
The double `nebari-git` is a known consequence of using conda-store for environment management.

Learn more in the [FAQ: Why do I see duplication in the names of environments?](../faq#why-is-there-duplication-in-names-of-environments)
:::

:::warning
For versions of Nebari earlier than `2023.04.1`, conda-store by default restricts the environment channels to only accept `defaults` and `conda-forge`.

<!-- If you want to use other channels, you can follow the instructions in [Managing conda environment][]. -->

:::

<!-- Internal links -->

[using-dask]: ../tutorials/using_dask

### Built-in namespaces:

In Nebari, namespaces are used to organize and isolate resources. Nebari has two built-in namespaces: `nebari-git` and `global`.

The `nebari-git` namespace refers to all available environments created using the `nebari-config.yaml` file and is available for all users and services. On the other hand, the global namespace (previously known as default) is the default namespace used by conda-store to manage its internal components and workers. It is designed for environments that are specific to a user or a service.

For more information, please refer to conda-store [administration documentation](https://conda.store/en/latest/administration.html) related to `CondaStore.default_namespace` and `CondaStore.filesystem_namespace` respectively.

:::note
By default, the namespace `nebari-git` is used in a standard Nebari deployment. However, you can change the namespace name by modifying the `conda-store.default_namespace` entry in your `nebari-config.yaml` configuration file. Keep in mind that this setting permanently changes the namespace name.
:::

When you specify an environment in `nebari-config.yml`, it will be made available for all users and services under the `nebari-git` namespace. Conda-store is responsible for creating them upon request from the deployment process.

However, the conda-store permission model restricts user intervention for both namespaces. This means that `nebari-git` environments can only be modified within the Nebari deployments, while global environments can be locally changed via direct interaction with conda activate. However, any changes made to `global` environments will only be perceived by the user and not propagated to other users.

:::warning
To reiterate, the `nebari-git` namespace is modified using nebari-config deployments only, and any modifications to the `global` namespace will only be available locally.
:::

:::note
While it is not possible to interact with these namespaces directly, it is possible to override the conda-store permission model to allow users to modify the environments.
For more information please refer to [Handle Access to restricted namespaces](/docs/troubleshooting.mdx#handle-access-to-restricted-namespaces)
:::
