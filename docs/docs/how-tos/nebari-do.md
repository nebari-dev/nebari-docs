---
id: nebari-do
title: How to deploy Nebari on Digital Ocean
---

# How to deploy Nebari on Digital Ocean

A basic overview to deploy Nebari on Digital Ocean

:::note
The following steps assumes you have just completed the [Install Nebari](/started/installing-nebari) section, has confirmed that `nebari` is successfully installed in your environment and opted for **Digital Ocean** as your cloud provider. If you had any issues in the prior steps please visit our getting started [troubleshooting](/started/troubleshooting) section for extra advice.
:::

## Authentication

By default, Nebari will try to use the credentials associated with the current Digital Ocean infrastructure/environment for authentication.

- Please see these instructions for [creating a Digital Ocean token](https://www.digitalocean.com/docs/apis-clis/api/create-personal-access-token/).
- In addition to a token, a spaces key (similar to AWS S3) credentials are also required. Follow the instructions on the [official docs](https://www.digitalocean.com/community/tutorials/how-to-create-a-digitalocean-space-and-api-key) for more information.

Set the required environment variables as specified below:

```bash
export DIGITALOCEAN_TOKEN=""        # API token required to generate resources
export SPACES_ACCESS_KEY_ID=""      # public access key for access spaces
export SPACES_SECRET_ACCESS_KEY=""  # the private key for access spaces
export AWS_ACCESS_KEY_ID=""         # set this variable with the same value as `SPACES_ACCESS_KEY_ID`
export AWS_SECRET_ACCESS_KEY=""     # set this variable identical to `SPACES_SECRET_ACCESS_KEY`
```