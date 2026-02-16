
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { Product, Profile, StoreCategory } from '../types';
import { 
  Store, Settings, LayoutGrid, Package, CheckCircle, ChevronRight, 
  Upload, Sparkles, Clock, CreditCard, 
  Plus, Trash2, Edit2, 
  DollarSign, Image as ImageIcon, Eye, ArrowLeft,
  QrCode, X, Calendar, Wallet, Check, MapPin, Link as LinkIcon,
  Tag, Info, Target, Briefcase, Award, Globe, AlignLeft, HelpCircle, Home as HomeIcon,
  Table as TableIcon, FileText, Download, Wand2, RefreshCw, Zap, Video, BarChart, Ticket,
  ShoppingCart, Camera, Save, Phone, Smartphone
} from 'lucide-react';
import { SectionLanding } from '../components/SectionLanding';

const StorePreview: React.FC<{ profile: Partial<Profile>, products: Product[], storeCategories: StoreCategory[], onBack: () => void }> = ({ profile, products, storeCategories, onBack }) => {
  const [activeCat, setActiveCat] = useState('todos');
  
  const filteredProducts = activeCat === 'todos' 
    ? products 
    : products.filter(p => p.storeCategoryId === activeCat);

  return (
    <div className="bg-gray-50 dark:bg-[#020617] min-h-screen pb-20 -m-6 md:-m-10 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 p-4 sticky top-0 z-[100] border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between shadow-sm">
        <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 dark:text-brand-primary font-black text-[10px] uppercase tracking-widest hover:opacity-70 transition-all">
           <ArrowLeft className="w-4 h-4" /> VOLTAR AO EDITOR
        </button>
        <div className="flex items-center gap-2">
            <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">Modo preview real</span>
        </div>
      </div>

      <div className="relative h-64 md:h-80 w-full bg-[#0F172A] overflow-hidden">
        {profile.storeConfig?.coverUrl ? (
           <img src={profile.storeConfig.coverUrl} className="w-full h-full object-cover opacity-60" alt="Cover" />
        ) : (
           <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-slate-900 to-emerald-900 opacity-60"></div>
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
           <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-white p-1 shadow-2xl mb-4 overflow-hidden border-[6px] border-white/20">
              <img src={profile.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.businessName}`} className="w-full h-full object-cover rounded-[2.2rem]" alt="Logo" />
           </div>
           <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-center">{profile.businessName || 'Minha loja'}</h1>
           <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] mt-2 flex items-center gap-2 bg-black/20 px-4 py-1.5 rounded-full backdrop-blur-md">
              <MapPin className="w-3 h-3 text-[#F67C01]" /> {profile.neighborhood || profile.city || 'Sua localização'}
           </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-10 space-y-10">
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-2 shadow-2xl border border-gray-100 dark:border-zinc-800 flex gap-1 overflow-x-auto scrollbar-hide">
            <button 
              onClick={() => setActiveCat('todos')}
              className={`px-8 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeCat === 'todos' ? 'bg-[#F67C01] text-white shadow-xl scale-105' : 'text-slate-400 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
            >
                🔥 Todos os itens
            </button>
            {storeCategories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className={`px-8 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeCat === cat.id ? 'bg-[#F67C01] text-white shadow-xl scale-105' : 'text-slate-400 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
                >
                    {cat.name}
                </button>
            ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
           {filteredProducts.map(prod => (
              <div key={prod.id} className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] p-4 pb-8 shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-2xl transition-all duration-500 flex flex-col">
                 <div className="aspect-square rounded-[2rem] bg-gray-50 dark:bg-zinc-800 mb-6 overflow-hidden shadow-inner relative group">
                    {prod.imageUrl ? <img src={prod.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={prod.name} /> : <div className="w-full h-full flex items-center justify-center text-gray-200 dark:text-zinc-700"><ImageIcon className="w-10 h-10" /></div>}
                 </div>
                 <div className="px-2 flex-1 flex flex-col">
                    <h4 className="font-black text-gray-900 dark:text-white text-xs mb-2 truncate uppercase italic tracking-tight">{prod.name}</h4>
                    <p className="text-gray-50 dark:text-zinc-500 text-[10px] line-clamp-2 mb-6 font-medium leading-relaxed">{prod.description}</p>
                    <div className="mt-auto flex justify-between items-end">
                        <p className="text-[#F67C01] font-black text-xl">R$ {prod.price.toFixed(2)}</p>
                        <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg">
                           <ShoppingCart className="w-4 h-4" />
                        </div>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      </div>
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
  
  const [newCatName, setNewCatName] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
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

  const fileInputLogoRef = useRef<HTMLInputElement>(null);
  const fileInputCoverRef = useRef<HTMLInputElement>(null);
  const fileInputProductRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
        const [prof, cats, prods] = await Promise.all([
            mockBackend.getProfile(user.id),
            mockBackend.getStoreCategories(user.id),
            mockBackend.getProducts(user.id)
        ]);
        setProfile(prof || { userId: user.id, storeConfig: { paymentMethods: { pix: { enabled: true }, onDelivery: true, creditCard: true } } } as any);
        setStoreCategories(cats);
        setProducts(prods || []);
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
            // Mock backend implementation usually needs an updateProduct method
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

  if (viewMode === 'preview') return <StorePreview profile={profile} products={products} storeCategories={storeCategories} onBack={() => setViewMode('setup')} />;

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

            {/* Abas Padronizadas com Sublegenda */}
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
                    { id: 4, label: 'Produtos', desc: 'Gerenciar itens', icon: Package }
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
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Bairro / Região</label>
                                        <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold focus:ring-4 focus:ring-brand-primary/10 dark:text-white" value={profile.neighborhood || ''} onChange={e => handleProfileUpdate({ neighborhood: e.target.value })} placeholder="Ex: Jardins" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Cidade</label>
                                        <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold focus:ring-4 focus:ring-brand-primary/10 dark:text-white" value={profile.city || ''} onChange={e => handleProfileUpdate({ city: e.target.value })} placeholder="Ex: São Paulo" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Biografia Curta (Marketplace)</label>
                                    <textarea rows={3} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-medium text-sm focus:ring-4 focus:ring-brand-primary/10 dark:text-white resize-none" value={profile.bio || ''} onChange={e => handleProfileUpdate({ bio: e.target.value })} placeholder="Conte em 2 frases o diferencial do seu negócio..." />
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
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Camera className="w-6 h-6 text-white" /></div>
                                </div>
                                <input type="file" ref={fileInputCoverRef} hidden accept="image/*" onChange={e => handleImageUpload(e, 'coverUrl')} />
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

                {/* STEP 4: PRODUTOS */}
                {currentStep === 4 && (
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
                                <div key={prod.id} className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 p-4 pb-8 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col">
                                    <div className="aspect-square rounded-[2rem] bg-gray-50 dark:bg-zinc-800 mb-6 overflow-hidden relative group">
                                        {prod.imageUrl ? <img src={prod.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={prod.name} /> : <div className="w-full h-full flex items-center justify-center text-gray-200"><ImageIcon className="w-8 h-8" /></div>}
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
                                        <p className="text-gray-500 dark:text-zinc-500 text-[10px] font-medium leading-relaxed line-clamp-2 mb-6">{prod.description}</p>
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
                        <p className="text-[10px] font-black text-[#F67C01] tracking-widest mt-1 uppercase">Preencha os detalhes para publicação</p>
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
                                <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white focus:ring-4 focus:ring-indigo-500/10" value={productForm.storeCategoryId} onChange={e => setProductForm({...productForm, storeCategoryId: e.target.value})}>
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
    </div>
  );
};
