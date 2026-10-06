import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import type { Product } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';

const categoryFilters = [
  { id: 'all', label: 'All' },
  { id: 'Timber', label: 'Timber' },
  { id: 'Scaffolding', label: 'Scaffolding' },
  { id: 'Construction Support', label: 'Construction Props' },
  { id: 'Construction Materials', label: 'Boards' },
  { id: 'Finishing Materials', label: 'Doors' },
  { id: 'other', label: 'Other Materials' },
];

export function ProductFilters({ products }: { products: Product[] }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((p) => {
      const catMatch = category === 'all' ? true :
        category === 'other' ? !['Timber', 'Scaffolding', 'Construction Support', 'Construction Materials', 'Finishing Materials'].includes(p.category) :
        p.category === category;
      if (!catMatch) return false;
      if (!term) return true;
      return p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term) || p.category.toLowerCase().includes(term);
    });
  }, [products, search, category]);

  const hasFilters = search.trim() !== '' || category !== 'all';
  const clearFilters = useCallback(() => { setSearch(''); setCategory('all'); }, []);

  return (
    <>
      <div className="pf-controls">
        <div className="pf-search-wrap">
          <Search size={16} className="pf-search-icon" />
          <input className="pf-search" type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…" aria-label="Search products" />
          {search && <button className="pf-clear-input" onClick={() => setSearch('')} aria-label="Clear search"><X size={15} /></button>}
        </div>
        <div className="pf-categories">
          {categoryFilters.map((cat) => (
            <button key={cat.id} className={`pf-chip ${category === cat.id ? 'active' : ''}`} onClick={() => setCategory(cat.id)}>{cat.label}</button>
          ))}
        </div>
        {hasFilters && <button className="pf-clear" onClick={clearFilters}>Clear Filters</button>}
      </div>

      <div className="pf-count">Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}</div>

      {filtered.length > 0 ? (
        <motion.div className="product-grid" layout>
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <motion.div key={product.slug} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25 }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="pf-empty">
          <p>No products match your search.</p>
          <button className="pf-clear pf-clear-large" onClick={clearFilters}>Clear Filters</button>
        </div>
      )}
    </>
  );
}
