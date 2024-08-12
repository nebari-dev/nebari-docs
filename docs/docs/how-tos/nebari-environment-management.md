---
id: nebari-environment-management
title: Setup Deployment Environment 
description: Best Practices for Managing Your Python Environment
---

# Nebari Deployment Python Environment Setup

To configure and deploy the Nebari platform, you'll first need to set up your python environment. 

Nebari configuration and deployment is highly dependent on the version of the Nebari CLI that you have active when you run `nebari` commands. A such, we highly recommend [installing Conda](https://docs.anaconda.com/free/anaconda/install/) for managing isolated Python environments, especially when working on more than one Nebari deployment from the same machine or using [Nebari extensions][nebari-extension-system].

Once installed, you can use [manage environments](https://conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#managing-environments) in different ways.

This is a simple way to set up a new Conda environment named `nebari0` with a specific Nebari version and exactly one extension installed. This `nebari0` environment will store all of our packages, including those installed with `pip` because when **pip** is installed into an active conda environment, packages which are then installed with pip will not be saved in the global namespace_. This especially critical when working with extensions, because `nebari` will detect and apply any extensions installed in your Python environment when it runs.

```
conda create -n nebari0
conda activate nebari0
conda install python==3.12 pip # or python version of your choice
pip install nebari==2024.1.1
# Example plugin that can also be installed
pip install nebari-plugin-self-registration==0.0.9
```

<!-- internal links -->

[nebari-extension-system]: /how-tos/nebari-extension-system.md
