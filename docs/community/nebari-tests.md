---
id: nebari-tests
title: Test your Nebari contribution
description: Guidelines and tips for testing Nebari
---

As you develop your contributions to the Nebari codebase, you will mainly be working with Python files, Terraform files, and occasionally Docker images.
This page has some tips for testing your contributions to make sure it works as intended.

## Test Nebari CLI commands

### Test CLI manually

If you have an [editable installation of Nebari](code-contributions#install-nebari-in-editable-mode), you can test your changes by running the [Nebari CLI commands](../get-started/quickstart) from within your development environment.
For example, you can run `nebari init` and make sure it builds the `nebari-config.yaml` file without errors.

### Test CLI with `pytest`

Nebari uses [`pytest`](https://docs.pytest.org/en/7.1.x/) to test the Python files and modules.

The unit test files are located in the `tests` directory.
You can use the regular `pytest` commands to run them:

```bash
pytest tests/tests_unit
```

:::note
These tests are also triggered by the Nebari CI when you open pull requests.
:::

## Test the Nebari deployment (Terraform)

### Test the deployment manually

If you update Terraform (and related) files in `nebari/states`, you can deploy Nebari locally to test if all the deployment steps execute successfully.
Nebari uses [Kind](https://kind.sigs.k8s.io/) to create local Kubernetes clusters.
Nebari ships with Kind, so you don't have to install it separately.

:::note
Right now, local deployments can be done on Linux machines because of the nuances of how Docker works on macOS and Windows.
:::

After you make changes, you can re-deploy your Nebari instance to test it manually.

### Testing the deployment with `pytest`

The deployment and integration tests help us test various features of a [local Nebari deployment on Kind](#testing-the-nebari-deployment-terraform),
such as Dask Gateway, external integrations, state of the Kubernetes cluster, and more.
Before you can run these tests, you need to create a test user on your deployment, for example with:

```bash
KEYCLOAK_USERNAME=test-user
KEYCLOAK_PASSWORD=P@sswo3d
nebari keycloak adduser --user "${KEYCLOAK_USERNAME}" "${KEYCLOAK_PASSWORD}" --config nebari-config.yaml
```

You can then run the integration and deployment tests located in the `tests_deployment` directory with:

```bash
NEBARI_HOSTNAME=nebari.local \
  KEYCLOAK_USERNAME=test-user \
  KEYCLOAK_PASSWORD=P@sswo3d \
  pytest tests/tests_deployment/
```

Please note that the `KEYCLOAK_USERNAME` and `KEYCLOAK_PASSWORD` environment variables need to match those of the test user created in the previous step,
and that the `NEBARI_HOSTNAME` variable needs to point to the domain of the deployment against which you wish to test.

:::note
These tests are also triggered by the Nebari CI when you open pull requests.
:::

### Debug Kubernetes clusters with `k9s`

Re-deploying Nebari after every change can be tedious, so we recommend using [`k9s`](https://k9scli.io/) to debug the running Kubernetes clusters.
`k9s` is a terminal-based user interface that assists with navigation, observation, and management of applications in Kubernetes.
`k9s` continuously monitors Kubernetes clusters for changes and provides shortcut commands to interact with the observed resources.
It can help you review and resolve day-to-day issues in the deployed clusters quickly.

You can install `k9s` on macOS, Windows, and Linux with [these instructions project's README](https://github.com/derailed/k9s).

For more details on using `k9s`, check out the [documentation on debugging Nebari](../how-tos/debug-nebari#debugging-the-kubernetes-cluster-using-k9s).

### Cloud testing

Cloud deployments are the only way to truly test the complete Nebari infrastructure.
To test on cloud Kubernetes, deploy Nebari in the normal way on the cloud, but make sure to:

- Install Nebari in the editable mode, so your changes are reflected in the deployment, and
- [Use a development branch](#use-a-development-branch) to specify the Docker images based on the latest development code in `nebari-config.yaml`.

:::warning
Testing your contribution by deploying Nebari on the cloud (AWS, GCP, Azure, and Digital Ocean) can consume a lot of time and resources.
Always prefer local testing when possible.
It will be easier to debug, may be quicker to deploy, and is likely to be less expensive.
:::

## Automated CI tests with Cypress

We use [Cypress](https://www.cypress.io/) to automate Nebari testing within a web browser environment.
Cypress is an open source test automation tool for interactive web applications.
We use it to test everything from the authentication process to JupyterHub integrations like Grafana monitoring.

It's integrated into the GitHub Actions `tests.yaml` workflow in the `nebari-dev/nebari` repository.
You can also run it locally.
To do so:

1. Navigate to the `tests_e2e` directory:

   ```bash
   cd tests_e2e
   ```

2. Install the necessary prerequisites:

   ```bash
   npm install
   ```

3. Set the following environment variables:

   ```bash
   export CYPRESS_BASE_URL=http://127.0.0.1:8000/
   export NEBARI_CONFIG_PATH=/Users/<name>/<path>/nebari-config.yaml
   export CYPRESS_EXAMPLE_USER_PASSWORD=<password>
   ```

   The `CYPRESS_BASE_URL` can point anywhere that you can access it. It can also be the URL of a Nebari cloud deployment.

   The `NEBARI_CONFIG_PATH` should point to the associated YAML file for that website.
   The tests will inspect the YAML file to understand which tests are relevant.
   It first checks `security.authentication.type` to determine what should be available on the login page, and how to test it.
   If the login type is 'password' then it uses the value in `CYPRESS_EXAMPLE_USER_PASSWORD` as the password.
   The default username is `example-user`, but it can be changed by setting the `CYPRESS_EXAMPLE_USER_NAME` environment variable.

4. Open the Cypress UI where you can run the tests manually and see the actions in the browser:

```bash
npm run cypress:open
```

:::note
These tests are heavily state-dependent, so any changes or use of the deployed Nebari instance could affect the results.
:::

## Develop and test `nebari-docker-images`

All Nebari docker images are located in [`nebari-dev/nebari-docker-images`](https://github.com/nebari-dev/nebari-docker-images).
You can build any image locally.
Additionally, when you open pull requests on the main `nebari-dev/nebari` repository, each Docker-build will be tested.

```bash
docker build -f Dockerfile.<filename> .
```

:::note
There is a GitHub Actions workflow that will build these images and push to Docker Hub whenever a change is made to the relevant files on GitHub.
:::

### Update docker images

You can modify the images, for example, the JupyterLab default docker image, and run the resulting configuration with:

```bash
docker run -p 8888:8888 -it <image-sha> jupyter lab --ip=0.0.0.0
```

Then open the localhost (127.0.0.1) link displayed in the terminal:

```bash
[I 2021-04-05 17:37:17.345 ServerApp] Jupyter Server 1.5.1 is running at:
...
[I 2021-04-05 17:37:17.346 ServerApp]  or http://127.0.0.1:8888/lab?token=8dbb7ff1dcabc5fab860996b6622ac24dc71d1efc34fcbed
...
[I 2021-04-05 17:37:17.346 ServerApp] Use Control-C to stop this server and shut down all kernels (twice to skip confirmation).
```

To debug the image directly, you can run:

```bash
docker exec -ti <container-name>
```

### Linting Dockerfiles

To lint Dockerfiles, we use a tool called [Hadolint](https://github.com/hadolint/hadolint).
Hadolint is a Dockerfile linter that helps you discover issues with the Dockerfiles and recommends some [best practices being followed](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/).
Nebari CI automates Hadolint code reviews on every commit and pull request to `nebari-dev/nebari-docker-images`, reporting code style and error-prone issues.

To run Hadolint locally you can either install it locally or use a container image, with the instructions in the [installation documentation for Hadolint](https://github.com/hadolint/hadolint#install).
The `.hadolint.yml` on the root directory defines the ignored rules.

Run Hadolint on Dockerfiles with:

```bash
hadolint ./Dockerfile.conda-store
hadolint ./Dockerfile.dask-gateway
hadolint ./Dockerfile.dask-worker
hadolint ./Dockerfile.jupyterhub
hadolint ./Dockerfile.jupyterlab
```

Hadolint will report `error`, `warning`, `info`, and `style` while linting Dockerfiles.
In case of an error, the CI will fail.

## Additional tips

### Use a development branch

To use (initialize, deploy, and more) Nebari from a development branch such as `main` set the environment variable `NEBARI_GH_BRANCH` before running Nebari commands:

```bash
export NEBARI_GH_BRANCH=main
```

Then `nebari init` will create a `nebari-config.yaml` file containing, for example, `nebari/nebari-jupyterlab:main` which is the Docker image built based on the Dockerfiles specified in the main branch of the Nebari repo.

`nebari deploy` can also use `NEBARI_GH_BRANCH` to create GitHub/GitLab Actions workflows which install the development branch of Nebari for the deployment steps.

:::note
If you want to use the development version of Nebari for your `init` and `deploy` steps, but want your resulting deployment to be based on a full release version, don't set the `NEBARI_GH_BRANCH` environment variable.

If you do so, Docker tags and workflow `pip install nebari` commands will be based on the Nebari version specified in the `nebari/version.py` file. These tags and releases may not yet exist (perhaps if the version has been updated to include a beta/dev component which has not been released). You may need to manually modify the `nebari-config.yaml` file to 'downgrade' the tags to a full release version.
:::

### Kubernetes version check for cloud providers

When `nebari init <cloud provider>` is called, it checks that the `--kubernetes-version` provided is supported by the preferred cloud provider. This flag is optional and if not provided, the `kubernetes_version` is set to the most recent Kubernetes version available. This is achieved by using the cloud provider's SDK, so you need to set their appropriate credentials as well.

To get around this, set the `NEBARI_K8S_VERSION` environment variable with:

```bash
export NEBARI_K8S_VERSION=1.20
```
