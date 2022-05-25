// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// Adding reusable information
const githubOrgUrl = 'https://github.com/nebari-dev';
// TODO: verify this
const domain = 'https://nebari-docs.netlify.app';

// -----------------------------------------------------------------------------
// custom Fields for the project
const customFields = {
  copyright: `Made with 💜   by the Nebari dev team`,
  meta: {
    title: 'Nebari',
    description: 'An opinionated JupyterHub deployment for Data Science teams',
    // TODO: placeholder
    keywords: [
      'Jupyter',
      'MLOps',
      'Kubernetes',
      'Python',
    ],
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
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Plugings need installing first then add here
  plugins: [
    'docusaurus-plugin-sass',
  ],
  customFields: { ...customFields },

  // ---------------------------------------------------------------------------
  // Edit presets
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs',
          admonitions: {
            icons: 'emoji',
          },
          sidebarPath: require.resolve('./sidebars.js'),
          // points to the Nebari repo
          // Remove this to remove the "edit this page" links.
          editUrl: customFields.githubDocsUrl,
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,          // ],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  // ---------------------------------------------------------------------------
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: customFields.meta.title,
        logo: {
          alt: 'Nebari logo - Docs home',
          // TODO: Replace with logo
          src: 'img/logo.svg',
        },
        hideOnScroll: true,
        items: [
          // left side
          {
            label: 'Getting Started',
            docId: 'intro',
            position: 'left',
            type: 'doc',
          },
          {
            label: 'Documentation',
            position: 'left',
            to: 'docs/intro'
          },
          // right side
          {
            label: 'Community',
            position: 'right',
            to: 'docs/governance/overview'
          },
          {
            label: 'Tutorials',
            position: 'right',
            to: 'docs/tutorials/overview'
          },
          {
            label: 'How-to Guides',
            position: 'right',
            to: 'docs/how_tos/overview'
          },
          {
            label: 'Reference',
            position: 'right',
            to: 'docs/references/overview'
          },
          {
            label: 'Conceptual guides',
            position: 'right',
            to: 'docs/explanations/overview'
          },
          {
            label: 'GitHub',
            href: customFields.githubUrl,
            position: 'right',
          },
        ],
      },
      footer: {
        copyright: customFields.copyright,
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: customFields.githubUrl,
              },
            ],
          },
          // {
          //   title: 'More',
          //   items: [
          //     {
          //       label: 'Blog',
          //       to: '/blog',
          //     },
          //   ],
          // },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
