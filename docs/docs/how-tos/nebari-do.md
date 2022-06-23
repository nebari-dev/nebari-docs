---
id: nebari-do
title: How to deploy Nebari on Digital Ocean
---

# How to deploy Nebari on Digital Ocean

A basic overview to deploy Nebari on Digital Ocean

This guide is to help first time users set up an Digital Ocean (DO) account specifically with the intention to use and deploy Nebari at a production scale. In this guide we will walk you through the following steps:

- [Sign up for Digital Ocean](#sign-up-for-google-cloud-platform);
- [Set up Digital Ocean access token](#authentication);
- [Initialize Nebari with your access credentials](#nebari-initialize);
- [Deploy Nebari](#deploying-nebari)

For the user already used to DO and ..., feel free to skip this first step and jump straight to the [Nebari initialization](#nebari-initialize) section of this guide.

## Sign up for Digital Ocean

Using DigitalOcean as your provider will require you to [sign up on their website](https://cloud.digitalocean.com/registrations/new). It will also require you to enter your credit card information and make an initial payment of at least $5.

This documentation assumes that the user already has a **paid** Digital Ocean account and has a prior knowledge regarding DO billing and cost usage for Kubernetes related services.

If you are new to Digital Ocean, we advise you to first [sign up for a free account](https://try.digitalocean.com/freetrialoffer/) to get a better understanding of the platform and its features. [Learn more about DigitalOcean account management](https://docs.digitalocean.com/products/accounts/) and refer to [billing concepts](https://www.digitalocean.com/pricing) for more information on account types and pricing.

For a more detailed cost estimate, please also refer to our [Conceptual quides] for more information regarding the basic infrastructure provided by Nebari.

:::info
Please refer to [New pricing](https://www.digitalocean.com/try/new-pricing) documentation for a recent overview of how costs are allocated and applied to your Digital Ocean account.
:::

:::warning Warning
The Nebari deployment on DO will **NOT** fall into `free tier` usage. Therefore, we recommend that you sign up for a paid account or contact your cloud administrator for more information. If you provision resources outside of the free tier initial budget, you may be charged. We are not responsible for any charges you may incur.
:::

## Authentication

In order to Nebari make requests against the DO API and create it's infrastructure, an authentication method with the appropriate permissions will be required. The easiest way to do this is using the  [Digital Ocean access token](https://docs.digitalocean.com/reference/api/intro/#oauth-authentication).

Please follow these detailed instructions for [creating a Digital Ocean token](https://www.digitalocean.com/docs/apis-clis/api/create-personal-access-token/) for Nebari usage. In addition to a token, a spaces key (similar to AWS S3) credentials is also required. Follow the instructions on the official docs for more information on [how to create a space and generate an access key]((https://www.digitalocean.com/community/tutorials/how-to-create-a-digitalocean-space-and-api-key)).

:::warning Warning
As these credentials provides access to your DO account. It should be treated like any other secret credentials. Specifically, it should never be checked into source control.
:::

By default, Nebari will try to use the credentials associated with the current Digital Ocean infrastructure/environment for authentication. Provide authentication credentials to Nebari by setting the following environment variables:

```bash
export DIGITALOCEAN_TOKEN=""          # API token required to generate resources
export SPACES_ACCESS_KEY_ID=""        # public access key for access spaces
export SPACES_SECRET_ACCESS_KEY=""    # the private key for access spaces
```
:::tip
This variables applies only to your current shell session. If you want the variable to apply to future shell sessions, set the variable in your shell startup file, for example in the `~/.bashrc` or `~/.profile` file.
:::

:::note
The following steps assumes you have completed the [Install Nebari](/started/installing-nebari) section, has confirmed that `nebari` is successfully installed in your environment and opted for **Digital Ocean** as your cloud provider, as well as has already configured the `nebari` environment variables. If you had any issues during the installation, please visit our getting started [troubleshooting](/started/troubleshooting) section for extra advice.
:::

## Nebari Initialize

Great, you’ve gone through the [Nebari Installation](/started/installing-nebari.md) and [Authentication setup](#authentication) steps, and have ensured that all the necessary environment variables have been properly set. It is time to initialize and deploy Nebari!

In your terminal, we advise you to start by creating a new project folder. Here, we will name the new folder as `data`:

```bash
mkdir data && cd data
```
When you first initialize Nebari, you will be creating a `nebari-config.yaml` that contains a collection of preferences and settings for your deployment. The command bellow will generate a basic config file with an infrastructure based on Digital Ocean (**DO**), named **projectname**, where the domain will be **domain** and the authentication mode set to **password**.

```bash
nebari init do --project projectname --domain domain --auth-provider password
```
:::note Note
You will be prompted to enter values for some of the choices above if they are omitted as command line arguments (for example project name and domain)
:::

Once `nebari init` is executed, you should then be able to see the following output:
```bash
Securely generated default random password=*** for Keycloak root user
stored at path=/tmp/NEBARI_DEFAULT_PASSWORD
```
You can see that Nebari is generating a random password for the root user of Keycloak. This password is stored in a temporary file and will be used to authenticate to the Keycloak server once Nebari's infrastructure is fully deployed.

The generated `nebari-config.yaml` is the configuration file that will determine how the cloud infrastructure and Nebari is built and deployed in the next step. But at this point it’s just a text file. You could edit it manually if you are unhappy with the choices, or delete it and start over again.

For additional information about the `nebari-config.yaml` file and extra flags that allow you to configure the initialization , see the [Understanding the nebari-config.yaml file](/tutorials/overview.md) documentation.


## Deploying Nebari

Finally, with the `nebari-config.yaml` created, Nebari can be deployed for the first time:

```bash
nebari deploy -c nebari-config.yaml
```
The terminal will prompt you to press `[enter]` to check auth credentials, which were added in the previous step by the initialization command. Once authenticated, the infrastructure deployment process will start and might take around a couple minutes to complete.

Once you reach stage [] you will be prompted to set the **A/CNAME** records manually for your registered domain name. Please follow the instructions in the [Nebari DNS](/how-tos/domain-registry.md) section for more information regarding the domain `A/CNAME` records and how to automatically generate them.

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