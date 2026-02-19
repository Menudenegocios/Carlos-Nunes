
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  LayoutDashboard, Smartphone, Package, 
  Trophy, LogOut, Menu, X, Star, Layout, 
  Store, ChevronLeft, Briefcase, GraduationCap,
  Sun, Moon, Handshake, CreditCard, Sparkles, BookOpen, Settings2,
  AlertCircle, ChevronRight
} from 'lucide-react';
import { Logo } from './Logo';
import { AIChatAgent } from './AIChatAgent';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, isImpersonating, stopImpersonating, realAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  if (!user) return null;

  // Verifica se o usuário tem permissão de acesso (Se for Admin ou se o plano for PRO/Business)
  const isAdmin = user.role === 'admin' || realAdmin?.role === 'admin';
  const hasAdvancedAccess = isAdmin || user.plan === 'freelancers' || user.plan === 'negocios';

  const menuItems = [
    { label: 'Visão Geral', icon: LayoutDashboard, to: '/dashboard' },
    { label: 'Bio Digital', icon: Smartphone, to: '/bio-builder' },
    // Recursos Restritos
    ...(hasAdvancedAccess ? [
      { label: 'Menu Pages', icon: Package, to: '/catalog' },
      { label: 'Menu CRM', icon: Briefcase, to: '/business-suite' },
    ] : []),
    { label: 'Menu Academy', icon: GraduationCap, to: '/academy' },
    { label: 'Menu Club', icon: Trophy, to: '/rewards' },
    { label: 'Planos de Adesão', icon: CreditCard, to: '/plans' },
  ];

  if (isAdmin) {
    menuItems.push({ label: 'Central', icon: Settings2, to: '/admin-central' });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-brand-surface dark:bg-brand-dark overflow-hidden transition-colors duration-300 font-sans">
      
      {/* BANNER DE PERSONIFICAÇÃO */}
      {isImpersonating && (
        <div className="fixed top-0 left-0 right-0 z-[110] bg-[#F67C01] text-white py-2 px-6 flex items-center justify-between shadow-xl animate-slide-in-top">
           <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 animate-pulse" />
              <p className="text-xs font-black uppercase tracking-widest">
                Modo Personificação: Editando a vitrine de <span className="underline italic">{user.name}</span>
              </p>
           </div>
           <button 
             onClick={stopImpersonating}
             className="bg-white text-[#F67C01] px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-zinc-100 transition-all"
           >
             SAIR DA CONTA
           </button>
        </div>
      )}

      <aside 
        className={`hidden lg:flex flex-col bg-white dark:bg-[#0F172A] border-r border-brand-secondary/10 h-full flex-shrink-0 transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-72' : 'w-20'
        } ${isImpersonating ? 'pt-10' : ''}`}
      >
        <div className="p-5">
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
                to={item.to}
                className={`flex items-center rounded-xl transition-all group overflow-hidden relative ${
                  isActive(item.to) 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-brand-surface dark:hover:bg-slate-800/50 hover:text-brand-dark dark:hover:text-brand-surface'
                } ${isExpanded ? 'px-4 py-3.5 gap-4' : 'p-3.5 justify-center'}`}
              >
                {isActive(item.to) && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#F67C01] rounded-r-full shadow-[2px_0_10px_rgba(246,124,1,0.5)]"></div>
                )}
                
                <item.icon className={`w-5 h-5 transition-colors flex-shrink-0 ${isActive(item.to) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-brand-dark dark:group-hover:text-brand-surface'}`} />
                {isExpanded && <span className="animate-in fade-in slide-in-from-left-2 duration-300 whitespace-nowrap text-sm font-black tracking-tight">{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-5 space-y-2">
          <button 
            onClick={toggleTheme}
            className={`flex items-center gap-4 px-5 py-4 rounded-xl font-black text-[10px] tracking-widest text-slate-500 dark:text-slate-400 hover:bg-brand-surface dark:hover:bg-slate-800 transition-all w-full ${!isExpanded ? 'justify-center p-3.5' : ''}`}
          >
            {theme === 'light' ? <><Moon className="w-5 h-5 text-indigo-600" /> {isExpanded && 'MODO ESCURO'}</> : <><Sun className="w-5 h-5 text-yellow-400" /> {isExpanded && 'MODO CLARO'}</>}
          </button>
          
          <button 
            onClick={logout}
            className={`flex items-center gap-4 px-5 py-4 rounded-xl font-black text-[10px] tracking-widest text-slate-500 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all w-full ${!isExpanded ? 'justify-center p-3.5' : ''}`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isExpanded && <span className="animate-in fade-in slide-in-from-left-1 duration-300">SAIR</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className={`h-20 bg-white dark:bg-[#0F172A] border-b border-brand-secondary/10 px-6 lg:px-10 flex justify-between items-center sticky top-0 z-30 flex-shrink-0 ${isImpersonating ? 'mt-10' : ''}`}>
           <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2.5 bg-brand-surface dark:bg-slate-800 rounded-xl text-brand-secondary lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <nav className="hidden md:flex items-center gap-8">
                <Link to="/" className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 hover:text-indigo-600 transition-colors">SITE PRINCIPAL</Link>
                <Link to="/stores" className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 hover:text-indigo-600 transition-colors">VITRINE</Link>
              </nav>

              <div className="h-6 w-px bg-brand-secondary/10 hidden md:block"></div>

              <span className="font-black text-brand-dark dark:text-white text-sm tracking-tight hidden sm:block uppercase">
                {menuItems.find(i => isActive(i.to))?.label || 'Painel'}
              </span>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col text-right">
                 <span className="text-[11px] font-black text-brand-dark dark:text-white leading-none">{user.name}</span>
                 <span className="text-[9px] text-[#F67C01] font-black tracking-widest mt-1 uppercase">{user.plan}</span>
              </div>
              <Link to="/profile" className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-sm font-black border border-brand-secondary/10 hover:scale-105 transition-transform">
                {user.name.charAt(0)}
              </Link>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto scroll-smooth flex flex-col bg-brand-surface dark:bg-[#020617]">
          <div className="flex-1 p-6 md:p-10">
            {children}
          </div>

          <footer className="bg-white dark:bg-[#0F172A] border-t border-brand-secondary/10 py-8 px-10 mt-auto">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-brand-secondary">
              <div className="flex items-center gap-2">
                 <Logo size="sm" forceWhite={theme === 'dark'} />
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
           <aside className="absolute top-0 left-0 bottom-0 w-[280px] bg-brand-surface dark:bg-[#0F172A] shadow-2xl flex flex-col animate-slide-in-left">
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
                        isActive(item.to) ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 dark:text-brand-surface/80 hover:bg-white dark:hover:bg-slate-800'
                      }`}
                    >
                      {isActive(item.to) && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-primary rounded-r-full"></div>}
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-black tracking-tight">{item.label}</span>
                    </Link>
                 ))}
              </div>
           </aside>
        </div>
      )}

      <AIChatAgent />
    </div>
  );
};
