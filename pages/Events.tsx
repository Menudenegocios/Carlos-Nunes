
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
    <div className="max-w-7xl mx-auto space-y-16 pb-32 pt-8 px-6">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-gray-900 rounded-[4rem] p-12 md:p-24 text-white overflow-hidden shadow-2xl">
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
               <Calendar className="w-3 h-3 text-indigo-400" /> Agenda de Experiências
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              Conecte-se <br/><span className="text-indigo-400">ao Vivo.</span>
            </h1>
            <p className="text-xl text-gray-400 font-medium leading-relaxed">
              De workshops técnicos a encontros de networking. Participe de eventos criados para acelerar seu negócio e sua rede de contatos.
            </p>
            <div className="flex gap-4">
               <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20">
                  VER CALENDÁRIO
               </button>
               <button className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all">
                  CRIAR MEU EVENTO
               </button>
            </div>
          </div>
          <div className="hidden lg:block relative">
             <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[3rem] p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden group">
                <div className="relative z-10">
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Próximo Evento Principal</p>
                   <h3 className="text-3xl font-black leading-tight">Summit Menu ADS 2025: O Futuro é Local</h3>
                </div>
                <div className="relative z-10 flex justify-between items-end">
                   <div className="flex gap-4">
                      <div>
                         <p className="text-2xl font-black">150</p>
                         <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Vagas Restantes</p>
                      </div>
                      <div className="w-px h-8 bg-white/20"></div>
                      <div>
                         <p className="text-2xl font-black">Jan</p>
                         <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Mês</p>
                      </div>
                   </div>
                   <div className="p-4 bg-white rounded-2xl text-indigo-600 shadow-xl group-hover:scale-110 transition-transform cursor-pointer">
                      <ArrowRight className="w-6 h-6" />
                   </div>
                </div>
                <Sparkles className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10" />
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
      </section>

      {/* 2. FILTERS & HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-gray-100 pb-10">
         <div className="space-y-2">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Experiências para você</h2>
            <p className="text-gray-500 font-medium">Filtre por tipo de evento ou data.</p>
         </div>
         <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-sm">
               <Filter className="w-4 h-4" /> Todos
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all">
               <Video className="w-4 h-4" /> Online
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all">
               <MapPin className="w-4 h-4" /> Presencial
            </button>
         </div>
      </div>

      {/* 3. EVENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {MOCK_EVENTS.map(event => (
          <div key={event.id} className="group bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
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
                     <Users className="w-4 h-4 text-gray-400" /> {event.attendees} pessoas inscritas
                  </div>
               </div>

               <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                  <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Investimento</p>
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

      {/* 4. NEWSLETTER / COMMUNITY CTA */}
      <section className="bg-indigo-600 rounded-[4rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
            <h2 className="text-4xl font-black tracking-tight">Fique por dentro de tudo.</h2>
            <p className="text-indigo-100 text-lg font-medium leading-relaxed">Não perca a chance de se inscrever nos eventos mais disputados. Receba alertas de novos meetups direto no seu WhatsApp.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
               <input type="text" placeholder="Seu Telefone" className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 placeholder:text-indigo-200 text-white font-bold focus:ring-2 focus:ring-white outline-none flex-1" />
               <button className="bg-white text-indigo-600 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-gray-50 transition-all">ATIVAR ALERTAS</button>
            </div>
         </div>
         {/* Abstract Decor */}
         <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-[80px] -mb-40 -ml-40"></div>
      </section>

    </div>
  );
};
