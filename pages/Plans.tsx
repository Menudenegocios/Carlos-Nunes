
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { Check, User, Briefcase, Store, Zap, Shield, Crown, CheckCircle, Mic, Video, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Plans: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: 'profissionais' | 'freelancers' | 'negocios') => {
    if (!user) return;
    setLoading(plan);
    try {
      await mockBackend.upgradePlan(user.id, plan);
      await refreshProfile();
      alert(`Assinatura processada! Você agora tem acesso aos benefícios do plano selecionado.`);
      navigate('/dashboard');
    } catch (error) {
      alert('Erro ao processar assinatura.');
    } finally {
      setLoading(null);
    }
  };

  const PlanCard = ({ 
    type, 
    title,
    subtitle,
    pixPrice, 
    installments,
    oldPrice,
    features, 
    recommended = false, 
    icon: Icon,
    color,
    btnText,
    planKey,
    period = "semestral"
  }: { 
    type: string, 
    title: string,
    subtitle: string,
    pixPrice: string, 
    installments: string,
    oldPrice: string,
    features: (string | React.ReactNode)[], 
    recommended?: boolean, 
    icon: any,
    color: string,
    btnText: string,
    planKey: string,
    period?: string
  }) => (
    <div className={`relative flex flex-col p-8 rounded-[3.5rem] border transition-all duration-500 ${recommended ? 'border-indigo-500 bg-gray-900 text-white shadow-2xl scale-105 z-10' : 'border-gray-200 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-lg hover:shadow-xl hover:-translate-y-2'}`}>
      {recommended && (
        <div className="absolute top-0 right-12 -mt-4 bg-gradient-to-r from-brand-primary to-orange-600 text-white text-[10px] font-black tracking-widest px-6 py-2 rounded-full shadow-xl">
          MAIS VENDIDO
        </div>
      )}
      <div className="mb-8">
        <div className={`inline-flex items-center justify-center p-5 rounded-[2rem] mb-6 ${recommended ? 'bg-indigo-500/20 text-indigo-400' : 'bg-brand-surface dark:bg-zinc-800 text-brand-primary'}`}>
          <Icon className={`h-10 w-10 ${color}`} />
        </div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-2">{type}</h3>
        <h2 className="text-3xl font-black leading-tight mb-2 tracking-tighter">{title}</h2>
        <p className={`text-sm leading-relaxed font-medium ${recommended ? 'text-gray-400' : 'text-gray-500 dark:text-zinc-400'}`}>{subtitle}</p>
      </div>
      
      <div className="mb-10 flex flex-col">
         <span className="text-sm font-bold line-through opacity-40 mb-1">De R$ {oldPrice}</span>
         <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black tracking-tighter">{installments}</span>
            <span className={`text-xs font-black uppercase tracking-widest ${recommended ? 'text-gray-500' : 'text-gray-400'}`}>/{period}</span>
         </div>
         <p className={`mt-2 text-sm font-bold ${recommended ? 'text-emerald-400' : 'text-emerald-600'}`}>
            ou R$ {pixPrice} no Pix
         </p>
      </div>

      <ul className="flex-1 space-y-5 mb-10">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-4">
            <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${recommended ? 'text-emerald-400' : 'text-brand-primary'}`} />
            <span className={`text-sm font-bold ${recommended ? 'text-gray-300' : 'text-gray-600 dark:text-zinc-300'}`}>{feature}</span>
          </li>
        ))}
      </ul>
      
      <button
        onClick={() => handleSubscribe(planKey as any)}
        disabled={loading !== null}
        className={`w-full py-6 px-4 rounded-3xl font-black text-xs tracking-widest transition-all shadow-xl active:scale-95 ${
          recommended 
            ? 'bg-brand-primary text-white hover:bg-orange-600' 
            : 'bg-gray-900 dark:bg-emerald-600 text-white hover:opacity-90'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading === planKey ? 'PROCESSANDO...' : btnText}
      </button>
    </div>
  );

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto space-y-24">
      
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-brand-primary/20">
           <Zap className="w-3.5 h-3.5" /> Planos de Adesão
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter leading-none">
          Escale sua presença <br/><span className="text-brand-primary">no bairro.</span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-zinc-400 leading-relaxed font-medium max-w-2xl mx-auto">
          Escolha o nível de visibilidade e as ferramentas que seu negócio precisa para dominar a região com o melhor custo-benefício.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        
        {/* PLANO BÁSICO */}
        <PlanCard
          type="ESSENCIAL PARA COMEÇAR"
          title="Plano Básico"
          subtitle="Ideal para profissionais liberais que precisam de uma bio profissional e acesso à rede."
          oldPrice="697"
          pixPrice="297"
          installments="12x R$ 29,90"
          period="semestral"
          planKey="profissionais"
          icon={User}
          color="text-indigo-500"
          btnText="ASSINAR BÁSICO"
          features={[
            'Visão Geral do Dashboard',
            'Bio Digital Inteligente',
            'Marketplace B2B (Apenas Compras)',
            'Acesso ao Menu Academy',
            'Participação no Clube de Vantagens'
          ]}
        />

        {/* PLANO PRO */}
        <PlanCard
          type="ALTA PERFORMANCE"
          title="Plano PRO"
          subtitle="Acelere suas vendas com catálogo completo, CRM e destaque prioritário."
          oldPrice="897"
          pixPrice="497"
          installments="12x R$ 49,90"
          period="semestral"
          planKey="freelancers"
          recommended={true}
          icon={Briefcase}
          color="text-brand-primary"
          btnText="QUERO SER PRO"
          features={[
            'Tudo do Plano Básico',
            'Bio Digital PRO (Recursos Extras)',
            'Catálogo & Loja Virtual Completa',
            'CRM & Gestão de Vendas (Pipeline)',
            'Marketplace B2B PRO (Anunciar e Comprar)',
            'Menu Academy PRO (Conteúdo Premium)',
            'Desconto 50% em Eventos Oficiais'
          ]}
        />

        {/* PLANO BUSINESS */}
        <PlanCard
          type="DOMINAÇÃO TOTAL"
          title="Plano Business"
          subtitle="Consultoria estratégica e produção de conteúdo de elite para sua marca."
          oldPrice="2.997"
          pixPrice="1.497"
          installments="12x R$ 149,90"
          period="semestral"
          planKey="negocios"
          icon={Store}
          color="text-emerald-500"
          btnText="ATIVAR BUSINESS"
          features={[
            'Tudo do Plano PRO',
            <div className="flex items-center gap-2">Participação no <strong className="text-emerald-500 flex items-center gap-1"><Mic className="w-3 h-3"/> Menucast</strong></div>,
            'Trilha de Negócios Personalizada',
            <div className="flex items-center gap-2">Produção de <strong className="text-emerald-500 flex items-center gap-1"><Video className="w-3 h-3"/> Vídeo de Vendas</strong></div>,
            <div className="flex items-center gap-2"><strong className="text-emerald-500 flex items-center gap-1"><Award className="w-3 h-3"/> Pitch Destaque</strong> - Sua Palestra Oficial</div>
          ]}
        />
      </div>

      {/* Comparison & Trust */}
      <div className="bg-white dark:bg-zinc-900 rounded-[4rem] p-12 border border-gray-100 dark:border-zinc-800 shadow-2xl overflow-hidden relative">
         <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-8">
               <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none">Por que investir no <br/><span className="text-brand-primary">Menu ADS?</span></h2>
               <div className="space-y-6">
                  <div className="flex gap-6 items-start">
                     <div className="w-14 h-14 rounded-[1.5rem] bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 flex-shrink-0 shadow-sm"><CheckCircle className="w-7 h-7" /></div>
                     <div>
                        <h4 className="font-black text-gray-900 dark:text-white text-lg">Retorno sobre Visibilidade</h4>
                        <p className="text-gray-500 dark:text-zinc-400 font-medium leading-relaxed">Nossos membros ativos relatam um aumento médio de 40% em contatos de clientes qualificados no primeiro trimestre.</p>
                     </div>
                  </div>
                  <div className="flex gap-6 items-start">
                     <div className="w-14 h-14 rounded-[1.5rem] bg-brand-primary/10 flex items-center justify-center text-brand-primary flex-shrink-0 shadow-sm"><Shield className="w-7 h-7" /></div>
                     <div>
                        <h4 className="font-black text-gray-900 dark:text-white text-lg">Sem Comissões Ocultas</h4>
                        <p className="text-gray-500 dark:text-zinc-400 font-medium leading-relaxed">Diferente de apps de delivery ou marketplaces, no Menu ADS o lucro da venda direta no seu WhatsApp é 100% seu.</p>
                     </div>
                  </div>
               </div>
            </div>
            <div className="relative">
               <div className="aspect-[4/3] rounded-[3rem] bg-gray-900 overflow-hidden shadow-2xl relative border-8 border-white dark:border-zinc-800">
                  <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 text-white">
                     <Crown className="w-16 h-16 text-brand-primary mb-6 animate-pulse" />
                     <h3 className="text-3xl font-black tracking-tight mb-2 uppercase">Elite Network</h3>
                     <p className="text-sm font-bold opacity-70 tracking-widest">JUNTE-SE AOS MELHORES DO SEU BAIRRO</p>
                  </div>
               </div>
               <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl"></div>
            </div>
         </div>
      </div>

    </div>
  );
};
