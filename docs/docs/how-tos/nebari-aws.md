---
id: nebari-aws
title: How to deploy Nebari on AWS
---

# How to deploy Nebari on AWS

A basic overview of how to deploy Nebari on AWS

This guide is to help first-time users set up an Amazon Web Services (AWS) account specifically for the purpose of using and deploying Nebari at a production scale. In this guide we will walk you through the following steps:

- [Sign up for Amazon Web Services](#sing-up-for-amazon-web-services);
- [Set up IAM user and access keys](#authentication);
- [Initialize Nebari with your IAM user credentials](#nebari-initialize);
- [Deploy Nebari](#deploying-nebari)

For those already familiar to AWS services, feel free to skip this first step and jump straight to the [Nebari authentication](#authentication) section of this guide.

## Sign up for Amazon Web Services

This documentation assumes that you are already familiar with [AWS Identity and Access Management (IAM)](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) and that you have prior knowledge regarding [AWS billing and cost usage](https://aws.amazon.com/eks/pricing/) for Kubernetes related services.

If you are new to AWS, we advise you to first [sign up for a free account](https://aws.amazon.com/free/free-tier/) to get a better understanding of the platform and its features. Please refer to [Amazon VPC (Virtual Private Cloud)](https://aws.amazon.com/vpc/?nc1=h_ls) and [Amazon EKS Prerequisites](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-console.html#eks-prereqs) for more information on account types and prerequisites for managing Kubernetes clusters.

For a more detailed cost estimate, please also refer to our [Conceptual guides]() for more information regarding the basic infrastructure provided by Nebari.

:::warning Warning
A Nebari deployment on AWS will **NOT** fall into `free tier` usage as some of its inner components will lead to [special charges](https://aws.amazon.com/eks/pricing/). Therefore, we recommend that you check [AWS pricing documentation](https://aws.amazon.com/ec2/pricing/) or contact your cloud administrator for more information. If you provision resources outside of the free tier, you may be charged. We're not responsible for any charges you may incur if this happens.
:::

## Authentication

In order for Nebari to make requests against the AWS API and create its infrastructure, an authentication method with the appropriate permissions will be required. The easiest way to do this is using an [IAM user](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) with suitable permissions for your AWS account and EKS cluster management.

As a [best practice](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#lock-away-credentials), do not use the AWS account root user for any task where it's not required. Instead, create a new IAM user for each person that requires administrator access. Then make those users administrators by placing them into an "Administrators" user group, to which you attach the `AdministratorAccess` managed policy.

If you are using an already existing IAM user, please refer to [Managing access keys for IAM users](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey) for detailed information on how to manage your IAM user's access keys.

If it's your first time creating a new IAM user, please refer to [Creating your first IAM admin user and user group](https://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_create-admin-group.html) for more information. Otherwise, see [Creating an IAM user in your AWS account](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) for more information on how to create an IAM user.

Follow these steps to set up your access keys and user accounts:

- Go to [IAM in your AWS Console](https://console.aws.amazon.com/iam/home), then **Users**, and **Add Users**;
- Give the user a name, and tick **Access Key - Programmatic access**
- Click **Next**

![alt text for screen readers](/img/how-tos-aws-new-iam-user.png "Text to show on mouseover")

- Select **Attach existing policies directly**, then select `AdministratorAccess` from the list of policies. For more information, please refer to [Policies and permissions in IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html);
- Then proceed with the new user creation setup.

Upon generation, the IAM role will provide a public **Access Key ID** and **Secret Access Key**. Download this file for reference later.

:::warning Warning
The **Secret Access Key** provides access to your AWS user account. It should be treated like any other secret credentials. In particular, it should *never* be checked into source control.
:::

By default, Nebari will try to use the credentials associated with the current AWS infrastructure/environment for authentication. Please keep in mind that Nebari will only use these credentials to create the first roles and stricter permissions for Nebari's internal components. Refer to [Conceptual guides]() for more information on how Nebari's components are secured.

Provide authentication credentials to Nebari by setting the following environment variables:

```bash
export AWS_ACCESS_KEY_ID="Access Key ID"
export AWS_SECRET_ACCESS_KEY="Secret Access Key"
```

:::tip
These environment variables will apply only to your current shell session. If you want the variables to apply to future shell sessions also, set the variables in your shell startup file (for example, for example in the `~/.bashrc` or `~/.profile` for the bash shell).
:::

:::note
The steps in the following sections assume you have (i) completed the [Install Nebari](/started/installing-nebari) section, (ii) confirmed that `nebari` is successfully installed in your environment, (iii) opted for **AWS** as your cloud provider, and (iv) already configured the `nebari` environment variables. If you had any issues during the installation, please visit the "Getting Started" section of our [troubleshooting page](/started/troubleshooting) for further guidance.
:::


## Nebari Initialize

Great, you’ve gone through the [Nebari Installation](/started/installing-nebari.md) and [authentication setup](#authentication) steps, and have ensured that all the necessary environment variables have been properly set. It is time to initialize and deploy Nebari!

In your terminal, start by creating a new project folder. For this demonstration, we will name the new folder as `nebari-aws`:

```bash
mkdir nebari-aws && cd nebari-aws
```
The Nebari initialization scripts creates a `nebari-config.yaml` file that contains a collection of default preferences and settings for your deployment. In this case, executing the command bellow will generate a basic config file with an infrastructure based on **AWS**, with project name `projectname`, endpoint domain `domain`, and with the authentication mode set to **password**.

```bash
nebari init aws --project projectname --domain domain --auth-provider password
```
:::note Note
You will be prompted to enter values for some of the choices above if they are absent from the command line arguments (for example, project name and domain)
:::

Once `nebari init` is executed, you should then be able to see the following output:
```bash
Securely generated default random password=*** for Keycloak root user
stored at path=/tmp/NEBARI_DEFAULT_PASSWORD
INFO:botocore.credentials:Found credentials in environment variables.
```
:::tip
The main `temp` folder on a MacOS system can be found by inspecting the value of `$TMPDIR`. This folder and its files are not meant to be user-facing and will present you with a seemingly random directory path similar to `/var/folders/xx/xxxxx/T`
:::

You can see that Nebari is generating a random password for the root user of Keycloak. This password is stored in a temporary file and will be used to authenticate to the Keycloak server once Nebari's infrastructure is fully deployed, in order to create the first user accounts for administrator(s).

The generated `nebari-config.yaml` is the configuration file that will determine how the cloud infrastructure and Nebari is built and deployed in the next step. Since it is a simple text file, you can edit it manually if you are unhappy with the choices you made during initialization, or delete it and start over again by re-running `nebari init`.

For additional information about the `nebari-config.yaml` file and extra flags that allow you to configure the initialization process, see the [Understanding the nebari-config.yaml file](/tutorials/overview.md) documentation.

## Deploying Nebari

With the `nebari-config.yaml` configuration file now created, Nebari can be deployed for the first time:

```bash
nebari deploy -c nebari-config.yaml
```
The terminal will prompt you to press `[enter]` to check the authentication credentials that were added as part of the preceding `nebari init` command. Once Nebari is authenticated, it will start its infrastructure deployment process, which will take up to a couple of minutes to complete.

Once you reach the stage `04-kubernetes-ingress` stage of the deploy process you will be prompted to set the **A/CNAME** records manually for your registered domain name. Please follow the instructions in the [Nebari DNS](/how-tos/domain-registry.md) section for more information regarding the domain `A/CNAME` records and how to automatically generate them.

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

Congratulations! You have successfully deployed Nebari on AWS! From here, see [Initial Nebari Configuration]() for instructions on the first steps you should take to prepare your Nebari instance for your team's use.