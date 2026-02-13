
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Menu, X, Store, LogOut, Sun, Moon, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: 'Início', path: '/' },
    { label: 'Quem Somos', path: '/quem-somos' },
    { label: 'Parceiros', path: '/partners' },
    { label: 'Marketplace', path: '/marketplace' },
    { label: 'Eventos', path: '/eventos' },
    { label: 'Blog', path: '/blog' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300">
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 py-4 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="group">
            <Logo size="md" showTagline />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link 
                key={item.label}
                to={item.path} 
                className={`text-sm font-bold tracking-tight transition-all hover:text-[#F5821F] dark:hover:text-[#F5821F] ${
                  isActive(item.path) ? 'text-[#F5821F]' : 'text-gray-500 dark:text-slate-400'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-yellow-400 border border-gray-100 dark:border-slate-800 hover:scale-110 transition-all"
              title="Alternar Tema"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-4 p-1.5 pr-4 rounded-full border bg-gray-50 dark:bg-slate-900 border-gray-100 dark:border-slate-800 transition-all">
                <Link to="/profile" className="w-8 h-8 rounded-full bg-[#F5821F] flex items-center justify-center text-white text-xs font-black">
                  {user.name.charAt(0)}
                </Link>
                <Link to="/dashboard" className="text-xs font-black uppercase tracking-widest hover:text-[#F5821F] dark:text-slate-200 transition-colors">Painel</Link>
                <button onClick={logout} className="text-gray-400 hover:text-rose-500 transition-colors"><LogOut className="w-4 h-4" /></button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-gray-900 dark:text-white px-4">Entrar</Link>
                <Link to="/register" className="text-xs font-black px-6 py-3 rounded-full uppercase tracking-widest shadow-lg bg-gray-900 dark:bg-[#F5821F] text-white hover:opacity-90 transition-all">
                  Anunciar Grátis
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-yellow-400">
               {theme === 'light' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
            </button>
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-900 dark:text-white"><Menu className="w-6 h-6" /></button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full pt-16">
        {children}
      </main>

      <footer className="bg-gray-950 text-white pt-24 pb-12 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-1 md:col-span-1 space-y-6">
              <Link to="/">
                <Logo size="md" className="invert brightness-200" />
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                Elevando a conexão entre negócios locais e consumidores através de tecnologia inteligente e design funcional.
              </p>
            </div>
            
            <div>
              <h4 className="font-black text-xs uppercase tracking-[0.2em] text-gray-500 mb-8">Navegação</h4>
              <ul className="space-y-4 text-sm font-bold text-gray-300">
                <li><Link to="/marketplace" className="hover:text-[#F5821F] transition-colors">Catálogo de Produtos</Link></li>
                <li><Link to="/eventos" className="hover:text-[#F5821F] transition-colors">Eventos & Experiências</Link></li>
                <li><Link to="/blog" className="hover:text-[#F5821F] transition-colors">Insights & Dicas</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-xs uppercase tracking-[0.2em] text-gray-500 mb-8">Empresa</h4>
              <ul className="space-y-4 text-sm font-bold text-gray-300">
                <li><Link to="/quem-somos" className="hover:text-[#F5821F] transition-colors">Quem Somos</Link></li>
                <li><Link to="/partners" className="hover:text-[#F5821F] transition-colors">Nossos Parceiros</Link></li>
                <li><Link to="/plans" className="hover:text-[#F5821F] transition-colors">Planos Pro</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="font-black text-xs uppercase tracking-[0.2em] text-gray-500">Comece Hoje</h4>
              <Link to="/register" className="group flex items-center justify-between bg-white text-black p-4 rounded-2xl font-black text-sm transition-all hover:bg-[#F5821F] hover:text-white">
                CADASTRAR NEGÓCIO
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              &copy; {new Date().getFullYear()} MENU DE NEGÓCIOS. Inteligência Local.
            </p>
            <div className="flex gap-8 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacidade</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Termos</Link>
            </div>
          </div>
        </div>
      </footer>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-[80%] bg-white dark:bg-slate-900 p-8 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-12">
               <Logo size="md" />
               <button onClick={() => setIsMobileMenuOpen(false)}><X className="w-8 h-8 text-gray-400" /></button>
            </div>
            <nav className="flex flex-col gap-4">
               {navItems.map((item) => (
                 <Link 
                  key={item.label} 
                  to={item.path} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-50 dark:border-slate-800 pb-3"
                >
                  {item.label}
                </Link>
               ))}
            </nav>
            <div className="mt-auto pt-8 flex flex-col gap-4">
               <button onClick={toggleTheme} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white">
                  {theme === 'light' ? <><Moon className="w-5 h-5" /> Modo Escuro</> : <><Sun className="w-5 h-5" /> Modo Claro</>}
               </button>
               {!user ? (
                 <Link to="/register" className="w-full bg-gray-900 dark:bg-[#F5821F] text-white p-5 rounded-2xl font-black text-center block uppercase tracking-widest">Anunciar Grátis</Link>
               ) : (
                 <Link to="/dashboard" className="w-full bg-[#F5821F] text-white p-5 rounded-2xl font-black text-center block uppercase tracking-widest">Meu Painel</Link>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
