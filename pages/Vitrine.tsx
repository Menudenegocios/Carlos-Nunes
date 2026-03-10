
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { firebaseService } from '../services/firebaseService';
import { Profile } from '../types';
import { 
  Search, MapPin, Star, ArrowRight, Sparkles, 
  LayoutGrid, List, Globe, MessageCircle, Instagram,
  ShieldCheck, Award, Zap, Crown, User, Store,
  Package, Wrench, Handshake
} from 'lucide-react';

export const Vitrine: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [selectedCategory, setSelectedCategory] = useState('Produtos');

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setIsLoading(true);
    try {
      const data = await firebaseService.getPublishedProfiles();
      setProfiles(data);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(p => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = p.businessName?.toLowerCase().includes(searchLower) ||
                          p.category?.toLowerCase().includes(searchLower) ||
                          p.city?.toLowerCase().includes(searchLower) ||
                          p.storeConfig?.vitrineNiche?.toLowerCase().includes(searchLower) ||
                          p.storeConfig?.vitrineCity?.toLowerCase().includes(searchLower);
    
    const matchesCategory = selectedCategory === 'Todos' || 
                            p.vitrineCategory === selectedCategory || 
                            (!p.vitrineCategory && selectedCategory === 'Produtos');
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] pb-20">
      {/* HERO SECTION */}
      <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 pt-32 pb-20 px-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-brand-primary rounded-full text-[10px] font-black uppercase tracking-widest">
           <Sparkles className="w-3 h-3" /> Vitrine Global de Especialistas
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-none max-w-4xl mx-auto">
          Encontre os Melhores <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] dark:from-brand-primary dark:to-brand-accent italic">Negócios & Profissionais</span>
        </h1>
        
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg font-medium italic">
          Conecte-se com especialistas verificados pelo Menu de Negócios. <br/>
          Qualidade, autoridade e confiança em um só lugar.
        </p>

        {/* SEARCH BAR */}
        <div className="max-w-3xl mx-auto mt-12 relative group">
            <div className="absolute inset-0 bg-indigo-500/20 blur-2xl group-hover:bg-indigo-500/30 transition-all rounded-[2.5rem]" />
            <div className="relative bg-white dark:bg-zinc-900 rounded-[2.5rem] p-2 flex items-center shadow-xl border border-gray-100 dark:border-zinc-800">
              <div className="pl-6 text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <input 
                type="text" 
                placeholder="BUSCAR POR NOME, CATEGORIA OU CIDADE..."
                className="flex-1 bg-transparent border-none p-6 font-black text-xs uppercase tracking-widest text-gray-900 dark:text-white outline-none placeholder:text-slate-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <button className="bg-[#F67C01] text-white px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                PESQUISAR
              </button>
            </div>
        </div>

        {/* Abas Principais */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
            {[
                { id: 'Todos', label: 'Todos', icon: Sparkles },
                { id: 'Produtos', label: 'Produtos', icon: Package },
                { id: 'Serviços', label: 'Serviços', icon: Wrench },
                { id: 'Oportunidades', label: 'Oportunidades', icon: Handshake },
            ].map((tab) => (
                <button 
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)} 
                    className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${selectedCategory === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'bg-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 border border-gray-100 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
                >
                    <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
            ))}
        </div>
      </section>

      {/* RESULTS */}
      <div className="max-w-7xl mx-auto px-8 mt-16">
        {isLoading ? (
          <div className="py-40 text-center">
            <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Carregando Vitrine Global...</p>
          </div>
        ) : filteredProfiles.length > 0 ? (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}>
            {filteredProfiles.map(profile => (
              <ProfileCard key={profile.id} profile={profile} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="py-40 text-center bg-white dark:bg-zinc-900 rounded-[4rem] border-2 border-dashed border-gray-200 dark:border-zinc-800">
            <Search className="w-20 h-20 text-gray-200 dark:text-zinc-800 mx-auto mb-8" />
            <h3 className="text-2xl font-black text-slate-400 uppercase italic tracking-tighter">Nenhum especialista encontrado</h3>
            <p className="text-slate-400 font-medium mt-2">Tente buscar por outros termos ou categorias.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileCard: React.FC<{ profile: Profile, viewMode: 'grid' | 'list' }> = ({ profile, viewMode }) => {
  const isProfessional = profile.storeConfig?.businessType === 'professional';
  
  if (viewMode === 'list') {
    return (
      <Link 
        to={profile.slug ? `/${profile.slug}` : `/store/${profile.userId}`}
        className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-zinc-800 hover:shadow-2xl transition-all flex flex-col md:flex-row items-center gap-8 group"
      >
        <div className="w-32 h-32 rounded-[2rem] overflow-hidden flex-shrink-0 shadow-lg border-4 border-white dark:border-zinc-800">
          <img src={profile.logoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full tracking-widest ${isProfessional ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
              {isProfessional ? 'PROFISSIONAL' : 'ESTABELECIMENTO'}
            </span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-[10px] font-black">5.0</span>
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter group-hover:text-brand-primary transition-colors">{profile.businessName}</h3>
          <p className="text-sm font-bold text-slate-500 uppercase italic tracking-tight">{profile.storeConfig?.vitrineNiche || profile.category || 'Membro Elite'}</p>
          <div className="flex items-center justify-center md:justify-start gap-4 text-slate-400">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
              <MapPin className="w-3 h-3" /> {profile.storeConfig?.vitrineCity || profile.city || 'Brasil'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-slate-100 overflow-hidden">
                <img src={`https://picsum.photos/seed/${profile.id + i}/50/50`} />
              </div>
            ))}
          </div>
          <button className="bg-brand-dark text-white p-5 rounded-2xl shadow-xl hover:scale-110 transition-all">
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to={profile.slug ? `/${profile.slug}` : `/store/${profile.userId}`}
      className="bg-white dark:bg-zinc-900 rounded-[3.5rem] overflow-hidden border border-gray-100 dark:border-zinc-800 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all group flex flex-col h-full shadow-sm"
    >
      {/* CARD HEADER / COVER - Purple Gradient as per screenshot */}
      <div className="relative h-44 bg-gradient-to-br from-[#A78BFA] via-[#8B5CF6] to-[#7C3AED] overflow-hidden">
        {profile.storeConfig?.coverUrl && (
          <img 
            src={profile.storeConfig.coverUrl} 
            className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" 
          />
        )}
        
        <div className="absolute top-6 left-6">
          <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-xl border border-white/20 flex items-center gap-2">
            <Star className="w-3 h-3 text-brand-primary fill-current" />
            <span className="text-[8px] font-black uppercase tracking-widest text-brand-dark dark:text-white">VERIFICADO</span>
          </div>
        </div>
      </div>

      {/* PROFILE INFO */}
      <div className="px-8 pb-10 -mt-16 relative z-10 flex-1 flex flex-col items-center md:items-start">
        <div className="w-32 h-32 rounded-full border-[6px] border-white dark:border-zinc-900 bg-white shadow-2xl overflow-hidden mb-6">
          <img src={profile.logoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'} className="w-full h-full object-cover" />
        </div>

        <div className="space-y-4 flex-1 w-full text-center md:text-left">
          <div className="flex items-center justify-center md:justify-between">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none group-hover:text-brand-primary transition-colors">
              {profile.businessName}
            </h3>
            {(profile.storeConfig?.vitrineNiche || profile.category) && (
              <span className="hidden md:block text-[8px] font-black uppercase px-3 py-1 bg-orange-50 text-orange-500 rounded-full tracking-widest">
                {profile.storeConfig?.vitrineNiche || profile.category}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-brand-primary">
            <MapPin className="w-3 h-3" /> {profile.storeConfig?.vitrineCity || profile.city || 'LOCALIZAÇÃO SOB CONSULTA'}
          </div>

          <p className="text-sm font-bold text-slate-400 uppercase italic tracking-tight line-clamp-2">
            {profile.bio || `💎 CEO e Fundador do @menudenegocios. Não peça a...`}
          </p>
        </div>

        <div className="pt-8 mt-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-indigo-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-indigo-600">
                <Store className="w-4 h-4" />
             </div>
             <span className="text-[9px] font-black text-indigo-600 dark:text-brand-primary uppercase tracking-[0.2em]">VITRINE ONLINE</span>
          </div>
          <div className="w-14 h-14 bg-[#0F172A] text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
            <ArrowRight className="w-6 h-6" />
          </div>
        </div>
      </div>
    </Link>
  );
};
