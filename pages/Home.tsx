
import React, { useEffect, useState } from 'react';
import { mockBackend } from '../services/mockBackend';
import { Offer, OfferCategory } from '../types';
import { OfferCard } from '../components/OfferCard';
import { Search, MapPin, ArrowRight, Zap, Shield, TrendingUp, Navigation, Briefcase, ShoppingBag, Heart, Home as HomeIcon, Check, Star, Users, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', city: '', category: '' });

  useEffect(() => { loadOffers(); }, [filters]);

  const loadOffers = async () => {
    setIsLoading(true);
    try {
      const data = await mockBackend.getOffers(filters);
      setOffers(data);
    } catch (error) { console.error('Failed to load offers', error); } finally { setIsLoading(false); }
  };

  const handleNearMe = () => {
     setFilters(prev => ({ ...prev, city: 'Sua Região' }));
     alert('Localização ativada: Mostrando negócios próximos.');
  };

  const categories = [
    { title: 'Serviços', val: OfferCategory.SERVICOS_PROFISSIONAIS, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Negócios', val: OfferCategory.NEGOCIOS_LOCAIS, icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Saúde', val: OfferCategory.SAUDE_BEM_ESTAR, icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
    { title: 'Imóveis', val: OfferCategory.IMOVEIS_SERVICOS, icon: HomeIcon, color: 'text-amber-600', bg: 'bg-amber-50' }
  ];

  return (
    <div className="flex flex-col w-full">
      
      {/* 1. HERO SECTION - ULTRA MODERN */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-32 px-6 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[150px] -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4"></div>

        <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100/50">
               <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
               <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Lançamento v2.0 Dashboard</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.9]">
              Conexões <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">Locais Reais.</span>
            </h1>
            
            <p className="text-xl text-gray-500 max-w-lg font-medium leading-relaxed">
              A maior vitrine digital para freelancers e negócios locais. Encontre talentos, produtos e oportunidades no seu bairro.
            </p>

            {/* Premium Search Box */}
            <div className="glass-card p-2 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row gap-2 max-w-2xl border border-gray-200/50">
               <div className="flex-1 relative flex items-center px-6">
                  <Search className="w-5 h-5 text-gray-400 absolute left-6" />
                  <input 
                    type="text" 
                    placeholder="O que você precisa?" 
                    className="w-full bg-transparent border-none p-4 pl-8 font-bold text-gray-900 focus:ring-0 placeholder:text-gray-400"
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                  />
               </div>
               <div className="w-px h-10 bg-gray-200 hidden md:block self-center"></div>
               <div className="flex-1 relative flex items-center px-6">
                  <MapPin className="w-5 h-5 text-gray-400 absolute left-6" />
                  <input 
                    type="text" 
                    placeholder="Bairro ou Cidade" 
                    className="w-full bg-transparent border-none p-4 pl-8 font-bold text-gray-900 focus:ring-0 placeholder:text-gray-400"
                    value={filters.city}
                    onChange={(e) => setFilters({...filters, city: e.target.value})}
                  />
               </div>
               <button className="bg-gray-900 text-white px-10 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95">
                  Buscar
               </button>
            </div>

            <div className="flex items-center gap-8 pt-4">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-gray-100 overflow-hidden">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} className="w-full h-full object-cover" alt="user" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-4 border-white bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white">+500</div>
               </div>
               <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Negócios ativos esta semana</p>
            </div>
          </div>

          <div className="hidden lg:block relative animate-in zoom-in fade-in duration-1000 delay-300">
             <div className="relative z-10 w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200" 
                  className="w-full h-full object-cover" 
                  alt="Business Meeting" 
                />
                <div className="absolute inset-0 bg-indigo-900/20 mix-blend-overlay"></div>
             </div>
             {/* Floating Bento Card */}
             <div className="absolute -bottom-10 -left-10 dark-glass-card p-8 rounded-[2rem] shadow-2xl z-20 animate-float max-w-xs">
                <div className="flex items-center gap-4 mb-6">
                   <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400"><TrendingUp className="w-6 h-6" /></div>
                   <h4 className="text-white font-black text-sm uppercase tracking-widest">Crescimento</h4>
                </div>
                <p className="text-indigo-100/70 text-sm font-medium leading-relaxed">
                   Sua empresa com mais visibilidade local e leads qualificados por inteligência artificial.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* 2. BENTO CATEGORIES */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
             <div className="space-y-4">
                <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">O que você busca?</h2>
                <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">Navegue por Categorias</h3>
             </div>
             <Link to="/categories" className="flex items-center gap-3 font-black text-xs uppercase tracking-widest text-gray-400 hover:text-indigo-600 transition-colors group">
                Ver Tudo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setFilters({...filters, category: cat.val})}
                className={`group relative p-10 rounded-[2.5rem] border border-gray-100 transition-all text-left overflow-hidden ${filters.category === cat.val ? 'bg-gray-900 text-white shadow-2xl' : 'bg-gray-50 hover:bg-white hover:shadow-xl hover:border-indigo-100'}`}
              >
                <div className={`w-14 h-14 rounded-2xl ${cat.bg} ${cat.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                   <cat.icon className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-black mb-2">{cat.title}</h4>
                <p className={`text-sm font-medium ${filters.category === cat.val ? 'text-gray-400' : 'text-gray-500'}`}>Negócios verificados</p>
                <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                   <cat.icon className="w-32 h-32" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PREMIUM FEED SECTION */}
      <section className="py-32 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-16">
             <div className="w-2 h-10 bg-indigo-600 rounded-full"></div>
             <h3 className="text-3xl font-black text-gray-900 tracking-tighter">Destaques da Comunidade</h3>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white/50 h-[450px] rounded-[2.5rem] border border-gray-200 animate-pulse"></div>
              ))}
            </div>
          ) : offers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {offers.map(offer => (
                <div key={offer.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                   <OfferCard offer={offer} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200 shadow-sm">
               <Users className="w-16 h-16 text-gray-200 mx-auto mb-6" />
               <h4 className="text-xl font-black text-gray-900">Nada encontrado</h4>
               <p className="text-gray-400 font-medium mb-8">Tente ajustar seus filtros de busca.</p>
               <button onClick={() => setFilters({search: '', city: '', category: ''})} className="px-8 py-3 bg-gray-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">Limpar Tudo</button>
            </div>
          )}
        </div>
      </section>

      {/* 4. PREMIUM CTA - GLASSMORPHISM */}
      <section className="py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-gray-900 rounded-[4rem] p-12 md:p-24 text-center overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)]">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
             <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px]"></div>
             <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>
             
             <div className="relative z-10 max-w-3xl mx-auto space-y-12">
                <div className="inline-flex p-4 rounded-3xl bg-white/5 border border-white/10 text-indigo-400 mb-6">
                   <Zap className="w-10 h-10 fill-current" />
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                  Pronto para escalar sua <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Presença Local?</span>
                </h2>
                <p className="text-xl text-gray-400 font-medium leading-relaxed">
                  Não cobramos comissões sobre suas vendas. Fornecemos as ferramentas e a visibilidade para você fechar negócios direto no WhatsApp.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-8">
                   <Link to="/register" className="w-full sm:w-auto bg-white text-black px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">
                      CADASTRAR GRÁTIS
                   </Link>
                   <Link to="/plans" className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/10 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all">
                      VER PLANOS PRO
                   </Link>
                </div>
                
                <div className="flex flex-wrap justify-center gap-10 pt-16">
                   {[
                     { label: 'Visibilidade Local', icon: Star },
                     { label: 'Leads por IA', icon: Zap },
                     { label: 'Sem Comissões', icon: Shield }
                   ].map((feat, i) => (
                     <div key={i} className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                        <feat.icon className="w-4 h-4 text-indigo-500" /> {feat.label}
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

    </div>
  );
};
