
import React, { useEffect, useState } from 'react';
import { mockBackend } from '../services/mockBackend';
import { Product, Offer, OfferCategory } from '../types';
import { 
  Search, ShoppingBag, Store, Image as ImageIcon, 
  MessageCircle, Briefcase, ArrowRight, Calendar, 
  Award, Ticket, MapPin, Clock, Users, Sparkles, X,
  CheckCircle, Zap, ExternalLink, ShieldCheck, Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { OfferCard } from '../components/OfferCard';

type MarketplaceProduct = Product & { businessName?: string, businessLogo?: string, businessPhone?: string };
type TabType = 'negocios' | 'profissionais' | 'mentorias' | 'eventos';

const MOCK_EVENTS = [
  {
    id: 201,
    title: "Workshop: Vendas no WhatsApp Pro",
    description: "Domine as ferramentas de automação e scripts persuasivos para converter mais leads em clientes reais usando apenas o WhatsApp Business.",
    date: "22 Outubro, 2024",
    time: "19:00",
    location: "Online (Google Meet)",
    type: "Webinar",
    image: "https://images.unsplash.com/photo-1591115765373-520b7a6f7104?auto=format&fit=crop&q=80&w=800",
    price: "Grátis para Membros",
    attendees: 156
  },
  {
    id: 202,
    title: "Meetup Empreendedores Locais SP",
    description: "Networking de alto nível para empresários do bairro. Venha trocar experiências, cartões e fechar parcerias estratégicas.",
    date: "10 Novembro, 2024",
    time: "15:00",
    location: "Avenida Paulista, 1000 - SP",
    type: "Presencial",
    image: "https://images.unsplash.com/photo-1540575861501-7c0351a77039?auto=format&fit=crop&q=80&w=800",
    price: "R$ 49,90",
    attendees: 45
  }
];

export const Marketplace: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('negocios');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [professionalOffers, setProfessionalOffers] = useState<Offer[]>([]);
  const [mentorshipOffers, setMentorshipOffers] = useState<Offer[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const prods = await mockBackend.getAllProducts();
      setProducts(prods);
      
      const allOffers = await mockBackend.getOffers();
      setProfessionalOffers(allOffers.filter(o => o.category === OfferCategory.SERVICOS_PROFISSIONAIS || o.category === OfferCategory.SAUDE_BEM_ESTAR || o.category === OfferCategory.IMOVEIS_SERVICOS));
      setMentorshipOffers(allOffers.filter(o => o.category === OfferCategory.OPORTUNIDADES || o.title.toLowerCase().includes('mentoria')));
    } finally { setIsLoading(false); }
  };

  const handleContact = (item: any) => {
    const phone = item.businessPhone || '5511999999999';
    const message = `Olá! Vi seu anúncio "*${item.name || item.title}*" no Marketplace do Menu ADS e gostaria de mais informações.`;
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getFilteredItems = () => {
    const term = searchTerm.toLowerCase();
    switch (activeTab) {
      case 'negocios':
        return products.filter(p => p.name.toLowerCase().includes(term) || (p.businessName && p.businessName.toLowerCase().includes(term)));
      case 'profissionais':
        return professionalOffers.filter(o => o.title.toLowerCase().includes(term) || o.description.toLowerCase().includes(term));
      case 'mentorias':
        return mentorshipOffers.filter(o => o.title.toLowerCase().includes(term) || o.description.toLowerCase().includes(term));
      case 'eventos':
        return MOCK_EVENTS.filter(e => e.title.toLowerCase().includes(term));
      default:
        return [];
    }
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32 pt-8 px-6">
      
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">
           <ShoppingBag className="w-3 h-3" /> Ecossistema Local
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-none max-w-4xl mx-auto">
          O Shopping de <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] dark:from-brand-primary dark:to-brand-accent">Oportunidades.</span>
        </h1>
        
        <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
               type="text" 
               placeholder="Pesquise por produtos, serviços ou mentorias..." 
               className="w-full pl-16 pr-6 py-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[2.5rem] font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 outline-none shadow-xl transition-all"
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
            />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-10">
            {[
                { id: 'negocios', label: 'Negócios Locais', icon: Store },
                { id: 'profissionais', label: 'Profissionais', icon: Briefcase },
                { id: 'mentorias', label: 'Mentorias', icon: Award },
                { id: 'eventos', label: 'Eventos', icon: Calendar },
            ].map((tab) => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)} 
                    className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'bg-white dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border border-gray-100 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700'}`}
                >
                    <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
            ))}
        </div>
      </section>

      {/* 2. CONTENT GRID */}
      <section className="min-h-[500px]">
        {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                {[1,2,3,4].map(i => <div key={i} className="bg-white dark:bg-zinc-900 rounded-[3rem] h-[400px] animate-pulse border border-gray-100 dark:border-zinc-800 shadow-sm"></div>)}
            </div>
        ) : filteredItems.length === 0 ? (
            <div className="text-center py-32 bg-white dark:bg-zinc-900 rounded-[4rem] border-2 border-dashed border-gray-100 dark:border-zinc-800">
                <ImageIcon className="w-16 h-16 text-gray-200 dark:text-zinc-700 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Nenhum resultado em {activeTab}</h3>
                <p className="text-gray-500 dark:text-zinc-400 mt-2 font-medium">Tente buscar por termos mais genéricos.</p>
            </div>
        ) : (
            <div className={`grid gap-10 ${activeTab === 'negocios' || activeTab === 'eventos' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
            
            {/* Render: Negócios Locais (Products) */}
            {activeTab === 'negocios' && (filteredItems as MarketplaceProduct[]).map(product => (
                <div key={product.id} onClick={() => setSelectedItem({...product, type: 'product'})} className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full cursor-pointer">
                    <div className="relative h-56 overflow-hidden block">
                        <img src={product.imageUrl || 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={product.name} />
                        <div className="absolute bottom-4 left-4 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-lg">
                                <img src={product.businessLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${product.businessName}`} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-[9px] font-black text-white bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg uppercase">{product.businessName}</span>
                        </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight mb-2 line-clamp-2">{product.name}</h3>
                        <div className="mt-auto pt-6 border-t border-gray-50 dark:border-zinc-800 flex items-center justify-between">
                            <p className="text-xl font-black text-indigo-600 dark:text-brand-primary">R$ {product.price.toFixed(2)}</p>
                            <div className="bg-gray-900 dark:bg-zinc-800 text-white p-4 rounded-2xl group-hover:bg-indigo-600 transition-all">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Render: Profissionais & Mentorias (Offers) */}
            {(activeTab === 'profissionais' || activeTab === 'mentorias') && (filteredItems as Offer[]).map(offer => (
                <OfferCard key={offer.id} offer={offer} onClick={() => setSelectedItem({...offer, type: 'offer'})} />
            ))}

            {/* Render: Eventos */}
            {activeTab === 'eventos' && (filteredItems as any[]).map(event => (
                <div key={event.id} onClick={() => setSelectedItem({...event, type: 'event'})} className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full cursor-pointer">
                    <div className="relative h-56 overflow-hidden">
                        <img src={event.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={event.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/40 dark:border-zinc-700 shadow-sm">
                           <span className="text-[10px] font-black text-indigo-600 dark:text-brand-primary uppercase tracking-widest">{event.type}</span>
                        </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 text-gray-400 dark:text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">
                            <Clock className="w-3.5 h-3.5" /> {event.date} às {event.time}
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-6 group-hover:text-indigo-600 transition-colors">{event.title}</h3>
                        
                        <div className="space-y-4 mb-10 text-gray-500 dark:text-zinc-400 text-sm font-medium">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-gray-400" /> {event.location}
                            </div>
                            <div className="flex items-center gap-3">
                                <Users className="w-4 h-4 text-gray-400" /> {event.attendees} inscritos
                            </div>
                        </div>

                    <div className="mt-auto pt-8 border-t border-gray-50 dark:border-zinc-800 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase mb-1">Investimento</p>
                            <p className="text-xl font-black text-gray-900 dark:text-white">{event.price}</p>
                        </div>
                        <button className="bg-gray-900 dark:bg-zinc-800 text-white p-4 rounded-2xl group-hover:bg-indigo-600 transition-all shadow-xl">
                            <Ticket className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
            ))}
            </div>
        )}
      </section>

      {/* 3. ITEM DETAIL MODAL (SIMULATED PAGE) */}
      {selectedItem && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
           <div className="bg-white dark:bg-zinc-900 w-full max-w-5xl h-fit max-h-[90vh] rounded-[3.5rem] shadow-2xl overflow-hidden relative flex flex-col lg:flex-row animate-scale-in">
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-8 right-8 z-50 p-4 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-all"
              >
                 <X className="w-6 h-6" />
              </button>

              {/* Modal Left: Visual */}
              <div className="w-full lg:w-1/2 h-[300px] lg:h-auto relative">
                 <img src={selectedItem.image || selectedItem.imageUrl} className="w-full h-full object-cover" alt="Detail" />
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

              {/* Modal Right: Info */}
              <div className="flex-1 p-10 md:p-16 overflow-y-auto flex flex-col">
                 <div className="flex items-center gap-4 mb-10 pb-8 border-b border-gray-100 dark:border-zinc-800">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center shadow-sm border border-gray-100 dark:border-zinc-700 overflow-hidden">
                       <img src={selectedItem.businessLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedItem.businessName || 'Admin'}`} className="w-full h-full object-cover" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Publicado por</p>
                       <h4 className="font-black text-gray-900 dark:text-white text-lg uppercase tracking-tight">{selectedItem.businessName || 'Empreendedor Menu'}</h4>
                    </div>
                 </div>

                 <div className="space-y-8 flex-1">
                    <div className="prose prose-indigo dark:prose-invert max-w-none">
                       <p className="text-gray-500 dark:text-zinc-400 text-lg font-medium leading-relaxed">
                          {selectedItem.description}
                       </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       {selectedItem.type === 'event' ? (
                          <>
                             <div className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-3xl border border-gray-100 dark:border-zinc-700">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Data & Hora</p>
                                <p className="font-black text-gray-900 dark:text-white text-sm leading-tight">{selectedItem.date} <br/> às {selectedItem.time}</p>
                             </div>
                             <div className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-3xl border border-gray-100 dark:border-zinc-700">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Local</p>
                                <p className="font-black text-gray-900 dark:text-white text-sm leading-tight">{selectedItem.location}</p>
                             </div>
                          </>
                       ) : (
                          <>
                             <div className="p-6 bg-emerald-50 dark:bg-emerald-950/30 rounded-3xl border border-emerald-100 dark:border-emerald-900/30">
                                <p className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Zap className="w-3 h-3" /> Investimento</p>
                                <p className="font-black text-emerald-700 dark:text-emerald-400 text-2xl">
                                   {typeof selectedItem.price === 'number' ? `R$ ${selectedItem.price.toFixed(2)}` : selectedItem.price}
                                </p>
                             </div>
                             <div className="p-6 bg-blue-50 dark:bg-blue-950/30 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                                <p className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Segurança</p>
                                <p className="font-black text-blue-700 dark:text-blue-400 text-sm">Garantida pelo <br/>Menu ADS</p>
                             </div>
                          </>
                       )}
                    </div>
                 </div>

                 <div className="mt-12 pt-8 border-t border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row gap-4">
                    <button 
                      onClick={() => handleContact(selectedItem)}
                      className="flex-1 bg-gray-900 dark:bg-brand-primary text-white py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-600 dark:hover:bg-brand-accent transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
                    >
                       <MessageCircle className="w-4 h-4" /> FALAR NO WHATSAPP
                    </button>
                    {selectedItem.type === 'product' && (
                       <Link 
                         to={`/store/${selectedItem.userId}`}
                         className="flex-1 bg-indigo-50 dark:bg-zinc-800 text-indigo-600 dark:text-white py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white transition-all border border-indigo-100 dark:border-zinc-700 flex items-center justify-center gap-3"
                       >
                          <Store className="w-4 h-4" /> VISITAR LOJA
                       </Link>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
