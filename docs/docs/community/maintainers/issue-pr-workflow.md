---
id: github-tasks
title: Review and triage guidelines
description: Guidelines and tips for maintaining Nebari
---

## Issue triaging guidelines

Issue triage is a process by which Nebari maintainers and contributors intake and reviews new GitHub issues and requests,
and organize them to be actioned. Triaging involves categorizing issues and Pull Requests based on factors such as priority, area of ownership of the issue (tags), and the issue kind (bug, feature, and so on).

Triage can happen asynchronously and continuously, or in regularly scheduled meetings.

## Why Is Triaging Beneficial?

Projects that triage regularly say it offers a number of benefits, such as:

- Speeding up issue management
- Keeping contributors engaged by shortening response times
- Preventing work from lingering endlessly
- Replacing niche requests and one-offs with a neutral process that acts like a boundary
- Greater transparency, interesting discussions, and more collaborative, informed decision-making
- Building prioritization, negotiation and decision-making skills, which are critical to most tech roles
- Reinforcement of the project's community and culture

People who enjoy product management and iterating on processes tend to enjoy triaging because it empowers their project to maintain a steady,
continuous flow of work that is assessed and prioritized based on feedback, impact, and value.

## Triaging workflow

### Step 1: Review newly created issues

The first step in a triaging workflow is to review the newly created open issues in the repository.
An efficient way to do this is by using the `is:issue is:open sort:created-dec` query in the repository's issue search,
which will show the most recently created issues first (see an example of this in the [nebari issue tracker](https://github.com/nebari-dev/nebari/issues?q=is%3Aissue+is%3Aopen+sort%3Acreated-desc)).

Other useful queries include:

|Query | Example search                                                                                                       | What it sorts                                           |
|------| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- |
|`is:issue is:open label:"needs: follow-up 📥" `| [needs-follow-up nebari](https://github.com/nebari-dev/nebari/issues?q=is%3Aissue+is%3Aopen+label%3A%22needs%3A+follow-up+%F0%9F%93%A5%22+)        | Issues that need to be following up from a maintainer                |
|`is:issue is:open sort:created-asc no:label`| [created-ascending nebari](https://github.com/nebari-dev/nebari/issues?q=is%3Aissue+is%3Aopen+sort%3Acreated-asc+no%3Alabel)     | Untriaged issues by age                                 |
|`is:issue is:open sort:comments-desc`| [comments-descending nebari](https://github.com/nebari-dev/nebari/issues?q=is%3Aissue+is%3Aopen+sort%3Acomments-desc) | Busiest issues, sorted by # of comments       |
|`is:issue is:open sort:created-dec`| [new-issues nebari](https://github.com/nebari-dev/nebari/issues?q=is%3Aopen+is%3Aissue)                 | Newest incoming issues                                  |

### Step 2: Triage issue by type and area

Detailed rationale on our labelling system can be found in the [GitHub convention section](./github-conventions.md) of our documentation.

:::tip TLD'R
Assign one and only one `type:` label to the issue and as many `area:` labels as are relevant.
:::

Opening new issues and leaving comments on other people's issues are possible for all contributors.
However, permission to assign specific labels (such as `type: enhancement 💅🏼`), change milestones,
or close other contributors issues is only granted to the author of an issue, assignees, and organization members.

Depending on your permissions, either close or comment on any issues that are identified as support requests, duplicates,
or not-reproducible bugs, or that lack enough information from the reporter.

### Abandoned or Wrongly Placed Issues

If an issue is abandoned or in the wrong place, either close or comment on it.

### Needs More Information

The `needs: investigation 🔍` label indicates an issue needs more information in order for work to continue; comment on or close it.

### Bugs

First, validate if the problem is a bug by trying to reproduce it.

If you can reproduce it:

- [Define its priority.](##step-three-define-priority)
- Search for duplicates to see if the issue has been reported already. If a duplicate is found, let the issue reporter know,
  reference the original issue, and close the duplicate.

If you can't reproduce it:

- Contact the issue reporter with your findings.
- Close the issue if both the parties agree that it could not be reproduced.

If you need more information to further work on the issue:

- Let the reporter know it by adding an issue comment, and label the issue with `needs: investigation 🔍`.

In all cases, if you do not get a response within 20 days, close the issue with an appropriate comment.
If you have permission to close someone else's issue, first `assign` the issue to yourself, then `close` it.
If you do not, please leave a comment describing your findings.
