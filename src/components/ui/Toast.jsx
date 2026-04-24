import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const icons = {
  success: <CheckCircle size={18} className="text-green-400" />,
  error: <XCircle size={18} className="text-[#FF375F]" />,
  info: <Info size={18} className="text-blue-400" />,
};

const borderColors = {
  success: 'border-green-500/30',
  error: 'border-[#FF375F]/30',
  info: 'border-blue-500/30',
};

function Toast({ id, message, type = 'info', onRemove }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl glass-card border ${borderColors[type]} shadow-[0_8px_32px_rgba(0,0,0,0.5)] min-w-[280px] max-w-sm`}
    >
      <span className="text-lg">🎂</span>
      {icons[type]}
      <p className="text-sm text-white flex-1">{message}</p>
      <button onClick={() => onRemove(id)} className="text-white/30 hover:text-white/70 transition-colors">
        <X size={14} />
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 sm:top-4 sm:right-4 max-sm:top-4 max-sm:left-1/2 max-sm:-translate-x-1/2">
        <AnimatePresence>
          {toasts.map((t) => (
            <Toast key={t.id} {...t} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
