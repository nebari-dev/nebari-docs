---
id: idle-culling
title: Update JupyterHub idle-culling settings
description: How to update JupyterHub idle-culling settings
---

This document provides information on how to update JupyterHub idle-culling settings.

## Overview

The Nebari system includes an idle culler that automatically shuts down user notebook servers to reduce resource usage from inactive instances. There are two primary methods used for culling idle kernels and terminals.

The first method involves an internal configuration setting for the notebook server that will shut down kernels and the server itself after a certain period of inactivity. The second method involves an external JupyterHub culler ([jupyterhub-idle-culler](https://github.com/jupyterhub/jupyterhub-idle-culler)) that orchestrates the culling of idle kernels and terminals based on user usage metrics.

These two methods have different levels of granularity in terms of what they can measure and act on. The internal culler is considered more granular and can make more intelligent decisions about when to shut down kernels and servers. In contrast, the external culler is more coarse-grained and may not be as precise.

## Update JupyterHub idle-culling settings

To update the settings for managing idle kernels and terminals in Nebari/JupyterHub, modify the `nebari-config.yaml` file. The available options that can be modified are as follows:

- `terminal_cull_inactive_timeout`: The timeout (in minutes) after which a terminal is considered inactive and ready to be culled.
- `terminal_cull_interval`: The interval (in minutes) on which to check for terminals exceeding the inactive timeout value.
- `kernel_cull_idle_timeout`: The timeout (in minutes) after which an idle kernel is considered ready to be culled.
- `kernel_cull_interval`: The interval (in minutes) on which to check for idle kernels exceeding the cull timeout value.
- `kernel_cull_connected`: Whether to consider culling kernels which have one or more connections.
- `kernel_cull_busy`: Whether to consider culling kernels which are currently busy running some code.
- `server_shutdown_no_activity_timeout`: The timeout (in minutes) after which the server is shut down if there is no activity.

To update any of these options, modify the corresponding value in the `nebari-config.yaml` file and save the changes. For example, to update the `kernel_cull_idle_timeout` value to 30 minutes, modify the following lines:

```yaml
jupyterlab:
  idle_culler:
    kernel_cull_idle_timeout: 30
```

:::note
Note that once the new configurations are applied and the user pod is left idle, it should take approximately the sum of `max(cull_idle_timeout, cull_inactive_timeout)` (if both are enabled) plus `shutdown_no_activity_timeout` for the pod to be terminated. However, these configurations are approximate and may not reflect the exact time that a kernel or terminal will be terminated. The exact timing may depend on factors such as server load, network latency, and other system resources that could lead to a certain amount of variance in the actual termination time.
:::

## Default values

The idle culling mechanism is enabled by default in Nebari, and it can be configured using the `nebari-config.yaml` file. By default, JupyterHub will ping the user notebook servers every 10 minutes to check their status. Every server found to be idle for more than 30 minutes (approximately) will be culled. The default values for the internal culling mechanism are as follows:

```yaml
jupyterlab:
  idle_culler:
    kernel_cull_busy                    : false
    kernel_cull_connected               : true
    kernel_cull_idle_timeout            : 15
    kernel_cull_interval                : 5
    server_shutdown_no_activity_timeout : 15
    terminal_cull_inactive_timeout      : 15
    terminal_cull_interval              : 5
```
