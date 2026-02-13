
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockBackend } from '../services/mockBackend';
import { Product, Profile, StoreCategory } from '../types';
import { 
  MapPin, Clock, CreditCard, MessageCircle, Instagram, Globe, 
  Search, ShoppingCart, Star, Share2, ArrowLeft, Image as ImageIcon,
  CheckCircle, Store, X, Phone, Plus
} from 'lucide-react';

export const StoreView: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [activeCat, setActiveCat] = useState<string>('todos');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (userId) loadStoreData();
  }, [userId]);

  const loadStoreData = async () => {
    // Fixed: userId is already a string, no need for Number() conversion
    if (!userId) return;
    try {
      const prof = await mockBackend.getProfile(userId);
      const prods = await mockBackend.getProducts(userId);
      const cats = await mockBackend.getStoreCategories(userId);
      
      setProfile(prof || null);
      setProducts(prods);
      setCategories(cats);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyWhatsApp = (product: Product) => {
      const phone = profile?.phone?.replace(/\D/g, '') || profile?.socialLinks?.whatsapp?.replace(/\D/g, '') || '';
      if (!phone) {
          alert("Esta loja não configurou um telefone de contato.");
          return;
      }
      const msg = `Olá! Vim pelo Menu ADS. Gostaria de comprar: *${product.name}* (R$ ${product.price?.toFixed(2)}).`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const filteredProducts = activeCat === 'todos' 
      ? products 
      : products.filter(p => p.storeCategoryId === activeCat);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando loja...</div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center">Loja não encontrada.</div>;

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-20">
        
        {/* 1. Transparent Header */}
        <header className="fixed top-0 z-50 w-full transition-all duration-300 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/stores" className="p-2 rounded-full hover:bg-gray-100 text-gray-700">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <span className="font-bold text-lg text-gray-900 truncate max-w-[200px]">{profile.businessName}</span>
                <div className="flex gap-2">
                    <button className="p-2 rounded-full hover:bg-gray-100 text-gray-700 relative">
                        <ShoppingCart className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                </div>
            </div>
        </header>

        {/* 2. Immersive Hero */}
        <div className="relative h-[50vh] min-h-[300px] lg:h-[60vh] w-full overflow-hidden">
            {profile.storeConfig?.coverUrl ? (
                <img src={profile.storeConfig.coverUrl} className="w-full h-full object-cover" alt="Cover" />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center">
                    <Store className="w-20 h-20 text-white/10" />
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 w-full p-6 pb-12 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end gap-6">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white p-1 shadow-2xl border-4 border-white/20 backdrop-blur-sm relative z-10">
                    <img 
                        src={profile.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.businessName}`} 
                        className="w-full h-full object-cover rounded-xl" 
                        alt="Logo" 
                    />
                </div>
                <div className="text-white flex-1">
                    <h1 className="text-3xl md:text-5xl font-black mb-2 shadow-sm">{profile.businessName}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-200">
                        <span className="flex items-center gap-1 bg-white/20 backdrop-blur px-3 py-1 rounded-full"><MapPin className="w-4 h-4" /> {profile.city || 'Brasil'}</span>
                        <span className="flex items-center gap-1 bg-white/20 backdrop-blur px-3 py-1 rounded-full"><Star className="w-4 h-4 text-yellow-400 fill-current" /> 5.0 (Novo)</span>
                        {profile.storeConfig?.openingHours && (
                            <span className="flex items-center gap-1 bg-green-500/20 backdrop-blur px-3 py-1 rounded-full text-green-300 border border-green-500/30">Aberto Agora</span>
                        )}
                    </div>
                </div>
            </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* SIDEBAR INFO */}
                <div className="lg:col-span-4 xl:col-span-3 space-y-6">
                    <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100">
                        <h3 className="font-bold text-gray-900 text-lg mb-4">Sobre</h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6">
                            {profile.bio || 'Bem-vindo à nossa loja! Confira nossos produtos abaixo.'}
                        </p>
                        
                        <div className="space-y-4">
                            {profile.address && (
                                <div className="flex gap-3 items-start">
                                    <div className="p-2 bg-gray-50 rounded-lg text-gray-600"><MapPin className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Endereço</p>
                                        <p className="text-sm font-medium text-gray-800">{profile.address}</p>
                                    </div>
                                </div>
                            )}
                            {profile.storeConfig?.openingHours && (
                                <div className="flex gap-3 items-start">
                                    <div className="p-2 bg-gray-50 rounded-lg text-gray-600"><Clock className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Horário</p>
                                        <p className="text-sm font-medium text-gray-800 whitespace-pre-line">{profile.storeConfig.openingHours}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex gap-3 items-start">
                                <div className="p-2 bg-gray-50 rounded-lg text-gray-600"><CreditCard className="w-4 h-4" /></div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Pagamento</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {profile.storeConfig?.paymentMethods?.pix.enabled && <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded font-bold">PIX</span>}
                                        {profile.storeConfig?.paymentMethods?.creditCard && <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">Cartão</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                            {profile.socialLinks?.instagram && (
                                <a href={`https://instagram.com/${profile.socialLinks.instagram}`} target="_blank" className="p-3 bg-gray-50 rounded-xl hover:bg-pink-50 hover:text-pink-600 transition-colors"><Instagram className="w-5 h-5" /></a>
                            )}
                            {profile.socialLinks?.whatsapp && (
                                <a href={`https://wa.me/${profile.socialLinks.whatsapp}`} target="_blank" className="p-3 bg-gray-50 rounded-xl hover:bg-green-50 hover:text-green-600 transition-colors"><MessageCircle className="w-5 h-5" /></a>
                            )}
                            {profile.socialLinks?.website && (
                                <a href={profile.socialLinks.website} target="_blank" className="p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors"><Globe className="w-5 h-5" /></a>
                            )}
                            <button className="p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors"><Share2 className="w-5 h-5" /></button>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="lg:col-span-8 xl:col-span-9">
                    
                    {/* Navigation Pills */}
                    <div className="sticky top-16 z-30 bg-gray-50/95 backdrop-blur py-4 -mx-4 px-4 sm:mx-0 sm:px-0 mb-6 border-b border-gray-200/50">
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                            <button 
                                onClick={() => setActiveCat('todos')}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm ${activeCat === 'todos' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                            >
                                Todos
                            </button>
                            {categories.map(cat => (
                                <button 
                                    key={cat.id}
                                    onClick={() => setActiveCat(cat.id)}
                                    className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm ${activeCat === cat.id ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map(prod => (
                            <div 
                                key={prod.id} 
                                onClick={() => setSelectedProduct(prod)}
                                className="bg-white rounded-3xl p-3 pb-5 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                            >
                                <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 relative mb-4">
                                    {prod.imageUrl ? (
                                        <img src={prod.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={prod.name} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon className="w-10 h-10" /></div>
                                    )}
                                    {prod.promoPrice && <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">OFERTA</span>}
                                    <button className="absolute bottom-3 right-3 bg-white text-gray-900 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="px-2">
                                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">{prod.name}</h3>
                                    <p className="text-gray-500 text-xs line-clamp-2 mb-3">{prod.description}</p>
                                    <div className="flex items-center gap-2">
                                        {prod.promoPrice ? (
                                            <>
                                                <span className="text-lg font-black text-green-600">R$ {prod.promoPrice.toFixed(2)}</span>
                                                <span className="text-xs text-gray-400 line-through">R$ {prod.price.toFixed(2)}</span>
                                            </>
                                        ) : (
                                            <span className="text-lg font-black text-gray-900">{prod.price > 0 ? `R$ ${prod.price.toFixed(2)}` : 'Consulte'}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-400">Nenhum produto nesta categoria.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>

        {/* Product Detail Modal */}
        {selectedProduct && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row max-h-[90vh]">
                    <button 
                        onClick={() => setSelectedProduct(null)}
                        className="absolute top-4 right-4 p-2 bg-white/50 backdrop-blur rounded-full hover:bg-gray-100 z-10"
                    >
                        <X className="w-6 h-6 text-gray-700" />
                    </button>

                    <div className="w-full md:w-1/2 bg-gray-100 relative">
                        {selectedProduct.imageUrl ? (
                            <img src={selectedProduct.imageUrl} className="w-full h-full object-cover" alt={selectedProduct.name} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon className="w-16 h-16" /></div>
                        )}
                    </div>

                    <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
                        <span className="text-indigo-600 font-bold text-xs uppercase tracking-wide mb-2">
                            {categories.find(c => c.id === selectedProduct.storeCategoryId)?.name || 'Geral'}
                        </span>
                        <h2 className="text-3xl font-black text-gray-900 mb-4 leading-tight">{selectedProduct.name}</h2>
                        
                        <div className="flex items-center gap-3 mb-6">
                            {selectedProduct.promoPrice ? (
                                <>
                                    <span className="text-3xl font-bold text-green-600">R$ {selectedProduct.promoPrice.toFixed(2)}</span>
                                    <span className="text-lg text-gray-400 line-through">R$ {selectedProduct.price.toFixed(2)}</span>
                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">-{(100 - (selectedProduct.promoPrice / selectedProduct.price * 100)).toFixed(0)}%</span>
                                </>
                            ) : (
                                <span className="text-3xl font-bold text-gray-900">{selectedProduct.price > 0 ? `R$ ${selectedProduct.price.toFixed(2)}` : 'Sob Consulta'}</span>
                            )}
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-8 flex-1">
                            {selectedProduct.description}
                        </p>

                        <div className="mt-auto space-y-4">
                            <button 
                                onClick={() => handleBuyWhatsApp(selectedProduct)}
                                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
                            >
                                <MessageCircle className="w-6 h-6" /> 
                                {selectedProduct.buttonType === 'quote' ? 'Solicitar Orçamento' : 'Comprar pelo WhatsApp'}
                            </button>
                            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Compra segura direto com o vendedor
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
