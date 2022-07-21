# Troubleshooting

Invariably you will encounter behavior that does not match your expectations. This guide is meant to explain that behavior, help you diagnose it, and if possible resolve it.

## DNS domain=your_nebari_domain record does not exist

## Conda-Store environment fails to build

## Get Kubernetes Context

Depending on a variety of factors, `kubectl` may not be able to access your Kubernetes cluster. To configure this utility for access, depending on your cloud provider:

### [Digital Ocean](https://www.digitalocean.com/docs/kubernetes/how-to/connect-to-cluster/)
1. [Download the Digital Ocean command line utility](https://www.digitalocean.com/docs/apis-clis/doctl/how-to/install/).
2. If you haven't already, create a [Digital Ocean API token](https://www.digitalocean.com/docs/apis-clis/doctl/how-to/install/).
3. [Authenticate via the API token](https://www.digitalocean.com/docs/apis-clis/doctl/how-to/install/): `doctl auth init`
4. Run the following command: `doctl kubernetes cluster kubeconfig save "<project-name>-<namespace>"`

### [Google Cloud Platform](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl)
1. Download the [GCP SDK](https://cloud.google.com/sdk/downloads).
2. Authenticate with GCP: `gcloud init`
3. Run the following command: `gcloud container clusters get-credentials <project-name>-<namespace> --region <region>`

### [Amazon Web Services](https://docs.aws.amazon.com/eks/latest/userguide/create-kubeconfig.html)
1. Download the [AWS CLI](https://aws.amazon.com/cli/).
2. If you haven't already, [create an AWS Access Key and Secret Key](https://aws.amazon.com/premiumsupport/knowledge-center/create-access-key/).
3. Run the following command: `aws eks --region <region-code> update-kubeconfig --name <project-name>-<namespace>`

After completing these steps according to your cloud provider, `kubectl` should be able to access your Kubernetes cluster.

## Debugging your Kubernetes Cluster

If you need more information about your Kubernetes cluster, [`k9s`](https://k9scli.io/) is a terminal-based UI that is extremely useful for debugging. It simplifies navigating, observing, and managing your applications in Kubernetes. `k9s` continuously monitors Kubernetes clusters for changes and provides shortcut commands to interact with the observed resources. It's a fast way to review and resolve day-to-day issues in Kubernetes, a huge improvement to the general workflow, and a best-to-have tool for debugging your Kubernetes cluster sessions.

[Installation instructions for macOS, Windows, and Linux](https://github.com/derailed/k9s) are available.

By default, `k9s` starts with the standard directory that's set as the context (in this case Minikube). To view all the current process press 0:

![Image of the k9s terminal UI](../static/images/k9s_UI.png)

> **NOTE**: In some circumstances, you will be confronted with the need to inspect any services launched by your cluster at your `localhost`. For instance, if your cluster has problem with the network traffic tunnel configuration, it may limit or block the user’s access to destination resources over the connection.

`k9s` port-forward option <kbd>shift</kbd> + <kbd>f</kbd> allows you to access and interact with internal Kubernetes cluster processes from your localhost you can then use this method to investigate issues and adjust your services locally without the need to expose them beforehand.