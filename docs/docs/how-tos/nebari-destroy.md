---
id: nebari-destroy
title: Destroy your Nebari deployment
description: how to destroy your Nebari deployment and associated resources
---

## Introduction

This is a guide on how to destroy your Nebari cluster, this includes all resources created the first time you deployed it. With your `nebari-config.yaml` configuration file, you can use a handy `destroy` command to automatically destroy resources with Nebari.

You will need to export your cloud credentials, as you would for a `nebari deploy`, before you can destroy these cloud resources.

:::warning
When working with cloud resources, it's important to always double-check that everything has been fully destroyed.

Further below, we will also take a look at how you can manually destroy resources on individual cloud providers in case the automation fails.

The Nebari team takes no responsibility for any incurred cloud costs. Please take care!
:::

## Destroying Nebari

You can specify the `nebari-config.yaml` configuration file created while deploying Nebari to destroy the resources as well. Type the following command on your command line:

:::warning
If you have any data stored on your Nebari cluster you would like to keep - either files on the file system, `conda` environments in conda-store or an exported `json` of the users and groups from Keycloak - now is the time to back those up **off of the cluster**.
:::

```bash
nebari destroy -h
```

```bash
 Usage: nebari destroy [OPTIONS]

 Destroy the Nebari cluster from your nebari-config.yaml file.

╭─ Options ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ *  --config          -c      TEXT  qhub configuration file path [default: None] [required]                                │
│    --output          -o      TEXT  output directory [default: ./]                                                         │
│    --disable-render                Disable auto-rendering before destroy                                                  │
│    --disable-prompt                Destroy entire Nebari cluster without confirmation request. Suggested for CI use.      │
│    --help            -h            Show this message and exit.                                                            │
╰───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```

:::note
The above command will not delete your `nebar-config.yaml` or the rendered files thus a re-deployment with `nebari deploy` is possible afterwards.
:::

Once you've decided to destroy your cluster and have read through the `nebari destroy --help` command, you are you now ready.

```bash
nebari destroy -c nebari-config.yaml
```

The terminal will prompt you to press `enter` to verify that you wish to destroy your Nebari cluster.

:::info
This destruction process can take up to 30 minutes for some cloud providers.
:::

If the destruction is successful, you will see the following output:

```bash
[terraform]: Nebari properly destroyed all resources without error
```

Congratulations! You have successfully destroyed your Nebari deployment and the associated resources!

## Manually destroying the resources

### Amazon Web Services (AWS)

:::note
Destroying lingering resources on AWS can be tricky because the resources often need to be destroyed in a particular order.
:::

#### Destroy resources from the AWS console

Here, we outline how to find and destroy resources from the AWS console.

1. Sign in to your AWS account and in the search bar type `Tag Editor`

<img src="/img/how-tos/aws_tag_editor_1.png" alt="Search for Tag Editor in the AWS console" width="700"/>

2. From the `Resource Groups & Tag Editor` page, navigate to `Tag Editor` from the left most panel

<img src="/img/how-tos/aws_tag_editor_2.png" alt="Navigate to the Tag Editor in the AWS console" width="200"/>

3. Fill out the form as follows:
   - `Regions` - the region you deployed your Nebari cluster (or select `all regions`)
   - `Resource types` - select `All supported resource types`
   - `Tags`
     - select `Environment` for key (on the left)
     - enter the namespace you chose for your Nebari cluster (on the right)

<img src="/img/how-tos/aws_tag_editor_3.png" alt="Use the Tag Editor to filter for lingering Nebari resources" width="700"/>

4. From here you can filter further if needed by entering the name of your Nebari cluster.

5. At this point, select the resource you wish to destroy. This will open another tab for you to destroy that resource.

:::info
The details on how to destroy each specific resource is beyond the scope of this guide however here is a helpful tip if you get stuck in the messy web of AWS dependencies.

Try destroying resources like `EFS`, the `EC2 Load Balancer` or resources that might be connected to the `VPC` before deleting the `VPC` or any other network related resources.
:::

#### Destroy AWS resources using a dev tool script

This method of destroying lingering AWS resources requires cloning down the Nebari repo.

```bash
git clone https://github.com/Quansight/qhub.git
```

Once cloned, you can run a script which will attempt to destroy all lingering AWS resources.

```bash
python /path/to/qhub/scripts/aws-force-destroy.py -c /path/to/nebari-config.yaml
```

This will print to the terminal the resources it has destroyed. **This scripts often needs to be run multiple times before all the resources are fully destroyed.**

:::info
Even with this script, AWS on occasion will find itself in some resource dependency conflict, and you might need to destroy these resources manually from the AWS console as shown [in the corresponding section above](#destroy-resources-from-the-aws-console).
:::

### Azure

If you deployed your Nebari cluster on Azure and the `nebari destroy` command failed, you will need to destroy one resource: the resource group.

You will need [Azure's CLI `az`](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) installed and configured. Then run the following.

```bash
az group delete --resource-group "<project-name>-<namespace>"
```

Or if you'd prefer, you can destroy the resource group from the Azure portal, [follow these instructions](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal#delete-resource-groups).

### Google Cloud Platform (GCP)

If you deployed your Nebari cluster on GCP and the `nebari destroy` command failed, you will need to destroy two resources, the Kubernetes cluster (GKE) and cloud storage bucket (GCS).

You will need Google's [`gcloud`](https://cloud.google.com/sdk/gcloud) and [`gsutil`](https://cloud.google.com/storage/docs/gsutil).

To destroy the cloud storage bucket, run the following.

```bash
gsutil -m rm -r gs://<project-name>-<namespace>-terraform-state
```

And to destroy the Kubernetes cluster, run the following.

```bash
gcloud container clusters delete <project-name>-<namespace> --region <region>
```

If you wish to destroy the cloud storage bucket from the GCP console, [follow these instructions on Deleting buckets](https://cloud.google.com/storage/docs/deleting-buckets). And to destroy the Kubernetes cluster from the GCP console, [follow these instructions on Deleting a cluster](https://cloud.google.com/kubernetes-engine/docs/how-to/deleting-a-cluster#console).

:::info
When running the destroy command on a GCP, you might encounter a message that states:

```bash
ERROR:nebari.destroy:ERROR: not all Nebari stages were destroyed properly. For cloud deployments of QHub typically only stages 01 and 02 need to succeed to properly destroy everything
```

In general, this is not a problem. This happens because the destroy command thinks it needs to destroy resources that likely no longer exist. Double check from your GCP console to be sure all resources have indeed been destroyed.

:::
