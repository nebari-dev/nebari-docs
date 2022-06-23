---
id: dask-nebari-setup
title: Configuring Dask on Nebari
---

# Introduction to Dask

Working with large datasets could pose computation challenges, running into frequent memory issues is one.

Dask is a free and open-source library for parallel computing in Python, which 
helps in scaling up the data science workflows leveraging efficient computation
techniques.

# Nebari & Dask integration

Nebari uses [dask-gateway](https://gateway.dask.org/) to expose auto-scaling compute clusters automatically configured for the user.

Dask Gateway provides a secure way to managing dask clusters. We will discuss in detail the pre-defined configuration in later sections of this tutorial.

# Diving deeper into dask-gateway configuration 

### Dask Gateway components:

- `address` : is the rest API that dask-gateway exposes for managing clusters
- `proxy_address` : is a secure TLS connection to a user defined dask scheduler
- `auth` is the form of authentication used, which should always be jupyterhub for Nebari

Nebari already has the connection information pre-configured for the user. 
In order to view configuration details run the below command: 

- using terminal : `cat /etc/dask/gateway.yaml` 
- using notebook: `! cat /etc/dask/gateway.yaml`

<details>
<summary> Click to view sample output </summary>

```shell
{"gateway":{"address":"http://qhub-dask-gateway-gateway-api.dev:8000","auth":{"type":"jupyterhub"},"proxy_address":"tcp://quansight.qhub.dev:8786","public_address":"https://quansight.qhub.dev/gateway"}}
```
</details>

### Starting a dask cluster on Nebari

We will start by creating a Jupyter notebook with name of your choice. Select `dask` environment from the select kernel dropdown (located on the top right)

Nebari has set of pre-defined options for configuring the dask profiles that we have access to. These can be accessed via Dask Gateway options. 
<details>
<summary> Click to view dask profile options for Nebari </summary>

```python
profiles:
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
</details>

```python
from dask_gateway import Gateway
gateway = Gateway()

options = gateway.cluster_options()
options
```

Once the `ipywidget` shows up we can customise as per our requirement.

![Cluster Options](/img/cluster_options.png)

:::note
It’s important that the environment used for your notebook matches the dask worker environment.
:::

