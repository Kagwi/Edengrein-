export type QuoteCategory = {
  id: string;
  label: string;
  icon: string;
};

export type QuoteData = {
  categories: string[];
  products: string[];
  quantity: string;
  dimensions: string;
  additionalRequirements: string;
  notes: string;
  hireDuration: string;
  deliveryMethod: 'delivery' | 'collection' | '';
  deliveryLocation: string;
  deliveryNotes: string;
  name: string;
  phone: string;
  email: string;
};

export const initialQuoteData: QuoteData = {
  categories: [],
  products: [],
  quantity: '',
  dimensions: '',
  additionalRequirements: '',
  notes: '',
  hireDuration: '',
  deliveryMethod: '',
  deliveryLocation: '',
  deliveryNotes: '',
  name: '',
  phone: '',
  email: '',
};

export const quoteCategories: QuoteCategory[] = [
  { id: 'timber', label: 'Timber', icon: 'TreePine' },
  { id: 'scaffolding', label: 'Scaffolding', icon: 'HardHat' },
  { id: 'construction-props', label: 'Construction Props', icon: 'Columns3' },
  { id: 'marine-boards', label: 'Marine Boards', icon: 'Layers' },
  { id: 'doors', label: 'Doors', icon: 'DoorOpen' },
  { id: 'door-frames', label: 'Door Frames', icon: 'Frame' },
  { id: 'other', label: 'Other Construction Materials', icon: 'Package' },
];
