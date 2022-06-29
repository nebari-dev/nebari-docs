---
id: cost-estimate-report
title: Create a cost estimate report
---

## What is Infracost?

Infracost is a tool that enables developers to analyze their cloud cost estimates using their Terraform templates. Nebari wraps the `infracost` command-line interface, which is free and open-source, to provide cost estimates for your Nebari deployments across major cloud providers from your terminal.

This tutorial will generate a cost report for our Nebari deployment, which you can share with other users and groups via a simple Infracost link. We will also be looking into how Infracost can be configured on your local machine. 

Infracost supports Amazon Web Services, Azure, and Google Cloud Platform, and this tutorial will work regardless of the cloud provider. For this tutorial, we will be using the Google Cloud Platform (GCP) deployment to generate the cost report.

## Installing Infracost

To install `infracost` command-line interface, run the following command on your terminal:

```sh
curl -fsSL https://raw.githubusercontent.com/infracost/infracost/master/scripts/install.sh | sh
```

The script downloads the the CLI based on your operating-system/architecture and puts it in `/usr/local/bin`. If you are using a package manager like Homebrew, you can install `infracost` by running:

```sh
brew install infracost
```

After installation, you can run `infracost` locally via the following command:

```sh
infracost --version
```

You can next configure the API key for Infracost to enable generating cost reports and dashboards. To do that, run the following command on your terminal:

```sh
infracost register
```

Nebari's cost estimate feature requires an API key to be configured before running the tool. If you have configured an API key, run the following command to validate your API key:

```sh
infracost configure get api_key
```

We are now ready to run the cost estimate tool.

## Setup initialization

The next step requires us to choose a Cloud Provider to host the project deployment. In this tutorial, we will be using the Google Cloud Platform (GCP). The cloud installation is based on Kubernetes and will be using Terraform to initialize the cloud infrastructure. However, you can follow along to generate the cost report without actually deploying anything.

Follow [these detailed instructions](https://cloud.google.com/iam/docs/creating-managing-service-accounts) to create a Google Service Account with owner-level permissions. After completing the previous step, create and download a JSON credentials file. Store this credentials file in a well-known location and set yourself exclusive permissions.

You can change the file permissions by running the command `chmod 600 <filename>` on your terminal. In this case the environment variables will be such as follows:

```sh
export GOOGLE_CREDENTIALS="path/to/JSON/file/with/credentials"
export PROJECT_ID="projectIDName"
```

The `PROJECT_ID` will be available on the Google Console homepage, under `Project info`.

Create a new directory named `nebari-gcp-deployment` to generate your Nebari deployment configuration:

```sh
mkdir nebari-gcp-deployment
cd nebari-gcp-deployment
```

Install Nebari using `conda`/`pip` by pushing the following command on your terminal:

```sh
pip install nebari
```

```sh
conda install -c conda-forge nebari
```

To generate a fully-automated configuration file, run the following command on your terminal:

```sh
nebari init gcp \
  --project projectname --domain mysite.com \
  --ci-provider github-actions \
  --terraform-state=remote \
  --auth-provider github --disable-prompt
```

Finally, with the `nebari-config.yaml` created, Nebari can be deployed:

```sh
nebari deploy -c nebari-config.yaml
```

It will generate the following directory structure:

```sh
.
├── image
│   ├── Dockerfile.dask-worker
│   ├── Dockerfile.jupyterhub
│   ├── Dockerfile.jupyterlab
│   ├── README.md
│   ├── dask-worker
│   ├── docker-bake.json
│   ├── jupyterhub
│   ├── jupyterlab
│   └── scripts
├── nebari-config.yaml
└── stages
    ├── 02-infrastructure
    ├── 03-kubernetes-initialize
    ├── 04-kubernetes-ingress
    ├── 05-kubernetes-keycloak
    ├── 06-kubernetes-keycloak-configuration
    ├── 07-kubernetes-services
    └── 08-nebari-tf-extensions
```

We can now move ahead to generate the cost estimate.

## Generating cost estimate

To generate the cost estimate we will use the following command:

```sh
nebari cost-estimate
```

The `nebari cost-estimate` will look for the `stages` directory and analyze the Terraform templates to generate a cost report. It will consist of two tables describing the cost and resources breakdown, a publicly-accessible Infracost dashboard URL and additional documentation on the edge cases that the cost estimate tool currently misses.

It will be visible in the following manner:

```sh
         Cost Breakdown          
┏━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┓
┃               Name ┃ Cost ($) ┃
┡━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━┩
│ Total Monthly Cost │       XX │
│  Total Hourly Cost │       XX │
└────────────────────┴──────────┘
           Resource Breakdown           
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━┓
┃                         Name ┃ Number ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━┩
│         Total Detected Costs │      X │
│    Total Supported Resources │      X │
│ Total Un-Supported Resources │      X │
│   Total Non-Priced Resources │      X │
│ Total Usage-Priced Resources │      X │
└──────────────────────────────┴────────┘
Access the dashboard here: 
https://dashboard.infracost.io/share/XXXXXXXXXX

QHub rely upon node-pools which is a usage resource but doesn't get captured in 
the above report. A general node-pool will always have one node running will add
quite an additional charge. Please check in with your cloud provider to see the 
associated costs with node pools.                                               

 • Total Monthly Cost: The total monthly cost of the deployment of supported    
   resources.                                                                   
 • Total Hourly Cost: The total hourly cost of the deployment of supported      
   resources.                                                                   
 • Total Detected Costs: The total number of resources detected by Infracost.   
 • Total Supported Resources: The total number of resources supported by        
   Infracost.                                                                   
 • Total Un-Supported Resources: The total number of resources unsupported by   
   Infracost.                                            
 • Total Non-Priced Resources: The total number of resources that are not       
   priced.                                               
 • Total Usage-Priced Resources: The total number of resources that are priced  
   based on usage.                                                              
```

You can share the URL of your Infracost dashboard `https://dashboard.infracost.io/share/XXXXXXXXXX
` across your team for better insights into your cloud costs breakdown.

If your `stages` subdirectory is not present, you would need to share the path of your `stages` directory with the `--path` option.

```
nebari cost-estimate --path=path/to/stages
```

## Notes

The cost estimate report is statically analyzed via Terraform templates stored in the `stages` sub-directory, and the actual cloud costs are subject to change. Nebari relies upon node-pools, a useful resource that doesn't get captured in the above report. A general node-pool will always have one node running, adding quite an additional charge. 

For example, using an `m5.2xlarge` instance type on AWS for the general node-pool (currently the default) will cost $276.84 additional per month. Please check in with your cloud provider to see the associated costs with node pools.

Apart from this, currently, the dashboards are enabled by default for users. It is enabled using Infracost's `INFRACOST_ENABLE_DASHBOARD` environment variable, which is set `true` by default. In the future, we will allow users to disable it using Nebari's command-line interface.
