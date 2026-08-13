export const site = {
  name: 'Aditya Panchal',
  shortName: 'Aditya',
  description: 'Notes on making useful things, learning deliberately, and paying attention.',
  url: 'https://adityapanchal.github.io',
  locale: 'en_IN',
  language: 'en',
  author: 'Aditya Panchal',
  github: 'https://github.com/audi2654'
} as const;

export const navigation = [
  { href: '/writing/', label: 'Writing' },
  { href: '/intersections/', label: 'Intersections' },
  { href: '/projects/', label: 'Projects' },
  { href: '/now/', label: 'Now' },
  { href: '/about/', label: 'About' }
] as const;

/*
  The description shown on the Intersections page and in its search/social
  metadata. Kept here so the homepage and the page itself cannot drift apart.
*/
export const intersectionsIntro =
  'Aditya dwells on the intersection of space, science, thinking, music, art, literature, cinema, religion, human — and a lot more, a bit of everything.';

/*
  The four sub-pages that live under /intersections/, listed on the hub page and
  on the homepage. Each `href` must match a file in src/pages/intersections/.
  Adding a page here is the only step needed to surface it in both places.
*/
export const intersectionSections = [
  { href: '/intersections/thoughts/', label: 'Short thoughts', blurb: 'Single lines, caught before they disappear.' },
  { href: '/intersections/books/', label: 'Books', blurb: 'The shelf worth rereading.' },
  { href: '/intersections/films/', label: 'Films', blurb: 'Films with an atmosphere that stayed.' },
  { href: '/intersections/randoms/', label: 'Randoms', blurb: 'Quotes, links, and stray observations.' }
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
    url: '/intersections/books/',
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

/*
  Randoms: the catch-all under Intersections. Anything that doesn't deserve a
  post and isn't a book, film, or one-line thought — a link, an image caption, a
  quote, an observation. `note` is required; `label` and `url` are optional.
  Newest first; the page does not sort for you.
*/
export const randoms: readonly { label?: string; note: string; url?: string }[] = [
  {
    label: 'Quote',
    note: '“The purpose of a system is what it does, not what it was built to do.”'
  },
  {
    label: 'Noticed',
    note: 'The best interfaces are the ones you stop noticing after the first minute.'
  },
  {
    label: 'Link',
    note: 'The now-page idea — a small antidote to the frozen personal homepage.',
    url: 'https://nownownow.com/about'
  }
];

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
