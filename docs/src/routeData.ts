import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

type Sidebar = App.Locals['starlightRoute']['sidebar'];
type Entry = Sidebar[number];
type Link = Extract<Entry, { type: 'link' }>;

/** Top-level sidebar group shown for each URL section. Must match the labels in astro.config.mjs. */
const SECTIONS: Record<string, string> = {
  docs: 'Nebari',
  classic: 'Nebari Classic',
  community: 'Community',
};

function links(entries: Sidebar): Link[] {
  return entries.flatMap((entry) => (entry.type === 'link' ? [entry] : links(entry.entries)));
}

/**
 * The site has three independent documentation sets (current docs, Nebari
 * Classic, community guidelines), mirroring the old Docusaurus multi-instance
 * setup. Starlight has one sidebar, so it is configured as three top-level
 * groups and this middleware narrows it to the group for the current section.
 * Prev/next pagination is recomputed so it never crosses a section boundary.
 */
export const onRequest = defineRouteMiddleware((context) => {
  const route = context.locals.starlightRoute;
  const section = route.id.split('/')[0];
  const label = SECTIONS[section];
  if (!label) return;
  const group = route.sidebar.find((entry) => entry.type === 'group' && entry.label === label);
  if (!group || group.type !== 'group') return;
  route.sidebar = group.entries;
  const flat = links(route.sidebar);
  const index = flat.findIndex((link) => link.isCurrent);
  route.pagination = {
    prev: index > 0 ? flat[index - 1] : undefined,
    next: index >= 0 && index < flat.length - 1 ? flat[index + 1] : undefined,
  };
});
