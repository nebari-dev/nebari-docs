---
id: cost-estimate-report
title: Create a cost estimate report
description: A guide to Nebari's cost estimate tool
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## What is Infracost?

[Infracost](https://www.infracost.io/) is a tool that enables developers to analyze their cloud cost estimates using their Terraform templates. Nebari wraps the `infracost` command-line interface, which is free and open-source, to provide cost estimates for your Nebari deployments across major cloud providers.

This tutorial will generate a cost report for our Nebari deployment, which you can share with other users and groups via a simple Infracost link. We will also be looking into how Infracost can be configured on your local machine. 

Infracost natively supports Amazon Web Services, Azure, and Google Cloud Platform. For this tutorial, we will be using the Google Cloud Platform (GCP) deployment to generate the cost report.

## Installing Infracost


To install the `infracost` command-line interface, run the following command on your terminal:

```sh
curl -fsSL https://raw.githubusercontent.com/infracost/infracost/master/scripts/install.sh | sh
```

The script downloads the the CLI based on your operating-system/architecture and puts it in `/usr/local/bin`.

After installation, you can run `infracost` locally via the following command:

```sh
infracost --version
```

Next, you'll need to configure the API key for Infracost to enable generating cost reports and dashboards. Nebari's cost estimate feature requires this API key. To generate the key, run the following command on your terminal:

```sh
infracost register
```

Now you can run the following command to validate your API key:

```sh
infracost configure get api_key
```

You are now ready to run the cost estimate tool.

## Generating the cost estimates

To generate the cost estimate, run the following command:

```sh
nebari cost-estimate
```

The Nebari cost estimate tool will look for the `stages` directory within your deployment file structure and analyze the Terraform templates to generate a cost report. It will consist of two tables describing the cost and resources breakdown, a publicly-accessible Infracost dashboard URL and additional documentation on the edge cases that the cost estimate tool currently misses.

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

Nebari relies upon node pools which is a usage resource that doesn't get captured in 
the above report. A general node pool will always have one node running will add
an additional charge. Please check with your cloud provider to see the 
associated costs with node pools.                                               

 • Total Monthly Cost: The total monthly cost of the deployment of supported    
   resources.                                                                   
 • Total Hourly Cost: The total hourly cost of the deployment of supported      
   resources.                                                                   
 • Total Detected Costs: The total number of resources detected by Infracost.   
 • Total Supported Resources: The total number of resources supported by        
   Infracost.                                                                   
 • Total Unsupported Resources: The total number of resources unsupported by  
   Infracost.                                            
 • Total Non-Priced Resources: The total number of resources that are not       
   priced.                                               
 • Total Usage-Priced Resources: The total number of resources that are priced  
   based on usage.                                                              
```

You can share the URL of your Infracost dashboard `https://dashboard.infracost.io/share/XXXXXXXXXX`
across your team for better insights into your cloud costs breakdown.

> The Infracost dashboards are enabled by default for users. This is done via the Infracost's `INFRACOST_ENABLE_DASHBOARD` environment variable, which is set `true` by default.

You can run the Nebari cost estimate tool outside of your Nebari directory by specifying the location of your deployment's stages directory.

```sh
nebari cost-estimate --path=path/to/stages
```

## More on node pools

The cost estimate report is statically analyzed via Terraform templates stored in the `stages` subdirectory, and the actual cloud costs are subject to change. Nebari relies upon node pools, a useful resource that doesn't get captured in the above report. A general node pool will always have one node running, adding an additional charge.

For example, using an `m5.2xlarge` instance type on AWS for the general node pool (currently the default) will cost $276.84 additional per month. Please check with your cloud provider to see the associated costs with node pools.
