---
title: Setup Azure RBAC
description: How to set up and configure Azure RBAC for Nebari's access to Azure resources
---

# Setup Azure RBAC

Azure Role-Based Access Control (RBAC) is a powerful feature that allows you to manage who has access to Azure resources, what they can do with those resources, and what areas they have access to. Integrating Azure RBAC with Nebari ensures secure and fine-grained access control over your Kubernetes clusters and associated Azure resources.

## What is Azure RBAC?

Azure RBAC provides fine-grained access management of Azure resources. It allows you to assign permissions to users, groups, and applications at a certain scope, such as a subscription, resource group, or individual resources. This ensures that users have only the permissions they need to perform their tasks, enhancing the security and manageability of your Azure environment.

### Key Concepts

- **Role**: A collection of permissions. Azure provides built-in roles like Owner, Contributor, and Reader, and you can also create custom roles.
- **Role Assignment**: Associates a role with a user, group, or application at a specific scope.
- **Scope**: The level at which the role assignment applies. It can be a subscription, resource group, or individual resource.

For more details, refer to the [Azure RBAC documentation](https://docs.microsoft.com/azure/role-based-access-control/overview).

### Prerequisites

Before you begin, ensure you have the following:

- **Azure CLI**: Version 2.0.61 or later. Install or update it from [Install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).
- **Azure Subscription**: Access to an Azure subscription where you can create resources.
- **AKS Cluster**: An existing Nebari Azure deployment.

In this guide we will be using the Azure CLI to perform most of the operations. Instructions on how to perform the same operations using the Azure Portal can be found in the [Azure RBAC documentation](https://docs.microsoft.com/azure/role-based-access-control/overview) alongside links for installing the Azure CLI.

### Step 1: Create an Admin Group

Create an Azure AD group to serve as the admin group for the AKS cluster. This group will have full administrative permissions on the cluster and related resources.

```bash
az ad group create --display-name "nebari-admins" --mail-nickname "nebari-admins"
```

Record the Object ID for this group:

```bash
ADMIN_GROUP_ID=$(az ad group show --group "nebari-admins" --query objectId -o tsv)
echo $ADMIN_GROUP_ID
```

### Step 2: Configure Nebari to Use Azure RBAC

Update your `nebari-config.yaml` to integrate Azure RBAC settings. Ensure that the `azure_rbac` section is correctly configured to enable RBAC integration.

```yaml
azure:
  # Existing configuration...
  azure_rbac:
    enabled: true
    managed_identity: true
    admin_group_object_ids:
      - "<REPLACE_WITH_$ADMIN_GROUP_ID>"
```

::note
Ensure that the `admin_group_object_ids` correspond to the Azure AD groups you've created for managing access.
::

### Step 6: Deploy Nebari with Updated Configuration

After updating the `nebari-config.yaml`, deploy Nebari to apply the changes.

```bash
nebari deploy
```

By default, when rbac is `enabled`, Nebari will use the Azure AD group specified in
`admin_group_object_ids` to grant full administrative permissions to the AKS cluster by
automatically assigning the `Azure Kubernetes Service Cluster Admin Role` to the group.
As seen bellow:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  labels:
    addonmanager.kubernetes.io/mode: Reconcile
    kubernetes.io/cluster-service: "true"
  name: aks-cluster-admin-binding-aad
  resourceVersion: "1241646"
  uid: 3b1b3b1b-3b1b-3b1b-3b1b-3b1b3b1b3b1b
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: Group
  name: <ADMIN_GROUP_ID>
```

::warning
Ensure that your configuration changes do not inadvertently disrupt existing deployments. Review your `nebari-config.yaml` before deploying.
::

## Testing Access

To demonstrate the capabilities of the RBAC and Azure AD integration, let’s simulate access scenarios with one additional group: (`appdev`) who should only have access to a `dev` namespace. This group is not required for the core setup but serve as an illustrative example.

### Prepare Test Groups and Role Assignments

0. **Retrieve AKS Cluster ID**

   ```bash
   AKS_ID=$(az aks show --resource-group <YourResourceGroup> --name <YourAKSCluster> --query id -o tsv)
   ```

1. **Create the Developer Group**

   ```bash
   az ad group create --display-name "appdev" --mail-nickname "appdev"

   APPDEV_GROUP_ID=$(az ad group show --group "appdev" --query objectId -o tsv)
   ```

2. **Assign Reader Role (or other limited roles)**

   Assign a more restrictive role to the developer and SRE groups at the resource group level. For this example, we’ll use `Reader`:

   ```bash
   az role assignment create \
        --assignee $APPDEV_ID \
        --role "Azure Kubernetes Service Cluster User Role" \
        --scope $AKS_ID
   ```

3. **Map Azure AD Groups to Kubernetes RBAC**

   Create or apply Role and RoleBinding resources for the `dev` namespace, assigning appropriate permissions.

   For the `dev` namespace (for the `appdev` group):

   ```yaml
   # dev-role.yaml
   kind: Role
   apiVersion: rbac.authorization.k8s.io/v1
   metadata:
     namespace: dev
     name: dev-view-role
   rules:
   - apiGroups: [""]
     resources: ["pods"]
     verbs: ["get", "list"]

   ---
   # dev-rolebinding.yaml
   kind: RoleBinding
   apiVersion: rbac.authorization.k8s.io/v1
   metadata:
     namespace: dev
     name: dev-view-binding
   subjects:
   - kind: Group
     name: $APPDEV_GROUP_ID # Azure AD group ID for developers
     apiGroup: rbac.authorization.k8s.io
   roleRef:
     kind: Role
     name: dev-view-role
     apiGroup: rbac.authorization.k8s.io
   ```

   Apply the `dev` namespace roles:

   ```bash
   kubectl apply -f dev-role.yaml
   kubectl apply -f dev-rolebinding.yaml
   ```

### Test Application Developer Access

1. **Log in as Developer**

   ```bash
   az login -u <AAD_DEV_UPN> -p '<AAD_DEV_PW>'
   ```

   ::note
   This is just for testing and to serve as an exmaple, vvoid using passwords directly
   in command-line operations instead.
   ::

2. **Retrieve Kubeconfig for Developer**

   ```bash
   az aks get-credentials --resource-group <YourResourceGroup> --name <YourAKSCluster> --overwrite-existing
   ```

   Update authentication details using `kubelogin`:

   ```bash
   kubelogin remove-tokens
   kubelogin convert-kubeconfig -l azurecli
   ```

3. **Attempt to Access Dev Namespace**

   ```bash
   kubectl get pods --namespace dev
   ```

   **Expected Outcome:** The developer (in the `appdev` group) should be able to list and view pods within the `dev` namespace.

4. **Attempt to Access default Namespace**

   ```bash
   kubectl get pods --namespace default
   ```

   **Expected Outcome:** Access should be denied, indicating that the developer does not have permissions in the `default` namespace.

## Clean Up Resources

To avoid incurring unnecessary costs, clean up the resources created during this setup.

```bash
# Retrieve admin credentials
az aks get-credentials --resource-group <YourResourceGroup> --name <YourAKSCluster> --admin

# Delete Azure AD user if created for testing
az ad user delete --upn-or-object-id $AKSDEV_ID

# Delete Azure AD test groups
az ad group delete --group appdev
```

::warning
Deleting users and groups is irreversible. Ensure that these actions do not affect other parts of your organization.
::
