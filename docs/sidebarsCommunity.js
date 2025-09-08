/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */

module.exports = {
    sidebar: [
        {
        label: "Introduction",
        type: "doc",
        id: "introduction",
        },
        {
        type: "category",
        label: "Contributors",
        items: [
          "file-issues",
          "code-contributions",
          "nebari-tests",
          "doc-contributions",
          "style-guide",
        ],
      },
      {
        type: "category",
        label: "Maintainers",
        items: [
          "maintainers/github-conventions",
          "maintainers/triage-guidelines",
          "maintainers/reviewer-guidelines",
          "maintainers/saved-replies",
          "maintainers/release-process-branching-strategy",
        ],
      },
      {
        type: "category",
        label: "Design",
        items: [
          "design/personas",
        ]
      },
      {
        type: "category",
        label: "Governance",
        items: [
          "team-structure",
          "decision-making",
        ]
      },
      {
        type: "doc",
        id: "plugins",
      },
    ],
  };
