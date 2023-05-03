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
      id: "welcome",
    },
    {
      type: "category",
      label: "Get Started",
      link: {
        type: "generated-index",
        title: "Get started",
        description:
          "This section describes how to install and deploy Nebari on a selection of cloud providers, and provides details on how Nebari can be configured and customized to fit a variety of deployment requirements.",
        slug: "category/get-started",
        keywords: ["get-started"],
      },
      items: [
        "get-started/quickstart",
        "get-started/installing-nebari",
        "get-started/deploy",
        "get-started/cloud-providers",
      ],
    },
    {
      type: "category",
      label: "Tutorials",
      link: { type: "doc", id: "tutorials/index" },
      items: [
        "tutorials/using_dask",
        "tutorials/creating-cds-dashboard",
        "tutorials/creating-new-environments",
        "tutorials/kbatch",
        "tutorials/cost-estimate-report",
      ],
    },
    {
      type: "category",
      label: "How-to Guides",
      link: { type: "doc", id: "how-tos/index" },
      items: [
        "how-tos/nebari-gcp",
        "how-tos/nebari-aws",
        "how-tos/nebari-do",
        "how-tos/nebari-azure",
        "how-tos/nebari-hpc",
        "how-tos/nebari-kubernetes",
        "how-tos/nebari-local",
        "how-tos/nebari-destroy",
        "how-tos/domain-registry",
        "how-tos/debug-nebari",
        "how-tos/login-keycloak",
        "how-tos/configuring-keycloak",
        "how-tos/using-vscode",
        "how-tos/manual-backup",
        "how-tos/nebari-upgrade",
        "how-tos/pytorch-best-practices",
        "how-tos/setup-argo",
        "how-tos/using-argo",
        "how-tos/idle-culling",
      ],
    },
    {
      type: "category",
      label: "Conceptual guides",
      link: { type: "doc", id: "explanations/index" },
      items: [
        "explanations/advanced-configuration",
        "explanations/security-configuration",
        "explanations/provider-configuration",
        "explanations/profile-configuration",
        "explanations/customize-themes",
        "explanations/environments-configuration",
        "explanations/custom-overrides-configuration",
        "explanations/config-best-practices",
        "explanations/infrastructure-architecture",
      ],
    },
    {
      type: "category",
      label: "Reference",
      link: { type: "doc", id: "references/index" },
      items: [
        "references/RELEASE",
      ],
    },
    {
      type: "category",
      label: "Community",
      link: {
        type: "doc", id: "community/index"
      },
      items: [
        "community/file-issues",
        "community/code-contributions",
        "community/nebari-tests",
        "community/doc-contributions",
        "community/style-guide",
        {
          type: "category",
          label: "Maintainers",
          items: ["community/maintainers/github-conventions",
            "community/maintainers/triage-guidelines",
            "community/maintainers/reviewer-guidelines",
            "community/maintainers/saved-replies",
            "community/maintainers/release-process-branching-strategy",
          ]
        }
      ],
    },
    {
      type: "doc",
      label: "Troubleshooting",
      id: "troubleshooting",
    },
    {
      type: "doc",
      label: "FAQ",
      id: "faq",
    },
    // TODO - uncomment once populated
    // {
    //   type: "doc",
    //   label: "Glossary",
    //   id: "glossary",
    // },
  ],
};
