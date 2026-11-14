import { $ } from './utils.js';

const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
const GENERIC = ['Always try base64 first.', 'strings, then grep, then coffee.', 'Have you checked robots.txt?', 'Read the challenge title twice.'];

let mw;
let bubble;
let eyes;
let timer;
let running = false;
let clicks = 0;
let tips = GENERIC;

export function say(text, ms = 2800) {
  if (!bubble) return;
  clearTimeout(timer);
  bubble.textContent = text;
  bubble.classList.add('on');
  timer = setTimeout(() => bubble.classList.remove('on'), ms);
}

export function hop() {
  if (!mw) return;
  mw.classList.remove('hop');
  void mw.offsetWidth; // restart the animation
  mw.classList.add('hop');
}

/** Dash across the screen with a flag, then come back. */
export async function run() {
  if (!mw || reduced || running) return;
  running = true;
  mw.classList.add('run');
  document.body.classList.add('running');

  const dx = -(innerWidth - 110);
  const dash = (from, to) =>
    mw.animate(
      [{ transform: `translateX(${from}px)` }, { transform: `translateX(${to}px)` }],
      { duration: 1500, easing: 'ease-in-out' }
    ).finished;

  await dash(0, dx);
  mw.classList.add('flip');
  await dash(dx, 0);

  mw.classList.remove('run', 'flip');
  document.body.classList.remove('running');
  running = false;
}

function lookAt(e) {
  const r = mw.getBoundingClientRect();
  const dx = e.clientX - (r.left + r.width / 2);
  const dy = e.clientY - (r.top + r.height / 2);
  const dist = Math.hypot(dx, dy) || 1;
  const k = Math.min(2.4, dist / 60);
  eyes.style.transform = `translate(${(dx / dist) * k}px, ${(dy / dist) * k * 0.7}px)`;
}

/** Call after the mascot markup is in the page. `page` keys the once-per-session greeting. */
export function initMascot({ page = '', greet = '', tips: pageTips = [] } = {}) {
  mw = $('#mw');
  bubble = $('#bub');
  eyes = $('#ey');
  tips = [...pageTips, ...GENERIC];

  $('#mc').addEventListener('click', () => {
    clicks++;
    hop();
    if (clicks % 4 === 0) {
      say('Flag run!');
      run();
    } else {
      say(tips[clicks % tips.length]);
    }
  });

  // the "?" block on the writeups page is rendered later, so listen on the document
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#qb')) return;
    say('Mystery block: +1 flag');
    run();
  });
  document.addEventListener('mousemove', lookAt);

  let first = true;
  try {
    first = !sessionStorage.getItem('byte:' + page);
    sessionStorage.setItem('byte:' + page, '1');
  } catch {}
  if (greet && first) setTimeout(() => say(greet, 4200), 900);
}
