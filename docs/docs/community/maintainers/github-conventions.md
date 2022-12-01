---
title: GitHub conventions
description: Guidelines and tips for maintaining Nebari
id: github-conventions
---

This page describes some common conventions and guidelines that we follow in all of our GitHub repositories within the `nebari-dev` organization.

## Issue labels

There are a few issue labels that we use to provide key metadata in our issues and Pull Requests.
These are added to all `nebari-dev/` repositories, and share the same meaning across each of them.

:::note
Repositories may define their own labels in addition to the ones described here to better reflect the areas
and scope of the project.
:::

### Issue type

**REQUIRED :pushpin:**

**Issue type** determines the kind of issue and implies what sorts of actions must be taken to close it.
Issue types are mutually-exclusive - **there may only be one issue type per issue**.

There are a few issue types that are defined for all repositories, for example:

- ![type: enhancement 💅🏼](https://img.shields.io/badge/-type:enhancement%20💅🏼-9D73D9.svg): an incremental improvement to something
- ![type: bug 🐛](https://img.shields.io/badge/-type:bug%20🐛-9D73D9.svg): a problem that needs to be fixed
- ![type: maintenance 🛠](https://img.shields.io/badge/-type:maintenance%20🛠-9D73D9.svg): regular maintenance and upkeep

In addition, other repositories may use repository-specific types, with the caveat that **all issues must still only have one `type` label**.

### Issue impact

**OPTIONAL**

Issue impact is used to signal how much of an impact resolving an issue will have.
The meaning of this depends on the issue type (for example, enhancement, bug).

The impact should be proportional to a combination of:

- The number of users that will be impacted by an issue's resolution,
- The extent of the impact our users will feel (for example a major change in experience versus minor improvement)
- The importance of communities or stakeholders that are impacted by the issue.

These are the impact labels for our issues:

![impact: high](https://img.shields.io/badge/-impact:%20high-F2A29B.svg)
![impact: medium](https://img.shields.io/badge/-impact:%20medium-F2A29B.svg)
![impact: low](https://img.shields.io/badge/-impact:%20low-F2A29B.svg)

#### Categorizing impact

Here are a few guidelines for how to categorize impact across a few major types of issues.

**Features / Enhancements**

- `impact: high`: Will be seen and commonly used by nearly all users. Has been requested by an abnormally large number of users.
    Is of particular importance to a key community.
- `impact: med`: Useful to many users but not an overwhelming amount. Will be a less-obvious improvement.
    Most issues should be in this category.
- `impact: low`: Useful but not a critical part of workflows. Is a niche use-case that only a few users may need.

**Bugs**

- `impact: high`: Disruptive to nearly all users, or critically disruptive to many users or key communities
  (for example, instances won't work at all).
- `impact: med`: Disruptive to some users, but not in a critical way. Only noticeable under circumstances that aren't very common.
  Most issues should be in this category.
- `impact: low`: Minimally disruptive or cosmetic, or only affects a few users or niche use-cases.
  Note that `accessibility` related issues should be `impact: high` as these are never purely cosmetic changes.

### Area tag

**OPTIONAL**

Tag labels provide hints about what topics that issue is relevant to.
They are highly repository-specific, optional, and non-exclusive (so issues may have many tags associated with them).

Here are some example tags:

- ![area: documentation 📖](https://img.shields.io/badge/-area:%20documentation%20📖-6FB7BF.svg): related to documentation in a repository
- ![area: CI 👷🏽‍♀️](https://img.shields.io/badge/-area:%20ci%20👷🏽‍♀️-6FB7BF.svg): related to continuous integration/deployment
- ![area: design 🎨](https://img.shields.io/badge/-area:%20design%20🎨-6FB7BF.svg): related to design items including UX/UI and graphic design

## Issue and PR templates

We use Issue and PR Templates to provide helpful prompts for common issues across all of our repositories.
These templates live in our [.github](https://github.com/nebari-dev/.github) repository and are automatically synchronized with several other repositories through a [GitHub Workflow](https://github.com/nebari-dev/.github/blob/main/.github/workflows/sync-issue-templates.yaml).

When you update one of the issue templates in that repository, a PR will automatically be created for the other repositories that are defined in the [sync.yml file](https://github.com/nebari-dev/.github/blob/main/.github/sync.yml).
