import { describe, test, expect, beforeAll, setDefaultTimeout } from 'bun:test';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { $ } from 'bun';

setDefaultTimeout(600_000);

const ROOT = join(import.meta.dir, '..');

/** The two sites this project builds (see astro.config.mjs). */
const MAIN = site('main', 'src/content/docs', 'dist', 'public');
const CLASSIC = site('classic', 'classic/content/docs', 'dist-classic', 'classic/public');

type Site = ReturnType<typeof site>;

function site(name: 'main' | 'classic', content: string, dist: string, pub: string) {
  const CONTENT = join(ROOT, content);
  const DIST = join(ROOT, dist);
  const pages = walk(CONTENT, (file) => /\.mdx?$/.test(file)).map((file) => ({
    file,
    slug: slugOf(CONTENT, file),
    title: frontmatterTitle(file),
  }));
  return {
    name,
    dist: DIST,
    redirects: join(ROOT, pub, '_redirects'),
    pages,
    /** Built HTML file for a URL path without leading or trailing slashes. */
    page: (slug: string) => (slug === '' ? join(DIST, 'index.html') : join(DIST, slug, 'index.html')),
  };
}

/** Walk a directory and return every file matching `keep`. */
function walk(dir: string, keep: (name: string) => boolean): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path, keep) : keep(entry.name) ? [path] : [];
  });
}

/** URL path (no trailing slash, '' for the root) for a content file. */
function slugOf(content: string, file: string): string {
  const rel = relative(content, file).replace(/\.mdx?$/, '');
  return rel.replace(/(^|\/)index$/, '');
}

function frontmatterTitle(file: string): string {
  const match = readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/);
  const title = match?.[1].match(/^title:\s*(.+)$/m)?.[1] ?? '';
  return title.replace(/^(['"])(.*)\1$/, '$2');
}

function decodeEntities(html: string): string {
  return html.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}

function html(s: Site, slug: string): string {
  return readFileSync(s.page(slug), 'utf8');
}

beforeAll(async () => {
  // `bun test` sets NODE_ENV=test and child processes inherit it, which makes Vite treat the
  // build as non-production: `import.meta.env.DEV` is true and Starlight renders its "search is
  // only available in production builds" notice instead of the Pagefind UI. Force production so
  // the `dist/` directories this suite builds are the same ones CI deploys.
  const env = { ...process.env, NODE_ENV: 'production' };
  await $`bun run build`.cwd(ROOT).env(env);
  await $`bun run build:classic`.cwd(ROOT).env(env);
});

for (const s of [MAIN, CLASSIC]) {
  describe(`${s.name} site`, () => {
    test('every content page is built and renders its title', () => {
      expect(s.pages.length).toBeGreaterThan(40);
      for (const page of s.pages) {
        if (page.slug === '404') continue; // emitted as dist/404.html
        expect(existsSync(s.page(page.slug))).toBe(true);
        expect(decodeEntities(html(s, page.slug))).toContain(page.title.replace(/\\"/g, '"'));
      }
      expect(existsSync(join(s.dist, '404.html'))).toBe(true);
    });

    test('search index is generated', () => {
      expect(existsSync(join(s.dist, 'pagefind', 'pagefind.js'))).toBe(true);
      expect(existsSync(join(s.dist, 'pagefind', 'pagefind-entry.json'))).toBe(true);
    });

    test('every internal href and image on every page resolves', () => {
      const missing = new Set<string>();
      for (const file of walk(s.dist, (name) => name.endsWith('.html'))) {
        const content = readFileSync(file, 'utf8');
        for (const match of content.matchAll(/(?:href|src)="(\/[^"#?]*)"/g)) {
          const path = match[1];
          if (path.startsWith('//')) continue; // protocol-relative external URL
          const ok = /\.[a-z0-9]+$/i.test(path)
            ? existsSync(join(s.dist, path))
            : existsSync(s.page(path.replace(/^\/|\/$/g, '')));
          if (!ok) missing.add(`${relative(s.dist, file)} -> ${path}`);
        }
      }
      expect([...missing]).toEqual([]);
    });

    test('no page links to the old /classic/ path on www.nebari.dev', () => {
      const stale = new Set<string>();
      for (const file of walk(s.dist, (name) => name.endsWith('.html'))) {
        const content = readFileSync(file, 'utf8');
        for (const match of content.matchAll(/(?:href|src)="((?:https?:\/\/(?:www\.)?nebari\.dev)?\/classic\b[^"]*)"/g)) {
          stale.add(`${relative(s.dist, file)} -> ${match[1]}`);
        }
      }
      expect([...stale]).toEqual([]);
    });
  });
}

test('each main-site section shows only its own sidebar', () => {
  const docs = html(MAIN, 'docs/introduction');
  expect(docs).toContain('href="/docs/how-tos/deploy-cluster/"');
  expect(docs).not.toContain('href="/community/maintainers/triage-guidelines/"');

  const community = html(MAIN, 'community/introduction');
  expect(community).toContain('href="/community/maintainers/triage-guidelines/"');
  expect(community).not.toContain('href="/docs/how-tos/deploy-cluster/"');
});

test('the main site no longer includes Nebari Classic', () => {
  expect(existsSync(join(MAIN.dist, 'classic'))).toBe(false);
  expect(existsSync(join(MAIN.dist, 'img', 'classic'))).toBe(false);
  for (const slug of ['docs/introduction', 'community/introduction']) {
    const page = html(MAIN, slug);
    expect(page).not.toContain('Nebari Classic</');
    expect(page).not.toContain('Phase out notice');
  }
  // Pagefind indexes every built page, so no Classic pages means none in search either.
  const built = walk(MAIN.dist, (name) => name.endsWith('.html')).map((file) => relative(MAIN.dist, file));
  expect(built.filter((file) => file.startsWith('classic/'))).toEqual([]);
});

test('Classic pages sit at the site root with their own sidebar and the phase-out notice', () => {
  const welcome = html(CLASSIC, 'welcome');
  expect(welcome).toContain('href="/how-tos/nebari-aws/"');
  expect(welcome).not.toContain('href="/docs/how-tos/deploy-cluster/"');
  expect(welcome).toContain('<link rel="canonical" href="https://classic.nebari.dev/welcome/"');
  for (const page of CLASSIC.pages) {
    if (page.slug === '404') continue;
    const content = html(CLASSIC, page.slug);
    expect(content).toContain('Phase out notice');
    expect(content).toContain('href="https://www.nebari.dev/docs/introduction/"');
  }
});

test('pages mount the search UI instead of the dev-only notice', () => {
  for (const [s, slug] of [
    [MAIN, ''],
    [MAIN, 'docs/introduction'],
    [MAIN, 'community/introduction'],
    [CLASSIC, 'welcome'],
  ] as const) {
    const page = html(s, slug);
    expect(page).toContain('id="starlight__search"');
    expect(page).not.toContain('Search is only available in production builds');
  }
});

/** `[from, to, status]` for each rule in a `_redirects` file. */
function redirectRules(file: string): string[][] {
  return readFileSync(file, 'utf8')
    .split('\n')
    .filter((line) => line.trim() && !line.startsWith('#'))
    .map((line) => line.trim().split(/\s+/));
}

/** The site and URL path a redirect target points at. */
function target(to: string): [Site, string] {
  const url = new URL(to, 'https://www.nebari.dev');
  const s = url.hostname === 'classic.nebari.dev' ? CLASSIC : MAIN;
  return [s, url.pathname.replace(/^\/|\/$/g, '')];
}

test('main-site redirects point at built pages and never shadow one', () => {
  const rules = redirectRules(MAIN.redirects);
  expect(rules.length).toBeGreaterThan(0);
  for (const [from, to] of rules) {
    expect(existsSync(MAIN.page(from.replace(/^\/|\/$/g, '').replace(/\/\*$/, '')))).toBe(false);
    if (to.includes(':splat')) continue;
    const [s, path] = target(to);
    // The classic.nebari.dev root redirects on to /welcome/.
    expect(existsSync(s === CLASSIC && path === '' ? CLASSIC.page('welcome') : s.page(path))).toBe(true);
  }
});

test('every old /classic/* URL redirects to the same path on classic.nebari.dev', () => {
  const rules = redirectRules(MAIN.redirects);
  expect(rules).toContainEqual(['/classic/*', 'https://classic.nebari.dev/:splat', '301']);
  // The splat rule covers every Classic page, so each one exists at its new path.
  for (const page of CLASSIC.pages) {
    if (page.slug !== '404') expect(existsSync(CLASSIC.page(page.slug))).toBe(true);
  }
});

test('Classic redirects point at built pages and never shadow one', () => {
  const rules = redirectRules(CLASSIC.redirects);
  expect(rules.length).toBeGreaterThan(0);
  for (const [from, to] of rules) {
    expect(existsSync(CLASSIC.page(from.replace(/^\/|\/$/g, '')))).toBe(false);
    expect(existsSync(CLASSIC.page(to.replace(/^\/|\/$/g, '')))).toBe(true);
  }
});
