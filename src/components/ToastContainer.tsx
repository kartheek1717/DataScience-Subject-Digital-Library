import React from 'react';
import { useLab } from '../context/LabContext';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useLab();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 ${
            toast.type === 'success'
              ? 'bg-white/95 dark:bg-[#0D1E2A]/95 text-[#122333] dark:text-white border-[#009F9A]/30 shadow-[#009F9A]/10'
              : toast.type === 'error'
              ? 'bg-red-50/95 dark:bg-red-950/90 text-red-900 dark:text-red-200 border-red-200 dark:border-red-800'
              : 'bg-blue-50/95 dark:bg-blue-950/90 text-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800'
          }`}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#009F9A] shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-500 shrink-0" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
