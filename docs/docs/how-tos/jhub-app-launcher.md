---
id: jhub-app-launcher
title: JHub App Launcher with Nebari
description: Using JHub App Launcher with Nebari
---

# JHub App Launcher with Nebari

[JHub App Launcher](https://argoproj.github.io/workflows) is a generalized server launcher
for JupyterHub. You can use it create and share apps using various frameworks like:

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
