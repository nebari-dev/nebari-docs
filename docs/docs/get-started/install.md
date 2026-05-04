---
description: Learn to install the Nebari kubernetes platform
---

# Install NIC

Nebari Infrastructure Core (NIC) provisions a production-grade platform (Kubernetes cluster).
It is the foundational layer of the Nebari ecosystem, that includes platform essentials like authentication (SSO), user management, observability, TLS certification, and more. You can set up software packs on top of this layer.

<!-- TODO: Link to architecture explanation when ready. -->

## Download

From the [NIC release assets](https://github.com/nebari-dev/nebari-infrastructure-core/releases), download the appropriate binary for your platform.

## Extract & add to PATH

### Linux/MacOS

Extract the tarball:

```sh
tar -xzf nic_v0.2.0_xyz.tar.gz
```

Move it to an appropriate folder on PATH:

```sh
sudo mv nic /usr/local/bin/
```

:::tip
Ensure this location in on your user PATH with `echo $PATh`.
If not, you can add it to PATH with `export PATH=$PATH:/path/to/dir`.
:::

### Windows

Extract the ZIP file, and add `nic.exe` to your PATH.

To add to PATH, search for “Edit environment variables for your account” for the system settings page.

## Verify the installation

```sh
nic --help
```

You can also [install NIC from source](https://github.com/nebari-dev/nebari-infrastructure-core#install) for development and testing.
