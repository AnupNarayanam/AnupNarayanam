// Full-text search page backed by Pagefind (exists only in a built site: run `npm run build && npm run preview`).
import { el } from './utils.js';

const input = document.querySelector('#q');
const out = document.querySelector('#out');
const status = document.querySelector('#status');
let pagefind;
let token = 0;

async function load() {
  if (pagefind !== undefined) return pagefind;
  try {
    const path = '/pagefind/pagefind.js';
    pagefind = await import(/* @vite-ignore */ path);
    pagefind.init?.();
  } catch {
    pagefind = null;
  }
  return pagefind;
}

async function search() {
  const q = input.value.trim();
  const mine = ++token;
  history.replaceState(null, '', q ? `?q=${encodeURIComponent(q)}` : location.pathname);
  out.replaceChildren();
  if (q.length < 2) { status.textContent = ''; return; }
  const pf = await load();
  if (!pf) { status.textContent = 'Search is built with the site. Run npm run build, then npm run preview.'; return; }
  const found = await pf.search(q);
  const data = await Promise.all(found.results.slice(0, 20).map((r) => r.data()));
  if (mine !== token) return;
  status.textContent = `${found.results.length} result${found.results.length === 1 ? '' : 's'}`;
  out.replaceChildren(...data.map((d) => {
    const li = el('li');
    const a = el('a');
    a.href = d.url;
    const title = el('b', '', d.meta?.title || d.url);
    const url = el('small', '', d.url);
    const excerpt = el('p');
    excerpt.innerHTML = d.excerpt; // Pagefind encodes entities before adding <mark>, so this is safe (per its docs)
    a.append(title, url, excerpt);
    li.append(a);
    return li;
  }));
}

input.addEventListener('input', search);
const initial = new URLSearchParams(location.search).get('q');
if (initial) { input.value = initial; search(); }
