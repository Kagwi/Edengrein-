export const createWhatsAppLink = (message: string) => `https://wa.me/254748029223?text=${encodeURIComponent(message)}`;

export const productWhatsAppLink = (productName: string) => createWhatsAppLink(`Hello Edengrein Timber Supplies and Scaffolding, I would like to enquire about ${productName}. Please share availability and pricing.`);
export const serviceWhatsAppLink = (serviceName: string) => createWhatsAppLink(`Hello Edengrein Timber Supplies and Scaffolding, I would like to enquire about ${serviceName}. Please share availability and pricing.`);
