
import React from 'react';
import { Rocket, Sparkles, Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Mentoria = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-brand-surface/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-[3rem] p-12 shadow-2xl border border-gray-100 text-center space-y-8 relative overflow-hidden"
      >
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-[#F67C01]"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50"></div>

        <div className="relative">
          <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl rotate-6 hover:rotate-0 transition-transform duration-500 group">
            <Rocket className="w-12 h-12 text-white" />
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
            <Sparkles className="w-3 h-3" /> EM BREVE
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter italic uppercase mb-4">
            Mentoria <span className="text-indigo-600">Full</span>
          </h1>
          
          <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg mx-auto">
            Estamos preparando uma experiência exclusiva de mentoria estratégica para alavancar seu negócio ao próximo nível com o próprio Carlos Nunes.
          </p>
        </div>

        <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 flex flex-col md:flex-row items-center gap-6 justify-center">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-indigo-600">
            <Lock className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">Exclusividade do Plano Full</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Esta será uma função liberada apenas para usuários do plano Full.</p>
          </div>
        </div>

        <div className="pt-4">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> VOLTAR AO PAINEL
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
