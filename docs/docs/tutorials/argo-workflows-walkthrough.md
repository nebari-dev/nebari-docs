---
id: argo-workflows-walkthrough
title: Argo Workflows Walkthrough
description: A walk through several example workflows
---

# Argo Workflows Walkthrough

## Introduction

Using a workflow manager can help you automate ETL pipelines, schedule regular
analysis, or just chain together a sequence of functions. Argo is available on
Nebari for workflow management. If you haven't already checked out the
[introductory documentation on Argo](/how-tos/using-argo.md), head over to that
[doc page](/how-tos/using-argo.md) and take a look!

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

```
from hera.shared import global_config
import os

global_config_host = f"https://{os.environ['ARGO_SERVER'].rsplit(':')[0]}{os.environ['ARGO_BASE_HREF']}/"
global_config.host = global_config_host
global_config.token = os.environ['ARGO_TOKEN']
```

### Workflow Labels

Next, we'll set some labels on our workflows. Because Nebari uses a service
account token by default, we need to tell Argo which user we are. We also need
to tell Argo to use the Nebari Workflow Controller so that we have access to
our Nebari file system and conda environments from within the Argo pod
([more information](/how-tos/using-argo#access-your-nebari-environments-and-file-system-while-on-an-argo-pod-beta)).

The workflow labels must be hexidecimal ASCII while the usernames have no such
constraint so we have a helper function `sanitize_labels` to ensure that our
label is valid for Argo.

```
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

Note that the Argo UI will only show the workflow details until the
`TTLStrategy` time has elapsed so make sure you have enough time to evaluate
logs, etc. before those details are removed.

```
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

_Workflow constructor_

Let's put this all together and have a closer look.

```
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

```
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

## Next Steps

Now that you've worked through the basics of an Argo workflow, and have some
understanding of the individual parts that make up a workflow, you can move on
to more complex usecases.

Check out the [Advanced Argo Usage](/tutorials/advanced-argo-usage.md) tutorial
next.
