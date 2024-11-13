---
id: nebari-gcp
title: Deploy Nebari on GCP
description: A basic overview of how to deploy Nebari on GCP.
---

## Introduction

This guide is to help first-time users set up a Google Cloud Platform account specifically for the purpose of using and deploying Nebari at a production scale. In this guide we
will walk you through the following steps:

- [Introduction](#introduction)
- [Sign up for Google Cloud Platform](#sign-up-for-google-cloud-platform)
- [Authentication](#authentication)
- [Required GCP APIs](#required-gcp-apis)
- [Initializing Nebari](#initializing-nebari)
- [Deploying Nebari](#deploying-nebari)
- [Destroying Nebari](#destroying-nebari)

For those already familiar with Google Cloud Platform, feel free to skip this first step and jump straight to the [Nebari authentication](#authentication) section of
this guide.

:::warning important
Before version 2024.9.1, Nebari relied on users having `gcloud`, Google Cloud's CLI, installed locally on the machine they were deploying Nebari from. If you want to install an older version, make sure to [install it](https://cloud.google.com/sdk/docs/install).
:::

## Sign up for Google Cloud Platform

This documentation assumes that you are already familiar with Google Cloud Platform accounts, and that you have prior knowledge regarding GCP billing and cost usage for Kubernetes related
services.

If you are new to the Google Cloud Platform, we advise you to first [sign up for a free account](https://cloud.google.com/signup) to get a better understanding of the platform and its
features. Check the [Create a Google Account documentation](https://support.google.com/accounts/answer/27441) and
[Overview of Cloud billing concepts](https://cloud.google.com/billing/docs/concepts#billing_account) for more information on account types and cost usage. Also, please refer to
[Cluster management fee and free tier](https://cloud.google.com/kubernetes-engine/pricing#cluster_management_fee_and_free_tier) documentation for an overview of how costs are
calculated and applied to an organization's billing account.

<!-- TODO: add link to conceptual guides -->

For a more detailed cost estimate, please also refer to our \[Conceptual guides\] for more information regarding the basic infrastructure provided by Nebari.

:::note
If you are using a new GCP account, please keep in mind the [GCP quotas](https://cloud.google.com/docs/quota) of your account. Every new `free tier` account has a limited quota
for resources like `vCPU/Mem/GPUs` per region among others. Refer to [Google's free-tier limits](https://cloud.google.com/free/docs/gcp-free-tier#free-tier-usage-limits)
documentation for more information.
:::

:::warning
A Nebari deployment on GCP will **NOT** fall into `free tier` usage. Therefore, we recommend that you sign up for a paid account or contact your cloud
administrator for more information. If you provision resources outside the free tier, you may be charged. We're not responsible for any charges you may incur if this happens.
:::

The remaining steps will assume that you are logged in to a GCP account that has admin privileges for the newly created project.

## Authentication

We advise you to create a new project for Nebari deployments as this will allow you to better manage your resources and avoid any potential conflicts with other projects. This
means that any resource you create will be assigned or associated with this project. Read more about project resources at Google's
[Creating and managing projects](https://cloud.google.com/resource-manager/docs/creating-managing-projects) documentation.

In order for Nebari to make requests against the GCP API and create its infrastructure, an authentication method with the appropriate permissions will be required. The easiest way
to do this is using a [service account](https://cloud.google.com/iam/docs/understanding-service-accounts) with suitable permissions for your GCP project and Kubernetes cluster
management.

If it's your first time creating a service account, please follow
[these detailed instructions](https://cloud.google.com/iam/docs/creating-managing-service-accounts) to create a Google Service Account with the following roles attached:

- [`roles/editor`](https://cloud.google.com/iam/docs/understanding-roles#editor)
- [`roles/resourcemanager.projectIamAdmin`](https://cloud.google.com/iam/docs/understanding-roles#resourcemanager.projectIamAdmin)
- [`roles/container.admin`](https://cloud.google.com/iam/docs/understanding-roles#container.admin)
- [`roles/storage.admin`](https://cloud.google.com/iam/docs/understanding-roles#storage.admin)

For more information about roles and permissions, see the
[Google Cloud Platform IAM documentation](https://cloud.google.com/iam/docs/choose-predefined-roles). Remember to check the active project before creating resources, especially if
you are handling multiple GCP projects.

After you create your service account, download the [service account key](https://cloud.google.com/iam/docs/reference/rest/v1/projects.serviceAccounts.keys) file following the
instructions below:

1. From the [service account key page in the Cloud Console](https://console.cloud.google.com/iam-admin/serviceaccounts) choose your recently created project;
2. Select your service account from the list;
3. Select the "Keys" tab;
4. In the drop-down menu, select "Create new key";
5. Leave the "Key Type" as `JSON`;
6. Click "Create" to create the key and save the key file to your system.

Store these credentials file in a well-known location and make sure to set yourself exclusive permissions.
You can change the file permissions by running the following command on your terminal:

```bash
chmod 600 <filename>
```

:::warning
The **service account key** file provides access to your GCP project. It should be treated like any other secret credentials. In particular, it should _never_ be
checked into source control.
:::

By default, Nebari will try to use the credentials associated with the current GCP infrastructure/environment for authentication. Please keep in mind that Nebari will only use
these credentials to create the first roles and stricter permissions for Nebari's internal components. Refer to \[Conceptual guides\] for more information on how Nebari's
components are secured.

Provide authentication credentials to Nebari by setting the following environment variables:

```bash
export GOOGLE_CREDENTIALS="path/to/JSON/file/with/credentials"
export PROJECT_ID="Project ID"
```

The **Project ID** information can be found at the Google Console homepage, under **Project Info**.

:::tip
These environment variables will apply only to your current shell session. If you want the variables to apply to future shell sessions also, set the variables in your shell
startup file (for example, for example in the `~/.bashrc` or `~/.profile` for the bash shell). You can also opt for [`direnv`](https://direnv.net/) as a shell extension for managing your environment variables.
:::

:::note
The steps in the following sections assume you have (i) completed the [Install Nebari][nebari-install] section, (ii) confirmed that Nebari is successfully
installed in your environment, (iii) opted for **GCP** as your cloud provider, and (iv) already configured the Nebari
environment variables. If you had any issues during the installation, please visit the "Get started" section of our [troubleshooting page][nebari-troubleshooting] for further
guidance.
:::

## Required GCP APIs

Deploying Nebari on GCP requires the following APIs and services enabled. So before proceeding, go to the "APIs & Services"
tab and enable the following APIs.

- Compute Engine API
- Kubernetes Engine API
- Cloud Monitoring API
- Cloud Autoscaling API
- Identity and Access Management (IAM) API
- Cloud Resource Manager API

## Initializing Nebari

Great, you’ve gone through the [Nebari Installation][nebari-install] and [authentication setup](#authentication) steps, and have ensured that all the necessary
environment variables have been properly set.

:::warning Important

In the following steps you will be asked to provide a name for your project. This name will be used to generate the name of the infrastructure components that will be created in
your GCP account. This name must comply with the following rules:

- Be 1-63 characters in length;
- Comply with [RFC 1035](https://www.ietf.org/rfc/rfc1035.txt) conventions;
- The first character must be a lowercase letter, and all the following characters must be hyphens, lowercase letters, or digits, except the last character, which cannot be a hyphen.

Those rules are enforced by GCP terraform provider and are not configurable.
:::

In this step, you'll run `nebari init` to create the `nebari-config.yaml` file.

1. In your terminal, start by creating a new project folder. For this demonstration, we will name the new folder `nebari-gcp`:

   ```bash
   mkdir nebari-gcp && cd nebari-gcp
   ```

2. Executing the `nebari init --guided-init` command prompt you to respond to a set of questions, which will be used to generate the
   `nebari-config.yaml` file with the Nebari cluster deployed on **GCP**.

```bash
   nebari init --guided-init
```

![A representation of the output generated when Nebari init guided-init command is executed.](/img/how-tos/nebari-gcp.png)

:::tip
If you prefer not using the `guided-init` command then you can directly run the `init` command.

Executing the command below will generate a basic config file with an infrastructure based on **GCP**.

- `projectname` will be the name of the folder/repo that will manage this Nebari deployment (it will be created).
- `domain` will be the domain endpoint for your Nebari instance.
- `auth-provider` sets your authentication provider that you plan to use inside of Keycloak, options are Github, Auth0, and password.

For this example, we'll run with project name `projectname`, endpoint domain `domain`, and with the authentication mode set to **password**. These can be updated later by directly modifying the `nebari-config.yaml`.

```bash
nebari init gcp --project projectname \
   --domain domain \
   --auth-provider password
```

You will be prompted to enter values for some choices above if they are absent from the command line arguments (for example, project name and domain)
:::

Once `nebari init` is executed, you should then be able to see the following output:

```bash
Securely generated default random password=*** for Keycloak root user stored at path=/tmp/QHUB_DEFAULT_PASSWORD
Congratulations, you have generated the all important nebari-config.yaml file 🎉

You can always make changes to your nebari-config.yaml file by editing the file directly.
If you do make changes to it you can ensure its still a valid configuration by running:

                nebari validate --config path/to/nebari-config.yaml

For reference, if the previous Guided Init answers were converted into a direct nebari init command, it would be:

                nebari init <cloud-provider> --project-name <project-name> --domain-name <domain-name> --namespace dev --auth-provider password

You can now deploy your Nebari instance with:

        nebari deploy -c nebari-config.yaml

For more information, run nebari deploy --help or check out the documentation: https://www.nebari.dev/how-tos/
```

:::tip
The main `temp` folder on a macOS system can be found by inspecting the value of `$TMPDIR`. This folder and its files are not meant to be user-facing and will present you
with a seemingly random directory path similar to `/var/folders/xx/xxxxx/T`
:::

You can see that Nebari is generating a random password for the root user of Keycloak. This password is stored in a temporary file and will be used to authenticate to the Keycloak
server once Nebari's infrastructure is fully deployed, in order to create the first user accounts for administrator(s).

The nebari initialization scripts create a `nebari-config.yaml` file that contains a collection of default preferences and settings for your deployment.

The generated `nebari-config.yaml` is the configuration file that will determine how the cloud infrastructure and Nebari is built and deployed in the next step. Since it is a
plain text file, you can edit it manually if you are unhappy with the choices you made during initialization, or delete it and start over again by re-running `nebari init/nebari init --guided-init`.

<!-- TODO: uncomment and add link once section is added -->
<!-- For additional information about the `nebari-config.yaml` file and extra flags that allow you to configure the initialization process, see the
[Understanding the `nebari-config.yaml` file](docs/tutorials) documentation. -->

## Deploying Nebari

To see all the options available for the deploy command, run the following command:

```bash
nebari deploy --help
```

![A representation of the output generated when nebari deploy help command is executed.](/img/how-tos/nebari-deploy-help.png)

With the `nebari-config.yaml` configuration file now created, Nebari can be deployed for the first time. Type the following command on your command line:

```bash
nebari deploy -c nebari-config.yaml
```

:::note
During deployment, Nebari will require you to set a DNS record for the domain defined during [initialize](#initializing-nebari). Follow the instructions on [How to set a DNS record for Nebari][domain-registry] for an overview of the required steps.
:::

The terminal will prompt you to press <kbd>enter</kbd> to check the authentication credentials that were added as part of the preceding `nebari init` command. Once Nebari is
authenticated, it will start its infrastructure deployment process, which will take a few minutes to complete.

If the deployment is successful, you will see the following output:

```bash
[terraform]: Nebari deployed successfully
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

<!-- TODO: add link to initial config -->

Congratulations! You have successfully deployed Nebari on GCP! From here, see Initial Nebari Configuration for instructions on the first steps you should take to prepare your
Nebari instance for your team's use.

## Destroying Nebari

To see all the options available for the destroy command, type the following command on your command line:

```bash
nebari destroy --help
```

![A representation of the output generated when nebari deploy help command is executed.](/img/how-tos/nebari-destroy-help.png)

Nebari also has a `destroy` command that works the same way the deployment works but instead of creating the provisioned resources it destroys it.

```bash
nebari destroy -c nebari-config.yaml
```

<!-- internal links -->

[nebari-install]: /get-started/installing-nebari.md
[nebari-troubleshooting]: /troubleshooting.mdx
[domain-registry]: /how-tos/domain-registry.md
