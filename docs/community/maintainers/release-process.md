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

:::caution
For the release tag, there should be NO prepended `v`
:::

For example, the first Nebari CalVer release was `2022.10.1`. If a hotfix release was needed in the same month, we increment the `releaseNumber` by 1, which would be `2022.10.2` (_this is to illustrate how the increment works, this release does not exist._)

## Branching strategy

We use the following guidelines to manage `git` branches by assigning certain roles to particular branches.

- [`main`](https://github.com/nebari-dev/nebari/tree/main) - Represents the active development branch and is the _default_ branch on the GitHub repository.


## Release Tags

- `YYYY-MM-releaseNumber` - Represents the tag for a particular release.

### Process

The release process is captured in the [release checklist template](https://github.com/nebari-dev/nebari/issues/new?assignees=&labels=type%3A+release+%F0%9F%8F%B7&template=release-checklist.md&title=%5BRELEASE%5D+%3Cversion%3E).

## Related packages

### nebari-dask

[`nebari-dask`](https://github.com/conda-forge/qhub-dask-feedstock) is a meta package which contains specific versions of `dask`, `dask-gateway` and `distributed`.

> Released at the same time as `nebari` with matching version numbers. Included in the release checklist linked above.

### nebari-docker-images

The [`nebari-docker-images`](https://github.com/nebari-dev/nebari-docker-images) repo contains the Dockerfiles for the JupyterHub, JupyterLab, and Dask-Gateway Kubernetes deployments. This repo also contains the workflow needed to build and push them the images to [github.com/orgs/nebari-dev/packages](https://github.com/orgs/nebari-dev/packages) and [quay.io/organization/nebari](https://quay.io/organization/nebari).

> These images are built and tagged with the same version number of the corresponding `nebari` release. Included in the release checklist linked above.
