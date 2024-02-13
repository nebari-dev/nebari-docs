---
id: create-dashboard
title: Create, deploy, and share dashboards and apps
description: Quickly build and deploy a panel dashboard in Nebari
---

# Create, deploy, and share dashboards and apps

Analyzing data with visualizations provides insights, and a dashboard stitches these insights into a meaningful story. There are many great open source dashboards tools out there that you can use to organize and display your data in an engaging and digestible way.

In this tutorial, you'll learn how to create a new dashboard with [Panel](https://panel.holoviz.org/) within Nebari. You'll also learn how to share your newly created dashboard with other users using JHub App Launcher.

:::important
JHub App Launcher was added in Nebari version `2024.1.1`.
Until version `2023.7.1`, Nebari used [CDS Dashboards](https://cdsdashboards.readthedocs.io/en/stable/) for dashboard sharing.
This page has instructions for both tools.
Since, CDS Dashboards is deprecated, the documentation will be removed soon.
:::

## Supported frameworks

This tutorials demonstrates a Panel dashboard built with HoloViews and Bokeh as the backend, but Nebari supports several other frameworks:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="jhub-apps" label="JHub App Launcher" default>

JHub App launcher supports `Panel`, `Bokeh`, `Streamlit`, `Plotly Dash`, `Voila`, `Gradio`, `JupyterLab`, `Generic Python Command`.

</TabItem>
<TabItem value="cds-dashboards" label="CDS Dashboards">

CDS Dashboards supports `Panel`, `Bokeh`, `Voila`, `Streamlit`, and `Plotly`.

</TabItem>
</Tabs>

## Create the dashboard

### 1. Create environment and notebook

[Create a new environment in conda-store][create-env] for your work with the libraries needed to run your notebook.

<Tabs>
<TabItem value="jhub-apps" label="JHub App Launcher" default>

To use JHub Apps, your environment must include `jhub-apps` and the corresponding dashboard/app creation framework, in addition to other libraries required in the notebook.

Hence, for this tutorial:

```yaml
- pandas
- panel
- holoviews
- bokeh
- jupyter_bokeh
- jhub-apps
```

</TabItem>
<TabItem value="cds-dashboards" label="CDS Dashboards">

When deploying an app via CDS Dashboards, you need to have `cdsdashboards-singleuser` installed in your environment. This allows your environment to show up on the environment options menu when creating your app.

Furthermore, with each framework, you will need to make sure that the specific framework you are deploying is installed. You will need to install `streamlit` for a streamlit app, `panel` for a panel app, etc.

Finally, when creating your app, make note of the packages you are using to run the app locally. These will also need to be added to your environment you will be using to create the dashboard.

For this tutorial:

```yaml
- pandas
- panel
- holoviews
- bokeh
- jupyter_bokeh
- cdsdashboards-singleuser>=0.6.2
```
</TabItem>
</Tabs>

[Launch JupyterLab in Nebari][login-keycloak], create a new Jupyter Notebook with a meaningful name (such as `panel-trees-dashboard.ipynb`), and select the environment your created for this notebook from the `select kernel` dropdown (this dropdown menu is located in the top right corner of your notebook).

### 2. Create a panel dashboard

Copy the code below into a `code` cell of your notebook:

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
          ).servable()
```

You can run all the cells in your notebook and view the Panel dashboard using the "Preview with Panel" button in the notebook toolbar:

![`About 🌳 - Species and more` dashboard screenshot displaying a bar and line chart of avg_diameter_inch vs species_name](/img/tutorials/trees-dashboard-example.png)

This interactive feature of Panel makes it possible to rapidly prototype and iterate on dashboards.
Feel free to add more plots or different styles to your plots!

## Deploy the dashboard with JHub App Launcher

1. In the Nebari Home Page (in the top navigation, `Nebari` -> `Hub Control Panel`) click on **"Create App"** to create a new web application for your dashboard.
2. In the app creation interface, enter or select the following:
   * **Display Name** - Provide meaningful name for your application
   * **Description (optional)** - Add addition information about the application
   * **Thumbnail (optional)** - Choose a meaningful thumbnail for your application. The default thumbnail is the application framework's logo.
   * **Framework** - Select the framework used by your application. For this tutorial, select Panel.
   * **Filepath** - Path (from root in JupyterLab) to your application code file. For this tutorial, path to the Jupyter Notebook.
   * **Conda Environment** - Same [environment](#1-create-environment-and-notebook) used while developing your notebook/script which has `jhub-apps` and the corresponding framework.
   * **Spawner profile** - Instance type (i.e. machines with CPU/RAM/GPU resources) required for running your application.
   * **Allow Public Access** - Toggle to share the application with your team.

  <p align="center">
    <img src="/img/tutorials/jhub-apps-create-new-app.png" width="50%"/>
  </p>

3. Click on **Submit**. JHub App Launcher deploy your app (which can take a few minutes to complete) and automatically redirect you to it.

Your dashboard app will be available in the Nebari Home page, under "My Apps". If you allowed public access, it will be available under "Shared Apps" for your team.

## Deploy and share the dashboard with CDS Dashboards (Nebari v2023.7.1 or earlier)

In this section, you'll use CDS Dashboards to publish and share your newly created `panel` dashboard.

:::warning
CDS Dashboards has been deprecated in 2023.9.1. Nebari 2023.7.1 is the last release that support CDS Dashboards.
:::

To begin, click on the top left tab navigate to `File` -> `Hub Control Panel` -> `Dashboards`.

![JupyterLab expanded File menu - Hub Control Panel is highlighted with a surrounding purple box](/img/tutorials/nebari_jupyterlab_file_menu.png)

Click on the button `New Dashboard`. You will now be presented with a new window where you'll need to provide additional details for your dashboard (see image below for reference).

![CDS dashboard configuration screenshot](/img/tutorials/window_dashboard_configuration_example.png)

1. Give your dashboard a name, for example, `Trees`. This name will be the name of your shareable dashboard, so make sure to give this a meaningful name.
2. Add a short description, for example, `Insights and more`.
3. Set the correct user-access permission (optional). This setting allows you to share your dashboard with all the other users on your Nebari deployment or select specific users.
4. Select the code source for your panel. For example, in this tutorial you created a new notebook `panel-trees-dashboard.ipynb`, but you can also point to a Git repository.
5. Select the appropriate framework for your dashboard, in this example you'll have to select: `panel`.
6. Select the `conda` environment for your dashboard, make sure it is same as the one you previously selected as your Jupyter notebook environment
7. In the `relative path` box, copy your notebook's path (example: `demo-dashboards/tutorial/panel-trees-dashboard.ipynb`).
8. Once you have provided all the details above click on the save button.

You will then be redirected to a new window where you will be able to select the compute resources for your dashboard.

:::warning
The available compute instances might vary depending on the configuration and cloud provider of your Nebari instance.

Also, the **best instance type** for your dashboard will depend on your specific use case.
:::

An example of available compute instances available within a Nebari instance is shown in the following image:
![Nebari Instance selection UI screenshot for the Trees Dashboard. The radio button for the `Small instance - Stable environment with 1 CPU / 4 GB ram is selected](/img/tutorials/window_nebari_select_instance_type.png)

For this particular tutorial, a small instance should be enough. Once you have made a selection you can click on the **Save** button at the bottom of the window.
This will trigger the deployment of your dashboard, and you'll be presented with a screen displaying the of this process.

![Nebari window displaying the progress of the Trees' dashboard deployment. This window displays a message reading "The dashboard is starting up"](/img/tutorials/nebari_window_dashboard_starting_up.png)

If there are no errors encountered during this process, you will be automatically redirected to the dashboard!

## Manage apps in Nebari

<Tabs>
<TabItem value="jhub-apps" label="JHub App Launcher" default>

All applications are available on the Nebari home page. From JupyterLAb, you can click on the `Nebari` menu tab and select `Hub Control Panel` to go to the home page.

To manage an application, click on the three dots in the top right of the corresponding application card where you can:

* **Start** the app is it's not running
* **Stop**  a running app
* **Edit** the application details
* **Delete** the app

![](/img/tutorials/jhub-apps-manage-app.png)

</TabItem>
<TabItem value="cds-dashboards" label="CDS Dashboards (Nebari v2023.7.1 or earlier)">

In the Nebari home page (from JupyterLab, click on the `File` menu tab, then select `Hub Control Panel` to go to the home page), click on `Dashboards` in the top navigation bar.

This will redirect you to Nebari's Dashboard main panel.
Here, you can find the URL of your dashboards which can be shared with other users, as well as manage the status and deployment of your dashboards:

- To stop the dashboard server click on the `stop` button.
- To start the dashboard server click on the `start` button.
- To delete the server and the resources allocated click on the `delete` button.
- To make any changes to the existing CDS options, click on the `edit` button.

![Nebari dashboard panel - showing a number of dashboards with corresponding start/delete buttons, as well as several URLs under the "Dashboards from others heading"](/img/tutorials/nebari_dashboard_panel.png).

</TabItem>
</Tabs>

:::important
While the dashboard is running, it will continue to consume resources.
You should be mindful of the incurring ongoing costs while the dashboard is running, and stop it when not needed.
:::

---

Dashboards and apps can be a very handy tool to share information and insights with colleagues and external customers or collaborators. You can use this basic dashboard to build more complex dashboards, add more dynamic features, and start sharing data insights with others.

<!-- Internal links -->

[login-keycloak]: /docs/tutorials/login-keycloak
[create-env]: /docs/tutorials/creating-new-environments
