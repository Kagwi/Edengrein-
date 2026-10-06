import type { QuoteData } from './quoteTypes';

const PHONE_REGEX = /^0[0-9]{9}$/;

export function validatePhone(phone: string): string | null {
  if (!phone) return 'Phone number is required';
  if (!PHONE_REGEX.test(phone)) return 'Phone must be exactly 10 digits starting with 0 (e.g. 0712345678)';
  return null;
}

export function sanitizePhone(value: string): string {
  return value.replace(/\D/g, '').slice(0, 10);
}

export function buildQuoteMessage(data: QuoteData): string {
  const lines: string[] = [
    'Hello Edengrein Timber Supplies and Scaffolding,',
    '',
    'I would like to request a quotation.',
    '',
  ];

  if (data.categories.length > 0) {
    lines.push('Category:');
    lines.push(data.categories.join(', '));
    lines.push('');
  }
  if (data.products.length > 0) {
    lines.push('Product:');
    lines.push(data.products.join(', '));
    lines.push('');
  }
  if (data.quantity) { lines.push(`Quantity:`); lines.push(data.quantity); lines.push(''); }
  if (data.dimensions) { lines.push(`Dimensions / Specifications:`); lines.push(data.dimensions); lines.push(''); }
  if (data.hireDuration) { lines.push(`Hire Duration:`); lines.push(data.hireDuration); lines.push(''); }
  if (data.additionalRequirements) { lines.push(`Additional Requirements:`); lines.push(data.additionalRequirements); lines.push(''); }
  if (data.deliveryMethod) {
    lines.push('Delivery:');
    lines.push(data.deliveryMethod === 'delivery' ? 'Delivery' : 'Collection');
    lines.push('');
  }
  if (data.deliveryLocation) { lines.push(`Location:`); lines.push(data.deliveryLocation); lines.push(''); }
  if (data.deliveryNotes) { lines.push(`Delivery Notes:`); lines.push(data.deliveryNotes); lines.push(''); }
  if (data.name) { lines.push(`Name:`); lines.push(data.name); lines.push(''); }
  if (data.phone) { lines.push(`Phone:`); lines.push(data.phone); lines.push(''); }
  if (data.email) { lines.push(`Email:`); lines.push(data.email); lines.push(''); }
  if (data.notes) { lines.push(`Notes:`); lines.push(data.notes); lines.push(''); }

  lines.push('Please share availability and pricing.');

  return lines.join('\n');
}

export function buildQuoteEmailSubject(): string {
  return 'Quote Request - Edengrein Timber Supplies and Scaffolding';
}

export function buildQuoteEmailLink(data: QuoteData, email: string): string {
  const subject = buildQuoteEmailSubject();
  const body = buildQuoteMessage(data);
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function buildQuoteWhatsAppLink(data: QuoteData): string {
  return `https://wa.me/254748029223?text=${encodeURIComponent(buildQuoteMessage(data))}`;
}
