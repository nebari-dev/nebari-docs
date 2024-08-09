---
id: decision-making
title: Decision making process
description: Decision making workflows for the Nebari OSS project
---

Nebari's [core team][core-team] is the primary decision making authority for the project.

This group makes decisions about the following non-exhaustive list of items:

- Major updates to the Nebari project and community, through the Request-for-discussion (RFD) process (see explanation below)
- Adding and removing members from the [Nebari team following the guidelines][nebari-team]

## Consent-based decision making

Nebari follows the [consent-based approach][consent-decision-making] for making all project-related decisions.

In this approach, everyone gets a chance to:

- understand the proposals by asking questions,
- share their thoughts and reactions, and
- present any specific objections

Each objection is discussed and the proposal is updated accordingly. The proposal is accepted when the team reaches a point where there are no objections.

## Major updates - Request-for-discussion (RFD) process

New features, sub-projects, and workflow changes that affect a majority of end-users of the core project or the Nebari community, need to follow the Request-for-discussion workflow (sometimes called Enhancement Proposals):

1. Open an [RFD-issue in the governance repository][rfd-issue] with your proposal describing the details, benefits, impact, and more as mentioned in the issue template. Add the following labels to the issue: `needs: discussion 💬`, `type: RFD 🗳`
2. Tag the `@nebari-dev/core-team` and any specific people for questions, comments, and objections on your proposal.
3. Answer questions and update the proposal addressing the objections. If there are major objections, the best course of action is declining the RFD, closing the issue, and opening a new RFD issue with the updated design proposal.
4. Once all comments are addressed, request the core-team to cast votes. Team members are expected to vote "yes" with a 👍 reaction on the proposal if they have no objection. Votes can also be taken over synchronous community meetings. In this case, the decision is documented with a comment on the RFD issue. Remove the `needs: discussion 💬` label and add `status: being voted 🗳` at this stage.
5. If over 50% of team members vote "yes", the proposal is accepted. Remove the `status: being voted 🗳` label and add `status: approved 💪🏾`. Do not close the issue yet.
6. Once the proposal is implemented, close the RFD issue.

Learn more in [Gitpod's documentation on decision making][gitpod-rfd].

## Minor updates - Discussion in issues and pull requests

Minor updates to the codebase and documentation can be discussed in GitHub issues or in pull requests during code review. Contributors are expected to (informally) follow the consent-based decision making philosophy in these discussions.

<!-- Reusable links -->

[nebari-team]: /docs/community/team-structure
[core-team]: https://github.com/orgs/nebari-dev/teams/core-team
[consent-decision-making]: https://www.sociocracyforall.org/consent-decision-making/
[rfd-issue]: https://github.com/nebari-dev/governance/issues/new?assignees=&labels=type%3A+RFD&projects=&template=RFD.md&title=RFD+-+Title
[gitpod-rfd]: https://gitpod.notion.site/Decision-Making-RFCs-eb4a57f3a34f40f1afbd95e05322af70
