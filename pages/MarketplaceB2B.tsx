
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { B2BOffer } from '../types';
import { 
  Handshake, Plus, ShieldCheck, Zap, 
  MessageCircle, Info, Lock, Crown, 
  X, Save, RefreshCw, Home as HomeIcon, Search
} from 'lucide-react';
import { SectionLanding } from '../components/SectionLanding';

export const MarketplaceB2B: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'browse' | 'my-deals'>('home');
  const [offers, setOffers] = useState<B2BOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: '',
    category: 'Serviços',
    terms: ''
  });

  useEffect(() => { loadOffers(); }, []);

  const loadOffers = async () => {
    setIsLoading(true);
    try {
      const data = await mockBackend.getB2BOffers();
      setOffers(data);
    } finally { setIsLoading(false); }
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      const newOffer = await mockBackend.createB2BOffer({
        ...formData,
        userId: user.id,
        businessName: 'Meu Negócio', // No mundo real pegaria do perfil
        businessLogo: `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
      });
      setOffers([newOffer, ...offers]);
      setIsModalOpen(false);
      setFormData({ title: '', description: '', discount: '', category: 'Serviços', terms: '' });
      setActiveTab('browse');
    } finally { setIsSaving(false); }
  };

  if (!user) return null;

  const filteredOffers = offers.filter(o => 
    o.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4 px-4">
      {/* Academy Style Header */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-indigo-950 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
                 <Handshake className="h-10 w-10 text-emerald-300" />
              </div>
              <div>
                 <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none mb-1">Marketplace B2B</h1>
                 <p className="text-emerald-200 text-lg font-medium opacity-80 uppercase tracking-widest text-xs">Parcerias exclusivas entre membros.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
               {user.plan === 'negocios' ? (
                  <button onClick={() => setIsModalOpen(true)} className="bg-white text-emerald-900 px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
                      <Plus className="w-4 h-4" /> Oferecer Benefício
                  </button>
               ) : (
                  <div className="bg-black/20 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10 flex items-center gap-3">
                     <Crown className="w-5 h-5 text-yellow-400" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Plano Negócios Exclusivo para Criar</span>
                  </div>
               )}
            </div>
        </div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <div className="flex justify-center">
        <div className="flex p-2 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-2xl max-w-fit mx-auto overflow-x-auto scrollbar-hide gap-1 md:gap-3">
            {[
                { id: 'home', label: 'COMO FUNCIONA', icon: HomeIcon },
                { id: 'browse', label: 'EXPLORAR ACORDOS', icon: Handshake },
                { id: 'my-deals', label: 'MEUS RESGATES', icon: ShieldCheck }
            ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)} 
                  className={`flex items-center justify-center gap-3 px-6 py-4 rounded-[1.8rem] font-black text-[10px] tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl scale-105' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
                >
                    <tab.icon className="w-4 h-4" /> <span className="hidden sm:inline">{tab.label}</span>
                </button>
            ))}
        </div>
      </div>

      <div className="animate-[fade-in_0.4s_ease-out]">
        {activeTab === 'home' && (
            <SectionLanding 
                title="Sua Empresa ganha mais com parcerias locais."
                subtitle="Business to Business Connect"
                description="O Marketplace B2B é o espaço onde membros do Menu ADS se ajudam. Economize em serviços essenciais para sua empresa e ofereça seus diferenciais para uma rede qualificada de empresários do bairro."
                benefits={[
                "Acesso a descontos de até 50% em serviços locais.",
                "Crie networking real com outros donos de negócio.",
                "Capture clientes PJ (Pessoa Jurídica) sem custo extra.",
                "Fortaleça a economia local circulando valor no bairro.",
                "Exclusividade: Acordos que só existem dentro desta rede."
                ]}
                youtubeId="dQw4w9WgXcQ"
                ctaLabel="VER OPORTUNIDADES"
                onStart={() => setActiveTab('browse')}
                icon={Handshake}
                accentColor="emerald"
            />
        )}

        {activeTab === 'browse' && (
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between px-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            className="w-full pl-12 pr-6 py-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 font-bold"
                            placeholder="Buscar parceiro ou serviço..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{filteredOffers.length} ofertas disponíveis</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                    {filteredOffers.map(offer => (
                        <div key={offer.id} className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 p-8 shadow-sm hover:shadow-xl transition-all group border-t-8 border-t-emerald-500">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-zinc-800 p-1 border border-gray-100 dark:border-zinc-700 overflow-hidden shadow-sm">
                                    <img src={offer.businessLogo} className="w-full h-full object-cover rounded-xl" />
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-900 dark:text-white leading-tight">{offer.businessName}</h4>
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{offer.category}</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="inline-flex px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/40">
                                    {offer.discount}
                                </div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">{offer.title}</h3>
                                <p className="text-gray-500 dark:text-zinc-400 text-sm leading-relaxed line-clamp-3 font-medium">{offer.description}</p>
                            </div>

                            <div className="pt-6 border-t border-gray-50 dark:border-zinc-800 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-amber-500">
                                    <Zap className="w-4 h-4 fill-current" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Exclusivo B2B</span>
                                </div>
                                <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2 active:scale-95">
                                    <MessageCircle className="w-4 h-4" /> RESGATAR
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'my-deals' && (
            <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-xl min-h-[400px] flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center text-gray-300 mb-6">
                    <Handshake className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Seu Histórico de Parcerias</h3>
                <p className="text-gray-500 dark:text-zinc-400 max-w-sm mt-2 font-medium">Você ainda não resgatou nenhum benefício B2B. Explore as oportunidades de parceiros locais agora!</p>
                <button onClick={() => setActiveTab('browse')} className="mt-8 bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-700">Explorar agora</button>
            </div>
        )}
      </div>

      {/* Modal: Create B2B Offer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-[scale-in_0.3s_ease-out]">
                <div className="bg-emerald-900 p-8 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-black tracking-tight">Oferecer Benefício B2B</h3>
                        <p className="text-emerald-200 font-medium text-sm">Crie um acordo exclusivo para outros empresários.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleCreateOffer} className="p-10 space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Título da Oferta</label>
                        <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white focus:ring-2 focus:ring-emerald-100" placeholder="Ex: 30% OFF em Consultoria Fiscal" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Desconto (Texto curto)</label>
                            <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white focus:ring-2 focus:ring-emerald-100" placeholder="Ex: 30% OFF ou R$ 100" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Categoria</label>
                            <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white focus:ring-2 focus:ring-emerald-100" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                <option>Serviços</option>
                                <option>Suprimentos</option>
                                <option>Consultoria</option>
                                <option>Alimentação</option>
                                <option>Outros</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Descrição do Benefício</label>
                        <textarea rows={3} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-medium text-sm dark:text-white focus:ring-2 focus:ring-emerald-100 resize-none" placeholder="O que sua empresa oferece para outras empresas do Menu ADS?" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Termos e Condições</label>
                        <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white focus:ring-2 focus:ring-emerald-100" placeholder="Ex: Apenas 1 uso por CNPJ" value={formData.terms} onChange={e => setFormData({...formData, terms: e.target.value})} />
                    </div>

                    <button type="submit" disabled={isSaving} className="w-full bg-emerald-600 text-white font-black py-6 rounded-[2rem] shadow-2xl uppercase tracking-[0.2em] text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                        {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} ATIVAR PARCERIA B2B
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
