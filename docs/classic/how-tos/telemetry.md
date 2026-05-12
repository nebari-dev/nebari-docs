# Telemetry

:::note
Nebari does NOT collects telemetry data from its installations.
This document is for using telemetry for users/organization's
private usage/visualization/processing of data for JupyterLab events.
:::

Telemetry in Nebari enables the collection, processing, and visualization of data
related to Jupyter Lab events. This documentation provides a guide on setting up
and utilizing telemetry features effectively.

Nebari uses [jupyterlab-pioneer](https://jupyterlab-pioneer.readthedocs.io/en/latest/) for
enabling telemetry on JupyterLab usage data.

## JupyterLab Pioneer

JupyterLab Pioneer is a JupyterLab extension for generating and exporting JupyterLab event
telemetry data.

## Installation

Telemetry can be enabled on Nebari via JupyterLab Pioneer by adding the following in the
`nebari-config.yml`:

```yaml
telemetry:
  jupyterlab_pioneer:
    enabled: true
```

## Configuration

Since the telemetry events for JupyterLab is emitted in the pod logs, you may want to configure
the format for the same. This can configure logging format via `log_format` variable:
The syntax for this is same as the `format` param in python's `logging.basicConfig` method,
which is defined in the docs [here](https://docs.python.org/3/howto/logging.html#changing-the-format-of-displayed-messages).

```yaml
telemetry:
  jupyterlab_pioneer:
    enabled: true
    log_format: "%(asctime)s %(levelname)9s %(lineno)4s %(module)s: %(message)s"
```

## Usage

Enabling `jupyterlab_pioneer` in `telemetry` will start emitting telemetry data in the JupyterLab pods,
which can be seen either via [`kubectl`](https://kubernetes.io/docs/reference/kubectl/) or
[`k9s`](https://k9scli.io/). Below are some logs for some jupyterlab events.

```
2023-11-14 12:00:29.039 {"eventDetail": {"eventName": "ActiveCellChangeEvent", "eventTime": 1699962682425, "eventInfo": {"cells": [{"id": "83a72108-db56-43e3-b938-4aca6667484f", "index": 5}]}}, "notebookState": {"sessionID": "09ceefc2-82af-41d0-b806-a76369748020", "notebookPath": "alpha.ipynb", "notebookContent": null}}
2023-11-14 12:00:29.039 {"eventDetail": {"eventName": "CellEditEvent", "eventTime": 1699962682296, "eventInfo": {"index": 6, "doc": [""]}}, "notebookState": {"sessionID": "09ceefc2-82af-41d0-b806-a76369748020", "notebookPath": "alpha.ipynb", "notebookContent": null}}
2023-11-14 12:00:29.039 {"eventDetail": {"eventName": "CellRemoveEvent", "eventTime": 1699962682286, "eventInfo": {"cells": [{"index": 7}]}}, "notebookState": {"sessionID": "09ceefc2-82af-41d0-b806-a76369748020", "notebookPath": "alpha.ipynb", "notebookContent": null}}
2023-11-14 12:00:29.039 {"eventDetail": {"eventName": "ActiveCellChangeEvent", "eventTime": 1699962682284, "eventInfo": {"cells": [{"id": "2f4e6013-6729-4e01-8419-4feeda64cd48", "index": 6}]}}, "notebookState": {"sessionID": "09ceefc2-82af-41d0-b806-a76369748020", "notebookPath": "alpha.ipynb", "notebookContent": null}}
2023-11-14 12:00:29.039 {"eventDetail": {"eventName": "CellEditEvent", "eventTime": 1699962682122, "eventInfo": {"index": 7, "doc": [""]}}, "notebookState": {"sessionID": "09ceefc2-82af-41d0-b806-a76369748020", "notebookPath": "alpha.ipynb", "notebookContent": null}}
2023-11-14 12:00:29.039 {"eventDetail": {"eventName": "CellRemoveEvent", "eventTime": 1699962682112, "eventInfo": {"cells": [{"index": 8}]}}, "notebookState": {"sessionID": "09ceefc2-82af-41d0-b806-a76369748020", "notebookPath": "alpha.ipynb", "notebookContent": null}}
2023-11-14 12:00:29.039 {"eventDetail": {"eventName": "ActiveCellChangeEvent", "eventTime": 1699962682109, "eventInfo": {"cells": [{"id": "8edeabdf-fdd1-4465-af5b-ca13c314eea4", "index": 7}]}}, "notebookState": {"sessionID": "09ceefc2-82af-41d0-b806-a76369748020", "notebookPath": "alpha.ipynb", "notebookContent": null}}
2023-11-14 12:00:29.039 {"eventDetail": {"eventName": "CellEditEvent", "eventTime": 1699962681958, "eventInfo": {"index": 8, "doc": [""]}}, "notebookState": {"sessionID": "09ceefc2-82af-41d0-b806-a76369748020", "notebookPath": "alpha.ipynb", "notebookContent": null}}
2023-11-14 12:00:29.039 {"eventDetail": {"eventName": "CellRemoveEvent", "eventTime": 1699962681950, "eventInfo": {"cells": [{"index": 9}]}}, "notebookState": {"sessionID": "09ceefc2-82af-41d0-b806-a76369748020", "notebookPath": "alpha.ipynb", "notebookContent": null}}
2023-11-14 12:00:29.039 {"eventDetail": {"eventName": "ActiveCellChangeEvent", "eventTime": 1699962681948, "eventInfo": {"cells": [{"id": "6b8d84a5-c72c-4c8e-9125-39bd8cf0bee5", "index": 8}]}}, "notebookState": {"sessionID": "09ceefc2-82af-41d0-b806-a76369748020", "notebookPath": "alpha.ipynb", "notebookContent": null}}
2023-11-14 12:00:29.039 {"eventDetail": {"eventName": "CellEditEvent", "eventTime": 1699962681786, "eventInfo": {"index": 9, "doc": [""]}}, "notebookState": {"sessionID": "09ceefc2-82af-41d0-b806-a76369748020", "notebookPath": "alpha.ipynb", "notebookContent": null}}
2023-11-14 12:00:29.039 {"eventDetail": {"eventName": "CellRemoveEvent", "eventTime": 1699962681775, "eventInfo": {"cells": [{"index": 10}]}}, "notebookState": {"sessionID": "09ceefc2-82af-41d0-b806-a76369748020", "notebookPath": "alpha.ipynb", "notebookContent": null}}
2023-11-14 12:00:29.039 {"eventDetail": {"eventName": "ActiveCellChangeEvent", "eventTime": 1699962681773, "eventInfo": {"cells": [{"id": "f5c73955-fc57-438c-9b81-2b197f5ce609", "index": 9}]}}, "notebookState": {"sessionID": "09ceefc2-82af-41d0-b806-a76369748020", "notebookPath": "alpha.ipynb", "notebookContent": null}}
```
