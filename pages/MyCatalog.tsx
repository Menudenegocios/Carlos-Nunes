
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { Product, Profile, StoreCategory, Coupon } from '../types';
import { 
  Store, Settings, LayoutGrid, Package, CheckCircle, ChevronRight, 
  Upload, Sparkles, Clock, CreditCard, 
  Plus, Trash2, Edit2, 
  DollarSign, Image as ImageIcon, Eye, ArrowLeft,
  QrCode, X, Calendar, Wallet, Check, MapPin, Link as LinkIcon,
  Tag, Info, Target, Briefcase, Award, Globe, AlignLeft, HelpCircle, Home as HomeIcon,
  Table as TableIcon, FileText, Download, Wand2, RefreshCw, Zap, Video, BarChart, Ticket,
  ShoppingCart, Camera, Save, Phone, Smartphone, Minus, MessageCircle, Instagram, Youtube, Play
} from 'lucide-react';
import { SectionLanding } from '../components/SectionLanding';

interface CartItem extends Product {
  quantity: number;
}

const StorePreview: React.FC<{ profile: Partial<Profile>, products: Product[], storeCategories: StoreCategory[], coupons: Coupon[], onBack: () => void }> = ({ profile, products, storeCategories, coupons, onBack }) => {
  const [activeCat, setActiveCat] = useState('todos');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null);
  
  const filteredProducts = activeCat === 'todos' 
    ? products 
    : products.filter(p => p.storeCategoryId === activeCat);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.promoPrice || item.price) * item.quantity, 0);
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const handleFinishOrder = () => {
    const phone = profile.phone?.replace(/\D/g, '') || '';
    if (!phone) {
        alert("Configure um número de WhatsApp nas configurações da loja.");
        return;
    }

    let msg = `🛒 *NOVO PEDIDO - ${profile.businessName?.toUpperCase()}*\n\n`;
    cart.forEach(item => {
        msg += `✅ ${item.quantity}x ${item.name} - R$ ${((item.promoPrice || item.price) * item.quantity).toFixed(2)}\n`;
    });
    msg += `\n*TOTAL: R$ ${subtotal.toFixed(2)}*\n\n_Pedido enviado via Menu de Negócios_`;
    
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const id = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
        return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('instagram.com/reel')) {
        return `${url.split('?')[0]}embed`;
    }
    return url;
  };

  return (
    <div className="bg-gray-50 dark:bg-[#020617] min-h-screen pb-32 -m-6 md:-m-10 animate-fade-in relative">
      <div className="bg-white dark:bg-zinc-900 p-6 sticky top-0 z-[100] border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between shadow-md">
        <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 dark:text-brand-primary font-black text-[10px] uppercase tracking-widest hover:opacity-70 transition-all">
           <ArrowLeft className="w-4 h-4" /> VOLTAR AO EDITOR
        </button>
        <div className="flex items-center gap-4">
            <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200">Prévia da Vitrine</span>
            <button onClick={() => setIsCartOpen(true)} className="relative p-3 bg-gray-100 dark:bg-zinc-800 rounded-2xl text-gray-700 dark:text-white shadow-sm">
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">{cart.reduce((a, b) => a + b.quantity, 0)}</span>}
            </button>
        </div>
      </div>

      {/* Hero Preview */}
      <div className="relative h-[60vh] min-h-[400px] w-full bg-[#0F172A] overflow-hidden">
        {profile.storeConfig?.coverUrl ? (
           <img src={profile.storeConfig.coverUrl} className="w-full h-full object-cover opacity-70" alt="Cover" />
        ) : (
           <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-slate-900 to-emerald-900 opacity-60"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
           <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-white p-1.5 shadow-2xl mb-6 overflow-hidden border-[6px] border-white/20 backdrop-blur-sm">
              <img src={profile.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.businessName}`} className="w-full h-full object-cover rounded-[2rem]" alt="Logo" />
           </div>
           <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-center mb-6 leading-tight">{profile.businessName || 'Minha loja'}</h1>
           
           <div className="flex flex-col items-center gap-6">
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 bg-black/20 backdrop-blur-md px-5 py-2 rounded-full border border-white/5">
                    <CheckCircle className="w-3.5 h-3.5" /> Aberto Agora
                </span>
           </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-10 space-y-16">
        {/* Barra de Categorias Centralizada e Reordenada no Editor */}
        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-3 shadow-2xl border border-gray-100 dark:border-zinc-800 flex gap-3 overflow-x-auto scrollbar-hide justify-center items-center">
            
            {/* 1. Todos os Itens */}
            <button 
              onClick={() => setActiveCat('todos')}
              className={`px-10 py-5 rounded-[2.2rem] text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeCat === 'todos' ? 'bg-[#F67C01] text-white shadow-xl scale-105' : 'text-slate-400 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
            >
                🔥 Todos os itens
            </button>

            {/* 2. Sua Localização */}
            <span className="px-8 py-4 rounded-[2rem] bg-[#F67C01] text-white shadow-xl flex items-center gap-3 text-[11px] font-black uppercase tracking-widest whitespace-nowrap">
                <MapPin className="w-4 h-4" /> {profile.city || 'Sua localização'}
            </span>

            {/* 3. Assista Nosso Vídeo */}
            {profile.storeConfig?.videoUrl && (
                <button 
                    onClick={() => setVideoModalUrl(profile.storeConfig?.videoUrl || null)}
                    className="px-8 py-4 rounded-[2rem] bg-[#F67C01] text-white shadow-xl hover:scale-105 transition-all flex items-center gap-3 text-[11px] font-black uppercase tracking-widest whitespace-nowrap group"
                >
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-[#F67C01] transition-colors">
                        <Play className="w-2.5 h-2.5 fill-current" />
                    </div>
                    Assista Nosso Vídeo
                </button>
            )}

            <div className="w-px h-8 bg-gray-200 dark:bg-zinc-800 self-center mx-2 hidden sm:block"></div>

            {/* Outras Categorias */}
            {storeCategories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className={`px-10 py-5 rounded-[2.2rem] text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeCat === cat.id ? 'bg-[#F67C01] text-white shadow-xl scale-105' : 'text-slate-400 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
                >
                    {cat.name}
                </button>
            ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
           {filteredProducts.map(prod => (
              <div key={prod.id} className="group bg-white dark:bg-zinc-900 rounded-[3rem] p-5 pb-10 shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-2xl transition-all duration-700 flex flex-col">
                 <div className="aspect-square rounded-[2.5rem] bg-gray-50 dark:bg-zinc-800 mb-8 overflow-hidden shadow-inner relative group">
                    {prod.imageUrl ? <img src={prod.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={prod.name} /> : <div className="w-full h-full flex items-center justify-center text-gray-200 dark:text-zinc-700"><ImageIcon className="w-12 h-12" /></div>}
                 </div>
                 <div className="px-3 flex-1 flex flex-col">
                    <h4 className="font-black text-gray-900 dark:text-white text-lg mb-2 truncate uppercase italic tracking-tight">{prod.name}</h4>
                    <p className="text-gray-50 dark:text-zinc-500 text-xs line-clamp-2 mb-8 font-medium leading-relaxed">{prod.description}</p>
                    <div className="mt-auto flex justify-between items-end">
                        <p className="text-[#F67C01] font-black text-2xl">R$ {prod.price.toFixed(2)}</p>
                        <button 
                          onClick={() => addToCart(prod)}
                          className="p-4 bg-emerald-600 text-white rounded-2xl shadow-xl hover:bg-emerald-700 transition-all active:scale-90"
                        >
                           <Plus className="w-6 h-6" />
                        </button>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      </div>

      {/* Cart Modal Preview */}
      {isCartOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-scale-in">
                  <div className="p-10 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter dark:text-white">Meu Carrinho</h3>
                      <button onClick={() => setIsCartOpen(false)} className="text-slate-400 p-2 hover:bg-gray-50 rounded-2xl"><X className="w-8 h-8" /></button>
                  </div>
                  <div className="p-10 max-h-[400px] overflow-y-auto space-y-6">
                      {cart.length === 0 ? (
                          <p className="text-center text-slate-400 py-10 font-bold uppercase text-[10px] tracking-widest italic">Carrinho vazio</p>
                      ) : cart.map(item => (
                          <div key={item.id} className="flex items-center gap-5">
                              <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden bg-gray-100 shrink-0 shadow-sm">
                                  <img src={item.imageUrl} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                  <h4 className="font-bold text-sm dark:text-white leading-tight">{item.name}</h4>
                                  <p className="text-xs text-emerald-600 font-black mt-1">R$ {(item.promoPrice || item.price).toFixed(2)}</p>
                              </div>
                              <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-800 rounded-xl p-1">
                                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 rounded-lg text-slate-400"><Minus className="w-3 h-3" /></button>
                                  <span className="text-xs font-black dark:text-white">{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 rounded-lg text-slate-400"><Plus className="w-3 h-3" /></button>
                              </div>
                          </div>
                      ))}
                  </div>
                  <div className="p-10 bg-gray-50 dark:bg-zinc-800/50 border-t border-gray-100 dark:border-zinc-800 space-y-8">
                      <div className="flex justify-between items-end">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor do Pedido</span>
                          <span className="text-3xl font-black text-emerald-600">R$ {subtotal.toFixed(2)}</span>
                      </div>
                      <button 
                        onClick={handleFinishOrder}
                        disabled={cart.length === 0}
                        className="w-full py-6 bg-emerald-600 text-white rounded-[2.2rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-4 disabled:opacity-50 active:scale-95"
                      >
                          <MessageCircle className="w-6 h-6" /> FINALIZAR NO WHATSAPP
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Video Modal Cinema Preview */}
      {videoModalUrl && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-fade-in">
              <button onClick={() => setVideoModalUrl(null)} className="absolute top-10 right-10 text-white p-5 bg-white/10 hover:bg-white/20 rounded-full transition-all z-50"><X className="w-10 h-10" /></button>
              <div className="w-full max-w-xl aspect-[9/16] bg-black rounded-[4rem] overflow-hidden shadow-2xl relative border-[10px] border-white/10">
                  <iframe 
                      src={getEmbedUrl(videoModalUrl) || ''} 
                      className="w-full h-full" 
                      frameBorder="0" 
                      allow="autoplay; encrypted-media; fullscreen" 
                      allowFullScreen
                  ></iframe>
              </div>
          </div>
      )}
    </div>
  );
};

export const MyCatalog: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<number | 'home'>(1);
  const [viewMode, setViewMode] = useState<'setup' | 'preview'>('setup');
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [storeCategories, setStoreCategories] = useState<StoreCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  
  const [newCatName, setNewCatName] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({ 
    name: '', 
    description: '', 
    price: 0, 
    category: 'Geral', 
    storeCategoryId: '', 
    available: true,
    imageUrl: ''
  });
  const [couponForm, setCouponForm] = useState<Partial<Coupon>>({
    code: '',
    title: '',
    discount: '',
    pointsReward: 50,
    description: ''
  });

  const fileInputLogoRef = useRef<HTMLInputElement>(null);
  const fileInputCoverRef = useRef<HTMLInputElement>(null);
  const fileInputProductRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
        const [prof, cats, prods, myOffers] = await Promise.all([
            mockBackend.getProfile(user.id),
            mockBackend.getStoreCategories(user.id),
            mockBackend.getProducts(user.id),
            mockBackend.getMyOffers(user.id)
        ]);
        setProfile(prof || { userId: user.id, storeConfig: { paymentMethods: { pix: { enabled: true }, onDelivery: true, creditCard: true } } } as any);
        setStoreCategories(cats);
        setProducts(prods || []);
        
        const allCoupons: Coupon[] = [];
        myOffers.forEach(o => { if(o.coupons) allCoupons.push(...o.coupons); });
        setCoupons(allCoupons);
    } finally { setIsLoading(false); }
  };

  const handleProfileUpdate = (updatedFields: Partial<Profile>) => {
      if (!user) return;
      const newProfile = { ...profile, ...updatedFields };
      setProfile(newProfile);
      mockBackend.updateProfile(user.id, newProfile);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'coverUrl' | 'product') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (field === 'logoUrl') handleProfileUpdate({ logoUrl: base64 });
        else if (field === 'coverUrl') handleProfileUpdate({ storeConfig: { ...profile.storeConfig, coverUrl: base64 } });
        else setProductForm(prev => ({ ...prev, imageUrl: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = async () => {
    if (!user || !newCatName.trim()) return;
    const newCat = await mockBackend.createStoreCategory(user.id, newCatName.trim());
    setStoreCategories([...storeCategories, newCat]);
    setNewCatName('');
  };

  const handleDeleteCategory = async (id: string) => {
    if (!user || !window.confirm('Excluir esta categoria? Os produtos nela ficarão "Sem Categoria".')) return;
    await mockBackend.deleteStoreCategory(id, user.id);
    setStoreCategories(storeCategories.filter(c => c.id !== id));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
        if (editingProduct) {
            const updated = { ...editingProduct, ...productForm };
            setProducts(products.map(p => p.id === editingProduct.id ? (updated as Product) : p));
        } else {
            const newProd = await mockBackend.createProduct({ ...productForm, userId: user.id } as Product);
            setProducts([newProd, ...products]);
        }
        setIsProductModalOpen(false);
        setEditingProduct(null);
        setProductForm({ name: '', description: '', price: 0, category: 'Geral', storeCategoryId: '', available: true, imageUrl: '' });
    } catch (err) {
        alert('Erro ao salvar produto.');
    }
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return;
      const offerId = products[0]?.id || 'mock-offer'; 
      await mockBackend.addCoupon(user.id, offerId, couponForm);
      setCoupons([...coupons, { ...couponForm, id: Date.now().toString() } as Coupon]);
      setIsCouponModalOpen(false);
      setCouponForm({ code: '', title: '', discount: '', pointsReward: 50, description: '' });
  };

  const handleDeleteCoupon = async (id: string) => {
      if (!confirm('Deseja remover este cupom?')) return;
      setCoupons(coupons.filter(c => c.id !== id));
  };

  if (viewMode === 'preview') return <StorePreview profile={profile} products={products} storeCategories={storeCategories} coupons={coupons} onBack={() => setViewMode('setup')} />;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4 px-4">
       {/* Header Premium SaaS */}
       <div className="bg-[#0F172A] dark:bg-black rounded-[3.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="p-5 bg-indigo-500/10 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-xl">
                   <Store className="h-10 w-10 text-brand-primary" />
                </div>
                <div>
                   <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-2">
                     Catálogo & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] dark:from-brand-primary dark:to-brand-accent italic uppercase">Loja</span>
                   </h1>
                   <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">SUA VITRINE PROFISSIONAL DE ALTA CONVERSÃO.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setViewMode('preview')} className="flex items-center gap-2 bg-[#F67C01] px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white hover:bg-orange-600 transition-all shadow-xl active:scale-95">
                    <Eye className="w-4 h-4" /> VER VITRINE ONLINE
                </button>
              </div>
            </div>

            <div className="flex p-1.5 mt-12 bg-white/5 backdrop-blur-md rounded-[2.2rem] border border-white/10 overflow-x-auto scrollbar-hide gap-1">
                <button 
                  onClick={() => setCurrentStep('home')} 
                  className={`flex flex-col items-center justify-center min-w-[110px] px-6 py-3 rounded-[1.8rem] transition-all duration-300 whitespace-nowrap ${currentStep === 'home' ? 'bg-[#F67C01] text-white shadow-xl scale-105' : 'text-slate-400 hover:bg-white/10'}`}
                >
                    <div className="flex items-center gap-2 mb-0.5">
                      <HomeIcon className={`w-3.5 h-3.5 ${currentStep === 'home' ? 'text-white' : 'text-brand-primary'}`} />
                      <span className="font-black text-[10px] tracking-widest uppercase italic">Início</span>
                    </div>
                    <span className={`text-[8px] font-medium opacity-60 ${currentStep === 'home' ? 'text-white' : ''}`}>Boas-vindas</span>
                </button>
                {[
                    { id: 1, label: 'Identidade', desc: 'Marca e logo', icon: Store },
                    { id: 2, label: 'Operação', desc: 'Configurações', icon: Settings },
                    { id: 3, label: 'Categorias', desc: 'Organização', icon: LayoutGrid },
                    { id: 4, label: 'Cupons', desc: 'Descontos', icon: Ticket },
                    { id: 5, label: 'Produtos', desc: 'Gerenciar itens', icon: Package }
                ].map((step) => (
                    <button 
                      key={step.id} 
                      onClick={() => setCurrentStep(step.id)} 
                      className={`flex flex-col items-center justify-center min-w-[110px] px-6 py-3 rounded-[1.8rem] transition-all duration-300 whitespace-nowrap ${currentStep === step.id ? 'bg-[#F67C01] text-white shadow-xl scale-105' : 'text-slate-400 hover:bg-white/10'}`}
                    >
                        <div className="flex items-center gap-2 mb-0.5">
                          <step.icon className={`w-3.5 h-3.5 ${currentStep === step.id ? 'text-white' : 'text-brand-primary'}`} />
                          <span className="font-black text-[10px] tracking-widest uppercase italic">{step.label}</span>
                        </div>
                        <span className={`text-[8px] font-medium opacity-60 ${currentStep === step.id ? 'text-white' : ''}`}>{step.desc}</span>
                    </button>
                ))}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
       </div>

       <div className="animate-[fade-in_0.4s_ease-out]">
          {currentStep === 'home' ? (
              <SectionLanding 
                title="Sua vitrine digital que vende 24h por dia."
                subtitle="Catálogo & Loja Online"
                description="Organize seus produtos e serviços em uma vitrine profissional de alta conversão. Receba pedidos organizados diretamente no seu WhatsApp e multiplique seus resultados regionais sem intermediários."
                benefits={[
                  "Cadastro ilimitado de produtos com fotos reais.",
                  "Receba pedidos no WhatsApp de forma estruturada.",
                  "Controle total de estoque e categorias de itens.",
                  "Design premium otimizado para navegação mobile.",
                  "Selo de produção local exclusivo para membros."
                ]}
                youtubeId="dQw4w9WgXcQ"
                ctaLabel="CADASTRAR MEUS PRODUTOS"
                onStart={() => setCurrentStep(1)}
                icon={Store}
                accentColor="indigo"
              />
          ) : (
             <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 md:p-16 border border-gray-100 dark:border-zinc-800 shadow-xl min-h-[600px]">
                
                {/* STEP 1: IDENTIDADE */}
                {currentStep === 1 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-fade-in">
                        <div className="space-y-10">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3 italic uppercase tracking-tighter"><Store className="text-indigo-600" /> Identidade Visual</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Nome Fantasia do Negócio</label>
                                    <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold focus:ring-4 focus:ring-brand-primary/10 dark:text-white" value={profile.businessName || ''} onChange={e => handleProfileUpdate({ businessName: e.target.value })} placeholder="Ex: Doceria da Ana" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Cidade</label>
                                        <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold focus:ring-4 focus:ring-brand-primary/10 dark:text-white" value={profile.city || ''} onChange={e => handleProfileUpdate({ city: e.target.value })} placeholder="Ex: São Paulo" />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Instagram (@usuario)</label>
                                        <div className="relative group">
                                          <Instagram className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-500" />
                                          <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 pl-12 font-bold dark:text-white" value={profile.socialLinks?.instagram || ''} onChange={e => handleProfileUpdate({ socialLinks: { ...profile.socialLinks, instagram: e.target.value } })} placeholder="Ex: ana_doces" />
                                        </div>
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">WhatsApp de Contato</label>
                                        <div className="relative group">
                                          <MessageCircle className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                                          <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 pl-12 font-bold dark:text-white" value={profile.socialLinks?.whatsapp || ''} onChange={e => handleProfileUpdate({ socialLinks: { ...profile.socialLinks, whatsapp: e.target.value } })} placeholder="Ex: 5511999999999" />
                                        </div>
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Website / Link Externo</label>
                                        <div className="relative group">
                                          <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                                          <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 pl-12 font-bold dark:text-white" value={profile.socialLinks?.website || ''} onChange={e => handleProfileUpdate({ socialLinks: { ...profile.socialLinks, website: e.target.value } })} placeholder="https://seusite.com.br" />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Link de Vídeo (YouTube ou Reels)</label>
                                        <div className="relative group">
                                          <Youtube className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                                          <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 pl-12 font-bold dark:text-white" value={profile.storeConfig?.videoUrl || ''} onChange={e => handleProfileUpdate({ storeConfig: { ...profile.storeConfig, videoUrl: e.target.value } })} placeholder="https://www.youtube.com/watch?v=... ou Reels" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Biografia Curta (Marketplace)</label>
                                    <textarea rows={3} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-medium text-sm focus:ring-4 focus:ring-brand-primary/10 dark:text-white resize-none transition-all" value={profile.bio || ''} onChange={e => handleProfileUpdate({ bio: e.target.value })} placeholder="Conte em 2 frases o diferencial do seu negócio..." />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-12">
                            <div className="p-8 bg-gray-50 dark:bg-zinc-800/40 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-zinc-700 flex flex-col items-center">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Logotipo Principal</h4>
                                <div className="w-32 h-32 rounded-[2.2rem] bg-white shadow-2xl overflow-hidden border-4 border-white relative group cursor-pointer" onClick={() => fileInputLogoRef.current?.click()}>
                                    {profile.logoUrl ? (
                                        <img src={profile.logoUrl} className="w-full h-full object-cover" alt="Logo" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-200"><Camera className="w-10 h-10" /></div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Camera className="w-8 h-8 text-white" /></div>
                                </div>
                                <input type="file" ref={fileInputLogoRef} hidden accept="image/*" onChange={e => handleImageUpload(e, 'logoUrl')} />
                                <p className="text-[9px] font-bold text-slate-400 mt-4 uppercase">Recomendado: 500x500px</p>
                            </div>

                            <div className="p-8 bg-gray-50 dark:bg-zinc-800/40 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-zinc-700">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 text-center">Imagem de Capa da Loja</h4>
                                <div className="h-32 w-full rounded-2xl bg-white shadow-xl overflow-hidden border-4 border-white relative group cursor-pointer" onClick={() => fileInputCoverRef.current?.click()}>
                                    {profile.storeConfig?.coverUrl ? (
                                        <img src={profile.storeConfig.coverUrl} className="w-full h-full object-cover" alt="Cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-200"><ImageIcon className="w-8 h-8" /></div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Camera className="w-8 h-8 text-white" /></div>
                                </div>
                                <input type="file" ref={fileInputCoverRef} hidden accept="image/*" onChange={e => handleImageUpload(e, 'coverUrl')} />
                                <p className="text-[9px] font-bold text-slate-400 mt-4 uppercase text-center">Recomendado 1200x400 pixel</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: OPERAÇÃO */}
                {currentStep === 2 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-fade-in">
                        <div className="space-y-10">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3 italic uppercase tracking-tighter"><Settings className="text-indigo-600" /> Configurações de Venda</h3>
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Número de Recebimento (WhatsApp)</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                                        <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 pl-14 font-bold dark:text-white" value={profile.phone || ''} onChange={e => handleProfileUpdate({ phone: e.target.value })} placeholder="5511999999999" />
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-400 mt-2 italic">* Este é o número que receberá os pedidos do catálogo.</p>
                                </div>
                                
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-1">Métodos de Pagamento Aceitos</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {[
                                            { id: 'pix', label: 'Pix Online', icon: Zap },
                                            { id: 'creditCard', label: 'Cartão / Maquinha', icon: CreditCard },
                                            { id: 'onDelivery', label: 'Na Entrega', icon: ShoppingCart }
                                        ].map(method => (
                                            <button 
                                                key={method.id}
                                                onClick={() => {
                                                    const config = profile.storeConfig || {};
                                                    if (method.id === 'pix') {
                                                        const pixEnabled = !config.paymentMethods?.pix?.enabled;
                                                        handleProfileUpdate({ storeConfig: { ...config, paymentMethods: { ...config.paymentMethods, pix: { enabled: pixEnabled } } } as any });
                                                    } else {
                                                        handleProfileUpdate({ storeConfig: { ...config, paymentMethods: { ...config.paymentMethods, [method.id]: !config.paymentMethods?.[method.id as any] } } as any });
                                                    }
                                                }}
                                                className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                                                    (method.id === 'pix' ? profile.storeConfig?.paymentMethods?.pix?.enabled : profile.storeConfig?.paymentMethods?.[method.id as any])
                                                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-lg'
                                                    : 'border-gray-100 dark:border-zinc-800 text-slate-400'
                                                }`}
                                            >
                                                <method.icon className="w-6 h-6" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{method.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3 italic uppercase tracking-tighter"><Clock className="text-indigo-600" /> Horário de Funcionamento</h3>
                            <div className="bg-gray-50 dark:bg-zinc-800/40 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800">
                                <textarea rows={6} className="w-full bg-white dark:bg-zinc-900 border-none rounded-2xl p-6 font-bold text-sm dark:text-white resize-none shadow-inner" value={profile.storeConfig?.openingHours || ''} onChange={e => handleProfileUpdate({ storeConfig: { ...profile.storeConfig, openingHours: e.target.value } })} placeholder="Ex: Seg a Sex: 09h às 18h&#10;Sab: 09h às 13h&#10;Dom: Fechado" />
                                <div className="mt-4 flex items-center gap-2 text-indigo-600">
                                   <Info className="w-4 h-4" />
                                   <span className="text-[10px] font-black uppercase tracking-widest">Aparecerá no rodapé da loja</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: CATEGORIAS */}
                {currentStep === 3 && (
                    <div className="max-w-3xl mx-auto space-y-12 animate-fade-in">
                        <div className="text-center space-y-4">
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Organize seus Itens</h3>
                            <p className="text-slate-500 font-medium">Crie categorias como "Cardápio Principal", "Promoções", "Serviços Premium", etc.</p>
                        </div>

                        <div className="bg-gray-50 dark:bg-zinc-800/40 p-4 rounded-[3rem] border border-gray-100 dark:border-zinc-800 flex gap-3">
                            <input type="text" className="flex-1 bg-white dark:bg-zinc-900 border-none rounded-[1.8rem] px-8 py-5 font-bold shadow-inner dark:text-white" value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Digite o nome da nova categoria..." />
                            <button onClick={handleAddCategory} className="bg-indigo-600 text-white px-10 py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95">
                                <Plus className="w-4 h-4" /> ADICIONAR
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {storeCategories.length === 0 ? (
                                <div className="py-20 text-center border-4 border-dashed border-gray-100 dark:border-zinc-800 rounded-[3rem]">
                                    <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Nenhuma categoria cadastrada</p>
                                </div>
                            ) : storeCategories.map(cat => (
                                <div key={cat.id} className="flex items-center justify-between p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm group hover:shadow-md transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600"><LayoutGrid className="w-6 h-6" /></div>
                                        <h4 className="font-black text-xl text-gray-900 dark:text-white uppercase italic tracking-tighter">{cat.name}</h4>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{products.filter(p => p.storeCategoryId === cat.id).length} itens</span>
                                        <button onClick={() => handleDeleteCategory(cat.id)} className="p-3 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 4: CUPONS */}
                {currentStep === 4 && (
                    <div className="space-y-10 animate-fade-in">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div>
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Meus Cupons ({coupons.length})</h3>
                                <p className="text-slate-500 font-medium">Gere descontos e fidelize clientes locais.</p>
                            </div>
                            <button onClick={() => { setCouponForm({ code: '', title: '', discount: '', pointsReward: 50, description: '' }); setIsCouponModalOpen(true); }} className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95">
                                <Plus className="w-4 h-4" /> CRIAR NOVO CUPOM
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {coupons.length === 0 ? (
                                <div className="col-span-full py-32 text-center border-4 border-dashed border-gray-100 dark:border-zinc-800 rounded-[4rem]">
                                    <Ticket className="w-20 h-20 text-slate-100 mx-auto mb-8" />
                                    <p className="text-slate-300 font-black uppercase text-sm tracking-[0.4em]">Nenhum cupom ativo</p>
                                </div>
                            ) : coupons.map(coupon => (
                                <div key={coupon.id} className="bg-white dark:bg-zinc-800 p-8 rounded-[2.5rem] border-2 border-dashed border-indigo-100 dark:border-zinc-700 relative overflow-hidden group">
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-6">
                                            <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-mono font-black text-lg px-4 py-2 rounded-xl border border-indigo-100">{coupon.code}</span>
                                            <button onClick={() => handleDeleteCoupon(coupon.id)} className="p-2 text-slate-300 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                        <h4 className="font-black text-gray-900 dark:text-white text-xl italic uppercase tracking-tighter mb-2">{coupon.discount} OFF</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-2 mb-8">{coupon.title}</p>
                                        <div className="mt-auto flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase">
                                            <Zap className="w-3 h-3 fill-current" /> Recompensa: {coupon.pointsReward} pts
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-indigo-50 dark:bg-indigo-950/30 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 5: PRODUTOS */}
                {currentStep === 5 && (
                    <div className="space-y-10 animate-fade-in">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div>
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Meus Itens ({products.length})</h3>
                                <p className="text-slate-500 font-medium">Produtos e serviços visíveis para seus clientes.</p>
                            </div>
                            <button onClick={() => { setEditingProduct(null); setProductForm({ name: '', description: '', price: 0, category: 'Geral', storeCategoryId: '', available: true, imageUrl: '' }); setIsProductModalOpen(true); }} className="bg-[#F67C01] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-2 hover:bg-orange-600 transition-all active:scale-95">
                                <Plus className="w-5 h-5" /> NOVO PRODUTO / SERVIÇO
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.length === 0 ? (
                                <div className="col-span-full py-32 text-center border-4 border-dashed border-gray-100 dark:border-zinc-800 rounded-[4rem]">
                                    <Package className="w-20 h-20 text-slate-100 mx-auto mb-8" />
                                    <p className="text-slate-300 font-black uppercase text-sm tracking-[0.4em]">Seu estoque está vazio</p>
                                </div>
                            ) : products.map(prod => (
                                <div key={prod.id} className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 p-4 pb-8 shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-2xl transition-all duration-500 flex flex-col">
                                    <div className="aspect-square rounded-[2rem] bg-gray-50 dark:bg-zinc-800 mb-6 overflow-hidden relative group">
                                        {prod.imageUrl ? <img src={prod.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={prod.name} /> : <div className="w-full h-full flex items-center justify-center text-gray-200"><ImageIcon className="w-10 h-10" /></div>}
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <button onClick={() => { setEditingProduct(prod); setProductForm(prod); setIsProductModalOpen(true); }} className="p-3 bg-white dark:bg-zinc-900 rounded-xl text-indigo-600 shadow-xl opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all"><Edit2 className="w-4 h-4" /></button>
                                            <button className="p-3 bg-white dark:bg-zinc-900 rounded-xl text-rose-500 shadow-xl opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all delay-75"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <div className="px-2 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-black text-gray-900 dark:text-white text-sm uppercase italic tracking-tighter truncate max-w-[150px]">{prod.name}</h4>
                                            <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase ${prod.available ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                {prod.available ? 'ATIVO' : 'OCULTO'}
                                            </span>
                                        </div>
                                        <p className="text-gray-50 dark:text-zinc-500 text-[10px] font-medium leading-relaxed line-clamp-2 mb-6">{prod.description}</p>
                                        <div className="mt-auto flex justify-between items-end">
                                            <p className="text-[#F67C01] font-black text-xl leading-none">R$ {prod.price.toFixed(2)}</p>
                                            <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-slate-300">
                                                <Smartphone className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
             </div>
          )}
       </div>

       {/* PRODUCT MODAL */}
       {isProductModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
             <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-4xl shadow-2xl overflow-hidden animate-scale-in border border-white/5">
                <div className="bg-[#0F172A] p-8 md:p-10 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-3xl font-black uppercase italic tracking-tighter">{editingProduct ? 'Editar Item' : 'Novo Item'}</h3>
                        <p className="text-[10px] font-black text-[#F67C01] tracking-widest mt-1 uppercase">Preencha os detalhes para publication</p>
                    </div>
                    <button onClick={() => setIsProductModalOpen(false)} className="p-4 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                
                <form onSubmit={handleSaveProduct} className="p-10 md:p-14 overflow-y-auto max-h-[70vh] scrollbar-hide">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div className="space-y-10">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Nome do Produto / Serviço</label>
                                <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white focus:ring-4 focus:ring-brand-primary/10" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} placeholder="Ex: Combo Smash Burger 2.0" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Preço (R$)</label>
                                    <input required type="number" step="0.01" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white focus:ring-4 focus:ring-brand-primary/10" value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Promoção (Opcional)</label>
                                    <input type="number" step="0.01" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white focus:ring-4 focus:ring-emerald-500/10" value={productForm.promoPrice || ''} onChange={e => setProductForm({...productForm, promoPrice: Number(e.target.value) || undefined})} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Descrição Detalhada</label>
                                <textarea rows={4} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-medium text-sm dark:text-white resize-none" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} placeholder="Descreva os ingredientes, tempo de entrega ou detalhes técnicos..." />
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Foto do Item</label>
                                <div className="aspect-video rounded-3xl bg-gray-50 dark:bg-zinc-800 border-4 border-dashed border-gray-200 dark:border-zinc-700 relative overflow-hidden group cursor-pointer" onClick={() => fileInputProductRef.current?.click()}>
                                    {productForm.imageUrl ? (
                                        <img src={productForm.imageUrl} className="w-full h-full object-cover" alt="Product" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                            <ImageIcon className="w-10 h-10 mb-2" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Carregar Foto</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Camera className="w-8 h-8 text-white" /></div>
                                </div>
                                <input type="file" ref={fileInputProductRef} hidden accept="image/*" onChange={e => handleImageUpload(e, 'product')} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Categoria Vinculada</label>
                                <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white focus:ring-4 focus:ring-indigo-50/10" value={productForm.storeCategoryId} onChange={e => setProductForm({...productForm, storeCategoryId: e.target.value})}>
                                    <option value="">Sem categoria</option>
                                    {storeCategories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-zinc-800 rounded-3xl">
                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Visível no catálogo</span>
                                <button type="button" onClick={() => setProductForm({...productForm, available: !productForm.available})} className={`w-14 h-8 rounded-full transition-all relative ${productForm.available ? 'bg-emerald-600' : 'bg-slate-200'}`}>
                                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${productForm.available ? 'left-7' : 'left-1'}`}></div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 flex gap-4">
                        <button type="submit" className="flex-1 bg-[#F67C01] text-white font-black py-6 rounded-[2rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-3">
                            <Save className="w-5 h-5" /> PUBLICAR ITEM AGORA
                        </button>
                    </div>
                </form>
             </div>
          </div>
       )}

       {/* COUPON MODAL */}
       {isCouponModalOpen && (
           <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
              <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-white/5 animate-scale-in">
                  <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter">Novo Cupom</h3>
                      <button onClick={() => setIsCouponModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                  </div>
                  <form onSubmit={handleSaveCoupon} className="p-10 space-y-6">
                      <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Código do Cupom</label>
                          <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-mono font-black text-lg uppercase dark:text-white" value={couponForm.code} onChange={e => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})} placeholder="Ex: BEMVINDO10" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Desconto</label>
                              <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={couponForm.discount} onChange={e => setCouponForm({...couponForm, discount: e.target.value})} placeholder="Ex: 10% ou R$ 5" />
                          </div>
                          <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Pontos (Clube ADS)</label>
                              <input required type="number" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={couponForm.pointsReward} onChange={e => setCouponForm({...couponForm, pointsReward: Number(e.target.value)})} />
                          </div>
                      </div>
                      <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-[2rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all">GERAR CUPOM</button>
                  </form>
              </div>
           </div>
       )}
    </div>
  );
};
