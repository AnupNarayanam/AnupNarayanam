import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Writeups mirror the Notion hierarchy: the file path is the page path, e.g. overthewire/bandit.md.
// A page with sub-pages is just a file whose folder shares its name. Written by scripts/sync-notion.mjs.
const writeups = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writeups' }),
  schema: z.object({
    title: z.string(),
    notion: z.url().optional(),
    order: z.number().default(0),
  }),
});

// Cyberattack and security info pages. Every post must cite at least two sources.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    sources: z.array(z.object({ title: z.string(), url: z.url() })).min(2),
    incident: z
      .object({
        name: z.string(),
        date: z.string().optional(),
        actor: z.string().optional(),
        cves: z.array(z.string()).default([]),
        sectors: z.array(z.string()).default([]),
        attackTechniques: z.array(z.string()).default([]),
        status: z.enum(['developing', 'confirmed', 'closed']).default('developing'),
      })
      .optional(),
  }),
});

// Lab catalogue. The lab code itself lives in a separate repository (see anup-labs).
const labs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/labs' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    difficulty: z.enum(['easy', 'medium', 'hard', 'insane']),
    category: z.string(),
    skills: z.array(z.string()).default([]),
    estimatedMinutes: z.number(),
    status: z.enum(['draft', 'beta', 'released']).default('draft'),
    runtime: z.enum(['local', 'hosted', 'both']).default('local'),
    repo: z.url().optional(),
    path: z.string().optional(),
    version: z.string().default('0.1.0'),
    objectives: z.array(z.string()).default([]),
    hints: z.array(z.string()).default([]),
    flagFormat: z.string().default('flag{...}'),
    writeup: reference('writeups').optional(),
  }),
});

export const collections = { writeups, blog, labs };
