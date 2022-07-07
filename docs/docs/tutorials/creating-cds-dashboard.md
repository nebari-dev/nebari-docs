---
id: creating-cds-dashboard
title: Create and deploy a panel dashboard
description: Quickly build and deploy a panel and CDS Dashboards
---

# Create and deploy a dashboard with `Panel` and `CDS Dashboards`

## Introduction

Analyzing data provides insights, and a dashboard stitches these insights into a meaningful story. Fortunately, there are many great open source dashboards tools out there that you can use to organize and display your data in an engaging and digestible way.

In this tutorial, you'll learn how to create a new dashboard with [Panel](https://panel.holoviz.org/) within Nebari. You'll also learn how to share your newly created dashboard with other users with [ContainDS Dashboards](https://cdsdashboards.readthedocs.io/en/stable/) (CDS Dashboards).

:::note
Currently, CDS Dashboards supports `Panel`, `Bokeh`, `Voila`, `Streamlit`, and `Plotly`.
For this tutorial, you'll use `Holoviews` and `Panel` with `Bokeh` as backend.
:::

## Step 1- Creating the dashboard

_Let's get our hands dirty_

1. Once in Nebari, create a new Jupyter notebook. Make sure to assign this a meaningful name, such as `panel-trees-dashboard.ipynb`.
2. Select an environment from the `select kernel` dropdown (this dropdown menu is located in the top right corner of your notebook).
3. Copy the code below into a `code` cell of your notebook.

```python title="panel-trees-dashboard.ipynb"
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

# adding curve/line and bar plots
plot_bar = hv.Bars(df, 'species_name', 'avg_diameter_inch')
plot_curve = hv.Curve(df)

# creating hover tooltip
hover = HoverTool(tooltips=[("avg diameter", "@avg_diameter_inch"),
                            ("species", "@species_name")])
# plot customization
combine_plot = plot_bar.opts(tools=[hover]) + plot_curve.opts(line_dash='dashed')

# creating a dashboard using panel
dashboard = pn.template.BootstrapTemplate(
          site="About 🌳",
          title="Species and more",
          main=[combine_plot]
          )
dashboard.servable()
```

4. You can now run all the cells in your notebook and view the Panel dashboard as an output right inside the notebook.

This interactive feature of Panel makes it possible to rapidly prototype and iterate on dashboards.

![`About 🌳 - Species and more` dashboard screenshot displaying a bar and line chart of avg_diameter_inch vs species_name](/img/tutorials/trees-dashboard-example.png)

At this point, you can add more plots or different styles to your plots, or you can move forward to the deployment section of this tutorial.

## Step 2 - Deploying your `panel` dashboard with `CDS dashboards`

In this section, you'll use CDS Dashboards to publish and share your newly created `panel` dashboard.

To begin, click on the top left tab navigate to `File` > `Hub Control Panel` > `Dashboards`. Click on the button `New Dashboard`. You will now be presented with a new window where you'll need to provide additional details for your dashboard (see image below for reference).

![CDS dashboard configuration screenshot](/img/tutorials/window_dashboard_configuration_example.png)

1. Give your dashboard a name e.g. `Trees`. This name will be the name of your shareable dashboard, so make sure to give this a meaningful name.
2. Add a short description e.g. `Insights and more`
3. Set the correct user-access permission (optional). This setting allows you to share your dashboard with all the other users on your Nebari deployment or select specific users.
4. Select the code source for your panel, e.g. in this tutorial you created a new notebook `panel-trees-dashboard.ipynb`, but you can also point to a Git repository.
5. Select the appropriate framework for your dashboard, in this example you'll have to select: `panel`.
6. Select the `conda` environment for your dashboard, make sure it is same as the one you previously selected as your Jupyter notebook environment
7. In the `relative path` box, copy your notebook's path (example: `demo-dashboards/tutorial/panel-trees-dashboard.ipynb`).
8. Once you have provided all the details above click on the save button

You will then be redirected to a new window where you will be able to select the compute resources for your dashboard.

:::warning
The available compute instances might vary depending on the configuration and cloud provider of your Nebari instance.

Also, the **best instance type** for your dashboard will depend on your specific use case.
:::

An example of available compute instances available within a Nebari instance is shown in the following image:
![Nebari Instance selection UI screenshot for the Trees Dashboard. The radio button for the `Small instance - Stable environment with 1cpu / 4GB ram is selected](/img/tutorials/window_nebari_select_instance_type.png)

For this particular tutorial, a small instance should be enough. Once you have made a selection you can click on the **Save** button at the bottom of the window.
This will trigger the deployment of your dashboard, and you'll be presented with a screen displaying the of this process.

![Nebari window displaying the progress of the Trees' dashboard deployment. This window displays a message reading "The dashboard is starting up"](/img/tutorials/nebari_window_dashboard_starting_up.png)

If there are no errors encountered during this process, you will be automatically redirected to the dashboard!

:::warning
Remember that while the dashboard is running, it will continue to consume resources.
You should be mindful of the incurring ongoing costs while the dashboard is running.
:::

## Step 3 - Accessing the dashboard inside Nebari

From JupyterLab click on the `File` menu tab, then select `Hub Control Panel` > `Dashboards`.

![JupyterLab expanded File menu - Hub Control Panel is highlighted with a surrounding purple box](/img/tutorials/nebari_jupyterlab_file_menu.png)

This will redirect you to the Nebari's Dashboard main panel.
Here, you can find the URL of your dashboards which can be shared with other users as well as managing the status and deployment of your dashboards:

- To stop the dashboard server click on the `stop` button.
- To start the dashboard server click on the `start` button.
- To delete the server and the resources allocated click on the `delete` button.
- To make any changes to the existing CDS options, click on the `edit` button.

![Nebari dashboard panel - showing a number of dashboards with corresponding start/delete buttons, as well as several URLs under the "Dashboards from others heading"](/img/tutorials/nebari_dashboard_panel.png).

## Conclusion

Dashboards can be a very handy tool to share information and insights with colleagues and external customers or collaborators.

By now you have a working, shareable dashboard 🎉 You can use this basic dashboard to build more complex dashboards, add more dynamic features, and start sharing data insights with others.
