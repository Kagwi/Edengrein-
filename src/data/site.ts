export const site = {
  name: 'Edengrein Timber Supplies and Scaffolding',
  shortName: 'Edengrein',
  tagline: 'Strong Materials. Reliable Scaffolding. Quality You Can Trust.',
  description: 'Quality timber, construction materials and dependable scaffolding solutions for builders, contractors, hardware businesses and individual customers across Kenya.',
  about: 'Edengrein Timber Supplies and Scaffolding is a construction supplies business dedicated to providing quality timber and reliable scaffolding solutions for construction projects. We supply timber and construction materials to contractors, builders, hardware businesses and individual customers. Our scaffolding is available for hire, while our timber and props are available for sale. We are committed to quality, affordability, reliability and professional service.',
  mission: 'To provide quality timber, construction materials and reliable scaffolding solutions while offering excellent customer service, fair pricing and dependable delivery to our customers.',
  vision: 'To become a trusted and leading supplier of timber and construction solutions in Kenya, known for quality products, reliability and excellent customer service.',
  phones: [{ label: '0111 515 648', href: 'tel:0111515648' }, { label: '0114 252 675', href: 'tel:0114252675' }],
  whatsapp: '0748029223',
  email: 'edengreintimbersupplies@gmail.com',
  location: { name: 'Edengrein Timber Supplies and Scaffolding', address: 'VW8X+86F EDENGREIN TIMBER SUPPLIES, Ruiru', googleMapsUrl: 'https://maps.app.goo.gl/sF7wv7pD4YfuiFCz5?g_st=aw' },
  socials: { facebook: 'https://www.facebook.com/profile.php?id=61595026438691', instagram: 'https://www.instagram.com/edengreintimbersupplies/', tiktok: 'https://www.tiktok.com/@edengreintimbersupplies' },
  credit: 'https://www.neonsolcreatives.co.ke'
};

export const navItems = [{ label: 'Home', href: '/' }, { label: 'About Us', href: '/about' }, { label: 'Products', href: '/products' }, { label: 'Services', href: '/services' }, { label: 'Contact', href: '/contact' }];

export const createWhatsAppLink = (message: string) => `https://wa.me/254748029223?text=${encodeURIComponent(message)}`;
export const generalWhatsApp = createWhatsAppLink('Hello Edengrein Timber Supplies and Scaffolding, I would like to enquire about your products and services. Please share more information.');
