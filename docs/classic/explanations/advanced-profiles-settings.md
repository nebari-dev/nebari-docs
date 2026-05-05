---
title: Configure profiles
id: profile-configuration
description: Customize JupyterLab and Dask environments.
---

# Configure profiles

Profiles are used to control the JupyterLab user instances and Dask workers provided by Dask Gateway.

## JupyterLab profiles

```yaml
### JupyterLab Profiles ###
profiles:
  jupyterlab:
    - display_name: Small Instance
      description: Stable environment with 2 cpu / 8 GB ram
      access: all
      default: true
      profile_options:  # optional
        image:
          display_name: Image
          choices:
            default:
              display_name: nebari-jupyterlab:latest
              default: true
              kubespawner_override:
                image: quay.io/nebari/nebari-jupyterlab:latest
            custom:
              display_name: my-custom-image:mytag
              kubespawner_override:
                image: <my-container-registry>/myOrg/my-custom-image:mytag
      kubespawner_override:
        cpu_limit: 2
        cpu_guarantee: 1.5
        mem_limit: 8G
        mem_guarantee: 6G
    - display_name: Medium Instance
    ...
```

![Default profiles showing small, medium, and large instances](/img/explanations/profiles-server-options.png)

Each profile under `jupyterlab` is a named JupyterLab profile.

`display_name` is the name of the profile that will be displayed to users.

`description` is a description of the profile that will be displayed to users.

`profile_options` makes it possible to set various sub-options per profile. See the [Kubespawner docs](https://jupyterhub-kubespawner.readthedocs.io/en/latest/spawner.html#kubespawner.KubeSpawner.profile_list) for more info.

`kubespawner_override` field to define behavior as per the [KubeSpawner](https://jupyterhub-kubespawner.readthedocs.io/en/latest/spawner.html) API.

It is possible to control which users have access to which JupyterLab profiles. Each profile has a field named `access` which can be set to `all` (default if omitted), `yaml`, or
`keycloak`.

- `all` means every user will have access to the profile (default).
- `yaml` means that access is restricted to anyone with their username in the `users` field of the profile or who belongs to a group named in the `groups` field.
- `keycloak` means that access is restricted to any user who in Keycloak has either their group(s) or user with the attribute `jupyterlab_profiles` containing this profile name. For
  example, if the user is in a Keycloak group named `developers` which has an attribute `jupyterlab_profiles` set to `Large Instance`, they will have access to the Large Instance
  profile. To specify multiple profiles for one group (or user) delimit their names using `##` - for example, `Large Instance##Another Instance`.

When configuring the memory and CPUs for profiles, there are some important considerations to make. Two important terms to understand are:

- `limit`: the absolute max memory that a given pod can consume. If a process within the pod consumes more than the `limit` memory the Linux OS will kill the process. Limit is not
  used for scheduling purposes with kubernetes.
- `guarantee`: is the amount of memory the kubernetes scheduler uses to place a given pod. In general the `guarantee` will be less than the limit. Often times the node itself has
  less available memory than the node specification. See this [guide from digital ocean](https://docs.digitalocean.com/products/kubernetes/details/limits/#allocatable-memory) which is generally
  applicable to other clouds.

For example if a node has 8 GB of ram and 2 CPUs you should guarantee/schedule roughly 75% and follow the digital ocean guide linked above, e.g. 1.5 CPU guaranteed and 5.5 GB guaranteed.

### JupyterLab Profile Node Selectors

A common operation is to target jupyterlab profiles to specific node labels. In order to target a specific node groups add the following.
This example shows a GKE node groups with name `user-large`.
Other cloud providers will have different node labels.

```yaml
### JupyterLab Profiles ###
profiles:
  jupyterlab:
    - display_name: Small Instance
      ...
      kubespawner_override:
        ...
        node_selector:
          "cloud.google.com/gke-nodepool": "user-large"
        ...
```

### Specifying GPU/Accelerator Requirements

If you want to ensure that you have GPU resources use the following annotations.

```yaml
### JupyterLab Profiles ###
profiles:
  jupyterlab:
    - display_name: Small Instance
      ...
      kubespawner_override:
        ...
        extra_resource_limits:
          nvidia.com/gpu: 1
        ...
```

## Dask profiles

Finally, we allow for configuration of the Dask workers. In general, similar to the JupyterLab instances you only need to configure the cores and memory.

```yaml
### Dask Profiles ###
profiles:
  ...
  dask_worker:
    "Small Worker":
      worker_cores_limit: 1
      worker_cores: 1
      worker_memory_limit: 1G
      worker_memory: 1G
    "Medium Worker":
      worker_cores_limit: 1.5
      worker_cores: 1.25
      worker_memory_limit: 2G
      worker_memory: 2G
```

### Dask Scheduler

In a few instances, the Dask worker node-group might be running on quite a large instance, perhaps with 8 CPUs and 32 GB of memory (or more). When this is the case, you might also
want to increase the resource levels associated with the Dask Scheduler.

```yaml
### Dask Profiles ###
profiles:
  ...
  dask_worker:
      "Huge Worker":
        worker_cores_limit: 7
        worker_cores: 6
        worker_memory_limit: 30G
        worker_memory: 28G
        scheduler_cores_limit: 7
        scheduler_cores: 6
        scheduler_memory_limit: 30G
        scheduler_memory: 28G
```
