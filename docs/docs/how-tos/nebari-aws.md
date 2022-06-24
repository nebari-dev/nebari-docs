---
id: nebari-aws
title: How to deploy Nebari on AWS
---

# How to deploy Nebari on AWS

A basic overview to deploy Nebari on AWS

This guide is to help first time users set up an Amazon Web Services (AWS) account specifically with the intention to use and deploy Nebari at a production scale. In this guide we will walk you through the following steps:

- [Sign up for Amazon Web Services](#sign-up-for-google-cloud-platform);
- [Set up IAM user and access keys](#authentication);
- [Initialize Nebari with your IAM user credentials](#nebari-initialize);
- [Deploy Nebari](#deploying-nebari)

For those already familiar to AWS services, feel free to skip this first step and jump straight to the [Nebari authentication](#authentication) section of this guide.

## Sing up for Amazon Web Services

This documentation assumes that the user is already familiar with [AWS Identity and Access Management (IAM)](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) and has a prior knowledge regarding [AWS billing and cost usage](https://aws.amazon.com/eks/pricing/) for Kubernetes related services.

If you are new to AWS, we advise you to first [sign up for a free account](https://aws.amazon.com/free/free-tier/) to get a better understanding of the platform and its features. Please refer to [Amazon VPC (Virtual Private Cloud)](https://aws.amazon.com/vpc/?nc1=h_ls) and [Amazon EKS Prerequisites](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-console.html#eks-prereqs) for more information on account types and prerequisites for managing Kubernetes clusters.

:::warning Warning
The Nebari deployment on AWS will **NOT** fall into `free tier` usage as some of its inner components will lead to [special charges](https://aws.amazon.com/eks/pricing/). Therefore, we recommend that you check [AWS pricing documentation](https://aws.amazon.com/ec2/pricing/) or contact your cloud administrator for more information. If you provision resources outside of the free tier, you may be charged. We're not responsible for any charges that may incur.
:::

## Authentication

In order to Nebari make requests against the aws API and create it's infrastructure, an authentication method with the appropriate permissions will be required. The easiest way to do this is using a [IAM user](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) to allow access over your AWS account and EKS cluster management.

As a [best practice](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#lock-away-credentials), do not use the AWS account root user for any task where it's not required. Instead, create a new IAM user for each person that requires administrator access. Then make those users administrators by placing the users into an "Administrators" user group to which you attach the `AdministratorAccess` managed policy.

If its your first time creating a new IAM user, please refer to [Creating your first IAM admin user and user group](https://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_create-admin-group.html) for more information. Otherwise, see [Creating an IAM user in your AWS account](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) for more information on how to create a IAM user.

Follow these steps to set up your access keys and user accounts:

- Go to [IAM in your AWS Console](https://console.aws.amazon.com/iam/home), then **Users**, and **Add Users**;
- Give the user a name, and tick **Access Key - Programmatic access**
- Click **Next**

![alt text for screen readers](/img/how-tos-aws-new-iam-user.png "Text to show on mouseover")

- Select **Attach existing policies directly**, then select `AdministratorAccess` from the list of policies. For more information, please refer to [Policies and permissions in IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html);
- Then proceed with the new user creation setup.

Upon generation, the IAM role will provide a public **Access Key ID** and **Secret Access Key**. Download this file for reference later.

:::warning Warning
The **Secret Access Key** provides access to your AWS user account. It should be treated like any other secret credentials. Specifically, it should never be checked into source control.
:::

By default, Nebari will try to use the credentials associated with the current AWS infrastructure/environment for authentication. Please keep in mind that Nebari will only use these credentials to create the first roles and stricter permissions for Nebari's internal components. Refer to [Conceptual guides] for more information on how Nebari's components are secured.

Provide authentication credentials to Nebari by setting the following environment variables:

```bash
export AWS_ACCESS_KEY_ID="Access Key ID"
export AWS_SECRET_ACCESS_KEY="Secret Access Key"
```

If you are using an already existing IAM user or want to use a different par of access keys, please refer to [Managing access keys for IAM users](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey) for detailed information on how to manage your IAM user's access keys.

:::tip
This variables applies only to your current shell session. If you want the variable to apply to future shell sessions, set the variable in your shell startup file, for example in the `~/.bashrc` or `~/.profile` file.
:::

:::note
The following steps assumes you have completed the [Install Nebari](/started/installing-nebari) section, has confirmed that `nebari` is successfully installed in your environment and opted for **AWS** as your cloud provider. as well as has already configured the `nebari` environment variables. If you had any issues during the installation, please visit our getting started [troubleshooting](/started/troubleshooting) section for extra advice.
:::


## Nebari Initialize

Great, you’ve gone through the [Nebari Installation](/started/installing-nebari.md) and [Authentication setup](#authentication) steps, and have ensured that all the necessary environment variables have been properly set. It is time to initialize and deploy Nebari!

In your terminal, we advise you to start by creating a new project folder. Here, we will name the new folder as `nebari-aws`:

```bash
mkdir nebari-aws && cd nebari-aws
```
When you first initialize Nebari, you will be creating a `nebari-config.yaml` that contains a collection of preferences and settings for your deployment. The command bellow will generate a basic config file with an infrastructure based on **AWS**, named **projectname**, where the domain will be **domain** and the authetication mode set to **password**.

```bash
nebari init aws --project projectname --domain domain --auth-provider password
```
:::note Note
You will be prompted to enter values for some of the choices above if they are omitted as command line arguments (for example project name and domain)
:::

Once `nebari init` is executed, you should then be able to see the following output:
```bash
Securely generated default random password=*** for Keycloak root user
stored at path=/tmp/NEBARI_DEFAULT_PASSWORD
INFO:botocore.credentials:Found credentials in environment variables.
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