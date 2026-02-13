
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, Smartphone, Package, 
  Trophy, LogOut, Menu, X, Star, Layout, 
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
    { label: 'Visão Geral', icon: LayoutDashboard, to: '/dashboard', color: 'text-gray-900' },
    { label: 'Bio Digital', icon: Smartphone, to: '/bio-builder', color: 'text-purple-600' },
    { label: 'Catálogo & Loja', icon: Package, to: '/catalog', color: 'text-emerald-600' },
    { label: 'Business Suite', icon: Briefcase, to: '/business-suite', color: 'text-blue-700' },
    { label: 'Menu Academy', icon: GraduationCap, to: '/academy', color: 'text-amber-600' },
    { label: 'Clube de Vantagens', icon: Trophy, to: '/rewards', color: 'text-indigo-600' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* SIDEBAR (Desktop) */}
      <aside 
        className={`hidden lg:flex flex-col bg-white border-r border-gray-200 h-full flex-shrink-0 transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-72' : 'w-20'
        }`}
      >
        <div className="p-5">
          {/* Logo & Toggle Section */}
          <div className={`flex items-center mb-10 transition-all ${isExpanded ? 'justify-between px-2' : 'justify-center'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                 <Layout className="w-5 h-5" />
              </div>
              {isExpanded && (
                <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                  <h2 className="font-black text-gray-900 leading-none text-base tracking-tighter">Menu <span className="text-indigo-600">Ads</span></h2>
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest mt-1 whitespace-nowrap uppercase">BUSINESS HUB</p>
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

          <nav className="space-y-1.5">
            {!isExpanded && (
              <button 
                onClick={() => setIsExpanded(true)}
                className="w-full flex items-center justify-center p-3 mb-4 rounded-xl text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
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
                className={`flex items-center rounded-2xl transition-all group overflow-hidden ${
                  isActive(item.to) 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                } ${isExpanded ? 'px-4 py-3.5 gap-4' : 'p-3.5 justify-center'}`}
              >
                <item.icon className={`w-5 h-5 transition-colors flex-shrink-0 ${isActive(item.to) ? item.color : 'text-gray-400 group-hover:text-gray-600'}`} />
                {isExpanded && <span className="animate-in fade-in slide-in-from-left-2 duration-300 whitespace-nowrap text-sm font-black tracking-tight">{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-5 space-y-4">
          {isExpanded ? (
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[2rem] p-5 text-white shadow-xl relative overflow-hidden group cursor-pointer" onClick={() => window.location.hash = '#/rewards'}>
               <div className="relative z-10">
                  <p className="text-[10px] font-black opacity-60 mb-1 tracking-widest uppercase">Nível atual</p>
                  <h4 className="font-black text-sm flex items-center gap-1.5">
                     <Star className="w-3.5 h-3.5 text-yellow-300 fill-current" />
                     {user.level.charAt(0).toUpperCase() + user.level.slice(1)}
                  </h4>
               </div>
               <div className="absolute -right-3 -bottom-3 opacity-10 group-hover:scale-110 transition-transform">
                  <Trophy className="w-16 h-16" />
               </div>
            </div>
          ) : (
            <button 
              onClick={() => window.location.hash = '#/rewards'}
              className="w-full flex items-center justify-center p-3.5 bg-indigo-600 text-white rounded-2xl shadow-lg hover:bg-indigo-700 transition-colors"
              title={`Nível: ${user.level}`}
            >
              <Trophy className="w-5 h-5" />
            </button>
          )}
          
          <button 
            onClick={logout}
            className={`flex items-center rounded-2xl font-black text-[10px] tracking-widest text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-all ${isExpanded ? 'px-5 py-4 gap-4 w-full' : 'p-3.5 justify-center w-full'}`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isExpanded && <span className="animate-in fade-in slide-in-from-left-1 duration-300">Encerrar sessão</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-20 bg-white border-b border-gray-100 px-6 lg:px-10 flex justify-between items-center sticky top-0 z-30 flex-shrink-0">
           <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2.5 bg-gray-50 rounded-xl text-gray-600 lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <nav className="hidden md:flex items-center gap-8">
                <Link to="/" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 transition-colors">Início</Link>
                <Link to="/stores" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 transition-colors">Lojas</Link>
              </nav>

              <div className="h-6 w-px bg-gray-100 hidden md:block"></div>

              <span className="font-black text-gray-900 text-sm tracking-tight hidden sm:block">
                {menuItems.find(i => isActive(i.to))?.label || 'Painel'}
              </span>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col text-right">
                 <span className="text-[11px] font-black text-gray-900 leading-none">{user.name}</span>
                 <span className="text-[9px] text-indigo-600 font-black tracking-widest mt-1 uppercase">{user.plan}</span>
              </div>
              <Link to="/profile" className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-indigo-600 text-sm font-black border border-gray-200 hover:scale-105 transition-transform">
                {user.name.charAt(0)}
              </Link>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto scroll-smooth flex flex-col">
          <div className="flex-1 p-6 md:p-10">
            {children}
          </div>

          <footer className="bg-white border-t border-gray-100 py-10 px-10 mt-auto">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-2 grayscale opacity-40">
                 <Store className="h-5 w-5" />
                 <span className="font-black text-sm tracking-tighter uppercase">Menu Ads</span>
              </div>
              
              <div className="flex gap-10 text-[10px] font-black text-gray-400 tracking-widest uppercase">
                <Link to="/help" className="hover:text-indigo-600">Ajuda</Link>
                <Link to="/plans" className="hover:text-indigo-600">Upgrade</Link>
              </div>

              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                &copy; {new Date().getFullYear()} MENU ADS INC.
              </p>
            </div>
          </footer>
        </div>
      </main>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden animate-fade-in">
           <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
           <aside className="absolute top-0 left-0 bottom-0 w-[280px] bg-white shadow-2xl flex flex-col animate-slide-in-left">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                       <Layout className="w-5 h-5" />
                    </div>
                    <span className="font-black text-gray-900 tracking-tighter uppercase">MENU ADS</span>
                 </div>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400"><X className="w-6 h-6" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                 {menuItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                        isActive(item.to) ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-black tracking-tight">{item.label}</span>
                    </Link>
                 ))}
              </div>

              <div className="p-4 border-t border-gray-100">
                 <button 
                  onClick={logout}
                  className="flex items-center justify-center gap-3 w-full p-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest"
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
