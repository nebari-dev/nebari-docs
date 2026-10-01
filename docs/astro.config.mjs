import { satteri } from '@astrojs/markdown-satteri';
import starlight from '@astrojs/starlight';
import { nebari } from '@nebari/starlight';
import mermaid from 'astro-mermaid';
import { defineConfig } from 'astro/config';
import starlightLinksValidator from 'starlight-links-validator';

// `DOCS_SITE=classic` builds the Nebari Classic docs in `classic/` as a separate
// site for classic.nebari.dev; otherwise this builds www.nebari.dev from `src/`.
// Both share the components and styles in `src/`.
const classic = process.env.DOCS_SITE === 'classic';
const mainSite = 'https://www.nebari.dev';
const classicSite = 'https://classic.nebari.dev';

const site = process.env.SITE ?? (classic ? classicSite : mainSite);
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

// Sidebar for Nebari Classic (classic.nebari.dev).
const classicSidebar = [
  { label: 'Introduction', slug: 'welcome' },
  {
    label: 'Get Started',
    items: [
      overview('get-started'),
      'get-started/quickstart',
      'get-started/installing-nebari',
      'get-started/deploy',
      'get-started/cloud-providers',
    ],
  },
  {
    label: 'Tutorials',
    items: [
      overview('tutorials'),
      'tutorials/login-keycloak',
      'tutorials/using_dask',
      'tutorials/create-dashboard',
      'tutorials/creating-new-environments',
      'tutorials/create-alerts',
      'tutorials/jupyter-scheduler',
      'tutorials/argo-workflows-walkthrough',
    ],
  },
  {
    label: 'How-to Guides',
    items: [
      overview('how-tos'),
      'how-tos/nebari-gcp',
      'how-tos/nebari-aws',
      'how-tos/nebari-azure',
      'how-tos/nebari-kubernetes',
      'how-tos/nebari-local',
      'how-tos/nebari-stages-directory',
      'how-tos/nebari-environment-management',
      'how-tos/nebari-destroy',
      'how-tos/domain-registry',
      'how-tos/debug-nebari',
      'how-tos/configuring-keycloak',
      'how-tos/configuring-smtp',
      'how-tos/using-vscode',
      'how-tos/manual-backup',
      'how-tos/nebari-upgrade',
      'how-tos/kubernetes-version-upgrade',
      'how-tos/setup-argo',
      'how-tos/using-argo',
      'how-tos/jhub-app-launcher',
      'how-tos/idle-culling',
      'how-tos/nebari-extension-system',
      'how-tos/telemetry',
      'how-tos/setup-monitoring',
      'how-tos/setup-healthcheck',
      'how-tos/access-logs-loki',
      'how-tos/use-gpus',
      'how-tos/develop-local-packages',
      'how-tos/install-pip-packages',
      'how-tos/fine-grained-permissions',
      'how-tos/connect-via-ssh',
      'how-tos/jupyter-gallery',
    ],
  },
  {
    label: 'Conceptual guides',
    items: [
      overview('explanations'),
      'explanations/advanced-configuration',
      'explanations/security-configuration',
      'explanations/provider-configuration',
      'explanations/profile-configuration',
      'explanations/customize-themes',
      'explanations/environments-configuration',
      'explanations/custom-overrides-configuration',
      'explanations/config-best-practices',
      'explanations/infrastructure-architecture',
    ],
  },
  {
    label: 'Reference',
    items: [
      overview('references'),
      'references/RELEASE',
      'references/personas',
    ],
  },
  { label: 'Troubleshooting', slug: 'troubleshooting' },
  { label: 'FAQ', slug: 'faq' },
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

const mainStarlight = {
  title: 'Nebari',
  logoHref: '/',
  components: {},
  // Shows only the current section's sidebar (docs / community).
  routeMiddleware: './src/routeData.ts',
  nav: [
    { label: 'Docs', href: '/docs/introduction/' },
    { label: 'Community', href: '/community/introduction/' },
    { label: 'Software Packs', href: 'https://packs.nebari.dev' },
  ],
  sidebar: [
    { label: 'Nebari', items: docsSidebar },
    { label: 'Community', items: communitySidebar },
  ],
};

const classicStarlight = {
  title: 'Nebari Classic',
  // The site root only redirects to the welcome page.
  logoHref: '/welcome/',
  components: {
    // Adds the Nebari Classic phase-out notice above every page.
    MarkdownContent: './src/components/MarkdownContent.astro',
  },
  nav: [
    { label: 'Docs', href: `${mainSite}/docs/introduction/` },
    { label: 'Community', href: `${mainSite}/community/introduction/` },
    { label: 'Software Packs', href: 'https://packs.nebari.dev' },
  ],
  sidebar: classicSidebar,
};

const { title, logoHref, components, routeMiddleware, nav, sidebar } = classic ? classicStarlight : mainStarlight;

export default defineConfig({
  site,
  base,
  // The two sites build side by side, each with its own content, assets and output.
  srcDir: classic ? './classic' : './src',
  publicDir: classic ? './classic/public' : './public',
  outDir: classic ? './dist-classic' : './dist',
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
      title,
      description: 'An open source stack for your AI.',
      favicon: '/logo/favicon.ico',
      customCss: ['./src/styles/custom.css'],
      lastUpdated: true,
      components: {
        // Adds Google Analytics + the cookie-consent banner on top of the theme Head.
        Head: './src/components/Head.astro',
        ...components,
      },
      routeMiddleware,
      editLink: {
        // Starlight appends src/content/docs/<file>, so this points at the Astro project root.
        baseUrl: 'https://github.com/nebari-dev/nebari-docs/edit/main/docs/',
      },
      plugins: [
        nebari({
          logoHref,
          githubHref: 'https://github.com/nebari-dev/nebari',
          nav,
        }),
        starlightLinksValidator({
          // Content legitimately mentions http://localhost URLs in setup instructions.
          errorOnLocalLinks: false,
        }),
      ],
      sidebar,
    }),
  ],
});
