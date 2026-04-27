---
id: setup-argo
title: Set up Argo workflows
description: Argo Workflow Setup
---

# Set up Argo workflows

Argo Workflows is an open source container-native workflow engine for orchestrating parallel jobs on Kubernetes. Argo
workflows comes enabled by default with Nebari deployments.

## Access Argo Server

If Argo Workflows is enabled, users can access argo workflows server at: `your-nebari-domain.com/argo`. Log in via
Keycloak with your usual credentials.

## Overrides of Argo Workflows Helm Chart values

Argo Workflows is deployed using the Argo Workflows Helm Chart. The values.yaml for the helm chart can be overridden as
needed via the overrides flag. The default values file can be found
[here](https://github.com/argoproj/argo-helm/blob/argo-workflows-0.22.9/charts/argo-workflows/values.yaml). For example,
the following could be done to add additional environment variables to the controller container.

```yaml
argo_workflows:
  enabled: true
  overrides:
    controller:
      extraEnv:
        - name: foo
          value: bar
```

## Nebari Workflow Controller (Beta)

Nebari includes an admission controller for Argo Workflows that 1) prevents users from mounting shared directories they don't have permissions for in their Workflows and 2) provides a convenient way to start an Argo Workflow with conda envs and shared directories mounted that the user does have permissions for. Valid workflows should not be affected, however submitting Workflows via `kubectl apply` on a kubernetes manifest is not supported when Nebari Workflow Controller is enabled. Submitting Argo Workflows through other methods (Argo CLI, Argo UI, Hera, etc.) will work as expected. If you'd like to disable Nebari Workflow Controller for any reason, you can do so in the nebari-config.yaml file.

```yaml
argo_workflows:
  enabled: true
  nebari_workflow_controller:
    enabled: false
```

## Disable Argo Workflows

To turn off the cluster monitoring on Nebari deployments, simply turn off the feature flag within your
`nebari-config.yaml` file. For example:

```yaml
argo_workflows:
  enabled: false
```

Refer to the [Argo documentation](https://argoproj.github.io/argo-workflows/) for further details on Argo Workflows.
