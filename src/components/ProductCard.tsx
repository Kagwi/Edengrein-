import { ArrowUpRight, ImageOff } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '@/data/products';
import { productWhatsAppLink } from '@/utils/whatsapp';

export function ProductCard({ product }: { product: Product }) { return <motion.article id={`product-${product.slug}`} className="product-card" whileHover={{ y: -6 }}><div className="product-image"><img src={product.image} alt={`${product.name} supplied by Edengrein`} onError={(event) => { event.currentTarget.style.display = 'none'; event.currentTarget.parentElement?.classList.add('image-missing'); }} /><ImageOff className="missing-icon" size={26} /><span>{product.category}</span></div><div className="product-body"><h3>{product.name}</h3><p>{product.description}</p><a href={productWhatsAppLink(product.name)} target="_blank" rel="noreferrer" className="text-link">Enquire on WhatsApp <ArrowUpRight size={16} /></a></div></motion.article>; }
