---
id: dask-nebari-setup
title: Configuring Dask on Nebari
---

# Introduction to Dask

Working with large datasets can pose a few challenges, running into frequent memory issues is one. [Dask](https://docs.dask.org/en/stable/) is a free and `open-source` library for `parallel computing` in Python,
enabling data scientist and others to use their favorite PyData tools at scale.

### Nebari & Dask integration

Nebari uses [dask-gateway](https://gateway.dask.org/) to expose auto-scaling compute clusters automatically configured for the user,
and provides a secure way to managing dask clusters. 

Dask consists 03 main components `client`, `scheduler` and `workers`
- We as the end user interact with the client, client interacts with both scheduler (sends instructions) and workers (collects outcomes)
- The scheduler is midpoint between the workers and client, tracks metrics and coordinate workers.
- The workers are the threads/processes that executes computations.

### Starting a dask cluster on Nebari

We will start by creating a Jupyter notebook with name of your choice. Select `dask` environment from the select kernel dropdown (located on the top right)

Nebari has set of pre-defined options for configuring the dask profiles that we have access to. These can be accessed via Dask Gateway options.


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

**Calling dask client to get started**

```python

client = cluster.get_client()
client
```

**Sample output: Dask client**

![dask client](/img/dask_client.png)

Click on the dashboard URL to open the dask diagnostic, we will discuss more about this 
in later section of this tutorial.

**Fun part, let's code with dask**

```python
import dask.array as da
x = da.random.random((100000, 100000), chunks=(1000, 1000))
y = x * x
z = y.mean(axis=1)
z.compute()
```

**Sample output: Dask compute**
```shell
array([0.33349882, 0.33262234, 0.33379292, ..., 0.33177493, 0.33396109,
       0.33385578])
```

In the above code snippet, we are first generating a random array of shape (10000*10000), which is a large array.
In order to fit it into our memory we specify the argument `chunks` which breaks the underlying array into
chunks. Here we are using uniform dimension `1000`, meaning chunks of 1000 in each dimension. Storing it in variable
`x`. Further some simple computations are performed, and finally we compute the column wise mean operation 
on the array `z`.

![variable x](/img/x_array.png)    ![variable z](/img/z_array.png) 

### Dask diagnostic UI

Dask comes with an inbuilt dashboard containing multiple plots and tables containing live information as 
the data gets processed. Let's understand the dashboard plots `Task Stream` and `Progress`. 
The colours and the interpretation would differ based on the computation we choose.

Each of the computation in split into multiple tasks for parallel execution. From the progress bar we see 04
distinct colours associated with different computation. Under task stream (a streaming plot) each row represents a thread
and the small rectangles within are the individual tasks. The tiny white spaces shows that the worker was ideal during 
that period of time.

![dask diagnostic UI](/img/dask_diagostic_UI.png)

### Shutting down the cluster

```python
cluster.close(shutdown=True)
```
The above immediately shuts the cluster down and detaches the schedular. \
*An important step to prevent utilisation of additional resources*

### Dask-labextension

[Dask-labextension](https://github.com/dask/dask-labextension) provides a JupyterLab extension to manage Dask clusters,
as well as embed Dask's dashboard plots directly into JupyterLab panes.
Nebari is pre-configured with the extension, elevating the overall developer experience.

![Dask-labextension](/img/dask_labextension.png)

:::note Recommendation
Wrapping the dask-gateway in a context manager (code below), is a great way to avoid having to write a ton of boilerplate,
and comes with an added benefit that it ensures the cluster is fully shutdown once the task is complete.

**Example: Dask `context manager` configuration**
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

:::

### Conclusion

Kudos ✨, we now have a working dask cluster inside Nebari.
Excellent to get started with those large datasets.
