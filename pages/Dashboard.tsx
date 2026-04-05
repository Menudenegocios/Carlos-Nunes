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
  ChevronRight, Bot, Rocket, GraduationCap,
  Copy, Share2, Sparkles, Lock, Save,
  Bell, X, Star, PartyPopper
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
  const [businessName, setBusinessName] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [isSavingAuth, setIsSavingAuth] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [ranking, setRanking] = useState<any[]>([]);

  // News Modal State
  const [showNews, setShowNews] = useState(false);
  const CURRENT_VERSION = 'v1.0.16';

  useEffect(() => {
    if (user) {
      loadDashboardData();
      
      const storageKey = `menu_match_news_${CURRENT_VERSION}_${user.id}`;
      const stored = localStorage.getItem(storageKey);
      let views = 0;
      if (stored) {
        views = parseInt(stored, 10);
        if (isNaN(views)) views = 0;
      }
      
      if (views < 2) {
        const timer = setTimeout(() => {
          setShowNews(true);
          localStorage.setItem(storageKey, (views + 1).toString());
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  if (!user) return null;

  const loadDashboardData = async () => {
    try {
      const [profile, history, rankingData] = await Promise.all([
        supabaseService.getProfile(user.id),
        supabaseService.getPointsHistory(user.id),
        supabaseService.getRanking(3)
      ]);
      setUserProfile(profile || null);
      if (profile) {
        setBusinessName(profile.business_name || '');
        setCpfCnpj(profile.cpf_cnpj || '');
      }
      setRanking(rankingData || []);
      setActivity(history && history.length > 0 ? history.slice(0, 4) : [
        { id: '1', user_id: user.id, action: 'Indicação Validada', points: 200, created_at: Date.now() - 86400000, category: 'indicacao' },
        { id: '2', user_id: user.id, action: 'Cashback Compra Store', points: 15, created_at: Date.now() - 172800000, category: 'engajamento' },
        { id: '3', user_id: user.id, action: 'Negócio B2B Confirmado', points: 100, created_at: Date.now() - 259200000, category: 'engajamento' }
      ] as PointsTransaction[]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyReferral = () => {
    const refCode = userProfile?.display_id?.toString() || user?.referral_code;
    if (refCode) {
      navigator.clipboard.writeText(`https://menudenegocios.com/#/register?ref=${refCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getNextTierData = () => {
    const data = userProfile || user;
    if (!data) return null;
    const currentPoints = data.points || 0;
    const currentReferrals = data.referrals_count || 0;

    const extractNumber = (str: string) => {
      const match = str.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    };

    for (let i = 0; i < tiers.length; i++) {
      const tier = tiers[i];
      const nextTier = tiers[i + 1];

      if (!nextTier) return null;

    const nextTierRequiredReferrals = extractNumber(nextTier.criteria || '0');
    const referralsProgress = nextTierRequiredReferrals > 0 
      ? Math.min(100, (currentReferrals / nextTierRequiredReferrals) * 100)
      : 100;

    if (currentPoints < nextTier.points || currentReferrals < nextTierRequiredReferrals) {
      return {
        currentLevel: tier.name,
        nextLevel: nextTier.name,
        requiredPoints: nextTier.points,
        requiredReferrals: nextTierRequiredReferrals,
        progressPoints: Math.min(100, (currentPoints / (nextTier.points || 1)) * 100),
        progressReferrals: referralsProgress
      };
    }
    }
    return null;
  };

  const nextTierData = getNextTierData() || {
    currentLevel: user.level || 'Nível Base',
    nextLevel: 'MÁXIMO',
    requiredPoints: 0,
    requiredReferrals: 0,
    progressPoints: 100,
    progressReferrals: 100
  };

  const getCashbackPercent = () => {
    if (!user) return '0%';
    let currentTier = tiers[0];
    for (let i = tiers.length - 1; i >= 0; i--) {
      if ((user.points || 0) >= tiers[i].points) {
        currentTier = tiers[i];
        break;
      }
    }
    const benefit = currentTier.benefits.find(b => b.includes('Menu Cash'));
    return benefit ? benefit.split(' ')[0] : '0%';
  };

  const planNames: Record<string, string> = {
    'pre-cadastro': 'Pré-cadastro',
    basic: 'Básico',
    pro: 'PRO',
    full: 'FULL'
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

      // Update Profile
      await supabase.from('profiles').update({
        business_name: businessName,
        cpf_cnpj: cpfCnpj,
        updated_at: new Date().toISOString()
      }).eq('user_id', currentUser.id);

      setAuthMessage('Dados atualizados com sucesso!');
      setNewPassword('');
    } catch (error: any) {
      setAuthMessage('Erro ao atualizar: ' + error.message);
    } finally {
      setIsSavingAuth(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 pt-4 px-4 relative">

      {/* Global Background Glows */}
      <div className="fixed top-0 left-1/4 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      {/* Header Premium SaaS */}
      <div className="bg-white/70 backdrop-blur-2xl rounded-[3.5rem] p-8 md:p-12 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200/50">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-gradient-to-br from-indigo-500/10 to-brand-primary/10 backdrop-blur-xl rounded-[2rem] border border-white/20 shadow-lg">
                <LayoutDashboard className="h-10 w-10 text-indigo-600 drop-shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-2 italic uppercase text-gray-900 overflow-visible">
                  Olá, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-brand-primary to-purple-600 title-fix">{user.name.split(' ')[0]}!</span>
                </h1>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em]">Sua economia colaborativa em tempo real. <br />ID: {userProfile?.display_id || '...'}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setShowNews(true)} className="hidden md:flex items-center gap-2 px-6 py-4 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-100 transition-all active:scale-95 shadow-sm">
                <Bell className="w-4 h-4" /> NOVIDADES <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-full text-[8px]">{CURRENT_VERSION}</span>
              </button>
              <Link to="/catalog" className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-primary to-orange-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(246,124,1,0.3)] active:scale-95 border border-orange-400/50">
                <Plus className="w-4 h-4" /> NOVO ITEM
              </Link>
              <Link to={`/store/${user.id}`} className="flex items-center gap-2 px-8 py-4 bg-white/50 backdrop-blur-md text-gray-900 border border-gray-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/80 transition-all active:scale-95 shadow-sm">
                <Eye className="w-4 h-4" /> VER VITRINE
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      </div>

      {/* Power Cards - Economia Colaborativa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {/* Card Menu Cash */}
        <div className="bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] border border-gray-200/50 shadow-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Saldo Menu Cash</p>
                <h2 className="text-5xl font-black text-gray-900 tracking-tighter drop-shadow-sm">R$ {(user.menu_cash || 0).toFixed(2)}</h2>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-100/50 text-emerald-600 flex items-center justify-center shadow-sm border border-emerald-200/50 backdrop-blur-sm">
                <Wallet className="w-7 h-7 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-emerald-50/80 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-200/50 backdrop-blur-sm">
                {getCashbackPercent()} Cashback Ativo
              </div>
              <p className="text-xs text-slate-500 font-medium italic">Plano {planNames[user.plan]}</p>
            </div>
          </div>
          <Coins className="absolute -bottom-6 -right-6 w-32 h-32 text-emerald-500/10 rotate-12 group-hover:scale-110 group-hover:text-emerald-500/20 transition-all duration-700" />
        </div>

        {/* Card Autoridade & Ranking */}
        <div className="bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] border border-gray-200/50 shadow-xl relative overflow-hidden group hover:border-brand-primary/30 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Pontos de Autoridade</p>
                <h2 className="text-5xl font-black text-gray-900 tracking-tighter drop-shadow-sm">{user.points.toLocaleString()} <span className="text-xl text-slate-400 font-medium">pts</span></h2>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-orange-100/50 text-brand-primary flex items-center justify-center shadow-sm border border-orange-200/50 backdrop-blur-sm">
                <Trophy className="w-7 h-7 drop-shadow-[0_0_8px_rgba(246,124,1,0.5)]" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-orange-50/80 text-brand-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-orange-200/50 backdrop-blur-sm">
                12º no Ranking Mensal
              </div>
              <p className="text-xs text-slate-500 font-medium italic">Top 5 ganha destaque</p>
            </div>
          </div>
          <Zap className="absolute -bottom-6 -right-6 w-32 h-32 text-brand-primary/10 rotate-12 group-hover:scale-110 group-hover:text-brand-primary/20 transition-all duration-700" />
        </div>
      </div>

      {/* Barra de Progressão de Nível */}
      <div className="bg-white/60 backdrop-blur-xl p-8 md:p-12 rounded-[3.5rem] border border-gray-200/50 shadow-xl relative overflow-hidden px-4 mx-4">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-brand-primary/5 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-[2rem] bg-indigo-500/10 text-indigo-600 flex items-center justify-center shadow-xl border border-white/20">
                <Rocket className="w-10 h-10 drop-shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">SEU NÍVEL: {(user.level || 'Nível Base').toUpperCase()}</h3>
                {nextTierData && (
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2 bg-slate-100 px-3 py-1 rounded-full w-fit">
                    Objetivo: {nextTierData.nextLevel}
                  </p>
                )}
              </div>
            </div>

            {nextTierData ? (
              <div className="flex-1 w-full max-w-xl space-y-6">
                {/* Progresso de Pontos */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest italic leading-none">Pontos: {user.points} / {nextTierData.requiredPoints}</span>
                    <span className="text-sm font-black text-gray-900 italic">{Math.round(nextTierData.progressPoints)}%</span>
                  </div>
                  <div className="relative h-4 w-full bg-slate-200/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/10 p-1">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                      style={{ width: `${nextTierData.progressPoints}%` }}
                    />
                  </div>
                </div>

                {/* Progresso de Indicações */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest italic leading-none">Indicações: {user.referrals_count || 0} / {nextTierData.requiredReferrals}</span>
                    <span className="text-sm font-black text-gray-900 italic">{Math.round(nextTierData.progressReferrals || 0)}%</span>
                  </div>
                  <div className="relative h-4 w-full bg-slate-200/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/10 p-1">
                    <div
                      className="h-full bg-gradient-to-r from-brand-primary to-orange-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(246,124,1,0.3)]"
                      style={{ width: `${nextTierData.progressReferrals}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 text-center py-4">
                <span className="text-lg font-black text-brand-primary italic uppercase">Nível Máximo Atingido! 💎</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4">
        {/* Lado Esquerdo: Ranking & Ações */}
        <div className="lg:col-span-7 space-y-10">
          <div className="bg-white/60 backdrop-blur-xl rounded-[3rem] p-10 border border-gray-200/50 shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3 italic">
                <Trophy className="text-[#F67C01] drop-shadow-[0_0_8px_rgba(246,124,1,0.5)]" /> RANKING
              </h3>
              <Link to="/rewards" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-2">VER RANKING COMPLETO <ChevronRight className="w-4 h-4" /></Link>
            </div>

            <div className="space-y-4">
              {ranking.length === 0 ? (
                <div className="py-10 text-center bg-white/40 rounded-2xl border border-dashed border-gray-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nenhum dado disponível</p>
                </div>
              ) : (
                ranking.map((member, i) => (
                  <div key={member.user_id || i} className="flex items-center justify-between p-5 bg-white/40 rounded-2xl border border-gray-100 hover:scale-[1.01] transition-all">
                    <div className="flex items-center gap-5">
                      <span className={`font-black text-xl italic ${i === 0 ? 'text-yellow-500' : 'text-slate-300'} w-6`}>#{i + 1}</span>
                      <img src={member.logo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${member.business_name || member.name || 'U'}`} className="w-10 h-10 rounded-xl shadow-md object-cover" alt="Avatar" />
                      <div>
                        <p className="text-sm font-black text-gray-900 leading-none">{member.business_name || member.name || 'Membro'}</p>
                        <p className="text-[10px] font-black text-[#F67C01] uppercase mt-1 tracking-widest">{member.city || member.level || ''}</p>
                      </div>
                    </div>
                    <span className="font-black text-gray-900 italic text-sm">{member.points || 0} <span className="text-[8px] text-slate-400 not-italic">PTS</span></span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-gray-200/50 shadow-xl space-y-6 relative overflow-hidden group hover:border-brand-primary/30 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-orange-100/50 text-brand-primary rounded-xl flex items-center justify-center mb-6 border border-orange-200/50 backdrop-blur-sm shadow-inner">
                  <UserPlus className="w-6 h-6 drop-shadow-[0_0_8px_rgba(246,124,1,0.5)]" />
                </div>
                <h4 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">Indicar Amigos</h4>
                <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">Ganhe até +{pointsRules.indicacaoPro} pontos por cada indicação.</p>
                <button
                  onClick={copyReferral}
                  className="w-full py-4 bg-gray-900 text-white border border-transparent rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-lg"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'COPIADO!' : 'COPIAR LINK'}
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 text-white space-y-6 shadow-xl relative overflow-hidden group border border-indigo-500/30">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 border border-white/20 shadow-inner">
                  <Sparkles className="w-6 h-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                </div>
                <h4 className="text-xl font-black uppercase italic tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 title-fix">Meta do Mês</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-indigo-200">
                    <span>Progresso Rede</span>
                    <span>75%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-primary rounded-full shadow-[0_0_10px_rgba(246,124,1,0.5)]" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <p className="text-[10px] text-indigo-100/60 font-medium leading-relaxed mt-4">Alcance coletivo ativa bônus de <span className="text-white font-black">+2% cashback</span>.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito: Acesso */}
        <div className="lg:col-span-5 space-y-10">
          <div className="bg-white/60 backdrop-blur-xl rounded-[3rem] p-10 border border-gray-200/50 shadow-xl relative overflow-hidden group hover:border-emerald-500/30 transition-colors duration-500">
            <div className="relative z-10">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3 mb-6">
                <Lock className="text-indigo-600" /> IDENTIDADE & ACESSO
              </h3>
              <form onSubmit={handleUpdateAuth} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Nome do Negócio</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-gray-100 rounded-2xl p-4 font-medium focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-gray-400"
                      value={businessName}
                      onChange={e => setBusinessName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">CPF / CNPJ</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-gray-100 rounded-2xl p-4 font-medium focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-gray-400"
                      value={cpfCnpj}
                      onChange={e => setCpfCnpj(e.target.value)}
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">E-mail de Login</label>
                  <input
                    type="email"
                    placeholder={user?.email || ''}
                    className="w-full bg-slate-50 border border-gray-100 rounded-2xl p-4 font-medium focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-gray-400"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Nova Senha</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-gray-100 rounded-2xl p-4 font-medium focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-gray-400"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                </div>
                {authMessage && <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest px-1">{authMessage}</p>}
                <button type="submit" disabled={isSavingAuth} className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl hover:bg-black transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-lg">
                  {isSavingAuth ? 'SALVANDO...' : <><Save className="w-4 h-4" /> ATUALIZAR ACESSO</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Novidades Modal */}
      {showNews && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowNews(false)}>
          <div 
            className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl border border-gray-100"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-br from-indigo-600 to-indigo-800 px-6 py-10 text-center">
              <button onClick={() => setShowNews(false)} className="absolute top-4 right-4 text-white/60 hover:text-white bg-white/10 p-2 rounded-full">
                <X className="w-5 h-5" />
              </button>
              <PartyPopper className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
              <h3 className="text-3xl font-black text-white italic uppercase">NOVIDADES</h3>
              <p className="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold text-indigo-100 uppercase mt-2">Versão {CURRENT_VERSION}</p>
            </div>

            <div className="px-6 py-8 space-y-4 bg-slate-50">
              {[
                { icon: Star, colorClass: 'bg-indigo-50 text-indigo-500', title: 'Bem-vindo à Menu Match', desc: 'O Menu Club evoluiu! Nova marca e interface otimizada.' },
                { icon: Sparkles, colorClass: 'bg-emerald-50 text-emerald-600', title: 'Financeiro: Importação OFX', desc: 'Novo seletor de bancos em lote e exclusão antes de importar.' },
                { icon: Bot, colorClass: 'bg-orange-50 text-orange-500', title: 'Lançamento: Local+', desc: 'Novo marketplace para vendas rápidas e recorrentes no dia a dia.' },
                { icon: GraduationCap, colorClass: 'bg-amber-50 text-amber-500', title: 'Gestão & Treinamentos', desc: 'Checklists automáticos em Projetos e novos treinamentos gravados.' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className={`p-2 ${item.colorClass} rounded-xl mt-1`}><item.icon className="w-5 h-5" /></div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-6 border-t border-gray-100 bg-white">
              <button
                className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                onClick={() => setShowNews(false)}
              >
                Entendi, Bora Trabalhar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
