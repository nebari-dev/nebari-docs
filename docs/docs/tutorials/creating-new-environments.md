---
id: creating-new-environments
title: Creating a new environment on Nebari
description: Using conda-store for environment creation
---

## Introduction

In this tutorial, you will learn how to create a new environment on Nebari using `conda-store`,
install new `conda` packages in your environment, manage multiple environments, and also share the environment with other Nebari users.

### Why using `conda` environments

Development environments give developers and Data Scientists a "sandbox" to work in, experiment with new packages, work across multiple projects, and collaborate with their peers.
Environment and package managers such as `conda` enables you to create isolated spaces to separate dependencies on a per-project basis.
They also add other benefits such as:

- Reduce friction to install and upgrade dependencies without affecting other projects or users
- Reduce the risk of dependency conflicts
- Promote reproducibility and replicability through dependencies pinning
- Reduce the "works on my machine" risk - thus working towards reproducible builds across multiple machines

### What is `conda`?

[Conda](https://docs.conda.io/projects/conda) is and open source package management system that allows you to create
environments and install packages into them. It allows the creators of a package to specify required dependencies
which `conda` can then solve into an environment. `Conda` can then run an update on the environment to pull all the
packages up-to-date while still maintaining compatibility.

While `conda` manages compatibility between the packages in the environment this does not, by default guarantee reproducible builds over time.
An environment created with a list of packages _today_ can differ from that same environment created with the same
list of packages _tomorrow_. This can happen because package dependencies have changed, new releases have occurred,
or even because a package is no longer available.

### What is `conda-store`?

[`conda-store`](https://conda-store.readthedocs.io/) is a Python package that serves _identical_ `conda` environments by controlling the
environment lifecycle.
It ensures that the management, building, and serving of environments is as identical as possible and seamless for the end users.

All environments in Nebari are served through `conda-store`.

Using `conda-store`, Nebari admins can track specific files or directories for changes in environment specifications.
They can manage environments using the REST API or the command-line utility (CLI).
This tutorial focuses on using the web interface to interact with our environments.

## Step 1 - Exploring the `conda-store` web interface

1. To get started, navigate to `https://<your-nebari-domain>/conda-store` (e.g. <https://quansight.qhub.dev/conda-store>).

2. You will need to log in order to authenticate to the `conda-store` interface - this is required to be able to access most of `conda-store` functionalities.

   ![conda-store login UI - before authentication](/img/tutorials/conda_store_login.png)

3. This will lead you through a series of windows to authorize with Keycloak, after which you will have access to the
   `conda-store` dashboard. By default, you will be directed to the user page containing information about your account and the associated permissions.

   ![conda-store dashboard UI - after authentication](/img/tutorials/conda_store_dashboard.png)

Some useful sections to notice in the `user` page are:

- **User**: this section of the dashboard allows users to explicitly logout of the interface.
- **Namespaces**: `Namespaces` are an important part of the `conda-store` [authorization model](https://conda-store.readthedocs.io/en/latest/contributing.html#authorization-model). They
  control what level of access users are provided to the individual environments. In other words, based on your
  permissions in each namespace, your ability to create, read, update, or delete and environment will differ.
- **Permissions**: your current permissions in each namespace.

That is, unless your admin has configured your namespace differently. You can see here that the `conda-store`
authorization model is able to provide admins with a fine-grained level of control.

## Step 2 - Creating a new environment

1. To create a new environment, click on the `Create New Environment` button on the top right of the navigation bar. You will
   be presented with an option to upload a
   [conda YAML file](https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#creating-an-environment-from-an-environment-yml-file)
   or write your own.

   ![conda-store create environment UI](/img/tutorials/conda_store_create_env.png)

   For this tutorial, you can copy and paste the following environment specification:

   ```yaml title="Sample environment specification"
   channels:
   - conda-forge
   dependencies:
   - python=3.9
   - numpy
   - matplotlib
   - pandas
   - panel
   - ipykernel
   - ipywidgets
   name: example-environment
   prefix: null
   ```

2. After you copy the above into the UI, go ahead and click the `Submit` button.

3. You will be redirected to the environments overview page. Find the card with the name of the new environment under your user's namespace (e.g.
   `<your-username>/example-environment`).

   ![Newly create environment card](/img/tutorials/conda_store_new_env.png)

4. Click on the card for your newly created environment. The UI will display the environment specification:

   ![conda-store - Environment details page](/img/tutorials/conda_store_env_details.png)

   If this is the first time visiting this page, the environment may still be in the process of building.
   The page will automatically update when the build is complete.

   From this page, you can `Edit` your YAML specification, or even `Delete` the environment.

   :::note
   `conda-store` tracks all the environments behind the scenes for the users. Even if a user "deletes" an environment,
   it will still exist in the store. This ensures admins always have access to environment history.
   :::

5. Now let's take a closer look at the `conda` build detail, to do this, click on the build number link in the `conda-store` interface.
   This will display a new page with the metadata about the environment including the time, size and status.
   Also included is your original YAML specification and a list of all the installed dependencies, their version and the used `conda` channels.

   ![conda-store UI - Sample environment build details page: showing build details, specification file, and conda packages](/img/tutorials/conda_store_build_details_top.png)

   Scroll down to the bottom of this list, and you'll see a section called `Conda Environment Artifacts`.
   This is where you can download your own copy of the YAML file, a [conda-lock](https://conda-incubator.github.io/conda-lock/) file, and a `tar.gz` archive of the environment.

   ![conda-store UI - Sample environment build details page: showing the conda environment artifacts](/img/tutorials/conda_store_build_details_bottom.png)

6. Lastly, click on `Full Logs` to view the full output from the `conda` build.

:::note
If you want to use your new environment in a Jupyter Notebook, don't forget to include `ipykernel` and `ipywidgets` in
your environment’s `yaml` file, or it may not be visible in the list of available kernels.
:::

## Step 3 - Installing packages via `conda` or `pip`

To install new packages through either `conda` or `pip` you'll need to navigate back to the `Edit` page of your environment
in the `conda-store` web interface.

Adding `conda` packages to a `conda-store` environment via the command line, is not possible since the files are
read-only in that context.

Additionally, adding `pip` packages via the command line is strongly discouraged. Not only do `conda` and `pip` not
always play nice together, but it can lead to some inconsistencies across users' dependencies.
This happens because when you `pip` install a package from the command line this is installed in your `.local` folder, so this changes will not be applied to other Nebari users.

:::note
One exception to this rule is packages that you are actively developing.
As you are building a package, you will likely want to install it as a _dev_ package.
This can be done using:

```bash
pip install --no-build-isolation --user -e .
```

Or, if you’re using `flit`, you can install with:

```bash
flit install -s
```

Please keep in mind that these are _NOT_ available to Dask workers!
:::

## Troubleshooting

1. If you have an environment that fails to build properly, you'll be able to see this failure on the build status page.

   Navigate to the `Full Logs` to investigate in more detail. Also, from the build status page you can trigger re-build in
   case you hit issues with intermittent outages, etc.

2. If you need to use Dask

   We highly recommend you include the [QHub Dask metapackage](https://anaconda.org/conda-forge/qhub-dask) to maintain version compatibility between the Dask client and server.
   This replaces `distributed`, `dask`, and `dask-gateway` with the correctly pinned versions.
