
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Store, LogOut, PlusCircle, User as UserIcon, MapPin, Search, ShoppingBag, Grid } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Effect to handle navbar styling on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  // Function to scroll to sections on Home
  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      // If not on home, just let the link handle navigation (needs implementation if critical)
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Top Bar */}
      <div className="bg-gray-900 text-gray-300 text-xs py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 text-indigo-400" />
            <span>Encontre negócios locais perto de você</span>
          </div>
          <div className="flex gap-4">
             <Link to="/help" className="hover:text-white transition-colors">Ajuda</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 border-b ${
          scrolled ? 'bg-white/95 backdrop-blur-md border-gray-200 shadow-sm py-2' : 'bg-white border-gray-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300">
                   <Store className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-xl text-gray-900 tracking-tight leading-none">Menu <span className="text-indigo-600">ADS</span></span>
                  <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">Classificados</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link to="/" className={`text-base font-bold transition-colors hover:text-indigo-700 ${isActive('/') ? 'text-indigo-700' : 'text-gray-800'}`}>
                Início
              </Link>
              <Link to="/stores" className={`text-base font-bold transition-colors hover:text-indigo-700 ${isActive('/stores') ? 'text-indigo-700' : 'text-gray-800'}`}>
                Lojas
              </Link>
              <Link to="/marketplace" className={`text-base font-bold transition-colors hover:text-indigo-700 ${isActive('/marketplace') ? 'text-indigo-700' : 'text-gray-800'}`}>
                Marketplace
              </Link>
              <Link to="/categories" className={`text-base font-bold transition-colors hover:text-indigo-700 ${isActive('/categories') ? 'text-indigo-700' : 'text-gray-800'}`}>
                Categorias
              </Link>
              <Link to="/blog" className={`text-base font-bold transition-colors hover:text-indigo-700 ${isActive('/blog') ? 'text-indigo-700' : 'text-gray-800'}`}>
                Blog
              </Link>
              
              {/* Business Area Links */}
              {user && (
                <>
                  <Link to="/catalog" className={`text-base font-bold transition-colors hover:text-indigo-700 flex items-center gap-1 ${isActive('/catalog') ? 'text-indigo-700' : 'text-gray-800'}`}>
                    <ShoppingBag className="w-4 h-4" /> Minha Loja
                  </Link>
                  <Link to="/dashboard" className={`text-base font-bold transition-colors hover:text-indigo-700 ${isActive('/dashboard') ? 'text-indigo-700' : 'text-gray-800'}`}>
                    Painel
                  </Link>
                </>
              )}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                      {user.name.charAt(0)}
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Sair"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all">
                    <UserIcon className="w-4 h-4" />
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                  >
                    Cadastrar Negócio
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl z-50">
            <div className="pt-2 pb-3 space-y-1 px-4">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-lg text-base font-bold text-gray-800 hover:bg-gray-50">Início</Link>
              <Link to="/stores" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-lg text-base font-bold text-gray-800 hover:bg-gray-50">Lojas</Link>
              <Link to="/marketplace" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-lg text-base font-bold text-gray-800 hover:bg-gray-50">Marketplace</Link>
              <Link to="/categories" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-lg text-base font-bold text-gray-800 hover:bg-gray-50">Categorias</Link>
              <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 rounded-lg text-base font-bold text-gray-800 hover:bg-gray-50">Blog</Link>
            </div>
            
            <div className="pt-4 pb-6 border-t border-gray-100 px-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                      {user.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-bold text-gray-800">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <Link
                    to="/catalog"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-3 border border-gray-200 text-base font-bold rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <ShoppingBag className="w-4 h-4 inline mr-2" /> Minha Loja
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-md"
                  >
                    Área de Negócios
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-center px-4 py-3 border border-gray-200 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-3 border border-gray-200 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 shadow-lg"
                  >
                    Cadastrar Negócio
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>
      
      {/* Improved Footer */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                 <div className="p-2 rounded-lg bg-indigo-600">
                   <Store className="h-5 w-5 text-white" />
                 </div>
                 <span className="font-bold text-xl text-gray-900">Menu ADS</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                A plataforma completa para conectar consumidores a negócios locais. Encontre o que precisa, perto de você.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Explore</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link to="/stores" className="hover:text-indigo-600">Lojas Parceiras</Link></li>
                <li><Link to="/marketplace" className="hover:text-indigo-600">Marketplace</Link></li>
                <li><Link to="/categories" className="hover:text-indigo-600">Categorias</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Negócios</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link to="/register" className="hover:text-indigo-600">Cadastrar Empresa</Link></li>
                <li><Link to="/plans" className="hover:text-indigo-600">Planos de Divulgação</Link></li>
                <li><Link to="/login" className="hover:text-indigo-600">Área do Parceiro</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4">Faça parte</h4>
              <Link to="/register" className="block w-full bg-gray-900 text-white text-center py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors mb-2">
                Cadastrar Grátis
              </Link>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Menu ADS Classificados. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
