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
      link: { type: "doc", id: "get-started/index" },
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
        "tutorials/login-keycloak",
        "tutorials/using_dask",
        "tutorials/create-dashboard",
        "tutorials/creating-new-environments",
        "tutorials/jupyter-scheduler",
        "tutorials/argo-workflows-walkthrough",
      ],
    },
    {
      type: "category",
      label: "How-to Guides",
      link: { type: "doc", id: "how-tos/index" },
      items: [
        "how-tos/nebari-gcp",
        "how-tos/nebari-aws",
        "how-tos/nebari-azure",
        "how-tos/nebari-kubernetes",
        "how-tos/nebari-local",
        "how-tos/nebari-stages-directory",
        "how-tos/nebari-environment-management",
        "how-tos/nebari-destroy",
        "how-tos/domain-registry",
        "how-tos/debug-nebari",
        "how-tos/configuring-keycloak",
        "how-tos/configuring-smtp",
        "how-tos/using-vscode",
        "how-tos/manual-backup",
        "how-tos/nebari-upgrade",
        "how-tos/kubernetes-version-upgrade",
        "how-tos/setup-argo",
        "how-tos/using-argo",
        "how-tos/jhub-app-launcher",
        "how-tos/idle-culling",
        "how-tos/nebari-extension-system",
        "how-tos/telemetry",
        "how-tos/setup-monitoring",
        "how-tos/setup-healthcheck",
        "how-tos/access-logs-loki",
        "how-tos/use-gpus",
        "how-tos/develop-local-packages",
        "how-tos/install-pip-packages",
        "how-tos/fine-grained-permissions",
        "how-tos/connect-via-ssh",
        "how-tos/jupyter-gallery",
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
        "references/personas"
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
  ],
};
