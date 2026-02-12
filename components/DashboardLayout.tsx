
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, Smartphone, Package, 
  Sparkles, Trophy, LogOut, Menu, X, Star, Layout, 
  Store, Home, ShoppingBag, ChevronLeft, Briefcase,
  GraduationCap
} from 'lucide-react';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  if (!user) return null;

  const menuItems = [
    { label: 'Visão Geral', icon: LayoutDashboard, to: '/dashboard', color: 'text-indigo-600' },
    { label: 'Business Suite', icon: Briefcase, to: '/business-suite', color: 'text-blue-700' },
    { label: 'Menu Academy', icon: GraduationCap, to: '/academy', color: 'text-amber-600' },
    { label: 'Bio Digital', icon: Smartphone, to: '/bio-builder', color: 'text-purple-600' },
    { label: 'Catálogo & Loja', icon: Package, to: '/catalog', color: 'text-cyan-600' },
    { label: 'MenuIA Criativo', icon: Sparkles, to: '/marketing-ai', color: 'text-indigo-500' },
    { label: 'Clube de Vantagens', icon: Trophy, to: '/rewards', color: 'text-yellow-600' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* SIDEBAR (Desktop) */}
      <aside 
        className={`hidden lg:flex flex-col bg-white border-r border-gray-200 h-full flex-shrink-0 transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-4">
          {/* Logo & Toggle Section */}
          <div className={`flex items-center mb-8 transition-all ${isExpanded ? 'justify-between px-2' : 'justify-center'}`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 flex-shrink-0">
                 <Layout className="w-5 h-5" />
              </div>
              {isExpanded && (
                <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                  <h2 className="font-black text-gray-900 leading-none text-base tracking-tight">Painel Pro</h2>
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest mt-1 whitespace-nowrap">Menu ADS v2.0</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-1.5 rounded-lg border border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-indigo-600 transition-colors ${!isExpanded ? 'hidden' : ''}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <nav className="space-y-1">
            <p className={`px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 truncate ${!isExpanded ? 'text-center px-0' : ''}`}>
              {isExpanded ? 'Administração' : '...'}
            </p>
            
            {!isExpanded && (
              <button 
                onClick={() => setIsExpanded(true)}
                className="w-full flex items-center justify-center p-3 mb-2 rounded-xl text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                title="Expandir Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                title={!isExpanded ? item.label : undefined}
                className={`flex items-center rounded-xl transition-all group overflow-hidden ${
                  isActive(item.to) 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                } ${isExpanded ? 'px-4 py-3 gap-3' : 'p-3 justify-center'}`}
              >
                <item.icon className={`w-5 h-5 transition-colors flex-shrink-0 ${isActive(item.to) ? item.color : 'text-gray-400 group-hover:text-gray-600'}`} />
                {isExpanded && <span className="animate-in fade-in slide-in-from-left-2 duration-300 whitespace-nowrap text-sm font-bold tracking-tight">{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 space-y-3">
          {isExpanded ? (
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden group cursor-pointer animate-in zoom-in-95 duration-300" onClick={() => window.location.hash = '#/rewards'}>
               <div className="relative z-10">
                  <p className="text-[10px] font-bold opacity-80 mb-1 tracking-tight">Status da Conta</p>
                  <h4 className="font-black text-sm flex items-center gap-1.5">
                     <Star className="w-3 h-3 text-yellow-300 fill-current" />
                     {user.level.charAt(0).toUpperCase() + user.level.slice(1)}
                  </h4>
               </div>
               <div className="absolute -right-3 -bottom-3 opacity-10 group-hover:scale-110 transition-transform">
                  <Trophy className="w-14 h-14" />
               </div>
            </div>
          ) : (
            <button 
              onClick={() => window.location.hash = '#/rewards'}
              className="w-full flex items-center justify-center p-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-colors"
              title={`Nível: ${user.level}`}
            >
              <Trophy className="w-5 h-5" />
            </button>
          )}
          
          <button 
            onClick={logout}
            className={`flex items-center rounded-xl font-bold text-sm text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-all ${isExpanded ? 'px-4 py-3 gap-3 w-full' : 'p-3 justify-center w-full'}`}
            title="Encerrar Sessão"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isExpanded && <span className="animate-in fade-in slide-in-from-left-1 duration-300">Sair da conta</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white border-b border-gray-200 px-4 lg:px-8 flex justify-between items-center sticky top-0 z-30 flex-shrink-0">
           <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 bg-gray-50 rounded-lg text-gray-600 lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                  <Home className="w-4 h-4" /> Início
                </Link>
                <Link to="/stores" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                  <Store className="w-4 h-4" /> Lojas
                </Link>
                <Link to="/marketplace" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                   <ShoppingBag className="w-4 h-4" /> Marketplace
                </Link>
              </nav>

              <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

              <span className="font-black text-gray-900 text-sm tracking-tight">
                {menuItems.find(i => isActive(i.to))?.label || 'Painel'}
              </span>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                 <span className="text-[11px] font-black text-gray-900 leading-none">{user.name}</span>
                 <span className="text-[10px] text-indigo-600 font-bold tracking-tight mt-0.5">{user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}</span>
              </div>
              <Link to="/profile" className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-black border-2 border-white shadow-sm hover:scale-105 transition-transform">
                {user.name.charAt(0)}
              </Link>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto scroll-smooth flex flex-col">
          <div className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </div>

          <footer className="bg-white border-t border-gray-200 py-10 px-8 mt-auto">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-2 grayscale opacity-60">
                 <div className="p-2 rounded-lg bg-indigo-600 text-white">
                   <Store className="h-4 w-4" />
                 </div>
                 <span className="font-bold text-lg text-gray-900">Menu ADS</span>
              </div>
              
              <div className="flex gap-8 text-xs font-bold text-gray-400 tracking-widest uppercase">
                <Link to="/help" className="hover:text-indigo-600 transition-colors">Ajuda</Link>
                <Link to="/plans" className="hover:text-indigo-600 transition-colors">Planos</Link>
                <Link to="/blog" className="hover:text-indigo-600 transition-colors">Blog</Link>
              </div>

              <p className="text-[11px] text-gray-400 font-medium">
                &copy; {new Date().getFullYear()} Menu ADS. Painel de Gestão para Negócios Locais.
              </p>
            </div>
          </footer>
        </div>
      </main>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden animate-fade-in">
           <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
           <aside className="absolute top-0 left-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col animate-slide-in-left">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                       <Layout className="w-5 h-5" />
                    </div>
                    <span className="font-black text-gray-900 tracking-tighter">Menu ADS</span>
                 </div>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400"><X className="w-6 h-6" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                 <div className="mb-4 space-y-1">
                    <p className="px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Site Principal</p>
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50"><Home className="w-5 h-5" /> Início</Link>
                    <Link to="/stores" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50"><Store className="w-5 h-5" /> Lojas</Link>
                    <Link to="/marketplace" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50"><ShoppingBag className="w-5 h-5" /> Marketplace</Link>
                 </div>

                 <div className="h-px bg-gray-100 my-4 mx-3"></div>

                 <p className="px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Gestão</p>
                 {menuItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                        isActive(item.to) ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-bold">{item.label}</span>
                    </Link>
                 ))}
              </div>

              <div className="p-4 border-t border-gray-100">
                 <button 
                  onClick={logout}
                  className="flex items-center justify-center gap-3 w-full p-4 bg-rose-50 text-rose-600 rounded-xl font-black text-xs uppercase tracking-widest"
                 >
                   <LogOut className="w-4 h-4" /> Sair da conta
                 </button>
              </div>
           </aside>
        </div>
      )}
    </div>
  );
};
