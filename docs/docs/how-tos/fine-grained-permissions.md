# Fine Grained Permissions via Keycloak

Nebari provides its users (particularly admins) a way to manage roles and permissions to
various services like jupyterhub and conda-store via keycloak. The idea is to be able to manage
roles and permissions from a central place, in this case keycloak. An admin or anyone who has
permissions to create a role in keycloak will create role(s) with assigned scopes (permissions)
to it and attach it to user(s) or group(s).

These roles are created and attached from keycloak's interface and scoped for a particular
client (i.e. a nebari service example jupyterhub, conda-store). This means the roles for a
particular service (say jupyterhub) should be created within the keycloak client named
`jupyterhub`. Below is a list of keycloak clients in a Nebari deployment:

![Keycloak clients](/img/how-tos/fine_grainer_permissions_keycloak_clients.png)

This can be accessed at `<nebari-url>/auth/admin/master/console/#/realms/nebari/clients`

We'll take a look at how to manage permissions for following services via Keycloak:

## JupyterHub

The permissions

## Conda Store
