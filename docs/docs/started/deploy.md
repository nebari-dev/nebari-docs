---
id: deploy
---

# Deploying options

A guide to help deploying Nebari with best suited option.

Nebari can be deployed on a bare-metal server using HPC or on a Cloud provider. Review the options below to discover which option best suits your needs.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cloud" label="Cloud" default>

The Cloud deployment of Nebari is considered to be the default option. It enables teams to build and maintain a cost effective and scalable compute/data science platform in the Cloud, providing an [Infrastructure as Code](https://en.wikipedia.org/wiki/Infrastructure_as_code) platform that streamlines the deployment of data science infrastructure.

If you are not sure which option to choose, try this one. It is suitable for most use cases, especially if:

- You require scalable infrastructure

- You aim to have a production environment with GitOps enabled by default

The cloud installation is based on Kubernetes, but knowledge of Kubernetes is NOT required nor is in depth knowledge about the specific provider required either. QHub supports [Amazon AWS](https://docs.qhub.dev/en/latest/source/installation/setup.html#amazon-web-services-aws), [DigitalOcean](https://docs.qhub.dev/en/latest/source/installation/setup.html#digital-ocean), [Google GCP](https://docs.qhub.dev/en/latest/source/installation/setup.html#google-cloud-platform), and [Azure](https://docs.qhub.dev/en/latest/source/installation/setup.html#microsoft-azure).

</TabItem>
<TabItem value="hpc" label="HPC">

Nebari HPC is an opinionated open source deployment of jupyterhub based on an HPC jobscheduler. Nebari HPC is a "distribution" of these packages much like Debian and Ubuntu are distributions of Linux. The high level goal of this distribution is to form a cohesive set of tools that enable:

- environment management via conda and conda-store

- monitoring of compute infrastructure and services

- scalable and efficient compute via jupyterlab and dask

- deployment of jupyterhub on prem without requiring deep devops knowledge of the Slurm/HPC and jupyter ecosystem

The Nebari HPC should be your choice if:

- You have highly optimized code that require highly performant infrastructure

- You have existing infrastructure already available

- You expect that your infrastructure will not exceed the existing resources capabilities

For instructions on installing and deploying Nebari HPC, please visit [How to install and setup Nebari HPC on bare metal machines](/how-tos/nebari-hpc).

:::note
Although it is possible to deploy Nebari HPC on the Cloud, it is not generally recommended due to possible high costs. For more information, check out the base cost section of the docs.
:::


</TabItem>
<TabItem value="local" label="Local">

The local version is recommended for **testing and development** of Nebari’s components due to its simplicity. Choose the local mode if:

- You already have Kubernetes clusters
- You want to test these Kubernetes clusters
- You have available local compute setup
- You want to try out Nebari with a quick-install to see how it works, without setting up environment variables

You should choose another installation option if you are starting from scratch (i.e. no clusters yet) and aim to have a production environment.

For instructions on installing and deploying Nebari Local, please visit [How to install and setup Nebari on an existing Kubernetes infrastructure](/how-tos/nebari-local).

</TabItem>
</Tabs>
