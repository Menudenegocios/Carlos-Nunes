
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
      
      // Tracking: View Shop
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
    
    // Tracking: Add to Cart
    if (profile?.storeConfig?.gaId) console.log(`[GA Tracking] add_to_cart: ${product.name}`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        // Check stock if applicable
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
    // Simple logic: if includes '%', calculate percentage, else assume fixed value
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

      // Tracking: Initiate Checkout
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
    <div className="bg-gray-50 min-h-screen font-sans pb-20">
        
        {/* 1. Transparent Header */}
        <header className="fixed top-0 z-[100] w-full transition-all duration-300 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/stores" className="p-2 rounded-full hover:bg-gray-100 text-gray-700">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <span className="font-black text-lg text-gray-900 truncate max-w-[200px] uppercase tracking-tighter italic">
                    <span className="text-emerald-600">{profile.businessName?.split(' ')[0]}</span> {profile.businessName?.split(' ').slice(1).join(' ')}
                </span>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setIsCartOpen(true)}
                        className="p-3 bg-emerald-600 text-white rounded-2xl hover:scale-105 transition-all shadow-lg flex items-center gap-2"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {cart.length > 0 && <span className="bg-white text-emerald-600 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">{cart.reduce((a,b) => a + b.quantity, 0)}</span>}
                    </button>
                </div>
            </div>
        </header>

        {/* 2. Immersive Hero */}
        <div className="relative h-[50vh] min-h-[350px] lg:h-[60vh] w-full overflow-hidden">
            {profile.storeConfig?.coverUrl ? (
                <img src={profile.storeConfig.coverUrl} className="w-full h-full object-cover" alt="Cover" />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-900 via-emerald-800 to-indigo-900 flex items-center justify-center">
                    <Store className="w-24 h-24 text-white/10" />
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 w-full p-6 pb-12 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end gap-6 animate-fade-in">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2.5rem] bg-white p-1.5 shadow-2xl border-4 border-white/20 backdrop-blur-sm relative z-10 overflow-hidden transform hover:scale-105 transition-all duration-500">
                    <img 
                        src={profile.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.businessName}`} 
                        className="w-full h-full object-cover rounded-[2.2rem]" 
                        alt="Logo" 
                    />
                </div>
                <div className="text-white flex-1 mb-2">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-emerald-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">OFICIAL EMERALD</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-3 leading-none tracking-tighter">{profile.businessName}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-200">
                        <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10"><MapPin className="w-4 h-4 text-emerald-400" /> {profile.neighborhood || profile.city || 'Brasil'}</span>
                        <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10"><Star className="w-4 h-4 text-yellow-400 fill-current" /> 5.0 (Novo)</span>
                        <span className="flex items-center gap-1.5 bg-green-500/20 backdrop-blur-md px-4 py-1.5 rounded-full text-green-300 border border-green-500/30">ABERTO AGORA</span>
                    </div>
                </div>
            </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 relative z-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* SIDEBAR INFO */}
                <div className="lg:col-span-4 xl:col-span-3 space-y-6">
                    {/* Cupons da Loja */}
                    {coupons.length > 0 && (
                        <div className="bg-gradient-to-br from-emerald-900 to-indigo-950 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden border border-white/5">
                            <h3 className="font-black text-[10px] uppercase tracking-[0.2em] mb-6 flex items-center gap-2 text-emerald-400"><Ticket className="w-4 h-4" /> Ofertas Ativas</h3>
                            <div className="space-y-4">
                                {coupons.map(c => (
                                    <div key={c.id} className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-[2rem] text-center group cursor-pointer hover:bg-white/10 transition-all">
                                        <p className="text-3xl font-black text-emerald-400">{c.discount}</p>
                                        <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-3">{c.title}</p>
                                        <div className="bg-emerald-600 text-white font-mono font-black text-xs py-2 rounded-xl select-all shadow-lg tracking-[0.2em]">
                                            {c.code}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                        </div>
                    )}

                    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/20 border border-gray-100 dark:border-zinc-800 space-y-8">
                        <div>
                           <h3 className="font-black text-gray-900 dark:text-white text-lg mb-3 uppercase tracking-tight">Bio da Marca</h3>
                           <p className="text-gray-500 dark:text-zinc-400 text-sm leading-relaxed font-medium">
                              {profile.bio || 'Bem-vindo à nossa loja! Confira nosso cardápio e catálogo completo abaixo.'}
                           </p>
                        </div>
                        
                        <div className="space-y-5">
                            {profile.address && (
                                <div className="flex gap-4 items-start group">
                                    <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-gray-600 dark:text-gray-400 group-hover:bg-indigo-50 transition-colors"><MapPin className="w-5 h-5" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Localização</p>
                                        <p className="text-sm font-bold text-gray-800 dark:text-zinc-200">{profile.address}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex gap-4 items-start group">
                                <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-gray-600 dark:text-gray-400 group-hover:bg-emerald-50 transition-colors"><CreditCard className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pagamentos</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-lg font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-900">PIX</span>
                                        <span className="text-[9px] bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-lg font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-900">CARTÃO</span>
                                        <span className="text-[9px] bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-zinc-400 px-3 py-1 rounded-lg font-black uppercase tracking-widest border border-gray-100 dark:border-zinc-700">ENTREGA</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-8 border-t border-gray-100 dark:border-zinc-800">
                            {profile.socialLinks?.instagram && (
                                <a href={`https://instagram.com/${profile.socialLinks.instagram}`} target="_blank" className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl hover:bg-pink-50 hover:text-pink-600 transition-all shadow-sm"><Instagram className="w-6 h-6" /></a>
                            )}
                            {profile.socialLinks?.whatsapp && (
                                <a href={`https://wa.me/${profile.socialLinks.whatsapp}`} target="_blank" className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl hover:bg-green-50 hover:text-green-600 transition-all shadow-sm"><MessageCircle className="w-6 h-6" /></a>
                            )}
                            {profile.socialLinks?.website && (
                                <a href={profile.socialLinks.website} target="_blank" className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"><Globe className="w-6 h-6" /></a>
                            )}
                            <button className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm"><Share2 className="w-6 h-6" /></button>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="lg:col-span-8 xl:col-span-9">
                    
                    {/* Navigation Pills */}
                    <div className="sticky top-16 z-30 bg-gray-50/95 dark:bg-black/90 backdrop-blur py-6 -mx-4 px-4 sm:mx-0 sm:px-0 mb-8 border-b border-gray-200/50 dark:border-zinc-800/50">
                        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                            <button 
                                onClick={() => setActiveCat('todos')}
                                className={`px-8 py-3.5 rounded-[1.5rem] text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all shadow-sm ${activeCat === 'todos' ? 'bg-emerald-600 text-white shadow-xl' : 'bg-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 border border-gray-100 dark:border-zinc-800'}`}
                            >
                                🔥 Todos os Itens
                            </button>
                            {categories.map(cat => (
                                <button 
                                    key={cat.id}
                                    onClick={() => setActiveCat(cat.id)}
                                    className={`px-8 py-3.5 rounded-[1.5rem] text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all shadow-sm ${activeCat === cat.id ? 'bg-emerald-600 text-white shadow-xl' : 'bg-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 border border-gray-100 dark:border-zinc-800'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map(prod => (
                            <div 
                                key={prod.id} 
                                className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] p-4 pb-8 shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative flex flex-col"
                            >
                                <div className="aspect-square rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-zinc-800 relative mb-6">
                                    {prod.imageUrl ? (
                                        <img src={prod.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={prod.name} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon className="w-12 h-12" /></div>
                                    )}
                                    
                                    {/* Overlay Tags */}
                                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                        <div className="flex flex-col gap-2">
                                            {prod.promoPrice && <span className="w-fit bg-rose-600 text-white text-[9px] font-black px-3 py-1 rounded-lg shadow-lg uppercase tracking-widest">OFERTA</span>}
                                            {prod.isLocal && <span className="w-fit bg-indigo-600 text-white text-[8px] font-black px-2.5 py-1 rounded-lg border border-white/20 shadow-lg backdrop-blur-md">PRODUZIDO NO BAIRRO</span>}
                                        </div>
                                        {prod.videoUrl && (
                                            <button 
                                                onClick={() => setVideoModalUrl(prod.videoUrl || null)}
                                                className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-2xl text-emerald-600 hover:scale-110 transition-transform"
                                            >
                                                <Play className="w-4 h-4 fill-current" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Stock Badge */}
                                    {prod.stock !== undefined && prod.stock <= 0 ? (
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                                            <div className="bg-rose-600 text-white px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-2">
                                                <AlertTriangle className="w-4 h-4" /> ESGOTADO
                                            </div>
                                        </div>
                                    ) : prod.stock !== undefined && prod.stock < 5 ? (
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] bg-amber-500 text-white py-1.5 rounded-xl text-[9px] font-black text-center uppercase tracking-widest shadow-xl animate-pulse">
                                            🔥 APENAS {prod.stock} UNIDADES!
                                        </div>
                                    ) : null}
                                </div>
                                
                                <div className="px-3 flex-1 flex flex-col">
                                    <h3 
                                        className="font-black text-gray-900 dark:text-white text-xl leading-tight mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors cursor-pointer"
                                        onClick={() => setSelectedProduct(prod)}
                                    >
                                        {prod.name}
                                    </h3>
                                    <p className="text-gray-500 dark:text-zinc-500 text-xs line-clamp-2 mb-6 font-medium leading-relaxed">{prod.description}</p>
                                    
                                    <div className="mt-auto flex items-end justify-between">
                                        <div className="flex flex-col">
                                            {prod.promoPrice ? (
                                                <>
                                                    <span className="text-2xl font-black text-emerald-600">R$ {prod.promoPrice.toFixed(2)}</span>
                                                    <span className="text-[10px] text-gray-400 line-through font-bold">R$ {prod.price.toFixed(2)}</span>
                                                </>
                                            ) : (
                                                <span className="text-2xl font-black text-gray-900 dark:text-white">{prod.price > 0 ? `R$ ${prod.price.toFixed(2)}` : 'Consulte'}</span>
                                            )}
                                        </div>
                                        
                                        <button 
                                            onClick={() => addToCart(prod)}
                                            disabled={prod.stock !== undefined && prod.stock <= 0}
                                            className="p-4 bg-emerald-600 text-white rounded-2xl shadow-xl hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                                        >
                                            <Plus className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-32 bg-white dark:bg-zinc-900 rounded-[4rem] border-2 border-dashed border-gray-100 dark:border-zinc-800">
                            <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Nenhum produto nesta categoria.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>

        {/* 3. CART DRAWER (THE CHEKCOUT) */}
        {isCartOpen && (
            <div className="fixed inset-0 z-[200] animate-fade-in">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
                <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-zinc-900 shadow-[0_0_80px_-20px_rgba(0,0,0,0.5)] flex flex-col animate-slide-in-right">
                    <div className="p-8 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center"><ShoppingCart className="w-5 h-5" /></div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">Meu Carrinho</h3>
                        </div>
                        <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-full"><X className="w-8 h-8" /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800 rounded-[2rem] flex items-center justify-center text-gray-200"><ShoppingCart className="w-10 h-10" /></div>
                                <h4 className="text-xl font-black text-gray-400 uppercase tracking-tighter">Seu carrinho está vazio</h4>
                                <button onClick={() => setIsCartOpen(false)} className="text-emerald-600 font-black text-xs uppercase tracking-widest">Explorar Catálogo</button>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="flex gap-5 items-center p-2 group">
                                    <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0 shadow-sm">
                                        <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.name} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-black text-gray-900 dark:text-white text-sm line-clamp-1">{item.name}</h4>
                                        <p className="text-xs font-black text-emerald-600 mt-1">R$ {((item.promoPrice || item.price) * item.quantity).toFixed(2)}</p>
                                        <div className="flex items-center gap-3 mt-3">
                                            <div className="flex items-center bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="p-2 text-gray-400 hover:text-emerald-600"><Minus className="w-3 h-3" /></button>
                                                <span className="w-8 text-center text-xs font-black dark:text-white">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="p-2 text-gray-400 hover:text-emerald-600"><Plus className="w-3 h-3" /></button>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-300 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-8 bg-gray-50 dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-800 space-y-6">
                        {/* Coupon Area */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Tem um Cupom?</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="CÓDIGO10" 
                                    className="flex-1 bg-white dark:bg-zinc-900 border-none rounded-xl p-4 text-xs font-black uppercase tracking-widest shadow-inner dark:text-white focus:ring-2 focus:ring-emerald-100"
                                    value={couponCode}
                                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                                />
                                <button onClick={applyCoupon} className="px-6 bg-gray-900 dark:bg-zinc-800 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-emerald-600 transition-all">APLICAR</button>
                            </div>
                            {activeCoupon && (
                                <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900">
                                    <span className="text-[10px] font-black text-emerald-600 uppercase">Cupom: {activeCoupon.code}</span>
                                    <button onClick={() => setActiveCoupon(null)} className="text-emerald-600"><X className="w-4 h-4" /></button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2 pt-4">
                            <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                                <span>Subtotal</span>
                                <span>R$ {subtotal.toFixed(2)}</span>
                            </div>
                            {discountValue > 0 && (
                                <div className="flex justify-between items-center text-sm font-black text-emerald-600">
                                    <span>Desconto Cupom</span>
                                    <span>- R$ {discountValue.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-end pt-4 border-t border-gray-200 dark:border-zinc-800">
                                <span className="font-black text-gray-900 dark:text-white uppercase text-xs tracking-widest">Total do Pedido</span>
                                <span className="font-black text-3xl text-emerald-600 leading-none">R$ {total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleCheckoutWhatsApp}
                            disabled={cart.length === 0}
                            className="w-full bg-emerald-600 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-emerald-900/20 uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50"
                        >
                            <MessageCircle className="w-6 h-6" /> FINALIZAR NO WHATSAPP
                        </button>
                        <p className="text-[9px] text-center text-gray-400 font-black uppercase tracking-widest">Pedido ilimitado via WhatsApp • Sem Taxas</p>
                    </div>
                </div>
            </div>
        )}

        {/* 4. VIDEO MODAL (MODO CINEMA) */}
        {videoModalUrl && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in">
                <button onClick={() => setVideoModalUrl(null)} className="absolute top-10 right-10 text-white p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all"><X className="w-10 h-10" /></button>
                <div className="w-full max-w-lg aspect-[9/16] bg-black rounded-[3rem] overflow-hidden shadow-2xl relative border-8 border-white/10">
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

        {/* 5. Product Detail Modal */}
        {selectedProduct && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                <div className="bg-white dark:bg-zinc-900 w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden relative flex flex-col md:flex-row max-h-[90vh] animate-scale-in">
                    <button 
                        onClick={() => setSelectedProduct(null)}
                        className="absolute top-8 right-8 p-3 bg-white/50 backdrop-blur rounded-full hover:bg-gray-100 z-10"
                    >
                        <X className="w-8 h-8 text-gray-700" />
                    </button>

                    <div className="w-full md:w-1/2 bg-gray-100 dark:bg-zinc-800 relative h-[400px] md:h-auto">
                        {selectedProduct.imageUrl ? (
                            <img src={selectedProduct.imageUrl} className="w-full h-full object-cover" alt={selectedProduct.name} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon className="w-20 h-20" /></div>
                        )}
                        {selectedProduct.isLocal && (
                            <div className="absolute top-8 left-8 bg-indigo-600 text-white text-[10px] font-black px-5 py-2 rounded-xl shadow-2xl border border-white/20">
                                SELO HYPER-LOCAL: PRODUZIDO EM {profile.neighborhood?.toUpperCase() || 'ESTE BAIRRO'}
                            </div>
                        )}
                        {selectedProduct.videoUrl && (
                             <button 
                                onClick={() => setVideoModalUrl(selectedProduct.videoUrl || null)}
                                className="absolute bottom-8 right-8 bg-white text-emerald-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-2 hover:scale-105 transition-all"
                             >
                                <Play className="w-4 h-4 fill-current" /> ASSISTIR VÍDEO
                             </button>
                        )}
                    </div>

                    <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col overflow-y-auto scrollbar-hide">
                        <span className="text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-4">
                            {categories.find(c => c.id === selectedProduct.storeCategoryId)?.name || 'Geral'}
                        </span>
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-6 leading-tight tracking-tighter uppercase italic">{selectedProduct.name}</h2>
                        
                        <div className="flex items-center gap-4 mb-8">
                            {selectedProduct.promoPrice ? (
                                <>
                                    <span className="text-4xl font-black text-emerald-600">R$ {selectedProduct.promoPrice.toFixed(2)}</span>
                                    <span className="text-lg text-gray-400 line-through font-bold">R$ {selectedProduct.price.toFixed(2)}</span>
                                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-lg border border-emerald-100 uppercase">-{(100 - (selectedProduct.promoPrice / selectedProduct.price * 100)).toFixed(0)}%</span>
                                </>
                            ) : (
                                <span className="text-4xl font-black text-gray-900 dark:text-white">{selectedProduct.price > 0 ? `R$ ${selectedProduct.price.toFixed(2)}` : 'Sob Consulta'}</span>
                            )}
                        </div>

                        <div className="prose prose-sm dark:prose-invert max-w-none flex-1">
                            <p className="text-gray-500 dark:text-zinc-400 leading-relaxed mb-10 text-lg font-medium">
                                {selectedProduct.description}
                            </p>
                        </div>

                        <div className="mt-12 space-y-6">
                            {selectedProduct.stock !== undefined && (
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl">
                                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Estoque Disponível</span>
                                    <span className={`font-black text-sm ${selectedProduct.stock < 5 ? 'text-amber-500' : 'text-emerald-600'}`}>{selectedProduct.stock} unidades</span>
                                </div>
                            )}

                            {selectedProduct.pointsReward && selectedProduct.pointsReward > 0 && (
                                <div className="bg-emerald-600/5 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 p-6 rounded-[2rem] flex items-center justify-between shadow-sm">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><Zap className="w-6 h-6 fill-current" /></div>
                                        <div>
                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Clube de Fidelidade</p>
                                            <p className="text-sm font-black text-emerald-900 dark:text-emerald-200">Ganhe +{selectedProduct.pointsReward} pontos</p>
                                        </div>
                                    </div>
                                    <ArrowLeft className="w-5 h-5 text-emerald-400 rotate-180" />
                                </div>
                            )}

                            <button 
                                onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); setIsCartOpen(true); }}
                                disabled={selectedProduct.stock !== undefined && selectedProduct.stock <= 0}
                                className="w-full bg-emerald-600 text-white py-6 rounded-[2rem] font-black text-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-emerald-900/20 active:scale-95 uppercase tracking-widest disabled:opacity-50"
                            >
                                <ShoppingCart className="w-6 h-6" /> ADICIONAR AO CARRINHO
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Global Floating Cart (Mini) */}
        {cart.length > 0 && !isCartOpen && (
            <button 
                onClick={() => setIsCartOpen(true)}
                className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[150] bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] flex items-center gap-4 animate-bounce group active:scale-95"
            >
                <ShoppingCart className="w-5 h-5 text-emerald-500" />
                VER MEU PEDIDO ({cart.reduce((a,b) => a + b.quantity, 0)})
                <span className="text-emerald-500">R$ {total.toFixed(2)}</span>
            </button>
        )}
    </div>
  );
};
