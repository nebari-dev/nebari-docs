---
id: manual-backup
title: Create a manual backup
description: Perform a manual backup of a Nebari instance
---

# Manual backups

Your cloud provider may have native ways to back up your Kubernetes cluster and volumes.

This guide describes how you would manually obtain the data you need to repopulate your Nebari instance if your cluster is lost, and you wish to start it up again from the `nebari-config.yaml`
file.

There are three main locations that you need to back up:

1. The Network File System (NFS) volume where all JupyterLab workspace files are stored
2. The JupyterHub database (for Dashboard configuration)
3. The Keycloak user/group database

## Network file system

This amounts to:

- Tarballing the /home directory
- Saving to object storage \[s3, google cloud storage, etc\]
- Downloading and untaring to new cluster

This specific guide shows how to do this on an AWS cluster and upload to AWS S3.

### Pre-requisites

- [Install kubectl and update your kubeconfig](/docs/how-tos/debug-nebari#getting-started-with-kubectl)
- [Install AWS command-line tool](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)

### Pod deployment

With `kubectl` configured, the next step will be to deploy the pod that allows you to access the cluster files. First, save the following pod specification to a file named
`pod.yaml`:

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: volume-debugger-ubuntu
  namespace: dev
spec:
  volumes:
    - name: volume-to-debug-ubuntu
      persistentVolumeClaim:
        claimName: "jupyterhub-dev-share"
  containers:
    - name: debugger
      image: ubuntu
      command: ["sleep", "36000"]
      volumeMounts:
        - mountPath: "/data"
          name: volume-to-debug-ubuntu
```

> Note in QHub versions before v0.4 replace `claimName: "jupyterhub-dev-share"` with `claimName: "nfs-mount-dev-share"` above.

Once the file `pod.yml` has been created, run the following command:

```shell
kubectl apply -f pod.yaml -n dev
```

If you have a namespace other than the default dev, replace `dev` with your namespace when running `kubectl`. To get a shell to this running pod, run:

```shell
kubectl exec -n dev --stdin --tty volume-debugger-ubuntu -- /bin/bash
```

Again replacing the `dev` namespace as needed.

### Installations

You must install several `apt` packages, as the pod spun up is a basic pod. Use the following command:

```shell
apt update
apt install curl -y
apt install unzip -y
```

For AWS, you need to install the CLI (see CLI instructions for Google and Azure below):

```shell
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install
aws configure
```

The last line in the command above prompts for your AWS public/private key and default region. Paste each of these and press enter. To ignore and skip the output, press enter.

### Backups

To back up the file system, run:

```shell
cd /data
tar -cvf <custom_name>.tar .
```

The preferred naming scheme includes a year-month-day, example `2021-04-23_home_backup.tar`. You can utilize multi-backups through this step. This step takes several minutes
depending on the size of the home directories.

### Upload to object storage

Once this is complete, upload the tar file to S3 using the AWS command-line tool:

```shell
aws s3 cp 2021-04-23.tar s3://<your_bucket_name>/backups/2021-04-23.tar
```

Replacing `your_bucket_name` with a bucket you have created. If you don't have an existing bucket, check out the [instructions for creating a new bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html)

### Download from object storage and decompress

Now that the data backed up, perform the same steps preceding for the new cluster. This includes:

- Configuring kubectl for the new cluster.
- Creating a pod on the new cluster and getting shell access into it.
- Installing the apt packages.
- Configuring AWS.

Once AWS gets configured on the new pod, you can then download the backup with:

```shell
cd /data
aws s3 cp s3://<your_bucket_name>/backups/2021-04-23.tar .
```

The last step is to extract the contents of the tarball:

```shell
cd /data
tar -xvf 2021-04-23.tar
```

The file permissions for the default tar is same as the original files.

> **Important: If upgrading from 0.3.14 or earlier to 0.4 or later**
>
> QHub v0.4: If restoring your NFS as part of the upgrade you must also run some extra commands, immediately after extracting from the tar file.
>
> Previous versions contained the `shared` folder within `home`. From `0.4.0` both `shared` and `home` directories are at the same level with respect to the QHub filesystem:
>
> ```shell
> cd /data
> cp -r home/shared/* shared/
> rm -rf home/shared/
> ```
>
> And then:
>
> ```shell
> chown -R 1000:100 /data/home/*
> chown -R 1000:100 /data/shared/*
> ```
>
> From QHUb v0.4. all users will have the same `uid`.

### Google Cloud

To do a backup on Google Cloud provider, install the [gsutil](https://cloud.google.com/storage/docs/gsutil_install) CLI instead of the AWS CLI. Otherwise, the instructions are the same as
for AWS above, other than when working with S3. Here are the commands to access Google Spaces instead of S3 for copy/download of the backup:

```shell
cd /data
gsutil cp 2021-04-23.tar gs://<your_bucket_name>/backups/2021-04-23.tar

cd /data
gsutil cp gs://<your_bucket_name>/backups/2021-04-23.tar .
```

### Azure

To do a backup on Azure, first install [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-linux?pivots=script#install-or-update-azure-cli) and [azcopy](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azcopy-v10?tabs=dnf#obtain-a-static-download-link). You must also have setup a storage container with blob storage. Otherwise, the instructions are the same as for AWS above, other than when working with S3. Here are the commands to access Azure blob storage instead of S3 for copy/download of the backup.

#### Do the backup

```bash
az login # --use-device-code if web browser not available

cd /data
# Tell AZCOPY to use same auth as CLI
export AZCOPY_AUTO_LOGIN_TYPE=AZCLI
# copy the tar backup file to blob storage
azcopy copy 2021-04-23.tar "https://[account].blob.core.windows.net/[container]/nebari-backups/2021-04-23.tar"
```

#### Do the restore

```bash
az login # --use-device-code if web browser not available

cd /data
# Tell AZCOPY to use same auth as CLI
export AZCOPY_AUTO_LOGIN_TYPE=AZCLI
# restore the backup file from blob storage
azcopy copy "https://[account].blob.core.windows.net/[container]/nebari-backups/2021-04-23.tar" "./2021-04-23.tar"
```

## JupyterHub Database

The JupyterHub database will mostly be recreated whenever you start a new cluster, but should be backed up to save Dashboard configurations.

You want to do something very similar to the NFS backup, above - this time you need to back up one file located in the `PersistentVolume` `hub-db-dir`.

First, you might think you can make a new `pod.yaml` file, this time specifying `claimName: "hub-db-dir"` instead of
`claimName: "jupyterhub-dev-share"`. However, `hub-db-dir`
is 'Read Write Once' - the 'Once' meaning it can only be mounted to one pod at a time
but the JupyterHub pod will already have this mounted! So the same approach will not work here.

Instead of mounting to a new 'debugger pod' you have to access the JupyterHub pod directly using the `kubectl` CLI.

Look up the JupyterHub pod:

```bash
kubectl get pods -n dev
```

It will be something like `hub-765c9488d6-8z4nj`.

Get a shell into that pod:

```bash
kubectl exec -n dev --stdin --tty hub-765c9488d6-8z4nj -- /bin/bash
```

There is no need to TAR anything up since the only file required to be backed up is `/srv/jupyterhub/jupyterhub.sqlite`.

### Backing up JupyterHub DB

Now you need to upload the file to S3. You might want to [install the AWS CLI tool](#installations) as we did before, however, as the Hub container is a rather restricted
environment the recommended approach is to upload files to AWS S3 buckets using curl.

For more details please refer to the [using curl to access AWS S3 buckets] documentation.

### Restoring JupyterHub DB

You will need to overwrite the file `/srv/jupyterhub/jupyterhub.sqlite` based on the version backed up to S3.

You should restart the pod:

```bash
kubectl delete -n dev pod hub-765c9488d6-8z4nj
```

As for uploads, [you may need to use curl to download items from an AWS S3 bucket]

## Keycloak user/group database

Nebari provides a script to export the important user/group database. Your new Nebari cluster will recreate a lot of Keycloak config (including new Keycloak clients which will
have new secrets), so only the high-level Group and User info is exported.

If you have a heavily customized Keycloak configuration, some details may be omitted in this export.

### Export Keycloak

The export script is at [`nebari/scripts/keycloak-export.py`](https://github.com/nebari-dev/nebari/blob/main/scripts/keycloak-export.py).

Locate your `nebari-config.yaml` file, for example by checking out of your Git repo for you Nebari. Activate a virtual environment with the `nebari` Python package installed.

This assumes that the password visible in the `nebari-config.yaml` file under the `security.keycloak.initial_root_password` field is still valid for the root user.

If not, first set the `KEYCLOAK_ADMIN_PASSWORD` environment variable to the new value.

Run the following to create the export file:

```shell
python nebari/scripts/keycloak-export.py -c nebari-config.yaml > exported-keycloak.json
```

You may wish to upload the Keycloak export to the same S3 location where you uploaded the TAR file in the NFS section.

### Import Keycloak

To re-import your users and groups, [login to the /auth/ URL] using the root username and password.

Under 'Manage' on the left-hand side, click 'Import'. Locate the `exported-keycloak.json` file and select it. Then click the 'Import' button.

All users and groups should now be present in Keycloak. Note that the passwords will not have been restored, so you may need to be reset them after this step.
