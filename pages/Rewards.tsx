import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Gift, Share2, Copy, TrendingUp, Users, ShoppingBag } from 'lucide-react';
import { Prize } from '../types';

export const Rewards: React.FC = () => {
  const { user } = useAuth();
  const [copied, setCopied] = React.useState(false);

  if (!user) return null;

  // Mock Prizes
  const prizes: Prize[] = [
    { id: 1, title: 'Voucher iFood R$ 30', cost: 500, imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=300' },
    { id: 2, title: 'Consultoria de Marketing (30min)', cost: 1000, imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=300' },
    { id: 3, title: 'Ingresso de Cinema (Par)', cost: 800, imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=300' },
    { id: 4, title: 'Curso de Gestão Financeira', cost: 2000, imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=300' },
  ];

  // Gamification Logic
  const getLevelProgress = (points: number) => {
    if (points < 100) return (points / 100) * 100;
    if (points < 300) return ((points - 100) / 200) * 100;
    if (points < 1000) return ((points - 300) / 700) * 100;
    return 100;
  };

  const nextLevel = 
    user.points < 100 ? 100 : 
    user.points < 300 ? 300 : 
    user.points < 1000 ? 1000 : Infinity;

  const currentLevelColor = 
    user.level === 'ouro' ? 'text-yellow-500' : 
    user.level === 'prata' ? 'text-gray-400' : 
    user.level === 'bronze' ? 'text-orange-400' : 'text-blue-500';

  const affiliateLink = `${window.location.origin}/#/register?ref=${user.referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-indigo-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
          <Trophy className="w-64 h-64" />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Clube de Vantagens</h1>
          <p className="text-indigo-200 max-w-xl">Use cupons, indique amigos e suba de nível para desbloquear prêmios.</p>
          
          <div className="mt-8 flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-sm text-indigo-300 uppercase tracking-wide">Seu Nível Atual</span>
              <span className={`text-4xl font-black uppercase ${currentLevelColor} drop-shadow-lg`}>{user.level}</span>
            </div>
            <div className="h-12 w-px bg-indigo-700/50"></div>
            <div className="flex flex-col">
              <span className="text-sm text-indigo-300 uppercase tracking-wide">Pontos Totais</span>
              <span className="text-4xl font-bold text-white">{user.points}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 max-w-lg">
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span>Progresso atual</span>
              <span>{nextLevel === Infinity ? 'Nível Máximo' : `${nextLevel - user.points} pts para o próximo nível`}</span>
            </div>
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000" 
                style={{ width: `${getLevelProgress(user.points)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Points Store */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-indigo-600" />
          Loja de Prêmios
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {prizes.map(prize => (
            <div key={prize.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
              <div className="h-32 w-full overflow-hidden relative">
                <img src={prize.imageUrl} alt={prize.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 leading-tight mb-2 h-10">{prize.title}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-600 font-bold text-sm">{prize.cost} PTS</span>
                  <button 
                    disabled={user.points < prize.cost}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
                  >
                    RESGATAR
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Affiliate System */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-100 rounded-xl text-green-600">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Indique e Ganhe</h2>
              <p className="text-sm text-gray-500">Ganhe 50 pontos por cada amigo indicado.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <code className="text-sm font-mono text-gray-600 break-all">{affiliateLink}</code>
              <button 
                onClick={copyLink}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium whitespace-nowrap"
              >
                {copied ? <CheckIcon /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copiado!' : 'Copiar Link'}
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Indicações</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{user.referralsCount || 0}</span>
              </div>
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                <div className="flex items-center gap-2 text-purple-600 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Pontos Ganhos</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{(user.referralsCount || 0) * 50}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rewards List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-3 bg-yellow-100 rounded-xl text-yellow-600">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Níveis e Benefícios</h2>
              <p className="text-sm text-gray-500">Vantagens ativas no seu nível {user.level}.</p>
            </div>
          </div>

          <div className="space-y-3">
             <RewardItem 
                level="iniciante" 
                userLevel={user.level} 
                text="Acesso Básico à Plataforma" 
              />
              <RewardItem 
                level="bronze" 
                userLevel={user.level} 
                text="Destaque 'Novo' nos Anúncios por 7 dias" 
              />
              <RewardItem 
                level="prata" 
                userLevel={user.level} 
                text="Badge de Verificado Prata + 2x Tokens de IA" 
              />
              <RewardItem 
                level="ouro" 
                userLevel={user.level} 
                text="Mentoria Coletiva Mensal + Badge Ouro" 
              />
          </div>
        </div>

      </div>
    </div>
  );
};

// Helper Components
const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const RewardItem = ({ level, userLevel, text }: { level: string, userLevel: string, text: string }) => {
  const levels = ['iniciante', 'bronze', 'prata', 'ouro'];
  const isUnlocked = levels.indexOf(userLevel) >= levels.indexOf(level);

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${isUnlocked ? 'border-green-200 bg-green-50' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
      <div className={`w-3 h-3 rounded-full ${isUnlocked ? 'bg-green-500' : 'bg-gray-300'}`}></div>
      <span className={`text-sm ${isUnlocked ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{text}</span>
      {!isUnlocked && <span className="ml-auto text-xs text-gray-400 uppercase font-bold border border-gray-200 px-2 py-1 rounded">Bloqueado</span>}
    </div>
  );
};
