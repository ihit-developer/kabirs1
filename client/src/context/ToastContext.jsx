import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-[90vw] w-80">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-xl px-4 py-3 shadow-deep text-sm font-medium text-white flex items-center gap-2 animate-[fadeIn_.25s_ease] ${
              t.type === 'error' ? 'bg-red' : t.type === 'info' ? 'bg-bg4 border border-white/10' : 'bg-emerald-600'
            }`}
          >
            <i className={`fa-solid ${t.type === 'error' ? 'fa-circle-exclamation' : t.type === 'info' ? 'fa-circle-info' : 'fa-circle-check'}`} />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
