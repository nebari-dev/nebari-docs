## Deploying and Running Nebari from a Private Container Repository

Nebari deploys and runs FOSS components as containers running in Kubernetes. 
By default, Nebari sources each container from the container's respective public repository, typically `docker.io` or `quay.io`. 
This introduces supply-chain concerns for security-focused customers.


One solution to these supply-chain concerns is to deploy Nebari from private locally-mirrored containers:  
- Create a controlled private container repository (e.g. ECR or GitLab Container Repo)
- Mirror all containers used by Nebari into this private container repository
- Use the `overrides` mechanism in `nebari-config.yaml` to specify the mirrored container sources

Deploying Nebari in this fashion eliminates significant supply chain surface-area, but requires identifying all containers used by Nebari.  

The following configuration enumerates all container images used by Nebari 2024-9-1 and demonstrates how to source them from a private repo denoted by the string `[LOCAL_ECR].dkr.ecr.us-gov-east-1.amazonaws.com`.  
The commented-out `registry` and `repository` keys document the original public source repository from which the container images are to be mirrored.

```
monitoring:
  overrides:
    prometheus:
      alertmanager:
        alertmanagerSpec:
          ## Image of Alertmanager
          image:
            #registry: quay.io
            #repository: prometheus/alertmanager
            registry: [LOCAL_ECR].dkr.ecr.us-gov-east-1.amazonaws.com
            repository: quay.io/prometheus/alertmanager
            tag: v0.27.0
            sha: ""
      grafana:
        image:
          #registry: docker.io
          registry: [LOCAL_ECR].dkr.ecr.us-gov-east-1.amazonaws.com
          #repository: grafana/grafana
          repository: docker.io/grafana/grafana
          tag: ""
          sha: ""
          pullPolicy: IfNotPresent
        sidecar:
          image:
            #registry: quay.io
            registry: [LOCAL_ECR].dkr.ecr.us-gov-east-1.amazonaws.com
            #repository: kiwigrid/k8s-sidecar
            repository: quay.io/kiwigrid/k8s-sidecar
            tag: 1.26.1
            sha: ""
      prometheusOperator:
        image:
          #registry: quay.io
          registry: [LOCAL_ECR].dkr.ecr.us-gov-east-1.amazonaws.com
          #repository: prometheus-operator/prometheus-operator
          repository: quay.io/prometheus-operator/prometheus-operator
          tag: ""
          sha: ""
        prometheusConfigReloader:
          image:
            #registry: quay.io
            registry: [LOCAL_ECR].dkr.ecr.us-gov-east-1.amazonaws.com
            #repository: prometheus-operator/prometheus-config-reloader
            repository: quay.io/prometheus-operator/prometheus-config-reloader
            tag: ""
            sha: ""
      kube-state-metrics:
        image:
          #registry: registry.k8s.io
          registry: [LOCAL_ECR].dkr.ecr.us-gov-east-1.amazonaws.com
          #repository: kube-state-metrics/kube-state-metrics
          repository: registry.k8s.io/kube-state-metrics/kube-state-metrics
          tag: ""
          sha: ""
          pullPolicy: IfNotPresent
      prometheus-node-exporter:
        image:
          #registry: quay.io
          registry: [LOCAL_ECR].dkr.ecr.us-gov-east-1.amazonaws.com
          #repository: prometheus/node-exporter
          repository: quay.io/prometheus/node-exporter
          tag: ""
          pullPolicy: IfNotPresent
          digest: ""
      prometheus:
        prometheusSpec:
          image:
            #registry: quay.io
            registry: [LOCAL_ECR].dkr.ecr.us-gov-east-1.amazonaws.com
            #repository: prometheus/prometheus
            repository: quay.io/prometheus/prometheus
            tag: v2.51.2
            sha: ""
    loki:
      loki:
        image:
          #registry: docker.io
          registry: [LOCAL_ECR].dkr.ecr.us-gov-east-1.amazonaws.com
          #repository: grafana/loki
          repository: docker.io/grafana/loki
          tag: null
        lokiCanary:
          image:
            #registry: docker.io
            registry: [LOCAL_ECR].dkr.ecr.us-gov-east-1.amazonaws.com
            #repository: grafana/loki-canary
            repository: docker.io/grafana/loki-canary
            tag: null
      gateway:
        image:
          #registry: docker.io
          registry: [LOCAL_ECR].dkr.ecr.us-gov-east-1.amazonaws.com
          #repository: nginxinc/nginx-unprivileged
          repository: docker.io/nginxinc/nginx-unprivileged
          tag: 1.24-alpine
      sidecar:
        image:
          #repository: kiwigrid/k8s-sidecar
          repository: [LOCAL_ECR].dkr.ecr.us-gov-east-1.amazonaws.com/kiwigrid/k8s-sidecar
          tag: 1.24.3
    promtail:
      image:
        #registry: docker.io
        registry: [LOCAL_ECR].dkr.ecr.us-gov-east-1.amazonaws.com
        #repository: grafana/promtail
        repository: docker.io/grafana/promtail
        tag: null
    # https://github.com/bitnami/charts/blob/440ec159c26e4ff0748b9e9866b345d98220c40a/bitnami/minio/values.yaml
    minio:
      image:
        #registry: docker.io
        registry: [LOCAL_ECR].dkr.ecr.us-gov-east-1.amazonaws.com
        #repository: bitnami/minio
        repository: docker.io/bitnami/minio
        tag: 2021.4.22-debian-10-r0
jupyterhub:
  #volume_mount_init_image: "busybox:1.31"
  volume_mount_init_image: [LOCAL_ECR].dkr.ecr.us-gov-east-1.amazonaws.com/busybox:1.31
    proxy:
      chp:
        image:
          #name: quay.io/jupyterhub/configurable-http-proxy
          name: [LOCAL_ECR].dkr.ecr.us-gov-east-1.amazonaws.com/quay.io/jupyterhub/configurable-http-proxy
          tag: 4.6.1
    scheduling:
      userScheduler:
        enabled: true
        image:
          #name: registry.k8s.io/kube-scheduler
          name: [LOCAL_ECR].dkr.ecr.us-gov-east-1.amazonaws.com/registry.k8s.io/kube-scheduler
          tag: "v1.28.10"
    singleuser:
      networkTools:
        image:
          #name: quay.io/jupyterhub/k8s-network-tools
          name: [LOCAL_ECR].dkr.ecr.us-gov-east-1.amazonaws.com/quay.io/jupyterhub/k8s-network-tools
          tag: 4.0.0-0.dev.git.6548.h9b2dfe22
    prePuller:
      pause:
        image:
          #name: registry.k8s.io/pause
          name: [LOCAL_ECR].dkr.ecr.us-gov-east-1.amazonaws.com/registry.k8s.io/pause
          tag: "3.10"
jupyterhub_ssh:
  jupyterhub_ssh_image:
    name: [LOCAL_ECR].dkr.ecr.us-gov-east-1.amazonaws.com/quay.io/jupyterhub-ssh/ssh
    tag: 0.0.1-0.dev.git.136.ha610981
  jupyterhub_sftp_image:
    name: [LOCAL_ECR].dkr.ecr.us-gov-east-1.amazonaws.com/quay.io/jupyterhub-ssh/sftp
    tag: 0.0.1-0.dev.git.142.h402a3d6
dask_gateway:
  dask_gateway_image:
    #name: ghcr.io/dask/dask-gateway-server
    name: [LOCAL_ECR].dkr.ecr.us-gov-east-1.amazonaws.com/ghcr.io/dask/dask-gateway-server
    tag: "2022.4.0"
  dask_controller_image:
    #name: ghcr.io/dask/dask-gateway-server
    name: [LOCAL_ECR].dkr.ecr.us-gov-east-1.amazonaws.com/ghcr.io/dask/dask-gateway-server
    tag: "2022.4.0"
forward_auth:
  traefik_forwardauth_image:
    #name: maxisme/traefik-forward-auth
    name: [LOCAL_ECR].dkr.ecr.us-gov-east-1.amazonaws.com/maxisme/traefik-forward-auth
    tag: "sha-a98e568"
```
