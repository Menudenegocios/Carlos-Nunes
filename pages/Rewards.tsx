
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { 
  Trophy, Gift, TrendingUp, Star,
  Zap, Crown, ChevronRight,
  CheckCircle, ListTodo, History, Medal, Home as HomeIcon,
  Award, Rocket, Users, ArrowUp, Sparkles, ShoppingBag, Clock,
  // Added Ticket and Wand2 icons to fix the reference errors
  Ticket, Wand2
} from 'lucide-react';
import { Prize, PointsTransaction, User } from '../types';
import { SectionLanding } from '../components/SectionLanding';

export const Rewards: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'acceleration' | 'store' | 'missions' | 'history' | 'ranking'>('home');
  const [history, setHistory] = useState<PointsTransaction[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (user) loadHistory();
  }, [user, activeTab]);

  const loadHistory = async () => {
    if (!user) return;
    setIsLoadingHistory(true);
    try {
      const data = await mockBackend.getPointsHistory(user.id);
      setHistory(data);
    } finally { setIsLoadingHistory(false); }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 pt-4 px-4">
      {/* Header Estilo Unificado Clube ADS */}
      <div className="bg-[#0F172A] dark:bg-black rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-indigo-500/10 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-xl">
                 <Trophy className="h-10 w-10 text-brand-primary" />
              </div>
              <div>
                 <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-2">
                    Clube <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] dark:from-brand-primary dark:to-brand-accent italic uppercase">ADS</span>
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
                  { id: 'ranking', label: 'RANKING', desc: 'Competição', icon: Medal },
                  { id: 'store', label: 'RESGATAR', desc: 'Seus prêmios', icon: Gift },
                  { id: 'history', label: 'EXTRATO', desc: 'Histórico', icon: History }
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
                description="O Clube ADS recompensa seu engajamento com pontos que podem ser trocados por visibilidade extra e prêmios reais no seu negócio."
                benefits={[
                "Suba de nível e ganhe prioridade no diretório de lojas.",
                "Ganhe pontos ao atualizar seu catálogo e bio.",
                "Resgate vouchers e consultorias exclusivas.",
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
        {activeTab === 'ranking' && <RankingView />}
        {activeTab === 'store' && <StoreView userPoints={user.points} />}
        {activeTab === 'history' && <HistoryView history={history} isLoading={isLoadingHistory} />}
      </div>
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

const StoreView = ({ userPoints }: { userPoints: number }) => {
  const prizes = [
    { title: 'Selo de Verificado', desc: 'Destaque visual no diretório por 30 dias.', cost: 1000, icon: CheckCircle, color: 'bg-blue-600' },
    { title: 'Voucher R$ 50 Ads', desc: 'Crédito para destaque regional.', cost: 500, icon: Ticket, color: 'bg-orange-600' },
    { title: 'Consultoria IA', desc: 'Analise seu negócio com o Menu Flow PRO.', cost: 2000, icon: Wand2, color: 'bg-purple-600' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
       {prizes.map((p, i) => (
          <div key={i} className="group bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col">
             <div className={`w-16 h-16 rounded-2xl ${p.color} mb-8 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform`}>
                <p.icon className="w-8 h-8" />
             </div>
             <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic mb-2 tracking-tighter">{p.title}</h3>
             <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10 flex-1">{p.desc}</p>
             
             <div className="mt-auto space-y-4">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                   <span className="text-slate-400">Custo:</span>
                   <span className="text-brand-primary">{p.cost} pts</span>
                </div>
                <button 
                  disabled={userPoints < p.cost}
                  className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${userPoints >= p.cost ? 'bg-[#0F172A] text-white hover:bg-brand-primary' : 'bg-gray-100 text-slate-300 cursor-not-allowed'}`}
                >
                   {userPoints >= p.cost ? 'RESGATAR AGORA' : 'PONTOS INSUFICIENTES'}
                </button>
             </div>
          </div>
       ))}
    </div>
  );
};

const HistoryView = ({ history, isLoading }: { history: PointsTransaction[], isLoading: boolean }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-xl animate-fade-in">
       <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-10">Extrato de Atividades</h3>
       
       <div className="space-y-2">
          {isLoading ? (
             <div className="py-20 text-center animate-pulse text-slate-400">Carregando histórico...</div>
          ) : history.length === 0 ? (
             <div className="py-24 text-center border-4 border-dashed border-gray-50 rounded-[3rem]">
                <Clock className="w-16 h-16 mx-auto text-slate-200 mb-6" />
                <p className="text-slate-400 font-black uppercase text-[11px] tracking-widest">Nenhuma transação registrada.</p>
             </div>
          ) : history.map(t => (
             <div key={t.id} className="flex items-center justify-between p-6 bg-gray-50/50 dark:bg-zinc-800/40 rounded-2xl border border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-6">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.points > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {t.points > 0 ? <Zap className="w-5 h-5 fill-current" /> : <Gift className="w-5 h-5" />}
                   </div>
                   <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">{t.action}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase mt-1">{new Date(t.createdAt).toLocaleDateString('pt-BR')} • {t.category}</p>
                   </div>
                </div>
                <span className={`font-black text-lg ${t.points > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                   {t.points > 0 ? '+' : ''}{t.points}
                </span>
             </div>
          ))}
       </div>
    </div>
  );
};
