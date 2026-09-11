import { satteri } from '@astrojs/markdown-satteri';
import starlight from '@astrojs/starlight';
import { nebari } from '@nebari/starlight';
import mermaid from 'astro-mermaid';
import { defineConfig } from 'astro/config';
import starlightBlog from 'starlight-blog';
import starlightLinksValidator from 'starlight-links-validator';

const site = process.env.SITE ?? 'https://www.nebari.dev';
const base = process.env.BASE ?? '/';

const overview = (slug) => ({ label: 'Overview', slug });

// Sidebar for the current Nebari documentation (`/docs/*`).
const docsSidebar = [
  'docs/introduction',
  {
    label: 'Get started',
    items: [overview('docs/get-started'), 'docs/get-started/install'],
  },
  {
    label: 'Explanations',
    items: [
      overview('docs/explanations'),
      'docs/explanations/nkp-architecture',
      'docs/explanations/software-packs',
    ],
  },
  {
    label: 'How-to guides',
    items: [
      overview('docs/how-tos'),
      'docs/how-tos/prepare-to-deploy',
      'docs/how-tos/deploy',
      'docs/how-tos/deploy-cluster',
      'docs/how-tos/cloudflare-dns',
      'docs/how-tos/update-cluster',
      'docs/how-tos/upgrade-kubernetes',
      'docs/how-tos/destroy-cluster',
      'docs/how-tos/keycloak-auth',
      'docs/how-tos/backup-restore',
      'docs/how-tos/debug-deployment',
      'docs/how-tos/enterprise-tls-proxy',
      {
        label: 'Providers',
        items: [
          overview('docs/how-tos/providers'),
          'docs/how-tos/providers/hetzner',
          'docs/how-tos/providers/aws',
          'docs/how-tos/providers/azure',
          'docs/how-tos/providers/gcp',
          'docs/how-tos/providers/local',
        ],
      },
    ],
  },
  {
    label: 'References',
    items: [overview('docs/references'), 'docs/references/personas'],
  },
  {
    label: 'Software packs',
    items: [overview('docs/software-packs'), 'docs/software-packs/build-your-own'],
  },
];

// Sidebar for Nebari Classic (`/classic/*`).
const classicSidebar = [
  { label: 'Introduction', slug: 'classic/welcome' },
  {
    label: 'Get Started',
    items: [
      overview('classic/get-started'),
      'classic/get-started/quickstart',
      'classic/get-started/installing-nebari',
      'classic/get-started/deploy',
      'classic/get-started/cloud-providers',
    ],
  },
  {
    label: 'Tutorials',
    items: [
      overview('classic/tutorials'),
      'classic/tutorials/login-keycloak',
      'classic/tutorials/using_dask',
      'classic/tutorials/create-dashboard',
      'classic/tutorials/creating-new-environments',
      'classic/tutorials/create-alerts',
      'classic/tutorials/jupyter-scheduler',
      'classic/tutorials/argo-workflows-walkthrough',
    ],
  },
  {
    label: 'How-to Guides',
    items: [
      overview('classic/how-tos'),
      'classic/how-tos/nebari-gcp',
      'classic/how-tos/nebari-aws',
      'classic/how-tos/nebari-azure',
      'classic/how-tos/nebari-kubernetes',
      'classic/how-tos/nebari-local',
      'classic/how-tos/nebari-stages-directory',
      'classic/how-tos/nebari-environment-management',
      'classic/how-tos/nebari-destroy',
      'classic/how-tos/domain-registry',
      'classic/how-tos/debug-nebari',
      'classic/how-tos/configuring-keycloak',
      'classic/how-tos/configuring-smtp',
      'classic/how-tos/using-vscode',
      'classic/how-tos/manual-backup',
      'classic/how-tos/nebari-upgrade',
      'classic/how-tos/kubernetes-version-upgrade',
      'classic/how-tos/setup-argo',
      'classic/how-tos/using-argo',
      'classic/how-tos/jhub-app-launcher',
      'classic/how-tos/idle-culling',
      'classic/how-tos/nebari-extension-system',
      'classic/how-tos/telemetry',
      'classic/how-tos/setup-monitoring',
      'classic/how-tos/setup-healthcheck',
      'classic/how-tos/access-logs-loki',
      'classic/how-tos/use-gpus',
      'classic/how-tos/develop-local-packages',
      'classic/how-tos/install-pip-packages',
      'classic/how-tos/fine-grained-permissions',
      'classic/how-tos/connect-via-ssh',
      'classic/how-tos/jupyter-gallery',
    ],
  },
  {
    label: 'Conceptual guides',
    items: [
      overview('classic/explanations'),
      'classic/explanations/advanced-configuration',
      'classic/explanations/security-configuration',
      'classic/explanations/provider-configuration',
      'classic/explanations/profile-configuration',
      'classic/explanations/customize-themes',
      'classic/explanations/environments-configuration',
      'classic/explanations/custom-overrides-configuration',
      'classic/explanations/config-best-practices',
      'classic/explanations/infrastructure-architecture',
    ],
  },
  {
    label: 'Reference',
    items: [
      overview('classic/references'),
      'classic/references/RELEASE',
      'classic/references/personas',
    ],
  },
  { label: 'Troubleshooting', slug: 'classic/troubleshooting' },
  { label: 'FAQ', slug: 'classic/faq' },
];

// Sidebar for the community guidelines (`/community/*`).
const communitySidebar = [
  { label: 'Introduction', slug: 'community/introduction' },
  {
    label: 'Contributors',
    items: [
      'community/file-issues',
      'community/code-contributions',
      'community/nebari-tests',
      'community/doc-contributions',
      'community/style-guide',
    ],
  },
  {
    label: 'Maintainers',
    items: [
      'community/maintainers/github-conventions',
      'community/maintainers/triage-guidelines',
      'community/maintainers/reviewer-guidelines',
      'community/maintainers/saved-replies',
      'community/maintainers/release-process-branching-strategy',
    ],
  },
  'community/team-structure',
  'community/decision-making',
  'community/plugins',
];

export default defineConfig({
  site,
  base,
  markdown: {
    // Keep quotes and dashes exactly as authored instead of converting them to typographic ones.
    processor: satteri({ features: { smartPunctuation: false } }),
  },
  integrations: [
    mermaid({
      autoTheme: true,
      enableLog: false,
    }),
    starlight({
      title: 'Nebari',
      description: 'An open source stack for your AI.',
      favicon: '/logo/favicon.ico',
      customCss: ['./src/styles/custom.css'],
      lastUpdated: true,
      components: {
        // Adds Google Analytics + the cookie-consent banner on top of the theme Head.
        Head: './src/components/Head.astro',
        // Adds the Nebari Classic phase-out notice above `/classic/*` pages.
        MarkdownContent: './src/components/MarkdownContent.astro',
      },
      // Shows only the current section's sidebar (docs / classic / community).
      routeMiddleware: './src/routeData.ts',
      editLink: {
        // Starlight appends src/content/docs/<file>, so this points at the Astro project root.
        baseUrl: 'https://github.com/nebari-dev/nebari-docs/edit/main/docs/',
      },
      plugins: [
        nebari({
          logoHref: '/',
          githubHref: 'https://github.com/nebari-dev/nebari-docs',
          nav: [
            { label: 'Docs', href: '/docs/introduction/' },
            { label: 'Community', href: '/community/introduction/' },
            { label: 'Blog', href: '/blog/' },
          ],
        }),
        starlightBlog({
          title: 'Nebari blog',
          // The theme's header tabs already link to the blog.
          navigation: 'none',
          // No feed, and no RSS icon next to GitHub in the header.
          rss: false,
          authors: {
            'nebari-team': {
              name: 'Nebari team',
              title: 'Nebari development team',
              picture: 'https://github.com/nebari-dev.png',
              url: 'https://github.com/nebari-dev',
            },
            'khuyen-tran': {
              name: 'Khuyen Tran',
              title: 'Senior Developer Advocate',
              picture: 'https://github.com/khuyentran1401.png',
              url: 'https://github.com/khuyentran1401',
            },
          },
        }),
        starlightLinksValidator({
          // Content legitimately mentions http://localhost URLs in setup instructions.
          errorOnLocalLinks: false,
          // The blog index, tag and author pages are generated by starlight-blog, not content files.
          exclude: ['/blog/', '/blog/**'],
        }),
      ],
      sidebar: [
        { label: 'Nebari', items: docsSidebar },
        { label: 'Nebari Classic', items: classicSidebar },
        { label: 'Community', items: communitySidebar },
      ],
    }),
  ],
});
