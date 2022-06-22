---
id: nebari-gcp
title: How to deploy Nebari on GCP
---

# How to deploy Nebari on GCP

A basic overview to deploy Nebari on GCP

This guide is to help first time users set up a Google Cloud Platform account specifically with the intention to use and deploy Nebari at a production scale on Google Cloud Platform. In this guide we will walk you through the following steps:

- [Sign up for Google Cloud Platform](#sign-up-for-google-cloud-platform);
- [Create your first project to use within Nebari](#create-your-first-project);
- [Set up a service account for your project](#authentication);
- [Initialize Nebari with your project credentials](#nebari-initialize);
- [Deploy Nebari](#deploying-nebari)

For the user already used to Google Cloud Platform and how to set a service account, feel free to skip this first step and jump straight to the [Nebari initialization](#nebari-initialize) section of this guide.


## Sign up for Google Cloud Platform

TODO: This needs to be updated to inform user that a free tier account is not enough to deploy Nebari.

As a first step, go to https://cloud.google.com/ and click on “Get Started For Free". You will need an existing Google account to log in and sign up; if you don’t have one, you can create one following [these steps](https://support.google.com/accounts/answer/27441).

Once you’ve signed in, you will need to provide Google some personal and billing information, like your `name`, `address` and a `credit card`. It’s important to note that you’re signing up for a [free trial](https://cloud.google.com/free/docs/gcp-free-tier#free-trial) and your credit card won’t be billed unless you migrate to a paid account. The trial includes $300 of free credit, valid for 90 days. Once the trial ends, your account will automatically be paused and you’ll only be charged if you explicitly choose to upgrade to a paid account.

:::note
If you are using a new GCP account, please keep in mind the [quotas](https://cloud.google.com/docs/quota) of your account. Every new free-tier account has a limited quota for resources like vCPU/Mem/GPUs per region among others, which might be less than the minimum required for Nebari's stable/extended utilization. Refer to [Google's free-tier limits](https://cloud.google.com/free/docs/gcp-free-tier#free-tier-usage-limits) documentation for more information.
:::

:::warning Warning
While everything provisioned in this tutorial should fall within GCP's free tier, if you provision resources outside of the free tier, you may be charged. We are not responsible for any charges you may incur.
:::

## Create your first project

Google Cloud projects form the basis for creating, enabling, and using all Google Cloud services including managing APIs, enabling billing, adding and removing collaborators, and managing permissions for Google Cloud resources. Read more about the project resources at Google's [Creating and managing projects](https://cloud.google.com/resource-manager/docs/creating-managing-projects) documentation.

After completing the sign up process from the previous step you will be redirected to Google Cloud Platform welcome page. Click on the “Create Project” button using the [Google Console UI](https://cloud.google.com/resource-manager/docs/creating-managing-projects#console) and enter a name for your project.

In addition to defining a name for your project (which can be changed later), be sure to choose an expressive **project ID** on that screen (the project ID **cannot be changed** after project creation).

After your project creation is complete, you will be redirected to the project dashboard page. From there, you can access APIs, administrative services, security settings, computer services, virtual machines (VMs), storage configurations, and more.

You now have created and activated a new project. This means that any resource you create will be assigned or associated with this project. Remember to check the active project before creating resources, especially if you are handling multiple GCP projects.

The remaining steps will assume that you are logged in to a GCP account that has admin privileges for the newly created project.

## Authentication

In order to Nebari make requests against the GCP API and create it's infrastructure, an authentication method with the appropriate permissions will be required. The easiest way to do this is using a [service account](https://cloud.google.com/iam/docs/understanding-service-accounts).

Follow [these detailed instructions](https://cloud.google.com/docs/authentication/getting-started#creating_a_service_account) to create a Google Service Account with **Owner** level permissions over the project created in the previous step. For more information about roles and permissions, see the [Google Cloud Platform IAM documentation](https://cloud.google.com/iam/docs/choose-predefined-roles).

After you create your service account, download your [service account key](https://cloud.google.com/iam/docs/reference/rest/v1/projects.serviceAccounts.keys):

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
export PROJECT_ID="projectIDName"
```
The **project ID** information can be found at the Google Console homepage, under **Project info**.

This variables applies only to your current shell session. If you want the variable to apply to future shell sessions, set the variable in your shell startup file, for example in the `~/.bashrc` or `~/.profile` file.


:::note
The following steps assumes you have completed the [Install Nebari](/started/installing-nebari) section, has confirmed that `nebari` is successfully installed in your environment and opted for **GCP** as your cloud provider. If you had any issues during the installation, please visit our getting started [troubleshooting](/started/troubleshooting) section for extra advice.
:::

## Nebari Initialize

Great, you’ve gone through the [Nebari Installation](/started/installing-nebari.md) and [Authentication setup](#authentication) steps, and have ensured that all the necessary environment variables have been properly set. It is time to initialize and deploy Nebari!

In your terminal, we advise you to start by creating a new project folder. Here, we will name the new folder as `data`:

```bash
mkdir data && cd data
```
When you first initialize Nebari, you will be creating a `nebari-config.yaml` that contains a collection of preferences and settings for your deployment. The command bellow will generate a basic config file with an infrastructure based on **GCP**, named **projectname**, where the domain will be **domain.dev** and the authetication mode set to **password**.

```bash
nebari init gcp --project projectname --domain domain.com --auth-provider password
```
:::note Note
You will be prompted to enter values for some of the choices above if they are omitted as command line arguments (for example project name and domain)
:::

You should then be able to see the following output:
```bash
Securely generated default random password=*** for Keycloak root user stored at path=/tmp/NEBARI_DEFAULT_PASSWORD
Fetching server config for us-central1
```
You can see that Nebari is generating a random password for the root user of Keycloak. This password is stored in a temporary file and will be used to authenticate to the Keycloak server once the Nebari infrastructure is deployed.

The command above also generated the `nebari-config.yaml` file as commented above. This file is the configuration file that will determine how the cloud infrastructure and Nebari is built and deployed in the next step. But at this point it’s just a text file. You could edit it manually if you are unhappy with the choices, or delete it and start over again.

For additional information about the `nebari-config.yaml` file and extra flags that allow you to configure the initialization , see the [Understanding the nebari-config.yaml file](/started/configuration.md) documentation.

## Deploying Nebari

Finally, with the `nebari-config.yaml` created, Nebari can be deployed for the first time:

```bash
nebari deploy -c nebari-config.yaml
```
The terminal will prompt you to press `[enter]` to check auth credentials (which were added in the previous step by the initialization command). That will trigger the deployment which will take around a couple minutes to complete.

Once you reach stage [] you will be prompted to set the **A/CNAME** records manually for your domain name registered nameservers. Please follow the instructions in the [Nebari DNS](/started/dns.md) section for more information regearing the domain `A/CNAME` records and how to automatically generate them.
