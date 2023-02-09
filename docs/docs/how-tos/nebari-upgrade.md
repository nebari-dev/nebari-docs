---
id: nebari-upgrade
title: Upgrade Nebari
description: An overview of how to upgrade Nebari. Includes instructions on updating when breaking changes are expected to occur.
---

# Upgrading Nebari

This is a guide to upgrade Nebari to a newer version.

:::note Breaking upgrades
If you are upgrading from an older version, (e.g. v0.3.14 (or earlier), to v0.4), the cluster cannot be upgraded in-situ so you must perform a redeployment. Please pay extra attention to the highlighted `Breaking upgrades` steps throughout the process!
:::

## Backup existing data

Perform manual backups of the NFS data and JupyterHub database

:::note Breaking upgrades
For older versions of nebari, ignore the section about Keycloak data since that will not exist in older (v0.3.14) clusters.
:::

Always [backup your data](./manual-backup.md) before upgrading!

## Locate configuration file

You may be deploying Nebari based on a local configuration file, or you may be using CI/CD workflows in GitHub or GitLab.
Either way, you will need to locate a copy of your `nebari-config.yaml` configuration file to upgrade it (and commit back
to your git repo in the CI/CD case).

For CI/CD deployments, you will need to `git clone <repo URL>` into a folder on your local machine if you haven't done
so already.

:::note Breaking upgrades

## Rename existing Nebari URL

This will allow the existing cluster to remain alive in case it is needed, but the idea would be not to have it in use
from now on.

In the `nebari-config.yaml` for example:

```yaml
project_name: mynebari
domain: nebari.myproj.com
```

could become:

```yaml
project_name: mynebari
domain: nebari-old.myproj.com
```

Run the command `nebari deploy` using the existing (old) version of Nebari.
:::

## Upgrade the `nebari` command package

To install (or upgrade) your pip installation of the Python package used to manage Nebari:

```shell
pip install --upgrade nebari
```

The above will install the latest full version of Nebari. For a specific older version use:

```shell
pip install --upgrade nebari==<version>
```

Upgrade `nebari-config.yaml` file

In the folder containing your Nebari configuration file, run:

```shell
nebari upgrade -c nebari-config.yaml
```

:::note Breaking upgrades
For those that are upgrading from an older version (e.g. v0.3.14 (or earlier)), you will need to go back to the original `nebari-config.yaml` file which contained the original domain.
:::

Upgrading will output a newer version of `nebari-config.yaml` that is compatible with the new version of `nebari`. The process
outputs a list of changes it has made. The `upgrade` command creates a copy of the original unmodified config file
(`nebari-config.yaml.old.backup`) as well as any other files that may be required by the upgraded cluster (including a JSON file (`nebari-users-import.json`) used to import existing users into Keycloak if they are not already there).

## Validate special customizations to `nebari-config.yaml`

You may have made special customizations to your `nebari-config.yaml`, such as using your own versions of Docker images.
Please check your `nebari-config.yaml` and decide if you need to update any values that would not have been changed
automatically - or, for example, you may need to build new versions of your custom Docker images to match any changes in
Nebari's images.

:::note Breaking upgrades

## Rename the Project and Increase Kubernetes version

You need to rename the project to avoid clashes with the existing (old) cluster which would otherwise already own
resources based on the names that the new cluster will attempt to use.

The domain should remain as the preferred main one that was always in use previously.

For example:

```yaml
project_name: mynebari
domain: nebari.myproj.com
```

could become:

```yaml
project_name: mynebarinew
domain: nebari.myproj.com
```

It is also a good time to upgrade your version of Kubernetes. Look for the `kubernetes_version` field within the cloud
provider section of the `nebari-config.yaml` file and increase it to the latest.
:::

## Step 4: Redeploy Nebari

If you are deploying Nebari from your local machine (not using CI/CD) then you will now have a `nebari-config.yaml` file
that you can deploy.

```shell
nebari deploy -c nebari-config.yaml
```

At this point you may see an error message saying that deployment is prevented due to the `prevent_deploy` setting in
your YAML file. This is a safeguard to ensure that you only proceed if you are aware of possible breaking changes in the
current upgrade.

For example, we may be aware that you will lose data due to this upgrade, so need to note a specific upgrade process to
keep your data safe. Always check the release notes of the release in this case and get in touch with us if you need
assistance. For example, you may find that your existing cluster is intentionally deleted so that a new replacement can
be deployed instead, in which case your data must be backed up so it can be restored after the upgrade.

**When you are ready, remove the `prevent_deploy` setting from the config file, and run the `nebari deploy -c nebari-config.yaml` again.**

### CI/CD: render and commit to git

For CI/CD (GitHub/GitLab) workflows, then as well as generating the updated `nebari-config.yaml` files as above, you will
also need to regenerate the workflow files based on the latest `nebari` version's templates.

With the newly upgraded `nebari-config.yaml` file, run:

```shell
nebari render -c nebari-config.yaml
```

(Note that `nebari deploy` would perform this render step too, but will also immediately redeploy your Nebari.)

Commit all the files (`nebari-config.yaml` and GitHub/GitLab workflow files) back to the remote repo. All files need to be
committed together in the same commit.

:::note Breaking upgrades
For upgrades from older versions to v0.4, you will need to do the following steps. Everyone else is done!

## Update OAuth callback URL for Auth0 or GitHub

If your Nebari deployment relies on Auth0 or GitHub for authentication, please update the OAuth callback URL.

<details><summary>Expand this section for Auth0 instructions </summary>

1. Navigate to the your Auth0 tenancy homepage and from there select "Applications".

2. Select the "Regular Web Application" with the name of your deployment.

3. Under the "Application URIs" section, paste the new OAuth callback URL in the "Allowed Callback URLs" text block. The URL should be `https://{your-nebari-domain}/auth/realms/nebari/broker/auth0/endpoint`, replacing `{your-nebari-domain}`with your literal domain of course.

</details>

<details><summary>Expand this section for GitHub auth instructions </summary>

1. Go to <https://github.com/settings/developers>.

2. Click "OAuth Apps" and then click the app representing your Nebari instance.

3. Under "Authorization callback URL", paste the new GitHub callback URL. The URL should be
   `https://{your-nebari-domain}/auth/realms/nebari/broker/github/endpoint`, replacing `{your-nebari-domain}` with your
   literal domain of course.

</details>

## Restore from Backups

Next, you will need to perform the following steps to restore from a previously generated backup, as described in the
[Manual Backups documentation](./manual-backup.md):

1. Restore the NFS data from your S3 (or similar) backup
2. Immediately after restoring NFS data, you must run some extra commands as explained in the backup/restore docs for v0.4 upgrades specifically.
3. Restore the JupyterHub SQLite database.

## Import users into Keycloak

The last two steps are:

1. Change the Keycloak `root` user password, documented [here](./configure-keycloak-howto.md#change-keycloak-root-password)
2. Import existing users, documented [here](./manual-backup.md#import-keycloak).

For more details on this process, visit the [Keycloak docs section](./login-thru-keycloak-howto.md).

## Known versions that require re-deployment

Version `v0.3.11` on AWS has an error with the Kubernetes config map. See
[this GitHub discussion related to AWS K8s config maps](https://github.com/Quansight/nebari/discussions/841) for more details.
:::
