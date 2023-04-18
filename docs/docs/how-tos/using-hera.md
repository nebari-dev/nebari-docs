---
id: using-hera
title: Automate workflows with Hera
description: Hera workflow management
---

# Automate workflows with Hera

Hera provides an easy way to run Argo workflows from Python code.

## header 2

Volume mounts can make it easy to pass env vars, tokens, conda envs, and input data, as well as return output from the run directly to your working folders.  However, it might be more than you need, so consider simpler methods that only pass env vars, or write output to the cloud.

This is Hera v5

TODO: add .env template

Get tokens from Argo UI

TODO: add instructions and screenshot for Argo UI tokens

```
# Copied from Argo UI
export ARGO_SERVER='nebari.quansight.dev:443'
export ARGO_HTTP1=true
export ARGO_SECURE=true
export ARGO_BASE_HREF=/argo
export ARGO_TOKEN_TOKEN='<your token'
export ARGO_TOKEN='<your token>'
export ARGO_NAMESPACE=argo ;# or whatever your namespace is
export KUBECONFIG=/dev/null ;# recommended

# Specify Hera arguments for the global config
export GLOBAL_CONFIG_HOST='<your Nebari domain>/argo'
export GLOBAL_CONFIG_NAMESPACE='<your namespace>'  # e.g., 'dev'
```

TODO: Discuss options by starting with a simple script and adding features

Put task result up front if possible, for debugging
0. Return Task result for debugging


1. Basic Workflow() that runs a script (script_variations)

Each function runs in a separate pod concurrently.

```python
import os
from pathlib import Path
from dotenv import load_dotenv

from hera.shared import global_config
from hera.workflows import DAG, Workflow, script


env_path = Path('.env').resolve()
load_dotenv(env_path, verbose=True)
global_config.token = os.environ['ARGO_TOKEN_TOKEN']
global_config.host = os.environ['GLOBAL_CONFIG_HOST']
global_config.namespace = os.environ['GLOBAL_CONFIG_NAMESPACE']

@script()
def hello_world():
    print("Hello World!")


@script()
def multiline_function(arg1: str, arg2: str, ) -> str:
    print(arg1)
    print(arg2)


with Workflow(generate_name="fv-test-", entrypoint="d") as w:
    with DAG(name='d'):
        hello_world()
        multiline_function(
            arguments={'arg1': 'test string', 'arg2': 'another test string'}
            )

w.create()
```

2. Add env vars to basic workflow (colored_logs)

TODO: ... Using the @script decorator, add env vars

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
    print("Hello World!")


@script(env=[Env(name="ENV_ARG", value="1")])
def multiline_function(arg1: str, arg2: str, ) -> str:
    print(arg1)
    print(arg2)


with Workflow(generate_name="fv-test-", entrypoint="d") as w:
    with DAG(name='d'):
        hello_world()
        multiline_function(
            arguments={'arg1': 'test string', 'arg2': 'another test string'}
            )

w.create()
```

3. Work with Steps().  Must be inside a workflow.  Does this require containers or can they be scripts? (steps)



4. Add env vars as usual via `env=[Env(), Env(),...]` (Container class)
5. Can run steps in parallel using s.parallel()
6. Can use a DAG + Task instead of Steps.  What's the advantage?  Param passing and flow management? (dag_with_param_passing)
7. add vol mount
- mount local fs so you can load env vars, save model results, etc.
8. add existing vol (conda envs and user home dir)
- volume mount conda envs from conda-store
9. pass params between tasks, like in DAG use case

task result - pass error messages back to user

## Deep Learning Tips
Set dev/shm by adding a Volume() to the volume list in a Task.  `Volume(size="2Gi", mount_path="/dev/shm")`


