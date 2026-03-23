
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabaseService } from '../services/supabaseService';
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
  Calendar, Ticket, Search, BarChart, MessageSquare
} from 'lucide-react';
import { PhoneInput } from '../components/PhoneInput';
import { SectionLanding } from '../components/SectionLanding';
import { Link, useNavigate, useLocation } from 'react-router-dom';

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
      resolve(canvas.toDataURL('image/jpeg', 0.8)); // Comprime para JPEG 80% para melhor qualidade/tamanho
    };
  });
};

const base64ToBlob = (base64: string): Blob => {
  const parts = base64.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const decodedData = window.atob(parts[1]);
  const uInt8Array = new Uint8Array(decodedData.length);
  for (let i = 0; i < decodedData.length; ++i) {
    uInt8Array[i] = decodedData.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
};

export const MyCatalog: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSubTab, setActiveSubTab] = useState<'home' | 'identity' | 'blog' | 'products' | 'landing'>('home');

  // Sync tab with URL query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['home', 'identity', 'blog', 'products', 'landing'].includes(tab)) {
      setActiveSubTab(tab as any);
    }
  }, [location.search]);

  // Update URL when tab changes internally
  const handleTabChange = (tabId: 'home' | 'identity' | 'blog' | 'products' | 'landing') => {
    setActiveSubTab(tabId);
    navigate(`/catalog?tab=${tabId}`, { replace: true });
  };
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [storeCategories, setStoreCategories] = useState<StoreCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({ 
    name: '', description: '', price: 0, category: 'Geral', available: true, image_url: '', store_category_id: '', external_link: '',
    accepts_menu_cash: false, menu_cash_percentage: 5, product_type: 'Produto'
  });

  const [categoryForm, setCategoryForm] = useState({ name: '' });



  // Blog Form State
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    category: 'Marketing',
    summary: '',
    content: '',
    image_url: ''
  });

  const fileInputLogoRef = useRef<HTMLInputElement>(null);
  const fileInputProductRef = useRef<HTMLInputElement>(null);
  const fileInputBlogRef = useRef<HTMLInputElement>(null);
  const ogImageInputRef = useRef<HTMLInputElement>(null);
  const botAvatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const [videoUrlInput, setVideoUrlInput] = useState('');

  const addVideo = () => {
    if (!videoUrlInput) return;
    const currentVideos = profile.store_config?.video_portfolio || [];
    if (currentVideos.length >= 9) {
      alert('Máximo de 9 vídeos permitido.');
      return;
    }
    setProfile(prev => ({
      ...prev,
      store_config: {
        ...prev.store_config,
        video_portfolio: [...currentVideos, videoUrlInput]
      }
    }));
    setVideoUrlInput('');
  };

  const removeVideo = (index: number) => {
    const currentVideos = [...(profile.store_config?.video_portfolio || [])];
    currentVideos.splice(index, 1);
    setProfile(prev => ({
      ...prev,
      store_config: {
        ...prev.store_config,
        video_portfolio: currentVideos
      }
    }));
  };

  const isAdmin = user?.role === 'admin';
  const hasAccess = isAdmin || (user?.plan !== 'basic');

  useEffect(() => { if (user && hasAccess) loadData(); }, [user, hasAccess, activeSubTab]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
        const [prof, cats, prods, allPosts] = await Promise.all([
            supabaseService.getProfile(user.id),
            supabaseService.getStoreCategories(user.id),
            supabaseService.getProducts(user.id),
            supabaseService.getBlogPosts()
        ]);
        
        if (prof) {
            // Garante que a estrutura do bot do WhatsApp existe
            if (!prof.store_config) prof.store_config = {};
            if (!prof.store_config.whatsapp_bot) {
                prof.store_config.whatsapp_bot = {
                    enabled: false,
                    name: '',
                    avatar_url: '',
                    welcome_message: ''
                };
            }
            setProfile(prof);
        } else {
            setProfile({ 
                user_id: user.id, 
                vitrine_category: 'Produtos',
                is_published: false,
                social_links: { instagram: '', whatsapp: '', website: '' }, 
                store_config: { 
                    payment_methods: { pix: true, card: true, cash: true, credit: true },
                    social_links: { instagram: '', whatsapp: '', website: '' },
                    business_type: 'local_business',
                    banner_images: [],
                    whatsapp_bot: {
                        enabled: false,
                        name: '',
                        avatar_url: '',
                        welcome_message: ''
                    }
                } 
            } as any);
        }
        setStoreCategories(cats);
        setProducts(prods || []);
        setBlogPosts(allPosts.filter(p => p.user_id === user.id));
    } finally { setIsLoading(false); }
  };

  if (!hasAccess) {
      return (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
              <div className="w-24 h-24 bg-orange-50 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl border border-orange-100">
                  <Lock className="w-10 h-10 text-[#F67C01]" />
              </div>
              <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">Recurso do Plano PRO</h2>
              <p className="text-gray-500 max-w-md text-lg font-medium leading-relaxed mb-10">
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
      // Limpa dados que não pertencem Ã  tabela profiles
      const { subscriptions, id, created_at, ...profileToSave } = profile as any;

      console.log('Saving profile:', profileToSave);
      await supabaseService.saveProfile(user.id, profileToSave);
      console.log('Profile updated successfully');
      
      // Atualiza o estado local para refletir a mudança
      if (redirect) {
        setProfile({ ...profile, ...profileToSave });
        console.log('Redirecting to vitrine...');
        navigate('/vitrine');
      } else {
        alert('Configurações salvas com sucesso!');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Erro ao salvar configurações. Por favor, tente novamente.');
    } finally { setIsSaving(false); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo_url' | 'cover_url' | 'productUrl' | 'blogUrl' | 'banner0' | 'banner1' | 'banner2' | 'og_image' | 'botAvatar') => {
    const file = e.target.files?.[0];
    if (file && field) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        setIsSaving(true);
        try {
            // Todos os campos agora passam pelo redimensionamento e upload para storage
            const isWide = field === 'cover_url' || field === 'og_image' || field.startsWith('banner');
            const maxWidth = isWide ? 1200 : 800; // Um pouco maior para qualidade
            const maxHeight = isWide ? 800 : 800;
            
            const compressedBase64 = await resizeImage(result, maxWidth, maxHeight);
            const blob = base64ToBlob(compressedBase64);
            
            const fileName = `${field}_${Date.now()}.jpg`;
            const path = `uploads/${user?.id}/${fileName}`;
            const publicUrl = await supabaseService.uploadImage(blob as any, path);
            
            if (field === 'logo_url') setProfile(prev => ({ ...prev, logo_url: publicUrl }));
            else if (field === 'cover_url') setProfile(prev => ({ ...prev, store_config: { ...prev.store_config, cover_url: publicUrl } }));
            else if (field === 'og_image') setProfile(prev => ({ ...prev, store_config: { ...prev.store_config, seo: { ...prev.store_config?.seo, og_image: publicUrl } } }));
            else if (field === 'botAvatar') setProfile(prev => ({ ...prev, store_config: { ...prev.store_config, whatsapp_bot: { ...prev.store_config?.whatsapp_bot, avatar_url: publicUrl, enabled: prev.store_config?.whatsapp_bot?.enabled ?? false } } }));
            else if (field === 'productUrl') setProductForm(prev => ({ ...prev, image_url: publicUrl }));
            else if (field === 'blogUrl') setBlogForm(prev => ({ ...prev, image_url: publicUrl }));
            else if (field.startsWith('banner')) {
                const index = parseInt(field.replace('banner', ''));
                const currentBanners = [...(profile.store_config?.banner_images || [])];
                currentBanners[index] = publicUrl;
                setProfile(prev => ({ ...prev, store_config: { ...prev.store_config, banner_images: currentBanners } }));
            }
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Erro ao carregar a imagem. Verifique sua conexão e tente novamente.');
        } finally {
          setIsSaving(false);
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
        await supabaseService.updateProduct(editingProduct.id, { ...editingProduct, ...productForm });
      } else {
        await supabaseService.createProduct({ ...productForm, user_id: user.id });
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      setProductForm({ name: '', description: '', price: 0, category: 'Geral', available: true, image_url: '', external_link: '', accepts_menu_cash: false, menu_cash_percentage: 5, product_type: 'Produto' });
      alert("Item salvo com sucesso!");
      loadData();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Erro ao salvar produto. Tente novamente.");
    } finally { setIsSaving(false); }
  };

  const handleDeleteProduct = async (id: string) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!user || !productToDelete) return;
    try {
      await supabaseService.deleteProduct(productToDelete);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      loadData();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Erro ao excluir produto.");
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
        if (editingBlogPost) {
            await supabaseService.updateBlogPost(editingBlogPost.id, blogForm);
        } else {
            await supabaseService.addBlogPost({
                ...blogForm,
                user_id: user.id,
                author: profile.business_name || user.name,
                date: new Date().toLocaleDateString('pt-BR')
            } as any);
        }
        setIsBlogModalOpen(false);
        alert("Artigo publicado com sucesso!");
        loadData();
    } finally { setIsSaving(false); }
  };

  const handleDeleteBlog = async (id: string) => {
    if(!window.confirm('Excluir este artigo permanentemente?')) return;
    await supabaseService.deleteBlogPost(id);
    loadData();
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !categoryForm.name) return;
    setIsSaving(true);
    try {
        await supabaseService.addStoreCategory({
            user_id: user.id,
            name: categoryForm.name,
            order: storeCategories.length
        });
        setCategoryForm({ name: '' });
        setIsCategoryModalOpen(false);
        loadData();
    } finally { setIsSaving(false); }
  };

  const handleDeleteCategory = async (id: string) => {
    if(!user || !window.confirm('Excluir esta categoria? Os itens vinculados a ela ficarão como "Sem Categoria".')) return;
    await supabaseService.deleteStoreCategory(id);
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
            { id: 'blog', label: 'BLOG', desc: 'Gerar Autoridade', icon: BookOpen },
            { id: 'products', label: 'Produtos', desc: 'Itens & Categorias', icon: Package },
            { id: 'landing', label: 'Configurações', desc: 'Especialista', icon: Smartphone },
          ].map(tab => (
            <button key={tab.id} onClick={() => handleTabChange(tab.id as any)} className={`flex items-center gap-3 px-6 py-3.5 rounded-[1.8rem] transition-all min-w-[160px] ${activeSubTab === tab.id ? 'bg-[#F67C01] text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}>
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
          <SectionLanding 
            title="Sua Presença Digital Completa em um só lugar." 
            subtitle="Vitrine & Catálogo" 
            description="Centralize a gestão da sua autoridade online. Aqui você configura sua identidade visual, gerencia seu catálogo de ofertas e publica conteúdo estratégico para atrair e converter clientes no ecossistema global." 
            summaryText="Gerencie sua vitrine local com facilidade. Configure sua marca, cadastre seus produtos e serviços, e publique conteúdos que geram autoridade. Tudo o que você faz aqui é refletido instantaneamente no Marketplace do Menu ADS."
            benefits={[
              "Identidade: Defina sua marca, logo e cores da vitrine.",
              "Catálogo: Cadastre seus produtos, serviços e mentorias.",
              "Autoridade: Publique artigos e estudos de caso no seu blog.",
              "Landing Page: Configure sua página de vendas exclusiva.",
              "Sincronização: Tudo o que você faz aqui reflete no Marketplace."
            ]} 
            ctaLabel="COMEÇAR CONFIGURAÇÃO" 
            onStart={() => handleTabChange('identity')} 
            icon={LayoutGrid} 
            accentColor="brand" 
          />
        )}

        <div className={`${activeSubTab === 'home' ? 'hidden' : 'bg-white rounded-[3rem] p-8 md:p-12 border border-gray-100 shadow-xl min-h-[500px] animate-fade-in'}`}>
            {activeSubTab === 'identity' && (
                <div className="max-w-4xl mx-auto space-y-10">
                   <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-black text-gray-900 italic uppercase tracking-tight">Identidade Visual</h3>
                      <button onClick={() => handleProfileSave(false)} disabled={isSaving} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Save className="w-4 h-4" /> SALVAR ALTERAÇÕES</button>
                   </div>
                   
                   <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Nome de Exibição</label>
                            <input type="text" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" value={profile.business_name || ''} onChange={e => setProfile({...profile, business_name: e.target.value})} />
                         </div>
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Slogan / Categoria</label>
                            <input type="text" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" value={profile.category || ''} onChange={e => setProfile({...profile, category: e.target.value})} placeholder="Ex: Advogado Criminalista" />
                         </div>
                      </div>
                      <div className="space-y-6">
                         <div className="p-6 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full bg-white shadow-lg overflow-hidden mb-3 relative group cursor-pointer" onClick={() => fileInputLogoRef.current?.click()}>
                               {profile.logo_url ? <img src={profile.logo_url} className="w-full h-full object-cover" /> : <Camera className="w-6 h-6 text-gray-300 m-7" />}
                               <input type="file" ref={fileInputLogoRef} hidden onChange={e => handleImageUpload(e, 'logo_url')} />
                            </div>
                             <span className="text-[10px] font-black uppercase text-slate-400">Trocar Foto de Perfil</span>
                         </div>
                      </div>
                   </div>

                   {/* SEÃ‡ÃƒO BOT WHATSAPP */}
                   <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl mt-12">
                      <div className="flex items-center gap-4 mb-8">
                          <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
                              <MessageSquare className="w-8 h-8" />
                          </div>
                          <div>
                              <h3 className="text-2xl font-black uppercase italic tracking-tight text-gray-900">
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
                              <div className="flex items-center justify-between bg-gray-50 p-6 rounded-2xl">
                                  <span className="font-black text-sm uppercase text-gray-700">Ativar Bot Vendedor?</span>
                                  <button 
                                      onClick={() => setProfile(prev => ({ ...prev, store_config: { ...prev.store_config, whatsapp_bot: { ...prev.store_config?.whatsapp_bot, enabled: !prev.store_config?.whatsapp_bot?.enabled } } }))}
                                      className={`w-14 h-8 rounded-full transition-all relative ${profile.store_config?.whatsapp_bot?.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                  >
                                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${profile.store_config?.whatsapp_bot?.enabled ? 'left-7' : 'left-1'}`} />
                                  </button>
                              </div>

                              <div>
                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nome do Atendente</label>
                                  <input 
                                      type="text" 
                                      className="w-full p-4 rounded-2xl bg-gray-50 font-bold" 
                                      placeholder="Ex: Assistente Virtual" 
                                      value={profile.store_config?.whatsapp_bot?.name || ''}
                                      onChange={e => setProfile(prev => ({ ...prev, store_config: { ...prev.store_config, whatsapp_bot: { ...prev.store_config?.whatsapp_bot, enabled: prev.store_config?.whatsapp_bot?.enabled ?? false, name: e.target.value } } }))}
                                  />
                              </div>

                              <div>
                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Foto do Atendente</label>
                                  <div className="flex items-center gap-4">
                                      <div 
                                          className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border-2 border-dashed border-gray-300"
                                          onClick={() => botAvatarInputRef.current?.click()}
                                      >
                                          {profile.store_config?.whatsapp_bot?.avatar_url ? (
                                              <img src={profile.store_config.whatsapp_bot.avatar_url} className="w-full h-full object-cover" />
                                          ) : (
                                              <Camera className="w-6 h-6 text-gray-400" />
                                          )}
                                      </div>
                                      <div className="flex-1">
                                          <button 
                                              onClick={() => botAvatarInputRef.current?.click()}
                                              className="text-xs font-bold text-indigo-600 hover:underline"
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
                                      className="w-full p-4 rounded-2xl bg-gray-50 font-bold h-24 resize-none" 
                                      placeholder="Ex: Olá! Bem-vindo Ã  nossa loja. Como posso ajudar você hoje?" 
                                      value={profile.store_config?.whatsapp_bot?.welcome_message || ''}
                                      onChange={e => setProfile(prev => ({ ...prev, store_config: { ...prev.store_config, whatsapp_bot: { ...prev.store_config?.whatsapp_bot, enabled: prev.store_config?.whatsapp_bot?.enabled ?? false, welcome_message: e.target.value } } }))}
                                  />
                              </div>
                          </div>

                          {/* Preview */}
                          <div className="relative h-[400px] bg-gray-100 rounded-[2.5rem] border-4 border-gray-200 overflow-hidden flex items-end justify-end p-6">
                              <div className="absolute top-4 left-0 right-0 text-center opacity-40 pointer-events-none">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Preview na Vitrine</p>
                              </div>

                              {/* Widget Flutuante */}
                              {profile.store_config?.whatsapp_bot?.enabled && (
                                  <div className="animate-bounce-in flex flex-col items-end gap-4">
                                      {/* Balão de Mensagem */}
                                      <div className="bg-white p-4 rounded-2xl rounded-br-none shadow-xl max-w-[250px] border border-gray-100">
                                          <div className="flex items-center gap-3 mb-2 border-b border-gray-100 pb-2">
                                              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden">
                                                  {profile.store_config?.whatsapp_bot?.avatar_url ? (
                                                      <img src={profile.store_config.whatsapp_bot.avatar_url} className="w-full h-full object-cover" />
                                                  ) : profile.logo_url ? (
                                                      <img src={profile.logo_url} className="w-full h-full object-cover" />
                                                  ) : (
                                                      <Store className="w-4 h-4 text-emerald-600" />
                                                  )}
                                              </div>
                                              <div>
                                                  <p className="text-[10px] font-black uppercase text-gray-900">{profile.store_config?.whatsapp_bot?.name || 'Atendente Virtual'}</p>
                                                  <p className="text-[8px] text-emerald-500 font-bold uppercase tracking-wider">Online Agora</p>
                                              </div>
                                          </div>
                                          <p className="text-xs text-slate-500 leading-relaxed">
                                              {profile.store_config?.whatsapp_bot?.welcome_message || 'Olá! Bem-vindo Ã  nossa loja. Como posso ajudar você hoje?'}
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
                            <h3 className="text-2xl font-black text-gray-900 italic uppercase tracking-tight flex items-center gap-2">
                                <BookOpen className="w-6 h-6 text-indigo-600" /> Meus Artigos do Blog
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Publique conteúdos educativos e ganhe autoridade no seu nicho.</p>
                        </div>
                        <button 
                            onClick={() => {
                                setEditingBlogPost(null);
                                setBlogForm({ title: '', category: 'Dicas', summary: '', content: '', image_url: '' });
                                setIsBlogModalOpen(true);
                            }}
                            className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase shadow-xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                        >
                            <Plus className="w-5 h-5" /> NOVO ARTIGO
                        </button>
                    </div>

                    <div className="grid gap-6">
                        {blogPosts.length > 0 ? blogPosts.map(post => (
                            <div key={post.id} className="p-6 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex flex-col md:flex-row items-center justify-between group hover:bg-white transition-all hover:shadow-2xl">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                                        <img src={post.image_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-white px-3 py-1 rounded-lg border border-gray-100 shadow-sm mb-2 inline-block">{post.category}</span>
                                        <h4 className="font-black text-gray-900 text-xl uppercase italic tracking-tight leading-tight">{post.title}</h4>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2"><Calendar className="w-3 h-3" /> {post.date}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-6 md:mt-0">
                                    <button onClick={() => { setEditingBlogPost(post); setBlogForm(post); setIsBlogModalOpen(true); }} className="p-3 bg-white rounded-xl text-indigo-400 border border-gray-100 shadow-sm hover:scale-110 transition-transform"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDeleteBlog(post.id)} className="p-3 bg-white rounded-xl text-rose-400 border border-gray-100 shadow-sm hover:scale-110 transition-transform"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        )) : (
                            <div className="py-24 text-center bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
                                <FileText className="w-20 h-20 text-gray-200 mx-auto mb-8" />
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
                   <section className="space-y-8 bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                         <div>
                            <h3 className="text-2xl font-black text-gray-900 italic uppercase tracking-tight flex items-center gap-2">
                               <LayoutGrid className="w-6 h-6 text-indigo-600" /> Categorias de Itens
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Organize seus produtos para facilitar na navegação.</p>
                         </div>
                         <button onClick={() => setIsCategoryModalOpen(true)} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:scale-105 transition-all">+ NOVA CATEGORIA</button>
                      </div>

                      <div className="flex flex-wrap gap-3">
                         {storeCategories.map(cat => (
                            <div key={cat.id} className="flex items-center gap-3 px-5 py-2.5 bg-white rounded-2xl border border-gray-200 shadow-sm">
                               <Tag className="w-3.5 h-3.5 text-indigo-500" />
                               <span className="text-xs font-black text-gray-700 uppercase">{cat.name}</span>
                               <button onClick={() => handleDeleteCategory(cat.id)} className="p-1 text-slate-300 hover:text-rose-500 transition-colors"><X className="w-3.5 h-3.5" /></button>
                            </div>
                         ))}
                      </div>
                   </section>

                   {/* LISTAGEM DE PRODUTOS */}
                   <section className="space-y-8">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                         <div>
                            <h3 className="text-2xl font-black text-gray-900 italic uppercase tracking-tight flex items-center gap-2">
                               <Package className="w-6 h-6 text-[#F67C01]" /> Itens do Catálogo
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Produtos ou serviços que aparecem na sua Vitrine.</p>
                         </div>
                         <button onClick={() => { setEditingProduct(null); setProductForm({ name: '', description: '', price: 0, category: 'Geral', available: true, image_url: '', external_link: '', product_type: 'Produto' }); setIsProductModalOpen(true); }} className="bg-[#F67C01] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase shadow-xl flex items-center gap-3 hover:scale-105 transition-all">
                            <Plus className="w-5 h-5" /> ADICIONAR ITEM
                         </button>
                      </div>

                      <div className="flex flex-col gap-6">
                         {products.map(prod => (
                            <div key={prod.id} className="group bg-gray-50 rounded-[2.5rem] border border-gray-100 flex flex-col md:flex-row items-center gap-6 p-6 transition-all hover:bg-white hover:shadow-2xl relative overflow-hidden">
                               <div className="w-full md:w-32 h-32 rounded-[1.8rem] bg-white shadow-md overflow-hidden flex-shrink-0 border border-white">
                                  <img src={prod.image_url} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                               </div>
                               <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-1">
                                    <h5 className="font-black text-gray-900 text-xl uppercase italic tracking-tighter truncate">{prod.name}</h5>
                                    {prod.accepts_menu_cash && (
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                                            M$ {prod.menu_cash_percentage}%
                                        </span>
                                    )}
                                  </div>
                                  <p className="text-sm font-medium text-slate-500 line-clamp-1 mb-2">{prod.description}</p>
                                  <p className="text-2xl font-black text-emerald-600">R$ {prod.price.toFixed(2)}</p>
                               </div>
                               <div className="flex items-center gap-3 shrink-0">
                                  <button onClick={() => { setEditingProduct(prod); setProductForm(prod); setIsProductModalOpen(true); }} className="p-5 bg-white rounded-2xl text-indigo-600 border border-gray-100 shadow-lg hover:scale-110 transition-transform"><Edit2 className="w-5 h-5" /></button>
                                  <button onClick={() => handleDeleteProduct(prod.id)} className="p-5 bg-white rounded-2xl text-rose-500 border border-gray-100 shadow-lg hover:scale-110 transition-transform"><Trash2 className="w-5 h-5" /></button>
                               </div>
                            </div>
                         ))}
                      </div>
                   </section>


                </div>
            )}

            {activeSubTab === 'landing' && (
                <div className="max-w-4xl mx-auto space-y-12">
                      <h3 className="text-2xl font-black text-gray-900 italic uppercase">Configurações da Vitrine</h3>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expor na Vitrine?</span>
                           <button 
                            onClick={() => setProfile(prev => ({ ...prev, is_published: !prev.is_published }))}
                            className={`w-12 h-6 rounded-full transition-all relative ${profile.is_published ? 'bg-emerald-500' : 'bg-slate-300'}`}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${profile.is_published ? 'left-7' : 'left-1'}`} />
                          </button>
                        </div>
                        <button onClick={() => handleProfileSave(false)} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase shadow-xl flex items-center gap-2"><Save className="w-4 h-4" /> SALVAR ALTERAÇÕES</button>
                      </div>

                      {/* URL PERSONALIZADA (SLUG) */}
                      <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 space-y-6">
                         <h4 className="flex items-center gap-2 text-sm font-black text-indigo-900 uppercase"><LinkIcon className="w-5 h-5" /> URL Personalizada (Slug)</h4>
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Seu Link Exclusivo</label>
                            <div className="flex bg-white rounded-2xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500">
                               <div className="bg-gray-100 px-4 flex items-center text-slate-400 font-bold text-sm border-r border-gray-200">
                                  menudenegocios.com/
                               </div>
                               <input 
                                  type="text" 
                                  className="flex-1 bg-transparent border-none p-4 font-bold outline-none text-gray-900" 
                                  value={profile.slug || ''} 
                                  onChange={e => setProfile({...profile, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})} 
                                  placeholder="sua-marca" 
                               />
                            </div>
                            <p className="text-[10px] text-slate-500 mt-2 ml-1">Use apenas letras minúsculas, números e hífens. Ex: <strong>minha-loja</strong></p>
                         </div>
                      </div>

                   <div className="space-y-6 bg-gray-50 p-8 rounded-[2.5rem]">
                      <h4 className="flex items-center gap-2 text-sm font-black text-indigo-900 uppercase"><ImageIcon className="w-5 h-5" /> Banner Rotativo (Até 3 fotos)</h4>
                      <div className="grid grid-cols-3 gap-4">
                         {[0,1,2].map(idx => (
                            <div key={idx} className="aspect-video bg-white rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden relative group cursor-pointer" onClick={() => bannerInputRefs[idx].current?.click()}>
                                {profile.store_config?.banner_images?.[idx] ? <img src={profile.store_config.banner_images[idx]} className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-gray-300"><Camera className="w-6 h-6" /></div>}
                                <input type="file" ref={bannerInputRefs[idx]} hidden onChange={e => handleImageUpload(e, `banner${idx}` as any)} />
                            </div>
                         ))}
                      </div>
                   </div>

                   {/* CONTATO & REDES SOCIAIS */}
                   <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 space-y-8">
                      <h4 className="flex items-center gap-2 text-sm font-black text-indigo-900 uppercase"><MessageCircle className="w-5 h-5" /> Contato & Redes Sociais</h4>
                      <div className="grid md:grid-cols-2 gap-8">
                         <div>
                            <PhoneInput
                               label="WhatsApp Comercial"
                               value={profile.phone || ''}
                               onChange={val => setProfile({...profile, phone: val})}
                               className="w-full"
                            />
                         </div>
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><Instagram className="w-3 h-3" /> Instagram (Usuário)</label>
                            <div className="flex bg-white rounded-2xl overflow-hidden">
                               <div className="bg-gray-100 px-4 flex items-center text-slate-400 font-bold text-sm">@</div>
                               <input 
                                  type="text" 
                                  className="flex-1 bg-transparent border-none p-4 font-bold outline-none" 
                                  value={profile.social_links?.instagram || ''} 
                                  onChange={e => setProfile({...profile, social_links: {...profile.social_links, instagram: e.target.value}})} 
                                  placeholder="seu.perfil" 
                               />
                            </div>
                         </div>
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><Globe className="w-3 h-3" /> Website Oficial</label>
                            <input 
                               type="url" 
                               className="w-full bg-white border-none rounded-2xl p-4 font-bold" 
                               value={profile.social_links?.website || ''} 
                               onChange={e => setProfile({...profile, social_links: {...profile.social_links, website: e.target.value}})} 
                               placeholder="https://www.seusite.com.br" 
                            />
                         </div>
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><Calendar className="w-3 h-3" /> Link Agenda (Calendly/Google)</label>
                            <input 
                               type="url" 
                               className="w-full bg-white border-none rounded-2xl p-4 font-bold" 
                               value={profile.store_config?.calendar_link || ''} 
                               onChange={e => setProfile({...profile, store_config: {...profile.store_config, calendar_link: e.target.value}})} 
                               placeholder="https://calendly.com/seu-link" 
                            />
                         </div>
                      </div>
                   </div>

                   {/* PORTFÃ“LIO DE VÍDEOS */}
                   <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 space-y-8">
                      <div className="flex justify-between items-center">
                         <h4 className="flex items-center gap-2 text-sm font-black text-indigo-900 uppercase"><Youtube className="w-5 h-5" /> Portfólio de vídeos</h4>
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{(profile.store_config?.video_portfolio?.length || 0)} / 9 vídeos</span>
                      </div>
                      
                      <div className="flex gap-4">
                         <input 
                            type="url" 
                            className="flex-1 bg-white border-none rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-indigo-500/10" 
                            value={videoUrlInput} 
                            onChange={e => setVideoUrlInput(e.target.value)} 
                            placeholder="Link do Reel do Instagram (ex: https://www.instagram.com/reels/...)" 
                         />
                         <button 
                            onClick={addVideo}
                            className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
                            disabled={(profile.store_config?.video_portfolio?.length || 0) >= 9}
                         >
                            <Plus className="w-4 h-4" /> ADICIONAR VÍDEO
                         </button>
                      </div>

                      {profile.store_config?.video_portfolio && profile.store_config.video_portfolio.length > 0 && (
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {profile.store_config.video_portfolio.map((url, idx) => (
                               <div key={idx} className="relative aspect-[9/16] bg-black rounded-3xl overflow-hidden group border border-gray-200 shadow-xl">
                                  <iframe 
                                     src={`${url.split('?')[0]}embed`}
                                     className="w-full h-full border-none"
                                     allowFullScreen
                                  />
                                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button 
                                        onClick={() => removeVideo(idx)}
                                        className="p-2 bg-rose-500 text-white rounded-xl shadow-lg hover:bg-rose-600 transition-colors"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                     </button>
                                  </div>
                               </div>
                            ))}
                         </div>
                      )}
                   </div>

                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><User className="w-3 h-3" /> Sobre Mim</label>
                            <textarea rows={5} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium resize-none" value={profile.store_config?.about_me || ''} onChange={e => setProfile({...profile, store_config: {...profile.store_config, about_me: e.target.value}})} placeholder="Conte sua trajetória e formação..." />
                         </div>
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><ListChecks className="w-3 h-3" /> Soluções e Serviços</label>
                            <textarea rows={5} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium resize-none" value={profile.store_config?.solutions || ''} onChange={e => setProfile({...profile, store_config: {...profile.store_config, solutions: e.target.value}})} placeholder="Quais serviços ou produtos você oferece?" />
                         </div>
                      </div>
                      <div className="space-y-6">
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><Target className="w-3 h-3" /> Problemas que resolvo</label>
                            <textarea rows={5} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium resize-none" value={profile.store_config?.problems_solved || ''} onChange={e => setProfile({...profile, store_config: {...profile.store_config, problems_solved: e.target.value}})} placeholder="Quais dores ou necessidades do cliente você elimina?" />
                         </div>
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><Heart className="w-3 h-3" /> Interesses de Negócio</label>
                            <textarea rows={5} className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-medium resize-none" value={profile.store_config?.business_interests || ''} onChange={e => setProfile({...profile, store_config: {...profile.store_config, business_interests: e.target.value}})} placeholder="Com que tipo de parceiro ou cliente você quer se conectar?" />
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
              <div className="bg-white rounded-[3.5rem] w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden border border-white/5 animate-scale-in flex flex-col">
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
                               <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-black text-xl italic tracking-tight" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} placeholder="Ex: Por que investir em consultoria local?" />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                               <div>
                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Categoria Principal</label>
                                  <select className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold" value={blogForm.category} onChange={e => setBlogForm({...blogForm, category: e.target.value})}>
                                     <option>Marketing</option>
                                     <option>Estratégia</option>
                                     <option>Dicas</option>
                                     <option>Novidades</option>
                                     <option>Gastronomia</option>
                                  </select>
                               </div>
                               <div>
                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Autor Responsável</label>
                                  <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold opacity-50" value={profile.business_name || user?.name} readOnly />
                               </div>
                            </div>

                            <div>
                               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><AlignLeft className="w-3 h-3" /> Resumo Curto</label>
                               <textarea rows={2} required className="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm font-medium leading-relaxed resize-none" value={blogForm.summary} onChange={e => setBlogForm({...blogForm, summary: e.target.value})} placeholder="Breve introdução do tema..." />
                            </div>
                         </div>

                         <div className="lg:col-span-5">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><ImageIcon className="w-3 h-3" /> Capa do Artigo</label>
                            <div className="aspect-[4/3] bg-gray-50 rounded-[2.5rem] border-4 border-dashed border-gray-100 relative overflow-hidden group cursor-pointer" onClick={() => fileInputBlogRef.current?.click()}>
                               {blogForm.image_url ? <img src={blogForm.image_url} className="w-full h-full object-cover" /> : <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4"><Camera className="w-12 h-12" /><span className="text-[10px] font-black uppercase tracking-[0.2em]">Upload Foto</span></div>}
                               <input type="file" ref={fileInputBlogRef} hidden accept="image/*" onChange={e => handleImageUpload(e, 'blogUrl')} />
                            </div>
                         </div>

                         <div className="lg:col-span-12">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Conteúdo Completo</label>
                            <textarea rows={12} required className="w-full bg-gray-50 border-none rounded-[2.5rem] p-10 text-lg font-medium leading-relaxed" value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} placeholder="Escreva seu conhecimento aqui..." />
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
            <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden border border-white/5 animate-scale-in flex flex-col">
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
                       <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" value={categoryForm.name} onChange={e => setCategoryForm({name: e.target.value})} placeholder="Ex: Hamburgueres Artesanais, Serviços de Design..." />
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
            <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-white/5 animate-scale-in flex flex-col max-h-[95vh]">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center flex-shrink-0">
                   <h3 className="text-2xl font-black uppercase italic tracking-tighter">{editingProduct ? 'Editar Item' : 'Novo Item'}</h3>
                   <button onClick={() => setIsProductModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={handleProductSubmit} className="p-10 space-y-8 overflow-y-auto scrollbar-hide flex-1">
                    <div className="grid md:grid-cols-2 gap-10">
                       <div className="space-y-6">
                          <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Nome do Item</label>
                             <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                          </div>
                          <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Link de Redirecionamento (Opcional)</label>
                             <input type="url" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold" value={productForm.external_link || ''} onChange={e => setProductForm({...productForm, external_link: e.target.value})} placeholder="https://..." />
                          </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Tipo de Item</label>
                                 <select required className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold" value={productForm.product_type} onChange={e => setProductForm({...productForm, product_type: e.target.value as any})}>
                                    <option value="Produto">PRODUTO</option>
                                    <option value="Serviço">SERVIÇO</option>
                                    <option value="Mentoria">MENTORIA</option>
                                 </select>
                              </div>
                              <div>
                                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Subcategoria (Vitrine)</label>
                                 <select className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold" value={productForm.store_category_id} onChange={e => setProductForm({...productForm, store_category_id: e.target.value})}>
                                    <option value="">Nenhuma</option>
                                    {storeCategories.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)}
                                 </select>
                              </div>
                           </div>
                       </div>
                       <div className="space-y-6">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Imagem</label>
                           <div className="aspect-square bg-gray-50 rounded-[2.5rem] border-4 border-dashed border-gray-100 relative overflow-hidden group cursor-pointer" onClick={() => fileInputProductRef.current?.click()}>
                              {productForm.image_url ? <img src={productForm.image_url} className="w-full h-full object-cover" /> : <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4"><Camera className="w-12 h-12" /><span className="text-[10px] font-black uppercase">Upload</span></div>}
                              <input type="file" ref={fileInputProductRef} hidden onChange={e => handleImageUpload(e, 'productUrl')} />
                           </div>

                           <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Preço Sugerido (R$)</label>
                              <input required type="number" step="0.01" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold" value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} />
                           </div>
                          
                          <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                             <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aceita Menu Cash?</span>
                                <button 
                                  type="button"
                                  onClick={() => setProductForm(prev => ({ ...prev, accepts_menu_cash: !prev.accepts_menu_cash }))}
                                  className={`w-12 h-6 rounded-full transition-all relative ${productForm.accepts_menu_cash ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                >
                                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${productForm.accepts_menu_cash ? 'left-7' : 'left-1'}`} />
                                </button>
                             </div>
                             
                             {productForm.accepts_menu_cash && (
                                <div className="animate-fade-in">
                                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Percentual de Menu Cash</label>
                                   <select 
                                      className="w-full bg-white border border-gray-100 rounded-xl p-3 font-bold text-xs"
                                      value={productForm.menu_cash_percentage}
                                      onChange={e => setProductForm({...productForm, menu_cash_percentage: Number(e.target.value)})}
                                   >
                                      <option value={5}>5%</option>
                                      <option value={10}>10%</option>
                                      <option value={15}>15%</option>
                                      <option value={20}>20%</option>
                                   </select>
                                </div>
                             )}
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


      {/* MODAL: CONFIRMAÃ‡ÃƒO DE EXCLUSÃƒO */}
      {isDeleteModalOpen && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-scale-in">
                <div className="p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center mx-auto border border-rose-100 mb-6">
                        <Trash2 className="w-10 h-10 text-rose-500" />
                    </div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">Excluir Produto?</h3>
                    <p className="text-slate-500 font-medium">Esta ação é irreversível e o item será removido permanentemente da sua vitrine.</p>
                    <div className="flex gap-4 pt-4">
                        <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-gray-200 transition-all">CANCELAR</button>
                        <button onClick={confirmDeleteProduct} className="flex-1 py-4 bg-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all">EXCLUIR AGORA</button>
                    </div>
                </div>
            </div>
         </div>
      )}
    </div>
  );
};
