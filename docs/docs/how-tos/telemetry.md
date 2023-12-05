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

## Installation and Usage

Telemetry can be enabled on Nebari via JupyterLab Pioneer by adding the following in the
`nebari-config.yml`:

```yaml
telemetry:
  jupyterlab_pioneer:
    enabled: true
```

This will start emitting telemetry data in the JupyterLab pods, which can be seen either via
`kubectl` or [`k9s`](https://k9scli.io/).

## Configuration

Since the telemetry events for JupyterLab is emitted in the pod logs, you may want to configure
the format for the same. This can configure logging format via `log_format` variable:
The syntax for this is same as the `format` param in python's `logging.basicConfig` method,
which is defined in the docs [here](https://docs.python.org/3/howto/logging.html#changing-the-format-of-displayed-messages).

```yaml
telemetry:
  jupyterlab_pioneer:
    enabled: true
    log_format: "%(asctime)s %(clientip)-15s %(user)-8s %(message)s"
```
