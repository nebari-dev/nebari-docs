---
description: Learn to install the Nebari kubernetes platform
---

# Install NIC

Nebari Infrastructure Core (NIC) provisions a production-grade platform (Kubernetes cluster).
It is the foundational layer of the Nebari ecosystem, that includes platform essentials like authentication (SSO), user management, observability, TLS certification, and more. You can set up software packs (like the data science pack with specific tools like JupyterLab) on top of this layer.

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

Ensure this location in on your user PATH with `echo $PATH`.
If not, you can add it to PATH with `export PATH=$PATH:/path/to/dir`.

:::info[MacOS verification error]
If you see a message `Apple could not verify "nic" is free of malware that may harm your Mac or compromise your privacy`, explicitly allow it:

- Go to: Settings > Privacy & Security
- Scroll down to the Security section, and find the `"nic" was blocked ...`
- Click on the "Open Anyway" button

:::

### Windows

Extract the zip file, and add `nic.exe` to your PATH.

To add to PATH, search for "Edit environment variables for your account" on the system settings page.

## Verify the installation

Ensure the installation worked with the help command.
It should display a message similar to the following.

```sh
nic --help
```

```sh title="Output"
Nebari Infrastructure Core (NIC) is a standalone CLI tool that manages
cloud infrastructure for Nebari using native cloud SDKs with declarative semantics.

Usage:
  nic [command]

Available Commands:
  completion  Generate the autocompletion script for the specified shell
  deploy      Deploy infrastructure based on configuration file
  destroy     Destroy cloud infrastructure
  help        Help about any command
  kubeconfig  Generate kubeconfig for the deployed Nebari cluster
  validate    Validate configuration file
  version     Show version information

Flags:
  -h, --help   help for nic

Use "nic [command] --help" for more information about a command.
```

You can also [install NIC from source](https://github.com/nebari-dev/nebari-infrastructure-core#install) for development and testing.
