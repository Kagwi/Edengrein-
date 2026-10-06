import { ArrowUpRight } from 'lucide-react';
import { Reveal } from './Reveal';

export function SectionHeading({ eyebrow, title, text, action }: { eyebrow: string; title: string; text?: string; action?: { label: string; href: string } }) { return <Reveal className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{text && <p>{text}</p>}{action && <a className="text-link" href={action.href}>{action.label} <ArrowUpRight size={17} /></a>}</Reveal>; }
