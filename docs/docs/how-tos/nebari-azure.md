---
id: nebari-azure
title: How to deploy Nebari on Azure
---

# How to deploy Nebari on Azure

A basic overview of deploying Nebari on Azure

:::note
The following steps assume you have successfully completed the [Install Nebari](/started/installing-nebari) section for **Azure**.
If you had any issues in the prior steps, please visit our Getting Started - [Troubleshooting](/started/troubleshooting) section for extra advice.
:::

## Authentication

By default, Nebari will try to use the credentials associated with the current Azure infrastructure/environment for authentication.

- Follow [these instructions](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/service_principal_client_secret#creating-a-service-principal-in-the-azure-portal) to create a Service Principal in the Azure Portal.

After completing the steps described on the link, set the following environment variables such as below:

```bash
export ARM_CLIENT_ID=""        # application (client) ID
export ARM_CLIENT_SECRET=""    # client's secret
export ARM_SUBSCRIPTION_ID=""  # Available at the `Subscription` section under the `Overview` tab
export ARM_TENANT_ID=""        # Available under `Azure Active Directories`>`Properties`>`Tenant ID`
```