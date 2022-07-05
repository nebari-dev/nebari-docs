---
id: deploy
---

# Choosing a deployment platform


Nebari can be deployed on a bare-metal server using HPC, as well as on the major public cloud provider, or on a pre-existing Kubernetes cluster. Review the options below to determine which option best suits your needs.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="cloud" label="Cloud" default>

The cloud deployment of Nebari is considered to be the default option. It enables teams to build and maintain a cost-effective and scalable compute/data science platform in the cloud, by using an [Infrastructure as Code](https://en.wikipedia.org/wiki/Infrastructure_as_code) approach that streamlines the deployment and management of data science infrastructure.

If you are not sure which option to choose, a cloud installation is likely your best option. It is suitable for most use cases, especially if:

- You require scalable infrastructure

- You aim to have a production environment with [GitOps] enabled by default

- Your team does not have specific expertise within high-performance computing hardware, Kubernetes, Docker, and/or other cloud-native or scalable compute infrastructure technologies

The cloud installation is based on Kubernetes, but knowledge of Kubernetes is **NOT** required nor is in-depth knowledge about the specific provider required either. Currently, Nebari supports [Amazon AWS](/how-tos/nebari-aws.md), [DigitalOcean](/how-tos/nebari-do.md), [Google GCP](/how-tos/nebari-gcp.md), and [Azure](/how-tos/nebari-azure.md).


For instructions on installing and deploying Nebari on a particular cloud provider, visit our [cloud providers page](/getting-started/cloud-providers) for a list of the supported cloud providers and their respective installation how-to guides.

</TabItem>
<TabItem value="hpc" label="HPC">

Nebari HPC is an opinionated open source deployment of JupyterHub based on an HPC jobscheduler (e.g. Slurm). Nebari HPC is a "distribution" of these packages much like Debian and Ubuntu are distributions of Linux.

:::note
To note, Nebari HPC can be used on other distributed compute hardware, not just HPC hardware specifically. We anticipate that Nebari HPC will be used most often on HPC hardware, however.
:::

The high level goal of this distribution is to form a cohesive set of tools that enable:

- Environment management via [`conda`](https://docs.conda.io/en/latest/) and [`conda-store`](https://conda-store.readthedocs.io/en/latest/)

- Monitoring of compute infrastructure and services

- Scalable and efficient compute via Jupyterlab and Dask

- On-prem deployment of Jupyterhub without requiring deep DevOps knowledge of the Slurm/HPC and Jupyter ecosystems

Nebari HPC should be your choice if:

- You have highly optimized code that requires highly performant infrastructure

- You have existing HPC infrastructure

- You expect that your projects will not exceed the resources/capabilities of your current infrastructure

For instructions on installing and deploying Nebari HPC, visit the [How to install and setup Nebari HPC on bare metal machines](/how-tos/nebari-hpc) section of the documentation.

:::note
Although it is possible to deploy Nebari HPC in the cloud, it is not generally recommended due to potentially high costs. For more information, check out the [base cost] section of the docs.
:::


</TabItem>
<TabItem value="local" label="Pre-existing Kubernetes cluster">

The pre-exisitng (or local) version is recommended for **testing and development** of Nebari’s components due to its simplicity. Choose the local mode if:

- You already have a Kubernetes cluster [on one of the Nebari's supported cloud]providers(/started/cloud-providers)
- You want to test your Kubernetes cluster
- You have available local compute setup
- You want to try out Nebari with a quick install for exploratory purposes, without setting up environment variables

You should choose another installation option, likely a [cloud install](/getting-started/cloud-providers) if you are starting from scratch (you have no compute clusters already in place) and you desire to stand up a production instance of Nebari.

For instructions on installing and deploying Nebari Local, please visit [How to install and setup Nebari on an existing Kubernetes infrastructure](/how-tos/nebari-local).

</TabItem>
</Tabs>