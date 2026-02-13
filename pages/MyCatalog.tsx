
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { Product, Profile, StoreCategory } from '../types';
import { 
  Store, Settings, LayoutGrid, Package, CheckCircle, ChevronRight, 
  Upload, Sparkles, Clock, CreditCard, 
  Plus, Trash2, Edit2, 
  DollarSign, Image as ImageIcon, Eye, ArrowLeft,
  QrCode, X, Calendar, Wallet, Check, MapPin
} from 'lucide-react';

export const MyCatalog: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [viewMode, setViewMode] = useState<'setup' | 'preview'>('setup');
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [storeCategories, setStoreCategories] = useState<StoreCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({ name: '', description: '', price: 0, category: '', storeCategoryId: '', available: true });

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
    setProductForm({ name: '', description: '', price: 0, category: '', storeCategoryId: '', available: true });
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const finishSetup = () => {
      alert("Configuração da Loja concluída com sucesso!");
      setViewMode('preview');
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
                   <h1 className="text-3xl md:text-5xl font-black tracking-tight">Setup da Loja</h1>
                   <p className="text-indigo-200 text-lg font-medium">Configure sua vitrine digital em 4 passos simples.</p>
                </div>
              </div>
              <button onClick={() => setViewMode('preview')} className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl font-bold text-white hover:bg-white/20 transition-all">
                  <Eye className="w-5 h-5" /> Ver Vitrine
              </button>
            </div>

            {/* Stepper with Academy Style */}
            <div className="flex gap-4 mt-12 bg-black/20 p-2 rounded-[2rem] border border-white/10 w-full overflow-x-auto scrollbar-hide">
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

       <div className="animate-[fade-in_0.4s_ease-out] bg-white rounded-[3rem] p-8 md:p-16 border border-gray-100 shadow-xl flex flex-col min-h-[500px]">
          <div className="flex-1">
              {currentStep === 1 && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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
                       <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Breve Descrição</label>
                          <textarea rows={3} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-medium focus:ring-2 focus:ring-indigo-100" value={profile.bio || ''} onChange={e => handleProfileUpdate({ bio: e.target.value })} placeholder="Diga o que sua loja oferece..." />
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
                       <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase">PNG ou JPG (Máx. 2MB)</p>
                    </div>
                 </div>
              )}

              {currentStep === 2 && (
                 <div className="space-y-12">
                    <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2"><Settings className="text-indigo-600" /> Configurações de Operação</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 flex flex-col items-center text-center">
                          <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-4"><Clock className="w-7 h-7" /></div>
                          <h4 className="font-black text-indigo-950 mb-2 uppercase tracking-widest text-xs">Agendamento Online</h4>
                          <p className="text-sm text-indigo-700/70 font-medium mb-6">Permita que clientes reservem serviços diretamente.</p>
                          <button onClick={() => handleProfileUpdate({ storeConfig: { ...profile.storeConfig, schedulingEnabled: !profile.storeConfig?.schedulingEnabled } })} className={`px-8 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all ${profile.storeConfig?.schedulingEnabled ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-indigo-400'}`}>
                             {profile.storeConfig?.schedulingEnabled ? 'ATIVADO' : 'DESATIVADO'}
                          </button>
                       </div>
                       <div className="p-8 bg-emerald-50/50 rounded-[2.5rem] border border-emerald-100 flex flex-col items-center text-center">
                          <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4"><Wallet className="w-7 h-7" /></div>
                          <h4 className="font-black text-emerald-950 mb-2 uppercase tracking-widest text-xs">Pagamento PIX</h4>
                          <p className="text-sm text-emerald-700/70 font-medium mb-6">Integre sua chave PIX para pagamentos instantâneos.</p>
                          <button onClick={() => handleProfileUpdate({ storeConfig: { ...profile.storeConfig, paymentMethods: { ...profile.storeConfig?.paymentMethods, pix: { enabled: !profile.storeConfig?.paymentMethods?.pix.enabled } } } } as any)} className={`px-8 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all ${profile.storeConfig?.paymentMethods?.pix.enabled ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-emerald-400'}`}>
                             {profile.storeConfig?.paymentMethods?.pix.enabled ? 'ATIVADO' : 'DESATIVADO'}
                          </button>
                       </div>
                    </div>
                 </div>
              )}

              {currentStep === 3 && (
                 <div className="space-y-8">
                    <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2"><LayoutGrid className="text-indigo-600" /> Organização do Catálogo</h3>
                    <div className="max-w-lg">
                       <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Nova Categoria</label>
                       <div className="flex gap-2">
                          <input type="text" className="flex-1 bg-gray-50 border-none rounded-2xl p-4 font-bold focus:ring-2 focus:ring-indigo-100" placeholder="Ex: Bolos, Doces, Serviços..." value={newCatName} onChange={e => setNewCatName(e.target.value)} onKeyPress={e => e.key === 'Enter' && addCategory()} />
                          <button onClick={addCategory} className="bg-indigo-600 text-white px-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700">ADICIONAR</button>
                       </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {storeCategories.map(cat => (
                          <div key={cat.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 group">
                             <span className="font-bold text-gray-900 uppercase text-xs tracking-widest">{cat.name}</span>
                             <button onClick={() => deleteCategory(cat.id)} className="p-2 text-gray-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                          </div>
                       ))}
                       {storeCategories.length === 0 && (
                           <div className="col-span-full py-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-[2rem]">
                               <p className="text-xs font-bold uppercase tracking-widest">Nenhuma categoria cadastrada</p>
                           </div>
                       )}
                    </div>
                 </div>
              )}

              {currentStep === 4 && (
                 <div className="space-y-8">
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
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                   <button className="p-2 bg-white text-rose-500 rounded-xl shadow-lg"><Trash2 className="w-4 h-4" /></button>
                                </div>
                             </div>
                             <h4 className="font-black text-gray-900 truncate">{prod.name}</h4>
                             <p className="text-indigo-600 font-black text-lg mt-1">R$ {prod.price.toFixed(2)}</p>
                          </div>
                       ))}
                       {products.length === 0 && (
                           <div className="col-span-full py-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-[2rem]">
                               <p className="text-xs font-bold uppercase tracking-widest">Nenhum item cadastrado ainda</p>
                           </div>
                       )}
                    </div>
                 </div>
              )}
          </div>

          {/* Navigation Bar */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
              <button 
                onClick={prevStep} 
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${currentStep === 1 ? 'opacity-0' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                  <ArrowLeft className="w-4 h-4" /> Passo Anterior
              </button>
              
              <div className="flex gap-2">
                  <span className={`w-2 h-2 rounded-full ${currentStep >= 1 ? 'bg-indigo-600' : 'bg-gray-200'}`}></span>
                  <span className={`w-2 h-2 rounded-full ${currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></span>
                  <span className={`w-2 h-2 rounded-full ${currentStep >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`}></span>
                  <span className={`w-2 h-2 rounded-full ${currentStep >= 4 ? 'bg-indigo-600' : 'bg-gray-200'}`}></span>
              </div>

              {currentStep < 4 ? (
                <button 
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 hover:-translate-y-1 transition-all"
                >
                    Próximo Passo <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                    onClick={finishSetup}
                    className="flex items-center gap-2 bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-600 hover:-translate-y-1 transition-all"
                >
                    Salvar e Finalizar <Check className="w-4 h-4" />
                </button>
              )}
          </div>
       </div>

       {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-2xl font-black text-gray-900">Novo Produto/Serviço</h3>
                   <button onClick={() => setIsProductModalOpen(false)}><X className="w-6 h-6 text-gray-300" /></button>
                </div>
                <form onSubmit={saveProduct} className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Nome do Item</label>
                            <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold focus:ring-2 focus:ring-indigo-100" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Preço (R$)</label>
                            <input required type="number" step="0.01" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold focus:ring-2 focus:ring-indigo-100" value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} />
                        </div>
                   </div>
                   <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Categoria</label>
                        <select required className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold focus:ring-2 focus:ring-indigo-100" value={productForm.storeCategoryId} onChange={e => setProductForm({...productForm, storeCategoryId: e.target.value})}>
                            <option value="">Selecione...</option>
                            {storeCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                   </div>
                   <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Descrição</label>
                        <textarea rows={3} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-medium focus:ring-2 focus:ring-indigo-100" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
                   </div>
                   <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Foto do Item</label>
                        <div className="flex gap-4 items-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-2xl border border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                {productForm.imageUrl ? <img src={productForm.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-300 w-8 h-8" />}
                            </div>
                            <input type="file" onChange={e => handleImageUpload(e, 'product')} />
                        </div>
                   </div>
                   <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all">SALVAR ITEM NO CATÁLOGO</button>
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
            <button onClick={onBack} className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest"><ArrowLeft className="w-4 h-4" /> Voltar ao Setup</button>
            <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest flex items-center gap-2"><Check className="w-3 h-3" /> Sua vitrine está online</span>
        </div>
        
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
            <div className="h-48 bg-gradient-to-r from-indigo-900 to-slate-900 relative">
                <div className="absolute -bottom-12 left-12 w-24 h-24 rounded-[1.5rem] bg-white p-1 shadow-2xl border border-gray-100 overflow-hidden">
                    <img src={profile.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.businessName}`} className="w-full h-full object-cover rounded-xl" />
                </div>
            </div>
            <div className="pt-16 px-12 pb-12">
                <h2 className="text-4xl font-black text-gray-900 mb-2">{profile.businessName || 'Minha Loja'}</h2>
                <div className="flex items-center gap-2 text-indigo-600 font-bold mb-6"><MapPin className="w-4 h-4" /> {profile.city || 'Brasil'}</div>
                <p className="text-gray-500 max-w-2xl leading-relaxed font-medium mb-12">{profile.bio || 'Bem-vindo ao nosso catálogo oficial!'}</p>
                
                <div className="space-y-12">
                    {storeCategories.map((cat: any) => (
                        <div key={cat.id}>
                            <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3"><span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span> {cat.name}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {products.filter((p: any) => p.storeCategoryId === cat.id).map((prod: any) => (
                                    <div key={prod.id} className="bg-gray-50 rounded-[2rem] p-4 border border-gray-100">
                                        <div className="aspect-square bg-white rounded-2xl mb-4 overflow-hidden"><img src={prod.imageUrl} className="w-full h-full object-cover" /></div>
                                        <h4 className="font-black text-gray-900 text-sm truncate">{prod.name}</h4>
                                        <p className="text-indigo-600 font-black mt-1">R$ {prod.price.toFixed(2)}</p>
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
