
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { Product, Profile, StoreCategory, BlogPost } from '../types';
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
  Calendar
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
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({ 
    name: '', description: '', price: 0, category: 'Geral', available: true, imageUrl: '', storeCategoryId: '', externalLink: ''
  });

  const [categoryForm, setCategoryForm] = useState({ name: '' });

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
  const bannerInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const isAdmin = user?.role === 'admin' || realAdmin?.role === 'admin';
  const hasAccess = isAdmin || (user?.plan !== 'profissionais');

  useEffect(() => { if (user && hasAccess) loadData(); }, [user, hasAccess, activeSubTab]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
        const [prof, cats, prods, allPosts] = await Promise.all([
            mockBackend.getProfile(user.id),
            mockBackend.getStoreCategories(user.id),
            mockBackend.getProducts(user.id),
            mockBackend.getBlogPosts()
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
    if (!user) return;
    setIsSaving(true);
    try {
      // Se for redirecionar (clicou em Salvar & Publicar), força a publicação
      const profileToSave = redirect ? { ...profile, isPublished: true } : profile;
      
      await mockBackend.updateProfile(user.id, profileToSave);
      
      // Atualiza o estado local para refletir a mudança
      if (redirect) {
        setProfile(profileToSave);
      }

      if (redirect) {
        // Redireciona para o slug se existir, senão para o ID
        if (profileToSave.slug) {
          navigate(`/${profileToSave.slug}`);
        } else {
          navigate(`/store/${user.id}`);
        }
      } else {
        alert('Configurações salvas com sucesso!');
      }
    } finally { setIsSaving(false); }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'coverUrl' | 'productUrl' | 'blogUrl' | 'banner0' | 'banner1' | 'banner2') => {
    const file = e.target.files?.[0];
    if (file && field) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        const isWide = field === 'coverUrl' || (field && field.startsWith('banner')) || field === 'blogUrl';
        const compressed = await resizeImage(result, isWide ? 1000 : 500, isWide ? 600 : 500);

        if (field === 'logoUrl') setProfile(prev => ({ ...prev, logoUrl: compressed }));
        else if (field === 'coverUrl') setProfile(prev => ({ ...prev, storeConfig: { ...prev.storeConfig, coverUrl: compressed } }));
        else if (field === 'productUrl') setProductForm(prev => ({ ...prev, imageUrl: compressed }));
        else if (field === 'blogUrl') setBlogForm(prev => ({ ...prev, imageUrl: compressed }));
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
            { id: 'blog', label: 'Blog', desc: 'Gerar Autoridade', icon: BookOpen },
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
    </div>
  );
};
