---
id: team-structure
title: Project roles and teams
description: Teams, roles, and responsibilities in the Nebari OSS project
---

The Nebari project has a team-based governance structure, implemented transparently using [GitHub's team features](https://github.com/orgs/nebari-dev/teams).
This page documents the different teams, their privileges and responsibilities, and how you can join the teams.

:::tip
Use the table of contents in the right sidebar to jump to different sections of this page.
:::

## How access works

The Nebari Kubernetes Platform is a stable infrastructure core plus a set of independently developed software packs, each in its own repository.
Authority is federated to match that shape: pack maintainers own their repositories, and a small Core team owns the seams between them.

Two consequences worth stating plainly, because they differ from how the project used to work:

- **Access is granted per repository, following least privilege.** There is no team that carries commit rights across every Nebari repository.
- **Most decisions never reach Core.** Anything confined to a single repository is decided by that repository's maintainers.

The full model is in the [governance repository](https://github.com/nebari-dev/governance/blob/main/GOVERNANCE.md).

## Teams

The following teams are formally recognized by Nebari.

### Core

Project sustainers who lead and maintain the overall Nebari platform and community.

Core owns the cross-cutting contracts, the seams that every repository depends on:

- the Pack Specification and the `NebariApp` custom resource
- the single sign-on, routing, and TLS conventions
- the security baseline
- the [repository standards](https://github.com/nebari-dev/governance/blob/main/repository-standards.md) and the [pack policy](https://github.com/nebari-dev/governance/blob/main/pack-policy.md)
- the "official pack" designation, and the Nebari trademark and naming rules
- the platform roadmap, and the final call on platform RFDs

Core does not decide the day-to-day direction of individual repositories. Its mandate is deliberately narrow.

The [`core-team`](https://github.com/orgs/nebari-dev/teams/core-team) GitHub team is the authoritative record of who is on Core, and the size of its human membership sets the threshold for a [platform RFD vote](./decision-making#platform-rfds).
Keeping it accurate is part of the role.

### Owners

A private and small subset of the Core team who have organization-level privileges for [`nebari-dev`](https://github.com/nebari-dev). While decisions are made by the entire Core team, the Owners group has relevant permissions to implement certain decisions like adding new team members, creating repositories, and applying organization rulesets.

### Pack maintainers

The people who maintain a specific repository, usually a software pack.

Pack maintainers hold write or admin access on **their** repository only, and have full autonomy over its features, releases, dependencies, maturity level, and day-to-day decisions.
Each repository lists its maintainers in a `MAINTAINERS.md` file, and that file, rather than this page, is the authoritative list for it.

### Contributors

People who make valuable contributions to the Nebari projects in the form of code contributions, documentation improvements, or design enhancements, issues and PR triage, community management, fundraising, advocacy, and more.

Anyone can contribute by opening a pull request; no membership is required.
Commit and triage access on a given repository is granted by that repository's maintainers as trust is established, as described in [triage and commit access](#triage-and-commit-access) below.

### Code of Conduct response team

Community members responsible for upholding and enforcing Nebari's Code of Conduct. This team is documented in the [Nebari governance repository](https://github.com/nebari-dev/governance/blob/main/code-of-conduct/coc_enforcement.md#the-code-of-conduct-committee). At least one member of this team should also be in the Nebari Core team, and all members should be trained to handle CoC reports with care[^1].

Its scope is organization-wide. Software packs maintained outside the `nebari-dev` organization are not covered; the Code of Conduct is offered as a recommended default downstream rather than imposed.

[^1]: Members can attend any form of online or in-person training on dealing with CoC reports.

### Emeritus core

The Emeritus core team recognizes community members who choose to step away from the Core team. Open source projects have members join, retire, and return as the project matures. Contributors can move on for various reasons including limited bandwidth, conflicting or changing interests, burnout, boredom, personal reasons, and much more.

Nebari Core team members can step away at any time, and we hope for them to communicate this to the rest of the Core team early when possible. They can share as much or as little details as they are comfortable sharing for this move. We also hope they can work with the team for a smooth transition, but we do understand if sometimes this may not be possible. Fellow core team members are expected to support off-boarding members for a graceful transfer of responsibilities.

Emeritus members are welcome return to the project as active participants, and join the core team again through the process of nomination described earlier.

## Triage and commit access

[Triaging](./maintainers/triage-guidelines) and [improving](./file-issues#working-on-issues-to-improve-them) issues and pull requests is one of the most useful ways to contribute. Triage access lets you add labels, edit issue and PR titles and descriptions, and transfer issues between repositories.

Triage and commit access are granted **per repository** by that repository's maintainers, as trust is established. There is no standing organization-wide Triage team, and no team that carries commit rights everywhere.

If you have been triaging issues on a repository and would like access, ask its maintainers, either on an issue or in the [discussion forum](https://github.com/orgs/nebari-dev/discussions/categories/community).

:::note
Members of the previous organization-wide Triage team keep triage access on the repositories they are active in.
:::

## Working groups

Standing special interest groups (SIGs) are retired as a concept. The pack repository is now the natural working-group unit: a pack has its own repository, its own maintainers, and its own decisions, which is what a SIG used to approximate.

The Core team may still convene an ad-hoc working group for a genuinely cross-cutting topic, such as security or documentation, and dissolve it when the work is done.

## Join a team

Nebari follows a nomination process to add new team members[^2], as detailed in the following table. You can nominate members by opening a GitHub discussions topic in the ["Community" category](https://github.com/orgs/nebari-dev/discussions/categories/community).

[^2]: All except the [Emeritus core](#emeritus-core) team are decided through nominations.

| Team            | Requirements for nomination                                                                                                                                     | Nominators                                                     | Approvers                                                                                             |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Pack maintainer | A record of regular, valuable contributions to that repository, with intention to continue maintaining it                                                       | Any community member (including self)                          | That repository's existing maintainers, or Core for a new repository                                  |
| Core            | A record of regular, valuable, and high-quality contributions to Nebari for at least one month, and willingness to take responsibility for the platform's seams | Any community member (including self) and one Core team member | Core team makes a [consent-based decision](https://www.sociocracyforall.org/consent-decision-making/) |
| Conduct         | A contributor or Core team member with adequate training to handle CoC reports                                                                                  | Any community member (including self)                          | Core team makes a [consent-based decision](https://www.sociocracyforall.org/consent-decision-making/) |

Commit and triage access on a single repository is not a team and does not need a nomination. See [triage and commit access](#triage-and-commit-access).

Before approving the nomination, approvers must verify the individual's authenticity and credentials through heuristics like:

- Checking the nominee's GitHub activity history: account creation date, contributions to other open source projects, etc.
- Interactions with the nominee in community meetings or conferences.
- Endorsement from a trusted collaborator.

The Owners team is responsible for updating team memberships on GitHub. For a new pack maintainer, the repository's maintainers can grant repository access directly.

## Leave a team

Pack maintainers and Core team members may choose to leave their respective teams at any time and for any reason. They can communicate their decision either privately to the Core team or publicly on the Nebari discussion forum.

To ensure project security, the Core team can make a [consent-based decision](https://www.sociocracyforall.org/consent-decision-making/) to remove inactive members from any team. In this context, _inactive_ refers to individuals who have not engaged in any Nebari spaces, such as GitHub repositories under the Nebari organization or community meetings, for a period of over two months.

The Owners team is responsible for updating team memberships accordingly and documenting the changes in the Nebari discussion forum. By default, former Core team members are added to the Emeritus team unless they explicitly request otherwise.
