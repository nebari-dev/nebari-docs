---
title: Idle Culler configuration
id: advanced-idle-culler
description: Configure the idle-culler settings.
---

# Configure Idle Culler settings

The [idle-culler](https://github.com/jupyterhub/jupyterhub-idle-culler) is a feature in JupyterHub that is designed to automatically shut down JupyterLab servers that have not been actively used for a defined period of time. This is done to prevent the accumulation of unused servers, which can consume valuable system resources and, when running on the cloud, cost real money.

Nebari has this feature integrated out of the box and has set some reasonable default timeouts. That said, these are setting that many Nebari administrators want to control themselves.

:::note
From version `2023.4.1` and onward, these settings can be controlled via the `nebari-config.yaml` under `jupyterlab`.
:::

By default, the `jupyterlab` key is not included in the `nebari-config.yaml` but you can add it as follows. Any combination (or none to rely on the default values) of the `idle_culler` keys can be included.

```yml
jupyterlab:
  idle_culler:
    # The interval (in minutes) on which to check for terminals exceeding the inactive timeout
    terminal_cull_interval: 5

    # Inactive timeout (in minutes) before being culled
    terminal_cull_inactive_timeout: 15

    # The interval (in minutes) on which to check for kernels exceeding the inactive timeout
    kernel_cull_interval: 5

    # Inactive timeout (in minutes) before being culled
    kernel_cull_idle_timeout: 15

    # Shutdown the server after N minutes with no kernel or terminal
    server_shutdown_no_activity_timeout: 15

    # Whether to cull kernels that have multiple connections
    kernel_cull_connected: true

    # Whether to cull kernels that are currently busy (not recommended in most cases)
    kernel_cull_busy: false
```
