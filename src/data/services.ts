export type Service = { name: string; slug: string; image: string; description: string; benefits: string[] };

export const services: Service[] = [
  { name: 'Scaffolding Hire', slug: 'scaffolding-hire', image: '/images/scaffolding_set.png', description: 'Reliable scaffolding solutions available for hire to support your construction work.', benefits: ['Scaffolding sets', 'Platforms', 'Project support'] },
  { name: 'Scaffolding Setup and Support', slug: 'scaffolding-setup-support', image: '/images/scaffolding-platform.png', description: 'Practical setup and support for dependable scaffolding use on site.', benefits: ['Setup support', 'Construction guidance', 'Reliable structures'] },
  { name: 'Timber Supply', slug: 'timber-supply', image: '/images/Timber.png', description: 'Quality timber supply including Mukima, Bluegum and Cypress.', benefits: ['Multiple timber types', 'Quality materials', 'Fair pricing'] },
  { name: 'Construction Props Supply', slug: 'construction-props-supply', image: '/images/construction-props.png', description: 'Construction props available for projects that need dependable support materials.', benefits: ['Practical support', 'Construction-ready', 'Direct enquiry'] },
  { name: 'Construction Material Supply', slug: 'construction-material-supply', image: '/images/Marine-boards.png', description: 'A range of construction materials for builders, contractors and individual customers.', benefits: ['Marine boards', 'Doors and frames', 'Fencing posts'] },
  { name: 'Delivery of Construction Materials', slug: 'material-delivery', image: '/images/Timber.png', description: 'Dependable delivery support to help customers get materials where they need them.', benefits: ['Delivery support', 'Project convenience', 'Easy coordination'] },
  { name: 'Scaffolding Maintenance and Repairs', slug: 'scaffolding-maintenance-repairs', image: '/images/scaffolding_set.png', description: 'Maintenance and repair support to help keep scaffolding dependable.', benefits: ['Maintenance support', 'Repairs', 'Practical service'] }
];
