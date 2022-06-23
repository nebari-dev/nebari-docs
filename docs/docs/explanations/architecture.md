# Nebari architecture and conceptual guide

## Source Code

At a high level Nebari has several operations:

1. [nebari/initialize.py](https://github.com/Quansight/qhub/blob/main/qhub/initialize.py) `initialize` the yaml configuration
2. [nebari/render.py](https://github.com/Quansight/qhub/blob/main/qhub/render.py) `render` the files from the given YAML configuration
3. [nebari/deploy.py](https://github.com/Quansight/qhub/blob/main/qhub/deploy.py) `deploy` infrastructure and kubernetes resources via [Terraform](https://www.terraform.io/)
4. [nebari/destroy.py](https://github.com/Quansight/qhub/blob/main/qhub/destroy.py) `destroy` infrastructure and kubernetes resources via [Terraform](https://www.terraform.io/)

## Infrastructure

### Digital Ocean (DO)

### Amazon Web Services (AWS)

### Google Cloud Platform (GCP)

### Azure

### Kubernetes

