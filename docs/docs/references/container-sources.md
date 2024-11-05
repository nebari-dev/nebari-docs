## Deploying and Running Nebari from a Private Container Repository

Nebari deploys and runs FOSS components as containers running in Kubernetes.
By default, Nebari sources each container from the container's respective public repository, typically `docker.io` or `quay.io`.
This introduces supply-chain concerns for security-focused customers.

One solution to these supply-chain concerns is to deploy Nebari from private locally-mirrored containers:

- Create a controlled private container repository (e.g. ECR)
- Mirror all containers used by Nebari into this private container repository
- Use the `pre_bootstrap_command` mechanism in `nebari-config.yaml` to specify the mirrored container repo

Deploying Nebari in this fashion eliminates significant supply chain surface-area, but requires identifying all containers used by Nebari.

The following configurations demonstrate how to specify a private repo denoted by the string `[PRIVATE_REPO]`.

**Note:** Authorization tokens are used in the examples below. It is important for administrators to understand the expiration policy of these tokens, because the Nebari k8s cluster may in some cases need to **use these tokens to pull container images at any time during run-time operation**.

### Set ECR as default container registry mirror

```
amazon_web_services:
  node_groups:
    general:
      instance: m5.2xlarge
      launch_template:
        pre_bootstrap_command: |
            #!/bin/bash
            # Verify that IP forwarding is enabled for worker nodes, as is required for containerd
            if [[ $(sysctl net.ipv4.ip_forward | grep "net.ipv4.ip_forward = 1") ]]; then echo "net.ipv4.ip_forward is on"; else sysctl -w net.ipv4.ip_forward=1; fi
            # Set ECR as default container registry mirror
            mkdir -p /etc/containerd/certs.d/_default
            ECR_TOKEN="$(aws ecr get-login-password --region us-east-1)"
            BASIC_AUTH="$(echo -n "AWS:$ECR_TOKEN" | base64 -w 0)"
            cat <<-EOT > /etc/containerd/certs.d/_default/hosts.toml
            [host."https://[PRIVATE_REPO].dkr.ecr.us-east-1.amazonaws.com"]
              capabilities = ["pull", "resolve"]
              [host."https://[PRIVATE_REPO].dkr.ecr.us-east-1.amazonaws.com".header]
                authorization = "Basic $BASIC_AUTH"
            EOT

```

### Set GitLab CR as default container registry mirror

```
# Set GitLab CR as default container registry mirror in hosts.toml;
# must have override_path set if project/group names don't match upstream container
amazon_web_services:
  node_groups:
    general:
      instance: m5.2xlarge
      launch_template:
        pre_bootstrap_command: |
            #!/bin/bash
            # Verify that IP forwarding is enabled for worker nodes, as is required for containerd
            if [[ $(sysctl net.ipv4.ip_forward | grep "net.ipv4.ip_forward = 1") ]]; then echo "net.ipv4.ip_forward is on"; else sysctl -w net.ipv4.ip_forward=1; fi
            # Set default container registry mirror in hosts.toml; must have override_path set if project/group names don't match upstream container
            CONTAINER_REGISTRY_URL="[PRIVATE_REPO]"
            CONTAINER_REGISTRY_USERNAME="[username]"
            CONTAINER_REGISTRY_TOKEN="[token]"
            CONTAINER_REGISTRY_GROUP=as-nebari
            CONTAINER_REGISTRY_PROJECT=nebari-test
            mkdir -p /etc/containerd/certs.d/_default
            cat <<-EOT > /etc/containerd/certs.d/_default/hosts.toml
            [host."https://$CONTAINER_REGISTRY_URL/v2/$CONTAINER_REGISTRY_GROUP/$CONTAINER_REGISTRY_PROJECT"]
              override_path = true
              capabilities = ["pull", "resolve"]
            EOT

            # Set containerd registry config auth in config.d .toml import dir
            mkdir -p /etc/containerd/config.d
            cat <<EOT | sudo tee /etc/containerd/config.d/config-import.toml
            version = 2
            [plugins."io.containerd.grpc.v1.cri".registry]
              config_path = "/etc/containerd/certs.d:/etc/docker/certs.d"
              [plugins."io.containerd.grpc.v1.cri".registry.auths]
              [plugins."io.containerd.grpc.v1.cri".registry.configs]
                [plugins."io.containerd.grpc.v1.cri".registry.configs."$CONTAINER_REGISTRY_URL".auth]
                  username = "$CONTAINER_REGISTRY_USERNAME"
                  password = "$CONTAINER_REGISTRY_TOKEN"
            EOT
```

### Set GitLab CR as default container registry mirror, with custom Client SSL/TLS Certs

```
# must have override_path set if project/group names don't match upstream container
# Also add/set GitLab Client SSL/TLS Certificate for Containerd
amazon_web_services:
  node_groups:
    general:
      instance: m5.2xlarge
      launch_template:
        pre_bootstrap_command: |
            #!/bin/bash
            # Verify that IP forwarding is enabled for worker nodes, as is required for containerd
            if [[ $(sysctl net.ipv4.ip_forward | grep "net.ipv4.ip_forward = 1") ]]; then echo "net.ipv4.ip_forward is on"; else sysctl -w net.ipv4.ip_forward=1; fi
            # Set default container registry mirror in hosts.toml; must have override_path set if project/group names don't match upstream container
            CONTAINER_REGISTRY_URL="[PRIVATE_REPO]"
            CONTAINER_REGISTRY_USERNAME="[username]"
            CONTAINER_REGISTRY_TOKEN="[token]"
            CONTAINER_REGISTRY_GROUP=as-nebari
            CONTAINER_REGISTRY_PROJECT=nebari-test
            mkdir -p /etc/containerd/certs.d/_default
            cat <<-EOT > /etc/containerd/certs.d/_default/hosts.toml
            [host."https://$CONTAINER_REGISTRY_URL/v2/$CONTAINER_REGISTRY_GROUP/$CONTAINER_REGISTRY_PROJECT"]
              override_path = true
              capabilities = ["pull", "resolve"]
              client = ["/etc/containerd/certs.d/$CONTAINER_REGISTRY_URL/client.pem"]
            EOT

            # Set containerd registry config auth in config.d .toml import dir
            mkdir -p /etc/containerd/config.d
            cat <<EOT | sudo tee /etc/containerd/config.d/config-import.toml
            version = 2
            [plugins."io.containerd.grpc.v1.cri".registry]
              config_path = "/etc/containerd/certs.d:/etc/docker/certs.d"
              [plugins."io.containerd.grpc.v1.cri".registry.auths]
              [plugins."io.containerd.grpc.v1.cri".registry.configs]
                [plugins."io.containerd.grpc.v1.cri".registry.configs."$CONTAINER_REGISTRY_URL".auth]
                  username = "$CONTAINER_REGISTRY_USERNAME"
                  password = "$CONTAINER_REGISTRY_TOKEN"
            EOT

            # Add client key/cert to containerd
            mkdir -p /etc/containerd/certs.d/$CONTAINER_REGISTRY_URL
            cat <<-EOT >> /etc/containerd/certs.d/$CONTAINER_REGISTRY_URL/client.pem
            -----BEGIN CERTIFICATE-----
            XzxzxzxzxxzxzxzxzxzxzxzxxzxzxzxzxzxzxzxxzxzxzxzxzxzxzxzxzxxzxzZx
            ZxyzxzxzxxzxzxzxzxzxzxzxxzxzxzxzxzxzxzxxzxzxzxzxzxzxzxzxzxxzxzXz
            -----END CERTIFICATE-----
            -----BEGIN PRIVATE KEY-----
            XzxzxzxzxxzxzxzxzxzxzxzxxzxzxzxzxzxzxzxxzxzxzxzxzxzxzxzxzxxzxzZx
            ZxyzxzxzxxzxzxzxzxzxzxzxxzxzxzxzxzxzxzxxzxzxzxzxzxzxzxzxzxxzxzXz
            -----END PRIVATE KEY-----
            EOT
```
