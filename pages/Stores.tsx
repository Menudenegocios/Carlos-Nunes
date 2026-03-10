
import React, { useEffect, useState } from 'react';
import { firebaseService } from '../services/firebaseService';
import { Profile } from '../types';
import { Link } from 'react-router-dom';
import { 
  Store, MapPin, Search, ArrowRight, Image as ImageIcon, 
  Sparkles, Star, Package,
  ChefHat, ShoppingBag, Wrench, Heart
} from 'lucide-react';

export const Stores: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const data = await firebaseService.getAllProfiles();
      // Mostra apenas lojas com nome definido
      setProfiles(data.filter(p => p.businessName));
    } finally {
      setIsLoading(false);
    }
  };

  const storeCategories = [
    { label: 'Todas', icon: Store },
    { label: 'Gastronomia', icon: ChefHat },
    { label: 'Varejo', icon: ShoppingBag },
    { label: 'Serviços', icon: Wrench },
    { label: 'Saúde', icon: Heart }
  ];

  const filteredProfiles = profiles.filter(p => {
    const matchesSearch = (p.businessName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (p.city?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Todas' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32 pt-8 px-6">
      
      {/* 1. HERO SECTION - MARKETPLACE STYLE */}
      <section className="text-center space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-brand-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-100 dark:border-indigo-800">
           <Sparkles className="w-3.5 h-3.5" /> Conexão Regional
        </div>
        <h1 className="text-5xl md:text-8xl font-black text-gray-900 dark:text-white tracking-tighter leading-[0.9] max-w-5xl mx-auto">
          A Vitrine de <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-brand-primary to-purple-600 dark:from-brand-primary dark:to-brand-accent italic">
            Negócios Locais.
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 dark:text-zinc-400 max-w-3xl mx-auto font-medium leading-relaxed">
          Explore e conecte-se com as melhores marcas, artesãos e prestadores do seu próprio bairro.
        </p>
        
        {/* Barra de Busca Estilizada */}
        <div className="max-w-3xl mx-auto relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-indigo-50 dark:bg-zinc-800 rounded-2xl text-indigo-600 dark:text-brand-primary group-focus-within:bg-indigo-600 group-focus-within:text-white transition-all">
                <Search className="w-6 h-6" />
            </div>
            <input 
               type="text" 
               placeholder="Pesquise por nome, cidade ou especialidade..." 
               className="w-full pl-20 pr-8 py-7 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[3rem] font-bold text-xl text-gray-900 dark:text-white focus:ring-[12px] focus:ring-indigo-50 dark:focus:ring-indigo-900/20 outline-none shadow-2xl transition-all placeholder:text-gray-300"
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
            />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-4 mt-12">
            {storeCategories.map((cat) => (
                <button 
                    key={cat.label}
                    onClick={() => setActiveCategory(cat.label)} 
                    className={`flex items-center gap-3 px-10 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all ${activeCategory === cat.label ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 scale-105' : 'bg-white dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border border-gray-100 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700'}`}
                >
                    <cat.icon className="w-4 h-4" /> {cat.label}
                </button>
            ))}
        </div>
      </section>

      {/* 2. STORES GRID */}
      <section className="min-h-[600px] pt-12">
        {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                {[1,2,3,4,5,6].map(i => <div key={i} className="bg-white dark:bg-zinc-900 rounded-[3.5rem] h-[500px] animate-pulse border border-gray-100 dark:border-zinc-800 shadow-sm"></div>)}
            </div>
        ) : filteredProfiles.length === 0 ? (
            <div className="text-center py-40 bg-white dark:bg-zinc-900 rounded-[5rem] border-2 border-dashed border-gray-100 dark:border-zinc-800 shadow-inner">
                <Store className="w-24 h-24 text-gray-100 dark:text-zinc-800 mx-auto mb-8" />
                <h3 className="text-3xl font-black text-gray-900 dark:text-white">Nenhum negócio no radar</h3>
                <p className="text-gray-500 dark:text-zinc-400 mt-4 font-medium text-lg">Tente ajustar sua busca ou escolher outra categoria.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                {filteredProfiles.map(profile => (
                    <Link 
                        to={`/store/${profile.userId}`} 
                        key={profile.id} 
                        className="group bg-white dark:bg-zinc-900 rounded-[3.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-4 transition-all duration-700 flex flex-col h-full"
                    >
                        {/* Capa de Impacto */}
                        <div className="h-48 bg-gray-200 dark:bg-zinc-800 relative overflow-hidden">
                            {profile.storeConfig?.coverUrl ? (
                                <img src={profile.storeConfig.coverUrl} alt="Cover" className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-1000" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-slate-900/40"></div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                            
                            <div className="absolute top-6 left-6 flex gap-2">
                                <div className="flex items-center gap-1.5 bg-white/95 dark:bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl text-indigo-600 dark:text-brand-primary text-[10px] font-black border border-white/40 dark:border-zinc-700 shadow-lg">
                                    <Star className="w-3.5 h-3.5 fill-current" /> VERIFICADO
                                </div>
                            </div>
                        </div>

                        {/* Conteúdo do Card */}
                        <div className="px-10 pb-10 pt-0 relative flex-1 flex flex-col">
                            <div className="flex justify-between items-end -mt-16 mb-8 relative z-10">
                                <div className="w-28 h-28 rounded-[2.5rem] border-[6px] border-white dark:border-zinc-900 bg-white dark:bg-zinc-800 shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                    {profile.logoUrl ? (
                                        <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-200">
                                            <ImageIcon className="w-12 h-12" />
                                        </div>
                                    )}
                                </div>
                                {profile.category && (
                                    <span className="bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary text-[10px] font-black px-6 py-2.5 rounded-2xl uppercase tracking-widest border border-brand-primary/20">
                                        {profile.category}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-4 flex-1">
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1 tracking-tighter">
                                    {profile.businessName}
                                </h3>
                                <div className="flex items-center text-gray-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-[0.1em]">
                                    <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg mr-2">
                                        <MapPin className="w-4 h-4 text-indigo-600 dark:text-brand-primary" />
                                    </div>
                                    {profile.city || 'Localização sob consulta'}
                                </div>
                                <p className="text-gray-500 dark:text-zinc-400 text-base font-medium line-clamp-2 leading-relaxed opacity-80">
                                    {profile.bio || 'Visite a vitrine oficial para descobrir o catálogo completo e as ofertas exclusivas para este bairro.'}
                                </p>
                            </div>

                            <div className="mt-10 pt-8 border-t border-gray-100 dark:border-zinc-800/50 flex items-center justify-between">
                                <div className="flex items-center gap-3 text-indigo-600 dark:text-brand-primary">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">Vitrine Online</span>
                                </div>
                                <div className="bg-gray-900 dark:bg-zinc-800 text-white p-5 rounded-[1.8rem] group-hover:bg-indigo-600 group-hover:scale-110 transition-all shadow-xl">
                                    <ArrowRight className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        )}
      </section>

      {/* 3. CTA BOTTOM */}
      <section className="bg-gray-900 dark:bg-zinc-950 rounded-[4rem] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10 space-y-10 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1] mb-4">
                Sua marca também <br/>merece <span className="text-brand-primary">ser lembrada.</span>
            </h2>
            <p className="text-gray-400 text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                Crie sua presença digital gratuita agora e apareça no radar de milhares de consumidores no seu bairro.
            </p>
            <div className="pt-6">
               <Link to="/register" className="bg-white text-gray-900 px-16 py-6 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all inline-flex items-center gap-3 shadow-2xl active:scale-95 group">
                 ANUNCIAR MINHA VITRINE <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
               </Link>
            </div>
         </div>
         <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[140px] translate-x-1/3 translate-y-1/3"></div>
      </section>
    </div>
  );
};
