---
id: creating-cds-dashboard
title: How to create a ContainDS dashboard on Nebari
---

# What is a dashboard?

Analyzing data provides us with insights. A dashboard stitches these insights together into a meaningful story.

Different tools and technologies can be used to create and deploy a dashboard. In this tutorial
we will be building a simple dashboard on _Nebari_ which can be shared with other users and groups via
[ContainDS Dashboards](https://cdsdashboards.readthedocs.io/en/stable/) (CDS Dashboards).

Currently, this dash-boarding solution supports `Panel`, `Bokeh`, `Voila`, `Streamlit`, and `Plotly`.

# Let's get our hands dirty

- Create a notebook in your JupyterLab environment on Nebari with a name of your choice
- Select an environment from the dropdown (eg: `dashboard`)
- Copy the below code to your notebook and execute.

##### Creating insights using `holoviews`, `panel` and `bokeh` as backend

```python
# necessary imports
import numpy as np
import pandas as pd
import holoviews as hv
from bokeh.models import HoverTool
from holoviews import opts
import panel as pn
hv.extension('bokeh')

# creating a sample dataset
data_trees = { 'specie_name': ['live oak', 'pecan', 'bur oak', 'cedar elm'],
               'avg_diameter_inch': [20, 30, 40, 35]
             }

df = pd.DataFrame(data_trees)

# simple curve/line and bar plots
plot_bar = hv.Bars(df, 'specie_name', 'avg_diameter_inch')
plot_curve = hv.Curve(df)

# creating hover tooltip
hover = HoverTool(tooltips=[("avg diameter", "@avg_diameter_inch"),
                            ("specie", "@specie_name")])
# plot customization
combine_plot = plot_bar.opts(tools=[hover]) + plot_curve.opts(line_dash='dashed')

# creating simple dashboard using panel
dashboard = pn.template.BootstrapTemplate(
           site="About 🌳",
           title="Specie info and more",
           main=[combine_plot]
           )
dashboard.servable()
```

# Step-by-step guide for building a CDS dashboard

Let's use CDS and publish this notebook, visit [CDS docs](https://cdsdashboards.readthedocs.io/en/stable/) for more details.
Click on the top left tab navigate to `file` > `Hub Control Panel` > `Dashboards`. Click on the button `New Dashboard`.

> Create new dashboard steps

- Add a dashboard name (mandatory)
- Add a short description (mandatory)
- Customise user permission (optional)
- Select the file source, for this tutorial we will select `Jupyter Tree` (mandatory)

> Details section

- Select the framework of your choice, here we will select `panel` (mandatory)
- Select the conda env, make sure it is same as jupyter notebook environment (mandatory)
- In the relative path copy your notebook's path (example: `demo-dashboards/tutorial/insights.ipynb`) (mandatory)
- Click on the save button
- Select the instance size and save, a message should appear stating -> **The dashboard is starting up**

![CDS dashboard configuration](/img/cds_details.png)

# Conclusion

We have a working dashboard now 🎉 sharing the link is super simple, copy-paste the URL and voilà.
It is fast and customisable to your need.

![Our tutorial dashboard](/img/dashboard.png)
