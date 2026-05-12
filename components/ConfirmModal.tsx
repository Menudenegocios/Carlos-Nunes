import React from 'react';
import { AlertCircle, CheckCircle2, X, Info } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type?: 'danger' | 'success' | 'info' | 'warning';
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar'
}) => {
  if (!isOpen) return null;

  const themes = {
    danger: {
      bg: 'bg-rose-50',
      icon: <AlertCircle className="w-10 h-10 text-rose-500" />,
      accent: 'bg-rose-500',
      button: 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'
    },
    success: {
      bg: 'bg-emerald-50',
      icon: <CheckCircle2 className="w-10 h-10 text-emerald-500" />,
      accent: 'bg-emerald-500',
      button: 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200'
    },
    warning: {
      bg: 'bg-orange-50',
      icon: <AlertCircle className="w-10 h-10 text-orange-500" />,
      accent: 'bg-orange-500',
      button: 'bg-orange-500 hover:bg-orange-600 shadow-orange-200'
    },
    info: {
      bg: 'bg-indigo-50',
      icon: <Info className="w-10 h-10 text-indigo-500" />,
      accent: 'bg-indigo-500',
      button: 'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-200'
    }
  };

  const theme = themes[type];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-2 ${theme.accent}`}></div>
        
        <div className="flex flex-col items-center text-center space-y-6">
          <div className={`w-20 h-20 ${theme.bg} rounded-3xl flex items-center justify-center`}>
            {theme.icon}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">{title}</h3>
            <p className="text-xs font-bold text-slate-500 mt-2 tracking-tight leading-relaxed">{message}</p>
          </div>

          <div className="flex gap-4 w-full pt-4">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 bg-gray-50 hover:bg-gray-100 transition-all border border-gray-100"
            >
              {cancelText}
            </button>
            {onConfirm && (
              <button 
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white transition-all shadow-lg ${theme.button}`}
              >
                {confirmText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
