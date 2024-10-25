## Nebari Security Considerations

The security of _AWS Nebari_ deployments can be enhanced through the following deployment configuration options in `nebari-config.yaml`:

- **Explicit definition of container sources**  
  This option allows for the use of locally mirrored, security-hardened, or otherwise customized container images in place of the containers used by default.
  See: [container-sources](container-sources.md)

- **Definition of an ssh key that can access EKS hosts**  
  EKS hosts by default cannot be accessed via ssh. This configuration item allows ssh access into EKS hosts, which can be useful for troubleshooting or external monitoring and auditing purposes.

```
amazon_web_services:
  ec2_keypair_name: [example_keypair_name] # Name, not ARN
```

- **Installation of custom SSL certificate(s) into EKS hosts**  
  Install private certificates used by (e.g.) in-line content inspection engines which re-encrypt traffic.

```
  extra_ssl_certificates: |
    -----BEGIN CERTIFICATE-----
    MIIF...<snip>...ABCD
    -----END CERTIFICATE-----
    -----BEGIN CERTIFICATE-----
    MIIF...<snip>...EF01
    -----END CERTIFICATE-----
```

- **Private EKS endpoint configuration**  
  Mirrors the corresponding AWS console option, which routes all EKS traffic within the VPC.

```
  eks_endpoint_private_access: true
  eks_endpoint_public_access: false
```

- **Deploy into existing subnets**  
  Instructs Nebari to be deployed into existing subnets, rather than creating its own new subnets.

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
