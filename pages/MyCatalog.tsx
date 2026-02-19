
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { Product, Profile, StoreCategory } from '../types';
import { 
  Store, LayoutGrid, Package, CheckCircle, 
  Plus, Trash2, Edit2, 
  Image as ImageIcon, Eye,
  X, RefreshCw, Save, Camera, Home as HomeIcon,
  Phone, MapPin, MessageCircle, 
  Briefcase, Quote, Smartphone, ArrowRight, Star, Settings, GripVertical,
  Youtube, Globe, CreditCard, DollarSign, Wallet, Zap, ShieldCheck,
  Lock, Crown, User, Info, ListChecks, Target, Heart, Instagram,
  Share2
} from 'lucide-react';
import { SectionLanding } from '../components/SectionLanding';
import { Link, useNavigate } from 'react-router-dom';

export const MyCatalog: React.FC = () => {
  const { user, realAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState<'home' | 'identity' | 'cats' | 'products' | 'landing'>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [storeCategories, setStoreCategories] = useState<StoreCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({ 
    name: '', description: '', price: 0, category: 'Geral', available: true, imageUrl: '', storeCategoryId: ''
  });

  const [categoryForm, setCategoryForm] = useState({ name: '' });

  const fileInputLogoRef = useRef<HTMLInputElement>(null);
  const fileInputProductRef = useRef<HTMLInputElement>(null);
  const bannerInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const isAdmin = user?.role === 'admin' || realAdmin?.role === 'admin';
  const hasAccess = isAdmin || (user?.plan !== 'profissionais');

  useEffect(() => { if (user && hasAccess) loadData(); }, [user, hasAccess]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
        const [prof, cats, prods] = await Promise.all([
            mockBackend.getProfile(user.id),
            mockBackend.getStoreCategories(user.id),
            mockBackend.getProducts(user.id)
        ]);
        
        const initialProfile = prof || { 
            userId: user.id, 
            socialLinks: { instagram: '', whatsapp: '', website: '' }, 
            storeConfig: { 
                whatsappFormEnabled: true,
                paymentMethods: { pix: true, card: true, cash: true, credit: true },
                socialLinks: { instagram: '', whatsapp: '', website: '' },
                businessType: 'local_business',
                bannerImages: []
            } 
        };
        
        if (!initialProfile.storeConfig) {
            initialProfile.storeConfig = {
                paymentMethods: { pix: true, card: true, cash: true, credit: true },
                socialLinks: { instagram: '', whatsapp: '', website: '' },
                businessType: 'local_business',
                bannerImages: []
            };
        }

        if (!initialProfile.socialLinks) {
            initialProfile.socialLinks = { instagram: '', whatsapp: '', website: '' };
        }

        setProfile(initialProfile as any);
        setStoreCategories(cats);
        setProducts(prods || []);
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
                  A gestão de Catálogo e Loja Virtual está disponível apenas para membros nos níveis <span className="text-indigo-600 font-bold">PRO</span> e <span className="text-emerald-600 font-bold">Business</span>.
              </p>
              <Link to="/plans" className="bg-[#F67C01] text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
                  <Crown className="w-5 h-5" /> FAZER UPGRADE AGORA
              </Link>
          </div>
      );
  }

  const handleProfileSave = async (redirect = false) => {
    if (!user) return;
    setIsSaving(true);
    try {
      await mockBackend.updateProfile(user.id, profile);
      if (redirect) {
        navigate(`/store/${user.id}`);
      } else {
        alert('Configurações salvas com sucesso!');
      }
    } finally { setIsSaving(false); }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'coverUrl' | 'productUrl' | 'banner0' | 'banner1' | 'banner2') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (field === 'logoUrl') setProfile(prev => ({ ...prev, logoUrl: result }));
        else if (field === 'coverUrl') setProfile(prev => ({ ...prev, storeConfig: { ...prev.storeConfig, coverUrl: result } }));
        else if (field === 'productUrl') setProductForm(prev => ({ ...prev, imageUrl: result }));
        else if (field.startsWith('banner')) {
            const index = parseInt(field.replace('banner', ''));
            const currentBanners = [...(profile.storeConfig?.bannerImages || [])];
            currentBanners[index] = result;
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

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !categoryForm.name) return;
    await mockBackend.createStoreCategory(user.id, categoryForm.name);
    setCategoryForm({ name: '' });
    setIsCategoryModalOpen(false);
    loadData();
  };

  const togglePaymentMethod = (method: 'pix' | 'card' | 'cash' | 'credit') => {
    setProfile(prev => ({
        ...prev,
        storeConfig: {
            ...prev.storeConfig,
            paymentMethods: {
                ...prev.storeConfig?.paymentMethods,
                [method]: !prev.storeConfig?.paymentMethods?.[method]
            }
        }
    }));
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
                VITRINE & <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">CONTEÚDO</span>
              </h2>
              <p className="text-slate-400 text-xs font-bold tracking-[0.1em] mt-2">Configurações da sua página de especialista.</p>
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
            { id: 'cats', label: 'Categorias', desc: 'Organização', icon: LayoutGrid },
            { id: 'products', label: 'Produtos', desc: 'Gestão de Itens', icon: Package },
            { id: 'landing', label: 'Landing Page', desc: 'Classificados', icon: Smartphone },
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
          <SectionLanding title="Transforme sua vitrine em uma Landing Page." subtitle="Layout de Classificados" description="Seu perfil agora pode ter banner triplo e blocos focados em autoridade para converter visitantes em clientes." benefits={["Banner rotativo automático", "Foco em problemas e soluções", "Agendamento com captura de lead", "Sincronização com vitrine global"]} youtubeId="dQw4w9WgXcQ" ctaLabel="CONFIGURAR LANDING PAGE" onStart={() => setActiveSubTab('landing')} icon={LayoutGrid} accentColor="brand" />
        )}

        <div className={`${activeSubTab === 'home' ? 'hidden' : 'bg-white dark:bg-zinc-900 rounded-[3rem] p-8 md:p-12 border border-gray-100 shadow-xl min-h-[500px] animate-fade-in'}`}>
            {activeSubTab === 'identity' && (
                <div className="max-w-4xl mx-auto space-y-10">
                   <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-tight">Tipo de Negócio</h3>
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
                </div>
            )}

            {activeSubTab === 'cats' && (
                <div className="space-y-10">
                   <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-tight">Categorias de Itens</h3>
                      <button onClick={() => setIsCategoryModalOpen(true)} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase">+ NOVA CATEGORIA</button>
                   </div>
                   <div className="grid gap-4">
                      {storeCategories.map(cat => (
                         <div key={cat.id} className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-[1.5rem] border flex items-center justify-between">
                            <h4 className="font-black uppercase italic">{cat.name}</h4>
                            <button onClick={async () => { if(window.confirm('Excluir?')) { await mockBackend.deleteStoreCategory(cat.id, user!.id); loadData(); } }} className="text-rose-400"><Trash2 className="w-5 h-5" /></button>
                         </div>
                      ))}
                   </div>
                </div>
            )}

            {activeSubTab === 'products' && (
                <div className="space-y-10">
                   <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase">Gerenciamento de Itens</h3>
                      <button onClick={() => { setEditingProduct(null); setProductForm({ name: '', description: '', price: 0, category: 'Geral', available: true, imageUrl: '' }); setIsProductModalOpen(true); }} className="bg-[#F67C01] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase shadow-xl flex items-center gap-2"><Plus className="w-5 h-5" /> ADICIONAR ITEM</button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products.map(prod => (
                         <div key={prod.id} className="p-5 bg-gray-50 dark:bg-zinc-800/40 rounded-[2rem] border flex items-center gap-5 group hover:bg-white hover:shadow-xl transition-all">
                            <div className="w-16 h-16 rounded-2xl bg-gray-200 overflow-hidden flex-shrink-0"><img src={prod.imageUrl} className="w-full h-full object-cover" /></div>
                            <div className="flex-1">
                               <h5 className="font-black text-gray-900 dark:text-white text-sm line-clamp-1">{prod.name}</h5>
                               <p className="text-xs font-black text-emerald-600">{prod.price > 0 ? `R$ ${prod.price.toFixed(2)}` : 'SOB CONSULTA'}</p>
                            </div>
                            <div className="flex gap-1">
                               <button onClick={() => { setEditingProduct(prod); setProductForm(prod); setIsProductModalOpen(true); }} className="p-2 text-indigo-400"><Edit2 className="w-4 h-4" /></button>
                               <button onClick={async () => { if(window.confirm('Excluir?')) { loadData(); } }} className="p-2 text-rose-400"><Trash2 className="w-4 h-4" /></button>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
            )}

            {activeSubTab === 'landing' && (
                <div className="max-w-4xl mx-auto space-y-12">
                   <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase">Conteúdo da Landing Page</h3>
                      <button onClick={() => handleProfileSave(true)} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase shadow-xl flex items-center gap-2"><Save className="w-4 h-4" /> SALVAR & PUBLICAR</button>
                   </div>

                   {/* Banner Triplo */}
                   <div className="space-y-6 bg-gray-50 dark:bg-zinc-800/40 p-8 rounded-[2.5rem]">
                      <h4 className="flex items-center gap-2 text-sm font-black text-indigo-900 dark:text-brand-primary uppercase"><ImageIcon className="w-5 h-5" /> Banner Rotativo (Até 3 fotos)</h4>
                      <div className="grid grid-cols-3 gap-4">
                         {[0,1,2].map(idx => (
                            <div key={idx} className="aspect-video bg-white dark:bg-zinc-900 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden relative group cursor-pointer" onClick={() => bannerInputRefs[idx].current?.click()}>
                                {profile.storeConfig?.bannerImages?.[idx] ? (
                                    <img src={profile.storeConfig.bannerImages[idx]} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-300">
                                        <Camera className="w-6 h-6" />
                                    </div>
                                )}
                                <input type="file" ref={bannerInputRefs[idx]} hidden onChange={e => handleImageUpload(e, `banner${idx}` as any)} />
                            </div>
                         ))}
                      </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><User className="w-3 h-3" /> Sobre Mim</label>
                            <textarea rows={5} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-medium dark:text-white resize-none" value={profile.storeConfig?.aboutMe || ''} onChange={e => setProfile({...profile, storeConfig: {...profile.storeConfig, aboutMe: e.target.value}})} placeholder="Conte sua trajetória..." />
                         </div>
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><ListChecks className="w-3 h-3" /> Soluções e Serviços</label>
                            <textarea rows={5} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-medium dark:text-white resize-none" value={profile.storeConfig?.solutions || ''} onChange={e => setProfile({...profile, storeConfig: {...profile.storeConfig, solutions: e.target.value}})} placeholder="O que você oferece de concreto?" />
                         </div>
                      </div>
                      <div className="space-y-6">
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><Target className="w-3 h-3" /> Problemas que resolvo</label>
                            <textarea rows={5} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-medium dark:text-white resize-none" value={profile.storeConfig?.problemsSolved || ''} onChange={e => setProfile({...profile, storeConfig: {...profile.storeConfig, problemsSolved: e.target.value}})} placeholder="Quais dores seu cliente tem que você elimina?" />
                         </div>
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><Heart className="w-3 h-3" /> Interesses de Negócio</label>
                            <textarea rows={5} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-medium dark:text-white resize-none" value={profile.storeConfig?.businessInterests || ''} onChange={e => setProfile({...profile, storeConfig: {...profile.storeConfig, businessInterests: e.target.value}})} placeholder="Com que tipo de parceiros quer se conectar?" />
                         </div>
                      </div>
                   </div>

                   {/* NOVO: Canais de Contato & Redes Sociais */}
                   <div className="space-y-6 bg-gray-50 dark:bg-zinc-800/40 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800">
                      <h4 className="flex items-center gap-2 text-sm font-black text-indigo-900 dark:text-brand-primary uppercase"><Share2 className="w-5 h-5" /> Redes Sociais & Contato</h4>
                      <div className="grid md:grid-cols-3 gap-6">
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><MessageCircle className="w-3 h-3" /> WhatsApp</label>
                            <input type="text" className="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-4 font-bold text-xs" value={profile.phone || ''} onChange={e => setProfile({...profile, phone: e.target.value})} placeholder="5511999999999" />
                         </div>
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><Instagram className="w-3 h-3" /> Instagram</label>
                            <input type="text" className="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-4 font-bold text-xs" value={profile.socialLinks?.instagram || ''} onChange={e => setProfile({...profile, socialLinks: {...profile.socialLinks, instagram: e.target.value}})} placeholder="@usuario" />
                         </div>
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><Globe className="w-3 h-3" /> Site / Link</label>
                            <input type="text" className="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-4 font-bold text-xs" value={profile.socialLinks?.website || ''} onChange={e => setProfile({...profile, socialLinks: {...profile.socialLinks, website: e.target.value}})} placeholder="https://seusite.com" />
                         </div>
                      </div>
                   </div>
                </div>
            )}
        </div>
      </div>

      {isCategoryModalOpen && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-[3rem] w-full max-sm shadow-2xl overflow-hidden">
                <div className="bg-[#0F172A] p-6 text-white flex justify-between items-center"><h3 className="font-black uppercase italic">Nova Categoria</h3><button onClick={() => setIsCategoryModalOpen(false)}><X className="w-6 h-6" /></button></div>
                <form onSubmit={handleCategorySubmit} className="p-8 space-y-6">
                    <input required type="text" className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold" value={categoryForm.name} onChange={e => setCategoryForm({name: e.target.value})} placeholder="Ex: Consultoria" />
                    <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl uppercase text-[10px]">CRIAR CATEGORIA</button>
                </form>
            </div>
         </div>
      )}

      {isProductModalOpen && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden border border-white/5 animate-scale-in">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center"><h3 className="text-2xl font-black uppercase italic">{editingProduct ? 'Editar Item' : 'Novo Item'}</h3><button onClick={() => setIsProductModalOpen(false)}><X className="w-8 h-8" /></button></div>
                <form onSubmit={handleProductSubmit} className="p-10 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-4">
                          <div><label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Título</label><input required type="text" className="w-full bg-gray-50 rounded-xl p-4 font-bold" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} /></div>
                          <div><label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Preço (R$)</label><input required type="number" step="0.01" className="w-full bg-gray-50 rounded-xl p-4 font-bold" value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} /></div>
                          <div><label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Categoria</label><select className="w-full bg-gray-50 rounded-xl p-4 font-bold" value={productForm.storeCategoryId} onChange={e => setProductForm({...productForm, storeCategoryId: e.target.value})}><option value="">Nenhuma</option>{storeCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                       </div>
                       <div className="space-y-4">
                          <div className="aspect-square bg-gray-50 rounded-[1.5rem] border-2 border-dashed relative overflow-hidden group cursor-pointer" onClick={() => fileInputProductRef.current?.click()}>{productForm.imageUrl ? <img src={productForm.imageUrl} className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-gray-300"><Camera className="w-8 h-8" /></div>}<input type="file" ref={fileInputProductRef} hidden onChange={e => handleImageUpload(e, 'productUrl')} /></div>
                       </div>
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-[2rem] shadow-xl uppercase text-sm hover:opacity-90">{isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'SALVAR NO CATÁLOGO'}</button>
                </form>
            </div>
         </div>
      )}
    </div>
  );
};
