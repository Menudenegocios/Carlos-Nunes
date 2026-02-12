
import React, { useEffect, useState } from 'react';
import { mockBackend } from '../services/mockBackend';
import { Product, Offer, OfferCategory } from '../types';
import { Search, ShoppingBag, Store, Image as ImageIcon, MessageCircle, Briefcase, ArrowRight } from 'lucide-react';
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

  // Data States
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [serviceOffers, setServiceOffers] = useState<Offer[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load Products (Local Businesses)
      const prods = await mockBackend.getAllProducts();
      setProducts(prods);

      // Load Services (Professionals)
      const services = await mockBackend.getOffers({ category: OfferCategory.SERVICOS_PROFISSIONAIS });
      setServiceOffers(services);

    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyProduct = (product: MarketplaceProduct) => {
    const phone = product.businessPhone?.replace(/\D/g, '') || '5511999999999';
    const message = `Olá *${product.businessName}*! Vi seu produto *${product.name}* no Menu ADS e gostaria de saber mais.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Filter Logic based on Active Tab
  const getFilteredItems = () => {
    const term = searchTerm.toLowerCase();
    
    if (activeTab === 'products') {
      return products.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        (p.businessName && p.businessName.toLowerCase().includes(term))
      );
    } 
    
    if (activeTab === 'services') {
      return serviceOffers.filter(o => 
        o.title.toLowerCase().includes(term) ||
        o.description.toLowerCase().includes(term) ||
        o.city.toLowerCase().includes(term)
      );
    }

    return [];
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-indigo-900 text-white py-12 px-6 rounded-3xl shadow-xl text-center relative overflow-hidden mt-6">
         <div className="relative z-10 max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 flex items-center justify-center gap-3">
               <Store className="w-10 h-10 text-cyan-400" /> Marketplace
            </h1>
            <p className="text-xl text-indigo-100">
               Descubra produtos locais e contrate profissionais qualificados.
            </p>
            {user && (
               <div className="mt-8">
                  <Link 
                    to="/catalog" 
                    className="inline-flex items-center gap-2 bg-white text-indigo-900 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    <ShoppingBag className="w-5 h-5" /> Painel do Lojista
                  </Link>
               </div>
            )}
         </div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-30"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500 rounded-full blur-[100px] opacity-30"></div>
      </div>

      {/* Tabs & Search Container */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-20 z-40 space-y-4">
        
        {/* Tabs */}
        <div className="flex p-1 bg-gray-100 rounded-xl overflow-x-auto">
           <button 
             onClick={() => setActiveTab('products')}
             className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'products' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
           >
             <Store className="w-4 h-4" /> Negócios Locais
           </button>
           <button 
             onClick={() => setActiveTab('services')}
             className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'services' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
           >
             <Briefcase className="w-4 h-4" /> Profissionais
           </button>
        </div>

        {/* Search */}
        <div className="relative">
          <input 
            type="text" 
            placeholder={activeTab === 'products' ? "Buscar produtos ou lojas..." : "Buscar profissionais..."}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-3.5 w-6 h-6 text-gray-400" />
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
               <div key={i} className="bg-white rounded-xl h-80 animate-pulse border border-gray-200"></div>
            ))}
         </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
             <Search className="w-8 h-8" />
          </div>
          <p className="text-gray-500 text-lg">Nenhum resultado encontrado nesta categoria.</p>
        </div>
      ) : (
        <div className={`grid gap-6 ${activeTab === 'products' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
          
          {/* PRODUCT RENDER LOGIC */}
          {activeTab === 'products' && (filteredItems as MarketplaceProduct[]).map(product => (
            <div key={product.id} className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
              <Link to={`/store/${product.userId}`} className="relative h-48 w-full overflow-hidden bg-gray-100 block">
                 {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                       <ImageIcon className="w-10 h-10" />
                    </div>
                 )}
                 {product.promoPrice && (
                    <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                       OFERTA
                    </div>
                 )}
              </Link>

              <div className="p-4 flex-1 flex flex-col">
                 <Link to={`/store/${product.userId}`} className="flex items-center gap-2 mb-2 hover:bg-gray-50 rounded-full pr-2 transition-colors w-fit">
                    <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                       <img src={product.businessLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${product.businessName}`} className="w-full h-full object-cover" alt="Store" />
                    </div>
                    <span className="text-xs text-gray-500 truncate font-medium">{product.businessName}</span>
                 </Link>

                 <h3 className="font-bold text-gray-900 mb-1 leading-tight line-clamp-2">{product.name}</h3>
                 <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">{product.description}</p>

                 <div className="flex justify-between items-end mt-auto pt-3 border-t border-gray-100">
                    <div>
                       {product.promoPrice ? (
                          <>
                             <span className="text-xs text-gray-400 line-through">R$ {product.price.toFixed(2)}</span>
                             <span className="block text-lg font-bold text-green-600">R$ {product.promoPrice.toFixed(2)}</span>
                          </>
                       ) : (
                          <span className="text-lg font-bold text-gray-900">R$ {product.price.toFixed(2)}</span>
                       )}
                    </div>
                    
                    <div className="flex gap-2">
                       <Link 
                          to={`/store/${product.userId}`} 
                          className="bg-indigo-50 text-indigo-600 p-2 rounded-lg hover:bg-indigo-100 transition-colors"
                          title="Visitar Loja"
                       >
                          <Store className="w-5 h-5" />
                       </Link>
                       <button 
                          onClick={() => handleBuyProduct(product)}
                          className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors shadow-md"
                          title="Comprar / Falar no WhatsApp"
                       >
                          <MessageCircle className="w-5 h-5" />
                       </button>
                    </div>
                 </div>
              </div>
            </div>
          ))}

          {/* SERVICES RENDER LOGIC */}
          {activeTab === 'services' && (filteredItems as Offer[]).map(offer => (
             <OfferCard key={offer.id} offer={offer} />
          ))}

        </div>
      )}

    </div>
  );
};
