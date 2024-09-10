---
id: setup-healthcheck
title: Set up healthchecks with Kuberhealthy
description: Set up healthchecks with Kuberhealthy
---

::: warning

This feature is in beta status. It should be used with caution. 

:::

# Overview

Nebari integrates [Kuberhealthy](https://kuberhealthy.github.io/kuberhealthy/) to perform internal healthchecks on Nebari. This is an extensible Kubernetes native framework for continuous synthetic testing. Kuberhealthy is set up to export metrics to

# Enabling

Healthchecks are currently considered a beta feature that we are testing. Due to this, they are disabled by default. To enable healthchecks, add the following configuration under the `monitoring` configuration in your `nebari-config.yaml`.

```yaml
monitoring:
  healthchecks:
    enabled: true
```

# Checking status of Healthchecks

All healthchecks are exported as metrics to Prometheus and can be viewed in Grafana.

For example: To see the uptime for the conda-store service, you can run:

`1 - (sum(count_over_time(kuberhealthy_check{check="dev/conda-store-http-check", status="0"}[30d])) OR vector(0))/(sum(count_over_time(kuberhealthy_check{check="dev/conda-store-http-check", status="1"}[30d])) * 100)`

in Grafana, which will show you the following chart.

![Grafana chart showing the uptime for conda store](/img/how-tos/nebari-healthchecks.png)
