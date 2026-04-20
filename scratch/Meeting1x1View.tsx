import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Trophy, Calendar, Clock, Video, 
  MessageCircle, CheckCircle, X, Search 
} from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { User, Meeting1x1 } from '../types';

export const Meeting1x1View = ({ user }: { user: User }) => {
  const [meetings, setMeetings] = useState<Meeting1x1[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    guest_id: '',
    date: '',
    time: '',
    title: '',
    description: '',
    meet_link: ''
  });

  useEffect(() => {
    loadData();
  }, [user.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [meetingsData, profilesData, rankingData] = await Promise.all([
        supabaseService.getMeetings1x1(user.id),
        supabaseService.getAllProfiles(),
        supabaseService.getMeetingsRanking()
      ]);
      setMeetings(meetingsData);
      setProfiles(profilesData.filter(p => p.user_id !== user.id));
      setRanking(rankingData);
    } catch (error: any) {
       console.error("Error loading meeting data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.guest_id || !formData.date || !formData.time || !formData.title) {
      alert("Por favor, preencha os campos obrigatórios.");
      return;
    }

    try {
      const meetLink = `https://meet.google.com/${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
      
      await supabaseService.createMeeting1x1({
        creator_id: user.id,
        guest_id: formData.guest_id,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        meet_link: formData.meet_link || meetLink
      });

      setIsModalOpen(false);
      setFormData({ guest_id: '', date: '', time: '', title: '', description: '', meet_link: '' });
      loadData();
    } catch (error: any) {
      console.error("Error creating meeting:", error);
      alert("Erro ao agendar reunião.");
    }
  };

  const handleComplete = async (mId: string) => {
    if (!window.confirm("Confirmar que a reunião foi realizada? (Isso atribuirá 10 pontos aos participantes)")) return;
    try {
      await supabaseService.completeMeeting1x1(mId);
      loadData();
    } catch (error: any) {
      alert("Erro ao concluir reunião.");
    }
  };

  const shareOnWhatsApp = (meeting: Meeting1x1) => {
    const guestName = (meeting as any).guest?.business_name || (meeting as any).guest?.name || "Convidado";
    const creatorName = user.business_name || user.name;
    
    const text = `📅 *Reunião 1x1 agendada!*

👤 *Participantes*: ${creatorName} + ${guestName}
⏰ *Horário*: ${new Date(meeting.date + 'T00:00:00').toLocaleDateString('pt-BR')} às ${meeting.time}

🔗 *Link da reunião*: ${meeting.meet_link}

Confirme sua presença 👇
https://menudenegocios.com/`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filteredProfiles = profiles.filter((p: any) => 
    (p.business_name || p.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: meetings.filter((m: any) => m.status === 'completed').length,
    points: meetings.filter((m: any) => m.status === 'completed' && m.points_awarded).length * 10
  };

  const userRank = ranking.findIndex((r: any) => r.user_id === user.id) + 1;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Intro & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl overflow-hidden relative group">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Reunião 1x1</h2>
                <p className="text-slate-500 text-sm font-medium mt-1">Conecte-se diretamente e ganhe autoridade.</p>
              </div>
            </div>
            
            <p className="text-slate-600 leading-relaxed mb-8 max-w-xl">
              O objetivo é facilitar conexões diretas entre usuários, acompanhar o fluxo de reuniões realizadas e gerar engajamento com pontuação e ranking mensal.
            </p>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
              >
                <Plus className="w-4 h-4" /> CRIAR REUNIÃO
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-slate-800 rounded-[3rem] p-10 text-white shadow-xl flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Seu Desempenho</span>
               <Trophy className="w-6 h-6 text-brand-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-3xl font-black">{stats.total}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Reuniões Feitas</p>
              </div>
              <div>
                <p className="text-3xl font-black text-brand-primary">+{stats.points}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Pontos Acumulados</p>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-white/10 mt-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-slate-300">Sua posição no ranking:</span>
              <span className="text-xl font-black italic">#{userRank || '--'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Agenda da Semana */}
        <div className="lg:col-span-8 space-y-8">
           <div className="flex items-center justify-between">
             <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter flex items-center gap-3">
               <Calendar className="text-indigo-600" /> Agenda da Semana
             </h3>
           </div>

           {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[1,2].map(i => <div key={i} className="h-48 bg-gray-100 rounded-[2.5rem] animate-pulse"></div>)}
             </div>
           ) : meetings.length === 0 ? (
             <div className="py-20 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Nenhuma reunião agendada na sua agenda.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {meetings.map((m: any) => {
                 const isCreator = m.creator_id === user.id;
                 const partner = isCreator ? (m as any).guest : (m as any).creator;
                 const partnerName = partner?.business_name || partner?.name || "Membro";
                 
                 return (
                   <div key={m.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                     <div className="flex justify-between items-start mb-6">
                        <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${m.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                          {m.status === 'completed' ? 'Concluída' : 'Agendada'}
                        </div>
                        <span className="text-[10px] font-black text-slate-300 italic">#{m.id.substring(0,4)}</span>
                     </div>
                     
                     <h4 className="text-xl font-black text-gray-900 mb-2 truncate">{m.title}</h4>
                     <div className="flex items-center gap-3 mb-6">
                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${partnerName}`} className="w-8 h-8 rounded-lg shadow-sm" alt="Partner" />
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Conector</p>
                          <p className="text-sm font-bold text-gray-700">{partnerName}</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-6 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Data</span>
                          <span className="text-sm font-black text-gray-900 italic">{new Date(m.date + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="w-px h-8 bg-slate-200"></div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Horário</span>
                          <span className="text-sm font-black text-gray-900 italic">{m.time}</span>
                        </div>
                     </div>

                     <div className="space-y-3">
                        {m.status === 'scheduled' && (
                          <div className="grid grid-cols-2 gap-3">
                            <a 
                              href={m.meet_link} 
                              target="_blank" 
                              className="flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-md"
                            >
                              <Video className="w-3 h-3" /> ENTRAR
                            </a>
                            <button 
                              onClick={() => shareOnWhatsApp(m)}
                              className="flex items-center justify-center gap-2 bg-emerald-500 text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-md"
                            >
                              <MessageCircle className="w-3 h-3 font-bold" /> WHATSAPP
                            </button>
                          </div>
                        )}
                        {m.status === 'scheduled' && (
                          <button 
                            onClick={() => handleComplete(m.id)}
                            className="w-full flex items-center justify-center gap-2 bg-white text-emerald-600 border border-emerald-200 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-emerald-50 transition-all active:scale-95"
                          >
                            <CheckCircle className="w-3 h-3" /> MARCAR COMO CONCLUÍDA
                          </button>
                        )}
                        {m.status === 'completed' && (
                          <div className="w-full py-3 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[9px] text-center uppercase tracking-widest">
                            +10 PONTOS ATRIBUÍDOS
                          </div>
                        )}
                     </div>
                   </div>
                 );
               })}
             </div>
           )}
        </div>

        {/* Ranking Mensal */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl relative overflow-hidden">
              <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter flex items-center gap-3 mb-8">
                <Trophy className="text-brand-primary" /> Top Conectores
              </h3>

              <div className="space-y-4">
                {ranking.slice(0, 5).map((member: any, i: number) => (
                   <div key={member.user_id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-indigo-100 transition-all">
                      <div className="flex items-center gap-4">
                        <span className={`font-black text-sm italic w-4 ${i === 0 ? 'text-yellow-500' : 'text-slate-300'}`}>#{i + 1}</span>
                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.business_name || member.name}`} className="w-10 h-10 rounded-xl shadow-sm" alt="Avatar" />
                        <div>
                          <p className="text-[11px] font-black text-gray-900 leading-none">{member.business_name || member.name}</p>
                          <p className="text-[8px] font-black text-indigo-600 uppercase mt-1">Nível {member.level || 'Expert'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-gray-900 text-xs">{member.points}</span>
                        <span className="text-[8px] text-slate-400 font-bold ml-1 uppercase">PTS</span>
                      </div>
                   </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-50">
                 <div className="bg-indigo-600 rounded-2xl p-6 text-white text-center shadow-lg relative overflow-hidden">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Dica de Autoridade</p>
                    <p className="text-xs font-medium leading-relaxed italic">"Cada reunião concluída gera 10 pontos de autoridade no ranking."</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* MODAL: CRIAR REUNIÃO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden animate-scale-in">
             <div className="bg-gray-900 p-8 text-white flex justify-between items-center">
                <div>
                   <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Agendar 1x1</h3>
                   <p className="text-[9px] font-black text-indigo-400 tracking-[0.2em] mt-2 uppercase">Conecte-se com um novo parceiro</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-all text-white/40 hover:text-white">
                  <X className="w-8 h-8" />
                </button>
             </div>

             <form onSubmit={handleCreateMeeting} className="p-10 space-y-6">
                
                {/* Selecionar Usuário */}
                <div>
                   <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Selecione o Parceiro (Obrigatório)</label>
                   <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        type="text"
                        placeholder="Buscar por nome ou negócio..."
                        className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-indigo-500/10 transition-all mb-3"
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                      />
                   </div>
                   <div className="max-h-40 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                      {filteredProfiles.length === 0 ? (
                        <p className="text-[10px] text-center text-slate-400 py-4 uppercase font-bold italic">Nenhum parceiro encontrado</p>
                      ) : (
                        filteredProfiles.map((p: any) => (
                          <button
                            key={p.user_id}
                            type="button"
                            onClick={() => {
                              setFormData({...formData, guest_id: p.user_id});
                              setSearchTerm(p.business_name || p.name);
                            }}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${formData.guest_id === p.user_id ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}
                          >
                             <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${p.business_name || p.name}`} className="w-8 h-8 rounded-lg" alt="Avatar" />
                             <div className="text-left">
                                <p className="text-[11px] font-black text-gray-900 leading-none">{p.business_name || p.name}</p>
                                <p className="text-[8px] font-black text-slate-400 uppercase mt-1">{p.sector || 'Parceiro Network'}</p>
                             </div>
                             {formData.guest_id === p.user_id && <CheckCircle className="ml-auto w-4 h-4 text-indigo-600" />}
                          </button>
                        ))
                      )}
                   </div>
                </div>

                <div>
                   <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Título da Reunião</label>
                   <input 
                      required
                      type="text" 
                      placeholder="Ex: Alinhamento de Parceria Estratégica"
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-sm" 
                      value={formData.title} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, title: e.target.value})} 
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Data</label>
                      <input 
                        required
                        type="date" 
                        className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-sm" 
                        value={formData.date} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, date: e.target.value})} 
                      />
                   </div>
                   <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Horário</label>
                      <input 
                        required
                        type="time" 
                        className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-sm" 
                        value={formData.time} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, time: e.target.value})} 
                      />
                   </div>
                </div>

                 <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Link da Reunião (Google Meet)</label>
                    <input 
                       type="text" 
                       placeholder="https://meet.google.com/..."
                       className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-sm" 
                       value={formData.meet_link} 
                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, meet_link: e.target.value})} 
                    />
                 </div>

                 <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Descrição (Opcional)</label>
                    <textarea 
                       rows={3}
                       placeholder="Sobre o que vamos conversar?"
                       className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-sm resize-none" 
                       value={formData.description} 
                       onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, description: e.target.value})} 
                    />
                 </div>

                <button type="submit" className="w-full bg-indigo-600 text-white font-black py-6 rounded-[2rem] shadow-2xl uppercase tracking-widest text-xs hover:bg-brand-primary transition-all active:scale-95 mt-4">
                  CONFIRMAR AGENDAMENTO
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};
