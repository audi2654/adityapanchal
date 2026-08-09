Project details and handoff notes

# Handoff: Astro personal writing site

## Status

The site is built, deployed, and live at `https://audi2654.github.io/adityapanchal/`. Deployment via GitHub Actions works. There is no unfinished feature request; what remains is personalization, browser QA of the theme toggle, and two deferred dependency advisories — all listed under "Next-session focus".

The most recent structural work is described under "UI session: dashes, theme toggle, Intersections". Read that before changing the theme CSS or the Intersections routes.

### Commit authorship rules for this repository

- **Never add a `Co-Authored-By: Claude ...` trailer.** The owner wants the history to read as solely theirs and will add attribution themselves if ever wanted.
- **Commit as `audi2654 <36697715+audi2654@users.noreply.github.com>`.** A repo-local `user.name` / `user.email` is now set to enforce this, so plain `git commit` is correct — do not override it with `--author` or env vars. The machine's *global* identity is `apanchal <aditya.panchal@accelya.com>` (a work account), which is wrong for this personal project and was the source of an earlier mistake.

The `origin` remote is `https://github.com/audi2654/adityapanchal.git`, so this deploys as a **project site** at `https://audi2654.github.io/adityapanchal/` — not the `adityapanchal.github.io` user site assumed by the placeholder values in [`src/config.ts`](../src/config.ts). The build derives the correct URL and base path from `GITHUB_REPOSITORY` at build time, so this mismatch does not break the deployment; it only affects the hardcoded local-development fallback.

## What was done

- Replaced the minimal repository stub with a static Astro site for essays and personal notes.
- Added typed Markdown/MDX Content Collections, taxonomy pages, reading time, syntax highlighting, RSS, sitemap, `robots.txt`, SEO metadata, article pagination, and a system-preference dark theme.
- Added static pages for the requested content areas and seeded them with authored sample material.
- Added GitHub Pages deployment at [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml), including project-site base-path handling.
- Upgraded to current Astro 7 after a production audit found vulnerabilities in the initial Astro 5 dependency line. The final dependency audit is clean.

### Deployment fix session (2026-08-09)

The first GitHub Actions run failed. Two independent problems were present in the annotations:

1. **Fatal — `HttpError: Not Found` on `Get Pages site failed`.** The repository never had Pages switched to a GitHub Actions source, so `actions/configure-pages` had no Pages site to read. This is a **repository setting, not a code defect**; the previously committed workflow was otherwise correct.
2. **Warning — Node.js 20 deprecation.** `actions/checkout@v4`, `actions/configure-pages@v5`, and `actions/setup-node@v4` all ship Node 20 bundles, which GitHub now force-runs on Node 24.

Changes made to [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml):

- Bumped every action to its current major, all of which are Node 24 native, clearing the deprecation warning: `checkout@v4→v7`, `setup-node@v4→v7`, `configure-pages@v5→v6`, `upload-pages-artifact@v3→v5`, `deploy-pages@v4→v5`.
- Added `enablement: true` to the `Configure GitHub Pages` step. When the workflow token is permitted to administer Pages, this calls `createPagesSite` with `build_type: 'workflow'` and self-heals problem 1. It is **best-effort only** — the action's own docs note it may require a PAT or GitHub App with Pages administration rights, so the Settings toggle remains the reliable fix.

`node-version: 22` in the workflow was deliberately left alone. It is unrelated to the Node 20 warning (that concerned the actions' own bundled runtimes, not the project's Node) and it satisfies the `>=22.12.0` engines constraint in `package.json`.

### History rewrite (2026-08-09)

`main` was force-pushed twice while correcting commit metadata. Content was never altered — both rewrites were verified tree-identical before pushing.

1. Removed a `Co-Authored-By: Claude` trailer from the deployment-fix commit (`321ead9` → `57da7c8`).
2. Rewrote author *and* committer on the two commits made from the work account, `Testing changes` and the deployment fix, from `apanchal <aditya.panchal@accelya.com>` to `audi2654` (`57da7c8` → `98b0701`). Done with `git filter-branch --env-filter` over `77fad70..HEAD`.

The GitHub **Contributors** list may still show a `claude` entry for a while after the trailer removal; that panel is cached and recomputed asynchronously, so it lags the actual history. Verify against `git log`, not the sidebar. If it persists for more than a day, it is worth reporting to GitHub Support rather than rewriting history again.

A `refs/original/refs/heads/main` backup ref from `filter-branch` still points at the pre-rewrite tip (`57da7c8`) in the local clone. It is harmless and local-only, but it keeps the old commits reachable — delete it once the rewrite is confirmed good if a clean `git gc` is wanted.

Do not repeat implementation details already documented in [README.md](../README.md), [`astro.config.mjs`](../astro.config.mjs), [`src/config.ts`](../src/config.ts), or the source tree.

### Maintenance session (2026-08-09, later)

- **The deployment is live and confirmed working** at `https://audi2654.github.io/adityapanchal/`. The owner set the Pages source to GitHub Actions; the workflow fix plus that setting resolved the failure.
- Renamed `temp/` to `project-dets/` with `git mv`, preserving history. `handoff-doc.md` was carried over unchanged.
- Added [`how-to-customize.md`](how-to-customize.md) in this folder — an owner-facing guide to writing posts, adding images, adding pages, avoiding Node/package drift, the six content types, and long-horizon maintenance. **Keep it current when structure changes**; it is the owner's primary reference.
- Added `.prose img`, `.prose figure`, and `.prose figcaption` rules to [`src/styles/global.css`](../src/styles/global.css). No image styling existed before, so any in-post image wider than the text column would have overflowed on narrow screens. Verified by building a throwaway MDX post using both `![](...)` and the `<Image />` component: both emit hashed, base-path-correct `<img>` tags with intrinsic dimensions. The throwaway files were deleted.
- `src/assets/` is referenced by the guide as the home for post images but **does not exist yet** — it should be created on first use. Images belong there (processed, hashed) rather than in `public/` (verbatim, stable path).

### UI session: dashes, theme toggle, Intersections (2026-08-09, later still)

Four owner requests, all implemented. Nothing here is speculative — each was verified in the built output.

**1. Stray `---` visible at the top-left of every page.** Root cause: [`src/components/SiteHead.astro`](../src/components/SiteHead.astro) had a second `---` *after* its closing frontmatter fence, so Astro treated it as template content and emitted a literal text node into `<head>`. The HTML parser relocates stray text out of `<head>` to the start of `<body>`, which is exactly where it appeared. Confirmed present in committed history with `git show HEAD:src/components/SiteHead.astro | tail -3` before fixing, rather than guessed at. **Watch for this shape of bug in any component whose frontmatter was hand-edited.**

**2. Light/dark toggle.** New [`src/components/ThemeToggle.astro`](../src/components/ThemeToggle.astro), placed as the last item in the footer nav. Design constraints it satisfies:

- No framework, no hydration, no bundle — one `is:inline` script in the component, plus a second in `SiteHead.astro` that applies the saved theme in `<head>` before first paint so there is no flash of the wrong palette.
- The `SiteHead` script adds a `js` class to `<html>`; CSS keeps `.theme-toggle { display: none }` until then, so the control never renders as a dead button without scripting.
- A single inline SVG with sun and moon paths swapped by CSS on theme — no second request, no icon font.
- `min-height: 2.15rem` for a usable touch target; the footer stacks below 40rem.
- The button's `aria-label` and visible label always name the theme it will switch **to**, and `aria-pressed` tracks the current state.
- `localStorage` access is wrapped in `try`/`catch`; if storage is blocked the choice simply applies to that page view.

**3. Removed the hidden "Elsewhere in this small corner" homepage block** and added **Intersections** to the top navigation between Writing and Projects, per the owner's dislike of tucked-away sections. The blurb text lives in `intersectionsIntro` in [`src/config.ts`](../src/config.ts).

**4. Nested the small pages under Intersections.** `git mv` preserved rename history for the three existing pages:

| Before | After |
|---|---|
| `/thoughts/` | `/intersections/thoughts/` (retitled "Short thoughts") |
| `/books/` | `/intersections/books/` |
| `/movies/` | `/intersections/films/` (retitled "Films") |
| — | `/intersections/randoms/` (new) |

`intersectionSections` in `src/config.ts` is the single source of truth for this list; the hub page and the homepage both map over it, so adding a fifth sub-page is a one-line config change plus the page file. The `movies` config array was left named `movies` even though the page is now Films — renaming it would be churn.

Inbound links to the three old paths now 404. This was an accepted trade: the owner asked for the nesting, and the pages were only days old on a site with no external links yet. The "never break a URL" section of [`how-to-customize.md`](how-to-customize.md) now records this as a closed one-off exception.

Also fixed along the way: `.eyebrow a` had `color: inherit` with no other affordance, which would have made the new `Intersections /` breadcrumbs indistinguishable from plain text. It now carries a muted underline colour plus a hover state.

**Follow-up trims requested by the owner and applied in the same session:** removed the "The subjects" chip section from the Intersections hub — the `intersections` array in `src/config.ts` and the `.subject-list` CSS went with it, since nothing else used them. Added `padding-block: 1.5rem` to `.site-header__inner`; removing the stray `---` had also removed the accidental whitespace that was keeping the site name off the top edge of the viewport, so the header needed real padding rather than that side effect.

**Verified:** `npm run check` clean (0/0/0 across 35 files). `GITHUB_REPOSITORY=audi2654/adityapanchal npm run build` produced **24 pages** (up from 22). A shell link-checker resolved every `href="/adityapanchal/..."` in every built HTML file against `dist` and found **zero dead links**. The `data-theme` selectors survive CSS minification. The theme script is inlined in `dist/index.html`, and the toggle renders in the footer of both the homepage and a nested page.

**Not verified:** the toggle has never been exercised in a real browser. The `browser:control-in-app-browser` skill suggested at the bottom of this document **does not exist in the current environment** — invoking it fails with `Unknown skill`. All QA was static inspection of `dist`. A future session with browser tooling should confirm the toggle click, the no-flash behaviour on reload, keyboard focus, and layout at mobile widths.

### Unlisted homelab redirect (2026-08-09, later again)

The owner runs self-hosted OSS apps via Coolify on their own VPS and wanted a personal shortcut to it from this site — reachable by typing the URL, invisible to everyone else.

[`src/pages/homelab.astro`](../src/pages/homelab.astro) is published at `/adityapanchal/homelab/` and redirects to `http://140.245.18.238:8000` with a `<meta http-equiv="refresh">`. A meta refresh rather than a script, so it works with scripting disabled; the destination is also a plain link on the page as a fallback.

Three mechanisms keep it out of search results, and all three matter:

1. **`noindex` prop, new on `BaseLayout` → `SiteHead`.** Emits `noindex, nofollow, noarchive, nosnippet, noimageindex` instead of the default `index, follow`. This is the only one of the three that a crawler is obliged to honour once it has the URL.
2. **Sitemap exclusion** via a `filter` on the `sitemap()` integration in [`astro.config.mjs`](../astro.config.mjs). A sitemap entry is an active request to crawl a URL, so it would defeat the point. **Any future page that sets `noindex` must be added to that filter too** — the two are coupled and nothing enforces it automatically. Verified: 23 sitemap entries for 25 built pages.
3. **No inbound link anywhere.** Not in `navigation`, not in `intersectionSections`, not referenced by any other page. Verified by grepping all of `dist` for `homelab` outside `dist/homelab/`: zero hits. Crawlers find pages by following links; with none, discovery depends on someone typing the path.

**Deliberately *not* in `robots.txt`.** That file is world-readable at a well-known path, so a `Disallow: /homelab/` line would advertise the exact URL to anyone curious — and worse, a compliant crawler that obeys the disallow never fetches the page, so it never reads the `noindex` tag and the URL can still surface in results as a bare link. Letting the page be fetched and self-suppress is the stronger arrangement. Do not "improve" this by adding a robots.txt rule.

**This is unlisted, not private.** A static site on GitHub Pages cannot authenticate anyone: the HTML is public to whoever knows the path, and it names the server's IP. Obscurity is the only barrier — the actual security boundary is Coolify's own login. If the VPS should not be publicly reachable at all, that belongs in the VPS firewall or a VPN, not here.

The owner corrected the target to port `8000` immediately after the first commit — Coolify's default listening port — so the working address is `http://140.245.18.238:8000`. If it moves again, the `dashboard` constant at the top of `homelab.astro` is the only place to edit.

**Unverified:** whether that address actually serves the Coolify login. Probing it from this machine is useless — a Zscaler corporate proxy intercepts the request (`307` to `gateway.zscaler.net` on port 80, `403` on 443), so the real response can never be observed from here. Any future session on this machine should assume the same and rely on the owner to confirm. **The login is served over plain `http`, so credentials cross the network in cleartext** — putting a domain and a Let's Encrypt certificate in front of it (Coolify supports this natively) is worth doing, after which the URL here needs updating to `https` and the `:8000` port likely disappears.

## Important implementation decisions

- Internal links use [`src/utils/url.ts`](../src/utils/url.ts), which prefixes Astro's configured base path. Preserve this helper for any new internal route so both user sites and GitHub Pages project sites work.
- Deployment metadata is derived from `GITHUB_REPOSITORY`; `SITE_URL` can override the public canonical URL for a custom domain. See [`astro.config.mjs`](../astro.config.mjs) and the deployment notes in [README.md](../README.md).
- `robots.txt` is generated by [`src/pages/robots.txt.ts`](../src/pages/robots.txt.ts), not stored in `public`, so its sitemap URL always matches the build configuration.
- Content schemas use `z` from `astro/zod`, which is the non-deprecated Astro 7 path. Do not change it back to the legacy `astro:content` export.
- The design uses **no framework hydration and no client bundle**. The one exception is the theme toggle, added 9 August 2026: two `is:inline` scripts totalling a few dozen lines. Keep it that way — do not introduce a framework island for interactivity.
- Keeping a page out of search results takes **two** coordinated changes: `noindex` on `BaseLayout`, *and* an entry in the `sitemap()` filter in [`astro.config.mjs`](../astro.config.mjs). Doing only the first submits the URL to search engines while asking them to ignore it.
- Theme resolution order: an explicit `data-theme` on `<html>` (set by the toggle, persisted in `localStorage`) always beats `prefers-color-scheme`. That is why the dark media query in [`src/styles/global.css`](../src/styles/global.css) is written as `:root:not([data-theme='light'])`. Changing that selector shape will break the override.

## Verification completed

- `npm run build` passed on Astro 7.1.3 with **0 errors, 0 warnings, and 0 hints**; it generated 22 static routes, RSS, `robots.txt`, and the sitemap.
- A GitHub Pages project-site build was also simulated with `GITHUB_REPOSITORY=adityapanchal/adityapanchal`; generated `robots.txt` correctly referenced the project-prefixed sitemap.
- `npm audit --omit=dev` initially found Astro 5 vulnerabilities. After the Astro upgrade, `npm install --package-lock-only` reported **0 vulnerabilities**.

### Deployment fix session (2026-08-09)

- `npm ci` then `npm run build` re-verified on Node 24.18.0 / npm 12.0.2 with the **real** remote path (`GITHUB_REPOSITORY=audi2654/adityapanchal`): 22 pages built, no errors. Generated `robots.txt` correctly read `Sitemap: https://audi2654.github.io/adityapanchal/sitemap-index.xml`, confirming project-site base-path handling works for this repository.
- All five bumped action majors were confirmed to exist via `git ls-remote --tags` against each action repository, not assumed from memory.
- **The workflow change itself is unverified end-to-end.** It cannot be tested locally; it requires a push and a real Actions run. A future session must check the run result rather than assume success.
- **Known regression versus the earlier clean audit:** `npm audit --omit=dev` now reports **2 high-severity production vulnerabilities** (`js-yaml` ≤4.3.0, CVE-2026-59870 quadratic CPU in `!!omap`; and `nanoid` <3.3.17, infinite loop on zero size). Both are transitive Astro dependencies with fixes available via `npm audit fix`. These are new advisories published since the original audit, not a reintroduced regression. They were left unaddressed to keep this session scoped to the deployment failure — a dependency bump would change the lockfile mid-deployment-debug. Worth resolving in a follow-up.

## Next-session focus

The previously blocking Pages **Source → GitHub Actions** setting has been done by the owner, and deploys are green. If a future run fails, check in this order: whether the `github-pages` environment has protection rules blocking `main`; and whether repository **Settings → Actions → Workflow permissions** is restrictive enough to block the `pages: write` / `id-token: write` grants the workflow requests.

Personalization and polish:

1. Replace the sample bio, recommendations, projects, and writing with the owner’s real material in [`src/config.ts`](../src/config.ts), [`src/pages/`](../src/pages), and [`src/content/writing/`](../src/content/writing/). Note that `site.url` and `site.github` there still point at `adityapanchal`, while the actual remote is `audi2654` — reconcile these when the real domain is decided.
2. Confirm the desired public domain and GitHub repository name, then update `SITE_URL` through GitHub Actions variables if a custom domain is used.
3. Resolve the 2 high-severity production advisories noted under Verification. `npm audit fix` has been offered twice and **not authorized** — ask before running it.
4. Browser QA of the theme toggle, which has never run. See "Not verified" in the UI session notes above.
5. The seeded sample content under Intersections (three books, three films, three randoms, the thoughts list) is still placeholder material written by an agent, not the owner's own. Replace it.
6. Confirm `/homelab/` reaches the Coolify login, and move it to `https` if it is currently plain `http`. See "Unlisted homelab redirect" above.

## Suggested skills

- `browser:control-in-app-browser` — **unavailable as of 2026-08-09**; invoking it returns `Unknown skill`. It would be the right tool for visual QA of the locally served site, keyboard navigation, responsive layout, and rendered metadata. Check whether it exists before planning around it; otherwise fall back to inspecting `dist` directly.
- `openai-docs` — not normally needed; only invoke if a future request involves OpenAI products or APIs.

No sensitive credentials, keys, or private user data were introduced or encountered. The one piece of infrastructure detail now in the repository is the VPS IP address in [`src/pages/homelab.astro`](../src/pages/homelab.astro), committed knowingly — it is a public-facing address, not a secret, and git will retain it permanently.
