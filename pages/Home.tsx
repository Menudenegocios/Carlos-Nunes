
import React, { useEffect, useState } from 'react';
import { mockBackend } from '../services/mockBackend';
import { Offer, OfferCategory } from '../types';
import { OfferCard } from '../components/OfferCard';
import { 
  Search, MapPin, ArrowRight, Zap, Briefcase, 
  ShoppingBag, Heart, Home as HomeIcon, CheckCircle, 
  Sparkles, HelpCircle, ChevronDown, Star, TrendingUp, 
  Users, Store, Ticket, ShieldCheck, LayoutGrid, Timer,
  Handshake
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', city: '', category: '' });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => { loadOffers(); }, [filters]);

  const loadOffers = async () => {
    setIsLoading(true);
    try {
      const data = await mockBackend.getOffers(filters);
      setOffers(data);
    } catch (error) { console.error('Failed to load offers', error); } finally { setIsLoading(false); }
  };

  const categories = [
    { title: 'Serviços', val: OfferCategory.SERVICOS_PROFISSIONAIS, icon: Briefcase, color: 'text-brand-primary', count: '120+' },
    { title: 'Negócios', val: OfferCategory.NEGOCIOS_LOCAIS, icon: ShoppingBag, color: 'text-indigo-600', count: '450+' },
    { title: 'Saúde', val: OfferCategory.SAUDE_BEM_ESTAR, icon: Heart, color: 'text-rose-600', count: '85+' },
    { title: 'Imóveis', val: OfferCategory.IMOVEIS_SERVICOS, icon: HomeIcon, color: 'text-amber-500', count: '60+' }
  ];

  const faqs = [
    {
      q: "O que é o Menu de Negócios?",
      a: "Somos um marketplace de conexão local inteligente que permite a empreendedores criarem vitrines digitais de alto impacto para atrair clientes do seu próprio bairro ou cidade."
    },
    {
      q: "Realmente não há taxas de venda?",
      a: "Exatamente. O lucro das suas vendas é 100% seu. Nós facilitamos o contato direto via WhatsApp ou seu próprio catálogo digital, eliminando intermediários caros."
    },
    {
        q: "Como meu negócio aparece nos destaques?",
        a: "Negócios com perfis completos, boas avaliações e selos de verificação ganham prioridade no nosso algoritmo de busca regional."
    }
  ];

  return (
    <div className="flex flex-col bg-brand-surface dark:bg-brand-dark transition-colors duration-500">
      
      {/* 1. NEW MARKETPLACE HERO */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-800 shadow-xl rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-gray-100 dark:border-slate-700 animate-bounce">
                    <Sparkles className="w-4 h-4 text-brand-primary fill-current" /> O Shopping do seu bairro
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-brand-dark dark:text-white tracking-tighter leading-[0.9]">
                  Tudo o que você busca, <br/>
                  <span className="text-brand-primary italic">está logo ali.</span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed">
                  Conectamos consumidores reais aos melhores negócios locais. Sem taxas, sem burocracia, 100% regional.
                </p>
            </div>

            {/* Smart Search Bar (Amazon Style) */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-slate-900 p-3 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-none border border-gray-100 dark:border-slate-800 flex flex-col md:flex-row gap-2 ring-8 ring-brand-primary/5">
                    <div className="flex-1 relative flex items-center px-6">
                        <Search className="w-6 h-6 text-brand-primary absolute left-8" />
                        <input 
                            type="text" 
                            placeholder="O que você precisa hoje? (Ex: Pizzaria, Advogado...)" 
                            className="w-full bg-transparent border-none py-5 pl-12 font-bold text-lg text-brand-dark dark:text-white focus:ring-0 placeholder:text-gray-400"
                            value={filters.search}
                            onChange={(e) => setFilters({...filters, search: e.target.value})}
                        />
                    </div>
                    <div className="w-px h-10 bg-gray-100 dark:bg-slate-800 hidden md:block self-center"></div>
                    <div className="flex-1 relative flex items-center px-6">
                        <MapPin className="w-6 h-6 text-indigo-600 absolute left-8" />
                        <input 
                            type="text" 
                            placeholder="Sua Cidade/Bairro" 
                            className="w-full bg-transparent border-none py-5 pl-12 font-bold text-lg text-brand-dark dark:text-white focus:ring-0 placeholder:text-gray-400"
                            value={filters.city}
                            onChange={(e) => setFilters({...filters, city: e.target.value})}
                        />
                    </div>
                    <button className="bg-brand-dark dark:bg-brand-primary text-white px-12 py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-all shadow-2xl active:scale-95">
                        EXPLORAR
                    </button>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of sections with subtle color shifts */}
      <section className="max-w-7xl mx-auto w-full px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Box 1: Destaque da Semana */}
            <div className="md:col-span-2 md:row-span-2 bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 border border-gray-100 dark:border-slate-800 shadow-xl overflow-hidden relative group cursor-pointer">
                <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                            <Star className="w-4 h-4 fill-current" /> Negócio em Destaque
                        </div>
                        <h3 className="text-4xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">Empório das Artes <br/><span className="text-brand-primary">Artesanal & Local</span></h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs">A melhor curadoria de produtos do bairro, agora com delivery gratuito pelo WhatsApp.</p>
                    </div>
                    <Link to="/store/destaque" className="w-fit bg-slate-900 dark:bg-brand-primary text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl group-hover:scale-105 transition-all">VISITAR LOJA</Link>
                </div>
                <img src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=800" className="absolute top-0 right-0 w-1/2 h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity" />
            </div>

            {/* Box 2: Cupons Ativos */}
            <div className="bg-indigo-600 rounded-[3rem] p-8 text-white shadow-xl flex flex-col justify-between group hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 mb-4">
                    <Ticket className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h4 className="text-4xl font-black leading-none">24</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">Cupons Ativos Hoje</p>
                </div>
                <Link to="/coupons" className="mt-6 flex items-center justify-between text-[10px] font-black uppercase tracking-widest bg-white/10 p-4 rounded-xl hover:bg-white/20 transition-all">
                    RESGATAR AGORA <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Box 3: Network B2B */}
            <div className="bg-brand-dark dark:bg-slate-800 rounded-[3rem] p-8 text-white shadow-xl flex flex-col justify-between group hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 mb-4">
                    <Handshake className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-1">Para sua Empresa</p>
                    <h4 className="text-xl font-black leading-tight">Encontre novos <br/>parceiros B2B</h4>
                </div>
                <Link to="/marketplace" className="mt-6 flex items-center justify-between text-[10px] font-black uppercase tracking-widest bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all border border-white/5">
                    VER ACORDOS <ChevronDown className="w-4 h-4 -rotate-90" />
                </Link>
            </div>

            {/* Box 4: Contador de Usuários */}
            <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-gray-100 dark:border-slate-800 flex items-center justify-between group shadow-sm">
                <div className="space-y-1">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Comunidade Ativa</h4>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">+5.000 Vizinhos Conectados</p>
                </div>
                <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 overflow-hidden shadow-lg">
                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${i}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>
      
      {/* ... keeping other sections with standard background references ... */}
    </div>
  );
};
