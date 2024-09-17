
The security of AWS Nebari deployments can be enhanced through the following deployment configuration options:

- Explicit definition of container sources  
This option allows for the use of security-hardened or otherwise customized container images in place of the containers used by default.
Containers can be sourced from internally-hosted private repositories to further enhance security.
```
security:
  keycloak:
    overrides:
      image:
        # Keycloak image repository
        #repository: quay.io/keycloak/keycloak # default
        repository: example-change-me.dkr.ecr.us-gov-east-1.amazonaws.com/quay.io/keycloak/keycloak
        # Overrides the Keycloak image tag whose default is the chart version
        #tag: "15.0.2" # default
        tag: ""

      # This container is used at deploy-time to download keycloak-metrics-spi
      extraInitContainers: |
        - command:
          - sh
          - -c
          - | # --no-check-certificate is used below due to an in-line SSL content inspection re-encrypting the connection
            wget --no-check-certificate https://github.com/aerogear/keycloak-metrics-spi/releases/download/2.5.3/keycloak-metrics-spi-2.5.3.jar -P /data/ &&
            export SHA256SUM=9b3f52f842a66dadf5ff3cc3a729b8e49042d32f84510a5d73d41a2e39f29a96 &&
            if ! (echo "$SHA256SUM  /data/keycloak-metrics-spi-2.5.3.jar" | sha256sum -c)
              then
                echo "Error: Checksum not verified" && exit 1
              else
                chown 1000:1000 /data/keycloak-metrics-spi-2.5.3.jar &&
                chmod 777 /data/keycloak-metrics-spi-2.5.3.jar
            fi
          image: example-change-me.dkr.ecr.us-gov-east-1.amazonaws.com/alpine:latest
          name: initialize-spi-metrics-jar
          securityContext:
            runAsUser: 0
          volumeMounts:
            - name: metrics-plugin
              mountPath: /data

      pgchecker:
        image:
          # Docker image used to check Postgresql readiness at startup
          # repository: docker.io/busybox # default
          repository: example-change-me.dkr.ecr.us-gov-east-1.amazonaws.com/docker.io/busybox
          # Image tag for the pgchecker image
          tag: 1.32

      postgresql:
        ## https://github.com/bitnami/charts/blob/main/bitnami/postgresql/values.yaml
        image:
          #registry: docker.io # default
          registry: example-change-me.dkr.ecr.us-gov-east-1.amazonaws.com
          #repository: bitnami/postgresql
          repository: docker.io/bitnami/postgresql
          tag: 11.11.0-debian-10-r31
          digest: ""

default_images:
  #jupyterhub: quay.io/nebari/nebari-jupyterhub:2024.5.1 # default
  jupyterhub: example-change-me.dkr.ecr.us-gov-east-1.amazonaws.com/quay.io/nebari/nebari-jupyterhub:2024.5.1
  #jupyterlab: quay.io/nebari/nebari-jupyterlab:2024.5.1 # default
  jupyterlab: example-change-me.dkr.ecr.us-gov-east-1.amazonaws.com/quay.io/nebari/nebari-jupyterlab:2024.5.1
  #dask_worker: quay.io/nebari/nebari-dask-worker:2024.5.1 # default
  dask_worker: example-change-me.dkr.ecr.us-gov-east-1.amazonaws.com/quay.io/nebari/nebari-dask-worker:2024.5.1

cluster_autoscaler:
  ## https://staging.artifacthub.io/packages/helm/cluster-autoscaler/cluster-autoscaler/9.19.0
  overrides:
    image:
      #repository: k8s.gcr.io/autoscaling/cluster-autoscaler # default
      repository: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com/k8s.gcr.io/autoscaling/cluster-autoscaler
      # image.tag
      tag: v1.23.0

ingress:
    traefik-image:
      image: exampe-change-me.dkr.ecr.us-gov-east-1.amazonaws.com/traefik
      tag: 2.9.1

conda_store:
  image: example-change-me.dkr.ecr.us-gov-east-1.amazonaws.com/quansight/conda-store-server
  image_tag: 2024.3.1

conda_store:
  nfs_server_image: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com/gcr.io/google_containers/volume-nfs
  nfs_server_image_tag: "0.8"
  overrides:
    ## https://github.com/MetroStar/nebari/blob/eks-private-cluster-dev/src/_nebari/stages/kubernetes_services/template/modules/kubernetes/services/minio/values.yaml
    ## https://github.com/bitnami/charts/blob/main/bitnami/minio/values.yaml
    minio:
      image:
        #registry: docker.io
        registry: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com
        #repository: bitnami/minio
        repository: docker.io/bitnami/minio
        tag: 2021.4.22-debian-10-r0
    ## https://github.com/MetroStar/nebari/blob/eks-private-cluster-dev/src/_nebari/stages/kubernetes_services/template/modules/kubernetes/services/postgresql/values.yaml
    ## https://github.com/bitnami/charts/blob/master/bitnami/postgresql/values.yaml
    postgresql:
      image:
        #registry: docker.io
        registry: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com
        #repository: bitnami/postgresql
        repository: docker.io/bitnami/postgresql
        tag: 11.14.0-debian-10-r17
        digest: ""
    ## https://github.com/MetroStar/nebari/blob/eks-private-cluster-dev/src/_nebari/stages/kubernetes_services/template/modules/kubernetes/services/redis/values.yaml
    ## https://github.com/bitnami/charts/blob/master/bitnami/redis/values.yaml
    redis:
      image:
        #registry: docker.io
        registry: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com
        #repository: bitnami/redis
        repository: docker.io/bitnami/redis
        tag: 7.0.4-debian-11-r4
        digest: ""
argo_workflows:
  #enabled: true
  #https://github.com/MetroStar/nebari/blob/eks-private-cluster/src/_nebari/stages/kubernetes_services/template/modules/kubernetes/services/argo-workflows/values.yaml
  #https://github.com/argoproj/argo-helm/blob/argo-workflows-0.22.9/charts/argo-workflows/values.yaml
  overrides:
    controller:
      image:
        #registry: quay.io
        registry: exampe-change-me.dkr.ecr.us-gov-east-1.amazonaws.com
        #repository: argoproj/workflow-controller
        repository: quay.io/argoproj/workflow-controller
        # -- Image tag for the workflow controller. Defaults to `.Values.images.tag`.
        tag: ""
        #tag: "v3.4.4"
    server:
      image:
        #registry: quay.io
        registry: example-change-me.dkr.ecr.us-gov-east-1.amazonaws.com
        #repository: argoproj/argocli
        repository: quay.io/argoproj/argocli
        #tag: "v3.4.4"
        tag: ""
  nebari_workflow_controller:
    enabled: true
    image: example-change-me.dkr.ecr.us-gov-east-1.amazonaws.com/quay.io/nebari/nebari-workflow-controller
    image_tag: 2024.5.1
```

- Definition of an ssh key that can access EKS hosts.
EKS hosts by default cannot be accessed via ssh. This configuration item allows ssh access into EKS hosts, which could be useful for troubleshooting or external monitoring and auditing purposes.
```
amazon_web_services:
  ec2_keypair_name: example_keypair_name
```
  
- Installation of custom SSL certificate(s) into EKS hosts.
This can be used to install non-public SSL certificates used by (e.g.) in-line SSL content inspection engines to re-encrypt traffic.
```  
  extra_ssl_certificates: |
    -----BEGIN CERTIFICATE-----
    MIIF...<snip>...ABCD
    -----END CERTIFICATE-----
    -----BEGIN CERTIFICATE-----
    MIIF...<snip>...EF01
    -----END CERTIFICATE-----
```

- Private EKS endpoint configuration.
This mirrors the corresponding AWS console option, which routes all EKS traffic within the VPC.
```
  eks_endpoint_private_access: true
  eks_endpoint_public_access: false
```

- Deploy into existing subnets:
This configuration option instructs Nebari to be deployed into existing subnets, rather than creating its own subnets.
```
existing_subnet_ids:
    - subnet-0af78088e8661c36e
    - subnet-05123c80a59276d4c
  existing_security_group_id: sg-0ffadcc2aaa2a013a
ingress:
  terraform_overrides:
    # https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.8/guide/service/annotations/
    load-balancer-annotations:
      service.beta.kubernetes.io/aws-load-balancer-internal: "true"
      service.beta.kubernetes.io/aws-load-balancer-subnets: "subnet-0af78088e8661c36e,subnet-05123c80a59276d4c"
```

```
monitoring:
  enabled: true
  overrides:
    # https://github.com/MetroStar/nebari/blob/eks-private-cluster/src/_nebari/stages/kubernetes_services/template/modules/kubernetes/services/monitoring/values.yaml
    # https://github.com/prometheus-community/helm-charts/blob/main/charts/kube-prometheus-stack/values.yaml
    prometheus:
      ## Configuration for alertmanager
      ## ref: https://prometheus.io/docs/alerting/alertmanager/
      alertmanager:
        ## Settings affecting alertmanagerSpec
        ## ref: https://github.com/prometheus-operator/prometheus-operator/blob/main/Documentation/api.md#alertmanagerspec
        alertmanagerSpec:
          ## Image of Alertmanager
          image:
            #registry: quay.io
            #repository: prometheus/alertmanager
            registry: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com
            repository: quay.io/prometheus/alertmanager
            tag: v0.27.0
            sha: ""
      ## Using default values from https://github.com/grafana/helm-charts/blob/main/charts/grafana/values.yaml
      grafana:
        image:
          # -- The Docker registry
          #registry: docker.io
          registry: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com
          # -- Docker image repository
          #repository: grafana/grafana
          repository: docker.io/grafana/grafana
          # Overrides the Grafana image tag whose default is the chart appVersion
          tag: ""
          #tag: "10.4.1"
          sha: ""
          pullPolicy: IfNotPresent
        ## Sidecars that collect the configmaps with specified label and stores the included files them into the respective folders
        ## Requires at least Grafana 5 to work and can't be used together with parameters dashboardProviders, datasources and dashboards
        sidecar:
          image:
            # -- The Docker registry
            #registry: quay.io
            registry: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com
            #repository: kiwigrid/k8s-sidecar
            repository: quay.io/kiwigrid/k8s-sidecar
            tag: 1.26.1
            sha: ""
      ## Manages Prometheus and Alertmanager components
      prometheusOperator:
        enabled: true
        ## Prometheus-operator image
        image:
          #registry: quay.io
          #repository: prometheus-operator/prometheus-operator
          registry: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com
          repository: quay.io/prometheus-operator/prometheus-operator
          # if not set appVersion field from Chart.yaml is used
          tag: ""
          #tag: "v0.73.2"
          sha: ""
          pullPolicy: IfNotPresent
        ## Prometheus-config-reloader
        prometheusConfigReloader:
          image:
            #registry: quay.io
            #repository: prometheus-operator/prometheus-config-reloader
            registry: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com
            repository: quay.io/prometheus-operator/prometheus-config-reloader
            # if not set appVersion field from Chart.yaml is used
            #tag: "v0.73.2"
            tag: ""
            sha: ""
      ## Configuration for kube-state-metrics subchart
      ## https://github.com/prometheus-community/helm-charts/blob/main/charts/kube-state-metrics/values.yaml
      kube-state-metrics:
        image:
          #registry: registry.k8s.io
          registry: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com
          #repository: kube-state-metrics/kube-state-metrics
          repository: registry.k8s.io/kube-state-metrics/kube-state-metrics
          # If unset use v + .Charts.appVersion
          tag: ""
          #tag: "v2.12.0"
          sha: ""
          pullPolicy: IfNotPresent
      ## Configuration for prometheus-node-exporter subchart
      ## https://github.com/prometheus-community/helm-charts/blob/main/charts/prometheus-node-exporter/values.yaml
      prometheus-node-exporter:
        # Default values for prometheus-node-exporter.
        image:
          #registry: quay.io
          registry: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com
          #repository: prometheus/node-exporter
          repository: quay.io/prometheus/node-exporter
          # Overrides the image tag whose default is {{ printf "v%s" .Chart.AppVersion }}
          tag: ""
          #tag: "v1.8.0"
          pullPolicy: IfNotPresent
          digest: ""
      ## Deploy a Prometheus instance
      prometheus:
        enabled: true
        ## Settings affecting prometheusSpec
        ## ref: https://github.com/prometheus-operator/prometheus-operator/blob/main/Documentation/api.md#prometheusspec
        prometheusSpec:
          ## Image of Prometheus.
          image:
            #registry: quay.io
            #repository: prometheus/prometheus
            registry: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com
            repository: quay.io/prometheus/prometheus
            tag: v2.51.2
            #tag: v2.53.1
            sha: ""
    loki:
      loki:
        storage:
          type: s3
        commonConfig:
          replication_factor: 1
        # Not required as it is inside cluster and not exposed to the public network
        auth_enabled: false
        # The Compactor deduplicates index entries and also apply granular retention.
        compactor:
          # is the directory where marked chunks and temporary tables will be saved.
          working_directory: /var/loki/compactor/data/retention
          # minio s3
          shared_store: s3
          # how often compaction will happen
          compaction_interval: 1h
          # should delete old logs after retention delete delay
          # ideally we would want to do storage based retention, but this is not
          # currently implemented in loki, that's why we're doing time based retention.
          retention_enabled: true
          # is the delay after which the Compactor will delete marked chunks.
          retention_delete_delay: 1h
          # specifies the maximum quantity of goroutine workers instantiated to delete chunks.
          retention_delete_worker_count: 150
        limits_config:
          # The minimum retention period is 24h.
          # This is reasonable in most cases, but if people would like to retain logs for longer
          # then they can override this variable from nebari-config.yaml
          retention_period: 60d
        schema_config:
          configs:
            # list of period_configs
            # The date of the first day that index buckets should be created.
            - from: "2024-03-01"
              index:
                  period: 24h
                  prefix: loki_index_
              object_store: s3
              schema: v11
              store: boltdb-shipper
        storage_config:
          boltdb_shipper:
              # Directory where ingesters would write index files which would then be
              # uploaded by shipper to configured storage
              active_index_directory: /var/loki/compactor/data/index
              # Cache location for restoring index files from storage for queries
              cache_location: /var/loki/compactor/data/boltdb-cache
              # Shared store for keeping index files
              shared_store: s3
        image:
          # -- The Docker registry
          #registry: docker.io
          registry: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com
          # -- Docker image repository
          #repository: grafana/loki
          repository: docker.io/grafana/loki
          # -- Overrides the image tag whose default is the chart's appVersion
          # TODO: needed for 3rd target backend functionality
          # revert to null or latest once this behavior is relased
          tag: null
          #tag: "2.9.4"
          ## -- Overrides the image tag with an image digest
          #digest: null
      # Configuration for the write pod(s)
      write:
        # -- Number of replicas for the write
        # Keeping cost of running Nebari in mind
        # We don't need so many replicas, if people need it
        # they can always override from nebari-config.yaml
        replicas: 1
      read:
        # -- Number of replicas for the read
        replicas: 1
      backend:
        # -- Number of replicas for the backend
        replicas: 1
      minio:
        # We are deploying minio from bitnami chart separately
        enabled: false
      monitoring:
        selfMonitoring:
          grafanaAgent:
            installOperator: false
        lokiCanary:
          image:
            # -- The Docker registry
            #registry: docker.io
            registry: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com
            # -- Docker image repository
            #repository: grafana/loki-canary
            repository: docker.io/grafana/loki-canary
            # -- Overrides the image tag whose default is the chart's appVersion
            tag: null
            #tag: "2.9.4"
            ## -- Overrides the image tag with an image digest
            #digest: null
            ## -- Docker image pull policy
            #pullPolicy: IfNotPresent
      # Configuration for the gateway
      gateway:
        image:
          # -- The Docker registry for the gateway image
          #registry: docker.io
          registry: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com
          # -- The gateway image repository
          #repository: nginxinc/nginx-unprivileged
          repository: docker.io/nginxinc/nginx-unprivileged
          # -- The gateway image tag
          tag: 1.24-alpine
          ## -- Overrides the gateway image tag with an image digest
          #digest: null
          ## -- The gateway image pull policy
          #pullPolicy: IfNotPresent
      sidecar:
        image:
          # -- The Docker registry and image for the k8s sidecar
          #repository: kiwigrid/k8s-sidecar
          repository: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com/kiwigrid/k8s-sidecar
          # -- Docker image tag
          tag: 1.24.3
          ## -- Docker image sha. If empty, no sha will be used
          #sha: ""
          ## -- Docker image pull policy
          #pullPolicy: IfNotPresent
    # https://github.com/grafana/helm-charts/blob/3831194ba2abd2a0ca7a14ca00e578f8e9d2abc6/charts/promtail/values.yaml
    promtail:
      image:
        # -- The Docker registry
        #registry: docker.io
        registry: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com
        # -- Docker image repository
        #repository: grafana/promtail
        repository: docker.io/grafana/promtail
        # -- Overrides the image tag whose default is the chart's appVersion
        tag: null
        #tag: 2.9.3
        ## -- Docker image pull policy
        #pullPolicy: IfNotPresent
    # https://github.com/bitnami/charts/blob/440ec159c26e4ff0748b9e9866b345d98220c40a/bitnami/minio/values.yaml
    minio:
      image:
        #registry: docker.io
        registry: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com
        #repository: bitnami/minio
        repository: docker.io/bitnami/minio
        tag: 2021.4.22-debian-10-r0
        ### Specify a imagePullPolicy
        ### Defaults to 'Always' if image tag is 'latest', else set to 'IfNotPresent'
        ### ref: http://kubernetes.io/docs/user-guide/images/#pre-pulling-images
        ###
        #pullPolicy: IfNotPresent
        ### Optionally specify an array of imagePullSecrets.
        ### Secrets must be manually created in the namespace.
        ### ref: https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/
        ### e.g:
        ### pullSecrets:
        ###   - myRegistryKeySecretName
        ###
        #pullSecrets: []
        ### Set to true if you would like to see extra information on logs
        ###
        #debug: false
jupyterhub:
  #volume_mount_init_image: "busybox:1.31"
  volume_mount_init_image: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com/busybox:1.31
  # https://github.com/MetroStar/nebari/blob/eks-private-cluster/src/_nebari/stages/kubernetes_services/template/modules/kubernetes/services/jupyterhub/values.yaml
  # https://github.com/jupyterhub/zero-to-jupyterhub-k8s/blob/main/jupyterhub/values.yaml
  overrides:
    hub:
      db:
        type: sqlite-pvc
        pvc:
          storage: 1Gi
      baseUrl: "/"
      networkPolicy:
        ingress:
          - ports:
              - port: 10202
            from:
              - podSelector:
                  matchLabels:
                    hub.jupyter.org/network-access-hub: "true"
      service:
        extraPorts:
          - port: 10202
            targetPort: 10202
            name: jhub-apps
    proxy:
      secretToken: "<placeholder>"
      service:
        type: ClusterIP
      chp:
        image:
          #name: quay.io/jupyterhub/configurable-http-proxy
          name: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com/quay.io/jupyterhub/configurable-http-proxy
          #tag: 4.6.2 # https://github.com/jupyterhub/configurable-http-proxy/releases
          tag: 4.6.1
          #pullPolicy:
          #pullSecrets: []
        networkPolicy:
          egressAllowRules:
            cloudMetadataServer: false
            dnsPortsPrivateIPs: false
            nonPrivateIPs: false
            privateIPs: false
          egress:
            - ports:
              - port: 53
                protocol: UDP
              - port: 53
                protocol: TCP
              - port: 10202
                protocol: TCP
            - to:
              - ipBlock:
                  cidr: 0.0.0.0/0
    scheduling:
      userScheduler:
        enabled: true
        image:
          # IMPORTANT: Bumping the minor version of this binary should go hand in
          #            hand with an inspection of the user-scheduelrs RBAC resources
          #            that we have forked.
          #name: registry.k8s.io/kube-scheduler
          name: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com/registry.k8s.io/kube-scheduler
          #tag: "v1.28.11" # ref: https://github.com/kubernetes/website/blob/main/content/en/releases/patch-releases.md
          tag: "v1.28.10"
          #pullPolicy:
          #pullSecrets: []
      podPriority:
        enabled: true
      userPlaceholder:
        enabled: false
        replicas: 1
        #image:
        #  name: registry.k8s.io/pause
        #  # tag is automatically bumped to new patch versions by the
        #  # watch-dependencies.yaml workflow.
        #  # If you update this, also update prePuller.pause.image.tag
        #  tag: "3.10"
    imagePullSecrets:
      - extcrcreds
    singleuser:
      defaultUrl: "/lab"
      startTimeout: 600  # 10 minutes
      profileList: []
      storage:
        type: static
        extraVolumeMounts:
          - mountPath: "/home/shared"
            name: home
            subPath: "home/shared"
      networkTools:
        image:
          #name: quay.io/jupyterhub/k8s-network-tools
          name: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com/quay.io/jupyterhub/k8s-network-tools
          #tag: "set-by-chartpress"
          tag: 4.0.0-0.dev.git.6548.h9b2dfe22
      cpu:
        limit: 1
        guarantee: 1
      memory:
        limit: "1G"
        guarantee: "1G"
      networkPolicy:
        enabled: false
    # prePuller relates to the hook|continuous-image-puller DaemonsSets
    prePuller:
      pause:
        image:
          #name: registry.k8s.io/pause
          name: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com/registry.k8s.io/pause
          # tag is automatically bumped to new patch versions by the
          # watch-dependencies.yaml workflow.
          # If you update this, also update scheduling.userPlaceholder.image.tag
          tag: "3.10"
    # cull relates to the jupyterhub-idle-culler service, responsible for evicting
    # inactive singleuser pods.
    #
    # The configuration below, except for enabled, corresponds to command-line flags
    # for jupyterhub-idle-culler as documented here:
    # https://github.com/jupyterhub/jupyterhub-idle-culler#as-a-standalone-script
    #
    cull:
      enabled: true
      users: false
      removeNamedServers: false
      timeout: 1800
      every: 600
      concurrency: 10
      maxAge: 0
jupyterhub_ssh:
  jupyterhub_ssh_image:
    name: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com/quay.io/jupyterhub-ssh/ssh
    tag: 0.0.1-0.dev.git.136.ha610981
  jupyterhub_sftp_image:
    name: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com/quay.io/jupyterhub-ssh/sftp
    tag: 0.0.1-0.dev.git.142.h402a3d6
dask_gateway:
  dask_gateway_image:
    #name: ghcr.io/dask/dask-gateway-server
    name: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com/ghcr.io/dask/dask-gateway-server
    tag: "2022.4.0"
  dask_controller_image:
    #name: ghcr.io/dask/dask-gateway-server
    name: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com/ghcr.io/dask/dask-gateway-server
    tag: "2022.4.0"
forward_auth:
  traefik_forwardauth_image:
    #name: maxisme/traefik-forward-auth
    name: 096534317619.dkr.ecr.us-gov-east-1.amazonaws.com/maxisme/traefik-forward-auth
    tag: "sha-a98e568"
certificate:
  #type: existing
  #secret_name: nebari-custom-secret
  type: self-signed
```
