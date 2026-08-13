# How to customize this site

A practical reference for the person maintaining this site — written to still make sense years from now, when the details have gone fuzzy.

Everything here was verified against this repository, not assumed from Astro's general docs.

**The one rule that matters:** every internal link must go through `internalUrl()` from [`src/utils/url.ts`](../src/utils/url.ts). The site now lives at its own domain, `https://adityapanchal.is-a.dev/`, so the base path is `/` and a hardcoded `/about/` happens to work — but that is luck, not design. It broke on the old `audi2654.github.io/adityapanchal/` address and it will break again on the next move. Keep using the helper. Markdown links inside posts and images are handled automatically; this rule is only for `.astro` files.

---

## 1. Writing a blog post

One file per post, in [`src/content/writing/`](../src/content/writing/). The filename becomes the URL: `making-room.md` → `/writing/making-room/`. Use lowercase-with-hyphens, and treat the name as permanent — changing it breaks every existing link to that post.

```markdown
---
title: Interfaces are promises
description: "A short summary. Shows on the listing page and in search results."
published: 2026-07-12
tags: [Software, Design]
category: Software
---

Your first paragraph. Plain Markdown from here on.
```

Then:

```bash
npm run dev     # preview at localhost:4321, updates as you save
```

Commit and push to `main`. GitHub Actions rebuilds and publishes in a couple of minutes. Reading time, the RSS entry, tag and category pages, and prev/next links all happen automatically.

### Frontmatter fields

Validated at build time by [`src/content.config.ts`](../src/content.config.ts). A typo fails the build with a clear message rather than publishing something broken — that safety net is deliberate.

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Max 120 characters. |
| `description` | yes | Max 200 characters. Wrap in quotes if it contains a colon. |
| `published` | yes | `YYYY-MM-DD`. Sorts the archive; newest first. |
| `category` | yes | Exactly one. Creates `/categories/<name>/`. |
| `tags` | no | Any number. Each creates `/tags/<name>/`. Defaults to none. |
| `updated` | no | `YYYY-MM-DD`. Shows a "revised" date. |
| `draft` | no | `true` hides it everywhere — listing, RSS, sitemap. Safe to commit. |
| `featured` | no | `true` surfaces it on the homepage. |

Categories and tags are free text — no registry to update, but they're **case- and spelling-sensitive**. `Software` and `software` become two separate pages. Copy from an existing post rather than retyping.

### Drafts

`draft: true` is filtered out by `getPublishedWriting()` in [`src/utils/writing.ts`](../src/utils/writing.ts). Push half-finished work freely; delete the line to publish.

### Subfolders

Folders become URL segments: `writing/notes/slow-notes.mdx` → `/writing/notes/slow-notes/`. Optional — flat is fine, and flat means fewer decisions later.

---

## 2. Adding images

Two locations, and the difference matters:

**`src/assets/` — for images inside posts.** Astro compresses them, adds `width`/`height` to prevent layout shift, and adds a content hash to the filename for permanent caching. Create the folder when you need it; it doesn't exist yet.

```markdown
![A description of the image](../../assets/my-photo.jpg)
```

The relative path is from your post file to the image. From `src/content/writing/`, that's `../../assets/`. From a subfolder like `writing/notes/`, it's `../../../assets/`. Astro rewrites it to the final hashed, base-path-correct URL at build time.

For a caption, or to control the layout, rename the file to `.mdx` and use the `Image` component:

```mdx
---
title: Your post
description: Your description
published: 2026-08-09
category: Notes
---

import { Image } from 'astro:assets';
import photo from '../../assets/my-photo.jpg';

<figure>
  <Image src={photo} alt="A description" />
  <figcaption>The caption.</figcaption>
</figure>
```

Both forms are verified working, and `.prose img` / `figcaption` styles exist in [`src/styles/global.css`](../src/styles/global.css) so images scale down on phones instead of overflowing.

**`public/` — for fixed files that must keep their exact name and path.** Favicons, `CNAME`, `og.svg`, a PDF résumé. Copied verbatim, no processing, no cache-busting hash. Reference these with `internalUrl('/resume.pdf')` in `.astro` files.

Rule of thumb: **post illustrations go in `src/assets/`; site furniture goes in `public/`.**

Always write real alt text. If an image is purely decorative use `alt=""` — but never omit it.

### Practical notes

- Resize before committing. Roughly 1600px wide is plenty; a 6MB phone photo bloats the repo permanently, because **git never forgets a committed file** even after you delete it.
- Prefer `.jpg` for photos, `.svg` for diagrams, `.png` for screenshots with text.
- Astro won't optimize anything in `public/` — that's the tradeoff for a stable URL.

---

## 3. Adding a new page

Create a `.astro` file in [`src/pages/`](../src/pages/). The filename becomes the route: `reading.astro` → `/reading/`. No routing config to register anywhere.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Reading" description="What I'm reading now.">
  <header class="page-header">
    <p class="eyebrow">Reading</p>
    <h1>A headline.</h1>
    <p>One or two framing sentences.</p>
  </header>

  <p>Your content.</p>
</BaseLayout>
```

`title` and `description` drive the browser tab, social previews, and search results — always set both.

To put it in the top navigation, add an entry to `navigation` in [`src/config.ts`](../src/config.ts):

```ts
{ href: '/reading/', label: 'Reading' }
```

Keep the trailing slash. The site uses `trailingSlash: 'always'`, so `/reading` without it will not match.

Copy [`src/pages/intersections/books.astro`](../src/pages/intersections/books.astro) as a starting point — it's the simplest complete example. Reuse the existing classes (`page-header`, `eyebrow`, `writing-list`, `recommendation-list`, `thought-list`, `random-list`, `index-list`) so new pages inherit the site's look without writing CSS.

### Adding a page under Intersections

Folders nest routes: a file at `src/pages/intersections/music.astro` is published at `/intersections/music/`. Note the imports go up two levels (`../../layouts/BaseLayout.astro`), not one.

Then add one line to `intersectionSections` in [`src/config.ts`](../src/config.ts):

```ts
{ href: '/intersections/music/', label: 'Music', blurb: 'One line describing it.' }
```

That array is the single source of truth — it drives both the Intersections hub page and the homepage section, so they can't drift apart. Don't add sub-pages to the top `navigation` array; keeping them off it is the point of having a hub. Give the new page a breadcrumb eyebrow so a reader can get back up:

```astro
<p class="eyebrow"><a href={internalUrl('/intersections/')}>Intersections</a> / Music</p>
```

### An unlisted page, for your eyes only

Every page here is public today, but the plumbing for an unlisted one is still in place if you ever want it. Three things keep a page out of search results, and you need **all three**:

1. Pass `noindex` to `BaseLayout`: `<BaseLayout title="Scratch" description="..." noindex>`. That swaps the usual `index, follow` for a restrictive robots meta tag.
2. Add it to the sitemap filter in [`astro.config.mjs`](../astro.config.mjs) — a sitemap entry actively invites crawlers, so this one is easy to forget and important:
   ```js
   sitemap({ filter: (page) => !page.includes('/scratch/') })
   ```
3. Don't link to it. Not from `navigation`, not from any page. Links are how crawlers find things.

**Do not add it to `robots.txt`.** That seems like the obvious move and it backfires twice: `robots.txt` is public, so a `Disallow` line hands out the exact URL to anyone who looks; and a crawler that obeys the disallow never loads the page, so it never sees the `noindex` and can still list the bare URL. Silence works better.

**Understand what this is, though.** Unlisted is not private. This is a static site with no login, so the page is public HTML to anyone who knows or guesses the path — obscurity is the only barrier. Anything that genuinely needs protecting belongs behind a real login, on a separate host, not on a page here.

---

## 4. Avoiding version problems

This is the thing most likely to break after a long gap, so it gets specific treatment.

### The rules

1. **`npm ci`, not `npm install`, when you just want to build.** `npm ci` installs the exact versions in `package-lock.json`. `npm install` may quietly upgrade things. Use `npm install` only when you intend to change dependencies.
2. **Commit `package-lock.json` every time it changes.** It's the record of what actually worked. Without it, "it built fine last year" is unreproducible.
3. **Keep Node at 22 or newer.** `package.json` declares `>=22.12.0`; CI pins `node-version: 22`. Check with `node --version`.
4. **Never commit `node_modules/`.** Already in `.gitignore`. Leave it there.

### Returning after months away

```bash
node --version          # 22.12+? if not, install a current Node LTS
npm ci                  # exact known-good dependency tree
npm run build           # must pass before you touch anything
```

If that build passes, your environment is sound and any later failure is something you changed. **Do this before editing** — otherwise a pre-existing problem gets tangled up with your new work.

### Upgrading dependencies

Deliberately, never mid-post:

```bash
npm outdated            # what's behind
npm update              # safe patch/minor bumps
npm run build           # must still pass
```

Major versions (Astro 7 → 8) can break things. Read the release notes, do it on a branch, and let CI prove it. If a build fails after an upgrade, `git checkout package.json package-lock.json && npm ci` restores the last good state.

Security advisories: `npm audit --omit=dev` shows only what ships to visitors. Dev-only advisories rarely matter for a static site with no server and no user input.

### If a build fails and you can't see why

```bash
rm -rf node_modules .astro dist
npm ci
npm run build
```

Deleting the `.astro` cache resolves a surprising share of confusing errors.

### The long-term insurance

The published site is plain HTML, CSS, and images — **no framework runtime, no database, no server**. The only script is a dozen lines inline in each page for the theme toggle, and every page reads correctly with scripting off. Even if the Astro toolchain someday becomes unbuildable, `dist/` can be hosted anywhere as-is. Your posts are Markdown files: readable in any text editor, forever, with or without this codebase. That's the real durability guarantee, and it's worth not compromising.

---

## 5. What content types exist, and where each lives

Seven kinds. The important split: **one is a real content collection; the rest are lists in code.**

### Blog posts — the collection

- **Where:** [`src/content/writing/`](../src/content/writing/), one `.md`/`.mdx` file each
- **How:** section 1 above
- **You get:** its own page, listing entry, tag and category pages, reading time, RSS, sitemap, prev/next
- This is the one built to scale. Hundreds of posts is fine.

### Short thoughts — one-liners

- **Where:** the `thoughts` array at the top of [`src/pages/intersections/thoughts.astro`](../src/pages/intersections/thoughts.astro)
- **How:** add `['09 August 2026', 'The thought.'],` at the **top** of the list (newest first — it isn't sorted for you)
- Not in RSS, not individually linkable. Good for something too small for a post.

### Randoms — the catch-all

- **Where:** the `randoms` array in [`src/config.ts`](../src/config.ts), shown at [`src/pages/intersections/randoms.astro`](../src/pages/intersections/randoms.astro)
- **How:** add an entry at the top. Only `note` is required; `label` (a short uppercase tag like `Quote` or `Link`) and `url` are optional — supply `url` and the note becomes a link.
- For anything that isn't a post, a book, a film, or a one-line thought.

### Books, films, projects — curated lists

- **Where:** the `books`, `movies`, and `projects` arrays in [`src/config.ts`](../src/config.ts). The array is still named `movies` even though the page is titled Films and lives at `/intersections/films/` — renaming it would be churn for no gain.
- **How:** copy an existing entry and edit it. Match the fields exactly — `books` needs `title`/`author`/`note`; `movies` needs `title`/`director`/`year`/`note`; `projects` needs `name`/`description`/`url`/`year`/`status`.
- Displayed in array order. Reorder by moving lines.

### Static prose pages

- **Where:** [`src/pages/about.astro`](../src/pages/about.astro), [`now.astro`](../src/pages/now.astro), [`uses.astro`](../src/pages/uses.astro), and the [homepage](../src/pages/index.astro)
- **How:** edit the markup directly. `now.astro` is meant to be rewritten every few months.

### The Intersections blurb

- **Where:** `intersectionsIntro` in [`src/config.ts`](../src/config.ts)
- One string, used in three places: the hub page's opening paragraph, its search and social description, and the homepage section. Edit it once.

### Site identity

- **Where:** the `site` object in [`src/config.ts`](../src/config.ts) — name, description, canonical URL, author, GitHub link
- Feeds page titles, social previews, RSS, and the footer. One edit updates all of them.

> **All of these were reconciled on 13 August 2026** and now name the real domain and the real `audi2654` account. Three had drifted to a placeholder `adityapanchal` account that doesn't exist: `site.github` (the footer and About links, on every page), `site.url` (the local-build fallback for canonicals), and the first entry in the `projects` array (a dead link on the Projects page). The URL text drawn inside [`public/og.svg`](../public/og.svg) was stale too — see below.

**One easy thing to miss:** the social-preview image at [`public/og.svg`](../public/og.svg) has the site's address written into it as text. It's the picture that appears when a link to the site is shared, so if the domain changes it has to be edited by hand — nothing in the build will catch it. Open the file and change the `<text>` element near the bottom.

### Auto-generated — never edit by hand

`/writing/`, `/categories/<x>/`, `/tags/<x>/`, `/rss.xml`, `/sitemap-index.xml`, `/robots.txt` all derive from your posts. Add a post and they update themselves.

### Should it be a post or a list entry?

If it deserves its own URL, tags, or an RSS entry, it's a post. If it's one line in a collection you'd read top to bottom, it's a list entry. When torn, choose the post — it's easier to shorten later than to promote a list line into a page.

---

## 6. Maintaining this for decades

Written for the 20–30 year horizon you have in mind.

### What will outlast the tooling

Your Markdown files. Astro will be superseded; `.md` files with plain frontmatter will still open in any editor. **So keep the content boring and portable** — standard Markdown, minimal custom components. Every `.mdx` file with imported components is a file that needs this exact codebase to render. Prefer `.md` unless you specifically need a component; that's the single highest-leverage habit here.

### Never break a URL

A published URL is a promise. Once someone links to `/writing/making-room/`, that path should work forever. Practically: don't rename post files, don't reorganize folders for tidiness, and prefer adding a new page over renaming an old one. If you must move something, leave a page at the old path linking to the new one.

This is also why the `internalUrl()` rule matters: if you ever move to a custom domain, correct links follow automatically.

One deliberate exception has already been made: `/thoughts/`, `/books/`, and `/movies/` were moved under `/intersections/` on 9 August 2026, days after launch, when nothing could plausibly have linked to them yet. That window is now closed — treat the current paths as fixed.

### Keep the dependency surface small

Four production dependencies today (Astro, MDX, RSS, sitemap). Every addition is something that can break, go unmaintained, or need migrating. The no-client-JavaScript design isn't only about speed — it's about having less that can rot. Adding a framework for one interactive widget is rarely worth the decades of maintenance it implies.

### Write things down for your future self

You will forget how this works — that's the normal case, not a failure. Two habits cover it:

- Explain *why* in commit messages, not just what. `git log` becomes the project's memory.
- When you solve something confusing, add a line to this file. It's cheaper than re-deriving it in 2031.

### Back it up beyond GitHub

GitHub is not forever. Once a year, keep a copy of the repository somewhere you control — a full `git clone --mirror`, or just the `src/content/` folder. The posts are the irreplaceable part; everything else can be rebuilt.

### Own your address

Done, on 13 August 2026: the site is at `https://adityapanchal.is-a.dev/`, set by `SITE_URL` and `BASE_PATH` in [the deploy workflow](../.github/workflows/deploy.yml). GitHub redirects the old `audi2654.github.io/adityapanchal/` path here, so nothing that was linked is lost.

One caveat worth knowing: `is-a.dev` is a free subdomain granted by a community registry, not a domain you own. It costs nothing and behaves like a real address, but you can't sell it, transfer it, or outlast the project that hands it out. For the 20–30 year horizon, a domain you actually pay for is the durable version. Moving again is cheap — change the two values in the workflow — but every move strands inbound links, so the fewer moves the better.

### Prefer a boring cadence

The site is designed so publishing is: write a Markdown file, push. No CMS, no build ritual, nothing to log into. Protect that. Every convenience that adds a step is a reason not to write, and the main risk over 30 years isn't technical failure — it's friction quietly making you stop.

### A yearly check-up

Once a year, in fifteen minutes:

```bash
node --version
npm ci && npm run build      # still builds?
npm outdated                 # anything badly behind?
npm audit --omit=dev         # production advisories?
```

Then click through the live site on a phone. Small drift caught yearly never becomes a rewrite.
