// Note: type annotations allow type checking and IDEs autocompletion
// @ts-check

// https://github.com/FormidableLabs/prism-react-renderer/tree/master/src/themes
const { themes } = require('prism-react-renderer');
const lightCodeTheme = themes.nightOwlLight;
const darkCodeTheme = themes.nightOwl;

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
  // ---------------------------------------------------------------------------
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
        pages: {
          path: "src/pages",
        },
      }),
    ],
  ],
  // ---------------------------------------------------------------------------
  // Plugins need installing first then add here
  plugins: [
    "docusaurus-plugin-sass",
    require.resolve("docusaurus-lunr-search"),
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'community',
        path: 'community',
        routeBasePath: 'community',
        sidebarPath: './sidebarsCommunity.js',
      },
    ]
  ],
  customFields: { ...customFields },

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
            label: "Nebari",
            position: "left",
            to: "/docs/welcome",
          },
          {
            label: "Community",
            position: "left",
            to: "community/introduction",
          },
          {
            label: "Get Started",
            position: "right",
            to: "docs/get-started",
          },
          {
            label: "Ecosystem",
            position: "right",
            items: [
              {
                label: "JHub Apps Launcher",
                href: "https://jhub-apps.nebari.dev",
              },
              {
                label: "Jupyter Launchpad",
                href: "https://github.com/nebari-dev/jupyterlab-new-launcher",
              },
              {
                label: "JupyterLab Gallery",
                href: "https://github.com/nebari-dev/jupyterlab-gallery",
              },
              {
                label: "Plugins and extensions",
                to: "community/plugins",
              },
            ]
          },
          {
            label: "GitHub",
            position: "right",
            items: [
              {
                label: "Nebari code repository",
                href: customFields.githubCodebaseUrl,
              },
              {
                label: "Nebari documentation repository",
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
