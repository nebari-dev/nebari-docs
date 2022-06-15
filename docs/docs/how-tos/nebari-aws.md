---
id: nebari-aws
title: How to deploy Nebari on AWS
---

# How to deploy Nebari on AWS

A basic overview to deploy Nebari on AWS

:::note
The following steps assumes you have just completed the [Install Nebari](/started/installing-nebari) section, has confirmed that `nebari` is successfully installed in your environment and opted for **AWS** as your cloud provider. If you had any issues in the prior steps please visit our getting started [troubleshooting](/started/troubleshooting) section for extra advice.
:::

## Authentication

By default, Nebari will try to use the credentials associated with the current AWS infrastructure/environment for authentication.

- Please see these instructions for [creating an IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create.html) role with administrator permissions.
- Upon generation, the IAM role will provide a public **access key ID** and a **secret key** which will need to be added to the environment variables.

To define the environment variables paste the commands below with your respective keys.
```bash
export AWS_ACCESS_KEY_ID="HAKUNAMATATA"
export AWS_SECRET_ACCESS_KEY="iNtheJUng1etheMightyJUNgleTHEl10N51eEpsT0n1ghy;"
```