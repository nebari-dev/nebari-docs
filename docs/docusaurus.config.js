// Note: type annotations allow type checking and IDEs autocompletion
// @ts-check

// https://github.com/FormidableLabs/prism-react-renderer/tree/master/src/themes
const lightCodeTheme = require("prism-react-renderer/themes/nightOwlLight");
const darkCodeTheme = require("prism-react-renderer/themes/nightOwl");

// Adding reusable information
const githubOrgUrl = "https://github.com/nebari-dev";
const domain = "nebari.dev";
const url = "https://nebari.dev";
const githubForum = "https://github.com/orgs/nebari-dev/discussions"

// -----------------------------------------------------------------------------
// custom Fields for the project
const customFields = {
  copyright: `Copyright © ${new Date().getFullYear()} | Made with 💜   by the Nebari dev team `,
  meta: {
    title: "Nebari",
    description: "Your open source data science platform. Built for scale, designed for collaboration.",
    keywords: ["Jupyter", "MLOps", "Kubernetes", "Python", "Dask"],
  },
  domain,
  githubOrgUrl,
  githubUrl: `${githubOrgUrl}/nebari-docs`,
  githubDocsUrl: `${githubOrgUrl}/nebari-docs/tree/main/docs`,
  githubCodebaseUrl: `${githubOrgUrl}/nebari`,
  githubForum,
  url,
};

// -----------------------------------------------------------------------------
// Main site config
/** @type {import('@docusaurus/types').Config} */
const config = {
  title: customFields.meta.title,
  tagline: customFields.meta.description,
  url: customFields.url,
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "logo/favicon.ico",
  staticDirectories: ["static"],

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  // Plugings need installing first then add here
  plugins: [
    "docusaurus-plugin-sass",
    require.resolve("docusaurus-lunr-search"),
  ],
  customFields: { ...customFields },

  // Add plausible as script
  scripts: [
    {
      src: "https://plausible.io/js/script.js",
      defer: true,
      "data-domain": customFields.domain,
    },
  ],
  // ---------------------------------------------------------------------------
  // Edit presets
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: "docs",
          routeBasePath: "docs",
          admonitions: {
            icons: "emoji",
          },
          sidebarPath: require.resolve("./sidebars.js"),
          sidebarCollapsible: true,
          // points to the Nebari repo
          // Remove this to remove the "edit this page" links.\
          editUrl: customFields.githubDocsUrl,
          showLastUpdateAuthor: false,
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/scss/application.scss"),
        },
        pages: {
          path: "src/pages",
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
          {
            label: "Home",
            position: "right",
            to: "/",
          },
          {
            label: "Get Started",
            position: "right",
            items: [
              {
                label: "Quickstart",
                to: "docs/get-started/quickstart",
              },
              {
                label: "Installing Nebari",
                to: "docs/get-started/installing-nebari",
              },
              {
                label: "Choosing a deployment platform",
                to: "docs/get-started/deploy",
              },
              {
                label: "Supported cloud providers",
                to: "docs/get-started/cloud-providers",
              },
            ],
          },
          {
            label: "Docs",
            position: "right",
            to: "/docs/welcome",
          },
          {
            label: "Community",
            position: "right",
            to: "docs/community",
          },
          {
            label: "GitHub",
            position: "right",
            items: [
              {
                label: "Code repository",
                href: customFields.githubCodebaseUrl,
              },
              {
                label: "Documentation repository",
                href: customFields.githubUrl,
              },
            ]
          },
        ],
      },
      footer: {
        copyright: customFields.copyright,
        style: "dark",
        links: [
          {
            title: "Documentation",
            items: [
              {
                label: "Get Started",
                to: "docs/get-started/installing-nebari",
              },
              {
                label: "Tutorials",
                to: "docs/tutorials",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Nebari roadmap",
                href: "https://github.com/nebari-dev/governance/blob/main/roadmap.md",
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
