
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { generateMarketingCopy } from '../services/geminiService';
import { Product, Profile, StoreCategory } from '../types';
import { 
  Store, Settings, LayoutGrid, Package, CheckCircle, ChevronRight, 
  Upload, Sparkles, MapPin, Phone, Clock, CreditCard, 
  MessageCircle, Instagram, Globe, Plus, Trash2, Edit2, 
  DollarSign, Image as ImageIcon, Eye, ArrowLeft, RefreshCw, 
  QrCode, ShoppingCart, Search, Menu, Star, Map, Share2, X, 
  CheckCircle as CheckCircle2, Calendar, BookOpen, FileText, Trash,
  Send
} from 'lucide-react';

export const MyCatalog: React.FC = () => {
  const { user } = useAuth();
  
  // Navigation State
  const [currentStep, setCurrentStep] = useState(1);
  const [viewMode, setViewMode] = useState<'setup' | 'preview'>('setup');
  const [isLoading, setIsLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Data State
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [storeCategories, setStoreCategories] = useState<StoreCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Specific Form States
  const [newCatName, setNewCatName] = useState('');
  
  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
      name: '', description: '', price: 0, category: '', storeCategoryId: '', buttonType: 'buy', available: true
  });

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
        const prof = await mockBackend.getProfile(user.id);
        const cats = await mockBackend.getStoreCategories(user.id);
        const prods = await mockBackend.getProducts(user.id);
        
        const initialProfile = prof || {
            userId: user.id,
            logoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`,
            storeConfig: {
                themeColor: 'indigo',
                salesType: 'both',
                aiChatEnabled: false,
                schedulingEnabled: false,
                paymentMethods: {
                    pix: { enabled: true, key: '', keyType: 'random' },
                    mercadoPago: { enabled: false },
                    onDelivery: true,
                    creditCard: false
                }
            }
        };

        setProfile(initialProfile);
        setStoreCategories(cats);
        setProducts(prods);
    } finally {
        setIsLoading(false);
    }
  };

  const handleProfileUpdate = (updatedFields: Partial<Profile>) => {
      if (!user) return;
      const newProfile = { ...profile, ...updatedFields };
      if (updatedFields.storeConfig) {
          newProfile.storeConfig = { ...(profile.storeConfig || {}), ...updatedFields.storeConfig };
      }
      if (updatedFields.socialLinks) {
          newProfile.socialLinks = { ...(profile.socialLinks || {}), ...updatedFields.socialLinks };
      }
      setProfile(newProfile);
      mockBackend.updateProfile(user.id, newProfile);
  };

  const handleAddCategory = async () => {
      if (!user || !newCatName.trim()) return;
      const newCat = await mockBackend.createStoreCategory(user.id, newCatName);
      setStoreCategories([...storeCategories, newCat]);
      setNewCatName('');
  };

  const handleDeleteCategory = async (id: string) => {
      if (!user) return;
      await mockBackend.deleteStoreCategory(id, user.id);
      setStoreCategories(storeCategories.filter(c => c.id !== id));
  };

  const openProductModal = (product?: Product) => {
      if (product) {
          setEditingProduct(product);
          setProductForm(product);
      } else {
          setEditingProduct(null);
          setProductForm({
              name: '', description: '', price: 0, 
              category: 'Geral', 
              storeCategoryId: storeCategories[0]?.id || '', 
              buttonType: 'buy', available: true,
              imageUrl: '', videoUrl: ''
          });
      }
      setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return;
      const payload = { ...productForm, userId: user.id, price: Number(productForm.price), category: productForm.category || 'Geral' } as Product;
      if (editingProduct) {
          await mockBackend.deleteProduct(editingProduct.id, user.id); 
          await mockBackend.createProduct(payload); 
      } else {
          await mockBackend.createProduct(payload);
      }
      setIsProductModalOpen(false);
      loadData();
  };

  const handleDeleteProduct = async (id: string) => {
      if (!user || !window.confirm('Excluir?')) return;
      await mockBackend.deleteProduct(id, user.id);
      loadData();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'cover' | 'product') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (field === 'logo') handleProfileUpdate({ logoUrl: result });
        if (field === 'cover') handleProfileUpdate({ storeConfig: { ...profile.storeConfig, coverUrl: result } });
        if (field === 'product') setProductForm(prev => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (viewMode === 'preview') return <StorePreview profile={profile} products={products} storeCategories={storeCategories} onBack={() => setViewMode('setup')} />;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex justify-between items-end mb-8">
              <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                      <Store className="w-8 h-8 text-indigo-600" /> Setup da Loja
                  </h1>
                  <p className="text-gray-500">Configure sua vitrine digital e agendamento em passos simples.</p>
              </div>
              <button 
                  onClick={() => setViewMode('preview')}
                  className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-xl font-bold shadow-sm border border-gray-200 hover:bg-gray-50"
              >
                  <Eye className="w-4 h-4" /> Visualizar Loja
              </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-8">
              <div className="flex justify-between items-center relative">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10"></div>
                  {[
                      { id: 1, label: 'Cadastro', icon: Store },
                      { id: 2, label: 'Configuração', icon: Settings },
                      { id: 3, label: 'Categorias', icon: LayoutGrid },
                      { id: 4, label: 'Itens', icon: Package }
                  ].map((step) => (
                      <button key={step.id} onClick={() => setCurrentStep(step.id)} className={`flex flex-col items-center gap-2 bg-white px-2 transition-all ${currentStep === step.id ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${currentStep === step.id ? 'border-indigo-600 bg-indigo-50' : currentStep > step.id ? 'border-green-500 bg-green-50 text-green-500' : 'border-gray-200'}`}>
                              {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                          </div>
                          <span className="text-xs font-bold">{step.label}</span>
                      </button>
                  ))}
              </div>
          </div>

          <div className="mb-20 min-h-[400px]">
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Negócio</label>
                                <input type="text" className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500" value={profile.businessName || ''} onChange={e => handleProfileUpdate({ businessName: e.target.value })} placeholder="Ex: Doceria da Ana" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Categoria Principal</label>
                                <select className="w-full border-gray-300 rounded-lg p-2.5" value={profile.category || ''} onChange={e => handleProfileUpdate({ category: e.target.value })} >
                                    <option value="">Selecione...</option>
                                    <option value="Gastronomia">Gastronomia</option>
                                    <option value="Serviços">Serviços</option>
                                    <option value="Varejo">Varejo</option>
                                    <option value="Saúde">Saúde</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                                    {profile.logoUrl ? <img src={profile.logoUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><Store /></div>}
                                </div>
                                <label className="cursor-pointer bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                                    <Upload className="w-4 h-4 inline mr-2" /> Upload Logo
                                    <input type="file" hidden onChange={e => handleImageUpload(e, 'logo')} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-indigo-600" /> Agendamento Online</h3>
                            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${profile.storeConfig?.schedulingEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                                       <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-indigo-900">Ativar Agenda de Horários</p>
                                        <p className="text-xs text-indigo-700">Permita que clientes reservem serviços direto na loja.</p>
                                    </div>
                                </div>
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer"
                                        checked={profile.storeConfig?.schedulingEnabled || false}
                                        onChange={e => handleProfileUpdate({ storeConfig: { ...profile.storeConfig, schedulingEnabled: e.target.checked } })}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-indigo-600" /> Tipo de Operação</h3>
                            <div className="flex gap-2">
                                {['product', 'service', 'both'].map((type) => (
                                    <button key={type} onClick={() => handleProfileUpdate({ storeConfig: { ...profile.storeConfig, salesType: type as any } })} className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${profile.storeConfig?.salesType === type ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'}`}>
                                        {type === 'product' ? 'Produtos' : type === 'service' ? 'Serviços' : 'Ambos'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="font-bold text-indigo-900 text-lg">Organize seu Catálogo</h3>
                            <p className="text-sm text-indigo-700">Crie seções para facilitar a navegação (ex: Promoções, Lançamentos).</p>
                        </div>
                        <div className="flex w-full md:w-auto gap-2">
                            <input type="text" placeholder="Ex: Bebidas" className="flex-1 border-gray-300 rounded-lg p-2.5 text-sm min-w-[200px]" value={newCatName} onChange={e => setNewCatName(e.target.value)} />
                            <button onClick={handleAddCategory} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700"><Plus className="w-5 h-5" /></button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {storeCategories.map(cat => (
                            <div key={cat.id} className="p-3 bg-white border border-gray-200 rounded-xl flex justify-between items-center group">
                                <span className="font-bold text-gray-700 text-sm">{cat.name}</span>
                                <button onClick={() => handleDeleteCategory(cat.id)} className="text-gray-300 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-900">Seus Produtos/Serviços</h3>
                        <button onClick={() => openProductModal()} className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg hover:bg-indigo-700 flex items-center gap-2"><Plus className="w-5 h-5" /> Novo Item</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {products.map(prod => (
                            <div key={prod.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group p-4 flex flex-col">
                                <div className="w-full aspect-square rounded-xl bg-gray-100 mb-4 overflow-hidden relative">
                                    {prod.imageUrl ? <img src={prod.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon className="w-8 h-8" /></div>}
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openProductModal(prod)} className="p-1.5 bg-white text-gray-700 rounded-lg shadow hover:bg-indigo-50"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDeleteProduct(prod.id)} className="p-1.5 bg-white text-rose-500 rounded-lg shadow hover:bg-rose-50"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <h4 className="font-bold text-gray-900 truncate">{prod.name}</h4>
                                <p className="text-sm font-black text-indigo-600 mt-1">R$ {prod.price.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </div>
              )}
          </div>

          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-40">
              <div className="max-w-5xl mx-auto flex justify-between items-center">
                  <button onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))} disabled={currentStep === 1} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-50">Voltar</button>
                  <div className="flex gap-2">
                      {currentStep < 4 ? (
                          <button onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex items-center gap-2">Próximo <ChevronRight className="w-4 h-4" /></button>
                      ) : (
                          <button onClick={() => setViewMode('preview')} className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Finalizar</button>
                      )}
                  </div>
              </div>
          </div>
       </div>

       {/* Product Modal */}
       {isProductModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
               <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                   <div className="flex justify-between items-center mb-6">
                       <h3 className="text-xl font-bold">{editingProduct ? 'Editar Item' : 'Novo Item'}</h3>
                       <button onClick={() => setIsProductModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
                   </div>
                   <form onSubmit={handleProductSubmit} className="space-y-4">
                       <div className="flex gap-4 items-center">
                           <div className="w-24 h-24 bg-gray-100 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden cursor-pointer relative hover:bg-gray-200">
                               {productForm.imageUrl ? <img src={productForm.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-400" />}
                               <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleImageUpload(e, 'product')} />
                           </div>
                           <div className="flex-1">
                               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Item</label>
                               <input required type="text" className="w-full border-gray-200 rounded-xl p-2.5" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                           </div>
                       </div>
                       
                       <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição</label>
                           <textarea rows={2} className="w-full border-gray-200 rounded-xl p-2.5" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Preço (R$)</label>
                               <div className="relative">
                                   <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                   <input type="number" step="0.01" className="w-full border-gray-200 rounded-xl p-2.5 pl-9" value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} />
                               </div>
                           </div>
                           <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria</label>
                               <select className="w-full border-gray-200 rounded-xl p-2.5 text-sm" value={productForm.storeCategoryId} onChange={e => setProductForm({...productForm, storeCategoryId: e.target.value})}>
                                   <option value="">Selecione...</option>
                                   {storeCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                               </select>
                           </div>
                       </div>

                       <div className="flex justify-end gap-2 pt-4">
                           <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-6 py-2.5 text-gray-500 font-bold hover:bg-gray-50 rounded-xl">Cancelar</button>
                           <button type="submit" className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg">Salvar Item</button>
                       </div>
                   </form>
               </div>
           </div>
       )}
    </div>
  );
};

// Local Preview Component for consistency
const StorePreview = ({ profile, products, storeCategories, onBack }: any) => {
    const [activeCat, setActiveCat] = useState<string>('todos');
    const filteredProducts = activeCat === 'todos' ? products : products.filter((p: any) => p.storeCategoryId === activeCat);

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <header className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 h-16 flex items-center justify-between">
                <button onClick={onBack} className="text-gray-500 hover:text-gray-900 flex items-center gap-2 text-sm font-bold bg-gray-100 px-4 py-2 rounded-full">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </button>
                <span className="font-bold text-gray-900 truncate">{profile.businessName}</span>
                <div className="w-10"></div>
            </header>

            <div className="relative h-[300px] bg-indigo-900">
                {profile.storeConfig?.coverUrl && <img src={profile.storeConfig.coverUrl} className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute bottom-6 left-6 flex items-end gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-xl"><img src={profile.logoUrl} className="w-full h-full object-cover rounded-xl" /></div>
                    <div className="text-white pb-1"><h1 className="text-2xl font-black">{profile.businessName}</h1><p className="text-xs opacity-80">{profile.category}</p></div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 mt-8">
                <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                    <button onClick={() => setActiveCat('todos')} className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap ${activeCat === 'todos' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-400'}`}>Todos</button>
                    {storeCategories.map((c: any) => (
                        <button key={c.id} onClick={() => setActiveCat(c.id)} className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap ${activeCat === c.id ? 'bg-indigo-600 text-white' : 'bg-white text-gray-400'}`}>{c.name}</button>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredProducts.map((p: any) => (
                        <div key={p.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="aspect-square bg-gray-100 rounded-xl mb-4 overflow-hidden">{p.imageUrl && <img src={p.imageUrl} className="w-full h-full object-cover" />}</div>
                            <h3 className="font-bold text-gray-900">{p.name}</h3>
                            <p className="text-sm font-black text-indigo-600 mt-1">R$ {p.price.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};
