---
id: kubernetes-version-upgrade
title: Upgrade cluster's Kubernetes version
description: A basic overview on how to upgrade your cluster Kubernetes version
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

Nebari runs on Kubernetes under the hood, and as administrators of this Kubernetes cluster, one of the maintenance tasks required from time to time is upgrading the version of your Kubernetes cluster. Each of the different cloud providers that Nebari can run on, has their own release cycle and support windows for their flavor of Kubernetes. That said, they tend to follow the [official Kubernetes release cycle](https://kubernetes.io/releases/).

The Nebari development team tries to stay ahead of this by supporting the latest version when possible. However, given that many Kubernetes releases come with a set of deprecations that potentially affect Nebari and downstream plugins, there is an enforced [`HIGHEST_SUPPORTED_K8S_VERSION`](https://github.com/nebari-dev/nebari/blob/main/src/_nebari/constants.py#L11) allowed.

:::note
This `HIGHEST_SUPPORTED_K8S_VERSION` is, at times, a minor version or two behind the officially released Kubernetes version.
:::

Many cloud providers enable users to automatically upgrade their Kubernetes cluster (control plane), however given the potential for deprecations and other changes, Nebari deployed to these clouds has this feature automatically disabled.

This upgrade process bumps the version of the control plane along with all node groups.

:::warning

1. Upgrading the kubernetes version of the node groups will cause downtime so please plan accordingly. We also recommend [backing up your data](./manual-backup.md) before starting this upgrade process.
2. Kubernetes versions can only be upgraded one minor version at a time. If you're running on 1.24, and need to upgrade to 1.26, you will first need to upgrade to 1.25.
3. Downgrading to a lower version of Kubernetes is dangerous and we strongly advise against it!
   :::

<Tabs>
  
<TabItem label="GCP" value="gcp" default="true">

Google Kubernetes Engine (GKE) cut their own platform specific version of Kubernetes that usually look something like: `1.26.7-gke.500`; this corresponds to a Kubernetes version of `1.26.7`.

You can list the supported GKE Kubernetes versions by running the following `gcloud` command:

```bash
gcloud container get-server-config --region <region>
```

We recommend selecting a `validVersion` from the `STABLE` channel:

```bash
channels:
- channel: RAPID
  defaultVersion: 1.27.4-gke.900
  validVersions:
  - 1.28.1-gke.201
  ...
- channel: REGULAR
  defaultVersion: 1.27.3-gke.100
  validVersions:
  - 1.27.4-gke.900
  - 1.27.3-gke.1700
  ...
- channel: STABLE
  defaultVersion: 1.27.3-gke.100
  validVersions:
  - 1.27.4-gke.900
  - 1.27.3-gke.100
  - 1.26.7-gke.500
  ...
  - 1.24.15-gke.1700
  - 1.24.14-gke.2700
```

To upgrade your GKE cluster, update the `google_cloud_platform.kubernetes_version` field in your `nebari-config.yaml` to match one of these GKE Kubernetes versions. Then run `nebari deploy` to apply these changes. This deployment process might take as long as 30 minutes.

:::info
You will get a validation error if you try to select a Kubernetes version that is unsupported by GKE or a version higher than [`HIGHEST_SUPPORTED_K8S_VERSION`][highest-supported-k8s].
:::

Then repeat the above process one minor version at a time. You will get a similar error otherwise:

```bash
[terraform]: │ Error: googleapi: Error 400: Master cannot be upgraded to "1.26.7-gke.500": cannot upgrade the master more than a minor version at a time.
```

For more information about GKE upgrades, please refer to the [GKE documentation](https://cloud.google.com/kubernetes-engine/docs/how-to/upgrading-a-cluster).

</TabItem>

<TabItem label="AWS" value="aws">

The AWS Elastic Kubernetes Service (EKS) only requires that you supply the major and minor version of Kubernetes that you want. To specify Kubernetes version `1.26.7`, update the `amazon_web_services.kubernetes_version` to `1.26`. Then run `nebari deploy` to apply these changes. This deployment process might take as long as 30 minutes.

:::info
You will get a validation error if you try to select a Kubernetes version that is unsupported by EKS or a version higher than [`HIGHEST_SUPPORTED_K8S_VERSION`][highest-supported-k8s].
:::

In AWS, upgrading EKS will upgrade the control plane components but the **node groups will need to be upgraded manually**.

In the AWS console, navigate to EKS and click on the name of your Kubernetes cluster (format will be `{project-name}-{namespace}`). In the 'Compute' tab, scroll down to "Node Groups". Any node groups which are behind will have an "Update Now" button by the "AMI release version" column values. Click "Update Now" for each. Each update may take 15 or more minutes depending on how many workloads need to be migrated, but they can be run simultaneously.

Then repeat the above process one minor version at a time.

For more information about EKS upgrades, please refer to the [EKS documentation](https://docs.aws.amazon.com/eks/latest/userguide/update-cluster.html).

</TabItem>

<TabItem label="Azure" value="azure">

The Azure Kubernetes Service (AKS) requires that you specify the major, minor, and patch version you would like to use. To specify a Kubernetes version update the `azure.kubernetes_version` to `1.26.7` (or the version you need to upgrade to). Then run `nebari deploy` to apply these changes. This deployment process might take as long as 30 minutes.

:::info
You will get a validation error if you try to select a Kubernetes version that is unsupported by AKS or a version higher than [`HIGHEST_SUPPORTED_K8S_VERSION`][highest-supported-k8s].
:::

Then repeat the above process one minor version at a time.

For more information about AKS upgrade, please refer to the [AKS documentation](https://learn.microsoft.com/en-us/azure/aks/upgrade-cluster?tabs=azure-cli).

</TabItem>

<TabItem label="Digital Ocean" value="do">

Digital Ocean Kubernetes Service (DOKS) cut their own platform specific version of Kubernetes that usually look something like: `1.25.14-do.0`; this corresponds to a Kubernetes version of `1.25.14`.

You can list the supported DOKS Kubernetes versions by running the following `doctl` command:

```bash
doctl kubernetes options versions
```

```bash
Slug            Kubernetes Version    Supported Features
1.28.2-do.0     1.28.2                cluster-autoscaler, docr-integration, ha-control-plane, token-authentication
1.27.6-do.0     1.27.6                cluster-autoscaler, docr-integration, ha-control-plane, token-authentication
1.26.9-do.0     1.26.9                cluster-autoscaler, docr-integration, ha-control-plane, token-authentication
1.25.14-do.0    1.25.14               cluster-autoscaler, docr-integration, ha-control-plane, token-authentication
```

To upgrade your DOKS cluster, update the `digital_ocean.kubernetes_version` field in your `nebari-config.yaml` to match one of these DOKS Kubernetes versions. Then run `nebari deploy` to apply these changes. This deployment process might take as long as 30 minutes.

:::info
You will get a validation error if you try to select a Kubernetes version that is unsupported by DOKS or a version higher than [`HIGHEST_SUPPORTED_K8S_VERSION`][highest-supported-k8s].
:::

Then repeat the above process one minor version at a time.

For more information about DOKS upgrade, please refer to the [DOKS documentation](https://docs.digitalocean.com/products/kubernetes/how-to/upgrade-cluster/).

</TabItem>

</Tabs>

<!-- Reusable links -->

[highest-supported-k8s]: https://github.com/nebari-dev/nebari/blob/91792952b67074b5c15c3b4009bde5926ca4ec6b/src/_nebari/constants.py#L11
