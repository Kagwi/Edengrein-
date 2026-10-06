import { MessageCircle, PhoneCall } from 'lucide-react';
import { site } from '@/data/site';
import { createWhatsAppLink } from '@/utils/whatsapp';

const message = 'Hello Edengrein Timber Supplies and Scaffolding, I would like to enquire about your products and services. Please share more information.';

export function ContactFloat() {
  return <div className="contact-float" aria-label="Contact Edengrein"><a className="float-whatsapp" href={createWhatsAppLink(message)} target="_blank" rel="noreferrer" aria-label="Chat with Edengrein on WhatsApp"><MessageCircle size={21} /><span>WhatsApp</span></a><a className="float-call" href={site.phones[0].href} aria-label={`Call Edengrein at ${site.phones[0].label}`}><PhoneCall size={19} /><span>Call us</span></a></div>;
}
