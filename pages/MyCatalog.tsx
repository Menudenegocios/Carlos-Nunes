
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { Product, Profile, StoreCategory, Coupon, Offer } from '../types';
import { generateMarketingCopy } from '../services/geminiService';
import { 
  Store, Settings, LayoutGrid, Package, CheckCircle, ChevronRight, 
  Upload, Sparkles, Clock, CreditCard, 
  Plus, Trash2, Edit2, 
  DollarSign, Image as ImageIcon, Eye, ArrowLeft,
  QrCode, X, Calendar, Wallet, Check, MapPin, Link as LinkIcon,
  Tag, Info, Target, Briefcase, Award, Globe, AlignLeft, HelpCircle, Home as HomeIcon,
  Table as TableIcon, FileText, Download, Wand2, RefreshCw, Zap, Video, BarChart, Ticket
} from 'lucide-react';
import { SectionLanding } from '../components/SectionLanding';

export const MyCatalog: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<number | 'home'>(1);
  const [viewMode, setViewMode] = useState<'setup' | 'preview' | 'bulk'>('setup');
  const [isLoading, setIsLoading] = useState(true);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [storeCategories, setStoreCategories] = useState<StoreCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [myOffers, setMyOffers] = useState<Offer[]>([]);
  // FIX: Explicitly include type and name in state definition to match usage in render
  const [myCoupons, setMyCoupons] = useState<{ coupon: Coupon, ownerId: string, type: string, name: string }[]>([]);
  
  const [newCatName, setNewCatName] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null);

  const [productForm, setProductForm] = useState<Partial<Product>>({ 
    name: '', 
    description: '', 
    price: 0, 
    category: 'Produtos', 
    storeCategoryId: '', 
    available: true,
    externalLink: '',
    videoUrl: '',
    stock: 0,
    pointsReward: 0,
    isLocal: false
  });

  const [couponForm, setCouponForm] = useState({
    itemId: '',
    code: '',
    title: '',
    discount: '',
    pointsReward: 50,
    description: ''
  });

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
        const [prof, cats, prods, offers] = await Promise.all([
            mockBackend.getProfile(user.id),
            mockBackend.getStoreCategories(user.id),
            mockBackend.getProducts(user.id),
            mockBackend.getMyOffers(user.id)
        ]);
        setProfile(prof || { userId: user.id });
        setStoreCategories(cats);
        setProducts(prods || []);
        setMyOffers(offers || []);
        
        // FIX: Correctly populate allCoupons with necessary metadata
        const allCoupons: { coupon: Coupon, ownerId: string, type: string, name: string }[] = [];
        // Note: Currently backend seems to store coupons on offers, 
        // we'll fetch them from the offers retrieved.
        offers.forEach(o => {
          if (o.coupons) {
            o.coupons.forEach(c => allCoupons.push({ coupon: c, ownerId: o.id, type: 'offer', name: o.title }));
          }
        });
        // (Optional) if products had coupons we'd add them here
        setMyCoupons(allCoupons);

        if (!((prods && prods.length > 0) || (cats && cats.length > 0))) {
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
    const productToSave = { ...productForm, userId: user.id } as Product;
    const newProd = await mockBackend.createProduct(productToSave);
    setProducts([...products, newProd]);
    setIsProductModalOpen(false);
    setProductForm({ name: '', description: '', price: 0, category: 'Produtos', storeCategoryId: '', available: true, videoUrl: '', externalLink: '', stock: 0, pointsReward: 0, isLocal: false });
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      const data = {
        code: couponForm.code.toUpperCase(),
        title: couponForm.title,
        discount: couponForm.discount,
        pointsReward: Number(couponForm.pointsReward),
        description: couponForm.description
      };

      if (editingCoupon) {
        await mockBackend.updateCoupon(user.id, couponForm.itemId, editingCoupon.coupon.id, data);
      } else {
        await mockBackend.addCoupon(user.id, couponForm.itemId, data);
      }
      
      setIsCouponModalOpen(false);
      loadData();
    } catch (err) {
      alert("Erro ao salvar cupom.");
    }
  };

  const handleDeleteCoupon = async (couponData: any) => {
    if (!user || !window.confirm('Excluir este cupom?')) return;
    await mockBackend.deleteCoupon(user.id, couponData.ownerId, couponData.coupon.id);
    loadData();
  };

  const enhanceWithAI = async () => {
      if (!productForm.name) {
          alert("Dê um nome ao produto para a IA sugerir uma descrição.");
          return;
      }
      setIsEnhancing(true);
      try {
          const description = await generateMarketingCopy(profile.businessName || 'Loja', `Crie uma descrição curta, vendedora e elegante para o produto: ${productForm.name}.`);
          setProductForm(prev => ({ ...prev, description }));
      } finally {
          setIsEnhancing(false);
      }
  };

  const generatePDFCatalog = () => {
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;
      
      const content = `
        <html>
          <head>
            <title>Catálogo - ${profile.businessName}</title>
            <style>
              body { font-family: sans-serif; padding: 40px; color: #333; }
              .header { text-align: center; margin-bottom: 50px; border-bottom: 2px solid #059669; padding-bottom: 20px; }
              .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 30px; }
              .item { border: 1px solid #eee; padding: 20px; border-radius: 15px; }
              .price { color: #059669; font-weight: bold; font-size: 20px; }
              h1 { margin: 0; color: #000; }
              img { max-width: 100px; border-radius: 10px; margin-bottom: 10px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${profile.businessName || 'Meu Catálogo'}</h1>
              <p>${profile.city || ''} | WhatsApp: ${profile.phone || ''}</p>
            </div>
            <div class="grid">
              ${products.map(p => `
                <div class="item">
                  <h3>${p.name}</h3>
                  <p>${p.description}</p>
                  <div class="price">R$ ${p.price.toFixed(2)}</div>
                </div>
              `).join('')}
            </div>
          </body>
        </html>
      `;
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
  };

  const nextStep = () => {
      if (currentStep === 'home') setCurrentStep(1);
      else setCurrentStep(prev => {
        if (prev === 5) return 5;
        return (prev as number) + 1;
      });
  };
  const prevStep = () => {
      if (currentStep === 1) setCurrentStep('home');
      else setCurrentStep(prev => (prev as number) - 1);
  };

  const updateBulkProduct = (id: string, field: keyof Product, value: any) => {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  if (viewMode === 'preview') return <StorePreview profile={profile} products={products} storeCategories={storeCategories} onBack={() => setViewMode('setup')} />;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4 px-4">
       {/* Academy Style Header */}
       <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-indigo-950 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
                   <Store className="h-10 w-10 text-emerald-400" />
                </div>
                <div>
                   <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none mb-1">Catálogo & Loja</h1>
                   <p className="text-emerald-200 text-lg font-medium opacity-80 uppercase tracking-widest text-xs">Sua vitrine profissional de alta conversão.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setViewMode(viewMode === 'bulk' ? 'setup' : 'bulk')} className="flex items-center gap-2 bg-emerald-600 px-6 py-3 rounded-2xl font-bold text-white hover:bg-emerald-500 transition-all shadow-lg">
                    <TableIcon className="w-5 h-5" /> {viewMode === 'bulk' ? 'Sair Edição Rápida' : 'Edição Rápida'}
                </button>
                <button onClick={() => setIsQrModalOpen(true)} className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl font-bold text-white hover:bg-white/20 transition-all">
                    <QrCode className="w-5 h-5" /> QR Code Loja
                </button>
                <button onClick={generatePDFCatalog} className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl font-bold text-white hover:bg-white/20 transition-all">
                    <FileText className="w-5 h-5" /> Catálogo PDF
                </button>
                <button onClick={() => setViewMode('preview')} className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl font-bold text-white hover:bg-white/20 transition-all">
                    <Eye className="w-5 h-5" /> Ver Vitrine
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-12 bg-black/20 p-2 rounded-[2rem] border border-white/10 w-full overflow-x-auto scrollbar-hide">
                <button onClick={() => { setCurrentStep('home'); setViewMode('setup'); }} className={`flex items-center gap-3 px-6 py-3 rounded-[1.4rem] font-black text-[10px] tracking-widest transition-all ${currentStep === 'home' && viewMode === 'setup' ? 'bg-emerald-600 text-white shadow-xl' : 'text-emerald-100 hover:bg-white/10'}`}>
                    <HomeIcon className="w-4 h-4" /> INÍCIO
                </button>
                {[
                    { id: 1, label: 'IDENTIDADE', icon: Store },
                    { id: 2, label: 'OPERAÇÃO', icon: Settings },
                    { id: 3, label: 'CATEGORIAS', icon: LayoutGrid },
                    { id: 4, label: 'PRODUTOS', icon: Package },
                    { id: 5, label: 'CUPONS', icon: Ticket }
                ].map((step) => (
                    <button key={step.id} onClick={() => { setCurrentStep(step.id); setViewMode('setup'); }} className={`flex items-center gap-3 px-6 py-3 rounded-[1.4rem] font-black text-[10px] tracking-widest transition-all duration-300 whitespace-nowrap ${currentStep === step.id && viewMode === 'setup' ? 'bg-emerald-600 text-white shadow-xl' : 'text-emerald-100 hover:bg-white/10'}`}>
                        <step.icon className="w-4 h-4" /> {step.label}
                    </button>
                ))}
            </div>
          </div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"></div>
       </div>

       <div className="animate-[fade-in_0.4s_ease-out]">
          {viewMode === 'bulk' ? (
              <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-xl space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-2"><TableIcon className="text-emerald-600" /> Edição Rápida</h3>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Controle ágil de estoque e preços</p>
                  </div>
                  <div className="overflow-x-auto rounded-3xl border border-gray-100 dark:border-zinc-800">
                      <table className="w-full text-left">
                          <thead className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-100 dark:border-zinc-700">
                              <tr>
                                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Produto</th>
                                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Preço (R$)</th>
                                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estoque</th>
                                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                              {products.map(prod => (
                                  <tr key={prod.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                      <td className="px-6 py-4">
                                          <div className="flex items-center gap-3">
                                              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                                                  {prod.imageUrl ? <img src={prod.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon className="w-5 h-5 m-auto text-gray-300" />}
                                              </div>
                                              <span className="font-bold text-gray-900 dark:text-white">{prod.name}</span>
                                          </div>
                                      </td>
                                      <td className="px-6 py-4">
                                          <input 
                                            type="number" 
                                            className="w-24 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl p-2 font-bold focus:ring-2 focus:ring-emerald-500/20 dark:text-white" 
                                            value={prod.price} 
                                            onChange={(e) => updateBulkProduct(prod.id, 'price', Number(e.target.value))}
                                          />
                                      </td>
                                      <td className="px-6 py-4">
                                          <input 
                                            type="number" 
                                            className="w-20 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl p-2 font-bold focus:ring-2 focus:ring-emerald-500/20 dark:text-white" 
                                            value={prod.stock || 0} 
                                            onChange={(e) => updateBulkProduct(prod.id, 'stock', Number(e.target.value))}
                                          />
                                      </td>
                                      <td className="px-6 py-4">
                                          <button 
                                            onClick={() => updateBulkProduct(prod.id, 'available', !prod.available)}
                                            className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${prod.available ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}
                                          >
                                              {prod.available ? 'Disponível' : 'Pausado'}
                                          </button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
                  <div className="flex justify-end pt-6">
                      <button onClick={() => { alert("Alterações salvas com sucesso!"); setViewMode('setup'); }} className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-700">
                          SALVAR ALTERAÇÕES
                      </button>
                  </div>
              </div>
          ) : currentStep === 'home' ? (
              <SectionLanding 
                title="Sua Vitrine Digital que Vende 24h por dia."
                subtitle="Catálogo & Loja Online"
                description="Organize seus produtos e serviços em uma vitrine profissional. Receba pedidos organizados diretamente no seu WhatsApp e multiplique seus resultados."
                benefits={[
                  "Cadastro ilimitado de produtos com fotos e descrições.",
                  "Vídeos viciantes: Cole links de Reels ou YouTube nos produtos.",
                  "Controle de Estoque: Evite vender o que não tem em mãos.",
                  "Gerador de QR Code personalizado para sua vitrine física.",
                  "Pixels de Marketing: Integre Google e Facebook para trackear vendas."
                ]}
                youtubeId="dQw4w9WgXcQ"
                ctaLabel="CADASTRAR MEUS PRODUTOS"
                onStart={() => setCurrentStep(1)}
                icon={Store}
                accentColor="emerald"
              />
          ) : (
             <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-8 md:p-16 border border-gray-100 dark:border-zinc-800 shadow-xl flex flex-col min-h-[500px]">
                <div className="flex-1">
                    {currentStep === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-fade-in">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2"><Store className="text-emerald-600" /> Informações da Marca</h3>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Nome do Negócio</label>
                                    <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold focus:ring-2 focus:ring-emerald-500/20 dark:text-white" value={profile.businessName || ''} onChange={e => handleProfileUpdate({ businessName: e.target.value })} placeholder="Ex: Doceria da Ana" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Seu Bairro (Para Selo Local)</label>
                                    <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold focus:ring-2 focus:ring-emerald-500/20 dark:text-white" value={profile.neighborhood || ''} onChange={e => handleProfileUpdate({ neighborhood: e.target.value })} placeholder="Ex: Centro" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Categoria Principal</label>
                                    <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold focus:ring-2 focus:ring-emerald-500/20 dark:text-white" value={profile.category || ''} onChange={e => handleProfileUpdate({ category: e.target.value })} >
                                        <option value="">Selecione...</option>
                                        <option value="Gastronomia">Gastronomia</option>
                                        <option value="Serviços">Serviços</option>
                                        <option value="Varejo">Varejo</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-zinc-800/50 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-zinc-700">
                                <div className="w-32 h-32 bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-xl overflow-hidden mb-6 border-4 border-white dark:border-zinc-700">
                                    {profile.logoUrl ? <img src={profile.logoUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-200 dark:text-zinc-700"><Store className="w-12 h-12" /></div>}
                                </div>
                                <label className="cursor-pointer bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all shadow-sm dark:text-white">
                                    <Upload className="w-4 h-4 inline mr-2" /> Upload Logo
                                    <input type="file" hidden onChange={e => handleImageUpload(e, 'logo')} />
                                </label>
                            </div>
                        </div>
                    )}
                    {currentStep === 2 && (
                         <div className="space-y-12 animate-fade-in">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2"><Settings className="text-emerald-600" /> Configurações de Operação</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                               <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-700 flex flex-col items-center text-center">
                                  <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/60 rounded-2xl flex items-center justify-center text-emerald-600 mb-4"><Clock className="w-7 h-7" /></div>
                                  <h4 className="font-black text-emerald-950 dark:text-emerald-100 mb-2 uppercase tracking-widest text-xs">Agendamento Online</h4>
                                  <button onClick={() => handleProfileUpdate({ storeConfig: { ...profile.storeConfig, schedulingEnabled: !profile.storeConfig?.schedulingEnabled } })} className={`px-8 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all ${profile.storeConfig?.schedulingEnabled ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white dark:bg-zinc-900 text-emerald-600 border border-emerald-100'}`}>
                                     {profile.storeConfig?.schedulingEnabled ? 'ATIVADO' : 'DESATIVADO'}
                                  </button>
                               </div>

                               <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-700 flex flex-col items-center text-center space-y-4">
                                  <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/60 rounded-2xl flex items-center justify-center text-indigo-600 mb-4"><BarChart className="w-7 h-7" /></div>
                                  <h4 className="font-black text-gray-900 dark:text-white mb-2 uppercase tracking-widest text-xs">Pixels de Rastreamento</h4>
                                  <div className="w-full space-y-3">
                                    <input 
                                      type="text" 
                                      placeholder="ID Google Analytics (GA4)" 
                                      className="w-full bg-gray-50 dark:bg-zinc-900 border-none rounded-xl p-3 text-xs font-bold"
                                      value={profile.storeConfig?.gaId || ''}
                                      onChange={(e) => handleProfileUpdate({ storeConfig: { ...profile.storeConfig, gaId: e.target.value } })}
                                    />
                                    <input 
                                      type="text" 
                                      placeholder="ID Meta Pixel (Facebook)" 
                                      className="w-full bg-gray-50 dark:bg-zinc-900 border-none rounded-xl p-3 text-xs font-bold"
                                      value={profile.storeConfig?.pixelId || ''}
                                      onChange={(e) => handleProfileUpdate({ storeConfig: { ...profile.storeConfig, pixelId: e.target.value } })}
                                    />
                                  </div>
                               </div>
                            </div>
                         </div>
                    )}
                    {currentStep === 3 && (
                        <div className="space-y-8 animate-fade-in">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2"><LayoutGrid className="text-emerald-600" /> Categorias</h3>
                            <div className="flex gap-2 max-w-lg">
                                <input type="text" className="flex-1 bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold focus:ring-2 focus:ring-emerald-500/20 dark:text-white" placeholder="Ex: Bolos, Doces..." value={newCatName} onChange={e => setNewCatName(e.target.value)} onKeyPress={e => e.key === 'Enter' && addCategory()} />
                                <button onClick={addCategory} className="bg-emerald-600 text-white px-6 rounded-2xl font-black text-xs uppercase tracking-widest">ADD</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               {storeCategories.map(cat => (
                                  <div key={cat.id} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 group">
                                     <span className="font-bold text-gray-900 dark:text-white uppercase text-xs tracking-widest">{cat.name}</span>
                                     <button onClick={() => deleteCategory(cat.id)} className="p-2 text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                                  </div>
                               ))}
                            </div>
                        </div>
                    )}
                    {currentStep === 4 && (
                        <div className="space-y-8 animate-fade-in">
                           <div className="flex justify-between items-center">
                              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-2"><Package className="text-emerald-600" /> Meus Itens</h3>
                              <button onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-700 flex items-center gap-2">
                                 <Plus className="w-5 h-5" /> Adicionar Item
                              </button>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                              {products.map(prod => (
                                 <div key={prod.id} className="group bg-white dark:bg-zinc-950 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden p-4 hover:shadow-xl transition-all">
                                    <div className="aspect-square rounded-2xl bg-gray-100 dark:bg-zinc-800 mb-4 overflow-hidden relative">
                                       {prod.imageUrl ? <img src={prod.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-200 dark:text-zinc-700"><ImageIcon className="w-10 h-10" /></div>}
                                       <button className="absolute top-2 right-2 p-2 bg-white text-rose-500 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                                       {prod.videoUrl && (
                                         <div className="absolute top-2 left-2 bg-white/90 p-1.5 rounded-lg shadow text-indigo-600">
                                           <Video className="w-4 h-4" />
                                         </div>
                                       )}
                                       {prod.pointsReward && prod.pointsReward > 0 && (
                                         <div className="absolute bottom-2 left-2 bg-emerald-600 text-white text-[9px] font-black px-2 py-1 rounded-lg flex items-center gap-1">
                                            <Zap className="w-3 h-3 fill-current" /> +{prod.pointsReward} PTS
                                         </div>
                                       )}
                                    </div>
                                    <div className="px-2">
                                       <div className="flex items-center gap-2 mb-2">
                                          <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full uppercase">{prod.category}</span>
                                          {prod.isLocal && <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full uppercase">Selo Local</span>}
                                       </div>
                                       <h4 className="font-black text-gray-900 dark:text-white truncate">{prod.name}</h4>
                                       <div className="flex justify-between items-end mt-1">
                                          <p className="text-emerald-600 font-black text-lg">R$ {prod.price.toFixed(2)}</p>
                                          <span className="text-[10px] font-bold text-gray-400 uppercase">Estoque: {prod.stock || 0}</span>
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                    )}
                    {currentStep === 5 && (
                        <div className="space-y-8 animate-fade-in">
                           <div className="flex justify-between items-center">
                              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-2"><Ticket className="text-emerald-600" /> Galeria de Cupons</h3>
                              <button onClick={() => { 
                                  setEditingCoupon(null); 
                                  setCouponForm({ itemId: '', code: '', title: '', discount: '', pointsReward: 50, description: '' });
                                  setIsCouponModalOpen(true); 
                                }} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-700 flex items-center gap-2">
                                 <Plus className="w-5 h-5" /> Criar Novo Cupom
                              </button>
                           </div>
                           
                           {myCoupons.length === 0 ? (
                              <div className="text-center py-20 bg-gray-50 dark:bg-zinc-800 rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-zinc-700">
                                 <Ticket className="w-16 h-16 text-gray-200 dark:text-zinc-600 mx-auto mb-4" />
                                 <p className="text-gray-400 font-black uppercase text-sm tracking-widest">Nenhum cupom ativo no momento.</p>
                              </div>
                           ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 {myCoupons.map((cData, idx) => (
                                    <div key={idx} className="bg-white dark:bg-zinc-950 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden p-6 hover:shadow-xl transition-all group relative">
                                       <div className="flex justify-between items-start mb-4">
                                          <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-lg text-lg font-black">{cData.coupon.discount}</div>
                                          <div className="flex gap-2">
                                             <button onClick={() => { setEditingCoupon(cData); setCouponForm({ ...cData.coupon, itemId: cData.ownerId }); setIsCouponModalOpen(true); }} className="p-2 text-gray-400 hover:text-indigo-600"><Edit2 className="w-4 h-4" /></button>
                                             <button onClick={() => handleDeleteCoupon(cData)} className="p-2 text-gray-400 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                                          </div>
                                       </div>
                                       <h4 className="font-black text-gray-900 dark:text-white text-xl mb-1">{cData.coupon.title}</h4>
                                       <div className="bg-gray-100 dark:bg-zinc-800 font-mono font-black py-2 text-center rounded-xl text-emerald-600 tracking-widest text-sm mb-4">
                                          {cData.coupon.code}
                                       </div>
                                       <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2">{cData.coupon.description}</p>
                                       <div className="mt-4 pt-4 border-t border-gray-50 dark:border-zinc-800 flex justify-between items-center">
                                          {/* FIX: name is now defined on the coupon metadata in state */}
                                          <span className="text-[10px] font-black text-gray-400 uppercase">Vinculado a: {cData.name}</span>
                                          <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1"><Zap className="w-3 h-3 fill-current" /> +{cData.coupon.pointsReward} PTS</span>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>
                    )}
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                    <button 
                        onClick={prevStep} 
                        className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700`}
                    >
                        <ArrowLeft className="w-4 h-4" /> Anterior
                    </button>
                    <div className="flex gap-2">
                        <span className={`w-2 h-2 rounded-full ${currentStep === 'home' ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-zinc-800'}`}></span>
                        {/* FIX: bypassed narrow comparison error by casting currentStep to allow comparison with numeric s */}
                        {[1, 2, 3, 4, 5].map(s => <span key={s} className={`w-2 h-2 rounded-full ${(currentStep as any) === s ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-zinc-800'}`}></span>)}
                    </div>
                    {currentStep !== 5 && (
                        <button 
                            onClick={nextStep}
                            className="flex items-center gap-2 bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-700 transition-all"
                        >
                            Próximo <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
             </div>
          )}
       </div>

       {/* Product Modal */}
       {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
             <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-4xl p-0 shadow-2xl overflow-hidden animate-[scale-in_0.3s_ease-out]">
                <div className="bg-emerald-900 px-10 py-8 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-3xl font-black tracking-tight leading-none">Novo Item</h3>
                        <p className="text-emerald-200 font-medium text-sm mt-1">Configure os detalhes da sua oferta.</p>
                    </div>
                    <button onClick={() => setIsProductModalOpen(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                        <X className="w-8 h-8 text-white" />
                    </button>
                </div>

                <form onSubmit={saveProduct} className="p-10 md:p-12 overflow-y-auto max-h-[75vh]">
                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-4">
                            <div className="aspect-square bg-gray-50 dark:bg-zinc-800 rounded-[2.5rem] border-4 border-dashed border-gray-100 dark:border-zinc-700 flex flex-col items-center justify-center overflow-hidden group relative hover:border-emerald-400 transition-all">
                                {productForm.imageUrl ? (
                                    <img src={productForm.imageUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-6 text-gray-300 dark:text-zinc-600">
                                        <Upload className="w-12 h-12 mx-auto mb-4" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">Upload Foto</p>
                                    </div>
                                )}
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleImageUpload(e, 'product')} />
                            </div>
                            
                            <div className="mt-8 p-6 bg-indigo-50 dark:bg-indigo-950/20 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/40 space-y-4">
                                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Gatilhos de Conversão</h4>
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Selo Produção Local</label>
                                    <button 
                                        type="button"
                                        onClick={() => setProductForm({...productForm, isLocal: !productForm.isLocal})}
                                        className={`w-12 h-6 rounded-full transition-all relative ${productForm.isLocal ? 'bg-indigo-600' : 'bg-gray-300'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${productForm.isLocal ? 'left-7' : 'left-1'}`}></div>
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-600 dark:text-gray-400 flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-amber-500" /> Pontos Clube ADS</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-white dark:bg-zinc-800 border-none rounded-xl p-3 font-bold text-sm"
                                        value={productForm.pointsReward}
                                        onChange={e => setProductForm({...productForm, pointsReward: Number(e.target.value)})}
                                        placeholder="Ex: 50"
                                    />
                                    <p className="text-[8px] font-bold text-gray-400 uppercase">O cliente ganha pontos ao comprar este item.</p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-8 space-y-6">
                            <div className="flex gap-4">
                                <input required type="text" className="flex-1 bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold focus:ring-4 focus:ring-emerald-500/10 transition-all dark:text-white" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} placeholder="Nome do Produto" />
                                <button type="button" onClick={enhanceWithAI} disabled={isEnhancing} className="px-6 bg-emerald-600 text-white rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                                    {isEnhancing ? <RefreshCw className="animate-spin w-4 h-4" /> : <Wand2 className="w-4 h-4" />} IA Sugerir
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="number" step="0.01" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold focus:ring-4 focus:ring-emerald-500/10 transition-all dark:text-white" value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} placeholder="Preço R$" />
                                <input type="number" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold focus:ring-4 focus:ring-emerald-500/10 transition-all dark:text-white" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: Number(e.target.value)})} placeholder="Estoque" />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 px-1 flex items-center gap-2"><Video className="w-3.5 h-3.5" /> Link de Vídeo (Reels, YouTube ou Vimeo)</label>
                                <input 
                                  type="url" 
                                  className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold focus:ring-4 focus:ring-emerald-500/10 transition-all dark:text-white" 
                                  value={productForm.videoUrl} 
                                  onChange={e => setProductForm({...productForm, videoUrl: e.target.value})} 
                                  placeholder="https://www.youtube.com/watch?v=... ou https://www.instagram.com/reels/..." 
                                />
                            </div>
                            <select required className="w-full bg-gray-50 dark:bg-zinc-900 border-none rounded-2xl p-5 font-bold focus:ring-4 focus:ring-emerald-500/10 transition-all dark:text-white" value={productForm.storeCategoryId} onChange={e => setProductForm({...productForm, storeCategoryId: e.target.value})}>
                                <option value="">Selecione uma categoria...</option>
                                {storeCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <textarea rows={4} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-[2rem] p-6 font-medium text-sm focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none dark:text-white" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} placeholder="Descrição persuasiva..." />
                            <button type="submit" className="w-full bg-emerald-600 text-white font-black py-6 rounded-[2rem] shadow-2xl uppercase tracking-[0.2em] text-sm hover:bg-emerald-700 transition-all">
                                SALVAR NO CATÁLOGO
                            </button>
                        </div>
                   </div>
                </form>
             </div>
          </div>
       )}

       {/* Coupon Modal */}
       {isCouponModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
             <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-2xl p-0 shadow-2xl overflow-hidden animate-[scale-in_0.3s_ease-out]">
                <div className="bg-emerald-900 px-10 py-8 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-3xl font-black tracking-tight leading-none">{editingCoupon ? 'Editar Cupom' : 'Novo Cupom'}</h3>
                        <p className="text-emerald-200 font-medium text-sm mt-1">Crie gatilhos de vendas exclusivos.</p>
                    </div>
                    <button onClick={() => setIsCouponModalOpen(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                        <X className="w-8 h-8 text-white" />
                    </button>
                </div>

                <form onSubmit={handleSaveCoupon} className="p-10 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 px-1">Código (Ex: VERÃO10)</label>
                          <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-black uppercase tracking-widest focus:ring-2 focus:ring-emerald-100 dark:text-white" value={couponForm.code} onChange={e => setCouponForm({...couponForm, code: e.target.value})} />
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 px-1">Desconto (Ex: 20% OFF)</label>
                          <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold focus:ring-2 focus:ring-emerald-100 dark:text-white" value={couponForm.discount} onChange={e => setCouponForm({...couponForm, discount: e.target.value})} />
                       </div>
                    </div>
                    
                    <div>
                       <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 px-1">Título da Oferta</label>
                       <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold focus:ring-2 focus:ring-emerald-100 dark:text-white" value={couponForm.title} onChange={e => setCouponForm({...couponForm, title: e.target.value})} placeholder="Ex: Desconto Primeira Compra" />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 px-1">Vincular ao Item (Obrigatório)</label>
                      <select 
                        required
                        className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold focus:ring-2 focus:ring-emerald-100 dark:text-white"
                        value={couponForm.itemId}
                        onChange={e => setCouponForm({...couponForm, itemId: e.target.value})}
                      >
                        <option value="">Selecione o produto/serviço...</option>
                        {myOffers.map(o => <option key={o.id} value={o.id}>Serviço: {o.title}</option>)}
                        {products.map(p => <option key={p.id} value={p.id}>Produto: {p.name}</option>)}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 px-1">Pontos de Recompensa</label>
                          <input type="number" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold focus:ring-2 focus:ring-emerald-100 dark:text-white" value={couponForm.pointsReward} onChange={e => setCouponForm({...couponForm, pointsReward: Number(e.target.value)})} />
                       </div>
                       <div className="flex items-end pb-2">
                          <p className="text-[9px] font-bold text-gray-400 leading-tight uppercase">Pontos que o cliente ganha ao usar o cupom.</p>
                       </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 px-1">Regras de Uso</label>
                        <textarea rows={2} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-medium text-sm dark:text-white resize-none" value={couponForm.description} onChange={e => setCouponForm({...couponForm, description: e.target.value})} placeholder="Ex: Válido apenas para pagamentos via PIX..." />
                    </div>

                    <button type="submit" className="w-full bg-emerald-600 text-white font-black py-5 rounded-[2rem] shadow-xl uppercase tracking-widest text-sm hover:bg-emerald-700 transition-all">
                        SALVAR CUPOM NA GALERIA
                    </button>
                </form>
             </div>
          </div>
       )}

       {/* QR Code Modal */}
       {isQrModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-sm p-10 text-center shadow-2xl relative animate-[scale-in_0.3s_ease-out]">
                <button onClick={() => setIsQrModalOpen(false)} className="absolute top-6 right-6 text-gray-400"><X className="w-6 h-6" /></button>
                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-3xl mb-6">
                    <QrCode className="w-full h-auto text-emerald-600" />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 uppercase">QR Code da Loja</h3>
                <p className="text-sm text-gray-500 mb-8">Imprima e coloque no seu balcão para os clientes acessarem seu catálogo digital.</p>
                <button className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]">
                    <Download className="w-4 h-4" /> Baixar Imagem
                </button>
            </div>
         </div>
       )}
    </div>
  );
};

const StorePreview = ({ onBack, profile, products, storeCategories }: any) => (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4 px-4 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
            <button onClick={onBack} className="flex items-center gap-2 bg-emerald-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-800 transition-all"><ArrowLeft className="w-4 h-4" /> Voltar ao Editor</button>
        </div>
        
        <div className="bg-white dark:bg-zinc-950 rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-zinc-800">
            <div className="h-48 bg-gradient-to-r from-emerald-900 to-indigo-900 relative">
                <div className="absolute -bottom-12 left-12 w-24 h-24 rounded-[1.5rem] bg-white dark:bg-zinc-900 p-1 shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
                    <img src={profile.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.businessName}`} className="w-full h-full object-cover rounded-xl" />
                </div>
            </div>
            <div className="pt-16 px-12 pb-12">
                <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2 leading-tight tracking-tight">{profile.businessName || 'Minha Loja'}</h2>
                <div className="space-y-12 mt-12">
                    {storeCategories.map((cat: any) => (
                        <div key={cat.id}>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-3"><span className="w-1.5 h-6 bg-emerald-600 rounded-full"></span> {cat.name}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {products.filter((p: any) => p.storeCategoryId === cat.id).map((prod: any) => (
                                    <div key={prod.id} className="bg-gray-50 dark:bg-zinc-900 rounded-[2rem] p-4 border border-gray-100 dark:border-zinc-800 group transition-all">
                                        <div className="aspect-square bg-white dark:bg-zinc-800 rounded-2xl mb-4 overflow-hidden relative">
                                            <img src={prod.imageUrl} className="w-full h-full object-cover" />
                                            {prod.isLocal && <span className="absolute top-2 left-2 bg-indigo-600 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase">Local</span>}
                                            {prod.pointsReward && (
                                                <div className="absolute bottom-2 left-2 bg-emerald-600 text-white text-[8px] font-black px-2 py-1 rounded-full flex items-center gap-1"><Zap className="w-2.5 h-2.5 fill-current" /> +{prod.pointsReward}</div>
                                            )}
                                        </div>
                                        <div className="px-1">
                                            <h4 className="font-black text-gray-900 dark:text-white text-sm truncate">{prod.name}</h4>
                                            <p className="text-emerald-600 font-black mt-1">R$ {prod.price.toFixed(2)}</p>
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
