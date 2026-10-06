import { ArrowUpRight, ImageOff } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Service } from '@/data/services';
import { serviceWhatsAppLink } from '@/utils/whatsapp';

export function ServiceCard({ service }: { service: Service }) { return <motion.article id={`service-${service.slug}`} className="service-card" whileHover={{ y: -6 }}><div className="service-image"><img src={service.image} alt={`${service.name} from Edengrein`} onError={(event) => { event.currentTarget.style.display = 'none'; event.currentTarget.parentElement?.classList.add('image-missing'); }} /><ImageOff className="missing-icon" size={26} /></div><div className="service-body"><span className="service-number">0{service.slug.length % 8 + 1}</span><h3>{service.name}</h3><p>{service.description}</p><ul>{service.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul><a className="text-link" href={serviceWhatsAppLink(service.name)} target="_blank" rel="noreferrer">Enquire now <ArrowUpRight size={16} /></a></div></motion.article>; }
