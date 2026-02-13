
import React from 'react';
import { Calendar, MapPin, Users, Video, Ticket, ArrowRight, Sparkles, Filter, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_EVENTS = [
  {
    id: 1,
    title: "Workshop: Vendas no WhatsApp Pro",
    date: "22 Outubro, 2024",
    time: "19:00",
    location: "Online (Google Meet)",
    type: "Webinar",
    image: "https://images.unsplash.com/photo-1591115765373-520b7a6f7104?auto=format&fit=crop&q=80&w=800",
    price: "Grátis para Membros",
    attendees: 156
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
    attendees: 45
  },
  {
    id: 3,
    title: "Mentoria Coletiva: IA no Negócio",
    date: "05 Dezembro, 2024",
    time: "20:00",
    location: "Online (Menu Academy)",
    type: "Mentoria",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
    price: "Plano Pro",
    attendees: 89
  }
];

export const Events: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-24 pb-32 pt-8 px-6">
      
      {/* 1. HERO SECTION (PARTNERS STYLE) */}
      <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">
           <Calendar className="w-3 h-3" /> Agenda de Experiências
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none max-w-4xl mx-auto">
          Conecte-se e <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Aprenda ao Vivo.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
          De workshops técnicos a encontros de networking. Participe dos eventos que estão transformando o mercado local.
        </p>
        <div className="flex justify-center gap-4">
           <button className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl">
              VER CALENDÁRIO
           </button>
           <button className="bg-white text-gray-900 border border-gray-100 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
              CRIAR EVENTO
           </button>
        </div>
      </section>

      {/* 2. FILTERS & GRID (BENTO STYLE) */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-10">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Próximos Encontros</h2>
            <div className="flex gap-2">
                <button className="flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-xs uppercase tracking-widest"><Filter className="w-4 h-4" /> Todos</button>
                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 text-gray-500 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-50">Online</button>
                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 text-gray-500 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-50">Presencial</button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {MOCK_EVENTS.map(event => (
            <div key={event.id} className="group bg-white rounded-[3rem] border border-gray-100 shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
                <div className="relative h-56 overflow-hidden">
                    <img src={event.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={event.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-6 left-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/20 backdrop-blur-md ${event.type === 'Presencial' ? 'bg-orange-500/50' : 'bg-indigo-600/50'}`}>
                            {event.type}
                        </span>
                    </div>
                </div>
                <div className="p-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
                        <Clock className="w-3.5 h-3.5" /> {event.date} às {event.time}
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 leading-tight mb-6 group-hover:text-indigo-600 transition-colors">{event.title}</h3>
                    
                    <div className="space-y-4 mb-10 text-gray-500 text-sm font-medium">
                        <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-gray-400" /> {event.location}
                        </div>
                        <div className="flex items-center gap-3">
                            <Users className="w-4 h-4 text-gray-400" /> {event.attendees} inscritos
                        </div>
                    </div>

                    <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Investimento</p>
                            <p className="text-xl font-black text-gray-900">{event.price}</p>
                        </div>
                        <button className="bg-gray-900 text-white p-4 rounded-2xl group-hover:bg-indigo-600 transition-all shadow-xl">
                            <Ticket className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
            ))}
        </div>
      </section>

      {/* 3. NEWSLETTER BLOCK (MATCHING PARTNERS) */}
      <section className="bg-white rounded-[4rem] p-12 md:p-24 border border-gray-100 shadow-2xl relative overflow-hidden text-center">
         <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Não perca o próximo meetup.</h2>
            <p className="text-gray-500 font-medium text-lg">Inscreva-se para receber a agenda mensal de eventos e workshops direto no seu WhatsApp.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto pt-4">
               <input type="text" placeholder="Seu WhatsApp" className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 placeholder:text-gray-400 text-gray-900 font-bold focus:ring-2 focus:ring-indigo-100 outline-none flex-1" />
               <button className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all">ATIVAR ALERTAS</button>
            </div>
         </div>
         <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[80px] -mb-40 -ml-40"></div>
      </section>
    </div>
  );
};
