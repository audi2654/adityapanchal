const dateFormatter = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC'
});

export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
