---
id: nebari-do
title: Deploy Nebari on Digital Ocean
description: A basic overview of how to deploy Nebari on Digital Ocean
---

## Introduction

This guide is to help first-time users set up a Digital Ocean (DO) account specifically for the purpose of using and deploying Nebari at a production scale. In this guide we will
walk you through the following steps:

- [Sign up for Digital Ocean](#sign-up-for-digital-ocean)
- [Authentication](#authentication)
- [Nebari Initialize](#nebari-initialize)
- [Deploying Nebari](#deploying-nebari)

For those already familiar to Digital Ocean, feel free to skip this first step and jump straight to the [Nebari authentication](#authentication) section of this guide.

## Sign up for Digital Ocean

This documentation assumes that you are already have a Digital Ocean account and that you have prior knowledge regarding Digital Ocean billing and cost usage for Kubernetes related
services.

If you are new to Digital Ocean, we advise you to first [sign up for a free account](https://try.digitalocean.com/freetrialoffer/) to get a better understanding of the platform and
its features. [Learn more about Digital Ocean account management](https://docs.digitalocean.com/products/accounts/) and refer to
[billing concepts](https://www.digitalocean.com/pricing) for more information on account types and pricing.

For a more detailed cost estimate, refer to our \[conceptual guides\] for more information regarding the basic infrastructure provided by Nebari.

:::info
Make sure to check [Digital Ocean's New pricing](https://www.digitalocean.com/try/new-pricing) documentation for a recent overview of how costs are allocated and applied to your Digital Ocean
account. :::

:::warning
A Nebari deployment on DO will **NOT** fall into `free tier` usage. Therefore, we recommend that you sign up for a paid account or contact your cloud
administrator for more information. If you provision resources outside of the free tier, you may be charged. We're not responsible for any charges you may incur if this happens.
:::

## Authentication

In order for Nebari to make requests against the DO API and create itss infrastructure, an authentication method with the appropriate permissions will be required. The easiest way
to do this is using the [Digital Ocean access token](https://docs.digitalocean.com/reference/api/intro/#oauth-authentication).

If it's your first time creating an access token, make sure to check the [creating a Digital Ocean token documentation](https://www.digitalocean.com/docs/apis-clis/api/create-personal-access-token/)
for a detailed description of how to do this. In addition to a token, a [Digital Ocean Spaces](https://www.digitalocean.com/products/spaces) key (similar to AWS S3) credentials are
also required. See [Creating a Spaces access key on Digital Ocean](https://www.digitalocean.com/community/tutorials/how-to-create-a-digitalocean-space-and-api-key) for more
information on how to create a space and generate an access key.

:::warning
As these credentials provides access to your DO account. It should be treated like any other secret credentials. In particular, it should _never_ be checked into
source control.
:::

By default, Nebari will try to use the credentials associated with the current Digital Ocean infrastructure/environment for authentication. Refer to \[Conceptual guides\] for more
information on how Nebari's components are secured.

Provide authentication credentials to Nebari by setting the following environment variables:

```bash
export DIGITALOCEAN_TOKEN=""          # API token required to generate resources
export SPACES_ACCESS_KEY_ID=""        # public access key for access spaces
export SPACES_SECRET_ACCESS_KEY=""    # the private key for access spaces
```

:::tip
These environment variables will apply only to your current shell session. If you want the variables to apply to future shell sessions also, set the variables in your shell
startup file (for example, for example in the `~/.bashrc` or `~/.profile` for the bash shell). You can also opt for [`direnv`](https://direnv.net/) as a shell extension for managing your environment variables.
:::

:::note The steps in the following sections assume you have (i) completed the [Install Nebari](/getting-started/installing-nebari) section, (ii) confirmed that `nebari` is successfully
installed in your environment, (iii) opted for **Digital Ocean** as your cloud provider, and (iv) already configured the `nebari` environment variables. If you had any issues
during the installation, please visit the "Getting Started" section of our [troubleshooting page](/troubleshooting) for further guidance.
:::

## Nebari Initialize

Great, you’ve gone through the [Nebari Installation](/getting-started/installing-nebari.md) and [authentication setup](#authentication) steps, and have ensured that all the necessary
environment variables have been properly set. It is time to initialize and deploy Nebari!

1. In your terminal, start by creating a new project folder. For this demonstration, we will name the new folder `nebari-do`:

   ```bash
   mkdir nebari-do && cd nebari-do
   ```

2. Executing the command below will generate a basic config file with an infrastructure based on **DO**, with project name `projectname`, endpoint domain `domain`, and with the authentication mode set to **password**.

   ```bash
   qhub init do --project projectname \
       --domain domain \
       --auth-provider password
   ```

:::note
Note You will be prompted to enter values for some of the choices above if they are absent from the command line arguments (for example, project name and domain)
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
During deployment, Qhub will require you to set a DNS record for the domain defined during [initialize](/how-tos/nebari-do#nebari-initialize). Follow the instructions on [How to set a DNS record for Qhub](/how-tos/domain-registry) for an overview of the required steps.
:::

The terminal will prompt you to press <kbd>enter</kbd> to check the authentication credentials that were added as part of the preceding `qhub init` command. Once Nebari is
authenticated, it will start its infrastructure deployment process, which will take a few minutes to complete.

If the deployment is successful, you will see the following output:

```bash
[terraform]: QHub deployed successfully
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

Congratulations! You have successfully deployed Nebari on DO! From here, see \[Initial Nebari Configuration\] for instructions on the first steps you should take to prepare your
Nebari instance for your team's use.
