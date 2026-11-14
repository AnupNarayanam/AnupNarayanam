# Editorial rules for the blog

The blog explains recent cyberattacks and security news in plain language. Credibility is the whole point, so these rules are checked before anything is published (the build already refuses a post with fewer than two sources).

1. **Two sources minimum**, at least one primary (vendor advisory, court filing, regulator notice, the affected organisation, or the original research). Put them in the `sources` front matter; they appear at the bottom of the post.
2. **Date everything that can change.** State when a fact was last verified (`updatedDate`) and set `incident.status` to `developing`, `confirmed` or `closed`.
3. **Attribution is a claim.** Write "attributed to X by Y" and name who said it. Do not state an actor as fact unless an authority has confirmed it.
4. **No invented details.** Every CVE number, date, figure and quote comes from a cited source.
5. **Defence in every post.** End with detection and mitigation steps a reader can act on.
6. **No working exploit code for unpatched issues.** Explain how it works; do not hand out a weapon. Indicators of compromise are welcome.
7. **Own the corrections.** If something changes, update the post, set `updatedDate`, and add a short "Corrections" note at the bottom.
8. **Quote lightly.** Paraphrase sources; keep direct quotes short and attributed.

## Publishing steps

1. Copy `docs/templates/blog-post.md` to `src/content/blog/<short-slug>.md` and fill it in.
2. Keep `draft: true` while writing. `npm run dev` shows drafts; the production build hides them.
3. Set `draft: false`, run `npm run build` (the schema validates your front matter), commit and push.
