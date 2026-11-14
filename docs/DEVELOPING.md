# anup-site

Anup's main website: portfolio, CTF writeups (synced from Notion), a security blog, and a lab catalogue. Built with [Astro](https://astro.build) (static output), deployed on Vercel, searched with Pagefind.

## Run it locally

Needs Node 22.22 or newer (`brew install node`, then `node -v`).

```bash
npm install
npm run dev                      # http://localhost:4321 (drafts are visible here)
npm run build && npm run preview # the real build; site search only works here
```

## Where things live

```
src/
├── pages/            index, about, projects, contact, search, 404, rss.xml
│   ├── writeups/     index + [...slug] (one page per Notion page)
│   ├── blog/         index, [...id], tags/[tag]
│   └── labs/         index, [...id]
├── content/
│   ├── writeups/     Markdown synced from Notion (do not edit by hand)
│   ├── blog/         your posts (Markdown)
│   └── labs/         lab catalogue entries (Markdown)
├── content.config.ts the schemas: a bad post fails the build with a clear message
├── data/profile.ts   your details, stats, projects, skills, timeline
├── layouts/ components/ scripts/ styles/
scripts/              sync-notion.mjs, import-legacy.mjs, check-csp.mjs
docs/                 PLAN.md, EDITORIAL.md, HOSTED-LABS.md, templates/
vercel.json           redirects, security headers, caching
```

## Updating the live site

Every update is: change files, `git push`, and Vercel rebuilds and publishes in about a minute. Every branch and pull request also gets its own preview URL.

| I want to... | Do this |
|---|---|
| Publish a blog post | `cp docs/templates/blog-post.md src/content/blog/my-post.md`, write it (keep `draft: true` while you work, check it with `npm run dev`), set `draft: false`, then commit and push. Read `docs/EDITORIAL.md` first: a post needs at least two sources. |
| Add or edit writeups | Write them in Notion, run `npm run sync`, commit and push. Or let the weekly GitHub Action open a pull request for you (see below). |
| Add a lab | Build it in the `anup-labs` repo, then add `src/content/labs/<id>.md` (template in `docs/templates/lab.md`), commit and push. |
| Change projects, skills, stats, contact details | Edit `src/data/profile.ts`. About and Contact keep their longer text in their `.astro` files. |

```bash
git add -A
git commit -m "Post: <title>"
git push
```

## Sample content

`src/content/blog/` ships with four sample posts about October 2026's "Black October" incidents, each written from cited sources as of 8 Nov 2026. Re-check the facts before you publish them under your name, then edit or delete them freely. `example-incident.md` and `example-lab.md` are drafts that only show in `npm run dev`.

## First-time deploy

1. Create an empty repository on github.com (for example `anup-site`), then:
   ```bash
   git init && git add -A && git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<you>/anup-site.git
   git push -u origin main
   ```
2. On vercel.com choose **Add New, Project**, import the repository. Vercel detects Astro, and `vercel.json` already pins the install command (`npm ci`), build command (`npm run build`, which also builds the search index) and output directory (`dist`). A static Astro site needs no adapter.
3. In **Settings, General**, check that Node.js Version is 22 or newer.
4. In **Settings, Domains** add your domain. In **Settings, Environment Variables** add `SITE_URL` = `https://<your-domain>` (used for canonical links, the sitemap and RSS), then redeploy.
5. Optional: create a form at formspree.io and set `formspreeId` in `src/data/profile.ts` so the contact form sends messages directly. Until then it opens the visitor's email app.

## Notion sync

Create an integration at notion.so/my-integrations (API token, read access) and connect it to the Bios Pentest page.

```bash
read -s NOTION_TOKEN && export NOTION_TOKEN   # paste the token, press Enter
npm run sync
```

It replaces `src/content/writeups/` and `public/writeups-assets/` only after a complete run, so a stopped sync leaves your old content intact.

**Automatic weekly sync:** add the token as a repository secret named `NOTION_TOKEN` (Settings, Secrets and variables, Actions), and enable Settings, Actions, General, **Allow GitHub Actions to create and approve pull requests**. The `Sync writeups from Notion` workflow then opens a pull request every Monday (or when you run it by hand). Merge it to publish.

Coming from the earlier hash-based site? Import its synced content once:
```bash
node scripts/import-legacy.mjs /path/to/old-site/content
```

## Checks

```bash
npm run check          # type-check the Astro files and content schemas
npm run build          # builds the site and the search index
node scripts/check-csp.mjs   # fails if a page has an inline script the CSP does not allow
```

CI runs all three on every push. If you add an inline script and the CSP check fails, copy the hash it prints into `script-src` in `vercel.json`.

## Security notes

- `vercel.json` sets a Content-Security-Policy, HSTS, `nosniff`, a referrer policy and frame blocking. Scripts are allowed only from the site itself plus two hashed inline scripts; styles still allow inline, and Pagefind needs `wasm-unsafe-eval`.
- Intentionally vulnerable labs never run on this site. See `docs/HOSTED-LABS.md` for how hosted labs will be kept on a separate domain and server.
- Never commit tokens. `.env` is ignored; use Vercel and GitHub secrets.

## Good to know

- Astro 7 requires Node 22.22+ and treats unclosed HTML tags as errors; both are already handled here.
- The writeups URLs are real paths now (`/writeups/overthewire-write-ups/bandit-writeup/`). Old `#/...` links redirect on the Writeups page.
- `docs/PLAN.md` is the plan this site was built from.
