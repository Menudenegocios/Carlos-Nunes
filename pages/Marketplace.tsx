
import React, { useEffect, useState } from 'react';
import { mockBackend } from '../services/mockBackend';
import { Product, Offer, OfferCategory } from '../types';
import { Search, ShoppingBag, Store, Image as ImageIcon, MessageCircle, Briefcase, ArrowRight, Filter, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { OfferCard } from '../components/OfferCard';

type MarketplaceProduct = Product & { businessName?: string, businessLogo?: string, businessPhone?: string };
type TabType = 'products' | 'services';

export const Marketplace: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [serviceOffers, setServiceOffers] = useState<Offer[]>([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const prods = await mockBackend.getAllProducts();
      setProducts(prods);
      const services = await mockBackend.getOffers({ category: OfferCategory.SERVICOS_PROFISSIONAIS });
      setServiceOffers(services);
    } finally { setIsLoading(false); }
  };

  const handleBuyProduct = (product: MarketplaceProduct) => {
    const phone = product.businessPhone?.replace(/\D/g, '') || '5511999999999';
    const message = `Olá *${product.businessName}*! Vi seu produto *${product.name}* no Menu ADS e gostaria de saber mais.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getFilteredItems = () => {
    const term = searchTerm.toLowerCase();
    if (activeTab === 'products') {
      return products.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        (p.businessName && p.businessName.toLowerCase().includes(term))
      );
    } 
    return serviceOffers.filter(o => 
      o.title.toLowerCase().includes(term) ||
      o.description.toLowerCase().includes(term) ||
      o.city.toLowerCase().includes(term)
    );
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="max-w-7xl mx-auto space-y-24 pb-32 pt-8 px-6">
      
      {/* 1. HERO SECTION (PARTNERS STYLE) */}
      <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">
           <ShoppingBag className="w-3 h-3" /> Catálogo Local Unificado
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none max-w-4xl mx-auto">
          Tudo o que você precisa <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">está bem aqui.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Encontre de produtos artesanais a serviços especializados no marketplace mais completo da sua região.
        </p>

        {/* Search & Tabs Controls */}
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-3 rounded-[2.5rem] shadow-2xl border border-gray-100 flex items-center">
                <Search className="w-5 h-5 text-gray-400 ml-6" />
                <input 
                    type="text" 
                    placeholder="Pesquisar por produto, serviço ou empresa..." 
                    className="w-full bg-transparent border-none p-4 font-bold text-gray-900 focus:ring-0 placeholder:text-gray-400"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="flex justify-center gap-4">
                <button onClick={() => setActiveTab('products')} className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-gray-900 text-white shadow-xl' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'}`}>
                    PRODUTOS
                </button>
                <button onClick={() => setActiveTab('services')} className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'services' ? 'bg-gray-900 text-white shadow-xl' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'}`}>
                    SERVIÇOS
                </button>
            </div>
        </div>
      </section>

      {/* 2. GRID CONTENT (BENTO STYLE) */}
      <section className="bg-white rounded-[4rem] p-12 md:p-20 border border-gray-100 shadow-2xl relative overflow-hidden">
        {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                {[1,2,3,4].map(i => <div key={i} className="bg-gray-50 rounded-[3rem] h-[400px] animate-pulse"></div>)}
            </div>
        ) : filteredItems.length === 0 ? (
            <div className="text-center py-24">
                <ImageIcon className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-gray-900">Nenhum resultado encontrado</h3>
                <p className="text-gray-500 mt-2 font-medium">Tente ajustar seus termos de pesquisa.</p>
            </div>
        ) : (
            <div className={`grid gap-10 ${activeTab === 'products' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
            {activeTab === 'products' && (filteredItems as MarketplaceProduct[]).map(product => (
                <div key={product.id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
                    <Link to={`/store/${product.userId}`} className="relative h-56 overflow-hidden block">
                        {product.imageUrl ? (
                            <img src={product.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={product.name} />
                        ) : (
                            <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-200"><ImageIcon className="w-10 h-10" /></div>
                        )}
                        {product.promoPrice && <div className="absolute top-5 right-5 bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg">OFERTA</div>}
                        <div className="absolute bottom-5 left-5 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full border-2 border-white/50 overflow-hidden shadow-lg">
                                <img src={product.businessLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${product.businessName}`} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-[10px] font-black text-white shadow-sm">{product.businessName}</span>
                        </div>
                    </Link>
                    <div className="p-8 flex-1 flex flex-col">
                        <h3 className="text-xl font-black text-gray-900 leading-tight mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                        <p className="text-gray-500 text-xs font-medium line-clamp-2 mb-8">{product.description}</p>
                        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase mb-0.5">Preço</p>
                                <p className="text-xl font-black text-gray-900">R$ {product.promoPrice ? product.promoPrice.toFixed(2) : product.price.toFixed(2)}</p>
                            </div>
                            <button onClick={() => handleBuyProduct(product)} className="bg-gray-900 text-white p-4 rounded-2xl hover:bg-emerald-600 transition-all shadow-xl">
                                <MessageCircle className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            {activeTab === 'services' && (filteredItems as Offer[]).map(offer => <OfferCard key={offer.id} offer={offer} />)}
            </div>
        )}
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-[80px] -mb-40 -ml-40"></div>
      </section>

      {/* 3. BUSINESS CTA (PARTNERS STYLE) */}
      <section className="bg-gray-900 rounded-[3.5rem] p-16 text-center text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Quer seus produtos aqui?</h2>
            <p className="text-gray-400 text-lg font-medium leading-relaxed">Crie seu catálogo digital hoje e apareça para milhares de clientes na sua região sem pagar comissões por venda.</p>
            <div className="pt-4">
               <Link to="/register" className="bg-white text-gray-900 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center gap-2 mx-auto shadow-2xl w-fit">
                 COMEÇAR MEU CATÁLOGO <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
};
