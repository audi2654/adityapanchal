# Aditya Panchal

A quiet, static website for essays, notes, projects, and a few durable recommendations. It is built for reading first and deliberately avoids client-side JavaScript.

## Stack

- [Astro](https://astro.build/) with TypeScript and static output
- Markdown and MDX through Astro Content Collections
- Plain CSS with system dark mode plus a persisted light/dark toggle in the footer
- Shiki syntax highlighting (built into Astro)
- RSS and sitemap integrations
- GitHub Pages deployment through GitHub Actions

## Local development

Prerequisite: Node.js 22.12+.

```sh
npm install
npm run dev
```

Other useful commands:

```sh
npm run check
npm run build
npm run preview
```

## Content

Writing lives in `src/content/writing/`. Each Markdown or MDX file needs the frontmatter defined in `src/content.config.ts`:

```yaml
---
title: A clear, specific title
description: A short summary used in feeds and search results.
published: 2026-07-27
tags: [Writing]
category: Essays
draft: false
---
```

Nested folders become nested URLs, so `src/content/writing/notes/example.md` is published at `/writing/notes/example/`.

## Publishing to GitHub Pages

1. In the GitHub repository, open **Settings → Pages** and select **GitHub Actions** as the source. This step is required and cannot be done from the workflow; without it the `Configure GitHub Pages` step fails with `HttpError: Not Found — Get Pages site failed`.
2. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and publishes the static `dist/` folder.
3. The site is served from the custom domain `https://adityapanchal.is-a.dev`. The workflow's `Build site` step sets `SITE_URL` to that address and `BASE_PATH` to `/`, because a custom domain serves from the root rather than from a `/<repo>/` sub-path. **Both must change together** — a new domain with the old base path, or vice versa, produces a site whose links all point at the wrong place. The domain itself is configured in **Settings → Pages → Custom domain**.

Without those two variables the configuration falls back to deriving a project-site URL and `/<repo>/` base path from `GITHUB_REPOSITORY`, which is what the old `audi2654.github.io/adityapanchal/` address used. Locally, with neither set and no `GITHUB_REPOSITORY` present, it falls back to `https://adityapanchal.is-a.dev` for canonical links.

Note that the social-preview card at `public/og.svg` has the site's address drawn into it as text. It is copied verbatim, so a domain change means editing that file by hand — no build step will flag it.

## Structure

```text
src/
  components/    Reusable, semantic presentation components
  content/       Markdown and MDX source material
  layouts/       Shared document and article layouts
  pages/         Static and generated routes
    intersections/  Hub page plus Short thoughts, Books, Films, and Randoms
  styles/        Global typographic system
  utils/         Reading-time, date, taxonomy, and navigation helpers
public/          Static assets and crawl directives
.github/         GitHub Pages workflow
project-dets/    Customization guide and handoff notes (not published)
```

New to the codebase, or returning after a long gap? Start with [`project-dets/how-to-customize.md`](project-dets/how-to-customize.md).

## Design principles

The layout keeps a narrow reading measure, generous vertical rhythm, quiet navigation, and clear hierarchy. System fonts make it fast and native to the reader’s device. There are no animations, gradients, trackers, or web-font requests.

The single exception to the no-JavaScript rule is the theme toggle: two small inline scripts, no framework and no bundle. It is hidden entirely when JavaScript is unavailable, so it never appears as a dead control, and the theme then follows `prefers-color-scheme` as before.
