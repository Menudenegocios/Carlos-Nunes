
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, Smartphone, Package, 
  Trophy, LogOut, Menu, X, Star, Layout, 
  Store, ChevronLeft, Briefcase, GraduationCap,
  Handshake, CreditCard, Sparkles, BookOpen, Settings2,
  AlertCircle, ChevronRight, Globe, LayoutGrid, Lock
} from 'lucide-react';
import { Logo } from './Logo';
import { AIChatAgent } from './AIChatAgent';
import { motion } from 'framer-motion';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  if (!user) return null;

  // Verifica se o usuário tem permissão de acesso (Se for Admin ou se o plano for PRO/Business)
  const isAdmin = user.role === 'admin';
  const hasPaidPlan = user.plan === 'pro' || user.plan === 'full';
  const isPreRegistration = user.plan === 'pre-cadastro';

  const menuItems = [
    { label: 'Visão Geral', icon: LayoutDashboard, to: '/dashboard', locked: false },
    ...(isAdmin ? [{ label: 'Central', icon: Settings2, to: '/admin-central', locked: false }] : []),
    { label: 'Minha Vitrine', icon: Globe, to: '/catalog', locked: isPreRegistration && !isAdmin },
    { label: 'CRM & Vendas', icon: Briefcase, to: '/business-suite', locked: isPreRegistration && !isAdmin },
    { label: 'Gestão de Projetos', icon: LayoutGrid, to: '/project-management', locked: isPreRegistration && !isAdmin },
    { label: 'Menu Club', icon: Trophy, to: '/rewards', locked: isPreRegistration && !isAdmin },
    { label: 'Menu Academy', icon: GraduationCap, to: '/academy', locked: false },
    { label: 'Planos de Adesão', icon: CreditCard, to: '/plans', locked: false },
  ];

  const isActive = (path: string) => location.pathname === path;

  const planNames: Record<string, string> = {
    'pre-cadastro': 'Pré-cadastro',
    basic: 'Plano Básico',
    pro: 'Plano Pro',
    full: 'Plano FULL'
  };

  return (
    <div className="flex h-screen bg-brand-surface overflow-hidden transition-colors duration-300 font-sans">
      
      <aside 
        className={`hidden lg:flex flex-col bg-white/70 backdrop-blur-xl border border-white/5 h-[calc(100vh-2.5rem)] my-5 ml-5 rounded-[2.5rem] flex-shrink-0 transition-all duration-500 ease-in-out shadow-2xl overflow-hidden ${
          isExpanded ? 'w-72' : 'w-24'
        }`}
      >
        <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
          <div className={`flex items-center mb-10 transition-all ${isExpanded ? 'justify-between px-2' : 'justify-center'}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <Link to="/" className="flex items-center">
                 <Logo variant={isExpanded ? 'full' : 'icon'} size={isExpanded ? "sm" : "xs"} />
              </Link>
            </div>
            
            {isExpanded && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg border border-brand-secondary/10 text-brand-secondary hover:bg-brand-surface hover:text-brand-primary transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.locked ? '#' : item.to}
                onClick={(e) => item.locked && e.preventDefault()}
                className={`flex items-center rounded-xl transition-all group overflow-hidden relative ${
                  item.locked ? 'opacity-50 cursor-not-allowed grayscale' : ''
                } ${
                  isActive(item.to) 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-slate-500 hover:bg-brand-surface hover:text-brand-dark'
                } ${isExpanded ? 'px-4 py-3.5 gap-4' : 'p-3.5 justify-center'}`}
              >
                {isActive(item.to) && !item.locked && (
                  <motion.div 
                    layoutId="activeSideTab"
                    className="absolute inset-0 bg-indigo-50 rounded-xl" 
                  />
                )}
                {isActive(item.to) && !item.locked && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#F67C01] rounded-r-full shadow-[0_0_15px_rgba(246,124,1,0.6)]"></div>
                )}
                
                <item.icon className={`w-5 h-5 transition-all duration-300 relative z-10 ${isActive(item.to) ? 'text-indigo-600 scale-110' : 'text-slate-400 group-hover:text-brand-dark group-hover:scale-110'}`} />
                {isExpanded && (
                  <div className="flex items-center justify-between flex-1 overflow-hidden relative z-10">
                    <span className="animate-in fade-in slide-in-from-left-2 duration-300 whitespace-nowrap text-[11px] font-black tracking-widest uppercase italic">{item.label}</span>
                    {item.locked && <Lock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-2" />}
                  </div>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-5 border-t border-brand-secondary/5">
          <button 
            onClick={logout}
            className={`flex items-center gap-4 px-5 py-5 rounded-2xl font-black text-[10px] tracking-widest bg-rose-50/50 text-rose-600 hover:bg-rose-500 hover:text-white transition-all duration-300 w-full group shadow-sm ${!isExpanded ? 'justify-center p-3.5' : ''}`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
            {isExpanded && <span className="animate-in fade-in slide-in-from-left-1 duration-300">SAIR DA CONTA</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className={`h-20 bg-white border-b border-brand-secondary/10 px-6 lg:px-10 flex justify-between items-center sticky top-0 z-30 flex-shrink-0`}>
           <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2.5 bg-brand-surface rounded-xl text-brand-secondary lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <nav className="hidden md:flex items-center gap-8">
                <Link to="/" className="text-[10px] font-black tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">SITE PRINCIPAL</Link>
              </nav>

              <div className="h-6 w-px bg-brand-secondary/10 hidden md:block"></div>

              <span className="font-black text-brand-dark text-sm tracking-tight hidden sm:block uppercase">
                {menuItems.find(i => isActive(i.to))?.label || 'Painel'}
              </span>
           </div>
           
            <div className="flex items-center gap-4">
               <div className="hidden sm:flex flex-col text-right">
                  <span className="text-[11px] font-black text-brand-dark leading-none">{user.name}</span>
                  <span className="text-[9px] text-[#F67C01] font-black tracking-widest mt-1 uppercase">
                    {isAdmin ? 'ADMINISTRADOR' : planNames[user.plan]}
                  </span>
               </div>
               <div className="flex items-center gap-2">
                 <Link to="/profile" className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-sm font-black border border-brand-secondary/10 hover:scale-105 transition-transform">
                   {user.name.charAt(0)}
                 </Link>
                 <button 
                   onClick={logout}
                   className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:scale-105 transition-all border border-rose-100"
                   title="Sair"
                 >
                   <LogOut className="w-5 h-5" />
                 </button>
               </div>
            </div>
        </header>

        <div 
          className="flex-1 overflow-y-auto scroll-smooth flex flex-col bg-white"
        >
          <div className="flex-1 p-6 md:p-10">
            {children}
          </div>

          <footer className="bg-white border-t border-brand-secondary/10 py-8 px-10 mt-auto">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-brand-secondary">
              <div className="flex items-center gap-2">
                 <Logo size="sm" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                &copy; {new Date().getFullYear()} MENU DE NEGÓCIOS INC.
              </p>
            </div>
          </footer>
        </div>
      </main>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden animate-fade-in">
           <div className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
           <aside className="absolute top-0 left-0 bottom-0 w-[280px] bg-brand-surface shadow-2xl flex flex-col animate-slide-in-left">
              <div className="p-6 border-b border-brand-secondary/10 flex justify-between items-center">
                 <Logo size="sm" />
                 <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-brand-secondary"><X className="w-6 h-6" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                 {menuItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all relative ${
                        isActive(item.to) ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white'
                      }`}
                    >
                      {isActive(item.to) && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-primary rounded-r-full"></div>}
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-black tracking-tight">{item.label}</span>
                    </Link>
                 ))}
              </div>
              <div className="p-6 border-t border-brand-secondary/10">
                 <button 
                   onClick={logout}
                   className="flex items-center gap-4 w-full p-4 rounded-xl text-rose-600 hover:bg-rose-50 transition-all"
                 >
                   <LogOut className="w-5 h-5 flex-shrink-0" />
                   <span className="text-sm font-black tracking-tight tracking-widest uppercase">Sair</span>
                 </button>
              </div>
           </aside>
        </div>
      )}

      <AIChatAgent />
    </div>
  );
};
