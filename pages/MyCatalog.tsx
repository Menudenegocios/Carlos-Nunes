
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { Product, Profile, StoreCategory, BlogPost, Coupon } from '../types';
import { 
  Store, LayoutGrid, Package, CheckCircle, 
  Plus, Trash2, Edit2, 
  Image as ImageIcon, Eye,
  X, RefreshCw, Save, Camera, Home as HomeIcon,
  Phone, MapPin, MessageCircle, 
  Briefcase, Quote, Smartphone, ArrowRight, Star, Settings, GripVertical,
  Youtube, Globe, CreditCard, DollarSign, Wallet, Zap, ShieldCheck,
  Lock, Crown, User, Info, ListChecks, Target, Heart, Instagram,
  Share2, Link as LinkIcon, Tag, BookOpen, FileText, Send, AlignLeft, Type,
  Calendar, Ticket, Search, BarChart, MessageSquare
} from 'lucide-react';
import { SectionLanding } from '../components/SectionLanding';
import { Link, useNavigate } from 'react-router-dom';

// Helper para redimensionar imagem para economizar localStorage
const resizeImage = (base64Str: string, maxWidth = 800, maxHeight = 800): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7)); // Comprime para JPEG 70%
    };
  });
};

export const MyCatalog: React.FC = () => {
  const { user, realAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState<'home' | 'identity' | 'blog' | 'products' | 'landing'>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [storeCategories, setStoreCategories] = useState<StoreCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({ 
    name: '', description: '', price: 0, category: 'Geral', available: true, imageUrl: '', storeCategoryId: '', externalLink: ''
  });

  const [categoryForm, setCategoryForm] = useState({ name: '' });

  const [couponForm, setCouponForm] = useState<Partial<Coupon>>({
    code: '', title: '', discount: '', type: 'percentage', pointsReward: 0, description: '', expiryDate: '', active: true
  });

  // Blog Form State
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    category: 'Marketing',
    summary: '',
    content: '',
    imageUrl: ''
  });

  const fileInputLogoRef = useRef<HTMLInputElement>(null);
  const fileInputProductRef = useRef<HTMLInputElement>(null);
  const fileInputBlogRef = useRef<HTMLInputElement>(null);
  const ogImageInputRef = useRef<HTMLInputElement>(null);
  const botAvatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const isAdmin = user?.role === 'admin' || realAdmin?.role === 'admin';
  const hasAccess = isAdmin || (user?.plan !== 'profissionais');

  useEffect(() => { if (user && hasAccess) loadData(); }, [user, hasAccess, activeSubTab]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
        const [prof, cats, prods, allPosts, allCoupons] = await Promise.all([
            mockBackend.getProfile(user.id),
            mockBackend.getStoreCategories(user.id),
            mockBackend.getProducts(user.id),
            mockBackend.getBlogPosts(),
            mockBackend.getCoupons(user.id)
        ]);
        
        setProfile(prof || { 
            userId: user.id, 
            vitrineCategory: 'Produtos',
            socialLinks: { instagram: '', whatsapp: '', website: '' }, 
            storeConfig: { 
                paymentMethods: { pix: true, card: true, cash: true, credit: true },
                socialLinks: { instagram: '', whatsapp: '', website: '' },
                businessType: 'local_business',
                bannerImages: []
            } 
        } as any);
        setStoreCategories(cats);
        setProducts(prods || []);
        setBlogPosts(allPosts.filter(p => p.userId === user.id));
        setCoupons(allCoupons || []);
    } finally { setIsLoading(false); }
  };

  if (!hasAccess) {
      return (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
              <div className="w-24 h-24 bg-orange-50 dark:bg-orange-950/20 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl border border-orange-100 dark:border-orange-900/30">
                  <Lock className="w-10 h-10 text-[#F67C01]" />
              </div>
              <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-4">Recurso do Plano PRO</h2>
              <p className="text-gray-500 dark:text-zinc-400 max-w-md text-lg font-medium leading-relaxed mb-10">
                  A gestão de Catálogo, Blog e Loja Virtual está disponível apenas para membros nos níveis <span className="text-indigo-600 font-bold">PRO</span> e <span className="text-emerald-600 font-bold">Business</span>.
              </p>
              <Link to="/plans" className="bg-[#F67C01] text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
                  <Crown className="w-5 h-5" /> FAZER UPGRADE AGORA
              </Link>
          </div>
      );
  }

  const handleProfileSave = async (redirect = false) => {
    console.log('handleProfileSave called', { redirect, profile });
    if (!user) return;
    setIsSaving(true);
    try {
      // Se for redirecionar (clicou em Salvar & Publicar), força a publicação
      const profileToSave = redirect ? { ...profile, isPublished: true } : profile;
      console.log('Saving profile:', profileToSave);
      
      await mockBackend.updateProfile(user.id, profileToSave);
      console.log('Profile updated successfully');
      
      // Atualiza o estado local para refletir a mudança
      if (redirect) {
        setProfile(profileToSave);
        console.log('Redirecting to vitrine...');
        navigate('/vitrine');
      } else {
        alert('Configurações salvas com sucesso!');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally { setIsSaving(false); }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'coverUrl' | 'productUrl' | 'blogUrl' | 'banner0' | 'banner1' | 'banner2' | 'ogImage' | 'botAvatar') => {
    const file = e.target.files?.[0];
    if (file && field) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        const isWide = field === 'coverUrl' || (field && field.startsWith('banner')) || field === 'blogUrl' || field === 'ogImage';
        const compressed = await resizeImage(result, isWide ? 1000 : 500, isWide ? 600 : 500);

        if (field === 'logoUrl') setProfile(prev => ({ ...prev, logoUrl: compressed }));
        else if (field === 'coverUrl') setProfile(prev => ({ ...prev, storeConfig: { ...prev.storeConfig, coverUrl: compressed } }));
        else if (field === 'productUrl') setProductForm(prev => ({ ...prev, imageUrl: compressed }));
        else if (field === 'blogUrl') setBlogForm(prev => ({ ...prev, imageUrl: compressed }));
        else if (field === 'ogImage') setProfile(prev => ({ ...prev, storeConfig: { ...prev.storeConfig, seo: { ...prev.storeConfig?.seo, ogImage: compressed } } }));
        else if (field === 'botAvatar') setProfile(prev => ({ ...prev, storeConfig: { ...prev.storeConfig, whatsappBot: { ...prev.storeConfig?.whatsappBot, avatarUrl: compressed, enabled: prev.storeConfig?.whatsappBot?.enabled ?? false } } }));
        else if (field && field.startsWith('banner')) {
            const index = parseInt(field.replace('banner', ''));
            const currentBanners = [...(profile.storeConfig?.bannerImages || [])];
            currentBanners[index] = compressed;
            setProfile(prev => ({ ...prev, storeConfig: { ...prev.storeConfig, bannerImages: currentBanners } }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      if (editingProduct) {
        await mockBackend.createProduct({ ...editingProduct, ...productForm } as Product);
      } else {
        await mockBackend.createProduct({ ...productForm, userId: user.id } as Product);
      }
      setIsProductModalOpen(false);
      loadData();
    } finally { setIsSaving(false); }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
        if (editingBlogPost) {
            await mockBackend.deleteBlogPost(editingBlogPost.id);
        }
        await mockBackend.createBlogPost({
            ...blogForm,
            userId: user.id,
            author: profile.businessName || user.name,
            date: new Date().toLocaleDateString('pt-BR')
        });
        setIsBlogModalOpen(false);
        loadData();
    } finally { setIsSaving(false); }
  };

  const handleDeleteBlog = async (id: string) => {
    if(!window.confirm('Excluir este artigo permanentemente?')) return;
    await mockBackend.deleteBlogPost(id);
    loadData();
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !categoryForm.name) return;
    setIsSaving(true);
    try {
        await mockBackend.createStoreCategory(user.id, categoryForm.name);
        setCategoryForm({ name: '' });
        setIsCategoryModalOpen(false);
        loadData();
    } finally { setIsSaving(false); }
  };

  const handleDeleteCategory = async (id: string) => {
    if(!user || !window.confirm('Excluir esta categoria? Os itens vinculados a ela ficarão como "Sem Categoria".')) return;
    await mockBackend.deleteStoreCategory(id, user.id);
    loadData();
  };

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
        await mockBackend.createCoupon({
            ...couponForm,
            userId: user.id
        } as any);
        setIsCouponModalOpen(false);
        setCouponForm({ code: '', title: '', discount: '', type: 'percentage', pointsReward: 0, description: '', expiryDate: '', active: true });
        loadData();
    } finally { setIsSaving(false); }
  };

  const handleDeleteCoupon = async (id: string) => {
    if(!user || !window.confirm('Excluir este cupom?')) return;
    await mockBackend.deleteCoupon(id, user.id);
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-fade-in">
      <div className="bg-[#0F172A] rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/5 rounded-[1.8rem] flex items-center justify-center border border-white/10 shadow-inner">
               <Package className="w-10 h-10 text-[#F67C01]" />
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                MINHA VITRINE
              </h2>
              <p className="text-slate-400 text-xs font-bold tracking-[0.1em] mt-2">Sua vitrine inteligente.</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Link to={`/store/${user?.id}`} className="bg-white/5 text-white border border-white/10 px-8 py-5 rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center gap-3">
              <Eye className="w-5 h-5" /> VER MINHA VITRINE
            </Link>
          </div>
        </div>

        <div className="bg-white/5 rounded-[2.5rem] p-1 mt-10 flex gap-0.5 overflow-x-auto scrollbar-hide border border-white/5">
          {[
            { id: 'home', label: 'Início', desc: 'Resumo', icon: HomeIcon },
            { id: 'identity', label: 'Identidade', desc: 'Marca e Logo', icon: Store },
            { id: 'blog', label: 'Blog & SEO', desc: 'Gerar Autoridade', icon: BookOpen },
            { id: 'products', label: 'Produtos', desc: 'Itens & Categorias', icon: Package },
            { id: 'landing', label: 'Configurações', desc: 'Especialista', icon: Smartphone },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveSubTab(tab.id as any)} className={`flex items-center gap-3 px-6 py-3.5 rounded-[1.8rem] transition-all min-w-[160px] ${activeSubTab === tab.id ? 'bg-[#F67C01] text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}>
              <tab.icon className={`w-4 h-4 ${activeSubTab === tab.id ? 'text-white' : 'text-[#F67C01]'}`} />
              <div className="text-left">
                <p className="font-black text-[10px] tracking-widest uppercase italic leading-none mb-1">{tab.label}</p>
                <p className={`text-[8px] font-medium opacity-60 ${activeSubTab === tab.id ? 'text-white' : ''}`}>{tab.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 px-2">
        {activeSubTab === 'home' && (
          <SectionLanding title="Sua Vitrine é seu palco digital." subtitle="Ecossistema de Conteúdo" description="Gerencie seu catálogo de produtos, escreva artigos de autoridade e configure sua Landing Page em um único lugar." benefits={["Cadastro ilimitado de produtos", "Blog integrado ao diretório global", "Design focado em conversão mobile", "Sincronização instantânea"]} youtubeId="dQw4w9WgXcQ" ctaLabel="COMEÇAR CONFIGURAÇÃO" onStart={() => setActiveSubTab('identity')} icon={LayoutGrid} accentColor="brand" />
        )}

        <div className={`${activeSubTab === 'home' ? 'hidden' : 'bg-white dark:bg-zinc-900 rounded-[3rem] p-8 md:p-12 border border-gray-100 shadow-xl min-h-[500px] animate-fade-in'}`}>
            {activeSubTab === 'identity' && (
                <div className="max-w-4xl mx-auto space-y-10">
                   <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-tight">Identidade Visual</h3>
                      <button onClick={() => handleProfileSave(false)} disabled={isSaving} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Save className="w-4 h-4" /> SALVAR ALTERAÇÕES</button>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <button 
                         onClick={() => setProfile(prev => ({ ...prev, storeConfig: { ...prev.storeConfig, businessType: 'local_business' } }))}
                         className={`p-6 rounded-[2rem] border-2 flex flex-col items-center gap-4 transition-all ${profile.storeConfig?.businessType === 'local_business' ? 'border-brand-primary bg-white dark:bg-zinc-900 shadow-xl' : 'border-transparent text-slate-400'}`}
                      >
                         <Store className={`w-10 h-10 ${profile.storeConfig?.businessType === 'local_business' ? 'text-brand-primary' : ''}`} />
                         <div className="text-center">
                            <p className="font-black text-[10px] uppercase">Estabelecimento / Loja</p>
                         </div>
                      </button>
                      <button 
                         onClick={() => setProfile(prev => ({ ...prev, storeConfig: { ...prev.storeConfig, businessType: 'professional' } }))}
                         className={`p-6 rounded-[2rem] border-2 flex flex-col items-center gap-4 transition-all ${profile.storeConfig?.businessType === 'professional' ? 'border-indigo-600 bg-white dark:bg-zinc-900 shadow-xl' : 'border-transparent text-slate-400'}`}
                      >
                         <User className={`w-10 h-10 ${profile.storeConfig?.businessType === 'professional' ? 'text-indigo-600' : ''}`} />
                         <div className="text-center">
                            <p className="font-black text-[10px] uppercase">Profissional Especialista</p>
                         </div>
                      </button>
                   </div>

                   <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Nome de Exibição</label>
                            <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={profile.businessName || ''} onChange={e => setProfile({...profile, businessName: e.target.value})} />
                         </div>
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Slogan / Categoria</label>
                            <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={profile.category || ''} onChange={e => setProfile({...profile, category: e.target.value})} placeholder="Ex: Advogado Criminalista" />
                         </div>
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Endereço Completo</label>
                            <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={profile.storeConfig?.address || ''} onChange={e => setProfile({...profile, storeConfig: {...profile.storeConfig, address: e.target.value}})} placeholder="Rua, Número, Bairro" />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Cidade</label>
                                <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={profile.storeConfig?.city || ''} onChange={e => setProfile({...profile, storeConfig: {...profile.storeConfig, city: e.target.value}})} placeholder="São Paulo" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Link Google Maps</label>
                                <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={profile.storeConfig?.googleMapsLink || ''} onChange={e => setProfile({...profile, storeConfig: {...profile.storeConfig, googleMapsLink: e.target.value}})} placeholder="https://maps.app.goo.gl/..." />
                            </div>
                         </div>
                      </div>
                      <div className="space-y-6">
                         <div className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full bg-white shadow-lg overflow-hidden mb-3 relative group cursor-pointer" onClick={() => fileInputLogoRef.current?.click()}>
                               {profile.logoUrl ? <img src={profile.logoUrl} className="w-full h-full object-cover" /> : <Camera className="w-6 h-6 text-gray-300 m-7" />}
                               <input type="file" ref={fileInputLogoRef} hidden onChange={e => handleImageUpload(e, 'logoUrl')} />
                            </div>
                            <span className="text-[10px] font-black uppercase text-slate-400">Trocar {profile.storeConfig?.businessType === 'professional' ? 'Foto de Perfil' : 'Logotipo'}</span>
                         </div>
                      </div>
                   </div>

                   {/* SEÇÃO BOT WHATSAPP */}
                   <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-xl mt-12">
                      <div className="flex items-center gap-4 mb-8">
                          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl text-emerald-600">
                              <MessageSquare className="w-8 h-8" />
                          </div>
                          <div>
                              <h3 className="text-2xl font-black uppercase italic tracking-tight text-gray-900 dark:text-white">
                                  Atendente Virtual (Bot)
                              </h3>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                  Capture leads antes de iniciar a conversa no WhatsApp.
                              </p>
                          </div>
                      </div>

                      <div className="grid lg:grid-cols-2 gap-12">
                          {/* Configurações */}
                          <div className="space-y-6">
                              <div className="flex items-center justify-between bg-gray-50 dark:bg-zinc-800 p-6 rounded-2xl">
                                  <span className="font-black text-sm uppercase text-gray-700 dark:text-gray-300">Ativar Bot Vendedor?</span>
                                  <button 
                                      onClick={() => setProfile(prev => ({ ...prev, storeConfig: { ...prev.storeConfig, whatsappBot: { ...prev.storeConfig?.whatsappBot, enabled: !prev.storeConfig?.whatsappBot?.enabled } } }))}
                                      className={`w-14 h-8 rounded-full transition-all relative ${profile.storeConfig?.whatsappBot?.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                  >
                                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${profile.storeConfig?.whatsappBot?.enabled ? 'left-7' : 'left-1'}`} />
                                  </button>
                              </div>

                              <div>
                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nome do Atendente</label>
                                  <input 
                                      type="text" 
                                      className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800 font-bold dark:text-white" 
                                      placeholder="Ex: Assistente Virtual" 
                                      value={profile.storeConfig?.whatsappBot?.name || ''}
                                      onChange={e => setProfile(prev => ({ ...prev, storeConfig: { ...prev.storeConfig, whatsappBot: { ...prev.storeConfig?.whatsappBot, enabled: prev.storeConfig?.whatsappBot?.enabled ?? false, name: e.target.value } } }))}
                                  />
                              </div>

                              <div>
                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Foto do Atendente</label>
                                  <div className="flex items-center gap-4">
                                      <div 
                                          className="w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-700 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border-2 border-dashed border-gray-300 dark:border-zinc-600"
                                          onClick={() => botAvatarInputRef.current?.click()}
                                      >
                                          {profile.storeConfig?.whatsappBot?.avatarUrl ? (
                                              <img src={profile.storeConfig.whatsappBot.avatarUrl} className="w-full h-full object-cover" />
                                          ) : (
                                              <Camera className="w-6 h-6 text-gray-400" />
                                          )}
                                      </div>
                                      <div className="flex-1">
                                          <button 
                                              onClick={() => botAvatarInputRef.current?.click()}
                                              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                                          >
                                              Carregar foto
                                          </button>
                                          <p className="text-[10px] text-slate-400">Recomendado: 200x200px (Rosto)</p>
                                      </div>
                                      <input type="file" ref={botAvatarInputRef} hidden accept="image/*" onChange={e => handleImageUpload(e, 'botAvatar')} />
                                  </div>
                              </div>

                              <div>
                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mensagem de Boas-vindas</label>
                                  <textarea 
                                      className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800 font-bold dark:text-white h-24 resize-none" 
                                      placeholder="Ex: Olá! Bem-vindo à nossa loja. Como posso ajudar você hoje?" 
                                      value={profile.storeConfig?.whatsappBot?.welcomeMessage || ''}
                                      onChange={e => setProfile(prev => ({ ...prev, storeConfig: { ...prev.storeConfig, whatsappBot: { ...prev.storeConfig?.whatsappBot, enabled: prev.storeConfig?.whatsappBot?.enabled ?? false, welcomeMessage: e.target.value } } }))}
                                  />
                              </div>
                          </div>

                          {/* Preview */}
                          <div className="relative h-[400px] bg-gray-100 dark:bg-zinc-800 rounded-[2.5rem] border-4 border-gray-200 dark:border-zinc-700 overflow-hidden flex items-end justify-end p-6">
                              <div className="absolute top-4 left-0 right-0 text-center opacity-40 pointer-events-none">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Preview na Vitrine</p>
                              </div>

                              {/* Widget Flutuante */}
                              {profile.storeConfig?.whatsappBot?.enabled && (
                                  <div className="animate-bounce-in flex flex-col items-end gap-4">
                                      {/* Balão de Mensagem */}
                                      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl rounded-br-none shadow-xl max-w-[250px] border border-gray-100 dark:border-zinc-800">
                                          <div className="flex items-center gap-3 mb-2 border-b border-gray-100 dark:border-zinc-800 pb-2">
                                              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden">
                                                  {profile.storeConfig?.whatsappBot?.avatarUrl ? (
                                                      <img src={profile.storeConfig.whatsappBot.avatarUrl} className="w-full h-full object-cover" />
                                                  ) : profile.logoUrl ? (
                                                      <img src={profile.logoUrl} className="w-full h-full object-cover" />
                                                  ) : (
                                                      <Store className="w-4 h-4 text-emerald-600" />
                                                  )}
                                              </div>
                                              <div>
                                                  <p className="text-[10px] font-black uppercase text-gray-900 dark:text-white">{profile.storeConfig?.whatsappBot?.name || 'Atendente Virtual'}</p>
                                                  <p className="text-[8px] text-emerald-500 font-bold uppercase tracking-wider">Online Agora</p>
                                              </div>
                                          </div>
                                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                              {profile.storeConfig?.whatsappBot?.welcomeMessage || 'Olá! Bem-vindo à nossa loja. Como posso ajudar você hoje?'}
                                          </p>
                                      </div>

                                      {/* Botão WhatsApp */}
                                      <div className="w-14 h-14 bg-[#25D366] rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer">
                                          <MessageSquare className="w-7 h-7" />
                                      </div>
                                  </div>
                              )}
                          </div>
                      </div>
                   </div>
                </div>
            )}

            {activeSubTab === 'blog' && (
                <div className="space-y-10 animate-fade-in">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-tight flex items-center gap-2">
                                <BookOpen className="w-6 h-6 text-indigo-600" /> Meus Artigos do Blog
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Publique conteúdos educativos e ganhe autoridade no seu nicho.</p>
                        </div>
                        <button 
                            onClick={() => {
                                setEditingBlogPost(null);
                                setBlogForm({ title: '', category: 'Dicas', summary: '', content: '', imageUrl: '' });
                                setIsBlogModalOpen(true);
                            }}
                            className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase shadow-xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                        >
                            <Plus className="w-5 h-5" /> NOVO ARTIGO
                        </button>
                    </div>

                    <div className="grid gap-6">
                        {blogPosts.length > 0 ? blogPosts.map(post => (
                            <div key={post.id} className="p-6 bg-gray-50 dark:bg-zinc-800/40 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between group hover:bg-white dark:hover:bg-zinc-800 transition-all hover:shadow-2xl">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white dark:border-zinc-700 shadow-md">
                                        <img src={post.imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black text-indigo-600 dark:text-brand-primary uppercase tracking-widest bg-white dark:bg-zinc-900 px-3 py-1 rounded-lg border border-gray-100 dark:border-zinc-700 shadow-sm mb-2 inline-block">{post.category}</span>
                                        <h4 className="font-black text-gray-900 dark:text-white text-xl uppercase italic tracking-tight leading-tight">{post.title}</h4>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2"><Calendar className="w-3 h-3" /> {post.date}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-6 md:mt-0">
                                    <button onClick={() => { setEditingBlogPost(post); setBlogForm(post); setIsBlogModalOpen(true); }} className="p-3 bg-white dark:bg-zinc-900 rounded-xl text-indigo-400 border border-gray-100 dark:border-zinc-700 shadow-sm hover:scale-110 transition-transform"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDeleteBlog(post.id)} className="p-3 bg-white dark:bg-zinc-900 rounded-xl text-rose-400 border border-gray-100 dark:border-zinc-700 shadow-sm hover:scale-110 transition-transform"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        )) : (
                            <div className="py-24 text-center bg-gray-50 dark:bg-zinc-900/40 rounded-[4rem] border-2 border-dashed border-gray-200 dark:border-zinc-800">
                                <FileText className="w-20 h-20 text-gray-200 dark:text-zinc-800 mx-auto mb-8" />
                                <h4 className="text-xl font-black text-slate-400 uppercase tracking-[0.3em]">Blog Vazio</h4>
                                <p className="text-sm text-slate-400 mt-2 font-medium">Crie artigos para aparecer no Blog Global e na sua Vitrine (Top 3).</p>
                            </div>
                        )}
                    </div>

                    {/* SEÇÃO SEO & SOCIAL */}
                    <section className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-xl mt-16">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600">
                                <Share2 className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tight text-gray-900 dark:text-white">
                                    SEO & Social
                                </h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Otimize para o Google e personalize o compartilhamento.
                                </p>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* LADO ESQUERDO: Configurações */}
                            <div className="space-y-8">
                                {/* SEO Básico */}
                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-sm font-black text-indigo-900 dark:text-brand-primary uppercase"><Search className="w-4 h-4" /> Meta Dados (Google)</h4>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Título da Página (Meta Title)</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800 font-bold dark:text-white" 
                                            placeholder="Ex: Pizzaria Bella Napoli - A Melhor de SP" 
                                            value={profile.storeConfig?.seo?.metaTitle || ''}
                                            onChange={e => setProfile({...profile, storeConfig: {...profile.storeConfig, seo: {...profile.storeConfig?.seo, metaTitle: e.target.value}}})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Descrição (Meta Description)</label>
                                        <textarea 
                                            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800 font-bold dark:text-white h-24 resize-none" 
                                            placeholder="Breve descrição que aparece nos resultados de busca..." 
                                            value={profile.storeConfig?.seo?.metaDescription || ''}
                                            onChange={e => setProfile({...profile, storeConfig: {...profile.storeConfig, seo: {...profile.storeConfig?.seo, metaDescription: e.target.value}}})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Palavra-chave Principal</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800 font-bold dark:text-white" 
                                            placeholder="Ex: pizza artesanal, delivery" 
                                            value={profile.storeConfig?.seo?.keywords?.join(', ') || ''}
                                            onChange={e => setProfile({...profile, storeConfig: {...profile.storeConfig, seo: {...profile.storeConfig?.seo, keywords: e.target.value.split(',').map(k => k.trim())}}})}
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 dark:border-zinc-800 my-6"></div>

                                {/* Social / Open Graph */}
                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-sm font-black text-indigo-900 dark:text-brand-primary uppercase"><Share2 className="w-4 h-4" /> Compartilhamento (WhatsApp/Facebook)</h4>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Título Social (OG Title)</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800 font-bold dark:text-white" 
                                            placeholder="Título que aparece no card do WhatsApp" 
                                            value={profile.storeConfig?.seo?.ogTitle || ''}
                                            onChange={e => setProfile({...profile, storeConfig: {...profile.storeConfig, seo: {...profile.storeConfig?.seo, ogTitle: e.target.value}}})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Descrição Social</label>
                                        <textarea 
                                            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800 font-bold dark:text-white h-20 resize-none" 
                                            placeholder="Descrição curta e atrativa para redes sociais..." 
                                            value={profile.storeConfig?.seo?.ogDescription || ''}
                                            onChange={e => setProfile({...profile, storeConfig: {...profile.storeConfig, seo: {...profile.storeConfig?.seo, ogDescription: e.target.value}}})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Imagem de Capa (OG Image)</label>
                                        <div 
                                            className="h-32 bg-gray-50 dark:bg-zinc-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-700 flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700/50 transition-colors relative overflow-hidden group"
                                            onClick={() => ogImageInputRef.current?.click()}
                                        >
                                            {profile.storeConfig?.seo?.ogImage ? (
                                                <img src={profile.storeConfig.seo.ogImage} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xs font-black text-slate-400 uppercase flex items-center gap-2">
                                                    <ImageIcon className="w-4 h-4"/> Upload Imagem (1200x630)
                                                </span>
                                            )}
                                            <input type="file" ref={ogImageInputRef} hidden accept="image/*" onChange={e => handleImageUpload(e, 'ogImage')} />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 dark:border-zinc-800 my-6"></div>

                                {/* Analytics & Pixel */}
                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-sm font-black text-indigo-900 dark:text-brand-primary uppercase"><BarChart className="w-4 h-4" /> Rastreamento & Analytics</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Facebook Pixel ID</label>
                                            <input 
                                                type="text" 
                                                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800 font-bold dark:text-white" 
                                                placeholder="Ex: 123456789" 
                                                value={profile.storeConfig?.pixelId || ''}
                                                onChange={e => setProfile({...profile, storeConfig: {...profile.storeConfig, pixelId: e.target.value}})}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Google Analytics ID</label>
                                            <input 
                                                type="text" 
                                                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800 font-bold dark:text-white" 
                                                placeholder="Ex: G-XXXXXXXXXX" 
                                                value={profile.storeConfig?.gaId || ''}
                                                onChange={e => setProfile({...profile, storeConfig: {...profile.storeConfig, gaId: e.target.value}})}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* LADO DIREITO: Preview */}
                            <div className="space-y-8">
                                <div className="bg-[#E5DDD5] dark:bg-[#0b141a] p-8 rounded-[2.5rem] relative overflow-hidden border-4 border-gray-200 dark:border-zinc-800 shadow-inner min-h-[400px]">
                                    <div className="absolute top-4 left-0 right-0 text-center opacity-40 pointer-events-none">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Simulação WhatsApp</p>
                                    </div>

                                    {/* O Card do WhatsApp */}
                                    <div className="bg-white dark:bg-[#1f2c34] rounded-lg overflow-hidden shadow-sm max-w-sm mx-auto mt-10">
                                        {/* Imagem */}
                                        <div className="h-48 bg-gray-200 dark:bg-zinc-800 w-full relative group">
                                            {profile.storeConfig?.seo?.ogImage ? (
                                                <img src={profile.storeConfig.seo.ogImage} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs uppercase font-bold">Sem Imagem</div>
                                            )}
                                        </div>
                                        {/* Texto do Card */}
                                        <div className="p-3 bg-[#F0F2F5] dark:bg-[#1f2c34] border-l-4 border-indigo-500">
                                            <h4 className="font-bold text-gray-900 dark:text-white leading-tight text-sm mb-1 line-clamp-2">
                                                {profile.storeConfig?.seo?.ogTitle || profile.storeConfig?.seo?.metaTitle || 'Título do Seu Site'}
                                            </h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                {profile.storeConfig?.seo?.ogDescription || profile.storeConfig?.seo?.metaDescription || 'A descrição que você digitou vai aparecer aqui para quem receber o link.'}
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-1 lowercase">menudenegocios.com/{profile.slug || 'seu-link'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-zinc-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
                                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Search className="w-3 h-3" /> Preview Google</h5>
                                    <div className="space-y-1">
                                        <p className="text-sm text-[#1a0dab] dark:text-[#8ab4f8] font-medium hover:underline cursor-pointer truncate">
                                            {profile.storeConfig?.seo?.metaTitle || 'Título da Página nos Resultados de Busca'}
                                        </p>
                                        <p className="text-xs text-[#006621] dark:text-[#34a853] truncate">
                                            https://menudenegocios.com/{profile.slug || 'seu-link'}
                                        </p>
                                        <p className="text-xs text-[#545454] dark:text-[#bdc1c6] line-clamp-2">
                                            {profile.storeConfig?.seo?.metaDescription || 'Esta é a descrição que aparecerá nos resultados do Google. É importante que ela contenha suas palavras-chave principais.'}
                                        </p>
                                    </div>
                                </div>
                                
                                <button onClick={() => handleProfileSave(true)} className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl uppercase tracking-widest text-xs hover:scale-105 transition-all flex items-center justify-center gap-2">
                                    <Save className="w-4 h-4" /> Salvar Configurações
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            )}

            {activeSubTab === 'products' && (
                <div className="space-y-16 animate-fade-in">
                   {/* CATEGORIAS */}
                   <section className="space-y-8 bg-gray-50 dark:bg-zinc-800/30 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                         <div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-tight flex items-center gap-2">
                               <LayoutGrid className="w-6 h-6 text-indigo-600" /> Categorias de Itens
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Organize seus produtos para facilitar na navegação.</p>
                         </div>
                         <button onClick={() => setIsCategoryModalOpen(true)} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:scale-105 transition-all">+ NOVA CATEGORIA</button>
                      </div>

                      <div className="flex flex-wrap gap-3">
                         {storeCategories.map(cat => (
                            <div key={cat.id} className="flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-sm">
                               <Tag className="w-3.5 h-3.5 text-indigo-500" />
                               <span className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase">{cat.name}</span>
                               <button onClick={() => handleDeleteCategory(cat.id)} className="p-1 text-slate-300 hover:text-rose-500 transition-colors"><X className="w-3.5 h-3.5" /></button>
                            </div>
                         ))}
                      </div>
                   </section>

                   {/* LISTAGEM DE PRODUTOS */}
                   <section className="space-y-8">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                         <div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-tight flex items-center gap-2">
                               <Package className="w-6 h-6 text-[#F67C01]" /> Itens do Catálogo
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Produtos ou serviços que aparecem na sua Vitrine.</p>
                         </div>
                         <button onClick={() => { setEditingProduct(null); setProductForm({ name: '', description: '', price: 0, category: 'Geral', available: true, imageUrl: '', externalLink: '' }); setIsProductModalOpen(true); }} className="bg-[#F67C01] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase shadow-xl flex items-center gap-3 hover:scale-105 transition-all">
                            <Plus className="w-5 h-5" /> ADICIONAR ITEM
                         </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         {products.map(prod => (
                            <div key={prod.id} className="group bg-gray-50 dark:bg-zinc-800/40 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 flex items-center gap-6 p-6 transition-all hover:bg-white dark:hover:bg-zinc-800 hover:shadow-2xl relative overflow-hidden">
                               <div className="w-20 h-20 rounded-[1.8rem] bg-white dark:bg-zinc-900 shadow-md overflow-hidden flex-shrink-0 border border-white dark:border-zinc-700">
                                  <img src={prod.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                               </div>
                               <div className="flex-1 min-w-0">
                                  <h5 className="font-black text-gray-900 dark:text-white text-base truncate uppercase italic tracking-tight">{prod.name}</h5>
                                  <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1">R$ {prod.price.toFixed(2)}</p>
                               </div>
                               <div className="flex flex-col gap-2 relative z-10">
                                  <button onClick={() => { setEditingProduct(prod); setProductForm(prod); setIsProductModalOpen(true); }} className="p-3 bg-white dark:bg-zinc-900 rounded-xl text-indigo-400 border border-gray-100 dark:border-zinc-700 shadow-sm hover:scale-110 transition-transform"><Edit2 className="w-4 h-4" /></button>
                               </div>
                            </div>
                         ))}
                      </div>
                   </section>

                   {/* CUPONS */}
                   <section className="space-y-8 bg-gray-50 dark:bg-zinc-800/30 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                         <div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-tight flex items-center gap-2">
                               <Ticket className="w-6 h-6 text-emerald-600" /> Cupons de Desconto
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Crie promoções para atrair mais clientes.</p>
                         </div>
                         <button onClick={() => setIsCouponModalOpen(true)} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2 hover:scale-105 transition-all">
                            <Plus className="w-4 h-4" /> NOVO CUPOM
                         </button>
                      </div>
                      
                      {coupons.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {coupons.map(coupon => (
                                <div key={coupon.id} className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-gray-200 dark:border-zinc-700 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                                        {coupon.active ? 'Ativo' : 'Inativo'}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600">
                                                <Ticket className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900 dark:text-white text-lg uppercase italic">{coupon.code}</h4>
                                                <p className="text-xs text-slate-500 font-bold">{coupon.title}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2 mb-6">
                                            <p className="text-2xl font-black text-emerald-600">{coupon.type === 'percentage' ? `${coupon.discount}% OFF` : `R$ ${coupon.discount} OFF`}</p>
                                            {coupon.description && <p className="text-xs text-slate-400">{coupon.description}</p>}
                                            {coupon.expiryDate && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Calendar className="w-3 h-3" /> Validade: {new Date(coupon.expiryDate).toLocaleDateString('pt-BR')}</p>}
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteCoupon(coupon.id)} className="w-full py-3 bg-gray-50 dark:bg-zinc-800 rounded-xl text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors flex items-center justify-center gap-2">
                                        <Trash2 className="w-3 h-3" /> Excluir Cupom
                                    </button>
                                </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 opacity-40">
                            <Ticket className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Nenhum cupom ativo no momento.</p>
                        </div>
                      )}
                   </section>
                </div>
            )}

            {activeSubTab === 'landing' && (
                <div className="max-w-4xl mx-auto space-y-12">
                   <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase">Configurações da Vitrine</h3>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-800 px-6 py-3 rounded-2xl border border-gray-100 dark:border-zinc-700">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expor na Vitrine?</span>
                          <button 
                            onClick={() => setProfile(prev => ({ ...prev, isPublished: !prev.isPublished }))}
                            className={`w-12 h-6 rounded-full transition-all relative ${profile.isPublished ? 'bg-emerald-500' : 'bg-slate-300'}`}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${profile.isPublished ? 'left-7' : 'left-1'}`} />
                          </button>
                        </div>
                        <button onClick={() => handleProfileSave(true)} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase shadow-xl flex items-center gap-2"><Save className="w-4 h-4" /> SALVAR & PUBLICAR</button>
                      </div>
                   </div>

                   <div className="bg-gray-50 dark:bg-zinc-800/40 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 space-y-6">
                      <h4 className="flex items-center gap-2 text-sm font-black text-indigo-900 dark:text-brand-primary uppercase"><LayoutGrid className="w-5 h-5" /> Categoria na Vitrine Global</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Escolha onde seu negócio será exibido na Vitrine do site principal.</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['Produtos', 'Serviços', 'Oportunidades'].map(cat => (
                          <button
                            key={cat}
                            onClick={() => setProfile({ ...profile, vitrineCategory: cat as any })}
                            className={`p-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all ${profile.vitrineCategory === cat ? 'border-indigo-600 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:border-brand-primary dark:text-brand-primary' : 'border-gray-200 text-slate-400 hover:border-indigo-300 dark:border-zinc-700 dark:hover:border-zinc-500'}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                   </div>

                   <div className="bg-gray-50 dark:bg-zinc-800/40 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 space-y-6">
                      <h4 className="flex items-center gap-2 text-sm font-black text-indigo-900 dark:text-brand-primary uppercase"><Globe className="w-5 h-5" /> Link Personalizado (Slug)</h4>
                      <div className="flex items-center bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-700">
                        <div className="bg-gray-100 dark:bg-zinc-800 px-6 py-4 flex items-center text-slate-400 font-bold text-sm border-r border-gray-200 dark:border-zinc-700">
                          https://menudenegocios.com/
                        </div>
                        <input 
                          type="text" 
                          className="flex-1 bg-transparent border-none p-4 font-black text-indigo-600 dark:text-brand-primary outline-none" 
                          value={profile.slug || ''} 
                          onChange={e => setProfile({...profile, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})} 
                          placeholder="seu-nome-ou-negocio" 
                        />
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Este será o seu link público oficial para compartilhar com clientes.</p>
                   </div>

                   <div className="space-y-6 bg-gray-50 dark:bg-zinc-800/40 p-8 rounded-[2.5rem]">
                      <h4 className="flex items-center gap-2 text-sm font-black text-indigo-900 dark:text-brand-primary uppercase"><ImageIcon className="w-5 h-5" /> Banner Rotativo (Até 3 fotos)</h4>
                      <div className="grid grid-cols-3 gap-4">
                         {[0,1,2].map(idx => (
                            <div key={idx} className="aspect-video bg-white dark:bg-zinc-900 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden relative group cursor-pointer" onClick={() => bannerInputRefs[idx].current?.click()}>
                                {profile.storeConfig?.bannerImages?.[idx] ? <img src={profile.storeConfig.bannerImages[idx]} className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-gray-300"><Camera className="w-6 h-6" /></div>}
                                <input type="file" ref={bannerInputRefs[idx]} hidden onChange={e => handleImageUpload(e, `banner${idx}` as any)} />
                            </div>
                         ))}
                      </div>
                   </div>

                   {/* CONTATO & REDES SOCIAIS */}
                   <div className="bg-gray-50 dark:bg-zinc-800/40 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 space-y-8">
                      <h4 className="flex items-center gap-2 text-sm font-black text-indigo-900 dark:text-brand-primary uppercase"><MessageCircle className="w-5 h-5" /> Contato & Redes Sociais</h4>
                      <div className="grid md:grid-cols-2 gap-8">
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><Phone className="w-3 h-3" /> WhatsApp Comercial</label>
                            <input 
                               type="text" 
                               className="w-full bg-white dark:bg-zinc-900 border-none rounded-2xl p-4 font-bold dark:text-white" 
                               value={profile.phone || ''} 
                               onChange={e => setProfile({...profile, phone: e.target.value})} 
                               placeholder="Ex: 5511999999999" 
                            />
                         </div>
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><Instagram className="w-3 h-3" /> Instagram (Usuário)</label>
                            <div className="flex bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden">
                               <div className="bg-gray-100 dark:bg-zinc-800 px-4 flex items-center text-slate-400 font-bold text-sm">@</div>
                               <input 
                                  type="text" 
                                  className="flex-1 bg-transparent border-none p-4 font-bold dark:text-white outline-none" 
                                  value={profile.socialLinks?.instagram || ''} 
                                  onChange={e => setProfile({...profile, socialLinks: {...profile.socialLinks, instagram: e.target.value}})} 
                                  placeholder="seu.perfil" 
                               />
                            </div>
                         </div>
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><Globe className="w-3 h-3" /> Website Oficial</label>
                            <input 
                               type="url" 
                               className="w-full bg-white dark:bg-zinc-900 border-none rounded-2xl p-4 font-bold dark:text-white" 
                               value={profile.socialLinks?.website || ''} 
                               onChange={e => setProfile({...profile, socialLinks: {...profile.socialLinks, website: e.target.value}})} 
                               placeholder="https://www.seusite.com.br" 
                            />
                         </div>
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><Calendar className="w-3 h-3" /> Link Agenda (Calendly/Google)</label>
                            <input 
                               type="url" 
                               className="w-full bg-white dark:bg-zinc-900 border-none rounded-2xl p-4 font-bold dark:text-white" 
                               value={profile.storeConfig?.calendarLink || ''} 
                               onChange={e => setProfile({...profile, storeConfig: {...profile.storeConfig, calendarLink: e.target.value}})} 
                               placeholder="https://calendly.com/seu-link" 
                            />
                         </div>
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><Youtube className="w-3 h-3" /> Link de Vídeo (YouTube)</label>
                            <input 
                               type="url" 
                               className="w-full bg-white dark:bg-zinc-900 border-none rounded-2xl p-4 font-bold dark:text-white" 
                               value={profile.storeConfig?.videoUrl || ''} 
                               onChange={e => setProfile({...profile, storeConfig: {...profile.storeConfig, videoUrl: e.target.value}})} 
                               placeholder="https://www.youtube.com/watch?v=..." 
                            />
                         </div>
                      </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><User className="w-3 h-3" /> Sobre Mim</label>
                            <textarea rows={5} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-medium dark:text-white resize-none" value={profile.storeConfig?.aboutMe || ''} onChange={e => setProfile({...profile, storeConfig: {...profile.storeConfig, aboutMe: e.target.value}})} placeholder="Conte sua trajetória e formação..." />
                         </div>
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><ListChecks className="w-3 h-3" /> Soluções e Serviços</label>
                            <textarea rows={5} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-medium dark:text-white resize-none" value={profile.storeConfig?.solutions || ''} onChange={e => setProfile({...profile, storeConfig: {...profile.storeConfig, solutions: e.target.value}})} placeholder="Quais serviços ou produtos você oferece?" />
                         </div>
                      </div>
                      <div className="space-y-6">
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><Target className="w-3 h-3" /> Problemas que resolvo</label>
                            <textarea rows={5} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-medium dark:text-white resize-none" value={profile.storeConfig?.problemsSolved || ''} onChange={e => setProfile({...profile, storeConfig: {...profile.storeConfig, problemsSolved: e.target.value}})} placeholder="Quais dores ou necessidades do cliente você elimina?" />
                         </div>
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><Heart className="w-3 h-3" /> Interesses de Negócio</label>
                            <textarea rows={5} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-medium dark:text-white resize-none" value={profile.storeConfig?.businessInterests || ''} onChange={e => setProfile({...profile, storeConfig: {...profile.storeConfig, businessInterests: e.target.value}})} placeholder="Com que tipo de parceiro ou cliente você quer se conectar?" />
                         </div>
                      </div>
                   </div>
                </div>
            )}
        </div>
      </div>

      {/* MODAL: NOVO ARTIGO BLOG */}
      {isBlogModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
              <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden border border-white/5 animate-scale-in flex flex-col">
                  <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center flex-shrink-0">
                      <div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter">{editingBlogPost ? 'Editar Artigo' : 'Novo Artigo de Autoridade'}</h3>
                        <p className="text-[10px] font-black text-[#F67C01] tracking-widest uppercase mt-1">Este conteúdo será publicado no blog global e na sua vitrine.</p>
                      </div>
                      <button onClick={() => setIsBlogModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                  </div>
                  
                  <form onSubmit={handleBlogSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide">
                      <div className="grid lg:grid-cols-12 gap-10">
                         <div className="lg:col-span-7 space-y-8">
                            <div>
                               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><Type className="w-3 h-3" /> Título Impactante</label>
                               <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-black text-xl italic tracking-tight dark:text-white" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} placeholder="Ex: Por que investir em consultoria local?" />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                               <div>
                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Categoria Principal</label>
                                  <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={blogForm.category} onChange={e => setBlogForm({...blogForm, category: e.target.value})}>
                                     <option>Marketing</option>
                                     <option>Estratégia</option>
                                     <option>Dicas</option>
                                     <option>Novidades</option>
                                     <option>Gastronomia</option>
                                  </select>
                               </div>
                               <div>
                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Autor Responsável</label>
                                  <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white opacity-50" value={profile.businessName || user?.name} readOnly />
                               </div>
                            </div>

                            <div>
                               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><AlignLeft className="w-3 h-3" /> Resumo Curto</label>
                               <textarea rows={2} required className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 text-sm font-medium leading-relaxed dark:text-white resize-none" value={blogForm.summary} onChange={e => setBlogForm({...blogForm, summary: e.target.value})} placeholder="Breve introdução do tema..." />
                            </div>
                         </div>

                         <div className="lg:col-span-5">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><ImageIcon className="w-3 h-3" /> Capa do Artigo</label>
                            <div className="aspect-[4/3] bg-gray-50 dark:bg-zinc-800/40 rounded-[2.5rem] border-4 border-dashed border-gray-100 dark:border-zinc-700 relative overflow-hidden group cursor-pointer" onClick={() => fileInputBlogRef.current?.click()}>
                               {blogForm.imageUrl ? <img src={blogForm.imageUrl} className="w-full h-full object-cover" /> : <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4"><Camera className="w-12 h-12" /><span className="text-[10px] font-black uppercase tracking-[0.2em]">Upload Foto</span></div>}
                               <input type="file" ref={fileInputBlogRef} hidden accept="image/*" onChange={e => handleImageUpload(e, 'blogUrl')} />
                            </div>
                         </div>

                         <div className="lg:col-span-12">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Conteúdo Completo</label>
                            <textarea rows={12} required className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-[2.5rem] p-10 text-lg font-medium leading-relaxed dark:text-white" value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} placeholder="Escreva seu conhecimento aqui..." />
                         </div>
                      </div>
                      
                      <div className="pt-6">
                        <button type="submit" disabled={isSaving} className="w-full bg-indigo-600 text-white font-black py-6 rounded-[2.5rem] shadow-2xl uppercase tracking-widest text-sm hover:opacity-90 transition-all flex items-center justify-center gap-4">
                            {isSaving ? <RefreshCw className="animate-spin w-6 h-6" /> : <><Send className="w-5 h-5" /> PUBLICAR AGORA</>}
                        </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* MODAL: CATEGORIA - ATUALIZADO PARA IGUALAR AO MODAL DE PRODUTO */}
      {isCategoryModalOpen && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden border border-white/5 animate-scale-in flex flex-col">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center flex-shrink-0">
                    <div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter">Nova Categoria</h3>
                        <p className="text-[10px] font-black text-[#F67C01] tracking-widest uppercase mt-1">Organize seus itens para facilitar a navegação dos clientes.</p>
                    </div>
                    <button onClick={() => setIsCategoryModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={handleCategorySubmit} className="p-10 space-y-8">
                    <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Nome da Categoria</label>
                       <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" value={categoryForm.name} onChange={e => setCategoryForm({name: e.target.value})} placeholder="Ex: Hamburgueres Artesanais, Serviços de Design..." />
                    </div>
                    <button type="submit" disabled={isSaving} className="w-full bg-indigo-600 text-white font-black py-6 rounded-[2.5rem] shadow-2xl uppercase tracking-widest text-sm hover:opacity-90 transition-all">
                        {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'CRIAR CATEGORIA AGORA'}
                    </button>
                </form>
            </div>
         </div>
      )}

      {/* MODAL: PRODUTO */}
      {isProductModalOpen && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-white/5 animate-scale-in flex flex-col max-h-[95vh]">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center flex-shrink-0">
                   <h3 className="text-2xl font-black uppercase italic tracking-tighter">{editingProduct ? 'Editar Item' : 'Novo Item'}</h3>
                   <button onClick={() => setIsProductModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={handleProductSubmit} className="p-10 space-y-8 overflow-y-auto scrollbar-hide flex-1">
                    <div className="grid md:grid-cols-2 gap-10">
                       <div className="space-y-6">
                          <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Nome do Item</label>
                             <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                          </div>
                          <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Link de Redirecionamento (Opcional)</label>
                             <input type="url" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={productForm.externalLink || ''} onChange={e => setProductForm({...productForm, externalLink: e.target.value})} placeholder="https://..." />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Preço (R$)</label>
                                <input required type="number" step="0.01" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} />
                             </div>
                             <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Categoria</label>
                                <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={productForm.storeCategoryId} onChange={e => setProductForm({...productForm, storeCategoryId: e.target.value})}>
                                   <option value="">Nenhuma</option>
                                   {storeCategories.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)}
                                </select>
                             </div>
                          </div>
                       </div>
                       <div className="space-y-6">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Imagem</label>
                          <div className="aspect-square bg-gray-50 dark:bg-zinc-800 rounded-[2.5rem] border-4 border-dashed border-gray-100 dark:border-zinc-700 relative overflow-hidden group cursor-pointer" onClick={() => fileInputProductRef.current?.click()}>
                             {productForm.imageUrl ? <img src={productForm.imageUrl} className="w-full h-full object-cover" /> : <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4"><Camera className="w-12 h-12" /><span className="text-[10px] font-black uppercase">Upload</span></div>}
                             <input type="file" ref={fileInputProductRef} hidden onChange={e => handleImageUpload(e, 'productUrl')} />
                          </div>
                       </div>
                    </div>
                    <button type="submit" disabled={isSaving} className="w-full bg-indigo-600 text-white font-black py-6 rounded-[2.5rem] shadow-2xl uppercase tracking-widest text-sm hover:opacity-90 transition-all">
                        {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'SALVAR ITEM NO CATÁLOGO'}
                    </button>
                </form>
            </div>
         </div>
      )}

      {/* MODAL: CUPOM */}
      {isCouponModalOpen && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-white/5 animate-scale-in flex flex-col max-h-[95vh]">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center flex-shrink-0">
                    <div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter">Novo Cupom</h3>
                        <p className="text-[10px] font-black text-[#F67C01] tracking-widest uppercase mt-1">Ofereça descontos exclusivos.</p>
                    </div>
                    <button onClick={() => setIsCouponModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={handleCouponSubmit} className="p-10 space-y-6 overflow-y-auto scrollbar-hide flex-1">
                    <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Código do Cupom</label>
                       <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white uppercase" value={couponForm.code} onChange={e => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})} placeholder="Ex: BEMVINDO10" />
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Título da Promoção</label>
                       <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={couponForm.title} onChange={e => setCouponForm({...couponForm, title: e.target.value})} placeholder="Ex: 10% OFF na primeira compra" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Tipo de Desconto</label>
                           <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={couponForm.type} onChange={e => setCouponForm({...couponForm, type: e.target.value as any})}>
                              <option value="percentage">Porcentagem (%)</option>
                              <option value="fixed">Valor Fixo (R$)</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Valor do Desconto</label>
                           <input required type="number" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={couponForm.discount} onChange={e => setCouponForm({...couponForm, discount: e.target.value})} placeholder="Ex: 10 ou 50" />
                        </div>
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Validade (Opcional)</label>
                       <input type="date" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={couponForm.expiryDate} onChange={e => setCouponForm({...couponForm, expiryDate: e.target.value})} />
                    </div>
                    <button type="submit" disabled={isSaving} className="w-full bg-emerald-600 text-white font-black py-6 rounded-[2.5rem] shadow-2xl uppercase tracking-widest text-sm hover:opacity-90 transition-all">
                        {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'CRIAR CUPOM'}
                    </button>
                </form>
            </div>
         </div>
      )}
    </div>
  );
};
