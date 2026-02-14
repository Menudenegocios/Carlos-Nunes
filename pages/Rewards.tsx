
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { 
  Trophy, Gift, TrendingUp, Star,
  Zap, Crown, ChevronRight,
  CheckCircle, ListTodo, History, Medal, Home as HomeIcon
} from 'lucide-react';
import { Prize, PointsTransaction } from '../types';
import { SectionLanding } from '../components/SectionLanding';

export const Rewards: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'acceleration' | 'store' | 'missions' | 'history' | 'ranking'>('home');
  const [history, setHistory] = useState<PointsTransaction[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (user) loadHistory();
  }, [user]);

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
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-indigo-950 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-5 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl">
                 <Trophy className="h-10 w-10 text-emerald-400" />
              </div>
              <div>
                 <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none mb-2">Clube ADS</h1>
                 <p className="text-emerald-200 text-lg font-medium opacity-70">Transforme sua atividade em crescimento real.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="bg-black/20 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-xl">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-3">Saldo Disponível</p>
                  <div className="flex items-center gap-3">
                     <span className="text-5xl font-black text-white leading-none">{user.points}</span>
                     <Zap className="w-8 h-8 text-emerald-400 fill-current" />
                  </div>
               </div>
               <div className="bg-black/20 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-xl">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-3">Selo de Autoridade</p>
                  <div className="flex items-center gap-3">
                     <span className="text-3xl font-black text-emerald-400 uppercase tracking-tighter">{user.level}</span>
                     <Crown className="w-8 h-8 text-emerald-400" />
                  </div>
               </div>
            </div>
          </div>
          <div className="hidden lg:block bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10">
             <div className="flex justify-between items-end mb-6">
                <h4 className="text-2xl font-black text-white uppercase tracking-tight">Níveis de Poder</h4>
                <TrendingUp className="w-8 h-8 text-emerald-400" />
             </div>
             <p className="text-emerald-100 text-sm font-medium leading-relaxed opacity-70">Quanto mais você usa a plataforma, maior sua autoridade no bairro. Membros nível Ouro aparecem no topo de todas as buscas.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex p-2 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-2xl max-w-fit mx-auto overflow-x-auto scrollbar-hide gap-1 md:gap-3">
            {[
                { id: 'home', label: 'INÍCIO', icon: HomeIcon },
                { id: 'acceleration', label: 'NÍVEIS', icon: Zap },
                { id: 'missions', label: 'MISSÕES', icon: ListTodo },
                { id: 'ranking', label: 'RANKING', icon: Medal },
                { id: 'store', label: 'RESGATAR', icon: Gift },
                { id: 'history', label: 'EXTRATO', icon: History }
            ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)} 
                  className={`flex items-center justify-center gap-2 px-6 py-4 rounded-[1.8rem] font-black text-[10px] tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl scale-105' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
                >
                    <tab.icon className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{tab.label}</span>
                </button>
            ))}
        </div>
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
                accentColor="emerald"
            />
        )}
        
        {activeTab === 'acceleration' && (
            <div className="grid md:grid-cols-3 gap-8 animate-fade-in px-4">
                {[
                  { label: 'Bronze', pts: '0-999', icon: Zap, color: 'text-indigo-400' },
                  { label: 'Prata', pts: '1000-4999', icon: Star, color: 'text-emerald-500' },
                  { label: 'Ouro', pts: '5000+', icon: Crown, color: 'text-yellow-500' }
                ].map(lvl => (
                    <div key={lvl.label} className="p-10 bg-white dark:bg-zinc-900 rounded-[3rem] border border-gray-100 dark:border-zinc-800 text-center space-y-6 shadow-sm group hover:shadow-xl transition-all">
                        <div className={`w-16 h-16 rounded-[1.5rem] bg-gray-50 dark:bg-zinc-800 flex items-center justify-center mx-auto ${lvl.color}`}><lvl.icon className="w-8 h-8" /></div>
                        <h3 className={`text-2xl font-black ${lvl.color}`}>{lvl.label}</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{lvl.pts} Pontos</p>
                    </div>
                ))}
            </div>
        )}

        {activeTab === 'missions' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in px-4">
                {[
                    { title: 'Completar Perfil', pts: 20, icon: CheckCircle },
                    { title: 'Criar Catálogo', pts: 20, icon: Gift },
                    { title: 'Primeiro Lead', pts: 50, icon: TrendingUp }
                ].map((m, i) => (
                    <div key={i} className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 flex items-center gap-6 shadow-sm hover:border-emerald-500/20 transition-all">
                        <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-2xl flex items-center justify-center"><m.icon className="w-7 h-7" /></div>
                        <div>
                            <h4 className="font-black text-gray-900 dark:text-white leading-tight">{m.title}</h4>
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">+{m.pts} Pontos</span>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {activeTab === 'history' && (
            <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-xl min-h-[400px] animate-fade-in mx-4">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3"><History className="text-emerald-600" /> Extrato de Pontos</h3>
                {history.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">Nenhum histórico disponível.</div>
                ) : history.map(h => (
                    <div key={h.id} className="flex justify-between items-center p-6 border-b border-gray-50 dark:border-zinc-800 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-all rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-xl"><Zap className="w-5 h-5" /></div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{h.action}</h4>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">{new Date(h.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <span className="text-xl font-black text-emerald-600">+{h.points}</span>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};
