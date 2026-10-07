---
title: Local (kind)
description: Run NKP on your own machine with kind (Kubernetes in Docker) for development and testing, from first deploy to teardown.
---

NKP has a **local mode** that runs the whole platform on a single machine (a laptop, a workstation, or a VM) without a cloud account. It is meant for developing against NKP, previewing what it does, or debugging a configuration with a quick feedback loop. It is not for production: everything a cloud would provide (managed Kubernetes, load balancers, managed storage) is stood up locally instead, so it does not match a real deployment one-for-one.

This guide walks you through running NKP locally with `nic` (the Nebari Infrastructure Core CLI) on [kind](https://kind.sigs.k8s.io/).

:::note[Upcoming]
This page describes the current `nic` release. The next release changes how you reach a local cluster: the gateway is published on `127.0.0.1` instead of an address on the container network, so local clusters also work on macOS and Windows, and MetalLB is no longer installed. It also adds worker nodes for multi-node testing. This page will be updated when that release ships.
:::

## What is kind?

[kind](https://kind.sigs.k8s.io/) ("Kubernetes in Docker") runs a Kubernetes cluster inside containers on your machine. It was built for testing Kubernetes itself, and it also makes a good local target: it starts fast, needs no cloud resources, and tears down cleanly.

`nic` **embeds** the kind library, so you do **not** install the `kind` CLI separately; `nic` drives your container runtime for you.

## What you get

When `nic deploy` finishes, you will have a local cluster with the [standard NKP services](/docs/how-tos/deploy/#what-every-deployment-includes) plus:

- **A single-node kind cluster** running in your container runtime.
- **Local-path storage** (kind's built-in `standard` StorageClass) for persistent volumes. Longhorn is not installed locally, so there are no volume backups.
- **The gateway on a MetalLB address** on the kind container network, which your machine reaches directly.
- **A local GitOps repository** that `nic` creates and mounts for you, so you do not need a remote Git repository to get started.
- **Self-signed certificates** for every hostname, so your browser shows a warning the first time you open each one.

Some things that work on a cloud cluster do not work locally yet. Signing in to Argo CD through Keycloak, and packs whose pods call Keycloak themselves (such as the data science and apps packs), do not work out of the box: `keycloak.<domain>` resolves only on your machine, not inside the cluster, and pods do not trust the self-signed certificates. GPU workloads are not available.

## Prerequisites

### A Linux machine with a container runtime

kind runs Kubernetes inside containers, so you need [Docker](https://docs.docker.com/engine/install/) or [Podman](https://podman.io/) installed and running. `nic` detects the runtime automatically (if more than one is installed, Docker is used). There is no `kind` binary to install.

Your machine must be able to reach the kind container network directly, because that is where the gateway's address lives. This is the case for Docker Engine and rootful Podman on Linux. Docker Desktop on macOS and Windows, and rootless runtimes, keep that network out of reach of the host, so the platform is not reachable from your browser there (see the note at the top of this page).

:::tip
Everything runs on your machine, so give the container runtime some headroom. Roughly 4 CPU cores and 8 GB of RAM is a comfortable starting point, and a cluster running many software packs will want more. This is a practical recommendation, not a hard requirement.
:::

### Install nic

Follow the [Install NIC](/docs/get-started/install/) guide to download and install the `nic` CLI.

### GitOps repository

Unlike the cloud providers, a local deployment does not need a remote GitOps repository or any credentials in a `.env` file. With `repository: { local: {} }` in your config (as in the starter config below), `nic` creates a Git repository at `~/.nic/gitops/<project_name>` and mounts it into the cluster for Argo CD to read.

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
project_name: my-nebari-local     # also names the kind cluster and its kubectl context
domain: nebari.local              # not real DNS; you map it in /etc/hosts below

certificate:
  type: selfsigned

cluster:
  local: {}                       # kind defaults: one node, bundled node image

repository:
  local: {}                       # auto-created at ~/.nic/gitops/<project_name>
```

The `repository` section is required. `local: {}` is the zero-configuration choice and the one to use while developing. You can also set `repository.local.path` to use a Git repository somewhere else on your machine (it then also needs a matching `cluster.local.kind.extra_mounts` entry, as the starter config explains), or use a remote repository with `repository.existing`, as on the [cloud providers](/docs/how-tos/prepare-to-deploy/#gitops-repository).

There are no node groups to size, no region, and no `kubernetes_version` field. The Kubernetes version comes from the kind node image, which defaults to the image of the kind version bundled with `nic` (Kubernetes 1.36 for the kind v0.32.0 that `nic` bundles today). Everything under `cluster.local` is optional:

```yaml
cluster:
  local:
    kind:
      # Pin a Kubernetes version. Use an image from the release notes of the
      # kind version nic bundles, pinned by digest.
      node_image: kindest/node:v1.35.5@sha256:ce977ae6d65918d0b58a5f8b5e940429c2ce42fa3a5619ec2bbc60b949c0ac95
      extra_mounts:                      # host directories mounted into the node
        - host_path: /absolute/host/path
          container_path: /absolute/node/path
          read_only: true
    metallb:
      address_pool: 172.18.255.100-172.18.255.110   # default: derived from the kind network
```

For every field, see the [local provider configuration reference](https://github.com/nebari-dev/nebari-infrastructure-core/blob/main/docs/configuration/local.md).

:::caution
Unknown keys under `cluster.local` are silently ignored rather than rejected, so a typo such as `node_iamge` passes `nic validate` and has no effect. If a setting does not seem to take effect, check the field name against the reference.
:::

## Deploy

Run the deploy commands as described in [Deploy a cluster](/docs/how-tos/deploy-cluster/#deploy). The first deployment pulls the kind node image and creates the cluster, then Argo CD syncs the foundational services. If a cluster with the same name already exists, `nic deploy` reuses it.

When the deploy finishes, `nic` prints a **DNS CONFIGURATION REQUIRED** block with two `A` records, one for your domain and one for `*.<domain>`, both pointing at the gateway's address. On a local cluster you do not create real DNS records; you use that address in your hosts file (see [Access](#access)).

## Verify

Unlike on the cloud providers, creating the kind cluster adds the `kind-<project_name>` context to your default kubeconfig and makes it the current context. To switch back to it later, run:

```bash
kubectl config use-context kind-<project_name>
```

You can also write a standalone kubeconfig with `nic kubeconfig -f <config-file> -o kubeconfig.yaml`, as in [Retrieve the kubeconfig](/docs/how-tos/deploy-cluster/#retrieve-the-kubeconfig). Then follow the [Verify](/docs/how-tos/deploy-cluster/#verify) steps to check the cluster and its Argo CD applications.

To print the platform's entry points, run:

```bash
nic outputs -f <config-file> --wait
```

`--wait` keeps polling until every value is available. The output lists the domain, the Keycloak issuer URL, the **gateway address** you need for the next step, and the Keycloak and Argo CD admin passwords (redacted unless you add `--show-secrets`).

## Access

`domain` (for example `nebari.local`) is not a real DNS name, so you map it to the gateway address yourself. Add a line like this to your `/etc/hosts` file, using the gateway address from the deploy output or `nic outputs`:

```
172.18.255.100 nebari.local keycloak.nebari.local argocd.nebari.local
```

Then open `https://nebari.local`. Your browser warns about the self-signed certificate on each hostname the first time; accept the exception for a local cluster.

`/etc/hosts` has no wildcard support, so when you deploy a software pack or expose a service on another subdomain, add that hostname to the same line.

## First sign-in

See [Keycloak authentication](/docs/how-tos/keycloak-auth/) for first sign-in. To open Argo CD, sign in as `admin` with the password from `nic outputs -f <config-file> --show-secrets` rather than through Keycloak.

## Change a local cluster

To change what runs on the cluster, edit your config and re-run `nic deploy` as described in [Update a cluster](/docs/how-tos/update-cluster/).

The kind cluster itself is fixed when it is first created. Changes to `node_image` or `extra_mounts` only take effect after you recreate the cluster with `nic destroy` followed by `nic deploy`. That includes upgrading Kubernetes: there is no in-place upgrade, so set a newer `node_image` and recreate.

The local GitOps repository survives `nic destroy`, and `nic deploy` does not rewrite the manifests in a repository it has already set up. If you change `domain` or `certificate.type`, deploy with `--regen-apps` so the manifests pick up the new values:

```bash
nic deploy -f <config-file> --regen-apps
```

:::caution
`--regen-apps` rewrites the files `nic` generated in the GitOps repository, so edits you made to those files are lost. Your own files under `values/<app>/` (other than the generated `base.yaml`) are kept.
:::

## Destroy

Run the destroy commands as described in [Destroy a cluster](/docs/how-tos/destroy-cluster/).

`nic destroy` deletes the kind cluster's containers and removes the `kind-<project_name>` context from your kubeconfig. Because everything runs locally, there are no cloud resources to clean up afterward. Two things are left in place on purpose:

- **The local GitOps repository** at `~/.nic/gitops/<project_name>`; `nic destroy` prints its path. Delete the directory by hand if you do not want to reuse it.
- **The `kind` container network**, which kind shares between clusters. If you have no other kind clusters, you can remove it with `docker network rm kind` (or `podman network rm kind`).

Remember to remove the line you added to `/etc/hosts`.

## Next steps

- Browse the available software packs at [packs.nebari.dev](https://packs.nebari.dev) and [deploy one](/docs/software-packs/build-your-own/#deploying-a-pack) to your local cluster.
- When you are ready for a real deployment, pick a [cloud provider](/docs/how-tos/providers/).
