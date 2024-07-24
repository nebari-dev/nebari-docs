---
id: nebari-stages-directory
title: Nebari Stages Directory
description: Purpose and Usage of the "stages" Directory
---

# The Nebari "Stages" Directory

The Nebari CLI generates Terraform manifests and saves them on disk in directories `stages/[stage-name]` relative to the location of your configuration file. Knowing how and when these directories are used will allow you to better track changes that the Nebari CLI makes to your running Nebari deployment when you upgrade or modify the configuration file.

## Nebari CLI Steps

The following three Nebari CLI commands trigger different steps in the Nebari deployment process.

`nebari validate` will check whether your configuration file is valid for the Nebari schema of the Nebari CLI version that you are using. It will **NOT** render new `stages` directories.

`nebari render` will validate your configuration file **AND** generate new Terraform manifests in the `stages` directories but will **NOT** deploy those changes.

`nebari deploy` will validate your configuration file, generate new Terraform manifests **UNLESS** you use the `--disable-render`, **AND** deploy those changes. If `--disable-render` is set, the Nebari CLI will instead use whatever code is present in the existing `stages` directory. This is useful to ensure that only Terraform code changes that you have seen are present with the deploy (see Tip below).

:::tip
You can also use `nebari info` to generate a view a list of 'Runtime Stage Ordering' which will include all of the default stages included in your Nebari version along with any additionally installed extensions.
:::

:::tip
If you are using a `git` repo to maintain your Nebari configuration, you can preview the effects that a Nebari version upgrades and/or config file change will make to your running Nebari deployment. First perform the [Nebari upgrade command][upgrade-nebari] or modify your `nebari-config.yaml` file, then run `nebari render`. After the new `/stages/` directories are generated, use `git diff` to see any Terraform changes that will be made with the next `nebari deploy`.

Please note that some changes (e.g. container image tags) are injected as Terraform variable values at runtime by `nebari deploy`, this technique will not capture every possible change the way a basic `terraform plan` would.
:::

## Overview of Nebari Stages

When you run `nebari deploy`, you will see several log entries indicating Terraform initializing anew. This is because **_every Nebari stage is an independent Terraform deployment._** This modular architecture allows for the greatest flexibility when customizing your platform, such as using different cloud providers in the Infrastructure stage, overriding or skipping entire stages, or adding [extensions][nebari-extension-system] to your deployment. As the `deploy` runs, the deployer will track the Terraform outputs of each stage's Terraform deployment and append them to a `stage_outputs` object so that subsequent stages can access the data as Terraform inputs.

- **01-terraform-state/[provider-name]** - Creates the infrastructure for Terraform backend, such as Google Cloud Storage bucket or AWS S3 bucket. If you are using a `local` or `existing` provider, this stage is skipped and Terraform instead keeps a local `.tfstate` file in each stage folder.
- **02-infrastructure/[provider-name]** - Deploys the underlying infrastructure, notably the networking components and Kubernetes cluster (unless using the `existing` provider). This is the last core Nebari stage which directly interacts with the Terraform cloud provider.
- **03-kubernetes-initialize** - Sets up fundamental Kubernetes objects (namespaces, autoscalers, etc.)
- **04-kubernetes-ingress** - Deploys the Traefik ingress. Note that after this stage, your Nebari CLI deployer will attempt to connect with your cluster. After this stage your Nebari CLI deployer will attempt to communicate with your cluster, so [DNS must be provisioned][setup-dns].
- **05-kubernetes-keycloak** - Deploys Keyclaok for authentication.
- **06-kubernetes-keycloak-configuration** - Applies Nebari-specific configurations to Keycloak.
- **07-kubernetes-services** - Deploys all of the core Nebari components that rely on Keycloak, notably JupyterHub and Conda Store. _The vast majority of the end-user Nebari functionality is deployed in this stage._
- **08-nebari-extensions** - This is an experimental stage that can be used to deploy custom Helm charts or define new Kubernetes services to inject into Nebari directly from your configuration file. This is **_NOT_** related to the [Nebari Extension System][nebari-extension-system].

If you have installed any [Nebari Python extensions][nebari-extension-system], they will also be rendered as folders in the stages directory.

<!-- internal links -->

[setup-dns]: /how-tos/domain-registry.md
[upgrade-nebari]: /how-tos/nebari-upgrade.md
[nebari-extension-system]: /how-tos/nebari-extension-system.md
