---
id: nebari-upgrade
title: Upgrade Nebari
description: An overview of how to upgrade Nebari. Includes instructions on updating when breaking changes are expected to occur.
---

# Upgrading Nebari

:::note
This is a guide to upgrade Nebari to a newer version. If you are migrating from QHub (deprecated) to Nebari, you can find instructions [here](#migrating-from-qhub-deprecated-to-nebari). If you are updating from an older version of QHub to another version of QHub, those instructions are [here](#upgrade-qhub-from-pre-040-to-another-qhub-version).
:::

## Upgrade Nebari

### Backup existing data

Perform manual backups of the NFS data and JupyterHub database.

It is strongly recommended you [backup your data](./manual-backup.md) before upgrading!

### Install latest version of Nebari

Use pip or conda to install the latest Nebari version.

```shell
pip install --upgrade nebari
```

or

```shell
conda update nebari
```

### Nebari upgrade command

Run the following to upgrade Nebari.

```shell
nebari upgrade -c nebari-config.yaml
```

The upgrade command may print some manual instructions that need to be run before continuing with the upgrade. If so, complete those instructions before continuing on.

:::info
New versions of Nebari often include support for newer versions of Kubernetes, as such you might need to upgrade your cluster's Kubernetes version. Please refer to [Upgrade Kubernetes version docs](./upgrade-kubernetes-version.md) for more details.
:::

### Re-deploy Nebari

If you are deploying Nebari from your local machine (see [this section](#cicd-render-and-commit-to-git) for CI/CD deployments), you will now have a `nebari-config.yaml` file that you can deploy.

```shell
nebari deploy -c nebari-config.yaml
```

### CI/CD: render and commit to git

For CI/CD (GitHub/GitLab) workflows, you will need to regenerate the workflow files based on the latest `Nebari` version's templates.

With the newly upgraded `nebari-config.yaml` file, run:

```shell
nebari render -c nebari-config.yaml
```

(Note that `nebari deploy` would perform this render step too, but will also immediately redeploy your Nebari.)

Commit all the files (`nebari-config.yaml` and GitHub/GitLab workflow files) back to the remote repo. All files need to be committed together in the same commit.

## Migrating from QHub (deprecated) to Nebari

:::note
If you are migrating your package from QHub to Nebari there are a couple steps in the upgrade process to make note of. First, you will re-name anything labeled with `qhub` with `nebari`. Second, the version system used for Nebari is different from QHub. Nebari uses a CalVer version system, starting at version 2022.10.1. QHub was tracked with a SemVer version system, the last version being 0.4.5.
:::

### Backup existing data

Always [backup your data](./manual-backup.md) before upgrading!

### Locate configuration file

Locate your `qhub-config.yaml` configuration file.

For CI/CD deployments, you will need to `git clone <repo URL>` into a folder on your local machine if you haven't done so already.

:::warning Breaking upgrades

### Rename existing QHub URL

This will allow the existing cluster to remain alive in case it is needed, but the idea would be not to have it in use from now on.

Move the `qhub-config.yaml` to `nebari-config.yaml` and change the following lines:

```yaml
project_name: myqhub
domain: qhub.myproj.com
```

could become:

```yaml
project_name: mynebari
domain: nebari.myproj.com
```

Run the command `nebari deploy` using the existing (old) version of QHub.
:::

### Upgrade the `QHub` command package

To install (or upgrade) to a specific version of the python package used to manage Nabari, you can run the following, choosing either pip or conda:

```shell
pip install --upgrade nebari
```

or

````shell
conda update nebari

### Upgrade `nabari-config.yaml` file

In the folder containing your qhub configuration file, run:

```shell
nebari upgrade -c nebari-config.yaml
````

:::warning Breaking upgrades
For those that are upgrading from an older version (e.g. v0.3.14 (or earlier)), you will need to go back to the original `qhub-config.yaml` file which contained the original domain.
:::

Upgrading will output a newer version of `nebari-config.yaml` that is compatible with the updated version of `Nebari`. The process outputs a list of changes it has made. The `upgrade` command creates a copy of the original unmodified config file (`qhub-config.yaml.old.backup`) as well as any other files that may be required by the upgraded cluster (including a JSON file (`nabari-users-import.json`) used to import existing users into Keycloak if they are not already there).

### Validate special customizations in `nebari-config.yaml`

You may have made special customizations to your `nebari-config.yaml`, such as using your own versions of Docker images. Please check your `nebari-config.yaml` and decide if you need to update any values that would not have been changed automatically - or, for example, you may need to build new versions of your custom Docker images to match any changes in Nebari's images.

:::warning Breaking upgrades

### Rename the Project and Increase Kubernetes version

You need to rename the project to avoid clashes with the existing (old) cluster which would otherwise already own resources based on the names that the new cluster will attempt to use.

The domain should remain as the preferred main one that was always in use previously.

For example:

```yaml
project_name: myqhub
domain: qhub.myproj.com
```

could become:

```yaml
project_name: mynebari
domain: nebari.myproj.com
```

It is also a good time to upgrade your version of Kubernetes. Look for the `kubernetes_version` field within the cloud provider section of the `nebari-config.yaml` file and increase it to the latest.
:::

### Redeploy QHub

For local deployments, run the following:

```shell
nebari deploy -c qhub-config.yaml
```

### CI/CD: render and commit to git

For CI/CD (GitHub/GitLab) workflows, update the workflow files.
Run the following with the updated `nebari-config.yaml` file:

```shell
nebari render -c nebari-config.yaml
```

Commit all the files (`nebari-config.yaml` and GitHub/GitLab workflow files) back to the remote repo. All files need to be committed together in the same commit.

:::warning Breaking upgrades
For upgrades from older versions to v0.4, you will need to do the following steps. Everyone else is done!

### Update OAuth callback URL for Auth0 or GitHub

If your QHub deployment relies on Auth0 or GitHub for authentication, please update the OAuth callback URL.

<details>
<summary>Expand this section for Auth0 instructions </summary>

1. Navigate to the your Auth0 tenancy homepage and from there select "Applications".

2. Select the "Regular Web Application" with the name of your deployment.

3. Under the "Application URIs" section, paste the new OAuth callback URL in the "Allowed Callback URLs" text block. The URL should be `https://{your-nebari-domain}/auth/realms/nebari/broker/auth0/endpoint`, replacing `{your-nebari-domain}`with your literal domain of course.

</details>

<details>
<summary>Expand this section for GitHub auth instructions </summary>

1. Go to the [GitHub Developer Settings](https://github.com/settings/developers).

2. Click "OAuth Apps" and then click the app representing your Nebari instance.

3. Under "Authorization callback URL", paste the new GitHub callback URL. The URL should be
   `https://{your-nebari-domain}/auth/realms/nebari/broker/github/endpoint`, replacing `{your-nebari-domain}` with your literal domain of course.

</details>

### Restore from Backups

Next, you will need to perform the following steps to restore from a previously generated backup, as described in the [Manual Backups documentation](./manual-backup.md):

1. Restore the NFS data from your S3 (or similar) backup
2. Immediately after restoring NFS data, you must run some extra commands as explained in the backup/restore docs for v0.4 upgrades specifically.
3. Restore the JupyterHub SQLite database.

### Import users into Keycloak

The last two steps are:

1. Change the Keycloak `root` user password, documented [here](./configure-keycloak-howto.md#change-keycloak-root-password)
2. Import existing users, documented [here](./manual-backup.md#import-keycloak).

For more details on this process, visit the [Keycloak docs section][login-keycloak].

### Known versions that require re-deployment

Version `v0.3.11` on AWS has an error with the Kubernetes config map. See [this GitHub discussion related to AWS K8s config maps](https://github.com/Quansight/nebari/discussions/841) for more details.
:::

## Upgrade QHub from pre-0.4.0 to another QHub version

:::warning Breaking upgrades
If you are upgrading from an older version, (e.g. v0.3.14 (or earlier), to v0.4), the cluster cannot be upgraded in-situ so you must perform a redeployment. Please pay extra attention to the highlighted `Breaking upgrades` steps throughout the process!
:::

### Backup existing data

Perform manual backups of the NFS data and JupyterHub database.

:::warning Breaking upgrades
For older versions of QHub, ignore the section about Keycloak data since that will not exist in older (v0.3.14) clusters.
:::

Always [backup your data](./manual-backup.md) before upgrading!

### Locate configuration file

Locate your `qhub-config.yaml` configuration file.

For CI/CD deployments, you will need to `git clone <repo URL>` into a folder on your local machine if you haven't done so already.

:::warning Breaking upgrades

### Rename existing QHub URL

This will allow the existing cluster to remain alive in case it is needed, but the idea would be not to have it in use from now on.

In the `qhub-config.yaml` for example:

```yaml
project_name: myqhub
domain: qhub.myproj.com
```

could become:

```yaml
project_name: myqhub
domain: qhub-old.myproj.com
```

Run the command `nebari deploy` using the existing (old) version of QHub.
:::

### Upgrade the `QHub` command package

To install (or upgrade) to a specific version of the python package used to manage QHub, you can run the following, choosing either pip or conda:

```shell
pip install --upgrade qhub==<version>
```

or

```shell
conda install qhub=<version>
```

### Upgrade `qhub-config.yaml` file

In the folder containing your qhub configuration file, run:

###TO DO: is there a QHub command?

```shell
nebari upgrade -c nebari-config.yaml
```

:::warning Breaking upgrades
For those that are upgrading from an older version (e.g. v0.3.14 (or earlier)), you will need to go back to the original `qhub-config.yaml` file which contained the original domain.
:::

Upgrading will output a newer version of `qhub-config.yaml` that is compatible with the updated version of `QHub`. The process outputs a list of changes it has made. The `upgrade` command creates a copy of the original unmodified config file (`qhub-config.yaml.old.backup`) as well as any other files that may be required by the upgraded cluster (including a JSON file (`qhub-users-import.json`) used to import existing users into Keycloak if they are not already there).

### Validate special customizations to `qhub-config.yaml`

You may have made special customizations to your `qhub-config.yaml`, such as using your own versions of Docker images. Please check your `qhub-config.yaml` and decide if you need to update any values that would not have been changed automatically - or, for example, you may need to build new versions of your custom Docker images to match any changes in QHub's images.

:::warning Breaking upgrades

### Rename the Project and Increase Kubernetes version

You need to rename the project to avoid clashes with the existing (old) cluster which would otherwise already own resources based on the names that the new cluster will attempt to use.

The domain should remain as the preferred main one that was always in use previously.

For example:

```yaml
project_name: myqhub
domain: qhub.myproj.com
```

could become:

```yaml
project_name: myqhubnew
domain: qhub.myproj.com
```

It is also a good time to upgrade your version of Kubernetes. Look for the `kubernetes_version` field within the cloud provider section of the `qhub-config.yaml` file and increase it to the latest.
:::

### Redeploy QHub

For local deployments, run the following:
###TO DO: is there a QHub command?

```shell
nebari deploy -c qhub-config.yaml
```

At this point you may see an error message saying that deployment is prevented due to the `prevent_deploy` setting in your YAML file. This is a safeguard to ensure that you only proceed if you are aware of possible breaking changes in the current upgrade.

For example, we may be aware that you will lose data due to this upgrade, so need to note a specific upgrade process to keep your data safe. Always check the release notes of the release in this case and get in touch with us if you need assistance. For example, you may find that your existing cluster is intentionally deleted so that a new replacement can be deployed instead, in which case your data must be backed up so it can be restored after the upgrade.

**When you are ready, remove the `prevent_deploy` setting from the config file, and run the `nebari deploy -c nebari-config.yaml` again.**

### CI/CD: render and commit to git

For CI/CD (GitHub/GitLab) workflows, update the workflow files.
Run the following with the updated `nebari-config.yaml` file:

###TO DO: is there a QHub command?

```shell
nebari render -c nebari-config.yaml
```

Commit all the files (`qhub-config.yaml` and GitHub/GitLab workflow files) back to the remote repo. All files need to be committed together in the same commit.

:::warning Breaking upgrades
For upgrades from older versions to v0.4, you will need to do the following steps. Everyone else is done!

### Update OAuth callback URL for Auth0 or GitHub

If your QHub deployment relies on Auth0 or GitHub for authentication, please update the OAuth callback URL.

<details>
<summary>Expand this section for Auth0 instructions </summary>

1. Navigate to the your Auth0 tenancy homepage and from there select "Applications".

2. Select the "Regular Web Application" with the name of your deployment.

3. Under the "Application URIs" section, paste the new OAuth callback URL in the "Allowed Callback URLs" text block. The URL should be `https://{your-nebari-domain}/auth/realms/nebari/broker/auth0/endpoint`, replacing `{your-nebari-domain}`with your literal domain of course.

</details>

<details>
<summary>Expand this section for GitHub auth instructions </summary>

1. Go to the [GitHub Developer Settings](https://github.com/settings/developers).

2. Click "OAuth Apps" and then click the app representing your Nebari instance.

3. Under "Authorization callback URL", paste the new GitHub callback URL. The URL should be
   `https://{your-nebari-domain}/auth/realms/nebari/broker/github/endpoint`, replacing `{your-nebari-domain}` with your literal domain of course.

</details>

### Restore from Backups

Next, you will need to perform the following steps to restore from a previously generated backup, as described in the [Manual Backups documentation](./manual-backup.md):

1. Restore the NFS data from your S3 (or similar) backup
2. Immediately after restoring NFS data, you must run some extra commands as explained in the backup/restore docs for v0.4 upgrades specifically.
3. Restore the JupyterHub SQLite database.

### Import users into Keycloak

The last two steps are:

1. Change the Keycloak `root` user password, documented [here](./configure-keycloak-howto.md#change-keycloak-root-password)
2. Import existing users, documented [here](./manual-backup.md#import-keycloak).

For more details on this process, visit the [Keycloak docs section][login-keycloak].

### Known versions that require re-deployment

Version `v0.3.11` on AWS has an error with the Kubernetes config map. See [this GitHub discussion related to AWS K8s config maps](https://github.com/Quansight/nebari/discussions/841) for more details.
:::

<!-- Internal links -->

[login-keycloak]: /docs/tutorials/login-keycloak
