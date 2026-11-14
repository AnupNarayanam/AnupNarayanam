# Plan: Anup's main website (portfolio, writeups, blog, labs)

## Primary goal

A visitor lands on Anup's domain and meets the portfolio first, then can move on to his CTF writeups, his plain-language write-ups of recent cyberattacks, and hands-on labs he built himself, all on one fast, searchable site that Anup extends by adding a Markdown file or a Notion page.

---

## Phase 0: Documentation Discovery

**How this serves the primary goal:** it stops us building on APIs that do not exist, and it fixes the architecture decisions that are expensive to change later (URLs, content model, where vulnerable code runs).

### Sources consulted (read this session)

| Topic | Source | What it established |
|---|---|---|
| Content collections | https://docs.astro.build/en/guides/content-collections/ | Collections are defined in `src/content.config.ts` with `defineCollection({ loader, schema })` and registered through one exported `collections` object. Local Markdown/MDX uses the `glob({ base, pattern })` loader. Entries are queried with `getCollection()` / `getEntry()`. |
| Astro v6 module reference | https://v6.docs.astro.build/fr/reference/modules/astro-content/ | In v6, `z` comes from `astro/zod`, `glob` and `file` from `astro/loaders`, and `reference('collection')` links entries across collections. |
| Upgrade to v6 | https://docs.astro.build/en/guides/upgrade-to/v6/ | Astro 6 needs Node 22.12.0 or higher, moves to Zod 4, and uses Vite 7. Astro 7 (current) needs Node 22.22.0 or higher and Vite 8. Specify Node in `.nvmrc` (`22.22.0`) and in the host's settings. |
| Legacy collections | https://lilting.ch/en/articles/astro-6-stable-release-upgrade-guide (third party) | The old `type: 'content'` collection form is retired; only loader-based collections remain. |
| RSS | https://www.npmjs.com/package/@astrojs/rss and https://docs.astro.build/en/guides/rss/ | `src/pages/rss.xml.js` exports `GET(context)` returning `rss({ title, description, site: context.site, items })`. Each item needs `link`, `title`, `pubDate`. `site` must be set in the Astro config. Add `<link rel="alternate" type="application/rss+xml" ...>` to the head for autodiscovery. |
| Static search | https://flaviocopes.com/static-site-search-pagefind/ and https://deku.posstree.com/en/astro/search/ | `npm i -D pagefind`; build script `astro build && pagefind --site dist`; output goes to `dist/pagefind/`; mark the content region with `data-pagefind-body`, exclude with `data-pagefind-ignore`, filter with `data-pagefind-filter`. It only works on a built site, not in the dev server. |
| Container hardening | https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html | `--cap-drop all` then add only what is needed; `--security-opt=no-new-privileges`; never `--privileged`; never mount `/var/run/docker.sock` into a container (read-only does not fix it). |
| Compose equivalents | https://dev.to/teguh_coding/docker-security-hardening-10-practices-that-will-protect-your-containers-in-production-4ahe (third party) | Compose keys: `cap_drop`, `read_only`, `tmpfs`, `security_opt: ["no-new-privileges:true"]`, `pids_limit`, memory/CPU limits, `networks: ... internal: true`. |
| Hosted-lab prior art | https://github.com/offsecginger/CTFd-Docker-Challenges, https://github.com/andyjsmith/CTFd-Docker-Plugin, https://github.com/caprinux/ctfd-whale | Community CTFd plugins already spawn per-user or per-team containers with timeouts and dynamic flags. Maintenance status varies, so they are evaluated in a spike, not assumed. |
| Existing code | `anup-portfolio/` (this project): `css/tokens.css`, `js/shell.js`, `js/palette.js`, `js/writeups/*`, `scripts/sync-notion.mjs` | The design system, shell, palette, markdown renderer and Notion sync that must carry over. |

### Allowed APIs (all cited above)

`defineCollection`, `reference` (from `astro:content`); `glob`, `file` (from `astro/loaders`); `z` (from `astro/zod`); `getCollection`, `getEntry`; `rss()` from `@astrojs/rss`; the `pagefind` CLI and `data-pagefind-*` attributes; Docker and Compose hardening options listed above.

### Resolved while building (Phase 1 findings)

- Astro 7.4.1 is current (the third-party report was right). It needs Node 22.22.0 or newer, uses the Rust compiler (unclosed tags are errors), defaults `compressHTML` to `'jsx'`, and renders Markdown with Satteri. `render()` is a standalone import from `astro:content`, and entries use `entry.id` (not `slug`).
- `@astrojs/sitemap` is configured with `sitemap()` in `integrations` and needs `site` set; it writes `sitemap-index.xml` and `sitemap-0.xml`. The `filter` option is used to keep `/search/` out of the sitemap.
- Pagefind 1.6.0: `pagefind --site dist` after `astro build`; the JavaScript API is `await import('/pagefind/pagefind.js')`, `pagefind.search(q)`, then `await result.data()` for `url`, `excerpt` and `meta.title`. Tested against the built index (queries for writeup content return the right pages).

### Anti-patterns to avoid

- `defineCollection({ type: 'content' })` and any pre-loader collection form.
- Importing `z` from `astro:content` (Astro 6 uses `astro/zod`).
- Running or testing Pagefind against `astro dev`.
- `--privileged`, a mounted Docker socket, or running as root in any lab container.
- Hosting an intentionally vulnerable app on the main site's domain, host or cookie scope.
- Keeping hash routes (`#/...`) for content that should be searchable and shareable.

### Architecture decisions (fix these before building)

| # | Decision | Choice | Why |
|---|---|---|---|
| D1 | How the site is built | Astro (static output) with content collections | The writeups are hash-routed today, so they have no real URLs, no link previews and no search-engine indexing. A blog needs all three, plus RSS. Astro keeps the site static and fast and lets the current design system become components. Cost: a build step and Node 22.12+. |
| D2 | Where each content type lives | Writeups: Notion, synced to Markdown. Blog: Markdown/MDX in git. Labs: Markdown metadata in the site repo, lab code in a separate repo | Writeups are already in Notion. Research posts need citations, review and history, which git gives for free. Vulnerable lab code must never ship with the main site. |
| D3 | URL scheme | `/`, `/about`, `/projects`, `/contact`, `/writeups/...`, `/blog/...`, `/blog/tags/<tag>`, `/labs/...`, `/rss.xml` | Real paths for everything shareable. |
| D4 | Search | Pagefind, one index for the whole site | Runs in the browser, no server, replaces the custom `search.json`. The Ctrl/Cmd+K palette keeps its page and action entries and queries Pagefind for content. |
| D5 | Where labs run | Stage A: visitors run labs on their own machine (hardened Docker Compose). Stage B (later): hosted instances on a separate server and a separate registrable domain | Stage A needs no infrastructure and carries no abuse risk. Stage B is the largest security surface in the whole project, so it is designed now and built only after several labs exist. |
| D6 | Hosting | Main site: static host (Vercel). Labs infrastructure: its own VPS or cloud project, never the same account or domain | A compromised lab must not be able to touch the site, its cookies or its deploy pipeline. |

---

## Phase 1: Foundation

**How this serves the primary goal:** every later section (writeups, blog, labs) is a page type on this foundation, so one design system and one layout keep the four parts feeling like one site.

What to implement
- `npm create astro@latest` (static output), `.nvmrc` with `22.12.0`, `site` set in the config.
- Copy the colour and type tokens from `css/tokens.css` and the component styles from `css/*.css` into `src/styles/` unchanged; port `shell.js` header, footer, theme toggle, mascot and palette into `Header.astro`, `Footer.astro`, `Mascot.astro` and one small client script.
- One `Base.astro` layout: skip link, grid background, meta/OG tags, canonical, theme-colour, RSS autodiscovery link.
- GitHub Actions: install, `astro check`, build.

Documentation references: content collections guide (config location), upgrade-to-v6 (Node), RSS guide (autodiscovery tag).

Verification checklist
- `npm run build` succeeds on Node 22.12.0 and a newer Node.
- Header, footer, theme toggle and mascot render on a placeholder page in light and dark.
- `grep -rn "type: 'content'" src` returns nothing.

Anti-pattern guards: do not re-theme; do not add a CSS framework; do not hand-roll a router.

## Phase 2: Portfolio

**How this serves the primary goal:** the portfolio is the front door, so it must be live and unchanged to the visitor before anything else is added.

What to implement
- Home, About, Projects, Contact and 404 as `.astro` pages reading from `src/data/profile.ts` (the current `js/data/profile.js`, typed).
- Keep the existing behaviours: role rotator, count-up stats, project filter, contact form with mailto fallback.
- Nav becomes: Projects, Writeups, Blog, Labs, About, Contact (sections that do not exist yet link to a "coming soon" state, hidden until their phase ships).

Documentation references: the existing pages in `anup-portfolio/` are the visual spec; screenshots go in `docs/parity/`.

Verification checklist
- Side-by-side comparison with the current site at 375, 768 and 1280 px.
- All facts in the old pages still present (script from the previous verification: grep GPA, dates, contact details, skills).
- Lighthouse: performance, accessibility and best-practices all at 95 or above on the home page.

Anti-pattern guards: no new copy or invented projects; no layout changes beyond what Astro requires.

## Phase 3: Writeups

**How this serves the primary goal:** the writeups are the proof behind the portfolio, and they only help if each one has its own URL that can be shared and found.

What to implement
- `src/content.config.ts`: a `writeups` collection (`glob` loader over `src/content/writeups/**/*.md`) with a schema for `title`, `notionId`, `parent`, `event`, `category`, `tags`, `difficulty`, `updated`, `draft`. Copy the blog example from the content collections guide, then change the fields.
- Change `scripts/sync-notion.mjs` to write Markdown with that frontmatter into `src/content/writeups/` (path mirrors the Notion nesting) and to download images into `public/writeups-assets/` or an `assets` folder Astro can optimise. Keep the Notion API calls as they are.
- Routes: `src/pages/writeups/index.astro` (collections grid), `src/pages/writeups/[...slug].astro` (page, breadcrumbs, child cards, prev/next), using `getStaticPaths` over `getCollection('writeups')`.
- Replace the custom Markdown renderer with Astro's built-in Markdown rendering (`render()` from the entry) and keep the existing prose CSS.
- Legacy links: a tiny client script on `/writeups/` maps old `#/a/b` hashes to `/writeups/a/b/`.
- GitHub Action (scheduled and manual) runs the sync with `NOTION_TOKEN` from repository secrets and opens a pull request with the changes.

Documentation references: content collections guide (`getCollection`, rendering), the existing `sync-notion.mjs` (keep its tested block-to-Markdown logic).

Verification checklist
- Every page in `content/index.json` today has a built HTML page (compare counts).
- A writeup with images and a table builds and displays correctly.
- Old hash links redirect correctly.
- The sync mock test (existing) still passes against the new output folder.

Anti-pattern guards: no secrets in the repository; no runtime fetches to Notion from the browser; do not drop the `[...slug]` rest route for fixed per-page files.

## Phase 4: Blog (cyberattack info pages)

**How this serves the primary goal:** this is the part that brings repeat visitors and search traffic, and its credibility depends on structure and sources, so the template and the rules come before the first post.

What to implement
- `blog` collection (`glob` over `src/content/blog/**/*.{md,mdx}`) with schema: `title`, `description`, `pubDate`, `updatedDate`, `tags`, `draft`, `sources` (array of `{ title, url }`, at least two), and an optional `incident` object: `name`, `date`, `actor`, `cves` (array), `sectors` (array), `attackTechniques` (MITRE ATT&CK IDs), `status` (`developing`, `confirmed`, `closed`).
- Post layout with fixed sections for incident posts: Summary, Timeline, How it worked (technical analysis), Impact, Detection and mitigation, Indicators of compromise, Sources. A starter file `src/content/blog/_template.mdx` has these headings.
- Pages: `/blog/` (latest first, tag chips, text filter), `/blog/[id]/`, `/blog/tags/[tag]/`.
- `src/pages/rss.xml.js` using `getCollection('blog')` filtered to non-drafts, sorted by date.
- Social preview image per post generated at build time (decide the tool in Phase 1 after reading its docs).
- Editorial rules in `docs/EDITORIAL.md`: at least two independent sources, link primary sources, date every claim that may change, show a "last verified" date, mark attribution as unconfirmed unless an authority has confirmed it, defensive guidance in every post, no working exploit code for unpatched issues, a corrections note at the bottom when something changes.

Documentation references: RSS guide (`rss()` options), content collections guide (schema and `reference`).

Verification checklist
- A post missing `sources` fails the build (schema validation).
- `/rss.xml` validates in a feed validator and lists only published posts.
- Draft posts do not appear in lists, tags, feed or sitemap.

Anti-pattern guards: no comment system or accounts; do not publish a post from a single source; no invented dates or CVE numbers.

## Phase 5: Labs

**How this serves the primary goal:** labs show that Anup can build, not only break, and the catalogue plus a safe template lets him add labs quickly without ever putting vulnerable code on the main site.

What to implement
- `labs` collection with schema: `title`, `summary`, `difficulty`, `category`, `skills`, `estimatedMinutes`, `status` (`draft`, `beta`, `released`), `runtime` (`local`, `hosted`, `both`), `repo` (URL), `version`, `objectives`, `hints` (ordered, revealed one at a time), `flagFormat`, `writeup` (`reference` to a writeup or blog entry, shown after solving).
- Pages: `/labs/` (grid with difficulty and category filters) and `/labs/[id]/` (objectives, run instructions, progressive hints, link to repo, solution link).
- A separate repository `anup-labs` (not part of the site build):
  - `labs/<lab-id>/lab.yaml` (id, version, services, ports, healthcheck, flag mode, resource limits, time-to-live), `compose.yaml`, `app/`, `solution/`, `tests/`.
  - `template/` with a Compose file that already includes the defaults from the OWASP cheat sheet: `cap_drop: [ALL]`, `read_only: true`, `tmpfs` for `/tmp` with `noexec`, `security_opt: ["no-new-privileges:true"]`, a non-root `user`, `pids_limit`, memory and CPU limits, and an `internal: true` network for back-end services.
  - `tools/validate-lab`: a CI check that fails any lab whose Compose file lacks those settings or uses `privileged`, a Docker socket mount or `network_mode: host`.
  - Flags: generated per run (HMAC of a secret, the lab id and a run id) so flags cannot be shared; static flags allowed only for local labs.
- Hosted-lab design document `docs/HOSTED-LABS.md` (design only, no build): control-plane API (FastAPI) that starts one container set per session on a dedicated host; the control plane talks to the container runtime through its own API with TLS or a rootless runtime and no lab container ever sees the socket; reverse proxy with wildcard subdomains on the separate labs domain; egress denied by default; a reaper that destroys instances after the time-to-live; per-user quotas; sign-in with GitHub OAuth; flag verification service; logging and alerting. Include a spike task: install CTFd with one of the container plugins on a throwaway server and decide whether to adopt it or build.

Documentation references: OWASP Docker Security Cheat Sheet (every hardening option), the CTFd plugin repositories (features to compare), content collections guide (`reference`).

Verification checklist
- The first template lab starts with `docker compose up`, passes its healthcheck, and the validator accepts it.
- A deliberately bad Compose file (privileged, socket mount) is rejected by the validator.
- A lab page builds with hints, and the writeup link only appears under "After you solve it".

Anti-pattern guards: never run a lab from the site's host or domain; no `--privileged`; no Docker socket mounts; do not build the hosted platform in this phase.

## Phase 6: Search and launch

**How this serves the primary goal:** search ties the four parts together (one box finds a writeup, a post or a lab), and launch hardening makes the site safe to put your name on.

What to implement
- Pagefind: add `pagefind` as a dev dependency, change the build script to `astro build && pagefind --site dist`, add `data-pagefind-body` to the main content of each page type and `data-pagefind-filter` for type and tag. Rebuild the palette's content results on the Pagefind JavaScript API; add a `/search` page.
- Sitemap (after reading the integration's docs), `robots.txt`, canonical URLs, Open Graph tags, JSON-LD (`Person` on home, `Article` on blog posts).
- Security headers on the host (`Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS) and a CSP that works with the site's own scripts and the font host.
- Redirects from the old portfolio and writeups URLs; custom domain; HTTPS only.
- Accessibility pass (keyboard, focus, contrast, reduced motion) and Lighthouse budgets in CI.

Documentation references: Pagefind sources above; the sitemap integration docs (to be read first); the host's headers documentation.

Verification checklist
- Searching a word from a writeup, a blog post and a lab page each returns that page.
- No header, nav or footer text appears in search results.
- Security headers present in a response check; no inline script blocked by the CSP.

Anti-pattern guards: do not test Pagefind in the dev server; do not add analytics or third-party scripts by default.

## Phase 7: Verification

**How this serves the primary goal:** it proves that a visitor can actually do what the goal says before anyone is sent to the site.

1. `npm run build` on Node 22.12.0 and the latest LTS; `astro check` clean.
2. Link check across `dist/` (internal links and assets), plus a check that every Notion page and every lab and blog entry produced exactly one page.
3. Grep for the anti-patterns above: `type: 'content'`, `astro:content` Zod imports, `privileged`, `docker.sock`, `network_mode: host`, `#/` hash routing in new code.
4. Pagefind: index exists in `dist/pagefind/`, and three known queries return the right pages.
5. RSS validates; drafts excluded everywhere.
6. Lighthouse (performance, accessibility, SEO, best practices) at 95 or above on home, a writeup, a blog post and a lab page.
7. Lab validator passes on every released lab and fails on the deliberate bad example.
8. Manual pass in light and dark at 375, 768 and 1280 px, keyboard only through every page type.

---

## Repository layout (target)

```
anup-site/                       repo 1, deploys to the static host
├── astro.config.mjs  .nvmrc  package.json
├── src/
│   ├── content.config.ts        writeups, blog, labs schemas
│   ├── content/{writeups,blog,labs}/
│   ├── data/profile.ts
│   ├── layouts/Base.astro
│   ├── components/              Header, Footer, Card, SectionHead, Chip, Mascot, Palette
│   ├── pages/                   index, about, projects, contact, 404, rss.xml.js,
│   │                            writeups/[...slug], blog/..., labs/..., search
│   └── styles/                  tokens, base, layout, components, prose
├── scripts/sync-notion.mjs
├── docs/                        PLAN, EDITORIAL, HOSTED-LABS, parity screenshots
└── .github/workflows/           ci.yml, notion-sync.yml

anup-labs/                       repo 2, lab sources (never deployed with the site)
├── labs/<lab-id>/               lab.yaml, compose.yaml, app/, solution/, tests/
├── template/
└── tools/validate-lab

anup-labs-platform/              repo 3, later: control plane for hosted labs
```

## Deferred

Building the hosted labs platform (until at least three labs exist and the spike is done) · user accounts and comments · newsletter and analytics · multiple languages · writing the actual blog posts and labs.
