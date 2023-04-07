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

## General configuration settings

The `nebari-config.yaml` file can be split into several sections.
The first section relates to Nebari's inner mechanics for the initial deployment and is the most important section of the configuration file,
because the following parameters are heavily propagated throughout all infrastructure components.

```yaml
### General configuration ###
project_name: dojupyterhub
namespace: dev
provider: do
domain: dojupyterhub.com
```

`project_name`: Determines the base name for all major infrastructure related resources on Nebari. Should be compatible with the Cloud provider's naming conventions. See [Project Naming Conventions](/docs/explanations/configuration-best-practices.mdx#naming-conventions) for more details.

`namespace` (Optional): Used in combination with `project_name` to label infrastructure related resources on Nebari and also determines the target [_namespace_](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) used when deploying kubernetes resources. Defaults to `dev`.

`provider`: Determines the cloud provider used to deploy infrastructure related resources on Nebari. Possible values are:

- `do` for DigitalOcean
- `aws` for Amazon Web Services
- `gcp` for Google Could Provider
- `azure` for Microsoft Azure
- `existing` for deploying on an existing Kubernetes infrastructure
- `local` for local cluster deployment using Kind

`domain`: The top level URI used to access the application services.

<!-- For more information regarding the format of this field, see [Domain Format](/docs/explanations/config-best-practices#domain-format). -->
<!-- TODO: Complete the Domain Format section and then link to it -->

### Continuous integration and continuous deployment

Nebari uses [infrastructure-as-code](https://en.wikipedia.org/wiki/Infrastructure_as_code) to allow developers and users to request changes to the environment via pull requests (PRs) which then get approved by administrators.
You may configure a CI/CD process to watch for pull-requests or commits on specific branches.
Currently, CI/CD can be setup for either [GitHub Actions](https://docs.github.com/en/actions) or [GitLab CI](https://docs.gitlab.com/ee/ci/).

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

`ci_cd` (optional): Used to enable continuous integration and continuous deployment (CI/CD) frameworks on Nebari.

- `type`: Current supported CI providers are `github-actions` and `gitlab-ci`
- `branch`: git branch on which to commit changes from `nebari render`
- `commit_render`: Whether to commit the rendered changes back into the repo. Optional, defaults to `true`.
- `before_script` (optional): Script to run before CI starts Nebari infrastructure deployment. This is useful in cases that additional setup is required for Nebari to deploy the
  resources. Currently only supported on `gitlab-ci`.
- `after_script` (optional): Script to run after CI ends infrastructure deployment. This is useful in cases to notify resources of successful Nebari deployment. Currently supported on `gitlab-ci`.

If `ci_cd` is not supplied, no CI/CD will be auto-generated, however, we advise employing an infrastructure-as-code approach.
This allows teams to more quickly modify their deployment, empowering developers and data scientists to request the changes and have them approved by an administrator.

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

## More configuration options

Learn to configure more aspects of your Nebari deployment with the following topic guides:

- [Security configuration](./advanced-security-configuration.md)
- [Cloud provider configuration](./advanced-provider-configuration.md)
- [JupyterLab and Dask profile configuration](./advanced-profiles-settings.md)
- [Customize JuputerHub theme](./advanced-custom-settings.md)
- [Environment configuration](./advanced-env-configuration.md)
- [Custom settings and overrides](./advanced-custom-settings.md)
