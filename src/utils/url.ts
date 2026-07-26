/** Creates an internal link that works at the domain root and on GitHub Pages project sites. */
export function internalUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}
