
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { Product, Profile, StoreCategory } from '../types';
import { 
  Store, Settings, LayoutGrid, Package, CheckCircle, ChevronRight, 
  Upload, Sparkles, Clock, CreditCard, 
  Plus, Trash2, Edit2, 
  DollarSign, Image as ImageIcon, Eye, ArrowLeft,
  QrCode, X, Calendar, Wallet
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

  if (viewMode === 'preview') return <StorePreview profile={profile} products={products} storeCategories={storeCategories} onBack={() => setViewMode('setup')} />;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4">
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
                   <p className="text-indigo-200 text-lg font-medium">Configure sua vitrine digital e agendamento.</p>
                </div>
              </div>
              <button onClick={() => setViewMode('preview')} className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl font-bold text-white hover:bg-white/20 transition-all">
                  <Eye className="w-5 h-5" /> Preview Loja
              </button>
            </div>

            {/* Stepper with Academy Style */}
            <div className="flex gap-4 mt-12 bg-black/20 p-2 rounded-[2rem] border border-white/10 w-full overflow-x-auto scrollbar-hide">
                {[
                    { id: 1, label: 'IDENTIDADE', icon: Store },
                    { id: 2, label: 'OPERAÇÃO', icon: Settings },
                    { id: 3, label: 'ORGANIZAÇÃO', icon: LayoutGrid },
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

       <div className="animate-[fade-in_0.4s_ease-out] bg-white rounded-[3rem] p-8 md:p-16 border border-gray-100 shadow-xl">
          {currentStep === 1 && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                   <h3 className="text-2xl font-black text-gray-900 mb-6">Informações da Marca</h3>
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
             <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 flex flex-col items-center text-center">
                      <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-4"><Clock className="w-7 h-7" /></div>
                      <h4 className="font-black text-indigo-950 mb-2 uppercase tracking-widest text-xs">Agendamento Online</h4>
                      <p className="text-sm text-indigo-700/70 font-medium mb-6">Permita reservas diretas na sua loja.</p>
                      <button onClick={() => handleProfileUpdate({ storeConfig: { ...profile.storeConfig, schedulingEnabled: !profile.storeConfig?.schedulingEnabled } })} className={`px-8 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all ${profile.storeConfig?.schedulingEnabled ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-indigo-400'}`}>
                         {profile.storeConfig?.schedulingEnabled ? 'ATIVADO' : 'DESATIVADO'}
                      </button>
                   </div>
                   <div className="p-8 bg-emerald-50/50 rounded-[2.5rem] border border-emerald-100 flex flex-col items-center text-center">
                      <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4"><Wallet className="w-7 h-7" /></div>
                      <h4 className="font-black text-emerald-950 mb-2 uppercase tracking-widest text-xs">Pagamento PIX</h4>
                      <p className="text-sm text-emerald-700/70 font-medium mb-6">Receba diretamente na sua conta.</p>
                      <button onClick={() => handleProfileUpdate({ storeConfig: { ...profile.storeConfig, paymentMethods: { ...profile.storeConfig?.paymentMethods, pix: { enabled: !profile.storeConfig?.paymentMethods?.pix.enabled } } } } as any)} className={`px-8 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all ${profile.storeConfig?.paymentMethods?.pix.enabled ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-emerald-400'}`}>
                         {profile.storeConfig?.paymentMethods?.pix.enabled ? 'ATIVADO' : 'DESATIVADO'}
                      </button>
                   </div>
                </div>
             </div>
          )}

          {currentStep === 4 && (
             <div className="space-y-8">
                <div className="flex justify-between items-center">
                   <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Meus Itens</h3>
                   <button onClick={() => setIsProductModalOpen(true)} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 flex items-center gap-2">
                      <Plus className="w-5 h-5" /> Adicionar Item
                   </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {products.map(prod => (
                      <div key={prod.id} className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden p-4 hover:shadow-xl transition-all">
                         <div className="aspect-square rounded-2xl bg-gray-100 mb-4 overflow-hidden relative">
                            <img src={prod.imageUrl} className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                               <button className="p-2 bg-white text-rose-500 rounded-xl shadow-lg"><Trash2 className="w-4 h-4" /></button>
                            </div>
                         </div>
                         <h4 className="font-black text-gray-900 truncate">{prod.name}</h4>
                         <p className="text-indigo-600 font-black text-lg mt-1">R$ {prod.price.toFixed(2)}</p>
                      </div>
                   ))}
                </div>
             </div>
          )}
       </div>
    </div>
  );
};

const StorePreview = ({ onBack }: any) => <div className="p-12 text-center"><button onClick={onBack} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold">Voltar ao Setup</button></div>;
