
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabaseService } from '../services/supabaseService';
import { Profile, Product, PointsTransaction } from '../types';
import { 
  Trophy, Zap, Eye, Plus, 
  ArrowRight, CheckCircle, 
  LayoutDashboard, Wallet, Coins, 
  History, Handshake, UserPlus, 
  ChevronRight, Bot, Rocket,
  Copy, Share2, Sparkles, Lock, Save
} from 'lucide-react';
import { pointsRules, tiers } from '../config/gamificationConfig';
import { supabase } from '../services/supabaseClient';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [activity, setActivity] = useState<PointsTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSavingAuth, setIsSavingAuth] = useState(false);
  const [authMessage, setAuthMessage] = useState('');

  useEffect(() => {
    if (user) loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [profile, history] = await Promise.all([
        supabaseService.getProfile(user!.id),
        supabaseService.getPointsHistory(user!.id)
      ]);
      setUserProfile(profile || null);
      // Mocking some activity if history is empty
      setActivity(history && history.length > 0 ? history.slice(0, 4) : [
        { id: '1', userId: user!.id, action: 'Indicação Validada', points: 200, createdAt: Date.now() - 86400000, category: 'indicacao' },
        { id: '2', userId: user!.id, action: 'Cashback Compra Store', points: 15, createdAt: Date.now() - 172800000, category: 'engajamento' },
        { id: '3', userId: user!.id, action: 'Negócio B2B Confirmado', points: 100, createdAt: Date.now() - 259200000, category: 'engajamento' }
      ] as PointsTransaction[]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
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
    if (!user) return { name: tiers[1].name, points: tiers[1].points };
    for (let i = 0; i < tiers.length; i++) {
       if (user.points < tiers[i].points) {
          return { name: tiers[i].name, points: tiers[i].points };
       }
    }
    return { name: 'Lenda', points: tiers[tiers.length - 1].points * 2 };
  };

  const nextLevel = getNextLevel();
  const progress = user ? Math.min(100, (user.points / nextLevel.points) * 100) : 0;

  const getCashbackPercent = () => {
    if (!user) return '0%';
    let currentTier = tiers[0];
    for (let i = tiers.length - 1; i >= 0; i--) {
      if (user.points >= tiers[i].points) {
        currentTier = tiers[i];
        break;
      }
    }
    const benefit = currentTier.benefits.find(b => b.includes('Menu Cash'));
    return benefit ? benefit.split(' ')[0] : '0%';
  };

  const planNames: Record<string, string> = {
    profissionais: 'Básico',
    freelancers: 'PRO',
    negocios: 'PRO'
  };

  const handleUpdateAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return;
    setIsSavingAuth(true);
    setAuthMessage('');
    try {
      if (newEmail && newEmail !== currentUser.email) {
        await supabase.auth.updateUser({ email: newEmail });
      }
      if (newPassword) {
        await supabase.auth.updateUser({ password: newPassword });
      }
      setAuthMessage('Dados atualizados com sucesso!');
      setNewPassword('');
    } catch (error: any) {
      setAuthMessage('Erro ao atualizar: ' + error.message);
    } finally {
      setIsSavingAuth(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 pt-4 px-4 animate-[fade-in_0.4s_ease-out] relative">
      
      {/* Global Background Glows */}
      <div className="fixed top-0 left-1/4 w-[800px] h-[800px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-brand-primary/10 dark:bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      {/* Header Premium SaaS */}
      <div className="bg-white/70 dark:bg-black/40 backdrop-blur-2xl rounded-[3.5rem] p-8 md:p-12 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-200/50 dark:border-white/5">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-gradient-to-br from-indigo-500/10 to-brand-primary/10 dark:from-indigo-500/20 dark:to-brand-primary/20 backdrop-blur-xl rounded-[2rem] border border-white/20 dark:border-white/10 shadow-lg">
                 <LayoutDashboard className="h-10 w-10 text-indigo-600 dark:text-brand-primary drop-shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
              </div>
              <div>
                 <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-2 italic uppercase text-gray-900 dark:text-white">
                    Olá, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-brand-primary to-purple-600 dark:from-[#4F46E5] dark:via-[#F67C01] dark:to-[#9333EA]">{user.name.split(' ')[0]}!</span>
                 </h1>
                 <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">Sua economia colaborativa em tempo real.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
                <Link to="/catalog" className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-primary to-orange-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(246,124,1,0.3)] active:scale-95 border border-orange-400/50">
                    <Plus className="w-4 h-4" /> NOVO ITEM
                </Link>
                <Link to={`/store/${user.id}`} className="flex items-center gap-2 px-8 py-4 bg-white/50 dark:bg-white/5 backdrop-blur-md text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/80 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm">
                    <Eye className="w-4 h-4" /> VER VITRINE
                </Link>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      </div>

      {/* Power Cards - Economia Colaborativa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card Menu Cash */}
        <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl p-10 rounded-[3rem] border border-gray-200/50 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden group hover:border-emerald-500/30 transition-colors duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-[0.2em]">Saldo Menu Cash</p>
                <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter drop-shadow-sm">R$ {(user.menuCash || 0).toFixed(2)}</h2>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-100/50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm border border-emerald-200/50 dark:border-emerald-500/20 backdrop-blur-sm">
                <Wallet className="w-7 h-7 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-emerald-50/80 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-200/50 dark:border-emerald-500/20 backdrop-blur-sm">
                {getCashbackPercent()} Cashback Ativo
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">Plano {planNames[user.plan]}</p>
            </div>
          </div>
          <Coins className="absolute -bottom-6 -right-6 w-32 h-32 text-emerald-500/10 dark:text-emerald-500/5 rotate-12 group-hover:scale-110 group-hover:text-emerald-500/20 transition-all duration-700" />
        </div>

        {/* Card Autoridade & Ranking */}
        <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl p-10 rounded-[3rem] border border-gray-200/50 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden group hover:border-brand-primary/30 transition-colors duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-[0.2em]">Pontos de Autoridade</p>
                <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter drop-shadow-sm">{user.points.toLocaleString()} <span className="text-xl text-slate-400 font-medium">pts</span></h2>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-orange-100/50 dark:bg-brand-primary/10 text-brand-primary flex items-center justify-center shadow-sm border border-orange-200/50 dark:border-brand-primary/20 backdrop-blur-sm">
                <Trophy className="w-7 h-7 drop-shadow-[0_0_8px_rgba(246,124,1,0.5)]" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-orange-50/80 dark:bg-brand-primary/10 text-brand-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-orange-200/50 dark:border-brand-primary/20 backdrop-blur-sm">
                12º no Ranking Mensal
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">Top 5 ganha destaque</p>
            </div>
          </div>
          <Zap className="absolute -bottom-6 -right-6 w-32 h-32 text-brand-primary/10 dark:text-brand-primary/5 rotate-12 group-hover:scale-110 group-hover:text-brand-primary/20 transition-all duration-700" />
        </div>
      </div>

      {/* Barra de Progressão de Nível */}
      <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl p-10 rounded-[3rem] border border-gray-200/50 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-brand-primary/5 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100/50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner border border-indigo-200/50 dark:border-indigo-500/20 backdrop-blur-sm">
                <Rocket className="w-8 h-8 drop-shadow-[0_0_10px_rgba(79,70,229,0.4)]" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">Nível {user.level}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Faltam {(nextLevel.points - user.points).toLocaleString()} pontos para se tornar {nextLevel.name}</p>
              </div>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest mb-1">Próximo Benefício</p>
              <p className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-brand-primary dark:from-indigo-400 dark:to-brand-primary uppercase italic">Cashback sobe para 15%</p>
            </div>
          </div>
          <div className="relative h-4 w-full bg-gray-200/50 dark:bg-zinc-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-gray-300/30 dark:border-white/5">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-brand-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(79,70,229,0.6)]" 
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Ações Rápidas & Motor de Crescimento */}
        <div className="lg:col-span-7 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-indigo-900 dark:to-black rounded-[2.5rem] p-8 text-white space-y-6 shadow-[0_10px_40px_rgba(79,70,229,0.3)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden group border border-indigo-500/30 dark:border-indigo-500/20">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 border border-white/20 shadow-inner">
                  <UserPlus className="w-6 h-6 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                </div>
                <h4 className="text-xl font-black uppercase italic tracking-tight">Indicar Amigos</h4>
                <p className="text-indigo-100/80 text-xs font-medium leading-relaxed mb-6">Ganhe até +{pointsRules.indicacaoPro} pontos por cada indicação validada.</p>
                <button 
                  onClick={copyReferral}
                  className="w-full py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/20 transition-all active:scale-95 shadow-lg"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />} 
                  {copied ? 'COPIADO!' : 'COPIAR LINK'}
                </button>
              </div>
              <Share2 className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 -rotate-12 group-hover:scale-110 group-hover:text-white/10 transition-all duration-700" />
            </div>

            <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-gray-200/50 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none space-y-6 relative overflow-hidden group hover:border-brand-primary/30 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-orange-100/50 dark:bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center mb-6 border border-orange-200/50 dark:border-brand-primary/20 backdrop-blur-sm shadow-inner">
                  <Handshake className="w-6 h-6 drop-shadow-[0_0_8px_rgba(246,124,1,0.5)]" />
                </div>
                <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">Negócio B2B</h4>
                <p className="text-slate-500 dark:text-zinc-400 text-xs font-medium leading-relaxed mb-6">Ganhe +{pointsRules.fecharNegocio} pontos ao fechar negócios na rede.</p>
                <Link 
                  to="/marketplace-b2b"
                  className="w-full py-4 bg-gray-900 dark:bg-brand-primary/20 text-white dark:text-brand-primary border border-transparent dark:border-brand-primary/30 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 dark:hover:bg-brand-primary/30 transition-all active:scale-95 shadow-lg"
                >
                  BUSCAR PARCEIROS <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Feed de Atividade Econômica */}
          <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl rounded-[3rem] p-10 border border-gray-200/50 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-3 italic">
                  <History className="text-indigo-600 dark:text-indigo-400 drop-shadow-[0_0_8px_rgba(79,70,229,0.5)]" /> Extrato de Atividade
                </h3>
                <Link to="/rewards" className="text-[10px] font-black text-indigo-600 dark:text-brand-primary uppercase tracking-widest hover:underline flex items-center gap-2">VER TUDO <ChevronRight className="w-4 h-4" /></Link>
              </div>

              <div className="space-y-4">
                {activity.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-6 bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-3xl border border-gray-100 dark:border-white/5 hover:bg-white dark:hover:bg-white/5 hover:border-indigo-500/20 dark:hover:border-indigo-500/30 transition-all duration-300 group">
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border backdrop-blur-sm shadow-inner ${
                        item.category === 'indicacao' 
                          ? 'bg-indigo-50/80 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-500/20' 
                          : 'bg-emerald-50/80 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20'
                      }`}>
                        {item.category === 'indicacao' ? <UserPlus className="w-5 h-5 drop-shadow-sm" /> : <Coins className="w-5 h-5 drop-shadow-sm" />}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.action}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">{new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-brand-primary dark:from-indigo-400 dark:to-brand-primary">+{item.points} pts</p>
                      {item.category === 'engajamento' && <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-black uppercase drop-shadow-sm">+ Cashback</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Insights & Status */}
        <div className="lg:col-span-5 space-y-10">
          {/* Dica IA Premium */}
          <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl rounded-[3rem] p-10 border border-gray-200/50 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none space-y-8 relative overflow-hidden group hover:border-indigo-500/30 transition-colors duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-indigo-100/50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 shadow-inner border border-indigo-200/50 dark:border-indigo-500/20 backdrop-blur-sm">
                <Bot className="w-7 h-7 drop-shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 uppercase italic tracking-tight leading-tight">Insight Menu Flow</h3>
                <p className="text-slate-600 dark:text-slate-300 text-base font-medium leading-relaxed">
                  "Sua Bio Digital recebeu 15 cliques na última hora. Que tal criar um cupom de desconto exclusivo no Menu Club para converter esses visitantes?"
                </p>
              </div>
              <Link to="/bio-builder" className="inline-flex items-center gap-2 text-indigo-600 dark:text-brand-primary font-black text-[10px] uppercase tracking-widest hover:gap-3 transition-all pt-4 drop-shadow-sm">
                TURBINAR BIO AGORA <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          </div>

          {/* Card de Engajamento */}
          <div className="bg-gradient-to-br from-gray-900 to-black dark:from-black dark:to-zinc-950 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_15px_50px_rgba(0,0,0,0.6)] border border-gray-800 dark:border-white/5">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-primary/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-brand-primary/30 shadow-inner">
                  <Sparkles className="w-6 h-6 text-brand-primary drop-shadow-[0_0_10px_rgba(246,124,1,0.8)]" />
                </div>
                <h4 className="text-xl font-black uppercase italic tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Meta do Mês</h4>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                  <span className="text-gray-400">Progresso da Rede</span>
                  <span className="text-brand-primary drop-shadow-[0_0_8px_rgba(246,124,1,0.5)]">75%</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 backdrop-blur-sm">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-brand-primary rounded-full shadow-[0_0_15px_rgba(246,124,1,0.6)] relative" style={{ width: '75%' }}>
                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 font-medium leading-relaxed">
                  Se a rede atingir 50.000 pontos coletivos, todos os membros ativos ganham <span className="text-white font-bold drop-shadow-sm">+2% de cashback extra</span> no próximo mês!
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none translate-y-1/4 translate-x-1/4"></div>
          </div>

          {/* Configurações de Acesso */}
          <div className="bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl rounded-[3rem] p-10 border border-gray-200/50 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none space-y-8 relative overflow-hidden group hover:border-indigo-500/30 transition-colors duration-500">
            <div className="relative z-10">
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-3 mb-6">
                <Lock className="text-indigo-600 dark:text-indigo-400" /> Acesso
              </h3>
              <form onSubmit={handleUpdateAuth} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Novo E-mail</label>
                  <input 
                    type="email" 
                    placeholder={user?.email || ''}
                    className="w-full bg-white/50 dark:bg-black/20 border border-gray-200/50 dark:border-white/5 rounded-2xl p-4 font-medium focus:ring-2 focus:ring-indigo-500/50 transition-all dark:text-white placeholder-gray-400" 
                    value={newEmail} 
                    onChange={e => setNewEmail(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Nova Senha</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-white/50 dark:bg-black/20 border border-gray-200/50 dark:border-white/5 rounded-2xl p-4 font-medium focus:ring-2 focus:ring-indigo-500/50 transition-all dark:text-white placeholder-gray-400" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                  />
                </div>
                {authMessage && <p className="text-xs font-bold text-brand-primary">{authMessage}</p>}
                <button type="submit" disabled={isSavingAuth} className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                  {isSavingAuth ? 'SALVANDO...' : <><Save className="w-4 h-4" /> SALVAR ALTERAÇÕES</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

