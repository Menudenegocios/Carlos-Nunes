
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { Product, Profile, StoreCategory } from '../types';
import { 
  Store, Settings, LayoutGrid, Package, CheckCircle, ChevronRight, 
  Upload, Sparkles, Clock, CreditCard, 
  Plus, Trash2, Edit2, 
  DollarSign, Image as ImageIcon, Eye, ArrowLeft,
  QrCode, X, Calendar, Wallet, Check, MapPin, Link as LinkIcon,
  Tag, Info, Target, Briefcase, Award, Globe, AlignLeft, HelpCircle, Home as HomeIcon
} from 'lucide-react';
import { SectionLanding } from '../components/SectionLanding';

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
    category: 'Produtos', 
    storeCategoryId: '', 
    available: true,
    externalLink: ''
  });

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
        setProfile(prof || { userId: user.id });
        setStoreCategories(cats);
        setProducts(prods);
        
        // Se já tem produtos, o Início não é obrigatório, mas fica acessível
        if ((prods && prods.length > 0) || (cats && cats.length > 0)) {
          // Mantemos a opção de começar no 1 ou na Home. 
          // Se for a primeira vez, Home. Se já usa, Passo 1.
        } else {
            setCurrentStep('home');
        }
    } finally { setIsLoading(false); }
  };

  const handleProfileUpdate = (updatedFields: Partial<Profile>) => {
      if (!user) return;
      const newProfile = { ...profile, ...updatedFields };
      setProfile(newProfile);
      mockBackend.updateProfile(user.id, newProfile);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'cover' | 'product') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (field === 'logo') handleProfileUpdate({ logoUrl: result });
        if (field === 'product') setProductForm(prev => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addCategory = async () => {
    if (!user || !newCatName.trim()) return;
    const newCat = await mockBackend.createStoreCategory(user.id, newCatName);
    setStoreCategories([...storeCategories, newCat]);
    setNewCatName('');
  };

  const deleteCategory = async (id: string) => {
    if (!user) return;
    await mockBackend.deleteStoreCategory(id, user.id);
    setStoreCategories(storeCategories.filter(c => c.id !== id));
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const newProd = await mockBackend.createProduct({ ...productForm, userId: user.id } as Product);
    setProducts([...products, newProd]);
    setIsProductModalOpen(false);
    setProductForm({ name: '', description: '', price: 0, category: 'Produtos', storeCategoryId: '', available: true, externalLink: '' });
  };

  const nextStep = () => {
      if (currentStep === 'home') setCurrentStep(1);
      else setCurrentStep(prev => Math.min((prev as number) + 1, 4));
  };
  const prevStep = () => {
      if (currentStep === 1) setCurrentStep('home');
      else setCurrentStep(prev => Math.max((prev as number) - 1, 1));
  };

  if (viewMode === 'preview') return <StorePreview profile={profile} products={products} storeCategories={storeCategories} onBack={() => setViewMode('setup')} />;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4 px-4">
       {/* Academy Style Header */}
       <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
                   <Store className="h-10 w-10 text-emerald-400" />
                </div>
                <div>
                   <h1 className="text-3xl md:text-5xl font-black tracking-tight">Catálogo & Loja</h1>
                   <p className="text-indigo-200 text-lg font-medium">Sua vitrine profissional completa.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setViewMode('preview')} className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl font-bold text-white hover:bg-white/20 transition-all">
                    <Eye className="w-5 h-5" /> Ver Vitrine
                </button>
              </div>
            </div>

            {/* Internal Sub-nav */}
            <div className="flex gap-3 mt-12 bg-black/20 p-2 rounded-[2rem] border border-white/10 w-full overflow-x-auto scrollbar-hide">
                <button onClick={() => setCurrentStep('home')} className={`flex items-center gap-3 px-6 py-3 rounded-[1.4rem] font-black text-[10px] tracking-widest transition-all ${currentStep === 'home' ? 'bg-white text-indigo-900 shadow-xl' : 'text-indigo-100 hover:bg-white/10'}`}>
                    <HomeIcon className="w-4 h-4" /> INÍCIO
                </button>
                {[
                    { id: 1, label: 'IDENTIDADE', icon: Store },
                    { id: 2, label: 'OPERAÇÃO', icon: Settings },
                    { id: 3, label: 'CATEGORIAS', icon: LayoutGrid },
                    { id: 4, label: 'PRODUTOS', icon: Package }
                ].map((step) => (
                    <button key={step.id} onClick={() => setCurrentStep(step.id)} className={`flex items-center gap-3 px-6 py-3 rounded-[1.4rem] font-black text-[10px] tracking-widest transition-all duration-300 whitespace-nowrap ${currentStep === step.id ? 'bg-white text-indigo-900 shadow-xl' : 'text-indigo-100 hover:bg-white/10'}`}>
                        <step.icon className="w-4 h-4" /> {step.label}
                    </button>
                ))}
            </div>
          </div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>
       </div>

       <div className="animate-[fade-in_0.4s_ease-out]">
          {currentStep === 'home' ? (
              <SectionLanding 
                title="Sua Vitrine Digital que Vende 24h por dia."
                subtitle="Catálogo & Loja Online"
                description="Organize seus produtos e serviços em uma vitrine profissional. Receba pedidos organizados diretamente no seu WhatsApp e elimine as taxas de comissão dos grandes marketplaces."
                benefits={[
                  "Cadastro ilimitado de produtos com fotos e descrições.",
                  "Organização por categorias para facilitar a navegação do cliente.",
                  "Botão de compra direta para o seu WhatsApp Business.",
                  "Integração com chaves PIX para pagamentos instantâneos.",
                  "Painel de gestão intuitivo para controle de estoque e preços."
                ]}
                youtubeId="dQw4w9WgXcQ"
                ctaLabel="CADASTRAR MEUS PRODUTOS"
                onStart={() => setCurrentStep(1)}
                icon={Store}
                accentColor="emerald"
              />
          ) : (
             <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-gray-100 shadow-xl flex flex-col min-h-[500px]">
                <div className="flex-1">
                    {currentStep === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-fade-in">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2"><Store className="text-indigo-600" /> Informações da Marca</h3>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Nome do Negócio</label>
                                    <input type="text" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold focus:ring-2 focus:ring-indigo-100" value={profile.businessName || ''} onChange={e => handleProfileUpdate({ businessName: e.target.value })} placeholder="Ex: Doceria da Ana" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Categoria Principal</label>
                                    <select className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold focus:ring-2 focus:ring-indigo-100" value={profile.category || ''} onChange={e => handleProfileUpdate({ category: e.target.value })} >
                                        <option value="">Selecione...</option>
                                        <option value="Gastronomia">Gastronomia</option>
                                        <option value="Serviços">Serviços</option>
                                        <option value="Varejo">Varejo</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
                                <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-xl overflow-hidden mb-6 border-4 border-white">
                                    {profile.logoUrl ? <img src={profile.logoUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-200"><Store className="w-12 h-12" /></div>}
                                </div>
                                <label className="cursor-pointer bg-white border border-gray-200 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
                                    <Upload className="w-4 h-4 inline mr-2" /> Upload Logo
                                    <input type="file" hidden onChange={e => handleImageUpload(e, 'logo')} />
                                </label>
                            </div>
                        </div>
                    )}
                    {currentStep === 2 && (
                         <div className="space-y-12 animate-fade-in">
                            <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2"><Settings className="text-indigo-600" /> Configurações de Operação</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                               <div className="p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 flex flex-col items-center text-center">
                                  <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-4"><Clock className="w-7 h-7" /></div>
                                  <h4 className="font-black text-indigo-950 mb-2 uppercase tracking-widest text-xs">Agendamento Online</h4>
                                  <button onClick={() => handleProfileUpdate({ storeConfig: { ...profile.storeConfig, schedulingEnabled: !profile.storeConfig?.schedulingEnabled } })} className={`px-8 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all ${profile.storeConfig?.schedulingEnabled ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-indigo-400'}`}>
                                     {profile.storeConfig?.schedulingEnabled ? 'ATIVADO' : 'DESATIVADO'}
                                  </button>
                               </div>
                            </div>
                         </div>
                    )}
                    {currentStep === 3 && (
                        <div className="space-y-8 animate-fade-in">
                            <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2"><LayoutGrid className="text-indigo-600" /> Categorias</h3>
                            <div className="flex gap-2 max-w-lg">
                                <input type="text" className="flex-1 bg-gray-50 border-none rounded-2xl p-4 font-bold focus:ring-2 focus:ring-indigo-100" placeholder="Ex: Bolos, Doces..." value={newCatName} onChange={e => setNewCatName(e.target.value)} onKeyPress={e => e.key === 'Enter' && addCategory()} />
                                <button onClick={addCategory} className="bg-indigo-600 text-white px-6 rounded-2xl font-black text-xs uppercase tracking-widest">ADD</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               {storeCategories.map(cat => (
                                  <div key={cat.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 group">
                                     <span className="font-bold text-gray-900 uppercase text-xs tracking-widest">{cat.name}</span>
                                     <button onClick={() => deleteCategory(cat.id)} className="p-2 text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                                  </div>
                               ))}
                            </div>
                        </div>
                    )}
                    {currentStep === 4 && (
                        <div className="space-y-8 animate-fade-in">
                           <div className="flex justify-between items-center">
                              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2"><Package className="text-indigo-600" /> Meus Itens</h3>
                              <button onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 flex items-center gap-2">
                                 <Plus className="w-5 h-5" /> Adicionar Item
                              </button>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                              {products.map(prod => (
                                 <div key={prod.id} className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden p-4 hover:shadow-xl transition-all">
                                    <div className="aspect-square rounded-2xl bg-gray-100 mb-4 overflow-hidden relative">
                                       {prod.imageUrl ? <img src={prod.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-200"><ImageIcon className="w-10 h-10" /></div>}
                                       <button className="absolute top-2 right-2 p-2 bg-white text-rose-500 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                    <div className="px-2">
                                       <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase mb-2 inline-block">{prod.category}</span>
                                       <h4 className="font-black text-gray-900 truncate">{prod.name}</h4>
                                       <p className="text-indigo-600 font-black text-lg mt-1">R$ {prod.price.toFixed(2)}</p>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                    )}
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
                    <button 
                        onClick={prevStep} 
                        className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all bg-gray-100 text-gray-600 hover:bg-gray-200`}
                    >
                        <ArrowLeft className="w-4 h-4" /> Anterior
                    </button>
                    <div className="flex gap-2">
                        <span className={`w-2 h-2 rounded-full ${currentStep === 'home' ? 'bg-indigo-600' : 'bg-gray-200'}`}></span>
                        {[1, 2, 3, 4].map(s => <span key={s} className={`w-2 h-2 rounded-full ${currentStep === s ? 'bg-indigo-600' : 'bg-gray-200'}`}></span>)}
                    </div>
                    {currentStep !== 4 && (
                        <button 
                            onClick={nextStep}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all"
                        >
                            Próximo <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
             </div>
          )}
       </div>

       {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
             <div className="bg-white rounded-[3.5rem] w-full max-w-4xl p-0 shadow-2xl overflow-hidden animate-[scale-in_0.3s_ease-out]">
                {/* Modal Header */}
                <div className="bg-indigo-900 px-10 py-8 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-3xl font-black tracking-tight">Novo Item</h3>
                        <p className="text-indigo-200 font-medium">Cadastre os detalhes da oferta.</p>
                    </div>
                    <button onClick={() => setIsProductModalOpen(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                        <X className="w-8 h-8 text-white" />
                    </button>
                </div>

                <form onSubmit={saveProduct} className="p-10 md:p-12 overflow-y-auto max-h-[75vh]">
                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Imagem Area */}
                        <div className="lg:col-span-4">
                            <div className="aspect-square bg-gray-50 rounded-[2.5rem] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center overflow-hidden group relative hover:border-indigo-200 transition-all">
                                {productForm.imageUrl ? (
                                    <img src={productForm.imageUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-6 text-gray-300">
                                        <Upload className="w-12 h-12 mx-auto mb-4" />
                                        <p className="text-[10px] font-black uppercase">Upload Foto</p>
                                    </div>
                                )}
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleImageUpload(e, 'product')} />
                            </div>
                        </div>

                        {/* Form Area */}
                        <div className="lg:col-span-8 space-y-6">
                            <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold focus:ring-4 focus:ring-indigo-50 transition-all" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} placeholder="Nome do Produto" />
                            <input required type="number" step="0.01" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold focus:ring-4 focus:ring-indigo-50 transition-all" value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} placeholder="R$ 0.00" />
                            <select required className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold focus:ring-4 focus:ring-indigo-50 transition-all" value={productForm.storeCategoryId} onChange={e => setProductForm({...productForm, storeCategoryId: e.target.value})}>
                                <option value="">Selecione uma categoria...</option>
                                {storeCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <textarea rows={4} className="w-full bg-gray-50 border-none rounded-[2rem] p-6 font-medium text-sm focus:ring-4 focus:ring-indigo-50 transition-all resize-none" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} placeholder="Descrição detalhada..." />
                            <button type="submit" className="w-full bg-indigo-600 text-white font-black py-6 rounded-[2rem] shadow-2xl uppercase tracking-[0.2em] text-sm hover:bg-indigo-700 transition-all">
                                SALVAR NO CATÁLOGO
                            </button>
                        </div>
                   </div>
                </form>
             </div>
          </div>
       )}
    </div>
  );
};

const StorePreview = ({ onBack, profile, products, storeCategories }: any) => (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4 px-4">
        <div className="flex items-center justify-between mb-8">
            <button onClick={onBack} className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest"><ArrowLeft className="w-4 h-4" /> Voltar</button>
        </div>
        
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
            <div className="h-48 bg-gradient-to-r from-indigo-900 to-slate-900 relative">
                <div className="absolute -bottom-12 left-12 w-24 h-24 rounded-[1.5rem] bg-white p-1 shadow-2xl border border-gray-100 overflow-hidden">
                    <img src={profile.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.businessName}`} className="w-full h-full object-cover rounded-xl" />
                </div>
            </div>
            <div className="pt-16 px-12 pb-12">
                <h2 className="text-4xl font-black text-gray-900 mb-2">{profile.businessName || 'Minha Loja'}</h2>
                <div className="space-y-12 mt-12">
                    {storeCategories.map((cat: any) => (
                        <div key={cat.id}>
                            <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3"><span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span> {cat.name}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {products.filter((p: any) => p.storeCategoryId === cat.id).map((prod: any) => (
                                    <div key={prod.id} className="bg-gray-50 rounded-[2rem] p-4 border border-gray-100">
                                        <div className="aspect-square bg-white rounded-2xl mb-4 overflow-hidden"><img src={prod.imageUrl} className="w-full h-full object-cover" /></div>
                                        <div className="px-1">
                                            <h4 className="font-black text-gray-900 text-sm truncate">{prod.name}</h4>
                                            <p className="text-indigo-600 font-black mt-1">R$ {prod.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);
