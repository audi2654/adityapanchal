export const site = {
  name: 'Aditya Panchal',
  shortName: 'Aditya',
  description: 'Notes on making useful things, learning deliberately, and paying attention.',
  url: 'https://adityapanchal.github.io',
  locale: 'en_IN',
  language: 'en',
  author: 'Aditya Panchal',
  github: 'https://github.com/adityapanchal'
} as const;

export const navigation = [
  { href: '/writing/', label: 'Writing' },
  { href: '/projects/', label: 'Projects' },
  { href: '/now/', label: 'Now' },
  { href: '/about/', label: 'About' }
] as const;

export const projects = [
  {
    name: 'Personal website',
    description: 'The small, durable publishing system you are reading.',
    url: 'https://github.com/adityapanchal/adityapanchal',
    year: '2026',
    status: 'Ongoing'
  },
  {
    name: 'A better reading habit',
    description: 'A private set of notes on retaining more from the books worth keeping.',
    url: '/books/',
    year: '2026',
    status: 'Ongoing'
  }
] as const;

export const books = [
  {
    title: 'The Beginning of Infinity',
    author: 'David Deutsch',
    note: 'A generous argument that progress comes from better explanations.'
  },
  {
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    note: 'A reminder that confusion is often a design failure, not a user failure.'
  },
  {
    title: 'Working Backwards',
    author: 'Colin Bryar and Bill Carr',
    note: 'Useful for its emphasis on clear mechanisms rather than slogans.'
  }
] as const;

export const movies = [
  {
    title: 'Perfect Days',
    director: 'Wim Wenders',
    year: '2023',
    note: 'A film about attention, routine, and the richness of ordinary days.'
  },
  {
    title: 'The Lunchbox',
    director: 'Ritesh Batra',
    year: '2013',
    note: 'Tender and precise, with an unusually good eye for small gestures.'
  },
  {
    title: 'Columbus',
    director: 'Kogonada',
    year: '2017',
    note: 'A quiet study of place and the conversations that make change possible.'
  }
] as const;
