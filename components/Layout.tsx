
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Store, LogOut, User as UserIcon, MapPin, Search, ShoppingBag, ArrowRight, Calendar } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  // Itens de navegação reorganizados: Lojas removido
  const navItems = [
    { label: 'Início', path: '/' },
    { label: 'Quem Somos', path: '/quem-somos' },
    { label: 'Parceiros', path: '/partners' },
    { label: 'Marketplace', path: '/marketplace' },
    { label: 'Eventos', path: '/eventos' },
    { label: 'Blog', path: '/blog' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Premium Navbar */}
      <header 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled 
          ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 py-3 shadow-sm' 
          : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-300">
               <Store className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl text-gray-900 tracking-tighter leading-none">MENU<span className="text-indigo-600">ADS</span></span>
              <span className="text-[9px] text-gray-400 font-bold tracking-[0.2em] uppercase">Connect Local</span>
            </div>
          </Link>

          {/* Desktop Nav - text-base size and mixed case */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item) => (
              <Link 
                key={item.label}
                to={item.path} 
                className={`text-base font-bold tracking-tight transition-all hover:text-indigo-600 ${isActive(item.path) ? 'text-indigo-600' : 'text-gray-500'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-4 bg-gray-50 p-1.5 pr-4 rounded-full border border-gray-100">
                <Link to="/profile" className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-black">
                  {user.name.charAt(0)}
                </Link>
                <Link to="/dashboard" className="text-xs font-black text-gray-900 uppercase tracking-widest hover:text-indigo-600 transition-colors">Painel</Link>
                <button onClick={logout} className="text-gray-400 hover:text-rose-500 transition-colors"><LogOut className="w-4 h-4" /></button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-base font-bold text-gray-900 px-5 py-2 hover:text-indigo-600 transition-colors">Entrar</Link>
                <Link to="/register" className="bg-gray-900 text-white text-xs font-black px-6 py-3 rounded-full uppercase tracking-widest hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20 transition-all active:scale-95">
                  Anunciar Grátis
                </Link>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-gray-900"><Menu className="w-6 h-6" /></button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full pt-20">
        {children}
      </main>

      {/* Premium Footer */}
      <footer className="bg-gray-950 text-white pt-24 pb-12 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-1 md:col-span-1 space-y-6">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black">
                   <Store className="h-5 w-5" />
                </div>
                <span className="font-black text-2xl tracking-tighter">MENUADS</span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                Elevando a conexão entre negócios locais e consumidores através de tecnologia inteligente e design funcional.
              </p>
            </div>
            
            <div>
              <h4 className="font-black text-xs uppercase tracking-[0.2em] text-gray-500 mb-8">Navegação</h4>
              <ul className="space-y-4 text-sm font-bold text-gray-300">
                <li><Link to="/marketplace" className="hover:text-indigo-400 transition-colors">Catálogo de Produtos</Link></li>
                <li><Link to="/eventos" className="hover:text-indigo-400 transition-colors">Eventos & Experiências</Link></li>
                <li><Link to="/blog" className="hover:text-indigo-400 transition-colors">Insights & Dicas</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-xs uppercase tracking-[0.2em] text-gray-500 mb-8">Empresa</h4>
              <ul className="space-y-4 text-sm font-bold text-gray-300">
                <li><Link to="/quem-somos" className="hover:text-indigo-400 transition-colors">Quem Somos</Link></li>
                <li><Link to="/partners" className="hover:text-indigo-400 transition-colors">Nossos Parceiros</Link></li>
                <li><Link to="/plans" className="hover:text-indigo-400 transition-colors">Planos Pro</Link></li>
                <li><Link to="/help" className="hover:text-indigo-400 transition-colors">Central de Ajuda</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="font-black text-xs uppercase tracking-[0.2em] text-gray-500">Comece Hoje</h4>
              <Link to="/register" className="group flex items-center justify-between bg-white text-black p-4 rounded-2xl font-black text-sm transition-all hover:bg-indigo-500 hover:text-white">
                CADASTRAR NEGÓCIO
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest text-center">Inicie seu plano gratuito agora</p>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              &copy; {new Date().getFullYear()} MENU ADS. Inteligência para Negócios Locais.
            </p>
            <div className="flex gap-8 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-white">Privacidade</a>
              <a href="#" className="hover:text-white">Termos</a>
            </div>
          </div>
        </div>
        {/* Footer Deco */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -mr-48 -mt-48"></div>
      </footer>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-[80%] bg-white p-8 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-12">
               <span className="font-black text-xl tracking-tighter">MENUADS</span>
               <button onClick={() => setIsMobileMenuOpen(false)}><X className="w-8 h-8 text-gray-400" /></button>
            </div>
            <nav className="flex flex-col gap-4">
               {navItems.map((item) => (
                 <Link 
                  key={item.label} 
                  to={item.path} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-3"
                >
                  {item.label}
                </Link>
               ))}
               <Link to="/plans" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-3">Planos</Link>
            </nav>
            <div className="mt-auto pt-8">
               {!user ? (
                 <Link to="/register" className="w-full bg-gray-900 text-white p-5 rounded-2xl font-black text-center block uppercase tracking-widest">Anunciar Grátis</Link>
               ) : (
                 <Link to="/dashboard" className="w-full bg-indigo-600 text-white p-5 rounded-2xl font-black text-center block uppercase tracking-widest">Meu Painel</Link>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
