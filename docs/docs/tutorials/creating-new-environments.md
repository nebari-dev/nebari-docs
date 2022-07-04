---
id: creating-new-environments
title: Creating a new environment on Nebari
---

## Introduction

Conda store serves identical conda environments in as many ways as possible by controlling the environment lifecycle. It ensures that the management, builds, and serving of environments is as identical as possible and seamless for the end users.

With Conda store, you can track specific files or directories for changes in environment filename specifications, manage environments using a REST API, and have a command-line utility along with a web interface to fully capitalize on all its capabilities.

In this tutorial, we will be initializing a new environment on Nebari using Conda store, looking into how we can install new conda packages, manage multiple environments and also share the environment with other Nebari users.

## Quickstart

To get started with Conda store, you need to have a running instance of Nebari. The traditional way of managing the Conda environments on Nebari has been via directly editing the `environments:` key within the  `nebari-config.yaml`   configuration file. With Conda store, you can manage the environments using a YAML specification over a user interface which can be then used with your server.

To get started, navigate to `https://<nebari-domain>/conda-store/`. You will be asked to authorize with Keycloak, after which you will have access to the Conda store dashboard. On the Conda store dashboard, you can explore various environments and create new ones.

To create a new one, navigate to `Create New Environment` on the left of the navigation bar. You will be presented with an option to upload a new YAML specification or write your own. To get started, we provide the following specification:

```yaml
channels:
- conda-forge
dependencies:
- python=3.9
- numpy
- toolz
- matplotlib
- dill
- pandas
- partd
- bokeh
- ipykernel
- ipywidget
name: example-environment
prefix: null
```

Click on `Submit` and scroll down over the Conda store dashboard to see the new environment being built. You can click on the individual build to see the status of the build. After the conda environment is built, you will be able to access the logs and check all the conda packages that were installed. You can also see various artifacts which includes a conda lockfile, YAML and an archive.

Click on `Full Logs` to see the logs and how to activate the environment. On your Nebari dashboard, start a terminal and activate the Conda environment using:

```shell 
conda activate <name-of-environment>
```

To use the environment over a JupyterLab instance, navigate to `Kernel` and select `Change Kernel`. From the drop-down menu, select the kernel that you wish to work with. In order for your new environment to be properly visible in the list of available kernels, you will need to include  `ipykernel` and `ipywidgets` in your environment’s dependency list.

## Structure of the YAML file

A pinned YAML file is generated for each environment is built. This includes pinning of the `pip` packages as well. Note that there are cases where the completely pinned packages do not solve. Packages are routinely marked as broken and removed.

However conda-forge has a policy that packages are never removed but are marked as broken. Most channels do not obey this policy. When you click the yaml button a YAML file will then be downloaded. To install the environment locally run the following:

```shell
conda env create -f <environment-filename>
```

## Modifying an existing environment

To modify the existing environment, navigate to your environment on the Conda store dashboard and click on `Edit`. You will be presented to either upload a new file by browsing your machine or edit the existing specification. Let us try installing `scipy` to our existing environment.

We will add a new entry in the YAML's `dependencies` section and click on `Submit`. You can navigate back to your environment and see the new build in progress. Every build is versioned and you can easily roll-back to using your previous environment.

Click on `Full Logs` to see the logs and how to activate the new environment. You can now use your new environment on your JupyterLab instance or a terminal.

## Installing packages via `conda` or `pip`

To install new packages in your Conda store environment from your JupyterLab instance or your terminal, you can use the `conda` or `pip` commands.

To install `pandas` via conda, you can run the following on Nebari terminal:

```shell
conda install pandas
```

To install packages via `pip`, run the following on Nebari terminal:

```shell
conda install pip
pip install wordcloud
```

However, do note that issues may arise when using `pip` and `conda` together. Use `pip` to install any packages only when you have added all your packages via `conda`.

## Administering environments on Nebari

One of the two (`dashboard` or `dask`) Conda store environments created during the initial Nebari deployment fails to appear as options when logged into JupyterHub. If your user has access to Conda store, you can verify this by visiting `<your_nebari_domain>.com/conda-store` and having a look at the build status of the missing environment.

The reason for this issue is due to how these environments are simultaneously built. Under the hood, Conda store relies on Mamba/Conda to resolve and download the specific packages listed in the environment YAML. If they both environment builds try to download the same package with different versions, the build that started first will have their package overwritten by the second build. This causes the first build to fail.

To resolve this issue, navigate to `<your_nebari_domain>.com/conda-store`, find the environment build that failed and trigger it to re-build.

If you are using Dask, you will need to include [QHub Dask metapackage](https://github.com/conda-forge/qhub-dask-feedstock) to maintain version compatibility between the Dask client and server. Example: `qhub-dask==0.5.0.dev27+g58870fc`. This replaces distributed, dask, and dask-gateway with the correct pinned versions.

Additionally, environment, even global ones, created from the `/conda-store` user interface cannot be used when running dashboards via the CDSDashboard interface. Users can use only those environments added via the `nebari-config.yaml` during deployment.
