---
id: nebari-destroy
title: Destroy your Nebari deployment
description: A basic overview to destroying your Nebari deployment and associated resources
---

## Introduction

This guide is to help first-time users destroy Nebari resources that have been previous deployed while setting up Nebari at the production scale. With your `qhub-config.yaml` configuration file, you can use a handy `destroy` command to automatically destroy resources with Nebari. We will also take a look at how you can manually destroy resources on individual cloud providers in case the automation fails.

## Destroying Nebari

You can specify the `qhub-config.yaml` configuration file created while deploying Nebari to destroy the resources as well. Type the following command on your command line:

```bash
qhub destroy -c qhub-config.yaml
```

:::note
The above command will not delete your `qhub-config.yaml` and related rendered files thus a re-deployment via deploy is possible afterwards.
:::

The terminal will prompt you to press `enter` to verify that you wish to delete your Nebari deployment by rendering the resources. To disable the rendering, you can pass the flag `--disable-render` to the above command.

If the deletion is successful, you will see the following output:

```bash
<!-- TODO -->
```

Congratulations! You have successfully destroyed your Nebari deployment and the associated resources!

## Manually deleting the resources

## Troubleshooting
