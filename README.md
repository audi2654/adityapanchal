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
3. For a custom domain, set `SITE_URL` in the repository Actions variables to its fully qualified HTTPS URL (for example, `https://example.com`). Add the domain through GitHub Pages settings as well.

The Astro configuration derives the correct project-site path automatically in GitHub Actions. Locally, it defaults to `https://adityapanchal.github.io` for canonical links; override it with `SITE_URL` if needed.

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
