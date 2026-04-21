
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  onConfirm?: () => void;
  confirmText?: string;
}

export const SimpleModal: React.FC<SimpleModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'info',
  onConfirm,
  confirmText = 'Confirmar'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className={`p-8 ${
              type === 'success' ? 'bg-emerald-50' : 
              type === 'error' ? 'bg-rose-50' : 'bg-indigo-50'
            }`}>
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                  type === 'success' ? 'bg-emerald-500 text-white' : 
                  type === 'error' ? 'bg-rose-500 text-white' : 'bg-indigo-500 text-white'
                }`}>
                  {type === 'success' && <CheckCircle className="w-8 h-8" />}
                  {type === 'error' && <AlertCircle className="w-8 h-8" />}
                  {type === 'info' && <Info className="w-8 h-8" />}
                </div>
                
                <div>
                  <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">{title}</h3>
                  <p className="text-slate-500 text-sm font-medium mt-2 leading-relaxed">{message}</p>
                </div>

                <div className="flex flex-col w-full gap-2 pt-2">
                  {onConfirm ? (
                    <>
                      <button
                        onClick={() => {
                          onConfirm();
                          onClose();
                        }}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all shadow-lg hover:bg-black active:scale-[0.98]"
                      >
                        {confirmText}
                      </button>
                      <button
                        onClick={onClose}
                        className="w-full py-4 bg-white text-slate-400 border border-slate-100 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all hover:bg-slate-50 active:scale-[0.98]"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={onClose}
                      className={`w-full py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] ${
                        type === 'success' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 
                        type === 'error' ? 'bg-rose-500 text-white shadow-rose-500/20' : 'bg-indigo-500 text-white shadow-indigo-500/20'
                      }`}
                    >
                      Continuar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
