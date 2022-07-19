---
id: dask-nebari-config
title: Configure Dask on Nebari
---

# Introduction

In this tutorial we will dive into the `Nebari-Dask` configuration details. Nebari config is essentially
a `yaml` file which is at the heart of all things (most of them) related to configurations.
Our main focus in this tutorial will be the `profiles` & `dask_worker` section of the config file.

### Basic infrastructure details

Before we dive deeper in configuration details, let's understand about how are the core configuration
components.

### Core components:

- Dask-gateway
- dask workers
- Dask scheduler

### How to configure dask gateway profiles?

Nebari allows for the configuration of the Dask workers. Similar to the JupyterLab instances, you only need to configure the cores and memory.

When configuring the memory and CPUs for profiles, some important considerations exist. Two essential terms to understand are:

-  `limit` is the absolute max memory a given pod can consume. Suppose a process within the pod consumes more than the  `limit`  memory. In that case, the Linux OS will kill the process. `limit` is not used for scheduling purposes with Kubernetes.
    
-  `guarantee`: is the amount of memory the Kubernetes scheduler uses to place a given pod. In general, the `guarantee`  will be less than the limit. Often the node itself has less available memory than the node specification. See this  [guide from digital ocean](https://docs.digitalocean.com/products/kubernetes/#allocatable-memory), which generally applies to other clouds.

```python
jupyterlab:
    - display_name: Small Instance
      description: Stable environment with 1 cpu / 1 GB ram
      access: all
      default: true
      kubespawner_override:
        cpu_limit: 1
        cpu_guarantee: 1
        mem_limit: 1G
        mem_guarantee: 1G
    - display_name: Medium Instance
      description: Stable environment with 1.5 cpu / 2 GB ram
      access: yaml
      groups:
        - admin
        - developers
      users:
        - bob
      kubespawner_override:
        cpu_limit: 1.5
        cpu_guarantee: 1.25
        mem_limit: 2G
        mem_guarantee: 2G
    - display_name: Large Instance
      description: Stable environment with 2 cpu / 4 GB ram
      access: keycloak
      kubespawner_override:
        cpu_limit: 2
        cpu_guarantee: 2
        mem_limit: 4G
        mem_guarantee: 4G
```

### How to configure dask scheduler?

In a few instances, the dask worker node-group might be running on quite a large instance, perhaps with 8 CPUs and 32 GB of memory (or more). In this case, you might also want to increase the resource levels associated with the dask scheduler.

```python
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
