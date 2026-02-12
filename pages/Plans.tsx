
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { Check, User, Briefcase, Store, Zap, Shield, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Plans: React.FC = () => {
  const { user, login } = useAuth(); // We use login to update the user context
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: 'profissionais' | 'freelancers' | 'negocios') => {
    if (!user) return;
    setLoading(plan);
    try {
      // Mock Payment Process
      const updatedUser = await mockBackend.upgradePlan(user.id, plan);
      // Update local context
      login(updatedUser, localStorage.getItem('menu_token') || '');
      alert(`Plano atualizado com sucesso! Bem-vindo ao plano ${plan.toUpperCase()}.`);
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
    price, 
    features, 
    recommended = false, 
    icon: Icon,
    color,
    btnText,
    planKey
  }: { 
    type: string, 
    title: string,
    subtitle: string,
    price: string, 
    features: string[], 
    recommended?: boolean, 
    icon: any,
    color: string,
    btnText: string,
    planKey: 'profissionais' | 'freelancers' | 'negocios'
  }) => (
    <div className={`relative flex flex-col p-6 rounded-3xl border transition-all duration-300 ${recommended ? 'border-indigo-500 bg-gray-900 text-white shadow-2xl scale-105 z-10' : 'border-gray-200 bg-white text-gray-900 shadow-lg hover:shadow-xl hover:-translate-y-1'}`}>
      {recommended && (
        <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          POPULAR
        </div>
      )}
      <div className="mb-6">
        <div className={`inline-flex items-center justify-center p-3 rounded-2xl mb-4 ${recommended ? 'bg-indigo-500/20 text-indigo-300' : 'bg-gray-100 text-gray-600'}`}>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider opacity-70 mb-1">{type}</h3>
        <h2 className="text-2xl font-black leading-tight mb-2">{title}</h2>
        <p className={`text-sm leading-snug ${recommended ? 'text-gray-400' : 'text-gray-500'}`}>{subtitle}</p>
      </div>
      
      <div className="mb-6">
         <span className="text-3xl font-extrabold">{price}</span>
         {price !== 'Grátis' && <span className={`text-sm ${recommended ? 'text-gray-400' : 'text-gray-500'}`}>/mês</span>}
      </div>

      <ul className="flex-1 space-y-4 mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <Check className={`h-5 w-5 flex-shrink-0 ${recommended ? 'text-green-400' : 'text-green-600'}`} />
            <span className={`text-sm font-medium ${recommended ? 'text-gray-300' : 'text-gray-600'}`}>{feature}</span>
          </li>
        ))}
      </ul>
      
      <button
        onClick={() => handleSubscribe(planKey)}
        disabled={loading !== null || user?.plan === planKey}
        className={`w-full py-4 px-4 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl ${
          recommended 
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border border-transparent' 
            : 'bg-gray-900 text-white hover:bg-gray-800'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {user?.plan === planKey 
          ? 'SEU PLANO ATUAL' 
          : loading === planKey 
            ? 'PROCESSANDO...' 
            : btnText}
      </button>
    </div>
  );

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto space-y-16">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Escolha o plano ideal para <span className="text-indigo-600">você crescer.</span>
        </h1>
        <p className="text-xl text-gray-500 leading-relaxed">
          Menu ADS conecta profissionais, freelancers e negócios locais a oportunidades reais. Sem comissões, apenas visibilidade.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* PLANO PROFISSIONAIS */}
        <PlanCard
          type="PARA QUEM QUER SE APRESENTAR"
          title="Plano Profissionais"
          subtitle="Seu perfil digital profissional, simples e inteligente. Ideal para transição de carreira."
          price="Grátis"
          planKey="profissionais"
          icon={User}
          color="text-blue-500"
          btnText="CRIAR PERFIL GRÁTIS"
          features={[
            'Bio digital estilo cartão inteligente',
            'Link exclusivo para compartilhar',
            'Foto + apresentação profissional',
            'Bio criada com apoio de IA',
            'Experiências e habilidades',
            'Botões de contato (WhatsApp/Redes)',
            'Visibilidade nas buscas por talentos'
          ]}
        />

        {/* PLANO FREELANCERS */}
        <PlanCard
          type="PARA QUEM VENDE SERVIÇOS"
          title="Plano Freelancers"
          subtitle="Seu serviço visível para quem está procurando agora. Ideal para autônomos."
          price="R$ 29,90"
          planKey="freelancers"
          recommended={true}
          icon={Briefcase}
          color="text-indigo-400"
          btnText="QUERO MAIS ORÇAMENTOS"
          features={[
            'Tudo do Plano Profissionais',
            'Anúncios de serviços no Feed',
            'Página de vendas do serviço',
            'Lista de serviços c/ preço ou orçamento',
            'Vitrine digital simples',
            'Contato direto via WhatsApp',
            'Apoio de IA para descrição',
            'Destaque local por categoria'
          ]}
        />

        {/* PLANO NEGÓCIOS LOCAIS */}
        <PlanCard
          type="PARA EMPRESAS E COMÉRCIOS"
          title="Plano Negócios Locais"
          subtitle="Sua vitrine digital para gerar oportunidades todos os dias."
          price="R$ 59,90"
          planKey="negocios"
          icon={Store}
          color="text-emerald-500"
          btnText="CRIAR VITRINE DIGITAL"
          features={[
            'Anúncios profissionais ilimitados',
            'Página completa do negócio',
            'Vitrine digital de produtos',
            'Contato direto com clientes',
            'Aceitar Pagamento (Pix / Cartão)',
            'Destaque por cidade ou bairro',
            'Selos de confiança',
            'Relatórios de visualização'
          ]}
        />
      </div>

      {/* Positioning Footer */}
      <div className="bg-gray-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
         <div className="relative z-10">
            <Target className="w-12 h-12 text-indigo-500 mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Menu ADS: Foco no que importa.
            </h2>
            <p className="text-indigo-200 text-lg max-w-2xl mx-auto mb-8">
              Sem complicação. Sem comissões sobre suas vendas. Apenas a visibilidade e as ferramentas que você precisa para encontrar oportunidades reais no seu bairro.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 text-sm font-bold text-gray-400">
               <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Visibilidade Local</span>
               <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Contato Direto</span>
               <span className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Tecnologia IA</span>
            </div>
         </div>
         {/* Abstract Decoration */}
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/50 pointer-events-none"></div>
      </div>

    </div>
  );
};
