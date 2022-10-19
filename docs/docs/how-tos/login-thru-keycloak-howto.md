---
id: login-keycloak
title: Authenticate using Keycloak and launch your server
description: |
  A step-by-step guide to logging into your Nebari instance and launching a JupyterLab pod.
---

# How to authenticate using Keycloak and launch your server

This guide provides a basic overview of how to login to your Nebari instance and launch a JupyterLab pod from the perspective of regular user.

## 1. Connect to your Nebari cluster

Navigate to the cluster homepage, for instance [`https://demo.nebari.dev`](https://demo.nebari.dev).

Once on the site, you will be prompted to login, similar to
the login page shown in the image below.

![Nebari login screen](/img/how-tos/nebari_login_screen.png)

Nebari uses [Keycloak](https://www.keycloak.org/), an open-source identity and access management tool. Keycloak is a centralized location for administrators to add new users, create user groups and update roles. For more information, see the [How to Configure Keycloak](/how-tos/configure-keycloak-howto.md) docs.

:::warning
Nebari **does not** create a "regular" user for you during deployment, it only creates the `root` Keycloak admin user. The following steps assume that your Nebari administrator has already created a Keycloak user in the Keycloak admin console for you. If not, follow the steps in [Adding new users to Keycloak](/how-tos/configuring-keycloak#adding-a-nebari-user) to create a Keycloak user.
:::

## 2. Authenticate with your provider

At this stage, it is a little challenging to provide thorough instructions the particulars will depend on your [identity provider](https://www.keycloak.org/docs/latest/server_admin/#_identity_broker) / authentication provider ([LDAP](https://pt.wikipedia.org/wiki/LDAP), [OAuth 2.0](https://oauth.net/2/), passwordless authentication, password-based authentication and many others).

For more information on how to configure Keycloak, and add new users, review the [How to configure Keycloak](/how-tos/configuring-keycloak) sections of the docs.

In this example, GitHub is acting as our identity provider. To continue the login process, the user selects the `GitHub` button and logs into github.com.

![Nebari Keycloak auth screen - shows a form to provide username or password or to authenticate through GitHub](/img/how-tos/keycloak_nebari_login.png)

Once authenticated, you will be forwarded to the main JupyterHub page. On this page, you will find links to all of Nebari's core features and it is where you can launch your JupyterLab pod. If you are an admin, you'll also have access to the JupyterHub `Admin` management.

![Nebari dashboard main screen - displays a button "Start my server"](/img/how-tos/nebari_main_hub_page.png)

## 3. Selecting a Profile

Now, click in `Start My Server` and you will be prompted with a set of available for this particular user.

The customized profiles will give you access to fixed cloud resources. In this example, you could choose a resource with 1 CPUs and 4 GB of RAM or a resource with 2 CPU and 8 GB of RAM.
These options are configured by your administrator. A more detailed explanation of dedicated profiles can be found in the [Profiles] section of
the advanced configuration page.

![Nebari select profile](/img/how-tos/nebari_select_profile.png)

## 4. Starting your server

Once an appropriate profile has been selected, click `start`. At this point, your JupyterLab pod instance will be launched. This step may take up to several minutes due to Nebari use of autoscaling under the hood.

Ultimately this autoscaling feature helps reduce costs when the cluster is idle. A successful launch should look similar to the image below.

![Nebari start server](/img/how-tos/nebari_server_start.png)

<details>
<summary>Event Log</summary>

During this time you might see some log messages that detail the autoscaling process. To view all the logs, click the **Event Log** button. They should look similar to the following:

<!-- Needs to cut down this image -->

![Nebari event log](/img/how-tos/keycloak_start_event_logs.png)

</details>

:::warning
The starting up sequence can take up to several minutes, depending on the size of the cluster. If the server is not accessible **after 10 minutes**, an error will be shown and you will be redirected to the main hub page. Please check the troubleshooting section of our docs for more information.
:::

## Next Steps

Now you are ready to fully use all the features of your Jupyterlab instance. Please check our [Nebari 101] section for more information.
