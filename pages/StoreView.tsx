
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockBackend } from '../services/mockBackend';
import { Product, Profile, StoreCategory } from '../types';
import { 
  MapPin, MessageCircle, ArrowLeft, Star, Package, Send, ArrowRight,
  ShoppingBag, Trash2, Plus, Minus, X, Play, Zap, CreditCard, DollarSign, ShieldCheck,
  Calendar, Clock, User, Briefcase, Award, CheckCircle, Instagram, Globe, Info, Target, ListTodo, Handshake,
  QrCode, Download
} from 'lucide-react';

export const StoreView: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Agendamento / Lead Form
  const [isSchedModalOpen, setIsSchedModalOpen] = useState(false);
  const [schedForm, setSchedForm] = useState({ name: '', email: '', whatsapp: '' });
  
  // Banner Triplo
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);

  useEffect(() => {
    if (userId) loadStoreData();
  }, [userId]);

  // Efeito para trocar banner automaticamente
  useEffect(() => {
    const banners = profile?.storeConfig?.bannerImages || [];
    if (banners.length > 1) {
        const interval = setInterval(() => {
            setCurrentBannerIdx(prev => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }
  }, [profile]);

  const loadStoreData = async () => {
    if (!userId) return;
    try {
      const [prof, prods, cats] = await Promise.all([
        mockBackend.getProfile(userId),
        mockBackend.getProducts(userId),
        mockBackend.getStoreCategories(userId)
      ]);
      setProfile(prof || null);
      setProducts(prods);
      setCategories(cats);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phone = profile?.phone?.replace(/\D/g, '') || '';
    const message = `Olá! Sou *${schedForm.name}* (Email: ${schedForm.email}).\nAcabo de preencher o formulário na sua Vitrine de Especialista e gostaria de agendar uma consulta.\n\n_Enviado via Menu de Negócios_`;
    
    // Simula salvamento no CRM do usuário
    await mockBackend.addLeads([{
        userId: profile?.userId || '',
        name: schedForm.name,
        phone: schedForm.whatsapp,
        source: 'manual',
        stage: 'new',
        notes: `Interesse em agendamento via Landing Page. Email: ${schedForm.email}`
    }]);

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    setIsSchedModalOpen(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black uppercase text-xs tracking-widest text-slate-400">Carregando vitrine de elite...</div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center">Especialista não encontrado.</div>;

  const isProfessional = profile.storeConfig?.businessType === 'professional';
  const bannerImages = profile.storeConfig?.bannerImages || [profile.storeConfig?.coverUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200'];

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#020617] min-h-screen font-sans selection:bg-indigo-600 selection:text-white pb-32">
        
        {/* TOP NAV MINI */}
        <div className="fixed top-0 left-0 right-0 z-[100] p-4 flex justify-between items-center pointer-events-none">
            <Link to="/stores" className="p-3 bg-white/20 backdrop-blur-xl text-white rounded-2xl border border-white/20 hover:bg-white/40 transition-all pointer-events-auto">
                <ArrowLeft className="w-5 h-5" />
            </Link>
        </div>

        {/* 1. HERO SLIDER BANNER */}
        <div className="relative h-[65vh] lg:h-[75vh] w-full overflow-hidden bg-slate-900">
            {bannerImages.map((img, idx) => (
                <div 
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentBannerIdx ? 'opacity-60' : 'opacity-0'}`}
                >
                    <img src={img} className="w-full h-full object-cover" alt={`Slide ${idx}`} />
                </div>
            ))}
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] dark:from-[#020617] via-transparent to-black/20"></div>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-7xl px-8 flex flex-col md:flex-row items-end justify-between gap-8 animate-fade-in">
                <div className="flex items-center gap-8 text-center md:text-left">
                   <div className="w-32 h-32 lg:w-44 lg:h-44 rounded-full border-[10px] border-white dark:border-zinc-900 bg-white shadow-2xl overflow-hidden flex-shrink-0">
                      <img src={profile.logoUrl} className="w-full h-full object-cover" alt="Avatar" />
                   </div>
                   <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <span className="bg-indigo-600 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest shadow-xl">ESPECIALISTA</span>
                            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-indigo-600 text-[10px] font-black shadow-sm">
                                <ShieldCheck className="w-4 h-4 fill-current opacity-20" /> VERIFICADO
                            </div>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none">{profile.businessName}</h1>
                        <p className="text-xl font-bold text-indigo-600 dark:text-brand-primary uppercase italic tracking-tight">{profile.category || 'Membro do Ecossistema'}</p>
                   </div>
                </div>

                <div className="flex gap-4">
                    <button 
                      onClick={() => setIsSchedModalOpen(true)}
                      className="bg-indigo-600 text-white px-12 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
                    >
                        <Calendar className="w-6 h-6" /> AGENDAR AGORA
                    </button>
                </div>
            </div>

            {/* Dots navigation */}
            {bannerImages.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {bannerImages.map((_, i) => (
                        <div key={i} className={`h-1 rounded-full transition-all ${i === currentBannerIdx ? 'w-8 bg-indigo-600' : 'w-2 bg-white/30'}`}></div>
                    ))}
                </div>
            )}
        </div>

        {/* 2. LANDING PAGE CONTENT GRID */}
        <div className="max-w-7xl mx-auto px-8 pt-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* LADO ESQUERDO: INFOS E AUTORIDADE */}
                <div className="lg:col-span-8 space-y-12">
                    
                    {/* SOBRE MIM */}
                    <section className="bg-white dark:bg-zinc-900 rounded-[3.5rem] p-10 lg:p-16 shadow-xl border border-gray-100 dark:border-zinc-800 animate-fade-in">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center text-indigo-600"><Info className="w-6 h-6" /></div>
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Sobre o Especialista</h2>
                        </div>
                        <div className="prose prose-xl dark:prose-invert max-w-none">
                            <p className="text-xl text-gray-600 dark:text-zinc-400 font-medium leading-relaxed italic">
                                "{profile.storeConfig?.aboutMe || profile.bio || 'Bem-vindo ao meu perfil profissional de elite.'}"
                            </p>
                        </div>
                    </section>

                    {/* PROBLEMAS QUE RESOLVO E SOLUÇÕES (GRID) */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <section className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                            <div className="relative z-10 space-y-8">
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                                    <Target className="w-6 h-6" /> Problemas que resolvo
                                </h3>
                                <div className="space-y-4">
                                    {(profile.storeConfig?.problemsSolved || 'Resolvo seus principais desafios de negócio com maestria.').split('\n').map((item, i) => (
                                        <div key={i} className="flex items-start gap-4">
                                            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                                            <p className="font-bold text-lg leading-tight">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Zap className="absolute -bottom-8 -right-8 w-32 h-32 text-white/5 rotate-12 group-hover:scale-125 transition-transform" />
                        </section>

                        <section className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 shadow-xl border border-gray-100 dark:border-zinc-800">
                             <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter flex items-center gap-3 mb-8">
                                <ListTodo className="w-6 h-6 text-indigo-600" /> Soluções & Serviços
                             </h3>
                             <div className="space-y-6">
                                {(profile.storeConfig?.solutions || 'Consultoria Estratégica, Gestão de Alta Performance, Resultados Garantidos.').split(',').map((item, i) => (
                                    <div key={i} className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800 font-black text-xs uppercase tracking-widest text-slate-500">
                                        {item.trim()}
                                    </div>
                                ))}
                             </div>
                        </section>
                    </div>

                    {/* PORTFÓLIO DESTAQUE */}
                    <section className="space-y-10">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Portfólio em Destaque</h2>
                            <Link to="/marketplace" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Ver tudo</Link>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {products.length > 0 ? products.slice(0, 3).map(prod => (
                                <div key={prod.id} className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all flex flex-col h-full overflow-hidden">
                                    <div className="aspect-square bg-gray-50 dark:bg-zinc-800 overflow-hidden relative">
                                        <img src={prod.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt={prod.name} />
                                        <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">DESTAQUE</div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col space-y-2">
                                        <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-tight line-clamp-1">{prod.name}</h4>
                                        <p className="text-xs text-slate-400 font-medium line-clamp-2">{prod.description}</p>
                                        <div className="pt-4 mt-auto">
                                            <span className="text-lg font-black text-indigo-600">
                                                {prod.price > 0 ? `R$ ${prod.price.toFixed(2)}` : 'SOB CONSULTA'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-zinc-900/40 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-zinc-800">
                                    <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Catálogo sendo atualizado</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* INTERESSES DE NEGÓCIO */}
                    <section className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden group">
                        <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                            <div className="space-y-6">
                                <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-tight">Interesses de <br/><span className="text-brand-primary">Negócio & Match</span></h3>
                                <p className="text-slate-400 text-lg font-medium leading-relaxed">
                                    {profile.storeConfig?.businessInterests || profile.bio || 'Busco conexões estratégicas com parceiros da região para escalar impacto mútuo.'}
                                </p>
                            </div>
                            <div className="flex justify-end">
                                <Link to="/rewards" className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-brand-primary hover:text-white transition-all">BUSCAR MATCH NO CLUBE</Link>
                            </div>
                        </div>
                        <Handshake className="absolute bottom-[-20px] left-[-20px] w-64 h-64 text-white/5 -rotate-12" />
                    </section>
                </div>

                {/* SIDEBAR DIREITA: CONTATOS E REDES */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 shadow-xl border border-gray-100 dark:border-zinc-800 sticky top-12">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 text-center italic">Canais de Atendimento</h4>
                        
                        <div className="space-y-4">
                            <a 
                                href={`https://wa.me/${profile.phone?.replace(/\D/g, '')}`} 
                                target="_blank"
                                className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/10 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 active:scale-95"
                            >
                                <MessageCircle className="w-5 h-5" /> FALAR NO WHATSAPP
                            </a>
                            
                            <div className="grid grid-cols-2 gap-3">
                                {profile.socialLinks?.instagram && (
                                    <a href={`https://instagram.com/${profile.socialLinks.instagram}`} target="_blank" className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-zinc-800 rounded-[2rem] hover:bg-indigo-50 transition-all group">
                                        <Instagram className="w-6 h-6 text-pink-500 group-hover:scale-110 transition-transform" />
                                        <span className="text-[9px] font-black uppercase text-slate-400">Instagram</span>
                                    </a>
                                )}
                                {profile.socialLinks?.website && (
                                    <a href={profile.socialLinks.website} target="_blank" className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-zinc-800 rounded-[2rem] hover:bg-blue-50 transition-all group">
                                        <Globe className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                                        <span className="text-[9px] font-black uppercase text-slate-400">Site Oficial</span>
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-50 dark:border-zinc-800 text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Localização</p>
                            <div className="flex items-center justify-center gap-2 text-gray-900 dark:text-white font-black text-sm uppercase italic">
                                <MapPin className="w-4 h-4 text-indigo-600" /> {profile.city || 'Atendimento Remoto'}
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden text-center space-y-6">
                        <Award className="w-12 h-12 mx-auto text-brand-primary" />
                        <h4 className="text-xl font-black uppercase italic tracking-tighter">Membro Elite <br/>Menu de Negócios</h4>
                        <p className="text-indigo-100 text-xs font-bold leading-relaxed">Este profissional utiliza inteligência artificial e tecnologia local para entregar resultados superiores.</p>
                        <ShieldCheck className="absolute top-0 right-0 w-24 h-24 text-white/10 -mr-8 -mt-8" />
                    </div>
                </div>
            </div>
        </div>

        {/* MODAL DE AGENDAMENTO */}
        {isSchedModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-fade-in">
                <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-xl shadow-2xl overflow-hidden border border-white/5 animate-scale-in flex flex-col">
                    <div className="bg-indigo-600 p-10 text-white flex justify-between items-center flex-shrink-0">
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Solicitar Agendamento</h3>
                            <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Reserva de horário direta com o especialista</p>
                        </div>
                        <button onClick={() => setIsSchedModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                    </div>

                    <form onSubmit={handleSchedSubmit} className="p-12 space-y-8 flex-1 overflow-y-auto">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Nome Completo</label>
                                <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={schedForm.name} onChange={e => setSchedForm({...schedForm, name: e.target.value})} placeholder="Como quer ser chamado?" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Email para Contato</label>
                                <input required type="email" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={schedForm.email} onChange={e => setSchedForm({...schedForm, email: e.target.value})} placeholder="seu@email.com" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">WhatsApp (DDD + Número)</label>
                                <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={schedForm.whatsapp} onChange={e => setSchedForm({...schedForm, whatsapp: e.target.value})} placeholder="Ex: 5511999999999" />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button type="submit" className="w-full bg-indigo-600 text-white font-black py-6 rounded-[2.5rem] shadow-2xl uppercase tracking-widest text-sm hover:opacity-90 transition-all flex items-center justify-center gap-4 group">
                                CONFIRMAR AGENDAMENTO <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        <footer className="text-center py-20 opacity-30 mt-20">
             <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.4em] mb-4 italic">Plataforma Menu de Negócios • Conexão Local</p>
             <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.4em]">&copy; {new Date().getFullYear()} {profile.businessName}.</p>
        </footer>
    </div>
  );
};
