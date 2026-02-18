
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { Product, Profile, StoreCategory, Coupon, Offer } from '../types';
import { 
  Store, Settings, LayoutGrid, Package, CheckCircle, 
  Plus, Trash2, Edit2, 
  Image as ImageIcon, Eye,
  X, RefreshCw, Save, Camera, Home as HomeIcon,
  Tag, Phone, MapPin, CreditCard, ChevronRight, Video, Play, Youtube, Ticket, AlertCircle, Zap, Instagram, Globe, MessageCircle
} from 'lucide-react';
import { SectionLanding } from '../components/SectionLanding';
import { Link } from 'react-router-dom';

export const MyCatalog: React.FC = () => {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'home' | 'identity' | 'ops' | 'cats' | 'products' | 'coupons'>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [storeCategories, setStoreCategories] = useState<StoreCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [myOffers, setMyOffers] = useState<Offer[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  
  const [newCatName, setNewCatName] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  
  const [productForm, setProductForm] = useState<Partial<Product>>({ 
    name: '', description: '', price: 0, category: 'Geral', available: true, imageUrl: '', videoUrl: ''
  });

  const [couponForm, setCouponForm] = useState({
    offerId: '',
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
        const [prof, cats, prods, offers] = await Promise.all([
            mockBackend.getProfile(user.id),
            mockBackend.getStoreCategories(user.id),
            mockBackend.getProducts(user.id),
            mockBackend.getMyOffers(user.id)
        ]);
        setProfile(prof || { userId: user.id, socialLinks: {} } as any);
        setStoreCategories(cats);
        setProducts(prods || []);
        setMyOffers(offers || []);
        
        const allCoupons: Coupon[] = [];
        offers.forEach(o => { if(o.coupons) allCoupons.push(...o.coupons); });
        setCoupons(allCoupons);
    } finally { setIsLoading(false); }
  };

  const handleProfileSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await mockBackend.updateProfile(user.id, profile);
      alert('Perfil do catálogo atualizado!');
    } finally { setIsSaving(false); }
  };

  const handleAddCategory = async () => {
    if (!user || !newCatName.trim()) return;
    const newCat = await mockBackend.createStoreCategory(user.id, newCatName.trim());
    setStoreCategories([...storeCategories, newCat]);
    setNewCatName('');
  };

  const handleDeleteCategory = async (id: string) => {
    if (!user || !window.confirm('Excluir esta categoria?')) return;
    await mockBackend.deleteStoreCategory(id, user.id);
    setStoreCategories(storeCategories.filter(c => c.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'coverUrl' | 'productUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === 'logoUrl') setProfile(prev => ({ ...prev, logoUrl: reader.result as string }));
        else if (field === 'coverUrl') setProfile(prev => ({ ...prev, storeConfig: { ...prev.storeConfig, coverUrl: reader.result as string } }));
        else if (field === 'productUrl') setProductForm(prev => ({ ...prev, imageUrl: reader.result as string }));
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

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !couponForm.offerId) return;
    setIsSaving(true);
    try {
        const payload = {
            code: couponForm.code.toUpperCase(),
            title: couponForm.title,
            discount: couponForm.discount,
            pointsReward: Number(couponForm.pointsReward),
            description: couponForm.description
        };
        if (editingCoupon) {
            await mockBackend.updateCoupon(user.id, couponForm.offerId, editingCoupon.id, payload);
        } else {
            await mockBackend.addCoupon(user.id, couponForm.offerId, payload);
        }
        setIsCouponModalOpen(false);
        loadData();
    } finally { setIsSaving(false); }
  };

  const handleEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm(prod);
    setIsProductModalOpen(true);
  };

  const handleEditCoupon = (coupon: Coupon, offerId: string) => {
      setEditingCoupon(coupon);
      setCouponForm({
          offerId,
          code: coupon.code,
          title: coupon.title,
          discount: coupon.discount,
          pointsReward: coupon.pointsReward,
          description: coupon.description
      });
      setIsCouponModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Deseja realmente excluir este produto?')) return;
    await mockBackend.deleteBlogPost(id); 
    loadData();
  };

  const handleDeleteCoupon = async (couponId: string, offerId: string) => {
    if (!user || !window.confirm('Tem certeza que deseja excluir este cupom?')) return;
    await mockBackend.deleteCoupon(user.id, offerId, couponId);
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
              <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter leading-none">
                CATÁLOGO & LOJA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#9333EA] to-pink-500 font-black">PRO</span>
              </h2>
              <p className="text-slate-400 text-xs font-bold tracking-[0.1em] mt-2">Venda 24h por dia no seu WhatsApp.</p>
            </div>
          </div>
          {/* Change: target="_blank" removed to keep in same window, directed to user store */}
          <Link to={`/store/${user?.id}`} className="bg-[#F67C01] text-white px-12 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
            <Eye className="w-5 h-5" /> VER VITRINE
          </Link>
        </div>

        {/* Change: gap-0.5 and px-4 for closer tabs */}
        <div className="bg-white/5 rounded-[2.5rem] p-1 mt-10 flex gap-0.5 overflow-x-auto scrollbar-hide border border-white/5">
          {[
            { id: 'home', label: 'Início', desc: 'Boas-vindas', icon: HomeIcon },
            { id: 'identity', label: 'Identidade', desc: 'Marca e logo', icon: Store },
            { id: 'ops', label: 'Operação', desc: 'Configurações', icon: Settings },
            { id: 'cats', label: 'Categorias', desc: 'Organização', icon: LayoutGrid },
            { id: 'products', label: 'Produtos', desc: 'Gerenciar itens', icon: Package },
            { id: 'coupons', label: 'Cupons', desc: 'Ofertas/Promo', icon: Ticket },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-3 px-6 py-3.5 rounded-[1.8rem] transition-all min-w-[150px] ${activeSubTab === tab.id ? 'bg-[#F67C01] text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}
            >
              <tab.icon className={`w-4 h-4 ${activeSubTab === tab.id ? 'text-white' : 'text-[#F67C01]'}`} />
              <div className="text-left">
                <p className="font-black text-[10px] tracking-widest uppercase italic leading-none mb-1">{tab.label}</p>
                <p className={`text-[8px] font-medium opacity-50 ${activeSubTab === tab.id ? 'text-white' : ''}`}>{tab.desc}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <div className="pt-4 px-2">
        {activeSubTab === 'home' ? (
          <SectionLanding 
            title="Sua vitrine digital que vende 24h por dia."
            subtitle="Catálogo & Loja Online"
            description="Organize seus produtos e serviços em uma vitrine profissional de alta conversão. Receba pedidos direto no seu WhatsApp sem pagar comissões."
            benefits={["Cadastro ilimitado de produtos", "Pedidos direto no WhatsApp", "Gestão simplificada", "Checkout rápido"]}
            youtubeId="dQw4w9WgXcQ"
            ctaLabel="CADASTRAR PRODUTOS"
            onStart={() => setActiveSubTab('identity')}
            icon={Package}
          />
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 md:p-16 border border-gray-100 dark:border-zinc-800 shadow-xl min-h-[500px] animate-fade-in">
             
             {activeSubTab === 'identity' && (
                <div className="max-w-4xl mx-auto space-y-10">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white italic tracking-tight">Identidade da Loja</h3>
                      <button onClick={handleProfileSave} disabled={isSaving} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                         <Save className="w-4 h-4" /> SALVAR MARCA
                      </button>
                   </div>
                   <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Nome Fantasia</label>
                            <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={profile.businessName || ''} onChange={e => setProfile({...profile, businessName: e.target.value})} />
                         </div>
                         {/* Change: Endereço Público moved here from Ops */}
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Endereço Público</label>
                            <div className="flex gap-2 items-center bg-gray-50 dark:bg-zinc-800 rounded-2xl px-4">
                                <MapPin className="w-4 h-4 text-indigo-400" />
                                <input type="text" className="flex-1 bg-transparent border-none py-4 font-bold dark:text-white text-sm" placeholder="Rua das Flores, 123" value={profile.address || ''} onChange={e => setProfile({...profile, address: e.target.value})} />
                            </div>
                         </div>
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Bio / Slogan</label>
                            <textarea rows={3} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-medium dark:text-white resize-none" value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} />
                         </div>
                      </div>
                      <div className="space-y-6">
                         <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-zinc-800/40 rounded-[2rem] border border-dashed border-gray-200 dark:border-zinc-700">
                            <div className="w-20 h-20 rounded-2xl bg-white shadow-xl overflow-hidden mb-3 relative group cursor-pointer" onClick={() => fileInputLogoRef.current?.click()}>
                               {profile.logoUrl ? <img src={profile.logoUrl} className="w-full h-full object-cover" /> : <Camera className="w-8 h-8 text-gray-300 m-6" />}
                               <input type="file" ref={fileInputLogoRef} hidden onChange={e => handleImageUpload(e, 'logoUrl')} />
                            </div>
                            <span className="text-[10px] font-black uppercase text-slate-400">Logotipo</span>
                         </div>
                         <p className="text-[10px] font-bold text-slate-400 text-center">Logotipo Recomendado 500x500 pixel (Quadrado)</p>
                         
                         <div className="h-40 bg-gray-50 dark:bg-zinc-800/40 rounded-[2rem] border border-dashed border-gray-200 dark:border-zinc-700 relative overflow-hidden group cursor-pointer" onClick={() => fileInputCoverRef.current?.click()}>
                            {profile.storeConfig?.coverUrl ? <img src={profile.storeConfig.coverUrl} className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-gray-300"><ImageIcon className="w-10 h-10" /></div>}
                            <input type="file" ref={fileInputCoverRef} hidden onChange={e => handleImageUpload(e, 'coverUrl')} />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-center p-4">
                               <p className="text-[10px] font-black uppercase tracking-widest">Alterar imagem de capa</p>
                            </div>
                         </div>
                         <p className="text-[10px] font-bold text-slate-400 text-center">Imagem de Capa da Loja Recomendado 1200x400 pixel</p>
                      </div>
                   </div>
                </div>
             )}

             {activeSubTab === 'ops' && (
                <div className="max-w-4xl mx-auto space-y-12">
                   <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white italic tracking-tight">Configurações Operacionais</h3>
                      <button onClick={handleProfileSave} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">SALVAR OPS</button>
                   </div>
                   <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-8">
                         <div className="flex gap-4 items-start">
                            <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Phone className="w-5 h-5" /></div>
                            <div className="flex-1">
                               <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">WhatsApp de Pedidos</label>
                               <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-xl p-3 font-bold dark:text-white" value={profile.phone || ''} onChange={e => setProfile({...profile, phone: e.target.value})} placeholder="5511999999999" />
                            </div>
                         </div>
                         <div className="flex gap-4 items-start">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CreditCard className="w-5 h-5" /></div>
                            <div className="flex-1">
                               <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Métodos Aceitos</label>
                               <div className="flex flex-wrap gap-2">
                                  {['PIX', 'CARTÃO', 'DINHEIRO', 'CRÉDITO'].map(m => (
                                     <label key={m} className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-800 px-4 py-2 rounded-xl border border-gray-100 dark:border-zinc-700 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 rounded text-emerald-600" defaultChecked />
                                        <span className="text-[10px] font-black">{m}</span>
                                     </label>
                                  ))}
                               </div>
                            </div>
                         </div>
                         <div className="flex gap-4 items-start">
                            <div className="p-3 bg-red-50 text-red-600 rounded-xl"><Play className="w-5 h-5" /></div>
                            <div className="flex-1">
                               <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Vídeo da Loja (YouTube/Instagram)</label>
                               <input type="url" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-xl p-3 font-bold dark:text-white" value={profile.storeConfig?.videoUrl || ''} onChange={e => setProfile({...profile, storeConfig: { ...profile.storeConfig, videoUrl: e.target.value }})} placeholder="https://..." />
                            </div>
                         </div>
                      </div>
                      <div className="space-y-8">
                         {/* Change: Social Media Section added here */}
                         <div className="p-6 bg-gray-50/50 dark:bg-zinc-800/40 rounded-[2.5rem] border border-gray-100 dark:border-zinc-700 space-y-6">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest italic">Redes Sociais da Vitrine</h4>
                            
                            <div className="flex gap-4 items-center">
                               <div className="p-2.5 bg-pink-50 text-pink-600 rounded-xl"><Instagram className="w-4 h-4" /></div>
                               <input type="text" className="flex-1 bg-white dark:bg-zinc-900 border-none rounded-xl p-2.5 text-xs font-bold dark:text-white" placeholder="usuário_instagram" value={profile.socialLinks?.instagram || ''} onChange={e => setProfile({...profile, socialLinks: {...profile.socialLinks, instagram: e.target.value}})} />
                            </div>
                            
                            <div className="flex gap-4 items-center">
                               <div className="p-2.5 bg-green-50 text-green-600 rounded-xl"><MessageCircle className="w-4 h-4" /></div>
                               <input type="text" className="flex-1 bg-white dark:bg-zinc-900 border-none rounded-xl p-2.5 text-xs font-bold dark:text-white" placeholder="5511999999999 (WhatsApp)" value={profile.socialLinks?.whatsapp || ''} onChange={e => setProfile({...profile, socialLinks: {...profile.socialLinks, whatsapp: e.target.value}})} />
                            </div>
                            
                            <div className="flex gap-4 items-center">
                               <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Globe className="w-4 h-4" /></div>
                               <input type="url" className="flex-1 bg-white dark:bg-zinc-900 border-none rounded-xl p-2.5 text-xs font-bold dark:text-white" placeholder="https://seusite.com" value={profile.socialLinks?.website || ''} onChange={e => setProfile({...profile, socialLinks: {...profile.socialLinks, website: e.target.value}})} />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {activeSubTab === 'cats' && (
                <div className="max-w-xl mx-auto space-y-8">
                   <h3 className="text-2xl font-black text-gray-900 dark:text-white italic tracking-tight">Categorias do Catálogo</h3>
                   <div className="flex gap-2">
                      <input type="text" className="flex-1 bg-gray-50 dark:bg-zinc-800 p-4 rounded-xl font-bold dark:text-white border-2 border-transparent focus:border-brand-primary" value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Ex: Bebidas, Doces, Consultoria..." />
                      <button onClick={handleAddCategory} className="bg-[#F67C01] text-white px-8 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">Adicionar</button>
                   </div>
                   <div className="space-y-3">
                      {storeCategories.map(c => (
                         <div key={c.id} className="p-5 bg-gray-50 dark:bg-zinc-800 rounded-2xl flex justify-between items-center border border-gray-100 dark:border-zinc-700">
                            <div className="flex items-center gap-4">
                               <Tag className="w-4 h-4 text-indigo-400" />
                               <span className="font-bold dark:text-white">{c.name}</span>
                            </div>
                            <button onClick={() => handleDeleteCategory(c.id)} className="p-2 text-rose-300 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                         </div>
                      ))}
                      {storeCategories.length === 0 && <div className="text-center py-20 text-slate-300 font-bold uppercase text-[10px]">Crie sua primeira categoria acima para organizar seu catálogo.</div>}
                   </div>
                </div>
             )}

             {activeSubTab === 'products' && (
                <div className="space-y-10">
                   <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                      <div>
                         <h3 className="text-2xl font-black text-gray-900 dark:text-white italic tracking-tight">Meus Produtos & Serviços</h3>
                         <p className="text-slate-400 font-bold text-[10px] tracking-widest uppercase">{products.length} itens cadastrados no total</p>
                      </div>
                      <button onClick={() => { setEditingProduct(null); setProductForm({ name: '', description: '', price: 0, category: 'Geral', available: true, imageUrl: '', videoUrl: '' }); setIsProductModalOpen(true); }} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2">
                         <Plus className="w-5 h-5" /> NOVO ITEM
                      </button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products.map(prod => (
                         <div key={prod.id} className="p-6 bg-gray-50 dark:bg-zinc-800/40 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 flex items-center gap-6 group hover:bg-white dark:hover:bg-zinc-800 hover:shadow-xl transition-all">
                            <div className="w-20 h-20 rounded-2xl bg-gray-200 overflow-hidden shadow-inner flex-shrink-0 relative">
                               <img src={prod.imageUrl} className="w-full h-full object-cover" alt={prod.name} />
                               {prod.videoUrl && (
                                   <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                       <Play className="w-6 h-6 text-white" />
                                   </div>
                               )}
                            </div>
                            <div className="flex-1">
                               <h4 className="font-black text-gray-900 dark:text-white text-base leading-tight italic line-clamp-1">{prod.name}</h4>
                               <p className="text-sm font-black text-emerald-600 mt-1">R$ {prod.price.toFixed(2)}</p>
                               <div className="flex gap-2 mt-3">
                                  <button onClick={() => handleEditProduct(prod)} className="p-2 bg-white dark:bg-zinc-900 rounded-lg text-indigo-400 shadow-sm"><Edit2 className="w-3.5 h-3.5" /></button>
                                  <button onClick={() => handleDeleteProduct(prod.id)} className="p-2 bg-white dark:bg-zinc-900 rounded-lg text-rose-400 shadow-sm"><Trash2 className="w-3.5 h-3.5" /></button>
                               </div>
                            </div>
                         </div>
                      ))}
                      {products.length === 0 && <div className="col-span-full py-32 text-center border-4 border-dashed border-gray-50 rounded-[4rem] text-slate-300 font-black uppercase text-sm tracking-widest">Sua vitrine está pronta para receber itens.</div>}
                   </div>
                </div>
             )}

             {activeSubTab === 'coupons' && (
                <div className="space-y-10">
                   <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                      <div>
                         <h3 className="text-2xl font-black text-gray-900 dark:text-white italic tracking-tighter">Cupons & Ofertas</h3>
                         <p className="text-slate-400 font-bold text-[10px] tracking-widest uppercase">Crie incentivos para seus clientes locais.</p>
                      </div>
                      <button onClick={() => { setEditingCoupon(null); setCouponForm({ offerId: '', code: '', title: '', discount: '', pointsReward: 50, description: '' }); setIsCouponModalOpen(true); }} className="bg-pink-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2">
                         <Plus className="w-5 h-5" /> NOVO CUPOM
                      </button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {coupons.length === 0 ? (
                         <div className="col-span-full py-32 text-center border-4 border-dashed border-gray-50 rounded-[4rem] text-slate-300 font-black uppercase text-sm tracking-widest">
                            Nenhum cupom ativo no momento.
                         </div>
                      ) : coupons.map(c => (
                         <div key={c.id} className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden flex flex-col hover:shadow-xl transition-all">
                            <div className="flex justify-between items-start mb-6">
                               <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center"><Ticket className="w-6 h-6" /></div>
                               <div className="flex gap-2">
                                  <button onClick={() => handleEditCoupon(c, myOffers.find(o => o.coupons?.some(cu => cu.id === c.id))?.id || '')} className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg text-indigo-400"><Edit2 className="w-4 h-4" /></button>
                                  <button onClick={() => handleDeleteCoupon(c.id, myOffers.find(o => o.coupons?.some(cu => cu.id === c.id))?.id || '')} className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg text-rose-400"><Trash2 className="w-4 h-4" /></button>
                               </div>
                            </div>
                            <h4 className="font-black text-gray-900 dark:text-white text-xl mb-1 italic leading-tight">{c.discount} OFF</h4>
                            <p className="font-bold text-gray-500 uppercase text-[10px] tracking-widest mb-4">{c.title}</p>
                            <div className="bg-gray-50 dark:bg-zinc-950 p-4 rounded-xl text-center font-mono font-black text-pink-600 text-lg border-2 border-dashed border-pink-100 dark:border-pink-900/30">
                               {c.code}
                            </div>
                            <p className="mt-6 text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                               <Zap className="w-3 h-3 fill-current" /> Ganha +{c.pointsReward} pts
                            </p>
                         </div>
                      ))}
                   </div>
                </div>
             )}

          </div>
        )}
      </div>

      {/* MODAL PRODUTO */}
      {isProductModalOpen && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-white/5 animate-scale-in">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">{editingProduct ? 'Editar Item' : 'Cadastrar Item'}</h3>
                    <button onClick={() => setIsProductModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={handleProductSubmit} className="p-10 space-y-6">
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-6">
                          <div>
                             <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1 text-left">Título do item</label>
                             <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1 text-left">Preço (R$)</label>
                                <input required type="number" step="0.01" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} />
                             </div>
                             <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1 text-left">Categoria</label>
                                <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={productForm.storeCategoryId} onChange={e => setProductForm({...productForm, storeCategoryId: e.target.value})}>
                                   <option value="">Selecione...</option>
                                   {storeCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                             </div>
                          </div>
                          <div>
                             <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1 text-left">Link de vídeo (YouTube/Instagram)</label>
                             <div className="flex gap-2 items-center bg-gray-50 dark:bg-zinc-800 rounded-2xl px-4">
                                <Video className="w-4 h-4 text-gray-400" />
                                <input type="url" className="flex-1 bg-transparent border-none py-4 font-bold dark:text-white text-sm" placeholder="Opcional" value={productForm.videoUrl} onChange={e => setProductForm({...productForm, videoUrl: e.target.value})} />
                             </div>
                          </div>
                       </div>
                       <div className="space-y-6">
                          <div className="aspect-square bg-gray-50 dark:bg-zinc-800/40 rounded-[2rem] border border-dashed border-gray-200 dark:border-zinc-700 relative overflow-hidden group cursor-pointer" onClick={() => fileInputProductRef.current?.click()}>
                             {productForm.imageUrl ? <img src={productForm.imageUrl} className="w-full h-full object-cover" /> : <div className="h-full flex flex-col items-center justify-center text-gray-300"><Camera className="w-8 h-8 mb-2" /><span className="text-[10px] font-black uppercase tracking-widest">Foto do item</span></div>}
                             <input type="file" ref={fileInputProductRef} hidden onChange={e => handleImageUpload(e, 'productUrl')} />
                          </div>
                       </div>
                       <div className="md:col-span-2">
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1 text-left">Descrição detalhada</label>
                          <textarea rows={3} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 text-sm font-medium dark:text-white resize-none" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
                       </div>
                    </div>
                    <button type="submit" disabled={isSaving} className="w-full bg-[#F67C01] text-white font-black py-5 rounded-[2rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-orange-600 transition-all">
                       {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'PUBLICAR NO CATÁLOGO'}
                    </button>
                </form>
            </div>
         </div>
      )}

      {/* MODAL CUPOM */}
      {isCouponModalOpen && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-white/5 animate-scale-in">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">{editingCoupon ? 'Editar Cupom' : 'Novo Cupom'}</h3>
                    <button onClick={() => setIsCouponModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={handleCouponSubmit} className="p-10 space-y-6">
                   {myOffers.length === 0 ? (
                      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg flex gap-2">
                         <AlertCircle className="w-5 h-5 shrink-0" />
                         <p className="text-sm text-left">Você precisa cadastrar um produto/serviço antes para vincular o cupom.</p>
                      </div>
                   ) : (
                      <>
                         <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 text-left">Vincular a item</label>
                            <select required className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={couponForm.offerId} onChange={e => setCouponForm({...couponForm, offerId: e.target.value})}>
                               <option value="">Selecione...</option>
                               {myOffers.map(o => <option key={o.id} value={o.id}>{o.title}</option>)}
                            </select>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 text-left">Código (Ex: VEM10)</label>
                               <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white uppercase" value={couponForm.code} onChange={e => setCouponForm({...couponForm, code: e.target.value})} />
                            </div>
                            <div>
                               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 text-left">Desconto (Ex: 20%)</label>
                               <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={couponForm.discount} onChange={e => setCouponForm({...couponForm, discount: e.target.value})} />
                            </div>
                         </div>
                         <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 text-left">Título da oferta</label>
                            <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={couponForm.title} onChange={e => setCouponForm({...couponForm, title: e.target.value})} />
                         </div>
                         <div className="bg-pink-50 dark:bg-pink-950/20 p-4 rounded-xl border border-pink-100 dark:border-pink-900/30">
                            <label className="block text-[10px] font-black text-pink-600 dark:text-pink-400 uppercase tracking-widest mb-2 text-left">Recompensa ADS</label>
                            <div className="flex items-center gap-3">
                               <Zap className="w-4 h-4 text-yellow-500 fill-current" />
                               <input type="number" className="w-20 bg-white dark:bg-zinc-900 border-none rounded-lg p-2 font-bold dark:text-white" value={couponForm.pointsReward} onChange={e => setCouponForm({...couponForm, pointsReward: Number(e.target.value)})} />
                               <span className="text-xs font-bold text-pink-700 dark:text-pink-300 uppercase">Pontos no Clube</span>
                            </div>
                         </div>
                         <button type="submit" disabled={isSaving} className="w-full bg-pink-600 text-white font-black py-5 rounded-[2rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-pink-700 transition-all">
                            {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'ATIVAR CUPOM'}
                         </button>
                      </>
                   )}
                </form>
            </div>
         </div>
      )}
    </div>
  );
};
