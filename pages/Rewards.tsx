
import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { 
  Trophy, Gift, TrendingUp, Star,
  Zap, Crown, ChevronRight,
  CheckCircle, ListTodo, Medal, Home as HomeIcon,
  Award, Rocket, Users, ArrowUp, Sparkles, ShoppingBag, Clock,
  Megaphone, Heart, HandHeart, FileBarChart, Link2, Zap as ZapIcon, Lock
} from 'lucide-react';
import { Prize, PointsTransaction, User, B2BOffer, B2BTransaction, Product, Meeting1x1 } from '../types';
import { SectionLanding } from '../components/SectionLanding';
import { DirectMessages } from './DirectMessages';
import { pointsRules, tiers, rankingRules } from '../config/gamificationConfig';
import { SimpleModal } from '../components/SimpleModal';

const NextMeetingSummary: React.FC<{ user: any, meetings: Meeting1x1[], setActiveTab: (tab: any) => void }> = ({ user, meetings, setActiveTab }) => {
  const nextMeeting = meetings
    .filter(m => m.status === 'scheduled' && (m.creator_id === user.id || m.guest_id === user.id))
    .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime())[0];

  if (!nextMeeting) return null;

  const isCreator = nextMeeting.creator_id === user.id;
  const partner = isCreator ? (nextMeeting as any).guest : (nextMeeting as any).creator;
  const partnerName = partner?.business_name || partner?.name || "Membro";

  return (
    <div 
      onClick={() => setActiveTab('meeting')}
      className="bg-indigo-600/5 hover:bg-indigo-600/10 border border-indigo-600/10 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer transition-all animate-in fade-in slide-in-from-top-4 duration-700"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none mb-1">Próxima Reunião Agendada</p>
          <h4 className="text-lg font-black text-gray-900">{nextMeeting.title}</h4>
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${partnerName}`} className="w-8 h-8 rounded-lg" alt="Partner" />
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase leading-none">Com</p>
            <p className="text-sm font-bold text-gray-700">{partnerName}</p>
          </div>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-indigo-100 flex items-center gap-3 hover:translate-x-1 transition-transform">
           <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-400 uppercase">Data/Hora</span>
              <span className="text-xs font-black text-gray-900">{new Date(nextMeeting.date + 'T00:00:00').toLocaleDateString('pt-BR')} às {nextMeeting.time}</span>
           </div>
           <ChevronRight className="w-4 h-4 text-indigo-600" />
        </div>
      </div>
    </div>
  );
};

export const Rewards: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'feed' | 'chat' | 'rules' | 'match' | 'referrals' | 'meeting'>('feed');
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loadingReferrals, setLoadingReferrals] = useState(true);
  const [copied, setCopied] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [globalMeetings, setGlobalMeetings] = useState<Meeting1x1[]>([]);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
    onConfirm?: () => void;
    confirmText?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['feed', 'chat', 'rules', 'match', 'referrals', 'meeting'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [location.search]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoadingReferrals(true);
      const [referralsData, profile, meetingsData] = await Promise.all([
        supabaseService.getReferrals(user!.id),
        supabaseService.getProfile(user!.id),
        supabaseService.getMeetings1x1(user!.id)
      ]);
      setReferrals(referralsData);
      setUserProfile(profile);
      setGlobalMeetings(meetingsData);
    } catch (error) {
      console.error("Error loading rewards data:", error);
    } finally {
      setLoadingReferrals(false);
    }
  };

  const copyReferralLink = () => {
    const refCode = userProfile?.display_id?.toString() || user?.referral_code;
    if (refCode) {
      const url = `https://menudenegocios.com/#/register?ref=${refCode}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!user) return null;

  const isPreCadastro = (user.plan === 'pre-cadastro' || userProfile?.plan === 'pre-cadastro');
  const isAdmin = user.role === 'admin' || userProfile?.role === 'admin';

  if (isPreCadastro && !isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-700">
        <div className="relative">
          <div className="w-32 h-32 bg-brand-primary/10 rounded-[2.5rem] flex items-center justify-center animate-pulse">
            <Lock className="w-12 h-12 text-brand-primary" />
          </div>
          <div className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-lg">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
        
        <div className="space-y-4 max-w-lg">
          <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter leading-tight">
            Acesso <span className="text-brand-primary">Restrito</span>
          </h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            O <strong>Menu Match</strong> é um benefício exclusivo para membros ativos da nossa comunidade. 
            Identificamos que você ainda está em fase de <span className="text-amber-600 font-bold uppercase text-xs">Pré-Cadastro</span>.
          </p>
        </div>

        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl w-full max-w-md space-y-6">
          <div className="flex items-center gap-4 text-left p-4 bg-slate-50 rounded-2xl">
            <div className="w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center font-bold">1</div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-tight">Complete seu perfil profissional</p>
          </div>
          <div className="flex items-center gap-4 text-left p-4 bg-slate-50 rounded-2xl">
            <div className="w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center font-bold">2</div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-tight">Escolha um dos nossos planos ativos</p>
          </div>
          <div className="flex items-center gap-4 text-left p-4 bg-slate-50 rounded-2xl">
            <div className="w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center font-bold">3</div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-tight">Participe do maior ecossistema de prosperidade</p>
          </div>

          <button 
            onClick={() => navigate('/plans')}
            className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-brand-primary/20 hover:scale-[1.02] transition-all active:scale-95"
          >
            VER PLANOS E ADERIR
          </button>
        </div>

        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-4 italic">
          Dúvidas? Entre em contato com nossa governança.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 pt-4 px-4 overflow-x-hidden">
      {/* Header Estilo Unificado Menu Club */}
      <div className="bg-[#0F172A] rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-indigo-500/10 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-xl">
                 <Trophy className="h-10 w-10 text-brand-primary" />
              </div>
              <div>
                 <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-2 overflow-visible">
                    Networking e <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] italic uppercase title-fix">Negócios</span>
                 </h1>
                 <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">TRANSFORME SUA ATIVIDADE EM CRESCIMENTO REAL.</p>
              </div>
            </div>
            
            <div className="flex bg-white/5 backdrop-blur-xl p-2 rounded-[2.5rem] border border-white/10 shadow-2xl">
              <div className="flex items-center gap-8 px-8 py-3 border-r border-white/10">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-brand-primary uppercase tracking-[0.2em] mb-1">Seus Pontos</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-white leading-none">{user.points}</span>
                    <Zap className="w-4 h-4 text-brand-primary fill-current" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8 px-8 py-3">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1">Menu B2B</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-white leading-none">M$ {user.menu_cash?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex p-1.5 mt-12 bg-white/5 backdrop-blur-md rounded-[2.2rem] border border-white/10 w-fit overflow-x-auto scrollbar-hide gap-1">
              {[
                  { id: 'feed', label: 'FEED', desc: 'Porta de Entrada', icon: Megaphone },
                  { id: 'chat', label: 'CHAT', desc: 'Bate-papo Direto', icon: MessageCircle },
                  { id: 'meeting', label: 'REUNIÃO 1X1', desc: 'Networking Direto', icon: Users },
                  { id: 'match', label: 'NEGÓCIOS', desc: 'Oportunidades', icon: Handshake },
                  { id: 'referrals', label: 'INDICAÇÕES', desc: 'Seu time', icon: Share2 },
                  { id: 'rules', label: 'REGRAS', desc: 'Guia do Ecossistema', icon: ListTodo },
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
        {activeTab === 'feed' && <CommunityFeedView user={user} userProfile={userProfile} setModalConfig={setModalConfig} />}
        {activeTab === 'chat' && <DirectMessages setModalConfig={setModalConfig} />}
        {activeTab === 'rules' && <RulesView user={user} />}
        {activeTab === 'meeting' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <NextMeetingSummary user={user} meetings={globalMeetings} setActiveTab={setActiveTab} />
            <Meeting1x1View user={user} userProfile={userProfile} setModalConfig={setModalConfig} />
          </div>
        )}
        {activeTab === 'match' && <B2BMatchView user={user} setModalConfig={setModalConfig} />}
        {activeTab === 'referrals' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white rounded-[3rem] p-10 md:p-14 border border-gray-100 shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                      <div className="space-y-4">
                         <div className="space-y-2">
                            <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tight leading-none title-fix">Minhas Indicações</h2>
                            <p className="text-slate-500 text-sm font-medium">Acompanhe o status e ganhos gerados por quem você trouxe para o ecossistema.</p>
                         </div>
                         <div className="flex items-center gap-3">
                            <div className="bg-slate-50 px-4 py-2 rounded-xl border border-dashed border-slate-200 text-xs font-mono text-slate-500 flex items-center gap-3">
                                <span className="text-[10px] font-black uppercase text-slate-400">Seu Link:</span>
                                <span>https://menudenegocios.com/#/register?ref={userProfile?.display_id || '---'}</span>
                            </div>
                            <button 
                                onClick={copyReferralLink}
                                className={`p-2.5 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-gray-900 text-white hover:bg-black'}`}
                            >
                                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                         </div>
                       </div>
                       <div className="bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100 h-fit">
                         <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block mb-1">Total de Indicados</span>
                         <span className="text-2xl font-black text-gray-900">{referrals.length} membros</span>
                       </div>
                    </div>

                   {loadingReferrals ? (
                     <div className="flex justify-center py-20">
                        <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin" />
                     </div>
                   ) : referrals.length === 0 ? (
                     <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-300">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Você ainda não possui indicações diretas.</p>
                        <button 
                          onClick={copyReferralLink} 
                          className={`mt-6 font-black text-[10px] uppercase tracking-widest transition-all px-6 py-3 rounded-xl border flex items-center gap-2 mx-auto ${copied ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
                         >
                           {copied ? <><CheckCircle className="w-3 h-3" /> Link Copiado!</> : <><Copy className="w-3 h-3" /> Começar a indicar agora</>}
                         </button>
                     </div>
                   ) : (
                     <div className="overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-y-4">
                           <thead>
                              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                 <th className="px-6 py-2">Membro</th>
                                 <th className="px-6 py-2">ID</th>
                                 <th className="px-6 py-2">Data Cadastro</th>
                                 <th className="px-6 py-2">Plano</th>
                                 <th className="px-6 py-2">Pontos Gerados</th>
                                 <th className="px-6 py-2">Status</th>
                              </tr>
                           </thead>
                           <tbody>
                              {referrals.map((ref) => {
                                 const isActive = ref.plan && ref.plan !== 'pre-cadastro';
                                 return (
                                   <tr key={ref.id} className="bg-gray-50/50 hover:bg-white transition-all group border border-transparent hover:border-indigo-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md">
                                      <td className="px-6 py-6 rounded-l-2xl">
                                         <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">
                                               {ref.name?.[0]?.toUpperCase() || '-'}
                                            </div>
                                            <div>
                                               <p className="text-sm font-black text-gray-900 leading-none mb-1">{ref.name}</p>
                                               <p className="text-[10px] text-slate-400 font-medium lowercase truncate max-w-[150px]">{ref.email}</p>
                                            </div>
                                         </div>
                                      </td>
                                      <td className="px-6 py-6 border-l border-gray-100/50">
                                         <span className="text-xs font-bold text-slate-500">#{ref.id.split('-')[0]}</span>
                                      </td>
                                      <td className="px-6 py-6 border-l border-gray-100/50">
                                         <span className="text-xs font-bold text-slate-500 italic">{ref.created_at ? new Date(ref.created_at).toLocaleDateString() : '-'}</span>
                                      </td>
                                      <td className="px-6 py-6 border-l border-gray-100/50">
                                         <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'}`}>
                                            {ref.plan?.toUpperCase() || 'PRE-CADASTRO'}
                                         </span>
                                      </td>
                                      <td className="px-6 py-6 border-l border-gray-100/50">
                                         <span className="text-sm font-black text-brand-primary">+{isActive ? (ref.plan === 'pro' ? pointsRules.indicacaoPro : ref.plan === 'full' ? (pointsRules as any).indicacaoFull : pointsRules.indicacaoBasico) : 0}</span>
                                      </td>
                                      <td className="px-6 py-6 rounded-r-2xl border-l border-gray-100/50">
                                         <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                            {isActive ? 'ATIVO' : 'PENDENTE'}
                                         </span>
                                      </td>
                                   </tr>
                                 );
                              })}
                           </tbody>
                        </table>
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}

        <SimpleModal 
            isOpen={modalConfig.isOpen}
            onClose={() => setModalConfig((prev: any) => ({...prev, isOpen: false, onConfirm: undefined}))}
            title={modalConfig.title}
            message={modalConfig.message}
            type={modalConfig.type}
            onConfirm={modalConfig.onConfirm}
            confirmText={modalConfig.confirmText}
        />
      </div>
    </div>
  );
};

const RulesView = ({ user }: { user: User }) => {
  const [activeSubTab, setActiveSubTab] = useState<'points' | 'levels' | 'menucash' | 'ranking'>('points');
  
  return (
    <div className="space-y-10 animate-fade-in">
       <div className="bg-indigo-600 rounded-[3rem] p-10 md:p-12 text-white relative overflow-hidden shadow-xl mb-12">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="space-y-4 max-w-xl">
                <p className="text-indigo-100 font-medium pt-4">Entenda as regras da comunidade, ganhe pontos e escale seus níveis.</p>
             </div>
             <div className="flex flex-wrap gap-4">
                <button 
                   onClick={() => setActiveSubTab('points')}
                   className={`px-6 py-3 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all ${activeSubTab === 'points' ? 'bg-white text-indigo-600 shadow-2xl' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                   PONTOS
                </button>
                <button 
                   onClick={() => setActiveSubTab('levels')}
                   className={`px-6 py-3 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all ${activeSubTab === 'levels' ? 'bg-white text-indigo-600 shadow-2xl' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                   NÍVEIS
                </button>
                <button 
                   onClick={() => setActiveSubTab('menucash')}
                   className={`px-6 py-3 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all ${activeSubTab === 'menucash' ? 'bg-white text-indigo-600 shadow-2xl' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                   REGRAS MENU B2B
                </button>
                <button 
                   onClick={() => setActiveSubTab('ranking')}
                   className={`px-6 py-3 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all ${activeSubTab === 'ranking' ? 'bg-white text-indigo-600 shadow-2xl' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                   RANKING
                </button>
             </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
       </div>

       {activeSubTab === 'points' && (
          <div className="space-y-12 animate-fade-in"><MissionsView /></div>
       )}
       {activeSubTab === 'levels' && <LevelsView user={user} />}
       {activeSubTab === 'menucash' && <MenuCashInfo />}
       {activeSubTab === 'ranking' && <RankingView user={user} />}
    </div>
  );
};

const MenuCashInfo = () => {
    return (
        <div className="bg-white rounded-[3.5rem] shadow-xl overflow-hidden border border-gray-100 animate-fade-in">
             <div className="bg-[#0F172A] p-10 text-white">
                 <h3 className="text-3xl font-black uppercase italic tracking-tighter">💰 REGRAS MENU B2B</h3>
                 <p className="text-xs font-black text-brand-primary tracking-[0.2em] mt-2 uppercase">A moeda interna do ecossistema</p>
             </div>
             
             <div className="p-10 md:p-16 space-y-16">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                     <div className="space-y-6">
                         <div className="flex items-center gap-4">
                             <div className="p-4 bg-indigo-50 rounded-[1.5rem] text-indigo-600 shadow-sm">
                                 <Zap className="w-8 h-8 fill-current" />
                             </div>
                             <h4 className="text-2xl font-black text-gray-900 uppercase italic leading-none">A MOEDA INTERNA</h4>
                         </div>
                         <p className="text-slate-600 font-medium text-lg leading-relaxed">
                           O Menu Club funciona com uma moeda interna chamada Menu Cash. O dinheiro continua circulando dentro da rede, criando retenção e prosperidade coletiva.
                         </p>
                         
                         <div className="bg-indigo-50/50 p-8 rounded-[2rem] border border-indigo-100/50">
                            <h5 className="font-black text-indigo-900 uppercase italic mb-4">Cashback por Nivel:</h5>
                            <div className="grid grid-cols-2 gap-4">
                               {[
                                 { label: 'Bronze', val: '5%' },
                                 { label: 'Prata', val: '10%' },
                                 { label: 'Ouro', val: '15%' },
                                 { label: 'Diamante', val: '20%' }
                               ].map((lvl, i) => (
                                 <div key={i} className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center">
                                   <span className="font-bold text-slate-500 uppercase text-xs">{lvl.label}</span>
                                   <span className="font-black text-indigo-600">{lvl.val}</span>
                                 </div>
                               ))}
                            </div>
                         </div>
                     </div>

                     <div className="bg-gray-50/80 p-10 rounded-[3rem] border border-gray-100 space-y-8">
                         <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Regras de Utilizaçao</h4>
                         <ul className="space-y-8">
                            {[
                              { text: "Uso Exclusivo", desc: "O Menu Cash só pode ser utilizado para adquirir produtos e serviços de outros membros dentro da nossa plataforma." },
                              { text: "Limite de Utilizaçao", desc: "Você pode utilizar até 20% do valor de uma compra (conforme limite do vendedor) usando seu saldo disponível." },
                              { text: "Saldo e Plano", desc: "Seu saldo é válido e utilizável enquanto seu plano estiver ativo no Menu Club." },
                              { text: "Acúmulo por Autoridade", desc: "O Menu Cash é um percentual que vem dos seus Pontos de Autoridade ganhos em missões." }
                            ].map((item, i) => (
                              <li key={i} className="flex gap-5">
                                 <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-indigo-600 font-black shrink-0 border border-gray-50">{i+1}</div>
                                 <div>
                                     <p className="font-black text-gray-900 uppercase italic text-base mb-1">{item.text}</p>
                                     <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                 </div>
                              </li>
                            ))}
                         </ul>
                     </div>
                 </div>

                 {/* Exemplo Prático */}
                 <div className="pt-10 border-t border-gray-100">
                    <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-[3rem] p-10 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="text-2xl font-black uppercase italic mb-8 flex items-center gap-3">
                                <Sparkles className="w-6 h-6 text-brand-primary" /> Exemplo Prático
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
                                <div className="space-y-2">
                                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Produto</p>
                                    <p className="text-xl font-black">Consultoria VIP</p>
                                    <p className="text-3xl font-black text-brand-primary">R$ 1.000,00</p>
                                </div>
                                <div className="flex justify-center">
                                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                                        <ArrowRight className="w-8 h-8 text-brand-primary" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/10">
                                        <p className="text-emerald-400 font-black text-lg">M$ 200,00 usados</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">(20% do valor)</p>
                                    </div>
                                    <div className="bg-brand-primary p-5 rounded-2xl shadow-xl">
                                        <p className="font-black text-xl">R$ 800,00 pagos</p>
                                        <p className="text-[10px] text-white/80 uppercase font-bold">em dinheiro real</p>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-10 text-center text-slate-400 font-medium italic">"Isso cria circulaçao de riqueza e retençao dentro da rede."</p>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                    </div>
                 </div>
             </div>
        </div>
    );
};

const B2BMatchView = ({ user, setModalConfig }: { user: User, setModalConfig: (config: any) => void }) => {
  const [activeSubTab, setActiveSubTab] = useState<'offers' | 'transactions'>('offers');
  const [menuCashProducts, setMenuCashProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productSellerProfile, setProductSellerProfile] = useState<any>(null);
  const [menuCashToUse, setMenuCashToUse] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { 
    loadData(); 
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const productsData = await supabaseService.getAllProducts();
      setMenuCashProducts(productsData.filter(p => p.accepts_menu_cash));
    } finally { 
      setIsLoading(false); 
    }
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !user) return;

    const maxMenuCash = (selectedProduct.price * (selectedProduct.menu_cash_percentage || 0)) / 100;
    if (menuCashToUse > maxMenuCash) {
      setModalConfig({
        isOpen: true,
        title: 'Limite Excedido',
        message: `Você só pode usar até R$ ${maxMenuCash.toFixed(2)} em Menu Cash para este produto.`,
        type: 'info'
      });
      return;
    }

    if (menuCashToUse > (user.menu_cash || 0)) {
      setModalConfig({
        isOpen: true,
        title: 'Saldo Insuficiente',
        message: 'Você não possui saldo de Menu Cash suficiente para esta operação.',
        type: 'error'
      });
      return;
    }

    setIsSaving(true);
    try {
      await supabaseService.createB2BTransaction({
        buyer_id: user.id,
        buyer_name: user.name,
        seller_id: selectedProduct.user_id,
        seller_name: productSellerProfile?.business_name || productSellerProfile?.name || 'Vendedor',
        product_id: selectedProduct.id,
        total_amount: selectedProduct.price,
        menu_cash_amount: menuCashToUse,
        amount: selectedProduct.price - menuCashToUse,
        description: `Compra do item: ${selectedProduct.name}`,
        status: 'pending'
      });
      setIsPurchaseModalOpen(false);
      setSelectedProduct(null);
      setMenuCashToUse(0);
      setActiveSubTab('transactions');
    } catch (err) {
      console.error("Erro ao realizar compra:", err);
      setModalConfig({
        isOpen: true,
        title: 'Erro',
        message: 'Não foi possível processar sua compra. Tente novamente.',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = menuCashProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-fade-in">
       <div className="bg-indigo-600 rounded-[3rem] p-10 md:p-12 text-white relative overflow-hidden shadow-xl mb-12">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="space-y-4 max-w-xl">
                <p className="text-indigo-100 font-medium pt-4">Descubra ofertas exclusivas que aceitam Menu Cash e movimente a economia colaborativa.</p>
             </div>
              <div className="flex gap-4">
                <button 
                   onClick={() => setActiveSubTab('offers')}
                   className={`px-8 py-4 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all ${activeSubTab === 'offers' ? 'bg-white text-indigo-600 shadow-2xl' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                   OPORTUNIDADES
                </button>
                <button 
                   onClick={() => setActiveSubTab('transactions')}
                   className={`px-8 py-4 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all ${activeSubTab === 'transactions' ? 'bg-white text-indigo-600 shadow-2xl' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                   MINHAS TRANSAÇÕES
                </button>
             </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
       </div>

       {activeSubTab === 'offers' ? (
         <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
              <div className="w-full relative">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                 <input 
                    type="text" 
                    placeholder="Filtrar por nome do produto..." 
                    className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-3xl font-bold shadow-sm focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                 />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {isLoading ? (
                  [1,2,3,4].map(i => <div key={i} className="h-64 bg-gray-100 rounded-[2.5rem] animate-pulse"></div>)
               ) : filteredProducts.length === 0 ? (
                  <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                     <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                     <p className="text-gray-400 font-bold uppercase tracking-widest">Nenhum produto com Menu Cash encontrado.</p>
                  </div>
               ) : filteredProducts.map(prod => (
                  <div key={prod.id} className="group bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-3xl bg-gray-50 overflow-hidden mb-6 border border-gray-100">
                      <img src={prod.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <h4 className="font-black text-gray-900 text-lg uppercase italic mb-1 truncate w-full">{prod.name}</h4>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4">Aceita {prod.menu_cash_percentage}% Menu Cash</p>
                    
                    <div className="w-full pt-4 border-t border-gray-50 flex justify-between items-center mb-6">
                       <span className="text-[10px] font-black uppercase text-slate-400">Preço</span>
                       <span className="text-xl font-black text-brand-primary">R$ {prod.price.toFixed(2)}</span>
                    </div>

                    <button 
                      onClick={async () => { 
                         setSelectedProduct(prod); 
                         setIsPurchaseModalOpen(true); 
                         setProductSellerProfile(null);
                         if (prod.user_id) {
                            try {
                               const profile = await supabaseService.getProfile(prod.user_id);
                               setProductSellerProfile(profile);
                            } catch(e) {}
                         }
                      }}
                      className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-primary transition-all active:scale-95 shadow-lg"
                    >
                       COMPRAR AGORA <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
               ))}
            </div>
         </>
       ) : (
         <B2BTransactionsView user={user} setModalConfig={setModalConfig} />
       )}

        {/* MODAL: COMPRA DE PRODUTO */}
        {isPurchaseModalOpen && selectedProduct && (
           <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
              <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in">
                  <div className="bg-[#0F172A] p-6 text-white flex justify-between items-center">
                      <div>
                          <h3 className="text-xl font-black uppercase italic tracking-tighter">Finalizar Compra</h3>
                          <p className="text-[9px] font-black text-emerald-400 tracking-widest mt-0.5 uppercase">Use seu saldo Menu B2B</p>
                      </div>
                      <button onClick={() => setIsPurchaseModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X className="w-6 h-6" /></button>
                  </div>
                  <form onSubmit={handlePurchase} className="p-8 space-y-6">
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-sm shrink-0">
                          <img src={selectedProduct.image_url} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-gray-900 uppercase italic line-clamp-1 leading-tight">{selectedProduct.name}</h4>
                          {productSellerProfile ? (
                             <p className="text-[10px] font-black text-[#F67C01] tracking-widest uppercase mb-1">
                                {productSellerProfile.business_name || productSellerProfile.name || "Empresa Parceira"}
                             </p>
                          ) : (
                             <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1">Carregando...</p>
                          )}
                          <p className="text-xl font-black text-brand-primary">R$ {selectedProduct.price.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Meu Saldo</p>
                          <p className="text-xl font-black text-indigo-900">M$ {user.menu_cash?.toFixed(2) || '0.00'}</p>
                        </div>
                        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Limite de Uso</p>
                          <p className="text-xl font-black text-emerald-900">{selectedProduct.menu_cash_percentage}% (R$ {(selectedProduct.price * (selectedProduct.menu_cash_percentage || 0) / 100).toFixed(2)})</p>
                        </div>
                      </div>

                      <div>
                          <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 text-left">Quanto Menu Cash deseja usar?</label>
                          <input 
                            required 
                            type="number" 
                            step="0.01" 
                            max={(selectedProduct.price * (selectedProduct.menu_cash_percentage || 0) / 100)}
                            className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-base" 
                            value={menuCashToUse} 
                            onChange={e => setMenuCashToUse(Number(e.target.value))} 
                            placeholder="M$ 0.00" 
                          />
                      </div>

                      <div className="bg-indigo-600 p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
                        <div className="relative z-10 flex justify-between items-center">
                          <div>
                            <span className="text-[9px] font-black text-indigo-200 uppercase tracking-[0.2em] block mb-1">Total com Desconto</span>
                            <span className="text-2xl font-black text-white italic">R$ {(selectedProduct.price - menuCashToUse).toFixed(2)}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-black text-indigo-200 uppercase tracking-[0.2em] block mb-1">Economia</span>
                            <span className="text-lg font-black text-emerald-400">- M$ {menuCashToUse.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                      </div>

                      <button type="submit" disabled={isSaving} className="w-full bg-gray-900 text-white font-black py-6 rounded-[2.5rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-brand-primary transition-all active:scale-95">
                          {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'CONFIRMAR COMPRA'}
                      </button>
                  </form>
              </div>
           </div>
        )}
        <div className="h-4"></div>
     </div>
  );
};

const B2BTransactionsView = ({ user, setModalConfig }: { user: User, setModalConfig: (config: any) => void }) => {
  const [transactions, setTransactions] = useState<B2BTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    seller_name: '',
    amount: '',
    description: ''
  });
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [transactionToReject, setTransactionToReject] = useState<string | null>(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await supabaseService.getB2BTransactions(user.id);
      setTransactions(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const newTx = await supabaseService.createB2BTransaction({
        buyer_id: user.id,
        buyer_name: user.name,
        seller_id: 'mock_seller_id', // Na vida real, selecionaria o usuário
        seller_name: formData.seller_name,
        amount: parseFloat(formData.amount),
        description: formData.description
      });
      setTransactions(prev => [newTx, ...prev]);
      setIsModalOpen(false);
      setFormData({ seller_name: '', amount: '', description: '' });
    } catch (err) {
      console.error("Erro ao registrar:", err);
      setModalConfig({
        isOpen: true,
        title: 'Erro',
        message: 'Erro ao registrar transação.',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirm = async (id: string, isBuyer: boolean) => {
    setIsSaving(true);
    try {
      await supabaseService.confirmB2BTransaction(id, user.id, isBuyer);
      await loadTransactions();
    } catch (err) {
      console.error("Erro ao confirmar:", err);
      setModalConfig({
        isOpen: true,
        title: 'Erro',
        message: 'Erro ao confirmar.',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReject = async (id: string) => {
    setTransactionToReject(id);
    setIsRejectionModalOpen(true);
  };

  const confirmRejection = async () => {
    if (!transactionToReject) return;
    setIsSaving(true);
    try {
      await supabaseService.updateB2BTransactionStatus(transactionToReject, 'rejected');
      await loadTransactions();
      setIsRejectionModalOpen(false);
      setTransactionToReject(null);
    } catch (err) {
      console.error("Erro ao recusar:", err);
      setModalConfig({
        isOpen: true,
        title: 'Erro',
        message: 'Erro ao recusar.',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black uppercase italic tracking-tighter">Minhas Transações</h3>
          <p className="text-slate-500 font-medium text-sm">Histórico de compras e vendas utilizando Menu Cash.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-3xl animate-pulse"></div>)}
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
          <Handshake className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-gray-400 font-bold uppercase tracking-widest">Nenhuma transação registrada ainda.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map(tx => (
            <div key={tx.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${tx.status === 'confirmed' ? 'bg-emerald-500' : tx.status === 'rejected' ? 'bg-red-500' : 'bg-orange-500'}`}>
                  {tx.status === 'confirmed' ? <CheckCircle className="w-6 h-6" /> : tx.status === 'rejected' ? <X className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-lg">
                    {tx.buyer_id === user.id ? `Compra de ${tx.seller_name}` : `Venda para ${tx.buyer_name}`}
                  </h4>
                  <div className="flex flex-col gap-1 mt-1">
                    <p className="text-xs text-slate-500 font-medium">{tx.description}</p>
                    <p className="text-[10px] text-indigo-600 font-black uppercase">
                      {new Date(tx.created_at).toLocaleDateString()} às {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
                <div className="text-right flex items-center gap-6">
                <div className="space-y-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor Líquido</span>
                    <p className="text-xl font-black text-emerald-600">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tx.amount)}
                    </p>
                  </div>
                  {tx.total_amount && tx.total_amount !== tx.amount && (
                    <p className="text-[10px] font-bold text-slate-400">
                      Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tx.total_amount)}
                    </p>
                  )}
                  {tx.menu_cash_amount && tx.menu_cash_amount > 0 && (
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">M$ {tx.menu_cash_amount.toFixed(2)}</span>
                    </div>
                  )}
                  <p className={`text-[10px] font-black uppercase tracking-widest ${tx.status === 'confirmed' ? 'text-emerald-500' : tx.status === 'rejected' ? 'text-red-500' : 'text-orange-500'}`}>
                    {tx.status === 'confirmed' ? 'Confirmado' : tx.status === 'rejected' ? 'Recusado' : 'Aguardando Aprovaçao'}
                  </p>
                </div>
                
                {tx.status === 'pending' && (
                  <div className="flex flex-col gap-2">
                    {((tx.buyer_id === user?.id && !tx.buyer_confirmed) || (tx.seller_id === user?.id && !tx.seller_confirmed)) ? (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleConfirm(tx.id, tx.buyer_id === user?.id)}
                          className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] uppercase hover:bg-emerald-100 transition-all flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" /> EFETIVAR
                        </button>
                        <button 
                          onClick={() => handleReject(tx.id)}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-black text-[10px] uppercase hover:bg-red-100 transition-all flex items-center gap-2"
                        >
                          <X className="w-4 h-4" /> RECUSAR
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <div className="px-4 py-2 bg-gray-50 text-slate-400 rounded-xl font-black text-[10px] uppercase italic">
                          Aguardando outro lado...
                        </div>
                        {/* Botão de WhatsApp para cobrar o outro lado */}
                        <button
                          onClick={() => {
                            const isUserBuyer = tx.buyer_id === user?.id;
                            const targetPhone = isUserBuyer ? (tx as any).seller?.phone : (tx as any).buyer?.phone;
                            if (!targetPhone) return;
                            const msg = `Olá! Referente à proposta de compra via Menu Cash no item: ${tx.description}. \n\n💎 *Valor Total*: R$ ${(tx.total_amount || tx.amount).toFixed(2)} \n💎 *Menu Cash utilizado*: M$ ${(tx.menu_cash_amount || 0).toFixed(2)} \n💎 *Valor Líquido a Pagar*: R$ ${tx.amount.toFixed(2)}`;
                            window.open(`https://wa.me/${targetPhone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                          }}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#25D366]/10 text-[#25D366] rounded-xl hover:bg-[#25D366]/20 transition-all group"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span className="text-[9px] font-black uppercase tracking-widest">CHAMAR VIA WHATS</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {tx.status === 'confirmed' && (
                  <div className="flex flex-col gap-2">
                    {(() => {
                      const otherPartyPhone = tx.buyer_id === user.id 
                        ? (tx as any).seller?.phone 
                        : (tx as any).buyer?.phone;
                      
                      if (!otherPartyPhone) return null;

                      // Limpar o número para o link do WhatsApp (remover caracteres não numéricos)
                      const cleanPhone = otherPartyPhone.replace(/\D/g, '');
                      
                      return (
                        <a 
                          href={`https://wa.me/${cleanPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-[#25D366] text-white rounded-xl font-black text-[10px] uppercase hover:bg-[#128C7E] transition-all flex items-center gap-2 shadow-lg shadow-[#25D366]/20"
                        >
                          <MessageCircle className="w-4 h-4" /> CHAMAR VIA WHATS
                        </a>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: CONFIRMAÇAO DE RECUSA */}
      {isRejectionModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-scale-in">
            <div className="bg-red-600 p-8 text-white text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/30">
                <X className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">Recusar Transaçao</h3>
              <p className="text-sm font-bold text-red-100 mt-2">Esta açao é irreversível e o saldo de Menu Cash será estornado imediatamente.</p>
            </div>
            <div className="p-8 space-y-4">
              <button 
                onClick={confirmRejection}
                disabled={isSaving}
                className="w-full bg-red-600 text-white font-black py-5 rounded-2xl shadow-xl uppercase tracking-widest text-sm hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                {isSaving ? <RefreshCw className="animate-spin w-5 h-5" /> : 'SIM, RECUSAR AGORA'}
              </button>
              <button 
                onClick={() => { setIsRejectionModalOpen(false); setTransactionToReject(null); }}
                className="w-full bg-gray-100 text-slate-500 font-black py-5 rounded-2xl uppercase tracking-widest text-sm hover:bg-gray-200 transition-all"
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LevelsView = ({ user }: { user: User }) => {
  const levels = tiers;

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">🏆 NÍVEIS DO MENU CLUB</h2>
        <p className="text-slate-500 font-medium">Sua jornada de crescimento e autoridade dentro do ecossistema.</p>
      </div>

      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        {levels.map((level, i) => {
          const isCurrentLevel = user.level.toLowerCase() === level.name.toLowerCase();
          return (
            <div 
              key={i} 
              className={`group bg-white rounded-[2.5rem] p-8 md:p-10 border shadow-sm transition-all flex flex-col md:flex-row gap-8 items-start md:items-center relative overflow-hidden ${
                isCurrentLevel 
                ? 'border-brand-primary ring-8 ring-brand-primary/5 scale-[1.02] shadow-xl z-10' 
                : 'border-gray-100 opacity-80 hover:opacity-100 hover:border-gray-200 shadow-sm'
              }`}
            >
              {/* Background accent for current level */}
              {isCurrentLevel && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-bl-full -z-10 animate-pulse"></div>
              )}

              {/* Level Badge and Info */}
              <div className="flex items-center gap-6 md:w-1/3 shrink-0">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[2rem] ${level.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <Award className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900 uppercase italic leading-tight">{level.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                    <p className="text-[11px] font-black text-brand-primary uppercase tracking-widest">{level.points} pts</p>
                    <span className="hidden sm:inline text-gray-300">|</span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{level.criteria}</p>
                  </div>
                </div>
              </div>

              {/* Description and Benefits */}
              <div className="flex-1 space-y-4">
                <p className="text-base font-black text-indigo-600 italic">"{level.description}"</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                    {level.benefits.map((b, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs font-medium text-gray-500">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> {b}
                      </div>
                    ))}
                </div>
              </div>

              {/* Status */}
              <div className="md:w-32 shrink-0 flex justify-end w-full md:w-auto">
                {isCurrentLevel ? (
                  <div className="bg-emerald-100 text-emerald-700 px-6 py-3 rounded-2xl text-center font-black text-[10px] uppercase tracking-widest border border-emerald-200 backdrop-blur-sm w-full md:w-auto flex items-center justify-center gap-2">
                    <Zap className="w-3 h-3 fill-current" /> ATIVO
                  </div>
                ) : (
                  <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic group-hover:text-slate-400 transition-colors hidden md:block">
                    BLOQUEADO
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MissionsView = () => {
  const missions = [
    { title: 'Indicação Plano Start', desc: 'Traga um novo membro no plano Start.', pts: pointsRules.indicacaoBasico, icon: Users },
    { title: 'Indicação Plano PRO', desc: 'Traga um novo membro no plano PRO.', pts: pointsRules.indicacaoPro, icon: Crown },
    { title: 'Indicação Plano FULL', desc: 'Traga um novo membro no plano FULL.', pts: (pointsRules as any).indicacaoFull, icon: Rocket },
    { title: 'Compras no Menu Store', desc: 'A cada R$ 1,00 em compras = 1 ponto.', pts: `${pointsRules.compraMenuStore}:1`, icon: ShoppingBag },
    { title: 'Login Diário', desc: 'Acesse a plataforma diariamente.', pts: pointsRules.loginDiario, icon: Clock },
    { title: 'Pontos extras', desc: 'Participação em eventos, campanhas e outros.', pts: pointsRules.pontosExtras, icon: Sparkles }
  ];

  return (
    <div className="bg-white rounded-[3.5rem] p-10 md:p-16 border border-gray-100 shadow-xl space-y-12 animate-fade-in">
       <div className="flex justify-between items-end">
          <div>
            <h3 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">📊 PONTOS</h3>
            <p className="text-slate-500 font-medium mt-1">Os pontos determinam seu nível e ranking no ecossistema.</p>
          </div>
          <div className="bg-gray-50 px-6 py-3 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
             Simples. Claro. Objetivo.
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {missions.map((m, i) => (
             <div key={i} className="group p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 flex items-center justify-between hover:bg-white hover:shadow-xl transition-all cursor-pointer">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                      <m.icon className="w-7 h-7" />
                   </div>
                   <div>
                      <h4 className="font-black text-gray-900 text-lg leading-tight">{m.title}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-1">{m.desc}</p>
                   </div>
                </div>
                <div className="text-right">
                   <div className="flex items-center gap-1.5 text-brand-primary font-black text-xl italic">
                      {typeof m.pts === 'number' ? `+${m.pts}` : m.pts} <Zap className="w-4 h-4 fill-current" />
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

const RankingView = ({ user }: { user: User }) => {
  const [ranking, setRanking] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRanking();
  }, []);

  const loadRanking = async () => {
    setIsLoading(true);
    try {
      const [data, userPos] = await Promise.all([
        supabaseService.getRanking(10),
        supabaseService.getUserRankingPosition(user.points || 0)
      ]);
      setRanking(data);
      setUserRank(userPos);
    } catch (error) {
      console.error("Error loading ranking:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
       {/* Info Section */}
       <div className="bg-white rounded-[3rem] p-10 md:p-12 border border-gray-100 shadow-xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <div className="p-3 bg-yellow-50 rounded-2xl text-yellow-600">
                      <Medal className="w-6 h-6" />
                   </div>
                   <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">🥇 Ranking Oficial</h3>
                </div>
                <div className="space-y-3">
                   {[
                     "Atualização mensal",
                     rankingRules.top10Badge ? "Top 10 maiores pontuadores recebem badge especial" : "Top 5 maiores pontuadores",
                     rankingRules.top3Highlight ? "Top 3 ganham destaque na plataforma" : "Reconhecimento público"
                   ].map((text, i) => (
                     <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> {text}
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 space-y-6">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Divulgaçao:</p>
                <div className="grid grid-cols-2 gap-4">
                   {[
                     "Plataforma",
                     "Instagram",
                     "Eventos",
                     "Newsletter"
                   ].map((text, i) => (
                     <div key={i} className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-tight">
                        <div className="w-1.5 h-1.5 bg-brand-primary rounded-full"></div>
                        {text}
                     </div>
                   ))}
                </div>
                <div className="pt-4 border-t border-gray-200">
                   <p className="text-sm font-black text-gray-900 italic">"Reconhecimento é combustível de movimento."</p>
                </div>
             </div>
          </div>
       </div>

       {/* List Section */}
       <div className="bg-white rounded-[3.5rem] p-10 md:p-16 border border-gray-100 shadow-xl space-y-10">
          <div className="flex items-center gap-4">
             <div className="p-4 bg-yellow-50 rounded-2xl text-yellow-600">
                <Medal className="w-8 h-8" />
             </div>
             <div>
               <h3 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Ranking</h3>
               <p className="text-slate-500 font-medium">Os empreendedores mais influentes da rede.</p>
             </div>
          </div>

           <div className="space-y-4">
             {isLoading ? (
               <div className="space-y-4">
                 {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-3xl animate-pulse"></div>)}
               </div>
             ) : ranking.length === 0 ? (
               <div className="py-20 text-center">
                 <p className="text-slate-400 font-bold uppercase tracking-widest">Nenhum dado de ranking disponível.</p>
               </div>
             ) : (
               <>
                 {ranking.map((member, i) => {
                   const isCurrentUser = member.user_id === user.id;
                   return (
                     <div key={member.user_id || i} className={`flex items-center justify-between p-6 rounded-[2rem] border ${i === 0 ? 'bg-yellow-50/50 border-yellow-100 scale-105 shadow-lg' : isCurrentUser ? 'bg-indigo-50 border-indigo-200 shadow-md ring-2 ring-indigo-500/20' : 'bg-gray-50/50 border-gray-100'}`}>
                        <div className="flex items-center gap-6">
                           <span className={`font-black text-xl italic w-6 ${i === 0 ? 'text-yellow-500' : isCurrentUser ? 'text-indigo-600' : 'text-slate-300'}`}>#{i+1}</span>
                           <img src={member.logo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${member.business_name || member.name || 'U'}`} className="w-12 h-12 rounded-xl shadow-md object-cover" alt="Avatar" />
                           <div>
                              <h4 className={`font-black leading-none ${isCurrentUser ? 'text-indigo-900' : 'text-gray-900'}`}>
                                {member.business_name || member.name || 'Membro'} {isCurrentUser ? '(Você)' : ''}
                              </h4>
                              <p className="text-[10px] font-black text-indigo-600 uppercase mt-1">{member.city || member.level || ''}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="font-black text-gray-900">{member.points || 0} <span className="text-[10px] text-slate-400">PTS</span></span>
                           {i < 3 && <Crown className="w-4 h-4 text-yellow-500 fill-current" />}
                        </div>
                     </div>
                   );
                 })}
                 
                 {/* Mostrar a posição do usuário atual se ele não estiver no TOP 10 */}
                 {userRank !== null && userRank > 10 && (
                   <>
                     <div className="flex justify-center py-2">
                       <div className="w-1 h-8 border-l-2 border-dashed border-gray-300"></div>
                     </div>
                     <div className="flex items-center justify-between p-6 rounded-[2rem] border bg-indigo-50 border-indigo-200 shadow-md ring-2 ring-indigo-500/20 opacity-90">
                        <div className="flex items-center gap-6">
                           <span className="font-black text-xl italic w-12 text-indigo-600">#{userRank}</span>
                           <img src={user?.photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.business_name || user?.name || 'U'}`} className="w-12 h-12 rounded-xl shadow-md object-cover" alt="Você" />
                           <div>
                              <h4 className="font-black text-indigo-900 leading-none">{user?.business_name || user?.name || 'Você'} (Você)</h4>
                              <p className="text-[10px] font-black text-indigo-600 uppercase mt-1">{user?.city || user?.level || ''}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="font-black text-indigo-900">{user?.points || 0} <span className="text-[10px] text-indigo-500">PTS</span></span>
                        </div>
                     </div>   
                   </>
                 )}
               </>
             )}
          </div>
       </div>
    </div>
  );
};

const Meeting1x1View = ({ user, userProfile, setModalConfig }: { user: User, userProfile: any, setModalConfig: (config: any) => void }) => {
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
  }, [user.id, userProfile]);

  const loadData = async () => {
    setLoading(true);
    try {
      const realUserId = userProfile?.user_id || user.id;
      const [meetingsData, profilesData, rankingData] = await Promise.all([
        supabaseService.getMeetings1x1(realUserId),
        supabaseService.getAllProfiles(),
        supabaseService.getMeetingsRanking()
      ]);
      setMeetings(meetingsData);
      setProfiles(profilesData.filter(p => p.user_id !== realUserId));
      setRanking(rankingData);
    } catch (error) {
       console.error("Error loading meeting data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.guest_id || !formData.date || !formData.time || !formData.title) {
        setModalConfig({
          isOpen: true,
          title: 'Atenção',
          message: 'Por favor, preencha todos os campos obrigatórios.',
          type: 'info'
        });
      return;
    }

    try {
      const realUserId = userProfile?.user_id || user.id;
      const meetLink = `https://meet.google.com/${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
      
      await supabaseService.createMeeting1x1({
        creator_id: realUserId,
        guest_id: formData.guest_id,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        meet_link: formData.meet_link || meetLink
      });

      // Notify guest
      await supabaseService.createNotification({
        user_id: formData.guest_id,
        type: 'meeting',
        from_user_id: realUserId,
        from_user_name: userProfile?.business_name || user.name,
        from_user_avatar: userProfile?.logo_url || user.photo_url || '',
        content: `agendou um 1x1 com você: "${formData.title}"`,
        link: '/rewards'
      });

      setIsModalOpen(false);
      setFormData({ guest_id: '', date: '', time: '', title: '', description: '', meet_link: '' });
      loadData();
    } catch (error) {
      console.error("Error creating meeting:", error);
      setModalConfig({
        isOpen: true,
        title: 'Erro',
        message: 'Não foi possível agendar a reunião. Tente novamente.',
        type: 'error'
      });
    }
  };

  const handleComplete = async (mId: string) => {
    setModalConfig({
        isOpen: true,
        title: 'Finalizar Reunião',
        message: 'Confirmar que a reunião foi realizada? Isso atribuirá 10 pontos aos participantes.',
        type: 'info',
        confirmText: 'SIM, FOI REALIZADA',
        onConfirm: async () => {
            try {
                await supabaseService.completeMeeting1x1(mId);
                loadData();
                setModalConfig({
                    isOpen: true,
                    title: 'Sucesso!',
                    message: 'Reunião finalizada com sucesso e pontos distribuídos.',
                    type: 'success'
                });
              } catch (error) {
                setModalConfig({
                    isOpen: true,
                    title: 'Erro',
                    message: 'Ocorreu um erro ao finalizar a reunião. Verifique se você tem permissão.',
                    type: 'error'
                });
              }
        }
    });
  };

  const shareOnWhatsApp = (meeting: Meeting1x1) => {
    const guestName = (meeting as any).guest?.business_name || (meeting as any).guest?.name || "Convidado";
    const creatorName = user.business_name || user.name;
    
    const text = `📅 *Reunião 1x1 agendada!*
\n👤 *Participantes*: ${creatorName} + ${guestName}
\n⏰ *Horário*: ${new Date(meeting.date + 'T00:00:00').toLocaleDateString('pt-BR')} às ${meeting.time}
\n🔗 *Link da reunião*: ${meeting.meet_link}
\nConfirme sua presença 👇
\nhttps://menudenegocios.com/`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filteredProfiles = profiles.filter(p => 
    (p.business_name || p.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: meetings.filter(m => m.status === 'completed').length,
    points: meetings.filter(m => m.status === 'completed' && m.points_awarded).length * 10
  };

  const userRank = ranking.findIndex(r => r.user_id === user.id) + 1;

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
        
        <div className="lg:col-span-8 space-y-12">
           {/* Section 1: Agendadas */}
           <div className="space-y-6">
             <div className="flex items-center justify-between">
               <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter flex items-center gap-3">
                 <Calendar className="text-indigo-600" /> Próximas Reuniões Agendadas
               </h3>
               <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black">
                 {meetings.filter(m => m.status === 'scheduled' && (m.creator_id === (userProfile?.user_id || user.id) || m.guest_id === (userProfile?.user_id || user.id))).length} Total
               </span>
             </div>

             {loading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {[1,2].map(i => <div key={i} className="h-48 bg-gray-100 rounded-[2.5rem] animate-pulse"></div>)}
               </div>
             ) : meetings.filter(m => m.status === 'scheduled' && (m.creator_id === (userProfile?.user_id || user.id) || m.guest_id === (userProfile?.user_id || user.id))).length === 0 ? (
               <div className="py-20 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                  <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Nenhuma reunião agendada na sua agenda.</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {meetings.filter(m => m.status === 'scheduled' && (m.creator_id === (userProfile?.user_id || user.id) || m.guest_id === (userProfile?.user_id || user.id))).map((m) => {
                   const isCreator = m.creator_id === user.id;
                   const partner = isCreator ? (m as any).guest : (m as any).creator;
                   const partnerName = partner?.business_name || partner?.name || 'Membro';
                   
                   return (
                     <div key={m.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                       <div className="flex justify-between items-start mb-6">
                          <div className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-indigo-100 text-indigo-600">
                            Agendada
                          </div>
                          <span className="text-[10px] font-black text-slate-300 italic">#{m.id.substring(0,4)}</span>
                       </div>
                       
                       <h4 className="text-xl font-black text-gray-900 mb-2 truncate">{m.title}</h4>
                       <Link to={`/store/${partner.user_id}`} className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity">
                          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${partnerName}`} className="w-8 h-8 rounded-lg shadow-sm" alt="Partner" />
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Conector</p>
                            <p className="text-sm font-bold text-gray-700">{partnerName}</p>
                          </div>
                       </Link>

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
                          <button 
                            onClick={() => handleComplete(m.id)}
                            className="w-full flex items-center justify-center gap-2 bg-white text-emerald-600 border border-emerald-200 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-emerald-50 transition-all active:scale-95"
                          >
                            <CheckCircle className="w-3 h-3" /> MARCAR COMO CONCLUÍDA
                          </button>
                       </div>
                     </div>
                   );
                 })}
               </div>
             )}
           </div>

           {/* Section 2: Concluídas (Histórico) */}
           {meetings.filter(m => m.status === 'completed').length > 0 && (
             <div className="space-y-6 pt-10 border-t border-gray-100">
               <div className="flex items-center justify-between">
                 <h3 className="text-lg font-black text-slate-400 uppercase italic tracking-tighter flex items-center gap-3">
                   <Clock className="w-5 h-5" /> Reuniões Concluídas recentemente
                 </h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {meetings.filter(m => m.status === 'completed').map((m) => {
                   const creatorO = (m as any).creator;
                   const guestO = (m as any).guest;
                   const cName = creatorO?.business_name || creatorO?.name || 'Membro';
                   const gName = guestO?.business_name || guestO?.name || 'Membro';
                   const meetingDescriptor = `${cName} e ${gName}`;
                   
                   return (
                     <div key={m.id} className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                          <div className="flex -space-x-3">
                            <img src={creatorO?.logo_url || creatorO?.photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${cName}`} className="w-10 h-10 rounded-full border-2 border-white bg-white" alt={cName} />
                            <img src={guestO?.logo_url || guestO?.photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${gName}`} className="w-10 h-10 rounded-full border-2 border-white bg-white" alt={gName} />
                          </div>
                          <div>
                            <h5 className="text-sm font-black text-gray-900 leading-none mb-1">{m.title}</h5>
                            <p className="text-[10px] font-bold text-slate-400 uppercase truncate max-w-[150px] md:max-w-md">{meetingDescriptor} • {new Date(m.date + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                          </div>
                       </div>
                       <div className="flex flex-col items-end">
                          <span className="text-[8px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded-md mb-1">+10 PONTOS</span>
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                       </div>
                     </div>
                   );
                 })}
               </div>
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
                {ranking.slice(0, 5).map((member, i) => (
                   <div key={member.user_id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-indigo-100 transition-all">
                      <div className="flex items-center gap-4">
                        <span className={`font-black text-sm italic w-4 ${i === 0 ? 'text-yellow-500' : 'text-slate-300'}`}>#${i + 1}</span>
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

      {/* MODAL: CRIAR REUNIAO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in">
             <div className="bg-gray-900 p-5 text-white flex justify-between items-center">
                <div>
                   <h3 className="text-lg font-black uppercase italic tracking-tighter leading-none">Agendar 1x1</h3>
                   <p className="text-[8px] font-black text-indigo-400 tracking-[0.2em] mt-1.5 uppercase">Conecte-se com um novo parceiro</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full transition-all text-white/40 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
             </div>

             <form onSubmit={handleCreateMeeting} className="p-5 space-y-3">
                
                {/* Selecionar Usuário */}
                <div>
                   <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Selecione o Parceiro (Obrigatório)</label>
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300" />
                      <input 
                        type="text"
                        placeholder="Buscar parceiro..."
                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border-none rounded-xl font-bold text-[11px] focus:ring-1 focus:ring-indigo-500/20 transition-all mb-1.5"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                   </div>
                   <div className="max-h-24 overflow-y-auto pr-1.5 space-y-1 custom-scrollbar">
                      {filteredProfiles.length === 0 ? (
                        <p className="text-[9px] text-center text-slate-400 py-2 uppercase font-bold italic">Nenhum encontrado</p>
                      ) : (
                        filteredProfiles.map(p => (
                          <button
                            key={p.user_id}
                            type="button"
                            onClick={() => {
                              setFormData({...formData, guest_id: p.user_id});
                              setSearchTerm(p.business_name || p.name);
                            }}
                            className={`w-full flex items-center gap-2.5 p-2 rounded-lg border transition-all ${formData.guest_id === p.user_id ? 'border-indigo-600 bg-indigo-50' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}
                          >
                             <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${p.business_name || p.name}`} className="w-6 h-6 rounded-md" alt="Avatar" />
                             <div className="text-left">
                                <p className="text-[9px] font-black text-gray-900 leading-none">{p.business_name || p.name}</p>
                             </div>
                             {formData.guest_id === p.user_id && <CheckCircle className="ml-auto w-3.5 h-3.5 text-indigo-600" />}
                          </button>
                        ))
                      )}
                   </div>
                </div>

                <div>
                   <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Título</label>
                   <input 
                      required
                      type="text" 
                      placeholder="Ex: Alinhamento de Parceria"
                      className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-xs" 
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})} 
                   />
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <div>
                      <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Data</label>
                      <input 
                        required
                        type="date" 
                        className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-xs" 
                        value={formData.date} 
                        onChange={e => setFormData({...formData, date: e.target.value})} 
                      />
                   </div>
                   <div>
                      <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Horário</label>
                      <input 
                        required
                        type="time" 
                        className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-xs" 
                        value={formData.time} 
                        onChange={e => setFormData({...formData, time: e.target.value})} 
                      />
                   </div>
                </div>

                <div>
                   <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Link da Reunião (Google Meet)</label>
                   <input 
                      type="text" 
                      placeholder="https://meet.google.com/..."
                      className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-xs" 
                      value={formData.meet_link} 
                      onChange={e => setFormData({...formData, meet_link: e.target.value})} 
                   />
                </div>

                <div>
                   <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Descrição (Opcional)</label>
                   <textarea 
                      rows={1}
                      placeholder="Pauta da reunião..."
                      className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-xs resize-none" 
                      value={formData.description} 
                      onChange={e => setFormData({...formData, description: e.target.value})} 
                   />
                </div>

                <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl shadow-lg uppercase tracking-widest text-[9px] hover:bg-brand-primary transition-all active:scale-95 mt-1 border border-indigo-500">
                  CONFIRMAR AGENDAMENTO
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- NEW COMMUNITY FEED COMPONENTS ---

const CommunityFeedView = ({ user, userProfile, setModalConfig }: { user: User, userProfile: any, setModalConfig: (config: any) => void }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'feed' | 'opportunities'>('feed');
  const [showPostModal, setShowPostModal] = useState(false);
  const [showOppModal, setShowOppModal] = useState(false);
  const [newPost, setNewPost] = useState<{content: string, type: 'pitch' | 'business'}>({ content: '', type: 'pitch' });
  const [newOpp, setNewOpp] = useState({ title: '', description: '', type: 'service_search', deadline: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [postsData, oppsData] = await Promise.all([
      supabaseService.getCommunityPosts(),
      supabaseService.getOpportunities()
    ]);
    setPosts(postsData);
    setOpportunities(oppsData);
    setLoading(false);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.content.trim()) return;

    try {
      const realUserId = userProfile?.user_id || user.id;
      
      await supabaseService.createCommunityPost({
        user_id: realUserId,
        user_name: user.name,
        business_name: user.business_name,
        user_avatar: userProfile?.logo_url || user.photo_url || '',
        content: newPost.content,
        type: newPost.type
      });
      setNewPost({ content: '', type: 'pitch' });
      setShowPostModal(false);
      loadData();
    } catch (error) {
      setModalConfig({
        isOpen: true,
        title: 'Erro',
        message: 'Erro ao publicar.',
        type: 'error'
      });
    }
  };

  const handleCreateOpp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOpp.title.trim() || !newOpp.description.trim()) return;

    try {
      const realUserId = userProfile?.user_id || user.id;

      await supabaseService.createOpportunity({
        user_id: realUserId,
        ...newOpp
      });
      setNewOpp({ title: '', description: '', type: 'service_search', deadline: '' });
      setShowOppModal(false);
      loadData();
    } catch (error) {
      setModalConfig({
        isOpen: true,
        title: 'Erro',
        message: 'Erro ao publicar oportunidade.',
        type: 'error'
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header with Switcher and Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm">
        <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full md:w-auto">
          <button 
            onClick={() => setActiveSubTab('feed')}
            className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeSubTab === 'feed' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-indigo-600'}`}
          >
            Feed da Comunidade
          </button>
          <button 
            onClick={() => setActiveSubTab('opportunities')}
            className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeSubTab === 'opportunities' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-500 hover:text-emerald-600'}`}
          >
            Mural de Oportunidades
          </button>
        </div>
        
        <button 
          onClick={() => activeSubTab === 'feed' ? setShowPostModal(true) : setShowOppModal(true)}
          className={`w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest text-white shadow-lg shadow-indigo-200 transition-all active:scale-95 ${activeSubTab === 'feed' ? 'bg-indigo-600' : 'bg-emerald-600'}`}
        >
          <Plus className="w-4 h-4" /> {activeSubTab === 'feed' ? 'NOVA PUBLICAÇÃO' : 'PUBLICAR OPORTUNIDADE'}
        </button>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-[2.5rem] animate-pulse"></div>)}
        </div>
      ) : activeSubTab === 'feed' ? (
        <CommunityFeed posts={posts} user={user} userProfile={userProfile} onRefresh={loadData} setModalConfig={setModalConfig} />
      ) : (
        <OpportunitiesMural opportunities={opportunities} user={user} userProfile={userProfile} onRefresh={loadData} setModalConfig={setModalConfig} />
      )}

      {/* MODAL: NOVA PUBLICAÇÃO */}
      {showPostModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in">
            <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
              <div>
                 <h3 className="text-xl font-black uppercase italic tracking-tighter">Criar Nova Publicação</h3>
                 <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mt-1">Gere visibilidade para seu negócio</p>
              </div>
              <button onClick={() => setShowPostModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-all text-white/60 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreatePost} className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Tipo de Conteúdo</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setNewPost({...newPost, type: 'pitch'})}
                    className={`p-4 rounded-2xl border-2 transition-all text-left ${newPost.type === 'pitch' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <p className="font-black text-gray-900 text-xs uppercase">Pitch de Entrada</p>
                    <p className="text-[10px] text-slate-500 font-medium">Apresente-se à rede</p>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setNewPost({...newPost, type: 'business'})}
                    className={`p-4 rounded-2xl border-2 transition-all text-left ${newPost.type === 'business' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <p className="font-black text-gray-900 text-xs uppercase">Atualização</p>
                    <p className="text-[10px] text-slate-500 font-medium">Novidades da empresa</p>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Seu Post</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full bg-gray-50 border-none rounded-2xl p-6 font-medium text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="O que você quer compartilhar hoje?"
                  value={newPost.content}
                  onChange={e => setNewPost({...newPost, content: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all active:scale-95">
                PUBLICAR AGORA
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NOVA OPORTUNIDADE */}
      {showOppModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in">
            <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
              <div>
                 <h3 className="text-xl font-black uppercase italic tracking-tighter">Publicar Oportunidade</h3>
                 <p className="text-[10px] font-black text-emerald-100 uppercase tracking-widest mt-1">Encontre parceiros e fornecedores</p>
              </div>
              <button onClick={() => setShowOppModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-all text-white/60 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateOpp} className="p-8 space-y-4">
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Título</label>
                  <input 
                    required
                    type="text"
                    className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold text-sm"
                    placeholder="Ex: Procuro desenvolvedor React"
                    value={newOpp.title}
                    onChange={e => setNewOpp({...newOpp, title: e.target.value})}
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Tipo</label>
                    <select 
                      className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold text-sm"
                      value={newOpp.type}
                      onChange={e => setNewOpp({...newOpp, type: e.target.value as any})}
                    >
                      <option value="service_search">Busca de Serviço</option>
                      <option value="partnership">Parceria Estratégica</option>
                      <option value="supplier">Fornecedor</option>
                      <option value="project">Projeto Específico</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Prazo (opcional)</label>
                    <input 
                      type="text"
                      className="w-full bg-gray-50 border-none rounded-xl p-4 font-bold text-sm"
                      placeholder="Ex: 30 dias"
                      value={newOpp.deadline}
                      onChange={e => setNewOpp({...newOpp, deadline: e.target.value})}
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Descrição</label>
                  <textarea 
                    required
                    rows={3}
                    className="w-full bg-gray-50 border-none rounded-xl p-4 font-medium text-sm"
                    placeholder="Descreva sua demanda em detalhes..."
                    value={newOpp.description}
                    onChange={e => setNewOpp({...newOpp, description: e.target.value})}
                  />
               </div>
               <button type="submit" className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl shadow-xl uppercase tracking-widest text-sm hover:bg-emerald-700 transition-all active:scale-95">
                 PUBLICAR OPORTUNIDADE
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const CommunityFeed = ({ posts, user, userProfile, onRefresh, setModalConfig }: { posts: any[], user: User, userProfile: any, onRefresh: () => void, setModalConfig: (config: any) => void }) => {
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const handleLike = async (postId: string) => {
    try {
      const realUserId = userProfile?.user_id || user.id;
      const post = posts.find(p => p.id === postId);
      const isAlreadyLiked = (post?.liked_by || []).includes(realUserId);
      
      await supabaseService.likePost(postId, realUserId);
      
      if (!isAlreadyLiked && post && post.user_id !== realUserId) {
        await supabaseService.createNotification({
          user_id: post.user_id,
          type: 'like',
          from_user_id: realUserId,
          from_user_name: userProfile?.business_name || user.name,
          from_user_avatar: userProfile?.logo_url || user.photo_url || '',
          content: `curtiu sua publicação.`,
          link: '/rewards'
        });
      }
      
      onRefresh();
    } catch (error) {
       console.error(error);
    }
  };

  const handleComment = async (postId: string) => {
    if (!commentText.trim()) return;
    try {
      const realUserId = userProfile?.user_id || user.id;
      
      // Parse mentions
      const mentions = commentText.match(/@(\w+)/g) || [];
      
      await supabaseService.addCommentToPost(postId, {
        user_id: realUserId,
        user_name: userProfile?.business_name || user.name,
        user_avatar: userProfile?.logo_url || user.photo_url || '',
        content: commentText
      });

      // Send notifications for mentions
      for (const mention of mentions) {
        const username = mention.substring(1);
        const mentionedProfiles = await supabaseService.searchProfiles(username);
        const targetProfile = mentionedProfiles.find(p => (p.business_name || p.name).toLowerCase().replace(/\s+/g, '') === username.toLowerCase());
        
        if (targetProfile && targetProfile.user_id !== realUserId) {
          await supabaseService.createNotification({
            user_id: targetProfile.user_id,
            type: 'mention',
            from_user_id: realUserId,
            from_user_name: userProfile?.business_name || user.name,
            from_user_avatar: userProfile?.logo_url || user.photo_url || '',
            content: `mencionou você em um comentário.`,
            link: '/rewards' // Open feed
          });
        }
      }

      setCommentText('');
      setCommentingOn(null);
      onRefresh();
    } catch (error) {
       console.error(error);
    }
  };

  const handleEdit = async (postId: string, currentContent: string) => {
    const newContent = window.prompt("Editar publicação:", currentContent);
    if (!newContent || newContent.trim() === currentContent) return;
    
    try {
      await supabaseService.updateCommunityPost(postId, newContent.trim());
      onRefresh();
    } catch (error) {
      setModalConfig({
        isOpen: true,
        title: 'Erro',
        message: 'Erro ao editar publicação.',
        type: 'error'
      });
    }
  };

  const handleDelete = async (postId: string) => {
    setModalConfig({
      isOpen: true,
      title: 'Excluir Publicação',
      message: 'Deseja realmente excluir esta publicação?',
      type: 'info',
      confirmText: 'EXCLUIR',
      onConfirm: async () => {
        try {
          await supabaseService.deleteCommunityPost(postId);
          onRefresh();
        } catch (error) {
          setModalConfig({
            isOpen: true,
            title: 'Erro',
            message: 'Erro ao excluir publicação.',
            type: 'error'
          });
        }
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {posts.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-[3rem] border border-gray-100 flex flex-col items-center">
            <Megaphone className="w-16 h-16 text-slate-200 mb-6" />
            <h3 className="text-xl font-black text-gray-900 uppercase italic">Nada por aqui ainda</h3>
            <p className="text-slate-400 font-medium mt-2">Clique no botão acima e faça seu primeiro pitch!</p>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className={`bg-white rounded-[2.5rem] border overflow-hidden shadow-sm transition-all hover:shadow-xl ${post.is_pinned ? 'border-indigo-600 ring-2 ring-indigo-50/50' : 'border-gray-100'}`}>
            {post.is_pinned && (
              <div className="bg-indigo-600 px-6 py-2 flex items-center gap-2 text-white">
                <ZapIcon className="w-3 h-3 fill-current" />
                <span className="text-[9px] font-black uppercase tracking-widest">Aviso Importante</span>
              </div>
            )}
            
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <Link to={`/store/${post.user_id}`} className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                  <img 
                    src={post.author?.logo_url || post.author?.photo_url || post.user_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${post.business_name || post.user_name}`} 
                    className="w-12 h-12 rounded-2xl shadow-md border-2 border-white ring-4 ring-gray-50 object-cover"
                    alt="Avatar"
                  />
                  <div>
                    <h4 className="font-black text-gray-900 leading-none">{post.business_name || post.user_name}</h4>
                    <p className="text-[10px] font-black text-indigo-600 uppercase mt-1 tracking-tight">
                      {post.type === 'pitch' ? '💼 Pitch Profissional' : post.type === 'automated' ? '🎉 Movimentação' : '📢 Atualização'}
                    </p>
                  </div>
                </Link>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(post.created_at).toLocaleDateString()}</span>
                  {(post.user_id === user.id || post.user_id === userProfile?.user_id) && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(post.id, post.content)} className="text-[9px] font-black uppercase text-indigo-600 hover:text-indigo-800 tracking-widest transition-colors">Editar</button>
                      <button onClick={() => handleDelete(post.id)} className="text-[9px] font-black uppercase text-red-500 hover:text-red-700 tracking-widest transition-colors">Excluir</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">
                  {post.content.split(/(\s+)/).map((word: string, i: number) => {
                    if (word.startsWith('@') && word.length > 1) {
                      const slug = word.substring(1);
                      return (
                        <Link key={i} to={`/${slug}`} className="text-indigo-600 font-bold hover:underline">
                          {word}
                        </Link>
                      );
                    }
                    return word;
                  })}
                </p>
                {post.image_url && (
                  <img src={post.image_url} className="rounded-3xl w-full h-64 object-cover shadow-lg" alt="Post content" />
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-8">
                <button 
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 text-xs font-black transition-all ${(post.liked_by || []).includes(userProfile?.user_id || user.id) ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}
                >
                  <Heart className={`w-5 h-5 ${(post.liked_by || []).includes(userProfile?.user_id || user.id) ? 'fill-current' : ''}`} />
                  {post.likes || 0}
                </button>
                <button 
                  onClick={() => setCommentingOn(commentingOn === post.id ? null : post.id)}
                  className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-indigo-600 transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  {post.comments?.length || 0}
                </button>
                <button className="ml-auto text-xs font-black text-slate-400 hover:text-gray-900 transition-all uppercase tracking-widest flex items-center gap-2">
                  <Share2 className="w-4 h-4" /> COMPARTILHAR
                </button>
              </div>

              {/* Comments Section */}
              {(commentingOn === post.id || post.comments?.length > 0) && (
                <div className="mt-6 space-y-4 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                  {post.comments?.map((c: any, ci: number) => (
                    <div key={ci} className="flex gap-3">
                      <Link to={`/store/${c.user_id}`}>
                        <img src={c.user_avatar} className="w-6 h-6 rounded-lg hover:opacity-80 transition-opacity" alt="Avatar" />
                      </Link>
                      <div>
                        <Link to={`/store/${c.user_id}`} className="text-[10px] font-black text-gray-900 leading-none hover:text-indigo-600 transition-colors uppercase">{c.user_name}</Link>
                        <p className="text-xs text-gray-600 mt-1">
                          {c.content.split(/(\s+)/).map((word: string, i: number) => {
                            if (word.startsWith('@') && word.length > 1) {
                              const slug = word.substring(1);
                              return (
                                <Link key={i} to={`/${slug}`} className="text-indigo-600 font-bold hover:underline">
                                  {word}
                                </Link>
                              );
                            }
                            return word;
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {commentingOn === post.id && (
                    <div className="flex gap-3 mt-4">
                      <input 
                        className="flex-1 bg-white border-2 border-gray-100 rounded-xl px-4 py-2 text-xs font-medium focus:ring-0 focus:border-indigo-500"
                        placeholder="Escreva um comentário..."
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleComment(post.id)}
                      />
                      <button 
                        onClick={() => handleComment(post.id)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"
                      >
                        Enviar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const OpportunitiesMural = ({ opportunities, user, userProfile, onRefresh, setModalConfig }: { opportunities: any[], user: User, userProfile: any, onRefresh: () => void, setModalConfig: (config: any) => void }) => {
  const handleInterest = async (oppId: string, authorPhone: string) => {
    try {
      const realUserId = userProfile?.user_id || user.id;
      await supabaseService.expressInterestInOpportunity(oppId, realUserId);
      onRefresh();
      
      if (authorPhone) {
        const cleanPhone = authorPhone.replace(/\D/g, '');
        if (cleanPhone) {
          window.open(`https://wa.me/55${cleanPhone.startsWith('55') ? cleanPhone.substring(2) : cleanPhone}?text=Olá!%20Vi%20sua%20oportunidade%20no%20Menu%20de%20Negócios%20e%20tenho%20interesse.`, '_blank');
        } else {
          setModalConfig({
            isOpen: true,
            title: 'Informação',
            message: 'Seu interesse foi registrado, mas o autor não possui um WhatsApp válido cadastrado.',
            type: 'info'
          });
        }
      } else {
        setModalConfig({
          isOpen: true,
          title: 'Informação',
          message: 'Seu interesse foi registrado, mas o autor não possui um número de telefone cadastrado.',
          type: 'info'
        });
      }
    } catch (error) {
       console.error(error);
    }
  };

  const handleEdit = async (oppId: string, currentTitle: string, currentDesc: string) => {
    const newTitle = window.prompt("Editar título da oportunidade:", currentTitle);
    if (newTitle === null) return;
    
    const newDesc = window.prompt("Editar descrição da oportunidade:", currentDesc);
    if (newDesc === null) return;

    if (newTitle.trim() === currentTitle && newDesc.trim() === currentDesc) return;
    
    try {
      await supabaseService.updateOpportunity(oppId, { title: newTitle.trim(), description: newDesc.trim() });
      onRefresh();
    } catch (error) {
      setModalConfig({
        isOpen: true,
        title: 'Erro',
        message: 'Erro ao editar oportunidade.',
        type: 'error'
      });
    }
  };

  const handleDelete = async (oppId: string) => {
    setModalConfig({
      isOpen: true,
      title: 'Excluir Oportunidade',
      message: 'Deseja realmente excluir esta oportunidade?',
      type: 'info',
      confirmText: 'EXCLUIR',
      onConfirm: async () => {
        try {
          await supabaseService.deleteOpportunity(oppId);
          onRefresh();
        } catch (error) {
          setModalConfig({
            isOpen: true,
            title: 'Erro',
            message: 'Erro ao excluir oportunidade.',
            type: 'error'
          });
        }
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {opportunities.length === 0 ? (
        <div className="col-span-2 py-20 text-center bg-white rounded-[3rem] border border-gray-100 flex flex-col items-center">
            <Trophy className="w-16 h-16 text-slate-200 mb-6" />
            <h3 className="text-xl font-black text-gray-900 uppercase italic">Nenhuma oportunidade aberta</h3>
            <p className="text-slate-400 font-medium mt-2">Dê o primeiro passo e publique uma demanda!</p>
        </div>
      ) : (
        opportunities.map((opp) => {
          const realUserId = userProfile?.user_id || user.id;
          const isOwner = opp.user_id === realUserId;
          const hasInterest = (opp.interested_user_ids || []).includes(realUserId);
          
          return (
            <div key={opp.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    opp.type === 'service_search' ? 'bg-blue-50 text-blue-600' :
                    opp.type === 'partnership' ? 'bg-purple-50 text-purple-600' :
                    opp.type === 'supplier' ? 'bg-orange-50 text-orange-600' :
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    {opp.type === 'service_search' ? 'Procuro Serviço' :
                     opp.type === 'partnership' ? 'Parceria' :
                     opp.type === 'supplier' ? 'Fornecedor' :
                     'Demanda de Projeto'}
                  </div>
                  {opp.deadline && (
                    <div className="flex items-center gap-1.5 text-red-500 font-black text-[9px] uppercase tracking-widest bg-red-50 px-3 py-1.5 rounded-full">
                       <Clock className="w-3 h-3" /> {opp.deadline}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors uppercase italic tracking-tighter leading-tight pr-4">
                    {opp.title}
                  </h4>
                  {isOwner && (
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(opp.id, opp.title, opp.description)} className="text-[9px] font-black uppercase text-indigo-600 hover:text-indigo-800 tracking-widest transition-colors bg-indigo-50 px-2 py-1 rounded-md">Editar</button>
                      <button onClick={() => handleDelete(opp.id)} className="text-[9px] font-black uppercase text-red-500 hover:text-red-700 tracking-widest transition-colors bg-red-50 px-2 py-1 rounded-md">Excluir</button>
                    </div>
                  )}
                </div>
                
                <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8 line-clamp-3">
                  {opp.description}
                </p>

                <div className="flex items-center gap-3 mb-8 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                  <img src={opp.author?.logo_url || opp.author?.photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${opp.author?.name}`} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Autor</p>
                    <p className="text-xs font-black text-gray-900">{opp.author?.business_name || opp.author?.name}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  disabled={isOwner || hasInterest}
                  onClick={() => handleInterest(opp.id, opp.author?.phone || '')}
                  className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                    hasInterest ? 'bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-none' :
                    isOwner ? 'bg-gray-100 text-slate-400 border border-gray-200 shadow-none' :
                    'bg-gray-900 text-white hover:bg-black'
                  }`}
                >
                  <HandHeart className="w-4 h-4" /> {hasInterest ? 'JÁ MANIFESTEI INTERESSE' : isOwner ? 'SUA OPORTUNIDADE' : 'TENHO INTERESSE'}
                </button>
                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400">
                  <Users className="w-3 h-3" /> {opp.interested_user_ids?.length || 0} membros interessados
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Rewards;
