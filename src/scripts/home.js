// Typing effect for the role line; static text when motion is reduced.
import { ROLES } from '../data/profile.ts';

const node = document.querySelector('#rot');
if (node && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
  let w = 0;
  let i = 0;
  let erasing = false;
  (function tick() {
    const word = ROLES[w];
    node.textContent = word.slice(0, i);
    if (!erasing && i === word.length) { erasing = true; return setTimeout(tick, 1600); }
    if (erasing && i === 0) { erasing = false; w = (w + 1) % ROLES.length; }
    i += erasing ? -1 : 1;
    setTimeout(tick, erasing ? 35 : 70);
  })();
}
