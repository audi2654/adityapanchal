import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

const repository = process.env.GITHUB_REPOSITORY;
const [owner, repositoryName] = repository?.split('/') ?? [];
const isUserSite = repositoryName === `${owner}.github.io`;
const githubPagesUrl = owner && repositoryName
  ? isUserSite
    ? `https://${owner}.github.io`
    : `https://${owner}.github.io/${repositoryName}`
  : undefined;

export default defineConfig({
  site: process.env.SITE_URL ?? githubPagesUrl ?? 'https://adityapanchal.github.io',
  base: process.env.BASE_PATH ?? (repositoryName && !isUserSite ? `/${repositoryName}` : '/'),
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    mdx(),
    /*
      No filter: every page is public. If a page ever sets `noindex` on
      BaseLayout, add a `filter` here to drop it too — a sitemap entry is an
      active request to crawl a URL, so listing one you asked not to be indexed
      works against itself.
    */
    sitemap()
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark-dimmed'
      },
      defaultColor: false,
      wrap: true
    }
  }
});
