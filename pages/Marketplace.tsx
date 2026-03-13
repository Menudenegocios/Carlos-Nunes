
import React, { useEffect, useState } from 'react';
import { supabaseService } from '../services/supabaseService';
import { Product, Offer, OfferCategory } from '../types';
import { 
  Search, ShoppingBag, Store, Image as ImageIcon, 
  MessageCircle, Briefcase, ArrowRight, Calendar, 
  Award, MapPin, X, Star, Zap, ShieldCheck, Package, Wrench, Handshake,
  ChevronRight, Filter, Utensils, Shirt, Monitor, Home, Sparkles as Beauty, Sparkles,
  Stethoscope, Car, GraduationCap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { OfferCard } from '../components/OfferCard';

type MarketplaceProduct = Product & { business_name?: string, businessLogo?: string, businessPhone?: string };
type TabType = 'todos' | 'produtos' | 'servicos' | 'oportunidades';

const PRODUCT_CATEGORIES = [
    { id: 'Todas', label: 'Todas', icon: Package },
    { id: 'Alimentos', label: 'Alimentos', icon: Utensils },
    { id: 'Moda', label: 'Moda', icon: Shirt },
    { id: 'Tecnologia', label: 'Tecnologia', icon: Monitor },
    { id: 'Casa', label: 'Casa', icon: Home },
    { id: 'Beleza', label: 'Beleza', icon: Beauty },
];

const SERVICE_CATEGORIES = [
    { id: 'Todas', label: 'Todas', icon: Wrench },
    { id: OfferCategory.SERVICOS_PROFISSIONAIS, label: 'Profissionais', icon: Briefcase },
    { id: OfferCategory.SAUDE_BEM_ESTAR, label: 'Saúde', icon: Stethoscope },
    { id: OfferCategory.IMOVEIS_SERVICOS, label: 'Imóveis', icon: Home },
    { id: 'Automotivo', label: 'Automotivo', icon: Car },
];

const OPPORTUNITY_CATEGORIES = [
    { id: 'Todas', label: 'Todas', icon: Handshake },
    { id: 'Mentoria', label: 'Mentorias', icon: GraduationCap },
    { id: 'B2B', label: 'Match B2B', icon: Zap },
    { id: OfferCategory.OPORTUNIDADES, label: 'Parcerias', icon: Award },
];

export const Marketplace: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('todos');
  const [activeSubCategory, setActiveSubCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  useEffect(() => { loadData(); }, []);

  // Reseta subcategoria ao trocar a aba principal
  useEffect(() => {
    setActiveSubCategory('Todas');
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prods, offers] = await Promise.all([
        supabaseService.getAllProducts(),
        supabaseService.getOffers()
      ]);
      setProducts(prods);
      setAllOffers(offers);
    } catch (error) {
      console.error('Error loading marketplace data:', error);
    } finally { setIsLoading(false); }
  };

  const handleContact = (item: any) => {
    const phone = item.businessPhone || item.social_links?.whatsapp || '5511999999999';
    const message = `Olá! Vi seu anúncio "*${item.name || item.title}*" no Marketplace do Menu ADS e gostaria de mais informações.`;
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getFilteredItems = () => {
    const term = searchTerm.toLowerCase();
    const subCat = activeSubCategory;
    
    let items: any[] = [];
    if (activeTab === 'todos' || activeTab === 'produtos') {
        let filteredProds = products.filter(p => 
            p.name.toLowerCase().includes(term) || 
            (p.business_name && p.business_name.toLowerCase().includes(term))
        );
        if (subCat !== 'Todas') {
            filteredProds = filteredProds.filter(p => p.category === subCat);
        }
        
        const localBios = allOffers.filter(o => 
          o.category === OfferCategory.NEGOCIOS_LOCAIS && 
          o.description.includes("[BIO_MARKER]") &&
          (o.title.toLowerCase().includes(term) || o.description.toLowerCase().includes(term)) &&
          (subCat === 'Todas' || o.title.toLowerCase().includes(subCat.toLowerCase()))
        );
        items = [...items, ...filteredProds, ...localBios];
    }
    
    if (activeTab === 'todos' || activeTab === 'servicos') {
        let filteredServs = allOffers.filter(o => 
            (o.category === OfferCategory.SERVICOS_PROFISSIONAIS || 
             o.category === OfferCategory.SAUDE_BEM_ESTAR || 
             o.category === OfferCategory.IMOVEIS_SERVICOS) && 
            !o.description.includes("[MENTORIA]") &&
            o.description.includes("[BIO_MARKER]") &&
            (o.title.toLowerCase().includes(term) || o.description.toLowerCase().includes(term))
        );
        if (subCat !== 'Todas') {
            filteredServs = filteredServs.filter(o => o.category === subCat || o.title.toLowerCase().includes(subCat.toLowerCase()));
        }
        items = [...items, ...filteredServs];
    }

    if (activeTab === 'todos' || activeTab === 'oportunidades') {
        let filteredOpps = allOffers.filter(o => 
            (o.title.toLowerCase().includes('mentoria') || 
             o.description.includes("[MENTORIA]") || 
             o.category === OfferCategory.OPORTUNIDADES) && 
            (o.title.toLowerCase().includes(term) || o.description.toLowerCase().includes(term))
        );
        if (subCat !== 'Todas') {
            if (subCat === 'Mentoria') {
                filteredOpps = filteredOpps.filter(o => o.title.toLowerCase().includes('mentoria') || o.description.includes("[MENTORIA]"));
            } else if (subCat === 'B2B') {
                filteredOpps = filteredOpps.filter(o => o.description.includes("[B2B]") || o.category === OfferCategory.OPORTUNIDADES);
            } else {
                filteredOpps = filteredOpps.filter(o => o.category === subCat);
            }
        }
        items = [...items, ...filteredOpps];
    }
    return items;
  };

  const currentSubCategories = activeTab === 'produtos' 
    ? PRODUCT_CATEGORIES 
    : activeTab === 'servicos' 
    ? SERVICE_CATEGORIES 
    : activeTab === 'oportunidades'
    ? OPPORTUNITY_CATEGORIES
    : [{ id: 'Todas', label: 'Todas', icon: Sparkles }];

  const filteredItems = getFilteredItems();

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 pt-8 px-6">
      
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">
           <ShoppingBag className="w-3 h-3" /> Ecossistema Local
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight max-w-4xl mx-auto uppercase overflow-visible">
          O Shopping de <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] italic font-black title-fix">Oportunidades.</span>
        </h1>
        
        <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
               type="text" 
               placeholder="O que você busca no O Shopping de Oportunidades?" 
               className="w-full pl-16 pr-6 py-5 bg-white border border-gray-100 rounded-[2.5rem] font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none shadow-xl transition-all"
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
            />
        </div>

        {/* Abas Principais Estilizadas */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
            {[
                { id: 'todos', label: 'Todos', icon: Sparkles },
                { id: 'produtos', label: 'Produtos', icon: Package },
                { id: 'servicos', label: 'Serviços', icon: Wrench },
                { id: 'oportunidades', label: 'Oportunidades', icon: Handshake },
            ].map((tab) => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)} 
                    className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'}`}
                >
                    <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
            ))}
        </div>

        {/* Subfiltros de Categoria Dinâmicos */}
        {activeTab !== 'todos' && (
            <div className="flex justify-center pt-4">
                <div className="bg-gray-50 p-1.5 rounded-[2rem] border border-gray-100 flex gap-1 overflow-x-auto scrollbar-hide max-w-full">
                    {currentSubCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveSubCategory(cat.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all whitespace-nowrap ${activeSubCategory === cat.id ? 'bg-white text-indigo-600 shadow-sm font-black' : 'text-slate-400 font-bold hover:text-slate-600'}`}
                        >
                            <cat.icon className={`w-3.5 h-3.5 ${activeSubCategory === cat.id ? 'opacity-100' : 'opacity-40'}`} />
                            <span className="text-[10px] uppercase tracking-wider italic">{cat.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        )}
      </section>

      {/* 2. CONTENT GRID */}
      <section className="min-h-[500px]">
        <div className="flex justify-between items-center mb-8 px-2">
            <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest italic">
                <Filter className="w-3.5 h-3.5" />
                {activeTab} <ChevronRight className="w-3 h-3" /> {activeSubCategory}
            </div>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg">
                {filteredItems.length} RESULTADOS
            </span>
        </div>

        {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-[3rem] h-[400px] animate-pulse border border-gray-100 shadow-sm"></div>)}
            </div>
        ) : filteredItems.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-gray-100">
                <ImageIcon className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-gray-900">Nada encontrado em "{activeSubCategory}"</h3>
                <p className="text-gray-50 mt-2 font-medium">Tente buscar por termos mais genéricos ou mude a categoria.</p>
                <button 
                    onClick={() => setActiveSubCategory('Todas')}
                    className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all"
                >
                    LIMPAR FILTROS
                </button>
            </div>
        ) : (
            <div className={`grid gap-10 ${activeTab === 'produtos' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
            
            {filteredItems.map((item: any) => {
                const isOffer = !!item.category;
                const isProduct = !isOffer;

                if (isProduct) {
                    return (
                        <div key={item.id} onClick={() => setSelectedItem({...item, type: 'product'})} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full cursor-pointer">
                            <div className="relative h-56 overflow-hidden block">
                                <img src={item.image_url || 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={item.name} />
                                <div className="absolute top-4 right-4">
                                    <span className="bg-white/90 backdrop-blur-md text-indigo-600 text-[8px] font-black px-3 py-1 rounded-full uppercase border border-white/20">
                                        {item.category || 'Geral'}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-lg bg-white flex items-center justify-center">
                                        <Store className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <span className="text-[9px] font-black text-white bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg uppercase">O Shopping de Oportunidades</span>
                                </div>
                            </div>
                            <div className="p-8 flex-1 flex flex-col">
                                <h3 className="text-xl font-black text-gray-900 leading-tight mb-2 line-clamp-2">{item.name}</h3>
                                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <p className="text-xl font-black text-indigo-600">R$ {item.price.toFixed(2)}</p>
                                    <div className="bg-gray-900 text-white p-4 rounded-2xl group-hover:bg-indigo-600 transition-all">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }

                return (
                    <div key={item.id} className="relative">
                        <OfferCard 
                            offer={item} 
                            onClick={() => setSelectedItem({...item, type: 'offer'})} 
                        />
                        {item.scheduling?.enabled && (
                            <div className="absolute top-4 right-4 z-10">
                                <span className="bg-emerald-600 text-white text-[8px] font-black px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> AGENDÁVEL
                                </span>
                            </div>
                        )}
                    </div>
                );
            })}
            </div>
        )}
      </section>

      {/* 3. ITEM DETAIL MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
           <div className="bg-white w-full max-w-5xl h-fit max-h-[90vh] rounded-[3.5rem] shadow-2xl overflow-hidden relative flex flex-col lg:flex-row animate-scale-in">
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-8 right-8 z-50 p-4 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-all"
              >
                 <X className="w-6 h-6" />
              </button>

              <div className="w-full lg:w-1/2 h-[300px] lg:h-auto relative">
                 <img src={selectedItem.image || selectedItem.image_url} className="w-full h-full object-cover" alt="Detail" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                 <div className="absolute bottom-10 left-10 right-10">
                    <div className="flex items-center gap-2 mb-4">
                       <span className="bg-indigo-600 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border border-white/20">
                          {selectedItem.category || selectedItem.type}
                       </span>
                       <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-[10px] font-black border border-white/10">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" /> VERIFICADO
                       </div>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white leading-none tracking-tight">
                       {selectedItem.name || selectedItem.title}
                    </h2>
                 </div>
              </div>

              <div className="flex-1 p-10 md:p-16 overflow-y-auto flex flex-col">
                 <div className="flex items-center gap-4 mb-10 pb-8 border-b border-gray-100">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center shadow-sm border border-indigo-100 overflow-hidden">
                       <Store className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ecossistema Local</p>
                       <h4 className="font-black text-gray-900 text-lg uppercase tracking-tight">O Shopping de Oportunidades</h4>
                    </div>
                 </div>

                 <div className="space-y-8 flex-1">
                    <div className="prose prose-indigo max-w-none">
                       <p className="text-gray-50 text-lg font-medium leading-relaxed">
                          {selectedItem.description.replace(/\[MENTORIA\]|\[BIO_MARKER\]/g, '')}
                       </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       {selectedItem.scheduling?.enabled ? (
                           <div className="col-span-2 p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center justify-between">
                               <div>
                                   <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Agendamento Ativo</p>
                                   <p className="font-black text-gray-900 text-sm">Sessão de {selectedItem.scheduling.duration_minutes}min ({selectedItem.scheduling.meeting_type === 'google_meet' ? 'Online' : 'Presencial'})</p>
                               </div>
                               <button className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">RESERVAR</button>
                           </div>
                       ) : null}

                       <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                          <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Zap className="w-3 h-3" /> Investimento</p>
                          <p className="font-black text-emerald-700 text-2xl">
                             {typeof selectedItem.price === 'number' ? `R$ ${selectedItem.price.toFixed(2)}` : selectedItem.price}
                          </p>
                       </div>
                       <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                          <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Segurança</p>
                          <p className="font-black text-blue-700 text-sm">Garantida pelo <br/>Menu ADS</p>
                       </div>
                    </div>
                 </div>

                  <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row gap-4">
                    <button 
                      onClick={() => handleContact(selectedItem)}
                      className="flex-1 bg-gray-900 text-white py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
                    >
                       <MessageCircle className="w-4 h-4" /> FALAR NO WHATSAPP
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
