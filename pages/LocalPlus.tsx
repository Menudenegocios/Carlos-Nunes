
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Sparkles, Zap, MapPin, 
  MessageSquare, Tag, Clock, 
  ChevronRight, ArrowRight, Star,
  Utensils, Heart, Dumbbell, ShoppingBag, 
  Wrench, GraduationCap, Camera, PartyPopper, 
  Dog, ShoppingCart, Activity, Laptop,
  Filter, Grid, List as ListIcon, 
  Plus, CheckCircle2, ShieldCheck,
  TrendingUp, Users, Target
} from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MyOffers } from './MyOffers';

export const LocalPlus: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'home';
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<any[]>([]);
  const [flashDeals, setFlashDeals] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'food', name: 'Alimentação', icon: Utensils, color: 'text-orange-500', bg: 'bg-orange-100' },
    { id: 'beauty', name: 'Beleza e Estética', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-100' },
    { id: 'fitness', name: 'Fitness', icon: Dumbbell, color: 'text-blue-500', bg: 'bg-blue-100' },
    { id: 'retail', name: 'Varejo', icon: ShoppingBag, color: 'text-purple-500', bg: 'bg-purple-100' },
    { id: 'services', name: 'Serviços', icon: Wrench, color: 'text-slate-500', bg: 'bg-slate-100' },
    { id: 'edu', name: 'Educação', icon: GraduationCap, color: 'text-indigo-500', bg: 'bg-indigo-100' },
    { id: 'experiences', name: 'Experiências', icon: Star, color: 'text-amber-500', bg: 'bg-amber-100' },
    { id: 'leisure', name: 'Lazer', icon: PartyPopper, color: 'text-green-500', bg: 'bg-green-100' },
    { id: 'pets', name: 'Pets', icon: Dog, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'shopping', name: 'Compras', icon: ShoppingCart, color: 'text-emerald-500', bg: 'bg-emerald-100' },
    { id: 'health', name: 'Saúde', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-100' },
    { id: 'tech', name: 'Tech', icon: Laptop, color: 'text-cyan-500', bg: 'bg-cyan-100' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // In a real app we'd fetch from DB. For now, mocking if empty.
      const data = await supabaseService.getOffers(); // We need to implement this or use existing getProducts with filter
      if (data && data.length > 0) {
        setOffers(data.filter(o => !o.is_flash_deal));
        setFlashDeals(data.filter(o => o.is_flash_deal));
      } else {
        // Mock data for WOW effect
        const mockOffers = [
          { id: '1', title: '10% OFF no Almoço', store_name: 'Restaurante Sabor Local', category: 'food', discount_display: '10% OFF', image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400', action_type: 'whatsapp' },
          { id: '2', title: 'Corte + Barba com Desconto', store_name: 'Barbearia Vintage', category: 'beauty', discount_display: 'R$ 20 OFF', image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=400', action_type: 'coupon' },
          { id: '3', title: 'Avaliação Grátis + 1 Mês', store_name: 'Iron Fitness', category: 'fitness', discount_display: 'GRÁTIS', image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400', action_type: 'whatsapp' }
        ];
        setOffers(mockOffers);
        setFlashDeals([
          { id: 'f1', title: 'PIZZA EM DOBRO', store_name: 'Pizzaria Napolitana', category: 'food', discount_display: 'COMPRE 1 LEVE 2', is_flash_deal: true, flash_deal_expires_at: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(), image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400' }
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const OfferCard = ({ offer, flash = false }: any) => (
    <div className={`bg-white rounded-[2rem] border overflow-hidden transition-all group hover:shadow-2xl hover:-translate-y-1 ${flash ? 'border-brand-primary/30 ring-4 ring-brand-primary/5' : 'border-gray-100 flex flex-col'}`}>
      <div className="relative h-48 overflow-hidden">
        <img src={offer.image_url} alt={offer.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-4 left-4">
           <span className="bg-white/90 backdrop-blur-md text-brand-primary text-[10px] font-black px-4 py-2 rounded-full shadow-lg uppercase tracking-widest border border-brand-primary/10">
              {offer.discount_display}
           </span>
        </div>
        {flash && (
          <div className="absolute bottom-4 right-4 bg-brand-primary text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
            <Clock className="w-3.5 h-3.5" /> ACABA EM 04:52
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{categories.find(c => c.id === offer.category)?.name || 'Oferta'}</span>
        </div>
        <h4 className="text-lg font-black text-slate-900 leading-tight mb-2 group-hover:text-brand-primary transition-colors">{offer.title}</h4>
        <div className="flex items-center gap-3 mb-6">
           <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
              {offer.store_logo_url ? <img src={offer.store_logo_url} /> : <Zap className="w-4 h-4 text-brand-primary" />}
           </div>
           <span className="text-[11px] font-bold text-slate-500">{offer.store_name}</span>
        </div>
        <div className="mt-auto">
           <button className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${flash ? 'bg-brand-primary text-white hover:bg-orange-600' : 'bg-brand-dark text-white hover:opacity-90'}`}>
              {offer.action_type === 'coupon' ? 'GERAR CUPOM AGORA' : 'QUERO ESSE BENEFÍCIO'} <ArrowRight className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-20">
      
      {/* 1. HERO / HEADER */}
      <section className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/20 blur-[120px] -mr-48 -mt-48 animate-pulse"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/20 blur-[120px] -ml-48 -mb-48"></div>
         
         <div className="relative z-10 max-w-2xl space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
               <Sparkles className="w-4 h-4 text-brand-primary" /> O melhor da sua região
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.9] uppercase italic overflow-visible">
               Local <span className="text-brand-primary">+</span> <br />
               Vantagens <span className="text-indigo-400">Todo Dia.</span>
            </h1>
            <p className="text-lg text-slate-400 font-medium leading-relaxed">
               Encontre ofertas exclusivas das melhores empresas locais e economize enquanto fortalece o comércio da sua cidade.
            </p>
         </div>
      </section>

      {/* 2. NAVIGATION TABS */}
      <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl w-fit mx-auto border border-gray-100 shadow-sm sticky top-4 z-50 backdrop-blur-md bg-white/80 overflow-x-auto scrollbar-hide max-w-full">
         {[
           { id: 'home', label: 'Home', icon: Grid },
           { id: 'flash', label: 'Menu do Dia', icon: Zap },
           { id: 'categories', label: 'Categorias', icon: Filter },
           // Se o usuário já tiver acesso liberado ao local+, mostrar a aba de ofertas
           ...(user && user.has_local_plus ? [{ id: 'my-offers', label: 'Minhas Ofertas', icon: Tag }] : [])
         ].map(tab => (
           <button
             key={tab.id}
             onClick={() => setSearchParams({ tab: tab.id })}
             className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-400 hover:text-brand-dark hover:bg-white'}`}
           >
             <tab.icon className="w-4 h-4" /> {tab.label}
           </button>
         ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           className="space-y-12"
        >
          {activeTab === 'home' && (
            <>
              {/* Menu do Dia Highlight */}
              <section className="space-y-8">
                 <div className="flex justify-between items-end px-4">
                    <div className="space-y-1">
                       <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">⚡ Menu do Dia</h3>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ofertas Relâmpago — Só hoje!</p>
                    </div>
                 </div>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                    {flashDeals.map(deal => <OfferCard key={deal.id} offer={deal} flash={true} />)}
                 </div>
              </section>

              {/* Categorias Rápidas */}
              <section className="px-4">
                <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-4">
                  {categories.map(cat => (
                    <button 
                      key={cat.id} 
                      onClick={() => { setSelectedCategory(cat.id); setSearchParams({ tab: 'categories' }); }}
                      className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-brand-primary/30 hover:shadow-xl transition-all group"
                    >
                      <div className={`w-12 h-12 rounded-xl ${cat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                         <cat.icon className={`w-6 h-6 ${cat.color}`} />
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-tighter text-slate-600 text-center leading-tight">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Ofertas em Destaque */}
              <section className="space-y-8 px-4">
                 <div className="flex justify-between items-end">
                    <div className="space-y-1">
                       <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">🔥 Ofertas em Destaque</h3>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">As melhores oportunidades da semana</p>
                    </div>
                 </div>
                 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {offers.map(offer => <OfferCard key={offer.id} offer={offer} />)}
                 </div>
              </section>
            </>
          )}

          {activeTab === 'flash' && (
             <section className="px-4 space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-6 pt-10">
                   <div className="w-20 h-20 bg-brand-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto ring-8 ring-brand-primary/5">
                      <Zap className="w-10 h-10 text-brand-primary animate-pulse" />
                   </div>
                   <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Menu do Dia</h2>
                   <p className="text-lg text-slate-500 font-medium">Toda quarta-feira as empresas locais criam ofertas imbatíveis com duração de apenas algumas horas. Seja rápido!</p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {flashDeals.map(deal => <OfferCard key={deal.id} offer={deal} flash={true} />)}
                   {flashDeals.length === 0 && (
                     <div className="col-span-full py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 text-center">
                        <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Nenhuma oferta relâmpago ativa no momento.</p>
                        <p className="text-slate-400 text-[10px] mt-1">Fique atento para a próxima quarta-feira!</p>
                     </div>
                   )}
                </div>
             </section>
          )}

          {activeTab === 'categories' && (
             <section className="px-4 space-y-10">
                <div className="flex flex-col md:flex-row gap-8">
                   <aside className="w-full md:w-64 space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Categorias</h4>
                      <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                         {categories.map(cat => (
                           <button
                             key={cat.id}
                             onClick={() => setSelectedCategory(cat.id)}
                             className={`flex items-center gap-3 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-indigo-50 border border-gray-100'}`}
                           >
                             <cat.icon className="w-4 h-4" /> {cat.name}
                           </button>
                         ))}
                      </div>
                   </aside>
                   <div className="flex-1 space-y-8">
                      <div className="flex items-center justify-between bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                         <h3 className="text-xl font-black text-slate-900 uppercase italic">
                            {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'Todas as Ofertas'}
                         </h3>
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {offers.filter(o => !selectedCategory || o.category === selectedCategory).length} resultados
                         </span>
                      </div>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                         {offers.filter(o => !selectedCategory || o.category === selectedCategory).map(offer => <OfferCard key={offer.id} offer={offer} />)}
                      </div>
                   </div>
                </div>
             </section>
          )}

          {activeTab === 'my-offers' && user && user.has_local_plus && (
             <section className="px-4 py-6">
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
                   <div className="mb-8">
                      <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Portal do Anunciante</h2>
                      <p className="text-sm font-medium text-slate-500">Cadastre e gerencie suas ofertas Local+ (Acesso Aberto)</p>
                   </div>
                   {/* Reutilizando o sistema de ofertas existente */}
                   <div className="local-plus-offers-context">
                      <MyOffers />
                   </div>
                </div>
             </section>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
