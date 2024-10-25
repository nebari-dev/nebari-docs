## Deploying and Running Nebari from a Private Container Repository

Nebari deploys and runs FOSS components as containers running in Kubernetes.
By default, Nebari sources each container from the container's respective public repository, typically `docker.io` or `quay.io`.
This introduces supply-chain concerns for security-focused customers.

One solution to these supply-chain concerns is to deploy Nebari from private locally-mirrored containers:

- Create a controlled private container repository (e.g. ECR or GitLab Container Repo)
- Mirror all containers used by Nebari into this private container repository
- Use the `overrides` mechanism in `nebari-config.yaml` to specify the mirrored container sources

Deploying Nebari in this fashion eliminates significant supply chain surface-area, but requires identifying all containers used by Nebari.

The following configuration enumerates all container images used by Nebari 2024-9-1 and demonstrates how to source them from a private repo denoted by the string `[LOCAL_REPO]`.  
The commented-out elements document the original public sources from which the container images are to be mirrored.

### Nebari 2024-9-1 Containers

```
default_images:
  #jupyterhub: quay.io/nebari/nebari-jupyterhub:2024.5.1
  jupyterhub: [LOCAL_REPO]/quay.io/nebari/nebari-jupyterhub:2024.5.1
  #jupyterlab: quay.io/nebari/nebari-jupyterlab:2024.5.1
  jupyterlab: [LOCAL_REPO]/quay.io/nebari/nebari-jupyterlab:2024.5.1
  #dask_worker: quay.io/nebari/nebari-dask-worker:2024.5.1
  dask_worker: [LOCAL_REPO]/quay.io/nebari/nebari-dask-worker:2024.5.1

security:
  keycloak:
    overrides:
      image:
        # Keycloak image repository
        #repository: quay.io/keycloak/keycloak # default
        repository: [LOCAL_REPO]/quay.io/keycloak/keycloak
        # Overrides the Keycloak image tag whose default is the chart version
        #tag: "15.0.2" # default
        tag: ""

      # This container is used at deploy-time to download keycloak-metrics-spi
      extraInitContainers: |
        - command:
          - sh
          - -c
          - | wget --no-check-certificate https://github.com/aerogear/keycloak-metrics-spi/releases/download/2.5.3/keycloak-metrics-spi-2.5.3.jar -P /data/ &&
            export SHA256SUM=9b3f52f842a66dadf5ff3cc3a729b8e49042d32f84510a5d73d41a2e39f29a96 &&
            if ! (echo "$SHA256SUM  /data/keycloak-metrics-spi-2.5.3.jar" | sha256sum -c)
              then
                echo "Error: Checksum not verified" && exit 1
              else
                chown 1000:1000 /data/keycloak-metrics-spi-2.5.3.jar &&
                chmod 777 /data/keycloak-metrics-spi-2.5.3.jar
            fi
          image: [LOCAL_REPO]/alpine:latest
          name: initialize-spi-metrics-jar
      pgchecker:
        image:
          # repository: docker.io/busybox
          repository: [LOCAL_REPO]/docker.io/busybox
          tag: 1.32
      postgresql:
        image:
          #registry: docker.io
          registry: [LOCAL_REPO]
          #repository: bitnami/postgresql
          repository: docker.io/bitnami/postgresql
          tag: 11.11.0-debian-10-r31
          digest: ""

cluster_autoscaler:
  overrides:
    image:
      #repository: k8s.gcr.io/autoscaling/cluster-autoscaler
      repository: [LOCAL_REPO]/k8s.gcr.io/autoscaling/cluster-autoscaler
      tag: v1.23.0

ingress:
    traefik-image:
      image: [LOCAL_REPO]/traefik
      tag: 2.9.1

conda_store:
  image: [LOCAL_REPO]/quansight/conda-store-server
  image_tag: 2024.3.1

conda_store:
  nfs_server_image: [LOCAL_REPO]/gcr.io/google_containers/volume-nfs
  nfs_server_image_tag: "0.8"
  overrides:
    minio:
      image:
        #registry: docker.io
        registry: [LOCAL_REPO]
        #repository: bitnami/minio
        repository: docker.io/bitnami/minio
        tag: 2021.4.22-debian-10-r0
    postgresql:
      image:
        #registry: docker.io
        registry: [LOCAL_REPO]
        #repository: bitnami/postgresql
        repository: docker.io/bitnami/postgresql
        tag: 11.14.0-debian-10-r17
        digest: ""
    redis:
      image:
        #registry: docker.io
        registry: [LOCAL_REPO]
        #repository: bitnami/redis
        repository: docker.io/bitnami/redis
        tag: 7.0.4-debian-11-r4
        digest: ""

argo_workflows:
  overrides:
    controller:
      image:
        #registry: quay.io
        registry: [LOCAL_REPO]
        #repository: argoproj/workflow-controller
        repository: quay.io/argoproj/workflow-controller
        tag: ""
    server:
      image:
        #registry: quay.io
        registry: [LOCAL_REPO]
        #repository: argoproj/argocli
        repository: quay.io/argoproj/argocli
        tag: "v3.4.4"
  nebari_workflow_controller:
    enabled: true
    image: [LOCAL_REPO]/quay.io/nebari/nebari-workflow-controller
    image_tag: 2024.5.1

monitoring:
  overrides:
    prometheus:
      alertmanager:
        alertmanagerSpec:
          ## Image of Alertmanager
          image:
            #registry: quay.io
            #repository: prometheus/alertmanager
            registry: [LOCAL_REPO]
            repository: quay.io/prometheus/alertmanager
            tag: v0.27.0
            sha: ""
      grafana:
        image:
          #registry: docker.io
          registry: [LOCAL_REPO]
          #repository: grafana/grafana
          repository: docker.io/grafana/grafana
          tag: ""
          sha: ""
          pullPolicy: IfNotPresent
        sidecar:
          image:
            #registry: quay.io
            registry: [LOCAL_REPO]
            #repository: kiwigrid/k8s-sidecar
            repository: quay.io/kiwigrid/k8s-sidecar
            tag: 1.26.1
            sha: ""
      prometheusOperator:
        image:
          #registry: quay.io
          registry: [LOCAL_REPO]
          #repository: prometheus-operator/prometheus-operator
          repository: quay.io/prometheus-operator/prometheus-operator
          tag: ""
          sha: ""
        prometheusConfigReloader:
          image:
            #registry: quay.io
            registry: [LOCAL_REPO]
            #repository: prometheus-operator/prometheus-config-reloader
            repository: quay.io/prometheus-operator/prometheus-config-reloader
            tag: ""
            sha: ""
      kube-state-metrics:
        image:
          #registry: registry.k8s.io
          registry: [LOCAL_REPO]
          #repository: kube-state-metrics/kube-state-metrics
          repository: registry.k8s.io/kube-state-metrics/kube-state-metrics
          tag: ""
          sha: ""
          pullPolicy: IfNotPresent
      prometheus-node-exporter:
        image:
          #registry: quay.io
          registry: [LOCAL_REPO]
          #repository: prometheus/node-exporter
          repository: quay.io/prometheus/node-exporter
          tag: ""
          pullPolicy: IfNotPresent
          digest: ""
      prometheus:
        prometheusSpec:
          image:
            #registry: quay.io
            registry: [LOCAL_REPO]
            #repository: prometheus/prometheus
            repository: quay.io/prometheus/prometheus
            tag: v2.51.2
            sha: ""
    loki:
      loki:
        image:
          #registry: docker.io
          registry: [LOCAL_REPO]
          #repository: grafana/loki
          repository: docker.io/grafana/loki
          tag: null
        lokiCanary:
          image:
            #registry: docker.io
            registry: [LOCAL_REPO]
            #repository: grafana/loki-canary
            repository: docker.io/grafana/loki-canary
            tag: null
      gateway:
        image:
          #registry: docker.io
          registry: [LOCAL_REPO]
          #repository: nginxinc/nginx-unprivileged
          repository: docker.io/nginxinc/nginx-unprivileged
          tag: 1.24-alpine
      sidecar:
        image:
          #repository: kiwigrid/k8s-sidecar
          repository: [LOCAL_REPO]/kiwigrid/k8s-sidecar
          tag: 1.24.3
    promtail:
      image:
        #registry: docker.io
        registry: [LOCAL_REPO]
        #repository: grafana/promtail
        repository: docker.io/grafana/promtail
        tag: null
    minio:
      image:
        #registry: docker.io
        registry: [LOCAL_REPO]
        #repository: bitnami/minio
        repository: docker.io/bitnami/minio
        tag: 2021.4.22-debian-10-r0

jupyterhub:
  #volume_mount_init_image: "busybox:1.31"
  volume_mount_init_image: [LOCAL_REPO]/busybox:1.31
    proxy:
      chp:
        image:
          #name: quay.io/jupyterhub/configurable-http-proxy
          name: [LOCAL_REPO]/quay.io/jupyterhub/configurable-http-proxy
          tag: 4.6.1
    scheduling:
      userScheduler:
        enabled: true
        image:
          #name: registry.k8s.io/kube-scheduler
          name: [LOCAL_REPO]/registry.k8s.io/kube-scheduler
          tag: "v1.28.10"
    singleuser:
      networkTools:
        image:
          #name: quay.io/jupyterhub/k8s-network-tools
          name: [LOCAL_REPO]/quay.io/jupyterhub/k8s-network-tools
          tag: 4.0.0-0.dev.git.6548.h9b2dfe22
    prePuller:
      pause:
        image:
          #name: registry.k8s.io/pause
          name: [LOCAL_REPO]/registry.k8s.io/pause
          tag: "3.10"
jupyterhub_ssh:
  jupyterhub_ssh_image:
    name: [LOCAL_REPO]/quay.io/jupyterhub-ssh/ssh
    tag: 0.0.1-0.dev.git.136.ha610981
  jupyterhub_sftp_image:
    name: [LOCAL_REPO]/quay.io/jupyterhub-ssh/sftp
    tag: 0.0.1-0.dev.git.142.h402a3d6

dask_gateway:
  dask_gateway_image:
    #name: ghcr.io/dask/dask-gateway-server
    name: [LOCAL_REPO]/ghcr.io/dask/dask-gateway-server
    tag: "2022.4.0"
  dask_controller_image:
    #name: ghcr.io/dask/dask-gateway-server
    name: [LOCAL_REPO]/ghcr.io/dask/dask-gateway-server
    tag: "2022.4.0"

forward_auth:
  traefik_forwardauth_image:
    #name: maxisme/traefik-forward-auth
    name: [LOCAL_REPO]/maxisme/traefik-forward-auth
    tag: "sha-a98e568"
```
