---
id: dask-nebari-setup
title: Configuring Dask on Nebari
---

# Introduction to Dask

Working with large datasets can pose a few challenges, running into frequent memory issues is one. [Dask](https://docs.dask.org/en/stable/) is a free and `open-source` library for `parallel computing` in Python,
enabling data scientist and others to use their favorite PyData tools at scale.

### Nebari & Dask integration

Nebari uses [dask-gateway](https://gateway.dask.org/) to expose auto-scaling compute clusters automatically configured for the user,
and provides a secure way to managing dask clusters. We will discuss in detail the pre-defined configuration in later sections of this tutorial.

### Dask Gateway components:

- `address` : is the rest API that dask-gateway exposes for managing clusters
- `proxy_address` : is a secure TLS connection to a user defined dask scheduler
- `auth` : is the form of authentication used, which should always be jupyterhub for Nebari

Nebari already has the connection information pre-configured for the user.
In order to view configuration details run the below command:

- from the terminal : `cat /etc/dask/gateway.yaml`
- within a notebook: `! cat /etc/dask/gateway.yaml`

<details>
<summary> Click to view: Sample output </summary>

```shell
{"gateway":{"address":"http://qhub-dask-gateway-gateway-api.dev:8000","auth":{"type":"jupyterhub"},"proxy_address":"tcp://quansight.qhub.dev:8786","public_address":"https://quansight.qhub.dev/gateway"}}
```

</details>

### Starting a dask cluster on Nebari

We will start by creating a Jupyter notebook with name of your choice. Select `dask` environment from the select kernel dropdown (located on the top right)

Nebari has set of pre-defined options for configuring the dask profiles that we have access to. These can be accessed via Dask Gateway options.

<details>
<summary> Click to view: Dask profile options for Nebari </summary>

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

**Accessing cluster options**

```python
from dask_gateway import Gateway
gateway = Gateway()

options = gateway.cluster_options()
options
```

Once the `ipywidget` shows up, we can customize our cluster.

![Cluster Options](/img/cluster_options.png)

:::note
It’s important that the environment used for your notebook matches the dask worker environment.
:::

**Creating a dask cluster**

```python
cluster = gateway.new_cluster(options)
cluster
```

We have the option to choose between `manual` scaling and `adaptive` scaling, any existing benchmarking analysis would be
useful here to decide the right set of configuration.
Starting with the lowest possible configuration could be another helpful strategy.

![Creating a Cluster](/img/cluster_creation.png)

<details>
<summary> Click on the dashboard URL to view Dask UI: Sample info </summary>

![Dask UI resource utilisation](/img/dask_UI.png)

</details>

**Calling dask client to get started**

```python

client = cluster.get_client()
client
```

<details>
<summary> Click to view sample output: Dask client </summary>

![dask client](/img/dask_client.png)

</details>

**Fun part, let's code with dask**

```python
import dask.array as da
x = da.random.random((10000, 10000), chunks=(1000, 1000))
y = x + x.T
z = y[::2, 5000:].mean(axis=1)
z.compute()
```

<details>
<summary> Click to view sample output: Dask compute </summary>

```shell
array([0.99628925, 0.99659686, 1.00412466, ..., 0.99887597, 1.00219302,
       1.0027488 ])
```

</details>

### Dask diagnostic UI

![dask diagnostic UI](/img/dask_diagostic_UI.png)

### Dask-labextension

[Dask-labextension](https://github.com/dask/dask-labextension) provides a JupyterLab extension to manage Dask clusters,
as well as embed Dask's dashboard plots directly into JupyterLab panes.
Nebari is pre-configured with the extension, elevating the overall developer experience.

![Dask-labextension](/img/dask_labextension.png)

:::note Recommendation
Wrapping the dask-gateway in a context manager (code below), is a great way to avoid having to write a ton of boilerplate,
and comes with an added benefit that it ensures the cluster is fully shutdown once the task is complete.

<details>
<summary> Click to view sample code: Dask context manager configuration </summary>

```python
import os
import time
import dask.array as da
from contextlib import contextmanager

import dask
from distributed import Client
from dask_gateway import Gateway

@contextmanager
def dask_cluster(n_workers=2, worker_type="Small Worker", conda_env="filesystem/dask"):
    try:
        gateway = Gateway()
        options = gateway.cluster_options()
        options.conda_environment = conda_env
        options.profile = worker_type
        print(f"Gateway: {gateway}")
        for key, value in options.items():
            print(f"{key} : {value}")

        cluster = gateway.new_cluster(options)
        client = Client(cluster)
        if os.getenv("JUPYTERHUB_SERVICE_PREFIX"):
            print(cluster.dashboard_link)

        cluster.scale(n_workers)
        client.wait_for_workers(1)

        yield client

    finally:
        cluster.close()
        client.close()
        del client
        del cluster

with dask_cluster() as client:
    x = da.random.random((10000, 10000), chunks=(1000, 1000))
    y = x + x.T
    z = y[::2, 5000:].mean(axis=1)
    result = z.compute()
    print(client.run(os.getpid))
```

</details>
:::

### Conclusion

Kudos ✨, we now have a working dask cluster inside Nebari.
Excellent to get started with those large datasets.
