---
id: nebari-azure
title: How to deploy Nebari on Azure
---

# How to deploy Nebari on Azure

A basic overview of deploying Nebari on Azure

This guide is to help first time users set up an Amazon Web Services (AWS) account specifically with the intention to use and deploy Nebari at a production scale. In this guide we will walk you through the following steps:

- [Sign up for Azure](#sign-up-for-azure);
- [Create an Azure service principal](#authentication)
- [Initialize Nebari](#nebari-initialize);
- [Deploy Nebari](#deploying-nebari)

For those already familiar to Azure subscriptions and infrastructure services, feel free to skip this first step and jump straight to the [Nebari authentication](#authentication) section of this guide.

## Sign up for Azure

This documentation assumes that the user is already familiar with [Azure accounts and subscriptions](https://docs.microsoft.com/en-us/azure/guides/developer/azure-developer-guide#understanding-accounts-subscriptions-and-billing), and have a prior knowledge regarding [Azure billing and cost usage](https://docs.microsoft.com/en-us/azure/cost-management-billing/cost-management-billing-overview) for Kubernetes related services.

If you are new to Azure, we advise you to first [sign up for a free account](https://azure.microsoft.com/free/) to get a better understanding of the platform and its features. Billing for Azure services is done on a per-subscription basis. For a list of the available subscription offers by type, see [Microsoft Azure Offer Details](https://azure.microsoft.com/support/legal/offer-details/) and [Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/aks/intro-kubernetes) for a quick overview of the Kubernetes services.

:::warning Warning
The Nebari deployment on Azure will **NOT** fall into `free tier` usage as some of its inner components will lead to [special charges](https://azure.microsoft.com/en-us/pricing/calculator/?service=kubernetes-service). Therefore, we recommend that you check [Azure pricing documentation](https://azure.microsoft.com/en-us/pricing/#product-pricing) or contact your cloud administrator for more information. If you provision resources outside of the free tier, you may be charged. We're not responsible for any charges that may incur.
:::

## Authentication

In order to Nebari make requests against the Azure API and create it's infrastructure, an authentication method with the appropriate permissions will be required. The easiest way to do this is using a [service principal](https://docs.microsoft.com/en-us/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object).

There are three tasks necessary to create a Service Principal using the [Azure Portal](https://portal.azure.com/):

- Create an Application in Azure Active Directory, which will create an associated Service Principal;
- Generating a Client Secret for the Azure Active Directory Application, which Nebari will use to authenticate;
- Grant the Service Principal access to manage resources in your Azure subscriptions

Follow [these detailed instructions](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/service_principal_client_secret#creating-a-service-principal-in-the-azure-portal) to create an Azure service principal with necessary level permissions over the Azure subscription.

By default, Nebari will try to use the credentials associated with the current Azure subscription infrastructure/environment for authentication. As we've obtained the credentials for the Service Principal, provide them to Nebari by setting the following environment variables:

```bash
export ARM_CLIENT_ID=""        # application (client) ID
export ARM_CLIENT_SECRET=""    # client's secret
export ARM_SUBSCRIPTION_ID=""  # Available at the `Subscription` section under the `Overview` tab
export ARM_TENANT_ID=""        # Available under `Azure Active Directories`>`Properties`>`Tenant ID`
```
:::tip
Having trouble finding your Subscription ID? Please refer to [Azure's official docs](https://docs.microsoft.com/en-us/azure/azure-portal/get-subscription-tenant-id?tabs=portal) for more detailed information.
:::

:::tip
This variables applies only to your current shell session. If you want the variable to apply to future shell sessions, set the variable in your shell startup file, for example in the `~/.bashrc` or `~/.profile` file.
:::

:::note
The following steps assumes you have completed the [Install Nebari](/started/installing-nebari) section, has confirmed that `nebari` is successfully installed in your environment and opted for **Azure** as your cloud provider. as well as has already configured the `nebari` environment variables. If you had any issues during the installation, please visit our getting started [troubleshooting](/started/troubleshooting) section for extra advice.
:::


## Nebari Initialize

Great, you’ve gone through the [Nebari Installation](/started/installing-nebari.md) and [Authentication setup](#authentication) steps, and have ensured that all the necessary environment variables have been properly set. It is time to initialize and deploy Nebari!

In your terminal, we advise you to start by creating a new project folder. Here, we will name the new folder as `nebari-azure`:

```bash
mkdir nebari-azure && cd nebari-azure
```
When you first initialize Nebari, you will be creating a `nebari-config.yaml` that contains a collection of preferences and settings for your deployment. The command bellow will generate a basic config file with an infrastructure based on **Azure**, named **projectname**, where the domain will be **domain** and the authetication mode set to **password**.

```bash
nebari init azure --project projectname --domain domain --auth-provider password
```
:::note Note
You will be prompted to enter values for some of the choices above if they are omitted as command line arguments (for example project name and domain)
:::

Once `nebari init` is executed, you should then be able to see the following output:
```bash
Securely generated default random password=*** for Keycloak root user
stored at path=/tmp/NEBARI_DEFAULT_PASSWORD
```
:::tip
MacOS generates a programmatic directory stored in `/private/var` and defines the `$TMPDIR` environment variable for locating the system temporary folder. We advise the user to look for the `NEBARI_DEFAULT_PASSWORD` file in the following  `/var/folders/xx/xxxxx/T` path.
:::

You can see that Nebari is generating a random password for the root user of Keycloak. This password is stored in a temporary file and will be used to authenticate to the Keycloak server once Nebari's infrastructure is fully deployed.

The generated `nebari-config.yaml` is the configuration file that will determine how the cloud infrastructure and Nebari is built and deployed in the next step. But at this point it’s just a text file. You could edit it manually if you are unhappy with the choices, or delete it and start over again.

For additional information about the `nebari-config.yaml` file and extra flags that allow you to configure the initialization , see the [Understanding the nebari-config.yaml file](/tutorials/overview.md) documentation.

## Deploying Nebari

Finally, with the `nebari-config.yaml` created, Nebari can be deployed for the first time:

```bash
nebari deploy -c nebari-config.yaml
```
The terminal will prompt you to press `[enter]` to check auth credentials, which were added in the previous step by the initialization command. Once authenticated, the infrastructure deployment process will start and might take around a couple minutes to complete.

Once you reach stage `04-kubernetes-ingress` you will be prompted to set the **A/CNAME** records manually for your registered domain name. Please follow the instructions in the [Nebari DNS](/how-tos/domain-registry.md) section for more information regarding the domain `A/CNAME` records and how to automatically generate them.

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