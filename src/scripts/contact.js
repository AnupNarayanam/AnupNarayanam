import { SITE } from '../data/profile.ts';
import { say, run, hop } from './mascot.js';

const $ = (s) => document.querySelector(s);

$('#copy').addEventListener('click', async (e) => {
  try {
    await navigator.clipboard.writeText(SITE.email);
    e.target.textContent = 'Copied';
    say('Email copied.');
  } catch {
    say('Could not copy. Select it by hand.');
  }
  setTimeout(() => { e.target.textContent = 'Copy'; }, 1800);
});

const form = $('#form');
const out = $('#fstat');
const btn = form.querySelector('button[type="submit"]');
const live = SITE.formspreeId && SITE.formspreeId !== 'YOUR_FORM_ID';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  if (data.get('_gotcha')) return; // honeypot: bots fill it, people never see it

  if (!live) {
    // no Formspree id yet: hand the message to the visitor's email app instead
    const subject = data.get('subject') || `Message from ${data.get('name')}`;
    const body = `${data.get('message')}\n\n${data.get('name')}\n${data.get('email')}`;
    location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    out.textContent = `Opening your email app. If nothing opens, write to ${SITE.email}.`;
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Sending...';
  try {
    const res = await fetch(`https://formspree.io/f/${SITE.formspreeId}`, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(res.status);
    form.reset();
    out.textContent = 'Message sent. Thanks! I will reply within 24 hours.';
    say('Message sent!');
    hop();
    run();
  } catch {
    out.textContent = `Could not send. Please email me directly at ${SITE.email}.`;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send message';
  }
});
