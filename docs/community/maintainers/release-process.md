---
id: release-process-branching-strategy
title: Release process and branching strategy
description: Release process and branching strategy
---

# The Nebari release process

This page describes the high-level details of cutting a new Nebari release.

|        Cadence        |                   Versioning System                   |                                                                                    Release Checklist                                                                                     |                                                                                        Testing Checklist                                                                                         |
| :-------------------: | :---------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| 3rd week of the month | [CalVer](#calver-details) - (for example `2022.10.1`) | [Link to issue template](https://github.com/nebari-dev/nebari/issues/new?assignees=&labels=type%3A+release+%F0%9F%8F%B7&template=release-checklist.md&title=%5BRELEASE%5D+%3Cversion%3E) | [Link to issue template](https://github.com/nebari-dev/nebari/issues/new?assignees=&labels=type%3A+release+%F0%9F%8F%B7&template=testing-checklist.md&title=Testing+checklist+for+%3Cversion%3E) |

## Release Captain responsibilities

For every release, there is an assigned "Release Captain". The Release Captain's responsibilities are:

- Manage both the release and testing processes and update the checklists as needed.
- Communicate the status of the release to the rest of the Nebari development team and the community (through updating the checklists and adding status updates as comments).
- Assign owners to checklist items (if not owned by the Release Captain).
- Adjust the schedule, particularly the publishing dates, based on defects found, fixes made, holidays, vacations, and so on.

## CalVer details

Nebari releases should follow the following CalVer versioning style:

```
YYYY-MM-releaseNumber
```

:::info
`YYYY` represents the year - such as `2023`

`MM` represents the _non-zero padded_ month - such as `1` for January, `12` for December

`releaseNumber` represents the current release for that month, starting at `1`. Anything above `1` represents a [hotfix (patch) release](#hotfixes).
:::

## Release Tags

- `YYYY-MM-releaseNumber`: This format represents the tag for each specific release.

:::caution
Do **not** prepend a `v` to the release tag.
:::

For example, the first Nebari CalVer release was `2022.10.1`. If a hotfix were needed in the same month, you would increment the `releaseNumber` by 1 to get `2022.10.2`. (_Note: This is just an illustration; this release does not actually exist._)

## Branching Strategy

At Nebari, we embrace a straightforward branching strategy to keep our development process simple and efficient. We follow the [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow) model, which revolves around a single `main` branch for active development.

### Branch Roles

We designate specific roles to our Git branches for clarity and organization:

- [`main`](https://github.com/nebari-dev/nebari/tree/main): This is the default branch where all new features and fixes are merged. It represents the active development state of the project.

For hotfix releases, we create a new branch from the `main` branch using the naming convention `hotfix-YYYY-MM-releaseNumber`. This branch is specifically for implementing necessary changes for the hotfix and is deleted after the release is completed.

### Release Process

The Nebari release process is a structured workflow that ensures the quality and reliability of each release. The process consists of the following key steps:

1. **Preparation**: Identify the changes to include in the release and associate them
   with the appropriate milestone. Assign a Nebari core maintainer as the "Release
   Captain" and open a release checklist issue to track the process.

2. **Release Candidate**: After merging all necessary pull requests, the Release Captain
   creates an initial Release Candidate using the pre-release option in the GitHub
   releases panel. A review checklist issue is also opened to ensure that all changes
   are correctly included in the release. This could be a iterative process, with
   multiple release candidates being created in case of new changes or fixes being needed.

3. **Testing and Verification**: Complete the review checklist to confirm that all
   changes function as expected and that major services perform optimally. The Release
   Captain assigns owners to each checklist item to ensure accountability.

4. **Finalizing the Release**: Upon successful testing, the Release Captain updates the
   release notes and increments the version number in the `constants.py` file. The final
   release is then published, and the release checklist issue is updated with the final
   details.

For a detailed guide on the release process, refer to the [release checklist template](https://github.com/nebari-dev/nebari/blob/main/.github/ISSUE_TEMPLATE/release-checklist.md).

### Hotfixes and Patch Releases

If a patch or hotfix release is necessary, the process mirrors the standard release steps with a key difference:

- The Release Captain creates a new **hotfix branch** (see the convention above) from the previous release **tag**.
- Necessary changes are cherry-picked into this hotfix branch.
- The final release is published following the standard procedure.

This approach ensures that critical fixes are efficiently addressed without disrupting
the main development workflow.

:::note
Hotfix releases are rare and are only used to address critical issues that cannot wait
for the next scheduled release, they are usually associated with
[broken](https://conda-forge.org/docs/maintainer/updating_pkgs/#removing-broken-packages)
or [yanked](https://pypi.org/help/#yanked) releases. And should be delivered as soon as possible.
:::

## Related packages and repositories

### nebari-dask

[`nebari-dask`](https://github.com/conda-forge/qhub-dask-feedstock) is a meta package which contains specific versions of `dask`, `dask-gateway` and `distributed`.

> Released at the same time as `nebari` with matching version numbers. Included in the release checklist linked above.

### nebari-docker-images

The [`nebari-docker-images`](https://github.com/nebari-dev/nebari-docker-images) repo contains the Dockerfiles for the JupyterHub, JupyterLab, and Dask-Gateway Kubernetes deployments. This repo also contains the workflow needed to build and push them the images to [github.com/orgs/nebari-dev/packages](https://github.com/orgs/nebari-dev/packages) and [quay.io/organization/nebari](https://quay.io/organization/nebari).

> These images are built and tagged with the same version number of the corresponding `nebari` release. Included in the release checklist linked above.

If there were changes to the following packages, handle their releases before cutting a new release for Nebari

### nebari-workflow-controller

The [`nebari-workflow-controller`](https://github.com/nebari-dev/nebari-workflow-controller)
is a [kubernetes admission
controller](https://kubernetes.io/blog/2019/03/21/a-guide-to-kubernetes-admission-controllers/)
to enable volumeMount permissions on Argo Workflows on Nebari and provide a convenience
method for deploying jupyterlab-like workflows for users.

### argo-jupyter-scheduler

The [`argo-jupyter-scheduler`](https://github.com/nebari-dev/argo-jupyter-scheduler) is a plugin for the [Jupyter-Scheduler](https://jupyter-scheduler.readthedocs.io/en/latest/index.html) extension in JupyterLab. It allows you to submit long-running notebooks to run asynchronously without needing to keep your JupyterLab server active. You can also schedule notebooks to run at specified times.
