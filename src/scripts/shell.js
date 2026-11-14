// Runs on every page: menu, scroll state, reveal-on-scroll, count-up, theme, mascot, palette.
import { $ } from './utils.js';
import { initTheme } from './theme.js';
import { initMascot } from './mascot.js';
import { initPalette } from './palette.js';

const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
const body = document.body;

function countUp(node) {
  const end = Number(node.dataset.count);
  const suffix = node.dataset.suffix || '';
  if (reduced) { node.textContent = end + suffix; return; }
  const t0 = performance.now();
  const step = (t) => {
    const p = Math.min(1, (t - t0) / 1100);
    node.textContent = Math.round(end * (1 - (1 - p) ** 3)) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (reduced || !('IntersectionObserver' in window)) { items.forEach((n) => n.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    io.unobserve(e.target);
    e.target.querySelectorAll('[data-count]').forEach(countUp);
  }), { threshold: 0.12 });
  items.forEach((n) => io.observe(n));
}

function initMenu() {
  const nav = $('#nav');
  const burger = $('#bg');
  const setMenu = (open) => { nav.classList.toggle('open', open); burger.setAttribute('aria-expanded', String(open)); };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  const bar = $('#site-h');
  const onScroll = () => bar.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  $('#up').addEventListener('click', () => scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
  if (/Mac|iPhone|iPad/.test(navigator.platform)) $('#kbd').textContent = '\u2318K';
}

let tips = [];
try { tips = JSON.parse(body.dataset.tips || '[]'); } catch {}

initMenu();
initReveal();
initTheme();
initMascot({ page: body.dataset.page || 'page', greet: body.dataset.greet || '', tips });
initPalette();
