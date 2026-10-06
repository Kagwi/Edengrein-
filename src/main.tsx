import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LoadingScreen } from '@/components/LoadingScreen';
import { QuoteProvider } from '@/components/QuickQuote/QuoteContext';

function Root() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) document.body.style.overflow = '';
  }, [loading]);

  return (
    <StrictMode>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <QuoteProvider>
        <App />
      </QuoteProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);
