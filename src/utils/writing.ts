import { getCollection, type CollectionEntry } from 'astro:content';

export type WritingEntry = CollectionEntry<'writing'>;

export async function getPublishedWriting(): Promise<WritingEntry[]> {
  const entries = await getCollection('writing', ({ data }) => !data.draft);
  return entries.sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf());
}

export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getTaxonomy(entries: WritingEntry[], key: 'tags' | 'category'): string[] {
  const values = entries.flatMap((entry) => key === 'tags' ? entry.data.tags : [entry.data.category]);
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function getAdjacentWriting(entries: WritingEntry[], currentId: string) {
  const index = entries.findIndex((entry) => entry.id === currentId);
  return {
    newer: index > 0 ? entries[index - 1] : undefined,
    older: index >= 0 && index < entries.length - 1 ? entries[index + 1] : undefined
  };
}
