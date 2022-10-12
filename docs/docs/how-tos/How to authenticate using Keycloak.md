---
id: login-keycloak
title: Authenticate using Keycloak and launch your server
description: |
  A step-by-step guide to authenticating using Keycloak.
---

# How to authenticate using Keycloak and launch your server

This guide aims to give a basic overview of the Nebari login process. Your organization's Nebari deployment will likely have a slightly different process due to the many
authentication providers available for Nebari can within Keycloak.

## 1. Connect to your Nebari cluster

For example, your cluster domain should look like `https://nebari-demo.nebari.dev`.

Once on the site, you will be prompted by a login, similar to
the login page shown in the image below.

![Nebari login screen](/img/how-tos/nebari_login_screen.png)

Nebari uses [Keycloak](https://www.keycloak.org/), an open source tool for user management. This makes it a little challenging provide thorough instructions for all use cases as it might differ significantly between
authentication providers ([LDAP](https://pt.wikipedia.org/wiki/LDAP), [OAuth 2.0](https://oauth.net/2/), passwordless authentication, password-based authentication and many others). For more information on how to configure Keycloak, and add new users, make sure to check the [How to configure Keycloak](/how-tos/configuring-keycloak) sections of our docs.

:::warning
As Nebari **does not** create a Keycloak user for you during deployment, the following steps assumes that your Nebari administrator have already created a Keycloak user in the admin console for you. If not, follow the steps in [Adding new users to Keycloak](/how-tos/configuring-keycloak#adding-a-nebari-user) to create a Keycloak user.
:::

## 2. Authenticate with your provider

Authentication will differ based on the [Identity providers](https://www.keycloak.org/docs/latest/server_admin/#_identity_broker) chosen by your organization, in this example, we will use a simple password-based authentication.

![Nebari Keycloak auth screen - shows a form to provide username or password or to authenticate through GitHub](/img/how-tos/keycloak_nebari_login.png)

Once authenticated, you will be forwarded to the main JupyterHub page where you have access to `Token` management, JupyterLab server access, and other `Dashboards`. If you are an admin, you'll also have access to `Admin` management.

![Nebari main hub screen](/img/how-tos/nebari_main_hub_page.png)

## 3. Selecting a Profile

Now, click in `Start My Server`, you will be prompted with a set of profiles that are available for the authenticated user. Your given selections will likely differ from
the image shown.

The customized profiles will give you access to fixed cloud resources. In this example, you could choose a resource with 1 CPUs and 4 GB of RAM or a resource with 2 CPU and 8 GB of RAM.
These options are configured by your administrator. A more detailed explanation of dedicated profiles can be found in the [Profiles] section of
the advanced configuration page.

![Nebari select profile](/img/how-tos/nebari_select_profile.png)

## 4. Starting your server

Once an appropriate profile has been selected, click `start`. At this point, your JupyterHub instance will be launched, a step which may take up to several minutes due to Nebari use
of autoscaling under the hood.

Ultimately this autoscaling feature helps reduce costs when the cluster is idle. A successful launch should look similar to the image below.

![Nebari start server](/img/how-tos/nebari_server_start.png)

<details>
<summary>Event Log</summary>

During this time you might see some log messages regarding the autoscaling process. Those logs can be fully expanded by clinking in the **Event Log** button. They should look similar to the following:

<!-- Needs to cut down this image -->

![Nebari event log](/img/how-tos/keycloak_start_event_logs.png)

</details>

:::warning
The starting up sequence can take up to several minutes, depending on the size of the cluster. If the server is not accessible **after 10 minutes**, an error will be shown and you will be redirected to the main hub page. Please check the troubleshooting section of our docs for more information.
:::

## Next Steps

Now you are ready to fully use all the features of your Jupyterlab instance. Please check our [Nebari 101] section for more information.

<!-- Once your JupyterHub instance has been launched you will notice a selection of available Python environments. These environments will also represent the different kernel choices
available for your notebooks. They are created and managed by conda-store and can be easily configured. Learn more at
[Managing environments](/tutorials/creating-new-environments).

![Nebari kernel selection](/img/how-tos/nebari_kernel_selection.png)

From the Launcher, you can choose a JupyterLab notebook with a given conda environment. Note that kernels can take several seconds to become responsive. The circle in the top
right-hand corner is a good indicator of the status of the kernel. A lightning bold means that the kernel has started, but it is not yet ready to run code. An open circle means
it's ready. -->
