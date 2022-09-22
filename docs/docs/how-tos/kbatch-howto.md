---
id: kbatch-howto
title: Submit batch jobs with kbatch
description: Using kbatch to submit batch jobs
---

# Submit batch jobs with `kbatch`

## Introduction

The ability to run a notebook or a script from within the Nebari terminal is now possible with the addition of [`kbatch`](https://github.com/kbatch-dev/kbatch). `kbatch` is a small project that enables the user submit jobs or cronjobs to the Kubernetes API. Or in other words, this CLI tool allows a user to submit their notebook or script to run in a "headless" manner.

The idea of batch jobs is useful in situations where you need no human interaction, besides submitting it as a job, and the results can be efficiently saved to the cloud or other similar storage locations. Batch jobs can also be submitted to run on a schedule, these are known as cronjobs, more on `kbatch cronjob` below.

There are a few known limitations at the moment, these include:

- No integration with the local Nebari filesystem, besides the notebook or script itself
- The need to specify an image which contains all your required packages and libraries
  - `conda-store` built images are perfectly suited to solve this issue
- No artifact management
  - If you need to save the output, make sure to save it to cloud storage, a hosted git repos, etc.

## Initial configuration

Your Nebari platform comes with `kbatch`, and all the necessary back-end components, pre-enabled. Consult your platform administrator or your `nebari-config.yaml` if you are unsure. Or you can create another `conda` env using `conda-store` and add `kbatch` to it.

:::note

- `kbatch` is available on Nebari version `0.4.3` and greater
- `kbatch` is currently only available on `pip`, not `conda`

:::

### `kbatch configure`

From the terminal, activate the `conda` environment which has `kbatch` installed. By default, `kbatch` is installed in the `dask` `conda` environment for those looking to get started quickly.

```bash
conda activate <conda-env>
```

:::note
`kbatch` requires Python 3.9 or greater to work.
:::

For JupyterHub to authenticate your future `kbatch` requests, you will need to perform a one time configuration setup. For more details, [visit the `kbatch` documentation](https://kbatch.readthedocs.io/en/latest/#configure-with-jupyterhub-deployment).

This one-time setup command is listed below, and requires two arguments:

- `--token`: generate a `JUPYTERHUB_API_TOKEN` from your `https://<nebari_domain>/hub/token`
- `--kbatch-url`: copy this exact URL (specific to Nebari deployments)
  - `http://kbatch-kbatch-proxy.dev.svc.cluster.local`

Once completed, you should see a confirmation message that shows where this config file was saved:

```shell
$ kbatch configure --token <JUPYTERHUB_API_TOKEN> \
  --kbatch-url http://kbatch-kbatch-proxy.dev.svc.cluster.local

Wrote config to /home/<username>/.config/kbatch/config.json
```

## Submit a job

When submitting a job to `kbatch`, there are a handful of required arguments you will need to provide.
These arguments can be passed directly from the command-line, or you can create a configuration file and pass that to `kbatch`.

For more details on how to use `kbatch` please refer to [the kbatch documentation page](https://kbatch.readthedocs.io/en/latest/user-guide.html).

To submit a job, you will need to specify:

- `name` - give your job a name.
- `image` - specify the container image used to run your job.
  - this should include all the packages and libraries needed to run your job.
- `command` - the command that will start the job.
- `code` - (optional) the path to the file or notebook used by the job.

:::note
If trying to submit a notebook as a job, the `command` would be something like `--command="['papermill', 'my-nb.ipynb']"`, where [`papermill`](https://papermill.readthedocs.io/en/latest/) is a tool for parameterizing and executing Jupyter notebooks and should be included in your `image`.
:::

```bash
kbatch job submit \
  --name="my-job" \
  --image="ghcr.io/username/my-image:latest" \
  --command="['papermill', 'my-nb.ipynb']" \
  --code="./my-job.ipynb"
```

This should output the full Job specification that was submitted to Kubernetes.

Alternatively, all of these command line arguments can be consolidated into one configuration file.

```yml title="Sample kbatch configuration yaml file"
name:" my-job"
image: "ghcr.io/username/my-image:latest"
command:
  - "papermill"
  - "my-nb.ipynb"
code: "my-nb.ipynb"
```

If the above YAML configuration file is saved as `my-job.yaml`, then it can be submitted with the following command to produce the same effect as above.

```bash
kbatch job submit -f my-job.yaml
```

This job will now run without any feedback to the user. However, if you're interested in checking the status of your job, you can list the recently submitted jobs as follows.

```shell
$ kbatch job list --output table

                          Jobs
┏━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━┓
┃ name             ┃ submitted                 ┃ status ┃
┡━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━┩
│ my-job-jfprp     │ 2022-07-01T15:07:49+00:00 │ done   │
└──────────────────┴───────────────────────────┴────────┘
```

## Submitting a cronjob

What if you wanted to submit a job to run a schedule, for example, to run once a week? This is where `kbatch cronjob` comes in handy and luckily the interface is almost exactly the same. The only difference between `job` and `cronjob` is that the latter requires you to specify a `schedule`.

```yml title="Sample kbatch configuration yaml file with schedule"
name: "my-cronjob"
image: "ghcr.io/username/my-image:latest"
command:
  - "papermill"
  - "my-nb.ipynb"
code: "my-nb.ipynb"
schedule: "0 2 * * 7*"
```

The same job that you submitted above now can be submitted to run on a schedule. A cron schedule of `0 2 * * 7` means the job will run once every `Sunday at 2:00AM`.

:::tip
You can check [crontab.guru](https://crontab.guru) which is a nifty tool that tries to translate the schedule syntax into plain English.
:::

```bash
kbatch cronjob submit -f my-cronjob.yaml
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

```bash
kbatch cronjob delete my-cronjob-cron-kb7d6
```

:::note
It's important to remember that you are responsible for deleting cronjobs. If left unchecked, they will continue to run indefinitely.
:::
