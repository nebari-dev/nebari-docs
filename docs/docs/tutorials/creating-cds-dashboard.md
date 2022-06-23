---
id: creating-cds-dashboard
title: Create and Deploy a dashboard
---

# Create a dashboard with Panel and Deploy it with CDS Dashboards

## What is a dashboard?

Analyzing data provides us with insights. A dashboard stitches these insights together into a meaningful story.

Different tools and technologies can be used to create and deploy a dashboard. In this tutorial
we will be building a simple dashboard on _Nebari_ which can be shared with other users and groups via
[ContainDS Dashboards](https://cdsdashboards.readthedocs.io/en/stable/) (CDS Dashboards).

Currently, CDS Dashboards supports `Panel`, `Bokeh`, `Voila`, `Streamlit`, and `Plotly`.
We will be using `Panel` in this tutorial to create a dashboard.

## Creating the dashboard

_Let's get our hands dirty_

- Create a notebook in your JupyterLab environment on Nebari with a name of your choice
- Select an environment from the select kernel dropdown (located on the top right: e.g. `dashboard`)
- Copy the code below to your notebook.

Our dashboard will be creating insights using `holoviews` and `panel` with `bokeh` as backend.

```python
import pandas as pd
import holoviews as hv
from bokeh.models import HoverTool
import panel as pn
hv.extension('bokeh')
pn.extension()

# creating a sample dataset
data_trees = { 'species_name': ['live oak', 'pecan', 'bur oak', 'cedar elm'],
               'avg_diameter_inch': [20, 30, 40, 35]
             }

df = pd.DataFrame(data_trees)

# simple curve/line and bar plots
plot_bar = hv.Bars(df, 'species_name', 'avg_diameter_inch')
plot_curve = hv.Curve(df)

# creating hover tooltip
hover = HoverTool(tooltips=[("avg diameter", "@avg_diameter_inch"),
                            ("species", "@species_name")])
# plot customization
combine_plot = plot_bar.opts(tools=[hover]) + plot_curve.opts(line_dash='dashed')

# creating simple dashboard using panel
dashboard = pn.template.BootstrapTemplate(
           site="About 🌳",
           title="Species and more",
           main=[combine_plot]
           )
dashboard.servable()
```

We can now execute the notebook and view our Panel dashboard as output right inside the notebook. This feature Panel makes it very easy to rapidly prototype new dashboards. Once we are happy with what we've created, we can move on to deploying it with CDS Dashboards.

## Deploying with CDS dashboards

Now we'll use CDS Dashboards and publish this notebook. You can visit [CDS Dashboards docs](https://cdsdashboards.readthedocs.io/en/stable/) for more details on this great package.

To begin, click on the top left tab navigate to `File` > `Hub Control Panel` > `Dashboards`. Click on the button `New Dashboard`.

### Steps to create new dashboard and publish

- Add a dashboard name
- Add a short description
- Customise user permission (optional)
- Select the file source, for this tutorial we will select `Jupyter Tree`
- Details section
  - Select the framework of your choice, here we will select `panel`
  - Select the conda environment, make sure it is same as Jupyter notebook environment
  - In the `relative path` box, copy your notebook's path (example: `demo-dashboards/tutorial/insights.ipynb`)
  - Click on the save button
  - Select the instance size and save again, a message should appear stating: **The dashboard is starting up**

![CDS dashboard configuration](/img/cds_details.png)

![The dashboard is starting up](/img/dashboard_starting_up.png)

### More on instance selection and publishing dashboard

When we publish our dashboard, compute and storage resources are allocated. The selection of right set of resources
would differ based on use-case. Currently, _Nebari_ offers four instance types namely `Small`, `Medium`, `Large` and `Large GPU`.
If required the instances could be scaled up/down manually (auto-scaling is not supported).

![Instance selection](/img/select_instance.png)

Once the instance is selected, the server is spun. If there are no errors encountered during this process, we will
be automatically redirected to the dashboard.

:::note
- If the dashboard servers are not shut down manually, it will continue to consume resources and incur additional cost.
:::

### Where to find published dashboard inside Nebari?

Head to `File` > `Hub Control Panel` > `Dashboards` which lists all the dashboards published by you and your colleagues

- In order to stop the dashboard server click on the `stop` button.
- To start the dashboard server click on the `start` button.
- To delete the server and the resources allocated click on the `delete` button.
- To make any changes to the existing CDS options, click on the `edit` button.

![All the published dashboards](/img/all_dashboards.png)

# Conclusion

We have a working dashboard now 🎉  
All that is left to do is to copy the URL and send it to your colleagues!

![Our tutorial dashboard](/img/dashboard.png)
