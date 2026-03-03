
import React from 'react';
import { Calendar, MapPin, Users, Video, Ticket, ArrowRight, Sparkles, Filter, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_EVENTS = [
  {
    id: 'mn-conexoes-2024',
    title: "Menu de Negócios – Conexões & Negócios",
    date: "18 Março, 2024",
    time: "19:00",
    location: "Bourbon Teresópolis",
    type: "Networking",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800",
    price: "Inscrição via Sympla",
    attendees: 120,
    link: "https://www.sympla.com.br/evento/menu-de-negocios/3287623",
    description: "Prepare-se para uma experiência transformadora que vai muito além do networking tradicional. Um evento criado para empreendedores que querem gerar oportunidades reais, fortalecer parcerias estratégicas e acelerar resultados.\n\nVivencie a palestra 'Por Que Eu Vendo?' com Juarez Filho, dinâmicas de conexão estratégica e a oportunidade exclusiva de realizar seu Pitch de 1 minuto para toda a audiência."
  },
  {
    id: 1,
    title: "Workshop: Vendas no WhatsApp Pro",
    date: "22 Outubro, 2024",
    time: "19:00",
    location: "Online (Google Meet)",
    type: "Webinar",
    image: "https://images.unsplash.com/photo-1591115765373-520b7a6f7104?auto=format&fit=crop&q=80&w=800",
    price: "Grátis para Membros",
    attendees: 156,
    description: "Aprenda estratégias avançadas de fechamento e automação para o seu WhatsApp Business."
  },
  {
    id: 2,
    title: "Meetup Empreendedores Locais SP",
    date: "10 Novembro, 2024",
    time: "15:00",
    location: "Avenida Paulista, 1000 - SP",
    type: "Presencial",
    image: "https://images.unsplash.com/photo-1540575861501-7c0351a77039?auto=format&fit=crop&q=80&w=800",
    price: "R$ 49,90",
    attendees: 45,
    description: "Encontro presencial para networking e troca de experiências entre lojistas da capital."
  }
];

export const Events: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-24 pb-32 pt-8 px-6">
      
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-brand-primary rounded-full text-[10px] font-black uppercase tracking-widest">
           <Calendar className="w-3 h-3" /> Agenda de Experiências
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-none max-w-4xl mx-auto">
          Conecte-se e <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] dark:from-brand-primary dark:to-brand-accent">Aprenda ao Vivo.</span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed">
          De workshops técnicos a encontros de networking. Participe dos eventos que estão transformando o mercado local.
        </p>
      </section>

      {/* 2. FILTERS & GRID */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 dark:border-zinc-800 pb-10">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Próximos Encontros</h2>
            <div className="flex gap-2">
                <button className="flex items-center gap-2 px-6 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-brand-primary rounded-xl font-bold text-xs tracking-tight"><Filter className="w-4 h-4" /> Todos</button>
                <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 text-gray-500 dark:text-zinc-400 rounded-xl font-bold text-xs tracking-tight hover:bg-gray-50 dark:hover:bg-zinc-700">Online</button>
                <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 text-gray-500 dark:text-zinc-400 rounded-xl font-bold text-xs tracking-tight hover:bg-gray-50 dark:hover:bg-zinc-700">Presencial</button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {MOCK_EVENTS.map(event => (
            <div key={event.id} className="group bg-white dark:bg-zinc-900 rounded-[3rem] border border-gray-100 dark:border-zinc-800 shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
                <div className="relative h-56 overflow-hidden">
                    <img src={event.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={event.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-6 left-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/20 backdrop-blur-md ${event.type === 'Presencial' || event.type === 'Networking' ? 'bg-orange-500/50' : 'bg-indigo-600/50'}`}>
                            {event.type}
                        </span>
                    </div>
                </div>
                <div className="p-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-brand-primary text-[10px] font-black uppercase tracking-widest mb-4">
                        <Clock className="w-3.5 h-3.5" /> {event.date} às {event.time}
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-4 group-hover:text-indigo-600 transition-colors">{event.title}</h3>
                    
                    <p className="text-gray-500 dark:text-zinc-400 text-sm font-medium mb-6 line-clamp-3">
                      {event.description}
                    </p>

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
                            <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase mb-1">Status</p>
                            <p className="text-xl font-black text-gray-900 dark:text-white">{event.price}</p>
                        </div>
                        {(event as any).link ? (
                          <a 
                            href={(event as any).link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-[#F67C01] text-white p-4 rounded-2xl hover:bg-orange-600 transition-all shadow-xl flex items-center gap-2"
                          >
                            <Ticket className="w-5 h-5" />
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <button className="bg-gray-900 dark:bg-brand-primary text-white p-4 rounded-2xl group-hover:bg-indigo-600 transition-all shadow-xl">
                              <Ticket className="w-5 h-5" />
                          </button>
                        )}
                    </div>
                </div>
            </div>
            ))}
        </div>
      </section>

      {/* 3. NEWSLETTER BLOCK */}
      <section className="bg-white dark:bg-zinc-900 rounded-[4rem] p-12 md:p-24 border border-gray-100 dark:border-zinc-800 shadow-2xl relative overflow-hidden text-center">
         <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Não perca o próximo meetup.</h2>
            <p className="text-gray-500 dark:text-zinc-400 font-medium text-lg">Inscreva-se para receber a agenda mensal de eventos e workshops direto no seu WhatsApp.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto pt-4">
               <input type="text" placeholder="Seu WhatsApp" className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl px-6 py-4 placeholder:text-gray-400 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-100 outline-none flex-1" />
               <button className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all">ATIVAR ALERTAS</button>
            </div>
         </div>
         <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[80px] -mb-40 -ml-40"></div>
      </section>
    </div>
  );
};
