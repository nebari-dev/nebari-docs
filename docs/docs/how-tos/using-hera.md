---
id: using-hera
title: Automate workflows with Hera
description: Hera workflow management
---

# Automate workflows with Hera

[Hera](https://hera-workflows.readthedocs.io/) provides an easy way to run Argo workflows from Python code. The examples below are based on Hera 5, which is a major release with a full rewrite of the library.  The rewrite allowed full feature parity with Argo workflows, so be sure to use the [Argo docs](https://argoproj.github.io/argo-workflows/) to learn more about how the workflows are being executed.

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

## TODO: Script that returns stacktrace for debugging

Return Task result for debugging
- Simplest workflow possible, that returns the result of a task, including stdout/stderr.
- Use subprocess?
- Is it something that should be configured for all users in Nebari instead?  The Argo UI includes logs but the logs are empty.

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

Notice that a docker image was not specified in the script above.  In this case, Argo will start a pod using the default image specified by Hera.  In Hera 5.1.3, it's a [Python 3.8 image](https://github.com/argoproj-labs/hera/blob/3fd01f75059823da2338ef02488d2c71306818bf/src/hera/shared/_global_config.py#L37).

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

## WIP: Parameter passing between tasks

Defining a Task allows parameter passing.  This script passes the output from the first function to the second function, each running in their own pods.

TODO: There is a permission issue preventing parameter sharing.  Either allow sharing on Nebari or skip this and use volume mounts to share across pods.

```python
import os
from pathlib import Path
from dotenv import load_dotenv
from hera.shared import global_config
from hera.workflows import Env, DAG, Workflow, script, Task, Parameter


env_path = Path('.env').resolve()
load_dotenv(env_path, verbose=True)
global_config.token = os.environ['ARGO_TOKEN_TOKEN']
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
        t1: Task = hello_world()
        t2 = multiline_function(
            arguments=[
                Parameter(name="arg1", value=t1.result),
                Parameter(name="arg2", value="another test string")
            ]
        )
        t1 >> t2

w.create()

```

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

## TODO: volume mounts
- mount local fs so you can load env vars, save model results, etc.
- Volume mounts can make it easy to pass env vars, tokens, conda envs, and input data, as well as return output from the run directly to your working folders.  However, it might be more than you need, so consider simpler methods that only pass env vars, or write output to the cloud.
- volume mount conda envs from conda-store
-
## WIP: Deep Learning Tips
Set `dev/shm` by adding a Volume() to the volume list in a Task.  `Volume(size="2Gi", mount_path="/dev/shm")`

If you need to run your deep learning code with the `torchrun` executable instead of `python`, see the notes and links above on running commands in containers.

set GPUToleration for GPUs

[image-pull-secrets]: https://hera-workflows.readthedocs.io/en/stable/examples/workflows/upstream/image_pull_secrets/
[define-a-command-on-k8s]: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell
[command-description-v4-docs]: https://github.com/argoproj-labs/hera/blob/e93b0b0d972e658c00f8c786314fc47f26ae64f9/src/hera/task.py#L116
