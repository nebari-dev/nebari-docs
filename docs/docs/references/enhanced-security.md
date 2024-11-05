## Nebari Security Considerations

The security of _AWS Nebari_ deployments can be enhanced through the following deployment configuration options in `nebari-config.yaml`:

- **Explicit definition of container sources**  
  This option allows for the use of locally mirrored, security-hardened, or otherwise customized container images in place of the containers used by default.
  See: [container-sources](container-sources.md)

- **Installation of custom SSL certificate(s) into EKS hosts**  
  Install private certificates used by (e.g.) in-line content inspection engines which re-encrypt traffic.

```
# Add client certificate to CA trust on node
amazon_web_services:
  node_groups:
    general:
      instance: m5.2xlarge
      launch_template:
        pre_bootstrap_command: |
            #!/bin/bash
            cat <<-EOT >> /etc/pki/ca-trust/source/anchors/client.pem
            -----BEGIN CERTIFICATE-----
            XzxzxzxzxxzxzxzxzxzxzxzxxzxzxzxzxzxzxzxxzxzxzxzxzxzxzxzxzxxzxzZx
            ZxyzxzxzxxzxzxzxzxzxzxzxxzxzxzxzxzxzxzxxzxzxzxzxzxzxzxzxzxxzxzXz
            -----END CERTIFICATE-----
            EOT
            sudo update-ca-trust extract
```

- **Private EKS endpoint configuration**  
  Mirrors the corresponding AWS console option, which routes all EKS traffic within the VPC.

```
  amazon_web_services:
    eks_endpoint_access: private # valid values: [public, private, public_and_private]
```

- **Deploy into existing subnets**  
  Instructs Nebari to be deployed into existing subnets, rather than creating its own new subnets.
  An advantage of deploying to existing subnets is the ability to use private subnets. Note that the **ingress load-balancer-annotation** must be set appropriately based on the type (private or public) of subnet.

```
existing_subnet_ids:
    - subnet-0123456789abcdef
    - subnet-abcdef0123456789
  existing_security_group_id: sg-0123456789abcdef
ingress:
  terraform_overrides:
    load-balancer-annotations:
      service.beta.kubernetes.io/aws-load-balancer-internal: "true"
      # Ensure the subnet IDs are also set below
      service.beta.kubernetes.io/aws-load-balancer-subnets: "subnet-0123456789abcdef,subnet-abcdef0123456789"
```

- **Use existing SSL certificate**  
  Instructs Nebari to use the SSL certificate specified by `[k8s-custom-secret-name]`

```
certificate:
  type: existing
  secret_name: [k8s-custom-secret-name]
```
