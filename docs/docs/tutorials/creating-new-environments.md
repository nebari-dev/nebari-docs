---
id: creating-new-environments
title: Creating a new environment on Nebari
description: Using conda-store for environment creation
---

## :convenience_store: Introduction

In this tutorial, we will create a new environment on Nebari using `conda-store`, look into how we can
install new conda packages, manage multiple environments, and also share the environment with other Nebari users.

### Why have environments?

Environments give developers and analysts a "sandbox" to play in. They create isolated spaces to separate
dependencies on a per-project basis. In general, environments solve several common issues:

- Onboard new developers/contributors
- Packages update frequently
- There are often incompatibilities between certain package versions
- The larger the environment, the harder it is to share with others
- Reproducibility

### What is `conda`?

[Conda](https://docs.conda.io/projects/conda) is and open source package management system that allows us to create
environments and install packages into them. It allows the creators of a package to specify required dependencies
which `conda` can then solve into an environment. `Conda` can run an update on the environment to pull all of the
packages up-to-date while still maintaining compatibility.

While `conda` manages compatibility between the packages in the environment, we often face a different issue...

An environment created with a list of packages _today_ can differ from that same environment created with the same
list of packages _tomorrow_. This can happen because package dependencies have changed, new releases have occurred,
or even because a package is no longer available.

### What is `conda-store`?

As developers and analysts, we have all experienced the `it works on my machine ¯ \_(ツ)_/¯` conundrum.

[`conda-store`](https://conda-store.readthedocs.io/) serves _identical_ `conda` environments by controlling the
environment lifecycle. It ensures that the management, building, and serving of environments is as identical as
possible and seamless for the end users.

All environments in Nebari are served through `conda-store`.

Using `conda-store`, Nebari admins can track specific files or directories for changes in environment specifications.
They can manage environments using the REST API or the command-line utility (CLI). For this tutorial, we will focus on
the web interface to interact with our environments.

## :open_file_folder: Exploring the conda-store web interface

To get started, navigate to `https://<your-nebari-domain>/conda-store` (e.g. https://quansight.qhub.dev/conda-store).

You will need to login in order to authenticate to the `conda-store` interface. Most of the site is disabled from
view until users are logged in.

![A screenshot of the conda-store login UI - containing the Login and Create Environemt buttons in upper left side and a list of public environments](/img/tutorials/conda_store_login.png "conda-store login ui")

This will lead you through a series of windows to authorize with Keycloak, after which you will have access to the
`conda-store` dashboard.

![A screenshot containing the conda-store user dashboard view, presenting a Logout and Manage Namespaces buttons as well as a list of Permissions granted for each available Namespace](/img/tutorials/conda_store_dashboard.png "conda-store dashboard ui")

Great! Now we can see a high-level view of our user's conda environments.

### User

The `User` subsection allows users to explicitly logout of the interface.

### Namespaces

`Namespaces` are an important part of the `conda-store`
[authorization model](https://conda-store.readthedocs.io/en/latest/contributing.html#authorization-model). They
control what level of access users are provided to the individual environments. In other words, based on your
permissions in each namespace, your ability to create, read, update, or delete and environment will differ.

### Permissions

The `Permissions` subsection let's you view the permissions that your user has for each namespace. Here, you can
see that your user has full control over the environment in your own namespace, but limited control over the root
filesystem environments.

That is, unless your admin has configured your namespace differently :wink: You can see here that the `conda-store`
authorization model is able to provide admins with a fine-grained level of control.

## :pencil2: Creating a new environment

:boom: Now for the action! :boom:

To create a new environment, click on the `Create New Environment` on the top right of the navigation bar. You will
be presented with an option to upload a
[conda _yaml_ file](https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#creating-an-environment-from-an-environment-yml-file)
or write your own.

![A screenshot of the conda-store management creation UI, it contains a dropdown box for Namespace selection and a Specification field for writing the conda environment yaml details](/img/tutorials/conda_store_create_env.png "conda-store create environment ui")

For this tutorial, we provide you with an example specification:

```yaml
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

After you copy the above into the UI, go ahead and click `Submit`.

You'll be brought to the environments overview page (#TODO should i describe this somewhere explicitly?).
Find the card with the name of the new environment under your user's namespace (e.g.
`<your-username>/example-environment`).

![A white box showing the newly created environment name, composed of namespace / environment name](/img/tutorials/conda_store_new_env.png "newly created environment card")

Click on the card for your environment. You'll be brought the details page for this environment.

![A screenshot of the conda-store environemt details page, has a yaml box presenting the environemt specifications with Button and Delete options as well as the build status](/img/tutorials/conda_store_env_details.png "environment details page")

When you first arrive at this page, the environment may still be in the process of building. The page will
automatically update when the build is complete.

From this page, we can `Edit` our _yaml_ specification, or even `Delete` the environment.

:::note
`conda-store` is tracking all the environments behind the scenes for us. Even if a user "deletes" an environment,
it will still exist in the store. This ensures admins always have access to environment history.
:::

Now let's take a closer look at the conda build detail. Click on the build number link.

At the top of the page, you'll see some metadata about the environment including the time, size and status. Also
included is our original _yaml_ specification an a list of all the packages that were installed into the
environment.

![A screenshot of the environment build details: scheduled-on , started-on, ended-on, status and a list of the installed conda packages for that build.](/img/tutorials/conda_store_build_details_top.png "build details page top")

There are quite a few packages! Scroll down to the bottom of this list and you'll see the next section called
`Conda Environment Artifacts`. This is where you can download your own copy of the _yaml_ file, a
[conda-lock](https://conda-incubator.github.io/conda-lock/) file, or an archive of the environment.

![A screenshot of the environment build details, containing the build artifacts: Environment YAML, Lockfile and tar.gz files](/img/tutorials/conda_store_build_details_bottom.png "build details page bottom")

Lastly, click on `Full Logs` to view the full output from the conda build.

:::note
If you want to use your new environment in a Jupyter Notebook, don't forget to include `ipykernel` and `ipywidgets` in
your environment’s _yaml_ file or it may not be visible in the list of available kernels!
:::

## Installing packages via `conda` or `pip`

To install new packages through either `conda` or `pip` you'll need to navigate back to `Edit` page of your environment
in the `conda-store` web interface.

Adding `conda` packages to a `conda-store` environment via the command line, is not possible since the files are
read-only in that context.

Additionally, adding `pip` packages via the command line is strongly discouraged. Not only do `conda` and `pip` not
always play nice together, it creates environment inconsistency. This happens because when you `pip` install a
package from the command line, it goes into your user's `.local` folder. Other uses appear to be using the same
environment, but they don't have the packages you've `pip` installed. This defeats the purpose and drive behind
`conda-store`.

:::note
One exception to this rule is packages that you are actively developing. As you are building a package, you will likely
want to install it as a _dev_ package. This can be done using:

```bash
pip install --no-build-isolation --user -e .
```

Or, if you’re using a flit package, you can install with

```bash
flit install -s
```

Please keep in mind that these are _NOT_ available to Dask workers!
:::

## Investigating failures

If you have an environment that fails to build properly, you'll be able to see this failure on the build status page.

Navigate to the `Full Logs` to investigate in more detail. Also, from the build status page you can trigger re-build in
case you hit issues with intermittent outages, etc.

## Troubleshooting notes

:::note What if I want to use Dask?
In order to use Dask, we highly recommend you include the
[QHub Dask metapackage](https://anaconda.org/conda-forge/qhub-dask) to maintain version compatibility between the Dask
client and server. This replaces `distributed`, `dask`, and `dask-gateway` with the correctly pinned versions.

Example: qhub-dask==0.4.3.
:::
