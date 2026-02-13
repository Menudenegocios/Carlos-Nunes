
import React, { useEffect, useState } from 'react';
import { mockBackend } from '../services/mockBackend';
import { Offer, OfferCategory } from '../types';
import { OfferCard } from '../components/OfferCard';
import { Search, MapPin, ArrowRight, Zap, Shield, TrendingUp, Briefcase, ShoppingBag, Heart, Home as HomeIcon, Star, Users, LayoutGrid, Sparkles } from 'lucide-react';
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

  const categories = [
    { title: 'Serviços', val: OfferCategory.SERVICOS_PROFISSIONAIS, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Negócios', val: OfferCategory.NEGOCIOS_LOCAIS, icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Saúde', val: OfferCategory.SAUDE_BEM_ESTAR, icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
    { title: 'Imóveis', val: OfferCategory.IMOVEIS_SERVICOS, icon: HomeIcon, color: 'text-amber-600', bg: 'bg-amber-50' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-24 pb-32 pt-8 px-6">
      
      {/* 1. HERO SECTION (PARTNERS STYLE) */}
      <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">
           <Zap className="w-3 h-3" /> Conexão Local Inteligente
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none max-w-4xl mx-auto">
          Descubra o melhor do seu <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Bairro em um clique.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Conectamos você aos melhores talentos, produtos e serviços locais sem intermediários e sem taxas de comissão.
        </p>

        {/* Search Bar - Integrated in Hero Pattern */}
        <div className="max-w-3xl mx-auto bg-white p-3 rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col md:flex-row gap-2">
           <div className="flex-1 relative flex items-center px-4">
              <Search className="w-5 h-5 text-gray-400 absolute left-6" />
              <input 
                type="text" 
                placeholder="O que você busca?" 
                className="w-full bg-transparent border-none p-4 pl-10 font-bold text-gray-900 focus:ring-0 placeholder:text-gray-400"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
           </div>
           <div className="w-px h-10 bg-gray-100 hidden md:block self-center"></div>
           <div className="flex-1 relative flex items-center px-4">
              <MapPin className="w-5 h-5 text-gray-400 absolute left-6" />
              <input 
                type="text" 
                placeholder="Cidade ou Bairro" 
                className="w-full bg-transparent border-none p-4 pl-10 font-bold text-gray-900 focus:ring-0 placeholder:text-gray-400"
                value={filters.city}
                onChange={(e) => setFilters({...filters, city: e.target.value})}
              />
           </div>
           <button className="bg-gray-900 text-white px-10 py-4 rounded-[1.8rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl">
              BUSCAR AGORA
           </button>
        </div>
      </section>

      {/* 2. CATEGORIES GRID (BENTO STYLE) */}
      <section className="space-y-10">
        <div className="flex items-center justify-between px-4">
           <h2 className="text-3xl font-black text-gray-900 tracking-tight">Categorias em Destaque</h2>
           <Link to="/categories" className="text-indigo-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">VER TODAS <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setFilters({...filters, category: cat.val})}
              className={`group bg-white p-10 rounded-[3rem] border border-gray-100 shadow-lg flex flex-col items-center text-center space-y-6 hover:shadow-2xl hover:-translate-y-2 transition-all ${filters.category === cat.val ? 'ring-4 ring-indigo-50 border-indigo-200' : ''}`}
            >
              <div className={`w-16 h-16 rounded-[1.5rem] ${cat.bg} ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                 <cat.icon className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-black text-gray-900">{cat.title}</h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Negócios Verificados</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. COMMUNITY FEED (MATCHING PARTNERS BLOCK) */}
      <section className="bg-white rounded-[4rem] p-12 md:p-24 border border-gray-100 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative z-10">
           <div className="space-y-4">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Oportunidades do Dia</h2>
              <p className="text-gray-500 font-medium max-w-lg">Confira as últimas ofertas e serviços publicados por empreendedores locais perto de você.</p>
           </div>
           <button onClick={() => setFilters({search: '', city: '', category: ''})} className="px-8 py-3 bg-gray-100 text-gray-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all">LIMPAR FILTROS</button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-50 h-[450px] rounded-[3rem] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {offers.map(offer => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
        
        {/* Decor */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[80px] -mb-40 -mr-40"></div>
      </section>

      {/* 4. PREMIUM CTA (PARTNERS STYLE) */}
      <section className="bg-gray-900 rounded-[3.5rem] p-16 text-center text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Transforme seu negócio local hoje.</h2>
            <p className="text-gray-400 text-lg font-medium leading-relaxed">Junte-se a milhares de empreendedores que já estão vendendo mais usando nossa tecnologia sem pagar comissões.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
               <Link to="/register" className="bg-white text-gray-900 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-2xl active:scale-95">
                 CADASTRAR GRÁTIS
               </Link>
               <Link to="/plans" className="bg-white/10 text-white border border-white/20 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all">
                 VER PLANOS PRO
               </Link>
            </div>
         </div>
         <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
      </section>

    </div>
  );
};
