---
id: develop-local-packages
title: Develop Local Packages on Nebari
description: How to install a dev package from a local project
---

# How to Develop Local Packages on Nebari

As a software development platform, Nebari can be used for active package development. Since `conda-store` manages all environments, a dynamic installation of a local package requires additional care (`pip install -e .` is explicitly disallowed for various reasons, see below).

While the setup for developing local packages may require unfamiliar extra steps for new users, the total time for setup is minimal.

## Why can't I just `pip install -e` my package?

Nebari blocks the standard local installation of packages, e.g. `pip install -e .`. On your personal computer, when you `pip install` a package into a conda environment, it will be placed inside of the conda environment folder structure. However, on Nebari, the environments are managed by `conda-store` in a directory structure which is read-only to users.

For this reason, all pip installs would instead default to the user's `.local` directory. Unfortunately, _all_ environments will automatically pick up _everything_ has been installed in this directory. It is _extremely_ easy to create a situation in which all environments are broken due to a conflict. In fact, its possible to create a situation that causes a user's JupyterLab server to be unable to start. For this reason, local pip installs are prohibited in Nebari.

:::note
For more information, check out [the docs on installing pip packages](/docs/how-tos/install-pip-packages).
:::

## Installing local packages

Despite the limitations on local installations, Nebari does provide a mechanism to install a local package currently under development through the use of virtual environments.

### Building the environment

For this example, we'll walk through creating an environment called `myenv` for a user named `myusername`.

1. Use conda-store to build a basic environment that only includes Python called `myenv` in the namespace `myusername` (i.e. your own namespace).
2. Open a terminal in JupyterLab or VS Code
3. list your envs to find the exact spelling: `conda env list`
4. Activate the environment: `conda activate myusername-myenv`
5. Create a virtual environment (venv) in a folder of your choice: `python -m venv .venv_myenv`
6. Activate the venv: `source .venv_myenv/bin/activate`
7. Install your package via pip: `pip install -e .` or `pip install -r requirements.txt` (as needed)

### Usage from terminal

To use this environment from a terminal in JupyterLab or VS Code, you'll first activate the conda environment, then activate the virtual environment.

1. Activate the env: `conda activate myusername-myenv`d
2. Activate the venv: `python -m venv .venv_myenv`

### Usage from Jupyter:

To use this environment in Juptyer, you'll need to add the path to the environment to the system path since its location isn't automatically added.

1. Open a notebook with the `myusername-myenv` kernel
2. In the first notebook cell run (note that the path and python version might be different in your usecase):

```python
import sys
sys.path.append('/home/myusername/venv_myenv/lib/python3.10/site-packages/')
```

### Usage from VS Code Python extension

To use this environment to run code via the VS Code Python extension, you'll only need to point the VS Code UI to the virtual environment. This will be automatically recognized by VS Code. You will not need to add to the `sys.path` for this approach.

## Conclusion

Developing local packages on Nebari involves a few extra steps compared to working directly on your local machine. However, these additional steps are minimal and ensure a well-contained and stable environment.

To learn more about installing pip packages in general, check out the documentation on [installing pip packages from various sources](/docs/how-tos/install-pip-packages).
