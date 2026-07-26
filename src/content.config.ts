import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const writing = defineCollection({
  loader: glob({
    base: './src/content/writing',
    pattern: '**/*.{md,mdx}'
  }),
  schema: z.object({
    title: z.string().max(120),
    description: z.string().max(200),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string().min(1)).default([]),
    category: z.string().min(1),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false)
  })
});

export const collections = { writing };
