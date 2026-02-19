
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { 
  Trophy, Gift, TrendingUp, Star,
  Zap, Crown, ChevronRight,
  CheckCircle, ListTodo, Medal, Home as HomeIcon,
  Award, Rocket, Users, ArrowUp, Sparkles, ShoppingBag, Clock,
  Ticket, Wand2, Handshake, Plus, Search, ArrowRight, X, RefreshCw
} from 'lucide-react';
import { Prize, PointsTransaction, User, B2BOffer } from '../types';
import { SectionLanding } from '../components/SectionLanding';

export const Rewards: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'acceleration' | 'missions' | 'match' | 'ranking'>('home');

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 pt-4 px-4">
      {/* Header Estilo Unificado Menu Club */}
      <div className="bg-[#0F172A] dark:bg-black rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-indigo-500/10 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-xl">
                 <Trophy className="h-10 w-10 text-brand-primary" />
              </div>
              <div>
                 <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-2">
                    Menu <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] dark:from-brand-primary dark:to-brand-accent italic uppercase">Club</span>
                 </h1>
                 <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">TRANSFORME SUA ATIVIDADE EM CRESCIMENTO REAL.</p>
              </div>
            </div>
            
            <div className="flex gap-6">
               <div className="bg-white/5 backdrop-blur-xl p-4 md:p-6 rounded-[2.2rem] border border-white/10 shadow-xl flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest leading-none mb-1">Seu Saldo</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-3xl font-black text-white">{user.points}</span>
                      <Zap className="w-5 h-5 text-brand-primary fill-current" />
                    </div>
                  </div>
               </div>
               <div className="bg-white/5 backdrop-blur-xl p-4 md:p-6 rounded-[2.2rem] border border-white/10 shadow-xl flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Seu Nível</p>
                    <span className="text-2xl font-black text-white uppercase italic">{user.level}</span>
                  </div>
                  <Crown className="w-8 h-8 text-indigo-400 fill-current" />
               </div>
            </div>
          </div>

          <div className="flex p-1.5 mt-12 bg-white/5 backdrop-blur-md rounded-[2.2rem] border border-white/10 w-fit overflow-x-auto scrollbar-hide gap-1">
              {[
                  { id: 'home', label: 'INÍCIO', desc: 'Destaques', icon: HomeIcon },
                  { id: 'acceleration', label: 'NÍVEIS', desc: 'Sua autoridade', icon: Zap },
                  { id: 'missions', label: 'MISSÕES', desc: 'Ganhar pontos', icon: ListTodo },
                  { id: 'match', label: 'MATCH', desc: 'Parcerias B2B', icon: Handshake },
                  { id: 'ranking', label: 'RANKING', desc: 'Competição', icon: Medal },
              ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)} 
                    className={`flex flex-col items-center justify-center min-w-[120px] px-8 py-3 rounded-[1.6rem] transition-all duration-300 whitespace-nowrap ${activeTab === tab.id ? 'bg-[#F67C01] text-white shadow-xl scale-105' : 'text-slate-400 hover:bg-white/10'}`}
                  >
                      <div className="flex items-center gap-2 mb-0.5">
                        <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-white' : 'text-brand-primary'}`} />
                        <span className="font-black text-[10px] tracking-widest uppercase italic">{tab.label}</span>
                      </div>
                      <span className={`text-[8px] font-medium opacity-60 ${activeTab === tab.id ? 'text-white' : ''}`}>{tab.desc}</span>
                  </button>
              ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'home' && (
            <SectionLanding 
                title="Sua Atividade é a sua Melhor Propaganda."
                subtitle="Clube de Vantagens"
                description="O Menu Club recompensa seu engajamento com pontos que podem ser trocados por visibilidade extra e parcerias estratégicas no seu negócio."
                benefits={[
                "Suba de nível e ganhe prioridade no diretório de lojas.",
                "Ganhe pontos ao atualizar seu catálogo e bio.",
                "Crie e encontre parcerias exclusivas na aba MATCH.",
                "Participe do ranking local do seu bairro.",
                "Desbloqueie selos de verificado para seu perfil."
                ]}
                youtubeId="dQw4w9WgXcQ"
                ctaLabel="VER MINHAS MISSÕES"
                onStart={() => setActiveTab('missions')}
                icon={Trophy}
                accentColor="brand"
            />
        )}

        {activeTab === 'acceleration' && <LevelsView user={user} />}
        {activeTab === 'missions' && <MissionsView />}
        {activeTab === 'match' && <B2BMatchView user={user} />}
        {activeTab === 'ranking' && <RankingView />}
      </div>
    </div>
  );
};

const B2BMatchView = ({ user }: { user: User }) => {
  const [offers, setOffers] = useState<B2BOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: '',
    category: 'Serviços',
    terms: ''
  });

  useEffect(() => { 
    loadOffers(); 
  }, []);

  const loadOffers = async () => {
    setIsLoading(true);
    try {
      const data = await mockBackend.getB2BOffers();
      setOffers(data);
    } finally { 
      setIsLoading(false); 
    }
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const newOffer = await mockBackend.createB2BOffer({
        ...formData,
        userId: user.id,
        businessName: user.name,
        businessLogo: `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
      });
      // Atualiza a lista local imediatamente para visualização instantânea
      setOffers(prev => [newOffer, ...prev]);
      setIsModalOpen(false);
      setFormData({ title: '', description: '', discount: '', category: 'Serviços', terms: '' });
    } catch (err) {
      console.error("Erro ao publicar:", err);
      alert("Erro ao publicar oportunidade. Tente novamente.");
    } finally { 
      setIsSaving(false); 
    }
  };

  const filteredOffers = offers.filter(o => 
    o.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-fade-in">
       <div className="bg-indigo-600 rounded-[3rem] p-10 md:p-12 text-white relative overflow-hidden shadow-xl mb-12">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="space-y-4 max-w-xl">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter">Explorar Match B2B</h3>
                <p className="text-indigo-100 font-medium">Crie conexões diretas com outros empresários da rede e aproveite benefícios exclusivos de colaboração.</p>
             </div>
             <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-white text-indigo-600 px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-3 active:scale-95"
             >
                <Plus className="w-5 h-5" /> PUBLICAR OPORTUNIDADE
             </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
       </div>

       <div className="max-w-xl mx-auto relative mb-12">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
             type="text" 
             placeholder="Filtrar parceiros por serviço ou nome..." 
             className="w-full pl-14 pr-6 py-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl font-bold shadow-sm focus:ring-4 focus:ring-indigo-50 outline-none transition-all dark:text-white"
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
          />
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
             [1,2,3].map(i => <div key={i} className="h-64 bg-gray-100 dark:bg-zinc-800 rounded-[2.5rem] animate-pulse"></div>)
          ) : filteredOffers.length === 0 ? (
             <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-zinc-800/20 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-zinc-800">
                <Handshake className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest">Nenhuma oportunidade de match encontrada.</p>
             </div>
          ) : filteredOffers.map(offer => (
             <div key={offer.id} className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                   <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 overflow-hidden border-2 border-white dark:border-zinc-800 shadow-md">
                      <img src={offer.businessLogo} className="w-full h-full object-cover" alt="Logo" />
                   </div>
                   <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-900 uppercase">
                      {offer.discount}
                   </span>
                </div>
                <div className="flex-1 space-y-3">
                   <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight line-clamp-1">{offer.title}</h3>
                   <p className="text-[10px] text-indigo-600 dark:text-brand-primary font-black uppercase tracking-widest">{offer.businessName}</p>
                   <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed line-clamp-2">{offer.description}</p>
                </div>
                <button className="mt-8 w-full py-4 bg-gray-900 dark:bg-zinc-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all active:scale-95">
                   SOLICITAR CONEXÃO <ArrowRight className="w-3 h-3" />
                </button>
             </div>
          ))}
       </div>

       {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
             <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-white/5 animate-scale-in">
                 <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                     <div>
                         <h3 className="text-2xl font-black uppercase italic tracking-tighter">Publicar Oportunidade</h3>
                         <p className="text-[10px] font-black text-[#F67C01] tracking-widest mt-1 uppercase">Sua oferta ficará visível na aba MATCH</p>
                     </div>
                     <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                 </div>
                 <form onSubmit={handleCreateOffer} className="p-10 space-y-6">
                     <div>
                         <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 text-left">Título da Oportunidade</label>
                         <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ex: Parceria em Gestão de Redes Sociais" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 text-left">Benefício / Desconto</label>
                             <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} placeholder="Ex: 15% OFF ou Consultoria Grátis" />
                         </div>
                         <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 text-left">Categoria B2B</label>
                             <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                 <option>Serviços</option>
                                 <option>Insumos</option>
                                 <option>Tecnologia</option>
                                 <option>Marketing</option>
                             </select>
                         </div>
                     </div>
                     <div>
                         <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 text-left">O que você está oferecendo?</label>
                         <textarea required rows={3} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-medium text-sm dark:text-white resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Descreva os detalhes da parceria..." />
                     </div>
                     <button type="submit" disabled={isSaving} className="w-full bg-[#F67C01] text-white font-black py-5 rounded-[2rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-orange-600 transition-all">
                         {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'PUBLICAR OPORTUNIDADE AGORA'}
                     </button>
                 </form>
             </div>
          </div>
       )}
    </div>
  );
};

const LevelsView = ({ user }: { user: User }) => {
  const levels = [
    { name: 'Bronze', points: 'Iniciante', color: 'bg-orange-900', benefits: ['Perfil visível no diretório', 'Acesso ao Blog', 'Bio Digital Básica'] },
    { name: 'Prata', points: '500 pts', color: 'bg-slate-400', benefits: ['Destaque 2x maior na busca', 'Selo de Membro Prata', 'Acesso ao Menu Academy fundamental'] },
    { name: 'Ouro', points: '2.000 pts', color: 'bg-yellow-500', benefits: ['Destaque Prioritário Máximo', 'Selo de Verificado Oficial', 'Prioridade no suporte humano'] }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
      {levels.map((level, i) => (
        <div key={i} className={`bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border-2 shadow-sm transition-all ${user.level.toLowerCase() === level.name.toLowerCase() ? 'border-brand-primary ring-8 ring-brand-primary/5' : 'border-gray-100 dark:border-zinc-800 opacity-60'}`}>
           <div className={`w-14 h-14 rounded-2xl ${level.color} mb-6 flex items-center justify-center text-white shadow-xl`}>
              <Award className="w-8 h-8" />
           </div>
           <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic mb-1">{level.name}</h3>
           <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-8">{level.points}</p>
           
           <ul className="space-y-4">
              {level.benefits.map((b, j) => (
                <li key={j} className="flex gap-3 text-sm font-medium text-gray-500 dark:text-zinc-400">
                   <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /> {b}
                </li>
              ))}
           </ul>
           {user.level.toLowerCase() === level.name.toLowerCase() && (
             <div className="mt-10 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 py-3 rounded-2xl text-center font-black text-[10px] uppercase tracking-widest">
                NÍVEL ATIVO
             </div>
           )}
        </div>
      ))}
    </div>
  );
};

const MissionsView = () => {
  const missions = [
    { title: 'Atualizar Catálogo', desc: 'Adicione ou edite 1 produto hoje.', pts: 50, icon: ShoppingBag },
    { title: 'Mural da Comunidade', desc: 'Faça uma postagem no mural.', pts: 20, icon: Users },
    { title: 'Compartilhar Bio', desc: 'Receba 10 cliques no seu link.', pts: 100, icon: Rocket },
    { title: 'Primeira Venda', desc: 'Feche um negócio via WhatsApp.', pts: 200, icon: Zap }
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] p-10 md:p-16 border border-gray-100 dark:border-zinc-800 shadow-xl space-y-12 animate-fade-in">
       <div className="flex justify-between items-end">
          <div>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Missões do Dia</h3>
            <p className="text-slate-500 font-medium mt-1">Complete tarefas e ganhe autoridade no bairro.</p>
          </div>
          <div className="bg-gray-50 dark:bg-zinc-800 px-6 py-3 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
             Reseta em: <span className="text-gray-900 dark:text-white">14:22:10</span>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {missions.map((m, i) => (
             <div key={i} className="group p-8 bg-gray-50/50 dark:bg-zinc-800/40 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 flex items-center justify-between hover:bg-white dark:hover:bg-zinc-800 hover:shadow-xl transition-all cursor-pointer">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                      <m.icon className="w-7 h-7" />
                   </div>
                   <div>
                      <h4 className="font-black text-gray-900 dark:text-white text-lg leading-tight">{m.title}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-1">{m.desc}</p>
                   </div>
                </div>
                <div className="text-right">
                   <div className="flex items-center gap-1.5 text-brand-primary font-black text-xl italic">
                      +{m.pts} <Zap className="w-4 h-4 fill-current" />
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

const RankingView = () => {
  const ranking = [
    { name: 'Carlos Batida', business: 'Batida Sound', pts: 4500, avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CB' },
    { name: 'Ana Doces', business: 'Gourmet Fit', pts: 3200, avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AD' },
    { name: 'Marcos Silva', business: 'Construção Pro', pts: 2800, avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MS' },
    { name: 'Julia Paes', business: 'Design Studio', pts: 1500, avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=JP' }
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] p-10 md:p-16 border border-gray-100 dark:border-zinc-800 shadow-xl space-y-10 animate-fade-in">
       <div className="flex items-center gap-4">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl text-yellow-600">
             <Medal className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Ranking Regional</h3>
            <p className="text-slate-500 font-medium">Os empreendedores mais influentes da rede.</p>
          </div>
       </div>

       <div className="space-y-4">
          {ranking.map((user, i) => (
             <div key={i} className={`flex items-center justify-between p-6 rounded-[2rem] border ${i === 0 ? 'bg-yellow-50/50 border-yellow-100 scale-105 shadow-lg' : 'bg-gray-50/50 border-gray-100'}`}>
                <div className="flex items-center gap-6">
                   <span className="font-black text-xl italic text-slate-300 w-6">#{i+1}</span>
                   <img src={user.avatar} className="w-12 h-12 rounded-xl shadow-md" alt="Avatar" />
                   <div>
                      <h4 className="font-black text-gray-900 leading-none">{user.name}</h4>
                      <p className="text-[10px] font-black text-indigo-600 uppercase mt-1">{user.business}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <span className="font-black text-gray-900">{user.pts} <span className="text-[10px] text-slate-400">PTS</span></span>
                   <ArrowUp className="w-4 h-4 text-emerald-500" />
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};
