import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../config';
import { getPublishedWriting } from '../utils/writing';
import { internalUrl } from '../utils/url';

export async function GET(context: APIContext) {
  const entries = await getPublishedWriting();
  const baseUrl = context.site ?? new URL(site.url);

  return rss({
    title: `${site.name} — Writing`,
    description: site.description,
    site: baseUrl,
    trailingSlash: true,
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.published,
      link: internalUrl(`/writing/${entry.id}/`),
      categories: [entry.data.category, ...entry.data.tags]
    }))
  });
}
