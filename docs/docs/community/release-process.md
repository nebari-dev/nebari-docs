---
id: release-process
title: Release process
description: Release process
---

# The Nebari release process

This page describes the high-level details of cutting a new Nebari release.

|        Cadence        |               Versioning System                |                                                                                    Release Checklist                                                                                     |                                                                                        Testing Checklist                                                                                         |
| :-------------------: | :--------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| 3rd week of the month | [CalVer](#calver-details) - (i.e. `2022.10.1`) | [Link to issue template](https://github.com/nebari-dev/nebari/issues/new?assignees=&labels=type%3A+release+%F0%9F%8F%B7&template=release-checklist.md&title=%5BRELEASE%5D+%3Cversion%3E) | [Link to issue template](https://github.com/nebari-dev/nebari/issues/new?assignees=&labels=type%3A+release+%F0%9F%8F%B7&template=testing-checklist.md&title=Testing+checklist+for+%3Cversion%3E) |

## Release Captain responsibilities

For every release, there is an assigned "Release Captain". The Release Captain's responsibilities are:

- Manage both the release and testing processes and update the checklists as needed.
- Communicate the status of the release to the rest of the Nebari development team and the community (through updating the checklists and adding status updates as comments).
- Assign owners to checklist items (if not owned by the Release Captain).
- Adjust the schedule, particularly the publishing dates, based on defects found, fixes made, holidays, vacations, and so on.
- Ensure a new branch and milestone is created after completing a release cycle.

## CalVer details

Nebari releases should follow the following CalVer versioning style:

```
YYYY-MM-releaseNumber
```

:::info
`YYYY` represents the year - i.e. `2023`

`MM` represents the _non-zero padded_ month - i.e. `1` for January, `12` for December

`releaseNumber` represents the current release for that month, starting at `1`. Anything above `1` represents a [hotfix (patch) release](#hotfixes).
:::

:::caution
For the release tag, there should be NO prepended `v`
:::

For example, the first Nebari CalVer release was `2022.10.1`. If a hotfix release was needed in the same month, we increment the `releaseNumber` by 1, which would be `2022.10.2` (_this is to illustrate how the increment works, this release does not exist._)

## Gitflow and branching strategy

Gitflow is framework for managing `git` branches by assigning certain roles to particular branches.

- `main` - Represents a production-ready state of the code-base, with an appropriate tag to match the most recent release.

- `release/YYYY-MM-releas1eNumber` - Represents the branch for the upcoming release and is the _default_ branch on the GitHub repository.

### Process

Although this process is captured in the [release checklist template](https://github.com/nebari-dev/nebari/issues/new?assignees=&labels=type%3A+release+%F0%9F%8F%B7&template=release-checklist.md&title=%5BRELEASE%5D+%3Cversion%3E), it's worth making clear how branches are managed.

Whenever a new release is out, it is the responsibility of the Release Captain to create a new release branch, `release/YYYY-MM-releaseNumber` for the next month's release and to set this new branch as the default branch on the GitHub repository.
Setting this as the default branch ensures that new Pull Requests will automatically default to submitting against it. Force pushes are not allowed to these branches.

Active development occurs against the `release/YYYY-MM-releaseNumber` branch.

#### Hotfixes

In the event that a patch or hotfix release is needed, a pull request is still opened against the current release branch.

However after it has been merged, this commit can be cherry-picked and merged into a hotfix branch. This hotfix or patch branch is created off of the last release but with an incremented `releaseNumber`. From here, the release checklist should be able to guide us through the remaining steps.
