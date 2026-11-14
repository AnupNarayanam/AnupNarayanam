#!/usr/bin/env node
// Fails if a built page has an inline <script> whose hash is missing from the Content-Security-Policy in vercel.json.
// Run after `npm run build`. If it fails, add the printed hash(es) to script-src in vercel.json.
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const config = JSON.parse(await readFile('vercel.json', 'utf8'));
const csp = config.headers.flatMap((h) => h.headers).find((h) => h.key === 'Content-Security-Policy').value;
const allowed = new Set([...csp.matchAll(/'(sha256-[^']+)'/g)].map((m) => m[1]));

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (p.endsWith('.html')) yield p;
  }
}

const missing = new Map();
for await (const file of walk('dist')) {
  const html = await readFile(file, 'utf8');
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/type="application\/ld\+json"/.test(m[1])) continue; // data block, not executed
    const hash = 'sha256-' + createHash('sha256').update(m[2]).digest('base64');
    if (!allowed.has(hash)) missing.set(hash, file);
  }
}
if (missing.size) {
  for (const [hash, file] of missing) console.error(`Inline script not allowed by CSP: '${hash}' (first seen in ${file})`);
  process.exit(1);
}
console.log(`CSP check passed (${allowed.size} inline script hash(es) allowed).`);
