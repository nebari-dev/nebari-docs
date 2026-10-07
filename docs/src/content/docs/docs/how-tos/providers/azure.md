---
title: Microsoft Azure
description: End-to-end how-to for deploying, updating, and destroying NKP on Azure AKS, including credentials and cost considerations.
---

[Microsoft Azure](https://azure.microsoft.com/) is Microsoft's public cloud. NKP deploys onto it as a managed [AKS (Azure Kubernetes Service)](https://learn.microsoft.com/azure/aks/) cluster, so Azure runs and upgrades the Kubernetes control plane for you while `nic` (the Nebari Infrastructure Core CLI) provisions the cluster, its node pools, and the supporting infrastructure.

This guide walks you through a deployment from end to end: from an empty subscription to a running cluster you can manage and tear down. If you have deployed NKP on AWS, the flow will feel familiar; the differences are mostly in how you authenticate and in a few Azure-specific fields.

:::caution[A cloud deployment is not free]
A NKP deployment on Azure will **not** fall within free-tier usage. The AKS control plane is free on the default `Free` tier, but the node VMs, managed disks, and load balancer all bill, and the smallest working cluster needs multi-GB VMs well beyond free-tier sizes. Review the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/), or check with your cloud administrator, before you deploy. To try NKP at no cost, run it on your own machine with the [Local (kind)](/docs/how-tos/providers/local/) provider instead.
:::

## What your team gets

When `nic deploy` finishes, your team will have all [standard NKP services](/docs/how-tos/deploy/#what-every-deployment-includes) plus:

- **A managed Kubernetes cluster** ready for workloads (Azure AKS, with one System node pool and any number of User node pools).
- **Block storage** through Azure managed disks (the `managed-csi` StorageClass).

:::note
Shared read-write-many storage (Longhorn) is not installed on Azure, so persistent volumes are read-write-once managed disks, and [Longhorn backups](/docs/how-tos/backup-restore/) are not available. NKP also fixes a few cluster settings: networking uses [Azure CNI Overlay](https://learn.microsoft.com/azure/aks/azure-cni-overlay) (you can choose the `azure` or `cilium` dataplane), and the cluster runs under user-assigned managed identities that `nic` creates.
:::

## Prerequisites

### Azure subscription

You will need an Azure subscription you can deploy into. If you don't have one, [create an Azure account](https://azure.microsoft.com/free/).

- **Region:** pick a [region where AKS is available](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=kubernetes-service). The example uses `eastus`.
- **Quotas:** confirm your subscription has enough [regional vCPU quota](https://learn.microsoft.com/azure/quotas/view-quotas) for the VM sizes in your node pools. New subscriptions often need an increase, and `nic` does not check quota before it starts provisioning.
- **Cost:** see [Cost considerations](#cost-considerations) for what bills.

### Credentials

`nic` needs one value from you directly, your **subscription ID**, and finds your identity through the standard Azure credential chain, [`DefaultAzureCredential`](https://learn.microsoft.com/azure/developer/go/sdk/authentication/authentication-overview). It tries environment-variable credentials first, then workload identity and managed identity, then the Azure CLI.

For most people the simplest path is the [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli):

```bash
az login
az account show --query id --output tsv   # prints your subscription ID
```

:::tip[Service principals for automation]
For CI or other non-interactive use, create a service principal:

```bash
az ad sp create-for-rbac --name nic-deploy --role Contributor \
  --scopes /subscriptions/<subscription-id>
```

`nic` deploys in two steps that read credentials differently: its own Azure calls read the `AZURE_*` variables, and the OpenTofu run that builds the cluster reads `ARM_*` variables. Set both pairs to the service principal's values, as shown in the next section.
:::

### Install nic

Follow the [Install NIC](/docs/get-started/install/) guide to download and install the `nic` CLI for your platform.

### GitOps repository

See [GitOps repository](/docs/how-tos/prepare-to-deploy/#gitops-repository) in the Prepare to deploy guide.

### Secrets and credentials

From inside your GitOps repo clone, download the [template](https://github.com/nebari-dev/nebari-infrastructure-core/blob/main/.env.example):

```bash
cd /path/to/your-gitops-repo
curl -o .env https://raw.githubusercontent.com/nebari-dev/nebari-infrastructure-core/main/.env.example
```

Then fill in the GitOps tokens and add your subscription ID (the template does not include an `AZURE_SUBSCRIPTION_ID` line, so add it yourself). For `.gitignore` setup and GitOps token configuration, see [Secrets and credentials](/docs/how-tos/prepare-to-deploy/#secrets-and-credentials) in the Prepare to deploy guide.

```bash
# Azure
AZURE_SUBSCRIPTION_ID=00000000-0000-0000-0000-000000000000  # az account show --query id

# Service-principal auth only (skip these if you use `az login`):
# AZURE_CLIENT_ID=...
# AZURE_TENANT_ID=...
# AZURE_CLIENT_SECRET=...
# ARM_CLIENT_ID=...          # same value as AZURE_CLIENT_ID
# ARM_TENANT_ID=...          # same value as AZURE_TENANT_ID
# ARM_CLIENT_SECRET=...      # same value as AZURE_CLIENT_SECRET
```

`nic validate` and `nic deploy` both fail early if `AZURE_SUBSCRIPTION_ID` is not set. You do not need to set `ARM_SUBSCRIPTION_ID`: `nic` passes the subscription ID through to OpenTofu for you.

## Cost considerations

A NKP deployment provisions several Azure services that bill from day one. Check the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) for current rates in your region.

- **[AKS control plane](https://azure.microsoft.com/pricing/details/kubernetes-service/):** the `Free` tier (the default) has no control-plane charge; setting `sku_tier` to `Standard` or `Premium` adds a per-cluster hourly fee for an uptime SLA.
- **[Virtual machines](https://azure.microsoft.com/pricing/details/virtual-machines/linux/)** in your node pools: per-hour cost for each running node.
- **[Managed disks](https://azure.microsoft.com/pricing/details/managed-disks/):** an OS disk on each node (128 GB unless you set `os_disk_size_gb`) plus any `managed-csi` persistent volumes your workloads request.
- **[Load balancer](https://azure.microsoft.com/pricing/details/load-balancer/):** the Standard Load Balancer and public IP that AKS creates for ingress.
- **[Bandwidth](https://azure.microsoft.com/pricing/details/bandwidth/):** outbound data transfer.

:::note[Shared state storage]
`nic` also keeps its OpenTofu state in Azure: a resource group named `nic-tfstate-rg` holding a storage account with one state file per cluster. It is **shared by every cluster you deploy in the subscription**, costs very little, and is deliberately **not removed by `nic destroy`**. Delete it by hand only once you are done with all of your clusters.
:::

## Configuration

Download the starter config from `nebari-infrastructure-core`:

- **[`azure-config.yaml`](https://github.com/nebari-dev/nebari-infrastructure-core/blob/main/examples/azure-config.yaml)**.

```bash
curl -O https://raw.githubusercontent.com/nebari-dev/nebari-infrastructure-core/main/examples/azure-config.yaml
```

:::note
In later steps, `<config-file>` refers to this local copy (`azure-config.yaml`).
:::

At minimum, edit these fields:

```yaml
project_name: my-cluster          # letters, digits, and hyphens; see the naming note below
domain: nebari.example.com        # a hostname you own

certificate:
  type: letsencrypt
  acme:
    email: you@example.com        # required for Let's Encrypt; renewal notices go here

repository:
  existing:                       # the repository provider
    url: "https://github.com/<your-org>/<your-gitops-repo>.git"
    branch: main
    path: clusters/my-cluster     # subdirectory in the repo; conventionally matches project_name
    auth:
      token:
        env: GIT_TOKEN            # matches the GIT_TOKEN set in .env

cluster:
  azure:
    region: eastus                # an AKS-supported region (required)
    kubernetes_version: "1.34"
    node_groups:                  # at least one pool is required
      system:
        instance: Standard_D4_v3
        min_nodes: 1
        max_nodes: 3
        mode: System              # the pool that runs cluster services
      user:
        instance: Standard_D8_v3
        min_nodes: 1
        max_nodes: 5
```

The starter config authenticates to Git with an SSH key (`auth.ssh.env`) instead; either works, as long as you set exactly one.

Every AKS cluster needs one **System** node pool to run cluster services. Set `mode: System` on the pool you want to play that role; pools without a `mode` are User pools. At most one pool may be `System`. If none is, the pool whose name sorts first alphabetically becomes the System pool, so set it explicitly rather than relying on the order of your pool names.

:::caution[Azure naming rules]
Azure has stricter naming rules than `nic` checks for, and a name that breaks them only fails partway through `nic deploy`:

- **`project_name`** becomes the AKS DNS prefix: use only letters, digits, and hyphens (no underscores), start and end with a letter or digit, and keep it to 54 characters or fewer.
- **Node pool names** (the keys under `node_groups`) must be lowercase letters and digits only, start with a letter, and be at most 12 characters (no hyphens or underscores).
:::

By default `nic` creates a resource group named `<project_name>-rg`. Set `resource_group_name` to deploy into one you already manage.

For the full schema (custom networking and existing VNets, the `cilium` dataplane, private clusters, authorized IP ranges, `sku_tier`, Node Auto Provisioning, per-pool disks, labels, taints, and zones), see the [Azure provider configuration reference](https://github.com/nebari-dev/nebari-infrastructure-core/blob/main/docs/configuration/azure.md).

## Deploy and verify

Follow [Deploy a cluster](/docs/how-tos/deploy-cluster/) to deploy and verify. Expect the first deployment to take 20 minutes or more as AKS provisions the control plane and node pools, followed by ArgoCD syncing the foundational services.

Azure does not write a kubeconfig to a local path. Retrieve one with `nic kubeconfig`, as [Deploy a cluster](/docs/how-tos/deploy-cluster/#retrieve-the-kubeconfig) shows; it returns cluster-admin credentials directly from Azure, so you do not need the `az` CLI for `kubectl` to work.

Once the platform has converged, `nic outputs` prints its entry points, including the gateway's public IP address:

```bash
nic outputs -f <config-file> --wait
```

## DNS

AKS gives the gateway a public IP address, so you point your domain at it with **A** records. Add a `dns.cloudflare` block to have `nic` create the records for you, or create them by hand with any DNS provider using the address `nic outputs` printed. See [Cloudflare DNS](/docs/how-tos/cloudflare-dns/) for both paths.

## First sign-in

See [Keycloak authentication](/docs/how-tos/keycloak-auth/) for first sign-in.

## Update an existing deployment

To change something about a running cluster (scale a node pool, add a pool, change tags), edit your config and re-run the deploy commands as described in [Update a cluster](/docs/how-tos/update-cluster/).

:::caution
Some fields cannot be changed in place. Changing `region`, `resource_group_name`, the network CIDRs, an existing VNet or subnet ID, or the `dataplane` recreates resources. Changing `project_name` is worse: `nic` treats it as a new cluster and deploys a second one, leaving the original running (and billing). Treat these as one-way decisions.
:::

## Upgrade Kubernetes version

To upgrade, set `kubernetes_version` under `cluster.azure` and re-deploy:

```yaml
cluster:
  azure:
    kubernetes_version: "1.35"   # was "1.34"
```

`nic` passes the version straight through to AKS and does not sequence the upgrade itself; the rules come from AKS. AKS upgrades **one minor version at a time** and does not allow skipping versions or downgrading, so going from 1.33 to 1.35 means upgrading twice (`1.33 → 1.34 → 1.35`). AKS upgrades the control plane first, then rolls each node pool one node at a time: it adds a new node, waits for it to become Ready, then drains and removes an old one. Allow 20 to 40 minutes, depending on the number of node pools.

See [Upgrade Kubernetes version](/docs/how-tos/upgrade-kubernetes/) for the upgrade commands and post-upgrade verification steps.

## Destroy

Run the destroy commands as described in [Destroy a cluster](/docs/how-tos/destroy-cluster/).

`nic destroy` removes the AKS cluster and its node pools, the virtual network, the managed identities, the load balancer, any DNS records `nic` created, and (when `nic` created it) the `<project_name>-rg` resource group. When it finishes, it lists any resources tagged for the cluster that are still present, with an `az resource delete` command to remove them.

It does **not** remove the shared `nic-tfstate-rg` state backend; remove that by hand once you are finished with every cluster in the subscription.

:::caution
Always confirm in the Azure portal that no orphan resources remain. VMs, managed disks, public IPs, and load balancers keep billing if they are left behind.
:::
