import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockBackend } from '../services/mockBackend';
import { Product, Profile, StoreCategory, BlogPost, VitrineComment } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { 
  MapPin, MessageCircle, ArrowLeft, Star, Package, Send, ArrowRight, ArrowUpRight,
  ShoppingBag, Trash2, Plus, Minus, X, Play, Zap, CreditCard, DollarSign, ShieldCheck,
  Calendar, Clock, User, Briefcase, Award, CheckCircle, Instagram, Globe, Info, Target, ListTodo, Handshake,
  QrCode, Download, BookOpen, FileText, Sparkles, MessageSquare
} from 'lucide-react';

export const StoreView: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<VitrineComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'inicio' | 'produtos' | 'agendamento' | 'blog' | 'agenda'>('inicio');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isBooking, setIsBooking] = useState(false);
  
  const [leadForm, setLeadForm] = useState({ name: '', email: '', whatsapp: '' });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  
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
      const [prof, prods, cats, allPosts, vitrineComments] = await Promise.all([
        mockBackend.getProfile(userId),
        mockBackend.getProducts(userId),
        mockBackend.getStoreCategories(userId),
        mockBackend.getBlogPosts(),
        mockBackend.getVitrineComments(userId)
      ]);
      setProfile(prof || null);
      setProducts(prods);
      setCategories(cats);
      setComments(vitrineComments);
      
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

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim() || !userId) return;

    setIsSubmittingComment(true);
    try {
        await mockBackend.addVitrineComment({
            vitrineUserId: userId,
            userId: user.id,
            userName: user.name,
            userAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`,
            content: commentText
        });
        setCommentText('');
        const updatedComments = await mockBackend.getVitrineComments(userId);
        setComments(updatedComments);
    } catch (err) {
        alert('Erro ao enviar comentário.');
    } finally {
        setIsSubmittingComment(false);
    }
  };

  // Fix: Implemented handleSchedSubmit to handle form submission
    const handleSchedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !userId) return;
    
    setIsBooking(true);
    try {
        // Salva no backend real (mock)
        await mockBackend.addScheduleItem({
            userId: userId,
            title: `Agendamento: ${profile.businessName}`,
            client: schedForm.name,
            date: selectedDate,
            time: selectedTime || 'Horário a combinar',
            type: 'servico',
            status: 'pending'
        });

        const message = `Olá! Gostaria de confirmar meu agendamento com ${profile.businessName}. \n\n📅 Data: ${new Date(selectedDate).toLocaleDateString('pt-BR')} \n⏰ Horário: ${selectedTime || 'A combinar'} \n👤 Nome: ${schedForm.name} \n📱 WhatsApp: ${schedForm.whatsapp}`;
        const whatsappUrl = `https://wa.me/${profile.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        setIsSchedModalOpen(false);
        setSelectedTime('');
        alert('Agendamento solicitado com sucesso! Você será redirecionado para o WhatsApp para confirmação.');
    } catch (err) {
        alert('Erro ao processar agendamento. Tente novamente.');
    } finally {
        setIsBooking(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black uppercase text-xs tracking-widest text-slate-400">Carregando vitrine de elite...</div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center">Especialista não encontrado.</div>;

  const bannerImages = profile.storeConfig?.bannerImages?.length ? profile.storeConfig.bannerImages : [profile.storeConfig?.coverUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200'];

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#020617] min-h-screen font-sans selection:bg-brand-dark selection:text-white pb-32">
        
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
                            <span className="bg-brand-dark text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest shadow-xl">ESPECIALISTA</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none">{profile.businessName}</h1>
                        <p className="text-xl font-bold text-brand-dark dark:text-brand-primary uppercase italic tracking-tight">{profile.category || 'Membro Elite'}</p>
                   </div>
                </div>
                <button onClick={() => setIsSchedModalOpen(true)} className="bg-brand-dark text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-brand-dark/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
                    <Calendar className="w-5 h-5" /> AGENDAR AGORA
                </button>
            </div>
        </div>

        {/* 2. TAB NAVIGATION */}
        <div className="max-w-7xl mx-auto px-8 -mt-8 relative z-[110]">
            <div className="bg-white dark:bg-zinc-900 p-2 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-zinc-800 flex gap-2 overflow-x-auto scrollbar-hide">
                {[
                    { id: 'inicio', label: 'Início', icon: Info },
                    { id: 'produtos', label: 'Produtos', icon: Package },
                    { id: 'agendamento', label: 'Agendar Agora', icon: Calendar },
                    { id: 'blog', label: 'Blog', icon: BookOpen },
                    { id: 'agenda', label: 'Agenda', icon: Clock },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-3 px-8 py-4 rounded-[1.8rem] transition-all whitespace-nowrap ${
                            activeTab === tab.id 
                            ? 'bg-brand-dark text-white shadow-xl scale-105' 
                            : 'text-slate-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span className="font-black text-[10px] uppercase tracking-widest italic">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* 3. LANDING PAGE CONTENT */}
        <div className="max-w-7xl mx-auto px-8 pt-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                <div className="lg:col-span-8 space-y-12">
                    {activeTab === 'inicio' && (
                        <div className="space-y-12 animate-fade-in">
                            {/* SOBRE */}
                            <section className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 lg:p-10 shadow-xl border border-gray-100 dark:border-zinc-800">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-brand-dark"><Info className="w-5 h-5" /></div>
                                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Sobre o Profissional</h2>
                                </div>
                                <p className="text-lg text-gray-600 dark:text-zinc-400 font-medium leading-relaxed italic">
                                    "{profile.storeConfig?.aboutMe || profile.bio || 'Bem-vindo ao meu perfil profissional.'}"
                                </p>
                            </section>

                            {/* PROBLEMAS QUE RESOLVO */}
                            <section className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 lg:p-10 shadow-xl border border-gray-100 dark:border-zinc-800">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-brand-dark"><Target className="w-5 h-5" /></div>
                                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Problemas que resolvo</h2>
                                </div>
                                <div className="space-y-4">
                                    {(profile.storeConfig?.problemsSolved || 'Soluções estratégicas para seu negócio.').split('\n').map((item, i) => (
                                        <div key={i} className="flex items-start gap-4 p-5 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800">
                                            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                                            <p className="text-base font-bold text-gray-700 dark:text-zinc-300 leading-tight italic">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* SOLUÇÕES E SERVIÇOS */}
                            <section className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 lg:p-10 shadow-xl border border-gray-100 dark:border-zinc-800">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-brand-dark"><ListTodo className="w-5 h-5" /></div>
                                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Soluções & Serviços</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {(profile.storeConfig?.solutions || 'Consultoria, Gestão, Treinamento.').split(',').map((item, i) => (
                                        <div key={i} className="p-5 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800 flex items-center gap-4 group hover:bg-slate-100 dark:hover:bg-slate-800/20 transition-all">
                                            <div className="w-7 h-7 bg-white dark:bg-zinc-900 rounded-lg flex items-center justify-center text-brand-dark shadow-sm"><Zap className="w-3.5 h-3.5" /></div>
                                            <span className="font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-zinc-400">{item.trim()}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* INTERESSES DE NEGÓCIO */}
                            <section className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 lg:p-10 shadow-xl border border-gray-100 dark:border-zinc-800">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-brand-dark"><Handshake className="w-5 h-5" /></div>
                                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Interesses de Negócio</h2>
                                </div>
                                <p className="text-lg text-gray-600 dark:text-zinc-400 font-medium leading-relaxed italic">
                                    "{profile.storeConfig?.businessInterests || 'Aberto a novas conexões e parcerias estratégicas.'}"
                                </p>
                            </section>

                            {/* COMENTÁRIOS */}
                            <section className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 lg:p-10 shadow-xl border border-gray-100 dark:border-zinc-800">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-brand-dark"><MessageSquare className="w-5 h-5" /></div>
                                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">O que dizem sobre mim</h2>
                                </div>
                                
                                {user ? (
                                    <form onSubmit={handleCommentSubmit} className="mb-12 space-y-4">
                                        <textarea 
                                            required
                                            placeholder="DEIXE SEU COMENTÁRIO OU DEPOIMENTO..."
                                            className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-3xl p-6 font-bold text-sm dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-dark/20 transition-all min-h-[120px]"
                                            value={commentText}
                                            onChange={e => setCommentText(e.target.value)}
                                        />
                                        <button 
                                            type="submit"
                                            disabled={isSubmittingComment}
                                            className="px-10 py-4 bg-brand-dark text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all disabled:opacity-50"
                                        >
                                            {isSubmittingComment ? 'ENVIANDO...' : 'PUBLICAR COMENTÁRIO'}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="mb-12 p-8 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 text-center">
                                        <p className="text-xs font-black text-brand-dark dark:text-brand-primary uppercase tracking-widest italic">
                                            Apenas usuários cadastrados podem comentar. <br/>
                                            <Link to="/auth" className="underline mt-2 inline-block">Faça login para participar</Link>
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-8">
                                    {comments.length > 0 ? comments.map(comment => (
                                        <div key={comment.id} className="flex gap-6 p-8 bg-gray-50 dark:bg-zinc-800/30 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800/50">
                                            <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 shadow-md">
                                                <img src={comment.userAvatar} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <h5 className="font-black text-xs uppercase tracking-widest text-gray-900 dark:text-white">{comment.userName}</h5>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(comment.createdAt).toLocaleDateString('pt-BR')}</span>
                                                </div>
                                                <p className="text-gray-600 dark:text-zinc-400 font-medium italic leading-relaxed">
                                                    "{comment.content}"
                                                </p>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-center text-slate-400 font-bold uppercase tracking-widest text-[10px] italic py-10">Seja o primeiro a comentar!</p>
                                    )}
                                </div>
                            </section>

                            {/* SEÇÃO BLOG (Apenas 3 últimos) */}
                            {blogPosts.length > 0 && (
                                <section className="space-y-10">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter flex items-center gap-3">
                                            <BookOpen className="w-6 h-6 text-brand-dark" /> Insights Recentes
                                        </h2>
                                        <Link to="/blog" className="text-[10px] font-black text-brand-dark uppercase tracking-widest hover:underline flex items-center gap-2 group">
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
                                                    <span className="text-[9px] font-black text-brand-dark uppercase tracking-widest mb-2">{post.category}</span>
                                                    <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight leading-tight group-hover:text-brand-dark transition-colors mb-2">{post.title}</h4>
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
                        </div>
                    )}

                    {activeTab === 'produtos' && (
                        <section className="space-y-10 animate-fade-in">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-brand-dark"><Package className="w-6 h-6" /></div>
                                <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Portfólio em Destaque</h2>
                            </div>
                            <div className="grid md:grid-cols-3 gap-8">
                                {products.map(prod => (
                                    <div key={prod.id} className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all flex flex-col h-full overflow-hidden">
                                        <div className="aspect-square bg-gray-50 dark:bg-zinc-800 overflow-hidden relative">
                                            <img src={prod.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-tight mb-2">{prod.name}</h4>
                                            <div className="flex items-center justify-between mt-auto pt-4">
                                                <span className="text-brand-dark font-black text-sm">R$ {prod.price.toFixed(2)}</span>
                                                {prod.externalLink ? (
                                                    <a 
                                                        href={prod.externalLink} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="px-4 py-2 bg-brand-dark text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
                                                    >
                                                        VER MAIS <ArrowUpRight className="w-3 h-3" />
                                                    </a>
                                                ) : (
                                                    <a 
                                                        href={`https://wa.me/${profile.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Tenho interesse no produto: ${prod.name}`)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2"
                                                    >
                                                        PEDIR <MessageCircle className="w-3 h-3" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {activeTab === 'agendamento' && (
                        <section className="bg-white dark:bg-zinc-900 rounded-[3.5rem] p-10 lg:p-16 shadow-xl border border-gray-100 dark:border-zinc-800 animate-fade-in space-y-12">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-brand-dark"><Calendar className="w-6 h-6" /></div>
                                <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Central de Agendamentos</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-12">
                                {/* CALENDÁRIO SIMPLIFICADO */}
                                <div className="space-y-6">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Selecione o Dia</label>
                                    <input 
                                        type="date" 
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-6 font-black text-lg dark:text-white focus:ring-2 focus:ring-brand-dark/20 transition-all"
                                        value={selectedDate}
                                        onChange={e => setSelectedDate(e.target.value)}
                                    />
                                    <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                                        <p className="text-xs font-bold text-brand-dark dark:text-brand-primary leading-relaxed italic">
                                            "Os horários exibidos são baseados na disponibilidade em tempo real do especialista."
                                        </p>
                                    </div>
                                </div>

                                {/* HORÁRIOS */}
                                <div className="space-y-6">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Horários Disponíveis</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(time => (
                                            <button
                                                key={time}
                                                onClick={() => setSelectedTime(time)}
                                                className={`py-4 rounded-2xl font-black text-xs transition-all border ${
                                                    selectedTime === time 
                                                    ? 'bg-brand-dark text-white border-brand-dark shadow-lg scale-105' 
                                                    : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border-gray-100 dark:border-zinc-700 hover:border-brand-dark'
                                                }`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                    {selectedTime && (
                                        <button 
                                            onClick={() => setIsSchedModalOpen(true)}
                                            className="w-full py-6 bg-brand-dark text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-brand-dark/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
                                        >
                                            RESERVAR PARA {selectedTime} <ArrowRight className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}
                    {activeTab === 'blog' && (
                        <section className="space-y-10 animate-fade-in">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-brand-dark"><BookOpen className="w-6 h-6" /></div>
                                <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Blog & Insights</h2>
                            </div>
                            <div className="grid gap-6">
                                {blogPosts.length > 0 ? blogPosts.map(post => (
                                    <Link key={post.id} to={`/blog?id=${post.id}`} className="flex flex-col md:flex-row gap-6 p-6 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 hover:shadow-2xl transition-all group">
                                        <div className="w-full md:w-44 h-36 rounded-3xl overflow-hidden shadow-md flex-shrink-0">
                                            <img src={post.imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <span className="text-[9px] font-black text-brand-dark uppercase tracking-widest mb-2">{post.category}</span>
                                            <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight leading-tight group-hover:text-brand-dark transition-colors mb-2">{post.title}</h4>
                                            <p className="text-sm text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">{post.summary}</p>
                                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                                                <Calendar className="w-3 h-3" /> {post.date} • Ler Artigo
                                            </div>
                                        </div>
                                    </Link>
                                )) : (
                                    <div className="p-12 text-center bg-gray-50 dark:bg-zinc-800/50 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-zinc-700">
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">Nenhum artigo publicado ainda.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                    {activeTab === 'agenda' && (
                        <section className="bg-white dark:bg-zinc-900 rounded-[3.5rem] p-4 lg:p-8 shadow-xl border border-gray-100 dark:border-zinc-800 animate-fade-in overflow-hidden min-h-[800px]">
                            {profile?.storeConfig?.calendarLink ? (
                                <iframe 
                                    src={profile.storeConfig.calendarLink}
                                    className="w-full h-[800px] rounded-3xl"
                                    frameBorder="0"
                                    title="Agenda"
                                />
                            ) : (
                                <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-4">
                                    <Calendar className="w-16 h-16 text-slate-200" />
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">Agenda externa não configurada.</p>
                                </div>
                            )}
                        </section>
                    )}
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
                                    <a href={profile.socialLinks.website} target="_blank" className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-zinc-800 rounded-[2rem] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group">
                                        <Globe className="w-6 h-6 text-brand-dark group-hover:scale-110 transition-transform" />
                                        <span className="text-[9px] font-black uppercase text-slate-400">Website</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="bg-brand-dark rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden text-center space-y-6">
                        <Award className="w-12 h-12 mx-auto text-brand-primary" />
                        <h4 className="text-xl font-black uppercase italic tracking-tighter">Membro Verificado <br/>Menu de Negócios</h4>
                        <ShieldCheck className="absolute top-0 right-0 w-24 h-24 text-white/10 -mr-8 -mt-8" />
                    </div>
                </div>
            </div>
        </div>

        {/* 4. LEAD CAPTURE FORM (BOTTOM) */}
        <div className="max-w-7xl mx-auto px-8 mt-16">
            <section className="bg-brand-dark rounded-[2.5rem] p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                
                <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 px-5 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                            <Sparkles className="w-4 h-4 text-brand-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Oportunidade de Elite</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-black uppercase italic tracking-tighter leading-[0.9]">
                            Fale com o <br/> <span className="text-brand-primary">Especialista</span>
                        </h2>
                        <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-md italic">
                            Deixe seus dados abaixo para receber uma consultoria personalizada e transformar seus resultados.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <div className="flex -space-x-3">
                                {[1,2,3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-dark bg-slate-800 overflow-hidden">
                                        <img src={`https://picsum.photos/seed/${i+10}/100/100`} />
                                    </div>
                                ))}
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">+500 Clientes Atendidos</p>
                        </div>
                    </div>

                    <form 
                        onSubmit={async (e) => {
                            e.preventDefault();
                            if (!userId || !profile) return;
                            setIsSubmittingLead(true);
                            try {
                                // 1. Envia para o CRM (mockBackend)
                                await mockBackend.addLeads([{
                                    userId: userId,
                                    name: leadForm.name,
                                    phone: leadForm.whatsapp,
                                    source: 'vitrine_publica',
                                    notes: `Lead vindo da vitrine pública. Email: ${leadForm.email}`,
                                    stage: 'new',
                                    value: 0
                                }]);

                                // 2. Envia para o WhatsApp
                                const message = `Olá! Vi seu perfil no Menu de Negócios e gostaria de mais informações. \n\n👤 Nome: ${leadForm.name} \n📧 Email: ${leadForm.email} \n📱 WhatsApp: ${leadForm.whatsapp}`;
                                const whatsappUrl = `https://wa.me/${profile.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
                                window.open(whatsappUrl, '_blank');

                                setLeadForm({ name: '', email: '', whatsapp: '' });
                                alert('Dados enviados com sucesso! Redirecionando para o WhatsApp...');
                            } catch (err) {
                                alert('Erro ao enviar dados. Tente novamente.');
                            } finally {
                                setIsSubmittingLead(false);
                            }
                        }}
                        className="bg-white/5 backdrop-blur-xl p-6 lg:p-10 rounded-[2rem] border border-white/10 space-y-6 shadow-inner"
                    >
                        <div className="space-y-4">
                            <input 
                                required
                                type="text" 
                                placeholder="NOME COMPLETO"
                                className="w-full bg-white/10 border border-white/10 rounded-2xl p-5 font-black text-xs uppercase tracking-widest placeholder:text-white/40 focus:bg-white/20 focus:ring-0 transition-all outline-none"
                                value={leadForm.name}
                                onChange={e => setLeadForm({...leadForm, name: e.target.value})}
                            />
                            <input 
                                required
                                type="email" 
                                placeholder="SEU MELHOR E-MAIL"
                                className="w-full bg-white/10 border border-white/10 rounded-2xl p-5 font-black text-xs uppercase tracking-widest placeholder:text-white/40 focus:bg-white/20 focus:ring-0 transition-all outline-none"
                                value={leadForm.email}
                                onChange={e => setLeadForm({...leadForm, email: e.target.value})}
                            />
                            <input 
                                required
                                type="text" 
                                placeholder="WHATSAPP (COM DDD)"
                                className="w-full bg-white/10 border border-white/10 rounded-2xl p-5 font-black text-xs uppercase tracking-widest placeholder:text-white/40 focus:bg-white/20 focus:ring-0 transition-all outline-none"
                                value={leadForm.whatsapp}
                                onChange={e => setLeadForm({...leadForm, whatsapp: e.target.value})}
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={isSubmittingLead}
                            className="w-full bg-white text-brand-dark py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                        >
                            {isSubmittingLead ? 'ENVIANDO...' : 'QUERO ME CONECTAR'} <ArrowRight className="w-5 h-5" />
                        </button>
                        <p className="text-[9px] text-center text-white/40 font-bold uppercase tracking-widest">
                            Seus dados estão protegidos pela nossa política de privacidade.
                        </p>
                    </form>
                </div>
            </section>
        </div>

        {/* MODAL AGENDAMENTO */}
        {isSchedModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-fade-in">
                <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-xl shadow-2xl overflow-hidden border border-white/5 animate-scale-in flex flex-col">
                    <div className="bg-brand-dark p-10 text-white flex justify-between items-center">
                        <div>
                            <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Confirmar Reserva</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                {new Date(selectedDate).toLocaleDateString('pt-BR')} às {selectedTime || 'A combinar'}
                            </p>
                        </div>
                        <button onClick={() => setIsSchedModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                    </div>
                    <form onSubmit={handleSchedSubmit} className="p-12 space-y-8 flex-1 overflow-y-auto">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Seu Nome Completo</label>
                                <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={schedForm.name} onChange={e => setSchedForm({...schedForm, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">WhatsApp para Contato</label>
                                <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={schedForm.whatsapp} onChange={e => setSchedForm({...schedForm, whatsapp: e.target.value})} />
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            disabled={isBooking}
                            className="w-full bg-brand-dark text-white font-black py-6 rounded-[2.5rem] shadow-2xl uppercase tracking-widest text-sm hover:opacity-90 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                        >
                            {isBooking ? 'PROCESSANDO...' : 'CONFIRMAR AGENDAMENTO'} <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};