const wordsPerMinute = 225;

export function getReadingTime(source: string | undefined): number {
  if (!source) return 1;

  const plainText = source
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[>#*_~\[\]()]/g, ' ');
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
