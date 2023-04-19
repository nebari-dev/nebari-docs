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

TODO: why are we using a second arg 'ARGO_TOKEN_TOKEN'?  Can we just use 'ARGO_TOKEN'?

```
# Copied from Argo UI
ARGO_SERVER='<your Nebari domain>:443'
ARGO_HTTP1=true
ARGO_SECURE=true
ARGO_BASE_HREF=/argo
ARGO_TOKEN_TOKEN='<your token>'
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

## Basic workflow to run a script

The script below runs two functions in different pods concurrently.  After the imports, it loads global configuration arguments for Hera to interact with Argo.  Those come from the `.env` file defined above.  Be sure to update this script with the path to your `.env` file.

TODO: replace ARGO_TOKEN_TOKEN with ARGO_TOKEN? (for all scripts on this page)

```python
import os
from pathlib import Path
from dotenv import load_dotenv
from hera.shared import global_config
from hera.workflows import Env, DAG, Workflow, script


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
        hello_world()
        multiline_function(
            arguments={'arg1': 'test string', 'arg2': 'another test string'}
            )

w.create()
```
The second function illustrates how to pass arguments to a function via the `arguments` dict in the function call.  It also shows how to pass environment variables to the pod in the script decorator using a list of `Env` specifications.

The `Workflow` takes `generated_name`, which appends some random characters to the string to ensure your workflow name is unique.  The parameter `entrypoint` defines the DAG to be invoked.  Be sure it the same as the name given in your DAG.

Notice that a docker image was not specified in the script above.  In this case, Argo will start a pod using the default image specified by Hera.  In Hera 5.1.3, it's a [Python 3.8 image](https://github.com/argoproj-labs/hera/blob/3fd01f75059823da2338ef02488d2c71306818bf/src/hera/shared/_global_config.py#L37).

## WIP: Work with Steps

The `Steps` specification is one way of defining a sequence of steps.  Steps can be run in parallel or after a previous step, and they can be organized in a nested way.  All of the steps will be run regardless of the status of a previous step.  For more control over when a task is triggered, especially when a task depends on a previous step, see the `DAG` specification.

s.parallel()

## WIP: Work with DAGs

Using a directed-acyclic graph (DAG) will allow you to specify the dependencies of each task.  If a task fails, the downstream tasks can be cancelled or some other task can take its place.  This allows much more control over the tasks and can assist in creating much more efficient workflows.

(dag_with_param_passing)

pass params between tasks, like in DAG use case

## TODO: env vars in container
Add env vars as usual via `env=[Env(), Env(),...]` (Container class)

## TODO: volume mounts
- mount local fs so you can load env vars, save model results, etc.
- Volume mounts can make it easy to pass env vars, tokens, conda envs, and input data, as well as return output from the run directly to your working folders.  However, it might be more than you need, so consider simpler methods that only pass env vars, or write output to the cloud.
- volume mount conda envs from conda-store
-
## WIP: Deep Learning Tips
Set dev/shm by adding a Volume() to the volume list in a Task.  `Volume(size="2Gi", mount_path="/dev/shm")`
