
import React, { useEffect, useState } from 'react';
import { mockBackend } from '../services/mockBackend';
import { Offer, OfferCategory } from '../types';
import { OfferCard } from '../components/OfferCard';
import { Search, MapPin, Filter, Utensils, ShoppingBag, Wrench, Calendar, Coffee, ArrowRight, Zap, Shield, TrendingUp, Search as SearchIcon, Navigation, UserCheck, Briefcase, Heart, Home as HomeIcon, Handshake } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    category: ''
  });

  useEffect(() => {
    loadOffers();
  }, [filters]);

  const loadOffers = async () => {
    setIsLoading(true);
    try {
      const data = await mockBackend.getOffers(filters);
      setOffers(data);
    } catch (error) {
      console.error('Failed to load offers', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleNearMe = () => {
    if (navigator.geolocation) {
       // Mock geolocation logic - just fills the city input for demo
       setFilters(prev => ({ ...prev, city: 'São Paulo' }));
       alert('Localização simulada: São Paulo');
    } else {
      alert("Geolocalização não suportada.");
    }
  };

  // Mapped categories for the specific layout requested
  const displayCategories = [
    { 
      title: 'Serviços Profissionais', 
      desc: 'Marketing, Jurídico, TI...',
      filterValue: OfferCategory.SERVICOS_PROFISSIONAIS, 
      icon: Briefcase, 
      color: 'bg-blue-100 text-blue-600' 
    },
    { 
      title: 'Negócios Locais', 
      desc: 'Restaurantes, Lojas, Salões...',
      filterValue: OfferCategory.NEGOCIOS_LOCAIS, 
      icon: ShoppingBag, 
      color: 'bg-green-100 text-green-600' 
    },
    { 
      title: 'Saúde e Bem-estar', 
      desc: 'Terapias, Yoga, Nutrição...',
      filterValue: OfferCategory.SAUDE_BEM_ESTAR, 
      icon: Heart, 
      color: 'bg-pink-100 text-pink-600' 
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION - Buscar Serviços */}
      <div className="relative bg-gray-900 pt-16 pb-24 px-4 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1449824913929-49aa71156609?auto=format&fit=crop&q=80&w=2000" 
            alt="City Background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/80 to-gray-50"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto text-center space-y-8 mt-10">
          <div className="space-y-4 animate-[fade-in-up_0.6s_ease-out]">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Encontre o que precisa, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">perto de você.</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              A melhor forma de conectar clientes e negócios locais com inteligência.
            </p>
          </div>

          {/* Search Bar - Categorias, Bairro/Cidade, Perto de Mim */}
          <div className="bg-white p-3 rounded-2xl shadow-2xl max-w-4xl mx-auto transform translate-y-4 animate-[fade-in-up_0.8s_ease-out]">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="O que você procura? (Ex: Pintor, Bolo...)"
                  className="block w-full pl-10 pr-4 py-3 border-none rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-colors"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>

              <div className="flex-1 relative group">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Bairro ou Cidade"
                  className="block w-full pl-10 pr-4 py-3 border-none rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-colors"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={handleNearMe}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap"
                  title="Perto de Mim"
                >
                  <Navigation className="w-4 h-4" /> 
                  <span className="hidden sm:inline">Perto</span>
                </button>
                <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2">
                  <SearchIcon className="w-4 h-4" /> Buscar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-20 pt-12 space-y-20">
        
        {/* 2. CATEGORIES SECTION */}
        <section id="categories" className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Navegue por Categorias</h2>
            <p className="text-gray-500 mt-2">Encontre exatamente o que você precisa.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayCategories.map((cat) => (
              <button
                key={cat.title}
                onClick={() => handleFilterChange('category', cat.filterValue)}
                className={`flex flex-col items-center p-8 rounded-2xl border transition-all group hover:-translate-y-1 ${
                  filters.category === cat.filterValue 
                  ? 'bg-indigo-50 border-indigo-200 shadow-md' 
                  : 'bg-white border-gray-200 hover:border-indigo-100 hover:shadow-lg'
                }`}
              >
                <div className={`p-4 rounded-full mb-4 ${cat.color} group-hover:scale-110 transition-transform`}>
                  <cat.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{cat.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{cat.desc}</p>
              </button>
            ))}
          </div>
          
          <div className="text-center mt-6">
             <Link to="/categories" className="inline-flex items-center text-indigo-600 font-bold hover:underline gap-1">
               Ver todas as categorias <ArrowRight className="w-4 h-4" />
             </Link>
          </div>
        </section>

        {/* 3. CLASSIFIEDS FEED */}
        <section>
           <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-indigo-600 rounded-full"></div>
                Destaques Recentes
              </h2>
           </div>

           {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white h-[400px] rounded-2xl border border-gray-200 animate-pulse"></div>
              ))}
            </div>
          ) : offers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {offers.map(offer => (
                <div key={offer.id} className="hover:z-10 transition-all duration-300">
                   <OfferCard offer={offer} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-300">
              <p className="text-gray-500">Nenhum anúncio encontrado com os filtros atuais.</p>
              <button 
                onClick={() => setFilters({ search: '', city: '', category: '' })}
                className="mt-4 text-indigo-600 font-bold hover:underline"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </section>

        {/* 4. HOW IT WORKS */}
        <section id="how-it-works" className="bg-white rounded-3xl p-8 md:p-16 border border-gray-200 shadow-sm">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-bold text-gray-900">Como Funciona o Menu ADS</h2>
             <p className="text-gray-500 mt-2">Uma plataforma simples impulsionada por IA.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connector Lines (Desktop only) */}
              <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-200 -z-10"></div>

              <div className="flex flex-col items-center text-center">
                 <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm text-indigo-600 font-bold text-2xl">1</div>
                 <h3 className="text-xl font-bold mb-3">Busque Localmente</h3>
                 <p className="text-gray-500 text-sm leading-relaxed">
                   Encontre serviços profissionais, negócios locais e oportunidades na sua região.
                 </p>
              </div>

              <div className="flex flex-col items-center text-center">
                 <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm text-indigo-600 font-bold text-2xl">2</div>
                 <h3 className="text-xl font-bold mb-3">IA Qualifica</h3>
                 <p className="text-gray-500 text-sm leading-relaxed">
                   Nossa IA atua como um SDR, filtrando leads e conectando você apenas com as melhores oportunidades.
                 </p>
              </div>

              <div className="flex flex-col items-center text-center">
                 <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm text-indigo-600 font-bold text-2xl">3</div>
                 <h3 className="text-xl font-bold mb-3">Feche Negócios</h3>
                 <p className="text-gray-500 text-sm leading-relaxed">
                   Fale diretamente pelo WhatsApp. Eu anuncio, a IA filtra, você fecha.
                 </p>
              </div>
           </div>
        </section>

        {/* 5. PARTNER CTA */}
        <section className="bg-gray-900 rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="relative z-10 max-w-xl">
              <span className="text-indigo-400 font-bold tracking-wide uppercase text-xs mb-2 block">Para Negócios</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                Seja um Negócio Parceiro
              </h2>
              <p className="text-gray-400 mb-8">
                Comece com o plano Essencial e escale suas vendas com nossa inteligência artificial.
              </p>
              <div className="flex gap-4">
                 <Link to="/register" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all">
                    Começar Agora
                 </Link>
                 <Link to="/plans" className="px-6 py-3 bg-transparent border border-gray-700 text-white font-bold rounded-xl hover:bg-gray-800 transition-all">
                    Ver Planos
                 </Link>
              </div>
           </div>
           
           <div className="relative z-10">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 max-w-xs">
                 <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-green-500 rounded-lg text-white"><TrendingUp className="w-5 h-5" /></div>
                   <div className="text-white">
                     <p className="text-xs opacity-70">Resultados</p>
                     <p className="font-bold">+150% Visibilidade</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-500 rounded-lg text-white"><UserCheck className="w-5 h-5" /></div>
                   <div className="text-white">
                     <p className="text-xs opacity-70">Novos Leads</p>
                     <p className="font-bold">Qualificados por IA</p>
                   </div>
                 </div>
              </div>
           </div>
           
           {/* Abstract BG */}
           <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-indigo-900/50 to-transparent pointer-events-none"></div>
        </section>

      </div>
    </div>
  );
};
