
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockBackend } from '../services/mockBackend';
import { Product, Profile, StoreCategory, Coupon } from '../types';
import { 
  MapPin, Clock, CreditCard, MessageCircle, Instagram, Globe, 
  Search, ShoppingCart, Star, Share2, ArrowLeft, Image as ImageIcon,
  CheckCircle, Store, X, Phone, Plus, Zap, Ticket, Play, Minus,
  Trash2, AlertTriangle, ExternalLink
} from 'lucide-react';

interface CartItem extends Product {
  quantity: number;
}

export const StoreView: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [activeCat, setActiveCat] = useState<string>('todos');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null);
  
  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    if (userId) loadStoreData();
  }, [userId]);

  const loadStoreData = async () => {
    if (!userId) return;
    try {
      const prof = await mockBackend.getProfile(userId);
      const prods = await mockBackend.getProducts(userId);
      const cats = await mockBackend.getStoreCategories(userId);
      const myOffers = await mockBackend.getMyOffers(userId);
      
      const allCoupons: Coupon[] = [];
      myOffers.forEach(o => { if(o.coupons) allCoupons.push(...o.coupons); });
      
      setProfile(prof || null);
      setProducts(prods);
      setCategories(cats);
      setCoupons(allCoupons);
      
      if (prof?.storeConfig?.gaId) console.log(`[GA Tracking] view_shop: ${prof.businessName}`);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    if (product.stock !== undefined && product.stock <= 0) return;
    
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    if (profile?.storeConfig?.gaId) console.log(`[GA Tracking] add_to_cart: ${product.name}`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        if (delta > 0 && item.stock !== undefined && newQty > item.stock) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.promoPrice || item.price) * item.quantity, 0);
  }, [cart]);

  const discountValue = useMemo(() => {
    if (!activeCoupon) return 0;
    if (activeCoupon.discount.includes('%')) {
        const percentage = parseFloat(activeCoupon.discount.replace('%', ''));
        return (subtotal * percentage) / 100;
    }
    return parseFloat(activeCoupon.discount.replace(/[^0-9.]/g, '')) || 0;
  }, [activeCoupon, subtotal]);

  const total = Math.max(0, subtotal - discountValue);

  const applyCoupon = () => {
    const found = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
    if (found) {
        setActiveCoupon(found);
        alert(`Cupom "${found.title}" aplicado!`);
    } else {
        alert("Cupom inválido ou expirado.");
        setActiveCoupon(null);
    }
  };

  const handleCheckoutWhatsApp = () => {
      const phone = profile?.phone?.replace(/\D/g, '') || profile?.socialLinks?.whatsapp?.replace(/\D/g, '') || '';
      if (!phone) {
          alert("Esta loja não configurou um telefone de contato.");
          return;
      }
      
      let message = `🛒 *NOVO PEDIDO - ${profile?.businessName?.toUpperCase()}*\n`;
      message += `--------------------------------\n\n`;
      
      cart.forEach(item => {
        message += `✅ *${item.quantity}x* ${item.name} - R$ ${((item.promoPrice || item.price) * item.quantity).toFixed(2)}\n`;
      });
      
      message += `\n--------------------------------\n`;
      message += `💰 *Subtotal:* R$ ${subtotal.toFixed(2)}\n`;
      if (activeCoupon) {
        message += `🎫 *Cupom:* ${activeCoupon.code} (-R$ ${discountValue.toFixed(2)})\n`;
      }
      message += `⭐ *TOTAL: R$ ${total.toFixed(2)}*\n\n`;
      message += `📍 *Endereço de Entrega:* [Por favor, informe aqui]\n`;
      message += `💳 *Forma de Pagamento:* [Dinheiro / Pix / Cartão]\n\n`;
      message += `_Enviado via Menu de Negócios_`;

      if (profile?.storeConfig?.pixelId) console.log(`[Meta Pixel Tracking] initiate_checkout: Total R$ ${total.toFixed(2)}`);

      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const id = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
        return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('vimeo.com')) {
        const id = url.split('/').pop();
        return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    if (url.includes('instagram.com/reel')) {
        return `${url.split('?')[0]}embed`;
    }
    return url;
  };

  const filteredProducts = activeCat === 'todos' 
      ? products 
      : products.filter(p => p.storeCategoryId === activeCat);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando loja...</div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center">Loja não encontrada.</div>;

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-32">
        
        {/* 1. Header Fixo com Desfoque Premium */}
        <header className="fixed top-0 z-[100] w-full transition-all duration-300 bg-white/95 backdrop-blur-xl border-b border-gray-100/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/stores" className="p-3 rounded-2xl hover:bg-gray-100 text-gray-700 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-100 hidden sm:block">
                        <img src={profile.logoUrl} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-black text-xl text-gray-900 truncate max-w-[150px] sm:max-w-[300px] uppercase tracking-tighter italic">
                        <span className="text-emerald-600">{profile.businessName?.split(' ')[0]}</span> {profile.businessName?.split(' ').slice(1).join(' ')}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setIsCartOpen(true)}
                        className="p-4 bg-emerald-600 text-white rounded-2xl hover:scale-105 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center gap-3"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {cart.length > 0 && <span className="bg-white text-emerald-600 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm">{cart.reduce((a,b) => a + b.quantity, 0)}</span>}
                    </button>
                </div>
            </div>
        </header>

        {/* 2. Immersive Hero */}
        <div className="relative h-[55vh] min-h-[400px] lg:h-[60vh] w-full overflow-hidden">
            {profile.storeConfig?.coverUrl ? (
                <img src={profile.storeConfig.coverUrl} className="w-full h-full object-cover animate-fade-in" alt="Cover" />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-800 flex items-center justify-center">
                    <Store className="w-32 h-32 text-white/5" />
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center animate-[fade-in_1s_ease-out]">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2.5rem] bg-white p-1.5 shadow-2xl mb-6 overflow-hidden border-[6px] border-white/10 backdrop-blur-md transform hover:rotate-2 transition-transform duration-700">
                    <img src={profile.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.businessName}`} className="w-full h-full object-cover rounded-[2rem]" alt="Logo" />
                </div>
                <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic mb-8 leading-tight drop-shadow-2xl">{profile.businessName}</h1>
                
                {/* Change: Localização e Vídeo agora ficam ao lado do 'Aberto Agora' */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <span className="flex items-center gap-2 bg-emerald-600/80 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest shadow-lg">
                        <CheckCircle className="w-4 h-4" /> Aberto Agora
                    </span>

                    <span className="flex items-center gap-2 bg-indigo-600/80 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest shadow-lg">
                        <MapPin className="w-4 h-4" /> {profile.city || 'São Paulo'}
                    </span>

                    {profile.storeConfig?.videoUrl && (
                        <button 
                            onClick={() => setVideoModalUrl(profile.storeConfig?.videoUrl || null)}
                            className="flex items-center gap-2 bg-brand-primary/90 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-transform group"
                        >
                            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-brand-primary transition-colors">
                                <Play className="w-2 h-2 fill-current" />
                            </div>
                            Assista Nosso Vídeo
                        </button>
                    )}
                </div>
            </div>
        </div>

        <main className="max-w-7xl mx-auto px-6 -mt-12 relative z-20 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* SIDEBAR */}
                <div className="lg:col-span-4 xl:col-span-3 space-y-8">
                    {/* Cupons da Loja */}
                    {coupons.length > 0 && (
                        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 shadow-2xl shadow-gray-200/50 border border-gray-100 dark:border-zinc-800 space-y-8 relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2"><Ticket className="w-4 h-4 text-emerald-500" /> Ofertas do Momento</h3>
                            </div>
                            <div className="space-y-6">
                                {coupons.map(c => (
                                    <div key={c.id} className="bg-emerald-50/50 dark:bg-emerald-950/20 border-2 border-dashed border-emerald-200 dark:border-emerald-800/50 p-6 rounded-[2.2rem] text-center transition-all hover:bg-emerald-50">
                                        <p className="text-4xl font-black text-emerald-600 mb-1">{c.discount}</p>
                                        <p className="text-[10px] font-black text-emerald-700/60 uppercase tracking-widest mb-4">{c.title}</p>
                                        <div className="bg-white dark:bg-zinc-800 text-emerald-600 border border-emerald-100 dark:border-emerald-900 font-mono font-black text-xs py-3 rounded-2xl select-all shadow-sm tracking-[0.2em]">
                                            {c.code}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Informações da Loja */}
                    <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 shadow-2xl shadow-gray-200/50 border border-gray-100 dark:border-zinc-800 space-y-10">
                        <div className="space-y-4">
                           <h3 className="font-black text-gray-900 dark:text-white text-xl uppercase tracking-tighter italic">Sobre a Marca</h3>
                           <p className="text-gray-500 dark:text-zinc-400 text-sm leading-relaxed font-medium">
                              {profile.bio || 'Bem-vindo à nossa loja! Confira nosso cardápio e catálogo completo abaixo.'}
                           </p>
                        </div>
                        
                        <div className="space-y-8">
                            {profile.address && (
                                <div className="flex gap-5 items-start">
                                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-[1.4rem] text-indigo-600 dark:text-brand-primary"><MapPin className="w-5 h-5" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Localização</p>
                                        <p className="text-sm font-bold text-gray-800 dark:text-zinc-200 leading-tight">{profile.address}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex gap-5 items-start">
                                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-[1.4rem] text-emerald-600 dark:text-emerald-400"><CreditCard className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Formas de Pagamento</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-[9px] bg-gray-50 dark:bg-zinc-800 text-slate-500 px-3 py-1.5 rounded-lg font-black uppercase tracking-widest border border-gray-100 dark:border-zinc-700">PIX</span>
                                        <span className="text-[9px] bg-gray-50 dark:bg-zinc-800 text-slate-500 px-3 py-1.5 rounded-lg font-black uppercase tracking-widest border border-gray-100 dark:border-zinc-700">CARTÃO</span>
                                        <span className="text-[9px] bg-gray-50 dark:bg-zinc-800 text-slate-500 px-3 py-1.5 rounded-lg font-black uppercase tracking-widest border border-gray-100 dark:border-zinc-700">DINHEIRO</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-3 pt-10 border-t border-gray-100 dark:border-zinc-800">
                            {profile.socialLinks?.instagram && (
                                <a href={`https://instagram.com/${profile.socialLinks.instagram}`} target="_blank" className="aspect-square bg-gray-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-pink-50 hover:text-pink-600 transition-all"><Instagram className="w-5 h-5" /></a>
                            )}
                            {profile.socialLinks?.whatsapp && (
                                <a href={`https://wa.me/${profile.socialLinks.whatsapp}`} target="_blank" className="aspect-square bg-gray-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-green-50 hover:text-green-600 transition-all"><MessageCircle className="w-5 h-5" /></a>
                            )}
                            {profile.socialLinks?.website && (
                                <a href={profile.socialLinks.website} target="_blank" className="aspect-square bg-gray-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all"><Globe className="w-5 h-5" /></a>
                            )}
                            <button className="aspect-square bg-gray-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all"><Share2 className="w-5 h-5" /></button>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="lg:col-span-8 xl:col-span-9 space-y-12">
                    
                    {/* Barra de Categorias Simplificada */}
                    <div className="sticky top-20 z-30 bg-gray-50/95 dark:bg-black/90 backdrop-blur-xl py-8 -mx-6 px-6 sm:mx-0 sm:px-0 mb-4">
                        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 justify-center items-center">
                            
                            <button 
                                onClick={() => setActiveCat('todos')}
                                className={`px-10 py-4 rounded-[2rem] text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all shadow-lg ${activeCat === 'todos' ? 'bg-[#F67C01] text-white scale-105' : 'bg-white dark:bg-zinc-900 text-slate-400 border border-gray-100 dark:border-zinc-800 hover:bg-gray-50'}`}
                            >
                                🔥 Todos os Itens
                            </button>

                            <div className="w-px h-8 bg-gray-200 dark:bg-zinc-800 self-center mx-4 hidden sm:block"></div>

                            {categories.map(cat => (
                                <button 
                                    key={cat.id}
                                    onClick={() => setActiveCat(cat.id)}
                                    className={`px-10 py-4 rounded-[2rem] text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all shadow-lg ${activeCat === cat.id ? 'bg-[#F67C01] text-white scale-105' : 'bg-white dark:bg-zinc-900 text-slate-400 border border-gray-100 dark:border-zinc-800 hover:bg-gray-50'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredProducts.map(prod => (
                            <div 
                                key={prod.id} 
                                className="group bg-white dark:bg-zinc-900 rounded-[3rem] p-5 pb-10 shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-2xl hover:-translate-y-3 transition-all duration-700 flex flex-col"
                            >
                                <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-gray-50 dark:bg-zinc-800 relative mb-8 group">
                                    {prod.imageUrl ? (
                                        <img src={prod.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={prod.name} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-200"><ImageIcon className="w-12 h-12" /></div>
                                    )}
                                    
                                    <div className="absolute top-5 left-5 right-5 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="flex flex-col gap-2">
                                            {prod.promoPrice && <span className="bg-rose-600 text-white text-[9px] font-black px-4 py-1.5 rounded-xl shadow-xl uppercase tracking-widest">OFERTA</span>}
                                        </div>
                                        {prod.videoUrl && (
                                            <button 
                                                onClick={() => setVideoModalUrl(prod.videoUrl || null)}
                                                className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-2xl text-emerald-600 hover:scale-110 transition-transform"
                                            >
                                                <Play className="w-5 h-5 fill-current" />
                                            </button>
                                        )}
                                    </div>

                                    {prod.stock !== undefined && prod.stock <= 0 && (
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                                            <div className="bg-rose-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl">ESGOTADO</div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="px-4 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-black text-gray-900 dark:text-white text-xl leading-tight italic uppercase tracking-tighter line-clamp-1 group-hover:text-emerald-600 transition-colors">{prod.name}</h3>
                                    </div>
                                    <p className="text-gray-50 dark:text-zinc-500 text-xs line-clamp-2 mb-10 font-medium leading-relaxed">{prod.description}</p>
                                    
                                    <div className="mt-auto flex items-end justify-between">
                                        <div className="flex flex-col">
                                            {prod.promoPrice ? (
                                                <>
                                                    <span className="text-3xl font-black text-emerald-600 leading-none">R$ {prod.promoPrice.toFixed(2)}</span>
                                                    <span className="text-[10px] text-gray-400 line-through font-bold mt-1">R$ {prod.price.toFixed(2)}</span>
                                                </>
                                            ) : (
                                                <span className="text-3xl font-black text-gray-900 dark:text-white leading-none">R$ {prod.price.toFixed(2)}</span>
                                            )}
                                        </div>
                                        
                                        <button 
                                            onClick={() => addToCart(prod)}
                                            disabled={prod.stock !== undefined && prod.stock <= 0}
                                            className="p-5 bg-emerald-600 text-white rounded-2xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-90 disabled:opacity-50"
                                        >
                                            <Plus className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-40 bg-white dark:bg-zinc-900 rounded-[4rem] border-2 border-dashed border-gray-100 dark:border-zinc-800">
                            <Store className="w-16 h-16 text-gray-100 dark:text-zinc-800 mx-auto mb-6" />
                            <p className="text-gray-400 font-black uppercase tracking-widest text-sm italic">Nenhum produto nesta categoria.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>

        {/* Global Floating Cart Button */}
        {cart.length > 0 && !isCartOpen && (
            <button 
                onClick={() => setIsCartOpen(true)}
                className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[150] bg-gray-900 text-white px-12 py-6 rounded-full font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] flex items-center gap-5 animate-bounce active:scale-95 transition-all"
            >
                <div className="relative">
                    <ShoppingCart className="w-6 h-6 text-emerald-400" />
                    <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[8px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-gray-900">
                        {cart.reduce((a,b) => a + b.quantity, 0)}
                    </span>
                </div>
                FECHAR MEU PEDIDO
                <span className="w-px h-4 bg-white/20"></span>
                <span className="text-emerald-400">R$ {total.toFixed(2)}</span>
            </button>
        )}

        {/* Cart Drawer & Modals */}
        {isCartOpen && (
             <div className="fixed inset-0 z-[200] animate-fade-in flex justify-end">
                <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setIsCartOpen(false)}></div>
                <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 h-full shadow-2xl flex flex-col animate-slide-in-right">
                    <div className="p-10 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <ShoppingCart className="w-8 h-8 text-emerald-600" />
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter dark:text-white">Meu Pedido</h3>
                        </div>
                        <button onClick={() => setIsCartOpen(false)} className="p-3 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-2xl"><X className="w-8 h-8 text-slate-300" /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                <div className="w-24 h-24 bg-gray-50 dark:bg-zinc-800 rounded-[2.5rem] flex items-center justify-center text-gray-200"><ShoppingCart className="w-10 h-10" /></div>
                                <h4 className="text-2xl font-black text-gray-300 uppercase tracking-tighter">Seu carrinho está vazio</h4>
                            </div>
                        ) : cart.map(item => (
                            <div key={item.id} className="flex gap-6 items-center group">
                                <div className="w-24 h-24 rounded-[1.8rem] overflow-hidden bg-gray-100 flex-shrink-0 shadow-inner">
                                    <img src={item.imageUrl} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <h4 className="font-black text-gray-900 dark:text-white text-base leading-tight italic">{item.name}</h4>
                                    <p className="text-sm font-black text-emerald-600">R$ {((item.promoPrice || item.price) * item.quantity).toFixed(2)}</p>
                                    <div className="flex items-center gap-4 pt-2">
                                        <div className="flex items-center bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="p-2.5 text-slate-400 hover:text-emerald-600"><Minus className="w-4 h-4" /></button>
                                            <span className="w-8 text-center text-xs font-black dark:text-white">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="p-2.5 text-slate-400 hover:text-emerald-600"><Plus className="w-4 h-4" /></button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="p-2.5 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-10 bg-gray-50 dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-800 space-y-8">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                                <span>Subtotal</span>
                                <span>R$ {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-end pt-4 border-t border-gray-200 dark:border-zinc-800">
                                <span className="font-black text-gray-900 dark:text-white uppercase text-xs tracking-widest">Valor Final</span>
                                <span className="font-black text-4xl text-emerald-600 leading-none">R$ {total.toFixed(2)}</span>
                            </div>
                        </div>
                        <button 
                            onClick={handleCheckoutWhatsApp}
                            disabled={cart.length === 0}
                            className="w-full bg-emerald-600 text-white font-black py-7 rounded-[2.2rem] shadow-2xl shadow-emerald-900/40 uppercase tracking-widest text-sm flex items-center justify-center gap-4 hover:bg-emerald-700 transition-all active:scale-95"
                        >
                            <MessageCircle className="w-6 h-6" /> FINALIZAR NO WHATSAPP
                        </button>
                    </div>
                </div>
             </div>
        )}

        {/* Video Modal Cinema */}
        {videoModalUrl && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-fade-in">
                <button onClick={() => setVideoModalUrl(null)} className="absolute top-10 right-10 text-white p-5 bg-white/10 hover:bg-white/20 rounded-full transition-all z-50"><X className="w-10 h-10" /></button>
                <div className="w-full max-w-xl aspect-[9/16] bg-black rounded-[4rem] overflow-hidden shadow-2xl relative border-[10px] border-white/10">
                    <iframe src={getEmbedUrl(videoModalUrl) || ''} className="w-full h-full" frameBorder="0" allow="autoplay; encrypted-media; fullscreen" allowFullScreen></iframe>
                </div>
            </div>
        )}
    </div>
  );
};
