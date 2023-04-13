---
title: Custom configurations and overrides
id: custom-overrides-configuration
description: Manage Terraform state, default images, storage, or override config.
---

## Custom settings

### Terraform state

Terraform manages the state of all the deployed resources via [backends](https://www.terraform.io/language/settings/backends). Terraform requires storing the state in order to keep
track of the names, ids, and states of deployed resources. See [terraform remote state](https://www.terraform.io/language/state/remote) for more information.

If you are doing anything other than testing we highly recommend `remote` unless you know what you
are doing. As any unexpected changes to the state can cause issues with the deployment.

For a `existing` provider that deploys to a kubernetes cluster, the kubernetes `remote` backend is also used.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>

<TabItem value="remote" label="Remote" default="true" >

```yaml
terraform_state:
  type: remote
```

</TabItem>

<TabItem value="local" label="Local" >

The simplest approach is storing the state on the local filesystem but this isn't recommended and isn't the default of Nebari.

```yaml
terraform_state:
  type: local
```

</TabItem>

<TabItem value="existing" label="Existing" >

Using an existing terraform backend can be done by specifying the `backend` and arbitrary key/value pairs in the `config`.

```yaml
terraform_state:
  type: existing
  backend: s3
  config:
    bucket: mybucket
    key: "path/to/my/key"
    region: "us-east-1"
```

</TabItem>

</Tabs>

### Default Images

Nebari uses Docker images to provide containers for JupyterHub, JupyterLab interface, and the Dask worker user environments.

Default images are the image run by default if not explicitly specified in a profile (described in the next section).

The `jupyterhub` key controls the JupyterHub image run.

These control the docker image used to run JupyterHub, the default JupyterLab image, and the default Dask worker image respectively.

```yaml
### Default images ###
default_images:
  jupyterhub: "quay.io/nebari/nebari-jupyterhub:v2022.10.1"
  jupyterlab: "quay.io/nebari/nebari-jupyterlab:v2022.10.1"
  dask_worker: "quay.io/nebari/nebari-dask-worker:v2022.10.1"
```

### Storage

The Storage section is used to control the amount of storage allocated to the **shared filesystem**.

```yaml
### Storage ###
storage:
  conda_store: 200Gi
  shared_filesystem: 200Gi
```

:::warning
For most providers, when the storage size is changed, it will automatically **delete** the previous storage place.

Changing the storage size on an AWS deployment after the initial deployment can be especially tricky so it might be worthwhile padding these storage sizes.
:::

## Overrides

Overrides allows you to override the default configuration for a given resource on Nebari without having to directly modify the infrastructure components.

Below we show the available resources that can be overridden in the configuration.

### JupyterHub

JupyterHub uses the [zero to jupyterhub helm chart](https://github.com/jupyterhub/zero-to-jupyterhub-k8s/). This chart has many options that are not configured in the Nebari default
installation. You can override specific values in the [values.yaml](https://github.com/jupyterhub/zero-to-jupyterhub-k8s/blob/main/jupyterhub/values.yaml). `jupyterhub.overrides`
is optional.

```yaml
jupyterhub:
  overrides:
    cull:
      users: true
```

### Terraform

The Nebari configuration file provides a huge number of configuration options for customizing your Nebari infrastructure. While these options are sufficient for an average user, they
aren't exhaustive by any means. There are still a plenty of things you might want to achieve which cannot be configured directly by the above mentioned options. Therefore, we've
introduced a new option called terraform overrides (`terraform_overrides`), which lets you override the values of terraform variables in specific modules/resource. This is a
relatively advanced feature and must be used with utmost care, and you should really know what you're doing.

Here we describe the overrides supported via Nebari config file:

#### Ingress

You can configure the IP of the load balancer and add annotations for the same via `ingress`'s terraform overrides, one such example for GCP is:

```yaml
ingress:
  terraform_overrides:
      load-balancer-annotations:
          "networking.gke.io/load-balancer-type": "Internal"
          "networking.gke.io/internal-load-balancer-subnet": "pre-existing-subnet"
      load-balancer-ip: "1.2.3.4"
```

This is quite useful for pinning the IP Address of the load balancer.

#### Deployment inside a Virtual Private Network

<Tabs>

<TabItem value="azure" label="Azure" default="true" >

Using terraform overrides you can also deploy inside a Virtual Private Network (VPN).

An example configuration for Azure is given below:

```yaml
azure:
  terraform_overrides:
      private_cluster_enabled: true
      vnet_subnet_id: '/subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Network/virtualNetworks/<vnet-name>/subnets/<subnet-name>'
  region: Central US
```

</TabItem>

<TabItem value="gcp" label="GCP" default="true" >

Using terraform overrides you can also deploy inside a [Virtual Private Cloud (VPC) in GCP](https://cloud.google.com/vpc/docs/overview), making the Kubernetes cluster private. Here is an example configuration:

```yaml
google_cloud_platform:
  terraform_overrides:
    networking_mode: "VPC_NATIVE"
    network: "your-vpc-name"
    subnetwork: "your-vpc-subnet-name"
    private_cluster_config:
      enable_private_nodes: true
      enable_private_endpoint: true
      master_ipv4_cidr_block: "172.16.0.32/28"
    master_authorized_networks_config:
      cidr_block: null
      display_name: null
```

As the name suggests the cluster will be private, which means it would not have access to the internet - not ideal for deploying pods in the cluster. Therefore, we need
to allow internet access for the cluster, which can be achieved by creating a [Network Address Translation](https://en.wikipedia.org/wiki/Network_address_translation) router. The following two commands are an example of how you can do this for your VPC network on GCP.

```bash
gcloud compute routers create nebari-nat-router --network your-vpc-name --region your-region

gcloud compute routers nats create nat-config --router nebari-nat-router  --nat-all-subnet-ip-ranges --auto-allocate-nat-external-ips --region your-region
```

</TabItem>

</Tabs>

Deployment inside a virtual network is slightly different from deploying inside a public network.
As the name suggests, since it's a virtual private network, you need to be inside the network to able to deploy and access Nebari.
One way to achieve this is by creating a Virtual Machine (VM) inside the virtual network.
Select the virtual network and subnet name under the networking settings of your cloud provider while creating the VM
and then follow the usual deployment instructions as you would deploy from your local machine.
