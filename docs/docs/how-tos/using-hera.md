---
id: using-hera
title: Automate workflows with Hera
description: Hera workflow management
---

# Automate workflows with Hera

[Hera][hera-docs] provides an easy way to run Argo workflows from Python code. The examples below are based on Hera 5, which is a major release with a full rewrite of the library.  The rewrite allowed full feature parity with Argo workflows, so be sure to use the [Argo docs][argo-docs] to learn more about how the workflows are being executed.

## Setup

To work with Hera via Python code, you'll need to create Argo environment variables.  Most of them are easy to copy from the Argo UI on Nebari.

1. Go to your Nebari domain
2. Click on Argo Workflows and log in if needed
3. On the left, click on User to show your User Info page

At the bottom of the User Info page is a list of variables and a button to copy them to your clipboard.

   ![Argo UI page - user info selected](/img/how-tos/hera_argo_user_credentials.png)

Copy those variables using the button (the redacted token will be copied to the clipboard), create your `.env` file following the format below, and save it in your Nebari directory.  Remember to keep your credentials hidden and secure by not putting them in shared directories or other public platforms.

```
# Copied from Argo UI
ARGO_SERVER='<your Nebari domain>:443'
ARGO_HTTP1=true
ARGO_SECURE=true
ARGO_BASE_HREF=/argo
ARGO_TOKEN='<your token>'
ARGO_NAMESPACE=argo ;# or whatever your namespace is
KUBECONFIG=/dev/null ;# recommended

# Specify Hera arguments for the global config
GLOBAL_CONFIG_HOST='<your Nebari domain>/argo'
GLOBAL_CONFIG_NAMESPACE='<your namespace>'  # might be different from Argo namespace, e.g., 'dev'
```

## Basic workflow to run scripts

The script below runs two functions in different pods concurrently.  After the imports, it loads global configuration arguments for Hera to interact with Argo.  Those come from the `.env` file defined above.  Be sure to update this script with the path to your `.env` file.

```python
import os
from pathlib import Path
from dotenv import load_dotenv
from hera.shared import global_config
from hera.workflows import Env, DAG, Workflow, script


env_path = Path('.env').resolve()
load_dotenv(env_path, verbose=True)
global_config.token = os.environ['ARGO_TOKEN'].replace('Bearer ', '')
global_config.host = os.environ['GLOBAL_CONFIG_HOST']
global_config.namespace = os.environ['GLOBAL_CONFIG_NAMESPACE']

@script()
def hello_world():
    """Simple function"""
    print("Hello World!")


@script(env=[Env(name="ENV_VAR1", value="1"), Env(name="ENV_VAR2", value="2")])
def multiline_function(arg1: str, arg2: str, ) -> str:
    """Example of passing function arguments and environment variables"""
    print(arg1)
    print(arg2)


with Workflow(generate_name="fv-test-", entrypoint="my-dag") as w:
    with DAG(name='my-dag'):
        hello_world()
        multiline_function(
            arguments={'arg1': 'test string', 'arg2': 'another test string'}
            )

w.create()
```
Using a directed-acyclic graph (DAG) gives us control over when the functions run, but in this simple case, we do not define an order of execution or any dependencies, so they will run immediately and independently.

The second function illustrates how to pass arguments to a function via the `arguments` dict in the function call.  It also shows how to pass environment variables to the pod in the script decorator using a list of `Env` specifications.

The `Workflow` takes `generated_name`, which appends some random characters to the string to ensure your workflow name is unique.  The parameter `entrypoint` defines the DAG to be invoked.  Be sure it is the same as the name given in your DAG.

Notice that a docker image was not specified in the script above.  In this case, Argo will start a pod using the default image specified by Hera.  In Hera 5.1.3, it's a [Python 3.8 image][hera-python-default-image].

## Specify priorities and dependencies with a DAG

Using a DAG will allow you to specify the dependencies of each task.  If a task fails, the downstream tasks can be cancelled or some other task can take its place.  This provides more control over the tasks and can assist in creating much more efficient workflows.

```python
import os
from pathlib import Path
from dotenv import load_dotenv
from hera.shared import global_config
from hera.workflows import Env, DAG, Workflow, script


env_path = Path('.env').resolve()
load_dotenv(env_path, verbose=True)
global_config.token = os.environ['ARGO_TOKEN'].replace('Bearer ', '')
global_config.host = os.environ['GLOBAL_CONFIG_HOST']
global_config.namespace = os.environ['GLOBAL_CONFIG_NAMESPACE']

@script()
def hello_world():
    """Simple function"""
    print("Hello World!")


@script(env=[Env(name="ENV_VAR1", value="1"), Env(name="ENV_VAR2", value="2")])
def multiline_function(arg1: str, arg2: str, ) -> str:
    """Example of passing function arguments and environment variables"""
    print(arg1)
    print(arg2)

@script()
def another_script():
    """Simple function"""
    print("Another script")


with Workflow(generate_name="dependency-test-", entrypoint="my-dag") as w:
    with DAG(name='my-dag'):
        t1 = hello_world()
        t2a = multiline_function(
                arguments={'arg1': 'test string', 'arg2': 'another test string'}
            )
        t2b = another_script()
        t1 >> [t2a, t2b]

w.create()
```

In this script, we added another function and defined the tasks as `t1`, `t2a`, and `t2b`.  In this case, `t1` will run first, and if it succeeds, `t2a` and `t2b` will run in parallel.  If `t1` fails, `t2a` and `t2b` will not be run.

## Passing variables to containers

Hera and Argo fully support container-based workflows, and in fact you are using containers via Kubernetes whenever you use these tools.  You can specify your own image or use one from Docker Hub.  Both parameters and environment variables can be passed into containers as shown in the script below.

```python
import os
from pathlib import Path
from dotenv import load_dotenv
from hera.shared import global_config
from hera.workflows import Container, Env, DAG, Workflow, Parameter


env_path = Path('.env').resolve()
load_dotenv(env_path, verbose=True)
global_config.token = os.environ['ARGO_TOKEN'].replace('Bearer ', '')
global_config.host = os.environ['GLOBAL_CONFIG_HOST']
global_config.namespace = os.environ['GLOBAL_CONFIG_NAMESPACE']


with Workflow(generate_name="container-", entrypoint="my-dag") as w:
    container = Container(
        name="container",
        image="alpine:3.7",
        command=["echo", "{{inputs.parameters.arg}}"],
        # command=["echo", "$(ENV_VAR1)"],
        inputs=[Parameter(name="arg")],
        env=[Env(name="ENV_VAR1", value="my_env_var1")]
    )
    with DAG(name="my-dag"):
        A = container(name="A", arguments={"arg": "arg_for_task_A"})
        B = container(name="B", arguments={"arg": "arg_for_task_B"})

w.create()
```

Parameters and environment variables will be created in the container using the names specified, e.g., `ENV_VAR1` and `arg`.  Environment variables can also be pulled in from other sources, such as a Docker registry.  See Hera's [Image Pull Secrets][image-pull-secrets] example for more.

This script uses the `command` attribute to execute commands in the container.  The script above demonstrates how to access each type of variable (swap the commented commands to try each method).  If an executable, such as `echo` in the example above, is not specified, Hera defaults to `python`.  See the [description of `command` in the version 4 docs][command-description-v4-docs] for more on using the `command` attribute, and see the Kubernetes doc [Define a Command and Arguments for a Container][define-a-command-on-k8s] for more on executing commands in a pod.

## Volume mounts

Volume mounts can make it easy to pass environment variables, tokens, conda environments, and input data, as well as return output from the run directly to your home directory.  However, it might be more than you need, so consider simpler methods that only pass variables or that write output to the cloud.

If you need to create an empty volume, you can specify whatever mount path you need, such as `/mnt/my_vol`.  Our example below serves two purposes.  If the volume did not already exist, it would create it, but because it is already specified for any linux container we spin up, we are effectively specifying the size that the volume should be when Docker creates it.  `/dev/shm` is typically small, like 64MB, but when running deep learning algorithms, we need a larger size, and anything from 2-16GB tends to work well for us.

```python
import os
from pathlib import Path
from dotenv import load_dotenv
from hera.shared import global_config
from hera.workflows import Container, DAG, Volume, Workflow


env_path = Path('.env').resolve()
load_dotenv(env_path, verbose=True)
global_config.token = os.environ['ARGO_TOKEN'].replace('Bearer ', '')
global_config.host = os.environ['GLOBAL_CONFIG_HOST']
global_config.namespace = os.environ['GLOBAL_CONFIG_NAMESPACE']


with Workflow(generate_name="vol-", entrypoint="my-dag") as w:
    container = Container(
        name="container",
        image="continuumio/miniconda3",
        command=["df", "-h"],
        volumes=[Volume(size="2Gi", mount_path="/dev/shm")]
    )
    with DAG(name="my-dag"):
        A = container(name="A")

w.create()
```

The next example adds a user's home directory as an existing volume mount.  As mentioned above, this can be a great way to quickly load environment variables from a `.env` file or pass datasets into your container.  Note that you should replace `<username>` with your Nebari username.

TODO: is `jupyterhub-dev-share` the same for any user, or does this name change depending on the Nebari instance?

```python
import os
from pathlib import Path
from dotenv import load_dotenv
from hera.shared import global_config
from hera.workflows import Container, DAG, ExistingVolume, Volume, Workflow


env_path = Path('.env').resolve()
load_dotenv(env_path, verbose=True)
global_config.token = os.environ['ARGO_TOKEN'].replace('Bearer ', '')
global_config.host = os.environ['GLOBAL_CONFIG_HOST']
global_config.namespace = os.environ['GLOBAL_CONFIG_NAMESPACE']


with Workflow(generate_name="vol-", entrypoint="my-dag") as w:
    container = Container(
        name="container",
        image="continuumio/miniconda3",
        command=["ls", "/home/<username>"],
        volumes=[
            Volume(size="2Gi", mount_path="/dev/shm"),
            ExistingVolume(
                name="jupyterhub-dev-share",
                mount_path="/home/<username>",
                sub_path="home/<username>",
                claim_name="jupyterhub-dev-share"
            )
        ]
    )
    with DAG(name="my-dag"):
        A = container(name="A")

w.create()
```

The next example adds conda-store environments from a namespace to the container by creating another `ExistingVolume` that points to the namespace on your Nebari instance.

```python
import os
from pathlib import Path
from dotenv import load_dotenv
from hera.shared import global_config
from hera.workflows import Container, DAG, ExistingVolume, Volume, Workflow


env_path = Path('.env').resolve()
load_dotenv(env_path, verbose=True)
global_config.token = os.environ['ARGO_TOKEN'].replace('Bearer ', '')
global_config.host = os.environ['GLOBAL_CONFIG_HOST']
global_config.namespace = os.environ['GLOBAL_CONFIG_NAMESPACE']


with Workflow(generate_name="vol-", entrypoint="my-dag") as w:
    container = Container(
        name="container",
        image="continuumio/miniconda3",
        command=["conda", "info", "--envs"],
        volumes=[
            Volume(size="2Gi", mount_path="/dev/shm"),
            ExistingVolume(
                name="jupyterhub-dev-share",
                mount_path="/home/<username>",
                sub_path="home/<username>",
                claim_name="jupyterhub-dev-share"
            ),
            ExistingVolume(
                name="conda-store-dev-share",
                mount_path="/home/conda/<namespace>",
                sub_path="<namespace>",
                claim_name="conda-store-dev-share"
            )
        ]
    )
    with DAG(name="my-dag"):
        A = container(name="A")

w.create()
```

## TODO: How to work with GPUs

TODO: This is a starting point.  Hera 5 does not have a GPUTolerance yet.  We used it in Hera 4 previously and they have a todo on their repo to make one.

```python
import os
from pathlib import Path
from dotenv import load_dotenv
from hera.shared import global_config
from hera.workflows import Container, DAG, GPUTolerance, Resources, Volume, Workflow


env_path = Path('.env').resolve()
load_dotenv(env_path, verbose=True)
global_config.token = os.environ['ARGO_TOKEN'].replace('Bearer ', '')
global_config.host = os.environ['GLOBAL_CONFIG_HOST']
global_config.namespace = os.environ['GLOBAL_CONFIG_NAMESPACE']


with Workflow(generate_name="gpu-", entrypoint="my-dag") as w:
    container = Container(
        name="container",
        image="pytorchignite/vision",
        # command=["python", "import", "torch", "torch.cuda.is_available()"],
        command=["nvidia-smi"],
        volumes=[Volume(size="2Gi", mount_path="/dev/shm")],
        resources=Resources(gpus=2),
        tolerations=[GPUTolerance],
        node_selectors={"cloud.google.com/gke-accelerator": "nvidia-tesla-t4"},
    )
    with DAG(name="my-dag"):
        A = container(name="A")

w.create()
```

## Deep Learning Tips

- If you need to run your deep learning code with the `torchrun` executable instead of `python`, see the notes and links above on running commands in containers.
- Set `/dev/shm` to a larger size by using a volume specification as shown above.

[hera-docs]: https://hera-workflows.readthedocs.io/
[argo-docs]: https://argoproj.github.io/argo-workflows/
[hera-python-default-image]: https://github.com/argoproj-labs/hera/blob/3fd01f75059823da2338ef02488d2c71306818bf/src/hera/shared/_global_config.py#L37
[image-pull-secrets]: https://hera-workflows.readthedocs.io/en/stable/examples/workflows/upstream/image_pull_secrets/
[define-a-command-on-k8s]: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell
[command-description-v4-docs]: https://github.com/argoproj-labs/hera/blob/e93b0b0d972e658c00f8c786314fc47f26ae64f9/src/hera/task.py#L116
