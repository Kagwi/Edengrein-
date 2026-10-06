import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { navItems, site } from '@/data/site';
import { useQuote } from '@/components/QuickQuote/QuoteContext';

export function Brand({ compact = false }: { compact?: boolean }) {
  return <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`brand ${compact ? 'brand-compact' : ''}`} aria-label={site.name}><img src="/images/Edengrein_Logo.jpeg" alt="Edengrein Timber Supplies and Scaffolding logo" onError={(event) => { event.currentTarget.style.display = 'none'; }} /><span><strong>Edengrein</strong><small>Timber Supplies & Scaffolding</small></span></Link>;
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { openQuote } = useQuote();
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 20); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll); }, []);
  useEffect(() => setOpen(false), [location.pathname]);
  return <header className={`site-header ${scrolled || location.pathname !== '/' ? 'is-scrolled' : ''}`}><div className="container nav-wrap"><Brand compact /><nav className="desktop-nav" aria-label="Main navigation">{navItems.map((item) => <Link key={item.href} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={location.pathname === item.href ? 'active' : ''} to={item.href}>{item.label}</Link>)}</nav><button className="button button-small nav-cta" onClick={openQuote}>Get a Quote <ArrowUpRight size={15} /></button><button className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div><AnimatePresence>{open && <motion.nav className="mobile-nav" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} aria-label="Mobile navigation">{navItems.map((item) => <Link key={item.href} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={location.pathname === item.href ? 'active' : ''} to={item.href}>{item.label}</Link>)}<button className="button" onClick={() => { setOpen(false); openQuote(); }}>Get a Quote <ArrowUpRight size={16} /></button></motion.nav>}</AnimatePresence></header>;
}
