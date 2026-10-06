import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, X, Mail, MessageCircle, Edit3, TreePine, HardHat, Columns3, Layers, DoorOpen, Frame, Package, Search } from 'lucide-react';
import { products } from '@/data/products';
import { services } from '@/data/services';
import { site } from '@/data/site';
import { quoteCategories, initialQuoteData, type QuoteData } from './quoteTypes';
import { validatePhone, sanitizePhone, buildQuoteWhatsAppLink, buildQuoteEmailLink } from './quoteUtils';
import { useQuote } from './QuoteContext';

const iconMap: Record<string, typeof TreePine> = {
  TreePine, HardHat, Columns3, Layers, DoorOpen, Frame, Package,
};

const TOTAL_STEPS = 6;
const stepLabels = ['Category', 'Product', 'Requirements', 'Delivery', 'Contact', 'Review'];

export function QuickQuoteModal() {
  const { isOpen, closeQuote } = useQuote();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<QuoteData>(initialQuoteData);
  const [submitted, setSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setData(initialQuoteData);
      setSubmitted(false);
      setPhoneError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  const allItems = useMemo(() => {
    const productNames = products.map((p) => ({ name: p.name, category: p.category }));
    const serviceNames = services.map((s) => ({ name: s.name, category: 'Service' }));
    return [...productNames, ...serviceNames];
  }, []);

  const availableProducts = useMemo(() => {
    const selectedCategoryLabels = data.categories.map((id) => quoteCategories.find((c) => c.id === id)?.label).filter(Boolean) as string[];
    if (selectedCategoryLabels.length === 0) return allItems;
    const matches = allItems.filter((item) => {
      return selectedCategoryLabels.some((cat) => {
        if (cat === 'Timber') return item.category === 'Timber';
        if (cat === 'Scaffolding') return item.category === 'Scaffolding' || item.name.toLowerCase().includes('scaffolding');
        if (cat === 'Construction Props') return item.name.toLowerCase().includes('prop') || item.category === 'Construction Support';
        if (cat === 'Marine Boards') return item.name.toLowerCase().includes('marine') || item.name.toLowerCase().includes('board');
        if (cat === 'Doors') return item.name.toLowerCase().includes('door') && !item.name.toLowerCase().includes('frame');
        if (cat === 'Door Frames') return item.name.toLowerCase().includes('door frame');
        if (cat === 'Other Construction Materials') return item.name.toLowerCase().includes('other') || item.category === 'Construction Materials' || item.category === 'Finishing Materials';
        return false;
      });
    });
    return matches.length > 0 ? matches : allItems;
  }, [data.categories, allItems]);

  const hasScaffolding = data.categories.includes('scaffolding') || data.products.some((p) => p.toLowerCase().includes('scaffold'));

  const update = (field: keyof QuoteData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (field === 'phone') setPhoneError(null);
  };

  const toggleCategory = (id: string) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.includes(id) ? prev.categories.filter((c) => c !== id) : [...prev.categories, id],
    }));
  };

  const toggleProduct = (name: string) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.includes(name) ? prev.products.filter((p) => p !== name) : [...prev.products, name],
    }));
  };

  const canProceed = () => {
    if (step === 0) return data.categories.length > 0;
    if (step === 1) return data.products.length > 0;
    if (step === 4) return data.name.trim() !== '' && data.phone.trim() !== '' && data.email.trim() !== '' && !validatePhone(data.phone);
    return true;
  };

  const handleNext = () => {
    if (step === 4) {
      const err = validatePhone(data.phone);
      if (err) { setPhoneError(err); return; }
    }
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
  };

  const handleBack = () => { if (step > 0) setStep(step - 1); };

  const handleEdit = () => { setStep(0); setSubmitted(false); };

  const handleSendWhatsApp = () => {
    window.open(buildQuoteWhatsAppLink(data), '_blank');
    setSubmitted(true);
  };

  const handleSendEmail = () => {
    window.location.href = buildQuoteEmailLink(data, site.email);
    setSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="qq-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeQuote}>
          <motion.div className="qq-modal" initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} onClick={(e) => e.stopPropagation()}>
            <div className="qq-header">
              <div>
                <span className="eyebrow" style={{ marginBottom: 6 }}>Edengrein</span>
                <h2>Quick Quote</h2>
              </div>
              <button className="qq-close" onClick={closeQuote} aria-label="Close"><X size={20} /></button>
            </div>

            <div className="qq-progress">
              {stepLabels.map((label, i) => (
                <div key={label} className={`qq-progress-item ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
                  <span className="qq-progress-dot">{i < step ? <Check size={11} /> : i + 1}</span>
                  <span className="qq-progress-label">{label}</span>
                </div>
              ))}
            </div>

            <div className="qq-body">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="success" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="qq-success">
                    <div className="qq-success-icon"><Check size={36} /></div>
                    <h3>Quote request ready</h3>
                    <p>Your quote request has been prepared. Choose how you'd like to send it to Edengrein below.</p>
                    <div className="qq-success-actions">
                      <button className="button qq-wa-btn" onClick={handleSendWhatsApp}><MessageCircle size={18} /> Send via WhatsApp</button>
                      <button className="button button-outline-dark qq-email-btn" onClick={handleSendEmail}><Mail size={18} /> Send via Email</button>
                    </div>
                    <p className="qq-note">If your email client didn't open, your email app may not be configured. You can use WhatsApp instead.</p>
                    <button className="qq-edit-link" onClick={handleEdit}><Edit3 size={14} /> Edit Details</button>
                  </motion.div>
                ) : (
                  <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
                    {step === 0 && (
                      <div className="qq-step">
                        <h3>What do you need?</h3>
                        <p className="qq-step-desc">Select one or more categories to get started.</p>
                        <div className="qq-cat-grid">
                          {quoteCategories.map((cat) => {
                            const Icon = iconMap[cat.icon] ?? Package;
                            const selected = data.categories.includes(cat.id);
                            return (
                              <button key={cat.id} className={`qq-cat-card ${selected ? 'selected' : ''}`} onClick={() => toggleCategory(cat.id)}>
                                <Icon size={22} />
                                <span>{cat.label}</span>
                                {selected && <Check size={15} className="qq-cat-check" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {step === 1 && (
                      <div className="qq-step">
                        <h3>Product / Service</h3>
                        <p className="qq-step-desc">Choose the products or services you're interested in.</p>
                        <div className="qq-prod-list">
                          {availableProducts.map((item) => {
                            const selected = data.products.includes(item.name);
                            return (
                              <button key={item.name} className={`qq-prod-item ${selected ? 'selected' : ''}`} onClick={() => toggleProduct(item.name)}>
                                <span className="qq-prod-name">{item.name}</span>
                                <span className="qq-prod-cat">{item.category}</span>
                                {selected && <Check size={15} className="qq-prod-check" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="qq-step">
                        <h3>Requirements</h3>
                        <div className="qq-fields">
                          <label className="qq-field"><span>Quantity</span><input value={data.quantity} onChange={(e) => update('quantity', e.target.value)} placeholder="e.g. 50 pieces" /></label>
                          <label className="qq-field"><span>Dimensions / Specifications (optional)</span><input value={data.dimensions} onChange={(e) => update('dimensions', e.target.value)} placeholder="e.g. 4x2, 12ft lengths" /></label>
                          <label className="qq-field"><span>Additional requirements (optional)</span><input value={data.additionalRequirements} onChange={(e) => update('additionalRequirements', e.target.value)} placeholder="e.g. Construction timber for a building project" /></label>
                          {hasScaffolding && (
                            <label className="qq-field"><span>Estimated hire duration (optional)</span>
                              <select value={data.hireDuration} onChange={(e) => update('hireDuration', e.target.value)}>
                                <option value="" disabled>Select duration</option>
                                <option>1–7 days</option><option>1–4 weeks</option><option>1–3 months</option><option>More than 3 months</option><option>Not sure</option>
                              </select>
                            </label>
                          )}
                          <label className="qq-field"><span>Notes (optional)</span><textarea rows={3} value={data.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Anything else we should know" /></label>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="qq-step">
                        <h3>Delivery / Collection</h3>
                        <p className="qq-step-desc">How would you like to receive your materials?</p>
                        <div className="qq-delivery-options">
                          <button className={`qq-delivery-card ${data.deliveryMethod === 'delivery' ? 'selected' : ''}`} onClick={() => update('deliveryMethod', 'delivery')}>
                            <span className="qq-delivery-label">Delivery</span>
                            <span className="qq-delivery-sub">We deliver to your site</span>
                          </button>
                          <button className={`qq-delivery-card ${data.deliveryMethod === 'collection' ? 'selected' : ''}`} onClick={() => update('deliveryMethod', 'collection')}>
                            <span className="qq-delivery-label">Collection</span>
                            <span className="qq-delivery-sub">You collect from Edengrein</span>
                          </button>
                        </div>
                        {data.deliveryMethod === 'delivery' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="qq-delivery-extra">
                            <label className="qq-field"><span>Delivery location / area</span><input value={data.deliveryLocation} onChange={(e) => update('deliveryLocation', e.target.value)} placeholder="e.g. Ruiru" /></label>
                            <label className="qq-field"><span>Additional delivery notes (optional)</span><input value={data.deliveryNotes} onChange={(e) => update('deliveryNotes', e.target.value)} placeholder="Any delivery instructions" /></label>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {step === 4 && (
                      <div className="qq-step">
                        <h3>Your Information</h3>
                        <div className="qq-fields">
                          <label className="qq-field"><span>Full Name</span><input value={data.name} onChange={(e) => update('name', e.target.value)} placeholder="Your name" /></label>
                          <label className="qq-field"><span>Phone Number</span>
                            <input value={data.phone} onChange={(e) => update('phone', sanitizePhone(e.target.value))} type="tel" inputMode="numeric" maxLength={10} placeholder="07XXXXXXXX" />
                            {phoneError && <span className="qq-error">{phoneError}</span>}
                          </label>
                          <label className="qq-field"><span>Email Address</span><input value={data.email} onChange={(e) => update('email', e.target.value)} type="email" placeholder="you@example.com" /></label>
                        </div>
                      </div>
                    )}

                    {step === 5 && (
                      <div className="qq-step">
                        <h3>Review</h3>
                        <div className="qq-review">
                          <ReviewRow label="Category" value={data.categories.map((id) => quoteCategories.find((c) => c.id === id)?.label).join(', ')} />
                          <ReviewRow label="Product / Service" value={data.products.join(', ')} />
                          <ReviewRow label="Quantity" value={data.quantity} />
                          <ReviewRow label="Dimensions / Specifications" value={data.dimensions} />
                          {hasScaffolding && <ReviewRow label="Hire Duration" value={data.hireDuration} />}
                          <ReviewRow label="Additional Requirements" value={data.additionalRequirements} />
                          <ReviewRow label="Delivery / Collection" value={data.deliveryMethod === 'delivery' ? 'Delivery' : data.deliveryMethod === 'collection' ? 'Collection' : ''} />
                          {data.deliveryMethod === 'delivery' && <ReviewRow label="Location" value={data.deliveryLocation} />}
                          {data.deliveryMethod === 'delivery' && <ReviewRow label="Delivery Notes" value={data.deliveryNotes} />}
                          <ReviewRow label="Name" value={data.name} />
                          <ReviewRow label="Phone" value={data.phone} />
                          <ReviewRow label="Email" value={data.email} />
                          <ReviewRow label="Notes" value={data.notes} />
                        </div>
                        <div className="qq-send-actions">
                          <button className="button qq-wa-btn" onClick={handleSendWhatsApp}><MessageCircle size={18} /> Send via WhatsApp</button>
                          <button className="button button-outline-dark qq-email-btn" onClick={handleSendEmail}><Mail size={18} /> Send via Email</button>
                        </div>
                        <button className="qq-edit-link" onClick={handleEdit}><Edit3 size={14} /> Edit Details</button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!submitted && (
              <div className="qq-footer">
                <button className="qq-nav-btn qq-back" onClick={handleBack} disabled={step === 0}><ArrowLeft size={16} /> Back</button>
                <span className="qq-step-count">Step {step + 1} of {TOTAL_STEPS}</span>
                {step < TOTAL_STEPS - 1 ? (
                  <button className="qq-nav-btn qq-next" onClick={handleNext} disabled={!canProceed()}>Continue <ArrowRight size={16} /></button>
                ) : (
                  <button className="qq-nav-btn qq-next" onClick={handleSendWhatsApp} disabled={!canProceed()}>Send Quote Request <ArrowUpRight size={16} /></button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="qq-review-row">
      <span className="qq-review-label">{label}</span>
      <span className="qq-review-value">{value}</span>
    </div>
  );
}
