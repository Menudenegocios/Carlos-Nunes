
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Video, Ticket, ArrowRight, Sparkles, Filter, Clock, ExternalLink, Search, Play, X, Wrench, GraduationCap, Mic, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { Media } from '../types';

type MediaType = 'Todos' | 'Eventos' | 'MenuCast' | 'Ferramentas' | 'Treinamentos';

const MOCK_MEDIA = [
  {
    id: 'mn-conexoes-2024',
    title: "Menu de Negócios – Conexões & Negócios",
    date: "18 Março, 2024",
    time: "19:00",
    location: "Bourbon Teresópolis",
    category: "Eventos",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
    price: "Inscrição via Sympla",
    attendees: 120,
    link: "https://www.sympla.com.br/evento/menu-de-negocios/3287623",
    description: "Prepare-se para uma experiência transformadora que vai muito além do networking tradicional. Um evento criado para empreendedores que querem gerar oportunidades reais, fortalecer parcerias estratégicas e acelerar resultados."
  },
  {
    id: 'menucast-ep1',
    title: "MenuCast #01 - Como escalar vendas locais",
    category: "MenuCast",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800",
    duration: "45m",
    youtubeEmbed: "https://www.youtube.com/embed/fP3SujZ2olQ?si=eScDroQosOKRNVm2",
    description: "Neste episódio de estreia, discutimos as melhores estratégias para dominar o mercado local usando tráfego pago e relacionamento."
  },
  {
    id: 'treinamento-vendas',
    title: "10 formas de Fechamentos em Vendas",
    category: "Treinamentos",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800",
    duration: "1h 20m",
    youtubeEmbed: "https://www.youtube.com/embed/fP3SujZ2olQ?list=PLZ9PlCqw0n_2oqrwT3nwbNz3yFxVHrZUr",
    description: "Conheça 10 técnicas infalíveis para contornar objeções e fechar mais vendas todos os dias."
  },
  {
    id: 'ferramenta-planilha',
    title: "Planilha de Precificação Inteligente",
    category: "Ferramentas",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800",
    link: "#",
    description: "Baixe nossa planilha exclusiva para calcular a margem de lucro correta dos seus produtos e serviços."
  }
];

const CATEGORIES = [
    { id: 'Todos', label: 'Todos', icon: Sparkles },
    { id: 'Eventos', label: 'Eventos', icon: Calendar },
    { id: 'MenuCast', label: 'MenuCast', icon: Mic },
    { id: 'Ferramentas', label: 'Ferramentas', icon: Wrench },
    { id: 'Treinamentos', label: 'Treinamentos', icon: GraduationCap },
];

export const Events: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MediaType>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [mediaItems, setMediaItems] = useState<any[]>(MOCK_MEDIA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMedia = async () => {
      setIsLoading(true);
      try {
        const items = await supabaseService.getMedia();
        // Fallback to MOCK_MEDIA if no items are found
        if (items.length > 0) {
          setMediaItems(items);
        } else {
          setMediaItems(MOCK_MEDIA);
        }
      } catch (error) {
        console.error("Error loading media:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMedia();
  }, []);

  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'Todos' || item.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const getDisplayMedia = () => {
    if (activeTab === 'MenuCast') {
      // Limit to 4 episodes for MenuCast tab
      return filteredMedia.filter(item => item.category === 'MenuCast').slice(0, 4);
    }
    return filteredMedia;
  };

  const displayMedia = getDisplayMedia();

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 pt-8 px-6">
      
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">
           <Video className="w-3 h-3" /> Central de Conteúdo
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none max-w-4xl mx-auto uppercase">
          Explore nossa <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] italic font-black">Agenda & Eventos.</span>
        </h1>
        
        <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
               type="text" 
               placeholder="Busque por podcasts, treinamentos, eventos..." 
               className="w-full pl-16 pr-6 py-5 bg-white border border-gray-100 rounded-[2.5rem] font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none shadow-xl transition-all"
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
            />
        </div>

        {/* Abas Principais */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
            {CATEGORIES.map((tab) => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as MediaType)} 
                    className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'}`}
                >
                    <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
            ))}
        </div>
      </section>

      {/* 2. CONTENT GRID (Netflix Style) */}
      <section className="min-h-[500px]">
        <div className="flex justify-between items-center mb-8 px-2">
            <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest italic">
                <Filter className="w-3.5 h-3.5" />
                Agenda <ChevronRight className="w-3 h-3" /> {activeTab}
            </div>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg">
                {displayMedia.length} RESULTADOS
            </span>
        </div>

        {displayMedia.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-gray-100">
                <Video className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-gray-900">Nenhum conteúdo encontrado</h3>
                <p className="text-gray-500 mt-2 font-medium">Tente buscar por outros termos ou mude a categoria.</p>
                <button 
                    onClick={() => {setSearchTerm(''); setActiveTab('Todos');}}
                    className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all"
                >
                    LIMPAR FILTROS
                </button>
            </div>
        ) : (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {displayMedia.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => item.category === 'Eventos' || item.category === 'Ferramentas' ? (item.link ? window.open(item.link, '_blank') : null) : setSelectedItem(item)}
                      className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full cursor-pointer"
                    >
                    <div className="relative h-48 overflow-hidden bg-black">
                        <img src={item.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100" alt={item.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        
                        {(item.category === 'MenuCast' || item.category === 'Treinamentos') && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                             <div className="w-16 h-16 bg-indigo-600/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-[0_0_30px_rgba(79,70,229,0.5)]">
                                <Play className="w-8 h-8 text-white fill-current ml-1" />
                             </div>
                          </div>
                        )}

                        <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-white border border-white/20 backdrop-blur-md ${item.category === 'Eventos' ? 'bg-orange-500/80' : item.category === 'MenuCast' ? 'bg-purple-600/80' : item.category === 'Treinamentos' ? 'bg-indigo-600/80' : 'bg-emerald-600/80'}`}>
                                {item.category}
                            </span>
                        </div>
                        
                        {item.duration && (
                          <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-white text-[10px] font-bold">
                            {item.duration}
                          </div>
                        )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                        {item.category === 'Eventos' && (
                          <div className="flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-3">
                              <Calendar className="w-3.5 h-3.5" /> {item.date}
                          </div>
                        )}
                        <h3 className="text-lg font-black text-gray-900 leading-tight mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">{item.title}</h3>
                        <p className="text-gray-500 text-xs font-medium line-clamp-2 mb-4">
                          {item.description}
                        </p>
                        
                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                            {item.category === 'Eventos' ? (
                                <span className="text-[10px] font-black text-gray-400 uppercase">Ver Detalhes</span>
                            ) : item.category === 'Ferramentas' ? (
                                <span className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1"><ExternalLink className="w-3 h-3"/> Acessar</span>
                            ) : (
                                <span className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-1"><Play className="w-3 h-3"/> Assistir</span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            </div>
            
            {activeTab === 'MenuCast' && (
                <div className="mt-16 text-center">
                    <a 
                        href="https://www.youtube.com/watch?v=CkPwk5qwUOc&list=PLZ9PlCqw0n_0Yh35js8vLprsexrdiLTVs" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-[#F67C01] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl hover:shadow-orange-600/20 hover:-translate-y-1"
                    >
                        <Play className="w-5 h-5 fill-current" /> VER MAIS EPISÓDIOS NO YOUTUBE
                    </a>
                </div>
            )}
            {/* Treinamentos button removed */}
            </>
        )}
      </section>

      {/* 3. VIDEO MODAL */}
      {selectedItem && (selectedItem.category === 'MenuCast' || selectedItem.category === 'Treinamentos') && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
           <div className="bg-zinc-900 w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden relative flex flex-col animate-scale-in border border-white/10">
              <div className="flex justify-between items-center p-6 border-b border-white/10">
                 <div>
                    <span className="bg-indigo-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-lg mr-3">
                       {selectedItem.category}
                    </span>
                    <h2 className="text-xl md:text-2xl font-black text-white inline-block align-middle">
                       {selectedItem.title}
                    </h2>
                 </div>
                 <button 
                   onClick={() => setSelectedItem(null)}
                   className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all"
                 >
                    <X className="w-6 h-6" />
                 </button>
              </div>

              <div className="aspect-video w-full bg-black">
                 {selectedItem.youtubeEmbed ? (
                   <iframe 
                     className="w-full h-full" 
                     src={selectedItem.youtubeEmbed} 
                     title={selectedItem.title} 
                     frameBorder="0" 
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                     referrerPolicy="strict-origin-when-cross-origin" 
                     allowFullScreen
                   ></iframe>
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-zinc-500">
                      Vídeo indisponível
                   </div>
                 )}
              </div>
              
              <div className="p-6 bg-zinc-900">
                 <p className="text-zinc-300 text-sm leading-relaxed">
                    {selectedItem.description}
                 </p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
