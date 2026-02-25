
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { mockBackend } from '../services/mockBackend';
import { Profile, Product, PointsTransaction } from '../types';
import { 
  Trophy, Zap, Eye, Plus, 
  ArrowRight, CheckCircle, 
  LayoutDashboard, Wallet, Coins, 
  History, Handshake, UserPlus, 
  ChevronRight, Bot, Rocket,
  Copy, Share2, Sparkles
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [activity, setActivity] = useState<PointsTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [profile, history] = await Promise.all([
        mockBackend.getProfile(user!.id),
        mockBackend.getPointsHistory(user!.id)
      ]);
      setUserProfile(profile || null);
      // Mocking some activity if history is empty
      setActivity(history.length > 0 ? history.slice(0, 4) : [
        { id: '1', userId: user!.id, action: 'Indicação Validada', points: 200, createdAt: Date.now() - 86400000, category: 'indicacao' },
        { id: '2', userId: user!.id, action: 'Cashback Compra Store', points: 15, createdAt: Date.now() - 172800000, category: 'engajamento' },
        { id: '3', userId: user!.id, action: 'Negócio B2B Confirmado', points: 100, createdAt: Date.now() - 259200000, category: 'engajamento' }
      ] as PointsTransaction[]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferral = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(`https://menunegocios.com/register?ref=${user.referralCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getNextLevel = () => {
    if (!user) return { name: 'Bronze', points: 1000 };
    if (user.points < 200) return { name: 'Elite', points: 200 };
    if (user.points < 1000) return { name: 'Bronze', points: 1000 };
    if (user.points < 3000) return { name: 'Ouro', points: 3000 };
    if (user.points < 10000) return { name: 'Diamante', points: 10000 };
    return { name: 'Lenda', points: 20000 };
  };

  const nextLevel = getNextLevel();
  const progress = user ? Math.min(100, (user.points / nextLevel.points) * 100) : 0;

  const getCashbackPercent = () => {
    if (user?.plan === 'negocios') return '25%';
    if (user?.plan === 'profissionais') return '10%';
    return '5%';
  };

  const planNames: Record<string, string> = {
    profissionais: 'Básico',
    freelancers: 'Premium',
    negocios: 'Pro'
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 pt-4 px-4 animate-[fade-in_0.4s_ease-out]">
      
      {/* Header Premium SaaS */}
      <div className="bg-[#0F172A] dark:bg-black rounded-[3.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-indigo-500/10 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-xl">
                 <LayoutDashboard className="h-10 w-10 text-brand-primary" />
              </div>
              <div>
                 <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-2 italic uppercase">
                    Olá, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] dark:from-brand-primary dark:to-brand-accent">{user.name.split(' ')[0]}!</span>
                 </h1>
                 <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">Sua economia colaborativa em tempo real.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
                <Link to="/catalog" className="flex items-center gap-2 px-8 py-4 bg-[#F67C01] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95">
                    <Plus className="w-4 h-4" /> NOVO ITEM
                </Link>
                <Link to={`/store/${user.id}`} className="flex items-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-md text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95">
                    <Eye className="w-4 h-4" /> VER VITRINE
                </Link>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      </div>

      {/* Power Cards - Economia Colaborativa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card Menu Cash */}
        <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Saldo Menu Cash</p>
                <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">R$ {(user.menuCash || 0).toFixed(2)}</h2>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 flex items-center justify-center shadow-sm">
                <Wallet className="w-7 h-7" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/30">
                {getCashbackPercent()} Cashback Ativo
              </div>
              <p className="text-xs text-slate-400 font-medium italic">Plano {planNames[user.plan]}</p>
            </div>
          </div>
          <Coins className="absolute -bottom-6 -right-6 w-32 h-32 text-emerald-500/5 rotate-12 group-hover:scale-110 transition-transform duration-700" />
        </div>

        {/* Card Autoridade & Ranking */}
        <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-gray-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Pontos de Autoridade</p>
                <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">{user.points.toLocaleString()} <span className="text-xl text-slate-400">pts</span></h2>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/30 text-brand-primary flex items-center justify-center shadow-sm">
                <Trophy className="w-7 h-7" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-orange-50 dark:bg-orange-950/30 text-brand-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-orange-100 dark:border-orange-900/30">
                12º no Ranking Mensal
              </div>
              <p className="text-xs text-slate-400 font-medium italic">Top 5 ganha destaque</p>
            </div>
          </div>
          <Zap className="absolute -bottom-6 -right-6 w-32 h-32 text-brand-primary/5 rotate-12 group-hover:scale-110 transition-transform duration-700" />
        </div>
      </div>

      {/* Barra de Progressão de Nível */}
      <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 flex items-center justify-center shadow-inner border border-indigo-100 dark:border-indigo-900/30">
              <Rocket className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">Nível {user.level}</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Faltam {(nextLevel.points - user.points).toLocaleString()} pontos para se tornar {nextLevel.name}</p>
            </div>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Próximo Benefício</p>
            <p className="text-sm font-black text-indigo-600 dark:text-brand-primary uppercase italic">Cashback sobe para 15%</p>
          </div>
        </div>
        <div className="relative h-4 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 to-brand-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(79,70,229,0.4)]" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Ações Rápidas & Motor de Crescimento */}
        <div className="lg:col-span-7 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white space-y-6 shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
                  <UserPlus className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-black uppercase italic tracking-tight">Indicar Amigos</h4>
                <p className="text-indigo-100 text-xs font-medium leading-relaxed mb-6">Ganhe +200 pontos por cada indicação validada.</p>
                <button 
                  onClick={copyReferral}
                  className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all active:scale-95"
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />} 
                  {copied ? 'COPIADO!' : 'COPIAR LINK'}
                </button>
              </div>
              <Share2 className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 -rotate-12 group-hover:scale-110 transition-transform" />
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-6 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/30 text-brand-primary rounded-xl flex items-center justify-center mb-6">
                  <Handshake className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">Negócio B2B</h4>
                <p className="text-slate-500 dark:text-zinc-400 text-xs font-medium leading-relaxed mb-6">Ganhe +100 pontos ao fechar negócios na rede.</p>
                <Link 
                  to="/marketplace-b2b"
                  className="w-full py-4 bg-gray-900 dark:bg-brand-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95"
                >
                  BUSCAR PARCEIROS <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Feed de Atividade Econômica */}
          <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-3 italic">
                <History className="text-indigo-600" /> Extrato de Atividade
              </h3>
              <Link to="/rewards" className="text-[10px] font-black text-indigo-600 dark:text-brand-primary uppercase tracking-widest hover:underline flex items-center gap-2">VER TUDO <ChevronRight className="w-4 h-4" /></Link>
            </div>

            <div className="space-y-4">
              {activity.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-zinc-800/40 rounded-3xl border border-gray-100 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      item.category === 'indicacao' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {item.category === 'indicacao' ? <UserPlus className="w-5 h-5" /> : <Coins className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 dark:text-white uppercase">{item.action}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-indigo-600 dark:text-brand-primary">+{item.points} pts</p>
                    {item.category === 'engajamento' && <p className="text-[9px] text-emerald-600 font-black uppercase">+ Cashback</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Insights & Status */}
        <div className="lg:col-span-5 space-y-10">
          {/* Dica IA Premium */}
          <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-8 relative overflow-hidden">
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 shadow-inner">
              <Bot className="w-7 h-7" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight leading-tight">Insight Menu Flow</h3>
              <p className="text-gray-500 dark:text-zinc-400 text-base font-medium leading-relaxed">
                "Sua Bio Digital recebeu 15 cliques na última hora. Que tal criar um cupom de desconto exclusivo no Menu Club para converter esses visitantes?"
              </p>
            </div>
            <Link to="/bio-builder" className="inline-flex items-center gap-2 text-indigo-600 dark:text-brand-primary font-black text-[10px] uppercase tracking-widest hover:gap-3 transition-all pt-4">
              TURBINAR BIO AGORA <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
          </div>

          {/* Card de Engajamento */}
          <div className="bg-gradient-to-br from-[#0F172A] to-black rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl border border-white/5">
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-primary/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-brand-primary" />
                </div>
                <h4 className="text-xl font-black uppercase italic tracking-tight">Meta do Mês</h4>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                  <span>Progresso da Rede</span>
                  <span className="text-brand-primary">75%</span>
                </div>
                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-primary rounded-full shadow-[0_0_15px_rgba(246,124,1,0.5)]" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Se a rede atingir 50.000 pontos coletivos, todos os membros ativos ganham <span className="text-white font-bold">+2% de cashback extra</span> no próximo mês!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

