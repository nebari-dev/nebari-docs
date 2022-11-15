---
title: Advanced Configuration
id: advanced-configuration
description: An in-depth guide to advanced configuration options.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Advanced configuration guide

Nebari is a highly configurable tool with different customization options. To better understand how to use these options, this guide will walk you through the different configuration options and how to use them. In the "How to deploy Nebari" sections of our docs we covered how you can auto-generate this file using `nebari init` (and properly set options/flags and environment variables).

After first initializing a project, you can find the configuration file at `nebari-config.yaml` in your project directory. This file is a `YAML` file that exports sets of parameters used by Nebari to deploy and redeploy changes to your infrastructure.

## General configuration settings

The `nebari-config.yaml` file can be split into several sections. The first section relates to Nebari inner mechanics for the initial deployment and should be seen as the most important section of the configuration file as the following parameters are heavily propagated throughout all infrastructure components.

```yaml
### General configuration ###
project_name: dojupyterhub
namespace: dev
provider: local
domain: dojupyterhub.com
```

- `project_name`: determines the base name for all major infrastructure related resources on Nebari. Should be compatible with the Cloud provider naming convention. See [Project Naming Conventions](/docs/explanations/configuration-best-practices.mdx#naming-conventions) for more details.
- `namespace` (Optional): used in combination with `project_name` to label infrastructure related resources on Nebari and also determines the target [_namespace_](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) used when deploying kubernetes resources. Defaults to `dev`.
- `provider`: determines the cloud provider used to deploy infrastructure related resources on Nebari. Possible values are:

  - `do` for DigitalOcean
  - `aws` for Amazon AWS
  - `gcp` for Google Could Provider
  - `azure` for Microsoft Azure
  - `existing` for deploying on an existing kubernetes infrastructure
  - `local` for Kind local cluster deployment

- `domain`: the top level URI used to access the application services. For more information regarding the format of this field, see [Domain Format](/docs/explanations/config-best-practices#domain-format).

### Continuous integration and continuous deployment

Nebari uses [infrastructure-as-code](https://en.wikipedia.org/wiki/Infrastructure_as_code) to allow developers and users to request changes to the environment via pull requests (PRs) which then get approved by administrators.
You may configure a CI/CD process to watch for pull-requests or commits on specific branches. Currently CI/CD can be setup for either [GitHub Actions](https://docs.github.com/en/actions) or [GitLab CI](https://docs.gitlab.com/ee/ci/).

```yaml
### Continuous integration ###
ci_cd:
  type: gitlab-ci
  branch: main
  commit_render: true
  before_script:
    - echo "running commands before ci completes"
  after_script:
    - echo "running commands after ci completes"
    - echo "additional commands to run"
```

`ci_cd` (Optional): This field is used to enable continuous integration and continuous deployment (CI/CD) frameworks on Nebari.

- `type`: current supported CI providers are `github-actions` and `gitlab-ci`
- `branch`: git branch on which to commit changes from `nebari render`
- `commit_render`: whether to commit the rendered changes back into the repo. Optional, defaults to `true`.
- `before_script`: optional script to run before CI starts Nebari infrastructure deployment. This is useful in cases that additional setup is required for Nebari to deploy the
  resources. Currently only supported on `gitlab-ci`.
- `after_script`: optional script to run after CI ends infrastructure deployment. This is useful in cases to notify resources of successful Nebari deployment. Currently supported on
  `gitlab-ci`.

If `ci_cd` is not supplied, no CI/CD will be auto-generated, however, we advise employing an infrastructure-as-code approach. This allows teams to more quickly modify their deployment, empowering developers and data scientists to request the changes and have them approved by an administrator.

### Certificates

To enable HTTPS on your website, you need to get a SSL certificate (a type of file) from a Certificate Authority (CA). An SSL certificate is a data file hosted in a website's origin server. SSL certificates make SSL/TLS encryption possible, and they contain the website's public key and the website's identity, along with related information.

By providing the domain name of your deployment, Nebari will automatically generate a certificate for based on the default `certificate` configuration below.

Below we provide the list of supported certificate providers.

<Tabs>
  <TabItem label="Traefik" value="traefik" default="true">

By `default`, `Nebari` uses [Traefik](https://traefik.io/traefik/) to create a [self-signed certificate](https://en.wikipedia.org/wiki/Self-signed_certificate). In order to create a certificate that's signed so that web browsers don't throw errors we currently support **Let's Encrypt**.

```yaml
### Certificate configuration ###
certificate:
  type: self-signed
```

  </TabItem>
  <TabItem label="Let's Encrypt" value="letsencrypt">

[Let’s Encrypt](https://letsencrypt.org/) is a CA. In order to get a certificate for your website’s domain from Let’s Encrypt, Nebari requires extra information that abide by the [ACME protocol](https://tools.ietf.org/html/rfc8555) which typically runs on your web host. This information is provided in the `letsencrypt` section of the configuration file.

```yaml
### Certificate configuration ###
certificate:
  type: lets-encrypt
  acme_email: <your-email-address>
  acme_server: https://acme-v02.api.letsencrypt.org/directory
```

You must specify an email address that Let's Encrypt will associate the generated certificate with and whether to use the [staging server](https://acme-staging-v02.api.letsencrypt.org/directory) or [production server](https://acme-v02.api.letsencrypt.org/directory).
In general you should use the production server, as seen above.

:::note
You can generate the above configuration automatically by using the `--ssl-cert-email <your-email-address>` flag when you ran `nebari init` to initialize your project.
:::

  </TabItem>
  <TabItem label="Custom" value="Custom">

You may also supply a custom self-signed certificate and secret key.

```yaml
### Certificate configuration ###
certificate:
  type: existing
  secret_name: <secret-name>
```

To add the tls certificate to kubernetes run the following command with existing files.

```shell
kubectl create secret tls <secret-name> \
  --namespace=<namespace> \
  --cert=path/to/cert/file --key=path/to/key/file
```

:::note
The kubernetes default namespace that Nebari uses is `dev`. Otherwise, it will be your `namespace`
defined in `nebari-config.yaml`.
:::

##### Wildcard certificates

Some of Nebari services might require special subdomains under your certificate, wildcard certificates allow you to secure all subdomains of a domain with a single certificate. Defining a wildcard certificate decreases the amount of CN names you would need to define under the certificate configuration and reduces the chance of generating an incorrect subdomain.

</TabItem>
</Tabs>

## Security

The `security` section of the configuration file allows you to configure the authentication and authorization providers of your deployment. As well as customize the default configurations of the Keycloak User management system.

### Keycloak

[Keycloak](https://www.keycloak.org/) is an open source identity and access management solution that provides authentication, authorization, and user management for web, mobile, IoT, and internal applications. This section outlines the configuration options for the Keycloak service that Nebari provides.

```yaml
### Keycloak configuration ###
security:
  keycloak:
    initial_root_password: initpasswd
    overrides:
      image:
        repository: quansight/qhub-keycloak
  ...
```

The `keycloak` section allows you to specify an initial password for the `root` Administrative user to manage your Keycloak database. Which is responsible for managing users, clients, and other Keycloak related configurations. Note that the `root` user is not actually a Nebari user - you cannot access the
main features of Nebari such as JupyterLab with this user. It is exclusively for Keycloak management.

The `overrides` section allows you to specify a custom image for the Keycloak service. This is useful if you want to customize theming or add additional plugins to Keycloak. The full extent of override options can be found in the [Keycloak Helm deployment](https://github.com/codecentric/helm-charts/tree/master/charts/keycloak).

:::warning
We strongly recommend changing the `initial_root_password` after your initial deployment and deleting this value from your `qhub-config.yaml`. Any changes to this value in the
`qhub-config.yaml` after the initial deployment will have no effect.

For more information on how to do this, see the ["Change Keycloak root password"] section.
:::

### Authentication methods

Nebari supports multiple authentication methods by using [Keycloak](https://www.keycloak.org/) under the hood. To ease the configuration procedure of adding the most common authentication providers to Keycloak, Nebari already supports `[Auth0, Github, Password]` automatically during deployment. You may also disable authentication by setting `authentication` to `false` in the `nebari-config.yaml` file.

The default authentication method is set to `github` if no changes are specified in the configuration file or during initialization.

<Tabs>

<TabItem label="GitHub" value="github" default>

To use GitHub as your authentication method, you must first create a [GitHub OAuth application](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app) and provide the `client_id` and `client_secret` to Nebari. By using the `GitHub` authentication method, users will then be able to log in to Nebari using their GitHub account registered within Keycloak database.

```yaml
### Authentication configuration ###
security:
  ...
  authentication:
    type: GitHub
    config:
      client_id: ...
      client_secret: ...
```

</TabItem>

<TabItem label="Auth0" value="auth0">

Auth0 is a cloud-based identity management platform that provides authentication, authorization, and user management for web, mobile, IoT, and internal applications. This authentication method is useful for organizations that already have an Auth0 account and user database and want to seamlessly integrate it with Nebari.

To use Auth0 as your authentication method, you must have an [Auth0 application](https://auth0.com/docs/applications/set-up-an-application/register-single-page-app) and provide the `client_id` and `client_secret` to Nebari, make sure that your Auth0 application is a `Regular Web Application`. By using the `Auth0` authentication method, users will then be able to log in to Nebari using their Auth0 account registered within Keycloak database.

```yaml
### Authentication configuration ###
security:
  ...
  authentication:
    type: Auth0
    config:
      client_id: ...
      client_secret: ...
      auth0_subdomain: ...
```

Important to note is that the `auth0_subdomain` field which must be only the `<auth0_subdomain>.auth0.com`. For example, for `nebari-dev.auth0.com` the subdomain would be `nebari-dev`.

:::note

Nebari supports automatic provisioning of the Auth0 application during initialization. To do so, you must provide the `--auth-provider=auth0 --auth-auto-provision` flags when running `nebari init`. This will automatically provide the `client_id` and `client_secret` to Nebari given that your Auth0 environment variables are set:

- `AUTH0_CLIENT_ID`: client ID of Auth0 machine-to-machine application found at top of the newly created application page
- `AUTH0_CLIENT_SECRET`: secret ID of Auth0 machine-to-machine application found in the `Settings` tab of the newly created application
- `AUTH0_DOMAIN`: The `Tenant Name` which can be found in the general account settings on the left hand side of the page appended with `.auth0.com`

:::

</TabItem>

<TabItem label="Password" value="password" default="true">

Username and Password is the simplest authentication method that Nebari supports. By using the `Password` authentication method, users will then be able to log in to Nebari using their username and password registered within Keycloak database.

```yaml
### Authentication configuration ###
security:
  ...
  authentication:
    type: password
```

</TabItem>

</Tabs>

:::note
Even if you formally select `password/Github/Auth0` authentication in the `nebari-config.yaml` file, it's still possible to add other authentication methods alongside them to Keycloak manually. For more information on how to do this, please refer to the [Keycloak documentation](https://www.keycloak.org/docs/latest/server_admin/index.html#_identity_broker).
:::

## Provider configuration

To take advantage of the auto-scaling and dask-distributed computing capabilities, Nebari can be deployed on a handful of the most commonly used cloud providers. Nebari utilizes many
of the resources these cloud providers have to offer; however, the Kubernetes engine (or service) is at it's core. Each cloud provider has slightly different ways that Kubernetes is
configured but fear not, all of this is handled by Nebari.

The `provider` section of the configuration file allows you to configure the cloud provider that you are deploying to. Including the region, instance types, and other cloud specific configurations.

### Providers

<Tabs>

<TabItem value="gcp" label="GCP" default="true" >

[Google Cloud](https://cloud.google.com/) has the best support for Nebari and is a great default choice for a production deployment. It allows auto-scaling to zero within the node group. There are no major
restrictions.

To see available instance types refer to [GCP docs](https://cloud.google.com/compute/docs/machine-types).

```yaml
### Provider configuration ###
google_cloud_platform:
  project: test-test-test
  region: us-central1
  kubernetes_version: "1.18.16-gke.502"
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

[Amazon Web Services](https://aws.amazon.com/) has similar support to DigitalOcean and doesn't allow auto-scaling below 1 node.

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

</TabItem>

<TabItem value="azure" label="Azure">

[Microsoft Azure](https://azure.microsoft.com/) has similar settings for Kubernetes version, region, and instance names - using Azure's available values of course.

Azure also requires a field named `storage_account_postfix` which will have been generated by `nebari init`. This allows nebari to create a Storage Account bucket that should be
globally unique.

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

DigitalOcean has a restriction with autoscaling in that the minimum nodes allowed (`min_nodes` = 1) is one but is by far the least expensive provider even accounting for `spot/pre-emptible` instances. In addition Digital Ocean doesn't have accelerator/gpu support. Digital Ocean is a great default choice for trying out Nebari.

To see available instance types refer to [Digital Ocean Instance Types](https://www.digitalocean.com/docs/droplets/). Additionally the Digital Ocean cli `doctl` has
[support for listing droplets](https://www.digitalocean.com/docs/apis-clis/doctl/reference/compute/droplet/list/).

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

<TabItem value="existing" label="Existing Kubernetes">

Originally designed for Nebari deployments on a "local" minikube cluster, this feature has now expanded to allow users to deploy Nebari to any existing kubernetes cluster. The default
options for a `existing` deployment are still set to deploy to a minikube cluster.

If you wish to deploy to an existing kubernetes cluster on one of the cloud providers, please refer to a more detailed walkthrough found in the [Deploy Nebari to an Existing Kubernetes Cluster].

Deploying to a local existing kubernetes cluster has different options than the cloud providers. `kube_context` is an optional key that can be used to deploy to a non-default
context. The default node selectors will allow pods to be scheduled anywhere. This can be adjusted to schedule pods on different labeled nodes. Allowing for similar functionality
to node groups in the cloud.

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

<TabItem value="local" label="Local">

Local deployment is intended for Nebari deployments on a "local" cluster created and management by Kind. It is great for experimentation and development.

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
Many of the cloud providers regularly update their internal **Kubernetes versions** so if you wish to specify a particular version, please check the following resources. This is _completely optional_ as Nebari will, by default, select the most recent version available for your preferred cloud provider. [Digital Ocean](https://docs.digitalocean.com/products/kubernetes/changelog/) [Google Cloud Platform](https://cloud.google.com/kubernetes-engine/docs/release-notes-stable) [Amazon Web Services](https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html) [Microsoft Azure](https://docs.microsoft.com/en-us/azure/aks/supported-kubernetes-versions?tabs=azure-cli)
:::

## Custom settings

### Terraform state

Terraform manages the state of all the deployed resources via [backends](https://www.terraform.io/language/settings/backends). Terraform requires storing the state in order to keep
track of the names, ids, and states of deployed resources. See [terraform remote state](https://www.terraform.io/language/state/remote) for more information.

If you are doing anything other than testing we highly recommend `remote` unless you know what you
are doing. As any unexpected changes to the state can cause issues with the deployment.

For a `existing` provider that deploys to a kubernetes cluster, the kubernetes `remote` backend is also used.

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

Default images are to the default image run if not specified in a profile (described in the next section). The `jupyterhub` key controls the jupyterhub image run. These control the
docker image used to run JupyterHub, the default JupyterLab image, and the default Dask worker image.

```yaml
### Default images ###
default_images:
  jupyterhub: "quay.io/nebari/nebari-jupyterhub:v2022.10.1"
  jupyterlab: "quay.io/nebari/nebari-jupyterlab:v2022.10.1"
  dask_worker: "quay.io/nebari/nebari-dask-worker:v2022.10.1"
```

### Storage

The Storage section is used to control the amount of storage allocated to the shared filesystem.

```yaml
### Storage ###
storage:
  conda_store: 200Gi
  shared_filesystem: 200Gi
```

:::warning
when the storage size is changed, for most providers it will automatically delete (!) the previous storage place. Changing the storage size on an AWS deployment after the initial deployment can be especially tricky so it might be worthwhile padding these storage sizes.
:::

## Profiles

Profiles are used to control the JupyterLab user instances and Dask workers provided by Dask Gateway.

### JupyterLab Profiles

```yaml
### JupyterLab Profiles ###
profiles:
  jupyterlab:
    - display_name: Small Instance
      description: Stable environment with 1 cpu / 1 GB ram
      access: all
      default: true
      kubespawner_override:
        cpu_limit: 1
        cpu_guarantee: 1
        mem_limit: 1G
        mem_guarantee: 1G
    - display_name: Medium Instance
    ...
```

Each profile under `jupyterlab` is a named JupyterLab profile.

`display_name` is the name of the profile that will be displayed to users.

`description` is a description of the profile that will be displayed to users.

`kubespawner_override` field to define behavior as per the [KubeSpawner](https://jupyterhub-kubespawner.readthedocs.io/en/latest/spawner.html) API.

It is possible to control which users have access to which JupyterLab profiles. Each profile has a field named `access` which can be set to `all` (default if omitted), `yaml`, or
`keycloak`.

- `all` means every user will have access to the profile.
- `yaml` means that access is restricted to anyone with their username in the `users` field of the profile or who belongs to a group named in the `groups` field.
- `keycloak` means that access is restricted to any user who in Keycloak has either their group(s) or user with the attribute `jupyterlab_profiles` containing this profile name. For
  example, if the user is in a Keycloak group named `developers` which has an attribute `jupyterlab_profiles` set to `Large Instance`, they will have access to the Large Instance
  profile. To specify multiple profiles for one group (or user) delimit their names using `##` - for example, `Large Instance##Another Instance`.

#### JupyterLab Profile Node Selectors

A common operation is to target jupyterlab profiles to specific node labels. In order to target a specific node groups add the following. This example shows a GKE node groups with
name `user-large`. Other cloud providers will have different node labels.

```yaml
### JupyterLab Profiles ###
profiles:
  jupyterlab:
    - display_name: Small Instance
      ...
      kubespawner_override:
        ...
        node_selector:
          "cloud.google.com/gke-nodepool": "user-large"
        ...
```

#### Specifying GPU/Accelerator Requirements

If you want to ensure that you have GPU resources use the following annotations.

```yaml
### JupyterLab Profiles ###
profiles:
  jupyterlab:
    - display_name: Small Instance
      ...
      kubespawner_override:
        ...
        extra_resource_limits:
          nvidia.com/gpu: 1
        ...
```

### Dask Profiles

Finally, we allow for configuration of the Dask workers. In general, similar to the JupyterLab instances you only need to configure the cores and memory.

```yaml
### Dask Profiles ###
profiles:
  ...
  dask_worker:
    "Small Worker":
      worker_cores_limit: 1
      worker_cores: 1
      worker_memory_limit: 1G
      worker_memory: 1G
    "Medium Worker":
      worker_cores_limit: 1.5
      worker_cores: 1.25
      worker_memory_limit: 2G
      worker_memory: 2G
```

When configuring the memory and CPUs for profiles, there are some important considerations to make. Two important terms to understand are:

- `limit`: the absolute max memory that a given pod can consume. If a process within the pod consumes more than the `limit` memory the linux OS will kill the process. Limit is not
  used for scheduling purposes with kubernetes.
- `guarantee`: is the amount of memory the kubernetes scheduler uses to place a given pod. In general the `guarantee` will be less than the limit. Often times the node itself has
  less available memory than the node specification. See this [guide from digital ocean](https://docs.digitalocean.com/products/kubernetes/#allocatable-memory) which is generally
  applicable to other clouds.

For example if a node has 8 GB of ram and 2 CPUs you should guarantee/schedule roughly 75% and follow the digital ocean guide linked above, e.g. 1.5 CPU guaranteed and 5.5 GB
guaranteed.

#### Dask Scheduler

In a few instances, the Dask worker node-group might be running on quite a large instance, perhaps with 8 CPUs and 32 GB of memory (or more). When this is the case, you might also
want to increase the resource levels associated with the Dask Scheduler.

```yaml
### Dask Profiles ###
profiles:
  ...
  dask_worker:
      "Huge Worker":
        worker_cores_limit: 7
        worker_cores: 6
        worker_memory_limit: 30G
        worker_memory: 28G
        scheduler_cores_limit: 7
        scheduler_cores: 6
        scheduler_memory_limit: 30G
        scheduler_memory: 28G
```

## Customizing JupyterHub theme

Nebari uses a custom JupyterHub theme, [[Quansight/qhub-jupyterhub-theme](https://github.com/quansight/qhub-jupyterhub-theme)](https://github.com/nebari-dev/nebari-jupyterhub-theme). Users can further customize the theme through these available options:

Below is an example of a custom theme configuration for a GCP deployment:

```yaml
### Theme ###
theme:
  jupyterhub:
    hub_title: demo.nebari.dev
    hub_subtitle: Your open source data science platform, hosted on Google Cloud Platform
    welcome: |
      Welcome! Learn about Nebari's features and configurations in <a href="https://www.nebari.dev/docs">the
      documentation</a>. If you have any questions or feedback, reach the team on
      <a href="https://www.nebari.dev/docs/community#getting-support">Nebari's support
      forums</a>.
    logo: /hub/custom/images/Nebari-Logo-Horizontal-Lockup-White-text.svg
    primary_color: "#cb39ed"
    secondary_color: "#2bd1c5"
    accent_color: "#eda61d"
    text_color: "#1c1d26",
    h1_color: "#0f1015",
    h2_color: "#0f1015",
    navbar_text_color: "#E8E8E8",
    narbar_hover_color: "#00a3b0",
    navbar_color: "#1c1d26",
    display_version: true
    version: v2022.10.1
```

![A demonstration os the theming customizations](/img/how-tos/nebari_login_screen.png)

:::note
To properly update the image logo, you will must ensure that the provided logo field contains an accessible path to the logo. Which is added in the jupyterhub image, or by passing a valid URL to the logo.
:::

## Nebari-git environments

Each environment configuration is a `environment.<filename>` mapping to a conda environment definition file. If you need to pin a specific version, please include it in the definition. Upon changing the environment definition expect 1-10 minutes upon deployment of the configuration for the environment to appear.

:::note
One current requirement is that each environment _must_ include `ipykernel` and `ipywidgets` to properly show up in the JupyterLab environment.
:::

Nebari comes with two default filesystem environments that are built during deployment.

- filesystem/dask
- filesystem/dashboard

```yaml
### Example environment configuration
environments:
  "environment-example.yaml":
    name: example
    channels:
      - conda-forge
      - defaults
    dependencies:
      - python=3.9
      - ipykernel
      - ipywidgets
      - numpy
      - numba
      - pandas
      - jinja2
      - pyyaml
```

:::warning
By default conda-store restricts the environment channels to only accept `defaults` and `conda-forge`, you can check out [Managing conda environment] for more details.
:::

## Overrides

Overrides allows you to override the default configuration for a given resource on Nebari without having to directly modify the infrastructure components.

Below we show the available resources that can be overridden in the configuration.

<Tabs>

<TabItem label="Jupyterhub" value="jupyterhub" >

JupyterHub uses the [zero to jupyterhub helm chart](https://github.com/jupyterhub/zero-to-jupyterhub-k8s/). This chart has many options that are not configured in the Nebari default
installation. You can override specific values in the [values.yaml](https://github.com/jupyterhub/zero-to-jupyterhub-k8s/blob/main/jupyterhub/values.yaml). `jupyterhub.overrides`
is optional.

```yaml
jupyterhub:
  overrides:
    cull:
      users: true
```

</TabItem>

<TabItem label="terraform" value="Terraform">

The Nebari configuration file provides a huge number of configuration options for customizing your Nebari Infrastructure, while these options are sufficient for an average user, but
aren't exhaustive by any means. There are still a plenty of things you might want to achieve which cannot be configured directly by the above mentioned options, hence we've
introduced a new option called terraform overrides (`terraform_overrides`), which lets you override the values of terraform variables in specific modules/resource. This is a
relatively advance feature and must be used with utmost care and you should really know what you're doing.

Here we describe the overrides supported via Nebari config file:

### Ingress

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

### Deployment inside a Virtual Private Network

#### Azure

Using terraform overrides you can also deploy inside a virtual private network (VPN).

An example configuration for Azure is given below:

```yaml
azure:
  terraform_overrides:
      private_cluster_enabled: true
      vnet_subnet_id: '/subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Network/virtualNetworks/<vnet-name>/subnets/<subnet-name>'
  region: Central US
```

#### Google Cloud

Using terraform overrides you can also deploy inside a VPC in GCP, making the Kubernetes cluster private. Here is an example configuration:

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

As the name suggests the cluster will be private, which means it would not have access to the internet, which is not ideal for deploying pods in the cluster. Therefore, we need
to allow internet access for the cluster, which can be achieved by creating a NAT router by running the following two commands for your VPC network.

```
gcloud compute routers create nebari-nat-router --network your-vpc-name --region your-region

gcloud compute routers nats create nat-config --router nebari-nat-router  --nat-all-subnet-ip-ranges --auto-allocate-nat-external-ips --region your-region
```

#### Deployment Notes

Deployment inside a virtual network is slightly different from deploying inside a public network, as the name suggests, since its a virtual private network, you need to be inside
the network to able to deploy and access nebari. One way to achieve this is by creating a Virtual Machine (VM) inside the virtual network, just select the virtual network and subnet name
under the networking settings of your cloud provider while creating the VM and then follow the usual deployment instructions as you would deploy from your local machine.

</TabItem>

</Tabs>
