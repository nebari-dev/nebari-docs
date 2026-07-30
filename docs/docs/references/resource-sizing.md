---
title: Resource sizing
id: resource-sizing
description: Default CPU and memory requests and limits for NKP's foundational software, what each component's usage scales with, and how to change them.
---

# Resource sizing

Every Nebari Kubernetes Platform (NKP) deployment installs a set of foundational software before any Software Pack runs: ArgoCD, cert-manager, trust-manager, Keycloak and its database, CloudNativePG, Envoy Gateway, the OpenTelemetry collector, the Nebari Operator, the landing page, and optionally MetalLB and Longhorn.

This page documents the default resource requests and limits for that software, what each component's usage grows with, and how to change a value when a default does not fit your cluster.

The numbers come from an [audit of a fresh install](https://github.com/nebari-dev/nebari-infrastructure-core/issues/456) measured at idle, cross-checked against each project's own sizing guidance, then re-verified on a live cloud cluster.
Idle usage is a floor rather than a target, so the defaults add headroom for sign-in bursts, TLS certificate issuance, and reconciliation spikes.

## The limits policy

Three rules explain why the table below looks the way it does.

**Every pod gets CPU and memory requests.**
Requests drive scheduling, node sizing, and cluster autoscaler decisions.
A pod with no requests runs at BestEffort priority, which makes it the first thing evicted when a node comes under pressure.

**Every pod gets a memory limit.**
Memory is incompressible, so a pod that leaks without a limit degrades the whole node instead of being restarted cleanly.
For two components the memory limit does more than protect the node.
Keycloak sizes its Java Virtual Machine (JVM) heap as 70% of the container memory limit, and the OpenTelemetry collector derives its Go memory ceiling from the same value, so removing either limit also removes that component's own protection.

**Control-plane components get CPU limits, but the Envoy data-plane proxies and Keycloak do not.**
CPU is compressible, so a pod that exceeds its request is throttled fairly under contention anyway.
A hard CPU limit mainly adds tail latency, which is the wrong trade-off for the request path and for sign-in bursts, because those are the moments when latency is most visible to your users.

## Default values

| Component               | Pod                                                       | CPU request | Memory request | CPU limit | Memory limit |
| ----------------------- | --------------------------------------------------------- | ----------- | -------------- | --------- | ------------ |
| ArgoCD                  | application-controller                                    | 100m        | 512Mi          | 500m      | 1Gi          |
| ArgoCD                  | repo-server                                               | 25m         | 128Mi          | 500m      | 512Mi        |
| ArgoCD                  | server                                                    | 25m         | 64Mi           | 200m      | 128Mi        |
| ArgoCD                  | applicationset-controller                                 | 25m         | 64Mi           | 200m      | 128Mi        |
| ArgoCD                  | redis                                                     | 25m         | 64Mi           | 200m      | 128Mi        |
| ArgoCD                  | notifications-controller                                  | 25m         | 64Mi           | 200m      | 128Mi        |
| ArgoCD                  | dex                                                       | disabled    |                |           |              |
| cert-manager            | controller                                                | 25m         | 64Mi           | 200m      | 256Mi        |
| cert-manager            | webhook                                                   | 10m         | 32Mi           | 100m      | 128Mi        |
| cert-manager            | cainjector                                                | 10m         | 64Mi           | 200m      | 256Mi        |
| trust-manager           | controller                                                | 50m         | 64Mi           | 200m      | 256Mi        |
| Keycloak                | keycloak                                                  | 250m        | 1Gi            | none      | 2Gi          |
| PostgreSQL              | primary, backing Keycloak                                 | 250m        | 512Mi          | 1000m     | 1Gi          |
| CloudNativePG           | operator                                                  | 100m        | 256Mi          | 500m      | 512Mi        |
| Envoy Gateway           | controller                                                | 50m         | 128Mi          | 500m      | 512Mi        |
| Envoy Gateway           | proxy, one per Gateway                                    | 100m        | 128Mi          | none      | 512Mi        |
| MetalLB                 | controller                                                | 25m         | 64Mi           | 100m      | 128Mi        |
| MetalLB                 | speaker, one per node                                     | 50m         | 128Mi          | 200m      | 256Mi        |
| MetalLB                 | speaker frr sidecars                                      | 25m         | 64Mi           | 100m      | 128Mi        |
| OpenTelemetry collector | agent, one per node                                       | 50m         | 256Mi          | 250m      | 512Mi        |
| Nebari Operator         | manager                                                   | 10m         | 64Mi           | 200m      | 128Mi        |
| Longhorn                | longhorn-manager, one per node                            | 50m         | 128Mi          | 500m      | 512Mi        |
| Longhorn                | CSI sidecars: attacher, provisioner, resizer, snapshotter | 10m         | 32Mi           | 100m      | 128Mi        |

NKP disables the ArgoCD dex pod entirely, because it wires ArgoCD's sign-in directly to Keycloak and never uses dex.

The ArgoCD application-controller also receives a `GOMEMLIMIT` environment variable set to 90% of its memory limit.
`GOMEMLIMIT` is a soft ceiling that prompts the Go runtime to collect garbage before the hard limit stops the pod, and it is [ArgoCD's recommended way to avoid controller restarts under memory pressure](https://argo-cd.readthedocs.io/en/latest/operator-manual/high_availability/).

:::note
If you raise the application-controller's memory limit, raise `GOMEMLIMIT` to match.
Changing the limit on its own moves the point at which the pod stops, without giving the Go runtime any reason to reclaim memory sooner.
:::

**Storage.** The Keycloak database requests a 10Gi volume.
A small deployment needs far less, but volumes grow and never shrink, and the cost is small, so the default stays.

**Replicas.** Every component runs a single replica by default, which suits a base deployment.
To learn what to change first when you outgrow that, read [Scaling up](#scaling-up).

## What each component's usage grows with

**ArgoCD application-controller.**
Memory grows with the number of Kubernetes resources the controller caches, which follows the size of your cluster rather than the number of Software Packs you install.
This is the component most likely to need attention on a large or busy cluster.
A managed cloud cluster carries many more API objects than a single-node one, because cloud controllers and storage drivers add their own custom resources, and the controller watches all of them.
Expect roughly 230Mi to 290Mi at idle on a base deployment, with higher spikes during reconciliation.

**ArgoCD repo-server.**
Memory spikes while generating manifests.
If a sync stops with an out-of-memory error, raise this component's memory limit before changing anything else.

**cert-manager controller and cainjector.**
Both cache TLS Secrets in memory, so their memory use follows the number and size of the certificates in your cluster.
Frequent certificate renewal also raises controller CPU.

**trust-manager.**
Usage follows the number and size of the trust bundles it distributes, which is one on a stock deployment, so this component stays close to flat.

**Keycloak.**
The official Keycloak sizing guidance states 1250MB of base memory per pod, covering realm caches and 10,000 cached sessions, and about 1 vCPU for every 15 password sign-ins per second.
The 250m CPU request is a scheduling floor, and because there is no CPU limit, a sign-in burst can use idle capacity on the node.
If you expect sustained sign-in load, raise the CPU request and review the database values as well, because Keycloak's guidance budgets 0.35 to 0.7 vCPU on the database for every 100 sign-in requests per second.

**PostgreSQL.**
This database backs Keycloak and the Nebari Operator, and your Software Packs do not use it.
Idle usage sits near 10m and 50Mi, comfortably under the request, which is sized for sign-in bursts rather than for idle.

**CloudNativePG.**
This is an operator-only installation, so its usage follows the number of database clusters it manages rather than any database traffic.

**Envoy Gateway controller.**
Configuration state grows with the number of routes and backends.
Idle usage sits under 40Mi, and hundreds of routes raise it.

**Envoy proxy, the data plane.**
Memory grows with the number of open connections and the size of the route table.
The default replaces Envoy Gateway's own 512Mi request with a 128Mi request and a 512Mi ceiling, because idle usage is around 40Mi.

**OpenTelemetry collector.**
This runs as one agent per node, so memory follows how many pods and nodes each agent collects from.
Expect roughly 230Mi on a managed cloud cluster against the 256Mi request.

**Longhorn.**
The largest cost here is not a pod default but the **Guaranteed Instance Manager CPU** setting.
By default, Longhorn reserves 12% of every node's allocatable CPU for an instance manager pod on that node, which is around 480m on a 4 vCPU node, reserved before you create a single volume.
The v2 data engine reserves a flat 1250m instead.
Longhorn's own minimum requirements still apply: 3 nodes, with 4 vCPU and 4GiB of RAM each.
The `longhorn-csi-plugin` pods carry no limits on purpose, because they handle volume mounts on each node and throttling them delays those mounts.

## How to change the defaults

These values ship inside the `nic` command-line interface (CLI), so most of them are not settings in your Nebari configuration file.
You have two ways to change them.

**For a cluster you have already deployed**, edit the values in the GitOps repository.
ArgoCD reconciles the cluster from that repository, so your change takes effect on the next sync and stays in place until a later deployment overwrites it.

**One value is available in your configuration file.**
`instance_manager_cpu_percent` sets Longhorn's Guaranteed Instance Manager CPU reservation described above.
It accepts a whole number from 0 to 40 and defaults to Longhorn's own value of 12.
Setting it to 0 removes the reservation, which frees the CPU but reduces volume performance when nodes are under CPU pressure:

```yaml
cluster:
  # ...
  storage:
    longhorn:
      instance_manager_cpu_percent: 5
```

If a default turns out to be wrong for a whole class of deployment rather than for your cluster alone, [open an issue against the infrastructure CLI](https://github.com/nebari-dev/nebari-infrastructure-core/issues) so that the shipped default improves for everyone.

## Scaling up

**ArgoCD.**
Prefer its own scaling controls over adding replicas blindly.
Shard the application-controller across replicas when it manages many clusters, and add repo-server replicas when generating manifests is the bottleneck.

**Keycloak.**
Configure Infinispan cache clustering before you add a replica, because a second replica without it does not share sessions with the first.
Raise memory and CPU on the single pod first.

**Envoy proxy.**
Proxy replicas are the first availability improvement to make for the gateway.
The controller runs happily at a single replica.

**PostgreSQL.**
Move to a larger instance shape before you consider read replicas, because Keycloak is the only meaningful client.

**MetalLB.**
The speaker runs on every node by design, and the controller stays at a single replica.

## Related pages

- [Debug a deployment](/docs/how-tos/debug-deployment): what to check when a foundational pod restarts or fails to start
- [NKP architecture](/docs/explanations/nkp-architecture): how the foundational layer fits under the operator and Software Packs
- [Deploy a cluster](/docs/how-tos/deploy-cluster): where the configuration file shown above lives
