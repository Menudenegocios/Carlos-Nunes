
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Menu, X, Store, LogOut, Sun, Moon, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';
import { AIChatAgent } from './AIChatAgent';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Fix: changed incorrect hook call userAuth to useAuth
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: 'Início', path: '/' },
    { label: 'Quem Somos', path: '/quem-somos' },
    { label: 'Vitrine', path: '/stores' },
    { label: 'Marketplace', path: '/marketplace' },
    { label: 'Parceiros', path: '/partners' },
    { label: 'Eventos', path: '/eventos' },
    { label: 'Blog', path: '/blog' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-surface dark:bg-brand-dark transition-colors duration-300">
      <header className="fixed top-0 left-0 right-0 z-[100] bg-brand-surface/80 dark:bg-brand-dark/80 backdrop-blur-md border-b border-brand-secondary/20 shadow-sm transition-colors">
        <div className="max-w-[1600px] mx-auto px-8 flex justify-between items-center h-24">
          <Link to="/" className="group flex-shrink-0">
            <Logo size="sm" forceWhite={theme === 'dark'} />
          </Link>

          <nav className="hidden xl:flex items-center gap-12">
            {navItems.map((item) => (
              <Link 
                key={item.label}
                to={item.path} 
                className={`text-base font-bold tracking-tight transition-all px-2 py-1 rounded-lg hover:text-brand-primary ${
                  isActive(item.path) 
                    ? 'text-brand-primary' 
                    : 'text-brand-contrast/70 dark:text-brand-surface/60'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden xl:flex items-center gap-6">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 text-brand-primary border border-brand-secondary/20 hover:scale-110 transition-all"
              title="Alternar Tema"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-4 p-2 pr-4 rounded-full border bg-white dark:bg-slate-800 border-brand-secondary/20 transition-all">
                <Link to="/profile" className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white text-sm font-black">
                  {user.name.charAt(0)}
                </Link>
                <Link to="/dashboard" className="text-xs font-black uppercase tracking-widest hover:text-brand-primary dark:text-brand-surface transition-colors">Painel</Link>
                <button onClick={logout} className="text-brand-secondary hover:text-rose-500 transition-colors"><LogOut className="w-5 h-5" /></button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/register" className="text-xs font-black px-8 py-4 rounded-full uppercase tracking-widest shadow-lg bg-brand-dark dark:bg-brand-primary text-white hover:opacity-90 transition-all">
                  Anunciar Grátis
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 xl:hidden">
            <button onClick={toggleTheme} className="p-2 text-brand-primary">
               {theme === 'light' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
            </button>
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-brand-contrast dark:text-brand-surface"><Menu className="w-8 h-8" /></button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full pt-28">
        {children}
      </main>

      <footer className="bg-brand-dark text-brand-surface pt-24 pb-12 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-1 md:col-span-1 space-y-6">
              <Link to="/">
                <Logo size="sm" forceWhite />
              </Link>
              <p className="text-brand-secondary text-sm leading-relaxed font-medium">
                Elevando a conexão entre negócios locais e consumidores através de tecnologia inteligente e design funcional.
              </p>
            </div>
            
            <div>
              <h4 className="font-black text-xs uppercase tracking-[0.2em] text-brand-secondary mb-8">Navegação</h4>
              <ul className="space-y-4 text-sm font-bold text-brand-surface/80">
                <li><Link to="/stores" className="hover:text-brand-primary transition-colors">Vitrine de Negócios</Link></li>
                <li><Link to="/marketplace" className="hover:text-brand-primary transition-colors">Catálogo de Produtos</Link></li>
                <li><Link to="/eventos" className="hover:text-brand-primary transition-colors">Eventos & Experiências</Link></li>
                <li><Link to="/blog" className="hover:text-brand-primary transition-colors">Insights & Dicas</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-xs uppercase tracking-[0.2em] text-brand-secondary mb-8">Empresa</h4>
              <ul className="space-y-4 text-sm font-bold text-brand-surface/80">
                <li><Link to="/quem-somos" className="hover:text-brand-primary transition-colors">Quem Somos</Link></li>
                <li><Link to="/partners" className="hover:text-brand-primary transition-colors">Nossos Parceiros</Link></li>
                <li><Link to="/plans" className="hover:text-brand-primary transition-colors">Planos Pro</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="font-black text-xs uppercase tracking-[0.2em] text-brand-secondary">Comece Hoje</h4>
              <Link to="/register" className="group flex items-center justify-between bg-brand-surface text-brand-dark p-4 rounded-2xl font-black text-sm transition-all hover:bg-brand-primary hover:text-white">
                CADASTRAR NEGÓCIO
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          
          <div className="pt-8 border-t border-brand-surface/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] text-brand-secondary font-bold uppercase tracking-widest">
              &copy; {new Date().getFullYear()} MENU PAGES. Sua vitrine inteligente.
            </p>
            <div className="flex gap-8 text-[10px] text-brand-secondary font-bold uppercase tracking-widest">
              <Link to="/privacy" className="hover:text-brand-surface transition-colors">Privacidade</Link>
              <Link to="/terms" className="hover:text-brand-surface transition-colors">Termos</Link>
            </div>
          </div>
        </div>
      </footer>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] xl:hidden">
          <div className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-[80%] bg-brand-surface dark:bg-slate-900 p-8 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-12">
               <Logo size="sm" />
               <button onClick={() => setIsMobileMenuOpen(false)}><X className="w-10 h-10 text-brand-secondary" /></button>
            </div>
            <nav className="flex flex-col gap-4">
               {navItems.map((item) => (
                 <Link 
                  key={item.label} 
                  to={item.path} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className={`text-2xl font-black border-b border-brand-secondary/20 pb-3 ${
                    isActive(item.path) ? 'text-brand-primary' : 'text-brand-dark dark:text-brand-surface'
                  }`}
                >
                  {item.label}
                </Link>
               ))}
            </nav>
            <div className="mt-auto pt-8 flex flex-col gap-4">
               <button onClick={toggleTheme} className="flex items-center gap-3 p-5 bg-white dark:bg-slate-800 rounded-3xl font-black dark:text-brand-surface shadow-sm">
                  {theme === 'light' ? <><Moon className="w-6 h-6" /> Modo Escuro</> : <><Sun className="w-6 h-6 text-brand-accent" /> Modo Claro</>}
               </button>
               {!user ? (
                 <Link to="/register" className="w-full bg-brand-dark dark:bg-brand-primary text-white p-6 rounded-3xl font-black text-center block uppercase tracking-widest">Anunciar Grátis</Link>
               ) : (
                 <Link to="/dashboard" className="w-full bg-brand-primary text-white p-6 rounded-3xl font-black text-center block uppercase tracking-widest">Meu Painel</Link>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Assistente de IA Global */}
      <AIChatAgent />
    </div>
  );
};
