---
id: idle-culling
title: Updating JupyterHub Idle-Culling Settings
description: How to update JupyterHub idle-culling settings
---

This document provides information on how to update JupyterHub idle-culling settings.

## Overview

The idle culler automatically shuts down user notebook servers after a certain period of inactivity to reduce the total resource usage from your user instances. There are two ways to cull idle notebooks and kernels:

- Setting configuration options for the notebook server to shutdown kernels and the server itself after a certain period of inactivity.
  The default kernel manager, the MappingKernelManager, can be configured to cull idle kernels. Its configuration is documented in more details at [NotebookApp](https://jupyter-notebook.readthedocs.io/en/stable/config.html#options).
- Using an external JupyterHub culler ([jupyterhub-idle-culler](https://github.com/jupyterhub/jupyterhub-idle-culler)) to shutdown the whole server after a certain period of inactivity.
  The external culler is more coarse-grained, while the internal culler is considered more granular and can be smarter. It is recommended to use both methods to avoid false-positives.

The two methods have different levels of granularity in terms of what they can measure and act on, The internal culler is considered more granular and can be smarter, while the external culler is more coarse-grained. To avoid false-positives Nebari uses both.

## Updating JupyterHub Idle-Culling Settings

To update the settings for managing idle kernels and terminals in Nebari/JupyterHub, modify the nebari-config.yaml file. The available options that can be modified are as follows:

- `terminal_cull_inactive_timeout`: The timeout (in minutes) after which a terminal is considered inactive and ready to be culled.
- `terminal_cull_interval`: The interval (in minutes) on which to check for terminals exceeding the inactive timeout value.
- `kernel_cull_idle_timeout`: The timeout (in minutes) after which an idle kernel is considered ready to be culled.
- `kernel_cull_interval`: The interval (in minutes) on which to check for idle kernels exceeding the cull timeout value.
- `kernel_cull_connected`: Whether to consider culling kernels which have one or more connections.
- `kernel_cull_busy`: Whether to consider culling kernels which are currently busy running some code.
- `server_shutdown_no_activity_timeout`: The timeout (in minutes) after which the server is shut down if there is no activity.

To update any of these options, modify the corresponding value in the `nebari-config.yaml` file and save the changes. For example, to update the kernel_cull_idle_timeout value to 30 minutes, modify the following lines:

```yaml
jupyterlab:
  idle_culler:
    kernel_cull_idle_timeout: 30
```

:: note
Note that once the new configurations are applied and the user pod is left idle, it should take approximately the sum of cull_idle_timeout and cull_inactive_timeout (if both are enabled) plus shutdown_no_activity_timeout for the pod to be terminated. However, these configurations are approximate and may not reflect the exact time that a kernel or terminal will be terminated. The exact timing may depend on factors such as server load, network latency, and other system resources.
::

## Default values

The idle culling mechanism is enabled by default in Nebari, and it can be configured using the `nebari-config.yaml` file. By default, JupyterHub will ping the user notebook servers every 10 minutes to check their status. Every server found to be idle for more than 30 minutes (approximately) will be culled. The default values for the internal culling mechanism are as follows:

```yaml
kernel_cull_busy                    = false
kernel_cull_connected               = true
kernel_cull_idle_timeout            = 15
kernel_cull_interval                = 5
server_shutdown_no_activity_timeout = 15
terminal_cull_inactive_timeout      = 15
terminal_cull_interval              = 5
```
