import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockBackend } from '../services/mockBackend';
import { Product, Profile, StoreCategory, BlogPost } from '../types';
import { 
  MapPin, MessageCircle, ArrowLeft, Star, Package, Send, ArrowRight,
  ShoppingBag, Trash2, Plus, Minus, X, Play, Zap, CreditCard, DollarSign, ShieldCheck,
  Calendar, Clock, User, Briefcase, Award, CheckCircle, Instagram, Globe, Info, Target, ListTodo, Handshake,
  QrCode, Download, BookOpen, FileText
} from 'lucide-react';

export const StoreView: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isSchedModalOpen, setIsSchedModalOpen] = useState(false);
  const [schedForm, setSchedForm] = useState({ name: '', email: '', whatsapp: '' });
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);

  useEffect(() => {
    if (userId) loadStoreData();
  }, [userId]);

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
      const [prof, prods, cats, allPosts] = await Promise.all([
        mockBackend.getProfile(userId),
        mockBackend.getProducts(userId),
        mockBackend.getStoreCategories(userId),
        mockBackend.getBlogPosts()
      ]);
      setProfile(prof || null);
      setProducts(prods);
      setCategories(cats);
      
      // Lógica "Top 3" Artigos Recentes
      const userPosts = allPosts
        .filter(p => p.userId === userId)
        .sort((a, b) => {
            // Fix: accessing created_at which is now defined in BlogPost interface
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
        })
        .slice(0, 3);
      setBlogPosts(userPosts);
    } finally {
      setLoading(false);
    }
  };

  // Fix: Implemented handleSchedSubmit to handle form submission
  const handleSchedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    const message = `Olá! Gostaria de agendar uma consulta com ${profile.businessName}. Nome: ${schedForm.name}, WhatsApp: ${schedForm.whatsapp}.`;
    const whatsappUrl = `https://wa.me/${profile.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setIsSchedModalOpen(false);
    alert('Sua solicitação de agendamento foi preparada para envio via WhatsApp!');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black uppercase text-xs tracking-widest text-slate-400">Carregando vitrine de elite...</div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center">Especialista não encontrado.</div>;

  const bannerImages = profile.storeConfig?.bannerImages?.length ? profile.storeConfig.bannerImages : [profile.storeConfig?.coverUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200'];

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#020617] min-h-screen font-sans selection:bg-indigo-600 selection:text-white pb-32">
        
        <div className="fixed top-0 left-0 right-0 z-[100] p-4 flex justify-between items-center pointer-events-none">
            <Link to="/stores" className="p-3 bg-white/20 backdrop-blur-xl text-white rounded-2xl border border-white/20 hover:bg-white/40 transition-all pointer-events-auto">
                <ArrowLeft className="w-5 h-5" />
            </Link>
        </div>

        {/* 1. HERO SLIDER BANNER */}
        <div className="relative h-[60vh] lg:h-[70vh] w-full overflow-hidden bg-slate-900">
            {bannerImages.map((img, idx) => (
                <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentBannerIdx ? 'opacity-60' : 'opacity-0'}`}>
                    <img src={img} className="w-full h-full object-cover" alt={`Slide ${idx}`} />
                </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] dark:from-[#020617] via-transparent to-black/20"></div>
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-7xl px-8 flex flex-col md:flex-row items-end justify-between gap-8 animate-fade-in">
                <div className="flex items-center gap-8 text-center md:text-left">
                   <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-[8px] border-white dark:border-zinc-900 bg-white shadow-2xl overflow-hidden flex-shrink-0">
                      <img src={profile.logoUrl} className="w-full h-full object-cover" />
                   </div>
                   <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <span className="bg-indigo-600 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest shadow-xl">ESPECIALISTA</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none">{profile.businessName}</h1>
                        <p className="text-xl font-bold text-indigo-600 dark:text-brand-primary uppercase italic tracking-tight">{profile.category || 'Membro Elite'}</p>
                   </div>
                </div>
                <button onClick={() => setIsSchedModalOpen(true)} className="bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
                    <Calendar className="w-5 h-5" /> AGENDAR AGORA
                </button>
            </div>
        </div>

        {/* 2. LANDING PAGE CONTENT */}
        <div className="max-w-7xl mx-auto px-8 pt-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                <div className="lg:col-span-8 space-y-12">
                    {/* SOBRE */}
                    <section className="bg-white dark:bg-zinc-900 rounded-[3.5rem] p-10 lg:p-16 shadow-xl border border-gray-100 dark:border-zinc-800 animate-fade-in">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center text-indigo-600"><Info className="w-6 h-6" /></div>
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Sobre o Profissional</h2>
                        </div>
                        <p className="text-xl text-gray-600 dark:text-zinc-400 font-medium leading-relaxed italic">
                            "{profile.storeConfig?.aboutMe || profile.bio || 'Bem-vindo ao meu perfil profissional.'}"
                        </p>
                    </section>

                    {/* BLOCOS DE VALOR */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <section className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl">
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3 mb-8">
                                <Target className="w-6 h-6" /> Problemas que resolvo
                            </h3>
                            <div className="space-y-4">
                                {(profile.storeConfig?.problemsSolved || 'Soluções estratégicas para seu negócio.').split('\n').map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                                        <p className="font-bold text-lg leading-tight">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 shadow-xl border border-gray-100 dark:border-zinc-800">
                             <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter flex items-center gap-3 mb-8">
                                <ListTodo className="w-6 h-6 text-indigo-600" /> Soluções & Serviços
                             </h3>
                             <div className="space-y-4">
                                {(profile.storeConfig?.solutions || 'Consultoria, Gestão, Treinamento.').split(',').map((item, i) => (
                                    <div key={i} className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800 font-black text-[10px] uppercase tracking-widest text-slate-500">
                                        {item.trim()}
                                    </div>
                                ))}
                             </div>
                        </section>
                    </div>

                    {/* SEÇÃO BLOG (Apenas 3 últimos) */}
                    {blogPosts.length > 0 && (
                        <section className="space-y-10">
                            <div className="flex items-center justify-between">
                                <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter flex items-center gap-3">
                                    <BookOpen className="w-6 h-6 text-indigo-600" /> Insights Recentes
                                </h2>
                                <Link to="/blog" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-2 group">
                                    VER TODOS OS ARTIGOS <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                            <div className="grid gap-6">
                                {blogPosts.map(post => (
                                    <Link key={post.id} to={`/blog?id=${post.id}`} className="flex flex-col md:flex-row gap-6 p-6 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 hover:shadow-2xl transition-all group">
                                        <div className="w-full md:w-44 h-36 rounded-3xl overflow-hidden shadow-md flex-shrink-0">
                                            <img src={post.imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-2">{post.category}</span>
                                            <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight leading-tight group-hover:text-indigo-600 transition-colors mb-2">{post.title}</h4>
                                            <p className="text-sm text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">{post.summary}</p>
                                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                                                <Calendar className="w-3 h-3" /> {post.date} • Ler Artigo
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* PORTFÓLIO / PRODUTOS */}
                    <section className="space-y-10">
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Portfólio em Destaque</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {products.slice(0, 6).map(prod => (
                                <div key={prod.id} className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all flex flex-col h-full overflow-hidden">
                                    <div className="aspect-square bg-gray-50 dark:bg-zinc-800 overflow-hidden relative">
                                        <img src={prod.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-tight mb-2">{prod.name}</h4>
                                        <span className="text-indigo-600 font-black text-sm">R$ {prod.price.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* SIDEBAR */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 shadow-xl border border-gray-100 dark:border-zinc-800 sticky top-12">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 text-center italic">Canais Oficiais</h4>
                        <div className="space-y-4">
                            <a href={`https://wa.me/${profile.phone?.replace(/\D/g, '')}`} target="_blank" className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95">
                                <MessageCircle className="w-5 h-5" /> FALAR NO WHATSAPP
                            </a>
                            <div className="grid grid-cols-2 gap-3">
                                {profile.socialLinks?.instagram && (
                                    <a href={`https://instagram.com/${profile.socialLinks.instagram}`} target="_blank" className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-zinc-800 rounded-[2rem] hover:bg-pink-50 transition-all group">
                                        <Instagram className="w-6 h-6 text-pink-500 group-hover:scale-110 transition-transform" />
                                        <span className="text-[9px] font-black uppercase text-slate-400">Instagram</span>
                                    </a>
                                )}
                                {profile.socialLinks?.website && (
                                    <a href={profile.socialLinks.website} target="_blank" className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-zinc-800 rounded-[2rem] hover:bg-blue-50 transition-all group">
                                        <Globe className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                                        <span className="text-[9px] font-black uppercase text-slate-400">Website</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden text-center space-y-6">
                        <Award className="w-12 h-12 mx-auto text-brand-primary" />
                        <h4 className="text-xl font-black uppercase italic tracking-tighter">Membro Verificado <br/>Menu de Negócios</h4>
                        <ShieldCheck className="absolute top-0 right-0 w-24 h-24 text-white/10 -mr-8 -mt-8" />
                    </div>
                </div>
            </div>
        </div>

        {/* MODAL AGENDAMENTO */}
        {isSchedModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-fade-in">
                <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-xl shadow-2xl overflow-hidden border border-white/5 animate-scale-in flex flex-col">
                    <div className="bg-indigo-600 p-10 text-white flex justify-between items-center">
                        <div>
                            <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Agendar Consulta</h3>
                            <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mt-1">Solicite um horário com o especialista</p>
                        </div>
                        <button onClick={() => setIsSchedModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                    </div>
                    <form onSubmit={handleSchedSubmit} className="p-12 space-y-8 flex-1 overflow-y-auto">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Seu Nome</label>
                                <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={schedForm.name} onChange={e => setSchedForm({...schedForm, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">WhatsApp</label>
                                <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={schedForm.whatsapp} onChange={e => setSchedForm({...schedForm, whatsapp: e.target.value})} />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-indigo-600 text-white font-black py-6 rounded-[2.5rem] shadow-2xl uppercase tracking-widest text-sm hover:opacity-90 transition-all flex items-center justify-center gap-4">
                            SOLICITAR AGORA <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};