
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { 
  Trophy, Gift, Share2, Copy, TrendingUp, Users, 
  ShoppingBag, Star, CheckCircle, ArrowRight, 
  Zap, Crown, Wallet, Shield, Sparkles, ChevronRight,
  Check, ListTodo, History, LayoutGrid, MapPin, Search,
  Briefcase, MessageSquare, PlusCircle, RefreshCw, Rocket,
  Info, Award, Flame, Target, Medal
} from 'lucide-react';
import { Prize, PointsTransaction } from '../types';

export const Rewards: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'acceleration' | 'store' | 'missions' | 'history'>('acceleration');
  const [history, setHistory] = useState<PointsTransaction[]>([]);
  const [copied, setCopied] = useState(false);
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

  const prizes: Prize[] = [
    { id: '1', title: 'Voucher iFood R$ 30', cost: 500, imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600' },
    { id: '2', title: 'Consultoria de Marketing (30min)', cost: 1000, imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600' },
    { id: '3', title: 'Parceria de Co-branding (Destaque)', cost: 3000, imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=600' },
    { id: '4', title: 'Curso Gestão Academy', cost: 2000, imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600' },
  ];

  const officialLevels = [
    { id: 'bronze', label: 'Bronze', min: 0, max: 999, color: 'text-orange-500', bg: 'bg-orange-50', icon: Shield, desc: 'Acesso às ferramentas básicas e comunidade.' },
    { id: 'prata', label: 'Prata', min: 1000, max: 4999, color: 'text-slate-400', bg: 'bg-slate-50', icon: Star, desc: 'Selo de verificado e prioridade nas buscas locais.' },
    { id: 'ouro', label: 'Ouro', min: 5000, max: Infinity, color: 'text-yellow-500', bg: 'bg-yellow-50', icon: Crown, desc: 'Suporte VIP e mentoria exclusiva com IA Pro.' },
  ];

  const currentLevelInfo = officialLevels.find(l => user.points >= l.min && user.points <= l.max) || officialLevels[0];
  const nextLevel = officialLevels[officialLevels.indexOf(currentLevelInfo) + 1] || null;

  const getLevelProgress = () => {
    if (!nextLevel) return 100;
    const range = nextLevel.min - currentLevelInfo.min;
    const progress = user.points - currentLevelInfo.min;
    return (progress / range) * 100;
  };

  const missions = [
    { title: 'Completar Perfil', points: 20, icon: CheckCircle, category: 'engajamento' },
    { title: 'Criar ou Atualizar Catálogo', points: 20, icon: ShoppingBag, category: 'engajamento' },
    { title: 'Criar Novo Cupom', points: 20, icon: Gift, category: 'engajamento' },
    { title: 'Publicar na Comunidade', points: 20, icon: MessageSquare, category: 'engajamento' },
    { title: 'Indicar Novo Membro Pro', points: 50, icon: PlusCircle, category: 'indicacao' },
    { title: 'Participar de Workshops', points: 50, icon: Briefcase, category: 'especial' },
  ];

  const affiliateLink = `${window.location.origin}/#/register?ref=${user.referralCode}`;
  const copyLink = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const localRanking = [
    { name: 'Ana Doces', pts: 6240, level: 'ouro', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Ana' },
    { name: 'João Tech', pts: 4850, level: 'prata', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Joao' },
    { name: 'Marta Café', pts: 3900, level: 'prata', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Marta' },
    { name: 'Lucas Fit', pts: 2100, level: 'bronze', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Lucas' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 pt-4 px-4">
      
      {/* 1. PREMIUM HEADER / PROGRESS CENTER */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5">
        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-5 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl">
                 <Trophy className="h-10 w-10 text-yellow-400" />
              </div>
              <div>
                 <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none mb-2">Clube ADS</h1>
                 <p className="text-indigo-200 text-lg font-medium opacity-70">Onde sua atividade local vira recompensa real.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="bg-black/20 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-xl group hover:border-white/20 transition-all">
                  <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-3">Saldo Disponível</p>
                  <div className="flex items-center gap-3">
                     <span className="text-5xl font-black text-white">{user.points}</span>
                     <Zap className="w-8 h-8 text-yellow-400 fill-current animate-pulse" />
                  </div>
               </div>
               <div className="bg-black/20 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-xl group hover:border-white/20 transition-all">
                  <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-3">Nível de Membro</p>
                  <div className="flex items-center gap-3">
                     <span className="text-3xl font-black text-yellow-400 uppercase tracking-tighter">{user.level}</span>
                     <currentLevelInfo.icon className="w-8 h-8 text-yellow-400" />
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 space-y-8">
             <div className="flex justify-between items-end">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Sua Próxima Conquista</p>
                   <h4 className="text-2xl font-black text-white uppercase tracking-tight">Nível {nextLevel?.label || 'Máximo'}</h4>
                </div>
                <div className="text-right">
                   <span className="text-sm font-black text-indigo-200 uppercase tracking-widest">{nextLevel ? `${nextLevel.min - user.points} PTS Faltando` : 'Parabéns!'}</span>
                </div>
             </div>

             <div className="relative pt-2">
                <div className="h-4 w-full bg-indigo-950 rounded-full overflow-hidden p-1 border border-white/10">
                   <div 
                      className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.5)] transition-all duration-1000 ease-out"
                      style={{ width: `${getLevelProgress()}%` }}
                   ></div>
                </div>
                <div className="flex justify-between mt-4 text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400 px-1">
                   <span>{currentLevelInfo.min} PTS</span>
                   <span>{nextLevel ? `${nextLevel.min} PTS` : 'ELITE'}</span>
                </div>
             </div>
             
             <p className="text-indigo-200/50 text-xs font-medium leading-relaxed italic">
                "{nextLevel ? `Complete missões diárias para desbloquear o status ${nextLevel.label} e ganhar mais visibilidade local.` : 'Você é um membro de elite no Menu ADS. Aproveite todos os benefícios Ouro.'}"
             </p>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none -mr-64 -mt-64"></div>
      </div>

      {/* 2. GAME NAVIGATION */}
      <div className="sticky top-[-1px] z-50 py-4 -mx-4 px-4 bg-gray-50/80 backdrop-blur-lg transition-all duration-300">
        <div className="flex p-2 bg-white/90 rounded-[2.5rem] border border-gray-200 shadow-2xl max-w-4xl mx-auto ring-4 ring-black/5">
            <button 
              onClick={() => setActiveTab('acceleration')} 
              className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[1.8rem] font-black text-xs tracking-widest transition-all ${activeTab === 'acceleration' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-[1.02]' : 'text-gray-400 hover:bg-gray-50'}`}
            >
                <Rocket className="w-4 h-4" /> ACELERAÇÃO
            </button>
            <button 
              onClick={() => setActiveTab('missions')} 
              className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[1.8rem] font-black text-xs tracking-widest transition-all ${activeTab === 'missions' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-[1.02]' : 'text-gray-400 hover:bg-gray-50'}`}
            >
                <ListTodo className="w-4 h-4" /> MISSÕES
            </button>
            <button 
              onClick={() => setActiveTab('store')} 
              className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[1.8rem] font-black text-xs tracking-widest transition-all ${activeTab === 'store' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-[1.02]' : 'text-gray-400 hover:bg-gray-50'}`}
            >
                <Gift className="w-4 h-4" /> RESGATAR
            </button>
            <button 
              onClick={() => setActiveTab('history')} 
              className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[1.8rem] font-black text-xs tracking-widest transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-[1.02]' : 'text-gray-400 hover:bg-gray-50'}`}
            >
                <History className="w-4 h-4" /> EXTRATO
            </button>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {activeTab === 'acceleration' && (
          <div className="space-y-16">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest">
                 <Info className="w-4 h-4" /> Como funciona o Clube?
              </div>
              <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Onde sua atividade local vira lucro.</h2>
              <p className="text-gray-500 dark:text-white text-lg font-medium leading-relaxed">Os pontos são acumulativos e determinam o seu nível de autoridade no Menu de Negócios. Quanto mais você usa a plataforma e indica membros, mais benefícios desbloqueia.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               {officialLevels.map((lvl, i) => (
                 <div key={i} className={`p-10 rounded-[3rem] border transition-all ${user.level === lvl.id ? 'bg-white border-indigo-200 shadow-2xl ring-4 ring-indigo-50 scale-105 z-10' : 'bg-gray-50 border-gray-100 opacity-80'}`}>
                    <div className={`w-16 h-16 rounded-[1.5rem] ${lvl.bg} ${lvl.color} flex items-center justify-center mb-8`}>
                       <lvl.icon className="w-8 h-8" />
                    </div>
                    <h3 className={`text-2xl font-black mb-1 ${lvl.color}`}>{lvl.label}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
                      {lvl.min}{lvl.max === Infinity ? '+' : ` a ${lvl.max}`} Pontos
                    </p>
                    <p className="text-gray-600 text-sm font-medium leading-relaxed">{lvl.desc}</p>
                    {user.level === lvl.id && (
                      <div className="mt-8 flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                        <CheckCircle className="w-4 h-4" /> Nível Atual
                      </div>
                    )}
                 </div>
               ))}
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-4 px-4">
                 <div className="w-2 h-10 bg-indigo-600 rounded-full"></div>
                 <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Regras de Pontuação</h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                 <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Award className="w-7 h-7" /></div>
                       <div>
                          <h4 className="text-xl font-black text-gray-900 leading-tight">Movimentações de Assinatura</h4>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Pontuação Única</p>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-indigo-200 transition-all">
                          <span className="font-bold text-gray-700">Assinatura Plano Básico</span>
                          <span className="bg-white px-4 py-1.5 rounded-xl border border-gray-200 font-black text-emerald-600">+50 PTS</span>
                       </div>
                       <div className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-indigo-200 transition-all">
                          <span className="font-bold text-gray-700">Assinatura Plano Pro</span>
                          <span className="bg-indigo-600 px-4 py-1.5 rounded-xl text-white font-black shadow-lg shadow-indigo-100">+300 PTS</span>
                       </div>
                    </div>
                 </div>

                 <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><Users className="w-7 h-7" /></div>
                       <div>
                          <h4 className="text-xl font-black text-gray-900 leading-tight">Indicação de Novos Membros</h4>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Recorrente</p>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-indigo-200 transition-all">
                          <div className="space-y-1">
                             <span className="block font-bold text-gray-700">Novo Membro com Plano Ativo</span>
                             <span className="block text-[10px] text-gray-400 font-medium">Basta seu indicado assinar qualquer plano.</span>
                          </div>
                          <span className="bg-emerald-100 px-4 py-1.5 rounded-xl border border-emerald-200 font-black text-emerald-700">+50 PTS</span>
                       </div>
                    </div>
                 </div>

                 <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl"><Flame className="w-7 h-7" /></div>
                       <div>
                          <h4 className="text-xl font-black text-gray-900 leading-tight">Engajamento na Plataforma</h4>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Ações Diárias</p>
                       </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                       {[
                         'Completar perfil', 'Criar/Atualizar catálogo', 'Criar cupom', 
                         'Interagir na comunidade', 'Atualizar produtos'
                       ].map((item, i) => (
                         <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center group hover:bg-white hover:shadow-lg transition-all">
                            <span className="text-[11px] font-bold text-gray-600 max-w-[120px]">{item}</span>
                            <span className="text-[10px] font-black text-orange-600">+20</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl"><Target className="w-7 h-7" /></div>
                       <div>
                          <h4 className="text-xl font-black text-gray-900 leading-tight">Ações Especiais</h4>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Participação Ativa</p>
                       </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                       {[
                         'Eventos e workshops', 'Cursos e mentorias', 'Desafios mensais', 
                         'Rankings por cidade', 'Campanhas patrocinadas'
                       ].map((item, i) => (
                         <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center group hover:bg-white hover:shadow-lg transition-all">
                            <span className="text-[11px] font-bold text-gray-600 max-w-[120px]">{item}</span>
                            <span className="text-[10px] font-black text-purple-600">+50</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl">
               <div className="relative z-10 space-y-6">
                  <h3 className="text-3xl font-black">Pronto para acelerar?</h3>
                  <p className="text-gray-400 max-w-xl mx-auto font-medium">Não perca tempo. Comece completando seu catálogo agora e ganhe seus primeiros 20 pontos de engajamento!</p>
                  <button onClick={() => setActiveTab('missions')} className="bg-white text-gray-900 px-12 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center gap-2 mx-auto shadow-xl">
                    IR PARA MISSÕES <ArrowRight className="w-4 h-4" />
                  </button>
               </div>
               <div className="absolute top-0 right-0 p-32 bg-indigo-500 opacity-10 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
            </div>
          </div>
        )}
        
        {activeTab === 'missions' && (
          <div className="grid lg:grid-cols-12 gap-10">
             <div className="lg:col-span-8 space-y-8">
                <div className="flex items-center gap-4 px-4">
                   <div className="w-2 h-10 bg-indigo-600 rounded-full"></div>
                   <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Missões Ativas</h2>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6">
                   {missions.map((mission, idx) => (
                      <div key={idx} className="group p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all flex items-start gap-6">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:scale-110 ${mission.category === 'especial' ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600'}`}>
                            <mission.icon className="w-7 h-7" />
                         </div>
                         <div>
                            <h4 className="text-lg font-black text-gray-900 leading-tight mb-2">{mission.title}</h4>
                            <div className="flex items-center gap-2">
                               <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">+{mission.points} Pontos</span>
                               <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{mission.category}</span>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>

                <div className="bg-gray-950 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
                   <div className="relative z-10">
                      <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                         <Share2 className="text-cyan-400 w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-black mb-4 tracking-tight">Expanda sua Rede</h3>
                      <p className="text-gray-400 text-sm font-medium leading-relaxed mb-10">Convide um empreendedor e ganhe <span className="text-emerald-400 font-bold">50 pontos</span> no Clube assim que ele ativar um plano.</p>
                      
                      <div className="space-y-4">
                         <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between gap-4">
                            <code className="text-[10px] text-indigo-300 truncate font-mono uppercase">{user.referralCode}</code>
                            <button onClick={copyLink} className={`p-3 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg'}`}>
                               {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-5 rounded-2xl border border-white/5 text-center">
                               <p className="text-[9px] font-black text-gray-500 uppercase mb-1">Indicações</p>
                               <p className="text-2xl font-black text-white">{user.referralsCount}</p>
                            </div>
                            <div className="bg-indigo-500/10 p-5 rounded-2xl border border-indigo-500/20 text-center">
                               <p className="text-[9px] font-black text-indigo-400 uppercase mb-1">Total Ganho</p>
                               <p className="text-2xl font-black text-indigo-300">{user.referralsCount * 50} <span className="text-[10px] opacity-40">PTS</span></p>
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="absolute -right-6 -bottom-6 text-white/5 animate-float"><Share2 className="w-40 h-40" /></div>
                </div>
             </div>

             <div className="lg:col-span-4 space-y-10">
                {/* RANKING LOCAL REDESIGNED */}
                <div className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-gray-100 dark:border-zinc-800 shadow-2xl overflow-hidden">
                   <div className="bg-indigo-600 p-8 text-white relative">
                      <div className="relative z-10">
                         <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                               <Medal className="w-6 h-6 text-yellow-400" /> Ranking Local
                            </h3>
                            <span className="text-[9px] font-black bg-white/20 px-3 py-1 rounded-full uppercase tracking-widest">ESTADO</span>
                         </div>
                         <p className="text-indigo-100 text-xs font-medium">Os empreendedores mais ativos da região.</p>
                      </div>
                      <div className="absolute top-0 right-0 p-12 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                   </div>

                   {/* PÓDIO TOP 3 */}
                   <div className="p-8 space-y-10">
                      <div className="flex justify-center items-end gap-2 pt-6">
                        {/* 2º Lugar */}
                        <div className="flex flex-col items-center gap-3">
                           <div className="relative">
                              <div className="w-16 h-16 rounded-2xl bg-gray-100 border-2 border-slate-300 overflow-hidden shadow-lg">
                                 <img src={localRanking[1].avatar} className="w-full h-full object-cover" alt="" />
                              </div>
                              <div className="absolute -top-3 -left-3 w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center text-slate-700 font-black text-xs border-2 border-white shadow-md">2º</div>
                           </div>
                           <div className="text-center">
                              <p className="text-[10px] font-black text-gray-900 truncate w-16">{localRanking[1].name.split(' ')[0]}</p>
                              <p className="text-[9px] font-bold text-slate-400">{localRanking[1].pts} pts</p>
                           </div>
                           <div className="w-12 h-16 bg-slate-100 rounded-t-xl border-x border-t border-slate-200 shadow-inner"></div>
                        </div>

                        {/* 1º Lugar */}
                        <div className="flex flex-col items-center gap-3 animate-float">
                           <div className="relative">
                              <div className="w-24 h-24 rounded-3xl bg-amber-50 border-4 border-yellow-400 overflow-hidden shadow-2xl p-1">
                                 <img src={localRanking[0].avatar} className="w-full h-full object-cover rounded-2xl" alt="" />
                              </div>
                              <div className="absolute -top-4 -left-4 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-amber-900 shadow-xl border-2 border-white">
                                 <Trophy className="w-6 h-6" />
                              </div>
                           </div>
                           <div className="text-center">
                              <p className="text-xs font-black text-gray-900">{localRanking[0].name}</p>
                              <p className="text-[10px] font-black text-yellow-600">{localRanking[0].pts} pts</p>
                           </div>
                           <div className="w-16 h-24 bg-gradient-to-b from-yellow-100 to-yellow-50 rounded-t-2xl border-x border-t border-yellow-200 shadow-[0_-10px_30px_rgba(251,191,36,0.1)]"></div>
                        </div>

                        {/* 3º Lugar */}
                        <div className="flex flex-col items-center gap-3">
                           <div className="relative">
                              <div className="w-16 h-16 rounded-2xl bg-orange-50 border-2 border-orange-300 overflow-hidden shadow-lg">
                                 <img src={localRanking[2].avatar} className="w-full h-full object-cover" alt="" />
                              </div>
                              <div className="absolute -top-3 -left-3 w-8 h-8 bg-orange-300 rounded-full flex items-center justify-center text-orange-900 font-black text-xs border-2 border-white shadow-md">3º</div>
                           </div>
                           <div className="text-center">
                              <p className="text-[10px] font-black text-gray-900 truncate w-16">{localRanking[2].name.split(' ')[0]}</p>
                              <p className="text-[9px] font-bold text-orange-400">{localRanking[2].pts} pts</p>
                           </div>
                           <div className="w-12 h-12 bg-orange-50 rounded-t-xl border-x border-t border-orange-100 shadow-inner"></div>
                        </div>
                      </div>

                      {/* Lista do restante */}
                      <div className="space-y-4 pt-6 border-t border-gray-100">
                         {localRanking.slice(3).map((item, i) => (
                           <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white transition-all group">
                              <div className="flex items-center gap-4">
                                 <span className="text-xs font-black text-gray-300 group-hover:text-indigo-600">{i + 4}º</span>
                                 <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200">
                                    <img src={item.avatar} className="w-full h-full object-cover" alt="" />
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{item.level}</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <span className="text-sm font-black text-gray-900">{item.pts}</span>
                                 <span className="text-[8px] font-black text-gray-300 block uppercase">PTS</span>
                              </div>
                           </div>
                         ))}
                      </div>

                      <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all active:scale-95">
                         Ver Ranking Geral
                      </button>
                   </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                   <div className="flex items-center gap-3 mb-6">
                      <Zap className="w-6 h-6 text-brand-primary" />
                      <h4 className="text-lg font-black text-gray-900 uppercase">Super Dica</h4>
                   </div>
                   <p className="text-gray-500 text-sm font-medium leading-relaxed">
                      Indicar apenas <strong>3 novos membros Pro</strong> por mês garante a você o nível Prata automático e o dobro de pontos em cada missão diária concluída.
                   </p>
                </div>
             </div>
          </div>
        )}

        {/* TAB: STORE */}
        {activeTab === 'store' && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {prizes.map(prize => (
                <div key={prize.id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-2xl transition-all flex flex-col">
                   <div className="relative h-48 overflow-hidden">
                      <img src={prize.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={prize.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      <div className="absolute top-4 right-4">
                         <div className="flex items-center gap-1.5 text-xs font-black bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-white">
                           <Zap className="w-3.5 h-3.5 text-yellow-400 fill-current" /> {prize.cost} PTS
                         </div>
                      </div>
                   </div>
                   <div className="p-8 flex-1 flex flex-col justify-between">
                      <h3 className="text-lg font-black text-gray-900 leading-tight mb-6 group-hover:text-indigo-600 transition-colors h-12 overflow-hidden">{prize.title}</h3>
                      <button 
                        disabled={user.points < prize.cost}
                        className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                          user.points >= prize.cost 
                          ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95' 
                          : 'bg-gray-50 text-gray-300 cursor-not-allowed border border-gray-100'
                        }`}
                      >
                        {user.points >= prize.cost ? 'RESGATAR PRÊMIO' : 'SALDO INSUFICIENTE'}
                      </button>
                   </div>
                </div>
              ))}
           </div>
        )}

        {/* TAB: HISTÓRICO */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-xl overflow-hidden min-h-[500px]">
             <div className="flex justify-between items-center mb-12">
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Extrato de Conquistas</h3>
                <button onClick={loadHistory} className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-indigo-600 transition-all">
                   <RefreshCw className={`w-5 h-5 ${isLoadingHistory ? 'animate-spin' : ''}`} />
                </button>
             </div>

             <div className="space-y-6">
                {history.length === 0 ? (
                   <div className="text-center py-20 flex flex-col items-center gap-6 opacity-40">
                      <History className="w-16 h-16 text-gray-200" />
                      <p className="font-black uppercase tracking-widest text-xs text-gray-400">Nenhuma movimentação registrada</p>
                   </div>
                ) : (
                   history.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-lg transition-all group">
                         <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
                               item.category === 'assinatura' ? 'bg-blue-100 text-blue-600' :
                               item.category === 'indicacao' ? 'bg-cyan-100 text-cyan-600' :
                               item.category === 'especial' ? 'bg-purple-100 text-purple-600' :
                               'bg-emerald-100 text-emerald-600'
                            }`}>
                               <Zap className="w-6 h-6" />
                            </div>
                            <div>
                               <h4 className="font-black text-gray-900 text-lg leading-tight">{item.action}</h4>
                               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">{new Date(item.createdAt).toLocaleDateString()} às {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <span className="text-2xl font-black text-emerald-600">+{item.points}</span>
                            <span className="text-[10px] font-black text-gray-300 block uppercase tracking-widest">PONTOS</span>
                         </div>
                      </div>
                   ))
                )}
             </div>
          </div>
        )}
      </div>

    </div>
  );
};
