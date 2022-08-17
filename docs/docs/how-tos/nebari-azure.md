---
id: nebari-azure
title: Deploy Nebari on Azure
description: A basic overview of how to deploy Nebari on Azure
---

## Introduction

This guide is to help first-time users set up an Azure account specifically for the purpose of using and deploying Nebari at a production scale. In this guide we will walk you
through the following steps:

- [Sign up for Azure](#sign-up-for-azure)
- [Authentication](#authentication)
- [Nebari Initialize](#nebari-initialize)
- [Deploying Nebari](#deploying-nebari)

For those already familiar to Azure subscriptions and infrastructure services, feel free to skip this first step and jump straight to the [Nebari authentication](#authentication)
section of this guide.

## Sign up for Azure

This documentation assumes that you are already familiar with [Azure accounts and subscriptions](https://docs.microsoft.com/en-us/azure/guides/developer/azure-developer-guide#understanding-accounts-subscriptions-and-billing), and that you have prior knowledge regarding [Azure billing and cost usage](https://docs.microsoft.com/en-us/azure/cost-management-billing/cost-management-billing-overview) for Kubernetes related services.

If you are new to Azure, we advise you to first [sign up for a free account](https://azure.microsoft.com/free/) to get a better understanding of the platform and its features.
Billing for Azure services is done on a per-subscription basis. For a list of the available subscription offers by type, see
[Microsoft Azure Offer Details](https://azure.microsoft.com/support/legal/offer-details/) and
[Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/ask/intro-kubernetes) for a quick overview of the Kubernetes services.

For a more detailed cost estimate, please also refer to our \[Conceptual guides\] for more information regarding the basic infrastructure provided by Nebari.

:::warning
A Nebari deployment on Azure will **NOT** fall into `free tier` usage as some of its inner components will lead to [additional charges](https://azure.microsoft.com/en-us/pricing/calculator/?service=kubernetes-service). Therefore, we recommend that you check [Azure pricing documentation](https://azure.microsoft.com/en-us/pricing/#product-pricing) or contact your cloud administrator for more information. If you provision resources outside the free tier, you may be charged. We're not responsible for any charges you may incur if this happens.
:::

## Authentication

In order for Nebari to make requests against the Azure API and create its infrastructure, an authentication method with the appropriate permissions will be required. The easiest
way to do this is using a [service principal](https://docs.microsoft.com/en-us/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object) with
suitable permissions for your Azure subscription.

There are three tasks necessary to create a Service Principal using the [Azure Portal](https://portal.azure.com/):

1. Create an Application in Azure Active Directory, which will create an associated Service Principal;
2. Generating a Client Secret for the Azure Active Directory Application, which Nebari will use to authenticate;
3. Grant the Service Principal access to manage resources in your Azure subscriptions

If it's your first time creating a service principal account, please refer to
[these detailed instructions to create a service principal](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/service_principal_client_secret#creating-a-service-principal-in-the-azure-portal)
for more information on how to create an Azure service principal with necessary level permissions over the Azure subscription.

By default, Nebari will try to use the credentials associated with the current Azure infrastructure/environment for authentication. Keep in mind that Nebari will only use
these credentials to create the first roles and stricter permissions for Nebari's internal components. Refer to \[Conceptual guides\] for more information on how Nebari's
components are secured.

As we've obtained the credentials for the Service Principal, provide authentication credentials to Nebari by setting the following environment variables:

```bash
export ARM_CLIENT_ID=""        # application (client) ID
export ARM_CLIENT_SECRET=""    # client's secret
export ARM_SUBSCRIPTION_ID=""  # Available at the `Subscription` section under the `Overview` tab
export ARM_TENANT_ID=""        # Available under `Azure Active Directories`>`Properties`>`Tenant ID`
```

:::tip
Having trouble finding your Subscription ID? Refer to
[Azure's official docs](https://docs.microsoft.com/en-us/azure/azure-portal/get-subscription-tenant-id?tabs=portal) for more detailed information.
:::

:::tip
These environment variables will apply only to your current shell session. If you want the variables to apply to future shell sessions also, set the variables in your shell
startup file (for example, for example in the `~/.bashrc` or `~/.profile` for the bash shell). You can also opt for [`direnv`](https://direnv.net/) as a shell extension for managing your environment variables.
:::

:::note
The steps in the following sections assume you have (i) completed the [Install Nebari](/getting-started/installing-nebari) section, (ii) confirmed that `nebari` is successfully
installed in your environment, (iii) opted for **Azure** as your cloud provider, and (iv) already configured the `nebari` environment variables. If you had any issues during the
installation, please visit the "Getting Started" section of our [troubleshooting page](/troubleshooting) for further guidance.
:::

## Nebari Initialize

Great, you’ve gone through the [Nebari Installation](/getting-started/installing-nebari.md) and [authentication setup](#authentication) steps, and have ensured that all the necessary
environment variables have been properly set. It is time to initialize and deploy Nebari!

1. In your terminal, start by creating a new project folder. For this demonstration, we will name the new folder `nebari-azure`:

   ```bash
   mkdir nebari-azure && cd nebari-azure
   ```

2. Executing the command below will generate a basic config file with an infrastructure based on **Azure**, with project name `projectname`, endpoint domain `domain`, and with the authentication mode set to **password**.

   ```bash
   qhub init azure --project projectname \
       --domain domain \
       --auth-provider password
   ```

:::note
You will be prompted to enter values for some of the choices above if they are absent from the command line arguments (for example, project name and domain)
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

## Deploying Nebari

With the `qhub-config.yaml` configuration file now created, Nebari can be deployed for the first time. Type the following command on your command line:

```bash
qhub deploy -c qhub-config.yaml
```

:::note
During deployment, Qhub will require you to set a DNS record for the domain defined during [initialize](/how-tos/nebari-azure#nebari-initialize). Follow the instructions on [How to set a DNS record for Qhub](/how-tos/domain-registry) for an overview of the required steps.
:::

The terminal will prompt you to press <kbd>enter</kbd> to check the authentication credentials that were added as part of the preceding `qhub init` command. Once Nebari is
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

Congratulations! You have successfully deployed Nebari on Azure! From here, see \[Initial Nebari Configuration\] for instructions on the first steps you should take to prepare your
Nebari instance for your team's use.
