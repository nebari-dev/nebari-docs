---
id: creating-new-environments
title: Manage packages and environments
description: Using conda-store for environment management
---

Nebari uses [`conda-store`][conda-store-docs] for managing and sharing reproducible environments (collection of specific packages and versions) on the platform.

:::warning
conda-store is the most reliable way to manage your packages and environments on Nebari.

Do not install libraries directly in the notebook or through the terminal (outside a conda-store managed environment). It won't work as expected and may break your instance in subtle ways.
:::

## Preliminary reading

- [Essential conda concepts: Packages, environments, channels, dependencies, etc.](https://conda.store/conda-store/explanations/conda-concepts)
- [conda-store concepts: Reproducibility, namespaces, environment versions, roles, etc.](https://conda.store/conda-store/explanations/conda-store-concepts)

You interface with the conda-store UI

## Open `conda-store` web interface

 Navigate to conda-store:

* From Nebari Home, click on **"Environment Management"** under "Service"
* From JupyterLab, click on `Nebari` in the menu bar and go to **"Environment Management"**
* Go to URL: `https://<your-nebari-domain>/conda-store`

If not logged in, click on the **"Log in"** in th left sidebar and authenticate as logging into Nebari via Keycloak. This is required to be able to access most of `conda-store` functionalities.

## Create, edit, and manage environments

Follow the conda-store (UI) tutorials:

* [Create new environments][cs-create-env]
* [Edit & delete existing environments][cs-edit-delete-env]
* [Switch environment versions][version-control]

## Default namespaces in Nebari

* analyst
* developer
* admin

## Default environments in Nebari

* dask

## Troubleshooting

1. If you have an environment that fails to build properly, you'll be able to see this failure on the build status page.

   Navigate to the `Full Logs` to investigate in more detail. Also, from the build status page you can trigger re-build in
   case you hit issues with intermittent outages, etc.

2. If you need to use Dask.

   We highly recommend you include the [Nebari Dask metapackage](https://anaconda.org/conda-forge/nebari-dask) to maintain version compatibility between the Dask client and server.
   This replaces `distributed`, `dask`, and `dask-gateway` with the correctly pinned versions.

<!-- External links -->

[conda-docs]: https://docs.conda.io/projects/conda
[conda-store-docs]: https://conda.store/
[conda-store-docs-auth]: https://conda.store/conda-store/references/auth#authorization-model
[cs-create-env]: https://conda.store/conda-store-ui/tutorials/create-envs
[cs-edit-delete-env]: https://conda.store/conda-store-ui/tutorials/edit-delete-envs
[version-control]: https://conda.store/conda-store-ui/tutorials/version-control
