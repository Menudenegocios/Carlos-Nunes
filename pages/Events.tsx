
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Video, Ticket, ArrowRight, Sparkles, Filter, Clock, ExternalLink, Search, Play, X, Wrench, GraduationCap, Mic, ChevronRight, ChevronLeft } from 'lucide-react';
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
    id: 'menucast-ep30',
    title: "MenuCast #30 - 2026 02 05 12 21 56",
    category: "MenuCast",
    image: "https://i.ytimg.com/vi/-Bc7iURVVvY/maxresdefault.jpg",
    youtubeEmbed: "https://www.youtube.com/embed/-Bc7iURVVvY",
    description: "Episódio 30 do MenuCast"
  },
  {
    id: 'menucast-ep29',
    title: "MenuCast #29 - Faça o Instagram VENDER POR VOCÊ em 2026",
    category: "MenuCast",
    image: "https://i.ytimg.com/vi/CkPwk5qwUOc/maxresdefault.jpg",
    youtubeEmbed: "https://www.youtube.com/embed/CkPwk5qwUOc",
    description: "Faça o Instagram VENDER POR VOCÊ em 2026 sem Forçar!"
  },
  {
    id: 'menucast-ep28',
    title: "🎙️ MenuCast #28",
    category: "MenuCast",
    image: "https://i.ytimg.com/vi/rAZdjQbT6sc/maxresdefault.jpg",
    youtubeEmbed: "https://www.youtube.com/embed/rAZdjQbT6sc",
    description: "MenuCast #28"
  },
  {
    id: 'menucast-ep27',
    title: "🎙️ MenuCast #27 - Alimentação e Resultados",
    category: "MenuCast",
    image: "https://i.ytimg.com/vi/T4cYiHJr89I/maxresdefault.jpg",
    youtubeEmbed: "https://www.youtube.com/embed/T4cYiHJr89I",
    description: "Como Uma alimentação adequada pode transformar sua vida e destravar seus resultados"
  },
  {
    id: 'menucast-ep26',
    title: "🎙️ MenuCast #26 - Quem Não É Visto, Não É Lembrado",
    category: "MenuCast",
    image: "https://i.ytimg.com/vi/JlqwNK1dcrw/maxresdefault.jpg",
    youtubeEmbed: "https://www.youtube.com/embed/JlqwNK1dcrw",
    description: "“Quem Não É Visto, Não É Lembrado”"
  },
  {
    id: 'menucast-ep25',
    title: "MenuCast #25 — De um Sonho à Marca: Pulsatti",
    category: "MenuCast",
    image: "https://i.ytimg.com/vi/GtPpSLKdO8M/maxresdefault.jpg",
    youtubeEmbed: "https://www.youtube.com/embed/GtPpSLKdO8M",
    description: "De um Sonho à Marca: Como Surgiu a Pulsatti"
  },
  {
    id: 'menucast-ep24',
    title: "MenuCast #24 🎙️ Jucélia Ferreira",
    category: "MenuCast",
    image: "https://i.ytimg.com/vi/-MR0-dryTio/maxresdefault.jpg",
    youtubeEmbed: "https://www.youtube.com/embed/-MR0-dryTio",
    description: "Minhas Palavras na Tua Boca"
  },
  {
    id: 'menucast-ep23',
    title: "🎙️ MenuCast #23 - Mais que Vendas",
    category: "MenuCast",
    image: "https://i.ytimg.com/vi/MoICvGX9wt0/maxresdefault.jpg",
    youtubeEmbed: "https://www.youtube.com/embed/MoICvGX9wt0",
    description: "Mais que Vendas, uma História de Vida"
  }
];

const CATEGORIES = [
    { id: 'Todos', label: 'Todos', icon: Sparkles },
    { id: 'Eventos', label: 'Eventos', icon: Calendar },
    { id: 'MenuCast', label: 'MenuCast', icon: Mic },
];

export const Events: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MediaType>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [mediaItems, setMediaItems] = useState<any[]>(MOCK_MEDIA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [mediaItemsData, eventsData] = await Promise.all([
          supabaseService.getMedia(),
          supabaseService.getEvents()
        ]);
        
        // Normalize events from the 'events' table to match the media format
        const normalizedEvents = eventsData.map(event => ({
          ...event,
          category: 'Eventos',
          // Ensure image exists or use fallback
          image: event.image || "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800"
        }));

        const allItems = [...mediaItemsData, ...normalizedEvents];
        const mockItemsToInject = MOCK_MEDIA.filter(mock => !allItems.some(item => item.id === mock.id));

        setMediaItems([...allItems, ...mockItemsToInject]);
      } catch (error) {
        console.error("Error loading events and media:", error);
        setMediaItems(MOCK_MEDIA);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'Todos' || item.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const getDisplayMedia = () => {
    if (activeTab === 'MenuCast') {
      return filteredMedia.filter(item => item.category === 'MenuCast');
    }
    return filteredMedia;
  };

  const displayMedia = getDisplayMedia();

  if (selectedItem && selectedItem.category === 'Eventos') {
    return (
       <div className="max-w-4xl mx-auto pb-32 pt-8 px-6 animate-fade-in">
          <button 
            onClick={() => setSelectedItem(null)}
            className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-12 hover:bg-indigo-50 w-fit px-6 py-3 rounded-2xl transition-all border border-indigo-100 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" /> VOLTAR PARA A AGENDA
          </button>
          
          <article className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 relative">
              <div className="relative h-[450px] w-full">
                  <img src={selectedItem.image || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1200'} className="w-full h-full object-cover" alt={selectedItem.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent"></div>
                  <div className="absolute bottom-16 left-16 right-16">
                      <div className="flex gap-2 mb-6">
                        <span className="bg-orange-500 text-white text-[9px] font-black uppercase px-4 py-2 rounded-full inline-block tracking-widest border border-white/20 backdrop-blur-md">
                            Eventos
                        </span>
                        {selectedItem.date && (() => {
                            const eventDate = new Date(selectedItem.date);
                            const isPast = eventDate < new Date() && !isNaN(eventDate.getTime());
                            return (
                                <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-white border border-white/20 backdrop-blur-md inline-block ${isPast ? 'bg-slate-500/80' : 'bg-emerald-500/80'}`}>
                                    {isPast ? 'Já Realizado' : 'Novo Evento'}
                                </span>
                            );
                        })()}
                      </div>
                      <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                          {selectedItem.title}
                      </h1>
                  </div>
              </div>

              <div className="p-12 md:p-16">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 pb-10 border-b border-gray-100">
                      <div className="flex flex-wrap items-center gap-8 text-gray-900">
                          {selectedItem.date && <p className="font-bold flex items-center gap-2 text-lg"><Calendar className="w-5 h-5 text-indigo-600" /> {selectedItem.date}</p>}
                          {selectedItem.time && <p className="font-bold flex items-center gap-2 text-lg"><Clock className="w-5 h-5 text-indigo-600" /> {selectedItem.time}</p>}
                          {selectedItem.location && <p className="font-bold flex items-center gap-2 text-lg"><MapPin className="w-5 h-5 text-indigo-600" /> {selectedItem.location}</p>}
                          {selectedItem.price && <p className="font-bold flex items-center gap-2 text-lg"><Ticket className="w-5 h-5 text-indigo-600" /> {selectedItem.price}</p>}
                          {selectedItem.attendees && <p className="font-bold flex items-center gap-2 text-lg"><Users className="w-5 h-5 text-indigo-600" /> {selectedItem.attendees} confirmados</p>}
                      </div>
                  </div>

                  <div className="prose prose-xl max-w-none mb-12">
                      <div className="text-gray-700 leading-relaxed text-lg font-medium whitespace-pre-wrap">
                          {selectedItem.description}
                      </div>
                  </div>

                  {(selectedItem.link || selectedItem.external_link) && (
                      <div className="flex justify-center mt-12 pt-12 border-t border-gray-100">
                          <a 
                              href={selectedItem.link || selectedItem.external_link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="bg-brand-primary text-white px-12 py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-3"
                          >
                              ACESSAR EVENTO <ExternalLink className="w-5 h-5" />
                          </a>
                      </div>
                  )}
              </div>
          </article>
       </div>
    );
  }

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
                      onClick={() => item.category === 'Ferramentas' ? (item.link ? window.open(item.link, '_blank') : null) : setSelectedItem(item)}
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

                        <div className="absolute top-4 left-4 flex gap-2">
                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-white border border-white/20 backdrop-blur-md ${item.category === 'Eventos' ? 'bg-orange-500/80' : 'bg-purple-600/80'}`}>
                                {item.category}
                            </span>
                            {item.category === 'Eventos' && item.date && (() => {
                                const eventDate = new Date(item.date);
                                const isPast = eventDate < new Date() && !isNaN(eventDate.getTime());
                                return (
                                   <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-white border border-white/20 backdrop-blur-md ${isPast ? 'bg-slate-500/80' : 'bg-emerald-500/80'}`}>
                                       {isPast ? 'Já Realizado' : 'Novo Evento'}
                                   </span>
                                );
                            })()}
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
