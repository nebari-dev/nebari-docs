---
id: jhub-app-launcher
title: JHub App Launcher with Nebari
description: Using JHub App Launcher with Nebari
---

# JHub App Launcher with Nebari

[JHub App Launcher](https://github.com/nebari-dev/jhub-apps) is a generalized server launcher
for JupyterHub. You can use it to create and share apps using various frameworks like:

- Panel
- Bokeh
- Streamlit
- Plotly Dash
- Voila
- Gradio
- JupyterLab
- Generic Python Command

## Installation

JHub App Launcher can be enabled on Nebari by adding the following in the
`nebari-config.yml`:

```yaml
jhub_apps:
  enabled: true
```

:::note
JHub App Launcher is enabled by default in the Nebari after version
[2023.12.1](https://github.com/nebari-dev/nebari/releases/tag/2023.12.1).
:::

## Environment

To be able to create apps using the JHub App Launcher in Nebari,
you need to have `jhub-apps` and the corresponding framework (for example, `panel`)
in your conda-store generated conda environment.
