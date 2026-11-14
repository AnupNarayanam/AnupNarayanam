// Command palette (Ctrl/Cmd+K): pages, actions, and full-text search of the whole site through Pagefind.
import { $, el } from './utils.js';
import { SITE } from '../data/profile.ts';

const PAGES = [['Home', '/'], ['Projects', '/projects/'], ['Writeups', '/writeups/'], ['Blog', '/blog/'], ['About', '/about/'], ['Contact', '/contact/'], ['Search page', '/search/']];
const go = (href) => () => { location.href = href; };
const BASE_ITEMS = [
  ...PAGES.map(([label, href]) => ({ label, hint: 'Page', run: go(href) })),
  { label: 'Toggle light and dark theme', hint: 'Action', run: () => $('#tg').click() },
  { label: 'Download resume', hint: 'Action', run: () => { const a = el('a'); a.href = SITE.resume; a.download = ''; document.body.append(a); a.click(); a.remove(); } },
  { label: 'Email Anup', hint: SITE.email, run: go(`mailto:${SITE.email}`) },
  { label: 'GitHub', hint: 'Link', run: () => window.open(SITE.github, '_blank', 'noopener') },
  { label: 'LinkedIn', hint: 'Link', run: () => window.open(SITE.linkedin, '_blank', 'noopener') },
];

let pagefind; // undefined = not tried, null = unavailable (dev server), otherwise the module
let shown = [];
let sel = 0;
let isOpen = false;
let token = 0;
let overlay;
let input;
let list;
let previous;

async function loadPagefind() {
  if (pagefind !== undefined) return pagefind;
  try {
    const path = '/pagefind/pagefind.js'; // built by `pagefind --site dist`; not available under `astro dev`
    pagefind = await import(/* @vite-ignore */ path);
    pagefind.init?.();
  } catch {
    pagefind = null;
  }
  return pagefind;
}

async function contentResults(q) {
  const pf = await loadPagefind();
  if (!pf || q.length < 2) return [];
  const search = await pf.search(q);
  const data = await Promise.all(search.results.slice(0, 8).map((r) => r.data()));
  return data.map((d) => ({ label: d.meta?.title || d.url, hint: d.url, run: go(d.url) }));
}

function mark() {
  [...list.children].forEach((li, i) => li.setAttribute('aria-selected', String(i === sel)));
  input.setAttribute('aria-activedescendant', shown.length ? `pal-${sel}` : '');
  list.children[sel]?.scrollIntoView?.({ block: 'nearest' });
}

function choose(i) {
  const it = shown[i];
  if (!it) return;
  hide();
  it.run();
}

function paint(items) {
  shown = items.slice(0, 12);
  sel = 0;
  list.replaceChildren(...(shown.length ? shown.map((it, i) => {
    const li = el('li');
    li.id = `pal-${i}`;
    li.setAttribute('role', 'option');
    li.append(el('span', '', it.label), el('small', '', it.hint));
    li.addEventListener('mousemove', () => { if (sel !== i) { sel = i; mark(); } });
    li.addEventListener('click', () => choose(i));
    return li;
  }) : [el('li', '', 'No results')]));
  mark();
}

async function render() {
  const q = input.value.trim().toLowerCase();
  const mine = ++token;
  const local = q ? BASE_ITEMS.filter((i) => i.label.toLowerCase().includes(q) || i.hint.toLowerCase().includes(q)) : BASE_ITEMS;
  paint(local);
  if (!q) return;
  const found = await contentResults(q);
  if (mine === token && found.length) paint([...local, ...found]); // ignore results for an older query
}

function show() {
  if (isOpen) return;
  isOpen = true;
  previous = document.activeElement;
  overlay.hidden = false;
  input.value = '';
  input.focus();
  render();
}

function hide() {
  if (!isOpen) return;
  isOpen = false;
  overlay.hidden = true;
  previous?.focus?.();
}

export function initPalette() {
  overlay = el('div', 'pal');
  overlay.hidden = true;
  overlay.innerHTML = '<div class="pal-p" role="dialog" aria-modal="true" aria-label="Command palette"><input id="pal-q" type="text" role="combobox" aria-expanded="true" aria-controls="pal-l" autocomplete="off" spellcheck="false" placeholder="Jump to a page, or search writeups and posts"><ul id="pal-l" role="listbox" aria-label="Results"></ul><div class="pal-h">Up and down to move, Enter to open, Esc to close</div></div>';
  document.body.append(overlay);
  input = $('#pal-q');
  list = $('#pal-l');

  $('#pal-open').addEventListener('click', show);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) hide(); });
  input.addEventListener('input', render);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!shown.length) return;
      sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + shown.length) % shown.length;
      mark();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(sel);
    }
  });
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); isOpen ? hide() : show(); }
    else if (e.key === 'Escape') hide();
  });
}
