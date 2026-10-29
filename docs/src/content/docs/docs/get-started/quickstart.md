---
title: Quickstart
description: Deploy a Nebari Kubernetes Platform cluster on your own machine with nic, open its landing page, and tear it down again. Free, with no cloud account needed.
---

This quickstart takes you from a single config file to a full [Nebari Kubernetes Platform (NKP)](/docs/references/glossary/#nkp) running on your own machine, with sign-in, routing, and GitOps already set up. It takes about 15 minutes, costs nothing, and needs no cloud account.

## Before you start

You'll need:

1. [Docker](https://docs.docker.com/get-docker/), which runs the cluster on your machine. Start it before you deploy. On macOS, turn on **Allow privileged port mapping** in Docker Desktop, or [use Colima](/docs/how-tos/providers/local/#docker-or-colima) instead.
2. [`nic`](/docs/get-started/install/), which creates the cluster and installs the platform.
3. [`kubectl`](https://kubernetes.io/docs/tasks/tools/), which lets you check that the cluster is healthy.

## Step 1: Get the configuration

`nic` deploys from a single YAML file, and there's a [starter file for each provider](https://github.com/nebari-dev/nebari-infrastructure-core/tree/main/examples), such as AWS, Hetzner, or your own machine. This quickstart uses the local one. Download it into an empty directory:

```bash
curl -O https://raw.githubusercontent.com/nebari-dev/nebari-infrastructure-core/main/examples/local-config.yaml
```

The defaults work as is, so you don't need to edit anything. To change settings such as the domain, see the [local guide](/docs/how-tos/providers/local/#configuration).

## Step 2: Check the configuration

To catch typos and missing fields before deploying, check the file:

```bash
nic validate -f local-config.yaml
```

You should see:

```text
✓ Configuration file is valid
  Provider: local
  Project: my-nebari-local
```

## Step 3: Deploy

With the configuration valid, deploy the cluster and install the platform:

```bash
nic deploy -f local-config.yaml
```

While it runs, `nic`:

- creates a Kubernetes cluster inside Docker
- sets up a Git repository on your disk at `~/.nic/gitops/my-nebari-local`
- starts ArgoCD, which installs sign-in, routing, and certificates from the Git repository

At the end, `nic` prints a line to add to `/etc/hosts`, the file that tells your computer where to find a hostname:

```text
  HOSTS FILE CONFIGURATION REQUIRED

  Point the platform hostnames at it by adding this line to /etc/hosts:

    127.0.0.1 nebari.local keycloak.nebari.local argocd.nebari.local
```

To add it on macOS or Linux, run:

```bash
echo "127.0.0.1 nebari.local keycloak.nebari.local argocd.nebari.local" | sudo tee -a /etc/hosts
```

## Step 4: Confirm it worked

To check the cluster, you'll use `kubectl`. First, save the cluster's connection details to a file and point `kubectl` at it:

```bash
nic kubeconfig -f local-config.yaml -o kubeconfig.yaml
export KUBECONFIG=$(pwd)/kubeconfig.yaml
```

To check that everything `nic` installed is healthy, ask ArgoCD:

```bash
kubectl get applications -n argocd
```

You should see something like this:

```text
NAME                      SYNC STATUS   HEALTH STATUS
cert-manager              Synced        Healthy
gateway-config            OutOfSync     Healthy
keycloak                  OutOfSync     Healthy
nebari-landingpage        Synced        Healthy
...
```

Within a few minutes, every application should show `Healthy`. Some may stay `OutOfSync`, which is normal.

## Step 5: Open the landing page

The landing page is where your team will sign in and find every app you add to the platform. Right now it's empty, since no apps are installed yet.

Open `https://nebari.local`. Skip past the browser's privacy warning by choosing **Advanced**, then continuing.

You'll see your platform's sign-in page:

![The Nebari sign-in page, with fields for username or email and password, and a Sign In button.](/img/get-started/quickstart-sign-in.webp)

To create a user and sign in, see [Keycloak authentication](/docs/how-tos/keycloak-auth/).

## Step 6: Tear it down

When you're done exploring, delete the cluster to free up your machine's memory and CPU. You can redeploy it anytime with Step 3.
To tear it down, delete the cluster:

```bash
nic destroy -f local-config.yaml
```

`nic` asks for confirmation, then deletes the cluster. Two things stay on your machine:

- The GitOps repository `nic` created at `~/.nic/gitops/my-nebari-local`. The next deploy reuses its files, including any packs you added. Delete it to start from scratch.
- The `/etc/hosts` line from Step 3, which points the `nebari.local` hostnames at your machine. Keep it if you'll deploy locally again. Otherwise, run `sudo nano /etc/hosts` and delete that line.

## Ready for the cloud?

A local cluster is great for trying things out, but only you can reach it. To give your team a platform that's always online, deploy to a cloud provider.

The provider guides walk you through the full setup with a real config file:

- [Hetzner](/docs/how-tos/providers/hetzner/): the simplest and cheapest place to start.
- [AWS](/docs/how-tos/providers/aws/): if your team already uses AWS.

## Next steps

- **Add apps:** deploy again (Steps 3 to 5), then [install a Software Pack](/docs/software-packs/deploy-a-pack/), such as notebooks or dashboards. Browse the [catalog](/docs/software-packs/) to see what's available.
- **Understand what you just built:** read [NKP architecture](/docs/explanations/nkp-architecture/).
