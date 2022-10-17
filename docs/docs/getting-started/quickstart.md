---
id: quickstart
title: Quickstart
description: A cheat-sheet of Neabri commands for returning users.
---

This quickstart is a reference for experienced and returning users.
If you're new to Nebari, start at [Installing Nebari](installing-nebari.md).

## Install

You need to have a MacOS or Linux machine with Python >= 3.8 to install Nebari.

You can install Nebari from PyPI or conda-forge:

<!-- TODO: Update to use nebari instead of QHub. -->

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="conda" label="conda" default>

  ```bash
  conda install qhub -c conda-forge
  ```
  </TabItem>
  <TabItem value="pip" label="pip" default>

  ```bash
  python3 -m pip install qhub
  ```
  </TabItem>
  <TabItem value="mamba" label="mamba" default>

  ```bash
  mamba install qhub
  ```
  </TabItem>
</Tabs>

Verify the installation with:

```bash
qhub --help
```

Make sure it displays an output similar to:

```bash
usage: qhub [-h] [-v]
            {deploy,render,init,validate,destroy,support,upgrade,keycloak,cost-estimate}
            ...

QHub command line

positional arguments:
  {deploy,render,init,validate,destroy,support,upgrade,keycloak,cost-estimate}
                        QHub - 0.4.3

optional arguments:
  -h, --help            show this help message and exit
  -v, --version         QHub version number
```

## Initialize

After installation, you can create a new Nebari project!

Create a new project directory:

```bash
mkdir <project-name>
cd <project-name>
```

Create the `nebari-config.yaml` file using the guided init wizard:

```bash
qhub init --guided-int
```

:::note
If you know the initialization requirements and have set up the environment variables, you can direct run the `qhub init` command with the necessary flags.

Run `nebari init --help` to see the list of available options and flags.
:::

<!-- TODO: Create commands guide for each provider using Tabs -->

## Deploy

<Tabs>
  <TabItem value="regular-deploy" label="Regular deploy" default>

  You can deploy your Nebari instance to the cloud (selected in the provious step) with:

  ```bash
  qhub deploy -c qhub-config.yaml
  ```

  You may need to set up necessary DNS records (with a DNS provider of your choice) for your chosen domain to proceed if you see:

  ```bash
  Take IP Address 12.312.312.312 and update DNS to point to "your.domain" [Press Enter when Complete]
  ```

  </TabItem>
  <TabItem value="auto-dns" label="Automatic DNS provision" default>

  If you use Cloudflare, you can set up automatic DNS provisioning.

  Create a Cloudflare API token and set the following environment variable:

  ```bash
  export CLOUDFLARE_TOKEN="cloudflaretokenvalue"
  ```

  Use the `--dns-auto-provision` flag with the Nebari `deploy` command:

  ```bash
  qhub deploy -c qhub-config.yaml \
  --dns-provider cloudflare \
  --dns-auto-provision
  ```
  </TabItem>
</Tabs>

It can take up to 30 mins for the `deploy` command to execute.

<!-- TODO: Add details about the destroy command -->
<!-- ## Destroy -->


[Read the Troubleshooting guide →](../troubleshooting.md)
