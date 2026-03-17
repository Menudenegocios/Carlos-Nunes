
import React, { useState } from 'react';
import { Check, Sparkles, Zap, Shield, Rocket, User, Users, Star, Clock, Trophy, GraduationCap, Package, Briefcase, Globe, LayoutGrid, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Plans: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const stripePrices = {
    comunidade: {
      anual: 'price_1TBpx2F7zhqZwXmj7Vn1Gift'   // R$ 249 (Promo)
    },
    fundador: {
      anual: 'price_1TBpx5F7zhqZwXmj1cKWRqjd'   // R$ 599
    },
    fundador_pro: {
      anual: 'price_1TBpx7F7zhqZwXmjQXqEq1Aq'   // R$ 1497
    }
  };

  const handleSubscribe = async (planKey: 'comunidade' | 'fundador' | 'fundador_pro') => {
    if (!user) {
      alert('Por favor, faça login para assinar um plano.');
      navigate('/login');
      return;
    }

    setLoading(planKey);
    try {
      const { paymentService } = await import('../services/paymentService');
      const priceId = (stripePrices as any)[planKey].anual;

      console.log(`Iniciando checkout para ${planKey} (${priceId})`);
      
      const { url } = await paymentService.createCheckoutSession(priceId, 'anual');
      
      if (url) {
        window.location.href = url;
      }
    } catch (error: any) {
      console.error('Erro no checkout:', error);
      alert(`Erro no processamento: ${error.message || 'Verifique sua conexão ou tente novamente.'}`);
    } finally {
      setLoading(null);
    }
  };

  const PlanCard = ({ 
    type, title, subtitle, pixPrice, installments, oldPrice, features, recommended = false, icon: Icon, color, btnText, planKey, extraInfo, rewards
  }: any) => (
    <div className={`relative flex flex-col p-8 rounded-[3rem] border transition-all duration-500 ${recommended ? 'border-brand-primary bg-[#0F172A] text-white shadow-2xl scale-105 z-10' : 'border-gray-100 bg-white text-gray-900 shadow-lg hover:shadow-xl hover:-translate-y-2'}`}>
      {recommended && (
        <div className="absolute top-0 right-12 -mt-4 bg-gradient-to-r from-brand-primary to-orange-600 text-white text-[10px] font-black tracking-widest px-6 py-2 rounded-full shadow-xl">
          MAIS POPULAR
        </div>
      )}
      <div className="mb-8">
        <div className={`inline-flex items-center justify-center p-5 rounded-[2rem] mb-6 ${recommended ? 'bg-brand-primary/20 text-brand-primary shadow-[0_0_30px_rgba(246,124,1,0.2)]' : 'bg-gray-50 text-brand-primary'}`}>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-3">{type}</h3>
        <h2 className="text-2xl font-black leading-tight mb-3 tracking-tighter italic uppercase">{title}</h2>
        <p className={`text-xs leading-relaxed font-medium ${recommended ? 'text-slate-400' : 'text-gray-500'}`}>{subtitle}</p>
      </div>
      
      <div className="mb-10 flex flex-col">
        {oldPrice && <span className="text-xs font-bold line-through opacity-40 mb-1 font-mono uppercase tracking-widest leading-none">De R$ {oldPrice}</span>}
        
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest font-mono opacity-60">12x de</span>
            <span className="text-4xl font-black tracking-tighter italic">R$ {installments}</span>
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-1 ${recommended ? 'text-emerald-400' : 'text-emerald-600'}`}>
            ou R$ {pixPrice} \u00e0 vista
          </span>
        </div>

        {extraInfo && <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mt-4 bg-brand-primary/10 w-fit px-3 py-1 rounded-full">{extraInfo}</p>}

        {/* Recompensas de Gamificação */}
        {rewards && (
          <div className={`mt-6 p-4 rounded-2xl border ${recommended ? 'bg-white/5 border-white/10' : 'bg-brand-primary/5 border-brand-primary/10'}`}>
            <p className="text-[9px] font-black uppercase tracking-widest text-brand-primary mb-2 flex items-center gap-2">
              <Trophy className="w-3 h-3" /> Recompensas Imediatas:
            </p>
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className={`text-lg font-black ${recommended ? 'text-white' : 'text-gray-900'}`}>{rewards.points}</span>
                <span className="text-[8px] font-bold uppercase opacity-50">Pts Autoridade</span>
              </div>
              <div className="flex flex-col">
                <span className={`text-lg font-black ${recommended ? 'text-white' : 'text-gray-900'}`}>{rewards.cash}</span>
                <span className="text-[8px] font-bold uppercase opacity-50">Menu Cash</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <ul className="flex-1 space-y-4 mb-10">
        {features.map((feature: any, idx: number) => (
          <li key={idx} className="flex items-start gap-3">
            <Check className={`h-4 w-4 flex-shrink-0 mt-0.5 ${recommended ? 'text-emerald-400' : 'text-brand-primary'}`} />
            <span className={`text-xs font-bold ${recommended ? 'text-slate-300' : 'text-gray-600'}`}>{feature}</span>
          </li>
        ))}
      </ul>
      
      <button
        onClick={() => handleSubscribe(planKey)}
        disabled={loading !== null}
        className={`w-full py-5 rounded-[2rem] font-black text-xs tracking-widest transition-all shadow-xl active:scale-95 uppercase ${
          recommended ? 'bg-brand-primary text-white hover:bg-orange-600 shadow-brand-primary/20' : 'bg-gray-900 text-white hover:opacity-90 shadow-indigo-600/20'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading === planKey ? 'PROCESSANDO...' : btnText}
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-20 pt-4 px-4 animate-[fade-in_0.4s_ease-out]">
      {/* Header Premium com Campanha */}
      <div className="bg-[#0F172A] rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 blur-[100px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 blur-[100px] -ml-32 -mb-32"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 text-left">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-indigo-500/10 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-xl">
                 <Sparkles className="h-10 w-10 text-brand-primary" />
              </div>
              <div>
                 <div className="flex items-center gap-3 mb-2">
                    <span className="bg-brand-primary text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
                      Campanha de Lançamento
                    </span>
                    <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">
                      Até 31/Março
                    </span>
                 </div>
                 <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-2 overflow-visible">
                    Ecossistema <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] italic uppercase">Menu de Negócios</span>
                 </h1>
                 <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">Selo Membro Fundador para todos que entrarem agora!</p>
              </div>
            </div>
        </div>
      </div>

      {/* Info Promoção */}
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-xl font-black italic uppercase tracking-tighter">Escolha seu plano de acesso anual</h2>
        <div className="h-1 w-20 bg-brand-primary rounded-full"></div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch px-4 max-w-7xl mx-auto pt-4">
        <PlanCard
          type="BÁSICO" 
          title="Plano Básico" 
          planKey="comunidade" 
          oldPrice="397,00" 
          pixPrice="249,00" 
          installments="24,90" 
          rewards={{ points: 100, cash: 50 }}
          icon={User} 
          color="text-indigo-500" 
          btnText="FAZER PARTE"
          subtitle="Acesso essencial ao ecossistema para começar a gerar conexões e visibilidade."
          features={['Vitrine Digital Personalizada', 'Acesso ao Menu Club (Vantagens)', 'Menu Academy (Educação)', 'Networking entre membros', 'NetworkingMeet online', 'Suporte Especializado']}
        />
        <PlanCard
          type="PRO" 
          title="Plano Pro" 
          planKey="fundador" 
          oldPrice="799,00" 
          pixPrice="599,00" 
          installments="59,90" 
          rewards={{ points: 300, cash: 100 }}
          icon={Zap} 
          color="text-brand-primary" 
          btnText="ACELERAR NEGÓCIOS" 
          recommended={true}
          extraInfo="BÔNUS: SELO FUNDADOR"
          subtitle="Tudo do básico com ferramentas avançadas de gestão e vendas para escalar."
          features={['Tudo do Plano Básico', 'CRM & Vendas Integrado', 'Gestão de Projetos (Tasks)', 'Hub de Negócios Completo', 'Destaque no Ecossistema', 'Selo Fundador Vitalício']}
        />
        <PlanCard
          type="FULL" 
          title="Plano Full" 
          planKey="fundador_pro" 
          oldPrice="2.497,00" 
          pixPrice="1.497,00" 
          installments="149,70" 
          rewards={{ points: 500, cash: 200 }}
          icon={Rocket} 
          color="text-purple-500" 
          btnText="ASSUMIR LIDERANÇA" 
          extraInfo="VAGAS LIMITADAS"
          subtitle="Para quem busca o topo. Mentoria direta e posicionamento de autoridade máxima."
          features={['Tudo do Plano Pro', 'Mentoria Mensal Full Direct', 'Acesso Antecipado a Funcionalidades', 'Prioridade em Eventos Presenciais', 'Página de Autoridade Premium', 'Networking High Stakes']}
        />
      </div>

      {/* Footer Info */}
      <div className="text-center space-y-4 px-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
          Ao assinar durante o período de lançamento (até 31/03), todos os usuários recebem automaticamente o Selo Membro Fundador vitalício em seu perfil.
        </p>
        <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-slate-400 grayscale opacity-50">
               <Shield className="w-4 h-4" />
               <span className="text-[9px] font-black uppercase tracking-widest">Pagamento Seguro</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 grayscale opacity-50">
               <Clock className="w-4 h-4" />
               <span className="text-[9px] font-black uppercase tracking-widest">Ativação Imediata</span>
            </div>
        </div>
      </div>
    </div>
  );
};
