---
id: decision-making
title: Decision making process
description: Decision making workflows for the Nebari OSS project
---

The Nebari Kubernetes Platform spans many repositories: a stable infrastructure core, the Nebari Operator, and a set of independently developed software packs.
Decision making is federated to match, and there are **two lanes**.

The first covers the overwhelming majority of decisions.

| Lane                                            | Who decides                        | When                                                       |
| ----------------------------------------------- | ---------------------------------- | ---------------------------------------------------------- |
| [Repository-local](#repository-local-decisions) | That repository's maintainers      | Anything confined to one repository                        |
| [Platform RFD](#platform-rfds)                  | [Core team][core-team], by consent | Changes that cross repositories or alter a shared contract |

## Consent-based decision making

Nebari follows the [consent-based approach][consent-decision-making] for making all project-related decisions.

In this approach, everyone gets a chance to:

- understand the proposals by asking questions,
- share their thoughts and reactions, and
- present any specific objections

Each objection is discussed and the proposal is updated accordingly. The proposal is accepted when the team reaches a point where there are no objections.

## Repository-local decisions

Anything confined to a single repository is decided by that repository's maintainers, through ordinary issue and pull request review.

This includes the repository's features, its dependencies, its release timing, and, for a software pack, its own maturity level.
No RFD is required, and nothing needs to be routed through the Core team.

Contributors are expected to (informally) follow the consent-based decision making philosophy in these discussions.

## Platform RFDs

A Request-for-discussion is required only for a change that crosses repository boundaries or alters a contract that other repositories depend on:

- the Pack Specification or the `NebariApp` custom resource
- the single sign-on, routing, or TLS conventions
- the security baseline
- the [repository standards][repo-standards]
- the [pack maturity model][pack-policy]
- the [project governance][governance] and the policies in the governance repository
- behavior in the Nebari Infrastructure Core that packs rely on

Adding or removing members of the [Nebari teams][nebari-team] also goes through the Core team, as described on that page.

### The process

1. Open an [RFD-issue in the governance repository][rfd-issue] with your proposal describing the details, benefits, impact, and more as mentioned in the issue template. The template applies the `type: RFD 🗳` and `needs: discussion 💬` labels for you.
2. Tag the `@nebari-dev/core-team` and any specific people for questions, comments, and objections on your proposal.
3. Answer questions and update the proposal addressing the objections. If there are major objections, the best course of action is declining the RFD, closing the issue, and opening a new RFD issue with the updated design proposal.
4. Once all comments are addressed, request the core-team to cast votes. Remove the `needs: discussion 💬` label and add `status: being voted 🗳` at this stage.
5. If more than 50% of Core team members vote yes, the proposal is accepted. Remove the `status: being voted 🗳` label and add `status: approved 💪🏾`. Do not close the issue yet.
6. Once the proposal is implemented, close the RFD issue.

Set the **Status** row in the RFD body to match the labels at each step. Each status has exactly one matching label, and an RFD carries exactly one status label at a time. Where the Status row and the labels disagree, the Status row is authoritative and the labels should be corrected. The [canonical table][rfd-lifecycle] lists every status and its label.

### How votes are counted

Spelled out so that anyone can reproduce a tally from the issue itself, months later, without asking who counted what:

- **A yes vote** is a 👍 or ❤️ reaction on the issue from a Core team member. Both count, and each person counts once however many reactions they leave.
- **Other reactions are not votes.** 👀 in particular is not a vote.
- **The denominator** is the human membership of the [`core-team`][core-team] GitHub team. Bot accounts in that team are excluded from it. "More than 50%" means strictly more than half, so with ten members it takes six votes, not five.
- **Where a vote is taken synchronously**, in a community meeting rather than by reaction, the outcome is recorded as a comment on the RFD issue naming the date and who was present. An unrecorded meeting decision cannot be audited afterwards, and is treated as not yet decided.

Learn more in [Gitpod's documentation on decision making][gitpod-rfd].

<!-- Reusable links -->

[nebari-team]: /community/team-structure
[core-team]: https://github.com/orgs/nebari-dev/teams/core-team
[consent-decision-making]: https://www.sociocracyforall.org/consent-decision-making/
[rfd-issue]: https://github.com/nebari-dev/governance/issues/new?assignees=&labels=type%3A+RFD+%F0%9F%97%B3&projects=&template=RFD.md&title=RFD+-+Title
[gitpod-rfd]: https://gitpod.notion.site/Decision-Making-RFCs-eb4a57f3a34f40f1afbd95e05322af70
[governance]: https://github.com/nebari-dev/governance/blob/main/GOVERNANCE.md
[repo-standards]: https://github.com/nebari-dev/governance/blob/main/repository-standards.md
[pack-policy]: https://github.com/nebari-dev/governance/blob/main/pack-policy.md
[rfd-lifecycle]: https://github.com/nebari-dev/governance/blob/main/GOVERNANCE.md#rfd-lifecycle
