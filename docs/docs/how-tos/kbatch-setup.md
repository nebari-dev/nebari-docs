---
id: kbatch-setup
title: How to setup kbatch
---

# How to: setup `kbatch`

## Introduction

The ability to run a notebook or a script from within the QHub terminal is now possible with the addition of [`kbatch`](https://github.com/kbatch-dev/kbatch). `kbatch` is a small project that let's the user submit jobs or cronjobs to the kubernetes API. Or in other words, this CLI tool allows a user to submit their notebook or script to run in a "headless" manner. 

The idea of batch jobs is useful in situations where you need no human interaction, besides submitting it as a job, and the results can be efficiently saved to the cloud or other similar storage locations. Batch jobs can also be submitted to run on a schedule, these are known as cronjobs, more on `kbatch cronjob` below.

There are a few known limitations at the moment, these include:
- no integration with the local QHub filesystem, besides the notebook or script itself
- the need to specify an image which contains all your required packages and libraries
    - `conda-store` built images are perfectly suited to solve this issue
- no artifact management
    - if you need to save the output, make sure to save it to cloud storage, a hosted git repos, etc.


## Initial configuration

Your QHub platform comes with `kbatch`, and all the necessary back-end components, pre-enabled. Consult your platform administrator or your `qhub-config.yaml` if you are unsure. Or you can create another conda env using `conda-store` and add `kbatch` to it.

> NOTE: `kbatch` is available on QHub version `0.4.3` and greater. 

> NOTE: `kbatch` is currently only available on `pip`, not `conda`.


### `kbatch configure`

From the terminal, activate the `conda` environment which has `kbatch` installed. By default, `kbatch` is installed in the `dask` `conda` environment for those looking to get started quickly.

```shell
$ conda activate <conda-env>
```

> NOTE: `kbatch` requires Python 3.9 or greater to work. 

In order for JupyterHub to authenticate your future `kbatch` requests, you will need to perform a one time configuration setup. For more details, [visit the `kbatch` documentation](https://kbatch.readthedocs.io/en/latest/#configure-with-jupyterhub-deployment).

This one-time setup command is listed below, and requires two argumentsL
- `--token`: generate a `JUPYTERHUB_API_TOKEN` from your `https://<qhub_domain>/hub/token`
- `--kbatch-url`: copy this exact URL (specific to QHub deployments)
    - `http://kbatch-kbatch-proxy.dev.svc.cluster.local`

> NOTE: You should see confirmation message that shows where this config file was saved.

```shell
$ kbatch configure --token <JUPYTERHUB_API_TOKEN> --kbatch-url http://kbatch-kbatch-proxy.dev.svc.cluster.local
Wrote config to /home/<username>/.config/kbatch/config.json
```

## Submit a job

When submitting a job to `kbatch`, there are a handful of required arguments. These arguments can be passed directly from the command-line or, you can create a configuration file and pass that to `kbatch`. 

For more details on how to use `kbatch` please refer to [their documentation page](https://kbatch.readthedocs.io/en/latest/user-guide.html).

To submit a job, you will need to specify:
- `--name` - give your job a name.
- `--image` - specify the container image used to run your job.
  - this should include all the packages and libraries you need.
- `--command` - the command that will start the job.
- `--code` - (optional) the path to the file or notebook used by the job.
  - necessary if trying to specify a particular notebook or script.

> NOTE: If trying to submit a notebook as a job, the `command` would be something like `--command="['papermill', 'my-nb.ipynb']"`, where [`papermill`](https://papermill.readthedocs.io/en/latest/) is a tool for parameterizing and executing Jupyter notebooks and should be in your `image`. 

```shell
$ kbatch job submit \
  --name="my-job" \
  --image="ghcr.io/iameskild/my-image:latest" \
  --command="['papermill', 'my-nb.ipynb']" \
  --code="./my-job.ipynb"
```

This should output a Kubernetes manifest (or resource specification) for the job being submitted.

All of these command line arguments can be consolidated into one configuration file.

```yml
name: my-job
image: "ghcr.io/iameskild/my-image:latest"
command:
  - papermill
  - my-nb.ipynb
code: my-nb.ipynb
```

If the above YAML configuration file is saved as `my-job.yaml`, then it can be submitted with the following command to produce the same effect as above.

```shell
$ kbatch job submit -f my-job.yaml
```

This job will now be run without any direct feedback to the user. However if you're interested in checking the status of your job, you can list the running jobs as follows.

```shell
$ kbatch job list --output table
                          Jobs
┏━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━┓
┃ name             ┃ submitted                 ┃ status ┃
┡━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━┩
│ my-job-jfprp     │ 2022-07-01T15:07:49+00:00 │ done   │
└──────────────────┴───────────────────────────┴────────┘
```


## Submit a cronjob

Now what if you want to submit a job to run a schedule, for example you want a job to run once a week? This is where `kbatch cronjob` comes in handy. 

The only difference between `job` and `cronjob` is that the latter requires you to specify a `schedule`. 

```yml
name: my-cronjob
image: "ghcr.io/iameskild/my-image:latest"
command:
  - papermill
  - my-nb.ipynb
code: my-nb.ipynb
schedule: "0 2 * * 7*
```

The same job that we submitted above now can be submitted to run on a schedule. A cron schedule of `0 2 * * 7` means the job will run once every Sunday at 2:00AM. 

```shell
$ kbatch cronjob submit -f my-cronjob.yaml
```

As with jobs, cronjobs can be listed.

```shell
$ kbatch cronjob list --output table
                          CronJobs
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┓
┃ cronjob name          ┃ started                   ┃ schedule     ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━┩
│ my-cronjob-cron-kb7d6 │ 2022-05-31T05:27:25+00:00 │ 0 2 * * 7    │
└───────────────────────┴───────────────────────────┴──────────────┘
```

This job will now run on the schedule specified and will continue to run indefinitely. The only way to stop this cronjob is to delete it.

```shell
$ kbatch cronjob delete my-cronjob-cron-kb7d6
```

> NOTE: It's important to remember that you are responsible for deleting cronjobs. If left unchecked, they will continue to run indefinitely.