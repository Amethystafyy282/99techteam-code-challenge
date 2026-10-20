import { useCallback, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { TOAST_DURATION_MS } from '../constants/toast';
import { ToastContext, type Toast, type ToastVariant } from '../contexts/ToastContext';
import { Button } from './Button';
import { AlertCircleIcon, CheckCircleIcon, CloseIcon } from './icons';

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: number) => void;
}

const ToastItem = ({ toast, onDismiss }: ToastItemProps) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const isSuccess = toast.variant === 'success';

  return (
    <li
      role={isSuccess ? 'status' : 'alert'}
      className="pointer-events-auto flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm text-slate-800 shadow-lg ring-1 ring-slate-200 transition duration-300 dark:bg-slate-800 dark:text-slate-100 dark:shadow-black/40 dark:ring-slate-700 starting:-translate-y-2 starting:opacity-0"
    >
      {isSuccess ? (
        <CheckCircleIcon className="text-emerald-500 dark:text-emerald-400" />
      ) : (
        <AlertCircleIcon className="text-red-500 dark:text-red-400" />
      )}

      <span className="min-w-0 flex-1">{toast.message}</span>

      <Button variant="ghost" size="icon-sm" onClick={() => onDismiss(toast.id)} aria-label="Dismiss notification">
        <CloseIcon className="h-4 w-4" />
      </Button>
    </li>
  );
};

interface ToastProviderProps extends PropsWithChildren {}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextToastId = useRef(0);

  const dismissToast = useCallback(
    (id: number) => setToasts((current) => current.filter((toast) => toast.id !== id)),
    [],
  );

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = nextToastId.current++;
    setToasts((current) => [...current, { id, message, variant }]);
  }, []);

  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      <ol
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 top-4 z-50 mx-auto flex max-w-96 flex-col items-stretch gap-2"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </ol>
    </ToastContext.Provider>
  );
};
