# Fine Grained Permissions via Keycloak

Nebari uses Keycloak to centrally manage roles, permissions, and scopes for various
services like `jupyterhub` and `conda-store`. By default, Nebari provides a set of
predefined clients and default roles that cover common needs—such as basic view/read
permissions or full admin control, a full list of which can be found in the [] section.

However, certain environments require more specialized or granular access controls. In these cases, administrators (or any user with appropriate privileges) can create custom roles and scopes directly in Keycloak. This allows you to tailor the permission model to fit your precise security and governance requirements—all while still benefiting from the ready-to-use defaults Nebari provides.

## Managing Roles and Permissions
Overview
- *Roles*: Define a set of permissions (or scopes) for a particular client (service).
- *Groups*: Aggregate users who share similar permissions.
- *Scopes*: The individual permissions (e.g., “read:users:name” for reading user names) that can be attached to a role.

By creating custom roles with specific scopes, and assigning them to groups or users,
you can fine-tune exactly who can do what in your Nebari environment. More details on how to create roles and scopes can be found in the [Creating a Role](#creating-a-role) section.

## Default Clients and permissions in Nebari

Nebari comes with several custom Keycloak clients in a fresh deployment. These map to
key Nebari services and integrations:

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

Groups represent a collection of users that perform similar actions and therefore require similar permissions. By default, Nebari is deployed with the following groups: `admin`, `developer`, and `analyst` (in roughly descending order of permissions and scope).

:::info
Users in a particular group will also get access to that groups shared folder. So if `user A` belongs to the `developer`, they will also have access to the `~/shared/developer` folder. This also applies to new groups that you create.
:::

Roles on the other hand represent the type or category of user. This includes access and permissions that this category of user will need to perform their regular job duties. The differences between `groups` and `roles` are subtle. Particular roles (one or many), like `conda_store_admin`, are associated with a particular group, such as `admin` and any user in this group will then assume the role of `conda_store_admin`.

:::info
These roles can be stacked. This means that if a user is in one group with role `conda_store_admin` and another group with role `conda_store_viewer`, this user ultimately has the role `conda_store_admin`.
:::

## In-depth look at Roles and Groups

Below is a table illustrating each default group, the resources they can access, and the roles they inherit. The table also includes a brief description of the permissions granted to each group.

| Group        | Access to Nebari Resources                                                                                     | Roles                                                                                                                                                                     | Permissions Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------ | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `analyst`    | <ul><li>Conda-Store</li><li>Jupyterhub</li><li>Argo Workflows</li><li>Grafana</li></ul>                        | <ul><li>`conda_store_developer`</li><li>`jupyterhub_developer`</li><li>`argo_viewer`</li><li>`grafana_viewer`</li></ul>                                                   | <ul><li>Default user permissions</li><li>Access to start a server instance and generate JupyterHub access token.</li><li>Read/write access to shared `analyst` folder group mount</li><li>Read access to `analyst` and write access to personal conda-store namespace</li><li>Read access to Argo-Workflows and Jupyter-Scheduler </li><li>Inherent Grafana permissions from [Grafana viewer scopes](https://grafana.com/docs/grafana/latest/administration/roles-and-permissions/#organization-roles)</li></ul> |
| `developer`  | <ul><li>Conda-Store</li><li>Dask</li><li>Jupyterhub</li><li>Argo Workflows</li><li>Grafana Developer</li></ul> | <ul><li>`conda_store_developer`</li><li>`dask_developer`</li><li>`jupyterhub_developer`</li><li>`argo_developer`</li><li>`grafana_developer`</li></ul>                    | <ul><li>All of the above access, plus...</li><li>Read access `developer` conda-store namespace</li><li>Access to create Dask clusters.</li><li>Read/write access to shared `developer` folder group mount</li><li>Read/create access to Argo-Workflows and Jupyter-Scheduler</li><li>Inherent Grafana permissions from [Grafana editor scopes](https://grafana.com/docs/grafana/latest/administration/roles-and-permissions/#organization-roles)</li></ul>                                                       |
| `admin`      | <ul><li>Conda-Store</li><li>Dask</li><li>Jupyterhub</li><li>Argo Workflows</li><li>Grafana</li></ul>           | <ul><li>`conda_store_admin`</li><li>`dask_admin`</li><li>`jupyterhub_admin`</li><li>`argo_admin`</li><li>`grafana_admin`</li></ul>                                        | <ul><li>All of the above access, plus...</li><li>Read/write access to all conda-store available namespaces/environments.</li><li>Access to Jupyterhub Admin page and can access JupyterLab users spaces</li><li>Access to Keycloak and can add remove users and groups</li><li>Inherent Grafana permissions from [Grafana administrator scopes](https://grafana.com/docs/grafana/latest/administration/roles-and-permissions/#organization-roles)</li></ul>                                                      |
| `superadmin` | <ul><li>Conda-Store</li><li>Dask</li><li>Jupyterhub</li><li>Argo Workflows</li><li>Grafana</li></ul>           | <ul><li>`conda_store_superadmin`</li><li>`dask_admin`</li><li>`jupyterhub_admin`</li><li>`argo_admin`</li><li>`realm_admin` (Keycloak) </li><li>`grafana_admin`</li></ul> | <ul><li>All of the above access, plus...</li><li>Delete (build and environment) access on conda-store</li><li>Full access to Keycloak (realm) (same as `root`)</li></ul>                                                                                                                                                                                                                                                                                                                                         |

:::info
Check [Conda-store authorization model](https://conda-store.readthedocs.io/en/latest/contributing.html#authorization-model) for more details on conda-store authorization.
:::

:::caution
The role `jupyterhub_admin` gives users elevated permissions to JupyterHub and should be applied judiciously. As mentioned in the table above, a JupyterHub admin is able to impersonate other users and view the contents of their home folder. For more details, read through the [JupyterHub documentation](https://z2jh.jupyter.org/en/stable/jupyterhub/customizing/user-management.html#admin-users).
:::

To create new groups or modify (or delete) existing groups, log in as `root` and click **Groups** on the left-hand side.

As an example, we create a new group named `conda-store-manager`. This group will have administrator access to the [Conda-Store service].

1. Click **New** in the upper-right hand corner under **Groups**.

![Keycloak groups tab screenshot - user groups view](/img/how-tos/keycloak_groups.png)

- Then, give the new group an appropriate name.

![Keycloak add group form - name field set to conda-store-manager](/img/how-tos/keycloak_new_group1.png)

2. Under **Role Mapping**, add the appropriate **Client Roles** as needed; there should be no need to update the **Realm Roles**.

![Keycloak group conda-store-manager form - role mappings tab focused with expanded client roles dropdown](/img/how-tos/keycloak_new_group2.png)

In this example, the new group only has one mapped role, `conda_store_admin`; however, it's possible to attach multiple **Client Roles** to a single group.

![Keycloak group conda-store-manager form - role mappings tab focused ](/img/how-tos/keycloak_new_group3.png)

Once complete, return to the **Users** section in the dashboard and add the relevant users to this newly created group.

### Creating a Role

The process for creating a role is similar, irrespective of the service. To create a role for a
service

1. Select the appropriate client and click on "Add Role".

![Keycloak client add jupyterhub role](/img/how-tos/keycloak_jupyterhub_client.png)

2. On the "Add Role" form, write a meaningful name and description for the role. Be sure to include what this role intends to accomplish. Click "Save".

![Keycloak clients add jupyterhub role form](/img/how-tos/keycloak_jupyterhub_add_role.png)

3. Now the role has been created, but it does nothing. Let's add some permissions to it by clicking on the "Attributes" tab
   and adding scopes. The following sections will explain the `components` and `scopes` in more detail.

   ![Keycloak clients add jupyterhub role form](/img/how-tos/keycloak_add_role_attributes.png)

### Adding Role to Group(s) / User(s)

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

## Components and Scopes

When specifying fine-grained permissions in Keycloak, we use the `components` and
`scopes` attributes. These attributes are used to define the permissions that a role
grants to a user or group. This model follows the RBAC (Role-Based Access Control) model
and is based upong the same structure utilized by [Jupyterhub](https://jupyterhub.readthedocs.io/en/latest/rbac/index.html).

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
