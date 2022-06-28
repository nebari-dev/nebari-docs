---
id: kbatch-setup
title: How to setup kbatch
---

# How to: setup `kbatch`

## Introduction
The ability to run a notebook or a script from within the QHub terminal (or from another notebook, i.e. like this one) is now possible with the addition of `kbatch`. `kbatch` is a small project that let's the user submit jobs or cronjobs to the kubernetes API. Or in other words, this CLI tool allows a user to submit their notebook or script to run in a "headless" manner. 

There are a few known limitations at the moment, these include:
- no integration with the local QHub filesystem, besides the notebook or script itself
- the need to specify an image which contains all your required packages and libraries
    - `conda-store` built images are perfectly suited to solve this issue
- no artifact management
    - if you need to save the output, make sure to save it to cloud storage, a hosted git repos, etc.


## Installation and initial configuration

Your QHub platform comes with `kbatch`, and all the necessary back-end components, pre-enabled. Consult your platform administrator or your `qhub-config.yaml` if you are unsure.

> NOTE: `kbatch` is available on QHub version `0.4.3` and greater. 

https://kbatch.readthedocs.io/en/latest/#configure-with-jupyterhub-deployment

### Install (optional)

The `kbatch` pip package is included by default in the `dask` conda environment but you can also `pip install` it as needed.

> NOTE: `kbatch` requires Python `3.9` or greater.

> NOTE: `kbatch` has not been packaged for conda/conda-forge.


To install run:

```shell
$ pip install kbatch
```

To verify install:
```shell
$ kbatch --version
...
kbatch, version 0.4.1
``` 

### Initial configuration (required)

In order for JupyterHub to authenticate your future `kbatch` requests, you will need to perform a one time configuration setup. For more details, [visit the `kbatch` documentation](https://kbatch.readthedocs.io/en/latest/#configure-with-jupyterhub-deployment).

This one-time setup command is listed below, and requires two argumentsL
- `--token`: generate a `JUPYTERHUB_API_TOKEN` from your `https://<qhub_domain>/hub/token`
- `--kbatch-url`: copy this exact URL (specific to QHub deployments)
    - `http://kbatch-kbatch-proxy.dev.svc.cluster.local`
    
> NOTE: You should see confirmation message that shows where this config file was 


```shell
$ kbatch configure --token <JUPYTERHUB_API_TOKEN> --kbatch-url http://kbatch-kbatch-proxy.dev.svc.cluster.local
Wrote config to /home/<username>/.config/kbatch/config.json
```
