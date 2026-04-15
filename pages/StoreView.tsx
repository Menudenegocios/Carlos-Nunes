import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { Product, Profile, StoreCategory, BlogPost, VitrineComment } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { 
  MapPin, MessageCircle, ArrowLeft, Star, Package, Send, ArrowRight, ArrowUpRight,
  ShoppingBag, Trash2, Plus, Minus, X, Play, Zap, CreditCard, DollarSign, ShieldCheck,
  Calendar, Clock, User, Briefcase, Award, CheckCircle, Instagram, Globe, Info, Target, ListTodo, Handshake,
  QrCode, Download, BookOpen, FileText, Sparkles, MessageSquare, Store, RefreshCw
} from 'lucide-react';

// Componente do Bot de WhatsApp
const WhatsappBotWidget: React.FC<{ profile: Profile }> = ({ profile }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<'welcome' | 'form'>('welcome');
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const config = profile.store_config?.whatsapp_bot;

    if (!config?.enabled) return null;

    const handleStart = () => {
        setStep('form');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // 1. Salvar Lead no CRM
        try {
            await supabaseService.addLeads([{
                user_id: profile.user_id,
                name: formData.name,
                phone: formData.phone,
                source: 'bot_whatsapp',
                notes: 'Lead capturado pelo Atendente Virtual',
                stage: 'new',
                value: 0
            }]);
        } catch (err) {
            console.error('Erro ao salvar lead do bot:', err);
        }

        // 2. Redirecionar para WhatsApp
        const message = `Olá! Sou ${formData.name}. Vim pelo site e gostaria de falar com um atendente.`;
        const whatsappUrl = `https://wa.me/${profile.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        setIsOpen(false);
        setStep('welcome');
        setFormData({ name: '', phone: '' });
    };

    return (
        <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-4 font-sans">
            {/* Janela do Chat */}
            {isOpen && (
                <div className="bg-white w-[320px] rounded-[2rem] rounded-br-none shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                    {/* Cabeçalho */}
                    <div className="bg-[#0F172A] p-6 flex items-center gap-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-transparent"></div>
                        <div className="w-12 h-12 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center overflow-hidden relative z-10">
                            {config.avatar_url ? (
                                <img src={config.avatar_url} className="w-full h-full object-cover" />
                            ) : profile.logo_url ? (
                                <img src={profile.logo_url} className="w-full h-full object-cover" />
                            ) : (
                                <Store className="w-6 h-6 text-emerald-600" />
                            )}
                        </div>
                        <div className="relative z-10">
                            <h4 className="font-black text-white text-sm uppercase tracking-wide">{config.name || 'Atendente Virtual'}</h4>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Online Agora</span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Conteúdo */}
                    <div className="p-6 bg-gray-50 min-h-[250px] flex flex-col">
                        {step === 'welcome' ? (
                            <div className="space-y-6 flex-1">
                                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {config.welcome_message || 'Olá! Bem-vindo Ã  nossa loja. Como posso ajudar você hoje?'}
                                    </p>
                                </div>
                                <button 
                                    onClick={handleStart}
                                    className="w-full py-4 bg-[#00A884] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-[#008f6f] transition-all flex items-center justify-center gap-2 group"
                                >
                                    Falar com Atendente <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-2">Preencha para iniciar</p>
                                <input 
                                    required
                                    autoFocus
                                    type="text" 
                                    placeholder="Seu Nome"
                                    className="w-full p-4 bg-white border border-gray-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                                <input 
                                    required
                                    type="tel" 
                                    placeholder="Seu WhatsApp"
                                    className="w-full p-4 bg-white border border-gray-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                />
                                <button 
                                    type="submit"
                                    className="mt-auto w-full py-4 bg-[#00A884] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-[#008f6f] transition-all flex items-center justify-center gap-2"
                                >
                                    Iniciar Conversa <MessageCircle className="w-4 h-4" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Botão Flutuante (Trigger) */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.3)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative"
            >
                {isOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
                
                {/* Notification Badge */}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                    </span>
                )}
            </button>
        </div>
    );
};

export const StoreView: React.FC = () => {
  const { user_id, slug } = useParams<{ user_id?: string, slug?: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<VitrineComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'inicio' | 'produtos' | 'blog' | 'agenda' | 'video'>('inicio');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  const [leadForm, setLeadForm] = useState({ name: '', email: '', whatsapp: '' });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);
  const [currentUserProfile, setCurrentUserProfile] = useState<Profile | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isPurchaseSuccess, setIsPurchaseSuccess] = useState(false);
  const [purchaseWhatsappUrl, setPurchaseWhatsappUrl] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [menuCashToUse, setMenuCashToUse] = useState<number>(0);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);

  useEffect(() => {
    if (user_id || slug) {
      loadStoreData();
    }
    if (user) {
      loadUserProfile();
    }
  }, [user_id, slug, user]);

  useEffect(() => {
    const banners = profile?.store_config?.banner_images || [];
    if (banners.length > 1) {
        const interval = setInterval(() => {
            setCurrentBannerIdx(prev => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }
  }, [profile]);

  const loadUserProfile = async () => {
    if (!user) return;
    try {
      const profileData = await supabaseService.getProfile(user.id);
      setCurrentUserProfile(profileData);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadStoreData = async () => {
    const identifier = user_id || slug;
    console.log("StoreView: Carregando dados para o identificador:", identifier);
    if (!identifier) return;
    try {
      const prof = await supabaseService.getProfile(identifier);
      console.log("StoreView: Resultado do getProfile:", prof);
      if (!prof) {
        setLoading(false);
        return;
      }

      setProfile(prof);
      const targetUserId = prof.user_id;

      const [prods, cats, allPosts, vitrineComments] = await Promise.all([
        supabaseService.getProducts(targetUserId),
        supabaseService.getStoreCategories(targetUserId),
        supabaseService.getBlogPosts(),
        supabaseService.getVitrineComments(targetUserId)
      ]);
      setProducts(prods);
      setCategories(cats);
      setComments(vitrineComments);
      
      // Lógica \"Top 3\" Artigos Recentes
      const userPosts = allPosts
        .filter(p => p.user_id === targetUserId)
        .sort((a, b) => {
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
    if (!user || !commentText.trim() || !profile) return;

    setIsSubmittingComment(true);
    try {
        await supabaseService.addVitrineComment({
            vitrine_user_id: profile.user_id,
            user_id: user.id,
            user_name: user.name,
            user_avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`,
            content: commentText
        });
        setCommentText('');
        const updatedComments = await supabaseService.getVitrineComments(profile.user_id);
        setComments(updatedComments);
    } catch (err) {
        alert('Erro ao enviar comentário.');
    } finally {
        setIsSubmittingComment(false);
    }
  };

  const handleMenuCashPurchase = async () => {
    if (!user || !selectedProduct || !currentUserProfile) {
        alert("Você precisa estar logado para realizar esta ação.");
        return;
    }

    if (menuCashToUse <= 0) {
        alert("Informe uma quantidade válida de Menu Cash.");
        return;
    }

    const availableBalance = currentUserProfile.menu_cash || 0;
    if (menuCashToUse > availableBalance) {
        alert("Saldo de Menu Cash insuficiente.");
        return;
    }

    const maxMenuCashAllowed = (selectedProduct.price * (selectedProduct.menu_cash_percentage || 0)) / 100;
    if (menuCashToUse > maxMenuCashAllowed) {
        alert(`O limite de Menu Cash para este produto é M$ ${maxMenuCashAllowed.toFixed(2)} (${selectedProduct.menu_cash_percentage}%).`);
        return;
    }

    setIsProcessingPurchase(true);
    try {
        const amountToPay = selectedProduct.price - menuCashToUse;
        const message = `Olá! Acabo de enviar uma proposta de compra via Menu Cash no produto: ${selectedProduct.name}. \n\n💎 *Valor Total*: R$ ${selectedProduct.price.toFixed(2)} \n💎 *Menu Cash utilizado*: M$ ${menuCashToUse.toFixed(2)} \n💎 *Valor Líquido a Pagar*: R$ ${amountToPay.toFixed(2)}`;
        const sellerPhoneClean = profile!.phone?.replace(/\D/g, '');
        const whatsappUrl = `https://wa.me/${sellerPhoneClean}?text=${encodeURIComponent(message)}`;

        await supabaseService.createB2BTransaction({
            buyer_id: user.id,
            buyer_name: user.name,
            buyer_phone: currentUserProfile?.phone || '',
            seller_id: profile!.user_id,
            seller_name: profile!.business_name || profile!.name || 'Vendedor',
            seller_phone: profile!.phone || '',
            product_id: selectedProduct.id,
            total_amount: selectedProduct.price,
            menu_cash_amount: menuCashToUse,
            amount: amountToPay,
            description: `Compra do item: ${selectedProduct.name}`,
            status: 'pending'
        });

        setPurchaseWhatsappUrl(whatsappUrl);
        setIsPurchaseSuccess(true);
        window.open(whatsappUrl, '_blank');

    } catch (err: any) {
        console.error("Erro ao processar compra:", err);
        alert(`Erro ao processar compra: ${err.message || 'Erro desconhecido'}`);
    } finally {
        setIsProcessingPurchase(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black uppercase text-xs tracking-widest text-slate-400">Carregando vitrine graduada...</div>;
  if (!profile) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <User className="w-10 h-10 text-gray-400" />
      </div>
      <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter mb-2">Especialista não encontrado</h2>
      <p className="text-gray-500 max-w-sm">Não conseguimos localizar o perfil solicitado. Verifique o link ou tente novamente mais tarde.</p>
      <Link to="/" className="mt-8 bg-brand-primary text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">Voltar para o Início</Link>
    </div>
  );

  const banner_images = profile.store_config?.banner_images?.length ? profile.store_config.banner_images : [profile.store_config?.cover_url || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200'];

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-brand-dark selection:text-white pb-32">
        
        <div className="fixed top-0 left-0 right-0 z-[100] p-4 flex justify-between items-center pointer-events-none">
            <Link to="/stores" className="p-3 bg-white/20 backdrop-blur-xl text-white rounded-2xl border border-white/20 hover:bg-white/40 transition-all pointer-events-auto">
                <ArrowLeft className="w-5 h-5" />
            </Link>
        </div>

        {/* 1. HERO SLIDER BANNER */}
        <div className="relative h-[60vh] lg:h-[70vh] w-full overflow-hidden bg-slate-900">
            {banner_images.map((img, idx) => (
                <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentBannerIdx ? 'opacity-100' : 'opacity-0'}`}>
                    <img src={img} className="w-full h-full object-cover" alt={`Slide ${idx}`} />
                </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-black/20"></div>
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-7xl px-8 flex flex-col md:flex-row items-end justify-between gap-8 animate-fade-in">
                <div className="flex items-center gap-8 text-center md:text-left">
                   <div className="w-32 h-32 lg:w-44 lg:h-44 rounded-full border-[8px] border-white bg-white shadow-2xl overflow-hidden flex-shrink-0">
                      <img src={profile.logo_url} className="w-full h-full object-cover" />
                   </div>
                   <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <span className="bg-[#0F172A] text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest shadow-xl">ESPECIALISTA</span>
                        </div>
                         <div className="flex items-center gap-3">
                            <h1 className="text-5xl lg:text-7xl font-black text-[#0F172A] uppercase italic tracking-tighter leading-tight title-fix">{profile.business_name}</h1>
                            {profile.has_founder_badge && (
                                <div className="bg-amber-100 text-amber-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase border border-amber-200 shadow-sm animate-pulse mb-4">
                                    Membro Fundador
                                </div>
                            )}
                         </div>
                         <p className="text-2xl font-bold text-[#0F172A] uppercase italic tracking-tight title-fix">{profile.category || 'VENDAS'}</p>
                   </div>
                </div>
            </div>
        </div>

        {/* 2. TAB NAVIGATION */}
        <div className="max-w-7xl mx-auto px-8 -mt-8 relative z-[110]">
            <div className="bg-white p-2 rounded-full shadow-2xl border border-gray-100 flex gap-2 overflow-x-auto scrollbar-hide">
                {[
                    { id: 'inicio', label: 'Início', icon: Info },
                    { id: 'produtos', label: 'Produtos', icon: Package },
                    { id: 'blog', label: 'Blog', icon: BookOpen },
                    { id: 'agenda', label: 'Agenda', icon: Clock },
                    { id: 'video', label: 'Portfólio de vídeos', icon: Play },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-3 px-10 py-4 rounded-full transition-all whitespace-nowrap ${
                            activeTab === tab.id 
                            ? 'bg-[#0F172A] text-white shadow-xl scale-105' 
                            : 'text-slate-400 hover:bg-gray-50'
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
                            <section className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-xl border border-gray-100">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#0F172A]"><Info className="w-5 h-5" /></div>
                                     <h2 className="text-2xl font-black text-[#0F172A] uppercase italic tracking-tighter title-fix">Sobre o Profissional</h2>
                                </div>
                                <p className="text-lg text-gray-600 font-medium leading-relaxed italic">
                                    "{profile.store_config?.about_me || profile.bio || 'Bem-vindo ao meu perfil profissional.'}"
                                </p>
                            </section>

                            {/* PROBLEMAS QUE RESOLVO */}
                            <section className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-xl border border-gray-100">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#0F172A]"><Target className="w-5 h-5" /></div>
                                     <h2 className="text-2xl font-black text-[#0F172A] uppercase italic tracking-tighter title-fix">Problemas que resolvo</h2>
                                </div>
                                <p className="text-lg text-gray-600 font-medium leading-relaxed italic">
                                    "{profile.store_config?.problems_solved || 'Soluções estratégicas para seu negócio.'}"
                                </p>
                            </section>

                            {/* SOLUÇÕES E SERVIÇOS */}
                            <section className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-xl border border-gray-100">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#0F172A]"><ListTodo className="w-5 h-5" /></div>
                                     <h2 className="text-2xl font-black text-[#0F172A] uppercase italic tracking-tighter title-fix">Soluções & Serviços</h2>
                                </div>
                                <p className="text-lg text-gray-600 font-medium leading-relaxed italic">
                                    "{profile.store_config?.solutions || 'Consultoria, Gestão, Treinamento.'}"
                                </p>
                            </section>

                            {/* INTERESSES DE NEGÓCIO */}
                            <section className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-xl border border-gray-100">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#0F172A]"><Handshake className="w-5 h-5" /></div>
                                     <h2 className="text-2xl font-black text-[#0F172A] uppercase italic tracking-tighter title-fix">Interesses de Negócio</h2>
                                </div>
                                <p className="text-lg text-gray-600 font-medium leading-relaxed italic">
                                    "{profile.store_config?.business_interests || 'Aberto a novas conexões e parcerias estratégicas.'}"
                                </p>
                            </section>

                            {/* COMENTÁRIOS */}
                            <section className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-xl border border-gray-100">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#0F172A]"><MessageSquare className="w-5 h-5" /></div>
                                     <h2 className="text-2xl font-black text-[#0F172A] uppercase italic tracking-tighter title-fix">O que dizem sobre mim</h2>
                                </div>
                                
                                {user ? (
                                    <form onSubmit={handleCommentSubmit} className="mb-12 space-y-4">
                                        <textarea 
                                            required
                                            placeholder="DEIXE SEU COMENTÁRIO OU DEPOIMENTO..."
                                            className="w-full bg-gray-50 border-none rounded-3xl p-6 font-bold text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-[#0F172A]/20 transition-all min-h-[120px]"
                                            value={commentText}
                                            onChange={e => setCommentText(e.target.value)}
                                        />
                                        <button 
                                            type="submit"
                                            disabled={isSubmittingComment}
                                            className="px-10 py-4 bg-[#0F172A] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all disabled:opacity-50"
                                        >
                                            {isSubmittingComment ? 'ENVIANDO...' : 'PUBLICAR COMENTÁRIO'}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="mb-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center">
                                        <p className="text-xs font-black text-brand-dark uppercase tracking-widest italic">
                                            Apenas usuários cadastrados podem comentar. <br/>
                                            <Link to="/register" className="underline mt-2 text-indigo-600 hover:text-indigo-800 transition-colors inline-block">Faça seu cadastro para participar</Link>
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-8">
                                    {comments.length > 0 ? comments.map(comment => (
                                        <div key={comment.id} className="flex gap-6 p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                                            <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 shadow-md">
                                                <img src={comment.user_avatar} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <h5 className="font-black text-xs uppercase tracking-widest text-gray-900">{comment.user_name}</h5>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(comment.created_at).toLocaleDateString('pt-BR')}</span>
                                                </div>
                                                <p className="text-gray-600 font-medium italic leading-relaxed">
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
                                        <h2 className="text-3xl font-black text-[#0F172A] uppercase italic tracking-tighter flex items-center gap-3">
                                            <BookOpen className="w-6 h-6 text-[#0F172A]" /> Insights Recentes
                                        </h2>
                                        <Link to="/blog" className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest hover:underline flex items-center gap-2 group">
                                            VER TODOS OS ARTIGOS <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                    <div className="grid gap-6">
                                        {blogPosts.map(post => (
                                            <Link key={post.id} to={`/blog?id=${post.id}`} className="flex flex-col md:flex-row gap-6 p-6 bg-white rounded-[2.5rem] border border-gray-100 hover:shadow-2xl transition-all group">
                                                <div className="w-full md:w-44 h-36 rounded-3xl overflow-hidden shadow-md flex-shrink-0">
                                                    <img src={post.image_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center">
                                                    <span className="text-[9px] font-black text-[#0F172A] uppercase tracking-widest mb-2">{post.category}</span>
                                                    <h4 className="text-xl font-black text-[#0F172A] uppercase italic tracking-tight leading-tight group-hover:text-[#0F172A] transition-colors mb-2">{post.title}</h4>
                                                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">{post.summary}</p>
                                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                                                        <Calendar className="w-3 h-3" /> {post.date} â€¢ Ler Artigo
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
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-dark"><Package className="w-6 h-6" /></div>
                                <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Portfólio em Destaque</h2>
                            </div>
                            <div className="flex flex-col gap-6">
                                {products.map(prod => (
                                    <div key={prod.id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex flex-col md:flex-row items-center gap-6 p-6 overflow-hidden">
                                        <div className="w-full md:w-32 h-32 bg-gray-50 rounded-[1.8rem] overflow-hidden relative flex-shrink-0">
                                            <img src={prod.image_url} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="mb-2">
                                                <h4 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter leading-tight break-words">{prod.name}</h4>
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium line-clamp-3 mb-3 whitespace-pre-line break-words">{prod.description}</p>
                                            <div className="flex flex-col items-start gap-1">
                                                <p className="text-2xl font-black text-emerald-600">{prod.price_on_request ? 'Sob Consulta' : `R$ ${prod.price.toFixed(2)}`}</p>
                                                {prod.accepts_menu_cash && (
                                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                                                        M$ {prod.menu_cash_percentage}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                                            {prod.accepts_menu_cash && (
                                                <button 
                                                    onClick={() => {
                                                        setSelectedProduct(prod);
                                                        setMenuCashToUse(0);
                                                        setIsPurchaseModalOpen(true);
                                                    }}
                                                    className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
                                                >
                                                    <Zap className="w-4 h-4" /> COMPRAR COM MENU CASH
                                                </button>
                                            )}
                                            {prod.external_link ? (
                                                <a 
                                                    href={prod.external_link} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
                                                >
                                                    VER MAIS <ArrowUpRight className="w-4 h-4" />
                                                </a>
                                            ) : (
                                                <a 
                                                    href={`https://wa.me/${profile.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Tenho interesse no produto: ${prod.name}`)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2"
                                                >
                                                    PEDIR <MessageCircle className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {activeTab === 'blog' && (
                        <section className="space-y-10 animate-fade-in">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-dark"><BookOpen className="w-6 h-6" /></div>
                                <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Blog & Insights</h2>
                            </div>
                            <div className="grid gap-6">
                                {blogPosts.length > 0 ? blogPosts.map(post => (
                                    <Link key={post.id} to={`/blog?id=${post.id}`} className="flex flex-col md:flex-row gap-6 p-6 bg-white rounded-[2.5rem] border border-gray-100 hover:shadow-2xl transition-all group">
                                        <div className="w-full md:w-44 h-36 rounded-3xl overflow-hidden shadow-md flex-shrink-0">
                                            <img src={post.image_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <span className="text-[9px] font-black text-brand-dark uppercase tracking-widest mb-2">{post.category}</span>
                                            <h4 className="text-xl font-black text-gray-900 uppercase italic tracking-tight leading-tight group-hover:text-brand-dark transition-colors mb-2">{post.title}</h4>
                                            <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">{post.summary}</p>
                                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                                                <Calendar className="w-3 h-3" /> {post.date} â€¢ Ler Artigo
                                            </div>
                                        </div>
                                    </Link>
                                )) : (
                                    <div className="p-12 text-center bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">Nenhum artigo publicado ainda.</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                    {activeTab === 'agenda' && (
                        <section className="bg-white rounded-[3.5rem] p-4 lg:p-8 shadow-xl border border-gray-100 animate-fade-in overflow-hidden min-h-[800px]">
                            {profile?.store_config?.calendar_link ? (
                                <iframe 
                                    src={profile.store_config.calendar_link}
                                    className="w-full h-[800px] rounded-3xl border-none"
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

                    {activeTab === 'video' && (
                        <section className="space-y-10 animate-fade-in">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-dark"><Play className="w-6 h-6" /></div>
                                <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Portfólio de vídeos</h2>
                            </div>
                            
                            {profile?.store_config?.video_portfolio && profile.store_config.video_portfolio.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {profile.store_config.video_portfolio.map((url, index) => {
                                        // Extrair ID do Reel do Instagram
                                        let embedUrl = url;
                                        if (url.includes('instagram.com/reels/') || url.includes('instagram.com/reel/')) {
                                            const reelId = url.split('/reel/')[1]?.split('/')[0] || url.split('/reels/')[1]?.split('/')[0];
                                            if (reelId) {
                                                embedUrl = `https://www.instagram.com/reel/${reelId}/embed`;
                                            }
                                        }

                                        return (
                                            <div key={index} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 aspect-[9/16]">
                                                <iframe
                                                    src={embedUrl}
                                                    className="w-full h-full border-none"
                                                    scrolling="no"
                                                    allow="encrypted-media"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-12 text-center bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">Nenhum vídeo no portfólio ainda.</p>
                                </div>
                            )}
                        </section>
                    )}
                </div>

                {/* SIDEBAR */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100 sticky top-12">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 text-center italic">Canais Oficiais</h4>
                        <div className="space-y-4">
                            <a href={`https://wa.me/${profile.phone?.replace(/\D/g, '')}`} target="_blank" className="w-full py-5 bg-[#00A884] text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95">
                                <MessageCircle className="w-5 h-5" /> FALAR NO WHATSAPP
                            </a>
                            <div className="grid grid-cols-2 gap-3">
                                {profile.social_links?.instagram && (
                                    <a href={`https://instagram.com/${profile.social_links.instagram}`} target="_blank" className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-[2rem] hover:bg-pink-50 transition-all group">
                                        <Instagram className="w-6 h-6 text-pink-500 group-hover:scale-110 transition-transform" />
                                        <span className="text-[9px] font-black uppercase text-slate-400">Instagram</span>
                                    </a>
                                )}
                                {profile.social_links?.website && (
                                    <a href={profile.social_links.website} target="_blank" className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-[2rem] hover:bg-slate-100 transition-all group">
                                        <Globe className="w-6 h-6 text-[#0F172A] group-hover:scale-110 transition-transform" />
                                        <span className="text-[9px] font-black uppercase text-slate-400">Website</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#0F172A] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden text-center space-y-6">
                        <Award className={`w-12 h-12 mx-auto ${profile.has_founder_badge ? 'text-brand-primary' : 'text-slate-400'}`} />
                        <h4 className="text-xl font-black uppercase italic tracking-tighter title-fix">
                            {profile.has_founder_badge ? 'Membro Fundador' : 'Membro Verificado'} <br/>
                            Menu de Negócios
                        </h4>
                        <ShieldCheck className="absolute top-0 right-0 w-24 h-24 text-white/10 -mr-8 -mt-8" />
                    </div>
                </div>
            </div>
        </div>

        {/* 4. LEAD CAPTURE FORM (BOTTOM) */}
        <div className="max-w-7xl mx-auto px-8 mt-16">
            <section className="bg-[#0F172A] rounded-[2.5rem] p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                
                <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 px-5 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                            <Sparkles className="w-4 h-4 text-brand-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Oportunidade Premium</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-black uppercase italic tracking-tighter leading-tight title-fix">
                            Fale com o <br/> <span className="text-brand-primary">Especialista</span>
                        </h2>
                        <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-md italic">
                            Deixe seus dados abaixo para receber uma consultoria personalizada e transformar seus resultados.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <div className="flex -space-x-3">
                                {[1,2,3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0F172A] bg-slate-800 overflow-hidden">
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
                            if (!profile) return;
                            const targetUserId = profile.user_id;
                            setIsSubmittingLead(true);
                            try {
                                // 1. Envia para o CRM
                                await supabaseService.addLeads([{
                                    user_id: targetUserId,
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
                            className="w-full bg-white text-[#0F172A] py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
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

        {/* 5. WHATSAPP BOT WIDGET */}
        <WhatsappBotWidget profile={profile} />

        {/* 6. MODAL: COMPRA DE PRODUTO (SYNC COM REWARDS.TSX) */}
        {isPurchaseModalOpen && selectedProduct && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
                <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in">
                    <div className="bg-[#0F172A] p-6 text-white flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-black uppercase italic tracking-tighter">
                                {isPurchaseSuccess ? 'Pedido Enviado!' : 'Finalizar Compra'}
                            </h3>
                            <p className="text-[9px] font-black text-emerald-400 tracking-widest mt-0.5 uppercase">
                                {isPurchaseSuccess ? 'Agora fale com o vendedor' : 'Use seu saldo Menu Cash'}
                            </p>
                        </div>
                        <button onClick={() => { setIsPurchaseModalOpen(false); setIsPurchaseSuccess(false); }} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X className="w-6 h-6" /></button>
                    </div>
                    
                    <div className="p-8 space-y-6">
                        {isPurchaseSuccess ? (
                            <div className="text-center space-y-6 py-4">
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                    <CheckCircle className="w-10 h-10" />
                                </div>
                                <h4 className="text-2xl font-black text-gray-900 uppercase italic">Proposta Enviada!</h4>
                                <p className="text-slate-500 font-medium">Sua proposta foi registrada. Para agilizar a aprovação, chame o vendedor agora mesmo no WhatsApp.</p>
                                
                                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col gap-3">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                                        <span>Valor a pagar</span>
                                        <span className="text-gray-900 font-black text-sm">R$ {(selectedProduct.price - menuCashToUse).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                                        <span>Desconto Menu Cash</span>
                                        <span className="text-indigo-600 font-black text-sm">M$ {menuCashToUse.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <a 
                                        href={purchaseWhatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-[#25D366] text-white font-black py-6 rounded-[2.5rem] shadow-xl uppercase tracking-widest text-sm hover:opacity-90 transition-all flex items-center justify-center gap-3"
                                    >
                                        <MessageSquare className="w-5 h-5" /> FALAR NO WHATSAPP
                                    </a>
                                    <button 
                                        onClick={() => { setIsPurchaseModalOpen(false); setIsPurchaseSuccess(false); }}
                                        className="w-full text-slate-400 font-black py-2 uppercase tracking-widest text-[10px] hover:text-slate-600 transition-all"
                                    >
                                        VOLTAR PARA A VITRINE
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Produto Info */}
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                  <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-sm shrink-0">
                                    <img src={selectedProduct.image_url} className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-black text-gray-900 uppercase italic line-clamp-1 leading-tight">{selectedProduct.name}</h4>
                                    <p className="text-xl font-black text-brand-primary">R$ {selectedProduct.price.toFixed(2)}</p>
                                  </div>
                                </div>

                                {/* Info de Saldo e Limite */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Meu Saldo</p>
                                        <p className="text-xl font-black text-indigo-900">M$ {currentUserProfile?.menu_cash?.toFixed(2) || '0.00'}</p>
                                    </div>
                                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Limite de Uso</p>
                                        <p className="text-xl font-black text-emerald-900">{selectedProduct.menu_cash_percentage}% (R$ {(selectedProduct.price * (selectedProduct.menu_cash_percentage || 0) / 100).toFixed(2)})</p>
                                    </div>
                                </div>

                                {/* Input de Valor */}
                                <div>
                                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 text-left">Quanto Menu Cash deseja usar?</label>
                                    <input 
                                        required 
                                        type="number" 
                                        step="0.01" 
                                        max={(selectedProduct.price * (selectedProduct.menu_cash_percentage || 0) / 100)}
                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-base" 
                                        value={menuCashToUse} 
                                        onChange={e => setMenuCashToUse(Number(e.target.value))} 
                                        placeholder="M$ 0.00" 
                                    />
                                </div>

                                {/* Card de Valor Final */}
                                <div className="bg-indigo-600 p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
                                    <div className="relative z-10 flex justify-between items-center">
                                        <div>
                                            <span className="text-[9px] font-black text-indigo-200 uppercase tracking-[0.2em] block mb-1">Total com Desconto</span>
                                            <span className="text-2xl font-black text-white italic">R$ {(selectedProduct.price - menuCashToUse).toFixed(2)}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[9px] font-black text-indigo-200 uppercase tracking-[0.2em] block mb-1">Economia</span>
                                            <span className="text-lg font-black text-emerald-400">- M$ {menuCashToUse.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                </div>

                                <button 
                                    onClick={handleMenuCashPurchase} 
                                    disabled={isProcessingPurchase || menuCashToUse <= 0} 
                                    className="w-full bg-gray-900 text-white font-black py-6 rounded-[2.5rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-brand-primary transition-all active:scale-95 flex items-center justify-center gap-3"
                                >
                                    {isProcessingPurchase ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'CONFIRMAR COMPRA'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
