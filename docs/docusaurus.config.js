// Note: type annotations allow type checking and IDEs autocompletion
// @ts-check

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

// Adding reusable information
const githubOrgUrl = "https://github.com/nebari-dev";
// TODO: verify this
const domain = "https://nebari-docs.netlify.app";

// -----------------------------------------------------------------------------
// custom Fields for the project
const customFields = {
  copyright: `Copyright © ${new Date().getFullYear()} | Made with 💜   by the Nebari dev team `,
  meta: {
    title: "Nebari",
    description: "An opinionated JupyterHub deployment for Data Science teams",
    // TODO: placeholder
    keywords: ["Jupyter", "MLOps", "Kubernetes", "Python"],
  },
  domain,
  githubOrgUrl,
  githubUrl: `${githubOrgUrl}/nebari`,
  githubDocsUrl: `${githubOrgUrl}/nebari/tree/main/docs`,
};

// -----------------------------------------------------------------------------
// Main site config
/** @type {import('@docusaurus/types').Config} */
const config = {
  title: customFields.meta.title,
  tagline: customFields.meta.description,
  url: customFields.domain,
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  // Plugings need installing first then add here
  plugins: ["docusaurus-plugin-sass"],
  customFields: { ...customFields },

  // ---------------------------------------------------------------------------
  // Edit presets
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          path: "docs",
          admonitions: {
            icons: "emoji",
          },
          sidebarPath: require.resolve("./sidebars.js"),
          sidebarCollapsible: true,
          // points to the Nebari repo
          // Remove this to remove the "edit this page" links.
          editUrl: customFields.githubDocsUrl,
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          // remarkPlugins: [
          //   [require('@fec/remark-a11y-emoji/gatsby'), { sync: true }],
          // ],
        },
        blog: false,
        theme: {
          customCss: require.resolve("./css/custom.css"),
        },
      }),
    ],
  ],

  // ---------------------------------------------------------------------------
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          autoCollapseCategories: true,
          hideable: true,
        },
      },
      navbar: {
        title: customFields.meta.title,
        logo: {
          alt: "Nebari logo - Docs home",
          // TODO: Replace with logo
          src: "img/logo.svg",
        },
        hideOnScroll: true,
        items: [
          // left side
          //   {
          //     label: 'Quickstart',
          //     docId: 'quickstart',
          //     position: 'left',
          //     type: 'doc',
          //   },
          // right side
          {
            label: "Tutorials",
            position: "right",
            to: "tutorials/overview",
          },
          {
            label: "How-to Guides",
            position: "right",
            to: "how-tos/overview",
          },
          {
            label: "Reference",
            position: "right",
            to: "references/overview",
          },
          {
            label: "Conceptual Guides",
            position: "right",
            to: "explanations/overview",
          },
          {
            label: "Community",
            position: "right",
            to: "governance/overview",
          },
          {
            href: customFields.githubUrl,
            position: "right",
            className: "header-github-link",
            "aria-label": "GitHub repository",
          },
        ],
      },
      footer: {
        copyright: customFields.copyright,
        style: "dark",
        links: [
          {
            title: "Open source",
            items: [
              {
                label: "Quickstart",
                to: "quickstart",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Nebari repository",
                href: customFields.githubUrl,
              },
            ],
          },
          {
            title: "Other",
            items: [
              {
                html: `
                <a href="https://www.netlify.com" target="_blank" rel="noreferrer noopener" aria-label="Deploys by Netlify">
                  <img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg" alt="Deploys by Netlify" width="114" height="51" />
                </a>
              `,
              },
            ],
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
