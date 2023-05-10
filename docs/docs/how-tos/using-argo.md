---
id: using-argo
title: Automate workflows with Argo
description: Argo workflow management
---

# Automate workflows with Argo

Argo Workflows is an open source container-native workflow engine for orchestrating parallel jobs on Kubernetes. Argo
workflows comes enabled by default with Nebari deployments.

## Access Argo Server

If Argo Workflows is enabled, users can access argo workflows server at: `your-nebari-domain.com/argo`. Log in via
Keycloak with your usual credentials.

## Submit a workflow via Argo Server

You can submit a workflow by clicking "SUBMIT NEW WORKFLOW" on the landing page assuming you have the appropriate
permissions.

![Argo Server Landing Page](/img/tutorials/argo_server_landing_page.png)

## Submit a workflow via Argo CLI

You can submit or manage workflows via the Argo CLI. The Argo CLI can be downloaded from the
[Argo Releases](https://github.com/argoproj/argo-workflows/releases) page. After downloading the CLI, you can get your
token from the Argo Server UI by clicking on the user tab in the bottom left corner and then clicking "Copy To
Clipboard". You'll need to make a few edits to access to what was copied for Argo CLI to work correctly. The base href
should be `ARGO_BASE_HREF=/argo` in the default nebari installation and you need to set the namespace where Argo was
deployed (dev by default) `ARGO_NAMESPACE=dev`. After setting those variables and the others copied from the Argo Server
UI, you can check that things are working by running `argo list`.

![Argo Workflows User Tab](/img/tutorials/argo_workflows_user_tab.png)

## Jupyterflow-Override (Beta)

New users of Argo Workflows are often frustrated because the Argo Workflow pods do not have access to the same conda environments and shared files as the Jupyterlab user pod by default. To help with this use case, Nebari comes with [Nebari Workflow Controller](https://github.com/nebari-dev/nebari-workflow-controller) which overrides a portion of the Workflow spec when the
`jupyterflow-override` label is applied to a workflow. The Jupyterlab user pod's environment variables, home and shared directories, docker image, and more will be added to the Workflow. Users can then e.g. run a script that loads and saves from their home directory with a particular conda environment. This works whether the label is added to the Workflow in a kubernetes manifest, via Hera, the argo CLI, or via the Argo Server Web UI. However, this does require that a jupyter user pod be running when the workflow is submitted. The Workflow pod will have the same resources (cpu, memory) that the user pod has.

```
api: argoproj.io/v1alpha1
kind: Workflow
metadata:
  name: jupyterflow-override-example
  namespace: dev
  labels:
    example: 'true'
    jupyterflow-override: 'true'
spec:
  entrypoint: print-hello-world
  templates:
    - name: print-hello-world
      container:
        name: main
        image: any-image:any-tag  # will be overridden with the jupyter user pod image
        command:
          - sh
          - "-c"
        args:
          - "conda run -n nebari-git-dask python -c \"print('hello world')\" >> output_file_in_home_dir.txt"
```

The command starting with "conda run" runs the python print statement with the nebari-git-dask conda environment and writes stdout to the user's home directory, but could just as easily run a script in the user's home directory. The example above is for a Workflow, but the same process will work with [CronWorkflows](https://argoproj.github.io/argo-workflows/cron-workflows/) as well. In that case, the Jupyter user pod only needs to be running when the CronWorkflow is submitted, not each time the CronWorkflow starts a Workflow. The jupyterflow-override feature is in beta so please [leave some feedback](https://github.com/nebari-dev/nebari-workflow-controller/discussions) and [report any issues](https://github.com/nebari-dev/nebari-workflow-controller/issues).

## Additional Argo Workflows Resources

Refer to the [Argo documentation](https://argoproj.github.io/argo-workflows/) for further details on Argo Workflows.
