import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

type QuoteContextValue = {
  isOpen: boolean;
  openQuote: () => void;
  closeQuote: () => void;
};

const QuoteContext = createContext<QuoteContextValue | null>(null);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openQuote = useCallback(() => setIsOpen(true), []);
  const closeQuote = useCallback(() => setIsOpen(false), []);
  return <QuoteContext.Provider value={{ isOpen, openQuote, closeQuote }}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error('useQuote must be used within QuoteProvider');
  return ctx;
}
