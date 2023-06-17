---
id: team-structure
title: Project roles and teams
description: Teams, roles, and responsibilities in the Nebari OSS project
---

The Nebari project has a team-based governance structure, implemented using [GitHub's team features](https://github.com/orgs/nebari-dev/teams) for transparency.
This page documents the different teams (and members), the privileges and responsibilities of each team, and how you can join the teams.

:::tip
Use the table of contents in the right sidebar to jump to different sections of this page.
:::

## General teams

The following are the primary Nebari teams that form a part of the governance structure.

### Triage

Members of this team are responsible for triaging new and existing issues & pull requests (PRs) [following these guidelines](./maintainers/triage-guidelines), and [improving the issues/PRs](./file-issues#working-on-issues-to-improve-them) when needed. To do this, they have the ability to add relevant labels to issues/PRs, edit issue/PR titles and descriptions to improve them, and transfer issues to other Nebari repositories.

To join this team, you must have engaged with (created or commented on) at least one issue or PR or discussion topic in the Nebari GitHub organization. If you meet these requirements and would like to join the team, let us know by opening a GitHub discussions topic in the ["Community" category](https://github.com/orgs/nebari-dev/discussions/categories/community). Any Nebari team member (general or special interest team) can nominate people to join the Triage team, the same way through the Discussions Forum. Any member of the Core team can then approve and add people to the Triage team.

### Contributors

This team recognizes people who make valuable contributions to the Nebari project, by contributing to and maintaining the code, documentation or design assets, triaging issues/PRs, managing the community forums, fund raising, advocating for the project, and more.

Members of this team are usually also part of a special interest team, and have certain commit rights granted by the special interest team. The Contributors team does not have any extra privileges.

Any Nebari team member can nominate people (including themselves) to join this team by opening a GitHub discussions topic in the ["Community" category](https://github.com/orgs/nebari-dev/discussions/categories/community). Any member of the Core team can approve and add people to the Contributors team.

### Core

Core team members are responsible for leading and maintaining the overall Nebari project and community. They set a direction for the project and make the final decisions on project-wide initiatives.

<!-- TODO: Privileges: commit rights to all repos, create/archive repos, add/remove members? Merge with Owner? -->

Members of the "Contributors" team who regularly make high-quality, contributions to the project can be nominated to join the Core team. Any member of the "Contributors" or "Core" team can nominate people (including themselves) by opening a GitHub discussions topic in the ["Community" category](https://github.com/orgs/nebari-dev/discussions/categories/community). The Core team will come to a [consent-based decision](https://www.sociocracyforall.org/consent-decision-making/) to approve the request and add people to the Core team.

### Owners

<!-- TODO: Update based on:
- Do we want to keep this group or merge with Core team?
- If we keep this separate, what does it mean and how do people join this team?
-->

### Emeritus core

Open source projects have members join and retire as the project matures. Contributors move on for various reasons, like limited bandwidth, conflicting or changing interests, burnout, boredom, personal reasons, and much more.

The Emeritus core team recognizes community members who choose to step away from the Core team. Their contributions to the project are important, and the other Core team members are expected to support the member off-board and transfer their responsibilities smoothly.

Core team members can step away at any time, and we hope for them to communicate this to the rest of the Core team early if possible. They can share as much or little details as they are comfortable sharing for this move. We also hope they can work with the team for a smooth transition, but we do understand if sometimes this may not be possible.

## Special interest teams

The following teams are not strictly part of the governance structure, because members of these teams should also be in the Contributors team. New special interest teams can be created whenever the Contributors or Core team members see a need for it.

All members of the special interest group have the privileged of Triage team, the rights mentioned in the following section are in addition to the triage rights.

<!--- TODO: Should Triage team be a special interest team? -->

### Code

Community members who focus on code contributions, across the main codebase `nebari-dev/nebari` and supporting code repositories like `nebari-dev/nebari-docker-images`.

This team has commit rights across all the Nebari repositories, because they are all connected.

### Design

Community members who focus on design assets, they have commit rights to:

* `nebari-dev/nebari-design`
* `nebari-dev/nebari-docs`
* `nebari-jupyterhub-theme`

### Documentation

Community members who focus on documentation initiatives, they have commit rights to:

* `nebari-dev/nebari-docs`
* `nebari-dev/governance`

### Conduct

Community members who work to enforce [Nebari's Code of Conduct](https://github.com/nebari-dev/governance/blob/main/CODE_OF_CONDUCT.md).
At least one members of this team should also be in the Nebari Core team.
