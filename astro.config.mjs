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
      Unlisted pages must never reach the sitemap — submitting a URL is an
      invitation to crawl it. Keep this list in step with any page that sets
      `noindex` on BaseLayout.
    */
    sitemap({ filter: (page) => !page.includes('/homelab/') })
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
