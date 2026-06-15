import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Destinations — Bali is the flagship; others are editorial placeholders the
// atelier can expand. Data-only (YAML) so non-developers can edit copy safely.
const destinations = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/destinations' }),
  schema: z.object({
    title: z.string(),
    region: z.string(),
    summary: z.string(),
    detail: z.string().optional(),
    image: z.string().optional(), // absolute image URL
    status: z.enum(['flagship', 'available', 'by-request']).default('available'),
    order: z.number().default(99),
  }),
});

// Press & recognition. Quotes are placeholders pending usage rights/confirmation.
const press = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/press' }),
  schema: z.object({
    outlet: z.string(),
    quote: z.string(),
    order: z.number().default(99),
  }),
});

export const collections = { destinations, press };
