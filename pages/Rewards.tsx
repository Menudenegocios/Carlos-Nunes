
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
      {/* Header Estilo Unificado Catálogo */}
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
               <div className="bg-white/5 backdrop-blur-xl p-4 md:p-6 rounded-[2rem] border border-white/10 shadow-xl flex items-center gap-4">
                  <div>
                    <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest leading-none mb-1">Saldo</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-white">{user.points}</span>
                      <Zap className="w-4 h-4 text-brand-primary fill-current" />
                    </div>
                  </div>
               </div>
               <div className="bg-white/5 backdrop-blur-xl p-4 md:p-6 rounded-[2rem] border border-white/10 shadow-xl flex items-center gap-4">
                  <div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Nível</p>
                    <span className="text-2xl font-black text-white uppercase italic">{user.level}</span>
                  </div>
                  <Crown className="w-8 h-8 text-brand-primary" />
               </div>
            </div>
          </div>

          {/* Abas Padronizadas - Alinhadas à Esquerda na Linha Inferior */}
          <div className="flex p-1.5 mt-12 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 w-fit overflow-x-auto scrollbar-hide gap-1">
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
                    className={`flex flex-col items-center justify-center min-w-[110px] px-6 py-3 rounded-[1.4rem] transition-all duration-300 whitespace-nowrap ${activeTab === tab.id ? 'bg-[#F67C01] text-white shadow-xl scale-105' : 'text-slate-400 hover:bg-white/10'}`}
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
      </div>
    </div>
  );
};
