---
title: Security configuration
id: security-configuration
description: Guide to configure Keycloak and authentication methods.
---

# Security configuration

The `security` section of the configuration file allows you to configure the authentication and authorization providers of your deployment.
As well as customize the default configurations of the Keycloak User management system.

## Keycloak

[Keycloak](https://www.keycloak.org/) is an open source identity and access management solution that provides authentication, authorization, and user management for web, mobile, IoT, and internal applications.
This section outlines the configuration options for the Keycloak service that Nebari provides.

```yaml
### Keycloak configuration ###
security:
  keycloak:
    initial_root_password: initpasswd
    overrides:
      image:
        repository: quansight/nebari-keycloak
  ...
```

The `keycloak` section allows you to specify an initial password for the `root` Administrative user to manage your Keycloak database which is responsible for managing users, clients, and other Keycloak related configurations. Note that the `root` user is not actually a Nebari user - you cannot access the
main features of Nebari such as JupyterLab with this user - it is exclusively for Keycloak management.

The `overrides` section allows you to specify a custom image for the Keycloak service.
This is useful if you want to customize themes or add additional plugins to Keycloak.
The full extent of override options can be found in the [Keycloak Helm deployment](https://github.com/codecentric/helm-charts/tree/master/charts/keycloak).

:::warning
We strongly recommend changing the `initial_root_password` after your initial deployment and deleting this value from your `nebari-config.yaml`.
Any changes to this value in the `nebari-config.yaml` after the initial deployment will have no effect.

For more information on how to do this, see the [Change Keycloak root password section](../how-tos/configuring-keycloak#change-keycloak-root-password).
:::

## Authentication methods

Nebari supports multiple authentication methods by using [Keycloak](https://www.keycloak.org/) under the hood.
To ease the configuration procedure of adding the most common authentication providers to Keycloak, Nebari already supports `[Auth0, GitHub, password]` automatically during deployment.
You may also disable authentication by setting `authentication` to `false` in the `nebari-config.yaml` file.

The default authentication method is set to `GitHub` if no changes are specified in the configuration file or during initialization.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>

<TabItem label="GitHub" value="github" default>

To use GitHub as your authentication method, you must first create a [GitHub OAuth application](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app) and provide the `client_id` and `client_secret` to Nebari.
By using the `GitHub` authentication method, users will then be able to log in to Nebari using their GitHub account registered within Keycloak database.

```yaml
### Authentication configuration ###
security:
  ...
  authentication:
    type: GitHub
    config:
      client_id: ...
      client_secret: ...
```

</TabItem>

<TabItem label="Auth0" value="auth0">

Auth0 is a cloud-based identity management platform that provides authentication, authorization, and user management for web, mobile, IoT, and internal applications. This authentication method is useful for organizations that already have an Auth0 account and user database and want to seamlessly integrate it with Nebari.

To use Auth0 as your authentication method, you must have an [Auth0 application](https://auth0.com/docs/applications/set-up-an-application/register-single-page-app) and provide the `client_id` and `client_secret` to Nebari.
Make sure that your Auth0 application is a `Regular Web Application`.
By using the `Auth0` authentication method, users will then be able to log in to Nebari using their Auth0 account registered within Keycloak database.

```yaml
### Authentication configuration ###
security:
  ...
  authentication:
    type: Auth0
    config:
      client_id: ...
      client_secret: ...
      auth0_subdomain: ...
```

It's important to note is that the `auth0_subdomain` field in the YAML must be only the `<auth0_subdomain>.auth0.com`.
For example, for `nebari-dev.auth0.com` the subdomain would be `nebari-dev`.

:::note

Nebari supports automatic provisioning of the Auth0 application during initialization. To do so, you must provide the `--auth-provider=auth0 --auth-auto-provision` flags when running `nebari init`. This will automatically provide the `client_id` and `client_secret` to Nebari given that your Auth0 environment variables are set:

- `AUTH0_CLIENT_ID`: client ID of Auth0 machine-to-machine application found at top of the newly created application page
- `AUTH0_CLIENT_SECRET`: secret ID of Auth0 machine-to-machine application found in the `Settings` tab of the newly created application
- `AUTH0_DOMAIN`: The `Tenant Name` which can be found in the general account settings on the left hand side of the page appended with `.auth0.com`

:::

</TabItem>

<TabItem label="password" value="password" default="true">

Username and Password is the simplest authentication method that Nebari supports. By using the `Password` authentication method, users will then be able to log in to Nebari using their username and password registered within Keycloak database.

```yaml
### Authentication configuration ###
security:
  ...
  authentication:
    type: password
```

</TabItem>

</Tabs>

:::warning
The options for `type`, which are `Auth0`, `GitHub`, and `password`, are case sensitive.
:::

:::note
Even if you formally select `password/GitHub/Auth0` authentication in the `nebari-config.yaml` file, it's still possible to add other authentication methods alongside them to Keycloak manually.
For more information on how to do this, please refer to the [Keycloak documentation](https://www.keycloak.org/docs/latest/server_admin/index.html#_identity_broker).
:::
