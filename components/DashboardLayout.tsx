
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  LayoutDashboard, Smartphone, Package, 
  Trophy, LogOut, Menu, X, Star, Layout, 
  Store, ChevronLeft, Briefcase, GraduationCap,
  Sun, Moon, Handshake
} from 'lucide-react';
import { Logo } from './Logo';
import { AIChatAgent } from './AIChatAgent';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  if (!user) return null;

  const menuItems = [
    { label: 'Visão Geral', icon: LayoutDashboard, to: '/dashboard' },
    { label: 'Bio Digital', icon: Smartphone, to: '/bio-builder' },
    { label: 'Catálogo & Loja', icon: Package, to: '/catalog' },
    { label: 'CRM & Vendas', icon: Briefcase, to: '/business-suite' },
    { label: 'Marketplace B2B', icon: Handshake, to: '/marketplace-b2b' },
    { label: 'Menu Academy', icon: GraduationCap, to: '/academy' },
    { label: 'Clube de Vantagens', icon: Trophy, to: '/rewards' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-brand-surface dark:bg-black overflow-hidden transition-colors duration-300 font-sans">
      <aside 
        className={`hidden lg:flex flex-col bg-white dark:bg-zinc-950 border-r border-brand-secondary/30 h-full flex-shrink-0 transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-72' : 'w-20'
        }`}
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
                className="p-1.5 rounded-lg border border-brand-secondary/20 text-brand-secondary hover:bg-brand-surface hover:text-brand-primary transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          <nav className="space-y-1.5">
            {!isExpanded && (
              <button 
                onClick={() => setIsExpanded(true)}
                className="w-full flex items-center justify-center p-3.5 mb-4 rounded-xl text-brand-secondary hover:bg-brand-surface hover:text-brand-primary transition-all"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center rounded-2xl transition-all group overflow-hidden ${
                  isActive(item.to) 
                    ? 'bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                    : 'text-brand-contrast/70 dark:text-brand-surface/60 hover:bg-brand-surface dark:hover:bg-zinc-900 hover:text-brand-contrast dark:hover:text-brand-surface'
                } ${isExpanded ? 'px-4 py-3.5 gap-4' : 'p-3.5 justify-center'}`}
              >
                <item.icon className={`w-5 h-5 transition-colors flex-shrink-0 ${isActive(item.to) ? 'text-emerald-600' : 'text-brand-contrast dark:text-brand-surface/40 group-hover:text-brand-contrast dark:group-hover:text-brand-surface'}`} />
                {isExpanded && <span className="animate-in fade-in slide-in-from-left-2 duration-300 whitespace-nowrap text-base font-black tracking-tight">{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-5 space-y-4">
          <button 
            onClick={toggleTheme}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-[11px] tracking-widest text-brand-contrast dark:text-brand-surface/60 hover:bg-brand-surface dark:hover:bg-zinc-900 transition-all w-full ${!isExpanded ? 'justify-center p-3.5' : ''}`}
          >
            {theme === 'light' ? <><Moon className="w-5 h-5 text-emerald-600" /> {isExpanded && 'Modo Escuro'}</> : <><Sun className="w-5 h-5 text-yellow-400" /> {isExpanded && 'Modo Claro'}</>}
          </button>
          
          <button 
            onClick={logout}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-[11px] tracking-widest text-brand-contrast dark:text-brand-surface/60 hover:bg-rose-50 hover:text-rose-600 transition-all w-full ${!isExpanded ? 'justify-center p-3.5' : ''}`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isExpanded && <span className="animate-in fade-in slide-in-from-left-1 duration-300">Encerrar Sessão</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-20 bg-white dark:bg-zinc-950 border-b border-brand-secondary/30 px-6 lg:px-10 flex justify-between items-center sticky top-0 z-30 flex-shrink-0">
           <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2.5 bg-brand-surface rounded-xl text-brand-secondary lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <nav className="hidden md:flex items-center gap-8">
                <Link to="/" className="text-sm font-black tracking-widest text-brand-contrast dark:text-brand-surface/40 hover:text-emerald-600 transition-colors">Início</Link>
                <Link to="/stores" className="text-sm font-black tracking-widest text-brand-contrast dark:text-brand-surface/40 hover:text-emerald-600 transition-colors">Lojas</Link>
              </nav>

              <div className="h-6 w-px bg-brand-secondary/20 hidden md:block"></div>

              <span className="font-black text-brand-contrast dark:text-brand-surface text-base tracking-tight hidden sm:block">
                {menuItems.find(i => isActive(i.to))?.label || 'Painel'}
              </span>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col text-right">
                 <span className="text-[11px] font-black text-brand-contrast dark:text-brand-surface leading-none">{user.name}</span>
                 <span className="text-[9px] text-emerald-600 font-black tracking-widest mt-1 uppercase">{user.plan}</span>
              </div>
              <Link to="/profile" className="w-10 h-10 rounded-2xl bg-brand-surface dark:bg-zinc-800 flex items-center justify-center text-emerald-600 text-sm font-black border border-brand-secondary/30 hover:scale-105 transition-transform">
                {user.name.charAt(0)}
              </Link>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto scroll-smooth flex flex-col bg-brand-surface dark:bg-black">
          <div className="flex-1 p-6 md:p-10">
            {children}
          </div>

          <footer className="bg-white dark:bg-zinc-950 border-t border-brand-secondary/20 py-10 px-10 mt-auto">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-brand-secondary">
              <div className="flex items-center gap-2">
                 <Logo size="xs" />
              </div>
              <div className="flex gap-10 text-[10px] font-black tracking-widest uppercase text-brand-contrast dark:text-brand-surface">
                <Link to="/support" className="hover:text-emerald-600">Suporte</Link>
                <Link to="/plans" className="hover:text-emerald-600">Upgrade</Link>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest">
                &copy; {new Date().getFullYear()} MENU DE NEGÓCIOS INC.
              </p>
            </div>
          </footer>
        </div>
      </main>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden animate-fade-in">
           <div className="absolute inset-0 bg-brand-contrast/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
           <aside className="absolute top-0 left-0 bottom-0 w-[280px] bg-brand-surface dark:bg-zinc-900 shadow-2xl flex flex-col animate-slide-in-left">
              <div className="p-6 border-b border-brand-secondary/30 flex justify-between items-center">
                 <Logo size="sm" />
                 <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-brand-secondary"><X className="w-6 h-6" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                 {menuItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                        isActive(item.to) ? 'bg-emerald-600 text-white shadow-lg' : 'text-brand-contrast dark:text-brand-surface/80 hover:bg-white dark:hover:bg-zinc-800'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-base font-black tracking-tight">{item.label}</span>
                    </Link>
                 ))}
              </div>
              <div className="p-4 border-t border-brand-secondary/30 flex flex-col gap-3">
                 <button onClick={toggleTheme} className="flex items-center justify-center gap-3 w-full p-4 bg-white dark:bg-zinc-800 text-brand-contrast dark:text-brand-surface rounded-2xl font-black text-[10px] uppercase tracking-widest">
                    {theme === 'light' ? <><Moon className="w-4 h-4" /> Escuro</> : <><Sun className="w-4 h-4 text-brand-accent" /> Claro</>}
                 </button>
                 <button onClick={logout} className="flex items-center justify-center gap-3 w-full p-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest">
                   <LogOut className="w-4 h-4" /> Sair
                 </button>
              </div>
           </aside>
        </div>
      )}

      {/* Assistente de IA no Dashboard */}
      <AIChatAgent />
    </div>
  );
};
