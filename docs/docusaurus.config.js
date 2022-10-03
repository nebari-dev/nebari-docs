// Note: type annotations allow type checking and IDEs autocompletion
// @ts-check

// https://github.com/FormidableLabs/prism-react-renderer/tree/master/src/themes
const lightCodeTheme = require("prism-react-renderer/themes/nightOwlLight");
const darkCodeTheme = require("prism-react-renderer/themes/nightOwl");

// Adding reusable information
const githubOrgUrl = "https://github.com/nebari-dev";
const domain = "https://nebari.dev";
const githubForum = "https://github.com/orgs/nebari-dev/discussions"

// -----------------------------------------------------------------------------
// custom Fields for the project
const customFields = {
  copyright: `Copyright © ${new Date().getFullYear()} | Made with 💜   by the Nebari dev team `,
  meta: {
    title: "Nebari",
    description: "An opinionated JupyterHub deployment for Data Science teams",
    keywords: ["Jupyter", "MLOps", "Kubernetes", "Python"],
  },
  domain,
  githubOrgUrl,
  githubUrl: `${githubOrgUrl}/nebari`,
  githubDocsUrl: `${githubOrgUrl}/nebari/tree/main/docs`,
  githubForum,
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
  favicon: "logo/favicon.ico",
  staticDirectories: ['static'],

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  // Plugings need installing first then add here
  plugins: [
    "docusaurus-plugin-sass",
    require.resolve('docusaurus-lunr-search'),
  ],
  customFields: { ...customFields },

  // Add plausible as script
  scripts: [{ src: 'https://plausible.io/js/script.js', defer: true, 'data-domain': customFields.domain }],
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
          showLastUpdateAuthor: false,
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/scss/application.scss"),
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
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        logo: {
          alt: "Nebari logo - Docs home",
          src: "https://raw.githubusercontent.com/nebari-dev/nebari-design/main/logo-mark/horizontal/Nebari-Logo-Horizontal-Lockup-White-text.svg",
        },
        style: "dark",
        hideOnScroll: false,
        items: [
          // right navbar items
          {
            label: "Getting Started",
            position: "right",
            items: [
              {
                label: "Install Nebari",
                to: "getting-started/installing-nebari",
              },
              {
                label: "Cloud providers",
                to: "getting-started/cloud-providers",
              },
            ]
          },
          {
            label: "Documentation",
            position: "right",
            to: "/",
          },
          {
            label: "Community",
            position: "right",
            to: "community/overview",
          },
          {
            href: customFields.githubUrl,
            position: "right",
            className: "header-github-link",
            "aria-label": "Nebari GitHub repository",
          },
        ],
      },
      announcementBar: {
        id: 'rename_announcement',
        content:
          '⚠️ We are currently undergoing a rename from <a rel="noopener noreferrer" href="https://docs.qhub.dev/">QHub</a> to Nebari ⚠️ </br>You might see some references to <b>QHub</b> mainly in the context of commands or installation/setup in the meantime.',
        isCloseable: false,
      },
      footer: {
        copyright: customFields.copyright,
        style: "dark",
        links: [
          {
            title: "Documentation",
            items: [
              {
                label: "Getting Started",
                to: "getting-started/installing-nebari",
              },
              {
                label: "Tutorials",
                to: "tutorials",
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: "Nebari repository",
                href: customFields.githubUrl,
              },
              {
                label: "User forum",
                href: customFields.githubForum,
              },
            ],
          },
          {
            title: "More",
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
