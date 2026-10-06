import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

export function Reveal({ children, delay = 0, className = '', direction = 'up' }: { children: ReactNode; delay?: number; className?: string; direction?: 'up' | 'left' | 'right' }) {
  const offset = direction === 'left' ? { x: -34 } : direction === 'right' ? { x: 34 } : { y: 24 };
  const visible = direction === 'left' ? { x: 0 } : direction === 'right' ? { x: 0 } : { y: 0 };
  const variants: Variants = { hidden: { opacity: 0, ...offset }, visible: { opacity: 1, ...visible, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } };
  return <motion.div className={className} variants={variants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} transition={{ delay }}>{children}</motion.div>;
}
