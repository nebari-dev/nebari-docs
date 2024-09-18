---
id: nebari-azure
title: Deploy Nebari on Azure
description: A basic overview of how to deploy Nebari on Azure
---

## Introduction

This guide is to help first-time users set up an Azure account specifically for the purpose of using and deploying Nebari at a production scale. In this guide we will walk you
through the following steps:

- [Introduction](#introduction)
- [Sign up for Azure](#sign-up-for-azure)
- [Authentication](#authentication)
- [Initializing Nebari](#initializing-nebari)
- [Deploying Nebari](#deploying-nebari)
- [Destroying Nebari](#destroying-nebari)

For those already familiar to Azure subscriptions and infrastructure services, feel free to skip this first step and jump straight to the [Nebari authentication](#authentication)
section of this guide.

## Sign up for Azure

This documentation assumes that you are already familiar with [Azure accounts and subscriptions](https://docs.microsoft.com/en-us/azure/guides/developer/azure-developer-guide#understanding-accounts-subscriptions-and-billing), and that you have prior knowledge regarding [Azure billing and cost usage](https://docs.microsoft.com/en-us/azure/cost-management-billing/cost-management-billing-overview) for Kubernetes related services.

If you are new to Azure, we advise you to first [sign up for a free account](https://azure.microsoft.com/free/) to get a better understanding of the platform and its features.
Billing for Azure services is done on a per-subscription basis. For a list of the available subscription offers by type, see
[Microsoft Azure Offer Details](https://azure.microsoft.com/support/legal/offer-details/) and
[Azure Kubernetes Service](https://docs.microsoft.com/en-us/azure/ask/intro-kubernetes) for a quick overview of the Kubernetes services.

Refer to our [Conceptual guides](/docs/explanations/) for more information regarding the basic infrastructure provided by Nebari.

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
The steps in the following sections assume you have (i) completed the [Install Nebari][nebari-install] section, (ii) confirmed that Nebari is successfully
installed in your environment, (iii) opted for **Azure** as your cloud provider, and (iv) already configured the Nebari environment variables. If you had any issues during the
installation, please visit the "Get started" section of our [troubleshooting page][nebari-troubleshooting] for further guidance.
:::

## Initializing Nebari

Great, you’ve gone through the [Nebari Installation][nebari-install] and [authentication setup](#authentication) steps, and have ensured that all the necessary
environment variables have been properly set.

:::warning Important

In the following steps you will be asked to provide a name for your project. This name will be used to generate the name of the infrastructure components that will be created in
your Azure account. This name must comply with the following rules:

- Between 3 and 16 characters long;
- Start and end with alphanumeric;
- Must use lowercase alphabets.

Those rules are enforced by Azure and are not configurable. For more information refer to [Azure's official documentation](https://learn.microsoft.com/azure/azure-resource-manager/management/resource-name-rules).
:::

In this step, you'll run `nebari init` to create the `nebari-config.yaml` file.

1. In your terminal, start by creating a new project folder. For this demonstration, we will name the new folder `nebari-azure`:

   ```bash
   mkdir nebari-azure && cd nebari-azure
   ```

2. Executing the `nebari init --guided-init` command prompts you to respond to a set of questions, which will be used to generate the
   `nebari-config.yaml` file with the Nebari cluster deployed on **Azure**.

```bash
   nebari init --guided-init
```

![A representation of the output generated when Nebari init guided-init command is executed.](/img/how-tos/nebari-azure.png)

:::tip
If you prefer not using the `guided-init` command then you can directly run the `init` command.

Executing the command below will generate a basic config file with an infrastructure based on **Azure**.

- `projectname` will be the name of the folder/repo that will manage this Nebari deployment (it will be created).
- `domain` will be the domain endpoint for your Nebari instance.
- `auth-provider` sets your authentication provider that you plan to use inside of Keycloak, options are Github, Auth0, and password.

For this example, we'll run with project name `projectname`, endpoint domain `domain`, and with the authentication mode set to **password**. These can be updated later by directly modifying the `nebari-config.yaml`.

```bash
nebari init azure --project projectname \
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
The main `temp` folder on a MacOS system can be found by inspecting the value of `$TMPDIR`. This folder and its files are not meant to be user-facing and will present you
with a seemingly random directory path similar to `/var/folders/xx/xxxxx/T`
:::

You can see that Nebari is generating a random password for the root user of Keycloak. This password is stored in a temporary file and will be used to authenticate to the Keycloak
server once Nebari's infrastructure is fully deployed, in order to create the first user accounts for administrator(s).

The Nebari initialization scripts create a `nebari-config.yaml` file that contains a collection of default preferences and settings for your deployment.

The generated `nebari-config.yaml` is the configuration file that will determine how the cloud infrastructure and Nebari is built and deployed in the next step.
Since it is a plain text file, you can edit it manually if you are unhappy with the choices you made during initialization, or delete it and start over again by re-running `nebari init`.

<!-- TODO: uncomment and add link once section is added -->
<!-- For additional information about the `nebari-config.yaml` file and extra flags that allow you to configure the initialization process, see the
[Understanding the `nebari-config.yaml` file](tutorials) documentation. -->

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

<!-- TODO: Add link to advanced configuration -->

Congratulations! You have successfully deployed Nebari on Azure! From here, see Initial Nebari Configuration for instructions on the first steps you should take to prepare your
Nebari instance for your team's use.

## Destroying Nebari

To see all the options available for the destroy command, type the following command on your command line:

```bash
nebari destroy --help
```

![A representation of the output generated when nebari deploy help command is executed.](/img/how-tos/nebari-destroy-help.png)

Nebari also has a `destroy` command that works the same way the deploy works but instead of creating the provisioned resources it destroys it.

```bash
nebari destroy -c nebari-config.yaml
```

<!-- internal links -->

[nebari-install]: /get-started/installing-nebari.md
[nebari-troubleshooting]: /troubleshooting.mdx
[domain-registry]: /how-tos/domain-registry.md
