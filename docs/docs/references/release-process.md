---
id: release-process
title: The Nebari release process
description: The Nebari release process and workflow
---

# The Nebari release process

This page describes the high-level details of cutting a new Nebari release.

|                   |                                                                                                                                                                                                  |
| :---------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|      Cadence      |                                                                                             Monthly                                                                                              |
| Versioning System |                                                                                    [CalVer](#calver-details)                                                                                     |
| Release Checklist |     [Link to issue template](https://github.com/nebari-dev/nebari/issues/new?assignees=&labels=type%3A+release+%F0%9F%8F%B7&template=release-checklist.md&title=%5BRELEASE%5D+%3Cversion%3E)     |
| Testing Checklist | [Link to issue template](https://github.com/nebari-dev/nebari/issues/new?assignees=&labels=type%3A+release+%F0%9F%8F%B7&template=testing-checklist.md&title=Testing+checklist+for+%3Cversion%3E) |

## Release Captain responsibilities

For every release, there is an assigned "Release Captain". It is the responsibility of this person to manage both the release checklist and testing checklist as well to communicate the status of the release to the rest of the Nebari development team.

Communication channels that need to be updated are:

- the release checklist issue itself
- the `#nebari-dev` slack channel

## CalVer details

These releases should follow the following CalVer versioning style:

```
YYYY-MM-releaseNumber
```

:::info
`YYYY` represents the year - i.e. `2023`

`MM` represents the _non-zero padded_ month - i.e. `1` for January, `12` for December

`releaseNumber` represents the current release for that month, starting at `1`
:::

:::warn
For the release tag, there should be no prepended `v`!
:::

For example, the first Nebari CalVer release was `2022.10.1`. If a second release was needed in the same month, we simply increment the `releaseNumber` by 1, which would be `2022.10.2` (_this is to illustrate how the increment works, this release does not exist._)

## Gitflow details

Gitflow is framework for managing `git` branches by assigning certain roles to particular branches.

`main` - Represents a production-ready state of the code-base, with appropriate tags to match the most recent releases.
`develop` - Represents the working branch where all new features and bug fixes (since the last release) are merged into. - This is the default branch on the `nebari-dev/nebari` GitHub repo.
`release/YYYY-MM-releaseNumber` - Tepresents the branch for the upcoming release.

Simplified Gitflow workflow:

1. Create new feature/bug-fix branches from `develop`
2. Open PRs against `develop` branch
3. When all features/major bug fixes have been been completed and merged into `develop`, create a release branch `release/YYYY-MM-releaseNumber`
4. Complete end-to-end/integration testing; merge any small, last-minute bug fixes into this release branch
5. When all testing and user validation has been completed, merge `release/YYYY-MM-releaseNumber` into `main` and back into `develop`
6. Cut release from `main`
