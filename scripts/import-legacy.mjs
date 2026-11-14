#!/usr/bin/env node
// One-off: converts the content/ folder of the previous (hash-routed) site into src/content/writeups.
//   node scripts/import-legacy.mjs /path/to/old-site/content
import { mkdir, writeFile, readFile, rm, cp } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeHeadings, frontmatter } from './lib/md.mjs';

const src = process.argv[2];
if (!src) { console.error('Usage: node scripts/import-legacy.mjs /path/to/old-site/content'); process.exit(1); }
const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');
const WRITEUPS = join(ROOT_DIR, 'src', 'content', 'writeups');
const tree = JSON.parse(await readFile(join(src, 'index.json'), 'utf8'));

await rm(WRITEUPS, { recursive: true, force: true });
let count = 0;

async function walk(node, parent, index) {
  const path = [...parent, node.s];
  let body = '';
  if (node.f) {
    try { body = await readFile(join(src, 'pages', ...path) + '.md', 'utf8'); } catch { console.warn('  missing body for', path.join('/')); }
  }
  body = normalizeHeadings(body.trim().replaceAll('content/assets/', '/writeups-assets/'));
  const file = join(WRITEUPS, ...path) + '.md';
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, frontmatter({ title: node.t, notion: node.n, order: index }) + body + '\n');
  count++;
  let i = 0;
  for (const child of node.c || []) await walk(child, path, i++);
}

let i = 0;
for (const node of tree.c || []) await walk(node, [], i++);
try { await cp(join(src, 'assets'), join(ROOT_DIR, 'public', 'writeups-assets'), { recursive: true }); } catch { /* no images yet */ }
await writeFile(join(ROOT_DIR, 'src', 'data', 'synced.json'), JSON.stringify({ at: tree.synced ?? null }) + '\n');
console.log(`Imported ${count} pages into src/content/writeups.`);
