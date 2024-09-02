---
title: Access system logs (Loki) via Grafana
description: Access common system logs on Nebari
---

# How to access system logs (Loki) via Grafana

Below is a step-by-step walkthrough of how to view JupyterHub pod logs in Grafana [Loki](https://grafana.com/docs/loki/latest/). As similar approach can be used to find other commonly accessed logs (summarized at the end of this document).

To view the Loki logs via Grafana in Nebari, you'll need to have [set up monitoring](/docs/how-tos/setup-monitoring) on your deployment.

## Getting Started

Access the Monitoring UI for your Nebari installation at \<https://\{your-nebari-domain\}/monitoring/\>.

:::note
The **Explore** functionality shown below is only available to users who have `grafana_admin` permissions. In Nebari's default configuration, only the users in the `admin` Keycloak user group will have this role. `grafana_admin` is a client role in Keycloak which can be assigned to other groups or users. See [Configure Keycloak](/docs/how-tos/configuring-keycloak#in-depth-look-at-roles-and-groups) for more information.
:::

First, click "Explore".

![Grafana Explore Page](/img/how-tos/1_grafana-explore.png)

Select Loki as the data source at the top:

![Grafana Select Loki](/img/how-tos/2_grafana-select-loki.png)

Select a Label to search. For this example, we will select `pod`:

![Grafana Select Loki](/img/how-tos/3_grafana-log-browser-pod.png)

Begin typing the name of the desired pod. In this case we are looking
for a JupyterHub pod. The exact name will vary on each deployment but it will begin with `hub-` followed by a unique identifier.

![Grafana Select Loki](/img/how-tos/4_grafana-log-search-pod.png)

Select the pod from the list of pods and then click on "Run Query":

![Grafana Select Loki](/img/how-tos/5_grafana-log-select-pod.png)

After clicking on "Run Query", you should be able to see logs for JupyterHub pod as shown below:

![Grafana Select Loki](/img/how-tos/6_grafana-view-pod-logs.png)

You can also filter by time by clicking on the time filter on top right (next to "Run query").

## Common Queries

The approach above can be used to access a wide variety of logs on Nebari. Below are some common queries.

### JupyterLab Server Logs

Each user will have their own JupyterLab instance (which may or may not be running at any given time) which will contain its own set of logs. To view the logs for a JupyterLab server, use `pod` label and begin typing the username of interest. The pod name will be `jupyter-{username}`.

### Conda-Store Logs

Conda-store runs multiple pods on the backend. The conda-store server runs continuously while conda-store-workers are only started when an environment is being built. Therefore, worker pods may not always exist. Generally, user requests and access logs will be in the server pod, while logs related to environment builds will be in a worker pod. In the list of conda-store pods shown below, you'll also see pods for `minio`, `postgresql`, and `redis`. These are used internally by conda-store are not likely to have any logs of interest.

- `nebari-conda-store-server-[id]`
- `nebari-conda-store-worker-[id]`
- `nebari-conda-store-minio-[id]`
- `nebari-conda-store-postgresql-postgresql-0`
- `nebari-conda-store-redis-master-0`

### Deployed app logs (via jhub-apps)

If you have `jhub-apps` enabled on your deployment, you can view the logs to debug deployed apps.

To see the logs from **all deployed apps**, use the label filter `container` = `notebook`. The main container in each deployed app pod is named `notebook`.

To see **logs from a specific app**, use the `pod` label and begin typing either the name of the user running the app or the app name to find the correct pod. App pods are named with the convention `jupyter-[username]--[app_name]-[pod_id]`.

## Additional Information

- [Understand Log Query Structure](https://grafana.com/docs/loki/latest/query/log_queries/)
- [Use the Query Editor](https://grafana.com/docs/grafana/latest/datasources/loki/query-editor/#choose-a-query-editing-mode)
