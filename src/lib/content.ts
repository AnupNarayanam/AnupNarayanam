import type { CollectionEntry } from 'astro:content';

export const published = ({ data }: { data: { draft?: boolean } }) => import.meta.env.DEV || !data.draft;
export const labPublished = ({ data }: CollectionEntry<'labs'>) => import.meta.env.DEV || data.status !== 'draft';
export const byDateDesc = (a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
export const byOrder = (a: CollectionEntry<'writeups'>, b: CollectionEntry<'writeups'>) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title);
export const parentId = (id: string) => (id.includes('/') ? id.slice(0, id.lastIndexOf('/')) : '');
export const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
export const DIFF_DOTS: Record<string, number> = { easy: 1, medium: 2, hard: 3, insane: 4 };
export const tagSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
