---
id: nebari-gcp
title: How to deploy Nebari on GCP
---

# How to deploy Nebari on GCP

A basic overview to deploy Nebari on GCP

:::note
The following steps assumes you have just completed the [Install Nebari](/started/installing-nebari) section, has confirmed that `nebari` is successfully installed in your environment and opted for **GCP** as your cloud provider. If you had any issues in the prior steps please visit our getting started [troubleshooting](/started/troubleshooting) section for extra advice.
:::

## Authentication

By default, Nebari will try to use the credentials associated with the current Google Cloud infrastructure/environment for authentication.

- Follow [these detailed instructions](https://cloud.google.com/iam/docs/creating-managing-service-accounts) to create a Google Service Account with owner level permissions.
- Then, follow the steps described on the official [GCP docs](https://cloud.google.com/iam/docs/creating-managing-service-account-keys#iam-service-account-keys-create-console) to create and download a JSON credentials file.
- Copy the project id information, which can be found at the Google Console homepage, under Project info.

Store this credentials file in a well known location and make sure to set yourself exclusive permissions. You can change the file permissions by running the command `chmod 600 <filename>` on your terminal.

In this case the environment variables will be such as follows:

```bash
export GOOGLE_CREDENTIALS="path/to/JSON/file/with/credentials"
export PROJECT_ID="projectIDName"
```
