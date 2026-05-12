---
id: argo-workflows-walkthrough
title: Argo Workflows Walkthrough
description: A walk through several example workflows
---

# Argo Workflows Walkthrough

## Introduction

Using a workflow manager can help you automate ETL pipelines, schedule regular
analysis, or just chain together a sequence of functions. Argo is available on
Nebari for workflow management. If you haven't already, check out the
[introductory documentation on using Argo](/how-tos/using-argo.md).

For this tutorial we'll be using the
[Hera](https://hera-workflows.readthedocs.io/) interface to Argo. This will
allow us to write a workflow script in Python.

## The most basic of all examples

The following workflow is perhaps the simplest possible workflow. There are
quite a few bits here so we'll step through it.

### Global Configuration

Nebari sets up several environment variables with tokens, etc. that enable us to
use Argo more smoothly. However, there are two global configuration settings
that we'll need to manually add to each workflow script.

```python
from hera.shared import global_config
import os

global_config_host = f"https://{os.environ['ARGO_SERVER'].rsplit(':')[0]}{os.environ['ARGO_BASE_HREF']}/"
global_config.host = global_config_host
global_config.token = os.environ['HERA_TOKEN']
```

### Workflow Labels

Next, we'll set some labels on our workflows. Because Nebari uses a service
account token by default, we need to tell Argo which user we are. We also need
to tell Argo to use the Nebari Workflow Controller so that we have access to
our Nebari file system and conda environments from within the Argo pod
([more information](/how-tos/using-argo.md#access-your-nebari-environments-and-file-system-while-on-an-argo-pod-beta)).

The workflow labels must be hexadecimal ASCII while the usernames have no such
constraint so we have a helper function `sanitize_labels` to ensure that our
label is valid for Argo.

```python
import re

def sanitize_label(label: str) -> str:
    """
    The sanitize_label function converts all characters that are not
    alphanumeric or a - to their hexadecimal ASCII equivalent. This is
    because kubernetes will complain if certain characters are being
    used. This is the same approach taken by Jupyter for sanitizing.

    On the Nebari Workflow Controller, there is a `desanitize_label`
    function that reverses these changes so we can then perform a user
    look up.

    >>> sanitize_label("user@email.com")
    user-40email-2ecom

    Parameters
    ----------
    label: str
        Username to be sanitized (typically Jupyterhub username)

    Returns
    -------
    Hexadecimall ASCII equivalent of `label`

    """
    label = label.lower()
    pattern = r"[^A-Za-z0-9]"
    return re.sub(pattern, lambda x: "-" + hex(ord(x.group()))[2:], label)



username = os.environ["JUPYTERHUB_USER"]
labels = {
    "workflows.argoproj.io/creator-preferred-username": sanitize_label(username),
    'jupyterflow-override': 'true',
}
```

### Time to Live Strategy

By default, Argo does not destroy servers after completion of a workflow.
Because this can cause substantial unexpected cloud costs, we _highly_
recommend _always_ setting the "Time to live strategy", or `TTLStrategy` on
every workflow.

:::note
The Argo UI will only show the workflow details until the
`TTLStrategy` time has elapsed so make sure you have enough time to evaluate
logs, etc. before those details are removed.
:::

```python
from hera.workflows.models import TTLStrategy

DEFAULT_TTL = 90
ttl_strategy = TTLStrategy(
        seconds_after_completion=DEFAULT_TTL,
        seconds_after_success=DEFAULT_TTL,
        seconds_after_failure=DEFAULT_TTL,
    )
```

### Extra parameters

We also will be setting a `node_selector` parameter, but it is optional. If you
do not include it, Argo will run on your current user instance. If you include
it, Argo will run on the server type that you request. These server types
correspond to the names in your `nebari-config.yml`. Nebari Jupyter instances
are always in the `user` group so that's a good place to start, but you may
want to use other CPU or GPU configurations that have been specified in your
config. Its also important to note that if the node pool is limited to (1) node
in the config, Argo will not be able to spin up. Also note that key in this
dictionary refers to the cloud-specific kubernetes node selector label. For
example, AWS uses "eks.amazonaws.com/nodegroup" while GCP uses
"cloud.google.com/gke-nodepool".

The `namespace` parameter is set to `dev` by default, but Nebari sets it up
as part of the environment variables so we'll pull it from there. The
`generate_name` parameter allows us to give our job a prefix and Argo will add
a suffix to ensure uniqueness. Lastly, we'll give the workflow an `entrypoint`.
This parameter needs to match with the name of the `Steps` parameter you're
using (or `DAG`).

### Workflow constructor

Let's put this all together and have a closer look.

```python
from hera.workflows import Steps, script
from hera.workflows import Workflow

@script()
def echo(message: str):
    print(message)


with Workflow(
    generate_name="hello-user",
    entrypoint="steps",
    node_selector={"eks.amazonaws.com/nodegroup": "user"},
    labels=labels,
    namespace=os.environ["ARGO_NAMESPACE"],
    ttl_strategy=ttl_strategy,
) as w:
    with Steps(name="steps"):
        echo(arguments={"message": "hello"})

w.create()
```

Workflows are essentially managing a series of tasks for us. There are two basic
mechanisms to construct these in Argo - `Steps` and `DAG`s.

For this example, we've used `Steps`. When you build your workflow with `Steps`
as a context manager as we've done here, you can add as many methods as you'd
like (for example, duplicating the call to `echo()`) and Argo will separate
out these commands into individual DAG points in a series.

For example, if I wanted to run two separate functions, it might look like this

```python
...
    with Steps(name="steps"):
        echo(arguments={"message": "hello"})
        echo(arguments={"message": "goodbye"})
```

Each step would have its own resource management and logs within Argo. You can
also tell Hera that the function calls within the `Steps` context manager
should be run in parallel.

If you'd like even more control over your workflow, for example diamond
or branching workflows, the `DAG` constructor will allow you to specify that
level of complexity.

## Beyond "Hello World"

We've proven that we can run **something** on Argo, but what about actually
running some Python code? Let's review the requirements.

We've already discussed setting the `jupyter-overrides` label which tells
Nebari to mount our home directory and the conda environments onto our Argo
pod. We will also need to use a Docker image which has conda set up and
initialized. We'll grab the Nebari Jupyter image. This has the added benefit
of bringing parity between running a code on your Nebari instance and running
on Argo.

### "Argo Assistant" code

As you've seen, we're creating quite a bit of peripheral code and we're about
to add even more. Let's bring some structure in to help us organize things.
For this, we have a little "Argo Assistant" code that will help us out.

```python
import logging
import os
import subprocess
from pathlib import Path

from hera.workflows import Container, Parameter, Steps, Workflow
from hera.workflows.models import TTLStrategy

LOGGER = logging.getLogger()

DEFAULT_TTL = 90  # seconds
DEFAULT_ARGO_NODE_TYPE = "user"
DEFAULT_K8S_SELECTOR_LABEL = "eks.amazonaws.com/nodegroup"


class NebariWorkflow(Workflow):
    """Hera Workflow object with required/reasonable default for running
    on Nebari
    """

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        if "ttl_strategy" in kwargs.keys():
            self.ttl_strategy = kwargs["ttl_strategy"]
        else:
            self.ttl_strategy = TTLStrategy(
                seconds_after_completion=DEFAULT_TTL,
                seconds_after_success=DEFAULT_TTL,
                seconds_after_failure=DEFAULT_TTL,
            )

        if "node_selector" in kwargs.keys():
            self.node_selector = kwargs["node_selector"]
        else:
            self.node_selector = {DEFAULT_K8S_SELECTOR_LABEL: DEFAULT_ARGO_NODE_TYPE}

        self.namespace = os.environ["ARGO_NAMESPACE"]

        self.labels = {
            "workflows.argoproj.io/creator-preferred-username": sanitize_label(username),
            'jupyterflow-override': 'true',
        }


def create_conda_command(
    script_path,
    conda_env,
    stdout_path="stdout.txt",
):
    """Workflows need to be submitted via a bash command that runs a
    python script. This function creates a conda run command that
    will run a script from a given location using a given conda
    environment.

    Parameters
    ----------
    script_path: str
        Path to the python script (including extension) to be run on Argo
    conda_env: str
        Conda environment name in which to the run the `script_path`
    stdout_path: str
        Local Nebari path (for your user) for standard output from
        the given script. Defaults to `stdout.txt`.

    Returns
    -------
    String bash command
    """

    conda_command = f'conda run -n {conda_env} python "{script_path}" >> {stdout_path}'
    return conda_command


def create_bash_container(name="bash-container"):
    """Create a workflow container that is able to receive bash commands"""
    bash_container = Container(
        name="bash-container",
        image="thiswilloverridden",
        inputs=[
            Parameter(name="bash_command")
        ],  # inform argo that an input called bash_command is coming
        command=["bash", "-c"],
        args=["{{inputs.parameters.bash_command}}"],  # use the input parameter
    )
    return bash_container


def submit_argo_script(script_path, conda_env, stdout_path="stdout.txt"):
    """Submit a script to be run via Argo in a specific environment"""
    validated = validate_submission(script_path, conda_env)

    if not validated:
        raise RuntimeError("Unable to submit Argo workflow")

    conda_command = create_conda_command(script_path, conda_env, stdout_path)

    LOGGER.debug("Submitting command {conda_command} to Argo")

    with NebariWorkflow(
        generate_name="workflow-name-",
        entrypoint="steps",
    ) as w:
        bash_container = create_bash_container()
        with Steps(
            name="steps",  # must match Workflow entrypoint
            annotations={"go": "here"},
        ):
            bash_container(
                name="step-name",
                arguments=[Parameter(name="bash_command", value=conda_command)],
            )

    workflow = w.create()
    return workflow

```

Next, you'll need to create a python script and a conda environment. Then to
submit the workflow to Argo you would run the high level command:

```
path = '/path/to/pyfile.py'
nebari_conda_env = 'analyst-workflow-env'
submit_argo_script(path, nebari_conda_env)
```

Now you can go to the Argo UI and monitor progress!

## Conclusion

Well done! You've learned how to submit a python workflow to Argo and have a
few extra tools to help you along.
