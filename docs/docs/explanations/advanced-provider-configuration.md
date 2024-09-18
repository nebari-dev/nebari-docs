---
title: Cloud provider configuration
id: provider-configuration
description: Configure region, instance types, and more.
---

# Provider configuration

To take advantage of the auto-scaling and dask-distributed computing capabilities, Nebari can be deployed on a handful of the most commonly used cloud providers.
Nebari utilizes many of the resources these cloud providers have to offer;
however, the Kubernetes engine (or service) is at it's core.
Each cloud provider has slightly different ways that Kubernetes is configured but fear not, all of this is handled by Nebari.

The `provider` section of the configuration file allows you to configure the cloud provider that you are deploying to.
Including the region, instance types, and other cloud specific configurations.

Select the provider of your choice:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>

<TabItem value="gcp" label="GCP" default="true" >

[Google Cloud](https://cloud.google.com/) has the best support for Nebari and is a great default choice for a production deployment. It allows auto-scaling to zero within the node group. There are no major
restrictions.

To see available instance types refer to [GCP docs](https://cloud.google.com/compute/docs/machine-types).

:::note
By default the [GKE release channel](https://cloud.google.com/kubernetes-engine/docs/concepts/release-channels) is set to `UNSPECIFIED` to prevent the cluster from auto-updating. This has the advantage of ensuring that the Kubernetes version doesn't upgrade and potentially introduce breaking changes. If you'd prefer your cluster's Kubernetes version to update automatically, you can specify a release channel; the options are either `stable`, `regular` or `rapid`.
:::

```yaml
### Provider configuration ###
google_cloud_platform:
  project: test-test-test
  region: us-central1
  kubernetes_version: "1.24.11-gke.1000"
  release_channel: "UNSPECIFIED"  # default is hidden
  node_groups:
    general:
      instance: n1-standard-4
      min_nodes: 1
      max_nodes: 1
    user:
      instance: n1-standard-2
      min_nodes: 0
      max_nodes: 5
    worker:
      instance: n1-standard-2
      min_nodes: 0
      max_nodes: 5
```

</TabItem>

<TabItem value="aws" label="AWS">

[Amazon Web Services](https://aws.amazon.com/) also has support for auto-scaling to zero within the node group with no restrictions.

Consult [AWS instance types](https://aws.amazon.com/ec2/instance-types/) for possible options.

```yaml
### Provider configuration ###
amazon_web_services:
  region: us-west-2
  kubernetes_version: "1.18"
  node_groups:
    general:
      instance: "m5.xlarge"
      min_nodes: 1
      max_nodes: 1
    user:
      instance: "m5.large"
      min_nodes: 1
      max_nodes: 5
    worker:
      instance: "m5.large"
      min_nodes: 1
      max_nodes: 5
```

### Permissions boundary (Optional)

Permissions boundaries in AWS is a powerful feature designed to control the maximum permissions a
user or role can have within an AWS Identity and Access Management (IAM) policy. By setting a permissions
boundary, administrators can enforce restrictions on the extent of permissions that can be granted,
even if policies would otherwise allow broader access.

Nebari supports setting permissions boundary while deploying Nebari to be applied on all the policies
created by Nebari. Here is an example of how you would set permissions boundary in `nebari-config.yaml`.

```yaml
amazon_web_services:
  # the arn for the permission's boundary policy
  permissions_boundary: arn:aws:iam::01234567890:policy/<permissions-boundary-policy-name>
```

### Launch Templates (Optional)

Nebari supports configuring launch templates for your node groups, enabling you to customize settings like the AMI ID and pre-bootstrap commands. This is particularly useful if you need to use a custom AMI or perform specific actions before the node joins the cluster.

:::warning
If you add a `launch_template` to an existing node group that was previously created without one, AWS will treat this as a change requiring the replacement of the entire node group. This action will trigger a reallocation of resources, effectively destroying the current node group and recreating it. This behavior is due to how AWS handles self-managed node groups versus those using launch templates with custom settings.
:::

:::tip
To avoid unexpected downtime or data loss, consider creating a new node group with the launch template settings and migrating your workloads accordingly. This approach allows you to implement the new configuration without disrupting your existing resources.
:::

#### Configuring a Launch Template

To configure a launch template for a node group in your `nebari-config.yaml`, add the `launch_template` section under the desired node group:

```yaml
amazon_web_services:
  region: us-west-2
  kubernetes_version: "1.18"
  node_groups:
    custom-node-group:
      instance: "m5.large"
      min_nodes: 1
      max_nodes: 5
      gpu: false  # Set to true if using GPU instances
      launch_template:
        # Replace with your custom AMI ID
        ami_id: ami-0abcdef1234567890
        # Command to run before the node joins the cluster
        pre_bootstrap_command: |
          #!/bin/bash
          # This script is executed before the node is bootstrapped
          # You can use this script to install additional packages or configure the node
          # For example, to install the `htop` package, you can run:
          # sudo apt-get update
          # sudo apt-get install -y htop"
```

**Parameters:**

- `ami_id` (Optional): The ID of the custom AMI to use for the nodes in this group; this assumes the AMI provided is an EKS-optimized AMI derivative. If specified, the `ami_type` is automatically set to `CUSTOM`.
- `pre_bootstrap_command` (Optional): A command or script to execute on the node before
  it joins the Kubernetes cluster. This can be used for custom setup or configuration
  tasks. The format should be a single string in conformation with the shell syntax.
  This command is injected in the `user_data` field of the launch template. For more
  information, see [User Data](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html).

> If you're using a `launch_template` with a custom `ami_id`, there's an issue with updating the `scaling.desired_size` via Nebari configuration (terraform). To scale up, you must recreate the node group or adjust the scaling settings directly in the AWS Console UI (recommended). We are aware of this inconsistency and plan to address it in a future update.

:::note
If an `ami_id` is not provided, AWS will use the default Amazon Linux 2 AMI for the
specified instance type. You can find the latest optimized AMI IDs for Amazon EKS in your
cluster region by inspecting its respective SSM parameters. For more information, see
[Retrieve recommended Amazon Linux AMI IDs](https://docs.aws.amazon.com/eks/latest/userguide/retrieve-ami-id.html).
:::

</TabItem>

<TabItem value="azure" label="Azure">

[Microsoft Azure](https://azure.microsoft.com/) has similar settings for Kubernetes version, region, and instance names - using Azure's available values of course.

Azure also requires a field named `storage_account_postfix` which will have been generated by `nebari init`. This allows nebari to create a Storage Account bucket that should be globally unique.

```yaml
### Provider configuration ###
azure:
  region: Central US
  kubernetes_version: 1.19.11
  node_groups:
    general:
      instance: Standard_D4_v3
      min_nodes: 1
      max_nodes: 1
    user:
      instance: Standard_D2_v2
      min_nodes: 0
      max_nodes: 5
    worker:
      instance: Standard_D2_v2
      min_nodes: 0
      max_nodes: 5
  storage_account_postfix: t65ft6q5
```

</TabItem>

<TabItem value="do" label="DigitalOcean">

DigitalOcean has a restriction with autoscaling in that the minimum nodes allowed (`min_nodes` = 1) is one but is by far the least expensive provider even accounting for `spot/pre-emptible` instances.
In addition, Digital Ocean doesn't have accelerator/gpu support.

Digital Ocean is a good choice for trying out Nebari, but we recommend selecting a different provider for your production Nebari deployment.

To see available instance types refer to [Digital Ocean Instance Types](https://www.digitalocean.com/docs/droplets/).
Additionally the Digital Ocean cli `doctl` has [support for listing droplets](https://www.digitalocean.com/docs/apis-clis/doctl/reference/compute/droplet/list/).

```yaml
digital_ocean:
  region: nyc3
  kubernetes_version: "1.21.10-do.0"
  node_groups:
    general:
      instance: "g-4vcpu-16gb"
      min_nodes: 1
      max_nodes: 1
    user:
      instance: "g-2vcpu-8gb"
      min_nodes: 1
      max_nodes: 5
    worker:
      instance: "g-2vcpu-8gb"
      min_nodes: 1
      max_nodes: 5
```

</TabItem>

<TabItem value="existing" label="Existing Kubernetes clusters">

Originally designed for Nebari deployments on a "local" minikube cluster, this feature has now expanded to allow users to deploy Nebari to any existing kubernetes cluster.
The default options for an `existing` deployment are still set to deploy to a minikube cluster.

<!-- TODO: Uncomment and add link when available -->
<!-- If you wish to deploy to an existing kubernetes cluster on one of the cloud providers, please refer to a more detailed walkthrough found in the [Deploy Nebari to an Existing Kubernetes Cluster]. -->

Deploying to a local existing kubernetes cluster has different options than the cloud providers. `kube_context` is an optional key that can be used to deploy to a non-default context.
The default node selectors will allow pods to be scheduled anywhere. This can be adjusted to schedule pods on different labeled nodes, allowing for similar functionality to node groups in the cloud.

```yaml
### Provider configuration ###
existing:
  kube_context: minikube
  node_selectors:
    general:
      key: kubernetes.io/os
      value: linux
    user:
      key: kubernetes.io/os
      value: linux
    worker:
      key: kubernetes.io/os
      value: linux
```

</TabItem>

<TabItem value="local" label="Local (testing)">

Local deployment is intended for Nebari deployments on a "local" cluster created and management by Kind.
It is great for experimentation and development.

:::warning
Currently, local mode is only supported for Linux-based operating systems.
:::

```yaml
### Provider configuration ###
local:
  kube_context: minikube
  node_selectors:
    general:
      key: kubernetes.io/os
      value: linux
    user:
      key: kubernetes.io/os
      value: linux
    worker:
      key: kubernetes.io/os
      value: linux
```

</TabItem>

</Tabs>

:::note
Many of the cloud providers regularly update their internal **Kubernetes versions** so if you wish to specify a particular version, please check the following resources.
This is _completely optional_ as Nebari will, by default, select the most recent version available for your preferred cloud provider:
[Digital Ocean](https://docs.digitalocean.com/products/kubernetes/changelog/);
[Google Cloud Platform](https://cloud.google.com/kubernetes-engine/docs/release-notes-stable);
[Amazon Web Services](https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html);
[Microsoft Azure](https://docs.microsoft.com/en-us/azure/aks/supported-kubernetes-versions?tabs=azure-cli).
:::
