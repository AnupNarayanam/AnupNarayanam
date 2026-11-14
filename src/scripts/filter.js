// Generic chip filter: a [data-filter-root] holds chips ([data-filter]) and items ([data-item][data-kind]).
import { say } from './mascot.js';

document.querySelectorAll('[data-filter-root]').forEach((root) => {
  const chips = [...root.querySelectorAll('[data-filter]')];
  const items = [...root.querySelectorAll('[data-item]')];
  chips.forEach((chip) => chip.addEventListener('click', () => {
    const kind = chip.dataset.filter;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    let shown = 0;
    items.forEach((item) => {
      const show = kind === 'all' || item.dataset.kind === kind;
      item.hidden = !show;
      if (show) shown++;
    });
    say(kind === 'all' ? 'Showing everything.' : `${shown} shown.`);
  }));
});
