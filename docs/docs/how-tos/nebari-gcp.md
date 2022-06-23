---
id: nebari-gcp
title: How to deploy Nebari on GCP
---

# How to deploy Nebari on GCP

A basic overview of how to deploy Nebari on GCP.

This guide is to help first time users set up a Google Cloud Platform account specifically with the intention of using and deploying Nebari at a production scale. In this guide we will walk you through the following steps:

- [Sign up for Google Cloud Platform](#sign-up-for-google-cloud-platform);
- [Create your first project to use within Nebari](#create-your-first-project);
- [Set up gcloud command line interface](#set-up-the-gcloud-cli);
- [Set up a service account for your project](#authentication);
- [Initialize Nebari with your project credentials](#nebari-initialize);
- [Deploy Nebari](#deploying-nebari)

For those already familiar with Google Cloud Platform and how to setup a service account, feel free to skip this first step and jump straight to the [Nebari initialization](#nebari-initialize) section of this guide.


## Sign up for Google Cloud Platform

This documentation assumes that the user already has a **paid** Google Cloud Platform account and has a prior knowledge regarding GCP billing and cost usage for Kubernetes related services.

If you are new to Google Cloud Platform, we advise you to first [sign up for a free account](https://cloud.google.com/signup) to get a better understanding of the platform and its features. Please refer to [Create a Google Account](https://support.google.com/accounts/answer/27441) and [Overview of Cloud billing concepts](https://cloud.google.com/billing/docs/concepts#billing_account) for more information on account types and cost usage.

Please refer to [Cluster management fee and free tier](https://cloud.google.com/kubernetes-engine/pricing#cluster_management_fee_and_free_tier) documentation for an overview of how costs are calculated and applied to an organization’s billing account. For a more detailed cost estimate, please also refer to our [Conceptual quides] for more information regarding the basic infrastructure provided by Nebari.

:::note
If you are using a new GCP account, please keep in mind the [quotas](https://cloud.google.com/docs/quota) of your account. Every new `free-tier` account has a limited quota for resources like vCPU/Mem/GPUs per region among others. Refer to [Google's free-tier limits](https://cloud.google.com/free/docs/gcp-free-tier#free-tier-usage-limits) documentation for more information.
:::

:::warning Warning
The Nebari deployment on GCP will **NOT** fall into `free tier` usage. Therefore, we recommend that you sign up for a paid account or contact your cloud administrator for more information. If you provision resources outside of the free tier, you may be charged. We are not responsible for any charges you may incur.
:::

## Create your Nebari project

We advise you to create a new project for Nebari deployments as this will allow you to better manage your resources and avoid any potential conflicts with other projects.

Google Cloud projects form the basis for creating, enabling, and using all Google Cloud services including managing APIs, enabling billing, adding and removing collaborators, and managing permissions for Google Cloud resources. Read more about the project resources at Google's [Creating and managing projects](https://cloud.google.com/resource-manager/docs/creating-managing-projects) documentation.

After completing the sign up process from the previous step you will be redirected to Google Cloud Platform welcome page. Click on the “Create Project” button using the [Google Console UI](https://cloud.google.com/resource-manager/docs/creating-managing-projects#console) and enter a name for your project.

In addition to defining a name for your project (which can be changed later), be sure to choose an expressive **project ID** on that screen (the project ID **cannot be changed** after project creation).

After your project creation is complete, you will be redirected to the project dashboard page. From there, you can access APIs, administrative services, security settings, computer services, virtual machines (VMs), storage configurations, and more.

You now have created and activated a new project. This means that any resource you create will be assigned or associated with this project. Remember to check the active project before creating resources, especially if you are handling multiple GCP projects.

## Set up the `gcloud` CLI

As Nebari executes some preliminary steps to check Kubernetes compatibility within the GCP infrastructure, it needs to use the [`gcloud` command line interface (CLI)](https://cloud.google.com/sdk/gcloud) to interact with the Google Cloud Platform. You will have to [install the `gcloud` CLI on your system](https://cloud.google.com/sdk/docs/install) before you can use Nebari.

After installing `gcloud`, start the login process with `gcloud auth login`. Log in using the same GCP account that you created the project with above.

To review the `gcloud` authentication state:
```bash
gcloud auth list
```

The remaining steps will assume that you are logged in to a GCP account that has admin privileges for the newly created project.

## Authentication

In order to Nebari make requests against the GCP API and create it's infrastructure, an authentication method with the appropriate permissions will be required. The easiest way to do this is using a [service account](https://cloud.google.com/iam/docs/understanding-service-accounts).

Follow [these detailed instructions](https://cloud.google.com/docs/authentication/getting-started#creating_a_service_account) to create a Google Service Account with **Owner** level permissions over the project created in the previous step. For more information about roles and permissions, see the [Google Cloud Platform IAM documentation](https://cloud.google.com/iam/docs/choose-predefined-roles).

After you create your service account, download the [service account key](https://cloud.google.com/iam/docs/reference/rest/v1/projects.serviceAccounts.keys) file following the instructions below:

- From the [service account key page in the Cloud Console](https://console.cloud.google.com/iam-admin/serviceaccounts) choose your recently created project;
- Select your service account from the list;
- Select the "Keys" tab;
- In the drop down menu, select "Create new key";
- Leave the "Key Type" as `JSON`;
- Click "Create" to create the key and save the key file to your system.

Store this credentials file in a well known location and make sure to set yourself exclusive permissions. You can change the file permissions by running the command `chmod 600 <filename>` on your terminal.

:::warning Warning
The service account key file provides access to your GCP project. It should be treated like any other secret credentials. Specifically, it should never be checked into source control.
:::

By default, Nebari will try to use the credentials associated with the current Google Cloud infrastructure/environment for authentication. Provide authentication credentials to Nebari by setting the following environment variables:

```bash
export GOOGLE_CREDENTIALS="path/to/JSON/file/with/credentials"
export PROJECT_ID="Project ID"
```
The **project ID** information can be found at the Google Console homepage, under **Project info**.

:::tip
This variables applies only to your current shell session. If you want the variable to apply to future shell sessions, set the variable in your shell startup file, for example in the `~/.bashrc` or `~/.profile` file.
:::

:::note
The following steps assumes you have completed the [Install Nebari](/started/installing-nebari) section, has confirmed that `nebari` is successfully installed in your environment and opted for **GCP** as your cloud provider as well as installed and initialized `gcloud`. If you had any issues during the installation, please visit our getting started [troubleshooting](/started/troubleshooting) section for extra advice.
:::

## Nebari Initialize

Great, you’ve gone through the [Nebari Installation](/started/installing-nebari.md) and [Authentication setup](#authentication) steps, and have ensured that all the necessary environment variables have been properly set. It is time to initialize and deploy Nebari!

In your terminal, we advise you to start by creating a new project folder. Here, we will name the new folder as `data`:

```bash
mkdir data && cd data
```
When you first initialize Nebari, you will be creating a `nebari-config.yaml` that contains a collection of preferences and settings for your deployment. The command bellow will generate a basic config file with an infrastructure based on **GCP**, named **projectname**, where the domain will be **domain** and the authetication mode set to **password**.

```bash
nebari init gcp --project projectname --domain domain --auth-provider password
```
:::note Note
You will be prompted to enter values for some of the choices above if they are omitted as command line arguments (for example project name and domain)
:::

Once `nebari init` is executed, you should then be able to see the following output:
```bash
Securely generated default random password=*** for Keycloak root user
stored at path=/tmp/NEBARI_DEFAULT_PASSWORD
Fetching server config for us-central1
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
```