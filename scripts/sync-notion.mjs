#!/usr/bin/env node
// Pulls your Notion hub page and every nested page into src/content/writeups/ (one Markdown file per page,
// path = Notion nesting) and downloads images to public/writeups-assets/.
//   NOTION_TOKEN=ntn_xxx npm run sync
// Pages are built in src/content/.writeups-new and swapped in at the end, so a stopped run keeps your old content.
import { mkdir, writeFile, rm, rename } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { normalizeHeadings, frontmatter } from './lib/md.mjs';

const TOKEN = process.env.NOTION_TOKEN;
const ROOT = ((process.env.NOTION_ROOT_PAGE || '1cf17275170880c0834bc9e8b67fd385').replace(/-/g, '').match(/[0-9a-f]{32}/i) || [])[0];
const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');
const WRITEUPS = join(ROOT_DIR, 'src', 'content', 'writeups');
const STAGING = join(ROOT_DIR, 'src', 'content', '.writeups-new');
const ASSETS = join(ROOT_DIR, 'public', 'writeups-assets');
if (!TOKEN || !ROOT) {
  console.error('Set NOTION_TOKEN (and optionally NOTION_ROOT_PAGE). See README.');
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(path, body) {
  for (let attempt = 0; ; attempt++) {
    await sleep(340); // stay under Notion's ~3 requests per second
    const res = await fetch('https://api.notion.com/v1' + path, {
      method: body ? 'POST' : 'GET',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 429 && attempt < 6) { await sleep((Number(res.headers.get('retry-after')) || 2) * 1000); continue; }
    if (!res.ok) throw new Error(`${res.status} ${path}: ${await res.text()}`);
    return res.json();
  }
}

async function paged(path, body) {
  const out = [];
  let cursor;
  do {
    const sep = path.includes('?') ? '&' : '?';
    const r = body
      ? await api(path, { ...body, page_size: 100, ...(cursor && { start_cursor: cursor }) })
      : await api(`${path}${sep}page_size=100${cursor ? '&start_cursor=' + cursor : ''}`);
    out.push(...r.results);
    cursor = r.has_more ? r.next_cursor : null;
  } while (cursor);
  return out;
}

// ---------- text helpers ----------
const clean = (t) => (t || '').replace(/[\s:]+$/, '').replace(/\s+/g, ' ').trim() || 'Untitled';
const slugify = (t) => t.toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '') || 'page';
const titleOf = (page) => (Object.values(page.properties || {}).find((p) => p.type === 'title')?.title || []).map((t) => t.plain_text).join('');
const wrap = (s, mark) => { const [, l, c, r] = s.match(/^(\s*)([\s\S]*?)(\s*)$/); return c ? l + mark + c + mark + r : s; };

function rt(arr = []) {
  return arr.map((t) => {
    let s = t.plain_text;
    const a = t.annotations || {};
    if (t.type === 'equation' || a.code) s = '`' + s.replace(/`/g, "'") + '`';
    else {
      if (a.bold) s = wrap(s, '**');
      if (a.italic) s = wrap(s, '*');
      if (a.strikethrough) s = wrap(s, '~~');
    }
    return t.href && !a.code ? `[${s}](${t.href})` : s;
  }).join('');
}

async function image(url, alt) {
  if (!/amazonaws\.com|notion\.so|notion-static/.test(url)) return `![${alt}](${url})`; // external: keep as is
  try {
    const pathname = new URL(url).pathname;
    const ext = (pathname.match(/\.(png|jpe?g|gif|webp|svg)$/i) || [, 'png'])[1].toLowerCase();
    const name = createHash('sha1').update(pathname).digest('hex').slice(0, 12) + '.' + ext;
    const res = await fetch(url); // signed URLs expire in about an hour, so download now
    if (!res.ok) throw new Error(res.status);
    await mkdir(ASSETS, { recursive: true });
    await writeFile(join(ASSETS, name), Buffer.from(await res.arrayBuffer()));
    return `![${alt}](/writeups-assets/${name})`;
  } catch (err) {
    console.warn('  image skipped:', err.message);
    return `*(image not downloaded)*`;
  }
}

// ---------- blocks -> markdown ----------
async function toMd(id, ctx, indent = '') {
  const parts = [];
  let n = 0;
  for (const b of await paged(`/blocks/${id}/children`)) {
    const d = b[b.type] || {};
    const text = rt(d.rich_text);
    n = b.type === 'numbered_list_item' ? n + 1 : 0;
    const sub = async (pad, prefix = '') => {
      if (!b.has_children) return '';
      const s = await toMd(b.id, ctx, pad);
      return prefix ? s.split('\n').map((l) => prefix + l).join('\n') : s;
    };
    let s = '';
    let list = false;
    switch (b.type) {
      case 'child_page': ctx.pages.push({ id: b.id, title: d.title }); continue;
      case 'child_database': ctx.dbs.push({ id: b.id, title: d.title }); continue;
      case 'heading_1': s = '# ' + text; break;
      case 'heading_2': s = '## ' + text; break;
      case 'heading_3': s = '### ' + text; break;
      case 'bulleted_list_item':
      case 'toggle':
      case 'to_do': {
        const box = b.type === 'to_do' ? `[${d.checked ? 'x' : ' '}] ` : '';
        s = `${indent}- ${box}${text}`;
        const k = await sub(indent + '  ');
        if (k) s += '\n' + k;
        list = true;
        break;
      }
      case 'numbered_list_item': {
        s = `${indent}${n}. ${text}`;
        const k = await sub(indent + '   ');
        if (k) s += '\n' + k;
        list = true;
        break;
      }
      case 'quote':
      case 'callout': {
        const icon = b.type === 'callout' && d.icon?.emoji ? d.icon.emoji + ' ' : '';
        s = '> ' + icon + text;
        const k = await sub('', '> ');
        if (k) s += '\n' + k;
        break;
      }
      case 'code': s = '```' + (d.language === 'plain text' ? '' : d.language || '') + '\n' + d.rich_text.map((t) => t.plain_text).join('') + '\n```'; break;
      case 'divider': s = '---'; break;
      case 'image': s = await image(d.type === 'external' ? d.external.url : d.file.url, rt(d.caption)); break;
      case 'file': case 'pdf': case 'video': case 'audio': {
        const u = d[d.type]?.url;
        s = u ? `[${rt(d.caption) || d.name || b.type}](${u})` : '';
        break;
      }
      case 'bookmark': case 'embed': case 'link_preview': s = d.url ? `[${d.url}](${d.url})` : ''; break;
      case 'equation': s = '`' + d.expression + '`'; break;
      case 'table': {
        const rows = (await paged(`/blocks/${b.id}/children`)).map((r) => r.table_row.cells.map((c) => rt(c).replace(/\|/g, '\\|').replace(/\n/g, ' ')));
        if (rows.length) s = [rows[0], rows[0].map(() => '---'), ...rows.slice(1)].map((r) => `| ${r.join(' | ')} |`).join('\n');
        break;
      }
      case 'column_list': case 'column': case 'synced_block': s = await sub(indent); break;
      default: s = text ? indent + text : '';
    }
    if (b.type === 'paragraph') s = indent + text;
    if (s) parts.push({ s, list });
  }
  return parts.reduce((acc, p, i) => acc + (i ? (p.list && parts[i - 1].list ? '\n' : '\n\n') : '') + p.s, '');
}

// ---------- tree walk ----------
let pageCount = 0;

async function walk(id, title, parentPath, used, index) {
  const t = clean(title);
  let slug = slugify(t);
  for (let k = 2; used.has(slug); k++) slug = `${slugify(t)}-${k}`;
  used.add(slug);
  const path = [...parentPath, slug];
  console.log('  '.repeat(path.length - 1) + t);

  const ctx = { pages: [], dbs: [] };
  const md = normalizeHeadings((await toMd(id, ctx)).trim());
  const file = join(STAGING, ...path) + '.md';
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, frontmatter({ title: t, notion: `https://www.notion.so/${id}`, order: index }) + md + '\n');
  pageCount++;

  for (const db of ctx.dbs) {
    for (const row of await paged(`/databases/${db.id}/query`, {})) ctx.pages.push({ id: row.id, title: titleOf(row) });
  }
  const childUsed = new Set();
  let i = 0;
  for (const p of ctx.pages) await walk(p.id, p.title, path, childUsed, i++);
}

console.log('Syncing from Notion...');
await rm(STAGING, { recursive: true, force: true });
await api(`/pages/${ROOT}`); // fails early with a clear error if the integration cannot see the page
const rootCtx = { pages: [], dbs: [] };
await toMd(ROOT, rootCtx); // the hub itself only lists its children
const used = new Set();
let i = 0;
for (const p of rootCtx.pages) await walk(p.id, p.title, [], used, i++);
await mkdir(STAGING, { recursive: true });
await rm(WRITEUPS, { recursive: true, force: true });
await rename(STAGING, WRITEUPS); // swap in only after a full, successful run
await writeFile(join(ROOT_DIR, 'src', 'data', 'synced.json'), JSON.stringify({ at: new Date().toISOString() }) + '\n');
console.log(`Done: ${pageCount} pages written to src/content/writeups.`);
