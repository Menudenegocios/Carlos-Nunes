
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
// Added ArrowRight to the imports from lucide-react to fix the reference error
import { Check, User, Briefcase, Store, Zap, Shield, Crown, CreditCard, Award, Mic, Video, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Plans: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'semestral' | 'anual'>('semestral');

  const handleSubscribe = async (plan: 'profissionais' | 'freelancers' | 'negocios') => {
    if (!user) return;
    setLoading(plan);
    try {
      await mockBackend.upgradePlan(user.id, plan);
      await refreshProfile();
      alert(`Sua assinatura foi processada com sucesso! Bem-vindo ao nível ${plan.toUpperCase()}.`);
      navigate('/dashboard');
    } catch (error) {
      alert('Erro ao processar assinatura.');
    } finally {
      setLoading(null);
    }
  };

  const PlanCard = ({ 
    type, title, subtitle, pixPrice, installments, oldPrice, features, recommended = false, icon: Icon, color, btnText, planKey, period = "semestral"
  }: any) => (
    <div className={`relative flex flex-col p-10 rounded-[3.5rem] border transition-all duration-500 ${recommended ? 'border-brand-primary bg-[#0F172A] text-white shadow-2xl scale-105 z-10' : 'border-gray-100 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-lg hover:shadow-xl hover:-translate-y-2'}`}>
      {recommended && (
        <div className="absolute top-0 right-12 -mt-4 bg-gradient-to-r from-brand-primary to-orange-600 text-white text-[10px] font-black tracking-widest px-6 py-2 rounded-full shadow-xl">
          MAIS POPULAR NO BAIRRO
        </div>
      )}
      <div className="mb-10">
        <div className={`inline-flex items-center justify-center p-6 rounded-[2.2rem] mb-8 ${recommended ? 'bg-brand-primary/20 text-brand-primary shadow-[0_0_30px_rgba(246,124,1,0.2)]' : 'bg-gray-50 dark:bg-zinc-800 text-brand-primary'}`}>
          <Icon className={`h-10 w-10 ${color}`} />
        </div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-3">{type}</h3>
        <h2 className="text-3xl font-black leading-tight mb-3 tracking-tighter italic uppercase">{title}</h2>
        <p className={`text-sm leading-relaxed font-medium ${recommended ? 'text-slate-400' : 'text-gray-500 dark:text-zinc-400'}`}>{subtitle}</p>
      </div>
      
      <div className="mb-12 flex flex-col">
         <span className="text-sm font-bold line-through opacity-40 mb-1">De R$ {oldPrice}</span>
         <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black tracking-tighter italic">{installments}</span>
            <span className={`text-[10px] font-black uppercase tracking-widest ${recommended ? 'text-slate-500' : 'text-gray-400'}`}>/{period}</span>
         </div>
         <p className={`mt-3 text-sm font-bold ${recommended ? 'text-emerald-400' : 'text-emerald-600'}`}>
            ou R$ {pixPrice} à vista no Pix
         </p>
      </div>

      <ul className="flex-1 space-y-6 mb-12">
        {features.map((feature: any, idx: number) => (
          <li key={idx} className="flex items-start gap-4">
            <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${recommended ? 'text-emerald-400' : 'text-brand-primary'}`} />
            <span className={`text-sm font-bold ${recommended ? 'text-slate-300' : 'text-gray-600 dark:text-zinc-300'}`}>{feature}</span>
          </li>
        ))}
      </ul>
      
      <button
        onClick={() => handleSubscribe(planKey)}
        disabled={loading !== null}
        className={`w-full py-6 rounded-[2rem] font-black text-xs tracking-widest transition-all shadow-xl active:scale-95 uppercase ${
          recommended ? 'bg-brand-primary text-white hover:bg-orange-600 shadow-brand-primary/20' : 'bg-gray-900 dark:bg-indigo-600 text-white hover:opacity-90 shadow-indigo-600/20'
        } disabled:opacity-50`}
      >
        {loading === planKey ? 'PROCESSANDO...' : btnText}
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-20 pt-4 px-4 animate-[fade-in_0.4s_ease-out]">
      {/* Header Premium SaaS */}
      <div className="bg-[#0F172A] dark:bg-black rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-indigo-500/10 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-xl">
                 <CreditCard className="h-10 w-10 text-brand-primary" />
              </div>
              <div>
                 <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-2">
                    Planos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] dark:from-brand-primary dark:to-brand-accent italic uppercase">Adesão</span>
                 </h1>
                 <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">Escalabilidade e visibilidade para sua marca.</p>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md px-8 py-5 rounded-3xl border border-white/10 flex items-center gap-4">
                <Shield className="w-8 h-8 text-emerald-400" />
                <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Garantia total</p>
                    <p className="text-xs font-bold text-white">7 dias para cancelamento</p>
                </div>
            </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="bg-gray-100 dark:bg-zinc-800 p-1.5 rounded-[2rem] flex gap-1 shadow-inner border border-gray-200 dark:border-zinc-700">
          <button
            onClick={() => setBillingCycle('semestral')}
            className={`px-10 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all ${
              billingCycle === 'semestral'
                ? 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-xl scale-105'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300'
            }`}
          >
            Semestral
          </button>
          <button
            onClick={() => setBillingCycle('anual')}
            className={`px-10 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              billingCycle === 'anual'
                ? 'bg-brand-primary text-white shadow-xl scale-105'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300'
            }`}
          >
            Anual <span className="bg-white/20 px-2 py-0.5 rounded-full text-[8px]">Economize ✨</span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start px-4">
        <PlanCard
          type="ESSENCIAL PARA COMEÇAR" 
          title="Plano Básico" 
          planKey="profissionais" 
          oldPrice={billingCycle === 'semestral' ? "697" : "897"} 
          pixPrice={billingCycle === 'semestral' ? "297" : "397"} 
          installments={billingCycle === 'semestral' ? "12x R$ 29,90" : "12x R$ 39,90"} 
          icon={User} 
          color="text-indigo-500" 
          btnText="ATIVAR BÁSICO"
          period={billingCycle}
          subtitle="Ideal para profissionais liberais que precisam de uma bio profissional e acesso à rede local de parceiros."
          features={['Bio digital inteligente personalizada', 'Acesso ao Menu Academy fundamental', 'Participação no clube de vantagens', 'Marketplace B2B (modo leitura)', 'Suporte via e-mail']}
        />
        <PlanCard
          type="ALTA PERFORMANCE" 
          title="Plano PRO" 
          planKey="freelancers" 
          oldPrice={billingCycle === 'semestral' ? "897" : "1.297"} 
          pixPrice={billingCycle === 'semestral' ? "497" : "697"} 
          installments={billingCycle === 'semestral' ? "12x R$ 49,90" : "12x R$ 69,90"} 
          icon={Briefcase} 
          color="text-brand-primary" 
          btnText="QUERO SER PRO" 
          recommended={true}
          period={billingCycle}
          subtitle="Acelere suas vendas com catálogo completo, CRM de gestão e destaque prioritário nas buscas regionais."
          features={['Tudo do Plano Básico incluso', 'Catálogo e loja virtual completa', 'CRM e gestão de vendas profissional', 'Marketplace B2B (anunciar e comprar)', 'Menu Academy PRO (estratégias)', 'Desconto de 50% em eventos']}
        />
        <PlanCard
          type="DOMINAÇÃO TOTAL" 
          title="Plano Business" 
          planKey="negocios" 
          oldPrice={billingCycle === 'semestral' ? "2.997" : "3.497"} 
          pixPrice={billingCycle === 'semestral' ? "1.497" : "1.790"} 
          installments={billingCycle === 'semestral' ? "12x R$ 149,90" : "12x R$ 179,90"} 
          icon={Store} 
          color="text-emerald-500" 
          btnText="ATIVAR BUSINESS"
          period={billingCycle}
          subtitle="Consultoria estratégica personalizada e produção de conteúdo de elite para marcas que querem dominar o bairro."
          features={['Tudo do Plano PRO liberado', 'Participação no Menucast oficial', 'Consultoria estratégica mensal individual', 'Produção de vídeo comercial de elite', 'Selo de autoridade máxima no diretório', 'Trilha de negócios personalizada']}
        />
      </div>

      {/* Final Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-[4rem] p-12 md:p-20 border border-gray-100 dark:border-zinc-800 shadow-xl mx-4 text-center space-y-8 relative overflow-hidden group">
         <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950 rounded-full flex items-center justify-center mx-auto mb-6"><Award className="w-10 h-10 text-indigo-600" /></div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white leading-none tracking-tight italic uppercase">Ainda tem dúvidas sobre o melhor caminho?</h2>
            <p className="text-gray-500 dark:text-zinc-400 text-lg font-medium">Nosso time de consultores está pronto para analisar seu momento de negócio e sugerir a ferramenta que trará o melhor retorno sobre investimento.</p>
            <div className="pt-6">
               <button className="bg-gray-900 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-600 transition-all flex items-center gap-2 mx-auto active:scale-95">
                 Falar com consultor agora <ArrowRight className="w-4 h-4" />
               </button>
            </div>
         </div>
         <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
};
