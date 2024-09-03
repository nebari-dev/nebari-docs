# Fine Grained Permissions via Keycloak

Nebari provides its users (particularly admins) a way to manage roles and permissions to
various services like `jupyterhub` and `conda-store` via Keycloak. The idea is to be able to manage
roles and permissions from a central place, in this case Keycloak. An admin or anyone who has
permissions to create a role in Keycloak will create role(s) with assigned scopes (permissions)
to it and attach it to user(s) or group(s).

These roles are created and attached from keycloak's interface and scoped for a particular
client (i.e. a Nebari service such as `jupyterhub` or `conda-store`). This means the roles for a
particular service (say `jupyterhub`) should be created within the Keycloak client named
`jupyterhub`.

By default, Nebari comes with several custom clients included in a fresh deployment.
These clients facilitate various services and integrations within the Nebari ecosystem.
The predefined clients are as follows:

```yaml
clients:
  - jupyterhub
  - conda_store
  - grafana (if monitoring is enabled)
  - argo-server-sso (if argo is enabled)
  - forwardauth
```

To manage and configure these clients, you can navigate to the `Clients` tab within the
Keycloak admin console, as illustrated in the image below.

![Keycloak clients](/img/how-tos/fine_grainer_permissions_keycloak_clients.png)

This can be accessed at `<nebari-url>/auth/admin/master/console/#/realms/nebari/clients`

## Creating a Role

The process for creating a role is similar, irrespective of the service. To create a role for a
service

1. Select the appropriate client and click on "Add Role".

![Keycloak client add jupyterhub role](/img/how-tos/keycloak_jupyterhub_client.png)

2. On the "Add Role" form, write a meaningful name and description for the role. Be sure to include what this role intends to accomplish. Click "Save".

![Keycloak clients add jupyterhub role form](/img/how-tos/keycloak_jupyterhub_add_role.png)

3. Now the role has been created, but it does nothing. Let's add some permissions to it by clicking on the "Attributes" tab
   and adding scopes. The following sections will explain the `components` and `scopes` in more detail.

   ![Keycloak clients add jupyterhub role form](/img/how-tos/keycloak_add_role_attributes.png)

## Adding Role to Group(s) / User(s)

Creating a role in Keycloak has no effect on any user or group's permissions. To grant a set of permissions
to a user or group, we need to _attach_ the role to the user or group. To add a role to a user:

1. Select users on the left sidebar and enter the username in the Lookup searchbar.

   ![Keycloak clients add jupyterhub role form](/img/how-tos/keycloak_select_user.png)

2. Select that user and click on the "Role Mappings" tab.

![Keycloak clients add jupyterhub role form](/img/how-tos/keycloak_user_role_mapping_tab.png)

3. Select the Client associated with the Role being added.

![Keycloak clients add jupyterhub role form](/img/how-tos/keycloak_user_role_mapping_roles.png)

4. Select the role in the "Available Roles" and click on "Add Selected >>".

![Keycloak clients add jupyterhub role form](/img/how-tos/keycloak_user_role_mapping_add_role.png)

To attach a role to a group, follow the above steps by clicking on the groups tab and
selecting a group instead of selecting the user in the first step.

In the above section, we learned how to create a role with some attributes and attach it to a user or a group.
Now we will learn how to create scopes to grant a particular set of permissions to the user.

:::note
After the roles are assigned to a user or group in Keycloak, the user **must** logout and login back in to the service
for the roles to take in effect. For example let's say we add a set of roles for `conda-store` to the user named
"John Doe", now for the user "John Doe" to be able to avail newly granted/revoked roles, they need to login to
conda-store again (similarly for `jupyterhub` as well), after the roles are granted/revoked.
:::

### Components Attribute

We have seen in the above example the `component` attribute while creating a role. The value of this parameter
depends on the type of component in the service, we're creating a role for, currently we only have two components:

- `jupyterhub`: to create `jupyterhub` native roles in the `jupyterhub` client.
- `conda-store`: to create `conda-store` roles in the `conda_store` client

### JupyterHub Scopes

The syntax for the `scopes` attribute for a `jupyterhub` role in Keycloak in Nebari follows the native RBAC scopes syntax
for JupyterHub itself. The documentation can be found [here](https://jupyterhub.readthedocs.io/en/stable/rbac/scopes.html#scope-conventions).

As an example, scopes for allowing users to share apps in Nebari's `jhub-apps` launcher may look like this:

> `shares!user,read:users:name,read:groups:name`

The `scopes` defined above consists of three scopes:

- `shares!user`: grants permissions to share user's server
- `read:users:name`: grants permissions to read other user's names
- `read:groups:name`: grants permissions to read other groups's names

To be able to share a server to a group or a user you need to be able to read other user's or group's names and must have
permissions to be able to share your server, this is what this set of permissions implement.

### Conda Store Scopes

The scopes for roles for the `conda-store` Client are applied to the `namespace` level of `conda-store`.

Below is example of granting a user specialized permissions to `conda-store`:

> `admin!namespace=analyst,developer!namespace=nebari-git`

The `scopes` defined above consists of two scopes:

- `admin!namespace=analyst`: grants `admin` access to namespace `analyst`
- `developer!namespace=nebari-git`: grants `developer` access to namespace `nebari-git`

When attached to a user or a group, the above-mentioned permissions will be granted to the user/group.
