---
id: nebari-local-development
title: Local development with Kind and Nebari
description: Deploying Nebari on a local development environment with Kind
---

## What is Kind ?

[kind](https://kind.sigs.k8s.io/) is a tool for running local Kubernetes clusters using Docker container “nodes”.
kind was primarily designed for testing Kubernetes itself, but may be used for local development or CI.

### Why kind?

- kind supports multi-node (including HA) clusters
- kind supports building Kubernetes release builds from source
  - support for make / bash or docker, in addition to pre-published builds
- kind supports Linux, macOS and Windows
- kind is a [CNCF certified conformant Kubernetes installer](https://landscape.cncf.io/?selected=kind)

## Deploying Nebari with local mode

Qhub supports a `local` mode which helps you to develop and test Nebari on any environment, which can vary from a simple VM, a laptop or a large multi-node ecosystem. Localy deploying Qhub allows quicker feedback loops for development, as well as being less expensive than running cloud Kubernetes clusters.

:::note
It’s important to highlight that while it’s possible to test most of QHub with this version, components that are Cloud provisioned such as VPCs, managed Kubernetes cluster and managed container registries can’t be locally tested, due to their Cloud dependencies.
:::

### Compatibility

Qhub integrates Kind under the hood by using its Terraform provider and a proper `local` deployment method. Which grants native OS compatibility with Linux and MacOS. Windows is also supported by Kind, but Qhub itself currently does not support it.

- To use kind, you will also need to install [docker engine](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository).

:::note
While `kubectl` is not required for Kind to work, we do recommended its installation as it provides an excellent interface for interacting with the cluster resources. To install kubectl see the [upstream kubectl installation docs](https://kubernetes.io/docs/tasks/tools/install-kubectl/).
:::

### Initializing Qhub

:::note
The following steps assume you have:

1. an installed version of Qhub, for any directions please visit [Install Nebari](/getting-started/installing-nebari) section,
2. confirmed that `nebari` is successfully installed in your environment.
   :::

3. In your terminal, start by creating a new project folder. For this demonstration, we will name the new folder `nebari-local`:

   ```bash
   mkdir nebari-local && cd nebari-local
   ```

4. Executing the command below will generate a basic config file with an infrastructure based on **local**, with project name `projectname`, endpoint domain `domain`, and with the authentication mode set to **password**.

   ```bash
   qhub init local \
    --project projectname \
    --domain domain \
    --auth-provider password \
    --terraform-state=local
   ```

   Where `--terraform-state=local` is used to tell Qhub to store the Terraform state in the **local** filesystem.

:::note
Note You will be prompted to enter values for some of the choices above if they are absent from the command line arguments (for example, project name and domain)
:::

Once `qhub init` is executed, you should then be able to see the following output:

```bash
Securely generated default random password=*** for Keycloak root user
stored at path=/tmp/NEBARI_DEFAULT_PASSWORD
```

:::tip
The main `temp` folder on a MacOS system can be found by inspecting the value of `$TMPDIR`. This folder and its files are not meant to be user-facing and will present you
with a seemingly random directory path similar to `/var/folders/xx/xxxxx/T`
:::

You can see that Nebari is generating a random password for the root user of Keycloak. This password is stored in a temporary file and will be used to authenticate to the Keycloak
server once Nebari's infrastructure is fully deployed, in order to create the first user accounts for administrator(s).

The qhub initialization scripts create a `qhub-config.yaml` file that contains a collection of default preferences and settings for your deployment.

The generated `qhub-config.yaml` is the configuration file that will determine how the cloud infrastructure and Nebari is built and deployed in the next step. Since it is a
simple text file, you can edit it manually if you are unhappy with the choices you made during initialization, or delete it and start over again by re-running `qhub init`.

For additional information about the `qhub-config.yaml` file and extra flags that allow you to configure the initialization process, see the
[Understanding the qhub-config.yaml file](/tutorials) documentation.

### Setting up a DNS record for the domain

In order to deploy the infrastructure, we need to set up a DNS record for the `<domain>` you provided during initialization. This will be required for the infrastructure to be able to resolve the domain name. The local deployment sets the Ingress IP to `172.18.1.100` and assigns this to your domain.

To make this easier, open your `/etc/hosts` file with your favorite text editor and add the following line:

```bash
172.18.1.100 <domain>
```

:::tip
If you are a Linux user, you can use the `sudo` command to gain root privileges and then run the following command to add the above line to your `/etc/hosts` file:

```bash
sudo echo "172.18.1.100  <domain>" | sudo tee -a /etc/hosts
```

:::

## Deploying Nebari

With the `qhub-config.yaml` configuration file now created, Nebari can be deployed for the first time. Type the following command on your command line:

```bash
qhub deploy -c qhub-config.yaml --disable-prompt
```

If the deployment is successful, you will see the following output:

```bash
[terraform]: QHub deployed successfully
Services:
 - argo-workflows -> https://projectname.domain/argo/
 - conda_store -> https://projectname.domain/conda-store/
 - dask_gateway -> https://projectname.domain/gateway/
 - jupyterhub -> https://projectname.domain/
 - keycloak -> https://projectname.domain/auth/
 - monitoring -> https://projectname.domain/monitoring/
Kubernetes kubeconfig located at file:///tmp/NEBARI_KUBECONFIG
Kubecloak master realm username=root *****
...
```

#### Verify the local deployment

Finally, if everything is set properly you should be able to cURL the JupyterHub Server. Run

```
curl -k https://projectname.domain/hub/login
```

It’s also possible to visit https://projectname.domain in your web browser to select the deployment. As default for a local deployment the https certificates generated during deployments aren't signed by a recognized [Certificate Authority (CA)](https://en.wikipedia.org/wiki/Certificate_authority) and are self-signed by [Traefik](https://github.com/traefik/traefik) instead.

To switch the default behavior and use a [Let's Encrypt](https://letsencrypt.org/) signed certificate instead, you can update the following section in your `qhub-config.yaml` file, and then re-run `qhub deploy` as shown above:

```yaml
certificate:
  type: lets-encrypt
  acme_email: <your-email-address>
  acme_server: https://acme-v02.api.letsencrypt.org/directory
```

Note the above snippet can be automatically provisioned in your configuration if you provided the `--ssl-cert-email` flag when you ran qhub init.

:::note
Let’s Encrypt heavily rate limits their production endpoint and provisioning https certificates can often fail due to this limit.
:::

Several browsers makes it difficult to view a self-signed certificate that are not added to the certificate registry. So, if you do not want to use Let's Encrypt, you can use the following workarounds to properly view the pages:

A workaround for Firefox:

- Visit **about:config** and change the `network.stricttransportsecurity.preloadlist` to `false`

And a workaround for Chrome:

- Type **badidea** or **thisisunsafe** while viewing the rendered page (this has to do with how [Chrome preloads some domains for its HTTP Strict Transport Security list](https://hstspreload.org/) in a way that can’t be manually removed)

## Next Steps

Congratulations! Now you have successfully deployed Nebari using Kind! From here, see [Nebari 101](/tutorials/nebari-101) for instructions on the first steps you should take to fully avail Nebari's resources.
