---
id: login-keycloak
title: Authenticate and launch JupyterLab
description: |
  A step-by-step guide to logging into your Nebari instance and launching a JupyterLab pod.
---

# Authenticate and launch JupyterLab

This guide provides a basic overview of how to log in to your Nebari instance (through Keycloak) and launch JupyterLab on a new server (ie., machine).

## 1. Connect to your Nebari instance

Navigate to the instance homepage.

Once on the site, you will be prompted to log in, similar to the login page shown in the image below. The text on this screen is configurable so your deployment may look slightly different.

![Nebari login screen](/img/how-tos/nebari_login_screen.png)

Nebari uses [Keycloak](https://www.keycloak.org/), an open-source identity and access management tool. Keycloak is a centralized location for administrators to add new users, create user groups and update roles. For more information, see the [How to Configure Keycloak][nebari-keycloak] docs.

:::warning
Nebari **does not** create a "regular" user for you during deployment, it only creates the `root` Keycloak admin user. The following steps assume that your Nebari administrator has already created a Keycloak user in the Keycloak admin console for you. If not, follow the steps in [Adding new users to Keycloak][nebari-keycloak-add-user] to create a Keycloak user.
:::

## 2. Authenticate with your provider

At this stage, it is a little challenging to provide thorough instructions because the particulars will depend on your [identity provider](https://www.keycloak.org/docs/latest/server_admin/#_identity_broker) / authentication provider ([LDAP](https://pt.wikipedia.org/wiki/LDAP), [OAuth 2.0](https://oauth.net/2/), passwordless authentication, password-based authentication and many others).

For more information on how to configure Keycloak, and add new users, review the [How to configure Keycloak][nebari-keycloak] sections of the docs.

In this example, Auth0 is the identity provider.
To continue the login process,
select the `Auth0` button and login.

<p align="center">
<img src="/img/tutorials/keycloak_nebari_login.png" alt="Nebari Keycloak auth screen - shows a form to provide username or password or to authenticate through Auth0" width="400"/>
</p>

## 3. Navigate the landing page

:::note
You may need to "Authorize access" to reach the home page:

<p align="center">
<img src="/img/tutorials/jhub-apps-authorize.png" alt="Authorize access page with an 'Authorize' button requesting access for JHub Apps, which is a Jupyter Service, to identify the user." width="80%"/>
</p>
:::

Once authenticated, the **Nebari home page** opens.
The home page, also referred to as
"Landing page", "JupyterHub launcher", or "App Launcher",
lists Nebari's core **services** and allows you to [create and share web apps][create-dashboard].

Click on the **"JupyterLab"** button under **"Quick Access"** to start a server and launch JupyterLab:

![Nebari home page with Services: JupyterLab, Argo, Users, Environments, Monitoring, VSCode; My Apps: JupyterLab (default JupyterLab instance); and Shared Apps.](/img/tutorials/nebari-home.png)

:::warning
This landing page was added recently and is in active development.
You can follow the progress on [JHub App Launcher's GitHub repository][jhub-apps-gh].

To go back to the legacy version, [disable the launcher in `nebari-config.yaml`][install-jhub-apps].
:::

### Launch a new server

Landing page to Launch server:
![Nebari dashboard main screen - displays a button "Launch Server"](/img/how-tos/nebari_main_launch_hub_page.png)

Click on the **Launch Server** button to select a profile and launch JupyterLab.

:::note
Nebari versions 2023.12.1 and earlier had a different landing page with core services listed in the top navigation bar:
![Nebari dashboard main screen - displays a button "Start my server"](/img/how-tos/nebari_main_hub_page.png)
In which case, click on the **Start My Server** button to select a profile and launch JupyterLab.
:::

## 4. Select a profile

The customized profiles (also called "instances", "servers" or "machines") will give you access to fixed cloud resources as mentioned in the list.

These options are configured by your administrator, learn more in the [Profile Configuration documentation][profile-configuration].

![Nebari select profile](/img/how-tos/nebari_select_profile.png)

Select an appropriate profile and click **"Start"**.

## 5. Start your server

After clicking "Start", your JupyterLab instance starts to launch.

This step may take up to several minutes due to Nebari's use of autoscaling under the hood. Ultimately this autoscaling feature helps reduce costs when the cluster is idle.

A progress bar is shown while the server is being set up:

![Nebari start server](/img/how-tos/nebari_server_start.png)

<details>
<summary>Optional: View Event log</summary>

During this time you might see some log messages that detail the autoscaling process. Click the **Event Log** button to view them:

![Nebari event log](/img/how-tos/keycloak_start_event_logs.png)

</details>

:::warning

- The starting up sequence can take up to several minutes, depending on the size of the cluster. If the server is not accessible **after 10 minutes**, an error will be shown, and you will be redirected to the Home page. Please check the [troubleshooting docs][troubleshooting] for more information.
- The Event logs may include warnings about `"[Warning] 0/2 nodes are available: 2 node(s) didn't match Pod's node affinity/selector ..." `. This is **normal behaviour** as the cluster sometimes need to expand in order to start the server.
- Warning such as `"[Warning]" Unable to retrieve some image pull secrets ..."` can also be safely ignored.
  :::

Once your server is ready, you will be redirected to JupyterLab!

<!-- Internal links -->

[nebari-keycloak]: /docs/how-tos/configuring-keycloak
[nebari-keycloak-add-user]: /docs/how-tos/configuring-keycloak#adding-a-nebari-user
[install-jhub-apps]: /docs/how-tos/jhub-app-launcher#installation-on-nebari
[profile-configuration]: /docs/explanations/profile-configuration
[troubleshooting]: /docs/troubleshooting
[create-dashboard]: /docs/tutorials/create-dashboard

<!-- External links -->

[jhub-apps-gh]: https://github.com/nebari-dev/jhub-apps
