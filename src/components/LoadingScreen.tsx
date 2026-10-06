import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MAX_WAIT = 4000;

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);
  const [lineDrawn, setLineDrawn] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const startTime = useRef(Date.now());
  const callbackFired = useRef(false);

  useEffect(() => {
    const lineTimer = window.setTimeout(() => setLineDrawn(true), 200);
    const textTimer = window.setTimeout(() => setTextVisible(true), 700);

    const finish = () => {
      if (callbackFired.current) return;
      callbackFired.current = true;
      setVisible(false);
      window.setTimeout(onComplete, 600);
    };

    const maxTimer = window.setTimeout(finish, MAX_WAIT);

    const checkReady = () => {
      if (document.readyState === 'complete') {
        const elapsed = Date.now() - startTime.current;
        const minWait = 1800;
        const remaining = Math.max(0, minWait - elapsed);
        window.setTimeout(finish, remaining);
      }
    };

    checkReady();
    window.addEventListener('load', checkReady);

    return () => {
      window.clearTimeout(lineTimer);
      window.clearTimeout(textTimer);
      window.clearTimeout(maxTimer);
      window.removeEventListener('load', checkReady);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <div className="loading-bg-lines" />
          <div className="loading-content">
            <motion.div
              className="loading-line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: lineDrawn ? 1 : 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              className="loading-particles"
              initial={{ opacity: 0 }}
              animate={{ opacity: lineDrawn ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.span
                  key={i}
                  className="loading-particle"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
                />
              ))}
            </motion.div>
            <motion.div
              className="loading-text"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 12 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <h1 className="loading-brand">EDENGREIN</h1>
              <span className="loading-sub">Timber Supplies & Scaffolding</span>
              <div className="loading-indicator">
                <span className="loading-indicator-bar" />
                <span className="loading-indicator-text">Preparing the experience…</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
