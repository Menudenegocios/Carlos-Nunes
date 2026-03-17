
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { Check, User, Briefcase, Sparkles, Zap, Shield, Crown, CreditCard, Award, Handshake, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { plans, pointsRules } from '../config/gamificationConfig';

export const Plans: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'mensal' | 'anual'>('mensal');

  const stripePrices = {
    comunidade: {
      mensal: 'price_1TBnT7F7zhqZwXmjpnziUAws',
      anual: 'price_1TBnW7F7zhqZwXmjTpuQrsZF'
    },
    fundador: {
      anual: 'price_1TBnWCF7zhqZwXmjgJgVpdcb'
    },
    fundador_pro: {
      anual: 'price_1TBnWGF7zhqZwXmjvlFk29OD'
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

      let priceId = '';
      if (planKey === 'comunidade') {
        priceId = billingCycle === 'mensal' ? stripePrices.comunidade.mensal : stripePrices.comunidade.anual;
      } else {
        priceId = (stripePrices as any)[planKey].anual;
      }

      console.log(`Iniciando checkout para ${planKey} (${priceId})`);
      
      const { url } = await paymentService.createCheckoutSession(priceId, billingCycle);
      
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
    type, title, subtitle, pixPrice, installments, oldPrice, features, recommended = false, icon: Icon, color, btnText, planKey, period = "mês", extraInfo
  }: any) => (
    <div className={`relative flex flex-col p-10 rounded-[3.5rem] border transition-all duration-500 ${recommended ? 'border-brand-primary bg-[#0F172A] text-white shadow-2xl scale-105 z-10' : 'border-gray-100 bg-white text-gray-900 shadow-lg hover:shadow-xl hover:-translate-y-2'}`}>
      {recommended && (
        <div className="absolute top-0 right-12 -mt-4 bg-gradient-to-r from-brand-primary to-orange-600 text-white text-[10px] font-black tracking-widest px-6 py-2 rounded-full shadow-xl">
          MAIS POPULAR
        </div>
      )}
      <div className="mb-10">
        <div className={`inline-flex items-center justify-center p-6 rounded-[2.2rem] mb-8 ${recommended ? 'bg-brand-primary/20 text-brand-primary shadow-[0_0_30px_rgba(246,124,1,0.2)]' : 'bg-gray-50 text-brand-primary'}`}>
          <Icon className={`h-10 w-10 ${color}`} />
        </div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-3">{type}</h3>
        <h2 className="text-3xl font-black leading-tight mb-3 tracking-tighter italic uppercase">{title}</h2>
        <p className={`text-sm leading-relaxed font-medium ${recommended ? 'text-slate-400' : 'text-gray-500'}`}>{subtitle}</p>
      </div>
      
      <div className="mb-12 flex flex-col">
        {oldPrice && <span className="text-sm font-bold line-through opacity-40 mb-1">De R$ {oldPrice}</span>}
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black tracking-tighter italic">R$ {installments}</span>
          <span className={`text-[9px] font-black uppercase tracking-widest ${recommended ? 'text-slate-500' : 'text-gray-400'}`}>/{period}</span>
        </div>
        {extraInfo && <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mt-2">{extraInfo}</p>}
        {pixPrice && (
          <p className={`mt-3 text-sm font-bold ${recommended ? 'text-emerald-400' : 'text-emerald-600'}`}>
            ou R$ {pixPrice} à vista
          </p>
        )}
      </div>

      <ul className="flex-1 space-y-6 mb-12">
        {features.map((feature: any, idx: number) => (
          <li key={idx} className="flex items-start gap-4">
            <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${recommended ? 'text-emerald-400' : 'text-brand-primary'}`} />
            <span className={`text-sm font-bold ${recommended ? 'text-slate-300' : 'text-gray-600'}`}>{feature}</span>
          </li>
        ))}
      </ul>
      
      <button
        onClick={() => handleSubscribe(planKey)}
        disabled={loading !== null || (planKey !== 'comunidade' && billingCycle === 'mensal')}
        className={`w-full py-6 rounded-[2rem] font-black text-xs tracking-widest transition-all shadow-xl active:scale-95 uppercase ${
          recommended ? 'bg-brand-primary text-white hover:bg-orange-600 shadow-brand-primary/20' : 'bg-gray-900 text-white hover:opacity-90 shadow-indigo-600/20'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {planKey !== 'comunidade' && billingCycle === 'mensal' ? 'DISPONÍVEL APENAS NO ANUAL' : (loading === planKey ? 'PROCESSANDO...' : btnText)}
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-20 pt-4 px-4 animate-[fade-in_0.4s_ease-out]">
      {/* Header Premium */}
      <div className="bg-[#0F172A] rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 text-left">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-indigo-500/10 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-xl">
                 <Sparkles className="h-10 w-10 text-brand-primary" />
              </div>
              <div>
                 <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-2 overflow-visible">
                    Ecossistema <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] italic uppercase">Menu de Negócios</span>
                 </h1>
                 <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">Conexões + Ferramentas + Autoridade.</p>
              </div>
            </div>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="flex flex-col items-center gap-6">
        <div className="bg-gray-100 p-1.5 rounded-[2rem] flex gap-1 shadow-inner border border-gray-200 w-fit">
          <button
            onClick={() => setBillingCycle('mensal')}
            className={`px-10 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all ${
              billingCycle === 'mensal'
                ? 'bg-white text-gray-900 shadow-xl scale-105'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setBillingCycle('anual')}
            className={`px-10 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              billingCycle === 'anual'
                ? 'bg-brand-primary text-white shadow-xl scale-105'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Anual <span className="bg-white/20 px-2 py-0.5 rounded-full text-[8px]">Melhor Oferta ✨</span>
          </button>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center max-w-lg">
          Transforme conexões em oportunidades e oportunidades em negócios reais dentro do nosso ecossistema.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch px-4 max-w-7xl mx-auto">
        <PlanCard
          type="ECOSSISTEMA BASE" 
          title="Plano Comunidade" 
          planKey="comunidade" 
          oldPrice={null} 
          pixPrice={billingCycle === 'mensal' ? "89,00" : "799,00"} 
          installments={billingCycle === 'mensal' ? "89,00" : "66,58"} 
          icon={User} 
          color="text-indigo-500" 
          btnText="FAZER PARTE"
          period={billingCycle === 'mensal' ? "mês" : "mês (no anual)"}
          subtitle="Ideal para empreendedores que querem acessar o ecossistema e gerar conexões."
          features={['Acesso à comunidade', 'Networking entre membros', 'NetworkingMeet online', 'Acesso às ferramentas da plataforma', 'Hub de Negócios', 'Vitrine Digital', 'CRM & Vendas', 'Gestão de Projetos', 'Clube de Vantagens', 'Menu Academy']}
        />
        <PlanCard
          type="OPORTUNIDADE EXCLUSIVA" 
          title="Plano Fundador" 
          planKey="fundador" 
          oldPrice="799,00" 
          pixPrice="599,00" 
          installments="49,91" 
          icon={Zap} 
          color="text-brand-primary" 
          btnText="SEJA UM FUNDADOR" 
          recommended={true}
          period="mês (no anual)"
          extraInfo="LIMITADO AOS 100 PRIMEIROS"
          subtitle="Uma oportunidade exclusiva para os 100 primeiros membros do ecossistema com benefícios vitalícios de reconhecimento."
          features={['Tudo do Plano Comunidade', 'Selo Membro Fundador permanente', 'Destaque visual no ecossistema', 'Acesso antecipado a novas funções', 'Prioridade em eventos presenciais', 'Gatilho de pertencimento geração 1']}
        />
        <PlanCard
          type="AUTORIDADE & VISIBILIDADE" 
          title="Plano Fundador PRO" 
          planKey="fundador_pro" 
          oldPrice="2.497,00" 
          pixPrice="1.497,00" 
          installments="124,75" 
          icon={Crown} 
          color="text-emerald-500" 
          btnText="QUERO POSICIONAMENTO" 
          period="mês (no anual)"
          subtitle="Plano premium para empreendedores que desejam mais visibilidade, autoridade e posicionamento."
          features={['Tudo do Plano Comunidade', 'Participação no Menucast', 'Vídeo profissional de apresentação', 'Acesso a 6 eventos de networking', 'Destaque máximo na comunidade', 'Posicionamento estratégico VIP']}
        />
      </div>

      {/* Diferencial Section */}
      <div className="bg-white rounded-[4rem] p-12 md:p-20 border border-gray-100 shadow-xl mx-4 text-center space-y-12 relative overflow-hidden group">
         <div className="relative z-10 space-y-8 max-w-4xl mx-auto">
            <h2 className="text-4xl font-black text-gray-900 leading-tight tracking-tight italic uppercase">
              O diferencial do <span className="text-brand-primary">Menu de Negócios</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                <Handshake className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
                <h4 className="font-black uppercase italic mb-2">Conexões</h4>
                <p className="text-xs text-gray-500 font-medium">Relacionamentos que geram oportunidades reais.</p>
              </div>
              <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                <Briefcase className="w-10 h-10 text-brand-primary mx-auto mb-4" />
                <h4 className="font-black uppercase italic mb-2">Ferramentas</h4>
                <p className="text-xs text-gray-500 font-medium">CRM, Projetos e Vitrine para sua gestão.</p>
              </div>
              <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                <Award className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                <h4 className="font-black uppercase italic mb-2">Autoridade</h4>
                <p className="text-xs text-gray-500 font-medium">Posicionamento profissional de destaque.</p>
              </div>
            </div>
            <p className="text-gray-900 text-xl font-black italic uppercase tracking-tighter">
              "Um ecossistema onde conexões se transformam em oportunidades e oportunidades se transformam em negócios."
            </p>
         </div>
      </div>
    </div>
  );
};
