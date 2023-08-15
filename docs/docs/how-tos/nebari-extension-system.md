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



