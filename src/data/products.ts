export type Product = { name: string; slug: string; image: string; description: string; category: string };

export const products: Product[] = [
  { name: 'Timber / Mukima', slug: 'timber-mukima', image: '/images/Timber.png', description: 'Quality construction timber for dependable building work.', category: 'Timber' },
  { name: 'Bluegum', slug: 'bluegum', image: '/images/Bluegum.png', description: 'Strong bluegum timber for construction-related use.', category: 'Timber' },
  { name: 'Cypress', slug: 'cypress', image: '/images/Cypress.png', description: 'Reliable cypress timber for a range of building needs.', category: 'Timber' },
  { name: 'Construction Props', slug: 'construction-props', image: '/images/construction-props.png', description: 'Practical support props for construction projects.', category: 'Construction Support' },
  { name: 'Fencing Posts', slug: 'fencing-posts', image: '/images/Fencing-post.png', description: 'Timber posts for fencing and construction applications.', category: 'Construction Materials' },
  { name: 'Scaffolding Sets', slug: 'scaffolding-sets', image: '/images/scaffolding_set.png', description: 'Scaffolding sets available for reliable project support.', category: 'Scaffolding' },
  { name: 'Scaffolding Platforms', slug: 'scaffolding-platforms', image: '/images/scaffolding-platform.png', description: 'Practical platforms for elevated construction work.', category: 'Scaffolding' },
  { name: 'Marine Boards', slug: 'marine-boards', image: '/images/Marine-boards.png', description: 'Durable marine boards for construction applications.', category: 'Construction Materials' },
  { name: 'Doors', slug: 'doors', image: '/images/Doors.png', description: 'Doors for construction and finishing requirements.', category: 'Finishing Materials' },
  { name: 'Door Frames', slug: 'door-frames', image: '/images/Door-frames.png', description: 'Door frames to support your finishing work.', category: 'Finishing Materials' },
  { name: 'Other Construction Materials', slug: 'other-construction-materials', image: '/images/construction-props.png', description: 'Ask us about the construction materials your project needs.', category: 'Construction Materials' }
];
