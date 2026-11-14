/** Shift headings so the shallowest one becomes h2 (the page title is the only h1). Fenced code is left alone. */
export function normalizeHeadings(md) {
  const lines = md.split('\n');
  let fence = false;
  const levels = [];
  for (const l of lines) {
    if (/^```/.test(l)) { fence = !fence; continue; }
    const m = !fence && l.match(/^(#{1,6})\s/);
    if (m) levels.push(m[1].length);
  }
  if (!levels.length) return md;
  const shift = 2 - Math.min(...levels);
  if (shift === 0) return md;
  fence = false;
  return lines.map((l) => {
    if (/^```/.test(l)) { fence = !fence; return l; }
    const m = !fence && l.match(/^(#{1,6})(\s.*)/);
    return m ? '#'.repeat(Math.min(6, Math.max(2, m[1].length + shift))) + m[2] : l;
  }).join('\n');
}

/** YAML front matter. JSON strings are valid YAML, so values are safely quoted. */
export const frontmatter = (data) =>
  '---\n' + Object.entries(data).filter(([, v]) => v != null).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join('\n') + '\n---\n\n';
