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

- No integration with the local Nebari file system, besides the notebook or script itself
- The need to specify an image which contains all your required packages and libraries
  - `conda-store` built images are perfectly suited to solve this issue
- No artifact management
  - If you need to save the output, make sure to save it to cloud storage, a hosted git repo, etc.

## Initial configuration

Your Nebari platform comes with `kbatch`, and all the necessary back-end components, pre-enabled. Consult your platform administrator or your `nebari-config.yaml` if you are unsure. Or you can create another `conda` env using `conda-store` and add `kbatch` to it.

:::note

- `kbatch` is only available on Nebari version `0.4.3` and greater (including all CalVer releases)
- It is currently only available on `pip`, not `conda`
- It requires Python 3.9 or greater

:::

### JupyterHub API token

Before we get started, we'll need to generate a JupyterHub API token.

From your JupyterHub Control Panel (File -> Hub Control Panel), click on the `Token` tab in the header.

API tokens can be created to allow full access to the JupyterHub API using your authorization. These are what allows `kbatch` to have the authority to spawn jobs on the cluster.

Give your API token a reasonable name and click `Request new API token`. The API Token will be shown on the screen, please copy this and store it safely.

### `kbatch configure`

Now back inside of Jupyter, open up a new terminal. Activate the `conda` environment which has `kbatch` installed. By default, `kbatch` is installed in the `nebari-git-dask` conda environment for those looking to get started quickly.

```bash
conda activate <conda-env>
```

For JupyterHub to authenticate your future `kbatch` requests, you will need to perform a one time configuration setup. For more details, [visit the `kbatch` documentation](https://kbatch.readthedocs.io/en/latest/#configure-with-jupyterhub-deployment).

This one-time setup command is listed below, and requires two arguments:

- `--token`: the `JUPYTERHUB_API_TOKEN` generated in the previous step from `https://<nebari_domain>/hub/token`
- `--kbatch-url`: copy this exact URL (specific to Nebari deployments)
  - `http://kbatch-kbatch-proxy.dev.svc.cluster.local`

Once completed, you should see a confirmation message that shows where this config file was saved:

```shell
$ kbatch configure --token <JUPYTERHUB_API_TOKEN> \
  --kbatch-url http://kbatch-kbatch-proxy.dev.svc.cluster.local

Wrote config to /home/<username>/.config/kbatch/config.json
```

## Submit a small job

When submitting a job to `kbatch`, there are a handful of required arguments you will need to provide.
These arguments can be passed directly from the command-line, or you can create a configuration file and pass that to `kbatch`.

For more details on how to use `kbatch` please refer to [the `kbatch` documentation page](https://kbatch.readthedocs.io/en/latest/user-guide.html).

To submit a job, you will need to specify:

- `name` - give your job a name.
- `image` - specify the container image used to run your job.
  - this should include all the packages and libraries needed to run your job.
- `command` - the command to run the job.
- `code` - (optional) files or notebooks which will be used by the job.

To start, we'll submit a very small job that just runs `ls -lh` for us.

`kbatch job submit --name=list-files --image=alpine --command='["ls", "-lh"]'`

We have given it the name "list-files" and have requested that it run on the
`alpine` docker image. When you submit this job, the default output is a
summary of the job in JSON format. While you might be interested in all those
details, most of us would prefer a simpler format.

<details>
<summary> For those interested in those details </summary>

Here is the full default output from submitting the job above:

```
{
  "api_version": "batch/v1",
  "kind": "Job",
  "metadata": {
    "annotations": {
      "kbatch.jupyter.org/username": "<user email>"
    },
    "cluster_name": null,
    "creation_timestamp": "2023-01-24T17:48:24+00:00",
    "deletion_grace_period_seconds": null,
    "deletion_timestamp": null,
    "finalizers": null,
    "generate_name": "list-files-",
    "generation": 1,
    "labels": {
      "kbatch.jupyter.org/username": "<user email>"
    },
    "managed_fields": [
      {
        "api_version": "batch/v1",
        "fields_type": "FieldsV1",
        "fields_v1": {
          "f:metadata": {
            "f:annotations": {
              ".": {},
              "f:kbatch.jupyter.org/username": {}
            },
            "f:generateName": {},
            "f:labels": {
              ".": {},
              "f:kbatch.jupyter.org/username": {}
            }
          },
          "f:spec": {
            "f:backoffLimit": {},
            "f:completionMode": {},
            "f:completions": {},
            "f:parallelism": {},
            "f:suspend": {},
            "f:template": {
              "f:metadata": {
                "f:annotations": {
                  ".": {},
                  "f:kbatch.jupyter.org/username": {}
                },
                "f:labels": {
                  ".": {},
                  "f:kbatch.jupyter.org/username": {}
                },
                "f:name": {},
                "f:namespace": {}
              },
              "f:spec": {
                "f:containers": {
                  "k:{\"name\":\"job\"}": {
                    ".": {},
                    "f:command": {},
                    "f:env": {
                      ".": {},
                      "k:{\"name\":\"DASK_GATEWAY__ADDRESS\"}": {
                        ".": {},
                        "f:name": {},
                        "f:value": {}
                      },
                      "k:{\"name\":\"DASK_GATEWAY__AUTH__TYPE\"}": {
                        ".": {},
                        "f:name": {},
                        "f:value": {}
                      },
                      "k:{\"name\":\"DASK_GATEWAY__CLUSTER__OPTIONS__IMAGE\"}": {
                        ".": {},
                        "f:name": {},
                        "f:value": {}
                      },
                      "k:{\"name\":\"DASK_GATEWAY__PROXY_ADDRESS\"}": {
                        ".": {},
                        "f:name": {},
                        "f:value": {}
                      },
                      "k:{\"name\":\"JUPYTERHUB_API_TOKEN\"}": {
                        ".": {},
                        "f:name": {},
                        "f:value": {}
                      },
                      "k:{\"name\":\"JUPYTER_IMAGE\"}": {
                        ".": {},
                        "f:name": {},
                        "f:value": {}
                      },
                      "k:{\"name\":\"JUPYTER_IMAGE_SPEC\"}": {
                        ".": {},
                        "f:name": {},
                        "f:value": {}
                      }
                    },
                    "f:image": {},
                    "f:imagePullPolicy": {},
                    "f:name": {},
                    "f:resources": {},
                    "f:terminationMessagePath": {},
                    "f:terminationMessagePolicy": {},
                    "f:workingDir": {}
                  }
                },
                "f:dnsPolicy": {},
                "f:restartPolicy": {},
                "f:schedulerName": {},
                "f:securityContext": {},
                "f:terminationGracePeriodSeconds": {}
              }
            },
            "f:ttlSecondsAfterFinished": {}
          }
        },
        "manager": "OpenAPI-Generator",
        "operation": "Update",
        "subresource": null,
        "time": "2023-01-24T17:48:24+00:00"
      }
    ],
    "name": "list-files-8wcm2",
    "namespace": "<user email>",
    "owner_references": null,
    "resource_version": "62765191",
    "self_link": null,
    "uid": "86875da1-17a0-4f6b-b5bb-2c778104dc31"
  },
  "spec": {
    "active_deadline_seconds": null,
    "backoff_limit": 0,
    "completion_mode": "NonIndexed",
    "completions": 1,
    "manual_selector": null,
    "parallelism": 1,
    "selector": {
      "match_expressions": null,
      "match_labels": {
        "controller-uid": "86875da1-17a0-4f6b-b5bb-2c778104dc31"
      }
    },
    "suspend": false,
    "template": {
      "metadata": {
        "annotations": {
          "kbatch.jupyter.org/username": "<user email>"
        },
        "cluster_name": null,
        "creation_timestamp": null,
        "deletion_grace_period_seconds": null,
        "deletion_timestamp": null,
        "finalizers": null,
        "generate_name": null,
        "generation": null,
        "labels": {
          "controller-uid": "86875da1-17a0-4f6b-b5bb-2c778104dc31",
          "job-name": "list-files-8wcm2",
          "kbatch.jupyter.org/username": "<user email>"
        },
        "managed_fields": null,
        "name": "list-files-pod",
        "namespace": "<user email>",
        "owner_references": null,
        "resource_version": null,
        "self_link": null,
        "uid": null
      },
      "spec": {
        "active_deadline_seconds": null,
        "affinity": null,
        "automount_service_account_token": null,
        "containers": [
          {
            "args": null,
            "command": [
              "ls",
              "-lh"
            ],
            "env": [
              {
                "name": "DASK_GATEWAY__ADDRESS",
                "value": "http://nebari-dask-gateway-gateway-api.dev:8000",
                "value_from": null
              },
              {
                "name": "DASK_GATEWAY__AUTH__TYPE",
                "value": "jupyterhub",
                "value_from": null
              },
              {
                "name": "DASK_GATEWAY__CLUSTER__OPTIONS__IMAGE",
                "value": "quay.io/nebari/nebari-dask-worker:2022.11.1",
                "value_from": null
              },
              {
                "name": "DASK_GATEWAY__PROXY_ADDRESS",
                "value": "tcp://nebari.quansight.dev:8786",
                "value_from": null
              },
              {
                "name": "JUPYTER_IMAGE",
                "value": "alpine",
                "value_from": null
              },
              {
                "name": "JUPYTER_IMAGE_SPEC",
                "value": "alpine",
                "value_from": null
              },
              {
                "name": "JUPYTERHUB_API_TOKEN",
                "value": "8de64debb16a48c1b7a83cd01aad1abe",
                "value_from": null
              }
            ],
            "env_from": null,
            "image": "alpine",
            "image_pull_policy": "Always",
            "lifecycle": null,
            "liveness_probe": null,
            "name": "job",
            "ports": null,
            "readiness_probe": null,
            "resources": {
              "limits": null,
              "requests": null
            },
            "security_context": null,
            "startup_probe": null,
            "stdin": null,
            "stdin_once": null,
            "termination_message_path": "/dev/termination-log",
            "termination_message_policy": "File",
            "tty": null,
            "volume_devices": null,
            "volume_mounts": null,
            "working_dir": "/code"
          }
        ],
        "dns_config": null,
        "dns_policy": "ClusterFirst",
        "enable_service_links": null,
        "ephemeral_containers": null,
        "host_aliases": null,
        "host_ipc": null,
        "host_network": null,
        "host_pid": null,
        "hostname": null,
        "image_pull_secrets": null,
        "init_containers": null,
        "node_name": null,
        "node_selector": null,
        "os": null,
        "overhead": null,
        "preemption_policy": null,
        "priority": null,
        "priority_class_name": null,
        "readiness_gates": null,
        "restart_policy": "Never",
        "runtime_class_name": null,
        "scheduler_name": "default-scheduler",
        "security_context": {
          "fs_group": null,
          "fs_group_change_policy": null,
          "run_as_group": null,
          "run_as_non_root": null,
          "run_as_user": null,
          "se_linux_options": null,
          "seccomp_profile": null,
          "supplemental_groups": null,
          "sysctls": null,
          "windows_options": null
        },
        "service_account": null,
        "service_account_name": null,
        "set_hostname_as_fqdn": null,
        "share_process_namespace": null,
        "subdomain": null,
        "termination_grace_period_seconds": 30,
        "tolerations": null,
        "topology_spread_constraints": null,
        "volumes": null
      }
    },
    "ttl_seconds_after_finished": 3600
  },
  "status": {
    "active": null,
    "completed_indexes": null,
    "completion_time": null,
    "conditions": null,
    "failed": null,
    "ready": null,
    "start_time": null,
    "succeeded": null,
    "uncounted_terminated_pods": null
  }
}
```

</details>

Let's get a summary of all our jobs listed in table format.

```shell
$ kbatch job list --output table

                          Jobs
┏━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━┓
┃ job name         ┃ submitted                 ┃ status ┃ duration ┃
┡━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━┩
│ list-files-8wcm2 │ 2023-01-24T17:48:24+00:00 │ done   │ 0:00:04  │
└──────────────────┴───────────────────────────┴────────┴──────────┘
```

Much better! Now we can see that our job has been given some extra digits to
ensure that its unique. We also see that when it was submitted, it's current
status, and how long it ran for or the current duration.

While we're here, let's also check out the pods on which our job ran.

```bash
$ kbatch pod list --output table
                               Pods
┏━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━┓
┃ pod name               ┃ submitted                 ┃ status    ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━┩
│ list-files-8wcm2-tpqlc │ 2023-01-24T17:48:24+00:00 │ Succeeded │
└────────────────────────┴───────────────────────────┴───────────┘
```

## Submit a batch notebook job

Now let's take things a step further and submit an actual batch job using
parameterized notebooks. For this example, we'll use
[`papermill`](https://papermill.readthedocs.io/en/latest/) to spawn our job.
For this example, we'll need a docker image that includes `papermill`.

First, create a new notebook and name it "kbatch-nb.ipynb". In a cell, add the
following:

```python
import time
with open('kbatch_nb_output.txt', 'w') as f:
    for i in range(0,10):
        current_time = time.strftime("%Y-%m-%d-%H:%M:%S", time.localtime())
        time.sleep(1)
        f.write(f'{current_time}: {i}\n')
```

It worth noting here that `kbatch` doesn't use Nebari's mounted NFS which means
that the file we're creating will only exist on our ephemeral `kbatch` pod.
We've shown the above as an example, but to truly test this, you should write
to an S3 bucket to see the file being generated.

Next move over to a terminal and submit the notebook as a job. Not only do we
need to tell kbatch what command we want to run, we need to tell it where the
code lives (i.e. the files that go along with our job).

```bash
kbatch job submit \
  --name="my-job" \
  --image="mcr.microsoft.com/planetary-computer/python:latest" \
  --command='["papermill", "kbatch-nb.ipynb"]' \
  --code="kbatch-nb.ipynb"
```

kbatch job submit --name="my-job" --image="mcr.microsoft.com/planetary-computer/python:latest" --command='["papermill", "kbatch-nb.ipynb"]' --code="./kbatch-nb.ipynb"

Now we can check the job list and see that our papermill job is active. We also
see that our previous job is still listed. The old jobs will remain listed for
some time.

```bash
$ kbatch job list --output table
                                Jobs
┏━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━┓
┃ job name         ┃ submitted                 ┃ status ┃ duration ┃
┡━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━┩
│ list-files-8wcm2 │ 2023-01-24T17:48:24+00:00 │ done   │ 0:00:04  │
│ my-job-8ggbb     │ 2023-01-24T18:30:07+00:00 │ active │ 0:00:15  │
└──────────────────┴───────────────────────────┴────────┴──────────┘
```

This job will take around 2 minutes to run. While the job is running and for a
short duration after, you can check the pod logs. This is where you will look
for errors if your job fails or hangs.

```bash
$ kbatch pod list --output table
                               Pods
┏━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━┓
┃ pod name               ┃ submitted                 ┃ status    ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━┩
│ list-files-8wcm2-tpqlc │ 2023-01-24T17:48:24+00:00 │ Succeeded │
│ my-job-8ggbb-h4gw5     │ 2023-01-24T18:30:07+00:00 │ Succeeded │
└────────────────────────┴───────────────────────────┴───────────┘
$ kbatch pod logs my-job-8ggbb-h4gw5
```

## Use a yaml configuration file

Alternatively, all of these command line arguments can be consolidated into one configuration file. Let's run something with Dask!

First, let's create a python file to run:

```python
"""
Start a cluster with Dask Gateway, print the dashboard link, and run some tasks.
"""
import dask
import dask_gateway
import distributed
from distributed import wait


def inc(x):
    return x + 1


def main():
    print(f"dask version         = {dask.__version__}")
    print(f"dask_gateway version = {dask_gateway.__version__}")
    print(f"distributed version  = {distributed.__version__}")

    gateway = dask_gateway.Gateway()
    options = gateway.cluster_options(use_local_defaults=False)

    print("Starting cluster")
    cluster = gateway.new_cluster(options)
    client = cluster.get_client()
    print("Dashboard at:", client.dashboard_link)

    cluster.scale(2)

    futures = client.map(inc, list(range(100)))
    _ = wait(futures)

    print("Closing cluster")
    cluster.close()


if __name__ == "__main__":
    main()
```

Note that we've included print statements here. This is a file that can reused
in many situations, but for this example, the print statement will print to
stdout on the _pod_ which we won't actually be able to see.

Next, let's set up a yaml file with our `kbatch` job configuration.

```yml title="Sample kbatch configuration yaml file"
name: dask-gateway-job
image: mcr.microsoft.com/planetary-computer/python:2021.08.02.0
args:
  - python
  - kbatch_dask_gateway.py
code: kbatch_dask_gateway.py
```

If the above YAML configuration file is saved as `my-job.yaml`, then it can be
submitted with the following command:

```bash
kbatch job submit -f my-job.yaml
```

Again, we can check statuses by running:

```bash
kbatch job list --output table
kbatch pod list --output table
```

## Submit a cronjob

What if you wanted to submit a job to run a schedule, for example, to run once a week? This is where `kbatch cronjob` comes in handy and luckily the interface is almost exactly the same. The only difference between `job` and `cronjob` is that the latter requires you to specify a `schedule`.

```yml title="Sample kbatch configuration yaml file with schedule"
name: "my-cronjob"
image: mcr.microsoft.com/planetary-computer/python:2021.08.02.0
args:
  - python
  - kbatch_dask_gateway.py
code: kbatch_dask_gateway.py
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

:::warning
It's important to remember that you are responsible for deleting cronjobs. If left unchecked, they will continue to run indefinitely.
:::

## **Command Cheat Sheet**

The TLDR; for folks returning here for a quick snapshot:

| Bash command                                                                 | Description             |
| ---------------------------------------------------------------------------- | ----------------------- |
| kbatch job submit --name=list-files --image=alpine --command='["ls", "-lh"]' | Submit a new job        |
| kbatch job list --output table                                               | List status of all jobs |
| kbatch pod list --output table                                               | List status all pods    |
| kbatch pod logs my-job-qsf7d-rgh5v                                           | Get logs for given pod  |
| kbatch job delete mycj-cron-kb7d6                                            | Delete a job            |
| kbatch cronjob delete myj-reg-hd4j1                                          | Delete a cronjob        |
