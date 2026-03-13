
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { B2BOffer } from '../types';
import { 
  Handshake, Plus, ShieldCheck, Zap, 
  MessageCircle, Lock, Crown, 
  X, RefreshCw, Home as HomeIcon, Search, ArrowRight,
  Star, ArrowUpRight
} from 'lucide-react';
import { SectionLanding } from '../components/SectionLanding';

export const MarketplaceB2B: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'browse' | 'my-deals'>('home');
  const [offers, setOffers] = useState<B2BOffer[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Create Opportunity Form
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: '',
    category: 'Serviços',
    terms: ''
  });

  useEffect(() => { 
    loadOffers(); 
    if (user) {
      supabaseService.getProfile(user.id).then(setProfile);
    }
  }, [user]);

  const loadOffers = async () => {
    setIsLoading(true);
    try {
      const data = await supabaseService.getB2BOffers();
      setOffers(data);
    } finally { setIsLoading(false); }
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      const newOffer = await supabaseService.createB2BOffer({
        ...formData,
        user_id: user.id,
        business_name: profile?.business_name || user.name,
        businessLogo: profile?.logo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`,
        created_at: new Date().toISOString()
      } as any);
      setOffers([newOffer, ...offers]);
      setIsModalOpen(false);
      setFormData({ title: '', description: '', discount: '', category: 'Serviços', terms: '' });
      // Redireciona para a aba de Match (Browse) após salvar com sucesso
      setActiveTab('browse');
    } finally { setIsSaving(false); }
  };

  const filteredOffers = offers.filter(o => 
    o.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.business_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4 px-4 animate-[fade-in_0.4s_ease-out]">
      {/* Header Estilo Unificado */}
      <div className="bg-[#0F172A] rounded-[3.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-indigo-500/10 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-xl">
                 <Handshake className="h-10 w-10 text-brand-primary" />
              </div>
              <div>
                 <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-2 italic uppercase">
                    Marketplace <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA]">B2B</span>
                 </h1>
                 <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">PARCERIAS E ACORDOS ENTRE EMPRESÁRIOS LOCAIS.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
               {user.plan === 'pro' || user.plan === 'full' ? (
                  <button onClick={() => setIsModalOpen(true)} className="bg-[#F67C01] text-white px-10 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
                      <Plus className="w-4 h-4" /> CRIAR OPORTUNIDADE
                  </button>
               ) : (
                  <div className="bg-white/5 backdrop-blur-md px-6 py-3 rounded-3xl border border-white/10 flex items-center gap-3">
                     <Crown className="w-5 h-5 text-yellow-400" />
                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Recurso Exclusivo Pro</span>
                  </div>
               )}
            </div>
          </div>

          <div className="flex p-1.5 mt-12 bg-white/5 backdrop-blur-md rounded-[2.2rem] border border-white/10 w-fit overflow-x-auto scrollbar-hide gap-1">
              {[
                  { id: 'home', label: 'INÍCIO', desc: 'Como funciona', icon: HomeIcon },
                  { id: 'browse', label: 'MATCH', desc: 'Ver acordos', icon: Zap },
                  { id: 'my-deals', label: 'MINHAS OPOR.', desc: 'Suas parcerias', icon: ShieldCheck }
              ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)} 
                    className={`flex flex-col items-center justify-center min-w-[130px] px-8 py-3 rounded-[1.6rem] transition-all duration-300 whitespace-nowrap ${activeTab === tab.id ? 'bg-[#F67C01] text-white shadow-xl scale-105' : 'text-slate-400 hover:bg-white/10'}`}
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
                title="Aumente seu lucro com parcerias inteligentes."
                subtitle="Business to Business Connect"
                description="O Marketplace B2B é o espaço exclusivo onde membros do ecossistema Menu ADS se conectam. Encontre oportunidades de crescimento mútuo."
                benefits={[
                "Acesse oportunidades agressivas em serviços essenciais.",
                "Crie redes de networking real com outros empresários.",
                "Capture clientes PJ (Pessoa Jurídica) sem custos de anúncio.",
                "Fortaleça a circulação de valor dentro da sua cidade.",
                "Exclusividade garantida: acordos visíveis apenas para membros."
                ]}
                youtubeId="dQw4w9WgXcQ"
                ctaLabel="BUSCAR MEU MATCH"
                onStart={() => setActiveTab('browse')}
                icon={Handshake}
                accentColor="indigo"
            />
        )}

        {activeTab === 'browse' && (
           <div className="space-y-10">
              <div className="max-w-xl mx-auto relative">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                 <input 
                    type="text" 
                    placeholder="Pesquisar parceiro ou serviço..." 
                    className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-3xl font-bold shadow-sm focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                 />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                 {isLoading ? (
                    [1,2,3].map(i => <div key={i} className="h-64 bg-gray-100 rounded-[2.5rem] animate-pulse"></div>)
                 ) : filteredOffers.length === 0 ? (
                    <div className="col-span-full py-20 text-center">
                       <p className="text-gray-400 font-bold uppercase tracking-widest">Nenhuma oportunidade disponível no momento.</p>
                    </div>
                 ) : filteredOffers.map(offer => (
                    <div key={offer.id} className="group bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative flex flex-col h-full overflow-hidden">
                       <div className="flex justify-between items-start mb-6">
                          <div className="w-14 h-14 rounded-2xl bg-indigo-50 overflow-hidden border-2 border-white shadow-md">
                             <img src={offer.businessLogo} className="w-full h-full object-cover" alt="Logo" />
                          </div>
                          <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1.5 rounded-xl border border-emerald-100 uppercase">
                             {offer.discount}
                          </span>
                       </div>
                       <div className="flex-1 space-y-3">
                          <h3 className="text-xl font-black text-gray-900 leading-tight line-clamp-1">{offer.title}</h3>
                          <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">{offer.business_name}</p>
                          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{offer.description}</p>
                       </div>
                       <button className="mt-8 w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all active:scale-95">
                          SOLICITAR MATCH <ArrowRight className="w-3 h-3" />
                       </button>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {activeTab === 'my-deals' && (
            <div className="py-20 text-center bg-white rounded-[3rem] border-4 border-dashed border-gray-100">
               <ShieldCheck className="w-20 h-20 text-slate-200 mx-auto mb-8" />
               <h4 className="text-xl font-black text-slate-400 uppercase tracking-widest">Nenhuma Oportunidade Resgatada</h4>
               <button onClick={() => setActiveTab('browse')} className="mt-6 text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline">Ver Oportunidades Ativas</button>
            </div>
        )}
      </div>

      {/* Modal Criar Oportunidade */}
      {isModalOpen && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="bg-white rounded-[3.5rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-white/5 animate-scale-in">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter">Criar Oportunidade B2B</h3>
                        <p className="text-[10px] font-black text-[#F67C01] tracking-widest mt-1 uppercase">Exclusivo para membros da rede</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={handleCreateOffer} className="p-10 space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Título da Oportunidade</label>
                        <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ex: 20% de Desconto em Consultoria Contábil" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Valor do Desconto</label>
                            <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} placeholder="Ex: 20% OFF ou R$ 100" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Categoria</label>
                            <select className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                <option>Serviços</option>
                                <option>Insumos</option>
                                <option>Tecnologia</option>
                                <option>Marketing</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Descrição Curta</label>
                        <textarea required rows={3} className="w-full bg-gray-50 border-none rounded-2xl p-5 font-medium text-sm resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="O que você está oferecendo para os parceiros?" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Termos e Condições</label>
                        <input type="text" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold" value={formData.terms} onChange={e => setFormData({...formData, terms: e.target.value})} placeholder="Ex: Válido apenas para novos contratos." />
                    </div>
                    <button type="submit" disabled={isSaving} className="w-full bg-[#F67C01] text-white font-black py-5 rounded-[2rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-orange-600 transition-all">
                        {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'PUBLICAR OPORTUNIDADE'}
                    </button>
                </form>
            </div>
         </div>
      )}
    </div>
  );
};
