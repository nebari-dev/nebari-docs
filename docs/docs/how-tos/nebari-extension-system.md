---
id: nebari-extension-system
title: Nebari Extension System
description: An overview of the pluggy extension system for Nebari
---

## Introduction

This guide is to help developers extend and modify the behavior of
nebari. We leverage the plugin system
[pluggy](https://pluggy.readthedocs.io/en/stable/) to enable easy
extensibility. Currently Nebari supports:

 - overriding a given stages in a deployment
 - adding additional stages before, after and between existing stages 
 - arbitrary subcommands

We maintain an [examples
repository](https://github.com/nebari-dev/nebari-plugin-examples)
which contains up to date usable examples.

## Installing a plugin

Registering a plugin should be easy for the end user. Pluggins are
either installed into your existing environment e.g.

```shell
pip install my-nebari-plugin
```

Alternatively if you only want to temporarily add an extension.

:::note 
`--import-plugin` does not work for loading subcommands due to
cli already being constructed before plugin imports take place.
:::

```shell
nebari --import-plugin path/to/plugin.py <command> ...
nebari --import-plugin import.module.plugin.path <command> ...
```

## Developing an extension

The most important step to developing a plugin is ensuring that the
setuptools entrypoint is set.

```toml:pyproject.toml

...

[project.entry-points.nebari]
my-subcommand = "path.to.subcommand.module"

...

```

Adding this one line to your `pyproject.toml` will ensure that upon
installation of the package the nebari plugins are registered.

### Subcommands

Nebari exposes a hook `nebari_subcommand` which exposes the
[typer](https://github.com/tiangolo/typer) cli instance. This allows
the developer to attach and arbitrary number of subcommands.

```python
from nebari.hookspecs import hookimpl

import typer


@hookimpl
def nebari_subcommand(cli):
    @cli.command()
    def hello(
        name: str = typer.Option(
            "Nebari", help="Who to say hello to"
        )
    ):
        print(f"Hello {name}")
```

There is a dedicated working example in [nebari-plugin-examples](https://github.com/nebari-dev/nebari-plugin-examples/tree/main/examples/nebari_subcommand_hello_world).

### Stages

Nebari exposes a hook `nebari_stage` which uses the `NebariStage`
class. The `NebriStage` exposes `render`, `deploy`, `destroy` as
arbitrary functions called. See below for a complete example.

Nebari decides the order of stages based on two things the `name: str`
attribute and `priority: int` attribute. The rules are as follows:
 - stages are ordered by `priority`
 - stages which have the same `name` the one with highest priority
   number is chosen.

```python
import contextlib
import os
from typing import Dict, Any

from nebari.hookspecs import hookimpl, NebariStage


class HelloWorldStage(NebariStage):
    name = "hello_world"
    priority = 100

    def render(self):
        return {
            "hello_world.txt": "File that says hello world"
        }

    @contextlib.contextmanager
    def deploy(self, stage_outputs: Dict[str, Dict[str, Any]]):
        print("I ran deploy")
        # set environment variables for stages that run after
        os.environ['HELLO'] = 'WORLD'
        # set output state for future stages to use
        stage_outputs[self.name] = {'hello': 'world'}
        yield
        # cleanup after deployment (rarely needed)
        os.environ.pop('HELLO')

    def check(self, stage_outputs: Dict[str, Dict[str, Any]]):
        if 'HELLO' not in os.environ:
            raise ValueError('stage did not deploy successfully since HELLO environment variable not set')

    @contextlib.contextmanager
    def destroy(self, stage_outputs: Dict[str, Dict[str, Any]], status: Dict[str, bool]):
        print('faking to destroy things for hello world stage')
        yield


@hookimpl
def nebari_stage():
    return [HelloWorldStage]
```

There is a dedicated working example in [nebari-plugin-examples](https://github.com/nebari-dev/nebari-plugin-examples/tree/main/examples/nebari_stage_hello_world).
