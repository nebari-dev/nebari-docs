---
id: dask-nebari-setup
title: Configuring Dask on Nebari
---

# Introduction to Dask

Working with large datasets could pose computation challenges, running into frequent memory issues is one.

Dask is a free and open-source library for parallel computing in Python, which 
helps in scaling up the data science workflows leveraging efficient computation
techniques.

# Nebari and Dask

Nebari uses [dask-gateway](https://gateway.dask.org/) to expose auto-scaling compute clusters automatically configured for the user.

Dask Gateway provides a secure way to managing dask clusters. We will discuss in detail the pre-defined configuration in later sections of this tutorial.

# Diving deeper into dask-gateway configuration 

**Dask Gateway has three components:**

- `address` : is the rest API that dask-gateway exposes for managing clusters
- `proxy_address` : is a secure TLS connection to a user defined dask scheduler
- `auth` is the form of authentication used, which should always be jupyterhub for Nebari

Nebari already has the connection information pre-configured for the user. 
In order to view configuration details run the below command: 

- using terminal : `cat /etc/dask/gateway.yaml` 
- using notebook: `! cat /etc/dask/gateway.yaml`

<details>
<summary> Sample output </summary>

```shell
{"gateway":{"address":"http://qhub-dask-gateway-gateway-api.dev:8000","auth":{"type":"jupyterhub"},"proxy_address":"tcp://quansight.qhub.dev:8786","public_address":"https://quansight.qhub.dev/gateway"}}
```
</details>


