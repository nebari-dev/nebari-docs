# Monitoring

In Nebari, we've integrated Grafana, Prometheus, and Loki to provide robust monitoring capabilities for
your data science platform. This integration allows you to visualize metrics, monitor system health, and
analyze logs effectively. Below, we'll discuss each component and how they are deployed using Helm charts,
along with instructions on how to override configuration values.

Monitoring is enabled by default in Nebari. It can be disabled by setting the following in your `nebari-config.yaml`.

```yaml
monitoring:
  enabled: false
```

## Components Overview

### Grafana

Grafana is a leading open-source platform for monitoring and observability. It provides rich visualization
tools and dashboards for analyzing and monitoring metrics from various data sources.

### Prometheus

Prometheus is a popular open-source monitoring and alerting toolkit. It collects metrics from configured targets,
stores them efficiently, and allows querying them in real-time.

### Loki

Loki is a horizontally-scalable, highly available, multi-tenant log aggregation system inspired by Prometheus.
It is designed to be very cost-effective and easy to operate, as it does not index the contents of the logs,
but rather a set of labels for each log stream.

#### Deployment Configuration:

Nebari provides its users with the ability to customize the deployment of various component
and Loki is one of them. Loki deployment is made up of three fundamental components:

- Loki: a set of components that when composed forms a fully featured logging stack
- Promtail: an agent which ships the contents of local logs to a Loki instance
- MinIO: a Kubernetes-native high-performance object storage server which is designed for large-scale
  private cloud infrastructure and compatible with Amazon S3.

## Terraform Overrides

```yaml
monitoring:
  enabled: true
  overrides:
    loki: <LOKI-HELM-CHART-VALUES-OVERRIDE>
    promtail: <PROMTAIL-HELM-CHART-VALUES-OVERRIDE>
    minio: <MINIO-HELM-CHART-VALUES-OVERRIDE>
```
