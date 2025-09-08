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
      label: "Usage tutorials",
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
      label: "Usage how-tos",
      link: { type: "doc", id: "how-tos/index" },
      items: [
        "how-tos/jhub-app-launcher",
        "how-tos/using-vscode",
        "how-tos/use-gpus",
        "how-tos/develop-local-packages",
        "how-tos/install-pip-packages",
        "how-tos/connect-via-ssh",
        "how-tos/using-argo",
        "how-tos/access-logs-loki",
      ],
    },
    {
      type: "category",
      label: "Administration how-tos",
      link: { type: "doc", id: "how-tos/index" },
      items: [
        {
          type: 'category',
          label: 'Initial deployment setup',
          items: [
            "get-started/quickstart",
            "get-started/installing-nebari",
            "how-tos/nebari-environment-management",
            "get-started/deploy",
            "how-tos/domain-registry",
            {
              type: 'category',
              label: 'Supported cloud providers',
              link: { type: 'doc', id: "get-started/cloud-providers" },
              items: [
                "how-tos/nebari-gcp",
                "how-tos/nebari-aws",
                "how-tos/nebari-azure",
                "how-tos/nebari-kubernetes",
                "how-tos/nebari-local",
              ],
            },
          ]
        },
        {
          type: "category",
          label: "Configure Nebari",
          items: [
            "how-tos/configuring-keycloak",
            "how-tos/fine-grained-permissions",
            "explanations/advanced-configuration",
            "explanations/security-configuration",
            "explanations/provider-configuration",
            "explanations/profile-configuration",
            "explanations/customize-themes",
            "explanations/environments-configuration",
            "explanations/custom-overrides-configuration",
            "how-tos/configuring-smtp",
            "explanations/config-best-practices",
            "how-tos/setup-monitoring",
            "how-tos/setup-healthcheck",
            "how-tos/telemetry",
            "how-tos/setup-argo",
          ],
        },
        {
          type: "category",
          label: "Maintain Nebari",
          items: [
            "how-tos/nebari-upgrade",
            "how-tos/kubernetes-version-upgrade",
            "how-tos/manual-backup",
            "how-tos/debug-nebari",
            "how-tos/idle-culling",
            "how-tos/nebari-destroy",
          ],
        },
        "how-tos/nebari-extension-system",
      ],
    },
    {
      type: "category",
      label: "Conceptual guides",
      link: { type: "doc", id: "explanations/index" },
      items: [
        "explanations/infrastructure-architecture",
        "how-tos/nebari-stages-directory",
      ],
    },
    {
      type: "category",
      label: "Reference",
      link: { type: "doc", id: "references/index" },
      items: [
        "references/RELEASE",
        "troubleshooting",
        "faq",
      ],
    },
  ],
};
