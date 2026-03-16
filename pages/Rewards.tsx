
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { 
  Trophy, Gift, TrendingUp, Star,
  Zap, Crown, ChevronRight,
  CheckCircle, ListTodo, Medal, Home as HomeIcon,
  Award, Rocket, Users, ArrowUp, Sparkles, ShoppingBag, Clock,
  Ticket, Wand2, Handshake, Plus, Search, ArrowRight, X, RefreshCw, Shield, MessageCircle
} from 'lucide-react';
import { Prize, PointsTransaction, User, B2BOffer, B2BTransaction, Product } from '../types';
import { SectionLanding } from '../components/SectionLanding';
import { pointsRules, tiers, rankingRules } from '../config/gamificationConfig';

export const Rewards: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'acceleration' | 'missions' | 'match' | 'ranking'>('home');

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 pt-4 px-4">
      {/* Header Estilo Unificado Menu Club */}
      <div className="bg-[#0F172A] rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-indigo-500/10 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-xl">
                 <Trophy className="h-10 w-10 text-brand-primary" />
              </div>
              <div>
                 <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-2 overflow-visible">
                    Menu <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] italic uppercase title-fix">Club</span>
                 </h1>
                 <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">TRANSFORME SUA ATIVIDADE EM CRESCIMENTO REAL.</p>
              </div>
            </div>
            
            <div className="flex bg-white/5 backdrop-blur-xl p-2 rounded-[2.5rem] border border-white/10 shadow-2xl">
              <div className="flex items-center gap-8 px-8 py-3 border-r border-white/10">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-brand-primary uppercase tracking-[0.2em] mb-1">Seus Pontos</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-white leading-none">{user.points}</span>
                    <Zap className="w-4 h-4 text-brand-primary fill-current" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8 px-8 py-3">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1">Menu Cash</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-white leading-none">M$ {user.menu_cash?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex p-1.5 mt-12 bg-white/5 backdrop-blur-md rounded-[2.2rem] border border-white/10 w-fit overflow-x-auto scrollbar-hide gap-1">
              {[
                  { id: 'home', label: 'INÍCIO', desc: 'Destaques', icon: HomeIcon },
                  { id: 'missions', label: 'PONTOS', desc: 'Ganhar pontos', icon: ListTodo },
                  { id: 'match', label: 'MENU CASH', desc: 'Parcerias B2B', icon: Handshake },
                  { id: 'acceleration', label: 'NÍVEIS', desc: 'Sua autoridade', icon: Zap },
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
  const [activeSubTab, setActiveSubTab] = useState<'offers' | 'transactions' | 'rules'>('offers');
  const [menuCashProducts, setMenuCashProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [menuCashToUse, setMenuCashToUse] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { 
    loadData(); 
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const productsData = await supabaseService.getAllProducts();
      setMenuCashProducts(productsData.filter(p => p.accepts_menu_cash));
    } finally { 
      setIsLoading(false); 
    }
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !user) return;

    const maxMenuCash = (selectedProduct.price * (selectedProduct.menu_cash_percentage || 0)) / 100;
    if (menuCashToUse > maxMenuCash) {
      alert(`Você só pode usar até ${maxMenuCash.toFixed(2)} em Menu Cash para este produto.`);
      return;
    }

    if (menuCashToUse > (user.menu_cash || 0)) {
      alert("Saldo de Menu Cash insuficiente.");
      return;
    }

    setIsSaving(true);
    try {
      await supabaseService.createB2BTransaction({
        buyer_id: user.id,
        buyer_name: user.name,
        seller_id: selectedProduct.user_id,
        seller_name: 'Vendedor', // Idealmente buscar nome do perfil
        product_id: selectedProduct.id,
        total_amount: selectedProduct.price,
        menu_cash_amount: menuCashToUse,
        amount: selectedProduct.price - menuCashToUse,
        description: `Compra do item: ${selectedProduct.name}`,
        status: 'pending'
      });
      setIsPurchaseModalOpen(false);
      setSelectedProduct(null);
      setMenuCashToUse(0);
      setActiveSubTab('transactions');
    } catch (err) {
      console.error("Erro ao realizar compra:", err);
      alert("Erro ao processar compra.");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = menuCashProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-fade-in">
       <div className="bg-indigo-600 rounded-[3rem] p-10 md:p-12 text-white relative overflow-hidden shadow-xl mb-12">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="space-y-4 max-w-xl">
                <p className="text-indigo-100 font-medium pt-4">Descubra ofertas exclusivas que aceitam Menu Cash e movimente a economia colaborativa.</p>
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
                <button 
                   onClick={() => setActiveSubTab('rules')}
                   className={`px-8 py-4 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all ${activeSubTab === 'rules' ? 'bg-white text-indigo-600 shadow-2xl' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                   REGRAS
                </button>
             </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
       </div>

       {activeSubTab === 'offers' ? (
         <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
              <div className="w-full relative">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                 <input 
                    type="text" 
                    placeholder="Filtrar por nome do produto..." 
                    className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-3xl font-bold shadow-sm focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                 />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {isLoading ? (
                  [1,2,3,4].map(i => <div key={i} className="h-64 bg-gray-100 rounded-[2.5rem] animate-pulse"></div>)
               ) : filteredProducts.length === 0 ? (
                  <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                     <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                     <p className="text-gray-400 font-bold uppercase tracking-widest">Nenhum produto com Menu Cash encontrado.</p>
                  </div>
               ) : filteredProducts.map(prod => (
                  <div key={prod.id} className="group bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-3xl bg-gray-50 overflow-hidden mb-6 border border-gray-100">
                      <img src={prod.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <h4 className="font-black text-gray-900 text-lg uppercase italic mb-1 truncate w-full">{prod.name}</h4>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4">Aceita {prod.menu_cash_percentage}% Menu Cash</p>
                    
                    <div className="w-full pt-4 border-t border-gray-50 flex justify-between items-center mb-6">
                       <span className="text-[10px] font-black uppercase text-slate-400">Preço</span>
                       <span className="text-xl font-black text-brand-primary">R$ {prod.price.toFixed(2)}</span>
                    </div>

                    <button 
                      onClick={() => { setSelectedProduct(prod); setIsPurchaseModalOpen(true); }}
                      className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-primary transition-all active:scale-95 shadow-lg"
                    >
                       COMPRAR AGORA <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
               ))}
            </div>
         </>
       ) : activeSubTab === 'transactions' ? (
         <B2BTransactionsView user={user} />
       ) : (
         <div className="bg-white rounded-[3.5rem] shadow-xl overflow-hidden border border-gray-100 animate-fade-in">
             <div className="bg-[#0F172A] p-10 text-white">
                 <h3 className="text-3xl font-black uppercase italic tracking-tighter">💰 REGRAS MENU CASH</h3>
                 <p className="text-xs font-black text-brand-primary tracking-[0.2em] mt-2 uppercase">A moeda interna do ecossistema</p>
             </div>
             
             <div className="p-10 md:p-16 space-y-16">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                     <div className="space-y-6">
                         <div className="flex items-center gap-4">
                             <div className="p-4 bg-indigo-50 rounded-[1.5rem] text-indigo-600 shadow-sm">
                                 <Zap className="w-8 h-8 fill-current" />
                             </div>
                             <h4 className="text-2xl font-black text-gray-900 uppercase italic leading-none">A MOEDA INTERNA</h4>
                         </div>
                         <p className="text-slate-600 font-medium text-lg leading-relaxed">
                           O Menu Club funciona com uma moeda interna chamada Menu Cash. O dinheiro continua circulando dentro da rede, criando retenção e prosperidade coletiva.
                         </p>
                         
                         <div className="bg-indigo-50/50 p-8 rounded-[2rem] border border-indigo-100/50">
                            <h5 className="font-black text-indigo-900 uppercase italic mb-4">Cashback por Nível:</h5>
                            <div className="grid grid-cols-2 gap-4">
                               {[
                                 { label: 'Bronze', val: '5%' },
                                 { label: 'Prata', val: '10%' },
                                 { label: 'Ouro', val: '15%' },
                                 { label: 'Diamante', val: '20%' }
                               ].map((lvl, i) => (
                                 <div key={i} className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center">
                                   <span className="font-bold text-slate-500 uppercase text-xs">{lvl.label}</span>
                                   <span className="font-black text-indigo-600">{lvl.val}</span>
                                 </div>
                               ))}
                            </div>
                         </div>
                     </div>

                     <div className="bg-gray-50/80 p-10 rounded-[3rem] border border-gray-100 space-y-8">
                         <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Regras de Utilização</h4>
                         <ul className="space-y-8">
                            {[
                              { text: "Uso Exclusivo", desc: "O Menu Cash só pode ser utilizado para adquirir produtos e serviços de outros membros dentro da nossa plataforma." },
                              { text: "Limite de Utilização", desc: "Você pode utilizar até 20% do valor de uma compra (conforme limite do vendedor) usando seu saldo disponível." },
                              { text: "Saldo e Plano", desc: "Seu saldo é válido e utilizável enquanto seu plano estiver ativo no Menu Club." },
                              { text: "Acúmulo por Autoridade", desc: "O Menu Cash é um percentual que vem dos seus Pontos de Autoridade ganhos em missões." }
                            ].map((item, i) => (
                              <li key={i} className="flex gap-5">
                                 <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-indigo-600 font-black shrink-0 border border-gray-50">{i+1}</div>
                                 <div>
                                     <p className="font-black text-gray-900 uppercase italic text-base mb-1">{item.text}</p>
                                     <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                 </div>
                              </li>
                            ))}
                         </ul>
                     </div>
                 </div>

                 {/* Exemplo Prático */}
                 <div className="pt-10 border-t border-gray-100">
                    <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-[3rem] p-10 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="text-2xl font-black uppercase italic mb-8 flex items-center gap-3">
                                <Sparkles className="w-6 h-6 text-brand-primary" /> Exemplo Prático
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
                                <div className="space-y-2">
                                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Produto</p>
                                    <p className="text-xl font-black">Consultoria VIP</p>
                                    <p className="text-3xl font-black text-brand-primary">R$ 1.000,00</p>
                                </div>
                                <div className="flex justify-center">
                                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                                        <ArrowRight className="w-8 h-8 text-brand-primary" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/10">
                                        <p className="text-emerald-400 font-black text-lg">M$ 200,00 usados</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">(20% do valor)</p>
                                    </div>
                                    <div className="bg-brand-primary p-5 rounded-2xl shadow-xl">
                                        <p className="font-black text-xl">R$ 800,00 pagos</p>
                                        <p className="text-[10px] text-white/80 uppercase font-bold">em dinheiro real</p>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-10 text-center text-slate-400 font-medium italic">"Isso cria circulação de riqueza e retenção dentro da rede."</p>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                    </div>
                 </div>
             </div>
         </div>
       )}

        {/* MODAL: COMPRA DE PRODUTO */}
        {isPurchaseModalOpen && selectedProduct && (
           <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
              <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in">
                  <div className="bg-[#0F172A] p-6 text-white flex justify-between items-center">
                      <div>
                          <h3 className="text-xl font-black uppercase italic tracking-tighter">Finalizar Compra</h3>
                          <p className="text-[9px] font-black text-emerald-400 tracking-widest mt-0.5 uppercase">Use seu saldo Menu Cash</p>
                      </div>
                      <button onClick={() => setIsPurchaseModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X className="w-6 h-6" /></button>
                  </div>
                  <form onSubmit={handlePurchase} className="p-8 space-y-6">
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-sm shrink-0">
                          <img src={selectedProduct.image_url} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-gray-900 uppercase italic line-clamp-1 leading-tight">{selectedProduct.name}</h4>
                          <p className="text-xl font-black text-brand-primary">R$ {selectedProduct.price.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Meu Saldo</p>
                          <p className="text-xl font-black text-indigo-900">M$ {user.menu_cash?.toFixed(2) || '0.00'}</p>
                        </div>
                        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Limite de Uso</p>
                          <p className="text-xl font-black text-emerald-900">{selectedProduct.menu_cash_percentage}% (R$ {(selectedProduct.price * (selectedProduct.menu_cash_percentage || 0) / 100).toFixed(2)})</p>
                        </div>
                      </div>

                      <div>
                          <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 text-left">Quanto Menu Cash deseja usar?</label>
                          <input 
                            required 
                            type="number" 
                            step="0.01" 
                            max={(selectedProduct.price * (selectedProduct.menu_cash_percentage || 0) / 100)}
                            className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-base" 
                            value={menuCashToUse} 
                            onChange={e => setMenuCashToUse(Number(e.target.value))} 
                            placeholder="M$ 0.00" 
                          />
                      </div>

                      <div className="bg-indigo-600 p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
                        <div className="relative z-10 flex justify-between items-center">
                          <div>
                            <span className="text-[9px] font-black text-indigo-200 uppercase tracking-[0.2em] block mb-1">Total com Desconto</span>
                            <span className="text-2xl font-black text-white italic">R$ {(selectedProduct.price - menuCashToUse).toFixed(2)}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-black text-indigo-200 uppercase tracking-[0.2em] block mb-1">Economia</span>
                            <span className="text-lg font-black text-emerald-400">- M$ {menuCashToUse.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                      </div>

                      <button type="submit" disabled={isSaving} className="w-full bg-gray-900 text-white font-black py-6 rounded-[2.5rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-brand-primary transition-all active:scale-95">
                          {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'CONFIRMAR COMPRA'}
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
    seller_name: '',
    amount: '',
    description: ''
  });
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [transactionToReject, setTransactionToReject] = useState<string | null>(null);

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
        buyer_id: user.id,
        buyer_name: user.name,
        seller_id: 'mock_seller_id', // Na vida real, selecionaria o usuário
        seller_name: formData.seller_name,
        amount: parseFloat(formData.amount),
        description: formData.description
      });
      setTransactions(prev => [newTx, ...prev]);
      setIsModalOpen(false);
      setFormData({ seller_name: '', amount: '', description: '' });
    } catch (err) {
      console.error("Erro ao registrar:", err);
      alert("Erro ao registrar transação.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirm = async (id: string, isBuyer: boolean) => {
    setIsSaving(true);
    try {
      await supabaseService.confirmB2BTransaction(id, user.id, isBuyer);
      await loadTransactions();
    } catch (err) {
      console.error("Erro ao confirmar:", err);
      alert("Erro ao confirmar.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReject = async (id: string) => {
    setTransactionToReject(id);
    setIsRejectionModalOpen(true);
  };

  const confirmRejection = async () => {
    if (!transactionToReject) return;
    setIsSaving(true);
    try {
      await supabaseService.updateB2BTransactionStatus(transactionToReject, 'rejected');
      await loadTransactions();
      setIsRejectionModalOpen(false);
      setTransactionToReject(null);
    } catch (err) {
      console.error("Erro ao recusar:", err);
      alert("Erro ao recusar.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black uppercase italic tracking-tighter">Minhas Transações</h3>
          <p className="text-slate-500 font-medium text-sm">Histórico de compras e vendas utilizando Menu Cash.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-3xl animate-pulse"></div>)}
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
          <Handshake className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-gray-400 font-bold uppercase tracking-widest">Nenhuma transação registrada ainda.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map(tx => (
            <div key={tx.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${tx.status === 'confirmed' ? 'bg-emerald-500' : tx.status === 'rejected' ? 'bg-red-500' : 'bg-orange-500'}`}>
                  {tx.status === 'confirmed' ? <CheckCircle className="w-6 h-6" /> : tx.status === 'rejected' ? <X className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-lg">
                    {tx.buyer_id === user.id ? `Compra de ${tx.seller_name}` : `Venda para ${tx.buyer_name}`}
                  </h4>
                  <div className="flex flex-col gap-1 mt-1">
                    <p className="text-xs text-slate-500 font-medium">{tx.description}</p>
                    <p className="text-[10px] text-indigo-600 font-black uppercase">
                      {new Date(tx.created_at).toLocaleDateString()} às {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right flex items-center gap-6">
                <div className="space-y-1">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total</span>
                    <p className="text-lg font-black text-gray-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tx.total_amount || tx.amount)}
                    </p>
                  </div>
                  {tx.menu_cash_amount && tx.menu_cash_amount > 0 && (
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">M$ {tx.menu_cash_amount.toFixed(2)}</span>
                    </div>
                  )}
                  <p className={`text-[10px] font-black uppercase tracking-widest ${tx.status === 'confirmed' ? 'text-emerald-500' : tx.status === 'rejected' ? 'text-red-500' : 'text-orange-500'}`}>
                    {tx.status === 'confirmed' ? 'Confirmado' : tx.status === 'rejected' ? 'Recusado' : 'Aguardando Aprovação'}
                  </p>
                </div>
                
                {tx.status === 'pending' && (
                  <div className="flex flex-col gap-2">
                    {/* Botão de Confirmação Individual */}
                    {((tx.buyer_id === user.id && !tx.buyer_confirmed) || (tx.seller_id === user.id && !tx.seller_confirmed)) ? (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleConfirm(tx.id, tx.buyer_id === user.id)}
                          className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] uppercase hover:bg-emerald-100 transition-all flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" /> EFETIVAR
                        </button>
                        <button 
                          onClick={() => handleReject(tx.id)}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-black text-[10px] uppercase hover:bg-red-100 transition-all flex items-center gap-2"
                        >
                          <X className="w-4 h-4" /> RECUSAR
                        </button>
                      </div>
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 text-slate-400 rounded-xl font-black text-[10px] uppercase italic">
                        Aguardando outro lado...
                      </div>
                    )}
                  </div>
                )}

                {tx.status === 'confirmed' && (
                  <div className="flex flex-col gap-2">
                    {(() => {
                      const otherPartyPhone = tx.buyer_id === user.id 
                        ? (tx as any).seller?.phone 
                        : (tx as any).buyer?.phone;
                      
                      if (!otherPartyPhone) return null;

                      // Limpar o número para o link do WhatsApp (remover caracteres não numéricos)
                      const cleanPhone = otherPartyPhone.replace(/\D/g, '');
                      
                      return (
                        <a 
                          href={`https://wa.me/55${cleanPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                        >
                          <MessageCircle className="w-4 h-4" /> WHATSAPP
                        </a>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: CONFIRMAÇÃO DE RECUSA */}
      {isRejectionModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-scale-in">
            <div className="bg-red-600 p-8 text-white text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/30">
                <X className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">Recusar Transação</h3>
              <p className="text-sm font-bold text-red-100 mt-2">Esta ação é irreversível e o saldo de Menu Cash será estornado imediatamente.</p>
            </div>
            <div className="p-8 space-y-4">
              <button 
                onClick={confirmRejection}
                disabled={isSaving}
                className="w-full bg-red-600 text-white font-black py-5 rounded-2xl shadow-xl uppercase tracking-widest text-sm hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                {isSaving ? <RefreshCw className="animate-spin w-5 h-5" /> : 'SIM, RECUSAR AGORA'}
              </button>
              <button 
                onClick={() => { setIsRejectionModalOpen(false); setTransactionToReject(null); }}
                className="w-full bg-gray-100 text-slate-500 font-black py-5 rounded-2xl uppercase tracking-widest text-sm hover:bg-gray-200 transition-all"
              >
                CANCELAR
              </button>
            </div>
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
        <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">🏅 NÍVEIS DO MENU CLUB</h2>
        <p className="text-slate-500 font-medium">Sua jornada de crescimento e autoridade dentro do ecossistema.</p>
      </div>

      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        {levels.map((level, i) => {
          const isCurrentLevel = user.level.toLowerCase() === level.name.toLowerCase();
          return (
            <div 
              key={i} 
              className={`group bg-white rounded-[2.5rem] p-8 md:p-10 border shadow-sm transition-all flex flex-col md:flex-row gap-8 items-start md:items-center relative overflow-hidden ${
                isCurrentLevel 
                ? 'border-brand-primary ring-8 ring-brand-primary/5 scale-[1.02] shadow-xl z-10' 
                : 'border-gray-100 opacity-80 hover:opacity-100 hover:border-gray-200 shadow-sm'
              }`}
            >
              {/* Background accent for current level */}
              {isCurrentLevel && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-bl-full -z-10 animate-pulse"></div>
              )}

              {/* Level Badge and Info */}
              <div className="flex items-center gap-6 md:w-1/3 shrink-0">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[2rem] ${level.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <Award className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900 uppercase italic leading-tight">{level.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                    <p className="text-[11px] font-black text-brand-primary uppercase tracking-widest">{level.points} pts</p>
                    <span className="hidden sm:inline text-gray-300">|</span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{level.criteria}</p>
                  </div>
                </div>
              </div>

              {/* Description and Benefits */}
              <div className="flex-1 space-y-4">
                <p className="text-base font-black text-indigo-600 italic">"{level.description}"</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                    {level.benefits.map((b, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs font-medium text-gray-500">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> {b}
                      </div>
                    ))}
                </div>
              </div>

              {/* Status */}
              <div className="md:w-32 shrink-0 flex justify-end w-full md:w-auto">
                {isCurrentLevel ? (
                  <div className="bg-emerald-100 text-emerald-700 px-6 py-3 rounded-2xl text-center font-black text-[10px] uppercase tracking-widest border border-emerald-200 backdrop-blur-sm w-full md:w-auto flex items-center justify-center gap-2">
                    <Zap className="w-3 h-3 fill-current" /> ATIVO
                  </div>
                ) : (
                  <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic group-hover:text-slate-400 transition-colors hidden md:block">
                    BLOQUEADO
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MissionsView = () => {
  const missions = [
    { title: 'Indicação Plano Básico', desc: 'Traga um novo membro no plano Básico.', pts: pointsRules.indicacaoBasico, icon: Users },
    { title: 'Indicação Plano PRO', desc: 'Traga um novo membro no plano PRO.', pts: pointsRules.indicacaoPro, icon: Crown },
    { title: 'Compras no Menu Store', desc: 'A cada R$ 1,00 em compras = 1 ponto.', pts: `${pointsRules.compraMenuStore}:1`, icon: ShoppingBag },
    { title: 'Login Diário', desc: 'Acesse a plataforma diariamente.', pts: pointsRules.loginDiario, icon: Clock },
    { title: 'Pontos extras', desc: 'Participação em eventos, campanhas e outros.', pts: pointsRules.pontosExtras, icon: Sparkles }
  ];

  return (
    <div className="bg-white rounded-[3.5rem] p-10 md:p-16 border border-gray-100 shadow-xl space-y-12 animate-fade-in">
       <div className="flex justify-between items-end">
          <div>
            <h3 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">📊 PONTOS</h3>
            <p className="text-slate-500 font-medium mt-1">Os pontos determinam seu nível e ranking no ecossistema.</p>
          </div>
          <div className="bg-gray-50 px-6 py-3 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
             Simples. Claro. Objetivo.
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {missions.map((m, i) => (
             <div key={i} className="group p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 flex items-center justify-between hover:bg-white hover:shadow-xl transition-all cursor-pointer">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                      <m.icon className="w-7 h-7" />
                   </div>
                   <div>
                      <h4 className="font-black text-gray-900 text-lg leading-tight">{m.title}</h4>
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
       <div className="bg-white rounded-[3rem] p-10 md:p-12 border border-gray-100 shadow-xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <div className="p-3 bg-yellow-50 rounded-2xl text-yellow-600">
                      <Medal className="w-6 h-6" />
                   </div>
                   <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">🥇 Ranking Oficial</h3>
                </div>
                <div className="space-y-3">
                   {[
                     "Atualização mensal",
                     rankingRules.top10Badge ? "Top 10 maiores pontuadores recebem badge especial" : "Top 5 maiores pontuadores",
                     rankingRules.top3Highlight ? "Top 3 ganham destaque na plataforma" : "Reconhecimento público"
                   ].map((text, i) => (
                     <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> {text}
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 space-y-6">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Divulgação:</p>
                <div className="grid grid-cols-2 gap-4">
                   {[
                     "Plataforma",
                     "Instagram",
                     "Eventos",
                     "Newsletter"
                   ].map((text, i) => (
                     <div key={i} className="flex items-center gap-2 text-xs font-black text-gray-500 uppercase tracking-tight">
                        <div className="w-1.5 h-1.5 bg-brand-primary rounded-full"></div>
                        {text}
                     </div>
                   ))}
                </div>
                <div className="pt-4 border-t border-gray-200">
                   <p className="text-sm font-black text-gray-900 italic">"Reconhecimento é combustível de movimento."</p>
                </div>
             </div>
          </div>
       </div>

       {/* List Section */}
       <div className="bg-white rounded-[3.5rem] p-10 md:p-16 border border-gray-100 shadow-xl space-y-10">
          <div className="flex items-center gap-4">
             <div className="p-4 bg-yellow-50 rounded-2xl text-yellow-600">
                <Medal className="w-8 h-8" />
             </div>
             <div>
               <h3 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Ranking</h3>
               <p className="text-slate-500 font-medium">Os empreendedores mais influentes da rede.</p>
             </div>
          </div>

          <div className="space-y-4">
             {isLoading ? (
               <div className="space-y-4">
                 {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-3xl animate-pulse"></div>)}
               </div>
             ) : ranking.length === 0 ? (
               <div className="py-20 text-center">
                 <p className="text-slate-400 font-bold uppercase tracking-widest">Nenhum dado de ranking disponível.</p>
               </div>
             ) : (
               ranking.map((member, i) => (
                   <div key={member.user_id || i} className={`flex items-center justify-between p-6 rounded-[2rem] border ${i === 0 ? 'bg-yellow-50/50 border-yellow-100 scale-105 shadow-lg' : 'bg-gray-50/50 border-gray-100'}`}>
                      <div className="flex items-center gap-6">
                         <span className="font-black text-xl italic text-slate-300 w-6">#{i+1}</span>
                         <img src={member.logo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${member.business_name || member.name || 'U'}`} className="w-12 h-12 rounded-xl shadow-md object-cover" alt="Avatar" />
                         <div>
                            <h4 className="font-black text-gray-900 leading-none">{member.business_name || member.name || 'Membro'}</h4>
                            <p className="text-[10px] font-black text-indigo-600 uppercase mt-1">{member.city || member.level || ''}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className="font-black text-gray-900">{member.points || 0} <span className="text-[10px] text-slate-400">PTS</span></span>
                         {i < 3 && <Crown className="w-4 h-4 text-yellow-500 fill-current" />}
                      </div>
                   </div>
                ))
             )}
          </div>
       </div>
    </div>
  );
};
