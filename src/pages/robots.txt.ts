import type { APIRoute } from 'astro';
import { site } from '../config';
import { internalUrl } from '../utils/url';

export const GET: APIRoute = ({ site: configuredSite }) => {
  const baseUrl = configuredSite ?? new URL(site.url);
  const sitemapUrl = new URL(internalUrl('/sitemap-index.xml'), baseUrl);

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
};
