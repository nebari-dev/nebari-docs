---
title: Advanced configuration
id: advanced-configuration
description: An in-depth guide to advanced configuration options.
---

# Advanced configuration guide

Nebari is a highly configurable tool with different customization options.
To better understand how to use these options, this guide will walk you through the different configuration options in `nebari-config.yaml` and how to use them.
In the "How to deploy Nebari" pages of our docs we covered how you can auto-generate this file using `nebari init` (and properly set options/flags and environment variables).

After first initializing a project, you can find the configuration file, `nebari-config.yaml`, in your project directory.
This file is a `YAML` file that exports sets of parameters used by Nebari to deploy and redeploy changes to your infrastructure.

<details>
<summary>Complete configuration example.</summary>

The different sections of the config will be covered in more detail below.

```yaml
nebari_version: 2023.7.2

project_name: demo
namespace: dev
provider: gcp
domain: demo.nebari.dev

ci_cd:
  type: gitlab-ci
  branch: main
  commit_render: true
  before_script:
    - echo "running commands before ci completes"
  after_script:
    - echo "running commands after ci completes"
    - echo "additional commands to run"

certificate:
  type: lets-encrypt
  acme_email: dev@nebari.dev
  acme_server: https://acme-v02.api.letsencrypt.org/directory

security:
  authentication:
    type: Auth0
    config:
      client_id: cLiEnT123Id456
      client_secret: cClIeNt789123sEcReT4567890
      auth0_subdomain: qhub-dev
  keycloak:
    initial_root_password: 1n1t1alr00tp@ssw0rd

default_images:
  jupyterhub: quay.io/nebari/nebari-jupyterhub:2023.7.2
  jupyterlab: quay.io/nebari/nebari-jupyterlab:2023.7.2
  dask_worker: quay.io/nebari/nebari-dask-worker:2023.7.2

storage:
  conda_store: 500Gi
  shared_filesystem: 500Gi

theme:
  jupyterhub:
    hub_title: My Nebari Platform
    hub_subtitle: Your open source data science platform, hosted on Google Cloud Platform
    welcome: Welcome! Learn about Nebari's features and configurations in <a href="https://www.nebari.dev/docs">the
      documentation</a>. If you have any questions or feedback, reach the team on
      <a href="https://www.nebari.dev/docs/community#getting-support">Nebari's support
      forums</a>!!
    logo: https://raw.githubusercontent.com/nebari-dev/nebari-design/main/logo-mark/horizontal/Nebari-Logo-Horizontal-Lockup-White-text.svg
    display_version: true

jupyterlab:
  idle_culler:
    terminal_cull_inactive_timeout: 30
    kernel_cull_idle_timeout: 30
    server_shutdown_no_activity_timeout: 30

helm_extensions: []
monitoring:
  enabled: true
argo_workflows:
  enabled: true
kbatch:
  enabled: true

terraform_state:
  type: remote

google_cloud_platform:
  project: gcp_project_id
  region: us-central1
  kubernetes_version: 1.26.7-gke.500
  tags:
  - "my-custom-tags"

  node_groups:
    general:
      instance: n1-standard-8
      min_nodes: 1
      max_nodes: 1

    user:
      instance: n1-standard-4
      min_nodes: 0
      max_nodes: 200

    worker:
      instance: n1-standard-4
      min_nodes: 0
      max_nodes: 1000

    gpu-tesla-k80-x1:
      instance: "n1-standard-8"
      min_nodes: 0
      max_nodes: 50
      guest_accelerators:
        - name: nvidia-tesla-k80
          count: 1

    gpu-ampere-a100-x1:
      instance: a2-highgpu-1g
      min_nodes: 0
      max_nodes: 1

profiles:
  jupyterlab:
  - display_name: Small Instance
    description: Stable environment with 2 cpu / 8 GB RAM
    default: true
    kubespawner_override:
      cpu_limit: 2
      cpu_guarantee: 1.5
      mem_limit: 8G
      mem_guarantee: 5G

  - display_name: Medium Instance
    description: Stable environment with 4 cpu / 16 GB RAM
    kubespawner_override:
      cpu_limit: 4
      cpu_guarantee: 3
      mem_limit: 16G
      mem_guarantee: 10G

  - display_name: A100 GPU Instance 1x
    access: yaml
    groups:
      - gpu-access
    description: GPU instance with 12 cpu / 85GB RAM / 1 Nvidia A100 GPU (40 GB GPU RAM)
    kubespawner_override:
      cpu_limit: 12
      cpu_guarantee: 10
      mem_limit: 85G
      mem_guarantee: 75G
      image: quay.io/nebari/nebari-jupyterlab-gpu:2023.7.2
      extra_pod_config:
        volumes:
        - name: "dshm"
          emptyDir:
            medium: "Memory"
            sizeLimit: "2Gi"
      extra_container_config:
        volumeMounts:
        - name: "dshm"
          mountPath: "/dev/shm"
      extra_resource_limits:
        nvidia.com/gpu: 1
      node_selector:
        "cloud.google.com/gke-nodepool": "gpu-ampere-a100-x1"


  dask_worker:
    Small Worker:
      worker_cores_limit: 2
      worker_cores: 1.5
      worker_memory_limit: 8G
      worker_memory: 5G
      worker_threads: 2

    Medium Worker:
      worker_cores_limit: 4
      worker_cores: 3
      worker_memory_limit: 16G
      worker_memory: 10G
      worker_threads: 4

    GPU Worker k80:
      worker_cores_limit: 2
      worker_cores: 1.5
      worker_memory_limit: 8G
      worker_memory: 5G
      worker_threads: 2
      image: quay.io/nebari/nebari-dask-worker-gpu:2023.7.2
      worker_extra_pod_config:
        nodeSelector:
          "cloud.google.com/gke-nodepool": "gpu-tesla-k80-x1"
      worker_extra_container_config:
        resources:
          limits:
            nvidia.com/gpu: 1



environments:
  environment-dask.yaml:
    name: dask
    channels:
    - conda-forge
    dependencies:
    - python=3.10.8
    - ipykernel=6.21.0
    - ipywidgets==7.7.1
    - nebari-dask ==2023.1.1
    - python-graphviz=0.20.1
    - pyarrow=10.0.1
    - s3fs=2023.1.0
    - gcsfs=2023.1.0
    - numpy=1.23.5
    - numba=0.56.4
    - pandas=1.5.3
    - pip:
      - kbatch==0.4.2

conda_store:
  image_tag: v0.4.14
  extra_settings:
    CondaStore:
      conda_allowed_channels:
        - main
        - conda-forge
```

</details>

## General configuration settings

The `nebari-config.yaml` file can be split into several sections.

The first section is the version of Nebari you wish to run.

```yaml
### Nebari version ###
nebari_version: 2023.7.2
```

:::note
You will get a validation error if the version of `nebari` used from the command line is different from the one in the `nebari-config.yaml`.
:::

The next section relates to Nebari's inner mechanics for the initial deployment and is the most important section of the configuration file,
because the following parameters are heavily propagated throughout all infrastructure components.

```yaml
### General configuration ###
project_name: demo
namespace: dev
provider: gcp
domain: demo.nebari.dev
```

`project_name`: Determines the base name for all major infrastructure related resources on Nebari. Should be compatible with the Cloud provider's naming conventions. See [Project Naming Conventions](/docs/explanations/configuration-best-practices.mdx#naming-conventions) for more details.

`namespace`: Used in combination with `project_name` to label infrastructure related resources on Nebari and also determines the target [_namespace_](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) used when deploying kubernetes resources. Defaults to `dev`.

`provider`: Determines the cloud provider used to deploy infrastructure related resources on Nebari. Possible values are:

- `aws` for Amazon Web Services
- `gcp` for Google Could Provider
- `azure` for Microsoft Azure
- `existing` for deploying on an existing Kubernetes infrastructure
- `local` for local cluster deployment using Kind

`domain`: The top level URI used to access the application services.

<!-- For more information regarding the format of this field, see [Domain Format](/docs/explanations/config-best-practices#domain-format). -->
<!-- TODO: Complete the Domain Format section and then link to it -->

### Continuous integration and continuous deployment

Nebari uses [infrastructure-as-code](https://en.wikipedia.org/wiki/Infrastructure_as_code) to maintain a description of the deployed infrastructure in source control. By using a git repository with CI/CD configured, teams can more quickly modify their deployment, empowering developers and data scientists to request the changes and have them approved by an administrator.

When a `ci_cd` section is configured within your `nebari-config.yaml`, the first `nebari deploy` command will create all related files that describe a [CI/CD](https://about.gitlab.com/topics/ci-cd/) process. These pipelines will then be responsible for redeploying Nebari as changes are made to a specified branch. (Alternatively, an administrator can use `nebari render` to generate the necessary files as if running a dry-run.) Currently, Nebari can generate CI/CD for [GitHub Actions](https://docs.github.com/en/actions) and [GitLab CI](https://docs.gitlab.com/ee/ci/).

Below is an example `ci_cd` section in a `nebari-config.yaml` file.

```yaml
### Continuous integration ###
ci_cd:
  type: gitlab-ci # 'gitlab-ci' or 'github-actions'
  branch: main # Branch that triggers deployment
  commit_render: true # During deployment, commit the rendered IaC back into the repository
  before_script: # GitLab only
    - echo "running commands before ci completes"
  after_script: # GitLab only
    - echo "running commands after ci completes"
    - echo "additional commands to run"
```

`ci_cd` (optional): Used to enable continuous integration and continuous deployment (CI/CD) frameworks on Nebari.

- `type`: Current supported CI providers are `github-actions` and `gitlab-ci`
- `branch`: git branch on which to commit changes from `nebari render`
- `commit_render`: Whether to commit the rendered changes back into the repo. Optional, defaults to `true`.
- `before_script` (optional): Script to run before CI starts Nebari infrastructure deployment. This is useful in cases that additional setup is required for Nebari to deploy the
  resources. Currently only supported on `gitlab-ci`.
- `after_script` (optional): Script to run after CI ends infrastructure deployment. This is useful in cases to notify resources of successful Nebari deployment. Currently supported on `gitlab-ci`.

The CI/CD workflow that is best for you will depend on your organization, but the following tenets will be appropriate for most situations.

- You will want to have an upstream Git repository configured - we recommend either GitHub or GitLab since we support generating CI/CD jobs for these products.
- The branch that triggers deployment (typically `main`, but you can set other ones in Nebari config's `ci_cd.branch`) should be protected so that only sys admins can commit or approve pull (or merge) requests into it.
- CI/CD variables must be set in your repository so the pipeline can access your cloud (see Note below)
- Non-admin users who have write access to the repository's non-protected branches may create their own branch off of `main`, locally make changes to the `nebari-config.yaml` and other files, and then push that branch to the origin and propose they be deployed via a Pull Request.
- Advanced Nebari users may also want to add a step in their deployment flow that includes a `nebari render` so that the administrator may preview the resulting diffs to IaC and/or CI/CD files before `nebari deploy` is executed.

:::note
In order for your CI/CD pipeline to be able to deploy changes into your Nebari cloud hosting provider, you must set the appropriate authentication environment variables for your GitLab or GitHub CI/CD execution environment. See the Authentication section for deploing to [AWS](https://www.nebari.dev/docs/how-tos/nebari-aws/#authentication), [Azure](https://www.nebari.dev/docs/how-tos/nebari-azure#authentication), or [GCP](https://www.nebari.dev/docs/how-tos/nebari-gcp/#authentication) for Nebari's required variables. Guidance on how to set these for your repository/project can be found in the documentation for [GitHub Actions](https://docs.github.com/en/actions/learn-github-actions/variables) and [GitLab CI/CD](https://docs.gitlab.com/ee/ci/variables/).
:::

### Certificates

To enable HTTPS on your website, you need to get a SSL certificate (a type of file) from a Certificate Authority (CA).
An SSL certificate is a data file hosted in a website's origin server.
SSL certificates make SSL/TLS encryption possible, and they contain the website's public key and the website's identity, along with related information.

By providing the domain name of your deployment, Nebari will automatically generate a certificate for you based on the default `certificate` configuration below.
Nebari uses [Traefik](https://traefik.io/traefik/) to create and manage certificates.

The supported options are:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem label="New self-signed" value="traefik" default="true">

By `default`, `Nebari` creates a [self-signed certificate](https://en.wikipedia.org/wiki/Self-signed_certificate).

```yaml
### Certificate configuration ###
certificate:
  type: self-signed
```

  </TabItem>
  <TabItem label="New Let's Encrypt" value="letsencrypt">

In order to create a certificate that's signed so that web browsers don't throw errors we currently support **Let's Encrypt**.

[Let’s Encrypt](https://letsencrypt.org/) is a CA.
In order to get a certificate for your website’s domain from Let’s Encrypt, Nebari requires extra information that abide by the [ACME protocol](https://tools.ietf.org/html/rfc8555) which typically runs on your web host.
This information is provided in the `letsencrypt` section of the configuration file.

```yaml
### Certificate configuration ###
certificate:
  type: lets-encrypt
  acme_email: <your-email-address>
  acme_server: https://acme-v02.api.letsencrypt.org/directory
```

You must specify:

- an email address that Let's Encrypt will associate the generated certificate with, and
- whether to use the [staging server](https://acme-staging-v02.api.letsencrypt.org/directory) or [production server](https://acme-v02.api.letsencrypt.org/directory).

In general you should use the production server, as seen above.

:::note
You can also generate the above configuration automatically by using the `--ssl-cert-email <your-email-address>` flag when you run `nebari init` to initialize your project.
:::

Let's Encrypt heavily rate limits their production endpoint. In order to avoid throttling, Nebari's traefik deployments will store retrieved certificates for the duration of their validity in a mounted PVC at a default location `/mnt/acme-certificates/acme.json`.

:::note
In order to refresh the certificate before it is invalidated, you will need to delete the `acme.json` file then restart the Traefik deployment by deleting the existing pod and letting a new one spin up. This may be necessary if you change the domain name of your Nebari deployment.
:::

  </TabItem>
  <TabItem label="Custom self-signed" value="Custom">

You may also supply a custom self-signed certificate and secret key.

```yaml
### Certificate configuration ###
certificate:
  type: existing
  secret_name: <secret-name>
```

To add the TLS certificate to Kubernetes run the following command with existing files.

```shell
kubectl create secret tls <secret-name> \
  --namespace=<namespace> \
  --cert=path/to/cert/file --key=path/to/key/file
```

:::note
The Kubernetes default namespace that Nebari uses is `dev`.
Otherwise, it will be your `namespace` defined in `nebari-config.yaml`.
:::

#### Wildcard certificates

Some of Nebari services might require special subdomains under your certificate, wildcard certificates allow you to secure all subdomains of a domain with a single certificate.
Defining a wildcard certificate decreases the amount of Common Name (CN) names you would need to define under the certificate configuration and reduces the chance of generating an incorrect subdomain.

</TabItem>
</Tabs>

### Shared Storage Configuration

:::note
As of Nebari 2024.9.1, alpha support for [Ceph](https://docs.ceph.com/en/latest/) shared file systems as an alternative to NFS is available.
:::

Nebari includes shared file systems for the jupyterhub user storage, jupyterhub shared storage, and conda store shared storage. By default, NFS drives are used.

The initial benefit of using Ceph is increased read/write performance compared to NFS, but further benefits are expected in future development. Ceph is a distributed storage system which has the potential to provide increased performance, high availability, data redundancy, storage consolidation, and scalability to Nebari.

:::danger
Do not switch from one storage type to another on an existing Nebari deployment. Any files in the user home directory and conda environments will be lost if you do so! On GCP, all node groups in the cluster will be destroyed and recreated. Only change the storage type prior to the initial deployment.
:::

Storage is configured in the `nebari-config.yaml` file under the storage section.

```yaml
storage:
  type: nfs
  conda_store: 200Gi
  shared_filesystem: 200Gi
```

Supported values for `storage.type` are `nfs` (default on most cloud providers), `efs` (default on AWS), and `cephfs`.

When using the `cephfs` storage type option, the block storage underlying all Ceph storage will be provisioned through the same Kubernetes storage class. By default, Kubernetes will use the default storage class unless a specific one is provided. For enhanced performance, some cloud providers offer premium storage class options.

You can specify the desired storage class under `ceph.storage_class_name` section in the configuration file. Below are examples of potential storage class values for various cloud providers:

<Tabs>
  <TabItem label="AWS" value="AWS" default="true">

Premium storage is not available on AWS.
</TabItem>
<TabItem label="Azure" value="Azure">

```yaml
ceph:
  storage_class_name: managed-premium
```

  </TabItem>
  <TabItem label="GCP" value="GCP">

```yaml
ceph:
  storage_class_name: premium-rwo
```

  </TabItem>
  <TabItem label="Existing" value="Existing">

```yaml
ceph:
  storage_class_name: some-cluster-storage-class
```

  </TabItem>
  <TabItem label="Local" value="Local">

Ceph is not supported on local deployments.
</TabItem>
</Tabs>

:::note
Premium storage is not available for some cloud providers on all node types. Check the documentation for your specific cloud provider to confirm which node types are compatible with which storage classes.
:::

## More configuration options

Learn to configure more aspects of your Nebari deployment with the following topic guides:

- [Security configuration](./advanced-security-configuration.md)
- [Cloud provider configuration](./advanced-provider-configuration.md)
- [JupyterLab and Dask profile configuration](./advanced-profiles-settings.md)
- [Customize JuputerHub theme](./advanced-custom-settings.md)
- [Environment configuration](./advanced-env-configuration.md)
- [Custom settings and overrides](./advanced-custom-settings.md)
