
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Trophy, Gift, Share2, Copy, TrendingUp, Users, 
  ShoppingBag, Star, CheckCircle, ArrowRight, 
  Zap, Crown, Wallet, Shield, Sparkles, ChevronRight,
  Check
} from 'lucide-react';
import { Prize } from '../types';

export const Rewards: React.FC = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  // Mock Prizes
  const prizes: Prize[] = [
    { id: 1, title: 'Voucher iFood R$ 30', cost: 500, imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600' },
    { id: 2, title: 'Consultoria de Marketing (30min)', cost: 1000, imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600' },
    { id: 3, title: 'Ingresso de Cinema (Par)', cost: 800, imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=600' },
    { id: 4, title: 'Curso de Gestão Financeira', cost: 2000, imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600' },
  ];

  const levels = [
    { id: 'iniciante', label: 'Iniciante', min: 0, color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Zap, desc: 'Acesso básico à plataforma e comunidade.' },
    { id: 'bronze', label: 'Bronze', min: 100, color: 'text-orange-400', bg: 'bg-orange-500/10', icon: Shield, desc: 'Destaque nos anúncios por 7 dias.' },
    { id: 'prata', label: 'Prata', min: 300, color: 'text-slate-300', bg: 'bg-slate-400/10', icon: Star, desc: 'Badge de verificado e suporte prioritário via ticket.' },
    { id: 'ouro', label: 'Ouro', min: 1000, color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: Crown, desc: 'Mentoria coletiva mensal e consultoria estratégica.' },
  ];

  const getLevelProgress = (points: number) => {
    if (points < 100) return (points / 100) * 100;
    if (points < 300) return ((points - 100) / 200) * 100;
    if (points < 1000) return ((points - 300) / 700) * 100;
    return 100;
  };

  const nextLevelInfo = levels.find(l => l.min > user.points) || null;
  const affiliateLink = `${window.location.origin}/#/register?ref=${user.referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4">
      
      {/* 1. ACADEMY-STYLE HEADER */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
                 <Trophy className="h-10 w-10 text-yellow-400" />
              </div>
              <div>
                 <h1 className="text-3xl md:text-5xl font-black tracking-tight">Clube de Vantagens</h1>
                 <p className="text-indigo-200 text-lg font-medium">Sua fidelidade transformada em crescimento.</p>
              </div>
            </div>

            <div className="flex gap-6 items-center bg-black/20 backdrop-blur-md p-6 rounded-[2rem] border border-white/5">
               <div className="text-center">
                  <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Seus Pontos</p>
                  <p className="text-4xl font-black text-white">{user.points}</p>
               </div>
               <div className="w-px h-12 bg-white/10"></div>
               <div className="text-center">
                  <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Nível Atual</p>
                  <p className="text-xl font-black text-yellow-400 uppercase">{user.level}</p>
               </div>
            </div>
          </div>

          <div className="mt-12 max-w-2xl">
             <div className="flex justify-between items-end mb-3">
                <span className="text-xs font-black text-indigo-200 uppercase tracking-widest">Progresso do Nível</span>
                <span className="text-xs font-bold text-white/60">
                   {nextLevelInfo ? `${nextLevelInfo.min - user.points} pontos para nível ${nextLevelInfo.label}` : 'Nível Máximo Atingido!'}
                </span>
             </div>
             <div className="h-4 bg-white/10 rounded-full overflow-hidden p-1 border border-white/5">
                <div 
                   className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 rounded-full shadow-lg transition-all duration-1000"
                   style={{ width: `${getLevelProgress(user.points)}%` }}
                ></div>
             </div>
          </div>
        </div>

        {/* Abstract Deco */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      <div className="animate-[fade-in_0.4s_ease-out] space-y-16">
        
        {/* 2. LOJA DE PRÊMIOS (Cards Estilo Academy) */}
        <section className="space-y-8">
           <div className="flex items-center gap-3">
             <div className="w-1.5 h-8 bg-indigo-600 rounded-full"></div>
             <h2 className="text-2xl font-black text-gray-900 tracking-tight">Resgate seus Prêmios</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {prizes.map(prize => (
               <div key={prize.id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img src={prize.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={prize.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                       <div className="flex items-center gap-1.5 text-xs font-black bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white">
                         <Zap className="w-3.5 h-3.5 text-yellow-400 fill-current" /> {prize.cost} PTS
                       </div>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-lg font-black text-gray-900 leading-tight mb-6 h-12 group-hover:text-indigo-600 transition-colors">{prize.title}</h3>
                    
                    <button 
                      disabled={user.points < prize.cost}
                      className={`mt-auto w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                        user.points >= prize.cost 
                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {user.points >= prize.cost ? 'RESGATAR AGORA' : 'PONTOS INSUFICIENTES'}
                    </button>
                  </div>
               </div>
             ))}
           </div>
        </section>

        {/* 3. TRILHA DE NÍVEIS (Estilo Academy Journey) */}
        <section className="bg-white rounded-[3rem] p-8 md:p-16 border border-gray-100 shadow-xl relative overflow-hidden">
           <div className="max-w-2xl mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4">
                 <Sparkles className="w-4 h-4" /> Evolução de Perfil
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">Níveis e Benefícios</h2>
              <p className="text-gray-500 text-lg font-medium leading-relaxed">Sua atividade na plataforma desbloqueia ferramentas exclusivas para acelerar seu negócio.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-0 relative">
                 <div className="absolute left-[31px] top-8 bottom-8 w-1 bg-gray-100 -z-10"></div>
                 {levels.map((level) => {
                    const isUnlocked = user.points >= level.min;
                    const isCurrent = user.level === level.id;
                    return (
                      <div key={level.id} className={`flex gap-10 items-start pb-12 last:pb-0 group ${!isUnlocked ? 'opacity-40' : ''}`}>
                         <div className={`w-16 h-16 rounded-[1.6rem] flex items-center justify-center flex-shrink-0 transition-all duration-700 border-4 border-white shadow-2xl relative z-10 ${
                           isCurrent ? 'bg-indigo-600 text-white ring-8 ring-indigo-50 scale-110' :
                           isUnlocked ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'
                         }`}>
                            {isUnlocked && !isCurrent ? <Check className="w-8 h-8" /> : <level.icon className={`w-7 h-7 ${isCurrent ? 'animate-pulse' : ''}`} />}
                         </div>
                         <div className="pt-2">
                            <div className="flex items-center gap-3 mb-1">
                               <h3 className="text-xl font-black text-gray-900 tracking-tight">{level.label}</h3>
                               {isCurrent && <span className="bg-indigo-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Atual</span>}
                            </div>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed">{level.desc}</p>
                            <p className={`text-[10px] font-black uppercase mt-2 ${level.color}`}>Mínimo: {level.min} Pontos</p>
                         </div>
                      </div>
                    );
                 })}
              </div>

              {/* 4. INDIQUE E GANHE (RODAPÉ TÉCNICO ACADEMY) */}
              <div className="flex flex-col">
                 <div className="bg-gradient-to-br from-gray-900 to-slate-900 rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden h-full flex flex-col justify-center">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center text-white shadow-2xl border border-white/20 mb-8">
                       <Share2 className="w-10 h-10 text-cyan-300" />
                    </div>
                    <div className="relative z-10 mb-8">
                       <h3 className="text-2xl font-black text-white mb-2">Expanda a Rede</h3>
                       <p className="text-gray-400 text-base font-medium">Ganhe <span className="text-emerald-400 font-bold">50 pontos</span> por cada novo empreendedor que entrar pelo seu link exclusivo.</p>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between gap-4">
                          <code className="text-xs text-indigo-300 truncate font-mono">{affiliateLink}</code>
                          <button 
                            onClick={copyLink}
                            className={`p-3 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg'}`}
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 text-center">
                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Indicações</p>
                             <p className="text-2xl font-black text-white">{user.referralsCount || 0}</p>
                          </div>
                          <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                             <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Bônus Total</p>
                             <p className="text-2xl font-black text-indigo-300">{(user.referralsCount || 0) * 50} <span className="text-xs opacity-50">PTS</span></p>
                          </div>
                       </div>
                    </div>
                    
                    {/* Deco */}
                    <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                 </div>
              </div>
           </div>
        </section>

      </div>
    </div>
  );
};
