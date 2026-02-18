
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
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prods, offers] = await Promise.all([
        mockBackend.getAllProducts(),
        mockBackend.getOffers()
      ]);
      setProducts(prods);
      setAllOffers(offers);
    } finally { setIsLoading(false); }
  };

  const handleContact = (item: any) => {
    const phone = item.businessPhone || item.socialLinks?.whatsapp || '5511999999999';
    const message = `Olá! Vi seu anúncio "*${item.name || item.title}*" no Marketplace do Menu ADS e gostaria de mais informações.`;
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getFilteredItems = () => {
    const term = searchTerm.toLowerCase();
    
    switch (activeTab) {
      case 'negocios':
        // Mostra Produtos + Bios marcadas como Negócios Locais com [BIO_MARKER]
        const localProds = products.filter(p => p.name.toLowerCase().includes(term) || (p.businessName && p.businessName.toLowerCase().includes(term)));
        const localBios = allOffers.filter(o => 
          o.category === OfferCategory.NEGOCIOS_LOCAIS && 
          o.description.includes("[BIO_MARKER]") &&
          (o.title.toLowerCase().includes(term) || o.description.toLowerCase().includes(term))
        );
        return [...localProds, ...localBios];

      case 'profissionais':
        // Bios marcadas como Profissionais com [BIO_MARKER]
        return allOffers.filter(o => 
            (o.category === OfferCategory.SERVICOS_PROFISSIONAIS || o.category === OfferCategory.SAUDE_BEM_ESTAR || o.category === OfferCategory.IMOVEIS_SERVICOS) && 
            !o.description.includes("[MENTORIA]") && !o.description.includes("[EVENTO]") &&
            o.description.includes("[BIO_MARKER]") &&
            (o.title.toLowerCase().includes(term) || o.description.toLowerCase().includes(term))
        );

      case 'mentorias':
        // Bios marcadas com a tag de Mentoria
        return allOffers.filter(o => 
            (o.title.toLowerCase().includes('mentoria') || o.description.includes("[MENTORIA]")) && 
            (o.title.toLowerCase().includes(term) || o.description.toLowerCase().includes(term))
        );

      case 'eventos':
        // Bios marcadas com a tag de Evento + Mocks
        const realEvents = allOffers.filter(o => 
            o.description.includes("[EVENTO]") && 
            (o.title.toLowerCase().includes(term) || o.description.toLowerCase().includes(term))
        );
        const mocks = MOCK_EVENTS.filter(e => e.title.toLowerCase().includes(term));
        return [...realEvents, ...mocks];

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
            
            {filteredItems.map((item: any) => {
                const isOffer = !!item.category;
                const isProduct = !isOffer;

                if (isProduct) {
                    return (
                        <div key={item.id} onClick={() => setSelectedItem({...item, type: 'product'})} className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full cursor-pointer">
                            <div className="relative h-56 overflow-hidden block">
                                <img src={item.imageUrl || 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={item.name} />
                                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-lg">
                                        <img src={item.businessLogo || `https://api.dicebear.com/7.x/initials/svg?seed=${item.businessName}`} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-[9px] font-black text-white bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg uppercase">{item.businessName}</span>
                                </div>
                            </div>
                            <div className="p-8 flex-1 flex flex-col">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight mb-2 line-clamp-2">{item.name}</h3>
                                <div className="mt-auto pt-6 border-t border-gray-50 dark:border-zinc-800 flex items-center justify-between">
                                    <p className="text-xl font-black text-indigo-600 dark:text-brand-primary">R$ {item.price.toFixed(2)}</p>
                                    <div className="bg-gray-900 dark:bg-zinc-800 text-white p-4 rounded-2xl group-hover:bg-indigo-600 transition-all">
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
                            onClick={() => setSelectedItem({...item, type: item.description.includes("[EVENTO]") ? 'event' : 'offer'})} 
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
           <div className="bg-white dark:bg-zinc-900 w-full max-w-5xl h-fit max-h-[90vh] rounded-[3.5rem] shadow-2xl overflow-hidden relative flex flex-col lg:flex-row animate-scale-in">
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-8 right-8 z-50 p-4 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-all"
              >
                 <X className="w-6 h-6" />
              </button>

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

              <div className="flex-1 p-10 md:p-16 overflow-y-auto flex flex-col">
                 <div className="flex items-center gap-4 mb-10 pb-8 border-b border-gray-100 dark:border-zinc-800">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center shadow-sm border border-gray-100 dark:border-zinc-700 overflow-hidden">
                       <img src={selectedItem.businessLogo || selectedItem.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedItem.businessName || 'Admin'}`} className="w-full h-full object-cover" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Publicado por</p>
                       <h4 className="font-black text-gray-900 dark:text-white text-lg uppercase tracking-tight">{selectedItem.businessName || 'Empreendedor Menu'}</h4>
                    </div>
                 </div>

                 <div className="space-y-8 flex-1">
                    <div className="prose prose-indigo dark:prose-invert max-w-none">
                       <p className="text-gray-50 dark:text-zinc-400 text-lg font-medium leading-relaxed">
                          {selectedItem.description.replace(/\[MENTORIA\]|\[EVENTO\]|\[BIO_MARKER\]/g, '')}
                       </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       {selectedItem.scheduling?.enabled ? (
                           <div className="col-span-2 p-6 bg-emerald-50 dark:bg-emerald-950/30 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between">
                               <div>
                                   <p className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Agendamento Ativo</p>
                                   <p className="font-black text-gray-900 dark:text-white text-sm">Sessão de {selectedItem.scheduling.durationMinutes}min ({selectedItem.scheduling.meetingType === 'google_meet' ? 'Online' : 'Presencial'})</p>
                               </div>
                               <button className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">RESERVAR</button>
                           </div>
                       ) : null}

                       {selectedItem.type === 'event' ? (
                          <>
                             <div className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-3xl border border-gray-100 dark:border-zinc-700">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Data & Hora</p>
                                <p className="font-black text-gray-900 dark:text-white text-sm leading-tight">{selectedItem.date || 'Consultar'} <br/> {selectedItem.time ? `às ${selectedItem.time}` : ''}</p>
                             </div>
                             <div className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-3xl border border-gray-100 dark:border-zinc-700">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Local</p>
                                <p className="font-black text-gray-900 dark:text-white text-sm leading-tight">{selectedItem.location || selectedItem.city}</p>
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
                    {selectedItem.userId && (
                       <Link 
                         to={`/store/${selectedItem.userId}`}
                         className="flex-1 bg-indigo-50 dark:bg-zinc-800 text-indigo-600 dark:text-white py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white transition-all border border-indigo-100 dark:border-zinc-700 flex items-center justify-center gap-3"
                       >
                          <Store className="w-4 h-4" /> VISITAR VITRINE
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
