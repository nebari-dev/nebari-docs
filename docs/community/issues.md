---
id: file-issues
title: Opening and working on issues
description: Best practices for opening and triaging issues
---

## Submitting a bug report or a feature request

The [Nebari issue tracker][nebari-issues] is the preferred channel for bug reports, documentation requests, and
submitting pull requests.

To resolve your issue, please select the appropriate category and follow the prompts to provide as much information as
possible:

- [Bug Report](https://github.com/nebari-dev/nebari/issues/new?assignees=&labels=type%3A+bug+%F0%9F%90%9B%2Cneeds%3A+triage+%F0%9F%9A%A6&template=bug-report.yml&title=%5BBUG%5D+-+%3Ctitle%3E)
- [Feature request](https://github.com/nebari-dev/nebari/issues/new?assignees=&labels=type%3A+enhancement&template=feature-request.yml&title=%5BENH%5D+-+%3Ctitle%3E)
- [Documentation](https://github.com/nebari-dev/nebari/issues/new?assignees=&labels=area%3A+documentation+%F0%9F%93%96&template=documentation.yml&title=%5BDOC%5D+-+%3Ctitle%3E)
- [General issue](https://github.com/nebari-dev/nebari/issues/new?assignees=&labels=needs%3A+triage+%F0%9F%9A%A6&template=general-issue.yml&title=%3Ctitle%3E)

## Best practices

When opening an issue, use a **descriptive title** and include your environment (operating system, Python version, Nebari version).
Our issue template helps you remember the most important details to include. A few more tips:

- **Describing your issue**: Try to provide as many details as possible. What exactly goes wrong? How is it failing?
  Is there an error? "XY doesn't work" usually isn't that helpful for tracking down problems. Always remember to include the code you ran and if possible,
  extract only the relevant parts and don't dump your entire script. This will make it easier for us to reproduce the error.

- **Getting info about your Nebari installation and environment**: You can use the command line interface to print details and even format them as Markdown to copy-paste into GitHub issues.

- **Sharing long blocks of code or logs**: If you need to include long code, logs or trace backs, you can wrap them in `<details>` and `</details>`.
  This collapses the content, so it only becomes visible on click, making the issue easier to read and follow.

:::tip
See this page for an overview of the [system we use to tag our issues and pull requests](./maintainers/github-conventions.md).
You can also see all the available labels in the [Nebari repository][nebari-labels].
:::

For bug reports, include in your issue:

- Follow the issue template prompting you for each entry
- A reproduction for debugging and taking action

## Suggested workflow

If an issue is affecting you, start at the top of this list and complete as many tasks on the list as you can:

1. Check the [issue tracker][nebari-issues], if there is an open issue for this same problem, add a reaction or more details to the issue
   to indicate that it’s affecting you (tip: make sure to also check the open [pull requests][nebari-prs] for ongoing work).
2. You should also check the [troubleshooting guide](../troubleshooting.mdx) in these docs to see if your problem is already listed there.
3. If there is an open issue, and you can add more detail, write a comment describing how the problem is affecting you,
   OR if you can, write up a work-around or improvement for the issue.
4. If there is not an issue, write the most complete description of what’s happening including reproduction steps.
5. [Optional] - Offer to help fix the issue (and it is totally expected that you ask for help; open-source maintainers want to help contributors).
<!-- 6. TODO link to the PR section of the docs -->
6. If you decide to help to fix the issue, deliver a well-crafted, tested PR.

## Working on issues to improve them

Improving issues increases their chances of being successfully resolved. A third party can give useful feedback or even add comments on the issue.
The following actions are typically useful:

- Documenting issues that are missing elements to reproduce the problem such as code samples.
- Suggesting better use of code formatting.
- Suggesting reformulating the title and description to make them more explicit about the problem to be solved.
- Linking to related issues or discussions while briefly describing how they are related, for instance “See also #xyz for a similar attempt at this” or “See also #xyz where the same thing happened in another cloud provider" provides context and helps the discussion.
- Summarizing long discussions on issues to help new and existing contributors quickly understand the background, current status, and course of action for the issue.

<!-- links -->

[nebari-issues]: https://github.com/nebari-dev/nebari/issues
[nebari-labels]: https://github.com/nebari-dev/nebari/labels
[nebari-prs]: https://github.com/nebari-dev/nebari/pulls
