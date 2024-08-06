# How to access system logs (Loki) via Grafana

Below is a step-by-step walkthrough of how to view JupyterHub pod logs in Grafana [Loki](https://grafana.com/docs/loki/latest/):


## Getting Started

Access the Monitoring UI for your Nebari installation at https://{your-nebari-domain}/monitoring/.

First, click "Explore".

![Grafana Explore Page](/img/how-tos/1_grafana-explore.png)

Select Loki Data source at the top:

![Grafana Select Loki](/img/how-tos/2_grafana-select-loki.png)

Select a Label to search.  In this case we are selecting 'pod':

![Grafana Select Loki](/img/how-tos/3_grafana-log-browser-pod.png)

Begin typing the name of the desired pod.  In this case we are looking
for JupyterHub pod:

![Grafana Select Loki](/img/how-tos/4_grafana-log-search-pod.png)

Select the pod from the list of pods and then click on "Run Query":

![Grafana Select Loki](/img/how-tos/5_grafana-log-select-pod.png)

After clicking on "Run Query", you should be able to see logs for JupyterHub pod as shown below:

![Grafana Select Loki](/img/how-tos/6_grafana-view-pod-logs.png)

You can also filter by time by clicking on the time filter on top right (next to "Run query").

## Common Queries

To see **logs from all deployed apps**, use the label filter `container` = `notebook`.  (The main container in each deployed app pod is named `notebook`).

To see **logs from a specific app**, use the `pod` selector and begin typing either the name of the user running the app or the app name to find the correct pod.  App pods are named with the convention `jupyter-[username]--[app_name]-[pod_id]`

To see **logs from your main JupyterLab server**, again use `pod` selector and begin typing your username.  The pod name will be `jupyter-[username]`.

To see **conda store** logs, use 'pod' and select one of the pods below.  Generally, user requests and access logs will be in the server pod, while logs related to environment builds will be in the worker.

* `nebari-conda-store-server-[id]`
* `nebari-conda-store-worker-[id]`
* `nebari-conda-store-minio-[id]`
* `nebari-conda-store-postgresql-postgresql-0`
* `nebari-conda-store-redis-master-0`


## Additional Information

* [Understand Log Query Structure](https://grafana.com/docs/loki/latest/query/log_queries/)
* [Use the Query Editor](https://grafana.com/docs/grafana/latest/datasources/loki/query-editor/#choose-a-query-editing-mode)
