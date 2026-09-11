import { test, expect, beforeAll, setDefaultTimeout } from 'bun:test';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { $ } from 'bun';

setDefaultTimeout(600_000);

const SITE = join(import.meta.dir, '..');
const DIST = join(SITE, 'dist');
const CONTENT = join(SITE, 'src', 'content', 'docs');

/** Walk a directory and return every file matching `keep`. */
function walk(dir: string, keep: (name: string) => boolean): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path, keep) : keep(entry.name) ? [path] : [];
  });
}

/** URL path (no trailing slash, '' for the root) for a content file. */
function slugOf(file: string): string {
  const rel = relative(CONTENT, file).replace(/\.mdx?$/, '');
  return rel.replace(/(^|\/)index$/, '');
}

function frontmatterTitle(file: string): string {
  const match = readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/);
  const title = match?.[1].match(/^title:\s*(.+)$/m)?.[1] ?? '';
  return title.replace(/^(['"])(.*)\1$/, '$2');
}

function pagePath(slug: string): string {
  return slug === '' ? join(DIST, 'index.html') : join(DIST, slug, 'index.html');
}

function decodeEntities(html: string): string {
  return html.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}

const contentFiles = walk(CONTENT, (name) => /\.mdx?$/.test(name));
const pages = contentFiles.map((file) => ({ file, slug: slugOf(file), title: frontmatterTitle(file) }));

beforeAll(async () => {
  await $`bun run build`.cwd(SITE);
});

test('every content page is built and renders its title', () => {
  expect(pages.length).toBeGreaterThan(100);
  for (const page of pages) {
    if (page.slug === '404') continue; // emitted as dist/404.html
    expect(existsSync(pagePath(page.slug))).toBe(true);
    const html = decodeEntities(readFileSync(pagePath(page.slug), 'utf8'));
    expect(html).toContain(page.title.replace(/\\"/g, '"'));
  }
  expect(existsSync(join(DIST, '404.html'))).toBe(true);
});

test('each section shows only its own sidebar', () => {
  const docs = readFileSync(pagePath('docs/introduction'), 'utf8');
  expect(docs).toContain('href="/docs/how-tos/deploy-cluster/"');
  expect(docs).not.toContain('href="/classic/how-tos/nebari-aws/"');

  const classic = readFileSync(pagePath('classic/welcome'), 'utf8');
  expect(classic).toContain('href="/classic/how-tos/nebari-aws/"');
  expect(classic).not.toContain('href="/docs/how-tos/deploy-cluster/"');
  expect(classic).toContain('Phase out notice');

  const community = readFileSync(pagePath('community/introduction'), 'utf8');
  expect(community).toContain('href="/community/maintainers/triage-guidelines/"');
  expect(community).not.toContain('href="/classic/how-tos/nebari-aws/"');
  expect(community).not.toContain('Phase out notice');
});

test('the blog index lists both posts', () => {
  const blog = readFileSync(pagePath('blog'), 'utf8');
  expect(blog).toContain('href="/blog/introducing-blogs/"');
  expect(blog).toContain('href="/blog/conda-pixi-nebi-reproducible-environments/"');
});

test('search index is generated', () => {
  expect(existsSync(join(DIST, 'pagefind', 'pagefind.js'))).toBe(true);
});

test('every internal href and image on every page resolves', () => {
  const missing = new Set<string>();
  for (const file of walk(DIST, (name) => name.endsWith('.html'))) {
    const content = readFileSync(file, 'utf8');
    for (const match of content.matchAll(/(?:href|src)="(\/[^"#?]*)"/g)) {
      const path = match[1];
      if (path.startsWith('//')) continue; // protocol-relative external URL
      const ok = /\.[a-z0-9]+$/i.test(path)
        ? existsSync(join(DIST, path))
        : existsSync(pagePath(path.replace(/^\/|\/$/g, '')));
      if (!ok) missing.add(`${relative(DIST, file)} -> ${path}`);
    }
  }
  expect([...missing]).toEqual([]);
});

test('legacy redirects point at built pages and never shadow one', () => {
  const rules = readFileSync(join(SITE, 'public', '_redirects'), 'utf8')
    .split('\n')
    .filter((line) => line.trim() && !line.startsWith('#'))
    .map((line) => line.trim().split(/\s+/));
  expect(rules.length).toBeGreaterThan(0);
  for (const [from, to] of rules) {
    expect(existsSync(pagePath(to.replace(/^\/|\/$/g, '')))).toBe(true);
    expect(existsSync(pagePath(from.replace(/^\/|\/$/g, '')))).toBe(false);
  }
});
