import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// Content for classic.nebari.dev. This directory is the Astro `srcDir` when
// building with `DOCS_SITE=classic` (see astro.config.mjs).
export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema(),
  }),
};
