import { $ } from './utils.js';

const root = document.documentElement;
const KEY = 'theme';

const apply = (theme) => root.setAttribute('data-theme', theme);
const systemTheme = () => (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');

export function initTheme() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) apply(saved);
  } catch {}

  $('#tg').addEventListener('click', () => {
    const next = (root.getAttribute('data-theme') || systemTheme()) === 'dark' ? 'light' : 'dark';
    apply(next);
    try { localStorage.setItem(KEY, next); } catch {}
  });
}
