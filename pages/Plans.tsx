import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Sparkles, Zap, Rocket, User, Trophy, CreditCard, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { paymentService } from '../services/paymentService';
import { useAuth } from '../contexts/AuthContext';
import { ConfirmModal } from '../components/ConfirmModal';

export const Plans: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'mensal' | 'semestral'>('semestral');

  const [loading, setLoading] = useState(false);
  const [showCpfModal, setShowCpfModal] = useState(false);
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'PIX' | 'DEBIT_CARD'>('PIX');
  const [pendingPlan, setPendingPlan] = useState<any>(null);

  // Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'info' | 'danger' | 'success' | 'warning'
  });

  const showAlert = (title: string, message: string, type: any = 'info') => {
    setModalConfig({ isOpen: true, title, message, type });
  };

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }

    const fetchProfile = async () => {
      if (user?.id) {
        const { data } = await supabase.from('profiles').select('cpf_cnpj').eq('user_id', user.id).single();
        if (data) {
          setUserProfile(data);
          if (data.cpf_cnpj) setCpfCnpj(data.cpf_cnpj);
        }
      }
    };
    fetchProfile();
  }, [isAuthenticated, navigate, user?.id]);

  const handleSubscribe = async (planKey: 'start' | 'pro' | 'full', methodOverride?: 'CREDIT_CARD' | 'PIX' | 'DEBIT_CARD') => {
    if (!isAuthenticated) {
      navigate(`/register?plan=${planKey}&cycle=${billingCycle}`);
      return;
    }

    setLoading(true);
    try {
      const cycle = billingCycle === 'mensal' ? 'MONTHLY' : 'SEMIANNUALLY';
      
      const result = await paymentService.checkout({
        planId: planKey,
        billingType: methodOverride || paymentMethod,
        cycle,
        cpfCnpj: cpfCnpj || undefined
      });

      if (result.invoiceUrl) {
        window.open(result.invoiceUrl, '_blank');
      } else {
        showAlert("Aviso", "Assinatura criada, mas o link de pagamento não foi gerado. Verifique seu e-mail.", "warning");
      }

    } catch (err: any) {
      if (err.message?.includes("CPF ou CNPJ") || err.message?.includes("cpfCnpj")) {
        setPendingPlan({ planKey });
        setShowCpfModal(true);
      } else {
        console.error("Erro na integração Asaas:", err);
        showAlert("Erro no Pagamento", err.message || "Ocorreu um erro ao processar sua assinatura.", "danger");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCpf = async () => {
    if (!cpfCnpj || cpfCnpj.length < 11) {
      showAlert("Dados Incompletos", "Por favor, informe um CPF ou CNPJ válido para continuar.", "warning");
      return;
    }
    setShowCpfModal(false);
    if (pendingPlan) {
      handleSubscribe(pendingPlan.planKey, paymentMethod);
    }
  };

  const PlanCard = ({
    type, title, subtitle, priceMonthly, priceSemiannual, oldPrice, features, recommended = false, icon: Icon, color, btnText, planKey, extraInfo, rewards
  }: any) => {
    const currentPrice = billingCycle === 'mensal' ? priceMonthly : priceSemiannual;
    const cycleText = billingCycle === 'mensal' ? 'Mensal' : 'Semestral';

    return (
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
            <span className="text-[10px] font-black uppercase tracking-widest font-mono opacity-60">{cycleText}</span>
            <span className="text-4xl font-black tracking-tighter italic">R$ {currentPrice}</span>
          </div>
        </div>
        {extraInfo && <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mt-4 bg-brand-primary/10 w-fit px-3 py-1 rounded-full">{extraInfo}</p>}
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
          onClick={() => {
            setPendingPlan({ planKey });
            setShowCpfModal(true);
          }}
          disabled={loading}
          className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 ${recommended ? 'bg-brand-primary text-white shadow-[0_20px_50px_rgba(246,124,1,0.3)] hover:bg-orange-600 hover:-translate-y-1' : 'bg-[#0F172A] text-white hover:bg-slate-800 hover:-translate-y-1'}`}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Rocket className="w-4 h-4" /> {btnText}</>}
        </button>
    </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-20 pt-4 px-4 animate-[fade-in_0.4s_ease-out]">
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
                <span className="bg-brand-primary text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">Campanha de Lançamento</span>
                <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">Até 31/Março</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-2 overflow-visible">
                Ecossistema <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] italic uppercase">Menu de Negócios</span>
              </h1>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">Selo Membro Fundador para todos que entrarem agora!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 text-center">
        <div className="space-y-4">
           <h2 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">Escolha seu plano de acesso</h2>
           <div className="h-1 w-20 bg-brand-primary rounded-full mx-auto"></div>
        </div>
        <div className="bg-white border border-gray-200 p-1.5 rounded-full flex items-center shadow-lg relative max-w-sm w-full mx-auto justify-center">
           <button onClick={() => setBillingCycle('mensal')} className={`flex-1 py-3 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all z-10 ${billingCycle === 'mensal' ? 'bg-gray-900 shadow-xl text-white' : 'text-slate-400 hover:text-slate-600 bg-transparent'}`}>MENSAL</button>
           <button onClick={() => setBillingCycle('semestral')} className={`flex-1 py-3 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all z-10 flex items-center justify-center gap-2 ${billingCycle === 'semestral' ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20' : 'text-slate-400 hover:text-slate-600 bg-transparent'}`}>
             SEMESTRAL {billingCycle === 'semestral' && <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] -ml-1">PROMO</span>}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch px-4 max-w-7xl mx-auto pt-4">
        <PlanCard type="STARTER" title="Plano Starter" planKey="start" priceMonthly="59,00" priceSemiannual="249,00" rewards={{ points: 50, cash: 50 }} icon={User} color="text-indigo-500" btnText="FAZER PARTE" subtitle="Acesso essencial ao ecossistema para começar a gerar conexões e visibilidade." features={['Vitrine Digital Personalizada', 'Agendamento Inteligente', 'Catálogo e Loja Virtual Completa', 'CRM e Gestão de Vendas Profissional', 'Controle Financeiro', 'Gestão de Projetos', 'Gestão de conteúdo', '20% de Desconto nos Eventos presenciais', 'Menu Club Anúncio - Somente no plano semestral.']} />
        <PlanCard type="PRO" title="Plano Pro" planKey="pro" priceMonthly="197,00" priceSemiannual="997,00" rewards={{ points: 100, cash: 100 }} icon={Zap} color="text-brand-primary" btnText="ACELERAR NEGÓCIOS" recommended={true} extraInfo="BÔNUS: SELO FUNDADOR" subtitle="Tudo do básico com ferramentas avançadas de gestão e vendas para escalar." features={['Mesmos Recursos do Plano Starter', 'Plataforma', '6 Eventos de Networking', 'Maior exposição dentro da plataforma', 'Menu Clube acesso para seus colaboradores', 'Mentoria Semanal Online', 'Participação no Menucast - (somente no plano Semestral)', 'Teaser + Fotos Profissionais - (somente no plano Semestral)', 'Convite Palestrante em eventos do Menu de Negócios- (somente no plano Semestral)']} />
        <PlanCard type="EQUIPES" title="Plano Equipes" planKey="full" priceMonthly="397,00" priceSemiannual="1.997,00" rewards={{ points: 200, cash: 200 }} icon={Rocket} color="text-purple-500" btnText="ASSUMIR LIDERANÇA" extraInfo="VAGAS LIMITADAS" subtitle="Para quem busca o topo. Mentoria direta e posicionamento de autoridade máxima." features={['Todos os recursos do Pro', 'Acesso para 3 pessoas da Empresa ou familia', 'Participação no Menucast -(somente no plano Semestral)', 'Teaser + Fotos Profissionais - (somente no plano Semestral)', '1 workshop de vendas- (somente no plano Semestral)', 'Treinamento presencial exclusivo para sua equipe (somente no plano Semestral)']} />
      </div>

      {showCpfModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="text-center space-y-4 mb-8">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">Dados de Faturamento</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">Escolha a forma de pagamento e informe seus dados.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Forma de Pagamento</label>
                <div className={`grid ${billingCycle === 'semestral' ? 'grid-cols-3' : 'grid-cols-2'} gap-3`}>
                  <button onClick={() => setPaymentMethod('PIX')} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'PIX' ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-100 hover:border-gray-200'}`}>
                    <Zap className={`w-5 h-5 ${paymentMethod === 'PIX' ? 'text-brand-primary' : 'text-gray-400'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'PIX' ? 'text-brand-primary' : 'text-gray-400'}`}>PIX</span>
                  </button>
                  {billingCycle === 'semestral' && (
                    <button onClick={() => setPaymentMethod('DEBIT_CARD')} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'DEBIT_CARD' ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-100 hover:border-gray-200'}`}>
                      <CreditCard className={`w-5 h-5 ${paymentMethod === 'DEBIT_CARD' ? 'text-brand-primary' : 'text-gray-400'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'DEBIT_CARD' ? 'text-brand-primary' : 'text-gray-400'}`}>Débito</span>
                    </button>
                  )}
                  <button onClick={() => setPaymentMethod('CREDIT_CARD')} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'CREDIT_CARD' ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-100 hover:border-gray-200'}`}>
                    <CreditCard className={`w-5 h-5 ${paymentMethod === 'CREDIT_CARD' ? 'text-brand-primary' : 'text-gray-400'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'CREDIT_CARD' ? 'text-brand-primary' : 'text-gray-400'}`}>Cartão</span>
                  </button>
                </div>
                {billingCycle === 'semestral' && paymentMethod === 'CREDIT_CARD' && (
                  <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest text-center mt-2 animate-pulse italic">
                    Parcelamento disponível em até 6x no cartão
                  </p>
                )}
                {billingCycle === 'mensal' && (
                   <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest text-center mt-2 italic opacity-60">
                    Assinatura mensal recorrente
                  </p>
                )}
              </div>

              {!userProfile?.cpf_cnpj && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CPF ou CNPJ</label>
                  <input type="text" value={cpfCnpj} onChange={(e) => setCpfCnpj(e.target.value)} placeholder="000.000.000-00" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none" />
                </div>
              )}

              <div className="flex flex-col gap-3 pt-2">
                <button onClick={handleConfirmCpf} className="w-full py-5 bg-brand-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:scale-[1.02] transition-all active:scale-95">Confirmar e Assinar</button>
                <button onClick={() => setShowCpfModal(false)} className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition-colors">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        confirmText="Entendi"
      />
    </div>
  );
};
