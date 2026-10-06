import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, MessageCircle, Mail, HardHat, Building2, Home, Wrench, Calendar, Edit3 } from 'lucide-react';
import { site } from '@/data/site';

type ScaffoldData = {
  requirement: string;
  projectType: string;
  hireDuration: string;
  projectSize: string;
  floors: string;
  height: string;
  siteNotes: string;
  additionalReqs: string;
  name: string;
  phone: string;
  email: string;
};

const initialData: ScaffoldData = {
  requirement: '', projectType: '', hireDuration: '', projectSize: '', floors: '', height: '', siteNotes: '', additionalReqs: '', name: '', phone: '', email: '',
};

const TOTAL_STEPS = 5;
const stepLabels = ['Requirement', 'Project', 'Duration', 'Details', 'Contact'];

const requirements = [
  { id: 'Scaffolding Set', desc: 'Complete scaffolding sets for hire' },
  { id: 'Scaffolding Platform', desc: 'Platforms for elevated work' },
  { id: 'Scaffolding Setup and Support', desc: 'Setup support for your site' },
  { id: 'Scaffolding Maintenance and Repairs', desc: 'Keep scaffolding dependable' },
];

const projectTypes = [
  { id: 'Residential Construction', icon: Home },
  { id: 'Commercial Construction', icon: Building2 },
  { id: 'Renovation', icon: Wrench },
  { id: 'Other', icon: HardHat },
];

const durations = ['1–7 days', '1–4 weeks', '1–3 months', 'More than 3 months', 'Not sure'];

const PHONE_REGEX = /^0[0-9]{9}$/;

function buildScaffoldMessage(d: ScaffoldData): string {
  const lines = [
    'Hello Edengrein Timber Supplies and Scaffolding,',
    '',
    'I would like to request a scaffolding quote.',
    '',
    'Scaffolding Requirement:', d.requirement, '',
    'Project Type:', d.projectType, '',
    'Hire Duration:', d.hireDuration, '',
  ];
  if (d.projectSize) lines.push('Estimated Project Size:', d.projectSize, '');
  if (d.floors) lines.push('Number of Floors:', d.floors, '');
  if (d.height) lines.push('Approximate Construction Height:', d.height, '');
  if (d.siteNotes) lines.push('Site Notes:', d.siteNotes, '');
  if (d.additionalReqs) lines.push('Additional Requirements:', d.additionalReqs, '');
  lines.push('Name:', d.name, '');
  lines.push('Phone:', d.phone, '');
  if (d.email) lines.push('Email:', d.email, '');
  lines.push('', 'Please share availability and pricing.');
  return lines.join('\n');
}

export function ScaffoldingHireWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ScaffoldData>(initialData);
  const [submitted, setSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const update = (field: keyof ScaffoldData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (field === 'phone') setPhoneError(null);
  };

  const canProceed = useMemo(() => {
    if (step === 0) return data.requirement !== '';
    if (step === 1) return data.projectType !== '';
    if (step === 2) return data.hireDuration !== '';
    if (step === 4) return data.name.trim() !== '' && data.phone.trim() !== '' && PHONE_REGEX.test(data.phone);
    return true;
  }, [step, data]);

  const handleNext = () => {
    if (step === 4) {
      if (!PHONE_REGEX.test(data.phone)) { setPhoneError('Phone must be exactly 10 digits starting with 0 (e.g. 0712345678)'); return; }
    }
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
  };

  const handleBack = () => { if (step > 0) setStep(step - 1); };
  const handleEdit = () => { setStep(0); setSubmitted(false); };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/254748029223?text=${encodeURIComponent(buildScaffoldMessage(data))}`, '_blank');
    setSubmitted(true);
  };

  const handleEmail = () => {
    const body = buildScaffoldMessage(data);
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent('Scaffolding Hire Enquiry - Edengrein')}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <div className="sh-wizard">
      <div className="sh-wizard-inner">
        <div className="sh-header">
          <div className="sh-header-icon"><HardHat size={28} /></div>
          <div>
            <span className="eyebrow">Interactive Enquiry</span>
            <h2>Scaffolding Hire Assistant</h2>
          </div>
        </div>

        <div className="sh-progress">
          {stepLabels.map((label, i) => (
            <div key={label} className={`sh-progress-item ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <span className="sh-progress-dot">{i < step ? <Check size={11} /> : i + 1}</span>
              <span className="sh-progress-label">{label}</span>
            </div>
          ))}
        </div>

        <div className="sh-body">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="success" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="sh-success">
                <div className="sh-success-icon"><Check size={36} /></div>
                <h3>Enquiry ready to send</h3>
                <p>Your scaffolding enquiry has been prepared. Choose how you'd like to send it.</p>
                <div className="sh-success-actions">
                  <button className="button sh-wa-btn" onClick={handleWhatsApp}><MessageCircle size={18} /> Send via WhatsApp</button>
                  <button className="button button-outline-dark sh-email-btn" onClick={handleEmail}><Mail size={18} /> Send via Email</button>
                </div>
                <p className="sh-note">If your email client didn't open, use WhatsApp instead.</p>
                <button className="sh-edit-link" onClick={handleEdit}><Edit3 size={14} /> Edit Details</button>
              </motion.div>
            ) : (
              <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
                {step === 0 && (
                  <div className="sh-step">
                    <h3>What do you need?</h3>
                    <div className="sh-card-grid">
                      {requirements.map((req) => (
                        <button key={req.id} className={`sh-select-card ${data.requirement === req.id ? 'selected' : ''}`} onClick={() => update('requirement', req.id)}>
                          <strong>{req.id}</strong>
                          <span>{req.desc}</span>
                          {data.requirement === req.id && <Check size={16} className="sh-card-check" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="sh-step">
                    <h3>Project type</h3>
                    <p className="sh-step-desc">This describes your project context only.</p>
                    <div className="sh-card-grid sh-card-grid-4">
                      {projectTypes.map((pt) => {
                        const Icon = pt.icon;
                        return (
                          <button key={pt.id} className={`sh-select-card sh-select-icon-card ${data.projectType === pt.id ? 'selected' : ''}`} onClick={() => update('projectType', pt.id)}>
                            <Icon size={26} />
                            <span>{pt.id}</span>
                            {data.projectType === pt.id && <Check size={16} className="sh-card-check" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="sh-step">
                    <h3>Hire period</h3>
                    <p className="sh-step-desc">Estimated hire duration — no pricing is assigned.</p>
                    <div className="sh-duration-list">
                      {durations.map((dur) => (
                        <button key={dur} className={`sh-duration-item ${data.hireDuration === dur ? 'selected' : ''}`} onClick={() => update('hireDuration', dur)}>
                          <Calendar size={18} />
                          <span>{dur}</span>
                          {data.hireDuration === dur && <Check size={16} className="sh-duration-check" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="sh-step">
                    <h3>Project details</h3>
                    <p className="sh-step-desc">These are enquiry details, not an engineering calculation.</p>
                    <div className="sh-fields">
                      <label className="sh-field"><span>Estimated project size (optional)</span><input value={data.projectSize} onChange={(e) => update('projectSize', e.target.value)} placeholder="e.g. 3-bedroom house" /></label>
                      <label className="sh-field"><span>Number of floors (optional)</span><input value={data.floors} onChange={(e) => update('floors', e.target.value)} placeholder="e.g. 2" /></label>
                      <label className="sh-field"><span>Approximate construction height (optional)</span><input value={data.height} onChange={(e) => update('height', e.target.value)} placeholder="e.g. 8 metres" /></label>
                      <label className="sh-field"><span>Site notes (optional)</span><textarea rows={2} value={data.siteNotes} onChange={(e) => update('siteNotes', e.target.value)} placeholder="Access, terrain, any constraints" /></label>
                      <label className="sh-field"><span>Additional requirements (optional)</span><input value={data.additionalReqs} onChange={(e) => update('additionalReqs', e.target.value)} placeholder="Anything else we should know" /></label>
                    </div>
                    <p className="sh-disclaimer">No structural advice or safety guarantees are provided. Edengrein will confirm suitability upon enquiry.</p>
                  </div>
                )}

                {step === 4 && (
                  <div className="sh-step">
                    <h3>Contact details</h3>
                    <div className="sh-fields">
                      <label className="sh-field"><span>Name</span><input value={data.name} onChange={(e) => update('name', e.target.value)} placeholder="Your name" /></label>
                      <label className="sh-field"><span>Phone</span>
                        <input value={data.phone} onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} type="tel" inputMode="numeric" maxLength={10} placeholder="07XXXXXXXX" />
                        {phoneError && <span className="sh-error">{phoneError}</span>}
                      </label>
                      <label className="sh-field"><span>Email (optional)</span><input value={data.email} onChange={(e) => update('email', e.target.value)} type="email" placeholder="you@example.com" /></label>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!submitted && (
          <div className="sh-footer">
            <button className="sh-nav-btn sh-back" onClick={handleBack} disabled={step === 0}><ArrowLeft size={16} /> Back</button>
            <span className="sh-step-count">Step {step + 1} of {TOTAL_STEPS}</span>
            {step < TOTAL_STEPS - 1 ? (
              <button className="sh-nav-btn sh-next" onClick={handleNext} disabled={!canProceed}>Continue <ArrowRight size={16} /></button>
            ) : (
              <button className="sh-nav-btn sh-next sh-submit" onClick={handleWhatsApp} disabled={!canProceed}>Request Scaffolding Quote <ArrowRight size={16} /></button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
