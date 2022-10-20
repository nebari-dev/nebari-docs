---
title: API Documentation
description: Reference to API docs
---
# API Documentation
## Table of Contents

* [qhub.tests\_deployment.constants](#qhub.tests_deployment.constants)
* [qhub.tests\_deployment](#qhub.tests_deployment)
* [qhub.tests\_deployment.test\_dask\_gateway](#qhub.tests_deployment.test_dask_gateway)
  * [dask\_gateway\_object](#qhub.tests_deployment.test_dask_gateway.dask_gateway_object)
  * [test\_dask\_gateway](#qhub.tests_deployment.test_dask_gateway.test_dask_gateway)
  * [test\_dask\_gateway\_cluster\_options](#qhub.tests_deployment.test_dask_gateway.test_dask_gateway_cluster_options)
* [qhub.tests\_deployment.utils](#qhub.tests_deployment.utils)
  * [monkeypatch\_ssl\_context](#qhub.tests_deployment.utils.monkeypatch_ssl_context)
* [qhub.tests\_deployment.test\_jupyterhub\_ssh](#qhub.tests_deployment.test_jupyterhub_ssh)
  * [paramiko\_object](#qhub.tests_deployment.test_jupyterhub_ssh.paramiko_object)
* [qhub.qhub.deprecate](#qhub.qhub.deprecate)
* [qhub.qhub.version](#qhub.qhub.version)
  * [rounded\_ver\_parse](#qhub.qhub.version.rounded_ver_parse)
* [qhub.qhub.deploy](#qhub.qhub.deploy)
  * [provision\_02\_infrastructure](#qhub.qhub.deploy.provision_02_infrastructure)
* [qhub.qhub.destroy](#qhub.qhub.destroy)
* [qhub.qhub.initialize](#qhub.qhub.initialize)
* [qhub.qhub.render](#qhub.qhub.render)
  * [render\_contents](#qhub.qhub.render.render_contents)
  * [gen\_gitignore](#qhub.qhub.render.gen_gitignore)
  * [gen\_cicd](#qhub.qhub.render.gen_cicd)
  * [inspect\_files](#qhub.qhub.render.inspect_files)
  * [hash\_file](#qhub.qhub.render.hash_file)
  * [set\_env\_vars\_in\_config](#qhub.qhub.render.set_env_vars_in_config)
* [qhub.qhub.stages.input\_vars](#qhub.qhub.stages.input_vars)
* [qhub.qhub.stages.checks](#qhub.qhub.stages.checks)
* [qhub.qhub.stages](#qhub.qhub.stages)
* [qhub.qhub.stages.state\_imports](#qhub.qhub.stages.state_imports)
* [qhub.qhub.stages.tf\_objects](#qhub.qhub.stages.tf_objects)
* [qhub.qhub.constants](#qhub.qhub.constants)
* [qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.conda-store.config.conda\_store\_config](#qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.conda-store.config.conda_store_config)
* [qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.ipython.ipython\_config](#qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.ipython.ipython_config)
* [qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.jupyterhub.01-theme](#qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.jupyterhub.01-theme)
* [qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.jupyterhub.02-spawner](#qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.jupyterhub.02-spawner)
* [qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.jupyterhub.03-profiles](#qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.jupyterhub.03-profiles)
  * [base\_profile\_home\_mounts](#qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.jupyterhub.03-profiles.base_profile_home_mounts)
  * [base\_profile\_shared\_mounts](#qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.jupyterhub.03-profiles.base_profile_shared_mounts)
  * [profile\_conda\_store\_mounts](#qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.jupyterhub.03-profiles.profile_conda_store_mounts)
  * [render\_profile](#qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.jupyterhub.03-profiles.render_profile)
  * [deep\_merge](#qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.jupyterhub.03-profiles.deep_merge)
* [qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.examples.dashboard\_plotly](#qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.examples.dashboard_plotly)
* [qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.examples.dashboard\_streamlit](#qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.examples.dashboard_streamlit)
* [qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.examples.kbatch\_dask\_gateway](#qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.examples.kbatch_dask_gateway)
* [qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.jupyter.jupyter\_notebook\_config](#qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.jupyter.jupyter_notebook_config)
* [qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.dask-gateway.files.controller\_config](#qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.dask-gateway.files.controller_config)
* [qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.dask-gateway.files.gateway\_config](#qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.dask-gateway.files.gateway_config)
  * [deep\_merge](#qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.dask-gateway.files.gateway_config.deep_merge)
* [qhub.qhub.provider.git](#qhub.qhub.provider.git)
* [qhub.qhub.provider.terraform](#qhub.qhub.provider.terraform)
  * [deploy](#qhub.qhub.provider.terraform.deploy)
* [qhub.qhub.provider.oauth](#qhub.qhub.provider.oauth)
* [qhub.qhub.provider.oauth.auth0](#qhub.qhub.provider.oauth.auth0)
* [qhub.qhub.provider](#qhub.qhub.provider)
* [qhub.qhub.provider.cicd.gitlab](#qhub.qhub.provider.cicd.gitlab)
* [qhub.qhub.provider.cicd](#qhub.qhub.provider.cicd)
* [qhub.qhub.provider.cicd.common](#qhub.qhub.provider.cicd.common)
* [qhub.qhub.provider.cicd.github](#qhub.qhub.provider.cicd.github)
  * [encrypt](#qhub.qhub.provider.cicd.github.encrypt)
  * [get\_latest\_repo\_tag](#qhub.qhub.provider.cicd.github.get_latest_repo_tag)
* [qhub.qhub.provider.cicd.linter](#qhub.qhub.provider.cicd.linter)
* [qhub.qhub.provider.cloud.google\_cloud](#qhub.qhub.provider.cloud.google_cloud)
  * [kubernetes\_versions](#qhub.qhub.provider.cloud.google_cloud.kubernetes_versions)
* [qhub.qhub.provider.cloud.amazon\_web\_services](#qhub.qhub.provider.cloud.amazon_web_services)
  * [kubernetes\_versions](#qhub.qhub.provider.cloud.amazon_web_services.kubernetes_versions)
* [qhub.qhub.provider.cloud](#qhub.qhub.provider.cloud)
* [qhub.qhub.provider.cloud.commons](#qhub.qhub.provider.cloud.commons)
* [qhub.qhub.provider.cloud.digital\_ocean](#qhub.qhub.provider.cloud.digital_ocean)
  * [kubernetes\_versions](#qhub.qhub.provider.cloud.digital_ocean.kubernetes_versions)
* [qhub.qhub.provider.cloud.azure\_cloud](#qhub.qhub.provider.cloud.azure_cloud)
  * [kubernetes\_versions](#qhub.qhub.provider.cloud.azure_cloud.kubernetes_versions)
* [qhub.qhub.provider.dns](#qhub.qhub.provider.dns)
* [qhub.qhub.provider.dns.cloudflare](#qhub.qhub.provider.dns.cloudflare)
* [qhub.qhub](#qhub.qhub)
* [qhub.qhub.cli.support](#qhub.qhub.cli.support)
* [qhub.qhub.cli.deploy](#qhub.qhub.cli.deploy)
* [qhub.qhub.cli.\_init](#qhub.qhub.cli._init)
  * [handle\_init](#qhub.qhub.cli._init.handle_init)
  * [check\_cloud\_provider\_creds](#qhub.qhub.cli._init.check_cloud_provider_creds)
  * [check\_auth\_provider\_creds](#qhub.qhub.cli._init.check_auth_provider_creds)
  * [check\_project\_name](#qhub.qhub.cli._init.check_project_name)
  * [guided\_init\_wizard](#qhub.qhub.cli._init.guided_init_wizard)
* [qhub.qhub.cli.destroy](#qhub.qhub.cli.destroy)
* [qhub.qhub.cli.initialize](#qhub.qhub.cli.initialize)
* [qhub.qhub.cli.render](#qhub.qhub.cli.render)
* [qhub.qhub.cli](#qhub.qhub.cli)
* [qhub.qhub.cli.upgrade](#qhub.qhub.cli.upgrade)
* [qhub.qhub.cli.validate](#qhub.qhub.cli.validate)
* [qhub.qhub.cli.\_keycloak](#qhub.qhub.cli._keycloak)
  * [add\_user](#qhub.qhub.cli._keycloak.add_user)
  * [list\_users](#qhub.qhub.cli._keycloak.list_users)
* [qhub.qhub.cli.keycloak](#qhub.qhub.cli.keycloak)
* [qhub.qhub.cli.cost](#qhub.qhub.cli.cost)
* [qhub.qhub.cli.main](#qhub.qhub.cli.main)
  * [OrderCommands](#qhub.qhub.cli.main.OrderCommands)
    * [list\_commands](#qhub.qhub.cli.main.OrderCommands.list_commands)
  * [init](#qhub.qhub.cli.main.init)
  * [validate](#qhub.qhub.cli.main.validate)
  * [render](#qhub.qhub.cli.main.render)
  * [deploy](#qhub.qhub.cli.main.deploy)
  * [destroy](#qhub.qhub.cli.main.destroy)
  * [cost](#qhub.qhub.cli.main.cost)
  * [upgrade](#qhub.qhub.cli.main.upgrade)
  * [support](#qhub.qhub.cli.main.support)
* [qhub.qhub.upgrade](#qhub.qhub.upgrade)
  * [UpgradeStep](#qhub.qhub.upgrade.UpgradeStep)
    * [upgrade](#qhub.qhub.upgrade.UpgradeStep.upgrade)
    * [upgrade\_step](#qhub.qhub.upgrade.UpgradeStep.upgrade_step)
* [qhub.qhub.utils](#qhub.qhub.utils)
  * [run\_subprocess\_cmd](#qhub.qhub.utils.run_subprocess_cmd)
  * [load\_yaml](#qhub.qhub.utils.load_yaml)
  * [modified\_environ](#qhub.qhub.utils.modified_environ)
  * [deep\_merge](#qhub.qhub.utils.deep_merge)
  * [set\_docker\_image\_tag](#qhub.qhub.utils.set_docker_image_tag)
  * [set\_qhub\_dask\_version](#qhub.qhub.utils.set_qhub_dask_version)
* [qhub.qhub.keycloak](#qhub.qhub.keycloak)
* [qhub.qhub.cost](#qhub.qhub.cost)
  * [infracost\_diff](#qhub.qhub.cost.infracost_diff)
  * [infracost\_report](#qhub.qhub.cost.infracost_report)
* [qhub.qhub.\_\_main\_\_](#qhub.qhub.__main__)
* [qhub.qhub.schema](#qhub.qhub.schema)
  * [Profiles](#qhub.qhub.schema.Profiles)
    * [check\_default](#qhub.qhub.schema.Profiles.check_default)
  * [Main](#qhub.qhub.schema.Main)
    * [check\_default](#qhub.qhub.schema.Main.check_default)
  * [is\_version\_accepted](#qhub.qhub.schema.is_version_accepted)
* [qhub.tests.conftest](#qhub.tests.conftest)
  * [setup\_fixture](#qhub.tests.conftest.setup_fixture)
* [qhub.tests.test\_upgrade](#qhub.tests.test_upgrade)
* [qhub.tests](#qhub.tests)
* [qhub.tests.test\_schema](#qhub.tests.test_schema)
* [qhub.tests.scripts.minikube-loadbalancer-ip](#qhub.tests.scripts.minikube-loadbalancer-ip)
* [qhub.tests.test\_commons](#qhub.tests.test_commons)
* [qhub.tests.test\_render](#qhub.tests.test_render)
* [qhub.tests.test\_init](#qhub.tests.test_init)
* [qhub.tests.test\_links](#qhub.tests.test_links)
* [qhub.docs.conf](#qhub.docs.conf)
* [qhub.docs.ext.substitute](#qhub.docs.ext.substitute)
  * [dosubs](#qhub.docs.ext.substitute.dosubs)
* [qhub.scripts.aws-force-destroy](#qhub.scripts.aws-force-destroy)
* [qhub.scripts.keycloak-export](#qhub.scripts.keycloak-export)
* [qhub.noxfile](#qhub.noxfile)

<a id="qhub.tests_deployment.constants"></a>

### qhub.tests\_deployment.constants

<a id="qhub.tests_deployment"></a>

### qhub.tests\_deployment

<a id="qhub.tests_deployment.test_dask_gateway"></a>

### qhub.tests\_deployment.test\_dask\_gateway

<a id="qhub.tests_deployment.test_dask_gateway.dask_gateway_object"></a>

#### dask\_gateway\_object

```python
@pytest.fixture
def dask_gateway_object()
```

Connects to Dask Gateway cluster from outside the cluster.

<a id="qhub.tests_deployment.test_dask_gateway.test_dask_gateway"></a>

#### test\_dask\_gateway

```python
def test_dask_gateway(dask_gateway_object)
```

This test checks if we're able to connect to dask gateway.

<a id="qhub.tests_deployment.test_dask_gateway.test_dask_gateway_cluster_options"></a>

#### test\_dask\_gateway\_cluster\_options

```python
def test_dask_gateway_cluster_options(dask_gateway_object)
```

Tests Dask Gateway's cluster options.

<a id="qhub.tests_deployment.utils"></a>

### qhub.tests\_deployment.utils

<a id="qhub.tests_deployment.utils.monkeypatch_ssl_context"></a>

#### monkeypatch\_ssl\_context

```python
def monkeypatch_ssl_context()
```

This is a workaround monkeypatch to disable ssl checking to avoid SSL
failures.
TODO: A better way to do this would be adding the Traefik's default certificate's
CA public key to the trusted certificate authorities.

<a id="qhub.tests_deployment.test_jupyterhub_ssh"></a>

### qhub.tests\_deployment.test\_jupyterhub\_ssh

<a id="qhub.tests_deployment.test_jupyterhub_ssh.paramiko_object"></a>

#### paramiko\_object

```python
@pytest.fixture
def paramiko_object()
```

Connects to JupyterHub ssh cluster from outside the cluster.

<a id="qhub.qhub.deprecate"></a>

### qhub.qhub.deprecate

<a id="qhub.qhub.version"></a>

### qhub.qhub.version

a backport for the qhub version references

<a id="qhub.qhub.version.rounded_ver_parse"></a>

#### rounded\_ver\_parse

```python
def rounded_ver_parse(versionstr)
```

Take a package version string and return an int tuple of only (major,minor,patch),
ignoring and post/dev etc.

So:
rounded_ver_parse("0.1.2") returns (0,1,2)
rounded_ver_parse("0.1.2.dev65+g2de53174") returns (0,1,2)
rounded_ver_parse("0.1") returns (0,1,0)

<a id="qhub.qhub.deploy"></a>

### qhub.qhub.deploy

<a id="qhub.qhub.deploy.provision_02_infrastructure"></a>

#### provision\_02\_infrastructure

```python
def provision_02_infrastructure(stage_outputs, config, disable_checks=False)
```

Generalized method to provision infrastructure

After successful deployment the following properties are set on
`stage_outputs[directory]`.
  - `kubernetes_credentials` which are sufficient credentials to
    connect with the kubernetes provider
  - `kubeconfig_filename` which is a path to a kubeconfig that can
    be used to connect to a kubernetes cluster
  - at least one node running such that resources in the
    node_group.general can be scheduled

At a high level this stage is expected to provision a kubernetes
cluster on a given provider.

<a id="qhub.qhub.destroy"></a>

### qhub.qhub.destroy

<a id="qhub.qhub.initialize"></a>

### qhub.qhub.initialize

<a id="qhub.qhub.render"></a>

### qhub.qhub.render

<a id="qhub.qhub.render.render_contents"></a>

#### render\_contents

```python
def render_contents(config: Dict)
```

Dynamically generated contents from QHub configuration

<a id="qhub.qhub.render.gen_gitignore"></a>

#### gen\_gitignore

```python
def gen_gitignore(config)
```

Generate `.gitignore` file.
Add files as needed.

<a id="qhub.qhub.render.gen_cicd"></a>

#### gen\_cicd

```python
def gen_cicd(config)
```

Use cicd schema to generate workflow files based on the
`ci_cd` key in the `config`.

For more detail on schema:
GiHub-Actions - qhub/providers/cicd/github.py
GitLab-CI - qhub/providers/cicd/gitlab.py

<a id="qhub.qhub.render.inspect_files"></a>

#### inspect\_files

```python
def inspect_files(source_dirs: str,
                  output_dirs: str,
                  source_base_dir: str,
                  output_base_dir: str,
                  ignore_filenames: List[str] = None,
                  ignore_directories: List[str] = None,
                  deleted_paths: List[str] = None,
                  contents: Dict[str, str] = None)
```

Return created, updated and untracked files by computing a checksum over the provided directory

**Arguments**:

- `source_dirs` _str_ - The source dir used as base for comparssion
- `output_dirs` _str_ - The destination dir which will be matched with
- `source_base_dir` _str_ - Relative base path to source directory
- `output_base_dir` _str_ - Relative base path to output directory
- `ignore_filenames` _list[str]_ - Filenames to ignore while comparing for changes
- `ignore_directories` _list[str]_ - Directories to ignore while comparing for changes
- `deleted_paths` _list[str]_ - Paths that if exist in output directory should be deleted
- `contents` _dict_ - filename to content mapping for dynamically generated files

<a id="qhub.qhub.render.hash_file"></a>

#### hash\_file

```python
def hash_file(file_path: str)
```

Get the hex digest of the given file

**Arguments**:

- `file_path` _str_ - path to file

<a id="qhub.qhub.render.set_env_vars_in_config"></a>

#### set\_env\_vars\_in\_config

```python
def set_env_vars_in_config(config)
```

For values in the config starting with 'QHUB_SECRET_XXX' the environment
variables are searched for the pattern XXX and the config value is
modified. This enables setting secret values that should not be directly
stored in the config file.

NOTE: variables are most likely written to a file somewhere upon render. In
order to further reduce risk of exposure of any of these variables you might
consider preventing storage of the terraform render output.

<a id="qhub.qhub.stages.input_vars"></a>

### qhub.qhub.stages.input\_vars

<a id="qhub.qhub.stages.checks"></a>

### qhub.qhub.stages.checks

<a id="qhub.qhub.stages"></a>

### qhub.qhub.stages

<a id="qhub.qhub.stages.state_imports"></a>

### qhub.qhub.stages.state\_imports

<a id="qhub.qhub.stages.tf_objects"></a>

### qhub.qhub.stages.tf\_objects

<a id="qhub.qhub.constants"></a>

### qhub.qhub.constants

<a id="qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.conda-store.config.conda_store_config"></a>

### qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.conda-store.config.conda\_store\_config

<a id="qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.ipython.ipython_config"></a>

### qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.ipython.ipython\_config

<a id="qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.jupyterhub.01-theme"></a>

### qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.jupyterhub.01-theme

<a id="qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.jupyterhub.02-spawner"></a>

### qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.jupyterhub.02-spawner

<a id="qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.jupyterhub.03-profiles"></a>

### qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.jupyterhub.03-profiles

<a id="qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.jupyterhub.03-profiles.base_profile_home_mounts"></a>

#### base\_profile\_home\_mounts

```python
def base_profile_home_mounts(username)
```

Configure the home directory mount for user

Ensure that user directory exists and user has permissions to
read/write/execute.

<a id="qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.jupyterhub.03-profiles.base_profile_shared_mounts"></a>

#### base\_profile\_shared\_mounts

```python
def base_profile_shared_mounts(groups)
```

Configure the group directory mounts for user

Ensure that {shared}/{group} directory exists and user has
permissions to read/write/execute. Kubernetes does not allow the
same pvc to be a volume thus we must check that the home and share
pvc are not the same for some operation.

<a id="qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.jupyterhub.03-profiles.profile_conda_store_mounts"></a>

#### profile\_conda\_store\_mounts

```python
def profile_conda_store_mounts(username, groups)
```

Configure the conda_store environment directories mounts for
user

Ensure that {shared}/{group} directory exists and user has
permissions to read/write/execute.

<a id="qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.jupyterhub.03-profiles.render_profile"></a>

#### render\_profile

```python
def render_profile(profile, username, groups, keycloak_profilenames)
```

Render each profile for user

If profile is not available for given username, groups returns
None. Otherwise profile is transformed into kubespawner profile.

```
profile = {
    display_name: "heading for profile",
    slug: "longer description of profile"
    default: "only one profile can be default",
    kubespawner_override: "kubespawner instance",
}
```
See https://jupyterhub-kubespawner.readthedocs.io/en/latest/spawner.html for
details on `kubespawner_override`.

<a id="qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.jupyterhub.03-profiles.deep_merge"></a>

#### deep\_merge

```python
def deep_merge(d1, d2)
```

Deep merge two dictionaries.
>>> value_1 = {
'a': [1, 2],
'b': {'c': 1, 'z': [5, 6]},
'e': {'f': {'g': {}}},
'm': 1,
}

>>> value_2 = {
    'a': [3, 4],
    'b': {'d': 2, 'z': [7]},
    'e': {'f': {'h': 1}},
    'm': [1],
}

>>> print(deep_merge(value_1, value_2))
{'m': 1, 'e': {'f': {'g': {}, 'h': 1}}, 'b': {'d': 2, 'c': 1, 'z': [5, 6, 7]}, 'a': [1, 2, 3,  4]}

<a id="qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.examples.dashboard_plotly"></a>

### qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.examples.dashboard\_plotly

<a id="qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.examples.dashboard_streamlit"></a>

### qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.examples.dashboard\_streamlit

<a id="qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.examples.kbatch_dask_gateway"></a>

### qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.examples.kbatch\_dask\_gateway

Start a cluster with Dask Gateway, print the dashboard link, and run some tasks.

<a id="qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.jupyter.jupyter_notebook_config"></a>

### qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.jupyterhub.files.jupyter.jupyter\_notebook\_config

<a id="qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.dask-gateway.files.controller_config"></a>

### qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.dask-gateway.files.controller\_config

<a id="qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.dask-gateway.files.gateway_config"></a>

### qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.dask-gateway.files.gateway\_config

<a id="qhub.qhub.template.stages.07-kubernetes-services.modules.kubernetes.services.dask-gateway.files.gateway_config.deep_merge"></a>

#### deep\_merge

```python
def deep_merge(d1, d2)
```

Deep merge two dictionaries.
>>> value_1 = {
'a': [1, 2],
'b': {'c': 1, 'z': [5, 6]},
'e': {'f': {'g': {}}},
'm': 1,
}

>>> value_2 = {
    'a': [3, 4],
    'b': {'d': 2, 'z': [7]},
    'e': {'f': {'h': 1}},
    'm': [1],
}

>>> print(deep_merge(value_1, value_2))
{'m': 1, 'e': {'f': {'g': {}, 'h': 1}}, 'b': {'d': 2, 'c': 1, 'z': [5, 6, 7]}, 'a': [1, 2, 3,  4]}

<a id="qhub.qhub.provider.git"></a>

### qhub.qhub.provider.git

<a id="qhub.qhub.provider.terraform"></a>

### qhub.qhub.provider.terraform

<a id="qhub.qhub.provider.terraform.deploy"></a>

#### deploy

```python
def deploy(directory,
           terraform_init: bool = True,
           terraform_import: bool = False,
           terraform_apply: bool = True,
           terraform_destroy: bool = False,
           input_vars: Dict[str, Any] = None,
           state_imports: List = None)
```

Execute a given terraform directory

**Arguments**:

- `directory` - directory in which to run terraform operations on
  
- `terraform_init` - whether to run `terraform init` default True
  
- `terraform_import` - whether to run `terraform import` default
  False for each `state_imports` supplied to function
  
- `terraform_apply` - whether to run `terraform apply` default True
  
- `terraform_destroy` - whether to run `terraform destroy` default
  False
  
- `input_vars` - supply values for "variable" resources within
  terraform module
  
- `state_imports` - (addr, id) pairs for iterate through and attempt
  to terraform import

<a id="qhub.qhub.provider.oauth"></a>

### qhub.qhub.provider.oauth

<a id="qhub.qhub.provider.oauth.auth0"></a>

### qhub.qhub.provider.oauth.auth0

<a id="qhub.qhub.provider"></a>

### qhub.qhub.provider

<a id="qhub.qhub.provider.cicd.gitlab"></a>

### qhub.qhub.provider.cicd.gitlab

<a id="qhub.qhub.provider.cicd"></a>

### qhub.qhub.provider.cicd

<a id="qhub.qhub.provider.cicd.common"></a>

### qhub.qhub.provider.cicd.common

<a id="qhub.qhub.provider.cicd.github"></a>

### qhub.qhub.provider.cicd.github

<a id="qhub.qhub.provider.cicd.github.encrypt"></a>

#### encrypt

```python
def encrypt(public_key: str, secret_value: str) -> str
```

Encrypt a Unicode string using the public key.

<a id="qhub.qhub.provider.cicd.github.get_latest_repo_tag"></a>

#### get\_latest\_repo\_tag

```python
def get_latest_repo_tag(owner: str,
                        repo: str,
                        only_clean_tags: bool = True) -> str
```

Get the latest available tag on GitHub for owner/repo.

NOTE: Set `only_clean_tags=False` to include dev / pre-release (if latest).

<a id="qhub.qhub.provider.cicd.linter"></a>

### qhub.qhub.provider.cicd.linter

<a id="qhub.qhub.provider.cloud.google_cloud"></a>

### qhub.qhub.provider.cloud.google\_cloud

<a id="qhub.qhub.provider.cloud.google_cloud.kubernetes_versions"></a>

#### kubernetes\_versions

```python
@functools.lru_cache()
def kubernetes_versions(region)
```

Return list of available kubernetes supported by cloud provider. Sorted from oldest to latest.

<a id="qhub.qhub.provider.cloud.amazon_web_services"></a>

### qhub.qhub.provider.cloud.amazon\_web\_services

<a id="qhub.qhub.provider.cloud.amazon_web_services.kubernetes_versions"></a>

#### kubernetes\_versions

```python
@functools.lru_cache()
def kubernetes_versions(region="us-west-2")
```

Return list of available kubernetes supported by cloud provider. Sorted from oldest to latest.

<a id="qhub.qhub.provider.cloud"></a>

### qhub.qhub.provider.cloud

<a id="qhub.qhub.provider.cloud.commons"></a>

### qhub.qhub.provider.cloud.commons

<a id="qhub.qhub.provider.cloud.digital_ocean"></a>

### qhub.qhub.provider.cloud.digital\_ocean

<a id="qhub.qhub.provider.cloud.digital_ocean.kubernetes_versions"></a>

#### kubernetes\_versions

```python
def kubernetes_versions(region=None)
```

Return list of available kubernetes supported by cloud provider. Sorted from oldest to latest.

<a id="qhub.qhub.provider.cloud.azure_cloud"></a>

### qhub.qhub.provider.cloud.azure\_cloud

<a id="qhub.qhub.provider.cloud.azure_cloud.kubernetes_versions"></a>

#### kubernetes\_versions

```python
@functools.lru_cache()
def kubernetes_versions(region="Central US")
```

Return list of available kubernetes supported by cloud provider. Sorted from oldest to latest.

<a id="qhub.qhub.provider.dns"></a>

### qhub.qhub.provider.dns

<a id="qhub.qhub.provider.dns.cloudflare"></a>

### qhub.qhub.provider.dns.cloudflare

<a id="qhub.qhub"></a>

### qhub.qhub

<a id="qhub.qhub.cli.support"></a>

### qhub.qhub.cli.support

<a id="qhub.qhub.cli.deploy"></a>

### qhub.qhub.cli.deploy

<a id="qhub.qhub.cli._init"></a>

### qhub.qhub.cli.\_init

<a id="qhub.qhub.cli._init.handle_init"></a>

#### handle\_init

```python
def handle_init(inputs: InitInputs)
```

Take the inputs from the `nebari init` command, render the config and write it to a local yaml file.

<a id="qhub.qhub.cli._init.check_cloud_provider_creds"></a>

#### check\_cloud\_provider\_creds

```python
def check_cloud_provider_creds(ctx: typer.Context, cloud_provider: str)
```

Validate that the necessary cloud credentials have been set as environment variables.

<a id="qhub.qhub.cli._init.check_auth_provider_creds"></a>

#### check\_auth\_provider\_creds

```python
def check_auth_provider_creds(ctx: typer.Context, auth_provider: str)
```

Validating the the necessary auth provider credentials have been set as environment variables.

<a id="qhub.qhub.cli._init.check_project_name"></a>

#### check\_project\_name

```python
def check_project_name(ctx: typer.Context, project_name: str)
```

Validate the project_name is acceptable. Depends on `cloud_provider`.

<a id="qhub.qhub.cli._init.guided_init_wizard"></a>

#### guided\_init\_wizard

```python
def guided_init_wizard(ctx: typer.Context, guided_init: str)
```

Guided Init Wizard is a user-friendly questionnaire used to help generate the `nebari-config.yaml`.

<a id="qhub.qhub.cli.destroy"></a>

### qhub.qhub.cli.destroy

<a id="qhub.qhub.cli.initialize"></a>

### qhub.qhub.cli.initialize

<a id="qhub.qhub.cli.render"></a>

### qhub.qhub.cli.render

<a id="qhub.qhub.cli"></a>

### qhub.qhub.cli

<a id="qhub.qhub.cli.upgrade"></a>

### qhub.qhub.cli.upgrade

<a id="qhub.qhub.cli.validate"></a>

### qhub.qhub.cli.validate

<a id="qhub.qhub.cli._keycloak"></a>

### qhub.qhub.cli.\_keycloak

<a id="qhub.qhub.cli._keycloak.add_user"></a>

#### add\_user

```python
@app_keycloak.command(name="adduser")
def add_user(add_users: Tuple[str, str] = typer.Option(
    ..., "--user", help="Provide both: <username> <password>"),
             config_filename: str = typer.Option(
                 ...,
                 "-c",
                 "--config",
                 help="qhub configuration file path",
             ))
```

Add a user to Keycloak. User will be automatically added to the [italic]analyst[/italic] group.

<a id="qhub.qhub.cli._keycloak.list_users"></a>

#### list\_users

```python
@app_keycloak.command(name="listusers")
def list_users(config_filename: str = typer.Option(
    ...,
    "-c",
    "--config",
    help="qhub configuration file path",
))
```

List the users in Keycloak.

<a id="qhub.qhub.cli.keycloak"></a>

### qhub.qhub.cli.keycloak

<a id="qhub.qhub.cli.cost"></a>

### qhub.qhub.cli.cost

<a id="qhub.qhub.cli.main"></a>

### qhub.qhub.cli.main

<a id="qhub.qhub.cli.main.OrderCommands"></a>

## OrderCommands Objects

```python
class OrderCommands(TyperGroup)
```

<a id="qhub.qhub.cli.main.OrderCommands.list_commands"></a>

#### list\_commands

```python
def list_commands(ctx: Context)
```

Return list of commands in the order appear.

<a id="qhub.qhub.cli.main.init"></a>

#### init

```python
@app.command()
def init(cloud_provider: str = typer.Argument(
    "local",
    help=f"options: {enum_to_list(ProviderEnum)}",
    callback=check_cloud_provider_creds,
    is_eager=True,
),
         guided_init: bool = typer.Option(
             False,
             help=GUIDED_INIT_MSG,
             callback=guided_init_wizard,
             is_eager=True,
         ),
         project_name: str = typer.Option(
             ...,
             "--project-name",
             "--project",
             "-p",
             callback=check_project_name,
         ),
         domain_name: str = typer.Option(
             ...,
             "--domain-name",
             "--domain",
             "-d",
         ),
         namespace: str = typer.Option("dev", ),
         auth_provider: str = typer.Option(
             "password",
             help=f"options: {enum_to_list(AuthenticationEnum)}",
             callback=check_auth_provider_creds,
         ),
         auth_auto_provision: bool = typer.Option(False, ),
         repository: str = typer.Option(None, ),
         repository_auto_provision: bool = typer.Option(False, ),
         ci_provider: str = typer.Option(
             None,
             help=f"options: {enum_to_list(CiEnum)}",
         ),
         terraform_state: str = typer.Option(
             "remote", help=f"options: {enum_to_list(TerraformStateEnum)}"),
         kubernetes_version: str = typer.Option("latest", ),
         ssl_cert_email: str = typer.Option(None, ),
         disable_prompt: bool = typer.Option(
             False,
             is_eager=True,
         ))
```

Create and initialize your [purple]nebari-config.yaml[/purple] file.

This command will create and initialize your [purple]nebari-config.yaml[/purple] :sparkles:

This file contains all your Nebari cluster configuration details and,
is used as input to later commands such as [green]nebari render[/green], [green]nebari deploy[/green], etc.

If you're new to Nebari, we recommend you use the Guided Init wizard.
To get started simply run:

        [green]nebari init --guided-init[/green]

<a id="qhub.qhub.cli.main.validate"></a>

#### validate

```python
@app.command(rich_help_panel=SECOND_COMMAND_GROUP_NAME)
def validate(config: str = typer.Option(
    ...,
    "--config",
    "-c",
    help=
    "qhub configuration yaml file path, please pass in as -c/--config flag",
),
             enable_commenting: bool = typer.Option(
                 False,
                 "--enable_commenting",
                 help="Toggle PR commenting on GitHub Actions"))
```

Validate the values in the [purple]nebari-config.yaml[/purple] file are acceptable.

<a id="qhub.qhub.cli.main.render"></a>

#### render

```python
@app.command(rich_help_panel=SECOND_COMMAND_GROUP_NAME)
def render(
        output: str = typer.Option(
            "./",
            "-o",
            "--output",
            help="output directory",
        ),
        config: str = typer.Option(
            ...,
            "-c",
            "--config",
            help="nebari configuration yaml file path",
        ),
        dry_run: bool = typer.
    Option(
        False,
        "--dry-run",
        help=
        "simulate rendering files without actually writing or updating any files",
    ))
```

Dynamically render the Terraform scripts and other files from your [purple]nebari-config.yaml[/purple] file.

<a id="qhub.qhub.cli.main.deploy"></a>

#### deploy

```python
@app.command()
def deploy(
        config: str = typer.Option(
            ...,
            "--config",
            "-c",
            help="nebari configuration yaml file path",
        ),
        output: str = typer.Option(
            "./",
            "-o",
            "--output",
            help="output directory",
        ),
        dns_provider: str = typer.Option(
            False,
            "--dns-provider",
            help="dns provider to use for registering domain name mapping",
        ),
        dns_auto_provision: bool = typer.
    Option(
        False,
        "--dns-auto-provision",
        help=
        "Attempt to automatically provision DNS. For Auth0 is requires environment variables AUTH0_DOMAIN, AUTH0_CLIENTID, AUTH0_CLIENT_SECRET",
    ),
        disable_prompt: bool = typer.Option(
            False,
            "--disable-prompt",
            help="Disable human intervention",
        ),
        disable_render: bool = typer.Option(
            False,
            "--disable-render",
            help="Disable auto-rendering in deploy stage",
        ))
```

Deploy the Nebari cluster from your [purple]nebari-config.yaml[/purple] file.

<a id="qhub.qhub.cli.main.destroy"></a>

#### destroy

```python
@app.command()
def destroy(
        config: str = typer.Option(...,
                                   "-c",
                                   "--config",
                                   help="qhub configuration file path"),
        output: str = typer.Option(
            "./"
            "-o",
            "--output",
            help="output directory",
        ),
        disable_render: bool = typer.Option(
            False,
            "--disable-render",
            help="Disable auto-rendering before destroy",
        ),
        disable_prompt: bool = typer.
    Option(
        False,
        "--disable-prompt",
        help=
        "Destroy entire Nebari cluster without confirmation request. Suggested for CI use.",
    ))
```

Destroy the Nebari cluster from your [purple]nebari-config.yaml[/purple] file.

<a id="qhub.qhub.cli.main.cost"></a>

#### cost

```python
@app.command(rich_help_panel=SECOND_COMMAND_GROUP_NAME)
def cost(path: str = typer.Option(
    None,
    "-p",
    "--path",
    help=
    "Pass the path of your stages directory generated after rendering QHub configurations before deployment",
),
         dashboard: bool = typer.Option(
             True,
             "-d",
             "--dashboard",
             help="Enable the cost dashboard",
         ),
         file: str = typer.Option(
             None,
             "-f",
             "--file",
             help="Specify the path of the file to store the cost report",
         ),
         currency: str = typer.Option(
             "USD",
             "-c",
             "--currency",
             help="Specify the currency code to use in the cost report",
         ),
         compare: bool = typer.Option(
             False,
             "-cc",
             "--compare",
             help="Compare the cost report to a previously generated report",
         ))
```

Estimate the cost of deploying Nebari based on your [purple]nebari-config.yaml[/purple]. [italic]Experimental.[/italic]

[italic]This is still only experimental using Infracost under the hood.
The estimated value is a base cost and does not include usage costs.[/italic]

<a id="qhub.qhub.cli.main.upgrade"></a>

#### upgrade

```python
@app.command(rich_help_panel=SECOND_COMMAND_GROUP_NAME)
def upgrade(
        config: str = typer.Option(
            ...,
            "-c",
            "--config",
            help="qhub configuration file path",
        ),
        attempt_fixes: bool = typer.
    Option(
        False,
        "--attempt-fixes",
        help=
        "Attempt to fix the config for any incompatibilities between your old and new QHub versions.",
    ))
```

Upgrade your [purple]nebari-config.yaml[/purple] from pre-0.4.0 to 0.4.0.

Due to several breaking changes that came with the 0.4.0 release, this utility is available to help
update your [purple]nebari-config.yaml[/purple] to comply with the introduced changes.
See the project [green]RELEASE.md[/green] for details.

<a id="qhub.qhub.cli.main.support"></a>

#### support

```python
@app.command(rich_help_panel=SECOND_COMMAND_GROUP_NAME)
def support(config_filename: str = typer.Option(
    ...,
    "-c",
    "--config",
    help="qhub configuration file path",
),
            output: str = typer.Option(
                "./qhub-support-logs.zip",
                "-o",
                "--output",
                help="output filename",
            ))
```

Support tool to write all Kubernetes logs locally and compress them into a zip file.

The Nebari team recommends k9s to manage and inspect the state of the cluster.
However, this command occasionally helpful for debugging purposes should the logs need to be shared.

<a id="qhub.qhub.upgrade"></a>

### qhub.qhub.upgrade

<a id="qhub.qhub.upgrade.UpgradeStep"></a>

## UpgradeStep Objects

```python
class UpgradeStep(ABC)
```

<a id="qhub.qhub.upgrade.UpgradeStep.upgrade"></a>

#### upgrade

```python
@classmethod
def upgrade(cls,
            config,
            start_version,
            finish_version,
            config_filename,
            attempt_fixes=False)
```

Runs through all required upgrade steps (i.e. relevant subclasses of UpgradeStep).
Calls UpgradeStep.upgrade_step for each.

<a id="qhub.qhub.upgrade.UpgradeStep.upgrade_step"></a>

#### upgrade\_step

```python
def upgrade_step(config, start_version, config_filename, *args, **kwargs)
```

Perform the upgrade from start_version to self.version

Generally, this will be in-place in config, but must also return config dict.

config_filename may be useful to understand the file path for qhub-config.yaml, for example
to output another file in the same location.

The standard body here will take care of setting qhub_version and also updating the image tags.

It should normally be left as-is for all upgrades. Use _version_specific_upgrade below
for any actions that are only required for the particular upgrade you are creating.

<a id="qhub.qhub.utils"></a>

### qhub.qhub.utils

<a id="qhub.qhub.utils.run_subprocess_cmd"></a>

#### run\_subprocess\_cmd

```python
def run_subprocess_cmd(processargs, **kwargs)
```

Runs subprocess command with realtime stdout logging with optional line prefix.

<a id="qhub.qhub.utils.load_yaml"></a>

#### load\_yaml

```python
def load_yaml(config_filename: pathlib.Path)
```

Return yaml dict containing config loaded from config_filename.

<a id="qhub.qhub.utils.modified_environ"></a>

#### modified\_environ

```python
@contextlib.contextmanager
def modified_environ(*remove: List[str], **update: Dict[str, str])
```

https://stackoverflow.com/questions/2059482/python-temporarily-modify-the-current-processs-environment/51754362

Temporarily updates the ``os.environ`` dictionary in-place.

The ``os.environ`` dictionary is updated in-place so that the modification
is sure to work in all situations.

**Arguments**:

- `remove`: Environment variables to remove.
- `update`: Dictionary of environment variables and values to add/update.

<a id="qhub.qhub.utils.deep_merge"></a>

#### deep\_merge

```python
def deep_merge(*args)
```

Deep merge multiple dictionaries.

>>> value_1 = {
'a': [1, 2],
'b': {'c': 1, 'z': [5, 6]},
'e': {'f': {'g': {}}},
'm': 1,
}

>>> value_2 = {
    'a': [3, 4],
    'b': {'d': 2, 'z': [7]},
    'e': {'f': {'h': 1}},
    'm': [1],
}

>>> print(deep_merge(value_1, value_2))
{'m': 1, 'e': {'f': {'g': {}, 'h': 1}}, 'b': {'d': 2, 'c': 1, 'z': [5, 6, 7]}, 'a': [1, 2, 3,  4]}

<a id="qhub.qhub.utils.set_docker_image_tag"></a>

#### set\_docker\_image\_tag

```python
def set_docker_image_tag() -> str
```

Set docker image tag for `jupyterlab`, `jupyterhub`, and `dask-worker`.

<a id="qhub.qhub.utils.set_qhub_dask_version"></a>

#### set\_qhub\_dask\_version

```python
def set_qhub_dask_version() -> str
```

Set version of `qhub-dask` meta package.

<a id="qhub.qhub.keycloak"></a>

### qhub.qhub.keycloak

<a id="qhub.qhub.cost"></a>

### qhub.qhub.cost

<a id="qhub.qhub.cost.infracost_diff"></a>

#### infracost\_diff

```python
def infracost_diff(path, compare_to_path)
```

Compare the infracost report of the given path to a previous infracost report

<a id="qhub.qhub.cost.infracost_report"></a>

#### infracost\_report

```python
def infracost_report(path, dashboard, file, currency_code, compare)
```

Generate a report of the infracost cost of the given path
args:
    path: path to the qhub stages directory

<a id="qhub.qhub.__main__"></a>

### qhub.qhub.\_\_main\_\_

<a id="qhub.qhub.schema"></a>

### qhub.qhub.schema

<a id="qhub.qhub.schema.Profiles"></a>

## Profiles Objects

```python
class Profiles(Base)
```

<a id="qhub.qhub.schema.Profiles.check_default"></a>

#### check\_default

```python
@validator("jupyterlab")
def check_default(cls, v, values)
```

Check if only one default value is present

<a id="qhub.qhub.schema.Main"></a>

## Main Objects

```python
class Main(Base)
```

<a id="qhub.qhub.schema.Main.check_default"></a>

#### check\_default

```python
@validator("qhub_version", pre=True, always=True)
def check_default(cls, v)
```

Always called even if qhub_version is not supplied at all (so defaults to ''). That way we can give a more helpful error message.

<a id="qhub.qhub.schema.is_version_accepted"></a>

#### is\_version\_accepted

```python
def is_version_accepted(v)
```

Given a version string, return boolean indicating whether
qhub_version in the qhub-config.yaml would be acceptable
for deployment with the current QHub package.

<a id="qhub.tests.conftest"></a>

### qhub.tests.conftest

<a id="qhub.tests.conftest.setup_fixture"></a>

#### setup\_fixture

```python
@pytest.fixture(params=INIT_INPUTS)
def setup_fixture(request, monkeypatch, tmp_path)
```

This fixture helps simplify writing tests by:
- parametrizing the different cloud provider inputs in a single place
- creating a tmp directory (and file) for the `qhub-config.yaml` to be save to
- monkeypatching functions that call out to external APIs

<a id="qhub.tests.test_upgrade"></a>

### qhub.tests.test\_upgrade

<a id="qhub.tests"></a>

### qhub.tests

<a id="qhub.tests.test_schema"></a>

### qhub.tests.test\_schema

<a id="qhub.tests.scripts.minikube-loadbalancer-ip"></a>

### qhub.tests.scripts.minikube-loadbalancer-ip

<a id="qhub.tests.test_commons"></a>

### qhub.tests.test\_commons

<a id="qhub.tests.test_render"></a>

### qhub.tests.test\_render

<a id="qhub.tests.test_init"></a>

### qhub.tests.test\_init

<a id="qhub.tests.test_links"></a>

### qhub.tests.test\_links

<a id="qhub.docs.conf"></a>

### qhub.docs.conf

<a id="qhub.docs.ext.substitute"></a>

### qhub.docs.ext.substitute

This is a hard replace as soon as the source file is read, so no respect for any markup at all
Simply forces replace of ||QHUB_VERSION|| with the qhub_version_string in conf.py

<a id="qhub.docs.ext.substitute.dosubs"></a>

#### dosubs

```python
def dosubs(app, docname, source)
```

Replace QHUB_VERSION with the qhub version

<a id="qhub.scripts.aws-force-destroy"></a>

### qhub.scripts.aws-force-destroy

<a id="qhub.scripts.keycloak-export"></a>

### qhub.scripts.keycloak-export

<a id="qhub.noxfile"></a>

### qhub.noxfile

