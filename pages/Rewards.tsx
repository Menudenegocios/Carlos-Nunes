
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { 
  Trophy, Gift, TrendingUp, Star,
  Zap, Crown, ChevronRight,
  CheckCircle, ListTodo, Medal, Home as HomeIcon,
  Award, Rocket, Users, ArrowUp, Sparkles, ShoppingBag, Clock,
  Ticket, Wand2, Handshake, Plus, Search, ArrowRight, X, RefreshCw, Shield
} from 'lucide-react';
import { Prize, PointsTransaction, User, B2BOffer, B2BTransaction } from '../types';
import { SectionLanding } from '../components/SectionLanding';
import { pointsRules, tiers, rankingRules } from '../config/gamificationConfig';

export const Rewards: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'acceleration' | 'missions' | 'match' | 'ranking'>('home');

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 pt-4 px-4">
      {/* Header Estilo Unificado Menu Club */}
      <div className="bg-[#0F172A] dark:bg-black rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-indigo-500/10 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-xl">
                 <Trophy className="h-10 w-10 text-brand-primary" />
              </div>
              <div>
                 <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-2">
                    Menu <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] dark:from-brand-primary dark:to-brand-accent italic uppercase">Club</span>
                 </h1>
                 <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">TRANSFORME SUA ATIVIDADE EM CRESCIMENTO REAL.</p>
              </div>
            </div>
            
            <div className="flex gap-6">
               <div className="bg-white/5 backdrop-blur-xl p-4 md:p-6 rounded-[2.2rem] border border-white/10 shadow-xl flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest leading-none mb-1">Seu Saldo</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-3xl font-black text-white">{user.points}</span>
                      <Zap className="w-5 h-5 text-brand-primary fill-current" />
                    </div>
                  </div>
               </div>
               <div className="bg-white/5 backdrop-blur-xl p-4 md:p-6 rounded-[2.2rem] border border-white/10 shadow-xl flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Seu Nível</p>
                    <span className="text-2xl font-black text-white uppercase italic">{user.level}</span>
                  </div>
                  <Crown className="w-8 h-8 text-indigo-400 fill-current" />
               </div>
            </div>
          </div>

          <div className="flex p-1.5 mt-12 bg-white/5 backdrop-blur-md rounded-[2.2rem] border border-white/10 w-fit overflow-x-auto scrollbar-hide gap-1">
              {[
                  { id: 'home', label: 'INÍCIO', desc: 'Destaques', icon: HomeIcon },
                  { id: 'missions', label: 'PONTOS', desc: 'Ganhar pontos', icon: ListTodo },
                  { id: 'acceleration', label: 'NÍVEIS', desc: 'Sua autoridade', icon: Zap },
                  { id: 'match', label: 'MENU CASH', desc: 'Parcerias B2B', icon: Handshake },
                  { id: 'ranking', label: 'RANKING', desc: 'Competição', icon: Medal },
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
        {activeTab === 'home' && (
            <SectionLanding 
                title="O motor da economia colaborativa"
                subtitle="Menu Club"
                description="O Menu Club é o núcleo da movimentação econômica do ecossistema. Aqui, quanto mais o empreendedor se movimenta, mais oportunidades ele gera dentro da comunidade."
                benefits={[
                "Realizam negócios B2B dentro da rede",
                "Geram oportunidades por meio de indicações",
                "Utilizam e acumulam Menu Cash (moeda interna)",
                "Aumentam visibilidade e autoridade pela participação ativa"
                ]}
                youtubeId="dQw4w9WgXcQ"
                ctaLabel="VER MEUS PONTOS"
                onStart={() => setActiveTab('missions')}
                icon={Trophy}
                accentColor="brand"
            />
        )}

        {activeTab === 'acceleration' && <LevelsView user={user} />}
        {activeTab === 'missions' && (
          <div className="space-y-12 animate-fade-in">
             <MissionsView />
          </div>
        )}
        {activeTab === 'match' && <B2BMatchView user={user} />}
        {activeTab === 'ranking' && <RankingView />}
      </div>
    </div>
  );
};

const B2BMatchView = ({ user }: { user: User }) => {
  const [activeSubTab, setActiveSubTab] = useState<'offers' | 'transactions'>('offers');
  const [offers, setOffers] = useState<B2BOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: '',
    category: 'Serviços',
    terms: ''
  });

  useEffect(() => { 
    loadOffers(); 
  }, []);

  const loadOffers = async () => {
    setIsLoading(true);
    try {
      const data = await supabaseService.getB2BOffers();
      setOffers(data);
    } finally { 
      setIsLoading(false); 
    }
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const newOffer = await supabaseService.createB2BOffer({
        ...formData,
        userId: user.id,
        businessName: user.name,
        businessLogo: `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
      });
      // Atualiza a lista local imediatamente para visualização instantânea
      setOffers(prev => [newOffer, ...prev]);
      setIsModalOpen(false);
      setFormData({ title: '', description: '', discount: '', category: 'Serviços', terms: '' });
    } catch (err) {
      console.error("Erro ao publicar:", err);
      alert("Erro ao publicar oportunidade. Tente novamente.");
    } finally { 
      setIsSaving(false); 
    }
  };

  const filteredOffers = offers.filter(o => 
    o.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-fade-in">
       <div className="bg-indigo-600 rounded-[3rem] p-10 md:p-12 text-white relative overflow-hidden shadow-xl mb-12">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="space-y-4 max-w-xl">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter">Menu Cash B2B</h3>
                <p className="text-indigo-100 font-medium">Crie conexões diretas com outros empresários da rede e movimente a economia colaborativa.</p>
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
           <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 md:p-12 border border-gray-100 dark:border-zinc-800 shadow-xl mb-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                 <div className="space-y-6">
                    <div className="flex items-center gap-3">
                       <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl text-emerald-600">
                          <Zap className="w-6 h-6 fill-current" />
                       </div>
                       <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">💰 MENU CASH – A MOEDA INTERNA</h3>
                    </div>
                    <p className="text-gray-500 dark:text-zinc-400 font-medium">O Menu Club funciona com uma moeda interna chamada Menu Cash. O dinheiro continua circulando dentro da rede, criando retenção e prosperidade coletiva.</p>
                    
                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Regras de Cashback por Nível:</p>
                       <div className="grid grid-cols-1 gap-3">
                          {[
                            "Bronze: 5% de cashback",
                            "Ouro: 10% de cashback",
                            "Diamante: 20% de cashback + Anunciar na Menu Store"
                          ].map((text, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700 dark:text-zinc-300">
                               <CheckCircle className="w-4 h-4 text-emerald-500" /> {text}
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="bg-gray-50 dark:bg-zinc-800/50 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 space-y-6">
                    <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest flex items-center gap-2">
                       <Shield className="w-4 h-4" /> Regra importante
                    </p>
                    <ul className="space-y-4">
                       {[
                         "Menu Cash só pode ser usado dentro da plataforma",
                         "Pode utilizar até 30% do valor de uma compra",
                         "Saldo válido enquanto o plano estiver ativo"
                       ].map((text, i) => (
                         <li key={i} className="flex gap-3 text-xs font-medium text-gray-500 dark:text-zinc-400">
                            <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-1.5 shrink-0"></div>
                            {text}
                         </li>
                       ))}
                    </ul>
                    <div className="pt-4 border-t border-gray-200 dark:border-zinc-700">
                       <p className="text-sm font-black text-gray-900 dark:text-white italic">"Isso cria circulação e retenção."</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
             <div className="w-full max-w-xl relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                   type="text" 
                   placeholder="Filtrar parceiros por serviço ou nome..." 
                   className="w-full pl-14 pr-6 py-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl font-bold shadow-sm focus:ring-4 focus:ring-indigo-50 outline-none transition-all dark:text-white"
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                />
             </div>
             <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full md:w-auto bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 active:scale-95"
             >
                <Plus className="w-5 h-5" /> PUBLICAR OPORTUNIDADE
             </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                 [1,2,3].map(i => <div key={i} className="h-64 bg-gray-100 dark:bg-zinc-800 rounded-[2.5rem] animate-pulse"></div>)
              ) : filteredOffers.length === 0 ? (
                 <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-zinc-800/20 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-zinc-800">
                    <Handshake className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest">Nenhuma oportunidade de Menu Cash encontrada.</p>
                 </div>
              ) : filteredOffers.map(offer => (
                 <div key={offer.id} className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                       <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 overflow-hidden border-2 border-white dark:border-zinc-800 shadow-md">
                          <img src={offer.businessLogo} className="w-full h-full object-cover" alt="Logo" />
                       </div>
                       <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-900 uppercase">
                          {offer.discount}
                       </span>
                    </div>
                    <div className="flex-1 space-y-3">
                       <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight line-clamp-1">{offer.title}</h3>
                       <p className="text-[10px] text-indigo-600 dark:text-brand-primary font-black uppercase tracking-widest">{offer.businessName}</p>
                       <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed line-clamp-2">{offer.description}</p>
                    </div>
                    <button className="mt-8 w-full py-4 bg-gray-900 dark:bg-zinc-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all active:scale-95">
                       SOLICITAR CONEXÃO <ArrowRight className="w-3 h-3" />
                    </button>
                 </div>
              ))}
           </div>
         </>
       ) : (
         <B2BTransactionsView user={user} />
       )}

       {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
             <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-white/5 animate-scale-in">
                 <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                     <div>
                         <h3 className="text-2xl font-black uppercase italic tracking-tighter">Publicar Oportunidade</h3>
                         <p className="text-[10px] font-black text-[#F67C01] tracking-widest mt-1 uppercase">Sua oferta ficará visível na aba MENU CASH</p>
                     </div>
                     <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                 </div>
                 <form onSubmit={handleCreateOffer} className="p-10 space-y-6">
                     <div>
                         <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 text-left">Título da Oportunidade</label>
                         <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ex: Parceria em Gestão de Redes Sociais" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 text-left">Benefício / Desconto</label>
                             <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} placeholder="Ex: 15% OFF ou Consultoria Grátis" />
                         </div>
                         <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 text-left">Categoria B2B</label>
                             <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                 <option>Serviços</option>
                                 <option>Insumos</option>
                                 <option>Tecnologia</option>
                                 <option>Marketing</option>
                             </select>
                         </div>
                     </div>
                     <div>
                         <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 text-left">O que você está oferecendo?</label>
                         <textarea required rows={3} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-medium text-sm dark:text-white resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Descreva os detalhes da parceria..." />
                     </div>
                     <button type="submit" disabled={isSaving} className="w-full bg-[#F67C01] text-white font-black py-5 rounded-[2rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-orange-600 transition-all">
                         {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'PUBLICAR OPORTUNIDADE AGORA'}
                     </button>
                 </form>
             </div>
          </div>
       )}
    </div>
  );
};

const B2BTransactionsView = ({ user }: { user: User }) => {
  const [transactions, setTransactions] = useState<B2BTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    sellerName: '',
    amount: '',
    description: ''
  });

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
        buyerId: user.id,
        buyerName: user.name,
        sellerId: 'mock_seller_id', // Na vida real, selecionaria o usuário
        sellerName: formData.sellerName,
        amount: parseFloat(formData.amount),
        description: formData.description
      });
      setTransactions(prev => [newTx, ...prev]);
      setIsModalOpen(false);
      setFormData({ sellerName: '', amount: '', description: '' });
    } catch (err) {
      console.error("Erro ao registrar:", err);
      alert("Erro ao registrar transação.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirm = async (id: string, status: 'confirmed' | 'rejected') => {
    try {
      await supabaseService.updateB2BTransactionStatus(id, status);
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    } catch (err) {
      console.error("Erro ao atualizar:", err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black uppercase italic tracking-tighter dark:text-white">Minhas Transações B2B</h3>
          <p className="text-slate-500 font-medium text-sm">Registre negócios fechados com outros membros para ganhar Menu Cash.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-primary text-white px-8 py-4 rounded-[2rem] font-black text-[11px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-3 active:scale-95"
        >
          <Plus className="w-5 h-5" /> REGISTRAR NEGÓCIO
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-zinc-800 rounded-3xl animate-pulse"></div>)}
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-20 text-center bg-gray-50 dark:bg-zinc-800/20 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-zinc-800">
          <Handshake className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-gray-400 font-bold uppercase tracking-widest">Nenhuma transação registrada ainda.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map(tx => (
            <div key={tx.id} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${tx.status === 'confirmed' ? 'bg-emerald-500' : tx.status === 'rejected' ? 'bg-red-500' : 'bg-orange-500'}`}>
                  {tx.status === 'confirmed' ? <CheckCircle className="w-6 h-6" /> : tx.status === 'rejected' ? <X className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-black text-gray-900 dark:text-white text-lg">{tx.buyerId === user.id ? `Compra de ${tx.sellerName}` : `Venda para ${tx.buyerName}`}</h4>
                  <p className="text-xs text-slate-500 font-medium">{tx.description}</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-6">
                <div>
                  <p className="text-lg font-black text-gray-900 dark:text-white">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tx.amount)}
                  </p>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${tx.status === 'confirmed' ? 'text-emerald-500' : tx.status === 'rejected' ? 'text-red-500' : 'text-orange-500'}`}>
                    {tx.status === 'confirmed' ? 'Confirmado' : tx.status === 'rejected' ? 'Recusado' : 'Aguardando Confirmação'}
                  </p>
                </div>
                {tx.sellerId === user.id && tx.status === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleConfirm(tx.id, 'confirmed')} className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleConfirm(tx.id, 'rejected')} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-xl shadow-2xl overflow-hidden border border-white/5 animate-scale-in">
            <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Registrar Negócio</h3>
                <p className="text-[10px] font-black text-[#F67C01] tracking-widest mt-1 uppercase">O vendedor precisará confirmar</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
            </div>
            <form onSubmit={handleCreateTransaction} className="p-10 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 text-left">Nome da Empresa / Vendedor</label>
                <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.sellerName} onChange={e => setFormData({...formData, sellerName: e.target.value})} placeholder="Ex: Agência XYZ" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 text-left">Valor da Compra (R$)</label>
                <input required type="number" step="0.01" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="Ex: 1500.00" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 text-left">Descrição do Serviço/Produto</label>
                <textarea required rows={3} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-medium text-sm dark:text-white resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Ex: Criação de identidade visual..." />
              </div>
              <button type="submit" disabled={isSaving} className="w-full bg-[#F67C01] text-white font-black py-5 rounded-[2rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-orange-600 transition-all">
                {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'ENVIAR PARA CONFIRMAÇÃO'}
              </button>
            </form>
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
        <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">🏅 NÍVEIS DO MENU CLUB</h2>
        <p className="text-slate-500 font-medium">Sua jornada de crescimento e autoridade dentro do ecossistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {levels.map((level, i) => (
          <div key={i} className={`bg-white dark:bg-zinc-900 rounded-[3rem] p-8 border-2 shadow-sm transition-all flex flex-col ${user.level.toLowerCase() === level.name.toLowerCase() ? 'border-brand-primary ring-8 ring-brand-primary/5 scale-105 z-10' : 'border-gray-100 dark:border-zinc-800 opacity-60'}`}>
            <div className={`w-14 h-14 rounded-2xl ${level.color} mb-6 flex items-center justify-center text-white shadow-xl`}>
                <Award className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic mb-1">{level.name}</h3>
            <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-2">{level.points} pts</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-4">{level.criteria}</p>
            
            <p className="text-sm font-black text-indigo-600 dark:text-indigo-400 italic mb-6">"{level.description}"</p>
            
            <ul className="space-y-4 flex-1">
                {level.benefits.map((b, j) => (
                  <li key={j} className="flex gap-3 text-xs font-medium text-gray-500 dark:text-zinc-400">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> {b}
                  </li>
                ))}
            </ul>
            {user.level.toLowerCase() === level.name.toLowerCase() && (
              <div className="mt-10 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 py-3 rounded-2xl text-center font-black text-[10px] uppercase tracking-widest">
                  NÍVEL ATIVO
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const MissionsView = () => {
  const missions = [
    { title: 'Indicação Plano Básico', desc: 'Traga um novo membro no plano Básico.', pts: pointsRules.indicacaoBasico, icon: Users },
    { title: 'Indicação Plano PRO', desc: 'Traga um novo membro no plano PRO.', pts: pointsRules.indicacaoPro, icon: Crown },
    { title: 'Compras na Vitrine', desc: 'A cada R$ 1,00 em compras = 1 ponto.', pts: `${pointsRules.compraVitrine}:1`, icon: ShoppingBag },
    { title: 'Login Diário', desc: 'Acesse a plataforma diariamente.', pts: pointsRules.loginDiario, icon: Clock },
    { title: 'Publicação no Blog', desc: 'Publique um novo artigo no blog.', pts: pointsRules.publicacaoBlog, icon: Sparkles },
    { title: 'Fechar Negócio', desc: 'Feche um negócio B2B na plataforma.', pts: pointsRules.fecharNegocio, icon: Handshake }
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] p-10 md:p-16 border border-gray-100 dark:border-zinc-800 shadow-xl space-y-12 animate-fade-in">
       <div className="flex justify-between items-end">
          <div>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">📊 PONTOS</h3>
            <p className="text-slate-500 font-medium mt-1">Os pontos determinam seu nível e ranking no ecossistema.</p>
          </div>
          <div className="bg-gray-50 dark:bg-zinc-800 px-6 py-3 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
             Simples. Claro. Objetivo.
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {missions.map((m, i) => (
             <div key={i} className="group p-8 bg-gray-50/50 dark:bg-zinc-800/40 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 flex items-center justify-between hover:bg-white dark:hover:bg-zinc-800 hover:shadow-xl transition-all cursor-pointer">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                      <m.icon className="w-7 h-7" />
                   </div>
                   <div>
                      <h4 className="font-black text-gray-900 dark:text-white text-lg leading-tight">{m.title}</h4>
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

const RankingView = () => {
  const [ranking, setRanking] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRanking();
  }, []);

  const loadRanking = async () => {
    setIsLoading(true);
    try {
      const data = await supabaseService.getRanking(10);
      setRanking(data);
    } catch (error) {
      console.error("Error loading ranking:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
       {/* Info Section */}
       <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 md:p-12 border border-gray-100 dark:border-zinc-800 shadow-xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl text-yellow-600">
                      <Medal className="w-6 h-6" />
                   </div>
                   <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">🥇 Ranking Oficial</h3>
                </div>
                <div className="space-y-3">
                   {[
                     "Atualização mensal",
                     rankingRules.top10Badge ? "Top 10 maiores pontuadores recebem badge especial" : "Top 5 maiores pontuadores",
                     rankingRules.top3Highlight ? "Top 3 ganham destaque na plataforma" : "Reconhecimento público"
                   ].map((text, i) => (
                     <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700 dark:text-zinc-300">
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> {text}
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-gray-50 dark:bg-zinc-800/50 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 space-y-6">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Divulgação:</p>
                <div className="grid grid-cols-2 gap-4">
                   {[
                     "Plataforma",
                     "Instagram",
                     "Eventos",
                     "Newsletter"
                   ].map((text, i) => (
                     <div key={i} className="flex items-center gap-2 text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-tight">
                        <div className="w-1.5 h-1.5 bg-brand-primary rounded-full"></div>
                        {text}
                     </div>
                   ))}
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-zinc-700">
                   <p className="text-sm font-black text-gray-900 dark:text-white italic">"Reconhecimento é combustível de movimento."</p>
                </div>
             </div>
          </div>
       </div>

       {/* List Section */}
       <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] p-10 md:p-16 border border-gray-100 dark:border-zinc-800 shadow-xl space-y-10">
          <div className="flex items-center gap-4">
             <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl text-yellow-600">
                <Medal className="w-8 h-8" />
             </div>
             <div>
               <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Ranking Regional</h3>
               <p className="text-slate-500 font-medium">Os empreendedores mais influentes da rede.</p>
             </div>
          </div>

          <div className="space-y-4">
             {isLoading ? (
               <div className="space-y-4">
                 {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 dark:bg-zinc-800 rounded-3xl animate-pulse"></div>)}
               </div>
             ) : ranking.length === 0 ? (
               <div className="py-20 text-center">
                 <p className="text-slate-400 font-bold uppercase tracking-widest">Nenhum dado de ranking disponível.</p>
               </div>
             ) : (
               ranking.map((user, i) => (
                  <div key={i} className={`flex items-center justify-between p-6 rounded-[2rem] border ${i === 0 ? 'bg-yellow-50/50 border-yellow-100 scale-105 shadow-lg' : 'bg-gray-50/50 border-gray-100'}`}>
                     <div className="flex items-center gap-6">
                        <span className="font-black text-xl italic text-slate-300 w-6">#{i+1}</span>
                        <img src={user.avatar} className="w-12 h-12 rounded-xl shadow-md" alt="Avatar" />
                        <div>
                           <h4 className="font-black text-gray-900 leading-none">{user.name}</h4>
                           <p className="text-[10px] font-black text-indigo-600 uppercase mt-1">{user.business}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <span className="font-black text-gray-900">{user.pts} <span className="text-[10px] text-slate-400">PTS</span></span>
                        <ArrowUp className="w-4 h-4 text-emerald-500" />
                     </div>
                  </div>
               ))
             )}
          </div>
       </div>
    </div>
  );
};
