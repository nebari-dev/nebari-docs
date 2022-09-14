---
id: nebari-hpc
title: Deploy Nebari HPC on bare metal machines
description: HPC-based Nebari deployments
---

## Requirements

Nebari-HPC currently requires ubuntu bare metal machines. There are plans to support additional OSs such as RHEL. We actively test on the latest stable Ubuntu release. We require:

- 1 main node with at least 4 cpus and 16 GB of RAM
- 0-N worker nodes (main node can be a worker node but is not recommended) with no significant requirements on resources

Must be able to ssh into each node from the node you are running the ansible commands and connect via root (not recommended) or user and sudo with or without a password.

Aside from Terraform, Nebari HPC heavily depends on [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) for machine and remote control.

We recommend installing ansible via conda. First you must install conda.

```bash
conda create -n qhub-hpc -c conda-forge ansible
conda activate qhub-hpc
```

If you intend to use Nebari HPC please be sure to already have the [necessary dependencies](https://github.com/Quansight/qhub-hpc#dependencies) installed.
