---
id: creating-new-environments
title: Manage packages and environments
description: Using conda-store for environment management
---

Nebari uses [`conda-store`][conda-store-docs] for managing and sharing reproducible
environments (collection of specific packages and versions) on the platform.

:::warning
conda-store is the most reliable way to manage your packages and environments on
Nebari.

Refrain from installing libraries directly in the notebook or through the terminal
(outside a conda-store managed environment). These actions could lead to subtle
and unforeseen problems with your environment.
:::

## Preliminary reading

It's useful to understand basics of conda-store and how it builds on top of the
conda ecosystem, to use it effectively in Nebari.

- [Essential conda concepts: Packages, environments, channels, dependencies, etc.](https://conda.store/conda-store/explanations/conda-concepts)
- [conda-store concepts: Reproducibility, namespaces, environment versions, roles, etc.](https://conda.store/conda-store/explanations/conda-store-concepts)

Nebari has conda-store integrated, and you can use it through the graphical UI.

## Open `conda-store` web interface

![Conda Store WebUI interface](/img/tutorials/conda_store_webui.png)

There are several options for navigating to conda-store:

- From Nebari Home, click on **"Environment Management"** under "Services"
- From JupyterLab, click on `Nebari` in the menu bar and go to **"Environments"**
- From anywhere, go to URL: `https://<your-nebari-domain>/conda-store`

If not logged in to conda-store, click on the **"Log in"** button in th left
sidebar and authenticate similar to the [Nebari login][login-keycloak]. This is
required to be able to access many `conda-store` features.

## Create, edit, and manage environments

Go through the following conda-store (UI) tutorials
on using the graphical interface for various actions:

- [Create new environments][cs-create-env]
- [Edit & delete existing environments][cs-edit-delete-env]
- [Switch environment versions][version-control]

## Default namespaces in Nebari

A default Nebari deployment/instance has the following namespaces corresponding
to [Nebari groups][configure-keycloak-groups]:

<!-- Verify the roles and actions -->

- `analyst` namespace - Users in the `analyst` group can view and `admin` group
  can view+edit the environments in this namespace
- `developer` namespace - Users in the `developer` and `admin` groups can view+edit
  the environments in this namespace
- `nebari-git` namespace - Everyone can view and `admin`s can edit

As an individual user, you also have a personal namespace with the same name as
your Nebari username.

:::note
If you can "view" an environment, you can use it.
:::

## Select environments in editors

Instructions to select any environment you have access to in the following editing
spaces:

- **JupyterLab** - In a Jupyter Notebook, click on the "Select Kernel" dropdown in
  the top-left corner, and select the environment.

- **VS Code** - Click on the ⚙️ icon in the bottom-right to open `Settings` ->
  `Command Palette`, and type "Python: Select Interpreter" and press <kbd>Enter</kbd>
  to get the list of environments to select from.

- **Terminal** - In the terminal window, you can use `conda` CLI commands like
  `conda activate <namespace>-<environment_name>` to activate the relevant
  environment and `conda env list` to view the list of available environments.

## Special requirements

### Dask

Include the [`nebari-dask` metapackage](https://anaconda.org/conda-forge/nebari-dask)
in your environment to use Dask. This ensures you have the correct version of
`dask-gateway` and the latest versions of `dask` and `distributed` libraries.

By default, the `nebari-git-nebari-git-dask` environment (available to everyone)
can be used for basic Dask workflows.

### JHub App Launcher

Include the `jhub-apps` package in your environment to create apps using the
JHub App Launcher. You will also need the relevant app development framework
and other necessary packages in the environment.

<!-- External links -->

[conda-store-docs]: https://conda.store/
[cs-create-env]: https://conda.store/conda-store-ui/tutorials/create-envs
[cs-edit-delete-env]: https://conda.store/conda-store-ui/tutorials/edit-delete-envs
[version-control]: https://conda.store/conda-store-ui/tutorials/version-control

<!-- Internal links -->

<!--Update when PR#397 is merged -->

[login-keycloak]: /docs/tutorials/login-keycloak
[configure-keycloak-groups]: /docs/how-tos/configuring-keycloak#in-depth-look-at-roles-and-groups
