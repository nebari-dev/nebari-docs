---
id: fine-grained-permissions
title: Creating and Managing Groups, Roles, and Directories
description: How to configure Keycloak's permissions, groups and roles, and manage group directories in JupyterHub.
---

Groups are a fundamental and vital part of the Nebari ecosystem. They are used to manage access to a wide range of services within Nebari, including JupyterHub instances, Keycloak realms, Conda environments, and computing resources. By grouping users based on roles, projects, or departments, Nebari simplifies the management of permissions and resource sharing.

Beyond managing access, groups play a crucial role in organizing and sharing data across the JupyterHub ecosystem. Each group can have its own shared directory within JupyterHub, allowing users within the same group to collaborate seamlessly by sharing files and resources. This facilitates team collaboration and ensures that data is organized and accessible to those who need it.

In this document, we will cover:

- How to create and manage groups and subgroups in Keycloak
- How to assign roles and permissions to groups
- How groups and roles interact within Nebari's services, such as JupyterHub and Conda-Store
- How to manage group directories in JupyterHub

## Managing Groups in Keycloak

Keycloak is the identity and access management service used in Nebari. It allows you to create and manage users, groups, roles, and permissions. Groups in Keycloak are collections of users, and they can be assigned specific roles that grant permissions to access various services within Nebari.

For detailed information on managing groups in Keycloak, refer to the [Keycloak documentation on Group Management](https://www.keycloak.org/docs/latest/server_admin/#_group_management).

Below we outline the steps specific to Nebari.

### Creating a New Group

To create a new group in Keycloak:

1. **Log in to Keycloak** as an administrator (usually the `root` user).
2. **Navigate to Groups**: Click on **Groups** in the left-hand menu.
3. **Create the Group**: Click the **New** button, enter an appropriate name for your new group (e.g., `conda-store-manager`), and save.

If you wish to organize your groups hierarchically, you can create subgroups by selecting a parent group and adding a subgroup.

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

### Adding Users to a Group

To add users to a group:

1. **Navigate to Users**: Click on **Users** in the left-hand menu.
2. **Select a User**: Choose the user you want to add to a group.
3. **Assign to Group**:
   - Click on the **Groups** tab within the user's details.
   - Click the **Join** button.
   - Select the group (and subgroup, if applicable) you wish to add the user to.
   - Click **Join** to add the user to the group.

Repeat this process for all users who should be part of the group.

### Managing Subgroups

Subgroups allow you to create a hierarchical structure of groups, representing organizational units, projects, or teams. Subgroups inherit roles and attributes from their parent groups unless explicitly overridden.

To manage subgroups:

- **Creating Subgroups**: Select the parent group, navigate to the **Sub Groups** tab, and create a new subgroup.
- **Assigning Roles to Subgroups**: Roles are not automatically inherited; assign roles to subgroups as needed.
- **Use Cases**: Organize groups hierarchically to reflect organizational structures.

For more information, see the [Keycloak documentation on Group Hierarchies](https://www.keycloak.org/docs/latest/server_admin/#group-hierarchies).

## Managing Group Directories in JupyterHub

:::note Important
As of version `2024.9.1`, JupyterHub creates and mounts directories only for groups with the `allow-group-directory-creation-role`. By default, this includes the `admin`, `analyst`, and `developer` groups. Previously, directories were automatically created for all Keycloak groups. This change gives administrators more control over shared directories and overall access management without cluttering the file system.
:::

### Understanding Group Directories

A group directory in JupyterHub is a shared folder accessible to all members of a specific group. It provides a shared space within the file system for collaboration.

An example directory structure:

```yaml
/shared
├── admin
│   ├── file1.txt
│   └── file2.txt
├── analyst
│   ├── file1.txt
│   └── file2.txt
└── developer
    ├── file1.txt
    └── file2.txt
```

### Assigning the `allow-group-directory-creation-role` to a Group

To enable directory creation and mounting for a group in JupyterHub, assign the `allow-group-directory-creation-role` to the group in Keycloak.

#### Steps to Assign the Role:

1. **Navigate to the Group**: Log in to Keycloak as an administrator and select the group.
2. **Go to Role Mappings**: Click on the **Role Mappings** tab.
3. **Assign the Role**:
   - Under **Client Roles**, select the `jupyterhub` client.
   - Select `allow-group-directory-creation-role` and click **Add selected**.

Users in this group will now have access to the group's shared directory in JupyterHub.

### Rolling Back the Change

To remove the group's directory access:

1. **Navigate to the Group's Role Mappings**: Select the group and go to the **Role Mappings** tab.
2. **Remove the Role**:
   - Under **Assigned Roles**, select `allow-group-directory-creation-role`.
   - Click **Remove selected**.

**Data Preservation:** No data is deleted when you remove the role; the directory is simply unmounted from users' JupyterLab sessions.

### Managing Subgroup Directories

Subgroups can have their own directories in JupyterHub if assigned the `allow-group-directory-creation-role`. Assign the role to subgroups as needed to control access and collaboration.

## In-Depth Look at Roles and Groups

Understanding how roles and groups work together is essential for effectively managing access and permissions within Nebari.

### Groups

Groups represent collections of users who perform similar functions or belong to the same organizational unit. They simplify user management by allowing you to assign roles and permissions at the group level rather than individually to each user.

By default, Nebari is deployed with the following groups:

- **admin**: Users with administrative privileges who can manage the system, configurations, and users.
- **developer**: Users who need access to development tools and environments.
- **analyst**: Users who primarily analyze data and may have restricted access compared to developers.

Groups can be organized hierarchically using subgroups, allowing for more granular control and reflecting organizational structures.

:::info
**Shared Directories:** Users in a particular group will have access to that group's shared directory in JupyterHub if the group has the `allow-group-directory-creation-role` assigned.
:::

### Roles

Roles define a set of permissions that grant access to specific resources or capabilities within Nebari's services. They are assigned to groups or users and determine what actions they can perform.

Roles can be of two types:

- **Realm Roles**: Apply globally across all clients (applications) in Keycloak.
- **Client Roles**: Specific to a client (application), such as `jupyterhub`, `conda-store`, or `grafana`.

Examples of roles include:

- `admin`: Grants administrative privileges within a client.
- `developer`: Grants development-related permissions.
- `conda_store_admin`: Allows managing Conda environments in Conda-Store.

### Interaction Between Roles and Groups

Roles are assigned to groups, and users inherit those roles through their group memberships. This means that:

- **Users in a Group Get the Group's Roles**: If a group has certain roles assigned, all users in that group will inherit those roles.
- **Multiple Roles Can Be Assigned**: A group can have multiple roles from different clients, providing access to various services.
- **Roles Are Not Inherited by Subgroups**: Roles need to be explicitly assigned to subgroups if you want them to have specific permissions.

### Role Hierarchies and Stacking

Roles can be designed to reflect hierarchical permissions. For example, an `admin` role may encompass all the permissions of a `developer` role.

:::info
**Role Stacking:** If a user is a member of multiple groups with different roles, they effectively have the combined permissions of all assigned roles. For instance, if a user is in a group with the `conda_store_admin` role and another group with the `conda_store_viewer` role, the user will have administrative privileges in Conda-Store due to the higher permission level of `conda_store_admin`.
:::

### Assigning Roles to Groups

When creating or editing a group in Keycloak:

1. **Select the Group**: Navigate to the group you wish to assign roles to.
2. **Go to Role Mappings**: Click on the **Role Mappings** tab.
3. **Assign Roles**:
   - Under **Client Roles**, select the client application.
   - Select the roles you wish to assign and click **Add selected**.

## Access Levels and Permissions

Roles on the other hand represent the type or category of user. This includes access and permissions that this category of user will need to perform their regular job duties. The differences between `groups` and `roles` are subtle. Particular roles (one or many), like `conda_store_admin`, are associated with a particular group, such as `admin` and any user in this group will then assume the role of `conda_store_admin`.

:::info
These roles can be stacked. This means that if a user is in one group with role `conda_store_admin` and another group with role `conda_store_viewer`, this user ultimately has the role `conda_store_admin`.
:::

Below is a summary of default groups, their access to Nebari resources, assigned roles, and permissions descriptions.

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
