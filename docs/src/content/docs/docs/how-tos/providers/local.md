---
title: Local (kind)
description: Run NKP on your own machine with kind (Kubernetes in Docker) for development and testing, from first deploy to teardown.
---

NKP has a **local mode** that runs the whole platform on a single machine (a laptop, a workstation, or a VM) without a cloud account. It is meant for developing against NKP, previewing what it does, or debugging a configuration with a quick feedback loop. We do not recommend it for production: everything a cloud would provide (managed Kubernetes, load balancers, managed storage) is stood up locally instead, so it will not match a real deployment one-for-one.

This guide walks you through running NKP locally with `nic` (the Nebari Infrastructure Core CLI) on [kind](https://kind.sigs.k8s.io/).

## What is kind?

[kind](https://kind.sigs.k8s.io/) ("Kubernetes in Docker") runs a Kubernetes cluster inside containers on your machine. It was built for testing Kubernetes itself, and it also makes an excellent local target: it starts fast, needs no cloud resources, and tears down cleanly.

`nic` **embeds** the kind library, so you do **not** install the `kind` CLI separately; `nic` drives your container runtime for you.

## What you get

When `nic deploy` finishes, you will have a local cluster with all [standard NKP services](/docs/how-tos/deploy/#what-every-deployment-includes) plus:

- **A kind cluster** running in your container runtime: a single node by default, or a control-plane node plus workers if you add [node groups](#multi-node-clusters).
- **Local-path storage** (kind's built-in `standard` StorageClass) for persistent volumes. Longhorn is not installed locally.
- **The gateway published on `127.0.0.1`**, on host ports 80 and 443 by default, so you reach the platform from your browser without a load balancer.
- **A local GitOps repository** that `nic` creates and mounts for you, so you do not need a remote Git repository to get started.

## Prerequisites

### A container runtime

kind runs Kubernetes inside containers, so you need [Docker](https://docs.docker.com/get-docker/) or [Podman](https://podman.io/) installed and running. `nic` detects the runtime automatically (if more than one is installed, Docker is used). There is no `kind` binary to install.

:::tip
Everything runs on your machine, so give the container runtime some headroom. Roughly 4 CPU cores and 8 GB of RAM is a comfortable starting point, and a cluster running many software packs will want more. This is a practical recommendation, not a hard requirement.
:::

### Free host ports

The gateway listens on `127.0.0.1:80` and `127.0.0.1:443`. Make sure nothing else on your machine is using those ports, or pick other ports in your config (see [Configuration](#configuration)). Rootless Docker and Podman cannot bind ports below 1024, so on a rootless runtime you must pick higher ports such as `8080` and `8443`.

### Install nic

Follow the [Install NIC](/docs/get-started/install/) guide to download and install the `nic` CLI for your platform.

### GitOps repository

Unlike the cloud providers, a local deployment does not need a remote GitOps repository or any credentials in a `.env` file. With `repository: { local: {} }` in your config (as in the starter config below), `nic` creates a Git repository at `~/.nic/gitops/<project_name>` and mounts it into the cluster for ArgoCD to read.

## Configuration

Download the starter config from `nebari-infrastructure-core`:

- **[`local-config.yaml`](https://github.com/nebari-dev/nebari-infrastructure-core/blob/main/examples/local-config.yaml)**.

```bash
curl -O https://raw.githubusercontent.com/nebari-dev/nebari-infrastructure-core/main/examples/local-config.yaml
```

:::note
In later steps, `<config-file>` refers to this local copy (`local-config.yaml`).
:::

A local config needs very little. A minimal file looks like this:

```yaml
project_name: my-nebari-local
domain: nebari.local              # not real DNS; you point it at 127.0.0.1 below

certificate:
  type: selfsigned                # the default for local deployments

cluster:
  local: {}                       # kind defaults: one node, ports 80 and 443

repository:
  local: {}                       # auto-created at ~/.nic/gitops/<project_name>
```

The `repository` section is required. `local: {}` is the zero-configuration choice and the one we recommend while developing. You can also set `repository.local.path` to use a Git repository somewhere else on your machine (it then also needs a matching `cluster.local.kind.extra_mounts` entry, as the starter config explains), or use a remote repository with `repository.existing`, as on the [cloud providers](/docs/how-tos/prepare-to-deploy/#gitops-repository).

There are no node groups to size, no region, and no `kubernetes_version` field. The Kubernetes version comes from the kind node image, which defaults to the image of the kind version bundled with `nic`. Everything under `cluster.local` is optional:

```yaml
cluster:
  local:
    http_port: 8080               # default 80
    https_port: 8443              # default 443
    kind:
      node_image: kindest/node:v1.35.0   # pin a Kubernetes version
      extra_mounts:                      # host directories mounted into every node
        - host_path: /absolute/host/path
          container_path: /absolute/node/path
          read_only: true
```

For every field, see the [local provider configuration reference](https://github.com/nebari-dev/nebari-infrastructure-core/blob/main/docs/configuration/local.md) and the upstream [local kind development guide](https://github.com/nebari-dev/nebari-infrastructure-core/blob/main/docs/local-kind-development.md).

:::caution
Unknown keys under `cluster.local` are silently ignored rather than rejected, so a typo such as `node_iamge` passes `nic validate` and has no effect. If a setting does not seem to take effect, check the field name against the reference.
:::

### Multi-node clusters

By default the cluster is a single node that runs everything. To exercise scheduling, node selectors, or anti-affinity, add worker nodes with `kind.node_groups`:

```yaml
cluster:
  local:
    kind:
      node_groups:
        general:
          count: 1
        infra:
          count: 1
          labels:
            dedicated: infra
```

`nic` always creates exactly one control-plane node; `node_groups` adds workers only. Every worker is labeled `nebari.dev/node-group: <group name>`, so a workload can target a group with a `nodeSelector`. On Linux, multi-node clusters can run into the host's inotify limits; see the [kind known issues](https://kind.sigs.k8s.io/docs/user/known-issues/#pod-errors-due-to-too-many-open-files) if workers stay `NotReady` or pods fail with "too many open files".

## Deploy

Run the deploy commands as described in [Deploy a cluster](/docs/how-tos/deploy-cluster/#deploy). The first deployment pulls the kind node image and creates the cluster, then ArgoCD syncs the foundational services. If a cluster with the same name already exists, `nic deploy` reuses it.

When the deploy finishes, `nic` prints a **hosts file** line for you to add (see [Access](#access)).

## Verify

kind adds the cluster to your default kubeconfig under the context `kind-<project_name>`:

```bash
kubectl config use-context kind-<project_name>
```

You can also write a standalone kubeconfig with `nic kubeconfig -f <config-file> -o kubeconfig.yaml`, as in [Retrieve the kubeconfig](/docs/how-tos/deploy-cluster/#retrieve-the-kubeconfig). Then follow the [Verify](/docs/how-tos/deploy-cluster/#verify) steps to check the cluster and its ArgoCD applications.

To check end to end that the gateway is reachable from your machine, run:

```bash
nic outputs -f <config-file> --wait
```

It succeeds only once an HTTPS request to `127.0.0.1` with your domain reaches the gateway, and it prints the platform's entry points (the domain, the Keycloak issuer URL, and the gateway address).

## Access

`domain` (for example `nebari.local`) is not a real DNS name, so you point it at your own machine. Add the line `nic deploy` printed to your `/etc/hosts` file:

```
127.0.0.1 nebari.local keycloak.nebari.local argocd.nebari.local
```

Then open `https://nebari.local` (or `https://nebari.local:<https_port>` if you changed the port). `/etc/hosts` has no wildcard support, so when you later expose a service on another subdomain, add that hostname to the same line.

:::tip[Skip the hosts file]
Set `domain` to a name under a public loopback domain such as [lvh.me](https://lvh.me) (for example `domain: nebari.lvh.me`). Every subdomain of it already resolves to `127.0.0.1`, so you do not need to edit `/etc/hosts`. This needs internet access for DNS, and some routers block DNS answers that point at `127.0.0.1`, which is why `/etc/hosts` stays the default.
:::

Because the certificate is self-signed, your browser warns you the first time you visit each hostname. You can accept the exception for a local cluster, or follow the next section to avoid the warning entirely.

## Use a locally-trusted certificate (optional)

The self-signed certificate is fine for a quick look, but you can avoid the browser warning with [mkcert](https://github.com/FiloSottile/mkcert). mkcert installs a local certificate authority (CA) that your browser trusts and issues certificates signed by it, so `https://nebari.local` gets a normal padlock.

First, [install mkcert](https://github.com/FiloSottile/mkcert#installation) and trust its local CA (a one-time step):

```bash
mkcert -install
```

Then generate a certificate that covers your domain. NKP serves some services on subdomains (`keycloak.<domain>`, `argocd.<domain>`), so include a wildcard alongside the apex; a wildcard on its own does not match the bare `nebari.local`:

```bash
mkcert nebari.local "*.nebari.local"
# writes nebari.local+1.pem and nebari.local+1-key.pem in the current directory
```

Point your config at those files with `certificate.type: existing`, using absolute paths:

```yaml
certificate:
  type: existing
  files:
    cert_file: /absolute/path/to/nebari.local+1.pem
    key_file: /absolute/path/to/nebari.local+1-key.pem
```

Deploy (or re-deploy) with this config. `nic` reads the two files from your machine and installs them as the gateway's TLS certificate, and because you trusted the local CA with `mkcert -install`, `nebari.local` and its subdomains load without a warning. Re-running `nic deploy` with new files replaces the certificate in place.

For the other ways to supply a certificate (environment variables or a pre-created secret), see the upstream [custom TLS certificate guide](https://github.com/nebari-dev/nebari-infrastructure-core/blob/main/docs/custom-tls-certificate.md).

## First sign-in

See [Keycloak authentication](/docs/how-tos/keycloak-auth/) for first sign-in.

## Change a local cluster

To change what runs on the cluster, edit your config and re-run `nic deploy` as described in [Update a cluster](/docs/how-tos/update-cluster/).

The kind cluster itself is fixed when it is first created. Changes to `http_port`, `https_port`, `node_image`, `extra_mounts`, or `node_groups` only take effect after you recreate the cluster with `nic destroy` followed by `nic deploy`. That includes upgrading Kubernetes: there is no in-place upgrade, so set a newer `node_image` and recreate.

:::caution
If the ports in your config no longer match the ones the cluster was created with, `nic deploy` fails instead of deploying a gateway your machine cannot reach. Destroy and recreate the cluster to apply the new ports.
:::

## Destroy

Run the destroy commands as described in [Destroy a cluster](/docs/how-tos/destroy-cluster/).

`nic destroy` deletes the kind cluster's containers and removes the `kind-<project_name>` context from your kubeconfig. Because everything runs locally, there are no cloud resources to clean up afterward. Two things are left in place on purpose:

- **The local GitOps repository** at `~/.nic/gitops/<project_name>`; `nic destroy` prints its path. Delete the directory by hand if you do not want to reuse it.
- **The `kind` container network**, which kind shares between clusters. If you have no other kind clusters, you can remove it with `docker network rm kind` (or `podman network rm kind`).
